import AlertModal from 'src/components/Modal/AlertModal';
import useModal from 'src/hooks/useModal';

import downArrowIcon1 from 'src/assets/icons/downDetailArrow.svg';

import styles from './RateCalc.module.scss';
import useCalc from 'src/hooks/useCalc';

import React, { useEffect, useState } from 'react';
import { atom, useAtom } from 'jotai';

const RateCalc = ({isOpen, conditions, options}) => {
    
  const {basicRate, products, rateType, saveTime} = options || {};
  const {ctg, max} = products || {};

  const [isOpenResult, setIsOpenResult] = useState(false);

  const handleToggle = () => {
    setIsOpenResult((prev) => !prev);
  }

  // useModal 훅
  const { 
    isAlertOpen, 
    openAlertModal, 
    closeAlertModal, 
    alertContent 
  } = useModal();

  // 취소 클릭 시
  const handleCancel = () => {
    closeAlertModal();
 };

  // useCalc 훅
  const {
    total,
    spcl,
    rate,
    totalPrincipal, 
    totalInterest, 
    afterTaxInterest, 
    totalAmount,
    deposit,
    setDeposit,
    formatNumber,
    onChangeRateTotal,
    modalOpen,
  } = useCalc({ basicRate, products, rateType, saveTime, max });

  const getInputTitle = () => (ctg === 'd' ? "총 저축 금액" : "월 저축 금액");
  const getInputTitle2 = () => (ctg === 'd' ? "총" : "월");



  const [value, setValue] = useState(formatNumber(max/10000));

  const formatInputNumber = (input) => {
    const rawValue = input.replace(/[^\d]/g, '');
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  
  const handleChange = (e) => {
    const formattedValue = formatInputNumber(e.target.value);
    setValue(formattedValue);
  };

   // 월 적립 금액 입력값 처리
  const handleInputChange = (e) => {
    const input = e.target.value;
    const number = input.replace(/,/g, '').replace(/[^\d.]/g, '');

    if (number === '') {
      setDeposit(''); // 빈값을 그대로 설정
      return;
    }

    if (isNaN(number)) {
      openAlertModal('입력 오류', '숫자만 입력해 주세요.');
      e.target.value = '';
      setDeposit(0);
      return;
    }
    
    const value = parseFloat(number);

    if (max !== null) {
      if (value > max / 10000) {
        openAlertModal('입력 오류',`최대 한도금액은 ${formatNumber(max / 10000)} 만원 입니다.` );
        e.target.value = max / 10000;
      } else if (value < 0) {
        openAlertModal('입력 오류','최소 금액은 1 만원 입니다.' );
        e.target.value = 0;
      }
    } else {
      if (value > 1000000) {
        openAlertModal('입력 오류','최대 입력 한도를 초과했습니다.' );
        e.target.value = 1000000;
      } else if (value < 0) {
        openAlertModal('입력 오류','최소 금액은 1 만원 입니다.' );
        e.target.value = 0;
      }
    }
    setDeposit(Number(value));
  };

  return (
    <div className={`${styles.serviceDiv} ${isOpen ? styles.close : styles.open}`}>

        <div className={styles.serviceInput}>
          <p>
              <span className={styles.serviceMonthTitle}>{getInputTitle()}</span>
              <span className={styles.serviceMonthTitleInput}>
                  <input type='text' placeholder={getInputTitle()}
                  className={styles.inputType} value={value} onChange={(e) => {handleInputChange(e); handleChange(e)}} /> 만원
              </span>
          </p>
          <p className={styles.scpl_total_rateTitle}>
              <span className={styles.scpl_total_rate}>금리 {rate} %</span>
          </p>
          <p className={styles.scpl_total_ratesub}>
              <span>기본 금리 {basicRate} % + <span className={styles.spclStyle}>우대금리 {spcl} %</span></span>
          </p>
          <p className={styles.totalTitle}>
              {getInputTitle2()} <span className={styles.monthM}>{formatNumber(deposit)} 만원( 총 {saveTime} 개월 )</span>적립 시, 
              <span className={styles.serviceMonthTotal}>총 금액 {formatNumber(total)}원</span>
          </p>
          
          <span onClick={handleToggle} className={styles.btnResult}>자세히 <img src={downArrowIcon1} className={`${styles.downArrowIcon1} ${isOpenResult ? styles.rotated : ''}`} /></span>
          {isOpenResult && (
            <div className={styles.resultDiv}>
            <p className={styles.result}>
              <div><span>원금합계</span><span>{formatNumber(totalPrincipal)} 원</span></div>
              <div><span>세전이자</span><span>{formatNumber(totalInterest)} 원</span></div>
              <div><span>이자과세(15.4%)</span><span>{formatNumber(afterTaxInterest)} 원</span></div>
              <div><span>{rateType === 'S' ? '단리' : '복리'} {rate}%, 일반과세 기준</span><span className={styles.amount}>{formatNumber(totalAmount)} 원</span></div>
            </p>
            </div>
          )}
          
        </div>

        <div className={styles.scpl_rate_title}>
            <p>
                <span>우대 금리가 반영된 금리</span>
            </p>
            
              <ul className={styles.toggle_ul}>
              {Array.isArray(conditions) && conditions.length > 0 ? (
                conditions.map((condition, index) => (
                  <li key={index}>
                    <span className={styles.description}>{condition.description}</span>
                    <p>
                      <span>{condition.rate} %</span>
                      <span>
                        <input 
                          type="checkbox" 
                          className={styles.toggleBtn} 
                          value={condition.rate} 
                          id={index} 
                          onChange={onChangeRateTotal}
                        />
                        <label htmlFor={index}></label>
                      </span>
                    </p>
                  </li>
                ))
              ) : (
                <li><span>해당사항 없음</span></li> // 조건이 없을 경우 표시할 내용
              )}
              </ul>
            
        </div>

        {/* Confirm Modal을 사용할 때 */}
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

export default RateCalc;