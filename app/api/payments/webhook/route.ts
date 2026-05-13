import { type NextRequest, NextResponse } from "next/server"
import { getProCurrency, isPaywallEnabled, isRazorpayConfigured } from "@/lib/config/env"
import { verifyWebhookSignature } from "@/lib/payments/razorpay-client"
import { markUserProByEmail, recordPaymentEvent } from "@/lib/payments/plan-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface RazorpayPaymentEntity {
  id?: string
  order_id?: string
  status?: string
  amount?: number
  currency?: string
  email?: string
  notes?: Record<string, string | undefined> | null
}

interface RazorpayWebhookPayload {
  event?: string
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity }
    order?: { entity?: { id?: string; status?: string; notes?: Record<string, string> | null } }
  }
}

function extractEmail(payment: RazorpayPaymentEntity | undefined): string | null {
  if (!payment) return null
  if (payment.email && payment.email.length > 0) return payment.email
  const noteEmail = payment.notes?.email
  if (noteEmail && noteEmail !== "guest") return noteEmail
  return null
}

export async function POST(request: NextRequest) {
  if (!isPaywallEnabled() || !isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 })
  }

  const signature = request.headers.get("x-razorpay-signature") ?? ""
  const rawBody = await request.text()

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  let payload: RazorpayWebhookPayload
  try {
    payload = JSON.parse(rawBody) as RazorpayWebhookPayload
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const event = payload.event ?? "unknown"
  const payment = payload.payload?.payment?.entity

  await recordPaymentEvent({
    email: extractEmail(payment),
    userId: null,
    razorpayOrderId: payment?.order_id ?? payload.payload?.order?.entity?.id ?? null,
    razorpayPaymentId: payment?.id ?? null,
    razorpaySignature: signature,
    eventType: event,
    status: payment?.status ?? "received",
    amountPaise: payment?.amount ?? null,
    currency: payment?.currency ?? null,
    rawPayload: payload,
  })

  // Authoritative unlock path: webhook fires regardless of whether the client
  // managed to hit /verify. Idempotent — mark_user_pro RPC is an upsert.
  if (event === "payment.captured" && payment) {
    const email = extractEmail(payment)
    if (email && payment.order_id && payment.id) {
      try {
        await markUserProByEmail({
          email,
          userId: null,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          amountPaise: payment.amount ?? 0,
          currency: payment.currency ?? getProCurrency(),
          periodEnd: null,
        })
      } catch (error) {
        console.error("webhook: mark_user_pro failed", error)
        // Return 500 so Razorpay retries; signature was valid so this is a
        // recoverable downstream failure.
        return NextResponse.json({ error: "Failed to persist plan" }, { status: 500 })
      }
    }
  }

  return NextResponse.json({ received: true })
}
