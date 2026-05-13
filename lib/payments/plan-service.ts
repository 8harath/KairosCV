import { isSupabaseConfigured } from "@/lib/config/env"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/server"
import { hashEmail } from "@/lib/payments/email-hash"

export interface PlanStatus {
  plan: "free" | "pro"
  isPro: boolean
  currentPeriodEnd: string | null
  unlockedAt: string | null
}

const FREE_STATUS: PlanStatus = {
  plan: "free",
  isPro: false,
  currentPeriodEnd: null,
  unlockedAt: null,
}

export async function getPlanStatusByEmail(email: string | null | undefined): Promise<PlanStatus> {
  if (!email) {
    return FREE_STATUS
  }
  if (!isSupabaseConfigured()) {
    return FREE_STATUS
  }

  const supabase = getSupabaseServiceRoleClient()
  const emailHash = hashEmail(email)

  const { data, error } = await supabase
    .from("user_plans")
    .select("plan, current_period_end, unlocked_at")
    .eq("email_hash", emailHash)
    .maybeSingle()

  if (error) {
    console.error("plan-service: failed to load plan", error)
    return FREE_STATUS
  }

  if (!data || data.plan !== "pro") {
    return FREE_STATUS
  }

  if (data.current_period_end) {
    const expiry = new Date(data.current_period_end).getTime()
    if (Number.isFinite(expiry) && expiry < Date.now()) {
      return FREE_STATUS
    }
  }

  return {
    plan: "pro",
    isPro: true,
    currentPeriodEnd: data.current_period_end ?? null,
    unlockedAt: data.unlocked_at ?? null,
  }
}

export async function markUserProByEmail(params: {
  email: string
  userId: string | null
  razorpayOrderId: string
  razorpayPaymentId: string
  amountPaise: number
  currency: string
  periodEnd: Date | null
}): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured — cannot persist pro plan.")
  }

  const supabase = getSupabaseServiceRoleClient()
  const emailHash = hashEmail(params.email)

  const { error } = await supabase.rpc("mark_user_pro", {
    p_email_hash: emailHash,
    p_email: params.email,
    p_user_id: params.userId,
    p_razorpay_order_id: params.razorpayOrderId,
    p_razorpay_payment_id: params.razorpayPaymentId,
    p_amount_paise: params.amountPaise,
    p_currency: params.currency,
    p_period_end: params.periodEnd ? params.periodEnd.toISOString() : null,
  })

  if (error) {
    throw new Error(`mark_user_pro RPC failed: ${error.message}`)
  }
}

export async function recordPaymentEvent(params: {
  email: string | null
  userId: string | null
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  razorpaySignature: string | null
  eventType: string
  status: string
  amountPaise: number | null
  currency: string | null
  rawPayload: unknown
}): Promise<void> {
  if (!isSupabaseConfigured()) {
    return
  }

  const supabase = getSupabaseServiceRoleClient()
  const emailHash = params.email ? hashEmail(params.email) : "anonymous"

  const { error } = await supabase.from("payment_events").insert({
    email_hash: emailHash,
    user_id: params.userId,
    email: params.email,
    razorpay_order_id: params.razorpayOrderId,
    razorpay_payment_id: params.razorpayPaymentId,
    razorpay_signature: params.razorpaySignature,
    event_type: params.eventType,
    status: params.status,
    amount_paise: params.amountPaise,
    currency: params.currency ?? "INR",
    raw_payload: params.rawPayload ?? null,
  })

  if (error) {
    console.error("plan-service: failed to record payment event", error)
  }
}
