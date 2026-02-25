"use client"

import { useTranslations } from "next-intl"
import { AlertCircle, Search, TrendingDown, Lock } from "lucide-react"

export function SchoolsProblemSection() {
  const t = useTranslations("findSchools")

  const problems = [
    {
      icon: Search,
      key: "hardFind"
    },
    {
      icon: TrendingDown,
      key: "lackTransparency"
    },
    {
      icon: AlertCircle,
      key: "noComparison"
    },
    {
      icon: Lock,
      key: "trustConcern"
    }
  ]

  return (
    <section className="border-b border-border/40 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("problemTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("problemSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map(({ icon: Icon, key }, index) => (
            <div
              key={index}
              className="rounded-lg border border-border/40 bg-muted/30 p-6 hover:border-primary/20 transition-colors"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
                <Icon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
