/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useAtom } from 'jotai';
import { categoryAtom, individualCheckedAtom, setIndividualCheckedAtom } from 'src/atoms/myFavoriteAtom';
import { useEffect, useState } from 'react';
import { getFavorite, searchFavorite, deleteFavorite } from 'src/apis/myFavoriteAPI';

// const useMyFavorite = (dataLength) => {
const useMyFavorite = () => {
    const [category] = useAtom(categoryAtom); // category atom 사용
    const [individualChecked, setIndividualChecked] = useAtom(setIndividualCheckedAtom);
    const [favoriteData, setFavoriteData] = useState([]); // API 데이터
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // // 개별 체크박스 상태를 데이터 길이에 맞게 초기화
    // useEffect(() => {
    //     if (individualChecked.length === 0) {
    //         setIndividualChecked(new Array(dataLength).fill(false));
    //     }
    // }, [dataLength, individualChecked, setIndividualChecked]);


    // API 호출 및 상태 초기화
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                const data = await getFavorite(category);
                setFavoriteData(data);
                setIndividualChecked(new Array(data.length).fill(false)); // 체크박스 초기화
            } catch (err) {
                console.error('Error fetching favorites:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [category, setIndividualChecked]);

    // 개별 체크박스를 클릭했을 때 상태 업데이트
    const handleIndividualCheck = (index, isChecked) => {
        const updatedArray = [...individualChecked];
        updatedArray[index] = isChecked;
        setIndividualChecked(updatedArray);
    };

    return {
        favoriteData,
        loading,
        error,
        individualChecked,
        handleIndividualCheck,

    };
};

export default useMyFavorite;
