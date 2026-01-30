import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
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

  const t = useTranslations()
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Verified Tutors",
      description:
        "Every tutor on G-Teach undergoes a rigorous verification process. We check credentials, certificates, and teaching experience to ensure you learn from qualified professionals.",
    },
    {
      icon: Target,
      title: "Targeted Exam Preparation",
      description:
        "Prepare specifically for Goethe-Zertifikat, TELC, ECL, TestDaF, and DSH exams. Our tutors specialize in exam strategies and help you succeed.",
    },
    {
      icon: UserCheck,
      title: "Personalized Learning",
      description:
        "No generic courses. Get one-on-one attention tailored to your level, goals, and learning style. Your tutor adapts to your needs.",
    },
    {
      icon: Clock,
      title: "Save Time and Money",
      description:
        "Skip the endless search for reliable tutors. Our platform connects you with the right match quickly, so you can focus on learning, not searching.",
    },
    {
      icon: Award,
      title: "Higher Success Rates",
      description:
        "Students who prepare with G-Teach tutors consistently achieve better exam results. Structured guidance leads to measurable progress.",
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description:
        "Monitor your learning journey with clear milestones. See how far you've come and what's next on your path to fluency.",
    },
  ]

  const examTypes = [
    { name: "Goethe-Zertifikat", levels: "A1 - C2" },
    { name: "TELC", levels: "A1 - C2" },
    { name: "TestDaF", levels: "B2 - C1" },
    { name: "DSH", levels: "B2 - C2" },
    { name: "ECL", levels: "A2 - C1" },
    { name: "ÖSD", levels: "A1 - C2" },
  ]

  const testimonials = [
    {
      quote:
        "I passed my Goethe B2 exam on the first try thanks to my G-Teach tutor. The targeted preparation made all the difference.",
      author: "Sarah M.",
      role: "Student from France",
      rating: 5,
    },
    {
      quote:
        "Finding a qualified German tutor used to be so difficult. G-Teach made it easy, and now I'm preparing for my C1 exam with confidence.",
      author: "Ahmed K.",
      role: "Student from Egypt",
      rating: 5,
    },
    {
      quote:
        "The personalized approach helped me overcome my fear of speaking German. My tutor adapted every lesson to my needs.",
      author: "Maria L.",
      role: "Student from Brazil",
      rating: 5,
    },
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
                {t("Advantages for Students")}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t(
                  "Learn German with confidence. G-Teach connects you with verified tutors who specialize in exam preparation and personalized instruction.",
                )}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/tutors">Find a Tutor</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent">
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose G-Teach?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t(
                  "We built G-Teach to solve the problems students face when learning German.",
                )}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Types */}
        <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Exam Preparation
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t(
                  "Our tutors specialize in preparing students for all major German language certifications.",
                )}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {examTypes.map((exam) => (
                <div
                  key={exam.name}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">
                      {exam.name}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {exam.levels}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button asChild>
                <Link href="/tutors">Find Exam Tutors</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("What Students Say")}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                {t("Real success stories from students who achieved their goals with G-Teach.")}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.author}
                  className="border-border bg-card"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        )
                      )}
                    </div>
                    <blockquote className="mb-4 text-muted-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="font-medium text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                {t("Start Your German Learning Journey Today")}
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                {t("Join thousands of successful students who found their perfect tutor on G-Teach.")}
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">{t("Create Free Account")}</Link>
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
