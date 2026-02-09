import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/lib/types";
import { initUsersListener } from "./users-thunks";

interface UserState {
    users: User[];
    loading: boolean;
}

const initialState: UserState = {
    users: [],
    loading: true,
};

export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            console.log("Users set:", action.payload);
            state.users = action.payload;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(initUsersListener.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(initUsersListener.rejected, (state) => {
                state.loading = false;
            });
    }
});

export const { setUsers, setLoading } = userSlice.actions;
export default userSlice.reducer;