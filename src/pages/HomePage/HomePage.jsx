// src/pages/HomePage/HomePage.jsx

import styles from "./HomePage.module.scss";
import { useNavigate } from "react-router-dom";
import { PATH } from "src/utils/path"; // 상대경로 '../../utils/path'
import React from "react";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <main>
            {/* HomePage 는 양쪽 여백 없이 꽉 채우기 */}
            <div className={styles.homeMain}>
                <div className={styles.homeTitle}>
                    <div className={styles.titleText}>한눈에</div>
                    <div className={styles.titleBlue}>
                        <div className={styles.titleText}>예</div>
                        <div className={styles.titleDot}>•</div>
                        <div className={styles.titleText}>적금</div>
                    </div>
                    <div className={styles.titleText}>비교</div>
                </div>

            </div>
            <section>
                여기가 section
            </section>
        </main>
    );
};

export default HomePage;
