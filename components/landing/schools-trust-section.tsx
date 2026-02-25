"use client"

import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Lock, Users, Shield } from "lucide-react"

export function SchoolsTrustSection() {
  const t = useTranslations("findSchools")

  const trustFactors = [
    { icon: CheckCircle, key: "verificationProcess" },
    { icon: Lock, key: "secureCommunication" },
    { icon: Users, key: "communityDriven" },
    { icon: Shield, key: "studentProtection" },
  ]

  return (
    <section className="border-b border-border/40 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <Badge className="mb-4 bg-blue-50 text-blue-700 border-blue-200" variant="outline">
            {t("trustBadge")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("trustTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("trustSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trustFactors.map(({ icon: Icon, key }, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
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
