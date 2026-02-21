/*
  # Add public insert policies for forms

  1. Newsletter Subscribers
    - Allow anonymous users to insert their email
  2. Quote Requests
    - Allow anonymous users to insert quote requests

  Security:
    - Policies only allow INSERT, no SELECT/UPDATE/DELETE for anonymous users
    - Email uniqueness is enforced at the database level for newsletter
*/

CREATE POLICY "Allow public to subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to submit quotes"
  ON quote_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);
