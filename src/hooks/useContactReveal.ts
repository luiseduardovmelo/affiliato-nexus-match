import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useContactReveal = (currentUserId: string | undefined, targetUserId: string | undefined) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkRevealStatus = async () => {
      if (!currentUserId || !targetUserId) {
        setIsRevealed(false);
        return;
      }

      // If viewing own profile, always reveal
      if (currentUserId === targetUserId) {
        setIsRevealed(true);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reveal_logs')
          .select('id')
          .eq('revealer_id', currentUserId)
          .eq('target_id', targetUserId)
          .maybeSingle();

        if (error) {
          console.error('Error checking reveal status:', error);
          setIsRevealed(false);
        } else {
          setIsRevealed(!!data);
        }
      } catch (error) {
        console.error('Error checking reveal status:', error);
        setIsRevealed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkRevealStatus();
  }, [currentUserId, targetUserId]);

  return { isRevealed, isLoading };
};