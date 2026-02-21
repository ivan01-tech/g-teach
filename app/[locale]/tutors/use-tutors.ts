"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { subscribeToTutors } from "@/lib/services/tutor-service";
import { setTutors, setLoading, setError } from "@/lib/store/tutors-slice";
import { AppDispatch } from "@/lib/store";
import { useAppSelector } from "@/hooks/redux-store-hooks";

export function useTutors() {
    const dispatch = useDispatch<AppDispatch>();
    const { tutors, loading, error } = useAppSelector((state) => state.tutors);

    useEffect(() => {
        dispatch(setLoading(true));
        const unsubscribe = subscribeToTutors((data) => {
            dispatch(setTutors(data));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return { tutors, loading, error };
}
