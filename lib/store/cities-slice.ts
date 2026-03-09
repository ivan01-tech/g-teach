import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { City, Tutor } from "@/lib/types";

export interface citiesState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: citiesState = {
  cities: [],
  loading: false,
  error: null,
};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setcities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      console.log("cities error : ", action.payload);
    },
  },
});

export const { setcities, setLoading, setError } = citiesSlice.actions;
export default citiesSlice.reducer;
