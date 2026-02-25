"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { SchoolsHeroSection } from "@/components/landing/schools-hero-section"
import { SchoolsProblemSection } from "@/components/landing/schools-problem-section"
import { SchoolsSolutionSection } from "@/components/landing/schools-solution-section"
import { SchoolsAdvantagesSection } from "@/components/landing/schools-advantages-section"
import { SchoolsHowItWorksSection } from "@/components/landing/schools-how-it-works-section"
import { SchoolsTrustSection } from "@/components/landing/schools-trust-section"

export default function FindSchoolsPage() {
  const t = useTranslations("findSchools")

  return (
    <>
      <SchoolsHeroSection />
      <SchoolsProblemSection />
      <SchoolsSolutionSection />
      <SchoolsAdvantagesSection />
      <SchoolsHowItWorksSection />
      <SchoolsTrustSection />

      {/* Final CTA Section */}
      <section className="border-b border-border/40 bg-linear-to-b from-white to-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {t("finalCTATitle")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("finalCTASubtitle")}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="text-base gap-2">
                <Link href="/schools">
                  {t("exploreNowButton")} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/contact">{t("needHelpButton")}</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {t("finalCTANote")}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
