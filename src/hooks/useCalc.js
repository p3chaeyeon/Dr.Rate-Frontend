import { useState, useEffect } from 'react';
import { atom, useAtom } from 'jotai';

// Jotai 상태 관리
const totalAtom = atom(0);
const spclAtom = atom(0);

const useCalc = ({ basicRate, products, rateType, saveTime, max }) => {

  // 총합계
  const [total, setTotal] = useAtom(totalAtom);
  // 우대금리
  const [spcl, setSpcl] = useAtom(spclAtom);

  const [monthM, setMonthM] = useState(max === null ? 100 : max / 10000);
  const [r, setR] = useState(basicRate);

  const t = saveTime / 12; // 년도 변환(12개월 -> 1년)
  const months = saveTime; // 기간(개월)
  const taxRate = 0.154; // 세율 (15.4%)

  let result = 0;

  // 단리 계산 (적금)
  const calculateSimpleInterestForSavings = (P, r, t, months) => {
    const annualInterest = P * 10000 * (r * 0.01) * t;
    const afterTaxInterest = annualInterest * (1 - taxRate);
    return afterTaxInterest + (P * 10000 * months);
  };

  // 복리 계산 (적금)
  const calculateCompoundInterestForSavings = (P, r, t, months) => {
    const compoundInterest = (P * 10000) * ((Math.pow(1 + (r * 0.01) / 12, 12 * t) - 1) / (r / 12)); 
    const afterTaxInterest = compoundInterest * (1 - taxRate);
    return afterTaxInterest + (P * 10000 * months); 
  };

  // 단리 계산 (예금)
  const calculateSimpleInterestForDeposit = (P, r, t) => {
    const annualInterest = P * 10000 * (r * 0.01) * t;
    const afterTaxInterest = annualInterest * (1 - taxRate);
    return afterTaxInterest + (P * 10000 * t); 
  };

  // 복리 계산 (예금)
  const calculateCompoundInterestForDeposit = (P, r, t) => {
    const compoundInterest = (P * 10000) * Math.pow(1 + (r * 0.01) / 12, 12 * t);
    const afterTaxInterest = compoundInterest * (1 - taxRate);
    return afterTaxInterest + (P * 10000 * t);
  };

  // 숫자 변형 #,###
  const formatNumber = (num) => Math.floor(num).toLocaleString(); // Round down the decimal part

  // 이자 계산 함수
  const calculateInterest = () => {
    // 예금
    if (products.ctg === 'd') {
      if (rateType === 'M') {
        result = calculateSimpleInterestForDeposit(monthM, r, t);
      } else if (rateType === 'S') {
        result = calculateCompoundInterestForDeposit(monthM, r, t);
      }
    // 적금
    } else if (products.ctg === 'i') {
      if (rateType === 'M') {
        result = calculateSimpleInterestForSavings(monthM, r, t, months);
      } else if (rateType === 'S') {
        result = calculateCompoundInterestForSavings(monthM, r, t, months);
      }
    }
    setTotal(result);
  };

  // 월 적립 금액이나 금리가 바뀔 때마다 이자 재계산
  useEffect(() => {
    calculateInterest();
  }, [monthM, r]);

  const onChangeRateTotal = (e) => {
    const value = parseFloat(e.target.value);

    // 우대금리 변경
    if (e.target.checked) {
      setR((prevR) => parseFloat((prevR + value).toFixed(2)));
      setSpcl(parseFloat((spcl + value).toFixed(2)));
    } else {
      setR((prevR) => parseFloat((prevR - value).toFixed(2)));
      setSpcl(parseFloat((spcl - value).toFixed(2)));
    }
  };

  return {
    total,
    spcl,
    monthM,
    setMonthM,
    r,
    formatNumber,
    calculateInterest,
    onChangeRateTotal,
  };
};

export default useCalc;