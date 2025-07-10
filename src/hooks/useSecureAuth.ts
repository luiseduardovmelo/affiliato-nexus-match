
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import { cleanupAuthState, checkRateLimit, logSecurityEvent, sanitizeInput, isValidEmail } from '@/utils/security';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    loading: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Log auth events for security monitoring
        if (event === 'SIGNED_IN') {
          await logSecurityEvent('user_signed_in', { 
            userId: session?.user?.id,
            timestamp: new Date().toISOString() 
          });
        } else if (event === 'SIGNED_OUT') {
          await logSecurityEvent('user_signed_out', { 
            timestamp: new Date().toISOString() 
          });
        }
        
        setAuthState({
          user: session?.user ?? null,
          session: session,
          loading: false,
        });
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Auth session error:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
        return;
      }
      
      setAuthState({
        user: session?.user ?? null,
        session: session,
        loading: false,
      });
    }).catch((error) => {
      if (!mounted) return;
      
      console.error('Critical auth error:', error);
      setAuthState({
        user: null,
        session: null,
        loading: false,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const secureLogin = async (email: string, password: string) => {
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      // Validate email format
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      // Check rate limiting
      if (!checkRateLimit(sanitizedEmail)) {
        await logSecurityEvent('rate_limit_exceeded', { email: sanitizedEmail });
        throw new Error('Muitas tentativas de login. Tente novamente em 15 minutos.');
      }
      
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        await logSecurityEvent('login_failed', { 
          email: sanitizedEmail, 
          error: error.message 
        });
        throw error;
      }
      
      if (data.user) {
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Secure login error:', error);
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('rate')) {
        errorMessage = error.message;
      } else if (error.message?.includes('formato')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error: error.message };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const secureSignUp = async (email: string, password: string, extraData?: any) => {
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      const sanitizedDisplayName = extraData?.display_name ? sanitizeInput(extraData.display_name) : '';
      
      // Validate inputs
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }
      
      // Check rate limiting
      if (!checkRateLimit(sanitizedEmail)) {
        await logSecurityEvent('signup_rate_limit_exceeded', { email: sanitizedEmail });
        throw new Error('Muitas tentativas de cadastro. Tente novamente em 15 minutos.');
      }
      
      setAuthState(prev => ({ ...prev, loading: true }));
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            ...extraData,
            display_name: sanitizedDisplayName,
          }
        }
      });

      if (error) {
        await logSecurityEvent('signup_failed', { 
          email: sanitizedEmail, 
          error: error.message 
        });
        throw error;
      }
      
      await logSecurityEvent('signup_successful', { email: sanitizedEmail });
      
      return { error: null };
    } catch (error: any) {
      console.error('Secure signup error:', error);
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está registrado.';
      } else if (error.message?.includes('weak password')) {
        errorMessage = 'Senha muito simples. Use pelo menos 6 caracteres.';
      } else if (error.message?.includes('formato') || error.message?.includes('caracteres')) {
        errorMessage = error.message;
      }
      
      return { error: errorMessage };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const secureLogout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      
      await logSecurityEvent('logout_initiated', { 
        userId: authState.user?.id 
      });
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Global signout failed, continuing with cleanup');
      }
      
      // Force page reload for clean state
      window.location.href = '/';
      
      return { error: null };
    } catch (error: any) {
      console.error('Secure logout error:', error);
      // Force redirect even if logout fails
      window.location.href = '/';
      return { error: error.message };
    }
  };

  return {
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    secureLogin,
    secureSignUp,
    secureLogout,
  };
};
