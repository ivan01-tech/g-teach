"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToBookings } from "@/lib/services/booking-service"
import { setBookings, setLoading } from "@/lib/store/bookings-slice"
import type { Booking } from "@/lib/types"

export function StudentBookingsCard() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { bookings, loading } = useAppSelector((state) => state.bookings)

  useEffect(() => {
    if (!user?.uid || !user?.role) return

    dispatch(setLoading(true))
    const unsubscribe = subscribeToBookings(
      user.uid,
      user.role as 'student' | 'tutor',
      (data) => {
        dispatch(setBookings(data))
      }
    )

    return () => unsubscribe()
  }, [user?.uid, user?.role, dispatch])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Leçons</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  const upcomingBookings = bookings.filter(b => {
    // const date = b.date?.toDate?.() || new Date(b.date)
    // return date > new Date()
    return b.date && b.date > new Date()
  })

  const pastBookings = bookings.filter(b => {
    // const date = b.date?.toDate?.() || new Date(b.date)
    return b.date && b.date <= new Date()
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600">Confirmée</Badge>
      case "completed":
        return <Badge variant="outline">Complétée</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Leçons</CardTitle>
        <CardDescription>
          {upcomingBookings.length > 0
            ? `${upcomingBookings.length} leçon(s) à venir`
            : "Aucune leçon prévue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upcoming Lessons */}
          {upcomingBookings.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">À venir</h3>
              {upcomingBookings.slice(0, 3).map((booking) => {
                const date = booking.date
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={booking.tutorName} />
                        <AvatarFallback>
                          {booking.tutorName?.charAt(0) || "T"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{booking.tutorName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {date ? date.toLocaleDateString("fr-FR") : "Date inconnue"} à {booking.startTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                )
              })}
              {upcomingBookings.length > 3 && (
                <Button variant="link" size="sm" asChild>
                  <Link href="/student/bookings">
                    Voir toutes les leçons ({upcomingBookings.length})
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* No Bookings */}
          {bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas encore de leçon réservée
              </p>
            </div>
          )}

          {/* Past Lessons Summary */}
          {pastBookings.length > 0 && (
            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                {pastBookings.length} leçon(s) passée(s)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
