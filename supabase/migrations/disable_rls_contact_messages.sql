-- Temporarily disable RLS for contact_messages to allow anonymous inserts
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- Grant explicit permissions
GRANT INSERT, SELECT ON contact_messages TO anon;
GRANT ALL PRIVILEGES ON contact_messages TO authenticated;

-- Grant usage on the sequence for the id column
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;