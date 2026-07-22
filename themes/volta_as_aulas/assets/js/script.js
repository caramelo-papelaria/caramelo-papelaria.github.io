// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: floating pencils, books & stars ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fffdf5";
  const BG_BOTTOM = "#e4f2d8";

  const COLORS = [
    "rgba(249, 195, 51,  0.68)", // amarelo lapis
    "rgba(127, 191, 90,  0.60)", // verde marca
    "rgba(232, 156, 43,  0.60)", // caramelo
    "rgba(59,  111, 176, 0.55)", // azul tinta
    "rgba(224, 82,  82,  0.55)", // vermelho
  ];

  const WOOD     = "rgba(226, 189, 130, 0.85)";
  const GRAPHITE = "rgba(70, 66, 60, 0.85)";
  const ERASER   = "rgba(242, 145, 160, 0.85)";
  const FERRULE  = "rgba(178, 184, 190, 0.85)";
  const PAGES    = "rgba(255, 253, 245, 0.9)";

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x         = Math.random() * W;
      this.y         = initial ? Math.random() * H : H + 40;
      this.speedY    = 0.4 + Math.random() * 0.7;
      this.speedX    = (Math.random() - 0.5) * 0.5;
      this.wobble    = Math.random() * Math.PI * 2;
      this.wobbleSpd = 0.008 + Math.random() * 0.014;
      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.022;
      this.alpha     = 0.45 + Math.random() * 0.45;
      this.color     = COLORS[Math.floor(Math.random() * COLORS.length)];

      const types = ["pencil", "pencil", "book", "book", "star"];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.size = this.type === "star"
        ? 6 + Math.random() * 7
        : 12 + Math.random() * 14;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.6;
      this.y        -= this.speedY;
      if (this.y < -60) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === "pencil")    drawPencil(ctx, this.size, this.color);
      else if (this.type === "book") drawBook(ctx, this.size, this.color);
      else                           drawStar(ctx, this.size, this.color);

      ctx.restore();
    }
  }

  // ── Pencil (lapis) ──
  function drawPencil(ctx, s, color) {
    const w = s * 0.17;

    // eraser
    ctx.fillStyle = ERASER;
    ctx.fillRect(-w, -s * 0.8, w * 2, s * 0.14);
    // metal ferrule
    ctx.fillStyle = FERRULE;
    ctx.fillRect(-w, -s * 0.66, w * 2, s * 0.09);
    // body
    ctx.fillStyle = color;
    ctx.fillRect(-w, -s * 0.57, w * 2, s * 1.05);
    // body highlight stripe
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    ctx.fillRect(-w * 0.35, -s * 0.57, w * 0.4, s * 1.05);
    // wooden tip
    ctx.fillStyle = WOOD;
    ctx.beginPath();
    ctx.moveTo(-w, s * 0.48);
    ctx.lineTo(w, s * 0.48);
    ctx.lineTo(0, s * 0.82);
    ctx.closePath();
    ctx.fill();
    // graphite point
    ctx.fillStyle = GRAPHITE;
    ctx.beginPath();
    ctx.moveTo(-w * 0.34, s * 0.71);
    ctx.lineTo(w * 0.34, s * 0.71);
    ctx.lineTo(0, s * 0.82);
    ctx.closePath();
    ctx.fill();
  }

  // ── Book (livrinho / caderno) ──
  function drawBook(ctx, s, color) {
    const w = s * 0.62;
    const h = s * 0.8;

    // cover
    ctx.fillStyle = color;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    // pages (right edge)
    ctx.fillStyle = PAGES;
    ctx.fillRect(w / 2 - s * 0.1, -h / 2 + s * 0.05, s * 0.1, h - s * 0.1);
    // spine
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(-w / 2, -h / 2, s * 0.09, h);
    // elastic band / detail
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fillRect(-w / 2 + s * 0.2, -h / 2, s * 0.07, h);
  }

  // ── Star ──
  function drawStar(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const r = i % 2 === 0 ? s : s * 0.38;
      i === 0
        ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ── Init & loop ──
  function init() {
    resize();
    const count = Math.min(48, Math.floor((W * H) / 19000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, BG_TOP);
    grad.addColorStop(1, BG_BOTTOM);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener("resize", () => { resize(); init(); });
  init();
  loop();
})();
