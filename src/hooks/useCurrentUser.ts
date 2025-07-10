
import { useAuth } from './useAuth';
import { useUserById } from './useUsers';
import { useMemo } from 'react';

export const useCurrentUser = () => {
  const { user, loading: authLoading } = useAuth();
  
  console.log('🔍 useCurrentUser: Getting data for user', user?.id);
  
  // Try to get user data from both tables
  const { data: operatorData, isLoading: isLoadingOperator } = useUserById(user?.id || '', 'operator');
  const { data: affiliateData, isLoading: isLoadingAffiliate } = useUserById(user?.id || '', 'affiliate');
  
  console.log('📊 useCurrentUser: Data received', { 
    operatorData: !!operatorData, 
    affiliateData: !!affiliateData, 
    operatorLoading: isLoadingOperator,
    affiliateLoading: isLoadingAffiliate
  });
  
  const isLoading = authLoading || isLoadingOperator || isLoadingAffiliate;
  const userData = operatorData || affiliateData;
  
  const currentUser = useMemo(() => {
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      auth: user,
      profile: userData,
      isOperator: !!operatorData,
      isAffiliate: !!affiliateData,
      hasProfile: !!userData,
      displayName: userData?.users?.display_name || user.email || 'Usuário',
      country: userData?.users?.country || 'Brasil',
      role: userData?.users?.role || user.user_metadata?.role || 'afiliado',
      specificData: userData
    };
  }, [user, userData, operatorData, affiliateData]);
  
  return {
    currentUser,
    isLoading,
    isAuthenticated: !!user,
    hasProfile: !!userData,
  };
};

export default useCurrentUser;
