import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { updateBookingStatus as updateBookingStatusService } from "@/lib/services/booking-service";
import type { Booking } from "@/lib/types";

export interface BookingsState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingsState = {
    bookings: [],
    loading: false,
    error: null,
};

export const updateBookingStatusAction = createAsyncThunk(
    "bookings/updateStatus",
    async ({ bookingId, status }: { bookingId: string; status: Booking["status"] }, { rejectWithValue }) => {
        try {
            await updateBookingStatusService(bookingId, status);
            return { bookingId, status };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const bookingsSlice = createSlice({
    name: "bookings",
    initialState,
    reducers: {
        setBookings: (state, action: PayloadAction<Booking[]>) => {
            state.bookings = action.payload;
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateBookingStatusAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBookingStatusAction.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateBookingStatusAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setBookings, setLoading, setError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
