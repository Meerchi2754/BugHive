"use client";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";

/** Parse owner/repo/pr-number out of a GitHub PR URL.
 *  e.g. https://github.com/Meerchi2754/Loaner/pull/1 → { owner, repo, prNumber }
 */
function parsePrUrl(url: string) {
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2], prNumber: match[3] };
  } catch {
    return null;
  }
}

interface EvidenceHeaderProps {
  claim: claimDB;
}

export function EvidenceHeader({ claim }: EvidenceHeaderProps) {
  const router = useRouter();
  const isVerified = claim.verifier_count > 0;
  const pr = parsePrUrl(claim.pr_url);

  return (
    <div className="space-y-5 pb-6 border-b border-[#24282D]">
      {/* Breadcrumb */}
      <button
        onClick={() => router.push("/dashboard/claims")}
        className="inline-flex items-center gap-1.5 text-sm text-[#8B949E] hover:text-[#F3F4F6] transition-colors duration-150 cursor-pointer group"
      >
        <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
        Back to My Claims
      </button>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[#F3F4F6] tracking-tight">
            Evidence Record
          </h1>
          <p className="text-sm text-[#8B949E] leading-relaxed">
            Authenticated proof and supporting data for this contribution.
          </p>

          {/* Claim title */}
          <p className="text-base font-medium text-[#F3F4F6] pt-1">
            {claim.claim_title}
          </p>

          {/* Repo + PR pill row */}
          {pr ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://github.com/${pr.owner}/${pr.repo}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#8B949E] hover:text-[#F3F4F6] transition-colors duration-150"
              >
                <FaGithub className="w-4 h-4" />
                <span>
                  {pr.owner} / {pr.repo}
                </span>
              </a>

              <span className="text-[#24282D]">·</span>

              <a
                href={claim.pr_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm font-mono text-[#60A5FA] hover:text-blue-300 transition-colors duration-150"
              >
                PR #{pr.prNumber}
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <a
              href={claim.pr_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#60A5FA] hover:text-blue-300 transition-colors duration-150 pt-1"
            >
              <FaGithub className="w-4 h-4" />
              View Pull Request
              <FiExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Verification pill */}
        <div className="sm:self-start flex-shrink-0">
          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#00D084]/10 text-[#00D084] border border-[#00D084]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D084]" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#8B949E]/10 text-[#8B949E] border border-[#8B949E]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B949E]" />
              Awaiting Verification
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Skeleton version shown during loading */
export function EvidenceHeaderSkeleton() {
  return (
    <div className="space-y-5 pb-6 border-b border-[#24282D] animate-pulse">
      <div className="h-4 w-32 bg-[#24282D] rounded" />
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="h-5 w-44 bg-[#24282D] rounded" />
          <div className="h-4 w-72 bg-[#24282D] rounded" />
          <div className="h-5 w-56 bg-[#24282D] rounded" />
          <div className="h-4 w-48 bg-[#24282D] rounded" />
        </div>
        <div className="h-6 w-20 bg-[#24282D] rounded-full" />
      </div>
    </div>
  );
}
