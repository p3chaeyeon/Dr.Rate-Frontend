/* src/apis/favoriteAPI.js */
/* 상품상세페이지; ProductDetailPage */

import axios from 'axios';
import { PATH } from 'src/utils/path';

const getSessionToken = () => {
  // return localStorage.getItem('sessionToken'); 
  return "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM0MDcxNTY3LCJleHAiOjE3MzQwNzIxNjd9.fN_ruDMeZYRTa2iyVbTnhzAW5hBTqvFLiI86wPFYKHI";
};


const checkFavorite = async (prdId) => {
  const response = await axios.get(`${PATH.SERVER}/api/favorite/checkFavorite/${prdId}`, { 
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data.result;
}


const addFavorite = async (prdId) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/addFavorite/$`, 
    { prdId },
    { headers : { 'Authorization' : `Bearer ${getSessionToken()}`}}
  );
  return response.data;
};

const removeFavorite = async (prdId) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/removeFavorite/${prdId}`, {
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data;
};

export { checkFavorite, addFavorite, removeFavorite };
