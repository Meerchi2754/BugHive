"use client";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCodeBranch, FaCheckCircle, FaBriefcase } from "react-icons/fa";

const roles = [
  {
    label: "Developer / Contributor",
    description: "Submit PRs and build your portfolio",
    icon: <FaCodeBranch size={18} />,
    role: "CONTRIBUTOR",
    id: "role-developer",
  },
  {
    label: "Verifier / Project Manager",
    description: "Review and validate contributions",
    icon: <FaCheckCircle size={18} />,
    role: "VERIFIER",
    id: "role-verifier",
  },
  {
    label: "Maintainer / Hiring Manager",
    description: "Manage projects and evaluate talent",
    icon: <FaBriefcase size={18} />,
    role: "MAINTAINER",
    id: "role-maintainer",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  const router = useRouter();

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

        {/* Logo / Brand */}
        <div className="relative z-10">
          <span
            style={{
              fontFamily: "'Bitcount Grid Single', sans-serif",
              fontSize: "2.9rem",
              color: "#60a5fa",
              letterSpacing: "0.18em",
            }}
          >
            BUGHIVE
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 max-w-sm">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-white font-bold"
            style={{ fontSize: "2.4rem", lineHeight: 1.2 }}
          >
            Your open‑source<br />contribution,{" "}
            <span style={{ color: "#60a5fa" }}>verified.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-5"
            style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}
          >
            Every contribution is backed by a live GitHub pull request and
            reviewed through a structured impact rubric — building trust for
            developers, verifiers, and hiring managers alike.
          </motion.p>
        </div>

        {/* Footer stats */}
        <motion.div
          className="relative z-10 flex gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
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
        </motion.div>
      </motion.div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col justify-center items-center bg-zinc-50 px-12">
        <motion.div
          className="w-full max-w-sm"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <p style={{ color: "#64748b", fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Get started
            </p>
            <h2 style={{ color: "#0f172a", fontWeight: 700, fontSize: "2.25rem" }}>
              Select your role
            </h2>
          </motion.div>

          {/* Role cards */}
          <div className="flex flex-col gap-3">
            {roles.map((r) => (
              <motion.button
                key={r.role}
                id={r.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/register?role=${encodeURIComponent(r.role)}`)}
                className="cursor-pointer text-left w-full flex items-center gap-4"
                style={{
                  background: "#ffffff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "14px",
                  padding: "16px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#60a5fa";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(96,165,250,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#3b82f6",
                    flexShrink: 0,
                  }}
                >
                  {r.icon}
                </span>
                <div>
                  <p style={{ color: "#0f172a", fontWeight: 600, fontSize: "0.95rem" }}>{r.label}</p>
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "2px" }}>{r.description}</p>
                </div>
                <span style={{ marginLeft: "auto", color: "#cbd5e1", fontSize: "1rem" }}>›</span>
              </motion.button>
            ))}
          </div>

          <motion.p
            variants={itemVariants}
            style={{ color: "#94a3b8", fontSize: "0.78rem", textAlign: "center", marginTop: "28px" }}
          >
            By continuing you agree to our Terms &amp; Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
