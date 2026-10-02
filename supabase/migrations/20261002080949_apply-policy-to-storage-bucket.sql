-- (Optional) Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('contributor_cover_banner', 'contributor_cover_banner', true)
ON CONFLICT (id) DO NOTHING;

-- 1. Allow public read access
CREATE POLICY "Public Read Banners" ON storage.objects 
FOR SELECT USING (bucket_id = 'contributor_cover_banner');

-- 2. Allow authenticated users to upload only inside contributor/<their_user_id>/
CREATE POLICY "User Upload Banner" ON storage.objects 
FOR INSERT TO authenticated 
WITH CHECK (
  bucket_id = 'contributor_cover_banner' 
  AND (storage.foldername(name))[1] = 'contributor'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

-- 3. Allow users to update their own banner
CREATE POLICY "User Update Banner" ON storage.objects 
FOR UPDATE TO authenticated 
USING (
  bucket_id = 'contributor_cover_banner' 
  AND (storage.foldername(name))[1] = 'contributor'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);

-- 4. Allow users to delete their own banner
CREATE POLICY "User Delete Banner" ON storage.objects 
FOR DELETE TO authenticated 
USING (
  bucket_id = 'contributor_cover_banner' 
  AND (storage.foldername(name))[1] = 'contributor'
  AND (storage.foldername(name))[2] = (auth.uid())::text
);
