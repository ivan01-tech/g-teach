"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToMatchings } from "@/lib/services/matching-service"
import { setAllMatchings, setLoading, setManualFollowup } from "@/lib/store/matching-slice"
import type { Matching } from "@/lib/types"

export function StudentMatchingsCard() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { allMatchings: matchings, loading } = useAppSelector((state) => state.matching)

  useEffect(() => {
    if (!user?.uid || !user?.role) return

    dispatch(setLoading(true))
    const unsubscribe = subscribeToMatchings(
      user.uid,
      user.role as 'student' | 'tutor',
      (data) => {
        dispatch(setAllMatchings(data))
      }
    )

    return () => unsubscribe()
  }, [user?.uid, user?.role, dispatch])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Mises en Relation</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  if (!matchings.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mes Mises en Relation</CardTitle>
          <CardDescription>Aucune mise en relation pour le moment</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="mb-3 text-sm text-muted-foreground">
            Commencez par contacter un tuteur!
          </p>
          <Button asChild>
            <Link href="/tutors">Parcourir les tuteurs</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">En attente de validation</Badge>
      case "open":
        return <Badge variant="secondary">Prêt pour discuter</Badge>
      case "continued":
        return <Badge variant="outline">Recherche en cours</Badge>
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600">Confirmée</Badge>
      case "refused":
        return <Badge variant="destructive">Refusée</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Mises en Relation ({matchings.length})</CardTitle>
        <CardDescription>
          Tuteurs que vous avez contactés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matchings.map((matching) => (
            <div
              key={matching.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={matching.tutorName} />
                  <AvatarFallback>
                    {matching.tutorName?.charAt(0) || "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{matching.tutorName || "Tuteur"}</p>
                  <p className="text-xs text-muted-foreground">
                    Contacté il y a{" "}
                    {matching.contactDate
                      ? Math.floor(
                        (Date.now() - (matching.contactDate?.toDate?.() || new Date(matching.contactDate)).getTime()) /
                        (1000 * 60 * 60 * 24)
                      )
                      : 0}{" "}
                    jours
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(matching.status)}
                {matching.status !== "requested" && matching.status !== "refused" && (
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/student/messages?tutor=${matching.tutorId}`}>
                      <MessageSquare className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
                {(matching.status === "open" || matching.status === "continued") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dispatch(setManualFollowup(matching))}
                    title="Suivi de la mise en relation"
                  >
                    <Clock className="h-4 w-4 text-primary" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
