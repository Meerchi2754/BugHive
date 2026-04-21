"use client";

import { ButtonComp } from "@/component/ui/button";
import { useState } from "react";
import { ClaimsForm } from "@/component/dashboard/claimsForm/ClaimsForm";
import { allClaim } from "@/lib/claims/allClaim";
import { useQuery } from "@tanstack/react-query";
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";
import { ClaimCard } from "@/component/dashboard/claims/ClaimCard";

export default function Claims() {
  const [claimForm, setClaimForm] = useState<boolean>(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["claims"],
    queryFn: () => allClaim(),
    staleTime: 1000 * 60 * 60 * 5,
  });

  if (isError) {
    console.log("Error in fetching Claims", error);
  }
  if (!data) return null;
  //console.log("DATA LENGTH:", data);
  const hasClaims = data.length > 0;

  return (
    <div className="relative">
      {!hasClaims ? (
        <div className="flex flex-col justify-center items-center relative min-h-[calc(100vh-64px)]">
          <ButtonComp
            onClick={() => setClaimForm(true)}
            className="flex items-center justify-center bg-green-800 p-3 border border-green-500 rounded-full cursor-pointer hover:bg-green-900"
            text="Add Your First Contribution Claims"
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-4 items-start p-6">
          {data.map((claim: claimDB) => (
            <div key={claim.id}>
              <ClaimCard claim={claim} />
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : claimForm ? (
        <ClaimsForm onClose={() => setClaimForm(false)} />
      ) : (
        <ButtonComp
          type="button"
          text="Add Claims"
          onClick={() => setClaimForm(true)}
          className="bg-green-800 p-3 z-10 border border-green-400 rounded-full fixed bottom-10 right-10 cursor-pointer hover:bg-green-900"
        />
      )}
    </div>
  );
}
