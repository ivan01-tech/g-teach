import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const exams = [
  {
    name: "Goethe-Zertifikat",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    description: "The most recognized German language certificate worldwide.",
    features: ["Speaking practice", "Writing workshops", "Mock exams", "Grammar review"],
  },
  {
    name: "TELC",
    levels: ["A1", "A2", "B1", "B2", "C1"],
    description: "European Language Certificates recognized by employers and institutions.",
    features: ["Job-focused preparation", "Listening exercises", "Reading comprehension", "Certificate coaching"],
  },
  {
    name: "TestDaF",
    levels: ["TDN 3", "TDN 4", "TDN 5"],
    description: "Required for university admission in Germany.",
    features: ["Academic German", "University preparation", "Test strategies", "Time management"],
  },
]

export function ExamPrepSection() {
  return (
    <section className="bg-primary/5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Prepare for Official German Exams
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our tutors specialize in preparing students for all major German language certifications.
            Achieve your target score with expert guidance.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam.name}
              className="rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="text-xl font-bold text-card-foreground">{exam.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{exam.description}</p>

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
                {exam.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button className="mt-6 w-full bg-transparent" variant="outline" asChild>
                <Link href={`/tutors?specialization=exam-prep&exam=${exam.name.toLowerCase()}`}>
                  Find {exam.name} Tutors
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
