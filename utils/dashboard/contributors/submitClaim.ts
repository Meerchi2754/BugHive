import { useAuth } from "@/context/authContext";
import { ClaimFormType } from "@/lib/validations/claims";
import { UserDB } from "@/types";

export async function submitClaimForm(Formdata: ClaimFormType, user: UserDB) {
  const res = await fetch("/api/getUser/git", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      providerToken: user?.github_access_token,
      iv: user?.ivkey,
      pr_url: Formdata.prLink,
      github_username: user?.github_username,
      user_id: user?.id,
      claim_type: Formdata.claimType,
      description: Formdata.description,
      visibility: Formdata.visibility,
    }),
  });
  return res;
}
