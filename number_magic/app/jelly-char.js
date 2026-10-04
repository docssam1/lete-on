/* ============================================================
   Numbers of Magic — 젤리 기호 캐릭터 (SVG)  2026-10-04
   원장: "졸라맨이라 표현했지만 실제 캐릭터 같지 않은 품질을 높이라는 거야" → "svg로 가자"

   기존 SVG 폴백(app/numi-render.js symGlyphPath/symLimbs/symFace)은 선으로만 그린 막대 팔다리 + 점 눈이라 캐릭터로 보이지 않았다.
   여기서는 숫자·기호 캐릭터(누미·기호 마법단 PNG)와 한 세트로 보이도록 같은 어휘로 그린다:
     · 통통한 젤리 몸(위→아래 그라데이션 + 진한 테두리 + 하이라이트 + 아래 그림자 + 바닥 그림자)
     · 큰 눈(흰자·눈동자·반사광 둘)·볼터치·벌린 미소
     · 둥근 장갑 손·통통한 팔다리·신발
   전부 원본 도형이며 어떤 그림도 베끼지 않았다. 글리프는 정확한 모양을 지킨다(기호가 정답이 아니라 이름표지만 모양이 틀리면 안 된다).

   두 가지 몸:
     body  — 기호 자체가 몸(+ − × ÷ = √ π Σ ∞ ...): 굵은 둥근 선을 젤리처럼 칠한다.
     badge — 글자가 많은 기호(sin·lim·f(x)·ₙCᵣ ...): 젤리 몸통 가슴에 글리프를 새긴다. 정확한 글자를 지키려는 선택이다.

   쓰는 법: NM_JELLY.svg('+', { color:'#2f7fd8', size:120 }) → <svg> 문자열.  NM_JELLY.has(glyph) · NM_JELLY.glyphs()
   viewBox 0 0 120 150 — 기존 기호 캐릭터 규격과 같다(캐릭터 중심 60,78).
   ============================================================ */
(function(){
'use strict';

let UID = 0;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ── 색 ── */
function hexToHsl(hex){
  let h = String(hex || '#2f7fd8').replace('#', '');
  if(h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let hh = 0, s = 0;
  if(mx !== mn){
    const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
    hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60;
  }
  return [hh, s * 100, l * 100];
}
const hsl = (h, s, l) => `hsl(${Math.round(h)},${Math.round(Math.max(0, Math.min(100, s)))}%,${Math.round(Math.max(0, Math.min(100, l)))}%)`;
function palette(color){
  const [h, s, l] = hexToHsl(color), base = Math.max(l, 38), sat = Math.max(s, 60);
  return {
    light: hsl(h, sat - 8, Math.min(base + 24, 78)), mid: hsl(h, sat, base + 4), base: hsl(h, sat, base - 4),
    dark: hsl(h, sat, base - 18), edge: hsl(h, Math.min(sat + 6, 100), Math.max(base - 34, 14)), shoe: hsl(h, 55, 24)
  };
}

/* ── 몸이 되는 기호 모양 — path 들(굵은 둥근 선) ── sw = 선 굵기, face = 눈 가운데, wide = 다리를 벌림 ── */
const BODY = {
  '+':  { d: ['M60,46 L60,108', 'M29,78 L91,78'], sw: 17, face: [60, 76] },
  '−':  { d: ['M28,78 L92,78'], sw: 18, face: [60, 74] },
  '×':  { d: ['M37,53 L83,103', 'M83,53 L37,103'], sw: 15, face: [60, 76] },
  '÷':  { d: ['M29,80 L91,80'], dots: [[60, 47], [60, 109]], sw: 15, face: [60, 70], wide: true },
  '=':  { d: ['M29,62 L91,62', 'M29,94 L91,94'], sw: 15, face: [60, 78], eyeOnTop: true },
  '<':  { d: ['M88,50 L34,78 L88,106'], sw: 15, face: [58, 78] },
  '>':  { d: ['M32,50 L86,78 L32,106'], sw: 15, face: [62, 78] },
  '≤':  { d: ['M86,48 L36,72 L86,96', 'M36,110 L86,110'], sw: 13, face: [60, 76] },
  '≈':  { d: ['M27,64 C38,48 50,48 60,64 C70,80 82,80 93,64', 'M27,96 C38,80 50,80 60,96 C70,112 82,112 93,96'], sw: 12, face: [60, 80] },
  '√':  { d: ['M26,88 L39,104 L55,52 L94,52'], sw: 14, face: [68, 78] },
  'π':  { d: ['M30,54 L90,54', 'M46,54 L41,106', 'M74,54 L79,106'], sw: 15, face: [60, 80] },
  'Σ':  { d: ['M88,52 L36,52 L68,78 L36,104 L88,104'], sw: 14, face: [58, 78] },
  '∞':  { d: ['M22,84 C22,64 44,64 60,84 C76,104 98,104 98,84 C98,64 76,64 60,84 C44,104 22,104 22,84 Z'], sw: 12, face: [60, 66], eyeOnTop: true, wide: true },
  '∫':  { d: ['M78,44 C66,40 62,50 62,66 L62,92 C62,108 56,114 44,110'], sw: 13, face: [62, 76] },
  '⊥':  { d: ['M60,50 L60,104', 'M30,104 L90,104'], sw: 15, face: [60, 72] },
  '∥':  { d: ['M45,48 L45,108', 'M75,48 L75,108'], sw: 15, face: [60, 76] },
  '∈':  { d: ['M84,52 C60,52 44,64 44,78 C44,92 60,104 84,104', 'M44,78 L82,78'], sw: 13, face: [66, 78] },
  '∪':  { d: ['M38,50 L38,80 C38,106 82,106 82,80 L82,50'], sw: 16, face: [60, 76] },
  '∩':  { d: ['M38,106 L38,76 C38,50 82,50 82,76 L82,106'], sw: 16, face: [60, 80] },
  '!':  { d: ['M60,46 L60,86'], dots: [[60, 106]], sw: 17, face: [60, 66] },
  '□':  { d: ['M34,52 L86,52 L86,104 L34,104 Z'], sw: 12, face: [60, 78], eyeOnTop: true },
  '.':  { d: [], dots: [[60, 84]], sw: 44, face: [60, 80], blob: true },
  '°':  { d: ['M60,50 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0'], sw: 11, face: [60, 78], blobFace: true },
  'θ':  { d: ['M60,48 C40,48 34,66 34,80 C34,98 46,110 60,110 C74,110 86,98 86,80 C86,66 80,48 60,48 Z', 'M40,80 L80,80'], sw: 12, face: [60, 66], eyeOnTop: true },
  '∴':  { d: [], dots: [[60, 48], [36, 98], [84, 98]], sw: 26, face: [60, 80], blobFace: true },
  '²':  { d: ['M36,70 C36,50 76,50 76,70 C76,86 36,92 36,108 L78,108'], sw: 14, face: [58, 80] },
  '%':  { d: ['M33,102 L87,54', 'M40,48 m-9,0 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0', 'M82,104 m-9,0 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0'], sw: 9, face: [60, 78], wide: true, eyeOnTop: true },
  'Ⅹ':  { d: ['M38,50 L82,106', 'M82,50 L38,106', 'M30,50 L46,50', 'M74,50 L90,50', 'M30,106 L46,106', 'M74,106 L90,106'], sw: 12, face: [60, 78] }
};

/* ── 글자가 많은 기호 — 가슴 배지 ── text = 가슴에 새길 글자(정확한 표기), fit = 글자 폭(px) ── */
const BADGE = {
  'x':     { text: 'x', size: 30, fit: 20 },
  'e':     { text: 'e', size: 30, fit: 20 },
  'i':     { text: 'i', size: 30, fit: 12 },
  'D':     { text: 'D', size: 28, fit: 22 },
  'σ':     { text: 'σ', size: 30, fit: 22 },
  'x̄':     { text: 'x̄', size: 30, fit: 20 },
  'sin':   { text: 'sin', size: 24, fit: 40 },
  'log':   { text: 'log', size: 24, fit: 40 },
  'lim':   { text: 'lim', size: 24, fit: 42 },
  'd/dx':  { text: 'd/dx', size: 20, fit: 46 },
  'f(x)':  { text: 'f(x)', size: 22, fit: 46 },
  "f'":    { text: "f′", size: 28, fit: 26 },
  'f⁻¹':   { text: 'f⁻¹', size: 26, fit: 34 },
  'aⁿ':    { text: 'aⁿ', size: 28, fit: 30 },
  'ⁿ√':    { text: 'ⁿ√', size: 28, fit: 34 },
  'αβ':    { text: 'αβ', size: 28, fit: 36 },
  '½':     { text: '½', size: 32, fit: 26 },
  '|x|':   { text: '|x|', size: 28, fit: 34 },
  'ₙCᵣ':   { text: 'ₙCᵣ', size: 28, fit: 40 },
  '(x, y)':{ text: '(x, y)', size: 22, fit: 48 },
};

function has(glyph){ return !!(BODY[glyph] || BADGE[glyph]); }
function glyphs(){ return Object.keys(BODY).concat(Object.keys(BADGE)); }

/* ── 공통 조각 ── */
function defs(id, P){
  return `<defs>
<linearGradient id="jg${id}" gradientUnits="userSpaceOnUse" x1="0" y1="38" x2="0" y2="118"><stop offset="0" stop-color="${P.light}"/><stop offset=".45" stop-color="${P.mid}"/><stop offset="1" stop-color="${P.dark}"/></linearGradient>
<radialGradient id="js${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1b2233" stop-opacity=".30"/><stop offset="1" stop-color="#1b2233" stop-opacity="0"/></radialGradient>
<filter id="jb${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".9"/></filter>
</defs>`;
}
/* 몸(선 기반) — 테두리·본체·아래 그림자·하이라이트 */
function strokedBody(id, P, shape){
  const w = shape.sw, ds = shape.d, dots = shape.dots || [];
  const sk = (color, width, extra) => `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}`;
  const body = (color, width, extra) => ds.map(d => `<path d="${d}" fill="none" ${sk(color, width, extra)}/>`).join('') +
    dots.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${(shape.blob ? w / 2 : w / 2 - .5) + (width - w) / 2}" fill="${color}"/>`).join('');
  const maskId = 'jm' + id;
  return `<mask id="${maskId}"><g fill="none" ${sk('#fff', w)}>${ds.map(d => `<path d="${d}"/>`).join('')}</g>${dots.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${shape.blob ? w / 2 : w / 2 - .5}" fill="#fff"/>`).join('')}</mask>
${body(P.edge, w + 5)}
${body(`url(#jg${id})`, w)}
<g mask="url(#${maskId})" filter="url(#jb${id})">
  <g transform="translate(${(w * .17).toFixed(1)},${(w * .24).toFixed(1)})" opacity=".34">${body(P.edge, w * .55)}</g>
  <g transform="translate(${(-w * .14).toFixed(1)},${(-w * .2).toFixed(1)})" opacity=".7">${body('#fff', w * .26)}</g>
</g>
`;
}
/* 몸(배지) — 둥근 사각 몸통 + 가슴 글리프 */
function badgeBody(id, P, b){
  const rect = (x, y, w, h, r, fill, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra || ''}/>`;
  const X = 24, Y = 40, W = 72, H = 70, R = 30, maskId = 'jm' + id;
  return `<mask id="${maskId}">${rect(X, Y, W, H, R, '#fff')}</mask>
${rect(X - 3, Y - 3, W + 6, H + 6, R + 3, P.edge)}
${rect(X, Y, W, H, R, `url(#jg${id})`)}
<g mask="url(#${maskId})" filter="url(#jb${id})">
  <ellipse cx="${X + W * .6}" cy="${Y + H + 8}" rx="${W * .7}" ry="${H * .38}" fill="${P.edge}" opacity=".30"/>
  <ellipse cx="${X + W * .3}" cy="${Y + 7}" rx="${W * .26}" ry="7" fill="#fff" opacity=".75"/>
</g>
<rect x="${X + 12}" y="88" width="${W - 24}" height="${b.size > 24 ? 24 : 22}" rx="9" fill="#fff" opacity=".93"/>
<text x="60" y="${88 + (b.size > 24 ? 18 : 16.5)}" text-anchor="middle" font-family="'Jua','Pretendard','Noto Sans KR','Segoe UI',sans-serif" font-weight="800" font-size="${Math.min(b.size, 22)}" fill="${P.edge}" textLength="${Math.min(b.fit, W - 28)}" lengthAdjust="spacingAndGlyphs">${esc(b.text)}</text>`;
}
/* 눈·볼·입 */
function face(fx, fy, scale){
  const s = scale || 1, ex = 11.2 * s, er = 9.2 * s, ir = 5.6 * s;
  const eye = cx => `<ellipse cx="${cx}" cy="${fy}" rx="${er}" ry="${er * 1.12}" fill="#fff" stroke="#243247" stroke-width="1.1"/>
<circle cx="${cx + 1}" cy="${fy + 1.4 * s}" r="${ir}" fill="#2a2018"/><circle cx="${cx + 1}" cy="${fy + 1.4 * s}" r="${ir * .55}" fill="#0f0b08"/>
<circle cx="${cx + 3 * s}" cy="${fy - 2 * s}" r="${1.9 * s}" fill="#fff"/><circle cx="${cx - 1.4 * s}" cy="${fy + 3.4 * s}" r="${1.0 * s}" fill="#fff" opacity=".9"/>`;
  return `${eye(fx - ex)}${eye(fx + ex)}
<ellipse cx="${fx - ex - 5 * s}" cy="${fy + 9.5 * s}" rx="${4.4 * s}" ry="${2.8 * s}" fill="#ff7a8a" opacity=".55"/><ellipse cx="${fx + ex + 5 * s}" cy="${fy + 9.5 * s}" rx="${4.4 * s}" ry="${2.8 * s}" fill="#ff7a8a" opacity=".55"/>
<path d="M${fx - 5.5 * s},${fy + 8 * s} Q${fx},${fy + 17 * s} ${fx + 5.5 * s},${fy + 8 * s} Q${fx},${fy + 11.5 * s} ${fx - 5.5 * s},${fy + 8 * s} Z" fill="#7a2230" stroke="#3b1018" stroke-width="1" stroke-linejoin="round"/>
<path d="M${fx - 2.6 * s},${fy + 12 * s} Q${fx},${fy + 15.2 * s} ${fx + 2.6 * s},${fy + 12 * s}" fill="none" stroke="#ff8d9a" stroke-width="1.6" stroke-linecap="round"/>`;
}
/* 팔·다리·장갑·신발 — 통통한 관 */
function limbs(P, o){
  const wide = !!o.wide, tube = (d, w) => `<path d="${d}" fill="none" stroke="${P.edge}" stroke-width="${w + 3.4}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${P.mid}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${w * .24}" stroke-linecap="round" opacity=".45" transform="translate(-1.2,-1.6)"/>`;
  const lx = wide ? 40 : 49, rx = wide ? 80 : 71, lfx = wide ? 33 : 45, rfx = wide ? 87 : 75, ly = wide ? 108 : 108, fy = wide ? 132 : 130;
  const glove = (x, y) => `<circle cx="${x}" cy="${y}" r="7.4" fill="#fff" stroke="#243247" stroke-width="1.1"/><ellipse cx="${x - 2.4}" cy="${y - 2.6}" rx="2.6" ry="1.7" fill="#fff" opacity=".9"/><circle cx="${x}" cy="${y}" r="7.4" fill="none" stroke="#dfe6ee" stroke-width=".8" stroke-dasharray="0 0"/>`;
  const shoe = (x, y, flip) => `<ellipse cx="${x + (flip ? -2 : 2)}" cy="${y}" rx="9.6" ry="5.6" fill="${P.shoe}" stroke="#12182a" stroke-width="1.1"/><ellipse cx="${x + (flip ? -5 : 5)}" cy="${y - 2.2}" rx="4" ry="1.7" fill="#fff" opacity=".35"/>`;
  return `<ellipse cx="60" cy="139" rx="30" ry="6.5" fill="url(#js${o.id})"/>
${tube(`M${lx},${ly} L${lfx},${fy - 3}`, 9.6)}${tube(`M${rx},${ly} L${rfx},${fy - 3}`, 9.6)}${shoe(lfx, fy, true)}${shoe(rfx, fy, false)}
${tube(`M${o.armL[0]},${o.armL[1]} Q${o.armL[2]},${o.armL[3]} ${o.armL[4]},${o.armL[5]}`, 8.8)}${glove(o.armL[4], o.armL[5])}
${tube(`M${o.armR[0]},${o.armR[1]} Q${o.armR[2]},${o.armR[3]} ${o.armR[4]},${o.armR[5]}`, 8.8)}${glove(o.armR[4], o.armR[5])}`;
}

/* ── 한 마리 ── */
function svg(glyph, opts){
  opts = opts || {};
  const shape = BODY[glyph], badge = BADGE[glyph];
  if(!shape && !badge) return '';
  const id = (++UID) + '';
  const P = palette(opts.color || '#2f7fd8');
  const size = opts.size || 120;
  const wide = !!(shape && shape.wide) || !!badge;
  const armL = badge ? [26, 80, 14, 88, 12, 98] : [34, 84, 22, 90, 17, 99];
  const armR = badge ? [94, 80, 106, 66, 108, 52] : [86, 84, 100, 72, 105, 60];
  let bodyMarkup, face1, fx, fy, fs = 1;
  if(badge){ bodyMarkup = badgeBody(id, P, badge); fx = 60; fy = 62; fs = 1.1; }
  else {
    bodyMarkup = strokedBody(id, P, shape); fx = shape.face[0]; fy = shape.face[1]; fs = shape.blobFace ? .85 : (shape.sw < 13 ? .88 : 1.0);
  }
  const body = `${defs(id, P)}${limbs(P, { id, wide, armL, armR })}${bodyMarkup}${face(fx, fy, fs)}`;
  const label = esc(opts.label || glyph);
  if(opts.inner) return body;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" width="${size}" height="${Math.round(size * 1.25)}" role="img" aria-label="${label}" style="overflow:visible">${body}</svg>`;
}

window.NM_JELLY = { svg, has, glyphs, BODY, BADGE };
})();
