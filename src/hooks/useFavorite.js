/* src/hooks/useFavorite.js */

import { useAtom } from 'jotai';
import { favoriteAtom } from '../atoms/favoriteAtom';
import { addFavorite, removeFavorite } from '../apis/favorite';

export const useFavorite = () => {
  const [favorites, setFavorites] = useAtom(favoriteAtom);

  const toggleFavorite = async (id) => {
    if (favorites.has(id)) {
      await removeFavorite(id);
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        newFavorites.delete(id);
        return newFavorites;
      });
    } else {
      await addFavorite(id);
      setFavorites((prev) => new Set(prev).add(id));
    }
  };

  return { favorites, toggleFavorite };
};

