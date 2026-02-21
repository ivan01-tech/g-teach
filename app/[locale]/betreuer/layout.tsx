"use client"
import React from "react";
import { BetreuerHeader } from "@/components/betreuer/header";
import { DashboardSidebar } from "@/components/student/sidebar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { BetreuerSidebar } from "@/components/betreuer/sidebar";
import { BetreuerMobileSidebar } from "@/components/betreuer/mobile-sidebar";
import { MatchingFollowupDialog } from "@/components/student/matching-followup-dialog";

export default function BetreuerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/betreuer");
    }
    if (!loading && userProfile && userProfile.role !== "tutor") {
      router.push("/student");
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || (userProfile && userProfile.role !== "tutor")) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <BetreuerHeader />
        <main className="p-4">
          {children}
          <div className="flex min-h-screen bg-background">
            <BetreuerSidebar className="hidden lg:flex" />
            <div className="flex flex-1 flex-col">
              <BetreuerHeader />
              <BetreuerMobileSidebar />
              <main className="flex-1 overflow-auto p-4 lg:p-6">
                {children}
              </main>
              <MatchingFollowupDialog />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
