/* src/pages/ProductListPage/ProductListPage.jsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DepositListPage.module.scss';
import { PATH } from 'src/utils/path';
import { useSession } from 'src/hooks/useSession';
import useProductList from 'src/hooks/useProductList';
import xIcon from 'src/assets/icons/xIcon.svg';
import ConfirmModal from 'src/components/Modal/ConfirmModal';
import useModal from 'src/hooks/useModal';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';
import spinner from 'src/assets/icons/spinner.gif';


const productData = [
  {
    "prdId": 71,
    "bankLogo": "kookminLogo.png",
    "bankName": "국민은행",
    "prdName": "KB 특★한 예금",
    "spclRate": 6.0,
    "basicRate": 2.0
  },
  {
    "prdId": 72,
    "bankLogo": "kookminLogo.png",
    "bankName": "국민은행",
    "prdName": "KB차차차 예금",
    "spclRate": 8.0,
    "basicRate": 2.50
  },
  {
    "prdId": 73,
    "bankLogo": "shinhanLogo.png",
    "bankName": "신한은행",
    "prdName": "신한 알.쏠 예금",
    "spclRate": 4.2,
    "basicRate": 2.9
  },
  {
    "prdId": 74,
    "bankLogo": "nonghyupLogo.png",
    "bankName": "농협은행주식회사",
    "prdName": "NH올원e 미니예금",
    "spclRate": 4.45,
    "basicRate": 2.75
  },
  {
    "prdId": 75,
    "bankLogo": "nonghyupLogo.png",
    "bankName": "농협은행주식회사",
    "prdName": "NH1934월복리예금",
    "spclRate": 6.40,
    "basicRate": 2.9
  },
];



const DepositListPage = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useSession();

  const {
    loading,
    error,
    banks,
    handleBankChange,
    removeBank,
    rate,
    handleRateClick,
    join,
    handleJoinClick,
    age,
    handleAgeChange,
    period,
    handlePeriodChange,
    sort,
    handleSortClick,
    currentPage,
    handlePageChange,
    totalPages,
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
          예금
        </div>

        <div className={styles.filterDiv}>
          <div className={styles.commonFilterDiv}>
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

            <div
              className={`${styles.bankSelectedContainer} ${banks.length > 0 ? styles.hasItems : ""
                }`}
            >
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


          {!isLoggedIn ? (
            <>
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
            </>
          ) : (
            <>
              <div className={styles.memberFilterContainer}>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>나이</div>
                  <input
                    type="number"
                    className={`${styles.memberFilterInput} ${styles.noPointer}`}
                    placeholder="예시 : 28"
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
                    <option value="3">3개월 이상</option>
                    <option value="6">6개월 이상</option>
                    <option value="12">12개월 이상</option>
                  </select>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>이자 계산 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${rate === "단리" ? styles.active : ""
                        }`}
                      onClick={() => handleRateClick("단리")}
                    >
                      단리
                    </button>
                    <button
                      className={`${styles.toggleButton} ${rate === "복리" ? styles.active : ""
                        }`}
                      onClick={() => handleRateClick("복리")}
                    >
                      복리
                    </button>
                  </div>
                </div>
                <div className={styles.memberFilterItemDiv}>
                  <div className={styles.memberFilterItem}>가입 방식</div>
                  <div className={styles.toggleButtonGroup}>
                    <button
                      className={`${styles.toggleButton} ${join === "대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinClick("대면")}
                    >
                      대면
                    </button>
                    <button
                      className={`${styles.toggleButton} ${join === "비대면" ? styles.active : ""
                        }`}
                      onClick={() => handleJoinClick("비대면")}
                    >
                      비대면
                    </button>
                  </div>
                </div>
              </div>{/* memberFilterContainer */}
            </>
          )}
        </div>{/* filterDiv */}


        {/* 금리순 정렬 */}
        <div className={styles.rateStandard}>
          <li
            className={`${styles.standardItem} ${sort === "spclRate" ? styles.active : ""
              }`}
            onClick={() => handleSortClick("spclRate")}
          >
            최고 금리순
          </li>
          <li className={styles.standardItem}>
            <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
          </li>
          <li
            className={`${styles.standardItem} ${sort === "baseRate" ? styles.active : ""
              }`}
            onClick={() => handleSortClick("baseRate")}
          >
            기본 금리순
          </li>
        </div>{/* rateStandard */}


        {/* 상태에 따라 내부 내용만 바뀜 */}
        {/* {loading &&
            <div className={styles.errorDiv}>
                <img className={styles.loadingImg} src={spinner} alt="loading" />
            </div>}
        {error && <div className={styles.errorDiv}>데이터를 불러오는 중 에러가 발생했습니다.</div>} */}

        {/* 정상 데이터 로드 */}
        {/* {!loading && !error && ( */}
        <div className={styles.productListDiv}>
          {/* 즐겨찾기 데이터가 없을 경우 메시지 출력 */}
          {/* {productData.length === 0 ? ( */}
          {/* <div className={styles.noProductList}>
                        <h4>상품이 없습니다.</h4>
                    </div> */}
          {/*  ) : ( */}
          {/* 상품품 데이터가 있을 경우 리스트 출력 */}
          {productData.map((item, index) => (
            <div key={index} className={styles.productList}>
              <input type="hidden" value={item.prdId} readOnly />
              <div className={styles.productLogoDiv}>
                <img
                  src={`${PATH.STORAGE_BANK}/${item.bankLogo}`}
                  alt={`${item.bankName} 로고`}
                  className={styles.productLogoImg}
                />
              </div>
              <div className={styles.productInfoDiv}>
                <div className={styles.productBankProDiv}>
                  <div className={styles.productBank}>{item.bankName}</div>
                  <div className={styles.productPro}>{item.prdName}</div>
                </div>
                <div className={styles.productRateDiv}>
                  <div className={styles.productHighestRateDiv}>
                    <div className={styles.productHighestRateText}>최고금리</div>
                    <div className={styles.productHighestRatePer}>
                      <span className={styles.spclRate}>{item.spclRate.toFixed(2)}</span>%
                    </div>
                  </div>
                  <div className={styles.productSBaseRateDiv}>
                    <div className={styles.productBaseRateText}>기본금리</div>
                    <div className={styles.productBaseRatePer}>
                      <span className={styles.basicRate}>{item.basicRate.toFixed(2)}</span>%
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.productBtnDiv}>
                <button
                  className={styles.productCompareBtn}
                >
                  비교<br />담기
                </button>
              </div>
            </div>
          ))}
          {/* )} */}
        </div>{/* productListDiv */}
        {/* )} */}

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <div className={styles.pageBtn}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index)}
                className={currentPage === index ? styles.active : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </button>
          </div>
        </div>


      </section>

    </main>
  );
};

export default DepositListPage;

