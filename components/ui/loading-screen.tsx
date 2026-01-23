"use client";

import { Loader, Loader2 } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-colors duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer Glow */}
                <div className="absolute inset-0 scale-150 animate-pulse bg-blue-500/10 blur-3xl rounded-full" />

                {/* Spinner */}
                <Loader className="h-16 w-16 animate-spin text-blue-600 dark:text-blue-400 drop-shadow-xl" />
            </div>

            {/* Text Branding */}
            <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    G-Teach
                </h1>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Initialisation de votre espace...
                </p>
            </div>

            {/* Progress Bar (Pure Visual) */}
            <div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-1/3 animate-[loading_2s_infinite_ease-in-out] rounded-full bg-blue-600 dark:bg-blue-400" />
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
