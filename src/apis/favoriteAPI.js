/* src/apis/favoriteAPI.js */
/* 상품상세페이지; ProductDetailPage */

import axios from 'axios';
import { PATH } from 'src/utils/path';

const getSessionToken = () => {
  return localStorage.getItem('sessionToken'); 
  // return "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzMzOTc5ODkxLCJleHAiOjE3MzM5ODA0OTF9.sWCa1BBuKf2zprl7QdnjGEEBcGaerGy_nGaculqhLVo";
};


const checkFavorite = async (id) => {
  const response = await axios.get(`${PATH.SERVER}/api/favorite/checkFavorite`, { 
    params : { prdId: id },
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data;
}


const addFavorite = async (id) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/addFavorite/${id}`, {
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data;
};

const removeFavorite = async (id) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/removeFavorite/${id}`, {
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data;
};

export { checkFavorite, addFavorite, removeFavorite };
