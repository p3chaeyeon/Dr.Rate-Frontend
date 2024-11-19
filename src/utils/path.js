/* src/utils.path.js; PATH 객체를 사용하여 라우팅 경로를 관리 */


export const PATH = {
    /* 사용자 경로 */
    HOME: '/',
    MY_SAVINGS: '/mySavings',           // 마이페이지; 예금 즐겨찾기
    MY_RECURRING: '/myRecurring',       // 마이페이지; 적금 즐겨찾기
    MY: '/my',                          // 마이페이지; 회원 정보 (조회)
    MY_EDIT: '/myEdit',                 // 마이페이지; 회원 정보 수정
    MY_WITHDRAW: '/myWithdraw',         // 마이페이지; 회원 탈퇴
    MY_CALENDAR: '/myCalendar',         // 마이페이지; 나의 적금 달력


    /* 관리자 경로 */
    ADMIN_MAIN: '/admin/adminMain'

    // SERVER: "https://api.kookmin-timebank.com"
    
};

// 환경 변수에서 deployHostName 값을 가져옴
// 기본값은 http://localhost:5173로 설정
export const deployHostName = import.meta.env.VITE_DEPLOY_HOSTNAME; // || 'http://localhost:5173';



/* 환경변수 유효성 검증 */
// if (!import.meta.env.VITE_DEPLOY_HOSTNAME) {
//     throw new Error('VITE_DEPLOY_HOSTNAME is not defined. Please check your .env file.');
// }
// export const deployHostName = import.meta.env.VITE_DEPLOY_HOSTNAME;


