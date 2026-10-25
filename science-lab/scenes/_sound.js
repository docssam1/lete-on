// 곤충 소리 — 파일 없이 Web Audio로 합성한다(원장 2026-10-25 「소리도 나도록, 곤충은」).
// 소리는 「어디를 비벼서 나는가」를 보여 주는 데 쓴다. 실제 녹음을 흉내 낸 것이지 그 종의 정확한 소리는 아니라고 화면에 적는다.
//   cricket  — 귀뚜라미: 앞날개를 비벼 내는 맑은 고음(약 4 kHz), 짧은 울림 3~4번이 한 묶음, 묶음이 초당 2번쯤
//   stripe   — 메뚜기: 뒷다리 넓적다리를 앞날개에 비벼 내는 거친 「찌르르」(잡음을 좁게 걸러 낸 것), 짧게 반복
//   longhead — 방아깨비: 날 때 날개로 내는 「따다다닥」(짧은 딸깍 잡음 여러 번)
// 브라우저는 사용자가 누른 뒤에만 소리를 허용하므로 단추 안에서만 부른다.
let ctx = null, master = null, current = null;
const ac = () => { if (!ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination); } if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx; };
function noiseBuffer(c, sec = 1) { const b = c.createBuffer(1, Math.ceil(c.sampleRate * sec), c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; }
// 묶음(chirp) 하나: 짧은 울림 n번
function cricketChirp(c, out, t0, n = 3) {
  for (let k = 0; k < n; k++) {
    const t = t0 + k * 0.055, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(4300, t); o.frequency.linearRampToValueAtTime(4450, t + 0.03);
    o2.type = 'sine'; o2.frequency.value = 8600; const g2 = c.createGain(); g2.gain.value = 0.12; o2.connect(g2); g2.connect(g);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.35, t + 0.006); g.gain.setValueAtTime(0.35, t + 0.028); g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.05); o2.start(t); o2.stop(t + 0.05);
  }
}
function play(kind, dur = 3.5) {
  const c = ac(); if (!c) return null; stop();
  const out = c.createGain(); out.connect(master); const t0 = c.currentTime + 0.05, nodes = [];
  if (kind === 'cricket') { for (let t = t0; t < t0 + dur; t += 0.42 + Math.random() * 0.08) cricketChirp(c, out, t, 3 + (Math.random() < 0.4 ? 1 : 0)); }
  else if (kind === 'stripe') {
    const src = c.createBufferSource(); src.buffer = noiseBuffer(c, dur + 0.5); src.loop = true; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 6500; bp.Q.value = 2.2; const g = c.createGain(); g.gain.value = 0;
    src.connect(bp); bp.connect(g); g.connect(out); src.start(t0); nodes.push(src);
    for (let t = t0; t < t0 + dur; t += 0.75) for (let k = 0; k < 14; k++) { const u = t + k * 0.028; g.gain.setValueAtTime(0.0, u); g.gain.linearRampToValueAtTime(0.5, u + 0.006); g.gain.linearRampToValueAtTime(0.0, u + 0.02); }   // 비빌 때 톱니마다 한 번씩
    src.stop(t0 + dur + 0.1);
  } else if (kind === 'longhead') {
    const src = c.createBufferSource(); src.buffer = noiseBuffer(c, dur + 0.5); src.loop = true; const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500; const g = c.createGain(); g.gain.value = 0;
    src.connect(hp); hp.connect(g); g.connect(out); src.start(t0); nodes.push(src);
    for (let t = t0 + 0.2; t < t0 + dur - 0.3; t += 0.9) for (let k = 0; k < 9; k++) { const u = t + k * 0.045; g.gain.setValueAtTime(0, u); g.gain.linearRampToValueAtTime(0.7, u + 0.003); g.gain.exponentialRampToValueAtTime(0.001, u + 0.03); }
    src.stop(t0 + dur + 0.1);
  } else return null;
  current = { out, nodes, kind, until: t0 + dur }; if (typeof window !== 'undefined') window.__obSound = { playing: kind, until: current.until };
  return current;
}
function stop() { if (!current || !ctx) return; try { current.out.gain.setTargetAtTime(0, ctx.currentTime, 0.03); current.nodes.forEach((n) => { try { n.stop(ctx.currentTime + 0.1); } catch { /* 이미 끝남 */ } }); } catch { /* */ } current = null; if (typeof window !== 'undefined') window.__obSound = null; }
export const insectSound = { play, stop, available: () => !!(window.AudioContext || window.webkitAudioContext) };
