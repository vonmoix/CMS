// Editor de páginas: construye el formulario de secciones dinámicamente a
// partir del catálogo (admin/lib/sectionSchema.js, incrustado en la página
// como JSON) y mantiene un estado en memoria que se serializa a JSON en el
// input oculto "sectionsJson" justo antes de enviar el formulario.
(function () {
  const catalogEl = document.getElementById("section-catalog");
  const initialEl = document.getElementById("initial-sections");
  const imagePreviewConfigEl = document.getElementById("image-preview-config");
  if (!catalogEl) return; // esta página no es el editor

  const CATALOG = JSON.parse(catalogEl.textContent);
  const state = { sections: JSON.parse(initialEl.textContent || "[]") };
  const IMAGE_PREVIEW_CONFIG = JSON.parse(imagePreviewConfigEl.textContent || "{}");

  // Las imágenes subidas se comitean directo al repo de GitHub y no a este
  // servidor (ver admin/lib/github.js), así que la ruta pública "/images/…"
  // solo resuelve una vez publicado el sitio (~1-2 min). Para previsualizar
  // al instante, las servimos desde raw.githubusercontent.com.
  function resolveImagePreviewSrc(src) {
    if (!src) return "";
    const { mediaPublicBase, mediaRawBase } = IMAGE_PREVIEW_CONFIG;
    if (mediaRawBase && mediaPublicBase && src.startsWith(mediaPublicBase + "/")) {
      return mediaRawBase + src.slice(mediaPublicBase.length);
    }
    if (/^https?:\/\//.test(src)) return src;
    const { publicImagesBase, rawImageBase } = IMAGE_PREVIEW_CONFIG;
    if (rawImageBase && publicImagesBase && src.startsWith(publicImagesBase)) {
      return rawImageBase + src.slice(publicImagesBase.length);
    }
    return src;
  }

  const root = document.getElementById("sections-root");
  const typeSelect = document.getElementById("add-section-type");
  const addBtn = document.getElementById("add-section-btn");
  const form = document.getElementById("page-form");
  const sectionsJsonInput = document.getElementById("sectionsJson");

  // ---------- helpers de path (ej. "0.button.label", "0.images.2.src") ----------
  function getAt(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }
  function setAt(obj, path, value) {
    const keys = path.split(".");
    let target = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      // Crea los objetos/arrays intermedios que falten (p. ej. un botón o una
      // imagen opcional que la página guardada no tenía): si no, la edición
      // lanza un error y se pierde sin avisar.
      if (target[keys[i]] == null) target[keys[i]] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;
  }

  function defaultValueForField(field) {
    switch (field.type) {
      case "image":
        return { src: "", alt: "" };
      case "button":
        return { label: "", href: "" };
      case "imageList":
        return [];
      case "faqList":
        return [];
      case "cardList":
        return [];
      case "select":
        return field.default || (field.options && field.options[0] && field.options[0].value) || "";
      default:
        return "";
    }
  }

  function newSection(type) {
    const def = CATALOG[type];
    const section = { type };
    def.fields.forEach((f) => {
      section[f.name] = defaultValueForField(f);
    });
    return section;
  }

  // ---------- construcción de <option> para "añadir sección" ----------
  Object.keys(CATALOG).forEach((type) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = CATALOG[type].label;
    typeSelect.appendChild(opt);
  });

  addBtn.addEventListener("click", () => {
    state.sections.push(newSection(typeSelect.value));
    render();
  });

  // ---------- render ----------
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  }

  // Radios nativos (flechas y lector de pantalla) pintados como muestras de color
  function swatchControl(path, field, value, labelledBy) {
    const current = value || field.default;
    const group = el("div", { class: "swatches", role: "radiogroup", "aria-labelledby": labelledBy });
    field.options.forEach((o) => {
      const radio = el("input", { type: "radio", class: "sr-only", name: path, value: o.value, "aria-label": o.label });
      radio.checked = o.value === current;
      radio.addEventListener("change", () => setAt(state, path, o.value));
      const chip = el("span", { class: "swatch-chip" });
      chip.style.backgroundColor = o.color;
      group.appendChild(
        el("label", { class: "swatch" }, [radio, chip, el("span", { class: "swatch-tip", text: o.label })])
      );
    });
    return group;
  }

  function radioControl(path, field, value, labelledBy) {
    const current = value || field.default;
    const group = el("div", { class: "radios", role: "radiogroup", "aria-labelledby": labelledBy });
    field.options.forEach((o) => {
      const radio = el("input", { type: "radio", name: path, value: o.value });
      radio.checked = o.value === current;
      radio.addEventListener("change", () => setAt(state, path, o.value));
      group.appendChild(el("label", { class: "radio" }, [radio, el("span", { text: o.label })]));
    });
    return group;
  }

  function fieldControl(path, field, value) {
    if (field.type === "textarea") {
      const t = el("textarea", { rows: "3", "data-path": path });
      t.value = value || "";
      t.addEventListener("input", () => setAt(state, path, t.value));
      return t;
    }
    if (field.type === "select") {
      const s = el("select", { "data-path": path });
      (field.options || []).forEach((o) => {
        const opt = el("option", { value: o.value, text: o.label });
        if (o.value === value) opt.selected = true;
        s.appendChild(opt);
      });
      s.addEventListener("change", () => setAt(state, path, s.value));
      return s;
    }
    // text (default)
    const i = el("input", { type: "text", "data-path": path });
    i.value = value || "";
    i.addEventListener("input", () => setAt(state, path, i.value));
    return i;
  }

  function imageControl(path, value, { withAlt = true } = {}) {
    value = value || { src: "", alt: "" };

    const preview = el("div", { class: "image-preview" });
    const previewImg = el("img", { alt: "" });
    preview.appendChild(previewImg);
    function updatePreview(src) {
      const resolved = resolveImagePreviewSrc(src);
      preview.style.display = resolved ? "" : "none";
      previewImg.src = resolved || "";
    }
    updatePreview(value.src);

    const srcInput = el("input", { type: "text", placeholder: "/images/archivo.jpg" });
    srcInput.value = value.src || "";
    srcInput.addEventListener("input", () => {
      setAt(state, `${path}.src`, srcInput.value);
      updatePreview(srcInput.value);
    });

    const altInput = el("input", { type: "text", placeholder: "Texto alternativo (accesibilidad)" });
    altInput.value = value.alt || "";
    altInput.addEventListener("input", () => setAt(state, `${path}.alt`, altInput.value));

    const fileInput = el("input", { type: "file", accept: "image/*", class: "file-input" });
    const status = el("span", { class: "muted upload-status" });
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      uploadImage(file, status, (uploadedPath) => {
        srcInput.value = uploadedPath;
        setAt(state, `${path}.src`, uploadedPath);
        updatePreview(uploadedPath);
      });
      fileInput.value = ""; // permite volver a elegir el mismo archivo
    });
    // El botón nativo sale en el idioma del navegador y no se puede maquetar
    const uploadBtn = el("button", {
      type: "button",
      class: "btn btn-secondary btn-small",
      text: "Subir nueva imagen",
      onclick: () => fileInput.click(),
    });

    return el("div", { class: "image-field" }, [
      preview,
      el("label", { class: "small-label", text: "Ruta de la imagen" }, [srcInput]),
      el("div", { class: "image-upload" }, [uploadBtn, fileInput, status]),
      withAlt && el("label", { class: "small-label", text: "Texto alternativo" }, [altInput]),
    ]);
  }

  function buttonControl(path, value) {
    value = value || { label: "", href: "" };
    const labelInput = el("input", { type: "text", placeholder: "Texto del botón" });
    labelInput.value = value.label || "";
    labelInput.addEventListener("input", () => setAt(state, `${path}.label`, labelInput.value));

    const hrefInput = el("input", { type: "text", placeholder: "https:// o /ruta" });
    hrefInput.value = value.href || "";
    hrefInput.addEventListener("input", () => setAt(state, `${path}.href`, hrefInput.value));

    return el("div", { class: "button-field" }, [
      el("label", { class: "small-label", text: "Texto" }, [labelInput]),
      el("label", { class: "small-label", text: "Enlace" }, [hrefInput]),
    ]);
  }

  function imageListControl(path, values) {
    values = values || [];
    const list = el("div", { class: "repeat-list" });
    values.forEach((item, idx) => {
      const row = el("div", { class: "repeat-item" }, [
        imageControl(`${path}.${idx}`, item),
        el("button", {
          type: "button",
          class: "link-btn danger",
          text: "Quitar imagen",
          onclick: () => {
            values.splice(idx, 1);
            render();
          },
        }),
      ]);
      list.appendChild(row);
    });
    const addBtn = el("button", {
      type: "button",
      class: "btn btn-secondary btn-small",
      text: "Añadir imagen",
      onclick: () => {
        values.push({ src: "", alt: "" });
        render();
      },
    });
    return el("div", {}, [list, addBtn]);
  }

  function faqListControl(path, values) {
    values = values || [];
    const list = el("div", { class: "repeat-list" });
    values.forEach((item, idx) => {
      const q = el("input", { type: "text", placeholder: "Pregunta" });
      q.value = item.question || "";
      q.addEventListener("input", () => setAt(state, `${path}.${idx}.question`, q.value));

      const a = el("textarea", { rows: "2", placeholder: "Respuesta" });
      a.value = item.answer || "";
      a.addEventListener("input", () => setAt(state, `${path}.${idx}.answer`, a.value));

      const row = el("div", { class: "repeat-item" }, [
        el("label", { class: "small-label", text: "Pregunta" }, [q]),
        el("label", { class: "small-label", text: "Respuesta" }, [a]),
        el("button", {
          type: "button",
          class: "link-btn danger",
          text: "Quitar pregunta",
          onclick: () => {
            values.splice(idx, 1);
            render();
          },
        }),
      ]);
      list.appendChild(row);
    });
    const addBtn = el("button", {
      type: "button",
      class: "btn btn-secondary btn-small",
      text: "Añadir pregunta",
      onclick: () => {
        values.push({ question: "", answer: "" });
        render();
      },
    });
    return el("div", {}, [list, addBtn]);
  }

  function cardListControl(path, values) {
    values = values || [];
    const list = el("div", { class: "repeat-list" });
    values.forEach((item, idx) => {
      const base = `${path}.${idx}`;
      const textInput = (key, placeholder) => {
        const i = el("input", { type: "text", placeholder });
        i.value = item[key] || "";
        i.addEventListener("input", () => setAt(state, `${base}.${key}`, i.value));
        return i;
      };
      const cardGroup = (title, children) =>
        el("div", { class: "card-group", role: "group", "aria-label": title }, [
          el("span", { class: "label", text: title }),
          ...children,
        ]);
      const row = el("div", { class: "repeat-item" }, [
        cardGroup("Parte delantera de la carta", [
          el("label", { class: "small-label", text: "Nombre del juego" }, [textInput("title", "Flaming Gridlines")]),
          // el texto alternativo de la carta es siempre el nombre del juego
          imageControl(`${base}.image`, item.image, { withAlt: false }),
        ]),
        cardGroup("Parte trasera de la carta", [
          el("label", { class: "small-label", text: "Enlace botón Play" }, [textInput("playUrl", "https://")]),
          el("label", { class: "small-label", text: "Enlace botón Info (PDF)" }, [textInput("sheetUrl", "https://")]),
          el("label", { class: "small-label", text: "Feature Hit Rate (opcional)" }, [textInput("hitRate", "1 in 325")]),
          el("label", { class: "small-label", text: "RTP (opcional)" }, [textInput("rtp", "96%")]),
        ]),
        el("button", {
          type: "button",
          class: "link-btn danger",
          text: "Quitar carta",
          "data-remove-card": base,
          onclick: async () => {
            const name = (item.title || "").trim();
            const ok = await window.confirmDelete({
              title: name ? `¿Quitar la carta «${name}»?` : "¿Quitar esta carta?",
              message: "Se quita de la sección. No se publica hasta que pulses «Guardar y publicar».",
              typed: false,
            });
            if (!ok) return;
            values.splice(idx, 1);
            render();
            // el botón ya no existe: el foco pasa a la carta que ocupa su sitio
            const next = root.querySelector(`[data-remove-card="${path}.${Math.min(idx, values.length - 1)}"]`);
            if (next) next.focus({ preventScroll: true });
          },
        }),
      ]);
      list.appendChild(row);
    });
    const addBtn = el("button", {
      type: "button",
      class: "btn btn-secondary btn-small",
      text: "Añadir carta",
      onclick: () => {
        values.push({ title: "", image: { src: "", alt: "" }, playUrl: "", sheetUrl: "" });
        render();
      },
    });
    return el("div", {}, [list, addBtn]);
  }

  function uploadImage(file, statusEl, onDone) {
    uploadFile("/api/upload", "image", "Imagen", file, statusEl, onDone);
  }

  function uploadFile(url, field, noun, file, statusEl, onDone) {
    statusEl.textContent = "Subiendo…";
    const fd = new FormData();
    fd.append(field, file);
    fetch(url, { method: "POST", body: fd })
      .then((r) =>
        r.text().then((text) => {
          let body;
          try {
            body = JSON.parse(text);
          } catch {
            body = { error: `Error del servidor (HTTP ${r.status}). Mira los logs del panel.` };
          }
          return { ok: r.ok, body };
        })
      )
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.error || "Error al subir el archivo");
        statusEl.textContent = noun === "Imagen" ? "Imagen subida ✓" : `${noun} subido ✓`;
        onDone(body.path);
      })
      .catch((err) => {
        statusEl.textContent = err.message;
      });
  }

  // "Vídeo de cabecera (section-video)" → nombre legible + nombre técnico aparte
  function sectionName(label) {
    const m = /^(.*?)\s*\(([^)]+)\)$/.exec(label || "");
    const name = el("span", { class: "section-name", text: m ? m[1] : label });
    if (m) name.appendChild(el("code", { text: m[2] }));
    return name;
  }

  function plainLabel(label) {
    const m = /^(.*?)\s*\(([^)]+)\)$/.exec(label || "");
    return m ? m[1] : label;
  }

  const ICON_CHEVRON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const ICON_TRASH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>';

  // Secciones plegadas (por objeto: al reordenar siguen plegadas)
  const collapsed = new WeakSet();

  // Pista de una línea para reconocer una sección plegada
  function sectionHint(section) {
    const v = section.title || section.eyebrow || section.label || "";
    return typeof v === "string" ? v.replace(/\s+/g, " ").trim() : "";
  }

  function sectionCard(section, index) {
    const def = CATALOG[section.type];
    if (!def) {
      return el("div", { class: "section-card section-fields", id: `section-${index}` }, [
        el("p", { class: "error", text: `Tipo de sección desconocido: "${section.type}"` }),
      ]);
    }

    const fieldsWrap = el("div", { class: "section-fields" });
    def.fields.forEach((field) => {
      const path = `sections.${index}.${field.name}`;
      const value = section[field.name];
      if (field.display) {
        // Varios radios: no pueden ir dentro de un único <label>
        const labelId = `${path}-label`;
        fieldsWrap.appendChild(
          el("div", { class: "field-label" }, [
            el("span", { id: labelId, text: field.label }),
            (field.display === "swatches" ? swatchControl : radioControl)(path, field, value, labelId),
          ])
        );
        return;
      }
      let control;
      if (field.type === "image") control = imageControl(path, value);
      else if (field.type === "button") control = buttonControl(path, value);
      else if (field.type === "imageList") control = imageListControl(path, value);
      else if (field.type === "cardList") control = cardListControl(path, value);
      else if (field.type === "faqList") control = faqListControl(path, value);
      else control = fieldControl(path, field, value);

      fieldsWrap.appendChild(
        el("label", { class: "field-label" }, [
          el("span", { text: field.label + (field.required ? " *" : "") }),
          control,
        ])
      );
    });

    const card = el("div", { class: "section-card", id: `section-${index}` });
    const fieldsId = `section-fields-${index}`;
    fieldsWrap.id = fieldsId;

    const toggle = el("button", {
      type: "button",
      class: "section-toggle",
      "aria-controls": fieldsId,
    }, [
      el("span", { class: "section-chevron" }),
      el("span", { class: "section-index", text: String(index + 1).padStart(2, "0") }),
      sectionName(def.label),
      el("span", { class: "section-hint", text: sectionHint(section) }),
    ]);
    toggle.querySelector(".section-chevron").innerHTML = ICON_CHEVRON;

    function applyCollapsed() {
      const isCollapsed = collapsed.has(section);
      card.classList.toggle("is-collapsed", isCollapsed);
      fieldsWrap.hidden = isCollapsed;
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
      toggle.title = isCollapsed ? "Expandir sección" : "Colapsar sección";
      // la pista se actualiza con lo que se haya escrito mientras estaba abierta
      toggle.querySelector(".section-hint").textContent = sectionHint(section);
    }
    toggle.addEventListener("click", () => {
      if (collapsed.has(section)) collapsed.delete(section);
      else collapsed.add(section);
      applyCollapsed();
    });

    const deleteBtn = el("button", {
      type: "button",
      class: "icon-btn danger",
      title: "Eliminar sección",
      "aria-label": "Eliminar sección",
      onclick: async () => {
        const label = `${String(index + 1).padStart(2, "0")} · ${plainLabel(def.label)}`;
        const ok = window.confirmDelete
          ? await window.confirmDelete({
              title: `Eliminar la sección ${label}`,
              message: "Se quita de la página. No se publica hasta que pulses «Guardar y publicar».",
            })
          : confirm("¿Eliminar esta sección?");
        if (!ok) return;
        state.sections.splice(index, 1);
        render();
        // el botón ya no existe: el foco pasa a la sección que ocupa su sitio
        const toggles = root.querySelectorAll(".section-toggle");
        const next = toggles[Math.min(index, toggles.length - 1)];
        if (next) next.focus();
      },
    });
    deleteBtn.innerHTML = ICON_TRASH;

    const header = el("div", { class: "section-card-header" }, [
      toggle,
      el("div", { class: "section-card-actions" }, [
        el("button", {
          type: "button",
          class: "icon-btn",
          title: "Subir",
          "aria-label": "Subir sección",
          text: "↑",
          onclick: () => {
            if (index === 0) return;
            const tmp = state.sections[index - 1];
            state.sections[index - 1] = state.sections[index];
            state.sections[index] = tmp;
            render();
          },
        }),
        el("button", {
          type: "button",
          class: "icon-btn",
          title: "Bajar",
          "aria-label": "Bajar sección",
          text: "↓",
          onclick: () => {
            if (index === state.sections.length - 1) return;
            const tmp = state.sections[index + 1];
            state.sections[index + 1] = state.sections[index];
            state.sections[index] = tmp;
            render();
          },
        }),
        deleteBtn,
      ]),
    ]);

    card.appendChild(header);
    card.appendChild(fieldsWrap);
    applyCollapsed();
    return card;
  }

  const outline = document.getElementById("section-outline");
  const countEl = document.getElementById("sections-count");

  function renderOutline() {
    const n = state.sections.length;
    if (countEl) countEl.textContent = n ? `${n} ${n === 1 ? "sección" : "secciones"}` : "";
    if (!outline) return;
    outline.innerHTML = "";
    if (!n) {
      outline.appendChild(el("li", { class: "outline-empty", text: "Sin secciones todavía." }));
      return;
    }
    state.sections.forEach((section, index) => {
      const def = CATALOG[section.type];
      const a = el("a", { href: `#section-${index}` }, [
        el("span", { class: "mono", text: String(index + 1).padStart(2, "0") }),
        el("span", { text: def ? plainLabel(def.label) : section.type }),
      ]);
      outline.appendChild(el("li", {}, [a]));
    });
  }

  function render() {
    root.innerHTML = "";
    if (!state.sections.length) {
      root.appendChild(
        el("p", {
          class: "section-empty",
          text: "Esta página todavía no tiene secciones. Elige un tipo abajo y añade la primera.",
        })
      );
    }
    state.sections.forEach((section, index) => {
      root.appendChild(sectionCard(section, index));
    });
    renderOutline();
  }

  const collapseAllBtn = document.getElementById("collapse-all");
  const expandAllBtn = document.getElementById("expand-all");
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener("click", () => {
      state.sections.forEach((s) => collapsed.add(s));
      render();
    });
  }
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      state.sections.forEach((s) => collapsed.delete(s));
      render();
    });
  }

  form.addEventListener("submit", () => {
    sectionsJsonInput.value = JSON.stringify(state.sections);
  });

  render();
})();
