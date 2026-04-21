import { createClient } from "@/lib/supabase/admin";

export async function getAllUserName(username: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .like("username", `%${username}%`);
  if (error) return error;
  const available = data.length === 0;
  return available;
}
