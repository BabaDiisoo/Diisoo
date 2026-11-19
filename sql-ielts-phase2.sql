-- IELTS phase 2 : exercices Listening / Reading avec correction côté serveur (R8) et mode practice / exam (R9).
-- A exécuter APRÈS sql-ielts-phase1.sql.

create table if not exists ielts_exercises (
  code text primary key,
  skill text not null check (skill in ('listening','reading')),
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  topic text not null,
  titre text not null,
  consigne text,
  duree_min int not null default 10,
  origine text not null default 'diisoo' check (origine in ('diisoo','officiel')),
  version int not null default 1,
  statut text not null default 'publie' check (statut in ('brouillon','en_attente','publie','archive'))
);
alter table ielts_exercises enable row level security;
revoke all on ielts_exercises from anon, authenticated;

alter table ielts_questions add column if not exists exercise_code text references ielts_exercises(code);
alter table ielts_questions add column if not exists format text not null default 'qcm' check (format in ('qcm','tfng','ynng'));
alter table ielts_questions add column if not exists ordre int not null default 0;
alter table ielts_attempts add column if not exists exercise_code text;
alter table ielts_attempts add column if not exists duree_s int;

-- Le texte à lire (reading) ou le script à faire lire par la voix (listening) est porté par l'exercice
alter table ielts_exercises add column if not exists texte text;

insert into ielts_exercises (code, skill, level, topic, titre, consigne, duree_min, texte) values
 ('rd-a2-notice','reading','A2','Transport','Un avis à la gare','Lis l''avis puis réponds.',5,
  'NOTICE TO PASSENGERS. From Monday 4 March, the 08:10 train to Central Station will leave from Platform 3 instead of Platform 1. Tickets bought online can be shown on your phone. Bicycles are not allowed before 09:30. The ticket office is closed on Sundays, but machines are available all day.'),
 ('rd-b1-tfng','reading','B1','Environment','Les vélos en ville','Lis le texte. Réponds True, False ou Not Given.',8,
  'Many cities are building more cycle lanes to reduce traffic. In one city, the number of people cycling to work doubled in five years, and local shops reported that cyclists visit more often than drivers. However, some residents complain that the new lanes reduce parking space. The council says it will review the plan next year.'),
 ('ls-a2-reservation','listening','A2','Travel and Tourism','Réserver une chambre','Écoute puis réponds. Tu peux réécouter en entraînement.',5,
  'Good morning, Palm Hotel. How can I help you? Hello, I would like to book a room for two nights, from Friday the twelfth. A double room costs sixty euros a night, and breakfast is included. Is there parking? Yes, parking is free for guests. Great, my name is Sara Diallo. I will pay by card.'),
 ('ls-b1-annonce','listening','B1','Education','Annonce à l''université','Écoute l''annonce puis réponds.',6,
  'Attention all students. The library will open one hour earlier during exam week, at seven in the morning, and it will stay open until midnight. Group study rooms must be booked online, at least a day in advance. Please remember that food is not allowed in the reading area, but you can use the cafeteria on the ground floor.')
on conflict (code) do nothing;

with q as (
 insert into ielts_questions (skill, level, topic, exercise_code, format, ordre, prompt, options, positionnement) values
 ('reading','A2','Transport','rd-a2-notice','qcm',1,'Which platform does the 08:10 train use from 4 March?','["Platform 1","Platform 3","Platform 8","Platform 10"]',false),
 ('reading','A2','Transport','rd-a2-notice','qcm',2,'When are bicycles NOT allowed?','["After 09:30","On Sundays","Before 09:30","All day"]',false),
 ('reading','A2','Transport','rd-a2-notice','qcm',3,'What is available on Sundays?','["The ticket office","Ticket machines","Nothing","A phone service"]',false),
 ('reading','B1','Environment','rd-b1-tfng','tfng',1,'The number of people cycling to work doubled in five years.','["True","False","Not Given"]',false),
 ('reading','B1','Environment','rd-b1-tfng','tfng',2,'Cyclists spend more money in shops than drivers.','["True","False","Not Given"]',false),
 ('reading','B1','Environment','rd-b1-tfng','tfng',3,'All residents support the new cycle lanes.','["True","False","Not Given"]',false),
 ('reading','B1','Environment','rd-b1-tfng','tfng',4,'The council will review the plan next year.','["True","False","Not Given"]',false),
 ('listening','A2','Travel and Tourism','ls-a2-reservation','qcm',1,'How many nights does the guest want?','["One","Two","Three","Four"]',false),
 ('listening','A2','Travel and Tourism','ls-a2-reservation','qcm',2,'How much is the room per night?','["50 euros","60 euros","70 euros","80 euros"]',false),
 ('listening','A2','Travel and Tourism','ls-a2-reservation','qcm',3,'What is included in the price?','["Parking","Dinner","Breakfast","A taxi"]',false),
 ('listening','A2','Travel and Tourism','ls-a2-reservation','qcm',4,'How will the guest pay?','["Cash","By card","By phone","Later"]',false),
 ('listening','B1','Education','ls-b1-annonce','qcm',1,'When will the library open during exam week?','["6:00","7:00","8:00","9:00"]',false),
 ('listening','B1','Education','ls-b1-annonce','qcm',2,'How must group study rooms be booked?','["At the desk","By phone","Online, a day before","On the day"]',false),
 ('listening','B1','Education','ls-b1-annonce','qcm',3,'Where can students eat?','["In the reading area","In the cafeteria","In the study rooms","Outside only"]',false)
 returning id, exercise_code, ordre
)
insert into ielts_correct_answers (question_id, bonne_option, explication)
select q.id, v.b, v.e from q join (values
 ('rd-a2-notice',1,1,'Le texte dit Platform 3 au lieu de Platform 1.'),
 ('rd-a2-notice',2,2,'Bicycles are not allowed before 09:30.'),
 ('rd-a2-notice',3,1,'Le guichet est fermé le dimanche, mais les machines sont disponibles toute la journée.'),
 ('rd-b1-tfng',1,0,'Le texte dit doubled in five years : True.'),
 ('rd-b1-tfng',2,2,'Le texte dit qu''ils viennent plus souvent, pas qu''ils dépensent plus : Not Given.'),
 ('rd-b1-tfng',3,1,'Certains habitants se plaignent : False.'),
 ('rd-b1-tfng',4,0,'The council says it will review the plan next year : True.'),
 ('ls-a2-reservation',1,1,'for two nights.'),
 ('ls-a2-reservation',2,1,'sixty euros a night.'),
 ('ls-a2-reservation',3,2,'breakfast is included.'),
 ('ls-a2-reservation',4,1,'I will pay by card.'),
 ('ls-b1-annonce',1,1,'at seven in the morning.'),
 ('ls-b1-annonce',2,2,'at least a day in advance, online.'),
 ('ls-b1-annonce',3,1,'cafeteria on the ground floor.')
) as v(ex,o,b,e) on v.ex = q.exercise_code and v.o = q.ordre;

-- Liste des exercices (sans réponses)
create or replace function ielts_liste_exercices(p_skill text default null)
returns table (code text, skill text, level text, topic text, titre text, duree_min int, nb_questions bigint)
language sql security definer set search_path = public as $$
  select e.code, e.skill, e.level, e.topic, e.titre, e.duree_min,
         (select count(*) from ielts_questions q where q.exercise_code = e.code and q.statut = 'publie')
  from ielts_exercises e
  where e.statut = 'publie' and (p_skill is null or e.skill = p_skill)
  order by e.skill, e.level, e.code;
$$;

-- Un exercice, SANS les bonnes réponses (R8)
create or replace function ielts_charger_exercice(p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare ex ielts_exercises; qs jsonb;
begin
  select * into ex from ielts_exercises where code = p_code and statut = 'publie';
  if not found then return null; end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'format', format, 'prompt', prompt, 'options', options) order by ordre), '[]'::jsonb)
    into qs from ielts_questions where exercise_code = p_code and statut = 'publie';
  return jsonb_build_object('code', ex.code, 'skill', ex.skill, 'level', ex.level, 'topic', ex.topic, 'titre', ex.titre,
    'consigne', ex.consigne, 'duree_min', ex.duree_min, 'origine', ex.origine, 'texte', ex.texte, 'questions', qs);
end $$;

-- Soumission : correction côté serveur. Les bonnes réponses ne sont renvoyées qu'après la soumission.
create or replace function ielts_soumettre(p_code text, p_reponses jsonb, p_mode text default 'practice', p_ref text default null, p_duree_s int default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r record; total int := 0; bons int := 0; choix int; ok boolean; details jsonb := '[]'::jsonb; mode text;
begin
  mode := case when p_mode = 'exam' then 'exam' else 'practice' end;
  for r in
    select q.id, c.bonne_option, c.explication
    from ielts_questions q join ielts_correct_answers c on c.question_id = q.id
    where q.exercise_code = p_code and q.statut = 'publie' order by q.ordre
  loop
    total := total + 1;
    choix := nullif(p_reponses ->> r.id::text, '')::int;
    ok := (choix is not null and choix = r.bonne_option);
    if ok then bons := bons + 1; end if;
    details := details || jsonb_build_object('id', r.id, 'ok', ok, 'choix', choix, 'bonne_option', r.bonne_option, 'explication', r.explication);
  end loop;
  if total = 0 then return null; end if;
  insert into ielts_attempts (user_ref, mode, score_json, is_estimate, exercise_code, duree_s)
  values (left(p_ref, 80), mode, jsonb_build_object('bons', bons, 'total', total), true, p_code, p_duree_s);
  return jsonb_build_object('bons', bons, 'total', total, 'taux', round(bons * 100.0 / total), 'mode', mode, 'details', details);
end $$;

grant execute on function ielts_liste_exercices(text) to anon, authenticated;
grant execute on function ielts_charger_exercice(text) to anon, authenticated;
grant execute on function ielts_soumettre(text, jsonb, text, text, int) to anon, authenticated;
