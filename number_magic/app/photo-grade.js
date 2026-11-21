/* ============================================================
   Numbers of Magic — 인쇄한 학습지 사진으로 채점 · 시험판 (app/photo-grade.js, 2026-11-21)
   ------------------------------------------------------------
   원장 「사진 채점 효율성 확인 → 휴대폰 안에서 읽기」.
   · 아직 시험판이다: ws.html 주소에 marks=1 이 있을 때만 붙는다(문자가 보내는 링크에는 없다).
   · 사진은 이 기기 밖으로 나가지 않는다. 서버·API 를 부르지 않는다(운영 비용 0).
   · 흐름: 종이 네 귀퉁이의 검은 네모(왼쪽 위만 크다 = 방향 표시) 찾기 → 종이를 반듯하게 펴기
           → 답 쓰는 자리(네모 칸·세로셈 답 줄·「답:」 줄)에서 인쇄된 선을 빼고 글씨만 남기기
           → 펜 채점과 같은 숫자 읽기 모델(app/pen-digits.js)로 읽기.
   · 판정: 읽은 값이 정답과 같으면 ○. 다르면 ✕로 단정하지 않고 「확인」 — 글씨 조각과 읽은 값을 보여 주고
           보호자가 ○ / ✕ 를 누른다(실험에서 잘못은 전부 「맞는 답을 다르게 읽음」 쪽이었다).
   · 채점 대상은 펜 채점과 같다: exam.js penAnswerSpec 이 정답(정수)을 실은 문항. 나머지는 「정답지와 비교」.
   · 검사: node number_magic/scripts/check-photo-grade-browser.js
   ============================================================ */
(function(){
'use strict';
const PEN_V = '20261116-pen1';
const qs = new URLSearchParams(location.search);
const lang = ['en', 'zh'].includes(qs.get('l')) ? qs.get('l') : 'ko';
const t = (ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
const KEY = (() => { const p = new URLSearchParams(location.search); ['auto', 'l', 'marks', 'debug'].forEach(k => p.delete(k)); return 'nm_photo_v1:' + p.toString(); })();
const WC = 1400;            // 편 종이에서 좌·우 귀퉁이 표시 사이의 폭(px)
const PAD = 24;             // 표시 바깥 여유
const OK_CONF = 0.7;         // 이 확신 아래면 정답과 같게 읽혀도 「확인」으로
const BLUR_MAX = 3.0;        // 번짐이 종이 폭의 3‰ 를 넘으면 「다시 찍기」 안내
const MARK = 14, MARK_BIG = 22;   // 귀퉁이 표시 한 변(화면 px, 96dpi 기준 3.7mm · 5.8mm)

let D = window.NM_PEN_DIGITS || null, dReady = null;
function loadDigits(){
  if(D) return Promise.resolve(D);
  if(dReady) return dReady;
  const add = src => new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = src; sc.onload = res; sc.onerror = () => rej(new Error(src)); document.head.appendChild(sc); });
  dReady = (window.NM_PEN_DIGIT_MODEL ? Promise.resolve() : add('app/pen-digits-model.js?v=' + PEN_V))
    .then(() => window.NM_PEN_DIGITS ? null : add('app/pen-digits.js?v=' + PEN_V))
    .then(() => (D = window.NM_PEN_DIGITS))
    .catch(e => { dReady = null; throw e; });
  return dReady;
}

/* ============================================================
   1. 그림 계산 (DOM 없이 도는 순수 함수 — 검사기가 직접 부른다)
   ============================================================ */
/* RGBA → 밝기(0~1) */
function toGray(rgba, n){
  const g = new Float32Array(n);
  for(let i = 0, j = 0; i < n; i++, j += 4) g[i] = (rgba[j] * 0.299 + rgba[j + 1] * 0.587 + rgba[j + 2] * 0.114) / 255;
  return g;
}
/* 종이 바탕 밝기 어림: 칸(B px)마다 가장 밝은 값 → 부드럽게 → 원래 크기로. 그림자·조명 기울기를 없앤다. */
function normalize(g, w, h){
  const B = Math.max(8, Math.round(Math.max(w, h) / 90)), cw = Math.ceil(w / B), ch = Math.ceil(h / B);
  let m = new Float32Array(cw * ch);
  for(let cy = 0; cy < ch; cy++) for(let cx = 0; cx < cw; cx++){
    let mx = 0; const y1 = Math.min(h, (cy + 1) * B), x1 = Math.min(w, (cx + 1) * B);
    for(let y = cy * B; y < y1; y += 2){ const o = y * w; for(let x = cx * B; x < x1; x += 2){ const v = g[o + x]; if(v > mx) mx = v; } }
    m[cy * cw + cx] = mx;
  }
  // 칸 안이 전부 어두운 곳(검은 네모·굵은 글씨)이 바탕을 끌어내리지 않게 이웃의 큰 값으로 넓힌 뒤 평균한다
  const pass = (src, fn) => { const out = new Float32Array(cw * ch);
    for(let y = 0; y < ch; y++) for(let x = 0; x < cw; x++){ let acc = fn === 'max' ? 0 : 0, c = 0;
      for(let dy = -1; dy <= 1; dy++) for(let dx = -1; dx <= 1; dx++){ const yy = y + dy, xx = x + dx; if(yy < 0 || xx < 0 || yy >= ch || xx >= cw) continue; const v = src[yy * cw + xx]; if(fn === 'max'){ if(v > acc) acc = v; } else { acc += v; c++; } }
      out[y * cw + x] = fn === 'max' ? acc : acc / c; }
    return out; };
  m = pass(pass(pass(m, 'max'), 'avg'), 'avg');
  const out = new Float32Array(w * h);
  for(let y = 0; y < h; y++){
    const fy = Math.min(ch - 1, Math.max(0, (y + 0.5) / B - 0.5)), y0 = Math.floor(fy), y1 = Math.min(ch - 1, y0 + 1), ty = fy - y0;
    for(let x = 0; x < w; x++){
      const fx = Math.min(cw - 1, Math.max(0, (x + 0.5) / B - 0.5)), x0 = Math.floor(fx), x1 = Math.min(cw - 1, x0 + 1), tx = fx - x0;
      const bg = (m[y0 * cw + x0] * (1 - tx) + m[y0 * cw + x1] * tx) * (1 - ty) + (m[y1 * cw + x0] * (1 - tx) + m[y1 * cw + x1] * tx) * ty;
      const v = g[y * w + x] / (bg + 0.004); out[y * w + x] = v > 1 ? 1 : v;
    }
  }
  return out;
}
/* 이어진 덩어리 찾기(8방향). mask: Uint8Array(0/1). 돌려주는 값: [{x0,y0,x1,y1,area,cx,cy,id}], lab(Int32Array) */
function components(mask, w, h){
  const lab = new Int32Array(w * h), out = [], stack = new Int32Array(w * h);
  let id = 0;
  for(let s = 0; s < w * h; s++){
    if(!mask[s] || lab[s]) continue;
    id++; let sp = 0; stack[sp++] = s; lab[s] = id;
    let x0 = w, y0 = h, x1 = 0, y1 = 0, area = 0, sx = 0, sy = 0;
    while(sp){
      const p = stack[--sp], py = (p / w) | 0, px = p - py * w;
      area++; sx += px; sy += py; if(px < x0) x0 = px; if(px > x1) x1 = px; if(py < y0) y0 = py; if(py > y1) y1 = py;
      for(let dy = -1; dy <= 1; dy++){ const yy = py + dy; if(yy < 0 || yy >= h) continue;
        for(let dx = -1; dx <= 1; dx++){ const xx = px + dx; if(xx < 0 || xx >= w) continue; const q = yy * w + xx; if(mask[q] && !lab[q]){ lab[q] = id; stack[sp++] = q; } } }
    }
    out.push({ id, x0, y0, x1: x1 + 1, y1: y1 + 1, area, cx: sx / area, cy: sy / area });
  }
  return { list: out, lab };
}
/* 귀퉁이 표시 네 개 찾기. 돌려주는 값: 왼쪽 위(큰 것)부터 시계 방향 [[x,y]×4] 또는 {error} */
function findMarks(norm, w, h){
  const mask = new Uint8Array(w * h);
  for(let i = 0; i < w * h; i++) mask[i] = norm[i] < 0.45 ? 1 : 0;
  const { list } = components(mask, w, h);
  const minA = Math.max(36, w * h * 0.000012), maxA = w * h * 0.004;
  const cands = list.filter(c => { const bw = c.x1 - c.x0, bh = c.y1 - c.y0, r = bw / bh;
    return c.area >= minA && c.area <= maxA && r > 0.55 && r < 1.8 && c.area / (bw * bh) >= 0.62; });
  if(cands.length < 4) return { error: 'marks' };
  const corners = [[0, 0], [w, 0], [w, h], [0, h]], pick = [];
  for(const [cx, cy] of corners){
    let best = null, bd = Infinity;
    for(const c of cands){ if(pick.includes(c)) continue; const d = (c.cx - cx) * (c.cx - cx) + (c.cy - cy) * (c.cy - cy); if(d < bd){ bd = d; best = c; } }
    pick.push(best);
  }
  // 네 표시가 서로 비슷한 크기이고(큰 것 하나 빼고) 충분히 벌어져 있어야 한다
  const areas = pick.map(c => c.area), big = areas.indexOf(Math.max(...areas)), rest = areas.filter((_, i) => i !== big).sort((a, b) => a - b);
  if(rest[2] > rest[0] * 2.6) return { error: 'marks' };
  if(areas[big] < rest[1] * 1.5) return { error: 'turn' };            // 방향 표시(큰 네모)를 못 가렸다
  const span = Math.hypot(pick[0].cx - pick[2].cx, pick[0].cy - pick[2].cy);
  if(span < Math.hypot(w, h) * 0.35) return { error: 'far' };
  const order = [0, 1, 2, 3].map(i => pick[(big + i) % 4]);
  return { pts: order.map(c => [c.cx, c.cy]), sides: order.map(c => Math.sqrt(c.area)) };
}
/* 흐림 정도(px): 귀퉁이 표시 가운데에서 네 방향으로 나가며 「밝기 차이 ÷ 가장 가파른 기울기」 = 가장자리가 번진 폭. 중앙값. */
function edgeBlur(norm, w, h, mk){
  const vals = [];
  mk.pts.forEach(([cx, cy], i) => {
    const L = Math.max(8, Math.round(mk.sides[i] * 1.15));
    for(const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]){
      let prev = null, first = null, last = null, g = 0;
      for(let k = 0; k <= L; k++){ const x = Math.round(cx + dx * k), y = Math.round(cy + dy * k); if(x < 0 || y < 0 || x >= w || y >= h) break;
        const v = norm[y * w + x]; if(first == null) first = v; if(prev != null && v - prev > g) g = v - prev; prev = v; last = v; }
      if(g > 0 && last - first > 0.3) vals.push((last - first) / g);
    }
  });
  if(!vals.length) return 99;
  vals.sort((a, b) => a - b); return vals[vals.length >> 1];
}
/* 네 점 → 네 점 사영 변환(3×3, 9개 값) */
function homography(src, dst){
  const A = [];
  for(let i = 0; i < 4; i++){ const [x, y] = src[i], [u, v] = dst[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u]); A.push([0, 0, 0, x, y, 1, -v * x, -v * y, v]); }
  for(let c = 0; c < 8; c++){
    let p = c; for(let r = c + 1; r < 8; r++) if(Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if(Math.abs(A[p][c]) < 1e-12) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for(let r = 0; r < 8; r++){ if(r === c) continue; const f = A[r][c] / A[c][c]; if(f) for(let k = c; k < 9; k++) A[r][k] -= f * A[c][k]; }
  }
  const hh = A.map((r, i) => r[8] / r[i]); hh.push(1); return hh;
}
/* 사진(norm) → 편 종이(W×H). Hinv: 편 종이 좌표 → 사진 좌표 */
function warp(norm, w, h, Hinv, W, H){
  const out = new Float32Array(W * H);
  for(let y = 0; y < H; y++) for(let x = 0; x < W; x++){
    const d = Hinv[6] * x + Hinv[7] * y + Hinv[8], sx = (Hinv[0] * x + Hinv[1] * y + Hinv[2]) / d, sy = (Hinv[3] * x + Hinv[4] * y + Hinv[5]) / d;
    if(sx < 0 || sy < 0 || sx >= w - 1 || sy >= h - 1){ out[y * W + x] = 1; continue; }
    const x0 = sx | 0, y0 = sy | 0, tx = sx - x0, ty = sy - y0, o = y0 * w + x0;
    out[y * W + x] = (norm[o] * (1 - tx) + norm[o + 1] * tx) * (1 - ty) + (norm[o + w] * (1 - tx) + norm[o + w + 1] * tx) * ty;
  }
  return out;
}
/* 한 자리(zone: 편 종이 좌표 {x,y,w,h}, type: fbox|line|bottom)에서 글씨만 골라 숫자 그림(28×28)들로 */
function readZone(img, W, H, zone, type, neg){
  const gx = type === 'fbox' ? 0.45 : 0.6, gy = type === 'fbox' ? 0.45 : 0.3;
  const x0 = Math.max(0, Math.floor(zone.x - zone.w * gx)), y0 = Math.max(0, Math.floor(zone.y - zone.h * gy));
  const x1 = Math.min(W, Math.ceil(zone.x + zone.w * (1 + gx))), y1 = Math.min(H, Math.ceil(zone.y + zone.h * (1 + gy)));
  const w = x1 - x0, h = y1 - y0; if(w < 8 || h < 8) return { blank: true };
  const dark = new Uint8Array(w * h);
  for(let y = 0; y < h; y++) for(let x = 0; x < w; x++) dark[y * w + x] = img[(y0 + y) * W + x0 + x] < 0.86 ? 1 : 0;
  const ink = dark.slice();
  const zx = zone.x - x0, zy = zone.y - y0;
  /* 인쇄된 선 빼기 — 길게 이어진 어두운 줄(상자 변, 세로셈 가로줄, 「답:」 밑줄)을 찾아 번진 가장자리까지 2px 넓혀 지운다.
     글씨가 선을 건너간 자리(선 양쪽이 모두 어두움)는 남긴다.
     자리 가장자리를 무조건 지우는 방식은 쓰지 않는다 — 흐린 사진에는 도움이 안 되고 잘 찍은 사진에서 칸에 닿은 글씨를 깎았다(2026-11-21 측정: 96 → 94%). */
  const tolY = Math.max(7, zone.h * 0.16), tolX = Math.max(7, zone.w * 0.16);
  const rowBands = [], colBands = [];
  const needH = type === 'fbox' ? zone.w * 0.6 : zone.w * 0.5, rowLine = new Uint8Array(h);
  for(let y = 0; y < h; y++){
    if(type === 'fbox' && Math.abs(y - zy) > tolY && Math.abs(y - (zy + zone.h)) > tolY) continue;
    let run = 0, best = 0; for(let x = 0; x < w; x++){ if(dark[y * w + x]){ run++; if(run > best) best = run; } else run = 0; }
    if(best >= needH) rowLine[y] = 1;
  }
  for(let y = 0; y < h; y++){ if(!rowLine[y]) continue; const a = y; while(y + 1 < h && rowLine[y + 1]) y++; if(y - a <= 9) rowBands.push([a - 2, y + 2]); }   // 9px보다 두꺼우면 글씨일 수 있어 둔다
  if(type === 'fbox'){
    const colLine = new Uint8Array(w), needV = zone.h * 0.6;
    for(let x = 0; x < w; x++){
      if(Math.abs(x - zx) > tolX && Math.abs(x - (zx + zone.w)) > tolX) continue;
      let run = 0, best = 0; for(let y = 0; y < h; y++){ if(dark[y * w + x]){ run++; if(run > best) best = run; } else run = 0; }
      if(best >= needV) colLine[x] = 1;
    }
    for(let x = 0; x < w; x++){ if(!colLine[x]) continue; const a = x; while(x + 1 < w && colLine[x + 1]) x++; if(x - a <= 9) colBands.push([a - 2, x + 2]); }
  }
  for(let [a, b] of rowBands){
    a = Math.max(0, Math.round(a)); b = Math.min(h - 1, Math.round(b)); if(b < a) continue;
    for(let x = 0; x < w; x++){
      const up = a >= 2 && dark[(a - 1) * w + x] && dark[(a - 2) * w + x], dn = b + 2 < h && dark[(b + 1) * w + x] && dark[(b + 2) * w + x];
      if(up && dn) continue;
      for(let yy = a; yy <= b; yy++) ink[yy * w + x] = 0;
    }
  }
  for(let [a, b] of colBands){
    a = Math.max(0, Math.round(a)); b = Math.min(w - 1, Math.round(b)); if(b < a) continue;
    for(let y = 0; y < h; y++){
      const lf = a >= 2 && dark[y * w + a - 1] && dark[y * w + a - 2], rt = b + 2 < w && dark[y * w + b + 1] && dark[y * w + b + 2];
      if(lf && rt) continue;
      for(let xx = a; xx <= b; xx++) ink[y * w + xx] = 0;
    }
  }
  /* 덩어리 → 자리 안의 것만 → 가로로 겹치면 한 글자 */
  const { list, lab } = components(ink, w, h);
  const minH = Math.max(5, zone.h * 0.16);
  // 글자다운 크기만. 납작한 것(빼기 부호)은 답이 음수일 수 있는 문항에서만 받는다 — 지우고 남은 선 조각이 부호로 읽히지 않게
  let comps = list.filter(c => c.area >= 12 && (c.y1 - c.y0 >= minH || (neg && c.x1 - c.x0 >= minH * 1.4 && c.area >= 24)));
  // 자리와 절반 가까이 겹치는 것만(옆에 인쇄된 「0.」·「=」·윗줄 숫자는 자리 밖이라 빠진다. 칸을 조금 넘친 글씨는 남는다)
  comps = comps.filter(c => { const ix = Math.min(c.x1, zx + zone.w) - Math.max(c.x0, zx), iy = Math.min(c.y1, zy + zone.h) - Math.max(c.y0, zy);
    return ix > 0 && iy > 0 && ix * iy >= 0.4 * (c.x1 - c.x0) * (c.y1 - c.y0); });
  if(!comps.length) return { blank: true };
  comps.sort((a, b) => a.x0 - b.x0);
  const groups = [];
  for(const c of comps){
    const g = groups[groups.length - 1];
    if(g){ const ov = Math.min(g.x1, c.x1) - Math.max(g.x0, c.x0); if(ov > 0.45 * Math.min(g.x1 - g.x0, c.x1 - c.x0)){ g.x0 = Math.min(g.x0, c.x0); g.y0 = Math.min(g.y0, c.y0); g.x1 = Math.max(g.x1, c.x1); g.y1 = Math.max(g.y1, c.y1); g.ids.push(c.id); continue; } }
    groups.push({ x0: c.x0, y0: c.y0, x1: c.x1, y1: c.y1, ids: [c.id] });
  }
  const Hmax = Math.max(...groups.map(g => g.y1 - g.y0));
  let sign = '', from = 0;
  const g0 = groups[0];
  if(groups.length > 1 && (g0.y1 - g0.y0) < 0.3 * Hmax && (g0.x1 - g0.x0) > 1.6 * Math.max(1, g0.y1 - g0.y0)){ sign = '-'; from = 1; }
  const imgs = [];
  for(const g of groups.slice(from)){
    const gw = g.x1 - g.x0, gh = g.y1 - g.y0, s = 20 / Math.max(gw, gh), tw = Math.max(1, Math.round(gw * s)), th = Math.max(1, Math.round(gh * s));
    const small = new Float32Array(tw * th); let mass = 0, mx = 0, my = 0;
    for(let ty = 0; ty < th; ty++) for(let tx = 0; tx < tw; tx++){
      // 넓이 평균(줄일 때 획이 끊기지 않게)
      const sx0 = g.x0 + tx / s, sx1 = g.x0 + (tx + 1) / s, sy0 = g.y0 + ty / s, sy1 = g.y0 + (ty + 1) / s; let acc = 0, n = 0;
      for(let yy = Math.floor(sy0); yy < Math.min(h, Math.max(Math.floor(sy0) + 1, Math.ceil(sy1))); yy++) for(let xx = Math.floor(sx0); xx < Math.min(w, Math.max(Math.floor(sx0) + 1, Math.ceil(sx1))); xx++){
        n++; if(g.ids.includes(lab[yy * w + xx])){ const v = (0.95 - img[(y0 + yy) * W + x0 + xx]) / 0.5; acc += v < 0 ? 0 : v > 1 ? 1 : v; } }
      const v = n ? acc / n : 0; small[ty * tw + tx] = v; mass += v; mx += v * tx; my += v * ty;
    }
    if(mass <= 0) continue;
    let ox = Math.round(14 - (mx / mass + 0.5)), oy = Math.round(14 - (my / mass + 0.5));
    ox = Math.min(Math.max(ox, 0), 28 - tw); oy = Math.min(Math.max(oy, 0), 28 - th);
    const out = new Float32Array(784); let top = 0;
    for(let i = 0; i < small.length; i++) if(small[i] > top) top = small[i];
    for(let ty = 0; ty < th; ty++) for(let tx = 0; tx < tw; tx++) out[(oy + ty) * 28 + ox + tx] = small[ty * tw + tx] / (top || 1);
    imgs.push(out);
  }
  if(!imgs.length) return { blank: true };
  return { imgs, sign, box: { x: x0 + Math.min(...groups.map(g => g.x0)), y: y0 + Math.min(...groups.map(g => g.y0)), w: Math.max(...groups.map(g => g.x1)) - Math.min(...groups.map(g => g.x0)), h: Math.max(...groups.map(g => g.y1)) - Math.min(...groups.map(g => g.y0)) } };
}
/* 사진 한 장 채점.
   photo: {data: RGBA, width, height}
   geom:  {aspect: (아래 표시 y − 위 표시 y) / (오른쪽 표시 x − 왼쪽 표시 x),
           items: [{a: [정답…] | null, type, zones: [{x,y,w,h}]}]}  — 자리는 왼쪽 위 표시 가운데를 (0,0), 좌·우 표시 사이를 1로 한 좌표
   돌려주는 값: {error} 또는 {W, H, img(편 종이), quality:{pageW, sharp, low}, items:[{state:'ok'|'check'|'blank'|'self', read:[글자…], conf, crop:{x,y,w,h}}]} */
function analyze(photo, geom, digits){
  const w = photo.width, h = photo.height;
  const norm = normalize(toGray(photo.data, w * h), w, h);
  const mk = findMarks(norm, w, h);
  if(mk.error) return { error: mk.error };
  const W = WC + 2 * PAD, H = Math.round(WC * geom.aspect) + 2 * PAD;
  const dst = [[PAD, PAD], [PAD + WC, PAD], [PAD + WC, H - PAD], [PAD, H - PAD]];
  const Hinv = homography(dst, mk.pts); if(!Hinv) return { error: 'marks' };
  const img = warp(norm, w, h, Hinv, W, H);
  const pageW = Math.hypot(mk.pts[1][0] - mk.pts[0][0], mk.pts[1][1] - mk.pts[0][1]);
  const blur = edgeBlur(norm, w, h, mk) / pageW * 1000;          // 종이 폭의 천분율로 본 번짐
  const quality = { pageW: Math.round(pageW), blur: Math.round(blur * 100) / 100, low: pageW < 1000 || blur > BLUR_MAX };
  const items = geom.items.map(it => {
    if(!it.a || !it.zones || !it.zones.length || (it.a.length !== it.zones.length && it.a.length !== 1)) return { state: 'self' };
    const zones = it.a.length === it.zones.length ? it.zones : it.zones.slice(0, 1);
    const reads = [], boxes = []; let conf = 1, blanks = 0;
    for(const z of zones){
      const zz = { x: PAD + z.x * WC, y: PAD + z.y * WC, w: z.w * WC, h: z.h * WC };
      const r = readZone(img, W, H, zz, it.type, it.a.some(v => v < 0));
      if(r.blank){ blanks++; reads.push(''); continue; }
      const ds = r.imgs.map(im => digits.classify(im));
      reads.push(r.sign + ds.map(d => d.digit).join('')); conf = Math.min(conf, ...ds.map(d => d.p)); boxes.push(r.box);
    }
    if(blanks === zones.length) return { state: 'blank' };
    const ok = reads.every((s, i) => s !== '' && Number(s) === it.a[i] && String(Number(s)) === String(it.a[i]));
    const crop = boxes.length ? (() => { const bx0 = Math.min(...boxes.map(b => b.x)), by0 = Math.min(...boxes.map(b => b.y)), bx1 = Math.max(...boxes.map(b => b.x + b.w)), by1 = Math.max(...boxes.map(b => b.y + b.h)); return { x: bx0, y: by0, w: bx1 - bx0, h: by1 - by0 }; })() : null;
    // 읽은 값이 정답과 같아도 확신이 낮으면 ○로 단정하지 않는다 — 틀린 답을 정답으로 잘못 읽어 ○가 되는 일을 줄인다
    return { state: ok && conf >= OK_CONF ? 'ok' : 'check', match: ok, read: reads, conf: Math.round(conf * 100) / 100, crop };
  });
  return { W, H, img, quality, items };
}

/* ============================================================
   2. 학습지 화면에 붙이기
   ============================================================ */
let pages = [], saved = load(), panel = null;
function load(){ try{ const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if(v && v.pages) return v; }catch(e){} return { pages: {} }; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(saved)); }catch(e){} }
function css(){
  if(document.getElementById('nmPhotoCss')) return;
  const st = document.createElement('style'); st.id = 'nmPhotoCss';
  st.textContent = `
  .nm-ph-mark{position:absolute;width:0;height:0;border:${MARK / 2}px solid #000;z-index:3;pointer-events:none}
  .nm-ph-mark.big{border-width:${MARK_BIG / 2}px}
  .nm-ph-mark.tl{left:0;top:0}.nm-ph-mark.tr{right:0;top:0}.nm-ph-mark.br{right:0;bottom:0}.nm-ph-mark.bl{left:0;bottom:0}
  .nm-ph-marks{position:absolute;inset:0;z-index:4;pointer-events:none}
  .nm-ph-ring{position:absolute;border:calc(3px / var(--ws-zoom,1)) solid #d93025;border-radius:50%;transform:rotate(-6deg)}
  .nm-ph-chip{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:6px;padding:4px 6px;border-radius:10px;background:#fff;border:2px solid #c9731a;box-shadow:0 3px 10px rgba(20,27,64,.18);font:800 15px/1.2 Pretendard,system-ui,sans-serif;color:#1b2340;white-space:nowrap}
  .nm-ph-chip canvas{height:34px;width:auto;border-radius:4px;background:#fff;border:1px solid #e0e9f8}
  .nm-ph-chip button{min-width:38px;min-height:38px;border-radius:9px;border:1px solid #cfd8ea;background:#f2f6fd;font:800 17px/1 inherit;color:#1b2340;cursor:pointer}
  .nm-ph-chip button.o i{display:block;width:18px;height:18px;margin:0 auto;border:3px solid currentColor;border-radius:50%;box-sizing:border-box}
  .nm-ph-chip button.o{color:#d93025}.nm-ph-chip[data-set=o]{border-color:#d93025}.nm-ph-chip[data-set=x]{border-color:#1b2340}
  .nm-ph-chip[data-set=o] button.o{background:#d93025;color:#fff;border-color:#d93025}.nm-ph-chip[data-set=x] button.x{background:#1b2340;color:#fff;border-color:#1b2340}
  .nm-ph-note{position:absolute;font:700 13px/1.2 Pretendard,system-ui,sans-serif;color:#6b7391;background:rgba(255,255,255,.9);padding:2px 6px;border-radius:6px}
  .nm-ph-panel{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;background:rgba(20,27,64,.38);font-family:Pretendard,system-ui,sans-serif}
  .nm-ph-panel[hidden]{display:none}
  .nm-ph-sheet{width:min(560px,100vw);max-height:86vh;overflow:auto;background:#fff;border-radius:18px 18px 0 0;padding:18px 16px calc(16px + env(safe-area-inset-bottom));color:#1b2340;box-shadow:0 -10px 40px rgba(20,27,64,.25)}
  .nm-ph-sheet h3{margin:0 0 4px;font-size:19px;font-weight:800;letter-spacing:-.02em}
  .nm-ph-sheet p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#55607d;word-break:keep-all}
  .nm-ph-row{display:flex;align-items:center;gap:10px;padding:12px 0;border-top:1px solid #e9eef8}
  .nm-ph-row b{font-size:16px;font-weight:800}.nm-ph-row small{display:block;font-size:13px;color:#6b7391;margin-top:2px}
  .nm-ph-row .grow{flex:1;min-width:0}
  .nm-ph-btn{min-height:46px;padding:0 16px;border-radius:12px;border:0;background:#243184;color:#fff;font:800 15px/1 inherit;cursor:pointer}
  .nm-ph-btn.ghost{background:#f2f6fd;color:#243184;border:1px solid #d5def0}
  .nm-ph-warn{margin:8px 0 0;padding:10px 12px;border-radius:10px;background:#fff4e5;color:#8a4b08;font-size:14px;line-height:1.5;word-break:keep-all}
  .nm-ph-debug{width:100%;height:auto;margin-top:10px;border:1px solid #e0e9f8}
  .ws-bar .ws-photo{background:#243184;margin-left:0}
  body.nm-ph-measure>.nm-print-sheet .nm-w2-page{border-bottom:0!important}
  @media print{.nm-ph-marks,.nm-ph-panel,.ws-photo{display:none!important}}`;
  document.head.appendChild(st);
}
/* 쪽마다 귀퉁이 표시를 단다(화면·인쇄 모두). 채점할 문항이 있는 쪽만 목록에 올린다. */
function setupPages(){
  css();
  pages = [];
  document.querySelectorAll('body>.nm-print-sheet .nm-w2-page').forEach((el, idx) => {
    if(el.matches('.nm-print-answer-key') || el.closest('.nm-print-answer-key')) return;
    const its = [...el.querySelectorAll('[data-pen-ans]')]; if(!its.length) return;
    if(getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if(!el.querySelector('.nm-ph-mark')) ['tl big', 'tr', 'br', 'bl'].forEach(c => { const m = document.createElement('i'); m.className = 'nm-ph-mark ' + c; m.setAttribute('aria-hidden', 'true'); el.appendChild(m); });
    const marks = document.createElement('div'); marks.className = 'nm-ph-marks'; el.appendChild(marks);
    const head = el.querySelector('.nm-w2-head'), T = e => e ? (e.innerText || '').replace(/\s+/g, ' ').trim() : '';
    const day = T(head && head.querySelector('.nm-w2-study-day')), title = T(head && head.querySelector('.nm-w2-head-mid')), no = T(el.querySelector('.nm-w2-foot .nm-w2-pg'));
    pages.push({ el, idx, its, marks, label: (day ? day + ' ' : '') + (no ? '· ' + no.replace(/\s*\/.*$/, '') + t('쪽', '', '页') : ''), title: title.replace(/^\d+일차(–\d+일차)?\s*/, ''), result: null, geom: null });
  });
  measure();
}
/* 자리 좌표는 인쇄와 같은 배치에서 잰다: 휴대폰은 종이를 화면 폭에 맞춰 줄여(zoom) 보여 주는데, 그 상태에서는
   글줄 높이가 조금씩 달라져 아래쪽 자리가 1mm 넘게 어긋난다. 잠깐 원래 크기(zoom 1, 쪽 경계선 없음)로 돌려 재고 되돌린다. */
function measure(){
  const root = document.documentElement, prev = root.style.getPropertyValue('--ws-zoom');
  document.body.classList.add('nm-ph-measure'); root.style.setProperty('--ws-zoom', '1');
  pages.forEach(pg => { pg.geom = geometry(pg); });
  document.body.classList.remove('nm-ph-measure');
  if(prev) root.style.setProperty('--ws-zoom', prev); else root.style.removeProperty('--ws-zoom');
}
/* 쪽의 자리들을 표시 기준 좌표로 */
function geometry(pg){
  const c = s => { const r = pg.el.querySelector('.nm-ph-mark.' + s).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const tl = c('tl'), tr = c('tr'), bl = c('bl'), unit = tr[0] - tl[0];
  const R = e => { const r = e.getBoundingClientRect(); return { x: (r.left - tl[0]) / unit, y: (r.top - tl[1]) / unit, w: r.width / unit, h: r.height / unit }; };
  const items = pg.its.map(e => {
    let spec = null; try{ spec = JSON.parse(e.getAttribute('data-pen-ans')); }catch(err){}
    const fb = [...e.querySelectorAll('.fbox')], ln = e.querySelector('.nm-print-word-blank,.nm-print-solve-ans'), bt = e.querySelector('.nm-print-vp-bot');
    let type = '', zones = [];
    if(fb.length){ type = 'fbox'; zones = fb.map(R); }
    else if(ln){ const bl = ln.querySelectorAll('.nm-w2-blank,.nm-print-solve-line'); type = 'line'; const z = R(bl.length ? bl[bl.length - 1] : ln);   // 「식:」 칸이 아니라 마지막 「답:」 빈칸
      if(z.h < 0.02){ z.y = z.y + z.h - 0.04; z.h = 0.04; } zones = [z]; }
    else if(bt){ type = 'bottom'; zones = [R(bt)]; }
    return { a: spec && spec.a && zones.length ? spec.a : null, type, zones, rect: R(e) };
  });
  return { aspect: (bl[1] - tl[1]) / unit, items, unitPx: unit, tl };
}
/* 사진 파일 → RGBA(긴 변 2400px 이하) */
function loadPhoto(file){
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { try{
      const k = Math.min(1, 2400 / Math.max(im.naturalWidth, im.naturalHeight)), w = Math.round(im.naturalWidth * k), h = Math.round(im.naturalHeight * k);
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(im, 0, 0, w, h);
      const d = cx.getImageData(0, 0, w, h); URL.revokeObjectURL(url); res({ data: d.data, width: w, height: h });
    }catch(e){ rej(e); } };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('image')); };
    im.src = url;
  });
}
function cropCanvas(res, crop){
  const m = 6, x0 = Math.max(0, Math.floor(crop.x - m)), y0 = Math.max(0, Math.floor(crop.y - m)), w = Math.min(res.W - x0, Math.ceil(crop.w + 2 * m)), h = Math.min(res.H - y0, Math.ceil(crop.h + 2 * m));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const cx = cv.getContext('2d'), id = cx.createImageData(w, h);
  for(let y = 0; y < h; y++) for(let x = 0; x < w; x++){ const v = Math.round(res.img[(y0 + y) * res.W + x0 + x] * 255), o = (y * w + x) * 4; id.data[o] = id.data[o + 1] = id.data[o + 2] = v; id.data[o + 3] = 255; }
  cx.putImageData(id, 0, 0); return cv;
}
function tally(pg){
  const st = (saved.pages[pg.idx] || {}).items || []; let ok = 0, bad = 0, check = 0, blank = 0, self = 0;
  st.forEach(s => { const v = s.set || (s.state === 'ok' ? 'o' : ''); if(s.state === 'self') self++; else if(s.state === 'blank') blank++; else if(v === 'o') ok++; else if(v === 'x') bad++; else check++; });
  return { ok, bad, check, blank, self, total: st.length - self };
}
/* 채점 표시를 학습지 쪽 위에 그린다 */
function paint(pg, res){
  pg.marks.innerHTML = '';
  const st = (saved.pages[pg.idx] || {}).items; if(!st) return;
  const g = geometry(pg), base = pg.el.getBoundingClientRect(), zoom = pg.el.offsetWidth / (base.width || 1);
  const U = v => v * g.unitPx * zoom, ox = (g.tl[0] - base.left) * zoom, oy = (g.tl[1] - base.top) * zoom;
  const wz = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ws-zoom')) || 1;
  st.forEach((s, i) => {
    const it = g.items[i]; if(!it) return;
    const z = it.zones[0] || it.rect, cx = ox + U(z.x + z.w / 2), cy = oy + U(z.y + z.h / 2);
    if(s.state === 'self') return;
    if(s.state === 'blank'){ const n = document.createElement('span'); n.className = 'nm-ph-note'; n.textContent = t('답 없음', 'No answer', '未作答'); n.style.zoom = String(1 / wz); n.style.left = ((ox + U(z.x)) * wz) + 'px'; n.style.top = ((oy + U(z.y + z.h) + 2) * wz) + 'px'; pg.marks.appendChild(n); return; }
    if(s.state === 'ok'){ const r = document.createElement('i'); r.className = 'nm-ph-ring'; const rw = Math.max(34, U(z.w) + 16), rh = Math.max(30, U(z.h) + 14); r.style.cssText = `left:${cx - rw / 2}px;top:${cy - rh / 2}px;width:${rw}px;height:${rh}px`; pg.marks.appendChild(r); return; }
    const chip = document.createElement('span'); chip.className = 'nm-ph-chip'; chip.dataset.set = s.set || ''; chip.dataset.i = String(i); chip.style.zoom = String(1 / wz);
    if(res && res.items[i] && res.items[i].crop) chip.appendChild(cropCanvas(res, res.items[i].crop));
    const txt = document.createElement('span'); txt.textContent = t(`${s.read.join(', ')}로 읽음`, `read ${s.read.join(', ')}`, `读作 ${s.read.join(', ')}`); chip.appendChild(txt);
    chip.insertAdjacentHTML('beforeend', `<button type="button" class="o" aria-label="${t('맞음', 'Correct', '正确')}"><i></i></button><button type="button" class="x" aria-label="${t('틀림', 'Wrong', '错误')}">✕</button>`);
    chip.onclick = e => { const b = e.target.closest('button'); if(!b) return; s.set = b.classList.contains('o') ? 'o' : 'x'; chip.dataset.set = s.set; save(); if(panel) renderPanel(); };
    pg.marks.appendChild(chip);
    // 종이는 화면 폭에 맞춰 줄여(zoom) 보여 주므로 칩만 실제 크기로 키우고, 자리 값은 그만큼 나눈다. 오른쪽으로 넘치면 안으로 당긴다
    const left = Math.max(0, Math.min(ox + U(it.rect.x), pg.el.offsetWidth - chip.offsetWidth / wz - 4));
    chip.style.left = (left * wz) + 'px'; chip.style.top = ((oy + U(z.y + z.h) + 4) * wz) + 'px';
  });
}
const ERR = {
  marks: () => t('종이 네 귀퉁이의 검은 네모가 모두 보이게 다시 찍어 주세요.', 'Retake so all four black corner squares are visible.', '请重新拍摄，让纸张四角的黑色方块都入镜。'),
  turn: () => t('귀퉁이 표시를 가리지 못했어요. 종이 전체가 나오게 다시 찍어 주세요.', 'Could not tell the corners apart. Retake with the whole page in view.', '无法分辨四角标记，请拍下整张纸。'),
  far: () => t('종이가 너무 작게 찍혔어요. 더 가까이에서 찍어 주세요.', 'The page is too small in the photo. Move closer.', '纸张拍得太小，请靠近一些。'),
  image: () => t('사진을 열지 못했어요. 다시 골라 주세요.', 'Could not open the photo. Choose it again.', '无法打开照片，请重新选择。')
};
async function gradePhoto(pg, file){
  const digits = await loadDigits();
  const photo = await loadPhoto(file);
  const g = pg.geom;
  await new Promise(r => setTimeout(r, 30));                      // 「읽는 중」이 먼저 그려지게
  const t0 = performance.now();
  const res = analyze(photo, g, digits);
  if(res.error) return res;
  res.ms = Math.round(performance.now() - t0);
  const prev = (saved.pages[pg.idx] || {}).items || [];
  saved.pages[pg.idx] = { at: Date.now(), quality: res.quality, ms: res.ms, items: res.items.map((r, i) => ({ state: r.state, read: r.read || [], conf: r.conf, set: r.state === 'check' && prev[i] && prev[i].state === 'check' && String(prev[i].read) === String(r.read) ? prev[i].set : undefined })) };
  save(); pg.result = res; paint(pg, res);
  return res;
}
function summary(pg){
  if(!saved.pages[pg.idx]) return '';
  const c = tally(pg);
  return t(`${c.total}문제 중 맞음 ${c.ok}` + (c.bad ? ` · 틀림 ${c.bad}` : '') + (c.check ? ` · 확인할 것 ${c.check}` : '') + (c.blank ? ` · 답 없음 ${c.blank}` : ''),
    `${c.ok} of ${c.total} correct` + (c.bad ? ` · ${c.bad} wrong` : '') + (c.check ? ` · ${c.check} to check` : '') + (c.blank ? ` · ${c.blank} blank` : ''),
    `${c.total}题中正确 ${c.ok}` + (c.bad ? ` · 错误 ${c.bad}` : '') + (c.check ? ` · 待确认 ${c.check}` : '') + (c.blank ? ` · 未作答 ${c.blank}` : ''));
}
function renderPanel(msg){
  if(!panel) return;
  const sheet = panel.querySelector('.nm-ph-sheet');
  sheet.innerHTML = `<h3>${t('사진으로 채점', 'Grade from a photo', '拍照评分')}</h3>
    <p>${t('푼 쪽을 한 장씩 찍어요. 종이 네 귀퉁이의 검은 네모가 다 보이게, 밝은 곳에서 가까이. 사진은 이 기기 밖으로 나가지 않아요.', 'Photograph one solved page at a time, close up in good light, with all four black corner squares visible. Photos never leave this device.', '每次拍一页已完成的学习单：光线充足、靠近拍摄，四角黑色方块都要入镜。照片不会离开本设备。')}</p>
    ${msg ? `<div class="nm-ph-warn" role="alert">${msg}</div>` : ''}
    ${pages.map((pg, i) => `<div class="nm-ph-row"><div class="grow"><b>${pg.label || (i + 1)}</b> ${pg.title ? `<span>${pg.title}</span>` : ''}<small>${summary(pg) || t('아직 안 찍음', 'Not photographed yet', '尚未拍摄')}</small></div>
      ${saved.pages[pg.idx] ? `<button type="button" class="nm-ph-btn ghost" data-go="${i}">${t('보기', 'View', '查看')}</button>` : ''}
      <button type="button" class="nm-ph-btn" data-shoot="${i}">${saved.pages[pg.idx] ? t('다시 찍기', 'Retake', '重拍') : t('찍기', 'Take photo', '拍照')}</button></div>`).join('')}
    <div class="nm-ph-row"><div class="grow"></div><button type="button" class="nm-ph-btn ghost" data-copy="1">${t('결과 복사', 'Copy results', '复制结果')}</button><button type="button" class="nm-ph-btn ghost" data-close="1">${t('닫기', 'Close', '关闭')}</button></div>`;
  if(qs.get('debug') === '1'){ const last = pages.filter(p => p.result).pop(); if(last){ const cv = cropCanvas(last.result, { x: 0, y: 0, w: last.result.W, h: last.result.H }); cv.className = 'nm-ph-debug'; sheet.appendChild(cv); } }
}
function openPanel(){
  if(panel){ panel.hidden = false; renderPanel(); return; }
  panel = document.createElement('div'); panel.className = 'nm-ph-panel'; panel.innerHTML = '<div class="nm-ph-sheet" role="dialog" aria-modal="true"></div>';
  const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.setAttribute('capture', 'environment'); input.hidden = true; input.id = 'nmPhotoInput'; panel.appendChild(input);
  let target = null;
  panel.onclick = e => {
    if(e.target === panel){ panel.hidden = true; return; }
    const b = e.target.closest('button'); if(!b) return;
    if(b.dataset.close){ panel.hidden = true; }
    else if(b.dataset.shoot != null){ target = pages[+b.dataset.shoot]; input.value = ''; input.click(); }
    else if(b.dataset.go != null){ const pg = pages[+b.dataset.go]; panel.hidden = true; paint(pg, pg.result); pg.el.scrollIntoView({ block: 'start' }); }
    else if(b.dataset.copy){ const txt = JSON.stringify({ sheet: KEY, pages: pages.map(pg => ({ label: pg.label, saved: saved.pages[pg.idx] || null, answers: pg.geom.items.map(i => i.a) })) }); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { b.textContent = t('복사했어요', 'Copied', '已复制'); }, () => { prompt(t('아래 글을 복사해 주세요', 'Copy the text below', '请复制以下文字'), txt); }); }
  };
  input.onchange = async () => {
    const f = input.files && input.files[0], pg = target; if(!f || !pg) return;
    renderPanel(t('사진을 읽는 중…', 'Reading the photo…', '正在读取照片…'));
    let res; try{ res = await gradePhoto(pg, f); }catch(e){ res = { error: e && e.message === 'image' ? 'image' : 'load' }; }
    if(res.error){ renderPanel(res.error === 'load' ? t('채점 도구를 불러오지 못했어요. 인터넷을 확인하고 다시 해 주세요.', 'Could not load the grader. Check your connection and retry.', '无法加载评分工具，请检查网络后重试。') : ERR[res.error]()); return; }
    renderPanel(res.quality.low ? t('사진이 흐리거나 멀어요. 잘못 읽은 것이 많으면 밝은 곳에서 더 가까이 다시 찍어 주세요.', 'The photo looks blurry or far away. If many answers were misread, retake closer in better light.', '照片较模糊或距离较远。如误读较多，请在明亮处靠近重拍。') : '');
  };
  document.body.appendChild(panel); renderPanel();
}
/* ws.html 이 학습지를 다 그린 뒤 부른다(주소에 marks=1 일 때). auto=0(PDF 생성)이면 표시만 달고 단추는 안 만든다. */
function mount(opts){
  if(document.querySelector('.nm-ph-mark')) return;
  setupPages();
  if(!pages.length || (opts && opts.marksOnly)) return;
  const host = document.getElementById('wsBar'); if(!host) return;
  const b = document.createElement('button'); b.type = 'button'; b.id = 'wsPhoto'; b.className = 'ws-photo'; b.textContent = t('사진으로 채점', 'Grade from photo', '拍照评分');
  b.onclick = openPanel;
  host.insertBefore(b, document.getElementById('wsPrint') || null);
  pages.forEach(pg => paint(pg, null));
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => pages.forEach(pg => paint(pg, pg.result)), 150); });
}
window.NM_PHOTO_GRADE = { mount, analyze, findMarks, homography, normalize, toGray, readZone, _pages: () => pages, _geometry: geometry, _grade: gradePhoto, _saved: () => saved };
})();
