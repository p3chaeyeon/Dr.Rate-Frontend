/* src/pages/ProductListPage/ProductListPage.jsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductInsListPage.module.scss';
import { PATH } from 'src/utils/path';
import useProductList from 'src/hooks/useProductList';
import xIcon from 'src/assets/icons/xIcon.svg';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from "src/hooks/useModal"; 


const ProductInsListPage = () => {
  const navigate = useNavigate();

  const {
    selectedBanks,
    handleBankChange,
    removeBank,
  } = useProductList();

  const {
    isConfirmOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmContent,
  } = useModal();

    // Confirm Modal 로그인 클릭 시
    const handleLoginClick = () => {
      closeConfirmModal();
      navigate(PATH.SIGN_IN);
    };
  
    // Confirm Modal 확인 클릭 시
    const handleConfirm = () => {
      closeConfirmModal();
      navigate(PATH.SIGN_UP);
    };
  
    // Confirm Modal 취소 클릭 시
    const handleCancel = () => {
      closeConfirmModal();
    };


  const handleOpenConfirmModal = () => {
    const confirmMessage = (
        <>
          회원가입을 하면 나에게 딱 맞는 상품을 검색하고,  <br />
          추천받을 수 있어요! <br />
          이미 회원이세요?
          <span onClick={handleLoginClick}>로그인</span>
        </>
      );

    openConfirmModal('회원가입 하시겠습니까?', confirmMessage, handleConfirm, handleCancel);
  };


  return (
    <main>
      <section className={styles.listSection}>
        <div className={styles.listTitleDiv}>
          적금
        </div>

        <div className={styles.filterDiv}>
          <div className={styles.commitFilterDiv}>
            <div className={styles.bankSelectContainer}>
              <div className={styles.bank}>은행</div>
              <select
                className={styles.bankSelect}
                defaultValue=""
                onChange={handleBankChange}
              >
                <option value="" disabled>
                  은행 선택
                </option>
                <option value="우리은행">우리은행</option>
                <option value="신한은행">신한은행</option>
                <option value="하나은행">하나은행</option>
                <option value="국민은행">국민은행</option>
                <option value="토스뱅크">토스뱅크</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="농협은행">농협은행</option>
              </select>
            </div>

            <div className={styles.bankSelectedContainer}>
              {selectedBanks.length > 0 ? (
                selectedBanks.map((bank, index) => (
                  <div
                    key={index}
                    className={styles.bankSelectedItemDiv}
                  >
                    <div className={styles.selectedBankItem}>
                      {bank}
                    </div>
                    <div
                      className={styles.bankSelectedBtn}
                      onClick={() => removeBank(bank)}
                    >
                      <img src={xIcon} alt="x" />
                    </div>
                  </div>
                ))
              ) : null}
            </div>
          </div> {/* commitFilterDiv */}


          <div className={styles.nonMemberFilterContainer}>
            {/* ConfirmModal */}
            <ConfirmModal
              isOpen={isConfirmOpen}           
              closeModal={closeConfirmModal}   
              title={confirmContent.title}     
              message={confirmContent.message} 
              onConfirm={confirmContent.onConfirm} 
              onCancel={confirmContent.onCancel}   
            />
            <p className={styles.nonMemberMessage}>
              나에게 맞는 예금 상품이 궁금하다면?<span onClick={handleOpenConfirmModal}>Click</span>
            </p>
          </div>{/* nonMemberFilterContainer */}




        <div className={styles.memberFilterContainer}>
          <div className={styles.memberFilterItemDiv}>
            <div className={styles.memberFilterItem}>나이</div>
            <div className={styles.memberFilterInput}></div>
          </div>
          <div className={styles.memberFilterItemDiv}>
            <div className={styles.memberFilterItem}>저축 예정 기간</div>
            <div className={styles.memberFilterInput}></div>
          </div>
          <div className={styles.memberFilterItemDiv}>
            <div className={styles.memberFilterItem}>이자 계산 방식</div>
            <div className={styles.memberFilterInput}></div>
          </div>
          <div className={styles.memberFilterItemDiv}>
            <div className={styles.memberFilterItem}>가입 방식</div>
            <div className={styles.memberFilterInput}></div>
          </div>

        </div>{/* memberFilterContainer */}

        </div>{/* filterDiv */}



      </section>

    </main>
  );
};

export default ProductInsListPage;

