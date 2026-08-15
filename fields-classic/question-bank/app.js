import { AGE_STAGES, DOMAINS, TYPES, EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES, CURRICULUM, typeById } from "./source-data.js?v=20260816bo";
import { GENERATORS } from "./generators.js?v=20260816bo";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const domainIndex = Object.fromEntries(DOMAINS.map((domain, index) => [domain.id, index]));
const stageIds = new Set([...AGE_STAGES.map((item) => item.id), "practice", "final"]);

const state = {
  mode: "exam",
  stage: stageIds.has(params.get("age")) ? params.get("age") : "k6_winter",
  selected: { exam: new Set(), curriculum: new Set(), type: new Set() },
  count: 20,
  difficulty: "actual",
  order: "exam",
  includeSolution: true,
  watermark: true,
  questions: []
};

function isReady(item) {
  // The diagnostic bank remains untouched. This new bank only opens types with
  // a source-matched, source-approved live generator, never a loosely related
  // legacy image or a prototype that only shares a broad type name.
  return Boolean(item?.sourceMatched && item?.generator && GENERATORS[item.generator]);
}

function hasVerifiedSource(typeId) {
  return [...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES].some((exam) => exam.questions.some((sourceQuestion) => sourceQuestion.verified && sourceQuestion.typeId === typeId));
}

function isSelectableType(item) {
  return isReady(item) && hasVerifiedSource(item.id);
}

function typeStatus(item) {
  if (isReady(item)) return item.generator ? "무한 생성" : "검수 문제 연결";
  if (item?.geometryGame) return "3D 렌더 연결 중";
  if (item?.status === "curriculum") return "교재 유형 분석 완료";
  return "생성기 제작 대기";
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll("#builderTabs button").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  $("examBuilder").hidden = mode !== "exam";
  $("curriculumBuilder").hidden = mode !== "curriculum";
  $("typeBuilder").hidden = mode !== "type";
  updateSummary();
}

function renderStageButtons() {
  const stages = [...AGE_STAGES, { id: "practice", label: "실전 모의고사" }, { id: "final", label: "파이널 모의고사" }];
  $("examAgeButtons").innerHTML = stages.map((item) => `<button type="button" class="${item.id === state.stage ? "active" : ""}" data-stage="${item.id}">${item.label}</button>`).join("");
  $("examAgeButtons").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.stage = button.dataset.stage;
    renderStageButtons();
    renderExamList();
  }));
}

function visibleExams() {
  if (state.stage === "practice") return PRACTICE_EXAM_TYPES;
  if (state.stage === "final") return FINAL_EXAM_TYPES;
  return EXAMS.filter((exam) => exam.stage === state.stage);
}

function examKey(examId, number) {
  return `${examId}:${number}`;
}

function renderExamList() {
  const exams = visibleExams();
  const stage = AGE_STAGES.find((item) => item.id === state.stage);
  $("examStageTitle").textContent = stage?.label || (state.stage === "final" ? "파이널 모의고사" : "실전 모의고사");
  $("examStageMeta").textContent = `${exams.length}개 시험지 · 원본 문항 번호 기준`;
  $("examNotice").textContent = "원본 문제의 문항 번호를 고른 뒤, 그 문제보다 쉽게·같게·어렵게 유사문제를 만들 수 있습니다. 연산 테스트는 이 문제은행에서 제외합니다.";
  $("examTypeList").innerHTML = exams.map((exam) => {
    const rows = exam.questions.map((sourceQuestion) => {
      const item = typeById(sourceQuestion.typeId);
      const verified = sourceQuestion.verified === true;
      const ready = verified && isSelectableType(item);
      const page = typeof exam.pageFor === "function" ? `원본 ${exam.pageFor(sourceQuestion.number)}쪽` : "원본 문항";
      const key = examKey(exam.id, sourceQuestion.number);
      return `<label class="exam-row ${ready ? "" : "not-ready"}">
        <span class="number">${sourceQuestion.number}번</span>
        <input type="checkbox" data-exam-key="${key}" ${state.selected.exam.has(key) ? "checked" : ""} ${ready ? "" : "disabled"} />
        <span><strong>${item?.label || "분류 확인 중"}</strong><span>${item?.middle || ""} · ${page} · 실제 출제</span></span>
        <em class="type-status ${ready ? "" : "fixed"}">${verified ? typeStatus(item) : "원본 대조 중"}</em>
      </label>`;
    }).join("");
    const sourceLink = exam.sourceViewer === false ? "" : `<a class="source-view-link" href="./selection-test-viewer.html?exam=${exam.id}&student=${encodeURIComponent(student)}">원문 보기</a>`;
    return `<details class="tree-group" open><summary><strong>${exam.label}</strong><span>${exam.questions.length}문항</span></summary><div class="exam-source"><span>${exam.file}</span>${sourceLink}</div>${rows}</details>`;
  }).join("") || `<div class="source-notice">이 시기의 원본 시험지는 아직 등록되지 않았습니다.</div>`;

  $("examTypeList").querySelectorAll("input[data-exam-key]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.exam.add(input.dataset.examKey);
    else state.selected.exam.delete(input.dataset.examKey);
    updateSummary();
  }));
}

function curriculumKey(bookId, unitIndex) {
  return `${bookId}:${unitIndex}`;
}

function renderCurriculum() {
  $("curriculumTree").innerHTML = CURRICULUM.map((book) => {
    const sourceFolder = book.id.replace("-", "");
    const units = book.units.map((unit, unitIndex) => {
      const key = curriculumKey(book.id, unitIndex);
      const labels = unit.typeIds.map((id) => typeById(id)?.label).filter(Boolean);
      const readyCount = unit.typeIds.filter((id) => isSelectableType(typeById(id))).length;
      return `<label class="type-leaf ${readyCount ? "" : "not-ready"}">
        <input type="checkbox" data-curriculum-key="${key}" ${state.selected.curriculum.has(key) ? "checked" : ""} ${readyCount ? "" : "disabled"} />
        <span><strong>${unit.label}</strong><span>${labels.join(" · ")}</span></span>
        <em class="type-status ${readyCount ? "" : "fixed"}">${readyCount ? `${readyCount}개 유형 생성 가능` : "생성기 제작 대기"}</em>
      </label>`;
    }).join("");
    return `<details class="tree-group curriculum-book" open>
      <summary><strong>${book.label} · ${book.title}</strong><span>교재 4단원 + 단원 테스트 25문항</span></summary>
      <div class="curriculum-sources">
        <div><strong>교재 본문 유사문제</strong><span>아래 단원별 선택</span></div>
        <div><strong>단원 테스트 원문</strong><span>${book.source.unitTest}</span><a class="source-view-link" href="./unit-test-viewer.html?book=${sourceFolder}&student=${encodeURIComponent(student)}">원문 보기</a></div>
        <div><strong>단원 테스트 유사문제</strong><span>문항별 유형 대조 후 연결</span><em>분석 중</em></div>
      </div>
      <div class="type-leaves">${units}</div>
      <p class="book-policy">골든벨 제외${book.source.reviewIncluded ? "" : " · 교재 뒤 리뷰 제외"}</p>
    </details>`;
  }).join("");

  $("curriculumTree").querySelectorAll("input[data-curriculum-key]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.curriculum.add(input.dataset.curriculumKey);
    else state.selected.curriculum.delete(input.dataset.curriculumKey);
    updateSummary();
  }));
}

function groupedTypes() {
  return DOMAINS.map((domain) => ({
    domain,
    middles: [...new Set(TYPES.filter((item) => item.domain === domain.id).map((item) => item.middle))].map((middle) => ({
      middle,
      types: TYPES.filter((item) => item.domain === domain.id && item.middle === middle)
    }))
  }));
}

function renderTypeTree() {
  $("bankTypeTree").innerHTML = groupedTypes().map(({ domain, middles }) => `<details class="tree-group" open>
    <summary><strong>${domain.label}</strong><span>${middles.reduce((sum, group) => sum + group.types.length, 0)}개 세부 유형</span></summary>
    ${middles.map(({ middle, types }) => `<details class="middle-group" open><summary><strong>${middle}</strong></summary><div class="type-leaves">
      ${types.map((item) => `<label class="type-leaf ${isSelectableType(item) ? "" : "not-ready"}">
        <input type="checkbox" data-type-id="${item.id}" ${state.selected.type.has(item.id) ? "checked" : ""} ${isSelectableType(item) ? "" : "disabled"} />
        <span><strong>${item.label}</strong><span>실제 출제 유형${item.geometryGame ? ` · Cube Town ${item.geometryGame}` : ""}</span></span>
        <em class="type-status ${isSelectableType(item) ? "" : "fixed"}">${hasVerifiedSource(item.id) ? typeStatus(item) : "원본 대조 중"}</em>
      </label>`).join("")}
    </div></details>`).join("")}
  </details>`).join("");

  $("bankTypeTree").querySelectorAll("input[data-type-id]").forEach((input) => input.addEventListener("change", () => {
    if (input.checked) state.selected.type.add(input.dataset.typeId);
    else state.selected.type.delete(input.dataset.typeId);
    updateSummary();
  }));
}

function selectedReferences() {
  if (state.mode === "type") return [...state.selected.type].map((typeId) => ({ typeId, reference: `${typeById(typeId)?.label || "유형"} 기준` }));
  if (state.mode === "curriculum") {
    const result = [];
    for (const key of state.selected.curriculum) {
      const [bookId, indexText] = key.split(":");
      const book = CURRICULUM.find((item) => item.id === bookId);
      const unit = book?.units[Number(indexText)];
      result.push(...(unit?.typeIds || []).map((typeId) => ({ typeId, reference: `${book.label} ${unit.label}` })));
    }
    return result;
  }
  const result = [];
  for (const exam of [...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES]) {
    for (const sourceQuestion of exam.questions) {
      if (state.selected.exam.has(examKey(exam.id, sourceQuestion.number))) result.push({ typeId: sourceQuestion.typeId, reference: `${exam.label} ${sourceQuestion.number}번` });
    }
  }
  return result;
}

function selectedTypeIds() {
  return selectedReferences().map((item) => item.typeId);
}

function updateSummary() {
  const typeIds = selectedTypeIds();
  const unique = new Set(typeIds);
  const ready = [...unique].filter((id) => isSelectableType(typeById(id))).length;
  $("selectionTotal").textContent = `${unique.size}개 유형 · ${state.count}문제`;
  $("selectionHelp").textContent = unique.size
    ? `${ready}개 유형은 지금 생성할 수 있고, 나머지는 원본 분류 완료 후 생성기를 연결합니다.`
    : "왼쪽에서 시험 문항이나 유형을 선택하세요.";
  $("buildButton").disabled = ready === 0;
}

function toggleVisible(selector, set, keyGetter) {
  const inputs = [...document.querySelectorAll(selector)].filter((input) => !input.disabled);
  const shouldSelect = inputs.some((input) => !input.checked);
  inputs.forEach((input) => {
    input.checked = shouldSelect;
    const key = keyGetter(input);
    if (shouldSelect) set.add(key);
    else set.delete(key);
  });
  updateSummary();
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function generatedProblem(item, sequence, reference) {
  if (item.generator && GENERATORS[item.generator]) {
    const difficulty = state.difficulty === "basic" ? 1 : state.difficulty === "advanced" ? 3 : 2;
    return { ...GENERATORS[item.generator]({ max: 30, difficulty }), type: item, reference };
  }
  return null;
}

function problemSignature(problem) {
  return JSON.stringify([problem.reference, problem.type.id, problem.prompt, problem.visual || null, problem.image || null]);
}

function buildQuestions() {
  let references = selectedReferences().filter((item) => isSelectableType(typeById(item.typeId)));
  if (!references.length) return;
  if (state.order === "domain") references.sort((a, b) => domainIndex[typeById(a.typeId).domain] - domainIndex[typeById(b.typeId).domain]);
  if (state.order === "mixed") references = shuffle(references);
  const counters = new Map();
  const signatures = new Set();
  state.questions = Array.from({ length: state.count }, (_, index) => {
    const reference = references[index % references.length];
    const item = typeById(reference.typeId);
    const sequence = counters.get(item.id) || 0;
    counters.set(item.id, sequence + 1);
    let problem = null;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      problem = generatedProblem(item, sequence, reference.reference);
      if (!problem || !signatures.has(problemSignature(problem))) break;
    }
    if (problem) signatures.add(problemSignature(problem));
    return problem;
  }).filter(Boolean);
  renderWorksheet();
  $("builderPanel").hidden = true;
  $("worksheetSection").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shapeSymbol(shape) {
  return shape === "동그라미" ? "●" : shape === "세모" ? "▲" : "■";
}

function numberCardMarkup(visual) {
  return `<div class="number-balls">${visual.values.map((value) => `<span>${value}</span>`).join("")}</div><div class="equation-row equation-row-three"><span class="equation-blank"></span><b>+</b><span class="equation-blank"></span><b>-</b><span class="equation-blank"></span><b>=</b><strong>${visual.target}</strong></div>`;
}

function hiddenCardConditionsMarkup(visual) {
  return `<div class="hidden-card-clues">${visual.clues.map((clue, index) => `<div class="hidden-card-row"><span>(${index + 1})</span><div>${clue.values.map((value) => `<i>${value}</i>`).join("")}</div><strong class="${clue.hasCard ? "has" : "not"}">→ ${clue.hasCard ? "있습니다." : "없습니다."}</strong></div>`).join("")}</div>`;
}

function shapeMatrixRuleMarkup(visual) {
  const hatchId = `shape-matrix-hatch-${visual.id}`;
  const shape = (kind, cx, cy, size, className, fill) => {
    const style = fill === "hatch" ? ` style="fill:url(#${hatchId})"` : "";
    if (kind === "circle") return `<circle class="${className} fill-${fill}" cx="${cx}" cy="${cy}" r="${size}"${style}/>`;
    if (kind === "square") return `<rect class="${className} fill-${fill}" x="${cx - size}" y="${cy - size}" width="${size * 2}" height="${size * 2}"${style}/>`;
    return `<polygon class="${className} fill-${fill}" points="${cx},${cy - size} ${cx - size},${cy + size * 0.82} ${cx + size},${cy + size * 0.82}"${style}/>`;
  };
  const cells = visual.cells.map((cell, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 15 + column * 110;
    const y = 15 + row * 110;
    const cx = x + 55;
    const cy = y + 55;
    const content = cell
      ? `${shape(cell.outer, cx, cy, 35, "matrix-outer", "plain")}${shape(cell.inner, cx, cy, 22, "matrix-inner", cell.fill)}`
      : `<text class="matrix-missing" x="${cx}" y="${cy + 8}">㉠</text>`;
    return `<g><rect class="matrix-cell" x="${x}" y="${y}" width="110" height="110"/>${content}</g>`;
  }).join("");
  return `<svg class="shape-matrix-svg" viewBox="0 0 360 360" role="img" aria-label="큰 도형, 작은 도형, 칠한 방법의 규칙을 찾는 3행 3열 문제"><defs><pattern id="${hatchId}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#fff"/><line x1="0" y1="0" x2="0" y2="8" stroke="#627886" stroke-width="3"/></pattern></defs>${cells}</svg>`;
}

function tornCalendarMarkup(visual) {
  const headers = visual.headers.map((header, index) => {
    const weekday = visual.columns[index];
    return `<b class="${weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : ""}">${header}</b>`;
  }).join("");
  const rows = visual.rows.flatMap((row) => row.map((date, index) => {
    const weekday = visual.columns[index];
    return `<span class="${weekday === 0 ? "sunday" : weekday === 6 ? "saturday" : ""}">${date || ""}</span>`;
  })).join("");
  return `<div class="torn-calendar" style="--calendar-columns:${visual.columns.length}"><strong>${visual.month}월</strong><div class="torn-calendar-grid">${headers}${rows}</div><svg viewBox="0 0 240 14" preserveAspectRatio="none" aria-hidden="true"><path d="M0 1L14 8 28 3 44 11 61 4 78 10 96 2 114 9 132 4 150 12 168 3 186 9 205 2 222 10 240 4V14H0Z"/></svg></div>`;
}

function twoTypeUnitsMarkup(visual) {
  const bicycle = (tricycle) => `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing bike"><circle cx="35" cy="63" r="20"/><circle cx="${tricycle ? 112 : 115}" cy="63" r="20"/>${tricycle ? '<circle cx="76" cy="68" r="13"/>' : ""}<path d="M35 63L62 28 84 63H35L58 63 75 39 112 63M62 28H82M75 39L67 20M61 20H76"/></g></svg>`;
  const animal = (rabbit) => rabbit
    ? `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing animal"><ellipse cx="70" cy="50" rx="39" ry="24"/><circle cx="109" cy="38" r="17"/><ellipse cx="101" cy="13" rx="6" ry="18"/><ellipse cx="116" cy="13" rx="6" ry="18"/><circle class="eye" cx="115" cy="35" r="2"/><path d="M44 65V82M62 68V82M83 68V82M101 64V82"/></g></svg>`
    : `<svg viewBox="0 0 150 90" aria-hidden="true"><g class="unit-drawing animal"><ellipse cx="72" cy="50" rx="34" ry="25"/><circle cx="108" cy="35" r="16"/><polygon points="123,34 142,42 123,47"/><circle class="eye" cx="112" cy="31" r="2"/><path d="M61 70V84M84 70V84M54 84H67M77 84H91"/></g></svg>`;
  return `<div class="two-type-units">${visual.items.map((item, index) => `<div>${visual.variant === "bicycles" ? bicycle(index === 1) : animal(index === 1)}<strong>${item.label}</strong><span>${visual.variant === "bicycles" ? "바퀴" : "다리"} ${item.units}개</span></div>`).join("")}</div>`;
}

function rowColumnCountMarkup(visual) {
  const cell = visual.size === 5 ? 42 : 48;
  const offset = 50;
  const gridSize = visual.size * cell;
  const width = offset + gridSize + 8;
  const height = offset + gridSize + 8;
  const lines = Array.from({ length: visual.size + 1 }, (_, index) => {
    const position = offset + index * cell;
    return `<path d="M${offset} ${position}H${offset + gridSize}M${position} ${offset}V${offset + gridSize}"/>`;
  }).join("");
  const topLabels = visual.columnCounts.map((count, index) => {
    const center = offset + index * cell + cell / 2;
    return `<polygon points="${center},6 ${center - 19},${offset - 5} ${center + 19},${offset - 5}"/><text x="${center}" y="${offset - 14}">${count}</text>`;
  }).join("");
  const rowLabels = visual.rowCounts.map((count, index) => {
    const center = offset + index * cell + cell / 2;
    return `<polygon points="6,${center} ${offset - 5},${center - 19} ${offset - 5},${center + 19}"/><text x="${offset - 18}" y="${center + 6}">${count}</text>`;
  }).join("");
  return `<div class="row-column-count-work"><div class="row-column-rule"><span>△ 안의 수 = 그 줄의 별 수</span><span>가로와 세로를 모두 맞추기</span></div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="가로와 세로 별 개수 조건이 있는 ${visual.size} 곱하기 ${visual.size} 빈칸"><g class="count-labels">${topLabels}${rowLabels}</g><g class="count-grid">${lines}</g></svg></div>`;
}

function truthLieRankingMarkup(visual) {
  return `<div class="truth-lie-work"><div class="liar-note"><strong>거짓말</strong><span>${visual.liarNames.join(" · ")}</span></div><div class="ranking-statements">${visual.statements.map((statement) => `<div><b>${statement.speaker}</b><span>${statement.text}</span></div>`).join("")}</div></div>`;
}

function targetScoreCombinationsMarkup(visual) {
  const centerX = 150;
  const centerY = 108;
  const outerRadius = 92;
  const ringWidth = outerRadius / visual.scores.length;
  const rings = visual.scores.map((score, index) => {
    const radius = outerRadius - index * ringWidth;
    const innerRadius = Math.max(0, radius - ringWidth);
    const labelX = centerX + (radius + innerRadius) / 2;
    return `<circle class="target-ring band-${index % 2}" cx="${centerX}" cy="${centerY}" r="${radius.toFixed(2)}"/><text class="target-score-label" x="${labelX.toFixed(2)}" y="114">${score}</text>`;
  }).join("");
  return `<svg class="target-score-svg" viewBox="0 0 300 225" role="img" aria-label="바깥쪽부터 ${visual.scores.join(", ")}점인 과녁">${rings}<g class="target-arrow" transform="translate(58 31) rotate(42)"><line x1="0" y1="0" x2="48" y2="0"/><path d="M48 0L36-6M48 0L36 6"/></g><g class="target-arrow" transform="translate(78 17) rotate(50)"><line x1="0" y1="0" x2="48" y2="0"/><path d="M48 0L36-6M48 0L36 6"/></g><text class="target-shot-note" x="150" y="220">화살 2번</text></svg>`;
}

function matchstickShapePoints(sides, index) {
  if (sides === 3) {
    const offset = Math.floor(index / 2) * 44;
    return index % 2 === 0
      ? [[offset, 38], [offset + 44, 38], [offset + 22, 0]]
      : [[offset + 44, 38], [offset + 66, 0], [offset + 22, 0]];
  }
  const offset = index * 44;
  if (sides === 4) return [[offset, 0], [offset + 44, 0], [offset + 44, 44], [offset, 44]];
  if (sides === 5) return [[offset, 48], [offset, 23], [offset + 22, 0], [offset + 44, 23], [offset + 44, 48]];
  return [[offset, 12], [offset + 22, 0], [offset + 44, 12], [offset + 44, 36], [offset + 22, 48], [offset, 36]];
}

function matchstickStageMarkup(visual, count) {
  const segments = new Map();
  const points = new Map();
  const pointKey = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
  const edgeKey = (from, to) => [pointKey(from), pointKey(to)].sort().join("|");
  for (let index = 0; index < count; index += 1) {
    const polygon = matchstickShapePoints(visual.sides, index);
    polygon.forEach((point, pointIndex) => {
      const next = polygon[(pointIndex + 1) % polygon.length];
      points.set(pointKey(point), point);
      points.set(pointKey(next), next);
      segments.set(edgeKey(point, next), [point, next]);
    });
  }
  const coordinates = [...points.values()];
  const minX = Math.min(...coordinates.map(([x]) => x));
  const maxX = Math.max(...coordinates.map(([x]) => x));
  const minY = Math.min(...coordinates.map(([, y]) => y));
  const maxY = Math.max(...coordinates.map(([, y]) => y));
  const padding = 9;
  const lines = [...segments.values()].map(([from, to]) => `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"/>`).join("");
  const heads = coordinates.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8"/>`).join("");
  const matchCount = visual.sides + (count - 1) * (visual.sides - 1);
  return `<div class="matchstick-stage"><svg viewBox="${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}" role="img" aria-label="${visual.shape} ${count}개, 성냥개비 ${matchCount}개"><g class="matchstick-lines">${lines}</g><g class="matchstick-heads">${heads}</g></svg><span>${count}번째</span></div>`;
}

function matchstickShapeSequenceMarkup(visual) {
  return `<div class="matchstick-sequence-work"><div class="matchstick-stages">${[1, 2, 3].map((count) => matchstickStageMarkup(visual, count)).join("")}<b class="sequence-ellipsis">…</b><em class="sequence-target">${visual.target}번째</em></div><p>${visual.clue}</p></div>`;
}

function connectedLineDegreeSumMarkup(visual) {
  const lines = visual.edges.map(([first, second]) => {
    const from = visual.nodes[first];
    const to = visual.nodes[second];
    return `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`;
  }).join("");
  const nodes = visual.nodes.map((node, index) => `<g><circle cx="${node.x}" cy="${node.y}" r="18"/>${visual.shown.includes(index) ? `<text x="${node.x}" y="${node.y + 6}">${visual.degrees[index]}</text>` : ""}</g>`).join("");
  return `<div class="connected-line-work"><svg viewBox="0 0 ${visual.width} ${visual.height}" role="img" aria-label="여러 원이 선으로 연결된 그림"><g class="connected-edges">${lines}</g><g class="connected-nodes">${nodes}</g></svg><p>${visual.clue}</p></div>`;
}

function letterBlockTileMarkup(word, transformed = false, blank = false) {
  const length = Array.from(word).length;
  const horizontal = !transformed && length > 1;
  const width = horizontal ? 152 : 88;
  const height = transformed && length > 1 ? 152 : 108;
  const fontSize = length > 1 ? 43 : 54;
  const content = blank
    ? ""
    : transformed
      ? `<g transform="translate(${width / 2} ${height / 2}) scale(-1 1)"><g transform="rotate(-90)"><text style="font-size:${fontSize}px" x="0" y="2">${word}</text></g></g>`
      : `<text style="font-size:${fontSize}px" x="${width / 2}" y="${height / 2 + 2}">${word}</text>`;
  const label = blank ? "답을 그릴 빈 상자" : transformed ? `${word}를 움직인 결과` : `${word} 글자 블록`;
  return `<svg class="letter-block-tile ${blank ? "blank" : ""}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}"><rect x="2" y="2" width="${width - 4}" height="${height - 4}"/>${content}</svg>`;
}

function letterBlockTransformMarkup(visual) {
  const pair = (word, showResult, label) => `<div class="letter-transform-pair"><b>${label}</b><div>${letterBlockTileMarkup(word)}<span>→</span>${showResult ? letterBlockTileMarkup(word, true) : letterBlockTileMarkup(word, false, true)}</div></div>`;
  return `<div class="letter-transform-work">${pair(visual.example, true, "보기")}${pair(visual.target, false, "문제")}<p>${visual.guide}</p></div>`;
}

function mixedSequencesMarkup(visual) {
  return `<div class="mixed-sequences-work">${visual.rows.map((row) => `<div class="mixed-sequence-row"><b>${row.label}</b><div>${row.terms.map((value, index) => `<span class="${index === row.blankIndex ? "blank" : ""}">${index === row.blankIndex ? row.answerLabel : value}</span>`).join("<i>,</i>")}<em>…</em></div>${row.clue ? `<small>${row.clue}</small>` : ""}</div>`).join("")}</div>`;
}

function vennNeitherMarkup(visual) {
  const { shown } = visual;
  const firstValue = shown.mode === "parts" || shown.mode === "hidden-overlap" ? `${shown.firstOnly}${visual.unit}` : "";
  const overlapValue = shown.mode === "hidden-overlap" ? "?" : `${shown.both}${visual.unit}`;
  const secondValue = shown.mode === "parts" ? `${shown.secondOnly}${visual.unit}` : "";
  const firstTotal = shown.mode === "parts" ? "" : `전체 ${shown.firstTotal}${visual.unit}`;
  const secondTotal = shown.mode === "parts" ? "" : `전체 ${shown.secondTotal}${visual.unit}`;
  return `<div class="venn-neither-work"><div class="venn-total">전체 ${visual.total}${visual.unit}</div><svg viewBox="0 0 420 205" role="img" aria-label="두 조건에 모두 해당하지 않는 수를 찾는 겹친 원 그림"><circle class="venn-circle first" cx="165" cy="112" r="76"/><circle class="venn-circle second" cx="255" cy="112" r="76"/><text class="venn-label" x="112" y="22">${visual.first}</text><text class="venn-total-label" x="112" y="39">${firstTotal}</text><text class="venn-label" x="308" y="22">${visual.second}</text><text class="venn-total-label" x="308" y="39">${secondTotal}</text><text class="venn-value" x="125" y="116">${firstValue}</text><text class="venn-value overlap" x="210" y="116">${overlapValue}</text><text class="venn-value" x="295" y="116">${secondValue}</text><text class="venn-neither-label" x="210" y="199">어느 쪽에도 해당하지 않음: ?</text></svg></div>`;
}

function hiddenScoreRankingMarkup(visual) {
  const scoreCells = (row) => String(row.score).split("").map((digit, index) => `<span class="${index === row.blankIndex ? "hidden" : ""}">${index === row.blankIndex ? row.symbol : digit}</span>`).join("");
  const candidates = visual.candidates ? `<div class="hidden-score-candidates"><b>사용할 숫자</b>${visual.candidates.map((value) => `<span>${value}</span>`).join("")}</div>` : "";
  return `<div class="hidden-score-work">${candidates}<div class="hidden-score-table"><div class="heading"><b>이름</b><b>우표의 수(장)</b><b>많이 모은 순서</b></div>${visual.rows.map((row) => `<div class="row"><strong>${row.name}</strong><span class="score">${scoreCells(row)}</span><em>${row.rank}</em></div>`).join("")}</div></div>`;
}

function evenCardCountMarkup(visual) {
  return `<div class="even-card-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="even-card-template"><span></span><span></span><b>짝수</b></div></div>`;
}

function reverseCountTimelineMarkup(visual) {
  return `<div class="reverse-count-work"><span class="unknown">처음 ?${visual.unit}</span>${visual.operations.map((operation) => `<i>→</i><span class="${operation.delta > 0 ? "plus" : "minus"}">${operation.delta > 0 ? "+" : "-"}${Math.abs(operation.delta)}${visual.unit}</span>`).join("")}<i>→</i><span class="final">마지막 ${visual.final}${visual.unit}</span></div>`;
}

function eraseExpressionTargetMarkup(visual) {
  return `<div class="erase-expression-work"><span>${visual.first}</span>${visual.terms.map((term) => `<span class="erasable">${term.sign > 0 ? "+" : "-"}${term.value}</span>`).join("")}<b>=</b><strong>${visual.target}</strong></div>`;
}

function collectionRepeatGapMarkup(visual) {
  const shown = visual.shownCircles.map((value, index) => `<span class="circle">${value}</span>${index < visual.shownCircles.length - 1 ? `<i><b>${visual.sums[index % 2]}</b></i>` : ""}`).join("");
  return `<div class="collection-repeat-work">${shown}<em>…</em><span class="circle target">${visual.start}</span></div>`;
}

function mixedOperationCardsMarkup(visual) {
  const slot = (index) => visual.given?.index === index
    ? `<span class="mixed-card-slot given">${visual.given.value}</span>`
    : '<span class="mixed-card-slot"></span>';
  return `<div class="mixed-card-work">
    <div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>
    <div class="mixed-card-board">
      <div class="mixed-card-top"><b>${visual.base}</b><i>+</i>${slot(0)}<i>=</i>${slot(1)}</div>
      <div class="mixed-card-columns">
        <div><i>×</i>${slot(2)}<i>=</i>${slot(3)}</div>
        <div><i>-</i>${slot(4)}<i>=</i><b>${visual.target}</b></div>
      </div>
      ${visual.extraTarget == null ? "" : `<div class="mixed-card-extra"><i>-</i>${slot(5)}<i>=</i><b>${visual.extraTarget}</b></div>`}
    </div>
  </div>`;
}

function twoDigitCardEnumerationMarkup(visual) {
  return `<div class="two-digit-enumeration-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><strong>${visual.condition} 두 자리 수</strong></div>`;
}

function closestCardSumMarkup(visual) {
  const blank = () => '<span class="digit-card-blank"></span>';
  return `<div class="closest-card-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="closest-card-equation"><span class="two-digit-blank">${blank()}${blank()}</span><b>+</b><span class="two-digit-blank">${blank()}${blank()}</span><b>=</b><span class="sum-blank"></span></div><small>${visual.target}에 가장 가까운 합</small></div>`;
}

function edgeSumCycleMarkup(visual) {
  const cycle = (values, edges, showValues, given = null) => {
    const [top, right, bottom, left] = edges;
    const positions = [[95,68],[235,68],[235,184],[95,184]];
    const placedValues = showValues
      ? values.map((value, index) => ({ value, index }))
      : given ? [given] : [];
    return `<div class="edge-cycle"><div class="edge-number-strip">${values.map((value) => `<span>${value}</span>`).join("")}</div><svg viewBox="0 0 330 220" role="img" aria-label="네 원 안에 수를 넣고 각 변의 합을 맞추는 문제"><line x1="95" y1="62" x2="235" y2="62"/><line x1="235" y1="62" x2="235" y2="178"/><line x1="235" y1="178" x2="95" y2="178"/><line x1="95" y1="178" x2="95" y2="62"/><circle cx="95" cy="62" r="25"/><circle cx="235" cy="62" r="25"/><circle cx="235" cy="178" r="25"/><circle cx="95" cy="178" r="25"/>${placedValues.map(({ value, index }) => `<text class="edge-inside" x="${positions[index][0]}" y="${positions[index][1]}">${value}</text>`).join("")}<text x="165" y="53">합 ${top}</text><text x="257" y="122">합 ${right}</text><text x="165" y="205">합 ${bottom}</text><text x="39" y="122">합 ${left}</text></svg></div>`;
  };
  return `<div class="edge-cycle-work"><div class="edge-cycle-example"><b>[보기]</b>${cycle([2,4,8,6], [6,12,14,8], true)}</div><div>${cycle(visual.values, visual.edges, false, visual.given)}</div></div>`;
}

function equalizeBagsMarkup(visual) {
  const bag = (name, count) => `<div class="candy-bag"><strong>${name}</strong><div class="bag-shape" aria-label="사탕 ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</div></div>`;
  return `<div class="equalize-bags">${bag(visual.names[0], visual.higher)}<span class="transfer-arrow">몇 개를<br>줄까요?</span>${bag(visual.names[1], visual.lower)}</div>`;
}

function numberPyramidMarkup(visual) {
  return `<div class="pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><svg class="pyramid-svg" viewBox="0 0 300 215" role="img" aria-label="세 수를 이웃한 두 수끼리 두 번 모으는 수 피라미드"><g class="pyramid-links"><path d="M55 64L100 101M150 64L100 101M150 64L200 101M245 64L200 101M100 149L150 179M200 149L150 179"/></g><g class="pyramid-boxes"><rect x="31" y="16" width="48" height="48"/><rect x="126" y="16" width="48" height="48"/><rect x="221" y="16" width="48" height="48"/><rect x="76" y="101" width="48" height="48"/><rect x="176" y="101" width="48" height="48"/></g><text class="pyramid-blank-label" x="150" y="48">㉠</text><text class="pyramid-target-label" x="150" y="207">${visual.target}</text></svg></div>`;
}

function totalDifferenceShareMarkup(visual) {
  const hint = visual.showHint ? `<strong>차이 ${visual.difference}개를 먼저 떼어 보기</strong>` : "";
  const transfer = visual.transfer ? `<small>${visual.transfer}개를 준 뒤 차이 ${visual.afterDifference}개</small>` : "";
  return `<div class="total-difference-work">${hint}<div class="share-cubes" style="--cube-columns:${visual.total <= 20 ? 5 : 7}" aria-label="큐브 ${visual.total}개">${Array.from({ length: visual.total }, () => "<i></i>").join("")}</div>${transfer}</div>`;
}

function fiveCardPyramidMarkup(visual) {
  const bottomLeft = visual.given?.index === 0 ? visual.given.value : "";
  return `<div class="five-card-pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><svg class="five-card-pyramid-svg" viewBox="0 0 360 245" role="img" aria-label="아래 세 칸과 가운데 두 칸에 수 카드를 넣는 합 피라미드"><g class="five-pyramid-links"><path d="M180 42L130 72M180 42L230 72M130 120L80 153M130 120L180 153M230 120L180 153M230 120L280 153"/></g><g class="five-pyramid-boxes"><rect x="105" y="72" width="50" height="48"/><rect x="205" y="72" width="50" height="48"/><rect x="55" y="153" width="50" height="48"/><rect x="155" y="153" width="50" height="48"/><rect x="255" y="153" width="50" height="48"/></g><text class="five-pyramid-target" x="180" y="33">${visual.target}</text>${bottomLeft === "" ? "" : `<text class="five-pyramid-given" x="80" y="184">${bottomLeft}</text>`}<text class="five-pyramid-blank" x="180" y="184">㉠</text></svg></div>`;
}

function lGridPlacementMarkup(visual) {
  const cell = (index, className) => {
    const given = visual.given?.index === index ? visual.given.value : "";
    const content = index === visual.targetIndex ? "㉠" : given;
    return `<span class="${className}${given !== "" ? " given" : ""}${index === visual.targetIndex ? " target" : ""}">${content}</span>`;
  };
  return `<div class="l-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul><div class="l-grid">${cell(0,"p0")}${cell(1,"p1")}${cell(2,"p2")}${cell(3,"p3")}</div></div>`;
}

function stairGridPlacementMarkup(visual) {
  const given = visual.given?.index === 0 ? visual.given.value : "";
  return `<div class="stair-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="stair-grid"><span class="cell p0 given">${given}</span><span class="cell p1">㉠</span><span class="cell p2"></span><span class="cell p3"></span></div></div>`;
}

function raceOrderMarkup(visual, conditions) {
  return `<div class="race-order"><div class="race-track-row"><b>앞</b><div class="race-track" style="--race-count:${visual.total}">${Array.from({ length: visual.total }, (_, index) => `<span><i></i><b>${index + 1}등</b></span>`).join("")}</div><b>뒤</b></div><ul>${conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
}

function additionTableGridMarkup(visual) {
  const givenMap = new Map(visual.givens.map((item) => [`${item.row}:${item.column}`, item.value]));
  const cells = Array.from({ length: visual.size * visual.size }, (_, index) => {
    const row = Math.floor(index / visual.size);
    const column = index % visual.size;
    const key = `${row}:${column}`;
    const isTarget = row === visual.target.row && column === visual.target.column;
    return `<span class="${isTarget ? "target" : givenMap.has(key) ? "given" : "blank"}">${isTarget ? "㉠" : givenMap.get(key) ?? ""}</span>`;
  }).join("");
  return `<div class="addition-table-grid" style="--table-size:${visual.size}">${cells}</div>`;
}

function discNumberRuleMarkup(visual) {
  const disc = (item, offset) => `<g transform="translate(${offset},76)"><circle class="disc-outer" r="52"/><path class="disc-line" d="M0-52V52M-52 0H52"/><circle class="disc-inner" r="24"/><text x="-27" y="-22">${item.northWest}</text><text x="27" y="-22">${item.northEast}</text><text x="-27" y="33">${item.southWest}</text><text x="27" y="33">${item.southEast}</text><text class="disc-center" y="7">${item.center}</text></g>`;
  return `<svg class="disc-rule-svg" viewBox="0 0 390 152" role="img" aria-label="원판 수 규칙 문제">${visual.discs.map((item, index) => disc(item, 70 + index * 125)).join("")}</svg>`;
}

function shapeSumTableMarkup(visual) {
  return `<div class="shape-sum-work"><div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div><div class="shape-sum-target"><div class="shape-sum-grid"><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function shapeSumBottomTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealDiamond ? `<small class="shape-sum-hint">도움: ◇ = ${visual.diamond}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>◇</span><span>□</span><b>${visual.rowTwo}</b><b>${visual.columnOne}</b><b class="target">㉠</b></div></div></div>`;
}

function shapeSumColumnTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealSquare ? `<small class="shape-sum-hint">도움: □ = ${visual.square}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>□</span><span>□</span><b>${visual.rowTwo}</b><b class="target">㉠</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function repeatShapeSequenceMarkup(visual) {
  const symbol = (item) => item === "세모" ? "△" : "○";
  return `<div class="repeat-sequence">${visual.items.map((item, index) => `<span>${symbol(item)}<small>${index + 1}</small></span>`).join("")}<b>…</b><strong>${visual.target}번째<br>모양 (　)</strong></div>`;
}

function threeShapeCycleMarkup(visual) {
  const guide = visual.showGuide ? `<strong class="cycle-guide">반복마디 ${visual.cycle.map((shape) => shape.symbol).join(" ")}</strong>` : "";
  return `<div class="three-shape-cycle">${guide}<div class="cycle-items">${visual.items.map((shape, index) => `<span><b>${shape.symbol}</b><small>${index + 1}번째</small></span>`).join("")}<i>…</i><strong><b>(　)</b><small>${visual.target}번째</small></strong></div></div>`;
}

function arrowNumberGridMarkup(visual) {
  const marker = `arrow-head-${visual.start}`;
  const step = (x1, y1, x2, y2) => {
    const direction = x2 > x1 ? "→" : x2 < x1 ? "←" : y2 > y1 ? "↓" : "↑";
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${marker})"/><text class="step-arrow" x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 + 5}">${direction}</text>`;
  };
  const steps = [[43,172,77,172],[87,172,121,172],[126,167,126,127],[131,122,179,122],[184,117,184,77],[179,72,137,72],[127,72,85,72],[80,67,80,27]].map((coords) => step(...coords)).join("");
  return `<div class="arrow-number-rule"><svg class="arrow-legend-svg" viewBox="0 0 250 120" role="img" aria-label="화살표 규칙 보기"><defs><marker id="legend-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><rect x="4" y="4" width="242" height="112" rx="16"/><text x="125" y="27">[보기]</text><rect x="102" y="42" width="46" height="34"/><rect x="28" y="75" width="46" height="34"/><rect x="102" y="75" width="46" height="34"/><rect x="176" y="75" width="46" height="34"/><text x="125" y="64">5</text><text x="51" y="97">14</text><text x="125" y="97">15</text><text x="199" y="97">16</text><path d="M125 75V67M102 92H76M148 92H174M125 75V79"/></svg><svg class="arrow-grid-svg" viewBox="0 0 270 210" role="img" aria-label="화살표 수 규칙 문제"><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><g class="arrow-steps">${steps}</g><rect x="12" y="148" width="40" height="40"/><circle cx="82" cy="172" r="18"/><circle cx="126" cy="172" r="18"/><circle cx="126" cy="122" r="18"/><circle cx="184" cy="122" r="18"/><circle cx="184" cy="72" r="18"/><circle cx="132" cy="72" r="18"/><circle cx="80" cy="72" r="18"/><rect x="60" y="2" width="40" height="40"/><text x="32" y="174">${visual.start}</text><text x="80" y="28">㉠</text></svg></div>`;
}

function arrowNumberPathSevenMarkup(visual) {
  const minX = Math.min(...visual.points.map((point) => point.x));
  const maxX = Math.max(...visual.points.map((point) => point.x));
  const minY = Math.min(...visual.points.map((point) => point.y));
  const maxY = Math.max(...visual.points.map((point) => point.y));
  const width = (maxX - minX) * 66 + 100;
  const height = (maxY - minY) * 66 + 100;
  const placed = visual.points.map((point) => ({ x: (point.x - minX) * 66 + 50, y: (point.y - minY) * 66 + 50 }));
  const arrows = placed.slice(0, -1).map((point, index) => {
    const next = placed[index + 1];
    const ux = Math.sign(next.x - point.x);
    const uy = Math.sign(next.y - point.y);
    const sx = point.x + ux * 28;
    const sy = point.y + uy * 28;
    const ex = next.x - ux * 28;
    const ey = next.y - uy * 28;
    const bx = ex - ux * 8;
    const by = ey - uy * 8;
    const px = -uy * 4;
    const py = ux * 4;
    return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}"/><path d="M${ex} ${ey}L${bx + px} ${by + py}L${bx - px} ${by - py}Z"/>`;
  }).join("");
  const nodes = placed.map((point, index) => {
    if (index === 0) return `<rect x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">${visual.start}</text>`;
    if (index === placed.length - 1) return `<rect class="target" x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">㉠</text>`;
    return `<circle cx="${point.x}" cy="${point.y}" r="21"/>`;
  }).join("");
  const legend = `<svg class="arrow-path-legend" viewBox="0 0 210 150" role="img" aria-label="화살표 수 규칙 보기"><text x="105" y="16">[보기]</text><rect x="84" y="55" width="42" height="42"/><rect x="18" y="55" width="42" height="42"/><rect x="150" y="55" width="42" height="42"/><rect x="84" y="3" width="42" height="42"/><rect x="84" y="107" width="42" height="42"/><text x="105" y="82">15</text><text x="39" y="82">14</text><text x="171" y="82">16</text><text x="105" y="30">5</text><text x="105" y="134">25</text><text class="legend-arrow" x="70" y="82">←</text><text class="legend-arrow" x="140" y="82">→</text><text class="legend-arrow" x="105" y="52">↑</text><text class="legend-arrow" x="105" y="108">↓</text></svg>`;
  return `<div class="arrow-path-work">${legend}<svg class="arrow-path-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="화살표를 따라 수를 찾는 경로"><g class="path-arrows">${arrows}</g><g class="path-nodes">${nodes}</g></svg></div>`;
}

function busStopsMarkup(visual) {
  const events = visual.events || [
    { action: "leave", count: visual.left },
    { action: "board", count: visual.boarded }
  ];
  const eventText = events.map((event, index) => `<li>${["첫", "두", "세"][index]} 번째 정류장에서 <strong>${event.count}명</strong>이 ${event.action === "board" ? "탔습니다" : "내렸습니다"}.</li>`).join("");
  return `<div class="bus-stops"><ul>${eventText}</ul>${visual.hintAfterFirst ? `<p>${visual.hintAfterFirst}</p>` : ""}</div>`;
}

function foldNumberCutSumMarkup(visual) {
  const cell = 42;
  const paperSize = visual.size * cell;
  const gridLines = Array.from({ length: visual.size - 1 }, (_, index) => {
    const point = (index + 1) * cell;
    return `<path d="M${point} 0V${paperSize}M0 ${point}H${paperSize}"/>`;
  }).join("");
  const shaded = visual.foldMask.map(([row, column]) => {
    const x = column * cell;
    const y = row * cell;
    if (row + column === visual.size - 1) return `<path d="M${x} ${y}H${x + cell}L${x} ${y + cell}Z"/>`;
    return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
  }).join("");
  const paper = `<svg class="fold-cut-paper" viewBox="-8 -24 ${paperSize + 16} ${paperSize + 34}" role="img" aria-label="대각선으로 접고 칠한 부분을 자르는 색종이"><text x="${paperSize / 2}" y="-8">한 번 접기</text><rect width="${paperSize}" height="${paperSize}"/><g class="fold-cut-grid">${gridLines}</g><path class="fold-line" d="M0 ${paperSize}L${paperSize} 0"/><g class="cut-shade">${shaded}</g><path class="fold-arrow" d="M${paperSize - 34} ${paperSize - 45}Q${paperSize - 60} ${paperSize - 78} ${paperSize - 93} ${paperSize - 88}"/><path class="fold-arrow-head" d="M${paperSize - 93} ${paperSize - 88}l12 -5l-4 12Z"/></svg>`;
  const numberGrid = `<div class="fold-cut-number-grid" style="--fold-size:${visual.size}">${visual.grid.map((value) => `<span>${value}</span>`).join("")}</div>`;
  return `<div class="fold-number-cut-work">${paper}<b class="fold-process-arrow">→</b>${numberGrid}</div>`;
}

function equalLineSumEightCardsMarkup(visual) {
  const positions = [[45, 45], [130, 45], [215, 45], [215, 130], [215, 215], [130, 215], [45, 215], [45, 130]];
  const lines = `<path d="M45 45H215V215H45Z"/>`;
  const nodes = positions.map(([x, y], index) => {
    const label = index === visual.targetIndex ? "㉠" : visual.givenIndices.includes(index) ? visual.layout[index] : "";
    const className = index === visual.targetIndex ? "target" : label ? "given" : "blank";
    return `<g class="${className}"><rect x="${x - 28}" y="${y - 28}" width="56" height="56"/><text x="${x}" y="${y + 7}">${label}</text></g>`;
  }).join("");
  return `<div class="equal-line-eight-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><svg viewBox="0 0 260 260" role="img" aria-label="가로와 세로 네 줄의 합을 같게 만드는 여덟 수 카드"><g class="equal-eight-lines">${lines}</g><g class="equal-eight-nodes">${nodes}</g><text class="equal-eight-sum" x="130" y="136">합: ${visual.targetSum}</text></svg></div>`;
}

function equalLineCrossMarkup(visual) {
  return `<div class="equal-line-cross"><div class="cross-cards">${[1,2,3,4,5].map((value) => `<span>${value}</span>`).join("")}</div><div class="cross-grid"><span></span><b>${visual.top}</b><span></span><b>${visual.left}</b><b>㉠</b><i></i><span></span><i></i><span></span></div></div>`;
}

function numberConditionsMarkup(visual) {
  return `<div class="number-conditions"><p>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.sum}</strong>입니다.</p><p>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</p></div>`;
}

function twoDigitParityGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.lower}</strong>보다 크고 <strong>${visual.upper}</strong>보다 작은 짝수입니다.</li><li>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</li>${visual.digitSum === null ? "" : `<li>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.digitSum}</strong>입니다.</li>`}</ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function twoDigitOddGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.upper}</strong>보다 작은 홀수입니다.</li><li>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 작습니다.</li></ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function triangleTileGrowthMarkup(visual) {
  const stage = (size) => {
    const height = 86;
    const stepX = 88 / size;
    const stepY = height / size;
    const point = (row, column) => ({ x: 50 - row * stepX / 2 + column * stepX, y: 4 + row * stepY });
    const lines = [];
    for (let row = 1; row <= size; row += 1) {
      for (let column = 0; column < row; column += 1) {
        const left = point(row, column);
        const right = point(row, column + 1);
        lines.push(`<line x1="${left.x}" y1="${left.y}" x2="${right.x}" y2="${right.y}" />`);
      }
      for (let column = 0; column <= row; column += 1) {
        const lower = point(row, column);
        if (column > 0) {
          const upperLeft = point(row - 1, column - 1);
          lines.push(`<line x1="${lower.x}" y1="${lower.y}" x2="${upperLeft.x}" y2="${upperLeft.y}" />`);
        }
        if (column < row) {
          const upperRight = point(row - 1, column);
          lines.push(`<line x1="${lower.x}" y1="${lower.y}" x2="${upperRight.x}" y2="${upperRight.y}" />`);
        }
      }
    }
    return `<div class="triangle-growth-stage stage-${size}"><svg viewBox="0 0 100 94" role="img" aria-label="${size}번째 정삼각형 조각 배열"><g>${lines.join("")}</g></svg><b>${size}번째</b>${visual.showCounts ? `<span>${size * size}장</span>` : ""}</div>`;
  };
  return `<div class="triangle-growth-work">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
}

function squareTileGrowthMarkup(visual) {
  const stage = (size) => {
    const cells = Array.from({ length: size * size }, (_, index) => {
      const row = Math.floor(index / size);
      const column = index % size;
      return `<rect x="${column * 100 / size}" y="${row * 100 / size}" width="${100 / size}" height="${100 / size}" />`;
    }).join("");
    return `<div class="square-growth-stage stage-${size}"><svg viewBox="-1 -1 102 102" role="img" aria-label="${size}번째 정사각형 조각 배열"><g>${cells}</g></svg><b>${size}번째</b>${visual.showCounts ? `<span>${size * size}장</span>` : ""}</div>`;
  };
  return `<div class="square-growth-work">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
}

function growingDotSquareMarkup(visual) {
  const stage = (size) => `<div><i style="--dots:${size}">${Array.from({ length: size * size }, () => "<b></b>").join("")}</i><span>${size}번째</span></div>`;
  return `<div class="growing-dot-squares">${[1,2,3,4].map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function symbolSumGridMarkup(visual) {
  const cells = ["☆", "□", "△", visual.rowOne, "□", "□", "☆", visual.rowTwo, "△", "□", "○", visual.rowThree, visual.rowOne, visual.columnTwo, "㉠"];
  return `<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div>`;
}

function shapeSumGridTopTargetMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "△", "□", "○", "㉠",
    "◇", "□", "○", sumLabel(visual.rowSums[1], "row-2"),
    "○", "△", "○", sumLabel(visual.rowSums[2], "row-3"),
    sumLabel(visual.columnSums[0], "column-1"), sumLabel(visual.columnSums[1], "column-2"), sumLabel(visual.columnSums[2], "column-3")
  ];
  return `<div class="shape-sum-grid-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function symbolSumGridSquareTopMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "□", "□", "□", sumLabel(visual.rowSums[0], "row-1"),
    "□", "◇", "△", sumLabel(visual.rowSums[1], "row-2"),
    "◇", "○", "○", sumLabel(visual.rowSums[2], "row-3"),
    sumLabel(visual.columnSums[0], "column-1"), sumLabel(visual.columnSums[1], "column-2"), "㉠"
  ];
  return `<div class="symbol-sum-square-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
}

function shapeEquationAddSubtractMarkup(visual) {
  const token = (value) => {
    if (value === "square") return '<i class="shape-equation-symbol square" aria-label="네모">□</i>';
    if (value === "heart") return '<i class="shape-equation-symbol heart" aria-label="하트">♡</i>';
    if (value === "star") return '<i class="shape-equation-symbol star" aria-label="별">☆</i>';
    return `<strong>${value}</strong>`;
  };
  const line = (equation) => `<div class="shape-equation-line">${token(equation.left)}<b>${equation.operator}</b>${token(equation.right)}<b>=</b>${token(equation.result)}</div>`;
  const example = visual.example;
  return `<div class="shape-equation-work">
    <section class="shape-equation-example"><b>[보기]</b><div><span class="circled-number">${example.circle}</span><b>+</b><strong>${example.addend}</strong><b>=</b><strong>${example.sum}</strong></div><div><strong>${example.minuend}</strong><b>-</b><span class="circled-number">${example.circle}</span><b>=</b><strong>${example.difference}</strong></div></section>
    <section class="shape-equation-target">${visual.equations.map(line).join("")}<p>${token(visual.target)} = (　　)</p></section>
  </div>`;
}

function sourcePianoMarkup() {
  const notes = ["도", "레", "미", "파", "솔", "라", "시", "도"];
  const rows = [[1,2,3,4,5,6,7,8],[14,13,12,11,10,9,8,""],[15,16,17,18,19,20,21,22]];
  return `<div class="source-piano"><div class="source-piano-keys">${notes.map((note, index) => `<span class="${[0,1,3,4,5].includes(index) ? "has-black" : ""}"><b>${note}</b></span>`).join("")}</div><div class="piano-sequence">${rows.map((row) => row.map((number) => `<span>${number}</span>`).join("")).join("")}</div><em>…</em></div>`;
}

function balanceRelationsMarkup(visual) {
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}">${kind === "circle" ? "○" : kind === "star" ? "☆" : ""}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  return `<div class="balance-relations"><p>양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.</p>${scale(`${pieces("circle", 2)}${pieces("square", visual.starRectangles)}`, `${pieces("star", 1)}${pieces("circle", 1)}`, "[그림 1]")}${scale(pieces("circle", visual.rectangleWeight * 3), pieces("rectangle", 3), "[그림 2]")}${scale(`${pieces("star", 1)}${pieces("rectangle", 1)}`, `<strong>○ (　)개</strong>`, "[그림 3]")}</div>`;
}

function balanceScaleThreeObjectsMarkup(visual) {
  const symbols = { circle: "○", square: "□", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(pieces("circle", 1), `${pieces("square", visual.squareBesideStar)}${pieces("star", 1)}`, "[그림 1]");
  const second = scale(`${pieces("circle", 1)}${pieces("square", visual.squareBesideCircle)}`, `${pieces("diamond", 1)}${pieces("star", 1)}`, "[그림 2]");
  const third = scale(pieces("star", 1), `${pieces("square", visual.squareBesideDiamond)}${pieces("diamond", 1)}`, "[그림 3]");
  const target = visual.askCombined ? "○ + ◇ = □ (　)개" : "○ = □ (　)개";
  return `<div class="three-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">도움: ${visual.hint}</p>` : ""}<strong class="balance-target">${target}</strong></div>`;
}

function symbolRelationsMarkup(visual) {
  const repeat = (symbol, count) => Array.from({ length: count }, () => symbol).join(" + ");
  return `<div class="symbol-relations">${visual.hint ? `<small>${visual.hint}</small>` : ""}<p>${repeat("☆", visual.firstStar)} = ${repeat("○", visual.firstCircle)}</p><p>☆ + ○ = ▽ + ▽</p><p>${visual.final.join(" + ")} = □</p></div>`;
}

function numberLineSixPointsMarkup(visual) {
  const xs = { A: 28, B: 92, C: 150, D: 225, E: 360, F: 438 };
  const arc = (from, to, value, side, height, className = "") => {
    const x1 = xs[from];
    const x2 = xs[to];
    const controlY = side === "top" ? 78 - height : 78 + height;
    const labelY = side === "top" ? controlY + 7 : controlY - 3;
    return `<path class="distance-arc ${className}" d="M ${x1} 78 Q ${(x1 + x2) / 2} ${controlY} ${x2} 78"/><text class="distance-label ${className}" x="${(x1 + x2) / 2}" y="${labelY}">${value}</text>`;
  };
  const d = visual.distances;
  const hints = visual.hints.map((hint) => `<span>${hint.from}${hint.to} = ${hint.value}</span>`).join("");
  const targetArc = visual.target === "AF" ? arc("A", "F", "?", "top", 72, "target") : arc("E", "F", "?", "top", 30, "target");
  return `<div class="six-point-line-work"><svg viewBox="0 0 466 180" role="img" aria-label="A부터 F까지 여섯 점과 겹쳐 표시한 거리">
    <line class="number-line-base" x1="28" y1="78" x2="438" y2="78"/>
    ${arc("A", "D", d.ad, "top", 60)}${arc("C", "E", d.ce, "top", 48)}${arc("A", "C", d.ac, "bottom", 40)}${arc("B", "D", d.bd, "bottom", 55)}${arc("B", "F", d.bf, "bottom", 87)}${targetArc}
    ${Object.entries(xs).map(([label, x]) => `<circle cx="${x}" cy="78" r="4"/><text class="point-label" x="${x}" y="94">${label}</text>`).join("")}
  </svg>${hints ? `<div class="line-distance-hints"><b>도움</b>${hints}</div>` : ""}<strong>구할 거리: ${visual.target[0]}와 ${visual.target[1]}</strong></div>`;
}

function goStoneDifferenceInverseMarkup(visual) {
  const stage = (size) => `<div class="go-triangle-stage">${Array.from({ length: size }, (_, rowIndex) => {
    const row = rowIndex + 1;
    const color = row % 2 === 1 ? "black" : "white";
    return `<div>${Array.from({ length: row }, () => `<i class="${color}"></i>`).join("")}</div>`;
  }).join("")}<span>${size}번째</span></div>`;
  return `<div class="go-difference-work"><div class="go-triangle-stages">${Array.from({ length: visual.stages }, (_, index) => stage(index + 1)).join("")}<b>…</b></div>${visual.hint ? `<p>${visual.hint}</p>` : ""}<strong>${visual.targetColor}이 ${visual.difference}개 더 많은 때</strong></div>`;
}

function coloredShapeNumberMarkup(visual) {
  const examples = [[1,[0,0,0,1]],[2,[0,0,0,2]],[5,[0,0,1,1]],[8,[0,0,2,0]],[19,[0,1,0,3]],[68,[1,0,1,0]]];
  const grid = (digits, label, target = false) => `<div class="base-four-grid ${target ? "target" : ""}">${Array.from({ length: 3 }, (_, row) => digits.map((count) => `<i class="${row >= 3 - count ? "filled" : ""}"></i>`).join("")).join("")}<span>${label}</span></div>`;
  return `<div class="colored-shape-number"><div class="color-examples">${examples.map(([label, digits]) => grid(digits, label)).join("")}</div>${grid(visual.digits, "?", true)}</div>`;
}

function sourceGoStonesMarkup(visual) {
  const patterns = [
    [[1,0],[0,0]],
    [[1,0,1],[0,0,1],[1,1,1]],
    [[1,0,1,0],[0,0,1,0],[1,1,1,0],[0,0,0,0]],
    [[1,0,1,0,1],[0,0,1,0,1],[1,1,1,0,1],[0,0,0,0,1],[1,1,1,1,1]]
  ];
  return `<div class="source-go-stones">${patterns.map((pattern, index) => `<div><i style="--size:${index + 2}">${pattern.flat().map((black) => `<b class="${black ? "black" : "white"}"></b>`).join("")}</i><span>${index + 1}번째</span></div>`).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function nonadjacentPyramidMarkup(visual) {
  const rows = [[visual.top], [visual.left, ""], ["", "", ""], ["", "", "㉠", ""]];
  return `<div class="nonadjacent-pyramid">${rows.map((row, rowIndex) => `<div style="--row:${rowIndex}">${row.map((value) => `<span>${value}</span>`).join("")}</div>`).join("")}</div>`;
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "hidden-card-conditions") return `<div class="visual hidden-card-visual">${hiddenCardConditionsMarkup(visual)}</div>`;
  if (visual.kind === "shape-matrix-rule") return `<div class="visual shape-matrix-visual">${shapeMatrixRuleMarkup(visual)}</div>`;
  if (visual.kind === "torn-calendar") return `<div class="visual torn-calendar-visual">${tornCalendarMarkup(visual)}</div>`;
  if (visual.kind === "two-type-units") return `<div class="visual two-type-units-visual">${twoTypeUnitsMarkup(visual)}</div>`;
  if (visual.kind === "row-column-count-placement") return `<div class="visual row-column-count-visual">${rowColumnCountMarkup(visual)}</div>`;
  if (visual.kind === "truth-lie-ranking") return `<div class="visual truth-lie-ranking-visual">${truthLieRankingMarkup(visual)}</div>`;
  if (visual.kind === "target-score-combinations") return `<div class="visual target-score-visual">${targetScoreCombinationsMarkup(visual)}</div>`;
  if (visual.kind === "matchstick-shape-sequence") return `<div class="visual matchstick-sequence-visual">${matchstickShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "connected-line-degree-sum") return `<div class="visual connected-line-visual">${connectedLineDegreeSumMarkup(visual)}</div>`;
  if (visual.kind === "letter-block-transform") return `<div class="visual letter-transform-visual">${letterBlockTransformMarkup(visual)}</div>`;
  if (visual.kind === "mixed-sequences") return `<div class="visual mixed-sequences-visual">${mixedSequencesMarkup(visual)}</div>`;
  if (visual.kind === "venn-neither") return `<div class="visual venn-neither-visual">${vennNeitherMarkup(visual)}</div>`;
  if (visual.kind === "hidden-score-ranking") return `<div class="visual hidden-score-visual">${hiddenScoreRankingMarkup(visual)}</div>`;
  if (visual.kind === "even-card-count") return `<div class="visual even-card-visual">${evenCardCountMarkup(visual)}</div>`;
  if (visual.kind === "reverse-count-timeline") return `<div class="visual reverse-count-visual">${reverseCountTimelineMarkup(visual)}</div>`;
  if (visual.kind === "erase-expression-target") return `<div class="visual erase-expression-visual">${eraseExpressionTargetMarkup(visual)}</div>`;
  if (visual.kind === "collection-repeat-gap") return `<div class="visual collection-repeat-visual">${collectionRepeatGapMarkup(visual)}</div>`;
  if (visual.kind === "mixed-operation-cards") return `<div class="visual mixed-operation-card-visual">${mixedOperationCardsMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-card-enumeration") return `<div class="visual two-digit-enumeration-visual">${twoDigitCardEnumerationMarkup(visual)}</div>`;
  if (visual.kind === "closest-card-sum") return `<div class="visual closest-card-visual">${closestCardSumMarkup(visual)}</div>`;
  if (visual.kind === "number-card-plus-minus") return `<div class="visual card-equation-visual">${numberCardMarkup(visual)}</div>`;
  if (visual.kind === "edge-sum-cycle") return `<div class="visual edge-sum-visual">${edgeSumCycleMarkup(visual)}</div>`;
  if (visual.kind === "equalize-bags") return `<div class="visual equalize-visual">${equalizeBagsMarkup(visual)}</div>`;
  if (visual.kind === "total-difference-share") return `<div class="visual total-difference-visual">${totalDifferenceShareMarkup(visual)}</div>`;
  if (visual.kind === "number-pyramid") return `<div class="visual pyramid-visual">${numberPyramidMarkup(visual)}</div>`;
  if (visual.kind === "five-card-pyramid") return `<div class="visual five-card-pyramid-visual">${fiveCardPyramidMarkup(visual)}</div>`;
  if (visual.kind === "stair-grid-placement") return `<div class="visual stair-grid-placement-visual">${stairGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "l-grid-placement") return `<div class="visual l-grid-placement-visual">${lGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "race-order") return `<div class="visual race-order-visual">${raceOrderMarkup(visual, visual.conditions || [])}</div>`;
  if (visual.kind === "addition-table-grid") return `<div class="visual addition-table-visual">${additionTableGridMarkup(visual)}</div>`;
  if (visual.kind === "disc-number-rule") return `<div class="visual disc-rule-visual">${discNumberRuleMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-table") return `<div class="visual shape-sum-visual">${shapeSumTableMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-bottom-target") return `<div class="visual shape-sum-visual">${shapeSumBottomTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-column-target") return `<div class="visual shape-sum-visual">${shapeSumColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-sequence") return `<div class="visual repeat-sequence-visual">${repeatShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "three-shape-cycle") return `<div class="visual three-shape-cycle-visual">${threeShapeCycleMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-grid") return `<div class="visual arrow-grid-visual">${arrowNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-path-seven") return `<div class="visual arrow-path-seven-visual">${arrowNumberPathSevenMarkup(visual)}</div>`;
  if (visual.kind === "bus-stops") return `<div class="visual bus-stops-visual">${busStopsMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-cut-sum") return `<div class="visual fold-number-cut-visual">${foldNumberCutSumMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-eight-cards") return `<div class="visual equal-line-eight-visual">${equalLineSumEightCardsMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-cross") return `<div class="visual equal-line-cross-visual">${equalLineCrossMarkup(visual)}</div>`;
  if (visual.kind === "number-conditions") return `<div class="visual number-conditions-visual">${numberConditionsMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-parity-gap") return `<div class="visual number-conditions-visual">${twoDigitParityGapMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-odd-gap") return `<div class="visual number-conditions-visual">${twoDigitOddGapMarkup(visual)}</div>`;
  if (visual.kind === "triangle-tile-growth") return `<div class="visual triangle-tile-growth-visual">${triangleTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "square-tile-growth") return `<div class="visual square-tile-growth-visual">${squareTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "growing-dot-square") return `<div class="visual growing-dot-square-visual">${growingDotSquareMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-top-target") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTopTargetMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid-square-top") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridSquareTopMarkup(visual)}</div>`;
  if (visual.kind === "shape-equation-add-subtract") return `<div class="visual shape-equation-add-subtract-visual">${shapeEquationAddSubtractMarkup(visual)}</div>`;
  if (visual.kind === "source-piano") return `<div class="visual source-piano-visual">${sourcePianoMarkup()}</div>`;
  if (visual.kind === "balance-relations") return `<div class="visual balance-relations-visual">${balanceRelationsMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-three-objects") return `<div class="visual balance-relations-visual">${balanceScaleThreeObjectsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relations") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relation-two-to-three") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "number-line-six-points") return `<div class="visual number-line-six-points-visual">${numberLineSixPointsMarkup(visual)}</div>`;
  if (visual.kind === "go-stone-difference-inverse") return `<div class="visual go-stone-difference-inverse-visual">${goStoneDifferenceInverseMarkup(visual)}</div>`;
  if (visual.kind === "colored-shape-number") return `<div class="visual colored-shape-number-visual">${coloredShapeNumberMarkup(visual)}</div>`;
  if (visual.kind === "source-go-stones") return `<div class="visual source-go-stones-visual">${sourceGoStonesMarkup(visual)}</div>`;
  if (visual.kind === "nonadjacent-pyramid") return `<div class="visual nonadjacent-pyramid-visual">${nonadjacentPyramidMarkup(visual)}</div>`;
  if (visual.kind === "cards") return `<div class="visual"><div class="number-cards">${visual.values.map((value) => `<span class="number-card">${value}</span>`).join("")}</div></div>`;
  if (visual.kind === "bus") return `<div class="visual"><div class="bus-row"><span>${visual.start}명</span><b>+</b><span class="bus-icon">버스</span><span>+${visual.boarded}</span><span>-${visual.left}</span></div></div>`;
  if (visual.kind === "place") return `<div class="visual"><div class="place-grid"><b>십의 자리</b><b>일의 자리</b><strong>${visual.tens}</strong><strong>${visual.ones}</strong></div></div>`;
  if (visual.kind === "shapes") return `<div class="visual"><div class="shape-row">${visual.items.map((token) => `<span class="shape-token ${token.color === "검은색" ? "black" : "white"}">${shapeSymbol(token.shape)}</span>`).join("")}</div></div>`;
  if (visual.kind === "piano") return `<div class="visual"><div class="piano-row">${Array.from({ length: visual.keys }, (_, index) => `<span class="piano-key">${index + 1}</span>`).join("")}</div></div>`;
  if (visual.kind === "line") return `<div class="visual"><div class="people-row">${Array.from({ length: visual.total }, (_, index) => `<i class="${index + 1 === visual.first ? "marked" : ""}">${index + 1}</i>`).join("")}</div></div>`;
  if (visual.kind === "paper-fold") return `<div class="visual fold-summary"><strong>${visual.folds === 1 ? "한 번" : "두 번"} 접기</strong><span>→</span><strong>구멍 ${visual.holes.length}개</strong><span>→</span><strong>펼치기</strong></div>`;
  return "";
}

function watermarkMarkup() {
  return Array.from({ length: 3 }, () => `<span>${student} · GFIELD · ${student} · GFIELD · ${student}</span>`).join("");
}

function renderWorksheet() {
  const title = state.mode === "exam" ? "맞춤 모의고사" : state.mode === "curriculum" ? "필즈 더 클래식 단원 학습지" : "유형별 맞춤 학습지";
  $("worksheetTitle").textContent = title;
  $("questionGrid").innerHTML = state.questions.map((question, index) => {
    const domain = DOMAINS.find((item) => item.id === question.type.domain);
    return `<article class="question-card">
      <div class="question-top"><span class="question-number">${String(index + 1).padStart(2, "0")}</span><span class="question-type">${domain.label} · ${question.type.middle} · ${question.type.label}</span></div>
      <span class="question-reference">기준 문제: ${question.reference}</span>
      <p class="question-prompt">${question.prompt.replaceAll("\n", "<br>")}</p>
      ${question.image ? `<img class="legacy-image" src="${question.image}" alt="${question.type.label} 문제 그림" />` : visualMarkup(question.visual)}
      ${question.responseKind === "drawing" ? '<span class="drawing-answer-note">위 빈 상자 안에 그림을 그리세요.</span>' : `<label class="answer-line ${question.responseKind === "list" ? "wide-answer-line" : ""}">답 <input class="answer-input" aria-label="${index + 1}번 답" /></label>`}
    </article>`;
  }).join("");
  $("watermark").innerHTML = state.watermark ? watermarkMarkup() : "";
  $("answerWatermark").innerHTML = state.watermark ? watermarkMarkup() : "";
}

function openAnswers() {
  $("answerBody").innerHTML = state.questions.map((question, index) => {
    const domain = DOMAINS.find((item) => item.id === question.type.domain);
    const answer = question.answerVisual?.kind === "letter-block-answer"
      ? `<div class="letter-answer-preview">${letterBlockTileMarkup(question.answerVisual.word, true)}</div>`
      : question.answer;
    return `<tr><td>${index + 1}</td><td>${domain.label}</td><td>${question.type.middle}</td><td>${question.type.label}</td><td>${answer}</td><td>${state.includeSolution ? question.solution : "-"}</td></tr>`;
  }).join("");
  $("answerDialog").showModal();
}

function initControls() {
  $("studentName").textContent = student;
  $("worksheetStudent").textContent = student;
  $("builderTabs").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
  $("toggleExamTypes").addEventListener("click", () => toggleVisible("#examTypeList input[data-exam-key]", state.selected.exam, (input) => input.dataset.examKey));
  $("toggleCurriculum").addEventListener("click", () => toggleVisible("#curriculumTree input[data-curriculum-key]", state.selected.curriculum, (input) => input.dataset.curriculumKey));
  $("toggleBankTypes").addEventListener("click", () => toggleVisible("#bankTypeTree input[data-type-id]", state.selected.type, (input) => input.dataset.typeId));
  $("countChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.count = Number(button.dataset.count);
    $("questionCount").value = state.count;
    $("countChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
    updateSummary();
  }));
  $("questionCount").addEventListener("change", (event) => {
    state.count = Math.max(1, Math.min(50, Number(event.target.value) || 20));
    event.target.value = state.count;
    updateSummary();
  });
  $("difficultyChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.difficulty = button.dataset.level;
    $("difficultyChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  }));
  $("orderChoices").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.order = button.dataset.order;
    $("orderChoices").querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
  }));
  $("solutionToggle").addEventListener("change", (event) => { state.includeSolution = event.target.checked; });
  $("watermarkToggle").addEventListener("change", (event) => { state.watermark = event.target.checked; });
  $("buildButton").addEventListener("click", buildQuestions);
  $("backToBuilder").addEventListener("click", () => { $("worksheetSection").hidden = true; $("builderPanel").hidden = false; });
  $("regenerateButton").addEventListener("click", buildQuestions);
  $("answerButton").addEventListener("click", openAnswers);
  $("printButton").addEventListener("click", () => window.print());
  $("closeAnswer").addEventListener("click", () => $("answerDialog").close());
  $("closeAnswerBottom").addEventListener("click", () => $("answerDialog").close());
  $("printAnswerButton").addEventListener("click", () => {
    document.body.classList.add("printing-answers");
    window.print();
    setTimeout(() => document.body.classList.remove("printing-answers"), 400);
  });
}

renderStageButtons();
renderExamList();
renderCurriculum();
renderTypeTree();
initControls();
setMode("exam");
