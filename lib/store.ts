import { configureStore } from "@reduxjs/toolkit"
import authReducer from "@/app/[locale]/auth/auth-slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["auth/setUser"],
                // Ignore these field paths in all actions
                ignoredActionPaths: ["payload.createdAt"],
                // Ignore these paths in the state
                ignoredPaths: ["auth.user"],
            },
        }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
