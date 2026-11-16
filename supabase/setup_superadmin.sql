-- Ejecuta con una cuenta con permisos de administrador de Supabase.
-- Sustituye el UUID por el usuario autenticado que será propietario de JoyeriaPro.
update public.profiles set platform_role = 'superadmin' where id = 'UUID_DEL_PROPIETARIO_DE_PLATAFORMA';
