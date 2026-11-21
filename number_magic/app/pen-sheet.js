/* ============================================================
   Numbers of Magic — 주간 학습지 펜으로 풀기 · 바로 채점 (app/pen-sheet.js, 2026-11-16)
   원장 「태블릿에서 펜으로 풀고 바로 채점되는 기능」 → 「주간 학습지 그대로」.

   ws.html 위 막대의 「펜으로 풀기」를 누르면 학습지 쪽마다 투명한 종이를 얹는다.
     · 펜(애플 펜슬·S펜)이나 손가락으로 쓴다. 펜을 한 번이라도 쓰면 그다음부터 손가락·손바닥은 글씨로 안 친다
       (손바닥이 닿아 생기는 낙서를 막는다). 두 손가락은 언제나 화면 넘기기.
     · 쓴 것은 이 기기에 학습지마다 저장된다(localStorage). 아무 데도 보내지 않는다.
   「채점하기」:
     · 정답이 정수인 문항(exam.js penAnswerSpec → 칸의 data-pen-ans)은 답 칸(네모)에 쓴 글씨를 읽는다
       (app/pen-digits.js). 네모가 없으면 그 문항 칸의 맨 아랫줄 글씨(세로셈의 답 줄, 「답:」 줄)를 읽는다.
     · 맞으면 빨간 ○, 다르면 ✕와 함께 「○○로 읽었어요 · 고치기」 — 잘못 읽었으면 아이가 눌러 고친다.
       자신 없게 읽은 것은 ○✕를 하지 않고 「다시 읽기」로 묻는다. 아무것도 안 쓴 문항은 「답 없음」.
     · 분수·식·그림·고르기 답은 「스스로 ○✕」 — 학습지 맨 뒤 정답지와 비교해 아이가 눌러 표시한다.
   인쇄·PDF에는 펜 글씨와 채점 표시가 나오지 않는다(@media print 에서 숨김).
   ============================================================ */
(function(){
'use strict';
/* 숫자 읽기(모델 73KB)는 처음 「펜으로 풀기」를 누를 때만 받는다 — 보거나 인쇄만 하는 사람은 안 받는다 */
const PEN_V = '20261116-pen1';
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
const qs = new URLSearchParams(location.search);
const lang = ['en', 'zh'].includes(qs.get('l')) ? qs.get('l') : 'ko';
const t = (ko, en, zh) => lang === 'en' ? en : lang === 'zh' ? zh : ko;
const KEY = (() => { const p = new URLSearchParams(location.search); p.delete('auto'); p.delete('l'); return 'nm_pen_v1:' + p.toString(); })();
const INK = '#1b2340', RED = '#d93025';

let on = false, tool = 'pen', penSeen = false, pages = [], data = load(), undo = [], results = {};
function load(){ try{ const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if(v && v.pages) return { pages: v.pages, fix: v.fix || {}, self: v.self || {} }; }catch(e){} return { pages: {}, fix: {}, self: {} }; }
let saveT = 0;
function save(){ clearTimeout(saveT); saveT = setTimeout(() => { try{ localStorage.setItem(KEY, JSON.stringify(data)); }catch(e){ note(t('이 기기에 저장 공간이 모자라 펜 글씨를 저장하지 못했어요.', 'Not enough storage to keep the pen writing.', '存储空间不足，无法保存笔迹。')); } }, 300); }

/* ---------- 화면 틀 ---------- */
function css(){
  if(document.getElementById('nmPenCss')) return;
  const st = document.createElement('style'); st.id = 'nmPenCss';
  st.textContent = `
  .nm-pen-layer{position:absolute;inset:0;z-index:4;touch-action:none;cursor:crosshair}
  .nm-pen-layer canvas{position:absolute;left:0;top:0;width:100%;height:100%}
  .nm-pen-marks{position:absolute;inset:0;z-index:5;pointer-events:none}
  .nm-pen-ring{position:absolute;border:3px solid ${RED};border-radius:50%;opacity:.9}
  .nm-pen-x{position:absolute;color:${RED};font:900 30px/1 system-ui,sans-serif}
  .nm-pen-chip{position:absolute;pointer-events:auto;max-width:46mm;padding:3px 8px;border-radius:999px;border:1.5px solid #c9d6ef;background:#fff;color:#1b2340;font:700 12px/1.35 Pretendard,system-ui,sans-serif;box-shadow:0 2px 8px rgba(20,27,93,.15);cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .nm-pen-chip.x{border-color:#f0b4ae;color:#a3261b}
  .nm-pen-chip.ask{border-color:#e9c46a;background:#fff8e1;color:#6b4e00}
  .nm-pen-chip.blank{color:#6b7280}
  .nm-pen-chip.self{border-style:dashed}
  .nm-pen-chip.self[data-mark=o]{border:2px solid ${RED};color:${RED}}
  .nm-pen-chip.self[data-mark=x]{border:2px solid ${RED};color:${RED};background:#fff1f0}
  .nm-pen-bar{position:fixed;left:0;right:0;margin:0 auto;width:max-content;bottom:max(10px,env(safe-area-inset-bottom));z-index:30;display:flex;flex-wrap:wrap;justify-content:center;gap:6px;max-width:calc(100vw - 20px);padding:8px;border-radius:18px;background:#fff;border:1px solid #e0e9f8;box-shadow:0 8px 28px rgba(20,27,93,.22);font-family:Pretendard,system-ui,sans-serif}
  .nm-pen-bar button{min-height:44px;min-width:44px;padding:6px 12px;border:1px solid #e0e9f8;border-radius:12px;background:#f2f6fd;color:#1b2340;font:800 15px/1 inherit;cursor:pointer}
  .nm-pen-bar button[aria-pressed=true]{background:#243184;border-color:#243184;color:#fff}
  .nm-pen-bar .nm-pen-grade{background:#243184;color:#fff;border-color:#243184}
  .nm-pen-bar button:focus-visible,.nm-pen-chip:focus-visible{outline:3px solid #2a6df4;outline-offset:2px}
  .nm-pen-sum{position:fixed;top:64px;left:0;right:0;margin:0 auto;width:max-content;z-index:31;padding:10px 16px;border-radius:14px;background:#fff;border:1px solid #e0e9f8;box-shadow:0 8px 28px rgba(20,27,93,.2);color:#1b2340;font:700 15px/1.5 Pretendard,system-ui,sans-serif;text-align:center;max-width:calc(100vw - 24px)}
  .nm-pen-sum b{color:#243184}
  .nm-pen-pad{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:rgba(20,27,64,.35)}
  .nm-pen-pad form{width:min(92vw,340px);padding:18px;border-radius:18px;background:#fff;box-shadow:0 12px 40px rgba(20,27,93,.3);font-family:Pretendard,system-ui,sans-serif;color:#1b2340}
  .nm-pen-pad p{margin:0 0 10px;line-height:1.5;word-break:keep-all}
  .nm-pen-pad input{width:100%;box-sizing:border-box;font:800 28px/1.2 inherit;padding:10px;border:2px solid #c9d6ef;border-radius:12px;text-align:center}
  .nm-pen-pad .row{display:flex;gap:8px;margin-top:12px}
  .nm-pen-pad button{flex:1;min-height:46px;border-radius:12px;border:1px solid #e0e9f8;background:#f2f6fd;font:800 16px inherit;color:#1b2340}
  .nm-pen-pad button[type=submit]{background:#243184;color:#fff;border-color:#243184}
  body.nm-pen-on .ws-bar{z-index:32}
  body.nm-pen-on{padding-bottom:96px}
  @media print{.nm-pen-layer,.nm-pen-marks,.nm-pen-bar,.nm-pen-sum,.nm-pen-pad{display:none!important}}`;
  document.head.appendChild(st);
}

/* ---------- 쪽마다 종이 ---------- */
function unitScale(pg){ const r = pg.el.getBoundingClientRect(); return pg.el.offsetWidth / (r.width || 1); }
function toUnits(pg, e){ const r = pg.el.getBoundingClientRect(), k = pg.el.offsetWidth / (r.width || 1); return [Math.round((e.clientX - r.left) * k * 10) / 10, Math.round((e.clientY - r.top) * k * 10) / 10]; }
function rectUnits(pg, el){
  const r = pg.el.getBoundingClientRect(), e = el.getBoundingClientRect(), k = pg.el.offsetWidth / (r.width || 1);
  return { x: (e.left - r.left) * k, y: (e.top - r.top) * k, w: e.width * k, h: e.height * k };
}
function setupPage(el, idx){
  const layer = document.createElement('div'); layer.className = 'nm-pen-layer';
  const cv = document.createElement('canvas'); layer.appendChild(cv);
  const marks = document.createElement('div'); marks.className = 'nm-pen-marks';
  el.appendChild(layer); el.appendChild(marks);
  const pg = { el, idx, layer, cv, marks, ctx: cv.getContext('2d'), k: 1 };
  if(!data.pages[idx]) data.pages[idx] = [];
  bindPointers(pg);
  return pg;
}
function sizeCanvas(pg){
  const r = pg.el.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if(pg.cv.width !== w || pg.cv.height !== h){ pg.cv.width = w; pg.cv.height = h; }
  pg.k = w / (pg.el.offsetWidth || 1);
  redraw(pg);
}
function strokePath(ctx, s){
  const p = s.p; if(!p.length) return;
  ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
  if(p.length === 1) ctx.lineTo(p[0][0] + 0.1, p[0][1]);
  for(let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
  ctx.stroke();
}
function redraw(pg){
  const c = pg.ctx; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, pg.cv.width, pg.cv.height);
  c.setTransform(pg.k, 0, 0, pg.k, 0, 0); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = INK; c.lineWidth = 2.2;
  data.pages[pg.idx].forEach(s => strokePath(c, s));
}

/* ---------- 펜·손가락 ---------- */
let pan = null;
function bindPointers(pg){
  const touches = new Map(); let cur = null, curId = null, lastPen = 0;
  const L = pg.layer;
  L.addEventListener('pointerdown', e => {
    if(!on) return;
    if(e.pointerType === 'pen'){ penSeen = true; lastPen = Date.now(); if(pan){ pan = null; } }
    if(e.pointerType === 'touch'){
      touches.set(e.pointerId, [e.clientX, e.clientY]);
      if(touches.size >= 2){ if(cur && cur.touch){ cur = null; curId = null; redraw(pg); } pan = { pts: new Map(touches) }; return; }
      if(penSeen){ if(Date.now() - lastPen > 600) pan = { pts: new Map(touches) }; return; }   // 펜을 쓰는 아이: 손가락 한 개는 넘기기
    }
    if(e.button > 0) return;
    e.preventDefault(); try{ L.setPointerCapture(e.pointerId); }catch(err){}
    if(tool === 'erase'){ curId = e.pointerId; cur = { erase: true, removed: [] }; eraseAt(pg, toUnits(pg, e), cur); return; }
    curId = e.pointerId; cur = { p: [toUnits(pg, e)], touch: e.pointerType === 'touch' };
    const c = pg.ctx; c.setTransform(pg.k, 0, 0, pg.k, 0, 0); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = INK; c.lineWidth = 2.2;
  }, { passive: false });
  L.addEventListener('pointermove', e => {
    if(!on) return;
    if(e.pointerType === 'touch' && touches.has(e.pointerId)){
      const prev = touches.get(e.pointerId); touches.set(e.pointerId, [e.clientX, e.clientY]);
      if(pan){ const n = Math.max(1, touches.size); window.scrollBy(-(e.clientX - prev[0]) / n, -(e.clientY - prev[1]) / n); return; }
    }
    if(e.pointerId !== curId || !cur) return;
    e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if(cur.erase){ evs.forEach(ev => eraseAt(pg, toUnits(pg, ev), cur)); return; }
    const c = pg.ctx;
    evs.forEach(ev => {
      const q = toUnits(pg, ev), last = cur.p[cur.p.length - 1];
      if(Math.abs(q[0] - last[0]) + Math.abs(q[1] - last[1]) < 0.6) return;
      c.beginPath(); c.moveTo(last[0], last[1]); c.lineTo(q[0], q[1]); c.stroke(); cur.p.push(q);
    });
  }, { passive: false });
  const end = e => {
    if(e.pointerType === 'touch'){ touches.delete(e.pointerId); if(!touches.size) pan = null; }
    if(e.pointerId !== curId || !cur) return;
    const done = cur; cur = null; curId = null;
    if(done.erase){ if(done.removed.length){ undo.push({ type: 'erase', page: pg.idx, items: done.removed }); save(); staleAround(pg, done.removed.map(r => r.s)); } return; }
    if(e.type === 'pointercancel'){ redraw(pg); return; }
    data.pages[pg.idx].push({ p: done.p }); undo.push({ type: 'add', page: pg.idx }); save();
    staleAround(pg, [{ p: done.p }]);
  };
  L.addEventListener('pointerup', end); L.addEventListener('pointercancel', end);
  // iPad 사파리: 펜슬로 끌면 화면이 같이 움직이는 것을 막는다
  L.addEventListener('touchstart', e => { if(on && [...e.touches].some(x => x.touchType === 'stylus')) e.preventDefault(); }, { passive: false });
}
function eraseAt(pg, q, cur){
  const list = data.pages[pg.idx], R = 9;
  for(let i = list.length - 1; i >= 0; i--){
    if(list[i].p.some(([x, y]) => Math.abs(x - q[0]) < R && Math.abs(y - q[1]) < R)){
      cur.removed.push({ i, s: list[i] }); list.splice(i, 1);
    }
  }
  if(cur.removed.length) redraw(pg);
}
function doUndo(){
  const a = undo.pop(); if(!a) return;
  const pg = pages[a.page], list = data.pages[a.page];
  if(a.type === 'add') staleAround(pg, [list.pop()]);
  else if(a.type === 'erase') a.items.slice().reverse().forEach(r => list.splice(r.i, 0, r.s));
  else if(a.type === 'clear') data.pages[a.page] = a.items;
  redraw(pg); save();
}

/* ---------- 채점 ---------- */
function items(pg){ return [...pg.el.querySelectorAll('.nm-w2-item[data-pen-ans]')]; }
function itemKey(pg, i){ return pg.idx + ':' + i; }
function sb(p){ let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; p.forEach(([x, y]) => { if(x < x0) x0 = x; if(x > x1) x1 = x; if(y < y0) y0 = y; if(y > y1) y1 = y; }); return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 }; }
function centerIn(s, r, pad){ const b = sb(s.p); const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2; return cx >= r.x - pad && cx <= r.x + r.w + pad && cy >= r.y - pad && cy <= r.y + r.h + pad; }
function overlapRatio(s, r){
  const b = sb(s.p), w = Math.max(1, b.w), h = Math.max(1, b.h);
  const ix = Math.min(b.x1 + 0.5, r.x + r.w) - Math.max(b.x0 - 0.5, r.x), iy = Math.min(b.y1 + 0.5, r.y + r.h) - Math.max(b.y0 - 0.5, r.y);
  return ix > 0 && iy > 0 ? (ix * iy) / ((w + 1) * (h + 1)) : 0;
}
function grow(r, k){ const dx = r.w * k, dy = r.h * k; return { x: r.x - dx, y: r.y - dy, w: r.w + 2 * dx, h: r.h + 2 * dy }; }
/* 한 문항: 읽을 획 고르기 → 읽기 */
function readItem(pg, el, spec){
  const box = rectUnits(pg, el), mine = data.pages[pg.idx].filter(s => centerIn(s, box, 2));
  if(!mine.length) return { blank: true };
  const pts = s => s.p;
  const boxes = [...el.querySelectorAll('.fbox')].map(b => grow(rectUnits(pg, b), 0.45));
  let groups = null;
  if(boxes.length){
    const by = boxes.map(() => []);
    mine.forEach(s => { let best = -1, bv = 0.25; boxes.forEach((r, i) => { const v = overlapRatio(s, r); if(v > bv){ bv = v; best = i; } }); if(best >= 0) by[best].push(s); });
    if(spec.a.length > 1 && boxes.length === spec.a.length && by.every(g => g.length)) groups = by;
    else if(by.some(g => g.length)) groups = [by.flat()];
  }
  if(!groups){
    const line = el.querySelector('.nm-print-word-blank, .nm-print-solve-ans');
    if(line){ const r = grow(rectUnits(pg, line), 0.35), g = mine.filter(s => overlapRatio(s, r) > 0.25); if(g.length) groups = [g]; }
  }
  if(!groups){ const rows = D.rows(mine.map(pts)), low = rows.reduce((a, b) => b.y1 > a.y1 ? b : a); groups = [low.strokes.map(p => ({ p }))]; }
  const reads = groups.map(g => D.readNumber(g.map(pts)));
  if(reads.some(r => !r)) return { blank: true };
  const at = sb(groups.flat().flatMap(pts));   // 읽은 글씨 자리 — 표시를 그 옆에 붙인다
  return { reads, at, text: reads.map(r => r.text).join(', '), conf: Math.min.apply(null, reads.map(r => r.conf)) };
}
function judge(spec, values){ return values.length === spec.a.length && values.every((v, i) => v === spec.a[i]); }
function grade(){
  let o = 0, x = 0, ask = 0, blank = 0, self = 0;
  results = {};
  pages.forEach(pg => {
    pg.marks.innerHTML = '';
    // 아무것도 안 쓴 쪽은 채점하지 않는다(아직 안 푼 쪽에 「답 없음」이 줄줄이 붙지 않게)
    if(!data.pages[pg.idx].length && !items(pg).some((el, i) => data.fix[itemKey(pg, i)] || data.self[itemKey(pg, i)])) return;
    items(pg).forEach((el, i) => {
      const key = itemKey(pg, i); let spec; try{ spec = JSON.parse(el.dataset.penAns); }catch(e){ spec = { self: 1 }; }
      let res;
      if(spec.self){ res = { self: true, mark: data.self[key] || '' }; self++; }
      else if(data.fix[key]){ const v = data.fix[key], rr = readItem(pg, el, spec); res = { fixed: true, text: v.join(', '), ok: judge(spec, v), at: rr.at }; res.ok ? o++ : x++; }
      else{
        const r = readItem(pg, el, spec);
        if(r.blank){ res = { blank: true }; blank++; }
        else if(r.conf < 0.6){ res = { ask: true, text: r.text, at: r.at }; ask++; }
        else{ res = { text: r.text, at: r.at, ok: judge(spec, r.reads.map(v => v.value)) }; res.ok ? o++ : x++; }
      }
      res.spec = spec; results[key] = res; paintMark(pg, el, key, res);
    });
  });
  summary(o, x, ask, blank, self);
}
function paintMark(pg, el, key, res){
  pg.marks.querySelectorAll(`[data-key="${key}"]`).forEach(n => n.remove());
  const r = rectUnits(pg, el), add = (cls, css, html) => { const n = document.createElement(cls === 'chip' ? 'button' : 'div'); n.dataset.key = key; n.className = cls === 'chip' ? 'nm-pen-chip' : cls; Object.assign(n.style, css); if(html != null) n.innerHTML = html; pg.marks.appendChild(n); return n; };
  const num = el.querySelector('.nm-w2-num'), nr = num ? rectUnits(pg, num) : { x: r.x, y: r.y, w: 18, h: 14 };
  if(res.ok === true) add('nm-pen-ring', { left: (nr.x - 9) + 'px', top: (nr.y - 10) + 'px', width: (nr.w + 18) + 'px', height: (nr.h + 20) + 'px' });
  if(res.ok === false) add('nm-pen-x', { left: (nr.x - 4) + 'px', top: (nr.y - 12) + 'px' }, '✕');
  let label, cls = '';
  if(res.self){ label = res.mark === 'o' ? t('○ 스스로 맞음', '○ marked right', '○ 自评正确') : res.mark === 'x' ? t('✕ 스스로 틀림', '✕ marked wrong', '✕ 自评错误') : t('정답지와 비교해 ○✕', 'Check the answer key: ○/✕', '对照答案 ○✕'); cls = 'self'; }
  else if(res.blank){ label = t('답 없음', 'No answer', '未作答'); cls = 'blank'; }
  else if(res.ask){ label = t(`${res.text}? · 다시 읽기`, `${res.text}? · confirm`, `${res.text}？· 确认`); cls = 'ask'; }
  else if(res.ok){ label = res.fixed ? t(`${res.text} (고침)`, `${res.text} (fixed)`, `${res.text}（已改）`) : res.text; }
  else{ label = t(`${res.text}로 읽었어요 · 고치기`, `Read as ${res.text} · fix`, `识别为 ${res.text} · 修改`); cls = 'x'; }
  // 읽은 글씨가 있으면 그 오른쪽(자리가 없으면 왼쪽)에, 없으면 문항 칸 오른쪽 위에 붙인다
  const at = res.at, pw = pg.el.offsetWidth;
  const pos = at ? (at.x1 + 140 < pw ? { left: (at.x1 + 6) + 'px', top: ((at.y0 + at.y1) / 2 - 12) + 'px' } : { left: (at.x0 - 6) + 'px', top: ((at.y0 + at.y1) / 2 - 12) + 'px', transform: 'translateX(-100%)' })
    : { left: (nr.x + nr.w + 8) + 'px', top: (nr.y - 5) + 'px' };   // 글씨가 없으면 문항 번호 바로 옆
  const chip = add('chip', pos, null);
  chip.type = 'button'; chip.textContent = label; if(cls) chip.classList.add(cls); if(res.self) chip.dataset.mark = res.mark || '';
  chip.onclick = () => res.self ? cycleSelf(pg, el, key) : askFix(pg, el, key, res);
}
function cycleSelf(pg, el, key){
  const m = data.self[key] || ''; data.self[key] = m === '' ? 'o' : m === 'o' ? 'x' : ''; save();
  results[key] = { self: true, mark: data.self[key], spec: results[key]?.spec }; paintMark(pg, el, key, results[key]); recount();
}
function askFix(pg, el, key, res){
  const spec = res.spec, many = spec.a.length > 1;
  const wrap = document.createElement('div'); wrap.className = 'nm-pen-pad';
  wrap.innerHTML = `<form><p>${many ? t(`쓴 답을 차례대로 넣어 주세요(칸마다 쉼표).`, 'Type what you wrote, in order (comma between boxes).', '按顺序输入你写的答案（每格用逗号隔开）。') : t('내가 쓴 답을 넣어 주세요.', 'Type the answer you wrote.', '请输入你写的答案。')}</p>
    <input inputmode="${many ? 'text' : 'numeric'}" autocomplete="off" aria-label="${t('내가 쓴 답', 'My answer', '我的答案')}" value="${res.text ? String(res.text).replace(/[^\d,\- ]/g, '') : ''}">
    <div class="row"><button type="button" data-act="cancel">${t('그만두기', 'Cancel', '取消')}</button><button type="submit">${t('이걸로 채점', 'Grade this', '用这个评分')}</button></div></form>`;
  document.body.appendChild(wrap);
  const input = wrap.querySelector('input'); input.focus(); input.select();
  wrap.querySelector('[data-act=cancel]').onclick = () => wrap.remove();
  wrap.onclick = e => { if(e.target === wrap) wrap.remove(); };
  wrap.querySelector('form').onsubmit = e => {
    e.preventDefault();
    const v = input.value.split(/[,\s]+/).filter(Boolean).map(Number);
    if(!v.length || v.some(n => !Number.isInteger(n))){ input.setCustomValidity(t('정수만 넣어 주세요.', 'Whole numbers only.', '请只输入整数。')); input.reportValidity(); return; }
    data.fix[key] = v; save(); wrap.remove();
    const r = { fixed: true, text: v.join(', '), ok: judge(spec, v), spec, at: res.at }; results[key] = r; paintMark(pg, el, key, r); recount();
  };
}
function recount(){
  let o = 0, x = 0, ask = 0, blank = 0, self = 0;
  Object.values(results).forEach(r => { if(r.self) self++; else if(r.blank) blank++; else if(r.ask) ask++; else if(r.ok) o++; else x++; });
  summary(o, x, ask, blank, self);
}
function summary(o, x, ask, blank, self){
  let el = document.getElementById('nmPenSum');
  if(!el){ el = document.createElement('div'); el.id = 'nmPenSum'; el.className = 'nm-pen-sum'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  const auto = o + x;
  el.innerHTML = t(`<b>맞음 ${o}</b> / 읽어서 채점 ${auto}` + (ask ? ` · 다시 읽기 ${ask}` : '') + (blank ? ` · 답 없음 ${blank}` : '') + (self ? ` · 스스로 ○✕ ${self}` : '') + `<br><small>✕가 잘못 읽은 것이면 눌러서 고쳐요.</small>`,
    `<b>${o} right</b> / ${auto} read` + (ask ? ` · confirm ${ask}` : '') + (blank ? ` · blank ${blank}` : '') + (self ? ` · self-check ${self}` : '') + `<br><small>If a ✕ was misread, tap it to fix.</small>`,
    `<b>正确 ${o}</b> / 自动评分 ${auto}` + (ask ? ` · 待确认 ${ask}` : '') + (blank ? ` · 未作答 ${blank}` : '') + (self ? ` · 自评 ${self}` : '') + `<br><small>如果 ✕ 是识别错误，点一下修改。</small>`);
  placeSum(el); clearTimeout(summary.t); el.hidden = false; summary.t = setTimeout(() => { el.hidden = true; }, 6000);
}
function placeSum(el){ const b = document.getElementById('wsBar'); el.style.top = ((b ? b.getBoundingClientRect().bottom : 0) + 8) + 'px'; }
/* 채점한 뒤에 그 문항에 더 쓰거나 지우면 그 문항의 채점 표시를 걷는다(다시 「채점하기」) */
function staleAround(pg, strokes){
  if(!Object.keys(results).length) return;
  items(pg).forEach((el, i) => {
    const key = itemKey(pg, i); if(!results[key] || results[key].self) return;
    const r = rectUnits(pg, el);
    if(strokes.some(s => s && centerIn(s, r, 2))){ delete results[key]; delete data.fix[key]; pg.marks.querySelectorAll(`[data-key="${key}"]`).forEach(n => n.remove()); }
  });
}

/* ---------- 막대 ---------- */
let bar = null;
function note(msg){ const el = document.getElementById('nmPenSum') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'nmPenSum', className: 'nm-pen-sum' })); el.textContent = msg; placeSum(el); el.hidden = false; clearTimeout(summary.t); summary.t = setTimeout(() => { el.hidden = true; }, 5000); }
function currentPage(){ let best = pages[0], bd = Infinity; const mid = innerHeight / 2; pages.forEach(pg => { const r = pg.el.getBoundingClientRect(); const d = r.top <= mid && r.bottom >= mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if(d < bd){ bd = d; best = pg; } }); return best; }
function buildBar(){
  bar = document.createElement('div'); bar.className = 'nm-pen-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', t('펜 도구', 'Pen tools', '笔工具'));
  const B = (id, label, title) => `<button type="button" data-pen="${id}" title="${title || label}">${label}</button>`;
  bar.innerHTML = B('pen', t('펜', 'Pen', '笔')) + B('erase', t('지우개', 'Eraser', '橡皮')) + B('undo', t('되돌리기', 'Undo', '撤销'))
    + B('clear', t('이 쪽 지우기', 'Clear page', '清空本页')) + `<button type="button" class="nm-pen-grade" data-pen="grade">${t('채점하기', 'Grade', '评分')}</button>` + B('off', t('펜 끄기', 'Pen off', '关闭笔'));
  bar.onclick = e => {
    const b = e.target.closest('[data-pen]'); if(!b) return;
    const a = b.dataset.pen;
    if(a === 'pen' || a === 'erase'){ tool = a; paintTools(); }
    else if(a === 'undo') doUndo();
    else if(a === 'clear'){ const pg = currentPage(); if(!pg || !data.pages[pg.idx].length) return; if(!confirm(t('이 쪽에 쓴 것을 모두 지울까요?', 'Clear everything written on this page?', '要清空本页的笔迹吗？'))) return; undo.push({ type: 'clear', page: pg.idx, items: data.pages[pg.idx] }); data.pages[pg.idx] = []; redraw(pg); pg.marks.innerHTML = ''; Object.keys(results).filter(k => k.startsWith(pg.idx + ':')).forEach(k => delete results[k]); save(); }
    else if(a === 'grade'){ b.disabled = true; loadDigits().then(grade, () => note(t('채점 도구를 불러오지 못했어요. 인터넷을 확인하고 다시 눌러 주세요.', 'Could not load the grader. Check the connection and try again.', '无法加载评分工具，请检查网络后重试。'))).finally(() => { b.disabled = false; }); }
    else if(a === 'off') setOn(false);
  };
  document.body.appendChild(bar); paintTools();
}
function paintTools(){ if(bar) bar.querySelectorAll('[data-pen=pen],[data-pen=erase]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pen === tool))); }
function setOn(v){
  on = !!v; document.body.classList.toggle('nm-pen-on', on);
  const btn = document.getElementById('wsPen'); if(btn){ btn.setAttribute('aria-pressed', String(on)); btn.textContent = on ? t('펜 끄기', 'Pen off', '关闭笔') : t('펜으로 풀기', 'Solve with pen', '用笔作答'); }
  if(on && !pages.length){
    css();
    pages = [...document.querySelectorAll('body>.nm-print-sheet .nm-w2-page')].map(setupPage);
    pages.forEach(sizeCanvas);
    let rt = 0; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => pages.forEach(sizeCanvas), 150); });
  }
  pages.forEach(pg => { pg.layer.style.display = on ? '' : 'none'; pg.marks.style.display = on ? '' : 'none'; });
  if(on && !bar) buildBar();
  if(on) loadDigits().catch(() => {});
  if(bar) bar.hidden = !on;
  if(!on){ const s = document.getElementById('nmPenSum'); if(s) s.hidden = true; }
}
/* ws.html 이 학습지를 다 그린 뒤 부른다 */
function mount(){
  if(document.getElementById('wsPen')) return;
  if(!document.querySelector('body>.nm-print-sheet .nm-w2-page')) return;
  const host = document.getElementById('wsBar'); if(!host) return;
  const b = document.createElement('button'); b.type = 'button'; b.id = 'wsPen'; b.className = 'ws-pen'; b.setAttribute('aria-pressed', 'false');
  b.textContent = t('펜으로 풀기', 'Solve with pen', '用笔作答');
  b.onclick = () => setOn(!on);
  const print = document.getElementById('wsPrint'); host.insertBefore(b, print || null);
  // 이 학습지에 펜 글씨가 남아 있으면 바로 펜 화면으로
  if(Object.values(data.pages).some(l => l && l.length)) setOn(true);
}
window.NM_PEN_SHEET = { mount, grade, setOn, _state: () => ({ data, results, penSeen }) };
})();
