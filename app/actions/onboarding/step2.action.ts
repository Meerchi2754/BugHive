import { step2Services } from "@/services/onboarding/step2Services";
import { FormDataResponse } from "@/types";
export async function step2Action(data: FormDataResponse, email: string) {
  const { headline, bio, language } = data;
  const res = await step2Services(headline, bio, language, email);
  console.log("UPDATED USERNAME:2", res);
}
