"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  LayoutDashboard,
  Search,
  MessageSquare,
  Calendar,
  User,
  Settings,
  LogOut,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const studentNavItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tutors", label: "Find Tutors", icon: Search },
  { href: "/student/favorites", label: "Favorites", icon: Heart },
  // { href: "/student/bookings", label: "My Bookings", icon: Calendar },
  { href: "/student/messages", label: "Messages", icon: MessageSquare },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/settings", label: "Settings", icon: Settings },
]

const tutorNavItems = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  // { href: "/student/bookings", label: "Bookings", icon: Calendar },
  { href: "/student/messages", label: "Messages", icon: MessageSquare },
  { href: "/student/profile", label: "My Profile", icon: User },
  { href: "/student/availability", label: "Availability", icon: Calendar },
  { href: "/student/settings", label: "Settings", icon: Settings },
]

interface MobileSidebarProps {
  onClose: () => void
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const { userProfile, logout } = useAuth()

  const navItems = userProfile?.role === "tutor" ? tutorNavItems : studentNavItems

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">G-Teach</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-4 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <User className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {userProfile?.displayName || "User"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {userProfile?.role === "tutor" ? "Tutor" : "Student"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={() => {
            logout()
            onClose()
          }}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
