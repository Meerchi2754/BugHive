import LandingNavbar from "@/component/landing/LandingNavbar";
import HeroSection from "@/component/landing/HeroSection";
import RoleFeatures from "@/component/landing/RoleFeatures";
import HowItWorks from "@/component/landing/HowItWorks";
import RubricShowcase from "@/component/landing/RubricShowcase";
import LandingFooter from "@/component/landing/LandingFooter";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white flex flex-col font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      {/* 1. Header Navigation */}
      <LandingNavbar />

      {/* 2. Main Landing Content */}
      <main className="flex-1">
        <HeroSection />

        {/* 3. Role Breakdown & Value */}
        <RoleFeatures />

        {/* 4. Verification Workflow */}
        <HowItWorks />

        {/* 5. Rubric Breakdown */}
        <RubricShowcase />

        {/* 6. Pre-Footer Call to Action */}
        <section className="py-24 bg-gradient-to-b from-zinc-50 via-zinc-100/50 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-t border-zinc-200 dark:border-zinc-900 text-center relative overflow-hidden transition-colors duration-200">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,transparent_70%)]" />

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
              Ready to verify your open source engineering?
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-base max-w-xl mx-auto">
              Join developers, peer verifiers, and hiring teams transforming real code into
              verifiable career credentials.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started for Free →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Footer with ThemeChanger */}
      <LandingFooter />
    </div>
  );
}
