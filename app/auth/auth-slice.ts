import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { UserRole } from "@/lib/roles"
import { User } from "@/lib/types"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: UserRole
  createdAt: string // Serialized date for Redux
  learningLevel?: string
  targetExam?: string
  specializations?: string[]
  hourlyRate?: number
  bio?: string
  isVerified?: boolean
}

export interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  userProfile: null,
  loading: true,
  error: null,
}

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    { email, password, name, role }: { email: string; password: string; name: string; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })

      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", user.uid), {
        ...profile,
        createdAt: serverTimestamp(),
      })

      return profile
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await signOut(auth)
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const resetPassword = createAsyncThunk("auth/resetPassword", async (email: string, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data: Partial<UserProfile>, { getState, rejectWithValue }) => {
    const { auth: authState } = getState() as { auth: AuthState }
    if (!authState.user) return rejectWithValue("No user logged in")

    try {
      await setDoc(doc(db, "users", authState.user.uid), data, { merge: true })

      if (data.displayName) {
        const currentUser = auth.currentUser
        if (currentUser) {
          await updateProfile(currentUser, { displayName: data.displayName })
        }
      }

      return data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
      if (action.payload) {
        state.user = {
          uid: action.payload.uid,
          createdAt: new Date(action.payload.metadata.creationTime || "").getTime(),
          displayName: action.payload.displayName || "",
          email: action.payload.email || "",
          role: UserRole.Student,
          photoURL: action.payload.photoURL || undefined,
        }
      } else {
        state.user = null
        state.userProfile = null
      }
      state.loading = false
    },
    setUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.userProfile = action.payload
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.userProfile = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (state.userProfile) {
          state.userProfile = { ...state.userProfile, ...action.payload }
        }
      })
  },
})

export const { setUser, setUserProfile, setLoading, setError } = authSlice.actions
export default authSlice.reducer