/* src/hooks/useProductList.jsx */

import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    banksAtom,
    ageAtom,
    periodAtom,
    rateAtom,
    joinAtom,
    sortAtom,
    currentPageAtom,
} from 'src/atoms/productListAtom';

const useProductList = () => {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

    const [banks, setBanks] = useAtom(banksAtom);
    const [age, setAge] = useAtom(ageAtom);
    const [period, setPeriod] = useAtom(periodAtom);
    const [rate, setRate] = useAtom(rateAtom);
    const [join, setJoin] = useAtom(joinAtom);
    const [sort, setSort] = useAtom(sortAtom);


    /* 페이지 로드 시 URL 쿼리 스트링을 읽어서 초기 상태 설정 */
    useEffect(() => {
        const bankParam = searchParams.get("bank");
        const ageParam = searchParams.get("age");
        const periodParam = searchParams.get("period");
        const rateParam = searchParams.get("rate");
        const joinParam = searchParams.get("join");
        const sortParam = searchParams.get("sort");
        const pageParam = searchParams.get("page");

        if (bankParam) setBanks(bankParam.split(","));
        if (ageParam) setAge(ageParam);
        if (periodParam) setPeriod(periodParam);
        if (rateParam) setRate(rateParam);
        if (joinParam) setJoin(joinParam);
        if (sortParam) setSort(sortParam);
        if (pageParam) setCurrentPage(parseInt(pageParam, 10));
    }, [searchParams, setBanks, setAge, setPeriod, setRate, setJoin, setSort, setCurrentPage]);


    /* 상태 변경 시 URL 쿼리 스트링 업데이트 */
    useEffect(() => {
        const params = {};
        if (banks.length > 0) params.bank = banks.join(",");
        if (age) params.age = age;
        if (period) params.period = period;
        if (rate) params.rate = rate;
        if (join) params.join = join;
        if (sort) params.sort = sort;
        params.page = currentPage;

        setSearchParams(params);
    }, [banks, age, period, rate, join, sort, currentPage, setSearchParams]);


    /* 페이지 변경 */
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };


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
        currentPage,
        handlePageChange,     
        totalPages,   
    };
};

export default useProductList;
