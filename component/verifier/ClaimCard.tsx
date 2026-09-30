"use client";
import { verificationDB } from "@/types/dashboard/verifier/verificationsDB";
import { jwtSign } from "@/utils/jwt/jwt";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonComp } from "../ui/button";
import { DeclineModal } from "../dashboard/verifier/DeclineModal";
import { useTheme } from "@/context/themeContext";

export function VerifierClaimCard({
  claimData,
}: {
  claimData: verificationDB;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
  const [expiryTime, setExpiryTime] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setExpiryTime(expiryDate - Date.now());

    const interval = setInterval(() => {
      const remaining = expiryDate - Date.now();
      setExpiryTime(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  const formatExpiry = (ms: number) => {
    const totalSecond = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecond / 3600);
    const minute = Math.floor((hours % 3600) / 60);
    const seconds = totalSecond % 60;
    return `${hours}h ${minute}m ${seconds}s`;
  };

  const isEditable = isClient && expiryTime > 0;
  return (
    <>
      <div
        className={`p-4 rounded-xl border transition-colors shadow-sm ${
          isDark
            ? "bg-[#0D1013] border-[#24282D] text-[#F3F4F6]"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <div className="font-semibold text-center flex flex-row justify-between items-center mb-2">
          <h2 className="text-base">Review Claim</h2>
          <span
            className={`text-xs px-2 py-0.5 rounded font-semibold border ${
              claimData.status.toString() === "ACCEPT"
                ? isDark
                  ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                : claimData.status.toString() === "PENDING"
                ? isDark
                  ? "text-amber-400 bg-amber-950 border-amber-800"
                  : "text-amber-700 bg-amber-50 border-amber-200"
                : claimData.status.toString() === "DECLINED"
                ? isDark
                  ? "text-red-400 bg-red-950 border-red-800"
                  : "text-red-700 bg-red-50 border-red-200"
                : "text-gray-500"
            }`}
          >
            {`${claimData.status}`}
          </span>
        </div>

        <div className={`border-t my-2 ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

        <div className="flex flex-col py-1">
          <p className={`uppercase text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Title:</p>
          <p className="text-sm font-medium">{claimData.claims.claim_title}</p>
        </div>

        <div className={`border-t my-2 ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

        <div className="flex flex-col py-1">
          <p className={`uppercase text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Submitted By</p>
          <p className="text-sm font-medium">{claimData.users.username}</p>
        </div>

        <div className={`border-t my-2 ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />

        <div className="flex flex-col py-1">
          <p className={`uppercase text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Sent On</p>
          <p className="text-xs">{claim_date}</p>
        </div>

        {isEditable ? (
          <>
            <div className={`border-t my-2 ${isDark ? "border-[#24282D]" : "border-gray-100"}`} />
            <div>
              <p className={`uppercase text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-500"}`}>Expiry In</p>
              <p className="text-xs font-mono">{formatExpiry(expiryTime)}</p>
            </div>
          </>
        ) : null}

        <div className="flex justify-between gap-2 mt-4 pt-2">
          {isEditable ? (
            <>
              <ButtonComp
                text={!isLoading ? "Review" : "Reviewing"}
                disabled={isLoading}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isDark
                    ? "border-emerald-600/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    : "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
                onClick={() => handleReview(claimData.claim_Id)}
              />
              <ButtonComp
                text="Decline"
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
                onClick={() => {
                  setSelectClaim(claimData.claim_Id);
                  setIsModal((prev) => !prev);
                }}
              />
            </>
          ) : (
            <ButtonComp
              text={!isLoading ? "Open" : "Opening"}
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                const token = await jwtSign(claimData.claim_Id);
                router.push(`/claims/${token}`);
                setIsLoading(false);
              }}
              className={`w-full py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isDark
                  ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            />
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
