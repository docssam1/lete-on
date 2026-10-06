/* ============================================================
   G1-4·5·6호 인쇄 — window.NM_NL_PRINT['위젯이름'] = { visual(p,K), label(p,K), ask(p,K) }
   K = exam.js nlPrintKit(): { nlCard, nlStage, nlAnsBox, nlObjHtml, nlGlyphRows, esc, lk, pickL, EA, NL_CIRC … }
   · visual: 그림(문항 카드 안쪽). 모르는 위젯은 빈 문자열이 되어 카드가 비므로 위젯마다 반드시 분기가 있다.
   · label : 정답지에 찍을 말(null 이면 숫자 그대로).
   · ask   : 물음 줄. 생성기가 실어 준 printAsk(인쇄용 문구: 톡톡·콕 → ○표·그려요)를 그대로 쓴다.
   인쇄는 흑백 레이저도 고려해 선이 또렷하고, 한 장 지면을 넘지 않게(장면판 60×34mm 기준) 작게 그린다.
   새 클래스는 nm-nl-g46- 접두 — 필요한 CSS 는 이 파일이 <style> 로 직접 넣는다.
   ============================================================ */
(function () {
  'use strict';
  window.NM_NL_PRINT = window.NM_NL_PRINT || {};
  const NP = window.NM_NL_PRINT;

  /* ── CSS ─────────────────────────────────────────────── */
  (function addCss() {
    const st = document.createElement('style');
    st.setAttribute('data-nm-g46-print', '1');
    st.textContent = `
  /* 2026-10-05 원장 "너무 흑백이야" — 화면 위젯(4-6.css)과 같은 팔레트로 인쇄한다.
     글자 #0E2C57(--blue-deep) · 고대 기호/길 숫자 #16417c · 종이 #fffaf0 · 칸 테두리 #C9A063(--gold-deep)
     · 구조선(가르기 모형·막대·동그라미) #8a6a2f · 빈칸 점선 #C9A063 + #fff8e6 · 표시 칸 #ffe28c
     · 수 기계 + 칸 #eef6ff/#9fc4ee, − 칸 #fff0ee/#eeb1a8 · 가르기 두 색 #e53935/#3b8fe0.
     흑백 레이저: 글자는 진한 남색, 칸 선은 중간 회색 이상, 표시 칸 채움은 예전 회색(#d9d9d9)과 같은 밝기.
     파랑(#3b8fe0)과 빨강(#e53935)은 흑백에서 회색 밝기가 거의 같아, 파랑 쪽에만 흰 빗금을 넣어 구분한다. */
  .nm-nl-g46-t { display:inline-block; font-size:17px; line-height:1; vertical-align:middle; }
  .nm-nl-g46-t svg { display:block; width:1em; height:1em; }
  .nm-nl-g46-t.sm { font-size:15px; }
  .nm-nl-g46-row { display:flex; justify-content:center; align-items:center; gap:1.2mm; flex-wrap:wrap; }
  .nm-nl-g46-col { display:flex; flex-direction:column; align-items:center; gap:1.2mm; }
  .nm-nl-g46-text { font-size:12px; font-weight:700; text-align:center; line-height:1.25; color:#0E2C57; }
  .nm-nl-g46-eq { font-size:20px; font-weight:800; letter-spacing:.5px; color:#0E2C57; }
  .nm-nl-g46-box { display:inline-flex; align-items:center; justify-content:center; min-width:8mm; height:8mm; padding:0 1.5mm; box-sizing:border-box; border:1.4px solid #C9A063; border-radius:2mm; background:#fff; font-size:17px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-box.dash { border-style:dashed; border-width:1.6px; background:#fff8e6; color:#C9A063; }
  .nm-nl-g46-box.sq { border-radius:1.2mm; }
  .nm-nl-g46-box.on { background:#ffe28c; }
  .nm-nl-g46-box.sb { background:#eef6ff; border-color:#9fc4ee; }
  .nm-nl-g46-box.sb.dash { background:#fff8e6; border-color:#C9A063; }
  .nm-nl-g46-lock .nm-nl-g46-box { background:#f6e3a1; border-color:#C9A063; }
  .nm-nl-g46-draw { color:#b5a27a; font-size:10px; }
  .nm-nl-g46-grp { display:inline-flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:0; border:1.3px solid #C9A063; border-radius:2mm; padding:.6mm 1.2mm; max-width:30mm; background:#fff3c4; }
  .nm-nl-g46-gl { display:inline-flex; align-items:center; justify-content:center; color:#16417c; border:1.4px solid #C9A063; border-radius:2mm; padding:.6mm 1.6mm; background:#fff; min-width:11mm; }
  .nm-nl-g46-gl svg { height:8mm; width:auto; display:block; }
  .nm-nl-g46-ref { display:inline-flex; flex-direction:column; align-items:center; gap:.4mm; font-size:12px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-line { display:flex; align-items:flex-end; justify-content:center; gap:.4mm; }
  .nm-nl-g46-ppl { display:inline-flex; flex-direction:column; align-items:center; font-size:17px; line-height:1; }
  .nm-nl-g46-ppl .nm-nl-g46-t { font-size:17px; }
  .nm-nl-g46-ppl.mark { border:1.6px solid #C9A063; border-radius:1.4mm; background:#ffe28c; }
  .nm-nl-g46-ppl.sil { width:5mm; height:5.5mm; border:1.3px dashed #C9A063; border-radius:50% 50% 1mm 1mm; background:#fffaf0; }
  .nm-nl-g46-cap { font-size:9.5px; font-weight:700; color:#8a6a2f; }
  .nm-nl-g46-cc { display:grid; border:1.4px solid #8a6a2f; border-radius:1mm; overflow:hidden; background:#fffaf0; }
  .nm-nl-g46-cc span { position:relative; box-sizing:border-box; border:.7px solid #C9A063; display:flex; align-items:center; justify-content:center; }
  .nm-nl-g46-cc span small { position:absolute; left:.5mm; top:0; font-size:8px; color:#8a6a2f; font-weight:700; }
  .nm-nl-g46-cc span i { display:block; width:58%; height:58%; border-radius:50%; background:#e53935; box-shadow:inset 0 0 0 .5px #8e1b1b; }
  .nm-nl-g46-legend { display:flex; align-items:center; gap:2mm; flex-wrap:wrap; justify-content:center; font-size:12px; font-weight:800; color:#0E2C57; border:1.2px dashed #C9A063; border-radius:2mm; padding:.6mm 1.6mm; }
  .nm-nl-g46-legend > small { color:#8a6a2f; }
  .nm-nl-g46-legend > span { display:inline-flex; align-items:center; gap:.8mm; }
  .nm-nl-g46-ctrl { display:flex; gap:3mm; justify-content:center; align-items:flex-start; }
  .nm-nl-g46-choices { display:flex; flex-wrap:wrap; gap:1.2mm 4mm; justify-content:center; font-size:14px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-choices > span { display:inline-flex; align-items:center; gap:1mm; }
  .nm-nl-g46-choices .no { color:#8a6a2f; }
  .nm-nl-g46-goal { font-size:15px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-stairs { display:block; height:15mm; width:auto; max-width:100%; }
  .nm-nl-g46-stairs rect { fill:#fffaf0; stroke:#8a6a2f; stroke-width:1.2; }
  .nm-nl-g46-stairs rect.m { fill:#ffe28c; stroke:#C9A063; stroke-width:1.6; }
  .nm-nl-g46-path { width:29mm; height:auto; display:block; }
  .nm-nl-g46-path polyline { fill:none; stroke:#C9A063; stroke-width:1.4; stroke-dasharray:1.5 3; stroke-linecap:round; }
  .nm-nl-g46-path circle { fill:#fff; stroke:#C9A063; stroke-width:1.5; }
  .nm-nl-g46-path circle.hid { fill:#fff8e6; stroke-dasharray:3 2; }
  .nm-nl-g46-path circle.ask { fill:#fff3c4; stroke:#e0a020; stroke-width:2.6; }
  .nm-nl-g46-path text { font:700 10px sans-serif; fill:#16417c; text-anchor:middle; dominant-baseline:central; }
  .nm-nl-g46-bar { display:grid; grid-template-columns:auto repeat(9,5.2mm); align-items:center; gap:.5mm .4mm; font-size:9px; font-weight:700; color:#8a6a2f; background:#fffaf0; border-radius:1.5mm; padding:.6mm; }
  .nm-nl-g46-bar i { display:flex; height:4.1mm; align-items:center; justify-content:center; font-style:normal; }
  .nm-nl-g46-bar .ax { color:#8a6a2f; justify-content:center; }
  .nm-nl-g46-bar .nm-nl-g46-t { font-size:13px; }
  .nm-nl-g46-bar .base { margin-right:1mm; }
  .nm-nl-g46-bar .cell { border-bottom:.8px dotted #C9A063; }
  .nm-nl-g46-bar .hidq { font-size:15px; font-weight:800; color:#C9A063; }
  .nm-nl-g46-bond { display:inline-block; }
  .nm-nl-g46-bond svg { width:26mm; height:auto; display:block; }
  .nm-nl-g46-bond.mini svg { width:19mm; }
  .nm-nl-g46-bond text { font:800 17px sans-serif; fill:#0E2C57; text-anchor:middle; dominant-baseline:central; }
  .nm-nl-g46-bond circle { fill:#fff; stroke:#8a6a2f; stroke-width:1.8; }
  .nm-nl-g46-bond circle.q { fill:#fff8e6; stroke:#C9A063; stroke-width:2; stroke-dasharray:4 3; }
  .nm-nl-g46-bond line { stroke:#8a6a2f; stroke-width:1.8; stroke-linecap:round; }
  .nm-nl-g46-bars { display:flex; }
  .nm-nl-g46-bars i { width:5.4mm; height:7mm; border:.9px solid #8a6a2f; border-left-width:0; box-sizing:border-box; display:block; }
  .nm-nl-g46-bars i:first-child { border-left-width:.9px; }
  .nm-nl-g46-bars i.a, .nm-nl-g46-c1 { background:#e53935; }
  .nm-nl-g46-bars i.b, .nm-nl-g46-c2 { background:repeating-linear-gradient(45deg,#3b8fe0 0 1.1mm,#fff 1.1mm 1.5mm); }
  .nm-nl-g46-bars.ph i { background:#f4efe0; }
  .nm-nl-g46-circle { display:inline-flex; width:13mm; height:13mm; border:1.5px solid #8a6a2f; border-radius:50%; overflow:hidden; background:#fff; }
  .nm-nl-g46-circle > span { flex:1; display:flex; flex-wrap:wrap; align-content:center; justify-content:center; font-size:11px; }
  .nm-nl-g46-circle > b { width:1.5px; background:#8a6a2f; display:block; }
  .nm-nl-g46-plate { display:inline-flex; align-items:center; justify-content:center; width:11.5mm; height:11.5mm; border:1.5px solid #6b7688; border-radius:50%; background:#fff; box-shadow:inset 0 0 0 1.6mm #fff, inset 0 0 0 2.1mm #a8d8ff; flex-wrap:wrap; align-content:center; }
  .nm-nl-g46-plate.cake { border-radius:2mm; border-width:1.5px; border-color:#7a4f1d; box-shadow:none; background:#ffe2b0; }
  .nm-nl-g46-plus { font-size:16px; font-weight:800; color:#C9A063; }
  .nm-nl-g46-srow { display:flex; align-items:center; justify-content:center; gap:1.5mm; }
  .nm-nl-g46-srow.locked { opacity:.65; }
  .nm-nl-g46-pt { display:inline-flex; border:1.2px solid #8a6a2f; border-radius:50%; padding:.3mm; background:#fff; }
  .nm-nl-g46-tr { display:flex; align-items:center; gap:2mm; font-size:12px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-tr b { min-width:11mm; }
  .nm-nl-g46-mach { display:inline-flex; align-items:center; justify-content:center; min-width:11mm; height:8mm; padding:0 1.5mm; border:1.4px solid #C9A063; border-radius:1.5mm; background:#fff; font-size:14px; font-weight:800; color:#0E2C57; gap:1mm; box-sizing:border-box; }
  .nm-nl-g46-mach.rule { background:#eef6ff; border-color:#9fc4ee; }
  .nm-nl-g46-mach.rule.down { background:#fff0ee; border-color:#eeb1a8; }
  .nm-nl-g46-mach.end { border-style:dashed; border-width:1.6px; background:#fff8e6; min-width:9mm; }
  .nm-nl-g46-arr { font-size:15px; font-weight:800; color:#C9A063; }
  .nm-nl-g46-star { font-size:16px; font-weight:800; color:#C9A063; }
  .nm-nl-g46-star b { color:#0E2C57; }
  .nm-nl-g46-rg { display:grid; grid-template-columns:auto auto auto; gap:1mm; align-items:center; justify-items:center; background:#fffaf0; border-radius:2mm; padding:1mm; }
  .nm-nl-g46-rg .cellr { min-width:15mm; min-height:9mm; border:1.4px solid #C9A063; border-radius:1.5mm; display:flex; flex-wrap:wrap; justify-content:center; align-items:center; padding:.5mm; box-sizing:border-box; background:#fff; }
  .nm-nl-g46-seat { display:grid; gap:.8mm; background:#fffaf0; border-radius:1.5mm; padding:.8mm; }
  .nm-nl-g46-seat span { width:7.6mm; height:6.2mm; border:1.2px solid #C9A063; border-radius:1.2mm; display:flex; align-items:center; justify-content:center; background:#fff; }
  .nm-nl-g46-seat span.m { background:#ffe28c; border-width:1.6px; }
  .nm-nl-g46-board { width:34mm; height:3.6mm; border:1.4px solid #4a2c12; border-radius:1mm; background:#43a047; box-shadow:inset 0 0 0 .5mm #8a5a2b; margin:0 auto; }
  .nm-nl-g46-ticket { position:relative; display:inline-block; width:12mm; height:9mm; }
  .nm-nl-g46-ticket .nm-nl-g46-t { font-size:12mm; position:absolute; left:0; top:-1.5mm; }
  .nm-nl-g46-ticket b { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:16px; z-index:1; color:#7a4f1d; }
  .nm-nl-g46-pad { display:grid; grid-template-columns:repeat(3,8mm); gap:1mm; }
  .nm-nl-g46-lock .nm-nl-g46-t { font-size:20px; }
  .nm-nl-g46-m .nm-nl-g46-t { font-size:15px; }
  .nm-nl-g46-match { display:flex; align-items:center; padding-right:6.5mm; }  /* 오른쪽 ①②… 꼬리표가 장면판 테두리에 걸리지 않게 */
  .nm-nl-g46-cardcol { display:flex; flex-direction:column; gap:1.6mm; }
  .nm-nl-g46-mc { position:relative; display:flex; align-items:center; justify-content:center; min-width:16mm; height:8.6mm; padding:0 2mm; box-sizing:border-box; border:1.4px solid #C9A063; border-radius:2mm; background:#fff; font-size:18px; font-weight:800; color:#0E2C57; }
  .nm-nl-g46-mc svg.nm-anc { height:7.2mm; width:auto; color:#16417c; }
  .nm-nl-g46-mc .tag { position:absolute; right:-6mm; top:50%; transform:translateY(-50%); font-size:12px; color:#8a6a2f; font-weight:700; }
  .nm-nl-g46-seq .nm-nl-cell { border-color:#C9A063; border-width:1.4px; background:#fff; color:#0E2C57; font-weight:800; }
  .nm-nl-g46-seq .nm-nl-cell-blank { border-width:1.6px; background:#fff8e6; }
  .nm-nl-g46-seq { gap:.8mm; }  /* 칸 5개+화살표 4개가 장면판(최대 80mm)을 넘어 첫·끝 칸이 테두리에 걸리던 것 */
  .nm-nl-g46-seq .nm-nl-arrow { color:#C9A063; font-weight:800; padding:0; font-size:15px; }
  /* 화면 색을 종이에 그대로 — 컬러 채움이 있는 요소는 프린터가 배경을 지우지 못하게 */
  [class*="nm-nl-g46-"], [class*="nm-nl-g46-"] * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
`;
    (document.head || document.documentElement).appendChild(st);
  })();

  /* ── 공용 ─────────────────────────────────────────────── */
  const ANI_GLYPH = { 'animal:rabbit': '🐰', 'animal:turtle': '🐢', 'animal:bear': '🐻', 'animal:fox': '🦊', 'animal:raccoon': '🦝', 'animal:squirrel': '🐿️', 'animal:deer': '🦌', 'animal:duck': '🦆', 'animal:tiger': '🐯' };
  const ANI_NAME = { 'animal:rabbit': ['토끼', 'rabbit', '兔子'], 'animal:turtle': ['거북이', 'turtle', '乌龟'], 'animal:bear': ['곰', 'bear', '熊'], 'animal:fox': ['여우', 'fox', '狐狸'],
    'animal:raccoon': ['너구리', 'raccoon', '浣熊'], 'animal:squirrel': ['다람쥐', 'squirrel', '松鼠'], 'animal:deer': ['사슴', 'deer', '鹿'], 'animal:duck': ['오리', 'duck', '鸭子'], 'animal:tiger': ['호랑이', 'tiger', '老虎'] };
  const FRIENDS = ['🧒', '👧', '👦', '🧑', '👩', '👨', '🧓', '👴', '👵'];
  const ORD_KO = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'];
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const sumA = a => a.reduce((x, y) => x + y, 0);
  const glyph = (sys, n) => (window.NM_ANCIENT ? window.NM_ANCIENT.glyph(sys, n) : String(n));

  /* 토큰 한 개: 젤리 SVG → 이모지 글자. 동물은 animal-art 가 있으면 SVG, 없으면 이모지. */
  function T1(K, tok, cls) {
    let h;
    if (typeof tok === 'string' && tok.indexOf('animal:') === 0) {
      h = (window.NM_ANIMALS && window.NM_ANIMALS.svg(tok.slice(7)).replace('<svg ', '<svg class="nm-obj-svg" ')) || K.esc(ANI_GLYPH[tok] || '●');
    } else h = K.nlObjHtml(tok);
    return `<span class="nm-nl-g46-t${cls ? ' ' + cls : ''}">${h}</span>`;
  }
  const Ts = (K, tok, n, cls) => { let s = ''; for (let i = 0; i < n; i++) s += T1(K, tok, cls); return s; };
  const card = (K, inner, ans) => K.nlCard(K.nlStage(inner), ans);
  const circ = (K, i) => K.NL_CIRC[i] || String(i + 1);
  const lt = (K, ko, en, zh) => K.lk(ko, en, zh);

  function personsP(K, total, mark, chars, sil) {
    let s = '';
    for (let i = 0; i < total; i++) {
      if (sil) { s += `<span class="nm-nl-g46-ppl sil"></span>`; continue; }
      s += `<span class="nm-nl-g46-ppl${i === mark ? ' mark' : ''}">${T1(K, (chars && chars[i]) || FRIENDS[i % FRIENDS.length])}</span>`;
    }
    return s;
  }
  function stairsP(total, mark) {
    const w = 10, h = 5.5, W = total * w + 4, H = total * h + 6;
    let s = '';
    for (let i = 0; i < total; i++) s += `<rect class="${i === mark ? 'm' : ''}" x="${2 + i * w}" y="${H - 3 - (i + 1) * h}" width="${w}" height="${(i + 1) * h}"/>`;
    return `<svg class="nm-nl-g46-stairs nm-obj-svg" viewBox="0 0 ${W} ${H}" role="img">${s}</svg>`;
  }
  function stemP(K, part) {
    switch (part.k) {
      case 'text': return `<div class="nm-nl-g46-text">${K.esc(K.pickL(part.t))}</div>`;
      case 'eq': return `<div class="nm-nl-g46-eq">${K.esc(part.t)}</div>`;
      case 'dots': return `<div class="nm-nl-g46-row">${Ts(K, part.e, part.n)}</div>`;
      case 'pairs': {
        if (!part.n) return `<div class="nm-nl-g46-box dash" style="min-width:20mm">0</div>`;
        let s = ''; for (let i = 0; i < part.n; i += 2) s += `<div class="nm-nl-g46-row" style="gap:5mm">${T1(K, part.e)}${i + 1 < part.n ? T1(K, part.e) : '<span class="nm-nl-g46-t"></span>'}</div>`;
        return `<div class="nm-nl-g46-col" style="gap:.4mm">${s}</div>`;
      }
      case 'row': return `<div class="nm-nl-g46-line">${personsP(K, part.total, part.mark, part.chars)}</div>`
        + (part.front === 'left' ? `<div class="nm-nl-g46-cap" style="display:flex;justify-content:space-between;width:100%"><span>${K.esc(lt(K, '◀ 앞', '◀ front', '◀ 前'))}</span><span>${K.esc(lt(K, '뒤 ▶', 'back ▶', '后 ▶'))}</span></div>` : '');
      case 'stairs': return stairsP(part.total, part.mark);
      case 'glyph': return `<div class="nm-nl-g46-gl">${glyph(part.sys, part.n)}</div>`;
      case 'refs': return `<div class="nm-nl-g46-row" style="gap:2.5mm">${part.list.map(r => `<span class="nm-nl-g46-ref"><span class="nm-nl-g46-gl">${glyph(r.sys, r.n)}</span>${r.n}</span>`).join('')}</div>`;
      case 'cards': return `<div class="nm-nl-g46-row">${part.list.map(n => `<span class="nm-nl-g46-box">${K.esc(n)}</span>`).join('')}</div>`;
      case 'groups': return `<div class="nm-nl-g46-row" style="gap:2mm">${part.list.map((g, i) => (i ? `<span class="nm-nl-g46-plus">${K.esc(part.sign || '+')}</span>` : '') + `<span class="nm-nl-g46-grp">${Ts(K, g.e, g.n, 'sm')}</span>`).join('')}</div>`;
      case 'rows': return `<div class="nm-nl-g46-col" style="align-items:flex-start;gap:.6mm">${part.list.map(r => `<span class="nm-nl-g46-tr"><b>${K.esc(K.pickL(r.label))}</b>${Ts(K, r.e, r.n, 'sm')}</span>`).join('')}</div>`;
      case 'ticket': return `<span class="nm-nl-g46-ticket">${T1(K, 'ticket')}<b>${K.esc(part.n)}</b></span>`;
      default: return '';
    }
  }
  function choiceText(K, c) {
    if (c == null) return '';
    if (typeof c === 'string' || typeof c === 'number') return K.esc(c);
    if (c.glyph) return `<span class="nm-nl-g46-gl">${glyph(c.glyph.sys, c.glyph.n)}</span>`;
    if (c.dots) return Ts(K, c.dots.e, c.dots.n, 'sm');
    return K.esc(K.pickL(c.t));
  }
  const choiceLabelText = (K, c) => (c == null ? '' : typeof c === 'string' || typeof c === 'number' ? String(c) : c.dots ? String(c.dots.n) : c.glyph ? String(c.glyph.n) : String(K.pickL(c.t)));
  const askP = (p, K) => (p.printAsk ? K.pickL(p.printAsk) : null);

  function ccGridP(p, lit, w, showVals) {
    const { cols, rows } = p.layout, cell = w / cols;
    let s = '';
    for (let i = 0; i < cols * rows; i++) s += `<span style="height:${cell}mm">${showVals ? `<small>${p.vals[i]}</small>` : ''}${lit.indexOf(i) >= 0 ? '<i></i>' : ''}</span>`;
    return `<div class="nm-nl-g46-cc" style="grid-template-columns:repeat(${cols},${cell}mm);width:${w}mm">${s}</div>`;
  }
  function bondP(w, a, b, hide, mini) {
    const t = (x, y, v, k) => `<circle cx="${x}" cy="${y}" r="15" class="${hide === k ? 'q' : ''}"/>${hide === k ? '' : `<text x="${x}" y="${y}">${v}</text>`}`;
    return `<span class="nm-nl-g46-bond${mini ? ' mini' : ''}"><svg class="nm-obj-svg" viewBox="0 0 120 92" role="img">${t(60, 17, w, 'whole')}<line x1="52" y1="31" x2="30" y2="58"/><line x1="68" y1="31" x2="90" y2="58"/>${t(26, 70, a, 'a')}${t(94, 70, b, 'b')}</svg></span>`;
  }

  /* ============================================================
     pickCard
     ============================================================ */
  NP.pickCard = {
    visual(p, K) {
      const stem = (p.stemParts || []).map(x => stemP(K, x)).join('');
      if (Array.isArray(p.chips)) return card(K, `<div class="nm-nl-g46-col">${stem}</div>`, K.nlAnsBox(''));
      const ch = `<div class="nm-nl-g46-choices">${(p.choices || []).map((c, i) => `<span><b class="no">${K.esc(circ(K, i))}</b> ${choiceText(K, c)}</span>`).join('')}</div>`;
      return card(K, `<div class="nm-nl-g46-col">${stem}${ch}</div>`, K.nlAnsBox(lt(K, '번', '', '号')));
    },
    label(p, K) {
      if (Array.isArray(p.chips)) return null;
      const c = (p.choices || [])[p.answer - 1];
      return `${circ(K, p.answer - 1)} ${choiceLabelText(K, c)}`;
    },
    ask: askP
  };

  /* ============================================================
     tilePick
     ============================================================ */
  NP.tilePick = {
    visual(p, K) {
      const lock = p.theme === 'lock';
      const tiles = p.tiles.map(v => `<span class="nm-nl-g46-box sq" style="min-width:8.5mm;height:9.5mm">${v}</span>`).join('');
      let inner = '';
      /* 단서 문장은 물음 줄(printAsk)에 이미 있다 — 카드에 또 싣지 않는다(높이 절약) */
      if (lock) inner += `<div class="nm-nl-g46-pad nm-nl-g46-lock">${p.tiles.map(v => `<span class="nm-nl-g46-box sq" style="min-width:8mm;height:8mm">${v}</span>`).join('')}</div>`;
      else inner += `<div class="nm-nl-g46-row" style="gap:1.4mm">${tiles}</div>`;
      return card(K, `<div class="nm-nl-g46-col">${inner}</div>`, p.interaction === 'count' ? K.nlAnsBox(K.EA) : '');
    },
    label(p, K) { return p.interaction === 'multi' ? p.ok.join(', ') : null; },
    ask: askP
  };

  /* ============================================================
     cellCode
     ============================================================ */
  function waysOf(vals, target) {
    const ways = [];
    for (let m = 1; m < (1 << vals.length) - 1; m++) {
      const pick = []; vals.forEach((v, i) => { if (m & (1 << i)) pick.push(v); });
      if (sumA(pick) === target) ways.push(pick.sort((a, b) => b - a).join('+'));
    }
    return ways;
  }
  NP.cellCode = {
    visual(p, K) {
      const tall = p.layout.cols === 1, w = tall ? 5 : 15;
      const leg = p.showVals ? '' : `<div class="nm-nl-g46-legend"><small>${K.esc(lt(K, '약속', 'Rule', '约定'))}</small>${p.legend.map(l => `<span>${ccGridP(p, l.lit, tall ? 2.8 : 7, false)}<b>${l.n}</b></span>`).join('')}</div>`;
      if (p.interaction === 'pickMax') {
        const figs = p.figs.map((f, i) => `<span class="nm-nl-g46-col" style="gap:.4mm">${ccGridP(p, f.lit, p.layout.cols === 1 ? 4 : 12, false)}<b>${K.esc(circ(K, i))}</b></span>`).join('');
        return card(K, `<div class="nm-nl-g46-col">${leg}<div class="nm-nl-g46-row" style="gap:4mm;align-items:flex-start">${figs}</div></div>`);
      }
      if (p.interaction === 'read' && tall) return card(K, `<div class="nm-nl-g46-row" style="gap:5mm;flex-wrap:nowrap">${ccGridP(p, p.lit, w, p.showVals)}<span class="nm-nl-g46-col">${leg}</span></div>`, K.nlAnsBox(''));
      if (p.interaction === 'read') return card(K, `<div class="nm-nl-g46-col">${leg}${ccGridP(p, p.lit, w, p.showVals)}</div>`, K.nlAnsBox(''));
      const two = p.interaction === 'make2';
      const grids = `<div class="nm-nl-g46-row" style="gap:5mm">${ccGridP(p, [], w, p.showVals)}${two ? ccGridP(p, [], w, p.showVals) : ''}</div>`;
      if (tall) return card(K, `<div class="nm-nl-g46-row" style="gap:5mm;flex-wrap:nowrap">${grids}<span class="nm-nl-g46-col"><span class="nm-nl-g46-goal">🎯 ${p.target}</span>${leg}</span></div>`);
      return card(K, `<div class="nm-nl-g46-col">${leg}<div class="nm-nl-g46-goal">🎯 ${p.target}</div>${grids}</div>`);
    },
    label(p, K) {
      if (p.interaction === 'pickMax') return circ(K, p.answer - 1);
      if (p.interaction === 'read') return null;
      return `${p.target} = ${waysOf(p.vals, p.target).join(' / ')}`;
    },
    ask: askP
  };

  /* ============================================================
     glyphBuild
     ============================================================ */
  const PART_NAME = { maya: [['점', 'dot', '点'], ['막대', 'bar', '横线']], egypt: [['막대', 'stroke', '竖线'], null], greek: [['막대', 'bar', '竖线'], ['ㄱ자 표', 'hook sign', '钩形符号']],
    chinese: [['막대', 'stick', '竖线'], ['가로선', 'flat bar', '横线']], mesopotamia: [['쐐기', 'wedge', '楔形'], null] };
  NP.glyphBuild = {
    visual(p, K) {
      const refs = `<div class="nm-nl-g46-row" style="gap:2.5mm">${p.refs.map(r => `<span class="nm-nl-g46-ref"><span class="nm-nl-g46-gl">${glyph(p.sys, r.n)}</span>${r.n}</span>`).join('')}</div>`;
      return card(K, `<div class="nm-nl-g46-col">${refs}<div class="nm-nl-g46-goal">🎯 ${p.target}</div><div class="nm-nl-g46-box dash nm-nl-g46-draw" style="width:34mm;height:11mm">${K.esc(lt(K, '여기에 그려요', 'Draw here', '画在这里'))}</div></div>`);
    },
    label(p, K) {
      const five = window.NM_ANCIENT && window.NM_ANCIENT.hasFive(p.sys) && p.target >= 5 ? 1 : 0, ones = p.target - 5 * five, nm = PART_NAME[p.sys] || [['', '', ''], null];
      const part = (i, n) => lt(K, `${nm[i][0]} ${n}개`, `${n} ${nm[i][1]}${n > 1 ? 's' : ''}`, `${n}个${nm[i][2]}`);
      const out = []; if (five && nm[1]) out.push(part(1, 1)); if (ones) out.push(part(0, ones));
      return out.join(' + ');
    },
    ask: askP
  };

  /* ============================================================
     g46Match — 짝 잇기(기호·숫자·그림 카드, 식 카드, 합 규칙)
     ============================================================ */
  NP.g46Match = {
    visual(p, K) {
      const L = p.left.map((n, i) => `<div class="nm-nl-g46-mc">${K.esc(p.leftLabels ? p.leftLabels[i] : n)}</div>`).join('');
      const R = p.right.map((n, j) => {
        const inner = p.rightType === 'ancient' ? glyph(p.sys, n) : p.rightType === 'objs' ? `<span class="nm-nl-g46-row" style="gap:0;max-width:24mm">${Ts(K, p.rightEm[j], n, 'sm')}</span>` : `<b>${n}</b>`;
        return `<div class="nm-nl-g46-mc" style="${p.rightType === 'objs' ? 'height:auto;min-height:10mm;padding:.8mm 2mm' : ''}">${inner}<span class="tag">${K.esc(circ(K, j))}</span></div>`;
      }).join('');
      return card(K, `<div class="nm-nl-g46-match"><div class="nm-nl-g46-cardcol">${L}</div><div style="width:18mm"></div><div class="nm-nl-g46-cardcol">${R}</div></div>`);
    },
    label(p, K) {
      return p.left.map((n, i) => {
        const j = p.right.findIndex(r => (p.matchRule === 'sum' ? n + r === p.sumTo : r === n));
        return `${p.leftLabels ? p.leftLabels[i] : n}→${circ(K, j)}`;
      }).join(' ');
    },
    ask: askP
  };

  /* ============================================================
     g46Seq — 수 채우기(사슬·상자·길)
     ============================================================ */
  NP.g46Seq = {
    visual(p, K) {
      if (p.layout) {
        const cs = p.cells, R0 = 6.4;
        let s = `<polyline points="${cs.map(c => c.x + ',' + c.y).join(' ')}"/>`;
        cs.forEach((c, i) => {
          if (i === p.ask) s += `<circle class="ask" cx="${c.x}" cy="${c.y}" r="${R0 + 0.8}"/>`;
          else if (c.v == null) s += `<circle class="hid" cx="${c.x}" cy="${c.y}" r="${R0}"/>`;
          else s += `<circle cx="${c.x}" cy="${c.y}" r="${R0}"/><text x="${c.x}" y="${c.y}">${c.v}</text>`;
        });
        return card(K, `<svg class="nm-nl-g46-path nm-obj-svg" viewBox="0 0 100 100" role="img">${s}</svg>`, K.nlAnsBox(''));
      }
      const cells = p.seq.map((v, i) => i === p.blank
        ? `<span class="nm-nl-cell${p.chain ? ' nm-nl-cell-round' : ''} nm-nl-cell-blank"></span>`
        : `<span class="nm-nl-cell${p.chain ? ' nm-nl-cell-round' : ''} nm-nl-num">${K.esc(v)}</span>`);
      return K.nlCard(K.nlStage(`<div class="nm-nl-row nm-nl-seq nm-nl-g46-seq">${cells.join(p.chain ? '<span class="nm-nl-arrow">―</span>' : '<span class="nm-nl-arrow">→</span>')}</div>`));
    },
    label() { return null; },
    ask: askP
  };

  /* ============================================================
     qtyOrd
     ============================================================ */
  NP.qtyOrd = {
    visual(p, K) {
      const sc = p.scene;
      let scene = '';
      if (sc.kind === 'line') scene = `<div class="nm-nl-g46-line">${personsP(K, sc.total, sc.rank - 1, sc.chars)}</div><div class="nm-nl-g46-cap" style="display:flex;justify-content:space-between;width:100%"><span>${K.esc(lt(K, '◀ 앞', '◀ front', '◀ 前'))}</span><span>${K.esc(lt(K, '뒤 ▶', 'back ▶', '后 ▶'))}</span></div>`;
      else if (sc.kind === 'coins') scene = `<div class="nm-nl-g46-row" style="gap:.4mm">${range(1, sc.total).map(i => T1(K, '🪙', i === sc.rank ? '' : 'sm')).join('')}</div>`;
      else scene = `<div class="nm-nl-g46-row" style="gap:2mm"><span class="nm-nl-g46-t" style="font-size:42px">${K.nlObjHtml('podium')}</span><span class="nm-nl-g46-col" style="gap:0">${T1(K, '🧒')}<span class="nm-nl-g46-cap">${K.esc(lt(K, `${sc.rank}번째 자리`, `place ${sc.rank}`, `第${sc.rank}个位置`))}</span></span></div>`
        + `<div class="nm-nl-g46-row" style="gap:0">${Ts(K, sc.e, sc.q, 'sm')}</div>`;
      const cards = `<div class="nm-nl-g46-row" style="gap:8mm">${p.cards.map(c => `<span class="nm-nl-g46-box" style="min-width:14mm;height:10mm;font-size:22px">${c.n}</span>`).join('')}</div>`;
      return card(K, `<div class="nm-nl-g46-col">${scene}${cards}</div>`);
    },
    label(p, K) {
      const kind = p.scene.kind;
      return `${p.answer} (${p.ask === 'ord' ? lt(K, kind === 'prize' ? '몇 등' : '몇째', 'place', '第几') : lt(K, kind === 'line' ? '몇 명' : '몇 개', 'how many', '有几个')})`;
    },
    ask: askP
  };

  /* ============================================================
     seatGrid
     ============================================================ */
  NP.seatGrid = {
    visual(p, K) {
      const cells = p.occ.map((an, i) => {
        const r = Math.floor(i / p.cols), c = i % p.cols, m = p.interaction === 'read' && p.target[0] === r && p.target[1] === c;
        return `<span class="${m ? 'm' : ''}">${T1(K, an, 'sm')}</span>`;
      }).join('');
      return card(K, `<div class="nm-nl-g46-col"><div class="nm-nl-g46-board"></div><div class="nm-nl-g46-seat" style="grid-template-columns:repeat(${p.cols},7.6mm)">${cells}</div></div>`, p.interaction === 'read' ? K.nlAnsBox('') : '');
    },
    label(p, K) {
      if (p.interaction === 'read') return null;
      const r = p.target[0] + 1, c = p.target[1] + 1;
      return lt(K, `앞에서 ${ORD_KO[r]} 줄, 왼쪽에서 ${ORD_KO[c]} 칸`, `row ${r} from the front, seat ${c} from the left`, `前面第${r}排，左边第${c}个`);
    },
    ask: askP
  };

  /* ============================================================
     g46Line · g46LineDraw
     ============================================================ */
  NP.g46Line = {
    visual(p, K) {
      if (p.textOnly) return card(K, `<div class="nm-nl-g46-row" style="gap:3mm"><span class="nm-nl-g46-box">${p.ahead}</span>${T1(K, '🧒')}<span class="nm-nl-g46-box">${p.behind}</span></div><div class="nm-nl-g46-cap" style="display:flex;justify-content:space-around;width:100%"><span>${K.esc(lt(K, '내 앞', 'ahead', '前面'))}</span><span>${K.esc(lt(K, '나', 'me', '我'))}</span><span>${K.esc(lt(K, '내 뒤', 'behind', '后面'))}</span></div>`, K.nlAnsBox(lt(K, '명', '', '人')));
      const sil = p.scene === 'silhouette';
      return card(K, `<div class="nm-nl-g46-line"><span class="nm-nl-g46-t" style="font-size:24px">${K.nlObjHtml('ticket-booth')}</span>${personsP(K, p.total, sil ? -1 : p.mark, p.chars, sil)}</div><div class="nm-nl-g46-cap" style="display:flex;justify-content:space-between;width:100%"><span>${K.esc(lt(K, '◀ 앞(매표소)', '◀ front (booth)', '◀ 前(售票处)'))}</span><span>${K.esc(lt(K, '뒤 ▶', 'back ▶', '后 ▶'))}</span></div>`,
        K.nlAnsBox(p.ask === 'convert' ? lt(K, '째', 'th', '第几') : lt(K, '명', '', '人')));
    },
    label() { return null; },
    ask: askP
  };
  NP.g46LineDraw = {
    visual(p, K) {
      const c = p.context;
      return card(K, `<div class="nm-nl-g46-line"><span class="nm-nl-g46-t" style="font-size:24px">${K.nlObjHtml('ticket-booth')}</span>${personsP(K, c.mark + 1, c.mark, c.chars)}</div>`
        + `<div class="nm-nl-g46-box dash nm-nl-g46-draw" style="width:46mm;height:9mm">${K.esc(lt(K, '여기에 그려요', 'Draw here', '画在这里'))}</div>`);
    },
    label(p, K) { return lt(K, `${p.answer}명`, `${p.answer} friends`, `${p.answer}人`); },
    ask: askP
  };

  /* ============================================================
     rankClue
     ============================================================ */
  NP.rankClue = {
    visual(p, K) {
      const an = `<div class="nm-nl-g46-row" style="gap:3.5mm">${p.animals.map(a => T1(K, a)).join('')}</div>`;
      const ic = i => T1(K, p.animals[i], 'sm');
      const clues = p.clues.map(c => {
        let h = '';
        if (c.k === 'ahead') h = ic(c.a) + '▶▶' + ic(c.b);
        else if (c.k === 'first') h = '🥇' + ic(c.a);
        else if (c.k === 'last') h = ic(c.a) + '🐌';
        else if (c.k === 'right_after') h = ic(c.b) + '▶' + ic(c.a);
        else h = ic(c.b) + '▶' + ic(c.a) + '▶' + ic(c.c);
        return `<span class="nm-nl-g46-box" style="height:auto;min-height:6.5mm;font-size:12px;gap:.8mm">${h}</span>`;
      }).join('');
      return card(K, `<div class="nm-nl-g46-col">${an}<div class="nm-nl-g46-row" style="gap:1.4mm">${clues}</div></div>`);
    },
    label(p, K) { const n = ANI_NAME[p.animals[p.answer]]; return n ? lt(K, n[0], n[1], n[2]) : null; },
    ask: askP
  };

  /* ============================================================
     barRead — 인쇄는 지면 높이를 아끼려 가로로 눕힌 그림그래프(칸마다 한 줄, 위에 눈금 수)
     ============================================================ */
  NP.barRead = {
    visual(p, K) {
      const cols = Math.max(5, Math.max.apply(null, p.cats.map(c => c.n)));
      let s = `<i class="ax"></i>` + range(1, 9).map(k => `<i class="ax">${k <= cols ? k : ''}</i>`).join('');
      p.cats.forEach((c, r) => {
        const hid = p.hidden === r;
        s += `<i class="base">${T1(K, c.e)}</i>`;
        for (let k = 1; k <= 9; k++) s += `<i class="${k <= cols ? 'cell' : ''}">${hid ? (k === 1 ? '<span class="hidq">?</span>' : '') : (k <= c.n ? T1(K, c.e, 'sm') : '')}</i>`;
      });
      return card(K, `<div class="nm-nl-g46-bar">${s}</div>`, ['count', 'diff', 'hidden'].indexOf(p.kind) >= 0 ? K.nlAnsBox(K.EA) : '');
    },
    label(p, K) {
      if (['most', 'least', 'rank'].indexOf(p.kind) >= 0) return p.cats[p.answer].e;
      if (p.kind === 'same') return p.cats.filter(c => c.n === p.answer).map(c => c.e).join(' ');
      return null;
    },
    ask: askP
  };

  /* ============================================================
     chainMachine
     ============================================================ */
  NP.chainMachine = {
    visual(p, K) {
      let s = `<span class="nm-nl-g46-mach">${p.input}</span>`;
      p.rules.forEach(r => { s += `<span class="nm-nl-g46-arr">→</span><span class="nm-nl-g46-mach rule${r.d < 0 ? ' down' : ''}">${T1(K, r.sym, 'sm')}${r.d > 0 ? '+' : '−'}${Math.abs(r.d)}</span>`; });
      s += `<span class="nm-nl-g46-arr">→</span><span class="nm-nl-g46-mach end"></span>`;
      return card(K, `<div class="nm-nl-g46-row" style="gap:1mm">${s}</div>`);
    },
    label() { return null; },
    ask: askP
  };

  /* ============================================================
     tradeScene
     ============================================================ */
  NP.tradeScene = {
    visual(p, K) {
      const row = x => `<div class="nm-nl-g46-tr nm-nl-g46-trow"><b>${K.esc(K.pickL(x.name))}</b><span class="nm-nl-g46-row" style="gap:0;justify-content:flex-start;max-width:44mm">${Ts(K, x.e, x.n, 'sm')}</span></div>`;
      let give = '';
      if (p.interaction === 'after') {
        const f = p.give.from === 'a' ? p.a : p.b, t = p.give.from === 'a' ? p.b : p.a;
        give = `<div class="nm-nl-g46-text">${K.esc(K.pickL(f.name))} → ${p.give.n}${K.esc(lt(K, '개', '', '个'))} → ${K.esc(K.pickL(t.name))}</div>`;
      }
      return card(K, `<div class="nm-nl-g46-col" style="align-items:flex-start">${row(p.a)}${row(p.b)}</div>${give}`, K.nlAnsBox(K.EA));
    },
    label() { return null; },
    ask: askP
  };

  /* ============================================================
     splitDraw — 빈 접시·칸·동그라미·막대, 예시 줄(preset)은 미리 그려 인쇄
     ============================================================ */
  /* 가르기 두 색 — 화면 위젯과 같은 p.colors(문항마다 고른 두 색). 둘째 색에는 흰 빗금:
     팔레트 네 쌍 모두 흑백 회색 밝기가 비슷해, 빗금이 없으면 흑백 인쇄에서 두 부분이 안 갈린다. */
  function twoTone(p, k) {
    const c = (p.colors && p.colors.length >= 2) ? p.colors : ['#e53935', '#3b8fe0'];
    return k === 1 ? `background:${c[0]}` : `background:repeating-linear-gradient(45deg,${c[1]} 0 1.1mm,#fff 1.1mm 1.5mm)`;
  }
  function splitRowP(K, p, ab, locked) {
    const T = p.total, a = ab ? ab.a : 0, b = ab ? ab.b : 0;
    const cls = `nm-nl-g46-srow${locked ? ' locked' : ''}`;
    if (p.skin === 'plate' || p.skin === 'cake') {
      const tok = p.skin === 'cake' ? 'candle' : p.e;
      return `<div class="${cls}"><span class="nm-nl-g46-plate ${p.skin}">${Ts(K, tok, a, 'sm')}</span><span class="nm-nl-g46-plus">+</span><span class="nm-nl-g46-plate ${p.skin}">${Ts(K, tok, b, 'sm')}</span></div>`;
    }
    if (p.skin === 'paint') {
      let s = ''; for (let i = 1; i <= T; i++) s += `<span class="nm-nl-g46-pt"${ab ? ` style="${twoTone(p, i <= a ? 1 : 2)}"` : ''}>${T1(K, p.e, 'sm')}</span>`;
      return `<div class="${cls}" style="gap:.5mm">${s}</div>`;
    }
    if (p.skin === 'circle') return `<span class="nm-nl-g46-circle"><span>${Ts(K, p.e, a, 'sm')}</span><b></b><span>${Ts(K, p.e, b, 'sm')}</span></span>`;
    let s = ''; for (let i = 0; i < T; i++) s += `<i${ab ? ` style="${twoTone(p, i < a ? 1 : 2)}"` : ''}></i>`;
    return `<div class="${cls}"><span class="nm-nl-g46-bars${ab ? '' : ' ph'}">${s}</span></div>`;
  }
  NP.splitDraw = {
    visual(p, K) {
      const rows = [];
      (p.preset || []).forEach(x => rows.push(splitRowP(K, p, x, true)));
      for (let i = 0; i < p.rows; i++) rows.push(splitRowP(K, p, null, false));
      const wrapCls = p.skin === 'circle' ? 'nm-nl-g46-row' : 'nm-nl-g46-col';
      const two = (p.skin === 'plate' || p.skin === 'cake') && rows.length > 2;
      const note = p.skin === 'paint' ? `<div class="nm-nl-g46-cap">${K.esc(lt(K, '색칠한 곳 / 안 칠한 곳으로 나눠요', 'shade some, leave some', '涂一部分，留一部分'))}</div>` : '';
      return card(K, two ? `<div style="display:grid;grid-template-columns:auto auto;gap:1mm 5mm">${rows.join('')}</div>` : `<div class="${wrapCls}" style="gap:1.2mm">${rows.join('')}</div>${note}`);
    },
    label(p, K) {
      const T = p.total, list = [];
      if (p.distinct === 'ordered') for (let a = 1; a < T; a++) list.push(`${a}+${T - a}`);
      else for (let a = T - 1; a >= Math.ceil(T / 2); a--) list.push(`${a}+${T - a}`);
      return lt(K, `합이 ${T} (${list.join(', ')})`, `sum ${T} (${list.join(', ')})`, `和是${T}（${list.join('，')}）`);
    },
    ask: askP
  };

  /* ============================================================
     bondNum — 숫자 가르기 모형(세 위치 모두 빈칸 가능)
     ============================================================ */
  NP.bondNum = {
    visual(p, K) {
      if (p.interaction === 'max') {
        return card(K, `<div class="nm-nl-g46-row" style="gap:3mm;align-items:flex-start">${p.trees.map((t, i) => `<span class="nm-nl-g46-col" style="gap:0">${bondP(t.whole, t.a, t.b, t.hide, true)}<b>${K.esc(circ(K, i))}</b></span>`).join('')}</div>`);
      }
      let bar = '';
      if (p.bar) { let s = ''; for (let i = 0; i < p.bar.T; i++) s += `<i class="${i < p.bar.k ? 'a' : 'b'}"></i>`; bar = `<span class="nm-nl-g46-bars">${s}</span>`; }
      return card(K, `<div class="nm-nl-g46-row" style="gap:4mm">${bar}${bondP(p.whole, p.a, p.b, p.hide, false)}</div>`, K.nlAnsBox(''));
    },
    label(p, K) { return p.interaction === 'max' ? circ(K, p.answer - 1) : null; },
    ask: askP
  };

  /* ============================================================
     crossLeave
     ============================================================ */
  NP.crossLeave = {
    visual(p, K) {
      let row = '';
      if (p.skin === 'bar') { let s = ''; for (let i = 0; i < p.total; i++) s += `<i></i>`; row = `<span class="nm-nl-g46-bars ph">${s}</span>`; }
      else row = `<div class="nm-nl-g46-row" style="gap:.4mm;max-width:50mm">${Ts(K, p.e, p.total)}</div>`;
      const eq = p.eq ? `<span class="nm-nl-g46-eq" style="font-size:16px">${p.total} − ☐ = ${p.keep}</span>` : '';
      return card(K, `<div class="nm-nl-g46-row" style="gap:4mm"><span class="nm-nl-g46-star">✹ ${p.keep}</span>${eq}</div>${row}`, K.nlAnsBox(lt(K, p.skin === 'bar' ? '칸' : '개', '', p.skin === 'bar' ? '格' : '个')));
    },
    label() { return null; },
    ask: askP
  };

  /* ============================================================
     g46Sum · rabbitGrid
     ============================================================ */
  NP.g46Sum = {
    visual(p, K) {
      return card(K, `<div class="nm-nl-g46-col">${stemP(K, { k: 'groups', list: p.groups, sign: '+' })}<div class="nm-nl-g46-eq">${K.esc(p.eqLine.replace('?', '☐'))}</div></div>`, K.nlAnsBox(''));
    },
    label(p) { return p.eqLine.replace('?', p.answer); },
    ask: askP
  };
  NP.rabbitGrid = {
    visual(p, K) {
      const c = p.cells, rs = [c[0][0] + c[0][1], c[1][0] + c[1][1]], cs = [c[0][0] + c[1][0], c[0][1] + c[1][1]];
      const cell = n => `<span class="cellr">${Ts(K, p.e, n, 'sm')}</span>`;
      const sb = (k, v) => `<span class="nm-nl-g46-box sb${p.ask === k ? ' dash' : ''}" style="min-width:9mm">${p.ask === k ? '' : (p.show.indexOf(k) >= 0 ? v : '')}</span>`;
      const grid = `<div class="nm-nl-g46-rg">${cell(c[0][0])}${cell(c[0][1])}${sb('row0', rs[0])}${cell(c[1][0])}${cell(c[1][1])}${sb('row1', rs[1])}${sb('col0', cs[0])}${sb('col1', cs[1])}${p.ask === 'all' ? sb('all', 0) : '<span></span>'}</div>`;
      return card(K, grid, K.nlAnsBox(''));
    },
    label() { return null; },
    ask: askP
  };
})();
