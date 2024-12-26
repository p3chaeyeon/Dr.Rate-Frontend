/* src/atoms/productListAtom.js */

import { atom } from 'jotai';

/* 공통 필터 상태 관리 */
export const banksAtom = atom([]); // 은행 선택

/* 회원 필터 상태 관리 */
export const ageAtom = atom(""); // 나이 입력
export const periodAtom = atom("3개월"); // 저축 예정 기간, 기본값 "3개월"
export const rateAtom = atom(""); // 단리/복리
export const joinAtom = atom(""); // 대면/비대면

/* 정렬 필터 상태 관리 */
export const sortAtom = atom("spclRate"); // spclRate/basicRate 기본값 "spclRate"
