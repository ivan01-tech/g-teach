"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useTutorProfile } from "@/hooks/use-tutor-profile"
import { Badge } from "@/components/ui/badge"

export function BetreuerHeader() {
  const { user, logout } = useAuth()
  const { tutorProfile } = useTutorProfile()
  const t = useTranslations()

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "verified":
        return t("Verified")
      case "rejected":
        return t("Rejected")
      default:
        return t("Pending")
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="hidden lg:block">
          <h1 className="text-lg font-semibold text-foreground">
            {t("Tutor Dashboard")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("Manage your profile and connect with students")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {tutorProfile && (
          <Badge
            variant="outline"
            className={getStatusColor(tutorProfile.verificationStatus)}
          >
            {getStatusLabel(tutorProfile.verificationStatus)}
          </Badge>
        )}

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            2
          </span>
          <span className="sr-only">{t("Notifications")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={tutorProfile?.photoURL || user?.photoURL || ""}
                  alt={user?.displayName || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.displayName?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/betreuer/profile">{t("My Profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/betreuer/settings">{t("Settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              {t("Sign Out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
