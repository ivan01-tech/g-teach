"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
  ConciergeBell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// On définit les items avec des clés de traduction au lieu de libellés fixes
const studentNavItems = [
  { href: "/student", key: "dashboard" },
  { href: "/tutors", key: "findTutors" },
  { href: "/student/favorites", key: "favorites" },
  { href: "/student/connections", key: "connections" },
  { href: "/student/matchings", key: "myMatchings" },
  { href: "/student/messages", key: "messages" },
  { href: "/student/profile", key: "profile" },
  { href: "/student/settings", key: "settings" },
];

const tutorNavItems = [
  { href: "/student", key: "dashboard" }, // même dashboard pour les deux rôles
  { href: "/student/messages", key: "messages" },
  { href: "/student/profile", key: "myProfile" },
  { href: "/student/availability", key: "availability" },
  { href: "/student/settings", key: "settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Namespace principal pour la sidebar
  const t = useTranslations("sidebar");
  // Namespace pour les rôles (header ou commun)
  const tr = useTranslations("roles");

  const navItems = user?.role === "tutor" ? tutorNavItems : studentNavItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">G-Teach</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {item.key === "dashboard" && <LayoutDashboard className="h-5 w-5" />}
              {item.key === "findTutors" && <Search className="h-5 w-5" />}
              {item.key === "favorites" && <Heart className="h-5 w-5" />}
              {item.key === "connections" && <ConciergeBell className="h-5 w-5" />}
              {item.key === "myMatchings" && <Calendar className="h-5 w-5" />}
              {item.key === "messages" && <MessageSquare className="h-5 w-5" />}
              {item.key === "profile" && <User className="h-5 w-5" />}
              {item.key === "myProfile" && <User className="h-5 w-5" />}
              {item.key === "availability" && <Calendar className="h-5 w-5" />}
              {item.key === "settings" && <Settings className="h-5 w-5" />}

              {t(`nav.${item.key}`)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-4 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent">
            <User className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.displayName || t("anonymousUser")}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {user?.role === "tutor" ? tr("tutor") : tr("student")}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </Button>
      </div>
    </aside>
  );
}