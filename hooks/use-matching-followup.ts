"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { 
    fetchPendingMatchings, 
    closeMatchingAction,
    fetchTutorStats,
    triggerReminders
} from "@/lib/store/matching-slice";
import { useAuth } from "./use-auth";
import type { MatchingStatus } from "@/lib/types";

/**
 * Hook pour gérer le suivi des mises en relation
 * Récupère les matchings en attente, gère les confirmations et les statistiques
 */
export function useMatchingFollowup() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { 
        pendingMatchings, 
        loading, 
        error, 
        stats 
    } = useSelector((state: RootState) => state.matching);

    /**
     * Rafraît la liste des matchings en attente
     */
    const refreshPending = useCallback(() => {
        if (user && user.uid) {
            dispatch(fetchPendingMatchings({
                userId: user.uid,
                role: user.role as 'student' | 'tutor'
            }));
        }
    }, [user, dispatch]);

    /**
     * Charge les statistiques pour un tuteur
     */
    const loadStats = useCallback((tutorId: string) => {
        dispatch(fetchTutorStats(tutorId));
    }, [dispatch]);

    /**
     * Clôture un matching avec confirmation de l'utilisateur
     */
    const closeMatching = async (
        matchingId: string, 
        status: MatchingStatus, 
        feedback?: string
    ) => {
        if (!user) return;
        
        try {
            await dispatch(closeMatchingAction({
                matchingId,
                status,
                feedback,
                role: user.role as 'student' | 'tutor'
            })).unwrap();
            
            // Rafraît la liste après update
            refreshPending();
        } catch (err) {
            console.error("Error closing matching:", err);
            throw err;
        }
    };

    /**
     * Déclenche les rappels (utile pour les tests ou les admins)
     */
    const triggerRemindersManually = useCallback(async () => {
        await dispatch(triggerReminders()).unwrap();
    }, [dispatch]);

    useEffect(() => {
        refreshPending();
    }, [refreshPending]);

    // Periodically refresh pending matchings so that time-based followups
    // (e.g. followupAt after 5 minutes) are detected without a full page reload.
    useEffect(() => {
        const interval = setInterval(() => {
            refreshPending();
        }, 30_000); // every 30s

        return () => clearInterval(interval);
    }, [refreshPending]);

    return {
        pendingMatchings,
        loading,
        error,
        stats,
        closeMatching,
        refreshPending,
        loadStats,
        triggerRemindersManually
    };
}
