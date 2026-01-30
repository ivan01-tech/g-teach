import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")
  const th = useTranslations("header")

  const navigation = {
    learn: [
      { name: th("findTutors"), href: "/tutors" },
      { name: th("howItWorks"), href: "/how-it-works" },
      { name: th("forStudents"), href: "/for-students" },
      { name: th("forTutors"), href: "/for-tutors" },
    ],
    exams: [
      { name: "Goethe-Zertifikat", href: "/tutors?exam=goethe" },
      { name: "TELC", href: "/tutors?exam=telc" },
      { name: "TestDaF", href: "/tutors?exam=testdaf" },
      { name: "DSH", href: "/tutors?exam=dsh" },
    ],
    company: [
      { name: th("about"), href: "/about" },
      { name: th("contact"), href: "/contact" },
    ],
    legal: [
      { name: t("legal.privacy"), href: "/privacy" },
      { name: t("legal.terms"), href: "/terms" },
      { name: t("legal.cookies"), href: "/cookies" },
    ],
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">G-Teach</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {t("description")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("learn")}</h3>
            <ul className="mt-4 space-y-3">
              {navigation.learn.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("exams")}</h3>
            <ul className="mt-4 space-y-3">
              {navigation.exams.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("company")}</h3>
            <ul className="mt-4 space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              {t("allRightsReserved", { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
