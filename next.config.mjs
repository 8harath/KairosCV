/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for pdf-parse trying to access test files during build
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
    }
    
    // Ignore test files from pdf-parse
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
}

export default nextConfig
