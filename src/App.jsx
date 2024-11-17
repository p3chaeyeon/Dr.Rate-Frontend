/* src/App.jsx */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import { PATH } from "./utils/path";
import PageRoutes from "./pages";

function App() {
  return (
    <div className="app">
      <Routes>
      <Route path="*" element={<PageRoutes.HomePage />} /> {/* 모든 경로 fallback */}
        <Route path={PATH.HOME} element={<PageRoutes.HomePage />} />
        <Route path={PATH.MY_SAVINGS} element={<PageRoutes.MySavingsPage />} />
        <Route path={PATH.MY_RECURRING} element={<PageRoutes.MyRecurringPage />} />
        <Route path={PATH.MY} element={<PageRoutes.MyPage />} />
        <Route path={PATH.MY_EDIT} element={<PageRoutes.MyEditPage />} />
        <Route path={PATH.MY_WITHDRAW} element={<PageRoutes.MyWithdrawPage />} />
        <Route path={PATH.MY_CALENDAR} element={<PageRoutes.MyCalendarPage />} />
      </Routes>
    </div>
  );
}

export default App;



{/* <Route path='/about' element={ <About/> } />
<Route path='/profile' element={ <Profile/> } />
<Route path='/front/:name' element={ <Front data={ data }/> } />  */}
{/* name : 내가 정한 이름 */}
{/* :name은 URL 파라미터(url 경로 일부; :name은 URL 파라미터 ) */}



