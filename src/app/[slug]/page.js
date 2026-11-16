import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Brand from "@/components/Brand";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} | JoyeriaPro` };
}

export default async function PublicJewelryPage({ params }) {
  const { slug } = await params;
  const sb = await createClient();
  const { data: business, error } = await sb
    .from("businesses")
    .select("id,name,slug,status,description,logo_url,phone,address,city")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !business) notFound();

  const [{ data: products }, { data: content }] = await Promise.all([
    sb.from("products")
      .select("id,name,description,reference,material,price,image_url,stock,category:categories(name)")
      .eq("business_id", business.id)
      .eq("available", true)
      .gt("stock", 0)
      .order("created_at", { ascending: false }),
    sb.rpc("get_published_site_config", { target_slug: slug })
  ]);

  const site = content || {};
  const catalog = site.showCatalog !== false;
  const formatPrice = (price) => new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(price || 0);

  return (
    <main className="public-page" style={{ "--site-accent": site.accent || "#c8a56a", "--site-background": site.background || "#090a0d" }}>
      <header className="shell topbar">
        <Brand />
        <nav className="top-actions">
          <a className="nav-link" href="#catalogo">Catálogo</a>
          <Link className="btn" href="/login">Acceso administrativo</Link>
        </nav>
      </header>
      <section className="shell public-hero">
        <div>
          <div className="eyebrow">{site.tagline || business.city || "Joyería"}</div>
          <h1>{site.heroTitle || business.name}</h1>
          <p className="lead">{site.heroDescription || business.description || "Piezas seleccionadas para acompañar tus momentos importantes."}</p>
          <div className="public-contact">
            {business.address && <span>⌖ {business.address}</span>}
            {business.city && <span>{business.city}</span>}
            {business.phone && <span>☎ {business.phone}</span>}
          </div>
          {catalog && <a className="btn primary" href="#catalogo">Descubrir colección</a>}
        </div>
        <div className="public-mark">✦</div>
      </section>
      {catalog && <section className="shell public-section" id="catalogo">
        <div className="section-heading">
          <div><div className="eyebrow">Colección</div><h2>Joyas disponibles</h2></div>
          <span className="muted">{products?.length || 0} piezas</span>
        </div>
        {products?.length ? <div className="public-products">
          {products.map((product) => <article className="public-product" key={product.id}>
            {product.image_url ? <Image src={product.image_url} alt={product.name} width={900} height={900} unoptimized /> : <div className="product-placeholder">✦</div>}
            <div className="product-copy">
              <span className="eyebrow">{product.category?.name || product.material || "Pieza seleccionada"}</span>
              <h3>{product.name}</h3>
              {product.description && <p>{product.description}</p>}
              <div className="product-meta"><strong>{formatPrice(product.price)}</strong>{product.reference && <small>Ref. {product.reference}</small>}</div>
            </div>
          </article>)}
        </div> : <div className="empty-state"><h2>Catálogo en preparación</h2><p className="muted">Muy pronto encontrarás aquí nuestras piezas disponibles.</p></div>}
      </section>}
      <footer className="footer"><div className="shell footer-row"><span>{business.name}</span><span>{[business.address, business.city, business.phone].filter(Boolean).join(" · ")}</span></div></footer>
    </main>
  );
}

