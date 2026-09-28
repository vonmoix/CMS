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
};

module.exports = { SECTION_CATALOG };
