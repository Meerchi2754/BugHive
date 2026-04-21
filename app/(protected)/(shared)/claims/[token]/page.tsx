"use client";

import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { getClaimDetail } from "@/services/getClaimDetail/getClaimDetail";
import { claimDetailType } from "@/types/verifier/claimDetails";
import { jwtVerify } from "@/utils/jwt/jwt";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ClaimDetails({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<claimDetailType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const decrypt = async () => {
      try {
        setIsLoading(true);
        const cokie = await jwtVerify(token);
        const data = await getClaimDetail(cokie.claimId);
        setData(data);
      } catch (error) {
        toast.error("Something Went Wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    decrypt();
  }, []);

  return (
    <>
      {isLoading && (
        <div>
          <p>Loading....</p>
        </div>
      )} 
      {!isLoading && (
        <div className="max-w-8xl px-4  py-4 flex flex-col gap-6 rounded h-screen overflow-y-auto bg-zinc-950 ">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <h2 className="text-3xl font-medium">
                {data?.claim_title}
              </h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  data?.verification_status === "ACCEPT"
                    ? "bg-green-200 text-green-800"
                    : data?.verification_status === "PENDING"
                    ? "bg-amber-100 text-amber-800"
                    : data?.verification_status === "DECLINED"
                    ? "bg-red-100 text-red-800"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {data?.verification_status}
              </span>
            </div>
            <span className="text-sm font-medium p-2 rounded text-mist-100 w-fit bg-mist-800">
              {data?.claim_type}
            </span>
          </div>

          {data?.description && (
            <div className="border border-zinc-200 rounded-xl p-4">
              <p className="text-xs uppercase text-zinc-400 mb-1">
                Description
              </p>
              <p className="text-sm font-semibold">{data.description}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-4 pt-3">
            <div className="rounded-lg p-3 bg-zinc-900 text-center">
              <p className="text-xs text-zinc-400 mb-1">Additions</p>
              <p className="text-green-600">+{data?.pr_table.additions}</p>
            </div>
            <div className="rounded-lg p-3 bg-zinc-900 text-center">
              <p className="text-xs text-zinc-400 mb-1">Deletions</p>
              <p className="text-red-500">-{data?.pr_table.deletions}</p>
            </div>
            <div className="rounded-lg p-3 bg-zinc-900 text-center">
              <p className="text-xs text-zinc-400 mb-1">Files Changed</p>
              <p className="text-zinc-600">
                +{data?.pr_table.changed_files_count}
              </p>
            </div>
          </div>

          {data?.pr_table.file_changes.length === 0 && (
            <div className="flex flex-col gap-1 border border-zinc-100 rounded-xl p-4">
              <p className="text-xs uppercase text-zinc-400 mb-1">
                Changed Files
              </p>
              <p>No files Found</p>
            </div>
          )}

          {/* ✅ Added min-h-0 to the row so flex children can shrink */}
          <div className="flex flex-row gap-3 justify-evenly min-h-0">
            <div className="flex-1 border border-zinc-100 rounded-xl p-4">
              <p className="text-xs uppercase text-zinc-400 mb-1">
                Pull Request
              </p>
              
              <a  href={data?.pr_url}
                target="_blank"
                className="text-blue-500 hover:underline"
                >
                View PR →
              </a>
            </div>

            {data?.pr_table.file_changes.length! > 0 && (
              <div className="flex-1 flex flex-col gap-1 border border-zinc-100 rounded-xl p-4">
                <p className="text-xs uppercase text-zinc-400 mb-1">
                  Changed Files
                </p>
                <div className="overflow-y-auto max-h-56 pr-2">
                  {data?.pr_table.file_changes.map((i) => (
                    <p
                      key={i}
                      className="text-xs font-mono text-zinc-600 rounded px-2 mt-2 break-all"
                    >
                      {i}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {data?.pr_table.merged_at && (
              <div className="flex-1 border border-white mt-3 rounded-xl p-4">
                <p className="text-xs text-zinc-400 mt-3">Merged</p>
                <p>
                  {data.pr_table.merged_at.split("T")[0]}{" "}
                  {data.pr_table.merged_at.split("T")[1].split(":")[0]}:
                  {data.pr_table.merged_at.split("T")[1].split(":")[1]}
                </p>
              </div>
            )}
          </div>

          {data?.verifications && (
            <div className="border border-zinc-200 p-4 rounded-xl">
              <p>Verification Scores</p>
              <div className="grid grid-cols-3 gap-3 mb-4 pt-3">
                <div className="rounded-lg p-3 bg-zinc-900 text-center">
                  <p className="text-xs text-zinc-400 mb-1">
                    Technical complexity
                  </p>
                  <p>{data?.verifications[0].technical_complexity ?? "-"}</p>
                </div>
                <div className="rounded-lg p-3 bg-zinc-900 text-center">
                  <p className="text-xs text-zinc-400 mb-1">Codebase impact</p>
                  <p>{data?.verifications[0].codebase_impact ?? "-"}</p>
                </div>
                <div className="rounded-lg p-3 bg-zinc-900 text-center">
                  <p className="text-xs text-zinc-400 mb-1">
                    Collaboration quality
                  </p>
                  <p>{data?.verifications[0].collaboration_quality ?? "-"}</p>
                </div>
              </div>
            </div>
          )}

          <ButtonComp
            text="Back to Claims"
            onClick={() => {
              user?.role === "CONTRIBUTOR"
                ? router.push("/dashboard/verifier")
                : router.push("/verify/claims");
            }}
            className="border border-white p-2 rounded hover:border hover:border-zinc-700 mb-4 cursor-pointer"
          />
        </div>
      )}
    </>
  );
}