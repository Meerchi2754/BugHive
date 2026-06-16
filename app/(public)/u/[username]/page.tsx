"use client";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { getPublicProfile } from "@/services/public/getPublicProfile";
import { FiGithub, FiMapPin, FiGlobe, FiExternalLink, FiAward } from "react-icons/fi";

export default function Username({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["publicProfile", username],
    queryFn: () => getPublicProfile(username),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">This contributor profile does not exist or is set to private.</p>
        </div>
      </div>
    );
  }

  // Calculate percentile (simplified - you may want more complex logic)
  const calculatePercentile = (score: number | null) => {
    if (!score) return 0;
    return Math.min(Math.round((score / 100) * 100), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start gap-6">
            {profile.github_avatar_url && (
              <img
                src={profile.github_avatar_url}
                alt={profile.username}
                className="w-24 h-24 rounded-full border-4 border-blue-100"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h1>
              {profile.headline && <p className="text-xl text-gray-700 mb-3">{profile.headline}</p>}
              {profile.bio && <p className="text-gray-600 mb-4">{profile.bio}</p>}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.github_username && (
                  <a
                    href={`https://github.com/${profile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600"
                  >
                    <FiGithub /> @{profile.github_username}
                  </a>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <FiMapPin /> {profile.location}
                  </span>
                )}
                {profile.isRemote && (
                  <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                    <FiGlobe /> Remote Available
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="bg-blue-50 px-6 py-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Total Impact</p>
                <p className="text-3xl font-bold text-blue-600">{profile.totalImpactScore}</p>
              </div>
              <div className="bg-purple-50 px-6 py-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Verified Claims</p>
                <p className="text-3xl font-bold text-purple-600">{profile.verifiedClaims.length}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-3 gap-6">
              {profile.ecosystem && profile.ecosystem.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Ecosystems</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.ecosystem.map((eco) => (
                      <span key={eco} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {eco}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.languages && profile.languages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((lang) => (
                      <span key={lang} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.techstack && profile.techstack.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.techstack.map((tech) => (
                      <span key={tech} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contribution Activity</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(profile.contributionGraph)
              .sort()
              .map(([month, count]) => (
                <div key={month} className="text-center">
                  <div
                    className={`w-12 h-12 rounded flex items-center justify-center ${
                      count > 5
                        ? "bg-green-600"
                        : count > 3
                          ? "bg-green-500"
                          : count > 1
                            ? "bg-green-400"
                            : "bg-green-200"
                    }`}
                  >
                    <span className="text-white font-bold text-sm">{count}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{month}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Verified Claims */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verified Contributions</h2>
          <div className="space-y-4">
            {profile.verifiedClaims.map((claim) => (
              <div key={claim.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{claim.claim_title || "Untitled Claim"}</h3>
                    <p className="text-gray-600 text-sm mb-2">{claim.description}</p>
                    <div className="flex items-center gap-3">
                      {claim.claim_type && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          {claim.claim_type}
                        </span>
                      )}
                      <a
                        href={claim.pr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        View PR <FiExternalLink size={14} />
                      </a>
                      <span className="text-gray-500 text-xs">
                        {new Date(claim.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Impact Badge */}
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg text-center ml-4">
                    <FiAward className="mx-auto mb-1" size={20} />
                    <p className="text-2xl font-bold">{claim.claim_impact_score}</p>
                    <p className="text-xs">Impact</p>
                  </div>
                </div>

                {/* Verifiers */}
                {claim.verifications.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 mb-2">Verified by:</p>
                    <div className="flex flex-wrap gap-3">
                      {claim.verifications.map((verification) => (
                        <div
                          key={verification.id}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded"
                        >
                          <span className="text-sm font-medium text-gray-800">
                            {verification.verifier.username}
                          </span>
                          {verification.credibility_score !== null && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {calculatePercentile(verification.credibility_score)}th percentile
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {profile.verifiedClaims.length === 0 && (
            <p className="text-gray-500 text-center py-8">No verified contributions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
