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
// 유리: 굴절(transmission)은 속의 물·입자(반투명)를 가려서 쓰지 않는다. 대신 매끈한 겉면 + 코팅 층으로
// 스튜디오 환경의 창 모양 반사가 또렷이 맺히게 해서 "유리"로 읽히게 한다.
export function glassMat(color = PALETTE.glass, opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color, roughness: 0.04, metalness: 0, transparent: true, opacity, ior: 1.5, specularIntensity: 1,
    clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.35, side: THREE.DoubleSide, depthWrite: false,
  });
}
// 광택 플라스틱·칠(자석·버튼·교구): 반광택 겉칠 한 겹.
export function glossMat(color, opts = {}) {
  return new THREE.MeshPhysicalMaterial({ color, roughness: opts.roughness ?? 0.38, metalness: opts.metalness ?? 0, clearcoat: opts.clearcoat ?? 0.7, clearcoatRoughness: opts.clearcoatRoughness ?? 0.2, emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 1 });
}

// 부드러운 뭉게 입자(연기·김·냉기·화산 가스·불빛): 점마다 크기(월드 단위)·투명도가 다른 점 구름 하나.
// 구 여러 개를 쓰면 가장자리가 딱딱하고 밝은 배경에서 사라지는데, 이것은 가장자리가 흐리게 번진다.
// set(i, x, y, z, size, alpha) 로 채우고 commit(개수) 로 그린다. additive:true 면 빛(불꽃·용암 빛무리)처럼 더해진다.
const PUFF_VS = `attribute float size; attribute float alpha; varying float vA; uniform float uScale;
void main(){ vA = alpha; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }`;
const PUFF_FS = `uniform vec3 uColor; uniform float uOpacity; uniform float uSoft; varying float vA;
void main(){ vec2 c = gl_PointCoord - 0.5; float d = length(c) * 2.0; if (d > 1.0) discard;
  float a = pow(1.0 - smoothstep(0.0, 1.0, d), 1.0 + uSoft * 2.0) * vA * uOpacity;
  gl_FragColor = vec4(uColor, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
export function puffCloud(n, opts = {}) {
  const geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), size = new Float32Array(n), alpha = new Float32Array(n);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('size', new THREE.BufferAttribute(size, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('alpha', new THREE.BufferAttribute(alpha, 1).setUsage(THREE.DynamicDrawUsage));
  geo.setDrawRange(0, 0);
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(opts.color ?? 0xffffff) }, uOpacity: { value: opts.opacity ?? 1 }, uSoft: { value: opts.soft ?? 0.5 }, uScale: { value: 400 } },
    vertexShader: PUFF_VS, fragmentShader: PUFF_FS, transparent: true, depthWrite: false,
    blending: opts.additive ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: !opts.additive,
  });
  const p = new THREE.Points(geo, m); p.frustumCulled = false; p.renderOrder = opts.renderOrder ?? 4;
  const _v = new THREE.Vector2();
  p.onBeforeRender = (renderer, scene, camera) => { renderer.getDrawingBufferSize(_v); m.uniforms.uScale.value = _v.y / (2 * Math.tan((camera.fov * Math.PI) / 360)); };
  p.userData.set = (i, x, y, z, s, a) => { pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; size[i] = s; alpha[i] = a; };
  p.userData.commit = (count) => { geo.setDrawRange(0, count); geo.attributes.position.needsUpdate = geo.attributes.size.needsUpdate = geo.attributes.alpha.needsUpdate = true; };
  p.userData.max = n;
  return p;
}
// 입자 수를 기기 화질에 맞춘다(무대 캔버스의 data-quality: high·mid·low·min).
export const particleBudget = (canvas, n) => { const q = canvas?.dataset?.quality; return Math.max(8, Math.round(n * (q === 'min' ? 0.35 : q === 'low' ? 0.55 : q === 'mid' ? 0.8 : 1))); };

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

// 라벨 스프라이트 — 흰 카드 꼬리표(가는 테두리 · 파란 기운 그림자 · 왼쪽 파랑→보라 점), Pretendard 700. size는 월드 단위 높이.
// 화면에서는 fitLabels()가 매 프레임 "최소 글자 높이(px)"를 보장한다(멀거나 화면이 작아도 읽히게).
// 글꼴이 아직 안 왔으면 도착한 뒤 같은 텍스처에 다시 그린다.
const LABEL_FONT = (fs) => `700 ${fs}px "Pretendard Variable", "Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
const CARD = '#FFFFFF', INK = '#1B2340';
if (typeof document !== 'undefined' && !document.querySelector('link[href*="assets/fonts/fonts.css"]')) {   // 이 킷을 쓰는 어느 페이지든 같은 글꼴이 나오게
  const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = new URL('../assets/fonts/fonts.css', import.meta.url).href; document.head.appendChild(l);
}
const _labelCache = new Map();
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function drawTag(text, color, bg) {
  const c = document.createElement('canvas'); const ctx = c.getContext('2d');
  const fs = 52, font = LABEL_FONT(fs), S = 3; ctx.font = font; if ('letterSpacing' in ctx) ctx.letterSpacing = '-1px';
  const white = bg === CARD, dot = white ? 16 : 0, padL = 24 + (dot ? dot + 14 : 0), padR = 26, blur = 14;
  const tw = Math.ceil(ctx.measureText(text).width), W = tw + padL + padR, H = fs + 30, w = W + blur * 2, h = H + blur * 2 + 6;
  c.width = w * S; c.height = h * S; ctx.scale(S, S); ctx.font = font; if ('letterSpacing' in ctx) ctx.letterSpacing = '-1px';
  const x0 = blur, y0 = blur, r = H / 2 > 22 ? 22 : H / 2;
  ctx.save(); ctx.shadowColor = 'rgba(30,99,200,0.22)'; ctx.shadowBlur = blur; ctx.shadowOffsetY = 5;     // 부드러운 파란 그림자
  ctx.fillStyle = bg; rr(ctx, x0, y0, W, H, r); ctx.fill(); ctx.restore();
  if (white) {
    const g = ctx.createLinearGradient(0, y0, 0, y0 + H); g.addColorStop(0.5, '#FFFFFF'); g.addColorStop(1, '#EAF3FF');   // 흰색→연하늘
    ctx.fillStyle = g; rr(ctx, x0, y0, W, H, r); ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = '#D6E2F5'; rr(ctx, x0 + 1, y0 + 1, W - 2, H - 2, r - 1); ctx.stroke();
    const gd = ctx.createLinearGradient(x0 + 22, y0 + H / 2 - dot / 2, x0 + 22 + dot, y0 + H / 2 + dot / 2); gd.addColorStop(0, '#2196F3'); gd.addColorStop(1, '#7C4DFF');
    ctx.fillStyle = gd; rr(ctx, x0 + 22, y0 + H / 2 - dot / 2, dot, dot, 5); ctx.fill();                 // 질문 카드 배지 같은 작은 점
  } else { ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; rr(ctx, x0 + 1, y0 + 1, W - 2, H - 2, r - 1); ctx.stroke(); }
  ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, x0 + padL, y0 + H / 2 + 2);
  return { c, w, h, H };
}
export function label(text, opts = {}) {
  const size = opts.size ?? 0.42, color = opts.color ?? INK;
  const bg = opts.bg == null || /^rgba\(255,\s*255,\s*255/.test(opts.bg) ? CARD : opts.bg;
  const key = `${text}|${color}|${bg}`;
  let tex = _labelCache.get(key);
  if (!tex) {
    const { c, w, h, H } = drawTag(text, color, bg);
    tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    tex.userData = { w, h, H }; _labelCache.set(key, tex);
    const f = LABEL_FONT(52);
    if (document.fonts && !document.fonts.check(f, text)) document.fonts.load(f, text).then(() => {
      if (!document.fonts.check(f, text)) return;
      const d = drawTag(text, color, bg); tex.image = d.c; tex.userData = { w: d.w, h: d.h, H: d.H }; tex.dispose(); tex.needsUpdate = true;
    }).catch(() => {});
  }
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
  const { w, h, H } = tex.userData, k = H ? h / H : 1; s.scale.set(size * k * w / h, size * k, 1); s.renderOrder = 10;   // size = 카드 높이(그림자 여백 제외)
  s.userData.isLabel = true; s.userData.base = s.scale.clone(); return s;
}
// 라벨 글자가 화면에서 minPx 보다 작거나 maxPx 보다 크지 않게 크기를 맞춘다(카메라 거리·화면 높이 기준).
// viewW를 주면 라벨이 화면 밖으로 잘리지 않게 폭을 줄이고, 가장자리에 걸리면 기준점(center)을 옮겨 안으로 밀어 넣는다.
const _lp = new THREE.Vector3(), _ps = new THREE.Vector3(), _pv = new THREE.Vector3();
export function fitLabels(root, camera, viewH, minPx = 20, maxPx = 34, viewW = 0) {
  if (!viewH) return;
  const k = 2 * Math.tan((camera.fov * Math.PI) / 360) / viewH, M = 8;   // M: 화면 가장자리 여백(px)
  camera.updateMatrixWorld();
  root.traverseVisible((o) => {
    if (!o.isSprite || !o.userData.isLabel || !o.userData.base) return;
    const u = o.material.map?.userData; if (u?.w) o.userData.base.x = o.userData.base.y * u.w / u.h;   // 글꼴 도착 뒤 다시 그린 폭
    o.getWorldPosition(_lp); _pv.copy(_lp).applyMatrix4(camera.matrixWorldInverse);
    const perPx = Math.max(0.01, -_pv.z) * k;   // 1px 당 월드 길이 — 거리 말고 시선 방향 깊이로(화면 옆쪽 라벨이 더 크게 보이는 것까지)
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
