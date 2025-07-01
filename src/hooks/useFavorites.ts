
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  const isFavorite = (id: string) => favorites.includes(id);
  
  return { favorites, toggleFavorite, isFavorite };
};
