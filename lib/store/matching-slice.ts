import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getPendingMatchingsForUser,
  updateMatchingStatus,
  initiateMatching as initiateMatchingService,
  acceptMatching as acceptMatchingService,
  refuseMatching as refuseMatchingService,
  getTutorMatchingStats,
  sendReminderForExpiredMatchings,
} from "@/lib/services/matching-service";
import type { Matching, MatchingStatus } from "@/lib/types";

export interface MatchingState {
  pendingMatchings: Matching[];
  allMatchings: Matching[];
  loading: boolean;
  error: string | null;
  stats: {
    totalMatched: number;
    confirmed: number;
    refused: number;
    pending: number;
  } | null;
  manualFollowupMatching: Matching | null;
}

const initialState: MatchingState = {
  pendingMatchings: [],
  allMatchings: [],
  loading: false,
  error: null,
  stats: null,
  manualFollowupMatching: null,
};

/**
 * Récupère les matchings en attente (expirés et en attente de réponse)
 */
export const fetchPendingMatchings = createAsyncThunk(
  "matching/fetchPending",
  async (
    { userId, role }: { userId: string; role: "student" | "tutor" },
    { rejectWithValue },
  ) => {
    try {
      return await getPendingMatchingsForUser(userId, role, {
        includeRequested: false,
        now: new Date(),

      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Clôture un matching avec confirmation de l'utilisateur
 */
export const closeMatchingAction = createAsyncThunk(
  "matching/close",
  async (
    {
      matchingId,
      status,
      feedback,
      role,
    }: {
      matchingId: string;
      status: MatchingStatus;
      feedback?: string;
      role: "student" | "tutor";
    },
    { rejectWithValue },
  ) => {
    try {
      await updateMatchingStatus(matchingId, status, feedback, role);
      return { matchingId, status, role };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Enregistre un nouveau contact entre apprenant et tuteur
 */
export const recordContact = createAsyncThunk(
  "matching/recordContact",
  async (
    {
      learnerId,
      tutorId,
      learnerName,
      tutorName,
    }: {
      learnerId: string;
      tutorId: string;
      learnerName: string;
      tutorName: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await initiateMatchingService({
        learnerId,
        tutorId,
        learnerName,
        tutorName,
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Charger les statistiques de matching pour un tuteur
 */
export const fetchTutorStats = createAsyncThunk(
  "matching/fetchTutorStats",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      return await getTutorMatchingStats(tutorId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Déclenche les rappels automatiques pour les matchings expirés
 * (À appeler via un job/cron ou Cloud Function)
 */
export const triggerReminders = createAsyncThunk(
  "matching/triggerReminders",
  async (_, { rejectWithValue }) => {
    try {
      await sendReminderForExpiredMatchings();
      return "Reminders sent";
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Accepter une demande de contact (Tuteur uniquement)
 */
export const acceptMatchingAction = createAsyncThunk(
  "matching/accept",
  async (matchingId: string, { rejectWithValue }) => {
    try {
      await acceptMatchingService(matchingId);
      return matchingId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * Refuser une demande de contact (Tuteur uniquement)
 */
export const refuseMatchingAction = createAsyncThunk(
  "matching/refuse",
  async (
    { matchingId, reason }: { matchingId: string; reason: string },
    { rejectWithValue },
  ) => {
    try {
      await refuseMatchingService(matchingId, reason);
      return { matchingId, reason };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const matchingSlice = createSlice({
  name: "matching",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetMatchingState: (state) => {
      state.pendingMatchings = [];
      state.allMatchings = [];
      state.stats = null;
    },
    setAllMatchings: (state, action: PayloadAction<Matching[]>) => {
      state.allMatchings = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setManualFollowup: (state, action: PayloadAction<Matching | null>) => {
      state.manualFollowupMatching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pending Matchings
      .addCase(fetchPendingMatchings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPendingMatchings.fulfilled,
        (state, action: PayloadAction<Matching[]>) => {
          state.pendingMatchings = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchPendingMatchings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Close Matching
      .addCase(closeMatchingAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closeMatchingAction.fulfilled, (state, action) => {
        const { matchingId, status } = action.payload;
        // Retire le matching de la liste des attentes
        state.pendingMatchings = state.pendingMatchings.filter(
          (m) => m.id !== matchingId,
        );

        // Met à jour dans la liste globale si présent
        const matchingInList = state.allMatchings.find(
          (m) => m.id === matchingId,
        );
        if (matchingInList) {
          matchingInList.status = status;
        }

        // Si c'était un suivi manuel, on le nettoie
        if (state.manualFollowupMatching?.id === matchingId) {
          state.manualFollowupMatching = null;
        }

        state.loading = false;
      })
      .addCase(closeMatchingAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Record Contact
      .addCase(recordContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recordContact.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(recordContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Tutor Stats
      .addCase(fetchTutorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchTutorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(triggerReminders.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Accept Matching
      .addCase(acceptMatchingAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptMatchingAction.fulfilled, (state, action) => {
        const matchingId = action.payload;
        const matching = state.allMatchings.find((m) => m.id === matchingId);
        if (matching) {
          matching.status = "open";
        }
        state.loading = false;
      })
      .addCase(acceptMatchingAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Refuse Matching
      .addCase(refuseMatchingAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refuseMatchingAction.fulfilled, (state, action) => {
        const { matchingId } = action.payload;
        const matching = state.allMatchings.find((m) => m.id === matchingId);
        if (matching) {
          matching.status = "refused";
        }
        state.loading = false;
      })
      .addCase(refuseMatchingAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  resetMatchingState,
  setAllMatchings,
  setLoading,
  setError,
  setManualFollowup,
} = matchingSlice.actions;

export default matchingSlice.reducer;
