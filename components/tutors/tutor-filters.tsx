"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { GERMAN_LEVELS, SPECIALIZATIONS } from "@/lib/types"
import type { FilterState } from "@/app/tutors/page"

interface TutorFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export function TutorFilters({ filters, setFilters }: TutorFiltersProps) {
  const toggleLevel = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level]
    setFilters({ ...filters, levels: newLevels })
  }

  const toggleSpecialization = (spec: string) => {
    const newSpecs = filters.specializations.includes(spec)
      ? filters.specializations.filter((s) => s !== spec)
      : [...filters.specializations, spec]
    setFilters({ ...filters, specializations: newSpecs })
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Price Range (EUR/hr)</h3>
        <Slider
          min={0}
          max={100}
          step={5}
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{filters.priceRange[0]} EUR</span>
          <span>{filters.priceRange[1]} EUR</span>
        </div>
      </div>

      {/* German Levels */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">German Level</h3>
        <div className="space-y-2">
          {GERMAN_LEVELS.map((level) => (
            <div key={level.value} className="flex items-center gap-2">
              <Checkbox
                id={`level-${level.value}`}
                checked={filters.levels.includes(level.value)}
                onCheckedChange={() => toggleLevel(level.value)}
              />
              <Label
                htmlFor={`level-${level.value}`}
                className="text-sm font-normal text-muted-foreground"
              >
                {level.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Specializations */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Specialization</h3>
        <div className="space-y-2">
          {SPECIALIZATIONS.map((spec) => (
            <div key={spec.value} className="flex items-center gap-2">
              <Checkbox
                id={`spec-${spec.value}`}
                checked={filters.specializations.includes(spec.value)}
                onCheckedChange={() => toggleSpecialization(spec.value)}
              />
              <Label
                htmlFor={`spec-${spec.value}`}
                className="text-sm font-normal text-muted-foreground"
              >
                {spec.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Additional</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="online-only"
              checked={filters.onlineOnly}
              onCheckedChange={(checked) => setFilters({ ...filters, onlineOnly: checked as boolean })}
            />
            <Label htmlFor="online-only" className="text-sm font-normal text-muted-foreground">
              Currently Online
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="verified-only"
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => setFilters({ ...filters, verifiedOnly: checked as boolean })}
            />
            <Label htmlFor="verified-only" className="text-sm font-normal text-muted-foreground">
              Verified Tutors Only
            </Label>
          </div>
        </div>
      </div>
    </div>
  )
}
