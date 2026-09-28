require("dotenv").config();

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("node:path");

const github = require("./lib/github");
const { SECTION_CATALOG, cleanSections } = require("./lib/sectionSchema");

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const PORT = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
  console.warn(
    "⚠️  SESSION_SECRET no está definido en .env — usando uno temporal (las sesiones se invalidan al reiniciar)."
  );
}
if (!process.env.ADMIN_PASSWORD) {
  console.warn("⚠️  ADMIN_PASSWORD no está definido en .env — nadie podrá iniciar sesión.");
}

// Render/Railway/etc. terminan HTTPS en un proxy delante de la app: sin
// esto, Express cree que la petición es HTTP y no envía la cookie "secure"
// (el login entraría en bucle).
app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cambia-esto-en-produccion",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 12, // 12 horas
    },
  })
);

// Comprobación de salud para la plataforma de hosting (sin login)
app.get("/healthz", (req, res) => res.send("ok"));

// -------------------- Auth --------------------

function requireAuth(req, res, next) {
  if (req.session.editorName) return next();
  return res.redirect("/login");
}

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (!name || !name.trim()) {
    return res.render("login", { error: "Indica tu nombre." });
  }
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return res.render("login", { error: "Contraseña incorrecta." });
  }
  req.session.editorName = name.trim();
  res.redirect("/");
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.use(requireAuth);

// -------------------- Dashboard --------------------

// URL pública de cada página en el sitio publicado ("index" es la portada).
const PUBLIC_SITE_URL = (process.env.PUBLIC_SITE_URL || "https://vonmoix.github.io/CMS").replace(/\/$/, "");
const publicUrl = (slug) => (slug === "index" ? `${PUBLIC_SITE_URL}/` : `${PUBLIC_SITE_URL}/${slug}/`);

app.get("/", async (req, res, next) => {
  try {
    const pages = await github.listPages();
    res.render("dashboard", {
      pages,
      publicUrl,
      editorName: req.session.editorName,
      flash: req.query.flash,
    });
  } catch (err) {
    next(err);
  }
});

// -------------------- Editor --------------------

app.get("/pages/new", (req, res) => {
  res.render("edit", {
    isNew: true,
    slug: "",
    page: { title: "", description: "", slug: "", draft: false, seo: {}, sections: [] },
    sha: null,
    sectionCatalog: SECTION_CATALOG,
    error: null,
    editorName: req.session.editorName,
  });
});

app.get("/pages/:slug/edit", async (req, res, next) => {
  try {
    const { data, sha } = await github.getPage(req.params.slug);
    res.render("edit", {
      isNew: false,
      slug: req.params.slug,
      page: data,
      sha,
      sectionCatalog: SECTION_CATALOG,
      error: null,
      editorName: req.session.editorName,
    });
  } catch (err) {
    if (err.status === 404) return res.status(404).send("Página no encontrada");
    next(err);
  }
});

function slugify(input) {
  return input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

app.post("/pages/:slugParam", async (req, res, next) => {
  const isNew = req.params.slugParam === "new";
  try {
    // El slug puede venir editado desde el formulario (renombrar una
    // página existente); si por lo que fuera no llega, usamos el de la URL
    // como red de seguridad.
    const rawSlug = req.body.slug || req.params.slugParam;
    const slug = rawSlug === "index" ? "index" : slugify(rawSlug);

    if (!slug) {
      throw Object.assign(new Error("El slug no puede estar vacío."), { userFacing: true });
    }

    let sections = [];
    try {
      sections = JSON.parse(req.body.sectionsJson || "[]");
    } catch {
      throw Object.assign(new Error("Las secciones no tienen un formato válido."), {
        userFacing: true,
      });
    }

    if (!req.body.title || !req.body.title.trim()) {
      throw Object.assign(new Error("El título de la página es obligatorio."), { userFacing: true });
    }

    const cleaned = cleanSections(sections);
    if (cleaned.errors.length) {
      throw Object.assign(new Error(cleaned.errors.join(" ")), { userFacing: true });
    }
    sections = cleaned.sections;

    const data = {
      title: req.body.title,
      description: req.body.description || "",
      slug,
      draft: req.body.draft === "on",
      seo: {
        title: req.body.seoTitle || "",
        description: req.body.seoDescription || "",
      },
      sections,
    };

    const existingSha = req.body.sha || null;

    // Si cambia el slug de una página existente, el archivo cambia de nombre:
    // borramos el antiguo tras crear el nuevo.
    const previousSlug = req.body.previousSlug;

    await github.savePage({
      slug,
      data,
      sha: previousSlug && previousSlug !== slug ? null : existingSha,
      editorName: req.session.editorName,
    });

    if (previousSlug && previousSlug !== slug) {
      try {
        const { sha: oldSha } = await github.getPage(previousSlug);
        await github.deletePage({ slug: previousSlug, sha: oldSha, editorName: req.session.editorName });
      } catch {
        // si no se pudo borrar el archivo antiguo, seguimos: no es crítico
      }
    }

    res.redirect(`/?flash=${encodeURIComponent(`Página "${slug}" guardada. La publicación tarda ~1-2 minutos.`)}`);
  } catch (err) {
    if (err.userFacing) {
      let sectionsForRedisplay = [];
      try {
        sectionsForRedisplay = JSON.parse(req.body.sectionsJson || "[]");
      } catch {
        // el propio JSON de secciones era inválido: al reabrir el editor
        // simplemente no las precargamos, en vez de romper la página de error
      }
      return res.status(400).render("edit", {
        isNew,
        slug: req.params.slugParam,
        page: {
          ...req.body,
          seo: { title: req.body.seoTitle || "", description: req.body.seoDescription || "" },
          sections: sectionsForRedisplay,
        },
        sha: req.body.sha,
        sectionCatalog: SECTION_CATALOG,
        error: err.message,
        editorName: req.session.editorName,
      });
    }
    next(err);
  }
});

app.post("/pages/:slug/delete", async (req, res, next) => {
  try {
    const { sha } = await github.getPage(req.params.slug);
    await github.deletePage({ slug: req.params.slug, sha, editorName: req.session.editorName });
    res.redirect(`/?flash=${encodeURIComponent(`Página "${req.params.slug}" eliminada.`)}`);
  } catch (err) {
    next(err);
  }
});

// -------------------- Subida de imágenes --------------------

app.post("/api/upload", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No se recibió ningún archivo." });
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "El archivo debe ser una imagen." });
    }
    const { path: publicPath } = await github.uploadImage({
      filename: req.file.originalname,
      buffer: req.file.buffer,
      editorName: req.session.editorName,
    });
    res.json({ path: publicPath });
  } catch (err) {
    next(err);
  }
});

// -------------------- Errores --------------------

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`
    <h1>Error</h1>
    <p>${err.message}</p>
    <p><a href="/">Volver</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`Panel de administración escuchando en http://localhost:${PORT}`);
});
