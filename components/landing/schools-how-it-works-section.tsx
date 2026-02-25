"use client"

import { useTranslations } from "next-intl"
import { MapPin, Sliders, FileText, MessageCircle, Zap } from "lucide-react"

export function SchoolsHowItWorksSection() {
  const t = useTranslations("findSchools")

  const steps = [
    { icon: MapPin, key: "step1" },
    { icon: Sliders, key: "step2" },
    { icon: FileText, key: "step3" },
    { icon: MessageCircle, key: "step4" },
    { icon: Zap, key: "step5" },
  ]

  return (
    <section className="border-b border-border/40 bg-muted/30 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {steps.map(({ icon: Icon, key }, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Step number circle */}
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-[calc(50%+20px)] h-0.5 w-[calc(100%+40px)] bg-linear-to-r from-primary to-transparent md:block hidden" />
                  )}
                </div>

                {/* Step content */}
                <div className="mt-6 text-center">
                  <h3 className="font-semibold text-foreground">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
