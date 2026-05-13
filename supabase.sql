-- ============================================================================
-- SAGITARIUS.cc - SAFE ULTIMATE MASTER SETUP (V3)
-- Combines: Core Schema + Software Manager + Casino + Sagitarius Integration
--           + Auto-Update + Violation Reporting
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
  IF v_expires_at IS NULL AND v_duration IS NOT NULL AND v_duration != '' THEN
    BEGIN
      v_expires_at := now() + v_duration::interval;
      UPDATE public.software_keys SET expires_at = v_expires_at WHERE id = v_key_id;
    EXCEPTION WHEN OTHERS THEN
      v_expires_at := NULL;
    END;
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
-- Resets HWID on BOTH the profile AND all software_keys for this user
CREATE OR REPLACE FUNCTION public.reset_hwid(p_key text)
RETURNS json AS $$
DECLARE
  v_key_id uuid;
  v_last_reset timestamptz;
  v_created_by uuid;
BEGIN
  SELECT id, (metadata->>'last_hwid_reset')::timestamptz, created_by
  INTO v_key_id, v_last_reset, v_created_by
  FROM public.software_keys WHERE key = p_key AND is_active = true;

  IF v_key_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid key');
  END IF;

  IF v_last_reset IS NOT NULL AND now() - v_last_reset < interval '7 days' THEN
    RETURN json_build_object('success', false, 'message', 'You can only reset HWID once every 7 days');
  END IF;

  -- Reset HWID on the key
  UPDATE public.software_keys 
  SET metadata = metadata - 'hwid' || jsonb_build_object('last_hwid_reset', now())
  WHERE id = v_key_id;

  -- Also reset HWID on the profile if created_by exists
  IF v_created_by IS NOT NULL THEN
    UPDATE public.profiles 
    SET hwid = NULL, last_hwid_reset = now(), hwid_reset_status = NULL
    WHERE id = v_created_by;
  END IF;

  RETURN json_build_object('success', true, 'message', 'HWID reset successful');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset HWID for ALL keys of a user (called by AdminPanel)
CREATE OR REPLACE FUNCTION public.reset_user_hwid(p_user_id uuid)
RETURNS json AS $$
BEGIN
  -- Reset HWID on all software_keys created by this user
  UPDATE public.software_keys 
  SET metadata = metadata - 'hwid' || jsonb_build_object('last_hwid_reset', now())
  WHERE created_by = p_user_id AND (metadata->>'hwid') IS NOT NULL;

  -- Reset HWID on the profile
  UPDATE public.profiles 
  SET hwid = NULL, hwid_reset_status = NULL, last_hwid_reset = now()
  WHERE id = p_user_id;

  RETURN json_build_object('success', true, 'message', 'All HWIDs reset for user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get key expiry info for the loader UI (days remaining display)
-- FIX: Calculates time_left from duration metadata even if expires_at is NULL
DROP FUNCTION IF EXISTS public.get_key_expiry(text);
CREATE OR REPLACE FUNCTION public.get_key_expiry(p_key text)
RETURNS TABLE (expires_at timestamptz, time_left text, category_name text, username text) AS $$
DECLARE
  v_expires_at timestamptz;
  v_category_id uuid;
  v_cat_name text;
  v_minutes int;
  v_created_by uuid;
  v_username text;
  v_duration text;
  v_created_at timestamptz;
BEGIN
  SELECT sk.expires_at, sk.category_id, sk.created_by, sk.created_at, (sk.metadata->>'duration')::text
  INTO v_expires_at, v_category_id, v_created_by, v_created_at, v_duration
  FROM public.software_keys sk
  WHERE sk.key = p_key AND sk.is_active = true;

  -- Get username from profiles via created_by
  IF v_created_by IS NOT NULL THEN
    SELECT p.username INTO v_username FROM public.profiles p WHERE p.id = v_created_by;
  END IF;

  IF v_category_id IS NOT NULL THEN
    SELECT sc.name INTO v_cat_name FROM public.software_categories sc WHERE sc.id = v_category_id;
  END IF;

  -- FIX: If expires_at is NULL but duration exists, calculate it from created_at
  IF v_expires_at IS NULL AND v_duration IS NOT NULL AND v_duration != '' AND v_created_at IS NOT NULL THEN
    BEGIN
      v_expires_at := v_created_at + v_duration::interval;
      -- Update the DB so next time it's already set
      UPDATE public.software_keys SET expires_at = v_expires_at WHERE key = p_key;
    EXCEPTION WHEN OTHERS THEN
      -- If duration format is invalid, keep it NULL (LIFETIME)
      v_expires_at := NULL;
    END;
  END IF;

  IF v_expires_at IS NULL THEN
    RETURN QUERY SELECT NULL::timestamptz, 'LIFETIME'::text, COALESCE(v_cat_name, 'Software')::text, COALESCE(v_username, 'User')::text;
  ELSE
    v_minutes := GREATEST(0, EXTRACT(EPOCH FROM (v_expires_at - now())) / 60)::int;
    IF v_minutes <= 0 THEN
      RETURN QUERY SELECT v_expires_at, 'EXPIRED'::text, COALESCE(v_cat_name, 'Software')::text, COALESCE(v_username, 'User')::text;
    ELSIF v_minutes < 60 THEN
      RETURN QUERY SELECT v_expires_at, v_minutes || 'm left', COALESCE(v_cat_name, 'Software')::text, COALESCE(v_username, 'User')::text;
    ELSIF v_minutes < 1440 THEN
      RETURN QUERY SELECT v_expires_at, (v_minutes / 60) || 'h left', COALESCE(v_cat_name, 'Software')::text, COALESCE(v_username, 'User')::text;
    ELSE
      RETURN QUERY SELECT v_expires_at, (v_minutes / 1440) || 'd left', COALESCE(v_cat_name, 'Software')::text, COALESCE(v_username, 'User')::text;
    END IF;
  END IF;
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

-- ── AUTO-UPDATE CHECK (called by loader at login) ─────────────────────────
CREATE OR REPLACE FUNCTION public.check_loader_update(p_version text)
RETURNS json AS $$
DECLARE
  v_latest record;
BEGIN
  SELECT version, download_url, is_mandatory, release_notes
  INTO v_latest
  FROM public.loader_versions 
  ORDER BY created_at DESC LIMIT 1;

  IF v_latest IS NULL THEN
    RETURN json_build_object('update_available', false);
  END IF;

  -- Compare versions (simple string comparison works for semver like 1.0.0 < 1.0.1)
  IF p_version < v_latest.version THEN
    RETURN json_build_object(
      'update_available', true,
      'latest_version', v_latest.version,
      'download_url', v_latest.download_url,
      'is_mandatory', v_latest.is_mandatory,
      'release_notes', COALESCE(v_latest.release_notes, '')
    );
  ELSE
    RETURN json_build_object('update_available', false);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── VIOLATION REPORT (anti-debug / anti-tamper bans) ───────────────────────
CREATE TABLE IF NOT EXISTS public.violation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text,
  hwid text,
  reason text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.report_violation(p_key text, p_hwid text, p_reason text)
RETURNS json AS $$
BEGIN
  -- Log the violation
  INSERT INTO public.violation_logs (key, hwid, reason)
  VALUES (p_key, p_hwid, p_reason);

  -- Auto-ban: deactivate the key
  IF p_key != 'unknown' AND p_key != '' THEN
    UPDATE public.software_keys SET is_active = false WHERE key = p_key;
  END IF;

  -- Also ban the HWID on all keys
  IF p_hwid != '' AND p_hwid != 'debugger_detected' AND p_hwid != 'protection_failed' THEN
    UPDATE public.software_keys 
    SET is_active = false 
    WHERE (metadata->>'hwid') = p_hwid;
  END IF;

  RETURN json_build_object('success', true, 'message', 'Violation logged and key banned');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- FIX: Auto-calculate expires_at for existing keys that have a duration but NULL expires_at
UPDATE public.software_keys 
SET expires_at = created_at + (metadata->>'duration')::interval
WHERE expires_at IS NULL 
  AND metadata->>'duration' IS NOT NULL 
  AND metadata->>'duration' != '';

-- ── RLS for software_categories (Loader reads status from here) ─────────────
ALTER TABLE public.software_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read software status" ON public.software_categories;

-- Anyone can read software status (loader needs this to show UNDETECTED/UPDATING/DETECTED)
CREATE POLICY "Public can read software status" ON public.software_categories
  FOR SELECT USING (true);

-- Only admins can manage categories
DROP POLICY IF EXISTS "Admins can manage software categories" ON public.software_categories;
CREATE POLICY "Admins can manage software categories" ON public.software_categories
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
  );

-- ── RLS for violation_logs ────────────────────────────────────────────────
ALTER TABLE public.violation_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert violations" ON public.violation_logs;
DROP POLICY IF EXISTS "Admins can view violations" ON public.violation_logs;

-- Anyone can report violations (loader calls this unauthenticated)
CREATE POLICY "Anyone can insert violations" ON public.violation_logs
  FOR INSERT WITH CHECK (true);

-- Only admins can view violations
CREATE POLICY "Admins can view violations" ON public.violation_logs
  FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
  );

-- ── RLS for loader_versions ───────────────────────────────────────────────
ALTER TABLE public.loader_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read loader versions" ON public.loader_versions;
DROP POLICY IF EXISTS "Admins can manage loader versions" ON public.loader_versions;

-- Anyone can read versions (loader checks for updates)
CREATE POLICY "Anyone can read loader versions" ON public.loader_versions
  FOR SELECT USING (true);

-- Only admins can manage versions
CREATE POLICY "Admins can manage loader versions" ON public.loader_versions
  FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner')
  );

-- ============================================================================
-- RESELLER SYSTEM
-- ============================================================================

-- Add reseller to role options
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
    AND column_default LIKE '%reseller%'
  ) THEN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('member', 'admin', 'owner', 'vip', 'super_vip', 'high_member', 'reseller'));
  END IF;
END $$;

-- Whitelist for reseller emails
CREATE TABLE IF NOT EXISTS public.reseller_whitelist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  added_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Reseller applications (users requesting to become resellers)
CREATE TABLE IF NOT EXISTS public.reseller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  discord text,
  telegram text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  created_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz
);

-- Add reseller role to existing data if needed
UPDATE public.profiles SET role = 'reseller' WHERE email IN (
  SELECT email FROM public.reseller_whitelist
);

-- Function to apply for reseller
CREATE OR REPLACE FUNCTION public.apply_for_reseller(p_discord text, p_telegram text)
RETURNS json AS $$
DECLARE
  v_user_id uuid;
  v_existing_app record;
BEGIN
  v_user_id := auth.uid();
  
  -- Check if already a reseller
  IF (SELECT role FROM public.profiles WHERE id = v_user_id) = 'reseller' THEN
    RETURN json_build_object('success', false, 'message', 'You are already a reseller');
  END IF;

  -- Check if already applied
  SELECT * INTO v_existing_app FROM public.reseller_applications 
  WHERE user_id = v_user_id AND status = 'pending';
  
  IF v_existing_app IS NOT NULL THEN
    RETURN json_build_object('success', false, 'message', 'You already have a pending application');
  END IF;

  INSERT INTO public.reseller_applications (user_id, discord, telegram)
  VALUES (v_user_id, p_discord, p_telegram);

  RETURN json_build_object('success', true, 'message', 'Application submitted successfully');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for admin to approve/reject reseller application
CREATE OR REPLACE FUNCTION public.review_reseller_application(p_application_id uuid, p_approved boolean, p_notes text DEFAULT NULL)
RETURNS json AS $$
DECLARE
  v_app record;
  v_user_id uuid;
BEGIN
  SELECT * INTO v_app FROM public.reseller_applications WHERE id = p_application_id;
  
  IF v_app IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Application not found');
  END IF;

  IF p_approved THEN
    UPDATE public.profiles SET role = 'reseller' WHERE id = v_app.user_id;
  END IF;

  UPDATE public.reseller_applications 
  SET status = CASE WHEN p_approved THEN 'approved' ELSE 'rejected' END,
      notes = p_notes,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE id = p_application_id;

  RETURN json_build_object('success', true, 'message', p_approved THEN 'Application approved' ELSE 'Application rejected' END);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add email to whitelist (admin only)
CREATE OR REPLACE FUNCTION public.add_reseller_whitelist(p_email text)
RETURNS json AS $$
BEGIN
  INSERT INTO public.reseller_whitelist (email, added_by)
  VALUES (lower(p_email), auth.uid())
  ON CONFLICT (email) DO UPDATE SET added_by = auth.uid();
  
  -- Update user role if exists
  UPDATE public.profiles SET role = 'reseller' WHERE LOWER(email) = lower(p_email);

  RETURN json_build_object('success', true, 'message', 'Email added to whitelist');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS for reseller_whitelist
ALTER TABLE public.reseller_whitelist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage whitelist" ON public.reseller_whitelist;
CREATE POLICY "Admins can manage whitelist" ON public.reseller_whitelist
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner'));

-- RLS for reseller_applications
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their applications" ON public.reseller_applications;
CREATE POLICY "Users can view their applications" ON public.reseller_applications
  FOR SELECT USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Users can create applications" ON public.reseller_applications;
CREATE POLICY "Users can create applications" ON public.reseller_applications
  FOR INSERT WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "Admins can review applications" ON public.reseller_applications;
CREATE POLICY "Admins can review applications" ON public.reseller_applications
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner'));

NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- BULK BUY SYSTEM FOR RESELLERS
-- ============================================================================

-- Bulk pricing tiers table
CREATE TABLE IF NOT EXISTS public.bulk_pricing_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  duration text NOT NULL,
  min_quantity int NOT NULL DEFAULT 1,
  price_per_unit decimal(10,2) NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bulk orders table
CREATE TABLE IF NOT EXISTS public.bulk_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  duration text NOT NULL,
  quantity int NOT NULL,
  total_price decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'completed', 'cancelled')),
  payment_id text,
  keys_generated jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

INSERT INTO public.bulk_pricing_tiers (duration, min_quantity, price_per_unit) VALUES
  ('7-days', 1, 4.99),
  ('7-days', 5, 4.49),
  ('7-days', 10, 3.99),
  ('7-days', 25, 3.49),
  ('7-days', 50, 2.99),
  ('1-month', 1, 14.99),
  ('1-month', 5, 13.49),
  ('1-month', 10, 11.99),
  ('1-month', 25, 9.99),
  ('1-month', 50, 7.99),
  ('3-months', 1, 34.99),
  ('3-months', 5, 29.99),
  ('3-months', 10, 24.99),
  ('3-months', 25, 19.99),
  ('3-months', 50, 14.99)
ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_bulk_price(p_duration text, p_quantity int)
RETURNS TABLE (price_per_unit decimal(10,2), total_price decimal(10,2), tier_min int) AS $$
BEGIN
  RETURN QUERY
  SELECT bpt.price_per_unit, bpt.price_per_unit * p_quantity, bpt.min_quantity
  FROM public.bulk_pricing_tiers bpt
  WHERE bpt.duration = p_duration AND bpt.is_active = true AND bpt.min_quantity <= p_quantity
  ORDER BY bpt.min_quantity DESC LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_bulk_order(p_duration text, p_quantity int)
RETURNS json AS $$
DECLARE
  v_price record;
  v_order_id uuid;
  v_keys text[];
  v_key text;
  v_i int;
  v_duration_interval interval;
  v_category_id uuid;
BEGIN
  SELECT price_per_unit, total_price INTO v_price
  FROM public.get_bulk_price(p_duration, p_quantity) LIMIT 1;

  IF v_price IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid duration or quantity');
  END IF;

  SELECT id INTO v_category_id FROM public.software_categories WHERE LOWER(name) LIKE '%cs2%' LIMIT 1;
  IF v_category_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'CS2 category not found');
  END IF;

  v_duration_interval := CASE WHEN p_duration = '7-days' THEN '7 days' WHEN p_duration = '1-month' THEN '30 days' WHEN p_duration = '3-months' THEN '90 days' END;

  INSERT INTO public.bulk_orders (user_id, duration, quantity, total_price, status)
  VALUES (auth.uid(), p_duration, p_quantity, v_price.total_price, 'pending')
  RETURNING id INTO v_order_id;

  v_keys := ARRAY[]::text[];
  FOR v_i IN 1..p_quantity LOOP
    v_key := 'SAGI-' || upper(substring(gen_random_uuid()::text, 1, 8));
    INSERT INTO public.software_keys (key, category_id, max_uses, created_by, metadata, expires_at)
    VALUES (v_key, v_category_id, 1, auth.uid(), jsonb_build_object('duration', p_duration, 'bulk_order_id', v_order_id::text), now() + v_duration_interval);
    v_keys := array_append(v_keys, v_key);
  END LOOP;

  UPDATE public.bulk_orders SET keys_generated = v_keys::jsonb WHERE id = v_order_id;

  RETURN json_build_object('success', true, 'order_id', v_order_id, 'quantity', p_quantity, 'price_per_unit', v_price.price_per_unit, 'total_price', v_price.total_price, 'keys', v_keys);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.confirm_bulk_order(p_order_id uuid, p_payment_id text)
RETURNS json AS $$
BEGIN
  UPDATE public.bulk_orders SET status = 'paid', payment_id = p_payment_id, completed_at = now()
  WHERE id = p_order_id AND status = 'pending';
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Order not found or already processed');
  END IF;
  RETURN json_build_object('success', true, 'message', 'Order confirmed');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.bulk_pricing_tiers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read bulk pricing" ON public.bulk_pricing_tiers;
CREATE POLICY "Anyone can read bulk pricing" ON public.bulk_pricing_tiers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage bulk pricing" ON public.bulk_pricing_tiers;
CREATE POLICY "Admins can manage bulk pricing" ON public.bulk_pricing_tiers
  FOR ALL USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner'));

ALTER TABLE public.bulk_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their bulk orders" ON public.bulk_orders;
CREATE POLICY "Users can view their bulk orders" ON public.bulk_orders
  FOR SELECT USING (user_id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'owner'));
DROP POLICY IF EXISTS "Users can create bulk orders" ON public.bulk_orders;
CREATE POLICY "Users can create bulk orders" ON public.bulk_orders FOR INSERT WITH CHECK (user_id = auth.uid());

NOTIFY pgrst, 'reload schema';
