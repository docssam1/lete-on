import * as THREE from "../../vendor/three/three.module.js";
import { OrbitControls } from "../../vendor/three/addons/controls/OrbitControls.js";
import { foldCubeNet } from "./levels.js?v=net-5";

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const vector = (value) => new THREE.Vector3(...value);

function faceTexture(face) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 384;
  const context = canvas.getContext("2d");
  context.fillStyle = face.color || "#69b8c9";
  context.fillRect(0, 0, 384, 384);
  const depth = context.createLinearGradient(0, 0, 384, 384);
  depth.addColorStop(0, "rgba(255,255,255,.82)");
  depth.addColorStop(.28, "rgba(255,255,255,.2)");
  depth.addColorStop(.68, "rgba(255,255,255,0)");
  depth.addColorStop(1, "rgba(26,61,79,.3)");
  context.fillStyle = depth;
  context.fillRect(0, 0, 384, 384);
  const highlight = context.createRadialGradient(104, 76, 8, 104, 76, 230);
  highlight.addColorStop(0, "rgba(255,255,255,.58)");
  highlight.addColorStop(.42, "rgba(255,255,255,.12)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = highlight;
  context.fillRect(0, 0, 384, 384);
  context.strokeStyle = "#36586b";
  context.lineWidth = 13;
  context.strokeRect(7, 7, 370, 370);
  context.strokeStyle = "rgba(255,255,255,.65)";
  context.lineWidth = 5;
  context.strokeRect(15, 15, 354, 354);
  context.fillStyle = "#17264a";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 134px Arial, sans-serif";
  context.fillText(face.label || "", 192, face.arrow ? 152 : 196);
  if (face.arrow) {
    context.save();
    context.translate(192, 286);
    context.rotate({ up: 0, right: Math.PI / 2, down: Math.PI, left: -Math.PI / 2 }[face.arrow]);
    context.strokeStyle = "#17264a";
    context.fillStyle = "#17264a";
    context.lineCap = "round";
    context.lineWidth = 20;
    context.beginPath();
    context.moveTo(0, 54);
    context.lineTo(0, -48);
    context.stroke();
    context.beginPath();
    context.moveTo(0, -68);
    context.lineTo(-34, -26);
    context.lineTo(34, -26);
    context.closePath();
    context.fill();
    context.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export class NetFoldViewer {
  constructor(host) {
    this.host = host;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, 1, .1, 100);
    this.camera.position.set(0, 0, 8);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.domElement.setAttribute("role","img");
    this.renderer.domElement.setAttribute("aria-label","접히는 전개도와 완성된 정육면체");
    host.replaceChildren(this.renderer.domElement);
    host.dataset.material = "satin-enamel";
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 9;
    this.controls.enabled = false;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.scene.add(new THREE.HemisphereLight(0xfff7df, 0x55718c, 2.25));
    const key = new THREE.DirectionalLight(0xffffff, 3.1);
    key.position.set(4, 7, 8);
    key.castShadow = true;
    this.scene.add(key);
    this.faces = [];
    this.progress = 0;
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();
    this.running = true;
    this.renderLoop();
  }

  clear() {
    this.group.traverse((node) => {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => { material.map?.dispose(); material.dispose(); });
      }
    });
    this.group.clear();
    this.faces = [];
  }

  setNet(cells, faceData, targetView = null) {
    this.clear();
    const folded = foldCubeNet(cells);
    if (!folded.valid) throw new Error("The viewer received an invalid cube net");
    const byCell = new Map(faceData.map((face) => [face.cell.join(","), face]));
    const centerX = (Math.min(...folded.cells.map(([x]) => x)) + Math.max(...folded.cells.map(([x]) => x))) / 2;
    const centerY = (Math.min(...folded.cells.map(([, y]) => y)) + Math.max(...folded.cells.map(([, y]) => y))) / 2;
    this.flatSpan={width:Math.max(...folded.cells.map(([x])=>x))-Math.min(...folded.cells.map(([x])=>x))+1,height:Math.max(...folded.cells.map(([,y])=>y))-Math.min(...folded.cells.map(([,y])=>y))+1};
    this.host.dataset.netWidth=String(this.flatSpan.width);this.host.dataset.netHeight=String(this.flatSpan.height);
    folded.cells.forEach((cell, index) => {
      const data = byCell.get(cell.join(",")) || { cell, label: String(index + 1), color: "#ddb16c" };
      const texture = faceTexture(data);
      const material = new THREE.MeshPhysicalMaterial({ map: texture, roughness: .3, metalness: .01, clearcoat: .58, clearcoatRoughness: .24, side: THREE.DoubleSide });
      const geometry = new THREE.PlaneGeometry(.96, .96);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = mesh.receiveShadow = true;
      const border = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x35576a, transparent: true, opacity: .72 }));
      mesh.add(border);
      const startPosition = new THREE.Vector3(cell[0] - centerX, centerY - cell[1], 0);
      const startQuaternion = new THREE.Quaternion();
      const frame = folded.frames[index];
      const xAxis = vector(frame.u);
      const yAxis = vector(frame.v).negate();
      // Texture "up" is the opposite of the net's down-axis (v). Flipping only
      // that axis would create a reflection, which a quaternion cannot represent.
      // Point the plane's local normal inward as well so the basis stays a proper
      // rotation (determinant +1); DoubleSide keeps the outward surface visible.
      const normal = vector(frame.n);
      const matrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, normal.clone().negate());
      const finalQuaternion = new THREE.Quaternion().setFromRotationMatrix(matrix);
      const finalPosition = normal.multiplyScalar(.505);
      mesh.position.copy(startPosition);
      this.group.add(mesh);
      this.faces.push({ mesh, startPosition, startQuaternion, finalPosition, finalQuaternion, order: index });
    });
    const faceFrames = new Map(folded.cells.map((cell, index) => [byCell.get(cell.join(","))?.label, folded.frames[index]]));
    const topNormal = targetView && faceFrames.get(targetView.top)?.n;
    const frontNormal = targetView && faceFrames.get(targetView.front)?.n;
    const rightNormal = targetView && faceFrames.get(targetView.right)?.n;
    this.flatCamera = new THREE.Vector3();this.updateFlatCamera();
    this.flatUp = new THREE.Vector3(0, 1, 0);
    this.foldCamera = topNormal && frontNormal && rightNormal
      ? vector(topNormal).multiplyScalar(1.8).add(vector(frontNormal).multiplyScalar(3)).add(vector(rightNormal).multiplyScalar(2.4))
      : new THREE.Vector3(3, 2.6, 4);
    this.foldUp = topNormal ? vector(topNormal) : new THREE.Vector3(0, 1, 0);
    this.progress = 0;
    this.controls.enabled = false;
    this.camera.position.copy(this.flatCamera);
    this.camera.up.copy(this.flatUp);
    this.camera.lookAt(0, 0, 0);
    this.controls.target.set(0, 0, 0);
    this.setProgress(0);
  }

  updateFlatCamera(){
    if(!this.flatSpan)return;
    const halfFov=THREE.MathUtils.degToRad(this.camera.fov/2);
    const aspect=Math.max(.25,this.camera.aspect||1);
    const vertical=this.flatSpan.height/(2*Math.tan(halfFov));
    const horizontal=this.flatSpan.width/(2*Math.tan(halfFov)*aspect);
    this.flatCamera.set(0,0,Math.max(3.8,vertical,horizontal)*1.16);
  }

  setProgress(progress) {
    this.progress = clamp(progress);
    this.host.dataset.foldProgress=this.progress.toFixed(3);
    this.faces.forEach((face) => {
      const local = smooth(this.progress * 1.42 - face.order * .085);
      face.mesh.position.lerpVectors(face.startPosition, face.finalPosition, local);
      face.mesh.quaternion.slerpQuaternions(face.startQuaternion, face.finalQuaternion, local);
    });
    const cameraT = smooth(clamp((this.progress - .25) / .75));
    this.camera.position.lerpVectors(this.flatCamera, this.foldCamera, cameraT);
    this.camera.up.lerpVectors(this.flatUp, this.foldUp, cameraT).normalize();
    this.camera.lookAt(0, 0, 0);
    this.controls.enabled = this.progress > .98;
  }

  animateTo(target) {
    cancelAnimationFrame(this.animationFrame);
    const from = this.progress;
    const start = performance.now();
    const duration = Math.max(500, 1500 * Math.abs(target - from));
    const step = (now) => {
      const t = smooth((now - start) / duration);
      this.setProgress(from + (target - from) * t);
      if (t < 1) this.animationFrame = requestAnimationFrame(step);
    };
    this.animationFrame = requestAnimationFrame(step);
  }

  resize() {
    const width = Math.max(1, this.host.clientWidth);
    const height = Math.max(1, this.host.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if(this.flatSpan&&this.progress<.02){this.updateFlatCamera();this.camera.position.copy(this.flatCamera);this.camera.lookAt(0,0,0);}
  }

  renderLoop() {
    if (!this.running) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.renderLoop());
  }

  dispose() {
    this.running = false;
    this.resizeObserver.disconnect();
    cancelAnimationFrame(this.animationFrame);
    this.clear();
    this.controls.dispose();
    this.renderer.dispose();
  }
}
