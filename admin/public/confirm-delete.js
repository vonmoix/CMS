// Diálogo de confirmación para borrar: hay que escribir "delete".
//   confirmDelete({ title, message }) → Promise<boolean>
// Además, cualquier <form data-confirm-delete data-confirm-title="…"
// data-confirm-text="…"> pide la confirmación antes de enviarse.
(function () {
  const WORD = "delete";
  let dialog = null;
  let input = null;
  let confirmBtn = null;
  let titleEl = null;
  let textEl = null;
  let settle = null;
  let opener = null;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "confirm-dialog";
    dialog.setAttribute("aria-labelledby", "confirm-title");
    dialog.setAttribute("aria-describedby", "confirm-text");
    dialog.innerHTML =
      '<form method="dialog" class="confirm-body" novalidate>' +
      '<h2 id="confirm-title"></h2>' +
      '<p id="confirm-text"></p>' +
      '<label class="confirm-label" for="confirm-input">Escribe <code>' + WORD + "</code> para confirmar</label>" +
      '<input id="confirm-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" />' +
      '<div class="confirm-actions">' +
      '<button type="button" class="btn btn-secondary" data-cancel>Cancelar</button>' +
      '<button type="submit" class="btn btn-danger" value="confirm" disabled>Eliminar</button>' +
      "</div></form>";
    document.body.appendChild(dialog);

    titleEl = dialog.querySelector("#confirm-title");
    textEl = dialog.querySelector("#confirm-text");
    input = dialog.querySelector("#confirm-input");
    confirmBtn = dialog.querySelector('button[type="submit"]');

    input.addEventListener("input", () => {
      confirmBtn.disabled = input.value.trim().toLowerCase() !== WORD;
    });
    dialog.querySelector("[data-cancel]").addEventListener("click", () => dialog.close("cancel"));
    // clic en el fondo oscuro = cancelar
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close("cancel");
    });
    dialog.addEventListener("close", () => {
      const ok = dialog.returnValue === "confirm";
      const done = settle;
      settle = null;
      if (opener && document.contains(opener)) opener.focus();
      opener = null;
      if (done) done(ok);
    });
  }

  window.confirmDelete = function confirmDelete({ title, message }) {
    if (!dialog) build();
    if (settle) return Promise.resolve(false);
    opener = document.activeElement;
    titleEl.textContent = title || "¿Eliminar?";
    textEl.textContent = message || "Esta acción no se puede deshacer.";
    input.value = "";
    confirmBtn.disabled = true;
    dialog.returnValue = "";
    return new Promise((resolve) => {
      settle = resolve;
      dialog.showModal();
      input.focus();
    });
  };

  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-confirm-delete")) return;
    e.preventDefault();
    window
      .confirmDelete({
        title: form.getAttribute("data-confirm-title"),
        message: form.getAttribute("data-confirm-text"),
      })
      .then((ok) => {
        if (ok) form.submit();
      });
  });
})();
