"use client"

import React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Camera, Save, Plus, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTutorProfile } from "@/hooks/use-tutor-profile"
import {
  createTutorProfile,
  updateTutorProfile,
  uploadTutorPhoto,
} from "@/lib/tutor-service"
import { GERMAN_LEVELS, EXAM_TYPES, SPECIALIZATIONS } from "@/lib/types"
import type { AvailabilitySlot } from "@/lib/types"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function BetreuerProfilePage() {
  const { user } = useAuth()
  const { tutorProfile, loading } = useTutorProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    hourlyRate: "",
    currency: "EUR",
    country: "",
    timezone: "",
    teachingLevels: [] as string[],
    examTypes: [] as string[],
    specializations: [] as string[],
    availability: [] as AvailabilitySlot[],
  })

  // Initialize form data when tutor profile loads
  useState(() => {
    if (tutorProfile) {
      setFormData({
        displayName: tutorProfile.displayName || "",
        bio: tutorProfile.bio || "",
        hourlyRate: tutorProfile.hourlyRate?.toString() || "",
        currency: tutorProfile.currency || "EUR",
        country: tutorProfile.country || "",
        timezone: tutorProfile.timezone || "",
        teachingLevels: tutorProfile.teachingLevels || [],
        examTypes: tutorProfile.examTypes || [],
        specializations: tutorProfile.specializations || [],
        availability: tutorProfile.availability || [],
      })
    }
  })

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setPhotoPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      await uploadTutorPhoto(user.uid, file)
    } catch (error) {
      console.error("Error uploading photo:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleCheckboxChange = (
    field: "teachingLevels" | "examTypes" | "specializations",
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter((v) => v !== value),
    }))
  }

  const addAvailabilitySlot = () => {
    setFormData((prev) => ({
      ...prev,
      availability: [
        ...prev.availability,
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
      ],
    }))
  }

  const removeAvailabilitySlot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index),
    }))
  }

  const updateAvailabilitySlot = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    try {
      const profileData = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate) || 0,
        email: user.email || "",
      }

      if (tutorProfile) {
        await updateTutorProfile(user.uid, profileData)
      } else {
        await createTutorProfile(user.uid, profileData)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your tutor profile. A complete profile helps attract students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>
              Upload a professional photo. This helps build trust with students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-muted">
                  {(photoPreview || tutorProfile?.photoURL) ? (
                    <Image
                      src={photoPreview || tutorProfile?.photoURL || ""}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                      {user?.displayName?.charAt(0) || "T"}
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayName: e.target.value,
                    }))
                  }
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, country: e.target.value }))
                  }
                  placeholder="e.g., Germany"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Description</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell students about your teaching experience, methodology, and what makes you a great tutor..."
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hourlyRate: e.target.value,
                    }))
                  }
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CHF">CHF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, timezone: e.target.value }))
                  }
                  placeholder="Europe/Berlin"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Levels */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Levels</CardTitle>
            <CardDescription>
              Select the German levels you can teach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {GERMAN_LEVELS.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.value}`}
                    checked={formData.teachingLevels.includes(level.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "teachingLevels",
                        level.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`level-${level.value}`}
                    className="text-sm font-normal"
                  >
                    {level.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Preparation */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Preparation</CardTitle>
            <CardDescription>
              Select the exams you can help students prepare for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EXAM_TYPES.map((exam) => (
                <div key={exam.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exam-${exam.value}`}
                    checked={formData.examTypes.includes(exam.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "examTypes",
                        exam.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`exam-${exam.value}`}
                    className="text-sm font-normal"
                  >
                    {exam.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Specializations */}
        <Card>
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
            <CardDescription>
              What areas do you specialize in?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SPECIALIZATIONS.map((spec) => (
                <div key={spec.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`spec-${spec.value}`}
                    checked={formData.specializations.includes(spec.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "specializations",
                        spec.value,
                        checked as boolean
                      )
                    }
                  />
                  <Label
                    htmlFor={`spec-${spec.value}`}
                    className="text-sm font-normal"
                  >
                    {spec.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>
              Set your available teaching hours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.availability.map((slot, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
              >
                <Select
                  value={slot.day}
                  onValueChange={(value) =>
                    updateAvailabilitySlot(index, "day", value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) =>
                    updateAvailabilitySlot(index, "startTime", e.target.value)
                  }
                  className="w-[120px]"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateAvailabilitySlot(index, "endTime", e.target.value)
                  }
                  className="w-[120px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAvailabilitySlot(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addAvailabilitySlot}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}
