/* src/atoms/sessionAtom.js */

import { atom } from 'jotai';

export const sessionAtom = atom(() => {
    const token = localStorage.getItem('Authorization');
    console.log('Initial Session Value:', token); // 디버깅 로그 
    return token || null;
});
