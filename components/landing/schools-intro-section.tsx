"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Building2,
  MapPin,
  Filter,
  Users,
  ArrowRight,
  Zap,
} from "lucide-react"

export function SchoolsIntroSection() {
  const t = useTranslations("home")

  const features = [
    { icon: Building2, key: "verifiedSchools" },
    { icon: MapPin, key: "easySearch" },
    { icon: Filter, key: "smartFilter" },
    { icon: Users, key: "communityReviews" },
  ]

  return (
    <section className="border-b border-border/40 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-bold uppercase tracking-wider text-blue-600 mb-6 w-fit">
              <Building2 className="h-4 w-4" />
              {t("schoolsBadge")}
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("schoolsTitle")}
            </h2>

            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("schoolsDescription")}
            </p>

            {/* Features List */}
            <div className="mt-8 space-y-4">
              {features.map(({ icon: Icon, key }, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {t(`schoolsFeatures.${key}.title`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`schoolsFeatures.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col justify-start gap-3 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/find-schools">
                  {t("schoolsLearnButton")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/schools">{t("schoolsBrowseButton")}</Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Visual Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-green-50 p-4 mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t("schoolsCardLocalSearch")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("schoolsCardLocalSearchDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-purple-50 p-4 mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t("schoolsCardQuickComparison")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("schoolsCardQuickComparisonDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-orange-50 p-4 mb-4">
                  <Filter className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t("schoolsCardSmartFilter")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("schoolsCardSmartFilterDesc")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="rounded-lg bg-pink-50 p-4 mb-4">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-semibold text-foreground">
                  {t("schoolsCardTrustedReviews")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("schoolsCardTrustedReviewsDesc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
