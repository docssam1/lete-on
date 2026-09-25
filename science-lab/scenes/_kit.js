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

// 라벨 스프라이트 — 캔버스에 한글을 그려 붙인다. size는 월드 단위 높이.
// 화면에서는 fitLabels()가 매 프레임 "최소 글자 높이(px)"를 보장한다(멀거나 화면이 작아도 읽히게).
const _labelCache = new Map();
export function label(text, opts = {}) {
  const size = opts.size ?? 0.42, color = opts.color ?? '#0f172a', bg = opts.bg ?? 'rgba(255,255,255,0.96)';
  const key = `${text}|${color}|${bg}`;
  let tex = _labelCache.get(key);
  if (!tex) {
    const c = document.createElement('canvas'); const ctx = c.getContext('2d');
    const fs = 56, font = `700 ${fs}px "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`, S = 3;
    ctx.font = font;
    const pad = 26, sh = 8, w = Math.ceil(ctx.measureText(text).width) + pad * 2 + sh, h = fs + 34 + sh;
    c.width = w * S; c.height = h * S; ctx.scale(S, S); ctx.font = font;
    ctx.fillStyle = 'rgba(15,23,42,0.18)'; roundRect(ctx, sh * 0.5, sh, w - sh, h - sh, 18); ctx.fill();          // 그림자
    ctx.fillStyle = bg; roundRect(ctx, 0, 0, w - sh, h - sh, 18); ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(15,23,42,0.22)'; roundRect(ctx, 1.25, 1.25, w - sh - 2.5, h - sh - 2.5, 17); ctx.stroke();
    ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, pad, (h - sh) / 2 + 3);
    tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    tex.userData = { w, h }; _labelCache.set(key, tex);
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
  const { w, h } = tex.userData; s.scale.set(size * w / h, size, 1); s.renderOrder = 10;
  s.userData.isLabel = true; s.userData.base = s.scale.clone(); return s;
}
// 라벨 글자가 화면에서 minPx 보다 작거나 maxPx 보다 크지 않게 크기를 맞춘다(카메라 거리·화면 높이 기준).
const _lp = new THREE.Vector3();
export function fitLabels(root, camera, viewH, minPx = 20, maxPx = 34) {
  if (!viewH) return;
  const k = 2 * Math.tan((camera.fov * Math.PI) / 360) / viewH;
  root.traverseVisible((o) => {
    if (!o.isSprite || !o.userData.isLabel || !o.userData.base) return;
    o.getWorldPosition(_lp); const perPx = _lp.distanceTo(camera.position) * k;   // 1px 당 월드 길이
    const pw = new THREE.Vector3(); o.parent?.getWorldScale(pw); const ps = pw.y || 1;
    const px = (o.userData.base.y * ps) / perPx, want = Math.max(minPx, Math.min(maxPx, px)), f = want / px;
    o.scale.set(o.userData.base.x * f, o.userData.base.y * f, 1);
  });
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
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
