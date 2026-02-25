"use client"

import { useState, useEffect } from "react"
import { School } from "@/lib/types"
import { getCities, addCity } from "@/lib/services/city-service"
import type { City } from "@/lib/types"

export function useSchoolFormEdit(school?: School) {
  const [cities, setCities] = useState<City[]>([])
  const [fetchingCities, setFetchingCities] = useState(false)

  const [formData, setFormData] = useState({
    name: school?.name || "",
    description: school?.description || "",
    about: school?.about || "",
    logoUrl: school?.logo || "",
    locationCity: school?.location.city || "",
    locationCountry: "Cameroon",
    locationAddress: school?.location.address || "",
    locationLatitude: school?.location.latitude,
    locationLongitude: school?.location.longitude,
    exams: school?.exams || [],
    levels: school?.levels || [],
    phone: school?.phone || "",
    email: school?.email || "",
    website: school?.website || "",
    googleMapsUrl: school?.googleMapsUrl || "",
    facebookUrl: school?.socialMedia?.facebook || "",
    twitterUrl: school?.socialMedia?.twitter || "",
    instagramUrl: school?.socialMedia?.instagram || "",
    linkedinUrl: school?.socialMedia?.linkedin || "",
  })

  // Load cities on mount
  useEffect(() => {
    loadCities()
  }, [])

  // Update form data when school changes
  useEffect(() => {
    setFormData({
      name: school?.name || "",
      description: school?.description || "",
      about: school?.about || "",
      logoUrl: school?.logo || "",
      locationCity: school?.location.city || "",
      locationCountry: "Cameroon",
      locationAddress: school?.location.address || "",
      locationLatitude: school?.location.latitude || undefined,
      locationLongitude: school?.location.longitude || undefined,
      exams: school?.exams || [],
      levels: school?.levels || [],
      phone: school?.phone || "",
      email: school?.email || "",
      website: school?.website || "",
      googleMapsUrl: school?.googleMapsUrl || "",
      facebookUrl: school?.socialMedia?.facebook || "",
      twitterUrl: school?.socialMedia?.twitter || "",
      instagramUrl: school?.socialMedia?.instagram || "",
      linkedinUrl: school?.socialMedia?.linkedin || "",
    })
  }, [school])

  const loadCities = async () => {
    try {
      setFetchingCities(true)
      const data = await getCities()
      setCities(data)
    } catch (error) {
      console.error("Error loading cities:", error)
    } finally {
      setFetchingCities(false)
    }
  }

  const handleCreateCity = async (cityName: string) => {
    try {
      setFetchingCities(true)
      const newCityId = await addCity(cityName)
      const newCity: City = { id: newCityId, name: cityName }
      setCities((prev) => [newCity, ...prev])
      setFormData((prev) => ({ ...prev, locationCity: cityName }))
    } catch (error) {
      console.error("Error creating city:", error)
    } finally {
      setFetchingCities(false)
    }
  }

  const toggleExam = (examValue: string) => {
    setFormData((prev) => ({
      ...prev,
      exams: prev.exams.includes(examValue)
        ? prev.exams.filter((e) => e !== examValue)
        : [...prev.exams, examValue],
    }))
  }

  const toggleLevel = (levelValue: string) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.includes(levelValue)
        ? prev.levels.filter((l) => l !== levelValue)
        : [...prev.levels, levelValue],
    }))
  }

  return {
    formData,
    setFormData,
    cities,
    fetchingCities,
    handleCreateCity,
    toggleExam,
    toggleLevel,
  }
}
