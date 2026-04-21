import { createClient } from "@/lib/supabase/client";
import { MaintainerFormData } from "@/types/onboarding/maintainerFormData";

export async function updateUser(formData: MaintainerFormData, email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({
      company_name: formData.project,
      techstack: formData.techStack,
      ecosystem: formData.ecoSystem,
      onboarding_complete: true,
      updated_at: new Date(),
    })
    .eq("email", email)
    .select()
    .maybeSingle();
  //console.log("UPDATE USER:", data);

  if (error) {
    console.log("ERROR TO UPDATED MAINTAINER PROFILE:", error);
  }
  return data;
}
