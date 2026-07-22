// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: floating paw prints, ties & stars ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fff9f0";
  const BG_BOTTOM = "#e4eef7";

  const COLORS = [
    "rgba(232, 156, 43, 0.62)",  // caramelo
    "rgba(244, 189, 99, 0.58)",  // caramelo claro
    "rgba(47,  93,  138, 0.55)", // azul paizão
    "rgba(91,  139, 184, 0.55)", // azul claro
    "rgba(127, 191, 90,  0.55)", // verde
    "rgba(245, 200, 66,  0.62)", // dourado
  ];

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
      this.rotSpeed  = (Math.random() - 0.5) * 0.025;
      this.alpha     = 0.45 + Math.random() * 0.45;
      this.color     = COLORS[Math.floor(Math.random() * COLORS.length)];

      const types = ["paw", "paw", "paw", "tie", "star"];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.size = this.type === "star"
        ? 6 + Math.random() * 8
        : 11 + Math.random() * 16;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.6;
      this.y        -= this.speedY;
      if (this.y < -50) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === "paw")      drawPaw(ctx, this.size, this.color);
      else if (this.type === "tie") drawTie(ctx, this.size, this.color);
      else                          drawStar(ctx, this.size, this.color);

      ctx.restore();
    }
  }

  // ── Paw print (patinha do caramelo) ──
  function drawPaw(ctx, s, color) {
    ctx.fillStyle = color;
    // main pad
    ctx.beginPath();
    ctx.ellipse(0, s * 0.35, s * 0.4, s * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    // toes
    const toes = [
      [-s * 0.34, -s * 0.15, s * 0.15],
      [-s * 0.11, -s * 0.32, s * 0.16],
      [ s * 0.11, -s * 0.32, s * 0.16],
      [ s * 0.34, -s * 0.15, s * 0.15],
    ];
    toes.forEach(([tx, ty, tr]) => {
      ctx.beginPath();
      ctx.ellipse(tx, ty, tr, tr * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ── Tie (gravatinha) ──
  function drawTie(ctx, s, color) {
    ctx.fillStyle = color;
    // knot
    ctx.beginPath();
    ctx.moveTo(-s * 0.22, -s * 0.5);
    ctx.lineTo( s * 0.22, -s * 0.5);
    ctx.lineTo( s * 0.16, -s * 0.24);
    ctx.lineTo(-s * 0.16, -s * 0.24);
    ctx.closePath();
    ctx.fill();
    // body
    ctx.beginPath();
    ctx.moveTo(-s * 0.16, -s * 0.24);
    ctx.lineTo( s * 0.16, -s * 0.24);
    ctx.lineTo( s * 0.3,   s * 0.5);
    ctx.lineTo( 0,         s * 0.7);
    ctx.lineTo(-s * 0.3,   s * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  // ── Star (4/8-point) ──
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
    const count = Math.min(50, Math.floor((W * H) / 18000));
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
