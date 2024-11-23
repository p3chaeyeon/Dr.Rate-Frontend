import React from 'react';
import styles from './AdminMainPage.module.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminMainPage = () => {
    const data = {
        labels: ['12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-11'], // 날짜 라벨
        datasets: [
            {
                label: '총 방문자 수',
                data: [2, 5, 3, 10, 4, 3, 0], // 총 방문자 수 데이터
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true, // 영역 채우기
                tension: 0.4, // 부드러운 곡선
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: '방문자 수',
                data: [1, 2, 4, 6, 2, 3, 0], // 금일 방문자 수 데이터
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false, // X축 그리드 숨김
                },
            },
            y: {
                grid: {
                    color: '#eaeaea', // Y축 그리드 색상
                },
                beginAtZero: true,
            },
        },
    };
    return (
        <div className={styles.dashboardDiv}>
            {/* 첫번째 행 영역 */}
            <div className={styles.dashboardRow}>
                {/* 1. 방문자 현황 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        {/* 방문자 현황 헤더 */}
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>방문자 현황</h4>
                            </div>                            
                        </div>
                        {/* 방문자 현황 body : 그래프 */}
                        <div className={styles.dashboardItemBody}>
                            <Line data={data} options={options} />
                        </div>
                    </div>
                </div>
                {/* 2. 일자별 요약 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>일자별 요약</h4>
                            </div>
                        </div>
                        {/* 일자별 요약 body */}
                        <div className={styles.dashboardItemBody}>
                            <table className={styles.summaryTable}>
                                <thead>
                                    <tr>
                                        <th>일자</th>
                                        <th>방문자 수</th>
                                        <th>가입</th>
                                        <th>문의 수</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>2024-11-14</td>
                                        <td>10</td>
                                        <td>12</td>
                                        <td>2</td>
                                    </tr>
                                    <tr>
                                        <td>2024-11-13</td>
                                        <td>10</td>
                                        <td>32</td>
                                        <td>0</td>
                                    </tr>
                                    <tr>
                                        <td>2024-11-12</td>
                                        <td>9</td>
                                        <td>2</td>
                                        <td>1</td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>최근 7일 합계</td>
                                        <td>55</td>
                                        <td>55</td>
                                        <td>20</td>
                                    </tr>
                                    <tr>
                                        <td>이번달 합계</td>
                                        <td>100</td>
                                        <td>99</td>
                                        <td>46</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
             {/* 두번째 행 영역 */}
            <div className={styles.dashboardRow}>
                {/* 3. 신규 회원 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>신규 회원</h4>
                            </div>
                        </div>
                        {/* 신규 회원 body */}
                        <div className={styles.dashboardItemBody}>
                            <ul className={styles.newUserList}>
                                {[
                                    { name: "김유진", email: "yu****@example.com", date: "2024-11-14" },
                                    { name: "박현지", email: "ph****@example.com", date: "2024-11-14" },
                                    { name: "이준호", email: "lj****@example.com", date: "2024-11-14" },
                                    { name: "정하나", email: "jh****@example.com", date: "2024-11-14" },
                                ].map((user, index) => (
                                    <li key={index} className={styles.newUserItem}>
                                        <div className={styles.profileImage}>
                                            <img src="/src/assets/icons/userIcon.png" alt='사용자 프로필'></img>
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.name}</span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                        <div className={styles.joinDate}>{user.date}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {/* 4. 1:1 문의 내역 영역 */}
                <div className={styles.dashboardItemArea}>
                    <div className={styles.dashboardItem}>
                        <div className={styles.dashboardItemHeader}>
                            <div className={styles.dashboardItemTitle}>
                                <h4>1:1 문의 내역</h4>
                            </div>
                        </div>
                        {/* 1:1 문의 내역 body */}
                        <div className={styles.dashboardItemBody}>
                            <ul className={styles.inquiryList}>
                                {[
                                    {
                                        title: "게시판 작성 위젯별 기능 설명(상단전용)",
                                        author: "관리자",
                                        date: "2020-12-11 14:38",
                                        badge: "N"
                                    },
                                    {
                                        title: "게시판 작성 상단 디자인 설정 주요 기능 알아보기",
                                        author: "관리자",
                                        date: "2020-12-10 14:48"
                                    },
                                    {
                                        title: "게시판 작성 커스텀 하단 만들기(푸터)",
                                        author: "관리자",
                                        date: "2020-12-10 14:36"
                                    },
                                    {
                                        title: "게시판 작성 하단 설정하기(푸터)",
                                        author: "관리자",
                                        date: "2020-12-10 11:06"
                                    },
                                ].map((item, index) => (
                                    <li key={index} className={styles.inquiryItem}>
                                        <div className={styles.profileImage}>
                                            <img src="/src/assets/icons/userIcon.png" alt="사용자 프로필" />
                                        </div>
                                        <div className={styles.inquiryContent}>
                                            <div className={styles.inquiryTitle}>
                                                {item.title} {item.badge && <span className={styles.newBadge}>{item.badge}</span>}
                                            </div>
                                            <div className={styles.inquiryMeta}>
                                                <span>{item.author}</span> | <span>{item.date}</span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminMainPage;