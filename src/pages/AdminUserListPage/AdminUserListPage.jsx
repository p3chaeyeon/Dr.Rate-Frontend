import React from 'react';
import styles from './AdminUserListPage.module.scss';

const AdminUserListPage = () => {
    return (
        <div className={styles.userListDiv}>
            <div className={styles.userListArea}>
                {/* 헤더 */}
                <div className={styles.userListHeader}>
                    <div className={styles.userListTitle}>
                        <h4>1:1 문의 내역</h4>
                    </div>
                    <div className={styles.userSearchBar}>
                        <input type="text" placeholder="아이디" />
                        <input type="text" placeholder="검색어" />
                        <button>조회</button>
                    </div>
                </div>
                <div className={styles.userListTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>아이디</th>
                                <th>이름</th>
                                <th>제목</th>
                                <th>카테고리</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    id: 'HONG',
                                    name: '홍채현',
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
                            ].map((user, index) => (
                                <tr key={index}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.title}</td>
                                    <td>{user.category}</td>
                                    <td>
                                        <button
                                            className={
                                                user.status === '답변 완료'
                                                    ? styles.completed
                                                    : styles.pending
                                            }
                                        >
                                            {user.status}
                                        </button>
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

export default AdminUserListPage;