"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, CheckCircle2, MapPin, GraduationCap } from "lucide-react"
import { EXAM_TYPES, type School } from "@/lib/types"
import { useTranslations } from "next-intl"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SchoolCardProps {
    school: School
    onViewProfile?: (school: School) => void
}

export function SchoolCard({ school, onViewProfile }: SchoolCardProps) {
    const t = useTranslations("school-card")

    return (
        <TooltipProvider>
            <Card className="group overflow-hidden transition-all hover:shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                    {/* Header/Logo Section */}
                    <div className="relative aspect-video overflow-hidden bg-primary/5 p-6 flex items-center justify-center">
                        <div className="relative z-10 h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-105">
                            {/* <img
                                src={school.logo}
                                alt={school.name}
                                className="h-full w-full object-contain p-2"
                            /> */}

                            {school.logo ? (
                                <img
                                    src={school.logo}
                                    alt={school.name}
                                    className="h-full w-full object-contain p-2"
                                />
                            ) : (
                                <GraduationCap className="h-12 w-12 text-primary/50" />
                            )}
                        </div>
                        {/* Subtle background decoration */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opaicty-50" />
                    </div>

                    {/* Content Section */}
                    <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                                        {school.name}
                                    </h3>
                                    {/* {school?.isVerified && ( */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t("verified")}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    {/* )} */}
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span>{school.location.city}, {school.location.country}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-full shrink-0">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold">{school.rating}</span>
                            </div>
                        </div>

                        {/* Exams & Levels */}
                        <div className="mt-4 space-y-3">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-1.5 flex items-center gap-1">
                                    <GraduationCap className="h-3 w-3" />
                                    {t("examsPrepared")}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {school.exams.slice(0, 3).map((exam) => (
                                        <Badge key={exam} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-[10px] font-medium px-2 py-0">
                                            {EXAM_TYPES.find(e => e.value === exam)?.label || exam}
                                        </Badge>
                                    ))}
                                    {school.exams.length > 3 && (
                                        <span className="text-[10px] text-muted-foreground flex items-center">
                                            +{school.exams.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
                                <div className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">{school.levels.length}</span> {t("levelsAvailable")}
                                </div>
                                <Button 
                                    size="sm" 
                                    className="rounded-full px-5 font-semibold text-xs" 
                                    onClick={() => onViewProfile?.(school)}
                                >
                                    {t("viewProfile")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}
