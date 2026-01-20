"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Users, Award, Clock } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col items-start">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
              Trusted by 10,000+ German Learners
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Master German with{" "}
              <span className="text-primary">Expert Tutors</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Connect with certified German tutors and achieve your language goals.
              Whether you&apos;re preparing for Goethe, TELC, or TestDaF exams, our
              personalized approach ensures your success.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/auth/register">
                  Start Learning Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">500+</span>
                </div>
                <span className="mt-1 text-sm text-muted-foreground">Expert Tutors</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">95%</span>
                </div>
                <span className="mt-1 text-sm text-muted-foreground">Pass Rate</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">24/7</span>
                </div>
                <span className="mt-1 text-sm text-muted-foreground">Availability</span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Certified Tutors</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  All tutors are verified with teaching credentials and native-level proficiency.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:mt-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Exam Preparation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Specialized preparation for Goethe, TELC, TestDaF, and DSH exams.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">1-on-1 Sessions</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Personalized lessons tailored to your learning style and goals.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:mt-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">Flexible Schedule</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Book lessons at times that work for you, 7 days a week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
