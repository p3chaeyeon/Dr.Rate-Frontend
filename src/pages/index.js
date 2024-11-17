/* src/pages/index.js; 모든 페이지 컴포넌트를 모아 PageRoutes로 관리 */

import HomePage from './HomePage';
import MySavingsPage from './MySavingsPage';
import MyRecurringPage from './MyRecurringPage';
import MyPage from './MyPage';
import MyEditPage from './MyEditPage';
import MyWithdrawPage from './MyWithdrawPage';
import MyCalendarPage from './MyCalendarPage';

// 각 페이지 컴포넌트를 PageRoutes 객체에 모아 내보내기
const PageRoutes = {
    HomePage,
    MySavingsPage,     
    MyRecurringPage,   
    MyPage,
    MyEditPage,
    MyWithdrawPage,
    MyCalendarPage,
};

export default PageRoutes;