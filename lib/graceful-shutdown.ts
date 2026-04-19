/**
 * Graceful shutdown handler.
 *
 * Registers SIGTERM / SIGINT listeners so Puppeteer browser instances are
 * closed cleanly before the process exits. Without this, Docker stop sends
 * SIGTERM and the process exits immediately, leaving zombie Chrome processes
 * inside the container that consume memory until the next restart.
 */

type CleanupFn = () => Promise<void>

const cleanupFns: CleanupFn[] = []

/** Register a cleanup callback to run on SIGTERM / SIGINT. */
export function onShutdown(fn: CleanupFn): void {
  cleanupFns.push(fn)
}

async function runCleanup(signal: string): Promise<void> {
  console.log(`[shutdown] Received ${signal} — running ${cleanupFns.length} cleanup task(s)...`)
  await Promise.allSettled(cleanupFns.map(fn => fn()))
  console.log("[shutdown] Cleanup complete. Exiting.")
  process.exit(0)
}

let registered = false

/** Call once at app startup to arm the shutdown handlers. */
export function registerShutdownHandlers(): void {
  if (registered) return
  registered = true

  process.on("SIGTERM", () => runCleanup("SIGTERM"))
  process.on("SIGINT",  () => runCleanup("SIGINT"))
}
