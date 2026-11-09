const typingEl = document.getElementById("typing");
const replayBtn = document.getElementById("replayBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const lineSwitcher = document.getElementById("lineSwitcher");
const durationClock = document.getElementById("durationClock");
const weddingClock = document.getElementById("weddingClock");
const metYearsEl = document.getElementById("metYears");
const weddingYearsEl = document.getElementById("weddingYears");

const metDate = new Date(2011, 11, 20, 0, 0, 0);
const marriageDate = new Date(2014, 9, 10, 0, 0, 0);

let timer = null;
let text =
  "老婆，生日快乐！人生很长，幸好有你。爱你，不止今天，也在往后的每一天。——胡晓凯";

function getFullYears(startDate, now) {
  let years = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();
  const dayDiff = now.getDate() - startDate.getDate();
  const hourDiff = now.getHours() - startDate.getHours();
  const minuteDiff = now.getMinutes() - startDate.getMinutes();
  const secondDiff = now.getSeconds() - startDate.getSeconds();

  const passedAnniversary =
    monthDiff > 0 ||
    (monthDiff === 0 &&
      (dayDiff > 0 ||
        (dayDiff === 0 &&
          (hourDiff > 0 ||
            (hourDiff === 0 &&
              (minuteDiff > 0 || (minuteDiff === 0 && secondDiff >= 0)))))));

  if (!passedAnniversary) years -= 1;
  return Math.max(0, years);
}

function formatDuration(startDate, now) {
  const diffMs = now.getTime() - startDate.getTime();
  if (diffMs <= 0) {
    return "0 天 00 时 00 分 00 秒";
  }
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} 天 ${pad(hours)} 时 ${pad(minutes)} 分 ${pad(seconds)} 秒`;
}

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

const lines = [
  "人生很长，幸好有你。",
  "最珍贵的，是一起走过的寻常岁月。",
  "春有花开，夏有清风，秋有明月，冬有暖阳。",
  "前半生有幸与你相遇，往后余生，只愿一路有你",
  "走过四季，走过岁月，走到白发苍苍，身边依然是你",
  "愿岁岁年年，你有欢喜，我有陪伴。",
  "爱你，不止今天，也在往后的每一天。",
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

function pad(num) {
  return String(num).padStart(2, "0");
}

function updateDurationClock() {
  const now = new Date();
  const metYears = getFullYears(metDate, now);
  const weddingYears = getFullYears(marriageDate, now);

  if (metYearsEl) metYearsEl.textContent = String(metYears);
  if (weddingYearsEl) weddingYearsEl.textContent = String(weddingYears);
  if (durationClock) durationClock.textContent = formatDuration(metDate, now);
  if (weddingClock) weddingClock.textContent = formatDuration(marriageDate, now);

  text =
    `老婆，生日快乐！从2011年冬天初见，到2014年10月10日领证，再到2015年的婚礼，今天我们已相识${metYears}年、结婚${weddingYears}年。` +
    "爱你，不止今天，也在往后的每一天。——胡晓凯";
}

updateDurationClock();
runTyping();
setInterval(updateDurationClock, 1000);

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
    alpha: 0.45 + Math.random() * 0.35,
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
      alpha: 0.75,
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
  { threshold: 0.18 },
);
reveals.forEach((el) => observer.observe(el));

resize();
window.addEventListener("resize", resize);
animate();
