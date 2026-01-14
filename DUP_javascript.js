document.addEventListener("DOMContentLoaded", function () {

  /* ==========================
     CAROSELLO PROGETTI
  =========================== */

  const track   = document.getElementById("track");
  const prev    = document.getElementById("prev");
  const next    = document.getElementById("next");
  const dotsBox = document.getElementById("dots");

  // Attivo il carosello SOLO se esistono tutti gli elementi necessari
  if (track && prev && next && dotsBox) {

    const wrap  = track.parentElement;
    const cards = Array.from(track.children);

    const isMobile = () => matchMedia("(max-width:767px)").matches;

    // crea i pallini
    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.onclick = () => activate(i, true);
      dotsBox.appendChild(dot);
    });
    const dots = Array.from(dotsBox.children);

    let current = 0;

    function center(i) {
      const card  = cards[i];
      const axis  = isMobile() ? "top" : "left";
      const size  = isMobile() ? "clientHeight" : "clientWidth";
      const start = isMobile() ? card.offsetTop : card.offsetLeft;
      wrap.scrollTo({
        [axis]: start - (wrap[size] / 2 - card[size] / 2),
        behavior: "smooth"
      });
    }

    function toggleUI(i) {
      cards.forEach((c, k) => c.toggleAttribute("active", k === i));
      dots.forEach((d, k) => d.classList.toggle("active", k === i));
      prev.disabled = i === 0;
      next.disabled = i === cards.length - 1;
    }

    function activate(i, scroll) {
      if (i === current) return;
      current = i;
      toggleUI(i);
      if (scroll) center(i);
    }

    function go(step) {
      activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
    }

    prev.onclick = () => go(-1);
    next.onclick = () => go(1);

    addEventListener(
      "keydown",
      (e) => {
        if (["ArrowRight", "ArrowDown"].includes(e.key)) go(1);
        if (["ArrowLeft", "ArrowUp"].includes(e.key)) go(-1);
      },
      { passive: true }
    );

    cards.forEach((card, i) => {
      card.addEventListener(
        "mouseenter",
        () => matchMedia("(hover:hover)").matches && activate(i, true)
      );
      card.addEventListener("click", () => activate(i, true));
    });

    let sx = 0, sy = 0;

    track.addEventListener(
      "touchstart",
      (e) => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - sx;
        const dy = e.changedTouches[0].clientY - sy;
        if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
          go((isMobile() ? dy : dx) > 0 ? -1 : 1);
      },
      { passive: true }
    );

    if (window.matchMedia("(max-width:767px)").matches) dotsBox.hidden = true;

    addEventListener("resize", () => center(current));

    toggleUI(0);
    center(0);
  }



  /* ==========================
     BOTTONE DARK / LIGHT MODE
  =========================== */

  const toggleButton = document.getElementById("toggle-theme");
  const body         = document.body;

  if (!toggleButton) return; // se non c'è il bottone, esco tranquilla

  // Testo iniziale del bottone
  if (body.classList.contains("dark-mode")) {
    toggleButton.textContent = "☀️ Light";
  } else {
    toggleButton.textContent = "🌙 Dark";
  }

  toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    toggleButton.textContent = body.classList.contains("dark-mode")
      ? "☀️ Light"
      : "🌙 Dark";
  });

});


  /* ==========================
   BLOB CURSOR — pannello solo LAG
========================== */

document.addEventListener("DOMContentLoaded", function () {

  // IMPOSTAZIONI FISSE
  let color = "#ffffffff";  // colore blob
  let size  = 20;         // dimensione blob
  let lag   = 0.15;       // valore iniziale lag

  // Posizione del mouse e del blob
  let targetPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let blobPos   = { x: targetPos.x, y: targetPos.y };

  // CREA IL BLOB
  const blob = document.createElement("div");
  Object.assign(blob.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    width: size + "px",
    height: size + "px",
    borderRadius: "50%",
    background: color,
    pointerEvents: "none",
    filter: "blur(10px)",
    zIndex: "9999",
    transform: `translate(${blobPos.x - size / 2}px, ${blobPos.y - size / 2}px)`
  });
  document.body.appendChild(blob);

  // MOUSE MOVE
  window.addEventListener("mousemove", e => {
    targetPos.x = e.clientX;
    targetPos.y = e.clientY;
  });

  // ANIMAZIONE
  function animate() {
    blobPos.x += (targetPos.x - blobPos.x) * lag;
    blobPos.y += (targetPos.y - blobPos.y) * lag;

    blob.style.transform =
      `translate(${blobPos.x - size / 2}px, ${blobPos.y - size / 2}px)`;

    requestAnimationFrame(animate);
  }
  animate();


  /* ===========
     PANNELLO LAG
  =========== */

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    background: "rgba(255, 255, 255, 0.4)",  // più trasparente
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "12px",
    zIndex: "10000",
    backdropFilter: "blur(4px)"
  });

  panel.innerHTML = `
    <div style="margin-bottom:6px; font-weight:bold;">
      Troppo cursor lag? Modificalo da qui
    </div>

    <div>
      <label>Lag:&nbsp;</label>
      <input id="blob-lag" type="range" min="0.01" max="0.5" step="0.01" value="${lag}">
    </div>
  `;

  document.body.appendChild(panel);

  // INPUT — SOLO LAG
  document.getElementById("blob-lag").addEventListener("input", function () {
    lag = Number(this.value);
  });

});
