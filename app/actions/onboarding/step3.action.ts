import { step3Services } from "@/services/onboarding/step3Services";
import { FormDataResponse } from "@/types";
export async function step3Action(data: FormDataResponse, email: string) {
  const { remote, location, availability } = data;
  const res = await step3Services(remote, location, availability, email);
  console.log("UPDATED USERNAME:2", res);
}
