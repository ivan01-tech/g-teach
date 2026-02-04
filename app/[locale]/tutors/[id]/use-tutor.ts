"use client";

import { useState, useEffect } from "react";
import { getTutorProfile } from "@/lib/tutor-service";
import type { Tutor } from "@/lib/types";

export function useTutor(id: string) {
    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTutor() {
            if (!id) return;

            try {
                setLoading(true);
                const data = await getTutorProfile(id);
                if (data) {
                    setTutor(data);
                } else {
                    setError("Tutor not found.");
                }
            } catch (err) {
                console.error("Error fetching tutor:", err);
                setError("Failed to load tutor details.");
            } finally {
                setLoading(false);
            }
        }

        fetchTutor();
    }, [id]);

    return { tutor, loading, error };
}
