"use client";

import { ReactNode } from "react";
import { useAdminProtection } from "@/hooks/use-admin";
import LoadingScreen from "@/components/ui/loading-screen";

interface AdminProtectionProps {
  children: ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { isAdmin, loading } = useAdminProtection();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-8">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
