# JoyeriaPro — Luxury Digital Atelier

## Dirección de producto

Convertir JoyeriaPro en una plataforma de lujo digital: narrativa editorial, tecnología visible pero discreta, escaparates con identidad propia y una administración fiable para operaciones diarias de una joyería.

### Decisiones confirmadas
- Dirección artística híbrida: fotografía editorial + interacción tecnológica.
- Escena 3D real: malla WebGL procedural de anillo y gema facetada, iluminación GLSL y rotación interactiva.
- Tres plantillas: Noir Atelier, Champagne Studio y Modern Gallery.
- Dashboard avanzado: indicadores de inventario, ventas pagadas de los últimos siete días y alertas de existencias.
- Alcance total: landing, autenticación, tiendas públicas, catálogo, panel, editor y superadministración.

## Arquitectura

### Frontend
- Next.js App Router y React 19, manteniendo el stack existente.
- src/lib/store-themes.js centraliza temas, configuración predeterminada, normalización y validación de URLs/colores.
- src/components/WebGLJewelScene.js dibuja geometría 3D mediante WebGL sin añadir una dependencia al bundle. Incluye fallback si WebGL no está disponible, soporte de movimiento reducido, límite de pixel ratio y limpieza de listeners/recursos.
- src/app/atelier.css aplica los tres sistemas visuales, editor y panel.
- La tienda resuelve una plantilla a partir de la configuración publicada de cada negocio.

### Datos y seguridad
- Se mantienen Supabase Auth, businesses, business_members, productos, categorías, clientes, ventas, movimientos, site_configs, políticas RLS y RPC pública existentes.
- site_configs.draft y site_configs.published siguen siendo JSONB. Las claves nuevas usan valores por defecto cuando una tienda antigua no las tiene.
- No se reemplazan ni renombran tablas, no se eliminan columnas y no se ejecuta una migración.
- La URL de portada personalizada solo se acepta si usa HTTPS.
- Los permisos de escritura siguen siendo responsabilidad de las políticas RLS existentes; el frontend no intenta elevar privilegios.

## Experiencias

### Landing y autenticación
- Escena WebGL de joya construida con malla triangular, material dorado, gema facetada e iluminación interactiva.
- El contenido, accesos, formularios y navegación existentes se conservan.
- Si WebGL falla, aparece un motivo geométrico estático.

### Tres plantillas de tienda
- Noir Atelier: obsidiana y oro cálido, fotografía dramática.
- Champagne Studio: marfil y arena, composición editorial clara.
- Modern Gallery: grafito y acero, estética contemporánea.
- Se mantienen catálogo, contacto, datos de cada comercio y RPC de publicación.
- El editor permite título, textos, imagen HTTPS, color, plantilla y visibilidad de secciones.

### Dashboard
- Resumen de productos cargados, disponibilidad, stock bajo y valor estimado de los registros cargados.
- Gráfico de ventas con estado pagado en siete días y zona horaria del negocio.
- Alertas de stock por umbral configurado.
- CRUD de productos, categorías y clientes con edición además de alta y eliminación.
- Configuración del negocio guarda nombre, descripción, teléfono, dirección y ciudad.
- Las cifras visibles se limitan a los registros que el panel ya carga (hasta 100 por conjunto); no se presentan como contabilidad histórica completa.

## Archivos principales añadidos/modificados
- src/lib/store-themes.js
- src/components/WebGLJewelScene.js
- src/components/DashboardInsights.js
- src/app/atelier.css
- src/app/layout.js
- src/app/page.js
- src/app/[slug]/page.js
- src/app/dashboard/site-editor.js
- src/app/dashboard/manage.js
- páginas de login y recuperación
- tests/lib.test.mjs

## Validación y límites

### Añadido
- Pruebas unitarias para las tres plantillas, compatibilidad con configuraciones antiguas, rechazo de IDs/colores inválidos y URLs HTTPS.

### Pendiente en entorno de ejecución
- npm.cmd test
- npm.cmd run lint
- npm.cmd run build
- Pruebas de navegador en desktop/tablet/móvil y verificación con una cuenta real de cada rol.
- Pruebas conectadas al proyecto Supabase correcto y datos reales de varios negocios.
- Prueba de tienda pública con WebGL activado/desactivado y pérdida de contexto.

### Límites funcionales que no se deben ocultar
- La escena es una malla 3D procedural WebGL, no un modelo GLB escaneado/fotorrealista importado.
- Las estadísticas respetan el límite actual de 100 registros por conjunto y no sustituyen informes contables.
- El módulo Usuarios y permisos mantiene su implementación informativa; no se añadió invitación/cambio de roles porque la política y el flujo privilegiado actuales no ofrecen una ruta de escritura confirmada.
- La personalización de imagen usa URL HTTPS; todavía no incorpora un flujo de subida de archivos a Storage.

## Reglas para la siguiente verificación
1. Ejecutar pruebas, lint y build en una copia con Node y dependencias del lockfile.
2. Probar las tres plantillas con tiendas de prueba y verificar que sus antiguos datos sigan visibles.
3. Comprobar RLS con dos negocios distintos y usuarios owner/admin/manager/seller/viewer.
4. Validar una vez con WebGL y otra forzando fallback.
5. Revisar responsive, accesibilidad de controles y prefers-reduced-motion.
6. Solo después de que CI/build y las pruebas conectadas pasen, fusionar el PR a main.

## Preservación de producción
Este branch no modifica Supabase, no ejecuta migraciones y no contiene credenciales. No fusionar ni desplegar sin completar la verificación pendiente.