"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileCheck,
  Calendar,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/betreuer", icon: LayoutDashboard },
  { name: "My Profile", href: "/betreuer/profile", icon: User },
  { name: "Documents", href: "/betreuer/documents", icon: FileCheck },
  { name: "Messages", href: "/betreuer/messages", icon: MessageSquare },
  { name: "Matchings", href: "/betreuer/matchings", icon: MessageSquare },
  { name: "Bookings", href: "/betreuer/bookings", icon: Calendar },
  { name: "Resources", href: "/betreuer/resources", icon: BookOpen },
  { name: "Settings", href: "/betreuer/settings", icon: Settings },
]

interface BetreuerSidebarProps {
  className?: string
  onNavigate?: () => void
}

export function BetreuerSidebar({ className, onNavigate }: BetreuerSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-sm font-bold text-sidebar-primary-foreground">G</span>
        </div>
        <span className="text-lg font-semibold">G-Teach</span>
        <span className="ml-auto rounded bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-accent-foreground">
          Betreuer
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/betreuer" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
