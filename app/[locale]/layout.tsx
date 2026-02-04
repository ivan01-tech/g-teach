// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import ReduxProvider from '@/components/providers/redux-provider';
import AuthProvider from '@/components/providers/auth-provider';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'G-Teach | Learn German with Expert Tutors',
  description:
    'Connect with certified German tutors and prepare for Goethe, TELC, TestDaF exams. Personalized lessons for all levels from A1 to C2.',
  keywords: [
    'German',
    'learn German',
    'German tutor',
    'Goethe exam',
    'TELC',
    'TestDaF',
    'German lessons',
  ],
  generator: 'v0.app',
};

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;  // ← Key: Promise type
}) {
  // Await params here (required in Next.js 15+)
  const { locale } = await params;

  let messages;
  try {
    // Adjust if your JSON exports .default vs .translations
    messages = (await import(`@/messages/${locale}.json`)).default;
    // If structured as { translations: {...} }, use: .translations instead
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} font-sans antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ReduxProvider>

          {/* <Analytics /> */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}