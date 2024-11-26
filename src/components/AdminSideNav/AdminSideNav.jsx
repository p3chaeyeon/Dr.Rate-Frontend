import styles from './AdminSideNav.module.scss';
import React from 'react';
import { PATH } from "src/utils/path";
import { useNavigate } from "react-router-dom";
import adminLogo from 'src/assets/images/adminLogo.png';
import dashboard from 'src/assets/images/adminDashboard.png';
import userManagement from 'src/assets/images/adminUserManagement.png';
import inquiryHistory from 'src/assets/images/adminInquiryHistory.png';

const AdminSideNav = () => {
    const navigate = useNavigate();

    return (
        <div className={ styles.adminNav }>
            {/* 관리자 페이지 로고 */}
            <div className={ styles.adminLogoDiv } onClick={() => navigate(PATH.ADMIN_MAIN)}>
                <img src={adminLogo} alt="admin logo" className={styles.adminLogo} />
            </div>


            {/* 관리자 메뉴 */}
            <div className={ styles.adminMenuDiv }>
                <div>
                    <div className={ styles.adminMenuList } onClick={()=>navigate(PATH.ADMIN_MAIN)}> 
                        <div className={ styles.adminMenuItemImg}>
                            <img src={dashboard} alt="대시보드" className={styles.adminMenuImg} />
                        </div>
                        <div className={ styles.adminMenuItemText }>
                            대시보드
                        </div>
                    </div>
                    <div className={ styles.adminMenuList } onClick={()=> navigate(PATH.ADMIN_USER_LIST)}>
                        <div className={ styles.adminMenuItemImg}>
                            <img src={userManagement} alt="사용자 조회" className={styles.adminMenuImg} />
                        </div>
                        <div className={ styles.adminMenuItemText }>
                            사용자 조회
                        </div>                        
                    </div>
                    <div className={ styles.adminMenuList } onClick={()=> navigate(PATH.ADMIN_INQUIRE_LIST)}>
                        <div className={ styles.adminMenuItemImg}>
                            <img src={inquiryHistory} alt="1:1 문의 내역" className={styles.adminMenuImg} />
                        </div>
                        <div className={ styles.adminMenuItemText }>
                            1:1 문의 내역
                        </div>
                    </div>
                </div>
            </div>{/* //<div className={ styles.adminMenuDiv }> */}


            {/* 사용자 페이지 이동 */}
            <div className={ styles.userNavigateDiv } onClick={() => navigate(PATH.HOME)}>
                사용자 페이지 이동 &gt;
            </div>

            
        </div>
    );
};

export default AdminSideNav;