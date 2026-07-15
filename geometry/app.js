import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const translations = {
  ko: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "똑같이 쌓기",
    copyInstruction: "더미에서 하나씩 끌어 와 3D 판의 빨간 자리에 내려놓아 보세요.",
    target: "문제 모양",
    myBuild: "내가 만든 모양",
    countLabel: "문제",
    check: "확인",
    next: "다음 문제",
    reset: "처음부터",
    front: "앞",
    top: "위",
    free: "돌려보기",
    resetView: "보기 초기화",
    successPop: "성공!",
    successGood: "Good job!",
    successGreat: "Great job!",
    singleCube: "한 개",
    correct: "잘했어요! 다음 문제로 가요.",
    wrong: "조금 달라요. 위치와 높이를 다시 살펴보세요.",
    counted: "{count}개",
    done: "모두 {count}개예요!",
    buildFirst: "먼저 문제 모양과 똑같이 만들어 보세요.",
    topOnly: "맨 위에 있는 쌓기나무부터 눌러 보세요.",
    pileLabel: "쌓기나무 더미",
    emptyHand: "하나씩 가져와요",
    inHand: "손에 하나 있어요",
    boardLabel: "3D 판의 빨간 자리에 내려놓아요",
    pileFirst: "먼저 더미에서 쌓기나무를 하나 가져오세요.",
    maxHeight: "여기는 4층까지 쌓을 수 있어요.",
    cellLabel: "{row}행 {col}열, 높이 {height}",
    returnToPile: "다른 자리로 옮기거나 더미에 내려놓을 수 있어요.",
    levelProgress: "레벨 {level} · {current}/{total}",
    guideStart: "문제 모양을 보고 더미에서 하나씩 가져와 보자!",
    guideHold: "좋아, 쌓기나무 하나를 가져왔어. 빨간 자리에 내려놓자!",
    guideDrop: "거기 좋아! 손을 떼면 그 자리에 올라가.",
    guideMove: "블록은 다른 자리로 옮기거나 더미에 다시 놓을 수 있어.",
    guideWrong: "조금 달라. 문제 모양의 위치와 높이를 다시 볼까?",
    guideSuccess: "Great job! 정말 잘했어. 다음 문제로 가자!",
    guideNext: "새 문제야. 이번 모양도 차근차근 만들어 보자.",
    guideTitle: "docssam",
    guideDragged: "좋아, 여기서 도와줄게!",
    audioOn: "음성 켜짐",
    audioOff: "음성 켜기"
  },
  zh: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "照样搭",
    copyInstruction: "从积木堆一次拖一个，放到 3D 板上的红色位置。",
    target: "题目",
    myBuild: "我的作品",
    countLabel: "题目",
    check: "检查",
    next: "下一题",
    reset: "重来",
    front: "前面",
    top: "上面",
    free: "旋转",
    resetView: "重置视角",
    successPop: "成功！",
    successGood: "Good job!",
    successGreat: "Great job!",
    singleCube: "一个",
    correct: "做得好！进入下一题。",
    wrong: "有一点不一样。再看看位置和高度。",
    counted: "{count}个",
    done: "一共有 {count} 个！",
    buildFirst: "先搭成和题目一样的形状吧。",
    topOnly: "请先点最上面的积木。",
    pileLabel: "积木堆",
    emptyHand: "一次拿一个",
    inHand: "手里有一个",
    boardLabel: "放到 3D 板上的红色位置",
    pileFirst: "请先从积木堆拿一个。",
    maxHeight: "这里最多可以搭 4 层。",
    cellLabel: "第 {row} 行第 {col} 列，高度 {height}",
    returnToPile: "可以移到别的位置，也可以放回积木堆。",
    levelProgress: "等级 {level} · {current}/{total}",
    guideStart: "看看题目形状，从积木堆一次拿一个吧！",
    guideHold: "很好，拿到一个积木了。放到红色位置吧！",
    guideDrop: "这里不错！松手就会放上去。",
    guideMove: "积木可以移到别的位置，也可以放回积木堆。",
    guideWrong: "有一点不一样。再看看位置和高度吧。",
    guideSuccess: "Great job! 做得很好，进入下一题！",
    guideNext: "新题目来了。我们一步一步搭吧。",
    guideTitle: "docssam",
    guideDragged: "好，我就在这里帮你！",
    audioOn: "语音开",
    audioOff: "语音"
  },
  ja: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "同じ形を作る",
    copyInstruction: "積み木の山からひとつずつ動かして、3D台の赤い場所に置きましょう。",
    target: "もんだい",
    myBuild: "自分の形",
    countLabel: "もんだい",
    check: "確認",
    next: "次の問題",
    reset: "はじめから",
    front: "前",
    top: "上",
    free: "回す",
    resetView: "表示をリセット",
    successPop: "成功！",
    successGood: "Good job!",
    successGreat: "Great job!",
    singleCube: "ひとつ",
    correct: "よくできました！次のもんだいへ進みます。",
    wrong: "少しちがいます。場所と高さをもう一度見てみましょう。",
    counted: "{count}こ",
    done: "ぜんぶで {count}こです！",
    buildFirst: "まず、もんだいと同じ形を作りましょう。",
    topOnly: "いちばん上の積み木から押しましょう。",
    pileLabel: "積み木の山",
    emptyHand: "ひとつずつ取ろう",
    inHand: "手にひとつあります",
    boardLabel: "3D台の赤い場所に置こう",
    pileFirst: "まず積み木の山からひとつ取りましょう。",
    maxHeight: "ここは4段まで積めます。",
    cellLabel: "{row}行 {col}列、高さ {height}",
    returnToPile: "別の場所へ動かすか、積み木の山にもどせます。",
    levelProgress: "レベル {level} · {current}/{total}",
    guideStart: "もんだいの形を見て、積み木の山からひとつずつ取ろう！",
    guideHold: "いいね、積み木をひとつ持ったよ。赤い場所に置こう！",
    guideDrop: "そこがいいね！手をはなすと置けるよ。",
    guideMove: "積み木は別の場所へ動かしたり、山にもどしたりできるよ。",
    guideWrong: "少しちがうね。場所と高さをもう一度見てみよう。",
    guideSuccess: "Great job! とてもよくできたね。次へ進もう！",
    guideNext: "新しいもんだいだよ。ゆっくり作ってみよう。",
    guideTitle: "docssam",
    guideDragged: "いいね、ここで手伝うよ！",
    audioOn: "音声オン",
    audioOff: "音声"
  },
  en: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "Copy Build",
    copyInstruction: "Drag one cube at a time from the pile and drop it on the red spot on the 3D board.",
    target: "Challenge",
    myBuild: "My Build",
    countLabel: "Step",
    check: "Check",
    next: "Next",
    reset: "Reset",
    front: "Front",
    top: "Top",
    free: "Free View",
    resetView: "Reset View",
    successPop: "Success!",
    successGood: "Good job!",
    successGreat: "Great job!",
    singleCube: "One cube",
    correct: "Great job! Moving to the next challenge.",
    wrong: "Something is different. Check the position and height again.",
    counted: "{count}",
    done: "There are {count} cubes!",
    buildFirst: "First, build the same shape as the challenge.",
    topOnly: "Tap the top cube first.",
    pileLabel: "Cube pile",
    emptyHand: "Take one cube",
    inHand: "One cube in hand",
    boardLabel: "Drop it on the red spot on the 3D board",
    pileFirst: "Take one cube from the pile first.",
    maxHeight: "This spot can hold up to 4 cubes.",
    cellLabel: "row {row}, column {col}, height {height}",
    returnToPile: "Move it to another spot or drop it on the pile to remove it.",
    levelProgress: "Level {level} · {current}/{total}",
    guideStart: "Look at the challenge, then take one cube from the pile!",
    guideHold: "Nice, you picked up one cube. Drop it on the red spot!",
    guideDrop: "That spot works! Let go to place it there.",
    guideMove: "You can move a cube to another spot or drop it back on the pile.",
    guideWrong: "Something is different. Check the position and height again.",
    guideSuccess: "Great job! You built it. On to the next challenge!",
    guideNext: "New challenge. Build it one cube at a time.",
    guideTitle: "docssam",
    guideDragged: "Okay, I will help from here!",
    audioOn: "Voice on",
    audioOff: "Voice"
  }
};

const levelPickerTranslations = {
  ko: {
    levelSelect: "레벨 선택",
    levelNumber: "레벨 {level}",
    levelProblems: "{count}문제",
    closeLevel: "닫기",
    guideLevelSelect: "다음에 도전할 레벨을 골라 보자!"
  },
  zh: {
    levelSelect: "选择关卡",
    levelNumber: "第 {level} 关",
    levelProblems: "{count} 题",
    closeLevel: "关闭",
    guideLevelSelect: "选择接下来要挑战的关卡吧！"
  },
  ja: {
    levelSelect: "レベルを選ぶ",
    levelNumber: "レベル {level}",
    levelProblems: "{count}もん",
    closeLevel: "閉じる",
    guideLevelSelect: "つぎにチャレンジするレベルをえらぼう！"
  },
  en: {
    levelSelect: "Choose level",
    levelNumber: "Level {level}",
    levelProblems: "{count} challenges",
    closeLevel: "Close",
    guideLevelSelect: "Choose the level you want to try next!"
  }
};

Object.entries(levelPickerTranslations).forEach(([lang, labels]) => {
  Object.assign(translations[lang], labels);
});

const speechSettings = {
  ko: { lang: "ko-KR", rate: 0.9, pitch: 0.92 },
  zh: { lang: "zh-CN", rate: 0.9, pitch: 0.92 },
  ja: { lang: "ja-JP", rate: 0.9, pitch: 0.92 },
  en: { lang: "en-US", rate: 0.9, pitch: 0.9 }
};

const maleVoiceHints = {
  ko: /\bmale\b|injoon|hyunsu|bongjin|minjun|seojun/i,
  zh: /\bmale\b|yunxi|yunjian|yunyang|kangkang|zhiwei/i,
  ja: /\bmale\b|keita|ichiro|takumi|naoki|daichi/i,
  en: /\bmale\b|guy|david|mark|george|ryan|christopher|james|daniel/i
};

const femaleVoiceHints = /\bfemale\b|sunhi|xiaoxiao|nanami|zira|jenny|aria|susan|samantha/i;

const levels = [
  {
    level: 1,
    stars: 1,
    problems: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [1, 0, 1],
        [0, 1, 0],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ]
  },
  {
    level: 2,
    stars: 2,
    problems: [
      [
        [0, 1, 0],
        [1, 2, 1],
        [0, 1, 0]
      ],
      [
        [1, 2, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 2, 1],
        [1, 1, 0],
        [0, 1, 0]
      ],
      [
        [1, 1, 0],
        [2, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [2, 2, 1],
        [0, 0, 1]
      ]
    ]
  },
  {
    level: 3,
    stars: 3,
    problems: [
      [
        [1, 0, 2],
        [1, 2, 1],
        [0, 0, 1]
      ],
      [
        [0, 2, 0],
        [1, 3, 1],
        [0, 1, 0]
      ],
      [
        [2, 1, 0],
        [1, 2, 2],
        [0, 0, 1]
      ],
      [
        [0, 1, 3],
        [1, 2, 1],
        [1, 0, 0]
      ],
      [
        [1, 2, 1],
        [0, 3, 2],
        [1, 0, 1]
      ]
    ]
  }
];

const colors = {
  cube: 0xe5bf78,
  cubeSide: 0xc99858,
  green: 0x73bd81,
  yellow: 0xf0ce4e,
  blue: 0x4ea6ce,
  rose: 0xdf6d71,
  orange: 0xeea061,
  red: 0xd86f73
};

const state = {
  lang: "ko",
  levelIndex: 0,
  problemIndex: 0,
  grid: emptyGrid(),
  countMode: false,
  counted: 0,
  holdingCube: false,
  draggingCube: false,
  draggingFromBoard: null,
  dragCell: null,
  pileTarget: false,
  lastDragAt: 0,
  dragLiftY: 0,
  successPending: false,
  successTimer: null,
  falling: [],
  audioEnabled: false,
  guideKey: "guideStart",
  speechVoices: []
};

const targetScene = createViewer(document.querySelector("#targetCanvas"), false);
const buildScene = createViewer(document.querySelector("#buildCanvas"), true);
linkViewerControls(targetScene, buildScene);
const targetGroup = new THREE.Group();
const buildGroup = new THREE.Group();
targetScene.scene.add(targetGroup);
buildScene.scene.add(buildGroup);
const dropMarker = createDropMarker();
buildScene.scene.add(dropMarker);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPoint = null;

init();

function init() {
  applyLanguage();
  addEvents();
  initGuideDrag();
  initGuideLife();
  loadProblem();
  animate();
}

function createViewer(container, interactive) {
  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(5.4, 5.1, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 12;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 1.25, 0);
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_ROTATE
  };

  const ambient = new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(5, 8, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 7.2),
    new THREE.MeshStandardMaterial({ color: 0xf3ead5, roughness: 0.85 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.position.y = -0.02;
  scene.add(floor);

  const grid = new THREE.GridHelper(3, 3, 0x9b8b75, 0xd3c6b2);
  grid.position.y = 0.01;
  scene.add(grid);

  const frontIndicator = createFrontIndicator(t("front"));
  scene.add(frontIndicator);

  if (interactive) {
    renderer.domElement.addEventListener("pointerdown", onPointerDown, { capture: true });
    renderer.domElement.addEventListener("pointerup", onPointerUp);
  }

  const viewer = { scene, camera, renderer, controls, container, frontIndicator, sun };
  resizeViewer(viewer);
  return viewer;
}

function createFrontIndicator(label) {
  const group = new THREE.Group();
  group.userData = { kind: "front-indicator" };

  const arrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 0, -1),
    new THREE.Vector3(0, 0.1, 1.62),
    0.5,
    0xd94e4e,
    0.18,
    0.12
  );
  arrow.line.material.depthTest = false;
  arrow.line.material.depthWrite = false;
  arrow.cone.material.depthTest = false;
  arrow.cone.material.depthWrite = false;
  arrow.line.renderOrder = 900;
  arrow.cone.renderOrder = 900;
  group.add(arrow);

  const labelSprite = createFrontLabelSprite(label);
  labelSprite.position.set(0, 0.48, 1.88);
  group.add(labelSprite);
  return group;
}

function createFrontLabelSprite(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 112;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(255, 255, 255, 0.96)";
  context.strokeStyle = "#d94e4e";
  context.lineWidth = 7;
  context.beginPath();
  context.roundRect(10, 10, 236, 92, 24);
  context.fill();
  context.stroke();
  context.fillStyle = "#b52f36";
  context.font = "800 48px 'Noto Sans KR', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 128, 57);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.98, 0.43, 1);
  sprite.renderOrder = 901;
  sprite.userData = { kind: "front-label" };
  return sprite;
}

function refreshFrontIndicator(viewer) {
  if (viewer.frontIndicator) {
    viewer.frontIndicator.traverse((node) => {
      node.material?.map?.dispose?.();
      node.material?.dispose?.();
      node.geometry?.dispose?.();
    });
    viewer.scene.remove(viewer.frontIndicator);
  }
  viewer.frontIndicator = createFrontIndicator(t("front"));
  viewer.scene.add(viewer.frontIndicator);
}

function linkViewerControls(first, second) {
  let syncing = false;
  const sync = (source, destination) => {
    if (syncing) return;
    syncing = true;
    destination.camera.position.copy(source.camera.position);
    destination.camera.quaternion.copy(source.camera.quaternion);
    destination.camera.up.copy(source.camera.up);
    destination.controls.target.copy(source.controls.target);
    destination.controls.update();
    syncing = false;
  };
  first.controls.addEventListener("change", () => sync(first, second));
  second.controls.addEventListener("change", () => sync(second, first));
}

function addEvents() {
  window.addEventListener("resize", () => {
    resizeViewer(targetScene);
    resizeViewer(buildScene);
  });

  if ("speechSynthesis" in window) {
    state.speechVoices = window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      state.speechVoices = window.speechSynthesis.getVoices();
    });
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      applyLanguage();
    });
  });

  document.querySelector("#checkAnswer").addEventListener("click", checkAnswer);
  document.querySelector("#resetBuild").addEventListener("click", resetBuild);
  document.querySelector("#resetView").addEventListener("click", resetView);
  document.querySelector("#nextStep").addEventListener("click", nextProblem);
  document.querySelector("#levelPickerButton").addEventListener("click", openLevelPicker);
  document.querySelector("#closeLevelDialog").addEventListener("click", closeLevelPicker);
  document.querySelector("#levelDialog").addEventListener("click", (event) => {
    if (event.target.id === "levelDialog") closeLevelPicker();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLevelPicker();
  });
  document.querySelector("#viewFront").addEventListener("click", () => setView("front"));
  document.querySelector("#viewTop").addEventListener("click", () => setView("top"));
  document.querySelector("#viewFree").addEventListener("click", () => setView("free"));
  document.querySelector("#cubePile").addEventListener("click", takeFromPile);
  document.querySelector("#cubePile").addEventListener("pointerdown", startPileDrag);
  document.querySelector("#audioToggle").addEventListener("pointerdown", (event) => event.stopPropagation());
  document.querySelector("#audioToggle").addEventListener("click", toggleAudio);
}

function loadProblem() {
  clearPendingSuccess();
  state.countMode = false;
  state.counted = 0;
  state.holdingCube = false;
  state.draggingCube = false;
  state.draggingFromBoard = null;
  state.dragCell = null;
  state.pileTarget = false;
  state.grid = emptyGrid();
  state.falling = [];
  document.querySelector("#modeTitle").textContent = t("copyMode");
  document.querySelector("#instruction").textContent = t("copyInstruction");
  updateStepDisplay();

  renderTarget();
  renderBuild();
  updateBuilderControls();
  setGuide("guideStart");
}

function renderTarget() {
  clearGroup(targetGroup);
  const problem = getProblem();
  setStars(getLevel().stars);
  renderGrid(targetGroup, problem, false);
}

function renderBuild() {
  clearGroup(buildGroup);
  renderBaseTargets(buildGroup);
  renderGrid(buildGroup, state.grid, true);
  updateBuilderControls();
}

function renderGrid(group, grid, interactive) {
  grid.forEach((row, z) => {
    row.forEach((height, x) => {
      for (let y = 0; y < height; y += 1) {
        const cube = createCube(colors.cube);
        cube.position.set(x - 1, y + 0.5, z - 1);
        cube.userData = { kind: "cube", x, z, y, interactive };
        group.add(cube);
      }
    });
  });
}

function renderBaseTargets(group) {
  for (let z = 0; z < 3; z += 1) {
    for (let x = 0; x < 3; x += 1) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(0.92, 0.04, 0.92),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.9,
          transparent: true,
          opacity: 0.38
        })
      );
      marker.position.set(x - 1, 0.03, z - 1);
      marker.userData = { kind: "cell", x, z, interactive: true };
      group.add(marker);
    }
  }
}

function createCube(color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.96, 0.96, 0.96),
    new THREE.MeshStandardMaterial({ color, roughness: 0.64, metalness: 0.02 })
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: 0x8b765b, transparent: true, opacity: 0.48 })
  );
  mesh.add(edges);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createDropMarker() {
  const marker = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1.01, 1.01, 1.01);
  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xdf4d4d,
      transparent: true,
      opacity: 0.28,
      depthTest: false,
      depthWrite: false
    })
  );
  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: 0xff2638,
      transparent: true,
      opacity: 0.98,
      depthTest: false,
      depthWrite: false
    })
  );
  fill.renderOrder = 1000;
  outline.renderOrder = 1001;
  marker.add(fill, outline);
  marker.visible = false;
  marker.userData = { kind: "drop-marker" };
  return marker;
}

function onPointerDown(event) {
  downPoint = { x: event.clientX, y: event.clientY };
  if (state.countMode || state.draggingCube || state.successPending) return;
  if (state.holdingCube) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return;
  }
  const cube = getTopCubeFromCanvasPoint(event.clientX, event.clientY);
  if (!cube) return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  startBuildCubeDrag(event, cube.userData.x, cube.userData.z);
}

function onPointerUp(event) {
  if (!downPoint) return;
  const moved = Math.hypot(event.clientX - downPoint.x, event.clientY - downPoint.y);
  downPoint = null;
  if (moved > 8) return;

  if (state.holdingCube && !state.draggingCube && !state.draggingFromBoard) {
    const cell = getCellFromCanvasPoint(event.clientX, event.clientY);
    if (!cell) return;
    placeAt(cell.x, cell.z);
    return;
  }

  const rect = buildScene.renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, buildScene.camera);
  const hits = raycaster.intersectObjects(buildGroup.children, true);
  const hit = hits.find((item) => item.object.userData.kind || item.object.parent?.userData.kind);
  if (!hit) return;
  const object = hit.object.userData.kind ? hit.object : hit.object.parent;

  if (state.countMode) {
    countCube(object);
    return;
  }
}

function getCellFromHit(object, point) {
  if (object.userData.kind === "cell") {
    return { x: object.userData.x, z: object.userData.z };
  }
  if (object.userData.kind === "cube") {
    return { x: object.userData.x, z: object.userData.z };
  }
  const x = Math.round(point.x + 1);
  const z = Math.round(point.z + 1);
  if (x < 0 || x > 2 || z < 0 || z > 2) return null;
  return { x, z };
}

function placeAt(x, z) {
  if (state.successPending) return;
  if (state.grid[z][x] >= 4) {
    showToast(t("maxHeight"));
    return;
  }
  state.grid[z][x] += 1;
  state.holdingCube = false;
  renderBuild();
  checkAutoSuccess();
}

function countCube(object) {
  if (object.userData.kind !== "cube") return;
  const { x, z, y } = object.userData;
  if (state.grid[z][x] - 1 !== y) {
    showToast(t("topOnly"));
    return;
  }
  state.grid[z][x] -= 1;
  object.userData.falling = true;
  state.falling.push({ mesh: object, velocity: 0.045 });
  updateBuilderControls();
}

function checkAnswer() {
  if (state.countMode) {
    showToast(t("buildFirst"));
    return;
  }
  const problem = getProblem();
  if (!sameGrid(problem, state.grid)) {
    setGuide("guideWrong");
    showToast(t("wrong"));
    return;
  }
  state.countMode = false;
  state.counted = 0;
  state.holdingCube = false;
  updateStepDisplay();
  updateBuilderControls();
  showSuccessThenNext();
}

function checkAutoSuccess() {
  if (state.countMode) return;
  if (!sameGrid(getProblem(), state.grid)) {
    clearPendingSuccess();
    return;
  }
  if (state.successPending) return;
  state.successPending = true;
  state.successTimer = window.setTimeout(() => {
    state.successTimer = null;
    if (!sameGrid(getProblem(), state.grid)) {
      state.successPending = false;
      return;
    }
    showSuccessThenNext();
  }, 220);
}

function clearPendingSuccess() {
  if (state.successTimer !== null) {
    window.clearTimeout(state.successTimer);
    state.successTimer = null;
  }
  state.successPending = false;
}

function resetBuild() {
  clearPendingSuccess();
  state.grid = emptyGrid();
  state.countMode = false;
  state.counted = 0;
  state.holdingCube = false;
  state.falling = [];
  updateStepDisplay();
  renderBuild();
}

function nextProblem() {
  const level = getLevel();
  if (state.problemIndex < level.problems.length - 1) {
    state.problemIndex += 1;
  } else {
    clearPendingSuccess();
    openLevelPicker();
    setGuide("guideLevelSelect");
    return;
  }
  resetBuild();
  renderTarget();
  setGuide("guideNext");
}

function openLevelPicker() {
  renderLevelOptions();
  const dialog = document.querySelector("#levelDialog");
  dialog.hidden = false;
  dialog.querySelector(".level-option.active")?.focus();
}

function closeLevelPicker() {
  document.querySelector("#levelDialog").hidden = true;
}

function selectLevel(index) {
  state.levelIndex = index;
  state.problemIndex = 0;
  closeLevelPicker();
  loadProblem();
}

function renderLevelOptions() {
  const options = document.querySelector("#levelOptions");
  options.replaceChildren();
  levels.forEach((level, index) => {
    const button = document.createElement("button");
    const title = document.createElement("strong");
    const stars = document.createElement("span");
    const problemCount = document.createElement("small");

    button.type = "button";
    button.className = "level-option";
    button.classList.toggle("active", index === state.levelIndex);
    button.setAttribute("aria-pressed", String(index === state.levelIndex));
    title.textContent = t("levelNumber").replace("{level}", level.level);
    stars.textContent = "★".repeat(level.stars) + "☆".repeat(Math.max(0, levels.length - level.stars));
    problemCount.textContent = t("levelProblems").replace("{count}", level.problems.length);
    button.append(title, stars, problemCount);
    button.addEventListener("click", () => selectLevel(index));
    options.appendChild(button);
  });
}

function getProblem() {
  return getLevel().problems[state.problemIndex];
}

function getLevel() {
  return levels[state.levelIndex];
}

function updateStepDisplay() {
  const level = getLevel();
  document.querySelector("#countValue").textContent = t("levelProgress")
    .replace("{level}", level.level)
    .replace("{current}", state.problemIndex + 1)
    .replace("{total}", level.problems.length);
}

function setView(view) {
  const viewers = [targetScene, buildScene];
  viewers.forEach(({ camera, controls }) => {
    if (view === "front") camera.position.set(0, 3.2, 7.8);
    if (view === "top") camera.position.set(0.01, 9.2, 0.01);
    if (view === "free") camera.position.set(5.4, 5.1, 6.2);
    controls.target.set(0, 1.25, 0);
    controls.update();
  });
}

function resetView() {
  setView("free");
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.001;
  updateFalling();
  targetScene.sun.position.x = 5 + Math.sin(time * 0.32) * 0.42;
  targetScene.sun.position.z = 4 + Math.cos(time * 0.28) * 0.34;
  buildScene.sun.position.x = targetScene.sun.position.x;
  buildScene.sun.position.z = targetScene.sun.position.z;
  if (dropMarker.visible) {
    const pulse = 1 + Math.sin(time * 5.2) * 0.035;
    dropMarker.scale.setScalar(pulse);
  }
  targetScene.controls.update();
  buildScene.controls.update();
  targetScene.renderer.render(targetScene.scene, targetScene.camera);
  buildScene.renderer.render(buildScene.scene, buildScene.camera);
}

function updateFalling() {
  for (let index = state.falling.length - 1; index >= 0; index -= 1) {
    const item = state.falling[index];
    item.velocity += 0.014;
    item.mesh.position.y -= item.velocity;
    item.mesh.rotation.x += 0.045;
    item.mesh.rotation.z += 0.028;
    if (item.mesh.position.y < -2.8) {
      buildGroup.remove(item.mesh);
      state.falling.splice(index, 1);
      state.counted += 1;
      document.querySelector("#countValue").textContent = String(state.counted);
      showToast(t("counted").replace("{count}", state.counted));
      if (sumGrid(state.grid) === 0 && state.falling.length === 0) {
        showToast(t("done").replace("{count}", state.counted));
      }
    }
  }
}

function applyLanguage() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.lang);
  });
  document.querySelector("#modeTitle").textContent = t("copyMode");
  document.querySelector("#instruction").textContent = t("copyInstruction");
  document.querySelector("#resetView").setAttribute("aria-label", t("resetView"));
  document.querySelector("#closeLevelDialog").setAttribute("aria-label", t("closeLevel"));
  refreshFrontIndicator(targetScene);
  refreshFrontIndicator(buildScene);
  renderLevelOptions();
  setGuide("guideStart");
  updateAudioButton();
  updateBuilderControls();
}

function showSuccessThenNext() {
  if (!sameGrid(getProblem(), state.grid)) {
    clearPendingSuccess();
    return;
  }
  if (!state.successPending) state.successPending = true;
  awardPoints(`copy-build:${state.levelIndex}:${state.problemIndex}`, 15);
  const burst = document.querySelector("#successBurst");
  const phrase = Math.random() > 0.5 ? t("successGreat") : t("successGood");
  burst.querySelector("strong").textContent = phrase;
  setGuide("guideSuccess");
  burst.classList.remove("show");
  void burst.offsetWidth;
  burst.classList.add("show");
  showToast(phrase);
  window.setTimeout(() => {
    burst.classList.remove("show");
    nextProblem();
  }, 1100);
}

function awardPoints(rewardId, amount) {
  const rewarded = new Set(JSON.parse(localStorage.getItem("gfield-rewarded-games") || "[]"));
  if (rewarded.has(rewardId)) return;
  rewarded.add(rewardId);
  const points = Number(localStorage.getItem("gfield-points")) || 120;
  localStorage.setItem("gfield-points", String(points + amount));
  localStorage.setItem("gfield-rewarded-games", JSON.stringify([...rewarded]));
}

function t(key) {
  return translations[state.lang][key] || translations.ko[key] || key;
}

function resizeViewer(viewer) {
  const rect = viewer.container.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  viewer.camera.aspect = width / height;
  viewer.camera.updateProjectionMatrix();
  viewer.renderer.setSize(width, height, false);
}

function emptyGrid() {
  return [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    child.traverse?.((node) => {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        if (Array.isArray(node.material)) node.material.forEach((mat) => mat.dispose());
        else node.material.dispose();
      }
    });
  }
}

function sameGrid(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((row, z) => (
    Array.isArray(row) &&
    Array.isArray(b[z]) &&
    row.length === b[z].length &&
    row.every((value, x) => value === b[z][x])
  ));
}

function sumGrid(grid) {
  return grid.flat().reduce((sum, value) => sum + value, 0);
}

function setStars(count) {
  document.querySelector("#stars").textContent = "★".repeat(count) + "☆".repeat(Math.max(0, 4 - count));
}

function takeFromPile() {
  if (Date.now() - state.lastDragAt < 250) return;
  if (state.draggingCube || state.successPending) return;
  if (state.countMode) {
    showToast(t("buildFirst"));
    return;
  }
  state.holdingCube = true;
  setGuide("guideHold");
  updateBuilderControls();
}

function startBuildCubeDrag(event, x, z) {
  if (state.successPending) return;
  state.holdingCube = true;
  state.draggingCube = true;
  state.draggingFromBoard = { x, z };
  state.dragCell = null;
  state.pileTarget = false;
  state.dragLiftY = getDragLift(event.pointerType);
  buildScene.controls.enabled = false;
  buildScene.renderer.domElement.setPointerCapture?.(event.pointerId);
  moveDragGhost(event.clientX, event.clientY);
  document.querySelector("#dragGhost").classList.add("show");
  setGuide("guideMove");
  showToast(t("returnToPile"));
  updateBuilderControls();

  const move = (moveEvent) => {
    moveDragGhost(moveEvent.clientX, moveEvent.clientY);
    updateDragTarget(moveEvent.clientX, moveEvent.clientY);
  };
  const end = (endEvent) => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    buildScene.controls.enabled = true;
    finishPileDrag(endEvent.clientX, endEvent.clientY);
  };
  const cancel = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    buildScene.controls.enabled = true;
    cancelPileDrag();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", cancel);
}

function startPileDrag(event) {
  if (state.successPending) return;
  if (state.countMode) {
    showToast(t("buildFirst"));
    return;
  }
  event.preventDefault();
  state.holdingCube = true;
  state.draggingCube = true;
  state.draggingFromBoard = null;
  state.dragCell = null;
  state.pileTarget = false;
  state.dragLiftY = getDragLift(event.pointerType);
  document.querySelector("#cubePile").setPointerCapture?.(event.pointerId);
  moveDragGhost(event.clientX, event.clientY);
  document.querySelector("#dragGhost").classList.add("show");
  setGuide("guideHold");
  updateBuilderControls();

  const move = (moveEvent) => {
    moveDragGhost(moveEvent.clientX, moveEvent.clientY);
    updateDragTarget(moveEvent.clientX, moveEvent.clientY);
  };
  const end = (endEvent) => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    finishPileDrag(endEvent.clientX, endEvent.clientY);
  };
  const cancel = () => {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", end);
    document.removeEventListener("pointercancel", cancel);
    cancelPileDrag();
  };
  document.addEventListener("pointermove", move);
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", cancel);
}

function moveDragGhost(x, y) {
  const ghost = document.querySelector("#dragGhost");
  ghost.style.transform = `translate(${x - 21}px, ${y - state.dragLiftY - 21}px) rotate(8deg)`;
}

function getDragLift(pointerType) {
  if (pointerType === "touch") return 64;
  if (pointerType === "pen") return 42;
  return 24;
}

function updateDragTarget(x, y) {
  const element = document.elementFromPoint(x, y);
  const pile = element?.closest?.("#cubePile");
  document.querySelector("#cubePile").classList.toggle("drop-target", Boolean(pile && state.draggingFromBoard));
  state.pileTarget = Boolean(pile && state.draggingFromBoard);
  dropMarker.visible = false;

  const cell = getCellFromCanvasPoint(x, y);
  if (!cell) {
    state.dragCell = null;
    return;
  }

  const targetHeight = getDropHeight(cell.x, cell.z);
  if (targetHeight >= 4) {
    state.dragCell = null;
    return;
  }

  state.dragCell = cell;
  dropMarker.position.set(cell.x - 1, targetHeight + 0.5, cell.z - 1);
  dropMarker.visible = true;
  setGuide("guideDrop");
}

function getDropHeight(x, z) {
  const source = state.draggingFromBoard;
  const movingWithinSource = source && source.x === x && source.z === z;
  return state.grid[z][x] - (movingWithinSource ? 1 : 0);
}

function getCellFromCanvasPoint(clientX, clientY) {
  const rect = buildScene.renderer.domElement.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }

  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, buildScene.camera);

  const candidates = [];
  const planeNormal = new THREE.Vector3(0, 1, 0);
  for (let z = 0; z < 3; z += 1) {
    for (let x = 0; x < 3; x += 1) {
      const height = getDropHeight(x, z);
      if (height >= 4) continue;

      const plane = new THREE.Plane(planeNormal, -height);
      const point = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(plane, point)) continue;

      const centerX = x - 1;
      const centerZ = z - 1;
      const insideCell = Math.abs(point.x - centerX) <= 0.53 && Math.abs(point.z - centerZ) <= 0.53;
      const projected = new THREE.Vector3(centerX, height + 0.02, centerZ).project(buildScene.camera);
      const screenX = rect.left + ((projected.x + 1) * 0.5 * rect.width);
      const screenY = rect.top + ((1 - projected.y) * 0.5 * rect.height);
      const screenDistance = Math.hypot(clientX - screenX, clientY - screenY);

      candidates.push({ x, z, insideCell, screenDistance });
    }
  }

  const directHits = candidates
    .filter((candidate) => candidate.insideCell)
    .sort((a, b) => a.screenDistance - b.screenDistance);
  if (directHits.length) return { x: directHits[0].x, z: directHits[0].z };

  const nearest = candidates.sort((a, b) => a.screenDistance - b.screenDistance)[0];
  const snapRadius = Math.max(46, Math.min(rect.width, rect.height) * 0.13);
  if (!nearest || nearest.screenDistance > snapRadius) return null;
  return { x: nearest.x, z: nearest.z };
}

function getTopCubeFromCanvasPoint(clientX, clientY) {
  const rect = buildScene.renderer.domElement.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }

  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, buildScene.camera);
  const hits = raycaster.intersectObjects(buildGroup.children, true);
  for (const hit of hits) {
    const object = hit.object.userData.kind ? hit.object : hit.object.parent;
    if (object?.userData.kind !== "cube") continue;
    const { x, z, y } = object.userData;
    if (state.grid[z][x] - 1 === y) return object;
  }
  return null;
}

function finishPileDrag(x, y) {
  state.lastDragAt = Date.now();
  updateDragTarget(x, y);
  document.querySelector("#dragGhost").classList.remove("show");
  document.querySelector("#cubePile").classList.remove("drop-target");
  dropMarker.visible = false;
  state.draggingCube = false;
  state.dragLiftY = 0;
  if (state.draggingFromBoard) {
    const source = state.draggingFromBoard;
    const shouldRemove = state.pileTarget;
    const target = state.dragCell;
    state.draggingFromBoard = null;
    state.pileTarget = false;
    state.holdingCube = false;
    if (shouldRemove) {
      state.grid[source.z][source.x] = Math.max(0, state.grid[source.z][source.x] - 1);
      renderBuild();
    } else if (target) {
      const sameCell = source.x === target.x && source.z === target.z;
      if (sameCell) {
        updateBuilderControls();
        state.dragCell = null;
        return;
      }
      if (!sameCell && state.grid[target.z][target.x] >= 4) {
        showToast(t("maxHeight"));
        updateBuilderControls();
        return;
      }
      state.grid[source.z][source.x] = Math.max(0, state.grid[source.z][source.x] - 1);
      state.grid[target.z][target.x] = Math.min(4, state.grid[target.z][target.x] + 1);
      renderBuild();
      checkAutoSuccess();
    } else {
      updateBuilderControls();
    }
    state.dragCell = null;
    return;
  }
  if (!state.dragCell) {
    state.holdingCube = false;
    updateBuilderControls();
    return;
  }
  const { x: cellX, z: cellZ } = state.dragCell;
  state.dragCell = null;
  placeAt(cellX, cellZ);
}

function cancelPileDrag() {
  state.lastDragAt = Date.now();
  document.querySelector("#dragGhost").classList.remove("show");
  document.querySelector("#cubePile").classList.remove("drop-target");
  dropMarker.visible = false;
  state.draggingCube = false;
  state.dragLiftY = 0;
  state.dragCell = null;
  state.draggingFromBoard = null;
  state.pileTarget = false;
  state.holdingCube = false;
  updateBuilderControls();
}

function findTopCube(x, z) {
  const topY = state.grid[z][x] - 1;
  if (topY < 0) return null;
  return buildGroup.children.find((child) => {
    return child.userData.kind === "cube" && child.userData.x === x && child.userData.z === z && child.userData.y === topY;
  });
}

function updateBuilderControls() {
  const pile = document.querySelector("#cubePile");
  const hand = document.querySelector("#handStatus");
  if (!pile || !hand) return;

  pile.classList.toggle("holding", state.holdingCube);
  hand.textContent = state.holdingCube ? t("inHand") : t("emptyHand");
}

function setGuide(key) {
  state.guideKey = key;
  const guide = document.querySelector("#guideMessage");
  if (!guide) return;
  guide.textContent = t(key);
  const bubble = guide.closest(".guide-bubble");
  if (!bubble) return;
  bubble.classList.remove("talk");
  void bubble.offsetWidth;
  bubble.classList.add("talk");
  speakGuide(key);
}

function toggleAudio() {
  state.audioEnabled = !state.audioEnabled;
  updateAudioButton();
  if (state.audioEnabled) {
    speakGuide(state.guideKey, true);
  } else if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function updateAudioButton() {
  const button = document.querySelector("#audioToggle");
  if (!button) return;
  button.textContent = state.audioEnabled ? t("audioOn") : t("audioOff");
  button.classList.toggle("active", state.audioEnabled);
  button.setAttribute("aria-pressed", String(state.audioEnabled));
}

function speakGuide(key, force = false) {
  if (!state.audioEnabled && !force) return;
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

  const settings = speechSettings[state.lang] || speechSettings.ko;
  const utterance = new SpeechSynthesisUtterance(t(key));
  utterance.lang = settings.lang;
  utterance.rate = settings.rate;
  utterance.pitch = settings.pitch;
  utterance.volume = 0.9;

  const voice = pickVoice(settings.lang);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function pickVoice(langCode) {
  const voices = state.speechVoices.length ? state.speechVoices : window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const base = langCode.split("-")[0];
  const sameLanguage = voices.filter((voice) => voice.lang?.toLowerCase().startsWith(base.toLowerCase()));
  const exactLanguage = sameLanguage.filter((voice) => voice.lang?.toLowerCase() === langCode.toLowerCase());
  const maleHint = maleVoiceHints[base] || /\bmale\b/i;
  const qualityHint = /natural|neural|premium|enhanced|google|microsoft/i;
  const chooseBest = (candidates) => [...candidates].sort((a, b) => {
    const score = (voice) => (qualityHint.test(voice.name) ? 2 : 0) + (voice.localService ? 1 : 0);
    return score(b) - score(a);
  })[0] || null;

  return (
    chooseBest(exactLanguage.filter((voice) => maleHint.test(voice.name))) ||
    chooseBest(sameLanguage.filter((voice) => maleHint.test(voice.name))) ||
    chooseBest(exactLanguage.filter((voice) => !femaleVoiceHints.test(voice.name))) ||
    chooseBest(sameLanguage.filter((voice) => !femaleVoiceHints.test(voice.name))) ||
    chooseBest(exactLanguage) ||
    chooseBest(sameLanguage)
  );
}

function initGuideDrag() {
  const guide = document.querySelector(".floating-guide");
  if (!guide) return;

  let dragging = false;
  let moved = false;
  let offsetX = 0;
  let offsetY = 0;

  const moveGuide = (clientX, clientY) => {
    const rect = guide.getBoundingClientRect();
    const maxLeft = window.innerWidth - rect.width - 8;
    const maxTop = window.innerHeight - rect.height - 8;
    const left = Math.max(8, Math.min(maxLeft, clientX - offsetX));
    const top = Math.max(8, Math.min(maxTop, clientY - offsetY));
    guide.style.left = `${left}px`;
    guide.style.top = `${top}px`;
    guide.style.right = "auto";
    guide.style.bottom = "auto";
  };

  guide.addEventListener("pointerdown", (event) => {
    const rect = guide.getBoundingClientRect();
    dragging = true;
    moved = false;
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    guide.classList.add("dragging");
    guide.classList.remove("walking");
    guide.dataset.userMoving = "true";
    guide.setPointerCapture(event.pointerId);
  });

  guide.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    moved = true;
    moveGuide(event.clientX, event.clientY);
  });

  guide.addEventListener("pointerup", (event) => {
    if (!dragging) return;
    dragging = false;
    guide.classList.remove("dragging");
    guide.dataset.userMoving = "false";
    guide.dataset.userMovedUntil = String(Date.now() + 18000);
    guide.releasePointerCapture(event.pointerId);
    if (moved) setGuide("guideDragged");
  });

  window.addEventListener("resize", () => {
    const rect = guide.getBoundingClientRect();
    if (!guide.style.left) return;
    moveGuide(rect.left + offsetX, rect.top + offsetY);
  });
}

function initGuideLife() {
  const guide = document.querySelector(".floating-guide");
  if (!guide) return;

  let waypoint = 0;
  const move = () => {
    const userMovedUntil = Number(guide.dataset.userMovedUntil || 0);
    if (guide.dataset.userMoving === "true" || Date.now() < userMovedUntil) {
      schedule();
      return;
    }

    const rect = guide.getBoundingClientRect();
    const edge = 12;
    const safeTop = Math.max(76, Math.round(window.innerHeight * 0.16));
    const safeBottom = Math.max(82, Math.round(window.innerHeight * 0.1));
    const maxLeft = Math.max(edge, window.innerWidth - rect.width - edge);
    const maxTop = Math.max(safeTop, window.innerHeight - rect.height - safeBottom);
    const nearRight = Math.max(edge, maxLeft - Math.min(96, window.innerWidth * 0.07));
    const middleRight = Math.min(maxTop, Math.max(safeTop, Math.round(window.innerHeight * 0.48)));
    const spots = window.innerWidth <= 680
      ? [
          { left: maxLeft, top: maxTop },
          { left: maxLeft, top: middleRight }
        ]
      : [
          { left: maxLeft, top: maxTop },
          { left: nearRight, top: middleRight },
          { left: maxLeft, top: safeTop },
          { left: maxLeft, top: middleRight }
        ];

    waypoint = (waypoint + 1) % spots.length;
    const next = spots[waypoint];
    guide.classList.toggle("facing-left", next.left > rect.left);
    guide.classList.add("walking");
    guide.style.right = "auto";
    guide.style.bottom = "auto";
    guide.style.left = `${next.left}px`;
    guide.style.top = `${next.top}px`;
    window.setTimeout(() => guide.classList.remove("walking"), 1900);
    schedule();
  };

  const schedule = () => {
    window.setTimeout(move, 7200 + Math.random() * 4200);
  };

  schedule();
}

let toastTimer = null;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}
