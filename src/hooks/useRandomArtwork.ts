import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import artworksData from '../data/artworks.json';
import type { Artwork } from '../types';

const artworks = artworksData as Artwork[];

export function useRandomArtwork(): () => void {
  const navigate = useNavigate();

  const goToRandomArtwork = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * artworks.length);
    const randomArtwork = artworks[randomIndex];
    navigate(`/artwork/${randomArtwork.id}`);
  }, [navigate]);

  return goToRandomArtwork;
}

export function getRandomArtwork(): Artwork {
  const randomIndex = Math.floor(Math.random() * artworks.length);
  return artworks[randomIndex];
}
