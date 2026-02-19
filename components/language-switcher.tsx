"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const toggleLanguage = (newLocale: string) => {
        if (newLocale === locale) return;

        // Replace the first part of the pathname with the new locale
        // Pathname starts with /locale/ or just /locale
        const segments = pathname.split("/");
        segments[1] = newLocale;
        const newPath = segments.join("/");

        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleLanguage("fr")} className={locale === "fr" ? "bg-accent" : ""}>
                    Français {locale === "fr" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleLanguage("en")} className={locale === "en" ? "bg-accent" : ""}>
                    English {locale === "en" && "✓"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
