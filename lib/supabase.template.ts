import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './typesSupabase';

const supabaseUrl: string = '${{ secrets.SUPABASE_URL }}';
const supabaseAnonKey: string = '${{ secrets.SUPABASE_ANON_KEY }}';

export const SUPABASE_CONFIG_ERROR = supabaseUrl === '' || supabaseAnonKey === '';

let supabase: SupabaseClient<Database> | null = null;

if (!SUPABASE_CONFIG_ERROR) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase credentials are missing!');
}

export { supabase };