"use client"

import { School } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { Star, MapPin, Zap, CheckCircle } from "lucide-react"
import { SchoolMapPreview } from "@/components/student/school-map-preview"

interface SchoolPreviewDialogProps {
  open: boolean
  school?: School
  onOpenChange: (open: boolean) => void
}

export function SchoolPreviewDialog({ open, school, onOpenChange }: SchoolPreviewDialogProps) {
  const t = useTranslations()

  if (!school) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-200"
      default:
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified":
        return t("Verified")
      case "rejected":
        return t("Rejected")
      default:
        return t("Pending Verification")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("School Preview")}</DialogTitle>
          <DialogDescription>
            {t("How your school will appear to students")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                {school.logo && (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {school.location.city}, {school.location.country}
                    </span>
                  </div>
                  {school.location.address && (
                    <p className="text-sm text-muted-foreground mt-1">{school.location.address}</p>
                  )}
                </div>
              </div>

              <Badge className={`${getStatusColor(school.verificationStatus)}`}>
                {getStatusLabel(school.verificationStatus)}
              </Badge>
            </div>
          </div>

          {/* Rating */}
          {school.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(school.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">
                {school.rating.toFixed(1)} 
                <span className="text-sm text-muted-foreground ml-1">
                  ({school.reviewCount} {t("reviews")})
                </span>
              </span>
            </div>
          )}

          {/* Description */}
          {school.description && (
            <div>
              <h2 className="font-semibold text-foreground mb-2">{t("About")}</h2>
              <p className="text-foreground/70 leading-relaxed">{school.description}</p>
            </div>
          )}

          {/* Exams and Levels */}
          <div className="grid gap-4 md:grid-cols-2">
            {school.exams && school.exams.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  {t("Offered Exams")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.exams.map((exam) => (
                    <Badge key={exam} variant="secondary">
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {school.levels && school.levels.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {t("Offered Levels")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {school.levels.map((level) => (
                    <Badge key={level} variant="secondary">
                      {level}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          {school.location.latitude && school.location.longitude && (
            <>
              <hr className="my-4" />
              <SchoolMapPreview
                schoolName={school.name}
                latitude={school.location.latitude}
                longitude={school.location.longitude}
                address={school.location.address}
                city={school.location.city}
                country={school.location.country}
              />
            </>
          )}

          {/* Contact Information */}
          {(school.phone || school.email || school.website) && (
            <>
              <hr className="my-4" />
              <div>
                <h3 className="font-semibold text-foreground mb-3">{t("Contact")}</h3>
                <div className="space-y-2">
                  {school.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("Phone")}</span>
                      <span className="font-medium">{school.phone}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("Email")}</span>
                      <span className="font-medium">{school.email}</span>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("Website")}</span>
                      <a
                        href={school.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {school.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Statistics */}
          <hr className="my-4" />
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t("Statistics")}</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {school.profileViews || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t("Profile Views")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {school.totalStudents || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t("Total Students")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {school.totalLessons || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{t("Total Lessons")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
