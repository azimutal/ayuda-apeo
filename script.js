/* ApeoWind — Manual. Navegación, scrollspy y huecos de captura. */
(function () {
  "use strict";

  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuToggle = document.getElementById("menuToggle");
  const irArriba = document.getElementById("irArriba");
  const enlaces = Array.from(document.querySelectorAll(".sidebar__nav a"));
  const secciones = enlaces
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // ── Menú móvil ──────────────────────────────────────────────
  function abreMenu(abrir) {
    sidebar.classList.toggle("abierto", abrir);
    overlay.classList.toggle("visible", abrir);
    menuToggle.classList.toggle("abierto", abrir);
    menuToggle.setAttribute("aria-expanded", String(abrir));
  }
  menuToggle.addEventListener("click", () =>
    abreMenu(!sidebar.classList.contains("abierto"))
  );
  overlay.addEventListener("click", () => abreMenu(false));
  enlaces.forEach((a) =>
    a.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches) abreMenu(false);
    })
  );

  // ── Scrollspy: resalta la sección visible ───────────────────
  const porId = new Map(enlaces.map((a) => [a.getAttribute("href").slice(1), a]));

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        enlaces.forEach((a) => a.classList.remove("activo"));
        const activo = porId.get(e.target.id);
        if (activo) {
          activo.classList.add("activo");
          // Mantén el enlace activo a la vista dentro del menú largo.
          activo.scrollIntoView({ block: "nearest" });
        }
      });
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );
  secciones.forEach((s) => observer.observe(s));

  // ── Botón "volver arriba" ───────────────────────────────────
  function alScroll() {
    irArriba.classList.toggle("visible", window.scrollY > 600);
  }
  window.addEventListener("scroll", alScroll, { passive: true });
  irArriba.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  alScroll();

  // ── Capturas que aún no existen → hueco con el nombre esperado ──
  // Cuando sustituyas el archivo en images/ por una captura real, se
  // mostrará automáticamente sin tocar nada más.
  document.querySelectorAll("figure.captura img").forEach((img) => {
    img.addEventListener("error", () => {
      if (img.dataset.fallado) return; // evita bucles si el hueco no cargara
      img.dataset.fallado = "1";
      const ruta = img.getAttribute("src");
      const hueco = document.createElement("div");
      hueco.className = "captura__hueco";
      hueco.innerHTML =
        '<span class="ico">📷</span>' +
        "Captura pendiente — coloca el archivo:<br>" +
        '<span class="nombre"></span>';
      hueco.querySelector(".nombre").textContent = ruta;
      img.replaceWith(hueco);
    });
  });
})();
