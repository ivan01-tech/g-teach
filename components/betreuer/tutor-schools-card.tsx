"use client"

import Link from "next/link"
import { useSchools } from "@/hooks/use-schools"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { Plus, ArrowRight, School as SchoolIcon } from "lucide-react"

export function TutorSchoolsCard() {
  const { schools, loading } = useSchools()
  const t = useTranslations()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("My Schools")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const verifiedCount = schools.filter((s) => s.verificationStatus === "verified").length
  const pendingCount = schools.filter((s) => s.verificationStatus === "pending").length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t("tutor-schools.myLanguageSchools")}</CardTitle>
            <CardDescription>
              {t("tutor-schools.manageRealSchoolsWithStudents", { count: schools.length })}
            </CardDescription>
          </div>
          <div className="rounded-full bg-muted p-2">
            <SchoolIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {schools.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("You haven't created any schools yet.")}
            </p>
            <Link href="/betreuer/schools">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                {t("Create Your First School")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-2">
              {schools.slice(0, 2).map((school) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.location.city}, {school.location.country}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {school.verificationStatus === "verified" ? t("Verified") : t("Pending")}
                  </Badge>
                </div>
              ))}
            </div>

            {schools.length > 2 && (
              <p className="text-xs text-muted-foreground">
                {t("and")} {schools.length - 2} {schools.length - 2 === 1 ? t("more school") : t("more schools")}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              {verifiedCount > 0 && (
                <Badge className="gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {verifiedCount} {t("verified")}
                </Badge>
              )}
              {pendingCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  {pendingCount} {t("pending")}
                </Badge>
              )}
            </div>

            <Link href="/betreuer/schools">
              <Button variant="outline" className="w-full gap-2">
                {t("Manage Schools")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  )
}
