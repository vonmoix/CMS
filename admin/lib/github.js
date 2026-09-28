const { Octokit } = require("@octokit/rest");

/**
 * Capa fina sobre la API de GitHub: el panel nunca toca el repo con git
 * directamente, todo son commits vía API (createOrUpdateFileContents /
 * deleteFile). Así el panel puede vivir en cualquier servidor sin necesitar
 * acceso git ni claves SSH, solo un token con permiso de escritura sobre el
 * repo (contenidos).
 */
function getConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const contentPath = (process.env.CONTENT_PATH || "site/src/content/pages").replace(/\/$/, "");
  const imagesPath = (process.env.IMAGES_PATH || "site/public/images").replace(/\/$/, "");
  const publicImagesBase = (process.env.PUBLIC_IMAGES_BASE || "/images").replace(/\/$/, "");

  if (!owner || !repo) {
    throw new Error(
      "Faltan GITHUB_OWNER y/o GITHUB_REPO en la configuración (.env). Revisa admin/.env.example."
    );
  }
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("Falta GITHUB_TOKEN en la configuración (.env).");
  }

  return { owner, repo, branch, contentPath, imagesPath, publicImagesBase };
}

function getClient() {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

async function listPages() {
  const octokit = getClient();
  const { owner, repo, branch, contentPath } = getConfig();

  let entries;
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: contentPath,
      ref: branch,
    });
    entries = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    if (err.status === 404) return [];
    throw err;
  }

  const jsonFiles = entries.filter((e) => e.type === "file" && e.name.endsWith(".json"));

  const pages = await Promise.all(
    jsonFiles.map(async (file) => {
      const slug = file.name.replace(/\.json$/, "");
      try {
        const { data } = await getPage(slug, octokit);
        return { slug, sha: file.sha, data };
      } catch (err) {
        return { slug, sha: file.sha, data: null, error: err.message };
      }
    })
  );

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function getPage(slug, octokitClient) {
  const octokit = octokitClient || getClient();
  const { owner, repo, branch, contentPath } = getConfig();
  const path = `${contentPath}/${slug}.json`;

  const res = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
  if (Array.isArray(res.data) || !("content" in res.data)) {
    throw new Error(`"${path}" no es un archivo`);
  }

  const raw = Buffer.from(res.data.content, "base64").toString("utf-8");
  return { data: JSON.parse(raw), sha: res.data.sha, path };
}

async function savePage({ slug, data, sha, editorName }) {
  const octokit = getClient();
  const { owner, repo, branch, contentPath } = getConfig();
  const path = `${contentPath}/${slug}.json`;

  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
    updatedBy: editorName || "panel",
  };

  const content = Buffer.from(JSON.stringify(payload, null, 2) + "\n", "utf-8").toString("base64");
  const action = sha ? "Actualiza" : "Crea";

  const commit = (shaToUse) =>
    octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      message: `${action} página "${slug}" (${editorName || "panel"})`,
      content,
      sha: shaToUse || undefined,
    });

  try {
    const res = await commit(sha);
    return { sha: res.data.content.sha };
  } catch (err) {
    // La API de contenidos de GitHub a veces devuelve un sha ya desfasado
    // justo después de un commit muy reciente (p. ej. varias operaciones de
    // reordenar seguidas, o un push manual justo antes): si el sha no
    // coincide, releemos el archivo y reintentamos una vez con el sha real.
    if (sha && err.status === 409) {
      const fresh = await getPage(slug, octokit);
      const res = await commit(fresh.sha);
      return { sha: res.data.content.sha };
    }
    throw err;
  }
}

async function deletePage({ slug, sha, editorName }) {
  const octokit = getClient();
  const { owner, repo, branch, contentPath } = getConfig();
  const path = `${contentPath}/${slug}.json`;

  await octokit.rest.repos.deleteFile({
    owner,
    repo,
    path,
    branch,
    message: `Elimina página "${slug}" (${editorName || "panel"})`,
    sha,
  });
}

async function uploadImage({ filename, buffer, editorName }) {
  const octokit = getClient();
  const { owner, repo, branch, imagesPath, publicImagesBase } = getConfig();

  const safeName = filename
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.\-]+/g, "-");
  const unique = `${Date.now()}-${safeName}`;
  const path = `${imagesPath}/${unique}`;

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message: `Sube imagen "${unique}" (${editorName || "panel"})`,
    content: buffer.toString("base64"),
  });

  return { path: `${publicImagesBase}/${unique}` };
}

module.exports = { listPages, getPage, savePage, deletePage, uploadImage, getConfig };
