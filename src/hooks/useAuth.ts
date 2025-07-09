import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from '@/integrations/supabase/types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  role?: 'afiliado' | 'operador' | 'admin';
  display_name?: string;
  country?: string;
  [key: string]: any;
}

interface AuthHook {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (email: string, password: string, extraData?: RegisterData) => Promise<{ error: any }>;
  logout: () => Promise<{ error: any }>;
}

export const useAuth = (): AuthHook => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 useAuth: Initial session check', { 
        hasSession: !!session, 
        user: session?.user?.email || 'none' 
      });
      setAuthState({
        user: session?.user ?? null,
        loading: false,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 useAuth: Auth state changed', { 
          event, 
          hasSession: !!session, 
          user: session?.user?.email || 'none' 
        });
        setAuthState({
          user: session?.user ?? null,
          loading: false,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 useAuth: Starting login process...', { email });
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ useAuth: Login error:', error);
        throw error;
      }

      console.log('✅ useAuth: Login successful', { user: data.user?.email, id: data.user?.id });
      return { error: null };
    } catch (error) {
      console.error('❌ useAuth: Login error:', error);
      return { error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const register = async (email: string, password: string, extraData?: RegisterData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: extraData?.role || 'afiliado',
            display_name: extraData?.display_name || '',
            country: extraData?.country || '',
            ...extraData
          }
        }
      });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    login,
    register,
    logout,
  };
};

// Type test using generated Supabase types
export const testAuthTypes = () => {
  // Test UserProfile type from generated types
  const userProfile: UserProfile = {
    id: 'test-id',
    email: 'test@example.com',
    password_hash: 'hash',
    role: 'afiliado',
    status: 'active',
    display_name: 'Test User',
    country: 'Brasil',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('✅ UserProfile type test passed:', userProfile);
  return userProfile;
};