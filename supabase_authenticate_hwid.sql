-- ============================================================================
-- SAGITARIUS.cc - LOADER HWID AUTHENTICATION RPC SETUP
-- Copy and paste this directly into your Supabase SQL Editor (Dashboard > SQL Editor)
-- and click 'RUN'.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.authenticate_hwid(p_hwid text)
RETURNS TABLE (
  success boolean,
  message text,
  loader_url text,
  session_token text
) 
SECURITY DEFINER -- Runs with elevated permissions to bypass RLS safely
SET search_path = public, pg_temp
LANGUAGE plpgsql
AS $$
DECLARE
  v_has_access boolean := false;
  v_url text;
  v_username text;
  v_key_id uuid;
BEGIN
  -- 1. Check if HWID is linked to an ACTIVE subscription key in software_keys
  SELECT sk.id, sf.url, (sk.metadata->>'username')::text
  INTO v_key_id, v_url, v_username
  FROM public.software_keys sk
  JOIN public.software_categories sc ON sc.id = sk.category_id
  JOIN public.software_files sf ON sf.category_id = sc.id
  WHERE (sk.metadata->>'hwid')::text = p_hwid 
    AND sk.is_active = true 
    AND sf.is_loader = true
    AND (sk.expires_at IS NULL OR sk.expires_at > now())
  LIMIT 1;

  -- If found on a key, grant access
  IF v_key_id IS NOT NULL THEN
    v_has_access := true;
  END IF;

  -- 2. Fallback: Check profiles table (for Admins, Owners, VIPs who auto-login via registered HWID)
  IF NOT v_has_access THEN
    SELECT true, sf.url, p.username
    INTO v_has_access, v_url, v_username
    FROM public.profiles p
    CROSS JOIN public.software_files sf
    WHERE p.hwid = p_hwid 
      AND p.role IN ('admin', 'owner', 'vip', 'super_vip') 
      AND sf.is_loader = true
    LIMIT 1;
  END IF;

  -- 3. Return results
  IF v_has_access THEN
    -- If no loader URL configured, return a default mock/placeholder or empty
    IF v_url IS NULL THEN
      v_url := 'DYNAMIC_PATCHER';
    END IF;
    
    RETURN QUERY 
    SELECT 
      true, 
      'Welcome back, ' || COALESCE(v_username, 'Subscriber') || '!', 
      v_url, 
      gen_random_uuid()::text;
  ELSE
    RETURN QUERY 
    SELECT 
      false, 
      'HWID not registered or subscription has expired.'::text, 
      NULL::text, 
      NULL::text;
  END IF;
END;
$$;

-- Grant permissions so the loader API can call it unauthenticated/authenticated
GRANT EXECUTE ON FUNCTION public.authenticate_hwid(text) TO anon;
GRANT EXECUTE ON FUNCTION public.authenticate_hwid(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.authenticate_hwid(text) TO service_role;
