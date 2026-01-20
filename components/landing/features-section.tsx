import { Search, MessageSquare, Calendar, Star, Shield, Globe } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Tutor Matching",
    description:
      "Find the perfect tutor based on your level, goals, schedule, and budget. Filter by specialization, availability, and ratings.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description:
      "Communicate directly with tutors through our built-in messaging system. Discuss your goals and schedule lessons easily.",
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description:
      "Book lessons with just a few clicks. View tutor availability in real-time and reschedule when needed.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description:
      "Read authentic reviews from other students. Make informed decisions based on real experiences.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description:
      "Pay safely through our platform. Money-back guarantee if you're not satisfied with your first lesson.",
  },
  {
    icon: Globe,
    title: "Learn Anywhere",
    description:
      "Take lessons from anywhere in the world. All you need is an internet connection and a device.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform provides all the tools you need to learn German effectively
            and prepare for your certification exams.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
