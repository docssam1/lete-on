import { THREE, createStage3D, material, roundedBoxGeometry, textTexture, GB_COLORS, easeOutBack } from "./golden-bell-3d-engine.js?v=20261022a";
import { magicLines } from "./golden-bell-book09-game-models.js?v=20261022a";

// 숫자 유리창(마방진) 판(3D). 보이는 수는 파스텔 칸, 빈칸은 보라 테두리 홈, 채운 수는 노랑 숫자카드가 내려앉는다.
// 줄마다 끝에 불이 있어, 줄이 다 차면 합이 맞으면 초록·다르면 주황으로 켜지고 줄 위에 빛 띠가 지나간다.
// 칸(빈칸)을 누르면 onCell(칸 번호). 색: 숫자판·빈 상자 보라 #8e5bd8, 판 칸 파스텔 4색, 숫자카드 노랑(색표).

const PASTEL = [GB_COLORS.redSoft, GB_COLORS.greenSoft, GB_COLORS.blueSoft, GB_COLORS.yellowSoft];
const GAP = 1.12;

export function createMagicScene(host, { onCell, fullscreenTarget } = {}) {
  let puzzle = null, cells = [], lights = [], beams = [], sumLabels = [], sockets = [], activeRing = null;
  const stage = createStage3D(host, {
    fov: 30, theta: 0, phi: 0.7, thetaRange: [-1.0, 1.0], phiRange: [0.15, 1.25], fullscreenTarget,
    pickables: () => sockets,
    onTap: (hit) => { const i = hit?.object?.userData?.cell; if (Number.isInteger(i)) onCell?.(i); },
    onFrame: (dt, now) => {
      if (!activeRing?.visible || stage.reduced) return false;
      activeRing.scale.setScalar(1 + Math.sin(now / 220) * 0.05);
      return true;
    }
  });
  if (!stage) return null;
  const { root } = stage;
  const textures = new Map();
  const numberMaterial = (value, kind) => {
    const key = `${kind}:${value}`;
    if (!textures.has(key)) textures.set(key, textTexture(value, { color: GB_COLORS.ink, scale: String(value).length > 1 ? 0.56 : 0.66 }));
    return new THREE.MeshBasicMaterial({ map: textures.get(key), transparent: true, depthWrite: false, toneMapped: false });
  };
  const shared = {
    plate: material(GB_COLORS.purpleSoft, { roughness: 0.7 }),
    rim: material(GB_COLORS.purple, { roughness: 0.5 }),
    socket: material(0xffffff, { roughness: 0.6 }),
    card: material(GB_COLORS.card, { roughness: 0.45 }),
    cardRim: material(GB_COLORS.cardLine, { roughness: 0.45 }),
    off: material(0xd8dee8, { roughness: 0.6 }),
    ok: material(GB_COLORS.green, { emissive: GB_COLORS.green, emissiveIntensity: 0.55, roughness: 0.3 }),
    no: material(GB_COLORS.orange, { emissive: GB_COLORS.orange, emissiveIntensity: 0.45, roughness: 0.3 }),
    active: new THREE.MeshBasicMaterial({ color: GB_COLORS.doing, toneMapped: false }),
    beamOk: new THREE.MeshBasicMaterial({ color: GB_COLORS.green, transparent: true, opacity: 0.38, depthWrite: false, toneMapped: false }),
    beamNo: new THREE.MeshBasicMaterial({ color: GB_COLORS.orange, transparent: true, opacity: 0.38, depthWrite: false, toneMapped: false })
  };
  shared.pastel = PASTEL.map((c) => material(c, { roughness: 0.55 }));
  const geo = {
    tile: roundedBoxGeometry(0.98, 0.22, 0.98, 0.07),
    socket: roundedBoxGeometry(0.98, 0.06, 0.98, 0.03),
    socketRim: new THREE.RingGeometry(0.4, 0.47, 4, 1, Math.PI / 4),
    card: roundedBoxGeometry(0.88, 0.16, 0.88, 0.06),
    face: new THREE.PlaneGeometry(0.8, 0.8),
    light: new THREE.CylinderGeometry(0.13, 0.13, 0.14, 24),
    ring: new THREE.RingGeometry(0.5, 0.58, 40)
  };
  const keep = new Set([...Object.values(geo), ...Object.values(shared).flat()]);
  // 검사용(화면에 보이지 않는 DOM 속성): 칸 윗면의 화면 좌표.
  host.fcCellPoint = (i) => stage.clientPoint(pos(i).setY(0.08));
  const pos = (i) => { const n = puzzle.n; return new THREE.Vector3((i % n - (n - 1) / 2) * GAP, 0, (Math.floor(i / n) - (n - 1) / 2) * GAP); };
  const mesh = (g, m, shadow = true) => { const x = new THREE.Mesh(g, m); x.castShadow = shadow; x.receiveShadow = true; return x; };
  const facePlane = (value, y) => { const f = new THREE.Mesh(geo.face, numberMaterial(value, "n")); f.rotation.x = -Math.PI / 2; f.position.y = y; f.renderOrder = 2; return f; };
  // 줄 끝 자리: 가로줄은 오른쪽 끝, 세로줄은 뒤쪽 끝, 대각선은 앞쪽 모서리 바깥.
  function lineEnd(line) {
    const n = puzzle.n, half = (n - 1) / 2 * GAP + 0.82;
    if (line.id[0] === "r") return new THREE.Vector3(half, 0.12, (Number(line.id.slice(1)) - (n - 1) / 2) * GAP);
    if (line.id[0] === "c") return new THREE.Vector3((Number(line.id.slice(1)) - (n - 1) / 2) * GAP, 0.12, -half);
    return new THREE.Vector3(line.id === "d0" ? half : -half, 0.12, half);
  }
  function lineBeam(line) {
    const a = pos(line.cells[0]), b = pos(line.cells.at(-1));
    const length = a.distanceTo(b) + 0.9;
    const beam = new THREE.Mesh(new THREE.BoxGeometry(length, 0.02, 0.16), shared.beamOk);
    beam.position.copy(a).add(b).multiplyScalar(0.5); beam.position.y = 0.33;
    beam.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x);
    beam.visible = false; beam.renderOrder = 3;
    return beam;
  }
  function clearBoard() {
    for (const child of [...root.children]) {
      root.remove(child);
      child.traverse((n) => {
        if (n.geometry && !keep.has(n.geometry)) n.geometry.dispose();
        if (n.material && !keep.has(n.material) && !Array.isArray(n.material)) n.material.dispose();
      });
    }
    for (const l of sumLabels) l.remove();
    cells = []; lights = []; beams = []; sumLabels = []; sockets = []; activeRing = null;
  }
  return {
    stage,
    setPuzzle(p) {
      clearBoard();
      puzzle = p;
      const n = p.n, span = n * GAP + 0.5;
      const plate = mesh(roundedBoxGeometry(span, 0.2, span, 0.1), shared.plate);
      plate.position.y = -0.1;
      const rim = mesh(roundedBoxGeometry(span + 0.16, 0.12, span + 0.16, 0.1), shared.rim);
      rim.position.y = -0.2;
      root.add(rim, plate);
      for (let i = 0; i < n * n; i++) {
        const at = pos(i), cell = { group: new THREE.Group(), blank: p.blanks.includes(i), card: null };
        cell.group.position.copy(at);
        if (cell.blank) {
          const socket = mesh(geo.socket, shared.socket);
          socket.position.y = 0.03; socket.userData.cell = i;
          const rimLine = mesh(geo.socketRim, shared.rim, false);
          rimLine.rotation.x = -Math.PI / 2; rimLine.scale.setScalar(1.45); rimLine.position.y = 0.065;
          cell.group.add(socket, rimLine);
          sockets.push(socket);
        } else {
          const tile = mesh(geo.tile, shared.pastel[(Math.floor(i / n) + i % n) % 4]);
          tile.position.y = 0.11;
          cell.group.add(tile, facePlane(p.shown[i], 0.225));
        }
        root.add(cell.group);
        cells.push(cell);
      }
      activeRing = mesh(geo.ring, shared.active, false);
      activeRing.rotation.x = -Math.PI / 2; activeRing.visible = false; activeRing.userData.noFrame = true;
      root.add(activeRing);
      for (const line of magicLines(n)) {
        const light = mesh(geo.light, shared.off);
        light.position.copy(lineEnd(line));
        root.add(light);
        lights.push(light);
        const beam = lineBeam(line);
        beam.userData.noFrame = true;
        root.add(beam);
        beams.push(beam);
        const end = lineEnd(line).add(new THREE.Vector3(0, 0.3, 0));
        sumLabels.push(stage.label("", end).show(false));
      }
      stage.setView({ theta: 0, phi: 0.7 });
    },
    // values: 칸마다 지금 수(빈칸은 null). changed: 방금 넣은 칸은 카드가 위에서 내려앉는다.
    setValues(values, { active = null, changed = null } = {}) {
      if (!puzzle) return;
      cells.forEach((cell, i) => {
        if (!cell.blank) return;
        const want = values[i];
        if (cell.card && cell.card.userData.value !== want) { cell.group.remove(cell.card); cell.card.traverse((x) => { if (x.material && !keep.has(x.material)) x.material.dispose(); }); cell.card = null; }
        if (want !== null && want !== undefined && !cell.card) {
          const card = new THREE.Group();
          const body = mesh(geo.card, shared.card);
          body.position.y = 0.14;
          body.userData.cell = i;
          card.add(body, facePlane(want, 0.225));
          card.userData.value = want;
          cell.group.add(card);
          cell.card = card;
          if (changed === i) { card.position.y = 1.2; stage.tween(340, (t) => { card.position.y = 1.2 * (1 - easeOutBack(t)); }); }
        }
      });
      activeRing.visible = active !== null && active !== undefined;
      if (activeRing.visible) { activeRing.position.copy(pos(active)); activeRing.position.y = 0.08; }
      stage.request();
    },
    // 줄 상태: [{full, sum, ok}] (magicLineStates 순서와 같다)
    setLines(states) {
      states.forEach((s, k) => {
        const lit = s.open && s.full;
        lights[k].visible = s.open;
        lights[k].material = !lit ? shared.off : s.ok ? shared.ok : shared.no;
        beams[k].visible = lit;
        beams[k].material = s.ok ? shared.beamOk : shared.beamNo;
        sumLabels[k].set(lit ? String(s.sum) : "").setClass(s.ok ? "is-good" : "is-bad").show(lit);
      });
      stage.request();
    },
    dispose() {
      clearBoard();
      for (const item of keep) item.dispose?.();
      for (const t of textures.values()) t.dispose();
      stage.dispose();
    }
  };
}
