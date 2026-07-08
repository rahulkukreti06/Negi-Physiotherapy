-- ============================================
-- Supabase Schema for Negi Physiotherapy Blog
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Blog Posts Table
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Patient Tips',
  author VARCHAR(200) DEFAULT 'Dr. Mangesh Negi',
  excerpt TEXT,
  content TEXT,
  thumb TEXT, -- Base64 encoded image
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_updated_at ON blog_posts(updated_at DESC);

-- ============================================
-- Disable RLS (app-level authentication handles security)
-- ============================================
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Function to automatically update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
