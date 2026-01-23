import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserRole } from "@/lib/roles";
import { User } from "@/lib/types";
import {
  logout,
  signIn,
  signUp,
  updateUserProfile,
  fetchUserProfile,
} from "./thunks";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string; // Serialized date for Redux
  learningLevel?: string;
  targetExam?: string;
  specializations?: string[];
  hourlyRate?: number;
  bio?: string;
  isVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      if (action.payload) {
        state.user = {
          ...action.payload,
        };
      } else {
        state.user = null;
        state.userProfile = null;
        state.loading = false;
      }
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.userProfile = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile = { ...state.userProfile, ...action.payload };
        }
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        // state.userProfile = action.payload;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { setUser, setUserProfile, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
