import styles from './Header.module.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from "src/utils/path";
import headerLogo from 'src/assets/images/headerLogo.png';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';

const Header = () => {
    const navigate = useNavigate();


    return (
        <header>
            <div className={styles.logoDiv} onClick={() => navigate(PATH.HOME)}>
                <img src={headerLogo} alt="Down arrow" className={styles.headerLogo} />
            </div>
            <nav className={styles.mainNav} >
                <ul className={styles.mainMenuList}>
                    <li className={styles.mainMenuItem}>
                        예금
                    </li>
                    <li className={styles.mainMenuItem}>
                        적금
                    </li>
                    <li className={styles.mainMenuItem}>
                        맞춤 상품
                    </li>
                </ul>
            </nav>
            <nav className={styles.userNav} >
            <ul className={styles.userMenuList}>
                    <li className={styles.userMenuItem}>
                        로그아웃{/* 회원가입 */}
                    </li>
                    <li className={styles.userMenuItem}>
                        <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
                    </li>                    
                    <li className={styles.userMenuItem}  onClick={() => navigate(PATH.MY_SAVINGS)}>
                        마이페이지{/* 로그인 */}
                    </li>
                    <li className={styles.userMenuItem}>
                        <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
                    </li>
                    <li className={styles.userMenuItem}>
                        고객센터
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;