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
    const [EffectRefresh, setEffectRefresh] = useState(false);



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

        setProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter(product => product.product.id !== prdId)

            if(ctg === "d"){
                localStorage.setItem('depCompareList', JSON.stringify(updatedProducts));
            } else if(ctg === "i"){
                localStorage.setItem('insCompareList', JSON.stringify(updatedProducts));
            }

            return updatedProducts;
        });
    }

    /* 상품 불러오기 */
    useEffect(() => {
        if(EffectRefresh){
            setEffectRefresh(false);
        }

        fetchcompare();

    }, [EffectRefresh, ctg]);

    const fetchcompare = () => {
        const fetchCompareProducts = () => {
            let compareList;
            if(ctg === "d"){
                compareList = JSON.parse(localStorage.getItem('depCompareList')) || [];
            } else if(ctg === "i"){
                compareList = JSON.parse(localStorage.getItem('insCompareList')) || [];
            }

            setProducts(compareList);
        };
    
        fetchCompareProducts();
    }

    const formatNumber = (num) => Math.floor(num).toLocaleString();

    const handleChangeIndex = (prdId, index) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.product.id === prdId
                    ? {
                          ...product,
                          index: index,
                      }
                    : product
            )
        );
    };

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
                                <div className={styles.deleteBtnX} onClick={() => handleDelete(product.product.id)}>X</div>
                            </div>
                            <img src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} className={styles.bankLogo} alt="Bank Logo" />
                            <p className={styles.compareTitle}>
                                <span className={styles.bankName}>{product.product.bankName}</span>
                                <span className={styles.prdName}>{product.product.prdName}</span>
                            </p>

                            <p className={styles.rate}>
                                <span className={styles.spclRate}>최고 {product.options[product.index].spclRate} %</span>
                                <span className={styles.basicRate}>기본금리 {product.options[product.index].basicRate} %</span>
                            </p>

                            <div className={styles.compareDetailTable}>
                                    <p>
                                        <span>가입대상</span>
                                        <span>{product.product.joinMember}</span>
                                    </p>
                                    <p>
                                        <span>가입방식</span>
                                        <span>{product.product.joinWay}</span>
                                    </p>
                                    <p>
                                        <span>금액한도</span>
                                        <span>{product.product.max === null ? '한도 없음' : `${formatNumber(product.product.max)} 원`}</span>
                                    </p>
                                    <p>
                                        <span>이자계산방식</span>
                                        <span>{product.options[product.index].rateTypeKo}</span>
                                    </p>
                                    <p>
                                        <span>적금기간</span>
                                        <span>{product.options[product.index].saveTime} 개월</span>
                                    </p>
                                    <p>
                                    <span>옵션</span>
                                        <select
                                            onChange={(e) => handleChangeIndex(product.product.id, Number(e.target.value))}
                                            value={product.index}
                                            className={styles.selectOptions}
                                        >
                                            {product.options.map((item, index) => (
                                                <option key={index} value={index}>
                                                    {item.saveTime} 개월 | {item.rateTypeKo} | {item.rsrvTypeName}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                            </div>

                            <div className={styles.btn}>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(product.product.id)}>삭제</button>
                                <button className={styles.joinBtn} >가입하기</button>
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
                    closeModal={() => { closeCompareModal();  setEffectRefresh(true); }}
                    title={compareContent.title}
                    listLength={products.length}
                    message={
                        <>
                            {compareContent.message}
                        </>
                    }
                    onCompare={compareContent.onCompare}
                    onCancel={compareContent.onCancel}
                    ctg={ctg}
                />
                )}
            </section>
        </main>
    );
};

export default ProductComparePage;