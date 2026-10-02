import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "contributor_cover_banner";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadBanner(file: File, userId: string): Promise<string | null> {
  if (!file || !userId) {
    throw new Error("File and User ID are required.");
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Invalid file format. Please upload a JPG, PNG, or WebP image.");
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds the 5MB limit.");
  }

  const supabase = createClient();
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "webp";
  // Path format: contributor/<userId>/banner-<timestamp>.<ext>
  const filePath = `contributor/${userId}/banner-${Date.now()}.${fileExt}`;

  // 1. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true,
      cacheControl: "3600",
    });

  if (uploadError) {
    console.error("Supabase Storage Upload Error:", uploadError);
    throw new Error(uploadError.message || "Failed to upload banner image.");
  }

  // 2. Get Public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  // 3. Update banner_url in users table
  const { error: dbError } = await supabase
    .from("users")
    .update({ banner_url: publicUrl })
    .eq("id", userId);

  if (dbError) {
    console.error("Database Update Error:", dbError);
    throw new Error("Failed to update user profile with new banner URL.");
  }

  return publicUrl;
}

export async function deleteBanner(userId: string): Promise<boolean> {
  if (!userId) return false;
  const supabase = createClient();

  // 1. Set banner_url to null in users table
  const { error: dbError } = await supabase
    .from("users")
    .update({ banner_url: null })
    .eq("id", userId);

  if (dbError) {
    console.error("Error deleting banner in DB:", dbError);
    throw new Error("Failed to remove banner from profile.");
  }

  return true;
}
