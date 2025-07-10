
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from './useCurrentUser';

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

// Credit balance hook with daily credits tracking
export const useCreditBalance = () => {
  const { currentUser } = useCurrentUser();
  
  return useQuery({
    queryKey: ['creditBalance', currentUser?.id],
    queryFn: async () => {
      if (!currentUser?.id) return null;

      // Get current credit balance
      const { data: creditsData } = await supabase
        .from('credits')
        .select('balance_after')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Get daily credits used today
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const { data: dailyCredits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('type', 'reveal')
        .gte('created_at', todayStart.toISOString());

      // Get last daily refresh
      const { data: lastRefresh } = await supabase
        .from('credits')
        .select('created_at')
        .eq('user_id', currentUser.id)
        .eq('type', 'bonus')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const dailyCreditsUsed = dailyCredits?.length || 0;
      const dailyCreditsRemaining = Math.max(0, 5 - dailyCreditsUsed);

      return {
        totalCredits: creditsData?.balance_after || 0,
        dailyCreditsUsed,
        dailyCreditsRemaining,
        lastDailyRefresh: lastRefresh?.created_at
      };
    },
    enabled: !!currentUser?.id
  });
};

// Add daily credits mutation
export const useAddDailyCredits = () => {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error('User not found');

      // Get current balance
      const { data: currentBalance } = await supabase
        .from('credits')
        .select('balance_after')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const newBalance = (currentBalance?.balance_after || 0) + 5;

      // Add daily credits
      const { error } = await supabase
        .from('credits')
        .insert({
          user_id: currentUser.id,
          type: 'bonus',
          delta: 5,
          balance_after: newBalance,
          description: 'Daily free credits'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creditBalance'] });
    }
  });
};
