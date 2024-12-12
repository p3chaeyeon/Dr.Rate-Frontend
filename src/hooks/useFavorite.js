/* src/hooks/useFavorite.js */
/* 상품상세페이지; ProductDetailPage */

import { useAtom } from 'jotai';
import { favoriteAtom } from '../atoms/favoriteAtom';
import { checkFavorite, addFavorite, removeFavorite } from '../apis/favoriteAPI';
import { useEffect } from 'react';

export const useFavorite = (id) => {
  const [favorite, setFavorite] = useAtom(favoriteAtom);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const isFavorite = await checkFavorite(id);
        setFavorite((prev) => {
          const newFavorite = new Set(prev);
          if (isFavorite) newFavorite.add(id);
          else newFavorite.delete(id);
          return newFavorite;
        });
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [id, setFavorite]);
  

  const toggleFavorite = async () => {
    try {
      if (favorite.has(id)) {
        await removeFavorite(id);
        setFavorite((prev) => {
          const newFavorite = new Set(prev);
          newFavorite.delete(id);
          return newFavorite;
        });
      } else {
        await addFavorite(id);
        setFavorite((prev) => new Set(prev).add(id));
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
    }
  };

  return { favorite, toggleFavorite };
};

