"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight CSS-3D jewelry centerpiece with pointer + scroll parallax.
 * It intentionally uses CSS geometry instead of a WebGL runtime so the
 * visual remains fast and degrades cleanly on low-power/mobile devices.
 */
export default function JewelScene({ className = "" }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || typeof window === "undefined") return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return undefined;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const render = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      scene.style.setProperty("--tilt-x", `${(pointerY * -7 + 2).toFixed(2)}deg`);
      scene.style.setProperty("--tilt-y", `${(pointerX * 10 - 12).toFixed(2)}deg`);
      scene.style.setProperty("--parallax-y", `${((0.5 - progress) * 22).toFixed(2)}px`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      const rect = scene.getBoundingClientRect();
      const inside = event.clientX >= rect.left - 80 && event.clientX <= rect.right + 80
        && event.clientY >= rect.top - 80 && event.clientY <= rect.bottom + 80;
      if (inside) {
        pointerX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5) * 2));
        pointerY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5) * 2));
      } else {
        pointerX = 0;
        pointerY = 0;
      }
      schedule();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") schedule();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={sceneRef} className={`jp-jewel-scene ${className}`.trim()} aria-hidden="true">
      <div className="jp-jewel-aura" />
      <div className="jp-jewel-stage">
        <span className="jp-jewel-orbit jp-jewel-orbit--outer" />
        <span className="jp-jewel-orbit jp-jewel-orbit--inner" />
        <span className="jp-jewel-orbit jp-jewel-orbit--satellite" />
        <div className="jp-jewel-object">
          <span className="jp-jewel-shadow" />
          <span className="jp-jewel-ring" />
          <span className="jp-jewel-setting" />
          <span className="jp-jewel-stone">
            <i className="jp-jewel-facet jp-jewel-facet--left" />
            <i className="jp-jewel-facet jp-jewel-facet--right" />
            <i className="jp-jewel-facet jp-jewel-facet--bottom" />
            <i className="jp-jewel-facet jp-jewel-facet--table" />
          </span>
          <span className="jp-jewel-prong jp-jewel-prong--left" />
          <span className="jp-jewel-prong jp-jewel-prong--right" />
          <span className="jp-jewel-prong jp-jewel-prong--top" />
        </div>
        <span className="jp-jewel-spark jp-jewel-spark--one" />
        <span className="jp-jewel-spark jp-jewel-spark--two" />
        <span className="jp-jewel-spark jp-jewel-spark--three" />
      </div>
    </div>
  );
}
