"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToMatchings } from "@/lib/services/matching-service"
import { setAllMatchings, setLoading, acceptMatchingAction, refuseMatchingAction } from "@/lib/store/matching-slice"
import type { Matching } from "@/lib/types"
import { Check, X } from "lucide-react"

export function TutorMatchingsCard() {
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
                    <CardTitle>Nouveaux Contacts</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </CardContent>
            </Card>
        )
    }

    const activeMatchings = matchings.filter(m => m.status === "open" || m.status === "requested")

    const handleAccept = async (id: string) => {
        await dispatch(acceptMatchingAction(id))
    }

    const handleRefuse = async (id: string) => {
        await dispatch(refuseMatchingAction(id))
    }

    if (!activeMatchings.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Nouveaux Contacts</CardTitle>
                    <CardDescription>Aucun nouveau contact en attente</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <MessageSquare className="mb-4 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Les étudiants qui vous contactent apparaîtront ici.
                    </p>
                </CardContent>
            </Card>
        )
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "requested":
                return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">À valider</Badge>
            case "open":
                return <Badge variant="secondary">Nouveau</Badge>
            case "continued":
                return <Badge variant="outline">En cours</Badge>
            case "confirmed":
                return <Badge className="bg-green-500/10 text-green-600">Confirmé</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nouveaux Contacts ({activeMatchings.length})</CardTitle>
                <CardDescription>
                    Étudiants qui souhaitent vous contacter
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activeMatchings.slice(0, 5).map((matching) => (
                        <div
                            key={matching.id}
                            className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                        {matching.learnerName?.charAt(0) || "S"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{matching.learnerName || "Étudiant"}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
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
                                {matching.status === "requested" ? (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                            onClick={() => handleAccept(matching.id)}
                                            disabled={loading}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                            onClick={() => handleRefuse(matching.id)}
                                            disabled={loading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="ghost" asChild>
                                        <Link href={`/dashboard/messages?student=${matching.learnerId}`}>
                                            <MessageSquare className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {activeMatchings.length > 5 && (
                        <Button variant="link" className="w-full" asChild>
                            <Link href="/dashboard/messages">Voir tous les messages</Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
