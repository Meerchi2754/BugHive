"use client";
import { ClaimCard } from "@/component/dashboard/claims/ClaimCard";
import { DeclineModal } from "@/component/dashboard/verifier/DeclineModal";
import { ButtonComp } from "@/component/ui/button";
import { VerifierClaimCard } from "@/component/verifier/ClaimCard";
import { useAuth } from "@/context/authContext";
import { getVerifierClaims } from "@/services/dashboard/verifier/getVerifierClaim";
import { jwtSign } from "@/utils/jwt/jwt";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifierDashboard() {
  const { user } = useAuth();
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
        <div className="flex justify-center items-center">
          <p className="p-2 bg-green-800 w-fit  border  border-green-500 rounded-full">
            No claims available to verify at the moment.
          </p>
        </div>
      )}
    </>
  );
}
