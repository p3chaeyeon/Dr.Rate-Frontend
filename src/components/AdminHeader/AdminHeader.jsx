import styles from './AdminHeader.module.scss';
import React from 'react';

const AdminHeader = () => {
    return (
        <div className={ styles.adminHeader }>
            <div className={ styles.adminHeaderTitle }>
                관리자 페이지
            </div>
            <div className={styles.adminHeaderLogout }>
                로그아웃
            </div>
        </div>
    );
};

export default AdminHeader;