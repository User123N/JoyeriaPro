# JoyeriaPro — Redesign Progress

## Entorno de esta sesión
Sin acceso a red (no npm install, no dev server, no Playwright, no fuentes/CDN externos).
Todo lo de abajo se verificó por lectura/edición de código, conteo de llaves CSS y los tests
unitarios existentes (`node --test tests/lib.test.mjs`, 6/6 OK) — no por captura de pantalla.
Para QA visual real en navegador (sección 17 del brief) hace falta un entorno con
red/terminal persistente, p. ej. Claude Code.

## Hecho
- [x] Auditoría completa del repo real (Next.js 15 + Supabase, multi-tenant por slug, dashboard, superadmin).
- [x] `globals.css`: sistema de tokens semánticos completo (bg/bg-elevated/surface/surface-glass,
      primary/secondary/accent, texto, bordes, focus, success/warning/error), escala tipográfica
      fluida, pareja serif/sans sin dependencias externas, `prefers-reduced-motion`. Alias legacy
      (`--bg-main`, `--text-main`, `--line`) conservados para no romper el CSS minificado existente.
- [x] Eliminado `src/app/home.css`: código muerto, nunca importado en `layout.js` y con clases que
      no coinciden con el markup real de `page.js` (duplicaba y contradecía `public.css`).
- [x] Tokenizadas las referencias a `'Playfair Display'` y `'DM Sans'` (fuentes que nunca se cargan
      en el proyecto) por `var(--font-display)` / `var(--font-sans)` en `public.css` y `editor.css`.
- [x] Bugs reales de clases sin estilo, corregidos en `dashboard.css`:
      - `.field` (usada en login, forgot-password, reset-password) — los inputs de auth se
        renderizaban sin ningún diseño.
      - `.notice.error`, `.form-message` (mensajes de los formularios de auth).
      - `.section-heading` (cabecera de Productos/Categorías/Inventario en el dashboard).
      - `.skeleton`, `.sk-row`, `.sk-card`, `.card-grid` — el estado de carga global
        (`src/app/loading.js`, visible en cada navegación de toda la app) no tenía animación
        ni fondo visibles.
      - `.search-field`, `.entity-list`, `textarea.wide` (buscador y tabla de superadmin).
- [x] Glassmorphism real (antes eran degradados opacos, sin blur) en `dashboard.css`:
      `backdrop-filter: blur()` + `var(--surface-glass)` en sidebar, stat-card/table-card/
      settings-card, auth-card e inline-form; además hover-lift en las tarjetas de estadísticas.
- [x] Verificación: llaves `{}` balanceadas en los 4 CSS tocados; `node --test` (6/6) sigue en verde.

## Pendiente (orden sugerido)
1. Landing (`public.css` bloque `.home-*`) y tiendas (`.store-*`): ya tienen buena base
   cinematográfica (grano, drift, shades); falta una pasada de capas de iluminación/profundidad
   adicionales si se quiere ir más allá de lo actual.
2. Componentes base reutilizables formales (Button, Card, Modal) — hoy la reutilización es solo
   por convención de clases CSS, no por componentes React.
3. 3D / modelos de joyería, partículas, parallax avanzado — requieren dependencias nuevas
   (three.js, etc.) que no se pueden instalar sin red en este entorno.
4. QA visual real en navegador y `npm run lint` / `npm run build`.

## Restricciones respetadas
- No se tocó lógica de Supabase, RLS, rutas de auth, middleware ni ningún archivo `.js`.
- No se añadieron dependencias nuevas.
- No se afirma haber hecho QA visual con navegador: no se dispone de uno en este entorno.
