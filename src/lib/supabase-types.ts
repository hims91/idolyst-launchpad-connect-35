import { Database } from "@/integrations/supabase/types";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

// Extend the Database type to include our custom tables
export interface CustomDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      pitch_ideas: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          problem_statement: string;
          target_group: string;
          solution: string;
          stage: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity';
          tags: string[];
          media_urls: string[] | null;
          is_premium: boolean;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          problem_statement: string;
          target_group: string;
          solution: string;
          stage: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity';
          tags: string[];
          media_urls?: string[] | null;
          is_premium?: boolean;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          problem_statement?: string;
          target_group?: string;
          solution?: string;
          stage?: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity';
          tags?: string[];
          media_urls?: string[] | null;
          is_premium?: boolean;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pitch_ideas_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pitch_votes: {
        Row: {
          id: string;
          pitch_id: string;
          user_id: string;
          vote_type: 'upvote' | 'downvote';
          created_at: string;
        };
        Insert: {
          id?: string;
          pitch_id: string;
          user_id: string;
          vote_type: 'upvote' | 'downvote';
          created_at?: string;
        };
        Update: {
          id?: string;
          pitch_id?: string;
          user_id?: string;
          vote_type?: 'upvote' | 'downvote';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pitch_votes_pitch_id_fkey";
            columns: ["pitch_id"];
            isOneToOne: false;
            referencedRelation: "pitch_ideas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pitch_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pitch_feedback: {
        Row: {
          id: string;
          pitch_id: string;
          user_id: string;
          content: string;
          is_mentor_feedback: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pitch_id: string;
          user_id: string;
          content: string;
          is_mentor_feedback?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pitch_id?: string;
          user_id?: string;
          content?: string;
          is_mentor_feedback?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pitch_feedback_pitch_id_fkey";
            columns: ["pitch_id"];
            isOneToOne: false;
            referencedRelation: "pitch_ideas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pitch_feedback_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pitch_drafts: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          problem_statement: string | null;
          target_group: string | null;
          solution: string | null;
          stage: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity' | null;
          tags: string[] | null;
          media_urls: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          problem_statement?: string | null;
          target_group?: string | null;
          solution?: string | null;
          stage?: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity' | null;
          tags?: string[] | null;
          media_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          problem_statement?: string | null;
          target_group?: string | null;
          solution?: string | null;
          stage?: 'ideation' | 'mvp' | 'investment' | 'pmf' | 'go_to_market' | 'growth' | 'maturity' | null;
          tags?: string[] | null;
          media_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pitch_drafts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pitch_payments: {
        Row: {
          id: string;
          pitch_id: string;
          user_id: string;
          amount: number;
          currency: string;
          payment_method: string;
          payment_status: string;
          payment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pitch_id: string;
          user_id: string;
          amount: number;
          currency?: string;
          payment_method: string;
          payment_status?: string;
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pitch_id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          payment_method?: string;
          payment_status?: string;
          payment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pitch_payments_pitch_id_fkey";
            columns: ["pitch_id"];
            isOneToOne: false;
            referencedRelation: "pitch_ideas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pitch_payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      badge_progress: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          current_progress: number;
          target_progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          current_progress?: number;
          target_progress: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          current_progress?: number;
          target_progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "badge_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "badge_progress_badge_id_fkey";
            columns: ["badge_id"];
            isOneToOne: false;
            referencedRelation: "badges";
            referencedColumns: ["id"];
          }
        ];
      };
      rewards: {
        Row: {
          id: string;
          name: string;
          description: string;
          xp_cost: number;
          icon: string;
          type: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          xp_cost: number;
          icon: string;
          type: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          xp_cost?: number;
          icon?: string;
          type?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_rewards: {
        Row: {
          id: string;
          user_id: string;
          reward_id: string;
          claimed_at: string;
          expires_at?: string;
          is_used: boolean;
          used_at?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reward_id: string;
          claimed_at?: string;
          expires_at?: string;
          is_used?: boolean;
          used_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reward_id?: string;
          claimed_at?: string;
          expires_at?: string;
          is_used?: boolean;
          used_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_rewards_reward_id_fkey";
            columns: ["reward_id"];
            isOneToOne: false;
            referencedRelation: "rewards";
            referencedColumns: ["id"];
          }
        ];
      };
      login_streaks: {
        Row: {
          id: string;
          user_id: string;
          last_login_date: string;
          current_streak: number;
          max_streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          last_login_date?: string;
          current_streak?: number;
          max_streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          last_login_date?: string;
          current_streak?: number;
          max_streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "login_streaks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      leaderboard_history: {
        Row: {
          id: string;
          user_id: string;
          xp: number;
          weekly_rank: number;
          monthly_rank: number;
          weekly_change: number;
          monthly_change: number;
          snapshot_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          xp: number;
          weekly_rank: number;
          monthly_rank: number;
          weekly_change?: number;
          monthly_change?: number;
          snapshot_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          xp?: number;
          weekly_rank?: number;
          monthly_rank?: number;
          weekly_change?: number;
          monthly_change?: number;
          snapshot_date?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leaderboard_history_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      xp_transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          transaction_type: string;
          reference_type?: string;
          reference_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          description: string;
          transaction_type: string;
          reference_type?: string;
          reference_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          transaction_type?: string;
          reference_type?: string;
          reference_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "xp_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: Database['public']['Functions'] & {
      increment_pitch_view: (args: { id: string }) => void;
      update_login_streak: (args: { user_id_param: string }) => void;
    };
  };
};

// Type to extend the Supabase client with our database schema
export type TypedSupabaseClient = SupabaseClient<CustomDatabase>;

// Helper function to create a typed Supabase client
export const createTypedSupabaseClient = (url: string, key: string): TypedSupabaseClient => {
  return createClient<CustomDatabase>(url, key);
};

// Create a typed client from the existing supabase client
export const getTypedSupabaseClient = (client: SupabaseClient): TypedSupabaseClient => {
  return client as TypedSupabaseClient;
};
