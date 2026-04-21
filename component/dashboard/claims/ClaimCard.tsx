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
  const [isChange, setIsChange] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const isVerified = claim.verifier_count > 0;
  const router = useRouter();
  const { user } = useAuth();
  const [shareModal, setShareModal] = useState<boolean>(false);
  const [searchEmail, setSearchEmail] = useState<string>();
  const [userList, setUserList] = useState<userList[]>();

  const toggleClaimVisibility = () => {
    if (claim_visibility === "PUBLIC") {
      setClaim_Visibility("PRIVATE");
    } else if (claim_visibility === "PRIVATE") {
      setClaim_Visibility("PUBLIC");
    }
    setIsChange(!isChange);
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const updateRes = await updateVisibility(claim.id, claim_visibility);
      if (!updateRes) {
        toast.error("Something went wrong.");
        return;
      }
      toast.success("Updated Successfully");
      setIsSubmitting(false);
    } catch (error) {
      toast.error(`Update Failed ${error}`);
      setIsSubmitting(false);
    }
  };

  const handleEvidence = async (claimId: string) => {
    console.log("CLICK:", claimId);
    if (!claimId) {
      toast.error("Claim Not Found!");
      return;
    }
    //console.log("route:", `/dashboard/claims/${claimId}/evidence`);
    router.push(`/dashboard/claims/${claimId}/evidence`);
  };

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUser(),
    staleTime: 1000 * 60 * 60 * 5,
  });

  useEffect(() => {
    if (!searchEmail?.trim()) return;
    const timer = setTimeout(async () => {
      const data = await getSearchUser(searchEmail!);
      setUserList(data);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchEmail]);

  return (
    <div className="bg-zinc-950 p-2 rounded border border-gray-600">
      <h2 className="text-center text-white font-bold text-lg">
        Claims Details:
      </h2>
      <div>
        <div className="flex flex-row gap-5 justify-center items-center py-3">
          <div className="h-8 w-30 px-3 font-semibold uppercase bg-zinc-800 text-zinc-400  rounded flex items-center justify-center">
            <span>{claim.claim_type}</span>
          </div>

          <span
            className={`px-3 py-1 rounded font-semibold border ${!isVerified ? " w" : "bg-emerald-950 text-emerald-400 border border-emerald-800"}`}
          >
            {!isVerified ? "Awaiting Vertfication" : "Verified ✓"}
          </span>
        </div>
      </div>

      <div className="flex flex-row  gap-3 py-3">
        <label className="text-gray-500">Title:</label>
        <p className="text-gray-300">{claim.claim_title}</p>
      </div>

      <div className="border-t border-zinc-800" />

      <div className="flex flex-row gap-3 py-3">
        {/* <label className="text-gray-500">PR Url:</label> */}
        <FaGithub size={23} />
        <a
          href={`${claim.pr_url}`}
          className="text-blue-600 underline"
          target="_blank"
        >
          {claim.pr_url}
        </a>
      </div>

      <div className="border-t border-zinc-800" />

      <div className="flex flex-row gap-3 py-3">
        <MdPeopleAlt size={23} />
        <label className="text-gray-500">Verifier Count:</label>

        <p>{claim.verifier_count}</p>
      </div>

      <div className="border-t border-zinc-800" />

      <div className="flex flex-col gap-3 py-3">
        <div className="flex flex-row gap-3">
          <label className="">{claim_visibility}:</label>
          <button
            type="button"
            onClick={() => toggleClaimVisibility()}
            className={`w-10 h-6 rounded-full transition-color relative ${claim_visibility === "PUBLIC" ? "bg-black" : "bg-gray-200"} cursor-pointer`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white border border-gray-400 rounded-full transition-colors  ${claim_visibility === "PUBLIC" ? "bg-black" : "bg-gray-200 left-1"}`}
            />
          </button>
        </div>
      </div>

      <div className="py-4 flex itmes-center gap-3">
        <ButtonComp
          text="Evidence"
          className="flex-1 py-2 text-sm font-semibold rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white hover:bg-zinc-950  transition-colors cursor-pointer"
          onClick={() => handleEvidence(claim.id)}
        />
        <ButtonComp
          text={!shareModal ? "Send Verification" : "Close"}
          onClick={() => setShareModal(!shareModal)}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg border  cursor-pointer  border-zinc-700 transition-colors ${
            shareModal
              ? "border-zinc-100"
              : " hover:border-zinc-500 hover:text-white hover:bg-zinc-950"
          }`}
        />
      </div>
      {isChange ? (
        <div className="flex  items-center justify-end  border border-transparent px-4 py-2 bg-zinc-900">
          <ButtonComp
            text={!isSubmitting ? "SAVE" : "Saving..."}
            onClick={() => handleSave()}
            disabled={!isChange}
            className={`p-1 ${isChange ? "bg-blue-600 border border-blue-400 hover:bg-blue-500 cursor-pointer" : "bg-blue-800 border border-blue-400"} rounded`}
          />
        </div>
      ) : (
        <></>
      )}

      {shareModal ? (
        <section className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter username or email"
            className="p-1  text-white w-full bg-zinc-900 rounded"
            onChange={(e) => {
              setSearchEmail(e.target.value);
            }}
          />

          <section className="flex flex-col gap-1">
            <label className="text-zinc-400">Search Result</label>
            <div className="border border-zinc-500" />
            {userList?.length! > 0 ? (
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
            ) : (
              <UserCard
                github_avatar_url=""
                icon={<MdOutlineMail />}
                shareModal={() => setShareModal(!shareModal)}
                claimId={claim.id}
                verifier_email={searchEmail!}
              />
            )}
          </section>

          <section className="flex flex-col gap-1">
            <label className="text-zinc-400">Users</label>
            <div className="border border-zinc-500" />
            {data
              ?.filter((data) => data.email !== user?.email)
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
      ) : (
        <></>
      )}
    </div>
  );
}
