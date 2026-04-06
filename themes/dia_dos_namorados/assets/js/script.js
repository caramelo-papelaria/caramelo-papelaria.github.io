// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: floating hearts ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fff5f5";
  const BG_BOTTOM = "#fce4ec";

  const HEART_COLORS = [
    "rgba(229,57,53,0.65)",
    "rgba(240,98,146,0.6)",
    "rgba(253,216,53,0.55)",
    "rgba(248,187,208,0.7)",
    "rgba(239,154,154,0.6)",
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
      this.speedX   = (Math.random() - 0.5) * 0.4;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd= 0.008 + Math.random() * 0.012;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.alpha    = 0.45 + Math.random() * 0.45;
      this.color    = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      this.size     = 8 + Math.random() * 18;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.5;
      this.y        -= this.speedY;
      if (this.y < -50) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      drawHeart(ctx, this.size, this.color);
      ctx.restore();
    }
  }

  function drawHeart(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s, -s * 0.3, -s, -s, 0, -s * 0.3);
    ctx.bezierCurveTo(s, -s, s, -s * 0.3, 0, s * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  function init() {
    resize();
    const count = Math.min(50, Math.floor((W * H) / 18000));
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
