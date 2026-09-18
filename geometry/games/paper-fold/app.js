import { levels, validateLevels, foldedPolygon } from "./levels.js?v=paper-fold-9";
import { saveGameProgress } from "../../shared/profile-storage.js";

validateLevels();

const $ = (selector) => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const lang = localStorage.getItem("gfield-language") || "ko";
const CHUNK_SIZE = 10;
const MAX_SESSION_SIZE = 20;
const requestedCount = Number(params.get("count")) === 20 ? 20 : CHUNK_SIZE;
const requestedLevel = Math.max(1, Math.min(2, Number(params.get("level")) || 1));
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
    countPiecesPrompt: "완성된 절단선을 보고 조각 수를 고르세요.",
    countHolesPrompt: "완전히 펼쳤을 때 생기는 구멍 수를 고르세요.",
    holeResultPrompt: "두 번 거꾸로 펼쳤을 때의 구멍 위치를 고르세요.",
    piecesUnit: "조각", holesUnit: "개",
    side_left: "왼쪽", side_right: "오른쪽", side_top: "위쪽", side_bottom: "아래쪽", side_upper: "대각선 위쪽", side_lower: "대각선 아래쪽",
    soundOn: "소리 켜기", soundOff: "소리 끄기"
  },
  zh: {
    back: "返回折纸思维乐园", type: "类型", hint: "提示", retry: "重来", worksheet: "学习单", next: "下一题", chooseType: "选择类型", close: "关闭", finish: "完成",
    choicePrompt: "选择彩纸展开后出现的图形。", connectPrompt: "把折剪后的彩纸和展开结果连起来。", holeConnectPrompt: "把打孔后的彩纸和展开结果连起来。", selectFolded: "先选择左边折剪后的彩纸。", selectResult: "再选择对应的展开结果。", check: "确认", correct: "答对了。两边图形关于折痕对称。", wrong: "把折痕想成镜子，再看一看。", hintChoice: "把剪线映到折痕的另一边。", hintConnect: "比较折痕方向和剪线的转折。", hintHoleConnect: "按相反顺序逐条展开折痕，比较孔的位置。", complete10: "完成10题！", complete20: "完成全部20题！", continue10: "再做10题", new10: "新的10题", otherType: "其他类型", completeText10: "还可以继续完成同类型的10题。", completeText20: "你完成了连线和选择题。", openPaper: "展开的彩纸", foldedPaper: "对折一次", cutPaper: "沿线剪开", result: "展开结果", question: "会是什么图形？", problemCount: "{current} / {total}", choiceLabel: "选项{label}", foldedLabel: "折剪彩纸{label}", resultLabel: "展开结果{label}", whereDraw: "还要画在哪一边？", openedCuts: "展开后的剪线", punchPaper: "打孔后的彩纸", firstFold: "第一次折叠", secondFold: "第二次折叠", mirrorSidePrompt: "展开后，应在哪一边补上相同的线或孔？", foldSidePrompt: "第{step}次折叠后，彩纸落在哪一边？", countPiecesPrompt: "观察完整剪线，选择纸片数量。", countHolesPrompt: "选择完全展开后的孔数。", holeResultPrompt: "选择反向展开两次后的孔位。", piecesUnit: "片", holesUnit: "个", side_left: "左边", side_right: "右边", side_top: "上边", side_bottom: "下边", side_upper: "对角线上方", side_lower: "对角线下方", soundOn: "开启声音", soundOff: "关闭声音"
  },
  ja: {
    back: "色紙思考ひろばへ戻る", type: "種類", hint: "ヒント", retry: "もう一度", worksheet: "プリント", next: "次の問題", chooseType: "種類を選ぶ", close: "閉じる", finish: "終わる",
    choicePrompt: "折った色紙を開いたときの形を選びましょう。", connectPrompt: "折って切った形と開いた結果を線で結びましょう。", holeConnectPrompt: "穴をあけた形と開いた結果を線で結びましょう。", selectFolded: "左の折って切った色紙を先に選びます。", selectResult: "対応する開いた結果を選びます。", check: "確かめる", correct: "正解です。折り線をはさんで対称です。", wrong: "折り線を鏡だと考えて見直しましょう。", hintChoice: "切った線を折り線の反対側に映します。", hintConnect: "折り線の向きと切った線の曲がり方を比べます。", hintHoleConnect: "折った順と反対に一つずつ開き、穴の位置を比べます。", complete10: "10問できました！", complete20: "20問すべてできました！", continue10: "あと10問", new10: "新しい10問", otherType: "別の種類", completeText10: "同じ種類をあと10問続けられます。", completeText20: "線結びと選択問題を解きました。", openPaper: "開いた色紙", foldedPaper: "一回折った色紙", cutPaper: "線にそって切る", result: "開いた結果", question: "どんな形？", problemCount: "{current} / {total}", choiceLabel: "選択肢{label}", foldedLabel: "折って切った色紙{label}", resultLabel: "開いた結果{label}", whereDraw: "どちら側にもう一つ描きますか？", openedCuts: "開いた切り線", punchPaper: "穴をあけた色紙", firstFold: "一回目の折り", secondFold: "二回目の折り", mirrorSidePrompt: "開いたとき、同じ線や穴を加える側を選びましょう。", foldSidePrompt: "{step}回目に折った後、色紙はどちら側に重なりますか？", countPiecesPrompt: "完成した切り線を見て、紙片の数を選びましょう。", countHolesPrompt: "全部開いたときの穴の数を選びましょう。", holeResultPrompt: "二回逆に開いたときの穴の位置を選びましょう。", piecesUnit: "枚", holesUnit: "個", side_left: "左", side_right: "右", side_top: "上", side_bottom: "下", side_upper: "対角線の上側", side_lower: "対角線の下側", soundOn: "音を出す", soundOff: "音を消す"
  },
  en: {
    back: "Back to Paper Thinking Studio", type: "Type", hint: "Hint", retry: "Restart", worksheet: "Worksheet", next: "Next", chooseType: "Choose a type", close: "Close", finish: "Finish",
    choicePrompt: "Choose the shape that appears when the folded paper opens.", connectPrompt: "Connect each folded cut to its open result.", holeConnectPrompt: "Connect each punched paper to its open result.", selectFolded: "Choose a folded cut on the left first.", selectResult: "Now choose its open result.", check: "Check", correct: "Correct. The two sides mirror across the crease.", wrong: "Treat the crease like a mirror and look again.", hintChoice: "Reflect the cut line across the crease.", hintConnect: "Compare both the crease direction and the turns in the cut.", hintHoleConnect: "Open the creases in reverse order and compare each hole position.", complete10: "10 problems complete!", complete20: "All 20 problems complete!", continue10: "Do 10 more", new10: "New set of 10", otherType: "Other type", completeText10: "You can continue with 10 more problems of this type.", completeText20: "You completed both matching and choice problems.", openPaper: "Open paper", foldedPaper: "Paper folded once", cutPaper: "Cut along the line", result: "Open result", question: "What will appear?", problemCount: "{current} / {total}", choiceLabel: "Choice {label}", foldedLabel: "Folded cut {label}", resultLabel: "Open result {label}", whereDraw: "Which side needs another mark?", openedCuts: "Open cut lines", punchPaper: "Punched paper", firstFold: "First fold", secondFold: "Second fold", mirrorSidePrompt: "Choose the side that needs the matching line or hole when opened.", foldSidePrompt: "Which side holds the paper after fold {step}?", countPiecesPrompt: "Use the completed cut lines to choose the number of pieces.", countHolesPrompt: "Choose the number of holes after the paper opens completely.", holeResultPrompt: "Choose the hole positions after opening both folds in reverse.", piecesUnit: "pieces", holesUnit: "holes", side_left: "Left", side_right: "Right", side_top: "Top", side_bottom: "Bottom", side_upper: "Above the diagonal", side_lower: "Below the diagonal", soundOn: "Turn sound on", soundOff: "Mute sound"
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
  connections: new Map(),
  muted: localStorage.getItem("gfield-audio-muted") === "true"
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

function arrowPath(foldSpec) {
  const paths = {
    "vertical-left": "M48 154 Q80 125 126 154", "vertical-right": "M152 154 Q120 125 74 154",
    "horizontal-top": "M154 48 Q125 80 154 126", "horizontal-bottom": "M154 152 Q125 120 154 74",
    "diag-main-upper": "M130 42 Q112 78 72 110", "diag-main-lower": "M70 158 Q88 122 128 90",
    "diag-anti-upper": "M70 42 Q88 78 128 110", "diag-anti-lower": "M130 158 Q112 122 72 90"
  };
  return paths[`${foldSpec.axis}-${foldSpec.side}`];
}

function segmentLines(segments) {
  return segments.map(([a, b]) => `<line class="paper-cut-line" x1="${20 + a.x * 160}" y1="${20 + a.y * 160}" x2="${20 + b.x * 160}" y2="${20 + b.y * 160}"/>`).join("");
}

function holeCircles(holes) {
  return holes.map((hole) => `<circle class="paper-hole" cx="${20 + hole.x * 160}" cy="${20 + hole.y * 160}" r="8"/>`).join("");
}

function paperSvg({ fold = null, polygon = null, segments = [], holes = [], view = "open", label = "", marker = "arrow", showArrow = false, showScissors = false }) {
  const shape = polygon || (view === "folded" && fold ? foldedPolygon(fold) : null);
  const paperShape = shape
    ? `<polygon class="paper-fill folded-sheet" points="${points(shape)}"/><polygon class="paper-layer" points="${points(shape.map((item) => ({ x: item.x + .018, y: item.y + .018 })))}"/>`
    : `<rect class="paper-fill" x="20" y="20" width="160" height="160"/>`;
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
  const foldArrow = fold && showArrow ? `<path class="paper-fold-arrow" d="${arrowPath(fold)}" marker-end="url(#${marker})"/>` : "";
  const scissors = showScissors && segments.length ? `<text class="scissors" x="${20 + segments[0][0].x * 160 - 8}" y="${20 + segments[0][0].y * 160 - 6}">✂</text>` : "";
  return `<svg class="paper-diagram view-${view}" viewBox="0 0 200 200" role="img" aria-label="${label}">
    <defs><marker id="${marker}" markerWidth="9" markerHeight="9" refX="8.2" refY="4.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L9 4.5 L0 9 Z"/></marker></defs>
    ${paperShape}${crease}${foldArrow}${segmentLines(segments)}${holeCircles(holes)}${scissors}
  </svg>`;
}

function pieceSequenceHtml(p, reveal = false) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  if (p.folds.length > 1) {
    return `<div class="fold-sequence-view four-step${reveal ? " revealing" : ""}">
      <figure>${paperSvg({ fold: p.folds[0], polygon: p.stagePolygons[0], view: "open", label: t("firstFold"), marker: `first-${suffix}`, showArrow: true })}<figcaption>${t("firstFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ fold: p.folds[1], polygon: p.stagePolygons[1], view: "stage", label: t("secondFold"), marker: `second-${suffix}`, showArrow: true })}<figcaption>${t("secondFold")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure>${paperSvg({ polygon: p.stagePolygons[2], segments: p.cutSegments, view: "folded", label: t("cutPaper"), marker: `cut-${suffix}`, showScissors: true })}<figcaption>${t("cutPaper")}</figcaption></figure>
      <span class="step-arrow" aria-hidden="true">→</span>
      <figure class="result-step">${paperSvg({ segments: reveal ? p.unfoldedSegments : p.cutSegments, view: "result", label: reveal ? t("result") : t("whereDraw"), marker: `result-${suffix}` })}<figcaption>${reveal ? t("openedCuts") : t("whereDraw")}</figcaption></figure>
    </div>`;
  }
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.fold, view: "open", label: t("openPaper"), marker: `fold-${suffix}`, showArrow: true })}<figcaption>${t("openPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.fold, segments: p.cutSegments, view: "folded", label: t("cutPaper"), marker: `cut-${suffix}`, showScissors: true })}<figcaption>${t("cutPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure class="result-step">${paperSvg({ fold: p.fold, segments: reveal ? p.unfoldedSegments : p.cutSegments, view: "result", label: reveal ? t("result") : t("whereDraw"), marker: `result-${suffix}` })}<figcaption>${reveal ? t("openedCuts") : t("whereDraw")}</figcaption></figure>
  </div>`;
}

function singleHoleSequenceHtml(p, reveal = false) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.fold, view: "open", label: t("openPaper"), marker: `fold-${suffix}`, showArrow: true })}<figcaption>${t("openPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.fold, holes: p.punches, view: "folded", label: t("punchPaper"), marker: `punch-${suffix}` })}<figcaption>${t("punchPaper")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure class="result-step">${paperSvg({ fold: p.fold, holes: reveal ? p.unfoldedPoints : p.punches, view: "result", label: reveal ? t("result") : t("whereDraw"), marker: `result-${suffix}` })}<figcaption>${reveal ? t("result") : t("whereDraw")}</figcaption></figure>
  </div>`;
}

function doubleHoleSequenceHtml(p, reveal = false) {
  const suffix = p.id.replace(/[^a-z0-9]/gi, "");
  return `<div class="fold-sequence-view${reveal ? " revealing" : ""}">
    <figure>${paperSvg({ fold: p.folds[0], polygon: p.stagePolygons[0], view: "open", label: t("firstFold"), marker: `first-${suffix}`, showArrow: true })}<figcaption>${t("firstFold")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure>${paperSvg({ fold: p.folds[1], polygon: p.stagePolygons[1], view: "stage", label: t("secondFold"), marker: `second-${suffix}`, showArrow: true })}<figcaption>${t("secondFold")}</figcaption></figure>
    <span class="step-arrow" aria-hidden="true">→</span>
    <figure class="result-step">${reveal
      ? paperSvg({ fold: p.folds[0], holes: p.unfoldedPoints, view: "result", label: t("result"), marker: `result-${suffix}` })
      : paperSvg({ polygon: p.stagePolygons[2], holes: p.punches, view: "folded", label: t("punchPaper"), marker: `punch-${suffix}` })}<figcaption>${reveal ? t("result") : t("punchPaper")}</figcaption></figure>
  </div>`;
}

function sideChoicesHtml(step) {
  return `<div class="side-choices">${step.choices.map((side) => `<button class="side-choice" type="button" data-side="${side}"><span aria-hidden="true">${({ left: "←", right: "→", top: "↑", bottom: "↓", upper: "↖", lower: "↘" })[side]}</span><strong>${t(`side_${side}`)}</strong></button>`).join("")}</div>`;
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
      ? paperSvg({ polygon, segments: item.cutSegments, view: "folded", label: t("cutPaper"), marker })
      : paperSvg({ segments: item.unfoldedSegments, view: "result", label: t("result"), marker });
  }
  if (item.kind === "single-holes") {
    return view === "folded"
      ? paperSvg({ fold: item.fold, holes: item.punches, view: "folded", label: t("punchPaper"), marker })
      : paperSvg({ fold: item.fold, holes: item.unfoldedPoints, view: "result", label: t("result"), marker });
  }
  return view === "folded"
    ? paperSvg({ polygon: item.stagePolygons.at(-1), holes: item.punches, view: "folded", label: t("punchPaper"), marker })
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

function renderSoloPhase() {
  const p = problem();
  const placementSteps = p.placementSteps || [];
  const choosingPlacement = state.phase < placementSteps.length;

  if (p.interaction === "piece-count") ui.paper.innerHTML = pieceSequenceHtml(p, !choosingPlacement);
  else if (p.interaction === "hole-count") ui.paper.innerHTML = singleHoleSequenceHtml(p, !choosingPlacement);
  else ui.paper.innerHTML = doubleHoleSequenceHtml(p, false);

  if (choosingPlacement) {
    const step = placementSteps[state.phase];
    ui.answerPrompt.textContent = placementSteps.length === 1
      ? t("mirrorSidePrompt")
      : t("foldSidePrompt", { step: state.phase + 1 });
    ui.interaction.innerHTML = sideChoicesHtml(step);
    ui.interaction.querySelectorAll("[data-side]").forEach((button) => button.addEventListener("click", () => checkSide(button)));
    return;
  }

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
  ui.status.textContent = p.interaction === "connect-match" ? t(connectionPrompt) : t("foldedPaper");
  ui.paper.className = `paper activity-${p.interaction}`;
  ui.next.hidden = true;
  ui.next.textContent = t("next");
  ui.interaction.replaceChildren();
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
  ui.next.hidden = false;
  ui.paper.classList.add("is-solved");
  if (problem().interaction === "piece-count") ui.paper.innerHTML = pieceSequenceHtml(problem(), true);
  else if (problem().interaction === "hole-count") ui.paper.innerHTML = singleHoleSequenceHtml(problem(), true);
  else if (problem().interaction === "hole-result") ui.paper.innerHTML = doubleHoleSequenceHtml(problem(), true);
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

function checkSide(button) {
  if (state.solved || state.busy) return;
  const step = problem().placementSteps[state.phase];
  if (button.dataset.side === step.answer) {
    button.classList.add("correct");
    state.phase += 1;
    setTimeout(renderSoloPhase, 180);
  } else {
    button.classList.add("wrong");
    toast(t("wrong"));
    setTimeout(() => button.classList.remove("wrong"), 480);
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
  $("#soundButton").textContent = state.muted ? "🔇" : "🔊";
  $("#soundButton").setAttribute("aria-label", t(state.muted ? "soundOn" : "soundOff"));
}

ui.next.addEventListener("click", nextProblem);
$("#retryButton").addEventListener("click", renderProblem);
$("#hintButton").addEventListener("click", () => setGuide(t(problem().interaction === "connect-match" ? (level().strand === "fold-and-punch" ? "hintHoleConnect" : "hintConnect") : "hintChoice")));
$("#soundButton").addEventListener("click", () => {
  state.muted = !state.muted;
  localStorage.setItem("gfield-audio-muted", String(state.muted));
  applyLabels();
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
