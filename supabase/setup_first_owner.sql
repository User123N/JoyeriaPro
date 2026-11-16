-- Ejecutar con service role después de crear el usuario en Supabase Auth.
-- Sustituye los UUID y ejecuta en el SQL Editor.
insert into public.businesses (name,slug) values ('Mi Joyería','mi-joyeria') on conflict (slug) do nothing;
-- insert into public.business_members(business_id,user_id,role) select id,'UUID_DEL_USUARIO','owner' from public.businesses where slug='mi-joyeria';
