"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Video } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToBookings } from "@/lib/services/booking-service"
import { setBookings, setLoading } from "@/lib/store/bookings-slice"
import type { Booking } from "@/lib/types"

export function TutorBookingsCard() {
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
                    <CardTitle>Leçons à Venir</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </CardContent>
            </Card>
        )
    }

    const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending")

    if (!upcomingBookings.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Leçons à Venir</CardTitle>
                    <CardDescription>Vous n'avez pas encore de leçon prévue</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="mb-4 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Vos prochaines leçons s'afficheront ici.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const getStatusBadge = (status: Booking["status"]) => {
        switch (status) {
            case "pending":
                return <Badge variant="secondary">À confirmer</Badge>
            case "confirmed":
                return <Badge className="bg-green-500/10 text-green-600">Confirmée</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leçons à Venir ({upcomingBookings.length})</CardTitle>
                <CardDescription>
                    Vos prochains cours programmés
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {upcomingBookings.slice(0, 5).map((booking) => (
                        <div
                            key={booking.id}
                            className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        {booking.studentName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{booking.studentName}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        {booking.date ? booking.date.toLocaleDateString("fr-FR") : "N/A"}
                                        <Clock className="h-3 w-3 ml-1" />
                                        {booking.startTime}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(booking.status)}
                                {booking.status === "confirmed" && (
                                    <Button size="sm" variant="ghost" asChild>
                                        <Link href={`/betreuer/bookings`}>
                                            <Video className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                        <Link href="/betreuer/bookings">Gérer mes leçons</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
