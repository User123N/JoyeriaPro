import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";
import JewelScene from "@/components/JewelScene";

const shots = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=85"
];

const pillars = [
  { number: "01", title: "Catálogo exclusivo", text: "Referencias, materiales, categorías y fotografías de alta resolución organizadas en una sola vista." },
  { number: "02", title: "Identidad por tienda", text: "Logotipo, color de acento, portada y textos propios. Cada joyería conserva su carácter." },
  { number: "03", title: "Presentación comercial", text: "Un escaparate digital rápido, legible y optimizado para convertir visitas en conversaciones." }
];

const capabilities = [
  { k: "Catálogo", t: "Fichas completas", d: "Nombre, referencia, material, precio, stock, categoría e imagen principal por pieza." },
  { k: "Comercial", t: "Disponibilidad real", d: "El escaparate público muestra únicamente piezas disponibles, con aviso de últimas unidades." },
  { k: "Clientes", t: "Contacto directo", d: "Cada pieza conecta con la joyería mediante WhatsApp o teléfono, sin intermediarios." },
  { k: "Inventario", t: "Control por tienda", d: "Cada negocio administra su propio inventario, aislado del resto de la plataforma." },
  { k: "Equipo", t: "Roles y permisos", d: "Propietarios y personal autorizado acceden solo a la información que les corresponde." },
  { k: "Operación", t: "Zona horaria propia", d: "Las fechas y métricas se calculan en la zona horaria configurada por cada negocio." }
];

const advantages = [
  "Aislamiento de datos por negocio mediante políticas de acceso a nivel de fila.",
  "Escaparate público servido con revalidación, sin exponer el panel administrativo.",
  "Tema visual por tienda: color de acento y fondo configurables desde el editor.",
  "Búsqueda, filtros por categoría y orden por precio dentro del catálogo público.",
  "Estados de carga, vacío y error diseñados para no dejar al usuario sin contexto.",
  "Diseño responsive real: navegación, tablas y galerías adaptadas a cada breakpoint."
];

export default function Home() {
  return <main className="home-page">
    <header className="home-header shell">
      <Brand />
      <nav aria-label="Navegación principal">
        <a href="#plataforma">Plataforma</a>
        <a href="#panel">Panel</a>
        <a href="#tiendas">Tiendas</a>
        <a href="#catalogo">Catálogo</a>
      </nav>
      <div className="actions">
        <Link href="/login" className="btn home-login">Acceso</Link>
        <Link href="/login" className="btn primary">Empezar <span aria-hidden="true">↗</span></Link>
      </div>
    </header>

    <section className="home-hero">
      <div className="home-hero-image"><Image src={shots[0]} alt="Joyería fina en una composición editorial" fill priority sizes="100vw" unoptimized /></div>
      <div className="home-hero-shade" />
      <div className="home-hero-glow" aria-hidden="true" />
      <JewelScene className="jp-jewel-scene--home" />
      <div className="shell home-hero-content">
        <div className="eyebrow"><i /> PLATAFORMA SAAS PARA JOYERÍAS</div>
        <h1>El arte de exhibir<br /><em>lo extraordinario.</em></h1>
        <p>JoyeriaPro reúne catálogo, identidad visual y operación comercial en una plataforma sobria, rápida y precisa. Tecnología pensada para casas de joyería que cuidan cada detalle.</p>
        <div className="actions">
          <Link href="/login" className="btn primary">Explorar plataforma <span aria-hidden="true">↗</span></Link>
          <a href="#plataforma" className="btn home-outline">Conocer características <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <div className="home-hero-foot shell"><span>DISEÑO · DETALLE · DISTINCIÓN</span><span>01 / JOYERIAPRO</span></div>
    </section>

    <section id="plataforma" className="home-intro shell">
      <div className="home-intro-side"><span className="eyebrow">DISEÑADO PARA ALTA JOYERÍA</span><i className="home-rule" /></div>
      <div>
        <h2>Una arquitectura pensada<br /><em>para la exclusividad.</em></h2>
        <p>Una plataforma que reúne el catálogo, la identidad visual y la administración de tu joyería en un solo espacio, con una experiencia clara para ti y tus clientes.</p>
      </div>
    </section>

    <section className="home-problem">
      <div className="shell home-problem-grid">
        <div>
          <span className="jp-section-label">El punto de partida</span>
          <h2 className="jp-title">Una joyería excepcional<br /><em>no debería operar con herramientas dispersas.</em></h2>
        </div>
        <div className="home-problem-copy">
          <p>Hojas de cálculo, carpetas de fotos, mensajes sueltos y un escaparate que no refleja la calidad de las piezas. Cuando el catálogo vive en cinco lugares distintos, la marca pierde consistencia y el equipo pierde tiempo.</p>
          <ul>
            <li>Inventario y presentación desconectados.</li>
            <li>Piezas agotadas todavía visibles para el cliente.</li>
            <li>Identidad visual improvisada en cada canal.</li>
          </ul>
          <p className="home-problem-close">JoyeriaPro unifica ese escenario en una sola plataforma, sin sacrificar el carácter de cada casa.</p>
        </div>
      </div>
    </section>

    <section className="home-pillars shell">
      <div className="home-section-heading">
        <div><span className="eyebrow">HERRAMIENTAS PARA TU MARCA</span><h2>Todo en su lugar.<br /><em>Todo a tu estilo.</em></h2></div>
        <p>Controla la presentación de tu negocio sin perder de vista lo que hace especial a cada pieza.</p>
      </div>
      <div className="pillar-list">
        {pillars.map((item) => <article className="pillar" key={item.number}>
          <span>{item.number}</span>
          <div><h3>{item.title}</h3><p>{item.text}</p></div>
          <span className="pillar-arrow" aria-hidden="true">↗</span>
        </article>)}
      </div>
    </section>

    <section id="panel" className="home-panel-demo">
      <div className="shell">
        <div className="home-section-heading home-panel-heading">
          <div><span className="eyebrow">EL PANEL DE CONTROL</span><h2>Operación clara,<br /><em>sin ruido visual.</em></h2></div>
          <p>Un panel con indicadores reales del negocio: piezas activas, valor de inventario, stock bajo y actividad reciente. Nada que no puedas verificar.</p>
        </div>

        <div className="home-panel-frame">
          <div className="home-panel-bar" aria-hidden="true">
            <span className="home-panel-dots"><i /><i /><i /></span>
            <span className="home-panel-url">joyeriapro · panel</span>
            <span className="jp-badge">Vista ilustrativa</span>
          </div>
          <div className="home-panel-body" aria-hidden="true">
            <aside className="home-panel-side">
              <span className="home-panel-brand">✦ JoyeriaPro</span>
              {["Resumen", "Productos", "Categorías", "Inventario", "Tienda"].map((item, index) => <span className={index === 0 ? "hp-nav active" : "hp-nav"} key={item}>{item}</span>)}
            </aside>
            <div className="home-panel-main">
              <div className="hp-head"><div><small>RESUMEN</small><strong>Buenas tardes</strong></div><span className="hp-chip">Tienda activa</span></div>
              <div className="hp-stats">
                <div className="hp-stat"><small>Piezas publicadas</small><b>—</b><span>Catálogo visible</span></div>
                <div className="hp-stat"><small>Valor de inventario</small><b>—</b><span>Suma de stock</span></div>
                <div className="hp-stat"><small>Stock bajo</small><b>—</b><span>Requiere atención</span></div>
              </div>
              <div className="hp-rows">
                <span /><span /><span />
              </div>
            </div>
          </div>
        </div>
        <p className="home-demo-note">Representación del panel administrativo. Los valores reales dependen del inventario de cada negocio.</p>
      </div>
    </section>

    <section id="tiendas" className="home-editorial">
      <div className="home-editorial-image"><Image src={shots[1]} alt="Detalle editorial de una pieza de joyería" fill sizes="(max-width: 800px) 100vw, 55vw" unoptimized /></div>
      <div className="home-editorial-copy">
        <span className="eyebrow">EXPERIENCIA SIN FRICCIÓN</span>
        <h2>Menos complejidad.<br /><em>Más distinción.</em></h2>
        <p>Administra tus colecciones, categorías y la estética de tu tienda desde un panel intuitivo, rápido y con persistencia segura.</p>
        <ul className="home-check-list">
          <li>Cada tienda se publica en su propia dirección.</li>
          <li>Color de acento y portada propios del negocio.</li>
          <li>El catálogo público se actualiza con el inventario.</li>
        </ul>
        <Link href="/login" className="home-text-link">Acceder al panel de control <span aria-hidden="true">↗</span></Link>
      </div>
    </section>

    <section id="catalogo" className="home-gallery shell">
      <div className="home-gallery-heading"><span className="eyebrow">UNA IDENTIDAD VISUAL PROPIA</span><h2>Cada pieza tiene<br /><em>su propia historia.</em></h2></div>
      <div className="home-gallery-grid">
        <figure className="home-shot"><Image src={shots[2]} alt="Colección de joyería" fill sizes="(max-width: 700px) 100vw, 60vw" unoptimized /><figcaption>PIEZAS SELECCIONADAS <span>01</span></figcaption></figure>
        <figure className="home-shot home-shot-2"><Image src={shots[0]} alt="Detalle de joyería fina" fill sizes="(max-width: 700px) 100vw, 40vw" unoptimized /><figcaption>DISEÑO ATEMPORAL <span>02</span></figcaption></figure>
      </div>
    </section>

    <section className="home-capabilities">
      <div className="shell">
        <div className="home-section-heading">
          <div><span className="eyebrow">CAPACIDADES REALES</span><h2>Lo que la plataforma<br /><em>ya hace hoy.</em></h2></div>
          <p>Sin promesas de roadmap: estas son las funciones implementadas en el producto.</p>
        </div>
        <div className="capability-grid jp-reveal">
          {capabilities.map((item) => <article className="capability" key={item.t}>
            <span className="capability-k jp-badge">{item.k}</span>
            <h3>{item.t}</h3>
            <p>{item.d}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="home-advantages">
      <div className="shell home-advantages-grid">
        <div>
          <span className="jp-section-label">Por qué JoyeriaPro</span>
          <h2 className="jp-title">Ventajas que se notan<br /><em>en la operación diaria.</em></h2>
          <p className="jp-lead">Decisiones técnicas orientadas a la seguridad de los datos y a la velocidad de uso, no solo al aspecto visual.</p>
        </div>
        <ul className="advantage-list">
          {advantages.map((item) => <li key={item}><span aria-hidden="true">✦</span>{item}</li>)}
        </ul>
      </div>
    </section>

    <section className="home-cta">
      <span className="home-cta-mark" aria-hidden="true">✧</span>
      <span className="eyebrow">TU MARCA, EN PRIMER PLANO</span>
      <h2>Eleva el estándar digital<br /><em>de tu joyería.</em></h2>
      <p>Organiza tu catálogo y crea una experiencia digital memorable para tus clientes.</p>
      <Link href="/login" className="btn primary">Comenzar ahora <span aria-hidden="true">↗</span></Link>
    </section>

    <footer className="home-footer">
      <div className="home-footer-main shell">
        <Brand />
        <span>© {new Date().getFullYear()} JoyeriaPro. Todos los derechos reservados.</span>
        <Link href="/login">Acceso al panel ↗</Link>
      </div>
      <div className="home-footer-bottom shell"><span>Plataforma digital para joyerías</span><span>Diseño y gestión en un solo lugar</span></div>
    </footer>
  </main>;
}
