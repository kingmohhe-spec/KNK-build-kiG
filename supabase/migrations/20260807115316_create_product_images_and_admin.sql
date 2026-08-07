/*
# Create product images table and admin auth setup

1. New Tables
- `product_images`
  - `id` (uuid, primary key)
  - `category_name` (text, not null) - e.g. "Building Materials"
  - `product_name` (text, not null) - e.g. "Cement & Concrete"
  - `image_url` (text, not null) - URL to the uploaded image (Supabase Storage public URL)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  - Unique constraint on (category_name, product_name) so each product has one custom image.

2. Security
- Enable RLS on `product_images`.
- SELECT: anyone (anon + authenticated) can read - images need to display on the public site.
- INSERT/UPDATE/DELETE: only authenticated users can modify - admin only.
*/

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name text NOT NULL,
  product_name text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (category_name, product_name)
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read product images (public site needs them)
DROP POLICY IF EXISTS "anon_select_product_images" ON product_images;
CREATE POLICY "anon_select_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated users (admins) can insert
DROP POLICY IF EXISTS "auth_insert_product_images" ON product_images;
CREATE POLICY "auth_insert_product_images" ON product_images FOR INSERT
  TO authenticated WITH CHECK (true);

-- Only authenticated users (admins) can update
DROP POLICY IF EXISTS "auth_update_product_images" ON product_images;
CREATE POLICY "auth_update_product_images" ON product_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated users (admins) can delete
DROP POLICY IF EXISTS "auth_delete_product_images" ON product_images;
CREATE POLICY "auth_delete_product_images" ON product_images FOR DELETE
  TO authenticated USING (true);

-- Also create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "anon_read_product_images_bucket" ON storage.objects;
CREATE POLICY "anon_read_product_images_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_insert_product_images_bucket" ON storage.objects;
CREATE POLICY "auth_insert_product_images_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_update_product_images_bucket" ON storage.objects;
CREATE POLICY "auth_update_product_images_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "auth_delete_product_images_bucket" ON storage.objects;
CREATE POLICY "auth_delete_product_images_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'product-images');
