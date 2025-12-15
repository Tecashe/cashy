-- This script will create all the necessary tables for the Instagram automation platform
-- Run this after setting up your Neon database connection

-- Note: Prisma will handle schema creation, but this is here for reference
-- You can use this if you need to manually set up the database

-- Users table is managed by Clerk, so we sync with their clerkId

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- All tables will be created by Prisma Migrate
-- Run: npx prisma migrate dev --name init

-- After tables are created, you can seed with sample data using the next script
