import { configureStore } from "@reduxjs/toolkit"
import { listenerMiddleware } from "./middleware/listener"
import { setupEmailSideEffects } from "./middleware/email-side-effects"
import authReducer from "@/app/[locale]/auth/auth-slice"
import favoritesReducer from "./store/favorites-slice"
import matchingReducer from "./store/matching-slice"
import tutorsReducer from "./store/tutors-slice"
import bookingsReducer from "./store/bookings-slice"
import profileViewsReducer from "./store/profile-views-slice"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        favorites: favoritesReducer,
        matching: matchingReducer,
        tutors: tutorsReducer,
        bookings: bookingsReducer,
        profileViews: profileViewsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ["auth/setUser"],
                // Ignore these field paths in all actions
                ignoredActionPaths: [
                    "payload.createdAt",
                    "payload.updatedAt",
                    "payload.contactDate",
                    "payload.acceptedAt",
                    "payload.closedAt",
                    "payload.refusedAt",
                    // For array payloads (e.g., matching lists)
                    /payload\.\d+\.createdAt/,
                    /payload\.\d+\.updatedAt/,
                    /payload\.\d+\.contactDate/,
                    /payload\.\d+\.acceptedAt/,
                    /payload\.\d+\.closedAt/,
                    /payload\.\d+\.refusedAt/,
                ],
                // Ignore these paths in the state
                ignoredPaths: [
                    "auth.user",
                    // Ignore timestamp fields in state arrays
                    /matching\.allMatchings\.\d+\.createdAt/,
                    /matching\.allMatchings\.\d+\.updatedAt/,
                    /matching\.allMatchings\.\d+\.contactDate/,
                    /matching\.allMatchings\.\d+\.acceptedAt/,
                    /matching\.allMatchings\.\d+\.closedAt/,
                    /matching\.allMatchings\.\d+\.refusedAt/,
                    /matching\.pendingMatchings\.\d+\.createdAt/,
                    /matching\.pendingMatchings\.\d+\.updatedAt/,
                    /matching\.pendingMatchings\.\d+\.contactDate/,
                    /matching\.pendingMatchings\.\d+\.acceptedAt/,
                    /matching\.pendingMatchings\.\d+\.closedAt/,
                    /matching\.pendingMatchings\.\d+\.refusedAt/,
                    /bookings\..*\.\d+\.createdAt/,
                    /bookings\..*\.\d+\.updatedAt/,
                    /tutors\..*\.\d+\.createdAt/,
                    /tutors\..*\.\d+\.updatedAt/,
                    /favorites\..*\.\d+\.createdAt/,
                    /favorites\..*\.\d+\.updatedAt/,
                    /profileViews\..*\.viewedAt/,
                    /matching.manualFollowupMatching\.contactDate/,
                    /matching.manualFollowupMatching\.acceptedAt/,
                    /matching.manualFollowupMatching\.closedAt/,
                    /matching.manualFollowupMatching\.refusedAt/,
                    /matching.manualFollowupMatching\.createdAt/,
                    /matching.manualFollowupMatching\.updatedAt/,
                    /matching.manualFollowupMatching\.contactDate/,
                    /matching.manualFollowupMatching\.acceptedAt/,
                    /matching.manualFollowupMatching\.closedAt/,
                    /matching.manualFollowupMatching\.refusedAt/,
                    /matching.manualFollowupMatching\.createdAt/,
                    /matching.manualFollowupMatching\.updatedAt/,
                ],
            },
        }).prepend(listenerMiddleware.middleware),
})


setupEmailSideEffects();

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
