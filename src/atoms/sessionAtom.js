/* src/atoms/sessionAtom.js */

import { atom } from 'jotai';

// Authorization 키가 로컬 스토리지에 있는지 확인하여 초기값 설정
const isLoggedInAtom = atom(() => {
  const savedToken = localStorage.getItem('Authorization');
  return savedToken && savedToken !== 'undefined'; // 저장된 토큰이 있고 'undefined'가 아닌 경우 true
});

export { isLoggedInAtom };
