-- A separate, explicitly labelled educational pilot; this does not publish an
-- editorial content_version or bypass its human-review requirements.
begin;

create table public.pilot_study_progress (
  user_id uuid not null references public.learning_profiles(user_id) on delete cascade,
  lesson_id text not null check (lesson_id = 'primeiros-passos-v1'),
  answers jsonb not null default '[]'::jsonb check (jsonb_typeof(answers) = 'array'),
  summary jsonb not null,
  completion_requested boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default clock_timestamp(),
  primary key (user_id, lesson_id)
);
alter table public.pilot_study_progress enable row level security;
revoke all on public.pilot_study_progress from public, anon, authenticated, service_role;
grant select, delete on public.pilot_study_progress to authenticated;
grant insert(user_id, lesson_id, answers, completion_requested),
  update(answers, completion_requested) on public.pilot_study_progress to authenticated;

create policy own_active_pilot_progress on public.pilot_study_progress for select to authenticated
using (user_id = (select auth.uid()) and exists (
  select 1 from public.learning_profiles as profile where profile.user_id = (select auth.uid())
    and profile.age_band = '18_plus' and private.has_sensitive_consent(profile.user_id, profile.age_band)
));
create policy own_active_pilot_insert on public.pilot_study_progress for insert to authenticated
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.learning_profiles as profile where profile.user_id = (select auth.uid())
    and profile.age_band = '18_plus' and private.has_sensitive_consent(profile.user_id, profile.age_band)
));
create policy own_active_pilot_update on public.pilot_study_progress for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and exists (
  select 1 from public.learning_profiles as profile where profile.user_id = (select auth.uid())
    and profile.age_band = '18_plus' and private.has_sensitive_consent(profile.user_id, profile.age_band)
));
create policy own_pilot_progress_delete on public.pilot_study_progress for delete to authenticated
using (user_id = (select auth.uid()));

-- The caller may submit option IDs, never score columns or another learner ID.
-- The database repeats the endpoint's validation, including the immutable v1
-- answer contract, so a direct RPC cannot forge a summary.
create function private.score_pilot_study_progress()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  actor_id uuid := auth.uid();
  p_lesson_id text := new.lesson_id;
  p_answers jsonb := new.answers;
  p_completed boolean := new.completion_requested;
  profile public.learning_profiles;
  stored public.pilot_study_progress;
  answer jsonb;
  question jsonb;
  prior jsonb;
  prior_by_question jsonb := '{}'::jsonb;
  question_id text;
  selected_option text;
  attempt_no integer;
  first_correct integer := 0;
  retry_correct integer := 0;
  assisted_correct integer := 0;
  guided_first integer := 0;
  retrieval_first integer := 0;
  transfer_correct boolean := false;
  transfer_first boolean := false;
  all_correct boolean := true;
  calculated jsonb;
  finish_at timestamptz;
  saved_at timestamptz;
  keys constant jsonb := '{
    "pp-diagnostic":{"kind":"diagnostic","correct":"context","options":["context","confidence","familiar"]},
    "pp-mission-1":{"kind":"guided","correct":"range","options":["range","chapters","book"]},
    "pp-mission-2":{"kind":"guided","correct":"paul-silas","options":["paul-silas","peter-john","not-stated"]},
    "pp-mission-3":{"kind":"guided","correct":"receive-examine","options":["receive-examine","never-check","same-translation"]},
    "pp-mission-4":{"kind":"guided","correct":"not-duration","options":["not-duration","duration-rule","nothing-useful"]},
    "pp-mission-5":{"kind":"guided","correct":"read-sequence","options":["read-sequence","one-word","invent-details"]},
    "pp-mission-6":{"kind":"guided","correct":"traceable","options":["traceable","no-reference","person-only"]},
    "pp-retrieve-1":{"kind":"retrieval","correct":"chapter","options":["chapter","year","score"]},
    "pp-retrieve-2":{"kind":"retrieval","correct":"receive-check","options":["receive-check","hear-skip","time-rank"]},
    "pp-retrieve-3":{"kind":"retrieval","correct":"mark-limit","options":["mark-limit","fill-gap","abandon"]},
    "pp-transfer":{"kind":"transfer","correct":"opening-dialogue","options":["opening-dialogue","ignore-opening","same-details"]}
  }'::jsonb;
begin
  if actor_id is null or new.user_id is distinct from actor_id then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  -- The profile row lock serializes progress with profile deletion/revocation.
  select * into profile from public.learning_profiles where user_id = actor_id for update;
  if not found or profile.age_band <> '18_plus'
    or not private.has_sensitive_consent(actor_id, profile.age_band) then
    raise exception 'An adult profile with active consent is required' using errcode = '42501';
  end if;
  if p_lesson_id is distinct from 'primeiros-passos-v1' or p_completed is null
    or p_answers is null or jsonb_typeof(p_answers) <> 'array' then
    raise exception 'Invalid pilot submission' using errcode = '22023';
  end if;
  if jsonb_array_length(p_answers) > 55 then
    raise exception 'Too many attempts' using errcode = '22023';
  end if;
  if tg_op = 'UPDATE' then stored := old; end if;
  if tg_op = 'UPDATE' and (jsonb_array_length(p_answers) < jsonb_array_length(stored.answers)
    or exists (select 1 from jsonb_array_elements(stored.answers) with ordinality as saved_item(value, position)
      where saved_item.value is distinct from p_answers -> (saved_item.position::integer - 1))) then
    raise exception 'Earlier attempts cannot be rewritten; delete the saved session to restart' using errcode = '22023';
  end if;

  for answer in select value from jsonb_array_elements(p_answers) loop
    if jsonb_typeof(answer) <> 'object' then
      raise exception 'Invalid answer object' using errcode = '22023';
    end if;
    if (select array_agg(key order by key) from jsonb_object_keys(answer) as key)
      is distinct from array['attempt','consultedText','questionId','selectedOptionId','usedHint']::text[]
      or jsonb_typeof(answer->'questionId') <> 'string'
      or jsonb_typeof(answer->'selectedOptionId') <> 'string'
      or jsonb_typeof(answer->'attempt') <> 'number'
      or jsonb_typeof(answer->'usedHint') <> 'boolean'
      or jsonb_typeof(answer->'consultedText') <> 'boolean'
      or (answer->>'attempt') !~ '^[1-5]$' then
      raise exception 'Invalid answer fields' using errcode = '22023';
    end if;
    question_id := answer->>'questionId';
    selected_option := answer->>'selectedOptionId';
    question := keys->question_id;
    attempt_no := (answer->>'attempt')::integer;
    prior := prior_by_question->question_id;
    if question is null or not ((question->'options') ? selected_option)
      or attempt_no <> coalesce((prior->>'attempt')::integer, 0) + 1
      or prior->>'selectedOptionId' = question->>'correct'
      or (coalesce((prior->>'usedHint')::boolean, false) and not (answer->>'usedHint')::boolean)
      or (coalesce((prior->>'consultedText')::boolean, false) and not (answer->>'consultedText')::boolean) then
      raise exception 'Unknown option or invalid attempt sequence' using errcode = '22023';
    end if;
    prior_by_question := jsonb_set(prior_by_question, array[question_id], answer);
    if question->>'kind' <> 'diagnostic' and selected_option = question->>'correct' then
      if attempt_no = 1 then first_correct := first_correct + 1; end if;
      if attempt_no > 1 then retry_correct := retry_correct + 1; end if;
      if attempt_no > 1 or (answer->>'usedHint')::boolean or (answer->>'consultedText')::boolean then
        assisted_correct := assisted_correct + 1;
      end if;
      if question->>'kind' = 'guided' and attempt_no = 1 then guided_first := guided_first + 1; end if;
      if question->>'kind' = 'retrieval' and attempt_no = 1
        and not (answer->>'usedHint')::boolean and not (answer->>'consultedText')::boolean then
        retrieval_first := retrieval_first + 1;
      end if;
      if question->>'kind' = 'transfer' then
        transfer_correct := true;
        transfer_first := attempt_no = 1 and not (answer->>'usedHint')::boolean and not (answer->>'consultedText')::boolean;
      end if;
    end if;
  end loop;
  for question_id, question in select key, value from jsonb_each(keys) loop
    if question->>'kind' <> 'diagnostic' and
      (prior_by_question->question_id->>'selectedOptionId') is distinct from (question->>'correct') then
      all_correct := false;
    end if;
  end loop;
  if p_completed and not all_correct then
    raise exception 'Complete the guided questions, retrieval and transfer before finishing' using errcode = '22023';
  end if;
  calculated := jsonb_build_object(
    'firstAttemptCorrect', first_correct, 'totalQuestions', 10,
    'retryCorrect', retry_correct, 'assistedCorrect', assisted_correct,
    'guidedFirstAttemptCorrect', guided_first, 'guidedTotal', 6,
    'retrievalFirstAttemptCorrect', retrieval_first, 'retrievalTotal', 3,
    'transferCorrect', transfer_correct, 'transferFirstAttemptCorrect', transfer_first
  );
  finish_at := coalesce(stored.completed_at, case when p_completed then clock_timestamp() else null end);
  saved_at := clock_timestamp();
  new.summary := calculated;
  new.completed_at := finish_at;
  new.updated_at := saved_at;
  return new;
end;
$$;
revoke all on function private.score_pilot_study_progress() from public, anon, authenticated, service_role;
create trigger pilot_study_scoring_guard before insert or update on public.pilot_study_progress
for each row execute function private.score_pilot_study_progress();

create function public.save_pilot_study_progress(p_lesson_id text, p_answers jsonb, p_completed boolean)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare saved public.pilot_study_progress;
begin
  insert into public.pilot_study_progress(user_id, lesson_id, answers, completion_requested)
    values(auth.uid(), p_lesson_id, p_answers, p_completed)
    on conflict(user_id, lesson_id) do update set
      answers = excluded.answers, completion_requested = excluded.completion_requested
    returning * into saved;
  return saved.summary || jsonb_build_object(
    'lessonId', saved.lesson_id, 'completed', saved.completed_at is not null, 'completedAt', saved.completed_at,
    'nextReviewAt', case when saved.completed_at is not null then saved.completed_at + interval '1 day' else null end,
    'reviewDates', case when saved.completed_at is not null then
      jsonb_build_array(saved.completed_at + interval '1 day', saved.completed_at + interval '7 days') else '[]'::jsonb end,
    'updatedAt', saved.updated_at
  );
end;
$$;
revoke all on function public.save_pilot_study_progress(text, jsonb, boolean)
  from public, anon, authenticated, service_role;
grant execute on function public.save_pilot_study_progress(text, jsonb, boolean) to authenticated;

comment on table public.pilot_study_progress is
  'Optional same-session educational-pilot practice. No intimate notes; no claim of delayed retention, theological review, or spiritual assessment. Removed with religious profile revocation.';
comment on function public.save_pilot_study_progress(text,jsonb,boolean) is
  'Owner-only adult/active-consent checked scorer. Hints and consultation flags are learner-reported. First review intervals D+1/D+7 are provisional product defaults.';
commit;
