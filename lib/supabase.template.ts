import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './typesSupabase';

// Эти значения заменятся при сборке
const supabaseUrl: string = '{{SUPABASE_URL}}';
const supabaseAnonKey: string = '{{SUPABASE_ANON_KEY}}';

let supabase: SupabaseClient<Database> | null = null;
supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export { supabase };