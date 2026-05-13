import { type NextRequest, NextResponse } from "next/server"
import {
  getProCurrency,
  getProPricePaise,
  isAuthBypassed,
  isPaywallEnabled,
  isRazorpayConfigured,
} from "@/lib/config/env"
import { verifyCheckoutSignature } from "@/lib/payments/razorpay-client"
import {
  markUserProByEmail,
  recordPaymentEvent,
} from "@/lib/payments/plan-service"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { getSupabaseCookieAdapter } from "@/lib/supabase/cookies"
import { normalizeEmail } from "@/lib/trials/trial-limiter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface VerifyBody {
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  email?: string
}

export async function POST(request: NextRequest) {
  if (!isPaywallEnabled() || !isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 })
  }

  let body: VerifyBody
  try {
    body = (await request.json()) as VerifyBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const orderId = body.razorpay_order_id
  const paymentId = body.razorpay_payment_id
  const signature = body.razorpay_signature
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json(
      { error: "razorpay_order_id, razorpay_payment_id, razorpay_signature required" },
      { status: 400 },
    )
  }

  const valid = verifyCheckoutSignature({
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  })

  let userId: string | null = null
  let userEmail: string | null = null

  if (!isAuthBypassed()) {
    const supabase = createSupabaseServerClient(await getSupabaseCookieAdapter())
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    userId = user.id
    userEmail = user.email
  } else {
    userEmail = body.email ? normalizeEmail(body.email) : null
  }

  if (!valid) {
    await recordPaymentEvent({
      email: userEmail,
      userId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      eventType: "payment.verify_failed",
      status: "signature_mismatch",
      amountPaise: null,
      currency: null,
      rawPayload: body,
    })
    return NextResponse.json({ error: "Signature verification failed" }, { status: 400 })
  }

  if (!userEmail) {
    return NextResponse.json(
      { error: "No email associated with this checkout — cannot unlock plan." },
      { status: 400 },
    )
  }

  await markUserProByEmail({
    email: userEmail,
    userId,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    amountPaise: getProPricePaise(),
    currency: getProCurrency(),
    periodEnd: null, // lifetime unlock
  })

  await recordPaymentEvent({
    email: userEmail,
    userId,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: signature,
    eventType: "payment.verified",
    status: "captured",
    amountPaise: getProPricePaise(),
    currency: getProCurrency(),
    rawPayload: body,
  })

  return NextResponse.json({
    success: true,
    plan: "pro",
  })
}
