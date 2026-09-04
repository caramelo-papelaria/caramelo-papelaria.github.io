// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: yellow ribbons, hearts & sparkles ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fff7e0";
  const BG_BOTTOM = "#fdeecb";

  const COLORS = [
    "rgba(255, 207, 51,  0.72)", // amarelo
    "rgba(242, 167, 27,  0.66)", // dourado
    "rgba(232, 156, 43,  0.60)", // caramelo
    "rgba(127, 191, 90,  0.50)", // verde marca (toque)
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
      this.speedY    = 0.35 + Math.random() * 0.6;
      this.speedX    = (Math.random() - 0.5) * 0.45;
      this.wobble    = Math.random() * Math.PI * 2;
      this.wobbleSpd = 0.007 + Math.random() * 0.012;
      this.rotation  = (Math.random() - 0.5) * 0.5;
      this.rotSpeed  = (Math.random() - 0.5) * 0.012;
      this.alpha     = 0.5 + Math.random() * 0.4;
      this.color     = COLORS[Math.floor(Math.random() * COLORS.length)];

      const types = ["ribbon", "ribbon", "heart", "sparkle"];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.size = this.type === "sparkle"
        ? 5 + Math.random() * 6
        : 11 + Math.random() * 13;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.55;
      this.y        -= this.speedY;
      if (this.y < -60) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === "ribbon")     drawRibbon(ctx, this.size, this.color);
      else if (this.type === "heart") drawHeart(ctx, this.size, this.color);
      else                            drawSparkle(ctx, this.size, this.color);

      ctx.restore();
    }
  }

  // ── Ribbon (laço amarelo — símbolo da campanha) ──
  function drawRibbon(ctx, s, color) {
    const w = s * 0.6;
    const h = s * 0.95;
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.6, s * 0.17);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // strand 1: apex → left loop → cross → right tail
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.55);
    ctx.bezierCurveTo(-w, -h * 0.5, -w, h * 0.1, 0, h * 0.12);
    ctx.lineTo(w * 0.45, h * 0.6);
    ctx.stroke();

    // strand 2: apex → right loop → cross → left tail
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.55);
    ctx.bezierCurveTo(w, -h * 0.5, w, h * 0.1, 0, h * 0.12);
    ctx.lineTo(-w * 0.45, h * 0.6);
    ctx.stroke();
  }

  // ── Heart ──
  function drawHeart(ctx, s, color) {
    const r = s * 0.5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.55);
    ctx.bezierCurveTo(r * 1.1, -r * 0.4, r * 0.55, -r * 1.25, 0, -r * 0.5);
    ctx.bezierCurveTo(-r * 0.55, -r * 1.25, -r * 1.1, -r * 0.4, 0, r * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  // ── Sparkle (brilho / luz) ──
  function drawSparkle(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const rad = i % 2 === 0 ? s : s * 0.32;
      i === 0
        ? ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad)
        : ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ── Init & loop ──
  function init() {
    resize();
    const count = Math.min(46, Math.floor((W * H) / 20000));
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
