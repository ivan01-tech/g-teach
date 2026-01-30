"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TutorCard } from "@/components/tutors/tutor-card"
import { TutorFilters } from "@/components/tutors/tutor-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Tutor } from "@/lib/types"

// Mock data for demonstration
const mockTutors: Tutor[] = [
  {
    uid: "1",
    displayName: "Anna Schmidt",
    email: "anna@example.com",
    photoURL: "",
    bio: "Native German speaker with 8 years of teaching experience. Specialized in Goethe exam preparation and business German. I focus on practical conversation skills and grammar foundations.",
    specializations: ["exam-prep", "business", "grammar"],
    teachingLevels: ["a1", "a2", "b1", "b2"],
    languages: ["German", "English", "French"],
    hourlyRate: 35,
    currency: "EUR",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" },
    ],
    rating: 4.9,
    reviewCount: 127,
    totalStudents: 89,
    totalLessons: 1250,
    isVerified: true,
    documents: [
      
    ],examTypes: ["Goethe", "TestDaF"],
    verificationStatus: "verified",
    verificationMessage: "Verified",

    isOnline: true,
    createdAt: new Date(),
    country: "Germany",
    timezone: "Europe/Berlin",
  },
  {
    uid: "2",
    displayName: "Marcus Weber",
    email: "marcus@example.com",
    photoURL: "",
    bio: "Certified DaF teacher with a passion for making German accessible. I specialize in TestDaF and DSH preparation for university students. Interactive and patient teaching style.",
    specializations: ["exam-prep", "conversation", "writing"],
    teachingLevels: ["b1", "b2", "c1", "c2"],
    languages: ["German", "English"],
    hourlyRate: 40,
    currency: "EUR",
    availability: [
      { day: "Tuesday", startTime: "10:00", endTime: "18:00" },
      { day: "Thursday", startTime: "10:00", endTime: "18:00" },
      { day: "Saturday", startTime: "10:00", endTime: "14:00" },
    ],
    documents: [
      
    ],examTypes: ["Goethe", "TestDaF"],
    verificationStatus: "verified",
    verificationMessage: "Verified",
    rating: 4.8,
    reviewCount: 98,
    totalStudents: 67,
    totalLessons: 890,
    isVerified: true,
    isOnline: false,
    createdAt: new Date(),
    country: "Austria",
    timezone: "Europe/Vienna",
  },
  {
    uid: "3",
    displayName: "Lisa Hoffmann",
    email: "lisa@example.com",
    photoURL: "",
    bio: "Friendly and experienced tutor focusing on beginners. I make learning German fun and stress-free! Perfect for those just starting their German journey.",
    specializations: ["conversation", "pronunciation", "listening"],
    teachingLevels: ["a1", "a2", "b1"],
    languages: ["German", "English", "Spanish"],
    hourlyRate: 28,
    currency: "EUR",
    availability: [
      { day: "Monday", startTime: "14:00", endTime: "20:00" },
      { day: "Wednesday", startTime: "14:00", endTime: "20:00" },
      { day: "Friday", startTime: "14:00", endTime: "20:00" },
    ],
    documents: [
      
    ],examTypes: ["Goethe", "TestDaF"],
    verificationStatus: "verified",
    verificationMessage: "Verified",
    rating: 4.7,
    reviewCount: 64,
    totalStudents: 45,
    totalLessons: 520,
    isVerified: true,
    isOnline: true,
    createdAt: new Date(),
    country: "Germany",
    timezone: "Europe/Berlin",
  },
  {
    uid: "4",
    displayName: "Thomas Müller",
    email: "thomas@example.com",
    photoURL: "",
    bio: "Professional translator and language coach with 15 years experience. Expert in business German and professional communication. Help executives and professionals achieve fluency.",
    specializations: ["business", "grammar", "writing"],
    teachingLevels: ["b2", "c1", "c2"],
    languages: ["German", "English", "Italian"],
    hourlyRate: 55,
    currency: "EUR",
    availability: [
      { day: "Monday", startTime: "08:00", endTime: "12:00" },
      { day: "Tuesday", startTime: "08:00", endTime: "12:00" },
      { day: "Thursday", startTime: "08:00", endTime: "12:00" },
    ],
    documents: [
      
    ],examTypes: ["Goethe", "TestDaF"],
    verificationStatus: "verified",
    verificationMessage: "Verified",
    rating: 5.0,
    reviewCount: 156,
    totalStudents: 112,
    totalLessons: 2100,
    isVerified: true,
    isOnline: true,
    createdAt: new Date(),
    country: "Switzerland",
    timezone: "Europe/Zurich",
  },
]

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
  priceRange: [0, 100],
  availability: [],
  onlineOnly: false,
  verifiedOnly: false,
}

export default function TutorsPage() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchParams = useSearchParams()

  const filteredTutors = useMemo(() => {
    return mockTutors.filter((tutor) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (
          !tutor.displayName.toLowerCase().includes(query) &&
          !tutor.bio?.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Levels
      if (filters.levels.length > 0) {
        if (!filters.levels.some((level) => tutor.teachingLevels.includes(level))) {
          return false
        }
      }

      // Specializations
      if (filters.specializations.length > 0) {
        if (!filters.specializations.some((spec) => tutor.specializations.includes(spec))) {
          return false
        }
      }

      // Price range
      if (tutor.hourlyRate < filters.priceRange[0] || tutor.hourlyRate > filters.priceRange[1]) {
        return false
      }

      // Online only
      if (filters.onlineOnly && !tutor.isOnline) {
        return false
      }

      // Verified only
      if (filters.verifiedOnly && !tutor.isVerified) {
        return false
      }

      return true
    })
  }, [filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.levels.length > 0) count++
    if (filters.specializations.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++
    if (filters.onlineOnly) count++
    if (filters.verifiedOnly) count++
    return count
  }, [filters])

  const clearFilters = () => {
    setFilters(initialFilters)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Hero */}
        <div className="bg-primary/5 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Find Your Perfect German Tutor</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Browse {mockTutors.length}+ certified tutors and start learning today
            </p>

            {/* Search Bar */}
            <div className="mt-6 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, specialization, or keyword..."
                  className="h-12 pl-10"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                />
              </div>
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative h-12 gap-2 lg:hidden bg-transparent">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <TutorFilters filters={filters} setFilters={setFilters} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-card-foreground">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-auto p-0 text-sm">
                      Clear all
                    </Button>
                  )}
                </div>
                <TutorFilters filters={filters} setFilters={setFilters} />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredTutors.length}</span> tutors
                </p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-1 lg:hidden"
                  >
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
              </div>

              {filteredTutors.length === 0 ? (
                <div className="rounded-xl border border-border bg-card py-16 text-center">
                  <p className="text-lg font-medium text-card-foreground">No tutors found</p>
                  <p className="mt-1 text-muted-foreground">Try adjusting your filters</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                    Clear all filters
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
      </main>
      <Footer />
    </div>
  )
}

export function Loading() {
  return null
}
