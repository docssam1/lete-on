// 4-1 Ⅰ 자석의 이용 — 고리 자석 탑: 같은 극은 밀어 내고(뜸), 다른 극은 끌어당긴다(붙음)
// 연필은 육각 기둥(노란 칠 + 깎은 나무 + 흑연 심), 받침은 나뭇결 원판, 고리 자석은 세라믹 회색에 모서리를 깎았다.
// 극은 색만으로 알리지 않는다 — 윗면·아랫면 데칼과 옆의 작은 표에 N/S 글자를 함께 쓴다.
import { PALETTE as P, label, arrow, THREE, mat } from './_kit.js';

const R_OUT = 0.9, R_IN = 0.28, T = 0.28, C = 0.022;       // 고리 바깥·안 반지름, 두께, 모서리 깎임
const COLORS = [0x3b6fd1, 0xf0b429, 0x3fae5b, 0xe0743a];   // 가상 실험실(2D)과 같은 고리 구별색 — 옆면 띠로만 쓴다
const N = 0xe24b4a, S = 0x3a6bc6;
const START = ['N', 'S', 'S', 'N'], TALL = ['N', 'S', 'N', 'S'];
const Y0 = [0.3, 0.98, 1.26, 2.09], Y1 = [0.3, 0.98, 1.76, 2.64];
const VIEW_TH = 0.5;                                        // 카메라가 있는 쪽(글자·표를 이쪽으로 돌린다)
const PEN_R = 0.2, PEN_TOP = 3.22;                          // 연필 외접 반지름, 칠한 부분 끝 높이
const LABEL_Y = 3.92;
const V2 = (x, y) => new THREE.Vector2(x, y);
const FONT = '"Pretendard", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';

function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function canvasTex(w, h, draw, repeat) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}

// ── 극 표시: 면 데칼(색 고리 + 글자 4개) · 옆 표(원 안의 글자) ─────────────
function poleFaceTex(pole) {
  const rIn = (R_IN + 0.05) / (R_OUT - 0.05) * 256, rMid = (rIn + 256) / 2;
  return canvasTex(512, 512, (c) => {
    const col = pole === 'N' ? ['#e25a55', '#c63d39'] : ['#4a7bd0', '#2f5aae'];
    const gr = c.createRadialGradient(256, 256, rIn, 256, 256, 256); gr.addColorStop(0, col[1]); gr.addColorStop(0.5, col[0]); gr.addColorStop(1, col[1]);
    c.fillStyle = gr; c.beginPath(); c.arc(256, 256, 255, 0, Math.PI * 2); c.arc(256, 256, rIn, 0, Math.PI * 2, true); c.fill();
    c.font = `900 150px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
    for (let k = 0; k < 4; k++) {                           // 글자 윗부분이 가운데를 향하게 — 카메라 쪽 글자가 바로 읽힌다
      const ph = VIEW_TH + Math.PI / 4 + k * Math.PI / 2;   // 카메라 정면은 비워 둔다(옆 표 자리)
      c.save(); c.translate(256 + Math.sin(ph) * rMid, 256 + Math.cos(ph) * rMid); c.rotate(-ph); c.scale(1, 0.8);
      c.lineWidth = 16; c.strokeStyle = 'rgba(20,24,32,0.55)'; c.strokeText(pole, 0, 6); c.fillStyle = '#ffffff'; c.fillText(pole, 0, 6); c.restore();
    }
  });
}
function poleBadgeTex(pole) {
  return canvasTex(128, 128, (c) => {
    c.fillStyle = 'rgba(15,23,42,0.25)'; c.beginPath(); c.arc(66, 68, 58, 0, Math.PI * 2); c.fill();
    c.fillStyle = pole === 'N' ? '#d9413d' : '#2f62c2'; c.beginPath(); c.arc(64, 64, 58, 0, Math.PI * 2); c.fill();
    c.lineWidth = 7; c.strokeStyle = '#ffffff'; c.beginPath(); c.arc(64, 64, 53, 0, Math.PI * 2); c.stroke();
    c.fillStyle = '#ffffff'; c.font = `900 80px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(pole, 64, 70);
  });
}
let POLE = null;                                            // 장면마다 새로 만든다(무대를 닫으면 재질이 정리되므로)
function poleKit() {
  const face = (p) => new THREE.MeshStandardMaterial({ map: poleFaceTex(p), transparent: true, roughness: 0.35, metalness: 0.05, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 });
  const badge = (p) => new THREE.SpriteMaterial({ map: poleBadgeTex(p), transparent: true, depthWrite: false });
  return { face: { N: face('N'), S: face('S') }, badge: { N: badge('N'), S: badge('S') } };
}

// ── 고리 자석 ────────────────────────────────────────────────
function ring(color) {
  const sh = new THREE.Shape(); sh.absarc(0, 0, R_OUT - C, 0, Math.PI * 2, false);
  const hole = new THREE.Path(); hole.absarc(0, 0, R_IN + C, 0, Math.PI * 2, true); sh.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T - 2 * C, bevelEnabled: true, bevelThickness: C, bevelSize: C, bevelSegments: 2, curveSegments: 48 });
  geo.translate(0, 0, C); geo.rotateX(-Math.PI / 2);        // 바닥 = 0, 윗면 = T
  const capM = new THREE.MeshPhysicalMaterial({ color: 0x70767d, roughness: 0.5, metalness: 0.1, clearcoat: 0.3 });
  const sideM = new THREE.MeshPhysicalMaterial({ color: 0x858b92, roughness: 0.26, metalness: 0.12, clearcoat: 0.8, clearcoatRoughness: 0.18 });
  const g = new THREE.Group(); const m = new THREE.Mesh(geo, [capM, sideM]); m.castShadow = m.receiveShadow = true; g.add(m);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(R_OUT + 0.003, R_OUT + 0.003, 0.07, 64, 1, true), new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, clearcoat: 0.6 }));
  band.position.y = T / 2; g.add(band);
  // 윗면·아랫면 극 표시 — 처음엔 숨겨 두었다가 설명 비트에서 보인다. 면 데칼 + 카메라 쪽 옆에 붙은 원형 표.
  const face = (y, top) => {
    const f = new THREE.Group(); f.position.y = y; f.visible = false;
    const d = new THREE.Mesh(new THREE.RingGeometry(R_IN + 0.05, R_OUT - 0.05, 64, 1), POLE.face.N); d.rotation.x = top ? -Math.PI / 2 : Math.PI / 2; d.renderOrder = 1; f.add(d);
    const b = new THREE.Sprite(POLE.badge.N); b.scale.setScalar(0.3); b.renderOrder = 2;
    f.add(b); f.userData = { decal: d, badge: b }; g.add(f); return f;
  };
  g.userData = { top: face(T + 0.002, true), bot: face(-0.002, false), up: 'N' };
  placeBadge(g.userData.top, 0); placeBadge(g.userData.bot, 0);
  return g;
}
// 옆 표는 카메라 쪽 앞에 한 줄로 선다. 두 고리가 붙어 있으면 마주 보는 두 표가 겹치지 않게 좌우로 벌린다.
const _right = new THREE.Vector3(Math.cos(VIEW_TH), 0, -Math.sin(VIEW_TH)), _front = new THREE.Vector3(Math.sin(VIEW_TH), 0, Math.cos(VIEW_TH));
function placeBadge(face, side) {
  const b = face.userData.badge; if (b.userData.side === side) return;
  b.userData.side = side; b.position.copy(_front).multiplyScalar(R_OUT + 0.16).addScaledVector(_right, side * 0.17); b.position.y = 0;
}
function setUp(r, up) {
  const { top, bot } = r.userData, dn = up === 'N' ? 'S' : 'N';
  r.userData.up = up;
  top.userData.decal.material = POLE.face[up]; top.userData.badge.material = POLE.badge[up];
  bot.userData.decal.material = POLE.face[dn]; bot.userData.badge.material = POLE.badge[dn];
}

// ── 연필(육각 기둥 + 깎은 나무 + 흑연 심) ─────────────────────────
function pencil() {
  const g = new THREE.Group(), L = PEN_TOP - 0.18;         // 받침 속 0.12 까지 박혀 있다
  const paint = canvasTex(512, 2048, (c, w, h) => {
    c.fillStyle = '#f2c230'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {                            // 면 경계는 살짝 어둡게, 가운데는 밝게(칠의 광택)
      const x0 = i * w / 6, gr = c.createLinearGradient(x0, 0, x0 + w / 6, 0);
      gr.addColorStop(0, 'rgba(150,95,0,0.28)'); gr.addColorStop(0.12, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,250,215,0.18)'); gr.addColorStop(0.88, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(150,95,0,0.28)');
      c.fillStyle = gr; c.fillRect(x0, 0, w / 6, h);
    }
    // 카메라 쪽 면(u 0~1/6)에 세로로 찍힌 글자
    const fw = w / 6, sy = (2048 / L) / (fw / PEN_R);       // 세로·가로 픽셀 비를 맞춘다
    c.save(); c.translate(fw / 2, h * 0.06); c.scale(1, sy); c.rotate(Math.PI / 2);
    c.fillStyle = '#1f4d2e'; c.font = `900 50px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('HB', 0, 0);
    c.restore();
  });
  const hexM = new THREE.MeshPhysicalMaterial({ map: paint, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2, flatShading: true });
  const hex = new THREE.Mesh(new THREE.CylinderGeometry(PEN_R, PEN_R, L, 6, 1, true), hexM);
  hex.position.y = PEN_TOP - L / 2; hex.castShadow = true; g.add(hex);
  const woodTip = canvasTex(256, 256, (c, w, h) => {
    c.fillStyle = '#e8c08f'; c.fillRect(0, 0, w, h); const r = rng(11);
    for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(150,95,45,${0.12 + r() * 0.25})`; c.lineWidth = 1 + r() * 2; const x = r() * w; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + (r() - 0.5) * 20, h * 0.3, x + (r() - 0.5) * 20, h * 0.7, x + (r() - 0.5) * 10, h); c.stroke(); }
  });
  const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.058, PEN_R, 0.36, 36, 1, true), new THREE.MeshStandardMaterial({ map: woodTip, roughness: 0.85 }));
  cone.position.y = PEN_TOP - 0.05 + 0.18; cone.castShadow = true; g.add(cone);
  const lead = new THREE.Mesh(new THREE.ConeGeometry(0.058, 0.13, 28), new THREE.MeshStandardMaterial({ color: 0x33363b, roughness: 0.32, metalness: 0.55 }));
  lead.position.y = PEN_TOP - 0.05 + 0.36 + 0.065; g.add(lead);
  const cap = new THREE.Mesh(new THREE.CircleGeometry(PEN_R, 6), new THREE.MeshStandardMaterial({ color: 0xdcb07c, roughness: 0.9 }));
  cap.rotation.x = -Math.PI / 2; cap.position.y = PEN_TOP - 0.052; g.add(cap);   // 칠 속 나무 단면(모서리 사이로 보임)
  return g;
}

// ── 나뭇결 원판 받침 ──────────────────────────────────────────
function woodBase() {
  const g = new THREE.Group(), RB = 1.45, HB = 0.3;
  const grain = canvasTex(1024, 1024, (c, w, h) => {
    const bg = c.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#c99a62'); bg.addColorStop(1, '#b8844c'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    const r = rng(5);
    for (let i = 0; i < 95; i++) {
      const y0 = r() * h, amp = 6 + r() * 22, fr = 0.004 + r() * 0.006, ph = r() * 6;
      c.strokeStyle = `rgba(${r() > 0.3 ? '112,68,30' : '236,200,150'},${0.12 + r() * 0.28})`; c.lineWidth = 0.8 + r() * 3.2;
      c.beginPath(); for (let x = -10; x <= w + 10; x += 16) { const y = y0 + Math.sin(x * fr + ph) * amp + Math.sin(x * fr * 3.1 + ph) * amp * 0.25; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    }
    c.save(); c.translate(w * 0.72, h * 0.32); c.scale(1.9, 1);          // 옹이 하나
    for (let k = 7; k > 0; k--) { c.strokeStyle = `rgba(100,58,25,${0.1 + k * 0.03})`; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, k * 6, 0, Math.PI * 2); c.stroke(); }
    c.fillStyle = 'rgba(90,50,20,0.6)'; c.beginPath(); c.arc(0, 0, 7, 0, Math.PI * 2); c.fill(); c.restore();
  });
  const side = canvasTex(512, 64, (c, w, h) => {
    c.fillStyle = '#b07d47'; c.fillRect(0, 0, w, h); const r = rng(9);
    for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(95,55,25,${0.1 + r() * 0.25})`; c.fillRect(0, r() * h, w, 1 + r() * 2.5); }
  }, [6, 1]);
  const top = new THREE.Mesh(new THREE.CircleGeometry(RB - 0.05, 72), new THREE.MeshPhysicalMaterial({ map: grain, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.4 }));
  top.rotation.x = -Math.PI / 2; top.position.y = HB; top.receiveShadow = true; g.add(top);
  const prof = [V2(RB - 0.04, 0), V2(RB, 0.03), V2(RB, HB - 0.06), V2(RB - 0.012, HB - 0.025), V2(RB - 0.03, HB - 0.006), V2(RB - 0.05, HB)];
  const rim = new THREE.Mesh(new THREE.LatheGeometry(prof, 72), new THREE.MeshPhysicalMaterial({ map: side, color: 0xf2e2cc, roughness: 0.6, clearcoat: 0.3 }));
  rim.castShadow = rim.receiveShadow = true; g.add(rim);
  const under = new THREE.Mesh(new THREE.CircleGeometry(RB - 0.04, 48), mat(0x8a6038)); under.rotation.x = Math.PI / 2; under.position.y = 0.001; g.add(under);
  const hole = new THREE.Mesh(new THREE.RingGeometry(PEN_R * 0.98, PEN_R + 0.05, 6, 1), mat(0x6b4722, { roughness: 0.9 }));
  hole.rotation.x = -Math.PI / 2; hole.rotation.z = Math.PI / 2; hole.position.y = HB + 0.002; g.add(hole);   // 연필이 박힌 자리의 그늘
  return g;
}

// ── 실험대 소품: 자(탑 높이를 잴 때 쓰는) ──────────────────────────
function ruler() {
  const Lr = 2.6, tex = canvasTex(2048, 256, (c, w, h) => {
    c.fillStyle = '#f6f1e3'; c.fillRect(0, 0, w, h); c.fillStyle = '#26303a'; c.font = `800 44px ${FONT}`; c.textAlign = 'center';
    const px = (w - 80) / 150;                               // 15 cm, 1 mm 마다
    for (let mm = 0; mm <= 150; mm++) { const x = 40 + mm * px, len = mm % 10 === 0 ? 92 : mm % 5 === 0 ? 62 : 36; c.fillRect(x - 1.5, 0, 3, len); if (mm % 10 === 0) c.fillText(String(mm / 10), x, 140); }
    c.font = `700 30px ${FONT}`; c.textAlign = 'left'; c.fillText('cm', 40, 220);
  });
  const side = mat(0xe7dfca, { roughness: 0.5 }), top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.45 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(Lr, 0.035, 0.36), [side, side, top, side, side, side]); m.castShadow = m.receiveShadow = true;
  return m;
}

// 가상 실험실(v2/lab-ring-tower.js)이 같은 교구를 쓴다 — 받침·연필·자·고리 자석과 극 표시 도구.
export const TOWER = { R_OUT, R_IN, T, COLORS, VIEW_TH, PEN_TOP, N, S };
export function towerParts(colors = COLORS) {
  POLE = poleKit();
  return { base: woodBase(), rod: pencil(), ruler: ruler(), rings: colors.map((c) => ring(c)), setUp, placeBadge };
}

export default {
  view: { theta: 0.5, phi: 1.14, dist: 7.35, target: [0, 1.98, 0] },
  build(kit, world) {
    POLE = poleKit();
    const base = woodBase(); world.add('base', base);
    const rod = pencil(); world.add('rod', rod);
    const rings = COLORS.map((c, i) => { const r = ring(c); r.position.y = 5 + i; world.add('r' + i, r); return r; });
    // 배치 규칙: 이웃한 두 고리의 윗면 극(up)이 서로 다르면 마주 보는 면이 같은 극 → 밀어 냄(뜸), 같으면 붙음.
    // 처음(아래→위) N·S·S·N → 1·2 뜸, 2·3 붙음, 3·4 뜸
    START.forEach((u, i) => setUp(rings[i], u));
    rings[0].userData.bot.userData.badge.visible = false;    // 받침에 닿은 면·맨 위 면은 마주 보는 짝이 없다(면 데칼만)
    rings[3].userData.top.userData.badge.visible = false;
    const rl = ruler(); rl.position.set(-2.15, 0.018, 0.9); rl.rotation.y = 0.95; world.group.add(rl);   // 늘 보이는 소품
    const lbQ = label('왜 어떤 자석은 떠 있을까?', { size: 0.34 }); lbQ.position.set(0, LABEL_Y, 0); world.add('lbQ', lbQ);
    const lbSame = label('마주 보는 면이 같은 극 → 밀어 내요', { size: 0.3 }); lbSame.position.set(0, LABEL_Y, 0); world.add('lbSame', lbSame);
    const lbDiff = label('마주 보는 면이 다른 극 → 끌어당겨요', { size: 0.3 }); lbDiff.position.set(0, LABEL_Y, 0); world.add('lbDiff', lbDiff);
    const lbTop = label('모두 같은 극끼리 → 가장 높은 탑!', { size: 0.34 }); lbTop.position.set(0, LABEL_Y, 0); world.add('lbTop', lbTop);
    // 화살표는 표(오른쪽 앞)와 겹치지 않게 탑의 왼쪽에 둔다
    const lx = -Math.cos(VIEW_TH) * 1.3, lz = Math.sin(VIEW_TH) * 1.3;
    const push = arrow([lx, 0.55, lz], [lx, 1.08, lz], P.red, 0.045); world.add('push', push);
    const pull = arrow([lx, 1.8, lz], [lx, 1.28, lz], P.accent, 0.045); world.add('pull', pull);
    return {
      update() {
        rings.forEach((r, i) => {
          const above = rings[i + 1], below = rings[i - 1];
          placeBadge(r.userData.top, above && Math.abs(above.position.y - r.position.y - T) < 0.06 ? -1 : 0);
          placeBadge(r.userData.bot, below && Math.abs(r.position.y - below.position.y - T) < 0.06 ? 1 : 0);
        });
      },
    };
  },
  beats: [
    { text: '받침에 막대를 세우고 고리 자석 네 개를 준비해요.', show: ['base', 'rod', 'lbQ'], dur: 3,
      reset(o) { START.forEach((u, i) => { const r = o['r' + i]; setUp(r, u); r.position.y = 5 + i; r.userData.top.visible = r.userData.bot.visible = false; }); } },
    { text: '고리 자석을 하나씩 끼워요. 어떤 자석은 떠 있고, 어떤 자석은 붙어 있어요.', show: ['r0', 'r1', 'r2', 'r3'], dur: 5,
      anim(p, o) { Y0.forEach((y, i) => { const q = Math.min(1, Math.max(0, p * 1.6 - i * 0.2)); o['r' + i].position.y = 5 + i + (y - 5 - i) * q; }); } },
    { text: '떠 있는 곳은 마주 보는 면이 같은 극이에요. 서로 밀어 내요.', show: ['lbSame', 'push'], hide: ['lbQ'], dur: 5,
      anim(p, o) { for (let i = 0; i < 4; i++) o['r' + i].userData.top.visible = o['r' + i].userData.bot.visible = p > 0.1; } },
    { text: '붙어 있는 곳은 마주 보는 면이 다른 극이에요. 서로 끌어당겨요.', show: ['lbDiff', 'pull'], hide: ['lbSame', 'push'], dur: 5 },
    { text: '자석을 뒤집어서 모두 같은 극끼리 마주 보게 하면 가장 높은 탑이 돼요.', show: ['lbTop'], hide: ['lbDiff', 'pull'], dur: 6,
      anim(p, o) { (p > 0.35 ? TALL : START).forEach((u, i) => { if (o['r' + i].userData.up !== u) setUp(o['r' + i], u); });
        Y0.forEach((y, i) => { o['r' + i].position.y = y + (Y1[i] - y) * p; }); } },
  ],
};
