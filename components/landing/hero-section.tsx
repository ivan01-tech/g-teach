"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Clock,
} from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Content */}
          <div className="flex flex-col items-start">
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
              {t("badge")}
            </Badge>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.rich("title", {
                primary: (chunks) => <span className="text-primary">{chunks}</span>
              })}
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/auth/register">
                  {t("start")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/tutors">{t("browse")}</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <Stat
                icon={<Users className="h-5 w-5 text-primary" />}
                value="500+"
                label={t("stats.tutors")}
              />
              <Stat
                icon={<Award className="h-5 w-5 text-primary" />}
                value="95%"
                label={t("stats.passRate")}
              />
              <Stat
                icon={<Clock className="h-5 w-5 text-primary" />}
                value="24/7"
                label={t("stats.availability")}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon={<Award className="h-6 w-6 text-primary" />}
                title={t("features.certified.title")}
                desc={t("features.certified.desc")}
              />

              <FeatureCard
                className="sm:mt-8"
                icon={<CheckCircle2 className="h-6 w-6 text-accent" />}
                title={t("features.exam.title")}
                desc={t("features.exam.desc")}
              />

              <FeatureCard
                icon={<Users className="h-6 w-6 text-primary" />}
                title={t("features.oneOnOne.title")}
                desc={t("features.oneOnOne.desc")}
              />

              <FeatureCard
                className="sm:mt-8"
                icon={<Clock className="h-6 w-6 text-accent" />}
                title={t("features.flexible.title")}
                desc={t("features.flexible.desc")}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}



// 



function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 shadow-sm ${className}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
