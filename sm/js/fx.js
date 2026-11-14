// 팡팡 연출 — 원장 2026-11-12 「5세용이니까 친절하면서 그래픽이 팡팡 터져야 돼」.
//  · 효과음은 필즈 게임 공용(createSound)을 그대로 쓰고, 5세용 소리(뿅·딩동·빵빠레)를 더한다.
//  · 화면 전체 캔버스 한 장에 색종이·별·동그라미 조각을 쏜다. 움직임 줄이기 설정이면 도장만 잠깐 보인다.
import { createSound, reduced } from "../../fields-classic/question-bank/golden-bell-game-fx.js?v=20261004a";

export { reduced };
const base = createSound();
let ctx = null;
function tone(freq, at, len, type = "triangle", gain = 0.12, slide = 0) {
  if (!base.on) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const t0 = ctx.currentTime + at, osc = ctx.createOscillator(), amp = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(freq * slide, t0 + len);
    amp.gain.setValueAtTime(0.0001, t0); amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012); amp.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    osc.connect(amp).connect(ctx.destination); osc.start(t0); osc.stop(t0 + len + 0.03);
  } catch { /* 소리가 안 나도 계속 */ }
}
export const sound = {
  get on() { return base.on; },
  toggle: () => base.toggle(),
  tap: () => tone(880, 0, 0.09, "sine", 0.1, 1.5),                       // 뿅
  pop: () => { tone(520, 0, 0.12, "triangle", 0.12, 2.2); tone(1040, 0.05, 0.1, "sine", 0.06); },
  drop: () => { tone(300, 0, 0.16, "triangle", 0.13, 0.6); tone(180, 0.06, 0.18, "sine", 0.08); },   // 접시에 쿵
  good: () => base.good(),
  bad: () => { tone(330, 0, 0.18, "triangle", 0.09, 0.8); tone(262, 0.14, 0.24, "triangle", 0.08, 0.8); },   // 아쉬워요(부드럽게)
  fanfare: () => [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.1, 0.3, "triangle", 0.11)),
  level: () => { tone(660, 0, 0.5, "sine", 0.1); tone(990, 0.08, 0.5, "sine", 0.07); }                  // 수평(맑은 소리)
};

// ── 조각 쏘기 ─────────────────────────────────────────
const COLORS = ["#ff5d8f", "#ffc93c", "#2f7de1", "#19b26b", "#8f63e6", "#ff7a59", "#35c6e8"];
let canvas = null, g = null, parts = [], raf = 0, W = 0, H = 0;
function ensureCanvas() {
  if (canvas?.isConnected) return;
  canvas = document.createElement("canvas");
  canvas.className = "sm-fx"; canvas.setAttribute("aria-hidden", "true");
  document.body.append(canvas);
  g = canvas.getContext("2d");
  resize();
  addEventListener("resize", resize);
}
function resize() {
  if (!canvas) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function star(c, r) {
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath(); c.fill();
}
function step() {
  g.clearRect(0, 0, W, H);
  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.vy += p.grav; p.vx *= p.drag; p.vy *= p.drag; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 1;
    const fade = Math.min(1, p.life / 25);
    g.save(); g.globalAlpha = fade; g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.color;
    if (p.kind === "star") star(g, p.size);
    else if (p.kind === "dot") { g.beginPath(); g.arc(0, 0, p.size, 0, Math.PI * 2); g.fill(); }
    else if (p.kind === "ring") { g.strokeStyle = p.color; g.lineWidth = 6 * fade; g.beginPath(); g.arc(0, 0, p.size * (1 + (60 - p.life) / 14), 0, Math.PI * 2); g.stroke(); }
    else g.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    g.restore();
  }
  raf = parts.length ? requestAnimationFrame(step) : 0;
  if (!raf) g.clearRect(0, 0, W, H);
}
function launch() { if (!raf) raf = requestAnimationFrame(step); }

// x,y: 화면 좌표(없으면 가운데). power: 1 보통, 2 크게
export function burst(x = innerWidth / 2, y = innerHeight * 0.45, { power = 1, kinds = ["star", "paper", "dot"] } = {}) {
  if (reduced()) return;
  ensureCanvas();
  const n = Math.round(46 * power);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (4 + Math.random() * 9) * (0.7 + power * 0.35);
    const kind = kinds[i % kinds.length];
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3.5, grav: 0.24, drag: 0.985, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
      size: kind === "star" ? 9 + Math.random() * 10 : kind === "dot" ? 4 + Math.random() * 5 : 12 + Math.random() * 10, color: COLORS[i % COLORS.length], kind, life: 70 + Math.random() * 40 });
  }
  parts.push({ x, y, vx: 0, vy: 0, grav: 0, drag: 1, rot: 0, vr: 0, size: 26, color: "#ffd23f", kind: "ring", life: 60 });
  launch();
}
// 하늘에서 쏟아지는 색종이(완료 때)
export function rain(seconds = 2.2) {
  if (reduced()) return;
  ensureCanvas();
  const n = Math.round(110 * seconds / 2);
  for (let i = 0; i < n; i++) {
    parts.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, grav: 0.05, drag: 0.995, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.25,
      size: 12 + Math.random() * 12, color: COLORS[i % COLORS.length], kind: i % 4 ? "paper" : "star", life: 160 + Math.random() * 80 });
  }
  launch();
}
// 요소 위치에서 터뜨리기
export function burstAt(el, opts) {
  const r = el?.getBoundingClientRect?.();
  if (!r) return burst(undefined, undefined, opts);
  burst(r.left + r.width / 2, r.top + r.height / 2, opts);
}
// 큰 도장 글씨(「참 잘했어요!」)
export function stamp(text, { kind = "" } = {}) {
  document.querySelectorAll(".sm-stamp").forEach((n) => n.remove());
  const el = document.createElement("div");
  el.className = `sm-stamp ${kind}`.trim(); el.textContent = text; el.setAttribute("aria-hidden", "true");
  document.body.append(el);
  setTimeout(() => el.remove(), 1600);
}
export function shake(el) {
  if (!el || reduced()) return;
  el.classList.remove("sm-shake"); void el.offsetWidth; el.classList.add("sm-shake");
}
// 정답 한 번: 소리 + 그 자리 팡 + 도장
const PRAISE = ["참 잘했어요!", "맞았어요!", "최고예요!", "멋져요!", "와, 대단해요!"];
export function cheer(el, { big = false } = {}) {
  sound.good();
  if (el) burstAt(el, { power: big ? 2 : 1.2 }); else burst(undefined, undefined, { power: big ? 2 : 1.2 });
  if (big) setTimeout(() => burst(innerWidth * 0.2, innerHeight * 0.35, { power: 1 }), 220), setTimeout(() => burst(innerWidth * 0.8, innerHeight * 0.35, { power: 1 }), 380);
  stamp(PRAISE[Math.floor(Math.random() * PRAISE.length)]);
}
export const praiseWord = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
