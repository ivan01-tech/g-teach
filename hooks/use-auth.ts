import { useAppDispatch, useAppSelector } from "@/hooks/redux-store-hooks"
import { UserRole } from "@/lib/roles"
import { UserProfile } from "@/app/[locale]/auth/auth-slice"
import { logout, resetPassword, signIn, signUp, updateUserProfile } from "@/app/[locale]/auth/thunks"

export function useAuth() {
    const dispatch = useAppDispatch()
    const { user, userProfile, loading, error } = useAppSelector((state) => state.auth)

    const handleSignIn = async (email: string, password: string) => {
        const resultAction = await dispatch(signIn({ email, password }))
        if (signIn.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string)
        }
    }

    const handleSignUp = async (email: string, password: string, name: string, role: UserRole) => {
        const resultAction = await dispatch(signUp({ email, password, name, role }))
        if (signUp.rejected.match(resultAction)) {
            throw new Error(resultAction.payload as string)
        }
    }

    const handleLogout = async () => {
        await dispatch(logout())
    }

    const handleResetPassword = async (email: string) => {
        await dispatch(resetPassword(email))
    }

    const handleUpdateUserProfile = async (data: Partial<UserProfile>) => {
        await dispatch(updateUserProfile(data))
    }

    return {
        user,
        userProfile,
        loading,
        error,
        signIn: handleSignIn,
        signUp: handleSignUp,
        logout: handleLogout,
        resetPassword: handleResetPassword,
        updateUserProfile: handleUpdateUserProfile,
    }
}
