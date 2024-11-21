import styles from './AdminSideNav.module.scss';
import React from 'react';
import { PATH } from "src/utils/path";
import { useNavigate } from "react-router-dom";
import adminLogo from 'src/assets/images/adminLogo.png';

const AdminSideNav = () => {
    const navigate = useNavigate();

    return (
        <div className={ styles.adminNav }>
            <div className={ styles.adminLogoDiv } onClick={() => navigate(PATH.ADMIN_MAIN)}>
                <img src={adminLogo} alt="admin logo" className={styles.adminLogo} />
            </div>

            <div className={ styles.adminMenuDiv }>
                {/* 여기에 관리자 메뉴 */}
            </div>

            <div className={ styles.userNavigateDiv } onClick={() => navigate(PATH.HOME)}>
                사용자 페이지 이동 &gt;
            </div>

            
        </div>
    );
};

export default AdminSideNav;