import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Supabase admin client is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.')
}

export const supabaseAdmin =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null

export async function getUserFromBearer(authHeader?: string) {
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token || !supabaseAdmin) return null

  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return null
  return data.user
}
