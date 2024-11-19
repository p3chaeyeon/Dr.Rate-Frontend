import styles from './AdminSideNav.module.scss';
import React from 'react';
import { PATH } from "src/utils/path";
import { useNavigate } from "react-router-dom";

const AdminSideNav = () => {
    const navigate = useNavigate();

    return (
        <div className={ styles.adminNav }>
            <div className={ styles.adminLogo }>
                {/* 여기 로고 넣기 */}
            </div>


            <div className={ styles.adminMenu }>
                {/* 여기에 관리자 메뉴 */}
            </div>

            <div className={ styles.userNavigate } onClick={() => navigate(PATH.HOME)}>
                사용자 페이지 이동 &gt;
            </div>

            
        </div>
    );
};

export default AdminSideNav;