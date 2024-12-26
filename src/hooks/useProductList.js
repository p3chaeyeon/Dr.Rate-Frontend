/* src/hooks/useProductList.js */

import { useState } from "react";

const useProductList = () => {
  const [selectedBank, setSelectedBank] = useState("");

  const handleBankChange = (event) => {
    setSelectedBank(event.target.value);
  };

  return {
    selectedBank,
    handleBankChange,
  };
};

export default useProductList;



