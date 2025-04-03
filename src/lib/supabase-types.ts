

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
    };
    Functions: Database['public']['Functions'] & {
      increment_pitch_view: (args: { id: string }) => void;
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
