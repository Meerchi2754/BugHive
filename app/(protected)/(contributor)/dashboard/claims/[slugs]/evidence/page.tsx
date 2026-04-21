"use client";
import { allClaim } from "@/lib/claims/allClaim";
import { useQuery } from "@tanstack/react-query";
import { use, useEffect, useRef, useState } from "react";
import { ButtonComp } from "@/component/ui/button";
import { addEvidences } from "@/app/actions/evidence/addEvidence";
import { toast } from "react-toastify";

export default function EvidencePage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = use(params);
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["claims", { id: slugs }],
    queryFn: () => allClaim(slugs),
    staleTime: 1000 * 60 * 60 * 5,
  });
  const isPresent = (data?.length ?? 0) > 0;
  const claimData = data?.[0] ?? null;
  const [modal, setModal] = useState<boolean>(false);

  // const [countLink1, setCountLink1] = useState<number>(
  //   claimData?.pr_table.evidences.length > 0
  //     ? claimData?.pr_table.evidences.length
  //     : 0,
  // );
  const [supplymentaryLink, setSupplymentaryLink] = useState<string[]>([]);
  const countLink = supplymentaryLink.length;
  const [submit, setSubmit] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addEvidence = async () => {
    try {
      const link = inputRef.current?.value;
      const data = await addEvidences(link!, claimData?.pr_table.id!);
      console.log("data:", data);
      setSupplymentaryLink([...supplymentaryLink, link!]);
      setSubmit(!submit);
      setModal(!modal);
      toast.success("Evidence Added.");
    } catch (error) {
      toast.error("Evindence Adding failed.");
    }
  };

  useEffect(() => {
    //console.log("dors");
    if (claimData?.pr_table.evidences) {
      setSupplymentaryLink(claimData.pr_table.evidences);
    }
  }, [claimData]);

  return (
    <div className="min-h-screen w-full">
      <main className="max-w-2xl mx-auto px-4 py-10 text-white">
        <h1 className="text-green-400 text-3xl font-bold mb-8">
          Evidence Record
        </h1>
        {isLoading || isFetching ? (
          <div className="w-full animate-pulse text-center text-2xl">
            <p>Loading...</p>
          </div>
        ) : isPresent ? (
          <div className="space-y-6">
            <section>
              <p className="text-xs uppercase text-gray-500 mb-1">Title</p>
              <p className="text-xl font-semibold">{claimData?.claim_title}</p>
            </section>

            <section>
              <p className="text-xs uppercase text-gray-500 mb-1">Merged At</p>
              <p
                className={
                  claimData?.pr_table.merged_at
                    ? "text-green-400"
                    : "text-yellow-500"
                }
              >
                {claimData?.pr_table
                  ? `${claimData?.pr_table?.merged_at ?? "Not Merged Yet"}`
                  : "Not Merged Yet"}
              </p>
            </section>

            <section>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Diff Stats
              </p>
              <div className="flex gap-6">
                <span className="text-green-500">
                  +{claimData?.pr_table.additions ?? 0} additions
                </span>
                <span className="text-red-500">
                  −{claimData?.pr_table.deletions ?? 0} deletions
                </span>
              </div>
            </section>

            <section>
              <p className="text-xs uppercase text-gray-500 mb-2">
                Changes Files ({claimData?.pr_table.changed_files_count ?? 0})
              </p>
              {claimData?.pr_table.file_changes.length ? (
                <ul>
                  {claimData?.pr_table.file_changes.map((file, i) => (
                    <li key={i} className=" text-gray-300">
                      {file}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No Files Recorded.</p>
              )}
            </section>

            {claimData?.pr_table.issue_url && (
              <section>
                <p>Issue</p>
                <a
                  href={claimData?.pr_table.issue_url}
                  target="_blank"
                  className="text-blue-400 underline text-sm break-all"
                >
                  {claimData?.pr_table.issue_url}
                </a>
              </section>
            )}
          </div>
        ) : (
          <h2>Claim Data unAvailable.</h2>
        )}
      </main>

      <div className="w-full border border-gray-600" />

      <section className="max-w-2xl mx-auto px-4 pt-4 pb-10">
        <h2 className="text-yellow-300 text-3xl font-bold mb-8">
          Supplymentary Evidence Section <span>{`(${countLink}/5)`}</span>
        </h2>

        <ul className="space-y-2 mb-4">
          {supplymentaryLink.map((link, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-3 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 group hover:border-zinc-500 transition-colors break-all"
            >
              🔗{link}
            </li>
          ))}
        </ul>

        {modal && countLink < 5 && (
          <div className="flex flex-col gap-3 mb-3">
            <label>Enter your Supplymentaru Link:🔗</label>
            <input
              ref={inputRef}
              type="text"
              className="bg-zinc-700 text-white p-1"
              placeholder="Link...."
              onChange={() => setSubmit(true)}
            />
            {submit && (
              <ButtonComp
                type="submit"
                text="SAVE"
                className="bg-blue-500 p-1 cursor-pointer"
                onClick={() => addEvidence()}
              />
            )}
          </div>
        )}

        <ButtonComp
          className="w-full bg-zinc-800 p-2 rounded text-lg cursor-pointer hover:bg-zinc-600"
          text={modal ? "✕" : "+"}
          disabled={!modal && countLink >= 5}
          onClick={() => {
            setSubmit(false);
            setModal(!modal);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </section>
    </div>
  );
}
