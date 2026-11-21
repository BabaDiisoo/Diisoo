-- IELTS phase 5 : statistiques pour l'administrateur (lecture seule). A executer apres les phases 1 et 2.
-- Necessite la fonction is_admin() deja presente dans le projet.
create or replace function ielts_stats()
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  if not coalesce(is_admin(), false) then return null; end if;
  select jsonb_build_object(
    'tentatives_total', (select count(*) from ielts_attempts),
    'tentatives_7j', (select count(*) from ielts_attempts where cree_le > now() - interval '7 days'),
    'appareils_7j', (select count(distinct user_ref) from ielts_attempts where cree_le > now() - interval '7 days'),
    'par_exercice', coalesce((select jsonb_agg(x) from (
        select exercise_code as code, count(*) as n, mode,
               round(avg((score_json->>'bons')::numeric * 100 / nullif((score_json->>'total')::numeric, 0))) as taux_moyen
        from ielts_attempts where exercise_code is not null group by exercise_code, mode order by n desc limit 20) x), '[]'::jsonb),
    'questions_publiees', (select count(*) from ielts_questions where statut = 'publie'),
    'exercices_publies', (select count(*) from ielts_exercises where statut = 'publie')
  ) into r;
  return r;
end $$;
revoke all on function ielts_stats() from public;
grant execute on function ielts_stats() to authenticated;
