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
  // De momento, sin minificar el HTML (fase de desarrollo) para poder leerlo fácilmente
  compressHTML: false,
  vite: {
    build: {
      // Deja el CSS legible (sin minificar) para poder revisarlo en el editor
      cssMinify: false,
      rollupOptions: {
        output: {
          // Nombre semántico para el CSS compilado (en vez del hash tipo _slug_.B6Rz826O.css)
          assetFileNames: (asset) => {
            const name = asset.name || asset.names?.[0] || "";
            return name.endsWith(".css") ? "_astro/styles.css" : "_astro/[name].[hash][extname]";
          },
        },
      },
    },
  },
});
