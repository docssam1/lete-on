import * as THREE from "../../world-explorer/vendor/three.module.js";
import { CameraController } from "../../world-explorer/camera-controller.js";
import { createGeometryVillage } from "./world-3d-buildings.js?v=geometry-village-20260820g";

const host = document.querySelector("#world3d");
const loading = document.querySelector("#world3dLoading");
const joystick = document.querySelector("#worldJoystick");
const joystickKnob = joystick?.querySelector("span");
const cameraButton = document.querySelector("#worldCameraMode");
const zoomInButton = document.querySelector("#worldZoomIn");
const zoomOutButton = document.querySelector("#worldZoomOut");

const characterIds = ["cubi", "orbi", "pyra", "cylo", "recto", "arco", "coni", "pris", "nova", "foldy"];
const colorTints = {
  original: 0xffffff,
  ocean: 0xb9f5ff,
  berry: 0xffc4e0,
  sunset: 0xffd0ad,
  mono: 0xd4d7d8
};
const zoneCopy = {
  ko: {
    cubeCastle: ["쌓기나무 성", "쌓고, 세고, 공간을 탐험해요"],
    origamiStudio: ["색종이 공방", "접고 펼치며 대칭을 찾아요"],
    mirrorManor: ["거울 저택", "거울과 대칭의 비밀을 관찰해요"],
    geoboardYard: ["점판 공작소", "점과 선으로 도형을 만들어요"],
    crystalPlaza: ["지오메트리 랩", "문제은행과 탐구 학습을 만나요"]
  },
  zh: {
    cubeCastle: ["积木城堡", "搭建、计数并探索空间"], origamiStudio: ["折纸工坊", "折叠展开，寻找对称"],
    mirrorManor: ["镜子庄园", "观察镜像与对称"], geoboardYard: ["钉板工坊", "用点和线创造图形"],
    crystalPlaza: ["几何实验室", "探索题库与几何活动"]
  },
  ja: {
    cubeCastle: ["つみき城", "積んで数えて空間を探検"], origamiStudio: ["おりがみ工房", "折って開いて対称を発見"],
    mirrorManor: ["鏡の館", "鏡と対称のひみつを観察"], geoboardYard: ["ジオボード工房", "点と線で図形を作ろう"],
    crystalPlaza: ["ジオメトリーラボ", "問題と探究学習に挑戦"]
  },
  en: {
    cubeCastle: ["Cube Castle", "Build, count, and explore space"], origamiStudio: ["Origami Studio", "Fold, unfold, and find symmetry"],
    mirrorManor: ["Mirror Manor", "Explore reflections and symmetry"], geoboardYard: ["Geoboard Yard", "Create shapes with points and lines"],
    crystalPlaza: ["Geometry Lab", "Discover worksheets and challenges"]
  }
};
const districtCopy = {
  ko: {
    shapeDistrict: ["평면도형 거리", "합동·대칭·도형 이동"],
    spatialDistrict: ["공간·입체 지구", "전개도·단면·공간 추론"],
    coordinateDistrict: ["좌표·변환 지구", "좌표·닮음·중등 기하"]
  },
  zh: {
    shapeDistrict: ["平面图形街", "全等、对称与图形变换"],
    spatialDistrict: ["空间立体区", "展开图、截面与空间推理"],
    coordinateDistrict: ["坐标变换区", "坐标、相似与中学几何"]
  },
  ja: {
    shapeDistrict: ["平面図形ストリート", "合同・対称・図形の移動"],
    spatialDistrict: ["空間・立体エリア", "展開図・切断面・空間推理"],
    coordinateDistrict: ["座標・変換エリア", "座標・相似・中学幾何"]
  },
  en: {
    shapeDistrict: ["Plane Shapes Street", "Congruence, symmetry, and transformations"],
    spatialDistrict: ["Spatial Solids District", "Nets, sections, and spatial reasoning"],
    coordinateDistrict: ["Coordinates District", "Coordinates, similarity, and middle-school geometry"]
  }
};
const cameraCopy = {
  ko: { overview: "전체 지도", nearby: "내 주변" },
  zh: { overview: "全景地图", nearby: "我的周围" },
  ja: { overview: "全体マップ", nearby: "近くを見る" },
  en: { overview: "Full map", nearby: "Nearby" }
};
const qaZone = /^(127\.0\.0\.1|localhost)$/.test(location.hostname)
  ? new URLSearchParams(location.search).get("qaZone")
  : null;
const qaNpc = /^(127\.0\.0\.1|localhost)$/.test(location.hostname)
  ? new URLSearchParams(location.search).get("qaNpc")
  : null;
const qaSpawns = {
  cubeCastle: [-34.88, -19.93],
  origamiStudio: [0, -27.6],
  mirrorManor: [34.01, -17],
  geoboardYard: [36.89, 20.59],
  crystalPlaza: [-22.93, 20.47],
  shapeDistrict: [11.12, 29.93],
  spatialDistrict: [-51.9, 18.21],
  coordinateDistrict: [52.47, -34.06]
};
const qaNpcSpawns = {
  builder: [-13.2, -7],
  folder: [1, -18],
  observer: [13, -7],
  explorer: [-2, 13]
};

let scene;
let camera;
let renderer;
let cameraController;
let overviewTarget;
let lastFrameTime = 0;
let player;
let baseCharacterTexture;
let foldyTexture;
let worldTextures;
let zones = [];
let districts = [];
let colliders = [];
let animated = [];
let activeZone = null;
let activeDistrict = null;
let activeNpc = null;
let targetPoint = null;
let targetZone = null;
let pendingActivationId = null;
let destinationCameraYaw = null;
let pointerStart = null;
let joystickPointer = null;
let worldReady = false;
let lastSaveAt = 0;
let reducedMotion = false;
const keys = new Set();
const joystickInput = new THREE.Vector2();
const velocity = new THREE.Vector3();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const npcs = [];
const zoneLabels = new Map();
let labelTargets = [];
let labelLanguage = "";

function readProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem("gfield-profile") || "{}");
    return {
      character: characterIds.includes(stored.character) ? stored.character : "cubi",
      color: stored.color || "original",
      equipped: stored.equipped && typeof stored.equipped === "object" ? stored.equipped : {}
    };
  } catch {
    return { character: "cubi", color: "original", equipped: {} };
  }
}

function readPosition() {
  if (qaNpc && qaNpcSpawns[qaNpc]) {
    const [x, z] = qaNpcSpawns[qaNpc];
    return new THREE.Vector3(x, .1, z);
  }
  if (qaZone && qaSpawns[qaZone]) {
    const [x, z] = qaSpawns[qaZone];
    return new THREE.Vector3(x, .1, z);
  }
  try {
    const saved = JSON.parse(localStorage.getItem("gfield-geometry-world-position") || "{}");
    if (saved.version === 3 && Number.isFinite(saved.x) && Number.isFinite(saved.z)) {
      const insideWorld = Math.abs(saved.x) <= 68 && Math.abs(saved.z) <= 49;
      if (insideWorld) return new THREE.Vector3(saved.x, .1, saved.z);
    }
  } catch {}
  return new THREE.Vector3(0, .1, 11);
}

function savePosition() {
  if (!player || qaZone || qaNpc) return;
  try {
    localStorage.setItem("gfield-geometry-world-position", JSON.stringify({ version: 3, x: player.position.x, z: player.position.z }));
  } catch {}
}

function makeTextureForCharacter(id) {
  if (id === "foldy") {
    const texture = foldyTexture.clone();
    texture.needsUpdate = true;
    return texture;
  }
  const index = Math.max(0, characterIds.indexOf(id));
  const col = index % 3;
  const row = Math.floor(index / 3);
  const texture = baseCharacterTexture.clone();
  texture.repeat.set(1 / 3, 1 / 3);
  texture.offset.set(col / 3, (2 - row) / 3);
  texture.needsUpdate = true;
  return texture;
}

function createAccessory(profile) {
  const group = new THREE.Group();
  const equipped = profile.equipped || {};
  const gold = new THREE.MeshStandardMaterial({ color: 0xf6c84d, roughness: .48, metalness: .16 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x69d2c1, emissive: 0x23695f, emissiveIntensity: .22, roughness: .45 });
  if (equipped.hat === "crown") {
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(.38, .48, .34, 6, 1, true), gold);
    crown.position.y = 3.45;
    group.add(crown);
  } else if (equipped.hat) {
    const hat = new THREE.Mesh(new THREE.ConeGeometry(.42, .48, 12), accent);
    hat.position.y = 3.48;
    group.add(hat);
  }
  if (equipped.aura) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.02, .055, 8, 30), accent);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = .12;
    group.add(ring);
    group.userData.aura = ring;
  }
  return group;
}

function createCharacter(profile, scale = 1) {
  const root = new THREE.Group();
  const texture = makeTextureForCharacter(profile.character);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: colorTints[profile.color] || 0xffffff,
    transparent: true,
    alphaTest: .06,
    depthWrite: true
  });
  const sprite = new THREE.Sprite(material);
  sprite.center.set(.5, 0);
  sprite.scale.set(3.45 * scale, 3.45 * scale, 1);
  sprite.position.y = .08;
  root.add(sprite);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(.7 * scale, 20),
    new THREE.MeshBasicMaterial({ color: 0x173126, transparent: true, opacity: .24, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = .035;
  shadow.scale.y = .55;
  root.add(shadow);
  root.add(createAccessory(profile));
  root.userData.sprite = sprite;
  root.userData.baseScale = sprite.scale.y;
  root.userData.walkTime = Math.random() * 5;
  return root;
}

function disposeCharacter(character) {
  character?.traverse((object) => {
    if (object.material?.map) object.material.map.dispose();
    object.material?.dispose?.();
    object.geometry?.dispose?.();
  });
}

function rebuildPlayer() {
  const position = player?.position?.clone() || readPosition();
  if (player) {
    scene.remove(player);
    disposeCharacter(player);
  }
  player = createCharacter(readProfile(), 1.08);
  player.position.copy(resolvePosition(position));
  scene.add(player);
  if (cameraController && cameraController.mode !== "overview") cameraController.target = player;
}

function createNpcCharacters() {
  const selected = readProfile().character;
  const pool = characterIds.filter((id) => id !== selected && id !== "foldy").slice(0, 4);
  const roles = ["builder", "folder", "observer", "explorer"];
  const paths = [
    [[-16, -7], [-24, -12], [-15, -18]],
    [[-2, -18], [6, -22], [10, -14]],
    [[16, -7], [23, -2], [18, 6]],
    [[-5, 13], [-14, 19], [-21, 11]]
  ];
  pool.forEach((id, index) => {
    const mesh = createCharacter({ character: id, color: "original", equipped: {} }, .88);
    const points = paths[index].map(([x, z]) => new THREE.Vector3(x, .1, z));
    mesh.position.copy(points[0]);
    scene.add(mesh);
    npcs.push({
      id: roles[index],
      characterId: id,
      mesh,
      points,
      pointIndex: 1,
      speed: 1.12 + index * .08,
      talking: false
    });
  });
}

function resolvePosition(candidate) {
  candidate.x = THREE.MathUtils.clamp(candidate.x, -68, 68);
  candidate.z = THREE.MathUtils.clamp(candidate.z, -49, 49);
  for (const collider of colliders) {
    const dx = candidate.x - collider.x;
    const dz = candidate.z - collider.z;
    const distance = Math.hypot(dx, dz);
    const minimum = collider.radius + .58;
    if (distance < minimum) {
      const nx = distance > .001 ? dx / distance : 1;
      const nz = distance > .001 ? dz / distance : 0;
      candidate.x = collider.x + nx * minimum;
      candidate.z = collider.z + nz * minimum;
    }
  }
  candidate.y = .1;
  return candidate;
}

function currentInput() {
  const x = (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) - (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0) + joystickInput.x;
  const y = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) + joystickInput.y;
  const input = new THREE.Vector2(x, y);
  if (input.length() > 1) input.normalize();
  return input;
}

function steerAroundColliders(direction, targetDistance) {
  if (!direction.lengthSq() || targetDistance <= .8) return direction;
  const lookAhead = Math.min(7, Math.max(2.8, targetDistance));
  const leftX = -direction.z;
  const leftZ = direction.x;
  let steerX = 0;
  let steerZ = 0;
  let strongest = 0;

  colliders.forEach((collider) => {
    const offsetX = collider.x - player.position.x;
    const offsetZ = collider.z - player.position.z;
    const forward = offsetX * direction.x + offsetZ * direction.z;
    if (forward <= .05 || forward >= lookAhead || forward >= targetDistance - .18) return;
    const lateral = offsetX * leftX + offsetZ * leftZ;
    const clearance = collider.radius + 1.02;
    if (Math.abs(lateral) >= clearance) return;

    const side = Math.abs(lateral) > .08
      ? (lateral > 0 ? -1 : 1)
      : (Math.sin(collider.x * 12.9898 + collider.z * 78.233) >= 0 ? 1 : -1);
    const closeness = 1 - Math.abs(lateral) / clearance;
    const urgency = 1 - forward / lookAhead;
    const score = closeness * 1.35 + urgency;
    if (score <= strongest) return;
    strongest = score;
    const weight = (.58 + closeness * 1.6) * (.42 + urgency);
    steerX = leftX * side * weight;
    steerZ = leftZ * side * weight;

    const distance = Math.hypot(offsetX, offsetZ) || 1;
    const edgeDistance = distance - clearance;
    if (edgeDistance < 1.15) {
      const push = (1.15 - edgeDistance) / 1.15;
      steerX -= offsetX / distance * push * 1.05;
      steerZ -= offsetZ / distance * push * 1.05;
    }
  });

  if (strongest > 0) {
    direction.x += steerX;
    direction.z += steerZ;
    direction.normalize();
  }
  return direction;
}

function updatePlayer(delta, time) {
  const input = currentInput();
  const manual = input.lengthSq() > .002;
  const direction = new THREE.Vector3();
  if (manual) {
    targetPoint = null;
    targetZone = null;
    pendingActivationId = null;
    destinationCameraYaw = null;
    const yaw = cameraController.yaw;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    direction.addScaledVector(right, input.x).addScaledVector(forward, input.y);
  } else if (targetPoint) {
    direction.copy(targetPoint).sub(player.position);
    direction.y = 0;
    const targetDistance = direction.length();
    if (targetDistance < .34) {
      targetPoint = null;
      targetZone = null;
      direction.set(0, 0, 0);
    } else {
      direction.normalize();
      steerAroundColliders(direction, targetDistance);
    }
  }
  if (direction.lengthSq() > 1) direction.normalize();
  const desired = direction.multiplyScalar(5.2);
  velocity.lerp(desired, 1 - Math.exp(-delta * (desired.lengthSq() ? 9 : 12)));
  const candidate = resolvePosition(player.position.clone().addScaledVector(velocity, delta));
  player.position.copy(candidate);

  const speed = velocity.length();
  player.userData.walkTime += delta * (2.4 + speed * 1.3);
  const sprite = player.userData.sprite;
  const bob = speed > .12 ? Math.abs(Math.sin(player.userData.walkTime * 4.5)) * .13 : Math.sin(time * .0018) * .045;
  sprite.position.y = .08 + bob;
  sprite.material.rotation = speed > .12 ? Math.sin(player.userData.walkTime * 4.5) * .035 : 0;
  const aura = player.children.find((child) => child.userData?.aura)?.userData?.aura;
  if (aura) aura.rotation.z += delta * .8;

  if (speed > .08) window.dispatchEvent(new CustomEvent("geometry-world-move"));
  if (performance.now() - lastSaveAt > 2500) {
    lastSaveAt = performance.now();
    savePosition();
    if (host) {
      host.dataset.playerX = player.position.x.toFixed(2);
      host.dataset.playerZ = player.position.z.toFixed(2);
    }
  }
}

function updateNpcs(delta, time) {
  npcs.forEach((npc, index) => {
    const target = npc.points[npc.pointIndex];
    const direction = target.clone().sub(npc.mesh.position);
    direction.y = 0;
    if (!npc.talking) {
      if (direction.length() < .45) npc.pointIndex = (npc.pointIndex + 1) % npc.points.length;
      else npc.mesh.position.addScaledVector(direction.normalize(), npc.speed * delta);
    }
    npc.mesh.userData.walkTime += delta * 3;
    const sprite = npc.mesh.userData.sprite;
    const playerNearby = player && npc.mesh.position.distanceToSquared(player.position) < 30;
    const hop = reducedMotion ? 0 : Math.abs(Math.sin(npc.mesh.userData.walkTime * 4 + index)) * (playerNearby ? .14 : .08);
    sprite.position.y = .08 + hop;
    sprite.material.rotation = reducedMotion ? 0 : Math.sin(npc.mesh.userData.walkTime * 4 + index) * (playerNearby ? .04 : .025);
  });
  animated.forEach((item, index) => {
    if (typeof item?.update === "function") item.update(delta, time);
    else if (item?.userData?.animation?.type === "spin") {
      if (!reducedMotion) {
        const motion = item.userData.animation;
        item.rotation[motion.axis || "y"] += delta * (motion.speed || .2);
      }
    } else if (item?.userData?.animation?.type === "bob") {
      const motion = item.userData.animation;
      item.position.y = motion.baseY + (reducedMotion ? 0 : Math.sin(time * .001 * motion.speed) * motion.amplitude);
    } else if (item?.userData?.animation?.type === "sway") {
      const motion = item.userData.animation;
      item.rotation[motion.axis || "z"] = motion.base + (reducedMotion ? 0 : Math.sin(time * .001 * motion.speed + (motion.phase || 0)) * motion.amplitude);
    } else if (item?.userData?.animation?.type === "door") {
      const motion = item.userData.animation;
      const target = motion.open ? 1 : 0;
      const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * motion.speed);
      motion.progress += (target - motion.progress) * blend;
      const eased = motion.progress * motion.progress * (3 - 2 * motion.progress);
      item.position.y = THREE.MathUtils.lerp(motion.closedY, motion.openY, eased);
      item.scale.y = THREE.MathUtils.lerp(motion.closedScaleY, motion.openScaleY, eased);
      if (motion.glow?.material) {
        motion.glow.material.opacity = .035 + eased * .78;
        motion.glow.visible = eased > .015;
      }
    } else if (item?.userData?.animation?.type === "arrival") {
      const motion = item.userData.animation;
      const target = motion.active ? 1 : 0;
      const blend = reducedMotion ? 1 : 1 - Math.exp(-delta * (motion.active ? 8 : 5));
      motion.progress += (target - motion.progress) * blend;
      item.visible = motion.progress > .025;
      item.material.opacity = motion.progress * .9;
      const lift = reducedMotion ? 0 : Math.sin(time * .004 + motion.phase) * .16;
      item.position.y = motion.baseY + lift;
      if (!reducedMotion) item.rotation.y += delta * (.35 + motion.progress * .9);
      item.scale.setScalar(.82 + motion.progress * .35);
    }
  });
}

function updateNpcInteraction() {
  let nearest = null;
  let nearestDistance = Infinity;
  if (!activeZone && !activeDistrict) {
    npcs.forEach((npc) => {
      const distance = player.position.distanceTo(npc.mesh.position);
      if (distance < 4.25 && distance < nearestDistance) {
        nearest = npc;
        nearestDistance = distance;
      }
    });
  }
  if (nearest?.id === activeNpc?.id) return;
  activeNpc = nearest;
  npcs.forEach((npc) => { npc.talking = npc === activeNpc; });
  if (host) host.dataset.activeNpc = activeNpc?.id || "";
  window.dispatchEvent(new CustomEvent("geometry-npc-change", {
    detail: activeNpc ? { id: activeNpc.id, characterId: activeNpc.characterId } : { id: null }
  }));
}

function updateZone() {
  const destinations = [...zones, ...districts];
  let nearest = null;
  let nearestDistance = Infinity;
  destinations.forEach((zone) => {
    const distance = player.position.distanceTo(zone.entry);
    if (zone.ring) {
      const proximity = THREE.MathUtils.clamp(1 - distance / 13, 0, 1);
      const isDestination = zone.id === targetZone?.id;
      const wave = reducedMotion ? 0 : Math.sin(performance.now() * (isDestination ? .005 : .003) + zone.x) * (.055 + proximity * .08 + (isDestination ? .055 : 0));
      const pulse = 1 + wave + proximity * .045 + (isDestination ? .07 : 0);
      zone.ring.scale.setScalar(pulse);
      zone.ring.material.opacity = Math.min(1, .38 + proximity * .5 + (isDestination ? .22 : 0));
      zone.ring.material.emissive.copy(zone.ring.material.color);
      zone.ring.material.emissiveIntensity = isDestination ? .52 : proximity * .14;
      zone.ring.userData.animation.proximity = proximity;
    }
    if (distance < 4.15 && distance < nearestDistance) {
      nearest = zone;
      nearestDistance = distance;
    }
  });
  destinations.forEach((zone) => {
    const isActive = zone.id === nearest?.id;
    if (zone.entryDoor?.userData?.animation) zone.entryDoor.userData.animation.open = isActive;
    if (zone.arrivalFx?.userData?.animation) zone.arrivalFx.userData.animation.active = isActive;
  });
  const nextZone = nearest && zones.some((zone) => zone.id === nearest.id) ? nearest : null;
  const nextDistrict = nearest && districts.some((district) => district.id === nearest.id) ? nearest : null;
  if (host) {
    host.dataset.entryState = nearest ? "open" : "closed";
    host.dataset.entryProgress = nextZone
      ? Number(nextZone.entryDoor?.userData?.animation?.progress || 0).toFixed(2)
      : nextDistrict ? "1.00" : "0.00";
    host.dataset.targetZone = targetZone?.id || "";
  }
  if (nextZone?.id === activeZone?.id && nextDistrict?.id === activeDistrict?.id) return;
  activeZone = nextZone;
  activeDistrict = nextDistrict;
  if (host) host.dataset.activeZone = activeZone?.id || "";
  if (host) host.dataset.activeDistrict = activeDistrict?.id || "";
  window.dispatchEvent(new CustomEvent("geometry-zone-change", { detail: { id: activeZone?.id || null } }));
  window.dispatchEvent(new CustomEvent("geometry-district-change", { detail: { id: activeDistrict?.id || null } }));
  const arrived = activeZone || activeDistrict;
  if (arrived?.id && pendingActivationId === arrived.id) {
    pendingActivationId = null;
    window.dispatchEvent(new CustomEvent("geometry-place-activate", { detail: { id: arrived.id } }));
  }
}

function createZoneLabels() {
  labelTargets = [...zones, ...districts];
  labelTargets.forEach((zone) => {
    const isDistrict = Boolean(districtCopy.ko[zone.id]);
    const label = document.createElement("button");
    label.className = `world-zone-label${isDistrict ? " world-district-label" : ""}`;
    label.dataset.zone = zone.id;
    label.innerHTML = "<strong></strong><span></span>";
    label.type = "button";
    label.classList.add("world-place-label");
    label.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (activeZone?.id === zone.id || activeDistrict?.id === zone.id) {
        window.dispatchEvent(new CustomEvent("geometry-place-activate", { detail: { id: zone.id } }));
      } else {
        setDestination(zone, null, { enterOnArrival: true });
      }
    });
    host.append(label);
    zoneLabels.set(zone.id, label);
  });
  updateZoneLabelCopy(true);
}

function updateZoneLabelCopy(force = false) {
  const language = document.documentElement.lang?.split("-")[0] || "ko";
  if (!force && language === labelLanguage) return;
  labelLanguage = language;
  const copy = zoneCopy[language] || zoneCopy.ko;
  const districtText = districtCopy[language] || districtCopy.ko;
  labelTargets.forEach((zone) => {
    const label = zoneLabels.get(zone.id);
    const text = copy[zone.id] || districtText[zone.id] || zoneCopy.en[zone.id] || districtCopy.en[zone.id];
    if (!label || !text) return;
    label.querySelector("strong").textContent = text[0];
    label.querySelector("span").textContent = text[1];
    label.setAttribute("aria-label", text.join(" · "));
  });
  updateCameraButtonCopy(cameraController?.mode);
}

function updateCameraButtonCopy(mode = "explore") {
  if (!cameraButton) return;
  const language = document.documentElement.lang?.split("-")[0] || "ko";
  const copy = cameraCopy[language] || cameraCopy.ko;
  const showingOverview = mode === "overview";
  const label = showingOverview ? copy.nearby : copy.overview;
  const text = cameraButton.querySelector(".camera-control-label");
  const icon = cameraButton.querySelector("b");
  if (text) text.textContent = label;
  if (icon) icon.textContent = showingOverview ? "⌖" : "▦";
  cameraButton.setAttribute("aria-label", label);
  cameraButton.title = label;
}

function updateZoneLabels() {
  if (!camera || !renderer || !player) return;
  updateZoneLabelCopy();
  camera.updateMatrixWorld();
  const rect = renderer.domElement.getBoundingClientRect();
  labelTargets.forEach((zone) => {
    const label = zoneLabels.get(zone.id);
    if (!label) return;
    const point = (zone.labelPosition || zone.entry).clone().project(camera);
    const distance = player.position.distanceTo(zone.entry || zone.labelPosition);
    const outside = point.z < -1 || point.z > 1 || Math.abs(point.x) > 1.08 || Math.abs(point.y) > 1.08;
    const tooFarInFollow = cameraController.mode === "follow" && distance > (districtCopy.ko[zone.id] ? 34 : 28);
    label.hidden = outside || tooFarInFollow;
    if (label.hidden) return;
    label.classList.toggle("nearby", distance < 18);
    label.classList.toggle("destination", zone.id === targetZone?.id);
    label.style.left = `${rect.left + (point.x + 1) * rect.width / 2}px`;
    label.style.top = `${rect.top + (1 - point.y) * rect.height / 2}px`;
  });
}

function setDestination(zone = null, point = null, { enterOnArrival = false } = {}) {
  targetPoint = zone ? zone.entry.clone() : point ? resolvePosition(point.clone()) : null;
  targetZone = zone;
  pendingActivationId = enterOnArrival && zone ? zone.id : null;
  destinationCameraYaw = zone
    ? Math.atan2(zone.entry.x - zone.x, zone.entry.z - zone.z)
    : null;
  activeZone = null;
  activeDistrict = null;
  if (host) {
    host.dataset.targetZone = zone?.id || "";
    host.dataset.activeZone = "";
    host.dataset.activeDistrict = "";
  }
  if (zone && cameraController?.mode === "overview") {
    cameraController.setMode("follow");
    cameraController.target = player;
    cameraController.zoom = matchMedia("(pointer: coarse)").matches ? .86 : .78;
    if (host) host.dataset.cameraMode = "follow";
  }
  window.dispatchEvent(new CustomEvent("geometry-zone-change", { detail: { id: null } }));
  window.dispatchEvent(new CustomEvent("geometry-district-change", { detail: { id: null } }));
  window.dispatchEvent(new CustomEvent("geometry-world-move"));
}

function moveToWorldPoint(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const destinations = [...zones, ...districts];
  const buildingHit = raycaster.intersectObjects(destinations.map((zone) => zone.group).filter(Boolean), true)[0];
  let zone = buildingHit
    ? destinations.find((candidate) => candidate.id === buildingHit.object.userData.zoneId)
    : null;
  const directBuildingHit = Boolean(zone);
  const hit = new THREE.Vector3();
  if (!zone) {
    if (!raycaster.ray.intersectPlane(groundPlane, hit)) return;
    zone = destinations.find((candidate) => Math.hypot(hit.x - candidate.x, hit.z - candidate.z) < candidate.radius + 2.2);
  }
  if (directBuildingHit && (activeZone?.id === zone.id || activeDistrict?.id === zone.id)) {
    window.dispatchEvent(new CustomEvent("geometry-place-activate", { detail: { id: zone.id } }));
    return;
  }
  setDestination(zone, hit, { enterOnArrival: directBuildingHit });
}

function bindControls() {
  const resetJoystick = () => {
    joystickPointer = null;
    joystickInput.set(0, 0);
    if (joystickKnob) joystickKnob.style.transform = "translate(0px,0px)";
  };
  joystick?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystickPointer = event.pointerId;
    joystick.setPointerCapture?.(event.pointerId);
  });
  joystick?.addEventListener("pointermove", (event) => {
    if (event.pointerId !== joystickPointer) return;
    const rect = joystick.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    const radius = rect.width * .3;
    const length = Math.hypot(dx, dy) || 1;
    const scale = Math.min(1, radius / length);
    const x = dx * scale;
    const y = dy * scale;
    joystickInput.set(x / radius, -y / radius);
    joystickKnob.style.transform = `translate(${x}px,${y}px)`;
    targetPoint = null;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => joystick?.addEventListener(type, resetJoystick));

  renderer.domElement.addEventListener("pointerdown", (event) => {
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  renderer.domElement.addEventListener("pointerup", (event) => {
    if (!pointerStart || pointerStart.id !== event.pointerId) return;
    const distance = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
    pointerStart = null;
    if (distance < 9) moveToWorldPoint(event.clientX, event.clientY);
  });
  renderer.domElement.addEventListener("pointercancel", () => { pointerStart = null; });

  window.addEventListener("keydown", (event) => {
    keys.add(event.code);
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  cameraButton?.addEventListener("click", () => {
    const nearbyMode = matchMedia("(pointer: coarse)").matches ? "follow" : "explore";
    const mode = cameraController.mode === "overview" ? nearbyMode : "overview";
    cameraController.setMode(mode);
    cameraController.zoom = mode === "overview" ? .2 : mode === "explore" ? .68 : .92;
    cameraController.target = mode === "overview" ? overviewTarget : player;
    if (host) host.dataset.cameraMode = mode;
    updateCameraButtonCopy(mode);
  });
  zoomInButton?.addEventListener("click", () => { cameraController.zoom = THREE.MathUtils.clamp(cameraController.zoom + .1, .22, 1.5); });
  zoomOutButton?.addEventListener("click", () => { cameraController.zoom = THREE.MathUtils.clamp(cameraController.zoom - .1, .22, 1.5); });
  window.addEventListener("geometry-profile-change", rebuildPlayer);
  window.addEventListener("pagehide", savePosition);
}

function resize() {
  if (!renderer || !camera || !host) return;
  const width = Math.max(1, host.clientWidth);
  const height = Math.max(1, host.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function getWorldState() {
  const rect = renderer?.domElement.getBoundingClientRect();
  return {
    ready: worldReady,
    player: player ? { x: player.position.x, z: player.position.z } : null,
    activeZone: activeZone?.id || null,
    activeDistrict: activeDistrict?.id || null,
    activeNpc: activeNpc?.id || null,
    targetZone: targetZone?.id || null,
    pendingActivation: pendingActivationId,
    cameraMode: cameraController?.mode || null,
    navigation: /^(127\.0\.0\.1|localhost)$/.test(location.hostname) && player ? {
      target: targetPoint ? { x: targetPoint.x, z: targetPoint.z } : null,
      velocity: { x: velocity.x, z: velocity.z, speed: velocity.length() },
      nearestColliders: colliders
        .map((collider) => ({ ...collider, distance: Math.hypot(player.position.x - collider.x, player.position.z - collider.z) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4)
    } : undefined,
    zones: !camera || !rect ? [] : zones.map((zone) => {
      const screen = zone.entry.clone().project(camera);
      return {
        id: zone.id,
        x: rect.left + (screen.x + 1) * rect.width / 2,
        y: rect.top + (1 - screen.y) * rect.height / 2,
        doorOpen: Boolean(zone.entryDoor?.userData?.animation?.open),
        doorProgress: Number(zone.entryDoor?.userData?.animation?.progress || 0)
      };
    }),
    districts: !camera || !rect ? [] : districts.map((district) => {
      const screen = district.entry.clone().project(camera);
      return {
        id: district.id,
        x: rect.left + (screen.x + 1) * rect.width / 2,
        y: rect.top + (1 - screen.y) * rect.height / 2,
        arrived: district.id === activeDistrict?.id
      };
    })
  };
}

function animate(time) {
  if (!worldReady || document.hidden) return;
  const elapsed = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, .16) : 1 / 60;
  lastFrameTime = time;
  const steps = Math.max(1, Math.ceil(elapsed / .035));
  const delta = elapsed / steps;
  for (let step = 0; step < steps; step += 1) {
    updatePlayer(delta, time - (steps - step - 1) * delta * 1000);
    updateNpcs(delta, time - (steps - step - 1) * delta * 1000);
  }
  updateZone();
  updateNpcInteraction();
  if (targetZone && Number.isFinite(destinationCameraYaw) && cameraController.mode === "follow") {
    const turn = Math.atan2(
      Math.sin(destinationCameraYaw - cameraController.yaw),
      Math.cos(destinationCameraYaw - cameraController.yaw)
    );
    cameraController.yaw += turn * (1 - Math.exp(-elapsed * 2.8));
  }
  cameraController.update(delta);
  updateZoneLabels();
  renderer.render(scene, camera);
}

async function buildWorld() {
  if (!host || !window.WebGLRenderingContext) return;
  const coarse = matchMedia("(pointer: coarse)").matches;
  reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8ecedd);
  scene.fog = new THREE.Fog(0x8ecedd, 135, 230);
  overviewTarget = new THREE.Object3D();
  overviewTarget.position.set(0, 0, 0);
  scene.add(overviewTarget);

  renderer = new THREE.WebGLRenderer({ antialias: !coarse, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("aria-label", "3D Geometry World");
  host.prepend(renderer.domElement);

  camera = new THREE.PerspectiveCamera(44, 1, .1, 240);
  scene.add(new THREE.HemisphereLight(0xe6f8ff, 0x557449, 2.35));
  const sun = new THREE.DirectionalLight(0xfff0d0, 2.8);
  sun.position.set(-22, 34, 18);
  sun.castShadow = !coarse;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -48;
  sun.shadow.camera.right = 48;
  sun.shadow.camera.top = 45;
  sun.shadow.camera.bottom = -45;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 100;
  sun.shadow.bias = -.0004;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffc88f, .55);
  fill.position.set(24, 16, -25);
  scene.add(fill);

  const loader = new THREE.TextureLoader();
  const loadedTextures = await Promise.all([
    loader.loadAsync("./assets/geometry-characters.png"),
    loader.loadAsync("./assets/foldy-character.webp"),
    loader.loadAsync("../assets/ui/wood-light.webp"),
    loader.loadAsync("../assets/ui/wood-mid.webp"),
    loader.loadAsync("../assets/ui/wood-dark.webp"),
    loader.loadAsync("../assets/ui/panel-cream.webp"),
    loader.loadAsync("../assets/ui/cube-wood.webp")
  ]);
  [baseCharacterTexture, foldyTexture] = loadedTextures;
  worldTextures = {
    woodLight: loadedTextures[2],
    woodMid: loadedTextures[3],
    woodDark: loadedTextures[4],
    cream: loadedTextures[5],
    cubeWood: loadedTextures[6]
  };
  baseCharacterTexture.colorSpace = THREE.SRGBColorSpace;
  foldyTexture.colorSpace = THREE.SRGBColorSpace;
  Object.values(worldTextures).forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  });

  const village = createGeometryVillage(THREE, scene, {
    shadows: !coarse,
    reducedMotion,
    textures: worldTextures,
    detail: coarse ? "compact" : "full"
  });
  zones = village.zones || [];
  districts = village.districts || [];
  colliders = village.colliders || [];
  animated = village.animated || [];
  [...zones, ...districts].forEach((zone) => zone.group?.traverse((object) => { object.userData.zoneId = zone.id; }));
  createZoneLabels();

  rebuildPlayer();
  createNpcCharacters();
  cameraController = new CameraController(THREE, camera, player, renderer, {
    mode: coarse ? "follow" : "explore",
    yaw: Math.PI * .22,
    zoom: coarse ? .86 : .55,
    pitch: .72
  });
  host.dataset.cameraMode = cameraController.mode;
  updateCameraButtonCopy(cameraController.mode);
  resize();
  bindControls();
  lastFrameTime = 0;
  worldReady = true;
  host.setAttribute("aria-hidden", "false");
  document.body.classList.add("world-3d-ready");
  loading?.classList.add("done");
  window.geometryWorld3D = Object.freeze({ getState: getWorldState });
  window.dispatchEvent(new CustomEvent("geometry-world-ready"));
  renderer.setAnimationLoop(animate);
  if (reducedMotion) renderer.render(scene, camera);
}

window.addEventListener("resize", resize);
buildWorld().catch((error) => {
  console.error("Geometry 3D world failed to start", error);
  document.body.classList.add("world-3d-failed");
  loading?.classList.add("failed");
});
