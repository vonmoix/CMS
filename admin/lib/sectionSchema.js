// Catálogo de tipos de sección que puede usar el panel.
// Debe reflejar el esquema de site/src/content/config.ts — si añadís un tipo
// de sección nuevo, añadidlo en los dos sitios.
//
// Tipos de campo soportados por admin/public/admin.js:
//   text, textarea, image, button ({label, href}),
//   imageList (array de {src, alt}), faqList (array de {question, answer}),
//   cardList (array de {title, image, playUrl, sheetUrl, hitRate?, rtp?})

const SECTION_CATALOG = {
  // Orden del selector "Añadir sección": como se maquetaría una página,
  // de arriba abajo y de lo general a lo granular. Mantener igual en showcase.json.
  sectionVideo: {
    label: "Vídeo de cabecera (section-video)",
    fields: [
      { name: "video", label: "Vídeo mp4 (ruta o URL, p. ej. /videos/hero-video.mp4)", type: "text", required: true },
      { name: "videoWebm", label: "Vídeo webm (opcional, más ligero)", type: "text" },
      { name: "poster", label: "Póster (imagen antes/después del vídeo)", type: "image" },
    ],
  },
  introText: {
    label: "Título y texto de introducción (header-hero / header-section)",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "title", label: "Título (opcional)", type: "text" },
      { name: "highlight", label: "Parte del título en rojo (opcional)", type: "text" },
      { name: "copy", label: "Texto", type: "textarea" },
      {
        name: "size",
        label: "Tipo",
        type: "select",
        options: [
          { value: "xl", label: "Hero (header-hero)" },
          { value: "l", label: "Sección (header-section)" },
        ],
        default: "xl",
      },
    ],
  },
  titleHero: {
    label: "Título con subrayado (title-hero / title-section)",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "highlight", label: "Parte del título en rojo (opcional)", type: "text" },
      {
        name: "size",
        label: "Tipo",
        type: "select",
        options: [
          { value: "xl", label: "Hero (title-hero)" },
          { value: "l", label: "Sección (title-section)" },
        ],
        default: "xl",
      },
    ],
  },
  hero: {
    label: "Destacado: texto, imagen y botón",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "copy", label: "Subtítulo", type: "textarea" },
      { name: "image", label: "Imagen", type: "image" },
      { name: "button", label: "Botón", type: "button" },
      {
        name: "imagePosition",
        label: "Posición de la imagen",
        type: "select",
        options: [
          { value: "right", label: "Derecha" },
          { value: "left", label: "Izquierda" },
        ],
        default: "right",
      },
    ],
  },
  sectionImageCard: {
    label: "Imagen con tarjeta (section-image-card)",
    fields: [
      { name: "background", label: "Imagen ancha (escritorio)", type: "image", required: true },
      { name: "backgroundMobile", label: "Imagen ancha (móvil, opcional)", type: "image" },
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "highlight", label: "Parte del título en rojo (opcional)", type: "text" },
      { name: "copy", label: "Texto", type: "textarea" },
      { name: "image", label: "Imagen de la tarjeta (solo escritorio)", type: "image" },
    ],
  },
  gamesGroup: {
    label: "Grupo de juegos (games-group)",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "title", label: "Título", type: "text" },
      { name: "description", label: "Descripción", type: "textarea" },
      { name: "cards", label: "Cartas", type: "cardList", required: true },
    ],
  },
  carousel: {
    label: "Carrusel de cartas de juego",
    fields: [
      { name: "title", label: "Título (opcional)", type: "text" },
      { name: "cards", label: "Cartas", type: "cardList", required: true },
    ],
  },
  textImage: {
    label: "Texto con imagen",
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "copy", label: "Texto", type: "textarea", required: true },
      { name: "image", label: "Imagen", type: "image", required: true },
      {
        name: "imagePosition",
        label: "Posición de la imagen",
        type: "select",
        options: [
          { value: "right", label: "Derecha" },
          { value: "left", label: "Izquierda" },
        ],
        default: "right",
      },
    ],
  },
  gallery: {
    label: "Galería de imágenes",
    fields: [
      { name: "title", label: "Título (opcional)", type: "text" },
      { name: "images", label: "Imágenes", type: "imageList", required: true },
    ],
  },
  sectionMascot: {
    label: "Mascota con firma (section-mascot)",
    fields: [
      { name: "eyebrow", label: "Texto sobre la firma (opcional)", type: "text" },
      { name: "signature", label: "Firma (imagen o GIF)", type: "image" },
      { name: "title", label: "Título", type: "text", required: true },
      { name: "highlight", label: "Parte del título en rojo (opcional)", type: "text" },
      { name: "copy", label: "Texto", type: "textarea" },
      { name: "image", label: "Imagen de la mascota", type: "image" },
    ],
  },
  faq: {
    label: "Preguntas frecuentes",
    fields: [
      { name: "title", label: "Título (opcional)", type: "text" },
      { name: "items", label: "Preguntas", type: "faqList", required: true },
    ],
  },
  cta: {
    label: "Llamada a la acción (botón)",
    fields: [
      { name: "title", label: "Título", type: "text", required: true },
      { name: "copy", label: "Texto (opcional)", type: "textarea" },
      { name: "button", label: "Botón", type: "button", required: true },
    ],
  },
};

// Franja de fondo a ancho completo en la que se coloca la sección. Las
// consecutivas con el mismo valor comparten franja. sectionVideo va a sangre y
// no lo lleva.
const SURFACE_FIELD = {
  name: "surface",
  label: "Color de fondo de la franja",
  type: "select",
  options: [
    { value: "grey-medium", label: "Gris medio" },
    { value: "grey-dark", label: "Gris oscuro" },
    { value: "white", label: "Blanco" },
  ],
  default: "grey-medium",
};
for (const [type, def] of Object.entries(SECTION_CATALOG)) {
  // Los tipos a sangre van fuera de las franjas: sin surface
  if (!["sectionVideo", "gamesGroup", "sectionImageCard", "sectionMascot"].includes(type)) def.fields.push(SURFACE_FIELD);
}

// Mismo criterio que safeLinkSchema en site/src/content/config.ts
const SAFE_LINK = /^(\/|#|https?:\/\/|mailto:|tel:)/i;
const isSafeLink = (v) => SAFE_LINK.test(String(v));

const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";

// Limpia y valida las secciones antes de guardarlas, para no hacer commit de
// contenido que luego rompa el build del sitio (el esquema zod de Astro es
// estricto: un botón sin enlace o una imagen sin ruta tumban la publicación).
// - Quita botones/imágenes opcionales que se han dejado vacíos.
// - Quita elementos vacíos de las listas.
// - Devuelve errores legibles para lo que no se puede arreglar solo.
function cleanSections(sections) {
  const errors = [];
  if (!Array.isArray(sections)) {
    return { sections: [], errors: ["Las secciones no tienen un formato válido."] };
  }

  const cleaned = sections.map((section, i) => {
    const def = SECTION_CATALOG[section && section.type];
    if (!def) {
      errors.push(`Sección ${i + 1}: tipo desconocido ("${section && section.type}").`);
      return section;
    }
    const out = { ...section };
    const where = `Sección ${i + 1} (${def.label})`;

    for (const field of def.fields) {
      const value = out[field.name];
      switch (field.type) {
        case "button": {
          const label = value && value.label;
          const href = value && value.href;
          if (isBlank(label) && isBlank(href)) {
            delete out[field.name];
            if (field.required) errors.push(`${where}: el botón necesita texto y enlace.`);
          } else if (isBlank(label) || isBlank(href)) {
            errors.push(`${where}: el botón necesita texto y enlace (o deja los dos vacíos).`);
          }
          break;
        }
        case "image":
          if (!value || isBlank(value.src)) {
            delete out[field.name];
            if (field.required) errors.push(`${where}: falta la imagen.`);
          }
          break;
        case "imageList": {
          const list = (Array.isArray(value) ? value : []).filter((img) => img && !isBlank(img.src));
          out[field.name] = list;
          if (field.required && list.length === 0) errors.push(`${where}: añade al menos una imagen.`);
          break;
        }
        case "cardList": {
          const list = (Array.isArray(value) ? value : []).filter(
            (c) => c && !(isBlank(c.title) && isBlank(c.image && c.image.src) && isBlank(c.playUrl) && isBlank(c.sheetUrl))
          );
          if (list.some((c) => isBlank(c.title) || isBlank(c.image && c.image.src) || isBlank(c.playUrl) || isBlank(c.sheetUrl))) {
            errors.push(`${where}: cada carta necesita nombre del juego, imagen, enlace del botón Play y enlace del botón Info.`);
          }
          if (list.some((c) => (!isBlank(c.playUrl) && !isSafeLink(c.playUrl)) || (!isBlank(c.sheetUrl) && !isSafeLink(c.sheetUrl)))) {
            errors.push(`${where}: los enlaces de las cartas deben empezar por /, #, http(s)://, mailto: o tel:.`);
          }
          out[field.name] = list;
          if (field.required && list.length === 0) errors.push(`${where}: añade al menos una carta.`);
          break;
        }
        case "faqList": {
          const list = (Array.isArray(value) ? value : []).filter(
            (it) => it && !(isBlank(it.question) && isBlank(it.answer))
          );
          if (list.some((it) => isBlank(it.question) || isBlank(it.answer))) {
            errors.push(`${where}: cada pregunta necesita pregunta y respuesta.`);
          }
          out[field.name] = list;
          if (field.required && list.length === 0) errors.push(`${where}: añade al menos una pregunta.`);
          break;
        }
        default:
          if (field.required && isBlank(value)) errors.push(`${where}: falta "${field.label}".`);
      }
    }
    return out;
  });

  return { sections: cleaned, errors };
}

module.exports = { SECTION_CATALOG, cleanSections };
