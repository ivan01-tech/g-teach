"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Check, X, Calendar, User, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { subscribeToMatchings } from "@/lib/services/matching-service"
import { setAllMatchings, setLoading, acceptMatchingAction, refuseMatchingAction, setManualFollowup } from "@/lib/store/matching-slice"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function TutorMatchingsPage() {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const { allMatchings: matchings, loading } = useAppSelector((state) => state.matching)
    const [actionInProgress, setActionInProgress] = useState<string | null>(null)
    const [refusalDialogOpen, setRefusalDialogOpen] = useState(false)
    const [refusalReason, setRefusalReason] = useState("")
    const [matchingToRefuse, setMatchingToRefuse] = useState<string | null>(null)
    const [refusalError, setRefusalError] = useState("")

    useEffect(() => {
        if (!user?.uid) return

        dispatch(setLoading(true))
        const unsubscribe = subscribeToMatchings(
            user.uid,
            'tutor',
            (data) => {
                dispatch(setAllMatchings(data))
            }
        )

        return () => unsubscribe()
    }, [user?.uid, dispatch])

    const handleAccept = async (id: string) => {
        setActionInProgress(id)
        await dispatch(acceptMatchingAction(id))
        setActionInProgress(null)
    }

    const handleRefuse = (id: string) => {
        setMatchingToRefuse(id)
        setRefusalReason("")
        setRefusalError("")
        setRefusalDialogOpen(true)
    }

    const confirmRefusal = async () => {
        if (!refusalReason.trim()) {
            setRefusalError("Veuillez indiquer un motif pour le refus")
            return
        }

        if (!matchingToRefuse) return

        setActionInProgress(matchingToRefuse)
        await dispatch(refuseMatchingAction({ matchingId: matchingToRefuse, reason: refusalReason }))
        setActionInProgress(null)
        setRefusalDialogOpen(false)
        setRefusalReason("")
        setMatchingToRefuse(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "requested":
                return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">À valider</Badge>
            case "open":
                return <Badge variant="secondary">Accepté</Badge>
            case "continued":
                return <Badge variant="outline">En cours</Badge>
            case "confirmed":
                return <Badge className="bg-green-500/10 text-green-600">Confirmé</Badge>
            case "refused":
                return <Badge variant="destructive">Refusé</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const pendingMatchings = matchings.filter(m => m.status === "requested")
    const activeMatchings = matchings.filter(m => m.status === "open" || m.status === "continued")
    const closedMatchings = matchings.filter(m => m.status === "confirmed" || m.status === "refused")

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        )
    }

    const MatchingCard = ({ matching, showActions = false }: { matching: any, showActions?: boolean }) => (
        <Card key={matching.id}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback>
                                {matching.learnerName?.charAt(0) || "S"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{matching.learnerName || "Étudiant"}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3" />
                                Demande reçue le{" "}
                                {matching.contactDate
                                    ? formatDate(matching.contactDate, "fr-FR")
                                    : ""}
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
                            <p>⏳ Cet étudiant souhaite vous contacter</p>
                        )}
                        {matching.status === "open" && (
                            <p>✅ Demande acceptée - Discutez avec l'étudiant</p>
                        )}
                        {matching.status === "confirmed" && (
                            <p>🎉 Collaboration confirmée</p>
                        )}
                        {matching.status === "refused" && (
                            <p>❌ Demande refusée</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {showActions && matching.status === "requested" ? (
                            <>
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleAccept(matching.id)}
                                    disabled={actionInProgress === matching.id || loading}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Accepter
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleRefuse(matching.id)}
                                    disabled={actionInProgress === matching.id || loading}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Refuser
                                </Button>
                            </>
                        ) : (
                            matching.status !== "refused" && matching.status !== "requested" && (
                                <>
                                    <Button size="sm" asChild>
                                        <Link href={`/betreuer/messages?student=${matching.learnerId}`}>
                                            <MessageSquare className="mr-2 h-4 w-4" />
                                            Discuter
                                        </Link>
                                    </Button>
                                    {(matching.status === "open" || matching.status === "continued") && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => dispatch(setManualFollowup(matching))}
                                        >
                                            <Clock className="mr-2 h-4 w-4" />
                                            Suivi
                                        </Button>
                                    )}
                                </>
                            )
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Demandes de Contact</h1>
                <p className="text-muted-foreground">
                    Gérez les demandes de contact de vos futurs élèves
                </p>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="pending">
                        À valider ({pendingMatchings.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                        Actifs ({activeMatchings.length})
                    </TabsTrigger>
                    <TabsTrigger value="closed">
                        Terminés ({closedMatchings.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    {pendingMatchings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <User className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">Aucune demande en attente</h3>
                                <p className="text-sm text-muted-foreground">
                                    Les nouvelles demandes de contact apparaîtront ici
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pendingMatchings.map((matching) => (
                                <MatchingCard key={matching.id} matching={matching} showActions={true} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    {activeMatchings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">Aucun contact actif</h3>
                                <p className="text-sm text-muted-foreground">
                                    Vos contacts acceptés apparaîtront ici
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activeMatchings.map((matching) => (
                                <MatchingCard key={matching.id} matching={matching} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="closed" className="mt-6">
                    {closedMatchings.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Check className="mb-4 h-12 w-12 text-muted-foreground" />
                                <h3 className="mb-2 text-lg font-semibold">Aucun contact terminé</h3>
                                <p className="text-sm text-muted-foreground">
                                    L'historique de vos contacts apparaîtra ici
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {closedMatchings.map((matching) => (
                                <MatchingCard key={matching.id} matching={matching} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Refusal Dialog */}
            <Dialog open={refusalDialogOpen} onOpenChange={setRefusalDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refuser la demande de contact</DialogTitle>
                        <DialogDescription>
                            Veuillez indiquer le motif du refus. L'étudiant recevra un email avec votre explication.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Motif du refus *</Label>
                            <Textarea
                                id="reason"
                                placeholder="Exemple: Je ne suis pas disponible pour le moment, Mon emploi du temps est plein..."
                                value={refusalReason}
                                onChange={(e) => {
                                    setRefusalReason(e.target.value)
                                    if (refusalError) setRefusalError("")
                                }}
                                className={refusalError ? "border-destructive" : ""}
                                rows={4}
                            />
                            {refusalError && (
                                <p className="text-sm text-destructive">{refusalError}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRefusalDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmRefusal}
                            disabled={actionInProgress !== null}
                        >
                            {actionInProgress ? "Envoi..." : "Confirmer le refus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
