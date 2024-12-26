/* src/hooks/useProductList.jsx */

import { useAtom } from "jotai";
import {
    banksAtom,
    ageAtom,
    savingPeriodAtom,
    interestMethodAtom,
    joinMethodAtom,
} from "src/atoms/productListAtom";

const useProductList = () => {
  const [banks, setBanks] = useAtom(banksAtom);
  const [interestMethod, setInterestMethod] = useAtom(interestMethodAtom);
  const [joinMethod, setJoinMethod] = useAtom(joinMethodAtom);
  const [age, setAge] = useAtom(ageAtom);
  const [period, setPeriod] = useAtom(savingPeriodAtom);

  // 은행 추가
  const handleBankChange = (event) => {
    const selectedBank = event.target.value;
    if (!banks.includes(selectedBank)) {
      setBanks([...banks, selectedBank]);
    }
  };

  // 은행 삭제
  const removeBank = (bankToRemove) => {
    setBanks(banks.filter((bank) => bank !== bankToRemove));
  };

  // 나이 변경
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  // 저축 예정 기간 변경
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // 단리/복리 선택
  const handleInterestMethodClick = (method) => {
    setInterestMethod((prev) => (prev === method ? "" : method));
  };

  // 대면/비대면 선택
  const handleJoinMethodClick = (method) => {
    setJoinMethod((prev) => (prev === method ? "" : method));
  };

  return {
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
  };
};

export default useProductList;
