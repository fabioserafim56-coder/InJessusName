-- Minimal taxonomy only. No Bible text, official doctrine, historical date,
-- institutional circular, lesson or third-party media is distributed here.
-- Re-running is safe; it does not overwrite editorial changes.
insert into public.religions (id,code,name,is_published)
values ('01000000-0000-0000-0000-000000000001','christianity','Cristianismo',true)
on conflict (code) do nothing;

insert into public.traditions (id,religion_id,code,name,is_published)
select data.id::uuid, religion.id, data.code, data.name, true
from public.religions religion
cross join (values
  ('02000000-0000-0000-0000-000000000001','ccb','Congregação Cristã no Brasil'),
  ('02000000-0000-0000-0000-000000000002','roman_catholic','Catolicismo Romano'),
  ('02000000-0000-0000-0000-000000000003','evangelical_protestant','Evangélica / Protestante'),
  ('02000000-0000-0000-0000-000000000004','historical_protestant','Protestante histórica'),
  ('02000000-0000-0000-0000-000000000005','reformed','Reformada'),
  ('02000000-0000-0000-0000-000000000006','baptist','Batista'),
  ('02000000-0000-0000-0000-000000000007','pentecostal','Pentecostal')
) as data(id,code,name)
where religion.code='christianity'
on conflict (code) do nothing;

insert into public.sacred_texts(id,code,name,is_published)
values ('03000000-0000-0000-0000-000000000001','bible','Bíblia',true)
on conflict (code) do nothing;

insert into public.religion_sacred_texts(religion_id,sacred_text_id)
select r.id,t.id from public.religions r cross join public.sacred_texts t
where r.code='christianity' and t.code='bible'
on conflict do nothing;

-- These are draft planning labels, not published courses or official curricula.
insert into public.learning_tracks(religion_id,code,title,description)
select religion.id,data.code,data.title,'Planejamento editorial; conteúdo ainda não publicado.'
from public.religions religion
cross join (values
  ('christian_foundations','Núcleo Bíblico e Teológico Geral'),
  ('ccb_care_and_service','Guia de Zelo Doutrinário, Bom Testemunho e Conhecimento dos Santos Serviços'),
  ('catholic_studies','Estudos da tradição católica'),
  ('protestant_studies','Estudos das tradições evangélicas e protestantes')
) as data(code,title)
where religion.code='christianity'
on conflict (code) do nothing;
