"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  UserPlus,
  Search,
  MessageSquare,
  BookOpen,
  FileCheck,
  CheckCircle,
  Users,
  ArrowRight,
} from "lucide-react"

export default function HowItWorksPage() {
  const t = useTranslations("howItWorksPage")

  const studentSteps = [
    { icon: UserPlus, key: "studentStep1" },
    { icon: Search, key: "studentStep2" },
    { icon: MessageSquare, key: "studentStep3" },
    { icon: BookOpen, key: "studentStep4" },
  ]

  const tutorSteps = [
    { icon: UserPlus, key: "tutorStep1" },
    { icon: FileCheck, key: "tutorStep2" },
    { icon: CheckCircle, key: "tutorStep3" },
    { icon: Users, key: "tutorStep4" },
  ]

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t("pageTitle")}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{t("pageSubtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">{t("forStudents")}</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("startLearningTitle")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("startLearningSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {studentSteps.map((step, index) => (
              <Card key={step.key} className="relative overflow-hidden border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-muted-foreground/20">{`0${index + 1}`}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{t(`${step.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`${step.key}.desc`)}</p>
                  {index < studentSteps.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-muted-foreground/30 lg:block" />}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/tutors">{t("findTutorButton")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">{t("forTutors")}</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("startTeachingTitle")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t("startTeachingSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {tutorSteps.map((step, index) => (
              <Card key={step.key} className="relative overflow-hidden border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>
                    <span className="text-4xl font-bold text-muted-foreground/20">{`0${index + 1}`}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{t(`${step.key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground">{t(`${step.key}.desc`)}</p>
                  {index < tutorSteps.length - 1 && <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-muted-foreground/30 lg:block" />}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">{t("becomeTutorButton")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-8 py-12 text-center lg:px-16 lg:py-16">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">{t("ctaSubtitle")}</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">{t("ctaCreateAccount")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <Link href="/contact">{t("ctaContactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
