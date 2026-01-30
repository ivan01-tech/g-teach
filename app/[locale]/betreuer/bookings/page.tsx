"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import type { Booking } from "@/lib/types"

// Demo bookings data
const DEMO_BOOKINGS: Booking[] = [
  {
    id: "1",
    tutorId: "tutor1",
    studentId: "student1",
    tutorName: "You",
    studentName: "Marie Dupont",
    date: new Date(Date.now() + 86400000),
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
    price: 35,
    currency: "EUR",
    notes: "B1 exam preparation - Goethe",
    createdAt: new Date(),
  },
  {
    id: "2",
    tutorId: "tutor1",
    studentId: "student2",
    tutorName: "You",
    studentName: "Jean Martin",
    date: new Date(Date.now() + 172800000),
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    price: 35,
    currency: "EUR",
    notes: "Conversation practice",
    createdAt: new Date(),
  },
]

export default function BetreuerBookingsPage() {
  const [bookings] = useState<Booking[]>(DEMO_BOOKINGS)

  const pendingBookings = bookings.filter((b) => b.status === "pending")
  const upcomingBookings = bookings.filter((b) => b.status === "confirmed")
  const completedBookings = bookings.filter((b) => b.status === "completed")

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Confirmed</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
    }
  }

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {booking.studentName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{booking.studentName}</p>
              <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {booking.date.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {booking.startTime} - {booking.endTime}
                </span>
              </div>
              {booking.notes && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {booking.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(booking.status)}
            <p className="text-sm font-medium">
              {booking.price} {booking.currency}
            </p>
          </div>
        </div>
        
        {booking.status === "pending" && (
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept
            </Button>
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <XCircle className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
        
        {booking.status === "confirmed" && (
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1">
              <Video className="mr-2 h-4 w-4" />
              Start Session
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground">
          Manage your lesson requests and scheduled sessions
        </p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingBookings.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {pendingBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No pending requests</p>
                <p className="text-sm text-muted-foreground">
                  New booking requests will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No upcoming sessions</p>
                <p className="text-sm text-muted-foreground">
                  Confirmed bookings will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">No completed sessions yet</p>
                <p className="text-sm text-muted-foreground">
                  Your teaching history will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
