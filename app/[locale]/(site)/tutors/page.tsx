"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { TutorCard } from "@/components/tutors/tutor-card"
import { TutorFilters } from "@/components/tutors/tutor-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Tutor } from "@/lib/types"
import { useTranslations } from "next-intl"
import { useTutors } from "../../tutors/use-tutors"

export interface FilterState {
  searchQuery: string
  levels: string[]
  specializations: string[]
  priceRange: [number, number]
  availability: string[]
  onlineOnly: boolean
  verifiedOnly: boolean
}

const initialFilters: FilterState = {
  searchQuery: "",
  levels: [],
  specializations: [],
  priceRange: [0, 0],
  availability: [],
  onlineOnly: false,
  verifiedOnly: false,
}

export default function TutorsPage() {
  const { tutors, loading, error } = useTutors()
  const t = useTranslations("tutorSearch")

  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchParams = useSearchParams()

  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (
          !tutor.displayName?.toLowerCase().includes(query) &&
          !tutor.bio?.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      if (filters.levels.length > 0) {
        if (!filters.levels.some((level) => tutor.teachingLevels?.includes(level))) {
          return false
        }
      }

      if (filters.specializations.length > 0) {
        if (!filters.specializations.some((spec) => tutor.specializations?.includes(spec))) {
          return false
        }
      }

      if (filters.onlineOnly && !tutor.isOnline) return false
      if (filters.verifiedOnly && tutor.verificationStatus !== "verified") return false

      return true
    })
  }, [tutors, filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.levels.length > 0) count++
    if (filters.specializations.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++ // Ajuste selon ton max réel
    if (filters.onlineOnly) count++
    if (filters.verifiedOnly) count++
    return count
  }, [filters])

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <>
      <div className="bg-primary/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {t("pageSubtitle", { count: tutors.length })}
          </p>

          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                className="h-12 pl-10"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative h-12 gap-2 lg:hidden bg-transparent">
                  <SlidersHorizontal className="h-5 w-5" />
                  {t("filters")}
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{t("filters")}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <TutorFilters filters={filters} setFilters={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-card-foreground">{t("filters")}</h2>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-sm"
                  >
                    {t("clearAll")}
                  </Button>
                )}
              </div>
              <TutorFilters filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? t("loadingTutors")
                  : error
                    ? <span className="text-destructive">{error}</span>
                    : t.rich("showingTutors", {
                        count: filteredTutors.length,
                        strong: (chunks) => <strong className="font-medium text-foreground">{chunks}</strong>,
                      })}
              </p>

              {activeFilterCount > 0 && !loading && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1 lg:hidden"
                >
                  <X className="h-4 w-4" />
                  {t("clearFilters")}
                </Button>
              )}
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-border bg-card py-16 text-center">
                <p className="text-lg font-medium text-card-foreground">{t("errorLoading")}</p>
                <p className="mt-1 text-muted-foreground">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => window.location.reload()}
                >
                  {t("tryAgain")}
                </Button>
              </div>
            ) : filteredTutors.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-16 text-center">
                <p className="text-lg font-medium text-card-foreground">{t("noTutorsFound")}</p>
                <p className="mt-1 text-muted-foreground">{t("noTutorsTryAdjust")}</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={clearFilters}
                >
                  {t("clearAllFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.uid} tutor={tutor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}