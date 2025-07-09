import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TopUser {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  position: number;
}

export const useTopUsers = (userType: 'affiliate' | 'operator', limit: number = 3) => {
  return useQuery({
    queryKey: ['topUsers', userType, limit],
    queryFn: async () => {
      // Primeiro, buscar usuários do tipo especificado
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          email,
          role,
          status
        `)
        .eq('role', userType === 'affiliate' ? 'afiliado' : 'operador')
        .eq('status', 'active');

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return [];
      }
      
      if (!users || users.length === 0) {
        return [];
      }

      // Buscar todas as avaliações para calcular médias
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('target_id, rating');

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        return [];
      }

      // Calcular médias de avaliação por usuário
      const ratingsMap = new Map<string, number[]>();
      
      if (reviews) {
        reviews.forEach(review => {
          if (!ratingsMap.has(review.target_id)) {
            ratingsMap.set(review.target_id, []);
          }
          ratingsMap.get(review.target_id)!.push(review.rating);
        });
      }

      // Converter para formato esperado e calcular médias
      const usersWithRatings = users.map(user => ({
        id: user.id,
        name: user.display_name || user.email || 'Usuário',
        avatar: '/placeholder.svg',
        rating: ratingsMap.has(user.id) 
          ? ratingsMap.get(user.id)!.reduce((sum, rating) => sum + rating, 0) / ratingsMap.get(user.id)!.length
          : 0,
        position: 0 // Será preenchido depois da ordenação
      }));

      // Ordenar por rating decrescente e limitar
      const sortedUsers = usersWithRatings
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);

      // Adicionar posições
      return sortedUsers.map((user, index) => ({
        ...user,
        position: index + 1
      }));
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useNewUsers = (userType: 'affiliate' | 'operator', limit: number = 10) => {
  return useQuery({
    queryKey: ['newUsers', userType, limit],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('users')
        .select(`
          id,
          display_name,
          email,
          country,
          description,
          created_at
        `)
        .eq('role', userType === 'affiliate' ? 'afiliado' : 'operador')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching new users:', error);
        return [];
      }

      if (!users) return [];

      return users.map(user => ({
        id: user.id,
        name: user.display_name || user.email || 'Usuário',
        avatar: '/placeholder.svg',
        country: user.country || 'Brasil',
        description: user.description || `${userType === 'affiliate' ? 'Afiliado' : 'Operador'} verificado`,
        joinedAt: user.created_at
      }));
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};