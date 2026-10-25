// 자연관찰 연습 표본 — 메뚜기 무리 곤충 3종을 두 장소에서(초등 자연관찰대회 유형: 장소별 채집 기록 → 관찰그림 → 두 장소 환경 비교 → 날개·다리의 기능).
// 장소 A = 큰 나무 아래 그늘, 갈색 마른 풀 / 장소 B = 햇빛 드는 곳, 짧은 연두색 풀. 곤충은 흰 접시 위에 크게 올려 관찰한다.
// 환경 확인(햇빛·바람·흙의 물기)은 대회에서 아이들이 실제로 하는 방법(종이 밝기·풀 흔들림·흙을 쥐었다 편 손)을 그대로 흉내 낸다. 숫자는 주지 않는다 — 보고 쓰는 것이 관찰.
// 모형은 코드로 만든 것이다(실사 사진은 따로 붙인다). 이름은 「이름 확인」 전엔 번호로만.
import { THREE, mat, glossMat, label, clamp01, ease, lerp } from './_kit.js';
import { chitinTex, facetTex, femurTex, ringTex, wingTex as organicWingTex, soilTex, grassTex, rng, hex } from './_organic.js';
import { insectSound } from './_sound.js';

const DISH_R = 2.1, DISH_H = 0.12, TOP = DISH_H;
const PLACES = {
  A: { id: 'A', name: '장소 A', soil: 0x4a3a2c, grass: 0x9a7d4a, grassH: 0.55, grassN: 420, shade: true, wet: 0.8, bright: 0.42 },
  B: { id: 'B', name: '장소 B', soil: 0x8a6a46, grass: 0x9ccc65, grassH: 0.22, grassN: 900, shade: false, wet: 0.15, bright: 1 },
};
const tube = (pts, r, color, seg = 10) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg, r, 7), mat(color, { roughness: 0.55 })); m.castShadow = true; return m; };
const ellipsoid = (rx, ry, rz, color, opts) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 22, 16), glossMat(color, opts)); m.scale.set(rx, ry, rz); m.castShadow = true; return m; };
function wingShape(len, w, pointed = 0.3) { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(len * 0.2, w, len * 0.8, w * (1 - pointed * 0.4), len, w * pointed * 0.3); s.bezierCurveTo(len * 0.8, -w * 0.3, len * 0.3, -w * 0.45, 0, -w * 0.3); return s; }
const wingTex = (kind, base) => organicWingTex('wing:' + kind + ':' + base, kind, base);
// 두 점 사이에 놓는 원기둥(다리 마디용): 단위 원기둥을 a→b 방향으로 돌리고 길이만큼 늘인다. 자세를 바꿀 때 점만 옮기면 된다.
const UP = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3();
function segMesh(color, r0, r1) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, 1, 8), glossMat(color)); m.castShadow = true; return m; }
function orient(m, a, b) { _d.subVectors(b, a); const len = _d.length() || 0.001; m.position.copy(a).addScaledVector(_d, 0.5); m.scale.set(1, len, 1); m.quaternion.setFromUnitVectors(UP, _d.normalize()); }
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
// 다리 하나: 밑마디 C(몸에 붙은 자리) → 무릎 K → 발 F. rest(접은 자세)와 ext(편 자세)를 두고 그 사이를 보간한다.
function makeLeg(parent, color, thick, hind, C, K, F, K1, F1, femTex) {
  const fm = hind ? new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), femTex ? new THREE.MeshPhysicalMaterial({ map: femTex, roughness: 0.4, clearcoat: 0.5 }) : glossMat(color)) : segMesh(color, thick * 0.9, thick * 0.6);
  if (hind) { fm.castShadow = true; fm.userData.r = [thick * 2.6, thick * 1.5]; }
  const tb = segMesh(color, thick * (hind ? 0.8 : 0.55), thick * 0.35), ft = new THREE.Mesh(new THREE.SphereGeometry(thick * 0.6, 8, 6), mat(0x3a3a3a));
  const claw = new THREE.Mesh(new THREE.ConeGeometry(thick * 0.3, thick * 1.1, 6), mat(0x2b2b2b));
  parent.add(fm, tb, ft, claw);
  const spines = hind ? Array.from({ length: 6 }, () => { const sp = new THREE.Mesh(new THREE.ConeGeometry(thick * 0.22, thick * 1.3, 6), mat(0x2b2b2b)); parent.add(sp); return sp; }) : [];
  const rec = { fm, tb, ft, C, K0: K, F0: F, K1: K1 || K, F1: F1 || F, K: K.clone(), F: F.clone() };
  const side = Math.sign(C.z) || 1, out = new THREE.Vector3(), tmp = new THREE.Vector3();
  const pose = (o = 0) => {
    rec.K.lerpVectors(rec.K0, rec.K1, o); rec.F.lerpVectors(rec.F0, rec.F1, o);
    orient(fm, C, rec.K); if (hind) { const len = fm.scale.y; fm.scale.set(fm.userData.r[0], len, fm.userData.r[1]); }
    orient(tb, rec.K, rec.F); ft.position.copy(rec.F);
    tmp.subVectors(rec.F, rec.K).normalize(); claw.position.copy(rec.F).addScaledVector(tmp, thick * 0.9); claw.quaternion.setFromUnitVectors(UP, tmp);
    out.set(0, 0, side).cross(tmp).cross(tmp).negate().normalize();   // 종아리에 수직, 몸 바깥쪽
    spines.forEach((sp, i) => { const u = 0.25 + i * 0.12; sp.position.lerpVectors(rec.K, rec.F, u).addScaledVector(out, thick * 0.5); sp.quaternion.setFromUnitVectors(UP, tmp.clone().multiplyScalar(0.55).addScaledVector(out, 1).normalize()); });
  };
  pose(0); rec.pose = pose; return rec;
}
// 곤충 한 마리(머리가 +x, 바닥이 y=0). P = { L(몸길이, 단위), color, belly, head: 'round'|'cone', antenna(몸길이 배), wing(앞날개/몸길이), hind(뒷다리 넓적다리/몸길이), stripe, cerci, flat }
function buildInsect(P) {
  const g = new THREE.Group(), L = P.L, body = new THREE.Group(); g.add(body);
  const fl = P.flat ? 0.78 : 1, rb = L * 0.075, rh = L * 0.055, yb = rb * fl;   // yb = 몸통 축 높이
  // 배: 앞에서 뒤로 가늘어지는 회전체 + 마디 홈
  const prof = []; for (let i = 0; i <= 14; i++) { const t = i / 14, r = rb * (1.02 - 0.75 * t * t) * (1 - 0.06 * (i % 2)); prof.push(new THREE.Vector2(Math.max(0.01, r), -L * (0.1 + 0.47 * t))); }
  prof.push(new THREE.Vector2(0.001, -L * 0.575));
  const skin = chitinTex('chitin:' + P.id, { base: hex(P.color), spot: hex(P.spot ?? 0x2b1d10), light: hex(P.belly ?? P.color), density: P.mottle ?? 0.15, rings: 7, seed: 5 });
  const ab = new THREE.Mesh(new THREE.LatheGeometry(prof, 24), new THREE.MeshPhysicalMaterial({ map: skin, roughness: 0.42, clearcoat: 0.55, clearcoatRoughness: 0.3 })); ab.rotation.z = -Math.PI / 2; ab.scale.set(fl, 1, 1); ab.position.set(0, yb, 0); ab.castShadow = true; body.add(ab);
  const bl = new THREE.Mesh(new THREE.LatheGeometry(prof.map((v) => new THREE.Vector2(v.x * 0.92, v.y)), 20), new THREE.MeshStandardMaterial({ map: chitinTex('belly:' + P.id, { base: hex(P.belly ?? P.color), density: 0, rings: 7 }), roughness: 0.65 })); bl.rotation.z = -Math.PI / 2; bl.scale.set(fl * 0.9, 1, 1); bl.position.set(0, yb - rb * 0.12, 0); body.add(bl);
  // 가슴·앞가슴 등판
  const th = ellipsoid(L * 0.15, rb * 1.08 * fl, rb * 1.08, P.color, { roughness: 0.4 }); th.material.map = chitinTex('thorax:' + P.id, { base: hex(P.color), spot: hex(P.spot ?? 0x2b1d10), density: P.mottle ?? 0.1, rings: 0 }); th.position.set(L * 0.04, yb, 0); body.add(th);
  // 앞가슴 등판: 가슴을 덮는 안장 모양 조각(세로 홈 두 줄)
  const sd = new THREE.Mesh(new THREE.CylinderGeometry(rb * 1.18, rb * 1.18, L * 0.15, 24, 1, true, -Math.PI * 0.72, Math.PI * 1.44), new THREE.MeshPhysicalMaterial({ map: chitinTex('pron:' + P.id, { base: hex(P.color), spot: hex(P.spot ?? 0x2b1d10), density: (P.mottle ?? 0.1) * 0.6, rings: 3 }), roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide })); sd.rotation.z = Math.PI / 2; sd.rotation.y = Math.PI / 2; sd.scale.set(1, 1, fl); sd.position.set(L * 0.1, yb, 0); sd.castShadow = true; body.add(sd);
  const topY = yb + rb * 1.08 * fl;
  if (P.stripe) { const st = new THREE.Mesh(new THREE.BoxGeometry(L * 0.6, 0.012, rb * 0.32), mat(P.stripe)); st.position.set(-L * 0.17, topY + 0.004, 0); body.add(st); }
  // 머리
  const head = new THREE.Group(); head.position.set(L * 0.19, yb + rh * 0.3, 0); body.add(head);
  if (P.head === 'cone') { const hd = new THREE.Mesh(new THREE.ConeGeometry(rh * 1.15, L * 0.22, 14), glossMat(P.color)); hd.rotation.z = -Math.PI / 2; hd.position.x = L * 0.08; hd.castShadow = true; head.add(hd); }
  else { const hd = ellipsoid(rh * 1.15, rh * 1.35, rh * 1.25, P.color, { roughness: 0.35 }); head.add(hd); }
  const ft = facetTex('facet'); ft.repeat.set(3, 2);
  for (const s of [-1, 1]) { const eye = ellipsoid(rh * 0.48, rh * 0.62, rh * 0.38, 0x1d1a16, { roughness: 0.12 }); eye.material.map = ft; eye.material.clearcoat = 1; eye.position.set(P.head === 'cone' ? L * 0.07 : rh * 0.6, rh * 0.4, s * rh * 1.05); head.add(eye); }
  // 입: 윗입술판 + 큰턱 한 쌍 + 작은 수염(팔프) 한 쌍
  const mx = P.head === 'cone' ? L * 0.02 : rh * 0.5;
  const lab = new THREE.Mesh(new THREE.BoxGeometry(rh * 0.55, rh * 0.45, rh * 0.8), mat(0x3b2a1a)); lab.position.set(mx, -rh * 1.0, 0); head.add(lab);
  for (const s of [-1, 1]) { const md = new THREE.Mesh(new THREE.ConeGeometry(rh * 0.22, rh * 0.6, 6), mat(0x241a10)); md.position.set(mx + rh * 0.1, -rh * 1.4, s * rh * 0.3); md.rotation.set(0, 0, s * 0.4); head.add(md); const pp = tube([[mx, -rh * 1.1, s * rh * 0.45], [mx + rh * 0.4, -rh * 1.3, s * rh * 0.75], [mx + rh * 0.5, -rh * 1.0, s * rh * 1.0]], rh * 0.07, 0x3a2a1a, 6); head.add(pp); }
  for (const s of [-1, 1]) { const aL = L * P.antenna, long = P.antenna > 0.6, pts = long ? [[0, 0, 0], [aL * 0.35, aL * 0.3, s * aL * 0.2], [aL * 0.75, aL * 0.22, s * aL * 0.45], [aL, aL * 0.02, s * aL * 0.6]] : [[0, 0, 0], [aL * 0.5, aL * 0.45, s * aL * 0.25], [aL, aL * 0.6, s * aL * 0.4]]; const an = tube(pts, rh * (long ? 0.07 : 0.14), 0x3a2a1a, 14); an.material = new THREE.MeshStandardMaterial({ map: ringTex('ring'), roughness: 0.6 }); an.material.map.repeat.set(long ? 26 : 12, 1); an.position.set(P.head === 'cone' ? L * 0.14 : rh * 0.6, rh * 0.9, 0); head.add(an); }
  // 다리 3쌍(몸 옆에서 바깥·위로 넓적다리, 무릎에서 바닥으로 종아리). 뒷다리는 무릎이 등 위로 솟는다.
  const legs = { front: [], mid: [], hind: [] }, thick = L * 0.028, H = P.hind, fTex = P.femurPattern ? femurTex('femur:' + P.id, hex(P.color), hex(P.spot ?? 0x3f6b25)) : null;
  for (const s of [-1, 1]) {
    legs.front.push(makeLeg(body, P.color, thick, false, V3(L * 0.14, yb - rb * 0.3, s * rb * 0.75), V3(L * 0.27, yb + rb * 0.3, s * rb * 1.9), V3(L * 0.35, 0, s * rb * 2.4)));
    legs.mid.push(makeLeg(body, P.color, thick, false, V3(L * 0.02, yb - rb * 0.3, s * rb * 0.8), V3(-L * 0.01, yb + rb * 0.4, s * rb * 2.2), V3(-L * 0.06, 0, s * rb * 2.8)));
    legs.hind.push(makeLeg(body, P.color, thick, true, V3(-L * 0.1, yb, s * rb * 0.8), V3(-L * (0.1 + H * 0.85), yb + rb * (0.8 + H * 4), s * rb * 1.5), V3(-L * (0.05 + H * 0.5), 0, s * rb * 2.4),
      V3(-L * (0.1 + H * 1.9), yb + rb * 0.6, s * rb * 1.8), V3(-L * (0.1 + H * 3.6), 0, s * rb * 2.4), fTex));
  }
  // 날개: 앞날개(가죽질) 2장이 등 위에 포개지고, 뒷날개(막질 부채)는 그 아래 접혀 있다
  const wings = { fore: [], hind: [] }, wl = L * P.wing, ww = rb * 1.05;
  const foreTex = wingTex(P.cerci ? 'cricket' : 'tegmen', hex(P.wingColor ?? P.color)), hindTex = wingTex('hind', '#ffffff');
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.ShapeGeometry(wingShape(wl, ww, P.wing > 0.6 ? 0.25 : 0.5), 16), new THREE.MeshPhysicalMaterial({ map: foreTex, side: THREE.DoubleSide, roughness: 0.5, clearcoat: 0.3 })); w.castShadow = true;
    { const uv = w.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / wl, 0.5 + uv.getY(i) / (ww * 2)); }   // 날개맥 그림을 날개 길이에 맞춤
    const piv = new THREE.Group(); piv.position.set(L * 0.0, topY + 0.012 + 0.006 * (s + 1), s * rb * 0.18); piv.rotation.set(Math.PI / 2 - s * 0.18, 0, Math.PI); piv.add(w); body.add(piv); wings.fore.push(piv);
    const hs = new THREE.Shape(); hs.moveTo(0, 0); hs.absarc(0, 0, wl * 0.92, -0.15, 1.35, false); hs.lineTo(0, 0);
    const hw = new THREE.Mesh(new THREE.ShapeGeometry(hs, 24), new THREE.MeshStandardMaterial({ map: hindTex, transparent: true, opacity: 0.8, side: THREE.DoubleSide, roughness: 0.5 }));
    { const uv = hw.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / (wl * 0.92), uv.getY(i) / (wl * 0.92)); }
    const hp = new THREE.Group(); hp.position.set(-L * 0.02, topY + 0.004, s * rb * 0.1); hp.rotation.set(Math.PI / 2, 0, Math.PI); hw.scale.set(1, s, 1); hw.visible = false; hp.add(hw); body.add(hp); wings.hind.push({ piv: hp, mesh: hw });
  }
  if (P.cerci) for (const s of [-1, 1]) body.add(tube([[-L * 0.55, yb, s * rb * 0.22], [-L * 0.74, yb + rb * 0.1, s * rb * 0.85]], thick * 0.5, 0x3a2a1a, 4));
  g.userData = { body, legs, wings, L, topY };
  return g;
}
// ── 표본 3종 ──
const SPECS = [
  { id: 'cricket', no: '①', name: '알락귀뚜라미', hint: '갈색, 더듬이가 몸보다 길다', place: 'A', cm: 2.2, build: () => buildInsect({ id: 'cricket', L: 2.6, color: 0x6b4a2a, belly: 0x8a6a46, spot: 0x2a1a0e, mottle: 0.9, head: 'round', antenna: 0.85, wing: 0.42, hind: 0.26, cerci: true, flat: true, wingColor: 0x5a4028 }),
    think: ['더듬이는 몸길이와 비교해 얼마나 긴가요?', '날개는 배를 다 덮나요? 두 날개가 어떻게 포개져 있나요?', '갈색 몸은 장소 A의 무엇과 색이 비슷한가요?'],
    notes: { wing: '두 앞날개를 포개고 비비는 모습을 보세요. 소리와 관계가 있을까요?', jump: '뒷다리가 펴지는 길이를 다른 곤충과 비교해 보세요.', flip: '배 쪽의 색과 다리가 붙은 자리를 보세요.', sound: '앞날개 두 장을 서로 비벼 소리를 내요(합성한 소리라 실제와 똑같진 않아요). 날개의 어느 부분이 움직이는지 보세요.' } },
  { id: 'longhead', no: '②', name: '방아깨비', hint: '연두색, 머리가 뾰족하고 몸이 길다', place: 'B', cm: 7, build: () => buildInsect({ id: 'longhead', L: 3.6, color: 0x7bb651, belly: 0x9ccc65, spot: 0x4f8a2e, mottle: 0.08, head: 'cone', antenna: 0.3, wing: 0.78, hind: 0.42, femurPattern: true, wingColor: 0x86b85a }),
    think: ['뒷다리는 몸길이의 몇 배쯤인가요?', '머리 모양이 다른 곤충과 어떻게 다른가요? 어디에 좋을까요?', '연두색 몸은 장소 B의 무엇과 색이 비슷한가요?'],
    notes: { wing: '날개가 포개져 있지 않고 나란히 놓인 것을 보세요. 소리를 낼 수 있을까요?', jump: '뒷다리가 아주 길게 펴집니다. 뛸 때 어떤 점이 좋을까요?', flip: '배 쪽 마디를 세어 보세요.', sound: '앉아서는 소리를 못 내고, 날 때 날개로 「따다다닥」 소리를 내요(합성한 소리). 귀뚜라미와 무엇이 다른가요?' } },
  { id: 'stripe', no: '③', name: '등줄메뚜기', hint: '연두·갈색, 등에 밝은 줄', place: 'B', cm: 3, build: () => buildInsect({ id: 'stripe', L: 2.8, color: 0x8aa84a, belly: 0xa8b86a, spot: 0x5a6a2a, mottle: 0.25, head: 'round', antenna: 0.45, wing: 0.7, hind: 0.33, stripe: 0xe8e2b0, femurPattern: true, wingColor: 0x8a9a5a }),
    think: ['등의 밝은 줄은 어디서 어디까지 이어지나요?', '뒷다리 넓적다리의 굵기를 ②와 비교해 보세요.', '날개 길이가 배보다 긴가요, 짧은가요?'],
    notes: { wing: '뒷날개가 부채처럼 펴집니다. 접혀 있을 때는 어디에 있었나요?', jump: '넓적다리가 굵습니다. 무엇이 들어 있을까요?', flip: '다리가 몸 어디에 붙어 있는지 세어 보세요.', sound: '뒷다리 넓적다리 안쪽을 앞날개에 비벼 거친 소리를 내요(합성한 소리). 귀뚜라미는 날개끼리, 이 곤충은 다리와 날개 — 소리 내는 자리가 달라요.' } },
];
export const VIEWS = { angle: { theta: 0.55, phi: 1.05, name: '비스듬히' }, top: { theta: 0.15, phi: 0.3, name: '위에서 본 모습' }, side: { theta: 0, phi: 1.45, name: '옆에서 본 모습' }, front: { theta: Math.PI / 2, phi: 1.3, name: '앞에서 본 모습' } };   // 머리가 +x 쪽: 옆 = +z에서, 앞 = +x에서
export const TOOLS = [{ id: 'detail', name: '🔍 날개 확대' }, { id: 'ruler', name: '📏 자 대기' }];
export const PLACE_LIST = [PLACES.A, PLACES.B];

// 자(cm): 접시 앞쪽에 가로로
function ruler(cmPerUnit, cm) {
  const len = cm / cmPerUnit, cv = document.createElement('canvas'); cv.width = 1024; cv.height = 96; const c = cv.getContext('2d');
  c.fillStyle = '#f3e7b8'; c.fillRect(0, 0, 1024, 96); c.fillStyle = '#1f2a37'; c.font = '700 26px Pretendard, sans-serif'; c.textAlign = 'center';
  const steps = cm * 10; for (let i = 0; i <= steps; i++) { const x = 8 + (i / steps) * 1008, h = i % 10 === 0 ? 46 : i % 5 === 0 ? 30 : 18; c.fillRect(x - 1, 0, 2, h); if (i % 10 === 0) c.fillText(String(i / 10), x, 82); }
  c.textAlign = 'right'; c.fillText('cm', 1012, 82);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.02, len * 96 / 1024), [mat(0xe6d79c), mat(0xe6d79c), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }), mat(0xe6d79c), mat(0xe6d79c), mat(0xe6d79c)]);
  m.userData.noFrame = true; return m;
}
// 흙을 쥐었다 편 손 — 캔버스에 손바닥 윤곽 + 남은 흙 알갱이(장소마다 다르게)
function handCard(wet) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 300; const c = cv.getContext('2d');
  c.fillStyle = '#fff6ea'; c.fillRect(0, 0, 256, 300);
  c.fillStyle = '#f2d2b6'; c.strokeStyle = '#8a6a50'; c.lineWidth = 3;
  const palm = () => { c.beginPath(); c.ellipse(128, 190, 70, 80, 0, 0, Math.PI * 2); c.fill(); c.stroke(); for (const [x, y, w, h, a] of [[70, 110, 18, 60, -0.35], [105, 85, 18, 70, -0.1], [140, 80, 18, 72, 0.05], [175, 100, 17, 62, 0.3], [205, 190, 16, 50, 1.0]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 9); c.fill(); c.stroke(); c.restore(); } };
  palm();
  c.fillStyle = '#5a4030'; const n = Math.round(10 + wet * 110); let s = 7;
  for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; const r1 = s / 233280; s = (s * 9301 + 49297) % 233280; const r2 = s / 233280; const a = r1 * Math.PI * 2, R = Math.sqrt(r2) * 68; c.beginPath(); c.arc(128 + Math.cos(a) * R, 190 + Math.sin(a) * R * 1.1, 2 + (i % 3), 0, Math.PI * 2); c.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.76), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); m.userData.noFrame = true; return m;
}
// 밝기 종이 — 같은 흰 종이가 그늘·양지에서 얼마나 다르게 보이나
function brightPaper() { const g = new THREE.Group(); const mt = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.0), mat(0x3b3630, { roughness: 1 })); mt.rotation.x = -Math.PI / 2; g.add(mt); const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.8), mat(0xffffff, { roughness: 0.95 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.004; m.receiveShadow = true; g.add(m); g.traverse((o) => { o.userData.noFrame = true; }); return g; }   // 어두운 받침 위 흰 종이 — 흰 접시 위에서도 보인다

function habitat(place) {
  const P = PLACES[place], g = new THREE.Group();
  const st = soilTex('soil:' + place, hex(P.soil), place === 'A' ? 2 : 3); st.repeat.set(5, 5);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5.2, 48), new THREE.MeshStandardMaterial({ map: st, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; g.add(ground);
  // 풀잎: 인스턴스. 접시 자리는 비운다
  const blade = new THREE.PlaneGeometry(0.06, 1, 1, 3); blade.translate(0, 0.5, 0);
  const pos = blade.attributes.position; for (let i = 0; i < pos.count; i++) { const y = pos.getY(i); pos.setX(i, pos.getX(i) * (1 - y * 0.8)); } pos.needsUpdate = true;
  const gt = grassTex('grass:' + place, hex(P.grass), place === 'A' ? '#c9b07a' : '#d8e89a');
  const grass = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ map: gt, side: THREE.DoubleSide, roughness: 0.9 }), P.grassN); grass.castShadow = true;
  const col = new THREE.Color();
  const d = new THREE.Object3D(); let s = 11; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const sway = [];
  for (let i = 0; i < P.grassN; i++) {
    let x, z; do { const a = rnd() * Math.PI * 2, r = 2.3 + Math.sqrt(rnd()) * 2.8; x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.hypot(x, z) < DISH_R + 0.2);
    const h = P.grassH * (0.7 + rnd() * 0.6), lean = (rnd() - 0.5) * 0.5, ry = rnd() * Math.PI;
    d.position.set(x, 0, z); d.rotation.set(lean, ry, 0); d.scale.set(1, h, 1); d.updateMatrix(); grass.setMatrixAt(i, d.matrix);
    grass.setColorAt(i, col.setHSL(place === 'A' ? 0.1 : 0.25, 0.5, 0.42 + rnd() * 0.3));
    sway.push({ x, z, h, lean, ry, ph: rnd() * Math.PI * 2 });
  }
  grass.instanceMatrix.needsUpdate = true; g.add(grass);
  // 떨어진 잎(그늘 쪽에 많이)·작은 돌
  const leafN = place === 'A' ? 36 : 8, fl = new THREE.InstancedMesh(new THREE.CircleGeometry(0.22, 10), mat(place === 'A' ? 0x7a5a36 : 0xa88a58, { side: THREE.DoubleSide, roughness: 0.95 }), leafN);
  for (let i = 0; i < leafN; i++) { let x, z; do { const a = rnd() * Math.PI * 2, r = 2.4 + Math.sqrt(rnd()) * 2.6; x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.hypot(x, z) < DISH_R + 0.3); d.position.set(x, 0.01, z); d.rotation.set(-Math.PI / 2 + (rnd() - 0.5) * 0.3, 0, rnd() * Math.PI); d.scale.set(1 + rnd() * 0.6, 0.6 + rnd() * 0.4, 1); d.updateMatrix(); fl.setMatrixAt(i, d.matrix); fl.setColorAt(i, col.setHSL(0.08, 0.35, 0.3 + rnd() * 0.25)); }
  fl.receiveShadow = true; g.add(fl);
  const pb = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 8), mat(0x8e8578, { roughness: 0.9 }), 18);
  for (let i = 0; i < 18; i++) { let x, z; do { const a = rnd() * Math.PI * 2, r = 2.3 + Math.sqrt(rnd()) * 2.7; x = Math.cos(a) * r; z = Math.sin(a) * r; } while (Math.hypot(x, z) < DISH_R + 0.2); d.position.set(x, 0.03, z); d.rotation.set(0, rnd() * 3, 0); d.scale.set(0.6 + rnd() * 1.2, 0.4 + rnd() * 0.4, 0.6 + rnd() * 1.0); d.updateMatrix(); pb.setMatrixAt(i, d.matrix); pb.setColorAt(i, col.setHSL(0.09, 0.08, 0.4 + rnd() * 0.3)); }
  pb.castShadow = true; g.add(pb);
  // 나무 그늘판: 그림자만 드리우고 보이지는 않는다(colorWrite 끔) — 위에서 볼 때 화면을 가리지 않도록
  if (P.shade) { const canopy = new THREE.Mesh(new THREE.CircleGeometry(4.6, 32), mat(0x2f4a2a, { side: THREE.DoubleSide })); canopy.material.colorWrite = false; canopy.material.depthWrite = false; canopy.rotation.x = -Math.PI / 2; canopy.position.set(0.8, 5.5, -0.6); canopy.castShadow = true; g.add(canopy); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.32, 5.5, 10), mat(0x5a4330)); trunk.position.set(3.9, 2.75, -3.2); trunk.castShadow = true; g.add(trunk); }
  else { const sun = label('☀', { size: 0.9, bg: 'rgba(255,230,140,0.95)', color: '#b8860b' }); sun.position.set(3.2, 5, -2); g.add(sun); }
  const tag = label(`${P.name} · ${P.shade ? '큰 나무 아래' : '트인 풀밭'}`, { size: 0.3 }); tag.position.set(-DISH_R - 0.3, TOP + 0.9, 0.2); g.add(tag);
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(DISH_R, DISH_R * 0.92, DISH_H, 48), glossMat(0xfafafa, { roughness: 0.25 })); dish.position.y = DISH_H / 2; dish.receiveShadow = true; dish.castShadow = true; g.add(dish);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(DISH_R, 0.05, 10, 64), glossMat(0xf0f0f0)); rim.rotation.x = Math.PI / 2; rim.position.y = DISH_H; g.add(rim);
  g.traverse((o) => { o.userData.noFrame = true; });
  const hand = handCard(P.wet); hand.position.set(1.7, 1.0, 0.9); hand.lookAt(1.7, 1.0, 8); hand.visible = false; g.add(hand);
  const paper = brightPaper(); paper.position.set(-0.2, TOP + 0.008, 1.15); paper.visible = false; g.add(paper);
  g.userData = { grass, sway, hand, paper, P, d };
  return g;
}
// 날개 확대 카드
function detailCard(spec) {
  const g = new THREE.Group(), tex = wingTex(spec.id === 'cricket' ? 'brown' : 'fore');
  const card = new THREE.Mesh(new THREE.CircleGeometry(0.7, 40), new THREE.MeshBasicMaterial({ map: tex })); g.add(card);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.035, 10, 64), glossMat(0x2b2b2b)); g.add(ring);
  const t = label('앞날개 확대', { size: 0.26 }); t.position.set(0, 1.05, 0); g.add(t);
  g.position.set(1.9, 1.25, -0.7); g.lookAt(1.9, 1.25, 8); return g;
}

export const SPECIMENS = SPECS.map((s) => () => s);
// 무대에 곤충 하나를 올린다. 돌려주는 것: { spec, run(id), setView(id), toggle(id, on), setPlace(id), actions() }
export function mountSpecimen(stage, make) {
  stage.clear();
  const spec = make(), ins = spec.build(), base = new THREE.Group(); stage.root.add(base);
  let hab = null, placeId = spec.place;
  const setPlace = (id) => { if (hab) { base.remove(hab); hab.traverse((o) => { o.geometry?.dispose?.(); }); } placeId = id; hab = habitat(id); base.add(hab); stage._needFit = true; };
  setPlace(placeId);
  ins.position.y = TOP; base.add(ins);
  const cmPerUnit = spec.cm / ins.userData.L;
  const rl = ruler(cmPerUnit, Math.ceil(spec.cm * 1.5)); rl.position.set(0, TOP + 0.02, ins.userData.L * 0.22 + 0.25); rl.visible = false; base.add(rl);
  const det = detailCard(spec); det.visible = false; base.add(det);
  const U = ins.userData;
  const actions = {
    wing: { name: '🪽 날개 펼쳐 보기', dur: 3.6, note: spec.notes.wing, step: (t) => { const o = t < 0.3 ? ease.io(t / 0.3) : t > 0.72 ? 1 - ease.io((t - 0.72) / 0.28) : 1; U.wings.fore.forEach((p, i) => { p.rotation.y = (i ? -1 : 1) * 0.95 * o; }); U.wings.hind.forEach(({ piv, mesh }, i) => { mesh.visible = o > 0.02; piv.rotation.y = (i ? -1 : 1) * 0.75 * o; mesh.scale.set(o, (i ? -1 : 1) * o, 1); }); if (spec.id === 'cricket') U.wings.fore[0].position.x = -U.L * 0.02 + Math.sin(t * 60) * 0.02 * (1 - o); } },
    jump: { name: '🦵 뒷다리 펴 보기', dur: 3.2, note: spec.notes.jump, step: (t) => { const o = t < 0.3 ? ease.out(t / 0.3) : t > 0.7 ? 1 - ease.io((t - 0.7) / 0.3) : 1; U.legs.hind.forEach((l) => l.pose(o)); U.body.rotation.z = 0.22 * o; U.body.position.x = -U.L * 0.05 * o; } },
    flip: { name: '🔄 뒤집어 보기', dur: 4, note: spec.notes.flip, step: (t) => { const o = t < 0.25 ? ease.io(t / 0.25) : t > 0.75 ? 1 - ease.io((t - 0.75) / 0.25) : 1; U.body.rotation.x = Math.PI * o; U.body.position.y = (U.topY + U.L * 0.06) * Math.sin(Math.PI * o) + U.topY * o * 0.5; } },
    sound: { name: '🔊 소리 듣기', dur: 3.6, note: spec.notes.sound, start: () => insectSound.play(spec.id, 3.5), end: () => insectSound.stop(), step: (t) => {
      const on = t < 0.97, w = Math.sin(t * Math.PI * 60) * (on ? 1 : 0);   // 소리와 함께 비비는 움직임
      if (spec.id === 'cricket') { U.wings.fore.forEach((p, i) => { p.rotation.y = (i ? -1 : 1) * (0.18 + 0.1 * w); p.position.x = -U.L * 0.02 + 0.03 * w * (i ? -1 : 1); }); }
      else if (spec.id === 'stripe') { U.legs.hind.forEach((l) => l.pose(0.12 + 0.1 * w)); }
      else { U.wings.fore.forEach((p, i) => { p.rotation.y = (i ? -1 : 1) * 0.5 * Math.abs(w) * (t > 0.08 && t < 0.9 ? 1 : 0); }); U.wings.hind.forEach(({ piv, mesh }, i) => { const o = Math.abs(w) * (t > 0.08 && t < 0.9 ? 1 : 0); mesh.visible = o > 0.05; piv.rotation.y = (i ? -1 : 1) * 0.6 * o; mesh.scale.set(o, (i ? -1 : 1) * o, 1); }); }
    } },
    wind: { name: '🍃 바람 보기', dur: 4, env: true, note: '풀잎이 얼마나 흔들리는지 보세요. 두 장소에서 같은 방법으로 봐야 비교가 돼요.', step: (t) => { const h = hab.userData, amp = (h.P.shade ? 0.05 : 0.09) * Math.sin(Math.PI * t); h.sway.forEach((b, i) => { h.d.position.set(b.x, 0, b.z); h.d.rotation.set(b.lean + amp * Math.sin(t * 18 + b.ph), b.ry, 0); h.d.scale.set(1, b.h, 1); h.d.updateMatrix(); h.grass.setMatrixAt(i, h.d.matrix); }); h.grass.instanceMatrix.needsUpdate = true; } },
    soil: { name: '✋ 흙 쥐어 보기', dur: 5, env: true, note: '흙을 3초 쥐었다 폈을 때 손에 남은 흙을 보세요. 많이 남으면 물기가 많은 거예요.', step: (t) => { const h = hab.userData; h.hand.visible = t > 0.15 && t < 0.98; h.hand.scale.setScalar(0.6 + 0.4 * ease.out(clamp01((t - 0.15) / 0.2))); } },
    sun: { name: '☀ 햇빛 보기', dur: 4, env: true, note: '같은 흰 종이를 땅에 놓고 밝기를 보세요. 나무 그늘인지, 하늘이 트였는지도 적어요.', step: (t) => { hab.userData.paper.visible = t > 0.1 && t < 0.98; } },
  };
  let running = null; insectSound.stop();
  const finish = () => { if (!running) return; running.a.step(1); running.a.end?.(); running = null; };
  stage.update = (dt) => { if (!running) return; running.t += dt / running.a.dur; running.a.step(clamp01(running.t)); if (running.t >= 1) finish(); };
  const api = {
    spec, places: PLACE_LIST, place: () => placeId,
    actions: () => Object.entries(actions).map(([id, a]) => ({ id, name: a.name, env: !!a.env })),
    run(id) { const a = actions[id]; if (!a) return null; finish(); running = { a, t: 0 }; a.start?.(); return a.note; },
    setView(id) { const v = VIEWS[id] || VIEWS.angle; stage.setView({ theta: v.theta, phi: v.phi, dist: 8, target: [0, 0.6, 0] }); },
    toggle(what, on) { if (what === 'detail') det.visible = on; if (what === 'ruler') rl.visible = on; stage._needFit = true; },
    setPlace, dispose() { finish(); insectSound.stop(); },
  };
  api.setView('angle');
  return api;
}
