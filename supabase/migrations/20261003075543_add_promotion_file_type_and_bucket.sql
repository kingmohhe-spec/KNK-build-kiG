/*
# Add file_type column to promotions and create promotion-files storage bucket

1. Changes to existing tables
- `promotions` table: add `file_type` column (text, default 'image')
  - Values: 'image' for photo uploads (jpg/png/etc), 'pdf' for PDF document uploads

2. New Storage Bucket
- Create `promotion-files` bucket for uploading promotion flyers (images and PDFs)
- Set public read access so visitors can view the specials

3. Security
- The promotions table already has RLS enabled with anon/authenticated CRUD policies
- The new bucket is public for read access
- Upload policies allow anon/authenticated to upload files

4. Notes
- This lets the admin upload either a photo flyer or a PDF pamphlet for each promotion
- The public site displays images directly and links PDFs with a "View PDF" button
*/

ALTER TABLE promotions ADD COLUMN IF NOT EXISTS file_type text NOT NULL DEFAULT 'image';

INSERT INTO storage.buckets (id, name, public)
VALUES ('promotion-files', 'promotion-files', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_promotion_files" ON storage.objects;
CREATE POLICY "public_read_promotion_files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'promotion-files');

DROP POLICY IF EXISTS "anon_upload_promotion_files" ON storage.objects;
CREATE POLICY "anon_upload_promotion_files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'promotion-files');

DROP POLICY IF EXISTS "anon_update_promotion_files" ON storage.objects;
CREATE POLICY "anon_update_promotion_files"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'promotion-files') WITH CHECK (bucket_id = 'promotion-files');

DROP POLICY IF EXISTS "anon_delete_promotion_files" ON storage.objects;
CREATE POLICY "anon_delete_promotion_files"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'promotion-files');
