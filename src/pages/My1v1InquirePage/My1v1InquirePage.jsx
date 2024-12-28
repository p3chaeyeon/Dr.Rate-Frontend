import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Stomp } from '@stomp/stompjs';
import { parseJwt } from "src/utils/jwt";
import useModal from 'src/hooks/useModal';
import styles from './My1v1InquirePage.module.scss';
import { PATH } from "src/utils/path";
import MyNav from 'src/components/MyNav';
import AlertModal from 'src/components/Modal/AlertModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';
import spinner from 'src/assets/icons/spinner.gif';
import api from 'src/apis/axiosInstanceAPI';



const My1v1InquirePage = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("Authorization");
    const userId = parseJwt(token)?.id;  // access token을 parse하여 id값 가져옴
    const phoneScreenRef = useRef(null);  // 스크롤 처리를 위한 ref
    const [messages, setMessages] = useState([]); // 메세지 데이터 저장
    const [page, setPage] = useState(0);  // 현재 페이지 상태
    const [isLastPage, setIsLastPage] = useState(false); // 마지막 페이지 여부 상태
    const [inputMessage, setInputMessage] = useState(""); // 메시지 입력 필드 상태
    const [stompClient, setStompClient] = useState(null); // WebSocket STOMP 클라이언트 상태
    const [isDragging, setIsDragging] = useState(false); // 드래그 상태

    const [isLoading, setLoading] = useState(false)


    const {
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    } = useModal();


    /* 이벤트 처리 영역 */

    // page가 변경될 때 메시지 데이터를 가져옴
    useEffect(() => {
        fetchMessages(page);
    }, [page])

    // messages 상태가 변경될 때마다 화면을 스크롤하여 최신 메시지로 이동
    useEffect(() => {
        const phoneScreen = phoneScreenRef.current;

        if (phoneScreen && page === 0) { // 페이지가 처음 로드될 때만 맨 아래로 스크롤
            phoneScreen.scrollTop = phoneScreen.scrollHeight;
        }
    }, [messages, page]); // messages와 page가 변경될 때 실행


    // 스크롤이 맨 위에 도달했을 때 페이지를 증가시켜 이전 메시지를 가져옴
    const handleScroll = () => {
        const phoneScreen = phoneScreenRef.current;
        if (phoneScreen && phoneScreen.scrollTop === 0 && !isLastPage) {
            setPage(prevPage => prevPage + 1); // 다음 페이지 로드
        }
    };


    // 입력 메시지를 STOMP 클라이언트를 통해 서버로 전송
    const handleSendMessage = () => {
        if (inputMessage.trim() === "" || !stompClient) return;

        const messagePayload = {
            senderId: userId,
            content: inputMessage
        };

        // WebSocket 메시지 발행
        stompClient.send(
            `/pub/chat/room/${userId}`,
            { Authorization: `Bearer ${token}` },
            JSON.stringify(messagePayload)
        );

        setInputMessage(""); // 입력창 초기화
    };

    // Enter 키 입력 시 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    /* 드래그 이벤트 */
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true); // 드래그 상태 활성화
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 비활성화
    };


    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false); // 드래그 상태 비활성화

        const file = e.dataTransfer.files[0]; // 드롭된 파일 가져오기
        if (file) {
            openConfirmModal(
                "파일 업로드",
                `파일명: ${file.name}, 크기: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                () => {
                    handleFileUpload(file); // 파일 업로드 로직 실행
                    closeConfirmModal();
                },
                () => closeConfirmModal()
            );
        }
    };

    // 이미지를 클릭했을 때 모달에 표시
    const handleImageClick = (imageUrl) => {
        openAlertModal("이미지 보기", { type: "image", content: imageUrl });
    };


    /* Api 처리 영역 */

    // Websocket 연결
    useEffect(() => {
            if (!token) {
                console.error("WebSocket 연결 실패: 토큰이 없습니다.");
                return;
            }
    
            let retries = 100; // Kafka 토픽 준비를 위한 최대 재시도 횟수
            let isActive = true; // 컴포넌트가 활성화 상태인지 확인
        
            const connectWebSocket = () => {
                const socket = new WebSocket(`${PATH.SERVER}/ws`);
                const client = Stomp.over(socket);
        
                client.connect(
                    { Authorization: `Bearer ${token}` },
                    () => {
                        console.log("WebSocket connected");
        
                        const checkTopicAndSubscribe = async () => {
                            while (isActive && retries > 0) { // 컴포넌트가 활성화된 경우에만 실행
                                try {
                                    const response = await api.get(`/api/topic/check/chat-room-${userId}`);
                                    
                                    if (response.data.success === true) {
                                        setLoading(true);
                                        console.log("Kafka topic ready, subscribing...");                                    
                                        client.subscribe(`/sub/chat/room/${userId}`, (message) => {
                                            console.log("message : "+message)
                                            const newMessage = JSON.parse(message.body);
                                            setMessages((prevMessages) => [...prevMessages, newMessage]);
                                        });
                                        break; // 구독 성공 시 반복 종료
                                    }
                                } catch (error) {
                                    console.error("Error checking Kafka topic:", error);
                                }
        
                                retries--;
                                await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
                            }
        
                            if (retries === 0) {
                                console.error("Failed to subscribe to Kafka topic after multiple retries");
                            }
                        };
        
                        checkTopicAndSubscribe();
                    },
                    (error) => {
                        console.error("WebSocket connection error:", error);
                        setTimeout(connectWebSocket, 5000); // 5초 후 재시도
                    }
                );
        
                setStompClient(client);
        
                return () => {
                    if (client) {
                        console.log("Disconnecting WebSocket");
                        client.disconnect(() => {
                            console.log("WebSocket disconnected");
                        }, {});
                    }
                };
            };
        
            connectWebSocket();
        
            return () => {
                isActive = false; // 컴포넌트가 언마운트될 때 isActive를 false로 설정
            };
        }, [token]);

    // 메세지 불러옴(페이징 처리)
    const fetchMessages = async (currentPage) => {
        try {
            const phoneScreen = phoneScreenRef.current;
            const previousScrollHeight = phoneScreen ? phoneScreen.scrollHeight : 0; // 이전 scrollHeight 저장

            const response = await api.get(`/api/chatmessages/list`, {
                params: {
                    roomId: userId,
                    page: currentPage,
                    size: 15,
                },
            });
            const data = response.data;
            if (data.success) {
                const reversedMessages = data.result.content.reverse();
                setMessages((prevMessages) => [...reversedMessages, ...prevMessages]);
                setIsLastPage(data.result.last);

                // 메시지 추가 후 스크롤 위치 조정
                setTimeout(() => {
                    if (phoneScreen) {
                        phoneScreen.scrollTop = phoneScreen.scrollHeight - previousScrollHeight; // 이전 스크롤 위치 유지
                    }
                }, 0);
            } else {
                console.error("메세지 불러오기 실패 : ", data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    // 파일 업로드
    const handleFileUpload = async (file) => {
        if (!file) return; // 파일이 선택되지 않았을 경우 처리하지 않음

        const formData = new FormData();
        formData.append("file", file);
        formData.append("senderId", userId);

        try {
            const response = await api.post(`/chat/upload/${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = response.data;
            if (data.success) {
                console.log("파일 업로드 성공: ", data);
            } else {
                console.error("업로드 실패: ", data.message);
            }
        } catch (error) {
            console.error("파일 업로드 에러: ", error);
        }
    };


    const handleInquiryClose = async () => {
        try {
            const response = await api.delete(`/api/chatrooms/${userId}`);
            const data = response.data;

            closeConfirmModal();
            if (data.success) {
                openAlertModal("성공", { title: "문의 종료", message: "문의가 성공적으로 종료되었습니다." }, () => {
                    window.location.href = "/"; // 메인 페이지로 리다이렉트
                });
            } else {
                openAlertModal("오류", { type: "text", content: "문의 종료 중 문제가 발생했습니다." });
            }
        } catch (error) {
            openAlertModal("오류", { type: "text", content: "문의 종료 중 문제가 발생했습니다." });
        }
    };

    return (
        <main>
            <MyNav />

            {isLoading || (
                <div className={ styles.spinner }>
                    <div className={styles.spinnerDiv}>
                        <img src={spinner}/>
                        <div className={styles.spinnerSpan}>
                            <span>로딩중 입니다.</span>
                            <span>잠시만 기다려주세요.</span>
                        </div>
                    </div>
                </div>
            )}
            
            <section className={styles.my1v1InquireSection}>
                {/* 문의 내역 카테고리 - 예금 or 적금 */}
                <div className={ styles.inquireTypeDiv }>
                    <div className={ styles.inquireTypeItem }>문의 내역</div>
                    <div className={ styles.inquireTypeItem }>
                        <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                    </div>
                    <div className={ styles.inquireTypeItem }>
                        1:1 문의
                    </div>
                </div>


                <section className={styles.userInquireBody}>
                    {/* 헤더 영역 */}
                    <div className={styles.userInquireHeader}>
                        {/* 제목 */}
                        <div className={styles.userInquireTitleArea}>
                            <div className={styles.userInquireTitle}>
                                <h4>관리자와의 1:1 문의</h4>
                            </div>
                        </div>
                        <div className={styles.userInquireQuitArea}>
                            <button
                                className={styles.userInquireQuitBtn}
                                onClick={() => openConfirmModal(
                                    "문의 종료",
                                    "정말로 문의를 종료하시겠습니까?",
                                    handleInquiryClose,
                                    closeConfirmModal
                                )}
                            >
                                <h4>문의 종료</h4>
                            </button>
                        </div>
                    </div>

                    <div className={styles.userInquireChat}>
                        <div className={styles.phoneContainer} onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
                            {/* 드래그 중 안내 메시지 */}
                            {isDragging && (
                                <div className={styles.dragOverlay}>
                                    <p>파일을 여기에 드롭하세요</p>
                                </div>
                            )}
                            <div ref={phoneScreenRef} className={styles.phoneScreen} onScroll={handleScroll}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.chatMessage} ${message.senderId === String(userId) ? styles.myMessage : ""}`}
                                    >
                                        {message.senderId === String(userId) ? (
                                            <>
                                                <span className={styles.messageTimestamp}>
                                                    {new Date(message.createdAt).toLocaleString()} {/* 날짜와 시간 표시 */}
                                                </span>
                                                <div className={styles.chatBubble}>
                                                    {message.content.startsWith("http") ? ( // URL이면 이미지로 렌더링
                                                        <img src={message.content} alt="uploaded" className={styles.chatImage} onClick={() => handleImageClick(message.content)} />
                                                    ) : (
                                                        message.content // 일반 텍스트 메시지
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            // 상대방 메시지일 경우
                                            <>
                                                <div className={styles.chatBubble}>
                                                    {message.content.startsWith("http") ? ( // URL이면 이미지로 렌더링
                                                        <img src={message.content} alt="uploaded" className={styles.chatImage} onClick={() => handleImageClick(message.content)} />
                                                    ) : (
                                                        message.content // 일반 텍스트 메시지
                                                    )}
                                                </div>
                                                <span className={styles.messageTimestamp}>
                                                    {new Date(message.createdAt).toLocaleString()} {/* 날짜와 시간 표시 */}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                ))}

                            </div>
                            <div className={styles.phoneScreenInput}>
                                <div className={styles.phoneScreenFileInputArea}>
                                    <label htmlFor="file-upload" className={styles.fileUploadButton}>
                                        +
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className={styles.fileInput}
                                        onChange={(e) => handleFileUpload(e.target.files[0])}
                                    />
                                </div>

                                <div className={styles.phoneScreenInputArea}>
                                    <input
                                        id="input-message"
                                        type="text"
                                        placeholder="메세지 입력"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)} // 입력 값을 상태에 반영
                                        onKeyDown={handleKeyPress} // Enter 키 이벤트 핸들러 추가
                                    />
                                    {inputMessage.trim() && (
                                        <button className={styles.sendButton} onClick={handleSendMessage}>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* AlertModal - 이미지 보기 */}
                    <AlertModal
                        isOpen={isAlertOpen}
                        closeModal={closeAlertModal}
                        title={alertContent.title}
                        message={
                            alertContent.message.type === "image" ? (
                                <img
                                    src={alertContent.message.content}
                                    alt="이미지 보기"
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                />
                            ) : (
                                alertContent.message.content // 텍스트 렌더링
                            )
                        }
                        onConfirm={alertContent.onConfirm}
                    />

                    {/* ConfirmModal - 파일 업로드 확인 */}

                    <ConfirmModal
                        isOpen={isConfirmOpen}
                        closeModal={closeConfirmModal}
                        title={confirmContent.title}
                        message={confirmContent.message}
                        onConfirm={confirmContent.onConfirm}
                        onCancel={confirmContent.onCancel}
                    />

                </section>

            </section>


        </main>
    );
};

export default My1v1InquirePage;