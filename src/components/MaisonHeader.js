"use client";

import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#colecciones", label: "Colecciones" },
  { href: "#catalogo", label: "Piezas" },
  { href: "#historia", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" }
];

export default function MaisonHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className={`maison-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="maison-header__inner">
        <a
          href="#inicio"
          className="maison-brand"
          aria-label="Maison Aurelia, inicio"
          onClick={() => setMenuOpen(false)}
        >
          <span className="maison-brand__mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <polygon points="12 2 22 12 12 22 2 12 12 2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </span>
          <span className="maison-brand__word">
            Maison <b>Aurelia</b>
            <small>JOYERÍA DE AUTOR</small>
          </span>
        </a>

        <nav className="maison-nav" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="maison-header__actions">
          <a className="maison-header__cta" href="#catalogo">
            Explorar tienda <span>↗</span>
          </a>
          <button
            type="button"
            className="maison-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="maison-mobile-drawer"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="maison-mobile-drawer" className="maison-mobile-nav">
          <nav aria-label="Navegación móvil">
            {NAV_ITEMS.map((item, idx) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                <small>0{idx + 1}</small>
                <span>{item.label}</span>
                <i>↗</i>
              </a>
            ))}
          </nav>
          <a
            className="maison-button maison-button--gold"
            href="#catalogo"
            onClick={() => setMenuOpen(false)}
          >
            Explorar colección <span>↗</span>
          </a>
        </div>
      )}
    </header>
  );
}
