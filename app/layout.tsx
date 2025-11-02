import type React from "react"
import type { Metadata } from "next"
import { Space_Mono, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
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
  title: "KairosCV - AI-Powered ATS Resume Optimizer | Kairos Resume | Resume Kairos",
  description:
    "KairosCV (Kairos Resume) transforms your resume into an ATS-optimized PDF using AI-powered enhancements. Beat applicant tracking systems and land more interviews with Kairos Resume Optimizer. The best Resume Kairos tool for job seekers.",
  keywords: [
    "Kairos",
    "KairosCV",
    "Resume Kairos",
    "Kairos Resume",
    "KairosCV Resume",
    "Kairos Resume Optimizer",
    "KairosCV Resume Optimizer",
    "Resume Kairos Optimizer",
    "Kairos ATS Resume",
    "KairosCV ATS Optimizer",
    "resume optimizer",
    "ATS resume",
    "resume builder",
    "AI resume",
    "resume optimization",
    "job application",
    "career tools",
    "ATS optimization",
    "resume enhancement",
    "resume PDF",
    "resume generator",
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
    title: "KairosCV - AI-Powered ATS Resume Optimizer | Kairos Resume | Resume Kairos",
    description: "Transform your resume into an ATS-optimized PDF using AI enhancements. Kairos Resume Optimizer helps you beat applicant tracking systems. The best Resume Kairos tool for landing more interviews.",
    images: [
      {
        url: "https://kairoscv.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "KairosCV - Resume Kairos Optimizer | ATS Resume Optimization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KairosCV - AI Resume Optimizer | Kairos Resume | Resume Kairos",
    description: "Transform your resume into an ATS-optimized PDF with Kairos Resume Optimizer. Beat ATS systems with Resume Kairos.",
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
    alternateName: ["Kairos Resume", "Resume Kairos", "Kairos Resume Optimizer", "KairosCV Resume Optimizer"],
    description: "AI-powered ATS resume optimizer. Kairos Resume and Resume Kairos tool for transforming resumes into ATS-optimized PDFs. Best KairosCV Resume Optimizer for job seekers.",
    url: "https://kairoscv.app",
    applicationCategory: "BusinessApplication",
    keywords: "Kairos, KairosCV, Resume Kairos, Kairos Resume, ATS resume optimizer, resume optimization, AI resume, resume builder",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "KairosCV",
      alternateName: ["Kairos", "Resume Kairos"],
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
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
