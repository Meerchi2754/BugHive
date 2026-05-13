import { createClaims } from "@/services/dashboard/createClaims";
import { createPR } from "@/services/dashboard/createPR";

export async function addClaims(
  user_id: string,
  title: string,
  pr_url: string,
  claim_type:string,
  description: string,
  visibility: string,
) {

  /*
  user_id: string,
  title: string,
  pr_url: string,
  claim_type: string,
  description: string,
  visibility: string,
  */ 
  const data = await createClaims(
    user_id,
    title,
    pr_url,
    claim_type,
    description,
    visibility,
  );
  return data;
}
