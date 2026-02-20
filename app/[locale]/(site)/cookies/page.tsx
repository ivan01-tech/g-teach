import { LegalPage } from "@/components/legal/legal-page"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
    const t = await getTranslations("cookies")
    return {
        title: `${t("pageTitle")} | G-Teach`,
        description: t("intro"),
    }
}

export default async function CookiesPage() {
    const t = await getTranslations("cookies")

    const cookieTypes = t.raw("cookieTypes") as { name: string; desc: string }[]
    const cookieDurations = t.raw("cookieDurations") as { type: string; duration: string }[]

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
            cookieTypes,
        },
        {
            title: t("section3Title"),
            text: t("section3Text"),
            items: t.raw("section3Items") as string[],
            note: t("section3Note"),
        },
        {
            title: t("section4Title"),
            table: cookieDurations.map((d) => ({ col1: d.type, col2: d.duration })),
        },
        {
            title: t("section5Title"),
            text: t("section5Text"),
        },
        {
            title: t("section6Title"),
            contact: {
                label: t("section6Text"),
                email: t("contactEmail"),
                extraText: t("privacyNotice"),
                extraLink: {
                    href: "/privacy",
                    label: t("privacyLink"),
                },
            },
        },
    ]

    return (
        <LegalPage
            type="cookies"
            title={t("pageTitle")}
            lastUpdated={t("lastUpdated", { date: "20 Février 2026" })}
            sections={sections}
        />
    )
}
