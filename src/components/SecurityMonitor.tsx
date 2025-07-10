
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent, validateSessionTimeout } from '@/utils/security';

export const SecurityMonitor = () => {
  const lastActivityRef = useRef(new Date());
  const sessionTimeoutRef = useRef<NodeJS.Timeout>();
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIMEOUT_MS = 25 * 60 * 1000; // 25 minutes (5 min warning)

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
            url: window.location.href,
            message: message
          });
        }
        
        if (message.includes('Row Level Security') || message.includes('RLS')) {
          logSecurityEvent('rls_policy_violation', {
            timestamp: new Date().toISOString(),
            message: message,
            url: window.location.href,
            userAgent: navigator.userAgent
          });
        }

        // Monitor for potential XSS attempts
        if (message.includes('script') && message.includes('blocked')) {
          logSecurityEvent('potential_xss_blocked', {
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

    // Activity monitoring for session timeout
    const updateLastActivity = () => {
      lastActivityRef.current = new Date();
      
      // Reset session timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      
      sessionTimeoutRef.current = setTimeout(() => {
        logSecurityEvent('session_timeout_warning', {
          timestamp: new Date().toISOString(),
          lastActivity: lastActivityRef.current.toISOString()
        });
        
        // Show warning to user about impending timeout
        console.warn('⚠️ Session will expire in 5 minutes due to inactivity');
        
        // Set final timeout
        setTimeout(async () => {
          const isValid = validateSessionTimeout(lastActivityRef.current, SESSION_TIMEOUT_MS);
          if (!isValid) {
            await logSecurityEvent('session_timeout_forced_logout', {
              timestamp: new Date().toISOString(),
              lastActivity: lastActivityRef.current.toISOString()
            });
            
            // Force logout due to inactivity
            await supabase.auth.signOut();
            window.location.href = '/';
          }
        }, 5 * 60 * 1000); // 5 minutes after warning
        
      }, WARNING_TIMEOUT_MS);
    };

    // Monitor page visibility for session security
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateLastActivity();
        
        // Check if session is still valid when user returns
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (error) {
            logSecurityEvent('session_validation_error_on_focus', {
              error: error.message,
              timestamp: new Date().toISOString()
            });
          } else if (session) {
            // Validate session hasn't been inactive too long
            const isValid = validateSessionTimeout(lastActivityRef.current, SESSION_TIMEOUT_MS);
            if (!isValid) {
              logSecurityEvent('session_expired_on_focus', {
                timestamp: new Date().toISOString(),
                lastActivity: lastActivityRef.current.toISOString()
              });
              supabase.auth.signOut();
            }
          }
        });
      }
    };

    // Monitor for potential security threats in URL
    const monitorURL = () => {
      const url = window.location.href;
      const suspiciousPatterns = [
        /javascript:/i,
        /<script/i,
        /onload=/i,
        /onerror=/i,
        /vbscript:/i,
        /data:text\/html/i
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          logSecurityEvent('suspicious_url_detected', {
            url: url,
            timestamp: new Date().toISOString(),
            pattern: pattern.toString()
          });
          
          // Redirect to safe page
          window.location.href = '/';
          break;
        }
      }
    };

    // Monitor for clipboard security (potential data exfiltration)
    const handleCopy = (event: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 100) {
        logSecurityEvent('large_clipboard_copy', {
          timestamp: new Date().toISOString(),
          dataLength: selection.length,
          url: window.location.href
        });
      }
    };

    // Monitor for rapid consecutive requests (potential bot activity)
    let requestCount = 0;
    let requestTimer: NodeJS.Timeout;
    
    const monitorRequests = () => {
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        requestCount++;
        
        // Reset counter after 10 seconds
        clearTimeout(requestTimer);
        requestTimer = setTimeout(() => {
          requestCount = 0;
        }, 10000);
        
        // Check for suspicious request patterns
        if (requestCount > 20) { // More than 20 requests in 10 seconds
          logSecurityEvent('suspicious_request_pattern', {
            timestamp: new Date().toISOString(),
            requestCount,
            url: args[0],
            userAgent: navigator.userAgent
          });
        }
        
        return originalFetch.apply(window, args);
      };
      
      return () => {
        window.fetch = originalFetch;
      };
    };

    // Initialize all monitoring
    const cleanupAuth = monitorAuthEvents();
    const cleanupRequests = monitorRequests();
    
    // Set up event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateLastActivity, { passive: true });
    });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    
    // Initial activity update and URL check
    updateLastActivity();
    monitorURL();

    // Cleanup function
    return () => {
      cleanupAuth();
      cleanupRequests();
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateLastActivity);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      
      clearTimeout(requestTimer);
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};
