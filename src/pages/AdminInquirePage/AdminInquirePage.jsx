import React from 'react';
import styles from './AdminInquirePage.module.scss';

const AdminInquirePage = () => {
    return (
        <div className={styles.adminInquireBody}>
            <div className={styles.adminInquireMain}>
                <div className={styles.adminInquireMainHeader}>
                    <h3><span>User</span>님과의 1:1 문의</h3>
                </div>
                <div className={styles.adminInquireMainChat}>
                    <div className={styles.phoneContainer}>
                        <div className={styles.phoneScreen}>
                            <div className={styles.chatMessage}>
                                <div className={styles.chatBubble}>
                                    안녕하세요. 문의 드릴게 있어서요..
                                </div>
                            </div>
                            <div className={`${styles.chatMessage} ${styles.myMessage}`}>
                                <div className={styles.chatBubble}>
                                    네~ 말씀해주세요!
                                </div>
                            </div>
                            <div className={styles.chatMessage}>
                                <div className={styles.chatBubble}>
                                    회원 가입이 제대로 안되네요?
                                </div>
                            </div>
                        </div>
                        <div className={styles.phoneScreenInput}>
                            <div className={styles.phoneScreenInputArea}>
                                <input id='input-message' type='text' placeholder='메세지 입력'></input>
                                <button className={styles.sendButton}></button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminInquirePage;
