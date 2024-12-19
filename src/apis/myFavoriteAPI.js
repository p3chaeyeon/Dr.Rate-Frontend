/* src/apis/myFavoriteAPI.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import axiosInstanceAPI from "./axiosInstanceAPI.js";
import { PATH } from 'src/utils/path';


/**
 * 즐겨찾기 전체 조회
 * @param {string} category - "deposit" 또는 "installment" 
 * @returns {Promise<Array>} - 즐겨찾기 데이터 리스트
 */
const getFavorite = async (category) => {
  const response = await axiosInstanceAPI.get(`${PATH.SERVER}/api/favorite/getFavorite`, { 
      params: { category }, // 예금("deposit") 또는 적금("installment")
  });
  return response.data.result; // API 응답 데이터 반환
};


/**
 * 즐겨찾기 검색
 * @param {string} category - "deposit" 또는 "installment"
 * @param {string} searchKey - 검색 키 (예: "bankName", "prdName")
 * @param {string} searchValue - 검색 값 (예: 은행명 또는 상품명)
 * @returns {Promise<Array>} - 검색된 즐겨찾기 데이터 리스트
 */
const searchFavorite = async (category, searchKey, searchValue) => {
  const response = await axiosInstanceAPI.get(`${PATH.SERVER}/api/favorite/searchFavorite`, {
      params: { 
          category,   // 카테고리
          searchKey,  // 검색 필드 (예: bankName, prdName)
          searchValue // 검색 값
      }
  });
  return response.data.result; // API 응답 데이터 반환
};


/**
 * 즐겨찾기 삭제
 * @param {Array<number>} favoriteIds - 삭제할 즐겨찾기 ID 배열
 * @returns {Promise<Object>} - API 응답 데이터
 */
const deleteFavorite = async (favoriteIds) => {
  const response = await axiosInstanceAPI.delete(`${PATH.SERVER}/api/favorite/deleteFavorite`, {
      data: { favoriteIds } // 삭제할 ID 배열 전달
  });
  return response.data; // API 응답 데이터 반환
};





export { getFavorite, searchFavorite, deleteFavorite };
