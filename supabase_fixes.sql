-- ==========================================
-- SAGITARR - CORRECTIFS SUPABASE
-- Exécute ce fichier dans l'éditeur SQL de Supabase
-- ==========================================

-- ==========================================
-- 1. TRIGGER : Création auto du profil à l'inscription
-- (Résout la page noire pour les autres users)
-- ==========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pour les users existants sans profil (à exécuter une fois)
insert into public.profiles (id, username, role)
select id, coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1)), 'member'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;


-- ==========================================
-- 2. FONCTION : Validation du code d'invitation (pour anon)
-- (Permet de vérifier le code AVANT inscription sans exposer la table)
-- ==========================================
create or replace function public.validate_invite_code(p_code text)
returns json
language plpgsql
security definer
as $$
declare
  v_exists boolean;
begin
  select exists (
    select 1 from inv_code
    where upper(trim(code)) = upper(trim(p_code))
      and is_active = true
      and (expires_at is null or expires_at > now())
      and (max_uses = 0 or current_uses < max_uses)
  ) into v_exists;

  if v_exists then
    return json_build_object('valid', true);
  else
    return json_build_object('valid', false, 'message', 'Code invalide ou déjà utilisé.');
  end if;
end;
$$;

grant execute on function validate_invite_code(text) to anon;
grant execute on function validate_invite_code(text) to authenticated;


-- ==========================================
-- 3. FONCTION use_invite_code : Correction pour max_uses
-- (Marque bien le code comme utilisé)
-- ==========================================
create or replace function use_invite_code(p_code text)
returns json
language plpgsql
security definer
as $$
declare
  v_code_id uuid;
  v_max_uses int;
  v_current int;
begin
  -- 1. Vérifier si l'user a déjà utilisé un code (1 seul compte par user)
  if exists (select 1 from inv_code where used_by = auth.uid()) then
    return json_build_object('success', false, 'message', 'Compte déjà activé.');
  end if;

  -- 2. Trouver le code (support max_uses > 1)
  select id, max_uses, current_uses into v_code_id, v_max_uses, v_current
  from inv_code
  where upper(trim(code)) = upper(trim(p_code))
    and is_active = true
    and (expires_at is null or expires_at > now())
    and (max_uses = 0 or current_uses < max_uses)
  limit 1;

  if v_code_id is null then
    perform log_activity('KEY_FAIL', 'Tentative code invalide: ' || p_code);
    return json_build_object('success', false, 'message', 'Code invalide ou expiré.');
  end if;

  -- 3. Marquer comme utilisé
  update inv_code
  set is_used = case when coalesce(max_uses, 1) <= 1 or (current_uses + 1) >= max_uses then true else is_used end,
      used_by = auth.uid(),
      current_uses = current_uses + 1
  where id = v_code_id;

  perform log_activity('KEY_USED', 'Code activé avec succès');
  return json_build_object('success', true, 'message', 'Accès autorisé.');
end;
$$;


-- ==========================================
-- 4. FONCTION : Génération de codes complexes (Admin)
-- Format: SAG-XXXX-XXXX-XXXX (16 caractères alphanum)
-- ==========================================
create or replace function public.generate_invite_code(
  p_expires_days int default 30,
  p_max_uses int default 1
)
returns json
language plpgsql
security definer
as $$
declare
  v_code text;
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Pas de 0,O,1,I pour éviter confusion
  v_i int;
  v_id uuid;
begin
  -- Vérifier que c'est un admin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    return json_build_object('success', false, 'message', 'Non autorisé.');
  end if;

  -- Générer code: SAG-XXXX-XXXX-XXXX (12 chars aléatoires)
  v_code := 'SAG-';
  for v_i in 1..12 loop
    v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    if v_i in (4, 8) then
      v_code := v_code || '-';
    end if;
  end loop;

  -- Insérer
  insert into inv_code (code, max_uses, expires_at, created_by, is_active)
  values (v_code, p_max_uses, 
    case when p_expires_days > 0 then now() + (p_expires_days || ' days')::interval else null end,
    auth.uid(), true)
  returning id into v_id;

  return json_build_object('success', true, 'code', v_code, 'id', v_id);
end;
$$;

grant execute on function generate_invite_code(int, int) to authenticated;


-- ==========================================
-- 5. FONCTION : Stats admin (membres, online, clés, events)
-- ==========================================
create or replace function public.get_admin_stats()
returns json
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    return json_build_object('error', 'Non autorisé');
  end if;
  return (
    select json_build_object(
      'total_members', (select count(*)::int from profiles),
      'online_now', (select count(*)::int from profiles where last_login > now() - interval '15 minutes'),
      'active_keys', (select count(*)::int from inv_code where is_active = true and (is_used = false or (max_uses > 1 and current_uses < max_uses))),
      'events_24h', (select count(*)::int from audit_logs where created_at > now() - interval '24 hours')
    )
  );
end;
$$;

grant execute on function get_admin_stats() to authenticated;


-- ==========================================
-- 6. FONCTION : Supprimer un code d'invitation (Admin)
-- ==========================================
create or replace function public.delete_invite_code(p_id uuid)
returns json
language plpgsql
security definer
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and role = 'admin') then
    return json_build_object('success', false, 'message', 'Non autorisé');
  end if;
  delete from inv_code where id = p_id;
  return json_build_object('success', true);
end;
$$;

grant execute on function delete_invite_code(uuid) to authenticated;


-- ==========================================
-- 7. Policy : Users insert own profile
-- ==========================================
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles
for insert with check (auth.uid() = id);
