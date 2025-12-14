import { createClient } from '@supabase/supabase-js'

let cachedSupabase: any = null

export const getSupabase = () => {
  if (!cachedSupabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured', { supabaseUrl, supabaseKey })
      // Return a mock client to prevent crashes
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signOut: () => Promise.resolve(),
          signInWithOAuth: () => Promise.reject(new Error('Supabase not configured'))
        },
        table: () => ({
          select: () => ({
            order: () => ({
              execute: () => Promise.resolve({ data: [] })
            })
          })
        })
      }
    }

    cachedSupabase = createClient(supabaseUrl, supabaseKey)
  }
  return cachedSupabase
}
