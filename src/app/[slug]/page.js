import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PublicCatalog from "@/components/PublicCatalog";
import WebGLJewelScene from "@/components/WebGLJewelScene";
import { normalizeSiteConfig, safeExternalImage } from "@/lib/store-themes";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} | JoyeriaPro`, description: "Descubre una colección de joyería seleccionada con cuidado." };
}

export default async function PublicJewelryPage({ params }) {
  const { slug } = await params;
  const sb = await createClient();
  const { data: business, error } = await sb.from("businesses")
    .select("id,name,slug,status,description,logo_url,phone,address,city")
    .eq("slug", slug).eq("status", "active").maybeSingle();
  if (error || !business) notFound();

  const [{ data: products }, { data: site }] = await Promise.all([
    sb.from("products").select("id,name,description,reference,material,price,image_url,stock,category:categories(name)")
      .eq("business_id", business.id).eq("available", true).gt("stock", 0).order("created_at", { ascending: false }),
    sb.rpc("get_published_site_config", { target_slug: slug })
  ]);

  const content = normalizeSiteConfig(site || {}, business);
  const collection = products || [];
  const categories = [...new Set(collection.map((product) => product.category?.name).filter(Boolean))];
  const gallery = collection.filter((product) => product.image_url).slice(0, 4);
  const showCatalog = content.showCatalog !== false;
  const heroImage = safeExternalImage(content.heroImage) || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=2200&q=90";
  const phone = (business.phone || "").replace(/\D/g, "");
  const whatsapp = phone ? `https://wa.me/${phone.length === 10 ? `57${phone}` : phone}` : null;

  return <main className={`storefront storefront--${content.template}`} style={{ "--site-accent": content.accent || "#c6a15b", "--site-background": content.background || "#080808", "--site-foreground": content.text || "#f2eee7" }}>
    <header className="store-header">
      <div className="store-header-inner">
        <a href="#inicio" className="store-brand" aria-label={`${business.name}, inicio`}>
          {business.logo_url ? <Image src={business.logo_url} alt="" width={42} height={42} unoptimized /> : <span className="store-brand-mark">✦</span>}
          <span>{business.name}<small>{business.city || "JOYERÍA"}</small></span>
        </a>
        <nav className="store-nav" aria-label="Navegación principal">
          {showCatalog && <a href="#coleccion">Colección</a>}
          {categories.length > 0 && showCatalog && content.sections.categories && <a href="#categorias">Categorías</a>}
          {content.sections.story && <a href="#historia">La casa</a>}
        </nav>
        <div className="store-header-action">
          {whatsapp ? <a className="btn store-contact-button" href={`${whatsapp}?text=${encodeURIComponent(`Hola, quisiera conocer más sobre ${business.name}.`)}`} target="_blank" rel="noreferrer">Contactar <span>↗</span></a> : <a className="btn store-contact-button" href="#contacto">Contactar <span>↗</span></a>}
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
          return <a className={`category-card category-card-${index + 1}`} href="#catalog-grid" key={category}>
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
      <div className="story-image"><Image src={gallery[0]?.image_url || "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1400&q=85"} alt={gallery[0]?.name || `Una pieza de ${business.name}`} fill sizes="(max-width: 800px) 100vw, 50vw" unoptimized /></div>
      <div className="story-copy"><span className="eyebrow">{business.name.toUpperCase()} · {business.city || "COLOMBIA"}</span><h2>{content.storyTitle || "La belleza está en los detalles."}</h2><p>{content.storyText || business.description || "Cada pieza guarda una intención. Descubre una colección elegida con sensibilidad por el diseño y el valor de lo que permanece."}</p><span className="story-signature">{business.name}</span></div>
    </section>}

    {gallery.length > 1 && content.sections.gallery && <section className="store-gallery shell"><div className="gallery-heading"><span className="eyebrow">UN VISTAZO DE CERCA</span><h2>Materia, luz y forma.</h2></div><div className="gallery-grid">{gallery.slice(1).map((product, index) => <figure className={`gallery-frame gallery-frame-${index + 1}`} key={product.id}><Image src={product.image_url} alt={product.name} fill sizes="(max-width: 700px) 80vw, 34vw" unoptimized /><figcaption>{product.name}<span>{product.material || product.category?.name || "JOYERÍA"}</span></figcaption></figure>)}</div></section>}

    {content.sections.contact && <section className="store-contact" id="contacto"><div className="contact-orbit" aria-hidden="true">✦</div><span className="eyebrow">UNA CONVERSACIÓN, UNA PIEZA ESPECIAL</span><h2>Encuentra algo<br /><em>que hable de ti.</em></h2><p>Conoce más sobre {business.name} y su trabajo directamente con la joyería.</p>{whatsapp ? <a className="btn primary" href={`${whatsapp}?text=${encodeURIComponent(`Hola, quisiera conocer más sobre ${business.name}.`)}`} target="_blank" rel="noreferrer">Hablar con la joyería <span aria-hidden="true">↗</span></a> : business.phone ? <a className="btn primary" href={`tel:${business.phone}`}>Llamar a la joyería <span aria-hidden="true">↗</span></a> : <span className="contact-address">{[business.address, business.city].filter(Boolean).join(" · ")}</span>}</section>}

    <footer className="store-footer"><div className="store-footer-main shell"><a href="#inicio" className="store-brand"><span className="store-brand-mark">✦</span><span>{business.name}<small>{business.city || "JOYERÍA"}</small></span></a><div className="footer-address">{[business.address, business.city, business.phone].filter(Boolean).join(" · ")}</div><a className="footer-top" href="#inicio">Volver arriba ↑</a></div><div className="store-footer-bottom shell"><span>© {new Date().getFullYear()} {business.name}</span><span>Una casa de joyería seleccionada con cuidado</span><span>Diseñado con JoyeriaPro</span></div></footer>
  </main>;
}
