/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    categoryAtom,
    searchKeyAtom,
    searchValueAtom,
    individualCheckedAtom,
    setIndividualCheckedAtom,
    setAllCheckedAtom,
    favoriteDataAtom,
    hasSelectedItemsAtom,
} from 'src/atoms/myFavoriteAtom';
import { getFavorite, searchFavorite, deleteFavorite } from 'src/apis/myFavoriteAPI';
import { useSession } from 'src/hooks/useSession';
import useModal from 'src/hooks/useModal';
import { PATH } from 'src/utils/path';



const useMyFavorite = () => {
    const { isLoggedIn } = useSession();

    const navigate = useNavigate();
    const location = useLocation();

    // 상태 및 Atom 관리
    const [category, setCategory] = useAtom(categoryAtom);
    const [favoriteData, setFavoriteData] = useAtom(favoriteDataAtom);
    const [searchKey, setSearchKey] = useAtom(searchKeyAtom);
    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const individualChecked = useAtomValue(individualCheckedAtom);
    const setIndividualChecked = useSetAtom(setIndividualCheckedAtom);
    const setAllCheckedState = useSetAtom(setAllCheckedAtom);
    const hasSelectedItems = useAtomValue(hasSelectedItemsAtom); // 선택된 항목이 있는지 확인

    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [prevCategory, setPrevCategory] = useState("");



    const {         
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent, 
    } = useModal();


    const handleConfirm = () => {
        navigate(PATH.SIGN_IN);
        closeConfirmModal();
    };

    const handleCancel = () => {
        navigate(PATH.HOME);
        closeConfirmModal();
    };    


    /**
     * 라우트에 따라 category 설정
     */
    useEffect(() => {
        if (location.pathname.includes('myInstallment')) {
            setCategory('installment');
        } else {
            setCategory('deposit');
        }
    }, [location.pathname]);

    


    /* 개별 체크박스 상태 업데이트 */
    const handleIndividualCheck = (index, isChecked) => {
        setIndividualChecked((prev) => {
            const updatedArray = [...prev];
            updatedArray[index] = isChecked;
            return updatedArray;
        });
    };


    /* 마이페이지 즐겨찾기 조회 */
    const fetchFavorites = useCallback(async () => {
        if (!isLoggedIn) {
            openConfirmModal(
                '로그인이 필요합니다.',
                '로그인 페이지로 이동하시겠습니까?',
                handleConfirm,
                handleCancel,
            );
            return; // 로그인되지 않았으면 API 호출 중단
        }

        setLoading(true);
        try {
            const data = await getFavorite(category);
            console.log('[DEBUG] fetchFavorites. category=', category, ', data=', data);
            setFavoriteData(data);
            setIndividualChecked(new Array(data.length).fill(false));
            setAllCheckedState(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [
        isLoggedIn,
        category,
        setFavoriteData,
        setIndividualChecked,
        setAllCheckedState,
    ]);



  
    /**
     * category가 변경될 때만 fetchFavorites를 호출하도록 수정
     * 이전 category와 현재 category가 다를 때만 호출
     */
    useEffect(() => {
        if (category && category !== prevCategory) {
            console.log(`[DEBUG] category="${category}" -> fetchFavorites()`);
            setPrevCategory(category); // 현재 category를 이전 category로 설정

            // 검색 키, 값 초기화
            setSearchKey('bankName');
            setSearchValue('');

            // API 호출
            fetchFavorites();
        }
    }, [category, prevCategory, fetchFavorites, setSearchKey, setSearchValue]);


      


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
    }, [category, 
        searchKey, 
        searchValue, 
        setFavoriteData, 
        setIndividualChecked, 
        setAllCheckedState
    ]);
    



    /**
     * 마이페이지 즐겨찾기 삭제
     * 삭제 후에는 API에서 최신 목록을 다시 불러오므로 fetchFavorites 호출
     */
    const handleDeleteClick = useCallback(() => {
        if (!hasSelectedItems) {
            openAlertModal('삭제할 항목이 없습니다', '삭제할 상품을 선택해주세요.');
            return;
        }

        openConfirmModal(
            '선택한 항목을 삭제하시겠습니까?',
            '삭제할 항목을 확인해주세요.',
            async () => {
                const selectedIds = favoriteData
                    .filter((_, index) => individualChecked[index])
                    .map((item) => item.favoriteId);

                try {
                    setLoading(true);
                    await deleteFavorite(selectedIds);
                    await fetchFavorites(); // 조회 호출
                } catch (error) {
                    console.error('삭제 중 에러 발생:', error);
                } finally {
                    closeConfirmModal();
                    setLoading(false);
                }
            },
            closeConfirmModal
        );
    }, [
        hasSelectedItems,
        favoriteData,
        individualChecked,
        fetchFavorites,
        openConfirmModal,
        closeConfirmModal,
        openAlertModal,
    ]);





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
        handleDeleteClick,
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent,
    };
};

export default useMyFavorite;
