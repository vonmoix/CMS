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

const heroSection = z.object({
  type: z.literal("hero"),
  eyebrow: z.string().optional(),
  heading: z.string().min(1),
  subheading: z.string().optional(),
  image: imageSchema.optional(),
  button: buttonSchema.optional(),
});

const textImageSection = z.object({
  type: z.literal("textImage"),
  heading: z.string().min(1),
  body: z.string().min(1),
  image: imageSchema,
  imagePosition: z.enum(["left", "right"]).default("right"),
});

const richTextSection = z.object({
  type: z.literal("richText"),
  heading: z.string().optional(),
  body: z.string().min(1),
});

const ctaSection = z.object({
  type: z.literal("cta"),
  heading: z.string().min(1),
  body: z.string().optional(),
  button: buttonSchema,
});

const gallerySection = z.object({
  type: z.literal("gallery"),
  heading: z.string().optional(),
  images: z.array(imageSchema).min(1),
});

const faqSection = z.object({
  type: z.literal("faq"),
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

export const sectionSchema = z.discriminatedUnion("type", [
  heroSection,
  textImageSection,
  richTextSection,
  ctaSection,
  gallerySection,
  faqSection,
]);

const pagesCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional().default(""),
    // "index" = página de inicio (se sirve en "/"), cualquier otro valor
    // se sirve en "/<slug>/"
    slug: z.string().min(1),
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
