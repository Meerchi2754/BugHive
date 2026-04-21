"use client";
import { verificationDB } from "@/types/dashboard/verifier/verificationsDB";
import { jwtSign } from "@/utils/jwt/jwt";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonComp } from "../ui/button";
import { DeclineModal } from "../dashboard/verifier/DeclineModal";

export function VerifierClaimCard({
  claimData,
}: {
  claimData: verificationDB;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectClaim, setSelectClaim] = useState<string | null>(null);

  const handleReview = async (claimId: string) => {
    setIsLoading(true);
    const token = await jwtSign(claimId);
    router.push(`/verify/claims/${token}`);
    setIsLoading(false);
  };

  const claimDate = new Date(claimData.sent_at);

  const claim_date = claimDate.toUTCString();
  const expiryDate = claimDate.getTime() + 24 * 60 * 60 * 1000;
  const [expiryTime, setExpiryTime] = useState(expiryDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiryDate - Date.now();
      setExpiryTime(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const formatExpiry = (ms: number) => {
    const totalSecond = Math.floor(ms / 1000);

    const hours = Math.floor(totalSecond / 3600);
    const minute = Math.floor((hours % 3600) / 60);
    const seconds = totalSecond % 60;

    return `${hours}h ${minute}m ${seconds}s`;
  };

  const isEditable = expiryTime > 0;
  return (
    <>
      <div className="border border-gray-600  rounded p-2  bg-zinc-950">
        <div className="text-white font-bold text-center flex flex-row justify-between">
          <h2 className="text-lg">Review Claim</h2>
          <p
            className={`${claimData.status.toString() === "ACCEPT" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : claimData.status.toString() === "PENDING" ? "text-amber-400 bg-amber-950 border border-amber-800" : claimData.status.toString() === "DECLINED" ? " text-red-600 border border-red-700" : "text-white"} rounded p-1`}
          >{`${claimData.status}`}</p>
        </div>

        <div className="border-t border-white mt-1" />

        <div className="flex flex-col">
          <p className="uppercase text-gray-400 text-sm">Title:</p>
          <p className="  text-lg">{claimData.claims.claim_title}</p>
        </div>

        <div className="border-t border-zinc-800" />

        <div className="flex flex-col">
          <p className="uppercase text-gray-400 text-sm">Submitted By</p>
          <p className="text-lg">{claimData.users.username}</p>
        </div>
        <div className="border-t border-zinc-800" />

        <div className="border-t border-zinc-800" />

        <div className="flex flex-col">
          <p className="uppercase text-gray-400 text-sm">Sent On</p>
          <p className="text-lg">{claim_date}</p>
          <p className="text-lg"></p>
        </div>

        {isEditable ? (
          <>
            <div className="border-t border-zinc-800" />

            <div>
              <p className="uppercase text-gray-400 text-sm">Expiry In</p>
              <p>{formatExpiry(expiryTime)}</p>
            </div>
          </>
        ) : null}

        <div className="flex justify-between">
          {isEditable ? (
            <>
              <ButtonComp
                text={!isLoading ? "Review" : "Reviewing"}
                disabled={isLoading}
                className="rounded border p-2 border-amber-50 hover:border hover:border-zinc-500 mt-2 cursor-pointer "
                onClick={() => handleReview(claimData.claim_Id)}
              />
              <ButtonComp
                text="Decline"
                className=" p-2 bg-red-700 rounded border  hover:bg-red-500 border-red-400 mt-2 cursor-pointer"
                onClick={() => {
                  setSelectClaim(claimData.claim_Id);
                  setIsModal((prev) => !prev);
                }}
              />
            </>
          ) : (
            <>
              <ButtonComp
                text={!isLoading ? "Open" : "Opening"}
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  const token = await jwtSign(claimData.claim_Id);
                  router.push(`/claims/${token}`);
                  setIsLoading(false);
                }}
                className="p-2  rounded border border-amber-50 hover:border hover:border-zinc-500 cursor-pointer mt-2"
              />
            </>
          )}
        </div>
        {isModal && selectClaim === claimData.claim_Id && (
          <DeclineModal
            close={() => setIsModal((prev) => !prev)}
            claimId={claimData.claim_Id}
          />
        )}
      </div>
    </>
  );
}
