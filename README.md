# Sistema de gestión de contenido (a medida)

Panel para que el equipo de marketing cree y edite páginas del sitio sin
tocar código, sobre un sitio estático publicado en GitHub Pages.

## Cómo funciona (visión general)

```
Equipo de marketing
        │  edita una página en el navegador
        ▼
   Panel de administración (Node/Express) ──── se despliega aparte
        │                                      (Render, Railway, Fly,
        │  hace commit del contenido            un VPS, etc. — NO en
        │  vía API de GitHub                    GitHub Pages)
        ▼
   Repositorio de GitHub
   (site/src/content/pages/*.json)
        │
        │  cada commit dispara el workflow
        ▼
   GitHub Actions
   (compila el sitio con Astro)
        │
        ▼
   GitHub Pages  →  sitio publicado
```

El contenido de cada página se guarda como un archivo JSON (una "página" =
un título + una lista ordenada de "secciones": hero, texto+imagen, CTA,
galería, FAQ...). El sitio público (carpeta `site/`) es un proyecto
[Astro](https://astro.build) que lee esos JSON y genera HTML estático. El
panel (carpeta `admin/`) es la única pieza con lógica de servidor: no
publica nada directamente, solo hace commits al repositorio a través de la
API de GitHub; es GitHub Actions quien reconstruye y publica el sitio.

**Por qué esta arquitectura:** pediste un sistema a medida (no un CMS de
terceros) para una sola web, con equipo no técnico, y hosting en GitHub
Pages. Como GitHub Pages solo sirve archivos estáticos (no puede ejecutar
un servidor), el panel de edición tiene que vivir en otro sitio con
capacidad de ejecutar Node — de ahí que sean dos proyectos separados
(`site/` y `admin/`) dentro de este mismo repositorio.

## Estructura del repositorio

```
site/                    Sitio público (Astro)
  src/content/pages/*.json   Contenido de cada página
  src/content/config.ts      Esquema/validación del contenido
  src/components/sections/   Un componente por tipo de sección
  src/pages/                 Rutas ("/", "/[slug]/")
  scripts/check-content.mjs  Valida los JSON de contenido (sin dependencias)

admin/                   Panel de administración (Node/Express)
  server.js                  Rutas del panel
  lib/github.js              Lee/escribe contenido vía API de GitHub
  lib/sectionSchema.js       Catálogo de tipos de sección (genera los formularios)
  views/                     Plantillas EJS (login, listado, editor)
  public/admin.js            Editor de secciones en el navegador

.github/workflows/deploy.yml  Build + publicación automática en Pages
```

## Puesta en marcha

### 1. Repositorio y GitHub Pages

1. Subid este proyecto a un repositorio de GitHub (si no lo está ya).
2. En **Settings → Pages**, elegid "Source: GitHub Actions".
3. (Opcional pero recomendado) En **Settings → Environments → github-pages
   → Variables**, o en **Settings → Actions → Variables**, definid:
   - `SITE_URL`: p. ej. `https://tuorganizacion.github.io`
   - `PUBLIC_BASE`: `/nombre-del-repo` (o `/` si publicáis en una página de
     usuario/organización o con dominio propio)

   Si no las definís, el workflow usa por defecto
   `https://<owner>.github.io` + `/<nombre-del-repo>`.

4. Hacé push a `main`: el workflow `deploy.yml` compila `site/` y publica
   en Pages automáticamente. La primera vez tardará ~1-2 minutos.

### 2. Token de GitHub para el panel

El panel necesita permiso para hacer commits al repo:

1. Creá un **fine-grained personal access token**
   (github.com → Settings → Developer settings → Fine-grained tokens):
   - Repository access: solo este repositorio.
   - Permissions → Contents: **Read and write**.
2. Guardad ese token; lo usaréis como `GITHUB_TOKEN` en el paso siguiente.

(Para más de un editor o más control de auditoría, se puede sustituir este
token por una GitHub App instalada solo en el repo — el código de
`admin/lib/github.js` es el único sitio que habría que tocar.)

### 3. Desplegar el panel de administración

El panel es una app Node normal (`admin/`), desplegable en cualquier
plataforma que ejecute Node o contenedores Docker (se incluye un
`Dockerfile`): Render, Railway, Fly.io, un VPS con PM2/systemd, etc.

Pasos generales:

1. Copiá `admin/.env.example` a `admin/.env` y completá los valores
   (contraseña del equipo, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`,
   etc.). En vuestra plataforma de hosting, estas mismas claves se
   configuran como variables de entorno del servicio.
2. Instalar y arrancar:
   ```bash
   cd admin
   npm install
   npm start
   ```
3. Poné el panel detrás de HTTPS (la mayoría de plataformas lo hacen
   automáticamente) — la contraseña viaja en el login y no debería ir en
   claro por HTTP.
4. Compartí la URL del panel + la contraseña con el equipo de marketing.
   Cada persona introduce su nombre al entrar (se usa para firmar los
   commits y mostrar "última edición por...").

### 4. Probar en local

```bash
# Sitio público
cd site
npm install
npm run dev        # http://localhost:4321

# Panel (en otra terminal)
cd admin
npm install
cp .env.example .env   # completar valores
npm run dev         # http://localhost:3000
```

> Nota: en el entorno donde se generó este proyecto no había acceso al
> registro de npm, así que el código no pudo instalarse ni compilarse ahí.
> Se revisó a mano (sintaxis validada con `node --check` en todos los
> archivos `.js`, y el contenido de ejemplo con
> `node site/scripts/check-content.mjs`), pero conviene que la primera vez
> que lo instaléis reviséis que `npm install` y `npm run build` terminan
> sin errores en `site/`, y que el panel arranca y guarda una página de
> prueba correctamente antes de dárselo al equipo.

## Uso para el equipo de marketing

1. Entrar al panel con nombre + contraseña.
2. **Nueva página**: título, slug (parte de la URL; "index" = página de
   inicio) y añadir secciones con "+ Añadir sección".
3. Cada sección tiene sus propios campos (título, texto, imagen, botón...).
   Las imágenes se suben directamente desde el formulario.
4. Reordenar secciones con las flechas ↑/↓, quitar con "Eliminar sección".
5. Marcar "Borrador" para preparar contenido sin publicarlo todavía.
6. "Guardar y publicar": el panel hace commit del contenido y GitHub
   Actions reconstruye el sitio (tarda 1-2 minutos en verse reflejado).

## Añadir un nuevo tipo de sección

Hace falta tocar tres archivos:

1. `site/src/content/config.ts` — añadir el esquema (zod) de los campos.
2. `site/src/components/sections/NuevoTipo.astro` — el componente visual,
   y registrarlo en `site/src/components/SectionRenderer.astro`.
3. `admin/lib/sectionSchema.js` — añadir la entrada correspondiente en
   `SECTION_CATALOG` (el panel genera el formulario automáticamente a
   partir de ahí, no hace falta tocar `admin/public/admin.js`).

## Seguridad y siguientes pasos razonables

- La autenticación actual es una contraseña compartida por todo el equipo.
  Es sencilla y suficiente para un equipo pequeño de confianza; si hiciera
  falta acceso individual o permisos distintos por persona, se puede
  sustituir por GitHub OAuth (dado que ya usáis GitHub) sin tocar el resto
  del sistema.
- El token de GitHub tiene acceso de escritura al repo: guardadlo solo como
  variable de entorno del panel, nunca en el código.
- No hay control de versiones/deshacer dentro del panel más allá del
  historial de commits de git (que sí lo tiene: cada guardado es un commit
  distinto, así que siempre se puede volver atrás desde GitHub).
- Si en el futuro gestionáis más de una web con este sistema, el modelo de
  contenido (`sections`) ya está pensado para reutilizarse; lo que
  cambiaría es añadir un `site` o `siteId` a cada página y que el panel
  filtre/publique por sitio.
