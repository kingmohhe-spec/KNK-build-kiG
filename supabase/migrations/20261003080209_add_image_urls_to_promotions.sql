/*
# Add image_urls array column to promotions

1. Changes to existing tables
- `promotions` table: add `image_urls` column (text[], nullable, default null)
  - Stores up to 6 image URLs for a multi-image promotion gallery
  - Each entry is a public URL to an uploaded image in the promotion-files storage bucket

2. Security
- No RLS policy changes needed — the promotions table already has full CRUD policies for anon/authenticated

3. Notes
- The existing `image_url` and `file_type` columns remain for backward compatibility
- New promotions will use `image_urls` (array) for storing 1-6 images
- The old single `image_url` column will be kept in sync as the first image for backward compatibility
*/

ALTER TABLE promotions ADD COLUMN IF NOT EXISTS image_urls text[];
