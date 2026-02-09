// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';


const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add any other Next.js config options here if needed
};

export default nextConfig;