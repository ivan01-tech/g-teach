"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuthDispatch } from "@/hooks/use-auth-dispatch"
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
import { BookOpen, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { UserRole } from "@/lib/roles"
import { useTranslations } from "next-intl"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const { signIn, loading, error: reduxError, user } = useAuthDispatch()
  const router = useRouter()

  const tCommon = useTranslations("common")
  const t = useTranslations("login")

  useEffect(() => {
    if (user) {
      toast.success(t("success"), {
        description: t("welcomeBack", { role: user.role?.toLowerCase() || "utilisateur" }),
      })

      // Redirection selon le rôle
      const dashboardPath =
        user.role === UserRole.Tutor
          ? "/betreuer"
          : user.role === UserRole.Student
            ? "/student"
            : "/auth/not-authorized"

      router.push(dashboardPath)
    }
  }, [user, router, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    try {
      const result = await signIn(email, password)

      if (result.type === "auth/signIn/fulfilled") {
        // Le useEffect gère la redirection et le toast
        // Pas besoin de refaire ici
      } else {
        // Erreur du thunk
        setLocalError(reduxError || t("error"))
      }
    } catch (err: any) {
      setLocalError(t("error"))
      console.error("Login error:", err)
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {(localError || reduxError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{localError || reduxError || t("error")}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{tCommon("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{tCommon("password")}</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder={t("enterPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("submit")
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}