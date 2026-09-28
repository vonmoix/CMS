#!/usr/bin/env node
// Valida los JSON de src/content/pages sin depender de Astro/zod, para poder
// ejecutarse con "node" a secas (por ejemplo en un pre-commit o para probar
// el modelo de contenido sin tener el resto de dependencias instaladas).
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, "..", "src", "content", "pages");

const requiredBySectionType = {
  hero: ["heading"],
  textImage: ["heading", "body", "image"],
  richText: ["body"],
  cta: ["heading", "button"],
  gallery: ["images"],
  faq: ["items"],
};

const knownTypes = Object.keys(requiredBySectionType);

let files;
try {
  files = readdirSync(contentDir).filter((f) => f.endsWith(".json"));
} catch (err) {
  console.error(`No se pudo leer ${contentDir}: ${err.message}`);
  process.exit(1);
}

let errors = [];
const slugs = new Map();

for (const file of files) {
  const fullPath = join(contentDir, file);
  let data;
  try {
    data = JSON.parse(readFileSync(fullPath, "utf-8"));
  } catch (err) {
    errors.push(`${file}: JSON inválido (${err.message})`);
    continue;
  }

  if (!data.title) errors.push(`${file}: falta "title"`);
  if (!data.slug) errors.push(`${file}: falta "slug"`);
  if (data.slug) {
    if (slugs.has(data.slug)) {
      errors.push(`${file}: slug "${data.slug}" duplicado (también en ${slugs.get(data.slug)})`);
    } else {
      slugs.set(data.slug, file);
    }
  }

  if (!Array.isArray(data.sections)) {
    errors.push(`${file}: "sections" debe ser un array`);
    continue;
  }

  data.sections.forEach((section, i) => {
    if (!section.type) {
      errors.push(`${file}: sección #${i} sin "type"`);
      return;
    }
    if (!knownTypes.includes(section.type)) {
      errors.push(`${file}: sección #${i} tiene un type desconocido ("${section.type}")`);
      return;
    }
    for (const field of requiredBySectionType[section.type]) {
      if (section[field] === undefined || section[field] === null || section[field] === "") {
        errors.push(`${file}: sección #${i} (${section.type}) le falta "${field}"`);
      }
    }
  });
}

if (errors.length) {
  console.error(`✗ ${errors.length} problema(s) en el contenido:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ ${files.length} página(s) validadas correctamente en src/content/pages`);
