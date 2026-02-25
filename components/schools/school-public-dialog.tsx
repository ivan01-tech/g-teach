"use client"

import { useEffect } from "react"
import { EXAM_TYPES, GERMAN_LEVELS, School } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Star, MapPin, Phone, Mail, Globe, ExternalLink, CheckCircle } from "lucide-react"
import { SchoolMapPreview } from "@/components/student/school-map-preview"
import { SchoolReviewForm } from "@/components/schools/school-review-form"
import { SchoolReviewsList } from "@/components/schools/school-reviews-list"
import { incrementSchoolProfileViews } from "@/lib/services/school-service"

interface SchoolPublicDialogProps {
    open: boolean
    school?: School
    onOpenChange: (open: boolean) => void
}

export function SchoolPublicDialog({ open, school, onOpenChange }: SchoolPublicDialogProps) {
    const t = useTranslations()

    useEffect(() => {
        if (open && school?.id) {
            incrementSchoolProfileViews(school.id)
        }
    }, [open, school?.id])

    if (!school) return null

    const getVerificationStatus = (status: string) => {
        switch (status) {
            case "verified":
                return { label: t("Verified"), color: "bg-green-500/10 text-green-700 border-green-200" }
            case "rejected":
                return { label: t("Rejected"), color: "bg-red-500/10 text-red-700 border-red-200" }
            default:
                return { label: t("Pending Verification"), color: "bg-yellow-500/10 text-yellow-700 border-yellow-200" }
        }
    }

    const statusInfo = getVerificationStatus(school.verificationStatus)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("School Profile")}</DialogTitle>
                    <DialogDescription>
                        {t("Complete information about this language school")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                {school.logo && (
                                    <img
                                        src={school.logo}
                                        alt={school.name}
                                        className="h-24 w-24 rounded-lg object-cover"
                                    />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-3xl font-bold text-foreground">{school.name}</h1>
                                        {school.verificationStatus === "verified" && (
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                                            {school.location.city}, {school.location.country}
                                        </span>
                                    </div>
                                    {school.location.address && (
                                        <p className="text-sm text-muted-foreground">{school.location.address}</p>
                                    )}
                                    <Badge className={`mt-2 ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </Badge>
                                </div>
                            </div>

                            {/* Rating */}
                            {school.rating > 0 && (
                                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg">
                                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                    <div>
                                        <div className="font-bold text-lg">{school.rating.toFixed(1)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {school.reviewCount} {school.reviewCount === 1 ? t("review") : t("reviews")}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {school.description && (
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">{t("About")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{school.description}</p>
                        </div>
                    )}

                    {/* About This School */}
                    {school.about && (
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">{t("About This School")}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{school.about}</p>
                        </div>
                    )}

                    {/* Exams & Levels */}
                    <div className="grid grid-cols-2 gap-4">
                        {school.exams && school.exams.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    {t("Exams")}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {school.exams.map((exam) => (
                                        <Badge key={exam} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {EXAM_TYPES.find(e => e.value === exam)?.label || exam}

                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {school.levels && school.levels.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-foreground mb-2">{t("Levels")}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {school.levels.map((level) => (
                                        <Badge key={level} variant="outline" className="border-purple-200 text-purple-700">
                                            {GERMAN_LEVELS.find(e => e.value === level)?.label || level}

                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map */}
                    {school.location.latitude && school.location.longitude && (
                        <>
                            <div className="border-t pt-4" />
                            <SchoolMapPreview
                                schoolName={school.name}
                                latitude={school.location.latitude}
                                longitude={school.location.longitude}
                                address={school.location.address}
                                city={school.location.city}
                                country={school.location.country}
                            />
                        </>
                    )}

                    {/* Contact Information */}
                    {(school.phone || school.email || school.website) && (
                        <>
                            <div className="border-t pt-4" />
                            <div>
                                <h3 className="font-semibold text-foreground mb-3">{t("Contact")}</h3>
                                <div className="space-y-2">
                                    {school.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <a href={`tel:${school.phone}`} className="text-sm text-primary hover:underline">
                                                {school.phone}
                                            </a>
                                        </div>
                                    )}
                                    {school.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <a href={`mailto:${school.email}`} className="text-sm text-primary hover:underline">
                                                {school.email}
                                            </a>
                                        </div>
                                    )}
                                    {school.website && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                                                {school.website}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Statistics */}
                    {(school.profileViews || school.totalStudents || school.totalLessons) && (
                        <>
                            <div className="border-t pt-4" />
                            <div>
                                <h3 className="font-semibold text-foreground mb-3">{t("Statistics")}</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    {school.profileViews && (
                                        <Card>
                                            <CardContent className="pt-4 text-center">
                                                <div className="text-2xl font-bold text-foreground">
                                                    {school.profileViews}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{t("Profile Views")}</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {school.totalStudents && (
                                        <Card>
                                            <CardContent className="pt-4 text-center">
                                                <div className="text-2xl font-bold text-foreground">
                                                    {school.totalStudents}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{t("Total Students")}</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                    {school.totalLessons && (
                                        <Card>
                                            <CardContent className="pt-4 text-center">
                                                <div className="text-2xl font-bold text-foreground">
                                                    {school.totalLessons}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">{t("Total Lessons")}</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Reviews Section */}
                    <>
                        <div className="border-t pt-4" />
                        <div>
                            <h3 className="font-semibold text-foreground mb-4">{t("Reviews")}</h3>
                            <div className="space-y-4">
                                <SchoolReviewForm schoolId={school.id} />
                                <SchoolReviewsList schoolId={school.id} />
                            </div>
                        </div>
                    </>
                </div>
            </DialogContent>
        </Dialog>
    )
}
