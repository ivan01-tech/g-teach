"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setUser, setLoading } from "@/app/auth/auth-slice";
import { fetchUserProfile } from "@/app/auth/thunks";
import LoadingScreen from "@/components/ui/loading-screen";
import { UserRole } from "@/lib/roles";
import { User } from "@/lib/types";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state) => state.auth.loading);

    useEffect(() => {
        dispatch(setLoading(true));

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Map Firebase user to our application's User type
                const user: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || "",
                    displayName: firebaseUser.displayName || "",
                    photoURL: firebaseUser.photoURL || null,
                    role: UserRole.Student, // Default role, will be updated by fetchUserProfile
                    createdAt: new Date(firebaseUser.metadata.creationTime || "").getTime(),
                };

                dispatch(setUser(user));
                // Fetch detailed profile from Firestore
                dispatch(fetchUserProfile(firebaseUser.uid));
            } else {
                dispatch(setUser(null));
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
