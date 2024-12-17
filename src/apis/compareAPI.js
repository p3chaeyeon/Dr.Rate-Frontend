/* src/apis/productsAPI.js */

import axios from 'axios';
import { PATH } from "src/utils/path";

/**
 * 세션 토큰 가져오기
 * @returns {string} - 세션 토큰
 */
export const getSessionToken = () => {
    return localStorage.getItem('sessionToken');
};

/* 비교 담기 */
/**
 * 상품 비교 정보를 DB에 저장하는 API
 * @param {Array} compareData - 비교할 상품 데이터
 * @returns {Promise<object>} - 저장된 결과
 */
export const getCompareProducts = async () => {
    console.log(`Bearer ${getSessionToken()}`)
    try {
        const response = await axios.get(`${PATH.SERVER}/api/compare/getCompareProducts`,
            { headers : { 'Authorization' : `Bearer ${getSessionToken()}`}}
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


/* 비교 담기 */
/**
 * 상품 비교 정보를 DB에 저장하는 API
 * @param {Array} compareData - 비교할 상품 데이터
 * @returns {Promise<object>} - 저장된 결과
 */
export const saveCompareProducts = async (compareData) => {
    try {
        const response = await axios.post(`${PATH.SERVER}/api/compare/saveCompareProducts`, 
            { compareData },
            { headers : { 'Authorization' : `Bearer ${getSessionToken()}`}}
        );
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};