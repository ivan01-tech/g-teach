"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  CheckCircle2,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { EXAM_TYPES, type School } from "@/lib/types";
import Image from "next/image";

interface SchoolCardProps {
  school: School;
  onViewProfile?: (school: School) => void;
}

export function SchoolCard({ school, onViewProfile }: SchoolCardProps) {
  const t = useTranslations("school-card");

  const hasLogo = !!school.logo;

  return (
    <TooltipProvider>
      <Card className="group overflow-hidden border-border/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card h-full flex flex-col">

        {/* HEADER avec logo en fond */}
        <div className="relative h-48 overflow-hidden bg-linear-to-br from-primary/5 via-primary/10 to-transparent">

          {/* Logo en grand format (fond) */}
          {school.logo ? (
            <div className="absolute inset-0  transition-transform duration-500 group-hover:scale-135">
              <Image
              width={300}
              height={300}
                src={school.logo}
                alt={school.name}
                className="w-full h-full object-cover "
              />
            </div>
          ) : (
            <div className="absolute inset-0 opacity-10 bg-linear-to-br from-primary/20 to-transparent" />
          )}

          {/* Logo principal centré et bien visible */}
          {/* <div className="absolute inset-0 flex items-center justify-center z-10">
            <div
              className={cn(
                "relative flex items-center justify-center rounded-2xl shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-1",
                hasLogo ? "h-28 w-28 bg-white/90 backdrop-blur-sm p-3" : "h-24 w-24 bg-primary/10"
              )}
            >
              {school.logo ? (
                <Image
                  src={school.logo} width={300}
              height={300}
                  alt={school.name}
                  className="h-full w-full object-contain drop-shadow-md"
                />
              ) : (
                <GraduationCap className="h-14 w-14 text-primary/70" />
              )}
            </div>
          </div> */}

          {/* Badge vérifié en haut à droite */}
          {school.verificationStatus === "verified" && (
            <div className="absolute top-4 right-4 z-20">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="rounded-full bg-white/90 p-1.5 shadow-md backdrop-blur-sm">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("verified")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* CONTENU PRINCIPAL */}
        <CardContent className="p-5 flex flex-col grow">

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {school.name}
              </h3>

              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {school.location?.city}, {school.location?.country}
                </span>
              </div>
            </div>

            {/* Rating */}
            {school.rating > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full shrink-0">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-sm">{school.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* EXAMS */}
          <div className="mt-2 mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80 mb-2 flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              {t("examsPrepared")}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {school.exams.slice(0, 4).map((exam) => (
                <Badge
                  key={exam}
                  variant="outline"
                  className="text-xs bg-background/60 hover:bg-background border-primary/30"
                >
                  {EXAM_TYPES.find(e => e.value === exam)?.label || exam}
                </Badge>
              ))}

              {school.exams.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{school.exams.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-4 border-t border-border/40 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {school.levels?.length || 0}
              </span>{" "}
              {t("levelsAvailable", { count: school.levels?.length || 0 })}
            </div>

            <Button
              size="sm"
              className="rounded-full px-6 font-medium text-sm shadow-sm hover:shadow-md transition-all"
              onClick={() => onViewProfile?.(school)}
            >
              {t("viewProfile")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}