"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/lib/hooks";
import Link from "next/link";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function AdminHeader({
  sidebarOpen,
  onSidebarToggle,
}: AdminHeaderProps) {
  const { userProfile } = useAppSelector((state) => state.auth);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 h-16 bg-slate-800 border-b border-slate-700 z-30 lg:left-64">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left section */}
        <div className="hidden lg:flex items-center gap-4">
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="lg:hidden text-slate-400 hover:text-white"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
              <DropdownMenuLabel className="text-white">
                {userProfile?.displayName || "Administrator"}
              </DropdownMenuLabel>
              <p className="px-2 py-1 text-sm text-slate-400">
                {userProfile?.email}
              </p>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-slate-200 cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                <Link href="/admin/settings/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-200 cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                <Link href="/admin/settings">System Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem className="text-red-400 cursor-pointer">
                <Link href="/api/auth/logout">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
