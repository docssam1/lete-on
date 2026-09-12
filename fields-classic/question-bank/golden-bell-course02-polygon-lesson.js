const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

const polygon = (sides, pointsPerSide) => ({ kind: "regular-polygon-points", sides, pointsPerSide, phase: "problem" });
const transfer = (fromSides, fromPointsPerSide, toSides, phase = "problem") => ({ kind: "polygon-transfer", fromSides, fromPointsPerSide, toSides, phase });

const pointCount = (sides, pointsPerSide) => sides * (pointsPerSide - 1);
const polygonVertices = (sides, radius = 72, cx = 100, cy = 86) => Array.from({ length: sides }, (_, index) => {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / sides;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
});
const polygonPoints = (sides, pointsPerSide) => polygonVertices(sides).flatMap(([x1, y1], index, vertices) => {
  const [x2, y2] = vertices[(index + 1) % vertices.length];
  return Array.from({ length: pointsPerSide - 1 }, (_, step) => {
    const t = step / (pointsPerSide - 1);
    return [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t];
  });
});

const pointVisual = (sides, pointsPerSide, phase = "problem", task = "total") => ({ ...polygon(sides, pointsPerSide), phase, task });
const transferVisual = (fromSides, fromPointsPerSide, toSides, phase = "problem") => ({ ...transfer(fromSides, fromPointsPerSide, toSides, phase) });

const item = (lessonId, id, prompt, visual, inputMode, group) => ({
  id: `${lessonId}:${id}`, prompt, hint: "꼭짓점은 이웃한 두 변에 함께 놓이므로 한 번만 세어야 해요.", visual, answerMode: "input", inputMode,
  typeLabel: visual.kind === "polygon-transfer" ? "같은 바둑돌로 도형 바꾸기" : "정다각형 둘레의 점 세기",
  sourceNo: id.startsWith("practice-") ? id.slice("practice-".length) : "", printGroup: group,
  answerRef: `/course02/course-02-a1/${lessonId}:${id}`
});

const lessonId = "course-02-a1-polygon-activity-02";
const original = [
  item(lessonId, "practice-1", "정삼각형의 한 변에 점이 4개씩 놓였습니다. 둘레의 점은 모두 몇 개인지 구해 보세요.", pointVisual(3, 4), "numeric", 1),
  item(lessonId, "practice-2", "정사각형 둘레의 점이 모두 16개입니다. 한 변에 놓인 점은 몇 개인지 구해 보세요.", pointVisual(4, 5, "problem", "points-per-side"), "numeric", 1),
  item(lessonId, "practice-3", "정오각형의 한 변에 점이 6개씩 놓였습니다. 둘레의 점은 모두 몇 개인지 구해 보세요.", pointVisual(5, 6), "numeric", 2),
  item(lessonId, "practice-4", "정육각형 둘레의 점이 모두 18개입니다. 한 변에 놓인 점은 몇 개인지 구해 보세요.", pointVisual(6, 4, "problem", "points-per-side"), "numeric", 2)
];
const extension = item(lessonId, "extension", "삼각형에 같은 수의 바둑돌을 놓은 뒤, 같은 바둑돌로 육각형을 만들려고 합니다. 육각형 한 변에는 몇 개씩 놓을 수 있을까요?", transferVisual(3, 7, 6), "numeric", 1);
const similar = [
  item(lessonId, "similar-1", "정팔각형의 한 변에 점이 3개씩 놓였습니다. 둘레의 점은 모두 몇 개인가요?", pointVisual(8, 3), "numeric", 1),
  item(lessonId, "similar-2", "정오각형 둘레의 점이 모두 35개입니다. 한 변에 놓인 점은 몇 개인가요?", pointVisual(5, 8, "problem", "points-per-side"), "numeric", 1),
  item(lessonId, "similar-3", "정사각형의 한 변에 바둑돌이 7개씩 있습니다. 둘레의 바둑돌이 모두 몇 개인지 구해 보세요.", pointVisual(4, 7), "numeric", 2),
  item(lessonId, "similar-4", "삼각형의 한 변에 점이 9개씩 있습니다. 같은 수의 점으로 정사각형을 만들면 한 변에 몇 개씩 놓이나요?", transferVisual(3, 9, 4), "numeric", 2),
  item(lessonId, "similar-5", "오각형의 한 변에 점이 5개씩 있습니다. 같은 수의 점으로 정십각형을 만들면 한 변에 몇 개씩 놓이나요?", transferVisual(5, 5, 10), "numeric", 2)
];

const tracks = [
  {
    id: "course-02-a1-polygon-track-1", title: "둘레의 점을 빠짐없이 세기",
    openingPrompt: "정다각형의 한 변에 놓인 점 수로 둘레의 전체 점 수를 찾아요.",
    hint: "각 변의 점을 더하면 꼭짓점이 두 번씩 세어집니다. 한 변마다 한 점을 겹쳐 세지 않도록 생각해 보세요.",
    beats: [
      { caption: "정다각형의 꼭짓점과 변을 살펴보고, 한 변의 점 수를 확인해요.", visual: pointVisual(3, 4, "problem") },
      { caption: "각 변의 점을 이어 세되, 다음 변으로 넘어갈 때 꼭짓점은 다시 세지 않아요.", visual: pointVisual(3, 4, "count") },
      { caption: "변마다 한 변의 점 수에서 한 점을 덜어 겹침을 없애고, 그 수를 변의 수만큼 곱해요.", visual: pointVisual(3, 4, "formula") },
      { caption: "계산한 전체 점 수를 실제 점의 위치와 다시 맞춰 보며 빠진 점이나 중복된 점이 없는지 확인해요.", visual: pointVisual(3, 4, "verify") }
    ]
  },
  {
    id: "course-02-a1-polygon-track-2", title: "같은 점으로 다른 도형 만들기",
    openingPrompt: "같은 수의 점을 다른 정다각형으로 바꿀 때 한 변의 점 수를 찾아요.",
    hint: "먼저 처음 도형의 전체 점 수를 구한 다음, 바꾸려는 도형의 변 수로 나누어 한 변의 점 수를 되돌려 보세요.",
    beats: [
      { caption: "처음 도형의 변마다 겹치지 않게 점을 세어 전체 점 수를 구해요.", visual: transferVisual(3, 7, 6, "problem") },
      { caption: "도형이 바뀌어도 점의 전체 수는 그대로라는 조건을 붙여요.", visual: transferVisual(3, 7, 6, "preserve") },
      { caption: "새 도형의 변 수로 전체 점 수를 나누고, 한 변의 점 수가 되도록 한 점을 다시 더해요.", visual: transferVisual(3, 7, 6, "formula") },
      { caption: "새 도형의 각 변을 따라 점을 배치해 전체 수가 처음과 같은지 확인해요.", visual: transferVisual(3, 7, 6, "verify") }
    ]
  }
];

export const COURSE02_A1_POLYGON_LESSON = Object.freeze({
  id: lessonId, courseId: "course-02", bookId: "course-02-a1", label: "A1",
  title: "도형에서 규칙 찾기", unit: "도형에서 규칙 찾기", status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "꼭짓점을 한 번만 세어 정다각형 둘레의 점 수를 구하고, 같은 수로 다른 정다각형 만들기",
  story: { title: "바둑돌 모양 바꾸기", text: "같은 바둑돌을 남기거나 보태지 않고 다른 정다각형의 둘레로 옮겨요.", mission: "꼭짓점의 겹침을 생각해 전체 수를 정확히 보존하세요." },
  explanation: { headline: "꼭짓점을 한 번만 세는 방법", steps: ["한 변에서 다음 변으로 넘어갈 때 꼭짓점을 다시 세지 않습니다.", "전체 수는 변의 수와 한 변의 점 수에서 1을 뺀 수의 곱입니다.", "도형을 바꿀 때도 전체 점 수가 같은지 다시 확인합니다."] },
  experience: { kind: "course-concept", tracks },
  original: { title: "연습", prompt: "정다각형 둘레의 점 수와 한 변의 점 수를 구해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension,
  similarPractice: similar,
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  sourceTypeIds: [],
  source: { origin: "textbook-derived", note: "교재 구조를 참고한 새 개념 학습입니다." }
});

const dotSvg = (sides, pointsPerSide, color, showAnswer) => {
  const vertices = polygonVertices(sides);
  const points = polygonPoints(sides, pointsPerSide);
  const lines = vertices.map(([x1, y1], index) => { const [x2, y2] = vertices[(index + 1) % vertices.length]; return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" />`; }).join("");
  const dots = points.map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4" />`).join("");
  const answer = showAnswer ? `<text x="100" y="178" text-anchor="middle">${sides} × (${pointsPerSide} − 1) = ${pointCount(sides, pointsPerSide)}</text>` : "";
  return `<svg class="course02-polygon-svg" viewBox="0 0 200 195" role="img" aria-label="정다각형 둘레 점 모델" style="--polygon-color:${esc(color)}"><g class="polygon-segments">${lines}</g><g class="polygon-points">${dots}</g>${answer}</svg>`;
};

const outlineSvg = (sides) => {
  const vertices = polygonVertices(sides);
  const lines = vertices.map(([x1, y1], index) => { const [x2, y2] = vertices[(index + 1) % vertices.length]; return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" />`; }).join("");
  return `<svg class="course02-polygon-svg target-outline" viewBox="0 0 200 195" role="img" aria-label="바꿀 정다각형의 빈 둘레"><g class="polygon-segments">${lines}</g><text x="100" y="178" text-anchor="middle">점을 옮겨 놓을 자리</text></svg>`;
};

export function course02PolygonConceptMarkup(visual) {
  if (!visual || !visual.kind) return "";
  const phase = visual.phase || "problem";
  const showAnswer = phase === "verify" || phase === "formula";
  if (visual.kind === "regular-polygon-points") {
    const { sides, pointsPerSide } = visual;
    return `<div class="course02-polygon-concept" data-phase="${esc(phase)}" data-sides="${sides}" data-points-per-side="${pointsPerSide}">${dotSvg(sides, pointsPerSide, "#16734B", showAnswer)}<p class="course02-polygon-equation">${showAnswer ? `${sides} × (${pointsPerSide} − 1)` : "변의 수 × (한 변의 점 수 − 1)"}</p></div>`;
  }
  if (visual.kind === "polygon-transfer") {
    const total = pointCount(visual.fromSides, visual.fromPointsPerSide);
    const newPoints = total % visual.toSides === 0 ? total / visual.toSides + 1 : null;
    const target = showAnswer && newPoints ? dotSvg(visual.toSides, newPoints, "#2456C4", true) : outlineSvg(visual.toSides);
    const verification = !showAnswer ? "" : newPoints
      ? `<p class="course02-transfer-equation">전체 ${total}개 유지 · ${visual.toSides} × (${newPoints} − 1) = ${total}</p>`
      : `<p class="course02-transfer-equation">${total}은 ${visual.toSides}으로 나누어떨어지지 않아 같은 간격으로 놓을 수 없어요.</p>`;
    return `<div class="course02-polygon-transfer" data-phase="${esc(phase)}"><div>${dotSvg(visual.fromSides, visual.fromPointsPerSide, "#16734B", showAnswer)}</div><span aria-hidden="true">→</span><div>${target}</div>${verification}</div>`;
  }
  return "";
}
