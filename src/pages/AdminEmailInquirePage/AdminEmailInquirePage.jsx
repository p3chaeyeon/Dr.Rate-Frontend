import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './AdminEmailInquirePage.module.scss';
import useModal from 'src/hooks/useModal';
import { PATH } from 'src/utils/path';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';

const AdminEmailInquirePage = () => {
    const [isMobileView, setIsMobileView] = useState(false); // 모바일 뷰 여부
    const [showAdminSection, setShowAdminSection] = useState(false); // 관리자 섹션 보기 여부
    const navigate = useNavigate();

    const {
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    } = useModal();
    const [form, setForm] = useState({
        id: "",
        answerTitle: "",
        answerContent: "",
        answerFile: '',
    });

    const location = useLocation();
    const item = location.state?.item; // 전달된 데이터

    const handleResetForm = () => {
        setForm((prev) => ({
            ...prev,
            answerTitle: "",
            answerContent: "",
            answerFile: null,
        }));
        // 파일 입력 필드 초기화
        const fileInput = document.getElementById("file");
        if (fileInput) {
            fileInput.value = ""; // 
        }
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setForm({ ...form, answerFile: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    

    useEffect(() => {
        const handleResize = () => {
            // 880px 이하일 때 모바일 뷰로 전환
            setIsMobileView(window.innerWidth <= 880);
            console.log(item);
        };

        // 초기화 및 리스너 설정
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize); // 리스너 정리
    }, []);

    // 취소 버튼 클릭 핸들러
    const handleCancel = () => {
        // 취소 시 필요한 로직 작성
        closeConfirmModal(); // ConfirmModal 닫기
    }; 

    const handleConfirm = () => {
        const emailAnswer = async () => {
            try {
                const formData = new FormData();
    
                formData.append("id", item.id);
                formData.append("answerTitle", form.answerTitle);
                formData.append("answerContent", form.answerContent);
                // 폼데이터에 파일추가
                if (form.answerFile) {
                    formData.append("answerFile", form.answerFile); // 파일 추가
                }
                const response = await axiosInstanceAPI.post(`${PATH.SERVER}/api/emailinquire/answer`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data", // 중요!
                        },
                    }
                );
                console.log(formData.get("answerTitle"));
                if(response.data.success) {
                    navigate(`${PATH.ADMIN_EMAIL_INQUIRE_LIST}`);
                } else {
                    console.log("이메일 전송 중 오류 발생 = ", response);
                }
                console.log("이메일 전송 = " + response.data);
            } catch(error) {
                console.error("이메일 답변 저장 중 오류 발생 : ", error);
            }
        }
        emailAnswer();
        closeConfirmModal();
    }

    const handleAnswer = async () => {
        openConfirmModal("전송하시겠습니까?", null, handleConfirm, handleCancel);
    }

    return (
        <main className={styles.emailInquireDiv}>
            <section className={styles.emailInquireListArea}>
                {/* 유저 문의 섹션 */}
                {!isMobileView || !showAdminSection ? (
                    <div className={styles.emailInquireListUser}>
                        <div className={styles.inquiryType}>
                            문의 유형
                            <p>{item?.inquireCtg}</p>
                        </div>
                        <div className={styles.userName}>
                            유저 이름
                            <p>{item?.inquireUser}</p>
                        </div>
                        <div className={styles.userEmail}>
                            이메일
                            <p>{item?.inquireEmail}</p>
                        </div>
                        <div className={styles.inquiryTitle}>
                            제목
                            <p>{item?.inquireTitle}</p>
                        </div>
                        <div className={styles.inquiryContent}>
                            문의 내용
                            <p>{item?.inquireContent}</p>
                        </div>
                        <div className={styles.inquiryAttachment}>
                            <p>첨부 파일</p>
                            {item?.fileUuid ? (
                                <img
                                    src={`${item.fileUuid}`}
                                    alt="첨부 파일"
                                    className={styles.attachmentImage}
                                />
                            ) : (
                                <p>첨부 파일 없음</p>
                            )}
                        </div>

                        {/* 버튼 - 880px 이하에서만 렌더링 */}
                        {isMobileView && (
                            <div className={styles.toggleButtons}>
                                <button onClick={() => setShowAdminSection(true)}>관리자 답변 작성</button>
                            </div>
                        )}
                    </div>
                ) : null}

                {/* 관리자 답변 섹션 */}
                {!isMobileView || showAdminSection ? (
                    <div className={styles.emailInquireListAdmin}>
                        <div className={styles.sendEmailSection}>
                            <p>보내는 이메일:</p>
                            <input type="email" value="anfto023@gmail.com" placeholder="admin@example.com" />
                        </div>
                        <div className={styles.emailTitle}>
                            <label>제목</label>
                            <input type="text" 
                                    name="answerTitle" 
                                    value={form.answerTitle}
                                    onChange={handleChange}
                                    placeholder="답변 제목을 입력하세요" />
                        </div>
                        <div className={styles.emailContent}>
                            <label>답변 내용</label>
                            <textarea name="answerContent" 
                                        value={form.answerContent} 
                                        placeholder="답변 내용을 작성하세요" 
                                        rows="10"
                                        onChange={handleChange}></textarea>
                        </div>
                        <div className={styles.emailAttachment}>
                            <p>첨부 파일</p>
                            <input type="file"
                                    id="file"
                                    name="answerFile"
                                    onChange={handleChange}/>
                            <button
                                type="button"
                                className={styles.resetButton}
                                onClick={handleResetForm}
                                >
                                초기화
                            </button>
                        </div>
                        <div className={styles.submitButtonBox}>
                            <button onClick={handleAnswer}
                                    className={styles.submitButton}>전송</button>
                        </div>
                        {/* 버튼 - 880px 이하에서만 렌더링 */}
                        {isMobileView && (
                            <div className={styles.toggleButtons}>
                                <button onClick={() => setShowAdminSection(false)}>유저 문의 보기</button>
                                <button>문의 작성</button>
                            </div>
                        )}
                    </div>
                ) : null}
            </section>
            <ConfirmModal
                isOpen={isConfirmOpen}           
                closeModal={closeConfirmModal}   
                title={confirmContent.title}     
                message={confirmContent.message} 
                onConfirm={confirmContent.onConfirm} 
                onCancel={confirmContent.onCancel}   
            /> 
        </main>
    );
};

export default AdminEmailInquirePage;
