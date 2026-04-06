// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: falling snowflakes ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#e8f5e9";
  const BG_BOTTOM = "#e3f2fd";

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x        = Math.random() * W;
      this.y        = initial ? Math.random() * H : -20;
      this.speedY   = 0.4 + Math.random() * 0.8;
      this.speedX   = (Math.random() - 0.5) * 0.4;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd= 0.008 + Math.random() * 0.012;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.01;
      this.alpha    = 0.5 + Math.random() * 0.4;
      const types   = ["snowflake", "snowflake", "snowflake", "star", "gift"];
      this.type     = types[Math.floor(Math.random() * types.length)];
      this.size     = this.type === "gift" ? 10 + Math.random() * 8 : 8 + Math.random() * 14;
    }

    update() {
      this.wobble   += this.wobbleSpd;
      this.rotation += this.rotSpeed;
      this.x        += this.speedX + Math.sin(this.wobble) * 0.5;
      this.y        += this.speedY;
      if (this.y > H + 30) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      switch (this.type) {
        case "snowflake": drawSnowflake(ctx, this.size); break;
        case "star":      drawStar(ctx, this.size * 0.5); break;
        case "gift":      drawGift(ctx, this.size); break;
      }

      ctx.restore();
    }
  }

  function drawSnowflake(ctx, s) {
    ctx.strokeStyle = "rgba(200,230,255,0.9)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i * Math.PI) / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s);
      // Side branches
      ctx.moveTo(0, -s * 0.5);
      ctx.lineTo(-s * 0.25, -s * 0.75);
      ctx.moveTo(0, -s * 0.5);
      ctx.lineTo( s * 0.25, -s * 0.75);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawStar(ctx, s) {
    ctx.fillStyle = "rgba(249,168,37,0.75)";
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

  function drawGift(ctx, s) {
    // Box
    ctx.fillStyle = "rgba(198,40,40,0.65)";
    ctx.fillRect(-s * 0.6, -s * 0.4, s * 1.2, s * 0.9);
    // Ribbon vertical
    ctx.fillStyle = "rgba(249,168,37,0.8)";
    ctx.fillRect(-s * 0.1, -s * 0.4, s * 0.2, s * 0.9);
    // Ribbon horizontal
    ctx.fillRect(-s * 0.6, -s * 0.1, s * 1.2, s * 0.2);
    // Bow
    ctx.fillStyle = "rgba(249,168,37,0.8)";
    ctx.beginPath();
    ctx.ellipse(-s * 0.3, -s * 0.45, s * 0.25, s * 0.15, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse( s * 0.3, -s * 0.45, s * 0.25, s * 0.15,  0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  function init() {
    resize();
    const count = Math.min(55, Math.floor((W * H) / 17000));
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
