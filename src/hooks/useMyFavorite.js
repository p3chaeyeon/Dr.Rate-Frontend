/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    categoryAtom,
    searchKeyAtom,
    searchValueAtom,
    individualCheckedAtom,
    setIndividualCheckedAtom,
    setAllCheckedAtom,
    favoriteDataAtom,
} from 'src/atoms/myFavoriteAtom';
import { useCallback, useState, useEffect } from 'react';
import { getFavorite, searchFavorite } from 'src/apis/myFavoriteAPI';

// const useMyFavorite = (dataLength) => {
const useMyFavorite = () => {
    // 상태 및 Atom 관리
    const category = useAtomValue(categoryAtom);
    const [favoriteData, setFavoriteData] = useAtom(favoriteDataAtom);
    const [searchKey, setSearchKey] = useAtom(searchKeyAtom);
    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const individualChecked = useAtomValue(individualCheckedAtom);
    const setIndividualChecked = useSetAtom(setIndividualCheckedAtom);
    const setAllCheckedState = useSetAtom(setAllCheckedAtom);

    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태



    /* 개별 체크박스 상태 업데이트 */
    const handleIndividualCheck = (index, isChecked) => {
        setIndividualChecked((prev) => {
            const updatedArray = [...prev];
            updatedArray[index] = isChecked;
            console.log(updatedArray);
            return updatedArray;
        });
    };

    /* 선택된 항목이 있는지 확인 */
    const hasSelectedItems = () => {
        return individualChecked.some((isChecked) => isChecked);
    };


    /* 마이페이지 즐겨찾기 조회 */
    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFavorite(category);
            setFavoriteData(data);
            setIndividualChecked(new Array(data.length).fill(false));
            setAllCheckedState(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, setFavoriteData, setIndividualChecked, setAllCheckedState]);


    /* 마이페이지 즐겨찾기 검색 */
    const handleSearch = useCallback(async () => {
        try {
            setLoading(true);
            const searchResults = await searchFavorite(category, searchKey, searchValue);
            setFavoriteData(searchResults);
            setIndividualChecked(new Array(searchResults.length).fill(false));
            setAllCheckedState(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, searchKey, searchValue, setFavoriteData, setIndividualChecked, setAllCheckedState]);

    




    /* 마이페이지 즐겨찾기 삭제 */







    return {
        individualChecked,
        handleIndividualCheck,
        favoriteData,
        fetchFavorites,
        loading,
        error,
        searchKey,
        setSearchKey,
        searchValue,
        setSearchValue,
        handleSearch,
        hasSelectedItems,

    };
};

export default useMyFavorite;
