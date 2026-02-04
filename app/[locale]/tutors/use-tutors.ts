"use client";

import { useState, useEffect } from "react";
import { getTutors } from "@/lib/tutor-service";
import type { Tutor } from "@/lib/types";

export function useTutors() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTutors() {
            try {
                setLoading(true);
                const data = await getTutors();
                setTutors(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching tutors:", err);
                setError("Failed to load tutors. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchTutors();
    }, []);

    return { tutors, loading, error };
}
