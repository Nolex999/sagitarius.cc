-- ============================================================================
-- Sagitarius.cc - ULTIMATE MASTER SETUP (FINAL - TRINITY INTEGRATED)
-- Combines: Core Schema + Bio Profiles + Software Manager + License Keys + Inbox + Casino
-- ============================================================================

NOTIFY pgrst, 'reload schema';

-- 1. TABLES DE BASE
-- ==========================================

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

CREATE TABLE IF NOT EXISTS public.lycee_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index int DEFAULT 1
);

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

-- 2. SYSTÈME DE COMPTES & RÔLES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  email text,
  avatar_url text,
  role text DEFAULT 'member',
  hwid text,
  last_hwid_reset timestamptz,
  hwid_reset_status text,
  last_casino_spin timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('member', 'admin', 'owner', 'vip', 'super_vip', 'high_member'));

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

-- 3. BIO PROFILES
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

-- 4. SOFTWARE MANAGEMENT (TRINITY ENABLED)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.software_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  status text DEFAULT 'undetected',
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

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

CREATE TABLE IF NOT EXISTS public.software_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.software_categories(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  max_uses int DEFAULT 1,
  current_uses int DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- 5. VERIFICATION & REDEMPTION LOGIC
-- ==========================================

CREATE OR REPLACE FUNCTION public.verify_software_key(p_key text)
RETURNS TABLE (loader_url text, category_name text, success boolean, message text) AS $$
DECLARE
  v_file_url text;
  v_key_id uuid;
  v_category_id uuid;
  v_category_name text;
  v_metadata jsonb;
BEGIN
  SELECT id, category_id, metadata INTO v_key_id, v_category_id, v_metadata
  FROM public.software_keys WHERE key = p_key AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'Invalid or disabled key'::text;
    RETURN;
  END IF;

  IF v_category_id IS NULL AND (v_metadata->>'is_casino')::boolean = true THEN
    RETURN QUERY SELECT NULL::text, 'SELECT_PRODUCT'::text, true, 'casino_key'::text;
    RETURN;
  END IF;

  SELECT name INTO v_category_name FROM public.software_categories WHERE id = v_category_id;
  SELECT url INTO v_file_url FROM public.software_files
  WHERE category_id = v_category_id AND is_loader = true LIMIT 1;

  IF v_file_url IS NULL THEN
    RETURN QUERY SELECT NULL::text, v_category_name, false, 'Error: No loader configured for this product'::text;
    RETURN;
  END IF;

  UPDATE public.software_keys SET current_uses = current_uses + 1 WHERE id = v_key_id;
  RETURN QUERY SELECT v_file_url, v_category_name, true, 'Success'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.redeem_casino_key(p_key text, p_category_id uuid)
RETURNS TABLE (loader_url text, category_name text, success boolean, message text) AS $$
DECLARE
  v_key_id uuid;
  v_file_url text;
  v_cat_name text;
BEGIN
  SELECT id INTO v_key_id FROM public.software_keys
  WHERE key = p_key AND category_id IS NULL AND (metadata->>'is_casino')::boolean = true AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'Invalid casino key'::text;
    RETURN;
  END IF;

  UPDATE public.software_keys SET category_id = p_category_id WHERE id = v_key_id;
  SELECT name INTO v_cat_name FROM public.software_categories WHERE id = p_category_id;
  SELECT url INTO v_file_url FROM public.software_files WHERE category_id = p_category_id AND is_loader = true LIMIT 1;

  IF v_file_url IS NULL THEN
    RETURN QUERY SELECT NULL::text, v_cat_name, false, 'No loader for selected product'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT v_file_url, v_cat_name, true, 'Success'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. INBOX SYSTEM
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

-- 7. CASINO SYSTEM
-- ==========================================

CREATE OR REPLACE FUNCTION public.spin_casino_wheel()
RETURNS json AS $$
DECLARE
  v_user_role text;
  v_last_spin timestamptz;
  v_rand float;
  v_reward_id text;
  v_reward_label text;
  v_key text;
BEGIN
  SELECT role, last_casino_spin INTO v_user_role, v_last_spin 
  FROM public.profiles WHERE id = auth.uid();

  IF v_user_role NOT IN ('vip', 'super_vip', 'admin', 'owner') THEN
    RAISE EXCEPTION 'Ce casino est réservé aux membres VIP uniquement';
  END IF;

  IF v_user_role != 'super_vip' AND v_last_spin IS NOT NULL AND now() - v_last_spin < interval '7 days' THEN
    RAISE EXCEPTION 'Tu dois attendre 1 semaine entre chaque spin';
  END IF;

  v_rand := random() * 100;
  IF v_rand <= 1 THEN v_reward_id := 'lifetime'; v_reward_label := 'LIFETIME ACCESS';
  ELSIF v_rand <= 6 THEN v_reward_id := '30day'; v_reward_label := '30-Day Premium';
  ELSIF v_rand <= 40 THEN v_reward_id := '7day'; v_reward_label := '7-Day Extension';
  ELSE v_reward_id := '1day'; v_reward_label := '1-Day Access'; END IF;

  v_key := 'SAGI-' || upper(substring(gen_random_uuid()::text, 1, 8));
  
  INSERT INTO public.software_keys (key, category_id, max_uses, created_by, metadata)
  VALUES (v_key, NULL, 1, auth.uid(), jsonb_build_object('reward_id', v_reward_id, 'reward_label', v_reward_label, 'is_casino', true));

  UPDATE public.profiles SET last_casino_spin = now() WHERE id = auth.uid();
  INSERT INTO public.inbox_messages (user_id, title, content, type, is_revealed, reveal_content)
  VALUES (auth.uid(), '🎰 CASINO JACKPOT!', 'Félicitations ! Tu as gagné un accès **' || v_reward_label || '** ! Ton code : ' || v_key, 'key', false, v_key);

  RETURN json_build_object('success', true, 'reward_id', v_reward_id, 'reward_label', v_reward_label, 'key', v_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. POLICIES (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inbox_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Select Profiles" ON public.profiles;
CREATE POLICY "Public Select Profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "User Update Own Profile" ON public.profiles;
CREATE POLICY "User Update Own Profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Public View Categories" ON public.software_categories;
CREATE POLICY "Public View Categories" ON public.software_categories FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Public View Files" ON public.software_files;
CREATE POLICY "Public View Files" ON public.software_files FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Public View Keys" ON public.software_keys;
CREATE POLICY "Public View Keys" ON public.software_keys FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "User View Own Messages" ON public.inbox_messages;
CREATE POLICY "User View Own Messages" ON public.inbox_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 9. INITIALIZATION & SEEDING (TRINITY)
-- ==========================================

-- Insert Default Categories
INSERT INTO public.software_categories (name, status)
SELECT 'Trinity CS2 External', 'undetected'
WHERE NOT EXISTS (SELECT 1 FROM public.software_categories WHERE name = 'Trinity CS2 External');

INSERT INTO public.software_categories (name, status)
SELECT 'Trinity FACEIT', 'testing'
WHERE NOT EXISTS (SELECT 1 FROM public.software_categories WHERE name = 'Trinity FACEIT');

-- Link Dynamic Loader Entry
-- This ensures the download logic triggers our server-side patcher API
INSERT INTO public.software_files (category_id, name, url, is_loader)
SELECT id, 'Trinity Loader [Dynamic]', 'DYNAMIC_PATCHER', true
FROM public.software_categories
WHERE NOT EXISTS (
    SELECT 1 FROM public.software_files 
    WHERE category_id = software_categories.id AND is_loader = true
);

-- Fix Owner Permissions
UPDATE public.profiles SET role = 'owner' WHERE email IN ('n0lex9999@gmail.com', 'chris@sagitarius.cc');

NOTIFY pgrst, 'reload schema';