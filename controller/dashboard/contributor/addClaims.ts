import { createClaims } from "@/services/dashboard/createClaims";
import { createPR } from "@/services/dashboard/createPR";

export async function addClaims(
  user_id: string,
  title: string,
  pr_url: string,
  description: string,
  visibility: string,
) {
  const data = await createClaims(
    user_id,
    title,
    pr_url,
    description,
    visibility,
  );
  return data;
}
