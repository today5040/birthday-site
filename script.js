const text =
  "晓燕，生日快乐。12年朝夕相处，我越来越确定：你就是我这一生最美好的答案。未来每一年、每个生日、每个平凡日子，我都想牵着你的手一起过。——爱你的胡晓凯";

const typingEl = document.getElementById("typing");
const replayBtn = document.getElementById("replayBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const lineSwitcher = document.getElementById("lineSwitcher");

let timer = null;

function runTyping() {
  if (!typingEl) return;
  typingEl.textContent = "";
  let i = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    typingEl.textContent += text[i];
    i += 1;
    if (i >= text.length) clearInterval(timer);
  }, 66);
}

replayBtn?.addEventListener("click", runTyping);
runTyping();

const lines = [
  "你是我最骄傲的“遇见”，也是我最踏实的“以后”。",
  "谢谢你把青春和温柔，都给了这个家。",
  "我会一直偏爱你，像今天这样，也像往后每一天。"
];

let lineIndex = 0;
function playLines() {
  if (!lineSwitcher) return;
  lineSwitcher.style.opacity = "0";
  setTimeout(() => {
    lineSwitcher.textContent = lines[lineIndex];
    lineSwitcher.style.opacity = "1";
    lineIndex = (lineIndex + 1) % lines.length;
  }, 240);
}

playLines();
setInterval(playLines, 3600);

const canvas = document.getElementById("hearts");
const ctx = canvas?.getContext("2d");
const hearts = [];

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnHeart() {
  if (!canvas) return;
  hearts.push({
    x: Math.random() * canvas.width,
    y: canvas.height + 20,
    size: 10 + Math.random() * 16,
    speed: 0.6 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.8,
    alpha: 0.45 + Math.random() * 0.35
  });
}

function burstHearts() {
  if (!canvas) return;
  const centerX = canvas.width / 2;
  const centerY = canvas.height * 0.65;
  for (let i = 0; i < 36; i += 1) {
    const angle = (Math.PI * 2 * i) / 36;
    hearts.push({
      x: centerX + Math.cos(angle) * (20 + Math.random() * 15),
      y: centerY + Math.sin(angle) * (20 + Math.random() * 12),
      size: 9 + Math.random() * 12,
      speed: 0.8 + Math.random() * 1.2,
      drift: Math.cos(angle) * (1.6 + Math.random() * 1.2),
      alpha: 0.75
    });
  }
}

function drawHeart(x, y, s, a) {
  if (!ctx) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 16, s / 16);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 0, -10, 0, -10, 6);
  ctx.bezierCurveTo(-10, 12, 0, 16, 0, 16);
  ctx.bezierCurveTo(0, 16, 10, 12, 10, 6);
  ctx.bezierCurveTo(10, 0, 0, 0, 0, 6);
  ctx.closePath();
  ctx.fillStyle = `rgba(255, 138, 188, ${a})`;
  ctx.fill();
  ctx.restore();
}

function animate() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Math.random() < 0.33) spawnHeart();
  for (let i = hearts.length - 1; i >= 0; i -= 1) {
    const h = hearts[i];
    h.y -= h.speed;
    h.x += h.drift;
    h.alpha -= 0.0018;
    drawHeart(h.x, h.y, h.size, h.alpha);
    if (h.y < -30 || h.alpha <= 0) hearts.splice(i, 1);
  }
  requestAnimationFrame(animate);
}

surpriseBtn?.addEventListener("click", burstHearts);

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.18 }
);
reveals.forEach((el) => observer.observe(el));

resize();
window.addEventListener("resize", resize);
animate();
