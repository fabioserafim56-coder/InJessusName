-- Adult onboarding is an authenticated, atomic write under the caller's RLS.
-- These functions do not verify a self-declared age or implement guardian consent.
begin;

create function public.save_learning_profile(
  p_age_band public.age_band,
  p_tradition_code text,
  p_baptism_status public.baptism_status,
  p_learning_goal public.learning_goal,
  p_consent boolean
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  selected_tradition_id uuid;
begin
  if actor_id is null then
    raise exception 'Entre na sua conta para salvar o percurso.' using errcode = '42501';
  end if;

  -- A protected guardian flow is not available yet. No religious profile for
  -- minors is accepted through this RPC, even if the caller checks consent.
  if p_age_band is distinct from '18_plus'::public.age_band then
    raise exception 'O perfil de menores precisa de um fluxo de responsável verificado.' using errcode = '42501';
  end if;
  if p_consent is distinct from true then
    raise exception 'A personalização precisa da sua autorização específica.' using errcode = '22023';
  end if;
  if p_baptism_status is null or p_learning_goal is null then
    raise exception 'Confira as respostas da conversa inicial.' using errcode = '22023';
  end if;

  if p_tradition_code is not null then
    if p_tradition_code not in ('ccb', 'roman_catholic', 'evangelical_protestant') then
      raise exception 'A tradição informada não está disponível neste percurso.' using errcode = '22023';
    end if;

    select tradition.id into selected_tradition_id
    from public.traditions as tradition
    join public.religions as religion on religion.id = tradition.religion_id
    where tradition.code = p_tradition_code
      and tradition.is_published
      and religion.code = 'christianity'
      and religion.is_published;

    if selected_tradition_id is null then
      raise exception 'A tradição informada não está disponível neste percurso.' using errcode = '22023';
    end if;
  end if;

  insert into public.profiles (user_id) values (actor_id)
    on conflict (user_id) do nothing;

  -- Serialize saves and revocations for the same existing identity. The lock
  -- and every write use the caller's privileges and owner policies.
  perform profile.user_id from public.profiles as profile
    where profile.user_id = actor_id for update;

  insert into public.consent_records
    (user_id, purpose, notice_version, decision, legal_basis)
  values
    (actor_id, 'religious_personalization', 'onboarding-2026-10-24-v1', 'granted', 'consent');

  insert into public.learning_profiles
    (user_id, age_band, tradition_id, baptism_status, learning_goal, interview_version, updated_at)
  values
    (actor_id, p_age_band, selected_tradition_id, p_baptism_status, p_learning_goal, 1, pg_catalog.clock_timestamp())
  on conflict (user_id) do update set
    age_band = excluded.age_band,
    tradition_id = excluded.tradition_id,
    baptism_status = excluded.baptism_status,
    learning_goal = excluded.learning_goal,
    interview_version = excluded.interview_version,
    updated_at = excluded.updated_at;

  -- The existing learning_profiles RLS checks the new consent and the private
  -- known-minor safeguard. Any refusal rolls back the profile and consent above.
end;
$$;

create function public.revoke_learning_personalization() returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
begin
  if actor_id is null then
    raise exception 'Entre na sua conta para alterar a personalização.' using errcode = '42501';
  end if;

  perform profile.user_id from public.profiles as profile
    where profile.user_id = actor_id for update;
  if not found then
    -- No application profile or personalized data exists to revoke.
    return;
  end if;

  insert into public.consent_records
    (user_id, purpose, notice_version, decision, legal_basis)
  values
    (actor_id, 'religious_personalization', 'onboarding-2026-10-24-v1', 'revoked', 'consent');

  -- The existing consent_revocation trigger removes this person's learning
  -- profile. Identity and the append-only consent history remain available.
end;
$$;

-- Supabase can have default EXECUTE grants for more than PUBLIC. Revoke each
-- API role explicitly; the application must use the authenticated user token.
revoke all on function public.save_learning_profile(public.age_band, text, public.baptism_status, public.learning_goal, boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.revoke_learning_personalization()
  from public, anon, authenticated, service_role;
grant execute on function public.save_learning_profile(public.age_band, text, public.baptism_status, public.learning_goal, boolean)
  to authenticated;
grant execute on function public.revoke_learning_personalization()
  to authenticated;

comment on function public.save_learning_profile(public.age_band, text, public.baptism_status, public.learning_goal, boolean)
  is 'Atomic adult self-onboarding under caller RLS; requires explicit purpose-specific consent. Self-declared age is not identity verification.';
comment on function public.revoke_learning_personalization()
  is 'Append own revocation and remove sensitive learning profile through the existing trigger, without deleting the account.';

commit;
