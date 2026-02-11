import { configureStore } from "@reduxjs/toolkit"
import { listenerMiddleware } from "./middleware/listener"
import { setupEmailSideEffects } from "./middleware/email-side-effects"
import authReducer from "@/app/[locale]/auth/auth-slice"
import favoritesReducer from "./store/favorites-slice"
import matchingReducer from "./store/matching-slice"
import tutorsReducer from "./store/tutors-slice"

// Initialize side effects
setupEmailSideEffects();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        favorites: favoritesReducer,
        matching: matchingReducer,
        tutors: tutorsReducer,
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
        }).prepend(listenerMiddleware.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
