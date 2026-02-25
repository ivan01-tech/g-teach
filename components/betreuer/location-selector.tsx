"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslations } from "next-intl"
import { MapPin, Copy, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"

interface LocationSelectorProps {
  city: string
  country: string
  address?: string
  latitude?: number
  longitude?: number
  onLocationChange: (location: {
    city: string
    country: string
    address?: string
    latitude?: number
    longitude?: number
    googleMapsUrl?: string
  }) => void
  disabled?: boolean
}

export function LocationSelector({
  city,
  country,
  address,
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
}: LocationSelectorProps) {
  const t = useTranslations()
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value
    const mapsUrl = buildGoogleMapsUrlForData({
      address: newAddress,
      latitude,
      longitude,
      city,
      country,
    })
    onLocationChange({
      city,
      country,
      address: newAddress,
      latitude,
      longitude,
      googleMapsUrl: mapsUrl,
    })
  }

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = e.target.value ? parseFloat(e.target.value) : undefined
    const mapsUrl = buildGoogleMapsUrlForData({
      address,
      latitude: lat,
      longitude,
      city,
      country,
    })
    onLocationChange({
      city,
      country,
      address,
      latitude: lat,
      longitude,
      googleMapsUrl: mapsUrl,
    })
  }

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = e.target.value ? parseFloat(e.target.value) : undefined
    const mapsUrl = buildGoogleMapsUrlForData({
      address,
      latitude,
      longitude: lng,
      city,
      country,
    })
    onLocationChange({
      city,
      country,
      address,
      latitude,
      longitude: lng,
      googleMapsUrl: mapsUrl,
    })
  }

  const buildGoogleMapsUrlForData = (data: {
    address?: string
    latitude?: number
    longitude?: number
    city: string
    country: string
  }) => {
    if (data.latitude && data.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
    } else if (data.address) {
      return `https://www.google.com/maps/search/${encodeURIComponent(data.address)}`
    } else if (data.city && data.country) {
      return `https://www.google.com/maps/search/${encodeURIComponent(`${data.address || data.city}, ${data.country}`)}`
    }
    return undefined
  }

  const buildGoogleMapsUrl = () => {
    return buildGoogleMapsUrlForData({ address, latitude, longitude, city, country })
  }

  const copyCoordinates = () => {
    if (latitude && longitude) {
      navigator.clipboard.writeText(`${latitude}, ${longitude}`)
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-blue-600" />
              {t("Exact Location")}
            </CardTitle>
            <CardDescription>
              {t("Help students find your school on a map")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            {t("This is a real language school located in Cameroon. Students can find and join real courses here.")}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="address">{t("Full Address")}</Label>
          <Input
            id="address"
            value={address || ""}
            onChange={handleAddressChange}
            placeholder={t("e.g., 123 Main Street, Yaoundé")}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            {t("Complete street address including building number")}
          </p>
        </div>

        {/* Advanced Coordinates Section */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAdvanced ? "Hide GPS Coordinates" : "Add GPS Coordinates (Optional)"}
        </button>

        {showAdvanced && (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="latitude">
                  {t("Latitude")}
                  <span className="text-xs text-muted-foreground ml-1">(e.g., 3.8667)</span>
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={latitude || ""}
                  onChange={handleLatitudeChange}
                  placeholder="3.8667"
                  disabled={disabled}
                  min="-90"
                  max="90"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">
                  {t("Longitude")}
                  <span className="text-xs text-muted-foreground ml-1">(e.g., 11.5167)</span>
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={longitude || ""}
                  onChange={handleLongitudeChange}
                  placeholder="11.5167"
                  disabled={disabled}
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            {latitude && longitude && (
              <div className="flex items-center justify-between rounded bg-white p-2">
                <span className="text-xs font-medium">
                  📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={copyCoordinates}
                  disabled={disabled}
                  className="h-6 w-6"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Google Maps Button */}
        {buildGoogleMapsUrl() && (
          <Link href={buildGoogleMapsUrl() || ""} target="_blank" rel="noopener noreferrer">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <ExternalLink className="h-4 w-4" />
              {t("View on Google Maps")}
            </Button>
          </Link>
        )}

        {/* Info Box */}
        <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">💡 {t("Why this matters:")}</p>
          <ul className="space-y-1 text-xs">
            <li>✓ {t("Students can find you easily on the map")}</li>
            <li>✓ {t("Increase credibility as a real, located school")}</li>
            <li>✓ {t("Students can get directions to your location")}</li>
            <li>✓ {t("Help filters work better for geographic searches")}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
