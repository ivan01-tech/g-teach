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
import { useTranslations } from "next-intl"
import { Eye, Users, BookOpen, Star, TrendingUp } from "lucide-react"

interface SchoolStatsDialogProps {
  open: boolean
  school?: School
  onOpenChange: (open: boolean) => void
}

export function SchoolStatsDialog({ open, school, onOpenChange }: SchoolStatsDialogProps) {
  const t = useTranslations()

  if (!school) return null

  const stats = [
    {
      label: t("Profile Views"),
      value: school.profileViews || 0,
      icon: Eye,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: t("Total Students"),
      value: school.totalStudents || 0,
      icon: Users,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: t("Total Lessons"),
      value: school.totalLessons || 0,
      icon: BookOpen,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: t("Rating"),
      value: school.rating ? school.rating.toFixed(1) : "N/A",
      icon: Star,
      color: "bg-yellow-500/10 text-yellow-600",
      subtext: `(${school.reviewCount} ${t("reviews")})`,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{school.name} - {t("Statistics")}</DialogTitle>
          <DialogDescription>
            {t("Performance metrics and engagement data")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.label}>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center justify-between">
                      <span>{stat.label}</span>
                      <div className={`rounded-lg p-2 ${stat.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    {stat.subtext && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* School Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("School Information")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t("Location")}</p>
                  <p className="font-medium">
                    {school.location.city}, {school.location.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("Verification Status")}</p>
                  <p className="font-medium capitalize">{school.verificationStatus}</p>
                </div>
              </div>

              {school.exams && school.exams.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("Offered Exams")}</p>
                  <div className="flex flex-wrap gap-2">
                    {school.exams.map((exam) => (
                      <span key={exam} className="inline-block bg-muted px-2 py-1 rounded text-sm">
                        {exam}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {school.levels && school.levels.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{t("Offered Levels")}</p>
                  <div className="flex flex-wrap gap-2">
                    {school.levels.map((level) => (
                      <span key={level} className="inline-block bg-muted px-2 py-1 rounded text-sm">
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          {(school.phone || school.email || school.website) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("Contact Information")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {school.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Phone")}</p>
                    <p className="font-medium">{school.phone}</p>
                  </div>
                )}
                {school.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Email")}</p>
                    <p className="font-medium">{school.email}</p>
                  </div>
                )}
                {school.website && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t("Website")}</p>
                    <a href={school.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                      {school.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
