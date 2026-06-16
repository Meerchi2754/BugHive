import { createClient } from "@/lib/supabase/client";

export async function createShortList(name:string,maintainer_id:string){
    const supabase=await createClient();

    // Check for duplicate name
    const { data: existing, error: fetchError } = await supabase
        .from("shortlists")
        .select("name")
        .eq("maintainer_id", maintainer_id)
        .eq("name", name)
        .maybeSingle();

    if(fetchError){
        console.log("Error checking existing shortlists:", fetchError);
        return false;
    }

    if(existing){
        throw new Error("Please select a different name");
    }

    const {error}=await supabase.from("shortlists").insert({
        maintainer_id:maintainer_id,
        name:name,
    })

    if(error){
        console.log("Error in Creating Shortlist:",error);
        return false; 
    }

    return true;
}