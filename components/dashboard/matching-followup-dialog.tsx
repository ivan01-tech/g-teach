"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMatchingFollowup } from "@/hooks/use-matching-followup";
import { useAuth } from "@/hooks/use-auth";
import type { MatchingStatus, Matching } from "@/lib/types";

export function MatchingFollowupDialog() {
    const { pendingMatchings, closeMatching, loading } = useMatchingFollowup();
    const { user, userProfile } = useAuth();
    const [currentMatching, setCurrentMatching] = useState<Matching | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<MatchingStatus | null>(null);

    useEffect(() => {
        if (pendingMatchings.length > 0 && !currentMatching) {
            setCurrentMatching(pendingMatchings[0]);
            setOpen(true);
        }
    }, [pendingMatchings, currentMatching]);

    if (!user || !currentMatching) return null;

    const role = userProfile?.role as 'student' | 'tutor';
    const otherPersonName = role === "student" ? currentMatching.tutorName : currentMatching.learnerName;

    const handleAction = async (status: MatchingStatus, feedback: string) => {
        await closeMatching(currentMatching.id, status, feedback);
        setOpen(false);
        setCurrentMatching(null); // Will trigger next if available
        setSelectedStatus(null);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && setOpen(false)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Suivi de mise en relation</DialogTitle>
                    <DialogDescription>
                        Il y a quelques jours, vous avez été mis en relation avec{" "}
                        <strong>{otherPersonName || "ce professionnel"}</strong>.
                        Où en est votre collaboration ?
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    {role === "student" ? (
                        <>
                            <Button
                                variant={selectedStatus === "confirmed" ? "default" : "outline"}
                                onClick={() => handleAction("confirmed", "J'ai trouvé un formateur")}
                                disabled={loading}
                                className="justify-start"
                            >
                                <span className="mr-2">✅</span>
                                J'ai trouvé un formateur
                            </Button>
                            <Button
                                variant={selectedStatus === "refused" ? "destructive" : "outline"}
                                onClick={() => handleAction("refused", "Pas intéressé")}
                                disabled={loading}
                                className="justify-start"
                            >
                                <span className="mr-2">❌</span>
                                Pas intéressé
                            </Button>
                            <Button
                                variant={selectedStatus === "continued" ? "secondary" : "outline"}
                                onClick={() => handleAction("continued", "Je continue à chercher")}
                                disabled={loading}
                                className="justify-start"
                            >
                                <span className="mr-2">🔄</span>
                                Je continue à chercher
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant={selectedStatus === "confirmed" ? "default" : "outline"}
                                onClick={() => handleAction("confirmed", "L'apprenant est devenu mon élève")}
                                disabled={loading}
                                className="justify-start"
                            >
                                <span className="mr-2">✅</span>
                                L'apprenant est devenu mon élève
                            </Button>
                            <Button
                                variant={selectedStatus === "refused" ? "destructive" : "outline"}
                                onClick={() => handleAction("refused", "Pas de collaboration")}
                                disabled={loading}
                                className="justify-start"
                            >
                                <span className="mr-2">❌</span>
                                Pas de collaboration
                            </Button>
                        </>
                    )}
                </div>
                {loading && (
                    <p className="text-sm text-muted-foreground text-center">
                        Enregistrement en cours...
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}
