/* Li Jie / JaysOne AI — original generative stipple + interactions */

(function () {
  const RED = "#c94a3a";
  const INK = "#1a1a1a";

  // ---------- Stipple portrait (original abstract head silhouette, not anime copy) ----------
  function drawStipplePortrait(canvas, opts) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Density field: soft oval face + hair mass + shoulder, original geometry
    function density(x, y) {
      const nx = (x - w * 0.5) / w;
      const ny = (y - h * 0.42) / h;
      // face oval
      const face = Math.exp(-((nx * nx) / 0.045 + (ny * ny) / 0.08));
      // hair dome
      const hairX = nx;
      const hairY = (y - h * 0.22) / h;
      const hair = Math.exp(-((hairX * hairX) / 0.09 + (hairY * hairY) / 0.035)) * (y < h * 0.48 ? 1 : 0);
      // left hair sweep
      const sweep = Math.exp(-(((nx + 0.18) ** 2) / 0.02 + ((ny + 0.05) ** 2) / 0.06));
      // shoulders
      const shoulder = Math.exp(-(((nx) ** 2) / 0.18 + (((y - h * 0.85) / h) ** 2) / 0.03));
      // eye accents (small dense spots)
      const eyeL = Math.exp(-(((nx + 0.08) ** 2) / 0.0015 + (((ny + 0.02) ** 2) / 0.0012)));
      const eyeR = Math.exp(-(((nx - 0.08) ** 2) / 0.0015 + (((ny + 0.02) ** 2) / 0.0012)));
      // soft jaw shadow
      const jaw = Math.exp(-((nx * nx) / 0.03 + (((ny - 0.12) ** 2) / 0.01))) * 0.45;
      let d = face * 0.55 + hair * 0.95 + sweep * 0.7 + shoulder * 0.5 + eyeL * 1.2 + eyeR * 1.2 + jaw;
      // fade edges
      const edge = Math.min(x / (w * 0.08), (w - x) / (w * 0.08), y / (h * 0.05), (h - y) / (h * 0.08), 1);
      return Math.max(0, Math.min(1, d * edge));
    }

    const step = opts?.step || 3.2;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const d = density(x + step * 0.5, y + step * 0.5);
        if (d < 0.06) continue;
        const jitter = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1;
        const jx = (jitter - 0.5) * step * 0.6;
        const jy = (((Math.sin(y * 39.1 + x * 11.7) * 23421.1) % 1) - 0.5) * step * 0.6;
        const r = 0.55 + d * 1.55;
        // warm ink with sparse red sparkle in hair
        if (d > 0.75 && jitter > 0.92 && y < h * 0.4) {
          ctx.fillStyle = RED;
        } else {
          const a = 0.25 + d * 0.7;
          ctx.fillStyle = `rgba(26,26,26,${a.toFixed(3)})`;
        }
        ctx.beginPath();
        ctx.arc(x + jx, y + jy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawStippleId(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    // blueprint-style abstract bust silhouette (original)
    function dens(x, y) {
      const nx = (x - w * 0.5) / w;
      const ny = (y - h * 0.4) / h;
      const head = Math.exp(-((nx * nx) / 0.04 + (ny * ny) / 0.07));
      const hair = Math.exp(-((((nx) ** 2) / 0.07) + ((((y - h * 0.2) / h) ** 2) / 0.03)));
      const body = Math.exp(-((nx * nx) / 0.12 + ((((y - h * 0.78) / h) ** 2) / 0.04)));
      return Math.min(1, head * 0.7 + hair * 0.85 + body * 0.55);
    }
    const step = 2.8;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const d = dens(x, y);
        if (d < 0.08) continue;
        ctx.fillStyle = `rgba(26,26,26,${(0.2 + d * 0.75).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + d * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // corner crosshair accents already in HTML
  }

  function drawQrDots(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = canvas.width;
    ctx.clearRect(0, 0, s, s);
    const cell = 6;
    for (let y = 4; y < s - 4; y += cell) {
      for (let x = 4; x < s - 4; x += cell) {
        const n = Math.abs(Math.sin(x * 0.37 + y * 0.51) * Math.cos(x * 0.19 - y * 0.27));
        if (n > 0.42) {
          ctx.fillStyle = n > 0.75 ? RED : INK;
          ctx.fillRect(x, y, cell - 2, cell - 2);
        }
      }
    }
    // finder corners
    [[8, 8], [s - 26, 8], [8, s - 26]].forEach(([ox, oy]) => {
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.strokeRect(ox, oy, 18, 18);
      ctx.fillStyle = INK;
      ctx.fillRect(ox + 5, oy + 5, 8, 8);
    });
  }

  drawStipplePortrait(document.getElementById("stippleHero"), { step: 3.1 });
  drawStippleId(document.getElementById("stippleId"));
  drawQrDots(document.getElementById("qrDots"));

  // ---------- Mobile nav ----------
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // ---------- Active section highlight ----------
  const sections = ["about", "writing", "video", "build", "contact"];
  const navAnchors = document.querySelectorAll(".nav-links a[data-section]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        navAnchors.forEach((a) => a.classList.toggle("active", a.dataset.section === id));
      });
    },
    { rootMargin: "-40% 0px -45% 0px", threshold: 0.01 }
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });

  // ---------- Mode tabs (cosmetic scroll) ----------
  document.querySelectorAll(".mode-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mode-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const map = { write: "writing", shoot: "video", build: "build" };
      const target = document.getElementById(map[btn.dataset.mode]);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // ---------- Terminal animation ----------
  const termBody = document.getElementById("termBody");
  const termBar = document.getElementById("termBar");
  const termPct = document.getElementById("termPct");
  const logs = [
    { t: "10:12:01", m: "checking workspace" },
    { t: "10:12:02", m: "loading modules · 课格" },
    { t: "10:12:04", m: "sync calendar schema" },
    { t: "10:12:07", m: "android build ok" },
    { t: "10:12:09", m: "web preview ready" },
    { t: "10:12:11", m: "publish notes → drafting" },
  ];

  function runTerminal() {
    if (!termBody) return;
    // keep first prompt line
    const first = termBody.querySelector(".line");
    termBody.innerHTML = "";
    if (first) {
      first.style.opacity = "1";
      termBody.appendChild(first);
    } else {
      const line = document.createElement("div");
      line.className = "line";
      line.style.opacity = "1";
      line.innerHTML = '<span class="prompt">$</span> lijie build --in-public';
      termBody.appendChild(line);
    }
    let i = 0;
    const tick = () => {
      if (i >= logs.length) {
        if (termBar) termBar.style.width = "50%";
        if (termPct) termPct.textContent = "v0.1.0 · compiling... 50%";
        setTimeout(runTerminal, 6000);
        return;
      }
      const row = document.createElement("div");
      row.className = "line";
      row.style.animationDelay = "0s";
      row.innerHTML = `<span class="ts">${logs[i].t}</span>${logs[i].m}`;
      termBody.appendChild(row);
      const pct = Math.round(((i + 1) / logs.length) * 50);
      if (termBar) termBar.style.width = pct + "%";
      if (termPct) termPct.textContent = `v0.1.0 · compiling... ${pct}%`;
      i += 1;
      setTimeout(tick, 700);
    };
    setTimeout(tick, 600);
  }
  runTerminal();

  // ---------- Soft reveal ----------
  document.querySelectorAll(".section, .hero").forEach((el, idx) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.7s ease, transform 0.7s ease";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "none";
    }, 80 + idx * 60);
  });
})();
