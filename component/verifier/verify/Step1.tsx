"use client";

import { verifyClaim } from "@/services/dashboard/verifier/verifyClaim";
import { claimDB } from "@/types/dashboard/contributor/claimDB.types";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

export function Step1({ claimId }: { claimId: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<claimDB>();
  useEffect(() => {
    setIsLoading(true);
    const check = async () => {
      const data = await verifyClaim(claimId);
      setData(data);
      setIsLoading(false);
    };

    check();
  }, [claimId]);

  return (
    <>
      {isLoading && (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-md w-2/3" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-md w-1/3" />
          <div className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded-md w-full" />
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase text-neutral-400 dark:text-neutral-500">
              Claim Details
            </h3>

            <div className="flex flex-row gap-3 py-3">
              <FaGithub size={23} />
              <a
                href={`${data?.pr_url}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                {data?.pr_url}
              </a>
            </div>

            <div className="flex flex-row gap-3 justify-between">
              <div className="flex flex-col">
                <p className="text-lg">Claim Title:</p>
                <p className="text-2xl font-semibold text-green-500">{`${data?.claim_title}`}</p>
              </div>
              <section className="flex items-center">
                <p className=" bg-indigo-50 dark:bg-indigo-900/40  px-3 py-0.5 w-fit border border-indigo-100 rounded font-medium">{`${data?.claim_type}`}</p>
              </section>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-lg">Description:</p>
            <p className="text-md font-light leading-relaxed">{`${data?.description}`}</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-medium text-neutral-400 uppercase tracking-wide">
              Merged At:
            </p>
            <p className="text-sm  rounded-full ">{`${data?.pr_table.merged_at ?? "PR NOT MERGED YET "}`}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
              <p className="text-md">Files Changes:</p>
              <p className="text-neutral-400 font-bold">{`${data?.pr_table.changed_files_count}`}</p>
            </div>
            <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
              <p>Additions:</p>
              <p className="font-bold text-green-400">{`${data?.pr_table.additions}`}</p>
            </div>
            <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
              <p>Deletions:</p>
              <p className="font-bold text-red-500">{`${data?.pr_table.deletions}`}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
