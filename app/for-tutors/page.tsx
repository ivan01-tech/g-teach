import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
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

export default function ForTutorsPage() {
  const benefits = [
    {
      icon: Eye,
      title: "Professional Visibility",
      description:
        "Showcase your qualifications, experience, and teaching style on a dedicated profile. Reach students actively searching for German tutors.",
    },
    {
      icon: Users,
      title: "Motivated Students",
      description:
        "Connect with serious learners who have specific goals - exam preparation, professional development, or personal growth. No time wasted on uncommitted students.",
    },
    {
      icon: LayoutGrid,
      title: "Structured Platform",
      description:
        "Focus on teaching while we handle the rest. Built-in messaging, scheduling, and profile management let you concentrate on what you do best.",
    },
    {
      icon: Award,
      title: "Credential Validation",
      description:
        "Your verified status builds trust. Students know they're choosing a qualified professional, which means more bookings for you.",
    },
    {
      icon: Wallet,
      title: "Income Opportunities",
      description:
        "Set your own rates and availability. Build a sustainable teaching practice with a steady stream of students seeking quality instruction.",
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description:
        "Teach when it works for you. Manage your availability and accept students that fit your schedule and teaching preferences.",
    },
  ]

  const requirements = [
    "Teaching certificate or relevant degree",
    "Proven experience teaching German",
    "Clear profile photo and professional bio",
    "Responsive communication with students",
    "Commitment to student success",
  ]

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description:
        "Sign up and build your tutor profile with your qualifications, teaching experience, and specializations.",
    },
    {
      number: "02",
      title: "Submit Documents",
      description:
        "Upload your certificates, diplomas, and CV. We verify all credentials to maintain platform quality.",
    },
    {
      number: "03",
      title: "Get Verified",
      description:
        "Our team reviews your application. Once approved, your profile becomes visible to students.",
    },
    {
      number: "04",
      title: "Start Teaching",
      description:
        "Connect with students, schedule sessions, and grow your teaching practice on a professional platform.",
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
                Advantages for Tutors
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Join G-Teach and connect with motivated German learners. Build
                your teaching practice on a professional platform designed for
                success.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/register">Become a Tutor</Link>
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
                Why Teach on G-Teach?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                We provide the platform and students. You provide the expertise.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                      <benefit.icon className="h-6 w-6 text-accent" />
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

        {/* How to Join */}
        <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                How to Join
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Get started in four simple steps.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="mb-4 flex items-center gap-4">
                    <span className="text-4xl font-bold text-primary/20">
                      {step.number}
                    </span>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden h-5 w-5 text-muted-foreground/50 lg:block" />
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  What We Look For
                </h2>
                <p className="mt-4 text-muted-foreground">
                  G-Teach maintains high standards to ensure quality for our
                  students. We welcome tutors who meet these criteria:
                </p>
                <ul className="mt-8 space-y-4">
                  {requirements.map((req) => (
                    <li key={req} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-muted/50 p-8 lg:p-12">
                <h3 className="text-xl font-semibold text-foreground">
                  Ready to Apply?
                </h3>
                <p className="mt-4 text-muted-foreground">
                  Join our community of professional German tutors and start
                  connecting with motivated students today.
                </p>
                <div className="mt-6">
                  <Button size="lg" asChild>
                    <Link href="/auth/register">Start Application</Link>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Application review typically takes 2-3 business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Share Your Expertise
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                G-Teach is more than a tutoring platform. It's a bridge between
                competence, discipline, and the future.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">Become a Tutor</Link>
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
