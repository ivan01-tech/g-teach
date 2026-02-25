"use client"

import { School } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { submitSchoolForVerification } from "@/lib/services/school-service"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from "next-intl"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { useState } from "react"

interface SchoolSubmitDialogProps {
  open: boolean
  school?: School
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SchoolSubmitDialog({
  open,
  school,
  onOpenChange,
  onSuccess,
}: SchoolSubmitDialogProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  if (!school) return null

  const isAlreadySubmitted = school.verificationStatus === "pending"

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      await submitSchoolForVerification(school.id)
      toast({
        title: t("Success"),
        description: t("School submitted for verification"),
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      console.error("Error submitting school:", error)
      toast({
        title: t("Error"),
        description: t("Failed to submit school"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>{t("Submit School for Verification")}</AlertDialogTitle>

        <div className="space-y-4">
          {isAlreadySubmitted ? (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-600">{t("Already Submitted")}</AlertTitle>
              <AlertDescription className="text-yellow-600/80">
                {t(
                  "This school is already pending verification. Our team will review it soon."
                )}
              </AlertDescription>
            </Alert>
          ) : school.verificationStatus === "verified" ? (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">{t("Already Verified")}</AlertTitle>
              <AlertDescription className="text-green-600/80">
                {t("Your school is already verified and visible to students.")}
              </AlertDescription>
            </Alert>
          ) : school.verificationStatus === "rejected" ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("Verification Rejected")}</AlertTitle>
              <AlertDescription>
                {school.verificationMessage ||
                  t("Your school verification was rejected. Please review and update your information before resubmitting.")}
              </AlertDescription>
            </Alert>
          ) : null}

          <AlertDialogDescription className="space-y-2">
            <p>
              {isAlreadySubmitted
                ? t(
                    "You can update your school information while it is being reviewed. Verification typically takes 24-48 hours."
                  )
                : t(
                    "By submitting your school, it will be reviewed by our team. Please ensure all information is accurate and complete."
                  )}
            </p>

            {!isAlreadySubmitted && school.verificationStatus !== "verified" && (
              <div className="bg-muted p-3 rounded-lg space-y-2 text-sm">
                <p className="font-semibold">{t("Verification Checklist")}</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ {t("School name is clear and professional")}</li>
                  <li>✓ {t("Logo or image is appropriate")}</li>
                  <li>✓ {t("Description is informative")}</li>
                  <li>✓ {t("Contact information is complete")}</li>
                  <li>✓ {t("Location details are accurate")}</li>
                </ul>
              </div>
            )}
          </AlertDialogDescription>
        </div>

        {!isAlreadySubmitted && school.verificationStatus !== "verified" && (
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? t("Submitting...") : t("Submit for Verification")}
            </AlertDialogAction>
          </div>
        )}

        {(isAlreadySubmitted || school.verificationStatus === "verified") && (
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>{t("Close")}</AlertDialogCancel>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
