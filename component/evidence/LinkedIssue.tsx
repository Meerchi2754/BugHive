"use client";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

interface LinkedIssueProps {
  issueUrl: string | null | undefined;
}

/**
 * Convert a GitHub API URL like:
 *   https://api.github.com/repos/Owner/Repo/issues/3
 * into a human-readable browser URL:
 *   https://github.com/Owner/Repo/issues/3
 * and extract owner, repo, issue number.
 */
function parseIssueUrl(raw: string): {
  browserUrl: string;
  owner: string;
  repo: string;
  issueNumber: string;
} | null {
  try {
    // Handle API URL
    const apiMatch = raw.match(
      /api\.github\.com\/repos\/([^/]+)\/([^/]+)\/issues\/(\d+)/
    );
    if (apiMatch) {
      return {
        browserUrl: `https://github.com/${apiMatch[1]}/${apiMatch[2]}/issues/${apiMatch[3]}`,
        owner: apiMatch[1],
        repo: apiMatch[2],
        issueNumber: apiMatch[3],
      };
    }

    // Handle regular browser URL
    const browserMatch = raw.match(
      /github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/
    );
    if (browserMatch) {
      return {
        browserUrl: raw,
        owner: browserMatch[1],
        repo: browserMatch[2],
        issueNumber: browserMatch[3],
      };
    }

    return null;
  } catch {
    return null;
  }
}

export function LinkedIssue({ issueUrl }: LinkedIssueProps) {
  const parsed = issueUrl ? parseIssueUrl(issueUrl) : null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-[#F3F4F6]">Linked Issue</h2>

      <div className="border border-[#24282D] rounded-[10px] bg-[#0D1013] hover:border-[#343A40] transition-colors duration-150">
        {parsed ? (
          <div className="flex items-center gap-3 px-4 py-3">
            <FaGithub className="w-4 h-4 text-[#8B949E] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F3F4F6]">
                Issue #{parsed.issueNumber}
              </p>
              <p className="text-xs text-[#8B949E] truncate">
                {parsed.owner} / {parsed.repo}
              </p>
            </div>
            <a
              href={parsed.browserUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#60A5FA] hover:text-blue-300 transition-colors duration-150 shrink-0"
            >
              View Issue
              <FiExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-[#8B949E]">No linked issue</p>
            <p className="text-xs text-[#8B949E]/60 mt-1">
              This pull request does not reference a GitHub issue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
