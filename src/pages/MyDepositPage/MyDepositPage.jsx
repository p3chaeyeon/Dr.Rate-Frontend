import styles from './MyDepositPage.module.scss';
import React, { useEffect } from 'react';
import { PATH } from "src/utils/path";
import MyNav from 'src/components/MyNav';
import FavoritePanel from 'src/components/FavoritePanel';
import useMyFavorite from 'src/hooks/useMyFavorite';

const favoriteData = [
    {
        bank_logo: 'kookminLogo.png',
        bank_name: '국민은행',
        prd_name: '국민수퍼정기예금 (CD금리연동형)',
        spcl_rate: '4.2',
        basic_rate: '3.32'
    },
    {
        bank_logo: 'kookminLogo.png',
        bank_name: '국민은행',
        prd_name: 'KB Star 정기예금',
        spcl_rate: '4.1',
        basic_rate: '3.2'
    },
    {
        bank_logo: 'shinhanLogo.png',
        bank_name: '신한은행',
        prd_name: '신한프리미어 토지보상 정기예금',
        spcl_rate: '4.0',
        basic_rate: '3.3'
    }
];

/* src/pages/MyDepositPage/MyDepositPage.jsx */
const MyDepositPage = () => {

    const favoriteDataLength = favoriteData.length;
    const { individualChecked, handleIndividualCheck } = useMyFavorite(favoriteDataLength);

    return (
        <main>
            <MyNav />

            <section className={styles.favoriteSection}>
            <FavoritePanel favoriteDataLength={favoriteDataLength} />

                {/* src/pages/MyDepositPage/MyDepositPage.jsx */}
                <div className={styles.favoriteListDiv}>
                    {favoriteData.map((item, index) => (
                        <div key={index} className={styles.favoriteList}>
                            <input
                                type="checkbox"
                                name="check"
                                className={styles.check}
                                checked={individualChecked[index] || false}
                                onChange={(e) =>
                                    handleIndividualCheck(index, e.target.checked)
                                }
                            />
                            <div className={styles.favoriteLogoDiv}>
                                {/* img 'src/assets/bank/' + '파일명' 으로 src/assets/bank 폴더에서 이미지 가져옴 */}
                                <img
                                    src={`${PATH.STORAGE_BANK}/${item.bank_logo}`}
                                    alt={`${item.bank_name} 로고`}
                                    className={styles.favoriteLogoImg}
                                />
                            </div>
                            <div className={styles.favoriteInfoDiv}>
                                <div className={styles.favoriteBankProDiv}>
                                    <div className={styles.favoriteBank}>{item.bank_name}</div>
                                    <div className={styles.favoritePro}>{item.prd_name}</div>
                                </div>
                                <div className={styles.favoriteRateDiv}>
                                    <div className={styles.favoriteHighestRateDiv}>
                                        <div className={styles.favoriteHighestRateText}>최고금리</div>
                                        <div className={styles.favoriteHighestRatePer}><span className={styles.spcl_rate}>{item.spcl_rate}</span>%</div>
                                    </div>
                                    <div className={styles.favoriteSBaseRateDiv}>
                                        <div className={styles.favoriteBaseRateText}>기본금리</div>
                                        <div className={styles.favoriteBaseRatePer}><span className={styles.basic_rate}>{item.basic_rate}</span>%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}

export default MyDepositPage;
