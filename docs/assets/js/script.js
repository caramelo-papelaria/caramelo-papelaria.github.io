// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: floating hearts & sparkles ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fff8f9";
  const BG_BOTTOM = "#fde4ec";

  const HEART_COLORS = [
    "rgba(232, 49,  90,  0.65)",
    "rgba(255,107, 138, 0.60)",
    "rgba(255,179, 198, 0.70)",
    "rgba(245,200,  66, 0.65)",
    "rgba(253,233, 138, 0.60)",
    "rgba(255,208, 220, 0.75)",
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
      this.speedY   = 0.4 + Math.random() * 0.7;
      this.speedX   = (Math.random() - 0.5) * 0.5;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd = 0.008 + Math.random() * 0.014;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.025;
      this.alpha    = 0.45 + Math.random() * 0.45;
      this.color    = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];

      const types = ["heart", "heart", "heart", "heart", "sparkle"];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.size = this.type === "sparkle"
        ? 6 + Math.random() * 8
        : 10 + Math.random() * 18;
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

      if (this.type === "heart") {
        drawHeart(ctx, this.size, this.color);
      } else {
        drawSparkle(ctx, this.size, this.color);
      }

      ctx.restore();
    }
  }

  // ── Heart ──
  function drawHeart(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, s * 0.05, -s * 0.5, s * 0.05, -s * 0.5, s * 0.38);
    ctx.bezierCurveTo(-s * 0.5, s * 0.7, 0, s * 0.95, 0, s * 1.05);
    ctx.bezierCurveTo(0, s * 0.95, s * 0.5, s * 0.7, s * 0.5, s * 0.38);
    ctx.bezierCurveTo(s * 0.5, s * 0.05, 0, s * 0.05, 0, s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  // ── Sparkle (4-point star) ──
  function drawSparkle(ctx, s, color) {
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
