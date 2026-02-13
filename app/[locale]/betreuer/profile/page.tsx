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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Camera, Save, Plus, X, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useTutorProfile } from "@/hooks/use-tutor-profile"
import {
  createTutorProfile,
  updateTutorProfile,
  uploadTutorPhoto,
} from "@/lib/services/tutor-service"
import { GERMAN_LEVELS, EXAM_TYPES, SPECIALIZATIONS } from "@/lib/types"
import type { AvailabilitySlot } from "@/lib/types"

import { useTutorProfileEdit } from "./use-tutor-profile-edit"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function BetreuerProfilePage() {
  const {
    user,
    tutorProfile,
    loading,
    fileInputRef,
    saving,
    uploading,
    photoPreview,
    formData,
    setFormData,
    handlePhotoChange,
    handleCheckboxChange,
    addAvailabilitySlot,
    removeAvailabilitySlot,
    updateAvailabilitySlot,
    handleSubmit,
    cities,
    fetchingCities,
    handleCreateCity,
  } = useTutorProfileEdit()

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
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
                <Select value={formData.country} onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="cameroon">Cameroon</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="spain">Spain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex flex-col pt-1">
                <Label htmlFor="city" className="mb-1">City</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between font-normal"
                      disabled={fetchingCities}
                    >
                      {formData.city
                        ? cities.find((city) => city.name === formData.city)?.name || formData.city
                        : "Select a city..."}
                      {fetchingCities ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin shrink-0 opacity-50" />
                      ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search city..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty className="py-2 px-4 text-sm">
                          {searchValue ? (
                            <Button
                              variant="ghost"
                              className="w-full justify-start font-normal text-primary p-0 h-auto"
                              onClick={() => {
                                handleCreateCity(searchValue)
                                setOpen(false)
                                setSearchValue("")
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Add "{searchValue}"
                            </Button>
                          ) : (
                            "No city found."
                          )}
                        </CommandEmpty>
                        <CommandGroup>
                          {cities
                            .filter(city => city.name.toLowerCase().includes(searchValue.toLowerCase()))
                            .map((city) => (
                              <CommandItem
                                key={city.id}
                                value={city.name}
                                onSelect={(currentValue) => {
                                  setFormData(prev => ({ ...prev, city: currentValue }))
                                  setOpen(false)
                                  setSearchValue("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.city === city.name ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              {/* <div className="space-y-2">
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
              </div> */}
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
                  <SelectTrigger className="w-35">
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
                  className="w-30"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) =>
                    updateAvailabilitySlot(index, "endTime", e.target.value)
                  }
                  className="w-30"
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
