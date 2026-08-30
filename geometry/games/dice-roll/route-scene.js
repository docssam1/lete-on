import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { directionInfo, orientationKey, roll, startingOrientation } from "./levels.js?v=dice-roll-3";

const DIE_SIZE = 1;
const TILE_SIZE = 1.08;
const TILE_HEIGHT = 0.12;
const TILE_TOP = TILE_HEIGHT / 2;
const ROLL_DURATION = 520;
const BASE_PIP_LAYOUT = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
};
const FACE_LAYOUT = {
  top: { value: 1, normal: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  bottom: { value: 6, normal: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  north: { value: 2, normal: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0] },
  south: { value: 5, normal: [0, 0, 1], u: [-1, 0, 0], v: [0, 1, 0] },
  east: { value: 3, normal: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  west: { value: 4, normal: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] }
};
const ROTATIONS = {
  N: { axis: new THREE.Vector3(1, 0, 0), angle: -Math.PI / 2 },
  E: { axis: new THREE.Vector3(0, 0, 1), angle: -Math.PI / 2 },
  S: { axis: new THREE.Vector3(1, 0, 0), angle: Math.PI / 2 },
  W: { axis: new THREE.Vector3(0, 0, 1), angle: Math.PI / 2 }
};

function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, "#fff0bd");
  gradient.addColorStop(.48, "#dca65d");
  gradient.addColorStop(1, "#a9632f");
  context.fillStyle = gradient; context.fillRect(0, 0, 256, 256);
  context.lineCap = "round";
  for (let index = 0; index < 22; index += 1) {
    const y = 8 + index * 12;
    context.beginPath();
    context.moveTo(-20, y + Math.sin(index * 1.7) * 5);
    context.bezierCurveTo(55, y - 8, 130, y + 9, 276, y - 2);
    context.strokeStyle = index % 3 ? "rgba(113,61,28,.10)" : "rgba(255,247,214,.16)";
    context.lineWidth = index % 4 === 0 ? 2 : 1;
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeArrowTexture(direction) {
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 128;
  const context = canvas.getContext("2d");
  context.translate(64, 64);
  context.rotate({ E: 0, S: Math.PI / 2, W: Math.PI, N: -Math.PI / 2 }[direction]);
  context.strokeStyle = "#a6472f";
  context.fillStyle = "#a6472f";
  context.lineWidth = 11;
  context.lineCap = "round";
  context.beginPath(); context.moveTo(-30, 0); context.lineTo(24, 0); context.stroke();
  context.beginPath(); context.moveTo(30, 0); context.lineTo(5, -19); context.lineTo(5, 19); context.closePath(); context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function rotationQuaternion(direction) {
  const { axis, angle } = ROTATIONS[direction];
  return new THREE.Quaternion().setFromAxisAngle(axis, angle);
}

function buildOrientationQuaternions() {
  const map = new Map([[orientationKey(startingOrientation), new THREE.Quaternion()]]);
  const queue = [startingOrientation];
  while (queue.length) {
    const current = queue.shift();
    const currentQuaternion = map.get(orientationKey(current));
    Object.keys(directionInfo).forEach((direction) => {
      const next = roll(current, direction);
      const key = orientationKey(next);
      if (map.has(key)) return;
      const quaternion = rotationQuaternion(direction).multiply(currentQuaternion.clone()).normalize();
      map.set(key, quaternion); queue.push(next);
    });
  }
  return map;
}

const ORIENTATION_QUATERNIONS = buildOrientationQuaternions();

function faceValueAlong(quaternion, worldNormal) {
  let bestValue = 0; let bestDot = -Infinity;
  Object.values(FACE_LAYOUT).forEach(({ value, normal }) => {
    const dot = new THREE.Vector3(...normal).applyQuaternion(quaternion).dot(worldNormal);
    if (dot > bestDot) { bestDot = dot; bestValue = value; }
  });
  return bestValue;
}

ORIENTATION_QUATERNIONS.forEach((quaternion, key) => {
  const expected = key.split("").map(Number);
  const worldNormals = [
    new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0)
  ];
  const actual = worldNormals.map((normal) => faceValueAlong(quaternion, normal));
  if (actual.some((value, index) => value !== expected[index])) throw new Error(`3D dice orientation mismatch: ${key} / ${actual.join("")}`);
});

function cellKey(cell) { return `${cell[0]},${cell[1]}`; }
function easeInOut(value) { return value < .5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2; }

export class DiceRouteScene {
  constructor(host) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    this.renderer.setClearColor(0xf7faf8, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.domElement.setAttribute("aria-label", "작은 연결 발판 위의 입체 주사위 이동 장면");
    this.renderer.domElement.setAttribute("role", "img");
    host.append(this.renderer.domElement);
    host.dataset.dieSize = String(DIE_SIZE);
    host.dataset.tileSize = String(TILE_SIZE);
    host.dataset.tileRatio = String(TILE_SIZE / DIE_SIZE);
    host.dataset.rolling = "false";

    this.tiles = new THREE.Group();
    this.arrows = new THREE.Group();
    this.scene.add(this.tiles, this.arrows);
    this.tileMeshes = new Map();
    this.die = this.makeDie();
    this.scene.add(this.die);

    const ambient = new THREE.HemisphereLight(0xfff8df, 0x78919a, 2.15);
    const key = new THREE.DirectionalLight(0xfff1c8, 4.1);
    key.position.set(5, 9, 7); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -8; key.shadow.camera.right = 8; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
    const fill = new THREE.DirectionalLight(0xc6ebef, 1.45); fill.position.set(-5, 4, -6);
    this.scene.add(ambient, key, fill);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();
    this.render();
  }

  makeDie() {
    const die = new THREE.Group();
    const body = new THREE.Mesh(
      new RoundedBoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE, 6, .085),
      new THREE.MeshPhysicalMaterial({ map: makeWoodTexture(), roughness: .29, metalness: .02, clearcoat: .72, clearcoatRoughness: .2 })
    );
    body.castShadow = true; body.receiveShadow = true; die.add(body);

    const pipGeometry = new THREE.CircleGeometry(.066, 24);
    const pipMaterial = new THREE.MeshStandardMaterial({ color: 0x17292f, roughness: .56, side: THREE.DoubleSide });
    const defaultNormal = new THREE.Vector3(0, 0, 1);
    Object.values(FACE_LAYOUT).forEach(({ value, normal, u, v }) => {
      const normalVector = new THREE.Vector3(...normal);
      const uVector = new THREE.Vector3(...u);
      const vVector = new THREE.Vector3(...v);
      BASE_PIP_LAYOUT[value].forEach(([px, py]) => {
        const pip = new THREE.Mesh(pipGeometry, pipMaterial);
        pip.position.copy(normalVector).multiplyScalar(DIE_SIZE / 2 + .003)
          .addScaledVector(uVector, px * .205).addScaledVector(vVector, py * .205);
        pip.quaternion.setFromUnitVectors(defaultNormal, normalVector);
        die.add(pip);
      });
    });
    return die;
  }

  clearRoute() {
    [this.tiles, this.arrows].forEach((group) => {
      while (group.children.length) {
        const child = group.children[0]; group.remove(child);
        child.traverse((object) => {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
          materials.forEach((material) => { material.map?.dispose(); material.dispose(); });
        });
      }
    });
    this.tileMeshes.clear();
  }

  setProblem(problem, orientation, step = 0) {
    this.problem = problem;
    this.clearRoute();
    const tileGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_HEIGHT, TILE_SIZE);
    const edgeGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(.99, TILE_HEIGHT + .006, .99));
    [...new Map(problem.path.map((cell) => [cellKey(cell), cell])).values()].forEach((cell) => {
      const mesh = new THREE.Mesh(tileGeometry.clone(), new THREE.MeshStandardMaterial({ color: 0xf4e9cf, roughness: .72 }));
      mesh.position.set(cell[1], 0, cell[0]); mesh.receiveShadow = true;
      const edges = new THREE.LineSegments(edgeGeometry.clone(), new THREE.LineBasicMaterial({ color: 0x8a755e, transparent: true, opacity: .72 }));
      edges.position.y = .002; mesh.add(edges);
      this.tiles.add(mesh); this.tileMeshes.set(cellKey(cell), mesh);
    });
    tileGeometry.dispose(); edgeGeometry.dispose();
    problem.path.slice(0, -1).forEach((cell, index) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(.42, .42),
        new THREE.MeshBasicMaterial({ map: makeArrowTexture(problem.directions[index]), transparent: true, depthWrite: false, side: THREE.DoubleSide })
      );
      plane.rotation.x = -Math.PI / 2; plane.position.set(cell[1], TILE_TOP + .006, cell[0]); plane.renderOrder = 3;
      this.arrows.add(plane);
    });
    this.frameRoute();
    this.setState(orientation, step);
  }

  frameRoute() {
    const rows = this.problem.path.map((cell) => cell[0]);
    const cols = this.problem.path.map((cell) => cell[1]);
    const minRow = Math.min(...rows), maxRow = Math.max(...rows), minCol = Math.min(...cols), maxCol = Math.max(...cols);
    this.target = new THREE.Vector3((minCol + maxCol) / 2, .18, (minRow + maxRow) / 2);
    const spanX = maxCol - minCol + 1;
    const spanZ = maxRow - minRow + 1;
    this.viewSize = Math.max(3.2, (spanX + spanZ) * .5 + 1.2);
    this.camera.position.copy(this.target).add(new THREE.Vector3(6.2, 7.4, 8.2));
    this.camera.lookAt(this.target);
    this.resize();
  }

  setState(orientation, step = 0) {
    const safeStep = Math.min(step, this.problem.path.length - 1);
    const cell = this.problem.path[safeStep];
    this.die.position.set(cell[1], TILE_TOP + DIE_SIZE / 2, cell[0]);
    this.die.quaternion.copy(ORIENTATION_QUATERNIONS.get(orientationKey(orientation)) || new THREE.Quaternion());
    this.host.dataset.step = String(step);
    this.host.dataset.top = String(orientation.top);
    this.host.dataset.bottom = String(orientation.bottom);
    this.updateTiles(step);
    this.render();
  }

  updateTiles(step) {
    this.tileMeshes.forEach((mesh, key) => {
      const indices = this.problem.path.map(cellKey).reduce((all, item, index) => item === key ? [...all, index] : all, []);
      const current = indices.includes(Math.min(step, this.problem.path.length - 1));
      const passed = indices.some((index) => index < step);
      mesh.material.color.set(current ? 0xe2b14e : passed ? 0x9fc7bd : 0xf4e9cf);
      mesh.material.roughness = current ? .5 : .72;
    });
    this.arrows.children.forEach((arrow, index) => { arrow.material.opacity = index < step ? .34 : .92; });
  }

  rollTo(direction, orientation, nextStep) {
    if (this.animating) return Promise.resolve();
    this.animating = true; this.host.dataset.rolling = "true";
    const startCell = this.problem.path[Math.min(nextStep - 1, this.problem.path.length - 1)];
    const nextCell = this.problem.path[Math.min(nextStep, this.problem.path.length - 1)];
    const { dr, dc } = directionInfo[direction];
    const pivot = new THREE.Group();
    pivot.position.set(startCell[1] + dc * DIE_SIZE / 2, TILE_TOP, startCell[0] + dr * DIE_SIZE / 2);
    this.scene.add(pivot); pivot.attach(this.die);
    const { axis, angle } = ROTATIONS[direction];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 1 : ROLL_DURATION;
    const startTime = performance.now();
    return new Promise((resolve) => {
      const animate = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        pivot.quaternion.setFromAxisAngle(axis, angle * easeInOut(progress));
        this.render();
        if (progress < 1) { requestAnimationFrame(animate); return; }
        pivot.updateMatrixWorld(true); this.scene.attach(this.die); this.scene.remove(pivot);
        this.die.position.set(nextCell[1], TILE_TOP + DIE_SIZE / 2, nextCell[0]);
        this.die.quaternion.copy(ORIENTATION_QUATERNIONS.get(orientationKey(orientation)) || this.die.quaternion).normalize();
        this.host.dataset.step = String(nextStep);
        this.host.dataset.top = String(orientation.top);
        this.host.dataset.bottom = String(orientation.bottom);
        this.host.dataset.rolling = "false";
        this.animating = false; this.updateTiles(nextStep); this.render(); resolve();
      };
      requestAnimationFrame(animate);
    });
  }

  resize() {
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewHeight = this.viewSize || 4.5;
    const viewWidth = viewHeight * aspect;
    this.camera.left = -viewWidth / 2; this.camera.right = viewWidth / 2;
    this.camera.top = viewHeight / 2; this.camera.bottom = -viewHeight / 2;
    this.camera.updateProjectionMatrix(); this.render();
  }

  render() { this.renderer.render(this.scene, this.camera); }

  dispose() {
    this.resizeObserver.disconnect(); this.clearRoute(); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
