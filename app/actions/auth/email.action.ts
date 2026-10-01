"use server";
import { createClient } from "@/lib/supabase/server";
import { EmailSchemaType } from "@/lib/validations/emailLogin";
import { findMaintainer } from "@/services/auth/findMaintainer";
import { getURL } from "@/utils/getURL";

export const EmailAction = async (Emaildata: EmailSchemaType, role: string) => {
  const supabase = await createClient();
  const { email, password } = Emaildata;

  const exist = await findMaintainer(email);
  console.log("EXIST:", exist);

  // const data2 = await emailLogin(email, password);
  // if (data2) {
  //   return { data: data2, method: "login" };
  // }

  const baseUrl = getURL();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${baseUrl}/api/auth/email/callback`,
    },
  });
  // console.log("EMAIL:", data);
  console.log("EMAIL ERROR", error);
  return { data: data, method: "login" };
};

