const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

let scriptPromise: Promise<void> | null = null

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: unknown) => void) => void
    }
  }
}

export function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout requires a browser context"))
  }
  if (window.Razorpay) {
    return Promise.resolve()
  }
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Razorpay checkout script")),
        { once: true },
      )
      return
    }

    const script = document.createElement("script")
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error("Failed to load Razorpay checkout script"))
    }
    document.body.appendChild(script)
  })

  return scriptPromise
}
