/* src/hooks/useProductList.jsx */
import { useState } from "react";

const useProductList = () => {
  const [selectedBanks, setSelectedBanks] = useState([]);

  // 은행 추가
  const handleBankChange = (event) => {
    const selectedBank = event.target.value;
    if (!selectedBanks.includes(selectedBank)) {
      setSelectedBanks([...selectedBanks, selectedBank]);
    }
  };

  // 은행 삭제
  const removeBank = (bankToRemove) => {
    setSelectedBanks(selectedBanks.filter((bank) => bank !== bankToRemove));
  };

  return {
    selectedBanks,
    handleBankChange,
    removeBank,
  };
};

export default useProductList;






