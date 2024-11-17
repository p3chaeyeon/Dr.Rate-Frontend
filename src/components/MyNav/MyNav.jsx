/* src/components/MyNav/MyNav.jsx */


import styles from './MyNav.module.scss';
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path";
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';


const MyNav = () => {
    const navigate = useNavigate();

    return (
        <nav id="MyNav" className={styles.myNav}>
            <ul className={styles.myMenuList}>
                <li className={styles.myMenuItem}>
                    즐겨찾기
                    <img src={downArrowIcon} alt="Down arrow" className={styles.downArrow} />
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
