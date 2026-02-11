"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { fetchTutorStats } from "@/lib/store/matching-slice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import {
    generateTutorFinancialSummary,
    calculateTrustScore,
    type MonetizationTransaction
} from "@/lib/services/monetization-service";

export function TutorStatsCard() {
    const { userProfile } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const { stats, loading } = useSelector((state: RootState) => state.matching);

    const [financialSummary, setFinancialSummary] = useState<{
        totalEarnings: number;
        pendingPayments: number;
        completedTransactions: number;
    } | null>(null);

    const [trustScore, setTrustScore] = useState(0);

    useEffect(() => {
        if (userProfile && userProfile.uid) {
            dispatch(fetchTutorStats(userProfile.uid));

            // Charge le récap financier
            generateTutorFinancialSummary(userProfile.uid)
                .then(setFinancialSummary)
                .catch(console.error);
        }
    }, [userProfile, dispatch]);

    useEffect(() => {
        if (stats) {
            const score = calculateTrustScore({
                totalEarnings: financialSummary?.totalEarnings || 0,
                totalLessonsCompleted: stats.confirmed || 0,
                averageRating: 0, // À récupérer du profil tuteur
                totalStudents: stats.confirmed || 0,
            });
            setTrustScore(score);
        }
    }, [stats, financialSummary]);

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (!stats) {
        return null;
    }

    const getVerificationBadge = (score: number) => {
        if (score >= 90) return { label: "Platinum", variant: "default" as const };
        if (score >= 75) return { label: "Gold", variant: "default" as const };
        if (score >= 60) return { label: "Silver", variant: "secondary" as const };
        return { label: "Bronze", variant: "secondary" as const };
    };

    const badge = getVerificationBadge(trustScore);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Matchings */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mises en relation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalMatched}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {stats.pending} en attente
                    </p>
                </CardContent>
            </Card>

            {/* Confirmed Matches */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {stats.totalMatched > 0
                            ? Math.round((stats.confirmed / stats.totalMatched) * 100)
                            : 0}
                        % de succès
                    </p>
                </CardContent>
            </Card>

            {/* Trust Score */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Score de confiance</CardTitle>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{trustScore}/100</div>
                    <div className="mt-2 h-2 bg-slate-200 rounded overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${trustScore}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Financial Summary */}
            {financialSummary && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            €{financialSummary.totalEarnings.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {financialSummary.completedTransactions} transactions
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
