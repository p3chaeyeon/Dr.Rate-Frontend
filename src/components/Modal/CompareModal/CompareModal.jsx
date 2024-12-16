import React, { useEffect, useState } from 'react';
import { PATH } from 'src/utils/path';

import styles from './CompareModal.module.scss';

import useCheckedBanks from 'src/hooks/useCheckedBanks';
import {banks, getAllProducts} from 'src/apis/productsAPI';

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

    const bankCodes = [10001, 10927, 11625, 13175, 13909, 15130, 17801];
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const fetchAllProduct = async () => {
            try {
                const allProduts = await getAllProducts();

                const updatedProducts = allProduts.map(product => {
                    if (!bankCodes.includes(product.product.bankCo)) {
                        return {
                            ...product,
                            product: {
                                ...product.product,
                                bankCo: 10000  // bankCo를 10000으로 변경
                            }
                        };
                    }
                    return product; // bankCo가 포함되어 있으면 그대로 반환
                });

                const sortedProducts = updatedProducts.map(product => {
                    const maxOption = product.options.reduce((max, option) => {
                        return option.spclRate > max.spclRate ? option : max;
                    }, product.options[0]);
    
                    return {
                        ...product,
                        maxSpclRate: maxOption.spclRate,  // 가장 높은 spclRate를 maxSpclRate로 저장
                    };
                }).sort((a, b) => b.maxSpclRate - a.maxSpclRate);

                setProducts(sortedProducts);

            } catch (error) {
                console.error("Failed to fetch product details:", error);
            }
        };

        if (products.length > 0) {
            filterProductsByBanks();
            console.log(products);
        }

        fetchAllProduct();
    }, []);

    //Alert 훅
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
    
    // checkbox 훅
    const limit = 3-listLength;
    const { 
        checkedBanks, 
        handleCheckboxChange,
        handleAddProduct,
        deletePrd,
        addProduct,
        addPrdId
    } = useCheckedBanks(banks, limit, openAlertModal);
    


    /* 필터 기능 */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');

    // 은행 체크박스, 검색창 필터링 
    const filterProductsByBanks = () => {
        let filtered = checkedBanks.length === 0 || checkedBanks.includes(null)
            ? products
            : products.filter(product => checkedBanks.includes(product.product.bankCo));
        
        if (search) {
            filtered = filtered.filter(product => 
                product.product.prdName.toLowerCase().includes(search.toLowerCase()) || 
                product.product.bankName.toLowerCase().includes(search.toLowerCase())
            );
        }

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
        console.log(filteredProducts);
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



    /* 상품 선택 */
    const addComparePrd = (addPrdId) => {

        if(addPrdId.length === 0) {
            openAlertModal('선택한 상품이 없습니다','상품을 선택해주세요.' );
        }else{
            const productsToAdd = Array.isArray(addPrdId) ? addPrdId : [addPrdId];
    
            // 서버 연결되면 수정
             Promise.all(productsToAdd.map(product =>
                axios.post(`${PATH.SERVER}/product/compare/add`, { prdId: product.id })
            ))
            .then(response => {
                console.log(response);
                closeModal();
            })
            .catch(error => {
                console.error(error);
            });

        }
    };

    return (
        <div
        className={styles.compareModal}
        onClick={handleBackgroundClick}
        >
        
        <div className={styles.compareModalContent}>
            <h2 className={styles.mainTitle}>{title}</h2>

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
                     <span className={`${styles.customCheckbox} ${checkedBanks.includes(bank.code) || (bank.code === null && checkedBanks.length > 7) ? styles.checked : styles.nonChecked}`}>
                     {bank.name}
                     </span>
                   </label>
                 </div>
                ))}
            </div>
            
            <div className={styles.search}>
                <input type='text' name='search' id='search' className={styles.inputSearch} onChange={handleSearch} />
                <img src=''/>
            </div>

            <div className={styles.listTitle}>
                <span className={styles.title}>적금 리스트</span>
                <span className={styles.soft}>정렬은 기본 금리순</span>
            </div>

            <div className={styles.list}>
            {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
                
                <div key={product.product.id} 
                className={`${styles.product} ${addPrdId.includes(product.product.id) ? styles.selected : ''}`}
                onClick={() => handleAddProduct(product)}>
                    <div className={styles.productbox}>{console.log(addPrdId)}
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

            <div className={styles.addPrd}>
                {addProduct.map((product, index) => (
                    <div className={styles.addProduct} key={product.product.id}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.product.bankName} Logo`} 
                        />
                        <div className={styles.productText}>
                            <span className={styles.productName}>{product.product.prdName}</span>
                        </div>
                        
                        <div className={styles.deleteBtn} onClick={() => deletePrd(product)}>X</div>
                    </div>
                ))}
            </div>

            <div className={styles.buttonContainer}>
                <button onClick={() => addComparePrd(addPrdId)} className={styles.compareButton}>추가</button>
                <button onClick={onCancel} className={styles.cancelButton}>취소</button>
            </div>
        </div>
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
        </div>
    );
};

export default CompareModal;