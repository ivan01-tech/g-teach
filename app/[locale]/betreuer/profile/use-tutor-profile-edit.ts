"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTutorProfile } from "@/hooks/use-tutor-profile";
import {
    createTutorProfile,
    updateTutorProfile,
    uploadTutorPhoto,
} from "@/lib/services/tutor-service";
import type { AvailabilitySlot } from "@/lib/types";

export function useTutorProfileEdit() {
    const { user } = useAuth();
    const { tutorProfile, loading } = useTutorProfile();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
        hourlyRate: "",
        // currency: "EUR",
        country: "",
        timezone: "",
        teachingLevels: [] as string[],
        examTypes: [] as string[],
        specializations: [] as string[],
        availability: [] as AvailabilitySlot[],
    });

    // Initialize form data when tutor profile loads
    useEffect(() => {
        if (tutorProfile) {
            setFormData({
                displayName: tutorProfile.displayName || "",
                bio: tutorProfile.bio || "",
                hourlyRate: tutorProfile.hourlyRate?.toString() || "",
                // currency: tutorProfile.currency || "EUR",
                country: tutorProfile.country || "",
                timezone: tutorProfile.timezone || "",
                teachingLevels: tutorProfile.teachingLevels || [],
                examTypes: tutorProfile.examTypes || [],
                specializations: tutorProfile.specializations || [],
                availability: tutorProfile.availability || [],
            });
        }
    }, [tutorProfile]);

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setPhotoPreview(URL.createObjectURL(file));
        setUploading(true);

        try {
            await uploadTutorPhoto(user.uid, file);
        } catch (error) {
            console.error("Error uploading photo:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleCheckboxChange = (
        field: "teachingLevels" | "examTypes" | "specializations",
        value: string,
        checked: boolean
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter((v) => v !== value),
        }));
    };

    const addAvailabilitySlot = () => {
        setFormData((prev) => ({
            ...prev,
            availability: [
                ...prev.availability,
                { day: "Monday", startTime: "09:00", endTime: "17:00" },
            ],
        }));
    };

    const removeAvailabilitySlot = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            availability: prev.availability.filter((_, i) => i !== index),
        }));
    };

    const updateAvailabilitySlot = (
        index: number,
        field: keyof AvailabilitySlot,
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            availability: prev.availability.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            ),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);

        try {
            const profileData = {
                ...formData,
                hourlyRate: parseFloat(formData.hourlyRate) || 0,
                email: user.email || "",
            };

            if (tutorProfile) {
                await updateTutorProfile(user.uid, profileData);
            } else {
                await createTutorProfile(user.uid, profileData);
            }
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSaving(false);
        }
    };

    return {
        user,
        tutorProfile,
        loading,
        fileInputRef,
        saving,
        uploading,
        photoPreview,
        formData,
        setFormData,
        handlePhotoChange,
        handleCheckboxChange,
        addAvailabilitySlot,
        removeAvailabilitySlot,
        updateAvailabilitySlot,
        handleSubmit,
    };
}
