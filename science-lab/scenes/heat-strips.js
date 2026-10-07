import { THREE, mat, glassMat, label, relabel, roundedBoxGeometry, puffCloud, clamp01, lerp, seg } from './_kit.js';
import { MATERIALS, WATERS, CELLS, heatModel, cellColor, wetColor } from './heat-model.js';
export { MATERIALS, WATERS, CELLS, heatModel, cellColor, wetColor };
// 온도와 열(5-1 Ⅱ) — 원본 4-D 「눈에 보이는 열」·「물과 공기에서의 대류」.
// 왼쪽: 투명 컵의 물에 구리 테이프·알루미늄 테이프·OHP 필름 띠를 나무젓가락에 매달아 함께 담근다. 띠마다 시온 스티커 8칸(아래 2칸은 물속).
// 오른쪽(장면에서만): 따뜻한 물(빨강) 병 위에 찬물(노랑) 병을 거꾸로 올리고 칸막이를 빼면 빨간 물이 위로 올라간다(대류).
const STICK = [0x2f5fd0, 0xf28a2e, 0xf5c518];        // 시온 스티커: 파랑 · 주황 · 노랑
const WATER_Y = 0.95, CELL = 0.22, PITCH = 0.3, Y0 = 0.42, NCELL = CELLS + 2;
const XS = { '구리 테이프': -0.42, '알루미늄 테이프': 0, 'OHP 필름': 0.42 };
const SHORT = { '구리 테이프': '구리', '알루미늄 테이프': '알루미늄', 'OHP 필름': 'OHP 필름' };
const rnd = (i, k = 1) => { const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return s - Math.floor(s); };

function bottle(color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.8, 32, 1, true), glassMat(0xe8f1f8, 0.3)); body.position.y = 0.4; g.add(body);
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.36, 0.25, 32, 1, true), glassMat(0xe8f1f8, 0.3)); shoulder.position.y = 0.925; g.add(shoulder);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 24, 1, true), glassMat(0xe8f1f8, 0.3)); neck.position.y = 1.125; g.add(neck);
  const liqMat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.15, transparent: true, opacity: 0.82 });
  const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.78, 32), liqMat); liq.position.y = 0.4; g.add(liq);
  const liq2 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.34, 0.24, 32), liqMat); liq2.position.y = 0.92; g.add(liq2);
  const liq3 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.17, 24), liqMat); liq3.position.y = 1.12; g.add(liq3);
  g.userData.liq = liqMat; return g;
}

export function buildHeat() {
  const g = new THREE.Group();
  const table = new THREE.Mesh(roundedBoxGeometry(7.2, 0.12, 3.0, 0.05), mat(0xe6dcc8, { roughness: 0.85 })); table.position.y = -0.06; table.userData.noFrame = true; g.add(table);
  // ── 전도: 투명 컵 · 물 · 나무젓가락 · 띠 세 장
  const cupA = new THREE.Group();
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.62, 1.25, 40, 1, true), glassMat(0xeef5fb, 0.28));   // 투명 컵: 물에 잠긴 칸도 보이게 cup.position.y = 0.625; cupA.add(cup);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.025, 8, 48), mat(0xf0ece2)); rim.rotation.x = Math.PI / 2; rim.position.y = 1.25; cupA.add(rim);
  const waterMat = new THREE.MeshPhysicalMaterial({ color: 0xf3b98a, roughness: 0.1, transparent: true, opacity: 0.45, clearcoat: 1, depthWrite: false });
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.62, WATER_Y - 0.02, 40), waterMat); water.position.y = (WATER_Y - 0.02) / 2 + 0.01; water.renderOrder = 3; cupA.add(water);
  const stick = new THREE.Mesh(roundedBoxGeometry(2.0, 0.08, 0.12, 0.03), mat(0xd9b27a, { roughness: 0.8 })); stick.position.set(0, 3.0, 0); cupA.add(stick);
  const steam = puffCloud(24, { color: 0xffffff, opacity: 1, soft: 0.8 }); cupA.add(steam);
  const strips = {};
  for (const m of MATERIALS) {
    const s = new THREE.Group();
    const look = m === '구리 테이프' ? mat(0xc87a46, { metalness: 0.75, roughness: 0.32 }) : m === '알루미늄 테이프' ? mat(0xcdd3db, { metalness: 0.75, roughness: 0.3 }) : glassMat(0xeaf6ff, 0.45);
    const band = new THREE.Mesh(new THREE.BoxGeometry(0.28, 2.62, 0.014), look); band.position.y = 0.36 + 1.31; s.add(band);
    const cells = [];
    for (let k = 0; k < NCELL; k++) {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(CELL, CELL), new THREE.MeshStandardMaterial({ color: STICK[0], roughness: 0.6 }));
      c.position.set(0, Y0 + CELL / 2 + k * PITCH, 0.009); s.add(c); cells.push(c);
    }
    s.position.x = XS[m]; cupA.add(s); strips[m] = { group: s, cells };
  }
  cupA.position.x = -1.3; g.add(cupA);
  const names = {};
  MATERIALS.forEach((m) => { const l = label(SHORT[m], { size: 0.24 }); l.position.set(-1.3, 3.3, 0); g.add(l); names[m] = l; });   // 띠 하나만 보일 때(실험실)
  const setName = label('왼쪽부터 구리 · 알루미늄 · OHP 필름', { size: 0.24 }); setName.position.set(-1.3, 3.35, 0); g.add(setName);   // 세 띠를 함께 볼 때(장면)
  const waterLabel = label('뜨거운 물', { size: 0.24 }); waterLabel.position.set(-1.3, 0.55, 0.95); g.add(waterLabel);

  // ── 대류: 두 병(장면에서만 보인다)
  const conv = new THREE.Group();
  const low = bottle(0xd8433b), up = bottle(0xf3c63a); up.rotation.z = Math.PI; up.position.y = 2.5; conv.add(low, up);
  const plume = puffCloud(40, { color: 0xd8433b, opacity: 1, soft: 0.5, renderOrder: 6 }); conv.add(plume);
  const cLow = label('따뜻한 물(빨강)', { size: 0.22 }), cUp = label('찬물(노랑)', { size: 0.22 });
  cLow.position.set(0.75, 0.45, 0); cUp.position.set(0.7, 2.05, 0); conv.add(cLow, cUp);
  conv.position.x = 1.9; g.add(conv);

  const S = { water: '뜨거운 물', p: 0, t: 0, only: null, conv: false, mix: 0, warmTop: false };
  const red = new THREE.Color(0xd8433b), yel = new THREE.Color(0xf3c63a), orange = new THREE.Color(0xec8a3a), tmp = new THREE.Color();
  const draw = () => {
    const hot = S.water === '뜨거운 물';
    waterMat.color.set(hot ? 0xf3b98a : 0xf6dcc2); relabel(waterLabel, hot ? '뜨거운 물(약 70 ℃)' : '미지근한 물(약 50 ℃)', { size: 0.24 });
    setName.visible = !S.only;
    for (const m of MATERIALS) {
      const vis = !S.only || S.only === m; strips[m].group.visible = vis;
      strips[m].group.position.x = S.only ? 0 : XS[m]; names[m].visible = S.only === m;
      strips[m].cells.forEach((c, k) => {
        const col = k < 2 ? (S.p > 0 ? wetColor(S.water) : 0) : cellColor(m, S.water, k - 2, S.p);
        c.material.color.setHex(STICK[col]);
      });
    }
    // 김(뜨거운 물일 때만, 담근 뒤)
    let n = 0;
    if (hot && S.p > 0) for (let i = 0; i < 24; i++) {
      const life = (S.t * 0.35 + rnd(i, 3)) % 1, a = rnd(i, 4) * Math.PI * 2, r = 0.5 * rnd(i, 5);
      steam.userData.set(n++, Math.cos(a) * r + (S.only ? 0 : 0) + 0.3 * Math.sin(life * 3 + i), 1.3 + life * 1.2, Math.sin(a) * r * 0.6 + 0.35, 0.35 + life * 0.5, 0.18 * Math.sin(life * Math.PI));
    }
    steam.userData.commit(n);
    // 대류
    conv.visible = S.conv;
    const lowCol = S.warmTop ? yel : red, upCol = S.warmTop ? red : yel;
    low.userData.liq.color.copy(lowCol); cLow.position.y = 0.45; relabel(cLow, S.warmTop ? '찬물(노랑)' : '따뜻한 물(빨강)', { size: 0.22 }); relabel(cUp, S.warmTop ? '따뜻한 물(빨강)' : '찬물(노랑)', { size: 0.22 });
    up.userData.liq.color.copy(tmp.copy(upCol).lerp(orange, S.warmTop ? 0 : S.mix * 0.85));
    n = 0;
    if (S.conv && !S.warmTop && S.mix > 0 && S.mix < 1) for (let i = 0; i < 40; i++) {
      const life = (S.t * 0.5 + rnd(i, 7)) % 1, y = 1.05 + life * 1.3 * Math.min(1, S.mix * 2.5);
      const w = 0.06 + life * 0.25, x = Math.sin(i * 1.7 + S.t * 2 + life * 6) * w;
      plume.userData.set(n++, x, y, Math.cos(i * 2.3) * w * 0.6, 0.18 + life * 0.25, 0.75 * (1 - life * 0.6));
    }
    plume.userData.commit(n);
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, strips, names };
  return g;
}

export default {
  view: { theta: 0.3, phi: 1.2 }, revealAt: 2,
  frame: [[-2.3, 0, -0.9], [2.4, 3.6, 0.9]],
  build(kit, world) { world.add('rig', buildHeat()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용한다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '구리 테이프, 알루미늄 테이프, OHP 필름 띠에 온도에 따라 색이 변하는 시온 스티커를 붙였어요. 40 ℃보다 낮으면 파랑, 40~60 ℃는 주황, 60 ℃ 이상은 노랑이에요.', show: ['rig'], dur: 7,
      reset(o) { o.rig.userData.set({ water: '뜨거운 물', p: 0, t: 0, only: null, conv: false, mix: 0, warmTop: false }); } },
    { text: '세 띠를 뜨거운 물에 동시에 담그면 어느 띠의 스티커 색이 가장 먼저, 가장 높이 변할까요? 먼저 예상해요.', show: ['rig'], dur: 5 },
    { text: '물에 잠긴 칸은 바로 노랗게 변하고, 구리 띠는 색이 가장 빨리 위로 올라가요. 알루미늄이 그다음이고, OHP 필름은 물 위 칸이 거의 그대로예요.', show: ['rig'], dur: 8,
      anim(p, o) { o.rig.userData.set({ p, t: p * 8 }); } },
    { text: '열은 온도가 높은 곳에서 낮은 곳으로, 고체를 따라 이동해요. 이것을 전도라고 해요. 금속은 열을 빠르게, 플라스틱은 느리게 전달해요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ t: 8 + p * 6 }); } },
    { text: '이번엔 물이에요. 빨간 따뜻한 물 병 위에 노란 찬물 병을 거꾸로 올리고 칸막이를 빼면, 빨간 물이 아지랑이처럼 위로 올라가요.', show: ['rig'], dur: 7,
      anim(p, o) { o.rig.userData.set({ conv: true, warmTop: false, mix: p, t: 14 + p * 7 }); } },
    { text: '따뜻해진 물과 공기는 위로 올라가고 찬 것은 아래로 내려오며 열을 옮겨요. 이것이 대류예요. 그래서 난로는 아래에, 에어컨은 위에 달아요.', show: ['rig'], dur: 7,
      anim(p, o) { o.rig.userData.set({ conv: true, warmTop: false, mix: 1, t: 21 + p * 7 }); } },
  ],
};
