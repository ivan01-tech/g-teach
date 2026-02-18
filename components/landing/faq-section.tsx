"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslations } from "next-intl"
import { HelpCircle, ShieldCheck, CreditCard, MessageCircle, AlertTriangle, UserCheck, Globe, Clock, BarChart, Info } from "lucide-react"

const iconMap: Record<string, any> = {
    howItWorks: Globe,
    credibility: ShieldCheck,
    verifiedStatus: UserCheck,
    responsibility: AlertTriangle,
    pricing: Clock,
    payments: CreditCard,
    reporting: MessageCircle,
    dataProtection: ShieldCheck,
    unverifiedAccess: Info,
    postChat: BarChart,
}

export function FAQSection() {
    const t = useTranslations("faq")

    const questions = [
        "howItWorks",
        "credibility",
        "verifiedStatus",
        "responsibility",
        "pricing",
        "payments",
        "reporting",
        "dataProtection",
        "unverifiedAccess",
        "postChat",
    ]

    return (
        <section id="faq" className="py-20 lg:py-32 bg-background relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
                        {t("title")}
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-6">
                    {questions.map((key) => {
                        const Icon = iconMap[key] || HelpCircle
                        return (
                            <AccordionItem
                                key={key}
                                value={key}
                                className="group border border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl px-2 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                            >
                                <AccordionTrigger className="text-left hover:no-underline py-6 px-4 font-bold text-xl group-data-[state=open]:text-primary transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground transition-all duration-300">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <span>{t(`questions.${key}.question`)}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-lg leading-relaxed px-4 pb-8 pl-20">
                                    <div className="max-w-none prose prose-slate prose-invert">
                                        {t(`questions.${key}.answer`)}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
        </section>
    )
}
