import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://qpassmxbswyseoesimou.supabase.co';
const supabaseKey = 'sb_publishable_R2O3zBrXbt-rAIB6I1c9Vg_ilfvCc9V';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase, supabaseUrl, supabaseKey };