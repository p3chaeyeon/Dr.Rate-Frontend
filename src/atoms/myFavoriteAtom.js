/* src/atoms/myFavoriteAtom.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { atom } from 'jotai';

// category 상태 관리 (deposit 또는 installment)
export const categoryAtom = atom('deposit'); // 기본값: deposit

// 전체 체크박스 상태
export const allCheckedAtom = atom(false);

// 개별 체크박스 상태 배열
export const individualCheckedAtom = atom([]);

// 전체 체크박스 상태를 업데이트하고, 개별 체크박스 상태도 동기화
export const setAllCheckedAtom = atom(
    null,
    (get, set, allChecked) => {
        const individualLength = get(individualCheckedAtom).length;
        set(individualCheckedAtom, new Array(individualLength).fill(allChecked));
        set(allCheckedAtom, allChecked);
    }
);

// 개별 체크박스 상태를 업데이트하고, 전체 체크박스 상태를 동기화
export const setIndividualCheckedAtom = atom(
    (get) => get(individualCheckedAtom),
    (get, set, updatedArray) => {
        const allChecked = Array.isArray(updatedArray) && updatedArray.every((val) => val);
        set(individualCheckedAtom, updatedArray);
        set(allCheckedAtom, allChecked);
    }
);
