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

interface VerificationSummaryProps {
  claim: claimDB;
}

interface RowProps {
  label: string;
  value: React.ReactNode;
}

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#24282D] last:border-0">
      <span className="text-xs text-[#8B949E]">{label}</span>
      <span className="text-xs font-medium text-[#F3F4F6]">{value}</span>
    </div>
  );
}

export function VerificationSummary({ claim }: VerificationSummaryProps) {
  const isVerified = claim.verifier_count > 0;
  const mergedDate = formatDate(claim.pr_table.merged_at);

  return (
    <div className="bg-[#0D1013] border border-[#24282D] rounded-[10px] p-5 hover:border-[#343A40] transition-colors duration-150">
      <h2 className="text-sm font-semibold text-[#F3F4F6] uppercase tracking-wider mb-1">
        Verification
      </h2>

      <div>
        <Row
          label="Status"
          value={
            isVerified ? (
              <span className="text-[#00D084]">Verified ✓</span>
            ) : (
              <span className="text-[#8B949E]">Awaiting verification</span>
            )
          }
        />
        <Row
          label="Verifiers"
          value={claim.verifier_count}
        />
        <Row
          label="Visibility"
          value={
            <span
              className={
                claim.visibility_level === "PUBLIC"
                  ? "text-[#00D084]"
                  : "text-[#8B949E]"
              }
            >
              {claim.visibility_level === "PUBLIC" ? "Public" : "Private"}
            </span>
          }
        />
        <Row
          label="Claim type"
          value={
            <span className="font-mono text-[10px] bg-[#111519] border border-[#24282D] px-2 py-0.5 rounded uppercase">
              {claim.claim_type}
            </span>
          }
        />
        <Row label="Merged on" value={mergedDate} />
      </div>
    </div>
  );
}

export function VerificationSummarySkeleton() {
  return (
    <div className="bg-[#0D1013] border border-[#24282D] rounded-[10px] p-5 animate-pulse">
      <div className="h-4 w-28 bg-[#24282D] rounded mb-3" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex justify-between items-center py-2.5 border-b border-[#24282D] last:border-0"
        >
          <div className="h-3 w-20 bg-[#24282D] rounded" />
          <div className="h-3 w-16 bg-[#24282D] rounded" />
        </div>
      ))}
    </div>
  );
}
