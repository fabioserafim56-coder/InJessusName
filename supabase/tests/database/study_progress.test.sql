-- Synthetic identities and no personal free text. All fixtures roll back.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;
select no_plan();

select ok((select relrowsecurity from pg_class where oid = 'public.pilot_study_progress'::regclass),
  'pilot progress has RLS enabled');
select ok(not has_table_privilege('authenticated', 'public.pilot_study_progress', 'insert'),
  'the browser cannot insert forged scores');
select ok(not has_table_privilege('authenticated', 'public.pilot_study_progress', 'update'),
  'the browser cannot update scores or completion dates');
select ok(not has_column_privilege('authenticated', 'public.pilot_study_progress', 'summary', 'insert'),
  'no column grant permits inserting a score');
select ok(not has_column_privilege('authenticated', 'public.pilot_study_progress', 'completed_at', 'update'),
  'no column grant permits changing completion time');
select ok(not (select prosecdef from pg_proc where oid = 'public.save_pilot_study_progress(text,jsonb,boolean)'::regprocedure),
  'the exposed scoring RPC uses caller privileges and table RLS');
select ok(not has_table_privilege('anon', 'public.pilot_study_progress', 'select'),
  'anonymous readers cannot access pilot progress');
select ok(not has_function_privilege('anon', 'public.save_pilot_study_progress(text,jsonb,boolean)', 'execute'),
  'anonymous callers cannot invoke the scoring RPC');
select ok(not has_function_privilege('service_role', 'public.save_pilot_study_progress(text,jsonb,boolean)', 'execute'),
  'the application scorer requires a caller identity');

create temporary table pilot_payloads(name text primary key, answers jsonb);
insert into pilot_payloads values ('complete', '[
  {"questionId":"pp-mission-1","selectedOptionId":"range","attempt":1,"usedHint":false,"consultedText":false},
  {"questionId":"pp-mission-2","selectedOptionId":"paul-silas","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-mission-3","selectedOptionId":"receive-examine","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-mission-4","selectedOptionId":"not-duration","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-mission-5","selectedOptionId":"read-sequence","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-mission-6","selectedOptionId":"traceable","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-retrieve-1","selectedOptionId":"year","attempt":1,"usedHint":false,"consultedText":false},
  {"questionId":"pp-retrieve-1","selectedOptionId":"chapter","attempt":2,"usedHint":true,"consultedText":false},
  {"questionId":"pp-retrieve-2","selectedOptionId":"receive-check","attempt":1,"usedHint":false,"consultedText":false},
  {"questionId":"pp-retrieve-3","selectedOptionId":"mark-limit","attempt":1,"usedHint":false,"consultedText":true},
  {"questionId":"pp-transfer","selectedOptionId":"opening-dialogue","attempt":1,"usedHint":false,"consultedText":true}
]'::jsonb);
grant select on pilot_payloads to authenticated;

insert into auth.users(id,email) values
  ('42000000-0000-0000-0000-000000000001','pilot-one@example.test'),
  ('42000000-0000-0000-0000-000000000002','pilot-two@example.test'),
  ('42000000-0000-0000-0000-000000000003','pilot-without-consent@example.test'),
  ('42000000-0000-0000-0000-000000000004','pilot-minor@example.test');
insert into public.profiles(user_id) select id from auth.users where id::text like '42000000-%';
insert into public.consent_records(user_id,recorded_by,purpose,notice_version,decision,legal_basis)
  select id,id,'religious_personalization','test-only','granted','consent' from auth.users
  where id in ('42000000-0000-0000-0000-000000000001','42000000-0000-0000-0000-000000000002');
insert into public.learning_profiles(user_id,age_band) values
  ('42000000-0000-0000-0000-000000000001','18_plus'),
  ('42000000-0000-0000-0000-000000000002','18_plus'),
  ('42000000-0000-0000-0000-000000000003','18_plus'),
  ('42000000-0000-0000-0000-000000000004','13_17');

set local role authenticated;
select set_config('request.jwt.claim.sub','',true);
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  '42501',null,'a database role without a user identity cannot save');
select set_config('request.jwt.claim.sub','42000000-0000-0000-0000-000000000003',true);
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  '42501',null,'adult profile without active explicit consent cannot save');
select set_config('request.jwt.claim.sub','42000000-0000-0000-0000-000000000004',true);
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  '42501',null,'a minor profile cannot use the pilot storage endpoint');
select set_config('request.jwt.claim.sub','42000000-0000-0000-0000-000000000001',true);
select throws_ok($$ insert into public.pilot_study_progress(user_id,lesson_id,answers,summary)
  values ('42000000-0000-0000-0000-000000000001','primeiros-passos-v1','[]','{"firstAttemptCorrect":10}') $$,
  '42501',null,'a direct API table write cannot submit a summary column');
select throws_ok($$ insert into public.pilot_study_progress(user_id,lesson_id,answers)
  values ('42000000-0000-0000-0000-000000000002','primeiros-passos-v1','[]') $$,
  '42501',null,'the private scoring trigger also rejects another learner identity');
select throws_ok($$ select public.save_pilot_study_progress('unknown','[]',false) $$,
  '22023',null,'unsupported lessons cannot be recorded');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',true) $$,
  '22023',null,'completion cannot be claimed without the required tasks');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1',
  '[{"questionId":"pp-mission-1","selectedOptionId":"invalid","attempt":1,"usedHint":false,"consultedText":false}]',false) $$,
  '22023',null,'unknown option IDs are rejected by the database');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1',
  '[{"questionId":"pp-mission-1","selectedOptionId":"range","attempt":2,"usedHint":false,"consultedText":false}]',false) $$,
  '22023',null,'an attempt cannot skip the first attempt');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1',
  '[{"questionId":"pp-mission-1","selectedOptionId":"range","attempt":1,"usedHint":false,"consultedText":false,"correct":true}]',false) $$,
  '22023',null,'forged correctness flags and extra fields are rejected');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1',
  '[{"questionId":"pp-mission-1","selectedOptionId":"chapters","attempt":1,"usedHint":true,"consultedText":false},
    {"questionId":"pp-mission-1","selectedOptionId":"range","attempt":2,"usedHint":false,"consultedText":false}]',false) $$,
  '22023',null,'a hint cannot be erased from the later attempt history');

select lives_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1',
  (select answers from pilot_payloads where name='complete'),true) $$,
  'a consenting adult can save a complete pilot with assisted attempts');
select is((select count(*) from public.pilot_study_progress),1::bigint,'one own progress row is readable');
select is((select (summary->>'firstAttemptCorrect')::integer from public.pilot_study_progress),9,
  'first-attempt correct answers are distinct from retries');
select is((select (summary->>'retryCorrect')::integer from public.pilot_study_progress),1,
  'corrected retrieval is recorded as a retry');
select is((select (summary->>'assistedCorrect')::integer from public.pilot_study_progress),8,
  'consultation and retry are visible as assisted success');
select is((select (summary->>'guidedFirstAttemptCorrect')::integer from public.pilot_study_progress),6,
  'guided open-book practice has its own metric');
select is((select (summary->>'retrievalFirstAttemptCorrect')::integer from public.pilot_study_progress),1,
  'retrieval counts only first-attempt answers without reported help');
select is((select (summary->>'transferCorrect')::boolean from public.pilot_study_progress),true,
  'eventual transfer success is recorded');
select is((select (summary->>'transferFirstAttemptCorrect')::boolean from public.pilot_study_progress),false,
  'a consulted transfer answer is not described as unaided');
select ok((select completed_at between now()-interval '1 minute' and clock_timestamp() from public.pilot_study_progress),
  'completion time is generated by the server');
select ok((public.save_pilot_study_progress('primeiros-passos-v1',
  (select answers from pilot_payloads where name='complete'),true)->>'nextReviewAt')::timestamptz
  = (select completed_at+interval '1 day' from public.pilot_study_progress),
  'the first provisional review date is D+1 from original completion');
select is(jsonb_array_length(public.save_pilot_study_progress('primeiros-passos-v1',
  (select answers from pilot_payloads where name='complete'),true)->'reviewDates'),2,
  'both provisional review dates are returned');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  '22023',null,'saved attempts cannot be rewritten to erase an error');

select set_config('request.jwt.claim.sub','42000000-0000-0000-0000-000000000002',true);
select is((select count(*) from public.pilot_study_progress),0::bigint,'a second adult cannot read the first adult progress');
delete from public.pilot_study_progress where user_id='42000000-0000-0000-0000-000000000001';
reset role;
select is((select count(*) from public.pilot_study_progress),1::bigint,'a second adult cannot delete the first adult progress');
set local role authenticated;
select lives_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  'the second adult can independently start their own session');
select is((select count(*) from public.pilot_study_progress),1::bigint,'the second adult sees only their own session');
delete from public.pilot_study_progress;
select is((select count(*) from public.pilot_study_progress),0::bigint,'the owner can delete their saved session');

select set_config('request.jwt.claim.sub','42000000-0000-0000-0000-000000000001',true);
select lives_ok($$ select public.revoke_learning_personalization() $$,'the adult can revoke personalization');
select is((select count(*) from public.pilot_study_progress),0::bigint,'revocation makes all own pilot progress unavailable');
select throws_ok($$ select public.save_pilot_study_progress('primeiros-passos-v1','[]',false) $$,
  '42501',null,'revoked personalization cannot write new pilot progress');
reset role;
select is((select count(*) from public.pilot_study_progress),0::bigint,'revocation physically deletes the saved pilot progress');

select * from finish();
rollback;
