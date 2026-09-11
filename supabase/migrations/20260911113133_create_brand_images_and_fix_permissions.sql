-- 1. Create brand_images table
CREATE TABLE IF NOT EXISTS brand_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL UNIQUE,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_brand_images" ON brand_images;
CREATE POLICY "anon_select_brand_images" ON brand_images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_brand_images" ON brand_images;
CREATE POLICY "anon_insert_brand_images" ON brand_images FOR INSERT
  TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_brand_images" ON brand_images;
CREATE POLICY "anon_update_brand_images" ON brand_images FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_brand_images" ON brand_images;
CREATE POLICY "anon_delete_brand_images" ON brand_images FOR DELETE
  TO anon USING (true);

-- 2. Fix product_images policies for password-gate approach (anon can write)
DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
CREATE POLICY "anon_insert_product_images" ON product_images FOR INSERT
  TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
CREATE POLICY "anon_update_product_images" ON product_images FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;
CREATE POLICY "anon_delete_product_images" ON product_images FOR DELETE
  TO anon USING (true);

-- 3. Storage: allow anon to upload to product-images bucket
DROP POLICY IF EXISTS "auth_insert_product_images_bucket" ON storage.objects;
CREATE POLICY "anon_insert_product_images_bucket" ON storage.objects FOR INSERT
  TO anon WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_update_product_images_bucket" ON storage.objects;
CREATE POLICY "anon_update_product_images_bucket" ON storage.objects FOR UPDATE
  TO anon USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_delete_product_images_bucket" ON storage.objects;
CREATE POLICY "anon_delete_product_images_bucket" ON storage.objects FOR DELETE
  TO anon USING (bucket_id = 'product-images');

-- 4. Create brand-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_read_brand_logos_bucket" ON storage.objects;
CREATE POLICY "anon_read_brand_logos_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "anon_insert_brand_logos_bucket" ON storage.objects;
CREATE POLICY "anon_insert_brand_logos_bucket" ON storage.objects FOR INSERT
  TO anon WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "anon_update_brand_logos_bucket" ON storage.objects;
CREATE POLICY "anon_update_brand_logos_bucket" ON storage.objects FOR UPDATE
  TO anon USING (bucket_id = 'brand-logos') WITH CHECK (bucket_id = 'brand-logos');

DROP POLICY IF EXISTS "anon_delete_brand_logos_bucket" ON storage.objects;
CREATE POLICY "anon_delete_brand_logos_bucket" ON storage.objects FOR DELETE
  TO anon USING (bucket_id = 'brand-logos');