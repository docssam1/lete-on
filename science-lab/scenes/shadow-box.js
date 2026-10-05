import { THREE, mat, glassMat, label, roundedBoxGeometry } from './_kit.js';
// 그림자 살펴보기(4-2 Ⅲ 그림자와 거울) — 손전등 · 막대에 꽂은 종이 인형 · 눈금 스크린.
// 원본 3-F 「그림자 놀이 상자」: 손전등과 막(벽)은 그대로 두고 물체만 앞뒤로 옮긴다.
// 그림자 크기는 실제 기하로 계산한다: 손전등(점광원) → 크기 = 물체 크기 × (빛~스크린)/(빛~물체), 햇빛(평행광) → 물체 크기 그대로.
import { LIGHT_X, SCREEN_X, EYE_Y, FIG_H, PLACES, shadowCm } from './shadow-box-model.js';
export { LIGHT_X, SCREEN_X, EYE_Y, FIG_H, PLACES, shadowCm };

// 종이 인형 모양(사람 실루엣) — 원본의 클립·절연테이프 모양 대신 알아보기 쉬운 모양
function figShape(h) {
  const s = new THREE.Shape(), u = h / 10;
  s.moveTo(-1.2 * u, 0); s.lineTo(-0.5 * u, 0); s.lineTo(-0.3 * u, 3.2 * u); s.lineTo(0.3 * u, 3.2 * u); s.lineTo(0.5 * u, 0); s.lineTo(1.2 * u, 0);
  s.lineTo(0.8 * u, 4.2 * u); s.lineTo(2.2 * u, 6.6 * u); s.lineTo(1.6 * u, 7.0 * u); s.lineTo(0.7 * u, 5.6 * u); s.lineTo(0.7 * u, 6.9 * u);
  s.absarc(0, 8.4 * u, 1.3 * u, -Math.PI / 2 + 0.5, Math.PI * 1.5 - 0.5, false);
  s.lineTo(-0.7 * u, 6.9 * u); s.lineTo(-0.7 * u, 5.6 * u); s.lineTo(-1.6 * u, 7.0 * u); s.lineTo(-2.2 * u, 6.6 * u); s.lineTo(-0.8 * u, 4.2 * u); s.lineTo(-1.2 * u, 0);
  return s;
}
// 스크린 눈금(0~20 cm, 5 cm마다 숫자). 0 = 스크린 아래쪽 기준선.
function rulerTexture() {
  const c = document.createElement('canvas'); c.width = 128; c.height = 1024; const g = c.getContext('2d');
  g.fillStyle = '#334155'; g.strokeStyle = '#334155'; g.lineWidth = 4; g.font = 'bold 44px sans-serif'; g.textBaseline = 'middle';
  for (let cm = 0; cm <= 20; cm++) {
    const y = 1000 - cm * 47.5, major = cm % 5 === 0;
    g.beginPath(); g.moveTo(0, y); g.lineTo(major ? 46 : 26, y); g.stroke();
    if (major) g.fillText(String(cm), 54, y);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export function buildShadowBox() {
  const g = new THREE.Group();
  // 바닥판(실험대) — 맞춤에서 뺀다
  const board = new THREE.Mesh(roundedBoxGeometry(7.4, 0.12, 2.4, 0.05), mat(0xd9c7a6, { roughness: 0.85 }));
  board.position.set(0, -0.06, 0); board.userData.noFrame = true; g.add(board);
  // 손전등: 몸통 · 머리 · 유리(빛나는 면) · 받침
  const torch = new THREE.Group(), dark = mat(0x23262b, { roughness: 0.45, metalness: 0.4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.9, 24), dark); body.rotation.z = Math.PI / 2; body.position.x = -0.45; torch.add(body);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.17, 0.32, 28), dark); head.rotation.z = Math.PI / 2; head.position.x = 0.12; torch.add(head);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.25, 28), new THREE.MeshBasicMaterial({ color: 0xfff6d0 })); lens.rotation.y = Math.PI / 2; lens.position.x = 0.285; torch.add(lens);
  const knob = new THREE.Mesh(roundedBoxGeometry(0.16, 0.06, 0.1, 0.02), mat(0xd14b3a)); knob.position.set(-0.5, 0.17, 0); torch.add(knob);
  const cradle = new THREE.Mesh(roundedBoxGeometry(0.5, EYE_Y - 0.16, 0.42, 0.04), mat(0x8a6a48, { roughness: 0.8 })); cradle.position.set(-0.35, -(EYE_Y - 0.16) / 2 - 0.16, 0); torch.add(cradle);
  torch.position.set(LIGHT_X - 0.29, EYE_Y, 0); g.add(torch);
  // 해(햇빛 모드) — 손전등 대신 왼쪽 위 멀리. 평행한 빛줄기로 나타낸다
  const sun = new THREE.Mesh(new THREE.SphereGeometry(0.4, 28, 18), new THREE.MeshBasicMaterial({ color: 0xffc94a }));
  sun.position.set(LIGHT_X - 0.45, EYE_Y, 0); sun.visible = false; g.add(sun);
  // 빛: 손전등은 퍼지는 원뿔, 햇빛은 평행한 기둥(눈에 보이게 그린 모형)
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff1b8, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
  const L = SCREEN_X - LIGHT_X, coneR = 1.08;
  const cone = new THREE.Mesh(new THREE.ConeGeometry(coneR, L, 40, 1, true), beamMat); cone.rotation.z = Math.PI / 2; cone.position.set(LIGHT_X + L / 2, EYE_Y, 0); g.add(cone);
  cone.userData.noFrame = true;
  const rays = new THREE.Mesh(new THREE.BoxGeometry(L, 1.6, 1.4), beamMat); rays.position.set(LIGHT_X + L / 2, EYE_Y, 0); rays.visible = false; rays.userData.noFrame = true; g.add(rays);
  // 스크린: 흰 막(높이 2.2) + 검은 틀 + 받침 + 눈금. 아래 끝이 실험대 바로 위에 온다
  const scr = new THREE.Group(), SH = 2.2;
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.4, SH), mat(0xf7f5ef, { roughness: 0.95 })); sheet.rotation.y = -Math.PI / 2; scr.add(sheet);
  const frameMat = mat(0x2a2d33, { roughness: 0.5 });
  for (const z of [1.24, -1.24]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, SH + 0.16, 0.08), frameMat); bar.position.set(0.04, 0, z); scr.add(bar); }
  for (const y of [SH / 2 + 0.04, -SH / 2 - 0.04]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.56), frameMat); bar.position.set(0.04, y, 0); scr.add(bar); }
  const foot = new THREE.Mesh(roundedBoxGeometry(0.6, 0.06, 1.6, 0.02), frameMat); foot.position.set(0.12, -EYE_Y + 0.03, 0); scr.add(foot);
  const ruler = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2.156), new THREE.MeshBasicMaterial({ map: rulerTexture(), transparent: true, depthWrite: false }));
  ruler.rotation.y = -Math.PI / 2; ruler.position.set(-0.012, -SH / 2 + 0.05 - 0.05 + 1.078, 0.98); scr.add(ruler);
  // 빛이 닿은 밝은 자리(손전등은 둥근 빛, 햇빛은 고르게)
  const spot = new THREE.Mesh(new THREE.CircleGeometry(1.08, 48), new THREE.MeshBasicMaterial({ color: 0xfff8de, transparent: true, opacity: 0.9, depthWrite: false })); spot.rotation.y = -Math.PI / 2; spot.position.x = -0.006; scr.add(spot);
  scr.position.set(SCREEN_X, EYE_Y, 0); g.add(scr);
  // 물체: 나무 받침 · 꼬치막대 · 종이 인형(불투명) 또는 투명 필름 인형
  const fig = new THREE.Group();
  const shape = figShape(FIG_H);
  const paper = mat(0x2f6fd0, { roughness: 0.7, side: THREE.DoubleSide }), film = glassMat(0xd8f1ff, 0.28);
  const doll = new THREE.Mesh(new THREE.ShapeGeometry(shape), paper); doll.rotation.y = Math.PI / 2; doll.position.y = EYE_Y - FIG_H / 2; fig.add(doll);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, EYE_Y - FIG_H / 2, 10), mat(0xc8a46e)); stick.position.y = (EYE_Y - FIG_H / 2) / 2; fig.add(stick);
  const base = new THREE.Mesh(roundedBoxGeometry(0.34, 0.08, 0.34, 0.03), mat(0x8a6a48, { roughness: 0.8 })); base.position.y = 0.04; fig.add(base);
  fig.position.x = PLACES['가운데']; g.add(fig);
  // 스크린 위 그림자: 진한 본그림자 + 흐린 가장자리(반그림자). 손전등에 가까울수록 가장자리가 넓다
  const shGeo = new THREE.ShapeGeometry(shape);
  const umbra = new THREE.Mesh(shGeo, new THREE.MeshBasicMaterial({ color: 0x1f2430, transparent: true, opacity: 0.82, depthWrite: false }));
  const pen = new THREE.Mesh(shGeo, new THREE.MeshBasicMaterial({ color: 0x1f2430, transparent: true, opacity: 0.22, depthWrite: false }));
  for (const m of [pen, umbra]) { m.rotation.y = -Math.PI / 2; g.add(m); }
  // 꼬치막대의 그림자(가는 띠): 인형 그림자 아래에서 스크린 아래 끝까지
  const stickSh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x1f2430, transparent: true, opacity: 0.6, depthWrite: false }));
  stickSh.rotation.y = -Math.PI / 2; g.add(stickSh);
  const names = [label('손전등', { size: 0.27 }), label('물체', { size: 0.27 }), label('스크린', { size: 0.27 }), label('햇빛(나란히 오는 빛)', { size: 0.27 })];
  names[0].position.set(LIGHT_X - 0.5, EYE_Y + 0.62, 0); names[1].position.set(0, EYE_Y + 0.62, 0); names[2].position.set(SCREEN_X, EYE_Y + 1.5, 0); names[3].position.set(LIGHT_X - 0.45, EYE_Y + 0.75, 0);
  names.forEach((n) => g.add(n));

  const S = { light: '손전등', x: PLACES['가운데'], clear: false, lit: true };
  const draw = () => {
    const sunMode = S.light === '햇빛';
    torch.visible = !sunMode; sun.visible = sunMode; cone.visible = !sunMode && S.lit; rays.visible = sunMode && S.lit;
    names[0].visible = !sunMode; names[3].visible = sunMode;
    fig.position.x = S.x; names[1].position.x = S.x;
    doll.material = S.clear ? film : paper;
    spot.visible = S.lit; spot.scale.setScalar(sunMode ? 1.25 : 1);
    const k = sunMode ? 1 : (SCREEN_X - LIGHT_X) / (S.x - LIGHT_X);     // 확대 배율(실제 기하)
    const yc = sunMode ? EYE_Y : EYE_Y;                                     // 물체 가운데가 빛 높이 → 그림자도 같은 높이 가운데
    const blur = sunMode ? 0.02 : 0.03 * (k - 1);                          // 가까울수록 흐린 가장자리가 넓다
    for (const [m, extra] of [[umbra, 0], [pen, blur]]) {
      const s = k * (1 + extra * 2);
      m.scale.set(s, s, 1); m.position.set(SCREEN_X - 0.012 - (m === pen ? 0.002 : 0), yc - FIG_H * s / 2, 0);
      m.visible = S.lit;
    }
    umbra.material.opacity = !S.lit ? 0 : S.clear ? 0.07 : sunMode ? 0.92 : Math.max(0.72, 0.94 - 0.05 * (k - 1));
    pen.material.opacity = !S.lit || S.clear ? 0 : 0.3;
    // 막대 그림자: 위 끝 = 인형 그림자 아래, 아래 끝 = 스크린 아래 끝(0.05)까지. 굵기도 같은 배율
    const top = yc - FIG_H * k / 2, bot = 0.05, w = Math.min(0.12, 0.036 * k);
    stickSh.visible = S.lit && top > bot; stickSh.scale.set(w, Math.max(0.001, top - bot), 1); stickSh.position.set(SCREEN_X - 0.011, (top + bot) / 2, 0);
    stickSh.material.opacity = S.clear ? 0.5 : umbra.material.opacity * 0.85;
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, fig, names, torch, sun, cone, rays, umbra, pen, stickSh };
  return g;
}

export default {
  view: { theta: -0.6, phi: 1.3 }, revealAt: 2,
  frame: [[LIGHT_X - 1.0, 0, -1.4], [SCREEN_X + 0.4, 2.6, 1.4]],
  build(kit, world) { world.add('rig', buildShadowBox()); return {}; },
  // 비트마다 anim 으로 상태를 정한다(Player 는 앞 비트들의 anim(1)을 다시 적용해 되감기를 맞춘다. reset 은 첫 비트 것만 불린다)
  beats: [
    { text: '손전등 빛이 지나가는 길에 물체를 놓으면 스크린에 그림자가 생겨요.', show: ['rig'], dur: 5,
      reset(o) { o.rig.userData.set({ light: '손전등', x: PLACES['가운데'], clear: false, lit: true }); } },
    { text: '물체를 손전등 쪽으로 옮기면 그림자는 어떻게 될까요? 먼저 예상해요.', show: ['rig'], dur: 4 },
    { text: '물체가 손전등에 가까워지면 그림자가 커지고 가장자리가 흐려져요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ x: PLACES['가운데'] + (PLACES['빛 가까이'] - PLACES['가운데']) * p }); } },
    { text: '스크린 쪽으로 옮기면 그림자가 작아지고 선명해져요.', show: ['rig'], dur: 5,
      anim(p, o) { o.rig.userData.set({ x: PLACES['빛 가까이'] + (PLACES['스크린 가까이'] - PLACES['빛 가까이']) * p }); } },
    { text: '햇빛은 거의 나란히 들어와서, 물체를 옮겨도 그림자 크기가 거의 같아요.', show: ['rig'], dur: 6,
      anim(p, o) { o.rig.userData.set({ light: '햇빛', x: PLACES['스크린 가까이'] + (PLACES['빛 가까이'] - PLACES['스크린 가까이']) * p }); } },
  ],
};
