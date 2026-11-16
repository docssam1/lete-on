/* ============================================================
   Numbers of Magic — 펜 숫자 읽기 (app/pen-digits.js, 2026-11-16)
   원장 「태블릿에서 펜으로 풀고 바로 채점」 → 「주간 학습지 그대로」.

   펜으로 쓴 획(점 목록)을 받아 수를 읽는다. 전부 이 기기 안에서 계산하고 아무 데도 보내지 않는다.
     획 묶기   : 가로로 겹치는 획을 한 글자로(4·5·7처럼 두 번 긋는 숫자), 아주 작은 점은 버림,
                 맨 앞의 납작한 획은 빼기 부호(−).
     글자 그림 : 한 글자를 28×28 칸에 MNIST와 같은 꼴로 그린다(긴 쪽 20칸에 맞춤 → 무게중심을 가운데로).
                 그림은 캔버스 없이 직접 계산한다 — 브라우저마다 그리기가 달라지지 않게, 검사기(Node)와 같게.
     판별      : app/pen-digits-model.js 의 작은 합성곱 신경망(8비트). 가장 높은 확률과 그 값을 같이 돌려준다.
   읽은 값이 정답과 달라도 바로 틀렸다고 하지 않는다 — 학습지 화면(app/pen-sheet.js)이 「○○로 읽었어요」를
   보여 주고 아이가 고칠 수 있게 한다. 확률이 낮으면 「다시 읽기」로 묻는다.
   ============================================================ */
(function(root){
'use strict';
let W = null;
function weights(){
  if(W) return W;
  const m = root.NM_PEN_DIGIT_MODEL;
  if(!m) throw new Error('pen_digit_model_missing');
  const bin = atob(m.b64), bytes = new Int8Array(bin.length);
  for(let i = 0; i < bin.length; i++) bytes[i] = (bin.charCodeAt(i) << 24) >> 24;
  W = {};
  m.meta.forEach(e => {
    const n = e.shape.reduce((a, b) => a * b, 1), f = new Float32Array(n);
    for(let i = 0; i < n; i++) f[i] = bytes[e.off + i] * e.scale;
    W[e.k] = f;
  });
  return W;
}
/* 합성곱(같은 크기, 0 채움) + ReLU */
function conv(inp, C, H, Wd, w, b, O, K){
  const pad = (K - 1) >> 1, out = new Float32Array(O * H * Wd);
  for(let o = 0; o < O; o++){
    for(let y = 0; y < H; y++) for(let x = 0; x < Wd; x++){
      let s = b[o];
      for(let c = 0; c < C; c++){
        const wb = ((o * C + c) * K) * K, ib = c * H * Wd;
        for(let ky = 0; ky < K; ky++){
          const iy = y + ky - pad; if(iy < 0 || iy >= H) continue;
          for(let kx = 0; kx < K; kx++){
            const ix = x + kx - pad; if(ix < 0 || ix >= Wd) continue;
            s += inp[ib + iy * Wd + ix] * w[wb + ky * K + kx];
          }
        }
      }
      out[(o * H + y) * Wd + x] = s > 0 ? s : 0;
    }
  }
  return out;
}
function pool(inp, C, H, Wd){
  const h = H >> 1, w = Wd >> 1, out = new Float32Array(C * h * w);
  for(let c = 0; c < C; c++) for(let y = 0; y < h; y++) for(let x = 0; x < w; x++){
    const i = c * H * Wd + 2 * y * Wd + 2 * x;
    out[(c * h + y) * w + x] = Math.max(inp[i], inp[i + 1], inp[i + Wd], inp[i + Wd + 1]);
  }
  return out;
}
function dense(inp, w, b, O, relu){
  const N = inp.length, out = new Float32Array(O);
  for(let o = 0; o < O; o++){
    let s = b[o]; const base = o * N;
    for(let i = 0; i < N; i++) s += inp[i] * w[base + i];
    out[o] = relu && s < 0 ? 0 : s;
  }
  return out;
}
/* 28×28(값 0~1, 글씨=1) → 10개 점수 */
function logits(img){
  const w = weights();
  let x = conv(img, 1, 28, 28, w['c1.weight'], w['c1.bias'], 8, 5); x = pool(x, 8, 28, 28);
  x = conv(x, 8, 14, 14, w['c2.weight'], w['c2.bias'], 16, 5); x = pool(x, 16, 14, 14);
  x = dense(x, w['f1.weight'], w['f1.bias'], 64, true);
  return dense(x, w['f2.weight'], w['f2.bias'], 10, false);
}
function classify(img){
  const z = logits(img), m = Math.max.apply(null, z), e = Array.from(z, v => Math.exp(v - m)), s = e.reduce((a, b) => a + b, 0);
  const probs = e.map(v => v / s); let d = 0; probs.forEach((p, i) => { if(p > probs[d]) d = i; });
  return { digit: d, p: probs[d], probs };
}

/* ---------- 획 → 28×28 그림 ---------- */
function bbox(strokes){
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  strokes.forEach(s => s.forEach(([x, y]) => { if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }));
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
function segDist(px, py, ax, ay, bx, by){
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
  let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = t < 0 ? 0 : t > 1 ? 1 : t;
  const qx = ax + t * dx - px, qy = ay + t * dy - py; return Math.sqrt(qx * qx + qy * qy);
}
/* 굵기 2.6칸 선을 부드러운 가장자리로 그린다. ox·oy만큼 옮겨 그린다. */
function paint(segs, ox, oy){
  const img = new Float32Array(784), R = 1.3;
  for(let y = 0; y < 28; y++) for(let x = 0; x < 28; x++){
    const px = x + 0.5 + ox, py = y + 0.5 + oy; let d = Infinity;
    for(let i = 0; i < segs.length; i++){
      const s = segs[i];
      if(px < s[4] - 2.5 || px > s[5] + 2.5 || py < s[6] - 2.5 || py > s[7] + 2.5) continue;
      const v = segDist(px, py, s[0], s[1], s[2], s[3]); if(v < d) d = v;
    }
    const v = 1 - (d - R) / 1.0;
    img[y * 28 + x] = v <= 0 ? 0 : v >= 1 ? 1 : v;
  }
  return img;
}
function rasterize(strokes){
  const b = bbox(strokes), size = Math.max(b.w, b.h);
  if(!(size > 0)) return null;
  const k = 20 / size, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, segs = [];
  strokes.forEach(s => {
    const pts = s.map(([x, y]) => [(x - cx) * k + 14, (y - cy) * k + 14]);
    if(pts.length === 1) pts.push([pts[0][0] + 0.01, pts[0][1]]);
    for(let i = 1; i < pts.length; i++){
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
      segs.push([ax, ay, bx, by, Math.min(ax, bx), Math.max(ax, bx), Math.min(ay, by), Math.max(ay, by)]);
    }
  });
  let img = paint(segs, 0, 0), m = 0, mx = 0, my = 0;
  for(let y = 0; y < 28; y++) for(let x = 0; x < 28; x++){ const v = img[y * 28 + x]; m += v; mx += v * (x + 0.5); my += v * (y + 0.5); }
  if(m > 0){ const ox = mx / m - 14, oy = my / m - 14; if(Math.abs(ox) > 0.25 || Math.abs(oy) > 0.25) img = paint(segs, ox, oy); }
  return img;
}

/* ---------- 획 묶기 ---------- */
function info(s){ const b = bbox([s]); return { s, ...b, cx: (b.x0 + b.x1) / 2, cy: (b.y0 + b.y1) / 2 }; }
/* 세로로 겹치는 획끼리 한 줄로. 위에서부터 차례. */
function rows(strokes){
  const list = strokes.filter(s => s && s.length).map(info).sort((a, b) => a.cy - b.cy), out = [];
  list.forEach(st => {
    const r = out.find(r => { const ov = Math.min(r.y1, st.y1) - Math.max(r.y0, st.y0); return ov > 0.3 * Math.max(4, Math.min(r.y1 - r.y0, st.h)); });
    if(r){ r.items.push(st); r.y0 = Math.min(r.y0, st.y0); r.y1 = Math.max(r.y1, st.y1); }
    else out.push({ items: [st], y0: st.y0, y1: st.y1 });
  });
  return out.map(r => ({ strokes: r.items.map(i => i.s), y0: r.y0, y1: r.y1 }));
}
/* 한 줄의 획 → 글자 묶음(왼쪽부터) */
function clusters(strokes){
  const list = strokes.filter(s => s && s.length).map(info);
  if(!list.length) return { groups: [], H: 0 };
  const H = Math.max(1, Math.max.apply(null, list.map(i => i.h)), bbox(list.map(i => i.s)).h * 0.6);
  // 소수점·잡티 같은 아주 작은 점은 버린다
  const kept = list.filter(i => Math.max(i.w, i.h) >= 0.14 * H).sort((a, b) => a.x0 - b.x0), groups = [];
  kept.forEach(st => {
    const g = groups[groups.length - 1];
    if(g){
      const ov = Math.min(g.x1, st.x1) - Math.max(g.x0, st.x0), narrow = Math.max(0.18 * H, Math.min(g.x1 - g.x0, st.w));
      // 가는 세로획(4의 세로줄·7의 가운데 줄)은 폭이 거의 없어 겹침으로 못 잡는다 — 가운데가 앞 글자 안쪽(양끝 10% 뺌)이면 같은 글자
      const gw = g.x1 - g.x0, inside = st.w < 0.25 * H && st.cx > g.x0 + 0.1 * gw && st.cx < g.x1 - 0.1 * gw;
      if(ov > 0.35 * narrow || inside){ g.items.push(st); g.x0 = Math.min(g.x0, st.x0); g.x1 = Math.max(g.x1, st.x1); g.y0 = Math.min(g.y0, st.y0); g.y1 = Math.max(g.y1, st.y1); return; }
    }
    groups.push({ items: [st], x0: st.x0, x1: st.x1, y0: st.y0, y1: st.y1 });
  });
  return { groups, H };
}
/* 한 줄의 획을 수로 읽는다 → {text, value, conf, digits} · 글씨가 없으면 null */
function readNumber(strokes){
  const { groups, H } = clusters(strokes || []);
  if(!groups.length) return null;
  let sign = '', start = 0;
  const g0 = groups[0], h0 = g0.y1 - g0.y0, w0 = g0.x1 - g0.x0;
  if(groups.length > 1 && g0.items.length === 1 && h0 < 0.3 * H && w0 > 1.6 * Math.max(h0, 1)){ sign = '-'; start = 1; }
  const digits = groups.slice(start).map(g => {
    const img = rasterize(g.items.map(i => i.s));
    return img ? classify(img) : { digit: 0, p: 0 };
  });
  if(!digits.length) return null;
  const text = sign + digits.map(d => d.digit).join('');
  return { text, value: Number(text), conf: Math.min.apply(null, digits.map(d => d.p)), digits };
}
const api = { classify, logits, rasterize, readNumber, rows, clusters, bbox };
root.NM_PEN_DIGITS = api;
if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
