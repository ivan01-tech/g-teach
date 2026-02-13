"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { fetchPendingMatchings, closeMatchingAction } from "@/lib/store/matching-slice"
import { MatchingStatus, Matching } from "@/lib/types"
import { CheckCircle, XCircle, Search, MessageSquare, User } from "lucide-react"
import { UserRole } from "@/lib/roles"

export function MatchingFollowupDialog() {
    const { user, userProfile } = useAuth()
    const dispatch = useAppDispatch()
    const { pendingMatchings, manualFollowupMatching, loading } = useAppSelector((state) => state.matching)
    const [open, setOpen] = useState(false)
    const [currentMatching, setCurrentMatching] = useState<Matching | null>(null)

    useEffect(() => {
        if (user?.uid && userProfile?.role) {
            dispatch(fetchPendingMatchings({
                userId: user.uid,
                role: userProfile.role as 'student' | 'tutor'
            }))
        }
    }, [user?.uid, userProfile?.role, dispatch])

    useEffect(() => {
        // Priorité au suivi déclenché manuellement
        if (manualFollowupMatching) {
            setCurrentMatching(manualFollowupMatching)
            setOpen(true)
        }
        // Sinon, on suit la liste automatique
        else if (pendingMatchings.length > 0 && !currentMatching) {
            setCurrentMatching(pendingMatchings[0])
            setOpen(true)
        } else if (pendingMatchings.length === 0 && !manualFollowupMatching) {
            setOpen(false)
            setCurrentMatching(null)
        }
    }, [pendingMatchings, currentMatching, manualFollowupMatching])

    const handleAction = async (status: MatchingStatus) => {
        if (!currentMatching || !userProfile?.role) return

        await dispatch(closeMatchingAction({
            matchingId: currentMatching.id,
            status,
            role: userProfile.role as 'student' | 'tutor'
        }))

        // Clear current to trigger next one if any
        setCurrentMatching(null)
    }

    const handleOpenChange = (val: boolean) => {
        if (!val) {
            // Si on ferme, et que c'était un suivi manuel, on nettoie le state Redux
            if (manualFollowupMatching) {
                dispatch({ type: "matching/setManualFollowup", payload: null })
            }
            setCurrentMatching(null)
        }
        setOpen(val)
    }

    if (!currentMatching) return null

    const isStudent = user?.role === UserRole.Student

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Suivi de votre mise en relation
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Il y a quelques jours, vous avez été mis en relation avec{" "}
                        <span className="font-semibold text-foreground">
                            {isStudent ? currentMatching.tutorName : currentMatching.learnerName}
                        </span>.
                        Où en est votre collaboration ?
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {isStudent ? (
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                variant="outline"
                                className="justify-start gap-3 h-auto py-3 px-4 border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleAction("confirmed")}
                                disabled={loading}
                            >
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div className="text-left">
                                    <p className="font-semibold">J'ai trouvé un formateur</p>
                                    <p className="text-xs text-muted-foreground">Nous avons commencé les cours ensemble.</p>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="justify-start gap-3 h-auto py-3 px-4 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleAction("refused")}
                                disabled={loading}
                            >
                                <XCircle className="h-5 w-5 text-red-500" />
                                <div className="text-left">
                                    <p className="font-semibold">Pas intéressé</p>
                                    <p className="text-xs text-muted-foreground">Le profil ne correspondait pas à mes besoins.</p>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="justify-start gap-3 h-auto py-3 px-4 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleAction("continued")}
                                disabled={loading}
                            >
                                <Search className="h-5 w-5 text-blue-500" />
                                <div className="text-left">
                                    <p className="font-semibold">Je continue à chercher</p>
                                    <p className="text-xs text-muted-foreground">La discussion est toujours en cours.</p>
                                </div>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            <Button
                                variant="outline"
                                className="justify-start gap-3 h-auto py-3 px-4 border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleAction("confirmed")}
                                disabled={loading}
                            >
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div className="text-left">
                                    <p className="font-semibold">L'apprenant est devenu mon élève</p>
                                    <p className="text-xs text-muted-foreground">Collaboration confirmée.</p>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="justify-start gap-3 h-auto py-3 px-4 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleAction("refused")}
                                disabled={loading}
                            >
                                <XCircle className="h-5 w-5 text-red-500" />
                                <div className="text-left">
                                    <p className="font-semibold">Pas de collaboration</p>
                                    <p className="text-xs text-muted-foreground">Nous n'avons pas donné suite.</p>
                                </div>
                            </Button>
                        </div>
                    )}
                </div>
                <p className="text-[10px] text-center text-muted-foreground">
                    Ces informations nous aident à améliorer la mise en relation et à valoriser votre profil.
                </p>
            </DialogContent>
        </Dialog>
    )
}
