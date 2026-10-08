// 실험 유리 기구 공용 키트 — 두꺼운 유리병·액체(프레넬)·나뭇결 실험대·받침·시약병.
// 떠오르는 태양(s51-u03)에서 만든 것을 단원마다 같이 쓴다(같은 실험실 안의 같은 기구로 보이게).
import { THREE, roundedBoxGeometry } from './_kit.js';

// ── 재질 ──────────────────────────────────────────────────────────────
// 가장자리일수록 진하게(프레넬): 유리·액체는 정면에서는 거의 투명하고 옆면(비스듬히 보이는 곳)에서 두께가 보인다.
// 굴절(transmission)은 속의 덩어리를 흐리게 가려서 쓰지 않고, 투명도와 테두리 짙기로 "두꺼운 유리·액체"를 읽히게 한다.
export function fresnel(m, { edge = 0.5, pow = 2.2, rim = null, core = null } = {}) {
  m.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', `
      float frn = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), ${pow.toFixed(2)});
      diffuseColor.a = clamp(mix(diffuseColor.a, ${edge.toFixed(3)}, frn), 0.0, 1.0);
      ${rim ? `outgoingLight = mix(outgoingLight * ${core || 'vec3(1.0)'}, outgoingLight * ${rim}, frn);` : ''}
      #include <opaque_fragment>`);
  };
  m.customProgramCacheKey = () => `frn-${edge}-${pow}-${rim}-${core}`;
  return m;
}
export const thickGlass = (tint = 0xeef6f8, a = 0.07) => fresnel(new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.03, metalness: 0, transparent: true, opacity: a, ior: 1.5,
  clearcoat: 1, clearcoatRoughness: 0.02, specularIntensity: 1, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false }), { edge: 0.62, pow: 2.6 });
// 맑은 액체(에탄올): 정면 투명, 옆으로 갈수록 옅은 은빛
export const liquidMat = () => fresnel(new THREE.MeshPhysicalMaterial({ color: 0xf2f7f6, roughness: 0.02, transparent: true, opacity: 0.08, ior: 1.36, clearcoat: 1, clearcoatRoughness: 0.02,
  envMapIntensity: 1.2, side: THREE.DoubleSide, depthWrite: false }), { edge: 0.42, pow: 2.0 });
// 실험대 나뭇결
export function woodTexture() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d'), im = g.createImageData(1024, 512);
  for (let y = 0; y < 512; y++) for (let x = 0; x < 1024; x++) {
    const w = Math.sin((y + Math.sin(x / 90) * 14 + Math.sin(x / 23 + y / 40) * 3) / 5.5) * 0.5 + 0.5, n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
    const k = 0.86 + w * 0.1 + (n - 0.5) * 0.03, o = (y * 1024 + x) * 4; im.data[o] = 214 * k; im.data[o + 1] = 186 * k; im.data[o + 2] = 150 * k; im.data[o + 3] = 255;
  }
  g.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
// 시약병 이름표
export function labelTexture(main, sub, color) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#fbfaf4'; g.fillRect(0, 0, 512, 256); g.fillStyle = color; g.fillRect(0, 0, 512, 34); g.fillRect(0, 222, 512, 34);
  g.fillStyle = '#1f2a44'; g.textAlign = 'center'; g.font = '900 92px Pretendard, sans-serif'; g.fillText(main, 256, 132); g.font = '700 44px Pretendard, sans-serif'; g.fillStyle = '#5b6577'; g.fillText(sub, 256, 192);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
export const lathe = (pts, seg = 72) => { const geo = new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg); geo.computeVertexNormals(); return geo; };
export const round = (pts, k = 6) => {        // 꺾인 점들을 살짝 둥글린 선으로
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], a = pts[i - 1], b = pts[i + 1];
    if (!a || !b || !p[2]) { out.push(p.slice(0, 2)); continue; }
    const r = p[2], da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const p0 = [p[0] + (a[0] - p[0]) * r / da, p[1] + (a[1] - p[1]) * r / da], p1 = [p[0] + (b[0] - p[0]) * r / db, p[1] + (b[1] - p[1]) * r / db];
    for (let j = 0; j <= k; j++) { const t = j / k, u = 1 - t; out.push([u * u * p0[0] + 2 * u * t * p[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * p[1] + t * t * p1[1]]); }
  }
  return out;
};
// 시약병(배경 소품): 갈색 유리 몸통 + 어깨 + 목 + 검은 뚜껑 + 이름표
export function reagentBottle(main, sub, glass, cap, band) {
  const b = new THREE.Group(), r = 0.36, h = 1.05;
  const body = new THREE.Mesh(lathe(round([[0, 0], [r, 0, 0.06], [r, h, 0.12], [0.13, h + 0.24, 0.05], [0.13, h + 0.36], [0, h + 0.36]])), new THREE.MeshPhysicalMaterial({ color: glass, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.96, envMapIntensity: 1.1 }));
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 32), new THREE.MeshPhysicalMaterial({ color: cap, roughness: 0.45, clearcoat: 0.4 })); lid.position.y = h + 0.44;
  const tag = new THREE.Mesh(new THREE.CylinderGeometry(r + 0.004, r + 0.004, 0.46, 48, 1, true, -0.95, 1.9), new THREE.MeshStandardMaterial({ map: labelTexture(main, sub, band), roughness: 0.8 })); tag.position.y = 0.5;
  b.add(body, lid, tag); b.traverse((o) => { o.userData.noFrame = true; }); return b;
}


// 실험대(나뭇결, 맞춤에서 뺀다)와 흰 받침
export function labTable(w = 5.6, d = 3.0) {
  const t = new THREE.Mesh(roundedBoxGeometry(w, 0.12, d, 0.05), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.62, metalness: 0 })); t.position.y = -0.06; t.userData.noFrame = true; return t;
}
export function labTray(w = 2.7, d = 2.3) {
  const t = new THREE.Mesh(roundedBoxGeometry(w, 0.05, d, 0.14), new THREE.MeshPhysicalMaterial({ color: 0xf6f6f2, roughness: 0.35, clearcoat: 0.5 })); t.userData.noFrame = true; return t;
}
// 두꺼운 유리병(한 번 돌려 깎은 모양): 바깥 벽 → 둥근 어깨 → 나사산 목 → 둥근 입구 → 안쪽 벽 → 두꺼운 바닥
// R: 안 반지름 · H: 높이 · Y0: 안쪽 바닥 높이. 돌려주는 값: { group, NR(목 안 반지름), T(벽 두께), NECK(목 시작 높이) }
export function glassJar({ R = 0.95, H = 3.1, Y0 = 0.1, T = 0.075 } = {}) {
  const group = new THREE.Group(), NR = R - 0.1, NECK = H - 0.3;
  const prof = round([[0, Y0], [R, Y0, 0.08], [R, NECK - 0.1, 0.12], [NR, NECK + 0.05, 0.06], [NR, H - 0.02], [NR + T * 0.5, H + 0.02, 0.03],
    [NR + T, H - 0.02], [NR + T, NECK + 0.05, 0.06], [R + T, NECK - 0.12, 0.14], [R + T, 0.02, 0.1], [R - 0.15, 0, 0.04], [0, 0.012]]);
  const jar = new THREE.Mesh(lathe(prof, 96), thickGlass()); jar.renderOrder = 6; group.add(jar);
  // 두꺼운 바닥 유리는 옆에서 보면 초록빛이 돈다
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(R + T - 0.02, R + T - 0.06, Y0 - 0.01, 72), new THREE.MeshPhysicalMaterial({ color: 0xcfe7df, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false }));
  foot.position.y = Y0 / 2; foot.renderOrder = 5; group.add(foot);
  const helix = new THREE.Curve(); helix.getPoint = (t, v = new THREE.Vector3()) => v.set(Math.cos(t * Math.PI * 4) * (NR + T + 0.012), NECK + 0.1 + t * 0.12, Math.sin(t * Math.PI * 4) * (NR + T + 0.012));
  const thread = new THREE.Mesh(new THREE.TubeGeometry(helix, 160, 0.018, 8, false), thickGlass(0xe6f2f4, 0.18)); thread.renderOrder = 6; group.add(thread);
  return { group, NR, T, NECK };
}
// 홈이 팬 돌림 뚜껑(병 목 NR·벽 T에 맞춤)
export function jarLid(NR, T, color = 0x2f6f5a) {
  const lid = new THREE.Group(), capMat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  lid.add(new THREE.Mesh(lathe(round([[0, 0.24], [NR + T + 0.07, 0.24, 0.04], [NR + T + 0.07, -0.02, 0.02], [NR + T + 0.02, -0.02]])), capMat));
  for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, rib = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.18, 0.02), capMat); rib.position.set(Math.cos(a) * (NR + T + 0.075), 0.11, Math.sin(a) * (NR + T + 0.075)); rib.rotation.y = -a; lid.add(rib); }
  return lid;
}
// 물 비커(눈금 몇 줄 + 옅은 물)
export function beakerMesh({ r = 0.4, h = 0.94, water = 0.55, tint = 0xbfe0f7 } = {}) {
  const g = new THREE.Group();
  const bk = new THREE.Mesh(lathe(round([[0, 0.012], [r, 0, 0.05], [r, h - 0.04], [r + 0.03, h], [r - 0.028, h], [r - 0.028, 0.03], [0, 0.03]]), 64), thickGlass(0xeef6f8, 0.08)); bk.renderOrder = 6; g.add(bk);
  if (water > 0) { const bw = new THREE.Mesh(new THREE.CylinderGeometry(r - 0.03, r - 0.03, water, 48), fresnel(new THREE.MeshPhysicalMaterial({ color: tint, roughness: 0.02, transparent: true, opacity: 0.22, clearcoat: 1, depthWrite: false }), { edge: 0.5 })); bw.position.y = 0.03 + water / 2; bw.renderOrder = 3; g.add(bw); g.userData.water = bw; }
  for (let k = 1; k <= 4; k++) { const tick = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.01), new THREE.MeshBasicMaterial({ color: 0x5b6577 })); tick.position.set(0, h * 0.17 * k, r + 0.005); g.add(tick); }
  return g;
}
