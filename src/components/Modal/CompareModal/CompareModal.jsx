import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';

import styles from './CompareModal.module.scss';

import useCheckedBanks from 'src/hooks/useCheckedBanks';
import {banks, getAllProducts} from 'src/apis/productsAPI';
import {saveCompareProducts} from 'src/apis/compareAPI';

import AlertModal from 'src/components/Modal/AlertModal';
import useModal from 'src/hooks/useModal';

const CompareModal = ({isOpen, closeModal, title, onCancel, onCompare, listLength}) => {
    if(!isOpen) return null;
    
    /* 모달 배경창 닫기 */
    const handleBackgroundClick = (e) => {
        if (e.target.classList.contains(styles.compareModal)) {
            closeModal();
        }
    };


    
    /* Alert 훅 */
    const {
        isAlertOpen, 
        openAlertModal, 
        closeAlertModal, 
        alertContent
    } = useModal();
    
    // Alert 취소 클릭 시
    const handleCancel = () => {
        closeAlertModal();
    };
    
    /* checkbox 훅 */
    const limit = 3-listLength;
    const { 
        checkedBanks, 
        handleCheckboxChange,
        handleAddProduct,
        deletePrd,
        addProduct,
        addPrdId
    } = useCheckedBanks(banks, limit, openAlertModal);


    

    /* 은행 코드 */
    const bankCodes = [10001, 10927, 11625, 13175, 13909, 15130, 17801];
    /* 상품 */
    const [products, setProducts] = useState([]);
    
    /* APIS GETALLPRODUCTS */
    useEffect(() => {
        const fetchAllProduct = async () => {
            try {
                const allProduts = await getAllProducts();

                // 기타 은행 코드 변경
                const updatedProducts = allProduts.map(product => {
                    if (!bankCodes.includes(product.product.bankCo)) {
                        return {
                            ...product,
                            product: {
                                ...product.product,
                                bankCo: 10000
                            }
                        };
                    }
                    return product;
                });

                // 최고 금리 옵션 추가 및 정렬
                const sortedProducts = updatedProducts.map(product => {
                    const maxOption = product.options.reduce((max, option) => {
                        return option.spclRate > max.spclRate ? option : max;
                    }, product.options[0]);
    
                    return {
                        ...product,
                        maxSpclRate: maxOption.spclRate,
                    };
                }).sort((a, b) => b.maxSpclRate - a.maxSpclRate);

                setProducts(sortedProducts);

            } catch (error) {
                console.error(error);
            }
        };

        fetchAllProduct();
    }, []);




    /* 필터 기능 */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');

    // 은행 체크박스, 검색창 필터링 
    const filterProductsByBanks = () => {
        let filtered = checkedBanks.length === 0 || checkedBanks.includes(null)
            ? products
            : products.filter(product => checkedBanks.includes(product.product.bankCo));
        
        // 검색
        if (search) {
            filtered = filtered.filter(product => 
                product.product.prdName.toLowerCase().includes(search.toLowerCase()) || 
                product.product.bankName.toLowerCase().includes(search.toLowerCase())
            );
        }

        // 정렬
        filtered = filtered.map(product => {
            const spcl = product.options.reduce((max, option) => {
                return option.spclRate > max.spclRate ? option : max;
            }, product.options[0]);

            return {
                ...product,
                maxOption : spcl
            }
        })

        filtered.sort((a, b) => {
            return b.spclRate - a.spclRate
        });
        
        setFilteredProducts(filtered);
    };

    // 검색 핸들러
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    // 필터 적용
    useEffect(() => {
        filterProductsByBanks();
    }, [checkedBanks, search]);

    // 상품 로드 후 필터링 및 정렬
    useEffect(() => {
        if (products.length > 0) {
            filterProductsByBanks();
        }
    }, [products]);





    /* 상품 추가 */
    const addComparePrd = async (addPrdId) => {

        if(addPrdId.length === 0) {
            openAlertModal('선택한 상품이 없습니다','상품을 선택해주세요.' );
        }else{
            try {
                const response = await saveCompareProducts(addPrdId);
                
                console.log('비교 항목 추가 성공:', response);
                closeModal(); 

            } catch (error) {
                console.error('상품 비교 추가 실패:', error);
                openAlertModal('오류 발생', '상품 비교 추가에 실패했습니다.');
            }
        }
    };

    return (
        <div
        className={styles.compareModal}
        onClick={handleBackgroundClick}
        >
        
        {/* Alert 모달창 */}
        {isAlertOpen && (
            <AlertModal
                isOpen={isAlertOpen}
                closeModal={closeAlertModal}
                title={alertContent.title}
                message={
                    <>
                        {alertContent.message}
                    </>
                }
                onCancel={handleCancel}
            />
        )}

        <div className={styles.compareModalContent}>
            <h2 className={styles.mainTitle}>{title}</h2>

            {/* 체크박스 */}
            <div className={styles.bankList}>
                {banks.map((bank, key) => (
                   <div key={key} className={styles.bank}>
                   <label className={styles.checkboxContainer}>
                     <input
                       type='checkbox'
                       value={bank.name}
                       checked={bank.code === null ? checkedBanks.length > 7 : checkedBanks.includes(bank.code)}
                       onChange={handleCheckboxChange}
                       className={styles.checkbox}
                     />
                     <span className={`${styles.customCheckbox} 
                        ${checkedBanks.includes(bank.code) || (bank.code === null && checkedBanks.length > 7) 
                        ? styles.checked : styles.nonChecked}`
                    }>{bank.name}</span>
                   </label>
                 </div>
                ))}
            </div>
            
            {/* 검색창 */}
            <div className={styles.search}>
                <input type='text' name='search' id='search' className={styles.inputSearch} onChange={handleSearch} />
                <img src=''/>
            </div>

            {/* Title */}
            <div className={styles.listTitle}>
                <span className={styles.title}>적금 리스트</span>
                <span className={styles.soft}>정렬은 기본 금리순</span>
            </div>

            {/* 상품 리스트 */}
            <div className={styles.list}>
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                
                <div key={product.product.id} 
                className={`${styles.product} ${addPrdId.includes(product.product.id) ? styles.selected : ''}`}
                onClick={() => handleAddProduct(product)}>
                    <div className={styles.productbox}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.product.bankName} Logo`} 
                        />
                        <div className={styles.productText}>
                            <span className={styles.bankName}>{product.product.bankName}</span>
                            <span className={styles.productName}>{product.product.prdName}</span>
                        </div>
                    </div>
                    <div className={styles.rate}>
                        <span className={styles.spclrate}>최고금리 {product.maxOption.spclRate}%</span>
                        <span className={styles.basicRate}>기본금리 {product.maxOption .basicRate}%</span>
                    </div>
                </div>
                )) : <span>상품이 없습니다.</span>
            }
            </div>

            {/* 추가 상품 */}
            <div className={styles.addPrd}>
                {addProduct.map((product, index) => (
                    <div className={styles.addProduct} key={product.id}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.bankName} Logo`} 
                        />
                        <div className={styles.productText}>
                            <span className={styles.productName}>{product.prdName}</span>
                        </div>
                        
                        <div className={styles.deleteBtn} onClick={() => deletePrd(product)}>X</div>
                    </div>
                ))}
            </div>

            {/* 버튼 */}
            <div className={styles.buttonContainer}>
                <button onClick={() => addComparePrd(addPrdId)} className={styles.compareButton}>추가</button>
                <button onClick={onCancel} className={styles.cancelButton}>취소</button>
            </div>
        
        </div>
        </div>
    );
};

export default CompareModal;