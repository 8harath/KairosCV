import type React from "react"
import type { Metadata } from "next"
// Fonts will be loaded via CDN in production to avoid build issues
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "KairosCV - AI-Powered Resume Enhancement",
  description:
    "Transform your resume with AI. Upload your PDF, get a professionally formatted, job-tailored resume in seconds.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico" },
    ],
    apple: "/favicons/apple-touch-icon.png",
    other: [
      { rel: "android-chrome", url: "/favicons/android-chrome-192x192.png" },
      { rel: "android-chrome", url: "/favicons/android-chrome-512x512.png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load fonts via CDN for production */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased bg-white dark:bg-black"
        style={{fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'}}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
