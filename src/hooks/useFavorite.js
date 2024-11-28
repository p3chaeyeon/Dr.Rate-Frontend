// src/hooks/useFavorite.js

// API 호출 및 로직 분리를 담당
// 재사용 가능한 로직을 분리하여 관리; Custom Hook 

import { useAtom } from 'jotai';
import { individualCheckedAtom, setIndividualCheckedAtom } from 'src/atoms/favoriteAtoms';
import { useEffect } from 'react';

const useFavorite = (dataLength) => {
    const [individualChecked, setIndividualChecked] = useAtom(setIndividualCheckedAtom);

    // 개별 체크박스 상태를 데이터 길이에 맞게 초기화
    useEffect(() => {
        if (individualChecked.length === 0) {
            setIndividualChecked(new Array(dataLength).fill(false));
        }
    }, [dataLength, individualChecked, setIndividualChecked]);

    // 개별 체크박스를 클릭했을 때 상태 업데이트
    const handleIndividualCheck = (index, isChecked) => {
        const updatedArray = [...individualChecked];
        updatedArray[index] = isChecked;
        setIndividualChecked(updatedArray);
    };

    return {
        individualChecked,
        handleIndividualCheck,
    };
};

export default useFavorite;
