/* src/apis/myFavoriteAPI.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import axios from 'axios';
import { PATH } from 'src/utils/path';


const getSessionToken = () => {
    // return localStorage.getItem('sessionToken'); 
    // 그냥 토큰키 넣어서 함.
    return "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM0Mzk3NTY1LCJleHAiOjE3MzQ0ODM5NjV9.EXFCRgASw3q09351HyDkJKFrWBWfNvjcOY1FGtMRaiA";
  };



const getFavorite= async (category) => {
    const response = await axios.get(`${PATH.SERVER}/api/favorite/getFavorite`, { 
        params: { category }, // deposit or installment
        headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
      });
      return response.data.result;
};

const searchFavorite= async (category) => {
    const response = await axios.get(`${PATH.SERVER}/api/favorite/searchFavorite`, {
        params: { category }, // deposit or installment
        headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
      });
      return response.data.result;
};

const deleteFavorite= async () => {
    const response = await axios.get(`${PATH.SERVER}/api/favorite/deleteFavorite`, { 
        headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
      });
      return response.data.result;
};




export { getFavorite, searchFavorite, deleteFavorite };
