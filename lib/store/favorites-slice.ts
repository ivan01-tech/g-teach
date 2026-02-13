import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getFavorites, getCommentedProfiles, toggleFavorite as toggleFavoriteService } from "@/lib/services/favorite-service";
import type { Tutor, Review } from "@/lib/types";
import type { RootState } from "@/lib/store";
import { updateReview as updateReviewService } from "@/lib/services/review-service";
import { toSerializable } from "@/lib/serializable-utils";

export interface FavoritesState {
    favoriteTutors: Tutor[];
    commentedTutors: { tutor: Tutor; review: Review }[];
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

export const updateReviewAction = createAsyncThunk(
    "favorites/updateReview",
    async ({
        reviewId,
        tutorId,
        oldRating,
        newRating,
        comment
    }: {
        reviewId: string;
        tutorId: string;
        oldRating: number;
        newRating: number;
        comment: string;
    }, { rejectWithValue }) => {
        try {
            await updateReviewService(reviewId, tutorId, oldRating, { rating: newRating, comment });
            return { reviewId, newRating, comment };
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
            .addCase(fetchCommentedProfiles.fulfilled, (state, action: PayloadAction<{ tutor: Tutor; review: Review }[]>) => {
                state.commentedTutors = action.payload;
            })
            .addCase(updateReviewAction.fulfilled, (state, action) => {
                const { reviewId, newRating, comment } = action.payload;
                const item = state.commentedTutors.find(c => c.review.id === reviewId);
                if (item) {
                    item.review.rating = newRating;
                    item.review.comment = comment;
                    // We might need to update tutor average rating here too if we want immediate UI reflect
                    // but usually it's better to refetch or let it be slightly inconsistent until reload
                }
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
