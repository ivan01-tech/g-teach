"use client"

import { useState, useEffect } from "react"
import { School } from "@/lib/types"
import { getTutorSchools } from "@/lib/services/school-service"
import { useAuth } from "@/hooks/use-auth"

export function useSchools() {
  const { user } = useAuth()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadSchools = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getTutorSchools(user.uid)
        setSchools(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schools")
        console.error("Error loading schools:", err)
      } finally {
        setLoading(false)
      }
    }

    loadSchools()
  }, [user])

  const refresh = async () => {
    if (!user) return
    try {
      const data = await getTutorSchools(user.uid)
      setSchools(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh schools")
      console.error("Error refreshing schools:", err)
    }
  }

  return {
    schools,
    loading,
    error,
    refresh,
  }
}
