import { createClient } from "@/lib/supabase/server";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

type PR = {
  pr_url: string;
  additions: number;
  deletions: number;
  merged_at: string;
  body: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  issue_url: string;
  changed_files_count: number;
  fileChanges: [
    {
      filename: string;
    },
  ];
};
export async function createPR(
  pr_url: string,
  additions: number,
  deletions: number,
  merged_at: string,
  body: string,
  created_at: string,
  updated_at: string,
  issue_url: string,
  changed_files_count: number,
  fileChanges: string[],
) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pr_table").insert({
    pr_url: pr_url,
    additions: additions,
    deletions: deletions,
    body: body,
    changed_files_count: changed_files_count,
    issue_url: issue_url,
    file_changes: fileChanges,
    merged_at: merged_at,
    pr_created_at: created_at,
    pr_updated_at: updated_at,
  });

  if (error) {
    console.log("ERROR PR:", error);

    throw new Error(`${error}`);
  }
  return data;
}
