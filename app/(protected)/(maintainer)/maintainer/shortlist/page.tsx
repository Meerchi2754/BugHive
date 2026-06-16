"use client";
import { useAuth } from "@/context/authContext";
import { createShortList } from "@/services/maintainer/createShortList";
import { getShortlistPeople } from "@/services/maintainer/getShortlist";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineDelete } from "react-icons/md";
import { deleteShortlist } from "@/services/maintainer/deleteShortlist";
import Image from "next/image";

interface ContributorAvatar {
  contributor_id: string;
  users: {
    github_avatar_url: string | null;
    username: string | null;
  } | null;
}

interface ShortlistPerson {
  id: string;
  maintainer_id: string;
  name: string;
  created_at: string;
  shortlist_contributors: ContributorAvatar[];
}

export default function MaintainerShorList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const { user } = useAuth();
  const [isLoadingForm, setIsLoadingForm] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<ShortlistPerson[]>({
    queryKey: ["shortlists"],
    queryFn: () => getShortlistPeople()
  });

  async function handleCreate() {
    if (!user?.id) {
      toast.error("You must be logged in.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a shortlist name.");
      return;
    }

    try {
      setIsLoadingForm(true);
      const result = await createShortList(name.trim(), user.id);

      if (!result) {
        toast.error("Shortlist creation failed.");
        return;
      }

      toast.success("Shortlist created");
      setIsModalOpen(false);
      setName("");
      queryClient.invalidateQueries({ queryKey: ["shortlists"] });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Something went wrong.");
    } finally {
      setIsLoadingForm(false);
    }
  }

  async function handleDelete(shortlistId: string) {
    try {
      setDeletingId(shortlistId);
      await deleteShortlist(shortlistId);
      toast.success("Shortlist deleted");
      queryClient.invalidateQueries({ queryKey: ["shortlists"] });
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message ?? "Failed to delete shortlist");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCancel() {
    setIsModalOpen(false);
    setName("");
  }

  if (isLoading)
    return <div className="text-center py-4">Loading...</div>;

  if (isError)
    return (
      <div className="text-center py-4 text-red-500">{String(error)}</div>
    );

  return (
    <>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCancel}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Create Shortlist
            </h2>
            <div className="mb-6">
              <label
                htmlFor="shortlist-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                id="shortlist-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter shortlist name"
                className="w-full border border-gray-300 rounded-lg px-3 text-black py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name.trim() || isLoadingForm}
                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingForm ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 min-h-screen">
        {data.length > 0 ? (
          <div className="w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-gray-800">Shortlists</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Create Shortlisted List
              </button>
            </div>

            {/* Cards */}
            <div className="grid gap-3">
              {data.map((person: ShortlistPerson) => {
                const contributors = person.shortlist_contributors ?? [];
                const visibleContributors = contributors.slice(0, 2);
                const remainingCount = contributors.length - 2;

                return (
                  <div
                    key={person.id}
                    className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
                  >
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-gray-700">List Name:</span>{" "}
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-semibold text-gray-700">Created At:</span>{" "}
                      {new Date(person.created_at).toISOString().split("T")[0]}
                    </p>

                    {/* Bottom row: avatars + delete */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                      
                      {/* Avatars */}
                      <div className="flex items-center -space-x-2">
                        {contributors.length === 0 ? (
                          <span className="text-sm text-gray-400">No contributors</span>
                        ) : (
                          <>
                            {visibleContributors.map((contrib) => {
                              const user = contrib.users;
                              return (
                                <Image
                                  key={contrib.contributor_id}
                                  src={user?.github_avatar_url || "/profile.png"}
                                  alt={user?.username || "Contributor"}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                  title={user?.username || "Contributor"}
                                />
                              );
                            })}
                            {remainingCount > 0 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                                +{remainingCount}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Delete */}
                      <div>
                        <button
                          onClick={() => handleDelete(person.id)}
                          disabled={deletingId === person.id}
                          className="p-1 hover:opacity-70 transition-opacity disabled:opacity-30"
                          aria-label="Delete shortlist"
                        >
                          {deletingId === person.id ? (
                            <span className="text-xs text-gray-400">Deleting...</span>
                          ) : (
                            <MdOutlineDelete color="red" size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Shortlisted List
            </button>
          </div>
        )}
      </div>
    </>
  );
}