
import { supabase } from '@/integrations/supabase/client';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

// Validate phone format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,20}$/;
  return phoneRegex.test(phone);
};

// Validate display name
export const isValidDisplayName = (name: string): boolean => {
  return name.length >= 1 && name.length <= 100;
};

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const attempts = authAttempts.get(identifier);
  
  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    return false;
  }
  
  // Increment attempts
  authAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: now });
  return true;
};

// Security event logging
export const logSecurityEvent = async (event: string, details: Record<string, any>) => {
  console.warn(`🔒 Security Event: ${event}`, details);
  
  // In production, you might want to send this to a security monitoring service
  // For now, we'll just log to console and could extend to send to Supabase
  try {
    // Could implement security event logging to a dedicated table
    // await supabase.from('security_events').insert({
    //   event_type: event,
    //   details: details,
    //   timestamp: new Date().toISOString(),
    //   user_id: (await supabase.auth.getUser()).data.user?.id
    // });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Clean auth state utility
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Secure logout function
export const secureLogout = async () => {
  try {
    // Clean up auth state first
    cleanupAuthState();
    
    // Attempt global sign out
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.warn('Global signout failed, continuing with cleanup');
    }
    
    // Force page reload for clean state
    window.location.href = '/';
  } catch (error) {
    console.error('Secure logout error:', error);
    // Force redirect even if logout fails
    window.location.href = '/';
  }
};

// Validate user role
export const validateUserRole = (role: string): boolean => {
  const validRoles = ['afiliado', 'operador', 'admin'];
  return validRoles.includes(role);
};

// Check if user has admin role
export const isAdmin = async (): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return false;
    
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.user.id)
      .single();
    
    return userData?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};
