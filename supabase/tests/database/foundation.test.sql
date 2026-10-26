-- Run with `supabase test db` against the local development database.
-- All fixtures and mutations are rolled back. Bytes below are test fixtures,
-- not a client-side encryption implementation or real personal information.
begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

select ok(
  exists (select 1 from pg_extension where extname = 'vector'),
  'pgvector is available for the licensed public-content search pipeline'
);
select ok(
  not exists (
    select 1 from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind in ('r', 'p')
      and not c.relrowsecurity
  ),
  'every table in the exposed public schema has row-level security enabled'
);
select ok(
  not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'encrypted_notes'
      and column_name in ('title', 'body', 'content', 'plaintext', 'scripture',
        'observation', 'application', 'prayer', 'category')
  ),
  'note titles, SOAP content, references and categories have no plaintext columns'
);
select ok(
  not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
      and (has_function_privilege('anon', p.oid, 'execute')
        or has_function_privilege('authenticated', p.oid, 'execute'))
  ),
  'no exposed SECURITY DEFINER function lets API clients bypass table policies'
);
select ok(
  not exists (
    select 1 from pg_constraint c
    where c.contype = 'f'
      and c.conrelid in ('public.content_chunks'::regclass,
        'public.content_embeddings'::regclass)
      and c.confrelid in ('public.encrypted_notes'::regclass,
        'public.profiles'::regclass, 'public.learning_profiles'::regclass)
  ),
  'shared search tables have no foreign keys to private notes or learner profiles'
);

insert into auth.users (id, email) values
  ('10000000-0000-0000-0000-000000000001', 'foundation-one@example.test'),
  ('10000000-0000-0000-0000-000000000002', 'foundation-two@example.test'),
  ('10000000-0000-0000-0000-000000000003', 'foundation-minor@example.test'),
  ('10000000-0000-0000-0000-000000000004', 'foundation-other@example.test');
insert into public.profiles (user_id, display_name) values
  ('10000000-0000-0000-0000-000000000001', 'Pessoa um'),
  ('10000000-0000-0000-0000-000000000002', 'Pessoa dois'),
  ('10000000-0000-0000-0000-000000000003', 'Pessoa menor')
on conflict (user_id) do nothing;

insert into public.note_vaults (id, user_id, protocol_version) values
  ('20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000002', 'test-only-v1');
insert into public.encrypted_notes
  (id, vault_id, user_id, ciphertext, nonce) values
  ('30000000-0000-0000-0000-000000000002',
   '20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000002',
   decode(repeat('aa', 64), 'hex'), decode(repeat('bb', 12), 'hex'));
insert into private.learner_safeguards (user_id, known_minor) values
  ('10000000-0000-0000-0000-000000000003', true);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}', true);

select is((select count(*) from public.profiles), 1::bigint,
  'an authenticated person sees only their own profile');
select is((select count(*) from public.profiles where user_id = '10000000-0000-0000-0000-000000000002'), 0::bigint,
  'a known second-user identifier does not reveal that profile');
select lives_ok($$ update public.profiles set display_name = 'Nome atualizado'
  where user_id = '10000000-0000-0000-0000-000000000001' $$,
  'a person can update their own display name');
with changed as (
  update public.profiles set display_name = 'Alteração indevida'
  where user_id = '10000000-0000-0000-0000-000000000002' returning 1
) select is((select count(*) from changed), 0::bigint,
  'an update cannot change another person profile');
select throws_ok($$ insert into public.profiles (user_id, display_name)
  values ('10000000-0000-0000-0000-000000000004', 'Perfil indevido') $$,
  '42501', null, 'a person cannot create a profile for another identity');
select throws_ok($$ update public.profiles
  set user_id = '10000000-0000-0000-0000-000000000004'
  where user_id = '10000000-0000-0000-0000-000000000001' $$,
  '42501', null, 'profile ownership cannot be reassigned by its owner');

select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000001', '18_plus') $$,
  null, null, 'sensitive personalization requires a granted purpose-specific consent');
select lives_ok($$ insert into public.consent_records
  (user_id, purpose, notice_version, decision, legal_basis)
  values ('10000000-0000-0000-0000-000000000001',
    'religious_personalization', 'test-v1', 'granted', 'consent') $$,
  'an adult can record their own purpose-specific consent');
select lives_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000001', '18_plus') $$,
  'adult personalization can be saved after valid consent');
select is((select count(*) from public.learning_profiles), 1::bigint,
  'personalization remains private to its owner');
select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000004', '18_plus') $$,
  null, null, 'another identity cannot receive a learning profile from this session');
select throws_ok($$ update public.consent_records set decision = 'revoked' $$,
  '42501', null, 'consent evidence cannot be rewritten in place');
select throws_ok($$ delete from public.consent_records $$,
  '42501', null, 'consent evidence cannot be erased by direct client CRUD');

select lives_ok($$ insert into public.note_vaults (id, user_id, protocol_version)
  values ('20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001', 'test-only-v1') $$,
  'a person can create their own ciphertext vault');
select lives_ok($$ insert into public.encrypted_notes
  (id, vault_id, user_id, ciphertext, nonce) values
  ('30000000-0000-0000-0000-000000000001',
   '20000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   decode(repeat('cc', 64), 'hex'), decode(repeat('dd', 12), 'hex')) $$,
  'a person can persist ciphertext in their own vault');
select is((select count(*) from public.note_vaults), 1::bigint,
  'vault metadata is isolated by owner');
select is((select count(*) from public.encrypted_notes), 1::bigint,
  'ciphertext records are isolated by owner');
select is((select count(*) from public.encrypted_notes
  where id = '30000000-0000-0000-0000-000000000002'), 0::bigint,
  'knowing a foreign note identifier does not expose its ciphertext');
select throws_ok($$ insert into public.encrypted_notes
  (vault_id, user_id, ciphertext, nonce) values
  ('20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000001',
   decode(repeat('ee', 64), 'hex'), decode(repeat('ff', 12), 'hex')) $$,
  null, null, 'a note cannot link the current owner to someone else vault');
select throws_ok($$ insert into public.encrypted_notes
  (vault_id, user_id, ciphertext, nonce) values
  ('20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000002',
   decode(repeat('ee', 64), 'hex'), decode(repeat('ff', 12), 'hex')) $$,
  '42501', null, 'a person cannot insert ciphertext on behalf of another owner');
select throws_ok($$ update public.encrypted_notes
  set user_id = '10000000-0000-0000-0000-000000000004'
  where id = '30000000-0000-0000-0000-000000000001' $$,
  '42501', null, 'a note owner cannot transfer its ownership by direct update');
with changed as (
  update public.encrypted_notes set ciphertext = decode(repeat('aa', 64), 'hex')
  where id = '30000000-0000-0000-0000-000000000002' returning 1
) select is((select count(*) from changed), 0::bigint,
  'another person ciphertext cannot be overwritten');
with removed as (
  delete from public.encrypted_notes
  where id = '30000000-0000-0000-0000-000000000002' returning 1
) select is((select count(*) from removed), 0::bigint,
  'another person ciphertext cannot be deleted');
select lives_ok($$ insert into public.encrypted_key_envelopes
  (vault_id, user_id, recipient_type, recipient_id, wrapped_key)
  values ('20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001', 'device', 'test-device',
    decode(repeat('aa', 64), 'hex')) $$,
  'a person can save an enveloped key for their own vault');
select throws_ok($$ select * from private.editorial_memberships $$,
  '42501', null, 'a learner cannot read private editorial assignments');
select throws_ok($$ insert into private.editorial_memberships (user_id, role)
  values ('10000000-0000-0000-0000-000000000001', 'admin') $$,
  '42501', null, 'a learner cannot promote themself to editor or administrator');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000003","role":"authenticated"}', true);
select lives_ok($$ insert into public.consent_records
  (user_id, purpose, notice_version, decision, legal_basis)
  values ('10000000-0000-0000-0000-000000000003',
    'religious_personalization', 'test-v1', 'granted', 'consent') $$,
  'a consent event alone can be recorded without pretending guardian verification');
select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000003', '10_12') $$,
  null, null, 'a minor profile cannot be stored without a verified guardian flow');
select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000003', '18_plus') $$,
  '42501', null, 'a known minor cannot bypass protection by selecting the adult age band');
select throws_ok($$ update private.learner_safeguards set known_minor = false
  where user_id = '10000000-0000-0000-0000-000000000003' $$,
  '42501', null, 'a learner cannot erase the administrative minor safeguard');
select throws_ok($$ insert into public.guardian_links
  (guardian_user_id, learner_user_id, status)
  values ('10000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003', 'verified') $$,
  '42501', null, 'a learner cannot forge a verified guardian relationship');
select lives_ok($$ delete from public.profiles
  where user_id = '10000000-0000-0000-0000-000000000003' $$,
  'a learner can remove their own application profile');
select lives_ok($$ insert into public.profiles (user_id, display_name)
  values ('10000000-0000-0000-0000-000000000003', 'Perfil recriado') $$,
  'an existing authenticated identity can recreate its removed application profile');
select lives_ok($$ insert into public.consent_records
  (user_id, purpose, notice_version, decision, legal_basis)
  values ('10000000-0000-0000-0000-000000000003',
    'religious_personalization', 'test-v1', 'granted', 'consent') $$,
  'recreated profiles can record their own new consent event');
select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000003', '18_plus') $$,
  '42501', null, 'deleting and recreating a profile does not erase the known-minor safeguard');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000001","role":"authenticated"}', true);
select lives_ok($$ insert into public.consent_records
  (user_id, purpose, notice_version, decision, legal_basis)
  values ('10000000-0000-0000-0000-000000000001',
    'religious_personalization', 'test-v1', 'revoked', 'consent') $$,
  'revocation appends a new event instead of mutating past consent');
select is((select count(*) from public.learning_profiles), 0::bigint,
  'revoking sensitive personalization removes the stored learning profile');
select throws_ok($$ insert into public.learning_profiles (user_id, age_band)
  values ('10000000-0000-0000-0000-000000000001', '18_plus') $$,
  '42501', null, 'latest revocation wins even when consent events share a transaction timestamp');

reset role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);

-- Original test-only documents. These are not Bible verses, institutional
-- documents or real license claims, and they never survive the rollback.
insert into public.religions (id, code, name, is_published) values
  ('41000000-0000-0000-0000-000000000001', 'foundation-test-religion', 'Teste', true);
insert into public.sources
  (id, title, author_or_institution, primary_url, source_type, access_class) values
  ('42000000-0000-0000-0000-000000000001', 'Fonte da fixture', 'Test runner',
   'https://example.test/source', 'original', 'public');
insert into public.source_versions
  (id, source_id, edition_label, verification_status) values
  ('43000000-0000-0000-0000-000000000001',
   '42000000-0000-0000-0000-000000000001', 'fixture-v1', 'verified');
insert into public.rights_grants
  (id, source_version_id, rights_holder, license_name, evidence_url, status,
   can_display, can_store, can_ai) values
  ('44000000-0000-0000-0000-000000000001',
   '43000000-0000-0000-0000-000000000001', 'Test runner', 'test-only',
   'https://example.test/fixture-license', 'verified', true, true, true);
insert into public.source_sections (id, source_version_id, locator) values
  ('47000000-0000-0000-0000-000000000001',
   '43000000-0000-0000-0000-000000000001', 'fixture-paragraph-1');
insert into public.content_items (id, kind, code, religion_id) values
  ('45000000-0000-0000-0000-000000000001', 'article', 'foundation-test-article',
   '41000000-0000-0000-0000-000000000001'),
  ('45000000-0000-0000-0000-000000000002', 'article', 'foundation-test-draft',
   '41000000-0000-0000-0000-000000000001'),
  ('45000000-0000-0000-0000-000000000003', 'lesson', 'foundation-test-lesson',
   '41000000-0000-0000-0000-000000000001');
insert into public.content_versions
  (id, content_item_id, version_number, title, body, access_class, rights_grant_id) values
  ('46000000-0000-0000-0000-000000000001',
   '45000000-0000-0000-0000-000000000001', 1, 'Artigo de teste', 'Conteúdo autoral de teste.',
   'public', '44000000-0000-0000-0000-000000000001'),
  ('46000000-0000-0000-0000-000000000002',
   '45000000-0000-0000-0000-000000000002', 1, 'Rascunho de teste', 'Rascunho privado.',
   'public', '44000000-0000-0000-0000-000000000001'),
  ('46000000-0000-0000-0000-000000000003',
   '45000000-0000-0000-0000-000000000003', 1, 'Aula de teste', 'Aula autoral de teste.',
   'public', '44000000-0000-0000-0000-000000000001');
insert into public.citations (content_version_id, source_section_id) values
  ('46000000-0000-0000-0000-000000000001', '47000000-0000-0000-0000-000000000001'),
  ('46000000-0000-0000-0000-000000000003', '47000000-0000-0000-0000-000000000001');
insert into private.editorial_memberships (user_id, role) values
  ('10000000-0000-0000-0000-000000000002', 'reviewer');
insert into public.editorial_reviews
  (content_version_id, reviewer_id, review_type, decision, rationale)
select version_id, '10000000-0000-0000-0000-000000000002', review_type,
  'approved', 'Fixture review; not an actual editorial approval.'
from unnest(array[
  '46000000-0000-0000-0000-000000000001'::uuid,
  '46000000-0000-0000-0000-000000000003'::uuid
]) version_id
cross join unnest(array['historical', 'pedagogical', 'rights']) review_type;

select lives_ok($$ update public.content_versions set status = 'published'
  where id = '46000000-0000-0000-0000-000000000001' $$,
  'an article publishes after verified rights, traceable citation and three reviews');
select throws_ok($$ update public.content_versions set body = 'Alteração após publicação'
  where id = '46000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'published editorial content is immutable');
select throws_ok($$ delete from public.citations
  where content_version_id = '46000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'published citations cannot disappear after review');

insert into public.courses (id, religion_id, code, title, status) values
  ('48000000-0000-0000-0000-000000000001',
   '41000000-0000-0000-0000-000000000001', 'foundation-test-course', 'Curso de teste', 'published');
insert into public.modules (id, course_id, title, learning_objective, sort_order, status) values
  ('49000000-0000-0000-0000-000000000001',
   '48000000-0000-0000-0000-000000000001', 'Módulo de teste', 'Validar estrutura', 0, 'published');
insert into public.lessons
  (id, module_id, content_item_id, sort_order, estimated_minutes) values
  ('4a000000-0000-0000-0000-000000000001',
   '49000000-0000-0000-0000-000000000001',
   '45000000-0000-0000-0000-000000000003', 0, 15);
select throws_ok($$ update public.content_versions set status = 'published'
  where id = '46000000-0000-0000-0000-000000000003' $$,
  '23514', 'A lesson requires four ordered steps',
  'lesson publication rejects a missing four-step structure');
insert into public.lesson_steps
  (id, lesson_id, content_item_id, content_version_id, step_type, position, estimated_minutes, body)
select step_id, '4a000000-0000-0000-0000-000000000001',
  '45000000-0000-0000-0000-000000000003', '46000000-0000-0000-0000-000000000003',
  step_type::public.lesson_step_type, position, minutes, 'Conteúdo de teste'
from (values
  ('4b000000-0000-0000-0000-000000000001'::uuid, 'preparation', 1, 0),
  ('4b000000-0000-0000-0000-000000000002'::uuid, 'visual_context', 2, 3),
  ('4b000000-0000-0000-0000-000000000003'::uuid, 'exegesis', 3, 7),
  ('4b000000-0000-0000-0000-000000000004'::uuid, 'soap_review', 4, 5)
) steps(step_id, step_type, position, minutes);
select throws_ok($$ update public.content_versions set status = 'published'
  where id = '46000000-0000-0000-0000-000000000003' $$,
  '23514', 'Exegesis requires all six lenses',
  'four lesson steps do not bypass the six-lens publication requirement');
insert into public.lesson_lenses (lesson_step_id, content_version_id, lens_type, body)
select '4b000000-0000-0000-0000-000000000003',
  '46000000-0000-0000-0000-000000000003', lens, 'Contexto de teste'
from unnest(enum_range(null::public.lens_type)) lens;
insert into public.soap_prompts
  (lesson_id, content_item_id, content_version_id, position, prompt, soap_sections)
select '4a000000-0000-0000-0000-000000000001',
  '45000000-0000-0000-0000-000000000003', '46000000-0000-0000-0000-000000000003',
  position, 'Pergunta de teste', sections
from (values
  (1, array['scripture', 'observation']),
  (2, array['application']),
  (3, array['prayer'])
) prompts(position, sections);
insert into public.quizzes (id, lesson_id, content_item_id, content_version_id, title) values
  ('4c000000-0000-0000-0000-000000000001',
   '4a000000-0000-0000-0000-000000000001', '45000000-0000-0000-0000-000000000003',
   '46000000-0000-0000-0000-000000000003', 'Revisão de teste');
insert into public.quiz_questions (id, quiz_id, content_version_id, position, prompt) values
  ('4d000000-0000-0000-0000-000000000001',
   '4c000000-0000-0000-0000-000000000001', '46000000-0000-0000-0000-000000000003',
   1, 'Pergunta de teste');
insert into public.quiz_options (id, question_id, content_version_id, position, label) values
  ('4e000000-0000-0000-0000-000000000001',
   '4d000000-0000-0000-0000-000000000001', '46000000-0000-0000-0000-000000000003', 1, 'Alternativa um'),
  ('4e000000-0000-0000-0000-000000000002',
   '4d000000-0000-0000-0000-000000000001', '46000000-0000-0000-0000-000000000003', 2, 'Alternativa dois');
insert into private.quiz_answer_keys (option_id, is_correct, explanation) values
  ('4e000000-0000-0000-0000-000000000001', true, 'Explicação de teste'),
  ('4e000000-0000-0000-0000-000000000002', false, 'Explicação de teste');
insert into public.media_assets
  (id, rights_grant_id, media_type, title, location, language_code,
   accessibility_description, display_mode, status) values
  ('4f000000-0000-0000-0000-000000000001', '44000000-0000-0000-0000-000000000001',
   'image', 'Imagem de teste', 'https://example.test/fixture-image', 'pt-BR',
   'Descrição de teste', 'link', 'published');
insert into public.lesson_assets
  (lesson_id, content_item_id, content_version_id, media_asset_id, sort_order) values
  ('4a000000-0000-0000-0000-000000000001', '45000000-0000-0000-0000-000000000003',
   '46000000-0000-0000-0000-000000000003', '4f000000-0000-0000-0000-000000000001', 0);
select lives_ok($$ update public.content_versions set status = 'published'
  where id = '46000000-0000-0000-0000-000000000003' $$,
  'a complete reviewed lesson can be published');
select throws_ok($$ update public.lesson_steps set body = 'Conteúdo alterado'
  where id = '4b000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'published lesson structure preserves the studied version');
select throws_ok($$ update private.quiz_answer_keys set is_correct = false
  where option_id = '4e000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'a published quiz answer key cannot change past evaluation criteria');
select throws_ok($$ delete from private.quiz_answer_keys
  where option_id = '4e000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'a published quiz cannot lose its reviewed answer key');

-- An administrative importer can carry an editor identity while previewing a
-- draft. Preview permission must never be mistaken for publication permission.
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-0000-0000-000000000002","role":"authenticated"}', true);
select ok(private.can_read_content('46000000-0000-0000-0000-000000000002'),
  'the reviewer fixture can preview the draft without publishing it');
select throws_ok($$ insert into public.content_chunks
  (content_version_id, rights_grant_id, position, text_content, content_sha256)
  values ('46000000-0000-0000-0000-000000000002',
    '44000000-0000-0000-0000-000000000001', 0, 'Rascunho de teste',
    encode(sha256(convert_to('Rascunho de teste', 'UTF8')), 'hex')) $$,
  '23514', 'Only published authorized content enters the search index',
  'reviewer preview authority cannot put an unpublished draft into the shared semantic index');
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claims', '{}', true);
select lives_ok($$ insert into public.content_chunks
  (id, content_version_id, rights_grant_id, position, text_content, content_sha256)
  values ('61000000-0000-0000-0000-000000000001',
    '46000000-0000-0000-0000-000000000001',
    '44000000-0000-0000-0000-000000000001', 0, 'Conteúdo autoral de teste.',
    encode(sha256(convert_to('Conteúdo autoral de teste.', 'UTF8')), 'hex')) $$,
  'published content with explicit AI and storage rights can enter the index');
select throws_ok($$ insert into public.content_chunks
  (content_version_id, rights_grant_id, position, text_content, content_sha256)
  values ('46000000-0000-0000-0000-000000000001',
    '44000000-0000-0000-0000-000000000001', 1, 'Conteúdo com hash incorreto', repeat('a', 64)) $$,
  '23514', null, 'the source chunk hash must match the actual stored text');
insert into public.embedding_models
  (id, provider, model_name, model_version, dimensions) values
  ('62000000-0000-0000-0000-000000000001', 'test-only', 'fixture-model', '1', 3);
select throws_ok($$ insert into public.content_embeddings
  (content_chunk_id, embedding_model_id, content_sha256, embedding)
  values ('61000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    encode(sha256(convert_to('Conteúdo autoral de teste.', 'UTF8')), 'hex'), '[0.1,0.2]') $$,
  '23514', null, 'vectors with a different dimension than their model are rejected');
select throws_ok($$ insert into public.content_embeddings
  (content_chunk_id, embedding_model_id, content_sha256, embedding)
  values ('61000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001', repeat('c', 64), '[0.1,0.2,0.3]') $$,
  '23514', null, 'embeddings cannot claim a different source content hash');
select lives_ok($$ insert into public.content_embeddings
  (content_chunk_id, embedding_model_id, content_sha256, embedding)
  values ('61000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    encode(sha256(convert_to('Conteúdo autoral de teste.', 'UTF8')), 'hex'), '[0.1,0.2,0.3]') $$,
  'compatible vectors preserve their source chunk and model identity');

insert into public.sacred_texts (id, code, name, is_published) values
  ('51000000-0000-0000-0000-000000000001', 'foundation-corpus-one', 'Corpus de teste um', true),
  ('51000000-0000-0000-0000-000000000002', 'foundation-corpus-two', 'Corpus de teste dois', true);
insert into public.canons (id, sacred_text_id, code, name, evidence_version_id) values
  ('52000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001',
   'foundation-canon-one', 'Cânone de teste', '46000000-0000-0000-0000-000000000001');
insert into public.versification_systems (id, code, name, documentation_url) values
  ('53000000-0000-0000-0000-000000000001', 'foundation-verse-system',
   'Sistema de teste', 'https://example.test/versification');
insert into public.text_editions
  (id, sacred_text_id, canon_id, source_version_id, rights_grant_id,
   versification_system_id, code, title, language_code, provider, status, access_class)
select edition_id, '51000000-0000-0000-0000-000000000001',
  '52000000-0000-0000-0000-000000000001', '43000000-0000-0000-0000-000000000001',
  '44000000-0000-0000-0000-000000000001', '53000000-0000-0000-0000-000000000001',
  edition_code, 'Edição de teste', 'pt-BR', 'test-only', 'draft', 'public'
from (values
  ('54000000-0000-0000-0000-000000000001'::uuid, 'foundation-edition-one'),
  ('54000000-0000-0000-0000-000000000002'::uuid, 'foundation-edition-two')
) editions(edition_id, edition_code);
insert into public.text_units
  (id, sacred_text_id, unit_type, stable_code, display_name, sort_order) values
  ('55000000-0000-0000-0000-000000000001', '51000000-0000-0000-0000-000000000001',
   'verse', 'fixture-1', 'Unidade um', 1),
  ('55000000-0000-0000-0000-000000000002', '51000000-0000-0000-0000-000000000002',
   'verse', 'fixture-1', 'Unidade de outro corpus', 1),
  ('55000000-0000-0000-0000-000000000003', '51000000-0000-0000-0000-000000000001',
   'verse', 'fixture-2', 'Unidade dois', 2);
insert into public.edition_units (id, edition_id, native_locator, sort_order, text_content) values
  ('56000000-0000-0000-0000-000000000001', '54000000-0000-0000-0000-000000000001',
   'fixture-1', 1, 'Segmento de teste um.'),
  ('56000000-0000-0000-0000-000000000002', '54000000-0000-0000-0000-000000000002',
   'fixture-1', 1, 'Segmento em outra edição.'),
  ('56000000-0000-0000-0000-000000000003', '54000000-0000-0000-0000-000000000001',
   'fixture-2', 2, 'Segmento de teste dois.'),
  ('56000000-0000-0000-0000-000000000004', '54000000-0000-0000-0000-000000000001',
   'fixture-merged', 3, 'Segmento de teste combinado.');
update public.text_editions set status = 'published'
where id in ('54000000-0000-0000-0000-000000000001', '54000000-0000-0000-0000-000000000002');
select throws_ok($$ update public.edition_units set text_content = 'Alteração silenciosa'
  where id = '56000000-0000-0000-0000-000000000001' $$,
  '23514', null, 'published text segments cannot change under existing references');
select throws_ok($$ insert into public.passage_references
  (edition_id, start_unit_id, end_unit_id, display_reference) values
  ('54000000-0000-0000-0000-000000000001',
   '56000000-0000-0000-0000-000000000001', '56000000-0000-0000-0000-000000000002', 'Inválido') $$,
  '23503', null, 'a passage cannot silently mix segments from different editions');
select throws_ok($$ insert into public.passage_references
  (edition_id, start_unit_id, end_unit_id, display_reference) values
  ('54000000-0000-0000-0000-000000000001',
   '56000000-0000-0000-0000-000000000003', '56000000-0000-0000-0000-000000000001', 'Invertido') $$,
  '23514', null, 'a passage cannot end before its starting segment');
select lives_ok($$ insert into public.passage_references
  (edition_id, start_unit_id, end_unit_id, display_reference) values
  ('54000000-0000-0000-0000-000000000001',
   '56000000-0000-0000-0000-000000000001', '56000000-0000-0000-0000-000000000003', 'Intervalo de teste') $$,
  'a correctly ordered passage preserves one exact edition');
select throws_ok($$ insert into public.edition_unit_mappings
  (edition_unit_id, text_unit_id, mapping_type, evidence_version_id) values
  ('56000000-0000-0000-0000-000000000001', '55000000-0000-0000-0000-000000000002',
   'exact', '46000000-0000-0000-0000-000000000001') $$,
  '23514', null, 'edition mappings cannot cross unrelated corpora');
select lives_ok($$ insert into public.edition_unit_mappings
  (edition_unit_id, text_unit_id, mapping_type, evidence_version_id) values
  ('56000000-0000-0000-0000-000000000004', '55000000-0000-0000-0000-000000000001',
   'merged', '46000000-0000-0000-0000-000000000001'),
  ('56000000-0000-0000-0000-000000000004', '55000000-0000-0000-0000-000000000003',
   'merged', '46000000-0000-0000-0000-000000000001') $$,
  'one edition segment can map to several source units without forcing 1-to-1 versification');
select throws_ok($$ insert into public.canon_members
  (canon_id, text_unit_id, sacred_text_id, sort_order, evidence_version_id) values
  ('52000000-0000-0000-0000-000000000001', '55000000-0000-0000-0000-000000000002',
   '51000000-0000-0000-0000-000000000001', 1, '46000000-0000-0000-0000-000000000001') $$,
  '23503', null, 'canon membership cannot claim a unit from another corpus');

set local role anon;
select is((select count(*) from public.profiles), 0::bigint,
  'anonymous sessions cannot read any learner profile');
select is((select count(*) from public.encrypted_notes), 0::bigint,
  'anonymous sessions cannot read encrypted personal notes');
select is((select count(*) from public.content_versions
  where id = '46000000-0000-0000-0000-000000000001'), 1::bigint,
  'an anonymous reader can retrieve an authorized published article');
select is((select count(*) from public.content_versions
  where id = '46000000-0000-0000-0000-000000000002'), 0::bigint,
  'draft content stays hidden even when its intended access class is public');
select is((select count(*) from public.content_embeddings
  where content_chunk_id = '61000000-0000-0000-0000-000000000001'), 1::bigint,
  'authorized published search data remains readable through its parent policies');
select throws_ok($$ select * from private.quiz_answer_keys $$,
  '42501', null, 'quiz answer keys are not exposed with the public questions');
reset role;

update public.rights_grants set status = 'rejected'
where id = '44000000-0000-0000-0000-000000000001';
set local role anon;
select is((select count(*) from public.content_versions
  where id = '46000000-0000-0000-0000-000000000001'), 0::bigint,
  'withdrawing rights immediately removes content from public API reads');
select is((select count(*) from public.content_embeddings
  where content_chunk_id = '61000000-0000-0000-0000-000000000001'), 0::bigint,
  'withdrawn rights also hide dependent semantic search data');

reset role;
select * from finish();
rollback;
