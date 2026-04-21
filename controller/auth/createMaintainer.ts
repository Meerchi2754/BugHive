import { createMaintainers } from "@/services/auth/createMaintainers";

export async function createMaintainer(
  email: string,
  email_confirmed_at: string,
) {
  const { data, error } = await createMaintainers(email, email_confirmed_at);
  //console.log("ERROR IN CREATING MAINTEAINER:", error);

  if (error) {
    throw new Error("Error in creating Maintainer", error);
  }
  return data;
}
