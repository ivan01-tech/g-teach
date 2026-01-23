"use client"

import { useRef } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const initialized = useRef(false)

    if (!initialized.current) {
        initialized.current = true
    }

    return <Provider store={store}>{children}</Provider>
}
