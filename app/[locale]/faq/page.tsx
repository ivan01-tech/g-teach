import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { FAQSection } from "@/components/landing/faq-section"
import { CTASection } from "@/components/landing/cta-section"
import { useTranslations } from "next-intl"

export default function FAQPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">


                {/* Hero */}
                {/* <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                FAQ

                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Tout ce que vous devez savoir pour booster votre apprentissage de l'allemand avec G-Teach.

                            </p>
                        </div>
                    </div>
                </section> */}

                <FAQSection />

                <CTASection />
            </main>
            <Footer />
        </div>
    )
}
