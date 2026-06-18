import { createClient } from '@supabase/supabase-js'

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseUrl = 'https://tdioiwbozkwmscrkwpyz.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkaW9pd2Jvemt3bXNjcmt3cHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTg2MDQsImV4cCI6MjA5NzIzNDYwNH0.dtJYbDyzbGwPLYl2qgwTvtBX_rJAWaeGl3t8zPYosu4'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)
