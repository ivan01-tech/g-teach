"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { Shield, FileText, Cookie, CheckCircle, ExternalLink } from "lucide-react"

type LegalSection = {
    isIntro?: boolean
    title?: string
    text?: string
    items?: string[]
    note?: string
    cookieTypes?: { name: string; desc: string }[]
    table?: { col1: string; col2: string }[]
    contact?: {
        label: string
        email: string
        extraText?: string
        extraLink?: { href: string; label: string }
    }
}

type LegalPageProps = {
    type: "privacy" | "terms" | "cookies"
    title: string
    lastUpdated: string
    sections: LegalSection[]
}

const icons = {
    privacy: Shield,
    terms: FileText,
    cookies: Cookie,
}

const gradients = {
    privacy: "from-blue-600 to-indigo-700",
    terms: "from-emerald-600 to-teal-700",
    cookies: "from-amber-500 to-orange-600",
}

const accentColors = {
    privacy: {
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        dot: "bg-blue-500",
        email: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200",
        link: "text-blue-600 hover:text-blue-800 dark:text-blue-400",
        card: "border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700",
        cardIcon: "text-blue-500",
    },
    terms: {
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        dot: "bg-emerald-500",
        email: "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200",
        link: "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400",
        card: "border-emerald-100 dark:border-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-700",
        cardIcon: "text-emerald-500",
    },
    cookies: {
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        dot: "bg-amber-500",
        email: "text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200",
        link: "text-amber-600 hover:text-amber-800 dark:text-amber-400",
        card: "border-amber-100 dark:border-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700",
        cardIcon: "text-amber-500",
    },
}

export function LegalPage({ type, title, lastUpdated, sections }: LegalPageProps) {
    const locale = useLocale()
    const Icon = icons[type]
    const gradient = gradients[type]
    const colors = accentColors[type]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Hero */}
            <div className={`relative bg-gradient-to-br ${gradient} overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-white blur-2xl" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Icon className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
                            {title}
                        </h1>
                        <p className="text-white/70 text-sm mt-2">{lastUpdated}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="space-y-10">
                    {sections.map((section, i) => (
                        <div key={i}>
                            {/* Intro block */}
                            {section.isIntro && (
                                <div
                                    className={`p-6 rounded-2xl border ${colors.card} bg-white dark:bg-slate-900 shadow-sm transition-colors`}
                                >
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                        {section.text}
                                    </p>
                                </div>
                            )}

                            {/* Regular section */}
                            {!section.isIntro && section.title && (
                                <div className="space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                        {section.title}
                                    </h2>

                                    {section.text && (
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {section.text}
                                        </p>
                                    )}

                                    {/* Bullet list */}
                                    {section.items && section.items.length > 0 && (
                                        <ul className="space-y-2.5">
                                            {section.items.map((item, j) => (
                                                <li key={j} className="flex items-start gap-3">
                                                    <span
                                                        className={`mt-2 flex-shrink-0 w-2 h-2 rounded-full ${colors.dot}`}
                                                    />
                                                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                        {item}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Cookie type cards */}
                                    {section.cookieTypes && section.cookieTypes.length > 0 && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {section.cookieTypes.map((ct, j) => (
                                                <div
                                                    key={j}
                                                    className={`p-5 rounded-xl border ${colors.card} bg-white dark:bg-slate-900 shadow-sm transition-all duration-200 hover:shadow-md`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle className={`w-4 h-4 ${colors.cardIcon}`} />
                                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                                                            {ct.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                                        {ct.desc}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Table (cookie durations) */}
                                    {section.table && section.table.length > 0 && (
                                        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                            <table className="w-full text-sm">
                                                <tbody>
                                                    {section.table.map((row, j) => (
                                                        <tr
                                                            key={j}
                                                            className={`${j % 2 === 0
                                                                    ? "bg-white dark:bg-slate-900"
                                                                    : "bg-slate-50 dark:bg-slate-800/50"
                                                                } transition-colors`}
                                                        >
                                                            <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-200 w-1/2">
                                                                {row.col1}
                                                            </td>
                                                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                                                                {row.col2}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Note */}
                                    {section.note && (
                                        <div className={`mt-3 p-4 rounded-lg ${colors.badge} text-sm`}>
                                            {section.note}
                                        </div>
                                    )}

                                    {/* Contact block */}
                                    {section.contact && (
                                        <div className="space-y-3">
                                            <p className="text-slate-600 dark:text-slate-300">{section.contact.label}</p>
                                            <a
                                                href={`mailto:${section.contact.email}`}
                                                className={`inline-flex items-center gap-2 font-semibold ${colors.email} transition-colors`}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                {section.contact.email}
                                            </a>
                                            {section.contact.extraText && section.contact.extraLink && (
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                    {section.contact.extraText}{" "}
                                                    <Link
                                                        href={`/${locale}${section.contact.extraLink.href}`}
                                                        className={`font-medium underline underline-offset-2 ${colors.link} transition-colors`}
                                                    >
                                                        {section.contact.extraLink.label}
                                                    </Link>
                                                    {"."}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Divider (not last) */}
                            {i < sections.length - 1 && !section.isIntro && (
                                <div className="pt-6 border-b border-slate-100 dark:border-slate-800" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Legal nav footer */}
                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {type !== "privacy" && (
                            <Link
                                href={`/${locale}/privacy`}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <Shield className="w-4 h-4" />
                                {locale === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
                            </Link>
                        )}
                        {type !== "terms" && (
                            <Link
                                href={`/${locale}/terms`}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                {locale === "fr" ? "Conditions d'utilisation" : "Terms of Service"}
                            </Link>
                        )}
                        {type !== "cookies" && (
                            <Link
                                href={`/${locale}/cookies`}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <Cookie className="w-4 h-4" />
                                {locale === "fr" ? "Politique de cookies" : "Cookie Policy"}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
