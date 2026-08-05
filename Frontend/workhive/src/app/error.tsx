"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import {
  LuTriangleAlert,
  LuRefreshCcw,
  LuHouse,
  LuTerminal
} from "react-icons/lu";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ui-main flex items-center justify-center p-6 font-sans relative overflow-hidden">

      {/* Ambient Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-buttons/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Error Card */}
      <div className="relative w-full max-w-lg bg-ui-secondary rounded-3xl border border-ui-tertiary/10 shadow-2xl overflow-hidden backdrop-blur-sm p-8 md:p-10 text-center animate-in fade-in zoom-in-95 duration-300">

        {/* Top Decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

        {/* Icon Wrapper */}
        <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <LuTriangleAlert size={40} className="text-red-500" />
        </div>

        {/* Headings */}
        <h1 className="text-3xl font-bold text-texts-primary mb-2">
          An Error Occured
        </h1>
        <p className="text-texts-secondary mb-8">
          We encountered an unexpected issue while processing your request.
        </p>

        {/* Custom Error Message Display */}
        <div className="bg-ui-main rounded-xl p-4 mb-8 border border-ui-tertiary/20 text-left relative group">
          <div className="flex items-center gap-2 mb-2 border-b border-ui-tertiary/10 pb-2">
            <LuTerminal size={14} className="text-texts-secondary" />
            <span className="text-xs font-mono text-texts-secondary uppercase tracking-wider">Error Log</span>
          </div>
          <p className="font-mono text-sm text-red-400 break-words leading-relaxed">
            {error.message || "Unknown error occurred"}
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-texts-secondary/50 mt-2">
              Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-buttons text-ui-main rounded-xl font-bold hover:bg-buttons/90 hover:scale-105 transition-all shadow-lg shadow-buttons/20 active:scale-95"
          >
            <LuRefreshCcw size={18} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-ui-main border border-ui-tertiary/20 text-texts-secondary rounded-xl font-medium hover:text-texts-primary hover:border-buttons/50 transition-all hover:bg-ui-tertiary/5"
          >
            <LuHouse size={18} />
            Back to Home
          </Link>
        </div>

      </div>

      {/* Footer / Contact Hint */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-texts-secondary">
          If this persists, please contact <a href="#" className="text-buttons hover:underline">WorkHive Support</a>
        </p>
      </div>

    </div>
  );
}