-- ============================================================================
-- Sagitarius.cc - ULTIMATE MASTER SETUP (FIXED)
-- Combines: Core Schema + Bio Profiles + Software Manager + License Keys + Inbox
-- ============================================================================

-- Désactive temporairement le cache pour s'assurer que les changements sont pris en compte
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- 1. TABLES DE BASE (CELEBRITIES & LYCÉE)
-- ==========================================

-- Table: celebrities
CREATE TABLE IF NOT EXISTS public.celebrities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  email text,
  habitation text,
  telephone text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Table: lycee_classes
CREATE TABLE IF NOT EXISTS public.lycee_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index int DEFAULT 1
);

-- Table: lycee_entries
CREATE TABLE IF NOT EXISTS public.lycee_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.lycee_classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  info text,
  email text,
  habitation text,
  telephone text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- ==========================================
-- 2. SYSTÈME DE COMPTES & RÔLES
-- ==========================================

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now()
);

-- FIX: Assurer que les colonnes nécessaires existent dans profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hwid text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_hwid_reset timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hwid_reset_status text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_casino_spin timestamptz;

-- Mise à jour de la contrainte ROLE
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('member', 'admin', 'owner', 'vip', 'high_member'));

-- Table: inv_code (Invitations)
CREATE TABLE IF NOT EXISTS public.inv_code (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  max_uses int DEFAULT 1,
  current_uses int DEFAULT 0,
  expires_at timestamptz,
  created_by uuid REFERENCES auth.users(id)
);

-- FIX: Assurer que les colonnes nécessaires existent dans inv_code
ALTER TABLE public.inv_code ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id);

-- Création auto du profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, role)
  VALUES (new.id, split_part(new.email, '@', 1), new.email, 'member')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction de validation de code invitation
CREATE OR REPLACE FUNCTION public.validate_invite_code(p_code text)
RETURNS json AS $$
DECLARE v_valid boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM inv_code
    WHERE upper(trim(code)) = upper(trim(p_code))
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses = 0 OR current_uses < max_uses)
  ) INTO v_valid;
  RETURN json_build_object('valid', v_valid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. BIO PROFILES system
-- ==========================================

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

CREATE UNIQUE INDEX IF NOT EXISTS bio_profiles_username_idx ON public.bio_profiles(username);
CREATE INDEX IF NOT EXISTS bio_profiles_user_id_idx ON public.bio_profiles(user_id);

CREATE OR REPLACE FUNCTION update_bio_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bio_profiles_updated_at ON public.bio_profiles;
CREATE TRIGGER bio_profiles_updated_at
  BEFORE UPDATE ON public.bio_profiles
  FOR EACH ROW EXECUTE FUNCTION update_bio_updated_at();

CREATE OR REPLACE FUNCTION increment_bio_views(profile_username text)
RETURNS void AS $$
BEGIN
  UPDATE public.bio_profiles
  SET views = views + 1
  WHERE username = profile_username AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. NEW: SOFTWARE MANAGEMENT SYSTEM
-- ==========================================

-- Software Categories
CREATE TABLE IF NOT EXISTS public.software_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  status text DEFAULT 'undetected',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Ensure status column exists if table was already created
ALTER TABLE public.software_categories ADD COLUMN IF NOT EXISTS status text DEFAULT 'undetected';

-- Software Files
CREATE TABLE IF NOT EXISTS public.software_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.software_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  url text NOT NULL,
  size text,
  version text DEFAULT '1.0.0',
  is_loader boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Function to broadcast a message to all users
CREATE OR REPLACE FUNCTION public.broadcast_message(p_title text, p_content text, p_type text DEFAULT 'notification')
RETURNS void AS $$
BEGIN
  -- Verify requester is admin or owner
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO public.inbox_messages (user_id, title, content, type)
  SELECT id, p_title, p_content, p_type FROM public.profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send a message to a specific user by email
CREATE OR REPLACE FUNCTION public.send_direct_message(p_email text, p_title text, p_content text, p_type text DEFAULT 'notification')
RETURNS void AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Verify requester is admin or owner
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT id INTO v_user_id FROM public.profiles WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  INSERT INTO public.inbox_messages (user_id, title, content, type)
  VALUES (v_user_id, p_title, p_content, p_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Software Activation Keys
CREATE TABLE IF NOT EXISTS public.software_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.software_categories(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  max_uses int DEFAULT 1,
  current_uses int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Verification logic for keys (Updated for auto-detection and unlimited downloads)
CREATE OR REPLACE FUNCTION public.verify_software_key(p_key text)
RETURNS TABLE (loader_url text, category_name text, success boolean, message text) AS $$
DECLARE
  v_file_url text;
  v_key_id uuid;
  v_category_id uuid;
  v_category_name text;
BEGIN
  -- Search for key across all categories
  SELECT id, category_id INTO v_key_id, v_category_id
  FROM public.software_keys
  WHERE key = p_key AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'Invalid or disabled key'::text;
    RETURN;
  END IF;

  -- Get category info
  SELECT name INTO v_category_name FROM public.software_categories WHERE id = v_category_id;

  -- Get loader file
  SELECT url INTO v_file_url FROM public.software_files
  WHERE category_id = v_category_id AND is_loader = true LIMIT 1;

  IF v_file_url IS NULL THEN
    RETURN QUERY SELECT NULL::text, v_category_name, false, 'Error: No loader configured for this product'::text;
    RETURN;
  END IF;

  -- Increment uses but don't block if max_uses exceeded (per user request for unlimited)
  UPDATE public.software_keys SET current_uses = current_uses + 1 WHERE id = v_key_id;
  
  RETURN QUERY SELECT v_file_url, v_category_name, true, 'Success'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. NEW: INBOX SYSTEM
-- ==========================================

CREATE TABLE IF NOT EXISTS public.inbox_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('key', 'notification', 'welcome', 'support')) DEFAULT 'notification',
  title text NOT NULL,
  content text NOT NULL,
  is_revealed boolean DEFAULT false,
  reveal_content text,
  is_read boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- ==========================================
-- 6. SÉCURITÉ (RLS)
-- ==========================================

ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lycee_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

-- 6.0 Profiles Policies
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- 6.1 Celebrities Policies
DROP POLICY IF EXISTS "Anyone can view celebrities" ON public.celebrities;
CREATE POLICY "Anyone can view celebrities" ON public.celebrities FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can add celebrities" ON public.celebrities;
CREATE POLICY "Authenticated users can add celebrities" ON public.celebrities FOR INSERT TO authenticated WITH CHECK (true);

-- 6.2 Lycée Policies
DROP POLICY IF EXISTS "Anyone can view lycee classes" ON public.lycee_classes;
CREATE POLICY "Anyone can view lycee classes" ON public.lycee_classes FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Anyone can view lycee entries" ON public.lycee_entries;
CREATE POLICY "Anyone can view lycee entries" ON public.lycee_entries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Authenticated users can add lycee entries" ON public.lycee_entries;
CREATE POLICY "Authenticated users can add lycee entries" ON public.lycee_entries FOR INSERT TO authenticated WITH CHECK (true);

-- 6.4 Inbox Policies
DROP POLICY IF EXISTS "Users can view own messages" ON public.inbox_messages;
CREATE POLICY "Users can view own messages" ON public.inbox_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own messages" ON public.inbox_messages;
CREATE POLICY "Users can update own messages" ON public.inbox_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own messages" ON public.inbox_messages;
CREATE POLICY "Users can delete own messages" ON public.inbox_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Anyone can insert own messages" ON public.inbox_messages;
CREATE POLICY "Anyone can insert own messages" ON public.inbox_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
-- Allow admins/owners to delete any message
DROP POLICY IF EXISTS "Admins can delete any message" ON public.inbox_messages;
CREATE POLICY "Admins can delete any message" ON public.inbox_messages FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'owner'))
);

-- 6.5 Software System Policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.software_categories;
CREATE POLICY "Anyone can view categories" ON public.software_categories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view files" ON public.software_files;
CREATE POLICY "Anyone can view files" ON public.software_files FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view own keys" ON public.software_keys;
CREATE POLICY "Anyone can view own keys" ON public.software_keys FOR SELECT TO authenticated USING (true);

-- 6.6 Storage Policies (Avatar)
-- This ensures the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) VALUES ('avatar', 'avatar', true) ON CONFLICT (id) DO NOTHING;

-- Policy to allow anyone (public) to see the avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatar');

-- Policy to allow authenticated users to upload their own avatar
DROP POLICY IF EXISTS "Anyone can upload an avatar" ON storage.objects;
CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatar');

-- Policy to allow users to update/delete their own avatar
DROP POLICY IF EXISTS "Anyone can update their own avatar" ON storage.objects;
CREATE POLICY "Anyone can update their own avatar" ON storage.objects FOR UPDATE TO authenticated USING (auth.uid() = owner) WITH CHECK (bucket_id = 'avatar');

DROP POLICY IF EXISTS "Anyone can delete their own avatar" ON storage.objects;
CREATE POLICY "Anyone can delete their own avatar" ON storage.objects FOR DELETE TO authenticated USING (auth.uid() = owner);

-- (Autres politiques simplifiées pour brevity...)
DROP POLICY IF EXISTS "Public can read published bio profiles" ON public.bio_profiles;
CREATE POLICY "Public can read published bio profiles" ON public.bio_profiles FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Users can manage own bio" ON public.bio_profiles;
CREATE POLICY "Users can manage own bio" ON public.bio_profiles FOR ALL TO authenticated USING (auth.uid() = user_id);

-- ==========================================
-- 8. INITIALISATION
-- ==========================================

-- FIX: Définit le propriétaire de manière plus robuste (via auth.users)
DO $$
BEGIN
  -- D'abord, on s'assure que l'email est rempli dans profiles pour cet utilisateur
  UPDATE public.profiles p
  SET email = u.email, role = 'owner'
  FROM auth.users u
  WHERE p.id = u.id AND u.email = 'n0lex9999@gmail.com';
END $$;

-- Crée une classe par défaut
INSERT INTO public.lycee_classes (name, order_index) SELECT 'Général', 1
WHERE NOT EXISTS (SELECT 1 FROM public.lycee_classes LIMIT 1);

NOTIFY pgrst, 'reload schema';
