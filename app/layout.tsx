// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import ReduxProvider from '@/components/providers/redux-provider';
import AuthProvider from '@/components/providers/auth-provider';

import './globals.css';
import Bootstrap from '@/components/Bootsrap';

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


  return (
    <html lang={locale}>
      <body className={`${inter.className} font-sans antialiased`}>
        <ReduxProvider>
          <Bootstrap />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReduxProvider>

        {/* <Analytics /> */}
      </body>
    </html>
  );
}