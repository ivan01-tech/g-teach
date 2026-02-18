"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Booking } from "@/lib/types"
import { useTranslations } from "next-intl"

export function TutorBookingsCard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
const t = useTranslations()
  useEffect(() => {
    if (!user?.uid) return

    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, "bookings")
        const q = query(
          bookingsRef,
          where("tutorId", "==", user.uid)
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as any)).sort((a, b) => {
          const aDate = a.date?.toDate?.() || new Date(a.date)
          const bDate = b.date?.toDate?.() || new Date(b.date)
          return aDate.getTime() - bDate.getTime()
        })
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.uid])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>  Leçons Programmées</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  const upcomingBookings = bookings.filter(b => {
    const date = b.date || new Date(b.date)
    return date > new Date() && b.status !== "cancelled"
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "confirmed":
        return <Badge className="bg-blue-500/10 text-blue-600">Confirmée</Badge>
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600">Complétée</Badge>
      case "cancelled":
        return <Badge variant="destructive">Annulée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getActionButtons = (booking: Booking) => {
    if (booking.status === "pending") {
      return (
        <>
          <Button size="sm" variant="default">
            <CheckCircle className="mr-2 h-4 w-4" />
            Accepter
          </Button>
          <Button size="sm" variant="outline">
            <XCircle className="mr-2 h-4 w-4" />
            Refuser
          </Button>
        </>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leçons Programmées
        </CardTitle>
        <CardDescription>
          {upcomingBookings.length} leçon(s) à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Aucune leçon programmée pour le moment
              </p>
              <Button variant="link" size="sm" asChild className="mt-2">
                <Link href="/tutors">Complétez votre profil</Link>
              </Button>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const date = booking.date || new Date(booking.date)
              const isToday = date.toDateString() === new Date().toDateString()
              const isSoon =
                (date.getTime() - new Date().getTime()) / (1000 * 60 * 60) < 24

              return (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    isToday
                      ? "border-orange-500/50 bg-orange-500/5"
                      : isSoon
                        ? "border-yellow-500/50 bg-yellow-500/5"
                        : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={booking.studentName} />
                      <AvatarFallback>
                        {booking.studentName?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{booking.studentName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {date.toLocaleDateString("fr-FR")}
                        <Clock className="h-3 w-3" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
