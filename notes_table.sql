-- Create notes table for portfolio
CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    drawing TEXT NOT NULL DEFAULT '',
    x DECIMAL NOT NULL,
    y DECIMAL NOT NULL,
    rotation DECIMAL NOT NULL,
    color TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (read for everyone, insert for anyone)
-- This allows public reading and posting of notes
CREATE POLICY "Enable read access for all users" ON notes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON notes FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS notes_timestamp_idx ON notes(timestamp DESC);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at DESC);