/* src/hooks/useProductList.jsx */

import { useAtom } from 'jotai';
import { useState } from 'react';
import {
    banksAtom,
    ageAtom,
    periodAtom,
    rateAtom,
    joinAtom,
    sortAtom,
} from 'src/atoms/productListAtom';

const useProductList = () => {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [banks, setBanks] = useAtom(banksAtom);
    const [age, setAge] = useAtom(ageAtom);
    const [period, setPeriod] = useAtom(periodAtom);
    const [rate, setRate] = useAtom(rateAtom);
    const [join, setJoin] = useAtom(joinAtom);
    const [sort, setSort] = useAtom(sortAtom);


    /* 은행 추가 */
    const handleBankChange = (event) => {
        const selectedBank = event.target.value;
        if (!banks.includes(selectedBank)) {
            setBanks([...banks, selectedBank]);
        }
    };

    /* 은행 삭제 */
    const removeBank = (bankToRemove) => {
        setBanks(banks.filter((bank) => bank !== bankToRemove));
    };

    /* 나이 변경 */
    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    /* 저축 예정 기간 변경 */
    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    /* 단리/복리 선택 */
    const handleRateClick = (choice) => {
        setRate((prev) => (prev === choice ? "" : choice));
    };

    /* 대면/비대면 선택 */
    const handleJoinClick = (choice) => {
        setJoin((prev) => (prev === choice ? "" : choice));
    };

    /* 정렬 상태 관리 함수 */
    const handleSortClick = (choice) => {
        setSort(choice);
      };

    return {
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
    };
};

export default useProductList;
