import styles from './MyPage.module.scss';

import React from 'react';

const MyPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.item}>
                MyPage 회원정보
            </div>
        </div>
    );
};

export default MyPage;