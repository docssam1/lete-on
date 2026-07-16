import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { COPY_BUILD_LEVELS } from "./data/copy-build-levels.js";

const translations = { ko: {}, zh: {}, ja: {}, en: {} };

const displayCopy = {
  ko: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "똑같이 쌓기",
    copyInstruction: "쌓기나무 더미에서 하나씩 끌어 와 빨간 위치에 놓아 보세요.",
    target: "문제 모양",
    myBuild: "내가 만든 모양",
    countLabel: "문제",
    check: "확인",
    next: "다음 문제",
    reset: "처음부터",
    front: "앞",
    side: "오른쪽",
    back: "뒤",
    top: "위",
    free: "돌려보기",
    resetView: "시점 초기화",
    singleCube: "1개",
    correct: "정확해요! 다음 문제로 갈게요.",
    wrong: "조금 달라요. 위치와 높이를 다시 확인해 보세요.",
    buildFirst: "먼저 문제 모양과 똑같이 만들어 보세요.",
    topOnly: "맨 위에 있는 쌓기나무부터 고를 수 있어요.",
    pileLabel: "큐브 보관함",
    emptyHand: "하나씩 가져와요",
    inHand: "쌓기나무를 들고 있어요",
    boardLabel: "빨간 위치에 내려놓으세요",
    pileFirst: "먼저 더미에서 쌓기나무를 하나 가져오세요.",
    maxHeight: "여기는 4층까지 쌓을 수 있어요.",
    returnToPile: "다른 자리로 옮기거나 더미에 내려놓으면 빠져요.",
    levelProgress: "레벨 {level} · {current}/{total}",
    guideStart: "문제 모양을 보고 더미에서 하나씩 가져와 보자!",
    guideColorCount: "가려진 쌓기나무는 보관함의 색별 개수를 단서로 똑같이 만들어 보자!",
    guideHold: "좋아, 빨간 위치에 천천히 내려놓아 봐.",
    guideDrop: "거기 좋아! 손을 떼면 그 자리에 쌓여.",
    guideMove: "위에 있는 블록은 다른 자리로 옮길 수 있어.",
    guideWrong: "조금 달라. 문제 모양의 위치와 높이를 다시 볼까?",
    guideSuccess: "Great job! 똑같이 잘 쌓았어.",
    guideNext: "다음 문제야. 이번 모양도 차근차근 만들어 보자.",
    guideTitle: "큐비",
    guideDragged: "좋아, 큐비가 옆에서 알려줄게!",
    audioOn: "음성 켜짐",
    audioOff: "음성 켜기",
    levelSelect: "레벨 선택",
    levelNumber: "레벨 {level}",
    levelProblems: "{count}문제",
    closeLevel: "닫기",
    guideLevelSelect: "도전할 레벨을 골라 보자!",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  zh: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "照样搭建",
    copyInstruction: "从积木盒里拖出方块，放到红色位置上。",
    target: "目标形状",
    myBuild: "我的搭建",
    countLabel: "题目",
    check: "检查",
    next: "下一题",
    reset: "重新开始",
    front: "前",
    side: "右侧",
    back: "后",
    top: "上",
    free: "旋转看看",
    resetView: "重置视角",
    pileLabel: "方块盒",
    emptyHand: "一次拿一个",
    inHand: "正在拿方块",
    boardLabel: "放到红色位置上",
    wrong: "有一点不一样。再看看位置和高度。",
    guideStart: "看看目标形状，从盒子里拿一个方块吧！",
    guideColorCount: "看不见的方块要根据盒子里每种颜色的数量来推理并搭好！",
    guideHold: "很好，慢慢放到红色位置上。",
    guideDrop: "这个位置不错！松手就可以放下。",
    guideMove: "最上面的方块可以移动到别的位置。",
    guideWrong: "有一点不一样。我们再比较一下目标形状吧。",
    guideSuccess: "Great job! 搭得一样了。",
    guideNext: "下一题来了。一步一步搭起来吧。",
    guideTitle: "Cubi",
    guideDragged: "很好，Cubi 会在旁边提示你！",
    audioOn: "语音已开",
    audioOff: "打开语音",
    levelSelect: "选择等级",
    levelNumber: "等级 {level}",
    levelProblems: "{count}题",
    closeLevel: "关闭",
    guideLevelSelect: "选择要挑战的等级吧！",
    levelProgress: "等级 {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  ja: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "同じ形を作る",
    copyInstruction: "積み木トレイから一つずつドラッグして、赤い場所に置きましょう。",
    target: "問題の形",
    myBuild: "作った形",
    countLabel: "問題",
    check: "確認",
    next: "次の問題",
    reset: "はじめから",
    front: "前",
    side: "右",
    back: "後ろ",
    top: "上",
    free: "回して見る",
    resetView: "視点を戻す",
    pileLabel: "キューブトレイ",
    emptyHand: "一つずつ取ろう",
    inHand: "積み木を持っています",
    boardLabel: "赤い場所に置きましょう",
    wrong: "少し違います。位置と高さをもう一度見てみましょう。",
    guideStart: "問題の形を見て、トレイから一つ取ってみよう！",
    guideColorCount: "見えない積み木は、トレイの色ごとの数を手がかりに同じ形を作ろう！",
    guideHold: "いいね。赤い場所にゆっくり置いてみよう。",
    guideDrop: "そこがいいよ！指を離すと置けるよ。",
    guideMove: "上にあるブロックは別の場所へ動かせるよ。",
    guideWrong: "少し違うね。問題の形と比べてみよう。",
    guideSuccess: "Great job! 同じ形にできたね。",
    guideNext: "次の問題だよ。今度もゆっくり作ろう。",
    guideTitle: "Cubi",
    guideDragged: "いいね。Cubi がそばで教えるよ！",
    audioOn: "音声オン",
    audioOff: "音声をオン",
    levelSelect: "レベル選択",
    levelNumber: "レベル {level}",
    levelProblems: "{count}問",
    closeLevel: "閉じる",
    guideLevelSelect: "挑戦するレベルを選ぼう！",
    levelProgress: "レベル {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  en: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "Copy Build",
    copyInstruction: "Drag cubes from the tray and place them on the red guide.",
    target: "Target Shape",
    myBuild: "Your Build Area",
    countLabel: "Problem",
    check: "Check",
    next: "Next",
    reset: "Retry",
    front: "Front",
    side: "Right",
    back: "Back",
    top: "Top",
    free: "Rotate",
    resetView: "Reset View",
    singleCube: "1 cube",
    pileLabel: "Cube Tray",
    emptyHand: "Take one cube",
    inHand: "Cube in hand",
    boardLabel: "Drop on the red guide",
    correct: "Exactly right! Moving to the next problem.",
    wrong: "Not quite. Check the position and height again.",
    guideStart: "Look at the target shape and bring one cube from the tray.",
    guideColorCount: "Use the number of each color in the tray to infer the hidden cubes.",
    guideHold: "Nice. Move it slowly onto the red guide.",
    guideDrop: "Good spot! Release to place it there.",
    guideMove: "You can move a top cube to another place.",
    guideWrong: "Not quite. Let's compare the position and height again.",
    guideSuccess: "Great job! You copied the shape.",
    guideNext: "Next problem. Build this one step by step.",
    guideTitle: "Cubi",
    guideDragged: "Nice. Cubi will help from here!",
    audioOn: "Voice on",
    audioOff: "Voice on",
    levelSelect: "Select Level",
    levelNumber: "Level {level}",
    levelProblems: "{count} problems",
    closeLevel: "Close",
    guideLevelSelect: "Choose a level to try!",
    levelProgress: "Level {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  }
};

Object.entries(displayCopy).forEach(([lang, labels]) => {
  Object.assign(translations[lang], labels);
});

const fixedCopy = {
  ko: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "똑같이 쌓기",
    copyInstruction: "쌓기나무 더미에서 하나씩 끌어 와 빨간 위치에 놓아 보세요.",
    target: "문제 모양",
    myBuild: "내가 만든 모양",
    countLabel: "문제",
    check: "확인",
    next: "다음 문제",
    reset: "처음부터",
    front: "앞",
    side: "오른쪽",
    back: "뒤",
    top: "위",
    free: "돌려보기",
    resetView: "시점 초기화",
    singleCube: "1개",
    correct: "정확해요! 다음 문제로 갈게요.",
    wrong: "조금 달라요. 위치와 높이를 다시 확인해 보세요.",
    buildFirst: "먼저 문제 모양과 똑같이 만들어 보세요.",
    topOnly: "맨 위에 있는 쌓기나무부터 고를 수 있어요.",
    pileLabel: "큐브 보관함",
    emptyHand: "하나씩 가져와요",
    inHand: "쌓기나무를 들고 있어요",
    boardLabel: "빨간 위치에 내려놓으세요",
    pileFirst: "먼저 더미에서 쌓기나무를 하나 가져오세요.",
    maxHeight: "여기는 4층까지 쌓을 수 있어요.",
    returnToPile: "다른 자리로 옮기거나 더미에 내려놓으면 빠져요.",
    levelProgress: "레벨 {level} · {current}/{total}",
    guideStart: "문제 모양을 보고 더미에서 하나씩 가져와 보자!",
    guideHold: "좋아, 빨간 위치에 천천히 내려놓아 봐.",
    guideDrop: "손을 놓으면 이 자리에 쌓여.",
    guideMove: "위에 있는 블록은 다른 자리로 옮길 수 있어.",
    guideWrong: "조금 달라. 문제 모양의 위치와 높이를 다시 볼까?",
    guideSuccess: "Great job! 똑같이 잘 쌓았어.",
    guidePlaced1: "좋았어! 다음 쌓기나무도 놓아 볼까?",
    guidePlaced2: "잘 놓았어. 문제 모양과 비교해 보자.",
    guidePlaced3: "하나 완성! 다음 자리를 찾아보자.",
    guidePlaced4: "차근차근 잘하고 있어.",
    guideSuccess1: "완벽해! 모양과 색까지 모두 똑같아.",
    guideSuccess2: "멋지게 완성했어! 방향도 정확해.",
    guideSuccess3: "대단해! 숨은 쌓기나무까지 잘 찾았어.",
    guideSuccess4: "끝까지 차근차근 잘 만들었어!",
    tutorialTake: "반짝이는 쌓기나무를 더미에서 끌어 와 볼까?",
    tutorialPlace: "빨간 자리에 천천히 내려놓아 볼까?",
    tutorialStack: "잘했어! 방금 놓은 쌓기나무 위로 하나 더 올려 볼까?",
    tutorialReturn: "이제 맨 위 쌓기나무를 더미로 옮겨서 없애 보자.",
    tutorialDone: "완벽해! 이제 원하는 자리에 자유롭게 쌓아 보자.",
    guideNext: "다음 문제야. 이번 모양도 차근차근 만들어 보자.",
    guideTitle: "큐비",
    guideDragged: "좋아, 큐비가 옆에서 알려줄게!",
    audioOn: "음성 켜짐",
    audioOff: "음성 켜기",
    levelSelect: "레벨 선택",
    levelNumber: "레벨 {level}",
    levelProblems: "{count}문제",
    closeLevel: "닫기",
    guideLevelSelect: "도전할 레벨을 골라 보자!",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  zh: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "照样搭建",
    copyInstruction: "从积木盒里拖出方块，放到红色位置上。",
    target: "目标形状",
    myBuild: "我的搭建",
    countLabel: "题目",
    check: "检查",
    next: "下一题",
    reset: "重新开始",
    front: "前",
    side: "右侧",
    back: "后",
    top: "上",
    free: "旋转看看",
    resetView: "重置视角",
    pileLabel: "方块盒",
    emptyHand: "一次拿一个",
    inHand: "正在拿方块",
    boardLabel: "放到红色位置上",
    wrong: "有一点不一样。再看看位置和高度。",
    guideStart: "看看目标形状，从盒子里拿一个方块吧！",
    guideHold: "很好，慢慢放到红色位置上。",
    guideDrop: "松手就会放在这个位置。",
    guideMove: "最上面的方块可以移动到别的位置。",
    guideWrong: "有一点不一样。我们再比较一下目标形状吧。",
    guideSuccess: "Great job! 搭得一样了。",
    guidePlaced1: "很好！再放一个积木吧？",
    guidePlaced2: "放得很好。和目标形状比较一下吧。",
    guidePlaced3: "完成一个！找找下一个位置。",
    guidePlaced4: "一步一步做得很好。",
    guideSuccess1: "太完美了！形状和颜色都一样。",
    guideSuccess2: "完成得真棒！方向也很准确。",
    guideSuccess3: "太厉害了！隐藏的积木也找到了。",
    guideSuccess4: "你一步一步坚持完成了！",
    tutorialTake: "把闪闪发光的积木从盒子里拖出来吧。",
    tutorialPlace: "慢慢放到红色位置上吧。",
    tutorialStack: "很好！再往刚才的积木上放一个吧。",
    tutorialReturn: "现在把最上面的积木拖回盒子里吧。",
    tutorialDone: "完成！现在可以自由搭建了。",
    guideNext: "下一题来了。一步一步搭起来吧。",
    guideTitle: "Cubi",
    guideDragged: "很好，Cubi 会在旁边提示你！",
    audioOn: "语音已开",
    audioOff: "打开语音",
    levelSelect: "选择等级",
    levelNumber: "等级 {level}",
    levelProblems: "{count}题",
    closeLevel: "关闭",
    guideLevelSelect: "选择要挑战的等级吧！",
    levelProgress: "等级 {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  ja: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "同じ形を作る",
    copyInstruction: "積み木トレイから一つずつドラッグして、赤い場所に置きましょう。",
    target: "問題の形",
    myBuild: "作った形",
    countLabel: "問題",
    check: "確認",
    next: "次の問題",
    reset: "はじめから",
    front: "前",
    side: "右",
    back: "後ろ",
    top: "上",
    free: "回して見る",
    resetView: "視点を戻す",
    pileLabel: "キューブトレイ",
    emptyHand: "一つずつ取ろう",
    inHand: "積み木を持っています",
    boardLabel: "赤い場所に置きましょう",
    wrong: "少し違います。位置と高さをもう一度見てみましょう。",
    guideStart: "問題の形を見て、トレイから一つ取ってみよう！",
    guideHold: "いいね。赤い場所にゆっくり置いてみよう。",
    guideDrop: "指を離すと、この場所に置けるよ。",
    guideMove: "上にあるブロックは別の場所へ動かせるよ。",
    guideWrong: "少し違うね。問題の形と比べてみよう。",
    guideSuccess: "Great job! 同じ形にできたね。",
    guidePlaced1: "いいね！次の積み木も置いてみよう。",
    guidePlaced2: "上手に置けたね。問題の形と比べよう。",
    guidePlaced3: "一つ完成！次の場所を探そう。",
    guidePlaced4: "ゆっくり、しっかりできているよ。",
    guideSuccess1: "完璧！形も色も同じだね。",
    guideSuccess2: "すてきに完成！向きも正確だよ。",
    guideSuccess3: "すごい！隠れた積み木も見つけたね。",
    guideSuccess4: "最後までていねいに作れたね！",
    tutorialTake: "光っている積み木をトレイから動かしてみよう。",
    tutorialPlace: "赤い場所にゆっくり置いてみよう。",
    tutorialStack: "できた！今の積み木の上にもう一つ置こう。",
    tutorialReturn: "いちばん上の積み木をトレイへ戻してみよう。",
    tutorialDone: "完璧！これから自由に積んでみよう。",
    guideNext: "次の問題だよ。今度もゆっくり作ろう。",
    guideTitle: "Cubi",
    guideDragged: "いいね。Cubi がそばで教えるよ！",
    audioOn: "音声オン",
    audioOff: "音声をオン",
    levelSelect: "レベル選択",
    levelNumber: "レベル {level}",
    levelProblems: "{count}問",
    closeLevel: "閉じる",
    guideLevelSelect: "挑戦するレベルを選ぼう！",
    levelProgress: "レベル {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  },
  en: {
    sectionLabel: "GFIELD Geometry World",
    title: "GFIELD Cube Town",
    copyMode: "Copy Build",
    copyInstruction: "Drag cubes from the tray and place them on the red guide.",
    target: "Target Shape",
    myBuild: "Your Build Area",
    countLabel: "Problem",
    check: "Check",
    next: "Next",
    reset: "Retry",
    front: "Front",
    side: "Right",
    back: "Back",
    top: "Top",
    free: "Rotate",
    resetView: "Reset View",
    singleCube: "1 cube",
    pileLabel: "Cube Tray",
    emptyHand: "Take one cube",
    inHand: "Cube in hand",
    boardLabel: "Drop on the red guide",
    correct: "Exactly right! Moving to the next problem.",
    wrong: "Not quite. Check the position and height again.",
    guideStart: "Look at the target shape and bring one cube from the tray.",
    guideHold: "Nice. Move it slowly onto the red guide.",
    guideDrop: "Release to place the cube here.",
    guideMove: "You can move a top cube to another place.",
    guideWrong: "Not quite. Let's compare the position and height again.",
    guideSuccess: "Great job! You copied the shape.",
    guidePlaced1: "Nice! Shall we place the next cube?",
    guidePlaced2: "Well placed. Compare it with the target.",
    guidePlaced3: "One done! Find the next position.",
    guidePlaced4: "You are building it carefully.",
    guideSuccess1: "Perfect! The shape and colors all match.",
    guideSuccess2: "Wonderful build! Every direction is correct.",
    guideSuccess3: "Amazing! You found the hidden cubes too.",
    guideSuccess4: "You built it carefully all the way through!",
    tutorialTake: "Drag the sparkling cube from the tray.",
    tutorialPlace: "Lower it slowly onto the red guide.",
    tutorialStack: "Great! Place another cube on top of it.",
    tutorialReturn: "Now drag the top cube back to the tray.",
    tutorialDone: "Perfect! Now you can build freely.",
    guideNext: "Next problem. Build this one step by step.",
    guideTitle: "Cubi",
    guideDragged: "Nice. Cubi will help from here!",
    audioOn: "Voice on",
    audioOff: "Voice on",
    levelSelect: "Select Level",
    levelNumber: "Level {level}",
    levelProblems: "{count} problems",
    closeLevel: "Close",
    guideLevelSelect: "Choose a level to try!",
    levelProgress: "Level {level} · {current}/{total}",
    successPop: "SUCCESS!",
    successGood: "GOOD JOB!",
    successGreat: "GREAT JOB!"
  }
};

Object.entries(fixedCopy).forEach(([lang, labels]) => {
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
  ...COPY_BUILD_LEVELS,
  {
    level: 4,
    stars: 4,
    problemCount: 5,
    href: "./games/shape-build/?level=4"
  },
  {
    level: 5,
    stars: 5,
    problemCount: 5,
    href: "./games/shape-build/?level=5"
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

const cubeGeometry = new RoundedBoxGeometry(0.96, 0.96, 0.96, 6, 0.075);
const cubeEdges = new THREE.EdgesGeometry(cubeGeometry, 24);
const woodTexture = createWoodTexture();
const woodMaterial = new THREE.MeshStandardMaterial({
  color: 0xfff5df,
  map: woodTexture,
  bumpMap: woodTexture,
  bumpScale: 0.012,
  roughness: 0.56,
  metalness: 0.012
});
const cubeEdgeMaterial = new THREE.LineBasicMaterial({
  color: 0x8b6840,
  transparent: true,
  opacity: 0.18
});

function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const base = context.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, "#fff7e7");
  base.addColorStop(0.46, "#f0d4a5");
  base.addColorStop(1, "#d9b57e");
  context.fillStyle = base;
  context.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 76; i += 1) {
    const y = 18 + i * 6.5 + Math.sin(i * 1.7) * 6;
    context.beginPath();
    context.moveTo(-20, y);
    for (let x = -20; x <= 540; x += 18) {
      context.lineTo(x, y + Math.sin(x * 0.036 + i) * 3.6 + Math.sin(x * 0.012 + i * 0.4) * 2.4);
    }
    context.strokeStyle = i % 3 === 0 ? "rgba(115,78,39,.095)" : "rgba(255,255,245,.24)";
    context.lineWidth = i % 3 === 0 ? 1.15 : 0.9;
    context.stroke();
  }
  for (let i = 0; i < 34; i += 1) {
    context.beginPath();
    context.ellipse(44 + (i * 83) % 432, 38 + (i * 117) % 420, 20, 6, i, 0, Math.PI * 2);
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
  return texture;
}

const requestedLevel = Number(new URLSearchParams(window.location.search).get("level"));

const state = {
  lang: "ko",
  levelIndex: Number.isInteger(requestedLevel) && requestedLevel >= 1 && requestedLevel <= 3
    ? requestedLevel - 1
    : 0,
  problemIndex: 0,
  grid: emptyGrid(),
  colorGrid: emptyColorGrid(),
  selectedColor: "cube",
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
  ,
  tutorialStep: -1,
  lastPlacementGuide: "",
  lastSuccessGuide: ""
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

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(4.8, 4.25, 5.35);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 4.6;
  controls.maxDistance = 11;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 0.68, 0);
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_ROTATE
  };

  const ambient = new THREE.HemisphereLight(0xffffff, 0xc9d5cd, 2.2);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(4.2, 8.5, 5.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const board = createWoodBoard();
  scene.add(board);

  const grid = new THREE.GridHelper(3, 3, 0x9b8b75, 0xd3c6b2);
  grid.position.y = 0.01;
  scene.add(grid);

  const frontIndicator = createFrontIndicator();
  scene.add(frontIndicator);

  if (interactive) {
    renderer.domElement.addEventListener("pointerdown", onPointerDown, { capture: true });
    renderer.domElement.addEventListener("pointerup", onPointerUp);
  }

  const viewer = { scene, camera, renderer, controls, container, frontIndicator, sun, grid };
  resizeViewer(viewer);
  return viewer;
}

function setViewerBoardSize(viewer, size) {
  if (viewer.grid) {
    viewer.scene.remove(viewer.grid);
    viewer.grid.geometry?.dispose?.();
    if (Array.isArray(viewer.grid.material)) viewer.grid.material.forEach((material) => material.dispose());
    else viewer.grid.material?.dispose?.();
  }
  const grid = new THREE.GridHelper(size, size, 0x8e6841, 0xc79b67);
  grid.position.y = 0.025;
  viewer.scene.add(grid);
  viewer.grid = grid;
}

function createWoodBoard() {
  const group = new THREE.Group();
  const tray = new THREE.Mesh(
    new RoundedBoxGeometry(4.96, 0.24, 4.96, 8, 0.18),
    new THREE.MeshStandardMaterial({
      color: 0xe7c28e,
      map: woodTexture,
      bumpMap: woodTexture,
      bumpScale: 0.01,
      roughness: 0.58,
      metalness: 0.01
    })
  );
  tray.position.y = -0.15;
  tray.receiveShadow = true;
  tray.castShadow = true;
  group.add(tray);

  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0xd0a36b,
    map: woodTexture,
    bumpMap: woodTexture,
    bumpScale: 0.009,
    roughness: 0.58,
    metalness: 0.01
  });
  [
    { x: 0, z: 2.12, sx: 4.32, sz: 0.18 },
    { x: 0, z: -2.12, sx: 4.32, sz: 0.18 },
    { x: 2.12, z: 0, sx: 0.18, sz: 4.32 },
    { x: -2.12, z: 0, sx: 0.18, sz: 4.32 }
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

  const inset = new THREE.Mesh(
    new THREE.PlaneGeometry(3.28, 3.28),
    new THREE.MeshStandardMaterial({
      color: 0xfff2d7,
      map: woodTexture,
      bumpMap: woodTexture,
      bumpScale: 0.004,
      roughness: 0.82,
      transparent: false,
      opacity: 1
    })
  );
  inset.rotation.x = -Math.PI / 2;
  inset.position.y = 0.014;
  inset.receiveShadow = true;
  group.add(inset);

  return group;
}

function createFrontIndicator() {
  const group = new THREE.Group();
  group.userData = { kind: "front-indicator" };

  const front = createBoardLabelPlane(t("front"));
  front.position.set(0, -0.045, 2.435);
  front.rotation.set(0, 0, 0);
  group.add(front);

  const side = createBoardLabelPlane(t("side"));
  side.position.set(2.435, -0.045, 0);
  side.rotation.set(0, Math.PI / 2, 0);
  group.add(side);
  return group;
}

function createBoardLabelPlane(label) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 112;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(64, 38, 17, 0.95)";
  context.font = "950 58px 'Noto Sans KR', sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.shadowColor = "rgba(255, 247, 224, 0.82)";
  context.shadowBlur = 3;
  context.fillText(label, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 0.42), material);
  mesh.renderOrder = 902;
  mesh.userData = { kind: "board-label" };
  return mesh;
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
  document.querySelector("#topLevelPickerButton").addEventListener("click", openLevelPicker);
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
  const boardSize = getProblemBoardSize();
  state.countMode = false;
  state.counted = 0;
  state.holdingCube = false;
  state.draggingCube = false;
  state.draggingFromBoard = null;
  state.dragCell = null;
  state.pileTarget = false;
  state.grid = emptyGrid(boardSize);
  state.colorGrid = emptyColorGrid(boardSize);
  state.selectedColor = "cube";
  state.falling = [];
  document.body.classList.toggle("color-problem", isColorProblem());
  setViewerBoardSize(targetScene, boardSize);
  setViewerBoardSize(buildScene, boardSize);
  document.querySelector("#modeTitle").textContent = t("copyMode");
  document.querySelector("#instruction").textContent = t("copyInstruction");
  updateStepDisplay();
  updateGuideCharacter();

  renderTarget();
  renderBuild();
  updateBuilderControls();
  if (!maybeStartTutorial()) setGuide(isColorProblem() ? "guideColorCount" : "guideStart", true);
}

function renderTarget() {
  clearGroup(targetGroup);
  const problem = getProblemData();
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
  const problem = normalizeProblem(grid);
  const offset = (getProblemBoardSize(problem) - 1) / 2;
  problem.grid.forEach((row, z) => {
    row.forEach((height, x) => {
      for (let y = 0; y < height; y += 1) {
        const colorName = interactive ? (state.colorGrid[z]?.[x]?.[y] || "cube") : getProblemCubeColor(problem, x, z, y);
        const cube = createCube(colors[colorName] || colors.cube);
        cube.position.set(x - offset, y + 0.5, z - offset);
        cube.userData = { kind: "cube", x, z, y, interactive };
        group.add(cube);
      }
    });
  });
}

function renderBaseTargets(group) {
  const size = getProblemBoardSize();
  const offset = (size - 1) / 2;
  for (let z = 0; z < size; z += 1) {
    for (let x = 0; x < size; x += 1) {
      const marker = new THREE.Mesh(
        new RoundedBoxGeometry(0.9, 0.035, 0.9, 3, 0.018),
        new THREE.MeshBasicMaterial({
          color: 0xf8e6bf,
          transparent: false,
          opacity: 1,
          depthWrite: false
        })
      );
      marker.position.set(x - offset, 0.045, z - offset);
      marker.userData = { kind: "cell", x, z, interactive: true };
      group.add(marker);
    }
  }
}

function createCube(color) {
  const isWood = color === colors.cube;
  const cubeMaterial = isWood
    ? woodMaterial.clone()
    : new THREE.MeshStandardMaterial({
      color,
      map: woodTexture,
      bumpMap: woodTexture,
      bumpScale: 0.012,
      roughness: 0.54,
      metalness: 0.03
    });
  cubeMaterial.envMapIntensity = 0.65;
  const mesh = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
  );
  const edges = new THREE.LineSegments(
    cubeEdges,
    cubeEdgeMaterial
  );
  mesh.add(edges);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createDropMarker() {
  const marker = new THREE.Group();
  const geometry = new RoundedBoxGeometry(1.02, 1.02, 1.02, 4, 0.045);
  const fill = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xdf4d4d,
      transparent: true,
      opacity: 0.2,
      depthTest: false,
      depthWrite: false
    })
  );
  const outline = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({
      color: 0xff2638,
      transparent: true,
      opacity: 0.92,
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
  const size = getProblemBoardSize();
  const offset = (size - 1) / 2;
  const x = Math.round(point.x + offset);
  const z = Math.round(point.z + offset);
  if (x < 0 || x >= size || z < 0 || z >= size) return null;
  return { x, z };
}

function placeAt(x, z) {
  if (state.successPending) return;
  if (state.grid[z][x] >= 4) {
    showToast(t("maxHeight"));
    return;
  }
  const colorName = isColorProblem() ? state.selectedColor : "cube";
  const remaining = getRemainingInventory();
  if (isColorProblem() && (remaining[colorName] || 0) <= 0) {
    showToast(t("pileFirst"));
    return;
  }
  const previousHeight = state.grid[z][x];
  state.colorGrid[z][x][previousHeight] = colorName;
  state.grid[z][x] += 1;
  state.holdingCube = false;
  renderBuild();
  playPlacementSound();
  handlePlacementFeedback(previousHeight, x, z);
  checkAutoSuccess();
}

function countCube(object) {
  if (object.userData.kind !== "cube") return;
  const { x, z, y } = object.userData;
  if (state.grid[z][x] - 1 !== y) {
    showToast(t("topOnly"));
    return;
  }
  state.colorGrid[z][x].pop();
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
  const problem = getProblemData();
  if (!sameBuild(problem)) {
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
  if (!sameBuild(getProblemData())) {
    clearPendingSuccess();
    return;
  }
  if (state.successPending) return;
  state.successPending = true;
  state.successTimer = window.setTimeout(() => {
    state.successTimer = null;
    if (!sameBuild(getProblemData())) {
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
  const boardSize = getProblemBoardSize();
  state.grid = emptyGrid(boardSize);
  state.colorGrid = emptyColorGrid(boardSize);
  state.selectedColor = "cube";
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
  loadProblem();
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
  if (levels[index]?.href) {
    window.location.href = levels[index].href;
    return;
  }
  state.levelIndex = index;
  state.problemIndex = 0;
  closeLevelPicker();
  updateGuideCharacter();
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
    stars.textContent = `${"★".repeat(level.stars)}${"☆".repeat(Math.max(0, levels.length - level.stars))}`;
    problemCount.textContent = t("levelProblems").replace("{count}", level.problems?.length || level.problemCount || 0);
    button.append(title, stars, problemCount);
    button.addEventListener("click", () => selectLevel(index));
    options.appendChild(button);
  });
}

function getProblem() {
  return getProblemData().grid;
}

function getProblemData() {
  return normalizeProblem(getLevel().problems[state.problemIndex]);
}

function normalizeProblem(problem) {
  if (Array.isArray(problem)) return { grid: problem, colorMap: null };
  return {
    grid: problem.grid,
    colorMap: problem.colorMap || null
  };
}

function isColorProblem() {
  return Boolean(getProblemData().colorMap);
}

function getProblemCubeColor(problem, x, z, y) {
  return problem.colorMap?.[z]?.[x]?.[y] || "cube";
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

function updateGuideCharacter() {
  const guide = document.querySelector(".floating-guide");
  if (!guide) return;
  const level = Math.min(getLevel()?.level || 1, 6);
  guide.classList.remove("level-1", "level-2", "level-3", "level-4", "level-5", "level-6");
  guide.classList.add(`level-${level}`);
  guide.dataset.level = String(level);
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
  updateGuideCharacter();
  setGuide(isColorProblem() ? "guideColorCount" : "guideStart");
  updateAudioButton();
  updateBuilderControls();
}

function showSuccessThenNext() {
  if (!sameBuild(getProblemData())) {
    clearPendingSuccess();
    return;
  }
  if (!state.successPending) state.successPending = true;
  awardPoints(`copy-build:${state.levelIndex}:${state.problemIndex}`, 15);
  const burst = document.querySelector("#successBurst");
  const phrases = [t("successGood"), t("successGreat"), t("successPop")];
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  burst.querySelector("strong").textContent = phrase;
  setRandomGuide(
    ["guideSuccess1", "guideSuccess2", "guideSuccess3", "guideSuccess4"],
    "lastSuccessGuide"
  );
  playSuccessSound();
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
  viewer.camera.fov = viewer.container.id === "targetCanvas" && width / height < 0.9 ? 50 : 38;
  viewer.camera.updateProjectionMatrix();
  viewer.renderer.setSize(width, height, false);
}

function getProblemBoardSize(problem = getProblemData()) {
  const rows = normalizeProblem(problem).grid;
  return Math.max(rows.length, ...rows.map((row) => row.length));
}

function emptyGrid(size = 3) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function emptyColorGrid(size = 3) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => []));
}

function clearGroup(group) {
  while (group.children.length) {
    const child = group.children.pop();
    child.traverse?.((node) => {
      if (node.geometry && node.geometry !== cubeGeometry && node.geometry !== cubeEdges) node.geometry.dispose();
      if (node.material) {
        const disposeMaterial = (mat) => {
          if (mat === woodMaterial || mat === cubeEdgeMaterial) return;
          mat.dispose();
        };
        if (Array.isArray(node.material)) node.material.forEach(disposeMaterial);
        else disposeMaterial(node.material);
      }
    });
  }
}

function sameGrid(a, b) {
  const gridA = normalizeProblem(a).grid;
  const gridB = normalizeProblem(b).grid;
  if (!Array.isArray(gridA) || !Array.isArray(gridB) || gridA.length !== gridB.length) return false;
  return gridA.every((row, z) => (
    Array.isArray(row) &&
    Array.isArray(gridB[z]) &&
    row.length === gridB[z].length &&
    row.every((value, x) => value === gridB[z][x])
  ));
}

function sameBuild(problem) {
  if (!sameGrid(problem.grid, state.grid)) return false;
  if (!problem.colorMap) return true;
  for (let z = 0; z < problem.grid.length; z += 1) {
    for (let x = 0; x < problem.grid[z].length; x += 1) {
      for (let y = 0; y < problem.grid[z][x]; y += 1) {
        if ((state.colorGrid[z]?.[x]?.[y] || "cube") !== getProblemCubeColor(problem, x, z, y)) return false;
      }
    }
  }
  return true;
}

function getProblemInventory() {
  const problem = getProblemData();
  const inventory = { cube: 0, green: 0, blue: 0, yellow: 0, rose: 0 };
  problem.grid.forEach((row, z) => {
    row.forEach((height, x) => {
      for (let y = 0; y < height; y += 1) {
        const colorName = getProblemCubeColor(problem, x, z, y);
        inventory[colorName] = (inventory[colorName] || 0) + 1;
      }
    });
  });
  return inventory;
}

function getRemainingInventory() {
  const remaining = getProblemInventory();
  state.colorGrid.forEach((row) => {
    row.forEach((stack) => {
      stack.forEach((colorName) => {
        remaining[colorName] = Math.max(0, (remaining[colorName] || 0) - 1);
      });
    });
  });
  return remaining;
}

function sumGrid(grid) {
  return grid.flat().reduce((sum, value) => sum + value, 0);
}

function setStars(count) {
  document.querySelector("#stars").textContent = `${"★".repeat(count)}${"☆".repeat(Math.max(0, 5 - count))}`;
}

function takeFromPile(event) {
  if (Date.now() - state.lastDragAt < 250) return;
  if (state.draggingCube || state.successPending) return;
  if (state.countMode) {
    showToast(t("buildFirst"));
    return;
  }
  selectPileColorFromEvent(event);
  state.holdingCube = true;
  setGuide("guideHold");
  updateBuilderControls();
}

function startBuildCubeDrag(event, x, z) {
  if (state.successPending) return;
  const topY = state.grid[z][x] - 1;
  state.selectedColor = state.colorGrid[z]?.[x]?.[topY] || "cube";
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
  selectPileColorFromEvent(event);
  const remaining = getRemainingInventory();
  if (isColorProblem() && (remaining[state.selectedColor] || 0) <= 0) {
    showToast(t("pileFirst"));
    updateBuilderControls();
    return;
  }
  state.holdingCube = true;
  state.draggingCube = true;
  state.draggingFromBoard = null;
  state.dragCell = null;
  state.pileTarget = false;
  state.dragLiftY = getDragLift(event.pointerType);
  document.querySelector("#cubePile").setPointerCapture?.(event.pointerId);
  moveDragGhost(event.clientX, event.clientY);
  document.querySelector("#dragGhost").classList.add("show");
  if (state.tutorialStep === 0) {
    setTutorialStep(1, "tutorialPlace");
  } else {
    setGuide("guideHold");
  }
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

function selectPileColorFromEvent(event) {
  if (!isColorProblem()) {
    state.selectedColor = "cube";
    return;
  }
  const selected = event?.target?.closest?.("[data-cube-color]")?.dataset?.cubeColor;
  if (selected) state.selectedColor = selected;
  const remaining = getRemainingInventory();
  if ((remaining[state.selectedColor] || 0) <= 0) {
    state.selectedColor = Object.keys(remaining).find((key) => remaining[key] > 0) || "cube";
  }
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
  const offset = (getProblemBoardSize() - 1) / 2;
  dropMarker.position.set(cell.x - offset, targetHeight + 0.5, cell.z - offset);
  dropMarker.visible = true;
  if (state.tutorialStep === 1) setGuide("tutorialPlace");
  else setGuide("guideDrop");
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
  const size = getProblemBoardSize();
  const offset = (size - 1) / 2;
  const planeNormal = new THREE.Vector3(0, 1, 0);
  for (let z = 0; z < size; z += 1) {
    for (let x = 0; x < size; x += 1) {
      const height = getDropHeight(x, z);
      if (height >= 4) continue;

      const plane = new THREE.Plane(planeNormal, -height);
      const point = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(plane, point)) continue;

      const centerX = x - offset;
      const centerZ = z - offset;
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
      state.colorGrid[source.z][source.x].pop();
      state.grid[source.z][source.x] = Math.max(0, state.grid[source.z][source.x] - 1);
      renderBuild();
      playRemovalSound();
      if (state.tutorialStep === 3) completeTutorial();
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
      const movingColor = state.colorGrid[source.z][source.x].pop() || "cube";
      state.grid[source.z][source.x] = Math.max(0, state.grid[source.z][source.x] - 1);
      state.colorGrid[target.z][target.x][state.grid[target.z][target.x]] = movingColor;
      state.grid[target.z][target.x] = Math.min(4, state.grid[target.z][target.x] + 1);
      renderBuild();
      playPlacementSound();
      handlePlacementFeedback(state.grid[target.z][target.x] - 1, target.x, target.z);
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

  const colorProblem = isColorProblem();
  pile.classList.toggle("color-problem", colorProblem);
  pile.classList.toggle("holding", state.holdingCube);
  hand.textContent = state.holdingCube ? t("inHand") : t("emptyHand");
  updateWoodPile();
  updateColorTray();
  updateDragGhostColor();
}

function updateWoodPile() {
  const pile = document.querySelector(".pile-cubes");
  const countLabel = document.querySelector("#woodPileCount");
  if (!pile || !countLabel) return;
  const remaining = getRemainingInventory().cube || 0;
  countLabel.textContent = `x${remaining}`;
  pile.querySelectorAll(":scope > span").forEach((cube, index) => {
    cube.hidden = isColorProblem() || index >= Math.min(remaining, 13);
  });
}

function updateColorTray() {
  const tray = document.querySelector("#colorTray");
  if (!tray) return;
  const remaining = getRemainingInventory();
  tray.querySelectorAll("[data-cube-color]").forEach((button) => {
    const colorName = button.dataset.cubeColor;
    const count = remaining[colorName] || 0;
    button.hidden = !isColorProblem() || count <= 0;
    button.disabled = count <= 0;
    button.classList.toggle("active", colorName === state.selectedColor);
    const label = button.querySelector("strong");
    if (label) label.textContent = `x${count}`;
  });
}

function updateDragGhostColor() {
  const ghost = document.querySelector("#dragGhost");
  if (!ghost) return;
  ghost.dataset.cubeColor = state.selectedColor;
}

function setGuide(key, force = false) {
  if (!force && state.guideKey === key) return;
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

function setRandomGuide(keys, stateKey) {
  const candidates = keys.filter((key) => key !== state[stateKey]);
  const key = candidates[Math.floor(Math.random() * candidates.length)] || keys[0];
  state[stateKey] = key;
  setGuide(key, true);
}

function handlePlacementFeedback(previousHeight, x, z) {
  if (state.tutorialStep === 1) {
    setTutorialStep(2, "tutorialStack");
    showTutorialStackMarker(x, z, previousHeight + 1);
    return;
  }
  if (state.tutorialStep === 2) {
    if (previousHeight >= 1) setTutorialStep(3, "tutorialReturn");
    else setGuide("tutorialStack", true);
    return;
  }
  if (state.tutorialStep === 3) {
    setGuide("tutorialReturn");
    return;
  }
  setRandomGuide(
    ["guidePlaced1", "guidePlaced2", "guidePlaced3", "guidePlaced4"],
    "lastPlacementGuide"
  );
}

const tutorialStorageKey = "gfield-copy-build-tutorial-v1";

function maybeStartTutorial() {
  const forceTutorial = new URLSearchParams(window.location.search).get("tutorial") === "1";
  const firstProblem = state.levelIndex === 0 && state.problemIndex === 0 && !isColorProblem();
  if (!firstProblem || (!forceTutorial && localStorage.getItem(tutorialStorageKey))) {
    clearTutorialHighlights();
    state.tutorialStep = -1;
    return false;
  }
  state.tutorialStep = 0;
  setTutorialStep(0, "tutorialTake");
  return true;
}

function setTutorialStep(step, guideKey) {
  state.tutorialStep = step;
  clearTutorialHighlights();
  dropMarker.visible = false;
  const pile = document.querySelector("#cubePile");
  const build = document.querySelector(".build-view");
  if (step === 0 || step === 3) pile?.classList.add("tutorial-highlight");
  if (step === 1 || step === 2) build?.classList.add("tutorial-highlight");
  if (step === 0) showTutorialMarker();
  setGuide(guideKey, true);
}

function showTutorialStackMarker(x, z, height) {
  const size = getProblemBoardSize();
  const offset = (size - 1) / 2;
  dropMarker.position.set(x - offset, height + 0.5, z - offset);
  dropMarker.visible = true;
}

function showTutorialMarker() {
  const problem = getProblemData();
  const size = getProblemBoardSize(problem);
  const offset = (size - 1) / 2;
  for (let z = 0; z < problem.grid.length; z += 1) {
    const x = problem.grid[z].findIndex((height) => height > 0);
    if (x >= 0) {
      dropMarker.position.set(x - offset, 0.5, z - offset);
      dropMarker.visible = true;
      return;
    }
  }
}

function completeTutorial() {
  state.tutorialStep = -1;
  localStorage.setItem(tutorialStorageKey, "done");
  clearTutorialHighlights();
  dropMarker.visible = false;
  setGuide("tutorialDone", true);
}

function clearTutorialHighlights() {
  document.querySelector("#cubePile")?.classList.remove("tutorial-highlight");
  document.querySelector(".build-view")?.classList.remove("tutorial-highlight");
}

let effectsContext = null;

function getEffectsContext() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return null;
  effectsContext ||= new Context();
  if (effectsContext.state === "suspended") effectsContext.resume();
  return effectsContext;
}

function playWoodTone(frequency, duration, volume, type = "triangle", delay = 0) {
  const context = getEffectsContext();
  if (!context) return;
  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(80, frequency * 0.72), start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playPlacementSound() {
  playWoodTone(330, 0.09, 0.085);
  playWoodTone(165, 0.075, 0.055, "sine", 0.012);
}

function playRemovalSound() {
  playWoodTone(230, 0.11, 0.055, "triangle");
}

function playSuccessSound() {
  playWoodTone(392, 0.14, 0.06, "sine");
  playWoodTone(523, 0.18, 0.055, "sine", 0.09);
  playWoodTone(659, 0.21, 0.05, "sine", 0.18);
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
