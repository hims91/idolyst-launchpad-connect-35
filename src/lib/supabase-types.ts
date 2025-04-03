
import { Database } from "@/integrations/supabase/types";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

// Type to extend the Supabase client with our database schema
export type TypedSupabaseClient = SupabaseClient<Database>;

// Helper function to create a typed Supabase client
export const createTypedSupabaseClient = (url: string, key: string): TypedSupabaseClient => {
  return createClient<Database>(url, key);
};
