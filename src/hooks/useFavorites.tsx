import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (artworkId: string) => boolean;
  toggleFavorite: (artworkId: string) => void;
  addFavorite: (artworkId: string) => void;
  removeFavorite: (artworkId: string) => void;
  clearFavorites: () => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = 'leah-schwartz-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }): JSX.Element {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load favorites from localStorage');
      }
    }
    return [];
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage');
    }
  }, [favorites]);

  const isFavorite = useCallback((artworkId: string) => {
    return favorites.includes(artworkId);
  }, [favorites]);

  const addFavorite = useCallback((artworkId: string) => {
    setFavorites(prev => {
      if (prev.includes(artworkId)) return prev;
      return [...prev, artworkId];
    });
  }, []);

  const removeFavorite = useCallback((artworkId: string) => {
    setFavorites(prev => prev.filter(id => id !== artworkId));
  }, []);

  const toggleFavorite = useCallback((artworkId: string) => {
    setFavorites(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      }
      return [...prev, artworkId];
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        clearFavorites,
        count: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
