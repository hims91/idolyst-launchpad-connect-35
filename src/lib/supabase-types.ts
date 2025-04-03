
import { PostgrestClient } from '@supabase/postgrest-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Get a typed Supabase client for better type checking in queries
export const getTypedSupabaseClient = (supabase: SupabaseClient) => {
  return supabase as SupabaseClient<Database>;
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
