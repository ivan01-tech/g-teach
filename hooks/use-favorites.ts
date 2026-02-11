"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { toggleFavorite as toggleFavoriteThunk, fetchFavorites, fetchCommentedProfiles } from "@/lib/store/favorites-slice";
import { useAuth } from "./use-auth";
import { useToast } from "./use-toast";

export function useFavorites() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const { toast } = useToast();
    const { favoriteTutors, commentedTutors, loading, error } = useSelector((state: RootState) => state.favorites);

    // Check if a tutor is in favorites using the store's list
    // In a real app, we might want a more efficient way (like a Set of IDs)
    const isFavorite = useCallback((tutorId: string) => {
        // If user object from useAuth has favorites, use it
        if (user && 'favorites' in user) {
            return (user.favorites as string[] || []).includes(tutorId);
        }
        // Fallback to favoriteTutors in state
        return favoriteTutors.some(t => t.uid === tutorId);
    }, [user, favoriteTutors]);

    const handleToggleFavorite = useCallback(async (tutorId: string) => {
        if (!user) {
            toast({
                title: "Connexion requise",
                description: "Veuillez vous connecter pour ajouter des favoris.",
                variant: "destructive",
            });
            return;
        }

        try {
            await dispatch(toggleFavoriteThunk({ userId: user.uid, tutorId })).unwrap();
            // We might want to refetch favorites or update the user object in auth slice
            // For now, let's assume the slice update or a refetch is needed if we want immediate UI update in detailed lists
        } catch (err: any) {
            toast({
                title: "Erreur",
                description: err || "Impossible de mettre à jour les favoris.",
                variant: "destructive",
            });
        }
    }, [user, dispatch, toast]);

    const refreshData = useCallback(() => {
        if (user) {
            dispatch(fetchFavorites(user.uid));
            dispatch(fetchCommentedProfiles(user.uid));
        }
    }, [user, dispatch]);

    return {
        favoriteTutors,
        commentedTutors,
        loading,
        error,
        isFavorite,
        toggleFavorite: handleToggleFavorite,
        refreshFavoritesDashboard: refreshData,
    };
}
