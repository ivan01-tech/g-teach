import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import ReduxProvider from '@/components/providers/redux-provider';
import AuthProvider from '@/components/providers/auth-provider';

import '../globals.css';
import Bootstrap from '@/components/bootstrap';
import { ToastProvider as ToastProvider1  } from '@radix-ui/react-toast';
import { ToastProvider } from '@/components/ui/toast';

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

  // Load messages for the specific locale (merge legacy + modular files)
  const resolvedLocale = locale || 'en';

  let legacyMessages = {} as Record<string, any>;
  try {
    legacyMessages = (await import(`@/messages/${resolvedLocale}.json`)).default;
  } catch (error) {
    notFound();
  }

  const newMessages: Record<string, any> = {};
  const moduleFiles = ['dashboard', 'messages', 'booking', 'reviews', 'profile', 'howItWorks1', 'features1', 'examPrep', 'about'];
  for (const file of moduleFiles) {
    try {
      const moduleContent = await import(`@/messages/${resolvedLocale}/${file}.json`);
      const content = moduleContent.default || moduleContent;
      Object.assign(newMessages, content);
    } catch (e) {
      // missing file is fine
    }
  }

  const messages = { ...legacyMessages, ...newMessages };

  return (
    <html lang={resolvedLocale}>
      <body className={`${inter.className} font-sans antialiased`}>
        <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
        <ToastProvider1 />
        <ToastProvider />
          <ReduxProvider>
            <Bootstrap></Bootstrap>
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