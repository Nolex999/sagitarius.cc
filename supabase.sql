-- ==========================================
-- 1. NETTOYAGE ET PRÉPARATION
-- ==========================================

-- Désactive temporairement le cache pour s'assurer que les changements sont pris en compte
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- 2. TABLES DE BASE (DB & LYCÉE)
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

-- Assurer que les colonnes existent (si la table existait déjà)
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS habitation text;
ALTER TABLE public.celebrities ADD COLUMN IF NOT EXISTS telephone text;

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

-- Assurer que les colonnes existent (si la table existait déjà)
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS habitation text;
ALTER TABLE public.lycee_entries ADD COLUMN IF NOT EXISTS telephone text;

-- ==========================================
-- 3. SYSTÈME DE COMPTES & INVITATIONS
-- ==========================================

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner')),
  created_at timestamptz DEFAULT now()
);

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

-- ==========================================
-- 4. LOGIQUE AUTOMATIQUE (TRIGGERS & FONCTIONS)
-- ==========================================

-- Création auto du profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, split_part(new.email, '@', 1), 'member')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction de validation de code
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
-- 5. SÉCURITÉ & AFFICHAGE (RLS)
-- ==========================================

ALTER TABLE public.celebrities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lycee_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture/écriture globales (pour tous les connectés)
DROP POLICY IF EXISTS "Global Read Celebrities" ON public.celebrities;
CREATE POLICY "Global Read Celebrities" ON public.celebrities FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Global Insert Celebrities" ON public.celebrities;
CREATE POLICY "Global Insert Celebrities" ON public.celebrities FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Global Read Lycee" ON public.lycee_entries;
CREATE POLICY "Global Read Lycee" ON public.lycee_entries FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Global Insert Lycee" ON public.lycee_entries;
CREATE POLICY "Global Insert Lycee" ON public.lycee_entries FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- 6. DROITS D'ADMIN & DONNÉES DE BASE
-- ==========================================

-- Définit le propriétaire via l'email
DO $$
BEGIN
  UPDATE public.profiles 
  SET role = 'owner'
  WHERE id IN (SELECT id FROM auth.users WHERE email = 'n0lex9999@gmail.com');
END $$;

-- Crée une classe par défaut si vide
INSERT INTO public.lycee_classes (name, order_index)
SELECT 'Général', 1
WHERE NOT EXISTS (SELECT 1 FROM public.lycee_classes LIMIT 1);

-- ==========================================
-- 7. COMMANDE FINALE : RAFRAÎCHISSEMENT DU CACHE
-- ==========================================

-- TRÈS IMPORTANT : Dit à Supabase de recharger la liste des colonnes
NOTIFY pgrst, 'reload schema';

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
