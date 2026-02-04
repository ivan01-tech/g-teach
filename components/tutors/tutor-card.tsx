"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle2, User, MessageSquare, Heart, AlertTriangle } from "lucide-react"
import type { Tutor } from "@/lib/types"
import { SPECIALIZATIONS, GERMAN_LEVELS } from "@/lib/types"

interface TutorCardProps {
  tutor: Tutor
}

export function TutorCard({ tutor }: TutorCardProps) {
  // const isVerified = true
  const isVerified = tutor.verificationStatus === "verified" || tutor.isVerified

  const specializationLabels = tutor.specializations
    .slice(0, 3)
    .map((s) => SPECIALIZATIONS.find((spec) => spec.value === s)?.label || s)

  const levelLabels = tutor.teachingLevels
    .map((l) => GERMAN_LEVELS.find((level) => level.value === l)?.value.toUpperCase() || l)

  return (
    <Card className={`group overflow-hidden transition-shadow hover:shadow-md ${!isVerified ? 'border-amber-200' : ''}`}>
      <CardContent className="p-0">
        {!isVerified && (
          <div className="bg-amber-50 px-4 py-1.5 flex items-center gap-2 border-b border-amber-100">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Non vérifié - Prudence
            </span>
          </div>
        )}
        {/* Header */}
        <div className="relative bg-primary/5 p-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                {tutor.photoURL ? (
                  <img
                    src={tutor.photoURL || "/placeholder.svg"}
                    alt={tutor.displayName}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              {tutor.isOnline && (
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card bg-accent" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-card-foreground">{tutor.displayName}</h3>
                {isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{tutor.country}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-sm text-muted-foreground">({tutor.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Favorite Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to favorites</span>
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Bio */}
          <p className="line-clamp-2 text-sm text-muted-foreground">{tutor.bio}</p>

          {/* Specializations */}
          <div className="mt-3 flex flex-wrap gap-1">
            {specializationLabels.map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
          </div>

          {/* Levels */}
          <div className="mt-3">
            <p className="text-xs text-muted-foreground">Teaches levels:</p>
            <p className="text-sm font-medium">{levelLabels.join(" - ")}</p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="font-medium">{tutor.totalStudents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lessons</p>
              <p className="font-medium">{tutor.totalLessons}</p>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {tutor.hourlyRate}
                <span className="text-sm font-normal text-muted-foreground"> {tutor.currency}/hr</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tutors/${tutor.uid}`}>
                  <MessageSquare className="mr-1 h-4 w-4" />
                  Message
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={`/tutors/${tutor.uid}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
