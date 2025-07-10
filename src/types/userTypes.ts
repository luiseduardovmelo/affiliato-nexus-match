// Extended user types with additional fields that may not be in the main User type

export interface ExtendedUser {
  id: string;
  email: string;
  display_name: string;
  country: string;
  phone: string;
  language: string;
  telegram: string;
  created_at: string;
  updated_at: string;
  status: "active" | "inactive" | "suspended" | "banned";
  role: "operador" | "afiliado" | "admin";
  // Additional fields that may exist
  logo_url?: string;
  rating_cached?: number;
  total_reviews?: number;
  description?: string;
}

export interface ExtendedOperatorData {
  user_id: string;
  description?: string;
  users: ExtendedUser;
  operator_specs?: {
    commission_models?: string[];
    monthly_volume?: string;
    payment_schedule?: string;
    accepts_retargeting?: boolean;
    installs_postback?: boolean;
    platform_type?: string;
    white_label?: string;
    accepted_countries?: string[];
  };
}

export interface ExtendedAffiliateData {
  user_id: string;
  description?: string;
  users: ExtendedUser;
  affiliate_specs?: {
    traffic_sources?: string[];
    charged_value?: string;
    commission_model?: string;
    basic_info?: string;
    work_languages?: string[];
    current_operators?: string | string[];
    previous_operators?: string | string[];
  };
}