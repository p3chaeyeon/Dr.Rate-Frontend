/* src/hooks/useProductList.jsx */

import { useSearchParams, useLocation } from 'react-router-dom';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import {
    currentPageAtom,
    categoryAtom,
    banksAtom,
    ageAtom,
    periodAtom,
    rateAtom,
    joinAtom,
    sortAtom,
    productDataAtom,
} from 'src/atoms/productListAtom';
import { getProductList, getGuestProductList } from 'src/apis/productListAPI.js';



const useProductList = () => {
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const [currentPage, setCurrentPage] = useAtom(currentPageAtom);
    const [category, setCategory] = useAtom(categoryAtom);
    const [banks, setBanks] = useAtom(banksAtom);
    const [age, setAge] = useAtom(ageAtom);
    const [period, setPeriod] = useAtom(periodAtom);
    const [rate, setRate] = useAtom(rateAtom);
    const [join, setJoin] = useAtom(joinAtom);
    const [sort, setSort] = useAtom(sortAtom);
    const [productData, setProductData] = useAtom(productDataAtom);

    const previousCategory = useRef(category); // 이전 category를 저장

    /* 상태 초기화 함수 */
    const resetState = useCallback(() => {
        setCurrentPage(1);
        setBanks([]);
        setAge("");
        setPeriod("");
        setRate("");
        setJoin("");
        setSort("spclRate");
    }, [setCurrentPage, setBanks, setAge, setPeriod, setRate, setJoin, setSort]);    



    /* 페이지 로드 시 URL 경로를 기반으로 category 설정 */
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('installment')) {
            setCategory('installment');
        } else if (path.includes('deposit')) {
            setCategory('deposit');
        } else {
            setCategory(""); // 예외 처리
        }
    }, [location.pathname, setCategory]);


    /* category 변경 감지 및 초기화 */
    useEffect(() => {
        if (category !== previousCategory.current) {
            resetState(); // category가 변경될 때만 초기화
        }
        previousCategory.current = category; // 현재 category를 업데이트
    }, [category, resetState]);
    
    
    /* 상태 변경 시 URL 쿼리 스트링 업데이트 */
    useEffect(() => {
        const params = new URLSearchParams();
        if (category) params.category = category;
        if (banks.length > 0) {
            banks.forEach((bank) => params.append('banks', bank));
        }
        if (age) params.age = age;
        if (period) params.period = period;
        if (rate) params.rate = rate;
        if (join) params.join = join;
        if (sort) params.sort = sort;
        params.page = currentPage;

        setSearchParams(params);
    }, [category, banks, age, period, rate, join, sort, currentPage, setSearchParams]);


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




    /* ================== API 호출 ================== */

    /* 회원 예금, 적금 목록 조회 */
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // API 호출 파라미터 설정
            const params = {
                category,
                page: currentPage - 1, // API는 0부터 시작
                banks: banks.length > 0 ? banks : undefined,
                age: age || undefined,
                period: period || undefined,
                rate: rate || undefined,
                join: join || undefined,
                sort: sort || 'spclRate', // 기본 정렬 기준
            };

            const data = await getProductList(params);
            setProductData(data);
            console.log('회원 상품 목록 데이터:', data);

            setTotalPages(data.totalPages || 1); // 총 페이지 수
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, currentPage, banks, age, period, rate, join, sort]);


    /* 비회원 예금, 적금 목록 조회 */
    const fetchGuestProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {
                category,
                page: currentPage - 1, 
                banks: banks.length > 0 ? banks : undefined,
                sort: sort || 'spclRate', 
            };

            const data = await getGuestProductList(params);
            setProductData(data);
            console.log('비회원 상품 목록 데이터:', data);

            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, currentPage, banks, sort]);


    /* 페이지 URL 변경 감지 시 데이터 로드 */
    useEffect(() => {
        const fetchData = async () => {
            if (!category) return;

            try {
                if (location.pathname.includes('guest')) {
                    await fetchGuestProducts(); // 비회원 상품 목록 호출
                } else {
                    await fetchProducts(); // 회원 상품 목록 호출
                }
            } catch (err) {
                console.error('데이터 로드 중 오류:', err);
            }
        };

        fetchData(); // 비동기 함수 호출
    }, [fetchProducts, fetchGuestProducts, category, location.pathname]);

    





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
        productData,
    };
};

export default useProductList;
