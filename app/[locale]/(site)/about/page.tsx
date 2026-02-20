"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Target, Heart, Shield, Globe, Users, Award } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AboutPage() {
  const t = useTranslations("about")

  const values = [
    { icon: Shield, key: "valueQuality" },
    { icon: Target, key: "valueResults" },
    { icon: Heart,  key: "valueAccessibility" },
    { icon: Globe,  key: "valueConnection" },
  ]

  const stats = [
    { key: "students",          value: "10 000+" },
    { key: "verifiedTutors",    value: "500+" },
    { key: "lessonsCompleted",  value: "50 000+" },
    { key: "countries",         value: "40+" },
  ]

  return (
    <div>
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("pageTitle")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t("heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Story + Mission */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t("ourStory")}
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t("whyWeBuilt")}
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>{t("observation")}</p>
                  <p>
                    {t("findingTutorHard")}
                    <br />
                    {t("studentsWaste")}
                    <br />
                    {t("tutorsStruggle")}
                  </p>
                  <p>
                    {t("weCreated")}
                    <br />
                    {t("structuresLearning")}
                    <br />
                    {t("betweenStudentsTutors")}
                    <br />
                    {t("towardResults")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <h3 className="text-2xl font-bold">{t("ourMission")}</h3>
                <p className="mt-4 text-lg text-primary-foreground/90">
                  {t("missionText")}
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <Users className="h-8 w-8" />
                  <Award className="h-8 w-8" />
                  <Globe className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.key} className="text-center">
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 text-muted-foreground">
                    {t(`stats.${stat.key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("ourValues")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("valuesSubtitle")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.key} className="border-border bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {t(`${value.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`${value.key}.desc`)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("ourVision")}
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
                {t("visionIntro")}
              </p>
              <p className="mt-4 text-muted-foreground">
                {t("visionWorld")}
                <br />
                {t("visionQualified")}
                <br />
                {t("visionPractices")}
                <br />
                {t("visionOpportunity")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-12 text-center lg:px-16 lg:py-16">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {t("joinCommunity")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                {t("joinSubtitle")}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">{t("getStarted")}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">{t("contactUs")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}