import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CreditTransaction {
  id: string;
  user_id: string;
  delta: number;
  balance_after: number;
  type: string;
  description: string | null;
  related_reveal_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
}

export interface CreditBalance {
  totalCredits: number;
  dailyCreditsUsed: number;
  dailyCreditsRemaining: number;
  lastDailyRefresh: string | null;
  recentTransactions: CreditTransaction[];
}

const DAILY_CREDITS_LIMIT = 5;

// Hook para buscar o saldo atual de créditos
export const useCreditBalance = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['creditBalance', user?.id],
    queryFn: async (): Promise<CreditBalance> => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('💰 Fetching credit balance for user:', user.id);
      
      try {
        // Buscar todas as transações do usuário
        const { data: transactions, error } = await supabase
          .from('credits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching credit transactions:', error);
          throw error;
        }

        console.log('💳 Credit transactions found:', transactions);

        // Se não há transações, dar créditos iniciais
        if (!transactions || transactions.length === 0) {
          console.log('🎁 User has no credit history, should add initial credits');
          
          // Mostrar 5 créditos iniciais disponíveis mesmo sem transações
          const balance: CreditBalance = {
            totalCredits: 5,
            dailyCreditsUsed: 0,
            dailyCreditsRemaining: 5,
            lastDailyRefresh: null,
            recentTransactions: []
          };
          
          return balance;
        }

        // Calcular saldo total
        const totalCredits = transactions.reduce((sum, transaction) => sum + transaction.delta, 0) || 0;
        
        // Calcular créditos usados hoje
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const todayTransactions = transactions?.filter(t => {
          const transactionDate = new Date(t.created_at);
          return transactionDate >= todayStart && transactionDate < todayEnd;
        }) || [];

        const dailyCreditsUsed = Math.abs(todayTransactions
          .filter(t => t.type === 'reveal' && t.delta < 0)
          .reduce((sum, t) => sum + t.delta, 0));

        const dailyCreditsRemaining = Math.max(0, DAILY_CREDITS_LIMIT - dailyCreditsUsed);

        // Buscar a última atualização diária
        const lastDailyRefresh = transactions?.find(t => t.type === 'daily_refresh')?.created_at || null;

        const balance: CreditBalance = {
          totalCredits,
          dailyCreditsUsed,
          dailyCreditsRemaining,
          lastDailyRefresh,
          recentTransactions: transactions?.slice(0, 10) || []
        };

        console.log('📊 Credit balance calculated:', balance);
        return balance;
      } catch (error) {
        console.error('❌ Unexpected error fetching credit balance:', error);
        // Retornar valores padrão em caso de erro
        return {
          totalCredits: 0,
          dailyCreditsUsed: 0,
          dailyCreditsRemaining: 0,
          lastDailyRefresh: null,
          recentTransactions: []
        };
      }
    },
    enabled: !!user,
    refetchInterval: 30000, // Atualizar a cada 30 segundos
    retry: 1,
    retryDelay: 1000
  });
};

// Hook para adicionar créditos diários
export const useAddDailyCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('🌅 Adding daily credits for user:', user.id);

      // Verificar se já foi adicionado hoje
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const { data: todayRefresh, error: checkError } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'daily_refresh')
        .gte('created_at', todayStart.toISOString())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking daily refresh:', checkError);
        throw checkError;
      }

      if (todayRefresh) {
        console.log('✅ Daily credits already added today');
        return todayRefresh;
      }

      // Buscar saldo atual
      const { data: lastTransaction, error: balanceError } = await supabase
        .from('credits')
        .select('balance_after')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const currentBalance = lastTransaction?.balance_after || 0;
      const newBalance = currentBalance + DAILY_CREDITS_LIMIT;

      console.log('➕ Adding daily credits:', {
        currentBalance,
        creditsToAdd: DAILY_CREDITS_LIMIT,
        newBalance
      });

      // Adicionar créditos diários
      const { data, error } = await supabase
        .from('credits')
        .insert({
          user_id: user.id,
          delta: DAILY_CREDITS_LIMIT,
          balance_after: newBalance,
          type: 'daily_refresh',
          description: `Créditos diários adicionados (${DAILY_CREDITS_LIMIT})`,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding daily credits:', error);
        throw error;
      }

      console.log('✅ Daily credits added successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidar cache do saldo de créditos
      queryClient.invalidateQueries({ queryKey: ['creditBalance', user?.id] });
      
      toast({
        title: "Créditos diários adicionados!",
        description: `Você recebeu ${DAILY_CREDITS_LIMIT} créditos para hoje.`,
      });
    },
    onError: (error) => {
      console.error('❌ Failed to add daily credits:', error);
      toast({
        title: "Erro ao adicionar créditos",
        description: "Não foi possível adicionar os créditos diários.",
        variant: "destructive",
      });
    },
  });
};

// Hook para descontar créditos na revelação de contato
export const useRevealContact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetId, targetName }: { targetId: string; targetName: string }) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('🔍 Revealing contact for:', { targetId, targetName, userId: user.id });

      // Verificar se já foi revelado
      const { data: existingReveal, error: checkError } = await supabase
        .from('reveal_logs')
        .select('*')
        .eq('revealer_id', user.id)
        .eq('target_id', targetId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing reveal:', checkError);
        throw checkError;
      }

      if (existingReveal) {
        console.log('✅ Contact already revealed');
        return { alreadyRevealed: true, revealLog: existingReveal };
      }

      // Buscar saldo atual
      const { data: lastTransaction, error: balanceError } = await supabase
        .from('credits')
        .select('balance_after')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let currentBalance = lastTransaction?.balance_after || 0;

      // Se o usuário nunca teve transações, dar créditos iniciais
      if (!lastTransaction) {
        console.log('🎁 User has no credit history, adding initial credits');
        
        const { data: initialCredit, error: initialError } = await supabase
          .from('credits')
          .insert({
            user_id: user.id,
            delta: 5,
            balance_after: 5,
            type: 'initial_bonus',
            description: 'Créditos iniciais de boas-vindas',
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (initialError) {
          console.error('❌ Error adding initial credits:', initialError);
          throw initialError;
        }

        currentBalance = 5;
        console.log('✅ Initial credits added:', initialCredit);
      }

      if (currentBalance < 1) {
        throw new Error('Créditos insuficientes para revelar contato');
      }

      const newBalance = currentBalance - 1;

      console.log('💳 Deducting credit:', {
        currentBalance,
        creditCost: 1,
        newBalance
      });

      // Criar log de revelação
      const { data: revealLog, error: revealError } = await supabase
        .from('reveal_logs')
        .insert({
          revealer_id: user.id,
          target_id: targetId,
          cost_credits: 1,
          revealed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (revealError) {
        console.error('❌ Error creating reveal log:', revealError);
        throw revealError;
      }

      // Descontar crédito
      const { data: creditTransaction, error: creditError } = await supabase
        .from('credits')
        .insert({
          user_id: user.id,
          delta: -1,
          balance_after: newBalance,
          type: 'reveal',
          description: `Revelação de contato: ${targetName}`,
          related_reveal_id: revealLog.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (creditError) {
        console.error('❌ Error deducting credit:', creditError);
        throw creditError;
      }

      console.log('✅ Contact revealed successfully:', {
        revealLog,
        creditTransaction
      });

      return { alreadyRevealed: false, revealLog, creditTransaction };
    },
    onSuccess: (data) => {
      // Invalidar cache do saldo de créditos
      queryClient.invalidateQueries({ queryKey: ['creditBalance', user?.id] });
      
      if (!data.alreadyRevealed) {
        toast({
          title: "Contato revelado!",
          description: "1 crédito foi descontado do seu saldo.",
        });
      }
    },
    onError: (error: any) => {
      console.error('❌ Failed to reveal contact:', error);
      
      if (error.message.includes('Créditos insuficientes')) {
        toast({
          title: "Créditos insuficientes",
          description: "Você não tem créditos suficientes para revelar este contato.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao revelar contato",
          description: "Não foi possível revelar o contato. Tente novamente.",
          variant: "destructive",
        });
      }
    },
  });
};

// Hook para verificar se um contato já foi revelado
export const useIsContactRevealed = (targetId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['contactRevealed', user?.id, targetId],
    queryFn: async (): Promise<boolean> => {
      if (!user || !targetId) return false;

      try {
        const { data, error } = await supabase
          .from('reveal_logs')
          .select('id')
          .eq('revealer_id', user.id)
          .eq('target_id', targetId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Error checking contact reveal:', error);
          return false;
        }

        return !!data;
      } catch (error) {
        console.error('❌ Unexpected error checking contact reveal:', error);
        return false;
      }
    },
    enabled: !!user && !!targetId,
    retry: 1,
    retryDelay: 1000,
  });
};