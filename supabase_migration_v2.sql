-- ==========================================
-- SAGITARR v2 - Migration (codes distincts + abonnements)
-- Exécute dans l'éditeur SQL Supabase
-- ==========================================

-- 1. Colonnes manquantes sur inv_code
ALTER TABLE inv_code ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE inv_code ADD COLUMN IF NOT EXISTS code_type text DEFAULT 'license' CHECK (code_type IN ('invite', 'license'));
ALTER TABLE inv_code ADD COLUMN IF NOT EXISTS duration_days int DEFAULT 30;

-- 2. Colonne subscription sur profiles (pour paiement futur)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium'));

-- 3. Mettre à jour les codes existants
  UPDATE inv_code SET code_type = 'license' WHERE code_type IS NULL OR code_type = '';
  -- Codes existants (SAG-*) : considérés comme license pour rétrocompat

-- ==========================================
-- VALIDATION : Code d'invitation (inscription uniquement)
-- Format: INVT-XXXX-XXXX
-- ==========================================
CREATE OR REPLACE FUNCTION public.validate_invite_code(p_code text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM inv_code
    WHERE upper(trim(code)) = upper(trim(p_code))
      AND code_type = 'invite'
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses = 0 OR current_uses < max_uses)
  ) INTO v_exists;
  IF v_exists THEN RETURN json_build_object('valid', true);
  ELSE RETURN json_build_object('valid', false, 'message', 'Code invalide ou déjà utilisé.');
  END IF;
END; $$;

-- ==========================================
-- VALIDATION : Clé de licence (activation abonnement)
-- Format: LIC-XXXX-XXXX-XXXX
-- ==========================================
CREATE OR REPLACE FUNCTION public.validate_license_key(p_code text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM inv_code
    WHERE upper(trim(code)) = upper(trim(p_code))
      AND (code_type = 'license' OR code_type IS NULL)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND (max_uses = 0 OR current_uses < max_uses)
  ) INTO v_exists;
  IF v_exists THEN RETURN json_build_object('valid', true);
  ELSE RETURN json_build_object('valid', false, 'message', 'Clé invalide ou expirée.');
  END IF;
END; $$;

GRANT EXECUTE ON FUNCTION validate_invite_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_license_key(text) TO authenticated;

-- ==========================================
-- USE : Code d'invitation (à l'inscription)
-- ==========================================
CREATE OR REPLACE FUNCTION public.use_invite_code(p_code text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_code_id uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM inv_code WHERE used_by = auth.uid()) THEN
    RETURN json_build_object('success', false, 'message', 'Compte déjà activé.');
  END IF;
  SELECT id INTO v_code_id FROM inv_code
  WHERE upper(trim(code)) = upper(trim(p_code))
    AND code_type = 'invite' AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses = 0 OR current_uses < max_uses) LIMIT 1;
  IF v_code_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Code invalide ou expiré.');
  END IF;
  UPDATE inv_code SET is_used = true, used_by = auth.uid(), current_uses = current_uses + 1 WHERE id = v_code_id;
  RETURN json_build_object('success', true);
END; $$;

-- ==========================================
-- USE : Clé de licence (activation abonnement)
-- ==========================================
CREATE OR REPLACE FUNCTION public.use_license_key(p_code text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_code_id uuid; v_days int;
BEGIN
  SELECT ic.id, coalesce(ic.duration_days, 30) INTO v_code_id, v_days FROM inv_code ic
  WHERE upper(trim(ic.code)) = upper(trim(p_code))
    AND (ic.code_type = 'license' OR ic.code_type IS NULL) AND ic.is_active = true
    AND (ic.expires_at IS NULL OR ic.expires_at > now())
    AND (ic.max_uses = 0 OR ic.current_uses < ic.max_uses) LIMIT 1;
  IF v_code_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Clé invalide ou expirée.');
  END IF;
  UPDATE inv_code SET is_used = true, used_by = auth.uid(), current_uses = current_uses + 1 WHERE id = v_code_id;
  UPDATE profiles SET subscription_ends_at = greatest(coalesce(subscription_ends_at, '1970-01-01'::timestamptz), now()) + (v_days || ' days')::interval WHERE id = auth.uid();
  RETURN json_build_object('success', true);
END; $$;

GRANT EXECUTE ON FUNCTION use_invite_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION use_license_key(text) TO authenticated;

-- ==========================================
-- GÉNÉRATION : Code d'invitation (INVT-XXXX-XXXX)
-- ==========================================
CREATE OR REPLACE FUNCTION public.generate_invite_code(p_expires_days int DEFAULT 7, p_max_uses int DEFAULT 1)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_code text; v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; v_i int; v_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'message', 'Non autorisé.');
  END IF;
  v_code := 'INVT-';
  FOR v_i IN 1..8 LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    IF v_i = 4 THEN v_code := v_code || '-'; END IF;
  END LOOP;
  INSERT INTO inv_code (code, code_type, max_uses, expires_at, created_by, is_active)
  VALUES (v_code, 'invite', p_max_uses,
    CASE WHEN p_expires_days > 0 THEN now() + (p_expires_days || ' days')::interval ELSE NULL END,
    auth.uid(), true) RETURNING id INTO v_id;
  RETURN json_build_object('success', true, 'code', v_code, 'id', v_id);
END; $$;

-- ==========================================
-- GÉNÉRATION : Clé de licence (LIC-XXXX-XXXX-XXXX)
-- ==========================================
CREATE OR REPLACE FUNCTION public.generate_license_key(p_duration_days int DEFAULT 30, p_max_uses int DEFAULT 1, p_expires_days int DEFAULT 90)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_code text; v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; v_i int; v_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'message', 'Non autorisé.');
  END IF;
  v_code := 'LIC-';
  FOR v_i IN 1..12 LOOP
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    IF v_i IN (4, 8) THEN v_code := v_code || '-'; END IF;
  END LOOP;
  INSERT INTO inv_code (code, code_type, max_uses, expires_at, created_by, is_active, duration_days)
  VALUES (v_code, 'license', p_max_uses,
    CASE WHEN p_expires_days > 0 THEN now() + (p_expires_days || ' days')::interval ELSE NULL END,
    auth.uid(), true, p_duration_days) RETURNING id INTO v_id;
  RETURN json_build_object('success', true, 'code', v_code, 'id', v_id);
END; $$;

GRANT EXECUTE ON FUNCTION generate_invite_code(int, int) TO authenticated;
GRANT EXECUTE ON FUNCTION generate_license_key(int, int, int) TO authenticated;

-- ==========================================
-- SUPPRESSION : Code / Clé (Admin)
-- ==========================================
CREATE OR REPLACE FUNCTION public.delete_invite_code(p_id uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'message', 'Non autorisé.');
  END IF;
  DELETE FROM inv_code WHERE id = p_id;
  RETURN json_build_object('success', true);
END; $$;
GRANT EXECUTE ON FUNCTION delete_invite_code(uuid) TO authenticated;
