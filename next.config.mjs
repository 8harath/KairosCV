/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Exclude native modules from bundling
  serverExternalPackages: [
    'pdf-to-png-converter',
    '@napi-rs/canvas',
    'tesseract.js',
    'sharp',
    'canvas'
  ],
}

export default nextConfig
