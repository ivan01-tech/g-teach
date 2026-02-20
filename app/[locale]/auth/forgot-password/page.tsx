"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { useAuthDispatch } from "@/hooks/use-auth-dispatch"
import { useTranslations } from "next-intl"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { sendPasswordReset, loading } = useAuthDispatch()

  const t = useTranslations("forgot-password")
  const tCommon = useTranslations("common")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const result = await sendPasswordReset(email)

      if (result.type === "auth/resetPassword/fulfilled") {
        setSuccess(true)
      } else {
        setError(result.payload as string || t("errorMessage"))
      }
    } catch (err: any) {
      setError(t("errorMessage"))
      console.error("Reset password error:", err)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">G-Teach</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <Alert className="border-accent bg-accent/10">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <AlertDescription className="text-accent font-medium">
                {t("successTitle")}
                <br />
                {t("successMessage")}
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{tCommon("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("sendButton")
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}