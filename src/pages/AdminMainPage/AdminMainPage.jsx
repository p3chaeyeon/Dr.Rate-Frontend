import React, { useState, useEffect } from 'react';
import styles from './AdminMainPage.module.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { PATH } from "src/utils/path";
import userLogo from 'src/assets/icons/userIcon.png'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminMainPage = () => {
    const [newUsers, setNewUsers] = useState([]);  // 신규 회원 데이터를 저장
    const [inquireList, setInquireList] = useState([]);  // 신규 회원 데이터를 저장
    const token = localStorage.getItem("authToken");

    // 신규 회원 데이터를 가져오는 함수
    const fetchNewUsers = async (page = 0) => {
        try {
            const response = await fetch(
                `${PATH.SERVER}/api/userList?page=${page}&size=4`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
            );
            const data = await response.json();

            if (data.success) {
                setNewUsers(data.result.content); // 회원 데이터 저장
            } else {
                console.error("유저 목록 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    };

    const fetchInquiryList = async (page = 0) => {
        try {
            const response = await fetch(
                `${PATH.SERVER}/api/chatrooms/inquireList?page=${page}&size=4`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
            );
            const data = await response.json();

            if (data.success) {
                setInquireList(data.result.content); // 회원 데이터 저장
            } else {
                console.error("유저 목록 조회 실패:", data.message);
            }
        } catch (error) {
            console.error("API 호출 중 오류:", error);
        }
    }

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        fetchNewUsers();
        fetchInquiryList();
    }, []);


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
                                    <tr>
                                        <td>2024-11-12</td>
                                        <td>9</td>
                                        <td>2</td>
                                        <td>1</td>
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
                                {newUsers.map((user) => {
                                    return ( // 명시적으로 반환
                                        <li key={user.id} className={styles.newUserItem}>
                                            <div className={styles.profileImage}>
                                                <img src={userLogo} alt="사용자 프로필"></img>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{user.username}</span>
                                                <span className={styles.userEmail}>{user.email}</span>
                                            </div>
                                            <div className={styles.joinDate}>
                                                {user.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString()
                                                    : "알 수 없음"}
                                            </div>
                                        </li>
                                    );
                                })}
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
                                {inquireList.map((inquire) => {
                                    return (
                                        <li key={inquire.id} className={styles.inquiryItem}>
                                            <div className={styles.profileImage}>
                                                <img src={userLogo} alt="사용자 프로필"></img>
                                            </div>
                                            <div className={styles.inquiryContent}>
                                                <div className={styles.inquiryTitle}>
                                                    {inquire.topicName}
                                                    {inquire.status && (
                                                        <span
                                                            className={`${styles.newBadge} ${inquire.status === "OPEN" ? styles.openStatus : styles.closedStatus
                                                                }`}
                                                        >
                                                            {inquire.status === "OPEN" ? "OPEN" : "CLOSED"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className={styles.inquiryMeta}>
                                                    <span>{inquire.userName}</span> |
                                                    <span className={styles.inquiryDate}>
                                                        {inquire.updatedAt
                                                            ? `${new Date(inquire.updatedAt).toLocaleDateString()} ${new Date(inquire.updatedAt).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}`
                                                            : "알 수 없음"}
                                                    </span>
                                                </div>

                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminMainPage;