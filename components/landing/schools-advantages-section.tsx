"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShieldCheck,
  Zap,
  Globe,
  Award,
  Clock,
  TrendingUp
} from "lucide-react"

export function SchoolsAdvantagesSection() {
  const t = useTranslations("findSchools")

  const advantages = [
    { icon: ShieldCheck, key: "verifiedBadge" },
    { icon: Zap, key: "easyComparison" },
    { icon: Globe, key: "localInternational" },
    { icon: Award, key: "examPrep" },
    { icon: Clock, key: "timeSaving" },
    { icon: TrendingUp, key: "studentSuccess" },
  ]

  return (
    <section className="border-b border-border/40 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("advantagesTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("advantagesSubtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map(({ icon: Icon, key }, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t(`${key}.description`)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
