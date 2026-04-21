"use server";
import { JWTPAYLOAD } from "@/types/jwtPayload";
import jwt from "jsonwebtoken";
const key = process.env.JWT_SECRET_KEY!;
export async function jwtSign(
  claimId: string,
  contributor_email?: string,
  verifier_email?: string,
  sended_at?: string,
) {
  console.log(key);
  const token = await jwt.sign(
    {
      claimId: claimId,
      contributor_email: contributor_email,
      verifier_email: verifier_email,
      sended_at: sended_at,
    },
    key,
  );
  //console.log(token);
  return token;
}

export async function jwtVerify(token: string) {
  const data = (await jwt.verify(token, key)) as JWTPAYLOAD;
  //console.log("DATA:", data);
  return data;
}
