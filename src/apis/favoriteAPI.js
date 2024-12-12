/* src/apis/favoriteAPI.js */

import axios from 'axios';

const addFavorite = async (id) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/addFavorite/${id}`);
  return response.data;
};

const removeFavorite = async (id) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/removeFavorite/${id}`);
  return response.data;
};

export { addFavorite, removeFavorite };
