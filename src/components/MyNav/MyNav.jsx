/* src/components/MyNav/MyNav.jsx */

import React, { useState } from 'react';
import styles from './MyNav.module.scss';
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path";
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';


const MyNav = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav id="MyNav" className={styles.myNav}>
            <ul className={styles.myMenuList}>
                <li className={styles.myMenuItem} onClick={toggleDropdown}>
                    즐겨찾기
                    <img src={downArrowIcon} alt="Down arrow" className={styles.downArrow} />
                    {isDropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            <li className={styles.dropdownItem} onClick={() => navigate(PATH.SAVINGS)}>
                                예금 즐겨찾기
                            </li>
                            <li className={styles.dropdownItem} onClick={() => navigate(PATH.INSTALLMENT)}>
                                적금 즐겨찾기
                            </li>
                        </ul>
                    )}
                </li>
                <li className={styles.myMenuItem} onClick={() => navigate(PATH.MY)}>
                    회원 정보
                </li>
                <li className={styles.myMenuItem} onClick={() => navigate(PATH.MY_CALENDAR)}>
                    적금 달력
                </li>
            </ul>
        </nav>
    );
};

export default MyNav;
