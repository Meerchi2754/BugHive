"use client";

import { VerifierClaimCard } from "@/component/verifier/ClaimCard";
import { useAuth } from "@/context/authContext";
import { getVerifierClaims } from "@/services/dashboard/verifier/getVerifierClaim";
import { useQuery } from "@tanstack/react-query";

export default function VerifyClaim() {
  const { user } = useAuth();
  const { data, error, isLoading } = useQuery({
    queryKey: ["verifierClaims"],
    queryFn: () => getVerifierClaims(user?.email!),
  });

  return (
    <>
      {isLoading && (
        <div>
          <p>Loading...</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-3 gap-5 p-2 ">
          {data?.data?.map((i) => (
            <VerifierClaimCard key={i.id} claimData={i} />
          ))}
        </div>
      )}
    </>
  );
}
