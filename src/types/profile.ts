
export interface BaseUserProfile {
  id: string;
  email: string;
  display_name: string;
  country: string;
  phone: string;
  language: string | null;
  telegram: string | null;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  role: 'afiliado' | 'operador' | 'admin';
  description?: string;
  logo_url?: string;
  rating_cached?: number;
  total_reviews?: number;
}

export interface OperatorProfile extends BaseUserProfile {
  role: 'operador';
  operator_specs: {
    user_id: string;
    monthly_volume: string | null;
    commission_models: string[] | null;
    payment_schedule: string | null;
    accepted_countries: string[] | null;
    platform_type: string | null;
    accepts_retargeting: boolean | null;
    installs_postback: boolean | null;
    white_label: string | null;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
}

export interface AffiliateProfile extends BaseUserProfile {
  role: 'afiliado';
  affiliate_specs: {
    user_id: string;
    traffic_sources: string[] | null;
    commission_model: string | null;
    work_languages: string[] | null;
    charged_value: string | null;
    basic_info: string | null;
    current_operators: string | null;
    previous_operators: string | null;
    description: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
}

export type UserProfile = OperatorProfile | AffiliateProfile;

// Type guards - export as regular functions, not types
export function isOperatorProfile(profile: UserProfile): profile is OperatorProfile {
  return profile.role === 'operador';
}

export function isAffiliateProfile(profile: UserProfile): profile is AffiliateProfile {
  return profile.role === 'afiliado';
}
