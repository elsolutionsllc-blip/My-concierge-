import { createClient } from '@supabase/supabase-js'

let supabase: any = null

export const getSupabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    supabase = createClient(supabaseUrl, supabaseKey)
  }
  return supabase
}

// For backwards compatibility, export as a getter
export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    return getSupabase()[prop as string]
  }
})
