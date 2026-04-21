import { step1Services } from "@/services/onboarding/step1Services";
import { FormDataResponse } from "@/types";
export async function step1Action(data: FormDataResponse, email: string) {
  const { username } = data;
  const res = await step1Services(username, email);
  console.log("UPDATED USERNAME");
}
