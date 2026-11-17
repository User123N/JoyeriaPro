import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";

const pillars = [
  { number: "01", title: "Catálogo exclusivo", text: "Gestiona referencias, materiales, categorías y fotografías de alta resolución en una vista impecable." },
  { number: "02", title: "Personalización de tienda", text: "Adapta la identidad visual, los logotipos, colores y textos de tu tienda con un editor en tiempo real." },
  { number: "03", title: "Presentación comercial", text: "Ofrece a tus clientes una experiencia de catálogo digital elegante, fluida y optimizada para conversión." }
];
const shots = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=85"
];

export default function Home() {
  return <main className="home-page">
    <header className="home-header shell">
      <Brand />
      <nav aria-label="Navegación principal">
        <a href="#plataforma">Plataforma</a><a href="#experiencia">Experiencia</a><a href="#catalogo">Catálogo</a>
      </nav>
      <div className="actions">
        <Link href="/login" className="btn home-login">Acceso</Link>
        <Link href="/login" className="btn primary">Empezar <span>↗</span></Link>
      </div>
    </header>

    <section className="home-hero">
      <div className="home-hero-image"><Image src={shots[0]} alt="Joyería fina en una composición editorial" fill priority sizes="100vw" unoptimized /></div>
      <div className="home-hero-shade" />
      <div className="shell home-hero-content">
        <div className="eyebrow"><i /> PLATAFORMA SAAS PARA JOYERÍAS</div>
        <h1>El arte de exhibir<br /><em>lo extraordinario.</em></h1>
        <p>JoyeriaPro transforma la gestión comercial y la presentación digital de tu joyería con una estética sofisticada y un rendimiento impecable.</p>
        <div className="actions">
          <Link href="/login" className="btn primary">Explorar plataforma <span>↗</span></Link>
          <a href="#plataforma" className="btn home-outline">Conocer características <span>↓</span></a>
        </div>
      </div>
      <div className="home-hero-orbit" aria-hidden="true">✧</div>
      <div className="home-hero-foot shell"><span>DISEÑO · DETALLE · DISTINCIÓN</span><span>01 / JOYERIAPRO</span></div>
    </section>

    <section id="plataforma" className="home-intro shell">
      <div className="home-intro-side"><span className="eyebrow">DISEÑADO PARA ALTA JOYERÍA</span><i className="home-rule" /></div>
      <div><h2>Una arquitectura pensada<br /><em>para la exclusividad.</em></h2><p>Una plataforma que reúne el catálogo, la identidad visual y la administración de tu joyería en un solo espacio, con una experiencia clara para ti y tus clientes.</p></div>
    </section>

    <section className="home-pillars shell">
      <div className="home-section-heading"><div><span className="eyebrow">HERRAMIENTAS PARA TU MARCA</span><h2>Todo en su lugar.<br /><em>Todo a tu estilo.</em></h2></div><p>Controla la presentación de tu negocio sin perder de vista lo que hace especial a cada pieza.</p></div>
      <div className="pillar-list">{pillars.map((item) => <article className="pillar" key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="pillar-arrow">↗</span></article>)}</div>
    </section>

    <section id="experiencia" className="home-editorial">
      <div className="home-editorial-image"><Image src={shots[1]} alt="Detalle editorial de una pieza de joyería" fill sizes="(max-width: 800px) 100vw, 55vw" unoptimized /></div>
      <div className="home-editorial-copy"><span className="eyebrow">EXPERIENCIA SIN FRICCIÓN</span><h2>Menos complejidad.<br /><em>Más distinción.</em></h2><p>Administra tus colecciones, categorías y personaliza la estética de tu tienda desde un panel administrativo intuitivo, rápido y con persistencia segura.</p><Link href="/login" className="home-text-link">Acceder al panel de control <span>↗</span></Link></div>
    </section>

    <section id="catalogo" className="home-gallery shell">
      <div className="home-gallery-heading"><span className="eyebrow">UNA IDENTIDAD VISUAL PROPIA</span><h2>Cada pieza tiene<br /><em>su propia historia.</em></h2></div>
      <div className="home-gallery-grid">
        <figure className="home-shot"><Image src={shots[2]} alt="Colección de joyería" fill sizes="(max-width: 700px) 100vw, 60vw" unoptimized /><figcaption>PIEZAS SELECCIONADAS <span>01</span></figcaption></figure>
        <figure className="home-shot home-shot-2"><Image src={shots[0]} alt="Detalle de joyería fina" fill sizes="(max-width: 700px) 100vw, 40vw" unoptimized /><figcaption>DISEÑO ATEMPORAL <span>02</span></figcaption></figure>
      </div>
    </section>

    <section className="home-cta">
      <span className="home-cta-mark" aria-hidden="true">✧</span><span className="eyebrow">TU MARCA, EN PRIMER PLANO</span>
      <h2>Eleva el estándar digital<br /><em>de tu joyería.</em></h2>
      <p>Organiza tu catálogo y crea una experiencia digital memorable para tus clientes.</p>
      <Link href="/login" className="btn primary">Comenzar ahora <span>↗</span></Link>
    </section>

    <footer className="home-footer">
      <div className="home-footer-main shell"><Brand /><span>© {new Date().getFullYear()} JoyeriaPro. Todos los derechos reservados.</span><Link href="/login">Acceso al panel ↗</Link></div>
      <div className="home-footer-bottom shell"><span>Plataforma digital para joyerías</span><span>Diseño y gestión en un solo lugar</span></div>
    </footer>
  </main>;
}
