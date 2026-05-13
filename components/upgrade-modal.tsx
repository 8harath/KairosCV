"use client"

import { useCallback, useState } from "react"
import { Loader2, Lock, Sparkles, X } from "lucide-react"
import { loadRazorpayCheckout } from "@/lib/payments/checkout-loader"
import type { PaywallConfig } from "@/hooks/use-plan-status"
import { toast } from "@/hooks/use-toast"

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  onUnlocked: () => void
  paywall: PaywallConfig
  email?: string | null
}

interface OrderResponse {
  orderId: string
  amount: number
  currency: string
  receipt: string
  planLabel: string
}

interface RazorpaySuccess {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

function formatPrice(paise: number, currency: string): string {
  const rupees = paise / 100
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(rupees)
  } catch {
    return `${currency} ${rupees.toFixed(0)}`
  }
}

export default function UpgradeModal({ open, onClose, onUnlocked, paywall, email }: UpgradeModalProps) {
  const [busy, setBusy] = useState(false)

  const handleUpgrade = useCallback(async () => {
    if (busy) return
    setBusy(true)

    try {
      if (!paywall.configured || !paywall.keyId) {
        throw new Error("Payments are not yet configured. Please contact support.")
      }

      await loadRazorpayCheckout()

      const orderRes = await fetch("/api/payments/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email ?? undefined }),
      })

      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => ({}))
        throw new Error(errBody.error || "Failed to create checkout order")
      }

      const order = (await orderRes.json()) as OrderResponse

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay checkout script did not load")
      }

      const checkout = new window.Razorpay({
        key: paywall.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "KairosCV",
        description: order.planLabel,
        prefill: email ? { email } : undefined,
        notes: { email: email ?? "guest" },
        theme: { color: "#0f172a" },
        handler: async (response: RazorpaySuccess) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                email: email ?? undefined,
              }),
            })

            if (!verifyRes.ok) {
              const errBody = await verifyRes.json().catch(() => ({}))
              throw new Error(errBody.error || "Payment verification failed")
            }

            toast({ title: "Pro unlocked", description: "Full results are ready." })
            onUnlocked()
            onClose()
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Verification failed"
            toast({ title: "Payment verification failed", description: msg, variant: "destructive" })
          } finally {
            setBusy(false)
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false)
          },
        },
      })

      checkout.on("payment.failed", (response: unknown) => {
        console.error("Razorpay payment failed", response)
        toast({ title: "Payment failed", description: "Please try again.", variant: "destructive" })
        setBusy(false)
      })

      checkout.open()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start checkout"
      toast({ title: "Upgrade error", description: msg, variant: "destructive" })
      setBusy(false)
    }
  }, [busy, email, onClose, onUnlocked, paywall])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close upgrade dialog"
          className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          disabled={busy}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Unlock {paywall.label}</h2>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;ve used your free generations. Unlock unlimited resume optimizations for a one-time payment.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            Unlimited optimized resumes
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            Full PDF download (no watermark)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
            Access to all templates &amp; tailoring
          </li>
        </ul>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">One-time</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatPrice(paywall.amountPaise, paywall.currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={busy || !paywall.configured}
            className="btn inline-flex items-center gap-2"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Opening checkout…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Unlock Pro
              </>
            )}
          </button>
        </div>

        {!paywall.configured && (
          <p className="mt-3 text-xs text-amber-600">
            Razorpay keys are not configured on the server yet. Once added, this button will open checkout.
          </p>
        )}
      </div>
    </div>
  )
}
