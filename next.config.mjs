// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  // Optional: path to your i18n config file (most common locations)
  // './i18n.ts'          ← if you have src/i18n.ts or i18n.ts
  // './src/i18n.ts'      ← if using src/ folder
  // './i18n/routing.ts'  ← newer next-intl 3.x / 4.x style in some setups
  // Leave empty () if you don't have a separate config yet or use defaults
);

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add any other Next.js config options here if needed
};

export default withNextIntl(nextConfig);