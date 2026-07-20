import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.js';

const STORAGE_KEY = 'gfield-world-explorer-v1';
const VILLAGE_KEY = 'gfield-world-village-v1';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const hub = $('#villageHub');
const quizApp = $('#quizApp');
const viewport = $('#villageViewport');
const loading = $('#villageLoading');
const zonePrompt = $('#zonePrompt');
const zoneIcon = $('#zoneIcon');
const zoneName = $('#zoneName');
const zoneDescription = $('#zoneDescription');
const enterZoneButton = $('#enterZoneButton');
const guide = $('#villageGuide');
const joystick = $('#joystick');
const joystickKnob = $('#joystickKnob');
const infoDialog = $('#villageInfoDialog');
const infoContent = $('#villageInfoContent');

const translations = {
  ko: {
    worldVillage: '세계 탐험 마을', points: '포인트', explored: '탐험', explorerTitle: 'WORLD EXPLORER ARI',
    guide: '사람 탐험가 아리를 움직여 빛나는 게임 존으로 가 보세요.', flagZone: '국기 광장', clueZone: '세계 도서관', mapZone: '지도 전망대',
    moveHelp: '화면을 터치하거나 조이스틱으로 이동', nearZone: '게임 존 도착', enter: '입장하기', loading: '세계 탐험 마을을 만드는 중...', returnVillage: '마을',
    flagDescription: '국기를 자세히 보고 나라를 맞혀요.', clueDescription: '지리·문화·역사 단서를 읽고 나라를 찾아요.', mapDescription: '세계지도에서 빛나는 나라의 위치를 맞혀요.',
    shopName: '여행자 상점', shopDescription: '모은 포인트로 탐험 장비를 준비하는 곳이에요.', buildName: '세계 건설소', buildDescription: '탐험 보상으로 마을을 성장시키는 곳이에요.',
    shopTitle: '여행자 상점 준비 중', shopBody: '국가 퀴즈에서 포인트를 모으면 아리의 모자, 배낭 장식, 여행 배지를 살 수 있도록 연결할 예정이에요.',
    buildTitle: '세계 건설소', buildBody: '나라를 탐험할수록 각 지역의 건축물이 마을에 추가됩니다. 지금은 수집 진행을 확인하는 프리뷰 존이에요.'
  },
  zh: {
    worldVillage: '世界探索村', points: '积分', explored: '探索', explorerTitle: 'WORLD EXPLORER ARI',
    guide: '移动人类探险家 Ari，前往发光的游戏区域。', flagZone: '国旗广场', clueZone: '世界图书馆', mapZone: '地图观景台',
    moveHelp: '点击地面或使用摇杆移动', nearZone: '到达游戏区', enter: '进入', loading: '正在建造世界探索村...', returnVillage: '村庄',
    flagDescription: '观察国旗并猜出国家。', clueDescription: '阅读地理、文化和历史线索。', mapDescription: '在世界地图上找出发光的国家。',
    shopName: '旅行商店', shopDescription: '用积分准备探险装备。', buildName: '世界建造所', buildDescription: '用探险奖励发展村庄。',
    shopTitle: '旅行商店预览', shopBody: '完成国家问答后，可以用积分购买帽子、背包装饰和旅行徽章。', buildTitle: '世界建造所', buildBody: '探索更多国家后，各地区的建筑会加入村庄。'
  },
  ja: {
    worldVillage: '世界探検の村', points: 'ポイント', explored: '探検', explorerTitle: 'WORLD EXPLORER ARI',
    guide: '人間の探検家アリを動かして、光るゲームゾーンへ行こう。', flagZone: '国旗広場', clueZone: '世界図書館', mapZone: '地図展望台',
    moveHelp: '地面をタップ、またはスティックで移動', nearZone: 'ゲームゾーン到着', enter: '入る', loading: '世界探検の村を作っています...', returnVillage: '村',
    flagDescription: '国旗をよく見て国を当てよう。', clueDescription: '地理・文化・歴史の手がかりを読もう。', mapDescription: '世界地図で光る国の位置を当てよう。',
    shopName: 'トラベルショップ', shopDescription: 'ポイントで探検装備を準備する場所。', buildName: '世界建設所', buildDescription: '探検報酬で村を成長させる場所。',
    shopTitle: 'トラベルショップ準備中', shopBody: '国クイズでポイントを集めると、帽子やリュックの飾り、旅バッジを買えるようになります。', buildTitle: '世界建設所', buildBody: '国を探検するほど、各地域の建物が村に追加されます。'
  },
  en: {
    worldVillage: 'World Explorer Village', points: 'Points', explored: 'Explored', explorerTitle: 'WORLD EXPLORER ARI',
    guide: 'Move Ari, the human explorer, to a glowing game zone.', flagZone: 'Flag Plaza', clueZone: 'World Library', mapZone: 'Map Observatory',
    moveHelp: 'Tap the ground or use the joystick to move', nearZone: 'Game zone reached', enter: 'Enter', loading: 'Building World Explorer Village...', returnVillage: 'Village',
    flagDescription: 'Study a flag and identify its country.', clueDescription: 'Read geography, culture, and history clues.', mapDescription: 'Find the glowing country on the world map.',
    shopName: 'Traveler Shop', shopDescription: 'Prepare explorer gear with earned points.', buildName: 'World Workshop', buildDescription: 'Grow the village with exploration rewards.',
    shopTitle: 'Traveler Shop Preview', shopBody: 'Country quizzes will unlock hats, backpack decorations, and travel badges for Ari.', buildTitle: 'World Workshop', buildBody: 'As more countries are explored, regional buildings will be added to the village.'
  }
};

const zoneDefinitions = [
  { id: 'flag', mode: 'flag', icon: '🏳️', x: -12, z: -7, radius: 3.35, labelKey: 'flagZone', descriptionKey: 'flagDescription', accent: 0xe86a55 },
  { id: 'clue', mode: 'clue', icon: '📚', x: 12, z: -7, radius: 3.45, labelKey: 'clueZone', descriptionKey: 'clueDescription', accent: 0x5b8d69 },
  { id: 'location', mode: 'location', icon: '🗺️', x: 11, z: 10, radius: 3.55, labelKey: 'mapZone', descriptionKey: 'mapDescription', accent: 0x4d87a3 },
  { id: 'shop', icon: '🎒', x: -11, z: 10, radius: 3.1, labelKey: 'shopName', descriptionKey: 'shopDescription', accent: 0xd3943e },
  { id: 'build', icon: '🏗️', x: 0, z: 15, radius: 3.05, labelKey: 'buildName', descriptionKey: 'buildDescription', accent: 0x8e6da6 }
];

let currentLang = readGameState().lang || 'ko';
let activeZone = null;
let scene;
let camera;
let renderer;
let clock;
let player;
let playerModel;
let leftArm;
let rightArm;
let leftLeg;
let rightLeg;
let scarfTail;
let companion;
let cameraTarget;
let worldReady = false;
let paused = false;
let cameraZoom = 1;
let walkPhase = 0;
let targetPoint = null;
let pointerStart = null;
let joystickPointer = null;
const joystickInput = new THREE.Vector2();
const keyInput = new THREE.Vector2();
const velocity = new THREE.Vector3();
const movement = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const colliders = [];
const zones = [];
const cameraLook = new THREE.Vector3();
const tempVector = new THREE.Vector3();
const tempVector2 = new THREE.Vector3();
const keys = new Set();

function readGameState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}

function readVillageState() {
  try { return JSON.parse(localStorage.getItem(VILLAGE_KEY) || '{}'); }
  catch { return {}; }
}

function saveVillageState() {
  if (!player) return;
  localStorage.setItem(VILLAGE_KEY, JSON.stringify({ x: player.position.x, z: player.position.z, cameraZoom }));
}

function text(key) {
  return translations[currentLang]?.[key] ?? translations.ko[key] ?? key;
}

function syncVillageUi() {
  const gameState = readGameState();
  currentLang = gameState.lang || currentLang || 'ko';
  $$('[data-village-i18n]').forEach(element => {
    element.textContent = text(element.dataset.villageI18n);
  });
  $$('.language-switch button').forEach(button => button.classList.toggle('active', button.dataset.lang === currentLang));
  $('#villagePoints').textContent = gameState.points || 0;
  $('#villageSolved').textContent = Array.isArray(gameState.solved) ? gameState.solved.length : 0;
  updateZonePrompt();
  zones.forEach(zone => updateZoneLabel(zone));
}

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: .78, metalness: .02, flatShading: true, ...options });
}

function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function seededRandom(seed = 9137) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createTextSprite(label, accent = '#234f5f') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(4.8, 1.5, 1);
  sprite.userData = { canvas, context, texture, accent, label };
  drawTextSprite(sprite, label);
  return sprite;
}

function drawTextSprite(sprite, label) {
  const { canvas, context, texture, accent } = sprite.userData;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'rgba(255,249,229,.96)';
  context.strokeStyle = accent;
  context.lineWidth = 10;
  context.beginPath();
  context.roundRect(12, 12, 488, 136, 36);
  context.fill();
  context.stroke();
  context.fillStyle = '#2e2a25';
  context.font = '900 46px system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(label, 256, 82, 440);
  texture.needsUpdate = true;
  sprite.userData.label = label;
}

function createRoad(startX, startZ, endX, endZ, width = 2.45) {
  const dx = endX - startX;
  const dz = endZ - startZ;
  const length = Math.hypot(dx, dz);
  const angle = -Math.atan2(dz, dx);
  addMesh(scene, new THREE.BoxGeometry(length, .08, width + .32), makeMaterial(0xb98957), [(startX + endX) / 2, .04, (startZ + endZ) / 2], [0, angle, 0]);
  const path = addMesh(scene, new THREE.BoxGeometry(length, .1, width), makeMaterial(0xe8c88d), [(startX + endX) / 2, .09, (startZ + endZ) / 2], [0, angle, 0]);
  path.receiveShadow = true;
}

function createTree(x, z, scale = 1, tint = 0x4c9a63) {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);
  addMesh(tree, new THREE.CylinderGeometry(.2, .28, 1.65, 7), makeMaterial(0x86502f), [0, .82, 0]);
  const leafMaterial = makeMaterial(tint);
  addMesh(tree, new THREE.IcosahedronGeometry(.92, 1), leafMaterial, [0, 1.85, 0], [0, .3, 0], [1, 1.05, 1]);
  addMesh(tree, new THREE.IcosahedronGeometry(.68, 1), leafMaterial, [-.5, 1.6, .08], [0, 0, .1]);
  addMesh(tree, new THREE.IcosahedronGeometry(.7, 1), leafMaterial, [.5, 1.58, -.04], [0, .2, 0]);
  scene.add(tree);
  colliders.push({ x, z, radius: .75 * scale });
  return tree;
}

function createLamp(x, z) {
  const lamp = new THREE.Group();
  lamp.position.set(x, 0, z);
  addMesh(lamp, new THREE.CylinderGeometry(.08, .11, 1.6, 8), makeMaterial(0x35525a, { metalness: .28 }), [0, .8, 0]);
  addMesh(lamp, new THREE.BoxGeometry(.42, .38, .42), makeMaterial(0xffe7a1, { emissive: 0xe9aa49, emissiveIntensity: .45 }), [0, 1.62, 0]);
  addMesh(lamp, new THREE.ConeGeometry(.34, .25, 4), makeMaterial(0x2f4b53, { metalness: .22 }), [0, 1.94, 0], [0, Math.PI / 4, 0]);
  scene.add(lamp);
}

function createBench(x, z, rotation = 0) {
  const bench = new THREE.Group();
  bench.position.set(x, 0, z);
  bench.rotation.y = rotation;
  const wood = makeMaterial(0xa86637);
  const dark = makeMaterial(0x3d5558, { metalness: .18 });
  addMesh(bench, new THREE.BoxGeometry(1.55, .16, .46), wood, [0, .48, 0]);
  addMesh(bench, new THREE.BoxGeometry(1.55, .72, .14), wood, [0, .82, -.25], [-.12, 0, 0]);
  addMesh(bench, new THREE.BoxGeometry(.12, .55, .12), dark, [-.55, .25, 0]);
  addMesh(bench, new THREE.BoxGeometry(.12, .55, .12), dark, [.55, .25, 0]);
  scene.add(bench);
  colliders.push({ x, z, radius: .9 });
}

function createFlowerPatch(x, z, color = 0xf196aa) {
  const patch = new THREE.Group();
  patch.position.set(x, 0, z);
  const rand = seededRandom(Math.round((x + 30) * 97 + (z + 30) * 53));
  for (let index = 0; index < 9; index += 1) {
    const angle = rand() * Math.PI * 2;
    const radius = rand() * .72;
    const fx = Math.cos(angle) * radius;
    const fz = Math.sin(angle) * radius;
    addMesh(patch, new THREE.CylinderGeometry(.025, .035, .28, 5), makeMaterial(0x3d8553), [fx, .14, fz]);
    addMesh(patch, new THREE.IcosahedronGeometry(.09, 0), makeMaterial(index % 3 ? color : 0xffd65a), [fx, .32, fz]);
  }
  scene.add(patch);
}

function createFenceSegment(x, z, rotation = 0, length = 3) {
  const fence = new THREE.Group();
  fence.position.set(x, 0, z);
  fence.rotation.y = rotation;
  const material = makeMaterial(0xf0dfb5);
  const posts = Math.max(2, Math.round(length));
  for (let index = 0; index <= posts; index += 1) {
    const px = -length / 2 + (index / posts) * length;
    addMesh(fence, new THREE.BoxGeometry(.13, .72, .13), material, [px, .36, 0]);
  }
  addMesh(fence, new THREE.BoxGeometry(length, .11, .11), material, [0, .27, 0]);
  addMesh(fence, new THREE.BoxGeometry(length, .11, .11), material, [0, .57, 0]);
  scene.add(fence);
}

function createRoof(width, depth, height, color) {
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(width, depth) * .72, height, 4), makeMaterial(color));
  roof.rotation.y = Math.PI / 4;
  roof.scale.z = depth / width;
  roof.castShadow = true;
  roof.receiveShadow = true;
  return roof;
}

function createBuildingBase(zone, width, depth, height, wallColor, roofColor) {
  const group = new THREE.Group();
  group.position.set(zone.x, 0, zone.z);
  addMesh(group, new THREE.CylinderGeometry(Math.max(width, depth) * .64, Math.max(width, depth) * .72, .35, 10), makeMaterial(0xc69861), [0, .18, 0]);
  addMesh(group, new THREE.BoxGeometry(width, height, depth), makeMaterial(wallColor), [0, height / 2 + .35, 0]);
  const roof = createRoof(width + .55, depth + .55, 1.5, roofColor);
  roof.position.y = height + 1.08;
  group.add(roof);
  const door = addMesh(group, new THREE.BoxGeometry(.86, 1.35, .13), makeMaterial(0x75462b), [0, 1.02, depth / 2 + .07]);
  door.castShadow = false;
  for (const side of [-1, 1]) {
    addMesh(group, new THREE.BoxGeometry(.58, .65, .12), makeMaterial(0x9bd9e7, { emissive: 0x356f82, emissiveIntensity: .08 }), [side * width * .3, 1.55, depth / 2 + .075]);
  }
  scene.add(group);
  colliders.push({ x: zone.x, z: zone.z, radius: Math.max(width, depth) * .58 });
  return group;
}

function createFlagPlaza(zone) {
  const group = new THREE.Group();
  group.position.set(zone.x, 0, zone.z);
  addMesh(group, new THREE.CylinderGeometry(3.3, 3.5, .28, 20), makeMaterial(0xe8c78f), [0, .14, 0]);
  for (const side of [-1, 1]) {
    addMesh(group, new THREE.CylinderGeometry(.2, .26, 2.8, 8), makeMaterial(0xfff0c9), [side * 1.55, 1.5, -.5]);
    addMesh(group, new THREE.BoxGeometry(.38, .22, 1.1), makeMaterial(0xe4b95f), [side * 1.55, 2.92, -.5]);
  }
  addMesh(group, new THREE.BoxGeometry(3.55, .38, .48), makeMaterial(0x386b78), [0, 2.86, -.5]);
  addMesh(group, new THREE.SphereGeometry(.72, 16, 12), makeMaterial(0x63b6c6, { emissive: 0x194e5b, emissiveIntensity: .12 }), [0, 2.15, -.5]);
  addMesh(group, new THREE.TorusGeometry(.75, .035, 6, 24), makeMaterial(0xf8e3a1), [0, 2.15, -.5], [Math.PI / 2, 0, .25]);
  const flagMaterial = makeMaterial(0xe76155);
  for (const side of [-1, 1]) {
    addMesh(group, new THREE.CylinderGeometry(.035, .04, 2.35, 6), makeMaterial(0x5c6d6d, { metalness: .25 }), [side * 2.25, 1.3, .1]);
    addMesh(group, new THREE.PlaneGeometry(.85, .55), flagMaterial, [side * 2.62, 2.08, .1], [0, side < 0 ? Math.PI : 0, 0]);
  }
  scene.add(group);
  colliders.push({ x: zone.x, z: zone.z - .5, radius: 2.1 });
  return group;
}

function createLibrary(zone) {
  const building = createBuildingBase(zone, 4.4, 3.55, 2.65, 0xe9d6ad, 0x47795e);
  const bookColors = [0xd76050, 0x4d7894, 0xd4a442, 0x6d8e60];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      addMesh(building, new THREE.BoxGeometry(.18, .48, .12), makeMaterial(bookColors[(row * 5 + col) % bookColors.length]), [-.62 + col * .3, 1.45 + row * .55, 1.84]);
    }
  }
  addMesh(building, new THREE.BoxGeometry(2.1, .13, .15), makeMaterial(0x6d452c), [0, 1.14, 1.84]);
  addMesh(building, new THREE.BoxGeometry(2.1, .13, .15), makeMaterial(0x6d452c), [0, 2.24, 1.84]);
  return building;
}

function createObservatory(zone) {
  const group = new THREE.Group();
  group.position.set(zone.x, 0, zone.z);
  addMesh(group, new THREE.CylinderGeometry(2.85, 3.1, .42, 16), makeMaterial(0xd1a365), [0, .21, 0]);
  addMesh(group, new THREE.CylinderGeometry(2.25, 2.5, 2.35, 14), makeMaterial(0xf3e4bd), [0, 1.58, 0]);
  addMesh(group, new THREE.SphereGeometry(2.32, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), makeMaterial(0x4d879e, { metalness: .18 }), [0, 2.78, 0]);
  addMesh(group, new THREE.BoxGeometry(.95, 1.45, .14), makeMaterial(0x70462c), [0, 1.16, 2.28]);
  const telescope = new THREE.Group();
  telescope.position.set(.35, 3.48, .1);
  telescope.rotation.z = -.52;
  addMesh(telescope, new THREE.CylinderGeometry(.24, .34, 2.2, 10), makeMaterial(0x315b68, { metalness: .28 }), [0, 0, 0], [0, 0, Math.PI / 2]);
  addMesh(telescope, new THREE.CylinderGeometry(.42, .28, .55, 10), makeMaterial(0xe5b955), [1.15, 0, 0], [0, 0, Math.PI / 2]);
  group.add(telescope);
  scene.add(group);
  colliders.push({ x: zone.x, z: zone.z, radius: 2.75 });
  return group;
}

function createShop(zone) {
  const building = createBuildingBase(zone, 4, 3.25, 2.25, 0xf0c77d, 0x9b5541);
  const awning = new THREE.Group();
  for (let index = 0; index < 7; index += 1) {
    addMesh(awning, new THREE.BoxGeometry(.58, .16, 1.05), makeMaterial(index % 2 ? 0xfff3cf : 0xd95f50), [-1.75 + index * .58, 0, 0]);
  }
  awning.position.set(0, 2.08, 2.03);
  awning.rotation.x = -.16;
  building.add(awning);
  addMesh(building, new THREE.BoxGeometry(1.5, .85, .14), makeMaterial(0x8fd1dc), [0, 1.32, 1.69]);
  return building;
}

function createWorkshop(zone) {
  const group = new THREE.Group();
  group.position.set(zone.x, 0, zone.z);
  addMesh(group, new THREE.CylinderGeometry(3.05, 3.3, .3, 12), makeMaterial(0xc39762), [0, .15, 0]);
  addMesh(group, new THREE.BoxGeometry(3.7, 1.65, 2.8), makeMaterial(0xd8c4a1), [0, 1.12, 0]);
  addMesh(group, new THREE.BoxGeometry(4.2, .25, 3.25), makeMaterial(0x6e5a75), [0, 2.12, 0]);
  for (const x of [-1.65, 1.65]) {
    addMesh(group, new THREE.BoxGeometry(.18, 3.2, .18), makeMaterial(0x6b583e), [x, 1.8, 0]);
  }
  addMesh(group, new THREE.BoxGeometry(3.5, .18, .18), makeMaterial(0x6b583e), [0, 3.25, 0]);
  addMesh(group, new THREE.BoxGeometry(.18, .18, 2.4), makeMaterial(0x6b583e), [0, 3.25, 1.1]);
  addMesh(group, new THREE.CylinderGeometry(.08, .08, 1.5, 6), makeMaterial(0x4d4e4e), [0, 2.42, 2.25]);
  addMesh(group, new THREE.BoxGeometry(.72, .55, .72), makeMaterial(0xc9823f), [0, 1.62, 2.25]);
  scene.add(group);
  colliders.push({ x: zone.x, z: zone.z, radius: 2.55 });
  return group;
}

function createZoneRing(zone) {
  const ringMaterial = new THREE.MeshStandardMaterial({ color: zone.accent, emissive: zone.accent, emissiveIntensity: .8, roughness: .45, transparent: true, opacity: .82 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(zone.radius + .35, .11, 8, 48), ringMaterial);
  ring.position.set(zone.x, .18, zone.z);
  ring.rotation.x = Math.PI / 2;
  ring.receiveShadow = false;
  scene.add(ring);
  const beaconMaterial = new THREE.MeshBasicMaterial({ color: zone.accent, transparent: true, opacity: .08, depthWrite: false, side: THREE.DoubleSide });
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(zone.radius * .7, zone.radius * .95, 4.8, 20, 1, true), beaconMaterial);
  beacon.position.set(zone.x, 2.4, zone.z);
  scene.add(beacon);
  const label = createTextSprite(text(zone.labelKey), `#${zone.accent.toString(16).padStart(6, '0')}`);
  label.position.set(zone.x, 4.65, zone.z);
  scene.add(label);
  const zoneObject = { ...zone, ring, beacon, label };
  zones.push(zoneObject);
  return zoneObject;
}

function updateZoneLabel(zone) {
  if (zone?.label) drawTextSprite(zone.label, text(zone.labelKey));
}

function createFountain() {
  const fountain = new THREE.Group();
  addMesh(fountain, new THREE.CylinderGeometry(2.3, 2.55, .35, 20), makeMaterial(0xd0aa72), [0, .18, 0]);
  addMesh(fountain, new THREE.CylinderGeometry(1.85, 2.08, .42, 20), makeMaterial(0x6fb9c7, { emissive: 0x285766, emissiveIntensity: .08 }), [0, .42, 0]);
  addMesh(fountain, new THREE.CylinderGeometry(.3, .48, 1.65, 10), makeMaterial(0xe4c38e), [0, 1.12, 0]);
  addMesh(fountain, new THREE.CylinderGeometry(.9, .65, .22, 14), makeMaterial(0xe4c38e), [0, 1.86, 0]);
  const water = addMesh(fountain, new THREE.ConeGeometry(.55, 1.1, 14, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x9fe5ee, transparent: true, opacity: .56, roughness: .18, transmission: .25, side: THREE.DoubleSide }), [0, 2.35, 0]);
  water.rotation.x = Math.PI;
  scene.add(fountain);
  colliders.push({ x: 0, z: 0, radius: 2.45 });
}

function createExplorer() {
  const root = new THREE.Group();
  const model = new THREE.Group();
  root.add(model);
  const skin = makeMaterial(0xd89b70);
  const skinLight = makeMaterial(0xe8b58d);
  const hair = makeMaterial(0x3f2c24);
  const jacket = makeMaterial(0x3d8164);
  const jacketDark = makeMaterial(0x285c48);
  const shirt = makeMaterial(0xf3e7c9);
  const trousers = makeMaterial(0x314f66);
  const shoes = makeMaterial(0x49382e);
  const leather = makeMaterial(0x9a5d32);
  const gold = makeMaterial(0xf0c457, { metalness: .12 });

  const hips = new THREE.Group();
  hips.position.y = 1.12;
  model.add(hips);
  addMesh(hips, new THREE.BoxGeometry(.68, .42, .45), trousers, [0, 0, 0]);

  leftLeg = new THREE.Group();
  rightLeg = new THREE.Group();
  leftLeg.position.set(-.22, -.16, 0);
  rightLeg.position.set(.22, -.16, 0);
  hips.add(leftLeg, rightLeg);
  for (const leg of [leftLeg, rightLeg]) {
    addMesh(leg, new THREE.CylinderGeometry(.13, .15, .72, 8), trousers, [0, -.36, 0]);
    addMesh(leg, new THREE.BoxGeometry(.34, .2, .56), shoes, [0, -.76, .12]);
  }

  const torso = new THREE.Group();
  torso.position.y = 1.72;
  model.add(torso);
  addMesh(torso, new THREE.BoxGeometry(1.02, 1.05, .62), jacket, [0, 0, 0], [0, 0, 0], [1, 1, .95]);
  addMesh(torso, new THREE.BoxGeometry(.38, .78, .08), shirt, [0, .02, .335]);
  addMesh(torso, new THREE.BoxGeometry(.09, .78, .06), jacketDark, [-.22, .02, .385]);
  addMesh(torso, new THREE.BoxGeometry(.09, .78, .06), jacketDark, [.22, .02, .385]);
  addMesh(torso, new THREE.CircleGeometry(.13, 16), gold, [0, .18, .395]);
  addMesh(torso, new THREE.TorusGeometry(.08, .018, 5, 16), makeMaterial(0x2f6779), [0, .18, .412]);

  leftArm = new THREE.Group();
  rightArm = new THREE.Group();
  leftArm.position.set(-.64, .32, 0);
  rightArm.position.set(.64, .32, 0);
  torso.add(leftArm, rightArm);
  for (const [arm, side] of [[leftArm, -1], [rightArm, 1]]) {
    addMesh(arm, new THREE.CylinderGeometry(.12, .14, .78, 8), jacket, [0, -.35, 0], [0, 0, side * .05]);
    addMesh(arm, new THREE.SphereGeometry(.145, 10, 8), skinLight, [0, -.78, .02]);
  }

  const backpack = new THREE.Group();
  backpack.position.set(0, -.02, -.45);
  torso.add(backpack);
  addMesh(backpack, new THREE.BoxGeometry(.83, .87, .36), leather, [0, 0, 0]);
  addMesh(backpack, new THREE.BoxGeometry(.72, .18, .39), makeMaterial(0xbc7b42), [0, .41, 0]);
  addMesh(backpack, new THREE.CylinderGeometry(.15, .15, .86, 10), makeMaterial(0xe3cf9e), [.46, .02, 0], [Math.PI / 2, 0, 0]);
  addMesh(backpack, new THREE.TorusGeometry(.25, .035, 6, 16, Math.PI), leather, [0, .58, 0], [0, 0, 0]);

  addMesh(model, new THREE.CylinderGeometry(.12, .15, .18, 8), skin, [0, 2.34, 0]);
  const head = new THREE.Group();
  head.position.set(0, 2.72, 0);
  model.add(head);
  addMesh(head, new THREE.SphereGeometry(.43, 16, 12), skinLight, [0, 0, 0], [0, 0, 0], [1, 1.08, .98]);
  addMesh(head, new THREE.SphereGeometry(.442, 16, 8, 0, Math.PI * 2, 0, Math.PI * .56), hair, [0, .05, -.01]);
  addMesh(head, new THREE.BoxGeometry(.28, .22, .12), hair, [-.34, .02, -.2], [0, 0, -.2]);
  addMesh(head, new THREE.BoxGeometry(.28, .22, .12), hair, [.34, .02, -.2], [0, 0, .2]);
  addMesh(head, new THREE.SphereGeometry(.045, 8, 6), makeMaterial(0x2e2927), [-.15, .02, .4]);
  addMesh(head, new THREE.SphereGeometry(.045, 8, 6), makeMaterial(0x2e2927), [.15, .02, .4]);
  addMesh(head, new THREE.SphereGeometry(.05, 8, 6), skin, [0, -.07, .43], [0, 0, 0], [.75, .8, .7]);
  addMesh(head, new THREE.TorusGeometry(.09, .018, 5, 14, Math.PI), makeMaterial(0xa6574d), [0, -.19, .4], [0, 0, Math.PI]);

  const cap = new THREE.Group();
  cap.position.set(0, .37, 0);
  head.add(cap);
  addMesh(cap, new THREE.CylinderGeometry(.43, .47, .22, 12), jacketDark, [0, 0, 0]);
  addMesh(cap, new THREE.BoxGeometry(.56, .08, .28), jacketDark, [0, -.05, .38]);
  addMesh(cap, new THREE.CircleGeometry(.095, 14), gold, [0, .01, .225], [0, 0, 0]);

  const scarf = new THREE.Group();
  scarf.position.set(0, 2.28, .05);
  model.add(scarf);
  addMesh(scarf, new THREE.TorusGeometry(.29, .09, 7, 18), makeMaterial(0xe06855), [0, 0, 0], [Math.PI / 2, 0, 0]);
  scarfTail = addMesh(scarf, new THREE.BoxGeometry(.17, .65, .08), makeMaterial(0xe06855), [.26, -.3, -.2], [.15, 0, -.18]);

  root.scale.setScalar(.92);
  root.position.set(-2.8, .12, 2.5);
  scene.add(root);
  playerModel = model;
  return root;
}

function createCubiCompanion() {
  const root = new THREE.Group();
  const wood = makeMaterial(0xe2b45c, { emissive: 0x6c3e18, emissiveIntensity: .06 });
  const dark = makeMaterial(0x76502d);
  const cubeGeometry = new THREE.BoxGeometry(.48, .48, .48);
  addMesh(root, cubeGeometry, wood, [-.24, 0, 0]);
  addMesh(root, cubeGeometry, wood, [.24, 0, 0]);
  const face = addMesh(root, cubeGeometry, wood, [0, .47, 0]);
  addMesh(face, new THREE.SphereGeometry(.035, 8, 6), dark, [-.1, .05, .245]);
  addMesh(face, new THREE.SphereGeometry(.035, 8, 6), dark, [.1, .05, .245]);
  root.scale.setScalar(.68);
  scene.add(root);
  return root;
}

function buildWorld() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd6e6);
  scene.fog = new THREE.Fog(0x9fd6e6, 40, 76);

  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label', '3D 세계 탐험 마을');
  viewport.appendChild(renderer.domElement);

  camera = new THREE.OrthographicCamera(-12, 12, 8, -8, .1, 140);
  camera.position.set(18, 19, 20);
  cameraTarget = new THREE.Vector3(0, 1.2, 0);
  camera.lookAt(cameraTarget);

  const hemi = new THREE.HemisphereLight(0xdff4ff, 0x668255, 2.45);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0ce, 3.2);
  sun.position.set(-13, 24, 16);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536);
  sun.shadow.camera.left = -34;
  sun.shadow.camera.right = 34;
  sun.shadow.camera.top = 34;
  sun.shadow.camera.bottom = -34;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 70;
  sun.shadow.bias = -.00045;
  scene.add(sun);
  const warmFill = new THREE.DirectionalLight(0xffc985, .7);
  warmFill.position.set(16, 10, -14);
  scene.add(warmFill);

  addMesh(scene, new THREE.CylinderGeometry(31, 31.8, 1.5, 72), makeMaterial(0x4d9db2, { roughness: .35, metalness: .04 }), [0, -1.22, 0]);
  addMesh(scene, new THREE.CylinderGeometry(27.75, 28.35, .7, 72), makeMaterial(0xe0c58a), [0, -.55, 0]);
  addMesh(scene, new THREE.CylinderGeometry(27, 27.5, .92, 72), makeMaterial(0x72b36c), [0, -.18, 0]);

  createRoad(0, 0, -12, -7);
  createRoad(0, 0, 12, -7);
  createRoad(0, 0, 11, 10);
  createRoad(0, 0, -11, 10);
  createRoad(0, 0, 0, 15);
  addMesh(scene, new THREE.CylinderGeometry(5.2, 5.3, .1, 32), makeMaterial(0xe8c98e), [0, .06, 0]);
  addMesh(scene, new THREE.TorusGeometry(4.9, .12, 8, 48), makeMaterial(0xb97c46), [0, .13, 0], [Math.PI / 2, 0, 0]);
  createFountain();

  createFlagPlaza(zoneDefinitions[0]);
  createLibrary(zoneDefinitions[1]);
  createObservatory(zoneDefinitions[2]);
  createShop(zoneDefinitions[3]);
  createWorkshop(zoneDefinitions[4]);
  zoneDefinitions.forEach(createZoneRing);

  const rand = seededRandom(1207);
  const protectedAreas = zoneDefinitions.map(zone => ({ x: zone.x, z: zone.z, radius: zone.radius + 2.4 })).concat([{ x: 0, z: 0, radius: 6.2 }]);
  let attempts = 0;
  let planted = 0;
  while (planted < 34 && attempts < 300) {
    attempts += 1;
    const angle = rand() * Math.PI * 2;
    const radius = 8 + rand() * 17.2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const blocked = protectedAreas.some(area => Math.hypot(x - area.x, z - area.z) < area.radius);
    if (blocked) continue;
    createTree(x, z, .72 + rand() * .5, rand() > .3 ? 0x4d9863 : 0x6aa45b);
    planted += 1;
  }

  [[-4.6, -4.5], [4.8, -4.4], [5.1, 4.4], [-4.8, 4.5], [-7.4, 1.8], [7.3, 1.5]].forEach(([x, z]) => createLamp(x, z));
  createBench(-4.6, 2.9, -.85);
  createBench(4.5, -2.9, 2.25);
  createBench(2.8, 4.8, -2.6);
  createFlowerPatch(-5.5, -2.1, 0xef87a1);
  createFlowerPatch(5.7, 2.2, 0x9e86d1);
  createFlowerPatch(-3.8, 5.2, 0xf3b75e);
  createFlowerPatch(3.2, -5.4, 0xee7f77);
  createFenceSegment(-18.5, 5, .8, 4.3);
  createFenceSegment(17.5, 4.2, -1.0, 4.1);
  createFenceSegment(-3.5, -20.3, .1, 5.2);

  player = createExplorer();
  companion = createCubiCompanion();
  const saved = readVillageState();
  if (Number.isFinite(saved.x) && Number.isFinite(saved.z)) player.position.set(saved.x, .12, saved.z);
  cameraZoom = Number.isFinite(saved.cameraZoom) ? THREE.MathUtils.clamp(saved.cameraZoom, .78, 1.38) : 1;
  camera.zoom = cameraZoom;
  camera.updateProjectionMatrix();
  companion.position.copy(player.position).add(new THREE.Vector3(-1.2, 1.8, -.8));
  cameraLook.copy(player.position).add(new THREE.Vector3(0, 1.15, 0));
  cameraTarget.copy(cameraLook);
  camera.position.copy(player.position).add(new THREE.Vector3(14.2, 18.5, 14.2));
  camera.lookAt(cameraLook);

  clock = new THREE.Clock();
  resize();
  renderer.setAnimationLoop(animate);
  worldReady = true;
  setTimeout(() => loading.classList.add('hide'), 520);
}

function resize() {
  if (!renderer || !camera) return;
  const width = Math.max(1, viewport.clientWidth);
  const height = Math.max(1, viewport.clientHeight);
  const aspect = width / height;
  const viewHeight = 18.5;
  camera.left = -viewHeight * aspect / 2;
  camera.right = viewHeight * aspect / 2;
  camera.top = viewHeight / 2;
  camera.bottom = -viewHeight / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function screenMovementDirection(inputX, inputY) {
  const forward = tempVector.copy(cameraTarget).sub(camera.position);
  forward.y = 0;
  forward.normalize();
  const right = tempVector2.crossVectors(forward, camera.up).normalize();
  movement.copy(right).multiplyScalar(inputX).addScaledVector(forward, inputY);
  if (movement.lengthSq() > 1) movement.normalize();
  return movement;
}

function resolveCollision(nextPosition) {
  const maxRadius = 25.65;
  const distanceFromCenter = Math.hypot(nextPosition.x, nextPosition.z);
  if (distanceFromCenter > maxRadius) {
    const scale = maxRadius / distanceFromCenter;
    nextPosition.x *= scale;
    nextPosition.z *= scale;
  }
  for (const collider of colliders) {
    const dx = nextPosition.x - collider.x;
    const dz = nextPosition.z - collider.z;
    const distance = Math.hypot(dx, dz);
    const safeRadius = collider.radius + .52;
    if (distance < safeRadius && distance > .0001) {
      nextPosition.x = collider.x + dx / distance * safeRadius;
      nextPosition.z = collider.z + dz / distance * safeRadius;
    }
  }
  return nextPosition;
}

function updateMovement(delta) {
  if (!player) return;
  keyInput.set(0, 0);
  if (keys.has('ArrowLeft') || keys.has('KeyA')) keyInput.x -= 1;
  if (keys.has('ArrowRight') || keys.has('KeyD')) keyInput.x += 1;
  if (keys.has('ArrowUp') || keys.has('KeyW')) keyInput.y += 1;
  if (keys.has('ArrowDown') || keys.has('KeyS')) keyInput.y -= 1;
  if (keyInput.lengthSq() > 1) keyInput.normalize();

  const combined = new THREE.Vector2().copy(joystickInput).add(keyInput);
  if (combined.lengthSq() > 1) combined.normalize();
  let directionLength = combined.length();
  if (directionLength > .05) {
    screenMovementDirection(combined.x, combined.y);
    targetPoint = null;
  } else if (targetPoint) {
    movement.copy(targetPoint).sub(player.position);
    movement.y = 0;
    const distance = movement.length();
    if (distance < .22) {
      targetPoint = null;
      movement.set(0, 0, 0);
      directionLength = 0;
    } else {
      movement.normalize();
      directionLength = Math.min(1, distance);
    }
  } else {
    movement.set(0, 0, 0);
    directionLength = 0;
  }

  const desiredVelocity = movement.multiplyScalar(5.1 * directionLength);
  const acceleration = 1 - Math.exp(-delta * 8.5);
  velocity.lerp(desiredVelocity, acceleration);
  if (directionLength === 0 && velocity.lengthSq() < .005) velocity.set(0, 0, 0);

  const next = player.position.clone().addScaledVector(velocity, delta);
  resolveCollision(next);
  player.position.x = next.x;
  player.position.z = next.z;

  const speed = velocity.length();
  if (speed > .08) {
    const desiredRotation = Math.atan2(velocity.x, velocity.z);
    let difference = desiredRotation - playerModel.rotation.y;
    difference = Math.atan2(Math.sin(difference), Math.cos(difference));
    playerModel.rotation.y += difference * (1 - Math.exp(-delta * 12));
    walkPhase += delta * (7.5 + speed * .75);
  }

  const walkAmount = THREE.MathUtils.clamp(speed / 3.7, 0, 1);
  const swing = Math.sin(walkPhase) * .72 * walkAmount;
  leftLeg.rotation.x = swing;
  rightLeg.rotation.x = -swing;
  leftArm.rotation.x = -swing * .72;
  rightArm.rotation.x = swing * .72;
  playerModel.position.y = Math.abs(Math.sin(walkPhase * 2)) * .055 * walkAmount + Math.sin(performance.now() * .0022) * .012;
  playerModel.rotation.z = Math.sin(walkPhase) * .025 * walkAmount;
  scarfTail.rotation.x = -.1 + speed * .025 + Math.sin(performance.now() * .004) * .08;

  const companionTarget = tempVector.set(-1.1, 1.72 + Math.sin(performance.now() * .0034) * .18, -.75).applyAxisAngle(new THREE.Vector3(0, 1, 0), playerModel.rotation.y).add(player.position);
  companion.position.lerp(companionTarget, 1 - Math.exp(-delta * 4.2));
  companion.rotation.y += delta * .65;
  companion.rotation.z = Math.sin(performance.now() * .0028) * .08;
}

function updateCamera(delta) {
  const angle = Math.PI / 4;
  const distance = 20;
  const desired = tempVector.set(Math.cos(angle) * distance, 18.5, Math.sin(angle) * distance).add(player.position);
  camera.position.lerp(desired, 1 - Math.exp(-delta * 3.25));
  cameraLook.lerp(tempVector2.copy(player.position).add(new THREE.Vector3(0, 1.15, 0)), 1 - Math.exp(-delta * 4.5));
  cameraTarget.copy(cameraLook);
  camera.lookAt(cameraLook);
}

function updateZones(time) {
  let nearest = null;
  let nearestDistance = Infinity;
  zones.forEach(zone => {
    const distance = Math.hypot(player.position.x - zone.x, player.position.z - zone.z);
    const pulse = 1 + Math.sin(time * .0024 + zone.x) * .035;
    zone.ring.scale.setScalar(pulse);
    zone.ring.material.emissiveIntensity = distance < zone.radius + 1.55 ? 1.45 : .72;
    zone.ring.material.opacity = distance < zone.radius + 1.55 ? .98 : .72;
    zone.beacon.material.opacity = distance < zone.radius + 1.55 ? .17 : .065;
    zone.label.position.y = 4.65 + Math.sin(time * .002 + zone.z) * .12;
    if (distance < zone.radius + 1.5 && distance < nearestDistance) {
      nearest = zone;
      nearestDistance = distance;
    }
  });
  if (nearest?.id !== activeZone?.id) {
    activeZone = nearest;
    updateZonePrompt();
  }
}

function updateZonePrompt() {
  if (!activeZone) {
    zonePrompt.hidden = true;
    return;
  }
  zonePrompt.hidden = false;
  zoneIcon.textContent = activeZone.icon;
  zoneName.textContent = text(activeZone.labelKey);
  zoneDescription.textContent = text(activeZone.descriptionKey);
  enterZoneButton.textContent = text('enter');
  guide.textContent = `${text(activeZone.labelKey)} · ${text(activeZone.descriptionKey)}`;
}

function animate(time) {
  if (!worldReady || paused || hub.hidden || document.hidden) return;
  const delta = Math.min(clock.getDelta(), .04);
  updateMovement(delta);
  updateCamera(delta);
  updateZones(time);
  renderer.render(scene, camera);
}

function moveToWorldPoint(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(groundPlane, hit)) {
    hit.y = player.position.y;
    resolveCollision(hit);
    targetPoint = hit.clone();
    guide.textContent = text('guide');
  }
}

function enterActiveZone() {
  if (!activeZone) return;
  if (activeZone.mode) {
    saveVillageState();
    paused = true;
    hub.hidden = true;
    quizApp.hidden = false;
    document.body.classList.remove('village-mode');
    const modeButton = $(`.mode-tabs button[data-mode="${activeZone.mode}"]`);
    modeButton?.click();
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => $('#quizHeading')?.focus?.(), 80);
  } else {
    openInfo(activeZone.id);
  }
}

function returnToVillage() {
  $('#countryDialog')?.close?.();
  quizApp.hidden = true;
  hub.hidden = false;
  document.body.classList.add('village-mode');
  window.speechSynthesis?.cancel();
  syncVillageUi();
  paused = false;
  clock.getDelta();
  resize();
}

function openInfo(type) {
  const isShop = type === 'shop';
  const state = readGameState();
  const ownedCount = isShop ? (state.ownedRewards?.length || 0) : (state.ownedBuildings?.length || 0);
  infoContent.innerHTML = `
    <h2>${isShop ? '🎒' : '🏗️'} ${text(isShop ? 'shopTitle' : 'buildTitle')}</h2>
    <p>${text(isShop ? 'shopBody' : 'buildBody')}</p>
    <div class="village-info-grid">
      <div><b>${state.points || 0}</b><span>${text('points')}</span></div>
      <div><b>${state.solved?.length || 0}</b><span>${text('explored')}</span></div>
      <div><b>${ownedCount}</b><span>${isShop ? 'ITEM' : 'BUILD'}</span></div>
    </div>`;
  infoDialog.showModal();
}

function navigateToZone(id) {
  const zone = zones.find(item => item.id === id);
  if (!zone) return;
  const approach = new THREE.Vector3(zone.x, player.position.y, zone.z + zone.radius + 1.05);
  resolveCollision(approach);
  targetPoint = approach;
  guide.textContent = `${text(zone.labelKey)} →`;
}

function resetJoystick() {
  joystickPointer = null;
  joystickInput.set(0, 0);
  joystickKnob.style.transform = 'translate(0px, 0px)';
}

joystick.addEventListener('pointerdown', event => {
  event.preventDefault();
  joystickPointer = event.pointerId;
  joystick.setPointerCapture(event.pointerId);
});
joystick.addEventListener('pointermove', event => {
  if (event.pointerId !== joystickPointer) return;
  const rect = joystick.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const radius = rect.width * .31;
  const length = Math.hypot(dx, dy) || 1;
  const scale = Math.min(1, radius / length);
  const limitedX = dx * scale;
  const limitedY = dy * scale;
  joystickKnob.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
  joystickInput.set(limitedX / radius, -limitedY / radius);
  targetPoint = null;
});
joystick.addEventListener('pointerup', resetJoystick);
joystick.addEventListener('pointercancel', resetJoystick);

viewport.addEventListener('pointerdown', event => {
  if (event.target !== renderer?.domElement) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
viewport.addEventListener('pointerup', event => {
  if (!pointerStart || pointerStart.id !== event.pointerId) return;
  const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  if (distance < 9) moveToWorldPoint(event.clientX, event.clientY);
  pointerStart = null;
});
viewport.addEventListener('wheel', event => {
  event.preventDefault();
  cameraZoom = THREE.MathUtils.clamp(cameraZoom + (event.deltaY > 0 ? -.08 : .08), .78, 1.38);
  camera.zoom = cameraZoom;
  camera.updateProjectionMatrix();
}, { passive: false });

window.addEventListener('keydown', event => {
  keys.add(event.code);
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
  if ((event.code === 'Space' || event.code === 'Enter') && activeZone && !hub.hidden) enterActiveZone();
});
window.addEventListener('keyup', event => keys.delete(event.code));
window.addEventListener('resize', resize);
window.addEventListener('beforeunload', saveVillageState);
document.addEventListener('visibilitychange', () => { if (!document.hidden && clock) clock.getDelta(); });

enterZoneButton.addEventListener('click', enterActiveZone);
$('#returnVillage').addEventListener('click', returnToVillage);
$('#closeVillageInfo').addEventListener('click', () => infoDialog.close());
infoDialog.addEventListener('click', event => { if (event.target === infoDialog) infoDialog.close(); });
$$('[data-zone-nav]').forEach(button => button.addEventListener('click', () => navigateToZone(button.dataset.zoneNav)));
$$('.language-switch button').forEach(button => button.addEventListener('click', () => {
  currentLang = button.dataset.lang;
  setTimeout(syncVillageUi, 0);
}));

syncVillageUi();
try {
  buildWorld();
} catch (error) {
  console.error('Village initialization failed:', error);
  loading.innerHTML = '<strong>3D 마을을 시작하지 못했어요. WebGL을 지원하는 브라우저에서 다시 열어 주세요.</strong>';
}
