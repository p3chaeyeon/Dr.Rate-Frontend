/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
    categoryAtom, 
    searchKeyAtom, 
    searchValueAtom, 
    individualCheckedAtom, 
    setIndividualCheckedAtom 
} from 'src/atoms/myFavoriteAtom';
import { useEffect, useState } from 'react';
import { getFavorite, searchFavorite, deleteFavorite } from 'src/apis/myFavoriteAPI';

// const useMyFavorite = (dataLength) => {
const useMyFavorite = () => {
    // Atom 상태 불러오기
    const category = useAtomValue(categoryAtom); // category 상태
    const [searchKey, setSearchKey] = useAtom(searchKeyAtom); // 검색 키 상태
    const [searchValue, setSearchValue] = useAtom(searchValueAtom); // 검색 값 상태
    const individualChecked = useAtomValue(individualCheckedAtom); // 개별 체크박스 상태
    const setIndividualChecked = useSetAtom(setIndividualCheckedAtom); // 개별 체크박스 상태 업데이트 함수


    // 로컬 상태 관리
    const [favoriteData, setFavoriteData] = useState([]); // API 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태


    /* 개별 체크박스 상태 업데이트 */
    const handleIndividualCheck = (index, isChecked) => {
        setIndividualChecked((prev) => {
            const updatedArray = [...prev];
            updatedArray[index] = isChecked;
            return updatedArray;
        });
    };


    /* API 호출 및 상태 초기화 */
    useEffect(() => {
        fetchFavorites();
    }, [category]);


    /* 마이페이지 즐겨찾기 조회 */
    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const data = await getFavorite(category);
            setFavoriteData(data);
            setIndividualChecked(new Array(data.length).fill(false));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };



    /* 마이페이지 즐겨찾기 검색 */
    const handleSearch = async () => {
        try {
            setLoading(true);
            const searchResults = await searchFavorite(category, searchKey, searchValue); // 파라미터 전달
            console.log('Search Results:', searchResults); // 콘솔에 결과 출력
            setFavoriteData(searchResults);
            setIndividualChecked(new Array(searchResults.length).fill(false));
        } catch (err) {
            console.error('Error fetching search results:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    




    /* 마이페이지 즐겨찾기 삭제 */







    return {
        individualChecked,
        handleIndividualCheck,
        favoriteData,
        loading,
        error,
        searchKey,
        setSearchKey,
        searchValue,
        setSearchValue,
        handleSearch,

    };
};

export default useMyFavorite;
