import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";

const pillars = [
  { number: "01", title: "Catálogo exclusivo", text: "Organiza referencias, materiales, categorías y fotografías en una presentación elegante y fácil de administrar." },
  { number: "02", title: "Personalización de tienda", text: "Adapta la identidad visual, los logotipos, los colores y los textos de tu escaparate digital." },
  { number: "03", title: "Presentación comercial", text: "Ofrece a tus clientes una experiencia de catálogo sofisticada, rápida y optimizada para cualquier pantalla." }
];

const shots = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85"
];

export default function Home() {
  return (
    <main className="home-shell">
      <header className="home-header">
        <div className="home-header-inner">
          <Link href="/" className="home-brand" aria-label="JoyeriaPro, inicio"><Brand /></Link>
          <nav className="home-nav" aria-label="Navegación principal">
            <a href="#plataforma">Plataforma</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#catalogo">Catálogo</a>
          </nav>
          <div className="home-actions">
            <Link href="/login" className="home-login">Acceso</Link>
            <Link href="/login" className="home-button">Empezar <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-container">
          <span className="home-eyebrow">Plataforma digital para joyerías</span>
          <h1>El arte de exhibir<br /><em>lo extraordinario.</em></h1>
          <p className="home-hero-copy">JoyeriaPro reúne la gestión de tu catálogo y la presentación digital de tu marca en una experiencia sofisticada, clara y sencilla.</p>
          <div className="home-hero-actions">
            <Link href="/login" className="home-button">Explorar plataforma <span aria-hidden="true">↗</span></Link>
            <a href="#plataforma" className="home-button secondary">Conocer la plataforma <span aria-hidden="true">↓</span></a>
          </div>
          <div className="home-showcase">
            <div className="home-showcase-image">
              <Image src={shots[0]} alt="Detalle de una pieza de joyería fina" fill priority sizes="(max-width: 900px) 100vw, 930px" />
              <div className="home-showcase-caption"><small>Diseño · detalle · distinción</small><h2>Cada pieza merece su propio escenario.</h2></div>
            </div>
          </div>
        </div>
      </section>

      <section id="plataforma" className="home-section">
        <div className="home-container">
          <div className="home-section-heading"><small>Diseñado para el mundo de la joyería</small><h2>Una plataforma pensada<br /><em>para destacar.</em></h2></div>
          <div className="home-feature-grid">
            {pillars.map((item) => <article className="home-feature-card" key={item.number}>
              <span className="home-feature-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="experiencia" className="home-section">
        <div className="home-container home-editorial">
          <div className="home-editorial-image"><Image src={shots[1]} alt="Composición editorial de joyería" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
          <div className="home-editorial-copy">
            <small>Una experiencia sin fricción</small>
            <h2>Menos complejidad.<br /><em>Más distinción.</em></h2>
            <p>Administra tus colecciones, categorías y apariencia desde un panel intuitivo. Mantén la identidad de tu joyería en el centro de cada detalle.</p>
            <Link href="/login" className="home-text-link">Acceder al panel de control <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section id="catalogo" className="home-container home-cta">
        <small>Tu marca, en primer plano</small>
        <h2>Eleva la presencia digital<br /><em>de tu joyería.</em></h2>
        <p>Presenta tus piezas con una imagen coherente, administra tu catálogo y crea una experiencia memorable para tus clientes.</p>
        <Link href="/login" className="home-button">Comenzar ahora <span aria-hidden="true">↗</span></Link>
      </section>

      <footer className="home-footer">
        <div className="home-container home-footer-inner">
          <Brand />
          <span>© {new Date().getFullYear()} JoyeriaPro. Todos los derechos reservados.</span>
          <div className="home-footer-links"><Link href="/login">Acceso</Link><a href="#plataforma">Plataforma</a></div>
        </div>
      </footer>
    </main>
  );
}
