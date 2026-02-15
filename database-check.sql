-- Complete Database Status Check - Run All At Once
-- Copy and paste this entire block into Supabase SQL Editor

DO $$
BEGIN
    -- Display header
    RAISE NOTICE '=== PORTFOLIO DATABASE STATUS REPORT ===';
    RAISE NOTICE '';
END $$;

-- 1. TABLE STRUCTURE CHECK
SELECT 
    'TABLE STRUCTURE' as check_type,
    table_name, 
    column_name, 
    data_type,
    CASE WHEN is_nullable = 'YES' THEN 'NULL' ELSE 'NOT NULL' END as nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('user_interactions', 'contact_submissions', 'user_profiles', 'user_preferences', 'portfolio_stats')
ORDER BY table_name, ordinal_position;

-- 2. PORTFOLIO ANALYTICS STATS
SELECT 
    'CURRENT STATS' as check_type,
    metric_name,
    metric_value,
    updated_at
FROM portfolio_stats
ORDER BY metric_name;

-- 3. USER INTERACTIONS SUMMARY
SELECT 
    'INTERACTION SUMMARY' as check_type,
    COALESCE(action, 'NO INTERACTIONS YET') as action,
    COUNT(*) as total_count,
    MAX(timestamp) as latest_interaction
FROM user_interactions 
GROUP BY action
UNION ALL
SELECT 
    'TOTAL INTERACTIONS',
    'ALL ACTIONS',
    COUNT(*),
    MAX(timestamp)
FROM user_interactions
ORDER BY total_count DESC;

-- 4. SECURITY POLICIES CHECK  
SELECT 
    'SECURITY POLICIES' as check_type,
    tablename,
    policyname,
    cmd as permissions,
    CASE WHEN qual IS NULL THEN 'No restrictions' ELSE 'Restricted' END as access_level
FROM pg_policies 
WHERE tablename IN ('user_interactions', 'contact_submissions', 'user_profiles', 'user_preferences', 'portfolio_stats')
ORDER BY tablename;

-- 5. DATABASE TRIGGERS
SELECT 
    'ACTIVE TRIGGERS' as check_type,
    trigger_name,
    event_object_table as table_name,
    event_manipulation as trigger_event
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
AND event_object_table = 'user_interactions';

-- 6. USER PROFILES (Login Data)
SELECT 
    'USER PROFILES' as check_type,
    user_id,
    email,
    CONCAT(first_name, ' ', last_name) as full_name,
    username,
    last_sign_in_at,
    created_at
FROM user_profiles 
ORDER BY last_sign_in_at DESC
LIMIT 10;

-- 7. RECENT ACTIVITY (Last 10 interactions)
SELECT 
    'RECENT ACTIVITY' as check_type,
    user_id,
    action,
    data,
    timestamp
FROM user_interactions 
ORDER BY timestamp DESC 
LIMIT 10;