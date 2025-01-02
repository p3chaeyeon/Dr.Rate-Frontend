import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './MyEmailInquirePage.module.scss';
import { fetchInquiryList } from 'src/apis/emailInquireAPI'; // API 호출 함수
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';
import MyNav from 'src/components/MyNav'; 
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';
import {PATH} from 'src/utils/path'
import useModal from 'src/hooks/useModal';

import AlertModal from 'src/components/Modal/AlertModal'; // AlertModal import
import ImageModal from 'src/components/Modal/ImageModal';

const MyEmailInquirePage = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]); // 서버에서 가져올 문의 내역
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null);      // 에러 상태

    const [isImageOpen, setIsImageOpen] = useState(false);
    const [isImage, setIsimage] = useState();
    

    const {
        isAlertOpen,      // AlertModal이 열려 있는지 여부 (true/false 상태)
        openAlertModal,   // AlertModal을 열기 위한 함수
        closeAlertModal,  // AlertModal을 닫기 위한 함수
        alertContent, 
    } = useModal();

    const handleCancel = () => {
        closeAlertModal(); // ConfirmModal 닫기
    };

    const handleImageClose = useCallback(() => {
        setIsImageOpen(false); // ConfirmModal 닫기
    }, []);

    // 이미지 클릭시 핸들러
    const handleImageClick = (image) => {
        setIsimage(image); // 이미지 URL 저장
        setIsImageOpen(true); // 모달 열기
    };

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const getInquiries = async () => {
            try {
                setLoading(true); // 로딩 시작
                const data = await fetchInquiryList(); // API 호출
                setInquiries(data); // 문의 데이터 설정
            } catch (err) {
                setError(err.message); // 에러 메시지 설정
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        getInquiries();
    }, []);

    // 삭제 핸들러
    const handleDelete = async (id) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            try {
                await axiosInstanceAPI.delete(`${PATH.SERVER}/api/emailinquire/delete/${id}`); // 삭제 API 호출
                setInquiries((prev) => prev.filter((inquire) => inquire.id !== id)); // 상태 업데이트
                alert('문의가 성공적으로 삭제되었습니다.');
            } catch (err) {
                console.error('Error deleting inquiry:', err);
                alert('삭제 중 오류가 발생했습니다.');
            }
        }
    };

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '날짜 없음';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) return <div>Loading...</div>; // 로딩 중 상태 표시
    if (error) return <div>Error: {error}</div>; // 에러 상태 표시

    return (
        <main>
            <MyNav />
            <section className={styles.myEmailInquireSection}>

                {/* 문의 내역 카테고리 - 예금 or 적금 */}
                <div className={ styles.inquireTypeDiv }>
                    <div className={ styles.inquireTypeItem }>문의 내역</div>
                    <div className={ styles.inquireTypeItem }>
                        <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                    </div>
                    <div className={ styles.inquireTypeItem }>
                        이메일 문의
                    </div>
                </div>

                {/* 반복 렌더링 */}
                <div className={styles.inquireListDiv}>
                    {inquiries.length === 0 ? (
                        <div className={styles.noInquiriesMessage}>
                            문의 내역이 없습니다.
                        </div>
                    ) : (
                    inquiries.map((inquire) => (
                        <div className={styles.inquireList} key={inquire.id}>
                            <div className={styles.listTopDiv}>
                                <div className={styles.topCategory}>{inquire.inquireCtg === 'serviceImprovement' ? '서비스 개선 제안' : inquire.inquireCtg === 'systemError' ? '시스템 오류 제보' : '제목 없음'}</div>
                                <div className={styles.topDate}>{formatDate(inquire.createdAt)}</div>
                            </div>

                            <div className={styles.listContentDiv}>
                                <div className={styles.contentQ}><div>Q</div></div>
                                <div className={styles.contentDiv}>
                                    <div className={styles.inquireTitleDiv}>
                                        <span className={styles.inquireTitle}>{inquire.inquireTitle || '제목 없음'}</span>
                                    </div>
                                    <div className={styles.inquireUserDiv}>
                                        문의자 이름: <span className={styles.inquireUser}>{inquire.inquireUser || '이름 없음'}</span>
                                    </div>
                                    <div className={styles.inquireEmailDiv}>
                                        문의자 이메일: <span className={styles.inquireEmail}>{inquire.inquireEmail || '이메일 없음'}</span>
                                    </div>
                                    <div className={styles.inquireContentDiv}>
                                        <pre className={styles.inquireContent}>{inquire.inquireContent || '내용 없음'}</pre>
                                    </div>
                                    <div className={styles.inquireFileDiv}>
                                        {inquire.fileUuid ? <span><img src={inquire.fileUuid} 
                                                                        className={styles.inquireFile}
                                                                        onClick={() => handleImageClick(inquire.fileUuid)}/></span> : '첨부파일 없음'}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.listAnswerDiv}>
                                <div className={styles.answerDiv}>
                                    <div className={styles.answerTitleDiv}>
                                        <pre className={styles.answerTitle}>{inquire.answerTitle || '답변 제목 없음'}</pre>
                                    </div>
                                    <div className={styles.answerContentDiv}>
                                        <pre className={styles.answerContent}>{inquire.answerContent || '답변 내용 없음'}</pre>
                                    </div>
                                    <div className={styles.answerFileDiv}>
                                        {inquire.answerFile ? <span><img src={inquire.answerFile} 
                                                                        className={styles.answerFile}
                                                                        onClick={() => handleImageClick(inquire.answerFile)}/></span> : '첨부파일 없음'}
                                    </div>
                                </div>
                                <div className={styles.answerDate}>
                                    {formatDate(inquire.updatedAt)}
                                </div>
                            </div>

                            <div className={styles.btnDiv}>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(inquire.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))
                 )}
                </div>
            </section>
            <AlertModal
                isOpen={isAlertOpen}
                closeModal={closeAlertModal}
                title={alertContent.title}
                message={alertContent.message}
            />
            <ImageModal
                isOpen={isImageOpen}
                closeModal={handleImageClose}
                image={isImage} // 이미지 URL 전달
            />
        </main>
    );
};

export default MyEmailInquirePage;