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
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserRole } from "@/lib/roles";
import { AuthState, UserProfile } from "./auth-slice";
import { User } from "@/lib/types";
import { firebaseCollections } from "@/lib/collections";

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (uid: string, { rejectWithValue }) => {
    try {
      const docRef = doc(db, firebaseCollections.users, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt:
            data.createdAt?.toDate?.()?.getTime() ||
            data.createdAt ||
            new Date().getTime(),
        } as User;
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password, }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      name,
      role,
    }: { email: string; password: string; name: string; role: UserRole },
    { rejectWithValue },
  ) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      //   create user account

      const profile: User = {
        uid: user.uid,
        photoURL: null,
        email: user.email!,
        displayName: name,
        role,
        createdAt: new Date().getTime(),
      };

      await setDoc(doc(db, firebaseCollections.users, user.uid), {
        ...profile,
      });


      if (role === UserRole.Student) {
        await setDoc(doc(db, firebaseCollections.students, user.uid), {
          ...profile,
        });
      } else {
        await setDoc(doc(db, firebaseCollections.tutors, user.uid), {
          ...profile,
        });
      }


      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (data: Partial<UserProfile>, { getState, rejectWithValue }) => {
    const { auth: authState } = getState() as { auth: AuthState };
    if (!authState.user) return rejectWithValue("No user logged in");

    try {
      await setDoc(doc(db, "users", authState.user.uid), data, { merge: true });

      if (data.displayName) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updateProfile(currentUser, { displayName: data.displayName });
        }
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
