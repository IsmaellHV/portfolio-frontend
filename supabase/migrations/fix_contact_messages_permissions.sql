-- Grant permissions for contact_messages table
GRANT ALL PRIVILEGES ON contact_messages TO anon;
GRANT ALL PRIVILEGES ON contact_messages TO authenticated;

-- Create RLS policies for contact_messages
CREATE POLICY "Allow anonymous users to insert contact messages" ON contact_messages
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert contact messages" ON contact_messages
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact messages" ON contact_messages
  FOR SELECT TO authenticated
  USING (true);

-- Enable RLS on the table (if not already enabled)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;