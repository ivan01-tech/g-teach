import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/lib/hooks'
import { UserRole } from '@/lib/roles'

/**
 * Hook to check if user has admin role
 * Redirects to login if not authenticated or not admin
 */
export function useAdminProtection(): {
  isAdmin: boolean
  loading: boolean
} {
  const router = useRouter()
  const { user, userProfile, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Only check after loading is complete
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user || !userProfile) {
        router.push('/auth/admin-login')
        return
      }

      // If not admin, redirect to their respective dashboard
      if (userProfile.role === UserRole.Admin) {
          router.push('/dashboard')
        }else {
          router.push('/auth/not-authorised')
        }
    }
  }, [loading, user, userProfile, router])

  return {
    isAdmin: userProfile?.role === UserRole.Admin && !!user,
    loading,
  }
}

/**
 * Hook to just check admin status without redirecting
 * Useful for conditional rendering
 */
export function useIsAdmin(): boolean {
  const { userProfile, loading } = useAppSelector((state) => state.auth)
  
  if (loading) return false
  
  return userProfile?.role === UserRole.Admin
}
