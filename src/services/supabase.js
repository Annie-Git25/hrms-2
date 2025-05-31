// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ADD THESE NEW LOGS
console.log('supabase.js: Attempting to create Supabase client.');
console.log('supabase.js: VITE_SUPABASE_URL:', supabaseUrl);
console.log('supabase.js: VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '******** (key is present)' : 'ERROR: VITE_SUPABASE_ANON_KEY is NOT SET!'); // Mask the actual key for security

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('supabase.js: Supabase URL or Anon Key is missing! Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ADD THIS NEW LOG
console.log('supabase.js: Supabase client created and exported.');

export default supabase;