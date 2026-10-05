"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen font-sans bg-white text-zinc-900">
      {/* ── Left panel: Brand & Value Prop ── */}
      <motion.div
        className="relative flex flex-col justify-between flex-1 p-8 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-200"
        style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #f8fafc 100%)" }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Subtle grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,132,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,132,255,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Back to Home & Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <FaArrowLeft size={12} />
            Back to Home
          </Link>
          <span className="font-bitcount text-2xl font-bold tracking-[0.18em] text-blue-600">
            BUGHIVE
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-lg my-12 lg:my-0">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight"
          >
            Your open-source contribution,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              verified.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-4 text-zinc-500 text-sm lg:text-base leading-relaxed"
          >
            Every contribution is backed by live GitHub pull requests and reviewed through a structured
            impact rubric — establishing undeniable credibility for developers and hiring managers.
          </motion.p>
        </div>

        {/* Footer stats */}
        <motion.div
          className="relative z-10 flex gap-8 pt-6 border-t border-zinc-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {[
            { value: "3 Roles", label: "Supported" },
            { value: "Live PRs", label: "Verified" },
            { value: "100%", label: "Peer Audited" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-blue-600 font-bold text-sm lg:text-base">{s.value}</p>
              <p className="text-zinc-400 text-xs">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Right panel: Auth content ── */}
      <div className="flex flex-1 flex-col justify-center items-center bg-white p-8 lg:p-14">
        {children}
      </div>
    </main>
  );
}
