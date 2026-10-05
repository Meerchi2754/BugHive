"use client";

import Link from "next/link";
import { useTheme } from "@/context/themeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function LandingFooter() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            ⚡
          </div>
          <span className="font-bitcount font-bold text-zinc-900 dark:text-white tracking-[0.18em] text-base">
            BUGHIVE
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-zinc-500 text-xs">Open Source Proof of Engineering</span>
        </div>

        {/* Links & Theme Changer */}
        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="#rubric" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Rubric
          </Link>

          {/* Theme Changer Icon Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs transition-all cursor-pointer font-medium"
          >
            {theme === "dark" ? (
              <>
                <FiSun size={14} className="text-amber-400" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <FiMoon size={14} className="text-blue-600" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Copyright */}
        <div className="text-zinc-400 dark:text-zinc-600 text-[11px]">
          &copy; {new Date().getFullYear()} BugHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
