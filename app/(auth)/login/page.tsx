"use client";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaCodeBranch, FaCheckCircle, FaBriefcase } from "react-icons/fa";
import Link from "next/link";

const roles = [
  {
    label: "Developer / Contributor",
    description: "Submit PRs and build your verified portfolio",
    icon: <FaCodeBranch size={18} />,
    role: "CONTRIBUTOR",
    id: "role-developer",
  },
  {
    label: "Verifier / Project Manager",
    description: "Review and validate open source contributions",
    icon: <FaCheckCircle size={18} />,
    role: "VERIFIER",
    id: "role-verifier",
  },
  {
    label: "Maintainer / Hiring Manager",
    description: "Manage projects and discover evaluated talent",
    icon: <FaBriefcase size={18} />,
    role: "MAINTAINER",
    id: "role-maintainer",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function LoginPage() {
  const router = useRouter();

  return (
    <motion.div
      className="w-full max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
          Authentication Portal
        </p>
        <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
          Select your workspace role
        </h2>
        <p className="text-zinc-500 text-sm mt-1.5">
          Choose your profile type to sign in or create your account.
        </p>
      </motion.div>

      {/* Role cards */}
      <div className="flex flex-col gap-3.5">
        {roles.map((r) => (
          <motion.button
            key={r.role}
            id={r.id}
            variants={itemVariants}
            whileHover={{ scale: 1.015, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.985 }}
            onClick={() => router.push(`/register?role=${encodeURIComponent(r.role)}`)}
            className="cursor-pointer text-left w-full flex items-center gap-4 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-blue-400 rounded-2xl p-4.5 shadow-xs transition-all group"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 transition-colors flex-shrink-0">
              {r.icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-zinc-900 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                {r.label}
              </p>
              <p className="text-zinc-500 text-xs mt-0.5 truncate">{r.description}</p>
            </div>
            <span className="text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all text-sm font-bold">
              →
            </span>
          </motion.button>
        ))}
      </div>

      <motion.p
        variants={itemVariants}
        className="text-zinc-400 text-xs text-center mt-8"
      >
        By continuing, you agree to BugHive&apos;s{" "}
        <Link href="/" className="text-zinc-500 hover:underline">
          Terms of Service
        </Link>{" "}
        &amp;{" "}
        <Link href="/" className="text-zinc-500 hover:underline">
          Privacy Policy
        </Link>
      </motion.p>
    </motion.div>
  );
}
