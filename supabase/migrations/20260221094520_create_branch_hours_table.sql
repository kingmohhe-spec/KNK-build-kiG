/*
  # Create branch_hours table

  1. New Tables
    - `branch_hours`
      - `id` (uuid, primary key)
      - `branch_name` (text)
      - `day_of_week` (text) - Monday through Sunday
      - `opening_time` (text) - HH:MM format
      - `closing_time` (text) - HH:MM format
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `branch_hours` table
    - Add policy to allow public SELECT access for viewing hours
*/

CREATE TABLE IF NOT EXISTS branch_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_name text NOT NULL,
  day_of_week text NOT NULL,
  opening_time text NOT NULL,
  closing_time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE branch_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to view branch hours"
  ON branch_hours
  FOR SELECT
  TO public
  USING (true);

INSERT INTO branch_hours (branch_name, day_of_week, opening_time, closing_time)
VALUES
  ('Dwarsloop', 'Sunday', '08:00', '13:00'),
  ('Dayizenza', 'Sunday', '08:00', '13:00'),
  ('Elukwatini', 'Sunday', '08:00', '13:00'),
  ('Kwamhlanga', 'Sunday', '08:00', '13:00'),
  ('Numbi', 'Sunday', '08:00', '13:00'),
  ('Dwarsloop', 'Monday', '07:30', '17:00'),
  ('Dayizenza', 'Monday', '07:30', '17:00'),
  ('Elukwatini', 'Monday', '07:30', '17:00'),
  ('Kwamhlanga', 'Monday', '07:30', '17:00'),
  ('Numbi', 'Monday', '07:30', '17:00'),
  ('Dwarsloop', 'Tuesday', '07:30', '17:00'),
  ('Dayizenza', 'Tuesday', '07:30', '17:00'),
  ('Elukwatini', 'Tuesday', '07:30', '17:00'),
  ('Kwamhlanga', 'Tuesday', '07:30', '17:00'),
  ('Numbi', 'Tuesday', '07:30', '17:00'),
  ('Dwarsloop', 'Wednesday', '07:30', '17:00'),
  ('Dayizenza', 'Wednesday', '07:30', '17:00'),
  ('Elukwatini', 'Wednesday', '07:30', '17:00'),
  ('Kwamhlanga', 'Wednesday', '07:30', '17:00'),
  ('Numbi', 'Wednesday', '07:30', '17:00'),
  ('Dwarsloop', 'Thursday', '07:30', '17:00'),
  ('Dayizenza', 'Thursday', '07:30', '17:00'),
  ('Elukwatini', 'Thursday', '07:30', '17:00'),
  ('Kwamhlanga', 'Thursday', '07:30', '17:00'),
  ('Numbi', 'Thursday', '07:30', '17:00'),
  ('Dwarsloop', 'Friday', '07:30', '17:00'),
  ('Dayizenza', 'Friday', '07:30', '17:00'),
  ('Elukwatini', 'Friday', '07:30', '17:00'),
  ('Kwamhlanga', 'Friday', '07:30', '17:00'),
  ('Numbi', 'Friday', '07:30', '17:00'),
  ('Dwarsloop', 'Saturday', '07:30', '15:00'),
  ('Dayizenza', 'Saturday', '07:30', '15:00'),
  ('Elukwatini', 'Saturday', '07:30', '15:00'),
  ('Kwamhlanga', 'Saturday', '07:30', '15:00'),
  ('Numbi', 'Saturday', '07:30', '15:00');
