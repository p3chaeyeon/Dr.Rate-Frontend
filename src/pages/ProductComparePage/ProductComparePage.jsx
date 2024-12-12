import styles from './ProductComparePage.module.scss';
import historyIcon from 'src/assets/icons/rightArrow.svg';

import CompareModal from 'src/components/Modal/CompareModal';
import useModal from 'src/hooks/useCompare';

import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';
import { useParams } from 'react-router-dom';

const ProductComparePage = () => {
    
    // 경로에서 받은 ctg 값
    const { ctg } = useParams();
    // 비교 상품 리스트
    const [products, setProducts] = useState([]);



    /* Compare 훅 */
    const {
        isCompareOpen,
        openCompareModal,
        closeCompareModal,
        compareContent
    } = useModal();

    const handleToggle = () => {
        openCompareModal(
            ctg == 'd' ? '예금' : '적금',
            handleCompare,
            handleCancel
        );
    }

    // 확인 클릭 시
    const handleCompare = () => {
        closeCompareModal();
    };

    // 취소 클릭 시
    const handleCancel = () => {
        closeCompareModal();
    };




    // 비교 상품 삭제
    const handleDelete = (prdId) => {
        setProducts((prevProducts) => 
            prevProducts.filter(product => product.prdId !== prdId)
        );
    }

    /* 상품 불러오기 */
    // const { products, optionNum, options, product, conditions } = useProducts(id);
    useEffect(() => {
        const simulatedProducts = [
            {
                prdId : 1,
                bankName: '국민은행',
                bankLogo: 'kookminLogo.png',
                productName: '국민은행의 적금',
                maxRate: '0.0%',
                basicRate: '0.0%',
                target: '만 19 이상 만 29세 미만',
                joinMethod: '영업점, 스마트뱅킹',
                limit: '100,000 원',
                interestType: '단리',
                period: '6개월, 12개월, 36개월'
            },
            {
                prdId : 2,
                bankName: '우리은행',
                bankLogo: 'wooriLogo.png',
                productName: '우리은행의 행복 적금',
                maxRate: '0.0%',
                basicRate: '0.0%',
                target: '만 19 이상 만 29세 미만',
                joinMethod: '영업점, 스마트뱅킹',
                limit: '100,000 원',
                interestType: '단리',
                period: '6개월, 12개월, 36개월'
            },
            {
                prdId : 3,
                bankName: '토스은행',
                bankLogo: 'tossLogo.png',
                productName: '토스은행의 한달 적금',
                maxRate: '0.0%',
                basicRate: '0.0%',
                target: '만 19 이상 만 29세 미만',
                joinMethod: '영업점, 스마트뱅킹',
                limit: '100,000 원',
                interestType: '단리',
                period: '6개월, 12개월, 36개월'
            }
        ];
        setProducts(simulatedProducts);
    }, []);

    return (
        <main>
            <section className={styles.compareSection}>
                <p className={styles.history}>
                    <span>즐겨찾기</span> 
                    <img src={historyIcon}/>
                    <span className={styles.historyAction}>{ctg == 'd' ? '예금' : '적금'}</span>
                </p>
                
                <div className={styles.compareDiv}>
                     {products.length > 0 && products.slice(0, 3).map((product, index) => (
                        <div key={index} className={styles.comparePrd}>
                            <div className={styles.dtnDiv}>
                                <div className={styles.deleteBtnX} onClick={() => handleDelete(product.prdId)}>X</div>
                            </div>
                            <img src={`${PATH.STORAGE_BANK}/${product.bankLogo}`} className={styles.bankLogo} alt="Bank Logo" />
                            <p className={styles.compareTitle}>
                                <span className={styles.bankName}>{product.bankName}</span>
                                <span className={styles.prdName}>{product.productName}</span>
                            </p>

                            <p className={styles.rate}>
                                <span className={styles.spclRate}>최고 {product.maxRate}</span>
                                <span className={styles.basicRate}>기본금리 {product.basicRate}</span>
                            </p>

                            <div className={styles.compareDetailTable}>
                                    <p>
                                        <span>가입대상</span>
                                        <span>{product.target}</span>
                                    </p>
                                    <p>
                                        <span>가입방식</span>
                                        <span>{product.joinMethod}</span>
                                    </p>
                                    <p>
                                        <span>금액한도</span>
                                        <span>{product.limit}</span>
                                    </p>
                                    <p>
                                        <span>이자계산방식</span>
                                        <span>{product.interestType}</span>
                                    </p>
                                    <p>
                                        <span>적금기간</span>
                                        <span>{product.period}</span>
                                    </p>
                            </div>

                            <div className={styles.btn}>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(product.prdId)}>삭제</button>
                                <button className={styles.joinBtn}>가입하기</button>
                            </div>
                        </div>
                    ))}

                    {products.length < 3 && (
                        <div className={`${styles.comparePrd} ${styles.noneComparePrd}`}>
                            <div className={styles.addComparePrd}  onClick={handleToggle}>+</div>
                        </div>
                    )}
                </div>
                {isCompareOpen && (
                <CompareModal
                    isOpen={isCompareOpen}
                    closeModal={closeCompareModal}
                    title={compareContent.title}
                    listLength={products.length}
                    message={
                        <>
                            {compareContent.message}
                        </>
                    }
                    onCompare={compareContent.onCompare}
                    onCancel={compareContent.onCancel}
                />
                )}
            </section>
        </main>
    );
};

export default ProductComparePage;