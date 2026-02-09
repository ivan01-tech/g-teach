"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin";
import LoadingScreen from "@/components/ui/loading-screen";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAdminProtection();
  const { user } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }

    else if (!loading && user) {
      router.push('/dashboard');
    }
  }, [loading, user, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-foreground">G-Teach</span>
      </Link>
    </div>
  );
}
