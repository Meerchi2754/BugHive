"use client";

import { motion } from "framer-motion";
import { FaCodeBranch, FaCheckDouble, FaBriefcase, FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const rolesData = [
  {
    role: "CONTRIBUTOR",
    title: "For Developers & Contributors",
    tagline: "Turn merged PRs into verifiable engineering credentials",
    icon: <FaCodeBranch size={22} className="text-blue-600 dark:text-blue-400" />,
    gradient: "from-blue-500/10 dark:from-blue-600/20 via-blue-500/5 to-transparent",
    borderColor: "border-blue-200 dark:border-blue-500/30",
    features: [
      "Auto-sync PR diffs, commits, and discussion from GitHub",
      "Get scored on architecture, scale, and performance",
      "Showcase a live cryptographic portfolio URL (/u/username)",
      "Stand out to hiring managers with real code proof",
    ],
    ctaText: "Start Building Portfolio",
    ctaLink: "/login",
  },
  {
    role: "VERIFIER",
    title: "For Verifiers & Peer Reviewers",
    tagline: "Certify code impact and mentor the next wave of engineers",
    icon: <FaCheckDouble size={22} className="text-emerald-600 dark:text-emerald-400" />,
    gradient: "from-emerald-500/10 dark:from-emerald-600/20 via-emerald-500/5 to-transparent",
    borderColor: "border-emerald-200 dark:border-emerald-500/30",
    features: [
      "Review PR claims with structured engineering rubrics",
      "Assess technical depth, maintainability, and complexity",
      "Build reputation as a recognized open-source validator",
      "Earn verifier impact badges on your own profile",
    ],
    ctaText: "Join as a Verifier",
    ctaLink: "/login",
  },
  {
    role: "MAINTAINER",
    title: "For Maintainers & Hiring Teams",
    tagline: "Discover and evaluate proven engineering talent instantly",
    icon: <FaBriefcase size={22} className="text-purple-600 dark:text-purple-400" />,
    gradient: "from-purple-500/10 dark:from-purple-600/20 via-purple-500/5 to-transparent",
    borderColor: "border-purple-200 dark:border-purple-500/30",
    features: [
      "Search talent filtered by verified PR impact scores",
      "Directly inspect actual code diffs and peer reviews",
      "Shortlist candidates and track contribution velocity",
      "Eliminate fake resumes with tamper-proof proof of work",
    ],
    ctaText: "Discover Talent",
    ctaLink: "/login",
  },
];

export default function RoleFeatures() {
  return (
    <section id="features" className="py-24 bg-zinc-50/70 dark:bg-zinc-950/80 border-t border-zinc-200 dark:border-zinc-900 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-500/20">
            Tailored Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-4 tracking-tight">
            Designed for the entire engineering lifecycle
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-base mt-3 leading-relaxed">
            Whether you are writing code, auditing technical complexity, or recruiting top builders — BugHive
            empowers your workflow.
          </p>
        </div>

        {/* 3 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rolesData.map((item, idx) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`rounded-3xl p-8 bg-gradient-to-b ${item.gradient} bg-white dark:bg-zinc-900/60 border ${item.borderColor} flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-lg shadow-zinc-200/50 dark:shadow-xl`}
            >
              <div>
                {/* Role Icon */}
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center mb-6 shadow-xs">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-1.5 leading-relaxed font-medium">{item.tagline}</p>

                {/* Features list */}
                <ul className="mt-6 space-y-3">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 leading-normal">
                      <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                <Link
                  href={item.ctaLink}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                  <span>{item.ctaText}</span>
                  <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
