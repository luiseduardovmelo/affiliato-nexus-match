
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';
import { 
  cleanupAuthState, 
  checkAdvancedRateLimit, 
  logSecurityEvent, 
  sanitizeInput, 
  isValidEmail,
  isValidPassword,
  createSafeErrorMessage
} from '@/utils/security';

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
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          });
        } else if (event === 'SIGNED_OUT') {
          await logSecurityEvent('user_signed_out', { 
            timestamp: new Date().toISOString() 
          });
        } else if (event === 'TOKEN_REFRESHED') {
          await logSecurityEvent('token_refreshed', { 
            userId: session?.user?.id,
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
        logSecurityEvent('session_validation_error', {
          error: error.message,
          timestamp: new Date().toISOString()
        });
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
      logSecurityEvent('critical_auth_error', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
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
      // Enhanced input validation
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Senha deve ter pelo menos 8 caracteres');
      }
      
      // Enhanced rate limiting
      const rateCheck = checkAdvancedRateLimit(sanitizedEmail, 'login');
      if (!rateCheck.allowed) {
        await logSecurityEvent('login_rate_limited', { 
          email: sanitizedEmail,
          retryAfter: rateCheck.retryAfter 
        });
        const minutes = Math.ceil((rateCheck.retryAfter || 0) / 60);
        throw new Error(`Muitas tentativas de login. Tente novamente em ${minutes} minutos.`);
      }
      
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn('Pre-login signout failed:', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: password,
      });

      if (error) {
        await logSecurityEvent('login_failed', { 
          email: sanitizedEmail, 
          error: error.message,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
      
      if (data.user) {
        await logSecurityEvent('login_successful', {
          userId: data.user.id,
          email: sanitizedEmail,
          timestamp: new Date().toISOString()
        });
        
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return { error: null };
    } catch (error: any) {
      const safeError = createSafeErrorMessage(error, 'Erro ao fazer login. Tente novamente.');
      
      let errorMessage = 'Erro ao fazer login. Tente novamente.';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error.message?.includes('minutos')) {
        errorMessage = error.message;
      } else if (error.message?.includes('formato') || error.message?.includes('inválido')) {
        errorMessage = error.message;
      } else if (error.message?.includes('caracteres')) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { error: errorMessage };
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const secureSignUp = async (email: string, password: string, extraData?: any) => {
    try {
      // Enhanced input validation
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      const sanitizedDisplayName = extraData?.display_name ? sanitizeInput(extraData.display_name) : '';
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Formato de email inválido');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('A senha deve ter pelo menos 8 caracteres e não pode ser muito comum');
      }
      
      // Enhanced rate limiting
      const rateCheck = checkAdvancedRateLimit(sanitizedEmail, 'registration');
      if (!rateCheck.allowed) {
        await logSecurityEvent('registration_rate_limited', { 
          email: sanitizedEmail,
          retryAfter: rateCheck.retryAfter 
        });
        const hours = Math.ceil((rateCheck.retryAfter || 0) / 3600);
        throw new Error(`Muitas tentativas de cadastro. Tente novamente em ${hours} horas.`);
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
          error: error.message,
          timestamp: new Date().toISOString()
        });
        throw error;
      }
      
      await logSecurityEvent('signup_successful', { 
        email: sanitizedEmail,
        timestamp: new Date().toISOString()
      });
      
      return { error: null };
    } catch (error: any) {
      const safeError = createSafeErrorMessage(error, 'Erro ao criar conta. Tente novamente.');
      
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      
      if (error.message?.includes('already registered')) {
        errorMessage = 'Este email já está registrado.';
      } else if (error.message?.includes('weak password') || error.message?.includes('comum')) {
        errorMessage = error.message.includes('comum') ? error.message : 'Senha muito simples. Use pelo menos 8 caracteres.';
      } else if (error.message?.includes('formato') || error.message?.includes('caracteres') || error.message?.includes('inválido')) {
        errorMessage = error.message;
      } else if (error.message?.includes('horas')) {
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
        userId: authState.user?.id,
        timestamp: new Date().toISOString()
      });
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.warn('Global signout failed, continuing with cleanup');
      }
      
      await logSecurityEvent('logout_completed', {
        timestamp: new Date().toISOString()
      });
      
      // Force page reload for clean state
      window.location.href = '/';
      
      return { error: null };
    } catch (error: any) {
      const safeError = createSafeErrorMessage(error, 'Erro ao fazer logout.');
      console.error('Secure logout error:', safeError);
      // Force redirect even if logout fails
      window.location.href = '/';
      return { error: safeError };
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
