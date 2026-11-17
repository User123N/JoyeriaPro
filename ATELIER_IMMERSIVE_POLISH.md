# Atelier Immersive Polish

## Objetivo
Profundizar el lenguaje visual de JoyeriaPro sin tocar el dominio de negocio ni sus contratos de Supabase: esquinas redondeadas, superficies de vidrio, textura ambiental, animación sutil y una constelación 3D de varias piezas.

## Cambios visuales
- Nuevo src/app/atelier-immersive.css, cargado al final del layout global.
- Fondo con gradientes ambientales, micrograno, líneas satinadas y patrones de puntos CSS; no depende de imágenes de textura externas.
- Radios amplios y consistentes para navegación, tarjetas, botones, formularios, catálogos, panel y editor.
- Superficies con vidrio, reflejos, bordes de luz, profundidad y sombras en capas.
- Estados hover con elevación y movimiento; animaciones de entrada y desplazamiento reducido respetado.
- Las tres plantillas de tienda conservan sus paletas; las nuevas capas son transversales.

## 3D
- src/components/WebGLJewelScene.js sustituye la escena simple por una composición WebGL procedural.
- Incluye el anillo principal, bandas secundarias, dos órbitas metálicas, gemas facetadas, perlas esféricas y engastes: más de 30 elementos geométricos en la composición.
- Shaders GLSL de iluminación difusa, reflejos especulares, luz de contorno y brillo animado.
- Interacción con puntero, límite de pixel ratio, pausa fuera de pantalla/si la pestaña está oculta, soporte de prefers-reduced-motion y fallback CSS.
- No se añadió Three.js ni dependencia de render 3D externa.
- AtelierObjectGarden añade una pequeña composición dimensional CSS al dashboard y al preview del editor.

## Compatibilidad y preservación
- Se conserva Next.js 15.5.28 y React 19.
- Sin cambios de tablas, columnas, migraciones, Auth, RLS, RPC, configuración JSONB ni registros de Supabase.
- Sin nuevos paquetes ni modificaciones del lockfile.
- Se mantienen las 3 plantillas y el editor publicados previamente.

## Validación del preview
- Vercel: READY; check GitHub: success.
- Build: npm run test && next build.
- Pruebas: 10 aprobadas, 0 fallidas.
- Next.js compiló correctamente, ejecutó lint/type-check durante build y generó 14/14 rutas estáticas.
- Landing, login, forgot-password y reset-password: HTTP 200.
- El CSS servido contiene tokens --atelier-radius-xl, texturas repetidas y estilos de AtelierObjectGarden.
- No se ha hecho QA de navegador con sesión de negocio autenticada ni se ha medido FPS en distintos dispositivos; eso queda pendiente.

## Archivos
- src/components/WebGLJewelScene.js
- src/components/AtelierObjectGarden.js
- src/app/atelier-immersive.css
- src/app/layout.js
- src/app/dashboard/manage.js
- src/app/dashboard/site-editor.js