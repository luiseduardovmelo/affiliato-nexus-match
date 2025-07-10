// Access control utilities for contact reveals and permissions

export type UserRole = 'operador' | 'afiliado' | 'admin';

export const canRevealContact = (
  revealerRole: UserRole | undefined,
  targetRole: UserRole | undefined,
  revealerId: string,
  targetId: string
): { allowed: boolean; reason?: string } => {
  // Admin can reveal anyone
  if (revealerRole === 'admin') {
    return { allowed: true };
  }

  // Users can always view their own profile
  if (revealerId === targetId) {
    return { allowed: true };
  }

  // Must have valid roles
  if (!revealerRole || !targetRole) {
    return { allowed: false, reason: 'Invalid user roles' };
  }

  // Prevent same role reveals (operators revealing operators, affiliates revealing affiliates)
  if (revealerRole === targetRole) {
    return { 
      allowed: false, 
      reason: `${revealerRole === 'operador' ? 'Operadores' : 'Afiliados'} não podem revelar contatos de outros ${revealerRole === 'operador' ? 'operadores' : 'afiliados'}` 
    };
  }

  // Allow cross-role reveals (affiliates can reveal operators and vice versa)
  if (
    (revealerRole === 'afiliado' && targetRole === 'operador') ||
    (revealerRole === 'operador' && targetRole === 'afiliado')
  ) {
    return { allowed: true };
  }

  return { allowed: false, reason: 'Acesso não autorizado' };
};

export const canViewProfile = (
  viewerRole: UserRole | undefined,
  targetRole: UserRole | undefined,
  viewerId: string,
  targetId: string
): boolean => {
  // Admin can view anyone
  if (viewerRole === 'admin') return true;
  
  // Users can view their own profile
  if (viewerId === targetId) return true;
  
  // All authenticated users can view basic profile info
  // but not contact information (that requires reveal)
  return !!(viewerRole && targetRole);
};