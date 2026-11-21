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
   ------------------------------------------------------------
   모양(2026-11-21, 원장 「이에 따른 디자인도」): 선생님이 빨간 색연필로 채점한 종이처럼.
   · 색은 셋 — 먹(글) · 남색(누르는 것) · 빨강(채점 표시만). 이모지·말풍선·알약·그림자 상자를 쓰지 않는다.
   · 맞은 답 = 손으로 그린 동그라미, 틀린 답 = 빗금, 쪽 오른쪽 위 = 「11/12」 + 밑줄 두 줄(선생님이 점수 적는 모양).
   · 한 번에 할 일 하나: 목록에서 「찍기」 → 그 쪽으로 가서 표시를 보고 → 아래 줄의 「다음 쪽 찍기」.
   ============================================================ */
const INK = '#1b2340', SUB = '#6b7391', NAVY = '#243184', RED = '#d2372c', LINE = '#e6ebf5';
let pages = [], saved = load(), panel = null, dock = null, input = null, target = null, busy = null;
function load(){ try{ const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if(v && v.pages) return v; }catch(e){} return { pages: {} }; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(saved)); }catch(e){} }
function css(){
  if(document.getElementById('nmPhotoCss')) return;
  const st = document.createElement('style'); st.id = 'nmPhotoCss';
  st.textContent = `
  .nm-ph-mark{position:absolute;width:0;height:0;border:${MARK / 2}px solid #000;z-index:3;pointer-events:none}
  .nm-ph-mark.big{border-width:${MARK_BIG / 2}px}
  .nm-ph-mark.tl{left:0;top:0}.nm-ph-mark.tr{right:0;top:0}.nm-ph-mark.br{right:0;bottom:0}.nm-ph-mark.bl{left:0;bottom:0}
  .nm-ph-marks{position:absolute;inset:0;z-index:4;pointer-events:none;font-family:Pretendard,system-ui,sans-serif}
  .nm-ph-ink{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
  .nm-ph-ink path{fill:none;stroke:${RED};stroke-linecap:round;stroke-linejoin:round}
  .nm-ph-score{position:absolute;color:${RED};font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:-.02em;line-height:1;transform:rotate(-5deg);transform-origin:right top;padding-bottom:.18em;border-bottom:.09em solid ${RED};box-shadow:0 .16em 0 -.035em #fff,0 .25em 0 -.035em ${RED}}
  .nm-ph-chip{position:absolute;pointer-events:auto;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 10px;border-radius:12px;background:#fff;border:1px solid #cfd6e6;box-shadow:0 6px 18px rgba(27,35,64,.16);color:${INK};white-space:nowrap}
  .nm-ph-chip canvas{height:40px;width:auto;max-width:96px;border-radius:6px;background:#fff;border:1px solid ${LINE}}
  .nm-ph-chip dl{margin:0;display:grid;grid-template-columns:auto auto;gap:1px 8px;font-size:13px;line-height:1.25;color:${SUB};font-weight:600}
  .nm-ph-chip dd{margin:0;font-size:16px;font-weight:800;color:${INK};font-variant-numeric:tabular-nums}
  .nm-ph-chip button{width:42px;height:42px;padding:0;border-radius:10px;border:1px solid #cfd6e6;background:#fff;color:${INK};font:800 18px/1 Pretendard,system-ui,sans-serif;cursor:pointer}
  .nm-ph-chip button.o i{display:block;width:19px;height:19px;margin:0 auto;border:3px solid ${RED};border-radius:50%;box-sizing:border-box}
  .nm-ph-chip[data-set=o] button.o{background:${RED};border-color:${RED}}.nm-ph-chip[data-set=o] button.o i{border-color:#fff}
  .nm-ph-chip[data-set=x] button.x{background:${INK};border-color:${INK};color:#fff}
  .nm-ph-chip[data-set=o],.nm-ph-chip[data-set=x]{padding:4px;gap:4px;box-shadow:none;border-color:${LINE}}
  .nm-ph-chip[data-set=o] canvas,.nm-ph-chip[data-set=o] dl,.nm-ph-chip[data-set=x] canvas,.nm-ph-chip[data-set=x] dl{display:none}
  .nm-ph-chip[data-set=o] button,.nm-ph-chip[data-set=x] button{width:34px;height:34px}
  .nm-ph-note{position:absolute;font-size:13px;font-weight:700;line-height:1.2;color:${SUB};white-space:nowrap}
  .nm-ph-panel{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;background:rgba(27,35,64,.42);font-family:Pretendard,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
  .nm-ph-panel[hidden],.nm-ph-dock[hidden]{display:none}
  .nm-ph-sheet{width:min(560px,100vw);max-height:88vh;overflow:auto;background:#fff;border-radius:20px 20px 0 0;padding:22px 20px calc(18px + env(safe-area-inset-bottom));color:${INK};word-break:keep-all}
  .nm-ph-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .nm-ph-top h3{margin:0;font-size:22px;font-weight:800;letter-spacing:-.03em}
  .nm-ph-text{border:0;background:none;padding:10px 4px;font:700 15px/1 inherit;color:${SUB};cursor:pointer}
  .nm-ph-how{display:flex;gap:16px;align-items:center;margin:14px 0 6px;padding:14px 16px;border-radius:14px;background:#f4f6fb}
  .nm-ph-how svg{flex:0 0 auto}
  .nm-ph-how p{margin:0;font-size:15px;line-height:1.5;font-weight:600;color:${INK}}
  .nm-ph-how small{display:block;margin-top:4px;font-size:13px;font-weight:500;color:${SUB}}
  .nm-ph-say{margin:12px 0 0;font-size:15px;line-height:1.5;font-weight:700;color:${RED}}
  .nm-ph-day{margin:20px 0 2px;font-size:13px;font-weight:700;color:${SUB}}
  .nm-ph-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid ${LINE}}
  .nm-ph-day + .nm-ph-row{border-top:0}
  .nm-ph-row .grow{flex:1;min-width:0}
  .nm-ph-row b{display:block;font-size:17px;font-weight:700;letter-spacing:-.02em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .nm-ph-row small{display:block;margin-top:3px;font-size:13px;font-weight:500;color:${SUB}}
  .nm-ph-row .pts{font-size:22px;font-weight:800;color:${RED};font-variant-numeric:tabular-nums;letter-spacing:-.02em}
  .nm-ph-btn{min-height:46px;min-width:72px;padding:0 18px;border-radius:12px;border:1px solid ${NAVY};background:${NAVY};color:#fff;font:700 15px/1 inherit;cursor:pointer}
  .nm-ph-btn.quiet{background:#fff;color:${NAVY};border-color:#cfd6e6}
  .nm-ph-btn:disabled{opacity:.55}
  .nm-ph-btn:focus-visible,.nm-ph-text:focus-visible,.nm-ph-chip button:focus-visible{outline:3px solid #2a6df4;outline-offset:2px}
  .nm-ph-foot{margin-top:14px;text-align:right}
  .nm-ph-debug{width:100%;height:auto;margin-top:10px;border:1px solid ${LINE}}
  .nm-ph-dock{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;align-items:center;gap:10px;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid ${LINE};box-shadow:0 -8px 24px rgba(27,35,64,.08);font-family:Pretendard,system-ui,sans-serif;color:${INK};word-break:keep-all}
  .nm-ph-dock .grow{flex:1;min-width:0}
  @media (max-width:560px){.nm-ph-dock{flex-wrap:wrap}.nm-ph-dock .grow{flex:1 1 100%}.nm-ph-dock .nm-ph-btn{flex:1}}
  .nm-ph-dock b{display:block;font-size:16px;font-weight:800;letter-spacing:-.02em}
  .nm-ph-dock small{display:block;margin-top:2px;font-size:13px;font-weight:500;color:${SUB}}
  body.nm-ph-measure>.nm-print-sheet .nm-w2-page{border-bottom:0!important}
  @media (prefers-reduced-motion:no-preference){ .nm-ph-ink path.draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:nm-ph-draw .34s ease-out forwards;animation-delay:var(--d,0s)} }
  @keyframes nm-ph-draw{to{stroke-dashoffset:0}}
  @media print{.nm-ph-marks,.nm-ph-panel,.nm-ph-dock,.ws-photo{display:none!important}}`;
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
    const day = T(head && head.querySelector('.nm-w2-study-day')), title = T(head && head.querySelector('.nm-w2-head-mid')).replace(/^\d+일차(–\d+일차)?\s*/, ''), no = T(el.querySelector('.nm-w2-foot .nm-w2-pg')).replace(/\s*\/.*$/, '');
    const pageName = no ? t(no + '쪽', 'Page ' + no, '第' + no + '页') : String(pages.length + 1);
    pages.push({ el, idx, its, marks, day, title, pageName, label: (day ? day + ' ' : '') + pageName, result: null, geom: null });
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
    else if(ln){ const bl2 = ln.querySelectorAll('.nm-w2-blank,.nm-print-solve-line'); type = 'line'; const z = R(bl2.length ? bl2[bl2.length - 1] : ln);   // 「식:」 칸이 아니라 마지막 「답:」 빈칸
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
/* 손으로 그린 듯한 동그라미(끝이 살짝 겹친다)와 빗금 */
function ringPath(cx, cy, rx, ry, seed){
  const pts = [], n = 16, a0 = -2.0 + (seed % 5) * 0.12, sweep = Math.PI * 2 + 0.55;
  for(let i = 0; i <= n; i++){ const a = a0 + sweep * i / n, k = 1 + 0.07 * Math.sin(i * 2.3 + seed * 1.7) + (i / n) * 0.06; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for(let i = 1; i < pts.length - 1; i++){ const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`; }
  return d;
}
function slashPath(cx, cy, rx, ry, seed){
  const k = 1.15 + (seed % 3) * 0.05; return `M${(cx - rx * k).toFixed(1)} ${(cy + ry * k).toFixed(1)} Q${(cx - rx * 0.1).toFixed(1)} ${(cy + ry * 0.25).toFixed(1)} ${(cx + rx * k).toFixed(1)} ${(cy - ry * k).toFixed(1)}`;
}
/* 채점 표시를 학습지 쪽 위에 그린다. fresh: 방금 채점한 것(동그라미가 그려지는 움직임 한 번) */
function paint(pg, res, fresh){
  pg.marks.innerHTML = '';
  const st = (saved.pages[pg.idx] || {}).items; if(!st) return;
  const g = geometry(pg), base = pg.el.getBoundingClientRect(), zoom = pg.el.offsetWidth / (base.width || 1);
  const U = v => v * g.unitPx * zoom, ox = (g.tl[0] - base.left) * zoom, oy = (g.tl[1] - base.top) * zoom;
  const wz = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ws-zoom')) || 1;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'nm-ph-ink'); svg.setAttribute('viewBox', `0 0 ${pg.el.offsetWidth} ${pg.el.offsetHeight}`); svg.setAttribute('aria-hidden', 'true');
  const sw = Math.min(6, 2.6 / wz); let order = 0;
  const stroke = (d, cls) => { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); p.setAttribute('stroke-width', String(sw)); p.setAttribute('class', cls + (fresh ? ' draw' : '')); svg.appendChild(p);
    if(fresh){ p.style.setProperty('--len', '600'); p.style.setProperty('--d', (Math.min(order++, 14) * 0.05) + 's'); } };
  pg.marks.appendChild(svg);
  st.forEach((s, i) => {
    const it = g.items[i]; if(!it || s.state === 'self') return;
    const z = it.zones[0] || it.rect, zl = it.zones[it.zones.length - 1] || z, cx = ox + U((z.x + zl.x + zl.w) / 2), cy = oy + U(z.y + z.h / 2);
    const rx = Math.max(15 / wz, U(zl.x + zl.w - z.x) / 2 + 7), ry = Math.max(13 / wz, U(z.h) / 2 + 5);
    if(s.state === 'blank'){ const n = document.createElement('span'); n.className = 'nm-ph-note'; n.textContent = t('답 없음', 'No answer', '未作答'); n.style.zoom = String(1 / wz); n.style.left = ((ox + U(z.x)) * wz) + 'px'; n.style.top = ((oy + U(z.y + z.h) + 3) * wz) + 'px'; pg.marks.appendChild(n); return; }
    const verdict = s.set || (s.state === 'ok' ? 'o' : '');
    if(verdict === 'o') stroke(ringPath(cx, cy, rx, ry, i + pg.idx), 'nm-ph-ring');
    if(verdict === 'x') stroke(slashPath(cx, cy, rx, ry, i + pg.idx), 'nm-ph-slash');
    if(s.state !== 'check') return;
    const chip = document.createElement('span'); chip.className = 'nm-ph-chip'; chip.dataset.set = s.set || ''; chip.dataset.i = String(i); chip.style.zoom = String(1 / wz);
    if(res && res.items[i] && res.items[i].crop) chip.appendChild(cropCanvas(res, res.items[i].crop));
    const dl = document.createElement('dl');
    dl.innerHTML = `<dt>${t('정답', 'Answer', '答案')}</dt><dd>${it.a.join(', ')}</dd><dt>${t('읽은 값', 'Read as', '读作')}</dt><dd>${(s.read || []).map(v => v === '' ? '–' : v).join(', ')}</dd>`;
    chip.appendChild(dl);
    chip.insertAdjacentHTML('beforeend', `<button type="button" class="o" aria-label="${t('맞음', 'Correct', '正确')}"><i></i></button><button type="button" class="x" aria-label="${t('틀림', 'Wrong', '错误')}">✕</button>`);
    chip.onclick = e => { const b = e.target.closest('button'); if(!b) return; const v = b.classList.contains('o') ? 'o' : 'x'; s.set = s.set === v ? undefined : v; save(); paint(pg, pg.result); showDock(pg); if(panel && !panel.hidden) renderPanel(); };
    pg.marks.appendChild(chip);
    // 종이는 화면 폭에 맞춰 줄여(zoom) 보여 주므로 칩만 실제 크기로 키우고, 자리 값은 그만큼 나눈다. 오른쪽으로 넘치면 안으로 당긴다
    const left = Math.max(0, Math.min(ox + U(it.rect.x), pg.el.offsetWidth - chip.offsetWidth / wz - 4));
    chip.style.left = (left * wz) + 'px'; chip.style.top = ((oy + U(z.y + z.h) + 9) * wz) + 'px';
  });
  // 점수: 쪽 오른쪽 위에 선생님이 적듯이
  const c = tally(pg);
  if(c.total){ const sc = document.createElement('span'); sc.className = 'nm-ph-score'; sc.textContent = c.ok + '/' + c.total; sc.setAttribute('aria-label', summary(pg));
    sc.style.fontSize = (26 / wz) + 'px'; sc.style.right = U(0.035) + 'px'; sc.style.top = (oy + U(0.085)) + 'px'; pg.marks.appendChild(sc); }
}
const ERR = {
  marks: () => t('종이 네 귀퉁이의 검은 네모가 모두 보이게 다시 찍어 주세요.', 'Retake so all four black corner squares are visible.', '请重新拍摄，让纸张四角的黑色方块都入镜。'),
  turn: () => t('귀퉁이가 잘 안 보여요. 종이 전체가 나오게 다시 찍어 주세요.', 'The corners are hard to see. Retake with the whole page in view.', '四角不清楚，请拍下整张纸。'),
  far: () => t('종이가 너무 작게 찍혔어요. 더 가까이에서 찍어 주세요.', 'The page is too small in the photo. Move closer.', '纸张拍得太小，请靠近一些。'),
  image: () => t('사진을 열지 못했어요. 다시 골라 주세요.', 'Could not open the photo. Choose it again.', '无法打开照片，请重新选择。'),
  load: () => t('채점 도구를 불러오지 못했어요. 인터넷을 확인하고 다시 해 주세요.', 'Could not load the grader. Check your connection and retry.', '无法加载评分工具，请检查网络后重试。')
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
  save(); pg.result = res; paint(pg, res, true);
  return res;
}
/* 「틀림 1 · 확인할 것 2」 — 맞음 수는 점수(11/12)로 따로 보인다 */
function detail(pg){
  const c = tally(pg), parts = [];
  if(c.bad) parts.push(t(`틀림 ${c.bad}`, `${c.bad} wrong`, `错误 ${c.bad}`));
  if(c.check) parts.push(t(`확인할 것 ${c.check}`, `${c.check} to check`, `待确认 ${c.check}`));
  if(c.blank) parts.push(t(`답 없음 ${c.blank}`, `${c.blank} blank`, `未作答 ${c.blank}`));
  return parts.join(' · ');
}
function summary(pg){
  if(!saved.pages[pg.idx]) return '';
  const c = tally(pg), d = detail(pg);
  return t(`${c.total}문제 중 ${c.ok}문제 맞음`, `${c.ok} of ${c.total} correct`, `${c.total}题中答对${c.ok}题`) + (d ? ' · ' + d : '');
}
const HOW_SVG = `<svg width="52" height="66" viewBox="0 0 52 66" aria-hidden="true"><rect x="7" y="6" width="38" height="54" rx="1.5" fill="#fff" stroke="${INK}" stroke-width="1.5"/><rect x="7" y="6" width="9" height="9" fill="${INK}"/><rect x="39" y="6" width="6" height="6" fill="${INK}"/><rect x="39" y="54" width="6" height="6" fill="${INK}"/><rect x="7" y="54" width="6" height="6" fill="${INK}"/><path d="M1 12V3a2 2 0 0 1 2-2h9M40 1h9a2 2 0 0 1 2 2v9M51 54v9a2 2 0 0 1-2 2h-9M12 65H3a2 2 0 0 1-2-2v-9" fill="none" stroke="${NAVY}" stroke-width="2" stroke-linecap="round"/></svg>`;
function renderPanel(msg){
  if(!panel) return;
  const sheet = panel.querySelector('.nm-ph-sheet'); let day = null;
  const rows = pages.map((pg, i) => {
    const head = pg.day && pg.day !== day ? `<div class="nm-ph-day">${pg.day}</div>` : ''; day = pg.day || day;
    const done = !!saved.pages[pg.idx], c = done ? tally(pg) : null, d = done ? detail(pg) : '';
    const right = busy === pg ? `<button type="button" class="nm-ph-btn" disabled>${t('읽는 중', 'Reading', '读取中')}</button>`
      : done ? `<span class="pts" aria-label="${summary(pg)}">${c.ok}/${c.total}</span><button type="button" class="nm-ph-btn quiet" data-go="${i}">${t('보기', 'View', '查看')}</button>`
      : `<button type="button" class="nm-ph-btn" data-shoot="${i}">${t('찍기', 'Take photo', '拍照')}</button>`;
    return `${head}<div class="nm-ph-row"><div class="grow"><b>${pg.pageName} ${pg.title}</b><small>${done ? (d || t('모두 맞았어요', 'All correct', '全部正确')) : t('아직 안 찍었어요', 'Not photographed yet', '尚未拍摄')}${done ? ` <button type="button" class="nm-ph-text" data-shoot="${i}" style="padding:0 0 0 8px;font-size:13px">${t('다시 찍기', 'Retake', '重拍')}</button>` : ''}</small></div>${right}</div>`;
  }).join('');
  sheet.innerHTML = `<div class="nm-ph-top"><h3>${t('사진으로 채점', 'Grade from a photo', '拍照评分')}</h3><button type="button" class="nm-ph-text" data-close="1">${t('닫기', 'Close', '关闭')}</button></div>
    <div class="nm-ph-how">${HOW_SVG}<p>${t('푼 쪽을 한 장씩 찍어 주세요. 네 귀퉁이의 검은 네모가 모두 보여야 해요.', 'Photograph one solved page at a time. All four black corner squares must be in view.', '请一页一页地拍。纸张四角的黑色方块都要拍进去。')}<small>${t('사진은 이 휴대폰에만 있고 어디로도 보내지 않아요.', 'Photos stay on this phone and are never sent anywhere.', '照片只保存在本机，不会发送到任何地方。')}</small></p></div>
    ${msg ? `<p class="nm-ph-say" role="alert">${msg}</p>` : ''}
    ${rows}
    <div class="nm-ph-foot"><button type="button" class="nm-ph-text" data-copy="1">${t('결과 복사', 'Copy results', '复制结果')}</button></div>`;
  if(qs.get('debug') === '1'){ const last = pages.filter(p => p.result).pop(); if(last){ const cv = cropCanvas(last.result, { x: 0, y: 0, w: last.result.W, h: last.result.H }); cv.className = 'nm-ph-debug'; sheet.appendChild(cv); } }
}
/* 아래 줄: 방금 본 쪽의 결과 + 다음에 할 일 하나 */
function showDock(pg, note){
  if(!saved.pages[pg.idx]){ if(dock) dock.hidden = true; return; }
  if(!dock){ dock = document.createElement('div'); dock.className = 'nm-ph-dock'; document.body.appendChild(dock);
    dock.onclick = e => { const b = e.target.closest('button'); if(!b) return; if(b.dataset.next != null) shoot(pages[+b.dataset.next]); else if(b.dataset.list) openPanel(); }; }
  const c = tally(pg), d = detail(pg), nextIdx = pages.findIndex((p, i) => i > pages.indexOf(pg) && !saved.pages[p.idx]);
  const sub = note || (c.check ? t('동그라미가 없는 답을 보고 맞음·틀림을 눌러 주세요.', 'For answers without a circle, tap correct or wrong.', '没有圆圈的答案，请点选对或错。') : d);
  dock.innerHTML = `<div class="grow"><b>${t(`${c.total}문제 중 ${c.ok}문제 맞음`, `${c.ok} of ${c.total} correct`, `${c.total}题中答对${c.ok}题`)}</b>${sub ? `<small>${sub}</small>` : ''}</div>
    <button type="button" class="nm-ph-btn quiet" data-list="1">${t('목록', 'List', '列表')}</button>
    ${nextIdx >= 0 ? `<button type="button" class="nm-ph-btn" data-next="${nextIdx}">${t('다음 쪽 찍기', 'Next page', '拍下一页')}</button>` : ''}`;
  dock.hidden = false;
}
function ensureInput(){
  if(input) return;
  input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*'; input.setAttribute('capture', 'environment'); input.hidden = true; input.id = 'nmPhotoInput'; document.body.appendChild(input);
  input.onchange = async () => {
    const f = input.files && input.files[0], pg = target; if(!f || !pg) return;
    busy = pg; openPanel(); renderPanel();
    let res; try{ res = await gradePhoto(pg, f); }catch(e){ res = { error: e && e.message === 'image' ? 'image' : 'load' }; }
    busy = null;
    if(res.error){ renderPanel(ERR[res.error]()); return; }
    panel.hidden = true; goTo(pg);
    showDock(pg, res.quality.low ? t('사진이 흐리거나 멀어요. 잘못 읽은 것이 많으면 더 가까이, 밝은 곳에서 다시 찍어 주세요.', 'The photo looks blurry or far away. If many answers were misread, retake closer in better light.', '照片较模糊或距离较远。如误读较多，请在明亮处靠近重拍。') : '');
  };
}
function shoot(pg){ ensureInput(); target = pg; input.value = ''; input.click(); }
/* 그 쪽으로 간다 — 붙어 있는 위 막대에 쪽 머리(점수)가 가리지 않게 막대 높이만큼 비켜서 */
function goTo(pg){ const bar = document.getElementById('wsBar'), off = (bar ? bar.getBoundingClientRect().height : 0) + 8; window.scrollTo(0, window.scrollY + pg.el.getBoundingClientRect().top - off); }
function openPanel(){
  ensureInput();
  if(!panel){
    panel = document.createElement('div'); panel.className = 'nm-ph-panel'; panel.innerHTML = '<div class="nm-ph-sheet" role="dialog" aria-modal="true"></div>';
    panel.onclick = e => {
      if(e.target === panel){ panel.hidden = true; return; }
      const b = e.target.closest('button'); if(!b) return;
      if(b.dataset.close){ panel.hidden = true; }
      else if(b.dataset.shoot != null){ shoot(pages[+b.dataset.shoot]); }
      else if(b.dataset.go != null){ const pg = pages[+b.dataset.go]; panel.hidden = true; paint(pg, pg.result); goTo(pg); showDock(pg); }
      else if(b.dataset.copy){ const txt = JSON.stringify({ sheet: KEY, pages: pages.map(pg => ({ label: pg.label, saved: saved.pages[pg.idx] || null, answers: pg.geom.items.map(i => i.a) })) }); (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { b.textContent = t('복사했어요', 'Copied', '已复制'); }, () => { prompt(t('아래 글을 복사해 주세요', 'Copy the text below', '请复制以下文字'), txt); }); }
    };
    document.body.appendChild(panel);
  }
  panel.hidden = false; renderPanel();
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
  host.classList.add('has-photo');
  pages.forEach(pg => paint(pg, null));
  let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => pages.forEach(pg => paint(pg, pg.result)), 150); });
}
window.NM_PHOTO_GRADE = { mount, analyze, findMarks, homography, normalize, toGray, readZone, _pages: () => pages, _geometry: geometry, _grade: gradePhoto, _saved: () => saved };
})();
