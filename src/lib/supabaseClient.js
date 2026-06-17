import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://dgyjwztiwkricpbkxaxd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRneWp3enRpd2tyaWNwYmt4YXhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NTM2NDYsImV4cCI6MjA5NTAyOTY0Nn0.HIpTmx_W63gG74gtxp5TQ41wSccoIuuo561M2C_EjWA'
)
