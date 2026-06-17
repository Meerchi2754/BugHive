"use client";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import { getPublicProfile } from "@/services/public/getPublicProfile";
import { getUserClaims } from "@/services/public/getUserClaims";
import { getShortlistPeople } from "@/services/maintainer/getShortlist";
import { addToShortlist } from "@/services/maintainer/addToShortlist";
import { useAuth } from "@/context/authContext";
import { FiGithub, FiMapPin, FiGlobe, FiStar, FiShare2 } from "react-icons/fi";
import { ClaimCard } from "@/component/username/ClaimCard";
import { toast } from "react-toastify";

export default function Username({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user } = useAuth();
  
  // State for shortlist modal
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [shortlistNote, setShortlistNote] = useState("");
  const [selectedShortlist, setSelectedShortlist] = useState("");
  
  // Fetch user profile
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ["publicProfile", username],
    queryFn: () => getPublicProfile(username),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch user claims (only when we have a profile)
  const { data: claimsData, isLoading: claimsLoading } = useQuery({
    queryKey: ["userClaims", profile?.id],
    queryFn: () => getUserClaims(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch shortlists (only for authenticated maintainers)
  const { data: shortlists = [] } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => getShortlistPeople(),
    enabled: !!user && user.role === "MAINTAINER",
    staleTime: 1000 * 60 * 5,
  });

  const claims = claimsData?.data || [];
  const isMaintainer = user?.role === "MAINTAINER";

  // Handle share profile
  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/u/${username}`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  // Handle add to shortlist
  const handleAddToShortlist = async () => {
    if (!profile || !selectedShortlist) {
      toast.error("Please select a shortlist.");
      return;
    }

    try {
      const success = await addToShortlist(selectedShortlist, profile.id, shortlistNote.trim() || undefined);
      if (success) {
        toast.success("Contributor added to shortlist!");
        setShowShortlistModal(false);
        setShortlistNote("");
        setSelectedShortlist("");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to add to shortlist.");
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600">This contributor profile does not exist or is set to private.</p>
        </div>
      </div>
    );
  }

  // Calculate contribution graph from claims
  const contributionGraph: { [key: string]: number } = {};
  claims.forEach((claim) => {
    const date = new Date(claim.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    contributionGraph[monthKey] = (contributionGraph[monthKey] || 0) + 1;
  });

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
                <p className="text-3xl font-bold text-blue-600">{profile.total_impact_score}</p>
              </div>
              <div className="bg-purple-50 px-6 py-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Verified Claims</p>
                <p className="text-3xl font-bold text-purple-600">{claims.length}</p>
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

          {/* Action Bar - Maintainer Only */}
          {isMaintainer && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowShortlistModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium hover:cursor-pointer hover:border-blue-900"
                >
                  <FiStar size={18} />
                  Add to Shortlist
                </button>
                <button
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium hover:border-gray-500 hover:cursor-pointer"
                >
                  <FiShare2 size={18} />
                  Share Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contribution Graph */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contribution Activity</h2>
          {Object.keys(contributionGraph).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(contributionGraph)
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
          ) : (
            <p className="text-gray-500 text-center py-4">No contribution data available</p>
          )}
        </div>

        {/* Verified Claims */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verified Contributions</h2>
          {claimsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading claims...</p>
          ) : (
            <>
              <div className="space-y-4">
                {claims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>

              {claims.length === 0 && (
                <p className="text-gray-500 text-center py-8">No verified contributions yet.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add to Shortlist Modal */}
      {showShortlistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowShortlistModal(false);
              setShortlistNote("");
              setSelectedShortlist("");
            }}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Add to Shortlist</h2>

            <div className="mb-4">
              <label htmlFor="shortlist-select" className="block text-sm font-medium text-gray-700 mb-1">
                Select Shortlist
              </label>
              <select
                id="shortlist-select"
                value={selectedShortlist}
                onChange={(e) => setSelectedShortlist(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 text-black py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a shortlist --</option>
                {shortlists.map((list: any) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="shortlist-note" className="block text-sm font-medium text-gray-700 mb-1">
                Internal Note (Optional)
              </label>
              <textarea
                id="shortlist-note"
                value={shortlistNote}
                onChange={(e) => setShortlistNote(e.target.value)}
                placeholder="Add any notes about this contributor..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 text-black py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowShortlistModal(false);
                  setShortlistNote("");
                  setSelectedShortlist("");
                }}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToShortlist}
                disabled={!selectedShortlist}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Shortlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
