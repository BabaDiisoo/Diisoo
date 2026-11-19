-- IELTS phase 1 : catalogue, objectifs, positionnement. A exécuter dans Supabase (SQL Editor).
-- R8 : les bonnes réponses sont dans une table sans aucun droit pour anon/authenticated.

create table if not exists ielts_exam_types (
  code text primary key,
  nom text not null,
  famille text not null check (famille in ('academic','general','ukvi_academic','ukvi_general','life_skills')),
  objectif text not null,
  competences text[] not null,
  niveau_cecrl text,
  resultat text not null default 'band',
  ordre int not null default 0,
  statut text not null default 'publie' check (statut in ('brouillon','en_attente','publie','archive'))
);

create table if not exists ielts_exam_versions (
  id bigserial primary key,
  exam_code text not null references ielts_exam_types(code),
  version_format text not null,
  date_verification date,
  duree_minutes int,
  regles_notation text,
  references_officielles text,
  statut_validite text not null default 'a_verifier'
);

create table if not exists ielts_goals (
  code text primary key,
  libelle text not null,
  exams text[] not null,
  ordre int not null default 0
);

create table if not exists ielts_questions (
  id bigserial primary key,
  skill text not null,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  topic text,
  exam_code text,
  origine text not null default 'diisoo' check (origine in ('diisoo','officiel')),
  prompt text not null,
  options jsonb not null,
  contexte text,
  version int not null default 1,
  statut text not null default 'publie' check (statut in ('brouillon','en_attente','publie','archive')),
  positionnement boolean not null default false
);

create table if not exists ielts_correct_answers (
  question_id bigint primary key references ielts_questions(id) on delete cascade,
  bonne_option int not null,
  explication text
);

create table if not exists ielts_attempts (
  id bigserial primary key,
  user_ref text,
  mode text not null check (mode in ('practice','exam','placement')),
  niveau_estime text,
  score_json jsonb,
  is_estimate boolean not null default true,
  cree_le timestamptz not null default now()
);

alter table ielts_exam_types enable row level security;
alter table ielts_exam_versions enable row level security;
alter table ielts_goals enable row level security;
alter table ielts_questions enable row level security;
alter table ielts_correct_answers enable row level security;
alter table ielts_attempts enable row level security;

drop policy if exists lire_exam_types on ielts_exam_types;
create policy lire_exam_types on ielts_exam_types for select using (statut = 'publie');
drop policy if exists lire_goals on ielts_goals;
create policy lire_goals on ielts_goals for select using (true);
-- ielts_exam_versions, ielts_questions, ielts_correct_answers, ielts_attempts : aucune policy publique.
revoke all on ielts_correct_answers from anon, authenticated;
revoke all on ielts_questions from anon, authenticated;
revoke all on ielts_attempts from anon, authenticated;
revoke all on ielts_exam_versions from anon, authenticated;

insert into ielts_exam_types (code, nom, famille, objectif, competences, niveau_cecrl, resultat, ordre) values
 ('academic','IELTS Academic','academic','Études supérieures, certaines inscriptions professionnelles','{listening,reading,writing,speaking}',null,'band',1),
 ('general','IELTS General Training','general','Migration, travail, formation','{listening,reading,writing,speaking}',null,'band',2),
 ('ukvi_academic','IELTS for UKVI Academic','ukvi_academic','Justificatif linguistique pour certaines démarches UKVI','{listening,reading,writing,speaking}',null,'band',3),
 ('ukvi_general','IELTS for UKVI General Training','ukvi_general','Justificatif linguistique pour certaines démarches UKVI','{listening,reading,writing,speaking}',null,'band',4),
 ('life_skills_a1','IELTS Life Skills A1','life_skills','Certaines démarches familiales au Royaume-Uni','{listening,speaking}','A1','pass_fail',5),
 ('life_skills_a2','IELTS Life Skills A2','life_skills','Certaines démarches de prolongation familiale','{listening,speaking}','A2','pass_fail',6),
 ('life_skills_b1','IELTS Life Skills B1','life_skills','Certaines démarches de résidence permanente ou de citoyenneté','{listening,speaking}','B1','pass_fail',7)
on conflict (code) do nothing;

insert into ielts_goals (code, libelle, exams, ordre) values
 ('etudier','Étudier à l''étranger','{academic,ukvi_academic}',1),
 ('travailler','Travailler à l''étranger','{general,academic}',2),
 ('immigration','Préparer une demande d''immigration','{general,ukvi_general}',3),
 ('famille','Préparer une démarche familiale','{life_skills_a1,life_skills_a2,life_skills_b1}',4),
 ('certification','Obtenir une certification linguistique','{academic,general}',5),
 ('general','Améliorer mon anglais sans examen immédiat','{}',6)
on conflict (code) do nothing;

-- Questions de positionnement (grammaire, vocabulaire, lecture) : contenu Diisoo, pas des sujets officiels.
with q as (
 insert into ielts_questions (skill, level, topic, prompt, options, contexte, positionnement) values
 ('grammar','A1','Personal Experiences','She ___ a teacher.','["am","is","are","be"]',null,true),
 ('grammar','A1','Family and Relationships','They ___ two children.','["has","have","haves","is"]',null,true),
 ('vocabulary','A2','Travel and Tourism','You show your ___ at the airport.','["passport","kitchen","pillow","window"]',null,true),
 ('grammar','A2','Housing','I ___ in this house since 2019.','["live","lived","have lived","am living"]',null,true),
 ('reading','A2','Transport','What time does the bus leave?','["7:15","7:50","8:15","8:50"]','Notice: The bus to the city centre leaves at 7:50 every morning, except Sunday.',true),
 ('vocabulary','B1','Employment and Careers','He applied for the job but was ___ because he had no experience.','["accepted","rejected","promoted","hired"]',null,true),
 ('grammar','B1','Education','If I ___ more time, I would study abroad.','["have","had","will have","would have"]',null,true),
 ('reading','B1','Health','What is the main advice of the text?','["Sleep less","Exercise regularly","Avoid water","Skip breakfast"]','Doctors say that adults who walk for thirty minutes a day are less likely to develop heart problems and feel less stressed.',true),
 ('grammar','B2','Government and Public Services','The new law, ___ was passed last year, affects all tenants.','["who","whose","which","what"]',null,true),
 ('vocabulary','B2','Environment','Governments must ___ stricter rules to reduce pollution.','["impose","propose","expose","suppose"]',null,true),
 ('reading','B2','Technology','What does the author suggest about automation?','["It will end all jobs","It changes jobs rather than only removing them","It is not useful","It is too expensive"]','While automation eliminates some routine tasks, it also creates demand for new skills, so the nature of work shifts rather than simply shrinks.',true),
 ('grammar','C1','Society and Culture','Hardly ___ the meeting begun when the fire alarm rang.','["has","had","did","was"]',null,true)
 returning id, prompt
)
insert into ielts_correct_answers (question_id, bonne_option, explication)
select q.id, v.b, v.e from q join (values
 ('She ___ a teacher.',1,'Avec she, on utilise is.'),
 ('They ___ two children.',1,'Avec they, on utilise have.'),
 ('You show your ___ at the airport.',0,'Le passport se montre à l''aéroport.'),
 ('I ___ in this house since 2019.',2,'since + present perfect.'),
 ('What time does the bus leave?',1,'Le texte donne 7:50.'),
 ('He applied for the job but was ___ because he had no experience.',1,'rejected = refusé.'),
 ('If I ___ more time, I would study abroad.',1,'Second conditionnel : if + past simple.'),
 ('What is the main advice of the text?',1,'Marcher 30 minutes par jour = faire de l''exercice.'),
 ('The new law, ___ was passed last year, affects all tenants.',2,'which se rapporte à la loi.'),
 ('Governments must ___ stricter rules to reduce pollution.',0,'impose rules = imposer des règles.'),
 ('What does the author suggest about automation?',1,'Le travail change plutôt qu''il ne disparaît.'),
 ('Hardly ___ the meeting begun when the fire alarm rang.',1,'Hardly + had + participe passé (inversion).')
) as v(p,b,e) on v.p = q.prompt;

-- Questions SANS la bonne réponse (R8)
create or replace function ielts_questions_positionnement()
returns table (id bigint, skill text, level text, topic text, prompt text, options jsonb, contexte text)
language sql security definer set search_path = public as $$
  select id, skill, level, topic, prompt, options, contexte
  from ielts_questions
  where positionnement and statut = 'publie'
  order by case level when 'A1' then 1 when 'A2' then 2 when 'B1' then 3 when 'B2' then 4 when 'C1' then 5 else 6 end, id;
$$;

-- Correction côté serveur. Retour : niveau estimé (interne), compétences, explications. Aucun band IELTS (R3).
create or replace function ielts_corriger_positionnement(p_reponses jsonb, p_ref text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  r record; total int := 0; bons int := 0; niveau text := 'A1';
  par_skill jsonb := '{}'::jsonb; par_niveau jsonb := '{}'::jsonb; details jsonb := '[]'::jsonb;
  choix int; ok boolean; ordre text[] := array['A1','A2','B1','B2','C1','C2']; lv text; reussi int; vus int;
begin
  for r in
    select q.id, q.skill, q.level, q.prompt, c.bonne_option, c.explication
    from ielts_questions q join ielts_correct_answers c on c.question_id = q.id
    where q.positionnement and q.statut = 'publie'
  loop
    total := total + 1;
    choix := nullif(p_reponses ->> r.id::text, '')::int;
    ok := (choix is not null and choix = r.bonne_option);
    if ok then bons := bons + 1; end if;
    par_skill := jsonb_set(par_skill, array[r.skill],
      jsonb_build_object('bons', coalesce((par_skill -> r.skill ->> 'bons')::int,0) + (case when ok then 1 else 0 end),
                         'total', coalesce((par_skill -> r.skill ->> 'total')::int,0) + 1));
    par_niveau := jsonb_set(par_niveau, array[r.level],
      jsonb_build_object('bons', coalesce((par_niveau -> r.level ->> 'bons')::int,0) + (case when ok then 1 else 0 end),
                         'total', coalesce((par_niveau -> r.level ->> 'total')::int,0) + 1));
    details := details || jsonb_build_object('id', r.id, 'ok', ok, 'explication', r.explication);
  end loop;
  -- Niveau estimé : plus haut niveau dont au moins 50 % des questions sont justes, en partant du bas
  foreach lv in array ordre loop
    vus := coalesce((par_niveau -> lv ->> 'total')::int, 0);
    reussi := coalesce((par_niveau -> lv ->> 'bons')::int, 0);
    exit when vus = 0;
    if reussi * 2 >= vus then niveau := lv; else exit; end if;
  end loop;
  insert into ielts_attempts (user_ref, mode, niveau_estime, score_json, is_estimate)
  values (left(p_ref, 80), 'placement', niveau, jsonb_build_object('bons', bons, 'total', total, 'par_skill', par_skill), true);
  return jsonb_build_object('niveau', niveau, 'bons', bons, 'total', total, 'par_skill', par_skill, 'details', details, 'is_estimate', true);
end $$;

grant execute on function ielts_questions_positionnement() to anon, authenticated;
grant execute on function ielts_corriger_positionnement(jsonb, text) to anon, authenticated;
