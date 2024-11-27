import styles from './RateCalc.module.scss';

import React, { useState } from 'react';

const RateCalc = ({isOpen, onClose, conditions, options}) => {
    const {id, basicRate, products, rateType, rateTypeKo, rsrvType, rsrvTypeName, saveTime, spclRate} = options || {};

    const [monthM, setMonthM] = useState(products.max === null ? 100 : products.max / 10000); // 월 적립금액
    const [total, setTotal] = useState(0); // 총 세후 금액
    const [accountType, setAccountType] = useState(products.ctg); // 예금(d) / 적금(i)
    const [interestType, setInterestType] = useState(rateType); // 단리(M) / 복리(S)

    let result = 0;
    const [r, setR] = useState(basicRate); // 이자율 (4% 예시)
    const [spcl, setSpcl] = useState(0); // 적용된 우대금리
    const t = saveTime/12;    // 기간 (1년 예시)
    const months = saveTime;  // 이자 개월 주기 (1년 = 12개월)

    const taxRate = 0.154;  // 세율 (15.4%)
  
     // 단리 계산 (적금)
    const calculateSimpleInterestForSavings = (P, r, t, months) => {
      const annualInterest = P * 10000 * (r*0.01) * t;  // 월 적립액 * 10000 (만원을 원으로) * 이자율 * 기간
      const afterTaxInterest = annualInterest * (1 - taxRate);
      return afterTaxInterest + (P * 10000 * months);
    };

    // 복리 계산 (적금)
    const calculateCompoundInterestForSavings = (P, r, t, months) => {
      const compoundInterest = (P * 10000) * ((Math.pow(1 + (r*0.01) / 12, 12 * t) - 1) / (r / 12)); // 복리 계산식
      const afterTaxInterest = compoundInterest * (1 - taxRate);
      return afterTaxInterest + (P * 10000 * months); 
    };

    // 단리 계산 (예금)
    const calculateSimpleInterestForDeposit = (P, r, t) => {
      const annualInterest = P * 10000 * (r*0.01) * t;  // 월 적립액 * 10000 (만원을 원으로) * 이자율 * 기간
      const afterTaxInterest = annualInterest * (1 - taxRate);
      return afterTaxInterest + (P * 10000 * t); 
    };

    // 복리 계산 (예금)
    const calculateCompoundInterestForDeposit = (P, r, t) => {
        const compoundInterest = (P * 10000) * Math.pow(1 + (r*0.01) / 12, 12 * t);  // 복리 계산식
        const afterTaxInterest = compoundInterest * (1 - taxRate);
        return afterTaxInterest + (P * 10000 * t);
    };

    // #,### 형식
    const formatNumber = (num) => {
      return Math.floor(num).toLocaleString(); // 소수점 아래를 버림
    };

    // 계산 함수
    const calculateInterest = () => {

    if (accountType === 'd') { // 예금 계산
      if (interestType === 'M') {
        result = calculateSimpleInterestForDeposit(monthM, r, t);
      } else if (interestType === 'S') {
        result = calculateCompoundInterestForDeposit(monthM, r, t);
      }
    } else if (accountType === 'i') { // 적금 계산
      if (interestType === 'M') {
        result = calculateSimpleInterestForSavings(monthM, r, t, months);
      } else if (interestType === 'S') {
        result = calculateCompoundInterestForSavings(monthM, r, t, months);
      }
    }

    // 세후 이자를 더한 총 금액을 계산하여 설정
    setTotal(result);
  };

  // onChange 이벤트 핸들러
  const handleInputChange = (e) => {
    const value = e.target.value;

    if(products.max != null){
      if(value > products.max/10000){
        alert('최대값' + products.max/10000 + '만원 입니다.');
        e.target.value = products.max/10000;
      }else if(value < 1) {
        alert('0 이하로는 입력할 수 없습니다.');
        e.target.value = 1;
      }
    }else{
      if(value > 1000000){
        alert('100억 이하의 값만 가능합니다.');
        e.target.value = 1000000;
      }else if(value < 1) {
        alert('0 이하로는 입력할 수 없습니다.');
        e.target.value = 1;
      }
    }
    
    setMonthM(Number(e.target.value));

  };

  // 월 적립 금액이 변경되면 이자 계산 실행
  React.useEffect(() => {
    calculateInterest();
  }, [monthM, r]);

  // 예금일 때와 적금일 때 텍스트 구분
  const getInputTitle = () => {
    return accountType === 'd' ? "총 저축 금액" : "월 저축 금액";
  };

  const getInputTitle2 = () => {
    return accountType === 'd' ? "총" : "월";
  };

  
  //우대조건 적용
  const onChangeRateTotal = (e) => {
    const value = parseFloat(e.target.value);

    // 계산 후 소수점 둘째 자리까지 반올림
    if (e.target.checked) {
        setR((prevR) => parseFloat((prevR + value).toFixed(2))); // 소수점 둘째 자리로 반올림
        setSpcl(parseFloat((spcl + value).toFixed(2)));
    } else {
        setR((prevR) => parseFloat((prevR - value).toFixed(2))); // 소수점 둘째 자리로 반올림
        setSpcl(parseFloat((spcl - value).toFixed(2)));
    }
};

  return (
    <div className={`${styles.serviceDiv} ${isOpen ? styles.open : ''}`}>
      <div className={styles.serviceTop} onClick={onClose}>
          <span className={styles.serviceOne}>이자계산기</span>
          <span className={styles.serviceTwo}>자세히</span>
        </div>

        <div className={styles.serviceInput}>
          <p>
              <span className={styles.serviceMonthTitle}>{getInputTitle()}</span>
              <span className={styles.serviceMonthTitleInput}>
                  <input type="number" placeholder={getInputTitle()}
                  className={styles.inputType} id="monthM" onChange={handleInputChange} /> 만원
              </span>
          </p>
          <p className={styles.scpl_total_rateTitle}>
              <span className={styles.scpl_total_rate}>금리 {r} %</span>
          </p>
          <p className={styles.scpl_total_ratesub}>
              <span>기본 금리 {basicRate} % + <span className={styles.spclStyle}>우대금리 {spcl} %</span></span>
          </p>
          <p className={styles.totalTitle}>
              {getInputTitle2()} <span className={styles.monthM}>{formatNumber(monthM)} 만원( 총 {saveTime} 개월 )</span>적립 시, 
              <span className={styles.serviceMonthTotal}>총 금액 {formatNumber(total)}원</span>
          </p>
          
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
                  </li>
                ))
              ) : (
                <li><span>해당사항 없음</span></li> // 조건이 없을 경우 표시할 내용
              )}
              </ul>
            
        </div>
    </div>
  );
};

export default RateCalc;