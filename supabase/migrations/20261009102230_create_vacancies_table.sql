/*
# Create vacancies table and vacancy-files storage bucket

1. New table: vacancies
- Stores job vacancy postings with up to 6 image URLs (flyers/posters)
- Each vacancy has a title, optional description, display order, and active flag

2. New Storage Bucket: vacancy-files
- Public read access so visitors can view vacancy flyer images
- Upload policies allow anon/authenticated to upload files

3. RLS
- 4 separate policies (SELECT, INSERT, UPDATE, DELETE) for anon/authenticated
- This is a no-auth public app, so both anon and authenticated can manage vacancies
*/

CREATE TABLE IF NOT EXISTS vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  image_urls text[],
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_vacancies" ON vacancies;
CREATE POLICY "select_vacancies" ON vacancies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_vacancies" ON vacancies;
CREATE POLICY "insert_vacancies" ON vacancies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_vacancies" ON vacancies;
CREATE POLICY "update_vacancies" ON vacancies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_vacancies" ON vacancies;
CREATE POLICY "delete_vacancies" ON vacancies FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('vacancy-files', 'vacancy-files', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_vacancy_files" ON storage.objects;
CREATE POLICY "public_read_vacancy_files"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'vacancy-files');

DROP POLICY IF EXISTS "anon_upload_vacancy_files" ON storage.objects;
CREATE POLICY "anon_upload_vacancy_files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'vacancy-files');

DROP POLICY IF EXISTS "anon_update_vacancy_files" ON storage.objects;
CREATE POLICY "anon_update_vacancy_files"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'vacancy-files') WITH CHECK (bucket_id = 'vacancy-files');

DROP POLICY IF EXISTS "anon_delete_vacancy_files" ON storage.objects;
CREATE POLICY "anon_delete_vacancy_files"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'vacancy-files');
