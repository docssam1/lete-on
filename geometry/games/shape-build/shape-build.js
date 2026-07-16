import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const BOARD_SIZE = 4;
const MAX_HEIGHT = 4;
const TYPES = Object.freeze({
  CUBE: "cube",
  CUBOID: "cuboid",
  WEDGE: "wedge",
  PYRAMID: "pyramid",
  CONE: "cone"
});

const TYPE_LABELS = {
  ko: { cube: "정육면체", cuboid: "직육면체", wedge: "삼각기둥", pyramid: "각뿔", cone: "원뿔" },
  zh: { cube: "正方体", cuboid: "长方体", wedge: "三棱柱", pyramid: "棱锥", cone: "圆锥" },
  ja: { cube: "立方体", cuboid: "直方体", wedge: "三角柱", pyramid: "角すい", cone: "円すい" },
  en: { cube: "Cube", cuboid: "Cuboid", wedge: "Prism", pyramid: "Pyramid", cone: "Cone" }
};

const UI_TEXT = {
  ko: {
    target: "문제 모양", creative: "나만의 작품", build: "내가 만든 모양", check: "확인", finish: "완성",
    next: "다음 문제", reset: "처음부터", rotate: "방향", front: "앞", right: "오른쪽", top: "위", capture: "사진",
    audioOn: "음성 끄기", audioOff: "음성 켜기", guide4: "직육면체의 방향까지 똑같이 놓아 보자!",
    guide5: "여러 입체를 골라 멋진 모양을 만들어 보자!", guideCreative: "주어진 조각으로 나만의 작품을 만들어 보자!",
    wrong: "조각의 위치와 방향을 다시 살펴보세요.", success: "정확하게 만들었어요!", needMore: "조각을 5개 이상 사용해 보세요.",
    invalid: "그 자리에는 놓을 수 없어요.", rotateState: "조각 방향을 바꿨어요.", removed: "조각을 보관함에 돌려놓았어요."
  },
  zh: {
    target: "目标形状", creative: "我的作品", build: "我的形状", check: "确认", finish: "完成",
    next: "下一题", reset: "重新开始", rotate: "旋转", front: "前面", right: "右侧", top: "上面", capture: "拍照",
    audioOn: "关闭语音", audioOff: "开启语音", guide4: "连长方体的方向也要摆得一样！",
    guide5: "选择不同立体，做出漂亮的形状！", guideCreative: "用给出的积木创作自己的作品吧！",
    wrong: "再看看积木的位置和方向。", success: "做得完全一样！", needMore: "请至少使用5块积木。",
    invalid: "这里不能放。", rotateState: "方向已改变。", removed: "积木已放回托盘。"
  },
  ja: {
    target: "問題の形", creative: "わたしの作品", build: "作った形", check: "確認", finish: "完成",
    next: "次の問題", reset: "最初から", rotate: "向き", front: "前", right: "右側", top: "上", capture: "写真",
    audioOn: "音声オフ", audioOff: "音声オン", guide4: "直方体の向きまで同じに置こう！",
    guide5: "いろいろな立体で素敵な形を作ろう！", guideCreative: "決められたブロックで自分の作品を作ろう！",
    wrong: "位置と向きをもう一度見てください。", success: "同じ形にできました！", needMore: "ブロックを5個以上使ってください。",
    invalid: "そこには置けません。", rotateState: "向きを変えました。", removed: "ブロックをトレイに戻しました。"
  },
  en: {
    target: "Target Shape", creative: "My Creation", build: "My Build", check: "Check", finish: "Finish",
    next: "Next", reset: "Retry", rotate: "Rotate", front: "Front", right: "Right", top: "Top", capture: "Photo",
    audioOn: "Voice off", audioOff: "Voice on", guide4: "Match every cuboid position and direction!",
    guide5: "Choose different solids and build a wonderful shape!", guideCreative: "Use the given pieces to make your own creation!",
    wrong: "Check every piece position and direction.", success: "You made the same shape!", needMore: "Use at least five pieces.",
    invalid: "That piece cannot go there.", rotateState: "The piece direction changed.", removed: "The piece returned to the tray."
  }
};

const level4Problems = [
  {
    name: "직육면체 방향 익히기",
    pieces: [
      p("cuboid", 0, 0, 0, 0), p("cuboid", 2, 0, 0, 0), p("cuboid", 1, 0, 1, 2)
    ]
  },
  {
    name: "직육면체 계단",
    pieces: [
      p("cuboid", 0, 0, 0, 0), p("cuboid", 0, 0, 1, 1), p("cuboid", 1, 0, 1, 2), p("cuboid", 2, 0, 1, 0)
    ]
  },
  {
    name: "직육면체 문",
    pieces: [
      p("cuboid", 0, 0, 1, 2), p("cuboid", 2, 0, 1, 2), p("cuboid", 0, 2, 1, 0), p("cuboid", 2, 2, 1, 0)
    ]
  },
  {
    name: "직육면체 바람개비",
    pieces: [
      p("cuboid", 0, 0, 0, 0), p("cuboid", 2, 0, 0, 1), p("cuboid", 1, 0, 2, 0), p("cuboid", 0, 0, 1, 1)
    ]
  },
  {
    name: "직육면체 탑",
    pieces: [
      p("cuboid", 0, 0, 1, 0), p("cuboid", 2, 0, 0, 2), p("cuboid", 1, 0, 0, 2),
      p("cuboid", 1, 2, 0, 1), p("cuboid", 2, 2, 0, 1)
    ]
  }
];

const level5Problems = [
  {
    name: "지붕이 있는 집",
    pieces: [
      p("cube", 1, 0, 1), p("cube", 2, 0, 1), p("cuboid", 1, 1, 1, 0), p("wedge", 1, 2, 1, 0), p("wedge", 2, 2, 1, 2)
    ]
  },
  {
    name: "작은 성문",
    pieces: [
      p("cuboid", 0, 0, 1, 2), p("cuboid", 3, 0, 1, 2), p("cuboid", 0, 2, 1, 0),
      p("pyramid", 0, 3, 1), p("pyramid", 3, 2, 1), p("cube", 1, 0, 1), p("cube", 2, 0, 1)
    ]
  },
  {
    name: "로켓",
    pieces: [
      p("cuboid", 1, 0, 1, 2), p("cuboid", 1, 2, 1, 0), p("cone", 1, 3, 1),
      p("wedge", 0, 0, 1, 1), p("wedge", 2, 0, 1, 3)
    ]
  },
  {
    name: "입체 다리",
    pieces: [
      p("cuboid", 0, 0, 1, 2), p("cuboid", 3, 0, 1, 2), p("cuboid", 0, 2, 1, 0),
      p("cuboid", 2, 2, 1, 0), p("pyramid", 1, 3, 1), p("pyramid", 2, 3, 1)
    ]
  },
  {
    name: "자유 작품",
    creative: true,
    inventory: { cube: 8, cuboid: 6, wedge: 4, pyramid: 3, cone: 3 },
    pieces: []
  }
];

function p(type, x, y, z, rotation = 0) {
  return { id: `${type}-${x}-${y}-${z}-${rotation}`, type, x, y, z, rotation };
}

const params = new URLSearchParams(window.location.search);
const state = {
  lang: "ko",
  level: Number(params.get("level")) === 4 ? 4 : 5,
  problemIndex: 0,
  pieces: [],
  selectedType: Number(params.get("level")) === 4 ? TYPES.CUBOID : TYPES.CUBE,
  selectedRotation: 0,
  drag: null,
  audio: false,
  successPending: false
};

const targetHost = document.querySelector("#targetCanvas");
const buildHost = document.querySelector("#buildCanvas");
const toast = document.querySelector("#toast");
const dragGhost = document.querySelector("#shapeDragGhost");
const shapePile = document.querySelector("#shapePile");
const shapeTray = document.querySelector("#shapeTray");
const dropPreview = new THREE.Group();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let nextPieceId = 1;

const woodTexture = createWoodTexture();
const materials = {
  cube: makeMaterial(0xf0ca82),
  cuboid: makeMaterial(0xd89a52),
  wedge: makeMaterial(0x78aa6b),
  pyramid: makeMaterial(0xe6b941),
  cone: makeMaterial(0xda775e)
};
const previewMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff4c52,
  transparent: true,
  opacity: 0.43,
  roughness: 0.28,
  depthWrite: false,
  emissive: 0x6d1015,
  emissiveIntensity: 0.35
});

const targetViewer = createViewer(targetHost, false);
const buildViewer = createViewer(buildHost, true);
buildViewer.scene.add(dropPreview);
dropPreview.visible = false;

init();

function init() {
  validateProblemBank();
  addEvents();
  renderLevelOptions();
  loadProblem();
  resizeAll();
  animate();
}

function validateProblemBank() {
  [...level4Problems, ...level5Problems].forEach((problem) => {
    if (problem.creative) return;
    const occupied = new Set();
    problem.pieces.forEach((piece) => {
      const [width, height, depth] = getDimensions(piece);
      if (
        piece.x < 0 || piece.z < 0 || piece.y < 0 ||
        piece.x + width > BOARD_SIZE || piece.z + depth > BOARD_SIZE || piece.y + height > MAX_HEIGHT
      ) {
        throw new Error(`Problem "${problem.name}" has an out-of-bounds piece.`);
      }
      getOccupiedCells(piece).forEach((cell) => {
        if (occupied.has(cell)) throw new Error(`Problem "${problem.name}" has overlapping pieces at ${cell}.`);
        occupied.add(cell);
      });
    });
    problem.pieces.forEach((piece, pieceIndex) => {
      if (piece.y === 0) return;
      const otherOccupied = new Set(
        problem.pieces
          .filter((_, index) => index !== pieceIndex)
          .flatMap(getOccupiedCells)
      );
      const belowCells = getOccupiedCells({ ...piece, y: piece.y - 1 });
      if (!belowCells.some((cell) => otherOccupied.has(cell))) {
        throw new Error(`Problem "${problem.name}" has an unsupported piece.`);
      }
    });
  });
}

function getProblems() {
  return state.level === 4 ? level4Problems : level5Problems;
}

function getProblem() {
  return getProblems()[state.problemIndex];
}

function getText(key) {
  return UI_TEXT[state.lang]?.[key] || UI_TEXT.ko[key] || key;
}

function getTypeLabel(type) {
  return TYPE_LABELS[state.lang]?.[type] || TYPE_LABELS.ko[type] || type;
}

function loadProblem() {
  state.pieces = [];
  state.drag = null;
  state.successPending = false;
  state.selectedType = state.level === 4 ? TYPES.CUBOID : TYPES.CUBE;
  state.selectedRotation = 0;
  dropPreview.visible = false;
  const problem = getProblem();
  document.querySelector("#shapeGuide").className = `floating-guide level-${state.level}`;
  document.querySelector("#captureBuild").hidden = state.level !== 5;
  document.querySelector("#targetTitle").textContent = problem.creative ? getText("creative") : getText("target");
  document.querySelector("#buildTitle").textContent = getText("build");
  document.querySelector("#checkAnswer").textContent = problem.creative ? getText("finish") : getText("check");
  setGuide(problem.creative ? "guideCreative" : state.level === 4 ? "guide4" : "guide5");
  renderTarget();
  renderBuild();
  renderTray();
}

function renderTarget() {
  clearGroup(targetViewer.pieceGroup);
  getProblem().pieces.forEach((piece) => targetViewer.pieceGroup.add(createPieceMesh(piece, false)));
}

function renderBuild() {
  clearGroup(buildViewer.pieceGroup);
  state.pieces.forEach((piece) => buildViewer.pieceGroup.add(createPieceMesh(piece, true)));
  renderTray();
}

function renderTray() {
  const allowed = state.level === 4
    ? [TYPES.CUBOID]
    : [TYPES.CUBE, TYPES.CUBOID, TYPES.WEDGE, TYPES.PYRAMID, TYPES.CONE];
  const inventory = getInventory();
  const used = getUsedCounts();
  shapeTray.replaceChildren();
  allowed.forEach((type) => {
    const remaining = Math.max(0, (inventory[type] || 0) - (used[type] || 0));
    const button = document.createElement("button");
    const icon = document.createElement("span");
    const label = document.createElement("strong");
    const count = document.createElement("small");
    button.type = "button";
    button.className = "shape-piece";
    button.dataset.shape = type;
    button.classList.toggle("active", state.selectedType === type);
    button.disabled = remaining <= 0 && !state.drag?.sourceId;
    icon.className = "shape-icon";
    label.textContent = getTypeLabel(type);
    count.textContent = `x${remaining}`;
    button.append(icon, label, count);
    button.addEventListener("click", () => selectType(type));
    button.addEventListener("pointerdown", (event) => startTrayDrag(event, type));
    shapeTray.appendChild(button);
  });
}

function getInventory() {
  if (getProblem().creative) return getProblem().inventory;
  return getProblem().pieces.reduce((counts, piece) => {
    counts[piece.type] = (counts[piece.type] || 0) + 1;
    return counts;
  }, {});
}

function getUsedCounts() {
  return state.pieces.reduce((counts, piece) => {
    counts[piece.type] = (counts[piece.type] || 0) + 1;
    return counts;
  }, {});
}

function selectType(type) {
  state.selectedType = type;
  state.selectedRotation = 0;
  renderTray();
}

function rotateSelected() {
  const variants = getRotationVariants(state.selectedType);
  state.selectedRotation = (state.selectedRotation + 1) % variants;
  showToast(getText("rotateState"));
  if (state.drag) {
    state.drag.rotation = state.selectedRotation;
    updateDragPreview(state.drag.clientX, state.drag.clientY);
  }
}

function getRotationVariants(type) {
  if (type === TYPES.CUBOID) return 3;
  if (type === TYPES.WEDGE) return 4;
  return 1;
}

function getDimensions(piece) {
  if (piece.type !== TYPES.CUBOID) return [1, 1, 1];
  if (piece.rotation % 3 === 1) return [1, 1, 2];
  if (piece.rotation % 3 === 2) return [1, 2, 1];
  return [2, 1, 1];
}

function getOccupiedCells(piece) {
  const [width, height, depth] = getDimensions(piece);
  const cells = [];
  for (let dx = 0; dx < width; dx += 1) {
    for (let dy = 0; dy < height; dy += 1) {
      for (let dz = 0; dz < depth; dz += 1) {
        cells.push(`${piece.x + dx},${piece.y + dy},${piece.z + dz}`);
      }
    }
  }
  return cells;
}

function canPlace(piece, ignoreId = null) {
  const [width, height, depth] = getDimensions(piece);
  if (
    piece.x < 0 || piece.z < 0 || piece.y < 0 ||
    piece.x + width > BOARD_SIZE || piece.z + depth > BOARD_SIZE || piece.y + height > MAX_HEIGHT
  ) return false;
  const occupied = new Set(
    state.pieces
      .filter((current) => current.id !== ignoreId)
      .flatMap(getOccupiedCells)
  );
  if (getOccupiedCells(piece).some((cell) => occupied.has(cell))) return false;
  if (piece.y === 0) return true;
  const below = getOccupiedCells({ ...piece, y: piece.y - 1 });
  return below.some((cell) => occupied.has(cell));
}

function findDropHeight(x, z, type, rotation, ignoreId = null) {
  for (let y = 0; y < MAX_HEIGHT; y += 1) {
    if (canPlace({ type, rotation, x, y, z }, ignoreId)) return y;
  }
  return -1;
}

function startTrayDrag(event, type) {
  if (event.button !== undefined && event.button !== 0) return;
  const inventory = getInventory();
  const used = getUsedCounts();
  if ((inventory[type] || 0) - (used[type] || 0) <= 0) return;
  event.preventDefault();
  event.stopPropagation();
  state.selectedType = type;
  state.selectedRotation %= getRotationVariants(type);
  beginDrag(event, {
    type,
    rotation: state.selectedRotation,
    sourceId: null
  });
}

function startPieceDrag(event) {
  const piece = pickBuildPiece(event.clientX, event.clientY);
  if (!piece) return;
  event.preventDefault();
  event.stopPropagation();
  state.selectedType = piece.type;
  state.selectedRotation = piece.rotation || 0;
  beginDrag(event, {
    type: piece.type,
    rotation: piece.rotation || 0,
    sourceId: piece.id
  });
}

function beginDrag(event, drag) {
  state.drag = { ...drag, clientX: event.clientX, clientY: event.clientY, target: null, overTray: false };
  buildViewer.controls.enabled = false;
  dragGhost.dataset.shape = drag.type;
  dragGhost.textContent = getTypeLabel(drag.type);
  dragGhost.classList.add("show");
  updateDragPreview(event.clientX, event.clientY);
  const move = (moveEvent) => updateDragPreview(moveEvent.clientX, moveEvent.clientY);
  const end = (endEvent) => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    finishDrag(endEvent.clientX, endEvent.clientY);
  };
  const cancel = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    cancelDrag();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", cancel);
}

function updateDragPreview(clientX, clientY) {
  if (!state.drag) return;
  state.drag.clientX = clientX;
  state.drag.clientY = clientY;
  dragGhost.style.transform = `translate(${clientX - 24}px, ${clientY - 62}px) rotate(7deg)`;
  const element = document.elementFromPoint(clientX, clientY);
  state.drag.overTray = Boolean(element?.closest?.("#shapePile") && state.drag.sourceId);
  shapePile.classList.toggle("drop-target", state.drag.overTray);
  const cell = getBoardCell(clientX, clientY);
  if (!cell) {
    state.drag.target = null;
    dropPreview.visible = false;
    return;
  }
  const y = findDropHeight(cell.x, cell.z, state.drag.type, state.drag.rotation, state.drag.sourceId);
  if (y < 0) {
    state.drag.target = null;
    dropPreview.visible = false;
    return;
  }
  state.drag.target = { x: cell.x, y, z: cell.z };
  renderDropPreview({ ...state.drag.target, type: state.drag.type, rotation: state.drag.rotation });
}

function finishDrag() {
  if (!state.drag) return;
  const drag = state.drag;
  if (drag.overTray && drag.sourceId) {
    state.pieces = state.pieces.filter((piece) => piece.id !== drag.sourceId);
    showToast(getText("removed"));
  } else if (drag.target) {
    const next = {
      id: drag.sourceId || `piece-${nextPieceId++}`,
      type: drag.type,
      rotation: drag.rotation,
      ...drag.target
    };
    if (drag.sourceId) {
      state.pieces = state.pieces.map((piece) => piece.id === drag.sourceId ? next : piece);
    } else {
      state.pieces.push(next);
    }
  } else if (!drag.sourceId) {
    showToast(getText("invalid"));
  }
  cancelDrag();
  renderBuild();
}

function cancelDrag() {
  state.drag = null;
  buildViewer.controls.enabled = true;
  dropPreview.visible = false;
  shapePile.classList.remove("drop-target");
  dragGhost.classList.remove("show");
}

function getBoardCell(clientX, clientY) {
  const rect = buildViewer.renderer.domElement.getBoundingClientRect();
  if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, buildViewer.camera);
  const hit = raycaster.intersectObject(buildViewer.floor)[0];
  if (!hit) return null;
  const x = Math.floor(hit.point.x + BOARD_SIZE / 2);
  const z = Math.floor(hit.point.z + BOARD_SIZE / 2);
  if (x < 0 || x >= BOARD_SIZE || z < 0 || z >= BOARD_SIZE) return null;
  return { x, z };
}

function pickBuildPiece(clientX, clientY) {
  const rect = buildViewer.renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, buildViewer.camera);
  const hit = raycaster.intersectObjects(buildViewer.pieceGroup.children, true)
    .find((entry) => entry.object.userData.pieceId || entry.object.parent?.userData.pieceId);
  const id = hit?.object.userData.pieceId || hit?.object.parent?.userData.pieceId;
  return state.pieces.find((piece) => piece.id === id) || null;
}

function renderDropPreview(piece) {
  clearGroup(dropPreview);
  const mesh = createPieceMesh(piece, false, previewMaterial);
  dropPreview.add(mesh);
  dropPreview.visible = true;
}

function checkAnswer() {
  const problem = getProblem();
  if (problem.creative) {
    if (state.pieces.length < 5 || !isConnectedBuild()) {
      showToast(getText("needMore"));
      return;
    }
    showSuccess();
    return;
  }
  const answer = normalizePieces(problem.pieces);
  const build = normalizePieces(state.pieces);
  if (answer.length !== build.length || !answer.every((value, index) => value === build[index])) {
    showToast(getText("wrong"));
    return;
  }
  showSuccess();
}

function normalizePieces(pieces) {
  return pieces
    .map((piece) => `${piece.type}:${piece.x}:${piece.y}:${piece.z}:${piece.rotation || 0}`)
    .sort();
}

function isConnectedBuild() {
  if (!state.pieces.length) return false;
  const cells = new Set(state.pieces.flatMap(getOccupiedCells));
  const queue = [cells.values().next().value];
  const visited = new Set(queue);
  while (queue.length) {
    const [x, y, z] = queue.shift().split(",").map(Number);
    [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].forEach(([dx,dy,dz]) => {
      const key = `${x + dx},${y + dy},${z + dz}`;
      if (cells.has(key) && !visited.has(key)) {
        visited.add(key);
        queue.push(key);
      }
    });
  }
  return visited.size === cells.size;
}

function showSuccess() {
  if (state.successPending) return;
  state.successPending = true;
  const words = ["GOOD JOB!", "GREAT JOB!", "SUCCESS!"];
  const burst = document.querySelector("#successBurst");
  burst.querySelector("strong").textContent = words[Math.floor(Math.random() * words.length)];
  burst.classList.remove("show");
  requestAnimationFrame(() => burst.classList.add("show"));
  showToast(getText("success"));
  speak(getText("success"));
  window.setTimeout(() => {
    state.successPending = false;
  }, 1500);
}

function nextProblem() {
  const problems = getProblems();
  state.problemIndex = (state.problemIndex + 1) % problems.length;
  loadProblem();
}

function resetBuild() {
  state.pieces = [];
  cancelDrag();
  renderBuild();
}

function setView(mode) {
  [targetViewer, buildViewer].forEach((viewer) => {
    if (mode === "front") viewer.camera.position.set(0, 3.4, 8.8);
    if (mode === "top") viewer.camera.position.set(0.01, 10.4, 0.01);
    viewer.controls.target.set(0, 1.15, 0);
    viewer.controls.update();
  });
}

async function captureBuild() {
  buildViewer.renderer.render(buildViewer.scene, buildViewer.camera);
  const blob = await new Promise((resolve) => buildViewer.renderer.domElement.toBlob(resolve, "image/png"));
  if (!blob) return;
  const file = new File([blob], `gfield-shape-${Date.now()}.png`, { type: "image/png" });
  const canUseMobileShare = navigator.maxTouchPoints > 0 && navigator.share && navigator.canShare?.({ files: [file] });
  if (canUseMobileShare) {
    try {
      await navigator.share({ title: "GFIELD Cube Town", files: [file] });
      return;
    } catch (error) {
      if (error?.name !== "AbortError") console.warn("Native share failed; saving PNG instead.", error);
    }
  }
  downloadBlob(blob, file.name);
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function renderLevelOptions() {
  const host = document.querySelector("#levelOptions");
  host.replaceChildren();
  for (let level = 1; level <= 5; level += 1) {
    const button = document.createElement("button");
    const title = document.createElement("strong");
    const stars = document.createElement("span");
    const count = document.createElement("small");
    button.type = "button";
    button.className = "level-option";
    button.classList.toggle("active", level === state.level);
    title.textContent = `레벨 ${level}`;
    stars.textContent = `${"★".repeat(level)}${"☆".repeat(5 - level)}`;
    count.textContent = level <= 3 ? "10문제" : "5문제";
    button.append(title, stars, count);
    button.addEventListener("click", () => {
      if (level <= 3) {
        window.location.href = `../../?level=${level}`;
      } else {
        state.level = level;
        state.problemIndex = 0;
        document.querySelector("#levelDialog").hidden = true;
        renderLevelOptions();
        loadProblem();
      }
    });
    host.appendChild(button);
  }
}

function openLevelDialog() {
  document.querySelector("#levelDialog").hidden = false;
}

function closeLevelDialog() {
  document.querySelector("#levelDialog").hidden = true;
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === lang));
  document.querySelector("#nextStep").textContent = getText("next");
  document.querySelector("#resetBuild").textContent = getText("reset");
  document.querySelector("#rotatePiece").textContent = getText("rotate");
  document.querySelector("#viewFront").textContent = getText("front");
  document.querySelector("#viewTop").textContent = getText("top");
  document.querySelector("#captureBuild").textContent = getText("capture");
  document.querySelector("#audioToggle").textContent = getText(state.audio ? "audioOn" : "audioOff");
  refreshBoardLabels(targetViewer);
  refreshBoardLabels(buildViewer);
  loadProblem();
}

function toggleAudio() {
  state.audio = !state.audio;
  document.querySelector("#audioToggle").setAttribute("aria-pressed", String(state.audio));
  document.querySelector("#audioToggle").textContent = getText(state.audio ? "audioOn" : "audioOff");
  if (state.audio) speak(document.querySelector("#guideMessage").textContent);
  else window.speechSynthesis?.cancel();
}

function setGuide(key) {
  const message = getText(key);
  document.querySelector("#guideMessage").textContent = message;
  speak(message);
}

function speak(message) {
  if (!state.audio || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[state.lang];
  utterance.rate = 0.9;
  utterance.pitch = 0.9;
  window.speechSynthesis.speak(utterance);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function addEvents() {
  window.addEventListener("resize", resizeAll);
  buildViewer.renderer.domElement.addEventListener("pointerdown", startPieceDrag, true);
  document.querySelector("#checkAnswer").addEventListener("click", checkAnswer);
  document.querySelector("#nextStep").addEventListener("click", nextProblem);
  document.querySelector("#resetBuild").addEventListener("click", resetBuild);
  document.querySelector("#rotatePiece").addEventListener("click", rotateSelected);
  document.querySelector("#viewFront").addEventListener("click", () => setView("front"));
  document.querySelector("#viewTop").addEventListener("click", () => setView("top"));
  document.querySelector("#captureBuild").addEventListener("click", captureBuild);
  document.querySelector("#topLevelPickerButton").addEventListener("click", openLevelDialog);
  document.querySelector("#closeLevelDialog").addEventListener("click", closeLevelDialog);
  document.querySelector("#levelDialog").addEventListener("click", (event) => {
    if (event.target.id === "levelDialog") closeLevelDialog();
  });
  document.querySelector("#audioToggle").addEventListener("click", toggleAudio);
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
}

function createViewer(host, interactive) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(6.4, 5.7, 7.2);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  host.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 5.5;
  controls.maxDistance = 14;
  controls.maxPolarAngle = Math.PI * .49;
  controls.target.set(0, 1.1, 0);

  scene.add(new THREE.HemisphereLight(0xfff9ea, 0x8d745d, 2.35));
  const key = new THREE.DirectionalLight(0xfff0cf, 3.1);
  key.position.set(5, 9, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xb8d8ff, 1.1);
  fill.position.set(-5, 4, -3);
  scene.add(fill);

  const board = createBoard();
  scene.add(board);
  const grid = new THREE.GridHelper(BOARD_SIZE, BOARD_SIZE, 0x9b6c38, 0xd6af75);
  grid.position.y = .035;
  scene.add(grid);
  const labels = createBoardLabels();
  scene.add(labels);
  const pieceGroup = new THREE.Group();
  scene.add(pieceGroup);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_SIZE, BOARD_SIZE),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = .04;
  scene.add(floor);
  return { scene, camera, renderer, controls, host, pieceGroup, floor, labels, interactive };
}

function createBoard() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new RoundedBoxGeometry(BOARD_SIZE + .8, .25, BOARD_SIZE + .8, 8, .16),
    makeMaterial(0xc78847)
  );
  base.position.y = -.16;
  base.receiveShadow = true;
  base.castShadow = true;
  group.add(base);
  const inset = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD_SIZE + .04, BOARD_SIZE + .04),
    makeMaterial(0xf2cf8a)
  );
  inset.rotation.x = -Math.PI / 2;
  inset.position.y = -.02;
  inset.receiveShadow = true;
  group.add(inset);
  return group;
}

function createPieceMesh(piece, interactive, materialOverride = null) {
  const [width, height, depth] = getDimensions(piece);
  let geometry;
  if (piece.type === TYPES.WEDGE) geometry = createWedgeGeometry();
  else if (piece.type === TYPES.PYRAMID) geometry = new THREE.ConeGeometry(.66, .94, 4);
  else if (piece.type === TYPES.CONE) geometry = new THREE.ConeGeometry(.47, .94, 24);
  else geometry = new RoundedBoxGeometry(width * .94, height * .94, depth * .94, 5, .065);
  const material = materialOverride || materials[piece.type] || materials.cube;
  const mesh = new THREE.Mesh(geometry, material);
  const offset = (BOARD_SIZE - 1) / 2;
  mesh.position.x = piece.x + (width - 1) / 2 - offset;
  mesh.position.z = piece.z + (depth - 1) / 2 - offset;
  mesh.position.y = piece.y + height / 2;
  if (piece.type === TYPES.WEDGE) mesh.rotation.y = (piece.rotation || 0) * Math.PI / 2;
  if (piece.type === TYPES.PYRAMID) mesh.rotation.y = Math.PI / 4;
  mesh.castShadow = !materialOverride;
  mesh.receiveShadow = !materialOverride;
  mesh.userData.pieceId = piece.id;
  mesh.userData.kind = interactive ? "build-piece" : "target-piece";
  return mesh;
}

function createWedgeGeometry() {
  const vertices = new Float32Array([
    -.47,-.47,-.47,  .47,-.47,-.47,  0,.47,-.47,
    -.47,-.47,.47,   .47,-.47,.47,   0,.47,.47
  ]);
  const indices = [
    0,1,2, 5,4,3,
    0,3,4, 0,4,1,
    1,4,5, 1,5,2,
    2,5,3, 2,3,0
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function makeMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    map: woodTexture,
    bumpMap: woodTexture,
    bumpScale: .018,
    roughness: .46,
    metalness: .015,
    clearcoat: .13,
    clearcoatRoughness: .48
  });
}

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 384, 384);
  gradient.addColorStop(0, "#ffe4aa");
  gradient.addColorStop(.48, "#dfae69");
  gradient.addColorStop(1, "#a96531");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 384, 384);
  for (let index = 0; index < 58; index += 1) {
    const y = index * 6.8;
    context.beginPath();
    context.moveTo(-10, y);
    for (let x = -10; x < 400; x += 16) {
      context.lineTo(x, y + Math.sin(x * .035 + index) * 3.2);
    }
    context.strokeStyle = index % 3 ? "rgba(255,248,220,.18)" : "rgba(89,47,18,.16)";
    context.lineWidth = 1;
    context.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createBoardLabels() {
  const group = new THREE.Group();
  group.userData.kind = "board-labels";
  const front = createLabel(getText("front"));
  front.position.set(0, .02, BOARD_SIZE / 2 + .28);
  front.rotation.x = -Math.PI / 2;
  group.add(front);
  const right = createLabel(getText("right"));
  right.position.set(BOARD_SIZE / 2 + .28, .02, 0);
  right.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
  group.add(right);
  return group;
}

function createLabel(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(73,42,18,.86)";
  context.font = "900 38px sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 128, 48);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.05, .38), material);
  mesh.renderOrder = 900;
  return mesh;
}

function refreshBoardLabels(viewer) {
  viewer.scene.remove(viewer.labels);
  viewer.labels = createBoardLabels();
  viewer.scene.add(viewer.labels);
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    if (child.material !== previewMaterial && !Object.values(materials).includes(child.material)) child.material?.dispose?.();
    child.geometry?.dispose?.();
  }
}

function resizeAll() {
  [targetViewer, buildViewer].forEach((viewer) => {
    const rect = viewer.host.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    viewer.camera.aspect = width / height;
    viewer.camera.fov = viewer === targetViewer && width / height < .9 ? 52 : 40;
    viewer.camera.updateProjectionMatrix();
    viewer.renderer.setSize(width, height, false);
  });
}

function animate() {
  requestAnimationFrame(animate);
  targetViewer.controls.update();
  buildViewer.controls.update();
  targetViewer.renderer.render(targetViewer.scene, targetViewer.camera);
  buildViewer.renderer.render(buildViewer.scene, buildViewer.camera);
}
