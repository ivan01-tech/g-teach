import { LegalPage } from "@/components/legal/legal-page"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
    const t = await getTranslations("terms")
    return {
        title: `${t("pageTitle")} | G-Teach`,
        description: t("intro"),
    }
}

export default async function TermsPage() {
    const t = await getTranslations("terms")

    const sections = [
        {
            isIntro: true,
            text: t("intro"),
        },
        {
            title: t("section1Title"),
            text: t("section1Text"),
        },
        {
            title: t("section2Title"),
            items: t.raw("section2Items") as string[],
        },
        {
            title: t("section3Title"),
            items: t.raw("section3Items") as string[],
        },
        {
            title: t("section4Title"),
            items: t.raw("section4Items") as string[],
        },
        {
            title: t("section5Title"),
            text: t("section5Text"),
        },
        {
            title: t("section6Title"),
            text: t("section6Text"),
            items: t.raw("section6Items") as string[],
        },
        {
            title: t("section7Title"),
            text: t("section7Text"),
        },
        {
            title: t("section8Title"),
            text: t("section8Text"),
        },
        {
            title: t("section9Title"),
            contact: {
                label: t("section9Text"),
                email: t("contactEmail"),
            },
        },
    ]

    return (
        <LegalPage
            type="terms"
            title={t("pageTitle")}
            lastUpdated={t("lastUpdated", { date: "20 Février 2026" })}
            sections={sections}
        />
    )
}
