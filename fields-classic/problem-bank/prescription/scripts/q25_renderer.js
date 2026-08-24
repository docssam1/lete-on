import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const target = Math.max(4, Math.min(7, Number(new URLSearchParams(location.search).get("target")) || 4));
const alignment = new URLSearchParams(location.search).get("alignment") === "upper-left"
  ? "upper-left"
  : "center";
document.querySelector("#questionTarget").textContent = String(target);
document.querySelector("#targetLabel").textContent = String(target);

function createWoodTexture(renderer) {
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
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function addPyramid(group, order, cubeGeometry, cubeMaterial, edgeGeometry, edgeMaterial) {
  for (let layer = 0; layer < order; layer += 1) {
    const side = order - layer;
    const offsetX = alignment === "upper-left" ? 0 : layer / 2;
    const offsetZ = alignment === "upper-left" ? layer : layer / 2;
    for (let row = 0; row < side; row += 1) {
      for (let column = 0; column < side; column += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(
          column + offsetX - (order - 1) / 2,
          layer + 0.5,
          row + offsetZ - (order - 1) / 2
        );
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
        group.add(cube);
      }
    }
  }
}

function addBoard(group, order, woodTexture) {
  const traySize = order + 1.75;
  const railSpan = order + 1.18;
  const railOffset = order / 2 + 0.56;
  const boardMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0xe7c28e,
    roughness: 0.58,
    metalness: 0.01,
    bumpMap: woodTexture,
    bumpScale: 0.01
  });
  const board = new THREE.Mesh(
    new RoundedBoxGeometry(traySize, 0.24, traySize, 8, 0.18),
    boardMaterial
  );
  board.position.y = -0.15;
  board.receiveShadow = true;
  board.castShadow = true;
  group.add(board);

  const railMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0xd0a36b,
    roughness: 0.58,
    metalness: 0.01,
    bumpMap: woodTexture,
    bumpScale: 0.009
  });
  [
    { x: 0, z: railOffset, sx: railSpan, sz: 0.18 },
    { x: 0, z: -railOffset, sx: railSpan, sz: 0.18 },
    { x: railOffset, z: 0, sx: 0.18, sz: railSpan },
    { x: -railOffset, z: 0, sx: 0.18, sz: railSpan }
  ].forEach((rail) => {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(rail.sx, 0.12, rail.sz, 5, 0.06),
      railMaterial
    );
    mesh.position.set(rail.x, 0.005, rail.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  });

  const floorTexture = woodTexture.clone();
  floorTexture.repeat.set(2, 2);
  floorTexture.needsUpdate = true;
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(order + 0.28, order + 0.28),
    new THREE.MeshStandardMaterial({
      map: floorTexture,
      color: 0xdbe2d7,
      roughness: 0.9,
      bumpMap: floorTexture,
      bumpScale: 0.0025
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.014;
  floor.receiveShadow = true;
  group.add(floor);
}

function renderScene(container, order) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf7e8cf);
  scene.fog = new THREE.Fog(0xf7e8cf, 13, 24);

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  const distance = order === 1 ? 4.1 : order === 2 ? 5.8 : 7.2;
  camera.position.set(distance * 0.82, distance * 0.73, distance * 0.93);
  camera.lookAt(0, order * 0.38, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(2);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2));
  const sunlight = new THREE.DirectionalLight(0xffffff, 2.4);
  sunlight.position.set(5, 8.5, 4);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  sunlight.shadow.camera.left = -7;
  sunlight.shadow.camera.right = 7;
  sunlight.shadow.camera.top = 7;
  sunlight.shadow.camera.bottom = -7;
  scene.add(sunlight);

  const woodTexture = createWoodTexture(renderer);
  const cubeGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 5, 0.075);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff5df,
    map: woodTexture,
    roughness: 0.56,
    metalness: 0.012,
    bumpMap: woodTexture,
    bumpScale: 0.012
  });
  const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry, 28);
  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0x8b6840,
    transparent: true,
    opacity: 0.18
  });
  const group = new THREE.Group();
  scene.add(group);
  addBoard(group, order, woodTexture);
  addPyramid(group, order, cubeGeometry, cubeMaterial, edgeGeometry, edgeMaterial);
  renderer.render(scene, camera);
}

document.querySelectorAll(".scene").forEach((container) => {
  renderScene(container, Number(container.dataset.order));
});
window.__Q25_READY__ = true;
