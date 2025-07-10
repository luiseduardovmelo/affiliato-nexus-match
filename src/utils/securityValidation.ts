
import { logSecurityEvent } from '@/utils/security';

// Enhanced input validation with more comprehensive checks
export const validateSecureInput = (input: string, type: 'email' | 'password' | 'name' | 'phone' | 'general'): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required and must be a string' };
  }

  // Check for potential XSS patterns
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[\\s]*=[\\s]*["\'](?:javascript:|data:)[^>]*>/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      logSecurityEvent('xss_attempt_blocked', { input: input.substring(0, 100) });
      return { isValid: false, error: 'Invalid characters detected' };
    }
  }

  // Check for SQL injection patterns
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\/\*|\*\/|--|\#)/g,
    /(\b(SCRIPT|JAVASCRIPT|VBSCRIPT|IFRAME|OBJECT|EMBED|FORM)\b)/gi
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      logSecurityEvent('sql_injection_attempt', { input: input.substring(0, 100) });
      return { isValid: false, error: 'Invalid input format' };
    }
  }

  // Type-specific validation
  switch (type) {
    case 'email':
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(input)) {
        return { isValid: false, error: 'Invalid email format' };
      }
      if (input.length > 254) {
        return { isValid: false, error: 'Email too long' };
      }
      break;

    case 'password':
      if (input.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters' };
      }
      if (input.length > 128) {
        return { isValid: false, error: 'Password too long' };
      }
      // Check for common weak passwords
      const weakPasswords = ['password', '123456', 'qwerty', 'admin', 'user'];
      if (weakPasswords.includes(input.toLowerCase())) {
        return { isValid: false, error: 'Password is too common' };
      }
      break;

    case 'name':
      if (input.length < 1 || input.length > 100) {
        return { isValid: false, error: 'Name must be between 1 and 100 characters' };
      }
      // Only allow letters, spaces, hyphens, and apostrophes
      if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(input)) {
        return { isValid: false, error: 'Name contains invalid characters' };
      }
      break;

    case 'phone':
      if (!/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(input)) {
        return { isValid: false, error: 'Invalid phone format' };
      }
      break;

    case 'general':
      if (input.length > 1000) {
        return { isValid: false, error: 'Input too long' };
      }
      break;
  }

  return { isValid: true };
};

// Enhanced rate limiting with different limits for different actions
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 30 * 60 * 1000 },
  registration: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 },
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000, blockDurationMs: 24 * 60 * 60 * 1000 },
  contactReveal: { maxAttempts: 10, windowMs: 60 * 60 * 1000, blockDurationMs: 60 * 60 * 1000 }
};

const rateLimitStore = new Map<string, { count: number; firstAttempt: number; blockedUntil?: number }>();

export const checkAdvancedRateLimit = (identifier: string, action: keyof typeof rateLimitConfigs): { allowed: boolean; retryAfter?: number } => {
  const config = rateLimitConfigs[action];
  const now = Date.now();
  const key = `${action}:${identifier}`;
  
  let record = rateLimitStore.get(key);
  
  // Check if user is currently blocked
  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    logSecurityEvent('rate_limit_blocked_attempt', { action, identifier, retryAfter });
    return { allowed: false, retryAfter };
  }
  
  // Reset if window has passed
  if (!record || (now - record.firstAttempt) > config.windowMs) {
    record = { count: 1, firstAttempt: now };
    rateLimitStore.set(key, record);
    return { allowed: true };
  }
  
  // Increment counter
  record.count++;
  
  // Check if limit exceeded
  if (record.count > config.maxAttempts) {
    record.blockedUntil = now + config.blockDurationMs;
    const retryAfter = Math.ceil(config.blockDurationMs / 1000);
    
    logSecurityEvent('rate_limit_exceeded', { 
      action, 
      identifier, 
      attempts: record.count,
      blockedFor: config.blockDurationMs 
    });
    
    return { allowed: false, retryAfter };
  }
  
  rateLimitStore.set(key, record);
  return { allowed: true };
};

// Session security utilities
export const generateSecureSessionId = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateSessionTimeout = (lastActivity: Date, maxInactiveMs: number = 30 * 60 * 1000): boolean => {
  return (Date.now() - lastActivity.getTime()) < maxInactiveMs;
};

// Content Security Policy helpers
export const sanitizeHtmlContent = (content: string): string => {
  // Remove all HTML tags except safe ones
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi;
  
  return content.replace(tagRegex, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
};

// Secure error handling - don't leak sensitive information
export const createSafeErrorMessage = (error: Error, userFriendlyMessage: string): string => {
  // Log full error for debugging
  console.error('Security error:', error);
  
  // Log security event
  logSecurityEvent('error_occurred', {
    message: error.message,
    stack: error.stack?.substring(0, 500)
  });
  
  // Return safe message to user
  return userFriendlyMessage;
};
