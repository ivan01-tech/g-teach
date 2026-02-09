"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthDispatch } from "@/hooks/use-auth-dispatch";
import { useAppSelector } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookOpen, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { UserRole } from "@/lib/roles";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const { signIn, loading, error: reduxError } = useAuthDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.role === UserRole.Admin) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      const result = await signIn(email, password);

      if (result.type === "auth/signIn/fulfilled") {
        setTimeout(() => {
          // After signIn, check if user is admin
          console.log("userProfile : ",result,result.payload);
          const userProfile = result.payload as any;
          if (user?.role === UserRole.Admin) {
            router.push("/dashboard");
          } else {
            setLocalError("Access denied. Admin credentials required.");
          }
        }, 500);
      } else {
        setLocalError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setLocalError("Invalid email or password. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500 opacity-10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo and header */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">G-Teach</span>
        </Link>

        {/* Admin badge */}
        <div className="mb-6 flex items-center justify-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 py-3 px-4">
          <ShieldCheck className="h-5 w-5 text-blue-400" />
          <span className="text-sm font-semibold text-blue-200">
            Admin Portal
          </span>
        </div>

        <Card className="border-slate-700 bg-slate-800">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-white">
              Administrator Login
            </CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {(localError || reduxError) && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">
                  {localError || reduxError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@g-teach.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-slate-600 bg-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-200">
                    Password
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="border-slate-600 bg-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-slate-500">
          This is a restricted area for administrators only.
          <br />
          Unauthorized access attempts are logged.
        </p>
      </div>
    </div>
  );
}
