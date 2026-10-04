/* G1-10-12호 화면 위젯 — window.NM_WIDGET_EXT['이름']=function(problem,container,onAnswer,KIT){...} (KIT = NM_WIDGET_KIT).
   위젯 답은 숫자 하나: 호스트가 +val===problem.answer 로 채점한다. 정답이 여럿인 열린 활동은 위젯이 규칙으로
   안에서 판정해 맞으면 onAnswer(problem.answer), 틀리면 shake 한 뒤 onAnswer(-1) 을 올린다.
   Math.random 을 쓰지 않는다 — 보기 순서·소품은 생성기(engine/threads/g1-10-12.js)가 정해서 problem 에 담아 준다.
   클래스는 nm-g1012-… 접두. 식(+ − = □)은 이 파일이 직접 그린다(기존 tex 경로 미사용). */
(function () {
  'use strict';
  window.NM_WIDGET_EXT = window.NM_WIDGET_EXT || {};
  const X = window.NM_WIDGET_EXT;
  const NS = 'nm-g1012';
  const G = () => window.NM_G1012;

  /* ── 공용 도구 ── */
  const Ls = o => (window.NM_L ? window.NM_L(o) : (o && (o.ko || o.en)) || '');
  const T = (ko, en, zh) => Ls({ ko, en, zh });
  const MINUS = '−';
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function tap(node, fn) { node.addEventListener('pointerup', e => { e.stopPropagation(); fn(e); }); }
  function say(t) { try { if (window.NM_SAY) window.NM_SAY(t); } catch (e) { /* 음성이 없어도 문제는 풀린다 */ } }
  function replay(getText) { const b = el('button', NS + '-replay', '🔊'); b.type = 'button'; tap(b, () => say(getText())); return b; }
  function opCh(op) { return op === '-' ? MINUS : '+'; }
  const sleepRun = (fn, ms) => setTimeout(fn, ms);

  /* 그림 행 — rows:[{n, gone, plus, tok}]. gone = 먹어서/따로 둬서 흐리게 보이는 뒷부분, plus = 앞에 ＋ 가 붙는 다른 무리 */
  function picHtml(K, tok, rows, mode) {
    return `<div class="${NS}-pic">` + rows.map(r => {
      let h = `<div class="${NS}-pr">` + (r.plus ? `<span class="${NS}-plus">+</span>` : '');
      for (let i = 0; i < r.n; i++) {
        const gone = r.gone && i >= r.n - r.gone;
        h += `<span class="${NS}-pi${gone ? (mode === 'aside' ? ' aside' : ' gone') : ''}">${K.art(r.tok || tok)}</span>`;
      }
      return h + '</div>';
    }).join('') + '</div>';
  }

  /* 숫자 패드 한 칸짜리(화면 + 패드) — onOk(숫자) */
  function padBlock(root, K, maxLen, onOk) {
    const screen = el('div', 'nm-numpad-screen nm-sc-screen', '&nbsp;'); root.appendChild(screen);
    const pad = el('div', 'nm-numpad nm-sc-pad'); root.appendChild(pad);
    let v = '';
    K.buildNumpad(pad, val => {
      if (val === 'ok') { if (v === '') return; onOk(parseInt(v, 10)); return; }
      if (val === 'del') v = v.slice(0, -1); else if (v.length < maxLen) v += val;
      screen.textContent = v || ' ';
    });
    return { screen, clear() { v = ''; screen.textContent = ' '; } };
  }

  /* 칸 여러 개에 숫자를 쓰는 패드 — boxes 는 칸마다 {node, locked?}. 탭하면 포커스, 숫자는 포커스 칸에 들어간다. */
  function boxPad(root, K, boxes, maxLen, onOk, equal) {
    const pad = el('div', 'nm-numpad nm-sc-pad'); root.appendChild(pad);
    const vals = boxes.map(b => (b.locked ? String(b.value) : ''));
    let focus = Math.max(0, boxes.findIndex(b => !b.locked));
    function paint() {
      boxes.forEach((b, i) => {
        b.node.textContent = vals[i];
        b.node.classList.toggle('cur', i === focus && !b.locked);
        b.node.classList.toggle('filled', vals[i] !== '');
      });
    }
    function nextEmpty(from) {
      for (let k = 1; k <= boxes.length; k++) { const i = (from + k) % boxes.length; if (!boxes[i].locked && vals[i] === '') return i; }
      return from;
    }
    boxes.forEach((b, i) => { if (!b.locked) tap(b.node, () => { focus = i; paint(); }); });
    K.buildNumpad(pad, val => {
      if (boxes[focus] && boxes[focus].locked) return;
      if (val === 'ok') { onOk(vals.map(v => (v === '' ? null : parseInt(v, 10)))); return; }
      if (val === 'del') {
        if (equal) boxes.forEach((b, i) => { if (!b.locked) vals[i] = ''; }); else vals[focus] = vals[focus].slice(0, -1);
        paint(); return;
      }
      if (equal) { boxes.forEach((b, i) => { if (!b.locked) vals[i] = val; }); paint(); return; }
      if (maxLen === 1) { vals[focus] = val; focus = nextEmpty(focus); }
      else if (vals[focus].length < maxLen) vals[focus] += val;
      paint();
    });
    paint();
    return {
      vals,
      set(i, v) { vals[i] = String(v); paint(); },
      clear() { boxes.forEach((b, i) => { if (!b.locked) vals[i] = ''; }); focus = Math.max(0, boxes.findIndex(b => !b.locked)); paint(); },
      focus(i) { focus = i; paint(); }
    };
  }

  function done(root) { root.classList.add('is-done'); }

  /* ============================================================
     G1-10
     ============================================================ */

  /* ── 숫자 이야기 — 이야기 속 빈칸에 보기 칩 넣기 ── */
  X.g10_slotFill = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-sf'); container.appendChild(root);
    const text = Ls(p.text);
    root.appendChild(replay(() => text.replace(/\{\d\}/g, ' ... ')));
    const para = el('div', NS + '-sf-text'); root.appendChild(para);
    const chipsBox = el('div', NS + '-sf-chips'); root.appendChild(chipsBox);
    const ok = el('button', NS + '-done', '✔'); ok.type = 'button'; root.appendChild(ok);
    const n = p.slots, val = new Array(n).fill(null), parts = text.split(/\{(\d)\}/);
    let focus = 0, lock = false;
    const nextEmpty = from => { for (let k = 0; k < n; k++) { const i = (from + k) % n; if (val[i] === null) return i; } return -1; };
    function paint() {
      para.innerHTML = ''; chipsBox.innerHTML = '';
      parts.forEach((t, k) => {
        if (k % 2 === 0) { para.appendChild(document.createTextNode(t)); return; }
        const i = +t;
        const b = el('button', NS + '-sf-box' + (val[i] !== null ? ' filled' : '') + (i === focus ? ' cur' : ''), val[i] !== null ? String(p.chips[val[i]]) : '');
        b.type = 'button';
        tap(b, () => { if (lock) return; val[i] = null; focus = i; paint(); });
        para.appendChild(b);
      });
      p.chips.forEach((c, ci) => {
        const used = val.indexOf(ci) >= 0;
        const b = el('button', NS + '-sf-chip' + (used ? ' used' : ''), String(c)); b.type = 'button';
        tap(b, () => {
          if (lock || used) return;
          const f = val[focus] === null ? focus : nextEmpty(focus);
          if (f < 0) return;
          val[f] = ci; const nx = nextEmpty(f); focus = nx < 0 ? f : nx; paint();
        });
        chipsBox.appendChild(b);
      });
      ok.disabled = val.some(v => v === null);
    }
    tap(ok, () => {
      if (lock || val.some(v => v === null)) return;
      if (val.every((ci, i) => p.chips[ci] === p.solution[i])) { lock = true; done(root); onAnswer(p.answer); return; }
      lock = true; K.shake(para); onAnswer(-1);
      sleepRun(() => { val.fill(null); focus = 0; lock = false; paint(); }, 650);
    });
    paint();
  };

  /* ── 사실 카드 읽고 숫자 구하기 ── */
  X.g10_factsCard = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-fc'); container.appendChild(root);
    root.appendChild(replay(() => p.facts.map(f => Ls(f.text)).join(' ') + ' ' + Ls(p.prompt)));
    const list = el('div', NS + '-fc-list'); root.appendChild(list);
    p.facts.forEach(f => {
      const c = el('button', NS + '-fc-card', `<span class="${NS}-fc-ic">${K.art(f.icon)}</span><span class="${NS}-fc-tx">${K.esc(Ls(f.text))}</span>`);
      c.type = 'button';
      tap(c, () => c.classList.toggle('on'));
      list.appendChild(c);
    });
    let lock = false;
    const pad = padBlock(root, K, 2, v => {
      if (lock) return; lock = true; sleepRun(() => { lock = false; }, 700);
      if (v !== p.answer) K.shake(pad.screen); else done(root);
      onAnswer(v); pad.clear();
    });
  };

  /* ── 틀린 곳 찾기 — ① 틀린 곳을 누르고 ② 바른 수를 고른다 ── */
  X.g10_errorFind = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-ef'); container.appendChild(root);
    root.appendChild(replay(() => p.segs.map(s => Ls(s.t)).join('')));
    root.insertAdjacentHTML('beforeend', picHtml(K, p.pic.tok, p.pic.rows, 'gone'));
    const sent = el('div', NS + '-ef-sent'); root.appendChild(sent);
    const bubble = el('div', NS + '-ef-bubble', '&nbsp;'); root.appendChild(bubble);
    const choices = el('div', NS + '-ef-choices'); root.appendChild(choices);
    let stage = 1, wrongTaps = 0, lock = false, fixed = null;
    const CIRC = ['①', '②', '③'];
    function paint() {
      sent.innerHTML = '';
      p.segs.forEach(s => {
        if (s.part === undefined) { sent.appendChild(document.createTextNode(Ls(s.t))); return; }
        const isBad = s.part === p.badPart;
        const b = el('button', NS + '-ef-part' + (isBad && stage === 2 ? ' blank' : '') + (isBad && fixed !== null ? ' fixed' : ''),
          `<sup>${CIRC[s.part]}</sup>` + (isBad && stage === 2 ? (fixed !== null ? K.esc(String(fixed)) : '…') : K.esc(Ls(s.t))));
        b.type = 'button';
        tap(b, () => {
          if (lock) return;
          if (isBad) { stage = 2; bubble.textContent = T('좋아요! 맞는 수를 골라요', 'Yes! Pick the right number', '对！选出正确的数'); paint(); return; }
          wrongTaps++;
          bubble.textContent = T('여기는 맞아요!', 'This part is right!', '这里是对的！');
          if (wrongTaps >= 2) { lock = true; K.shake(sent); onAnswer(-1); sleepRun(() => { wrongTaps = 0; lock = false; bubble.innerHTML = '&nbsp;'; }, 700); }
        });
        sent.appendChild(b);
      });
      choices.innerHTML = '';
      if (stage === 2) p.fix.choices.forEach(v => {
        const c = el('button', NS + '-ef-chip', String(v)); c.type = 'button';
        tap(c, () => {
          if (lock) return;
          lock = true; sleepRun(() => { lock = false; }, 700);
          if (v === p.fix.correct) { fixed = v; done(root); paint(); } else K.shake(c);
          onAnswer(v);
        });
        choices.appendChild(c);
      });
    }
    paint();
  };

  /* ── 카드 3택(그림→식 / 식→이야기) — 탭 = 즉시 판정, 인덱스를 올린다 ── */
  X.g10_choiceCards = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-cc'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt) + ' ' + (p.stem.eq ? p.stem.eq : '') + ' ' + p.cards.map(c => Ls(c.text)).join(' ')));
    if (p.stem.rows) root.insertAdjacentHTML('beforeend', picHtml(K, p.stem.tok, p.stem.rows, 'gone'));
    if (p.stem.eq) root.appendChild(el('div', NS + '-cc-eq', K.esc(p.stem.eq)));
    const row = el('div', NS + '-cc-row'); root.appendChild(row);
    let lock = false;
    p.cards.forEach((c, i) => {
      const b = el('button', NS + '-cc-card', (c.rows ? picHtml(K, p.stem && p.stem.tok, c.rows, 'gone') : '') + `<span class="${NS}-cc-tx">${K.esc(Ls(c.text))}</span>`);
      b.type = 'button';
      tap(b, () => {
        if (lock) return; lock = true; sleepRun(() => { lock = false; }, 700);
        if (i === p.answer) { b.classList.add('on'); done(root); } else K.shake(b);
        onAnswer(i);
      });
      row.appendChild(b);
    });
  };

  /* ── 조사하기·분류하기 — 격자 + 표(스텝퍼) 또는 표 읽고 질문 ── */
  X.g10_surveyGrid = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-sv'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const grid = el('div', NS + '-sv-grid'); grid.style.setProperty('--cols', p.cols); root.appendChild(grid);
    p.cells.forEach(t => {
      const c = el('button', NS + '-sv-cell', `<span class="${NS}-sv-ic">${K.art(t)}</span><i class="${NS}-sv-ck">✓</i>`); c.type = 'button';
      tap(c, () => c.classList.toggle('on'));
      grid.appendChild(c);
    });
    const table = el('div', NS + '-sv-table'); root.appendChild(table);
    let lock = false;
    if (p.askMode === 'tally') {
      const cnt = p.kinds.map(() => 0), nums = [];
      p.kinds.forEach((t, i) => {
        const col = el('div', NS + '-sv-col');
        col.appendChild(el('div', NS + '-sv-h', K.art(t)));
        const up = el('button', NS + '-sv-st', '+'), dn = el('button', NS + '-sv-st', MINUS), num = el('div', NS + '-sv-n', '0');
        up.type = dn.type = 'button';
        tap(up, () => { if (cnt[i] < 9) { cnt[i]++; num.textContent = cnt[i]; } });
        tap(dn, () => { if (cnt[i] > 0) { cnt[i]--; num.textContent = cnt[i]; } });
        col.append(up, num, dn); table.appendChild(col); nums.push(num);
      });
      const ok = el('button', NS + '-done', '✔'); ok.type = 'button'; root.appendChild(ok);
      tap(ok, () => {
        if (lock) return; lock = true; sleepRun(() => { lock = false; }, 700);
        if (cnt.every((v, i) => v === p.counts[i])) { done(root); onAnswer(p.answer); } else { K.shake(table); onAnswer(-1); }
      });
    } else {
      p.kinds.forEach((t, i) => {
        const col = el('div', NS + '-sv-col');
        col.appendChild(el('div', NS + '-sv-h', K.art(t)));
        col.appendChild(el('div', NS + '-sv-n fixed', String(p.counts[i])));
        table.appendChild(col);
      });
      const pad = padBlock(root, K, 2, v => {
        if (lock) return; lock = true; sleepRun(() => { lock = false; }, 700);
        if (v !== p.answer) K.shake(pad.screen); else done(root);
        onAnswer(v); pad.clear();
      });
    }
  };

  /* ── 같게 옮기기 / 똑같이 나누기 — 접시 사이로 하나씩 옮기고, 같아지면 끝 ── */
  X.g10_moveEqual = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-me'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const plates = el('div', NS + '-me-plates'); root.appendChild(plates);
    const undo = el('button', NS + '-undo', '↺'); undo.type = 'button'; root.appendChild(undo);
    const orig = p.pans.slice(); let cur = p.pans.slice(), lock = false;
    function paint() {
      plates.innerHTML = '';
      [0, 1].forEach(side => {
        const plate = el('div', NS + '-me-plate');
        const items = el('div', NS + '-me-items');
        for (let i = 0; i < cur[side]; i++) {
          const b = el('button', NS + '-me-it', K.art(p.tok)); b.type = 'button';
          tap(b, () => {
            if (lock) return;
            cur[side]--; cur[1 - side]++;
            paint();
            if (cur[0] === cur[1]) { lock = true; done(root); onAnswer(Math.abs(orig[0] - cur[0])); }
          });
          items.appendChild(b);
        }
        plate.append(items, el('div', NS + '-me-dish'), el('div', NS + '-me-cnt', String(cur[side])));
        plates.appendChild(plate);
      });
    }
    tap(undo, () => { if (lock) return; cur = orig.slice(); paint(); });
    paint();
  };

  /* ── 이야기 셈(두 줄·묶음) — 그림을 보고 숫자 패드로 답한다 ── */
  X.g10_storyRows = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-sr'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    if (p.layout === 'groups') {
      const bags = el('div', NS + '-sr-bags'); root.appendChild(bags);
      p.groups.forEach(n => {
        let h = '';
        for (let i = 0; i < n; i++) h += `<span class="${NS}-pi">${K.art(p.tok)}</span>`;
        bags.appendChild(el('div', NS + '-sr-bag', `<div class="${NS}-sr-bagtop"></div><div class="${NS}-sr-bagbody">${h}</div>`));
      });
    } else {
      root.insertAdjacentHTML('beforeend', picHtml(K, null, p.rows, p.kind === 'take' ? 'aside' : 'gone'));
    }
    let lock = false;
    const pad = padBlock(root, K, 2, v => {
      if (lock) return; lock = true; sleepRun(() => { lock = false; }, 700);
      if (v !== p.answer) K.shake(pad.screen); else done(root);
      onAnswer(v); pad.clear();
    });
  };

  /* ============================================================
     G1-11 — 식(+ − = □)
     ============================================================ */

  /* ── 칩 여러 개 누르기 — 조건에 맞는 수를 모두 ── */
  X.g11_numPick = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-np'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const g = G();
    const top = el('div', NS + '-np-top'); root.appendChild(top);
    if (p.kind === 'cmp') {
      const sym = { lt: '＜', gt: '＞', eq: '＝' }[p.rel];
      top.innerHTML = `<div class="${NS}-np-expr">${K.esc(g.eqStr(p.expr.a, p.expr.op, p.expr.b))}</div><div class="${NS}-np-sub">□ ${sym} ${K.esc(g.eqStr(p.expr.a, p.expr.op, p.expr.b))}</div>`;
    } else if (p.kind === 'range') {
      top.innerHTML = `<div class="${NS}-np-expr">${p.expr.a} + □</div><div class="${NS}-np-sub">${p.bounds[0]} ＜ ${p.expr.a} + □ ＜ ${p.bounds[1]}</div>`;
    } else if (p.kind === 'sumpick') {
      top.innerHTML = `<div class="${NS}-np-expr">${T('합', 'Sum', '和')} = ${p.target}</div><div class="${NS}-np-sub">${T('세 장', 'Three cards', '三张')}</div>`;
    } else {
      top.innerHTML = p.cards.map(c => `<span class="${NS}-np-card">${c}</span>`).join('');
    }
    const row = el('div', NS + '-np-chips'); root.appendChild(row);
    const sel = new Set(); let lock = false;
    p.chips.forEach(c => {
      const b = el('button', NS + '-np-chip', String(c)); b.type = 'button';
      tap(b, () => { if (lock) return; if (sel.has(c)) { sel.delete(c); b.classList.remove('on'); } else { sel.add(c); b.classList.add('on'); } });
      row.appendChild(b);
    });
    const ok = el('button', NS + '-done', '✔'); ok.type = 'button'; root.appendChild(ok);
    tap(ok, () => {
      if (lock || !sel.size) return;
      const mine = Array.from(sel).sort((a, b) => a - b), sol = p.solution.slice().sort((a, b) => a - b);
      if (mine.length === sol.length && mine.every((v, i) => v === sol[i])) { lock = true; done(root); onAnswer(p.answer); return; }
      lock = true; K.shake(row); onAnswer(-1);
      sleepRun(() => { sel.clear(); row.querySelectorAll('.on').forEach(n => n.classList.remove('on')); lock = false; }, 650);
    });
  };

  /* ── □의 값 — 별의 수를 보고 식의 빈칸을 채운다 ── */
  X.g11_eqFill = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-ea'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const sw = Array.from({ length: 10 }, (_, k) => { const r = k % 2 ? 11 : 24, a = -Math.PI / 2 + k * Math.PI / 5; return (30 + r * Math.cos(a)).toFixed(1) + ',' + (31 + r * Math.sin(a)).toFixed(1); }).join(' ');
    root.appendChild(el('div', NS + '-ea-star', `<svg viewBox="0 0 60 60" aria-hidden="true"><polygon points="${sw}"/></svg><b>${p.star}</b>`));
    const eq = el('div', NS + '-ea-eq'); root.appendChild(eq);
    const boxes = [];
    const e = p.eq;
    const put = v => {
      if (v === null) { const b = el('button', NS + '-box'); b.type = 'button'; eq.appendChild(b); boxes.push({ node: b }); }
      else eq.appendChild(el('span', NS + '-ea-n', String(v)));
    };
    put(e.a); eq.appendChild(el('span', NS + '-ea-op', opCh(e.op))); put(e.b); eq.appendChild(el('span', NS + '-ea-op', '=')); put(e.c);
    let lock = false;
    const bp = boxPad(root, K, boxes, 1, vals => {
      if (lock || vals.some(v => v === null)) return;
      lock = true; sleepRun(() => { lock = false; }, 700);
      if (vals.every((v, i) => v === p.vals[i])) { done(root); onAnswer(p.answer); }
      else { K.shake(eq); onAnswer(-1); bp.clear(); }
    });
  };

  /* ── 세로셈 빈칸 ── */
  X.g11_vertFill = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-vf'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const v = el('div', NS + '-vf-grid'); root.appendChild(v);
    const boxes = [];
    const cell = (val, cls) => { const d = el('div', cls || NS + '-vf-c'); if (val === null) { const b = el('button', NS + '-box'); b.type = 'button'; d.appendChild(b); boxes.push({ node: b }); } else d.textContent = String(val); v.appendChild(d); };
    cell(p.a); v.appendChild(el('div', NS + '-vf-op', opCh(p.op))); cell(p.b); v.appendChild(el('div', NS + '-vf-line')); cell(p.r);
    let lock = false;
    const expect = p.answer;
    const bp = boxPad(root, K, boxes, 1, vals => {
      if (lock || vals[0] === null) return;
      lock = true; sleepRun(() => { lock = false; }, 700);
      if (vals[0] === expect) { done(root); onAnswer(p.answer); } else { K.shake(v); onAnswer(-1); bp.clear(); }
    });
  };

  /* ── 카드로 식 만들기 — 위젯이 규칙(a ± b = c)으로 판정하고, 서로 다른 식이 need 개가 되면 끝 ── */
  X.g11_cardEq = function (p, container, onAnswer, K) {
    const g = G();
    const root = el('div', NS + '-wrap ' + NS + '-ce'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const reuse = p.cards === 'all9', cards = reuse ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : p.cards.slice();
    const fixedC = p.kind === 'target', used = new Set(), slots = [null, null, null], made = [];
    let op = p.ops[0], lock = false;
    if (p.kind === 'target') {
      const dice = Array.from({ length: p.target }, () => '<i></i>').join('');
      root.appendChild(el('div', NS + '-ce-goal', `<span class="${NS}-ce-dice">${dice}</span><b>${p.target}</b>`));
    }
    const frame = el('div', NS + '-ce-frame'); root.appendChild(frame);
    const msg = el('div', NS + '-ce-msg', '&nbsp;'); root.appendChild(msg);
    const tray = el('div', NS + '-ce-tray'); root.appendChild(tray);
    const list = el('div', NS + '-ce-list'); root.appendChild(list);
    const need = fixedC ? 2 : 3;
    const valOf = s => (s === null ? null : (reuse ? s : cards[s]));
    function paint() {
      frame.innerHTML = '';
      const slotBtn = i => { const b = el('button', NS + '-box' + (slots[i] !== null ? ' filled' : ''), slots[i] !== null ? String(valOf(slots[i])) : ''); b.type = 'button'; tap(b, () => { if (lock || slots[i] === null) return; if (!reuse) used.delete(slots[i]); slots[i] = null; paint(); }); return b; };
      frame.appendChild(slotBtn(0));
      const ob = el('button', NS + '-ce-op', opCh(op)); ob.type = 'button';
      tap(ob, () => { if (lock || p.ops.length < 2) return; op = op === p.ops[0] ? p.ops[1] : p.ops[0]; paint(); });
      if (p.ops.length < 2) ob.classList.add('static');
      frame.appendChild(ob);
      frame.appendChild(slotBtn(1));
      frame.appendChild(el('span', NS + '-ce-op static', '='));
      if (fixedC) frame.appendChild(el('span', NS + '-ce-fix', String(p.target))); else frame.appendChild(slotBtn(2));
      tray.innerHTML = '';
      cards.forEach((c, i) => {
        const key = reuse ? c : i, isUsed = !reuse && used.has(i);
        const b = el('button', NS + '-ce-card' + (isUsed ? ' used' : ''), String(c)); b.type = 'button';
        tap(b, () => {
          if (lock || isUsed) return;
          const at = [0, 1, 2].slice(0, need).find(k => slots[k] === null);
          if (at === undefined) return;
          slots[at] = reuse ? c : i; if (!reuse) used.add(i);
          paint();
          if ([0, 1, 2].slice(0, need).every(k => slots[k] !== null)) evaluate();
        });
        tray.appendChild(b);
      });
      list.innerHTML = made.map(e => `<div class="${NS}-ce-made"><b>★</b> ${K.esc(g.eqText(e))}</div>`).join('');
    }
    function reset() { slots.fill(null); used.clear(); lock = false; paint(); }
    function evaluate() {
      const a = valOf(slots[0]), b = valOf(slots[1]), c = fixedC ? p.target : valOf(slots[2]);
      const valid = p.ops.indexOf(op) >= 0 && (op === '+' ? a + b === c : a - b === c);
      lock = true;
      if (!valid) { K.shake(frame); msg.textContent = T('식이 맞지 않아요', 'That equation is not true', '这个算式不对'); onAnswer(-1); sleepRun(() => { msg.innerHTML = '&nbsp;'; reset(); }, 700); return; }
      const e = { a, op, b, c }, key = g.eqKey(e, p.kind === 'triple');
      if (made.some(m => g.eqKey(m, p.kind === 'triple') === key)) {
        msg.textContent = T('이미 만들었어요!', 'You already made that one!', '这个已经做过了！');
        sleepRun(() => { msg.innerHTML = '&nbsp;'; reset(); }, 800); return;
      }
      made.push(e); msg.textContent = T('좋아요! ' + made.length + '/' + p.need, 'Nice! ' + made.length + '/' + p.need, '好！' + made.length + '/' + p.need);
      if (made.length >= p.need) { paint(); done(root); onAnswer(p.answer); return; }
      sleepRun(() => { msg.innerHTML = '&nbsp;'; reset(); }, 700);
    }
    paint();
  };

  /* ── 동전 세기 → 합과 차 ── */
  X.g11_purse = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-pu'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    root.appendChild(el('div', NS + '-pu-note', K.esc(T('한 닢 = 1원', 'One coin = 1 won', '一枚 = 1元'))));
    p.who.forEach(w => {
      const row = el('div', NS + '-pu-row'); row.appendChild(el('div', NS + '-pu-who', K.art(w.tok)));
      const coins = el('div', NS + '-pu-coins'); row.appendChild(coins);
      const marked = [];
      for (let i = 0; i < w.n; i++) {
        const b = el('button', NS + '-pu-coin', K.art('🪙')); b.type = 'button';
        tap(b, () => {
          const at = marked.indexOf(i);
          if (at >= 0) marked.splice(at, 1); else marked.push(i);
          coins.querySelectorAll('.' + NS + '-pu-coin').forEach((cb, k) => {
            const o = marked.indexOf(k);
            cb.classList.toggle('on', o >= 0);
            cb.dataset.ord = o >= 0 ? String(o + 1) : '';
          });
        });
        coins.appendChild(b);
      }
      root.appendChild(row);
    });
    const ans = el('div', NS + '-pu-ans'); root.appendChild(ans);
    const boxes = [];
    const lab = (txt, withBox) => { const lb = el('span', NS + '-pu-lab', K.esc(txt)); if (boxes.length) lb.style.marginLeft = '14px'; ans.appendChild(lb); if (withBox) { const b = el('button', NS + '-box wide'); b.type = 'button'; ans.appendChild(b); boxes.push({ node: b }); ans.appendChild(el('span', NS + '-pu-lab', K.esc(T('원', ' won', '元')))); } };
    if (p.who.length === 1) lab(T('모두', 'In all', '一共'), true); else lab(T('합', 'Sum', '和'), true);
    if (p.needDiff) lab(T('차', 'Difference', '差'), true);
    let lock = false;
    const bp = boxPad(root, K, boxes, 2, vals => {
      if (lock || vals.some(v => v === null)) return;
      lock = true; sleepRun(() => { lock = false; }, 700);
      if (vals[0] === p.answer && (!p.needDiff || vals[1] === p.diff)) { done(root); onAnswer(p.answer); } else { K.shake(ans); onAnswer(-1); bp.clear(); }
    });
  };

  /* ============================================================
     G1-12 — 세 수·네 수 가르기·모으기 · 수 묶기 · 양팔저울 식
     ============================================================ */

  /* ── 여러 칸에 수를 써서 합이 w 가 되게(가르기·모으기·같은 수·여러 방법) ── */
  X.g12_partsFill = function (p, container, onAnswer, K) {
    const g = G();
    const root = el('div', NS + '-wrap ' + NS + '-pf-root'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const status = el('div', NS + '-pf-status', '&nbsp;'); root.appendChild(status);
    const boxes = [], idxOf = [];
    const html = g.partsFrame(NS, p, i => {
      if (p.given && p.given[i] !== undefined) return `<b class="${NS}-pf-given">${p.given[i]}</b>`;
      return `<button type="button" class="${NS}-box ${NS}-pf-in" data-i="${i}"></button>`;
    }, () => `<b>${p.whole}</b>`);
    const stage = el('div', NS + '-pf-stage', html); root.appendChild(stage);
    for (let i = 0; i < p.parts; i++) {
      if (p.given && p.given[i] !== undefined) boxes.push({ node: document.createElement('span'), locked: true, value: p.given[i] });
      else boxes.push({ node: stage.querySelector(`.${NS}-pf-in[data-i="${i}"]`) });
    }
    const found = []; let lock = false;
    const bp = boxPad(root, K, boxes, 1, vals => {
      if (lock) return;
      if (vals.some(v => v === null)) { K.shake(stage); return; }
      const sum = vals.reduce((a, b) => a + b, 0);
      if (vals.some(v => v < p.min)) { K.shake(stage); return; }
      lock = true; sleepRun(() => { lock = false; }, 700);
      const equalOk = !p.equal || vals.every(v => v === vals[0]);
      if (sum !== p.whole || !equalOk) { K.shake(stage); onAnswer(-1); bp.clear(); return; }
      if (p.distinct <= 1) { done(root); onAnswer(p.answer); return; }
      const key = vals.slice().sort((a, b) => a - b).join(',');
      if (found.indexOf(key) >= 0) { status.textContent = T('다른 방법으로!', 'Try a different way!', '换一种方法！'); K.shake(stage); bp.clear(); return; }
      found.push(key);
      if (found.length >= p.distinct) { status.textContent = '⭐'.repeat(found.length); done(root); onAnswer(p.answer); return; }
      status.textContent = T(`방법 ${found.length}/${p.distinct} ⭐`, `Way ${found.length}/${p.distinct} ⭐`, `第${found.length}/${p.distinct}种 ⭐`);
      bp.clear();
    }, !!p.equal);   /* 같은 수 모으기 — 한 칸에 쓰면 나머지 칸이 같은 값으로 따라 채워진다 */
  };

  /* ── 수 묶기 — 이웃한 칸을 골라 합이 목표가 되게 묶는다 ── */
  X.g12_gridGroup = function (p, container, onAnswer, K) {
    const root = el('div', NS + '-wrap ' + NS + '-gg'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const n = p.grid.length, flat = [].concat.apply([], p.grid);
    const info = el('div', NS + '-gg-info'); root.appendChild(info);
    const board = el('div', NS + '-gg-board'); board.style.setProperty('--n', n); root.appendChild(board);
    const undo = el('button', NS + '-undo', '↺'); undo.type = 'button'; root.appendChild(undo);
    let sel = [], locked = []; let lock = false;
    const adj = (a, b) => a !== b && Math.abs(Math.floor(a / n) - Math.floor(b / n)) <= 1 && Math.abs((a % n) - (b % n)) <= 1;
    const connected = set => {
      const seen = new Set([set[0]]), q = [set[0]];
      while (q.length) { const c = q.pop(); set.forEach(x => { if (!seen.has(x) && adj(c, x)) { seen.add(x); q.push(x); } }); }
      return seen.size === set.length;
    };
    const groupOf = i => locked.findIndex(gp => gp.indexOf(i) >= 0);
    function paint() {
      board.innerHTML = '';
      flat.forEach((v, i) => {
        const gi = groupOf(i);
        const b = el('button', NS + '-gg-cell' + (gi >= 0 ? ' g' + (gi % 5) : '') + (sel.indexOf(i) >= 0 ? ' sel' : ''), String(v)); b.type = 'button';
        tap(b, () => {
          if (lock || gi >= 0) return;
          const at = sel.indexOf(i);
          if (at >= 0) { sel.splice(at, 1); paint(); return; }
          if (sel.length && !sel.some(s => adj(s, i))) { K.shake(b); return; }
          sel.push(i); paint();
          if (sel.length === p.size) evaluate();
        });
        board.appendChild(b);
      });
      info.innerHTML = `<span>${T('목표', 'Target', '目标')} <b>${p.target}</b></span><span>${T('내가 고른 합', 'My sum', '我选的和')} <b>${sel.reduce((a, i) => a + flat[i], 0)}</b></span><span>⭐ ${locked.length}/${p.need}</span>`;
    }
    function evaluate() {
      const sum = sel.reduce((a, i) => a + flat[i], 0);
      lock = true;
      if (sum === p.target && connected(sel)) {
        locked.push(sel.slice()); sel = []; lock = false; paint();
        if (locked.length >= p.need) { lock = true; done(root); onAnswer(p.answer); }
        return;
      }
      K.shake(board); onAnswer(-1);
      sleepRun(() => { sel = []; lock = false; paint(); }, 600);
    }
    tap(undo, () => { if (lock && locked.length >= p.need) return; if (sel.length) sel = []; else locked.pop(); paint(); });
    paint();
  };

  /* ── 양팔저울 식 — ＋/－ 를 골라 양쪽 결과를 같게 ── */
  X.g12_eqScale = function (p, container, onAnswer, K) {
    const g = G();
    const root = el('div', NS + '-wrap ' + NS + '-es'); container.appendChild(root);
    root.appendChild(replay(() => Ls(p.prompt)));
    const scale = el('div', NS + '-es-scale'); root.appendChild(scale);
    const beam = el('div', NS + '-es-beam'); scale.appendChild(beam);
    scale.appendChild(el('div', NS + '-es-post'));
    const ops = p.pans.map(x => x.op);
    const pans = p.pans.map((x, i) => {
      const pan = el('div', NS + '-es-pan'); beam.appendChild(pan);
      return pan;
    });
    const ok = el('button', NS + '-done', '✔'); ok.type = 'button'; root.appendChild(ok);
    let lock = false;
    function paint() {
      p.pans.forEach((x, i) => {
        pans[i].innerHTML = '';
        pans[i].appendChild(el('span', NS + '-es-n', String(x.a)));
        if (x.op) pans[i].appendChild(el('span', NS + '-es-fixed', opCh(x.op)));
        else {
          const cur = ops[i];
          const b = el('button', NS + '-es-op' + (cur ? ' set' : ''), cur ? opCh(cur) : ''); b.type = 'button';
          tap(b, () => { if (lock) return; ops[i] = cur === null ? '+' : cur === '+' ? '-' : '+'; paint(); });
          pans[i].appendChild(b);
        }
        pans[i].appendChild(el('span', NS + '-es-n', String(x.b)));
      });
      ok.disabled = p.pans.some((x, i) => !(x.op || ops[i]));
    }
    function tilt(vL, vR) { const d = vL === null || vR === null ? 0 : vL - vR; beam.style.setProperty('--tilt', Math.max(-14, Math.min(14, -d * 2.4)) + 'deg'); }
    tap(ok, () => {
      if (lock || ok.disabled) return;
      const vs = p.pans.map((x, i) => g.panVal({ a: x.a, b: x.b }, x.op || ops[i]));
      lock = true;
      tilt(vs[0], vs[1]);
      if (vs[0] !== null && vs[0] === vs[1]) { done(root); onAnswer(p.answer); return; }
      K.shake(scale); onAnswer(-1);
      sleepRun(() => { p.pans.forEach((x, i) => { if (!x.op) ops[i] = null; }); beam.style.setProperty('--tilt', '0deg'); lock = false; paint(); }, 900);
    });
    paint();
  };
})();
