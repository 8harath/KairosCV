import Razorpay from "razorpay"
import { createHmac, timingSafeEqual } from "crypto"
import {
  getRazorpayKeyId,
  getRazorpayKeySecret,
  getRazorpayWebhookSecret,
  isRazorpayConfigured,
} from "@/lib/config/env"

let cachedClient: Razorpay | null = null

export function getRazorpayClient(): Razorpay {
  if (!isRazorpayConfigured()) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.",
    )
  }

  if (!cachedClient) {
    cachedClient = new Razorpay({
      key_id: getRazorpayKeyId(),
      key_secret: getRazorpayKeySecret(),
    })
  }

  return cachedClient
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8")
  const bufB = Buffer.from(b, "utf8")
  if (bufA.length !== bufB.length) {
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export function verifyCheckoutSignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const secret = getRazorpayKeySecret()
  if (!secret) {
    return false
  }

  const expected = createHmac("sha256", secret)
    .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
    .digest("hex")

  return safeEqual(expected, params.razorpay_signature)
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = getRazorpayWebhookSecret()
  if (!secret || !signature) {
    return false
  }

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex")
  return safeEqual(expected, signature)
}
