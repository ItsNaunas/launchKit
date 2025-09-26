// Database types for Supabase tables

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          plan_status: 'free' | 'paid_oneoff' | 'paid_subscription' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          plan_status?: 'free' | 'paid_oneoff' | 'paid_subscription' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          plan_status?: 'free' | 'paid_oneoff' | 'paid_subscription' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      kits: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          has_access: boolean;
          created_at: string;
          updated_at: string;
          // Intake form fields
          one_liner: string | null;
          category: string | null;
          target_audience: string | null;
          primary_goal: string | null;
          budget_band: string | null;
          time_horizon: string | null;
          challenges: string | null; // JSON array
          geography: string | null;
          brand_vibe: string | null;
          sales_channel_focus: string | null;
          business_model: string | null;
          fulfilment: string | null;
          pricing_idea: string | null;
          competitor_links: string | null; // JSON array
          inspiration_links: string | null; // JSON array
          content_strengths: string | null; // JSON array
          constraints: string | null;
          revenue_target_30d: number | null;
          selected_options: string | null;
          profiling_data: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          has_access?: boolean;
          created_at?: string;
          updated_at?: string;
          one_liner?: string | null;
          category?: string | null;
          target_audience?: string | null;
          primary_goal?: string | null;
          budget_band?: string | null;
          time_horizon?: string | null;
          challenges?: string | null;
          geography?: string | null;
          brand_vibe?: string | null;
          sales_channel_focus?: string | null;
          business_model?: string | null;
          fulfilment?: string | null;
          pricing_idea?: string | null;
          competitor_links?: string | null;
          inspiration_links?: string | null;
          content_strengths?: string | null;
          constraints?: string | null;
          revenue_target_30d?: number | null;
          selected_options?: string | null;
          profiling_data?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          has_access?: boolean;
          created_at?: string;
          updated_at?: string;
          one_liner?: string | null;
          category?: string | null;
          target_audience?: string | null;
          primary_goal?: string | null;
          budget_band?: string | null;
          time_horizon?: string | null;
          challenges?: string | null;
          geography?: string | null;
          brand_vibe?: string | null;
          sales_channel_focus?: string | null;
          business_model?: string | null;
          fulfilment?: string | null;
          pricing_idea?: string | null;
          competitor_links?: string | null;
          inspiration_links?: string | null;
          content_strengths?: string | null;
          constraints?: string | null;
          revenue_target_30d?: number | null;
          selected_options?: string | null;
          profiling_data?: string | null;
        };
      };
      outputs: {
        Row: {
          id: string;
          kit_id: string;
          type: 'business_case' | 'content_strategy';
          content: string; // JSON
          regen_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kit_id: string;
          type: 'business_case' | 'content_strategy';
          content: string;
          regen_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kit_id?: string;
          type?: 'business_case' | 'content_strategy';
          content?: string;
          regen_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          kit_id: string;
          stripe_session_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          price_id: string | null;
          subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          kit_id: string;
          stripe_session_id: string;
          amount: number;
          currency: string;
          status?: 'pending' | 'completed' | 'failed';
          price_id?: string | null;
          subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          kit_id?: string;
          stripe_session_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed';
          price_id?: string | null;
          subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
