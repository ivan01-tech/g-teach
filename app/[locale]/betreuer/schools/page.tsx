"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { School } from "@/lib/types"
import { SchoolsList } from "@/components/betreuer/schools-list"
import { SchoolFormDialog } from "@/components/betreuer/school-form-dialog"
import { SchoolStatsDialog } from "@/components/betreuer/school-stats-dialog"
import { SchoolPreviewDialog } from "@/components/betreuer/school-preview-dialog"
import { SchoolContactDialog } from "@/components/betreuer/school-contact-dialog"
import { SchoolSubmitDialog } from "@/components/betreuer/school-submit-dialog"
import { useAuth } from "@/hooks/use-auth"

export default function SchoolsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [statsDialogOpen, setStatsDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)

  const [selectedSchool, setSelectedSchool] = useState<School | undefined>()
  const [schools, setSchools] = useState<School[]>([])

  const handleCreateClick = () => {
    setSelectedSchool(undefined)
    setFormDialogOpen(true)
  }

  const handleEditClick = (school: School) => {
    setSelectedSchool(school)
    setFormDialogOpen(true)
  }

  const handleEditProfileClick = () => {
    router.push("/betreuer/profile")
  }

  const handleStatsClick = (school: School) => {
    setSelectedSchool(school)
    setStatsDialogOpen(true)
  }

  const handlePreviewClick = (school: School) => {
    setSelectedSchool(school)
    setPreviewDialogOpen(true)
  }

  const handleContactClick = (school: School) => {
    setSelectedSchool(school)
    setContactDialogOpen(true)
  }

  const handleSubmitClick = (school: School) => {
    setSelectedSchool(school)
    setSubmitDialogOpen(true)
  }

  const handleFormSuccess = () => {
    setFormDialogOpen(false)
    // Trigger refresh in SchoolsList
    setSchools((prev) => [...prev])
  }

  const handleSubmitSuccess = () => {
    setSubmitDialogOpen(false)
    // Trigger refresh in SchoolsList
    setSchools((prev) => [...prev])
  }

  return (
    <div className="space-y-6">
      <SchoolsList
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onStatsClick={handleStatsClick}
        onPreviewClick={handlePreviewClick}
        onContactClick={handleContactClick}
        onSubmitClick={handleSubmitClick}
        onSchoolsUpdate={setSchools}
        onEditProfileClick={handleEditProfileClick}
        tutor={user || undefined}
      />

      <SchoolFormDialog
        open={formDialogOpen}
        school={selectedSchool}
        onOpenChange={setFormDialogOpen}
        onSuccess={handleFormSuccess}
      />

      <SchoolStatsDialog
        open={statsDialogOpen}
        school={selectedSchool}
        onOpenChange={setStatsDialogOpen}
      />

      <SchoolPreviewDialog
        open={previewDialogOpen}
        school={selectedSchool}
        onOpenChange={setPreviewDialogOpen}
      />

      <SchoolContactDialog
        open={contactDialogOpen}
        school={selectedSchool}
        onOpenChange={setContactDialogOpen}
      />

      <SchoolSubmitDialog
        open={submitDialogOpen}
        school={selectedSchool}
        onOpenChange={setSubmitDialogOpen}
        onSuccess={handleSubmitSuccess}
      />
    </div>
  )
}
