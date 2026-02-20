"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  ShieldCheck,
  Target,
  UserCheck,
  Clock,
  Award,
  TrendingUp,
  CheckCircle2,
  Star,
} from "lucide-react"
import { useTranslations } from "next-intl"

export default function ForStudentsPage() {
  const t = useTranslations("forStudents")

  const benefits = [
    { icon: ShieldCheck, key: "verifiedTutors" },
    { icon: Target,      key: "targetedPrep" },
    { icon: UserCheck,   key: "personalized" },
    { icon: Clock,       key: "saveTimeMoney" },
    { icon: Award,       key: "higherSuccess" },
    { icon: TrendingUp,  key: "trackProgress" },
  ]

  const testimonials = [
    { key: "sarah" },
    { key: "ahmed" },
    { key: "maria" },
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
                <Link href="/tutors">{t("findTutorButton")}</Link>
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
              {t("whyChooseTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("whyChooseSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.key} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <benefit.icon className="h-6 w-6 text-primary" />
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
              {t("examPrepTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("examPrepSubtitle")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.raw("exams").map((exam: any) => (
              <div
                key={exam.key}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">{exam.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{exam.levels}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/tutors">{t("findExamTutorsButton")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("testimonialsTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {t("testimonialsSubtitle")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.key} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mb-4 text-muted-foreground">
                    "{t(`testimonials.${testimonial.key}.quote`)}"
                  </blockquote>
                  <div>
                    <p className="font-medium text-foreground">
                      {t(`testimonials.${testimonial.key}.author`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`testimonials.${testimonial.key}.role`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-primary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              {t("ctaSubtitle")}
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth/register">{t("createAccountButton")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}