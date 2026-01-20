"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import type { Tutor } from "@/lib/types"

export function useTutorProfile() {
  const { user } = useAuth()
  const [tutorProfile, setTutorProfile] = useState<Tutor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setTutorProfile(null)
      setLoading(false)
      return
    }

    const tutorRef = doc(db, "tutors", user.uid)
    
    const unsubscribe = onSnapshot(
      tutorRef,
      (doc) => {
        if (doc.exists()) {
          setTutorProfile(doc.data() as Tutor)
        } else {
          setTutorProfile(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { tutorProfile, loading, error }
}
