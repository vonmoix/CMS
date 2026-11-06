// La cabeza del personaje del login sigue al cursor y al campo con el foco.
// Es un dibujo plano: se inclina poco para que parezca que gira.
(function () {
  const mascot = document.querySelector(".login-mascot");
  if (!mascot) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const TURN = 13; // grados a izquierda y derecha
  const NOD = 8; // grados arriba y abajo
  const EASE = 0.12;

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = null;

  function step() {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;
    mascot.style.setProperty("--look-x", current.x.toFixed(3));
    mascot.style.setProperty("--look-y", current.y.toFixed(3));
    const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.002;
    frame = moving ? requestAnimationFrame(step) : null;
  }

  function lookAt(clientX, clientY) {
    const box = mascot.getBoundingClientRect();
    const dx = (clientX - (box.left + box.width / 2)) / (innerWidth / 2);
    const dy = (clientY - (box.top + box.height * 0.55)) / (innerHeight / 2);
    target.x = Math.max(-1, Math.min(1, dx));
    target.y = Math.max(-1, Math.min(1, dy));
    if (!frame) frame = requestAnimationFrame(step);
  }

  function lookAhead() {
    target.x = 0;
    target.y = 0;
    if (!frame) frame = requestAnimationFrame(step);
  }

  mascot.style.setProperty("--turn", `${TURN}deg`);
  mascot.style.setProperty("--nod", `${NOD}deg`);

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.addEventListener("pointermove", (e) => lookAt(e.clientX, e.clientY));
    document.documentElement.addEventListener("pointerleave", lookAhead);
  }

  document.addEventListener("focusin", (e) => {
    if (!(e.target instanceof HTMLInputElement)) return;
    const box = e.target.getBoundingClientRect();
    lookAt(box.left + box.width / 2, box.top + box.height / 2);
  });
})();
