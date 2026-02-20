import { Search, MessageSquare, Calendar, Star, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

const featuresData = [
  { icon: Search, key: "matching" },
  { icon: MessageSquare, key: "chat" },
  { icon: Calendar, key: "booking" },
  { icon: Star, key: "reviews" },
  // { icon: Shield, key: "payments" },
  { icon: Globe, key: "anywhere" },
]

export function FeaturesSection() {
  const t = useTranslations("features1")

  return (
    <section id="features" className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature) => (
            <div
              key={feature.key}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                {t(`items.${feature.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${feature.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
