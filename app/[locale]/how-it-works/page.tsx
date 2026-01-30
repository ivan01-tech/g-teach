import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
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
  const studentSteps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Account",
      description:
        "Sign up for free and complete your profile. Tell us about your learning goals, current level, and exam targets.",
    },
    {
      icon: Search,
      step: "02",
      title: "Find Your Ideal Tutor",
      description:
        "Browse verified tutors filtered by specialization, price, availability, and student reviews. Find the perfect match for your needs.",
    },
    {
      icon: MessageSquare,
      step: "03",
      title: "Connect via Chat",
      description:
        "Message tutors directly to discuss your goals, ask questions, and schedule your first session. No commitment required.",
    },
    {
      icon: BookOpen,
      step: "04",
      title: "Start Learning",
      description:
        "Begin your personalized learning journey with structured lessons, exam preparation, and continuous progress tracking.",
    },
  ]

  const tutorSteps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Register as a Tutor",
      description:
        "Create your tutor account with detailed information about your qualifications, teaching experience, and specializations.",
    },
    {
      icon: FileCheck,
      step: "02",
      title: "Submit Your Documents",
      description:
        "Upload your certificates, diplomas, and CV. Our team verifies all credentials to maintain platform quality.",
    },
    {
      icon: CheckCircle,
      step: "03",
      title: "Get Verified",
      description:
        "Once approved, your profile becomes visible to students. Verification badges build trust and attract more students.",
    },
    {
      icon: Users,
      step: "04",
      title: "Grow Your Practice",
      description:
        "Connect with motivated students, manage your schedule, and build your teaching business on a professional platform.",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                How G-Teach Works
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                A simple, structured process to connect learners with qualified
                German tutors. Whether you want to learn or teach, getting
                started takes just minutes.
              </p>
            </div>
          </div>
        </section>

        {/* For Students */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                For Students
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Start Learning German
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Four simple steps to begin your German learning journey with
                expert guidance.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {studentSteps.map((step, index) => (
                <Card
                  key={step.step}
                  className="relative overflow-hidden border-border bg-card"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {index < studentSteps.length - 1 && (
                      <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-muted-foreground/30 lg:block" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* For Tutors */}
        <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                For Tutors
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Start Teaching on G-Teach
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                Join our platform and connect with motivated German learners
                from around the world.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {tutorSteps.map((step, index) => (
                <Card
                  key={step.step}
                  className="relative overflow-hidden border-border bg-card"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <step.icon className="h-6 w-6 text-accent" />
                      </div>
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {index < tutorSteps.length - 1 && (
                      <ArrowRight className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 text-muted-foreground/30 lg:block" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary px-8 py-12 text-center lg:px-16 lg:py-16">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
                Join thousands of students and tutors already using G-Teach to
                achieve their German language goals.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">Create Free Account</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
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
