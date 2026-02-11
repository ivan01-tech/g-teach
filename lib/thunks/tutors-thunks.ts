import { set } from "date-fns";
import { subscribeToTutors } from "../services/tutor-service";
import { setTutors } from "../store/tutors-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const listenToTutors = createAsyncThunk(
  "tutors/listen",
  async (_, { rejectWithValue }) => {
    try {
      const tutors = subscribeToTutors((data) => {
        setTutors(data);
      });
      return tutors;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
