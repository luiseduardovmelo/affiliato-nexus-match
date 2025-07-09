import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  reviewer_id: string;
  target_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  userHasRated: boolean;
  userReview?: Review;
}

// Hook para buscar estatísticas de avaliações de um perfil
export const useReviewStats = (targetId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reviewStats', targetId, user?.id],
    queryFn: async (): Promise<ReviewStats> => {
      console.log('🔍 Fetching review stats for:', targetId);
      
      // Buscar todas as avaliações do usuário alvo
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('target_id', targetId);

      if (error) {
        console.error('❌ Error fetching reviews:', error);
        throw error;
      }

      console.log('📊 Reviews found:', reviews);

      // Calcular estatísticas
      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

      // Verificar se o usuário atual já avaliou
      const userReview = user ? reviews?.find(review => review.reviewer_id === user.id) : undefined;
      const userHasRated = !!userReview;

      const stats = {
        averageRating,
        totalReviews,
        userHasRated,
        userReview
      };

      console.log('📈 Review stats calculated:', stats);
      return stats;
    },
    enabled: !!targetId,
  });
};

// Hook para buscar todas as avaliações de um perfil
export const useReviews = (targetId: string) => {
  return useQuery({
    queryKey: ['reviews', targetId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(display_name, email)
        `)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching reviews:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!targetId,
  });
};

// Hook para criar ou atualizar uma avaliação
export const useSubmitReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      targetId, 
      rating, 
      comment 
    }: { 
      targetId: string; 
      rating: number; 
      comment?: string; 
    }) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      console.log('💾 Submitting review:', { targetId, rating, comment, userId: user.id });

      // Verificar se o usuário já avaliou
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('*')
        .eq('reviewer_id', user.id)
        .eq('target_id', targetId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing review:', checkError);
        throw checkError;
      }

      const reviewData = {
        reviewer_id: user.id,
        target_id: targetId,
        rating,
        comment: comment || null,
        is_verified: true,
        updated_at: new Date().toISOString()
      };

      if (existingReview) {
        // Atualizar avaliação existente
        console.log('🔄 Updating existing review:', existingReview.id);
        const { data, error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', existingReview.id)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating review:', error);
          throw error;
        }

        console.log('✅ Review updated successfully:', data);
        return data;
      } else {
        // Criar nova avaliação
        console.log('➕ Creating new review');
        const { data, error } = await supabase
          .from('reviews')
          .insert({
            ...reviewData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating review:', error);
          throw error;
        }

        console.log('✅ Review created successfully:', data);
        return data;
      }
    },
    onSuccess: (data, variables) => {
      console.log('🎉 Review submission successful');
      
      // Invalidar cache das estatísticas e reviews
      queryClient.invalidateQueries({ queryKey: ['reviewStats', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.targetId] });
      
      toast({
        title: "Avaliação enviada!",
        description: "Sua avaliação foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('❌ Review submission failed:', error);
      toast({
        title: "Erro ao enviar avaliação",
        description: "Não foi possível salvar sua avaliação. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};