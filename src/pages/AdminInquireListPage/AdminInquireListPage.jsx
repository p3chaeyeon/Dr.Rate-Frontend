import React from 'react';
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path";
import styles from './AdminInquireListPage.module.scss';

const AdminInquireListPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.inquireListDiv}>
            <div className={styles.inquireListArea}>
                {/* 헤더 */}
                <div className={styles.inquireListHeader}>
                    <div className={styles.inquireListTitle}>
                        <h4>1:1 문의 내역</h4>
                    </div>
                    <div className={styles.inquireSearchBar}>
                        <select>
                            <optgroup label="검색 항목">
                                <option value="id" selected>아이디</option>
                                <option value="name">이름</option>
                                <option value="subject">제목</option>
                            </optgroup>
                        </select>
                        
                        <input type="text" placeholder="검색어" />
                        <button>조회</button>
                    </div>
                </div>
                <div className={styles.inquireListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>제목</th>
                                <th>카테고리</th>
                                <th className={styles.inquireStatus}>답변 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    id: 'HONG',
                                    name: '홍제헌',
                                    title: '박사가 되고 싶어요',
                                    category: '진로',
                                    status: '답변 완료',
                                },
                                {
                                    id: 'TEST',
                                    name: '테스트',
                                    title: '마이페이지 접속이 안돼요',
                                    category: '서버',
                                    status: '답변 미완료',
                                },
                                {
                                    id: 'TEST1',
                                    name: '테스트',
                                    title: '적금을 추천할 다른 방...',
                                    category: '적금',
                                    status: '답변 미완료',
                                },
                                {
                                    id: 'TEST2',
                                    name: '테스트',
                                    title: '...',
                                    category: '예금',
                                    status: '답변 미완료',
                                },
                            ].map((inquire, index) => (
                                <tr
                                    key={index}
                                    className={styles.row}
                                >
                                    <td>{inquire.id}</td>
                                    <td>{inquire.name}</td>
                                    <td onClick={() => navigate(PATH.ADMIN_INQUIRE)}>{inquire.title}</td>
                                    <td>{inquire.category}</td>
                                    <td>
                                        <div className={styles.statusButtons}>
                                            <button
                                                className={
                                                    inquire.status === '답변 완료'
                                                        ? styles.completedActive
                                                        : styles.completed
                                                }
                                            >
                                                완료
                                            </button>
                                            <button
                                                className={
                                                    inquire.status === '답변 미완료'
                                                        ? styles.pendingActive
                                                        : styles.pending
                                                }
                                            >
                                                미완료
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                <div className={styles.pagination}>
                    <div className={styles.pageBtn}>
                        <button disabled>Previous</button>
                        <button className={styles.active}>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInquireListPage;