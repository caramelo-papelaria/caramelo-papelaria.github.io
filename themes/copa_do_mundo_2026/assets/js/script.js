// ── Year in footer ──
const yearEl = document.querySelector(".year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Animated background: footballs & confetti (clima de Copa) ──
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const BG_TOP    = "#e6f7ec";
  const BG_BOTTOM = "#fffae0";

  // Verde, amarelo e azul da seleção brasileira
  const CONFETTI_COLORS = [
    "rgba(0,  156, 59,  0.75)",
    "rgba(255, 223, 0,   0.80)",
    "rgba(0,  39,  118, 0.70)",
    "rgba(46, 194, 126, 0.70)",
    "rgba(255, 240, 107, 0.75)",
    "rgba(30, 79,  196, 0.65)",
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
      this.rotSpeed  = (Math.random() - 0.5) * 0.04;
      this.alpha     = 0.45 + Math.random() * 0.45;
      this.color     = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      // Maioria confete, alguns bola de futebol e estrelas
      const types = ["confetti", "confetti", "confetti", "ball", "star"];
      this.type = types[Math.floor(Math.random() * types.length)];
      this.size = this.type === "ball"
        ? 9 + Math.random() * 9
        : 6 + Math.random() * 9;
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

      if (this.type === "ball") {
        drawBall(ctx, this.size);
      } else if (this.type === "star") {
        drawStar(ctx, this.size, this.color);
      } else {
        drawConfetti(ctx, this.size, this.color);
      }

      ctx.restore();
    }
  }

  // ── Bola de futebol ──
  function drawBall(ctx, s) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(13, 43, 22, 0.55)";
    ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pentágono central preto
    ctx.fillStyle = "rgba(13, 43, 22, 0.8)";
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = s * 0.42;
      i === 0
        ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
        : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ── Confete (retângulo) ──
  function drawConfetti(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.fillRect(-s * 0.5, -s * 0.3, s, s * 0.6);
  }

  // ── Estrela (5 pontas) ──
  function drawStar(ctx, s, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? s : s * 0.45;
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
    const count = Math.min(55, Math.floor((W * H) / 17000));
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
