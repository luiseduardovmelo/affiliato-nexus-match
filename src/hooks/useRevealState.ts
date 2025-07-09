
import { useState, useEffect } from 'react';

export const useRevealState = (profileId: string, profileName?: string) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  
  useEffect(() => {
    if (profileId) {
      const revealedContacts = JSON.parse(localStorage.getItem('revealedContacts') || '[]');
      setHasRevealed(revealedContacts.includes(profileId));
    }
  }, [profileId]);
  
  const revealContact = () => {
    if (profileId && !hasRevealed) {
      setIsRevealing(true);
      
      // Simulate a brief loading state
      setTimeout(() => {
        const revealedContacts = JSON.parse(localStorage.getItem('revealedContacts') || '[]');
        if (!revealedContacts.includes(profileId)) {
          revealedContacts.push(profileId);
          localStorage.setItem('revealedContacts', JSON.stringify(revealedContacts));
        }
        setHasRevealed(true);
        setIsRevealing(false);
      }, 500);
    }
  };
  
  return { 
    hasRevealed, 
    revealContact,
    isRevealing
  };
};
