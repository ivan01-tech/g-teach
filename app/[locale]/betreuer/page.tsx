"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  MessageSquare,
  Calendar,
  FileCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react"
import { useTutorProfile } from "@/hooks/use-tutor-profile"
import { getStudentRequests } from "@/lib/tutor-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"

export default function BetreuerDashboard() {
  const { user } = useAuth()
  const { tutorProfile, loading } = useTutorProfile()
  const [studentRequests, setStudentRequests] = useState<number>(0)

  useEffect(() => {
    if (user) {
      getStudentRequests(user.uid).then((requests) => {
        setStudentRequests(requests.length)
      })
    }
  }, [user])

  const getProfileCompleteness = () => {
    if (!tutorProfile) return 0
    let score = 0
    if (tutorProfile.displayName) score += 15
    if (tutorProfile.bio && tutorProfile.bio.length > 50) score += 20
    if (tutorProfile.photoURL) score += 15
    if (tutorProfile.specializations?.length > 0) score += 15
    if (tutorProfile.teachingLevels?.length > 0) score += 10
    if (tutorProfile.hourlyRate > 0) score += 10
    if (tutorProfile.documents?.length > 0) score += 15
    return score
  }

  const profileCompleteness = getProfileCompleteness()

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.displayName || "Tutor"}
        </h1>
        <p className="text-muted-foreground">
          Manage your profile, view student requests, and grow your teaching practice.
        </p>
      </div>

      {/* Verification Status Alert */}
      {tutorProfile?.verificationStatus === "pending" && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <Clock className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-600">Verification Pending</AlertTitle>
          <AlertDescription className="text-yellow-600/80">
            Your profile is under review. Please ensure all required documents are uploaded.
            You will be notified once your profile is verified.
          </AlertDescription>
        </Alert>
      )}

      {tutorProfile?.verificationStatus === "rejected" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification Rejected</AlertTitle>
          <AlertDescription>
            {tutorProfile.verificationMessage ||
              "Your profile verification was rejected. Please review your documents and resubmit."}
          </AlertDescription>
        </Alert>
      )}

      {tutorProfile?.verificationStatus === "verified" && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Profile Verified</AlertTitle>
          <AlertDescription className="text-green-600/80">
            Your profile is verified. Students can now find and contact you.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tutorProfile?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentRequests}</div>
            <p className="text-xs text-muted-foreground">Student conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tutorProfile?.totalLessons || 0}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {tutorProfile?.rating?.toFixed(1) || "N/A"}
              </span>
              {tutorProfile?.rating && (
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {tutorProfile?.reviewCount || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Completeness */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Completeness</CardTitle>
            <CardDescription>
              Complete your profile to attract more students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Profile completion</span>
                <span className="font-medium">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                {tutorProfile?.photoURL ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Profile photo</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tutorProfile?.bio && tutorProfile.bio.length > 50 ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Professional description</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tutorProfile?.specializations?.length ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Specializations added</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {tutorProfile?.documents?.length ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Documents uploaded</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/betreuer/profile">
                Complete Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/betreuer/documents">
                <FileCheck className="mr-2 h-4 w-4" />
                Upload Documents
                {!tutorProfile?.documents?.length && (
                  <Badge variant="secondary" className="ml-auto">
                    Required
                  </Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/betreuer/messages">
                <MessageSquare className="mr-2 h-4 w-4" />
                View Messages
                {studentRequests > 0 && (
                  <Badge className="ml-auto">{studentRequests}</Badge>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/betreuer/bookings">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Bookings
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/betreuer/profile">
                <Users className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* G-Teach Message */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <span className="text-lg font-bold text-primary-foreground">G</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              G-Teach: A Network of Qualified Tutors
            </h3>
            <p className="text-sm text-muted-foreground">
              G-Teach is not an open platform. It is a professional network of verified
              German language tutors. Your credentials help maintain the quality that
              students trust.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
