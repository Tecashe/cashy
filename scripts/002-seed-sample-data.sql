-- Sample data for development and testing
-- This creates mock conversations, automations, and content

-- Note: Replace 'your-user-id' with actual user ID from your database after first login

-- Sample Tags
-- INSERT INTO "Tag" (id, "userId", name, color, "createdAt")
-- VALUES 
--   (gen_random_uuid(), 'your-user-id', 'VIP', '#8B5CF6', NOW()),
--   (gen_random_uuid(), 'your-user-id', 'Lead', '#EC4899', NOW()),
--   (gen_random_uuid(), 'your-user-id', 'Customer', '#10B981', NOW()),
--   (gen_random_uuid(), 'your-user-id', 'Follow-up', '#F59E0B', NOW());

-- Sample Instagram Account
-- INSERT INTO "InstagramAccount" (id, "userId", "instagramId", username, "profilePicUrl", "followerCount", "accessToken", "isConnected", "createdAt", "updatedAt")
-- VALUES (gen_random_uuid(), 'your-user-id', '1234567890', 'your_instagram', 'https://via.placeholder.com/150', 5420, 'sample-token', true, NOW(), NOW());

-- These will be populated by the application as you use it
-- The app includes simulated data for demo purposes
