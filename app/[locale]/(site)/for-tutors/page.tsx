"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  Eye,
  Users,
  LayoutGrid,
  Award,
  Wallet,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function ForTutorsPage() {
  const t = useTranslations("forTutors")

  const benefits = [
    { icon: Eye,        key: "visibility" },
    { icon: Users,      key: "motivatedStudents" },
    { icon: LayoutGrid, key: "structuredPlatform" },
    { icon: Award,      key: "credentialValidation" },
    { icon: Wallet,     key: "incomeOpportunities" },
    { icon: Calendar,   key: "flexibleSchedule" },
  ]

  const steps = [
    { key: "createProfile" },
    { key: "submitDocuments" },
    { key: "getVerified" },
    { key: "startTeaching" },
  ]

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("pageSubtitle")}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/register">{t("becomeTutorButton")}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="/how-it-works">{t("howItWorksButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("whyTeachTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("whyTeachSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.key} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <benefit.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {t(`benefits.${benefit.key}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`benefits.${benefit.key}.desc`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("howToJoinTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("howToJoinSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.key} className="relative">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary/20">
                    {t(`steps.${index}.number`)}
                  </span>
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden h-5 w-5 text-muted-foreground/50 lg:block" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t(`steps.${index}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(`steps.${index}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("whatWeLookForTitle")}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {t("whatWeLookForSubtitle")}
              </p>
              <ul className="mt-8 space-y-4">
                {t.raw("requirements").map((req: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-muted/50 p-8 lg:p-12">
              <h3 className="text-xl font-semibold text-foreground">
                {t("readyToApplyTitle")}
              </h3>
              <p className="mt-4 text-muted-foreground">
                {t("readyToApplySubtitle")}
              </p>
              <div className="mt-6">
                <Button size="lg" asChild>
                  <Link href="/auth/register">{t("startApplicationButton")}</Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("reviewTime")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {t("shareExpertiseTitle")}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {t("shareExpertiseSubtitle")}
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">{t("becomeTutorCta")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}