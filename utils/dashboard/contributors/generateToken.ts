import { jwtSign, jwtVerify } from "@/utils/jwt/jwt";

export async function generateTokenFn({
  claimId,
  contributor_email,
  verifier_email,
  sended_at,
}: {
  claimId: string;
  contributor_email: string;
  verifier_email: string;
  sended_at: string;
}) {
  const token = await jwtSign(
    claimId,
    contributor_email,
    verifier_email,
    sended_at,
  );
  return token;
}
