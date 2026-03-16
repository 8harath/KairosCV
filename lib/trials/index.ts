import { shouldUseSupabaseTrials } from "@/lib/config/env"
import {
  consumeTrial as consumeLocalTrial,
  type TrialResult,
  isValidEmail,
  normalizeEmail,
} from "@/lib/trials/trial-limiter"
import { consumeSupabaseTrial } from "@/lib/trials/supabase-trial-limiter"

export { isValidEmail, normalizeEmail, type TrialResult }

export async function consumeTrial(email: string): Promise<TrialResult> {
  if (shouldUseSupabaseTrials()) {
    return consumeSupabaseTrial(email)
  }

  return consumeLocalTrial(email)
}
