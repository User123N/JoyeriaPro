export const STORE_TEMPLATES = [
  {
    id: "noir",
    name: "Noir Atelier",
    description: "Obsidiana, oro cálido y fotografía dramática.",
    accent: "#c8a56a",
    background: "#090a0d"
  },
  {
    id: "champagne",
    name: "Champagne Studio",
    description: "Marfil, arena y una estética editorial luminosa.",
    accent: "#9a7543",
    background: "#f1ece3"
  },
  {
    id: "modern",
    name: "Modern Gallery",
    description: "Grafito, acero y composición contemporánea.",
    accent: "#a9bec1",
    background: "#10171b"
  }
];

export const DEFAULT_SITE_CONFIG = {
  template: "noir",
  tagline: "Joyas que cuentan tu historia",
  heroTitle: "",
  heroDescription: "Piezas seleccionadas para acompañar tus momentos importantes.",
  heroImage: "",
  accent: "#c8a56a",
  background: "#090a0d",
  showCatalog: true,
  storyTitle: "La belleza está en los detalles.",
  storyText: "",
  sections: {
    intro: true,
    categories: true,
    catalog: true,
    story: true,
    gallery: true,
    contact: true
  }
};

const templateIds = new Set(STORE_TEMPLATES.map((template) => template.id));
const colorPattern = /^#[0-9a-f]{3,8}$/i;

export function normalizeSiteConfig(value, business = {}) {
  const saved = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const template = templateIds.has(saved.template) ? saved.template : "noir";
  const preset = STORE_TEMPLATES.find((item) => item.id === template) || STORE_TEMPLATES[0];
  const sourceSections = saved.sections && typeof saved.sections === "object" ? saved.sections : {};
  const sections = Object.fromEntries(
    Object.keys(DEFAULT_SITE_CONFIG.sections).map((key) => [
      key,
      typeof sourceSections[key] === "boolean" ? sourceSections[key] : DEFAULT_SITE_CONFIG.sections[key]
    ])
  );

  return {
    ...DEFAULT_SITE_CONFIG,
    ...saved,
    template,
    accent: colorPattern.test(saved.accent || "") ? saved.accent : preset.accent,
    background: colorPattern.test(saved.background || "") ? saved.background : preset.background,
    heroTitle: saved.heroTitle || business.name || "",
    heroDescription: saved.heroDescription || business.description || DEFAULT_SITE_CONFIG.heroDescription,
    storyTitle: saved.storyTitle || DEFAULT_SITE_CONFIG.storyTitle,
    storyText: saved.storyText || business.description || "",
    sections
  };
}

export function safeExternalImage(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}
