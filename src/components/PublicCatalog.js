"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const money = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", maximumFractionDigits: 0
}).format(Number(value || 0));

export default function PublicCatalog({ products, business }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas las piezas");
  const [sort, setSort] = useState("featured");
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => [
    "Todas las piezas",
    ...new Set(products.map((product) => product.category?.name).filter(Boolean))
  ], [products]);

  const visible = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es");
    const filtered = products.filter((product) => {
      const matchesCategory = category === "Todas las piezas" || product.category?.name === category;
      const haystack = [product.name, product.description, product.material, product.reference, product.category?.name]
        .filter(Boolean).join(" ").toLocaleLowerCase("es");
      return matchesCategory && (!query || haystack.includes(query));
    });
    if (sort === "price-asc") return filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-desc") return filtered.sort((a, b) => Number(b.price) - Number(a.price));
    return filtered;
  }, [products, search, category, sort]);

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const digits = (business.phone || "").replace(/\D/g, "");
  const phone = digits.length === 10 ? `57${digits}` : digits;
  const contactUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, quisiera información sobre ${selected?.name || "una pieza"} de ${business.name}.`)}`
    : null;

  return <>
    <div className="catalog-tools">
      <label className="catalog-search">
        <span aria-hidden="true">⌕</span>
        <input aria-label="Buscar joyas" placeholder="Busca una pieza, material o referencia" value={search} onChange={(event) => setSearch(event.target.value)} />
      </label>
      <label className="catalog-sort"><span>Ordenar</span>
        <select aria-label="Ordenar productos" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="featured">Destacados</option><option value="price-asc">Precio: menor a mayor</option><option value="price-desc">Precio: mayor a menor</option>
        </select>
      </label>
    </div>
    <div className="category-rail" aria-label="Filtrar por categoría">
      {categories.map((name) => <button key={name} className={category === name ? "category-chip active" : "category-chip"} onClick={() => setCategory(name)}>{name}</button>)}
    </div>
    <div className="catalog-result-line"><span>{visible.length} {visible.length === 1 ? "pieza" : "piezas"}</span><span>Disponibles en {business.name}</span></div>
    {visible.length ? <div className="public-products">
      {visible.map((product, index) => <article className="public-product" key={product.id} style={{ "--card-order": index }}>
        <button className="product-image-button" onClick={() => setSelected(product)} aria-label={`Ver ${product.name}`}>
          {product.image_url ? <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" unoptimized /> : <span className="product-placeholder">✧</span>}
          <span className="product-image-action">Ver pieza <span aria-hidden="true">↗</span></span>
          {product.stock <= 2 && <span className="stock-label">Últimas piezas</span>}
        </button>
        <div className="product-copy">
          <span className="eyebrow">{product.category?.name || product.material || "Colección"}</span>
          <h3><button onClick={() => setSelected(product)}>{product.name}</button></h3>
          <div className="product-meta"><strong>{money(product.price)}</strong><button className="product-view" onClick={() => setSelected(product)} aria-label={`Detalles de ${product.name}`}>↗</button></div>
        </div>
      </article>)}
    </div> : <div className="catalog-empty"><span>✧</span><h3>No encontramos esa pieza</h3><p>Prueba con otra búsqueda o selecciona una categoría distinta.</p><button className="btn ghost" onClick={() => { setSearch(""); setCategory("Todas las piezas"); }}>Limpiar filtros</button></div>}

    {selected && <div className="product-dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title">
        <button className="dialog-close" onClick={() => setSelected(null)} aria-label="Cerrar detalles">×</button>
        <div className="dialog-image">{selected.image_url ? <Image src={selected.image_url} alt={selected.name} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized /> : <span>✧</span>}</div>
        <div className="dialog-copy">
          <div className="eyebrow">{selected.category?.name || "Pieza seleccionada"}</div>
          <h2 id="product-dialog-title">{selected.name}</h2>
          <div className="dialog-price">{money(selected.price)}</div>
          <p className="muted">{selected.description || "Una pieza seleccionada para acompañar tus momentos especiales."}</p>
          <dl className="product-details">
            {selected.material && <div><dt>Material</dt><dd>{selected.material}</dd></div>}
            {selected.reference && <div><dt>Referencia</dt><dd>{selected.reference}</dd></div>}
            <div><dt>Disponibilidad</dt><dd>{selected.stock > 0 ? "Disponible" : "Agotado"}</dd></div>
          </dl>
          {selected.stock > 0 && contactUrl && <a className="btn primary dialog-contact" href={contactUrl} target="_blank" rel="noreferrer">Consultar esta pieza <span aria-hidden="true">↗</span></a>}
          <small className="dialog-note">La disponibilidad puede cambiar. Confirma los detalles directamente con la joyería.</small>
        </div>
      </section>
    </div>}
  </>;
}
