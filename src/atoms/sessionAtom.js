/* src/atoms/sessionAtom.js */

import { atom } from 'jotai';

// session 상태를 읽기/쓰기 가능한 atom으로 정의
export const sessionAtom = atom(
    () => {
        const token = localStorage.getItem('Authorization');
        console.log('Initial Session Value:', token);
        return token || null;
    },
    (get, set, newValue) => {
        if (newValue === null) {
            localStorage.removeItem('Authorization'); // null일 경우 로컬 스토리지에서 제거
        } else {
            localStorage.setItem('Authorization', newValue); // 새로운 값 저장
        }
        console.log('Session Updated in atom:', newValue);
    }
);



