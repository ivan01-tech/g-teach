import { userService } from "@/lib/services/user-service";
import { setUsers, setLoading } from "./user-slice";
import { AppDispatch } from "@/lib/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { User, VerificationStatus } from "@/lib/types";

// Standard thunk for real-time listener (returns unsubscribe)
export const initUsersListener = createAsyncThunk(
    "users/initListener",
    async (_, { dispatch }) => {
        dispatch(setLoading(true));

        return new Promise<(unsub: () => void) => void>((resolve) => {
            let isFirstSnapshot = true;
            const unsubscribe = userService.listenUsers((users) => {
                console.log("Users listener triggered:", users);
                dispatch(setUsers(users));

                if (isFirstSnapshot) {
                    isFirstSnapshot = false;
                    resolve(() => unsubscribe);
                }
            });
        });
    }
);

// Async thunks for administrative actions
export const deleteUserThunk = createAsyncThunk(
    "users/delete",
    async ({ uid, role }: { uid: string; role: string }, { rejectWithValue }) => {
        try {
            await userService.deleteUser(uid, role);
            return uid;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserThunk = createAsyncThunk(
    "users/update",
    async ({ uid, data }: { uid: string; data: Partial<User> }, { rejectWithValue }) => {
        try {
            await userService.updateUser(uid, data);
            return { uid, data };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const validateTutorThunk = createAsyncThunk(
    "users/validateTutor",
    async (
        { uid, status, message }: { uid: string; status: VerificationStatus; message?: string },
        { rejectWithValue }
    ) => {
        try {
            await userService.validateTutor(uid, status, message);
            return { uid, status, message };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
