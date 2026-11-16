# JoyeriaPro

Plataforma SaaS independiente para la gestión comercial de joyerías, construida con Next.js 15, React 19, Supabase Auth y PostgreSQL. Conserva la organización de panel, componentes, navegación y patrones de la referencia técnica, pero no comparte código operativo, credenciales ni base de datos.

## Desarrollo

```bash
npm install
copy .env.example .env.local
npm run dev
```

Variables requeridas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` sólo en servidor para `/superadmin`. Ejecuta `supabase/migrations/001_core.sql`, luego `002_security.sql`, asigna el rol con `supabase/setup_superadmin.sql` y entra a `/superadmin`.

## Módulos

Dashboard, productos, categorías, inventario y movimientos, clientes, ventas, configuración del negocio y usuarios/permisos con roles owner, admin, manager, seller y viewer. El propietario de plataforma administra las joyerías desde `/superadmin` y puede crear el negocio y su cuenta propietaria en una sola operación.

## Validación

`npm run lint`, `npm run build` y `npm test`. Las operaciones contra Supabase requieren configurar el proyecto y aplicar las migraciones en un entorno independiente.
