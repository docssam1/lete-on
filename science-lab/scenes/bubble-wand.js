import { THREE, label, relabel, roundedBoxGeometry, clamp01, lerp } from './_kit.js';
import { fresnel, lathe, round, labTable, labTray, beakerMesh, reagentBottle } from './glassware.js';
import { ADDS, SHORT, TRIALS, bubbleModel, MAX_LIFE } from './bubble-model.js';
export { ADDS, SHORT, TRIALS, bubbleModel, MAX_LIFE };
// 비눗방울 탐구(5-2 Ⅰ 재미있는 나의 탐구) — 지도자료 1부 「비눗방울 탐구」.
// 같은 비눗물(물비누 1 : 따뜻한 물 6)에 아무것도 넣지 않음 · 설탕 · 글리세린을 섞어 고리로 방울을 불고, 터지기까지 시간을 잰다.
// 방울은 떠오르며 막이 얇아져 색이 바뀌다가(빛의 간섭) 터진다. 글리세린 방울이 가장 오래 간다.
const RING_Y = 1.15, BR = 0.42, POP = 3;   // 고리 높이 · 다 부푼 방울 반지름 · 터진 물방울이 흩어지는 시간(초)

// 무지개 막 방울: 막이 얇아질수록(나이 → 1) 간섭 색이 바뀐다
// 비누막 셰이더: 보는 각도와 막 두께에 따라 무지개색(얇은 막 간섭을 단순하게 흉내) · 가운데는 투명, 가장자리는 진하게 · 밝은 반짝임.
// 막은 아래로 흘러내려 위쪽이 얇다. age(0~1)가 커질수록 막이 얇아져 색이 바뀌고 옅어진다.
export function bubbleMat() {
  return new THREE.ShaderMaterial({
    uniforms: { uAge: { value: 0 }, uTime: { value: 0 } },
    vertexShader: `varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = -mv.xyz; vP = normalize(position); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform float uAge; uniform float uTime; varying vec3 vN; varying vec3 vV; varying vec3 vP;
      void main() {
        vec3 n = normalize(vN), v = normalize(vV); if (!gl_FrontFacing) n = -n;
        float c = abs(dot(n, v)), fr = pow(1.0 - c, 2.0);
        float th = mix(1.5, 0.55, uAge) * (0.7 + 0.45 * (0.5 - 0.5 * vP.y)) + 0.12 * sin(vP.x * 7.0 + uTime * 0.9) + 0.09 * sin(vP.z * 9.0 - uTime * 1.3);
        vec3 film = 0.5 + 0.5 * cos(6.2831 * (th / mix(0.55, 1.0, c) * 1.6 + vec3(0.0, 0.33, 0.67)));
        vec3 L = normalize(vec3(0.45, 0.8, 0.55)), H = normalize(L + v); float sp = pow(max(dot(n, H), 0.0), 90.0);
        vec3 L2 = normalize(vec3(-0.6, -0.2, 0.7)), H2 = normalize(L2 + v); float sp2 = pow(max(dot(n, H2), 0.0), 40.0) * 0.35;
        vec3 col = film * (0.55 + 0.6 * fr) + vec3(sp + sp2) * 1.4;
        float a = clamp((0.05 + fr * 0.8) * (1.0 - 0.35 * uAge) + sp + sp2, 0.0, 1.0);
        gl_FragColor = vec4(col, a);
        #include <colorspace_fragment>
      }`,
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
  });
}
// 비눗방울 고리(손잡이 달린 플라스틱 막대)
function wand(color) {
  const g = new THREE.Group(), m = new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 0.8 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 16, 64), m); g.add(ring);
  const film = new THREE.Mesh(new THREE.CircleGeometry(0.29, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.16, iridescence: 1, iridescenceThicknessRange: [250, 800], clearcoat: 1, depthWrite: false, side: THREE.DoubleSide })); film.renderOrder = 8; g.add(film);   // 고리에 걸린 얇은 비누막
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 12), m); stick.position.set(0.2, -0.78, 0); stick.rotation.z = 0.42; g.add(stick);
  g.userData.film = film; return g;
}
// 한 자리: 비눗물 컵 + 고리 + 방울 + 터진 물방울
function station(add) {
  const g = new THREE.Group();
  const TINT = [0xd6ecf7, 0xf3e7c8, 0xd9f0dc], RING = [0xe0559b, 0x3a8ad8, 0x2fae6b];
  const cup = beakerMesh({ r: 0.42, h: 0.62, water: 0.36, tint: TINT[add] }); g.add(cup);
  const foam = new THREE.Mesh(lathe(round([[0, 0.42], [0.25, 0.41, 0.08], [0.38, 0.39]]), 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.4, transparent: true, opacity: 0.65, iridescence: 0.6, iridescenceThicknessRange: [200, 700] })); g.add(foam);
  const w = wand(RING[add]); w.position.set(0, RING_Y, 0.05); g.add(w);
  const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 40), bubbleMat()); bubble.renderOrder = 9; g.add(bubble);
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), fresnel(new THREE.MeshPhysicalMaterial({ color: 0xe6f4ff, roughness: 0.05, transparent: true, opacity: 0.6, clearcoat: 1, depthWrite: false }), { edge: 0.9 }), 22); drops.count = 0; drops.renderOrder = 9; g.add(drops);
  const dir = Array.from({ length: 22 }, (_, i) => { const a = i * 2.399963, z = 1 - (i + 0.5) / 11; return new THREE.Vector3(Math.cos(a) * Math.sqrt(Math.max(0, 1 - z * z)), z * 0.8, Math.sin(a) * Math.sqrt(Math.max(0, 1 - z * z))); });
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  // grow: 부는 정도(0~1) · sim: 분 뒤 지난 시간(초) · life: 이 방울의 수명(초) · t: 흔들림
  let cur = add;
  g.userData.setAdd = (a) => { if (a === cur) return; cur = a; w.traverse((o) => { if (o.material?.color && o !== w.userData.film) o.material.color.set(RING[a]); }); cup.userData.water?.material.color.set(TINT[a]); };
  g.userData.setState = ({ grow = 0, sim = 0, life = 10, t = 0 }) => {
    const rise = 1.15 * (1 - Math.exp(-sim / 10)), x = Math.sin(t * 0.7 + add) * 0.1 * Math.min(1, sim / 3), y = RING_Y + 0.08 + BR * grow + rise;
    const alive = grow > 0 && sim < life, popK = sim >= life ? (sim - life) / POP : -1;
    bubble.visible = alive; bubble.position.set(x, y, 0.05); bubble.scale.setScalar(Math.max(0.001, BR * grow)); bubble.scale.y *= 1 - 0.08 * Math.sin(t * 3) * (1 - Math.min(1, sim));
    const age = clamp01(sim / life); bubble.material.uniforms.uAge.value = age; bubble.material.uniforms.uTime.value = t;
    w.userData.film.visible = grow < 0.05;
    let n = 0;
    if (popK >= 0 && popK < 1) for (const d of dir) { P.copy(d).multiplyScalar(BR * (0.6 + popK * 1.4)).add(new THREE.Vector3(x, y - popK * popK * 0.6, 0.05)); SC.setScalar(0.022 * (1 - popK)); M.compose(P, Q, SC); drops.setMatrixAt(n++, M); }
    drops.count = n; drops.instanceMatrix.needsUpdate = true;
  };
  g.userData.setState({});
  g.userData.wand = w;
  return g;
}
// 소품: 물비누 펌프 병
function soapBottle() {
  const b = new THREE.Group();
  b.add(new THREE.Mesh(lathe(round([[0, 0], [0.3, 0, 0.05], [0.32, 0.8, 0.1], [0.12, 0.98, 0.05], [0.12, 1.05], [0, 1.05]]), 48), new THREE.MeshPhysicalMaterial({ color: 0xf6a5c0, roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.85 })));
  const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 12), new THREE.MeshStandardMaterial({ color: 0xffffff })); pump.position.y = 1.15; b.add(pump);
  const nozzle = new THREE.Mesh(roundedBoxGeometry(0.28, 0.08, 0.08, 0.03), new THREE.MeshStandardMaterial({ color: 0xffffff })); nozzle.position.set(0.1, 1.28, 0); b.add(nozzle);
  b.traverse((o) => { o.userData.noFrame = true; }); return b;
}

// adds: 자리마다 넣은 것(0 없음 · 1 설탕 · 2 글리세린). 실험실은 [i] 하나, 장면은 [0, 1, 2]
export function buildBubbleRig({ adds = [0, 1, 2], props = true } = {}) {
  const g = new THREE.Group(), n = adds.length, GAP = 1.85;
  const table = labTable(n > 1 ? 6.6 : 5.4, 3.0); g.add(table);
  const tray = labTray(n > 1 ? 5.6 : 2.2, 1.7); tray.position.set(0, 0, 0.05); g.add(tray);
  const st = adds.map((a, i) => { const s = station(a); s.position.set((i - (n - 1) / 2) * GAP, 0.025, 0); g.add(s); return s; });
  const extra = [];
  if (props) {
    const soap = soapBottle(); soap.position.set(n > 1 ? -3.0 : -1.75, 0, -0.9); g.add(soap);
    const gly = reagentBottle('글리세린', 'glycerin', 0xe9edf0, 0x2f7d4f, '#2f7d4f'); gly.position.set(n > 1 ? 3.0 : 1.75, 0, -0.95); gly.rotation.y = -0.4; g.add(gly);
    extra.push(soap, gly);
  }
  const tags = st.map((s, i) => { const t = label(SHORT[adds[i]], { size: 0.2 }); t.position.set(s.position.x, 0.12, 0.85); g.add(t); return t; });
  const clock = label('0초', { size: 0.26 }); clock.position.set(n > 1 ? 0 : 1.15, 2.95, 0.2); g.add(clock);
  const S = { adds: adds.slice(), grow: 0, sim: 0, t: 0, trial: -1 };
  let key = '', ck = '';
  const draw = () => {
    st.forEach((s, i) => { s.userData.setAdd(S.adds[i]); const m = bubbleModel(ADDS[S.adds[i]]); s.userData.setState({ grow: S.grow, sim: S.sim, life: S.trial >= 0 ? m.trials[S.trial] : m.mean, t: S.t + i }); });
    const k = S.adds.join(); if (k !== key) { key = k; tags.forEach((t, i) => relabel(t, SHORT[S.adds[i]], { size: 0.2 })); }
    const c = S.grow > 0 ? `${Math.floor(S.sim)}초` : '0초'; if (c !== ck) { ck = c; relabel(clock, c, { size: 0.26 }); }
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, tags, clock, stations: st, props: extra };
  return g;
}

// 비누막을 잘라 크게 본 그림: 비누 분자 두 겹(머리는 물 쪽, 꼬리는 바깥) 사이의 물 층.
// 왼쪽(그냥 비눗물)은 물이 많이 증발하고, 오른쪽(글리세린)은 글리세린이 물을 붙잡아 덜 증발한다.
export function buildFilmView() {
  const g = new THREE.Group(), W = 4.4, Y = 1.35, TH = 0.62;
  const water = new THREE.Mesh(roundedBoxGeometry(W, TH, 0.7, 0.08), new THREE.MeshPhysicalMaterial({ color: 0x8fc4ea, roughness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false })); water.position.y = Y; g.add(water);
  const divider = new THREE.Mesh(new THREE.BoxGeometry(0.02, 1.9, 0.02), new THREE.MeshBasicMaterial({ color: 0x5b6577 })); divider.position.set(0, Y + 0.2, 0.4); g.add(divider);
  const headM = new THREE.MeshPhysicalMaterial({ color: 0x3346a0, roughness: 0.3, clearcoat: 0.6 }), tailM = new THREE.MeshStandardMaterial({ color: 0xe8a33a, roughness: 0.5 });
  for (let i = 0; i < 26; i++) for (const s of [1, -1]) {
    const x = -W / 2 + 0.12 + i * (W - 0.24) / 25, m = new THREE.Group();
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), headM); m.add(head);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.34, 8), tailM); tail.position.y = 0.2; m.add(tail);
    m.position.set(x, Y + s * (TH / 2), 0.36); if (s < 0) m.rotation.z = Math.PI; g.add(m);
  }
  const gly = new THREE.MeshPhysicalMaterial({ color: 0x2fae6b, roughness: 0.3, clearcoat: 0.6 });
  for (let i = 0; i < 14; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), gly); b.position.set(0.25 + (i % 7) * 0.28, Y - 0.12 + Math.floor(i / 7) * 0.22, 0.36); g.add(b); }
  const vap = new THREE.InstancedMesh(new THREE.SphereGeometry(0.05, 10, 8), new THREE.MeshPhysicalMaterial({ color: 0x6fb2e6, roughness: 0.2, transparent: true, opacity: 0.8 }), 40); g.add(vap);
  const names = { soap: label('비누 분자(머리는 물 쪽)', { size: 0.19 }), water: label('막 속의 물', { size: 0.19 }), vap: label('증발하는 물', { size: 0.19 }), gly: label('글리세린이 물을 붙잡아요', { size: 0.19 }) };
  names.soap.position.set(-2.95, Y + 0.55, 0.4); names.water.position.set(-2.85, Y - 0.05, 0.4); names.vap.position.set(-1.1, Y + 1.45, 0.4); names.gly.position.set(1.25, Y - 0.75, 0.4);
  const side = { a: label('그냥 비눗물', { size: 0.21 }), b: label('글리세린 넣은 비눗물', { size: 0.21 }) };
  side.a.position.set(-1.1, Y - 1.05, 0.4); side.b.position.set(1.1, Y - 1.05, 0.4);
  for (const x of [...Object.values(names), ...Object.values(side)]) g.add(x);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), P = new THREE.Vector3(), SC = new THREE.Vector3();
  const set = ({ t = 0 } = {}) => {
    let n = 0;
    for (let i = 0; i < 40; i++) { const left = i < 32, life = (t * (left ? 0.35 : 0.18) + i * 0.137) % 1, x = left ? -2.0 + (i % 8) * 0.25 : 0.4 + (i % 8) * 0.22;
      P.set(x + Math.sin(t + i) * 0.05, Y + TH / 2 + 0.3 + life * 1.1, 0.36); SC.setScalar(1 - life * 0.6); M.compose(P, Q, SC); vap.setMatrixAt(n++, M); }
    vap.count = n; vap.instanceMatrix.needsUpdate = true;
  };
  set();
  g.userData = { set, names };
  return g;
}

export default {
  view: { theta: 0.18, phi: 1.25 }, revealAt: 2,
  frame: [[-2.6, -0.1, -0.8], [2.6, 3.0, 0.9]],
  build(kit, world) { world.add('rig', buildBubbleRig()); world.add('film', buildFilmView()); return {}; },
  beats: [
    { text: '물비누 1숟가락과 따뜻한 물 6숟가락으로 만든 같은 비눗물 세 컵에 아무것도 넣지 않거나, 설탕이나 글리세린을 1숟가락씩 섞었어요.', show: ['rig'], hide: ['film'], dur: 6,
      reset(o) { o.rig.userData.set({ grow: 0, sim: 0, t: 0, trial: -1 }); },
      anim(p, o) { o.rig.userData.set({ grow: 0, sim: 0, t: p * 6 }); } },
    { text: '같은 고리로 같은 크기의 방울을 불면, 어느 비눗물의 방울이 가장 오래 갈까요? 먼저 예상해요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ grow: Math.min(1, p * 2), sim: 0, t: 6 + p * 5 }); } },
    { text: '그냥 비눗물 방울은 10초쯤 만에 터지고, 설탕 방울은 그보다 오래, 글리세린 방울은 1분 가까이 떠 있어요. 터지기 전에 막의 색이 바뀌어요.', show: ['rig'], dur: 12,
      anim(p, o) { o.rig.userData.set({ grow: 1, sim: p * 64, t: 11 + p * 12 }); } },
    { text: '비누막을 잘라 크게 보면, 비누 분자 두 겹 사이에 물이 끼어 있어요. 이 물이 증발해 막이 얇아지면 터져요. 글리세린은 물을 붙잡아 증발을 늦춰요.', show: ['film'], hide: ['rig'], dur: 9,
      anim(p, o) { o.film.userData.set({ t: p * 9 }); } },
    { text: '「무엇을 넣으면 비눗방울이 오래 갈까?」처럼 궁금한 것을 실험으로 확인할 수 있는 문제로 바꾸고, 한 가지만 바꾸어 여러 번 재면 나만의 탐구가 돼요.', show: ['rig'], hide: ['film'], dur: 7,
      anim(p, o) { o.rig.userData.set({ grow: 1, sim: 64, t: 23 + p * 7 }); } },
  ],
};
