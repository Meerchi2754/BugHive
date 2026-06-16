import { createClient } from "@/lib/supabase/client";

export async function getContributor(){
    const supabase=await createClient();
    const {data,error}=await supabase.from("users").select("username,email").eq("role",'CONTRIBUTOR');
    if(error){
        console.log("ERROR IN GETTING CONTRIBUTOR ROLE:",error);
        return;
    }
    return data;
}