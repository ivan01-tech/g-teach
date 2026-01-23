"use client"

import { useRef, useEffect } from "react"
import { Provider } from "react-redux"
import { store, type RootState } from "@/lib/store"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { setUser, setUserProfile, setLoading } from "@/app/auth/auth-slice"

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false)

    if (!initialized.current) {
        // We can't really "initialize" the store with data here easily for onAuthStateChanged
        // because it's async, but we can sets up the listener.
        initialized.current = true
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            store.dispatch(setUser(user))

            if (user) {
                try {
                    const profileDoc = await getDoc(doc(db, "users", user.uid))
                    if (profileDoc.exists()) {
                        store.dispatch(setUserProfile(profileDoc.data() as any))
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error)
                }
            } else {
                store.dispatch(setUserProfile(null))
            }
            store.dispatch(setLoading(false))
        })

        return () => unsubscribe()
    }, [])

    return <Provider store={store}>{children}</Provider>
}
