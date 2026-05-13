import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import {
  getProCurrency,
  getProPlanLabel,
  getProPricePaise,
  isAuthBypassed,
  isPaywallEnabled,
  isRazorpayConfigured,
} from "@/lib/config/env"
import { getRazorpayClient } from "@/lib/payments/razorpay-client"
import { recordPaymentEvent } from "@/lib/payments/plan-service"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { normalizeEmail } from "@/lib/trials/trial-limiter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  if (!isPaywallEnabled()) {
    return NextResponse.json({ error: "Paywall disabled" }, { status: 503 })
  }
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Payments not configured. Razorpay keys missing on server." },
      { status: 503 },
    )
  }

  const authBypassed = isAuthBypassed()
  let userId: string | null = null
  let userEmail: string | null = null

  if (!authBypassed) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    userId = user.id
    userEmail = user.email
  } else {
    // In auth-bypass mode (local dev), allow the client to pass an email so the
    // checkout flow can still be exercised. Fall back to a guest tag.
    const body = await request.clone().json().catch(() => null) as { email?: string } | null
    userEmail = body?.email ? normalizeEmail(body.email) : null
  }

  const amountPaise = getProPricePaise()
  const currency = getProCurrency()
  const receipt = `kc_${randomUUID().slice(0, 28)}`

  try {
    const razorpay = getRazorpayClient()
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt,
      notes: {
        email: userEmail ?? "guest",
        plan_label: getProPlanLabel(),
      },
    })

    await recordPaymentEvent({
      email: userEmail,
      userId,
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      eventType: "order.created",
      status: order.status ?? "created",
      amountPaise,
      currency,
      rawPayload: order,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      currency,
      receipt,
      planLabel: getProPlanLabel(),
    })
  } catch (error) {
    console.error("Razorpay order create failed", error)
    const message = error instanceof Error ? error.message : "Failed to create order"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
