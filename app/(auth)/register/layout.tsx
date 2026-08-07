"use client";
import { motion } from "framer-motion";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row min-w-screen min-h-screen font-sans">
      {/* ── Left panel ── */}
      <motion.div
        className="relative flex flex-col justify-between flex-1 p-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a2236 0%, #0f172a 100%)" }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* subtle grid overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,132,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,132,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <span
            style={{
              fontFamily: "'Bitcount Grid Single', sans-serif",
              fontSize: "1.1rem",
              color: "#60a5fa",
              letterSpacing: "0.18em",
            }}
          >
            BUGHIVE
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-sm">
          <h1
            className="text-white font-bold"
            style={{ fontSize: "2.2rem", lineHeight: 1.25 }}
          >
            Your open‑source<br />contribution,{" "}
            <span style={{ color: "#60a5fa" }}>verified.</span>
          </h1>
          <p
            className="mt-5"
            style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}
          >
            Every contribution is backed by a live GitHub pull request and
            reviewed through a structured impact rubric — building trust for
            developers, verifiers, and hiring managers alike.
          </p>
        </div>

        {/* Footer stats */}
        <div className="relative z-10 flex gap-8">
          {[
            { value: "3 Roles", label: "Supported" },
            { value: "Live PRs", label: "Verified" },
            { value: "Open Source", label: "First" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ color: "#60a5fa", fontWeight: 700, fontSize: "0.9rem" }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: "0.75rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col justify-center items-center bg-zinc-50 px-12">
        {children}
      </div>
    </div>
  );
}
