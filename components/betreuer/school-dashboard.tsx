"use client"

import { useEffect, useState } from "react"
import { School, Tutor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Star, Eye, MessageSquare, Users, BookOpen, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { onSchoolReviewsChanged } from "@/lib/services/school-service"
import { SchoolReviewsList } from "@/components/schools/school-reviews-list"

interface SchoolDashboardProps {
  school: School
  tutor?: Tutor
  onEditClick: () => void
  onEditProfileClick: () => void
}

export function SchoolDashboard({
  school,
  tutor,
  onEditClick,
  onEditProfileClick,
}: SchoolDashboardProps) {
  const t = useTranslations()
  const [reviewCount, setReviewCount] = useState(school.reviewCount || 0)

  useEffect(() => {
    const unsubscribe = onSchoolReviewsChanged(school.id, (reviews) => {
      setReviewCount(reviews.length)
    })
    return () => unsubscribe()
  }, [school.id])

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: t("Verified"),
          color: "bg-green-500/10 text-green-700 border-green-200",
          icon: <CheckCircle2 className="h-4 w-4" />,
        }
      case "rejected":
        return {
          label: t("Rejected"),
          color: "bg-red-500/10 text-red-700 border-red-200",
          icon: null,
        }
      default:
        return {
          label: t("Pending Verification"),
          color: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
          icon: <AlertCircle className="h-4 w-4" />,
        }
    }
  }

  const badge = getVerificationBadge(school.verificationStatus)

  // Check tutor profile completion
  const isProfileIncomplete =
    !tutor?.photoURL ||
    !tutor?.bio ||
    tutor?.specializations.length === 0 ||
    tutor?.teachingLevels.length === 0

  return (
    <div className="space-y-6">
      {/* Profile Completion Alert */}
      {isProfileIncomplete && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold mb-1">{t("Complete Your Profile")}</p>
                <p className="text-sm">
                  {t("Complete your profile to increase your school's visibility and credibility on the platform")}
                </p>
              </div>
              <Button
                size="sm"
                onClick={onEditProfileClick}
                className="gap-2 whitespace-nowrap"
              >
                {t("Update Profile")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* School Header */}
      <Card>
        <CardHeader>
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
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl">{school.name}</CardTitle>
                  <Badge className={`${badge.color} flex items-center gap-1`}>
                    {badge.icon}
                    {badge.label}
                  </Badge>
                </div>
                <CardDescription className="text-base mb-2">
                  {school.location.address ? (
                    <>
                      {school.location.address} • {school.location.city}, {school.location.country}
                    </>
                  ) : (
                    `${school.location.city}, ${school.location.country}`
                  )}
                </CardDescription>
                {school.description && (
                  <p className="text-sm text-foreground/70 mt-2 max-w-2xl">{school.description}</p>
                )}
              </div>
            </div>
            <Button onClick={onEditClick} size="lg">
              {t("Edit School")}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Profile Views")}</p>
                <p className="text-3xl font-bold text-foreground">{school.profileViews || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Rating")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-foreground">
                    {school.rating > 0 ? school.rating.toFixed(1) : "—"}
                  </p>
                  {school.rating > 0 && (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Reviews")}</p>
                <p className="text-3xl font-bold text-foreground">{reviewCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-500/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("Offers")}</p>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-bold text-foreground">
                    {school.exams?.length || 0} {t("exams")}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {school.levels?.length || 0} {t("levels")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exams & Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("Exams Offered")}</CardTitle>
          </CardHeader>
          <CardContent>
            {school.exams && school.exams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {school.exams.map((exam) => (
                  <Badge key={exam} variant="secondary">
                    {exam}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("No exams configured")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("Levels Offered")}</CardTitle>
          </CardHeader>
          <CardContent>
            {school.levels && school.levels.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {school.levels.map((level) => (
                  <Badge key={level} variant="outline">
                    {level}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t("No levels configured")}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      {(school.phone || school.email || school.website) && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Contact Information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {school.phone && (
              <p className="text-sm">
                <span className="font-semibold text-foreground">{t("Phone")}:</span>{" "}
                <a href={`tel:${school.phone}`} className="text-primary hover:underline">
                  {school.phone}
                </a>
              </p>
            )}
            {school.email && (
              <p className="text-sm">
                <span className="font-semibold text-foreground">{t("Email")}:</span>{" "}
                <a href={`mailto:${school.email}`} className="text-primary hover:underline">
                  {school.email}
                </a>
              </p>
            )}
            {school.website && (
              <p className="text-sm">
                <span className="font-semibold text-foreground">{t("Website")}:</span>{" "}
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {school.website}
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Student Reviews")}</CardTitle>
          <CardDescription>
            {reviewCount} {reviewCount === 1 ? t("review") : t("reviews")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchoolReviewsList schoolId={school.id} />
        </CardContent>
      </Card>
    </div>
  )
}
