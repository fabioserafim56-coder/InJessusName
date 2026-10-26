-- Synthetic identities only. Every fixture and mutation is rolled back.
-- This suite exercises the real RPCs and existing RLS; HTTP Auth is not needed.
begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

select ok(not (select prosecdef from pg_proc where oid =
  'public.save_learning_profile(public.age_band,text,public.baptism_status,public.learning_goal,boolean)'::regprocedure),
  'saving a learning profile uses caller privileges, not SECURITY DEFINER');
select ok(not (select prosecdef from pg_proc where oid =
  'public.revoke_learning_personalization()'::regprocedure),
  'revoking personalization uses caller privileges');
select ok(has_function_privilege('authenticated',
  'public.save_learning_profile(public.age_band,text,public.baptism_status,public.learning_goal,boolean)', 'execute'),
  'authenticated users can call the save RPC');
select ok(not has_function_privilege('anon',
  'public.save_learning_profile(public.age_band,text,public.baptism_status,public.learning_goal,boolean)', 'execute'),
  'anonymous users have no execution grant on the save RPC');
select ok(not has_function_privilege('service_role',
  'public.save_learning_profile(public.age_band,text,public.baptism_status,public.learning_goal,boolean)', 'execute'),
  'the application cannot replace the user session with a service-role call');
select ok(not has_function_privilege('anon',
  'public.revoke_learning_personalization()', 'execute'),
  'anonymous users have no execution grant on the revocation RPC');
select is((select proargnames from pg_proc where oid =
  'public.save_learning_profile(public.age_band,text,public.baptism_status,public.learning_goal,boolean)'::regprocedure),
  array['p_age_band','p_tradition_code','p_baptism_status','p_learning_goal','p_consent']::text[],
  'RPC parameters cannot select another user or forge a consent recorder');

insert into auth.users (id, email) values
  ('41000000-0000-0000-0000-000000000001', 'onboarding-adult@example.test'),
  ('41000000-0000-0000-0000-000000000002', 'onboarding-other@example.test'),
  ('41000000-0000-0000-0000-000000000003', 'onboarding-known-minor@example.test'),
  ('41000000-0000-0000-0000-000000000004', 'onboarding-empty@example.test');

-- A second person's pre-existing information must remain private and unchanged.
insert into public.profiles (user_id, display_name) values
  ('41000000-0000-0000-0000-000000000002', 'Outra pessoa');
insert into public.consent_records
  (user_id, recorded_by, purpose, notice_version, decision, legal_basis)
values
  ('41000000-0000-0000-0000-000000000002',
   '41000000-0000-0000-0000-000000000002',
   'religious_personalization', 'fixture-only', 'granted', 'consent');
insert into public.learning_profiles (user_id, age_band, learning_goal) values
  ('41000000-0000-0000-0000-000000000002', '18_plus', 'theology_history');
insert into private.learner_safeguards (user_id, known_minor) values
  ('41000000-0000-0000-0000-000000000003', true);

set local role anon;
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'the anonymous role cannot save a profile');
select throws_ok($$ select public.revoke_learning_personalization() $$,
  '42501', null, 'the anonymous role cannot submit revocation for an identity');

set local role authenticated;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{"role":"authenticated"}', true);
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'an authenticated database role without a user identity cannot save');
select throws_ok($$ select public.revoke_learning_personalization() $$,
  '42501', null, 'revocation requires an actual user identity');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', false) $$,
  '22023', null, 'unchecked consent is rejected');
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', null) $$,
  '22023', null, 'missing consent is rejected');
select throws_ok($$ select public.save_learning_profile(
  '6_9', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'a checked box does not authorize a child religious profile');
select throws_ok($$ select public.save_learning_profile(
  '10_12', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'the bridge age band cannot bypass the guardian-flow boundary');
select throws_ok($$ select public.save_learning_profile(
  '13_17', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'the youth age band cannot bypass the guardian-flow boundary');
select throws_ok($$ select public.save_learning_profile(
  null, null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'an absent age does not default to adult');
select throws_ok($$ select public.save_learning_profile(
  '18_plus', 'unavailable-tradition', 'not_informed', 'bible_foundations', true) $$,
  '22023', null, 'unknown tradition codes are rejected');
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, null, 'bible_foundations', true) $$,
  '22023', null, 'an absent baptism answer is rejected without recording consent');
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', null, true) $$,
  '22023', null, 'an absent learning goal is rejected without recording consent');
select is((select count(*) from public.profiles), 0::bigint,
  'invalid requests created no application profile');
select is((select count(*) from public.consent_records), 0::bigint,
  'invalid requests created no consent event');
select is((select count(*) from public.learning_profiles), 0::bigint,
  'invalid requests created no sensitive profile');

reset role;
update public.traditions set is_published = false where code = 'roman_catholic';
set local role authenticated;
select throws_ok($$ select public.save_learning_profile(
  '18_plus', 'roman_catholic', 'not_informed', 'bible_foundations', true) $$,
  '22023', null, 'an allowed code still requires a published tradition');
select is((select count(*) from public.consent_records), 0::bigint,
  'a hidden tradition failure leaves no partial consent');
reset role;
update public.traditions set is_published = true where code = 'roman_catholic';
update public.religions set is_published = false where code = 'christianity';
set local role authenticated;
select throws_ok($$ select public.save_learning_profile(
  '18_plus', 'ccb', 'not_informed', 'bible_foundations', true) $$,
  '22023', null, 'a tradition cannot be selected when its religion is unpublished');
reset role;
update public.religions set is_published = true where code = 'christianity';
set local role authenticated;

select lives_ok($$ select public.save_learning_profile(
  '18_plus', 'ccb', 'not_baptized', 'bible_foundations', true) $$,
  'an adult can atomically save a consented Christian learning profile');
select is((select count(*) from public.profiles), 1::bigint,
  'the save creates exactly one own application profile');
select is((select count(*) from public.learning_profiles), 1::bigint,
  'the save creates exactly one own learning profile');
select is((select tradition.code from public.learning_profiles profile
  join public.traditions tradition on tradition.id = profile.tradition_id), 'ccb',
  'the selected CCB perspective is stored by its published identity');
select is((select baptism_status::text from public.learning_profiles), 'not_baptized',
  'the self-declared baptism answer is stored');
select is((select learning_goal::text from public.learning_profiles), 'bible_foundations',
  'the learning goal is stored');
select is((select age_band::text from public.learning_profiles), '18_plus',
  'only the adult age band was persisted through the RPC');
select is((select notice_version from public.consent_records), 'onboarding-2026-10-24-v1',
  'the consent event has the application notice version');
select is((select recorded_by from public.consent_records),
  '41000000-0000-0000-0000-000000000001'::uuid,
  'the consent recorder is derived from the authenticated identity');
select is((select legal_basis from public.consent_records), 'consent',
  'the purpose-specific permission is recorded as consent');
select is((select count(*) from public.learning_profiles
  where user_id = '41000000-0000-0000-0000-000000000002'), 0::bigint,
  'the second person profile is not exposed to the caller');

select lives_ok($$ select public.save_learning_profile(
  '18_plus', 'roman_catholic', 'baptized', 'theology_history', true) $$,
  'an adult can revise the perspective and answers');
select is((select tradition.code from public.learning_profiles profile
  join public.traditions tradition on tradition.id = profile.tradition_id), 'roman_catholic',
  'the revised Catholic perspective replaces the previous value');
select is((select learning_goal::text from public.learning_profiles), 'theology_history',
  'the revised objective replaces the previous value');
select lives_ok($$ select public.save_learning_profile(
  '18_plus', 'evangelical_protestant', 'not_informed', 'christian_service', true) $$,
  'the Protestant option and an undisclosed baptism answer are accepted');
select is((select tradition.code from public.learning_profiles profile
  join public.traditions tradition on tradition.id = profile.tradition_id), 'evangelical_protestant',
  'the Protestant identity is stored correctly');
select lives_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  'a seeker can save the common Christian path without declaring a tradition');
select ok((select tradition_id is null from public.learning_profiles),
  'the seeker choice is a null association, not an invented denomination');
select lives_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  'repeating a save updates the same application and learning profiles');
select is((select count(*) from public.profiles), 1::bigint,
  'repeated saves do not duplicate the application profile');
select is((select count(*) from public.learning_profiles), 1::bigint,
  'repeated saves do not duplicate the learning profile');
select is((select count(*) from public.consent_records), 5::bigint,
  'each explicitly authorized save appends its own consent event');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select is((select learning_goal::text from public.learning_profiles), 'theology_history',
  'saving another person path did not overwrite this profile');
select is((select count(*) from public.consent_records), 1::bigint,
  'another person consent history was neither exposed nor appended to');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  '42501', null, 'a known minor cannot upgrade themself through the adult RPC');
select is((select count(*) from public.profiles), 0::bigint,
  'a late RLS refusal rolls back the profile created by the RPC');
select is((select count(*) from public.consent_records), 0::bigint,
  'a late RLS refusal rolls back the consent inserted earlier in the RPC');
select is((select count(*) from public.learning_profiles), 0::bigint,
  'a known-minor refusal stores no sensitive answers');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000099', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000099","role":"authenticated"}', true);
select throws_ok($$ select public.save_learning_profile(
  '18_plus', null, 'not_informed', 'bible_foundations', true) $$,
  '23503', null, 'a claimed identity absent from Auth cannot create orphan data');
select is((select count(*) from public.profiles), 0::bigint,
  'a foreign-key failure leaves no application profile');
select is((select count(*) from public.consent_records), 0::bigint,
  'a foreign-key failure leaves no consent event');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select lives_ok($$ select public.revoke_learning_personalization() $$,
  'an adult can revoke purpose-specific personalization');
select is((select count(*) from public.learning_profiles), 0::bigint,
  'revocation removes the sensitive learning profile');
select is((select count(*) from public.profiles), 1::bigint,
  'revocation preserves the application identity');
select is((select count(*) from public.consent_records), 6::bigint,
  'revocation appends evidence instead of overwriting previous consent');
select is((select decision from public.consent_records order by event_sequence desc limit 1), 'revoked',
  'the latest consent decision is revoked');
select lives_ok($$ select public.revoke_learning_personalization() $$,
  'repeated revocation is safe even without a learning profile');
select is((select count(*) from public.learning_profiles), 0::bigint,
  'repeated revocation does not recreate sensitive data');
select is((select count(*) from public.consent_records), 7::bigint,
  'the repeated request preserves an append-only revocation history');

select set_config('request.jwt.claim.sub', '41000000-0000-0000-0000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"41000000-0000-0000-0000-000000000004","role":"authenticated"}', true);
select lives_ok($$ select public.revoke_learning_personalization() $$,
  'revocation is a safe no-op when no application profile exists');
select is((select count(*) from public.profiles), 0::bigint,
  'a no-op revocation does not create a new profile');
select is((select count(*) from public.consent_records), 0::bigint,
  'a no-op revocation creates no orphan evidence');

reset role;
select is((select count(*) from auth.users where id = '41000000-0000-0000-0000-000000000001'), 1::bigint,
  'revoking personalization does not delete the Auth account');
select ok((select known_minor from private.learner_safeguards
  where user_id = '41000000-0000-0000-0000-000000000003'),
  'a failed adult RPC does not remove the administrative minor safeguard');
select is((select count(*) from public.learning_profiles
  where user_id = '41000000-0000-0000-0000-000000000002'), 1::bigint,
  'revocation and validation failures leave the other person profile intact');

select * from finish();
rollback;
