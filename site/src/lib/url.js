// Antepone la "base" del sitio (p. ej. "/CMS") a las rutas absolutas
// internas ("/images/foo.png", "/contacto"), para que funcionen tanto en
// local como publicadas en https://<usuario>.github.io/<repo>/.
// Deja intactas las URLs externas, anclas (#...), mailto:, tel:, etc.
export function withBase(url) {
  if (!url || typeof url !== "string") return url;
  if (!url.startsWith("/") || url.startsWith("//")) return url;
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (base && (url === base || url.startsWith(base + "/"))) return url;
  return base + url;
}
