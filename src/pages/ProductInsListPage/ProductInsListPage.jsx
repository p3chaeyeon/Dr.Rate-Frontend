/* src/pages/ProductListPage/ProductListPage.jsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductInsListPage.module.scss';
import { PATH } from 'src/utils/path';
import { useSession } from 'src/hooks/useSession';
import useProductList from 'src/hooks/useProductList';
import xIcon from 'src/assets/icons/xIcon.svg';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from "src/hooks/useModal";
import verticalDividerIcon from "src/assets/icons/verticalDivider.svg";


const ProductInsListPage = () => {
  const navigate = useNavigate();

  const { isLoggedIn, clearSession } = useSession();

  const {
    banks,
    handleBankChange,
    removeBank,
    interestMethod,
    handleInterestMethodClick,
    joinMethod,
    handleJoinMethodClick,
    age,
    handleAgeChange,
    period,
    handlePeriodChange,
    sortMethod,
    handleSortMethodClick,
  } = useProductList();

  const {
    isConfirmOpen,
    openConfirmModal,
    closeConfirmModal,
    confirmContent,
  } = useModal();

  /* Confirm Modal 로그인 클릭 시 */
  const handleLoginClick = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_IN);
  };

  /* Confirm Modal 확인 클릭 시 */
  const handleConfirm = () => {
    closeConfirmModal();
    navigate(PATH.SIGN_UP);
  };

  /* Confirm Modal 취소 클릭 시 */
  const handleCancel = () => {
    closeConfirmModal();
  };


  const handleOpenConfirmModal = () => {
    const confirmMessage = (
      <>
        회원가입을 하면 나에게 딱 맞는 상품을  <br />
        검색하고, 추천받을 수 있어요! <br />
        이미 회원이세요?
        <span
          onClick={handleLoginClick}
          className={styles.loginLink}
        >
          로그인
        </span>
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
                value={banks.length > 0 ? banks[banks.length - 1] : ""}
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
                <option value="기타">기타</option>
              </select>
            </div>

            <div className={styles.bankSelectedContainer}>
              {banks.length > 0 ? (
                banks.map((bank, index) => (
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


          {/* {!isLoggedIn ? (
            <> */}
              <div className={styles.nonMemberFilterContainer}>
                <div className={styles.nonMemberMessage}>
                  나에게 맞는 예금 상품이 궁금하다면?
                  <span onClick={handleOpenConfirmModal} className={styles.click}>Click</span>

                  {/* ConfirmModal */}
                  <ConfirmModal
                    isOpen={isConfirmOpen}
                    closeModal={closeConfirmModal}
                    title={confirmContent.title}
                    message={confirmContent.message}
                    onConfirm={confirmContent.onConfirm}
                    onCancel={confirmContent.onCancel}
                  />
                </div>
              </div> {/* nonMemberFilterContainer */}
            {/* </>
          ) : (
            <> */}
              <div className={styles.memberFilterContainer}>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>나이</div>
                  <input
                    type="number"
                    className={`${styles.memberFilterInput} ${styles.noPointer}`}
                    placeholder="생년월일(ex:19991109)"
                    value={age}
                    onChange={handleAgeChange}
                  />
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>저축 예정 기간</div>
                  <select
                    className={styles.memberFilterInput}
                    value={period}
                    onChange={handlePeriodChange}
                  >
                    <option value="3개월">3개월</option>
                    <option value="6개월">6개월</option>
                    <option value="12개월">12개월</option>
                    <option value="24개월">24개월</option>
                  </select>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>이자 계산 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${interestMethod === "단리" ? styles.active : ""
                        }`}
                      onClick={() => handleInterestMethodClick("단리")}
                    >
                      단리
                    </button>
                    <button
                      className={`${styles.toggleButton} ${interestMethod === "복리" ? styles.active : ""
                        }`}
                      onClick={() => handleInterestMethodClick("복리")}
                    >
                      복리
                    </button>
                  </div>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>가입 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${joinMethod === "대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinMethodClick("대면")}
                    >
                      대면
                    </button>
                    <button
                      className={`${styles.toggleButton} ${joinMethod === "비대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinMethodClick("비대면")}
                    >
                      비대면
                    </button>
                  </div>
                </div>
              </div>{/* memberFilterContainer */}
            {/* </>
          )} */}
        </div>{/* filterDiv */}


        {/* 금리순 정렬 */}
        <div className={styles.rateStandard}>
          <li
            className={`${styles.standardItem} ${
              sortMethod === "spclRate" ? styles.active : ""
            }`}
            onClick={() => handleSortMethodClick("spclRate")}
          >
            최고 금리순
          </li>
          <li className={styles.standardItem}>
              <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
          </li>
          <li
            className={`${styles.standardItem} ${
              sortMethod === "baseRate" ? styles.active : ""
            }`}
            onClick={() => handleSortMethodClick("baseRate")}
          >
            기본 금리순
          </li>
        </div>{/* rateStandard */}


      </section>

    </main>
  );
};

export default ProductInsListPage;

