import { UserPlus, Search, MessageSquare, Video } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Your Account",
    description:
      "Sign up for free and complete your profile. Tell us about your current level and learning goals.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find Your Tutor",
    description:
      "Browse our tutors, filter by specialization, read reviews, and find the perfect match for your needs.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Connect & Discuss",
    description:
      "Send a message to introduce yourself. Discuss your goals and schedule a trial lesson.",
  },
  {
    icon: Video,
    step: "04",
    title: "Start Learning",
    description:
      "Book your lessons and start your journey to German fluency with personalized instruction.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How G-Teach Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in four simple steps and begin your German learning journey today.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <item.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
