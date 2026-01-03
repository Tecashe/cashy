/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com', // Wildcard for all Instagram CDN subdomains
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  
  output: 'standalone',
  staticPageGenerationTimeout: 120,
  reactStrictMode: true,
  
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000',
  },
  
  // Add empty turbopack config to silence the warning
  turbopack: {},
  
  // Remove webpack config as it's not needed for Turbopack
  // If you need custom webpack config, migrate to Turbopack config
};

export default nextConfig;