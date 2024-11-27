import RateCalc from 'src/components/RateCalc';
import styles from './ProductDetailPage.module.scss';
import downArrowIcon2 from 'src/assets/icons/downDetailArrow.svg';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PATH } from "src/utils/path";

const ProductDetailPage = () => {
    const id = 1;

    useEffect(() => {
        axios.get(`${PATH.SERVER}/product/getOneProduct/${id}`)
            .then((res) => {
                setProducts(res.data)
                console.log(res.data)
            })
            .catch((e) => console.log(e))
    },[]);
    
    // 상품 상세정보
    const [products, setProducts] = useState({
        optionNum : {},
        options: [],
        product : {},
        conditions : []
        }
    );

    // 객체 변환
    const i = products.optionNum;
    const options = products.options; 
    const product = options.length > 0 ? options[i].products : "null";
    const conditions = products.conditions;
    
    //이자 계산기
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };


    return (
        <main>
            <section>
                <h3 className={styles.title}>{product.ctg === 'i' ? '적금' : '예금'}</h3>
                <div className={styles.topDiv}>
                    <div className={styles.image}><img src={`/src/assets/bank/${product.bankLogo}`} /></div>
                    <div className={styles.name}>
                        <p className={styles.nameOne}>{product.bankName}</p>
                        <p className={styles.nameTwo}>{product.prdName}</p>

                        <p className={styles.nameThree}>{options?.[i]?.rsrvTypeName ?? '자유적립식'}</p>
                    </div>
                    <div className={styles.rate}>
                        <p className={styles.rateOne}>{options?.[i]?.spclRate ? `최고 ${options[i].spclRate} %` : '우대조건 해당사항 없음'}</p>
                        <p className={styles.rateTwo}>기본금리 {options?.[i]?.basicRate ?? '금리 정보 없음'} %</p>
                    </div>
                </div>

                <div className={styles.btnDiv}>
                    <button className={styles.heartIcon}><span className={styles.heart}>&hearts;</span> 즐겨찾기</button>
                    <button className={styles.intobtn}>비교담기</button>
                    <button className={styles.gotoHomePage} onClick={() =>window.open(product.url, '_blank')}>가입하기</button>
                </div>

                {isOpen || (
                <div className={`${styles.serviceDiv} ${isOpen ? styles.open : ''}`} onClick={handleToggle}>
                    <span className={styles.serviceOne}>이자계산기</span>
                    <span className={styles.serviceTwo}>자세히 <img src={downArrowIcon2} className={styles.downArrowIcon2}/></span>
                </div>
                )}

                {isOpen && (
                    <RateCalc isOpen={isOpen} options={options[i]} conditions={conditions}  onClose={handleToggle}/>
                )}

                <div className={styles.detailDiv}>
                    <h3 className={styles.detailTitle}>상세정보</h3>
                    <ul>
                        <li>
                            <span>가입대상 / 가입제한</span>
                            <p>{product.joinMember}</p>
                        </li>
                        <li>
                            <span>가입기간 / 가입금액</span>
                            <p>{product.etc}</p>
                        </li>
                        <li>
                            <span>납입금액</span>
                            <p>최대 {product.max || '금액 제한없음'}</p>
                        </li>
                        <li>
                            <span>적용이율</span>
                            
                            <table className={styles.rateTable}>
                            <thead>
                                <tr>
                                    <td>기간</td>
                                    <td>기본금리</td>
                                    <td>최대금리</td>
                                </tr>
                            </thead>
                            <tbody>
                            {options.map((option, index) => (
                                <tr key={index}>
                                    <td>{option.saveTime} 개월</td>
                                    <td>{option.basicRate}%</td>
                                    <td>{option.spclRate}%</td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                            
                        </li>
                        <li>
                            <span>이율 적용 방식</span>
                            
                            <table className={styles.rateTypeTable}>
                                <thead>
                                <tr>
                                    <td>기간</td>
                                    <td>이자 적용 방법</td>
                                    <td>적립 방식</td>
                                </tr>
                                </thead>
                            <tbody>
                            {options.map((option, index) => (
                                <tr key={index}>
                                    <td>{option.saveTime} 개월</td>
                                    <td>{option.rateTypeKo}</td>
                                    <td>{option.rsrvTypeName && option.rsrvTypeName}</td>
                                </tr>
                            ))}
                            </tbody>
                            </table>
                            
                        </li>
                        <li>
                            <span>이자 계산 방법</span>
                            
                            <table className={styles.rateCalcTable}>
                                <thead>
                                <tr>
                                    <td>계산 방법</td>
                                    <td>계산식</td>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>단리 계산 (적금)</td>
                                        <td>월 적립액 × 10000 × 이자율 × 기간</td>
                                    </tr>
                                    <tr>
                                        <td>복리 계산 (적금)</td>
                                        <td>(월 적립액 × 10000) × ((1 + (이자율 × 0.01) / 12) ^ (12 × 기간) - 1) / (이자율 / 12)</td>
                                    </tr>
                                    <tr>
                                        <td>단리 계산 (예금)</td>
                                        <td>월 적립액 × 10000 × 이자율 × 기간</td>
                                    </tr>
                                    <tr>
                                        <td>복리 계산 (예금)</td>
                                        <td>(월 적립액 × 10000) × (1 + (이자율 × 0.01) / 12) ^ (12 × 기간)</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                        </li>
                        <li>
                            <span>만기 후 이율</span>
                            <p className={styles.mtrtInt}>{product.mtrtInt}</p>
                        </li>
                        <li>
                            <span>우대조건</span>
                            <p className={styles.spclCnd}>{product.spclCnd}</p>
                        </li>
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default ProductDetailPage;