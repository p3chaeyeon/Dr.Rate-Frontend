import React, { useEffect, useState } from 'react';
import styles from './CompareModal.module.scss';
import { PATH } from 'src/utils/path';

import useCheckedBanks from 'src/hooks/useCheckedBanks';
import {banks, products} from 'src/apis/productsAPI';

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
        addPrdCo
    } = useCheckedBanks(banks, limit, openAlertModal);
    


    /* 필터 기능 */
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');

    // 은행 체크박스, 검색창 필터링 
    const filterProductsByBanks = () => {
        let filtered = checkedBanks.length === 0 || checkedBanks.includes(null)
            ? products  // '전체' 선택이면 모든 상품 표시
            : products.filter(product => checkedBanks.includes(product.bankCode));  // 선택된 은행에 해당하는 상품만 필터링
        
        if (search) {
            filtered = filtered.filter(product => 
                product.productName.toLowerCase().includes(search.toLowerCase()) || 
                product.bankName.toLowerCase().includes(search.toLowerCase())
            );
        }
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




    // 상품 선택
    const addComparePrd = (addPrdCo) => {

        if(addPrdCo.length === 0) {
            openAlertModal('선택한 상품이 없습니다','상품을 선택해주세요.' );
        }else{
            const productsToAdd = Array.isArray(addPrdCo) ? addPrdCo : [addPrdCo];
    
            // 서버 연결되면 수정
             Promise.all(productsToAdd.map(product =>
                axios.post(`${PATH.SERVER}/product/compare/add`, { productId: product.id })
            ))
            .then(response => {
                console.log( response);
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
                <div key={index} 
                className={`${styles.product} ${addPrdCo.includes(product.prdCo) ? styles.selected : ''}`}
                onClick={() => handleAddProduct(product)}>
                    <div className={styles.productbox}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.bankName} Logo`} 
                        />
                        <div className={styles.productText}>
                            <span className={styles.bankName}>{product.bankName}</span>
                            <span className={styles.productName}>{product.productName}</span>
                        </div>
                    </div>
                    <div className={styles.rate}>
                        <span className={styles.spclrate}>{product.spclrate}</span>
                        <span className={styles.basicRate}>{product.basicRate}</span>
                    </div>
                </div>
                )) : <span>상품이 없습니다.</span>
            }
            </div>

            <div className={styles.addPrd}>
                {addProduct.map((product, index) => (
                    <div className={styles.addProduct} key={index}>
                        <img 
                            src={`${PATH.STORAGE_BANK}/${product.bankLogo}`} 
                            className={styles.bankLogo} 
                            alt={`${product.bankName} Logo`} 
                        />
                        <div className={styles.productText}>
                            <span className={styles.productName}>{product.productName}</span>
                        </div>
                        
                        <div className={styles.deleteBtn} onClick={() => deletePrd(product)}>X</div>
                    </div>
                ))}
            </div>

            <div className={styles.buttonContainer}>
                <button onClick={() => addComparePrd(addPrdCo)} className={styles.compareButton}>추가</button>
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