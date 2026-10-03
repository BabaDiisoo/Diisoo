alter table public.diisoo_profiles add column if not exists prenom text;
alter table public.diisoo_profiles add column if not exists nom text;
alter table public.diisoo_profiles add column if not exists whatsapp text;
alter table public.diisoo_profiles add column if not exists alertes_whatsapp boolean not null default false;

create or replace function public.maj_profil_identite(p_prenom text, p_nom text, p_whatsapp text, p_alertes boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'non connecte'; end if;
  update public.diisoo_profiles
     set prenom = coalesce(left(p_prenom, 80), prenom),
         nom = coalesce(left(p_nom, 80), nom),
         whatsapp = case when p_alertes then left(p_whatsapp, 20) else null end,
         alertes_whatsapp = coalesce(p_alertes, false)
   where id = auth.uid();
end;
$$;

revoke all on function public.maj_profil_identite(text, text, text, boolean) from public, anon;
grant execute on function public.maj_profil_identite(text, text, text, boolean) to authenticated;
