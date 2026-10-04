/* G1-1~3호(N-01 수 세기 · N-02 수의 순서 · N-03 몇째와 크기 비교) 화면 위젯.
   window.NM_WIDGET_EXT['이름'] = function(problem, container, onAnswer, KIT) — KIT = {art, esc, shake, buildNumpad, renderKaTeX}.
   계약: 호스트가 +val === problem.answer 로 채점한다. 위젯 답은 숫자 하나 — 안에서 판정해
         맞으면 onAnswer(problem.answer), 틀리면 shake 후 onAnswer(-1). 보기는 생성기가 준 problem.choices 그대로(Math.random 금지).
   위젯 이름은 전부 g13 접두 — 다른 묶음의 numPick 등과 겹치지 않게. 그림 도구는 app/g1/1-3.art.js(window.NM_G13). */
(function(){ 'use strict';
window.NM_WIDGET_EXT = window.NM_WIDGET_EXT || {};
var EXT = window.NM_WIDGET_EXT;
var G = function(){ return window.NM_G13 || {}; };

/* ── 공용 도구 ── */
function lang(){ return (window.S && window.S.lang) || 'ko'; }
function tr(o){ if(o == null) return ''; if(typeof o === 'string') return o; return o[lang()] || o.ko || ''; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
function div(cls, html){ var d = document.createElement('div'); if(cls) d.className = cls; if(html != null) d.innerHTML = html; return d; }
function tap(el, fn){ el.addEventListener('pointerup', function(e){ e.stopPropagation(); fn(e); }); return el; }
function btn(cls, html, fn){ var b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = html; if(fn) tap(b, fn); return b; }
function W(ko, en, zh){ var l = lang(); return l === 'en' ? en : l === 'zh' ? zh : ko; }
function circ(n){ return ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'][n] || String(n); }
/* 한글 받침에 맞는 조사 — 숫자는 읽는 말(영일이삼…)로 */
function josaNum(n, withB, noB){ var c = ['영','일','이','삼','사','오','육','칠','팔','구'][n]; var code = c.charCodeAt(0); return ((code - 0xAC00) % 28) !== 0 ? withB : noB; }

/* 보기 줄 — 생성기가 정한 choices 를 그대로. render(v) 가 칸 안 그림을 준다(없으면 숫자). */
function choiceRow(root, choices, answer, KIT, onAnswer, render, cls){
  var row = div('nm-tc-choices nm-g13-choices' + (cls ? ' ' + cls : '')), lock = false;
  (choices || []).forEach(function(v){
    var b = btn('nm-tc-choice' + (render ? ' nm-g13-cc' : ''), render ? render(v) : String(v), function(){
      if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
      if(v !== answer){ KIT.shake(b); onAnswer(-1); } else { b.classList.add('ok'); onAnswer(v); }
    });
    row.appendChild(b);
  });
  root.appendChild(row); return row;
}
function submitBtn(root, fn){ var b = btn('nm-tm-done', '✔', fn); root.appendChild(b); return b; }
function counterEl(root, init){ var c = div('nm-tm-counter', '<span class="nm-tm-cnt">' + (init || 0) + '</span>'); root.appendChild(c); return c.firstChild; }

/* ═══════════ g13Count — 세기(같은 부류·도형·표·묶고 남은 수·가장 가까운 수) ═══════════
   items:[{e,t,x,y,r,s,f,label?,ring?}] layout:'scatter'|'labeled'|'grid'|'row'. 탭하면 번호가 찍히며 세어지고, 아래 보기에서 답을 고른다. */
EXT.g13Count = function(p, c, onAnswer, KIT){
  var art = KIT.art, items = p.items.map(function(it, i){ return Object.assign({ id: i }, it); }), marked = [];
  var root = div('nm-g13 nm-g13-count'); c.appendChild(root);
  var scene = div(); root.appendChild(scene);
  var layout = p.layout || 'scatter', interactive = p.ask !== 'kinds';
  var cnt = null;
  if(interactive) cnt = counterEl(root, 0);
  function ordBadge(ord){ return ord >= 0 ? '<span class="nm-tc-ord">' + (ord + 1) + '</span>' : ''; }
  function itemBtn(it, cls){
    var ord = marked.indexOf(it.id);
    var b = document.createElement('button'); b.type = 'button';
    b.className = 'nm-tc-item ' + (cls || '') + (ord >= 0 ? ' on' : '') + (it.ring ? ' ringed' : '');
    b.innerHTML = '<span class="nm-tc-emoji">' + art(it.e, it.f) + '</span>' + (it.label != null ? '<i class="nm-g13-lab">' + it.label + '</i>' : '') + ordBadge(ord);
    if(interactive && !it.ring) tap(b, function(){
      var at = marked.indexOf(it.id); if(at >= 0) marked.splice(at, 1); else marked.push(it.id);
      cnt.textContent = marked.length; paint();
    }); else b.tabIndex = -1;
    return b;
  }
  function paint(){
    scene.innerHTML = '';
    if(layout === 'scatter'){
      scene.className = 'nm-tc-scene nm-tc-scatter';
      items.forEach(function(it){
        var b = itemBtn(it, 'sc'); b.style.left = it.x + '%'; b.style.top = it.y + '%';
        b.style.setProperty('--r', it.r + 'deg'); b.style.setProperty('--s', it.s);
        if(/^num:/.test(it.e)) b.classList.add('dgf' + it.f);
        scene.appendChild(b);
      });
    } else if(layout === 'grid'){
      scene.className = 'nm-g13-table';
      var heads = (p.headers && (p.headers[lang()] || p.headers.ko)) || [];
      heads.forEach(function(h){ scene.appendChild(div('nm-g13-th', esc(h))); });
      items.forEach(function(it){ scene.appendChild(itemBtn(it, 'cell')); });
    } else if(layout === 'row'){
      scene.className = 'nm-g13-line';
      var ringN = p.ring || 0;
      var grp = div('nm-g13-ring'); items.slice(0, ringN).forEach(function(it){ grp.appendChild(itemBtn(it, 'cell')); });
      scene.appendChild(grp);
      items.slice(ringN).forEach(function(it){ scene.appendChild(itemBtn(it, 'cell')); });
    } else {
      scene.className = 'nm-g13-line';
      items.forEach(function(it){ scene.appendChild(itemBtn(it, 'cell')); });
    }
  }
  paint();
  choiceRow(root, p.choices, p.answer, KIT, onAnswer);
};

/* ═══════════ g13Rep — 같은 수끼리 잇기(숫자·점·10칸 틀·손가락·고유어·한자어) ═══════════ */
function repCard(type, n){
  var g = G(), l = lang();
  if(type === 'dice') return g.diceSvg(n, { dot: '#0e2c57' });
  if(type === 'frame') return g.frameSvg(n, { w: 52, ink: '#0e2c57', dot: '#e5a82a' });
  if(type === 'fingers') return n <= 5 ? g.handSvg(n) : '<span class="nm-g13-hands">' + g.handSvg(5) + g.handSvg(n - 5) + '</span>';
  if(type === 'native' || type === 'sino') return '<span class="nm-g13-word">' + esc(g.numWord(n, type, l)) + '</span>';
  return '<span class="nm-ml-num">' + n + '</span>';
}
EXT.g13Rep = function(p, c, onAnswer, KIT){
  var left = p.left, right = p.right, N = left.length, sel = null, matched = { L: {}, R: {} }, remaining = N, pairColor = 0;
  var COL = ['#e8f4ff', '#fff0d6', '#eaf7e6', '#f6e8ff'];
  var root = div('nm-ml-wrap nm-g13-rep'); c.appendChild(root);
  var arena = div('nm-ml-arena'); root.appendChild(arena);
  var cols = { L: div('nm-ml-col'), R: div('nm-ml-col') };
  function mk(side, i){
    var type = side === 'L' ? (p.leftType || 'num') : p.rightType, n = (side === 'L' ? left : right)[i];
    var b = btn('nm-ml-card nm-g13-mc', repCard(type, n));
    tap(b, function(){
      if(matched[side][i]) return;
      if(sel && sel.side === side){ cols[side].children[sel.i].classList.remove('sel'); if(sel.i === i){ sel = null; return; } sel = null; }
      if(!sel){ sel = { side: side, i: i }; b.classList.add('sel'); return; }
      var other = sel, a = other.side === 'L' ? left[other.i] : right[other.i], bb = side === 'L' ? left[i] : right[i];
      var ob = cols[other.side].children[other.i]; ob.classList.remove('sel');
      if(a === bb){
        var col = COL[pairColor++ % COL.length];
        [ob, b].forEach(function(x){ x.classList.add('matched'); x.style.background = col; });
        matched[other.side][other.i] = 1; matched[side][i] = 1; sel = null; remaining--;
        if(remaining === 0) setTimeout(function(){ onAnswer(p.answer); }, 600);
      } else { KIT.shake(ob); KIT.shake(b); sel = null; onAnswer(-1); }
    });
    return b;
  }
  left.forEach(function(_, i){ cols.L.appendChild(mk('L', i)); });
  right.forEach(function(_, i){ cols.R.appendChild(mk('R', i)); });
  arena.appendChild(cols.L); arena.appendChild(cols.R);
};

/* ═══════════ g13RepFill — 표의 빈칸(숫자·한자어·고유어·10칸 틀) ═══════════ */
EXT.g13RepFill = function(p, c, onAnswer, KIT){
  var l = lang(), order = ['num', 'sino', 'native', 'frame'], blank = p.blank;
  var kinds = order.filter(function(k){ return !(k === 'sino' && l !== 'ko'); });      /* 한자어 수는 한국어에만 있다 */
  if(blank === 'sino' && l !== 'ko') blank = 'native';
  var root = div('nm-g13 nm-g13-repfill'); c.appendChild(root);
  var row = div('nm-g13-rfrow'); root.appendChild(row);
  var slot = null;
  kinds.forEach(function(k){
    if(k === blank){ slot = div('nm-g13-rfcard blank', '?'); row.appendChild(slot); }
    else row.appendChild(div('nm-g13-rfcard', repCard(k, p.n)));
  });
  choiceRow(root, p.choices, p.answer, KIT, function(v){
    if(v === p.answer && slot){ slot.classList.add('found'); slot.innerHTML = repCard(blank, p.n); }
    onAnswer(v);
  }, function(v){ return repCard(blank, v); }, 'nm-g13-cw');
};

/* ═══════════ g13Grid — 격자 읽기 / 칠하기(한 줄 10칸 포함) ═══════════ */
EXT.g13Grid = function(p, c, onAnswer, KIT){
  var art = KIT.art, root = div('nm-g13 nm-fr-wrap nm-g13-grid'); c.appendChild(root);
  var rows = p.rows, cols = p.cols, em = p.emoji;
  var fr = div('nm-g13-gframe'); fr.style.setProperty('--cols', cols); fr.style.setProperty('--cell', (cols >= 10 ? 32 : cols >= 5 ? 46 : 54) + 'px');
  root.appendChild(fr);
  if(p.gmode === 'read'){
    var set = {}; p.cells.forEach(function(i){ set[i] = 1; });
    for(var i = 0; i < rows * cols; i++) fr.appendChild(div('nm-g13-gcell' + (set[i] ? ' on' : '')));
    choiceRow(root, p.choices, p.answer, KIT, onAnswer);
    return;
  }
  var on = {}, size = 0, lock = false, cells = [];
  for(var k = 0; k < rows * cols; k++) (function(k){
    var b = btn('nm-g13-gcell tap', '', function(){
      if(on[k]){ delete on[k]; size--; b.classList.remove('on'); b.innerHTML = ''; }
      else { on[k] = 1; size++; b.classList.add('on'); b.innerHTML = em ? '<span class="nm-fr-chip">' + art(em) + '</span>' : ''; }
      cnt.textContent = size;
    });
    cells.push(b); fr.appendChild(b);
  })(k);
  var cnt = counterEl(root, 0);
  submitBtn(root, function(){
    if(lock || size === 0) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    if(size !== p.target){ KIT.shake(fr); onAnswer(-1); } else onAnswer(p.answer);
  });
};

/* ═══════════ g13CircleCut — 동그라미 나누기(읽기/그리기) ═══════════ */
var N12 = [];
for(var i12 = 0; i12 < 12; i12++){ var t12 = (i12 * 30 - 90) * Math.PI / 180; N12.push([Math.cos(t12), Math.sin(t12)]); }
function chordCross(a, b){
  var p = a[0], q = a[1], r = b[0], s = b[1];
  if(p === r || p === s || q === r || q === s) return null;
  var inb = function(x){ return x > Math.min(p, q) && x < Math.max(p, q); };
  if(inb(r) === inb(s)) return null;
  var A = N12[p], B = N12[q], C = N12[r], D = N12[s];
  var d = (B[0] - A[0]) * (D[1] - C[1]) - (B[1] - A[1]) * (D[0] - C[0]);
  var t = ((C[0] - A[0]) * (D[1] - C[1]) - (C[1] - A[1]) * (D[0] - C[0])) / d;
  return [Math.round((A[0] + t * (B[0] - A[0])) * 1e6) / 1e6, Math.round((A[1] + t * (B[1] - A[1])) * 1e6) / 1e6];
}
function piecesOf(ch){
  var n = 1;
  ch.forEach(function(x, i){ var pts = {}, m = 0; for(var j = 0; j < i; j++){ var q = chordCross(x, ch[j]); if(q && !pts[q.join()]){ pts[q.join()] = 1; m++; } } n += 1 + m; });
  return n;
}
EXT.g13CircleCut = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-cut'); c.appendChild(root);
  var chords = p.cmode === 'read' ? p.chords.slice() : [], pick = -1, lock = false;
  var host = div('nm-g13-cutbox'); root.appendChild(host);
  var info = p.cmode === 'draw' ? div('nm-g13-cutinfo') : null; if(info) root.appendChild(info);
  function svg(){
    var s = '<svg viewBox="-1.25 -1.25 2.5 2.5" class="nm-g13-cutsvg"><circle cx="0" cy="0" r="1" class="nm-g13-circ"/>';
    chords.forEach(function(ch, i){ var a = N12[ch[0]], b = N12[ch[1]];
      s += '<line class="nm-g13-chord" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>';
      if(p.cmode === 'draw') s += '<line class="nm-g13-chit" data-ch="' + i + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>'; });
    N12.forEach(function(q, i){ s += '<g class="nm-g13-nd' + (pick === i ? ' sel' : '') + '" data-n="' + i + '"><circle cx="' + q[0] + '" cy="' + q[1] + '" r=".06" class="nm-g13-ndot"/>' + (p.cmode === 'draw' ? '<circle cx="' + q[0] + '" cy="' + q[1] + '" r=".17" fill="transparent"/>' : '') + '</g>'; });
    return s + '</svg>';
  }
  function paint(){
    host.innerHTML = svg();
    if(p.cmode !== 'draw') return;
    info.innerHTML = W('목표 ' + p.target + '조각 · 지금 <b>' + piecesOf(chords) + '</b>조각', 'Goal: ' + p.target + ' pieces · now <b>' + piecesOf(chords) + '</b>', '目标 ' + p.target + ' 块 · 现在 <b>' + piecesOf(chords) + '</b> 块');
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-nd'), function(g){ tap(g, function(){
      var n = +g.getAttribute('data-n');
      if(pick < 0){ pick = n; paint(); return; }
      if(pick === n){ pick = -1; paint(); return; }
      var ch = [Math.min(pick, n), Math.max(pick, n)], at = -1;
      chords.forEach(function(x, i){ if(x[0] === ch[0] && x[1] === ch[1]) at = i; });
      if(at >= 0) chords.splice(at, 1);
      else if(chords.length >= (p.maxChords || 4)){ KIT.shake(host); pick = -1; paint(); return; }
      else chords.push(ch);
      pick = -1; paint();
    }); });
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-chit'), function(l){ tap(l, function(){ chords.splice(+l.getAttribute('data-ch'), 1); pick = -1; paint(); }); });
  }
  paint();
  if(p.cmode === 'read') choiceRow(root, p.choices, p.answer, KIT, onAnswer);
  else submitBtn(root, function(){
    if(lock || !chords.length) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    if(piecesOf(chords) === p.target) onAnswer(p.answer); else { KIT.shake(host); onAnswer(-1); }
  });
};

/* ═══════════ g13Blocks — 쌓기나무(개수 읽기 / 두 그림 비교) ═══════════ */
EXT.g13Blocks = function(p, c, onAnswer, KIT){
  var g = G(), root = div('nm-g13 nm-g13-blocks'); c.appendChild(root);
  if(p.bmode !== 'cmp'){
    root.appendChild(div('nm-g13-isobox', g.isoSvg(p.heights, { w: 22 })));
    choiceRow(root, p.choices, p.answer, KIT, onAnswer);
    return;
  }
  var row = div('nm-g13-cmprow'); root.appendChild(row);
  row.appendChild(div('nm-g13-isobox sm', g.isoSvg(p.heightsA, { w: 16 })));
  var slot = div('nm-g13-sign slot', '○'); row.appendChild(slot);
  row.appendChild(div('nm-g13-isobox sm', g.isoSvg(p.heightsB, { w: 16 })));
  var bs = div('nm-g13-signbtns'), lock = false; root.appendChild(bs);
  [[1, '>'], [2, '<']].forEach(function(x){
    var b = btn('nm-g13-signbtn', x[1], function(){
      if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
      if(x[0] === p.answer){ slot.textContent = x[1]; slot.classList.add('found'); onAnswer(p.answer); } else { KIT.shake(b); onAnswer(-1); }
    });
    bs.appendChild(b);
  });
};

/* ═══════════ g13DotLength — 점판 위 선의 길이(읽기/그리기) ═══════════ */
EXT.g13DotLength = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-dl'); c.appendChild(root);
  var S = 56, cols = p.cols, rows = p.rows, host = div('nm-g13-dlbox'); root.appendChild(host);
  var path = p.lmode === 'read' ? p.path.slice() : [], lock = false;
  var info = p.lmode === 'draw' ? div('nm-g13-cutinfo') : null; if(info) root.appendChild(info);
  function pt(q){ return [14 + q[0] * S / 1, 14 + q[1] * S / 1]; }
  function svg(){
    var w = 28 + (cols - 1) * S, h = 28 + (rows - 1) * S;
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" class="nm-g13-dlsvg">';
    if(path.length > 1){ s += '<polyline class="nm-g13-dlline" fill="none" points="' + path.map(function(q){ return pt(q).join(','); }).join(' ') + '"/>'; }
    for(var r = 0; r < rows; r++) for(var cc = 0; cc < cols; cc++){
      var q = pt([cc, r]), isEnd = path.length && path[path.length - 1][0] === cc && path[path.length - 1][1] === r;
      s += '<g class="nm-g13-dp' + (isEnd && p.lmode === 'draw' ? ' end' : '') + '" data-c="' + cc + '" data-r="' + r + '"><circle cx="' + q[0] + '" cy="' + q[1] + '" r="5" class="nm-g13-dpc"/><circle cx="' + q[0] + '" cy="' + q[1] + '" r="22" fill="transparent"/></g>';
    }
    return s + '</svg>';
  }
  function same(a, b){ return a[0] === b[0] && a[1] === b[1]; }
  function paint(){
    host.innerHTML = svg();
    if(p.lmode !== 'draw') return;
    info.innerHTML = W('목표 ' + p.target + ' · 지금 <b>' + Math.max(0, path.length - 1) + '</b>', 'Goal ' + p.target + ' · now <b>' + Math.max(0, path.length - 1) + '</b>', '目标 ' + p.target + ' · 现在 <b>' + Math.max(0, path.length - 1) + '</b>');
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-dp'), function(g){ tap(g, function(){
      var q = [+g.getAttribute('data-c'), +g.getAttribute('data-r')];
      if(!path.length){ path = [q]; paint(); return; }
      var last = path[path.length - 1];
      if(same(last, q)){ path.pop(); paint(); return; }
      var adj = Math.abs(last[0] - q[0]) + Math.abs(last[1] - q[1]) === 1;
      if(!adj){ if(path.length === 1){ path = [q]; paint(); } else KIT.shake(host); return; }
      for(var i = 1; i < path.length; i++) if((same(path[i - 1], last) && same(path[i], q)) || (same(path[i - 1], q) && same(path[i], last))){ KIT.shake(host); return; }
      path.push(q); paint();
    }); });
  }
  paint();
  if(p.lmode === 'read') choiceRow(root, p.choices, p.answer, KIT, onAnswer);
  else submitBtn(root, function(){
    if(lock || path.length < 2) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    var seen = {}, dup = false; path.forEach(function(q){ var k = q.join(); if(seen[k]) dup = true; seen[k] = 1; });
    if(path.length - 1 === p.target && !dup) onAnswer(p.answer); else { KIT.shake(host); onAnswer(-1); }
  });
};

/* ═══════════ g13Odd — 칸 수가 다른 것 고르기 ═══════════ */
EXT.g13Odd = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-odd'), lock = false; c.appendChild(root);
  p.shapes.forEach(function(cells, i){
    var s = '<svg viewBox="0 0 66 66" class="nm-g13-oddsvg">';
    cells.forEach(function(q){ s += '<rect x="' + (5 + q[1] * 18) + '" y="' + (5 + q[0] * 18) + '" width="17" height="17" rx="2" class="nm-g13-oc"/>'; });
    var b = btn('nm-g13-oddcard', s + '</svg><i>' + circ(i + 1) + '</i>', function(){
      if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
      if(i + 1 === p.answer){ b.classList.add('ok'); onAnswer(p.answer); } else { KIT.shake(b); onAnswer(-1); }
    });
    root.appendChild(b);
  });
};

/* ═══════════ g13Turn — 카드를 거꾸로(180도) ═══════════ */
EXT.g13Turn = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-turn'); c.appendChild(root);
  var card = div('nm-g13-turncard', '<span>' + p.digit + '</span>'); root.appendChild(card);
  var flipped = false;
  root.appendChild(btn('nm-g13-turnbtn', W('뒤집어 볼까?', 'Turn it!', '转一转！'), function(){ flipped = !flipped; card.classList.toggle('flip', flipped); }));
  choiceRow(root, p.choices, p.answer, KIT, onAnswer);
};

/* ═══════════ g13Dots — 점 잇기(작은 수부터/큰 수부터, 미리 그린 선) ═══════════ */
EXT.g13Dots = function(p, c, onAnswer, KIT){
  var NS = 'http://www.w3.org/2000/svg', pts = p.pts, n = pts.length, labels = p.labels;
  var seq = pts.map(function(_, i){ return i; }).sort(function(a, b){ return p.order === 'down' ? labels[b] - labels[a] : labels[a] - labels[b]; });
  var next = 0, done = false;
  var root = div('nm-dd-wrap nm-g13-dots'); c.appendChild(root);
  var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'nm-dd-svg'); svg.setAttribute('viewBox', '0 0 100 100');
  var lines = document.createElementNS(NS, 'g'), dots = document.createElementNS(NS, 'g'); svg.appendChild(lines); svg.appendChild(dots);
  var hint = div('nm-dd-hint', p.order === 'down' ? W('큰 수부터 거꾸로!', 'Biggest number first, then backward!', '从最大的数开始倒着连！') : W('작은 수부터 차례대로!', 'From the smallest number in order!', '从最小的数开始按顺序！'));
  root.appendChild(svg); root.appendChild(hint);
  function line(a, b){ var l = document.createElementNS(NS, 'line'); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); lines.appendChild(l); }
  var dotEls = [];
  pts.forEach(function(q, i){
    var g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'nm-dd-dot');
    var hit = document.createElementNS(NS, 'circle'); hit.setAttribute('cx', q[0]); hit.setAttribute('cy', q[1]); hit.setAttribute('r', 11); hit.setAttribute('class', 'nm-dd-hit');
    var ci = document.createElementNS(NS, 'circle'); ci.setAttribute('cx', q[0]); ci.setAttribute('cy', q[1]); ci.setAttribute('r', 6.5);
    var t = document.createElementNS(NS, 'text'); t.setAttribute('x', q[0]); t.setAttribute('y', q[1]); t.textContent = labels[i];
    g.appendChild(hit); g.appendChild(ci); g.appendChild(t);
    g.addEventListener('pointerup', function(e){
      e.stopPropagation(); if(done) return;
      if(i === seq[next]) advance(i);
      else { g.classList.add('no'); setTimeout(function(){ g.classList.remove('no'); }, 450); onAnswer(-1); }
    });
    dotEls[i] = g; dots.appendChild(g);
  });
  function finish(){
    done = true; if(p.close) line(pts[seq[n - 1]], pts[seq[0]]);
    hint.textContent = W('🎉 완성!', '🎉 Done!', '🎉 完成了！');
    setTimeout(function(){ onAnswer(p.answer); }, 600);
  }
  function advance(i){
    dotEls[i].classList.add('on');
    if(next > 0) line(pts[seq[next - 1]], pts[seq[next]]);
    next++;
    if(next >= n) finish();
  }
  /* 미리 그린 선 — 처음 pre 개의 선분(= 점 pre+1 개)을 이미 이어 둔다 */
  for(var k = 0; k <= (p.pre || 0) && k < n; k++){ if(k < n && (p.pre || 0) > 0) advance(seq[k]); }
};

/* ═══════════ g13Seq — 반복 규칙·교차 수열·두 수 사이(보기는 생성기가 정함) ═══════════ */
EXT.g13Seq = function(p, c, onAnswer, KIT){
  var root = div('nm-sf-wrap nm-g13-seq'); c.appendChild(root);
  var row = div('nm-sf-row nm-g13-seqrow'); root.appendChild(row);
  var blankEl = null;
  p.seq.forEach(function(v, i){
    if(i > 0) row.appendChild(div('nm-sf-arr', p.kind === 'between' ? '' : '→'));
    if(v === null){ blankEl = div('nm-sf-chip blank', '?'); row.appendChild(blankEl); }
    else row.appendChild(div('nm-sf-chip', String(v)));
  });
  choiceRow(root, p.choices, p.answer, KIT, function(v){
    if(v === p.answer && blankEl){ blankEl.textContent = v; blankEl.classList.add('found'); }
    onAnswer(v);
  });
};

/* ═══════════ g13Path — 화살표 길 채우기(줄·굽이·원호·격자) ═══════════
   빈칸(점선)을 길 순서로 하나씩 채운다. 숫자 타일을 누르면 맞는 값만 들어가고, 틀리면 흔들린다. 다 채우면 onAnswer(빈칸 수). */
EXT.g13Path = function(p, c, onAnswer, KIT){
  var g = G(), root = div('nm-g13 nm-g13-pathw'); c.appendChild(root);
  var blanks = []; p.nodes.forEach(function(n, i){ if(!n.show) blanks.push(i); });
  var fills = {}, focus = blanks[0], left = blanks.length, usedTile = {}, finished = false;
  var legend = p.legend ? div('nm-g13-legend', esc(tr(p.legend))) : null; if(legend) root.appendChild(legend);
  var host = div('nm-g13-pathbox'); root.appendChild(host);
  var bank = div('nm-g13-bank'); root.appendChild(bank);
  function paint(){
    host.innerHTML = g.pathSvg(p, { fills: fills, focus: focus });
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-pn.blank'), function(el){ tap(el, function(){
      var i = +el.getAttribute('data-i'); if(fills[i] == null){ focus = i; paint(); } }); });
  }
  paint();
  p.bank.forEach(function(v, bi){
    var b = btn('nm-g13-tile', String(v), function(){
      if(finished || usedTile[bi] || focus == null) return;
      if(v === p.nodes[focus].v){
        fills[focus] = v; usedTile[bi] = 1; b.classList.add('used'); left--;
        var rest = blanks.filter(function(i){ return fills[i] == null; }), after = rest.filter(function(i){ return i > focus; });
        focus = rest.length ? (after.length ? after[0] : rest[0]) : null;
        paint();
        if(left === 0){ finished = true; setTimeout(function(){ onAnswer(p.answer); }, 600); }
      } else { KIT.shake(b); onAnswer(-1); }
    });
    bank.appendChild(b);
  });
};

/* ═══════════ g13NumPick — 수 타일에 색칠·○·△·× 표시(뛰어 세기·가까운 수·범위·큰 수 작은 수) ═══════════ */
function symHtml(sym){
  if(sym === '○') return '<span class="nm-g13-sym o"></span>';
  if(sym === '△') return '<svg class="nm-g13-sym t" viewBox="0 0 30 30"><path d="M15 4 L27 25 L3 25 Z"/></svg>';
  if(sym === '×') return '<svg class="nm-g13-sym x" viewBox="0 0 30 30"><path d="M6 6 L24 24 M24 6 L6 24"/></svg>';
  return '';
}
EXT.g13NumPick = function(p, c, onAnswer, KIT){
  var art = KIT.art, root = div('nm-g13 nm-g13-pick'); c.appendChild(root);
  var syms = []; p.marks.forEach(function(m){ if(syms.indexOf(m.sym) < 0) syms.push(m.sym); });
  var tool = syms[0], user = {}, locked = {}, lock = false;
  (p.pre || []).forEach(function(i){ user[i] = 'color'; locked[i] = 1; });
  if(p.expr) root.appendChild(div('nm-g13-expr', esc(p.expr)));
  if(p.scene){ var sc = div('nm-g13-scene'); for(var k = 0; k < p.scene.n; k++) sc.appendChild(div('nm-g13-sitem', art(p.scene.e))); root.appendChild(sc); }
  var tools = null;
  if(syms.length > 1){
    tools = div('nm-g13-tools'); root.appendChild(tools);
    syms.forEach(function(sy){ var b = btn('nm-g13-tool', symHtml(sy) || sy, function(){ tool = sy; paintTools(); }); b.setAttribute('data-sym', sy); tools.appendChild(b); });
  }
  function paintTools(){ if(!tools) return; Array.prototype.forEach.call(tools.children, function(b){ b.classList.toggle('sel', b.getAttribute('data-sym') === tool); }); }
  paintTools();
  var row = div('nm-g13-tiles'); root.appendChild(row);
  var tileEls = [];
  p.tiles.forEach(function(v, i){
    var b = btn('nm-g13-ptile', '<span class="nm-g13-pn">' + v + '</span>', function(){
      if(locked[i]) return;
      if(user[i] === tool) delete user[i]; else user[i] = tool;
      paintTiles();
    });
    tileEls.push(b); row.appendChild(b);
  });
  function paintTiles(){
    tileEls.forEach(function(b, i){
      var s = user[i]; b.classList.toggle('color', s === 'color');
      var ov = b.querySelector('.nm-g13-ov'); if(ov) ov.remove();
      if(s && s !== 'color'){ var o = div('nm-g13-ov', symHtml(s)); b.appendChild(o); }
    });
  }
  paintTiles();
  var tail = div('nm-g13-picktail'); root.appendChild(tail);
  function expectedOk(){
    var want = {}; p.marks.forEach(function(m){ m.set.forEach(function(i){ want[i] = m.sym; }); });
    var ok = true; p.tiles.forEach(function(_, i){ if((want[i] || null) !== (user[i] || null)) ok = false; });
    return ok;
  }
  var sub = submitBtn(tail, function(){
    if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    if(!Object.keys(user).length){ return; }
    if(!expectedOk()){ KIT.shake(row); onAnswer(-1); return; }
    if(p.ask === 'count'){
      sub.remove(); tail.appendChild(div('nm-g13-howmany', W('몇 개일까요?', 'How many?', '一共有几个？')));
      choiceRow(tail, p.choices, p.answer, KIT, onAnswer);
    } else onAnswer(p.answer);
  });
};

/* ═══════════ g13Order — 수 카드를 정해진 순서로 누르기(작은/큰 순서·가까운 순서 + 수직선) ═══════════ */
EXT.g13Order = function(p, c, onAnswer, KIT){
  var N = p.tiles.length, root = div('nm-g13 nm-g13-order'); c.appendChild(root);
  var want = p.tiles.slice();
  if(p.otype === 'near') want.sort(function(a, b){ return Math.abs(a - p.base) - Math.abs(b - p.base); });
  else if(p.otype === 'desc') want.sort(function(a, b){ return b - a; });
  else want.sort(function(a, b){ return a - b; });
  var k = 0, placed = [], line = null;
  if(p.otype === 'near'){ line = div('nm-g13-nline'); root.appendChild(line); }
  function drawLine(){
    if(!line) return;
    var mn = p.line.min, mx = p.line.max, X = function(v){ return 20 + (v - mn) * 30; }, s = '<svg viewBox="0 0 ' + (40 + (mx - mn) * 30) + ' 78" class="nm-g13-nlsvg"><line x1="12" y1="52" x2="' + (28 + (mx - mn) * 30) + '" y2="52" class="nm-g13-nlax"/>';
    for(var v = mn; v <= mx; v++) s += '<line x1="' + X(v) + '" y1="47" x2="' + X(v) + '" y2="57" class="nm-g13-nlax"/><text x="' + X(v) + '" y="72" text-anchor="middle" class="nm-g13-nlt">' + v + '</text>';
    s += '<rect x="' + (X(p.base) - 11) + '" y="40" width="22" height="24" rx="5" class="nm-g13-nlbase"/><text x="' + X(p.base) + '" y="57" text-anchor="middle" class="nm-g13-nlbt">' + p.base + '</text>';
    placed.forEach(function(v, i){ var mid = (X(v) + X(p.base)) / 2, h = 10 + Math.min(26, Math.abs(X(v) - X(p.base)) * .28);
      s += '<path class="nm-g13-nlarc" d="M ' + X(p.base) + ' 38 Q ' + mid + ' ' + (38 - h) + ' ' + X(v) + ' 38"/><circle cx="' + X(v) + '" cy="38" r="5" class="nm-g13-nldot"/><text x="' + X(v) + '" y="22" text-anchor="middle" class="nm-g13-nlt">' + (i + 1) + '</text>'; });
    line.innerHTML = s + '</svg>';
  }
  drawLine();
  var slots = div('nm-g13-slots'); root.appendChild(slots);
  var slotEls = []; for(var i = 0; i < N; i++){ var s = div('nm-g13-slot', ''); slotEls.push(s); slots.appendChild(s); }
  var pool = div('nm-g13-pool'); root.appendChild(pool);
  p.tiles.forEach(function(v){
    var b = btn('nm-g13-card', String(v), function(){
      if(b.classList.contains('used') || k >= N) return;
      if(v === want[k]){
        b.classList.add('used'); slotEls[k].textContent = v; slotEls[k].classList.add('found'); placed.push(v); k++; drawLine();
        if(k === N) setTimeout(function(){ onAnswer(p.answer); }, 600);
      } else { KIT.shake(b); onAnswer(-1); }
    });
    pool.appendChild(b);
  });
};

/* ═══════════ g13Pinball — 막힌 칸을 피해 1 → L 길 만들기 ═══════════ */
EXT.g13Pinball = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-pin'); c.appendChild(root);
  var rows = p.rows, cols = p.cols, blocked = {}, path = [], numAt = {};
  p.blocks.forEach(function(q){ blocked[q.join()] = 1; });
  Object.keys(p.given).forEach(function(k){ numAt[p.given[k]] = k; });
  var board = div('nm-g13-pinboard'); board.style.setProperty('--cols', cols); root.appendChild(board);
  var cellEls = {};
  function key(r, c2){ return r + ',' + c2; }
  function paint(){
    var pos = {}; path.forEach(function(q, i){ pos[q.join()] = i + 1; });
    for(var r = 0; r < rows; r++) for(var cc = 0; cc < cols; cc++){
      var k = key(r, cc), el = cellEls[k], g = p.given[k], put = pos[k];
      el.className = 'nm-g13-pcell' + (blocked[k] ? ' blk' : '') + (put ? ' put' : '') + (g != null ? ' giv' : '') + (path.length && path[path.length - 1].join() === k ? ' last' : '');
      el.innerHTML = blocked[k] ? '<span class="nm-g13-pdot"></span>' : (put ? String(put) : (g != null ? String(g) : ''));
    }
  }
  for(var r = 0; r < rows; r++) for(var cc = 0; cc < cols; cc++) (function(r, cc){
    var k = key(r, cc), el = btn('nm-g13-pcell', '', function(){
      if(blocked[k]) { KIT.shake(el); return; }
      var nextN = path.length + 1, last = path[path.length - 1];
      if(last && last[0] === r && last[1] === cc){ path.pop(); paint(); return; }
      if(!last){ if(k !== numAt[1]){ KIT.shake(el); return; } path.push([r, cc]); paint(); return; }
      var adj = Math.abs(last[0] - r) + Math.abs(last[1] - cc) === 1, used = path.some(function(q){ return q[0] === r && q[1] === cc; });
      var g = p.given[k];
      if(!adj || used || (g != null && g !== nextN) || (numAt[nextN] && numAt[nextN] !== k)){ KIT.shake(el); return; }
      path.push([r, cc]); paint();
      if(path.length === p.L) setTimeout(function(){ onAnswer(p.answer); }, 600);
    });
    cellEls[k] = el; board.appendChild(el);
  })(r, cc);
  paint();
};

/* ═══════════ g13OrdPaint — 개수 줄과 순서 줄 칠하기(왼쪽/오른쪽에서) ═══════════ */
EXT.g13OrdPaint = function(p, c, onAnswer, KIT){
  var art = KIT.art, root = div('nm-g13 nm-g13-ordp'), lock = false; c.appendChild(root);
  var rowsSt = p.rows.map(function(r){ return { r: r, on: {} }; });
  rowsSt.forEach(function(st){
    var wrap = div('nm-g13-oprow'); root.appendChild(wrap);
    var rtl = st.r.from === 'right';
    wrap.appendChild(div('nm-g13-opcap', '<b>' + esc(tr(st.r.cap)) + '</b><i>' + (rtl ? W('오른쪽 시작 ◀', 'start on the right ◀', '从右边开始 ◀') : W('▶ 왼쪽 시작', '▶ start on the left', '▶ 从左边开始')) + '</i>'));
    var line = div('nm-g13-opline'); wrap.appendChild(line);
    for(var i = 0; i < p.total; i++) (function(i){
      var b = btn('nm-g13-opc', '', function(){
        if(st.on[i]){ delete st.on[i]; b.classList.remove('on'); b.innerHTML = ''; }
        else { st.on[i] = 1; b.classList.add('on'); b.innerHTML = art(p.emoji || '⭐'); }
      });
      line.appendChild(b);
    })(i);
  });
  submitBtn(root, function(){
    if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    var ok = rowsSt.every(function(st){
      var idx = Object.keys(st.on).map(Number).sort(function(a, b){ return a - b; }), n = st.r.n;
      if(st.r.from === 'right') idx = idx.map(function(i){ return p.total - 1 - i; }).sort(function(a, b){ return a - b; });
      if(st.r.kind === 'ordinal') return idx.length === 1 && idx[0] === n - 1;
      return idx.length === n && idx.every(function(v, j){ return v === j; });
    });
    if(ok) onAnswer(p.answer); else { KIT.shake(root); onAnswer(-1); }
  });
};

/* ═══════════ g13OrdRow — 양쪽 순서수(칸 늘리기)·뒤집기·숫자 카드 줄·낱말 고르기 ═══════════ */
var SIDE = {
  row: [['왼쪽', 'left', '左边'], ['오른쪽', 'right', '右边']],
  col: [['위', 'top', '上面'], ['아래', 'bottom', '下面']],
  queue: [['앞', 'front', '前面'], ['뒤', 'back', '后面']]
};
function sideLbl(axis, k){ var s = SIDE[axis][k]; return W(s[0], s[1], s[2]); }
function ordWord(kind, n, l){
  var g = G(), ko = kind === 'ordinal' ? g.ORD.ko[n] : g.NATIVE.ko[n];
  if(l === 'en') return kind === 'ordinal' ? g.ORD.en[n] : g.NATIVE.en[n];
  if(l === 'zh') return kind === 'ordinal' ? '第' + g.NATIVE.zh[n] + '个' : g.NATIVE.zh[n] + '个';
  return ko;
}
EXT.g13OrdRow = function(p, c, onAnswer, KIT){
  var art = KIT.art, root = div('nm-g13 nm-g13-ordrow'); c.appendChild(root);
  var mode = p.ordMode;
  if(mode === 'build'){
    var n = p.a, axis = p.axis, vertical = axis === 'col';
    var ends = div('nm-g13-orends'); ends.innerHTML = '<span>' + esc(sideLbl(axis, 0)) + (vertical ? ' ▲' : ' ◀') + '</span><span>' + (vertical ? '▼ ' : '') + esc(sideLbl(axis, 1)) + (vertical ? '' : ' ▶') + '</span>';
    root.appendChild(ends);
    var strip = div('nm-g13-orstrip' + (vertical ? ' v' : '')); root.appendChild(strip);
    var ctl = div('nm-g13-orctl'); root.appendChild(ctl);
    var chk = null, choicesHost = div('nm-g13-orch'); root.appendChild(choicesHost);
    function paint(){
      strip.innerHTML = '';
      for(var i = 0; i < n; i++) strip.appendChild(div('nm-g13-orcell' + (i === p.a - 1 ? ' on' : ''), i === p.a - 1 ? art('⭐') : ''));
    }
    paint();
    ctl.appendChild(btn('nm-g13-pm', '−', function(){ if(n > p.a){ n--; paint(); } }));
    ctl.appendChild(btn('nm-g13-pm', '+', function(){ if(n < 9){ n++; paint(); } }));
    ctl.appendChild(div('nm-g13-orhint', esc(W(sideLbl(axis, 1) + '에서 ' + p.b + '째가 되게 칸을 더해요', 'Add boxes so it is number ' + p.b + ' from the ' + sideLbl(axis, 1), '加格子，让它从' + sideLbl(axis, 1) + '数是第' + p.b + '个'))));
    chk = submitBtn(root, function(){
      if(n - p.a !== p.b - 1){ KIT.shake(strip); onAnswer(-1); return; }
      chk.remove(); ctl.style.display = 'none';
      choicesHost.innerHTML = '<div class="nm-g13-howmany">' + esc(W('모두 몇 칸일까요?', 'How many boxes in all?', '一共有几格？')) + '</div>';
      choiceRow(choicesHost, p.choices, p.answer, KIT, onAnswer);
    });
    return;
  }
  if(mode === 'flip'){
    var st = div('nm-g13-orstrip'); root.appendChild(st);
    for(var i = 0; i < p.total; i++) st.appendChild(div('nm-g13-orcell' + (i === p.a - 1 ? ' on' : ''), i === p.a - 1 ? art('⭐') : ''));
    root.insertBefore(div('nm-g13-orends', '<span>◀ ' + esc(W('왼쪽', 'left', '左边')) + '</span><span>' + esc(W('오른쪽', 'right', '右边')) + ' ▶</span>'), st);
    choiceRow(root, p.choices, p.answer, KIT, onAnswer);
    return;
  }
  if(mode === 'find'){
    var cards = div('nm-g13-orcards'); root.appendChild(cards);
    p.cards.forEach(function(v){ cards.appendChild(div('nm-g13-orcard' + (v === p.ref.v ? ' ref' : ''), String(v))); });
    root.insertBefore(div('nm-g13-orends', '<span>◀ ' + esc(W('왼쪽', 'left', '左边')) + '</span><span>' + esc(W('오른쪽', 'right', '右边')) + ' ▶</span>'), cards);
    choiceRow(root, p.choices, p.answer, KIT, onAnswer);
    return;
  }
  /* word — 칠해진 그림 → 알맞은 낱말(코드 = n*10 + (서수?1:0)) */
  var from = p.from, ln = div('nm-g13-orstrip'); root.appendChild(ln);
  root.insertBefore(div('nm-g13-orends', '<span>' + (from === 'left' ? '▶ ' + esc(W('왼쪽 시작', 'start left', '从左边开始')) : '') + '</span><span>' + (from === 'right' ? esc(W('오른쪽 시작', 'start right', '从右边开始')) + ' ◀' : '') + '</span>'), ln);
  for(var j = 0; j < p.total; j++){
    var pos = from === 'left' ? j + 1 : p.total - j;               /* 시작쪽에서 몇째 칸인지 */
    var on = p.kind === 'ordinal' ? pos === p.n : pos <= p.n;
    ln.appendChild(div('nm-g13-orcell' + (on ? ' on' : ''), on ? art('⭐') : ''));
  }
  choiceRow(root, p.choices, p.answer, KIT, onAnswer, function(code){ return '<span class="nm-g13-ordw">' + esc(ordWord(code % 10 === 1 ? 'ordinal' : 'cardinal', Math.floor(code / 10), lang())) + '</span>'; }, 'nm-g13-cw');
};

/* ═══════════ g13Cmp — 두 수 크기 비교(> <) ═══════════ */
EXT.g13Cmp = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-cmp'), lock = false; c.appendChild(root);
  var row = div('nm-g13-cmprow big'); root.appendChild(row);
  row.appendChild(div('nm-g13-bignum', String(p.left)));
  var slot = div('nm-g13-sign slot', '○'); row.appendChild(slot);
  row.appendChild(div('nm-g13-bignum', String(p.right)));
  var bs = div('nm-g13-signbtns'); root.appendChild(bs);
  var tail = div('nm-g13-cmptail'); root.appendChild(tail);
  [[1, '>'], [2, '<']].forEach(function(x){
    var b = btn('nm-g13-signbtn', x[1], function(){
      if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
      if(x[0] !== p.answer){ KIT.shake(b); onAnswer(-1); return; }
      slot.textContent = x[1]; slot.classList.add('found');
      if(p.ask !== 'word'){ onAnswer(p.answer); return; }
      bs.style.display = 'none';
      var j = lang() === 'ko' ? josaNum(p.left, '은', '는') : '';
      var sent = lang() === 'ko' ? p.left + j + ' ' + p.right + '보다' : lang() === 'en' ? p.left + ' is ___ than ' + p.right : p.left + ' ___ ' + p.right;
      tail.innerHTML = '<div class="nm-g13-sent">' + esc(sent) + '</div>';
      var words = [[1, W('큽니다', 'bigger', '大于')], [2, W('작습니다', 'smaller', '小于')]], wl = false;
      var wr = div('nm-tc-choices'); tail.appendChild(wr);
      words.forEach(function(w){ var wb = btn('nm-g13-wordbtn', esc(w[1]), function(){
        if(wl) return; wl = true; setTimeout(function(){ wl = false; }, 700);
        if(w[0] === p.answer) onAnswer(p.answer); else { KIT.shake(wb); onAnswer(-1); }
      }); wr.appendChild(wb); });
    });
    bs.appendChild(b);
  });
};

/* ═══════════ g13ArrowTri — 삼각형 화살표(큰 수 → 작은 수): 그리기 / 수 놓기 ═══════════ */
var TRI = [[50, 14], [14, 76], [86, 76]];
EXT.g13ArrowTri = function(p, c, onAnswer, KIT){
  var root = div('nm-g13 nm-g13-tri'), lock = false; c.appendChild(root);
  var host = div('nm-g13-tribox'); root.appendChild(host);
  var EDGES = [[0, 1], [0, 2], [1, 2]];
  var est = [0, 0, 0];                                         /* draw: 0 없음 · 1 작은 번호→큰 번호 · 2 반대 */
  var val = [null, null, null], selBank = -1, locked = {};
  if(p.amode === 'fill' && p.pre) Object.keys(p.pre).forEach(function(k){ val[+k] = p.pre[k]; locked[+k] = 1; });
  var bankVals = p.amode === 'fill' ? p.bank.filter(function(v){ return !p.pre || Object.keys(p.pre).every(function(k){ return p.pre[k] !== v; }); }) : [];
  var used = {};
  function arrowEdge(a, b){
    var A = TRI[a], B = TRI[b], dx = B[0] - A[0], dy = B[1] - A[1], d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d, r = 12.5;
    var x1 = A[0] + ux * r, y1 = A[1] + uy * r, x2 = B[0] - ux * r, y2 = B[1] - uy * r, hx = x2 - ux * 6, hy = y2 - uy * 6, nx = -uy * 3.6, ny = ux * 3.6;
    return '<line class="nm-g13-tre" x1="' + x1 + '" y1="' + y1 + '" x2="' + hx + '" y2="' + hy + '"/><polygon class="nm-g13-trh" points="' + x2 + ',' + y2 + ' ' + (hx + nx) + ',' + (hy + ny) + ' ' + (hx - nx) + ',' + (hy - ny) + '"/>';
  }
  function paint(){
    var s = '<svg viewBox="0 0 100 92" class="nm-g13-trisvg">';
    EDGES.forEach(function(e, i){
      var A = TRI[e[0]], B = TRI[e[1]];
      if(p.amode === 'draw'){ s += '<line class="nm-g13-trg" x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '"/>'; if(est[i] === 1) s += arrowEdge(e[0], e[1]); else if(est[i] === 2) s += arrowEdge(e[1], e[0]); s += '<line class="nm-g13-trhit" data-e="' + i + '" x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '"/>'; }
    });
    if(p.amode === 'fill') p.arrows.forEach(function(a){ s += '<line class="nm-g13-trg" x1="' + TRI[a[0]][0] + '" y1="' + TRI[a[0]][1] + '" x2="' + TRI[a[1]][0] + '" y2="' + TRI[a[1]][1] + '"/>' + arrowEdge(a[0], a[1]); });
    TRI.forEach(function(q, i){
      var v = p.amode === 'draw' ? p.vals[i] : val[i];
      s += '<g class="nm-g13-trv' + (v == null ? ' blank' : '') + '" data-v="' + i + '"><circle cx="' + q[0] + '" cy="' + q[1] + '" r="11"/><text x="' + q[0] + '" y="' + (q[1] + 4.5) + '" text-anchor="middle">' + (v == null ? '' : v) + '</text></g>';
    });
    host.innerHTML = s + '</svg>';
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-trhit'), function(l){ tap(l, function(){ var i = +l.getAttribute('data-e'); est[i] = (est[i] + 1) % 3; paint(); }); });
    Array.prototype.forEach.call(host.querySelectorAll('.nm-g13-trv'), function(g){ tap(g, function(){
      if(p.amode !== 'fill') return;
      var i = +g.getAttribute('data-v');
      if(locked[i]) return;
      if(val[i] != null){ var v = val[i]; val[i] = null; Object.keys(used).forEach(function(bi){ if(used[bi] === i){ delete used[bi]; } }); paint(); paintBank(); return; }
      if(selBank < 0) return;
      val[i] = bankVals[selBank]; used[selBank] = i; selBank = -1; paint(); paintBank();
    }); });
  }
  var bankEl = null;
  function paintBank(){
    if(!bankEl) return; bankEl.innerHTML = '';
    bankVals.forEach(function(v, bi){
      var b = btn('nm-g13-tile' + (used[bi] != null ? ' used' : '') + (selBank === bi ? ' sel' : ''), String(v), function(){ if(used[bi] != null) return; selBank = selBank === bi ? -1 : bi; paintBank(); });
      bankEl.appendChild(b);
    });
  }
  if(p.amode === 'fill'){ bankEl = div('nm-g13-bank'); root.appendChild(bankEl); paintBank(); }
  paint();
  submitBtn(root, function(){
    if(lock) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    var ok;
    if(p.amode === 'draw') ok = EDGES.every(function(e, i){ var big = p.vals[e[0]] > p.vals[e[1]] ? e[0] : e[1]; return (est[i] === 1 && big === e[0]) || (est[i] === 2 && big === e[1]); });
    else ok = val.every(function(v){ return v != null; }) && p.arrows.every(function(a){ return val[a[0]] > val[a[1]]; });
    if(ok) onAnswer(p.answer); else { KIT.shake(host); onAnswer(-1); }
  });
};

/* ═══════════ g13Make — 하나 더 많게 놓기(미리 놓인 개수는 지울 수 없다) ═══════════ */
EXT.g13Make = function(p, c, onAnswer, KIT){
  var art = KIT.art, em = p.emoji, stamps = 0, lock = false;
  var root = div('nm-tm-wrap nm-g13 nm-g13-make'); c.appendChild(root);
  var board = div('nm-tm-board nm-g13-makeboard'); root.appendChild(board);
  for(var i = 0; i < p.fixed; i++){ var s = document.createElement('span'); s.className = 'nm-tm-stamp fixed'; s.innerHTML = art(em); board.appendChild(s); }
  var cnt = counterEl(root, p.fixed);
  tap(board, function(e){
    var hit = e.target.closest ? e.target.closest('.nm-tm-stamp.mine') : null;
    if(hit && board.contains(hit)){ hit.remove(); stamps--; cnt.textContent = p.fixed + stamps; return; }
    if(p.fixed + stamps >= 12) return;
    var sp = document.createElement('span'); sp.className = 'nm-tm-stamp mine'; sp.innerHTML = art(em); board.appendChild(sp); stamps++; cnt.textContent = p.fixed + stamps;
  });
  submitBtn(root, function(){
    if(lock || stamps === 0) return; lock = true; setTimeout(function(){ lock = false; }, 700);
    if(p.fixed + stamps !== p.target){ KIT.shake(board); onAnswer(-1); } else onAnswer(p.answer);
  });
};
})();
