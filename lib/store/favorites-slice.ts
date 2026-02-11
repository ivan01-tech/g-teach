import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFavorites, getCommentedProfiles, toggleFavorite as toggleFavoriteService } from "@/lib/services/favorite-service";
import type { Tutor } from "@/lib/types";
import type { RootState } from "@/lib/store";

export interface FavoritesState {
    favoriteTutors: Tutor[];
    commentedTutors: Tutor[];
    loading: boolean;
    error: string | null;
}

const initialState: FavoritesState = {
    favoriteTutors: [],
    commentedTutors: [],
    loading: false,
    error: null,
};

export const fetchFavorites = createAsyncThunk(
    "favorites/fetchFavorites",
    async (userId: string, { rejectWithValue }) => {
        try {
            return await getFavorites(userId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchCommentedProfiles = createAsyncThunk(
    "favorites/fetchCommentedProfiles",
    async (userId: string, { rejectWithValue }) => {
        try {
            return await getCommentedProfiles(userId);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleFavorite = createAsyncThunk(
    "favorites/toggleFavorite",
    async ({ userId, tutorId }: { userId: string; tutorId: string }, { rejectWithValue }) => {
        try {
            const isFavorite = await toggleFavoriteService(userId, tutorId);
            return { tutorId, isFavorite };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<Tutor[]>) => {
            state.favoriteTutors = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favoriteTutors = action.payload;
                state.loading = false;
            })
            .addCase(fetchFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCommentedProfiles.fulfilled, (state, action) => {
                state.commentedTutors = action.payload;
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                // We don't necessarily update the list here because we might not have the full tutor object
                // But for the heart icon check, we rely on the list in the user object or a simple array of IDs
                // For simplicity in this slice, we'll let the component handle the immediate UI update or refetch
            });
    },
});

export const { setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
