/* src/apis/productListAPI.js */

import axiosInstanceAPI from 'src/apis/axiosInstanceAPI.js';
import axios from 'axios';
import { PATH } from 'src/utils/path';


/**
 * 회원 - 상품 목록 조회
 * @param {Object} params - 검색 필터, 정렬 필터, 페이지 정보
 * @param {string} params.category - 상품 카테고리; "installment" 또는 "deposit"
 * @param {number} params.page - 서버에 보낼 페이지 번호 (0부터 시작)
 * @param {string[]} [params.bank] - 은행 필터 
 * @param {number} [params.age] - 나이 필터 
 * @param {number} [params.period] - 저축 예정 기간 
 * @param {string} [params.rate] - 이율 방식; "단리" 또는 "복리" 
 * @param {string} [params.join] - 가입 방식; "대면" 또는 "비대면" 
 * @param {string} [params.sort="spclRate"] - 정렬 기준; "spclRate" 또는 "basicRate" (기본값: "spclRate")
 * @returns {Promise<Object>} - 상품 목록 데이터
 */
const getProductList = async (params) => {

  const queryParams = {
    ...params, 
  };

  const response = await axiosInstanceAPI.get(`${PATH.SERVER}/api/product/getProduct`, {
    params: queryParams,
  });

  return response.data.result; // API 응답 데이터 반환
};



/**
 * 비회원 - 상품 목록 조회
 * @param {Object} params - 검색 필터, 정렬 필터, 페이지 정보
 * @param {string} params.category - 상품 카테고리; "installment" 또는 "deposit"
 * @param {number} params.page - 서버에 보낼 페이지 번호 (0부터 시작)
 * @param {string[]} [params.bank] - 은행 필터 
 * @param {string} [params.sort="spclRate"] - 정렬 기준; "spclRate" 또는 "basicRate" (기본값: "spclRate")
 * @returns {Promise<Object>} - 상품 목록 데이터
 */
const getGuestProductList = async (params) => {

    const queryParams = {
      ...params, 
    };
  
    const response = await axios.get(`${PATH.SERVER}/api/product/guest/getProduct`, {
      params: queryParams,
    });
  
    return response.data.result; // API 응답 데이터 반환
  };



export { getProductList, getGuestProductList };
