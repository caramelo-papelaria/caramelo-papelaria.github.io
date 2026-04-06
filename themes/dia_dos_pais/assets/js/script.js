// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: stars and small ties floating ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#e8eaf6";
  const BG_BOTTOM = "#e3f2fd";

  const COLORS = [
    "rgba(26,35,126,0.5)",
    "rgba(25,118,210,0.55)",
    "rgba(255,193,7,0.6)",
    "rgba(100,181,246,0.6)",
    "rgba(57,73,171,0.5)",
  ];

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x        = Math.random() * W;
      this.y        = initial ? Math.random() * H : H + 40;
      this.speedY   = 0.3 + Math.random() * 0.5;
      this.speedX   = (Math.random() - 0.5) * 0.35;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd= 0.006 + Math.random() * 0.01;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.015;
      this.alpha    = 0.4 + Math.random() * 0.45;
      this.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      const types   = ["star", "star", "star", "tie"];
      this.type     = types[Math.floor(Math.random() * types.length)];
      this.size     = this.type === "tie" ? 14 + Math.random() * 10 : 10 + Math.random() * 16;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.4;
      this.y        -= this.speedY;
      if (this.y < -50) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === "star") {
        drawStar(ctx, this.size * 0.5, this.color);
      } else {
        drawTie(ctx, this.size, this.color);
      }

      ctx.restore();
    }
  }

  function drawStar(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5;
      const r = i % 2 === 0 ? s : s * 0.45;
      i === 0
        ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
        : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawTie(ctx, s, color) {
    ctx.fillStyle = color;
    // Knot
    ctx.fillRect(-s * 0.25, -s, s * 0.5, s * 0.3);
    // Body (trapezoid)
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.7);
    ctx.lineTo( s * 0.2, -s * 0.7);
    ctx.lineTo( s * 0.35,  s * 0.8);
    ctx.lineTo(-s * 0.35,  s * 0.8);
    ctx.closePath();
    ctx.fill();
  }

  function init() {
    resize();
    const count = Math.min(45, Math.floor((W * H) / 20000));
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, W, H);
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
