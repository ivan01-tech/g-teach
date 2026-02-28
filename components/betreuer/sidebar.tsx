"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FileCheck,
  Calendar,
  Settings,
  LogOut,
  BookOpen,
  Contact,
  School,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

// On utilise des clés au lieu de noms en dur
const navigation = [
  { href: "/betreuer",              key: "dashboard" },
  { href: "/betreuer/profile",      key: "profile" },
  { href: "/betreuer/documents",    key: "documents" },
  { href: "/betreuer/messages",     key: "messages" },
  { href: "/betreuer/connections",  key: "connections" },
  { href: "/betreuer/matchings",    key: "matchings" },
  { href: "/betreuer/schools",      key: "mySchools" },
  { href: "/betreuer/settings",     key: "settings" },
];

interface BetreuerSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function BetreuerSidebar({ className, onNavigate }: BetreuerSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const t = useTranslations("betreuerSidebar");
  const tr = useTranslations("roles");

  const handleLogout = async () => {
    await logout();
  };

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
          {tr("betreuer")}
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/betreuer" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              {item.key === "dashboard"    && <LayoutDashboard className="h-5 w-5" />}
              {item.key === "profile"      && <User className="h-5 w-5" />}
              {item.key === "documents"    && <FileCheck className="h-5 w-5" />}
              {item.key === "messages"     && <MessageSquare className="h-5 w-5" />}
              {item.key === "connections"  && <Contact className="h-5 w-5" />}
              {item.key === "matchings"    && <Contact className="h-5 w-5" />} {/* ou autre icône si différent */}
              {item.key === "mySchools"    && <School className="h-5 w-5" />}
              {item.key === "settings"     && <Settings className="h-5 w-5" />}

              {t(`nav.${item.key}`)}
            </Link>
          );
        })}
      </nav>


      <div className="border-t border-sidebar-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </Button>
      </div>
    </aside>
  );
}