"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks";
import { setUser, setLoading, setError } from "@/app/[locale]/auth/auth-slice";
import { fetchUserProfile } from "@/app/[locale]/auth/thunks";
import LoadingScreen from "@/components/ui/loading-screen";
import { User } from "@/lib/types";
import { firebaseCollections } from "@/lib/collections";
import { doc, getDoc } from "firebase/firestore";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);

    useEffect(() => {
        dispatch(setLoading(true));

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Recherche le document utilisateur dans Firestore pour obtenir le vrai rôle
                    const userDocRef = doc(db, firebaseCollections.users, firebaseUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        // Utiliser les données de Firestore (avec le vrai rôle)
                        const firestoreData = userDocSnap.data();
                        const user: User = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || "",
                            displayName: firebaseUser.displayName || firestoreData?.displayName || "",
                            photoURL: firebaseUser.photoURL || firestoreData?.photoURL || null,
                            role: firestoreData?.role, // Utiliser le rôle de Firestore
                            favorites: firestoreData?.favorites || [],
                            createdAt: firestoreData?.createdAt?.toMillis?.() || new Date(firebaseUser.metadata.creationTime || "").getTime(),
                        };

                        dispatch(setUser(user));
                        dispatch(setError(null)); // Clear any previous errors
                        // Fetch detailed profile from Firestore pour mettre à jour les autres données
                        dispatch(fetchUserProfile(firebaseUser.uid));
                    } else {
                        // Le compte n'existe pas dans Firestore
                        // Signaler l'erreur et déconnecter l'utilisateur
                        const errorMessage = "Votre compte n'existe pas dans notre base de données. Veuillez vous réinscrire.";
                        dispatch(setError(errorMessage));
                        dispatch(setUser(null));
                        
                        // Déconnecter l'utilisateur de Firebase
                        try {
                            await signOut(auth);
                        } catch (signOutError) {
                            console.error("Error signing out:", signOutError);
                        }
                        
                        dispatch(setLoading(false));
                    }
                } catch (error) {
                    console.error("Error fetching user account:", error);
                    
                    // En cas d'erreur, déconnecter l'utilisateur
                    const errorMessage = "Erreur lors de la vérification de votre compte. Veuillez réessayer.";
                    dispatch(setError(errorMessage));
                    dispatch(setUser(null));
                    
                    try {
                        await signOut(auth);
                    } catch (signOutError) {
                        console.error("Error signing out:", signOutError);
                    }
                    
                    dispatch(setLoading(false));
                }
            } else {
                dispatch(setUser(null));
                dispatch(setError(null)); // Clear error when user logs out
                dispatch(setLoading(false));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
        return <LoadingScreen />;
    }

    return <>{children}</>;
}
