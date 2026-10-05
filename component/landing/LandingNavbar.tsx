"use client";

import Link from "next/link";
import { useAuth } from "@/context/authContext";

export default function LandingNavbar() {
  const { user, isLoading } = useAuth();

  const getDashboardUrl = () => {
    if (!user) return "/login";
    if (user.role === "MAINTAINER")
      return "/maintainer/shortlist";
    if (user.role === "VERIFIER") return "/verify/claims";
    return "/dashboard/claims";
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-950/75 border-b border-zinc-200/80 dark:border-zinc-800/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <span className="font-bitcount text-4xl tracking-[0.18em] font-bold text-zinc-900 dark:text-white">
            BUG
          </span>
          <span className="font-bitcount text-4xl tracking-[0.18em] font-bold text-blue-600 dark:text-blue-400">
            HIVE
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link
            href="#how-it-works"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#features"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Roles &amp; Value
          </Link>
          <Link
            href="#rubric"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Impact Rubric
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3.5">
          {!isLoading && user ? (
            <Link
              href={getDashboardUrl()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
