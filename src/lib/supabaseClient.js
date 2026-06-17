import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  || 'https://dgyjwztiwkricpbkxaxd.supabase.co'
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneWp3enRpd2tyaWNwYmt4YXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTM2NDYsImV4cCI6MjA5NTAyOTY0Nn0.HIpTmx_W63gG74gtxp5TQ41wSccoIuuo561M2C_EjWA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)
