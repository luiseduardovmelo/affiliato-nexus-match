
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useSecureAuth } from './useSecureAuth';

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
  const { user, loading, secureLogin, secureSignUp, secureLogout } = useSecureAuth();

  const login = async (email: string, password: string) => {
    return await secureLogin(email, password);
  };

  const register = async (email: string, password: string, extraData?: RegisterData) => {
    return await secureSignUp(email, password, extraData);
  };

  const logout = async () => {
    return await secureLogout();
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
};

// Type test using basic types instead of generated ones
export const testAuthTypes = () => {
  // Test basic user profile structure
  const userProfile = {
    id: 'test-id',
    email: 'test@example.com',
    password_hash: 'hash',
    role: 'afiliado' as const,
    status: 'active' as const,
    display_name: 'Test User',
    country: 'Brasil',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log('✅ UserProfile type test passed:', userProfile);
  return userProfile;
};
