import { levels as polyLevels } from "../games/polyomino/levels.js?v=polyomino-2";
import { levels as equalLevels } from "../games/equal-partition/levels.js?v=equal-1";
import { levels as hiddenLevels } from "../games/hidden-shape/levels.js?v=hidden-shape-3";
import { readProfile } from "../shared/profile-storage.js";

const $ = (selector) => document.querySelector(selector);
const lang = localStorage.getItem("gfield-language") || "ko";
const profile = readProfile();

const copy = {
  ko: { title: "도형 조각 정원", subtitle: "조각을 돌리고, 나누고, 그림 속 도형을 빠짐없이 찾아요.", pieceTitle: "조각 놀이", pieceDesc: "조각 이름이 아니라 활동으로 시작하는 킨더·키즈 놀이", polyTitle: "폴리오미노 퍼즐", polyDesc: "같은 조각 찾기에서 여러 조각으로 판 채우기까지", equalTitle: "똑같이 나누기", equalDesc: "같은 넓이에서 합동인 여러 조각 나누기까지", hiddenTitle: "숨은 도형 탐정", hiddenDesc: "삼각형과 사각형을 크기·방향·넓이별로 빠짐없이 세기", session: "레벨마다 10문제 · 한 번에 5문제", pieceSession: "킨더·키즈 · 활동 유형 선택", start: "시작하기" },
  en: { title: "Shape Garden", subtitle: "Turn pieces, partition boards, and find every hidden shape.", pieceTitle: "Piece Play", pieceDesc: "Kinder and Kids activities organized by what children do", polyTitle: "Polyomino Puzzle", polyDesc: "Match pieces and cover boards exactly", equalTitle: "Equal Partition", equalDesc: "Progress from equal area to congruent regions", hiddenTitle: "Shape Detective", hiddenDesc: "Count triangles and rectangles by size, direction, and area", session: "10 per level · 5 each session", pieceSession: "Kinder & Kids · choose a game type", start: "Start" },
  zh: { title: "图形拼片花园", subtitle: "旋转拼片、等分图形，找出所有隐藏图形。", pieceTitle: "拼片游戏", pieceDesc: "以孩子的活动方式组织的幼儿与儿童拼片游戏", polyTitle: "多格骨牌拼图", polyDesc: "从寻找相同拼片到完整覆盖图板", equalTitle: "等分图形", equalDesc: "从相同面积逐步学习全等分割", hiddenTitle: "隐藏图形侦探", hiddenDesc: "按大小、方向和面积数三角形与四边形", session: "每级10题 · 每次5题", pieceSession: "幼儿和儿童 · 选择游戏类型", start: "开始" },
  ja: { title: "図形ピースの庭", subtitle: "ピースを回して分け、隠れた図形を全部見つけます。", pieceTitle: "ピースあそび", pieceDesc: "子どもの活動から始めるキンダー・キッズのピースあそび", polyTitle: "ポリオミノパズル", polyDesc: "同じピース探しから正確な敷きつめまで", equalTitle: "同じように分ける", equalDesc: "同じ広さから合同な分割まで", hiddenTitle: "かくれた図形探偵", hiddenDesc: "大きさ・向き・面積ごとに三角形と四角形を数える", session: "各レベル10問 · 1回5問", pieceSession: "キンダー・キッズ · 種類を選ぶ", start: "スタート" }
};

const courseNames = {
  poly: {
    ko: [["같은 조각 찾기", "돌리면 같은 조각"], ["뒤집기 구별", "돌리기와 뒤집기 비교"], ["같은 조각 2~4개", "기초 판 채우기"], ["펜토미노 2개", "복잡한 조각 맞추기"], ["여러 조각 함께", "서로 다른 조각으로 완성"]],
    en: [["Match Pieces", "Find a rotated match"], ["Turn or Flip", "Tell reflection apart"], ["Basic Cover", "Cover with matching pieces"], ["Pentomino Pair", "Fit complex pieces"], ["Mixed Cover", "Complete with different pieces"]],
    zh: [["寻找相同拼片", "找出旋转后相同的拼片"], ["旋转或翻转", "区分旋转与镜像"], ["基础覆盖", "用相同拼片填满图板"], ["两个五格骨牌", "拼合复杂拼片"], ["混合覆盖", "用不同拼片完成图板"]],
    ja: [["同じピース探し", "回すと同じになるピース"], ["回す・裏返す", "回転と鏡映を見分ける"], ["基本の敷きつめ", "同じピースで盤を埋める"], ["ペントミノ2個", "複雑なピースを合わせる"], ["ミックス敷きつめ", "違うピースで完成する"]]
  },
  equal: {
    ko: [["둘로 똑같이", "같은 넓이 두 조각"], ["여러 조각으로", "세 조각과 네 조각"], ["조건까지 맞게", "표시와 수의 합"], ["합동인 두 조각", "돌리거나 뒤집어 포개기"], ["합동 분할 도전", "복잡한 판을 여러 조각으로"]],
    en: [["Split in Two", "Two equal areas"], ["More Regions", "Three or four areas"], ["Meet Conditions", "Markers and number sums"], ["Two Congruent Parts", "Overlap after a turn or flip"], ["Partition Challenge", "Complex congruent regions"]],
    zh: [["分成两块", "面积相同的两块"], ["分成多块", "三块或四块"], ["满足条件", "标记与数字和"], ["两个全等图形", "旋转或翻转后重合"], ["全等分割挑战", "复杂图板的多块分割"]],
    ja: [["二つに分ける", "同じ広さの二つ"], ["いくつかに分ける", "三つ・四つに分ける"], ["条件も合わせる", "印と数の合計"], ["合同な二つ", "回す・裏返すと重なる"], ["合同分割チャレンジ", "複雑な盤を複数に分ける"]]
  },
  hidden: {
    ko: [["부채꼴 삼각형", "크고 작은 삼각형 세기"], ["겹친 삼각형", "가로선마다 생기는 크고 작은 삼각형"], ["정사각형 모눈", "한 칸부터 큰 정사각형까지"], ["붙인 사각형", "완성된 사각형을 넓이별로"], ["정삼각형 모눈", "위·아래 방향을 함께 세기"]],
    en: [["Triangle Fan", "Count large and small triangles"], ["Layered Triangles", "Count large and small triangles on every base"], ["Square Grid", "Count squares of every size"], ["Joined Rectangles", "Group complete quadrilaterals by area"], ["Triangle Grid", "Count upward and downward shapes"]],
    zh: [["扇形三角形", "数大大小小的三角形"], ["重叠三角形", "数每条底边上的大小三角形"], ["正方形方格", "数出各种大小的正方形"], ["拼接四边形", "按面积数完整四边形"], ["正三角形网格", "数向上和向下的三角形"]],
    ja: [["扇形の三角形", "大小の三角形を数える"], ["重なった三角形", "各底辺の大小の三角形"], ["正方形の方眼", "全ての大きさを数える"], ["つないだ四角形", "面積別に四角形を数える"], ["正三角形の格子", "上向きと下向きの三角形"]]
  }
};

const pieceTracks = {
  ko: [["킨더 조각 놀이", "같은 모양·빈칸·가리기·담요의 4가지 유형"], ["키즈 조각 놀이", "한 칸 옮기기·빠진 조각·다른 방법의 3가지 유형"]],
  en: [["Kinder Piece Play", "Four types: match, gap, reveal, and blanket"], ["Kids Piece Play", "Three types: move, missing piece, and another way"]],
  zh: [["幼儿拼片游戏", "四种类型：相同、补空、遮住和小毯子"], ["儿童拼片游戏", "三种类型：移动、缺少的拼片和另一种方法"]],
  ja: [["キンダーのピースあそび", "同じ形・空き・かくす・毛布の4種類"], ["キッズのピースあそび", "一マス動かす・足りないピース・別の方法の3種類"]]
};

const t = (key) => copy[lang]?.[key] || copy.ko[key];
[["title", "title"], ["subtitle", "subtitle"], ["pieceTitle", "pieceTitle"], ["pieceDesc", "pieceDesc"], ["polyTitle", "polyTitle"], ["polyDesc", "polyDesc"], ["equalTitle", "equalTitle"], ["equalDesc", "equalDesc"], ["hiddenTitle", "hiddenTitle"], ["hiddenDesc", "hiddenDesc"]]
  .forEach(([id, key]) => { $(`#${id}`).textContent = t(key); });
[$("#sessionLabel"), $("#sessionLabel2"), $("#sessionLabel3")].forEach((element) => { element.textContent = t("session"); });
$("#sessionLabel0").textContent = t("pieceSession");
$("#playerName").textContent = profile.name || "GFIELD";
$("#playerPoints").textContent = `${Number(localStorage.getItem("gfield-points") || 120)} P`;

function previewMarkup(number) {
  return `<div class="preview preview-${number}" aria-hidden="true"><span>${number}</span><div class="mini-grid">${Array.from({ length: 12 }, (_, cell) => `<i style="--n:${cell}"></i>`).join("")}</div></div>`;
}

function renderLevels(levels, selector, game, names) {
  const grid = $(selector);
  const list = names[lang] || names.en;
  levels.forEach((level, index) => {
    const anchor = document.createElement("a");
    anchor.className = "level-card";
    anchor.href = `../games/${game}/?level=${level.id}`;
    anchor.innerHTML = `${previewMarkup(level.id)}<div><strong>${list[index][0]}</strong><p>${list[index][1]}</p><b>${t("start")} ›</b></div>`;
    grid.append(anchor);
  });
}

function renderPieceTracks() {
  const grid = $("#pieceLevels");
  const list = pieceTracks[lang] || pieceTracks.en;
  list.forEach((entry, index) => {
    const track = index === 0 ? "kinder" : "kids";
    const anchor = document.createElement("a");
    anchor.className = "level-card";
    anchor.href = `../games/piece-play/?track=${track}`;
    anchor.innerHTML = `${previewMarkup(index + 1)}<div><strong>${entry[0]}</strong><p>${entry[1]}</p><b>${t("start")} ›</b></div>`;
    grid.append(anchor);
  });
}

renderLevels(polyLevels, "#polyLevels", "polyomino", courseNames.poly);
renderLevels(equalLevels, "#equalLevels", "equal-partition", courseNames.equal);
renderLevels(hiddenLevels, "#hiddenLevels", "hidden-shape", courseNames.hidden);
renderPieceTracks();
