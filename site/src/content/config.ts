import { defineCollection, z } from "astro:content";

/**
 * Modelo de contenido
 * ====================
 * Cada página es un documento JSON en src/content/pages/<slug>.json con
 * metadatos (título, descripción, SEO) y una lista ordenada de "secciones".
 * Cada sección tiene un "type" que decide qué componente la renderiza
 * (ver src/components/sections/ y SectionRenderer.astro).
 *
 * Añadir un tipo de sección nuevo = añadir un bloque al union de abajo +
 * crear el componente correspondiente. El panel de administración lee este
 * mismo catálogo (admin/lib/sectionSchema.js) para generar sus formularios,
 * así que si tocáis esto, tocad también ese archivo.
 */

const imageSchema = z.object({
  src: z.string().min(1, "La imagen es obligatoria"),
  alt: z.string().default(""),
});

const buttonSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

// Color de fondo de la franja a ancho completo donde se coloca la sección.
// Las secciones consecutivas con el mismo valor comparten franja (ver
// SectionRenderer.astro). La sección en sí no lleva fondo.
export const SURFACES = ["grey-medium", "grey-dark", "white"] as const;
const surfaceField = { surface: z.enum(SURFACES).default("grey-medium") };

const heroSection = z.object({
  type: z.literal("hero"),
  ...surfaceField,
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  image: imageSchema.optional(),
  button: buttonSchema.optional(),
});

const heroVideoSection = z.object({
  type: z.literal("heroVideo"),
  // ruta (/videos/x.mp4) o URL del vídeo
  video: z.string().min(1, "El vídeo es obligatorio"),
  // imagen que se ve antes de cargar y al terminar el vídeo
  poster: imageSchema.optional(),
});

const textImageSection = z.object({
  type: z.literal("textImage"),
  ...surfaceField,
  heading: z.string().min(1),
  body: z.string().min(1),
  image: imageSchema,
  imagePosition: z.enum(["left", "right"]).default("right"),
});

const richTextSection = z.object({
  type: z.literal("richText"),
  ...surfaceField,
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  body: z.string().min(1),
});

const ctaSection = z.object({
  type: z.literal("cta"),
  ...surfaceField,
  heading: z.string().min(1),
  body: z.string().optional(),
  button: buttonSchema,
});

const gallerySection = z.object({
  type: z.literal("gallery"),
  ...surfaceField,
  heading: z.string().optional(),
  images: z.array(imageSchema).min(1),
});

const faqSection = z.object({
  type: z.literal("faq"),
  ...surfaceField,
  heading: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1),
});

const introSection = z.object({
  type: z.literal("intro"),
  ...surfaceField,
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  description: z.string().optional(),
  // l = grande (padding 128), m = compacta (padding 64)
  size: z.enum(["l", "m"]).default("l"),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSection,
  heroVideoSection,
  textImageSection,
  richTextSection,
  ctaSection,
  gallerySection,
  faqSection,
  introSection,
]);

const pagesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional().default(""),
    // "index" = página de inicio (se sirve en "/"), cualquier otro valor
    // se sirve en "/<slug>/"
    slug: z.string().min(1),
    // posición en el menú de cabecera/móvil (menor = antes); se gestiona
    // desde el panel de administración, no hay que tocarla a mano
    order: z.number().default(0),
    // oculta la página del sitio publicado sin borrar el contenido
    draft: z.boolean().default(false),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      })
      .optional()
      .default({}),
    sections: z.array(sectionSchema).default([]),
    updatedAt: z.string().optional(),
    updatedBy: z.string().optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
};
