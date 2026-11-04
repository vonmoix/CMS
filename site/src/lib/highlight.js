// Parte un título en [antes, resaltado, después] para pintar en rojo
// (.text--primary) el fragmento "highlight", como en la landing.
export function splitHighlight(title = "", highlight = "") {
  const at = highlight ? title.indexOf(highlight) : -1;
  if (at < 0) return [title, "", ""];
  return [title.slice(0, at), highlight, title.slice(at + highlight.length)];
}
