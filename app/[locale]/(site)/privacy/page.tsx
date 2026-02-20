import { LegalPage } from "@/components/legal/legal-page"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
    const t = await getTranslations("privacy")
    return {
        title: `${t("pageTitle")} | G-Teach`,
        description: t("intro"),
    }
}

export default async function PrivacyPage() {
    const t = await getTranslations("privacy")

    const sections = [
        {
            isIntro: true,
            text: t("intro"),
        },
        {
            title: t("section1Title"),
            text: t("section1Text"),
            items: t.raw("section1Items") as string[],
        },
        {
            title: t("section2Title"),
            text: t("section2Text"),
            items: t.raw("section2Items") as string[],
        },
        {
            title: t("section3Title"),
            text: t("section3Text"),
        },
        {
            title: t("section4Title"),
            text: t("section4Text"),
            items: t.raw("section4Items") as string[],
        },
        {
            title: t("section5Title"),
            text: t("section5Text"),
            items: t.raw("section5Items") as string[],
        },
        {
            title: t("section6Title"),
            text: t("section6Text"),
        },
        {
            title: t("section7Title"),
            contact: {
                label: t("section7Text"),
                email: t("contactEmail"),
                extraText: t("cookieNotice"),
                extraLink: {
                    href: "/cookies",
                    label: t("cookieLink"),
                },
            },
        },
    ]

    return (
        <LegalPage
            type="privacy"
            title={t("pageTitle")}
            lastUpdated={t("lastUpdated", { date: "20 Février 2026" })}
            sections={sections}
        />
    )
}
