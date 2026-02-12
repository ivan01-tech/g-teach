"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Clock, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToMatchings } from "@/lib/services/matching-service"
import { setAllMatchings, setLoading } from "@/lib/store/matching-slice"
import { formatDate } from "@/lib/utils"

export default function StudentMatchingsPage() {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const { allMatchings: matchings, loading } = useAppSelector((state) => state.matching)

    useEffect(() => {
        if (!user?.uid) return

        dispatch(setLoading(true))
        const unsubscribe = subscribeToMatchings(
            user.uid,
            'student',
            (data) => {
                dispatch(setAllMatchings(data))
            }
        )

        return () => unsubscribe()
    }, [user?.uid, dispatch])

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

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Mes Demandes de Contact</h1>
                <p className="text-muted-foreground">
                    Gérez vos demandes de contact avec les tuteurs
                </p>
            </div>

            {matchings.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">Aucune demande de contact</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Commencez par contacter un tuteur pour débuter votre apprentissage
                        </p>
                        <Button asChild>
                            <Link href="/tutors">Parcourir les tuteurs</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {matchings.map((matching) => (
                        <Card key={matching.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src="" alt={matching.tutorName} />
                                            <AvatarFallback>
                                                {matching.tutorName?.charAt(0) || "T"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{matching.tutorName || "Tuteur"}</CardTitle>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                Contacté le{" "}
                                                {matching.contactDate
                                                    ? formatDate(matching.contactDate)
                                                    : 0}{" "}
                                        </CardDescription>
                                        </div>
                                    </div>
                                    {getStatusBadge(matching.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-muted-foreground">
                                        {matching.status === "requested" && (
                                            <p>⏳ En attente que le tuteur valide votre demande</p>
                                        )}
                                        {matching.status === "open" && (
                                            <p>✅ Vous pouvez maintenant discuter avec ce tuteur</p>
                                        )}
                                        {matching.status === "confirmed" && (
                                            <p>🎉 Collaboration confirmée</p>
                                        )}
                                        {matching.status === "refused" && (
                                            <p>❌ Le tuteur a refusé votre demande</p>
                                        )}
                                        {matching.status === "continued" && (
                                            <p>🔍 Recherche toujours en cours</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        {matching.status !== "requested" && matching.status !== "refused" && (
                                            <Button size="sm" asChild>
                                                <Link href={`/dashboard/messages?tutor=${matching.tutorId}`}>
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Discuter
                                                </Link>
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/tutors/${matching.tutorId}`}>
                                                Voir le profil
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
