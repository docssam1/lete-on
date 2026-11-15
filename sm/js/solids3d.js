// A1-2 2단원 입체도형 — 3D 입체도형 무대(필즈 골든벨 3D 엔진 위).
//  원본 36·37쪽 동물들의 궁금증(잘 굴러갈까? 위에 다른 도형을 올려놓을 수 있을까? 위에서 보면 어떤 모양일까?)을
//  직접 굴려 보고, 올려 보고, 위에서 보게 한다. 50쪽 주사위 만들기는 펼친 그림을 접어 주사위를 만든다.
//  5세용: 시점 고정(돌리기·확대 없음), 단추로만 움직인다. WebGL이 없으면 평면 안내.
import { THREE, createStage3D, material, roundedBoxGeometry, flatNotice } from "../../fields-classic/question-bank/golden-bell-3d-engine.js?v=20261023w";

// 이름(화면·독쌤 말) — 원본 2단원 말투: 기둥 모양 · 뿔 모양 · 공 모양
export const SOLID_INFO = {
  cube: { name: "정육면체", family: "pillar", rolls: false, flatTop: true },
  cuboid: { name: "직육면체", family: "pillar", rolls: false, flatTop: true },
  board: { name: "납작한 판", family: "pillar", rolls: false, flatTop: true },
  cylinder: { name: "원기둥", family: "pillar", rolls: true, flatTop: true },
  disc: { name: "납작한 원기둥", family: "pillar", rolls: true, flatTop: true },
  triPrism: { name: "삼각기둥", family: "pillar", rolls: false, flatTop: true },
  pentPrism: { name: "오각기둥", family: "pillar", rolls: false, flatTop: true },
  hexPrism: { name: "육각기둥", family: "pillar", rolls: false, flatTop: true },
  cone: { name: "원뿔", family: "cone", rolls: true, flatTop: false },
  sqPyramid: { name: "사각뿔", family: "cone", rolls: false, flatTop: false },
  triPyramid: { name: "삼각뿔", family: "cone", rolls: false, flatTop: false },
  sphere: { name: "공", family: "ball", rolls: true, flatTop: false },
  hemi: { name: "반구", family: "ball", rolls: true, flatTop: true }
};

// 움직임은 setTimeout으로 정해진 시간 뒤 끝난 모습으로 마무리한다(가려진 탭·저사양에서 화면이 그려지지 않아도 수업이 멈추지 않게).
// 바닥 가운데가 원점인 입체도형. s = 기본 크기(대략 지름·한 변)
export function solidMesh(kind, color = "#5aa0f0", s = 1) {
  const mat = material(color, { roughness: 0.38, clearcoat: 0.55 });
  let geo, h = s, y = s / 2, rotY = 0;
  switch (kind) {
    case "cube": geo = roundedBoxGeometry(s, s, s, 0.04); break;
    case "cuboid": geo = roundedBoxGeometry(s * 0.6, s * 1.4, s * 0.6, 0.04); h = s * 1.4; y = h / 2; break;
    case "board": geo = roundedBoxGeometry(s * 1.8, s * 0.18, s * 1.2, 0.03); h = s * 0.18; y = h / 2; break;
    case "cylinder": geo = new THREE.CylinderGeometry(s * 0.45, s * 0.45, s, 40); break;
    case "disc": geo = new THREE.CylinderGeometry(s * 0.85, s * 0.85, s * 0.16, 48); h = s * 0.16; y = h / 2; break;
    case "triPrism": geo = new THREE.CylinderGeometry(s * 0.58, s * 0.58, s, 3); rotY = Math.PI / 6; break;
    case "pentPrism": geo = new THREE.CylinderGeometry(s * 0.52, s * 0.52, s, 5); break;
    case "hexPrism": geo = new THREE.CylinderGeometry(s * 0.52, s * 0.52, s * 0.9, 6); h = s * 0.9; y = h / 2; break;
    case "cone": geo = new THREE.ConeGeometry(s * 0.5, s * 1.1, 40); h = s * 1.1; y = h / 2; break;
    case "sqPyramid": geo = new THREE.ConeGeometry(s * 0.7, s * 1.0, 4); rotY = Math.PI / 4; break;
    case "triPyramid": geo = new THREE.ConeGeometry(s * 0.62, s * 0.95, 3); h = s * 0.95; y = h / 2; break;
    case "sphere": geo = new THREE.SphereGeometry(s * 0.5, 40, 24); break;
    case "hemi": geo = new THREE.SphereGeometry(s * 0.55, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2); h = s * 0.55; y = 0; break;
    default: geo = roundedBoxGeometry(s, s, s, 0.04);
  }
  const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.position.y = y; mesh.rotation.y = rotY;
  if (kind === "hemi") { const cap = new THREE.Mesh(new THREE.CircleGeometry(s * 0.55, 40), mat); cap.rotation.x = Math.PI / 2; cap.position.y = 0.002; mesh.add(cap); }
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ color: 0x25324a, transparent: true, opacity: 0.28 }));
  mesh.add(edges);
  const g = new THREE.Group(); g.add(mesh);
  g.userData = { kind, h, s, mesh };
  return g;
}

// 무대: items [{kind, color, x, z, s}] (단위 = 1). 반환 api
export function createSolidStage(host, { items = [], phi = 1.05, theta = 0.45, floor = true } = {}) {
  const objs = [];
  const stage = createStage3D(host, { fov: 30, theta, phi, orbit: false, hint: false, fullscreen: false, touchAction: "manipulation", fitMargin: 0.8,
    frame: () => { const xs = objs.map((o) => o.position.x), zs = objs.map((o) => o.position.z); const x0 = Math.min(-1.2, ...xs) - 1, x1 = Math.max(1.2, ...xs) + 1, z0 = Math.min(...zs, 0) - 1, z1 = Math.max(...zs, 0) + 1; return [[x0, 0, z0], [x1, 2.2, z1]]; } });
  if (!stage) { flatNotice(host); return null; }
  const { root } = stage;
  if (floor) { const sheet = new THREE.Mesh(roundedBoxGeometry(14, 0.06, 7, 0.03), material("#fffaf0", { roughness: 0.9, clearcoat: 0 })); sheet.position.y = -0.03; sheet.receiveShadow = true; sheet.userData.noFrame = true; root.add(sheet); }
  const api = {
    stage,
    add(kind, color, { x = 0, z = 0, y = 0, s = 1 } = {}) { const o = solidMesh(kind, color, s); o.position.set(x, y, z); root.add(o); objs.push(o); stage.refit(); return o; },
    remove(o) { root.remove(o); objs.splice(objs.indexOf(o), 1); },
    get objects() { return objs; },
    // 굴려 보기: 잘 굴러가는 것은 옆으로 굴러갔다 돌아오고, 아닌 것은 기우뚱하고 제자리
    roll(o) {
      const k = o.userData.kind, info = SOLID_INFO[k], x0 = o.position.x, m = o.userData.mesh;
      return new Promise((done0) => {
        let fin = false; const done = () => { if (fin) return; fin = true; o.position.x = x0; m.rotation.set(0, m.rotation.y, 0); m.position.y = o.userData.h / 2 * (k === "hemi" ? 0 : 1); stage.request(); done0(); }; setTimeout(done, 3600);
        if (k === "sphere") stage.tween(1600, (t) => { const d = Math.sin(t * Math.PI) * 2.2; o.position.x = x0 + d; m.rotation.z = -d / (o.userData.s * 0.5); }, { ease: (t) => t, done });
        else if (k === "cylinder" || k === "disc" || k === "cone") {
          // 옆으로 눕혀서 구른다(원뿔은 제자리에서 빙글)
          const r = k === "disc" ? o.userData.s * 0.85 : o.userData.s * 0.45;
          stage.tween(500, (t) => { m.rotation.x = t * Math.PI / 2; m.position.y = o.userData.h / 2 * (1 - t) + r * t; }, {
            done: () => stage.tween(1600, (t) => { const d = Math.sin(t * Math.PI) * (k === "cone" ? 0.6 : 2.2); if (k === "cone") { o.rotation.y = t * Math.PI * 2; } else { o.position.x = x0 + d; m.rotation.y = d / r; } }, { ease: (t) => t,
              done: () => stage.tween(450, (t) => { m.rotation.x = Math.PI / 2 * (1 - t); m.rotation.y = 0; m.position.y = o.userData.h / 2 * t + r * (1 - t); }, { done }) })
          });
        } else stage.tween(900, (t) => { m.rotation.z = Math.sin(t * Math.PI * 3) * 0.18 * (1 - t); }, { done });
        void info;
      });
    },
    // 올려 보기: 위에서 작은 정육면체를 떨어뜨린다. 위가 평평하면 그대로, 뾰족·둥글면 미끄러져 떨어진다.
    stackTest(o, { color = "#ff8a3c" } = {}) {
      const k = o.userData.kind, flat = SOLID_INFO[k].flatTop, top = o.userData.h + (k === "hemi" ? 0 : 0), c = api.add("cube", color, { x: o.position.x, z: o.position.z, y: top + 2, s: 0.45 });
      if (k === "hemi") c.position.y = o.userData.s * 0.55 + 2;
      const land = k === "sphere" ? o.userData.s : k === "hemi" ? o.userData.s * 0.55 : top;
      return new Promise((done0) => { let fin = false; const done = (v) => { if (fin) return; fin = true; done0(v); }; setTimeout(() => done(flat && k !== "sphere"), 2400); stage.tween(650, (t) => { c.position.y = land + 2 * (1 - t) * (1 - t); }, {
        done: () => {
          if (flat && k !== "sphere") { done(true); return; }
          const dir = Math.random() < 0.5 ? -1 : 1;
          stage.tween(900, (t) => { c.position.x = o.position.x + dir * t * 1.1; c.position.y = Math.max(0, land * (1 - t * t)); c.rotation.z = -dir * t * 1.6; }, { done: () => done(false) });
        }
      }); });
    },
    clearExtras(keep) { for (const o of [...objs]) if (!keep.includes(o)) api.remove(o); stage.request(); },
    topView() { stage.lookFrom(0, 0.02); },
    frontView() { stage.lookFrom(0, Math.PI / 2 - 0.05); },
    home() { stage.goHome(); },
    spin(o, ms = 1400) { return new Promise((done) => { stage.tween(ms, (t) => { o.rotation.y = t * Math.PI * 2; }, { done }); setTimeout(() => { o.rotation.y = 0; stage.request(); done(); }, ms + 700); }); },
    dispose() { stage.dispose(); }
  };
  for (const it of items) api.add(it.kind, it.color, it);
  return api;
}

// 단추 줄(무대 위에 띄움). buttons: [{key, label}]. onPress(key)
export function solidTools(host, buttons, onPress) {
  const bar = document.createElement("div"); bar.className = "sd3-tools";
  bar.innerHTML = buttons.map((b) => `<button class="sm-btn ${b.cls || "blue"}" type="button" data-k="${b.key}">${b.label}</button>`).join("");
  bar.addEventListener("click", (e) => { const b = e.target.closest("[data-k]"); if (b && !b.disabled) onPress(b.dataset.k, b); });
  host.append(bar); return bar;
}

// ── 50쪽 주사위 만들기: 펼친 그림(정육면체 6면 · 정사면체 4면)을 접는다 ──
//  face: 판 하나(두께 얇은 상자) + 점(정육면체) 또는 숫자(정사면체). 접기는 경첩(부모 그룹) 회전으로.
const PIP = { 1: [[0, 0]], 2: [[-0.25, -0.25], [0.25, 0.25]], 3: [[-0.27, -0.27], [0, 0], [0.27, 0.27]], 4: [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]], 5: [[-0.27, -0.27], [0.27, -0.27], [0, 0], [-0.27, 0.27], [0.27, 0.27]], 6: [[-0.25, -0.3], [0.25, -0.3], [-0.25, 0], [0.25, 0], [-0.25, 0.3], [0.25, 0.3]] };
function cubeFace(n, color, pipColor = 0x3b4252) {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.BoxGeometry(1, 0.04, 1), material(color, { roughness: 0.5, clearcoat: 0.3 })); plate.castShadow = true; plate.receiveShadow = true; g.add(plate);
  const pm = new THREE.MeshStandardMaterial({ color: pipColor, roughness: 0.4 });
  for (const [x, z] of PIP[n]) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 20), pm); d.position.set(x, 0.03, z); g.add(d); }
  return g;
}
// 펼친 그림(원본 103쪽 A1-2-7): 가운데 1, 위 2(빨강), 왼쪽 3(노랑), 오른쪽 4(파랑), 아래 5(분홍), 그 아래 6(초록)
export function createCubeNet(host) {
  const stage = createStage3D(host, { fov: 30, theta: 0.35, phi: 0.75, orbit: false, hint: false, fullscreen: false, touchAction: "manipulation", fitMargin: 0.8, frame: [[-2, 0, -2.2], [2, 1.2, 3.2]] });
  if (!stage) { flatNotice(host); return null; }
  const { root } = stage;
  const base = cubeFace(1, "#ffffff"); root.add(base); base.position.y = 0.02;
  const hinge = (parent, n, color, dir) => {
    // dir: 붙는 쪽(부모 기준) 'n'(−z) 's'(+z) 'w'(−x) 'e'(+x)
    const h = new THREE.Group(); parent.add(h);
    const f = cubeFace(n, color); h.add(f);
    if (dir === "n") { h.position.z = -0.5; f.position.z = -0.5; }
    if (dir === "s") { h.position.z = 0.5; f.position.z = 0.5; }
    if (dir === "w") { h.position.x = -0.5; f.position.x = -0.5; }
    if (dir === "e") { h.position.x = 0.5; f.position.x = 0.5; }
    h.userData.dir = dir; return { h, f };
  };
  const up = hinge(base, 2, "#f2475a", "n"), left = hinge(base, 3, "#ffc83a", "w"), right = hinge(base, 4, "#2f7de1", "e"), down = hinge(base, 5, "#f7a6c8", "s");
  const last = hinge(down.f, 6, "#2fa35a", "s");
  const all = [up, left, right, down, last];
  const fold = (t) => {
    const a = (Math.PI / 2) * t;
    // 점이 바깥에 오도록 아래로 접고, 그만큼 들어 올린다(가운데 1이 위, 6이 바닥)
    up.h.rotation.x = -a; down.h.rotation.x = a; last.h.rotation.x = a; left.h.rotation.z = a; right.h.rotation.z = -a;
    root.position.y = t * 1.0;
  };
  fold(0);
  return {
    stage,
    fold: () => new Promise((done) => { stage.tween(2200, fold, { done }); setTimeout(() => { fold(1); stage.request(); done(); }, 2900); }),
    // 다 접으면 굴려 본다(정해진 면이 위로)
    roll: () => new Promise((done) => { const g = root; setTimeout(() => { g.rotation.x = 0; g.position.y = 0; stage.request(); done(); }, 2300); stage.tween(1500, (t) => { g.rotation.x = t * Math.PI * 2; g.position.y = Math.sin(t * Math.PI) * 1.2; }, { done: () => { g.rotation.x = 0; g.position.y = 0; done(); } }); }),
    get faces() { return all; },
    dispose: () => stage.dispose()
  };
}
// 정사면체 주사위: 가운데 세모(1) + 세 변에 세모(2·3·4)를 접는다(원본 105쪽: 주황·초록·파랑·노랑)
export function createTetraNet(host) {
  const stage = createStage3D(host, { fov: 30, theta: 0.35, phi: 0.8, orbit: false, hint: false, fullscreen: false, touchAction: "manipulation", fitMargin: 0.8, frame: [[-2, 0, -2], [2, 1.4, 2]] });
  if (!stage) { flatNotice(host); return null; }
  const { root } = stage;
  const S = 1.4, H = S * Math.sqrt(3) / 2;
  const triGeo = () => { const shp = new THREE.Shape(); shp.moveTo(-S / 2, 0); shp.lineTo(S / 2, 0); shp.lineTo(0, -H); shp.closePath(); const g = new THREE.ExtrudeGeometry(shp, { depth: 0.03, bevelEnabled: false }); g.rotateX(Math.PI / 2); return g; };
  const label = (n) => { const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.font = "900 80px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(n), 64, 70); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), new THREE.MeshBasicMaterial({ map: t, transparent: true })); m.rotation.x = -Math.PI / 2; return m; };
  const face = (n, color) => { const g = new THREE.Group(); const m = new THREE.Mesh(triGeo(), material(color, { roughness: 0.5, clearcoat: 0.3 })); m.castShadow = true; m.receiveShadow = true; m.position.y = 0.03; g.add(m); const l = label(n); l.position.set(0, 0.05, -H / 3); g.add(l);
    // 접으면 아랫면이 바깥이 되므로 아랫면에도 숫자(뒤집혀 보이지 않게 좌우를 맞춤)
    const u = label(n); u.rotation.x = Math.PI / 2; u.scale.x = -1; u.position.set(0, -0.006, -H / 3); g.add(u); return g; };
  // 가운데 세모: 꼭짓점 위(−z)가 아래쪽 변(z=0) 기준. 가운데를 원점 근처로
  const center = new THREE.Group(); root.add(center); center.position.z = H * 2 / 3;
  const c0 = face(1, "#ff8a3c"); c0.rotation.y = Math.PI; c0.position.z = -H; center.add(c0);
  // 세 변에 붙는 날개(경첩 = 그 변)
  const wings = [];
  // 가운데 세모: 위 변 (−S/2,−H)–(S/2,−H), 꼭짓점 (0,0). 세 변의 가운데와 바깥 방향(날개 꼭짓점이 향할 쪽)
  const edgeMid = [[0, 0, -H], [-S / 4, 0, -H / 2], [S / 4, 0, -H / 2]], edgeAng = [0, Math.PI * 2 / 3, -Math.PI * 2 / 3];
  [["#ffc83a", 2], ["#2fa35a", 3], ["#2f7de1", 4]].forEach(([col, n], i) => {
    const hinge = new THREE.Group(); hinge.position.set(...edgeMid[i]); hinge.rotation.y = edgeAng[i]; center.add(hinge);
    const tilt = new THREE.Group(); hinge.add(tilt);
    const f = face(n, col); tilt.add(f);
    wings.push(tilt);
  });
  const DIH = Math.PI - Math.acos(1 / 3);   // 정사면체 이면각만큼 접는다
  const fold = (t) => { for (const w of wings) w.rotation.x = DIH * t; };
  fold(0);
  return { stage, fold: () => new Promise((done) => { stage.tween(2200, fold, { done }); setTimeout(() => { fold(1); stage.request(); done(); }, 2900); }), dispose: () => stage.dispose() };
}
