/* src/hooks/useFavorite.js */
/* 상품상세페이지; ProductDetailPage */

import { useAtom } from 'jotai';
import { favoriteAtom } from '../atoms/favoriteAtom';
import { checkFavorite, addFavorite, removeFavorite } from '../apis/favoriteAPI';
import { useEffect } from 'react';

export const useFavorite = (prdId) => {
  const [favorite, setFavorite] = useAtom(favoriteAtom);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const isFavorite = await checkFavorite(prdId); 
        setFavorite((prev) => {
          const newFavorite = new Set(prev);
          if (isFavorite) newFavorite.add(prdId);
          else newFavorite.delete(prdId);
          return newFavorite;
        });
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    if (prdId) {
      fetchFavoriteStatus();
    }
  }, [prdId, setFavorite]);
  

  const toggleFavorite = async () => {
    try {
      if (favorite.has(prdId)) {
        await removeFavorite(prdId); 
        setFavorite((prev) => {
          const newFavorite = new Set(prev);
          newFavorite.delete(prdId);
          return newFavorite;
        });
      } else {
        await addFavorite(prdId);
        setFavorite((prev) => {
          const newFavorite = new Set(prev);
          newFavorite.add(prdId);
          return newFavorite;
        });
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  return { favorite, toggleFavorite };
};

