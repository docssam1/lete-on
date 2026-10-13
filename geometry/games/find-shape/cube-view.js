// 3D answer pictures for "단서로 모양 찾기".
//
// The choices use the same wooden cube, tray, rail and lighting as the other
// Cube Town 3D games (three-views, count-heights, hidden-count): RoundedBox
// cubes with a canvas wood texture on a wooden tray. One WebGL renderer draws
// every option in turn and the frame is copied into each option's own canvas,
// so a problem with four choices still uses a single WebGL context.
//
// Every option of a problem shares one camera, one scale and one light, so no
// choice looks bigger, brighter or turned. The camera is orthographic: equal
// cube sizes stay equal on screen, as in a textbook picture.
//
// Orientation (same as three-views): the front (앞) is the +z side, drawn at the
// lower left; the right side (오른쪽) is the +x side, drawn at the lower right.
// grid[z][x] is the height of the column at (x, z).
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const VIEW_DIRECTION = new THREE.Vector3(1, 0.98, 1.08).normalize();

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
  context.fillRect(0, 0, 512, 512);
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
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  return texture;
}

function labelTexture(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(64, 38, 17, 0.96)";
  context.font = "900 76px 'Noto Sans KR', 'Noto Sans SC', 'Noto Sans JP', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(255, 247, 224, 0.85)";
  context.shadowBlur = 4;
  context.fillText(label, 256, 68);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  return texture;
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
  cubeWood.repeat.set(1.1, 1.1);
  const boardWood = woodTexture(maxAnisotropy);
  boardWood.repeat.set(2.5, 2.5);
  const insetWood = woodTexture(maxAnisotropy);
  insetWood.repeat.set(2, 2);

  const cubeGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 5, 0.075);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffe9c4, map: cubeWood, roughness: 0.56, metalness: 0.012, bumpMap: cubeWood, bumpScale: 0.012
  });
  // Stronger than the 0.2 used in the free-orbit games: here the picture is
  // still, and the child must count every cube from the outlines alone.
  const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x6f4f2c, transparent: true, opacity: 0.55 });
  const boardMaterial = new THREE.MeshStandardMaterial({ map: boardWood, color: 0xe7c28e, roughness: 0.58, metalness: 0.01, bumpMap: boardWood, bumpScale: 0.01 });
  const railMaterial = new THREE.MeshStandardMaterial({ map: boardWood, color: 0xd0a36b, roughness: 0.58, metalness: 0.01, bumpMap: boardWood, bumpScale: 0.009 });
  const floorMaterial = new THREE.MeshStandardMaterial({ map: insetWood, color: 0xdbe2d7, roughness: 0.9, bumpMap: insetWood, bumpScale: 0.0025 });

  const scene = new THREE.Scene();
  // Softer fill and a key light from the front-left, so the three visible
  // faces of a cube read as three clear tones: top lightest, front middle,
  // right side darkest (the textbook convention for 쌓기나무 pictures).
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xb9a88f, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.9);
  sun.position.set(-2.2, 9, 6.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0006;
  scene.add(sun);
  scene.add(sun.target);

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const trayCache = new Map();
  const labelCache = new Map();
  const cubes = new THREE.Group();
  scene.add(cubes);
  let trayGroup = null;

  function labelMaterial(label) {
    if (!labelCache.has(label)) {
      labelCache.set(label, new THREE.MeshBasicMaterial({
        map: labelTexture(label), transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide
      }));
    }
    return labelCache.get(label);
  }

  function tray(width, depth) {
    const key = `${width}x${depth}`;
    if (trayCache.has(key)) return trayCache.get(key);
    const group = new THREE.Group();
    const size = Math.max(width, depth);
    const trayWidth = width + 1.0;
    const trayDepth = depth + 1.0;
    const board = new THREE.Mesh(new RoundedBoxGeometry(trayWidth, 0.24, trayDepth, 8, 0.16), boardMaterial);
    board.position.y = -0.15;
    board.receiveShadow = true;
    group.add(board);
    const railX = width / 2 + 0.3;
    const railZ = depth / 2 + 0.3;
    [
      { x: 0, z: railZ, sx: width + 0.72, sz: 0.14 },
      { x: 0, z: -railZ, sx: width + 0.72, sz: 0.14 },
      { x: railX, z: 0, sx: 0.14, sz: depth + 0.72 },
      { x: -railX, z: 0, sx: 0.14, sz: depth + 0.72 }
    ].forEach((rail) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(rail.sx, 0.1, rail.sz, 4, 0.05), railMaterial);
      mesh.position.set(rail.x, 0.0, rail.z);
      mesh.receiveShadow = true;
      group.add(mesh);
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(width + 0.2, depth + 0.2), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.012;
    floor.receiveShadow = true;
    group.add(floor);
    // Cell lines: one line per cell edge, so the floor tells how many columns
    // and rows the solid stands on.
    const points = [];
    for (let x = 0; x <= width; x += 1) points.push(x - width / 2, 0.02, -depth / 2, x - width / 2, 0.02, depth / 2);
    for (let z = 0; z <= depth; z += 1) points.push(-width / 2, 0.02, z - depth / 2, width / 2, 0.02, z - depth / 2);
    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    group.add(new THREE.LineSegments(gridGeometry, new THREE.LineBasicMaterial({ color: 0x9a7246, transparent: true, opacity: 0.7 })));
    group.userData = { width, depth, size, trayWidth, trayDepth };
    trayCache.set(key, group);
    return group;
  }

  // Two label planes, made once; only their material (text) and position change.
  const labelGeometry = new THREE.PlaneGeometry(2.6, 0.65);
  const frontLabel = new THREE.Mesh(labelGeometry);
  const rightLabel = new THREE.Mesh(labelGeometry);
  rightLabel.rotation.y = Math.PI / 2;
  frontLabel.renderOrder = 900;
  rightLabel.renderOrder = 900;
  scene.add(frontLabel, rightLabel);

  function placeLabels(labels, width, depth) {
    frontLabel.visible = Boolean(labels);
    rightLabel.visible = Boolean(labels);
    if (!labels) return;
    frontLabel.material = labelMaterial(labels.front);
    rightLabel.material = labelMaterial(labels.right);
    frontLabel.position.set(0, -0.38, depth / 2 + 0.55);
    rightLabel.position.set(width / 2 + 0.55, -0.38, 0);
  }

  // The frame is the same for every option of one problem: grid size and the
  // tallest column among all options.
  function fitCamera(frame, aspect) {
    const { width, depth, height } = frame;
    camera.position.copy(VIEW_DIRECTION).multiplyScalar(30);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, height * 0.45, 0);
    camera.updateMatrixWorld();
    const view = camera.matrixWorldInverse;
    let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
    const halfW = width / 2 + 0.55;
    const halfD = depth / 2 + 0.55;
    for (const x of [-halfW, halfW]) for (const z of [-halfD, halfD]) for (const y of [-0.74, height]) {
      const point = new THREE.Vector3(x, y, z).applyMatrix4(view);
      minX = Math.min(minX, point.x); maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y); maxY = Math.max(maxY, point.y);
    }
    const padding = 1.03;
    let halfWidth = ((maxX - minX) / 2) * padding;
    let halfHeight = ((maxY - minY) / 2) * padding;
    if (halfWidth / halfHeight > aspect) halfHeight = halfWidth / aspect; else halfWidth = halfHeight * aspect;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    camera.left = centerX - halfWidth;
    camera.right = centerX + halfWidth;
    camera.top = centerY + halfHeight;
    camera.bottom = centerY - halfHeight;
    camera.updateProjectionMatrix();
    const reach = Math.max(width, depth) / 2 + 1.5;
    sun.shadow.camera.left = -reach; sun.shadow.camera.right = reach;
    sun.shadow.camera.top = reach; sun.shadow.camera.bottom = -reach;
    sun.shadow.camera.updateProjectionMatrix();
  }

  function setCubes(grid) {
    cubes.clear();
    const depth = grid.length;
    const width = grid[0].length;
    grid.forEach((row, z) => row.forEach((height, x) => {
      for (let y = 0; y < height; y += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(x - (width - 1) / 2, y + 0.5, z - (depth - 1) / 2);
        // Cubes cast a contact shadow on the tray but do not receive shadows:
        // a shadow patch on a cube top reads like a missing cube when counting.
        cube.castShadow = true;
        cube.receiveShadow = false;
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
    const nextTray = tray(frame.width, frame.depth);
    if (trayGroup !== nextTray) {
      if (trayGroup) scene.remove(trayGroup);
      trayGroup = nextTray;
      scene.add(trayGroup);
    }
    placeLabels(labels, frame.width, frame.depth);
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
