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

interface SchoolsListProps {
  onCreateClick: () => void
  onEditClick: (school: School) => void
  onStatsClick: (school: School) => void
  onPreviewClick: (school: School) => void
  onContactClick: (school: School) => void
  onSubmitClick: (school: School) => void
  onSchoolsUpdate?: (schools: School[]) => void
}

export function SchoolsList({
  onCreateClick,
  onEditClick,
  onStatsClick,
  onPreviewClick,
  onContactClick,
  onSubmitClick,
  onSchoolsUpdate,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-700 border-green-200"
      case "rejected":
        return "bg-red-500/10 text-red-700 border-red-200"
      default:
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "verified":
        return t("Verified")
      case "rejected":
        return t("Rejected")
      default:
        return t("Pending Verification")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("tutor-schools.myLanguageSchools")}</h2>
          <p className="text-muted-foreground">
            {t("tutor-schools.manageYourRealSchools")}
          </p>
        </div>
        <Button onClick={onCreateClick} className="gap-2">
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
            <p className="mt-2 text-center text-muted-foreground">
              {t("Create your first school to get started!")}
            </p>
            <Button onClick={onCreateClick} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              {t("Create School")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schools.map((school) => (
            <Card key={school.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {school.logo && (
                      <img
                        src={school.logo}
                        alt={school.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{school.name}</CardTitle>
                        <Badge className={`${getStatusColor(school.verificationStatus)}`}>
                          {getStatusLabel(school.verificationStatus)}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {school.location.city}, {school.location.country}
                      </CardDescription>
                      {school.description && (
                        <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                          {school.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditClick(school)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("Edit")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onPreviewClick(school)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t("Preview")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onStatsClick(school)}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t("Statistics")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onContactClick(school)}>
                        <Mail className="mr-2 h-4 w-4" />
                        {t("Contact Info")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {school.verificationStatus !== "verified" && (
                        <>
                          <DropdownMenuItem onClick={() => onSubmitClick(school)}>
                            <Send className="mr-2 h-4 w-4" />
                            {t("Submit for Verification")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => setDeleteId(school.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  {school.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {school.rating.toFixed(1)} ({school.reviewCount} {t("reviews")})
                      </span>
                    </div>
                  )}
                  {school.exams && school.exams.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t("Exams")}</p>
                      <div className="flex flex-wrap gap-1">
                        {school.exams.map((exam) => (
                          <Badge key={exam} variant="secondary" className="text-xs">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
