"use client"

import { useState, useEffect } from "react"
import { School, GERMAN_LEVELS, EXAM_TYPES } from "@/lib/types"
import { createSchool, updateSchool, uploadSchoolLogo } from "@/lib/services/school-service"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { useSchoolFormEdit } from "./use-school-form-edit"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Upload, X, Plus, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { MapLocationPicker } from "./map-location-picker"

interface SchoolFormDialogProps {
  open: boolean
  school?: School
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SchoolFormDialog({ open, school, onOpenChange, onSuccess }: SchoolFormDialogProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const t = useTranslations()
  const isEditing = !!school

  const [loading, setLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(school?.logo || "")
  const [openCity, setOpenCity] = useState(false)
  const [searchCity, setSearchCity] = useState("")
  const [openExams, setOpenExams] = useState(false)
  const [openLevels, setOpenLevels] = useState(false)

  const {
    formData,
    setFormData,
    cities,
    fetchingCities,
    handleCreateCity,
    toggleExam,
    toggleLevel,
  } = useSchoolFormEdit(school)

  // Update logo preview when school changes
  useEffect(() => {
    setLogoPreview(school?.logo || "")
  }, [school])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    try {
      setLoading(true)

      const schoolData = {
        name: formData.name,
        description: formData.description,
        about: formData.about || null,
        logo: logoPreview || formData.logoUrl,
        location: {
          city: formData.locationCity,
          country: formData.locationCountry,
          address: formData.locationAddress || null,
          latitude: formData.locationLatitude||null,
          longitude: formData.locationLongitude||null,
        },
        exams: formData.exams,
        levels: formData.levels,
        phone: formData.phone || "",
        email: formData.email || null,
        website: formData.website || null,
        googleMapsUrl: formData.googleMapsUrl || null,
        socialMedia: {
          facebook: formData.facebookUrl || null,
          twitter: formData.twitterUrl || null,
          instagram: formData.instagramUrl || null,
          linkedin: formData.linkedinUrl || null,
        },
      }

      if (isEditing) {
        // Upload logo if changed
        if (logoFile && school?.id) {
          const logoUrl = await uploadSchoolLogo(school.id, logoFile)
          schoolData.logo = logoUrl
        }

        await updateSchool(school!.id, schoolData)
        toast({
          title: t("Success"),
          description: t("School updated successfully"),
        })
      } else {
        // Upload logo for new school
        const newSchool = await createSchool(user.uid, schoolData as any)

        if (logoFile) {
          const logoUrl = await uploadSchoolLogo(newSchool.id, logoFile)
          await updateSchool(newSchool.id, { logo: logoUrl })
        }

        toast({
          title: t("Success"),
          description: t("School created successfully"),
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("Error saving school:", error)
      toast({
        title: t("Error"),
        description: t("Failed to save school"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] w-[85vw]! overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("Edit School") : t("Create New School")}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? t("Update your school information")
              : t("Add a new school to your profile")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">{t("Basic Info")}</TabsTrigger>
              <TabsTrigger value="details">{t("Details")}</TabsTrigger>
              <TabsTrigger value="social">{t("Contact & Social")}</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">{t("School Name")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("Enter school name")}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="description">{t("Description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("Describe your school...")}
                  className="resize-none"
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="about">{t("About This School")}</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder={t("Tell us more about your language school - teaching methods, years of experience, specialties, etc.")}
                  className="resize-none"
                  rows={3}
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("Help students understand what makes your school special")}
                </p>
              </div>

              <div>
                <Label>{t("School Logo")}</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="relative">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoFile(null)
                          setLogoPreview("")
                        }}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-6 hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">{t("Upload Logo")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* City Selector with Popover */}
                <div className="space-y-2">
                  <Label htmlFor="city">{t("City")}</Label>
                  <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCity}
                        className="w-full justify-between font-normal"
                        disabled={fetchingCities || loading}
                      >
                        {formData.locationCity || t("Select a city...")}
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
                          placeholder={t("Search city...")}
                          value={searchCity}
                          onValueChange={setSearchCity}
                        />
                        <CommandList>
                          <CommandEmpty className="py-2 px-4 text-sm">
                            {searchCity ? (
                              <Button
                                variant="ghost"
                                className="w-full justify-start font-normal text-primary p-0 h-auto"
                                onClick={() => {
                                  handleCreateCity(searchCity)
                                  setOpenCity(false)
                                  setSearchCity("")
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                {t("Add")} "{searchCity}"
                              </Button>
                            ) : (
                              t("No city found.")
                            )}
                          </CommandEmpty>
                          <CommandGroup>
                            {cities
                              .filter((city) =>
                                city.name.toLowerCase().includes(searchCity.toLowerCase())
                              )
                              .map((city) => (
                                <CommandItem
                                  key={city.id}
                                  value={city.name}
                                  onSelect={(currentValue) => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      locationCity: currentValue,
                                    }))
                                    setOpenCity(false)
                                    setSearchCity("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.locationCity === city.name
                                        ? "opacity-100"
                                        : "opacity-0"
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

                <div>
                  <Label htmlFor="locationCountry">{t("Country")}</Label>
                  <Input
                    id="locationCountry"
                    name="locationCountry"
                    value={formData.locationCountry}
                    onChange={handleInputChange}
                    placeholder={t("Country")}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="locationAddress">{t("Address")}</Label>
                <Input
                  id="locationAddress"
                  name="locationAddress"
                  value={formData.locationAddress}
                  onChange={handleInputChange}
                  placeholder={t("Full address")}
                  disabled={loading}
                />
              </div>

              {/* Interactive Map Location Picker */}
              <MapLocationPicker
                address={formData.locationAddress}
                latitude={formData.locationLatitude}
                longitude={formData.locationLongitude}
                onLocationSelect={(locationData) => {
                  setFormData((prev) => ({
                    ...prev,
                    locationLatitude: locationData.latitude,
                    locationLongitude: locationData.longitude,
                    locationAddress: locationData.address || prev.locationAddress,
                  }))
                }}
                disabled={loading}
              />

              {/* Exams Selector */}
              <div className="space-y-2">
                <Label>{t("Exams")}</Label>
                <Popover open={openExams} onOpenChange={setOpenExams}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                      disabled={loading}
                    >
                      {formData.exams.length > 0
                        ? `${formData.exams.length} selected`
                        : t("Select exams...")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Search exams...")} />
                      <CommandList>
                        <CommandEmpty>{t("No exams found.")}</CommandEmpty>
                        <CommandGroup>
                          {EXAM_TYPES.map((exam) => (
                            <CommandItem
                              key={exam.value}
                              value={exam.value}
                              onSelect={() => toggleExam(exam.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.exams.includes(exam.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {exam.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.exams.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.exams.map((exam) => {
                      const examLabel = EXAM_TYPES.find((e) => e.value === exam)?.label
                      return (
                        <Badge key={exam} variant="secondary" className="gap-1">
                          {examLabel}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => toggleExam(exam)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Levels Selector */}
              <div className="space-y-2">
                <Label>{t("Levels")}</Label>
                <Popover open={openLevels} onOpenChange={setOpenLevels}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between font-normal"
                      disabled={loading}
                    >
                      {formData.levels.length > 0
                        ? `${formData.levels.length} selected`
                        : t("Select levels...")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t("Search levels...")} />
                      <CommandList>
                        <CommandEmpty>{t("No levels found.")}</CommandEmpty>
                        <CommandGroup>
                          {GERMAN_LEVELS.map((level) => (
                            <CommandItem
                              key={level.value}
                              value={level.value}
                              onSelect={() => toggleLevel(level.value)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.levels.includes(level.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {level.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formData.levels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.levels.map((level) => {
                      const levelLabel = GERMAN_LEVELS.find((l) => l.value === level)?.label
                      return (
                        <Badge key={level} variant="secondary" className="gap-1">
                          {levelLabel}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => toggleLevel(level)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Contact & Social Tab */}
            <TabsContent value="social" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{t("Phone")}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t("Phone number")}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t("Email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("Email address")}
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">{t("Website")}</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder={t("https://example.com")}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">{t("Social Media")}</h3>
                <div>
                  <Label htmlFor="facebookUrl">{t("Facebook")}</Label>
                  <Input
                    id="facebookUrl"
                    name="facebookUrl"
                    value={formData.facebookUrl}
                    onChange={handleInputChange}
                    placeholder={t("Facebook URL")}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="twitterUrl">{t("Twitter")}</Label>
                  <Input
                    id="twitterUrl"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    placeholder={t("Twitter URL")}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="instagramUrl">{t("Instagram")}</Label>
                  <Input
                    id="instagramUrl"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleInputChange}
                    placeholder={t("Instagram URL")}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">{t("LinkedIn")}</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder={t("LinkedIn URL")}
                    disabled={loading}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t("Cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("Saving...") : isEditing ? t("Update School") : t("Create School")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
