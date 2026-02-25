"use client"

import { useTranslations } from "next-intl"
import { CheckCircle2, MapPin, Filter, Users, MessageSquare } from "lucide-react"

export function SchoolsSolutionSection() {
  const t = useTranslations("findSchools")

  const solutions = [
    {
      icon: CheckCircle2,
      key: "verifiedInstitutions"
    },
    {
      icon: MapPin,
      key: "locationBased"
    },
    {
      icon: Filter,
      key: "examFocused"
    },
    {
      icon: Users,
      key: "directContact"
    },
    {
      icon: MessageSquare,
      key: "transparentProfiles"
    }
  ]

  return (
    <section className="border-b border-border/40 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("solutionTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("solutionSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {solutions.map(({ icon: Icon, key }, index) => (
            <div key={index} className="rounded-lg border border-border/40 bg-white p-6 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Icon className="h-6 w-6 text-green-600" />
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
