"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  Zap,
  Lock,
  Files,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthDispatch } from "@/hooks/use-auth-dispatch";
import { useState } from "react";
import { cn } from "@/lib/utils";

const adminMenuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
    subItems: [
      { label: "Students", href: "/admin/users/students" },
      { label: "Tutors", href: "/admin/users/tutors" },
      { label: "Admins", href: "/admin/users/admins" },
    ],
  },
  {
    icon: BookOpen,
    label: "Courses",
    href: "/admin/courses",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/admin/analytics",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/admin/messages",
  },
  {
    icon: Files,
    label: "Verifications",
    href: "/admin/verifications",
  },
  {
    icon: Zap,
    label: "System",
    href: "/admin/system",
  },
  {
    icon: Lock,
    label: "Security",
    href: "/admin/security",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/admin/settings",
  },
];

interface AdminSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AdminSidebar({ open = true, onOpenChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthDispatch();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out z-40",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
        {open && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">G-Admin</span>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {adminMenuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  if (item.subItems) {
                    setExpandedMenu(
                      expandedMenu === item.href ? null : item.href
                    );
                  }
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {open && <span className="text-sm font-medium flex-1">{item.label}</span>}
              </Link>

              {/* Sub menu items */}
              {item.subItems && expandedMenu === item.href && open && (
                <div className="ml-4 mt-1 space-y-1 border-l border-slate-600 pl-4">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "block px-4 py-2 rounded-lg text-sm transition-colors duration-200",
                        pathname === subItem.href
                          ? "text-blue-400 bg-blue-600/10"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                      )}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-slate-700 p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full text-red-400 hover:text-red-300 hover:bg-red-500/10",
            !open && "px-0"
          )}
        >
          <LogOut className="h-5 w-5" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
}
