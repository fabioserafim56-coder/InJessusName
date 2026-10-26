-- InJessusName: foundation only. No Bible translation or institutional text is imported.
-- Administrative/editorial writes use a trusted server role, never a browser secret key.
begin;

create schema if not exists extensions;
create extension if not exists vector with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated, service_role;
revoke create on schema public from public;
grant usage on schema public to anon, authenticated, service_role;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema private revoke all on tables from public, anon, authenticated;
alter default privileges in schema private revoke execute on functions from public;

create type public.age_band as enum ('6_9','10_12','13_17','18_plus');
create type public.baptism_status as enum ('not_informed','not_baptized','baptized');
create type public.learning_goal as enum ('bible_foundations','christian_service','theology_history');
create type public.editorial_status as enum ('draft','in_review','published','withdrawn');
create type public.access_class as enum ('public','restricted','internal');
create type public.verification_status as enum ('unverified','pending','verified','rejected');
create type public.lesson_step_type as enum ('preparation','visual_context','exegesis','soap_review');
create type public.lens_type as enum ('literary','spatial','historical','cultural','biblical','practical');

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) between 1 and 100),
  locale text not null default 'pt-BR',
  accessibility_preferences jsonb not null default '{}' check (jsonb_typeof(accessibility_preferences)='object'),
  created_at timestamptz not null default now()
);
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  author_or_institution text not null,
  primary_url text,
  source_type text not null check (source_type in ('institutional','historical','scripture','lexicon','academic','original','media')),
  access_class public.access_class not null default 'internal',
  created_at timestamptz not null default now()
);
create table public.source_versions (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id),
  edition_label text not null,
  published_at date,
  consulted_at timestamptz,
  effective_from date,
  effective_until date,
  supersedes_id uuid references public.source_versions(id),
  verification_status public.verification_status not null default 'unverified',
  authorized_artifact_sha256 text check (authorized_artifact_sha256 ~ '^[a-f0-9]{64}$'),
  unique (source_id,edition_label),
  unique (id,source_id),
  foreign key (supersedes_id,source_id) references public.source_versions(id,source_id),
  check (effective_until is null or effective_from is null or effective_until >= effective_from),
  check (supersedes_id is distinct from id)
);
create table public.rights_grants (
  id uuid primary key default gen_random_uuid(),
  source_version_id uuid not null references public.source_versions(id),
  rights_holder text not null,
  license_name text not null,
  evidence_url text,
  attribution text not null default '',
  status public.verification_status not null default 'unverified',
  can_display boolean not null default false,
  can_store boolean not null default false,
  can_cache boolean not null default false,
  can_offline boolean not null default false,
  can_redistribute boolean not null default false,
  can_commercial boolean not null default false,
  can_ai boolean not null default false,
  territory text not null default 'unspecified',
  valid_from timestamptz not null default now(),
  expires_at timestamptz,
  unique (id,source_version_id),
  check (expires_at is null or expires_at > valid_from),
  check (status <> 'verified' or length(trim(coalesce(evidence_url,''))) > 0)
);
create table public.religions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[a-z][a-z0-9_-]*$'),
  name text not null,
  is_published boolean not null default false
);
create table public.traditions (
  id uuid primary key default gen_random_uuid(),
  religion_id uuid not null references public.religions(id),
  code text not null unique,
  name text not null,
  description text not null default '',
  is_published boolean not null default false,
  unique (id,religion_id)
);
create table private.editorial_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  role text not null check (role in ('reviewer','editor','admin')),
  tradition_id uuid references public.traditions(id),
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  check (expires_at is null or expires_at > granted_at)
);
create index editorial_memberships_user_idx on private.editorial_memberships(user_id);
alter table private.editorial_memberships enable row level security;
-- A known-minor safety flag survives deletion/recreation of the public profile.
-- Initial age is still self-declared; verification procedures are a later service.
create table private.learner_safeguards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  known_minor boolean not null default true,
  adult_verified_at timestamptz,
  adult_verified_by uuid references auth.users(id),
  check ((adult_verified_at is null)=(adult_verified_by is null)),
  check (adult_verified_by is distinct from user_id)
);
alter table private.learner_safeguards enable row level security;

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('lesson','doctrine','practice','historical_document','article','assertion')),
  code text not null unique,
  religion_id uuid not null references public.religions(id),
  tradition_id uuid,
  foreign key (tradition_id,religion_id) references public.traditions(id,religion_id),
  created_at timestamptz not null default now()
);
create table public.content_versions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id),
  version_number integer not null check (version_number > 0),
  title text not null,
  body text not null default '',
  status public.editorial_status not null default 'draft',
  access_class public.access_class not null default 'internal',
  rights_grant_id uuid references public.rights_grants(id),
  effective_from date,
  effective_until date,
  created_at timestamptz not null default now(),
  published_at timestamptz,
  unique (content_item_id,version_number),
  unique (id,content_item_id),
  check (effective_until is null or effective_from is null or effective_until >= effective_from),
  check (status <> 'published' or (rights_grant_id is not null and published_at is not null))
);
create table public.tradition_relations (
  id uuid primary key default gen_random_uuid(),
  origin_id uuid not null,
  destination_id uuid not null,
  religion_id uuid not null,
  relation_type text not null check (relation_type in ('historical_origin','related','hierarchical')),
  evidence_version_id uuid not null references public.content_versions(id),
  foreign key (origin_id,religion_id) references public.traditions(id,religion_id),
  foreign key (destination_id,religion_id) references public.traditions(id,religion_id),
  unique (origin_id,destination_id,relation_type),
  check (origin_id <> destination_id)
);
create table public.doctrines (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null unique references public.content_items(id),
  code text not null unique
);
create table public.practices (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null unique references public.content_items(id),
  code text not null unique
);
create table public.tradition_doctrines (
  tradition_id uuid not null references public.traditions(id),
  doctrine_id uuid not null references public.doctrines(id),
  qualification text not null default '',
  evidence_version_id uuid not null references public.content_versions(id),
  effective_from date,
  effective_until date,
  primary key (tradition_id,doctrine_id,evidence_version_id),
  check (effective_until is null or effective_from is null or effective_until >= effective_from)
);
create table public.tradition_practices (
  tradition_id uuid not null references public.traditions(id),
  practice_id uuid not null references public.practices(id),
  qualification text not null default '',
  evidence_version_id uuid not null references public.content_versions(id),
  effective_from date,
  effective_until date,
  primary key (tradition_id,practice_id,evidence_version_id),
  check (effective_until is null or effective_from is null or effective_until >= effective_from)
);
create table public.doctrine_practices (
  doctrine_id uuid not null references public.doctrines(id),
  practice_id uuid not null references public.practices(id),
  evidence_version_id uuid not null references public.content_versions(id),
  primary key (doctrine_id,practice_id,evidence_version_id)
);
create table public.sacred_texts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_published boolean not null default false
);
create table public.religion_sacred_texts (
  religion_id uuid not null references public.religions(id),
  sacred_text_id uuid not null references public.sacred_texts(id),
  primary key (religion_id,sacred_text_id)
);
create table public.text_units (
  id uuid primary key default gen_random_uuid(),
  sacred_text_id uuid not null references public.sacred_texts(id),
  parent_id uuid,
  unit_type text not null check (unit_type in ('book','chapter','verse','section','other')),
  stable_code text not null,
  display_name text not null,
  sort_order integer not null check (sort_order >= 0),
  unique (sacred_text_id,stable_code),
  unique (id,sacred_text_id),
  foreign key (parent_id,sacred_text_id) references public.text_units(id,sacred_text_id),
  check (parent_id is distinct from id)
);
create table public.canons (
  id uuid primary key default gen_random_uuid(),
  sacred_text_id uuid not null references public.sacred_texts(id),
  code text not null unique,
  name text not null,
  evidence_version_id uuid not null references public.content_versions(id),
  unique (id,sacred_text_id)
);
create table public.canon_members (
  canon_id uuid not null,
  text_unit_id uuid not null,
  sacred_text_id uuid not null,
  sort_order integer not null check (sort_order >= 0),
  evidence_version_id uuid not null references public.content_versions(id),
  primary key (canon_id,text_unit_id),
  unique (canon_id,sort_order),
  foreign key (canon_id,sacred_text_id) references public.canons(id,sacred_text_id),
  foreign key (text_unit_id,sacred_text_id) references public.text_units(id,sacred_text_id)
);
create table public.tradition_canons (
  tradition_id uuid not null references public.traditions(id),
  canon_id uuid not null references public.canons(id),
  evidence_version_id uuid not null references public.content_versions(id),
  primary key (tradition_id,canon_id,evidence_version_id)
);
create table public.versification_systems (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  documentation_url text not null
);
create table public.text_editions (
  id uuid primary key default gen_random_uuid(),
  sacred_text_id uuid not null references public.sacred_texts(id),
  canon_id uuid not null,
  source_version_id uuid not null references public.source_versions(id),
  rights_grant_id uuid not null,
  versification_system_id uuid not null references public.versification_systems(id),
  code text not null unique,
  title text not null,
  language_code text not null,
  provider text not null,
  status public.editorial_status not null default 'draft',
  access_class public.access_class not null default 'internal',
  unique (id,sacred_text_id),
  foreign key (canon_id,sacred_text_id) references public.canons(id,sacred_text_id),
  foreign key (rights_grant_id,source_version_id) references public.rights_grants(id,source_version_id)
);
create table public.edition_units (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.text_editions(id),
  native_locator text not null,
  sort_order integer not null check (sort_order >= 0),
  text_content text not null,
  unique (edition_id,native_locator),
  unique (edition_id,sort_order),
  unique (id,edition_id)
);
create table public.edition_unit_mappings (
  edition_unit_id uuid not null references public.edition_units(id),
  text_unit_id uuid not null references public.text_units(id),
  mapping_type text not null check (mapping_type in ('exact','split','merged','approximate')),
  evidence_version_id uuid not null references public.content_versions(id),
  primary key (edition_unit_id,text_unit_id)
);
create table public.unit_alignments (
  origin_unit_id uuid not null references public.edition_units(id),
  destination_unit_id uuid not null references public.edition_units(id),
  alignment_group uuid not null default gen_random_uuid(),
  relation_type text not null check (relation_type in ('exact','split','merged','approximate')),
  evidence_version_id uuid not null references public.content_versions(id),
  primary key (origin_unit_id,destination_unit_id),
  check (origin_unit_id <> destination_unit_id)
);
create table public.passage_references (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.text_editions(id),
  start_unit_id uuid not null,
  end_unit_id uuid not null,
  display_reference text not null,
  foreign key (start_unit_id,edition_id) references public.edition_units(id,edition_id),
  foreign key (end_unit_id,edition_id) references public.edition_units(id,edition_id),
  unique (edition_id,start_unit_id,end_unit_id)
);
create table public.cross_references (
  id uuid primary key default gen_random_uuid(),
  origin_passage_id uuid not null references public.passage_references(id),
  destination_passage_id uuid not null references public.passage_references(id),
  relation_type text not null,
  rights_grant_id uuid not null references public.rights_grants(id),
  evidence_version_id uuid not null references public.content_versions(id),
  check (origin_passage_id <> destination_passage_id),
  unique (origin_passage_id,destination_passage_id,relation_type)
);
create table public.source_sections (
  id uuid primary key default gen_random_uuid(),
  source_version_id uuid not null references public.source_versions(id),
  locator text not null,
  authorized_excerpt text,
  rights_grant_id uuid,
  foreign key (rights_grant_id,source_version_id) references public.rights_grants(id,source_version_id),
  unique (source_version_id,locator),
  check (authorized_excerpt is null or rights_grant_id is not null)
);
create table public.citations (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid not null references public.content_versions(id),
  source_section_id uuid references public.source_sections(id),
  passage_reference_id uuid references public.passage_references(id),
  explanation text not null default '',
  check (num_nonnulls(source_section_id,passage_reference_id)=1)
);
create table public.historical_documents (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null unique references public.content_items(id),
  source_version_id uuid not null references public.source_versions(id),
  institution text not null,
  document_number text,
  document_type text not null,
  description text not null default ''
);
create table public.editorial_reviews (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid not null references public.content_versions(id),
  reviewer_id uuid not null references public.profiles(user_id),
  review_type text not null check (review_type in ('historical','confessional','pedagogical','rights')),
  decision text not null check (decision in ('approved','changes_requested','rejected')),
  rationale text not null,
  reviewed_at timestamptz not null default now(),
  unique (content_version_id,review_type,reviewer_id)
);
create table public.correction_events (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid not null references public.content_versions(id),
  replacement_version_id uuid references public.content_versions(id),
  actor_id uuid not null references public.profiles(user_id),
  reason text not null,
  created_at timestamptz not null default now(),
  check (replacement_version_id is distinct from content_version_id)
);
create table public.learning_tracks (
  id uuid primary key default gen_random_uuid(),
  religion_id uuid not null references public.religions(id),
  code text not null unique,
  title text not null,
  description text not null default '',
  status public.editorial_status not null default 'draft',
  unique (id,religion_id)
);
create table public.track_audiences (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null,
  religion_id uuid not null,
  tradition_id uuid,
  age_band public.age_band,
  baptism_status public.baptism_status,
  learning_goal public.learning_goal,
  priority integer not null default 0,
  foreign key (track_id,religion_id) references public.learning_tracks(id,religion_id),
  foreign key (tradition_id,religion_id) references public.traditions(id,religion_id)
);
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  religion_id uuid not null references public.religions(id),
  code text not null unique,
  title text not null,
  description text not null default '',
  status public.editorial_status not null default 'draft',
  unique (id,religion_id)
);
create table public.track_courses (
  track_id uuid not null,
  course_id uuid not null,
  religion_id uuid not null,
  sort_order integer not null check (sort_order >= 0),
  primary key (track_id,course_id),
  unique (track_id,sort_order),
  foreign key (track_id,religion_id) references public.learning_tracks(id,religion_id),
  foreign key (course_id,religion_id) references public.courses(id,religion_id)
);
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id),
  title text not null,
  learning_objective text not null,
  sort_order integer not null check (sort_order >= 0),
  status public.editorial_status not null default 'draft',
  unique (course_id,sort_order)
);
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id),
  content_item_id uuid not null unique references public.content_items(id),
  sort_order integer not null check (sort_order >= 0),
  estimated_minutes integer not null check (estimated_minutes between 15 and 20),
  unique (module_id,sort_order),
  unique (id,content_item_id)
);
create table public.lesson_steps (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null,
  content_item_id uuid not null,
  content_version_id uuid not null,
  step_type public.lesson_step_type not null,
  position integer not null,
  estimated_minutes integer not null check (estimated_minutes >= 0),
  body text not null,
  foreign key (lesson_id,content_item_id) references public.lessons(id,content_item_id),
  foreign key (content_version_id,content_item_id) references public.content_versions(id,content_item_id),
  unique (content_version_id,step_type),
  unique (content_version_id,position),
  unique (id,content_version_id),
  check ((step_type='preparation' and position=1) or (step_type='visual_context' and position=2) or (step_type='exegesis' and position=3) or (step_type='soap_review' and position=4))
);
create table public.lesson_lenses (
  id uuid primary key default gen_random_uuid(),
  lesson_step_id uuid not null,
  content_version_id uuid not null,
  lens_type public.lens_type not null,
  body text not null,
  foreign key (lesson_step_id,content_version_id) references public.lesson_steps(id,content_version_id),
  unique (lesson_step_id,lens_type)
);
create table public.soap_prompts (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null,
  content_item_id uuid not null,
  content_version_id uuid not null,
  position integer not null check (position between 1 and 3),
  prompt text not null,
  soap_sections text[] not null check (cardinality(soap_sections) > 0 and soap_sections <@ array['scripture','observation','application','prayer']),
  foreign key (lesson_id,content_item_id) references public.lessons(id,content_item_id),
  foreign key (content_version_id,content_item_id) references public.content_versions(id,content_item_id),
  unique (content_version_id,position)
);
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  rights_grant_id uuid not null references public.rights_grants(id),
  media_type text not null check (media_type in ('image','video','audio','map','pdf')),
  title text not null,
  location text not null,
  language_code text not null,
  accessibility_description text not null,
  display_mode text not null check (display_mode in ('link','embed','hosted')),
  status public.editorial_status not null default 'draft'
);
create table public.lesson_assets (
  lesson_id uuid not null,
  content_item_id uuid not null,
  content_version_id uuid not null,
  media_asset_id uuid not null references public.media_assets(id),
  sort_order integer not null check (sort_order >= 0),
  foreign key (lesson_id,content_item_id) references public.lessons(id,content_item_id),
  foreign key (content_version_id,content_item_id) references public.content_versions(id,content_item_id),
  primary key (content_version_id,media_asset_id)
);
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null,
  content_item_id uuid not null,
  content_version_id uuid not null,
  title text not null,
  foreign key (lesson_id,content_item_id) references public.lessons(id,content_item_id),
  foreign key (content_version_id,content_item_id) references public.content_versions(id,content_item_id),
  unique (id,content_version_id)
);
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null,
  content_version_id uuid not null,
  position integer not null check (position > 0),
  prompt text not null,
  foreign key (quiz_id,content_version_id) references public.quizzes(id,content_version_id),
  unique (quiz_id,position),
  unique (id,quiz_id),
  unique (id,content_version_id)
);
create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null,
  content_version_id uuid not null,
  position integer not null check (position > 0),
  label text not null,
  foreign key (question_id,content_version_id) references public.quiz_questions(id,content_version_id),
  unique (question_id,position),
  unique (id,question_id)
);
create table private.quiz_answer_keys (
  option_id uuid primary key references public.quiz_options(id),
  is_correct boolean not null,
  explanation text not null
);
alter table private.quiz_answer_keys enable row level security;

create table public.learning_profiles (
  user_id uuid primary key references public.profiles(user_id) on delete cascade,
  age_band public.age_band not null,
  tradition_id uuid references public.traditions(id),
  baptism_status public.baptism_status not null default 'not_informed',
  learning_goal public.learning_goal not null default 'bible_foundations',
  interview_version integer not null default 1 check (interview_version > 0),
  updated_at timestamptz not null default now()
);
create table public.consent_records (
  id uuid primary key default gen_random_uuid(),
  event_sequence bigint generated always as identity unique,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  recorded_by uuid not null default auth.uid() references public.profiles(user_id),
  purpose text not null,
  notice_version text not null,
  decision text not null check (decision in ('granted','revoked')),
  legal_basis text not null check (legal_basis='consent'),
  occurred_at timestamptz not null default now()
);
create index consent_records_latest_idx on public.consent_records(user_id,purpose,event_sequence desc);
create table public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  guardian_user_id uuid not null references public.profiles(user_id) on delete cascade,
  learner_user_id uuid not null references public.profiles(user_id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','verified','revoked')),
  verified_at timestamptz,
  verified_by uuid references public.profiles(user_id),
  revoked_at timestamptz,
  unique (guardian_user_id,learner_user_id),
  check (guardian_user_id<>learner_user_id),
  check (status<>'verified' or (verified_at is not null and verified_by is not null
    and verified_by<>guardian_user_id and verified_by<>learner_user_id and revoked_at is null))
);
create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  request_type text not null check (request_type in ('access','export','delete','correct','revoke')),
  status text not null default 'requested' check (status in ('requested','processing','completed','declined')),
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  track_id uuid not null references public.learning_tracks(id),
  status text not null default 'active' check (status in ('active','paused','completed')),
  created_at timestamptz not null default now(),
  unique (user_id,track_id)
);
create table public.lesson_progress (
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  lesson_id uuid not null,
  content_item_id uuid not null,
  content_version_id uuid not null,
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  foreign key (lesson_id,content_item_id) references public.lessons(id,content_item_id),
  foreign key (content_version_id,content_item_id) references public.content_versions(id,content_item_id),
  primary key (user_id,lesson_id,content_version_id),
  check (completed_at is null or progress_percent=100)
);
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score_percent numeric(5,2) check (score_percent between 0 and 100),
  unique (id,user_id,quiz_id)
);
create table public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null,
  user_id uuid not null,
  quiz_id uuid not null,
  question_id uuid not null,
  selected_option_id uuid not null,
  foreign key (attempt_id,user_id,quiz_id) references public.quiz_attempts(id,user_id,quiz_id) on delete cascade,
  foreign key (question_id,quiz_id) references public.quiz_questions(id,quiz_id),
  foreign key (selected_option_id,question_id) references public.quiz_options(id,question_id),
  unique (attempt_id,question_id)
);
create table public.note_vaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(user_id) on delete cascade,
  protocol_version text not null,
  created_at timestamptz not null default now(),
  unique (id,user_id)
);
create table public.encrypted_key_envelopes (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null,
  user_id uuid not null,
  recipient_type text not null check (recipient_type in ('device','recovery')),
  recipient_id text not null,
  wrapped_key bytea not null check (octet_length(wrapped_key)>=32),
  kdf_parameters jsonb not null default '{}' check (jsonb_typeof(kdf_parameters)='object'),
  key_version integer not null default 1 check (key_version>0),
  created_at timestamptz not null default now(),
  foreign key (vault_id,user_id) references public.note_vaults(id,user_id) on delete cascade,
  unique (vault_id,recipient_type,recipient_id,key_version)
);
create table public.encrypted_notes (
  id uuid primary key default gen_random_uuid(),
  vault_id uuid not null,
  user_id uuid not null,
  ciphertext bytea not null check (octet_length(ciphertext)>=16),
  nonce bytea not null check (octet_length(nonce)>=12),
  key_version integer not null default 1 check (key_version>0),
  sync_version integer not null default 1 check (sync_version>0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (vault_id,user_id) references public.note_vaults(id,user_id) on delete cascade,
  unique (vault_id,key_version,nonce)
);
comment on table public.encrypted_notes is 'Ciphertext storage only. Client E2EE protocol, recovery and security review are not implemented by this schema.';

create table public.lexicon_entries (
  id uuid primary key default gen_random_uuid(),
  rights_grant_id uuid not null references public.rights_grants(id),
  language_code text not null,
  lemma text not null,
  strong_identifier text,
  morphology jsonb not null default '{}',
  glosses jsonb not null default '{}',
  status public.editorial_status not null default 'draft'
);
create table public.word_occurrences (
  id uuid primary key default gen_random_uuid(),
  edition_unit_id uuid not null references public.edition_units(id),
  lexicon_entry_id uuid not null references public.lexicon_entries(id),
  token_position integer not null check (token_position>0),
  original_form text not null,
  portuguese_transliteration text,
  transliteration_method text,
  analysis jsonb not null default '{}',
  unique (edition_unit_id,token_position),
  check (portuguese_transliteration is null or transliteration_method is not null)
);
create table public.embedding_models (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model_name text not null,
  model_version text not null,
  dimensions integer not null check (dimensions between 1 and 16000),
  configuration jsonb not null default '{}',
  unique (provider,model_name,model_version)
);
create table public.content_chunks (
  id uuid primary key default gen_random_uuid(),
  content_version_id uuid references public.content_versions(id),
  edition_unit_id uuid references public.edition_units(id),
  rights_grant_id uuid not null references public.rights_grants(id),
  position integer not null check (position>=0),
  text_content text not null,
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  check (num_nonnulls(content_version_id,edition_unit_id)=1),
  check (content_sha256=encode(sha256(convert_to(text_content,'UTF8')),'hex'))
);
create table public.content_embeddings (
  id uuid primary key default gen_random_uuid(),
  content_chunk_id uuid not null references public.content_chunks(id) on delete cascade,
  embedding_model_id uuid not null references public.embedding_models(id),
  content_sha256 text not null check (content_sha256 ~ '^[a-f0-9]{64}$'),
  embedding extensions.vector not null,
  created_at timestamptz not null default now(),
  unique (content_chunk_id,embedding_model_id)
);
-- Variable dimensions permit model changes; create a model-specific partial expression
-- index on embedding::vector(N) only after selecting and validating that model.

-- Helpers are outside exposed schemas, return bounded authorization decisions and
-- have a fixed search_path. No function returns another user's private payload.
create function private.is_editor(target_tradition uuid default null) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.editorial_memberships m
    where m.user_id=(select auth.uid()) and m.role in ('editor','admin','reviewer')
      and m.revoked_at is null and (m.expires_at is null or m.expires_at>now())
      and (m.tradition_id is null or m.tradition_id=target_tradition));
$$;
create function private.source_is_public(version_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.source_versions v join public.sources s on s.id=v.source_id
    where v.id=version_id and v.verification_status='verified' and s.access_class='public');
$$;
create function private.rights_allow(grant_id uuid, operation text default 'display') returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.rights_grants r
    where r.id=grant_id and r.status='verified' and r.valid_from<=now()
      and (r.expires_at is null or r.expires_at>now())
      and private.source_is_public(r.source_version_id)
      and case operation when 'display' then r.can_display when 'store' then r.can_store
        when 'cache' then r.can_cache when 'offline' then r.can_offline
        when 'redistribute' then r.can_redistribute when 'commercial' then r.can_commercial
        when 'ai' then r.can_ai else false end);
$$;
create function private.can_read_content(version_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.content_versions v join public.content_items i on i.id=v.content_item_id
    join public.religions r on r.id=i.religion_id
    where v.id=version_id and (private.is_editor(i.tradition_id) or
      (r.is_published and v.status='published' and v.access_class='public'
        and private.rights_allow(v.rights_grant_id,'display') and private.rights_allow(v.rights_grant_id,'store')
        and (v.effective_from is null or v.effective_from<=current_date)
        and (v.effective_until is null or v.effective_until>=current_date))));
$$;
create function private.can_read_item(item_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.content_versions v where v.content_item_id=item_id and private.can_read_content(v.id));
$$;
create function private.can_read_edition(edition_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.text_editions e join public.sacred_texts t on t.id=e.sacred_text_id
    where e.id=edition_id and t.is_published and e.status='published' and e.access_class='public'
      and private.rights_allow(e.rights_grant_id,'display') and private.rights_allow(e.rights_grant_id,'store'));
$$;
create function private.can_read_unit(unit_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.edition_units u where u.id=unit_id and private.can_read_edition(u.edition_id));
$$;
create function private.can_read_passage(passage_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.passage_references p where p.id=passage_id and private.can_read_edition(p.edition_id));
$$;
create function private.is_verified_guardian(guardian_id uuid, learner_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.guardian_links g where g.guardian_user_id=guardian_id
    and g.learner_user_id=learner_id and g.status='verified' and g.revoked_at is null);
$$;
create function private.has_sensitive_consent(learner_id uuid, learner_age public.age_band) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select c.decision='granted' and
    (case when learner_age='18_plus' then c.recorded_by=learner_id and not exists
      (select 1 from private.learner_safeguards s where s.user_id=learner_id
        and s.known_minor and s.adult_verified_at is null)
      else private.is_verified_guardian(c.recorded_by,learner_id) end)
    from public.consent_records c where c.user_id=learner_id and c.purpose='religious_personalization'
    order by c.event_sequence desc limit 1),false);
$$;

create function private.validate_content_publication() returns trigger
language plpgsql security definer set search_path = '' as $$
declare item public.content_items; exegesis_id uuid; section_count integer;
begin
  if tg_op='UPDATE' and old.status in ('published','withdrawn') then
    if old.status='published' and new.status='withdrawn'
      and (to_jsonb(new)-'status')=(to_jsonb(old)-'status') then return new; end if;
    raise exception 'Published content is immutable; create a new version' using errcode='23514';
  end if;
  if new.status<>'published' then return new; end if;
  if tg_op='INSERT' then
    raise exception 'Create a draft before publication' using errcode='23514';
  end if;
  select * into item from public.content_items where id=new.content_item_id;
  if not private.rights_allow(new.rights_grant_id,'display') or not private.rights_allow(new.rights_grant_id,'store') then
    raise exception 'Publication requires verified display and storage rights' using errcode='23514';
  end if;
  if not exists(select 1 from public.citations c where c.content_version_id=new.id) then
    raise exception 'Publication requires a traceable citation' using errcode='23514';
  end if;
  if exists(select 1 from public.citations c left join public.source_sections s on s.id=c.source_section_id
    where c.content_version_id=new.id and
      ((c.source_section_id is not null and not private.source_is_public(s.source_version_id))
      or (c.passage_reference_id is not null and not private.can_read_passage(c.passage_reference_id)))) then
    raise exception 'Publication citations must resolve to verified public sources' using errcode='23514';
  end if;
  if exists(select 1 from (values ('historical'),('pedagogical'),('rights')) required(kind)
    where not exists(select 1 from public.editorial_reviews r
      join private.editorial_memberships m on m.user_id=r.reviewer_id
      where r.content_version_id=new.id and r.review_type=required.kind and r.decision='approved'
        and m.revoked_at is null and (m.expires_at is null or m.expires_at>now())
        and (m.tradition_id is null or m.tradition_id=item.tradition_id))) then
    raise exception 'Publication requires historical, pedagogical and rights reviews' using errcode='23514';
  end if;
  if item.tradition_id is not null and not exists(select 1 from public.editorial_reviews r
    join private.editorial_memberships m on m.user_id=r.reviewer_id
    where r.content_version_id=new.id and r.review_type='confessional' and r.decision='approved'
      and m.revoked_at is null and (m.expires_at is null or m.expires_at>now())
      and (m.tradition_id is null or m.tradition_id=item.tradition_id)) then
    raise exception 'Confessional content requires an authorized confessional review' using errcode='23514';
  end if;
  if item.kind='lesson' then
    if not exists(select 1 from public.lessons l where l.content_item_id=item.id) then
      raise exception 'Lesson identity is missing' using errcode='23514';
    end if;
    if (select count(*) from public.lesson_steps s where s.content_version_id=new.id)<>4 then
      raise exception 'A lesson requires four ordered steps' using errcode='23514';
    end if;
    select id into exegesis_id from public.lesson_steps where content_version_id=new.id and step_type='exegesis';
    if (select count(*) from public.lesson_lenses where lesson_step_id=exegesis_id)<>6 then
      raise exception 'Exegesis requires all six lenses' using errcode='23514';
    end if;
    if (select count(*) from public.soap_prompts where content_version_id=new.id)<>3 then
      raise exception 'A lesson requires three SOAP prompts' using errcode='23514';
    end if;
    select count(distinct section) into section_count from public.soap_prompts p
      cross join lateral unnest(p.soap_sections) section where p.content_version_id=new.id;
    if section_count<>4 then raise exception 'SOAP prompts must cover all four sections' using errcode='23514'; end if;
    if not exists(select 1 from public.quizzes where content_version_id=new.id)
      or exists(select 1 from public.quizzes q where q.content_version_id=new.id
        and not exists(select 1 from public.quiz_questions x where x.quiz_id=q.id)) then
      raise exception 'A lesson requires a review quiz with questions' using errcode='23514';
    end if;
    if exists(select 1 from public.quiz_questions q where q.content_version_id=new.id and
      ((select count(*) from public.quiz_options o where o.question_id=q.id)<2 or
       (select count(*) from public.quiz_options o join private.quiz_answer_keys k on k.option_id=o.id
         where o.question_id=q.id and k.is_correct)<>1)) then
      raise exception 'Each quiz question requires options and one answer key' using errcode='23514';
    end if;
    if not exists(select 1 from public.lesson_assets where content_version_id=new.id) then
      raise exception 'A lesson requires authorized visual material or a summary asset' using errcode='23514';
    end if;
    if exists(select 1 from public.lesson_assets a join public.media_assets m on m.id=a.media_asset_id
      where a.content_version_id=new.id and (m.status<>'published' or not private.rights_allow(m.rights_grant_id,'display'))) then
      raise exception 'Lesson assets must be published with verified rights' using errcode='23514';
    end if;
  end if;
  new.published_at := coalesce(new.published_at,now());
  return new;
end;
$$;
create trigger content_publication_guard before insert or update on public.content_versions
for each row execute function private.validate_content_publication();

create function private.preserve_minor_safeguards() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.age_band<>'18_plus' then
    insert into private.learner_safeguards(user_id,known_minor) values(new.user_id,true)
      on conflict (user_id) do update set known_minor=true;
  end if;
  return new;
end;
$$;
create trigger learner_safety_guard before insert or update on public.learning_profiles
for each row execute function private.preserve_minor_safeguards();

create function private.guard_published_children() returns trigger
language plpgsql security definer set search_path = '' as $$
declare version_id uuid;
begin
  version_id := (case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end ->>'content_version_id')::uuid;
  if exists(select 1 from public.content_versions v where v.id=version_id and v.status in ('published','withdrawn'))
    or (tg_op='UPDATE' and exists(select 1 from public.content_versions v
      where v.id=(to_jsonb(old)->>'content_version_id')::uuid and v.status in ('published','withdrawn'))) then
    raise exception 'Published lesson structure and citations are immutable' using errcode='23514';
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end;
$$;
do $$ declare t text; begin
  foreach t in array array['lesson_steps','lesson_lenses','soap_prompts','lesson_assets','quizzes','quiz_questions','quiz_options','citations'] loop
    execute format('create trigger immutable_published_structure before insert or update or delete on public.%I for each row execute function private.guard_published_children()',t);
  end loop;
end $$;

create function private.guard_published_answer_keys() returns trigger
language plpgsql security definer set search_path = '' as $$
declare option_uuid uuid; old_option_uuid uuid;
begin
  option_uuid := (case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end ->>'option_id')::uuid;
  old_option_uuid := case when tg_op='UPDATE' then old.option_id else option_uuid end;
  if exists(select 1 from public.quiz_options o join public.content_versions v on v.id=o.content_version_id
    where o.id in (option_uuid,old_option_uuid) and v.status in ('published','withdrawn')) then
    raise exception 'Published quiz answer keys are immutable' using errcode='23514';
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end;
$$;
create trigger immutable_published_answer_keys before insert or update or delete on private.quiz_answer_keys
for each row execute function private.guard_published_answer_keys();

create function private.guard_published_text() returns trigger
language plpgsql security definer set search_path = '' as $$
declare edition_uuid uuid; old_edition_uuid uuid;
begin
  if tg_table_name='text_editions' then
    if tg_op='DELETE' then
      if old.status in ('published','withdrawn') then raise exception 'Published editions cannot be deleted' using errcode='23514'; end if;
      return old;
    end if;
    if tg_op='UPDATE' then
      if old.status in ('published','withdrawn') then
        if old.status='published' and new.status='withdrawn' and (to_jsonb(new)-'status')=(to_jsonb(old)-'status') then return new; end if;
        raise exception 'Published editions are immutable; create another edition' using errcode='23514';
      end if;
    end if;
    if new.status='published' then
      if tg_op='INSERT' then raise exception 'Load a draft edition before publication' using errcode='23514'; end if;
      if not private.rights_allow(new.rights_grant_id,'display') or not private.rights_allow(new.rights_grant_id,'store')
        or not exists(select 1 from public.edition_units u where u.edition_id=new.id) then
        raise exception 'Edition publication requires verified rights and loaded units' using errcode='23514';
      end if;
    end if;
    return new;
  end if;
  edition_uuid := (case when tg_op='DELETE' then to_jsonb(old) else to_jsonb(new) end ->>'edition_id')::uuid;
  old_edition_uuid := case when tg_op='UPDATE' then old.edition_id else edition_uuid end;
  if exists(select 1 from public.text_editions e where e.id in (edition_uuid,old_edition_uuid) and e.status in ('published','withdrawn')) then
    raise exception 'Published text units are immutable' using errcode='23514';
  end if;
  if tg_op='DELETE' then return old; end if;
  return new;
end;
$$;
create trigger immutable_published_editions before insert or update or delete on public.text_editions
for each row execute function private.guard_published_text();
create trigger immutable_published_units before insert or update or delete on public.edition_units
for each row execute function private.guard_published_text();

create function private.validate_relations() returns trigger
language plpgsql security definer set search_path = '' as $$
declare corpus_a uuid; corpus_b uuid; rel_a uuid; rel_b uuid; start_order integer; end_order integer;
begin
  if tg_table_name='tradition_relations' then
    if new.relation_type='hierarchical' then
      if exists(with recursive descendants(id) as (
        select new.destination_id union
        select r.destination_id from public.tradition_relations r join descendants d on r.origin_id=d.id
        where r.relation_type='hierarchical' and r.id<>new.id)
        select 1 from descendants where id=new.origin_id) then
        raise exception 'Tradition hierarchy cannot contain cycles' using errcode='23514';
      end if;
    end if;
  elsif tg_table_name='text_units' then
    if new.parent_id is not null then
      if exists(with recursive parents(id,parent_id) as (
        select t.id,t.parent_id from public.text_units t where t.id=new.parent_id union
        select t.id,t.parent_id from public.text_units t join parents p on t.id=p.parent_id)
        select 1 from parents where id=new.id) then
        raise exception 'Text unit hierarchy cannot contain cycles' using errcode='23514';
      end if;
    end if;
  elsif tg_table_name='edition_unit_mappings' then
    select e.sacred_text_id into corpus_a from public.edition_units u join public.text_editions e on e.id=u.edition_id where u.id=new.edition_unit_id;
    select sacred_text_id into corpus_b from public.text_units where id=new.text_unit_id;
    if corpus_a is distinct from corpus_b then raise exception 'Mapping must remain within one corpus' using errcode='23514'; end if;
  elsif tg_table_name='unit_alignments' then
    select e.sacred_text_id into corpus_a from public.edition_units u join public.text_editions e on e.id=u.edition_id where u.id=new.origin_unit_id;
    select e.sacred_text_id into corpus_b from public.edition_units u join public.text_editions e on e.id=u.edition_id where u.id=new.destination_unit_id;
    if corpus_a is distinct from corpus_b then raise exception 'Alignment must remain within one corpus' using errcode='23514'; end if;
  elsif tg_table_name='passage_references' then
    select sort_order into start_order from public.edition_units where id=new.start_unit_id;
    select sort_order into end_order from public.edition_units where id=new.end_unit_id;
    if start_order>end_order then raise exception 'Passage end precedes its start' using errcode='23514'; end if;
  elsif tg_table_name='lesson_lenses' then
    if not exists(select 1 from public.lesson_steps s where s.id=new.lesson_step_id and s.step_type='exegesis') then
      raise exception 'Context lenses belong to the exegesis step' using errcode='23514';
    end if;
  elsif tg_table_name='lessons' then
    select c.religion_id into rel_a from public.modules m join public.courses c on c.id=m.course_id where m.id=new.module_id;
    select religion_id into rel_b from public.content_items where id=new.content_item_id and kind='lesson';
    if rel_a is distinct from rel_b then raise exception 'Lesson must have a matching lesson content identity' using errcode='23514'; end if;
  elsif tg_table_name='tradition_doctrines' then
    select religion_id into rel_a from public.traditions where id=new.tradition_id;
    select i.religion_id into rel_b from public.doctrines d join public.content_items i on i.id=d.content_item_id where d.id=new.doctrine_id;
    if rel_a is distinct from rel_b then raise exception 'Doctrine association must remain within one religion' using errcode='23514'; end if;
  elsif tg_table_name='tradition_practices' then
    select religion_id into rel_a from public.traditions where id=new.tradition_id;
    select i.religion_id into rel_b from public.practices p join public.content_items i on i.id=p.content_item_id where p.id=new.practice_id;
    if rel_a is distinct from rel_b then raise exception 'Practice association must remain within one religion' using errcode='23514'; end if;
  elsif tg_table_name='doctrine_practices' then
    select i.religion_id into rel_a from public.doctrines d join public.content_items i on i.id=d.content_item_id where d.id=new.doctrine_id;
    select i.religion_id into rel_b from public.practices p join public.content_items i on i.id=p.content_item_id where p.id=new.practice_id;
    if rel_a is distinct from rel_b then raise exception 'Doctrine and practice must belong to one religion' using errcode='23514'; end if;
  elsif tg_table_name='tradition_canons' then
    select religion_id into rel_a from public.traditions where id=new.tradition_id;
    select sacred_text_id into corpus_a from public.canons where id=new.canon_id;
    if not exists(select 1 from public.religion_sacred_texts rt where rt.religion_id=rel_a and rt.sacred_text_id=corpus_a) then
      raise exception 'Canon adoption requires a corpus recognized by the religion' using errcode='23514';
    end if;
  elsif tg_table_name in ('doctrines','practices','historical_documents') then
    if not exists(select 1 from public.content_items i where i.id=new.content_item_id
      and i.kind=case tg_table_name when 'doctrines' then 'doctrine' when 'practices' then 'practice' else 'historical_document' end) then
      raise exception 'Content identity kind does not match its specialization' using errcode='23514';
    end if;
  end if;
  return new;
end;
$$;
do $$ declare t text; begin
  foreach t in array array['tradition_relations','text_units','edition_unit_mappings','unit_alignments','passage_references','lesson_lenses','lessons','tradition_doctrines','tradition_practices','doctrine_practices','tradition_canons','doctrines','practices','historical_documents'] loop
    execute format('create trigger relationship_guard before insert or update on public.%I for each row execute function private.validate_relations()',t);
  end loop;
end $$;

create function private.validate_content_storage() returns trigger
language plpgsql security definer set search_path = '' as $$
declare grant_id uuid; model_dimensions integer; chunk_hash text; parent_grant uuid;
begin
  if tg_table_name='edition_units' then
    select rights_grant_id into grant_id from public.text_editions where id=new.edition_id;
    if not private.rights_allow(grant_id,'store') then raise exception 'Text storage requires verified rights' using errcode='23514'; end if;
  elsif tg_table_name='source_sections' then
    if new.authorized_excerpt is not null and not private.rights_allow(new.rights_grant_id,'store') then
      raise exception 'Excerpt storage requires verified rights' using errcode='23514';
    end if;
  elsif tg_table_name='content_chunks' then
    if not private.rights_allow(new.rights_grant_id,'ai') or not private.rights_allow(new.rights_grant_id,'store') then
      raise exception 'Search chunks require verified AI and storage rights' using errcode='23514';
    end if;
    if new.content_version_id is not null then
      select rights_grant_id into parent_grant from public.content_versions where id=new.content_version_id;
      if not exists(select 1 from public.content_versions v where v.id=new.content_version_id
        and v.status='published' and v.access_class='public' and private.rights_allow(v.rights_grant_id,'display')
        and private.rights_allow(v.rights_grant_id,'store')) then
        raise exception 'Only published authorized content enters the search index' using errcode='23514';
      end if;
    else
      select e.rights_grant_id into parent_grant from public.edition_units u join public.text_editions e on e.id=u.edition_id where u.id=new.edition_unit_id;
      if not private.can_read_unit(new.edition_unit_id) then raise exception 'Only published authorized text enters the search index' using errcode='23514'; end if;
    end if;
    if new.rights_grant_id is distinct from parent_grant then raise exception 'Chunk rights must match its exact source' using errcode='23514'; end if;
  elsif tg_table_name='content_embeddings' then
    select dimensions into model_dimensions from public.embedding_models where id=new.embedding_model_id;
    if extensions.vector_dims(new.embedding)<>model_dimensions then raise exception 'Embedding dimension does not match its model' using errcode='23514'; end if;
    select content_sha256 into chunk_hash from public.content_chunks where id=new.content_chunk_id;
    if new.content_sha256 is distinct from chunk_hash then raise exception 'Embedding hash does not match its chunk' using errcode='23514'; end if;
  end if;
  return new;
end;
$$;
do $$ declare t text; begin
  foreach t in array array['edition_units','source_sections','content_chunks','content_embeddings'] loop
    execute format('create trigger content_storage_guard before insert or update on public.%I for each row execute function private.validate_content_storage()',t);
  end loop;
end $$;

create function private.apply_consent_revocation() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.purpose='religious_personalization' and new.decision='revoked' then
    delete from public.learning_profiles where user_id=new.user_id;
  end if;
  return new;
end;
$$;
create trigger consent_revocation after insert on public.consent_records
for each row execute function private.apply_consent_revocation();

-- Every application table in the exposed schema starts denied, then receives an
-- explicit policy. Editorial writes are deliberately server-side in this phase.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('alter table public.%I enable row level security',t.tablename);
    execute format('revoke all on public.%I from anon, authenticated',t.tablename);
    execute format('grant select on public.%I to anon, authenticated',t.tablename);
  end loop;
end $$;

create policy religions_public on public.religions for select to anon,authenticated using (is_published);
create policy traditions_public on public.traditions for select to anon,authenticated using
  (is_published and exists(select 1 from public.religions r where r.id=religion_id));
create policy sacred_texts_public on public.sacred_texts for select to anon,authenticated using (is_published);
create policy religion_texts_public on public.religion_sacred_texts for select to anon,authenticated using
  (exists(select 1 from public.religions r where r.id=religion_id) and exists(select 1 from public.sacred_texts t where t.id=sacred_text_id));
create policy source_versions_public on public.source_versions for select to anon,authenticated using (private.source_is_public(id));
create policy sources_public on public.sources for select to anon,authenticated using
  (access_class='public' and exists(select 1 from public.source_versions v where v.source_id=sources.id and private.source_is_public(v.id)));
create policy rights_public on public.rights_grants for select to anon,authenticated using (private.rights_allow(id));
create policy source_sections_public on public.source_sections for select to anon,authenticated using
  (private.source_is_public(source_version_id) and (authorized_excerpt is null or private.rights_allow(rights_grant_id,'display')));
create policy content_items_public on public.content_items for select to anon,authenticated using (private.can_read_item(id));
create policy content_versions_public on public.content_versions for select to anon,authenticated using (private.can_read_content(id));
create policy citations_public on public.citations for select to anon,authenticated using (private.can_read_content(content_version_id));
create policy documents_public on public.historical_documents for select to anon,authenticated using
  (private.can_read_item(content_item_id) and private.source_is_public(source_version_id));
create policy reviews_editor_only on public.editorial_reviews for select to authenticated using
  (reviewer_id=(select auth.uid()) or private.is_editor());
create policy corrections_public on public.correction_events for select to anon,authenticated using (private.can_read_content(content_version_id));
create policy doctrines_public on public.doctrines for select to anon,authenticated using (private.can_read_item(content_item_id));
create policy practices_public on public.practices for select to anon,authenticated using (private.can_read_item(content_item_id));
do $$ declare t text; begin
  foreach t in array array['tradition_relations','tradition_doctrines','tradition_practices','doctrine_practices','canons','canon_members','tradition_canons'] loop
    execute format('create policy evidence_public on public.%I for select to anon,authenticated using (private.can_read_content(evidence_version_id))',t);
  end loop;
end $$;
create policy text_units_public on public.text_units for select to anon,authenticated using
  (exists(select 1 from public.sacred_texts t where t.id=sacred_text_id));
create policy versifications_public on public.versification_systems for select to anon,authenticated using (true);
create policy editions_public on public.text_editions for select to anon,authenticated using (private.can_read_edition(id));
create policy edition_units_public on public.edition_units for select to anon,authenticated using (private.can_read_edition(edition_id));
create policy mappings_public on public.edition_unit_mappings for select to anon,authenticated using
  (private.can_read_unit(edition_unit_id) and private.can_read_content(evidence_version_id));
create policy alignments_public on public.unit_alignments for select to anon,authenticated using
  (private.can_read_unit(origin_unit_id) and private.can_read_unit(destination_unit_id) and private.can_read_content(evidence_version_id));
create policy passages_public on public.passage_references for select to anon,authenticated using (private.can_read_edition(edition_id));
create policy cross_references_public on public.cross_references for select to anon,authenticated using
  (private.can_read_passage(origin_passage_id) and private.can_read_passage(destination_passage_id)
    and private.can_read_content(evidence_version_id) and private.rights_allow(rights_grant_id,'display'));
create policy tracks_public on public.learning_tracks for select to anon,authenticated using
  (status='published' and exists(select 1 from public.religions r where r.id=religion_id));
create policy audiences_public on public.track_audiences for select to anon,authenticated using
  (exists(select 1 from public.learning_tracks t where t.id=track_id));
create policy courses_public on public.courses for select to anon,authenticated using
  (status='published' and exists(select 1 from public.religions r where r.id=religion_id));
create policy track_courses_public on public.track_courses for select to anon,authenticated using
  (exists(select 1 from public.learning_tracks t where t.id=track_id) and exists(select 1 from public.courses c where c.id=course_id));
create policy modules_public on public.modules for select to anon,authenticated using
  (status='published' and exists(select 1 from public.courses c where c.id=course_id));
create policy lessons_public on public.lessons for select to anon,authenticated using
  (private.can_read_item(content_item_id) and exists(select 1 from public.modules m where m.id=module_id));
do $$ declare t text; begin
  foreach t in array array['lesson_steps','lesson_lenses','soap_prompts','lesson_assets','quizzes','quiz_questions','quiz_options'] loop
    execute format('create policy lesson_version_public on public.%I for select to anon,authenticated using (private.can_read_content(content_version_id))',t);
  end loop;
end $$;
create policy media_public on public.media_assets for select to anon,authenticated using
  (status='published' and private.rights_allow(rights_grant_id,'display'));
create policy lexicon_public on public.lexicon_entries for select to anon,authenticated using
  (status='published' and private.rights_allow(rights_grant_id,'display') and private.rights_allow(rights_grant_id,'store'));
create policy word_occurrences_public on public.word_occurrences for select to anon,authenticated using
  (private.can_read_unit(edition_unit_id) and exists(select 1 from public.lexicon_entries l where l.id=lexicon_entry_id));
create policy embedding_models_public on public.embedding_models for select to anon,authenticated using (true);
create policy chunks_public on public.content_chunks for select to anon,authenticated using
  (private.rights_allow(rights_grant_id,'ai') and
    ((content_version_id is not null and exists(select 1 from public.content_versions v
      where v.id=content_chunks.content_version_id and v.status='published' and v.access_class='public'
        and private.can_read_content(v.id)))
      or (edition_unit_id is not null and private.can_read_unit(edition_unit_id))));
create policy embeddings_public on public.content_embeddings for select to anon,authenticated using
  (exists(select 1 from public.content_chunks c where c.id=content_chunk_id and c.content_sha256=content_embeddings.content_sha256));

-- Private user data is never readable by anonymous users, editors or guardians
-- merely because they have an institutional role or a relationship.
do $$ declare t text; begin
  foreach t in array array['profiles','learning_profiles','privacy_requests','enrollments','lesson_progress','quiz_attempts','quiz_responses','note_vaults','encrypted_key_envelopes','encrypted_notes'] loop
    execute format('create policy owner_read on public.%I for select to authenticated using (user_id=(select auth.uid()))',t);
  end loop;
end $$;
create policy consent_read on public.consent_records for select to authenticated using
  (user_id=(select auth.uid()) or recorded_by=(select auth.uid()));
create policy guardian_relationship_read on public.guardian_links for select to authenticated using
  (guardian_user_id=(select auth.uid()) or learner_user_id=(select auth.uid()));

grant insert,update,delete on public.profiles,public.learning_profiles,public.enrollments,public.lesson_progress,
  public.note_vaults,public.encrypted_key_envelopes,public.encrypted_notes to authenticated;
do $$ declare t text; begin
  foreach t in array array['profiles','note_vaults','encrypted_key_envelopes','encrypted_notes'] loop
    execute format('create policy owner_insert on public.%I for insert to authenticated with check (user_id=(select auth.uid()))',t);
    execute format('create policy owner_update on public.%I for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()))',t);
    execute format('create policy owner_delete on public.%I for delete to authenticated using (user_id=(select auth.uid()))',t);
  end loop;
end $$;
create policy learning_profile_insert on public.learning_profiles for insert to authenticated with check
  (user_id=(select auth.uid()) and private.has_sensitive_consent(user_id,age_band));
create policy learning_profile_update on public.learning_profiles for update to authenticated using
  (user_id=(select auth.uid())) with check (user_id=(select auth.uid()) and private.has_sensitive_consent(user_id,age_band));
create policy learning_profile_delete on public.learning_profiles for delete to authenticated using (user_id=(select auth.uid()));
create policy enrollment_insert on public.enrollments for insert to authenticated with check
  (user_id=(select auth.uid()) and exists(select 1 from public.learning_tracks t where t.id=track_id));
create policy enrollment_update on public.enrollments for update to authenticated using
  (user_id=(select auth.uid())) with check
  (user_id=(select auth.uid()) and exists(select 1 from public.learning_tracks t where t.id=track_id));
create policy enrollment_delete on public.enrollments for delete to authenticated using (user_id=(select auth.uid()));
create policy progress_insert on public.lesson_progress for insert to authenticated with check
  (user_id=(select auth.uid()) and private.can_read_content(content_version_id));
create policy progress_update on public.lesson_progress for update to authenticated using
  (user_id=(select auth.uid())) with check (user_id=(select auth.uid()) and private.can_read_content(content_version_id));
create policy progress_delete on public.lesson_progress for delete to authenticated using (user_id=(select auth.uid()));

grant insert(user_id,purpose,notice_version,decision,legal_basis) on public.consent_records to authenticated;
grant usage on sequence public.consent_records_event_sequence_seq to authenticated;
create policy consent_insert on public.consent_records for insert to authenticated with check
  (recorded_by=(select auth.uid()) and (user_id=(select auth.uid()) or private.is_verified_guardian((select auth.uid()),user_id)));
grant insert(user_id,request_type) on public.privacy_requests to authenticated;
create policy privacy_request_insert on public.privacy_requests for insert to authenticated with check (user_id=(select auth.uid()));
-- Attempts and responses are finalized by a trusted scoring endpoint in a later
-- stage. No browser INSERT/UPDATE grant can forge a score or edit a submission.

-- Consistent indexes for owner checks and common foreign-key lookups.
do $$ declare t text; begin
  foreach t in array array['consent_records','privacy_requests','enrollments','lesson_progress','quiz_attempts','quiz_responses','encrypted_notes','encrypted_key_envelopes'] loop
    execute format('create index %I on public.%I(user_id)',t||'_owner_idx',t);
  end loop;
end $$;
create index content_versions_item_idx on public.content_versions(content_item_id,status);
create index citations_version_idx on public.citations(content_version_id);
create index chunks_content_version_idx on public.content_chunks(content_version_id);
create index chunks_edition_unit_idx on public.content_chunks(edition_unit_id);
create index guardian_learner_idx on public.guardian_links(learner_user_id,status);
create index lesson_steps_version_idx on public.lesson_steps(content_version_id);

revoke all on all tables in schema private from public, anon, authenticated;
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.is_editor(uuid), private.source_is_public(uuid),
  private.rights_allow(uuid,text), private.can_read_content(uuid), private.can_read_item(uuid),
  private.can_read_edition(uuid), private.can_read_unit(uuid), private.can_read_passage(uuid),
  private.is_verified_guardian(uuid,uuid), private.has_sensitive_consent(uuid,public.age_band)
  to anon, authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all tables in schema private to service_role;
grant execute on all functions in schema private to service_role;

commit;
