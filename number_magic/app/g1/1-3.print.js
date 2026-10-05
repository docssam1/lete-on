/* G1-1~3호(N-01~N-03) 인쇄 — window.NM_NL_PRINT['위젯이름'] = { visual(p,K), label(p,K), ask(p,K) }.
   K = exam.js nlPrintKit(): nlCard·nlStage·nlAnsBox·nlObjHtml·nlGlyphRows·nlTenframeHtml·nlFrameObjHtml·nlBoardHtml·nlChunk·esc·lk·pickL·EA·NL_CIRC.
   2026-10-05 원장 "너무 흑백이야" — 화면 위젯(1-3.widgets.js·1-3.css)과 같은 팔레트로 인쇄한다.
   글자는 진한 남색(#0E2C57·#16417c), 칠한 칸은 화면의 노랑(#f6c94c), 바탕은 크림(#fffaf0), 칸 선은 g13Rep 과 같은 #2f4a6e.
   흑백 프린터에서도 갈리도록 채움은 밝기 차가 나는 색만 쓴다. exam.js 의 `.nm-nl text{fill:#000}` 을 이기려고 SVG 글자색은 style 로,
   `.nm-nl svg:not(.nm-obj-svg) :is(line,path)` 를 피하려고 자체 SVG 에는 nm-obj-svg 를 붙인다. 새 클래스는 nm-nl-g13- 접두. 그림 도구는 app/g1/1-3.art.js(NM_G13). */
(function(){ 'use strict';
window.NM_NL_PRINT = window.NM_NL_PRINT || {};
var P = window.NM_NL_PRINT;

/* ── 스타일 ── */
(function(){
  var css = ''
  + '[class^="nm-nl-g13-"],[class*=" nm-nl-g13-"]{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
  + '.nm-nl-g13-row{display:flex;justify-content:center;align-items:flex-end;gap:1.6mm;flex-wrap:wrap}'
  + '.nm-nl-g13-it{display:flex;flex-direction:column;align-items:center;font-size:24px;line-height:1}'
  + '.nm-nl-g13-it svg{display:block;width:1em;height:1em}'
  + '.nm-nl-g13-it i{font-style:normal;font-size:10px;font-weight:700;margin-top:.4mm;color:#4a5468}'
  + '.nm-nl-g13-ring{display:flex;gap:1.4mm;padding:1mm 1.6mm;border:1.4px dashed #C9A063;border-radius:3mm;background:rgba(255,226,140,.18)}'
  + '.nm-nl-g13-tbl{display:grid;grid-template-columns:repeat(7,9mm);border:1.3px solid #2f4a6e;background:#fffaf0}'
  + '.nm-nl-g13-tbl>div{display:flex;align-items:center;justify-content:center;height:8mm;border:.6px solid #2f4a6e;box-sizing:border-box;font-size:20px;font-weight:700}'
  + '.nm-nl-g13-tbl>div svg{width:1em;height:1em;display:block}'
  + '.nm-nl-g13-tbl>.h{background:#f6e7bd;color:#7a5a12;font-size:10px;height:5.5mm}'
  + '.nm-nl-g13-opts{display:flex;gap:5mm;justify-content:center;font-size:15px;font-weight:800;color:#0E2C57}'
  + '.nm-nl-g13-opt{display:inline-flex;align-items:center;gap:1mm}'
  + '.nm-nl-g13-match{display:flex;align-items:stretch}'
  + '.nm-nl-g13-mcol{display:flex;flex-direction:column;gap:1.1mm}'
  + '.nm-nl-g13-mgap{width:16mm}'
  + '.nm-nl-g13-mc{position:relative;display:flex;align-items:center;justify-content:center;min-width:15mm;height:8.6mm;padding:0 1.6mm;border:1.3px solid #2f4a6e;border-radius:2mm;box-sizing:border-box;font-size:20px;font-weight:800;background:#fffaf0;-webkit-print-color-adjust:exact;print-color-adjust:exact}'
  + '.nm-nl-g13-mc svg{height:6.4mm;width:auto;display:block}'
  + '.nm-nl-g13-mc .tag{position:absolute;right:-5.5mm;top:50%;transform:translateY(-50%);font-size:12px;font-weight:700;color:#4a5468}'
  + '.nm-nl-g13-mc .hands{display:inline-flex;align-items:flex-end}.nm-nl-g13-mc .hands svg{height:7.6mm}.nm-nl-g13-mc > svg.nm-g13-hand{height:8mm}'
  + '.nm-nl-g13-card{display:flex;align-items:center;justify-content:center;min-width:12mm;height:10mm;padding:0 1.5mm;border:1.3px solid #2f4a6e;border-radius:2mm;box-sizing:border-box;font-size:20px;font-weight:800;background:#fffdf6;color:#0E2C57}'
  + '.nm-nl-g13-card svg{height:7.5mm;width:auto;display:block}'
  + '.nm-nl-g13-mc .w-num,.nm-nl-g13-card .w-num{color:#1f5fbf}.nm-nl-g13-mc .w-native,.nm-nl-g13-card .w-native{color:#2f8a4c}.nm-nl-g13-mc .w-sino,.nm-nl-g13-card .w-sino{color:#c4581c}'
  + '.nm-nl-g13-card{-webkit-print-color-adjust:exact;print-color-adjust:exact}'
  + '.nm-nl-g13-card.blank{border-style:dashed;border-width:1.6px;border-color:#C9A063;background:#fffaf0}'
  + '.nm-nl-g13-card.hi{background:#f6c94c;border-color:#a67c00}'
  + '.nm-nl-g13-card.sq{width:9mm;min-width:9mm;height:9mm;border-radius:1mm}'
  + '.nm-nl-g13-grid{display:grid;border:1.4px solid #2f4a6e;background:#fffaf0}'
  + '.nm-nl-g13-grid>i{border:.6px solid #2f4a6e;box-sizing:border-box;background:#fffaf0}'
  + '.nm-nl-g13-grid>i.on{background:#f6c94c}'
  + '.nm-nl-g13-svg{display:block;height:28mm;width:auto;max-width:100%}'
  + '.nm-nl-g13-iso{display:block;height:30mm;width:auto;max-width:100%}'
  + '.nm-nl-g13-cmp .nm-nl-g13-iso{height:19mm}'
  + '.nm-nl-g13-path{display:block;width:62mm;height:auto;max-height:36mm}'
  + '.nm-nl-g13-legend{font-size:10px;font-weight:700;text-align:center;color:#4a5468}'
  + '.nm-nl-g13-big{font-size:34px;font-weight:900;letter-spacing:.06em;color:#0E2C57}'
  + '.nm-nl-g13-big.sign{color:#b8860b}'
  + '.nm-nl-g13-bx{display:inline-block;width:11mm;height:9mm;border:1.4px dashed #C9A063;border-radius:1.5mm;vertical-align:middle;background:#fffaf0}'
  + '.nm-nl-g13-cap{font-size:12px;font-weight:800;text-align:left;color:#0E2C57}'
  + '.nm-nl-g13-cap span{color:#4a5468}'
  + '.nm-nl-g13-cells{display:flex;gap:.8mm}'
  + '.nm-nl-g13-oc{width:5.2mm;height:5.2mm;border:1.3px solid #C9A063;border-radius:50%;background:#fff;box-sizing:border-box}'
  + '.nm-nl-g13-sq{width:6mm;height:6mm;border:1.3px solid #C9A063;border-radius:1mm;background:#fff;box-sizing:border-box}'
  + '.nm-nl-g13-sq.on{background:#f6c94c;border-color:#a67c00}'
  + '.nm-nl-g13-ends{display:flex;justify-content:space-between;width:100%;font-size:9.5px;font-weight:700;color:#4a5468}'
  + '.nm-nl-g13-slotrow{display:flex;gap:1.6mm}'
  + '.nm-nl-g13-slot{width:8mm;height:8mm;border:1.4px dashed #C9A063;border-radius:1.5mm;box-sizing:border-box;background:#fffaf0}'
  + '.nm-nl-g13-pin{display:grid;border:1.4px solid #2f4a6e;background:#fff}'
  + '.nm-nl-g13-pin>div{display:flex;align-items:center;justify-content:center;border:.8px solid #2f4a6e;box-sizing:border-box;font-size:15px;font-weight:800;color:#0E2C57}'
  + '.nm-nl-g13-pin>div.giv{background:#f6efd9}'
  + '.nm-nl-g13-pin>div.blk{background:#e6e1d5}'
  + '.nm-nl-g13-pin>div.blk::after{content:"";width:45%;height:45%;border-radius:50%;background:#3a3f4d}'
  + '.nm-nl-g13-wbox{height:11mm;width:58mm;border:1.4px dashed #C9A063;border-radius:2mm;background:#fffaf0}'
  + '.nm-nl .nm-nl-g13-path text{font-size:9px;font-weight:800}'
  + '.nm-nl .nm-nl-g13-svg text{font-size:.13px}'
  + '.nm-nl .nm-nl-g13-tri text{font-size:13px}'
  + '.nm-nl .nm-nl-g13-nl text{font-size:5.6px}'
  + '.nm-nl-g13-sent{font-size:13px;font-weight:700;color:#0E2C57}'
  + '.nm-nl-g13-bubble{display:inline-block;padding:1mm 3mm;border:1.3px solid #2f4a6e;border-radius:3mm;font-size:12px;font-weight:700;background:#fffaf0;color:#0E2C57}';
  var st = document.createElement('style'); st.setAttribute('data-g13-print', '1'); st.textContent = css; document.head.appendChild(st);
})();

function G(){ return window.NM_G13 || {}; }
function lg(K){ return K.lk('ko', 'en', 'zh'); }
function circ(n){ return ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'][n] || String(n); }
function scatter(K, items){
  var cells = items.map(function(it){ return '<span class="nm-nl-sc" style="left:' + it.x + '%;top:' + it.y + '%;transform:translate(-50%,-50%) rotate(' + (it.r | 0) + 'deg) scale(' + it.s + ')">' + K.nlObjHtml(it.e, it.f) + '</span>'; }).join('');
  return '<div class="nm-nl-scatter">' + cells + '</div>';
}
function unitOf(p, K){ return p.unit ? K.pickL(p.unit) : K.EA; }
function askFn(p, K){ return p.printAsk ? K.pickL(p.printAsk) : null; }
function def(name, o){ o.ask = o.ask || askFn; P[name] = o; }
function stage(K, inner, ans){ return K.nlCard(K.nlStage(inner), ans || ''); }
function optsRow(K, vals, fmt){ return '<div class="nm-nl-g13-opts">' + vals.map(function(v, i){ return '<span class="nm-nl-g13-opt">' + circ(i + 1) + ' ' + (fmt ? fmt(v) : K.esc(String(v))) + '</span>'; }).join('') + '</div>'; }

/* ── 세기 ── */
def('g13Count', {
  visual: function(p, K){
    var ask = p.ask, ans;
    if(ask === 'nearest') ans = optsRow(K, p.choices);
    else if(ask === 'kinds') ans = K.nlAnsBox(K.pickL(p.unit) || '');
    else ans = K.nlAnsBox(unitOf(p, K));
    var scene;
    if(p.layout === 'scatter') return K.nlCard(scatter(K, p.items), ans);
    if(p.layout === 'grid'){
      var heads = p.headers ? (p.headers[lg(K)] || p.headers.ko) : [];
      scene = '<div class="nm-nl-g13-tbl">' + heads.map(function(h){ return '<div class="h">' + K.esc(h) + '</div>'; }).join('')
        + p.items.map(function(it){ return '<div>' + K.nlObjHtml(it.e) + '</div>'; }).join('') + '</div>';
      return stage(K, scene, ans);
    }
    var cellsHtml = function(list){ return list.map(function(it){ return '<span class="nm-nl-g13-it">' + K.nlObjHtml(it.e) + (it.label != null ? '<i>' + it.label + '</i>' : '') + '</span>'; }).join(''); };
    if(p.layout === 'row'){
      var k = p.ring || 0;
      scene = '<div class="nm-nl-g13-row"><span class="nm-nl-g13-ring">' + cellsHtml(p.items.slice(0, k)) + '</span>' + cellsHtml(p.items.slice(k)) + '</div>';
      return stage(K, scene, ans);
    }
    var rows = K.nlChunk(p.items, 5).map(function(r){ return '<div class="nm-nl-g13-row">' + cellsHtml(r) + '</div>'; }).join('');
    return stage(K, rows, ans);
  },
  label: function(p, K){ return null; }
});

/* ── 같은 수끼리 잇기 ── */
function cardHtml(type, n, K){
  var g = G(), l = lg(K);
  /* 2026-10-05 원장 "너무 흑백이야" — 화면과 같은 색으로 인쇄한다(점은 빨강, 10칸 틀은 노랑, 손은 살색, 낱말은 색 글자). */
  if(type === 'dice') return g.diceSvg(n);
  if(type === 'frame') return g.frameSvg(n, { w: 52, ink: '#0e2c57', dot: '#e5a82a' });
  if(type === 'fingers') return n <= 5 ? g.handSvg(n) : '<span class="hands">' + g.handSvg(5) + g.handSvg(n - 5) + '</span>';
  if(type === 'native') return '<b class="w-native">' + K.esc(g.numWord(n, type, l)) + '</b>';
  if(type === 'sino') return '<b class="w-sino">' + K.esc(g.numWord(n, type, l)) + '</b>';
  return '<b class="w-num">' + K.esc(String(n)) + '</b>';
}
def('g13Rep', {
  visual: function(p, K){
    var L = p.left.map(function(n){ return '<div class="nm-nl-g13-mc">' + cardHtml(p.leftType || 'num', n, K) + '</div>'; }).join('');
    var Rr = p.right.map(function(n, i){ return '<div class="nm-nl-g13-mc">' + cardHtml(p.rightType, n, K) + '<span class="tag">' + circ(i + 1) + '</span></div>'; }).join('');
    return stage(K, '<div class="nm-nl-g13-match"><div class="nm-nl-g13-mcol">' + L + '</div><div class="nm-nl-g13-mgap"></div><div class="nm-nl-g13-mcol">' + Rr + '</div></div>');
  },
  label: function(p, K){ return p.left.map(function(n){ return n + '→' + circ(p.right.indexOf(n) + 1); }).join(' '); }
});

/* ── 표 빈칸 ── */
def('g13RepFill', {
  visual: function(p, K){
    var l = lg(K), blank = (p.blank === 'sino' && l !== 'ko') ? 'native' : p.blank;
    var kinds = ['num', 'sino', 'native', 'frame'].filter(function(k){ return !(k === 'sino' && l !== 'ko'); });
    var row = kinds.map(function(k){ return k === blank ? '<span class="nm-nl-g13-card blank">&nbsp;&nbsp;&nbsp;</span>' : '<span class="nm-nl-g13-card">' + cardHtml(k, p.n, K) + '</span>'; }).join('');
    var opts = '<div class="nm-nl-g13-opts">' + p.choices.map(function(v, i){ return '<span class="nm-nl-g13-opt">' + circ(i + 1) + '<span class="nm-nl-g13-card">' + cardHtml(blank, v, K) + '</span></span>'; }).join('') + '</div>';
    return K.nlCard(K.nlStage('<div class="nm-nl-g13-row">' + row + '</div>'), opts);
  },
  label: function(p, K){
    var l = lg(K), blank = (p.blank === 'sino' && l !== 'ko') ? 'native' : p.blank, i = p.choices.indexOf(p.n);
    var txt = blank === 'frame' ? K.lk(p.n + '칸', p.n + ' boxes', p.n + '格') : (G().numWord ? G().numWord(p.n, blank === 'num' ? 'digit' : blank, l) : String(p.n));
    return circ(i + 1) + ' (' + txt + ')';
  }
});

/* ── 격자 ── */
function gridHtml(rows, cols, on, size){
  var cells = ''; for(var i = 0; i < rows * cols; i++) cells += '<i' + (on && on[i] ? ' class="on"' : '') + '></i>';
  return '<div class="nm-nl-g13-grid" style="grid-template-columns:repeat(' + cols + ',' + size + 'mm);grid-auto-rows:' + size + 'mm">' + cells + '</div>';
}
def('g13Grid', {
  visual: function(p, K){
    var size = p.cols >= 10 ? 6.2 : p.cols >= 5 ? 6 : 7.6;
    if(p.gmode === 'read'){ var on = {}; p.cells.forEach(function(i){ on[i] = 1; }); return stage(K, gridHtml(p.rows, p.cols, on, size), K.nlAnsBox(K.EA)); }
    return stage(K, gridHtml(p.rows, p.cols, null, size));
  },
  label: function(p, K){ return p.gmode === 'paint' ? K.lk(p.target + '칸', p.target + ' boxes', p.target + '格') : null; }
});

/* ── 동그라미 나누기 ── */
function cutSvg(ch, K, dots){
  var N = []; for(var i = 0; i < 12; i++){ var t = (i * 30 - 90) * Math.PI / 180; N.push([Math.cos(t), Math.sin(t)]); }
  /* 화면(.nm-g13-circ·.nm-g13-chord·.nm-g13-ndot)과 같은 색: 원 테두리 남색, 자른 선 초록, 점 남색 */
  var s = '<svg class="nm-nl-g13-svg nm-obj-svg" viewBox="-1.3 -1.3 2.6 2.6"><circle cx="0" cy="0" r="1" fill="#fff" stroke="#0E2C57" stroke-width=".05"/>';
  (ch || []).forEach(function(c){ s += '<line x1="' + N[c[0]][0] + '" y1="' + N[c[0]][1] + '" x2="' + N[c[1]][0] + '" y2="' + N[c[1]][1] + '" stroke="#2E9E6B" stroke-width=".05" stroke-linecap="round"/>'; });
  if(dots) N.forEach(function(q, i){ s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r=".055" fill="#0E2C57"/><text x="' + (q[0] * 1.2) + '" y="' + (q[1] * 1.2 + .05) + '" text-anchor="middle" font-size=".13" font-weight="700" style="fill:#4a5468" stroke="none">' + (i + 1) + '</text>'; });
  return s + '</svg>';
}
def('g13CircleCut', {
  visual: function(p, K){
    if(p.cmode === 'read') return stage(K, cutSvg(p.chords, K, false), K.nlAnsBox(K.lk('조각', 'pieces', '块')));
    return stage(K, cutSvg([], K, true), '<div class="nm-nl-g13-sent">' + K.esc(K.lk('목표', 'Goal', '目标')) + ': ' + p.target + K.esc(K.lk('조각', ' pieces', '块')) + '</div>');
  },
  label: function(p, K){
    if(p.cmode === 'read') return null;
    return p.target + K.lk('조각', ' pieces', '块') + ' (' + K.lk('예', 'e.g.', '例') + ' ' + p.sample.map(function(c){ return (c[0] + 1) + '-' + (c[1] + 1); }).join(', ') + ')';
  }
});

/* ── 쌓기나무 ── */
def('g13Blocks', {
  visual: function(p, K){
    var g = G();
    if(p.bmode === 'cmp'){
      var mid = '<span class="nm-nl-g13-bx"></span> <span class="nm-nl-g13-big sign" style="font-size:26px">○</span> <span class="nm-nl-g13-bx"></span>';
      return K.nlCard(K.nlStage('<div class="nm-nl-g13-row nm-nl-g13-cmp" style="align-items:center;gap:3mm">' + g.isoSvg(p.heightsA, { w: 8, print: true }) + '<span>' + mid + '</span>' + g.isoSvg(p.heightsB, { w: 8, print: true }) + '</div>'));
    }
    return stage(K, g.isoSvg(p.heights, { w: 13, print: true }), K.nlAnsBox(K.EA));
  },
  label: function(p, K){ return p.bmode === 'cmp' ? p.sumA + (p.answer === 1 ? ' > ' : ' < ') + p.sumB : null; }
});

/* ── 점판 길이 ── */
function dotLenSvg(p){
  var S = 14, w = 8 + (p.cols - 1) * S, h = 8 + (p.rows - 1) * S, pt = function(q){ return [4 + q[0] * S, 4 + q[1] * S]; };
  var s = '<svg class="nm-nl-g13-svg nm-obj-svg" style="height:26mm" viewBox="0 0 ' + w + ' ' + h + '">';
  if(p.lmode === 'read') s += '<polyline fill="none" stroke="#2E9E6B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" points="' + p.path.map(function(q){ return pt(q).join(','); }).join(' ') + '"/>';
  for(var r = 0; r < p.rows; r++) for(var c = 0; c < p.cols; c++){ var q = pt([c, r]); s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="1.5" fill="#0E2C57"/>'; }
  return s + '</svg>';
}
def('g13DotLength', {
  visual: function(p, K){
    if(p.lmode === 'read') return stage(K, dotLenSvg(p), K.nlAnsBox(K.lk('칸', '', '格')));
    return stage(K, dotLenSvg(p), '<div class="nm-nl-g13-sent">' + K.esc(K.lk('길이', 'Length', '长度')) + ': ' + p.target + '</div>');
  },
  label: function(p, K){ return p.lmode === 'draw' ? K.lk('길이', 'length', '长度') + ' ' + p.target : null; }
});

/* ── 칸 수 다른 것 ── */
def('g13Odd', {
  visual: function(p, K){
    var cards = p.shapes.map(function(cells, i){
      var s = '<svg viewBox="0 0 54 54" style="width:15mm;height:15mm;display:block">' + cells.map(function(q){ return '<rect x="' + (3 + q[1] * 16) + '" y="' + (3 + q[0] * 16) + '" width="15" height="15" rx="2" fill="#f6c94c" stroke="#a67c00" stroke-width="1.4"/>'; }).join('') + '</svg>';
      return '<span class="nm-nl-g13-opt" style="flex-direction:column"><span>' + s + '</span><span>' + circ(i + 1) + '</span></span>';
    }).join('');
    return K.nlCard(K.nlStage('<div class="nm-nl-g13-opts" style="gap:4mm;align-items:flex-end">' + cards + '</div>'));
  },
  label: function(p){ return circ(p.answer); }
});

/* ── 거꾸로 ── */
def('g13Turn', {
  visual: function(p, K){
    return stage(K, '<div class="nm-nl-g13-row" style="align-items:center;gap:4mm"><span class="nm-nl-g13-card sq" style="width:16mm;height:20mm;font-size:34px">' + p.digit + '</span><span style="font-size:20px">↻ 180°</span></div>', K.nlAnsBox(''));
  },
  label: function(p){ return String(p.answer); }
});

/* ── 점 잇기 ── */
def('g13Dots', {
  visual: function(p, K){
    var n = p.pts.length, seq = p.pts.map(function(_, i){ return i; });
    /* 화면(.nm-dd-*)과 같은 색: 미리 그린 선 초록, 점·수 남색 — exam.js .nm-nl-dots 의 #1F2A3A 를 이기려고 style 로 준다 */
    var s = '<svg class="nm-nl-dots nm-nl-g13-dots nm-obj-svg" viewBox="-6 -8 112 112" style="width:25mm;height:25mm;display:block">';
    for(var k = 0; k < (p.pre || 0) && k < n - 1; k++) s += '<line x1="' + p.pts[seq[k]][0] + '" y1="' + p.pts[seq[k]][1] + '" x2="' + p.pts[seq[k + 1]][0] + '" y2="' + p.pts[seq[k + 1]][1] + '" stroke="#2E9E6B" stroke-width="1.8" stroke-linecap="round"/>';
    p.pts.forEach(function(q, i){ s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="2.4" style="fill:#0E2C57"/><text x="' + q[0] + '" y="' + (q[1] - 4.5) + '" text-anchor="middle" font-size="7.5" font-weight="700" style="fill:#0E2C57" stroke="none">' + p.labels[i] + '</text>'; });
    return stage(K, s + '</svg>', K.nlAnsBox(K.EA));
  },
  label: function(){ return null; }
});

/* ── 수열 빈칸 ── */
def('g13Seq', {
  visual: function(p, K){
    var cells = p.seq.map(function(v){ return v === null ? '<span class="nm-nl-cell nm-nl-cell-blank"></span>' : '<span class="nm-nl-cell nm-nl-num">' + K.esc(String(v)) + '</span>'; });
    var sep = p.kind === 'between' ? '<span style="width:3mm"></span>' : '<span class="nm-nl-arrow">→</span>';
    return K.nlCard(K.nlStage('<div class="nm-nl-row nm-nl-seq" style="font-size:16px;gap:1mm;flex-wrap:wrap">' + cells.join(sep) + '</div>'));
  },
  label: function(){ return null; }
});

/* ── 길 채우기 ── */
def('g13Path', {
  visual: function(p, K){
    var g = G();
    return K.nlCard(K.nlStage(g.pathSvg(p, { print: true }) + (p.legend ? '<div class="nm-nl-g13-legend">' + K.esc(K.pickL(p.legend)) + '</div>' : '')));
  },
  label: function(p){
    var order = []; p.nodes.forEach(function(n){ if(!n.show) order.push(n.v); });
    return order.join('·');
  }
});

/* ── 수 표시 ── */
def('g13NumPick', {
  visual: function(p, K){
    var head = '';
    if(p.expr) head += '<div class="nm-nl-g13-big">' + K.esc(p.expr) + '</div>';
    if(p.scene){ var o = ''; for(var k = 0; k < p.scene.n; k++) o += '<span class="nm-nl-g">' + K.nlObjHtml(p.scene.e) + '</span>'; head += '<div class="nm-nl-row" style="font-size:22px;gap:1mm">' + o + '</div>'; }
    var tiles = '<div class="nm-nl-g13-row" style="align-items:center">' + p.tiles.map(function(v, i){
      var pre = (p.pre || []).indexOf(i) >= 0;
      return '<span class="nm-nl-g13-card sq' + (pre ? ' hi' : '') + '">' + v + '</span>'; }).join('') + '</div>';
    var ans = p.ask === 'count' ? K.nlAnsBox(K.EA) : '';
    return K.nlCard(K.nlStage(head + tiles), ans);
  },
  label: function(p, K){
    var out = [];
    p.marks.forEach(function(m){ var vals = m.set.map(function(i){ return p.tiles[i]; }).sort(function(a, b){ return a - b; });
      out.push((m.sym === 'color' ? K.lk('색칠', 'color', '涂色') : m.sym) + ' ' + vals.join('·')); });
    return out.join(' / ') + (p.ask === 'count' ? ' → ' + p.answer + K.EA : '');
  }
});

/* ── 순서 카드 ── */
def('g13Order', {
  visual: function(p, K){
    var cards = '<div class="nm-nl-g13-row" style="align-items:center;gap:2mm">' + p.tiles.map(function(v){ return '<span class="nm-nl-g13-card sq" style="height:9mm;width:8mm;min-width:8mm">' + v + '</span>'; }).join('') + '</div>';
    var slots = '<div class="nm-nl-g13-slotrow">' + p.tiles.map(function(){ return '<span class="nm-nl-g13-slot"></span>'; }).join('') + '</div>';
    var line = '';
    if(p.otype === 'near'){
      var mn = p.line.min, mx = p.line.max, X = function(v){ return 6 + (v - mn) * 10; }, s = '<svg class="nm-nl-g13-nl nm-obj-svg" viewBox="0 0 ' + (12 + (mx - mn) * 10) + ' 24" style="width:50mm;height:auto;display:block"><line x1="2" y1="14" x2="' + (10 + (mx - mn) * 10) + '" y2="14" stroke="#0E2C57" stroke-width="1"/>';
      for(var v = mn; v <= mx; v++) s += '<line x1="' + X(v) + '" y1="11" x2="' + X(v) + '" y2="17" stroke="#0E2C57" stroke-width="1"/><text x="' + X(v) + '" y="23" text-anchor="middle" font-size="5.5" font-weight="700" style="fill:#4a5468" stroke="none">' + v + '</text>';
      s += '<rect x="' + (X(p.base) - 4) + '" y="3" width="8" height="8" rx="1.5" fill="#fff3cf" stroke="#C9A063" stroke-width="1"/><text x="' + X(p.base) + '" y="9.2" text-anchor="middle" font-size="6.5" font-weight="800" style="fill:#7a5a12" stroke="none">' + p.base + '</text>';
      line = s + '</svg>';
    }
    return K.nlCard(K.nlStage(line + cards + '<div class="nm-nl-g13-ends"><span>' + K.esc(K.lk('쓰는 순서', 'Write in order', '书写顺序')) + ' →</span></div>' + slots));
  },
  label: function(p){
    var want = p.tiles.slice();
    if(p.otype === 'near') want.sort(function(a, b){ return Math.abs(a - p.base) - Math.abs(b - p.base); });
    else if(p.otype === 'desc') want.sort(function(a, b){ return b - a; });
    else want.sort(function(a, b){ return a - b; });
    return want.join(', ');
  }
});

/* ── 핀볼 ── */
def('g13Pinball', {
  visual: function(p, K){
    var blk = {}; p.blocks.forEach(function(q){ blk[q.join()] = 1; });
    var size = p.rows >= 5 ? 6.6 : p.rows === 4 ? 8 : 9.6, cells = '';
    for(var r = 0; r < p.rows; r++) for(var c = 0; c < p.cols; c++){ var k = r + ',' + c; cells += '<div' + (blk[k] ? ' class="blk"' : (p.given[k] != null ? ' class="giv"' : '')) + '>' + (p.given[k] != null ? p.given[k] : '') + '</div>'; }
    return K.nlCard(K.nlStage('<div class="nm-nl-g13-pin" style="grid-template-columns:repeat(' + p.cols + ',' + size + 'mm);grid-auto-rows:' + size + 'mm">' + cells + '</div>'));
  },
  label: function(p){
    var at = {}; p.solution.forEach(function(q, i){ at[q.join()] = i + 1; });
    var blk = {}; p.blocks.forEach(function(q){ blk[q.join()] = 1; });
    var rows = []; for(var r = 0; r < p.rows; r++){ var row = []; for(var c = 0; c < p.cols; c++){ var k = r + ',' + c; row.push(blk[k] ? '●' : (at[k] || '·')); } rows.push(row.join(' ')); }
    return rows.join(' / ');
  }
});

/* ── 개수 줄과 순서 줄 ── */
def('g13OrdPaint', {
  visual: function(p, K){
    var out = p.rows.map(function(r){
      var cells = ''; for(var i = 0; i < p.total; i++) cells += '<span class="nm-nl-g13-oc"></span>';
      var flag = r.from === 'right' ? '◀ ' + K.lk('오른쪽 시작', 'start right', '从右边开始') : K.lk('왼쪽 시작', 'start left', '从左边开始') + ' ▶';
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:.8mm"><div class="nm-nl-g13-cap">' + K.esc(K.pickL(r.cap)) + ' <span style="font-weight:600;font-size:9.5px">' + K.esc(flag) + '</span></div><div class="nm-nl-g13-cells">' + cells + '</div></div>';
    }).join('');
    return K.nlCard(K.nlStage(out));
  },
  label: function(p, K){
    return p.rows.map(function(r){ return K.pickL(r.cap) + ': ' + (r.kind === 'ordinal' ? K.lk(r.n + '째 한 칸', 'only no.' + r.n, '只第' + r.n + '个') : K.lk(r.n + '칸', r.n + ' boxes', r.n + '格')); }).join(' / ');
  }
});

/* ── 양쪽 순서수 ── */
function stripSq(total, onFn){ var s = ''; for(var i = 0; i < total; i++) s += '<span class="nm-nl-g13-sq' + (onFn(i) ? ' on' : '') + '"></span>'; return '<div class="nm-nl-g13-cells">' + s + '</div>'; }
function ordWordPrint(K, kind, n){
  var g = G(), l = lg(K);
  if(l === 'en') return kind === 'ordinal' ? g.ORD.en[n] : g.NATIVE.en[n];
  if(l === 'zh') return kind === 'ordinal' ? '第' + g.NATIVE.zh[n] + '个' : g.NATIVE.zh[n] + '个';
  return kind === 'ordinal' ? g.ORD.ko[n] : g.NATIVE.ko[n];
}
def('g13OrdRow', {
  visual: function(p, K){
    var m = p.ordMode, ends = '<div class="nm-nl-g13-ends"><span>◀ ' + K.esc(K.lk('왼쪽', 'left', '左边')) + '</span><span>' + K.esc(K.lk('오른쪽', 'right', '右边')) + ' ▶</span></div>';
    if(m === 'build'){
      var sd = { row: [['왼쪽', 'left', '左边'], ['오른쪽', 'right', '右边']], col: [['위', 'top', '上面'], ['아래', 'bottom', '下面']], queue: [['앞', 'front', '前面'], ['뒤', 'back', '后面']] }[p.axis];
      var s0 = K.lk(sd[0][0], sd[0][1], sd[0][2]), s1 = K.lk(sd[1][0], sd[1][1], sd[1][2]);
      var b1 = K.lk(s0 + '에서 ' + p.a + '째', 'No. ' + p.a + ' from the ' + s0, '从' + s0 + '数第' + p.a + '个'), b2 = K.lk(s1 + '에서 ' + p.b + '째', 'No. ' + p.b + ' from the ' + s1, '从' + s1 + '数第' + p.b + '个');
      return K.nlCard(K.nlStage('<div class="nm-nl-g13-row" style="gap:3mm"><span class="nm-nl-g13-bubble">' + K.esc(b1) + '</span><span class="nm-nl-g13-bubble">' + K.esc(b2) + '</span></div><div class="nm-nl-g13-wbox" style="height:12mm"></div>'), K.nlAnsBox(K.lk('칸', '', '格')));
    }
    if(m === 'flip') return K.nlCard(K.nlStage(ends + stripSq(p.total, function(i){ return i === p.a - 1; })), optsRow(K, p.choices));
    if(m === 'find'){
      var cards = '<div class="nm-nl-g13-row" style="align-items:center;gap:1.4mm">' + p.cards.map(function(v){ return '<span class="nm-nl-g13-card sq' + (v === p.ref.v ? ' hi' : '') + '" style="height:11mm;width:8mm;min-width:8mm">' + v + '</span>'; }).join('') + '</div>';
      return K.nlCard(K.nlStage(ends + cards), K.nlAnsBox(K.lk('째', '', '')));
    }
    var strip = stripSq(p.total, function(i){ var pos = p.from === 'left' ? i + 1 : p.total - i; return p.kind === 'ordinal' ? pos === p.n : pos <= p.n; });
    var flag = p.from === 'left' ? K.lk('왼쪽에서 시작 ▶', 'start from the left ▶', '从左边开始 ▶') : '◀ ' + K.lk('오른쪽에서 시작', 'start from the right', '从右边开始');
    return K.nlCard(K.nlStage('<div class="nm-nl-g13-ends"><span>' + (p.from === 'left' ? K.esc(flag) : '') + '</span><span>' + (p.from === 'right' ? K.esc(flag) : '') + '</span></div>' + strip),
      optsRow(K, p.choices, function(code){ return K.esc(ordWordPrint(K, code % 10 === 1 ? 'ordinal' : 'cardinal', Math.floor(code / 10))); }));
  },
  label: function(p, K){
    if(p.ordMode === 'word'){ var i = p.choices.indexOf(p.answer); return circ(i + 1) + ' ' + ordWordPrint(K, p.answer % 10 === 1 ? 'ordinal' : 'cardinal', Math.floor(p.answer / 10)); }
    if(p.ordMode === 'flip') return circ(p.choices.indexOf(p.answer) + 1) + ' ' + p.answer;
    return null;
  }
});

/* ── 크기 비교 ── */
def('g13Cmp', {
  visual: function(p, K){
    var big = '<div class="nm-nl-g13-row" style="align-items:center;gap:5mm"><span class="nm-nl-g13-big">' + p.left + '</span><span class="nm-nl-g13-big sign" style="font-weight:600">○</span><span class="nm-nl-g13-big">' + p.right + '</span></div>';
    var sent = '';
    if(p.ask === 'word'){
      var l = lg(K), words = K.lk('(큽니다, 작습니다)', '(bigger, smaller)', '(大于, 小于)');
      sent = '<div class="nm-nl-g13-sent">' + K.esc(l === 'ko' ? p.left + '은(는) ' + p.right + '보다 ' + words : l === 'en' ? p.left + ' is ' + words + ' than ' + p.right : p.left + ' ' + words + ' ' + p.right) + '</div>';
    }
    return K.nlCard(K.nlStage(big + sent));
  },
  label: function(p){ return p.answer === 1 ? '>' : '<'; }
});

/* ── 삼각형 화살표 ── */
var TRI = [[50, 14], [14, 76], [86, 76]];
def('g13ArrowTri', {
  visual: function(p, K){
    /* 화면(.nm-g13-tr*)과 같은 색: 화살표 초록, 꼭짓점 남색 테두리, 빈 꼭짓점 금색 점선, 그릴 자리 점선은 금색 */
    var s = '<svg class="nm-nl-g13-tri nm-obj-svg" viewBox="0 0 100 92" style="width:32mm;height:auto;display:block">';
    function arrow(a, b){
      var A = TRI[a], B = TRI[b], dx = B[0] - A[0], dy = B[1] - A[1], d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d, r = 12.5;
      var x1 = A[0] + ux * r, y1 = A[1] + uy * r, x2 = B[0] - ux * r, y2 = B[1] - uy * r, hx = x2 - ux * 6.5, hy = y2 - uy * 6.5, nx = -uy * 3.8, ny = ux * 3.8;
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + hx + '" y2="' + hy + '" stroke="#2E9E6B" stroke-width="2.2" stroke-linecap="round"/><polygon points="' + x2 + ',' + y2 + ' ' + (hx + nx) + ',' + (hy + ny) + ' ' + (hx - nx) + ',' + (hy - ny) + '" fill="#2E9E6B"/>';
    }
    [[0, 1], [0, 2], [1, 2]].forEach(function(e){ if(p.amode === 'draw') s += '<line x1="' + TRI[e[0]][0] + '" y1="' + TRI[e[0]][1] + '" x2="' + TRI[e[1]][0] + '" y2="' + TRI[e[1]][1] + '" stroke="#C9A063" stroke-width="1.4" stroke-dasharray="3 2.4"/>'; });
    if(p.amode === 'fill') p.arrows.forEach(function(a){ s += arrow(a[0], a[1]); });
    TRI.forEach(function(q, i){
      var v = p.amode === 'draw' ? p.vals[i] : (p.pre && p.pre[i] != null ? p.pre[i] : null);
      s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="11" fill="' + (v == null ? '#fffaf0' : '#fff') + '" stroke="' + (v == null ? '#C9A063' : '#0E2C57') + '" stroke-width="1.8"' + (v == null ? ' stroke-dasharray="3 2"' : '') + '/>' + (v == null ? '' : '<text x="' + q[0] + '" y="' + (q[1] + 4.6) + '" text-anchor="middle" font-size="13" font-weight="800" style="fill:#0E2C57" stroke="none">' + v + '</text>');
    });
    s += '</svg>';
    var bank = '';
    if(p.amode === 'fill'){ var skip = p.pre ? Object.keys(p.pre).map(function(k){ return p.pre[k]; }) : []; bank = '<div class="nm-nl-g13-row" style="align-items:center;gap:2mm">' + p.bank.filter(function(v){ return skip.indexOf(v) < 0; }).map(function(v){ return '<span class="nm-nl-g13-card sq">' + v + '</span>'; }).join('') + '</div>'; }
    return K.nlCard(K.nlStage(s + bank));
  },
  label: function(p, K){
    if(p.amode === 'draw'){ var v = p.vals, out = []; [[0, 1], [0, 2], [1, 2]].forEach(function(e){ var a = v[e[0]], b = v[e[1]]; out.push(a > b ? a + '>' + b : b + '>' + a); }); return out.join(' · '); }
    var nm = [K.lk('위', 'top', '上'), K.lk('왼쪽 아래', 'bottom left', '左下'), K.lk('오른쪽 아래', 'bottom right', '右下')];
    return nm.map(function(n, i){ return n + ' ' + p.vals[p.rank[i]]; }).join(', ');
  }
});

/* ── 하나 더 ── */
def('g13Make', {
  visual: function(p, K){
    var fixed = ''; for(var i = 0; i < p.fixed; i++) fixed += '<span class="nm-nl-g">' + K.nlObjHtml(p.emoji) + '</span>';
    return K.nlCard(K.nlStage('<div class="nm-nl-row" style="font-size:24px;gap:1mm;flex-wrap:wrap">' + fixed + '</div><div class="nm-nl-g13-wbox"></div>'), K.nlAnsBox(K.EA));
  },
  label: function(){ return null; }
});
})();
