"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"

export function SchoolsHeroSection() {
  const t = useTranslations("findSchools")

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-white to-white py-16 lg:py-24">
      {/* Abstract background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 -mb-40 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold uppercase tracking-wider text-primary mb-6">
            <GraduationCap className="h-4 w-4" />
            {t("badge")}
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-slate-600">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="text-base">
              <Link href="/schools">{t("browseSchoolsButton")}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="/for-tutors">{t("createSchoolButton")}</Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-slate-500">
            {t("heroSubtext")}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-lg border border-border/40 bg-white/50 backdrop-blur px-6 py-4 text-center">
            <div className="text-2xl font-bold text-primary">100+</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("verifiedSchools")}</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-white/50 backdrop-blur px-6 py-4 text-center">
            <div className="text-2xl font-bold text-primary">5+</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("examTypes")}</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-white/50 backdrop-blur px-6 py-4 text-center">
            <div className="text-2xl font-bold text-primary">10,000+</div>
            <p className="mt-2 text-sm text-muted-foreground">{t("activeStudents")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
