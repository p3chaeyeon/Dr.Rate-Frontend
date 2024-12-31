import React, { useEffect, useState } from 'react';
import styles from './AdminEmailInquireListPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { PATH } from 'src/utils/path';
import axiosInstanceAPI from 'src/apis/axiosInstanceAPI';

const AdminEmailInquireListPage = () => {
    const navigate = useNavigate();

    //리스트 데이터
    const [inquireData, setInquireData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [pageSize] = useState(5); // 한 페이지에 보여줄 데이터 수

    useEffect(() => {
        const inquireList = async () => {
            try {
                const response = await axiosInstanceAPI.get(`${PATH.SERVER}/api/emailinquire/emailInquireList?page=${currentPage}&size=${pageSize}`);
                
                if(response.data?.success){
                    setInquireData(response.data.result.content); // 데이터
                    setTotalPages(response.data.result.totalPages); // 총 페이지 수
                } else {
                    console.log("리스트 생성 실패");
                }
            } catch(error) {
                console.error("데이터 가져오기 실패 : ", error);
            }
            
        }
        inquireList();
    }, [currentPage]);

    const handlePreviousPage = () => {
        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };
    
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    /* 이벤트 핸들러 */
    const handleRowClick = (item) => {
        navigate(PATH.ADMIN_EMAIL_INQUIRE, { state: { item } });
    };

    return (
        <div className={styles.emailInquireListDiv}>
            <div className={styles.emailInquireListArea}>
                <div className={styles.emailInquireListHeader}>
                    <div className={styles.inquireListTitle}>
                        <h4>이메일 문의 내역</h4>
                    </div>
                    <div className={styles.emailInquireSearchBar}>
                        <select>
                            <option value="" disabled>검색 항목</option>
                            <option value="roomId">방 번호</option>
                            <option value="email">이메일</option>
                            <option value="name">이름</option>
                        </select>

                        <input type="text" placeholder="검색어" />
                        <button>조회</button>
                    </div>
                </div>
                <div className={styles.emailInquireListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>방 번호</th>
                                <th>이메일</th>
                                <th>이름</th>
                                <th>문의 날짜</th>
                                <th className={styles.emailInquireStatus}>답변 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquireData.length > 0 ? (
                                inquireData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={styles.row}
                                        onClick={() => handleRowClick(item)}
                                    >
                                        <td data-label="아이디">{item.id}</td>
                                        <td data-label="이메일">{item.inquireEmail}</td>
                                        <td data-label="이름">{item.inquireUser}</td>
                                        <td data-label="최근 답변 날짜">{item.createdAt}</td>
                                        <td data-label="답변 여부">
                                            <input type="hidden" value={item.inquireCtg}/>
                                            <input type="hidden" value={item.inquireTitle}/>
                                            <input type="hidden" value={item.inquireContent}/>
                                            <input type="hidden" value={item.fileUuid}/>
                                            {item.answerContent ? (
                                                <div className={styles.statusButtons}>
                                                    <button>완료</button>
                                                </div>
                                            ) : (
                                                <div className={styles.statusButtons}>
                                                    <button>미완료</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">데이터가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div className={styles.pageBtn}>
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                            Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageClick(index)}
                                className={currentPage === index ? styles.active : ""}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailInquireListPage;