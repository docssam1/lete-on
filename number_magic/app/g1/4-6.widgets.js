/* ============================================================
   G1-4·5·6호 화면 위젯 — window.NM_WIDGET_EXT['이름'] = function(problem, container, onAnswer, KIT) {...}
   KIT = { art, esc, shake, buildNumpad, renderKaTeX }
   답 계약: 위젯은 onAnswer(숫자 하나)만 부른다. 호스트가 +val === problem.answer 로 채점한다.
     · 열린 활동(정답이 여럿)은 위젯이 안에서 판정해 맞으면 onAnswer(problem.answer), 틀리면 shake 후 onAnswer(-1).
     · 보기 고르기(choices)는 1부터 센 보기 번호, 숫자 칩(chips)은 그 숫자 값.
   보기·좌표는 전부 생성기가 정해 problem 에 실어 준다 — 위젯 안에서 Math.random 을 쓰지 않는다(인쇄·재현).
   위젯 클래스는 nm-g46- 접두(app/g1/4-6.css). 위젯 19개:
     pickCard tilePick cellCode glyphBuild g46Match g46Seq qtyOrd seatGrid g46Line g46LineDraw rankClue
     barRead chainMachine tradeScene splitDraw bondNum crossLeave g46Sum rabbitGrid
   ============================================================ */
(function () {
  'use strict';
  window.NM_WIDGET_EXT = window.NM_WIDGET_EXT || {};
  const EXT = window.NM_WIDGET_EXT;

  /* ── 공용 도구 ─────────────────────────────────────────── */
  function L(x) {
    if (x == null) return '';
    if (typeof x !== 'object') return String(x);
    if (window.NM_L) return window.NM_L(x);
    return x.ko || x.en || '';
  }
  const t3 = (ko, en, zh) => L({ ko, en, zh });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const FRIENDS = ['🧒', '👧', '👦', '🧑', '👩', '👨', '🧓', '👴', '👵'];
  function div(cls, html) { const d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; }
  function btn(cls, html) { const b = document.createElement('button'); b.type = 'button'; b.className = cls; if (html != null) b.innerHTML = html; return b; }
  /* pointerup 탭 — 스크롤하다 떼는 손가락도 pointerup 이라 기존 위젯과 같은 방식을 쓴다 */
  function tap(el, fn) { el.addEventListener('pointerup', e => { e.stopPropagation(); fn(e); }); }
  /* 최종 판정 뒤 0.7초간 입력을 막는다(기존 위젯과 같은 규약) */
  function guard() { let lock = false; return { busy: () => lock, hit: () => { lock = true; setTimeout(() => { lock = false; }, 700); } }; }
  function replayBtn(p) {
    const b = btn('nm-sc-replay nm-g46-replay', '🔊');
    b.setAttribute('aria-label', t3('다시 듣기', 'Listen again', '再听一遍'));
    tap(b, () => { if (window.NM_SAY && window.NM_L) window.NM_SAY(window.NM_L(p.prompt)); });
    return b;
  }
  function mount(p, container, cls, withReplay) {
    const root = div('nm-g46 ' + cls);
    if (withReplay !== false) root.appendChild(replayBtn(p));
    container.appendChild(root);
    return root;
  }
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const sum = a => a.reduce((x, y) => x + y, 0);
  /* 숫자 칩 줄 — 누르면 즉시 판정. 맞으면 onRight(v) 로 칸을 채우게 한다. */
  function chipRow(K, chips, answer, onAnswer, g, onRight) {
    const row = div('nm-tc-choices nm-g46-chips');
    chips.forEach(v => {
      const b = btn('nm-tc-choice', String(v));
      tap(b, () => {
        if (g.busy()) return; g.hit();
        if (v === answer) { b.classList.add('on'); if (onRight) onRight(v); } else K.shake(b);
        onAnswer(v);
      });
      row.appendChild(b);
    });
    return row;
  }
  /* 숫자패드(한 자리·두 자리) — 화면 + 패드. 확인(✓)에서 onSubmit(수). */
  function numpad(K, root, onSubmit, maxLen) {
    const screen = div('nm-numpad-screen nm-g46-screen', '&nbsp;');
    const pad = div('nm-numpad nm-g46-pad');
    root.appendChild(screen); root.appendChild(pad);
    let inp = '';
    K.buildNumpad(pad, k => {
      if (k === 'ok') { if (inp === '') return; onSubmit(parseInt(inp, 10), screen); inp = ''; return; }
      if (k === 'del') inp = inp.slice(0, -1);
      else if (inp.length < (maxLen || 2)) inp += k;
      screen.textContent = inp || ' ';
    });
    return screen;
  }
  /* 토큰 한 개의 HTML(젤리 SVG·동물 SVG) */
  const tk = (K, e, cls) => `<span class="nm-g46-tk${cls ? ' ' + cls : ''}">${K.art(e)}</span>`;
  const tks = (K, e, n, cls) => { let s = ''; for (let i = 0; i < n; i++) s += tk(K, e, cls); return s; };
  const glyphOf = (sys, n) => (window.NM_ANCIENT ? window.NM_ANCIENT.glyph(sys, n) : esc(n));

  /* ── 그림 조각(stemParts) — 위젯 화면용. 인쇄는 4-6.print.js 가 같은 필드를 따로 그린다 ── */
  function personsRow(K, total, mark, chars, opts) {
    opts = opts || {};
    let s = '';
    for (let i = 0; i < total; i++) {
      const sil = opts.silhouette;
      s += `<span class="nm-g46-ppl${i === mark && !sil ? ' mark' : ''}${sil ? ' sil' : ''}">${sil ? '' : K.art((chars && chars[i]) || FRIENDS[i % FRIENDS.length])}${i === mark && !sil ? '<i class="nm-g46-hat">🎩</i>' : ''}</span>`;
    }
    return s;
  }
  function stairsHtml(K, total, mark, e) {
    let s = '';
    for (let i = 0; i < total; i++) s += `<span class="nm-g46-step${i === mark ? ' mark' : ''}" style="height:${14 + i * 9}px">${i === mark ? `<i>${K.art(e || '🐢')}</i>` : ''}</span>`;
    return `<div class="nm-g46-stairs">${s}</div>`;
  }
  function partHtml(K, part) {
    switch (part.k) {
      case 'text': return `<div class="nm-g46-text">${esc(L(part.t))}</div>`;
      case 'eq': return `<div class="nm-g46-eq">${esc(part.t)}</div>`;
      case 'dots': return `<div class="nm-g46-tkrow">${tks(K, part.e, part.n)}</div>`;
      case 'pairs': {
        if (!part.n) return `<div class="nm-g46-pairs empty"><span>0</span></div>`;
        let s = ''; for (let i = 0; i < part.n; i++) s += `<span class="nm-g46-pairslot${i % 2 ? ' r' : ''}">${tk(K, part.e, '')}</span>`;
        return `<div class="nm-g46-pairs">${s}</div>`;
      }
      case 'row': return `<div class="nm-g46-line">${part.front === 'left' ? `<small>${esc(t3('앞', 'front', '前'))}</small>` : ''}<div class="nm-g46-pplrow">${personsRow(K, part.total, part.mark, part.chars)}</div>${part.front === 'left' ? `<small>${esc(t3('뒤', 'back', '后'))}</small>` : ''}</div>`;
      case 'stairs': return stairsHtml(K, part.total, part.mark, part.e);
      case 'glyph': return `<div class="nm-g46-glyphbox big">${glyphOf(part.sys, part.n)}<b>?</b></div>`;
      case 'refs': return `<div class="nm-g46-refs">${part.list.map(r => `<span class="nm-g46-ref"><span class="nm-g46-glyphbox">${glyphOf(r.sys, r.n)}</span><b>${r.n}</b></span>`).join('')}</div>`;
      case 'cards': return `<div class="nm-g46-cards">${part.list.map(n => `<span class="nm-g46-numcard">${esc(n)}</span>`).join('')}</div>`;
      case 'groups': return `<div class="nm-g46-groups">${part.list.map((g, i) => (i ? `<span class="nm-g46-sign">${esc(part.sign || '+')}</span>` : '') + `<span class="nm-g46-grp">${tks(K, g.e, g.n)}</span>`).join('')}</div>`;
      case 'rows': return `<div class="nm-g46-rows">${part.list.map(r => `<div class="nm-g46-lrow"><b>${esc(L(r.label))}</b><span>${tks(K, r.e, r.n)}</span></div>`).join('')}</div>`;
      case 'ticket': return `<div class="nm-g46-ticket">${K.art('ticket')}<b>${esc(part.n)}</b></div>`;
      default: return '';
    }
  }
  function choiceHtml(K, c) {
    if (c == null) return '';
    if (typeof c === 'string' || typeof c === 'number') return `<span class="nm-g46-ctext">${esc(c)}</span>`;
    if (c.glyph) return `<span class="nm-g46-glyphbox">${glyphOf(c.glyph.sys, c.glyph.n)}</span>`;
    if (c.dots) return `<span class="nm-g46-tkrow">${tks(K, c.dots.e, c.dots.n)}</span>`;
    return `<span class="nm-g46-ctext">${esc(L(c.t))}</span>`;
  }

  /* ============================================================
     pickCard — 범용 보기 카드(세 호 공유). stemParts + choices(답=보기 번호) 또는 chips(답=수)
     ============================================================ */
  EXT.pickCard = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-pick');
    const stem = div('nm-g46-stem', (p.stemParts || []).map(x => partHtml(K, x)).join(''));
    root.appendChild(stem);
    const g = guard();
    if (Array.isArray(p.chips)) {
      root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g, v => {
        const q = stem.querySelector('.nm-g46-glyphbox.big b'); if (q) q.textContent = v;
      }));
      return;
    }
    const box = div('nm-g46-choices' + ((p.choices || []).length > 2 ? ' many' : ''));
    (p.choices || []).forEach((c, i) => {
      const b = btn('nm-g46-choice', `<i class="nm-g46-no">${i + 1}</i>${choiceHtml(K, c)}`);
      tap(b, () => {
        if (g.busy()) return; g.hit();
        if (i + 1 === p.answer) b.classList.add('on'); else K.shake(b);
        onAnswer(i + 1);
      });
      box.appendChild(b);
    });
    root.appendChild(box);
  };

  /* ============================================================
     tilePick — 숫자 타일. multi(모두 켜고 ✔) · count(표시하며 세고 칩으로) · single(한 칸 콕, lock 은 3×3 키패드)
     ============================================================ */
  EXT.tilePick = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-tilepick ' + (p.theme === 'lock' ? 'lock' : ''));
    const inter = p.interaction, g = guard();
    const clues = Array.isArray(p.clueText) ? p.clueText : [];
    if (clues.length) {
      const cl = div('nm-g46-clues', clues.map(c => `<span class="nm-g46-clue">${p.theme === 'lock' ? '🔑' : '🔎'} ${esc(L(c))}</span>`).join(''));
      root.appendChild(cl);
    }
    if (p.theme === 'lock') root.appendChild(div('nm-g46-padlock', K.art('padlock')));
    const grid = div('nm-g46-tiles' + (p.theme === 'lock' ? ' pad' : ''));
    const on = new Set(), els = {};
    p.tiles.forEach(v => {
      const b = btn('nm-g46-tile', String(v));
      els[v] = b;
      tap(b, () => {
        if (g.busy()) return;
        if (inter === 'single') {
          g.hit();
          if (v === p.answer) b.classList.add('on'); else K.shake(b);
          onAnswer(v); return;
        }
        if (on.has(v)) { on.delete(v); b.classList.remove('on'); } else { on.add(v); b.classList.add('on'); }
      });
      grid.appendChild(b);
    });
    root.appendChild(grid);
    if (inter === 'multi') {
      const ok = btn('nm-tm-done nm-g46-done', '✔');
      tap(ok, () => {
        if (g.busy() || !on.size) return; g.hit();
        const want = new Set(p.ok);
        const same = on.size === want.size && [...on].every(v => want.has(v));
        if (same) onAnswer(p.answer); else { K.shake(grid); onAnswer(-1); }
      });
      root.appendChild(ok);
    }
    if (inter === 'count') root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g));
  };

  /* ============================================================
     cellCode — 도형수. 칸마다 값이 달라 ○가 놓인 칸 값의 합이 수. read · make · make2 · pickMax
     ============================================================ */
  function ccGrid(K, p, lit, cls, mini) {
    const { cols, rows } = p.layout;
    let s = '';
    for (let i = 0; i < cols * rows; i++) {
      const isOn = lit.indexOf(i) >= 0;
      s += `<span class="nm-g46-cc${isOn ? ' on' : ''}" data-i="${i}">${p.showVals && !mini ? `<small>${p.vals[i]}</small>` : ''}${isOn ? '<i></i>' : ''}</span>`;
    }
    return `<div class="nm-g46-ccgrid ${cls || ''}${cols === 1 ? ' tall' : ''}" style="--cols:${cols}">${s}</div>`;
  }
  EXT.cellCode = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-cellcode');
    const g = guard(), inter = p.interaction;
    if (!p.showVals && inter !== 'pickMax' || (inter === 'pickMax')) {
      const leg = div('nm-g46-legend', `<small>${esc(t3('약속', 'Rule', '约定'))}</small>` + (p.legend || []).map(l => `<span class="nm-g46-legitem">${ccGrid(K, p, l.lit, 'mini', true)}<b>${l.n}</b></span>`).join(''));
      root.appendChild(leg);
    }
    if (inter === 'read') {
      root.appendChild(div('nm-g46-ccwrap', ccGrid(K, p, p.lit, 'big')));
      root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g));
      return;
    }
    if (inter === 'pickMax') {
      const row = div('nm-g46-figs');
      p.figs.forEach((f, i) => {
        const b = btn('nm-g46-fig', `<i class="nm-g46-no">${i + 1}</i>${ccGrid(K, p, f.lit, 'mid', true)}`);
        tap(b, () => { if (g.busy()) return; g.hit(); if (i + 1 === p.answer) b.classList.add('on'); else K.shake(b); onAnswer(i + 1); });
        row.appendChild(b);
      });
      root.appendChild(row); return;
    }
    /* make · make2 */
    const lit = new Set(); let firstWay = null;
    const goal = div('nm-g46-goal', `🎯 <b>${p.target}</b>` + (inter === 'make2' ? `<small class="nm-g46-way">${esc(t3('방법 1', 'Way 1', '方法1'))}</small>` : ''));
    root.appendChild(goal);
    const wrap = div('nm-g46-ccwrap', ccGrid(K, p, [], 'big tapgrid'));
    root.appendChild(wrap);
    const gridEl = wrap.firstChild, msg = div('nm-g46-msg', '');
    root.appendChild(msg);
    gridEl.querySelectorAll('.nm-g46-cc').forEach(c => tap(c, () => {
      if (g.busy()) return; const i = +c.dataset.i;
      if (lit.has(i)) { lit.delete(i); c.classList.remove('on'); c.innerHTML = p.showVals ? `<small>${p.vals[i]}</small>` : ''; }
      else { lit.add(i); c.classList.add('on'); c.innerHTML = (p.showVals ? `<small>${p.vals[i]}</small>` : '') + '<i></i>'; }
    }));
    const done = btn('nm-tm-done nm-g46-done', '✔');
    tap(done, () => {
      if (g.busy() || !lit.size) return;
      const total = sum([...lit].map(i => p.vals[i])), key = [...lit].sort().join(',');
      if (total !== p.target) { g.hit(); K.shake(gridEl); msg.textContent = t3('합이 달라요', 'The sum is different', '和不对'); onAnswer(-1); return; }
      if (inter === 'make2') {
        if (firstWay == null) {
          firstWay = key; lit.clear();
          gridEl.querySelectorAll('.nm-g46-cc').forEach((c, i) => { c.classList.remove('on'); c.innerHTML = p.showVals ? `<small>${p.vals[i]}</small>` : ''; });
          goal.querySelector('.nm-g46-way').textContent = t3('방법 2 — 다른 방법으로 또!', 'Way 2 — a different way!', '方法2——换个方法！');
          msg.textContent = ''; return;
        }
        if (key === firstWay) { K.shake(gridEl); msg.textContent = t3('다른 방법으로!', 'Try a different way!', '换个方法！'); return; }
      }
      g.hit(); onAnswer(p.answer);
    });
    root.appendChild(done);
  };

  /* ============================================================
     glyphBuild — 고대 숫자 기호 쌓기. 부품 단추 + ↩ + ✔ (한 5묶음 안 낱개는 4개까지: 표준형 강제)
     ============================================================ */
  EXT.glyphBuild = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-glyphbuild');
    const g = guard(), A = window.NM_ANCIENT;
    root.appendChild(div('nm-g46-refs', (p.refs || []).map(r => `<span class="nm-g46-ref"><span class="nm-g46-glyphbox">${glyphOf(p.sys, r.n)}</span><b>${r.n}</b></span>`).join('')));
    root.appendChild(div('nm-g46-goal', `🎯 <b>${p.target}</b>`));
    const board = div('nm-g46-gboard'); root.appendChild(board);
    const stack = []; let ones = 0, fives = 0;
    const hasFive = (p.parts || []).some(x => x.v === 5);
    const paint = () => {
      const n = ones + 5 * fives;
      board.innerHTML = n ? glyphOf(p.sys, n) : `<span class="nm-g46-empty">${esc(t3('여기에 쌓아요', 'Build here', '拼在这里'))}</span>`;
    };
    paint();
    const bar = div('nm-g46-parts');
    (p.parts || []).forEach(part => {
      const b = btn('nm-g46-part', A ? A.part(p.sys, part.v === 5 ? 'five' : 'one') : String(part.v));
      tap(b, () => {
        if (g.busy()) return;
        if (part.v === 5) { if (fives >= 1) { K.shake(b); return; } fives++; }
        else { if (ones >= (hasFive ? 4 : 9)) { K.shake(b); return; } ones++; }
        stack.push(part.v); paint();
      });
      bar.appendChild(b);
    });
    const undo = btn('nm-g46-part undo', '↩');
    tap(undo, () => { if (g.busy() || !stack.length) return; const v = stack.pop(); if (v === 5) fives--; else ones--; paint(); });
    bar.appendChild(undo);
    root.appendChild(bar);
    const ok = btn('nm-tm-done nm-g46-done', '✔');
    tap(ok, () => {
      if (g.busy() || !stack.length) return; g.hit();
      if (ones + 5 * fives === p.target) { board.classList.add('ok'); onAnswer(p.answer); } else { K.shake(board); onAnswer(-1); }
    });
    root.appendChild(ok);
  };

  /* ============================================================
     g46Match — 짝 잇기. rightType 'ancient'(기호) · 'num'(큰 숫자) · 'objs'(토큰 묶음),
     leftLabels(식 카드), matchRule 'sum'(left+right===sumTo). 선 그리기는 기존 matchLine 과 같은 .nm-ml-* 스타일
     ============================================================ */
  EXT.g46Match = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-match');
    const wrap = div('nm-ml-wrap'), arena = div('nm-ml-arena');
    wrap.appendChild(arena); root.appendChild(wrap);
    const left = p.left || [], right = p.right || [], N = left.length;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'nm-ml-lines'); arena.appendChild(svg);
    let selL = -1, remaining = N;
    const matchedL = new Set(), matchedR = new Set();
    const isPair = (i, j) => p.matchRule === 'sum' ? left[i] + right[j] === p.sumTo : left[i] === right[j];
    const colL = div('nm-ml-col'), colR = div('nm-ml-col');
    left.forEach((n, i) => {
      const c = btn('nm-ml-card nm-ml-num nm-g46-mcard', esc(p.leftLabels ? p.leftLabels[i] : n));
      tap(c, () => {
        if (matchedL.has(i)) return;
        if (selL === i) { selL = -1; c.classList.remove('sel'); return; }
        colL.querySelectorAll('.nm-ml-card').forEach(x => x.classList.remove('sel'));
        selL = i; c.classList.add('sel');
      });
      colL.appendChild(c);
    });
    right.forEach((n, j) => {
      const inner = p.rightType === 'ancient' ? glyphOf(p.sys, n) : p.rightType === 'objs' ? `<span class="nm-g46-objs">${tks(K, p.rightEm[j], n)}</span>` : `<b class="nm-g46-bignum">${n}</b>`;
      const c = btn('nm-ml-card nm-ml-dot nm-g46-mcard', inner);
      tap(c, () => {
        if (matchedR.has(j) || selL === -1) return;
        if (isPair(selL, j)) {
          const lc = colL.children[selL]; lc.classList.remove('sel'); lc.classList.add('matched'); c.classList.add('matched');
          matchedL.add(selL); matchedR.add(j); drawLine(selL, j); selL = -1; remaining--;
          if (remaining === 0) setTimeout(() => onAnswer(N), 600);
        } else { K.shake(colL.children[selL]); K.shake(c); }
      });
      colR.appendChild(c);
    });
    arena.appendChild(colL); arena.appendChild(colR);
    function drawLine(li, ri) {
      const ar = arena.getBoundingClientRect(), lR = colL.children[li].getBoundingClientRect(), rR = colR.children[ri].getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${ar.width} ${ar.height}`); svg.setAttribute('width', ar.width); svg.setAttribute('height', ar.height);
      const x1 = lR.right - ar.left, y1 = lR.top + lR.height / 2 - ar.top, x2 = rR.left - ar.left, y2 = rR.top + rR.height / 2 - ar.top;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + 18} ${x2} ${y2}`); path.setAttribute('class', 'nm-ml-line'); svg.appendChild(path);
    }
  };

  /* ============================================================
     g46Seq — 수 채우기. 줄(칩 사슬·상자) 또는 달팽이·뱀 길(layout+cells). 칩으로 고른다
     ============================================================ */
  EXT.g46Seq = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-seq');
    const g = guard();
    let fillBlank;
    if (p.layout) {
      const cells = p.cells, R0 = 9;
      let s = `<polyline class="nm-g46-pathline" points="${cells.map(c => c.x + ',' + c.y).join(' ')}"/>`;
      cells.forEach((c, i) => {
        if (i === p.ask) s += `<circle class="nm-g46-pc ask" cx="${c.x}" cy="${c.y}" r="${R0 + 1}"/><text class="nm-g46-ptx q" x="${c.x}" y="${c.y}">?</text>`;
        else if (c.v == null) s += `<circle class="nm-g46-pc hid" cx="${c.x}" cy="${c.y}" r="${R0}"/>`;
        else s += `<circle class="nm-g46-pc" cx="${c.x}" cy="${c.y}" r="${R0}"/><text class="nm-g46-ptx" x="${c.x}" y="${c.y}">${c.v}</text>`;
      });
      const box = div('nm-g46-pathbox', `<svg viewBox="0 0 100 100" class="nm-g46-path nm-g46-${p.layout}" role="img">${s}</svg>`);
      root.appendChild(box);
      fillBlank = v => { const q = box.querySelector('.nm-g46-ptx.q'); if (q) { q.textContent = v; q.classList.remove('q'); } };
    } else {
      const row = div('nm-g46-seqrow' + (p.chain ? ' chain' : ''));
      p.seq.forEach((v, i) => {
        const c = div('nm-g46-seqcell' + (i === p.blank ? ' blank' : ''), i === p.blank ? '?' : esc(v));
        row.appendChild(c);
        if (i < p.seq.length - 1) row.appendChild(div(p.chain ? 'nm-g46-link' : 'nm-g46-arr', p.chain ? '' : '→'));
        if (i === p.blank) fillBlank = n => { c.textContent = n; c.classList.add('found'); };
      });
      root.appendChild(row);
    }
    root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g, v => fillBlank && fillBlank(v)));
  };

  /* ============================================================
     qtyOrd — 몇 개(양)인 수와 몇째(순서)인 수를 구분. 장면 + 숫자 카드 두 장
     ============================================================ */
  EXT.qtyOrd = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-qtyord');
    const sc = p.scene, g = guard();
    let scene = '';
    if (sc.kind === 'line') scene = `<div class="nm-g46-line"><small>${esc(t3('앞', 'front', '前'))}</small><div class="nm-g46-pplrow">${personsRow(K, sc.total, sc.rank - 1, sc.chars)}</div><small>${esc(t3('뒤', 'back', '后'))}</small></div>`;
    else if (sc.kind === 'coins') {
      let s = ''; for (let i = 0; i < sc.total; i++) s += `<span class="nm-g46-coin${i === sc.rank - 1 ? ' big' : ''}">${K.art('🪙')}</span>`;
      scene = `<div class="nm-g46-coinrow">${s}</div>`;
    } else {
      /* 실사 시상대(2026-10-08)는 숫자 없이 오므로 계단 앞면에 1·2·3 을 얹고, 친구를 그 계단 윗면에 세운다(측정값: 계단 가운데 19/51/83%, 윗면 0.44/0.34/0.49). */
      const real = !!(window.NM_OBJECTS && NM_OBJECTS.real('podium'));
      const left = real ? (sc.rank === 1 ? 51 : sc.rank === 2 ? 19 : 83) : (sc.rank === 1 ? 50 : sc.rank === 2 ? 17 : 83);
      const ftop = real ? `top:${sc.rank === 1 ? 17 : sc.rank === 2 ? 32 : 39}px` : '';
      const nums = real ? [[2, 19, 60], [1, 51, 54], [3, 83, 64]].map(([n, x, y]) => `<b class="nm-g46-pdnum" style="left:${x}%;top:${y}%">${n}</b>`).join('') : '';
      scene = `<div class="nm-g46-podium${real ? ' real' : ''}"><span class="nm-g46-pdart">${K.art('podium')}</span>${nums}<span class="nm-g46-pdfriend" style="left:${left}%;${ftop}">${K.art('🧒')}</span></div>`
        + `<div class="nm-g46-tkrow">${tks(K, sc.e, sc.q)}</div>`;
    }
    root.appendChild(div('nm-g46-scene', scene));
    const cards = div('nm-g46-numcards');
    p.cards.forEach(cd => {
      const b = btn('nm-g46-bignumcard', `<b>${cd.n}</b>`);
      tap(b, () => {
        if (g.busy()) return; g.hit();
        if (cd.role === p.ask) b.classList.add('on'); else K.shake(b);
        onAnswer(cd.n);
      });
      cards.appendChild(b);
    });
    root.appendChild(cards);
  };

  /* ============================================================
     seatGrid — 교실 자리. 칠판(앞) 아래 책상 격자. find(칸 콕) · read(표시한 칸이 몇째 줄·칸)
     ============================================================ */
  EXT.seatGrid = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-seat');
    const g = guard();
    root.appendChild(div('nm-g46-board', `<span>${K.art('blackboard')}</span>`));
    const grid = div('nm-g46-seatgrid'); grid.style.setProperty('--cols', p.cols);
    p.occ.forEach((an, i) => {
      const r = Math.floor(i / p.cols), c = i % p.cols, isT = p.target[0] === r && p.target[1] === c;
      const cell = btn('nm-g46-seatcell' + (p.interaction === 'read' && isT ? ' marked' : ''), `<span class="nm-g46-desk">${K.art('desk')}</span><span class="nm-g46-an">${K.art(an)}</span>`);
      if (p.interaction === 'find') tap(cell, () => { if (g.busy()) return; g.hit(); if (i === p.answer) cell.classList.add('on'); else K.shake(cell); onAnswer(i); });
      else cell.tabIndex = -1;
      grid.appendChild(cell);
    });
    root.appendChild(div('nm-g46-front', `<small>▲ ${esc(t3('앞', 'front', '前'))}</small>`));
    root.appendChild(grid);
    if (p.interaction === 'read') root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g));
  };

  /* ============================================================
     g46Line — 매표소 줄. around(앞·뒤·전체 몇 명) · convert(뒤에서 k째 → 앞에서 몇째). 숫자패드
     ============================================================ */
  EXT.g46Line = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-lineask');
    const g = guard();
    if (p.textOnly) {
      root.appendChild(div('nm-g46-scene', `<div class="nm-g46-aroundtxt"><span class="nm-g46-numcard">${p.ahead}</span><span class="nm-g46-me">${K.art('🧒')}</span><span class="nm-g46-numcard">${p.behind}</span></div>`
        + `<div class="nm-g46-aroundcap"><small>${esc(t3('내 앞', 'ahead', '前面'))}</small><small>${esc(t3('나', 'me', '我'))}</small><small>${esc(t3('내 뒤', 'behind', '后面'))}</small></div>`));
    } else {
      const sil = p.scene === 'silhouette';
      root.appendChild(div('nm-g46-scene', `<div class="nm-g46-line"><span class="nm-g46-booth">${K.art('ticket-booth')}</span><div class="nm-g46-pplrow">${personsRow(K, p.total, sil ? -1 : p.mark, p.chars, { silhouette: sil })}</div></div>`
        + `<div class="nm-g46-aroundcap"><small>${esc(t3('◀ 앞(매표소)', '◀ front (booth)', '◀ 前(售票处)'))}</small><small>${esc(t3('뒤 ▶', 'back ▶', '后 ▶'))}</small></div>`));
    }
    numpad(K, root, (n, screen) => {
      if (g.busy()) return; g.hit();
      if (n !== p.answer) K.shake(screen);
      onAnswer(n);
    }, 2);
  };

  /* ============================================================
     g46LineDraw — 내 뒤에 b명 그리기. 앞 줄은 고정, 빈 칸에 친구를 눌러 채운다
     ============================================================ */
  EXT.g46LineDraw = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-linedraw');
    const g = guard();
    const ctx = p.context;
    root.appendChild(div('nm-g46-scene', `<div class="nm-g46-line"><span class="nm-g46-booth">${K.art('ticket-booth')}</span><div class="nm-g46-pplrow">${personsRow(K, ctx.mark + 1, ctx.mark, ctx.chars)}</div></div>`));
    const draw = div('nm-g46-drawarea'); root.appendChild(draw);
    const cnt = div('nm-tm-counter nm-g46-cnt', '<span class="nm-tm-cnt">0</span>'); root.appendChild(cnt);
    const slots = [], MAX = 9 - ctx.mark - 1;
    let n = 0;
    const add = btn('nm-g46-addppl', '＋'); draw.appendChild(add);
    const paint = () => {
      draw.querySelectorAll('.nm-g46-ppl').forEach(e => e.remove());
      slots.forEach((_, i) => { const s = btn('nm-g46-ppl added', K.art('🧒')); tap(s, () => { if (g.busy()) return; slots.splice(i, 1); n--; paint(); }); draw.insertBefore(s, add); });
      cnt.querySelector('.nm-tm-cnt').textContent = n;
      add.style.display = n >= MAX ? 'none' : '';
    };
    tap(add, () => { if (g.busy() || n >= MAX) return; slots.push(1); n++; paint(); });
    paint();
    const ok = btn('nm-tm-done nm-g46-done', '✔');
    tap(ok, () => { if (g.busy() || !n) return; g.hit(); if (n !== p.answer) K.shake(draw); onAnswer(n); });
    root.appendChild(ok);
  };

  /* ============================================================
     rankClue — 달리기 순위 단서. 동물을 누르면 즉시 판정(답 = 표시 순서의 index)
     ============================================================ */
  EXT.rankClue = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-rank');
    const g = guard();
    root.appendChild(div('nm-g46-ask', `<span class="nm-g46-flag">🏁</span> ${esc(t3(`${p.askRank}등은 누구?`, `Who is ${p.askRank}${['st', 'nd', 'rd'][p.askRank - 1] || 'th'}?`, `第${p.askRank}名是谁？`))}`));
    const row = div('nm-g46-animals');
    p.animals.forEach((a, i) => {
      const b = btn('nm-g46-animal', K.art(a));
      tap(b, () => { if (g.busy()) return; g.hit(); if (i === p.answer) b.classList.add('on'); else K.shake(b); onAnswer(i); });
      row.appendChild(b);
    });
    root.appendChild(row);
    const cl = div('nm-g46-rclues');
    p.clues.forEach((c, i) => {
      const ic = x => `<span class="nm-g46-ci">${K.art(p.animals[x])}</span>`;
      let icons = '';
      if (c.k === 'ahead') icons = ic(c.a) + '<em>▶▶</em>' + ic(c.b);
      else if (c.k === 'first') icons = '🥇' + ic(c.a);
      else if (c.k === 'last') icons = ic(c.a) + '🐌';
      else if (c.k === 'right_after') icons = ic(c.b) + '<em>▶</em>' + ic(c.a);
      else icons = ic(c.b) + '<em>▶</em>' + ic(c.a) + '<em>▶</em>' + ic(c.c);
      cl.appendChild(div('nm-g46-rclue', `<span class="nm-g46-ricons">${icons}</span><span class="nm-g46-rtext">${esc(L(p.clueText[i]))}</span>`));
    });
    root.appendChild(cl);
  };

  /* ============================================================
     barRead — 물건 쌓기 그림그래프. count·diff·hidden(칩) / most·least·rank(칸 콕) / same(두 칸 콕)
     ============================================================ */
  EXT.barRead = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-bar');
    const g = guard(), cats = p.cats;
    const rows = Math.max(5, Math.max.apply(null, cats.map(c => c.n)));
    const wrap = div('nm-g46-bars'); wrap.style.setProperty('--rows', rows);
    const axis = div('nm-g46-baxis'); for (let k = rows; k >= 1; k--) axis.appendChild(div('', String(k)));
    wrap.appendChild(axis);
    const sel = new Set(), tapKinds = ['most', 'least', 'rank', 'same'];
    const tapMode = tapKinds.indexOf(p.kind) >= 0;
    cats.forEach((c, i) => {
      const hidden = p.hidden === i;
      let cells = '';
      for (let k = 1; k <= rows; k++) cells += `<span class="nm-g46-bcell">${!hidden && k <= c.n ? K.art(c.e) : ''}</span>`;
      const col = btn('nm-g46-bcol' + ((p.focus || []).indexOf(i) >= 0 ? ' focus' : '') + (hidden ? ' hid' : ''), `<span class="nm-g46-bstack">${cells}${hidden ? '<b class="nm-g46-q">?</b>' : ''}</span><span class="nm-g46-bbase">${K.art(c.e)}</span>`);
      if (tapMode) tap(col, () => {
        if (g.busy()) return;
        if (p.kind === 'same') {
          if (sel.has(i)) { sel.delete(i); col.classList.remove('on'); } else { sel.add(i); col.classList.add('on'); }
          if (sel.size === 2) {
            g.hit();
            const [a, b] = [...sel];
            if (cats[a].n === cats[b].n && cats.filter(x => x.n === cats[a].n).length === 2) onAnswer(p.answer); else { K.shake(wrap); onAnswer(-1); }
          }
          return;
        }
        g.hit(); if (i === p.answer) col.classList.add('on'); else K.shake(col); onAnswer(i);
      }); else col.tabIndex = -1;
      wrap.appendChild(col);
    });
    root.appendChild(wrap);
    if (!tapMode) root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g, v => { const q = wrap.querySelector('.nm-g46-q'); if (q) q.textContent = v; }));
  };

  /* ============================================================
     chainMachine — 수 기계 연쇄. 시작 수 → [규칙] → [규칙] → … → ?  (중간 값은 숨김). 숫자패드
     ============================================================ */
  EXT.chainMachine = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-chain nm-g46-th-' + p.theme);
    const g = guard();
    let s = `<span class="nm-g46-mc start">${p.input}</span>`;
    p.rules.forEach(r => { s += `<span class="nm-g46-ar">→</span><span class="nm-g46-mc rule ${r.d > 0 ? 'up' : 'down'}"><i>${esc(r.sym)}</i><b>${r.d > 0 ? '+' : '−'}${Math.abs(r.d)}</b></span>`; });
    s += `<span class="nm-g46-ar">→</span><span class="nm-g46-mc end">?</span>`;
    root.appendChild(div('nm-g46-chainrow', s));
    numpad(K, root, (n, screen) => { if (g.busy()) return; g.hit(); if (n !== p.answer) K.shake(screen); onAnswer(n); }, 2);
  };

  /* ============================================================
     tradeScene — 주고받기. 토큰을 눌러 반대 줄로 옮긴다. after(옮겨 본 뒤 칩) · equal(같아지게 옮기고 ✔)
     ============================================================ */
  EXT.tradeScene = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-trade');
    const g = guard(), n = { a: p.a.n, b: p.b.n }, e = p.a.e;
    const board = div('nm-g46-tboard'); root.appendChild(board);
    if (p.interaction === 'after') {
      const from = p.give.from === 'a' ? p.a.name : p.b.name, to = p.give.from === 'a' ? p.b.name : p.a.name;
      root.insertBefore(div('nm-g46-give', `<b>${esc(L(from))}</b><span class="nm-g46-gv">→ ${p.give.n}${esc(t3('개', '', '个'))} →</span><b>${esc(L(to))}</b>`), board);
    }
    function paint() {
      board.innerHTML = '';
      ['a', 'b'].forEach(k => {
        const row = div('nm-g46-trow'), who = p[k].name;
        row.appendChild(div('nm-g46-tname', `<b>${esc(L(who))}</b><small>${n[k]}</small>`));
        const tokens = div('nm-g46-ttokens');
        for (let i = 0; i < n[k]; i++) {
          const t = btn('nm-g46-ttk', K.art(e));
          tap(t, () => { if (g.busy()) return; n[k]--; n[k === 'a' ? 'b' : 'a']++; paint(); });
          tokens.appendChild(t);
        }
        row.appendChild(tokens); board.appendChild(row);
      });
    }
    paint();
    if (p.interaction === 'after') root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g));
    else {
      const ok = btn('nm-tm-done nm-g46-done', '✔');
      tap(ok, () => { if (g.busy()) return; g.hit(); if (n.a === n.b) onAnswer(p.answer); else { K.shake(board); onAnswer(-1); } });
      root.appendChild(ok);
    }
  };

  /* ============================================================
     splitDraw — 한 수를 서로 다르게 가르기(열린 활동). plate·cake·paint·circle·bar
     모든 줄이 합 T(두 부분 ≥1)이고 서로 달라야 onAnswer(T), 아니면 힌트 + shake + onAnswer(-1)
     ============================================================ */
  EXT.splitDraw = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-split nm-g46-sk-' + p.skin);
    const g = guard(), T = p.total, skin = p.skin, ordered = p.distinct === 'ordered';
    const colors = p.colors || ['#e53935', '#3b8fe0'];
    let pal = 1;
    if (skin === 'paint') {
      const pb = div('nm-g46-palette');
      colors.forEach((c, i) => { const b = btn('nm-g46-pcolor' + (i === 0 ? ' sel' : ''), ''); b.style.background = c; tap(b, () => { pal = i + 1; pb.querySelectorAll('.nm-g46-pcolor').forEach((x, j) => x.classList.toggle('sel', j === i)); }); pb.appendChild(b); });
      root.appendChild(pb);
    }
    const left = div('nm-g46-left', ''); root.appendChild(left);
    const area = div('nm-g46-srows'); root.appendChild(area);
    const msg = div('nm-g46-msg', ''); root.appendChild(msg);
    const getters = [];       /* 사용자 줄마다 현재 [a,b] 를 돌려주는 함수(미완성이면 null) */

    const tokenFor = skin === 'cake' ? 'candle' : p.e;
    function plateHtml(n) { return `<span class="nm-g46-pbase">${K.art(skin === 'cake' ? 'cake' : 'plate')}</span><span class="nm-g46-ptk">${tks(K, tokenFor, n, 'sm')}</span>`; }
    function makeRow(preset, st, idx) {
      const row = div('nm-g46-srow' + (preset ? ' locked' : ''));
      if (skin === 'plate' || skin === 'cake') {
        const s = preset ? { a: preset.a, b: preset.b } : { a: 0, b: 0 };
        row.innerHTML = `<button type="button" class="nm-g46-plate" data-s="a">${plateHtml(s.a)}</button><span class="nm-g46-plus">+</span><button type="button" class="nm-g46-plate" data-s="b">${plateHtml(s.b)}</button>`;
        if (!preset) {
          row.querySelectorAll('.nm-g46-plate').forEach(pl => tap(pl, e => {
            if (g.busy()) return; const k = pl.dataset.s;
            if (e.target.closest('.nm-g46-tk')) { if (s[k] > 0) s[k]--; } else if (s[k] < 9) s[k]++;
            pl.innerHTML = plateHtml(s[k]); refresh();
          }));
          getters.push(() => [s.a, s.b]);
        }
      } else if (skin === 'paint') {
        const cells = preset ? range(1, T).map(i => (i <= preset.a ? 1 : 2)) : new Array(T).fill(0);
        let h = ''; cells.forEach((c, i) => { h += `<button type="button" class="nm-g46-pt${c ? ' c' + c : ''}" data-i="${i}"${c ? ` style="background:${colors[c - 1]}"` : ''}>${K.art(p.e)}</button>`; });
        row.innerHTML = h;
        if (!preset) {
          row.querySelectorAll('.nm-g46-pt').forEach(b => tap(b, () => {
            if (g.busy()) return; const i = +b.dataset.i;
            cells[i] = cells[i] === pal ? 0 : pal;
            b.className = 'nm-g46-pt' + (cells[i] ? ' c' + cells[i] : ''); b.style.background = cells[i] ? colors[cells[i] - 1] : ''; refresh();
          }));
          getters.push(() => (cells.every(Boolean) ? [cells.filter(x => x === 1).length, cells.filter(x => x === 2).length] : null));
        }
      } else if (skin === 'circle') {
        const s = preset ? { a: preset.a, b: preset.b } : { a: 0, b: 0 };
        const half = k => `<button type="button" class="nm-g46-half ${k}" data-s="${k}">${tks(K, p.e, s[k], 'sm')}</button>`;
        row.className += ' circ';
        row.innerHTML = `<div class="nm-g46-circle">${half('a')}<i class="nm-g46-mid"></i>${half('b')}</div>`;
        if (!preset) {
          row.querySelectorAll('.nm-g46-half').forEach(h => tap(h, e => {
            if (g.busy()) return; const k = h.dataset.s;
            if (e.target.closest('.nm-g46-tk')) { if (s[k] > 0) s[k]--; } else if (s[k] < 9) s[k]++;
            h.innerHTML = tks(K, p.e, s[k], 'sm'); refresh();
          }));
          getters.push(() => [s.a, s.b]);
        }
      } else {
        const st2 = { k: preset ? preset.a : 0 };
        let h = ''; for (let i = 0; i < T; i++) h += `<button type="button" class="nm-g46-bc" data-i="${i}"></button>`;
        row.className += ' bar'; row.innerHTML = h;
        const paintBar = () => row.querySelectorAll('.nm-g46-bc').forEach((c, i) => { c.style.background = st2.k ? (i < st2.k ? colors[0] : colors[1]) : ''; });
        paintBar();
        if (!preset) {
          row.querySelectorAll('.nm-g46-bc').forEach(c => tap(c, () => { if (g.busy()) return; const k = +c.dataset.i + 1; st2.k = st2.k === k ? 0 : k; paintBar(); refresh(); }));
          getters.push(() => (st2.k > 0 && st2.k < T ? [st2.k, T - st2.k] : null));
        }
      }
      return row;
    }
    (p.preset || []).forEach(ps => area.appendChild(makeRow(ps)));
    for (let i = 0; i < p.rows; i++) area.appendChild(makeRow(null, null, i));
    const keyOf = ab => (ordered ? ab.join(',') : ab.slice().sort().join(','));
    function status() {
      const pairs = getters.map(f => f());
      const valid = pairs.map(ab => ab && ab[0] + ab[1] === T && ab[0] >= 1 && ab[1] >= 1);
      return { pairs, valid };
    }
    function refresh() {
      const { valid } = status();
      const rowEls = area.querySelectorAll('.nm-g46-srow:not(.locked)');
      valid.forEach((v, i) => rowEls[i] && rowEls[i].classList.toggle('ok', !!v));
      const more = valid.filter(v => !v).length;
      left.innerHTML = more ? `<b>${more}</b> ${esc(t3('개 더!', 'more!', '个'))}` : `✨ ${esc(t3('다 됐어요! ✔를 눌러요', 'All set! Tap ✔', '都好了！点✔'))}`;
      msg.textContent = '';
    }
    refresh();
    const ok = btn('nm-tm-done nm-g46-done', '✔');
    tap(ok, () => {
      if (g.busy()) return;
      const { pairs, valid } = status();
      const keys = (p.preset || []).map(x => keyOf([x.a, x.b]));
      pairs.forEach((ab, i) => { if (valid[i]) keys.push(keyOf(ab)); });
      let hint = null;
      if (valid.some(v => !v)) hint = pairs.some(ab => ab && ab[0] + ab[1] !== T) || skin === 'plate' || skin === 'cake' || skin === 'circle' ? t3(`합이 ${T}이(가) 아니에요`, `The total is not ${T}`, `合起来不是${T}`) : t3('모두 채워요', 'Fill every part', '都要涂满');
      else if (new Set(keys).size !== keys.length) hint = t3('다른 방법도 찾아봐요!', 'Find different ways!', '再找找不同的分法！');
      g.hit();
      if (hint) { msg.textContent = hint; K.shake(area); onAnswer(-1); } else { area.classList.add('done'); onAnswer(p.answer); }
    });
    root.appendChild(ok);
  };

  /* ============================================================
     bondNum — 숫자 가르기 모형. fill(칩으로 빈 동그라미, bar 가 있으면 칠한 막대를 곁에) · max(모형 4개 중 빈칸 수가 가장 큰 것)
     ============================================================ */
  function treeHtml(w, a, b, hide, mini) {
    const nodes = { whole: w, a, b }, cell = k => `<span class="nm-g46-bn${hide === k ? ' q' : ''}" data-k="${k}">${hide === k ? '?' : nodes[k]}</span>`;
    return `<div class="nm-g46-bond${mini ? ' mini' : ''}"><div class="nm-g46-bt">${cell('whole')}</div><svg viewBox="0 0 100 24" class="nm-g46-bl" aria-hidden="true"><line x1="50" y1="0" x2="24" y2="24"/><line x1="50" y1="0" x2="76" y2="24"/></svg><div class="nm-g46-bb">${cell('a')}${cell('b')}</div></div>`;
  }
  EXT.bondNum = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-bondnum');
    const g = guard();
    if (p.interaction === 'max') {
      const row = div('nm-g46-figs');
      p.trees.forEach((t, i) => {
        const b = btn('nm-g46-fig', `<i class="nm-g46-no">${i + 1}</i>${treeHtml(t.whole, t.a, t.b, t.hide, true)}`);
        tap(b, () => { if (g.busy()) return; g.hit(); if (i + 1 === p.answer) b.classList.add('on'); else K.shake(b); onAnswer(i + 1); });
        row.appendChild(b);
      });
      root.appendChild(row); return;
    }
    const wrap = div('nm-g46-bwrap');
    if (p.bar) {
      let cells = ''; for (let i = 0; i < p.bar.T; i++) cells += `<span class="nm-g46-bc ${i < p.bar.k ? 'a' : 'b'}"></span>`;
      wrap.appendChild(div('nm-g46-barfig bar', cells));
    }
    const tree = div('', treeHtml(p.whole, p.a, p.b, p.hide, false)); wrap.appendChild(tree);
    root.appendChild(wrap);
    root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g, v => { const q = tree.querySelector('.nm-g46-bn.q'); if (q) { q.textContent = v; q.classList.remove('q'); q.classList.add('found'); } }));
  };

  /* ============================================================
     crossLeave — 남기기. 없앨 토큰을 눌러 ×, 남은 수가 ✹R 이 되게. ✔ 로 제출(없앤 수)
     ============================================================ */
  EXT.crossLeave = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-leave nm-g46-sk-' + p.skin);
    const g = guard(), gone = new Set();
    const head = div('nm-g46-lhead', `<span class="nm-g46-star">✹<b>${p.keep}</b></span>` + (p.eq ? `<span class="nm-g46-eqline">${p.total} − □ = ${p.keep}</span>` : ''));
    root.appendChild(head);
    const row = div('nm-g46-ltokens'); root.appendChild(row);
    const cnt = div('nm-g46-lcount', ''); root.appendChild(cnt);
    for (let i = 0; i < p.total; i++) {
      const t = btn('nm-g46-lt' + (p.skin === 'bar' ? ' cell' : ''), p.skin === 'bar' ? '' : K.art(p.e));
      tap(t, () => { if (g.busy()) return; if (gone.has(i)) { gone.delete(i); t.classList.remove('gone'); } else { gone.add(i); t.classList.add('gone'); } upd(); });
      row.appendChild(t);
    }
    function upd() { cnt.innerHTML = `${esc(t3('남은 것', 'left', '剩下'))} <b>${p.total - gone.size}</b> · ${esc(t3('없앤 것', 'removed', '去掉'))} <b>${gone.size}</b>`; }
    upd();
    const ok = btn('nm-tm-done nm-g46-done', '✔');
    tap(ok, () => { if (g.busy()) return; g.hit(); if (gone.size !== p.answer) K.shake(row); onAnswer(gone.size); });
    root.appendChild(ok);
  };

  /* ============================================================
     g46Sum — 덧셈식 합 쓰기. 두 무리 그림 + `3 + 2 = ?` + 숫자패드
     ============================================================ */
  EXT.g46Sum = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-sum');
    const g = guard();
    root.appendChild(div('nm-g46-stem', partHtml(K, { k: 'groups', list: p.groups, sign: '+' }) + `<div class="nm-g46-eq">${esc(p.eqLine)}</div>`));
    numpad(K, root, (n, screen) => { if (g.busy()) return; g.hit(); if (n !== p.answer) K.shake(screen); onAnswer(n); }, 2);
  };

  /* ============================================================
     rabbitGrid — 토끼 2×2 칸의 줄·열 합 칸. 한 칸만 ?
     ============================================================ */
  EXT.rabbitGrid = function (p, container, onAnswer, K) {
    const root = mount(p, container, 'nm-g46-rgrid');
    const g = guard(), c = p.cells;
    const rs = [c[0][0] + c[0][1], c[1][0] + c[1][1]], cs = [c[0][0] + c[1][0], c[0][1] + c[1][1]];
    const sumBox = (key, v) => `<span class="nm-g46-sbox${p.ask === key ? ' q' : ''}" data-k="${key}">${p.ask === key ? '?' : (p.show.indexOf(key) >= 0 ? v : '')}</span>`;
    const cell = n => `<span class="nm-g46-rcell">${tks(K, p.e, n, 'sm')}</span>`;
    const grid = div('nm-g46-rg', cell(c[0][0]) + cell(c[0][1]) + sumBox('row0', rs[0]) + cell(c[1][0]) + cell(c[1][1]) + sumBox('row1', rs[1])
      + sumBox('col0', cs[0]) + sumBox('col1', cs[1]) + (p.ask === 'all' ? `<span class="nm-g46-sbox q" data-k="all">?</span>` : '<span></span>'));
    root.appendChild(grid);
    root.appendChild(chipRow(K, p.chips, p.answer, onAnswer, g, v => { const q = grid.querySelector('.nm-g46-sbox.q'); if (q) { q.textContent = v; q.classList.remove('q'); } }));
  };
})();
