export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      affiliate_specs: {
        Row: {
          basic_info: string | null
          charged_value: string | null
          commission_model: string | null
          created_at: string | null
          current_operators: string | null
          description: string | null
          minimum_cpm: number | null
          monthly_traffic: string | null
          other_languages: string | null
          other_operators_details: string | null
          previous_operators: string | null
          promotion_channels: string[] | null
          specialties: string[] | null
          traffic_sources: string[] | null
          updated_at: string | null
          user_id: string
          work_languages: string[] | null
          works_with_others: boolean | null
        }
        Insert: {
          basic_info?: string | null
          charged_value?: string | null
          commission_model?: string | null
          created_at?: string | null
          current_operators?: string | null
          description?: string | null
          minimum_cpm?: number | null
          monthly_traffic?: string | null
          other_languages?: string | null
          other_operators_details?: string | null
          previous_operators?: string | null
          promotion_channels?: string[] | null
          specialties?: string[] | null
          traffic_sources?: string[] | null
          updated_at?: string | null
          user_id: string
          work_languages?: string[] | null
          works_with_others?: boolean | null
        }
        Update: {
          basic_info?: string | null
          charged_value?: string | null
          commission_model?: string | null
          created_at?: string | null
          current_operators?: string | null
          description?: string | null
          minimum_cpm?: number | null
          monthly_traffic?: string | null
          other_languages?: string | null
          other_operators_details?: string | null
          previous_operators?: string | null
          promotion_channels?: string[] | null
          specialties?: string[] | null
          traffic_sources?: string[] | null
          updated_at?: string | null
          user_id?: string
          work_languages?: string[] | null
          works_with_others?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_specs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      credits: {
        Row: {
          balance_after: number
          created_at: string | null
          delta: number
          description: string | null
          id: string
          related_reveal_id: string | null
          stripe_payment_intent_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string | null
          delta: number
          description?: string | null
          id?: string
          related_reveal_id?: string | null
          stripe_payment_intent_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string | null
          delta?: number
          description?: string | null
          id?: string
          related_reveal_id?: string | null
          stripe_payment_intent_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      operator_specs: {
        Row: {
          accepted_countries: string[] | null
          accepts_retargeting: boolean | null
          allows_retargeting: boolean | null
          commission_models: string[] | null
          cpa_first_deposit: number | null
          cpa_qualified_lead: number | null
          created_at: string | null
          description: string | null
          has_white_label: boolean | null
          installs_postback: boolean | null
          minimum_traffic: number | null
          monthly_volume: string | null
          offers_postback: boolean | null
          payment_schedule: string | null
          platform_type: string | null
          revenue_share_rate: number | null
          segments: string[] | null
          updated_at: string | null
          user_id: string
          white_label: string | null
          white_label_details: string | null
        }
        Insert: {
          accepted_countries?: string[] | null
          accepts_retargeting?: boolean | null
          allows_retargeting?: boolean | null
          commission_models?: string[] | null
          cpa_first_deposit?: number | null
          cpa_qualified_lead?: number | null
          created_at?: string | null
          description?: string | null
          has_white_label?: boolean | null
          installs_postback?: boolean | null
          minimum_traffic?: number | null
          monthly_volume?: string | null
          offers_postback?: boolean | null
          payment_schedule?: string | null
          platform_type?: string | null
          revenue_share_rate?: number | null
          segments?: string[] | null
          updated_at?: string | null
          user_id: string
          white_label?: string | null
          white_label_details?: string | null
        }
        Update: {
          accepted_countries?: string[] | null
          accepts_retargeting?: boolean | null
          allows_retargeting?: boolean | null
          commission_models?: string[] | null
          cpa_first_deposit?: number | null
          cpa_qualified_lead?: number | null
          created_at?: string | null
          description?: string | null
          has_white_label?: boolean | null
          installs_postback?: boolean | null
          minimum_traffic?: number | null
          monthly_volume?: string | null
          offers_postback?: boolean | null
          payment_schedule?: string | null
          platform_type?: string | null
          revenue_share_rate?: number | null
          segments?: string[] | null
          updated_at?: string | null
          user_id?: string
          white_label?: string | null
          white_label_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "operator_specs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reveal_logs: {
        Row: {
          cost_credits: number
          id: string
          revealed_at: string | null
          revealer_id: string
          target_id: string
        }
        Insert: {
          cost_credits?: number
          id?: string
          revealed_at?: string | null
          revealer_id: string
          target_id: string
        }
        Update: {
          cost_credits?: number
          id?: string
          revealed_at?: string | null
          revealer_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reveal_logs_revealer_id_fkey"
            columns: ["revealer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reveal_logs_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          reviewer_id: string
          target_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          reviewer_id: string
          target_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          reviewer_id?: string
          target_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          contact_info: Json | null
          country: string
          created_at: string | null
          daily_reveal_limit: number | null
          description: string | null
          display_name: string
          email: string
          how_did_you_hear: string | null
          id: string
          is_contact_public: boolean | null
          language: string | null
          last_active_at: string | null
          logo_url: string | null
          newsletter_opt_in: boolean | null
          password_hash: string
          phone: string
          plan_expires_at: string | null
          plan_type: Database["public"]["Enums"]["plan_type"] | null
          profile_description: string | null
          public_email: string | null
          rating_cached: number | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          telegram: string | null
          terms_accepted: boolean | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          contact_info?: Json | null
          country: string
          created_at?: string | null
          daily_reveal_limit?: number | null
          description?: string | null
          display_name: string
          email: string
          how_did_you_hear?: string | null
          id?: string
          is_contact_public?: boolean | null
          language?: string | null
          last_active_at?: string | null
          logo_url?: string | null
          newsletter_opt_in?: boolean | null
          password_hash: string
          phone: string
          plan_expires_at?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          profile_description?: string | null
          public_email?: string | null
          rating_cached?: number | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          telegram?: string | null
          terms_accepted?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          contact_info?: Json | null
          country?: string
          created_at?: string | null
          daily_reveal_limit?: number | null
          description?: string | null
          display_name?: string
          email?: string
          how_did_you_hear?: string | null
          id?: string
          is_contact_public?: boolean | null
          language?: string | null
          last_active_at?: string | null
          logo_url?: string | null
          newsletter_opt_in?: boolean | null
          password_hash?: string
          phone?: string
          plan_expires_at?: string | null
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          profile_description?: string | null
          public_email?: string | null
          rating_cached?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"] | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          telegram?: string | null
          terms_accepted?: boolean | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      commission_model: "revenue-share" | "cpa" | "hybrid"
      credit_type: "purchase" | "reveal" | "refund" | "bonus" | "admin"
      monthly_traffic: "up_1k" | "1k_5k" | "5k_25k" | "25k_100k" | "over_100k"
      monthly_volume:
        | "up_100k"
        | "100k_500k"
        | "500k_2m"
        | "2m_10m"
        | "over_10m"
      payment_schedule: "weekly" | "biweekly" | "monthly"
      plan_type: "free" | "pro" | "elite"
      user_role: "afiliado" | "operador" | "admin"
      user_status: "active" | "inactive" | "suspended" | "banned"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      commission_model: ["revenue-share", "cpa", "hybrid"],
      credit_type: ["purchase", "reveal", "refund", "bonus", "admin"],
      monthly_traffic: ["up_1k", "1k_5k", "5k_25k", "25k_100k", "over_100k"],
      monthly_volume: ["up_100k", "100k_500k", "500k_2m", "2m_10m", "over_10m"],
      payment_schedule: ["weekly", "biweekly", "monthly"],
      plan_type: ["free", "pro", "elite"],
      user_role: ["afiliado", "operador", "admin"],
      user_status: ["active", "inactive", "suspended", "banned"],
    },
  },
} as const
