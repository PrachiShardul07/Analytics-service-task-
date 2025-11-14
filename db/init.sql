-- events table: store raw events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  site_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  path TEXT,
  user_id TEXT,
  event_ts TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_site_date ON events (site_id, (date_trunc('day', event_ts)));
CREATE INDEX IF NOT EXISTS idx_events_event_ts ON events (event_ts);
CREATE INDEX IF NOT EXISTS idx_events_user ON events (site_id, user_id);
