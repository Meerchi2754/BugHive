"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Connect & Submit Live PR",
    description:
      "Authenticate with GitHub and submit any merged Pull Request. BugHive automatically extracts lines changed, AST complexity, and discussions.",
    badge: "Instant Extraction",
  },
  {
    step: "02",
    title: "Rigorous Rubric Auditing",
    description:
      "Qualified verifiers score the contribution on architectural depth, codebase scalability, edge-case handling, and peer collaboration.",
    badge: "Peer-Audited",
  },
  {
    step: "03",
    title: "Deploy Cryptographic Proof",
    description:
      "Your verified claims are indexed to your public profile (/u/username) with immutable cryptographic badges ready for resume embedding.",
    badge: "Live Portfolio",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/20">
            The Verification Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-4 tracking-tight">
            How BugHive verifies real impact
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-3">
            A transparent 3-step framework that turns GitHub code into tamper-proof proof of work.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-lg shadow-zinc-200/50 dark:shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
                    {item.step}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 transition-all duration-700"
                  style={{ width: `${(idx + 1) * 33.33}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
