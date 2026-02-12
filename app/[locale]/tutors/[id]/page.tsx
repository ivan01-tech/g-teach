"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
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
import { SPECIALIZATIONS, GERMAN_LEVELS, type Tutor, type Review } from "@/lib/types"

import { useTutor } from "./use-tutor"
import { useReviews } from "./use-reviews"
import { ReviewForm } from "@/components/tutors/review-form"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { recordContact } from "@/lib/store/matching-slice"
import { useRouter } from "next/navigation"

export default function TutorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { tutor, loading, error } = useTutor(id)
  const {
    reviews,
    loading: reviewsLoading,
    addReview
  } = useReviews(id)
  const { isFavorite: checkFavorite, toggleFavorite } = useFavorites()
  const favorite = checkFavorite(id)
  const { user: learner } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleContactTutor = async () => {
    if (learner && tutor) {
      console.log("learner", learner)
      console.log("tutor", tutor)
      await dispatch(recordContact({
        learnerId: learner.uid,
        tutorId: tutor.uid,
        learnerName: learner.displayName,
        tutorName: tutor.displayName
      }))
    }
    router.push(`/dashboard/messages?tutor=${id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/30">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !tutor) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center bg-muted/30 p-4">
          <h2 className="text-2xl font-bold text-foreground">Tutor not found</h2>
          <p className="text-muted-foreground mt-2">{error || "The tutor you are looking for does not exist."}</p>
          <Button variant="outline" className="mt-6" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  // const isVerified = true
  const isVerified = tutor.verificationStatus === "verified" || tutor.isVerified

  const specializationLabels = tutor.specializations.map(
    (s) => SPECIALIZATIONS.find((spec) => spec.value === s)?.label || s
  )

  const levelLabels = tutor.teachingLevels.map(
    (l) => GERMAN_LEVELS.find((level) => level.value === l)?.label || l
  )

  // Handle createdAt if it's a Firestore Timestamp or Date
  const createdAtDate = tutor.createdAt && (tutor.createdAt as any).toDate
    ? (tutor.createdAt as any).toDate()
    : new Date(tutor.createdAt || Date.now())

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {!isVerified && (
            <Alert variant="destructive" className="mb-6 border-amber-500 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800 font-bold">Attention : Profil non vérifié</AlertTitle>
              <AlertDescription className="text-amber-700">
                Ce tuteur n'a pas encore été vérifié par notre plateforme. G-TEACH décline toute responsabilité en cas de problème lors de vos communications ou transactions. Pour plus de sécurité, nous vous recommandons de privilégier les tuteurs ayant le badge de vérification.
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="overflow-hidden">
                <div className="bg-primary/5 p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-card">
                        <AvatarImage src={tutor.photoURL || "/placeholder.svg"} alt={tutor.displayName} />
                        <AvatarFallback className="text-4xl">
                          {tutor.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {tutor.isOnline && (
                        <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-3 border-card bg-accent" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-card-foreground">{tutor.displayName}</h1>
                        {tutor.isVerified && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground">German Tutor from {tutor.country}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{tutor.rating}</span>
                          <span className="text-muted-foreground">({tutor.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{tutor.totalStudents} students</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{tutor.totalLessons} lessons</span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {specializationLabels.map((spec) => (
                          <Badge key={spec} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 sm:flex-col">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleFavorite(id)}
                      >
                        <Heart className={`h-4 w-4 ${favorite ? "fill-primary text-primary" : ""}`} />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="mt-6">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({tutor.reviewCount})</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About Me</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="whitespace-pre-line text-muted-foreground">{tutor.bio}</div>

                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-medium">Teaching Levels</h4>
                          <div className="flex flex-wrap gap-2">
                            {levelLabels.map((level) => (
                              <Badge key={level} variant="outline">
                                {level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {/* <div>
                          <h4 className="mb-2 font-medium">Languages</h4>
                           <div className="flex flex-wrap gap-2">
                            {tutor.languages.map((lang) => (
                              <Badge key={lang} variant="outline">
                                {lang}
                              </Badge>
                            ))}
                          </div> 
                        </div> */}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Video Introduction */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Video Introduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Play className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-muted-foreground">Video introduction coming soon</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ReviewForm tutorId={id} onSuccess={addReview} />

                      {reviewsLoading ? (
                        <div className="flex h-32 items-center justify-center">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                          No reviews yet. Be the first to review!
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarFallback>{review.studentName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium">{review.studentName}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="mt-1 flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${i < review.rating
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
                      <CardTitle>Weekly Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {tutor.availability.map((slot) => (
                          <div
                            key={slot.day}
                            className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3"
                          >
                            <span className="font-medium">{slot.day}</span>
                            <span className="text-muted-foreground">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="h-4 w-4" />
                        Timezone: {tutor.timezone}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-foreground">
                      {tutor.hourlyRate}
                      <span className="text-lg font-normal text-muted-foreground"> {tutor.currency}/hr</span>
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      className="w-full gap-2"
                      size="lg"
                      onClick={handleContactTutor}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send Message
                    </Button>
                    {/* <Button variant="outline" className="w-full gap-2 bg-transparent" size="lg">
                      <Calendar className="h-4 w-4" />
                      Book Trial Lesson
                    </Button> */}
                  </div>

                  <div className="mt-6 space-y-4 border-t border-border pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                        <p className="font-medium">Usually within 2 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Teaching Since</p>
                        <p className="font-medium">{createdAtDate.getFullYear()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">
                          {tutor.isVerified ? "Verified Tutor" : "Pending Verification"}
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
      <Footer />
    </div>
  )
}
