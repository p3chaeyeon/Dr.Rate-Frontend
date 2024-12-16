/* src/hooks/useFavorite.js */
/* 상품상세페이지; ProductDetailPage */

// import { useAtom } from 'jotai';
// import { favoriteAtom } from '../atoms/favoriteAtom';
import { useState, useEffect } from 'react';
import { checkFavorite, addFavorite, removeFavorite } from '../apis/favoriteAPI';

export const useFavorite = (prdId) => {
  const [isFavorite, setIsFavorite] = useState(false);

  /* 즐겨찾기 상태 확인 */
  useEffect(() => {
      const fetchFavoriteStatus = async () => {
          try {
              const isFavoriteStatus = await checkFavorite(prdId);
              setIsFavorite(isFavoriteStatus);
          } catch (error) {
              console.error("Error fetching favorite status:", error);
          } 
      };

      if (prdId) { 
        fetchFavoriteStatus();
    }
  }, [prdId]);


  /* 즐겨찾기 토글 */
  const toggleFavorite = async () => {
      try {
          if (isFavorite) {
              await removeFavorite(prdId);
              setIsFavorite(false);
          } else {
              await addFavorite(prdId);
              setIsFavorite(true);
          }
      } catch (error) {
          console.error("Error toggling favorite status:", error);
      }
  };

  return { isFavorite, toggleFavorite };


};
