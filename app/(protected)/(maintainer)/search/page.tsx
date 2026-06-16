"use client";
import { useAuth } from "@/context/authContext";
import { searchContributorsAction, SearchFilters, ContributorSearchResult } from "@/app/actions/maintainer/searchContributors.action";
import { getShortlistPeople } from "@/services/maintainer/getShortlist";
import { addToShortlist } from "@/services/maintainer/addToShortlist";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { FiSearch, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Search state
  const [username, setUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ContributorSearchResult[]>([]);
  const [selectedContributor, setSelectedContributor] = useState<string | null>(null);
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [shortlistNote, setShortlistNote] = useState("");
  const [selectedShortlist, setSelectedShortlist] = useState("");

  // Fetch shortlists
  const { data: shortlists = [] } = useQuery({
    queryKey: ["shortlists"],
    queryFn: () => getShortlistPeople(),
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = async () => {
    if (!user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    if (!username.trim()) {
      toast.error("Please enter a username to search.");
      return;
    }

    setIsSearching(true);
    try {
      const filters: SearchFilters = {
        username: username.trim(),
      };

      const response = await searchContributorsAction(filters);
      
      if (!response.success) {
        toast.error(response.error || "Search failed. Please try again.");
        setSearchResults([]);
        return;
      }

      setSearchResults(response.data || []);
      
      if (!response.data || response.data.length === 0) {
        toast.info("No contributors found matching your criteria.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToShortlist = async () => {
    if (!selectedContributor || !selectedShortlist) {
      toast.error("Please select a shortlist.");
      return;
    }

    try {
      const success = await addToShortlist(selectedShortlist, selectedContributor, shortlistNote.trim() || undefined);
      if (success) {
        toast.success("Contributor added to shortlist!");
        setShowShortlistModal(false);
        setShortlistNote("");
        setSelectedContributor(null);
        setSelectedShortlist("");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to add to shortlist.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Search Bar - Centered at top */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Username Search */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search contributors by username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-6xl mx-auto">
        {searchResults.length > 0 && (
          <div className="mb-4 text-gray-600">
            Found {searchResults.length} contributor{searchResults.length !== 1 ? "s" : ""}
          </div>
        )}

        <div className="grid gap-4">
          {searchResults.map((contributor) => (
            <div key={contributor.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {contributor.github_avatar_url && (
                    <img
                      src={contributor.github_avatar_url}
                      alt={contributor.username}
                      className="w-16 h-16 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{contributor.username}</h3>
                      {contributor.github_username && (
                        <a
                          href={`https://github.com/${contributor.github_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          @{contributor.github_username}
                        </a>
                      )}
                    </div>

                    {contributor.headline && (
                      <p className="text-gray-700 font-medium mb-2">{contributor.headline}</p>
                    )}

                    {contributor.bio && <p className="text-gray-600 text-sm mb-3">{contributor.bio}</p>}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      {contributor.location && (
                        <span className="flex items-center gap-1">
                          📍 {contributor.location}
                        </span>
                      )}
                      {contributor.isRemote && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Remote Available</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 mb-3">
                      <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-600">Impact Score</p>
                        <p className="text-2xl font-bold text-blue-600">{contributor.totalImpactScore}</p>
                      </div>
                      <div className="bg-purple-50 px-4 py-2 rounded-lg">
                        <p className="text-sm text-gray-600">Verified Claims</p>
                        <p className="text-2xl font-bold text-purple-600">{contributor.verifiedClaimsCount}</p>
                      </div>
                    </div>

                    {/* Ecosystems */}
                    {contributor.ecosystem && contributor.ecosystem.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Ecosystems:</p>
                        <div className="flex flex-wrap gap-2">
                          {contributor.ecosystem.map((eco) => (
                            <span key={eco} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {eco}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {contributor.languages && contributor.languages.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Languages:</p>
                        <div className="flex flex-wrap gap-2">
                          {contributor.languages.map((lang) => (
                            <span key={lang} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/u/${contributor.username}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContributor(contributor.id);
                      setShowShortlistModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <FiStar size={16} />
                    Add to Shortlist
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              setSelectedContributor(null);
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
                  setSelectedContributor(null);
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
