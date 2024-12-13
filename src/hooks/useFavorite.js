/* src/hooks/useFavorite.js */
/* 상품상세페이지; ProductDetailPage */

// import { useAtom } from 'jotai';
// import { favoriteAtom } from '../atoms/favoriteAtom';
import { useState, useEffect } from 'react';
import { checkFavorite, addFavorite, removeFavorite } from '../apis/favoriteAPI';

export const useFavorite = (prdId) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // 즐겨찾기 상태 확인
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

  // 즐겨찾기 토글
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


// const [favorite, setFavorite] = useAtom(favoriteAtom);

// useEffect(() => {
//   const fetchFavoriteStatus = async () => {
//     try {
//       console.log("Fetching favorite status for prdId:", prdId);
//       const isFavorite = await checkFavorite(prdId); 
//       console.log("Favorite status:", isFavorite);
//       setFavorite((prev) => {
//         const newFavorite = new Set(prev);
//         if (isFavorite) newFavorite.add(prdId);
//         else newFavorite.delete(prdId);
//         return newFavorite;
//       });
//     } catch (error) {
//       console.error("Error fetching favorite status:", error);
//     }
//   };

//   if (prdId) {
//     fetchFavoriteStatus();
//   }
// }, [prdId, setFavorite]);


// const toggleFavorite = async () => {
//   try {
//     if (favorite.has(prdId)) {
//       await removeFavorite(prdId); 
//       setFavorite((prev) => {
//         const newFavorite = new Set(prev);
//         newFavorite.delete(prdId);
//         return newFavorite;
//       });
//     } else {
//       await addFavorite(prdId);
//       setFavorite((prev) => {
//         const newFavorite = new Set(prev);
//         newFavorite.add(prdId);
//         return newFavorite;
//       });
//     }
//   } catch (error) {
//     console.error("Error toggling favorite status:", error);
//   }
// };

// return { favorite, toggleFavorite };

