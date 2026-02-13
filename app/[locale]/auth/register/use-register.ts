"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux-store-hooks";
import { UserRole } from "@/lib/roles";
import { validateRegister } from "@/validators/register.validator";
import { signUp } from "../thunks";

export function useRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.Student);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateRegister(password, confirmPassword);

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const resultAction = await dispatch(signUp({ email, password, name, role }));

            if (signUp.fulfilled.match(resultAction)) {
                // If tutor, create tutor profile and redirect to betreuer
                if (role === "tutor") {
                    router.push("/betreuer");
                } else {
                    router.push("/student");
                }
            } else {
                setError(resultAction.payload as string || "Failed to create account. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        role,
        setRole,
        error,
        setError,
        loading,
        handleSubmit,
    };
}
