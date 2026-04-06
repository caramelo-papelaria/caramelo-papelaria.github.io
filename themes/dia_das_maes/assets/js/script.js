// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: falling rose petals & flowers ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fff0f5";
  const BG_BOTTOM = "#f8e8f8";

  const PETAL_COLORS = [
    "rgba(244,143,177,0.7)",
    "rgba(206,147,216,0.65)",
    "rgba(233,30,140,0.5)",
    "rgba(248,187,217,0.7)",
    "rgba(249,200,74,0.6)",
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
      this.y        = initial ? Math.random() * H : -30;
      this.speedY   = 0.5 + Math.random() * 0.8;
      this.speedX   = (Math.random() - 0.5) * 0.5;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd= 0.01 + Math.random() * 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.alpha    = 0.5 + Math.random() * 0.4;
      this.color    = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const types   = ["petal", "petal", "petal", "flower", "heart"];
      this.type     = types[Math.floor(Math.random() * types.length)];
      this.size     = 8 + Math.random() * 14;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.6;
      this.y        += this.speedY;
      if (this.y > H + 40) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      switch (this.type) {
        case "petal":  drawPetal(ctx, this.size, this.color); break;
        case "flower": drawFlower(ctx, this.size, this.color); break;
        case "heart":  drawHeart(ctx, this.size * 0.6, this.color); break;
      }

      ctx.restore();
    }
  }

  function drawPetal(ctx, s, color) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.45, s, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawFlower(ctx, s, color) {
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.5, s * 0.3, s * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(249,200,74,0.8)";
    ctx.fill();
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
