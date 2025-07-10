import { supabase } from '@/integrations/supabase/client';
import { validateSecureInput, checkAdvancedRateLimit } from './securityValidation';

// Re-export enhanced validation functions
export { validateSecureInput, checkAdvancedRateLimit, createSafeErrorMessage } from './securityValidation';

// Enhanced input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // First validate the input
  const validation = validateSecureInput(input, 'general');
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid input');
  }
  
  // Then sanitize
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Enhanced email validation
export const isValidEmail = (email: string): boolean => {
  const validation = validateSecureInput(email, 'email');
  return validation.isValid;
};

// Enhanced phone validation  
export const isValidPhone = (phone: string): boolean => {
  const validation = validateSecureInput(phone, 'phone');
  return validation.isValid;
};

// Enhanced display name validation
export const isValidDisplayName = (name: string): boolean => {
  const validation = validateSecureInput(name, 'name');
  return validation.isValid;
};

// Enhanced password validation
export const isValidPassword = (password: string): boolean => {
  const validation = validateSecureInput(password, 'password');
  return validation.isValid;
};

// Enhanced rate limiting - now using advanced rate limiting
export const checkRateLimit = (identifier: string, action: 'login' | 'registration' | 'passwordReset' | 'contactReveal' = 'login'): boolean => {
  const result = checkAdvancedRateLimit(identifier, action);
  return result.allowed;
};

// Enhanced security event logging with structured data
export const logSecurityEvent = async (event: string, details: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  const userAgent = navigator.userAgent;
  const url = window.location.href;
  
  const securityEvent = {
    event_type: event,
    timestamp,
    user_agent: userAgent,
    url,
    ip_address: 'client-side', // Would be filled by server in real implementation
    ...details
  };
  
  // Enhanced logging with severity levels
  const severity = getSeverityLevel(event);
  
  if (severity === 'critical' || severity === 'high') {
    console.error(`🚨 SECURITY ALERT [${severity.toUpperCase()}]: ${event}`, securityEvent);
  } else if (severity === 'medium') {
    console.warn(`🔒 Security Event [${severity.toUpperCase()}]: ${event}`, securityEvent);
  } else {
    console.info(`🔍 Security Event [${severity.toUpperCase()}]: ${event}`, securityEvent);
  }
  
  // In production, send to security monitoring service
  try {
    // Could implement security event logging to external service here
    // await sendToSecurityService(securityEvent);
  } catch (error) {
    console.error('Failed to log security event to external service:', error);
  }
};

const getSeverityLevel = (event: string): 'low' | 'medium' | 'high' | 'critical' => {
  const criticalEvents = ['xss_attempt_blocked', 'sql_injection_attempt', 'authentication_bypass_attempt'];
  const highEvents = ['rate_limit_exceeded', 'suspicious_login_pattern', 'rls_policy_violation'];
  const mediumEvents = ['login_failed', 'rate_limit_blocked_attempt', 'session_validation_error'];
  
  if (criticalEvents.some(e => event.includes(e))) return 'critical';
  if (highEvents.some(e => event.includes(e))) return 'high';
  if (mediumEvents.some(e => event.includes(e))) return 'medium';
  return 'low';
};

// Enhanced auth state cleanup with secure token removal
export const cleanupAuthState = () => {
  try {
    // Remove all possible auth tokens from localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth-token'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Remove from sessionStorage
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('supabase.auth.') || key.includes('sb-') || key.includes('auth-token'))) {
        sessionKeysToRemove.push(key);
      }
    }
    
    sessionKeysToRemove.forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Clear any cookies that might contain auth data
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.includes('supabase') || name.includes('auth') || name.includes('sb-')) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    });
    
    logSecurityEvent('auth_state_cleaned', { timestamp: new Date().toISOString() });
  } catch (error) {
    logSecurityEvent('auth_cleanup_error', { error: error.message });
  }
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
