import * as THREE from 'three';

const W = 2000, H = 1342;
const q = new URLSearchParams(location.search);
const M = n => import(`./m/${n}.mjs`).then(m => m.createAsset);

// ---------- deterministic noise ----------
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const hash2 = (x, z) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };

// ---------- renderer / camera ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
{ // sky gradient
  const c = document.createElement('canvas'); c.width = 4; c.height = 512;
  const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#79bde8'); gr.addColorStop(0.55, '#b9e0f3'); gr.addColorStop(1, '#e9f5f2');
  g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
}
scene.fog = new THREE.Fog(0xcfe8f2, 180, 900);

const camera = new THREE.PerspectiveCamera(32, W / H, 1, 1400);
camera.position.set(0, 44, 100); camera.lookAt(0, 0, -26); camera.updateMatrixWorld();

// ---------- screen -> ground ----------
const ray = new THREE.Raycaster();
function onPlane(sx, sy, y = 0) {
  ray.setFromCamera(new THREE.Vector2(sx * 2 - 1, -(sy * 2 - 1)), camera);
  const p = new THREE.Vector3();
  ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -y), p);
  return p;
}

// Places: screen point (fraction of the 2000x1342 map) where the building's foot should stand.
// Taken from TOWN_SPOTS / TOWN_GATES in number_magic/app/main.js so the existing hit zones still fit.
const SPOT = {
  tower: [0.33, 0.205], tents: [0.155, 0.47], tavern: [0.49, 0.55], chapel: [0.632, 0.475],
  houses: [0.555, 0.735], mush: [0.20, 0.78], west: [0.035, 0.535], windmill: [0.865, 0.47], dock: [0.79, 0.87]
};
const P0 = {}; for (const k in SPOT) P0[k] = onPlane(...SPOT[k]);

// ---------- terrain shape ----------
const HILL = 10; const hillC = onPlane(...SPOT.tower, HILL + 0.6);
const lakeC = onPlane(0.87, 0.9);
const riverPts = [onPlane(0.80, 0.16), onPlane(0.76, 0.33), onPlane(0.73, 0.52), onPlane(0.75, 0.70), lakeC.clone()];
const segDist = (x, z, a, b) => {
  const vx = b.x - a.x, vz = b.z - a.z, wx = x - a.x, wz = z - a.z;
  const t = Math.max(0, Math.min(1, (wx * vx + wz * vz) / (vx * vx + vz * vz)));
  return Math.hypot(x - (a.x + vx * t), z - (a.z + vz * t));
};
const polyDist = (x, z, pts) => { let d = 1e9; for (let i = 0; i < pts.length - 1; i++) d = Math.min(d, segDist(x, z, pts[i], pts[i + 1])); return d; };
const riverD = (x, z) => polyDist(x, z, riverPts);
const lakeE = (x, z) => ((x - lakeC.x) / 20) ** 2 + ((z - lakeC.z) / 11) ** 2;

const pads = []; // {x,z,r,y}
function rawH(x, z) {
  let h = 0.8 + 0.55 * Math.sin(x * 0.11) + 0.45 * Math.cos(z * 0.13) + 0.3 * Math.sin((x + z) * 0.07);
  const dh = Math.hypot(x - hillC.x, z - hillC.z);
  h += HILL * smooth(17, 4, dh);
  const back = smooth(hillC.z + 4, hillC.z - 30, z), back2 = smooth(hillC.z - 40, hillC.z - 90, z);
  h += back * (5 + 3 * Math.sin(x * 0.045) + 2 * Math.cos(x * 0.09 + 1)) + back2 * (3 + 2 * Math.sin(x * 0.03 + 2));
  return h;
}
function water(x, z, h) {
  const e = lakeE(x, z); h -= 3.2 * smooth(1.25, 0.65, e);
  const r = riverD(x, z); h -= 2.6 * smooth(3.4, 1.4, r);
  return h;
}
function height(x, z) {
  let h = water(x, z, rawH(x, z));
  for (const p of pads) { const d = Math.hypot(x - p.x, z - p.z); const w = smooth(p.r + 3.5, p.r, d); h = h * (1 - w) + p.y * w; }
  return h;
}
function onGround(sx, sy) { // iterate ray against height field
  let p = onPlane(sx, sy, 0);
  for (let i = 0; i < 10; i++) p = onPlane(sx, sy, height(p.x, p.z));
  p.y = height(p.x, p.z); return p;
}
function pad(k, r) { const p = onPlane(...SPOT[k], 0); let y = rawH(p.x, p.z); for (let i = 0; i < 6; i++) { const pp = onPlane(...SPOT[k], y); y = rawH(pp.x, pp.z); p.copy(pp); } pads.push({ x: p.x, z: p.z, r, y }); }
pads.push({ x: hillC.x, z: hillC.z, r: 3.2, y: rawH(hillC.x, hillC.z) }); pad('tents', 9); pad('tavern', 8); pad('chapel', 5); pad('houses', 8); pad('mush', 12); pad('windmill', 4); pad('west', 2);
const POS = {}; for (const k in SPOT) POS[k] = onGround(...SPOT[k]);
POS.tower = new THREE.Vector3(hillC.x, height(hillC.x, hillC.z), hillC.z);

// ---------- paths ----------
const PATHS = [
  ['tents', 'tavern'], ['tavern', 'chapel'], ['tavern', 'houses'], ['houses', 'mush'], ['mush', 'tents'],
  ['west', 'tents'], ['houses', 'dock'], ['chapel', 'windmill']
].map(([a, b]) => [POS[a], POS[b]]);
const hp = (dx, dz) => new THREE.Vector3(hillC.x + dx, height(hillC.x + dx, hillC.z + dz), hillC.z + dz);
const hillFoot = hp(6, 17);
PATHS.push([hillFoot, POS.tavern]);
// switchback up the hill
const sw = [hillFoot, hp(-7, 12.5), hp(6, 8.5), hp(-4, 4.5), POS.tower];
for (let i = 0; i < sw.length - 1; i++) PATHS.push([sw[i], sw[i + 1]]);
const pathD = (x, z) => { let d = 1e9; for (const [a, b] of PATHS) d = Math.min(d, segDist(x, z, a, b)); return d; };

// ---------- terrain mesh ----------
{
  const X0 = -190, X1 = 190, Z0 = -300, Z1 = 70, S = 1.6;
  const nx = Math.round((X1 - X0) / S), nz = Math.round((Z1 - Z0) / S);
  const vtx = [];
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    let x = X0 + i * S, z = Z0 + j * S;
    if (i > 0 && i < nx && j > 0 && j < nz) { x += (hash2(i, j) - 0.5) * S * 0.55; z += (hash2(j + 3, i + 9) - 0.5) * S * 0.55; }
    vtx.push([x, height(x, z), z]);
  }
  const pos = [], col = [];
  const C = s => new THREE.Color(s);
  const grass = [C('#8cbf52'), C('#7fb24a'), C('#97c95c'), C('#76a845')];
  const dirt = C('#dcbf86'), dirt2 = C('#d2b37a'), sand = C('#e8d7a3'), rock = C('#a89c8a'), rock2 = C('#958a7a'), bed = C('#c9b483'), farhill = C('#6f9e4a');
  const tri = (a, b, cI) => {
    const A = vtx[a], B = vtx[b], Cc = vtx[cI];
    pos.push(...A, ...B, ...Cc);
    const cx = (A[0] + B[0] + Cc[0]) / 3, cy = (A[1] + B[1] + Cc[1]) / 3, cz = (A[2] + B[2] + Cc[2]) / 3;
    const u = new THREE.Vector3(B[0] - A[0], B[1] - A[1], B[2] - A[2]), v = new THREE.Vector3(Cc[0] - A[0], Cc[1] - A[1], Cc[2] - A[2]);
    const n = u.cross(v).normalize(); const ny = Math.abs(n.y);
    let c;
    const pd = pathD(cx, cz), wet = Math.min(riverD(cx, cz) - 3.6, (lakeE(cx, cz) - 1.35) * 9);
    if (cy < -1.0) c = bed;
    else if (wet < 1.6 && cy < 0.2) c = sand;
    else if (pd < 1.35) c = (hash2(cx, cz) > 0.5 ? dirt : dirt2);
    else if (ny < 0.72) c = (hash2(cz, cx) > 0.5 ? rock : rock2);
    else {
      const k = Math.floor((Math.sin(cx * 0.21) + Math.cos(cz * 0.17) + 2) * 1.0 + hash2(cx, cz) * 0.9) % 4;
      c = grass[k];
      if (cz < hillC.z - 20) c = c.clone().lerp(farhill, 0.35);
    }
    for (let i = 0; i < 3; i++) col.push(c.r, c.g, c.b);
  };
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
    if ((i + j) % 2) { tri(a, c, b); tri(b, c, d); } else { tri(a, c, d); tri(a, d, b); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  m.receiveShadow = true; scene.add(m);
  // water
  const wg = new THREE.PlaneGeometry(260, 220, 60, 50); wg.rotateX(-Math.PI / 2); wg.translate(0, -0.95, -40);
  const wp = wg.attributes.position; for (let i = 0; i < wp.count; i++) wp.setY(i, -0.95 + (hash2(wp.getX(i), wp.getZ(i)) - 0.5) * 0.12);
  const wm = new THREE.Mesh(wg.toNonIndexed(), new THREE.MeshStandardMaterial({ color: 0x4fa7d8, flatShading: true, roughness: 0.35, metalness: 0.05, transparent: true, opacity: 0.9 }));
  wm.geometry.computeVertexNormals(); wm.receiveShadow = true; scene.add(wm);
}

// ---------- distant mountains + clouds ----------
{
  const mcol = [0x6f9fb3, 0x7fb0c4, 0x8cbccc, 0x7aa6bd];
  for (let i = 0; i < 16; i++) {
    const r = 40 + rnd() * 40, h = 30 + rnd() * 30;
    const g = new THREE.ConeGeometry(r, h, 7 + Math.floor(rnd() * 3), 3);
    const p = g.attributes.position; for (let k = 0; k < p.count; k++) if (p.getY(k) > -h / 2 + 0.1 && p.getY(k) < h / 2 - 0.1) { p.setX(k, p.getX(k) * (0.85 + rnd() * 0.3)); p.setZ(k, p.getZ(k) * (0.85 + rnd() * 0.3)); }
    const m = new THREE.Mesh(g.toNonIndexed(), new THREE.MeshStandardMaterial({ color: mcol[i % 4], flatShading: true, roughness: 1 }));
    m.geometry.computeVertexNormals();
    m.position.set(-300 + i * 40 + rnd() * 12, h / 2 - 4, -300 - rnd() * 70); scene.add(m);
  }
  const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 1, emissive: 0xffffff, emissiveIntensity: 0.25 });
  const cloud = (x, y, z, s) => { const g = new THREE.Group(); for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 0), cm); b.scale.set(1.3 + rnd(), 0.8 + rnd() * 0.5, 1 + rnd() * 0.5); b.position.set((i - 2) * 1.3, Math.abs(i - 2) < 1 ? 0.5 : 0, rnd()); g.add(b); } g.position.set(x, y, z); g.scale.setScalar(s); scene.add(g); };
  cloud(-190, 70, -380, 14); cloud(-50, 82, -420, 11); cloud(90, 76, -400, 15); cloud(230, 88, -440, 12);
}

// ---------- light ----------
scene.add(new THREE.HemisphereLight(0xdff2ff, 0x6b8a4a, 1.35));
const sun = new THREE.DirectionalLight(0xfff1d6, 2.6);
sun.position.set(-55, 90, 45); sun.target.position.set(0, 0, -10);
sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 110, bottom: -110, near: 10, far: 300 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
scene.add(sun, sun.target);

// ---------- props ----------
const loaded = {};
async function put(name, opts, at, rotDeg = 0, s = 1) {
  const f = loaded[name] || (loaded[name] = await M(name));
  const o = f(opts || {});
  o.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
  o.position.copy(at); o.rotation.y = rotDeg * Math.PI / 180; o.scale.multiplyScalar(s);
  scene.add(o); return o;
}
const near = (p, dx, dz) => { const x = p.x + dx, z = p.z + dz; return new THREE.Vector3(x, height(x, z), z); };
const placed = []; // footprint circles to keep trees off
const mark = (p, r) => placed.push({ x: p.x, z: p.z, r });

async function build() {
  // CHALLENGE: watchtower on the hill
  await put('watchtower-140f78', { colorway: 'lime-plaster' }, POS.tower, -15, 1.75); mark(POS.tower, 5);
  // PRIME: tavern (big hall)
  await put('village-tavern-4e94e3', { colorway: 'cream-oak' }, POS.tavern, -8, 1.0); mark(POS.tavern, 9);
  // theatre: stone chapel hall
  await put('stone-chapel-03e774', { colorway: 'slate-roof' }, POS.chapel, 12, 1.45); mark(POS.chapel, 6);
  // ADVANCE: houses cluster
  await put('two-story-house-40f6dc', { colorway: 'lime-oak' }, near(POS.houses, -3.5, 0), 8, 1.05);
  await put('thatched-cottage-0e63f5', {}, near(POS.houses, 5.5, 1.2), -12, 1.0);
  await put('blacksmith-forge-09fa85', {}, near(POS.houses, 1.5, -6.2), 0, 0.95);
  mark(POS.houses, 10);
  // BASIC: mushroom houses + playground
  const cw = ['terracotta', 'blueberry', 'amanita', 'autumn-gold', 'blueberry'];
  const mushAt = [[0.085, 0.76], [0.15, 0.735], [0.215, 0.79], [0.285, 0.75], [0.33, 0.8]];
  for (let i = 0; i < mushAt.length; i++) { const p = onGround(...mushAt[i]); await put('mushroom-cottage-1135d1', { colorway: cw[i], scale: 4.2 }, p, rnd() * 40 - 20); mark(p, 4); }
  await put('backyard-swing-set-38637e', {}, onGround(0.14, 0.9), 10, 1.4);
  await put('playground-slide-8b764c', {}, onGround(0.25, 0.905), -70, 1.4);
  // closet: tents + market
  const tw = [['canvas-wall-tent-de8a04', 'cream', 0.10, 0.44], ['canvas-wall-tent-de8a04', 'faded-orange', 0.17, 0.425], ['canvas-ridge-tent-f0df0d', 'khaki', 0.215, 0.475], ['dome-tent-9ee59d', null, 0.075, 0.5], ['canvas-wall-tent-de8a04', 'forest-olive', 0.135, 0.505]];
  for (const [n, c, x, y] of tw) { const p = onGround(x, y); await put(n, c ? { colorway: c } : {}, p, rnd() * 30 - 15, 1.25); mark(p, 3); }
  for (const [x, y] of [[0.195, 0.53], [0.23, 0.52], [0.06, 0.45]]) { const p = onGround(x, y); await put('market-stall-94937d', {}, p, -20, 1.4); mark(p, 2); }
  // west gate signpost, east windmill + water mill
  await put('signpost-8287c3', {}, POS.west, 20, 1.5); mark(POS.west, 2);
  await put('windmill-3aad49', { colorway: 'red-cap' }, POS.windmill, -25, 1.45); mark(POS.windmill, 5);
  { const p = onGround(0.775, 0.36); await put('water-mill-b31972', {}, p, -30, 1.1); mark(p, 4); }
  // dock on the lake
  { const d0 = POS.dock; const dir = new THREE.Vector3(lakeC.x - d0.x, 0, lakeC.z - d0.z).normalize();
    const ang = Math.atan2(dir.x, dir.z) * 180 / Math.PI;
    for (let i = 0; i < 4; i++) { const p = new THREE.Vector3(d0.x + dir.x * 2.3 * i, -0.4, d0.z + dir.z * 2.3 * i); await put('lake-dock-run-f5380e', {}, p, ang, 1.1); }
    const b = new THREE.Vector3(d0.x + dir.x * 6 + 3, -0.9, d0.z + dir.z * 6); await put('rowboat-c42d85', {}, b, ang + 70, 1.5); mark(d0, 3); }
  // bridge where the chapel-windmill road crosses the river
  { const a = POS.chapel, b = POS.windmill; let best = null;
    for (let t = 0; t <= 1; t += 0.01) { const x = a.x + (b.x - a.x) * t, z = a.z + (b.z - a.z) * t, d = riverD(x, z); if (!best || d < best.d) best = { x, z, d }; }
    const ang = Math.atan2(b.x - a.x, b.z - a.z) * 180 / Math.PI;
    await put('wooden-bridge-9d2308', {}, new THREE.Vector3(best.x, -0.35, best.z), ang + 90, 3.0); mark(best, 3); }
  // small farm by the windmill + orchard under the hill
  { const p = onGround(0.80, 0.62); await put('timber-barn-90b3ce', {}, p, -35, 1.1); mark(p, 5); }
  for (const [x, y] of [[0.755, 0.665], [0.845, 0.69]]) { const p = onGround(x, y); await put('haystack-77b0dd', {}, p, rnd() * 90, 1.3); mark(p, 1.5); }
  for (let i = 0; i < 5; i++) { const p = onGround(0.74 + i * 0.03, 0.735 - i * 0.004); await put('wooden-fence-3d8ee7', {}, p, -8, 1.2); }
  for (const [x, y] of [[0.41, 0.4], [0.455, 0.385], [0.5, 0.4], [0.545, 0.385], [0.43, 0.43], [0.52, 0.43]]) { const p = onGround(x, y); await put('orchard-apple-tree-b21f85', {}, p, rnd() * 360, 1.1); mark(p, 2); }
  // plaza: well, lamps, barrels
  { const p = onGround(0.52, 0.645); await put('village-well-f8e361', {}, p, 0, 1.2); mark(p, 2); }
  for (const [x, y] of [[0.44, 0.62], [0.6, 0.6], [0.36, 0.5], [0.68, 0.62]]) { const p = onGround(x, y); await put('lamp-post-c9e409', {}, p, 0, 1.3); mark(p, 1); }
  for (const [n, x, y] of [['barrel-aadc94', 0.43, 0.575], ['wooden-crate-b9c96a', 0.445, 0.585], ['haystack-77b0dd', 0.64, 0.78], ['barrel-aadc94', 0.18, 0.55], ['wooden-crate-b9c96a', 0.25, 0.46]]) { const p = onGround(x, y); await put(n, {}, p, rnd() * 90, 1.3); mark(p, 1.5); }
  for (const [x, y] of [[0.06, 0.82], [0.31, 0.86], [0.47, 0.8], [0.66, 0.705]]) { const p = onGround(x, y); await put('flower-planter-500ed2', {}, p, rnd() * 90, 1.8); }

  // ---------- vegetation ----------
  const free = (x, z, pad = 0) => {
    for (const f of placed) if (Math.hypot(x - f.x, z - f.z) < f.r + pad) return false;
    if (pathD(x, z) < 2.4 + pad * 0.3) return false;
    if (riverD(x, z) < 4.2 || lakeE(x, z) < 1.5) return false;
    return true;
  };
  const inView = (p, m = 0.04) => { const v = p.clone().project(camera); return v.x > -1 - m && v.x < 1 + m && v.y > -1 - m * 2 && v.y < 1; };
  // TOWN_SPOTS hit zones (left, top, width, height in %) — keep trees from covering the places
  const ZONES = [[4.5, 65, 31, 15], [42, 37, 14, 21], [29.5, 4, 7, 16], [46, 60, 19, 16], [56.5, 31.5, 13.5, 19], [5, 35, 21, 15], [76, 36, 18, 18], [70, 78, 18, 12]];
  const inZone = (sx, sy) => ZONES.some(([l, t, w, h]) => sx * 100 > l - 3 && sx * 100 < l + w + 3 && sy * 100 > t - 2 && sy * 100 < t + h + 12);
  const trees = [];
  for (let z = -140; z < 66; z += 3.3) for (let x = -120; x < 120; x += 3.3) {
    const jx = x + (hash2(x, z) - 0.5) * 3, jz = z + (hash2(z, x) - 0.5) * 3;
    const y = height(jx, jz); const p = new THREE.Vector3(jx, y, jz);
    if (!inView(p)) continue;
    if (jz < hillC.z - 75) continue;
    const s = new THREE.Vector3().copy(p).project(camera);
    const sx = (s.x + 1) / 2, sy = (1 - s.y) / 2;
    // density: forests in the back band and at the left/right edges, sparse in the village
    let dens = 0.05;
    if (sy < 0.27) dens = 0.55;
    if (sx < 0.06 || sx > 0.94) dens = Math.max(dens, 0.5);
    if (sy > 0.95 && (sx < 0.1 || sx > 0.6)) dens = Math.max(dens, 0.3);
    if (Math.hypot(jx - hillC.x, jz - hillC.z) < 13 && Math.hypot(jx - hillC.x, jz - hillC.z) > 5) dens = Math.max(dens, 0.28);
    if (inZone(sx, sy)) continue;
    if (sy > 0.82 && sx > 0.08 && sx < 0.93) continue;
    if (sy > 1.0) continue;
    if (hash2(jx * 1.7, jz * 2.3) > dens) continue;
    if (!free(jx, jz, 1)) continue;
    trees.push(p);
  }
  let i = 0;
  for (const p of trees) {
    const r = hash2(p.x * 3.1, p.z * 1.3);
    if (p.z < hillC.z - 6 || r < 0.55) await put('campground-pine-stand-0bf4f2', { count: 1 + Math.floor(r * 3), colorway: r < 0.3 ? 'sunlit-ridge' : 'campground' }, p, r * 360, 1.15 + r * 0.4);
    else await put(r < 0.8 ? 'oak-tree-50ee7c' : 'orchard-apple-tree-b21f85', r < 0.8 ? { scale: 1.4 + r, colorway: r > 0.76 ? 'autumn-oak' : 'summer-oak' } : {}, p, r * 360, 1);
    i++;
  }
  // bushes, rocks, tufts in the open
  for (let k = 0; k < 900; k++) {
    const sx = rnd(), sy = 0.28 + rnd() * 0.72; const p = onGround(sx, sy);
    if (!free(p.x, p.z, 0.2)) continue;
    const r = rnd();
    if (r < 0.12) await put('bush-8bb596', {}, p, r * 999, 1.4 + rnd());
    else if (r < 0.14) await put('small-rock-d43710', {}, p, r * 999, 1.5 + rnd() * 1.5);
    else if (r < 0.55) await put('grass-tuft-5ccff0', {}, p, r * 999, 1.4);
  }
  return trees.length;
}

const n = await build();
renderer.render(scene, camera);
// report where each place landed on screen (fraction)
const rep = {};
for (const k in POS) { const v = POS[k].clone().project(camera); rep[k] = [+((v.x + 1) / 2).toFixed(3), +((1 - v.y) / 2).toFixed(3)]; }
window.REPORT = { trees: n, rep };
window.DONE = true;
