-- Create search_analytics table for tracking search queries
CREATE TABLE IF NOT EXISTS search_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  last_searched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on query for upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS idx_search_analytics_query ON search_analytics(query);

-- Create index for ordering by count
CREATE INDEX IF NOT EXISTS idx_search_analytics_count ON search_analytics(count DESC);

-- Enable RLS
ALTER TABLE search_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read
CREATE POLICY "Authenticated users can read search analytics" ON search_analytics
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for authenticated users to insert/update
CREATE POLICY "Authenticated users can insert search analytics" ON search_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update search analytics" ON search_analytics
  FOR UPDATE
  TO authenticated
  USING (true);

-- Insert some sample data
INSERT INTO search_analytics (query, count, last_searched) VALUES
  ('projet urbain', 15, NOW() - INTERVAL '1 hour'),
  ('appel offre', 12, NOW() - INTERVAL '2 hours'),
  ('logement social', 10, NOW() - INTERVAL '3 hours'),
  ('aménagement territoire', 8, NOW() - INTERVAL '4 hours'),
  ('permis construire', 7, NOW() - INTERVAL '5 hours'),
  ('plan urbanisme', 6, NOW() - INTERVAL '6 hours'),
  ('développement durable', 5, NOW() - INTERVAL '7 hours'),
  ('tourisme dakar', 4, NOW() - INTERVAL '8 hours'),
  ('contact ministère', 3, NOW() - INTERVAL '9 hours'),
  ('actualités muctat', 2, NOW() - INTERVAL '10 hours')
ON CONFLICT (query) DO UPDATE
SET count = EXCLUDED.count,
    last_searched = EXCLUDED.last_searched;