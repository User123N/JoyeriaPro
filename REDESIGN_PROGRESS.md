# JoyeriaPro — Redesign Progress

## Estado

Rediseño completo aplicado sobre el código real y verificado con build de producción + capturas de
navegador (Edge headless vía CDP). No quedan capas de "refinamiento" sobre el diseño anterior: los tres
archivos de estilo públicos/panel se reescribieron desde cero.

- `next build` → OK (14/14 rutas, sin errores de ESLint).
- `node --test tests/lib.test.mjs` → 6/6 pass.
- Rutas HTTP en `next start`: `/`, `/login`, `/forgot-password`, `/reset-password`, `/setup` → 200.

## Causa raíz del problema anterior

Las clases base que usaba todo el markup (`shell`, `btn`, `brand`, `eyebrow`, `muted`, `page-enter`)
**no existían en ningún CSS**: solo aparecían dentro de media queries o en selectores descendientes.
Por eso el rediseño anterior no se reflejaba: la página se pintaba sin estructura, sin botones y sin
sistema tipográfico. Se comprobó buscando las definiciones en los CSS fuente y en el bundle compilado
(`.shell{`, `.btn{`, `.brand{` → ausentes).

La corrección fue reescribir los estilos, no añadir más reglas encima.

## Archivos modificados

- **`src/app/public.css` — reescrito completo (landing + tienda).**
  Primitivas reales: `.shell` (1320px), `.btn` (`primary` / `ghost` / `danger`), `.brand`,
  `.eyebrow`, `.muted`, `.section-heading`, `.page-enter`, `.notice`, `.skeleton`, `.empty-state`.
  Landing: hero split editorial, intro, problema, pilares en lista, demo de panel, editorial, galería,
  capacidades, ventajas, CTA y footer. Tienda: header sticky con blur, hero cinematográfico,
  intro, categorías, catálogo (búsqueda/chips/orden), grilla de producto, diálogo, historia, galería,
  contacto y footer. Responsive propio en 1180 / 960 / 760 / 620 px.
- **`src/app/dashboard.css` — reescrito completo (panel + auth).**
  Topbar sticky full-bleed, sidebar con rail dorado e indicador activo, stat-cards, tarjetas de tabla,
  listas de entidades, formularios, búsqueda, auth split con pieza gráfica CSS. Responsive en 1000 / 900 / 600 px.
- **`src/app/editor.css` — reescrito.** Mismo sistema que el panel: radios 2–4 px, serif en títulos,
  preview de tienda con estados desktop/tablet/mobile.
- **`src/app/globals.css` — paleta y design system.** Tokens obsidian/graphite/champagne-gold/ivory,
  capa `.jp-*`, fondo ambiental, scrollbar, `.jp-reveal` con `animation-timeline` (sin JS).
- **`src/app/page.js` — landing ampliada.** Hero, problema, pilares, demo de panel marcada como
  "Vista ilustrativa" (sin cifras inventadas), editorial, galería, capacidades reales del producto,
  ventajas, CTA. Todo el copy describe funciones que existen en el código.
- **`src/app/[slug]/page.js` — limpieza.** Eliminado un fragmento JSX vacío que había quedado del
  condicional anterior; `#historia` y `#contacto` se renderizan siempre (antes eran anclas muertas con
  `showCatalog=false`).
- **`src/app/home.css` — eliminado.** Código muerto: no se importaba en `layout.js` y contradecía `public.css`.

## Conservado sin cambios

- Toda la lógica de Supabase (server/client/admin), middleware, RLS, auth y aislamiento multi-tenant.
- Contratos de datos: RPC `get_published_site_config`, dashboard, superadmin, formularios.
- Dependencias: **ninguna añadida**. Sin fuentes nuevas, sin JS de animación, sin 3D real.
- URLs de imágenes: solo los 3 IDs de Unsplash que ya usaba el proyecto (verificados 200).

## Decisiones de diseño

- **Estética**: obsidian + dorado, serif display para titulares, sans en versalitas con tracking amplio
  para etiquetas, radios 2–4 px, hairlines de 1 px y un solo recurso de luz radial por sección.
- **Fotografía de marketing**: filtro "gilded monochrome"
  (`grayscale(1) sepia(.46) saturate(1.55) hue-rotate(-8deg) brightness(.74)`), para que fotos de
  fuentes distintas se lean como una serie. **Nunca** se aplica a las imágenes de producto de los tenants.
- **Movimiento**: solo entrada de página, hover de tarjetas, flotación del ornamento y `reveal` por
  scroll; todo desactivado con `prefers-reduced-motion`.
- **Densidad**: la landing y la tienda comparten `.shell`, `.btn` y `.eyebrow`; el panel reutiliza el
  mismo vocabulario, no un tema aparte.

## Verificación visual ejecutada

Capturas reales con Edge headless + Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride` para
que el viewport coincida con el solicitado), revisadas una por una:

- Landing **1440 px** (página completa) y **390 px** (viewport): `scrollWidth === innerWidth`, sin overflow.
- Login **1440 × 950**.
- Tienda **1440 px** (hero, categorías, catálogo) y **390 px** (hero, catálogo, categorías).
- Panel **1440 × 950**, **900 × 1000** (sidebar horizontal) y **390 × 844**.

Bugs reales encontrados en las capturas y corregidos:

1. `.catalog-search` con `flex-basis: 320px` heredado en columna → se convertía en 320 px de altura.
2. Header de la tienda en móvil con filas desordenadas (marca/nav/CTA) → grid explícito por filas.
3. `.capability-grid` con `auto-fit` dejaba 5 + 1 tarjetas → ahora 3 columnas (2 en tablet, 1 en móvil).
4. Topbar de auth no era full-bleed → `padding-inline: max(...)`.
5. H1 del hero desbordaba en móvil → `clamp()` + `overflow-wrap`.
6. Panel en móvil: la barra lateral horizontal forzaba el ancho del grid (`min-width: auto`) y la página
   se estiraba a 562 px → `minmax(0, 1fr)` + `min-width: 0` en los hijos y máscara de scroll en `.side-nav`.
7. Grilla de categorías con 3 elementos dejaba una celda vacía → `auto-fit` sin `span` fijo.

## Limitaciones reales de este entorno

1. **`/[slug]` no se puede abrir en runtime**: no existe `.env.local` con credenciales de Supabase
   (solo `.env.example`), así que la ruta lanza "Faltan variables públicas de Supabase". La tienda se
   validó con un harness estático que carga `globals.css + public.css` y el mismo markup de la ruta.
2. **Panel y auth no accesibles sin sesión**: el dashboard exige usuario y RLS. Se validó con un harness
   estático que carga `globals.css + public.css + dashboard.css` y el markup real de los componentes.
3. **Sin Playwright**: no está instalado y no hay red para instalarlo. El QA se hizo con Edge headless
   por CDP (capturas + consultas de layout), no con tests end-to-end.
4. **Sin 3D real**: no se añadió three.js ni assets GLB; los ornamentos son CSS.
5. **Sin pruebas con datos reales de tenants**: estilos y layout están verificados, pero el
   comportamiento con catálogos largos, imágenes caídas o textos extremos no se probó en vivo.


---

## Seguimiento de implementación — rama `redesign/complete-futuristic-luxury`

### Cambios aplicados en esta continuación

- Añadido `src/components/JewelScene.js`: escena de gema con geometría CSS 3D, anillo metálico, facetas, órbitas y reflejos.
- Añadido parallax reactivo a puntero y desplazamiento, con `requestAnimationFrame`, limpieza de listeners y respeto a `prefers-reduced-motion`.
- Integrada la escena en la landing, en la cabecera de cada tienda dinámica y en las pantallas de inicio de sesión, recuperación y cambio de contraseña.
- Añadido `src/app/experience.css), importado desde el layout global, para redondear controles y superficies e incorporar una capa visual de glassmorphism a landing, catálogo, tienda, dashboard y superadministración.
- No se añadieron paquetes ni se tocaron las migraciones SQL, políticas RLS, consultas, autenticación ni archivos de configuración de Supabase.

### Precisión sobre el 3D

La escena utiliza transformaciones CSS 3D y geometría facetada en el navegador; no utiliza Three.js/WebGL ni modelos GLB. Se eligió esta implementación ligera para no introducir una dependencia pesada o alterar el lockfile.

### Validación pendiente

- Los cambios de código se guardaron en la rama indicada.
- No se ejecutó `npm install`, `npm run build`, el servidor local ni Playwright desde esta conexión a GitHub.
- Falta validar compilación, hidratación, render en navegador, breakpoints y el comportamiento conectado a Supabase con credenciales locales.
- No se afirma que las pruebas visuales o funcionales hayan pasado. Ejecutarlas en el entorno local antes de fusionar.


---

## Nueva dirección — Luxury Digital Atelier

Actualización preparada en la rama `feat/luxury-atelier-complete`.

### Dirección visual
- Tres plantillas públicas por tienda: Noir Atelier, Champagne Studio y Modern Gallery.
- Configuración JSONB ampliada de forma compatible: plantilla, portada HTTPS, contenido de historia y visibilidad de secciones.
- El editor conserva los campos existentes y agrega selección de plantilla, imagen, textos de marca, colores y controles de secciones.
- La landing y las pantallas de autenticación usan ahora el componente WebGL.

### 3D
- Se añadió `src/components/WebGLJewelScene.js`, que genera geometría de malla para un anillo, gema facetada y engastes, con iluminación GLSL y rotación por puntero.
- No requiere paquete 3D adicional.
- Dispone de fallback estático y respeta `prefers-reduced-motion`.
- Precisión: es geometría WebGL procedural; no es un GLB escaneado ni una fotografía 3D de producto.

### Administración y datos
- Dashboard: resumen de catálogo, gráfico de ventas pagadas de siete días en la zona horaria del negocio y alertas de stock bajo.
- Productos, categorías y clientes: ahora permiten editar registros existentes además de crear y eliminar.
- Configuración: nombre, descripción, teléfono, dirección y ciudad se guardan.
- Las estadísticas reflejan los registros recientes cargados por el panel (límite actual de 100 por conjunto), no un informe contable histórico.
- No se modificaron migraciones, tablas, funciones SQL, políticas RLS, credenciales ni datos de Supabase.

### Verificación
- Se añadieron pruebas unitarias de plantillas, compatibilidad con configuraciones antiguas, colores y URLs de imagen.
- Build, lint, pruebas automáticas, QA responsive y pruebas con cuentas conectadas a Supabase siguen pendientes de ejecución en entorno local/CI.
- No fusionar esta rama hasta completar esa verificación.

### Build verificado en preview
- Commit verificado: c66f6465a532f4ce4a3bb5f1afa7213e2c65ae6e.
- Vercel: READY; check GitHub: success.
- npm run test ejecutado antes de next build: 10/10 aprobadas, 0 fallidas.
- Next.js: compilación correcta; lint/check de tipos en build; 14/14 páginas estáticas generadas.
- Landing, login, recuperar contraseña y restablecer contraseña responden HTTP 200 en preview.
- Falta QA visual interactiva y validación de datos/sesiones reales en Supabase.

---

## Atelier Immersive Polish — 2026-11-17

- Añadido src/app/atelier-immersive.css: textura ambiental por CSS, capas glass, radios amplios, reflejos, sombras y animaciones suaves para landing, tiendas, dashboard, editor y autenticación.
- Reescrita la escena WebGL para incluir el anillo central, dos bandas secundarias, dos órbitas, gemas facetadas, perlas esféricas y engastes (más de 30 elementos geométricos).
- Shaders con iluminación difusa, especular y rim light; la escena pausa su animación fuera de viewport o con la pestaña oculta, limita el pixel ratio y respeta movimiento reducido.
- Añadido AtelierObjectGarden para decoración dimensional en el encabezado del dashboard y la vista previa del editor.
- Sin dependencias adicionales y sin cambios en Supabase, Auth, RLS, RPC, migraciones o datos.
- Preview Vercel READY; check GitHub success; 10/10 pruebas, build de producción y 14/14 rutas generadas.
- Rutas landing y auth respondieron HTTP 200; CSS de preview confirma el nuevo sistema de radios y texturas.
- QA visual con sesión autenticada y medición de rendimiento en equipos móviles sigue pendiente.