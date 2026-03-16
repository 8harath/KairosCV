import { createHash } from "crypto"
import { getTrialLimit, getTrialWindowHours } from "@/lib/config/env"
import { type TrialResult, normalizeEmail } from "@/lib/trials/trial-limiter"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server"

interface TrialRpcRow {
  allowed: boolean
  remaining: number
  reset_at: string | null
}

function getEmailHash(email: string): string {
  return createHash("sha256").update(email).digest("hex")
}

export async function consumeSupabaseTrial(email: string): Promise<TrialResult> {
  const normalizedEmail = normalizeEmail(email)
  const supabase = getSupabaseServiceRoleClient()

  const { data, error } = await supabase.rpc("consume_trial_attempt", {
    p_email_hash: getEmailHash(normalizedEmail),
    p_limit: getTrialLimit(),
    p_window_hours: getTrialWindowHours(),
  })

  if (error) {
    throw new Error(`Supabase trial RPC failed: ${error.message}`)
  }

  const row = Array.isArray(data) ? (data[0] as TrialRpcRow | undefined) : undefined
  if (!row) {
    throw new Error("Supabase trial RPC returned no rows.")
  }

  return {
    allowed: row.allowed,
    remaining: row.remaining,
    resetAt: row.reset_at ?? new Date().toISOString(),
  }
}
