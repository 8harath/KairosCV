import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/config/env"

let serviceRoleClient: SupabaseClient | null = null

export function getSupabaseServiceRoleClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.")
  }

  if (!serviceRoleClient) {
    serviceRoleClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serviceRoleClient
}
