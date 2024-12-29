/* src/hooks/useProductList.jsx */

import { useSearchParams, useLocation } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
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
import { useSession } from 'src/hooks/useSession';
import { shortToFull } from 'src/utils/shortNameToFullName.js';

const useProductList = () => {
    const { isLoggedIn } = useSession();
    
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);     // 에러 상태
    const [totalPages, setTotalPages] = useState(0);            // 총 페이지 수
    const [paginationRange, setPaginationRange] = useState([]); // 페이지네이션 범위

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

    const blockSize = 5; // 페이지네이션 블록 크기



    /* ================== handler ======================================================================== */

    const handleBankChange = (event) => {
        const selectedShortName = event.target.value;   // "토스뱅크"
        const selectedFullName = shortToFull(selectedShortName); // "토스뱅크 주식회사"
        
        if (!banks.includes(selectedFullName)) {
            setBanks((prev) => [...prev, selectedFullName]);
        }
    };

    const removeBank = (bankToRemove) => {
        setBanks(banks.filter((bank) => bank !== bankToRemove));
    };

    const handleAgeChange = (event) => {
        setAge(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
    };

    const handleRateClick = (choice) => {
        setRate((prev) => (prev === choice ? "" : choice));
    };

    const handleJoinClick = (choice) => {
        setJoin((prev) => (prev === choice ? "" : choice));
    };

    const handleSortClick = (choice) => {
        setSort(choice);
    };




    /* ================== Pagination ======================================================================== */

    /* 페이지네이션 범위 계산 */
    const calculatePaginationRange = useCallback(() => {
        if (totalPages === 0) {
            setPaginationRange([]);
            return;
        }
        const currentBlock = Math.ceil(currentPage / blockSize);
        const startPage = (currentBlock - 1) * blockSize + 1;
        const endPage = Math.min(startPage + blockSize - 1, totalPages);

        setPaginationRange(
            Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
        );
    }, [currentPage, totalPages]);

    useEffect(() => {
        calculatePaginationRange();
    }, [currentPage, totalPages, calculatePaginationRange]);


    /* 페이지네이션 "이전" 블록 */
    const handlePrevBlock = () => {
        const firstPageOfBlock = paginationRange[0];
        if (firstPageOfBlock > 1) {
            setCurrentPage(firstPageOfBlock - 1);
        }
    };

    /* 페이지네이션 "다음" 블록 */
    const handleNextBlock = () => {
        const lastPageOfBlock = paginationRange[paginationRange.length - 1];
        if (lastPageOfBlock < totalPages) {
            setCurrentPage(lastPageOfBlock + 1);
        }
    };

    /* 페이지 변경 */
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };




    /* ================== Loading ======================================================================== */

    /* URL 경로 기반 category 설정 */
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('installment')) {
            setCategory('installment');
        } else if (path.includes('deposit')) {
            setCategory('deposit');
        } else {
            setCategory("");
        }
    }, [location.pathname, setCategory]);


    /* 조건 변화 시 page = 1로 초기화 */
    useEffect(() => {
        // category, banks, age, period, rate, join, sort가 변경되면 currentPage=1
        setCurrentPage(1);
    }, [category, banks, age, period, rate, join, sort, setCurrentPage]);


    /* 상태 변경 시 URL 쿼리 스트링 동기화*/
    useEffect(() => {
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (banks.length > 0) {
            banks.forEach((bank) => params.append('banks', bank));
        }
        if (age) params.set('age', age);
        if (period) params.set('period', period);
        if (rate) params.set('rate', rate);
        if (join) params.set('join', join);
        if (sort) params.set('sort', sort);

        params.set('page', currentPage);

        setSearchParams(params);
    }, [
        category,
        banks,
        age,
        period,
        rate,
        join,
        sort,
        currentPage,
        setSearchParams
    ]);




    /* ================== API Call ======================================================================== */

    /* 회원 예금, 적금 목록 조회 */
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // API 호출 파라미터
            const params = {
                category,
                page: currentPage - 1, // 스프링부트 페이지는 0부터 시작
                banks: banks.length > 0 ? banks : undefined,
                age: age || undefined,
                period: period || undefined,
                rate: rate || undefined,
                join: join || undefined,
                sort: sort || 'spclRate',
            };

            const data = await getProductList(params);
            setProductData(data.content);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error('Fetch Products Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [
        category,
        currentPage,
        banks,
        age,
        period,
        rate,
        join,
        sort,
        setProductData
    ]);


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
            setProductData(data.content);
            setTotalPages(data.totalPages || 1);

        } catch (err) {
            console.error('Fetch Products Error:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [
        category,
        currentPage,
        banks,
        sort,
        setProductData
    ]);


    /* 페이지 URL 변경 감지 시 데이터 로드 */
    useEffect(() => {
        const fetchData = async () => {
            if (!category) return; // category가 없으면 API 호출 X

            try {
                if (isLoggedIn) {
                    await fetchProducts();
                } else {
                    await fetchGuestProducts();
                }
            } catch (err) {
                console.error("데이터 로드 중 오류:", err);
            }
        };

        fetchData();
    }, [
        fetchProducts,
        fetchGuestProducts,
        category,
        isLoggedIn,
        location.pathname
    ]);



    return {
        loading,
        error,
        productData,
        totalPages,
        currentPage,
        handlePageChange,
        paginationRange,
        handlePrevBlock, 
        handleNextBlock, 
        banks,
        handleBankChange,
        removeBank,
        age,
        handleAgeChange,
        period,
        handlePeriodChange,
        rate,
        handleRateClick,
        join,
        handleJoinClick,
        sort,
        handleSortClick,
    };
};

export default useProductList;
