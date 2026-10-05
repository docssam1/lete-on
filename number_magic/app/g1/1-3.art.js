/* G1-1~3호(N-01~N-03) 공용 그림 — 새 소품 등록 + 화면·인쇄가 함께 쓰는 SVG 그리기 도구(window.NM_G13).
   화면(widgets)·인쇄(print) 파일이 모두 이 파일을 먼저 읽는다(index/ws/drill/placement 에서 object-art.js 바로 뒤).
   소품은 NM_OBJECTS.register — viewBox 0 0 64 64, 젤리 질감(object-art.js helpers). 실사 PNG 는 data/real-art.js 표가 나중에 덮는다.
   전부 직접 그린 원본 도형이다(이모지 폰트·타사 그림 아님). */
(function(){ 'use strict';

/* ── 수 낱말(3언어) — 위젯과 인쇄가 같은 표를 읽는다 ─────────────────────────── */
var NATIVE = {
  ko: ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'],
  en: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
  zh: ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
};
var SINO_KO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
var ORD = {
  ko: ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'],
  en: ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'],
  zh: ['', '第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九']
};
/* sino 는 한국어에만 있다 — en·zh 에서는 고유어(읽는 말)와 같은 글자로 갈음한다 */
function numWord(n, form, lang){
  if(form === 'sino' && lang === 'ko') return SINO_KO[n] || String(n);
  if(form === 'digit') return String(n);
  return (NATIVE[lang] || NATIVE.ko)[n] || String(n);
}

/* ── SVG 조각 ───────────────────────────────────────────────────────────── */
/* 손가락 — k=0~5 한 손. 1~4 는 검지부터, 5 는 엄지까지(오른손 손바닥). */
function handSvg(k, o){
  o = o || {};
  var skin = o.skin || '#ffd9b0', ln = o.line || '#a8693a';
  var ext = [k >= 5, k >= 1, k >= 2, k >= 3, k >= 4];      /* 엄지·검지·중지·약지·새끼 */
  var xs = [8, 17, 26.5, 36, 45], hs = [18, 30, 34, 30, 24];
  var s = '<svg class="nm-g13-hand" viewBox="0 0 60 66" aria-hidden="true">';
  for(var i = 1; i < 5; i++){
    var h = ext[i] ? hs[i] : 9, y = ext[i] ? 34 - hs[i] + 6 : 25;
    s += '<rect x="' + xs[i] + '" y="' + y + '" width="8.4" height="' + (ext[i] ? hs[i] + 8 : 17) + '" rx="4.2" fill="' + skin + '" stroke="' + ln + '" stroke-width="1.6"/>';
  }
  s += '<rect x="9" y="30" width="44" height="30" rx="12" fill="' + skin + '" stroke="' + ln + '" stroke-width="1.8"/>';
  if(ext[0]) s += '<rect x="-1" y="30" width="9" height="24" rx="4.5" fill="' + skin + '" stroke="' + ln + '" stroke-width="1.6" transform="rotate(-32 4 54)"/>';
  else s += '<path d="M14 46 C20 40 30 42 33 48" fill="none" stroke="' + ln + '" stroke-width="1.8" stroke-linecap="round"/>';
  return s + '</svg>';
}
/* 10칸 틀 그림(5×2) — n 칸에 점이 찍힌다. 화면·인쇄 겸용(자체 색 속성). */
function frameSvg(n, o){
  o = o || {};
  var ink = o.ink || '#1F2A3A', dot = o.dot || '#e5a82a', w = o.w || 50;
  var s = '<svg class="nm-g13-frame" viewBox="0 0 50 22" width="' + w + '" aria-hidden="true">'
    + '<rect x="1" y="1" width="48" height="20" rx="2" fill="#fff" stroke="' + ink + '" stroke-width="1.4"/>';
  for(var i = 1; i < 5; i++) s += '<line x1="' + (1 + i * 9.6) + '" y1="1" x2="' + (1 + i * 9.6) + '" y2="21" stroke="' + ink + '" stroke-width=".8"/>';
  s += '<line x1="1" y1="11" x2="49" y2="11" stroke="' + ink + '" stroke-width=".8"/>';
  for(var k = 0; k < Math.min(n, 10); k++){
    var cx = 1 + (k % 5) * 9.6 + 4.8, cy = k < 5 ? 6 : 16;
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3.3" fill="' + dot + '" stroke="' + ink + '" stroke-width=".8"/>';
  }
  return s + '</svg>';
}
/* 점 카드 — 3열로 차례로 */
function diceSvg(n, o){
  o = o || {}; var ink = o.ink || '#1F2A3A', dot = o.dot || '#1F2A3A';
  var rows = Math.ceil(n / 3) || 1, h = rows * 9 + 3;
  var s = '<svg class="nm-g13-dice" viewBox="0 0 30 ' + h + '" aria-hidden="true">';
  for(var k = 0; k < n; k++) s += '<circle cx="' + (6 + (k % 3) * 9) + '" cy="' + (6 + Math.floor(k / 3) * 9) + '" r="3.2" fill="' + dot + '"/>';
  return s + '</svg>';
}

/* ── 쌓기나무(등각 투영) ───────────────────────────────────────────────────
   heights[r][c] = 칸의 쌓은 높이. r 이 클수록 앞, c 가 클수록 오른쪽 앞. 보이는 면은 위·왼앞(+r)·오른앞(+c).
   그리는 순서는 깊이 r+c+z 오름차순(먼 것 → 가까운 것). */
function isoProject(gx, gy, gz, W){ return [(gx - gy) * W, (gx + gy) * W / 2 - gz * W]; }
function isoCubes(H){
  var out = [];
  for(var r = 0; r < H.length; r++) for(var c = 0; c < H[r].length; c++) for(var z = 0; z < H[r][c]; z++) out.push({ r: r, c: c, z: z });
  out.sort(function(a, b){ return (a.r + a.c + a.z) - (b.r + b.c + b.z) || a.z - b.z || a.r - b.r; });
  return out;
}
function isoSvg(H, o){
  o = o || {}; var W = o.w || 16, print = !!o.print;
  var cubes = isoCubes(H), R = H.length, C = 0; H.forEach(function(row){ C = Math.max(C, row.length); });
  var hmax = 0; H.forEach(function(row){ row.forEach(function(v){ hmax = Math.max(hmax, v); }); });
  var minX = -R * W - 2, maxX = C * W + 2, minY = -hmax * W - 2, maxY = (R + C) * W / 2 + 2;
  var col = print ? { top: '#ffffff', left: '#d9d9d9', right: '#a9a9a9', ln: '#000' } : { top: '#f4d49a', left: '#d9a45c', right: '#b97a35', ln: '#6b4220' };
  var s = '<svg class="' + (print ? 'nm-nl-g13-iso' : 'nm-g13-iso') + '" viewBox="' + minX + ' ' + minY + ' ' + (maxX - minX) + ' ' + (maxY - minY) + '" role="img" aria-label="blocks">';
  function poly(pts, fill){ return '<polygon points="' + pts.map(function(p){ return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + fill + '" stroke="' + col.ln + '" stroke-width="' + (print ? 1.1 : 1) + '" stroke-linejoin="round"/>'; }
  cubes.forEach(function(q){
    var A = isoProject(q.c, q.r, q.z + 1, W), B = isoProject(q.c + 1, q.r, q.z + 1, W), Cc = isoProject(q.c + 1, q.r + 1, q.z + 1, W), D = isoProject(q.c, q.r + 1, q.z + 1, W);
    var Cb = isoProject(q.c + 1, q.r + 1, q.z, W), Db = isoProject(q.c, q.r + 1, q.z, W), Bb = isoProject(q.c + 1, q.r, q.z, W);
    s += poly([D, Cc, Cb, Db], col.left) + poly([Cc, B, Bb, Cb], col.right) + poly([A, B, Cc, D], col.top);
  });
  return s + '</svg>';
}

/* ── 새 소품 SVG ──────────────────────────────────────────────────────────── */
function registerAll(){
  var O = window.NM_OBJECTS; if(!O || !O.register || !O.helpers) return;
  var H = O.helpers, P = H.P, defs = H.defs, fill = H.fill, hl = H.hl, extra = H.extra, sw = H.sw;
  function reg(token, fn){ O.register(token, fn); }

  /* 기하 도형 3종 — 모양으로 구분되고 색은 보조 */
  reg('shape:circle', function(id){ var c = P.blue; return defs(id, c) + '<circle cx="32" cy="32" r="24" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' + hl(23, 22, 6, 3, -35); });
  reg('shape:square', function(id){ var c = P.orange; return defs(id, c) + '<rect x="9" y="9" width="46" height="46" rx="5" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' + hl(20, 18, 7, 3, -20); });
  reg('shape:triangle', function(id){ var c = P.green; return defs(id, c) + '<path d="M32 7 L58 54 L6 54 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' + hl(27, 30, 3, 8, 28); });

  reg('baseball', function(id){ var c = P.white;
    return defs(id, c) + '<circle cx="32" cy="32" r="25" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>'
      + '<path d="M16 12 C26 24 26 40 16 52 M48 12 C38 24 38 40 48 52" fill="none" stroke="#d6453d" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M19 20 l5 2 M21 27 l5 1 M21 36 l5 -1 M19 44 l5 -2 M45 20 l-5 2 M43 27 l-5 1 M43 36 l-5 -1 M45 44 l-5 -2" stroke="#d6453d" stroke-width="1.6" stroke-linecap="round"/>' + hl(21, 16, 5, 2.4, -35); });
  reg('rugby-ball', function(id){ var c = P.tan;
    return defs(id, c) + '<ellipse cx="32" cy="32" rx="26" ry="16" transform="rotate(-30 32 32)" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>'
      + '<path d="M22 41 L42 23 M26 28 l5 5 M31 24 l5 5 M33 36 l5 -5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" transform="rotate(0 32 32)"/>' + hl(20, 26, 5, 2.4, -50); });
  reg('grapes', function(id){ var c = P.purple, g = P.green, s = '';
    [[22, 24], [32, 22], [42, 24], [27, 33], [37, 33], [32, 43], [22, 40], [42, 40]].forEach(function(p, i){
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7.6" fill="' + fill(id) + '"' + sw(c, 1.8) + '/>' + hl(p[0] - 2.5, p[1] - 2.5, 2.2, 1.3, -30); });
    return defs(id, c) + extra(id, [['l', g]]) + s + '<path d="M32 15 C32 9 34 6 38 5" fill="none" stroke="#6b4a1e" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M34 9 C40 3 50 5 52 10 C46 14 38 14 34 9 Z" fill="url(#l' + id + ')"' + sw(g, 1.6) + '/>'; });
  reg('watermelon', function(id){ var c = P.green, r = P.red;
    return defs(id, c) + extra(id, [['r', r]])
      + '<path d="M5 24 A27 27 0 0 0 59 24 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>'
      + '<path d="M9 24 A23 23 0 0 0 55 24 Z" fill="url(#r' + id + ')"/>'
      + '<path d="M5 24 L59 24" stroke="' + c[2] + '" stroke-width="2.4" stroke-linecap="round"/>'
      + [[22, 32], [32, 38], [42, 32], [28, 28], [37, 27]].map(function(p){ return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.7" ry="2.6" fill="#2a1a12"/>'; }).join('') + hl(15, 30, 3, 5, 30); });
  reg('pear', function(id){ var c = P.yellow, g = P.green;
    return defs(id, c) + extra(id, [['l', g]])
      + '<path d="M32 14 C26 14 25 22 21 28 C14 36 15 55 32 56 C49 55 50 36 43 28 C39 22 38 14 32 14 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>'
      + '<path d="M32 14 C32 10 33 8 36 6" fill="none" stroke="#6b4a1e" stroke-width="3" stroke-linecap="round"/>'
      + '<path d="M34 10 C39 4 48 6 50 10 C45 14 38 14 34 10 Z" fill="url(#l' + id + ')"' + sw(g, 1.6) + '/>' + hl(23, 40, 3, 8, 15); });
  reg('moon', function(id){ var c = P.yellow;
    return defs(id, c) + '<path d="M40 7 C22 8 11 22 13 38 C15 52 29 60 45 55 C31 52 24 41 26 29 C28 19 33 11 40 7 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' + hl(21, 30, 2.6, 8, 12); });
  reg('sun', function(id){ var c = P.yellow, o = P.orange, rays = '';
    for(var i = 0; i < 8; i++) rays += '<line x1="32" y1="5" x2="32" y2="13" stroke="' + o[1] + '" stroke-width="4.4" stroke-linecap="round" transform="rotate(' + (i * 45) + ' 32 32)"/>';
    return defs(id, c) + rays + '<circle cx="32" cy="32" r="14.5" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' + hl(27, 27, 4, 2.2, -30); });
  function cloudPath(){ return 'M18 44 C8 44 6 31 15 29 C14 18 28 13 34 22 C42 16 54 24 50 34 C58 36 56 46 47 46 Z'; }
  reg('cloud', function(id){ var c = P.white;
    return defs(id, c) + '<path d="' + cloudPath() + '" transform="translate(0 4)" fill="' + fill(id) + '"' + sw(['', '', '#7c8aa3'], 2.2) + '/>' + hl(22, 28, 5, 2.4, -30); });
  reg('rain', function(id){ var c = P.blue;
    return defs(id, c) + '<path d="' + cloudPath() + '" transform="translate(0 -4)" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>'
      + '<path d="M22 46 l-3 8 M32 46 l-3 8 M42 46 l-3 8" stroke="#3b8fe0" stroke-width="3.4" stroke-linecap="round"/>' + hl(22, 22, 5, 2.4, -30); });
  reg('kite', function(id){ var c = P.pink;
    return defs(id, c) + '<path d="M32 5 L52 28 L32 47 L12 28 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>'
      + '<path d="M32 5 L32 47 M12 28 L52 28" stroke="' + c[2] + '" stroke-width="1.6" opacity=".6"/>'
      + '<path d="M32 47 C28 52 36 55 31 60" fill="none" stroke="#6b4a1e" stroke-width="2" stroke-linecap="round"/>'
      + '<path d="M29 53 l-5 -2 l1 5 Z M34 56 l5 -2 l-1 5 Z" fill="' + P.yellow[1] + '" stroke="' + P.yellow[2] + '" stroke-width="1"/>' + hl(24, 22, 3, 6, 40); });
  reg('pencil', function(id){ var c = P.yellow;
    return defs(id, c) + '<g transform="rotate(45 32 32)">'
      + '<rect x="24" y="6" width="16" height="38" rx="2" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>'
      + '<rect x="24" y="6" width="16" height="7" rx="2" fill="#f19aa8" stroke="#8c2a5e" stroke-width="2"/>'
      + '<path d="M24 44 L32 60 L40 44 Z" fill="#ffe2b0" stroke="#7a4f1d" stroke-width="2" stroke-linejoin="round"/>'
      + '<path d="M29 54 L32 60 L35 54 Z" fill="#2b3345"/></g>'; });
  reg('eraser', function(id){ var c = P.pink;
    return defs(id, c) + '<g transform="rotate(-20 32 32)"><rect x="9" y="20" width="46" height="24" rx="5" fill="#f4f1ea" stroke="#6b7688" stroke-width="2.2"/>'
      + '<rect x="9" y="20" width="26" height="24" rx="5" fill="' + fill(id) + '"' + sw(c, 2.2) + '/><rect x="35" y="20" width="3" height="24" fill="' + c[2] + '" opacity=".35"/></g>' + hl(18, 26, 5, 2, -20); });
  reg('paper-clip', function(id){
    return '<path d="M22 40 L22 18 C22 8 40 8 40 18 L40 46 C40 54 28 54 28 46 L28 24 C28 21 34 21 34 24 L34 42" fill="none" stroke="#6b7688" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="M22 40 L22 18 C22 8 40 8 40 18" fill="none" stroke="#c4ccd9" stroke-width="1.6" stroke-linecap="round" transform="translate(-.8 -.8)"/>'; });
  reg('marble', function(id){ var c = P.blue;
    return defs(id, c) + '<circle cx="32" cy="32" r="24" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>'
      + '<path d="M16 38 C24 28 38 36 48 26" fill="none" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>' + hl(23, 21, 6, 3.4, -35); });
}

/* ── 길 채우기(pathFill) 그림 — 화면·인쇄 겸용 ─────────────────────────────────
   p.nodes[{x,y,v,show,shape}] · p.edges[{a,b,style}] (화살표는 a→b, 끝이 더 큰 수) · p.vw/vh.
   o.fills={노드번호:값} 채운 칸, o.focus=지금 고를 빈칸, o.print=흑백 인쇄용(굵은 선·빈칸은 점선). */
function pathSvg(p, o){
  o = o || {}; var print = !!o.print, fills = o.fills || {}, focus = o.focus;
  var ink = print ? '#000' : '#16417c', lw = print ? 1.5 : 1.7;
  var s = '<svg class="' + (print ? 'nm-nl-g13-path' : 'nm-g13-path') + '" viewBox="0 0 ' + p.vw + ' ' + p.vh + '" role="img" aria-label="path">';
  function rad(n){ return n.shape === 'box' ? 11 : 6.2; }
  (p.edges || []).forEach(function(e){
    var a = p.nodes[e.a], b = p.nodes[e.b];
    var dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / d, uy = dy / d;
    var x1 = a.x + ux * (rad(a) + 1.2), y1 = a.y + uy * (rad(a) + 1.2), x2 = b.x - ux * (rad(b) + 1.2), y2 = b.y - uy * (rad(b) + 1.2);
    var dbl = e.style === 'double', dash = (e.style === 'dashed') ? ' stroke-dasharray="2.6 2"' : '';
    var back = dbl ? 5.6 : 3.2;
    s += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + (x2 - ux * back).toFixed(1) + '" y2="' + (y2 - uy * back).toFixed(1) + '" stroke="' + ink + '" stroke-width="' + lw + '" stroke-linecap="round"' + dash + '/>';
    function head(tx, ty){
      var hx = tx - ux * 3.6, hy = ty - uy * 3.6, nx = -uy * 2.2, ny = ux * 2.2;
      return '<polygon points="' + tx.toFixed(1) + ',' + ty.toFixed(1) + ' ' + (hx + nx).toFixed(1) + ',' + (hy + ny).toFixed(1) + ' ' + (hx - nx).toFixed(1) + ',' + (hy - ny).toFixed(1) + '" fill="' + ink + '"/>';
    }
    s += head(x2, y2); if(dbl) s += head(x2 - ux * 3.2, y2 - uy * 3.2);
  });
  p.nodes.forEach(function(n, i){
    var filled = fills[i] != null, blank = !n.show, txt = n.show ? n.v : (filled ? fills[i] : '');
    var cls = 'nm-g13-pn' + (blank ? ' blank' : '') + (filled ? ' found' : '') + (focus === i ? ' focus' : '');
    var fillc = print ? '#fff' : (blank ? (filled ? '#eafaf1' : '#fffaf0') : '#fff');
    var stroke = print ? '#000' : (blank ? (filled ? '#2e9e6b' : '#c9a063') : ink);
    var dashed = blank && !filled ? ' stroke-dasharray="2.4 1.8"' : '';
    s += '<g class="' + cls + '" data-i="' + i + '">';
    if(n.shape === 'box') s += '<rect x="' + (n.x - 11) + '" y="' + (n.y - 11) + '" width="22" height="22" rx="4" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + lw + '"' + dashed + '/>';
    else s += '<circle cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="6.2" fill="' + fillc + '" stroke="' + stroke + '" stroke-width="' + lw + '"' + dashed + '/>';
    if(txt !== '') s += '<text x="' + n.x.toFixed(1) + '" y="' + (n.y + 3).toFixed(1) + '" text-anchor="middle" font-size="' + (n.shape === 'box' ? 11 : 9) + '" font-weight="800" fill="' + (print ? '#000' : (filled ? '#1f7a50' : ink)) + '">' + txt + '</text>';
    s += '<circle class="nm-g13-hit" cx="' + n.x.toFixed(1) + '" cy="' + n.y.toFixed(1) + '" r="10" fill="transparent"/></g>';
  });
  return s + '</svg>';
}

registerAll();

window.NM_G13 = {
  pathSvg: pathSvg,
  NATIVE: NATIVE, SINO_KO: SINO_KO, ORD: ORD, numWord: numWord,
  handSvg: handSvg, frameSvg: frameSvg, diceSvg: diceSvg, isoSvg: isoSvg, isoProject: isoProject, isoCubes: isoCubes
};
})();
