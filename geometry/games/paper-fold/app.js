import { levels, validateLevels, foldedPolygon } from "./levels.js?v=paper-fold-12";
import { punchVertices } from "./mark-geometry.js?v=paper-fold-1";
import { saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const lang = localStorage.getItem("gfield-language") || "ko";
const CHUNK_SIZE = 10;
const MAX_SESSION_SIZE = 20;
const requestedCount = Number(params.get("count")) === 20 ? 20 : CHUNK_SIZE;
const progressKey = "gfield-paper-fold-progress-v4";
const recentKey = "gfield-paper-fold-recent-v4";

const text = {
  ko: {
    back: "색종이 생각 놀이터로 나가기", type: "유형", hint: "힌트", retry: "다시", worksheet: "학습지",
    next: "다음 문제", chooseType: "유형 선택", close: "닫기", finish: "마치기",
    choicePrompt: "접은 색종이를 펼쳤을 때 나타나는 모양을 고르세요.",
    connectPrompt: "접어 자른 모습과 펼친 결과를 알맞게 선으로 이으세요.",
    holeConnectPrompt: "구멍을 뚫은 모습과 펼친 결과를 알맞게 선으로 이으세요.",
    selectFolded: "왼쪽의 접어 자른 색종이를 먼저 고르세요.",
    selectResult: "이제 알맞은 펼친 결과를 고르세요.",
    check: "확인", correct: "맞았어요. 접은 선을 기준으로 양쪽 모양이 서로 대칭이에요.",
    wrong: "접은 선을 거울처럼 생각해 다시 살펴보세요.",
    hintChoice: "자른 선을 접은 선 반대쪽에도 똑같이 비춰 보세요.",
    hintConnect: "접은 선의 방향과 잘린 선의 꺾인 모양을 함께 비교하세요.",
    hintHoleConnect: "접은 선을 하나씩 거꾸로 펼치며 구멍 위치를 비교하세요.",
    complete10: "10문제를 해결했어요!", complete20: "20문제를 모두 해결했어요!",
    continue10: "10문제 더 풀기", new10: "새 10문제 풀기", otherType: "다른 유형",
    completeText10: "같은 유형을 10문제 더 이어서 풀 수 있어요.",
    completeText20: "선 잇기와 선택 문제를 모두 차근차근 해결했어요.",
    openPaper: "펼친 색종이", foldedPaper: "한 번 접은 색종이", cutPaper: "선을 따라 자르기",
    result: "펼친 결과", question: "어떤 모양일까요?", problemCount: "{current} / {total}",
    choiceLabel: "보기 {label}", foldedLabel: "접어 자른 색종이 {label}", resultLabel: "펼친 결과 {label}",
    whereDraw: "어느 쪽에 더 그릴까요?", openedCuts: "펼친 절단선", punchPaper: "구멍을 뚫은 색종이",
    firstFold: "첫 번째 접기", secondFold: "두 번째 접기",
    mirrorSidePrompt: "펼쳤을 때 같은 선이나 구멍을 더 표시할 쪽을 고르세요.",
    foldSidePrompt: "{step} 접기 후 색종이가 놓이는 쪽을 고르세요.",
    touchPaperPrompt: "문제 그림의 색종이 면을 직접 눌러 접거나 펼치세요.",
    unfoldStep: "{step}단계 펼치기",
    unfoldSidePrompt: "마지막 접기부터 거꾸로 펼칩니다. 새 표시가 생길 면을 누르세요. ({step}/{total})",
    touchUnfoldPrompt: "점선 접기를 보고, 펼쳤을 때 새 선이나 구멍이 생길 종이 면을 직접 누르세요.",
    countPiecesPrompt: "완성된 절단선을 보고 조각 수를 고르세요.",
    countHolesPrompt: "완전히 펼쳤을 때 생기는 구멍 수를 고르세요.",
    holeResultPrompt: "두 번 거꾸로 펼쳤을 때의 구멍 위치를 고르세요.",
    piecesUnit: "조각", holesUnit: "개",
    layerCount: "{count}겹",
    side_left: "왼쪽", side_right: "오른쪽", side_top: "위쪽", side_bottom: "아래쪽", side_upper: "대각선 위쪽", side_lower: "대각선 아래쪽",
    soundOn: "소리 켜기", soundOff: "소리 끄기"
  },
  zh: {
    back: "返回折纸思维乐园", type: "类型", hint: "提示", retry: "重来", worksheet: "学习单", next: "下一题", chooseType: "选择类型", close: "关闭", finish: "完成",
    choicePrompt: "选择彩纸展开后出现的图形。", connectPrompt: "把折剪后的彩纸和展开结果连起来。", holeConnectPrompt: "把打孔后的纸和展开结果连起来。", selectFolded: "先选择左边折剪后的彩纸。", selectResult: "再选择对应的展开结果。", check: "确认", correct: "答对了。两边图形关于折痕对称。", wrong: "把折痕想成镜子，再看一看。", hintChoice: "把剪线映到折痕的另一边。", hintConnect: "比较折痕方向和剪线的转折。", hintHoleConnect: "按相反顺序逐条展开折痕，比较孔的位置。", complete10: "完成10题！", complete20: "完成全部20题！", continue10: "再做10题", new10: "新的10题", otherType: "其他类型", completeText10: "还可以继续完成同类型的10题。", completeText20: "你完成了连线和选择题。", openPaper: "展开的彩纸", foldedPaper: "对折一次", cutPaper: "沿线剪开", result: "展开结果", question: "会是什么图形？", problemCount: "{current} / {total}", choiceLabel: "选项{label}", foldedLabel: "折剪彩纸{label}", resultLabel: "展开结果{label}", whereDraw: "还要画在哪一边？", openedCuts: "展开后的剪线", punchPaper: "打孔后的彩纸", firstFold: "第一次折叠", secondFold: "第二次折叠", mirrorSidePrompt: "展开后，应在哪一边补上相同的线或孔？", foldSidePrompt: "第{step}次折叠后，彩纸落在哪一边？", touchPaperPrompt: "请直接点击题目图中的彩纸面。", unfoldStep: "第{step}步展开", unfoldSidePrompt: "从最后一道折痕开始反向展开。点击新标记出现的一面。({step}/{total})", touchUnfoldPrompt: "沿虚线展开，直接点击新剪线或孔会出现的纸面。", countPiecesPrompt: "观察完整剪线，选择纸片数量。", countHolesPrompt: "选择完全展开后的孔数。", holeResultPrompt: "选择反向展开两次后的孔位。", piecesUnit: "片", holesUnit: "个", layerCount: "{count}层", side_left: "左边", side_right: "右边", side_top: "上边", side_bottom: "下边", side_upper: "对角线上方", side_lower: "对角线下方", soundOn: "开启声音", soundOff: "关闭声音"
  },
  ja: {
    back: "色紙思考ひろばへ戻る", type: "種類", hint: "ヒント", retry: "もう一度", worksheet: "プリント", next: "次の問題", chooseType: "種類を選ぶ", close: "閉じる", finish: "終わる",
    choicePrompt: "折った色紙を開いたときの形を選びましょう。", connectPrompt: "折って切った形と開いた結果を線で結びましょう。", holeConnectPrompt: "穴をあけた形と開いた結果を線で結びましょう。", selectFolded: "左の折って切った色紙を先に選びます。", selectResult: "対応する開いた結果を選びます。", check: "確かめる", correct: "正解です。折り線をはさんで対称です。", wrong: "折り線を鏡だと考えて見直しましょう。", hintChoice: "切った線を折り線の反対側に映します。", hintConnect: "折り線の向きと切った線の曲がり方を比べます。", hintHoleConnect: "折った順と反対に一つずつ開き、穴の位置を比べます。", complete10: "10問できました！", complete20: "20問すべてできました！", continue10: "あと10問", new10: "新しい10問", otherType: "別の種類", completeText10: "同じ種類をあと10問続けられます。", completeText20: "線結びと選択問題を解きました。", openPaper: "開いた色紙", foldedPaper: "一回折った色紙", cutPaper: "線にそって切る", result: "開いた結果", question: "どんな形？", problemCount: "{current} / {total}", choiceLabel: "選択肢{label}", foldedLabel: "折って切った色紙{label}", resultLabel: "開いた結果{label}", whereDraw: "どちら側にもう一つ描きますか？", openedCuts: "開いた切り線", punchPaper: "穴をあけた色紙", firstFold: "一回目の折り", secondFold: "二回目の折り", mirrorSidePrompt: "開いたとき、同じ線や穴を加える側を選びましょう。", foldSidePrompt: "{step}回目に折った後、色紙はどちら側に重なりますか？", touchPaperPrompt: "問題の図にある色紙の面を直接タップしましょう。", unfoldStep: "{step}段階目を開く", unfoldSidePrompt: "最後の折り目から逆に開きます。新しい印が現れる面をタップします。({step}/{total})", touchUnfoldPrompt: "点線の折り目を見て、新しい切り線や穴が現れる紙面を直接タップします。", countPiecesPrompt: "完成した切り線を見て、紙片の数を選びましょう。", countHolesPrompt: "全部開いたときの穴の数を選びましょう。", holeResultPrompt: "二回逆に開いたときの穴の位置を選びましょう。", piecesUnit: "枚", holesUnit: "個", layerCount: "{count}枚重ね", side_left: "左", side_right: "右", side_top: "上", side_bottom: "下", side_upper: "対角線の上側", side_lower: "対角線の下側", soundOn: "音を出す", soundOff: "音を消す"
  },
  en: {
    back: "Back to Paper Thinking Studio", type: "Type", hint: "Hint", retry: "Restart", worksheet: "Worksheet", next: "Next", chooseType: "Choose a type", close: "Close", finish: "Finish",
    choicePrompt: "Choose the shape that appears when the folded paper opens.", connectPrompt: "Connect each folded cut to its open result.", holeConnectPrompt: "Connect each punched paper to its open result.", selectFolded: "Choose a folded cut on the left first.", selectResult: "Now choose its open result.", check: "Check", correct: "Correct. The two sides mirror across the crease.", wrong: "Treat the crease like a mirror and look again.", hintChoice: "Reflect the cut line across the crease.", hintConnect: "Compare both the crease direction and the turns in the cut.", hintHoleConnect: "Open the creases in reverse order and compare each hole position.", complete10: "10 problems complete!", complete20: "All 20 problems complete!", continue10: "Do 10 more", new10: "New set of 10", otherType: "Other type", completeText10: "You can continue with 10 more problems of this type.", completeText20: "You completed both matching and choice problems.", openPaper: "Open paper", foldedPaper: "Paper folded once", cutPaper: "Cut along the line", result: "Open result", question: "What will appear?", problemCount: "{current} / {total}", choiceLabel: "Choice {label}", foldedLabel: "Folded cut {label}", resultLabel: "Open result {label}", whereDraw: "Which side needs another mark?", openedCuts: "Open cut lines", punchPaper: "Punched paper", firstFold: "First fold", secondFold: "Second fold", mirrorSidePrompt: "Choose the side that needs the matching line or hole when opened.", foldSidePrompt: "Which side holds the paper after fold {step}?", touchPaperPrompt: "Tap the paper face directly in the problem picture.", unfoldStep: "Unfold step {step}", unfoldSidePrompt: "Open the last crease first. Tap the face where the new mark will appear. ({step}/{total})", touchUnfoldPrompt: "Use the dashed crease and tap the paper face where the reflected cut or hole will appear.", countPiecesPrompt: "Use the completed cut lines to choose the number of pieces.", countHolesPrompt: "Choose the number of holes after the paper opens completely.", holeResultPrompt: "Choose the hole positions after opening both folds in reverse.", piecesUnit: "pieces", holesUnit: "holes", layerCount: "{count} layers", side_left: "Left", side_right: "Right", side_top: "Top", side_bottom: "Bottom", side_upper: "Above the diagonal", side_lower: "Below the diagonal", soundOn: "Turn sound on", soundOff: "Mute sound"
  }
};

const t = (key, values = {}) => {
  let value = text[lang]?.[key] || text.ko[key] || key;
  Object.entries(values).forEach(([name, replacement]) => { value = value.replace(`{${name}}`, replacement); });
  return value;
};
const local = (value) => value?.[lang] || value?.ko || "";
const shuffled = (items) => [...items].sort(() => Math.random() - .5);

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || "") || fallback; } catch { return fallback; }
}

function idsToProblems(levelIndex, ids = []) {
  const byId = new Map(levels[levelIndex].problems.map((item) => [item.id, item]));
  const problems = ids.map((id) => byId.get(id)).filter(Boolean);
  return problems.length === ids.length ? problems : [];
}

function createChunk(levelIndex, count, excluded = new Set()) {
  const pool = levels[levelIndex].problems;
  const available = pool.filter((problem) => !excluded.has(problem.id));
  const source = available.length >= count ? available : pool;
  const groups = {
    solo: shuffled(source.filter((problem) => problem.interaction !== "connect-match")),
    "connect-match": shuffled(source.filter((problem) => problem.interaction === "connect-match"))
  };
  const pattern = ["solo", "connect-match", "solo", "solo", "connect-match", "solo", "solo", "connect-match", "solo", "connect-match"];
  return Array.from({ length: count }, (_, index) => {
    const kind = pattern[index % pattern.length];
    return groups[kind].shift() || groups[kind === "solo" ? "connect-match" : "solo"].shift();
  }).filter(Boolean);
}

const saved = readJson(progressKey, {});
const requestedLevel = Math.max(1, Math.min(2, Number(params.get("level") || saved.level) || 1));
const canRestore = !params.has("level") && Number(saved.level) === requestedLevel && Array.isArray(saved.queue);
const restored = canRestore ? idsToProblems(requestedLevel - 1, saved.queue) : [];
const initialQueue = restored.length >= CHUNK_SIZE
  ? restored
  : createChunk(requestedLevel - 1, requestedCount);

const state = {
  level: requestedLevel - 1,
  queue: initialQueue,
  index: canRestore ? Math.max(0, Math.min(initialQueue.length - 1, Number(saved.index) || 0)) : 0,
  solved: false,
  busy: false,
  phase: 0,
  selectedLeft: null,
  connections: new Map()
};

const ui = {
  paper: $("#paper"), status: $("#foldStatus"), prompt: $("#prompt"), answerPrompt: $("#answerPrompt"),
  interaction: $("#interaction"), next: $("#nextButton"), levelDialog: $("#levelDialog"), levelList: $("#levelList"),
  complete: $("#completeDialog"), success: $("#success"), toast: $("#toast")
};

const problem = () => state.queue[state.index];
const level = () => levels[state.level];
const points = (items, size = 160, offset = 20) => items.map((item) => `${offset + item.x * size},${offset + item.y * size}`).join(" ");
const path = (items, size = 160, offset = 20) => items.map((item, index) => `${index ? "L" : "M"}${offset + item.x * size} ${offset + item.y * size}`).join(" ");

function creaseLine(foldSpec) {
  if (foldSpec.axis === "vertical") return [100, 20, 100, 180];
  if (foldSpec.axis === "horizontal") return [20, 100, 180, 100];
  if (foldSpec.axis === "diag-main") return [20, 20, 180, 180];
  return [180, 20, 20, 180];
}

function polygonBounds(polygon = null) {
  const shape = polygon || [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  return {
    minX: Math.min(...shape.map((item) => item.x)), maxX: Math.max(...shape.map((item) => item.x)),
    minY: Math.min(...shape.map((item) => item.y)), maxY: Math.max(...shape.map((item) => item.y))
  };
}

function arrowPath(foldSpec, polygon = null) {
  const box = polygonBounds(polygon);
  const sx = (value) => 20 + value * 160;
  const sy = (value) => 20 + value * 160;
  const midX = (box.minX + box.maxX) / 2;
  const midY = (box.minY + box.maxY) / 2;
  const width = box.maxX - box.minX;
  const height = box.maxY - box.minY;
  if (foldSpec.axis === "vertical") {
    const from = foldSpec.side === "left" ? box.minX + width * .2 : box.maxX - width * .2;
    const to = foldSpec.side === "left" ? box.maxX - width * .2 : box.minX + width * .2;
    const bendY = Math.max(box.minY + .06, midY - height * .22);
    return `M${sx(from)} ${sy(midY)} Q${sx(midX)} ${sy(bendY)} ${sx(to)} ${sy(midY)}`;
  }
  if (foldSpec.axis === "horizontal") {
    const from = foldSpec.side === "top" ? box.minY + height * .2 : box.maxY - height * .2;
    const to = foldSpec.side === "top" ? box.maxY - height * .2 : box.minY + height * .2;
    const bendX = Math.min(box.maxX - .06, midX + width * .22);
    return `M${sx(midX)} ${sy(from)} Q${sx(bendX)} ${sy(midY)} ${sx(midX)} ${sy(to)}`;
  }
  const diagonalPoints = {
    "diag-main-upper": [[.76, .24], [.24, .76]],
    "diag-main-lower": [[.24, .76], [.76, .24]],
    "diag-anti-upper": [[.24, .24], [.76, .76]],
    "diag-anti-lower": [[.76, .76], [.24, .24]]
  }[`${foldSpec.axis}-${foldSpec.side}`];
  const [[fromX, fromY], [toX, toY]] = diagonalPoints;
  const curveX = (fromX + toX) / 2 + (foldSpec.axis === "diag-main" ? .08 : -.08);
  const curveY = (fromY + toY) / 2 - .08;
  return `M${sx(fromX)} ${sy(fromY)} Q${sx(curveX)} ${sy(curveY)} ${sx(toX)} ${sy(toY)}`;
}

function sideHitPath(side, axis) {
  if (side === "left") return "M20 20 H100 V180 H20 Z";
  if (side === "right") return "M100 20 H180 V180 H100 Z";
  if (side === "top") return "M20 20 H180 V100 H20 Z";
  if (side === "bottom") return "M20 100 H180 V180 H20 Z";
  if (axis === "diag-main") return side === "upper"
    ? "M20 20 H180 V180 Z"
    : "M20 20 L180 180 H20 Z";
  return side === "upper"
    ? "M20 20 H180 L20 180 Z"
    : "M180 20 V180 H20 Z";
}

function touchZonesHtml(step, clipId) {
  if (!step) return "";
  return `<g class="paper-touch-zones" clip-path="url(#${clipId})">${step.choices.map((side) => `<path class="paper-touch-zone" d="${sideHitPath(side, step.axis)}" data-side="${side}" role="button" tabindex="0" aria-label="${t(`side_${side}`)}"/>`).join("")}</g>`;
}

function segmentLines(segments) {
  return segments.map(([a, b]) => `<line class="paper-cut-line" x1="${20 + a.x * 160}" y1="${20 + a.y * 160}" x2="${20 + b.x * 160}" y2="${20 + b.y * 160}"/>`).join("");
}

function holeCircles(holes) {
  return holes.map((hole) => `<circle class="paper-hole" cx="${20 + hole.x * 160}" cy="${20 + hole.y * 160}" r="8"/>`).join("");
}

function markShapes(marks) {
  return marks.map((mark) => {
    if (mark.kind === "polygon") return `<polygon class="paper-cut-region" points="${points(mark.points)}"/>`;
    if (mark.shape === "circle") return `<circle class="paper-shape-hole" cx="${20 + mark.center.x * 160}" cy="${20 + mark.center.y * 160}" r="${mark.radius * 160}"/>`;
    return `<polygon class="paper-shape-hole" points="${points(punchVertices(mark))}"/>`;
  }).join("");
}

function paperSvg({ fold = null, polygon = null, segments = [], holes = [], marks = [], view = "open", label = "", marker = "arrow", showArrow = false, showScissors = false, layerCount = 1, touchStep = null, touchAction = "fold" }) {
  const shape = polygon || (view === "folded" && fold ? foldedPolygon(fold) : null);
  const baseShape = shape || [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const clipId = `clip-${marker}`;
  const stackDepth = Math.max(0, layerCount - 1);
  const edgeStep = layerCount > 2 ? 3.4 : 5;
  const winding = Math.sign(baseShape.reduce((sum, point, index) => {
    const next = baseShape[(index + 1) % baseShape.length];
    return sum + point.x * next.y - next.x * point.y;
  }, 0));
  const visibleEdges = baseShape.flatMap((start, index) => {
    const end = baseShape[(index + 1) % baseShape.length];
    return winding * ((end.y - start.y) - (end.x - start.x)) > 0.0001 ? [[start, end]] : [];
  });
  const stackLayers = Array.from({ length: stackDepth }, (_, index) => stackDepth - index).map((depth) => {
    const rear = depth * edgeStep;
    const front = (depth - 1) * edgeStep;
    const sideFaces = visibleEdges.map(([start, end]) => {
      const quad = [
        { x: start.x + front / 160, y: start.y + front / 160 },
        { x: end.x + front / 160, y: end.y + front / 160 },
        { x: end.x + rear / 160, y: end.y + rear / 160 },
        { x: start.x + rear / 160, y: start.y + rear / 160 }
      ];
      return `<polygon class="paper-stack-side" points="${points(quad)}"/>`;
    }).join("");
    return `<polygon class="paper-stack-layer" points="${points(baseShape)}" transform="translate(${rear} ${rear})"/>${sideFaces}`;
  }).join("");
  const paperShape = `${stackLayers}<polygon class="paper-fill paper-top-face${shape ? " folded-sheet" : ""}" points="${points(baseShape)}"/>`;
  const crease = fold && view !== "folded" ? (() => {
    let [x1, y1, x2, y2] = creaseLine(fold);
    if (shape && !fold.axis.startsWith("diag")) {
      const minX = Math.min(...shape.map((item) => item.x));
      const maxX = Math.max(...shape.map((item) => item.x));
      const minY = Math.min(...shape.map((item) => item.y));
      const maxY = Math.max(...shape.map((item) => item.y));
      if (fold.axis === "vertical") [y1, y2] = [20 + minY * 160, 20 + maxY * 160];
      else [x1, x2] = [20 + minX * 160, 20 + maxX * 160];
    }
    return `<line class="paper-crease" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  })() : "";
  const movingFace = fold && showArrow ? `<path class="paper-moving-face" d="${sideHitPath(fold.side, fold.axis)}" clip-path="url(#${clipId})"/>` : "";
  const foldArrow = fold && showArrow ? `<path class="paper-fold-arrow" d="${arrowPath(fold, baseShape)}" marker-end="url(#${marker})"/>` : "";
  const cutAnchor = segments[0]?.[0] || marks.find((mark) => mark.kind === "polygon")?.points?.[0];
  const scissors = showScissors && cutAnchor ? `<text class="scissors" x="${20 + cutAnchor.x * 160 - 8}" y="${20 + cutAnchor.y * 160 - 6}">✂</text>` : "";
  const foldClass = fold ? ` fold-${fold.axis}-${fold.side}` : "";
  return `<svg class="paper-diagram view-${view}${touchStep ? " is-touchable" : ""}${foldClass}" data-touch-action="${touchAction}" data-fold-axis="${fold?.axis || touchStep?.axis || ""}" data-fold-side="${fold?.side || ""}" data-stack-depth="${stackDepth}" viewBox="0 0 200 200" role="${touchStep ? "group" : "img"}" aria-label="${label}">
    <defs><clipPath id="${clipId}"><polygon points="${points(baseShape)}"/></clipPath><marker id="${marker}" markerWidth="7" markerHeight="7" refX="6.4" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3.5 L0 7 Z"/></marker></defs>
    ${paperShape}${markShapes(marks)}${crease}${movingFace}${foldArrow}${segmentLines(segments)}${holeCircles(holes)}${scissors}${touchZonesHtml(touchStep, clipId)}
  </svg>`;
}

function unfoldStage(p, activePhase, stages) {
  const phase = Math.max(0, Math.min(activePhase, p.unfoldSteps.length - 1));
  const foldIndex = p.folds.length - 1 - phase;
  return {
    phase,
    step: p.unfoldSteps[phase],
    polygon: p.stagePolygons[foldIndex],
    marks: stages[phase],
    layerCount: 2 ** foldIndex
  };
}

function unfoldFigureHtml(p, { reveal, activePhase, suffix, segments = null, holes = null, marks = null }) {
  if (reveal) {
    return `<figure class="result-step">${paperSvg({
      polygon: p.stagePolygons[0],
      segments: segments?.at(-1) || [], holes: holes?.at(-1) || [], marks: marks?.at(-1) || [],
      view: "result", label: t("result"), marker: `result-${suffix}`
    })}<figcaption>${segments || p.kind === "cut-regions" ? t("openedCuts") : t("result")}</figcaption></figure>`;
  }
  const current = unfoldStage(p, activePhase, segments || holes || marks);
  return `<figure class="result-step paper-action-step">${paperSvg({
    fold: current.step.displayFold, polygon: current.polygon,
    segments: segments ? current.marks : [], holes: holes ? current.marks : [], marks: marks ? current.marks : [],
    view: "result", label: t("unfoldStep", { step: current.phase + 1 }), marker: `unfold-${suffix}-${current.phase}`,
    showArrow: true, layerCount: current.layerCount, touchStep: current.step, touchAction: "unfold"
  })}<figcaption>${t("unfoldStep", { step: current.phase + 1 })}</figcaption></figure>`;
}

function pieceSequenceHtml(p, reveal = false, activePhase = -1) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  if (p.folds.length > 1) {
    return `<div class="fold-sequence-view four-step${reveal ? " revealing" : ""}">
      <figure>${paperSvg({ fold: p.folds[0], polygon: p.stagePolygons[0], view: "open", label: t("firstFold"), marker: `first-${suffix}`, showArrow: true })}<figcaption>${t("firstFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ fold: p.folds[1], polygon: p.stagePolygons[1], view: "stage", label: t("secondFold"), marker: `second-${suffix}`, showArrow: true, layerCount: 2 })}<figcaption>${t("secondFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ polygon: p.stagePolygons[2], segments: p.cutSegments, view: "folded", label: t("cutPaper"), marker: `cut-${suffix}`, showScissors: true, layerCount: 4 })}<figcaption>${t("cutPaper")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      ${unfoldFigureHtml(p, { reveal, activePhase, suffix, segments: p.segmentStages })}
    </div>`;
  }
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.fold, view: "open", label: t("openPaper"), marker: `fold-${suffix}`, showArrow: true })}<figcaption>${t("openPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.fold, segments: p.cutSegments, view: "folded", label: t("cutPaper"), marker: `cut-${suffix}`, showScissors: true, layerCount: 2 })}<figcaption>${t("cutPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    ${unfoldFigureHtml(p, { reveal, activePhase, suffix, segments: p.segmentStages })}
  </div>`;
}

function singleHoleSequenceHtml(p, reveal = false, activePhase = -1) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.fold, view: "open", label: t("openPaper"), marker: `fold-${suffix}`, showArrow: true })}<figcaption>${t("openPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.fold, holes: p.punches, view: "folded", label: t("punchPaper"), marker: `punch-${suffix}`, layerCount: 2 })}<figcaption>${t("punchPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    ${unfoldFigureHtml(p, { reveal, activePhase, suffix, holes: p.pointStages })}
  </div>`;
}

function doubleHoleSequenceHtml(p, reveal = false, activePhase = -1) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  return `<div class="fold-sequence-view four-step${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.folds[0], polygon: p.stagePolygons[0], view: "open", label: t("firstFold"), marker: `first-${suffix}`, showArrow: true })}<figcaption>${t("firstFold")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.folds[1], polygon: p.stagePolygons[1], view: "stage", label: t("secondFold"), marker: `second-${suffix}`, showArrow: true, layerCount: 2 })}<figcaption>${t("secondFold")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ polygon: p.stagePolygons[2], holes: p.punches, view: "folded", label: t("punchPaper"), marker: `punch-${suffix}`, layerCount: 4 })}<figcaption>${t("punchPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    ${unfoldFigureHtml(p, { reveal, activePhase, suffix, holes: p.pointStages })}
  </div>`;
}

function markSequenceHtml(p, reveal = false, activePhase = -1) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  const authoredMarks = p.kind === "cut-regions" ? p.cutMarks : p.punches;
  const actionLabel = p.kind === "cut-regions"
    ? local({ ko: "색칠한 부분 잘라내기", zh: "剪去涂色部分", ja: "色の部分を切り取る", en: "Cut the colored area" })
    : t("punchPaper");
  const showScissors = p.kind === "cut-regions";
  if (p.folds.length > 1) {
    return `<div class="fold-sequence-view four-step${reveal ? " revealing" : ""}">
      <figure>${paperSvg({ fold: p.folds[0], polygon: p.stagePolygons[0], view: "open", label: t("firstFold"), marker: `first-${suffix}`, showArrow: true })}<figcaption>${t("firstFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ fold: p.folds[1], polygon: p.stagePolygons[1], view: "stage", label: t("secondFold"), marker: `second-${suffix}`, showArrow: true, layerCount: 2 })}<figcaption>${t("secondFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ polygon: p.stagePolygons[2], marks: authoredMarks, view: "folded", label: actionLabel, marker: `mark-${suffix}`, showScissors, layerCount: 4 })}<figcaption>${actionLabel}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      ${unfoldFigureHtml(p, { reveal, activePhase, suffix, marks: p.markStages })}
    </div>`;
  }
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.fold, view: "open", label: t("openPaper"), marker: `fold-${suffix}`, showArrow: true })}<figcaption>${t("openPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.fold, marks: authoredMarks, view: "folded", label: actionLabel, marker: `mark-${suffix}`, showScissors, layerCount: 2 })}<figcaption>${actionLabel}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    ${unfoldFigureHtml(p, { reveal, activePhase, suffix, marks: p.markStages })}
  </div>`;
}

function numberChoicesHtml(p) {
  return `<div class="number-choices">${p.choices.map((choice, index) => `<button class="number-choice" type="button" data-choice="${choice.key}"><b>${index + 1}</b><strong>${choice.value}</strong><span>${t(p.kind === "pieces" ? "piecesUnit" : "holesUnit")}</span></button>`).join("")}</div>`;
}

function holeChoicesHtml(p) {
  return `<div class="result-choices">${p.choices.map((choice, index) => `<button class="result-choice hole-result-choice" type="button" data-choice="${choice.key}" aria-label="${t("choiceLabel", { label: index + 1 })}"><b>${index + 1}</b>${paperSvg({ holes: choice.points, view: "result", label: t("choiceLabel", { label: index + 1 }), marker: `choice-${p.id}-${index}` })}</button>`).join("")}</div>`;
}

function specimenSvg(item, view, marker) {
  if (item.kind === "pieces") {
    const polygon = item.stagePolygons?.at(-1) || foldedPolygon(item.fold);
    return view === "folded"
      ? paperSvg({ polygon, segments: item.cutSegments, view: "folded", label: t("cutPaper"), marker, layerCount: 2 ** item.folds.length })
      : paperSvg({ segments: item.unfoldedSegments, view: "result", label: t("result"), marker });
  }
  if (item.kind === "single-holes") {
    return view === "folded"
      ? paperSvg({ fold: item.fold, holes: item.punches, view: "folded", label: t("punchPaper"), marker, layerCount: 2 })
      : paperSvg({ fold: item.fold, holes: item.unfoldedPoints, view: "result", label: t("result"), marker });
  }
  return view === "folded"
    ? paperSvg({ polygon: item.stagePolygons.at(-1), holes: item.punches, view: "folded", label: t("punchPaper"), marker, layerCount: 4 })
    : paperSvg({ holes: item.unfoldedPoints, view: "result", label: t("result"), marker });
}

function connectBoardHtml(p) {
  return `<div class="connect-board" id="connectBoard">
    <svg class="connection-lines" id="connectionLines" aria-hidden="true"></svg>
    <div class="connect-column folded-column">${p.pairs.map((item, index) => `<button type="button" class="connect-card folded-card" data-left="${item.key}" aria-label="${t("foldedLabel", { label: index + 1 })}"><b>${index + 1}</b>${specimenSvg(item, "folded", `left-${p.id}-${index}`)}</button>`).join("")}</div>
    <div class="connect-column result-column">${p.results.map((item, index) => `<button type="button" class="connect-card result-card" data-right="${item.key}" aria-label="${t("resultLabel", { label: index + 1 })}"><b>${String.fromCharCode(65 + index)}</b>${specimenSvg(item, "result", `right-${p.id}-${index}`)}</button>`).join("")}</div>
  </div>`;
}

function renderConnections() {
  const board = $("#connectBoard");
  const svg = $("#connectionLines");
  if (!board || !svg) return;
  const box = board.getBoundingClientRect();
  svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
  svg.innerHTML = [...state.connections].map(([leftKey, rightKey]) => {
    const leftBox = board.querySelector(`[data-left="${leftKey}"]`).getBoundingClientRect();
    const rightBox = board.querySelector(`[data-right="${rightKey}"]`).getBoundingClientRect();
    const x1 = leftBox.right - box.left;
    const y1 = leftBox.top + leftBox.height / 2 - box.top;
    const x2 = rightBox.left - box.left;
    const y2 = rightBox.top + rightBox.height / 2 - box.top;
    return `<path data-line-left="${leftKey}" d="M${x1} ${y1} C${x1 + 45} ${y1},${x2 - 45} ${y2},${x2} ${y2}"/>`;
  }).join("");
  board.querySelectorAll("[data-left]").forEach((button) => button.classList.toggle("connected", state.connections.has(button.dataset.left)));
  board.querySelectorAll("[data-right]").forEach((button) => button.classList.toggle("connected", [...state.connections.values()].includes(button.dataset.right)));
}

function setGuide(message) {
  $("#guideBubble").textContent = message;
  $("#foldyGuide").classList.add("show");
  clearTimeout(setGuide.timer);
  setGuide.timer = setTimeout(() => $("#foldyGuide").classList.remove("show"), 2400);
}

function toast(message) {
  ui.toast.textContent = message;
  ui.toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ui.toast.classList.remove("show"), 1900);
}

function save() {
  localStorage.setItem(progressKey, JSON.stringify({ level: state.level + 1, index: state.index, queue: state.queue.map((item) => item.id) }));
  saveGameProgress("paperFold", { level: state.level + 1, problemIndex: state.index, queue: state.queue.map((item) => item.id) });
}

function resetProblem() {
  state.solved = false;
  state.busy = false;
  state.phase = 0;
  state.selectedLeft = null;
  state.connections = new Map();
}

function setDirectTouchMode(enabled) {
  document.querySelector(".answer-dock")?.classList.toggle("direct-touch-mode", enabled);
  ui.interaction.classList.toggle("direct-touch-interaction", enabled);
}

function bindPaperTouchZones() {
  ui.paper.querySelectorAll("[data-side]").forEach((zone) => {
    zone.addEventListener("click", () => checkSide(zone));
    zone.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      checkSide(zone);
    });
  });
}

function renderSoloPhase() {
  const p = problem();
  const unfoldSteps = p.unfoldSteps || [];
  const unfolding = state.phase < unfoldSteps.length;

  if (p.interaction === "piece-count") ui.paper.innerHTML = pieceSequenceHtml(p, !unfolding, unfolding ? state.phase : -1);
  else if (p.interaction === "hole-count") ui.paper.innerHTML = singleHoleSequenceHtml(p, !unfolding, unfolding ? state.phase : -1);
  else if (p.interaction === "hole-result") ui.paper.innerHTML = doubleHoleSequenceHtml(p, !unfolding, unfolding ? state.phase : -1);
  else ui.paper.innerHTML = markSequenceHtml(p, !unfolding, unfolding ? state.phase : -1);

  if (unfolding) {
    setDirectTouchMode(true);
    const prompt = t("unfoldSidePrompt", { step: state.phase + 1, total: unfoldSteps.length });
    ui.prompt.textContent = prompt;
    ui.answerPrompt.textContent = prompt;
    ui.interaction.innerHTML = `<p class="touch-instruction">${t("touchUnfoldPrompt")}</p>`;
    bindPaperTouchZones();
    return;
  }

  setDirectTouchMode(false);
  ui.prompt.textContent = t(p.interaction === "piece-count" ? "countPiecesPrompt" : p.interaction === "hole-count" ? "countHolesPrompt" : "holeResultPrompt");
  if (p.interaction === "piece-count" || p.interaction === "hole-count") {
    ui.answerPrompt.textContent = t(p.interaction === "piece-count" ? "countPiecesPrompt" : "countHolesPrompt");
    ui.interaction.innerHTML = numberChoicesHtml(p);
  } else {
    ui.answerPrompt.textContent = t("holeResultPrompt");
    ui.interaction.innerHTML = holeChoicesHtml(p);
  }
  ui.interaction.querySelectorAll("[data-choice]").forEach((button) => button.addEventListener("click", () => checkChoice(button)));
}

function renderProblem() {
  const p = problem();
  resetProblem();
  ui.success.classList.remove("show");
  const guide = $("#foldyGuide");
  guide.classList.add("reset");
  guide.classList.remove("show");
  requestAnimationFrame(() => guide.classList.remove("reset"));
  clearTimeout(setGuide.timer);
  document.documentElement.lang = lang;
  document.title = `GFIELD ${local(level().title)}`;
  $("#levelLabel").textContent = local(level().title);
  $("#problemLabel").textContent = t("problemCount", { current: state.index + 1, total: state.queue.length });
  $("#missionTitle").textContent = local(level().title);
  $("#stars").textContent = p.interaction === "connect-match" ? "●—●" : "○  ○  ○";
  const connectionPrompt = level().strand === "fold-and-punch" ? "holeConnectPrompt" : "connectPrompt";
  ui.prompt.textContent = t(p.interaction === "connect-match" ? connectionPrompt : p.interaction === "piece-count" ? "countPiecesPrompt" : p.interaction === "hole-count" ? "countHolesPrompt" : "holeResultPrompt");
  ui.status.textContent = p.interaction === "connect-match" ? t(connectionPrompt)
    : p.folds.length === 2
      ? local({ ko: "두 번 접은 색종이", zh: "折叠两次的彩纸", ja: "二回折った色紙", en: "Paper folded twice" })
      : t("foldedPaper");
  ui.paper.className = `paper activity-${p.interaction}`;
  ui.next.hidden = true;
  ui.next.textContent = t("next");
  ui.interaction.replaceChildren();
  setDirectTouchMode(false);
  if (p.interaction === "connect-match") {
    ui.paper.innerHTML = connectBoardHtml(p);
    ui.answerPrompt.textContent = t("selectFolded");
    ui.paper.querySelectorAll("[data-left]").forEach((button) => button.addEventListener("click", () => selectLeft(button)));
    ui.paper.querySelectorAll("[data-right]").forEach((button) => button.addEventListener("click", () => selectRight(button)));
    requestAnimationFrame(renderConnections);
  } else renderSoloPhase();
  save();
}

async function solve() {
  state.solved = true;
  state.busy = true;
  setDirectTouchMode(false);
  ui.next.hidden = false;
  ui.paper.classList.add("is-solved");
  if (problem().interaction === "piece-count") ui.paper.innerHTML = pieceSequenceHtml(problem(), true);
  else if (problem().interaction === "hole-count") ui.paper.innerHTML = singleHoleSequenceHtml(problem(), true);
  else if (problem().interaction === "hole-result") ui.paper.innerHTML = doubleHoleSequenceHtml(problem(), true);
  else if (problem().interaction === "region-unfold" || problem().interaction === "mixed-hole-result") ui.paper.innerHTML = markSequenceHtml(problem(), true);
  ui.success.classList.remove("show");
  requestAnimationFrame(() => ui.success.classList.add("show"));
  setGuide(t("correct"));
  ui.status.textContent = t("correct");
  await new Promise((resolve) => setTimeout(resolve, 620));
  state.busy = false;
  ui.next.focus();
}

function checkChoice(button) {
  if (state.solved || state.busy) return;
  if (button.dataset.choice === problem().answer) {
    button.classList.add("correct");
    ui.interaction.querySelectorAll("button").forEach((item) => { item.disabled = true; });
    solve();
  } else {
    button.classList.add("wrong");
    toast(t("wrong"));
    setTimeout(() => button.classList.remove("wrong"), 480);
  }
}

function checkSide(zone) {
  if (state.solved || state.busy) return;
  const step = problem().unfoldSteps[state.phase];
  const figure = zone.closest("figure");
  const diagram = zone.closest(".paper-diagram");
  if (zone.dataset.side === step.answer) {
    state.busy = true;
    zone.classList.add("correct");
    figure?.classList.add("touch-correct");
    diagram?.classList.add("touch-correct");
    setTimeout(() => {
      state.phase += 1;
      state.busy = false;
      if (state.phase >= problem().unfoldSteps.length && (problem().completeOnUnfold || problem().interaction === "hole-result")) solve();
      else renderSoloPhase();
    }, 420);
  } else {
    zone.classList.add("wrong");
    figure?.classList.add("touch-wrong");
    toast(t("wrong"));
    setTimeout(() => {
      zone.classList.remove("wrong");
      figure?.classList.remove("touch-wrong");
    }, 480);
  }
}

function selectLeft(button) {
  if (state.solved || state.busy) return;
  state.selectedLeft = button.dataset.left;
  ui.paper.querySelectorAll("[data-left]").forEach((item) => item.classList.toggle("selected", item === button));
  ui.answerPrompt.textContent = t("selectResult");
}

function selectRight(button) {
  if (state.solved || state.busy || !state.selectedLeft) {
    if (!state.solved) setGuide(t("selectFolded"));
    return;
  }
  const rightKey = button.dataset.right;
  [...state.connections].forEach(([left, right]) => { if (right === rightKey) state.connections.delete(left); });
  state.connections.set(state.selectedLeft, rightKey);
  state.selectedLeft = null;
  ui.paper.querySelectorAll("[data-left]").forEach((item) => item.classList.remove("selected"));
  ui.answerPrompt.textContent = t("selectFolded");
  renderConnections();
  if (state.connections.size === 3) checkConnections();
}

function checkConnections() {
  if (state.solved || state.connections.size !== 3) return;
  const wrong = [...state.connections].filter(([left, right]) => problem().answer[left] !== right);
  if (!wrong.length) {
    ui.paper.querySelectorAll("button").forEach((button) => { button.disabled = true; });
    solve();
    return;
  }
  state.busy = true;
  wrong.forEach(([left]) => {
    ui.paper.querySelector(`[data-left="${left}"]`)?.classList.add("wrong");
    ui.paper.querySelector(`[data-line-left="${left}"]`)?.classList.add("wrong");
    state.connections.delete(left);
  });
  toast(t("wrong"));
  setTimeout(() => {
    ui.paper.querySelectorAll(".wrong").forEach((item) => item.classList.remove("wrong"));
    renderConnections();
    state.busy = false;
    ui.answerPrompt.textContent = t("selectFolded");
  }, 520);
}

function rememberQueue() {
  const recent = readJson(recentKey, {});
  recent[state.level + 1] = state.queue.map((item) => item.id).slice(-MAX_SESSION_SIZE);
  localStorage.setItem(recentKey, JSON.stringify(recent));
}

function showComplete() {
  rememberQueue();
  const canContinue = state.queue.length < MAX_SESSION_SIZE;
  $("#completeTitle").textContent = t(canContinue ? "complete10" : "complete20");
  $("#completeText").textContent = t(canContinue ? "completeText10" : "completeText20");
  $("#nextLevelButton").textContent = t(canContinue ? "continue10" : "otherType");
  $("#practiceButton").textContent = t("new10");
  ui.complete.querySelector("a").textContent = t("finish");
  ui.complete.hidden = false;
}

function nextProblem() {
  if (!state.solved || state.busy) return;
  if (state.index < state.queue.length - 1) {
    state.index += 1;
    renderProblem();
  } else showComplete();
}

function continueTen() {
  if (state.queue.length >= MAX_SESSION_SIZE) {
    selectLevel(state.level === 0 ? 1 : 0);
    return;
  }
  const excluded = new Set(state.queue.map((item) => item.id));
  state.queue.push(...createChunk(state.level, CHUNK_SIZE, excluded));
  state.index += 1;
  ui.complete.hidden = true;
  renderProblem();
}

function newTen() {
  state.queue = createChunk(state.level, CHUNK_SIZE, new Set(state.queue.map((item) => item.id)));
  state.index = 0;
  ui.complete.hidden = true;
  renderProblem();
}

function selectLevel(index) {
  state.level = Math.max(0, Math.min(1, index));
  state.queue = createChunk(state.level, requestedCount);
  state.index = 0;
  ui.levelDialog.hidden = true;
  ui.complete.hidden = true;
  history.replaceState({}, "", `?level=${state.level + 1}`);
  renderProblem();
}

function renderLevelDialog() {
  $("#dialogTitle").textContent = t("chooseType");
  $("#closeLevels").textContent = "×";
  $("#closeLevels").setAttribute("aria-label", t("close"));
  ui.levelList.innerHTML = levels.map((item, index) => `<button type="button" class="level-card" data-level="${index}"><span>${index + 1}</span><strong>${local(item.title)}</strong><small>${local(item.description)}</small></button>`).join("");
  ui.levelList.querySelectorAll("[data-level]").forEach((button) => button.addEventListener("click", () => selectLevel(Number(button.dataset.level))));
}

function applyLabels() {
  $(".exit").setAttribute("aria-label", t("back"));
  $("#levelButton").textContent = t("type");
  $("#hintButton").textContent = t("hint");
  $("#retryButton").textContent = t("retry");
  $(".tool-panel a").textContent = t("worksheet");
}

ui.next.addEventListener("click", nextProblem);
$("#retryButton").addEventListener("click", renderProblem);
$("#hintButton").addEventListener("click", () => {
  const current = problem();
  if (current.interaction === "connect-match") {
    setGuide(t(level().strand === "fold-and-punch" ? "hintHoleConnect" : "hintConnect"));
    return;
  }
  if (state.phase < (current.unfoldSteps?.length || 0)) {
    setGuide(t("touchUnfoldPrompt"));
    return;
  }
  const promptKey = current.interaction === "piece-count"
    ? "countPiecesPrompt"
    : current.interaction === "hole-count"
      ? "countHolesPrompt"
      : "holeResultPrompt";
  setGuide(t(promptKey));
});
$("#levelButton").addEventListener("click", () => { ui.levelDialog.hidden = false; });
$("#closeLevels").addEventListener("click", () => { ui.levelDialog.hidden = true; });
ui.levelDialog.addEventListener("click", (event) => { if (event.target === ui.levelDialog) ui.levelDialog.hidden = true; });
$("#nextLevelButton").addEventListener("click", continueTen);
$("#practiceButton").addEventListener("click", newTen);
addEventListener("resize", () => { if (problem()?.interaction === "connect-match") renderConnections(); });

renderLevelDialog();
applyLabels();
renderProblem();
