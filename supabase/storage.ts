
// Storage bucket for post media
export const createPostMediaBucket = `
CREATE BUCKET IF NOT EXISTS "post-media" WITH (
  public = true,
  file_size_limit = 5242880, -- 5 MB
  allowed_mime_types = '{image/png,image/jpeg,image/gif}'
);

-- Add policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (
    bucket_id = 'post-media' AND 
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Allow authenticated users to update their own objects
CREATE POLICY "Allow users to update their own images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'post-media' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Allow authenticated users to delete their own objects
CREATE POLICY "Allow users to delete their own images" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'post-media' AND
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- Allow public read access to post media
CREATE POLICY "Allow public read access to post images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'post-media');
`;
