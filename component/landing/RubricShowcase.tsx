"use client";

import { motion } from "framer-motion";
import { FaLayerGroup, FaCheckCircle, FaComments, FaChartLine } from "react-icons/fa";

const rubricPillars = [
  {
    icon: <FaLayerGroup className="text-blue-600 dark:text-blue-400" size={20} />,
    title: "Architectural Complexity",
    weight: "35% Weight",
    desc: "Evaluates modularity, dependency management, concurrency, and systemic interface design.",
  },
  {
    icon: <FaCheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />,
    title: "Code Quality & Rigor",
    weight: "25% Weight",
    desc: "Assesses type-safety, test coverage, algorithmic efficiency, and adherence to clean code idioms.",
  },
  {
    icon: <FaComments className="text-purple-600 dark:text-purple-400" size={20} />,
    title: "Collaboration & Communication",
    weight: "20% Weight",
    desc: "Measures clarity of PR descriptions, handling maintainer feedback, and technical discourse.",
  },
  {
    icon: <FaChartLine className="text-cyan-600 dark:text-cyan-400" size={20} />,
    title: "Production Impact & Scale",
    weight: "20% Weight",
    desc: "Analyzes runtime performance gains, latency reductions, bug severity, and user impact.",
  },
];

export default function RubricShowcase() {
  return (
    <section id="rubric" className="py-24 bg-zinc-50/70 dark:bg-zinc-950/90 border-t border-zinc-200 dark:border-zinc-900 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-200 dark:border-cyan-500/20">
              Evaluation Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-4 tracking-tight leading-tight">
              A standardized scoring rubric for real engineering
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              No generic leetcode questions or superficial GitHub stars. BugHive evaluates engineers on the
              multidimensional reality of production software engineering.
            </p>
          </div>

          {/* Right pillars grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rubricPillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 p-5.5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700/60">
                    {pillar.weight}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">{pillar.title}</h4>
                <p className="mt-1.5 text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
