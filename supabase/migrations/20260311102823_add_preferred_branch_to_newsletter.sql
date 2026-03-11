/*
  # Add preferred branch to newsletter subscribers

  1. Changes
    - Add `preferred_branch` column to `newsletter_subscribers` table
    - Allows users to select their preferred branch when subscribing
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'preferred_branch'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN preferred_branch TEXT;
  END IF;
END $$;
