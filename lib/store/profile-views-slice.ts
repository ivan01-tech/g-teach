import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import { recordProfileView, getTutorProfileViews } from "@/lib/services/profile-view-service"
import type { ProfileView } from "@/lib/types"

export interface ProfileViewsState {
    recentViews: ProfileView[]
    loading: boolean
    error: string | null
}

const initialState: ProfileViewsState = {
    recentViews: [],
    loading: false,
    error: null,
}

// Side effect: Record a profile view
export const recordProfileViewThunk = createAsyncThunk(
    "profileViews/record",
    async (
        {
            tutorId,
            viewerId,
            metadata,
        }: {
            tutorId: string
            viewerId?: string
            metadata?: { device?: string; browser?: string }
        },
        { rejectWithValue }
    ) => {
        try {
            await recordProfileView(tutorId, viewerId, metadata)
            return { success: true }
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

// Fetch profile views for dashboard
export const fetchProfileViewsThunk = createAsyncThunk(
    "profileViews/fetchRecent",
    async (tutorId: string, { rejectWithValue }) => {
        try {
            const views = await getTutorProfileViews(tutorId)
            return views
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)

const profileViewsSlice = createSlice({
    name: "profileViews",
    initialState,
    reducers: {
        clearViews: (state) => {
            state.recentViews = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfileViewsThunk.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProfileViewsThunk.fulfilled, (state, action: PayloadAction<ProfileView[]>) => {
                state.recentViews = action.payload
                state.loading = false
            })
            .addCase(fetchProfileViewsThunk.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    },
})

export const { clearViews } = profileViewsSlice.actions
export default profileViewsSlice.reducer
