"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Matching } from "@/lib/types"

export function TutorMatchingsCard() {
  const { user } = useAuth()
  const [matchings, setMatchings] = useState<Matching[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) return

    const fetchMatchings = async () => {
      try {
        const matchingsRef = collection(db, "matchings")
        const q = query(
          matchingsRef,
          where("tutorId", "==", user.uid),
          where("status", "in", ["open", "continued", "confirmed"])
        )
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as any))
        setMatchings(data)
      } catch (error) {
        console.error("Error fetching matchings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchings()
  }, [user?.uid])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mises en Relation</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </Card>
    )
  }

  const confirmedCount = matchings.filter(m => m.status === "confirmed").length
  const pendingCount = matchings.filter(m => m.status === "open" || m.status === "continued").length

  const getStatusBadge = (status: string, learnerConfirmed?: boolean, tutorConfirmed?: boolean) => {
    if (status === "confirmed" && learnerConfirmed && tutorConfirmed) {
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Confirmée</Badge>
    }
    if (status === "open" || status === "continued") {
      return <Badge variant="secondary">En attente de réponse</Badge>
    }
    return <Badge>{status}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Mises en Relation ({matchings.length})
        </CardTitle>
        <CardDescription>
          {confirmedCount} apprenants · {pendingCount} en attente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matchings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Aucune mise en relation pour le moment
              </p>
            </div>
          ) : (
            <>
              {/* Confirmed Matchings */}
              {matchings.filter(m => m.status === "confirmed" && m.learnerConfirmed && m.tutorConfirmed).length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Apprenants confirmés
                  </h3>
                  <div className="space-y-2">
                    {matchings
                      .filter(m => m.status === "confirmed" && m.learnerConfirmed && m.tutorConfirmed)
                      .map((matching) => (
                        <div
                          key={matching.id}
                          className="flex items-center justify-between rounded-lg bg-green-500/5 border border-green-500/20 p-3"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={matching.learnerName} />
                              <AvatarFallback>
                                {matching.learnerName?.charAt(0) || "A"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {matching.learnerName || "Apprenant"}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                Confirmé
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/betreuer/messages?conversation=${matching.id}`}>
                              <MessageSquare className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Pending Matchings */}
              {matchings.filter(m => m.status === "open" || m.status === "continued").length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    En attente de réponse
                  </h3>
                  <div className="space-y-2">
                    {matchings
                      .filter(m => m.status === "open" || m.status === "continued")
                      .map((matching) => (
                        <div
                          key={matching.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={matching.learnerName} />
                              <AvatarFallback>
                                {matching.learnerName?.charAt(0) || "A"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {matching.learnerName || "Apprenant"}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Il y a{" "}
                                {Math.floor(
                                  (Date.now() -
                                    (matching.contactDate?.toDate?.() || new Date(matching.contactDate)).getTime()) /
                                    (1000 * 60 * 60 * 24)
                                )}{" "}
                                jours
                              </p>
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/betreuer/messages?conversation=${matching.id}`}>
                              Répondre
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
