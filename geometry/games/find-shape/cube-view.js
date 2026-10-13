// 3D answer pictures for "단서로 모양 찾기".
//
// The look is copied from 쌓기나무 개수 세기 (games/count-heights/app.js), the
// reference Cube Town scene: the same perspective camera (38°, seen from
// 7.2 / 6.3 / 8.2), the same white sky + sun light, the same pale wood cube,
// wooden tray, rails, floor grid and 앞 / 오른쪽 labels. Only the framing is
// automatic, so the solid fills its card.
//
// One WebGL renderer draws every option in turn and the frame is copied into
// each option's own canvas, so a problem with four choices still uses a single
// WebGL context. Every option of a problem shares one camera, one scale and one
// light, so no choice looks bigger, brighter or turned.
//
// Orientation (same as count-heights and three-views): the front (앞) is the
// +z side, drawn at the lower left; the right side (오른쪽) is the +x side,
// drawn at the lower right. grid[z][x] is the height of the column at (x, z).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// count-heights' default camera position, used as a direction.
const VIEW_DIRECTION = new THREE.Vector3(7.2, 6.3, 8.2).normalize();
// count-heights stands 12.6 units from a 3-wide board; keep that ratio so the
// perspective feels the same on 3x3 and 4x4 boards.
const DISTANCE_PER_TRAY = 12.6 / (3 + 1.96);

function woodTexture(maxAnisotropy) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const base = context.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, "#fff7e7");
  base.addColorStop(0.46, "#f0d4a5");
  base.addColorStop(1, "#d9b57e");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let line = 0; line < 76; line += 1) {
    const y = 18 + line * 6.5 + Math.sin(line * 1.7) * 6;
    context.beginPath();
    context.moveTo(-20, y);
    for (let x = -20; x <= 540; x += 18) {
      context.lineTo(x, y + Math.sin(x * 0.036 + line) * 3.6 + Math.sin(x * 0.012 + line * 0.4) * 2.4);
    }
    context.strokeStyle = line % 3 === 0 ? "rgba(115,78,39,.095)" : "rgba(255,255,245,.24)";
    context.lineWidth = line % 3 === 0 ? 1.15 : 0.9;
    context.stroke();
  }
  for (let knot = 0; knot < 34; knot += 1) {
    context.beginPath();
    context.ellipse(44 + (knot * 83) % 432, 38 + (knot * 117) % 420, 20, 6, knot, 0, Math.PI * 2);
    context.strokeStyle = "rgba(105,70,35,.07)";
    context.lineWidth = 1;
    context.stroke();
  }
  const glow = context.createRadialGradient(160, 120, 20, 160, 120, 420);
  glow.addColorStop(0, "rgba(255,255,255,.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 512, 512);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.1, 1.1);
  texture.anisotropy = Math.min(8, maxAnisotropy);
  return texture;
}

// Same engraved label as count-heights' makeBoardLabelPlane().
function labelMaterialFor(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 112;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(64, 38, 17, 0.95)";
  context.font = "950 58px 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans JP', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(255, 247, 224, 0.82)";
  context.shadowBlur = 3;
  context.fillText(label, canvas.width / 2, canvas.height / 2 + 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
}

export function createCubeView() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  } catch (error) {
    return null;
  }
  if (!renderer.getContext()) return null;
  // A lost context would copy blank frames into every card; report it so the
  // game can fall back to the flat pictures.
  let contextLost = false;
  renderer.domElement.addEventListener("webglcontextlost", (event) => { event.preventDefault(); contextLost = true; });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);

  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  const cubeWood = woodTexture(maxAnisotropy);
  const boardWood = woodTexture(maxAnisotropy);
  boardWood.repeat.set(2.5, 2.5);
  const insetWood = woodTexture(maxAnisotropy);
  insetWood.repeat.set(2, 2);

  const cubeGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 5, 0.075);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff5df, map: cubeWood, roughness: 0.56, metalness: 0.012, bumpMap: cubeWood, bumpScale: 0.012
  });
  const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x8b6840, transparent: true, opacity: 0.18 });
  const boardMaterial = new THREE.MeshStandardMaterial({ map: boardWood, color: 0xe7c28e, roughness: 0.58, metalness: 0.01, bumpMap: boardWood, bumpScale: 0.01 });
  const railMaterial = new THREE.MeshStandardMaterial({ map: boardWood, color: 0xd0a36b, roughness: 0.58, metalness: 0.01, bumpMap: boardWood, bumpScale: 0.009 });
  const floorMaterial = new THREE.MeshStandardMaterial({ map: insetWood, color: 0xdbe2d7, roughness: 0.9, bumpMap: insetWood, bumpScale: 0.0025 });

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(5, 8.5, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const trays = new Map();
  const labelMaterials = new Map();
  const cubes = new THREE.Group();
  scene.add(cubes);
  let currentTray = null;

  // 1.5x count-heights' label: a choice card is much smaller than its stage.
  const labelGeometry = new THREE.PlaneGeometry(1.42 * 1.5, 0.42 * 1.5);
  const frontLabel = new THREE.Mesh(labelGeometry);
  const rightLabel = new THREE.Mesh(labelGeometry);
  rightLabel.rotation.set(0, Math.PI / 2, 0);
  frontLabel.renderOrder = 902;
  rightLabel.renderOrder = 902;
  scene.add(frontLabel, rightLabel);

  function labelMaterial(label) {
    if (!labelMaterials.has(label)) labelMaterials.set(label, labelMaterialFor(label));
    return labelMaterials.get(label);
  }

  // count-heights' renderModel() board, rails, floor and grid, built once per
  // board size.
  function tray(gridSize) {
    if (trays.has(gridSize)) return trays.get(gridSize);
    const group = new THREE.Group();
    const traySize = gridSize + 1.96;
    const railSpan = gridSize + 1.32;
    const railOffset = gridSize / 2 + 0.62;
    const board = new THREE.Mesh(new RoundedBoxGeometry(traySize, 0.24, traySize, 8, 0.18), boardMaterial);
    board.position.y = -0.15;
    board.receiveShadow = true;
    board.castShadow = true;
    group.add(board);
    [
      { x: 0, z: railOffset, sx: railSpan, sz: 0.18 },
      { x: 0, z: -railOffset, sx: railSpan, sz: 0.18 },
      { x: railOffset, z: 0, sx: 0.18, sz: railSpan },
      { x: -railOffset, z: 0, sx: 0.18, sz: railSpan }
    ].forEach((rail) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(rail.sx, 0.12, rail.sz, 5, 0.06), railMaterial);
      mesh.position.set(rail.x, 0.005, rail.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(gridSize + 0.28, gridSize + 0.28), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.014;
    floor.receiveShadow = true;
    group.add(floor);
    const grid = new THREE.GridHelper(gridSize, gridSize, 0x8e6841, 0xc79b67);
    grid.position.y = 0.025;
    grid.material.transparent = true;
    grid.material.opacity = 0.88;
    group.add(grid);
    group.userData.traySize = traySize;
    trays.set(gridSize, group);
    return group;
  }

  function placeLabels(labels, gridSize) {
    frontLabel.visible = Boolean(labels);
    rightLabel.visible = Boolean(labels);
    if (!labels) return;
    const offset = gridSize / 2 + 0.46;
    frontLabel.material = labelMaterial(labels.front);
    rightLabel.material = labelMaterial(labels.right);
    frontLabel.position.set(0, -0.01, offset);
    rightLabel.position.set(offset, -0.01, 0);
  }

  // The same camera and the same frame for every option of one problem: the
  // whole tray plus the tallest column among all options. The projection is
  // shifted and scaled (a lens shift, not a camera move) so that frame fills
  // the card without changing the perspective.
  function fitCamera(frame, aspect) {
    const gridSize = Math.max(frame.width, frame.depth);
    const traySize = gridSize + 1.96;
    camera.aspect = aspect;
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(DISTANCE_PER_TRAY * traySize);
    camera.lookAt(0, Math.min(1.75, frame.height * 0.42 + 0.4), 0);
    camera.updateMatrixWorld();
    camera.updateProjectionMatrix();
    const half = traySize / 2;
    let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
    for (const x of [-half, half]) for (const z of [-half, half]) for (const y of [-0.27, frame.height]) {
      const point = new THREE.Vector3(x, y, z).project(camera);
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
    const fill = 0.94;
    const scale = Math.min((2 * fill) / (maxX - minX), (2 * fill) / (maxY - minY));
    const shiftX = -((minX + maxX) / 2) * scale;
    const shiftY = -((minY + maxY) / 2) * scale;
    const m = camera.projectionMatrix.elements;
    // ndc' = scale * ndc + shift; clip.w = -z_view, so the shift goes into the
    // third column.
    m[0] *= scale; m[5] *= scale;
    m[8] = m[8] * scale - shiftX;
    m[9] = m[9] * scale - shiftY;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }

  function setCubes(grid) {
    cubes.clear();
    const depth = grid.length;
    const width = grid[0].length;
    grid.forEach((row, z) => row.forEach((height, x) => {
      for (let y = 0; y < height; y += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x - (width - 1) / 2, y + 0.5, z - (depth - 1) / 2);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
        cubes.add(cube);
      }
    }));
    return cubes.children.length;
  }

  // Draws one grid into `canvas` (a 2D canvas sized by CSS). Returns the number
  // of cubes placed, so a check can compare it with the heights.
  function draw(grid, frame, canvas, labels) {
    if (contextLost) throw new Error("WebGL context lost");
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelWidth = Math.max(80, Math.round(rect.width * ratio));
    const pixelHeight = Math.max(80, Math.round(rect.height * ratio));
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    renderer.setSize(pixelWidth, pixelHeight, false);
    const gridSize = Math.max(frame.width, frame.depth);
    const nextTray = tray(gridSize);
    if (currentTray !== nextTray) {
      if (currentTray) scene.remove(currentTray);
      currentTray = nextTray;
      scene.add(currentTray);
    }
    placeLabels(labels, gridSize);
    const count = setCubes(grid);
    fitCamera(frame, pixelWidth / pixelHeight);
    renderer.render(scene, camera);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, pixelWidth, pixelHeight);
    context.drawImage(renderer.domElement, 0, 0, pixelWidth, pixelHeight);
    return count;
  }

  // Where the middle of the front edge and of the right edge of the tray land
  // in the last picture, as fractions of its width and height (0,0 = top left).
  // A check uses this to confirm the front is drawn lower left, the right side
  // lower right.
  function orientation(frame) {
    const at = (x, z) => {
      const point = new THREE.Vector3(x, 0, z).project(camera);
      return { x: (point.x + 1) / 2, y: (1 - point.y) / 2 };
    };
    return { front: at(0, frame.depth / 2), right: at(frame.width / 2, 0), back: at(0, -frame.depth / 2), left: at(-frame.width / 2, 0) };
  }

  return { draw, orientation };
}
