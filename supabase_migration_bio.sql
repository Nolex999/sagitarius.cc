-- SAGITARR - Bio Profiles Table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.bio_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  config jsonb NOT NULL DEFAULT '{}',
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast username lookup (public pages)
CREATE UNIQUE INDEX IF NOT EXISTS bio_profiles_username_idx ON public.bio_profiles(username);
CREATE INDEX IF NOT EXISTS bio_profiles_user_id_idx ON public.bio_profiles(user_id);

-- RLS
ALTER TABLE public.bio_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can READ published profiles (public bio pages)
CREATE POLICY "Public can read published bio profiles"
  ON public.bio_profiles FOR SELECT
  USING (is_published = true);

-- Authenticated users can read their own profiles
CREATE POLICY "Users can read own bio profiles"
  ON public.bio_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert own bio profile"
  ON public.bio_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own profile
CREATE POLICY "Users can update own bio profile"
  ON public.bio_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Authenticated users can delete their own profile
CREATE POLICY "Users can delete own bio profile"
  ON public.bio_profiles FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_bio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bio_profiles_updated_at
  BEFORE UPDATE ON public.bio_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_bio_updated_at();

-- Function to increment view count (callable from public)
CREATE OR REPLACE FUNCTION increment_bio_views(profile_username text)
RETURNS void AS $$
BEGIN
  UPDATE public.bio_profiles
  SET views = views + 1
  WHERE username = profile_username AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
