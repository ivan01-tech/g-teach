"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

export function Header() {
  const t = useTranslations("header")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">G-Teach</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("howItWorks")}
          </Link>
          <Link href="/tutors" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("findTutors")}
          </Link>
          <Link href="/for-students" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("forStudents")}
          </Link>
          <Link href="/for-tutors" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("forTutors")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("about")}
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">{t("login")}</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/register">{t("getStarted")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/how-it-works"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("howItWorks")}
            </Link>
            <Link
              href="/tutors"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("findTutors")}
            </Link>
            <Link
              href="/for-students"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("forStudents")}
            </Link>
            <Link
              href="/for-tutors"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("forTutors")}
            </Link>
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("about")}
            </Link>
            <Link
              href="/contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("contact")}
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/auth/login">{t("login")}</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/register">{t("getStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
