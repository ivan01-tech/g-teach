"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video } from "lucide-react"
import Link from "next/link"

export default function BookingsPage() {
  const { userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("upcoming")

  const isStudent = userProfile?.role === "student"

  // In a real app, these would be fetched from Firebase
  const upcomingBookings: unknown[] = []
  const pastBookings: unknown[] = []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {isStudent ? "My Lessons" : "Scheduled Lessons"}
        </h1>
        <p className="text-muted-foreground">
          {isStudent
            ? "View and manage your booked lessons"
            : "Manage your teaching schedule"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">No upcoming lessons</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {isStudent
                    ? "Book a lesson with a tutor to start learning German."
                    : "You have no scheduled lessons. Students will be able to book with you based on your availability."}
                </p>
                {isStudent && (
                  <Button className="mt-6" asChild>
                    <Link href="/tutors">Find a Tutor</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Booking cards would go here */}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">No past lessons</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Your completed lessons will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {/* Past booking cards would go here */}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upcoming Lesson Card Template (for reference) */}
      {false && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">German Lesson with Anna Schmidt</CardTitle>
              <p className="text-sm text-muted-foreground">Exam Preparation - B2 Level</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Video className="h-4 w-4" />
              Join Lesson
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Monday, Jan 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">10:00 AM - 11:00 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
