import { defineConfig } from "astro/config";

// --- Configuración para GitHub Pages ---
// Si publicáis en https://<usuario>.github.io/<repo>/ (páginas de proyecto),
// necesitáis "site" y "base" apuntando al repo. Si publicáis en un dominio
// propio o en https://<usuario>.github.io/ (página de usuario/organización),
// dejad base en "/".
//
// Podéis sobreescribir ambos valores por variable de entorno al hacer build
// (así el mismo código sirve para "preview" en local y para producción):
//   SITE_URL=https://miempresa.github.io PUBLIC_BASE=/mi-repo npm run build
const site = process.env.SITE_URL || "https://vonmoix.github.io";
const base = process.env.PUBLIC_BASE || "/CMS";

export default defineConfig({
  site,
  base,
  outDir: "./dist",
  trailingSlash: "ignore",
});
