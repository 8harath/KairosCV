import type React from "react"
import type { Metadata } from "next"
import { Space_Mono, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-display",
})

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "KairosCV - AI-Powered ATS Resume Optimizer | Transform Your Resume",
  description:
    "KairosCV transforms your resume into an ATS-optimized PDF using AI-powered enhancements. Beat applicant tracking systems and land more interviews.",
  keywords: [
    "resume optimizer",
    "ATS resume",
    "resume builder",
    "AI resume",
    "resume optimization",
    "job application",
    "career tools",
  ],
  authors: [{ name: "KairosCV" }],
  creator: "KairosCV",
  publisher: "KairosCV",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://kairoscv.app"),
  alternates: {
    canonical: "https://kairoscv.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kairoscv.app",
    siteName: "KairosCV",
    title: "KairosCV - AI-Powered ATS Resume Optimizer",
    description: "Transform your resume into an ATS-optimized PDF using AI enhancements",
    images: [
      {
        url: "https://kairoscv.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "KairosCV - Resume Optimizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KairosCV - AI Resume Optimizer",
    description: "Transform your resume into an ATS-optimized PDF",
    images: ["https://kairoscv.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "KairosCV",
    description: "AI-powered ATS resume optimizer",
    url: "https://kairoscv.app",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "KairosCV",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${spaceMono.variable} ${jetbrainsMono.variable} font-display antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
