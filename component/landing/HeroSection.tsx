"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaCheckCircle, FaStar, FaCodeBranch, FaShieldAlt } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-white dark:bg-zinc-950 transition-colors duration-200">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-blue-500/10 dark:bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[450px] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,116,139,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Headline & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-ping" />
            Next-Gen Proof of Engineering
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-[1.15]"
          >
            Your open-source contributions,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              verified &amp; scored.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed"
          >
            Cut through vanity commits. Every contribution is verified directly against live GitHub pull
            requests and audited via a peer-reviewed engineering rubric — building undeniable proof for top
            engineering teams.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              Start Verifying PRs →
            </Link>
            <Link
              href="#how-it-works"
              className="px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white font-semibold text-base transition-all"
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 flex flex-wrap items-center gap-8 pt-8 border-t border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-400"
          >
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-emerald-600 dark:text-emerald-400" size={15} />
              <span>Cryptographically Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600 dark:text-blue-400" size={15} />
              <span>3-Way Peer Rubric</span>
            </div>
            <div className="flex items-center gap-2">
              <FaGithub className="text-zinc-800 dark:text-zinc-200" size={15} />
              <span>Native GitHub Sync</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Live Interactive Claim Card Mockup */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/90 p-6 sm:p-7 shadow-xl shadow-zinc-200/60 dark:shadow-2xl backdrop-blur-xl"
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                  <FaCodeBranch size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-sm tracking-tight">vercel / next.js</h4>
                  <p className="text-zinc-500 text-xs">Pull Request #62891</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <FaCheckCircle size={11} />
                VERIFIED
              </span>
            </div>

            {/* Claim Title & Description */}
            <h3 className="text-zinc-900 dark:text-white font-bold text-base leading-snug">
              Optimized Turbopack incremental build cache pipeline &amp; AST serialization
            </h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
              Reduced average HMR cold-boot compile time by 34% across mono-repos with over 5,000 components.
            </p>

            {/* Score & Rubric Pill */}
            <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/70 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-zinc-500">
                  Impact Score
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                    94
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs font-semibold">/ 100</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 text-right">
                <div className="flex items-center justify-end gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  <FaStar size={11} className="text-amber-500 dark:text-amber-400" />
                  <span>Architecture: 9.6</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  <FaStar size={11} className="text-amber-500 dark:text-amber-400" />
                  <span>Complexity: 9.3</span>
                </div>
              </div>
            </div>

            {/* Verifier Proof Line */}
            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Audited by 2 Maintainers</span>
              <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">Hash: 8f2a...c91e</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
