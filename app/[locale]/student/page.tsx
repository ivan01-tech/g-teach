"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, MessageSquare, Search, Clock, Star, BookOpen, TrendingUp, Award } from "lucide-react"
import { Suspense } from "react"
import Loading from "./loading"
import { useAuth } from "@/hooks/use-auth"
import { StudentMatchingsCard } from "@/components/student/student-matchings-card"
import { StudentBookingsCard } from "@/components/student/student-bookings-card"
import { MatchingFollowupDialog } from "@/components/student/matching-followup-dialog"
import { useAppSelector } from "@/hooks/redux-store-hooks"

export default function DashboardPage() {
  const { userProfile, user } = useAuth()
  const { bookings } = useAppSelector((state) => state.bookings)
  const { allMatchings: matchings } = useAppSelector((state) => state.matching)

  const isStudent = userProfile?.role == "student"

  const upcomingBookingsCount = bookings.filter(b => b.status === "confirmed").length
  const pendingBookingsCount = bookings.filter(b => b.status === "pending").length
  const activeMatchingsCount = matchings.filter(m => m.status === "open").length

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Welcome back, {user?.displayName?.split(" ")[0] || "User"}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isStudent
              ? "Continue your German learning journey"
              : "Manage your tutoring schedule and connect with students"}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isStudent ? (
            <>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Find a Tutor</CardTitle>
                  <Search className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Browse our expert German tutors
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/tutors">Search Tutors</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{upcomingBookingsCount}</p>
                  <p className="text-xs text-muted-foreground">Scheduled this week</p>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{activeMatchingsCount}</p>
                  <p className="text-xs text-muted-foreground">Tutors contacted</p>
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
                    <Link href="/student/matchings">View all →</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Total hours learned</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Lessons</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{upcomingBookingsCount}</p>
                  <p className="text-xs text-muted-foreground">Scheduled this week</p>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{pendingBookingsCount}</p>
                  <p className="text-xs text-muted-foreground">Waiting for confirmation</p>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{activeMatchingsCount}</p>
                  <p className="text-xs text-muted-foreground">Interested students</p>
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
                    <Link href="/betreuer/matchings">View all →</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {/* <p className="text-2xl font-bold">{userProfile?.rating || "-"}</p> */}
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {isStudent ? (
            <>
              <StudentMatchingsCard />
              <StudentBookingsCard />
            </>
          ) : (
            <>
            </>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest interactions on G-Teach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No recent activity</p>
                {isStudent && (
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/tutors">Find your first tutor</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips / Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>{isStudent ? "Getting Started" : "Tutor Tips"}</CardTitle>
              <CardDescription>
                {isStudent ? "Complete these steps to start learning" : "Optimize your tutoring profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isStudent ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Complete your profile</p>
                        <p className="text-xs text-muted-foreground">Add your learning goals and level</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Browse tutors</p>
                        <p className="text-xs text-muted-foreground">Find the perfect match for your needs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-sm font-medium text-primary">3</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Book your first lesson</p>
                        <p className="text-xs text-muted-foreground">Start your German learning journey</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Complete your profile</p>
                        <p className="text-xs text-muted-foreground">Add a photo, bio, and specializations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Set your availability</p>
                        <p className="text-xs text-muted-foreground">Let students know when you can teach</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Respond quickly</p>
                        <p className="text-xs text-muted-foreground">Fast responses lead to more bookings</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <MatchingFollowupDialog />
      </div>
    </Suspense>
  )
}
