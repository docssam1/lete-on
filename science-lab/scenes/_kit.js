// 공용 3D 키트 — 모든 장면이 같은 재질·라벨·차트 도구를 쓴다.
// 좌표는 항상 "모델"에서 계산하고(높이·비율), 눈대중 숫자는 두지 않는다.
import * as THREE from '../../world-explorer/vendor/three.module.js';

export const PALETTE = {
  ink: 0x1f2a37, paper: 0xf7f2e8, board: 0xe9e2d3,
  water: 0x7fb3d5, glass: 0xd9e8f2, wood: 0xb08b5a, metal: 0xb9c2cc,
  soil: 0x7a5a3a, leaf: 0x5aa86a, seed: 0xc99a5b, warm: 0xe0743a,
  cold: 0x6aa6d8, accent: 0x2f7d6d, accent2: 0xd9a441, red: 0xc94f4f,
  gray: 0x9aa3ad, black: 0x2b2b2b, white: 0xfafafa, orange: 0xf29b3a,
};

export const ease = {
  io: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  lin: (t) => t,
};
export const clamp01 = (t) => Math.max(0, Math.min(1, t));
export const lerp = (a, b, t) => a + (b - a) * t;
// 구간 [a,b] 안에서의 진행률(0~1)
export const seg = (t, a, b) => clamp01((t - a) / (b - a));

export function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color, roughness: opts.roughness ?? 0.75, metalness: opts.metalness ?? 0.05,
    transparent: !!opts.opacity && opts.opacity < 1, opacity: opts.opacity ?? 1,
    side: opts.side ?? THREE.FrontSide, emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
  });
}
export function glassMat(color = PALETTE.glass, opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color, roughness: 0.15, metalness: 0, transparent: true, opacity,
    transmission: 0, side: THREE.DoubleSide, depthWrite: false,
  });
}

// 모서리가 둥근 상자(three.js 예제 RoundedBoxGeometry와 같은 방식: 가운데 칸을 평면으로 늘리고 바깥 칸을 둥글게 편다).
// 공유하면 호출하는 쪽의 geometry.translate()가 서로 번지므로 매번 새로 만든다.
export function roundedBoxGeometry(w, h, d, r, seg = 3) {
  r = Math.max(0, Math.min(r, w / 2, h / 2, d / 2));
  if (r < 1e-4) return new THREE.BoxGeometry(w, h, d);
  const s = seg * 2 + 1, geo = new THREE.BoxGeometry(1, 1, 1, s, s, s).toNonIndexed();
  const pos = geo.attributes.position, nor = geo.attributes.normal, half = 0.5 / s;
  const inner = new THREE.Vector3(w / 2 - r, h / 2 - r, d / 2 - r), p = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    n.set(p.x - Math.sign(p.x) * half, p.y - Math.sign(p.y) * half, p.z - Math.sign(p.z) * half).normalize();
    pos.setXYZ(i, inner.x * Math.sign(p.x) + n.x * r, inner.y * Math.sign(p.y) + n.y * r, inner.z * Math.sign(p.z) + n.z * r);
    nor.setXYZ(i, n.x, n.y, n.z);
  }
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  return geo;
}
export function box(w, h, d, color, opts = {}) {
  const r = opts.radius ?? Math.min(0.08, Math.min(w, h, d) * 0.22);
  const m = new THREE.Mesh(roundedBoxGeometry(w, h, d, r), mat(color, opts));
  m.castShadow = true; m.receiveShadow = true; return m;
}
export function cylinder(rTop, rBot, h, color, opts = {}) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, opts.seg ?? 48, 1, !!opts.open), mat(color, opts));
  m.castShadow = true; m.receiveShadow = true; return m;
}
export function sphere(r, color, opts = {}) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, opts.seg ?? 36, opts.seg ? Math.round(opts.seg * 0.7) : 26), mat(color, opts));
  m.castShadow = true; return m;
}
export function plane(w, h, color, opts = {}) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat(color, { side: THREE.DoubleSide, ...opts }));
  m.receiveShadow = true; return m;
}
// 유리 비커/시험관: 옆면 + 바닥, 속에 물기둥을 따로 넣는다.
export function vessel(r, h, opts = {}) {
  const g = new THREE.Group();
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(r, r * (opts.taper ?? 1), h, 40, 1, true), glassMat(opts.color, opts.opacity ?? 0.3));
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(r * (opts.taper ?? 1), 40), glassMat(opts.color, 0.45));
  bottom.rotation.x = -Math.PI / 2; bottom.position.y = -h / 2;
  g.add(wall, bottom);
  return g;
}
// 물기둥: fill(0~1)로 높이를 바꾼다. 원점을 바닥에 둔다.
export function liquid(r, hMax, color = PALETTE.water, opacity = 0.75) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 36), mat(color, { opacity, roughness: 0.3 }));
  m.geometry.translate(0, 0.5, 0);
  m.scale.y = hMax * 0.001; m.userData.hMax = hMax;
  m.setFill = (f) => { m.scale.y = Math.max(0.001, hMax * clamp01(f)); return m; };
  return m;
}

// 라벨 스프라이트 — 손글씨(Gaegu) 종이 꼬리표. size는 월드 단위 높이.
// 화면에서는 fitLabels()가 매 프레임 "최소 글자 높이(px)"를 보장한다(멀거나 화면이 작아도 읽히게).
// 글꼴이 늦게 오면(구글 폰트는 한글을 조각으로 나눠 보낸다) 그 글자 조각이 도착한 뒤 같은 텍스처에 다시 그린다.
const LABEL_FONT = (fs) => `700 ${fs}px "Gaegu", "Jua", "Pretendard", "Apple SD Gothic Neo", sans-serif`;
const PAPER = '#FFF8E6', INK = '#1B2A4E';
if (typeof document !== 'undefined' && !document.querySelector('link[href*="family=Gaegu"]')) {
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@700&display=swap'; document.head.appendChild(l);
}
const _labelCache = new Map();
function drawTag(text, color, bg) {
  const c = document.createElement('canvas'); const ctx = c.getContext('2d');
  const fs = 64, font = LABEL_FONT(fs), S = 3; ctx.font = font;
  const pad = 26, sh = 7, w = Math.ceil(ctx.measureText(text).width) + pad * 2 + sh + 10, h = fs + 26 + sh;
  c.width = w * S; c.height = h * S; ctx.scale(S, S); ctx.font = font;
  // 글자마다 같은 떨림이 나오게 글에서 씨앗을 뽑는다(다시 그려도 모양이 같다).
  let seed = 7; for (const ch of text) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296 - 0.5);
  const W = w - sh, H = h - sh, r = 16;
  const wobble = (ox, oy, amp) => {                       // 손으로 그은 듯 살짝 떨리는 둥근 사각형
    const pts = [], seg = (x0, y0, x1, y1) => { const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 22)); for (let i = 0; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + rnd() * amp, y0 + (y1 - y0) * t + rnd() * amp]); } };
    const arc = (cx, cy, a0) => { for (let i = 0; i < 4; i++) { const a = a0 + (i / 4) * Math.PI / 2; pts.push([cx + Math.cos(a) * r + rnd() * amp * 0.6, cy + Math.sin(a) * r + rnd() * amp * 0.6]); } };
    const L = ox + 2, T = oy + 2, R = ox + W - 2, B = oy + H - 2;
    seg(L + r, T, R - r, T); arc(R - r, T + r, -Math.PI / 2); seg(R, T + r, R, B - r); arc(R - r, B - r, 0);
    seg(R - r, B, L + r, B); arc(L + r, B - r, Math.PI / 2); seg(L, B - r, L, T + r); arc(L + r, T + r, Math.PI);
    ctx.beginPath(); pts.forEach(([x, y], i) => { if (!i) ctx.moveTo(x, y); else { const [px, py] = pts[i - 1]; ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); } }); ctx.closePath();
  };
  ctx.fillStyle = 'rgba(27,42,78,0.22)'; wobble(sh * 0.6, sh, 0.8); ctx.fill();          // 그림자(아래로 살짝)
  ctx.fillStyle = bg; wobble(0, 0, 0.8); ctx.fill();
  if (bg === PAPER) {                                                                       // 종이 결: 옅은 줄 두 개
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(214,170,90,0.18)'; ctx.lineWidth = 2;
    for (const yy of [H * 0.78]) { ctx.beginPath(); ctx.moveTo(8, yy); ctx.lineTo(W - 8, yy); ctx.stroke(); } ctx.restore();
  }
  ctx.lineJoin = 'round'; ctx.lineWidth = 3; ctx.strokeStyle = color === '#fff' || color === '#ffffff' ? 'rgba(255,255,255,0.75)' : 'rgba(27,42,78,0.7)';
  wobble(0, 0, 1.6); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.globalAlpha = 0.35; wobble(0, 0, 2.2); ctx.stroke(); ctx.globalAlpha = 1;   // 연필로 한 번 더 그은 선
  ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, pad + 5, H / 2 + 4);
  return { c, w, h };
}
export function label(text, opts = {}) {
  const size = opts.size ?? 0.42, color = opts.color ?? INK;
  const bg = opts.bg == null || /^rgba\(255,\s*255,\s*255/.test(opts.bg) ? PAPER : opts.bg;
  const key = `${text}|${color}|${bg}`;
  let tex = _labelCache.get(key);
  if (!tex) {
    const { c, w, h } = drawTag(text, color, bg);
    tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    tex.userData = { w, h }; _labelCache.set(key, tex);
    const f = LABEL_FONT(64);
    if (document.fonts && !document.fonts.check(f, text)) document.fonts.load(f, text).then(() => {
      if (!document.fonts.check(f, text)) return;
      const d = drawTag(text, color, bg); tex.image = d.c; tex.userData = { w: d.w, h: d.h }; tex.dispose(); tex.needsUpdate = true;
    }).catch(() => {});
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
  const { w, h } = tex.userData; s.scale.set(size * w / h, size, 1); s.renderOrder = 10;
  s.userData.isLabel = true; s.userData.base = s.scale.clone(); return s;
}
// 라벨 글자가 화면에서 minPx 보다 작거나 maxPx 보다 크지 않게 크기를 맞춘다(카메라 거리·화면 높이 기준).
// viewW를 주면 라벨이 화면 밖으로 잘리지 않게 폭을 줄이고, 가장자리에 걸리면 기준점(center)을 옮겨 안으로 밀어 넣는다.
const _lp = new THREE.Vector3(), _ps = new THREE.Vector3();
export function fitLabels(root, camera, viewH, minPx = 20, maxPx = 34, viewW = 0) {
  if (!viewH) return;
  const k = 2 * Math.tan((camera.fov * Math.PI) / 360) / viewH, M = 8;   // M: 화면 가장자리 여백(px)
  root.traverseVisible((o) => {
    if (!o.isSprite || !o.userData.isLabel || !o.userData.base) return;
    const u = o.material.map?.userData; if (u?.w) o.userData.base.x = o.userData.base.y * u.w / u.h;   // 글꼴 도착 뒤 다시 그린 폭
    o.getWorldPosition(_lp); const perPx = _lp.distanceTo(camera.position) * k;   // 1px 당 월드 길이
    o.parent?.getWorldScale(_ps); const ps = _ps.y || 1;
    const px = (o.userData.base.y * ps) / perPx; let f = Math.max(minPx, Math.min(maxPx, px)) / px;
    if (!viewW) { o.scale.set(o.userData.base.x * f, o.userData.base.y * f, 1); return; }
    let wPx = (o.userData.base.x * ps * f) / perPx;
    if (wPx > viewW - 2 * M) { f *= (viewW - 2 * M) / wPx; wPx = viewW - 2 * M; }
    o.scale.set(o.userData.base.x * f, o.userData.base.y * f, 1);
    _lp.project(camera); let cx = 0.5;
    if (_lp.z < 1) {
      const x = (_lp.x + 1) / 2 * viewW;                                   // 화면 x(px)
      if (x + wPx / 2 > viewW - M) cx = 1 - (viewW - M - x) / wPx;
      else if (x - wPx / 2 < M) cx = (x - M) / wPx;
    }
    o.center.x = Math.max(0, Math.min(1, cx));
  });
}

// 화살표: from→to. 굵기는 월드 단위.
export function arrow(from, to, color = PALETTE.accent, radius = 0.04) {
  const f = new THREE.Vector3(...from), t = new THREE.Vector3(...to);
  const dir = t.clone().sub(f), len = dir.length(); dir.normalize();
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, Math.max(0.01, len - radius * 5), 12), mat(color, { emissive: color, emissiveIntensity: 0.25 }));
  shaft.position.y = (len - radius * 5) / 2;
  const head = new THREE.Mesh(new THREE.ConeGeometry(radius * 2.6, radius * 5, 16), mat(color, { emissive: color, emissiveIntensity: 0.25 }));
  head.position.y = len - radius * 2.5;
  g.add(shaft, head);
  g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  g.position.copy(f);
  g.setLength = (L) => { shaft.scale.y = Math.max(0.01, (L - radius * 5)) / Math.max(0.01, len - radius * 5); shaft.position.y = (L - radius * 5) / 2; head.position.y = L - radius * 2.5; };
  return g;
}

// 막대 차트: values는 0~1 정규화, labels는 한글. grow(p)로 자라게 한다.
export function barChart(items, opts = {}) {
  const g = new THREE.Group(); const w = opts.barWidth ?? 0.5, gap = opts.gap ?? 0.35, hMax = opts.height ?? 2.2;
  const total = items.length * w + (items.length - 1) * gap; const bars = [];
  items.forEach((it, i) => {
    const x = -total / 2 + w / 2 + i * (w + gap);
    const b = box(w, 1, w, it.color ?? PALETTE.accent); b.geometry.translate(0, 0.5, 0);
    b.position.set(x, 0, 0); b.scale.y = 0.001; b.userData.h = hMax * it.value; bars.push(b); g.add(b);
    const l = label(it.label, { size: opts.labelSize ?? 0.3 }); l.position.set(x, -0.35, 0.3); g.add(l);
    if (it.text) { const v = label(it.text, { size: 0.26, bg: 'rgba(255,255,255,0.7)' }); v.position.set(x, hMax * it.value + 0.35, 0.3); v.userData.top = true; v.visible = false; b.userData.valueLabel = v; g.add(v); }
  });
  const base = box(total + gap, 0.06, w + 0.4, PALETTE.gray); base.position.y = -0.03; g.add(base);
  g.grow = (p, which) => bars.forEach((b, i) => { if (which != null && i !== which) return; b.scale.y = Math.max(0.001, b.userData.h * ease.out(p)); if (b.userData.valueLabel) b.userData.valueLabel.visible = p > 0.95; });
  g.bars = bars; return g;
}

// 입자 무리: n개의 작은 구를 한 그룹에. jitter(t)로 흔들고, spread로 퍼뜨린다.
export function particles(n, r, color, region = { x: 1, y: 1, z: 1 }, opts = {}) {
  const g = new THREE.Group(); const geo = new THREE.SphereGeometry(r, 10, 8); const m = mat(color, { emissive: color, emissiveIntensity: opts.glow ?? 0.15 });
  for (let i = 0; i < n; i++) {
    const s = new THREE.Mesh(geo, m);
    s.userData.base = new THREE.Vector3((Math.random() - 0.5) * region.x, (Math.random() - 0.5) * region.y, (Math.random() - 0.5) * region.z);
    s.userData.phase = Math.random() * Math.PI * 2; s.position.copy(s.userData.base); g.add(s);
  }
  g.jitter = (time, amp = 0.05, speed = 3) => g.children.forEach((s) => { const b = s.userData.base, p = s.userData.phase; s.position.set(b.x + Math.sin(time * speed + p) * amp, b.y + Math.cos(time * speed * 0.9 + p) * amp, b.z + Math.sin(time * speed * 1.1 + p * 2) * amp); });
  return g;
}

// 온도색: 0(차가움)→1(뜨거움)
export function heatColor(t) { return new THREE.Color(PALETTE.cold).lerp(new THREE.Color(PALETTE.warm), clamp01(t)); }

// 좌표 헬퍼
export const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
export { THREE };

// 라벨 글자 바꾸기 — 스프라이트를 새로 만들지 않고 캐시된 텍스처만 교체한다(매 프레임 호출해도 안전).
export function relabel(sprite, text, opts = {}) {
  if (!sprite || !sprite.userData || !sprite.userData.isLabel) return sprite;
  if (sprite.userData.text === text) return sprite;
  const fresh = label(text, opts); sprite.material.map = fresh.material.map; sprite.scale.copy(fresh.scale); sprite.userData.base = fresh.userData.base; sprite.userData.text = text;
  fresh.material.dispose(); return sprite;
}
