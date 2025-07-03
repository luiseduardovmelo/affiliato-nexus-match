import { useState, useEffect } from 'react';

export const useRevealState = (profileId: string) => {
  const [hasRevealed, setHasRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Verificar se já revelou este contato
  useEffect(() => {
    const checkRevealStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !profileId) return;
      
      try {
        const response = await fetch(`/api/reveals/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ target_id: profileId })
        });
        
        const data = await response.json();
        setHasRevealed(data.already_revealed || false);
      } catch (error) {
        console.error('Erro ao verificar status de reveal:', error);
      }
    };
    
    checkRevealStatus();
  }, [profileId]);
  
  const revealContact = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('Não autenticado');
    
    setLoading(true);
    try {
      const response = await fetch('/api/reveals/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ target_id: profileId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setHasRevealed(true);
        return data.contact_info;
      } else {
        throw new Error(data.error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return { hasRevealed, revealContact, loading };
};
