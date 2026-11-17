import test from "node:test";
import assert from "node:assert/strict";
import { zonedToUtcIso, todayInTz, formatInTz } from "../src/lib/tz.js";
import { safeNext } from "../src/lib/safe-redirect.js";

test("Bogotá es UTC-5 sin horario de verano", () => {
  assert.equal(zonedToUtcIso("2026-11-05T14:30", "America/Bogota"), "2026-11-05T19:30:00.000Z");
});
test("Zona con horario de verano (Nueva York, noviembre = UTC-5; julio = UTC-4)", () => {
  assert.equal(zonedToUtcIso("2026-11-05T09:00", "America/New_York"), "2026-11-05T14:00:00.000Z");
  assert.equal(zonedToUtcIso("2026-07-05T09:00", "America/New_York"), "2026-07-05T13:00:00.000Z");
});
test("Entrada inválida devuelve null", () => {
  assert.equal(zonedToUtcIso("mañana", "America/Bogota"), null);
  assert.equal(zonedToUtcIso("", "America/Bogota"), null);
});
test("todayInTz respeta la zona (23:30 en Bogotá ya es el día siguiente en UTC)", () => {
  const instant = new Date("2026-11-06T04:30:00Z"); // 23:30 del 5 en Bogotá
  assert.equal(todayInTz("America/Bogota", instant), "2026-11-05");
  assert.equal(todayInTz("UTC", instant), "2026-11-06");
});
test("formatInTz muestra la hora local del negocio", () => {
  assert.match(formatInTz("2026-11-05T19:30:00Z", "America/Bogota", { hour: "2-digit", minute: "2-digit", hour12: false }), /14:30/);
});
test("safeNext bloquea redirecciones externas", () => {
  for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", null, undefined, 42]) {
    assert.equal(safeNext(bad), "/dashboard");
  }
  assert.equal(safeNext("/dashboard?b=1"), "/dashboard?b=1");
});

import { STORE_TEMPLATES, normalizeSiteConfig, safeExternalImage } from "../src/lib/store-themes.js";

test("JoyeriaPro ofrece exactamente tres plantillas de tienda", () => {
  assert.deepEqual(STORE_TEMPLATES.map((item) => item.id), ["noir", "champagne", "modern"]);
});

test("las tiendas existentes reciben valores por defecto sin perder su texto", () => {
  const config = normalizeSiteConfig(
    { heroTitle: "Casa Aurora", tagline: "Piezas que perduran" },
    { name: "Aurora", description: "Joyería artesanal" }
  );
  assert.equal(config.template, "noir");
  assert.equal(config.heroTitle, "Casa Aurora");
  assert.equal(config.tagline, "Piezas que perduran");
  assert.equal(config.heroDescription, "Joyería artesanal");
  assert.equal(config.sections.catalog, true);
});

test("la configuración rechaza plantillas y colores no válidos", () => {
  const config = normalizeSiteConfig({
    template: "custom-script",
    accent: "url(javascript:alert(1))",
    background: "#fff",
    sections: { catalog: false }
  }, { name: "Aurora" });
  assert.equal(config.template, "noir");
  assert.equal(config.accent, "#c8a56a");
  assert.equal(config.background, "#fff");
  assert.equal(config.sections.catalog, false);
  assert.equal(config.sections.story, true);
});

test("las imágenes de portada solo aceptan HTTPS", () => {
  assert.equal(safeExternalImage("https://cdn.example.com/cover.webp"), "https://cdn.example.com/cover.webp");
  assert.equal(safeExternalImage("http://example.com/cover.webp"), "");
  assert.equal(safeExternalImage("javascript:alert(1)"), "");
  assert.equal(safeExternalImage("not-a-url"), "");
});
