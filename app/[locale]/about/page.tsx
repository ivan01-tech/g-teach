import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Target, Heart, Shield, Globe, Users, Award } from "lucide-react"
import { useTranslations } from "next-intl"

export default function AboutPage() {

  const t = useTranslations()

  const values = [
    {
      icon: Shield,
      title: t("Quality"),
      description:
        t("We verify every tutor to ensure students learn from qualified professionals. No compromises on credentials."),
    },
    {
      icon: Target,
      title: t("Results"),
      description:
        t("We measure success by outcomes. Our platform is designed to help students achieve their language goals."),
    },
    {
      icon: Heart,
      title: t("Accessibility"),
      description:
        t("Quality German education should be available to everyone, regardless of location or background."),
    },
    {
      icon: Globe,
      title: t("Connection"),
      description:
         t("We bridge the gap between learners and teachers, creating meaningful educational relationships."),
    },
  ]

  const stats = [
    { label: t("Students"), value: "10,000+" },
    { label: t("Verified Tutors"), value: "500+" },
    { label: t("Lessons Completed"), value: "50,000+" },
    { label: t("Countries"), value: "40+" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("About G-Teach")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t("German & Teach - A platform born from understanding that success in language learning requires more than motivation It requires qualified guidance.")}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  {t("Our Story")}
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {t("Why We Built G-Teach")}
                </h2>
                <div className="mt-6 space-y-4 text-muted-foreground">
                  <p>
                    {t("G-Teach was born from a simple observation: many German learners fail not because they lack motivation, but because they lack access to qualified guidance.")}
                  </p>
                  <p>
                    {t("Finding a reliable, experienced German tutor is challenging.")}
                    {t("Students waste time and money on unstructured learning,")}
                    {t("while qualified tutors struggle to find serious students.")}
                  </p>
                  <p>
                    {t("We created G-Teach to solve this problem. Our platform")}
                    {t("structures the learning of German, secures the connection")}
                    {t("between students and tutors, and accompanies each user")}
                    {t("toward concrete results.")}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
                <h3 className="text-2xl font-bold"> {t("Our Mission")}</h3>
                <p className="mt-4 text-lg text-primary-foreground/90">
                  {t("To structure German language learning, secure qualified tutoring connections, and guide every user toward measurable success.")}
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
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 text-muted-foreground">{stat.label}</p>
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
                {t("Our Values")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("The principles that guide everything we do at G-Teach.")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="border-border bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
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
                {t("Our Vision")}
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
                {t("G-Teach is not just a tutoring website. It's a bridge between competence, discipline, and the future.")}
              </p>
              <p className="mt-4 text-muted-foreground">
                {t("We envision a world where every German learner has access to")}
                {t("qualified instruction, where tutors can build sustainable")}
                {t("teaching practices, and where language barriers no longer")}
                {t("stand in the way of opportunity.")}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-12 text-center lg:px-16 lg:py-16">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {t("Join the G-Teach Community")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                {t("Whether you're learning German or teaching it, we're here to support your journey.")}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register"> {t("Get Started")}</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">{t("Contact Us")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
