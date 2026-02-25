"use client"

import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EXAM_TYPES, GERMAN_LEVELS } from "@/lib/types"
import type { SchoolFilterState } from "@/lib/types"
import { useTranslations } from "next-intl"

interface SchoolFiltersProps {
    filters: SchoolFilterState
    setFilters: (filters: SchoolFilterState) => void
}

export function SchoolFilters({ filters, setFilters }: SchoolFiltersProps) {
    const t = useTranslations("school-filters")

    const cities = [
        { value: "all", label: t("allCities") },
        { value: "yaoundé", label: "Yaoundé" },
        { value: "douala", label: "Douala" },
        { value: "bamenda", label: "Bamenda" },
        { value: "buea", label: "Buea" },
        { value: "kumbo", label: "Kumbo" },
    ]

    const updateFilter = (key: keyof SchoolFilterState, value: string) => {
        setFilters({ ...filters, [key]: value === "all" ? "" : value })
    }

    return (
        <div className="space-y-6">
            {/* City Filter */}
            <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("city")}
                </Label>
                <Select
                    value={filters.city || "all"}
                    onValueChange={(value) => updateFilter("city", value)}
                >
                    <SelectTrigger className="h-10 border-border/60 bg-background/50 focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                                {c.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Level Filter */}
            <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("level")}
                </Label>
                <Select
                    value={filters.level || "all"}
                    onValueChange={(value) => updateFilter("level", value)}
                >
                    <SelectTrigger className="h-10 border-border/60 bg-background/50 focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder={t("selectLevel")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("allLevels")}</SelectItem>
                        {GERMAN_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                                {level.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Exam Type Filter */}
            <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                    {t("examType")}
                </Label>
                <Select
                    value={filters.examType || "all"}
                    onValueChange={(value) => updateFilter("examType", value)}
                >
                    <SelectTrigger className="h-10 border-border/60 bg-background/50 focus:ring-1 focus:ring-primary/20">
                        <SelectValue placeholder={t("selectExam")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t("allExams")}</SelectItem>
                        {EXAM_TYPES.map((exam) => (
                            <SelectItem key={exam.value} value={exam.value}>
                                {exam.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
