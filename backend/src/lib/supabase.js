import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are REQUIRED. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClient = (token) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: { 
        Authorization: token ? `Bearer ${token}` : `Bearer ${supabaseAnonKey}`,
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
};
