import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './MyEmailInquirePage.module.scss';
import { fetchInquiryList } from 'src/apis/axiosInstanceAPI'; // API 호출 함수
import MyNav from 'src/components/MyNav'; 
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';

const MyEmailInquirePage = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState([]); // 서버에서 가져올 문의 내역
    const [loading, setLoading] = useState(true);  // 로딩 상태
    const [error, setError] = useState(null);      // 에러 상태

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
                    {inquiries.map((inquire) => (
                        <div className={styles.inquireList} key={inquire.id}>
                            <div className={styles.listTopDiv}>
                                <div className={styles.topCategory}>{inquire.inquire_ctg}</div>
                                <div className={styles.topDate}>{inquire.inquire_date}</div>
                            </div>

                            <div className={styles.listContentDiv}>
                                <div className={styles.contentQ}><div>Q</div></div>
                                <div className={styles.contentDiv}>
                                    <div className={styles.inquireTitleDiv}>
                                        <span className={styles.inquireTitle}>{inquire.inquire_title}</span>
                                    </div>
                                    <div className={styles.inquireEmailDiv}>
                                        문의자 이메일 : <span className={styles.inquireEmail}>{inquire.inquire_email}</span>
                                    </div>
                                    <div className={styles.inquireContentDiv}>
                                        <pre className={styles.inquireContent}>{inquire.inquire_content}</pre>
                                    </div>
                                    <div className={styles.inquireFileDiv}>
                                        파일 이미지 div
                                    </div>
                                </div>
                            </div>

                            <div className={styles.listAnswerDiv}>
                                <div className={styles.answerDiv}>
                                    <div className={styles.answerTitleDiv}>
                                        <pre className={styles.answerTitle}>{inquire.answer_title}</pre>
                                    </div>
                                    <div className={styles.answerContentDiv}>
                                        <pre className={styles.answerContent}>{inquire.answer_content}</pre>
                                    </div>
                                </div>
                                <div className={styles.answerDate}>
                                    {inquire.answer_date}
                                </div>
                            </div>

                            <div className={styles.btnDiv}>
                                <button className={styles.deleteBtn}>삭제</button>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
};

export default MyEmailInquirePage;