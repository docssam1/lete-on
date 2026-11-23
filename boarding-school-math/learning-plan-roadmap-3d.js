import * as THREE from "../geometry/vendor/three/three.module.js";
import { OrbitControls } from "../geometry/vendor/three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("roadmap-canvas");
const fallback = document.getElementById("roadmap-fallback");
if (!canvas) throw new Error("roadmap canvas is required");

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
} catch (error) {
  fallback.hidden = false;
  canvas.hidden = true;
  throw error;
}

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0d1728, 12, 29);
const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 80);
camera.position.set(10.8, 12.2, 15.2);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 10;
controls.maxDistance = 23;
controls.minPolarAngle = Math.PI * 0.19;
controls.maxPolarAngle = Math.PI * 0.43;
controls.target.set(0, 0.8, -2.2);

scene.add(new THREE.HemisphereLight(0xd8e6ff, 0x20304b, 2.1));
const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(8, 12, 7);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x6f96ed, 1.5);
fillLight.position.set(-8, 5, -6);
scene.add(fillLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 28, 20, 20),
  new THREE.MeshBasicMaterial({ color: 0x16243a, wireframe: true, transparent: true, opacity: 0.2 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.set(0, -0.36, -3);
scene.add(ground);

const dynamic = new THREE.Group();
scene.add(dynamic);
let pulses = [];
let animationId = 0;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function material(color, roughness) {
  return new THREE.MeshStandardMaterial({ color, roughness: roughness == null ? 0.55 : roughness, metalness: 0.12 });
}
function disposeObject(object) {
  object.traverse(function (node) {
    if (node.geometry) node.geometry.dispose();
    if (node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materials.forEach(function (entry) {
        if (entry.map) entry.map.dispose();
        entry.dispose();
      });
    }
  });
}
function clearDynamic() {
  pulses = [];
  while (dynamic.children.length) {
    const child = dynamic.children.pop();
    disposeObject(child);
  }
}
function platform(position, color, radius, height) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.08, height, 48), material(color, 0.48));
  mesh.position.copy(position);
  mesh.position.y -= height / 2;
  dynamic.add(mesh);
  return mesh;
}
function road(points, color, radius, opacity) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.42);
  const mat = material(color, 0.42);
  mat.transparent = opacity < 1;
  mat.opacity = opacity;
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, radius, 10, false), mat);
  dynamic.add(mesh);
  return { curve, mesh };
}
function labelSprite(text, position, accent, scaleX, scaleY) {
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 512;
  labelCanvas.height = 128;
  const context = labelCanvas.getContext("2d");
  context.clearRect(0, 0, 512, 128);
  context.fillStyle = "rgba(8,16,29,.9)";
  context.strokeStyle = accent ? "#7aa2ff" : "#60748f";
  context.lineWidth = 4;
  context.beginPath();
  context.roundRect(4, 4, 504, 120, 18);
  context.fill();
  context.stroke();
  context.fillStyle = "#f4f7fb";
  context.font = "700 34px Pretendard, Noto Sans KR, Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 66, 470);
  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.position.copy(position);
  sprite.scale.set(scaleX || 2.5, scaleY || 0.7, 1);
  dynamic.add(sprite);
  return sprite;
}
function addPulse(curve, color, speed, offset) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.19, 18, 12), new THREE.MeshBasicMaterial({ color }));
  dynamic.add(mesh);
  pulses.push({ mesh, curve, speed, offset });
}
function branchLabel(model, option) {
  if (option.id === "maintain") return model.locale === "en" ? "Keep" : model.locale === "zh-Hans" ? "保持" : "유지";
  if (option.id === "time") return model.locale === "en" ? "+ time" : model.locale === "zh-Hans" ? "+ 时间" : "+ 시간";
  if (option.id === "session") return model.locale === "en" ? "+ day" : model.locale === "zh-Hans" ? "+ 次数" : "+ 횟수";
  return model.locale === "en" ? "Both" : model.locale === "zh-Hans" ? "同时" : "둘 다";
}
function build(model) {
  if (!model) return;
  clearDynamic();
  const start = new THREE.Vector3(0, 0.15, 5.1);
  const stable = new THREE.Vector3(0, 0.72, 1.15);
  const target = new THREE.Vector3(0, 2.55, -8.2);
  platform(start, 0x2a3e5d, 0.75, 0.35);
  platform(stable, model.stability.accelerationLocked ? 0xb7791f : 0x16734b, 0.92, 0.42);
  platform(target, 0x2456c4, 1.2, 0.52);
  labelSprite(model.locale === "en" ? "Current" : model.locale === "zh-Hans" ? "当前" : "현재", start.clone().add(new THREE.Vector3(0, 1.02, 0)), false, 1.75, 0.58);
  labelSprite(model.locale === "en" ? "Stabilize" : model.locale === "zh-Hans" ? "稳定" : "안정화", stable.clone().add(new THREE.Vector3(0, 1.08, 0)), !model.stability.accelerationLocked, 1.9, 0.6);
  labelSprite(model.locale === "en" ? "Target" : model.locale === "zh-Hans" ? "目标" : "목표", target.clone().add(new THREE.Vector3(0, 1.28, 0)), true, 1.75, 0.58);

  const entry = road([start, new THREE.Vector3(0, 0.28, 3.5), stable], model.stability.accelerationLocked ? 0xc18b3b : 0x5c7fba, 0.18, 1);
  addPulse(entry.curve, model.stability.accelerationLocked ? 0xffcb70 : 0xaac3ff, 0.07, 0);
  const branchX = [-4.35, -1.45, 1.45, 4.35];
  model.pace.options.forEach(function (option, index) {
    const chosen = option.id === model.pace.selectedOptionId;
    const branch = new THREE.Vector3(branchX[index], 1.08 + index * 0.12, -2.5);
    const roadColor = chosen ? 0x4f7fff : option.feasible ? 0x3a755c : 0x54647b;
    platform(branch, roadColor, chosen ? 0.7 : 0.56, chosen ? 0.42 : 0.3);
    labelSprite(String(index + 1), branch.clone().add(new THREE.Vector3(0, 0.98, 0)), chosen, 0.72, 0.62);
    const first = road([stable, new THREE.Vector3(branch.x * 0.52, 0.92, -0.45), branch], roadColor, chosen ? 0.18 : 0.11, chosen ? 1 : 0.62);
    const second = road([branch, new THREE.Vector3(branch.x * 0.38, 1.9, -5.2), target], roadColor, chosen ? 0.18 : 0.11, chosen ? 1 : 0.52);
    addPulse(first.curve, chosen ? 0xbcd0ff : 0x7890aa, 0.055 + option.weeklyCapacity * 0.005, index * 0.17);
    if (chosen) addPulse(second.curve, 0xffffff, 0.07 + option.weeklyCapacity * 0.005, 0.45);
  });

  const towerZ = [3.6, 0, -3.8];
  model.comparison.forEach(function (entry, index) {
    const height = 0.7 + entry.value / 100 * 3.3;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.68, height, 0.68), material(index === 2 ? 0x4f7fff : index === 1 ? 0x3a755c : 0x718199, 0.35));
    tower.position.set(6.15, height / 2 - 0.25, towerZ[index]);
    dynamic.add(tower);
  });
  resize();
  renderFrame(performance.now());
}

function resize() {
  const width = Math.max(1, canvas.clientWidth);
  const height = Math.max(1, canvas.clientHeight);
  if (canvas.width !== Math.round(width * renderer.getPixelRatio()) || canvas.height !== Math.round(height * renderer.getPixelRatio())) renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
function renderFrame(time) {
  if (!reducedMotion.matches) {
    pulses.forEach(function (pulse) {
      const phase = (time * 0.001 * pulse.speed + pulse.offset) % 1;
      pulse.mesh.position.copy(pulse.curve.getPointAt(phase));
      pulse.mesh.position.y += 0.24;
    });
    controls.update();
  }
  renderer.render(scene, camera);
  if (!fallback.hidden) {
    fallback.hidden = true;
    canvas.removeAttribute("aria-hidden");
  }
}
function animate(time) {
  renderFrame(time);
  animationId = requestAnimationFrame(animate);
}
function setAnimation() {
  if (animationId) cancelAnimationFrame(animationId);
  animationId = 0;
  if (reducedMotion.matches) renderFrame(performance.now());
  else animationId = requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("gfield-roadmap-update", function (event) { build(event.detail); });
controls.addEventListener("change", function () { if (reducedMotion.matches) renderFrame(performance.now()); });
reducedMotion.addEventListener("change", setAnimation);
build(window.GFIELDLatestRoadmapModel);
setAnimation();

window.addEventListener("pagehide", function () {
  if (animationId) cancelAnimationFrame(animationId);
  controls.dispose();
  clearDynamic();
  renderer.dispose();
}, { once: true });
