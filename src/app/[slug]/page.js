import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PublicCatalog from "@/components/PublicCatalog";
import WebGLJewelScene from "@/components/WebGLJewelScene";
import WhatsAppButton from "@/components/WhatsAppButton";
import MaisonHeader from "@/components/MaisonHeader";
import MaisonCategoryGrid from "@/components/MaisonCategoryGrid";
import { normalizeSiteConfig, safeExternalImage } from "@/lib/store-themes";

export const revalidate = 60;

const DEMO_SLUG = "maison-aurelia-demo";
const DEMO_BUSINESS = {
  id: "maison-aurelia-demo",
  name: "Maison Aurelia",
  slug: DEMO_SLUG,
  status: "active",
  description: "Joyería de autor: piezas cuidadosamente seleccionadas para celebrar lo extraordinario.",
  city: "Cartagena",
  address: "Centro Histórico, Cartagena, Colombia",
  phone: process.env.NEXT_PUBLIC_WHATSAPP || "",
  logo_url: ""
};

const image = (id) => "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=1200&q=88";

const DEMO_PRODUCTS = [
  { id: "ma-001", name: "Anillo Aurora", description: "Una silueta luminosa con una piedra central y detalles delicados.", reference: "MA-001", material: "Oro amarillo 18K", price: 2450000, stock: 5, category: { name: "Anillos" }, image_url: image("photo-1605100804763-247f67b3557e"), images: [image("photo-1605100804763-247f67b3557e"), image("photo-1603561591411-07134e71a2a9")] },
  { id: "ma-002", name: "Solitario Celeste", description: "Una pieza de líneas limpias pensada para acompañar momentos inolvidables.", reference: "MA-002", material: "Oro blanco 18K", price: 3180000, stock: 3, category: { name: "Anillos" }, image_url: image("photo-1611652022419-a9419f74343d"), images: [image("photo-1611652022419-a9419f74343d"), image("photo-1605100804763-247f67b3557e")] },
  { id: "ma-003", name: "Anillo Luz de Luna", description: "Volúmenes suaves y un acabado cálido de inspiración atemporal.", reference: "MA-003", material: "Oro rosa 18K", price: 1890000, stock: 7, category: { name: "Anillos" }, image_url: image("photo-1603561591411-07134e71a2a9"), images: [image("photo-1603561591411-07134e71a2a9"), image("photo-1611652022419-a9419f74343d")] },
  { id: "ma-004", name: "Collar Aura", description: "Un punto de luz sutil para llevar cerca todos los días.", reference: "MA-004", material: "Oro amarillo 18K", price: 1320000, stock: 8, category: { name: "Collares" }, image_url: image("photo-1599643478518-a784e5dc4c8f"), images: [image("photo-1599643478518-a784e5dc4c8f"), image("photo-1617038220319-276d3cfab638")] },
  { id: "ma-005", name: "Gargantilla Constelación", description: "Una composición delicada inspirada en el brillo de las estrellas.", reference: "MA-005", material: "Plata 925 con baño de oro", price: 980000, stock: 4, category: { name: "Collares" }, image_url: image("photo-1617038220319-276d3cfab638"), images: [image("photo-1617038220319-276d3cfab638"), image("photo-1599643478518-a784e5dc4c8f")] },
  { id: "ma-006", name: "Aretes Étoile", description: "Movimiento y destellos discretos en una pieza de carácter elegante.", reference: "MA-006", material: "Oro blanco 18K", price: 1140000, stock: 6, category: { name: "Aretes" }, image_url: image("photo-1535632066927-ab7c9ab60908"), images: [image("photo-1535632066927-ab7c9ab60908"), image("photo-1611652022419-a9419f74343d")] },
  { id: "ma-007", name: "Aretes Perla", description: "Una interpretación contemporánea de un clásico de la joyería.", reference: "MA-007", material: "Perla cultivada y plata 925", price: 760000, stock: 9, category: { name: "Aretes" }, image_url: image("photo-1611652022419-a9419f74343d"), images: [image("photo-1611652022419-a9419f74343d"), image("photo-1535632066927-ab7c9ab60908")] },
  { id: "ma-008", name: "Pulsera Esencia", description: "Una línea fina que aporta un brillo sereno a cada conjunto.", reference: "MA-008", material: "Oro amarillo 18K", price: 1560000, stock: 4, category: { name: "Pulseras" }, image_url: image("photo-1611591437281-460bfbe1220a"), images: [image("photo-1611591437281-460bfbe1220a"), image("photo-1611652022419-a9419f74343d")] },
  { id: "ma-009", name: "Brazalete Soleil", description: "Una pieza escultural con presencia ligera y acabado pulido.", reference: "MA-009", material: "Acero con baño de oro", price: 890000, stock: 10, category: { name: "Pulseras" }, image_url: image("photo-1611652022419-a9419f74343d"), images: [image("photo-1611652022419-a9419f74343d"), image("photo-1611591437281-460bfbe1220a")] },
  { id: "ma-010", name: "Reloj Héritage", description: "Proporciones equilibradas y detalles clásicos para una estética refinada.", reference: "MA-010", material: "Acero inoxidable", price: 2250000, stock: 3, category: { name: "Relojes" }, image_url: image("photo-1523170335258-f5ed11844a49"), images: [image("photo-1523170335258-f5ed11844a49")] },
  { id: "ma-011", name: "Dije Lumière", description: "Un pequeño símbolo para personalizar tus piezas favoritas.", reference: "MA-011", material: "Oro amarillo 18K", price: 540000, stock: 12, category: { name: "Dijes" }, image_url: image("photo-1599643478518-a784e5dc4c8f"), images: [image("photo-1599643478518-a784e5dc4c8f"), image("photo-1617038220319-276d3cfab638")] },
  { id: "ma-012", name: "Medalla Origen", description: "Una forma esencial con un acabado delicado y contemporáneo.", reference: "MA-012", material: "Plata 925", price: 420000, stock: 8, category: { name: "Dijes" }, image_url: image("photo-1617038220319-276d3cfab638"), images: [image("photo-1617038220319-276d3cfab638"), image("photo-1599643478518-a784e5dc4c8f")] }
];

const DEMO_SITE_CONFIG = {
  template: "noir",
  tagline: "JOYERÍA DE AUTOR · CARTAGENA",
  heroTitle: "Elegancia que trasciende",
  heroDescription: "Descubre piezas de joyería seleccionadas para acompañar los momentos que merecen quedarse contigo.",
  heroImage: image("photo-1535632066927-ab7c9ab60908"),
  accent: "#c9a365",
  background: "#090806",
  text: "#f5eee3",
  storyTitle: "Diseñadas para guardar historias.",
  storyText: "En Maison Aurelia creemos en la belleza de los detalles. Nuestra selección reúne formas, materiales y acabados que convierten cada pieza en parte de una historia personal.",
  sections: { intro: true, categories: true, catalog: true, story: true, gallery: true, contact: true }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (slug === DEMO_SLUG) {
    return {
      title: "Maison Aurelia | Joyería de autor",
      description: "Descubre Maison Aurelia: una selección de anillos, collares, aretes y piezas especiales."
    };
  }
  return { title: slug + " | JoyeriaPro", description: "Descubre una colección de joyería seleccionada con cuidado." };
}

function MaisonAureliaDemo({ business, collection, content }) {
  const categories = [...new Set(collection.map((product) => product.category?.name).filter(Boolean))];
  const gallery = collection.filter((product) => product.image_url);
  const heroImage = safeExternalImage(content.heroImage) || DEMO_SITE_CONFIG.heroImage;

  return (
    <main className="storefront storefront--noir maison-storefront" style={{ "--site-accent": content.accent, "--site-background": content.background, "--site-foreground": content.text }}>
      <div className="maison-texture" aria-hidden="true" />
      <WhatsAppButton phone={business.phone} name={business.name} />
      <MaisonHeader />

      <section className="maison-hero" id="inicio">
        <div className="maison-hero__image" aria-hidden="true">
          <Image src={heroImage} alt="" fill priority sizes="100vw" unoptimized />
        </div>
        <div className="maison-hero__veil" />
        <div className="maison-hero__glow" />
        <WebGLJewelScene className="jp-webgl-jewel--store maison-hero__jewel" />
        <div className="maison-hero__copy">
          <span className="maison-eyebrow"><i /> {content.tagline}</span>
          <p className="maison-hero__overline">EL ARTE DE LOS DETALLES</p>
          <h1>{content.heroTitle}</h1>
          <p className="maison-hero__description">{content.heroDescription}</p>
          <div className="maison-hero__actions">
            <a className="maison-button maison-button--gold" href="#catalogo">Descubrir colección <span>↗</span></a>
            <a className="maison-button maison-button--quiet" href="#historia">Conocer la casa <span>↓</span></a>
          </div>
        </div>
        <div className="maison-hero__caption"><span>MAISON AURELIA</span><span>CARTAGENA · COLOMBIA</span><span>01 — 04</span></div>
        <div className="maison-hero__seal" aria-hidden="true"><span>MAISON</span><b>✧</b><span>AURELIA</span></div>
      </section>

      <section className="maison-intro maison-container" id="colecciones">
        <div className="maison-intro__label">
          <span className="maison-eyebrow"><i /> UNA SELECCIÓN ESPECIAL</span>
          <span className="maison-intro__rule" />
          <span className="maison-intro__number">01 / COLECCIONES</span>
        </div>
        <div className="maison-intro__body">
          <h2>La belleza vive<br /><em>en cada detalle.</em></h2>
          <p>Materiales que enamoran, siluetas que permanecen y piezas elegidas para expresar tu propia esencia.</p>
        </div>
      </section>

      <section className="maison-categories maison-container" aria-labelledby="maison-categories-title">
        <div className="maison-section-heading">
          <div><span className="maison-eyebrow"><i /> EXPLORA NUESTROS UNIVERSOS</span><h2 id="maison-categories-title">Colecciones <em>Maison</em></h2></div>
          <span className="maison-section-count">0{categories.length} CATEGORÍAS</span>
        </div>
        <MaisonCategoryGrid categories={categories} collection={collection} />
      </section>

      <section className="maison-catalogue maison-container" id="catalogo">
        <div className="maison-section-heading">
          <div><span className="maison-eyebrow"><i /> PIEZAS SELECCIONADAS</span><h2>Encuentra tu <em>pieza especial.</em></h2></div>
          <span className="maison-section-count">{collection.length} PIEZAS DISPONIBLES</span>
        </div>
        <PublicCatalog products={collection} business={business} />
      </section>

      <section className="maison-story" id="historia">
        <div className="maison-story__image">
          <Image src={gallery[1]?.image_url || heroImage} alt="Selección de joyería Maison Aurelia" fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized />
          <span className="maison-story__image-note">EL VALOR DE LO QUE PERMANECE</span>
        </div>
        <div className="maison-story__copy">
          <span className="maison-eyebrow"><i /> {business.name.toUpperCase()} · {business.city.toUpperCase()}</span>
          <h2>{content.storyTitle}</h2>
          <p>{content.storyText}</p>
          <div className="maison-story__signature"><span>Con intención,</span><b>Maison Aurelia</b></div>
        </div>
      </section>

      <section className="maison-gallery maison-container" aria-labelledby="maison-gallery-title">
        <div className="maison-section-heading">
          <div><span className="maison-eyebrow"><i /> MATERIA, LUZ Y FORMA</span><h2 id="maison-gallery-title">Un vistazo <em>de cerca.</em></h2></div>
          <span className="maison-section-count">MAISON AURELIA · 2026</span>
        </div>
        <div className="maison-gallery__grid">
          {gallery.slice(2, 6).map((product, index) => (
            <figure className={"maison-gallery__item maison-gallery__item--" + (index + 1)} key={product.id}>
              <div>{product.image_url && <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 700px) 80vw, 32vw" unoptimized />}</div>
              <figcaption><span>{product.name}</span><small>{product.material || product.category?.name}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="maison-contact" id="contacto">
        <div className="maison-contact__ornament" aria-hidden="true">✧</div>
        <span className="maison-eyebrow"><i /> UNA PIEZA, UNA HISTORIA</span>
        <h2>Lo extraordinario<br /><em>te está esperando.</em></h2>
        <p>Explora la selección Maison Aurelia y encuentra una pieza que hable de ti.</p>
        <a className="maison-button maison-button--gold" href="#catalogo">Explorar la colección <span>↗</span></a>
        <span className="maison-contact__location">{business.address} · {business.city}</span>
      </section>

      <footer className="maison-footer">
        <div className="maison-footer__main maison-container">
          <a href="#inicio" className="maison-brand">
            <span className="maison-brand__mark">✧</span>
            <span className="maison-brand__word">Maison <b>Aurelia</b><small>JOYERÍA DE AUTOR</small></span>
          </a>
          <div className="maison-footer__links"><a href="#colecciones">Colecciones</a><a href="#catalogo">Piezas</a><a href="#historia">La casa</a><a href="#contacto">Contacto</a></div>
          <a className="maison-back-top" href="#inicio">Volver arriba ↑</a>
        </div>
        <div className="maison-footer__bottom maison-container">
          <span>© {new Date().getFullYear()} Maison Aurelia</span>
          <span>Cartagena · Colombia</span>
          <span>Experiencia de demostración · Diseñado con JoyeriaPro</span>
        </div>
      </footer>
    </main>
  );
}

export default async function PublicJewelryPage({ params }) {
  const { slug } = await params;
  const isDemo = slug === DEMO_SLUG;
  let business;
  let products;
  let site;

  if (isDemo) {
    business = DEMO_BUSINESS;
    products = DEMO_PRODUCTS;
    site = DEMO_SITE_CONFIG;
  } else {
    const sb = await createClient();
    const { data, error } = await sb.from("businesses")
      .select("id,name,slug,status,description,logo_url,phone,address,city")
      .eq("slug", slug).eq("status", "active").maybeSingle();
    if (error || !data) notFound();
    business = data;

    const results = await Promise.all([
      sb.from("products").select("id,name,description,reference,material,price,image_url,stock,category:categories(name)")
        .eq("business_id", business.id).eq("available", true).gt("stock", 0).order("created_at", { ascending: false }),
      sb.rpc("get_published_site_config", { target_slug: slug })
    ]);
    products = results[0].data || [];
    site = results[1].data || {};
  }

  const content = normalizeSiteConfig(site || {}, business);
  const collection = products || [];

  if (isDemo) return <MaisonAureliaDemo business={business} collection={collection} content={content} />;

  const categories = [...new Set(collection.map((product) => product.category?.name).filter(Boolean))];
  const gallery = collection.filter((product) => product.image_url).slice(0, 4);
  const showCatalog = content.showCatalog !== false;
  const heroImage = safeExternalImage(content.heroImage) || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2200&q=90";
  const phone = (business.phone || "").replace(/\D/g, "");
  const whatsapp = phone ? "https://wa.me/" + (phone.length === 10 ? "57" + phone : phone) : null;

  return <main className={"storefront storefront--" + content.template} style={{ "--site-accent": content.accent || "#c6a15b", "--site-background": content.background || "#080808", "--site-foreground": content.text || "#f2eee7" }}>
    <header className="store-header">
      <div className="store-header-inner">
        <a href="#inicio" className="store-brand" aria-label={business.name + ", inicio"}>
          {business.logo_url ? <Image src={business.logo_url} alt="" width={42} height={42} unoptimized /> : <span className="store-brand-mark">✦</span>}
          <span>{business.name}<small>{business.city || "JOYERÍA"}</small></span>
        </a>
        <nav className="store-nav" aria-label="Navegación principal">
          {showCatalog && <a href="#coleccion">Colección</a>}
          {categories.length > 0 && showCatalog && content.sections.categories && <a href="#categorias">Categorías</a>}
          {content.sections.story && <a href="#historia">La casa</a>}
        </nav>
        <div className="store-header-action">
          {whatsapp ? <a className="btn store-contact-button" href={whatsapp + "?text=" + encodeURIComponent("Hola, quisiera conocer más sobre " + business.name + ".")} target="_blank" rel="noreferrer">Contactar <span>↗</span></a> : <a className="btn store-contact-button" href="#contacto">Contactar <span>↗</span></a>}
        </div>
      </div>
    </header>

    <section className="store-hero" id="inicio">
      <div className="store-hero-image" aria-hidden="true"><Image src={heroImage} alt="" fill priority sizes="100vw" unoptimized /></div>
      <div className="store-hero-shade" />
      <div className="store-hero-glow" aria-hidden="true" />
      <div className="store-hero-grain" />
      <WebGLJewelScene className="jp-webgl-jewel--store" />
      <div className="store-hero-copy shell">
        <div className="store-eyebrow"><span /> {content.tagline || "JOYERÍA · " + (business.city || "COLOMBIA")}</div>
        <h1>{content.heroTitle || business.name}</h1>
        <p>{content.heroDescription || business.description || "Piezas creadas para acompañar los momentos que merecen quedarse contigo."}</p>
        {showCatalog && <a className="store-hero-link" href="#coleccion">Explorar la colección <span>↓</span></a>}
      </div>
      <div className="hero-caption"><span>01 / {business.city || "COLOMBIA"}</span><span>JOYAS CON SIGNIFICADO</span></div>
      <div className="hero-index">J — 01</div>
    </section>

    {showCatalog && <>
      {content.sections.intro && <section className="store-intro shell" id="coleccion">
        <div className="store-intro-label"><span className="eyebrow">OBJETOS PARA ATESORAR</span><span className="intro-rule" /></div>
        <div className="store-intro-copy"><h2>El tiempo pasa.<br /><em>Lo extraordinario permanece.</em></h2><p>Una selección de piezas que une materia, oficio y memoria. Encuentra la que cuenta tu historia.</p></div>
      </section>}

      {categories.length > 0 && content.sections.categories && <section className="store-categories shell" id="categorias">
        <div className="store-section-heading"><div><span className="eyebrow">UNIVERSOS DE JOYERÍA</span><h2>Explora por colección</h2></div><span className="section-aside">{categories.length} colecciones</span></div>
        <div className="category-cards">{categories.slice(0, 5).map((category, index) => {
          const count = collection.filter((product) => product.category?.name === category).length;
          return <a className={"category-card category-card-" + (index + 1)} href="#catalog-grid" key={category}>
            <span className="category-card-index">0{index + 1}</span><span className="category-card-shape" aria-hidden="true">✧</span>
            <div><small>{String(count).padStart(2, "0")} PIEZAS</small><h3>{category}</h3></div><span className="category-arrow">↗</span>
          </a>;
        })}</div>
      </section>}

      {content.sections.catalog && <section className="store-catalog shell" id="catalog-grid">
        <div className="store-section-heading"><div><span className="eyebrow">HECHAS PARA QUEDARSE</span><h2>Piezas seleccionadas</h2></div><span className="section-aside">{collection.length} {collection.length === 1 ? "pieza" : "piezas"}</span></div>
        {collection.length ? <PublicCatalog products={collection} business={business} /> : <div className="catalog-empty"><span>✧</span><h3>Estamos preparando la colección</h3><p>Muy pronto encontrarás nuevas piezas en este espacio.</p></div>}
      </section>}
    </>}

    {content.sections.story && <section className="store-story" id="historia">
      <div className="story-image"><Image src={gallery[0]?.image_url || "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85"} alt={gallery[0]?.name || "Una pieza de " + business.name} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div>
      <div className="story-copy"><span className="eyebrow">{business.name.toUpperCase()} · {business.city || "COLOMBIA"}</span><h2>{content.storyTitle || "La belleza está en los detalles."}</h2><p>{content.storyText || business.description || "Cada pieza guarda una intención. Descubre una colección elegida con sensibilidad por el diseño y el valor de lo que permanece."}</p><span className="story-signature">{business.name}</span></div>
    </section>}

    {gallery.length > 1 && content.sections.gallery && <section className="store-gallery shell"><div className="gallery-heading"><span className="eyebrow">UN VISTAZO DE CERCA</span><h2>Materia, luz y forma.</h2></div><div className="gallery-grid">{gallery.slice(1).map((product, index) => <figure className={"gallery-frame gallery-frame-" + (index + 1)} key={product.id}><Image src={product.image_url} alt={product.name} fill sizes="(max-width: 700px) 80vw, 34vw" unoptimized /><figcaption>{product.name}<span>{product.material || product.category?.name || "JOYERÍA"}</span></figcaption></figure>)}</div></section>}

    {content.sections.contact && <section className="store-contact" id="contacto"><div className="contact-orbit" aria-hidden="true">✦</div><span className="eyebrow">UNA CONVERSACIÓN, UNA PIEZA ESPECIAL</span><h2>Encuentra algo<br /><em>que hable de ti.</em></h2><p>Conoce más sobre {business.name} y su trabajo directamente con la joyería.</p>{whatsapp ? <a className="btn primary" href={whatsapp + "?text=" + encodeURIComponent("Hola, quisiera conocer más sobre " + business.name + ".")} target="_blank" rel="noreferrer">Hablar con la joyería <span aria-hidden="true">↗</span></a> : business.phone ? <a className="btn primary" href={"tel:" + business.phone}>Llamar a la joyería <span aria-hidden="true">↗</span></a> : <span className="contact-address">{[business.address, business.city].filter(Boolean).join(" · ")}</span>}</section>}

    <WhatsAppButton phone={business.phone} name={business.name} /><footer className="store-footer"><div className="store-footer-main shell"><a href="#inicio" className="store-brand"><span className="store-brand-mark">✦</span><span>{business.name}<small>{business.city || "JOYERÍA"}</small></span></a><div className="footer-address">{[business.address, business.city, business.phone].filter(Boolean).join(" · ")}</div><a className="footer-top" href="#inicio">Volver arriba ↑</a></div><div className="store-footer-bottom shell"><span>© {new Date().getFullYear()} {business.name}</span><span>Una casa de joyería seleccionada con cuidado</span><span>Diseñado con JoyeriaPro</span></div></footer>
  </main>;
}
