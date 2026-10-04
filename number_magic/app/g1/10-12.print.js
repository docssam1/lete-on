/* G1-10-12호 인쇄 — window.NM_NL_PRINT['위젯이름']={visual(p,K), label(p,K), ask(p,K)} (K = exam.js nlPrintKit).
   visual = HTML 문자열(K.nlCard(K.nlStage(...), K.nlAnsBox(K.EA)) 패턴), label = 정답지 말(null 이면 숫자 그대로),
   ask = 물음 줄. 열린 활동은 label 에 "여러 정답 가능, 예: …" 한 줄. 필요한 CSS 는 이 파일이 직접 넣는다(클래스 nm-nl-g1012-…).
   흑백 레이저에서도 선이 또렷하게(진한 선 · 1.3px 이상), 한 칸(95×55mm)을 넘치지 않는 크기로. drill.html·ws.html 은 widgets 를 안 싣는다 —
   이 파일은 widgets.js 에 기대지 않고 engine/threads/g1-10-12.js 의 window.NM_G1012 만 쓴다. */
(function () {
  'use strict';
  window.NM_NL_PRINT = window.NM_NL_PRINT || {};
  const P = window.NM_NL_PRINT;
  const X = 'nm-nl-g1012';
  const MINUS = '−';
  const G = () => window.NM_G1012;
  const CIRC = ['①', '②', '③', '④', '⑤'];

  /* ── 인쇄용 CSS ── */
  (function () {
    if (document.getElementById('nm-g1012-print-css')) return;
    const st = document.createElement('style'); st.id = 'nm-g1012-print-css';
    st.textContent = `
.${X}-txt{font-size:12.5px;font-weight:700;line-height:2.05;text-align:left;color:#1F2A3A;max-width:74mm;word-break:keep-all}
.${X}-bx{display:inline-block;width:8mm;height:6.4mm;border:1.4px solid #1F2A3A;border-radius:1.5mm;vertical-align:middle;margin:0 .6mm;background:#fff;box-sizing:border-box}
.${X}-bx.dash{border-style:dashed}
.${X}-bx.sm{width:6.6mm;height:6mm}
.${X}-bx.wd{width:11mm}
.${X}-chips{display:flex;gap:1.8mm;justify-content:center;align-items:center;flex-wrap:wrap}
.${X}-chipbox{border:1.3px dashed #1F2A3A;border-radius:2mm;padding:.8mm 2.2mm;display:flex;gap:1.8mm;align-items:center;font-size:12px;font-weight:800}
.${X}-chipbox i{font-style:normal;font-size:9px;color:#555;font-weight:700;margin-right:.6mm}
.${X}-c{display:inline-grid;place-items:center;min-width:6.2mm;height:6.2mm;border:1.3px solid #1F2A3A;border-radius:50%;font-size:13px;font-weight:800;box-sizing:border-box;padding:0 .4mm;line-height:1}
.${X}-c.sq{border-radius:1.3mm}
.${X}-pic{display:flex;flex-direction:column;align-items:center;gap:.7mm}
.${X}-pr{display:flex;align-items:center;justify-content:center;gap:.3mm;flex-wrap:wrap}
.${X}-pi{position:relative;display:inline-block;font-size:19px;line-height:1;padding:.2mm}
.${X}-pi svg{display:block;width:1em;height:1em}
.${X}-pi.gone{opacity:.45}
.${X}-pi.gone::after{content:'✕';position:absolute;inset:0;display:grid;place-items:center;font-size:.9em;font-weight:900;color:#000;opacity:1}
.${X}-pi.aside{outline:1.3px dashed #000;outline-offset:.2mm;border-radius:1.5mm}
.${X}-plus{font-size:15px;font-weight:900;margin:0 1mm;color:#000}
.${X}-sm .${X}-pi{font-size:13px}
.${X}-sm .${X}-plus{font-size:11px;margin:0 .6mm}
.${X}-facts{display:grid;grid-template-columns:1fr 1fr;gap:1.6mm;width:70mm}
.${X}-fact{display:flex;align-items:center;gap:1.4mm;border:1.3px solid #1F2A3A;border-radius:2mm;padding:1mm 1.6mm;font-size:10.5px;font-weight:700;line-height:1.25;text-align:left}
.${X}-fact .${X}-pi{font-size:20px;flex:none}
.${X}-sent{font-size:12.5px;font-weight:700;line-height:2.3;text-align:center;max-width:72mm;word-break:keep-all}
.${X}-ul{display:inline-block;position:relative;border-bottom:1.6px solid #000;padding:0 .8mm;margin:0 .3mm}
.${X}-ul sup{position:absolute;left:-.5mm;top:-3.2mm;font-size:9px;font-weight:800}
.${X}-cards{display:flex;gap:1.6mm;justify-content:center;width:100%}
.${X}-card{flex:1 1 0;max-width:23mm;min-width:0;border:1.3px solid #1F2A3A;border-radius:2mm;padding:1mm 1mm;display:flex;flex-direction:column;align-items:center;gap:.8mm;font-size:10px;font-weight:700;line-height:1.25;text-align:center;box-sizing:border-box}
.${X}-card b{font-size:12px;font-weight:900}
.${X}-card .${X}-no{font-size:11px;font-weight:800}
.${X}-eq{font-size:16px;font-weight:900;letter-spacing:.3px;white-space:nowrap}
.${X}-sg{border-collapse:collapse}
.${X}-sg td{border:1.3px solid #1F2A3A;width:7mm;height:7mm;text-align:center;padding:0;line-height:1}
.${X}-sg td .${X}-pi{font-size:17px;padding:0}
.${X}-tab{border-collapse:collapse;margin-top:.6mm}
.${X}-tab td{border:1.3px solid #1F2A3A;min-width:9.5mm;height:7mm;text-align:center;font-size:13px;font-weight:800;padding:0 .5mm}
.${X}-tab td .${X}-pi{font-size:17px}
.${X}-tab td.em{height:7.4mm}
.${X}-plates{display:flex;gap:6mm;justify-content:center}
.${X}-plate{display:flex;flex-direction:column;align-items:center;gap:.4mm;width:27mm}
.${X}-plate .items{display:flex;flex-wrap:wrap;justify-content:center;align-content:flex-end;min-height:12mm}
.${X}-plate .dish{width:100%;height:2.2mm;border:1.3px solid #1F2A3A;border-radius:50%;background:#eee;box-sizing:border-box}
.${X}-bags{display:flex;gap:3mm;justify-content:center}
.${X}-bag{width:15mm;display:flex;flex-direction:column;align-items:center}
.${X}-bag .nk{width:6mm;height:2mm;border:1.3px solid #000;border-bottom:none;border-radius:2mm 2mm 0 0}
.${X}-bag .bd{width:100%;min-height:12mm;border:1.3px solid #000;border-radius:2mm 2mm 4mm 4mm;display:flex;flex-wrap:wrap;justify-content:center;align-content:center;padding:.6mm;box-sizing:border-box}
.${X}-bag .bd .${X}-pi{font-size:14px}
.${X}-star{position:relative;width:15mm;height:15mm;display:grid;place-items:center}
.${X}-star svg{position:absolute;inset:0;width:100%;height:100%}
.${X}-star svg polygon{fill:#fff;stroke:#000;stroke-width:1.6;stroke-linejoin:round}
.${X}-star b{position:relative;font-size:15px;font-weight:900;padding-top:1mm}
.${X}-vert{display:inline-grid;grid-template-columns:7mm 12mm;grid-template-rows:auto auto auto auto;gap:.4mm 1mm;align-items:center;font-size:20px;font-weight:900;font-variant-numeric:tabular-nums}
.${X}-vert .n{grid-column:2;text-align:right;min-height:7.4mm;display:flex;align-items:center;justify-content:flex-end}
.${X}-vert .o{grid-column:1;grid-row:2;text-align:center}
.${X}-vert .ln{grid-column:1 / 3;height:0;border-top:1.8px solid #000}
.${X}-vert .${X}-bx{width:10mm;height:7.4mm;margin:0}
.${X}-lines{display:flex;flex-direction:column;gap:1.6mm;align-items:center}
.${X}-line{display:flex;align-items:center;gap:1.4mm;font-size:15px;font-weight:900}
.${X}-line .no{font-size:10px;color:#555;width:4mm;text-align:right}
.${X}-dice{display:inline-flex;flex-wrap:wrap;gap:.9mm;max-width:11mm;padding:1mm;border:1.3px solid #000;border-radius:1.6mm;vertical-align:middle}
.${X}-dice i{width:2.4mm;height:2.4mm;border-radius:50%;background:#000;display:block}
.${X}-goal{display:flex;align-items:center;gap:2mm;font-size:16px;font-weight:900}
.${X}-purse{display:flex;flex-direction:column;gap:1.4mm}
.${X}-prow{display:flex;align-items:center;gap:1.6mm;border:1.3px solid #1F2A3A;border-radius:2mm;padding:.8mm 1.6mm}
.${X}-prow .who{font-size:21px;line-height:1;flex:none}
.${X}-prow .who svg{width:1em;height:1em}
.${X}-prow .co{display:flex;flex-wrap:wrap;gap:.2mm;flex:1}
.${X}-prow .${X}-pi{font-size:17px}
.${X}-pf{position:relative;width:46mm;aspect-ratio:100/80;--pfw:46mm}
.${X}-pf-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.${X}-pf-b{fill:#fff;stroke:#000;stroke-width:1.6;stroke-linejoin:round}
.${X}-pf-h{fill:#fff;stroke:#000;stroke-width:1.6}
.${X}-pf-l{fill:none;stroke:#000;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.${X}-pf-cell,.${X}-pf-whole{position:absolute;transform:translate(-50%,-50%);display:grid;place-items:center}
.${X}-pf-cell .${X}-bx,.${X}-pf-given{width:7.6mm;height:6.4mm;margin:0;font-size:14px}
.${X}-pf-given{display:grid;place-items:center;border:1.4px solid #000;border-radius:1.5mm;background:#fff;font-weight:900;box-sizing:border-box}
.${X}-pf-whole b{font-size:16px;font-weight:900}
.nm-nl .${X}-pf-svg ellipse.${X}-pf-b,.nm-nl .${X}-pf-svg circle.${X}-pf-h,.nm-nl .${X}-pf-svg rect.${X}-pf-b,.nm-nl .${X}-pf-svg polygon.${X}-pf-b{fill:#fff;stroke:#000}
.nm-nl .${X}-pf-svg .${X}-pf-b{fill:#f1f1f1}
.nm-nl .${X}-pf-svg circle.${X}-pf-h{fill:#fff}
.${X}-ways{display:flex;flex-direction:column;gap:1.4mm;align-items:center}
.${X}-way{display:flex;align-items:center;gap:1mm;font-size:14px;font-weight:900}
.${X}-gg{border-collapse:collapse}
.${X}-gg td{border:1.8px solid #000;width:8.4mm;height:8.4mm;text-align:center;font-size:15px;font-weight:900;padding:0}
.${X}-es{width:64mm;height:auto;display:block}
.nm-nl svg.${X}-es line,.nm-nl svg.${X}-es path{stroke:#1F2A3A;stroke-width:1.5;fill:none;stroke-linecap:round}
.nm-nl svg.${X}-es path.pan{fill:#fff}
.nm-nl svg.${X}-es text{font-size:11.5px;font-weight:800;fill:#000;text-anchor:middle}
`;
    document.head.appendChild(st);
  })();

  /* ── 공용 조각 ── */
  const bx = (cls) => `<span class="${X}-bx${cls ? ' ' + cls : ''}"></span>`;
  function tok(K, t, f) { return K.nlObjHtml(t, f); }
  function picHtml(K, defTok, rows, mode, small) {
    return `<div class="${X}-pic${small ? ' ' + X + '-sm' : ''}">` + rows.map(r => {
      let h = `<div class="${X}-pr">` + (r.plus ? `<span class="${X}-plus">+</span>` : '');
      for (let i = 0; i < r.n; i++) {
        const gone = r.gone && i >= r.n - r.gone;
        h += `<span class="${X}-pi${gone ? (mode === 'aside' ? ' aside' : ' gone') : ''}">${tok(K, r.tok || defTok)}</span>`;
      }
      return h + '</div>';
    }).join('') + '</div>';
  }
  const plain = (K, o) => K.esc(K.pickL(o));
  const swapVerbs = (K, p, pairs) => {
    let s = String(K.pickL(p.prompt) || '');
    pairs.forEach(([a, b]) => { if (a && s.indexOf(a) >= 0) s = s.split(a).join(b); });
    return s;
  };
  const sp = (n) => (n === 1 ? '' : '');   /* 자리 맞춤용 */

  /* ═══ G1-10 ═══ */

  /* 숫자 이야기 — 문장 + 빈 상자 + 보기 상자 */
  P.g10_slotFill = {
    visual(p, K) {
      const t = K.pickL(p.text);
      const html = t.split(/\{(\d)\}/).map((s, k) => (k % 2 === 0 ? K.esc(s) : bx())).join('');
      const chips = `<div class="${X}-chipbox"><i>${K.esc(K.lk('보기', 'Box', '方框'))}</i>` + p.chips.map(c => `<span class="${X}-c">${c}</span>`).join('') + '</div>';
      return K.nlCard(K.nlStage(`<div class="${X}-txt">${html}</div>${chips}`));
    },
    label(p) { return (p.solution || []).join(', '); },
    ask(p, K) { return K.lk('이야기의 빈칸에 알맞은 수를 보기에서 골라 써요', 'Pick numbers from the box and write them in the blanks of the story', '从方框里选数，写进故事的空格里'); }
  };

  /* 사실 카드 — 2열 카드 + 답 칸 */
  P.g10_factsCard = {
    visual(p, K) {
      const cards = p.facts.map(f => `<div class="${X}-fact"><span class="${X}-pi">${tok(K, f.icon)}</span><span>${plain(K, f.text)}</span></div>`).join('');
      return K.nlCard(K.nlStage(`<div class="${X}-facts">${cards}</div>`), K.nlAnsBox(K.EA));
    },
    label() { return null; },
    ask(p, K) { return K.pickL(p.prompt); }
  };

  /* 틀린 곳 찾기 — 그림 + ①②③ 밑줄 문장 + 두 답 칸 */
  P.g10_errorFind = {
    visual(p, K) {
      const sent = p.segs.map(s => (s.part === undefined ? K.esc(K.pickL(s.t)) : `<span class="${X}-ul"><sup>${CIRC[s.part]}</sup>${K.esc(K.pickL(s.t))}</span>`)).join('');
      const ans = `<div class="nm-nl-ans"><span class="nm-nl-anslab">${K.esc(K.lk('틀린 곳', 'Wrong part', '错的地方'))}</span>${bx('sm')}<span class="nm-nl-unit">${K.esc(K.lk('번', '', '号'))}</span>`
        + `<span class="nm-nl-anslab" style="margin-left:2mm">→ ${K.esc(K.lk('바른 수', 'Right number', '正确的数'))}</span>${bx('sm')}</div>`;
      return K.nlCard(K.nlStage(picHtml(K, p.pic.tok, p.pic.rows, 'gone', true) + `<div class="${X}-sent">${sent}</div>`), ans);
    },
    label(p, K) { return `${CIRC[p.badPart]}${K.lk('번', '', '号')} → ${p.fix.correct}`; },
    ask(p, K) { return K.lk('그림과 다른 곳을 찾아 번호를 쓰고, 바른 수를 써요', 'Find the part that does not match the picture, write its number, and write the right number', '找出和图画不同的地方，写出序号，再写出正确的数'); }
  };

  /* 카드 3택 — 그림 + ①②③ ○표 */
  P.g10_choiceCards = {
    visual(p, K) {
      const mini = !!p.stem.eq;
      const cards = p.cards.map((c, i) => `<div class="${X}-card"><span class="no">${CIRC[i]}</span>` +
        (c.rows ? picHtml(K, p.stem.tok, c.rows, 'gone', true) : '') +
        (mini ? `<span>${plain(K, c.text)}</span>` : `<b>${plain(K, c.text)}</b>`) + '</div>').join('');
      const head = p.stem.rows ? picHtml(K, p.stem.tok, p.stem.rows, 'gone') : `<div class="${X}-eq">${K.esc(p.stem.eq)}</div>`;
      return K.nlCard(K.nlStage(head + `<div class="${X}-cards">${cards}</div>`));
    },
    label(p, K) { return (K.NL_CIRC && K.NL_CIRC[p.answer]) || CIRC[p.answer]; },
    ask(p, K) {
      return p.mode === 'pic2eq' ? K.lk('그림에 맞는 식에 ○표 해요', 'Circle the equation that matches the picture', '圈出和图画相符的算式')
        : K.lk('식에 어울리는 이야기에 ○표 해요', 'Circle the story that fits the equation', '圈出和算式相配的故事');
    }
  };

  /* 조사하기 — 격자 + 표 */
  P.g10_surveyGrid = {
    visual(p, K) {
      let g = `<table class="${X}-sg">`;
      for (let r = 0; r < p.rows; r++) {
        g += '<tr>';
        for (let c = 0; c < p.cols; c++) g += `<td><span class="${X}-pi">${tok(K, p.cells[r * p.cols + c])}</span></td>`;
        g += '</tr>';
      }
      g += '</table>';
      const head = p.kinds.map(t => `<td><span class="${X}-pi">${tok(K, t)}</span></td>`).join('');
      const body = p.askMode === 'tally' ? p.kinds.map(() => '<td class="em"></td>').join('') : p.counts.map(c => `<td class="em">${c}</td>`).join('');
      const tab = `<table class="${X}-tab"><tr>${head}</tr><tr>${body}</tr></table>`;
      return K.nlCard(K.nlStage(g + tab), p.askMode === 'tally' ? '' : K.nlAnsBox(K.pickL(p.unit)));
    },
    label(p, K) {
      if (p.askMode !== 'tally') return null;
      return p.counts.join(' · ');
    },
    ask(p, K) { return p.askMode === 'tally' ? K.lk('종류별로 세어서 표에 알맞은 수를 써요', 'Count each kind and write the numbers in the table', '按种类数一数，把数填进表里') : K.pickL(p.prompt); }
  };

  /* 같게 옮기기·똑같이 나누기 — 두 접시 */
  P.g10_moveEqual = {
    visual(p, K) {
      const plate = n => {
        let it = ''; for (let i = 0; i < n; i++) it += `<span class="${X}-pi">${tok(K, p.tok)}</span>`;
        return `<div class="${X}-plate"><div class="items">${it}</div><div class="dish"></div></div>`;
      };
      return K.nlCard(K.nlStage(`<div class="${X}-plates">${plate(p.pans[0])}${plate(p.pans[1])}</div>`), K.nlAnsBox(K.EA));
    },
    label() { return null; },
    ask(p, K) {
      return p.mode === 'move'
        ? K.lk('두 접시가 똑같아지려면 몇 개를 옮겨야 할까요?', 'How many must be moved so both plates are equal?', '要移几个，两个盘子才会一样多？')
        : K.lk('한 접시에 몇 개씩 담으면 똑같을까요?', 'How many go on each plate so both are equal?', '每个盘子放几个才一样多？');
    }
  };

  /* 이야기 셈 — 두 줄 그림 / 묶음 그림 */
  P.g10_storyRows = {
    visual(p, K) {
      let inner;
      if (p.layout === 'groups') {
        inner = `<div class="${X}-bags">` + p.groups.map(n => {
          let it = ''; for (let i = 0; i < n; i++) it += `<span class="${X}-pi">${tok(K, p.tok)}</span>`;
          return `<div class="${X}-bag"><div class="nk"></div><div class="bd">${it}</div></div>`;
        }).join('') + '</div>';
      } else inner = picHtml(K, null, p.rows, p.kind === 'take' ? 'aside' : 'gone');
      return K.nlCard(K.nlStage(inner), K.nlAnsBox(K.EA));
    },
    label() { return null; },
    ask(p, K) { return K.pickL(p.prompt); }
  };

  /* ═══ G1-11 ═══ */

  const EXPR_VERBS = [['를 모두 눌러요', '를 모두 ○표 해요'], ['을 모두 눌러요', '을 모두 ○표 해요'], ['수를 모두 눌러요', '수를 모두 ○표 해요'],
    ['되게 눌러요', '되게 ○표 해요'], ['Tap every', 'Circle every'], ['Tap three', 'Circle three'], ['点出', '圈出'], ['选出三张卡片，让', '圈出三张卡片，让']];

  P.g11_numPick = {
    visual(p, K) {
      const g = G();
      let top;
      if (p.kind === 'cmp') top = `<div class="${X}-eq">${K.esc(g.eqStr(p.expr.a, p.expr.op, p.expr.b))}</div>`;
      else if (p.kind === 'range') top = `<div class="${X}-eq">${p.bounds[0]} &lt; ${p.expr.a} + <span class="${X}-bx sm"></span> &lt; ${p.bounds[1]}</div>`;
      else if (p.kind === 'sumpick') top = '';
      else top = `<div class="${X}-chips">` + p.cards.map(c => `<span class="${X}-c sq" style="width:8mm;height:10mm;font-size:17px;border-radius:1.4mm">${c}</span>`).join('') + '</div>';
      const chips = `<div class="${X}-chips">` + p.chips.map(c => `<span class="${X}-c">${c}</span>`).join('') + '</div>';
      return K.nlCard(K.nlStage(top + chips));
    },
    label(p) { return (p.solution || []).slice().sort((a, b) => a - b).join(', '); },
    ask(p, K) { return swapVerbs(K, p, EXPR_VERBS); }
  };

  const starSvg = () => {
    const pts = Array.from({ length: 10 }, (_, k) => { const r = k % 2 ? 11 : 24, a = -Math.PI / 2 + k * Math.PI / 5; return (30 + r * Math.cos(a)).toFixed(1) + ',' + (31 + r * Math.sin(a)).toFixed(1); }).join(' ');
    return `<svg viewBox="0 0 60 60" aria-hidden="true"><polygon points="${pts}"/></svg>`;
  };
  P.g11_eqFill = {
    visual(p, K) {
      const g = G(), e = p.eq, s = v => (v === null ? bx('wd') : `<span class="${X}-eq">${v}</span>`);
      const row = `<div class="${X}-line">${s(e.a)}<span class="${X}-eq">${e.op === '-' ? MINUS : '+'}</span>${s(e.b)}<span class="${X}-eq">=</span>${s(e.c)}</div>`;
      return K.nlCard(K.nlStage(`<div class="${X}-star">${starSvg()}<b>${p.star}</b></div>${row}`));
    },
    label(p) { return p.vals.length > 1 ? p.vals.join(', ') : null; },
    ask(p, K) { return K.lk('별의 수를 보고, 식의 빈칸에 알맞은 수를 써요', 'Look at the stars and write the right number in the blank', '看星星的数量，在算式的空格里写出合适的数'); }
  };

  P.g11_vertFill = {
    visual(p, K) {
      const c = v => (v === null ? `<div class="n">${bx()}</div>` : `<div class="n">${v}</div>`);
      return K.nlCard(K.nlStage(`<div class="${X}-vert">${c(p.a)}<div class="o">${p.op === '-' ? MINUS : '+'}</div>${c(p.b)}<div class="ln"></div>${c(p.r)}</div>`));
    },
    label() { return null; },
    ask(p, K) { return K.lk('빈칸에 알맞은 수를 써요', 'Write the right number in the blank', '在空格里写出合适的数'); }
  };

  P.g11_cardEq = {
    visual(p, K) {
      let head = '';
      if (p.kind === 'target') {
        head = `<div class="${X}-goal"><span class="${X}-dice">${Array.from({ length: p.target }, () => '<i></i>').join('')}</span><b>${p.target}</b></div>`;
        if (p.cards !== 'all9') head += `<div class="${X}-chips">` + p.cards.map(c => `<span class="${X}-c sq" style="width:7mm;height:9mm">${c}</span>`).join('') + '</div>';
        else head += `<div class="${X}-chips" style="font-size:11px;font-weight:700">1 2 3 4 5 6 7 8 9</div>`;
      } else {
        head = `<div class="${X}-chips">` + p.cards.map(c => `<span class="${X}-c sq" style="width:7.4mm;height:9.4mm;font-size:16px">${c}</span>`).join('') + '</div>';
      }
      let lines = '';
      const opMark = p.ops.length === 1 ? (p.ops[0] === '-' ? MINUS : '+') : '<span class="' + X + '-c" style="min-width:5mm;height:5mm"></span>';
      for (let i = 0; i < p.need; i++) {
        const last = p.kind === 'target' ? `<span class="${X}-eq">${p.target}</span>` : bx('sm');
        lines += `<div class="${X}-line"><span class="no">${CIRC[i]}</span>${bx('sm')}${opMark}${bx('sm')}<span class="${X}-eq">=</span>${last}</div>`;
      }
      return K.nlCard(K.nlStage(head + `<div class="${X}-lines">${lines}</div>`));
    },
    label(p, K) { return `${K.lk('예', 'e.g.', '例')} ${p.sample}`; },
    ask(p, K) { return K.pickL(p.prompt); }
  };

  P.g11_purse = {
    visual(p, K) {
      const rows = p.who.map(w => {
        let c = ''; for (let i = 0; i < w.n; i++) c += `<span class="${X}-pi">${tok(K, '🪙')}</span>`;
        return `<div class="${X}-prow"><span class="who">${tok(K, w.tok)}</span><div class="co">${c}</div></div>`;
      }).join('');
      const won = K.lk('원', ' won', '元');
      const ans = `<div class="nm-nl-ans"><span class="nm-nl-anslab">${K.esc(p.who.length === 1 ? K.lk('모두', 'In all', '一共') : K.lk('합', 'Sum', '和'))}</span>${bx('sm')}<span class="nm-nl-unit">${K.esc(won)}</span>`
        + (p.needDiff ? `<span class="nm-nl-anslab" style="margin-left:2.5mm">${K.esc(K.lk('차', 'Diff.', '差'))}</span>${bx('sm')}<span class="nm-nl-unit">${K.esc(won)}</span>` : '') + '</div>';
      return K.nlCard(K.nlStage(`<div class="${X}-purse">${rows}</div>`), ans);
    },
    label(p) { return p.needDiff ? `${p.answer}, ${p.diff}` : null; },
    ask(p, K) { return K.pickL(p.prompt); }
  };

  /* ═══ G1-12 ═══ */

  /* 합이 w 인 가르기 한 가지 — given 칸을 유지한 예시. 정답지에 쓴다 */
  function sampleParts(p) {
    const g = G(), all = g.partitions(p.whole, p.parts, p.min || 1);
    const givenIdx = Object.keys(p.given || {}).map(Number), givenVals = givenIdx.map(i => p.given[i]);
    if (p.equal) return new Array(p.parts).fill(p.whole / p.parts);
    for (const part of all) {
      const rest = part.slice(); let ok = true;
      for (const v of givenVals) { const at = rest.indexOf(v); if (at < 0) { ok = false; break; } rest.splice(at, 1); }
      if (!ok) continue;
      const out = new Array(p.parts); givenIdx.forEach(i => { out[i] = p.given[i]; });
      let k = 0; for (let i = 0; i < p.parts; i++) if (out[i] === undefined) out[i] = rest[k++];
      return out;
    }
    return all[0];
  }
  P.g12_partsFill = {
    visual(p, K) {
      const g = G();
      let body;
      if (p.distinct > 1) {
        const ways = Array.from({ length: p.distinct }, (_, i) => {
          const cells = Array.from({ length: p.parts }, () => bx('sm')).join('<span class="' + X + '-eq">+</span>');
          return `<div class="${X}-way"><span class="no" style="font-size:10px;color:#555">${CIRC[i]}</span>${cells}<span class="${X}-eq">=</span><b>${p.whole}</b></div>`;
        }).join('');
        body = `<div class="${X}-ways">${ways}</div>`;
      } else {
        body = g.partsFrame(X, p, i => (p.given && p.given[i] !== undefined ? `<b class="${X}-pf-given">${p.given[i]}</b>` : bx()), () => `<b>${p.whole}</b>`);
      }
      return K.nlCard(K.nlStage(body));
    },
    label(p, K) {
      const g = G();
      if (p.distinct > 1) {
        const all = g.partitions(p.whole, p.parts, p.min || 1).slice(0, p.distinct);
        return `${K.lk('예', 'e.g.', '例')} ` + all.map(a => a.join('+')).join(' · ');
      }
      const s = sampleParts(p);
      const blanks = p.parts - Object.keys(p.given || {}).length;
      return (p.equal || blanks <= 1) ? s.join('+') : `${K.lk('예', 'e.g.', '例')} ${s.join('+')}`;
    },
    ask(p, K) { return K.pickL(p.prompt); }
  };

  P.g12_gridGroup = {
    visual(p, K) {
      const t = '<table class="' + X + '-gg">' + p.grid.map(r => '<tr>' + r.map(v => `<td>${v}</td>`).join('') + '</tr>').join('') + '</table>';
      return K.nlCard(K.nlStage(`<div style="font-size:11px;font-weight:800">${K.esc(K.lk('목표', 'Target', '目标'))} <b style="font-size:15px">${p.target}</b></div>` + t));
    },
    label(p, K) {
      const ex = (p.solutionGroups || []).map(g => g.map(c => `(${c[0]},${c[1]})`).join('')).join(' · ');
      return `${K.lk('예', 'e.g.', '例')} ${ex}`;
    },
    ask(p, K) { return K.pickL(p.prompt) + K.lk(' 묶을 때는 ○로 둘러싸요.', ' Draw a circle around each group.', ' 用圈把每一组圈起来。'); }
  };

  P.g12_eqScale = {
    visual(p, K) {
      const pan = (x, pn) => {
        const sym = pn.op ? (pn.op === '-' ? MINUS : '+') : '○';
        return `<line x1="${x}" y1="22" x2="${x - 20}" y2="60"/><line x1="${x}" y1="22" x2="${x + 20}" y2="60"/>` +
          `<path class="pan" d="M${x - 24} 60 L${x + 24} 60 L${x + 17} 70 L${x - 17} 70 Z"/>` +
          `<text x="${x}" y="84">${pn.a} ${sym} ${pn.b}</text>`;
      };
      const svg = `<svg class="${X}-es" viewBox="0 0 180 92" role="img" aria-label="${K.esc(K.lk('양팔저울', 'Balance scale', '天平'))}">` +
        `<line x1="22" y1="22" x2="158" y2="22" style="stroke-width:2.6"/><line x1="90" y1="22" x2="90" y2="78"/><line x1="72" y1="78" x2="108" y2="78" style="stroke-width:2.6"/>` +
        pan(46, p.pans[0]) + pan(134, p.pans[1]) + '</svg>';
      return K.nlCard(K.nlStage(svg));
    },
    label(p) {
      const g = G();
      const ops = p.pans.map(x => x.op); let k = 0;
      p.pans.forEach((x, i) => { if (!x.op) ops[i] = p.sol[k++] === 1 ? '+' : '-'; });
      const t = (x, o) => `${x.a}${o === '-' ? '－' : '＋'}${x.b}`;
      return `${t(p.pans[0], ops[0])} = ${t(p.pans[1], ops[1])}`;
    },
    ask(p, K) { return K.lk('양쪽 식의 결과가 같아지게 ○에 ＋ 또는 －를 써요', 'Write + or − in each circle so both sides give the same result', '在○里写＋或－，让两边的结果一样'); }
  };
})();
