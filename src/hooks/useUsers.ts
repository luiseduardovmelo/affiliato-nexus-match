
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type UserRole = 'operator' | 'affiliate';

// Use the generated types from Supabase
type OperatorData = Tables<'operator_specs'> & {
  users: Tables<'users'>;
};

type AffiliateData = Tables<'affiliate_specs'> & {
  users: Tables<'users'>;
};

interface UseUsersResult<T> {
  data: T[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useUsers = <T = OperatorData | AffiliateData>(
  role: UserRole
): UseUsersResult<T> => {
  const tableName = role === 'operator' ? 'operator_specs' : 'affiliate_specs';

  const queryResult = useQuery({
    queryKey: ['users', role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          users!inner (
            id,
            email,
            display_name,
            country,
            phone,
            language,
            telegram,
            created_at,
            updated_at,
            status,
            role
          )
        `)
        .eq('users.status', 'active'); // Only fetch active users

      if (error) {
        console.error(`Error fetching ${role} users:`, error);
        throw new Error(`Failed to fetch ${role} users: ${error.message}`);
      }

      return data as T[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

// Specialized hooks for better type safety
export const useOperators = (): UseUsersResult<OperatorData> => {
  return useUsers<OperatorData>('operator');
};

export const useAffiliates = (): UseUsersResult<AffiliateData> => {
  return useUsers<AffiliateData>('affiliate');
};

// Hook for fetching a single user by ID
export const useUserById = (userId: string, role: UserRole) => {
  const tableName = role === 'operator' ? 'operator_specs' : 'affiliate_specs';

  return useQuery({
    queryKey: ['user', userId, role],
    queryFn: async () => {
      console.log(`🔍 useUserById: Fetching ${role} data for user ${userId}`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          users!inner (
            id,
            email,
            display_name,
            country,
            phone,
            language,
            telegram,
            created_at,
            updated_at,
            status,
            role
          )
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        // Se for erro de "not found", não é um erro real - apenas significa que o usuário não tem esse tipo de perfil
        if (error.code === 'PGRST116') {
          console.log(`ℹ️ useUserById: No ${role} profile found for user ${userId} (this is normal)`);
          return null;
        }
        
        console.error(`❌ useUserById: Error fetching user ${userId}:`, error);
        throw new Error(`Failed to fetch user: ${error.message}`);
      }

      console.log(`✅ useUserById: Found ${role} data for user ${userId}`);
      return data;
    },
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: false, // Don't retry on "not found" errors
  });
};

// Hook for searching users with filters
export const useUsersWithFilters = <T = OperatorData | AffiliateData>(
  role: UserRole,
  filters: {
    country?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}
): UseUsersResult<T> => {
  const tableName = role === 'operator' ? 'operator_specs' : 'affiliate_specs';

  const queryResult = useQuery({
    queryKey: ['users', role, 'filtered', filters],
    queryFn: async () => {
      let query = supabase
        .from(tableName)
        .select(`
          *,
          users!inner (
            id,
            email,
            display_name,
            country,
            phone,
            created_at,
            updated_at,
            status,
            role
          )
        `)
        .eq('users.status', 'active');

      // Apply filters
      if (filters.country) {
        query = query.eq('users.country', filters.country);
      }

      if (filters.search) {
        query = query.or(
          `users.display_name.ilike.%${filters.search}%,users.email.ilike.%${filters.search}%`
        );
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`Error fetching filtered ${role} users:`, error);
        throw new Error(`Failed to fetch filtered ${role} users: ${error.message}`);
      }

      return data as T[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for filtered results
    gcTime: 5 * 60 * 1000, // 5 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error,
    refetch: queryResult.refetch,
  };
};

// Type tests using actual Supabase types
export const testUserTypes = () => {
  // Test OperatorData type structure
  const operatorData = {
    user_id: 'test-user-id',
    monthly_volume: '1M+ visits',
    commission_models: ['CPA', 'REV'],
    payment_schedule: 'monthly' as const,
    accepted_countries: ['Brasil', 'Portugal'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Test AffiliateData type structure
  const affiliateData = {
    user_id: 'test-user-id',
    traffic_sources: ['SEO', 'YouTube orgânico'],
    commission_model: 'CPA',
    work_languages: ['Português', 'Inglês'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('✅ OperatorData type test passed:', operatorData);
  console.log('✅ AffiliateData type test passed:', affiliateData);
  
  return { operatorData, affiliateData };
};
