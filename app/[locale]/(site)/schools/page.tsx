"use client"

import { useState, useMemo } from "react"
import { SchoolCard } from "@/components/schools/school-card"
import { SchoolFilters } from "@/components/schools/school-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X, GraduationCap } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import type { School, SchoolFilterState } from "@/lib/types"
import { useTranslations } from "next-intl"
import { MOCK_SCHOOLS } from "@/lib/mocks/schools"

const initialFilters: SchoolFilterState = {
    searchQuery: "",
    country: "",
    city: "",
    examType: "",
    level: "",
}

export default function SchoolsPage() {
    const t = useTranslations("schools")
    const [filters, setFilters] = useState<SchoolFilterState>(initialFilters)
    const [filtersOpen, setFiltersOpen] = useState(false)

    // Use mock data for now
    const schools = MOCK_SCHOOLS

    const filteredSchools = useMemo(() => {
        return schools.filter((school) => {
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase()
                if (
                    !school.name.toLowerCase().includes(query) &&
                    !school.description?.toLowerCase().includes(query)
                ) {
                    return false
                }
            }

            if (filters.country && school.location.country.toLowerCase() !== filters.country.toLowerCase()) return false
            if (filters.city && school.location.city.toLowerCase() !== filters.city.toLowerCase()) return false
            if (filters.examType && !school.exams.some(e => e.toLowerCase().includes(filters.examType.toLowerCase()))) return false
            if (filters.level && !school.levels.some(l => l.toLowerCase() === filters.level.toLowerCase())) return false

            return true
        })
    }, [schools, filters])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (filters.country) count++
        if (filters.city) count++
        if (filters.examType) count++
        if (filters.level) count++
        return count
    }, [filters])

    const clearFilters = () => {
        setFilters(initialFilters)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white border-b border-border/40 pb-12 pt-20">
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-blue-400/5 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-6">
                            <GraduationCap className="h-4 w-4" />
                            {t("badge")}
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                            {t("pageTitle")}
                        </h1>
                        <p className="mt-4 text-xl text-slate-600 leading-relaxed">
                            {t("pageSubtitle", { count: schools.length })}
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="text"
                                    placeholder={t("searchPlaceholder")}
                                    className="h-14 pl-12 rounded-2xl border-border/60 bg-white shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                />
                            </div>

                            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="relative h-14 rounded-2xl gap-2 lg:hidden bg-white border-border/60 shadow-sm px-6">
                                        <SlidersHorizontal className="h-5 w-5" />
                                        <span className="font-semibold">{t("filters")}</span>
                                        {activeFilterCount > 0 && (
                                            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shadow-lg shadow-primary/20">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md border-l-0">
                                    <SheetHeader className="border-b pb-6">
                                        <SheetTitle className="text-xl font-bold">{t("filters")}</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8">
                                        <SchoolFilters filters={filters} setFilters={setFilters} />
                                        {activeFilterCount > 0 && (
                                            <Button
                                                variant="outline"
                                                className="w-full mt-8 rounded-xl border-dashed"
                                                onClick={clearFilters}
                                            >
                                                {t("clearAll")}
                                            </Button>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Desktop */}
                    <aside className="hidden w-80 shrink-0 lg:block">
                        <div className="sticky top-28 rounded-3xl border border-border/40 bg-white p-8 shadow-sm">
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">{t("filters")}</h2>
                                {activeFilterCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-auto p-0 text-xs font-bold text-primary hover:bg-transparent hover:text-primary/80"
                                    >
                                        {t("clearAll")}
                                    </Button>
                                )}
                            </div>
                            <SchoolFilters filters={filters} setFilters={setFilters} />
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {filteredSchools.length} {filteredSchools.length === 1 ? t("resultFound") : t("resultsFound")}
                                </h2>
                                {activeFilterCount > 0 && (
                                    <p className="text-sm text-slate-500 mt-1">
                                        {t("showingFiltered")}
                                    </p>
                                )}
                            </div>

                            {activeFilterCount > 0 && (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold gap-2 lg:hidden self-start"
                                >
                                    <X className="h-4 w-4" />
                                    {t("clearFilters")}
                                </Button>
                            )}
                        </div>

                        {filteredSchools.length === 0 ? (
                            <div className="rounded-3xl border border-border/40 bg-white py-20 text-center shadow-sm">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 mb-6">
                                    <Search className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t("noSchoolsFound")}</h3>
                                <p className="mt-2 text-slate-500 max-w-xs mx-auto">{t("noSchoolsTryAdjust")}</p>
                                <Button
                                    variant="outline"
                                    className="mt-8 min-w-[160px] rounded-xl border-border/60"
                                    onClick={clearFilters}
                                >
                                    {t("clearAllFilters")}
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-2">
                                {filteredSchools.map((school) => (
                                    <SchoolCard key={school.id} school={school} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
