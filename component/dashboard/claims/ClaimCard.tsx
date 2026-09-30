"use client";
import { claimVisibilityType } from "@/lib/validations/claims";
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";
import { useEffect, useState } from "react";
import { ButtonComp } from "@/component/ui/button";
import { updateVisibility } from "@/services/dashboard/updateVisibility";
import { MdPeopleAlt } from "react-icons/md";
import { toast } from "react-toastify";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { getAllUser, getSearchUser } from "@/services/claimCard/getSearchUser";
import UserCard from "./UserCard";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineMail } from "react-icons/md";

type userList = {
  email: string;
  github_username: string;
  github_avatar_url: string;
};

export function ClaimCard({ claim }: { claim: claimDB }) {
  const [claim_visibility, setClaim_Visibility] = useState<claimVisibilityType>(
    claim.visibility_level,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isVerified = claim.verifier_count > 0;
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [userList, setUserList] = useState<userList[]>();

  const isChange = claim_visibility !== claim.visibility_level;

  const toggleClaimVisibility = () => {
    if (claim_visibility === "PUBLIC") {
      setClaim_Visibility("PRIVATE");
    } else if (claim_visibility === "PRIVATE") {
      setClaim_Visibility("PUBLIC");
    }
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const updateRes = await updateVisibility(claim.id, claim_visibility);
      if (!updateRes) {
        toast.error("Something went wrong.");
        setIsSubmitting(false);
        return;
      }
      toast.success("Updated Successfully");
      setIsSubmitting(false);
      setClaim_Visibility(claim_visibility);
      claim.visibility_level = claim_visibility;
    } catch (error) {
      toast.error(`Update Failed ${error}`);
      setIsSubmitting(false);
    }
  };

  const handleEvidence = async (claimId: string) => {
    if (!claimId) {
      toast.error("Claim Not Found!");
      return;
    }
    router.push(`/dashboard/claims/${claimId}/evidence`);
  };

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUser(),
    staleTime: 1000 * 60 * 60 * 5,
  });

  useEffect(() => {
    if (!searchEmail?.trim()) {
      setUserList(undefined);
      return;
    }
    const timer = setTimeout(async () => {
      const result = await getSearchUser(searchEmail);
      setUserList(result);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchEmail]);

  return (
    <div
      className={`p-4 rounded-xl border transition-colors shadow-sm min-w-[320px] max-w-[380px] ${
        isDark
          ? "bg-[#0D1013] border-[#24282D] text-[#F3F4F6]"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <h2 className="text-center font-semibold text-base mb-3">
        Claims Details
      </h2>
      
      <div>
        <div className="flex flex-row gap-3 justify-center items-center py-2">
          <div
            className={`h-7 px-3 text-xs font-semibold uppercase rounded-md flex items-center justify-center ${
              isDark
                ? "bg-[#161b22] text-zinc-300 border border-[#24282D]"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            <span>{claim.claim_type}</span>
          </div>

          <span
            className={`px-2.5 py-1 text-xs rounded-md font-semibold border ${
              !isVerified
                ? isDark
                  ? "bg-zinc-800/50 text-zinc-400 border-zinc-700"
                  : "bg-gray-50 text-gray-600 border-gray-200"
                : isDark
                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {!isVerified ? "Awaiting Verification" : "Verified ✓"}
          </span>
        </div>
      </div>

      <div className="flex flex-row gap-2 py-2.5 text-sm items-baseline">
        <label className={`font-medium shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Title:</label>
        <p className={`font-medium truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {claim.claim_title}
        </p>
      </div>

      <div className={`border-t ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

      <div className="flex flex-row gap-2 py-2.5 items-center text-sm">
        <FaGithub size={18} className={isDark ? "text-gray-300" : "text-gray-700"} />
        <a
          href={`${claim.pr_url}`}
          className="text-blue-600 dark:text-blue-400 underline truncate text-xs font-mono hover:text-blue-500"
          target="_blank"
          rel="noreferrer"
        >
          {claim.pr_url}
        </a>
      </div>

      <div className={`border-t ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

      <div className="flex flex-row gap-2 py-2.5 items-center text-sm">
        <MdPeopleAlt size={18} className={isDark ? "text-gray-400" : "text-gray-600"} />
        <label className={`font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Verifier Count:</label>
        <p className="font-semibold">{claim.verifier_count}</p>
      </div>

      <div className={`border-t ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

      <div className="flex flex-col gap-2 py-2.5">
        <div className="flex flex-row items-center justify-between">
          <label className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Visibility: <span className="font-semibold">{claim_visibility}</span>
          </label>
          <button
            type="button"
            onClick={() => toggleClaimVisibility()}
            className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
              claim_visibility === "PUBLIC"
                ? "bg-emerald-500"
                : isDark
                ? "bg-zinc-700"
                : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                claim_visibility === "PUBLIC" ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="pt-3 pb-1 flex items-center gap-2">
        <ButtonComp
          text="Evidence"
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? "border-[#24282D] text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-[#161b22]"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
          }`}
          onClick={() => handleEvidence(claim.id)}
        />
        <ButtonComp
          text={!shareModal ? "Send Verification" : "Close"}
          onClick={() => setShareModal(!shareModal)}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
            shareModal
              ? isDark
                ? "border-emerald-500 text-emerald-400"
                : "border-emerald-600 text-emerald-700 bg-emerald-50"
              : isDark
              ? "border-[#24282D] text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-[#161b22]"
              : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black"
          }`}
        />
      </div>

      {isChange && (
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-dashed border-gray-300 dark:border-zinc-800">
          <ButtonComp
            text={!isSubmitting ? "SAVE" : "Saving..."}
            onClick={() => handleSave()}
            disabled={isSubmitting}
            className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 cursor-pointer disabled:opacity-60"
          />
        </div>
      )}

      {shareModal && (
        <section className={`mt-3 pt-3 border-t flex flex-col gap-3 ${isDark ? "border-[#24282D]" : "border-gray-200"}`}>
          <input
            type="text"
            placeholder="Enter username or email"
            className={`p-2 text-xs rounded border outline-none ${
              isDark
                ? "bg-[#111519] text-white border-[#24282D] focus:border-emerald-500"
                : "bg-gray-50 text-gray-900 border-gray-300 focus:border-emerald-500"
            }`}
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />

          <section className="flex flex-col gap-1">
            <label className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-gray-500"}`}>Search Result</label>
            {(userList?.length ?? 0) > 0 ? (
              userList
                ?.filter((i) => i.email !== user?.email)
                .map((i) => (
                  <div key={i.email}>
                    <UserCard
                      github_avatar_url={i.github_avatar_url}
                      shareModal={() => setShareModal(!shareModal)}
                      claimId={claim.id}
                      verifier_email={i.email}
                    />
                  </div>
                ))
            ) : searchEmail.trim() !== "" ? (
              <UserCard
                github_avatar_url=""
                icon={<MdOutlineMail />}
                shareModal={() => setShareModal(!shareModal)}
                claimId={claim.id}
                verifier_email={searchEmail}
              />
            ) : (
              <p className={`text-xs py-1 ${isDark ? "text-zinc-500" : "text-gray-400"}`}>
                Type to search for a user by email or username.
              </p>
            )}
          </section>

          <section className="flex flex-col gap-1">
            <label className={`text-xs font-medium ${isDark ? "text-zinc-400" : "text-gray-500"}`}>Users</label>
            {data
              ?.filter((u) => u.email !== user?.email)
              .map((i) => (
                <div key={i.email}>
                  <UserCard
                    github_avatar_url={i.github_avatar_url}
                    shareModal={() => setShareModal(!shareModal)}
                    claimId={claim.id}
                    verifier_email={i.email}
                  />
                </div>
              ))}
          </section>
        </section>
      )}
    </div>
  );
}
