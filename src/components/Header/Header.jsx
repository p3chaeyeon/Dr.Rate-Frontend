import styles from './Header.module.scss';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from "src/utils/path";
import headerLogo from 'src/assets/images/headerLogo.png';
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';
import useDropdown from 'src/hooks/useDropdown';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isDropdownOpen, dropdownRef, handleMouseEnter, handleMouseLeave } = useDropdown();

    // 현재 경로 확인 함수
    const isPathActive = (path, category) => {
        if (location.pathname.includes(path)) {
            const searchParams = new URLSearchParams(location.search);
            return searchParams.get('category') === category;
        }
        return false;
    };

    return (
        <header>
            <div className={styles.logoDiv} onClick={() => navigate(PATH.HOME)}>
                <img src={headerLogo} alt="header logo" className={styles.headerLogo} />
            </div>

            <nav className={styles.mainNav} >
                <ul className={styles.mainMenuList}>
                    <li 
                        className={styles.mainMenuItem} 
                        // onClick={() => navigate(`${PATH.PRODUCT_DETAIL}?category=i`)}
                        style={{
                            color: isPathActive(PATH.PRODUCT_DETAIL, 'i') ? 'var(--main)' : 'inherit',
                        }}                    
                    >
                        예금
                    </li>
                    <li 
                        className={styles.mainMenuItem}
                        // onClick={() => navigate(`${PATH.PRODUCT_DETAIL}?category=d`)}
                        style={{
                            color: isPathActive(PATH.PRODUCT_DETAIL, 'd') ? 'var(--main)' : 'inherit',
                        }}

                    >
                        적금
                    </li>
                    <li 
                        className={styles.mainMenuItem}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}                     
                    >
                        비교
                        <img src={downArrowIcon} alt="Down arrow" className={styles.headerDownArrow} />
                        {isDropdownOpen && (
                        <ul className={styles.HeaderDropdownMenu} ref={dropdownRef}>
                            <li className={styles.HeaderDropdownItem} onClick={() => navigate(PATH.MY_DEPOSIT)}>
                                예금 비교
                            </li>
                            <li className={styles.HeaderDropdownItem} onClick={() => navigate(PATH.MY_INSTALLMENT)}>
                                적금 비교
                            </li>
                        </ul>
                    )}                        
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
                    <li className={styles.userMenuItem}  onClick={() => navigate(PATH.MY_DEPOSIT)}>
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