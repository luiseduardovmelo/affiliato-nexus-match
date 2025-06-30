
import { useState, useEffect } from 'react';

export const useRevealState = (profileId: string) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  
  useEffect(() => {
    const key = `contact-revealed-${profileId}`;
    const stored = localStorage.getItem(key);
    if (stored === 'true') {
      setHasRevealed(true);
    }
  }, [profileId]);
  
  const revealContact = () => {
    const key = `contact-revealed-${profileId}`;
    localStorage.setItem(key, 'true');
    setHasRevealed(true);
  };
  
  return { hasRevealed, revealContact };
};
