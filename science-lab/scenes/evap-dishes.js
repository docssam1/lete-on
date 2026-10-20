import { THREE, label, roundedBoxGeometry, clamp01, lerp, puffCloud } from './_kit.js';
import { labTable, lathe, round } from './glassware.js';
import { WATERS, AMOUNTS, evapModel, evapRow } from './seawater-model.js';
export { WATERS, AMOUNTS, evapModel, evapRow };
// 증발 접시 두 개(3-2 Ⅱ 지구와 바다) — 왼쪽 바닷물, 오른쪽 수돗물을 같은 양 담아 전열기로 가열한다.
// 물이 다 날아가면 바닷물 접시에만 흰 알갱이(소금)가 남는다. 알갱이 수는 scenes/seawater-model.js 의 모형 값(g)에 비례한다.
const X = [-0.95, 0.95], BOT = 0.03, TOP = 0.26, RIM = 0.56, MAXFILL = 0.8;
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const rAt = (y) => RIM * Math.sqrt(clamp01((y - BOT) / (TOP - BOT)));   // 접시 안쪽 반지름(높이 y)
const yOf = (ml) => BOT + (TOP - BOT) * MAXFILL * (ml / 40);

function dish() {
  const g = new THREE.Group();
  const prof = [];
  for (let i = 0; i <= 16; i++) { const y = BOT + (TOP - BOT) * (i / 16); prof.push([rAt(y), y]); }
  prof.push([RIM + 0.035, TOP + 0.005]); for (let i = 16; i >= 0; i--) { const y = (TOP - 0.01) * (i / 16); prof.push([RIM * Math.sqrt(clamp01(y / (TOP - 0.01))) + 0.035, y]); }
  const body = new THREE.Mesh(lathe(round(prof, 2), 80), new THREE.MeshPhysicalMaterial({ color: 0xdfe3e8, roughness: 0.25, clearcoat: 0.8, side: THREE.DoubleSide }));   // 연회색 유약 — 흰 소금 알갱이가 보이게
  g.add(body);
  const water = new THREE.Mesh(new THREE.CircleGeometry(1, 64), new THREE.MeshPhysicalMaterial({ color: 0x8cc6ea, roughness: 0.08, transparent: true, opacity: 0.62, clearcoat: 1 }));
  water.rotation.x = -Math.PI / 2; water.renderOrder = 3; g.add(water);
  g.userData = { water };
  return g;
}
function hotplate() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(roundedBoxGeometry(1.1, 0.2, 1.0, 0.05), new THREE.MeshStandardMaterial({ color: 0x5b6470, roughness: 0.5, metalness: 0.3 })); base.position.y = 0.1; g.add(base);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.02, 48), new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.6 })); top.position.y = 0.21; g.add(top);
  const coil = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 10, 64), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, emissive: 0xff4a1c, emissiveIntensity: 0, roughness: 0.4 }));
  coil.rotation.x = Math.PI / 2; coil.position.y = 0.225; g.add(coil);
  const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 24), new THREE.MeshStandardMaterial({ color: 0xc2581c, roughness: 0.4 })); knob.rotation.x = Math.PI / 2; knob.position.set(0.38, 0.1, 0.52); g.add(knob);
  g.userData = { coil };
  return g;
}
// 흰 알갱이(소금): 바닥 가운데에 흩어진 작은 결정
function crystals(n) {
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.04, 0.028, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, emissive: 0xffffff, emissiveIntensity: 0.08 }), n);
  let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const o = new THREE.Object3D();
  for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 0.3, y = BOT + 0.012 + (d / 0.3) ** 2 * 0.03;
    o.position.set(Math.cos(a) * d, y, Math.sin(a) * d); o.rotation.set(r() * 0.6, r() * 3, r() * 0.6); const k = 0.7 + r() * 0.8; o.scale.set(k, k, k); o.updateMatrix(); m.setMatrixAt(i, o.matrix); }
  m.userData.base = Array.from({ length: n }, (_, i) => { const mm = new THREE.Matrix4(); m.getMatrixAt(i, mm); return mm; });
  return m;
}

export function buildEvapBench({ letters = true } = {}) {
  const g = new THREE.Group();
  const table = labTable(4.6, 2.6); g.add(table);
  const plates = X.map((x) => { const p = hotplate(); p.position.x = x; g.add(p); return p; });
  const dishes = X.map((x) => { const d = dish(); d.position.set(x, 0.23, 0); g.add(d); return d; });
  const salt = crystals(260); dishes[0].add(salt);
  const film = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.006, 6, 64), new THREE.MeshBasicMaterial({ color: 0xb8b2a6, transparent: true, opacity: 0 }));
  film.rotation.x = Math.PI / 2; film.position.y = BOT + 0.012; dishes[1].add(film);
  const steam = X.map((x) => { const s = puffCloud(70, { color: 0xc9d6e2, opacity: 0.8, soft: 0.6 }); g.add(s); return s; });
  const tags = letters ? WATERS.map((w, i) => { const t = label(w, { size: 0.17 }); t.position.set(X[i], 1.15, -0.1); g.add(t); return t; }) : [];
  const S = { ml: 20, heat: 0, p: 0, t: 0 }, cache = { n: -1, sh: -1 }, MM = new THREE.Matrix4(), SC = new THREE.Matrix4();
  const draw = () => {
    const left = 1 - smooth(0.05, 0.85, S.p), done = smooth(0.8, 0.95, S.p);
    dishes.forEach((d, i) => {
      const y = BOT + (yOf(S.ml) - BOT) * left, w = d.userData.water;
      w.visible = left > 0.02; w.position.y = y; const r = Math.max(0.02, rAt(y) - 0.006); w.scale.set(r, r, 1);
      w.material.color.setHex(i === 0 ? 0x86c3e8 : 0x9ccff0);
    });
    plates.forEach((p) => { p.userData.coil.material.emissiveIntensity = 1.6 * S.heat; });
    // 알갱이: 남는 무게(g)에 비례한 개수를 물이 다 마를 무렵 드러낸다
    const n = Math.round(260 * (evapModel('바닷물', S.ml).g / 1.4)), sh = Math.round(done * 20) / 20;
    if (n !== cache.n || sh !== cache.sh) {   // 바뀔 때만 다시 놓는다(매 프레임 260개를 다시 쓰면 느린 기기에서 늘어진다)
      cache.n = n; cache.sh = sh;
      for (let i = 0; i < 260; i++) { const k = i < n ? sh : 0; SC.makeScale(k || 1e-4, k || 1e-4, k || 1e-4); MM.copy(salt.userData.base[i]).multiply(SC); salt.setMatrixAt(i, MM); }
      salt.instanceMatrix.needsUpdate = true;
    }
    film.material.opacity = 0.45 * done;
    // 김(수증기가 식어 보이는 작은 물방울): 가열 중에만
    steam.forEach((s, i) => { const on = S.heat * (left > 0.03 ? 1 : 0); let c = 0;
      for (let k = 0; k < 40; k++) { const ph = ((S.t * 0.35 + k / 40) % 1), a = k * 2.399, rr = 0.08 + ph * 0.22;
        s.userData.set(c++, X[i] + Math.cos(a) * rr, 0.5 + ph * 0.9, Math.sin(a) * rr * 0.6, 0.09 + ph * 0.2, on * 0.65 * Math.sin(Math.PI * ph)); }
      s.userData.commit(on > 0 ? c : 0); });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, dishes, plates, tags, salt };
  return g;
}

export default {
  view: { theta: 0, phi: 1.0 }, revealAt: 2,
  frame: [[-1.7, 0, -0.6], [1.7, 1.2, 0.6]],
  build(kit, world) { world.add('bench', buildEvapBench()); return {}; },
  beats: [
    { text: '증발 접시 두 개에 같은 양의 물을 담았어요. 왼쪽은 바닷물, 오른쪽은 수돗물이에요. 둘 다 투명해서 눈으로는 잘 구별되지 않아요.', show: ['bench'], dur: 7,
      reset(o) { o.bench.userData.set({ ml: 20, heat: 0, p: 0 }); },
      anim(p, o) { o.bench.userData.set({ t: p * 7 }); } },
    { text: '전열기로 가열해 물을 모두 날려 보내면 접시에 무엇이 남을까요? 두 접시가 같을지 먼저 예상해요.', show: ['bench'], dur: 6,
      anim(p, o) { o.bench.userData.set({ t: 7 + p * 6 }); } },
    { text: '물이 모두 날아가자 바닷물 접시에만 흰 알갱이가 남았어요. 수돗물 접시에는 거의 아무것도 남지 않았어요.', show: ['bench'], dur: 9,
      reset(o) { o.bench.userData.set({ ml: 20, heat: 0, p: 0 }); },
      anim(p, o) { o.bench.userData.set({ heat: p < 0.9 ? 1 : 0, p, t: 13 + p * 9 }); } },
    { text: '바닷물을 두 배(40 mL)로 담으면 흰 알갱이도 더 많이 남아요. 바닷물에는 소금 같은 물질이 녹아 있어서 짠맛이 나요.', show: ['bench'], dur: 8,
      reset(o) { o.bench.userData.set({ ml: 40, heat: 0, p: 0 }); },
      anim(p, o) { o.bench.userData.set({ ml: 40, heat: p < 0.9 ? 1 : 0, p, t: 22 + p * 8 }); } },
  ],
};
