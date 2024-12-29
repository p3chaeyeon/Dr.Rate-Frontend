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
import { useSession } from 'src/hooks/useSession';


const useProductList = () => {
    const { isLoggedIn } = useSession();
    
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
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

    const previousCategory = useRef(category); // 이전 category를 저장
    const blockSize = 5;

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






    /* 페이지네이션 범위 설정 */
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
    }, [category, banks, age, period, rate, join, sort, currentPage, setSearchParams]);






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
            setProductData(data.content); // content 배열을 저장
            setTotalPages(data.totalPages || 1); // 총 페이지 수
            setCurrentPage(data.pageable.pageNumber + 1);
        } catch (err) {
            console.error('Fetch Products Error:', err); // 에러 로그 출력
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
            setProductData(data.content); // content 배열을 저장
            setTotalPages(data.totalPages || 1); // 총 페이지 수
            setCurrentPage(data.pageable.pageNumber + 1);
        } catch (err) {
            console.error('Fetch Products Error:', err); // 에러 로그 출력
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
    }, [fetchProducts, fetchGuestProducts, category, isLoggedIn, location.pathname]);



   





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
        paginationRange,
        handlePrevBlock, 
        handleNextBlock, 
    };
};

export default useProductList;