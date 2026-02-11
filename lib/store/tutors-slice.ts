import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Tutor } from "@/lib/types";

export interface TutorsState {
  tutors: Tutor[];
  loading: boolean;
  error: string | null;
}

const initialState: TutorsState = {
  tutors: [],
  loading: false,
  error: null,
};

const tutorsSlice = createSlice({
  name: "tutors",
  initialState,
  reducers: {
    setTutors: (state, action: PayloadAction<Tutor[]>) => {
      state.tutors = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      console.log("Tutors error : ", action.payload);
    },
  },
});

export const { setTutors, setLoading, setError } = tutorsSlice.actions;
export default tutorsSlice.reducer;
