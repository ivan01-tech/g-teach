"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import type { Map, Marker } from "leaflet"
import "leaflet/dist/leaflet.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
import { MapPin, Trash2, Search, AlertCircle } from "lucide-react"

interface MapLocationPickerProps {
  address: string
  latitude?: number | null
  longitude?: number | null
  onLocationSelect: (data: {
    latitude: number
    longitude: number
    address: string
  }) => void
  disabled?: boolean
}

// Cameroon bounds for initial map view
const CAMEROON_CENTER: [number, number] = [3.848, 11.5021]
const CAMEROON_BOUNDS = L.latLngBounds(
  L.latLng(1.0, 8.0), // Southwest
  L.latLng(12.0, 16.0) // Northeast
)

export function MapLocationPicker({
  address,
  latitude,
  longitude,
  onLocationSelect,
  disabled = false,
}: MapLocationPickerProps) {
  const t = useTranslations()
  const mapRef = useRef<Map | null>(null)
  const markerRef = useRef<Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(latitude && longitude ? { lat: latitude, lng: longitude } : null)
  const [searchAddress, setSearchAddress] = useState(address)
  const [mapInitialized, setMapInitialized] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapInitialized) return

    // Create map
    const map = L.map(containerRef.current).setView(CAMEROON_CENTER, 6)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Add initial marker if location is set
    if (latitude && longitude) {
      const marker = L.marker([latitude, longitude], {
        draggable: !disabled,
      })
        .addTo(map)
        .bindPopup(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)

      markerRef.current = marker

      // Update on drag
      if (!disabled) {
        marker.on("dragend", () => {
          const pos = marker.getLatLng()
          handleLocationPicked(pos.lat, pos.lng)
        })
      }

      map.setView([latitude, longitude], 12)
    }

    // Handle map clicks
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (!disabled) {
        handleLocationPicked(e.latlng.lat, e.latlng.lng)
      }
    }

    map.on("click", handleMapClick)

    mapRef.current = map
    setMapInitialized(true)

    return () => {
      map.off("click", handleMapClick)
      map.remove()
    }
  }, [containerRef, latitude, longitude, disabled, mapInitialized])

  const handleLocationPicked = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })

    // Update or create marker
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
      markerRef.current.setPopupContent(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    } else if (mapRef.current) {
      const marker = L.marker([lat, lng], { draggable: !disabled })
        .addTo(mapRef.current)
        .bindPopup(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`)

      if (!disabled) {
        marker.on("dragend", () => {
          const pos = marker.getLatLng()
          handleLocationPicked(pos.lat, pos.lng)
        })
      }

      markerRef.current = marker
    }

    // Center map on selected location
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 13)
    }

    // Call callback
    onLocationSelect({
      latitude: lat,
      longitude: lng,
      address: searchAddress,
    })
  }

  const handleClearLocation = () => {
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current)
      markerRef.current = null
      setSelectedLocation(null)
    }
  }

  const handleSearchAddress = async () => {
    if (!searchAddress.trim()) return

    try {
      // Using Nominatim (OpenStreetMap) for address search - free and global
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchAddress + ", Cameroon"
        )}&limit=1`
      )

      const results = await response.json()

      if (results.length > 0) {
        const result = results[0]
        const lat = parseFloat(result.lat)
        const lng = parseFloat(result.lon)
        handleLocationPicked(lat, lng)
      }
    } catch (error) {
      console.error("Error searching address:", error)
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-blue-600" />
          {t("location.exactLocation")}
        </CardTitle>
        <CardDescription>
          {t("location.clickOnMap")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            {t("location.realSchoolMessage")}
          </AlertDescription>
        </Alert>

        {/* Address Search */}
        <div className="space-y-2">
          <Label htmlFor="searchAddress">{t("location.searchAddress")}</Label>
          <div className="flex gap-2">
            <Input
              id="searchAddress"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder={t("location.searchAddressPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchAddress()
                }
              }}
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={handleSearchAddress}
              disabled={disabled || !searchAddress.trim()}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              {t("location.search")}
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={containerRef}
          className="h-96 w-full rounded-lg border border-blue-200 bg-muted"
          style={{ minHeight: "400px" }}
        />

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">
                  📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground">{searchAddress}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearLocation}
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">💡 {t("location.howToUse")}</p>
          <ul className="space-y-1 text-xs">
            <li>✓ {t("location.clickDirectly")}</li>
            <li>✓ {t("location.orSearch")}</li>
            <li>✓ {t("location.dragMarker")}</li>
            <li>✓ {t("location.helpStudentsFind")}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
