import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "next-intl"

const examsData = [
  {
    id: "goethe",
    name: "Goethe-Zertifikat",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  },
  {
    id: "telc",
    name: "TELC",
    levels: ["A1", "A2", "B1", "B2", "C1"],
  },
  {
    id: "testdaf",
    name: "TestDaF",
    levels: ["TDN 3", "TDN 4", "TDN 5"],
  },

  {
    id: "ecl",
    name: "ECL",
    levels: [ "A2", "B1", "B2", "C1"],
  },
  {
    id: "osd",
    name: "ÖSD",
    levels: ["A1", "A2", "B1", "B2", "C1"],
  },
]

export function ExamPrepSection() {
  const t = useTranslations("examPrep")

  return (
    <section className="bg-primary/5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {examsData.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-card-foreground">{exam.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`exams.${exam.id}.description`)}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {exam.levels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {level}
                  </span>
                ))}
              </div>

              <ul className="mt-6 space-y-3">
                {(t.raw(`exams.${exam.id}.features`) as string[]).map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-6 w-full bg-transparent" variant="outline" asChild>
                <Link href={`/tutors?specialization=exam-prep&exam=${exam.id}`}>
                  {t("findTutors", { exam: exam.name })}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
