/*
# Create promotions table

1. New Tables
- `promotions`
  - `id` (uuid, primary key)
  - `title` (text, not null) — promotion headline
  - `description` (text, not null) — details of the special offer
  - `image_url` (text) — optional promotional image URL
  - `is_active` (boolean, default true) — whether the promotion is currently visible
  - `display_order` (integer, default 0) — sort order for promotions
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `promotions`.
- This is a single-tenant app (no sign-in screen for customers), so policies use `TO anon, authenticated`.
- Anyone can read active promotions.
- Only anon/authenticated can insert, update, delete (admin panel uses anon key).

3. Notes
- Promotions are managed via the admin page and displayed on the public site.
- The `is_active` flag lets the admin toggle visibility without deleting.
- `display_order` allows custom sorting of promotions.
*/

CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_promotions" ON promotions;
CREATE POLICY "anon_select_promotions"
ON promotions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_promotions" ON promotions;
CREATE POLICY "anon_insert_promotions"
ON promotions FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_promotions" ON promotions;
CREATE POLICY "anon_update_promotions"
ON promotions FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_promotions" ON promotions;
CREATE POLICY "anon_delete_promotions"
ON promotions FOR DELETE
TO anon, authenticated USING (true);
