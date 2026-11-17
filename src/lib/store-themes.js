export const STORE_TEMPLATES = [
  {
    id: "noir",
    name: "Noir Atelier",
    description: "Obsidiana, oro cálido y fotografía dramática.",
    accent: "#c8a56a",
    background: "#090a0d",
    surface: "#121216",
    text: "#f2eee7",
    muted: "#aaa39a"
  },
  {
    id: "champagne",
    name: "Champagne Studio",
    description: "Marfil, arena y una estética editorial luminosa.",
    accent: "#9a7543",
    background: "#f1ece3",
    surface: "#e8dfd1",
    text: "#26221d",
    muted: "#71695f"
  },
  {
    id: "modern",
    name: "Modern Gallery",
    description: "Grafito, acero y composición contemporánea.",
    accent: "#a9bec1",
    background: "#10171b",
    surface: "#192328",
    text: "#edf2f1",
    muted: "#a0acad"
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

export function normalizeSiteConfig(value, business = {}) {
  const saved = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const template = templateIds.has(saved.template) ? saved.template : "noir";
  const preset = STORE_TEMPLATES.find((item) => item.id === template) || STORE_TEMPLATES[0];
  const sections = saved.sections && typeof saved.sections === "object" ? saved.sections : {};

  return {
    ...DEFAULT_SITE_CONFIG,
    ...preset,
    ...saved,
    template,
    heroTitle: saved.heroTitle || business.name || "",
    heroDescription: saved.heroDescription || business.description || DEFAULT_SITE_CONFIG.heroDescription,
    storyText: saved.storyText || business.description || "",
    sections: {
      ...DEFAULT_SITE_CONFIG.sections,
      ...sections
    }
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
