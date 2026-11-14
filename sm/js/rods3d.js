// 퀴즈네르 막대판(3D) — 1단원 길이 재기. 필즈 골든벨 3D 엔진(golden-bell-3d-engine.js) 위에 만든다.
//  · 판: 칸(1칸 = 막대 1의 길이)을 점선으로. 원본처럼 계단(9쪽)·격자(10·11쪽)·숫자 모양(12·13쪽, 활동지 A1-3-1) 칸만 그릴 수 있다.
//  · 막대: 1 흰색 ~ 10 주황색. 교재 그림 색에 맞춘 퀴즈네르 색.
//  · 5세용: 시점 고정(돌리기·확대 없음). 칸을 누르면 onCell, 막대를 누르면 onRod.
//  · 놓기: 위에서 떨어져 통 튀며 앉는다. 틀린 막대는 놓아 본 뒤(넘치면 빨간 칸, 모자라면 빈칸이 보임) 다시 날아간다.
import { THREE, createStage3D, material, roundedBoxGeometry, woodTray, woodMaterial, flatNotice } from "../../fields-classic/question-bank/golden-bell-3d-engine.js?v=20261023w";

export const RODS = {
  1: { name: "흰색", color: "#fbfbf7" }, 2: { name: "빨간색", color: "#ef4b3c" }, 3: { name: "연두색", color: "#b9d65a" },
  4: { name: "보라색", color: "#8e6bb0" }, 5: { name: "노란색", color: "#f6e04a" }, 6: { name: "초록색", color: "#23906a" },
  7: { name: "검은색", color: "#2d2d2d" }, 8: { name: "갈색", color: "#8f7a4c" }, 9: { name: "파란색", color: "#2f6fe0" }, 10: { name: "주황색", color: "#ff8a1f" }
};
// 단추용 막대 그림(길이만큼)
export const rodIcon = (len, unit = 13, h = 22) => `<svg width="${len * unit + 4}" height="${h + 6}" viewBox="0 0 ${len * unit + 4} ${h + 6}" aria-hidden="true"><rect x="2" y="3" width="${len * unit}" height="${h}" rx="5" fill="${RODS[len].color}" stroke="rgba(0,0,0,.25)" stroke-width="1.5"/>${Array.from({ length: len - 1 }, (_, i) => `<line x1="${2 + (i + 1) * unit}" y1="6" x2="${2 + (i + 1) * unit}" y2="${h}" stroke="rgba(0,0,0,.12)"/>`).join("")}<rect x="5" y="5" width="${len * unit - 6}" height="5" rx="2.5" fill="#fff" opacity=".35"/></svg>`;

const key = (r, c) => `${r},${c}`;

// boards: [{ id, cols, rows, cells?: [[r,c],...], x?, z?, label? }] — x·z는 칸 단위 위치(판끼리 나란히)
// pile: 막대 더미 자리 { x, z, w, d }(칸 단위, 판과 같은 좌표). onPile(막대)로 더미의 막대를 누른 것을 알린다.
// box: 원본 12쪽처럼 보기 막대를 담은 상자(노란 테두리) — pile 자리에 테두리를 그린다.
// paper: 원장 2026-11-12 「스캔한 이미지와 비슷해야지」 — 나무 쟁반 대신 흰 교재 종이 위, 거의 위에서 본 시점. extra: 화면에 함께 넣을 자리(칸 단위 {x,z,w,d}, 인물 그림 등)
export function createRodStage(host, { boards, cell = 0.5, onCell = null, onRod = null, onPile = null, pile = null, box = false, phi = 0.12, paper = true, extra = [] } = {}) {
  const span = layoutSpan([...boards, ...(pile ? [{ cols: pile.w, rows: pile.d, x: pile.x, z: pile.z }] : []), ...extra.map((e) => ({ cols: e.w, rows: e.d, x: e.x, z: e.z }))], cell);
  const stage = createStage3D(host, {
    fov: 30, theta: 0, phi, orbit: false, hint: false, fullscreen: false, touchAction: "manipulation", fitMargin: 0.92,
    frame: [[span.x0, 0, span.z0 - (boards.some((b) => b.labelRoom) ? 0.9 : 0)], [span.x1, 0.5, span.z1]],
    pickables: () => pickables,
    onTap: (hit) => { let o = hit?.object; while (o && !o.userData.pick) o = o.parent; const p = o?.userData.pick; if (!p) return; if (p.cell) onCell?.(p.board, p.r, p.c); else if (p.pile) onPile?.(p.pile); else if (p.rod) onRod?.(p.rod); },
    onFrame: (dt, now) => pulse(now)
  });
  if (!stage) { flatNotice(host); return null; }
  const { root } = stage;
  let pickables = [];
  const mats = new Map();
  const rodMat = (len) => { if (!mats.has(len)) mats.set(len, material(RODS[len].color, { roughness: 0.32, clearcoat: 0.75 })); return mats.get(len); };
  const plate = material("#ffffff", { roughness: 0.6, clearcoat: 0.1 });
  const lineMat = new THREE.LineDashedMaterial({ color: 0x8796ab, dashSize: 0.05, gapSize: 0.035 });
  const solidLine = new THREE.LineBasicMaterial({ color: 0x6b7a90 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x2f7de1, transparent: true, opacity: 0.25, depthWrite: false });
  const badMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.45, depthWrite: false });
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const cellGeo = new THREE.PlaneGeometry(cell * 0.96, cell * 0.96);

  if (paper) {
    const sheet = new THREE.Mesh(new THREE.BoxGeometry(span.x1 - span.x0 + 0.6, 0.02, span.z1 - span.z0 + 0.6), material("#ffffff", { roughness: 0.9, clearcoat: 0 }));
    sheet.position.set((span.x0 + span.x1) / 2, -0.012, (span.z0 + span.z1) / 2); sheet.receiveShadow = true; sheet.userData.noFrame = true; root.add(sheet);
  } else {
    const tray = woodTray(span.x1 - span.x0 + 0.5, span.z1 - span.z0 + 0.5, { boardMaterial: woodMaterial(), railMaterial: woodMaterial({ color: 0xd0a36b, bump: 0.009 }) });
    tray.position.set((span.x0 + span.x1) / 2, -0.26, (span.z0 + span.z1) / 2);
    root.add(tray);
  }

  const B = new Map();
  for (const def of boards) B.set(def.id, buildBoard(def));
  if (pile && box) {
    const frame = new THREE.Mesh(roundedBoxGeometry(pile.w * cell, 0.03, pile.d * cell, 0.12), material("#fffdf2", { roughness: 0.7, clearcoat: 0 }));
    frame.position.set(pile.x * cell, 0.015, pile.z * cell); frame.receiveShadow = true; root.add(frame);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 4), new THREE.MeshBasicMaterial({ color: 0xf2d64b }));
    void rim;
    const w = pile.w * cell / 2, d = pile.d * cell / 2, cx = pile.x * cell, cz = pile.z * cell, y = 0.04;
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute([cx - w, y, cz - d, cx + w, y, cz - d, cx + w, y, cz - d, cx + w, y, cz + d, cx + w, y, cz + d, cx - w, y, cz + d, cx - w, y, cz + d, cx - w, y, cz - d], 3));
    root.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xf0c83a })));
  }
  const pileRods = [];
  function buildBoard(def) {
    const { id, cols, rows } = def;
    const shape = new Set((def.cells || Array.from({ length: rows * cols }, (_, i) => [Math.floor(i / cols), i % cols])).map(([r, c]) => key(r, c)));
    const g = new THREE.Group();
    g.position.set((def.x || 0) * cell, 0, (def.z || 0) * cell);
    root.add(g);
    const W = cols * cell, H = rows * cell;
    const at = (r, c) => new THREE.Vector3(-W / 2 + (c + 0.5) * cell, 0, -H / 2 + (r + 0.5) * cell);
    // 흰 종이(모양 칸만)와 점선
    const pts = [];
    for (const k of shape) {
      const [r, c] = k.split(",").map(Number), p = at(r, c);
      const paper = new THREE.Mesh(new THREE.BoxGeometry(cell, 0.04, cell), plate); paper.position.set(p.x, 0.02, p.z); paper.receiveShadow = true; g.add(paper);
      const x0 = p.x - cell / 2, x1 = p.x + cell / 2, z0 = p.z - cell / 2, z1 = p.z + cell / 2, y = 0.045;
      pts.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
      const hit = new THREE.Mesh(cellGeo, hitMat); hit.rotation.x = -Math.PI / 2; hit.position.set(p.x, 0.05, p.z);
      hit.userData.pick = { cell: true, board: id, r, c }; g.add(hit); pickables.push(hit);
    }
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(lg, def.dashed === false ? solidLine : lineMat); lines.computeLineDistances(); g.add(lines);
    return { id, cols, rows, shape, g, at, filled: new Map(), rods: [], glows: [] };
  }

  // ── 막대 ──
  // 원본 그림처럼 막대 윗면에 가는 테두리(흰 막대도 흰 종이 위에서 보이게)
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x5b6577, transparent: true, opacity: 0.55 });
  function rodMesh(len) {
    const m = new THREE.Mesh(roundedBoxGeometry(len * cell - 0.035, cell * 0.42, cell - 0.06, 0.05), rodMat(len));
    m.castShadow = true; m.receiveShadow = true;
    const w = (len * cell - 0.05) / 2, d = (cell - 0.075) / 2, y = cell * 0.21 + 0.002;
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute([-w, y, -d, w, y, -d, w, y, -d, w, y, d, w, y, d, -w, y, d, -w, y, d, -w, y, -d], 3));
    const edge = new THREE.LineSegments(g, edgeMat);
    // 선은 누르기 판정에서 뺀다(three.js 선 판정 범위가 넓어 옆 막대가 잡히던 문제 — 원장 2026-11-12 「흰색을 선택하면 주황색이 골라져」)
    edge.raycast = () => {};
    m.add(edge);
    return m;
  }
  const cellsOf = (r, c, len, dir) => Array.from({ length: len }, (_, i) => (dir === "v" ? [r + i, c] : [r, c + i]));
  function placeMesh(b, len, r, c, dir) {
    const m = rodMesh(len);
    const a = b.at(r, c), e = b.at(dir === "v" ? r + len - 1 : r, dir === "v" ? c : c + len - 1);
    m.position.set((a.x + e.x) / 2, 0.045 + cell * 0.21, (a.z + e.z) / 2);
    if (dir === "v") m.rotation.y = Math.PI / 2;
    b.g.add(m);
    return m;
  }
  const bounce = (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; };
  function drop(m, ms = 520) {
    if (stage.reduced) return Promise.resolve();
    const y0 = m.position.y;
    return new Promise((res) => stage.tween(ms, (t) => { const b = bounce(t); m.position.y = y0 + 1.6 * (1 - b); m.scale.set(1, 1, 1); }, { ease: (t) => t, done: res }));
  }
  function flyAway(m) {
    return new Promise((res) => {
      if (stage.reduced) { m.parent?.remove(m); res(); return; }
      const p0 = m.position.clone();
      stage.tween(380, (t) => { m.position.set(p0.x, p0.y + t * 1.4, p0.z + t * 1.2); m.scale.setScalar(1 - t * 0.6); }, { done: () => { m.parent?.remove(m); res(); } });
    });
  }
  const free = (b, r, c) => b.shape.has(key(r, c)) && !b.filled.has(key(r, c));

  // 강조(파랗게 깜빡) — 다음에 채울 칸
  function glow(boardId, cells, mat = glowMat) {
    const b = B.get(boardId);
    const list = cells.map(([r, c]) => { const p = b.at(r, c), m = new THREE.Mesh(cellGeo, mat); m.rotation.x = -Math.PI / 2; m.position.set(p.x, 0.048, p.z); m.renderOrder = 2; b.g.add(m); return m; });
    b.glows.push(...list); stage.request();
    return () => { list.forEach((m) => m.parent?.remove(m)); b.glows = b.glows.filter((x) => !list.includes(x)); stage.request(); };
  }
  function pulse(now) {
    let any = false;
    glowMat.opacity = 0.16 + 0.16 * (1 + Math.sin(now / 260)) / 2;
    for (const b of B.values()) if (b.glows.length) any = true;
    return any;
  }

  // ── 막대 더미 ──
  const restY = 0.045 + cell * 0.21, H = cell * 0.42;
  const segDist = (a, b) => { // 두 막대(선분) 사이 대략 거리
    let m = Infinity;
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
      const pa = a.p0.clone().lerp(a.p1, i / 6), pb = b.p0.clone().lerp(b.p1, j / 6);
      m = Math.min(m, Math.hypot(pa.x - pb.x, pa.z - pb.z));
    }
    return m;
  };
  function addToPile(len, pos = null) {
    const m = rodMesh(len);
    let x, z, rot, y = restY;
    if (pos) { x = pos.x * cell; z = pos.z * cell; rot = pos.rot || 0; }
    else {
      const w = pile.w * cell, d = pile.d * cell, half = len * cell / 2;
      let best = null;
      for (let t = 0; t < 120; t++) {   // 겹치지 않는 자리를 오래 찾는다(5세가 집기 쉽게)
        rot = Math.random() * Math.PI;
        const ex = Math.abs(Math.cos(rot)) * half + cell / 2, ez = Math.abs(Math.sin(rot)) * half + cell / 2;
        x = pile.x * cell + (Math.random() - 0.5) * Math.max(0, w - 2 * ex);
        z = pile.z * cell + (Math.random() - 0.5) * Math.max(0, d - 2 * ez);
        const seg = { p0: new THREE.Vector3(x - Math.cos(rot) * half, 0, z + Math.sin(rot) * half), p1: new THREE.Vector3(x + Math.cos(rot) * half, 0, z - Math.sin(rot) * half) };
        const hits = pileRods.filter((o) => segDist(seg, o.seg) < cell * 0.95);
        const yy = restY + (hits.length ? Math.max(...hits.map((o) => o.home.y)) - restY + H * 0.92 : 0);
        if (!best || yy < best.y) best = { x, z, rot, y: yy, seg };
        if (!hits.length) break;
      }
      ({ x, z, rot, y } = best);
      m.userData.seg = best.seg;
    }
    m.position.set(x, y, z); m.rotation.y = rot; root.add(m);
    const half = len * cell / 2;
    const item = { len, mesh: m, home: { x, y, z, rot }, seg: m.userData.seg || { p0: new THREE.Vector3(x - Math.cos(rot) * half, 0, z + Math.sin(rot) * half), p1: new THREE.Vector3(x + Math.cos(rot) * half, 0, z - Math.sin(rot) * half) } };
    m.userData.pick = { pile: item };
    pileRods.push(item); pickables.push(m);
    return item;
  }
  // 막대를 목표 자리(월드 좌표·각도)로 포물선을 그리며 날린다
  function fly(m, to, rotTo, ms = 520) {
    const from = m.position.clone(), r0 = m.rotation.y;
    let r1 = rotTo; while (r1 - r0 > Math.PI / 2) r1 -= Math.PI; while (r1 - r0 < -Math.PI / 2) r1 += Math.PI;
    if (stage.reduced) { m.position.copy(to); m.rotation.y = r1; stage.request(); return Promise.resolve(); }
    return new Promise((res) => stage.tween(ms, (t) => {
      m.position.lerpVectors(from, to, t); m.position.y += Math.sin(t * Math.PI) * 1.1; m.rotation.y = r0 + (r1 - r0) * t;
    }, { done: res }));
  }
  const slotPose = (b, len, r, c, dir) => {
    const a = b.at(r, c), e = b.at(dir === "v" ? r + len - 1 : r, dir === "v" ? c : c + len - 1);
    return { pos: new THREE.Vector3((a.x + e.x) / 2 + b.g.position.x, restY, (a.z + e.z) / 2 + b.g.position.z), rot: dir === "v" ? Math.PI / 2 : 0 };
  };
  function lift(item, on) { item.mesh.position.y = item.home.y + (on ? 0.25 : 0); stage.request(); }

  return {
    stage, cell,
    // 더미 채우기: lens(막대 길이 목록, 섞어서 흩뿌림) 또는 layout([{len, x, z, rot}] 원본 배치 그대로)
    // 더미: 원장 2026-11-12 「너무 겹쳐있으니까 실수한다 그냥 겹치지는 않게 해줘」 — 막대끼리 겹치지 않게 줄지어 흩어 놓는다
    // (줄마다 순서·간격을 섞고 조금씩 비스듬히). 자리가 모자라면 막대 사이를 좁힌다.
    fillPile(lens) {
      const a = [...lens]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      const W = pile.w, D = pile.d;
      let gap = 1.0, rows;
      for (;;) {   // 줄 나누기(칸 단위)
        rows = []; let cur = [], used = 0;
        for (const n of a) { if (cur.length && used + n > W - 0.4) { rows.push(cur); cur = []; used = 0; } cur.push(n); used += n + gap; }
        if (cur.length) rows.push(cur);
        if (rows.length * 1.5 <= D || gap <= 0.45) break;
        gap -= 0.15;
      }
      const rowH = Math.min(1.9, D / rows.length);
      rows.forEach((row, ri) => {
        const total = row.reduce((t, n) => t + n, 0), spare = W - 0.4 - total;
        const gaps = row.map(() => Math.random() + 0.3), gsum = gaps.reduce((t, g) => t + g, 0);
        let x = pile.x - W / 2 + 0.2 + (spare * gaps[0] / gsum) * 0.5;
        const z = pile.z - D / 2 + rowH * (ri + 0.5);
        row.forEach((n, k) => {
          const tilt = (Math.random() - 0.5) * Math.min(0.35, 0.9 / n);   // 짧은 막대는 조금 더 비스듬히, 긴 막대는 거의 바르게
          addToPile(n, { x: x + n / 2, z: z + (Math.random() - 0.5) * Math.max(0, rowH - 1.15) * 0.8, rot: tilt });
          x += n + spare * gaps[k + 1 < gaps.length ? k + 1 : k] / gsum;
        });
      });
      stage.request();
    },
    layoutPile(list) { list.forEach((p) => addToPile(p.len, p)); stage.request(); },
    pileHas: (len) => pileRods.some((p) => p.len === len),
    findInPile: (len) => pileRods.find((p) => p.len === len) || null,
    lift,
    // 더미의 막대를 칸에 놓는다(날아가 앉음)
    async takeFromPile(item, boardId, r, c, dir = "h") {
      const b = B.get(boardId), pose = slotPose(b, item.len, r, c, dir);
      const i = pileRods.indexOf(item); if (i >= 0) pileRods.splice(i, 1);
      pickables = pickables.filter((x) => x !== item.mesh);
      await fly(item.mesh, pose.pos, pose.rot);
      const rod = { board: boardId, len: item.len, r, c, dir, mesh: item.mesh };
      item.mesh.userData.pick = { rod };
      cellsOf(r, c, item.len, dir).forEach(([y, x]) => b.filled.set(key(y, x), rod));
      b.rods.push(rod);
      return rod;
    },
    // 더미의 막대를 칸에 대 보고(넘치는 칸은 빨갛게) 다시 더미 제자리로
    async tryFromPile(item, boardId, r, c, dir = "h", { hold = 900, over = 0, short = [] } = {}) {
      const b = B.get(boardId), pose = slotPose(b, item.len, r, c, dir);
      await fly(item.mesh, pose.pos, pose.rot, 460);
      let bad = [];
      for (let i = 0; i < over; i++) { const p = b.at(dir === "v" ? r + item.len - over + i : r, dir === "v" ? c : c + item.len - over + i); const q = new THREE.Mesh(cellGeo, badMat); q.rotation.x = -Math.PI / 2; q.position.set(p.x, restY + H / 2 + 0.01, p.z); q.renderOrder = 3; b.g.add(q); bad.push(q); }
      for (const [y, x] of short) { const p = b.at(y, x); const q = new THREE.Mesh(cellGeo, badMat); q.rotation.x = -Math.PI / 2; q.position.set(p.x, 0.05, p.z); q.renderOrder = 3; b.g.add(q); bad.push(q); }
      stage.request();
      await new Promise((r2) => setTimeout(r2, stage.reduced ? 200 : hold));
      bad.forEach((q) => q.parent?.remove(q));
      await fly(item.mesh, new THREE.Vector3(item.home.x, item.home.y, item.home.z), item.home.rot, 460);
    },
    // 더미 막대를 제자리로 되돌림(선택 취소)
    async returnToPile(item) { await fly(item.mesh, new THREE.Vector3(item.home.x, item.home.y, item.home.z), item.home.rot, 300); },
    // 정답 막대 놓기(칸을 채운다)
    async place(boardId, len, r, c, dir = "h", { animate = true, fixed = false } = {}) {
      const b = B.get(boardId);
      const cells = cellsOf(r, c, len, dir);
      const m = placeMesh(b, len, r, c, dir);
      const rod = { board: boardId, len, r, c, dir, mesh: m, fixed };
      m.userData.pick = { rod };
      cells.forEach(([y, x]) => b.filled.set(key(y, x), rod));
      b.rods.push(rod); pickables.push(m);
      if (animate) await drop(m);
      return rod;
    },
    // 놓아 보기만(길이 비교): 판 밖으로 넘치는 칸은 빨갛게. 잠시 보여 주고 날려 보낸다.
    async tryAndReturn(boardId, len, r, c, dir = "h", { hold = 900, over = 0 } = {}) {
      const b = B.get(boardId);
      const m = placeMesh(b, len, r, c, dir);
      await drop(m, 420);
      let clearBad = null;
      if (over > 0) {
        const extra = Array.from({ length: over }, (_, i) => { const p = b.at(dir === "v" ? r + len - over + i : r, dir === "v" ? c : c + len - over + i); return p; });
        const list = extra.map((p) => { const q = new THREE.Mesh(cellGeo, badMat); q.rotation.x = -Math.PI / 2; q.position.set(p.x, 0.5 * cell + 0.05, p.z); q.renderOrder = 3; b.g.add(q); return q; });
        clearBad = () => list.forEach((q) => q.parent?.remove(q));
      }
      await new Promise((r2) => setTimeout(r2, stage.reduced ? 200 : hold));
      clearBad?.();
      await flyAway(m);
    },
    remove(rod) { const b = B.get(rod.board); cellsOf(rod.r, rod.c, rod.len, rod.dir).forEach(([y, x]) => b.filled.delete(key(y, x))); b.rods = b.rods.filter((x) => x !== rod); pickables = pickables.filter((x) => x !== rod.mesh); return flyAway(rod.mesh); },
    glow, free: (id, r, c) => free(B.get(id), r, c),
    // 그 칸을 덮는 길이 len 자리(가로 먼저, 누른 칸에서 시작하는 것 먼저)
    fitAt(boardId, len, r, c) {
      const b = B.get(boardId);
      if (!free(b, r, c)) return null;
      const ok = (cells) => cells.every(([y, x]) => free(b, y, x));
      for (const dir of ["h", "v"]) for (let k = 0; k < len; k++) {
        const r0 = dir === "v" ? r - k : r, c0 = dir === "h" ? c - k : c;
        if (ok(cellsOf(r0, c0, len, dir))) return { r: r0, c: c0, dir };
      }
      return null;
    },
    // 판 어디든 놓을 수 있는 자리 모두
    fits(boardId, len) {
      const b = B.get(boardId), out = [];
      for (const k of b.shape) { const [r, c] = k.split(",").map(Number); for (const dir of ["h", "v"]) { const cells = cellsOf(r, c, len, dir); if (cells.every(([y, x]) => free(b, y, x))) out.push({ r, c, dir, cells }); } }
      return out;
    },
    emptyCount(boardId) { const b = B.get(boardId); let n = 0; for (const k of b.shape) if (!b.filled.has(k)) n++; return n; },
    // 그 줄(가로)에서 막대 끝 위치에 라벨(○표 등)
    label(boardId, text, r, c, cls = "big") { const b = B.get(boardId); const p = b.at(r, c).add(b.g.position); return stage.label(text, () => new THREE.Vector3(p.x, 0.4, p.z), { cls, frame: false }); },
    // 기준 막대 끝을 보여 주는 세로 점선(빨강) — 칸 경계 c(왼쪽에서 c칸 뒤)에 판 전체 높이로. 위에 이름표.
    marker(boardId, c, text) {
      const b = B.get(boardId), H2 = b.rows * cell, x = -b.cols * cell / 2 + c * cell, y = 0.5 * cell + 0.06;
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute([x, y, -H2 / 2 - 0.15, x, y, H2 / 2 + 0.15], 3));
      const line = new THREE.Line(g, new THREE.LineDashedMaterial({ color: 0xe23b3b, dashSize: 0.09, gapSize: 0.06, linewidth: 2 }));
      line.computeLineDistances(); line.raycast = () => {}; line.renderOrder = 4; b.g.add(line);
      const thick = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.01, H2 + 0.3), new THREE.MeshBasicMaterial({ color: 0xe23b3b, transparent: true, opacity: 0.55 }));
      thick.position.set(x, y, 0); thick.raycast = () => {}; b.g.add(thick);
      const p = new THREE.Vector3(x + b.g.position.x, 0.4, -H2 / 2 - 0.35 + b.g.position.z);
      const lbl = text ? stage.label(text, () => p, { cls: "is-bad", frame: false }) : null;
      stage.request();
      return () => { line.parent?.remove(line); thick.parent?.remove(thick); lbl?.remove(); stage.request(); };
    },
    // 그림(HTML)을 판 위 자리(칸 단위 x,z, 크기 w칸)에 붙인다 — 인물 그림 등. 화면 크기가 바뀌면 다시 맞춘다.
    pin(html, x, z, w) {
      const el = document.createElement("div"); el.className = "sm-pin"; el.innerHTML = html; host.append(el);
      const place = () => {
        const a = stage.project(new THREE.Vector3((x - w / 2) * cell, 0, z * cell)), b = stage.project(new THREE.Vector3((x + w / 2) * cell, 0, z * cell));
        const px = Math.abs(b.x - a.x); el.style.width = `${px}px`; el.style.left = `${(a.x + b.x) / 2 - px / 2}px`; el.style.top = `${a.y}px`;
      };
      place(); const ro = new ResizeObserver(() => requestAnimationFrame(place)); ro.observe(host);
      return { el, remove() { ro.disconnect(); el.remove(); } };
    },
    point(boardId, r, c) { const b = B.get(boardId); const p = b.at(r, c).add(b.g.position); return stage.clientPoint(new THREE.Vector3(p.x, 0.2, p.z)); },
    dispose() { mats.forEach((m) => m.dispose()); [plate, lineMat, solidLine, glowMat, badMat, hitMat].forEach((m) => m.dispose()); cellGeo.dispose(); stage.dispose(); }
  };
}

function layoutSpan(boards, cell) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const b of boards) {
    const cx = (b.x || 0) * cell, cz = (b.z || 0) * cell, w = b.cols * cell / 2, h = b.rows * cell / 2;
    x0 = Math.min(x0, cx - w); x1 = Math.max(x1, cx + w); z0 = Math.min(z0, cz - h); z1 = Math.max(z1, cz + h);
  }
  return { x0: x0 - 0.15, x1: x1 + 0.15, z0: z0 - 0.15, z1: z1 + 0.15 };
}
