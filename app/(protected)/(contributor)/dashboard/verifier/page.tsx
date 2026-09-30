"use client";
import { ClaimCard } from "@/component/dashboard/claims/ClaimCard";
import { DeclineModal } from "@/component/dashboard/verifier/DeclineModal";
import { ButtonComp } from "@/component/ui/button";
import { VerifierClaimCard } from "@/component/verifier/ClaimCard";
import { useAuth } from "@/context/authContext";
import { getVerifierClaims } from "@/services/dashboard/verifier/getVerifierClaim";
import { jwtSign } from "@/utils/jwt/jwt";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/context/themeContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifierDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data, error, isLoading } = useQuery({
    queryKey: ["verifierClaims"],
    queryFn: () => getVerifierClaims(user?.email!),
    enabled: !!user?.email,
  });
  const router = useRouter();

  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectClaim, setSelectClaim] = useState<string | null>(null);

  const handleReview = async (claimId: string) => {
    const token = await jwtSign(claimId);
    router.push(`/verify/claims/${token}`);
  };

  return (
    <>
      {isLoading && (
        <div>
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && data?.data && data.data.length > 0 ? (
        <div className="grid grid-cols-3 gap-5 p-2 m-2">
          {data?.data?.map((i) => (
            <VerifierClaimCard key={i.claim_Id} claimData={i} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-5 px-4 text-center">
            {/* Icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(1, 102, 48, 0.12)",
                border: "1px solid rgba(1, 102, 48, 0.35)",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#016630"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <h2
                className="text-base font-semibold"
                style={{ color: isDark ? "#F3F4F6" : "#111827" }}
              >
                No claims to verify
              </h2>
              <p
                className="text-sm max-w-xs leading-relaxed"
                style={{ color: isDark ? "#8B949E" : "#4B5563" }}
              >
                You have no pending verification requests at the moment. Check back later or ask a contributor to send you a claim.
              </p>
            </div>

            {/* Status pill */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "rgba(1, 102, 48, 0.10)",
                color: "#016630",
                border: "1px solid rgba(1, 102, 48, 0.30)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#016630" }}
              />
              Up to date
            </span>
          </div>
        )
      )}
    </>
  );
}
