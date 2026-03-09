import { set } from "date-fns";
import { subscribeToCities, subscribeToTutors } from "../services/tutor-service";
import { setTutors } from "../store/tutors-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setcities } from "../store/cities-slice";

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


export const listenToCities = createAsyncThunk(
  "cities/listen",
  async (_, { rejectWithValue }) => {
    try {
      const cities = subscribeToCities((data) => {
    console.log("Listening to tutors and cities...");

        setcities(data);
      });
      return cities;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
