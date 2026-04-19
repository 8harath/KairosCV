/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone image — emits server.js + minimal node_modules
  output: "standalone",
  images: {
    unoptimized: true,
  },
  // Exclude native modules from bundling
  serverExternalPackages: [
    '@sparticuz/chromium-min',
    'puppeteer-core',
    'puppeteer',
    'pdf-to-png-converter',
    '@napi-rs/canvas',
    'tesseract.js',
    'sharp',
    'canvas',
    '@langchain/core',
    '@langchain/groq',
    '@langchain/google-genai',
    '@langchain/langgraph',
    'langchain',
    '@langchain/community',
  ],
  // Ensure HTML templates are included in Vercel serverless function bundles
  outputFileTracingIncludes: {
    '/api/stream/*': ['./lib/templates/**/*.html'],
  },
}

export default nextConfig
