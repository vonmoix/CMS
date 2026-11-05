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

// Enlaces de las cartas: solo rutas, anclas, http(s), mailto y tel. Una lista
// de permitidos descarta javascript:, data: y similares, también con
// espacios o mayúsculas delante.
const safeLinkSchema = z
  .string()
  .min(1)
  .regex(/^(\/|#|https?:\/\/|mailto:|tel:)/i, "El enlace debe empezar por /, #, http(s)://, mailto: o tel:");

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
  title: z.string().min(1),
  copy: z.string().optional(),
  image: imageSchema.optional(),
  button: buttonSchema.optional(),
  imagePosition: z.enum(["left", "right"]).default("right"),
});

const sectionVideoSection = z.object({
  type: z.literal("sectionVideo"),
  // ruta (/videos/x.mp4) o URL del vídeo (mp4, calidad estándar)
  video: z.string().min(1, "El vídeo es obligatorio"),
  // opcional: versión webm (más ligera)
  videoWebm: z.string().optional(),
  // imagen que se ve antes de cargar y al terminar el vídeo
  poster: imageSchema.optional(),
});

const textImageSection = z.object({
  type: z.literal("textImage"),
  ...surfaceField,
  title: z.string().min(1),
  copy: z.string().min(1),
  image: imageSchema,
  imagePosition: z.enum(["left", "right"]).default("right"),
});

const ctaSection = z.object({
  type: z.literal("cta"),
  ...surfaceField,
  title: z.string().min(1),
  copy: z.string().optional(),
  button: buttonSchema,
});

const gallerySection = z.object({
  type: z.literal("gallery"),
  ...surfaceField,
  title: z.string().optional(),
  images: z.array(imageSchema).min(1),
});

// Cartas de juego (card-pt): las usan gamesGroup y carousel
const gameCardsSchema = z
  .array(
    z.object({
      // nombre del juego: alt de la imagen y aria-label de los botones
      title: z.string().min(1),
      image: imageSchema,
      playUrl: safeLinkSchema,
      sheetUrl: safeLinkSchema,
      // Se ven en el reverso de la carta (Pointer). Un valor cada uno, p. ej. "1 in 325" / "96%"
      hitRate: z.string().optional(),
      rtp: z.string().optional(),
    })
  )
  .min(1);

// games-group (Figma 5218:452). Los consecutivos se agrupan en una section-games
// a sangre, así que no llevan surface.
// section-image-card (Figma 5200:1897) y section-mascot (5200:1972): a sangre,
// sin surface. "highlight" = fragmento del título que va en rojo.
const sectionImageCardSection = z.object({
  type: z.literal("sectionImageCard"),
  background: imageSchema,
  backgroundMobile: imageSchema.optional(),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  highlight: z.string().optional(),
  copy: z.string().optional(),
  image: imageSchema.optional(),
});

const sectionMascotSection = z.object({
  type: z.literal("sectionMascot"),
  eyebrow: z.string().optional(),
  signature: imageSchema.optional(),
  title: z.string().min(1),
  highlight: z.string().optional(),
  copy: z.string().optional(),
  image: imageSchema.optional(),
});

const gamesGroupSection = z.object({
  type: z.literal("gamesGroup"),
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  cards: gameCardsSchema,
});

const carouselSection = z.object({
  type: z.literal("carousel"),
  ...surfaceField,
  title: z.string().optional(),
  cards: gameCardsSchema,
});

const faqSection = z.object({
  type: z.literal("faq"),
  ...surfaceField,
  title: z.string().optional(),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .min(1),
});

const introTextSection = z.object({
  type: z.literal("introText"),
  ...surfaceField,
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  highlight: z.string().optional(),
  copy: z.string().optional(),
  // xl = header-hero (título Display/2XL), l = header-section (título Display/XL)
  size: z.enum(["xl", "l"]).default("xl"),
});

// "Title": solo cabecera (eyebrow + título + subrayado), sin texto.
// xl = title-hero (Display/2XL), l = title-section (Display/XL).
// Se pinta con IntroText sin copy.
const titleHeroSection = z.object({
  type: z.literal("titleHero"),
  ...surfaceField,
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  highlight: z.string().optional(),
  size: z.enum(["xl", "l"]).default("xl"),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSection,
  sectionVideoSection,
  textImageSection,
  ctaSection,
  gallerySection,
  gamesGroupSection,
  sectionImageCardSection,
  sectionMascotSection,
  carouselSection,
  faqSection,
  introTextSection,
  titleHeroSection,
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
    // publicada (accesible por URL) pero fuera del menú de cabecera/móvil;
    // p. ej. la página "showcase" de prueba de componentes
    hideFromNav: z.boolean().default(false),
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
