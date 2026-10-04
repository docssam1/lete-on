// FC 게임 공용 효과: 효과음(끌 수 있음)과 색종이. 소리가 안 나거나 저장이 막혀도 게임은 계속된다.
export const SOUND_KEY = "fc-clock-game-sound";
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
export const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createSound() {
  let ctx = null;
  let on = true;
  try { on = localStorage.getItem(SOUND_KEY) !== "off"; } catch { on = true; }
  const tone = (freq, at, length, type = "sine", gain = 0.12) => {
    const osc = ctx.createOscillator(), amp = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime + at);
    amp.gain.setValueAtTime(0.0001, ctx.currentTime + at);
    amp.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + at + 0.01);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + length);
    osc.connect(amp).connect(ctx.destination);
    osc.start(ctx.currentTime + at); osc.stop(ctx.currentTime + at + length + 0.02);
  };
  const play = (fn) => {
    if (!on) return;
    try {
      ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      fn();
    } catch { /* 소리가 안 나도 게임은 계속된다 */ }
  };
  return {
    get on() { return on; },
    toggle() { on = !on; try { localStorage.setItem(SOUND_KEY, on ? "on" : "off"); } catch { /* 저장 못 해도 이번 판은 반영 */ } return on; },
    tick: () => play(() => tone(1500, 0, 0.04, "square", 0.035)),
    good: () => play(() => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.22, "triangle", 0.11))),
    bad: () => play(() => { tone(220, 0, 0.18, "sawtooth", 0.05); tone(185, 0.12, 0.22, "sawtooth", 0.05); }),
    stage: () => play(() => [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.26, "triangle", 0.1))),
    dispose() { try { ctx?.close(); } catch { /* 이미 닫힘 */ } }
  };
}

export function confetti(canvas, origin) {
  if (reduced()) return () => {};
  const box = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = box.width * dpr; canvas.height = box.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ["#ffc53d", "#2f7de1", "#e2504c", "#2fb36b", "#f08a24", "#9b6bdf"];
  const x0 = origin.x - box.left, y0 = origin.y - box.top;
  const parts = Array.from({ length: 70 }, (_, i) => {
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 6;
    return { x: x0 + Math.cos(a) * origin.r * 0.4, y: y0 + Math.sin(a) * origin.r * 0.4, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length], w: 6 + Math.random() * 6, h: 4 + Math.random() * 4 };
  });
  let raf = 0, frames = 0;
  const step = () => {
    ctx.clearRect(0, 0, box.width, box.height);
    for (const p of parts) {
      p.vy += 0.22; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
    }
    if (++frames < 90 && canvas.isConnected) raf = requestAnimationFrame(step);
    else ctx.clearRect(0, 0, box.width, box.height);
  };
  raf = requestAnimationFrame(step);
  return () => { cancelAnimationFrame(raf); ctx.clearRect(0, 0, box.width, box.height); };
}
