
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCredits = (userId: string) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    if (!userId) {
      setCredits(0);
      setIsLoading(false);
      return;
    }

    try {
      // Get the latest credit transaction to get the current balance
      const { data, error } = await supabase
        .from('credits')
        .select('balance_after')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credits:', error);
        setCredits(0);
      } else {
        setCredits(data?.balance_after || 0);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCredits = async () => {
    await fetchCredits();
  };

  useEffect(() => {
    fetchCredits();
  }, [userId]);

  return {
    credits,
    isLoading,
    refreshCredits
  };
};
