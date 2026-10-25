// 연필 그림 SVG 도구 — 예시 보고서의 「관찰그림」을 아이가 연필로 그린 것처럼 만든다(원장 2026-10-25: 보고서 예시에 그림이 있어야 한다).
// 흑연 선(두세 번 겹쳐 긋기 + 손 떨림 필터) · 빗금 명암 · 확대 원 · 지시선과 손글씨 이름표(Gaegu) · 수면선. 모두 원본 도형이라 저작권 문제 없다.
// 사용: pencilSvg(w, h, (d) => [...조각 문자열], { seed }) → <svg> 문자열. d에 그리기 도우미가 들어 있다.
import { STROKES } from './sketch-strokes.js';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let uid = 0;
// 글자 폭 어림(한글 ≈ 0.95em, 그 밖 ≈ 0.55em) — 이름표가 그림 밖으로 나가지 않게 자리 잡는 데 쓴다
const textW = (t, size) => [...String(t)].reduce((a, ch) => a + (/[\u3131-\uD79D]/.test(ch) ? 0.95 : /[A-Z0-9①-⑩]/.test(ch) ? 0.7 : 0.5) * size, 0);
const SKETCH = (key, layer) => `./assets/observe/sketch/${key}-${layer}.webp`;
export function pencilSvg(w, h, draw, { seed = 3, grain = true, cls = 'pz' } = {}) {
  const id = `pz${++uid}`, under = [];
  const d = {
    // 연필 스케치(3D 표본을 흰 종이에 렌더해 선·명암 두 겹으로 만든 그림, tools/sketch/). 손이 선의 뼈대를 따라 그어 가며 선이 드러나고,
    // 이어서 연필을 눕혀 칠하듯 명암이 드러난다. 드러내는 획은 마스크 안의 .dz 선이라 손이 그 길을 그대로 따라간다(SVG 좌표로 바꿔 둠).
    // 돌려주는 값: { x, y, s, h, at(px, py) } — at은 원본 그림 픽셀 → SVG 좌표(이름표 자리 잡기용).
    drawing: (key, x, y, dw) => {
      const k = STROKES[key], s = dw / k.w, P = (a) => { let t = ''; for (let i = 0; i < a.length; i += 2) t += `${i ? ' L' : 'M'}${(x + a[i] * s).toFixed(1)} ${(y + a[i + 1] * s).toFixed(1)}`; return t; };
      const g = (paths, sw, close) => `<g class="dz" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="${(sw * s).toFixed(1)}"><path d="${paths.map((a) => P(a) + (close ? ' Z' : '')).join(' ')}"/></g>`;
      const u = ++uid, mk = (n, body) => `<mask id="${id}-${n}${u}" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}">${body}</mask>`;
      const img = (layer, m) => `<image href="${SKETCH(key, layer)}" x="${x}" y="${y}" width="${dw}" height="${(k.h * s).toFixed(1)}" mask="url(#${id}-${m}${u})" preserveAspectRatio="none"/>`;
      under.push(`<defs>${mk('l', k.main.map((a) => g([a], k.lw, true)).join('') + k.more.map((c) => g(c, k.lw, true)).join(''))}${mk('t', k.shade.map((a) => g([a], k.sw, false)).join(''))}</defs>${img('tone', 't')}${img('line', 'l')}`);
      return { x, y, s, h: k.h * s, at: (px, py) => [+(x + px * s).toFixed(1), +(y + py * s).toFixed(1)] };
    },
    // 확대 원 안에 같은 스케치를 크게(zoom배) — (fx, fy)는 확대할 자리(SVG 좌표)
    loupe: (dr, key, cx, cy, r, fx, fy, zoom) => {
      const k = STROKES[key], s = dr.s * zoom, ix = cx - (fx - dr.x) * zoom, iy = cy - (fy - dr.y) * zoom, W = k.w * s, H = k.h * s;
      return d.magnifier(cx, cy, r, `<g class="dz-f"><image href="${SKETCH(key, 'tone')}" x="${ix.toFixed(1)}" y="${iy.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" preserveAspectRatio="none"/><image href="${SKETCH(key, 'line')}" x="${ix.toFixed(1)}" y="${iy.toFixed(1)}" width="${W.toFixed(1)}" height="${H.toFixed(1)}" preserveAspectRatio="none"/></g>`, [fx, fy, Math.max(5, r / zoom)]);
    },
    // 흑연 선: 진한 선 + 살짝 어긋난 연한 선 두 번 → 연필 결
    line: (path, { w: sw = 1.3, dark = 0.85, dash = '' } = {}) => `<g class="dz" fill="none" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}><path d="${path}" stroke="#2f2f2f" stroke-width="${sw}" opacity="${dark}"/><path d="${path}" stroke="#555" stroke-width="${sw * 0.7}" opacity="0.32" transform="translate(0.7,-0.5)"/><path d="${path}" stroke="#777" stroke-width="${sw * 0.5}" opacity="0.18" transform="translate(-0.5,0.6)"/></g>`,
    // 연한 밑선(스케치선)
    sketch: (path, sw = 0.8) => `<g class="dz"><path d="${path}" fill="none" stroke="#6a6a6a" stroke-width="${sw}" opacity="0.35" stroke-linecap="round"/></g>`,
    // 빗금 명암: 1 = 가는 빗금, 2 = 교차 빗금(진함)
    hatch: (path, level = 1) => `<path class="dz-f" d="${path}" fill="url(#${id}-h${level})" stroke="none"/>`,
    // 밝은 톤(연필을 눕혀 문지른 것)
    tone: (path, o = 0.12) => `<path class="dz-f" d="${path}" fill="#3a3a3a" opacity="${o}" stroke="none"/>`,
    // 지시선 + 손글씨 이름표. anchor: 'start'|'end'
    label: (x1, y1, x2, y2, text, { anchor = 'start', size = 13 } = {}) => { const tw = textW(text, size); if (anchor === 'start' && x2 + 3 + tw > w - 4) x2 = Math.max(4, w - 4 - tw - 3); if (anchor === 'end' && x2 - 3 - tw < 4) x2 = tw + 7; return `<g class="dz"><path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#333" stroke-width="0.8" opacity="0.8"/></g><circle class="dz-f" cx="${x1}" cy="${y1}" r="1.4" fill="#333" opacity="0.8"/><text class="dz-t" x="${x2 + (anchor === 'start' ? 3 : -3)}" y="${y2 + 4}" font-family="Gaegu, Pretendard, sans-serif" font-size="${size}" font-weight="700" fill="#2b2b2b" text-anchor="${anchor}">${esc(text)}</text>`; },
    text: (x, y, text, { size = 13, anchor = 'start', dim = false } = {}) => { const tw = textW(text, size); if (anchor === 'middle') x = Math.max(tw / 2 + 4, Math.min(w - 4 - tw / 2, x)); else if (anchor === 'start') x = Math.min(x, w - 4 - tw); else x = Math.max(x, tw + 4); return `<text class="dz-t" x="${x}" y="${y}" font-family="Gaegu, Pretendard, sans-serif" font-size="${size}" font-weight="700" fill="${dim ? '#666' : '#2b2b2b'}" text-anchor="${anchor}">${esc(text)}</text>`; },
    // 확대 원: 안쪽 그림을 원으로 자르고 테두리를 두 번 긋는다. from = 확대한 자리(점선으로 잇는다)
    magnifier: (cx, cy, r, inner, from) => `${from ? `<g class="dz"><circle cx="${from[0]}" cy="${from[1]}" r="${from[2] || 6}" fill="none" stroke="#444" stroke-width="0.8" stroke-dasharray="2 2"/><path d="M${from[0]} ${from[1]} L${cx - r * 0.7} ${cy + r * 0.7}" stroke="#444" stroke-width="0.8" stroke-dasharray="3 3" fill="none"/></g>` : ''}<g class="dz"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#2f2f2f" stroke-width="1.6" opacity="0.9"/><circle cx="${cx + 0.8}" cy="${cy - 0.6}" r="${r}" fill="none" stroke="#777" stroke-width="0.8" opacity="0.3"/></g><clipPath id="${id}-c${++uid}"><circle cx="${cx}" cy="${cy}" r="${r - 1}"/></clipPath><g clip-path="url(#${id}-c${uid})">${inner}</g>`,
    // 수면선·지면선
    waterline: (y, x1 = 8, x2 = w - 8, text = '[수면]') => `<g class="dz"><path d="M${x1} ${y} L${x2} ${y}" stroke="#2f2f2f" stroke-width="1" stroke-dasharray="7 4" fill="none" opacity="0.8"/></g><text class="dz-t" x="${x1 + 2}" y="${y - 4}" font-family="Gaegu, Pretendard, sans-serif" font-size="12" font-weight="700" fill="#2b2b2b">${esc(text)}</text>`,
    // 화살표(움직임 표시)
    arrow: (x1, y1, x2, y2) => `<g class="dz"><path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="#2f2f2f" stroke-width="1.1" marker-end="url(#${id}-ar)" opacity="0.85"/></g>`,
    // 자(cm 눈금) — 길이 비교용
    ruler: (x, y, len, cm) => { let t = '', tx = ''; for (let i = 0; i <= cm * 2; i++) { const px = x + (i / (cm * 2)) * len, hh = i % 2 ? 4 : 7; t += ` M${px} ${y} L${px} ${y + hh}`; if (i % 2 === 0) tx += `<text class="dz-t" x="${px}" y="${y + 17}" font-family="Gaegu, Pretendard, sans-serif" font-size="9" text-anchor="middle" fill="#333">${i / 2}</text>`; } return `<g class="dz"><path d="M${x} ${y} L${x + len} ${y}${t}" stroke="#333" stroke-width="0.9" fill="none"/></g>${tx}<text class="dz-t" x="${x + len + 4}" y="${y + 8}" font-family="Gaegu, Pretendard, sans-serif" font-size="9" fill="#333">cm</text>`; },
    w, h,
  };
  const body = draw(d).join('');
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">
  <defs>
    <filter id="${id}-wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="${id}-paper"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 1}"/><feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.08 0"/></filter>
    <pattern id="${id}-h1" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(38)"><path d="M0 0 L0 5" stroke="#444" stroke-width="0.7" opacity="0.55"/></pattern>
    <pattern id="${id}-h2" patternUnits="userSpaceOnUse" width="4.5" height="4.5" patternTransform="rotate(38)"><path d="M0 0 L0 4.5 M0 2.2 L4.5 2.2" stroke="#333" stroke-width="0.7" opacity="0.65"/></pattern>
    <marker id="${id}-ar" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 L6 3.5 L0 7 Z" fill="#2f2f2f"/></marker>
  </defs>
  <rect width="${w}" height="${h}" fill="#fffdf8"/>${grain ? `<rect width="${w}" height="${h}" filter="url(#${id}-paper)"/>` : ''}
  ${under.join('')}<g filter="url(#${id}-wob)">${body}</g>
</svg>`;
}
// 자주 쓰는 도형 경로
export const shapes = {
  ellipse: (cx, cy, rx, ry) => `M${cx - rx} ${cy} a${rx} ${ry} 0 1 0 ${rx * 2} 0 a${rx} ${ry} 0 1 0 ${-rx * 2} 0`,
  // 잎몸(아래 = 잎자루 끝). tip 쪽 뾰족함 k
  leaf: (x, y, w, h, k = 0.9) => `M${x} ${y} C${x + w * 0.9} ${y - h * 0.25}, ${x + w * 0.75} ${y - h * 0.85}, ${x} ${y - h * k - h * (1 - k)} C${x - w * 0.75} ${y - h * 0.85}, ${x - w * 0.9} ${y - h * 0.25}, ${x} ${y}`,
  // 톱니 잎몸
  serrateLeaf: (x, y, w, h, n = 12) => { let L = `M${x} ${y}`, R = ''; for (let i = 1; i <= n; i++) { const t = i / n, ww = w * Math.sin(Math.PI * Math.min(1, t * 1.05)) ** 0.85, yy = y - t * h; L += ` L${x + ww} ${yy + h / n * 0.45} L${x + ww * 0.85} ${yy}`; } for (let i = n; i >= 1; i--) { const t = i / n, ww = w * Math.sin(Math.PI * Math.min(1, t * 1.05)) ** 0.85, yy = y - t * h; R += ` L${x - ww * 0.85} ${yy} L${x - ww} ${yy + h / n * 0.45}`; } return `${L} L${x} ${y - h}${R} Z`; },
  // 깃 모양 잎맥(주맥 + 곁맥 n쌍)
  veins: (x, y, h, w, n = 5, up = true) => { let p = `M${x} ${y} L${x} ${y - h}`; for (let i = 1; i <= n; i++) { const t = i / (n + 1), yy = y - t * h, len = w * Math.sin(Math.PI * Math.min(1, t * 1.1)) * 0.8; p += ` M${x} ${yy} Q${x + len * 0.5} ${yy - h * 0.04} ${x + len} ${yy - h * 0.08} M${x} ${yy} Q${x - len * 0.5} ${yy - h * 0.04} ${x - len} ${yy - h * 0.08}`; } return p; },
};
