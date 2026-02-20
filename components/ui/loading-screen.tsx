"use client";

import { Loader } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-colors duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow - using primary color */}
                <div className="absolute inset-0 scale-150 animate-pulse bg-primary/10 blur-3xl rounded-full" />

                {/* Spinner - using primary color */}
                <Loader className="h-16 w-16 animate-spin text-primary drop-shadow-xl" />
            </div>

            {/* Text Branding */}
            <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    G-Teach
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                    Initialisation de votre espace...
                </p>
            </div>

            {/* Progress Bar (Pure Visual) */}
            <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/3 animate-[loading_2s_infinite_ease-in-out] rounded-full bg-primary" />
            </div>

            <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
}
