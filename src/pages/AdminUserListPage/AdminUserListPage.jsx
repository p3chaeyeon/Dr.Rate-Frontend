import React from 'react';
import styles from './AdminUserListPage.module.scss'

const AdminUserListPage = () => {
    return (
        <div className={styles.userListDiv}>
            <div className={styles.userListArea}>
                {/* 헤더 */}
                <div className={styles.userListHeader}>
                    <div className={styles.userListTitle}>
                        <h4>사용자 조회</h4>
                    </div>
                    <div className={styles.userSearchBar}>
                        {/* <input type="text" placeholder="아이디" /> */}
                        <select>
                            <optgroup label="검색 항목">
                                <option value="id" selected>아이디</option>
                                <option value="name">이름</option>
                            </optgroup>
                        </select>
                        
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
                                <th>그룹 (역할)</th>
                                <th>가입일자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    id: 'ADMIN',
                                    name: '관리자',
                                    group: '관리자',
                                    created_at: '2023-07-12 16:53:33',
                                },
                                {
                                    id: 'HONG',
                                    name: '홍재헌',
                                    group: '사용자',
                                    created_at: '2023-07-13 16:53:33',
                                },
                                {
                                    id: 'PARK',
                                    name: '박채연',
                                    group: '사용자',
                                    created_at: '2023-07-14 16:53:33',
                                },
                                {
                                    id: 'OH',
                                    name: '오영수',
                                    group: '사용자',
                                    created_at: '2023-07-18 16:53:33',
                                },                                
                            ].map((user, index) => (
                                <tr
                                    key={index} 
                                    className={styles.row}
                                >
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.group}</td>
                                    <td>{user.created_at}</td>
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