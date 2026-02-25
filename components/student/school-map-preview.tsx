"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import type { Map } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface SchoolMapPreviewProps {
  schoolName: string
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  city?: string
  country?: string
}

export function SchoolMapPreview({
  schoolName,
  latitude,
  longitude,
  address,
  city,
  country,
}: SchoolMapPreviewProps) {
  const mapRef = useRef<Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only show map if we have coordinates
    if (!latitude || !longitude || !containerRef.current) return

    // Create map
    const map = L.map(containerRef.current).setView([latitude, longitude], 13)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add marker
    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<strong>${schoolName}</strong><br/>${address || `${city}, ${country}`}`)
      .openPopup()

    mapRef.current = map

    return () => {
      map.remove()
    }
  }, [latitude, longitude, schoolName, address, city, country])

  // Don't render anything if no coordinates
  if (!latitude || !longitude) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-blue-600" />
          {schoolName} - Location
        </CardTitle>
        <CardDescription>
          {address || `${city}, ${country}`}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          ref={containerRef}
          className="h-80 w-full rounded-lg border border-blue-200"
          style={{ minHeight: "320px" }}
        />
      </CardContent>
    </Card>
  )
}
