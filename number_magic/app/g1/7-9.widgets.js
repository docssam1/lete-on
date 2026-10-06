/* ============================================================
   G1-7·8·9호 화면 위젯 — window.NM_WIDGET_EXT['이름'] = function(problem, container, onAnswer, KIT)
   KIT = {art, esc, shake, buildNumpad, renderKaTeX}. 호스트는 `+val === problem.answer` 로 채점한다.
   · 위젯의 답은 숫자 하나. 칸마다 틀리면 흔들림 뒤 onAnswer(-1), 전부 맞으면 onAnswer(problem.answer).
   · 값을 묻는 칸은 0~9 숫자 한 줄(numRow) — 3지선다는 찍기가 33% 라 쓰지 않는다.
   · 보기 섞기는 생성기가 한다(위젯 안 Math.random 금지). 주사위 굴림 연출도 정해진 눈 순서로 돈다.
   위젯: eqFill · valuePick · hopLine · pairFind · treeFill · vertexSum · wheelFill · opGrid · ruleTable ·
         machineBox · hiddenBeads · codeBreak · sumMatch   (모양 계산은 7-9.print.js 의 NM_G79_GEO 를 함께 쓴다)
   ============================================================ */
(function () {
  'use strict';
  const EXT = window.NM_WIDGET_EXT = window.NM_WIDGET_EXT || {};
  const MN = '−';
  const lang = () => (window.S && window.S.lang) || 'ko';
  const t3 = (ko, en, zh) => { const l = lang(); return l === 'en' ? en : l === 'zh' ? zh : ko; };
  const GEO = () => window.NM_G79_GEO || {};
  const PAIR_COLORS = ['#e53935', '#3b8fe0', '#43a047', '#fb8c2e', '#8e6bd8'];
  const SVGNS = 'http://www.w3.org/2000/svg';

  function h(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function sv(tag, attrs, html) { const e = document.createElementNS(SVGNS, tag); Object.keys(attrs || {}).forEach(k => e.setAttribute(k, attrs[k])); if (html != null) e.innerHTML = html; return e; }
  function on(e, fn) { e.addEventListener('pointerup', ev => { ev.stopPropagation(); fn(ev); }); }
  const opTxt = op => (op === '-' ? MN : op);

  /* ── 0~9 숫자 한 줄(5개씩 두 줄) — 탭 즉시 입력, 확인 버튼 없음 ── */
  function numRow(host, onPick) {
    const row = h('div', 'nm-g79-numrow'), btns = [];
    for (let i = 0; i <= 9; i++) {
      const b = h('button', 'nm-g79-nbtn', String(i)); b.type = 'button'; b.dataset.n = String(i);
      on(b, () => { if (row.classList.contains('off')) return; onPick(i); });
      row.appendChild(b); btns.push(b);
    }
    host.appendChild(row);
    return {
      el: row,
      enable(v) { row.classList.toggle('off', !v); },
      hint(n) { btns.forEach(b => b.classList.toggle('hint', +b.dataset.n === n)); },
      clearHint() { btns.forEach(b => b.classList.remove('hint')); },
      range(lo, hi) { btns.forEach((b, i) => { b.disabled = i < lo || i > hi; }); }
    };
  }

  /* ── 칸 어댑터 — HTML 칸·SVG 칸을 같은 모양으로 다룬다 ── */
  function htmlCell(el, shakeEl) {
    return { el, set(v) { el.textContent = String(v); el.classList.add('done'); el.classList.remove('sel'); },
      sel(b) { el.classList.toggle('sel', b); }, shakeTarget: shakeEl || el };
  }
  function svgCell(g, textEl, shapeEl) {
    return { el: g, set(v) { textEl.textContent = String(v); g.classList.add('done'); g.classList.remove('sel'); },
      sel(b) { g.classList.toggle('sel', b); }, shakeTarget: g, shape: shapeEl };
  }

  /* 칸 여러 개를 차례로 채우는 공용 진행기. sol[i] 가 i번째 칸의 정답. 틀리면 onWrong, 다 맞으면 onDone */
  function filler(cells, sol, nr, K, onDone, onAnswer) {
    let sel = -1, done = 0, fails = 0, lock = false; const filled = [];
    const first = () => cells.findIndex((c, i) => !filled[i]);
    function select(i) { sel = i; cells.forEach((c, k) => c.sel(k === i && !filled[k])); nr.clearHint(); fails = 0; }
    cells.forEach((c, i) => on(c.el, () => { if (!filled[i] && !lock) select(i); }));
    nr.range(0, 9);
    function pick(n) {
      if (lock || sel < 0) return;
      if (n === sol[sel]) {
        filled[sel] = true; done++; cells[sel].set(n);
        if (done === sol.length) { lock = true; nr.enable(false); nr.clearHint(); onDone(); } else select(first());
      } else {
        K.shake(cells[sel].shakeTarget); fails++;
        if (fails >= 2) nr.hint(sol[sel]);
        onAnswer(-1);
      }
    }
    if (cells.length) select(0);
    return { pick, select };
  }

  function art(K, tok) { return K.art(tok); }
  function wrap(c, cls) { const r = h('div', 'nm-g79-wrap' + (cls ? ' ' + cls : '')); c.appendChild(r); return r; }

  /* ============================================================
     eqFill — 식 빈칸 + 장면(주사위·가격·도미노·동전·두 무리·○·범례)
     ============================================================ */
  function dominoSvgStr(a, b, hidden) {
    const G = GEO(), pips = G.pips || (() => []);
    const pip = (x0, n) => pips(n).map(q => `<circle cx="${(x0 + q[0] * 60).toFixed(1)}" cy="${(q[1] * 60).toFixed(1)}" r="5.4" fill="#1a2233"/>`).join('');
    const emptyHalf = x0 => `<rect x="${x0 + 6}" y="6" width="48" height="48" rx="8" fill="#fffaf0" stroke="#c9a063" stroke-width="3" stroke-dasharray="6 5"/><text x="${x0 + 30}" y="42" text-anchor="middle" font-size="30" font-weight="900" fill="#c9a063">?</text>`;
    return `<svg class="nm-g79-domino" viewBox="0 0 120 60" role="img"><rect x="1.5" y="1.5" width="117" height="57" rx="10" fill="#fff" stroke="#16417c" stroke-width="3"/><line x1="60" y1="8" x2="60" y2="52" stroke="#16417c" stroke-width="2.6"/>`
      + (hidden === 'a' ? emptyHalf(0) : pip(0, a)) + (hidden === 'b' ? emptyHalf(60) : pip(60, b)) + '</svg>';
  }

  EXT.eqFill = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-eqfill');
    const sc = p.scene, e = p.eq;
    let lock = false;
    const gate = { need: sc && sc.kind === 'dice' ? 'roll' : sc && sc.kind === 'coins' && sc.toss ? 'toss' : null };
    const sceneBox = h('div', 'nm-g79-scene'); root.appendChild(sceneBox);
    if (p.given) {
      const g = p.given;
      sceneBox.appendChild(h('div', 'nm-g79-given', `<span>${g.a}</span><span>${opTxt(g.op)}</span><span>${g.b}</span><span>=</span><span>${g.c}</span>`));
      sceneBox.appendChild(h('div', 'nm-g79-arrow', '⇩'));
    }
    const eqBox = h('div', 'nm-g79-eqbox' + (p.layout === 'v' ? ' v' : '')); root.appendChild(eqBox);
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);

    /* ── 식 칸 ── */
    const cells = {};          /* a·b·c·op → 요소 */
    function mkNum(k) {
      if (p.blank === k) { const b = h('span', 'nm-g79-bk', ''); cells[k] = b; return b; }
      if (sc && sc.kind === 'dice' && sc.slot === k) { const d = h('button', 'nm-g79-die unrolled', art(K, 'die0')); d.type = 'button'; cells.die = d; return d; }
      if (k === 'a' && e.symA) return h('span', 'nm-g79-n sym', art(K, e.symA));
      if (k === 'b' && e.symB) return h('span', 'nm-g79-n sym', art(K, e.symB));
      return h('span', 'nm-g79-n', String(e[k]));
    }
    function mkOp() {
      if (p.blank === 'op') { const b = h('span', 'nm-g79-bk lens', '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="26" cy="26" r="18" fill="#fffaf0" fill-opacity=".85" stroke="#16417c" stroke-width="5"/><line x1="40" y1="40" x2="58" y2="58" stroke="#16417c" stroke-width="7" stroke-linecap="round"/></svg><b>?</b>'); cells.op = b; return b; }
      return h('span', 'nm-g79-n op', opTxt(e.op));
    }
    if (p.layout === 'v') {
      const row = (o, k) => { const r = h('div', 'r'); r.appendChild(h('span', 'nm-g79-n op', o || '')); r.appendChild(mkNum(k)); return r; };
      eqBox.appendChild(row('', 'a'));
      const r2 = h('div', 'r'); r2.appendChild(p.blank === 'op' ? mkOp() : h('span', 'nm-g79-n op', opTxt(e.op))); r2.appendChild(mkNum('b')); eqBox.appendChild(r2);
      eqBox.appendChild(h('div', 'ln'));
      eqBox.appendChild(row('', 'c'));
    } else if (p.showEq !== false || p.blank !== 'c') {
      eqBox.appendChild(mkNum('a')); eqBox.appendChild(mkOp()); eqBox.appendChild(mkNum('b'));
      eqBox.appendChild(h('span', 'nm-g79-n op', '=')); eqBox.appendChild(mkNum('c'));
    } else {
      const b = h('span', 'nm-g79-bk', ''); cells.c = b; eqBox.appendChild(b);
      if (p.unit) eqBox.appendChild(h('span', 'nm-g79-unit', p.unit[lang()] || p.unit.ko));
    }
    if (p.showEq === false && p.blank === 'c' && p.layout !== 'v' && sc && sc.kind === 'domino') { /* 도미노: 합 칸만 */ }

    /* ── 장면 ── */
    if (sc && sc.kind === 'price') {
      const row = h('div', 'nm-g79-price');
      sc.items.forEach(it => row.appendChild(h('div', 'nm-g79-item', `<span class="ico">${art(K, it.e)}</span><span class="tag">${it.price}${t3('원', '', '元')}</span>`)));
      sceneBox.appendChild(row);
    } else if (sc && sc.kind === 'domino') {
      sceneBox.appendChild(h('div', 'nm-g79-dominowrap', dominoSvgStr(sc.a, sc.b, sc.hidden)));
      if (sc.hidden) sceneBox.appendChild(h('div', 'nm-g79-cap', `${t3('합', 'Total', '合')} <b>${e.c}</b>`));
    } else if (sc && sc.kind === 'legend') {
      sceneBox.appendChild(h('div', 'nm-g79-legend', sc.map.map(m => `<span class="lg"><span class="ico">${art(K, m.e)}</span><b>= ${m.v}</b></span>`).join('')));
    } else if (sc && sc.kind === 'group2') {
      const g = x => `<span class="grp">${Array.from({ length: x.n }, () => `<span class="ico">${art(K, x.e)}</span>`).join('')}</span>`;
      sceneBox.appendChild(h('div', 'nm-g79-groups', g(sc.a) + g(sc.b)));
    } else if (sc && sc.kind === 'coins') {
      const coinsBox = h('div', 'nm-g79-coins'); sceneBox.appendChild(coinsBox);
      const mk = i => h('span', 'coin ' + (sc.faces[i] === 's' ? 'star' : 'moon'), art(K, sc.faces[i] === 's' ? 'coin-star' : 'coin-moon'));
      if (!sc.toss) sc.faces.forEach((f, i) => coinsBox.appendChild(mk(i)));
      else {
        const cup = h('button', 'nm-g79-toss', `<span class="cup">🥤</span><b>${t3('던지기!', 'Toss!', '扔！')}</b>`); cup.type = 'button';
        sceneBox.insertBefore(cup, coinsBox);
        on(cup, () => {
          if (gate.need !== 'toss') return;
          cup.classList.add('gone'); gate.need = 'tossing';
          sc.faces.forEach((f, i) => setTimeout(() => {
            const co = mk(i); co.classList.add('flip'); coinsBox.appendChild(co);
            if (i === sc.faces.length - 1) setTimeout(() => { gate.need = null; nr && nr.enable(true); }, 420);
          }, 170 * i));
        });
      }
    } else if (sc && sc.kind === 'dots') {
      /* ○ 쌓기 판 — 이미 놓인 ○ given 개 + 눌러서 더하는 ○ */
      const board = h('div', 'nm-g79-dotsboard'); sceneBox.appendChild(board);
      let added = 0; const target = cells[p.blank];
      const paint = () => {
        board.innerHTML = Array.from({ length: sc.given }, () => '<i class="dot given"></i>').join('')
          + Array.from({ length: added }, () => '<i class="dot add"></i>').join('') + (added + sc.given < 9 ? '<i class="dot ghost">＋</i>' : '');
        if (target) target.textContent = added ? String(added) : '';
      };
      paint();
      on(board, ev => {
        if (lock) return;
        const hit = ev.target.closest('.dot.add');
        if (hit) { added = Math.max(0, added - 1); paint(); return; }
        if (sc.given + added < 9) { added++; paint(); }
      });
      const done = h('button', 'nm-tm-done', '✔'); done.type = 'button'; inBox.appendChild(done);
      on(done, () => {
        if (lock || !added) return;
        if (added === p.answer) { lock = true; target.classList.add('done'); onAnswer(p.answer); }
        else { K.shake(board); onAnswer(-1); added = 0; paint(); }
      });
    }

    /* ── 주사위 굴리기 ── */
    let nr = null;
    if (gate.need === 'roll') {
      const die = cells.die, face = sc.face;
      const hint = h('div', 'nm-g79-hint', t3('주사위를 눌러 굴려요', 'Tap the die to roll it', '点一点骰子来掷')); sceneBox.appendChild(hint);
      on(die, () => {
        if (gate.need !== 'roll') return;
        gate.need = 'rolling'; die.classList.add('rolling');
        let k = 0; const seq = [3, 5, 2, 6, 1, 4];
        const iv = setInterval(() => {
          k++;
          if (k < 8) die.innerHTML = art(K, 'die' + seq[(k + face) % 6]);
          else { clearInterval(iv); die.innerHTML = art(K, 'die' + face); die.classList.remove('rolling', 'unrolled'); gate.need = null; hint.remove(); nr && nr.enable(true); }
        }, 95);
      });
    }

    /* ── 입력: 부호 버튼 / 숫자 한 줄 / ○ 판(위에서 처리) ── */
    if (p.blank === 'op') {
      const choices = p.opChoices || ['+', '-'];
      const code = ch => (ch === '+' ? 1 : ch === '-' ? 2 : 3);
      const bar = h('div', 'nm-g79-opbar'); inBox.appendChild(bar);
      choices.forEach(ch => {
        const b = h('button', 'nm-g79-opbtn', ch === 'none' ? '✕' : ch === '-' ? MN : ch); b.type = 'button';
        on(b, () => {
          if (lock) return;
          if (code(ch) === p.answer) { lock = true; const t = cells.op; t.classList.add('done'); t.classList.remove('lens'); t.innerHTML = ch === 'none' ? '✕' : ch === '-' ? MN : ch; onAnswer(p.answer); }
          else { K.shake(b); onAnswer(-1); }
        });
        bar.appendChild(b);
      });
    } else if (!(sc && sc.kind === 'dots')) {
      const target = cells[p.blank];
      nr = numRow(inBox, n => {
        if (lock || gate.need) return;
        if (n === p.answer) { lock = true; target.textContent = String(n); target.classList.add('done'); nr.enable(false); onAnswer(p.answer); }
        else { K.shake(target); onAnswer(-1); fails(); }
      });
      let f = 0; const fails = () => { f++; if (f >= 2) nr.hint(p.answer); };
      if (gate.need) nr.enable(false);
      if (target) target.classList.add('sel');
    }
  };

  /* ============================================================
     valuePick — 식·짝 칩에서 고르기(같은 값·하나 고르기·개수·차례)
     ============================================================ */
  EXT.valuePick = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-vpick');
    const grid = h('div', 'nm-g79-chips'); root.appendChild(grid);
    let lock = false, nextRank = 1;
    const single = p.mode === 'pick';
    const sel = new Set();
    const els = p.chips.map((ch, i) => {
      const b = h('button', 'nm-g79-chip' + (p.mode === 'order' ? ' ord' : ''), `${ch.e ? `<span class="ico">${art(K, ch.e)}</span>` : ''}<span class="tx">${K.esc(ch.txt)}</span><i class="rk"></i>`);
      b.type = 'button'; grid.appendChild(b);
      on(b, () => {
        if (lock) return;
        if (single) {
          if (ch.ok) { lock = true; b.classList.add('ok'); onAnswer(p.answer); } else { K.shake(b); onAnswer(-1); }
          return;
        }
        if (p.mode === 'order') {
          if (b.classList.contains('ok')) return;
          if (ch.rank === nextRank) {
            b.classList.add('ok'); b.querySelector('.rk').textContent = String(nextRank); nextRank++;
            if (nextRank > p.chips.length) { lock = true; onAnswer(p.answer); }
          } else { K.shake(b); onAnswer(-1); }
          return;
        }
        if (sel.has(i)) { sel.delete(i); b.classList.remove('on'); } else { sel.add(i); b.classList.add('on'); }
        okBtn && okBtn.classList.toggle('ready', sel.size > 0);
      });
      return b;
    });
    let okBtn = null;
    if (!single && p.mode !== 'order') {
      const cnt = h('div', 'nm-g79-cap', '');
      okBtn = h('button', 'nm-tm-done', '✔'); okBtn.type = 'button'; root.appendChild(okBtn);
      on(okBtn, () => {
        if (lock || !sel.size) return;
        const good = p.chips.every((ch, i) => sel.has(i) === !!ch.ok);
        if (good) { lock = true; els.forEach((b, i) => { if (p.chips[i].ok) b.classList.add('ok'); }); onAnswer(p.answer); }
        else { K.shake(grid); onAnswer(-1); sel.clear(); els.forEach(b => b.classList.remove('on')); okBtn.classList.remove('ready'); }
      });
    }
  };

  /* ============================================================
     hopLine — 수직선 뛰기(읽기 · 눈금을 눌러 호 그리기 · 자유형 □+□=c)
     ============================================================ */
  EXT.hopLine = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-hop');
    const W = 320, Hh = 150, y0 = 108, X = v => 16 + v * (288 / 9);
    const stage = h('div', 'nm-g79-hopstage'); root.appendChild(stage);
    const svg = sv('svg', { viewBox: `0 0 ${W} ${Hh}`, class: 'nm-g79-hopsvg', role: 'img' }); stage.appendChild(svg);
    svg.appendChild(sv('line', { x1: 6, y1: y0, x2: W - 6, y2: y0, class: 'base' }));
    for (let v = 0; v <= 9; v++) {
      svg.appendChild(sv('line', { x1: X(v), y1: y0 - 6, x2: X(v), y2: y0 + 6, class: 'tick' }));
      svg.appendChild(sv('text', { x: X(v), y: y0 + 26, 'text-anchor': 'middle', class: 'tlab' }, String(v)));
    }
    const arcs = sv('g', {}); svg.appendChild(arcs);
    const mover = h('div', 'nm-g79-mover', art(K, p.mover || 'frog')); stage.appendChild(mover);
    const placeMover = v => { mover.style.left = (X(v) / W * 100) + '%'; };
    placeMover(0);
    function drawArc(from, to, idx) {
      const x1 = X(from), x2 = X(to), mx = (x1 + x2) / 2, peak = Math.min(78, 22 + Math.abs(to - from) * 8) + idx * 6;
      const cy = y0 - peak * 1.7, ang = Math.atan2(y0 - cy, x2 - mx) * 180 / Math.PI;
      const col = idx === 0 ? '#3b8fe0' : '#fb8c2e';
      const g = sv('g', { class: 'arc' });
      g.appendChild(sv('path', { d: `M${x1} ${y0 - 3} Q${mx} ${cy} ${x2} ${y0 - 3}`, fill: 'none', stroke: col, 'stroke-width': 4.2, 'stroke-linecap': 'round' }));
      g.appendChild(sv('polygon', { points: '0,0 -13,-7 -13,7', fill: col, transform: `translate(${x2} ${y0 - 4}) rotate(${ang})` }));
      arcs.appendChild(g);
    }
    const e = p.eq;
    const eqBox = h('div', 'nm-g79-eqbox'); root.appendChild(eqBox);
    const cells = {};
    const mk = k => { if (p.blank === k || (p.blank === 'ab' && (k === 'a' || k === 'b'))) { const b = h('span', 'nm-g79-bk', ''); cells[k] = b; return b; } return h('span', 'nm-g79-n', String(e[k])); };
    eqBox.appendChild(mk('a')); eqBox.appendChild(h('span', 'nm-g79-n op', opTxt(e.op))); eqBox.appendChild(mk('b')); eqBox.appendChild(h('span', 'nm-g79-n op', '=')); eqBox.appendChild(mk('c'));
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);
    let lock = false, nr = null;

    if (p.mode === 'read') {
      p.hops.forEach((hp, i) => { if (hp.from !== hp.to) drawArc(hp.from, hp.to, i); });
      setTimeout(() => placeMover(p.hops[0].to), 350); setTimeout(() => placeMover(p.hops[1].to), 950);
    } else {
      const hint = h('div', 'nm-g79-hint', p.free ? t3('눈금을 하나 눌러 개구리를 뛰게 해요', 'Tap a tick to make the frog hop', '点一个刻度，让青蛙跳') : t3('눈금을 차례로 눌러 호를 그려요', 'Tap the ticks in order to draw the hops', '依次点刻度画出跳的路线'));
      root.insertBefore(hint, eqBox);
      let step = 0;
      const ticks = h('div', 'nm-g79-ticks'); stage.appendChild(ticks);
      for (let v = 0; v <= 9; v++) {
        const t = h('button', 'nm-g79-tickbtn', ''); t.type = 'button'; t.style.left = (X(v) / W * 100) + '%'; t.setAttribute('aria-label', String(v));
        on(t, () => {
          if (lock || step >= 2) return;
          if (p.free) {
            if (v < p.range[0] || v > p.range[1]) { K.shake(t); onAnswer(-1); return; }
            lock = true; drawArc(0, v, 0); placeMover(v); cells.a.textContent = String(v); cells.a.classList.add('done');
            setTimeout(() => { drawArc(v, e.c, 1); placeMover(e.c); cells.b.textContent = String(Math.abs(v - e.c)); cells.b.classList.add('done'); }, 520);
            setTimeout(() => onAnswer(p.answer), 1150);
            return;
          }
          const want = step === 0 ? p.hops[0].to : p.hops[1].to;
          if (v !== want) { K.shake(t); onAnswer(-1); return; }
          drawArc(step === 0 ? 0 : p.hops[0].to, v, step); placeMover(v); step++;
          if (step === 2) { hint.remove(); nr && nr.enable(true); ticks.classList.add('off'); }
        });
        ticks.appendChild(t);
      }
    }
    if (!p.free) {
      const target = cells[p.blank];
      let f = 0;
      nr = numRow(inBox, n => {
        if (lock) return;
        if (n === p.answer) { lock = true; target.textContent = String(n); target.classList.add('done'); nr.enable(false); onAnswer(p.answer); }
        else { K.shake(target); onAnswer(-1); f++; if (f >= 2) nr.hint(p.answer); }
      });
      target.classList.add('sel');
      if (p.mode !== 'read') nr.enable(false);
    }
  };

  /* ============================================================
     pairFind — 합·차가 알맞은 두 수 찾기 (ring · scatter · grid · row · cards)
     두 수를 차례로 탭 → 규칙(합/차)·위치(adj)·안 쓴 수이면 같은 색으로 묶임. 묶인 수를 다시 누르면 풀림.
     ============================================================ */
  EXT.pairFind = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-pf');
    const it = p.items, lay = p.layout;
    const stage = h('div', 'nm-g79-pfstage ' + lay + (p.shape ? ' ' + p.shape : '') + (p.skin ? ' ' + p.skin : '') + (lay === 'grid' ? ' g' + p.size : '')); root.appendChild(stage);
    const lines = (lay === 'ring' || lay === 'scatter') ? sv('svg', { class: 'nm-g79-pflines', viewBox: '0 0 100 100', preserveAspectRatio: 'none' }) : null;
    const els = [];
    if (lay === 'ring') {
      const outline = p.shape === 'circle' ? '<circle cx="50" cy="50" r="38" fill="none" stroke="#c8b583" stroke-width="1.2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>'
        : '<rect x="12" y="12" width="76" height="76" rx="3" fill="none" stroke="#c8b583" stroke-width="1.2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>';
      const bg = sv('svg', { class: 'nm-g79-pfbg', viewBox: '0 0 100 100', preserveAspectRatio: 'none' }, outline); stage.appendChild(bg);
    }
    if (lines) stage.appendChild(lines);
    if (p.skin === 'fish') stage.appendChild(h('span', 'nm-g79-fishbg', art(K, '🐟')));
    it.forEach((x, i) => {
      let b;
      if (lay === 'scatter') {
        b = h('button', 'nm-g79-pfit sc', K.art('num:' + x.v, x.f));
        b.style.left = x.x + '%'; b.style.top = x.y + '%'; b.style.setProperty('--r', (x.r | 0) + 'deg'); b.style.setProperty('--s', x.s);
      } else if (lay === 'ring') {
        b = h('button', 'nm-g79-pfit rg', String(x.v)); b.style.left = x.x + '%'; b.style.top = x.y + '%';
      } else if (lay === 'grid') {
        b = h('button', 'nm-g79-pfit gd', String(x.v)); b.style.gridRow = String(x.r + 1); b.style.gridColumn = String(x.c + 1);
      } else if (lay === 'row') {
        b = h('button', 'nm-g79-pfit rw', String(x.v));
      } else { b = h('button', 'nm-g79-pfit cd', String(x.v)); }
      b.type = 'button'; stage.appendChild(b); els.push(b);
    });
    const eqs = h('div', 'nm-g79-pfeqs'); if (p.showEq) root.appendChild(eqs);
    const cnt = h('div', 'nm-g79-cap nm-g79-pfcnt', ''); root.appendChild(cnt);
    const paintCnt = () => { cnt.textContent = `${pairs.filter(Boolean).length} / ${p.need}`; };

    function adjOK(i, j) {
      if (p.adj === 'any') return true;
      if (p.adj === 'row') return Math.abs(i - j) === 1;
      const A = it[i], B = it[j], dr = Math.abs(A.r - B.r), dc = Math.abs(A.c - B.c);
      return p.adj === '4' ? dr + dc === 1 : (Math.max(dr, dc) === 1);
    }
    const okVal = (a, b) => (p.rule.op === 'sum' ? a + b === p.rule.target : Math.abs(a - b) === p.rule.target);
    const pairs = [];               /* {i,j,col,line,chip} 또는 undefined(해제됨) */
    const owner = new Array(it.length).fill(-1);
    let sel = -1, lock = false, usedColors = 0;
    paintCnt();

    function clearSel() { if (sel >= 0) els[sel].classList.remove('sel'); sel = -1; }
    function release(k) {
      const q = pairs[k]; if (!q) return;
      [q.i, q.j].forEach(x => { owner[x] = -1; els[x].classList.remove('paired'); els[x].style.removeProperty('--pc'); });
      if (q.line) q.line.remove(); if (q.chip) q.chip.remove();
      pairs[k] = null; paintCnt();
    }
    function link(i, j) {
      const k = pairs.length, col = PAIR_COLORS[usedColors++ % PAIR_COLORS.length];
      [i, j].forEach(x => { owner[x] = k; els[x].classList.add('paired'); els[x].style.setProperty('--pc', col); });
      const q = { i, j, col };
      if (lines) {
        q.line = sv('line', { x1: it[i].x, y1: it[i].y, x2: it[j].x, y2: it[j].y, stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', 'vector-effect': 'non-scaling-stroke' });
        lines.appendChild(q.line);
      }
      if (p.showEq) {
        const hi = Math.max(it[i].v, it[j].v), lo = Math.min(it[i].v, it[j].v);
        const txt = p.rule.op === 'sum' ? `${it[i].v} + ${it[j].v} = ${p.rule.target}` : `${hi} ${MN} ${lo} = ${p.rule.target}`;
        q.chip = h('span', 'nm-g79-pfeq', txt); q.chip.style.setProperty('--pc', col); eqs.appendChild(q.chip);
      }
      pairs[k] = q; paintCnt();
    }
    els.forEach((b, i) => on(b, () => {
      if (lock) return;
      if (owner[i] >= 0) { release(owner[i]); clearSel(); return; }
      if (sel < 0) { sel = i; b.classList.add('sel'); return; }
      if (sel === i) { clearSel(); return; }
      const j = sel; clearSel();
      if (owner[j] < 0 && okVal(it[i].v, it[j].v) && adjOK(i, j)) {
        link(j, i);
        if (pairs.filter(Boolean).length >= p.need) { lock = true; setTimeout(() => onAnswer(p.need), 250); }
      } else { K.shake(b); K.shake(els[j]); onAnswer(-1); }
    }));
  };

  /* ============================================================
     SVG 칸 기반 위젯 공용 — 칸을 눌러 고르고 숫자 한 줄로 채움
     ============================================================ */
  function svgBox(cls, W, Hh) { const s = sv('svg', { viewBox: `0 0 ${W} ${Hh}`, class: 'nm-g79-svg ' + cls, role: 'img' }); return s; }
  function circleCell(svg, x, y, r, val, extraCls) {
    const g = sv('g', { class: 'nm-g79-sc' + (val == null ? ' blank' : '') + (extraCls ? ' ' + extraCls : '') });
    g.appendChild(sv('circle', { cx: x, cy: y, r, class: 'shape' }));
    const tx = sv('text', { x, y: y + 6, 'text-anchor': 'middle' }, val == null ? '' : String(val)); g.appendChild(tx);
    svg.appendChild(g);
    return svgCell(g, tx);
  }
  function rectCell(svg, x, y, w, hh, val, extraCls) {
    const g = sv('g', { class: 'nm-g79-sc sq' + (val == null ? ' blank' : '') + (extraCls ? ' ' + extraCls : '') });
    g.appendChild(sv('rect', { x: x - w / 2, y: y - hh / 2, width: w, height: hh, rx: 5, class: 'shape' }));
    const tx = sv('text', { x, y: y + 6, 'text-anchor': 'middle' }, val == null ? '' : String(val)); g.appendChild(tx);
    svg.appendChild(g);
    return svgCell(g, tx);
  }
  /* 칸 목록(빈칸만)으로 진행기를 붙이고 입력 줄을 만든다 */
  function runFill(root, cells, sol, p, onAnswer, K) {
    let nr = null;
    const ctl = { };
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);
    nr = numRow(inBox, n => ctl.f.pick(n));
    ctl.f = filler(cells, sol, nr, K, () => onAnswer(p.answer), onAnswer);
    return ctl.f;
  }

  /* ── treeFill — 수나무 ── */
  EXT.treeFill = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-tree');
    const g = GEO().treeLayout(p.nodes, p.flow);
    const svg = svgBox('tree', g.W, g.H); root.appendChild(svg);
    p.nodes.forEach(n => { if (n.kids) n.kids.forEach(k => svg.appendChild(sv('line', { x1: g.pts[n.id].x, y1: g.pts[n.id].y, x2: g.pts[k].x, y2: g.pts[k].y, class: 'ln' }))); });
    const cellById = {};
    p.nodes.forEach(n => { const q = g.pts[n.id]; const cc = circleCell(svg, q.x, q.y, g.r + 3, n.v); cellById[n.id] = cc; });
    const cells = p.blanks.map(id => cellById[id]);
    runFill(root, cells, p.solution, p, onAnswer, K);
  };

  /* ── vertexSum — 꼭지점 합(삼각형·사각형) ── */
  EXT.vertexSum = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-vertex');
    const g = GEO().vertexLayout(p.shape), n = p.shape === 'quad' ? 4 : 3;
    const svg = svgBox('vertex', g.W, g.H); root.appendChild(svg);
    svg.appendChild(sv('polygon', { points: g.v.map(q => q.x + ',' + q.y).join(' '), class: 'ln', fill: 'none' }));
    const vc = [], ec = [];
    for (let i = 0; i < n; i++) vc[i] = rectCell(svg, g.v[i].x, g.v[i].y, 40, 34, p.verts[i], 'vert');
    for (let i = 0; i < n; i++) ec[i] = circleCell(svg, g.e[i].x, g.e[i].y, 17, p.edges[i], 'edge');
    const cells = p.blanks.map(b => (b.kind === 'v' ? vc[b.idx] : ec[b.idx]));
    runFill(root, cells, p.solution, p, onAnswer, K);
  };

  /* ── wheelFill — 바퀴(가운데 수 · 마주 보는 수) ── */
  EXT.wheelFill = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-wheel');
    const svg = svgBox('wheel', 200, 200); root.appendChild(svg);
    const G = GEO(); let cells = [];
    const mkPart = (d, t, val, cls) => {
      const gEl = sv('g', { class: 'nm-g79-sc' + (val == null ? ' blank' : '') + ' ' + cls });
      gEl.appendChild(sv('path', { d, class: 'shape' }));
      const tx = sv('text', { x: t[0], y: t[1] + 6, 'text-anchor': 'middle' }, val == null ? '' : String(val)); gEl.appendChild(tx);
      svg.appendChild(gEl); return svgCell(gEl, tx);
    };
    if (p.mode === 'opposite') {
      const parts = G.wheelOpposite().map((w, i) => mkPart(w.d, [w.tx, w.ty], p.wedges[i], 'wedge'));
      cells = p.blanks.map(i => parts[i]);
    } else {
      const wg = G.wheelSectors(), byKey = {};
      wg.sec.forEach((sc, i) => {
        byKey[i + 'inner'] = mkPart(sc.inner.d, sc.inner.t, p.sectors[i].inner, 'ring in');
        byKey[i + 'outer'] = mkPart(sc.outer.d, sc.outer.t, p.sectors[i].outer, 'ring out');
      });
      const mid = sv('g', { class: 'nm-g79-sc centre' });
      mid.appendChild(sv('circle', { cx: wg.cx, cy: wg.cx, r: wg.r0, class: 'shape' })); mid.appendChild(sv('text', { x: wg.cx, y: wg.cx + 8, 'text-anchor': 'middle' }, String(p.center)));
      svg.appendChild(mid);
      cells = p.blanks.map(b => byKey[b.s + b.side]);
    }
    runFill(root, cells, p.solution, p, onAnswer, K);
  };

  /* ── opGrid — 가로 더하기·세로 빼기 표 ── */
  EXT.opGrid = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-opgrid');
    root.appendChild(h('div', 'nm-g79-oplabs', `<span class="add">${t3('가로로 더하기', 'across: add', '横着加')} ＋ →</span><span class="sub">${t3('세로로 빼기', 'down: subtract', '竖着减')} － ↓</span>`));
    const grid = h('div', 'nm-g79-opcells'); root.appendChild(grid);
    const map = {};
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) {
      const v = p.g[r][q], b = h('span', 'nm-g79-opc' + (v == null ? ' bk' : ''), v == null ? '' : String(v)); grid.appendChild(b); map[r + ',' + q] = b;
    }
    const cells = p.blanks.map(b => htmlCell(map[b[0] + ',' + b[1]]));
    runFill(root, cells, p.solution, p, onAnswer, K);
  };

  /* 4줄 뒤집힌 피라미드 — 화면은 기존 pyramid 위젯(줄 배열을 그대로 그림)을 쓰고, 인쇄만 따로 한다 */
  EXT.pyramid4 = function (p, c, onAnswer) { return window.NM_WIDGETS.render(Object.assign({}, p, { widget: 'pyramid' }), c, onAnswer); };

  /* ============================================================
     ruleTable — 규칙표(지붕 · 숨은 규칙 두 줄 · 두 번 연산)
     ============================================================ */
  EXT.ruleTable = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-rtab ' + p.layout);
    const cellFor = v => h('span', 'nm-g79-rc' + (v == null ? ' bk' : ''), v == null ? '' : String(v));
    const keyed = {};
    if (p.layout === 'house') {
      root.appendChild(h('div', 'nm-g79-roof', `<svg viewBox="0 0 120 44" aria-hidden="true"><polygon points="4,42 60,4 116,42" class="rf"/></svg><b>${p.roof[0]}</b>`));
      const tbl = h('div', 'nm-g79-rows'); root.appendChild(tbl);
      tbl.appendChild(h('div', 'nm-g79-rhead', `<span>${t3('넣는 수', 'in', '放入')}</span><span></span><span>${t3('나오는 수', 'out', '得到')}</span>`));
      p.rows.forEach((r, i) => {
        const row = h('div', 'nm-g79-rrow'); const a = cellFor(r.in), b = cellFor(r.out);
        keyed[i + 'in'] = a; keyed[i + 'out'] = b;
        row.appendChild(a); row.appendChild(h('span', 'nm-g79-rarr', '→')); row.appendChild(b); tbl.appendChild(row);
      });
    } else if (p.layout === 'strip') {
      const tbl = h('div', 'nm-g79-strip'); root.appendChild(tbl);
      const top = h('div', 'nm-g79-srow'), bot = h('div', 'nm-g79-srow');
      p.cols.forEach((col, i) => { const a = cellFor(col.top), b = cellFor(col.bottom); keyed[i + 'top'] = a; keyed[i + 'bottom'] = b; top.appendChild(a); bot.appendChild(b); });
      tbl.appendChild(top); tbl.appendChild(bot);
      root.appendChild(h('div', 'nm-g79-hint', t3('위와 아래 사이의 규칙을 찾아봐요', 'Look for the rule between top and bottom', '找找上下两行之间的规律')));
    } else {
      const tbl = h('div', 'nm-g79-rows chain'); root.appendChild(tbl);
      tbl.appendChild(h('div', 'nm-g79-rhead', `<span></span><span class="op">${p.roof[0]}</span><span></span><span class="op">${p.roof[1]}</span><span></span>`));
      p.rows.forEach((r, i) => {
        const row = h('div', 'nm-g79-rrow'); const a = cellFor(r.in), m = cellFor(r.mid), b = cellFor(r.out);
        keyed[i + 'in'] = a; keyed[i + 'mid'] = m; keyed[i + 'out'] = b;
        row.appendChild(a); row.appendChild(h('span', 'nm-g79-rarr', '→')); row.appendChild(m); row.appendChild(h('span', 'nm-g79-rarr', '→')); row.appendChild(b); tbl.appendChild(row);
      });
    }
    const cells = p.blanks.map(b => htmlCell(keyed[p.layout === 'strip' ? b.col + b.row : b.row + b.side]));
    runFill(root, cells, p.solution, p, onAnswer, K);
  };

  /* ============================================================
     machineBox — 수 상자(규칙 숨음 · 입구 둘)
     ============================================================ */
  EXT.machineBox = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-mbox');
    const num = v => `<span class="nm-g79-rc">${v}</span>`;
    const box = `<span class="nm-g79-mach">${p.kind === 'rule' ? '?' : '⚙'}</span>`;
    const arrow = '<span class="nm-g79-rarr">→</span>';
    const rowsBox = h('div', 'nm-g79-rows'); root.appendChild(rowsBox);
    const bk = h('span', 'nm-g79-rc bk', '');
    p.rows.forEach(r => rowsBox.appendChild(h('div', 'nm-g79-rrow', p.kind === 'rule'
      ? `${num(r.in)}${arrow}${box}${arrow}${num(r.out)}` : `${num(r.a)}${num(r.b)}${arrow}${box}${arrow}${num(r.out)}`)));
    const q = h('div', 'nm-g79-rrow q');
    const put = (k, v) => { if (v == null) { q.appendChild(bk); } else q.appendChild(h('span', 'nm-g79-rc', String(v))); };
    if (p.kind === 'rule') { put('in', p.q.in); q.appendChild(h('span', 'nm-g79-rarr', '→')); q.insertAdjacentHTML('beforeend', box); q.appendChild(h('span', 'nm-g79-rarr', '→')); put('out', p.q.out); }
    else { put('a', p.q.a); put('b', p.q.b); q.appendChild(h('span', 'nm-g79-rarr', '→')); q.insertAdjacentHTML('beforeend', box); q.appendChild(h('span', 'nm-g79-rarr', '→')); put('out', p.q.out); }
    rowsBox.appendChild(q);
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);
    let lock = false, f = 0;
    const cell = htmlCell(bk); cell.sel(true);
    const nr = numRow(inBox, n => {
      if (lock) return;
      if (n === p.answer) { lock = true; cell.set(n); nr.enable(false); onAnswer(p.answer); }
      else { K.shake(bk); onAnswer(-1); f++; if (f >= 2) nr.hint(p.answer); }
    });
  };

  /* ============================================================
     hiddenBeads — 상자에 가려진 구슬 + 가르기 도식
     ============================================================ */
  EXT.hiddenBeads = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-beads');
    const names = { '#e53935': 'bead-red', '#3b8fe0': 'bead-blue', '#43a047': 'bead-green', '#ffd23f': 'bead-yellow' };
    const str = h('div', 'nm-g79-string'); root.appendChild(str);
    p.colors.slice(0, p.visible).forEach(col => str.appendChild(h('span', 'bead', art(K, names[col] || 'bead-red'))));
    const hide = h('span', 'nm-g79-hidebox', '<b>?</b>'); str.appendChild(hide);
    const bond = h('div', 'nm-g79-bond'); root.appendChild(bond);
    const cellEl = (v, cls) => h('span', 'nm-g79-bn' + (v == null ? ' bk' : '') + (cls ? ' ' + cls : ''), v == null ? '' : String(v));
    const top = cellEl(p.bond.top, 'top'), left = cellEl(p.bond.left, 'l'), right = cellEl(p.bond.right, 'r');
    bond.appendChild(top);
    bond.insertAdjacentHTML('beforeend', '<svg class="ln" viewBox="0 0 120 30" aria-hidden="true"><line x1="60" y1="2" x2="26" y2="28"/><line x1="60" y1="2" x2="94" y2="28"/></svg>');
    const row = h('div', 'rw'); row.appendChild(left); row.appendChild(right); bond.appendChild(row);
    const target = [top, left, right].find(e => e.classList.contains('bk'));
    const cell = htmlCell(target); cell.sel(true);
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);
    let lock = false, f = 0;
    const nr = numRow(inBox, n => {
      if (lock) return;
      if (n === p.answer) { lock = true; cell.set(n); nr.enable(false); hide.classList.add('open'); onAnswer(p.answer); }
      else { K.shake(target); onAnswer(-1); f++; hide.classList.add('blink'); setTimeout(() => hide.classList.remove('blink'), 900); if (f >= 2) nr.hint(p.answer); }
    });
  };

  /* ============================================================
     codeBreak — 그림 암호 (1단계 값 구하기 → 2단계 숫자를 보고 그림 고르기)
     ============================================================ */
  EXT.codeBreak = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-code');
    const table = h('div', 'nm-g79-ctable'); root.appendChild(table);
    const cells = [];
    p.symbols.forEach(s => {
      const bk = h('span', 'nm-g79-rc bk', '');
      table.appendChild(h('div', 'crow', `<span class="ico">${art(K, s.e)}</span><span class="ex">${s.a} ${opTxt(s.op)} ${s.b} =</span>`));
      table.lastChild.appendChild(bk); cells.push(htmlCell(bk));
    });
    const stage2 = h('div', 'nm-g79-cstage2'); root.appendChild(stage2);
    const inBox = h('div', 'nm-g79-input'); root.appendChild(inBox);
    const nr = numRow(inBox, n => f.pick(n));
    const f = filler(cells, p.symbols.map(s => s.v), nr, K, () => {
      inBox.remove();
      const digits = p.secret.map(i => p.symbols[i].v);
      stage2.appendChild(h('div', 'nm-g79-cdigits', digits.join('<i></i>')));
      const slots = h('div', 'nm-g79-cslots'); stage2.appendChild(slots);
      const slotEls = digits.map(() => { const s = h('span', 'nm-g79-cslot', ''); slots.appendChild(s); return s; });
      const deck = h('div', 'nm-g79-cdeck'); stage2.appendChild(deck);
      let at = 0, lock = false;
      slotEls[0].classList.add('sel');
      p.symbols.forEach((s, si) => {
        const b = h('button', 'nm-g79-csym', `<span class="ico">${art(K, s.e)}</span>`); b.type = 'button'; deck.appendChild(b);
        on(b, () => {
          if (lock) return;
          if (si === p.secret[at]) {
            slotEls[at].innerHTML = `<span class="ico">${art(K, s.e)}</span>`; slotEls[at].classList.remove('sel'); slotEls[at].classList.add('done'); at++;
            if (at === digits.length) { lock = true; onAnswer(p.answer); } else slotEls[at].classList.add('sel');
          } else { K.shake(b); onAnswer(-1); }
        });
      });
    }, onAnswer);
  };

  /* ============================================================
     sumMatch — 합이 같은 짝끼리 잇기(왼쪽 3장 ↔ 오른쪽 3장)
     ============================================================ */
  EXT.sumMatch = function (p, c, onAnswer, K) {
    const root = wrap(c, 'nm-g79-smatch');
    const cols = h('div', 'nm-g79-scols'); root.appendChild(cols);
    const lc = h('div', 'col'), rc = h('div', 'col'); cols.appendChild(lc); cols.appendChild(h('div', 'gap')); cols.appendChild(rc);
    const mk = q => { const b = h('button', 'nm-g79-scard', `(${q.p[0]}, ${q.p[1]})<i></i>`); b.type = 'button'; return b; };
    const L = p.left.map(q => { const b = mk(q); lc.appendChild(b); return b; });
    const Rr = p.right.map(q => { const b = mk(q); rc.appendChild(b); return b; });
    let sel = -1, done = 0, lock = false;
    const matched = new Set(), matchedR = new Set();
    L.forEach((b, i) => on(b, () => {
      if (lock || matched.has(i)) return;
      L.forEach(x => x.classList.remove('sel')); sel = i; b.classList.add('sel');
    }));
    Rr.forEach((b, j) => on(b, () => {
      if (lock || matchedR.has(j)) return;
      if (sel < 0) { K.shake(b); return; }
      if (p.left[sel].s === p.right[j].s) {
        const col = PAIR_COLORS[done], tag = ['①', '②', '③'][done];
        [L[sel], b].forEach(x => { x.classList.remove('sel'); x.classList.add('paired'); x.style.setProperty('--pc', col); x.querySelector('i').textContent = tag; });
        matched.add(sel); matchedR.add(j); sel = -1; done++;
        if (done === p.left.length) { lock = true; setTimeout(() => onAnswer(p.answer), 250); }
      } else { K.shake(b); K.shake(L[sel]); onAnswer(-1); L[sel].classList.remove('sel'); sel = -1; }
    }));
  };
})();
