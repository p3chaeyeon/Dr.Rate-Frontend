import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './My1v1InquirePage.module.scss';
import { PATH } from "src/utils/path";
import MyNav from 'src/components/MyNav'; 

const My1v1InquirePage = () => {
    const navigate = useNavigate();
    
    return (
        <main>
            <MyNav />

            <section className={ styles.my1v1InquireSection }>
                <div className={styles.inquireTypeContainer}>
                    <div className={styles.inquireTypeDiv}>
                        <div 
                            className={styles.inquireType}
                            onClick={() => navigate(PATH.MY_EMAIL_INQUIRE)}
                        >
                            이메일 문의
                        </div>
                        <div 
                            className={styles.inquireType}
                            onClick={() => navigate(PATH.MY_1V1_INQUIRE)}
                        >
                            1:1 문의

                        </div>
                    </div>
                </div>
            </section>
        
        
        </main>
    );
};

export default My1v1InquirePage;