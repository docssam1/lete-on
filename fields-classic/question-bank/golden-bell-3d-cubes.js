import { THREE, createStage3D, material, roundedBoxGeometry, woodMaterial, woodTray, GB_COLORS, easeOutBack } from "./golden-bell-3d-engine.js?v=20261023w";

// 쌓기나무 판(3D). 위에서 본 칸마다 쌓기나무 기둥을 세운다. 칸·쌓기나무를 누르면 onCell(r, c).
// 좌표: 가로줄 r = 0이 맨 뒤(−z), 마지막 줄이 맨 앞(+z). 세로줄 c = 0이 왼쪽(−x).
// 앞에서 본 모양은 +z 쪽에서, 오른쪽 옆에서 본 모양은 +x 쪽에서 본 모양이다(문항 그림과 같은 약속).
// 쌓기나무 색은 색표 그대로: 윗면 #ffeaa6 · 앞면 #ffd45c · 옆면 #f0b23a · 선 #a8741a.

const SIZE = 0.98;
export const LOOKS = Object.freeze({ home: null, front: [0, 1.53], side: [Math.PI / 2, 1.53], top: [0, 0.06] });

export function createCubeScene(host, { onCell, fullscreenTarget } = {}) {
  let puzzle = null, columns = new Map(), tiles = [], board = null, frameHeight = 3;
  const stage = createStage3D(host, {
    fov: 32, theta: 0.62, phi: 0.98, phiRange: [0.05, 1.56], fullscreenTarget,
    pickables: () => [...tiles, ...[...columns.values()].flat().map((cube) => cube.userData.body)],
    onTap: (hit) => { const cell = hit?.object?.userData?.cell; if (cell) onCell?.(cell[0], cell[1]); }
  });
  if (!stage) return null;
  const { root } = stage;
  const cubeGeometry = new THREE.BoxGeometry(SIZE, SIZE, SIZE);
  const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry);
  // BoxGeometry 면 순서: +x, −x, +y, −y, +z, −z → 옆·옆·윗면·밑면·앞·뒤
  // 면을 살짝 뒤로 밀어(polygonOffset) 모서리 선이 깜빡이지 않고 또렷하게 보이게.
  const faces = [GB_COLORS.cubeSide, GB_COLORS.cubeSide, GB_COLORS.cubeTop, "#e2b64a", GB_COLORS.cubeFront, GB_COLORS.cubeFront].map((c) => material(c, { roughness: 0.62, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
  const edgeMaterial = new THREE.LineBasicMaterial({ color: GB_COLORS.cubeLine });
  const tileOn = material(0xfff8e1, { roughness: 0.8 });
  const tileOff = material(0xe4e7ec, { roughness: 0.9 });
  // 판은 지오메트리 게임과 같은 나무 쟁반(재질은 문제마다 돌려 쓴다).
  const plateMaterial = woodMaterial(), railMaterial = woodMaterial({ color: 0xd0a36b, bump: 0.009 });
  const tileGeometry = roundedBoxGeometry(0.94, 0.06, 0.94, 0.03, 2);
  const keep = new Set([cubeGeometry, edgeGeometry, tileGeometry, ...faces, edgeMaterial, tileOn, tileOff, plateMaterial, railMaterial]);
  const cellX = (c) => c - (puzzle.cols - 1) / 2;
  const cellZ = (r) => r - (puzzle.rows - 1) / 2;
  let frontLabel = null, sideLabel = null;
  // 검사용(화면에 보이지 않는 DOM 속성): 그 칸 기둥 맨 윗면의 화면 좌표.
  host.fcCellPoint = (r, c) => { const h = columns.get(`${r},${c}`)?.length || 0; return stage.clientPoint(new THREE.Vector3(cellX(c), 0.06 + h * SIZE, cellZ(r))); };

  function makeCube(r, c, level) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(cubeGeometry, faces);
    body.castShadow = true; body.receiveShadow = true;
    body.userData.cell = [r, c];
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    group.add(body, edges);
    group.userData.body = body;
    group.position.set(cellX(c), 0.06 + SIZE / 2 + level * SIZE, cellZ(r));
    return group;
  }
  function disposeBoard() {
    for (const child of [...root.children]) {
      root.remove(child);
      child.traverse((n) => { if (n.geometry && !keep.has(n.geometry)) n.geometry.dispose(); });
    }
    columns = new Map(); tiles = [];
    frontLabel?.remove(); sideLabel?.remove();
  }
  return {
    stage,
    // 새 문제: 판과 칸을 만들고 쌓기나무는 비운다. 화면 틀은 판 + (가장 높은 층 + 1)로 고정해 쌓는 동안 카메라가 들썩이지 않게.
    setPuzzle(p) {
      disposeBoard();
      puzzle = p;
      board = new THREE.Group();
      board.add(woodTray(p.cols + 1.3, p.rows + 1.3, { boardMaterial: plateMaterial, railMaterial }));
      for (let r = 0; r < p.rows; r++) for (let c = 0; c < p.cols; c++) {
        const on = Boolean(p.views.top[r][c]);
        const tile = new THREE.Mesh(tileGeometry, on ? tileOn : tileOff);
        tile.position.set(cellX(c), 0.03, cellZ(r));
        tile.receiveShadow = true;
        tile.userData.cell = [r, c];
        board.add(tile);
        if (on) tiles.push(tile);
      }
      root.add(board);
      frameHeight = p.maxH + 0.4;
      const hx = p.cols / 2 + 0.35, hz = p.rows / 2 + 0.35;
      frontLabel = stage.label("앞", () => new THREE.Vector3(0, 0.05, hz + 0.45), { cls: "is-axis" });
      sideLabel = stage.label("오른쪽 옆", () => new THREE.Vector3(hx + 0.45, 0.05, 0), { cls: "is-axis" });
      stage.setView({ theta: 0.62, phi: 0.98, frame: [[-hx, 0, -hz], [hx, frameHeight * SIZE + 0.1, hz]] });
    },
    // 칸마다 층수를 맞춘다. changed 칸만 움직임을 준다(새로 올린 쌓기나무는 위에서 떨어진다).
    setHeights(heights, changed = null) {
      if (!puzzle) return;
      for (let r = 0; r < puzzle.rows; r++) for (let c = 0; c < puzzle.cols; c++) {
        const key = `${r},${c}`, want = heights[r][c];
        const list = columns.get(key) || [];
        while (list.length > want) { const cube = list.pop(); root.remove(cube); }
        while (list.length < want) {
          const cube = makeCube(r, c, list.length);
          root.add(cube);
          if (changed && changed[0] === r && changed[1] === c) {
            const y = cube.position.y;
            cube.position.y = y + 1.4;
            stage.tween(360, (t) => { cube.position.y = y + 1.4 * (1 - easeOutBack(t)); });
          }
          list.push(cube);
        }
        columns.set(key, list);
      }
      stage.request();
    },
    look(name) {
      if (name === "home" || !LOOKS[name]) { stage.goHome(); return; }
      stage.lookFrom(...LOOKS[name]);
    },
    dispose() {
      disposeBoard();
      for (const item of keep) item.dispose();
      stage.dispose();
    }
  };
}
