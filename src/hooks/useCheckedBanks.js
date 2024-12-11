import React, { useState } from 'react';

const useCheckedBanks = (banks, limit) => {
    const [checkedBanks, setCheckedBanks] = useState([]);
    
    const [addProduct, setAddProduct] = useState([]);
    const [addPrdCo, setAddPrdCo] = useState([]);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;

        if (value === '전체') {
            if (checked) {
                setCheckedBanks(banks.filter(bank => bank.code !== null).map(bank => bank.code));
            } else {
                setCheckedBanks([]);
            }
        } else {
            const bank = banks.find(b => b.name === value);
            const bankCode = bank ? bank.code : null;
        
            setCheckedBanks((prev) => {
                if (checked) {
                    return [...prev, bankCode];
                } else {
                    return prev.filter(code => code !== bankCode);
                }
            });
        }
    };

    const handleAddProduct = (product) => {
        if(addPrdCo.length === limit &&  !addPrdCo.includes(product.prdCo)){
            return;
        }

        setAddPrdCo((prevProducts) => {
            if (!prevProducts.includes(product.prdCo)) {
              return [...prevProducts, product.prdCo];
            } else {
                return prevProducts.filter((prd) => prd !== product.prdCo);
            }
        });

        setAddProduct((prevProducts) => {
            if (!prevProducts.some((prd) => prd.prdCo === product.prdCo)) {
              return [...prevProducts, product];
            } else {
                return prevProducts.filter((prd) => prd.prdCo !== product.prdCo);
            }
        });
    }

    const deletePrd = (product) => {
        setAddPrdCo((prevProducts) => {
            if (prevProducts.includes(product.prdCo)) {
                return prevProducts.filter((prd) => prd !== product.prdCo);
            }
        });

        setAddProduct((prevProducts) => {
            if (prevProducts.some((prd) => prd.prdCo === product.prdCo)) {
                return prevProducts.filter((prd) => prd.prdCo !== product.prdCo);
            }
        });
    }

    return {
        checkedBanks,
        handleCheckboxChange,
        handleAddProduct,
        deletePrd,
        addProduct,
        addPrdCo
    };
};

export default useCheckedBanks;