/* ============================================================
   OUR LITTLE UNIVERSE — script.js
   ============================================================ */

// ── AOS INIT ─────────────────────────────────────────────────
AOS.init({ duration: 800, once: true, offset: 80 });

// ── TYPING EFFECT ────────────────────────────────────────────
const phrases = [
  "You are my favorite person. 💕",
  "Six months of pure magic. ✨",
  "My best decision was choosing you. ❤️",
  "Every day is better because of you. 🌸",
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const el = document.getElementById("typedText");
  if (!el) return;
  const current = phrases[phraseIndex];
  if (isDeleting) {
    el.textContent = current.slice(0, --charIndex);
  } else {
    el.textContent = current.slice(0, ++charIndex);
  }
  let delay = isDeleting ? 50 : 80;
  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(typeEffect, delay);
}
typeEffect();

// ── FLOATING HEARTS (LANDING) ────────────────────────────────
function createHeart() {
  const container = document.getElementById("heartsContainer");
  if (!container) return;
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  const emojis = ["❤️", "💕", "💗", "💖", "💝", "🌸", "✨", "💫"];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.left = Math.random() * 100 + "%";
  heart.style.fontSize = (Math.random() * 16 + 12) + "px";
  const dur = Math.random() * 8 + 7;
  heart.style.animationDuration = dur + "s";
  heart.style.animationDelay = Math.random() * 4 + "s";
  container.appendChild(heart);
  setTimeout(() => heart.remove(), (dur + 5) * 1000);
}
setInterval(createHeart, 700);
for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 200);

// ── STAR CURSOR TRAIL ─────────────────────────────────────────
document.addEventListener("mousemove", (e) => {
  const star = document.createElement("div");
  star.className = "cursor-star";
  const starEmojis = ["✨", "💫", "⭐", "🌟", "💕"];
  star.textContent = starEmojis[Math.floor(Math.random() * starEmojis.length)];
  star.style.left = e.clientX + "px";
  star.style.top  = e.clientY + "px";
  document.body.appendChild(star);
  setTimeout(() => star.remove(), 800);
});

// ── PARTICLE CANVAS ───────────────────────────────────────────
const canvas  = document.getElementById("particleCanvas");
const ctx     = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.r    = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.life = Math.random() * 200 + 100;
    this.age  = 0;
    const colors = ["#ffb6c1","#c084fc","#ffd6e8","#f9a8d4","#e879a0"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.age++;
    if (this.age >= this.life) this.reset();
  }
  draw() {
    const alpha = Math.sin((this.age / this.life) * Math.PI) * 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const MAX_PARTICLES = window.innerWidth < 768 ? 40 : 100;
for (let i = 0; i < MAX_PARTICLES; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ── SCROLL TO SECTION ─────────────────────────────────────────
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ── MUSIC CONTROLS ────────────────────────────────────────────
let isPlaying = false;
const audio   = document.getElementById("bgMusic");
const vinyl   = document.getElementById("vinyl");
const btn     = document.getElementById("musicBtn");
const fill    = document.getElementById("progressFill");

function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    vinyl.classList.remove("spinning");
    btn.textContent = "▶";
  } else {
    audio.play().catch(() => {});
    vinyl.classList.add("spinning");
    btn.textContent = "❚❚";
  }
  isPlaying = !isPlaying;
}

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  fill.style.width = pct + "%";
});

// ── PHOTO MODAL ───────────────────────────────────────────────
function openModal(polaroid) {
  const overlay  = document.getElementById("modalOverlay");
  const imgWrap  = document.getElementById("modalImgWrap");
  const caption  = document.getElementById("modalCaption");
  const srcImg   = polaroid.querySelector("img");
  const srcPlaceholder = polaroid.querySelector(".polaroid-img");
  const captionEl = polaroid.querySelector(".polaroid-caption");

  imgWrap.innerHTML = "";
  if (srcImg) {
    const img = document.createElement("img");
    img.src = srcImg.src;
    img.alt = "Memory";
    imgWrap.appendChild(img);
  } else if (srcPlaceholder) {
    const clone = srcPlaceholder.cloneNode(true);
    clone.style.width = "100%";
    clone.style.height = "100%";
    imgWrap.appendChild(clone);
  }

  caption.textContent = captionEl ? captionEl.textContent : "";
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── ENVELOPE / LOVE LETTER ────────────────────────────────────
const letterContent = `I still remember the exact moment I realized you were different. 
Not just different from others I'd known — different in a way that made the whole world 
feel a little softer and a lot more beautiful. 

Six months doesn't sound like a long time, but with you, every single day has felt like 
a little lifetime of its own. We've collected so many moments — the silly ones, the quiet ones, 
the ones and the ones where just being next to you was enough.

I just wanted you to know that I'm very proud of you for everything 
that you've been through. I know that life hasn't been easy at all to you. I mean, 
the stories that you tell me all the time, I can't even imagine.

Just, you're so strong.You are so strong. I am so grateful to have you in my life, and 
I am so grateful that you exist.I think I just want to tell you that you're going to be okay.
I know that it may not seem like it right now and I know that the world has been nothing but scary,
but I got you. You're going to be okay,baby. 

And anytime it doesn't feel like it will, you come back to this and you read to it and get that reassurance. 
But also let me know when things are okay for you, okay? I care about you. I want the updates.
Here's to 6 months, and to every beautiful moment still ahead of us.`;

let letterTyped = false;

function openEnvelope() {
  const envelope   = document.getElementById("envelope");
  const letterPaper = document.getElementById("letterPaper");
  if (envelope.classList.contains("opened")) return;

  envelope.classList.add("opened");
  setTimeout(() => {
    envelope.style.display = "none";
    letterPaper.style.display = "block";
    spawnLetterSparkles();
    if (!letterTyped) {
      typeLetterText();
      letterTyped = true;
    }
  }, 600);
}

function typeLetterText() {
  const el = document.getElementById("letterText");
  let i = 0;
  function tick() {
    el.textContent = letterContent.slice(0, ++i);
    if (i < letterContent.length) setTimeout(tick, 18);
  }
  tick();
}

function spawnLetterSparkles() {
  const container = document.getElementById("letterSparkles");
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("span");
    s.textContent = ["✨","💫","🌸","💕"][i % 4];
    s.style.cssText = `
      position: absolute;
      font-size: 18px;
      left: ${Math.random()*90}%;
      top: ${Math.random()*80}%;
      animation: letterSparkle 1.5s ${Math.random()*0.5}s ease forwards;
      pointer-events: none;
    `;
    container.appendChild(s);
  }

  if (!document.querySelector("#letterSparkleStyle")) {
    const style = document.createElement("style");
    style.id = "letterSparkleStyle";
    style.textContent = `
      @keyframes letterSparkle {
        0%   { opacity: 0; transform: scale(0) rotate(0deg); }
        50%  { opacity: 1; transform: scale(1.3) rotate(180deg); }
        100% { opacity: 0; transform: scale(0.5) rotate(360deg) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ── LOVE METER ────────────────────────────────────────────────
function runLoveMeter() {
  const fill = document.getElementById("meterFill");
  const pctEl = document.getElementById("meterPercent");
  const result = document.getElementById("meterResult");
  const value = 100; // Always 100% 💕

  fill.style.width = "0%";
  pctEl.textContent = "0%";
  result.textContent = "";

  let current = 0;
  const interval = setInterval(() => {
    current += 2;
    fill.style.width = current + "%";
    pctEl.textContent = current + "%";
    if (current >= value) {
      clearInterval(interval);
      result.textContent = "∞ Infinity% and beyond 💕";
    }
  }, 40);
}

// ── SCRATCH CARD ──────────────────────────────────────────────
let scratchCanvas, scratchCtx, scratchDrawing = false;

function initScratch() {
  scratchCanvas = document.getElementById("scratchCanvas");
  if (!scratchCanvas) return;
  scratchCtx = scratchCanvas.getContext("2d");

  // Fill with gradient "coating"
  const grad = scratchCtx.createLinearGradient(0, 0, 280, 160);
  grad.addColorStop(0, "#c084fc");
  grad.addColorStop(1, "#ffb6c1");
  scratchCtx.fillStyle = grad;
  scratchCtx.fillRect(0, 0, 280, 160);

  // Add text hint on the card
  scratchCtx.fillStyle = "rgba(255,255,255,0.6)";
  scratchCtx.font = "bold 16px Poppins, sans-serif";
  scratchCtx.textAlign = "center";
  scratchCtx.fillText("✦ Scratch Here ✦", 140, 88);

  scratchCtx.globalCompositeOperation = "destination-out";

  // Mouse events
  scratchCanvas.addEventListener("mousedown",  e => { scratchDrawing = true; scratch(e); });
  scratchCanvas.addEventListener("mousemove",  e => { if (scratchDrawing) scratch(e); });
  scratchCanvas.addEventListener("mouseup",    () => { scratchDrawing = false; });
  scratchCanvas.addEventListener("mouseleave", () => { scratchDrawing = false; });

  // Touch events
  scratchCanvas.addEventListener("touchstart", e => { e.preventDefault(); scratchDrawing = true; scratch(e.touches[0]); }, { passive: false });
  scratchCanvas.addEventListener("touchmove",  e => { e.preventDefault(); if (scratchDrawing) scratch(e.touches[0]); }, { passive: false });
  scratchCanvas.addEventListener("touchend",   () => { scratchDrawing = false; });
}

function scratch(e) {
  const rect = scratchCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  scratchCtx.beginPath();
  scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
  scratchCtx.fill();
}

function resetScratch() {
  if (!scratchCtx) { initScratch(); return; }
  scratchCtx.globalCompositeOperation = "source-over";
  const grad = scratchCtx.createLinearGradient(0, 0, 280, 160);
  grad.addColorStop(0, "#c084fc");
  grad.addColorStop(1, "#ffb6c1");
  scratchCtx.fillStyle = grad;
  scratchCtx.fillRect(0, 0, 280, 160);
  scratchCtx.fillStyle = "rgba(255,255,255,0.6)";
  scratchCtx.font = "bold 16px Poppins, sans-serif";
  scratchCtx.textAlign = "center";
  scratchCtx.fillText("✦ Scratch Here ✦", 140, 88);
  scratchCtx.globalCompositeOperation = "destination-out";
}

initScratch();

// ── COUNTDOWN TIMER ───────────────────────────────────────────
// Set your anniversary start date below (YYYY, MM-1, DD)
const anniversaryStart = new Date(2025, 11, 1); // Nov 27, 2024 → 6 months = May 27, 2025

function updateCountdown() {
  const now = new Date();
  const diff = now - anniversaryStart;

  const totalSecs = Math.floor(diff / 1000);
  const totalMins = Math.floor(totalSecs / 60);
  const totalHours = Math.floor(totalMins / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSecs % 60;
  const minutes = totalMins % 60;
  const hours   = totalHours % 24;
  const days    = totalDays;

  const fmt = n => String(n).padStart(2, "0");
  document.getElementById("cDays").textContent  = days;
  document.getElementById("cHours").textContent = fmt(hours);
  document.getElementById("cMins").textContent  = fmt(minutes);
  document.getElementById("cSecs").textContent  = fmt(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── STARRY BACKGROUND (Countdown Section) ────────────────────
function createStars() {
  const container = document.getElementById("starsBg");
  if (!container) return;
  for (let i = 0; i < 120; i++) {
    const s = document.createElement("div");
    s.className = "star-dot";
    s.style.left = Math.random() * 100 + "%";
    s.style.top  = Math.random() * 100 + "%";
    s.style.animationDuration  = (Math.random() * 4 + 2) + "s";
    s.style.animationDelay     = (Math.random() * 4) + "s";
    const size = Math.random() * 2 + 1;
    s.style.width  = size + "px";
    s.style.height = size + "px";
    container.appendChild(s);
  }
}
createStars();

// ── ENDING STARS ──────────────────────────────────────────────
function createEndingStars() {
  const container = document.getElementById("endingStars");
  if (!container) return;
  const starEmojis = ["⭐","🌟","✨","💫","🌸","💕"];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement("div");
    s.className = "ending-star";
    s.textContent = starEmojis[i % starEmojis.length];
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = (Math.random() * 12 + 10) + "s";
    s.style.animationDelay    = (Math.random() * 8) + "s";
    s.style.fontSize = (Math.random() * 12 + 10) + "px";
    container.appendChild(s);
  }
}
createEndingStars();

// ── CONFETTI ──────────────────────────────────────────────────
function launchConfetti() {
  const colors = ["#ffb6c1","#c084fc","#ffd6e8","#f9a8d4","#e879a0","#ffffff","#ffd700"];
  const total = 120;
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.left  = Math.random() * 100 + "vw";
      c.style.top   = "-20px";
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width  = (Math.random() * 10 + 6) + "px";
      c.style.height = (Math.random() * 14 + 8) + "px";
      c.style.animationDuration = (Math.random() * 2.5 + 1.5) + "s";
      c.style.transform = `rotate(${Math.random()*360}deg)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4500);
    }, i * 20);
  }
}

// ── POLAROID SPARKLE HOVER (additional JS sparkles) ──────────
document.querySelectorAll(".polaroid").forEach(p => {
  p.addEventListener("mouseenter", () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const s = document.createElement("div");
        s.style.cssText = `
          position: absolute;
          font-size: 14px;
          left: ${Math.random()*80+10}%;
          top:  ${Math.random()*80+10}%;
          pointer-events: none;
          z-index: 10;
          animation: popFade 0.7s ease forwards;
        `;
        s.textContent = ["✨","💕","🌸","💫"][i % 4];
        p.style.position = "relative";
        p.appendChild(s);
        setTimeout(() => s.remove(), 700);
      }, i * 80);
    }
  });
});

// Add popFade keyframe dynamically
const popStyle = document.createElement("style");
popStyle.textContent = `
  @keyframes popFade {
    0%   { opacity: 0; transform: scale(0) translateY(0); }
    50%  { opacity: 1; transform: scale(1.2) translateY(-8px); }
    100% { opacity: 0; transform: scale(0.6) translateY(-20px); }
  }
`;
document.head.appendChild(popStyle);

// ── INTERSECTION OBSERVER — animate sections on scroll ────────
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "none";
    }
  });
}, { threshold: 0.05 });

sections.forEach(s => {
  if (s.id !== "landing") {
    s.style.opacity = "0";
    s.style.transform = "translateY(20px)";
    s.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  }
  observer.observe(s);
});

// ── MOBILE: prevent cursor trail ─────────────────────────────
if ("ontouchstart" in window) {
  document.body.style.cursor = "auto";
}
