import styles from './ProductDetailPage.module.scss';
import RateCalc from 'src/pages/ProductDetailPage/RateCalc';
import downArrowIcon2 from 'src/assets/icons/downDetailArrow.svg';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from 'src/hooks/useModal';

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PATH } from "src/utils/path";
import { atom, useAtom } from 'jotai';

// Jotai 상태 관리
const idAtom = atom(2);
const productsAtom = atom({
    optionNum: {},
    options: [],
    product: {},
    conditions: [],
}); 
const isOpenAtom = atom(false);

const ProductDetailPage = () => {
    const navigate = useNavigate();

    // Jotai 상태 관리
    const [id, setId] = useAtom(idAtom);
    const [products, setProducts] = useAtom(productsAtom);
    const [isOpen, setIsOpen] = useAtom(isOpenAtom); //이자 계산기

    //useModal 훅
    const {
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent
    } = useModal();
    

    // 상품 정보 불러오기
    useEffect(() => {
        axios.get(`${PATH.SERVER}/product/getOneProduct/${id}`)
            .then((res) => {
                setProducts({
                    optionNum: res.data.optionNum,
                    options: res.data.options,
                    product: res.data.product,
                    conditions: res.data.conditions
                });
                console.log(res.data);
            })
            .catch((e) => console.log(e));
    }, [id]);
    

    // 객체 변환
    const i = products.optionNum;
    const options = products.options; 
    const product = options.length > 0 ? options[i].products : "null";
    const conditions = products.conditions;

    // 이자 계산기
    const handleToggle = () => {
        // Test 용
        const isUserLoggedIn = sessionStorage.getItem('userLoggedIn');

        // session값 맏아오면 변경해야됨
        if (!isUserLoggedIn) {
            setIsOpen((prev) => !prev);
        } else {
            openConfirmModal(
                '회원가입 하시겠습니까?', 
                '로그인 후 이자계산기를 사용할 수 있어요! '
            );
        }
        
    };

    // 로그인 클릭 시
    const handleLoginClick = () => {
        navigate(PATH.HOME);
        closeConfirmModal();
    };

    // 확인 클릭 시
    const handleConfirm = () => {
        navigate(PATH.HOME);
        closeConfirmModal();
    };

    // 취소 클릭 시
    const handleCancel = () => {
        closeConfirmModal();
    };

    // Test용
    const getSessionToken = () => {
        return localStorage.getItem('sessionToken'); // Or use a cookie or another method
    };

    // 즐겨찾기 넣기
    const favoriteInsert = () => {
        const sessionToken = 'se';//getSessionToken();

        axios.post(`${PATH.SERVER}/product/favoriteInsert/${id}`, null, {
            headers: {'userId' : `${sessionToken}`}
        })
        .then(response => console.log(response.data))
        .catch(e => console.log(e))
    }


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
                    <button className={styles.heartIcon} onClick={favoriteInsert}><span className={styles.heart}>&hearts;</span> 즐겨찾기</button>
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

                {/* Confirm Modal을 사용할 때 */}
                {isConfirmOpen && (
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    closeModal={closeConfirmModal}
                    title={confirmContent.title}
                    message={
                        <>
                            {confirmContent.message}
                            <p>
                                <span>이미 회원이세요? </span> <span className={styles.arrow}>  </span>
                                <span className={styles.modalLogin} onClick={handleLoginClick}>로그인</span>
                            </p>
                        </>
                    }
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
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
                            <span>적용이율 / 적용방식</span>
                            
                            <table className={styles.rateTable}>
                            <thead>
                                <tr>
                                    <td>기간</td>
                                    <td>기본금리</td>
                                    <td>최대금리</td>
                                    <td>이자 적용 방법</td>
                                    <td>적립 방식</td>
                                </tr>
                            </thead>
                            <tbody>
                            {options.map((option, index) => (
                                <tr key={index}>
                                    <td>{option.saveTime} 개월</td>
                                    <td>{option.basicRate}%</td>
                                    <td>{option.spclRate}%</td>
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