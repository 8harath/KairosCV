import { type NextRequest, NextResponse } from "next/server"
import {
  getProCurrency,
  getProPlanLabel,
  getProPricePaise,
  getPublicRazorpayKeyId,
  isAuthBypassed,
  isPaywallEnabled,
  isRazorpayConfigured,
} from "@/lib/config/env"
import { getPlanStatusByEmail } from "@/lib/payments/plan-service"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { normalizeEmail } from "@/lib/trials/trial-limiter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const authBypassed = isAuthBypassed()
  let userEmail: string | null = null

  if (!authBypassed) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()
    userEmail = user?.email ?? null
  } else {
    const emailParam = request.nextUrl.searchParams.get("email")
    if (emailParam) {
      userEmail = normalizeEmail(emailParam)
    }
  }

  const planStatus = await getPlanStatusByEmail(userEmail)

  return NextResponse.json({
    plan: planStatus.plan,
    isPro: planStatus.isPro,
    currentPeriodEnd: planStatus.currentPeriodEnd,
    unlockedAt: planStatus.unlockedAt,
    paywall: {
      enabled: isPaywallEnabled(),
      configured: isRazorpayConfigured(),
      keyId: isPaywallEnabled() && isRazorpayConfigured() ? getPublicRazorpayKeyId() : null,
      amountPaise: getProPricePaise(),
      currency: getProCurrency(),
      label: getProPlanLabel(),
    },
  })
}
