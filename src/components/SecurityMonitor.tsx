
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/security';

export const SecurityMonitor = () => {
  useEffect(() => {
    // Monitor for suspicious activities
    const monitorAuthEvents = () => {
      // Track failed login attempts patterns
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(' ');
        
        // Monitor for potential security issues
        if (message.includes('Invalid login credentials')) {
          logSecurityEvent('suspicious_login_pattern', {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
          });
        }
        
        if (message.includes('Row Level Security') || message.includes('RLS')) {
          logSecurityEvent('rls_policy_violation', {
            timestamp: new Date().toISOString(),
            message: message,
            url: window.location.href
          });
        }
        
        originalConsoleError.apply(console, args);
      };
      
      return () => {
        console.error = originalConsoleError;
      };
    };

    const cleanup = monitorAuthEvents();

    // Monitor page visibility for session security
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if session is still valid when user returns
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (error) {
            logSecurityEvent('session_validation_error', {
              error: error.message,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};
