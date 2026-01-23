import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ReduxProvider from "@/components/providers/redux-provider"
import AuthProvider from "@/components/providers/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "G-Teach | Learn German with Expert Tutors",
  description:
    "Connect with certified German tutors and prepare for Goethe, TELC, TestDaF exams. Personalized lessons for all levels from A1 to C2.",
  keywords: ["German", "learn German", "German tutor", "Goethe exam", "TELC", "TestDaF", "German lessons"],
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#1a365d",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  )
}
