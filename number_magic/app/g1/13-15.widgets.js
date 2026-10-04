/* G1-13-15호 화면 위젯 — window.NM_WIDGET_EXT['이름']=function(problem,container,onAnswer,KIT){...} (KIT = NM_WIDGET_KIT).
   계약: 위젯은 숫자 하나로 답한다 — 맞으면 onAnswer(problem.answer), 틀리면 onAnswer(틀린 값 또는 -1).
   보기·좌표는 전부 생성기가 problem 에 싣는다(여기서 Math.random 을 쓰지 않는다).
   공용 그림은 NM_G1315(13-15.art.js) — 인쇄(13-15.print.js)가 같은 부품을 쓴다. 클래스 접두 nm-g1315-. */
(function () {
  'use strict';
  window.NM_WIDGET_EXT = window.NM_WIDGET_EXT || {};
  var X = window.NM_WIDGET_EXT, G = window.NM_G1315 || {}, PRE = 'nm-g1315';

  function lang() { return (window.S && window.S.lang) || 'ko'; }
  function lk(ko, en, zh) { var l = lang(); return l === 'en' ? en : l === 'zh' ? zh : ko; }
  function L3(o) { return typeof window.NM_L === 'function' ? window.NM_L(o) : (o && (o[lang()] || o.ko)) || ''; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function tap(node, fn) { node.addEventListener('pointerup', function (e) { e.stopPropagation(); fn(e); }); }
  function say(text) { if (window.NM_SAY && text) window.NM_SAY(text); }
  function speaker(root, getText) {
    var b = el('button', PRE + '-say', '🔊'); b.type = 'button'; b.setAttribute('aria-label', lk('다시 듣기', 'Listen again', '再听一遍'));
    tap(b, function () { say(getText()); }); root.appendChild(b); return b;
  }
  /* 보기 줄 — 숫자(또는 html) 버튼 3개. pick(value, button) */
  function choiceRow(parent, choices, pick, fmt) {
    var row = el('div', PRE + '-choices');
    choices.forEach(function (v) {
      var b = el('button', 'nm-tc-choice ' + PRE + '-ch', fmt ? fmt(v) : String(v)); b.type = 'button'; b.dataset.v = v;
      tap(b, function () { pick(v, b); });
      row.appendChild(b);
    });
    parent.appendChild(row); return row;
  }
  function wrap(container, extraCls) { var r = el('div', PRE + '-wrap' + (extraCls ? ' ' + extraCls : '')); container.appendChild(r); return r; }
  /* 점수 한 줄 알림(말풍선) */
  function note(root) { var n = el('div', PRE + '-note'); root.appendChild(n); return function (t, bad) { n.textContent = t || ''; n.classList.toggle('bad', !!bad); }; }

  /* ============================================================
     G1-13
     ============================================================ */

  /* ── overlapSum — 겹친 도형 합 ── */
  X.overlapSum = function (p, container, onAnswer, KIT) {
    var root = wrap(container), done = false, hi = null, fill = null;
    var sq = p.shape === 'square';
    var head = el('div', PRE + '-ovhead',
      '<span>' + esc(sq ? lk('큰 네모 하나의 합', 'Sum of one big square', '一个大方块的和') : lk('큰 원 하나의 합', 'Sum of one big circle', '一个大圆的和')) + '</span>' +
      '<b class="' + PRE + '-badge ' + (sq ? 'round' : 'square') + '">' + p.target + '</b>');
    root.appendChild(head);
    var area = el('div', PRE + '-ovarea'); root.appendChild(area);
    var say1 = note(root);
    function draw() { area.innerHTML = G.overlapSvg(p, { pre: PRE, hiSet: hi, fillAsk: fill, label: L3(p.prompt) }); }
    draw();
    tap(area, function (e) {
      var t = e.target.closest && e.target.closest('[data-r]'); if (!t || done) return;
      var id = t.getAttribute('data-r');
      var si = p.sets.findIndex(function (s) { return s.indexOf(id) >= 0; });
      hi = si; draw();
      var vals = p.sets[si].map(function (rid) { var r = p.regions.find(function (x) { return x.id === rid; }); return r.v == null ? '?' : r.v; });
      say1(vals.join(' + ') + ' = ' + p.target);
    });
    choiceRow(root, p.choices, function (v, b) {
      if (done) return;
      if (v === p.answer) { done = true; fill = v; hi = null; draw(); b.classList.add('ok'); say1(''); onAnswer(v); }
      else { KIT.shake(b); done = true; onAnswer(v); }
    });
  };

  /* ── weightPick — 분동을 접시에 올려 목표 무게 만들기 ── */
  X.weightPick = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-wp'), done = false, tries = 0, picked = [];
    root.appendChild(el('div', PRE + '-wtarget', '<span>' + esc(lk('목표 무게', 'Target', '目标重量')) + '</span><b class="' + PRE + '-badge">' + p.target + 'g</b>'));
    var pan = el('div', PRE + '-pan'); root.appendChild(pan);
    var items = el('div', PRE + '-panitems'), dish = el('div', PRE + '-pandish'), sum = el('div', PRE + '-pansum');
    pan.appendChild(items); pan.appendChild(dish); pan.appendChild(sum);
    var shelf = el('div', PRE + '-wshelf'); root.appendChild(shelf);
    var btns = p.weights.map(function (w, i) {
      var b = el('button', PRE + '-wt', '<span class="' + PRE + '-wtart">' + KIT.art('g:weight') + '</span><b>' + w + 'g</b>'); b.type = 'button';
      tap(b, function () { toggle(i); }); shelf.appendChild(b); return b;
    });
    function total() { return picked.reduce(function (s, i) { return s + p.weights[i]; }, 0); }
    function paint() {
      items.innerHTML = '';
      picked.forEach(function (i) {
        var c = el('button', PRE + '-wt placed', '<span class="' + PRE + '-wtart">' + KIT.art('g:weight') + '</span><b>' + p.weights[i] + 'g</b>'); c.type = 'button';
        tap(c, function () { toggle(i); }); items.appendChild(c);
      });
      btns.forEach(function (b, i) { b.classList.toggle('used', picked.indexOf(i) >= 0); });
      var t = total();
      sum.innerHTML = '<b>' + t + '</b>g'; sum.classList.toggle('over', t > p.target); sum.classList.toggle('hit', t === p.target);
      pan.classList.toggle('over', t > p.target); pan.classList.toggle('hit', t === p.target);
    }
    function toggle(i) {
      if (done) return;
      var at = picked.indexOf(i);
      if (at >= 0) picked.splice(at, 1); else if (picked.length < p.maxPick) picked.push(i); else { KIT.shake(pan); return; }
      paint();
      var t = total();
      if (t === p.target) { done = true; setTimeout(function () { onAnswer(p.answer); }, 350); return; }
      if (t > p.target) { KIT.shake(pan); return; }
      if (picked.length >= p.maxPick || picked.length >= p.weights.length) {          /* 다 올렸는데 모자람 */
        tries++; KIT.shake(pan);
        setTimeout(function () { if (done) return; picked = []; paint(); if (tries >= 2) { done = true; onAnswer(-1); } }, 500);
      }
    }
    paint();
  };

  /* ── balanceEq — 평평한 저울의 빈 분동 ── */
  X.balanceEq = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-bal'), done = false;
    root.appendChild(el('div', PRE + '-baltop', '<span class="' + PRE + '-balico">' + KIT.art('g:scale') + '</span><span>' + esc(lk('저울이 평평해요!', 'The scale is level!', '天平是平的！')) + '</span>'));
    var scale = el('div', PRE + '-scale'); root.appendChild(scale);
    scale.appendChild(el('div', PRE + '-beam'));
    scale.appendChild(el('div', PRE + '-post'));
    var pans = el('div', PRE + '-pans'); scale.appendChild(pans);
    var blankEl = null;
    [0, 1].forEach(function (side) {
      var pn = el('div', PRE + '-bpan'); pn.appendChild(el('div', PRE + '-string'));
      var tray = el('div', PRE + '-tray'); pn.appendChild(tray);
      if (p.objSide === side) tray.appendChild(el('span', PRE + '-obj', '<b>' + p.objW + 'g</b>'));
      p.fixed.forEach(function (f) { if (f.side === side) tray.appendChild(el('span', PRE + '-bw', '<span class="' + PRE + '-wtart">' + KIT.art('g:weight') + '</span><b>' + f.w + 'g</b>')); });
      if (p.blank.side === side) { blankEl = el('span', PRE + '-bw blank', '<span class="' + PRE + '-wtart">' + KIT.art('g:weight') + '</span><b>?</b>'); tray.appendChild(blankEl); }
      pans.appendChild(pn);
    });
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) { blankEl.classList.remove('blank'); blankEl.querySelector('b').textContent = v + 'g'; b.classList.add('ok'); } else KIT.shake(b);
      onAnswer(v);
    }, function (v) { return v + 'g'; });
  };

  /* ── pathSum — 합이 가장 작은 길 ── */
  X.pathSum = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-ps'), done = false, tries = 0, path = [];
    var say1 = note(root);
    var run = el('div', PRE + '-psrun'); root.appendChild(run);
    var area = el('div', PRE + '-psarea'); root.appendChild(area);
    var dr = p.moves === 'ru' ? -1 : 1;
    function nexts() {
      if (!path.length) return [p.start];
      var cur = path[path.length - 1], out = [];
      if (cur[1] < p.cols - 1) out.push([cur[0], cur[1] + 1]);
      var r2 = cur[0] + dr;
      if (r2 >= 0 && r2 < p.rows && (p.moves === 'ru' ? cur[0] > p.goal[0] : cur[0] < p.goal[0])) out.push([r2, cur[1]]);
      return out;
    }
    function sumNow() { return path.reduce(function (s, c) { return s + p.cells[c[0]][c[1]]; }, 0); }
    function draw() {
      area.innerHTML = G.pathHtml(p, { pre: PRE, sel: path, next: nexts(), startTxt: '▶', goalTxt: '⚑' });
      run.innerHTML = esc(lk('지금까지 합', 'Total so far', '目前的和')) + ' <b>' + sumNow() + '</b>';
    }
    tap(area, function (e) {
      if (done) return;
      var t = e.target.closest && e.target.closest('[data-r]'); if (!t) return;
      var r = +t.getAttribute('data-r'), c = +t.getAttribute('data-c');
      var last = path[path.length - 1];
      if (last && last[0] === r && last[1] === c) { path.pop(); draw(); say1(''); return; }          /* 마지막 칸 다시 탭 = 되돌리기 */
      if (!nexts().some(function (n) { return n[0] === r && n[1] === c; })) { KIT.shake(t); return; }
      path.push([r, c]); draw(); say1('');
      if (r === p.goal[0] && c === p.goal[1]) {
        var s = sumNow();
        if (s === p.answer) { done = true; area.classList.add('ok'); setTimeout(function () { onAnswer(s); }, 350); }
        else {
          tries++; KIT.shake(area); say1(lk('더 작은 길이 있어요!', 'There is a smaller path!', '还有更小的路！'), true);
          setTimeout(function () { if (done) return; if (tries >= 2) { done = true; onAnswer(s); return; } path = []; draw(); }, 800);
        }
      }
    });
    draw();
  };

  /* ── gridSum — 가로·세로 합이 모두 같게 ── */
  X.gridSum = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-gs'), done = false, tries = 0, sel = null;
    var cur = p.grid.map(function (r) { return r.slice(); });
    var blankAt = {}; p.blanks.forEach(function (b) { blankAt[b[0] + ',' + b[1]] = 1; });
    root.appendChild(el('div', PRE + '-gshead', esc(lk('모든 줄의 합', 'Every line adds to', '每一行每一列的和')) + ' <b class="' + PRE + '-badge">' + p.T + '</b>'));
    var area = el('div', PRE + '-gsarea'); root.appendChild(area);
    var chips = el('div', PRE + '-gschips'); root.appendChild(chips);
    var maxChip = 4;
    for (var v = 0; v <= maxChip; v++) (function (v) {
      var b = el('button', 'nm-tc-choice ' + PRE + '-ch', String(v)); b.type = 'button';
      tap(b, function () { put(v); }); chips.appendChild(b);
    })(v);
    function sums() {
      var rs = [], cs = [];
      for (var i = 0; i < p.n; i++) { rs.push(0); cs.push(0); }
      for (var r = 0; r < p.n; r++) for (var c = 0; c < p.n; c++) if (cur[r][c] != null) { rs[r] += cur[r][c]; cs[c] += cur[r][c]; }
      return { rs: rs, cs: cs };
    }
    function cls(v) { return v === p.T ? 'eq' : v < p.T ? 'lo' : 'hi'; }
    function draw() {
      var s = sums(), h = '<table class="' + PRE + '-gtab">';
      for (var r = 0; r < p.n; r++) {
        h += '<tr>';
        for (var c = 0; c < p.n; c++) {
          var isB = !!blankAt[r + ',' + c], v = cur[r][c];
          h += '<td><button type="button" class="' + PRE + '-gc' + (isB ? ' ask' : '') + (sel && sel[0] === r && sel[1] === c ? ' sel' : '') + '" data-r="' + r + '" data-c="' + c + '"' + (isB ? '' : ' disabled') + '>' + (v == null ? '' : v) + '</button></td>';
        }
        h += '<td class="' + PRE + '-gb ' + cls(s.rs[r]) + '">' + s.rs[r] + '</td></tr>';
      }
      h += '<tr>';
      for (var c2 = 0; c2 < p.n; c2++) h += '<td class="' + PRE + '-gb ' + cls(s.cs[c2]) + '">' + s.cs[c2] + '</td>';
      area.innerHTML = h + '<td></td></tr></table>';
    }
    function nextBlank() {
      for (var i = 0; i < p.blanks.length; i++) { var b = p.blanks[i]; if (cur[b[0]][b[1]] == null) return b; }
      return null;
    }
    function put(v) {
      if (done || !sel) return;
      cur[sel[0]][sel[1]] = v;
      var nb = nextBlank(); sel = nb ? nb : sel; draw();
      if (nb) return;
      var s = sums(), ok = s.rs.every(function (x) { return x === p.T; }) && s.cs.every(function (x) { return x === p.T; });
      if (ok) { done = true; area.classList.add('ok'); setTimeout(function () { onAnswer(p.answer); }, 350); }
      else {
        tries++; KIT.shake(area);
        if (tries >= 3) { done = true; onAnswer(-1); }
      }
    }
    tap(area, function (e) {
      var b = e.target.closest && e.target.closest('button.ask'); if (!b || done) return;
      sel = [+b.getAttribute('data-r'), +b.getAttribute('data-c')]; draw();
    });
    sel = p.blanks[0]; draw();
  };

  /* ── crossPlace — 십자에 1~5 를 한 번씩, 가로 합 = 세로 합 = T ── */
  X.crossPlace = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-cp'), done = false, tries = 0, sel = null;
    var cur = {}; ['c', 'u', 'd', 'l', 'r'].forEach(function (k) { cur[k] = p.cells[k]; });
    var fixed = {}; Object.keys(p.cells).forEach(function (k) { if (p.cells[k] != null) fixed[k] = 1; });
    root.appendChild(el('div', PRE + '-gshead', esc(lk('가로 합 = 세로 합 =', 'Row sum = column sum =', '横着的和 = 竖着的和 =')) + ' <b class="' + PRE + '-badge">' + p.T + '</b>'));
    var area = el('div', PRE + '-cparea'); root.appendChild(area);
    var cards = el('div', PRE + '-cards'); root.appendChild(cards);
    function used() { var u = {}; Object.keys(cur).forEach(function (k) { if (cur[k] != null) u[cur[k]] = k; }); return u; }
    function sumOf(ks) { var s = 0, full = true; ks.forEach(function (k) { if (cur[k] == null) full = false; else s += cur[k]; }); return { s: s, full: full }; }
    function badge(ks) { var o = sumOf(ks); return '<span class="' + PRE + '-gb ' + (o.s === p.T && o.full ? 'eq' : o.full ? 'hi' : 'lo') + '">' + o.s + '</span>'; }
    function cell(k) {
      var v = cur[k];
      return '<button type="button" class="' + PRE + '-cell' + (fixed[k] ? ' fixed' : (v == null ? ' ask' : ' put')) + (sel === k ? ' sel' : '') + '" data-k="' + k + '"' + (fixed[k] ? ' disabled' : '') + '>' + (v == null ? '' : v) + '</button>';
    }
    function draw() {
      area.innerHTML = '<div class="' + PRE + '-cross"><div class="' + PRE + '-crow">' + cell('u') + '</div><div class="' + PRE + '-crow">' + cell('l') + cell('c') + cell('r') + badge(['l', 'c', 'r']) + '</div><div class="' + PRE + '-crow">' + cell('d') + '</div>' +
        '<div class="' + PRE + '-ccol">' + badge(['u', 'c', 'd']) + '</div></div>';
      var u = used(); cards.innerHTML = '';
      p.nums.forEach(function (n) {
        var b = el('button', PRE + '-card' + (u[n] ? ' dim' : ''), '<span class="' + PRE + '-cardart">' + KIT.art('g:card') + '</span><b>' + n + '</b>'); b.type = 'button';
        tap(b, function () { place(n); }); cards.appendChild(b);
      });
    }
    function place(n) {
      if (done || !sel || used()[n]) return;
      cur[sel] = n;
      var nk = ['u', 'd', 'l', 'r', 'c'].find(function (k) { return cur[k] == null; }); sel = nk || sel; draw();
      if (nk) return;
      var h = sumOf(['l', 'c', 'r']).s, v = sumOf(['u', 'c', 'd']).s;
      if (h === p.T && v === p.T) { done = true; area.classList.add('ok'); setTimeout(function () { onAnswer(p.answer); }, 350); }
      else {
        tries++; KIT.shake(area);
        setTimeout(function () {
          if (done) return;
          Object.keys(cur).forEach(function (k) { if (!fixed[k]) cur[k] = null; });
          sel = ['u', 'd', 'l', 'r', 'c'].find(function (k) { return cur[k] == null; }) || null; draw();
          if (tries >= 2) { done = true; onAnswer(-1); }
        }, 500);
      }
    }
    tap(area, function (e) {
      var b = e.target.closest && e.target.closest('button.cell, button[data-k]'); if (!b || done) return;
      var k = b.getAttribute('data-k'); if (fixed[k]) return;
      if (cur[k] != null) { cur[k] = null; }
      sel = k; draw();
    });
    sel = ['u', 'd', 'l', 'r', 'c'].find(function (k) { return cur[k] == null; }) || null; draw();
  };

  /* ── pairUp — 카드를 두 장씩 묶어 합이 모두 같게 ── */
  X.pairUp = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-pu'), done = false, tries = 0, first = null, groups = [];
    var say1 = note(root);
    var row = el('div', PRE + '-purow'); root.appendChild(row);
    var balloons = el('div', PRE + '-pubal'); root.appendChild(balloons);
    var COL = ['#3b8fe0', '#ec6aa8', '#43a047'];
    function groupOf(i) { return groups.findIndex(function (g) { return g.indexOf(i) >= 0; }); }
    function draw() {
      row.innerHTML = '';
      p.cards.forEach(function (v, i) {
        var g = groupOf(i);
        var b = el('button', PRE + '-card' + (first === i ? ' sel' : ''), '<span class="' + PRE + '-cardart">' + KIT.art('g:card') + '</span><b>' + v + '</b>'); b.type = 'button';
        if (g >= 0) { b.style.setProperty('--gc', COL[g % 3]); b.classList.add('grp'); }
        tap(b, function () { hit(i); }); row.appendChild(b);
      });
      balloons.innerHTML = groups.map(function (g, gi) {
        return '<span class="' + PRE + '-bln" style="--gc:' + COL[gi % 3] + '">' + p.cards[g[0]] + ' + ' + p.cards[g[1]] + ' = <b>' + (p.cards[g[0]] + p.cards[g[1]]) + '</b></span>';
      }).join('');
    }
    function hit(i) {
      if (done) return;
      var g = groupOf(i);
      if (g >= 0) { groups.splice(g, 1); first = null; draw(); say1(''); return; }          /* 묶인 카드를 누르면 그 묶음만 풀림 */
      if (first === null) { first = i; draw(); return; }
      if (first === i) { first = null; draw(); return; }
      groups.push([first, i]); first = null; draw();
      if (groups.length === p.k) {
        var sums = groups.map(function (gg) { return p.cards[gg[0]] + p.cards[gg[1]]; });
        if (sums.every(function (s) { return s === sums[0]; })) { done = true; row.classList.add('ok'); setTimeout(function () { onAnswer(p.answer); }, 350); }
        else {
          tries++; KIT.shake(row); say1(lk('합이 서로 달라요. 다시 묶어 봐요!', 'The sums differ. Try again!', '和不一样，再配一配！'), true);
          setTimeout(function () { if (done) return; groups = []; draw(); if (tries >= 3) { done = true; onAnswer(-1); } }, 900);
        }
      }
    }
    draw();
  };

  /* ── ringSum — 네 꼭짓점의 합 ── */
  X.ringSum = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-rg'), done = false, tries = 0, sel = null;
    var vals = p.corners.slice();
    var area = el('div', PRE + '-rgarea'); root.appendChild(area);
    function draw() { area.innerHTML = G.ringSvg(p, { pre: PRE, vals: vals, cur: sel }); }
    if (p.choices) {                                      /* 빈 꼭짓점 하나 — 보기 3개 */
      draw();
      choiceRow(root, p.choices, function (v, b) {
        if (done) return; done = true;
        if (v === p.answer) { vals[p.blanks[0]] = v; draw(); b.classList.add('ok'); } else KIT.shake(b);
        onAnswer(v);
      });
      return;
    }
    var cards = el('div', PRE + '-cards'); root.appendChild(cards);
    function drawCards() {
      cards.innerHTML = '';
      p.nums.forEach(function (n) {
        var inUse = vals.indexOf(n) >= 0;
        var b = el('button', PRE + '-card' + (inUse ? ' dim' : ''), '<span class="' + PRE + '-cardart">' + KIT.art('g:card') + '</span><b>' + n + '</b>'); b.type = 'button';
        tap(b, function () { place(n); }); cards.appendChild(b);
      });
    }
    function place(n) {
      if (done || sel == null || vals.indexOf(n) >= 0) return;
      vals[sel] = n;
      var nx = p.blanks.find(function (i) { return vals[i] == null; }); sel = nx != null ? nx : sel; draw(); drawCards();
      if (nx != null) return;
      var ok = vals.every(function (v, i) { return v + vals[(i + 1) % 4] === p.sides[i]; });
      if (ok) { done = true; setTimeout(function () { onAnswer(p.answer); }, 350); }
      else {
        tries++; KIT.shake(area);
        setTimeout(function () { if (done) return; p.blanks.forEach(function (i) { vals[i] = null; }); sel = p.blanks[0]; draw(); drawCards(); if (tries >= 2) { done = true; onAnswer(-1); } }, 500);
      }
    }
    tap(area, function (e) {
      var c = e.target.closest && e.target.closest('[data-i]'); if (!c || done) return;
      var i = +c.getAttribute('data-i'); if (p.blanks.indexOf(i) < 0) return;
      vals[i] = null; sel = i; draw(); drawCards();
    });
    sel = p.blanks[0]; draw(); drawCards();
  };

  /* ============================================================
     G1-14
     ============================================================ */

  /* ── g15RuleTable — 표의 규칙으로 빈 칸 ── */
  X.g15RuleTable = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-rt'), done = false;
    var area = el('div', PRE + '-rtarea'); root.appendChild(area);
    function draw(fillV, hiRow) { area.innerHTML = G.tableHtml(p, { pre: PRE, fill: fillV, hiRow: hiRow }); }
    draw();
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) { draw(v, p.askRow); b.classList.add('ok'); } else KIT.shake(b);
      onAnswer(v);
    });
  };

  /* ── numberTrain — 기차 칸과 동그라미(이웃한 두 칸의 차) ── */
  X.numberTrain = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-nt'), done = false;
    var area = el('div', PRE + '-ntarea'); root.appendChild(area);
    function draw(v) {
      var q = { cars: p.cars.slice(), links: p.links.slice() };
      if (v != null) { if (p.askKind === 'car') q.cars[p.askIndex] = v; else q.links[p.askIndex] = v; }
      area.innerHTML = G.trainHtml(q, { pre: PRE });
      if (v != null) { var t = area.querySelector('[data-k="' + p.askKind + '"][data-i="' + p.askIndex + '"]'); if (t) t.classList.add('found'); }
    }
    draw();
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) { draw(v); b.classList.add('ok'); } else KIT.shake(b);
      onAnswer(v);
    });
  };

  /* ── promiseBox — 두 수 약속(규칙 보임 / 예시로 추리) ── */
  X.promiseBox = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-pb'), done = false;
    var rules = window.NM_G1315_PRULES || {};
    var rtxt = p.ruleShown && rules[p.ruleShown] ? L3(rules[p.ruleShown].t) : '?';
    root.appendChild(el('div', PRE + '-pbbox', '<span class="' + PRE + '-pbsym">' + esc(p.sym) + '</span> <span>' + esc(lk('약속', 'secret rule', '约定')) + '</span> <b class="' + (p.ruleShown ? '' : 'unk') + '">' + esc(rtxt) + '</b>'));
    var ex = el('div', PRE + '-pbex'); root.appendChild(ex);
    p.examples.forEach(function (e, i) { ex.appendChild(el('div', PRE + '-pbline', '<span>' + e[0] + '</span><i>' + esc(p.sym) + '</i><span>' + e[1] + '</span><i>=</i><b>' + e[2] + '</b>')); });
    var q = el('div', PRE + '-pbline ask');
    var qa = p.askPos === 'b' ? '<span>' + p.target[0] + '</span><i>' + esc(p.sym) + '</i><span class="blk">?</span><i>=</i><b>' + p.result + '</b>'
      : '<span>' + p.target[0] + '</span><i>' + esc(p.sym) + '</i><span>' + p.target[1] + '</span><i>=</i><b class="blk">?</b>';
    q.innerHTML = qa; ex.appendChild(q);
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) { var blk = q.querySelector('.blk'); if (blk) { blk.textContent = v; blk.classList.add('found'); } b.classList.add('ok'); } else KIT.shake(b);
      onAnswer(v);
    });
  };

  /* ── shapeEq — 같은 그림(모양) = 같은 수 ── */
  X.shapeEq = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-se'), done = false, step = 0, got = [];
    var useObj = p.kind === 'obj' || p.kind === 'sumdiff';
    function sym(k) {
      var t = p.syms[k];
      return useObj ? '<span class="' + PRE + '-sym">' + KIT.art(t) + '</span>' : '<span class="' + PRE + '-sym glyph g' + k + '">' + esc(t) + '</span>';
    }
    function term(t) { return typeof t === 'number' ? '<span class="' + PRE + '-num">' + t + '</span>' : (t === '+' || t === '-') ? '<i>' + (t === '+' ? '+' : '−') + '</i>' : sym(t); }
    var lines = el('div', PRE + '-selines'); root.appendChild(lines);
    p.eqs.forEach(function (e) { lines.appendChild(el('div', PRE + '-seline', e.l.map(term).join('') + '<i>=</i>' + term(e.r))); });
    var askRow = el('div', PRE + '-seline ask'); root.appendChild(askRow);
    var holder = el('div'); root.appendChild(holder);
    function drawAsk() {
      askRow.innerHTML = p.ask.map(function (k, i) {
        return '<span class="' + PRE + '-seq">' + sym(k) + '<i>=</i><b class="' + PRE + '-seans' + (i === step ? ' cur' : '') + (got[i] != null ? ' found' : '') + '">' + (got[i] != null ? got[i] : '?') + '</b></span>';
      }).join('');
    }
    function round() {
      holder.innerHTML = ''; drawAsk();
      choiceRow(holder, p.choices[step], function (v, b) {
        if (done) return;
        var want = p.vals[p.ask[step]];
        if (v !== want) { done = true; KIT.shake(b); onAnswer(p.ask.length === 1 ? v : -1); return; }
        got[step] = v; b.classList.add('ok');
        if (step + 1 >= p.ask.length) { done = true; drawAsk(); onAnswer(p.answer); }
        else { step++; setTimeout(round, 260); }
      });
    }
    round();
  };

  /* ── arrowChain — 화살표 사슬 / 규칙 찾기 ── */
  X.arrowChain = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-ac'), done = false, step = 0, vals = p.nodes.slice(), ruleVals = [null, null], found = [];
    var legend = el('div'); root.appendChild(legend);
    var area = el('div', PRE + '-acarea'); root.appendChild(area);
    var holder = el('div'); root.appendChild(holder);
    var Lk = function (a, b, c) { return lk(a, b, c); };
    function draw() {
      legend.innerHTML = G.chainLegend(p, { pre: PRE, lk: Lk, ruleVals: ruleVals });
      area.innerHTML = G.chainSvg(p, { pre: PRE, vals: vals, cur: p.askRule ? -1 : p.asks[step], found: found, uid: 1 });
    }
    var total = p.askRule ? 2 : p.asks.length;
    function round() {
      draw(); holder.innerHTML = '';
      choiceRow(holder, p.choices[step], function (v, b) {
        if (done) return;
        var want = p.askRule ? (step === 0 ? p.legend.a : p.legend.b) : p.vals[p.asks[step]];
        if (v !== want) { done = true; KIT.shake(b); onAnswer(total === 1 ? v : -1); return; }
        b.classList.add('ok');
        if (p.askRule) ruleVals[step] = v; else { vals[p.asks[step]] = v; found.push(p.asks[step]); }
        if (step + 1 >= total) { done = true; draw(); onAnswer(p.answer); }
        else { step++; setTimeout(round, 260); }
      });
    }
    round();
  };

  /* ── splitList — 가르는 방법을 모두 찾기 ── */
  X.splitList = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-sl'), done = false, tries = 0;
    var found = [p.example.slice()];
    var say1 = note(root);
    var top = el('div', PRE + '-sltop'); root.appendChild(top);
    top.appendChild(el('div', PRE + '-slwhole', '<b>' + p.whole + '</b>'));
    if (p.emoji) top.appendChild(el('div', PRE + '-slobjs', Array(p.whole + 1).join('<span>' + KIT.art(p.emoji) + '</span>')));
    var list = el('div', PRE + '-sllist'); root.appendChild(list);
    var chips = el('div', PRE + '-slchips'); root.appendChild(chips);
    var okBtn = el('button', PRE + '-slok', esc(lk('다 찾았어요', 'I found them all', '都找到了'))); okBtn.type = 'button'; root.appendChild(okBtn);
    function same(a, b) { return p.ordered || p.cmp ? (a[0] === b[0] && a[1] === b[1]) : ((a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0])); }
    function draw() {
      list.innerHTML = found.map(function (f, i) { return '<div class="' + PRE + '-slrow' + (i === 0 ? ' ex' : '') + '"><span>' + f[0] + '</span><i>·</i><span>' + f[1] + '</span></div>'; }).join('');
      say1(lk('찾은 방법 ' + found.length + '가지', found.length + ' found', '已找到' + found.length + '种'));
    }
    var lo = p.minPart, hi = p.whole - p.minPart;
    for (var x = lo; x <= hi; x++) (function (x) {
      var b = el('button', 'nm-tc-choice ' + PRE + '-ch', String(x)); b.type = 'button';
      tap(b, function () {
        if (done) return;
        var pr = [x, p.whole - x];
        if (found.some(function (f) { return same(f, pr); })) { KIT.shake(b); say1(lk('같은 방법이에요!', 'That is the same way!', '这是同一种方法！'), true); return; }
        var okPair = p.pairs.find(function (q) { return same(q, pr); });
        if (!okPair) { KIT.shake(b); say1(lk('이 방법은 안 돼요', 'That one does not work', '这种方法不行'), true); return; }
        found.push(okPair.slice()); draw();
      });
      chips.appendChild(b);
    })(x);
    tap(okBtn, function () {
      if (done) return;
      if (found.length === p.k) { done = true; list.classList.add('ok'); onAnswer(p.answer); }
      else { tries++; KIT.shake(list); say1(lk('더 있어요! 지금 ' + found.length + '가지', 'There are more! You have ' + found.length, '还有！现在' + found.length + '种'), true); if (tries >= 2) { done = true; onAnswer(-1); } }
    });
    draw();
  };

  /* ── seqGap — 수열 빈칸(1개 또는 2개) ── */
  X.seqGap = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-sg'), done = false, step = 0, got = [];
    var strip = el('div', PRE + '-sgstrip'); root.appendChild(strip);
    var holder = el('div'); root.appendChild(holder);
    function drawStrip() {
      strip.innerHTML = p.seq.map(function (v, i) {
        var bi = p.blanks.indexOf(i);
        var cell = bi < 0 ? '<span class="' + PRE + '-sgc">' + v + '</span>' : '<span class="' + PRE + '-sgc blk' + (bi === step ? ' cur' : '') + (got[bi] != null ? ' found' : '') + '">' + (got[bi] != null ? got[bi] : '?') + '</span>';
        return cell + (i < p.seq.length - 1 ? '<i>→</i>' : '');
      }).join('');
    }
    function round() {
      drawStrip(); holder.innerHTML = '';
      choiceRow(holder, p.choices[step], function (v, b) {
        if (done) return;
        var want = p.seq[p.blanks[step]];
        if (v !== want) { done = true; KIT.shake(b); onAnswer(p.blanks.length === 1 ? v : -1); return; }
        got[step] = v; b.classList.add('ok');
        if (step + 1 >= p.blanks.length) { done = true; drawStrip(); onAnswer(p.answer); }
        else { step++; setTimeout(round, 260); }
      });
    }
    round();
  };

  /* ── rodNumeral — 막대 기호 읽기·덧셈(P3) ── */
  X.rodNumeral = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-rodw'), done = false;
    var tbl = el('div', PRE + '-rodtab');
    for (var n = 1; n <= 9; n++) tbl.appendChild(el('div', PRE + '-rodcell', G.rodGlyph(n, { pre: PRE }) + '<b>' + n + '</b>'));
    root.appendChild(tbl);
    var ex = el('div', PRE + '-rodex'); root.appendChild(ex);
    var big = function (n) { return '<span class="' + PRE + '-rodbig">' + G.rodGlyph(n, { pre: PRE }) + '</span>'; };
    if (p.expr.glyph != null) ex.innerHTML = big(p.expr.glyph) + '<i>=</i><b class="' + PRE + '-seans cur">?</b>';
    else ex.innerHTML = big(p.expr.a) + '<i>+</i>' + big(p.expr.b) + '<i>=</i><b class="' + PRE + '-seans cur">?</b>';
    var fmt = p.level === 'add' ? function (v) { return '<span class="' + PRE + '-rodbtn">' + G.rodGlyph(v, { pre: PRE }) + '</span>'; } : null;
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) { b.classList.add('ok'); var q = ex.querySelector('b'); if (q) { q.classList.add('found'); q.innerHTML = p.level === 'add' ? G.rodGlyph(v, { pre: PRE }) : String(v); } } else KIT.shake(b);
      onAnswer(v);
    }, fmt);
  };

  /* ============================================================
     G1-15
     ============================================================ */

  /* ── storyFill — 이야기의 빈 칸에 주머니 속 수 카드를 넣기 ── */
  X.storyFill = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-sf'), done = false, tries = 0;
    var filled = new Array(p.slots).fill(null);          /* 칸 → 칩 index */
    var scene = p.scene && p.scene.emoji ? '<span class="' + PRE + '-sfpic">' + KIT.art(p.scene.emoji) + '</span>' : '';
    var storyEl = el('div', PRE + '-sfstory'); root.appendChild(storyEl);
    speaker(root, function () { return (L3(p.story) || '').replace(/\{\d\}/g, '…'); });
    var pouch = el('div', PRE + '-sfpouch'); root.appendChild(pouch);
    var okBtn = el('button', PRE + '-slok', esc(lk('다 됐어요', 'All done', '填好了'))); okBtn.type = 'button'; root.appendChild(okBtn);
    function draw() {
      var tpl = L3(p.story);
      storyEl.innerHTML = scene + '<span>' + esc(tpl).replace(/\{(\d)\}/g, function (m, i) {
        var ci = filled[+i];
        return '<button type="button" class="' + PRE + '-slot' + (ci == null ? '' : ' on') + '" data-s="' + i + '">' + (ci == null ? '' : p.chips[ci]) + '</button>';
      }) + '</span>';
      pouch.innerHTML = '<span class="' + PRE + '-pouchart">' + KIT.art('g:pouch') + '</span>';
      var rack = el('div', PRE + '-sfchips'); pouch.appendChild(rack);
      p.chips.forEach(function (v, i) {
        var used = filled.indexOf(i) >= 0;
        var b = el('button', 'nm-tc-choice ' + PRE + '-ch' + (used ? ' dim' : ''), String(v)); b.type = 'button';
        tap(b, function () {
          if (done || used) return;
          var slot = filled.indexOf(null); if (slot < 0) return;
          filled[slot] = i; draw();
        });
        rack.appendChild(b);
      });
      okBtn.disabled = filled.indexOf(null) >= 0; okBtn.classList.toggle('on', !okBtn.disabled);
    }
    tap(storyEl, function (e) {
      var s = e.target.closest && e.target.closest('[data-s]'); if (!s || done) return;
      var i = +s.getAttribute('data-s'); if (filled[i] != null) { filled[i] = null; draw(); }
    });
    tap(okBtn, function () {
      if (done || okBtn.disabled) return;
      var ok = filled.every(function (ci, i) { return p.chips[ci] === p.sol[i]; });
      if (ok) { done = true; storyEl.classList.add('ok'); onAnswer(p.answer); }
      else {
        tries++; KIT.shake(storyEl);
        setTimeout(function () { if (done) return; filled = new Array(p.slots).fill(null); draw(); if (tries >= 2) { done = true; onAnswer(-1); } }, 600);
      }
    });
    draw();
  };

  /* ── mysteryBox — 상자 속 숨은 수 / 잘못 계산한 수(2단계) ── */
  X.mysteryBox = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-mb'), done = false;
    speaker(root, function () { return L3(p.prompt); });
    function group(n) {
      var s = ''; for (var i = 0; i < n; i++) s += '<span class="' + PRE + '-it">' + KIT.art(p.emoji) + '</span>';
      return '<span class="' + PRE + '-grp">' + s + '</span>';
    }
    if (p.op === 'wrong') {
      var step = 0, sub = p.intended === 'sub';
      var eq = el('div', PRE + '-mbeq'); root.appendChild(eq);
      var holder = el('div'); root.appendChild(holder);
      var draw = function () {
        eq.innerHTML = step === 0
          ? '<span class="' + PRE + '-blkn">?</span><i>' + (sub ? '+' : '−') + '</i><span>' + p.k + '</span><i>=</i><span>' + p.mistakenResult + '</span>'
          : '<span class="' + PRE + '-blkn found">' + p.x + '</span><i>' + (sub ? '−' : '+') + '</i><span>' + p.k + '</span><i>=</i><span class="' + PRE + '-blkn">?</span>';
      };
      var round = function () {
        draw(); holder.innerHTML = '';
        root.querySelector('.' + PRE + '-mbq') && root.querySelector('.' + PRE + '-mbq').remove();
        var q = el('div', PRE + '-note ' + PRE + '-mbq', esc(step === 0 ? lk('잘못 계산한 식에서 □는?', 'In the wrong calculation, what is □?', '在算错的算式里，□是几？') : lk('바르게 계산하면?', 'Calculated the right way?', '正确计算是多少？')));
        root.insertBefore(q, holder);
        choiceRow(holder, p.phases[step].choices, function (v, b) {
          if (done) return;
          var want = step === 0 ? p.x : p.final;
          if (v !== want) { done = true; KIT.shake(b); onAnswer(-1); return; }
          b.classList.add('ok');
          if (step === 1) { done = true; onAnswer(p.answer); } else { step = 1; setTimeout(round, 280); }
        });
      };
      round();
      return;
    }
    var box = '<span class="' + PRE + '-mbox" id="mbbox">' + KIT.art('g:box') + '<b>?</b></span>';
    var row = el('div', PRE + '-mbrow');
    if (p.op === 'add') row.innerHTML = box + '<i>+</i>' + group(p.loose) + '<i>=</i>' + group(p.total);
    else if (p.op === 'subL') row.innerHTML = group(p.loose) + '<i>−</i>' + box + '<i>=</i>' + group(p.total);
    else row.innerHTML = box + '<i>−</i>' + group(p.loose) + '<i>=</i>' + group(p.total);
    root.appendChild(row);
    if (p.eq) root.appendChild(el('div', PRE + '-mbeqline', esc(p.eq)));
    var res = el('div', PRE + '-mbres'); root.appendChild(res);
    choiceRow(root, p.choices, function (v, b) {
      if (done) return; done = true;
      if (v === p.answer) {
        var bx = row.querySelector('.' + PRE + '-mbox'); bx.innerHTML = KIT.art('g:boxopen') + '<b class="found">' + v + '</b>'; bx.classList.add('open');
        res.innerHTML = group(v); b.classList.add('ok');
      } else KIT.shake(b);
      onAnswer(v);
    });
  };

  /* ── eqChoice — 문장↔식 고르기(보기 3장) ── */
  X.eqChoice = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-ec'), done = false;
    var stemTxt = p.stem.kind === 'eq' ? p.stem.txt : (p.stem[lang()] || p.stem.ko);
    var stem = el('div', PRE + '-ecstem' + (p.stem.kind === 'eq' ? ' eq' : ''), (p.emoji ? '<span class="' + PRE + '-ecpic">' + KIT.art(p.emoji) + '</span>' : '') + '<span>' + esc(stemTxt) + '</span>');
    root.appendChild(stem);
    if (p.stem.kind !== 'eq') speaker(root, function () { return stemTxt; });
    var CIRC = ['①', '②', '③'];
    var cards = el('div', PRE + '-eccards'); root.appendChild(cards);
    p.choices.forEach(function (c, i) {
      var txt = c.kind === 'eq' ? c.txt : (c[lang()] || c.ko);
      var b = el('button', PRE + '-eccard' + (c.kind === 'eq' ? ' eq' : ''), '<em>' + CIRC[i] + '</em><span>' + esc(txt) + '</span>'); b.type = 'button';
      tap(b, function () {
        if (done) return; done = true;
        if (i === p.answer) b.classList.add('ok'); else { KIT.shake(b); }
        onAnswer(i);
      });
      cards.appendChild(b);
    });
  };

  /* ── tapWrong — 그림과 다른 수를 눌러 맞는 수로 고치기 ── */
  X.tapWrong = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-tw'), done = false, stage = 0, bad = 0;
    var scene = el('div', PRE + '-twscene'); root.appendChild(scene);
    p.scene.items.forEach(function (it) {
      var s = ''; for (var i = 0; i < it.n; i++) s += '<span class="' + PRE + '-it">' + KIT.art(it.e) + '</span>';
      scene.appendChild(el('div', PRE + '-twrow', s));
    });
    var tk = p.tokens[lang()] || p.tokens.ko;
    var sent = el('div', PRE + '-twsent'); root.appendChild(sent);
    speaker(root, function () { return tk.map(function (t) { return t.t != null ? t.t : t.n; }).join(''); });
    var holder = el('div'); root.appendChild(holder);
    var fixed = false;
    function draw() {
      sent.innerHTML = tk.map(function (t, i) {
        if (t.t != null) return '<span>' + esc(t.t) + '</span>';
        var cls = PRE + '-tk' + (stage >= 1 && t.wrong ? ' wrong' : '') + (fixed && t.wrong ? ' fixed' : '') + (bad >= 2 && t.wrong && stage === 0 ? ' hint' : '');
        return '<button type="button" class="' + cls + '" data-i="' + i + '">' + (fixed && t.wrong ? p.answer : t.n) + '</button>';
      }).join('');
    }
    tap(sent, function (e) {
      var b = e.target.closest && e.target.closest('[data-i]'); if (!b || done || stage !== 0) return;
      var t = tk[+b.getAttribute('data-i')];
      if (t.wrong) {
        stage = 1; draw();
        holder.appendChild(el('div', PRE + '-note', esc(lk('맞아요! 바르게 고쳐요', 'Right! Now fix it', '对！把它改正'))));
        choiceRow(holder, p.choices, function (v, bb) {
          if (done) return; done = true;
          if (v === p.answer) { fixed = true; draw(); bb.classList.add('ok'); } else KIT.shake(bb);
          onAnswer(v);
        });
      } else { bad++; KIT.shake(b); draw(); }
    });
    draw();
  };

  /* ── digitBoard — 숫자판을 눌러 세고 질문에 답하기 ── */
  X.digitBoard = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-db'), done = false, counted = 0;
    var cnt = {}; p.kinds.forEach(function (k) { cnt[k] = 0; });
    var tab = el('div', PRE + '-dbtab'); root.appendChild(tab);
    var board = el('div', PRE + '-dbboard'); root.appendChild(board);
    var holder = el('div'); root.appendChild(holder);
    function drawTab() {
      tab.innerHTML = p.kinds.map(function (k) { return '<span class="' + PRE + '-dbk"><span class="' + PRE + '-dbn">' + KIT.art('num:' + k, 0) + '</span><b>' + cnt[k] + '</b></span>'; }).join('');
    }
    p.grid.forEach(function (row, r) {
      row.forEach(function (d, c) {
        var b = el('button', PRE + '-dbc', KIT.art('num:' + d, (r * 5 + c) % 5)); b.type = 'button';
        tap(b, function () {
          if (b.classList.contains('cnt') || done) return;
          b.classList.add('cnt'); cnt[d]++; counted++; drawTab();
          if (counted === 20) showAsk();
        });
        board.appendChild(b);
      });
    });
    function showAsk() {
      holder.innerHTML = '';
      holder.appendChild(el('div', PRE + '-note', esc(lk('다 셌어요! 이제 골라요', 'All counted! Now pick', '数完了！现在选'))));
      choiceRow(holder, p.choices, function (v, b) {
        if (done) return; done = true;
        if (v === p.answer) b.classList.add('ok'); else KIT.shake(b);
        onAnswer(v);
      }, p.ask === 'diff' ? null : function (v) { return '<span class="' + PRE + '-dbn">' + KIT.art('num:' + v, 0) + '</span>'; });
    }
    drawTab();
    if (!holder.childNodes.length) holder.appendChild(el('div', PRE + '-note', esc(lk('칸을 하나씩 눌러서 세어요', 'Tap each square to count', '一格一格点着数'))));
  };

  /* ── dartTarget — 과녁 점수 합 / 가려진 화살 ── */
  X.dartTarget = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-dt'), done = false;
    var head = el('div', PRE + '-dthead', '<span class="' + PRE + '-dtico">' + KIT.art('g:target') + '</span>' +
      (p.ask === 'missing' ? '<span>' + esc(lk('모두 합쳐', 'Total', '一共')) + '</span><b class="' + PRE + '-badge">' + p.total + '</b><span class="' + PRE + '-cloud">☁️ ?</span>' : '<span>' + esc(lk('화살이 박힌 곳의 점수', 'Points where the arrows landed', '箭射中的分数')) + '</span>'));
    root.appendChild(head);
    var area = el('div', PRE + '-dtarea'); area.innerHTML = G.dartSvg(p, { pre: PRE, label: L3(p.prompt) }); root.appendChild(area);
    var say1 = note(root);
    function finish(v) {
      var known = p.hits.map(function (h) { return h.ring; });
      say1(p.ask === 'sum' ? known.join(' + ') + ' = ' + p.answer : known.join(' + ') + ' + ' + p.answer + ' = ' + p.total);
    }
    if (p.ask === 'sum') {
      choiceRow(root, p.choices, function (v, b) {
        if (done) return; done = true;
        if (v === p.answer) { b.classList.add('ok'); finish(v); } else KIT.shake(b);
        onAnswer(v);
      });
    } else {
      root.appendChild(el('div', PRE + '-note', esc(lk('가려진 화살이 박힌 띠를 눌러요', 'Tap the band where the hidden arrow landed', '点一点被遮住的箭射中的圈'))));
      tap(area, function (e) {
        var r = e.target.closest && e.target.closest('[data-s]'); if (!r || done) return;
        var v = +r.getAttribute('data-s'); done = true;
        if (v === p.answer) { r.classList.add('ok'); finish(v); } else KIT.shake(area);
        onAnswer(v);
      });
    }
  };

  /* ── sortBasket3 — 세 종류를 세 바구니에 나누고 가장 많은 것·적은 것·차 ── */
  X.sortBasket3 = function (p, container, onAnswer, KIT) {
    var root = wrap(container, PRE + '-s3'), done = false, remaining = p.items.length;
    var cnt = [0, 0, 0];
    var scatter = el('div', PRE + '-s3chips'); root.appendChild(scatter);
    var baskets = el('div', PRE + '-s3baskets'); root.appendChild(baskets);
    var holder = el('div'); root.appendChild(holder);
    var bEls = p.baskets.map(function (bk, i) {
      var b = el('button', PRE + '-s3b', '<span class="' + PRE + '-s3ico">' + KIT.art(bk.emoji) + '</span><b>0</b>'); b.type = 'button'; b.dataset.i = i;
      tap(b, function () {
        if (!ready || done || p.askMode === 'diff') return; done = true;
        if (i === p.answer) b.classList.add('ok'); else KIT.shake(b);
        onAnswer(i);
      });
      baskets.appendChild(b); return b;
    });
    var ready = false;
    p.items.forEach(function (it) {
      var chip = el('button', PRE + '-s3chip', KIT.art(it.e)); chip.type = 'button';
      tap(chip, function () {
        if (chip.parentNode !== scatter) return;
        var i = 'ABC'.indexOf(it.type); chip.remove(); cnt[i]++; bEls[i].querySelector('b').textContent = cnt[i]; remaining--;
        if (remaining === 0) ask();
      });
      scatter.appendChild(chip);
    });
    function ask() {
      ready = true;
      if (p.askMode === 'diff') {
        holder.appendChild(el('div', PRE + '-note', esc(lk('가장 많은 것 − 가장 적은 것은?', 'Biggest − smallest?', '最多的 − 最少的是多少？'))));
        choiceRow(holder, p.choices, function (v, b) {
          if (done) return; done = true;
          if (v === p.answer) b.classList.add('ok'); else KIT.shake(b);
          onAnswer(v);
        });
      } else { baskets.classList.add('pick'); holder.appendChild(el('div', PRE + '-note', esc(p.askMode === 'most' ? lk('가장 많은 바구니를 눌러요', 'Tap the fullest basket', '点一点最多的篮子') : lk('가장 적은 바구니를 눌러요', 'Tap the emptiest basket', '点一点最少的篮子')))); }
    }
  };

  /* ── stairsGame · ageStory — 기존 storyCard 를 그대로 쓰는 얇은 포장 ── */
  function viaStoryCard(p, container, onAnswer, head) {
    var root = wrap(container, PRE + '-sc');
    if (head) root.appendChild(el('div', PRE + '-schead', head));
    var inner = el('div'); root.appendChild(inner);
    var q = {}; Object.keys(p).forEach(function (k) { q[k] = p[k]; }); q.widget = 'storyCard';
    window.NM_WIDGETS.render(q, inner, onAnswer);
  }
  X.stairsGame = function (p, container, onAnswer) {
    var g = p.game;
    viaStoryCard(p, container, onAnswer,
      '<span class="up">⬆ ' + g.up + '</span><span>' + esc(lk('이기면 올라가요', 'Win: go up', '赢了上去')) + '</span>' +
      (g.losses ? '<span class="dn">⬇ ' + g.down + '</span><span>' + esc(lk('지면 내려가요', 'Lose: go down', '输了下来')) + '</span>' : '') +
      '<span>' + esc(lk('· 땅에서 출발', '· start on the ground', '· 从地面出发')) + '</span>');
  };
  X.ageStory = function (p, container, onAnswer) { viaStoryCard(p, container, onAnswer, ''); };

})();
