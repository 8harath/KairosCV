/**
 * Puppeteer configuration for containerized environments.
 *
 * When running inside Docker, PUPPETEER_EXECUTABLE_PATH is set to the
 * system Chromium binary installed by apt-get. Puppeteer picks this up
 * automatically, so the app never tries to download its own Chromium.
 *
 * Outside Docker (local dev), this file is a no-op — Puppeteer falls
 * back to its bundled binary.
 */

/** @type {import('puppeteer').Configuration} */
const config = {
  // Skip Chromium download entirely — rely on system binary in Docker,
  // or the bundled binary in local dev (PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
  // env var takes precedence at install time anyway).
  skipDownload: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === "true",

  // Point to the system Chromium when running in a container
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
}

module.exports = config
