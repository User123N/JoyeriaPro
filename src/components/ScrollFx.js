"use client";
import { useEffect } from "react";

/** Barra de progreso, reveals por scroll, spotlight/tilt en tarjetas y parallax. Sin dependencias. */
export default function ScrollFx() {
  useEffect(() => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sel = ".maison-section-heading,.maison-intro,.maison-category,.public-product,.maison-story__copy,.maison-gallery__item,.home-section-heading,.pillar,.capability,.home-panel-frame,.advantage-list li,.store-contact,.home-cta";
    const els = [...document.querySelectorAll(sel)];
    els.forEach((el, i) => { el.classList.add("fx-reveal"); el.style.setProperty("--fx-d", (i % 4) * 90 + "ms"); });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("fx-in"); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty("--fx-progress", max > 0 ? scrollY / max : 0);
        if (!calm) root.style.setProperty("--fx-y", Math.min(scrollY, 1400) + "px");
      });
    };
    const onMove = (e) => {
      const c = e.target.closest?.(".public-product,.maison-category,.capability,.pillar");
      if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
      if (!calm && e.pointerType !== "touch") c.style.setProperty("--tilt", `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg) translateY(-4px)`);
    };
    const onLeave = (e) => e.target.style?.removeProperty?.("--tilt");
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerout", onLeave); };
  }, []);
  return (
    <>
      <div className="fx-progress" aria-hidden="true" />
      <div className="fx-aurora" aria-hidden="true">
        <svg viewBox="0 0 600 600"><defs><linearGradient id="fxg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe3a3" /><stop offset="1" stopColor="#d99a3d" /></linearGradient></defs>
          <path fill="url(#fxg)"><animate attributeName="d" dur="14s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1" keyTimes="0;.33;.66;1"
            values="M300,60C420,50 540,160 530,300C520,440 410,550 290,540C170,530 60,430 70,300C80,170 180,70 300,60Z;M310,80C440,90 520,200 510,320C500,430 400,520 280,520C160,520 80,400 90,290C100,180 190,70 310,80Z;M290,50C410,70 550,170 520,310C490,450 420,540 300,530C180,520 50,440 80,310C110,180 170,30 290,50Z;M300,60C420,50 540,160 530,300C520,440 410,550 290,540C170,530 60,430 70,300C80,170 180,70 300,60Z" /></path>
        </svg>
      </div>
    </>
  );
}
