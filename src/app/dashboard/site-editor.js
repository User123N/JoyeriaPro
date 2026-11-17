"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  STORE_TEMPLATES,
  normalizeSiteConfig,
  safeExternalImage
} from "@/lib/store-themes";

const sectionLabels = [
  ["intro", "Introducción"],
  ["categories", "Categorías"],
  ["catalog", "Catálogo"],
  ["story", "Historia de la marca"],
  ["gallery", "Galería"],
  ["contact", "Contacto"]
];

export default function SiteEditor({ business, sb }) {
  const initial = useMemo(() => normalizeSiteConfig({}, business), [business]);
  const [draft, setDraft] = useState(initial);
  const [published, setPublished] = useState(initial);
  const [device, setDevice] = useState("desktop");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadConfig() {
      const { data, error } = await sb
        .from("site_configs")
        .select("draft,published,published_at")
        .eq("business_id", business.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        setNote(error.message);
        return;
      }

      setDraft(normalizeSiteConfig(data?.draft || {}, business));
      setPublished(normalizeSiteConfig(data?.published || {}, business));
    }

    loadConfig();
    return () => { active = false; };
  }, [business, sb]);

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function chooseTemplate(templateId) {
    const preset = STORE_TEMPLATES.find((item) => item.id === templateId);
    if (!preset) return;
    setDraft((current) => ({
      ...current,
      template: templateId,
      accent: preset.accent,
      background: preset.background
    }));
  }

  function toggleSection(section, enabled) {
    setDraft((current) => ({
      ...current,
      sections: { ...current.sections, [section]: enabled }
    }));
  }

  async function save() {
    setBusy(true);
    setNote("");
    const { error } = await sb.from("site_configs").upsert({
      business_id: business.id,
      draft: normalizeSiteConfig(draft, business),
      published,
      updated_at: new Date().toISOString()
    });
    setBusy(false);
    setNote(error ? error.message : "Borrador guardado correctamente.");
  }

  async function publish() {
    setBusy(true);
    setNote("");
    const nextPublished = normalizeSiteConfig(draft, business);
    const { error } = await sb.from("site_configs").upsert({
      business_id: business.id,
      draft: nextPublished,
      published: nextPublished,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setBusy(false);
    if (error) {
      setNote(error.message);
      return;
    }
    setPublished(nextPublished);
    setDraft(nextPublished);
    setNote("Cambios publicados en la tienda pública.");
  }

  function restore() {
    if (!window.confirm("¿Descartar el borrador y restaurar la última versión publicada?")) return;
    setDraft(published);
    setNote("Borrador restaurado. Guarda o publica para confirmar el cambio.");
  }

  const previewImage = safeExternalImage(draft.heroImage);
  const template = STORE_TEMPLATES.find((item) => item.id === draft.template) || STORE_TEMPLATES[0];

  function textField(label, key, multiline = false) {
    return (
      <label className="editor-field" key={key}>
        {label}
        {multiline ? (
          <textarea rows="3" value={draft[key] || ""} onChange={(event) => update(key, event.target.value)} />
        ) : (
          <input value={draft[key] || ""} onChange={(event) => update(key, event.target.value)} />
        )}
      </label>
    );
  }

  return (
    <div className="editor-layout jp-editor-layout">
      <div className="editor-controls">
        <div className="eyebrow">ESTUDIO DE MARCA · BORRADOR</div>
        <h2>Diseña tu escaparate</h2>
        <span className="editor-status">Última identidad publicada: {published.template || "noir"}</span>

        <div className="editor-group">
          <span className="editor-group-title">Elige una dirección visual</span>
          <div className="editor-template-grid">
            {STORE_TEMPLATES.map((item) => (
              <button
                className="editor-template-option"
                type="button"
                key={item.id}
                aria-pressed={draft.template === item.id}
                onClick={() => chooseTemplate(item.id)}
              >
                <span className={`editor-template-swatch ${item.id}`} />
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>
        </div>

        {textField("Frase de marca", "tagline")}
        {textField("Título principal", "heroTitle")}
        {textField("Descripción del hero", "heroDescription", true)}
        {textField("Título de historia", "storyTitle")}
        {textField("Texto de historia", "storyText", true)}
        {textField("URL HTTPS de imagen de portada", "heroImage")}

        {previewImage && (
          <div className="jp-editor-image-preview">
            <Image src={previewImage} alt="Vista previa de la portada seleccionada" width={168} height={128} unoptimized />
            <span>Imagen de portada válida</span>
          </div>
        )}
        {draft.heroImage && !previewImage && (
          <p className="jp-editor-validation" role="status">La portada debe ser una URL HTTPS válida.</p>
        )}

        <div className="editor-fields-inline">
          <label className="editor-field">Color de acento
            <input type="color" value={draft.accent || template.accent} onChange={(event) => update("accent", event.target.value)} />
          </label>
          <label className="editor-field">Color de fondo
            <input type="color" value={draft.background || template.background} onChange={(event) => update("background", event.target.value)} />
          </label>
        </div>

        <label className="editor-check">
          <input type="checkbox" checked={draft.showCatalog !== false} onChange={(event) => update("showCatalog", event.target.checked)} />
          Permitir catálogo público
        </label>

        <fieldset className="editor-section-fieldset">
          <legend className="editor-group-title">Secciones visibles</legend>
          <div className="editor-section-toggles">
            {sectionLabels.map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={draft.sections?.[key] !== false}
                  onChange={(event) => toggleSection(key, event.target.checked)}
                  disabled={key === "catalog" && draft.showCatalog === false}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="editor-actions">
          <button className="btn" type="button" disabled={busy} onClick={restore}>Restaurar</button>
          <button className="btn" type="button" disabled={busy} onClick={save}>{busy ? "Guardando…" : "Guardar borrador"}</button>
          <button className="btn primary" type="button" disabled={busy} onClick={publish}>{busy ? "Publicando…" : "Publicar cambios"}</button>
        </div>
        {note && <p className="muted" role="status" aria-live="polite">{note}</p>}
      </div>

      <div className="editor-preview-wrap">
        <div className="editor-toolbar">
          <span>Vista previa interactiva</span>
          <div>
            {["desktop", "tablet", "mobile"].map((value) => (
              <button
                className={device === value ? "btn primary" : "btn"}
                type="button"
                key={value}
                onClick={() => setDevice(value)}
                aria-pressed={device === value}
              >
                {value}
              </button>
            ))}
          </div>
          <a className="btn" href={`/${business.slug}`} target="_blank" rel="noreferrer">Abrir publicada ↗</a>
        </div>

        <div
          className={`editor-preview ${device} template-${draft.template}`}
          style={{
            "--preview-accent": draft.accent,
            "--preview-bg": draft.background,
            backgroundImage: previewImage
              ? `linear-gradient(90deg,rgba(7,8,10,.72),rgba(7,8,10,.12)),url("${previewImage}")`
              : undefined
          }}
        >
          <div className="preview-nav">✦ {business.name}<span>COLECCIÓN　 MARCA　 CONTACTO</span></div>
          <section className="preview-hero">
            <small>{draft.tagline}</small>
            <h1>{draft.heroTitle || business.name}</h1>
            <p>{draft.heroDescription}</p>
            <span className="preview-button">Explorar colección</span>
            <div className="preview-gem" aria-hidden="true">✦</div>
          </section>
          {draft.showCatalog !== false && draft.sections?.catalog !== false && (
            <div className="preview-catalog">
              <small>COLECCIÓN</small>
              <h2>Piezas seleccionadas</h2>
              <div className="preview-products"><i>✧</i><i>◈</i><i>✦</i></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
