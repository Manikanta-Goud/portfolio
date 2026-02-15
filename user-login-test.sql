-- Test User Login Data Storage
-- Run this after signing in to see if user data is saved

-- 1. Check all registered users from Clerk
SELECT 
    'REGISTERED USERS' as info,
    user_id,
    email,
    CONCAT(first_name, ' ', last_name) as full_name,
    username,
    last_sign_in_at,
    created_at
FROM user_profiles 
ORDER BY last_sign_in_at DESC;

-- 2. Check total user count
SELECT 
    'TOTAL USERS' as info,
    metric_value as total_registered_users
FROM portfolio_stats 
WHERE metric_name = 'total_users';

-- 3. Check user activity by profile
SELECT 
    'USER ACTIVITY' as info,
    up.email,
    up.first_name,
    COUNT(ui.id) as total_interactions,
    MAX(ui.timestamp) as last_activity
FROM user_profiles up
LEFT JOIN user_interactions ui ON up.user_id = ui.user_id
GROUP BY up.user_id, up.email, up.first_name
ORDER BY total_interactions DESC;