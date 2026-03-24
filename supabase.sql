-- ============================================================================
-- SAGITARIUS.cc - SAFE ULTIMATE MASTER SETUP (V2)
-- Combines: Core Schema + Software Manager + Casino + Sagitarius Integration
-- ============================================================================

NOTIFY pgrst, 'reload schema';

-- 1. BASE TABLES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  email text,
  role text DEFAULT 'member' CHECK (role IN ('member', 'admin', 'owner', 'vip', 'super_vip', 'high_member')),
  avatar_url text,
  hwid text,
  last_hwid_reset timestamptz,
  hwid_reset_status text,
  last_casino_spin timestamptz,
  created_at timestamptz DEFAULT now()
);

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
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  metadata jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz
);

-- Migration check for existing tables
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'software_keys' AND column_name = 'expires_at') THEN
    ALTER TABLE public.software_keys ADD COLUMN expires_at timestamptz;
  END IF;
END $$;

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

-- 2. SMART CLEANUP & CONSTRAINTS (PRESERVE DATA WITH LOGOS)
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  -- 2.1 Remove duplicates but KEEP the ones with logos/images
  WITH duplicates AS (
    SELECT id, 
           ROW_NUMBER() OVER(PARTITION BY LOWER(name) ORDER BY logo_url NULLS LAST, created_at DESC) as rn
    FROM public.software_categories
  )
  DELETE FROM public.software_categories 
  WHERE id IN (SELECT id FROM duplicates WHERE rn > 1);

  -- 2.2 Add Unique Index to prevent future duplicates (Case-Insensitive)
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'unique_category_name_lower') THEN
    CREATE UNIQUE INDEX unique_category_name_lower ON public.software_categories (LOWER(name));
  END IF;

  -- 2.3 Ensure only ONE loader per category
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'unique_loader_per_category') THEN
    CREATE UNIQUE INDEX unique_loader_per_category ON public.software_files (category_id) WHERE is_loader = true;
  END IF;
END $$;

-- 3. CORE LOGIC (FUNCTIONS)
-- ----------------------------------------------------------------------------

-- Clean up old versions to avoid overloading ambiguity
DROP FUNCTION IF EXISTS public.verify_software_key(text);
DROP FUNCTION IF EXISTS public.verify_software_key(text, text);
DROP FUNCTION IF EXISTS public.redeem_casino_key(text, uuid);

-- Verification logic for keys (Unlimited support + Casino support + Expiration + First-Use Timer)
CREATE OR REPLACE FUNCTION public.verify_software_key(p_key text, p_hwid text DEFAULT NULL)
RETURNS TABLE (loader_url text, category_name text, success boolean, message text) AS $$
DECLARE
  v_file_url text;
  v_key_id uuid;
  v_category_id uuid;
  v_category_name text;
  v_metadata jsonb;
  v_expires_at timestamptz;
  v_hwid text;
  v_duration text;
BEGIN
  SELECT id, category_id, metadata, expires_at, (metadata->>'hwid')::text, (metadata->>'duration')::text
  INTO v_key_id, v_category_id, v_metadata, v_expires_at, v_hwid, v_duration
  FROM public.software_keys WHERE key = p_key AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'Invalid or disabled key'::text;
    RETURN;
  END IF;

  -- 1. START TIMER ON FIRST USE if duration exists but expires_at is null
  IF v_expires_at IS NULL AND v_duration IS NOT NULL THEN
    v_expires_at := now() + v_duration::interval;
    UPDATE public.software_keys SET expires_at = v_expires_at WHERE id = v_key_id;
  END IF;

  -- 2. Check Expiration
  IF v_expires_at IS NOT NULL AND v_expires_at < now() THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'expired'::text;
    RETURN;
  END IF;

  -- 3. HWID Lock Integration
  IF v_hwid IS NOT NULL AND p_hwid IS NOT NULL AND v_hwid != p_hwid THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'HWID mismatch'::text;
    RETURN;
  END IF;

  -- 4. Auto-lock HWID on first use
  IF v_hwid IS NULL AND p_hwid IS NOT NULL THEN
    UPDATE public.software_keys SET metadata = metadata || jsonb_build_object('hwid', p_hwid) WHERE id = v_key_id;
  END IF;

  -- 5. Handle Casino Redirection (Select Product mode)
  IF v_category_id IS NULL AND (v_metadata->>'is_casino')::boolean = true THEN
    RETURN QUERY SELECT NULL::text, 'SELECT_PRODUCT'::text, true, 'casino_key'::text;
    RETURN;
  END IF;

  SELECT name INTO v_category_name FROM public.software_categories WHERE id = v_category_id;
  SELECT url INTO v_file_url FROM public.software_files WHERE category_id = v_category_id AND is_loader = true LIMIT 1;

  IF v_file_url IS NULL THEN
    RETURN QUERY SELECT NULL::text, v_category_name, false, 'No loader configured'::text;
    RETURN;
  END IF;

  UPDATE public.software_keys SET current_uses = current_uses + 1 WHERE id = v_key_id;
  RETURN QUERY SELECT v_file_url, v_category_name, true, 'Success'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Casino Redeem Function
CREATE OR REPLACE FUNCTION public.redeem_casino_key(p_key text, p_category_id uuid)
RETURNS TABLE (loader_url text, category_name text, success boolean, message text) AS $$
DECLARE
  v_key_id uuid;
  v_file_url text;
  v_cat_name text;
  v_reward_id text;
  v_duration text;
BEGIN
  SELECT id, metadata->>'reward_id' INTO v_key_id, v_reward_id FROM public.software_keys
  WHERE key = p_key AND category_id IS NULL AND (metadata->>'is_casino')::boolean = true AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, false, 'Invalid casino key'::text;
    RETURN;
  END IF;

  v_duration := CASE 
    WHEN v_reward_id = '1day'  THEN '1 day'
    WHEN v_reward_id = '7day'  THEN '7 days'
    WHEN v_reward_id = '30day' THEN '30 days'
    ELSE NULL -- Lifetime
  END;

  UPDATE public.software_keys 
  SET category_id = p_category_id, 
      metadata = metadata || jsonb_build_object('duration', v_duration)
  WHERE id = v_key_id;

  SELECT name INTO v_cat_name FROM public.software_categories WHERE id = p_category_id;
  SELECT url INTO v_file_url FROM public.software_files WHERE category_id = p_category_id AND is_loader = true LIMIT 1;

  IF v_file_url IS NULL THEN
    RETURN QUERY SELECT NULL::text, v_cat_name, false, 'No loader found for this category'::text;
    RETURN;
  END IF;

  RETURN QUERY SELECT v_file_url, v_cat_name, true, 'Success'::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Casino Spin Function
CREATE OR REPLACE FUNCTION public.spin_casino_wheel()
RETURNS json AS $$
DECLARE
  v_user_role text; v_last_spin timestamptz; v_rand float; v_reward_id text; v_reward_label text; v_key text;
BEGIN
  SELECT role, last_casino_spin INTO v_user_role, v_last_spin FROM public.profiles WHERE id = auth.uid();
  IF v_user_role NOT IN ('vip', 'super_vip', 'admin', 'owner') THEN
    RAISE EXCEPTION 'Ce casino est réservé aux membres VIP uniquement';
  END IF;

  IF v_user_role != 'super_vip' AND v_last_spin IS NOT NULL AND now() - v_last_spin < interval '7 days' THEN
    RAISE EXCEPTION 'Tu dois attendre 1 semaine entre chaque spin';
  END IF;

  v_rand := random() * 100;
  IF v_rand <= 1 THEN v_reward_id := 'lifetime'; v_reward_label := 'LIFETIME ACCESS';
  ELSIF v_rand <= 3 THEN v_reward_id := '90day'; v_reward_label := '90-Day Quarterly';
  ELSIF v_rand <= 13 THEN v_reward_id := '30day'; v_reward_label := '30-Day Monthly';
  ELSIF v_rand <= 45 THEN v_reward_id := '7day'; v_reward_label := '7-Day Extension';
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

-- Function to reset HWID (Once every 7 days)
CREATE OR REPLACE FUNCTION public.reset_hwid(p_key text)
RETURNS json AS $$
DECLARE
  v_key_id uuid;
  v_last_reset timestamptz;
BEGIN
  SELECT id, (metadata->>'last_hwid_reset')::timestamptz INTO v_key_id, v_last_reset 
  FROM public.software_keys WHERE key = p_key AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid key');
  END IF;

  IF v_last_reset IS NOT NULL AND now() - v_last_reset < interval '7 days' THEN
    RETURN json_build_object('success', false, 'message', 'You can only reset HWID once every 7 days');
  END IF;

  UPDATE public.software_keys 
  SET metadata = metadata - 'hwid' || jsonb_build_object('last_hwid_reset', now())
  WHERE id = v_key_id;

  RETURN json_build_object('success', true, 'message', 'HWID reset successful');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. VERSION MANAGEMENT & UPDATES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.loader_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  download_url text NOT NULL,
  checksum text, -- SHA256/MD5 for integrity
  is_mandatory boolean DEFAULT false,
  release_notes text,
  created_at timestamptz DEFAULT now()
);

-- Function to get the latest loader info
CREATE OR REPLACE FUNCTION public.get_latest_loader()
RETURNS TABLE (version text, download_url text, is_mandatory boolean) AS $$
BEGIN
  RETURN QUERY 
  SELECT lv.version, lv.download_url, lv.is_mandatory 
  FROM public.loader_versions lv 
  ORDER BY lv.created_at DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. SAGITARIUS INITIALIZATION & SEEDING
-- ----------------------------------------------------------------------------

-- 5. SAGITARIUS INITIALIZATION & SEEDING & MIGRATION
-- ----------------------------------------------------------------------------

DO $$
DECLARE
    v_cs2_id uuid;
    v_faceit_id uuid;
BEGIN
    -- 5.1 Ensure target categories exist and get IDs
    INSERT INTO public.software_categories (name, status, logo_url)
    VALUES ('CS2 External', 'undetected', '/assets/cs2.webp')
    ON CONFLICT (LOWER(name)) DO UPDATE SET logo_url = EXCLUDED.logo_url
    RETURNING id INTO v_cs2_id;

    INSERT INTO public.software_categories (name, status, logo_url)
    VALUES ('Rainbow Six Siege', 'undetected', '/assets/r6.png')
    ON CONFLICT (LOWER(name)) DO UPDATE SET logo_url = EXCLUDED.logo_url
    RETURNING id INTO v_faceit_id;

    -- 5.2 Move FILES from old branding variants to new consolidated ones
    UPDATE public.software_files SET category_id = v_cs2_id 
    WHERE category_id IN (SELECT id FROM public.software_categories WHERE name IN ('Sagitarius CS2 External', 'Trinity CS2 External') AND id != v_cs2_id);

    UPDATE public.software_files SET category_id = v_faceit_id 
    WHERE category_id IN (SELECT id FROM public.software_categories WHERE name IN ('Sagitarius Rainbow Six Siege', 'Sagitarius FACEIT', 'Trinity FACEIT') AND id != v_faceit_id);

    -- 5.3 Move KEYS from old branding variants
    UPDATE public.software_keys SET category_id = v_cs2_id 
    WHERE category_id IN (SELECT id FROM public.software_categories WHERE name IN ('Sagitarius CS2 External', 'Trinity CS2 External') AND id != v_cs2_id);

    UPDATE public.software_keys SET category_id = v_faceit_id 
    WHERE category_id IN (SELECT id FROM public.software_categories WHERE name IN ('Sagitarius Rainbow Six Siege', 'Sagitarius FACEIT', 'Trinity FACEIT') AND id != v_faceit_id);

    -- 5.4 Safe Cleanup of old obsolete categories
    DELETE FROM public.software_categories 
    WHERE name IN ('Sagitarius CS2 External', 'Trinity CS2 External', 'Sagitarius FACEIT', 'Trinity FACEIT', 'FACEIT')
    AND id NOT IN (v_cs2_id, v_faceit_id);
END $$;

-- Seed initial version if empty (Secured placeholder)
INSERT INTO public.loader_versions (version, download_url, is_mandatory)
VALUES ('1.5.1', '/api/loader/generate', true)
ON CONFLICT (version) DO UPDATE SET download_url = EXCLUDED.download_url;

-- Link Dynamic Loader Entry for PATCHER
INSERT INTO public.software_files (category_id, name, url, is_loader)
SELECT id, 'Sagitarius Loader [Dynamic]', 'DYNAMIC_PATCHER', true
FROM public.software_categories
WHERE name IN ('CS2 External', 'Legit Mode', 'Rainbow Six Siege')
ON CONFLICT DO NOTHING;

-- Fix Owner Permissions
UPDATE public.profiles SET role = 'owner' WHERE email IN ('n0lex9999@gmail.com');

NOTIFY pgrst, 'reload schema';
