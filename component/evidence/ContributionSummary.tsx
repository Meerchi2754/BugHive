"use client";
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

interface ContributionSummaryProps {
  claim: claimDB;
}

export function ContributionSummary({ claim }: ContributionSummaryProps) {
  const pr = claim.pr_table;
  const mergedDate = formatDate(pr.merged_at);

  return (
    <div className="bg-[#0D1013] border border-[#24282D] rounded-[10px] p-5 space-y-5 hover:border-[#343A40] transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#F3F4F6] uppercase tracking-wider">
        Contribution Summary
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Additions */}
        <div className="space-y-0.5">
          <p className="font-mono text-xl font-bold text-[#34D399]">
            +{pr.additions ?? 0}
          </p>
          <p className="text-xs text-[#8B949E]">Additions</p>
        </div>

        {/* Deletions */}
        <div className="space-y-0.5">
          <p className="font-mono text-xl font-bold text-[#F87171]">
            −{pr.deletions ?? 0}
          </p>
          <p className="text-xs text-[#8B949E]">
            {(pr.deletions ?? 0) === 1 ? "Deletion" : "Deletions"}
          </p>
        </div>

        {/* Files changed */}
        <div className="space-y-0.5">
          <p className="font-mono text-xl font-bold text-[#F3F4F6]">
            {pr.changed_files_count ?? pr.file_changes?.length ?? 0}
          </p>
          <p className="text-xs text-[#8B949E]">Files changed</p>
        </div>

        {/* Merged */}
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-[#F3F4F6]">{mergedDate}</p>
          <p className="text-xs text-[#8B949E]">
            {pr.merged_at ? "Merged" : "Not merged"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ContributionSummarySkeleton() {
  return (
    <div className="bg-[#0D1013] border border-[#24282D] rounded-[10px] p-5 space-y-5 animate-pulse">
      <div className="h-4 w-40 bg-[#24282D] rounded" />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-6 w-16 bg-[#24282D] rounded" />
            <div className="h-3 w-20 bg-[#24282D] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
