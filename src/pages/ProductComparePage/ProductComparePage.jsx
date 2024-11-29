import styles from './ProductComparePage.module.scss';
import historyIcon from 'src/assets/icons/rightArrow.svg';
import { PATH } from 'src/utils/path';

import React from 'react';

const ProductComparePage = () => {

    const bankLogo ='wooriLogo.png';

    return (
        <main>
            <section>
                <p className={styles.history}>
                    <span>즐겨찾기</span> 
                    <img src={historyIcon}/>
                    <span className={styles.historyAction}>예금</span>
                </p>
                
                <div className={styles.compareDiv}>
                    <div className={styles.comparePrd}>
                        <div className={styles.deleteBtnX}>X</div>
                        <img src={`/src/assets/bank/${bankLogo}`} className={styles.bankLogo}/>
                        <p className={styles.compareTitle}>
                            <span className={styles.bankName}>우리은행</span>
                            <span className={styles.prdName}>우리은행의 행복 적금</span>
                        </p>

                        <p className={styles.rate}>
                            <span className={styles.spclRate}>최고 0.0 %</span>
                            <span className={styles.basicRate}>기본금리 0.0 %</span>
                        </p>

                        <table className={styles.compareDetailTable}>
                            <tbody>
                            <tr>
                                <td>가입대상</td>
                                <td>만 19 이상 만 29세 미만</td>
                            </tr>
                            <tr>
                                <td>가입방식</td>
                                <td>영업점, 스마트뱅킹</td>
                            </tr>
                            <tr>
                                <td>금액한도</td>
                                <td>100,000 원</td>
                            </tr>
                            <tr>
                                <td>이자계산방식</td>
                                <td>단리</td>
                            </tr>
                            <tr>
                                <td>적금기간</td>
                                <td>6개월, 12개월, 36개월</td>
                            </tr>
                            </tbody>
                        </table>

                        <div className={styles.btn}>
                            <button className={styles.deleteBtn}>삭제</button>
                            <button className={styles.joinBtn}>가입하기</button>
                        </div>
                    </div>
                    
                    <div className={styles.comparePrd}>
                        <div className={styles.deleteBtnX}>X</div>
                        <img src={`/src/assets/bank/${bankLogo}`} className={styles.bankLogo}/>
                        <p className={styles.compareTitle}>
                            <span className={styles.bankName}>우리은행</span>
                            <span className={styles.prdName}>우리은행의 행복 적금</span>
                        </p>

                        <p className={styles.rate}>
                            <span className={styles.spclRate}>최고 0.0 %</span>
                            <span className={styles.basicRate}>기본금리 0.0 %</span>
                        </p>

                        <table className={styles.compareDetailTable}>
                            <tbody>
                            <tr>
                                <td>가입대상</td>
                                <td>만 19 이상 만 29세 미만</td>
                            </tr>
                            <tr>
                                <td>가입방식</td>
                                <td>영업점, 스마트뱅킹</td>
                            </tr>
                            <tr>
                                <td>금액한도</td>
                                <td>100,000 원</td>
                            </tr>
                            <tr>
                                <td>이자계산방식</td>
                                <td>단리</td>
                            </tr>
                            <tr>
                                <td>적금기간</td>
                                <td>6개월, 12개월, 36개월</td>
                            </tr>
                            </tbody>
                        </table>

                        <div className={styles.btn}>
                            <button className={styles.deleteBtn}>삭제</button>
                            <button className={styles.joinBtn}>가입하기</button>
                        </div>
                    </div>
                    
                    <div className={`${styles.comparePrd} ${styles.noneComparePrd}`}>
                        <div className={styles.addComparePrd}>+</div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ProductComparePage;