import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";

const pillars = [
  { number: "01", title: "Cada pieza, en su lugar.", text: "Catálogo con referencias, materiales, categorías, fotografías y precios en una vista clara." },
  { number: "02", title: "Inventario con trazabilidad.", text: "Registra entradas, salidas y ajustes. Consulta existencias y movimientos por producto." },
  { number: "03", title: "Relaciones que permanecen.", text: "Organiza tus clientes y registra ventas para tener la actividad comercial a mano." }
];

const shots = [
  ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85", "Anillo de oro con una piedra clara"],
  ["https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1100&q=85", "Piezas de joyería bajo luz cálida"],
  ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1100&q=85", "Colección de joyas doradas"]
];

export default function Home() {
  return <main className="home-page">
    <header className="home-header shell"><Brand /><nav><a href="#plataforma">La plataforma</a><a href="#experiencia">Experiencia</a><Link className="btn home-login" href="/login">Acceso privado <span>↗</span></Link></nav></header>
    <section className="home-hero" id="inicio">
      <div className="home-hero-image"><Image src={shots[0][0]} alt="Anillo de oro con una piedra clara" fill priority sizes="100vw" unoptimized /></div>
      <div className="home-hero-shade" />
      <div className="home-hero-content shell"><span className="eyebrow"><i /> TECNOLOGÍA PARA JOYERÍAS</span><h1>El arte de llevar<br />lo <em>extraordinario.</em></h1><p>Una plataforma creada para cuidar cada detalle de tu negocio: las piezas, su historia y todo lo que hace crecer tu joyería.</p><div className="actions"><Link className="btn primary" href="/login">Entrar a JoyeriaPro <span>↗</span></Link><a className="btn home-outline" href="#plataforma">Conocer la plataforma <span>↓</span></a></div></div>
      <div className="home-hero-foot shell"><span>INVENTARIO · CLIENTES · VENTAS</span><span>01 — JOYERIAPRO</span></div>
      <div className="home-hero-orbit" aria-hidden="true"><svg className="hero-ring-render" viewBox="0 0 440 440">
        <defs><linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff0c0"/><stop offset=".25" stopColor="#b78a43"/><stop offset=".52" stopColor="#f6dfa0"/><stop offset=".76" stopColor="#8a642f"/><stop offset="1" stopColor="#e7c77e"/></linearGradient><linearGradient id="ringStone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset=".45" stopColor="#d5d0c5"/><stop offset="1" stopColor="#8f8777"/></linearGradient><filter id="ringShadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="11"/></filter></defs>
        <ellipse cx="220" cy="286" rx="115" ry="30" fill="#000" opacity=".65" filter="url(#ringShadow)"/>
        <g transform="rotate(-24 220 230)"><ellipse cx="220" cy="258" rx="122" ry="88" fill="none" stroke="#49351b" strokeWidth="36"/><ellipse cx="220" cy="252" rx="122" ry="88" fill="none" stroke="url(#ringGold)" strokeWidth="28"/><path d="M106 264c15 46 56 75 114 76 56 0 98-30 114-76" fill="none" stroke="#f8e3a3" strokeWidth="3" opacity=".68"/><path d="M112 222c24-37 62-58 108-58" fill="none" stroke="#fff0c1" strokeWidth="2" opacity=".62"/></g>
        <path d="M220 114 181 155l39 57 39-57-39-41Z" fill="url(#ringStone)" stroke="#fff5dd" strokeWidth="2"/><path d="m220 114-5 43h44l-39-43Z" fill="#fff" opacity=".88"/><path d="m181 155 34 2 5 55-39-57Z" fill="#c1bbaf" opacity=".76"/><path d="m220 212 39-57-44 2 5 55Z" fill="#928b7f" opacity=".68"/><path d="m181 155 39-41 39 41" fill="none" stroke="#fff" strokeWidth="2" opacity=".84"/><circle cx="220" cy="108" r="4" fill="#fff"/>
      </svg></div>
    </section>
    <section className="home-intro shell" id="plataforma"><div className="home-intro-side"><span className="eyebrow">BELLEZA EN CADA DETALLE</span><span className="home-rule" /></div><div><h2>Tu negocio tiene una historia.<br /><em>Que cada pieza la cuente.</em></h2><p>JoyeriaPro reúne las herramientas comerciales de tu joyería en un espacio claro, elegante y fácil de usar. Desde el catálogo hasta el movimiento más reciente de inventario.</p></div></section>
    <section className="home-pillars shell"><div className="home-section-heading"><div><span className="eyebrow">DISEÑADA PARA TU OFICIO</span><h2>Una visión completa.<br /><em>Un detalle a la vez.</em></h2></div><p>Gestión comercial precisa con una experiencia a la altura de las piezas que ofreces.</p></div><div className="pillar-list">{pillars.map((pillar) => <article key={pillar.number} className="pillar"><span>{pillar.number}</span><div><h3>{pillar.title}</h3><p>{pillar.text}</p></div><span className="pillar-arrow">↗</span></article>)}</div></section>
    <section className="home-editorial" id="experiencia"><div className="home-editorial-image"><Image src={shots[1][0]} alt={shots[1][1]} fill sizes="(max-width: 800px) 100vw, 55vw" unoptimized /></div><div className="home-editorial-copy"><span className="eyebrow">UNA EXPERIENCIA CUIDADA</span><h2>Menos ruido.<br /><em>Más claridad.</em></h2><p>Una interfaz hecha para acompañar tu trabajo diario. Consulta productos, niveles de inventario, clientes y ventas sin perder de vista lo importante.</p><Link className="home-text-link" href="/login">Conoce tu espacio de trabajo <span>↗</span></Link></div></section>
    <section className="home-gallery shell"><div className="home-gallery-heading"><span className="eyebrow">OBJETOS CON CARÁCTER</span><h2>La materia inspira.<br /><em>La atención al detalle permanece.</em></h2></div><div className="home-gallery-grid">{shots.slice(1).map(([src, alt], index) => <figure className={`home-shot home-shot-${index + 1}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 720px) 80vw, 40vw" unoptimized /><figcaption>JOYERÍA <span>0{index + 1}</span></figcaption></figure>)}</div></section>
    <section className="home-cta"><div className="home-cta-mark" aria-hidden="true">✧</div><span className="eyebrow">TU JOYERÍA, CON UNA NUEVA PERSPECTIVA</span><h2>El siguiente capítulo<br /><em>empieza aquí.</em></h2><p>Accede a tu espacio de gestión y descubre JoyeriaPro.</p><Link className="btn primary" href="/login">Acceder a la plataforma <span>↗</span></Link></section>
    <footer className="home-footer"><div className="shell home-footer-main"><Brand /><span>Gestión comercial, diseñada para joyerías.</span><a href="#inicio">Volver arriba ↑</a></div><div className="shell home-footer-bottom"><span>© {new Date().getFullYear()} JoyeriaPro</span><span>Plataforma independiente para negocios de joyería</span></div></footer>
  </main>;
}
