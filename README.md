# JoyeriaPro

Plataforma SaaS independiente para la gestión comercial de joyerías, construida con Next.js 15, React 19, Supabase Auth y PostgreSQL. Conserva la organización de panel, componentes, navegación y patrones de la referencia técnica, pero no comparte código operativo, credenciales ni base de datos.

## Desarrollo

```bash
npm install
copy .env.example .env.local
npm run dev
```

Variables requeridas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y opcionalmente `SUPABASE_SERVICE_ROLE_KEY` sólo en servidor. Ejecuta `supabase/migrations/001_core.sql`, luego `002_security.sql` y finalmente `supabase/setup_first_owner.sql` en un proyecto Supabase nuevo.

## Módulos

Dashboard, productos, categorías, inventario y movimientos, clientes, ventas, configuración del negocio y usuarios/permisos con roles owner, admin, manager, seller y viewer. No contiene empleados, citas, reservas ni pedidos.

## Validación

`npm run lint`, `npm run build` y `npm test`. Las operaciones contra Supabase requieren configurar el proyecto y aplicar las migraciones en un entorno independiente.
