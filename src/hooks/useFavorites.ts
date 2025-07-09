import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteUser {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  role: 'affiliate' | 'operator';
  country: string;
  description: string;
  addedAt: string;
}

// Hook para buscar favoritos do usuário atual
export const useFavorites = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Como não temos tabela específica de favoritos, vamos simular usando localStorage
      // Em produção, isso seria uma tabela no banco de dados
      const favorites = localStorage.getItem(`favorites_${user.id}`);
      if (!favorites) return [];

      const favoriteIds = JSON.parse(favorites);
      
      // Buscar dados dos usuários favoritos
      const { data: profiles, error } = await supabase
        .from('users')
        .select(`
          id,
          role,
          description,
          display_name,
          email,
          country
        `)
        .in('id', favoriteIds)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      if (!profiles) return [];

      // Buscar ratings para cada usuário
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('target_id, rating')
        .in('target_id', favoriteIds);

      if (reviewsError) {
        console.error('Error fetching reviews for favorites:', reviewsError);
      }

      // Calcular ratings médios
      const ratingsMap = new Map<string, number[]>();
      if (reviews) {
        reviews.forEach(review => {
          if (!ratingsMap.has(review.target_id)) {
            ratingsMap.set(review.target_id, []);
          }
          ratingsMap.get(review.target_id)!.push(review.rating);
        });
      }

      // Converter para formato esperado
      return profiles.map(profile => ({
        id: profile.id,
        name: profile.display_name || profile.email || 'Usuário',
        avatar: '/placeholder.svg',
        rating: ratingsMap.has(profile.id) 
          ? ratingsMap.get(profile.id)!.reduce((sum, rating) => sum + rating, 0) / ratingsMap.get(profile.id)!.length
          : 0,
        role: profile.role === 'afiliado' ? 'affiliate' : 'operator',
        country: profile.country || 'Brasil',
        description: profile.description || `${profile.role === 'afiliado' ? 'Afiliado' : 'Operador'} verificado`,
        addedAt: new Date().toISOString() // Em produção, viria do banco
      }));
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para verificar se um usuário está nos favoritos
export const useIsFavorite = (targetId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['isFavorite', user?.id, targetId],
    queryFn: async () => {
      if (!user?.id || !targetId) return false;
      
      const favorites = localStorage.getItem(`favorites_${user.id}`);
      if (!favorites) return false;
      
      const favoriteIds = JSON.parse(favorites);
      return favoriteIds.includes(targetId);
    },
    enabled: !!user?.id && !!targetId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para adicionar/remover favoritos
export const useToggleFavorite = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetId, isCurrentlyFavorite }: { targetId: string; isCurrentlyFavorite: boolean }) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const storageKey = `favorites_${user.id}`;
      const favorites = localStorage.getItem(storageKey);
      let favoriteIds = favorites ? JSON.parse(favorites) : [];

      if (isCurrentlyFavorite) {
        // Remover dos favoritos
        favoriteIds = favoriteIds.filter((id: string) => id !== targetId);
      } else {
        // Adicionar aos favoritos
        if (!favoriteIds.includes(targetId)) {
          favoriteIds.push(targetId);
        }
      }

      localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
      return !isCurrentlyFavorite;
    },
    onSuccess: (isFavorite, { targetId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['isFavorite', user?.id, targetId] });
      
      toast({
        title: isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: isFavorite 
          ? "Este parceiro foi adicionado aos seus favoritos"
          : "Este parceiro foi removido dos seus favoritos",
      });
    },
    onError: (error) => {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    },
  });
};