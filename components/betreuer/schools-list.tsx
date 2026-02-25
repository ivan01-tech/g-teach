"use client"

import { useEffect, useState } from "react"
import { School } from "@/lib/types"
import { getTutorSchools, deleteSchool } from "@/lib/services/school-service"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import {
  Plus,
  MoreVertical,
  Trash2,
  Eye,
  Edit,
  BarChart3,
  Mail,
  Send,
  MessageSquare,
  Star,
} from "lucide-react"
import { SchoolDashboard } from "@/components/betreuer/school-dashboard"

interface SchoolsListProps {
  onCreateClick: () => void
  onEditClick: (school: School) => void
  onStatsClick: (school: School) => void
  onPreviewClick: (school: School) => void
  onContactClick: (school: School) => void
  onSubmitClick: (school: School) => void
  onSchoolsUpdate?: (schools: School[]) => void
  onEditProfileClick?: () => void
  tutor?: any
}

export function SchoolsList({
  onCreateClick,
  onEditClick,
  onStatsClick,
  onPreviewClick,
  onContactClick,
  onSubmitClick,
  onSchoolsUpdate,
  onEditProfileClick,
  tutor,
}: SchoolsListProps) {
  const { user } = useAuth()
  const t = useTranslations()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user) {
      loadSchools()
    }
  }, [user])

  const loadSchools = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await getTutorSchools(user.uid)
      setSchools(data)
      onSchoolsUpdate?.(data)
    } catch (error) {
      console.error("Error loading schools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setDeleting(true)
      await deleteSchool(deleteId)
      setSchools(schools.filter((s) => s.id !== deleteId))
      setDeleteId(null)
    } catch (error) {
      console.error("Error deleting school:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // Maximum one school per tutor
  const maxSchoolsReached = schools.length >= 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("tutor-schools.myLanguageSchools")}</h2>
          <p className="text-muted-foreground">
            {t("You can manage one language school on the platform")}
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          disabled={maxSchoolsReached}
          className="gap-2"
          title={maxSchoolsReached ? "You can only create one school" : ""}
        >
          <Plus className="h-4 w-4" />
          {t("tutor-schools.addSchool")}
        </Button>
      </div>

      {schools.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">{t("No schools yet")}</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-xs">
              {t("Create your language school to start offering lessons to students on the platform")}
            </p>
            <Button onClick={onCreateClick} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              {t("Create School")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SchoolDashboard
          school={schools[0]}
          tutor={tutor}
          onEditClick={() => onEditClick(schools[0])}
          onEditProfileClick={onEditProfileClick || (() => {})}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>{t("Delete School")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Are you sure you want to delete this school? This action cannot be undone.")}
          </AlertDialogDescription>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? t("Deleting...") : t("Delete")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
