"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Clock,
  Globe,
  Users,
  BookOpen,
  Heart,
  Share2,
  Play,
  AlertTriangle,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SPECIALIZATIONS, GERMAN_LEVELS } from "@/lib/types"
import { ReviewForm } from "@/components/tutors/review-form"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { recordContact } from "@/lib/store/matching-slice"
import { recordProfileViewThunk } from "@/lib/store/profile-views-slice"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTutor } from "@/app/[locale]/tutors/[id]/use-tutor"
import { useReviews } from "@/app/[locale]/tutors/[id]/use-reviews"

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const t = useTranslations("tutor-profile")

  const { tutor, loading, error } = useTutor(id)
  const { reviews, loading: reviewsLoading, addReview } = useReviews(id)
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites()
  const favorite = checkFavorite(id)
  const { user: learner } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const [viewRecorded, setViewRecorded] = useState(false)

  useEffect(() => {
    if (tutor && !viewRecorded) {
      const sessionKey = `viewed_tutor_${tutor.uid}`
      const sessionViewed = sessionStorage.getItem(sessionKey)

      if (!sessionViewed) {
        const metadata = {
          device: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
          browser: navigator.userAgent.split(" ").pop() || "unknown",
        }

        dispatch(
          recordProfileViewThunk({
            tutorId: tutor.uid,
            viewerId: learner?.uid,
            metadata,
          })
        )

        sessionStorage.setItem(sessionKey, "true")
      }
      setViewRecorded(true)
    }
  }, [tutor, learner, dispatch, viewRecorded])

  const handleContactTutor = async () => {
    if (learner && tutor) {
      await dispatch(
        recordContact({
          learnerId: learner.uid,
          tutorId: tutor.uid,
          learnerName: learner.displayName,
          tutorName: tutor.displayName,
        })
      )
    }
    router.push(`/student/messages?tutor=${id}`)
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center bg-muted/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </main>
    )
  }

  if (error || !tutor) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center bg-muted/30 p-4">
        <h2 className="text-2xl font-bold text-foreground">{t("tutorNotFound", { fallback: "Tutor not found" })}</h2>
        <p className="text-muted-foreground mt-2">
          {error || t("tutorNotFoundDesc", { fallback: "The tutor you are looking for does not exist." })}
        </p>
        <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
          {t("goBack")}
        </Button>
      </main>
    )
  }

  const isVerified = tutor.verificationStatus === "verified" || tutor.isVerified

  const specializationLabels = tutor.specializations
    ?.map((s) => SPECIALIZATIONS.find((spec) => spec.value === s)?.label || s) ?? []

  const levelLabels = tutor.teachingLevels
    ?.map((l) => GERMAN_LEVELS.find((level) => level.value === l)?.label || l) ?? []

  const createdAtDate = tutor.createdAt && (tutor.createdAt as any).toDate
    ? (tutor.createdAt as any).toDate()
    : new Date(tutor.createdAt || Date.now())

  return (
    <main className="flex-1 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!isVerified && (
          <Alert variant="destructive" className="mb-6 border-amber-500 bg-amber-50 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800 font-bold">{t("attentionNonVerified")}</AlertTitle>
            <AlertDescription className="text-amber-700">
              {t("nonVerifiedWarning")}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-primary/5 p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-card">
                      <AvatarImage src={tutor.photoURL || "/placeholder.svg"} alt={tutor.displayName} />
                      <AvatarFallback className="text-4xl">
                        {tutor.displayName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {tutor.isOnline && (
                      <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-3 border-card bg-accent" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-card-foreground">{tutor.displayName}</h1>
                      {isVerified && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground">
                      {t("germanTutorFrom")} {tutor.country}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{tutor.rating ?? "—"}</span>
                        <span className="text-muted-foreground">
                          ({tutor.reviewCount ?? 0} {t("reviews")})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{tutor.totalStudents ?? 0} {t("students")}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        <span>{tutor.totalLessons ?? 0} {t("lessons")}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {specializationLabels.map((spec) => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    <Button variant="outline" size="icon" onClick={() => toggleFavorite(id)}>
                      <Heart className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="about" className="mt-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="about">{t("about")}</TabsTrigger>
                <TabsTrigger value="reviews">
                  {t("reviewsTab", { count: tutor.reviewCount ?? 0 })}
                </TabsTrigger>
                <TabsTrigger value="availability">{t("availability")}</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("about")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line text-muted-foreground">{tutor.bio || "—"}</div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium">{t("teachingLevels")}</h4>
                        <div className="flex flex-wrap gap-2">
                          {levelLabels.map((level) => (
                            <Badge key={level} variant="outline">{level}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t("videoIntroduction")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <Play className="h-8 w-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground">{t("videoComingSoon")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("studentReviews")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ReviewForm tutorId={id} onSuccess={addReview} />

                    {reviewsLoading ? (
                      <div className="flex h-32 items-center justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="py-12 text-center text-muted-foreground">
                        {t("noReviewsYet")}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-border pb-6 last:border-0 last:pb-0"
                          >
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>{review.studentName?.[0] ?? "?"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium">{review.studentName ?? "Anonyme"}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="mt-1 flex gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground/30"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("weeklyAvailability")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tutor.availability?.map((slot) => (
                        <div
                          key={slot.day}
                          className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                        >
                          <span className="font-medium">{slot.day}</span>
                          <span className="text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      )) ?? <p className="text-muted-foreground">Aucune disponibilité renseignée</p>}
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      {t("timezone")}: {tutor.timezone ?? "—"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">
                    {tutor.hourlyRate ?? "—"}
                    <span className="text-lg font-normal text-muted-foreground">
                      {" "}
                      {tutor.currency ?? "€"}/hr
                    </span>
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full gap-2" size="lg" onClick={handleContactTutor}>
                    <MessageSquare className="h-4 w-4" />
                    {t("sendMessage")}
                  </Button>
                </div>

                <div className="mt-6 space-y-4 border-t border-border pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("responseTime")}</p>
                      <p className="font-medium">{t("usuallyWithin")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("teachingSince")}</p>
                      <p className="font-medium">{createdAtDate.getFullYear()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t("status")}</p>
                      <p className="font-medium">
                        {isVerified ? t("verifiedTutor") : t("pendingVerification")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}