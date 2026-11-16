create table public.site_configs (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  draft jsonb not null default '{}'::jsonb,
  published jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.site_configs enable row level security;
create policy site_config_owner_read on public.site_configs for select using (public.is_business_member(business_id));
create policy site_config_owner_write on public.site_configs for all using (exists(select 1 from public.business_members m where m.business_id=site_configs.business_id and m.user_id=auth.uid() and m.active and m.role in ('owner','admin'))) with check (exists(select 1 from public.business_members m where m.business_id=site_configs.business_id and m.user_id=auth.uid() and m.active and m.role in ('owner','admin')));
create or replace function public.get_published_site_config(target_slug text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sc.published, '{}'::jsonb)
  from public.site_configs sc
  join public.businesses b on b.id = sc.business_id
  where b.slug = target_slug and b.status = 'active'
  limit 1;
$$;
revoke all on function public.get_published_site_config(text) from public;
grant execute on function public.get_published_site_config(text) to anon, authenticated;
insert into public.site_configs(business_id,draft,published)
select id, jsonb_build_object('tagline','Joyas que cuentan tu historia','heroTitle',name,'heroDescription',coalesce(description,'Piezas seleccionadas para acompañar tus momentos importantes.'),'accent','#c8a56a','background','#090a0d','showCatalog',true), jsonb_build_object('tagline','Joyas que cuentan tu historia','heroTitle',name,'heroDescription',coalesce(description,'Piezas seleccionadas para acompañar tus momentos importantes.'),'accent','#c8a56a','background','#090a0d','showCatalog',true) from public.businesses on conflict do nothing;

