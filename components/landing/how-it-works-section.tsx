"use client"

import { UserPlus, Search, MessageSquare, Video } from "lucide-react"
import { useTranslations } from "next-intl"

const stepsData = [
  { icon: UserPlus, step: "01", key: "step1" },
  { icon: Search, step: "02", key: "step2" },
  { icon: MessageSquare, step: "03", key: "step3" },
  { icon: Video, step: "04", key: "step4" },
]

export function HowItWorksSection() {
  const t = useTranslations("howItWorks1")

  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stepsData.map((item, index) => (
            <div key={item.step} className="relative">
              {index < stepsData.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <item.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {t(`steps.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`steps.${item.key}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
