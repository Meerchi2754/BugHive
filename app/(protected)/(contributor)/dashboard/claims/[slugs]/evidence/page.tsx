"use client";
import { allClaim } from "@/lib/claims/allClaim";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { EvidenceHeader, EvidenceHeaderSkeleton } from "@/component/evidence/EvidenceHeader";
import { ContributionSummary, ContributionSummarySkeleton } from "@/component/evidence/ContributionSummary";
import { VerificationSummary, VerificationSummarySkeleton } from "@/component/evidence/VerificationSummary";
import { ChangedFiles, ChangedFilesSkeleton } from "@/component/evidence/ChangedFiles";
import { LinkedIssue } from "@/component/evidence/LinkedIssue";
import { SupportingEvidence, SupportingEvidenceSkeleton } from "@/component/evidence/SupportingEvidence";
import { FiAlertCircle } from "react-icons/fi";

import { useTheme } from "@/context/themeContext";

export default function EvidencePage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = use(params);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["claims", { id: slugs }],
    queryFn: () => allClaim(slugs),
    staleTime: 1000 * 60 * 60 * 5,
  });

  const loading = isLoading || isFetching;
  const claimData = data?.[0] ?? null;
  const isPresent = !!claimData;

  return (
    // Outer shell — background with subtle dot grid matching theme
    <div
      className={`min-h-screen w-full transition-colors duration-150 ${isDark ? "text-[#F3F4F6]" : "text-gray-900"}`}
      style={{
        backgroundColor: isDark ? "#090B0D" : "#ffffff",
        backgroundImage: isDark
          ? "radial-gradient(#24282D 1px, transparent 1px)"
          : "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Centered content container */}
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">

        {/* ── HEADER ─────────────────────────────────── */}
        {loading ? (
          <EvidenceHeaderSkeleton />
        ) : isError ? (
          <div className="flex items-center gap-3 py-4 text-red-400 text-sm">
            <FiAlertCircle className="w-4 h-4 shrink-0" />
            <span>
              {error instanceof Error
                ? error.message
                : "Failed to load evidence data."}
            </span>
          </div>
        ) : isPresent ? (
          <EvidenceHeader claim={claimData} />
        ) : (
          <div className="py-8 text-center text-[#8B949E] text-sm">
            Claim data unavailable.
          </div>
        )}

        {/* ── MAIN CONTENT ──────────────────────────── */}
        {loading ? (
          <>
            {/* Skeleton: 2-col summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContributionSummarySkeleton />
              <VerificationSummarySkeleton />
            </div>
            <ChangedFilesSkeleton />
            <SupportingEvidenceSkeleton />
          </>
        ) : isPresent ? (
          <>
            {/* ── SUMMARY ROW ─────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ContributionSummary claim={claimData} />
              <VerificationSummary claim={claimData} />
            </div>

            {/* ── CHANGED FILES ────────────────────── */}
            <ChangedFiles
              files={claimData.pr_table.file_changes ?? []}
              count={
                claimData.pr_table.changed_files_count ??
                claimData.pr_table.file_changes?.length ??
                0
              }
            />

            {/* ── LINKED ISSUE ─────────────────────── */}
            <LinkedIssue issueUrl={claimData.pr_table.issue_url} />

            {/* ── SUPPORTING EVIDENCE ──────────────── */}
            <SupportingEvidence
              prTableId={claimData.pr_table.id}
              initialLinks={claimData.pr_table.evidences ?? []}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
