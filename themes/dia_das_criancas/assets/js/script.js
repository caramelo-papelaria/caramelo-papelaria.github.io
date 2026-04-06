// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: balloons, confetti and stars rising ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#fffde7";
  const BG_BOTTOM = "#fff8e1";

  const COLORS = [
    "rgba(253,216,53,0.75)",
    "rgba(251,140,0,0.7)",
    "rgba(67,160,71,0.65)",
    "rgba(30,136,229,0.65)",
    "rgba(233,30,140,0.65)",
    "rgba(142,36,170,0.6)",
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
      this.y        = initial ? Math.random() * H : H + 60;
      this.speedY   = 0.5 + Math.random() * 0.8;
      this.speedX   = (Math.random() - 0.5) * 0.5;
      this.wobble   = Math.random() * Math.PI * 2;
      this.wobbleSpd= 0.01 + Math.random() * 0.015;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.alpha    = 0.5 + Math.random() * 0.4;
      this.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
      const types   = ["balloon", "confetti", "star", "balloon", "confetti"];
      this.type     = types[Math.floor(Math.random() * types.length)];
      this.size     = this.type === "balloon" ? 14 + Math.random() * 12 : 6 + Math.random() * 10;
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

      switch (this.type) {
        case "balloon":  drawBalloon(ctx, this.size, this.color); break;
        case "confetti": drawConfetti(ctx, this.size, this.color); break;
        case "star":     drawStar(ctx, this.size * 0.5, this.color); break;
      }

      ctx.restore();
    }
  }

  function drawBalloon(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, -s * 0.3, s * 0.55, s, 0, 0, Math.PI * 2);
    ctx.fill();
    // Knot
    ctx.beginPath();
    ctx.arc(0, s * 0.75, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    // String
    ctx.strokeStyle = "rgba(80,40,20,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.87);
    ctx.lineTo(0, s * 1.8);
    ctx.stroke();
  }

  function drawConfetti(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-s * 0.5, -s * 0.2, s, s * 0.4);
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

  function init() {
    resize();
    const count = Math.min(55, Math.floor((W * H) / 16000));
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
