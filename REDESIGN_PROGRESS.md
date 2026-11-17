# JoyeriaPro — Redesign Progress

## Estado
Implementación aplicada sobre el código real. Build de producción OK, ESLint sin warnings, tests 6/6.

## Archivos modificados
- `src/app/globals.css` — paleta refinada (obsidian/graphite/champagne-gold/ivory) + capa de **design system**:
  `.jp-glass`, `.jp-panel`, `.jp-card`, `.jp-btn(--gold/--ghost)`, `.jp-badge(--gold/success/warning/error)`,
  `.jp-section`, `.jp-section-label`, `.jp-title`, `.jp-lead`, `.jp-input`, `.jp-empty`, `.jp-skeleton`,
  `.jp-reveal` (scroll reveal nativo con `animation-timeline`, sin JS), `.jp-sr-only`, scrollbar y fondo ambiental.
- `src/app/page.js` — landing ampliada: hero (con capa de luz), intro, **problema**, pilares, **demo del panel**
  (marcada explícitamente como “Vista ilustrativa”, sin cifras falsas), editorial calidad, galería,
  **capacidades reales**, **ventajas** y CTA. Navegación con anclas a secciones existentes.
- `src/app/public.css` — estilos de las secciones nuevas + refinamiento de tienda: hover/zoom de producto,
  overlay de tarjeta, chips, foco de búsqueda con `color-mix` sobre el acento del negocio, hover de categorías
  y galería, cierre de diálogo, **orbit 3D en CSS** (anillos + flotación, sin dependencias),
  y **navegación móvil real** (segunda fila scrollable) en tienda y landing.
- `src/app/[slug]/page.js` — capa de luz del hero; `#historia` y `#contacto` ahora se renderizan siempre
  (antes eran anclas muertas cuando `showCatalog` era false); copy de contacto sin asumir catálogo.
- `src/app/dashboard.css` — refinamiento: topbar sticky con blur, sidebar con rail dorado e indicador activo,
  línea superior en stat-cards, hover de filas, títulos con regla dorada, auth-art con brillo/animación
  (desactivada con `prefers-reduced-motion`), foco accesible en búsqueda.
- `src/app/home.css` — eliminado: código muerto, no importado en `layout.js` y con clases que contradecían `public.css`.

## Conservado sin cambios
- Toda la lógica de Supabase (server/client/admin), middleware, RLS, auth y aislamiento multi-tenant.
- Contratos de datos de `[slug]` (campos del RPC `get_published_site_config`), dashboard, superadmin y formularios.
- Dependencias: ninguna añadida.

## Verificación ejecutada
- `node --test tests/lib.test.mjs` → 6/6 pass.
- `next build` → compila, 14/14 páginas generadas, sin errores de ESLint.
- Servidor de producción + HTTP: `/`, `/login`, `/forgot-password`, `/reset-password`, `/setup` → 200;
  el HTML de `/` contiene las secciones nuevas.
- Llaves CSS balanceadas en los 3 estilos tocados.

## Pendiente / limitaciones reales de este entorno
1. **Sin QA visual en navegador**: Playwright no está instalado y no hay red para instalarlo. La verificación
   fue por build + HTTP + lectura de CSS, no por captura de pantalla.
2. **Tienda `/[slug]` no verificable en runtime**: no existe `.env.local` con credenciales de Supabase
   (solo `.env.example`), por lo que la ruta lanza “Faltan variables públicas de Supabase” en local.
   El diseño se validó de forma estática y por compilación.
3. **Sin modelos 3D reales**: no se añadió three.js ni assets GLB. El objeto del hero es 3D en CSS
   (anillos orbitando + flotación), deliberadamente ligero para no bloquear la carga.
4. **Imágenes**: se mantienen las URLs de Unsplash ya presentes en el proyecto; no se añadieron assets nuevos.
5. **Playwright/QA multi-breakpoint** queda pendiente en un entorno con navegador.
