// Catálogo de tipos de sección que puede usar el panel.
// Debe reflejar el esquema de site/src/content/config.ts — si añadís un tipo
// de sección nuevo, añadidlo en los dos sitios.
//
// Tipos de campo soportados por admin/public/admin.js:
//   text, textarea, image, button ({label, href}),
//   imageList (array de {src, alt}), faqList (array de {question, answer})

const SECTION_CATALOG = {
  hero: {
    label: "Hero (cabecera grande)",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "heading", label: "Título", type: "text", required: true },
      { name: "subheading", label: "Subtítulo", type: "textarea" },
      { name: "image", label: "Imagen", type: "image" },
      { name: "button", label: "Botón", type: "button" },
    ],
  },
  textImage: {
    label: "Texto + imagen",
    fields: [
      { name: "heading", label: "Título", type: "text", required: true },
      { name: "body", label: "Texto", type: "textarea", required: true },
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
  richText: {
    label: "Bloque de texto",
    fields: [
      { name: "heading", label: "Título (opcional)", type: "text" },
      { name: "body", label: "Texto", type: "textarea", required: true },
    ],
  },
  cta: {
    label: "Llamada a la acción (CTA)",
    fields: [
      { name: "heading", label: "Título", type: "text", required: true },
      { name: "body", label: "Texto (opcional)", type: "textarea" },
      { name: "button", label: "Botón", type: "button", required: true },
    ],
  },
  gallery: {
    label: "Galería de imágenes",
    fields: [
      { name: "heading", label: "Título (opcional)", type: "text" },
      { name: "images", label: "Imágenes", type: "imageList", required: true },
    ],
  },
  faq: {
    label: "Preguntas frecuentes",
    fields: [
      { name: "heading", label: "Título (opcional)", type: "text" },
      { name: "items", label: "Preguntas", type: "faqList", required: true },
    ],
  },
  introDark: {
    label: "Intro Dark Background",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "heading", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
    ],
  },
  introWhite: {
    label: "Intro White Background",
    fields: [
      { name: "eyebrow", label: "Texto superior (opcional)", type: "text" },
      { name: "heading", label: "Título", type: "text", required: true },
      { name: "description", label: "Descripción", type: "textarea" },
    ],
  },
};

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
