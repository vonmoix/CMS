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

  function imageControl(path, value) {
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
    });

    return el("div", { class: "image-field" }, [
      preview,
      el("label", { class: "small-label", text: "Ruta de la imagen" }, [srcInput]),
      el("label", { class: "small-label", text: "Subir nueva imagen" }, [fileInput]),
      status,
      el("label", { class: "small-label", text: "Texto alternativo" }, [altInput]),
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
      text: "+ Añadir imagen",
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
      text: "+ Añadir pregunta",
      onclick: () => {
        values.push({ question: "", answer: "" });
        render();
      },
    });
    return el("div", {}, [list, addBtn]);
  }

  function documentControl(path, value) {
    const link = el("a", { class: "doc-preview", target: "_blank", rel: "noopener", text: "Ver PDF actual" });
    const urlInput = el("input", { type: "text", placeholder: "https:// o /files/games/archivo.pdf" });
    urlInput.value = value || "";
    function updateLink(v) {
      const { publicFilesBase, rawFilesBase } = IMAGE_PREVIEW_CONFIG;
      let href = v || "";
      if (rawFilesBase && publicFilesBase && href.startsWith(publicFilesBase + "/")) {
        href = rawFilesBase + href.slice(publicFilesBase.length);
      }
      const safe = /^(https?:\/\/|\/(?!\/))/i.test(href);
      link.hidden = !safe;
      if (safe) link.href = href;
      else link.removeAttribute("href");
    }
    updateLink(urlInput.value);
    urlInput.addEventListener("input", () => {
      setAt(state, path, urlInput.value);
      updateLink(urlInput.value);
    });
    const fileInput = el("input", { type: "file", accept: "application/pdf,.pdf", class: "file-input" });
    const status = el("span", { class: "muted upload-status" });
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      uploadFile("/api/upload-document", "document", "Documento", file, status, (uploadedPath) => {
        urlInput.value = uploadedPath;
        setAt(state, path, uploadedPath);
        updateLink(uploadedPath);
      });
    });
    return el("div", { class: "doc-field" }, [
      el("label", { class: "small-label", text: "Enlace del botón Game sheet" }, [urlInput]),
      el("label", { class: "small-label", text: "Subir nuevo documento (PDF)" }, [fileInput]),
      status,
      link,
    ]);
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
      const row = el("div", { class: "repeat-item" }, [
        el("label", { class: "small-label", text: "Nombre del juego" }, [textInput("title", "Flaming Gridlines")]),
        imageControl(`${base}.image`, item.image),
        el("label", { class: "small-label", text: "Enlace del botón Play Demo" }, [
          textInput("playUrl", "https:// o /ruta"),
        ]),
        documentControl(`${base}.sheetUrl`, item.sheetUrl),
        el("button", {
          type: "button",
          class: "link-btn danger",
          text: "Quitar carta",
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
      text: "+ Añadir carta",
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
      .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.error || "Error al subir el archivo");
        statusEl.textContent = noun === "Imagen" ? "Imagen subida ✓" : `${noun} subido ✓`;
        onDone(body.path);
      })
      .catch((err) => {
        statusEl.textContent = err.message;
      });
  }

  function sectionCard(section, index) {
    const def = CATALOG[section.type];
    if (!def) {
      return el("div", { class: "card section-card" }, [
        el("p", { class: "error", text: `Tipo de sección desconocido: "${section.type}"` }),
      ]);
    }

    const fieldsWrap = el("div", { class: "section-fields" });
    def.fields.forEach((field) => {
      const path = `sections.${index}.${field.name}`;
      const value = section[field.name];
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

    const header = el("div", { class: "section-card-header" }, [
      el("strong", { text: `${index + 1}. ${def.label}` }),
      el("div", { class: "section-card-actions" }, [
        el("button", {
          type: "button",
          class: "icon-btn",
          title: "Subir",
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
          text: "↓",
          onclick: () => {
            if (index === state.sections.length - 1) return;
            const tmp = state.sections[index + 1];
            state.sections[index + 1] = state.sections[index];
            state.sections[index] = tmp;
            render();
          },
        }),
        el("button", {
          type: "button",
          class: "link-btn danger",
          text: "Eliminar sección",
          onclick: () => {
            if (!confirm("¿Eliminar esta sección?")) return;
            state.sections.splice(index, 1);
            render();
          },
        }),
      ]),
    ]);

    return el("div", { class: "card section-card" }, [header, fieldsWrap]);
  }

  function render() {
    root.innerHTML = "";
    if (!state.sections.length) {
      root.appendChild(el("p", { class: "muted", text: "Esta página todavía no tiene secciones." }));
    }
    state.sections.forEach((section, index) => {
      root.appendChild(sectionCard(section, index));
    });
  }

  form.addEventListener("submit", () => {
    sectionsJsonInput.value = JSON.stringify(state.sections);
  });

  render();
})();
