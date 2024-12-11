import React, { useEffect, useState } from 'react';
import styles from './CompareModal.module.scss';
import { PATH } from 'src/utils/path';

import useCheckedBanks from 'src/hooks/useCheckedBanks';
import {banks, products} from 'src/apis/productsAPI';

const CompareModal = ({isOpen, closeModal, title, onCancel, onCompare, listLength}) => {
    if(!isOpen) return null;

    const handleBackgroundClick = (e) => {
        // 배경 클릭으로 모달 닫기
        if (e.target.classList.contains(styles.compareModal)) {
          closeModal();
        }
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
    } = useCheckedBanks(banks, limit);

    const [filteredProducts, setFilteredProducts] = useState([]);

    /* 은행 필터링 */
    const filterProductsByBanks = () => {
        const filtered = checkedBanks.length === 0 || checkedBanks.includes(null)
            ? products  // '전체' 선택이면 모든 상품 표시
            : products.filter(product => checkedBanks.includes(product.bankCode));  // 선택된 은행에 해당하는 상품만 필터링
        setFilteredProducts(filtered);
    };

    useEffect(() => {
        filterProductsByBanks();
    }, [checkedBanks]);


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
                <input type='text' name='search' id='search' className={styles.inputSearch} />
                <img src=''/>
            </div>

            <div className={styles.listTitle}>
                <span className={styles.title}>적금 리스트</span>
                <span className={styles.soft}>정렬은 기본 금리순</span>
            </div>

            <div className={styles.list}>
            {filteredProducts.map((product, index) => (
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
                ))}
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
                <button onClick={onCompare} className={styles.compareButton}>추가</button>
                <button onClick={onCancel} className={styles.cancelButton}>취소</button>
            </div>
        </div>
        </div>
    );
};

export default CompareModal;