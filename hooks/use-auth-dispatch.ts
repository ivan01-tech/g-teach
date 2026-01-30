"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  signUp,
  signIn,
  logout,
  updateUserProfile,
} from "@/app/[locale]/auth/thunks";
import { UserRole } from "@/lib/roles";

/**
 * Hook for auth dispatch actions
 * Encapsulates all auth-related Redux actions
 */
export function useAuthDispatch() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, userProfile, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  return {
    // Actions
    signUp: (
      email: string,
      password: string,
      displayName: string,
      role: UserRole,
    ) => dispatch(signUp({ email, password, name: displayName, role })),

    signIn: (email: string, password: string) =>
      dispatch(signIn({ email, password })),

    logout: () => dispatch(logout()),

    updateUserProfile: (updates: any) => dispatch(updateUserProfile(updates)),

    // sendPasswordReset: (email: string) => dispatch(sendPasswordResetEmail(email)),

    // State
    user,
    userProfile,
    loading,
    error,
    isAuthenticated: !!user,
  };
}
