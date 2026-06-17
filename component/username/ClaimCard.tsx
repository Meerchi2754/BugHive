import { Database } from "@/types/database.types";
import { FiExternalLink, FiUser, FiMessageSquare } from "react-icons/fi";

interface ClaimCardProps {
  claim: {
    id: string;
    claim_title: string | null;
    claim_type: Database["public"]["Enums"]["claimtype"] | null;
    claim_impact_score: number;
    pr_url: string;
    created_at: string;
    description: string;
    verifications: Array<{
      id: string;
      verifier: {
        username: string;
        github_username: string | null;
      };
      technical_complexity: number | null;
      codebase_impact: number | null;
      collaboration_quality: number | null;
      descriptions: string | null;
    }>;
  };
}

const claimTypeColors: Record<string, string> = {
  "BUG FIX": "bg-red-100 text-red-700",
  FEATURE: "bg-green-100 text-green-700",
  PERFORMANCE: "bg-blue-100 text-blue-700",
  REFACTOR: "bg-purple-100 text-purple-700",
  DOCUMENTATION: "bg-yellow-100 text-yellow-700",
  MENTORING: "bg-pink-100 text-pink-700",
};

export function ClaimCard({ claim }: ClaimCardProps) {
  const calculateAverageScore = (
    technical: number | null,
    codebase: number | null,
    collaboration: number | null
  ) => {
    const scores = [technical, codebase, collaboration].filter((s): s is number => s !== null);
    if (scores.length === 0) return null;
    return (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {claim.claim_title || "Untitled Claim"}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {claim.claim_type && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded ${
                  claimTypeColors[claim.claim_type] || "bg-gray-100 text-gray-700"
                }`}
              >
                {claim.claim_type}
              </span>
            )}
            <span className="text-xs text-gray-500">
              Impact Score: {claim.claim_impact_score}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {claim.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{claim.description}</p>
      )}

      {/* PR Link */}
      <div className="mb-4">
        <a
          href={claim.pr_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          <FiExternalLink className="w-4 h-4" />
          View Pull Request
        </a>
      </div>

      {/* Verifications */}
      {claim.verifications.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="w-4 h-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-700">
              Verified by {claim.verifications.length}{" "}
              {claim.verifications.length === 1 ? "reviewer" : "reviewers"}
            </p>
          </div>

          <div className="space-y-3">
            {claim.verifications.map((verification) => {
              const avgScore = calculateAverageScore(
                verification.technical_complexity,
                verification.codebase_impact,
                verification.collaboration_quality
              );

              return (
                <div
                  key={verification.id}
                  className="bg-gray-50 rounded-lg p-3 space-y-2"
                >
                  {/* Verifier Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {verification.verifier.username}
                    </span>
                    {avgScore !== null && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
                        {avgScore}/5.0
                      </span>
                    )}
                  </div>

                  {/* Review Description */}
                  {verification.descriptions && (
                    <div className="flex gap-2">
                      <FiMessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {verification.descriptions}
                      </p>
                    </div>
                  )}

                  {/* Score Breakdown (optional detail) */}
                  {(verification.technical_complexity !== null ||
                    verification.codebase_impact !== null ||
                    verification.collaboration_quality !== null) && (
                    <div className="flex gap-3 text-xs text-gray-500 pt-1">
                      {verification.technical_complexity !== null && (
                        <span>Technical: {verification.technical_complexity}/5</span>
                      )}
                      {verification.codebase_impact !== null && (
                        <span>Impact: {verification.codebase_impact}/5</span>
                      )}
                      {verification.collaboration_quality !== null && (
                        <span>Collaboration: {verification.collaboration_quality}/5</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
