import * as THREE from "../../geometry/vendor/three/three.module.js";
import { OrbitControls } from "../../geometry/vendor/three/addons/controls/OrbitControls.js";

export const FACE_COLORS = Object.freeze([0xc5d9dc, 0xdbe5e3, 0xfafcf8, 0xd2d6d5, 0xe2eee8, 0xe7ece8]);

export function createStackRenderer(host, { heights, interactive = true, pixelRatio = 2 } = {}) {
  const api = window.HSE_SOURCE_GRADE6_STACK_MODELS;
  const cells = api.cubes(heights);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.setPixelRatio(Math.min(pixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.style.removeProperty("display");
  canvas.className = "source62-stack-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "앞쪽과 오른쪽에서 바라본 쌓기나무 입체 그림");
  canvas.setAttribute("tabindex", "0");
  host.append(canvas);
  const scene = new THREE.Scene();
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(geometry);
  const materials = FACE_COLORS.map(color => new THREE.MeshBasicMaterial({ color, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x111111 });
  for (const [x,y,z] of cells) {
    const mesh = new THREE.Mesh(geometry, materials);
    mesh.position.set(x,y,z);
    mesh.userData.cell = [x,y,z];
    group.add(mesh);
    const line = new THREE.LineSegments(edges, edgeMaterial);
    line.position.copy(mesh.position);
    group.add(line);
  }
  const bounds = new THREE.Box3().setFromObject(group), center = bounds.getCenter(new THREE.Vector3());
  const distance = bounds.getSize(new THREE.Vector3()).length() + 12;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 100);
  camera.position.copy(center).add(new THREE.Vector3(1,1,1).normalize().multiplyScalar(distance));
  camera.lookAt(center);
  const controls = new OrbitControls(camera, canvas);
  controls.target.copy(center);
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = false;
  controls.enabled = interactive;
  controls.minPolarAngle = .2;
  controls.maxPolarAngle = Math.PI / 2 - .05;
  controls.update();
  controls.saveState();
  const labels = [
    ["앞", new THREE.Vector3(center.x, -.5, bounds.max.z + .8)],
    ["오른쪽", new THREE.Vector3(bounds.max.x + .8, -.5, center.z)]
  ].map(([name,point]) => {
    const el = document.createElement("span");
    el.className = "source62-stack-direction";
    el.textContent = name;
    el.dataset.direction = name;
    host.append(el);
    return {el,point};
  });
  let width = 1, height = 1, disposed = false;
  function fit() {
    camera.updateMatrixWorld(true);
    let extentX = 0, extentY = 0;
    // Fit all eight corners, not a hand-selected visible outline.
    for (const x of [bounds.min.x,bounds.max.x]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [bounds.min.z,bounds.max.z]) {
      const v = new THREE.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);
      extentX = Math.max(extentX, Math.abs(v.x));
      extentY = Math.max(extentY, Math.abs(v.y));
    }
    for (const {point} of labels) {
      const v = point.clone().applyMatrix4(camera.matrixWorldInverse);
      extentX = Math.max(extentX, Math.abs(v.x));
      extentY = Math.max(extentY, Math.abs(v.y));
    }
    const halfY = Math.max(extentY, extentX / (width / height)) * 1.2;
    camera.left = -halfY * width / height;
    camera.right = -camera.left;
    camera.top = halfY;
    camera.bottom = -halfY;
    camera.updateProjectionMatrix();
  }
  function draw() {
    if (disposed) return;
    fit();
    renderer.render(scene, camera);
    for (const {el,point} of labels) {
      const p = point.clone().project(camera);
      el.style.left = `${(p.x + 1) * width / 2}px`;
      el.style.top = `${(1 - p.y) * height / 2}px`;
    }
  }
  function resize() {
    if (disposed) return;
    width = Math.max(1,host.clientWidth);
    height = Math.max(1,host.clientHeight);
    renderer.setSize(width, height, false);
    draw();
  }
  function reset() { controls.reset(); draw(); }
  function keyboard(event) {
    if (event.key === "Home") { event.preventDefault(); reset(); }
  }
  canvas.addEventListener("keydown", keyboard);
  controls.addEventListener("change", draw);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  return {
    reset,
    render: draw,
    snapshot({width: exportWidth = 640, height: exportHeight = 520, directionFontSize} = {}) {
      if (!Number.isInteger(exportWidth) || !Number.isInteger(exportHeight) || exportWidth < 200 || exportHeight < 200 || exportWidth > 1600 || exportHeight > 1600) throw new Error("Invalid export dimensions");
      if (directionFontSize !== undefined && (!Number.isFinite(directionFontSize) || directionFontSize < 12 || directionFontSize > 32)) throw new Error("Invalid direction font size");
      reset(); width = exportWidth; height = exportHeight;
      renderer.setSize(width,height,false);
      try {
      draw();
      const output = document.createElement("canvas");
      output.width = canvas.width; output.height = canvas.height;
      const ctx = output.getContext("2d"), ratio = output.width / width;
      ctx.drawImage(canvas,0,0);
      ctx.fillStyle = "#000"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (const {el} of labels) {
        const style = getComputedStyle(el);
        ctx.font = `${style.fontWeight} ${(directionFontSize ?? parseFloat(style.fontSize))*ratio}px ${style.fontFamily}`;
        const x = parseFloat(el.style.left)*ratio, y = parseFloat(el.style.top)*ratio, metrics = ctx.measureText(el.textContent);
        if (x-metrics.actualBoundingBoxLeft < 4 || x+metrics.actualBoundingBoxRight > output.width-4 || y-metrics.actualBoundingBoxAscent < 4 || y+metrics.actualBoundingBoxDescent > output.height-4) throw new Error("Direction label outside snapshot");
        ctx.fillText(el.textContent,x,y);
      }
      return output.toDataURL("image/png");
      } finally { resize(); }
    },
    inspect() {
      draw();
      const copy = document.createElement("canvas");
      copy.width = canvas.width; copy.height = canvas.height;
      const ctx = copy.getContext("2d", {willReadFrequently:true});
      ctx.drawImage(canvas,0,0);
      return { cells: cells.map(c=>[...c]), width: canvas.width, height: canvas.height,
        pixels: ctx.getImageData(0,0,copy.width,copy.height).data,
        projectionInverse: camera.projectionMatrixInverse.toArray(), projection: camera.projectionMatrix.toArray(),
        world: camera.matrixWorld.toArray(), view: camera.matrixWorldInverse.toArray(),
        cubeCount: cells.length, meshCount: group.children.filter(c=>c.isMesh).length, revision: THREE.REVISION,
        directions: labels.map(({el})=>({name:el.textContent,left:parseFloat(el.style.left),top:parseFloat(el.style.top)})) };
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      observer.disconnect(); controls.removeEventListener("change", draw); controls.dispose();
      canvas.removeEventListener("keydown",keyboard);
      geometry.dispose(); edges.dispose(); materials.forEach(m=>m.dispose()); edgeMaterial.dispose();
      renderer.dispose(); renderer.forceContextLoss();
      canvas.remove(); labels.forEach(({el})=>el.remove());
    }
  };
}
