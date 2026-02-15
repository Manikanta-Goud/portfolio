-- Portfolio Database Schema for Supabase
-- Run this SQL in your Supabase dashboard under "SQL Editor"

-- Table for tracking user interactions
CREATE TABLE user_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for contact form submissions
CREATE TABLE contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'unread'
);

-- Table for storing Clerk user profiles
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    image_url TEXT,
    last_sign_in_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for user preferences/settings
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for portfolio analytics/stats
CREATE TABLE portfolio_stats (
    id BIGSERIAL PRIMARY KEY,
    metric_name TEXT UNIQUE NOT NULL,
    metric_value INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial analytics metrics
INSERT INTO portfolio_stats (metric_name, metric_value) VALUES
('total_visitors', 0),
('total_users', 0),
('galaxy_visits', 0),
('crystal_clicks', 0);

-- Create indexes for better performance
CREATE INDEX idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX idx_user_interactions_action ON user_interactions(action);
CREATE INDEX idx_user_interactions_timestamp ON user_interactions(timestamp);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own interactions
CREATE POLICY "Users can view own interactions" ON user_interactions
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Contact submissions - only owner can view all
CREATE POLICY "Owner can view all contact submissions" ON contact_submissions
    FOR ALL USING (true); -- Adjust this based on your admin user

-- Users can view and update their own profile
CREATE POLICY "Users can manage own profile" ON user_profiles
    FOR ALL USING (auth.uid()::text = user_id);

-- Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
    FOR ALL USING (auth.uid()::text = user_id);

-- Portfolio stats - read only for all
CREATE POLICY "Anyone can read portfolio stats" ON portfolio_stats
    FOR SELECT USING (true);

-- Functions
-- Function to increment portfolio metrics safely
CREATE OR REPLACE FUNCTION increment_metric(metric TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE portfolio_stats 
    SET metric_value = metric_value + 1, updated_at = NOW()
    WHERE metric_name = metric;
    
    -- If no rows updated, insert new metric
    IF NOT FOUND THEN
        INSERT INTO portfolio_stats (metric_name, metric_value)
        VALUES (metric, 1);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update portfolio stats
CREATE OR REPLACE FUNCTION update_portfolio_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update galaxy visits count
    IF NEW.action = 'galaxy_visit' THEN
        UPDATE portfolio_stats 
        SET metric_value = metric_value + 1, updated_at = NOW()
        WHERE metric_name = 'galaxy_visits';
    END IF;
    
    -- Update crystal clicks count
    IF NEW.action = 'crystal_click' THEN
        UPDATE portfolio_stats 
        SET metric_value = metric_value + 1, updated_at = NOW()
        WHERE metric_name = 'crystal_clicks';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stats
CREATE TRIGGER trigger_update_portfolio_stats
    AFTER INSERT ON user_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_portfolio_stats();