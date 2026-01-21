-- PulseTrack Database Schema
-- Real-time visitor counter application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tokens table: stores widget configurations
CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_blocked BOOLEAN DEFAULT FALSE,
  widget_defaults JSONB DEFAULT '{}',
  created_via_public BOOLEAN DEFAULT TRUE,
  site_url TEXT,
  site_name TEXT
);

-- Presence table: tracks active visitors (heartbeat-based)
CREATE TABLE IF NOT EXISTS presence (
  token TEXT NOT NULL REFERENCES tokens(token) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  path TEXT,
  referrer TEXT,
  PRIMARY KEY (token, visitor_id)
);

-- Events table: stores pageview and heartbeat events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT NOT NULL REFERENCES tokens(token) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'pageview' or 'heartbeat'
  path TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_presence_token ON presence(token);
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_events_token ON events(token);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);

-- Enable Row Level Security
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tokens
-- Public can read non-blocked tokens (for widget validation)
CREATE POLICY "Allow public read of non-blocked tokens" ON tokens
  FOR SELECT USING (is_blocked = FALSE);

-- Service role can do everything
CREATE POLICY "Service role full access to tokens" ON tokens
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for presence
-- Public can read aggregated presence data (count only, no sensitive data)
CREATE POLICY "Allow public read of presence" ON presence
  FOR SELECT USING (TRUE);

-- Only service role can insert/update/delete presence
CREATE POLICY "Service role full access to presence" ON presence
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for events
-- Public cannot read events directly (privacy)
CREATE POLICY "No public access to events" ON events
  FOR SELECT USING (FALSE);

-- Service role can do everything with events
CREATE POLICY "Service role full access to events" ON events
  FOR ALL USING (auth.role() = 'service_role');

-- Function to count online visitors (last 45 seconds)
CREATE OR REPLACE FUNCTION get_online_count(p_token TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM presence
    WHERE token = p_token
    AND last_seen_at > NOW() - INTERVAL '45 seconds'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top pages for a token
CREATE OR REPLACE FUNCTION get_top_pages(p_token TEXT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE(path TEXT, visitor_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.path, COUNT(*)::BIGINT as visitor_count
  FROM presence p
  WHERE p.token = p_token
  AND p.last_seen_at > NOW() - INTERVAL '45 seconds'
  AND p.path IS NOT NULL
  GROUP BY p.path
  ORDER BY visitor_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get timeline data (last 30 minutes, aggregated by minute)
CREATE OR REPLACE FUNCTION get_timeline(p_token TEXT)
RETURNS TABLE(minute TIMESTAMPTZ, visitor_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('minute', e.created_at) as minute,
    COUNT(DISTINCT e.visitor_id)::BIGINT as visitor_count
  FROM events e
  WHERE e.token = p_token
  AND e.created_at > NOW() - INTERVAL '30 minutes'
  GROUP BY date_trunc('minute', e.created_at)
  ORDER BY minute ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up stale presence records (run periodically)
CREATE OR REPLACE FUNCTION cleanup_stale_presence()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM presence
  WHERE last_seen_at < NOW() - INTERVAL '5 minutes';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_online_count(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_pages(TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_timeline(TEXT) TO anon, authenticated;
