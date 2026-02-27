"use client";

import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { recordContact } from "@/lib/store/matching-slice";
import { ConnectionService } from "@/lib/services/connection.service";
import { useAuth } from "./use-auth";
import { Connection } from "@/lib/types";

interface InitiateConnectionOptions {
  subject?: string;
  proposedLessonType?: string;
  notes?: string;
}

/**
 * Hook to initiate a connection request between student and tutor
 * Creates both a Connection document and a Matching record
 */
export function useInitiateConnection() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateConnection = useCallback(
    async (
      tutorId: string,
      tutorName: string,
      options?: InitiateConnectionOptions
    ): Promise<Connection | null> => {
      if (!user) {
        setError("User not authenticated");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Create the connection
        const connection = await ConnectionService.initiateConnection(
          user.uid,
          tutorId,
          options
        );

        // Record contact for matching/engagement tracking
        await dispatch(
          recordContact({
            learnerId: user.uid,
            tutorId,
            learnerName: user.displayName || "Student",
            tutorName,
          })
        ).unwrap();

        return connection;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to initiate connection";
        setError(errorMessage);
        console.error("Error initiating connection:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, dispatch]
  );

  return {
    initiateConnection,
    loading,
    error,
  };
}
