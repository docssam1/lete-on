import { AGE_STAGES, DOMAINS, TYPES, EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES, CURRICULUM, typeById } from "./source-data.js?v=20260816dm";
import { GENERATORS } from "./generators.js?v=20260816db";

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
  // 원본 대조를 거쳤다는 신호는 두 가지다. 시험지에서 확인한 것(hasVerifiedSource)과
  // 교재 페이지에서 확인한 것(textbookSource). 교재 유형은 대응하는 시험 문항이 없어도
  // 교재 원본과 1:1 대조가 끝났으면 유형·교재 탭에서 열 수 있다.
  // 시험지 탭은 이 함수와 별개로 문항별 verified 플래그를 함께 요구하므로,
  // 교재 대조만으로는 미검증 시험 문항이 열리지 않는다. 그 게이트는 절대 완화하지 않는다.
  return isReady(item) && (hasVerifiedSource(item.id) || Boolean(item.textbookSource));
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
    // 원문 이미지가 없는 시험지(sourcePageCount 미설정)는 링크 자체를 내지 않는다.
    // 링크만 걸어 두면 빈 뷰어로 들어가게 된다.
    // 파일명에 붙은 괄호 안 시행일(230206 등)은 화면에 내보내지 않는다. 파일을 찾는 데만 쓰는 값이다.
    const fileName = String(exam.file || "").replace(/\((\d{6}|\d{8})\)/g, "");
    const sourceLink = exam.sourceViewer === false || !exam.sourcePageCount ? "" : `<a class="source-view-link" href="./selection-test-viewer.html?exam=${exam.id}&student=${encodeURIComponent(student)}">원문 보기</a>`;
    return `<details class="tree-group" open><summary><strong>${exam.label}</strong><span>${exam.questions.length}문항</span></summary><div class="exam-source"><span>${fileName}</span>${sourceLink}</div>${rows}</details>`;
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
      if (state.selected.exam.has(examKey(exam.id, sourceQuestion.number))) {
        result.push({
          typeId: sourceQuestion.typeId,
          reference: `${exam.label} ${sourceQuestion.number}번`,
          fixedSeed: sourceQuestion.fixedSeed || null
        });
      }
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

function seededRandom(seedText) {
  let seed = 2166136261;
  for (const character of seedText) {
    seed ^= character.codePointAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeed(seedText, callback) {
  if (!seedText) return callback();
  const originalRandom = Math.random;
  Math.random = seededRandom(seedText);
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
  }
}

function generatedProblem(item, sequence, reference, fixedSeed = null, attempt = 0) {
  if (item.generator && GENERATORS[item.generator]) {
    const difficulty = state.difficulty === "basic" ? 1 : state.difficulty === "advanced" ? 3 : 2;
    const seed = fixedSeed ? `${fixedSeed}:${difficulty}:${sequence}:${attempt}` : null;
    // 답이 유일해야 하는 배치·추리 생성기는 조건이 안 맞으면 null을 준다. 실패는 정상이므로
    // 다시 뽑는다(중복 회피 루프와 별개). 받아 주지 않으면 빈 문항 카드가 나간다.
    // 고정 시드일 때는 재시도 회차를 시드에 섞어 재현성을 지킨다.
    for (let retry = 0; retry < 400; retry += 1) {
      // retry 0은 기존 시드 형식 그대로 — 파이널 1회 교체본처럼 이미 고정 시드로 검수된
      // 문항의 출력이 바뀌면 안 된다. 접미사는 실패로 다시 뽑을 때만 붙는다.
      const retrySeed = seed ? (retry === 0 ? seed : `${seed}:r${retry}`) : null;
      const generated = withSeed(retrySeed, () => GENERATORS[item.generator]({ max: 30, difficulty }));
      if (generated) return { ...generated, type: item, reference };
    }
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
      problem = generatedProblem(item, sequence, reference.reference, reference.fixedSeed, attempt);
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
  const arrows = [
    [58, 31, 42],
    [78, 17, 50],
    [44, 52, 34]
  ].slice(0, visual.shotCount).map(([x, y, angle]) => `<g class="target-arrow" transform="translate(${x} ${y}) rotate(${angle})"><line x1="0" y1="0" x2="48" y2="0"/><path d="M48 0L36-6M48 0L36 6"/></g>`).join("");
  return `<svg class="target-score-svg" viewBox="0 0 300 225" role="img" aria-label="바깥쪽부터 ${visual.scores.join(", ")}점인 과녁">${rings}${arrows}<text class="target-shot-note" x="150" y="220">화살 ${visual.shotCount}번</text></svg>`;
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
  return `<div class="pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>${visual.hint ? `<small>${visual.hint}</small>` : ""}<svg class="pyramid-svg" viewBox="0 0 300 215" role="img" aria-label="세 수를 이웃한 두 수끼리 두 번 모으는 수 피라미드"><g class="pyramid-links"><path d="M55 64L100 101M150 64L100 101M150 64L200 101M245 64L200 101M100 149L150 179M200 149L150 179"/></g><g class="pyramid-boxes"><rect x="31" y="16" width="48" height="48"/><rect x="126" y="16" width="48" height="48"/><rect x="221" y="16" width="48" height="48"/><rect x="76" y="101" width="48" height="48"/><rect x="176" y="101" width="48" height="48"/></g><text class="pyramid-blank-label" x="150" y="48">㉠</text><text class="pyramid-target-label" x="150" y="207">${visual.target}</text></svg></div>`;
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

function verticalStairGridPlacementMarkup(visual) {
  const given = visual.given?.index === 2 ? visual.given.value : "";
  return `<div class="stair-grid-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="vertical-stair-grid"><span class="cell p0">㉠</span><span class="cell p1"></span><span class="cell p2 given">${given}</span><span class="cell p3"></span></div></div>`;
}

function raceOrderMarkup(visual, conditions) {
  return `<div class="race-order"><div class="race-track-row"><b>앞</b><div class="race-track" style="--race-count:${visual.total}">${Array.from({ length: visual.total }, (_, index) => `<span><i></i><b>${index + 1}등</b></span>`).join("")}</div><b>뒤</b></div><ul>${conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
}

function linePositionSevenMarkup(visual) {
  const hint = visual.hint ? `<small>${visual.hint}</small>` : "";
  return `<div class="line-position-work"><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul>${hint}<div class="line-position-row"><b>앞</b><div style="--line-count:${visual.total}">${Array.from({ length: visual.total }, () => "<i></i>").join("")}</div><b>뒤</b></div></div>`;
}

function totalDifferenceCandyMarkup(visual) {
  const hint = visual.showHint ? `<small>먼저 ${visual.difference}개를 떼어 놓고, 남은 사탕을 둘로 똑같이 나누어 보세요.</small>` : "";
  return `<div class="candy-share-work"><div class="candy-count" style="--candy-columns:${Math.min(10, Math.ceil(Math.sqrt(visual.total)))}">${Array.from({ length: visual.total }, () => '<span aria-hidden="true">🍬</span>').join("")}</div>${hint}${visual.transfer ? `<p>한 사람이 다른 사람에게 <b>${visual.transfer}개</b>를 주었습니다.</p>` : `<p>두 사람의 차이는 <b>${visual.difference}개</b>입니다.</p>`}</div>`;
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
  const hint = visual.hint ? `<small class="addition-table-hint">${visual.hint}</small>` : "";
  return `<div class="addition-table-work">${hint}<div class="addition-table-grid" style="--table-size:${visual.size}">${cells}</div></div>`;
}

function discNumberRuleMarkup(visual) {
  const disc = (item, offset) => `<g transform="translate(${offset},76)"><circle class="disc-outer" r="52"/><path class="disc-line" d="M0-52V52M-52 0H52"/><circle class="disc-inner" r="24"/><text x="-27" y="-22">${item.northWest}</text><text x="27" y="-22">${item.northEast}</text><text x="-27" y="33">${item.southWest}</text><text x="27" y="33">${item.southEast}</text><text class="disc-center" y="7">${item.center}</text></g>`;
  return `<svg class="disc-rule-svg" viewBox="0 0 390 152" role="img" aria-label="원판 수 규칙 문제">${visual.discs.map((item, index) => disc(item, 70 + index * 125)).join("")}</svg>`;
}

function shapeSumTableMarkup(visual) {
  return `<div class="shape-sum-work"><div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div><div class="shape-sum-target"><div class="shape-sum-grid"><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function shapeSumRowTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealDiamond ? `<small class="shape-sum-hint">도움: ◇ = ${visual.diamond}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>□</span><b>${visual.rowOne}</b><span>◇</span><span>○</span><b class="target">㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
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

function shapeSumRepeatedColumnTargetMarkup(visual) {
  const example = visual.showExample ? `<div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div>` : "";
  const hint = visual.revealCircle ? `<small class="shape-sum-hint">도움: ○ = ${visual.circle}</small>` : "";
  return `<div class="shape-sum-work source-layout ${visual.showExample ? "" : "single"}">${example}<div class="shape-sum-target">${hint}<div class="shape-sum-source-grid"><span>◇</span><span>○</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>${visual.rowTwo}</b><b class="target">㉠</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function repeatShapeSequenceMarkup(visual) {
  const symbol = (item) => item === "세모" ? "△" : "○";
  return `<div class="repeat-sequence">${visual.items.map((item, index) => `<span>${symbol(item)}<small>${index + 1}</small></span>`).join("")}<b>…</b><strong>${visual.target}번째<br>모양 (　)</strong></div>`;
}

function repeatShapeColorDualMarkup(visual) {
  const guide = visual.showGuide ? `<small>모양 ${visual.shapeCount}개 주기 · 색 ${visual.fillCount}개 주기</small>` : "";
  return `<div class="dual-pattern-work">${guide}<div class="dual-pattern-sequence" style="--preview-count:${visual.previewCount}">${visual.items.map((item, index) => `<span class="${item.filled ? "filled" : "outline"}"><b>${item.symbol}</b><i>${index + 1}</i></span>`).join("")}</div><div class="dual-pattern-target"><b>…</b><strong>${visual.target}번째<br><i>(　　　　)</i></strong></div></div>`;
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

function arrowNumberHorizontalTensMarkup(visual) {
  const marker = `arrow-tens-${visual.start}-${visual.directions.join("")}`;
  const minX = Math.min(...visual.points.map((point) => point.x));
  const maxX = Math.max(...visual.points.map((point) => point.x));
  const minY = Math.min(...visual.points.map((point) => point.y));
  const maxY = Math.max(...visual.points.map((point) => point.y));
  const placed = visual.points.map((point) => ({ x: (point.x - minX) * 62 + 34, y: (point.y - minY) * 62 + 34 }));
  const width = (maxX - minX) * 62 + 68;
  const height = (maxY - minY) * 62 + 68;
  const arrows = placed.slice(0, -1).map((point, index) => {
    const next = placed[index + 1];
    const ux = Math.sign(next.x - point.x);
    const uy = Math.sign(next.y - point.y);
    return `<line x1="${point.x + ux * 24}" y1="${point.y + uy * 24}" x2="${next.x - ux * 25}" y2="${next.y - uy * 25}" marker-end="url(#${marker})"/>`;
  }).join("");
  const nodes = placed.map((point, index) => {
    if (index === 0) return `<rect x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">${visual.start}</text>`;
    if (index === placed.length - 1) return `<rect class="target" x="${point.x - 22}" y="${point.y - 22}" width="44" height="44"/><text x="${point.x}" y="${point.y + 6}">㉠</text>`;
    return `<circle cx="${point.x}" cy="${point.y}" r="21"/>`;
  }).join("");
  const legend = visual.legend;
  return `<div class="arrow-number-rule"><svg class="arrow-legend-svg" viewBox="0 0 230 178" role="img" aria-label="가로는 10, 세로는 1이 변하는 화살표 규칙 보기"><defs><marker id="${marker}-legend" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><text x="115" y="16">[보기]</text><rect x="92" y="72" width="46" height="34"/><rect x="20" y="72" width="46" height="34"/><rect x="164" y="72" width="46" height="34"/><rect x="92" y="24" width="46" height="34"/><rect x="92" y="120" width="46" height="34"/><text x="115" y="94">${legend.center}</text><text x="43" y="94">${legend.left}</text><text x="187" y="94">${legend.right}</text><text x="115" y="46">${legend.up}</text><text x="115" y="142">${legend.down}</text><path style="marker-end:url(#${marker}-legend)" d="M92 89H69M138 89H161M115 72V61M115 106V117"/></svg><svg class="arrow-grid-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="화살표를 따라 수를 찾는 문제"><defs><marker id="${marker}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z"/></marker></defs><g class="arrow-steps">${arrows}</g><g>${nodes}</g></svg></div>`;
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
  const mainDiagonal = visual.foldDirection === "main";
  const shaded = visual.foldMask.map(([row, column]) => {
    const x = column * cell;
    const y = row * cell;
    if (mainDiagonal && row === column) return `<path d="M${x} ${y}H${x + cell}V${y + cell}Z"/>`;
    if (!mainDiagonal && row + column === visual.size - 1) return `<path d="M${x} ${y}H${x + cell}L${x} ${y + cell}Z"/>`;
    return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}"/>`;
  }).join("");
  const foldLine = mainDiagonal ? `M0 0L${paperSize} ${paperSize}` : `M0 ${paperSize}L${paperSize} 0`;
  const foldArrow = mainDiagonal
    ? `<path class="fold-arrow" d="M${paperSize - 30} 36Q${paperSize - 58} 58 ${paperSize - 82} 82"/><path class="fold-arrow-head" d="M${paperSize - 82} 82l12 -3l-4 12Z"/>`
    : `<path class="fold-arrow" d="M${paperSize - 34} ${paperSize - 45}Q${paperSize - 60} ${paperSize - 78} ${paperSize - 93} ${paperSize - 88}"/><path class="fold-arrow-head" d="M${paperSize - 93} ${paperSize - 88}l12 -5l-4 12Z"/>`;
  const paper = `<svg class="fold-cut-paper" viewBox="-8 -24 ${paperSize + 16} ${paperSize + 34}" role="img" aria-label="대각선으로 접고 칠한 부분을 자르는 색종이"><text x="${paperSize / 2}" y="-8">한 번 접기</text><rect width="${paperSize}" height="${paperSize}"/><g class="fold-cut-grid">${gridLines}</g><path class="fold-line" d="${foldLine}"/><g class="cut-shade">${shaded}</g>${foldArrow}</svg>`;
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
  const gapCondition = visual.onesGreater
    ? `일의 자리 숫자가 십의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.`
    : `십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.`;
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.lower}</strong>보다 크고 <strong>${visual.upper}</strong>보다 작은 짝수입니다.</li><li>${gapCondition}</li>${visual.digitSum === null ? "" : `<li>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.digitSum}</strong>입니다.</li>`}</ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function twoDigitOddGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.upper}</strong>보다 작은 홀수입니다.</li><li>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 작습니다.</li></ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
}

function twoDigitOddBoundedGapMarkup(visual) {
  return `<div class="number-conditions parity-gap-conditions"><ul><li><strong>${visual.lower}</strong>보다 크고 <strong>${visual.upper}</strong>보다 작은 홀수입니다.</li><li>일의 자리 숫자가 십의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</li>${visual.digitSum === null ? "" : `<li>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.digitSum}</strong>입니다.</li>`}</ul>${visual.choices.length ? `<div class="parity-gap-choices"><b>[보기]</b>${visual.choices.map((value) => `<span>${value}</span>`).join("")}</div>` : ""}</div>`;
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
  return `<div class="triangle-growth-work growth-theme-${visual.theme || "navy"}">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
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
  return `<div class="square-growth-work growth-theme-${visual.theme || "navy"}">${visual.stages.map(stage).join("")}<strong>…</strong><em>${visual.askIndex ? `${visual.pieceCount}장` : `${visual.target}번째`}</em></div>`;
}

function growingDotSquareMarkup(visual) {
  const stage = (size) => `<div><i style="--dots:${size}">${Array.from({ length: size * size }, () => "<b></b>").join("")}</i><span>${size}번째</span></div>`;
  return `<div class="growing-dot-squares growth-theme-${visual.theme || "navy"}">${[1,2,3,4].map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function symbolSumGridMarkup(visual) {
  const cells = ["☆", "□", "△", visual.rowOne, "□", "□", "☆", visual.rowTwo, "△", "□", "○", visual.rowThree, visual.rowOne, visual.columnTwo, "㉠"];
  return `<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div>`;
}

function shapeSumGridTriangleTopMarkup(visual) {
  const cells = [
    "△", "△", "△", visual.rowSums[0],
    "□", "□", "△", visual.rowSums[1],
    "○", "◇", "♡", "㉠",
    visual.columnSums[0], visual.columnSums[1], visual.columnSums[2]
  ];
  return `<div class="shape-sum-grid-top-work">${visual.hint ? `<p>${visual.hint}</p>` : ""}<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
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

function shapeSumGridTriangleColumnTargetMarkup(visual) {
  const sumLabel = (value, key) => visual.hiddenSums.includes(key) ? "" : value;
  const cells = [
    "△", "○", "◇", "㉠",
    "△", "□", "□", sumLabel(visual.rowSums[1], "row-2"),
    "△", "◇", "□", sumLabel(visual.rowSums[2], "row-3"),
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
  return `<div class="balance-relations"><p>양쪽에 있는 물건의 무게가 같을 때 저울은 수평이 됩니다.</p>${scale(`${pieces("circle", visual.leftCircleCount)}${pieces("square", visual.starRectangles)}`, `${pieces("star", 1)}${pieces("circle", visual.rightCircleCount)}`, "[그림 1]")}${scale(pieces("circle", visual.rectangleWeight * visual.middleRectangleCount), pieces("rectangle", visual.middleRectangleCount), "[그림 2]")}${scale(`${pieces("star", 1)}${pieces("rectangle", visual.targetRectangles)}`, `<strong>○ (　)개</strong>`, "[그림 3]")}${visual.hint ? `<p>${visual.hint}</p>` : ""}</div>`;
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

function balanceScaleCircleTargetMarkup(visual) {
  const symbols = { circle: "○", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(`${pieces("circle", visual.circleCount)}${pieces("diamond", visual.diamondCount)}`, pieces("star", visual.starCount), "[그림 1]");
  const second = scale(`${pieces("diamond", visual.secondDiamondCount)}${pieces("star", visual.secondStarCount)}`, pieces("circle", visual.secondCircleCount), "[그림 2]");
  const third = scale(`${pieces("diamond", visual.targetDiamondCount)}${pieces("star", visual.targetStarCount)}`, "<strong>○ (　)개</strong>", "[그림 3]");
  return `<div class="three-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">${visual.hint}</p>` : ""}</div>`;
}

function balanceScaleStarTargetMarkup(visual) {
  const symbols = { circle: "○", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(`${pieces("star", visual.starLeft)}${pieces("circle", 1)}`, pieces("diamond", visual.diamondRight), "[그림 1]");
  const second = scale(`${pieces("circle", visual.circleLeft)}${pieces("diamond", 1)}`, pieces("star", visual.starRight), "[그림 2]");
  const third = scale(`${pieces("circle", visual.targetCircleCount)}${pieces("diamond", visual.targetDiamonds)}`, "<strong>☆ (　)개</strong>", "[그림 3]");
  return `<div class="three-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">${visual.hint}</p>` : ""}</div>`;
}

function balanceScaleFourObjectsMarkup(visual) {
  const symbols = { circle: "○", square: "□", star: "☆", diamond: "◇" };
  const pieces = (kind, count) => Array.from({ length: count }, () => `<i class="weight-piece ${kind}" aria-label="${symbols[kind]}">${symbols[kind]}</i>`).join("");
  const scale = (left, right, label) => `<div class="balance-example three-object-scale"><div class="balance-pan">${left}</div><b>=</b><div class="balance-pan">${right}</div><small>${label}</small></div>`;
  const first = scale(pieces("circle", 1), `${pieces("square", visual.circleSquareCount)}${pieces("diamond", visual.circleDiamondCount)}`, "[그림 1]");
  const second = scale(pieces("star", visual.starCount), pieces("diamond", visual.diamondCount), "[그림 2]");
  const third = scale(pieces("square", 1), `${pieces("star", visual.squareStarCount)}${pieces("diamond", visual.squareDiamondCount)}`, "[그림 3]");
  return `<div class="three-object-balances four-object-balances">${first}${second}${third}${visual.hint ? `<p class="balance-hint">도움: ${visual.hint}</p>` : ""}<strong class="balance-target">○ 1개 = ◇ (　)개</strong></div>`;
}

function symbolRelationsMarkup(visual) {
  const repeat = (symbol, count) => Array.from({ length: count }, () => symbol).join(" + ");
  return `<div class="symbol-relations">${visual.hint ? `<small>${visual.hint}</small>` : ""}<p>${repeat("☆", visual.firstStar)} = ${repeat("○", visual.firstCircle)}</p><p>☆ + ○ = ▽ + ▽</p><p>${visual.final.join(" + ")} = □</p></div>`;
}

function numberLineSixPointsMarkup(visual) {
  const d = visual.distances;
  const gaps = visual.gaps || [
    d.ac - (d.bd - (d.ad - d.ac)),
    d.bd - (d.ad - d.ac),
    d.ad - d.ac,
    d.ce - (d.ad - d.ac),
    d.bf - (d.bd - (d.ad - d.ac)) - (d.ad - d.ac) - (d.ce - (d.ad - d.ac))
  ];
  const total = gaps.reduce((sum, value) => sum + value, 0);
  const displayGaps = gaps.map((value) => 20 + (310 * value) / total);
  const labels = ["A", "B", "C", "D", "E", "F"];
  let running = 0;
  const xs = Object.fromEntries(labels.map((label, index) => {
    if (index > 0) running += displayGaps[index - 1];
    return [label, 28 + running];
  }));
  const arc = (from, to, value, side, height, className = "") => {
    const x1 = xs[from];
    const x2 = xs[to];
    const controlY = side === "top" ? 78 - height : 78 + height;
    const labelY = side === "top" ? controlY + 7 : controlY - 3;
    return `<path class="distance-arc ${className}" d="M ${x1} 78 Q ${(x1 + x2) / 2} ${controlY} ${x2} 78"/><text class="distance-label ${className}" x="${(x1 + x2) / 2}" y="${labelY}">${value}</text>`;
  };
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
  return `<div class="go-difference-work"><div class="go-triangle-stages">${Array.from({ length: visual.stages }, (_, index) => stage(index + 1)).join("")}<b>…</b></div>${visual.hint ? `<p>${visual.hint}</p>` : ""}<strong>${visual.targetText || `${visual.targetColor}이 ${visual.difference}개 더 많은 때`}</strong></div>`;
}

function fiveCellPlacementMarkup(visual) {
  const cells = [
    [140, 12, "top"], [76, 76, "target"], [140, 76, "center"], [204, 76, "right"], [204, 140, "bottom"]
  ];
  const givenValue = visual.given?.position === "top" ? visual.given.value : "";
  return `<div class="five-cell-placement-work"><div class="five-cell-cards">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="five-cell-body"><svg viewBox="0 0 340 212" role="img" aria-label="위 한 칸, 가운데 세 칸, 오른쪽 아래 한 칸으로 이어진 다섯 칸"><g>${cells.map(([x, y, position]) => `<rect x="${x}" y="${y}" width="64" height="64"/><text x="${x + 32}" y="${y + 39}">${position === "target" ? "㉠" : position === "top" ? givenValue : ""}</text>`).join("")}</g></svg><div class="five-cell-clues">${visual.clues.map((clue) => `<p>${clue}</p>`).join("")}${visual.extra ? `<strong>${visual.extra}</strong>` : ""}</div></div></div>`;
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

function polygonPoints(sides, radius, cx, cy) {
  return Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI * 2 / sides;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
  });
}

function polygonStoneDots(sides, perSide, radius, cx, cy) {
  const vertices = polygonPoints(sides, radius, cx, cy);
  const dots = [];
  vertices.forEach(([x1, y1], index) => {
    const [x2, y2] = vertices[(index + 1) % sides];
    for (let step = 0; step < perSide - 1; step += 1) {
      const ratio = step / (perSide - 1);
      dots.push([x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio]);
    }
  });
  return dots;
}

function g1SourceMarkup(visual) {
  if (visual.kind === "g1-bus-two-stops") {
    return `<div class="g1-event-flow"><strong>출발 ${visual.start}명</strong>${visual.events.map(({ left, boarded }, index) => `<span>→</span><section><b>${index + 1}번째 정류장</b><small>${left}명 내림</small><small>${boarded}명 탐</small></section>`).join("")}</div>`;
  }
  if (visual.kind === "g1-condition-list") {
    return `<div class="g1-condition-panel"><strong>${visual.title}</strong><ul>${visual.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
  }
  if (visual.kind === "g1-equation-panel") {
    return `<div class="g1-equation-panel">${visual.equations.map((equation) => `<p>${equation}</p>`).join("")}${visual.hint ? `<small>${visual.hint}</small>` : ""}</div>`;
  }
  if (visual.kind === "g1-fold-cut-pieces") {
    const folds = visual.folds.map((fold, index) => `<section><i class="g1-fold-paper fold-${index + 1}"></i><b>${fold}</b></section><span>→</span>`).join("");
    return `<div class="g1-fold-flow tone-${visual.paperTone}">${folds}<section><i class="g1-fold-paper cut cut-${visual.cutPattern} ${visual.folds.length === 1 ? "cut-once" : ""}"></i><b>${visual.cuts}</b></section></div>`;
  }
  if (visual.kind === "g1-repeated-digit-addition") {
    const resultText = String(visual.result).split("").join(" ");
    return `<div class="g1-vertical-addition"><p>${visual.digitSymbol} ${visual.otherSymbol}</p><p><b>+</b> ${visual.digitSymbol} ${visual.otherSymbol}</p><hr><p>${resultText}</p></div>`;
  }
  if (visual.kind === "g1-balance-three-relations") {
    const repeated = (symbol, count) => Array.from({ length: count }, () => symbol).join(" ");
    return `<div class="g1-balance-relations"><section><span>${repeated("▭", visual.triangleRectangles)}</span><b>=</b><span>△</span><small>[그림 1]</small></section><section><span>${repeated("▭", visual.circleRectangles)} ${repeated("△", visual.circleTriangles)}</span><b>=</b><span>○</span><small>[그림 2]</small></section><section><span>△ ○</span><b>=</b><span>▭ (　)개</span><small>[그림 3]</small></section></div>`;
  }
  if (visual.kind === "g1-stacked-shape-cycle") {
    return `<div class="g1-stacked-cycle">${visual.items.map((item, index) => `<section><span>${Array.from({ length: item.count }, () => `<i>${item.shape}</i>`).join("")}</span><b>${index + 1}</b></section>`).join("")}<em>…</em><strong>${visual.target}번째</strong></div>`;
  }
  if (visual.kind === "g1-triangle-color-difference") {
    const stage = (size) => `<section><div>${Array.from({ length: size }, (_, row) => `<span>${Array.from({ length: row + 1 }, () => "△").join("")}</span>${row < size - 1 ? `<span class="filled">${Array.from({ length: row + 1 }, () => "▽").join("")}</span>` : ""}`).join("")}</div><b>${size}번째</b></section>`;
    return `<div class="g1-triangle-growth">${[1, 2, 3].map(stage).join("")}<em>…</em><strong>${visual.target}번째</strong></div>`;
  }
  if (visual.kind === "g1-shape-sum-grid-four") {
    const cells = ["○", "○", "◇", "◇", visual.rowSums[0], "□", "▣", "◇", "◇", visual.rowSums[1], "□", "○", "○", "○", visual.rowSums[2], "○", "▣", "□", "◇", "㉠", ...visual.columnSums];
    return `<div class="g1-shape-grid-wrap">${visual.hint ? `<small>${visual.hint}</small>` : ""}<div class="g1-shape-grid">${cells.map((cell, index) => `<span class="${index % 5 === 4 || index >= 20 ? "sum" : ""}">${cell}</span>`).join("")}</div></div>`;
  }
  if (visual.kind === "g1-rod-ratio-total") {
    return `<div class="g1-rods"><section>${Array.from({ length: visual.topUnits }, () => "<i>㉠</i>").join("")}</section><section>${Array.from({ length: visual.bottomUnits }, () => "<i>㉡</i>").join("")}</section><strong><i>㉠</i><i>㉡</i><b>${visual.total}cm</b></strong></div>`;
  }
  if (visual.kind === "g1-polygon-stones") {
    const sourceVertices = polygonPoints(visual.sourceSides, 62, 80, 76).map((point) => point.join(",")).join(" ");
    const targetVertices = polygonPoints(visual.targetSides, 62, 240, 76).map((point) => point.join(",")).join(" ");
    const sourceDots = polygonStoneDots(visual.sourceSides, Math.min(visual.sourcePerSide, 12), 62, 80, 76);
    const targetDots = polygonStoneDots(visual.targetSides, Math.min(visual.targetPerSide, 12), 62, 240, 76);
    return `<svg class="g1-polygon-stones" viewBox="0 0 320 165" role="img" aria-label="다각형 둘레에 놓인 바둑돌을 다른 다각형으로 다시 늘어놓기"><polygon points="${sourceVertices}"/><polygon points="${targetVertices}"/>${sourceDots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}${targetDots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join("")}<text x="80" y="158">${visual.sourceName} · 한 변 ${visual.sourcePerSide}개</text><text x="240" y="158">${visual.targetName} · 한 변 ?개</text></svg>`;
  }
  if (visual.kind === "g1-paired-sequences") {
    const top = Array.from({ length: 4 }, (_, index) => visual.topStart + index * visual.topStep);
    const bottom = Array.from({ length: 4 }, (_, index) => visual.bottomStart + index * visual.bottomStep);
    return `<div class="g1-paired-table"><span>${top.join("　")}</span><b>…</b><strong>${visual.topLast}</strong><span>${bottom.join("　")}</span><b>…</b><strong>㉮</strong></div>`;
  }
  if (visual.kind === "g1-ratio-distribution") {
    return `<div class="g1-ratio-panel"><section><b>어린이</b><span>${visual.childGroup}명</span><em>귤 1개</em></section><section><b>어른</b><span>1명</span><em>귤 ${visual.adultItems}개</em></section><strong>모두 ${visual.people}명 · 귤 ${visual.items}개</strong></div>`;
  }
  if (visual.kind === "g1-odd-even-difference") {
    return `<div class="g1-odd-even-strip"><span>1, 2, 3, 4, … ,</span><strong>㉠</strong><small>홀수 합과 짝수 합의 차: ${visual.difference}</small></div>`;
  }
  return "";
}

function cryptarithmVerticalMarkup(visual) {
  // 자리를 오른쪽으로 맞춰 세로셈처럼 세운다. 자리 수가 다르면 왼쪽을 빈칸으로 채운다.
  const width = Math.max(visual.first.length, visual.second.length, visual.sum.length);
  const pad = (row) => Array.from({ length: width - row.length }, () => "").concat(row);
  const line = (row, sign) => `<div class="cv-row">${sign ? `<b class="cv-sign">${sign}</b>` : `<b class="cv-sign"></b>`}${pad(row).map((cell) => `<span>${cell}</span>`).join("")}</div>`;
  return `<div class="cryptarithm-vertical" style="--cv-cols:${width}">${line(visual.first, "")}${line(visual.second, "+")}<div class="cv-bar"></div>${line(visual.sum, "")}</div>`;
}

function foldGeometryHelpers() {
  const KEEP = { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };
  const foldArrow = (polygon, dir) => {
    const keep = KEEP[dir];
    const mirror = MIRROR[dir];
    const away = clip(polygon, (p) => -keep(p));
    if (away.length < 3) return "";
    const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
    const to = mirror(from);
    return { from, to };
  };
  return { KEEP, MIRROR, clip, foldLine, foldArrow };
}

function foldArrowSvg(from, to, shift, top, size) {
  if (!from) return "";
  const sx = shift + from.x * size;
  const sy = top + from.y * size;
  const ex = shift + to.x * size;
  const ey = top + to.y * size;
  const nx = -(ey - sy);
  const ny = ex - sx;
  const len = Math.hypot(nx, ny) || 1;
  const bulge = Math.min(size * 0.22, 20);
  const cx = (sx + ex) / 2 + (nx / len) * bulge;
  const cy = (sy + ey) / 2 + (ny / len) * bulge;
  const angle = Math.atan2(ey - cy, ex - cx);
  const head = [
    `${(ex + 6 * Math.cos(angle)).toFixed(1)},${(ey + 6 * Math.sin(angle)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle - 0.5)).toFixed(1)}`,
    `${(ex - 13 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 13 * Math.sin(angle + 0.5)).toFixed(1)}`
  ].join(" ");
  return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
}

function foldStepArrowSvg(x, y) {
  return `<path d="M${x} ${y} H${x + 30}" stroke="#95a5a6" stroke-width="3"/><polygon points="${x + 30},${y} ${x + 20},${y - 7} ${x + 20},${y + 7}" fill="#95a5a6"/>`;
}

function foldNumberGridMarkup(visual) {
  const N = 4;
  const cell = 30;
  const size = N * cell;
  const numberGrid = (grid, ox, oy, dim, showNumbers) => {
    let out = `<rect x="${ox}" y="${oy}" width="${dim.w * cell}" height="${dim.h * cell}" fill="${showNumbers ? "#f9c8c4" : "#fbdad6"}" stroke="#e8968f" stroke-width="2"/>`;
    for (let k = 1; k < dim.w; k += 1) out += `<line x1="${ox + k * cell}" y1="${oy}" x2="${ox + k * cell}" y2="${oy + dim.h * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    for (let k = 1; k < dim.h; k += 1) out += `<line x1="${ox}" y1="${oy + k * cell}" x2="${ox + dim.w * cell}" y2="${oy + k * cell}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    if (showNumbers) {
      for (let r = 0; r < dim.h; r += 1) for (let c = 0; c < dim.w; c += 1) {
        out += `<text x="${ox + c * cell + cell / 2}" y="${oy + r * cell + cell / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${grid[r][c]}</text>`;
      }
    }
    return out;
  };

  let x = 8;
  const top = 6;
  let parts = numberGrid(visual.grid, x, top, { w: N, h: N }, true);
  parts += `<line x1="${x + 2 * cell}" y1="${top}" x2="${x + 2 * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  parts += `<line x1="${x}" y1="${top + 2 * cell}" x2="${x + size}" y2="${top + 2 * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const midW = visual.hDir === "up" || visual.hDir === "down" ? N : 2;
  const midH = 2;
  const midGrid = visual.hDir === "up" ? [visual.grid[0], visual.grid[1]] : [visual.grid[2], visual.grid[3]];
  parts += numberGrid(midGrid, x, top + cell, { w: N, h: 2 }, false);
  parts += `<line x1="${x + 2 * cell}" y1="${top + cell}" x2="${x + 2 * cell}" y2="${top + cell + 2 * cell}" stroke="#7ba7bb" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const half = size / 2;
  parts += numberGrid([[0, 0], [0, 0]], x, top + cell / 2, { w: 2, h: 2 }, false).replace(/width="[\d.]+" height="[\d.]+"/, `width="${half}" height="${half}"`);
  const cutSet = new Set(visual.cells.map((c) => c.r * 2 + c.c));
  for (const cell2 of visual.cells) {
    const cx2 = x + (cell2.c * half) / 2;
    const cy2 = top + cell / 2 + (cell2.r * half) / 2;
    parts += `<rect x="${cx2}" y="${cy2}" width="${half / 2}" height="${half / 2}" fill="#b03a5b"/>`;
  }
  x += half + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  parts += numberGrid(visual.grid, x, top, { w: N, h: N }, true);

  return `<svg class="fold-number-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="수가 쓰인 색종이 접기 문제">${parts}</svg>`;
}

function foldDiagonalGridMarkup(visual) {
  const N = 4;
  const cell = 34;
  const size = N * cell;
  const top = 6;
  let x = 8;

  let parts = `<rect x="${x}" y="${top}" width="${size}" height="${size}" fill="#fdeeec" stroke="#eec6c1" stroke-width="1" stroke-dasharray="4 3"/>`;
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#eec6c1" stroke-dasharray="4 3"/>`;
  }
  const tri = visual.keepLower
    ? [[0, 0], [0, N], [N, N]]
    : [[0, 0], [N, 0], [N, N]];
  const triPoints = tri.map(([px, py]) => `${x + px * cell},${top + py * cell}`).join(" ");
  parts += `<polygon points="${triPoints}" fill="#fbdad6" stroke="#e8968f" stroke-width="2.4"/>`;
  for (const u of visual.region) {
    const cx = x + u.c * cell;
    const cy = top + u.r * cell;
    if (!u.half) {
      parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#b03a5b"/>`;
    } else {
      const points = visual.keepLower
        ? `${cx},${cy} ${cx},${cy + cell} ${cx + cell},${cy + cell}`
        : `${cx},${cy} ${cx + cell},${cy} ${cx + cell},${cy + cell}`;
      parts += `<polygon points="${points}" fill="#b03a5b"/>`;
    }
  }
  parts += `<line x1="${x}" y1="${top}" x2="${x + size}" y2="${top + size}" stroke="#e8968f" stroke-width="1.4" stroke-dasharray="5 4"/>`;

  x += size + 40;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    const cx = x + c * cell;
    const cy = top + r * cell;
    parts += `<rect x="${cx}" y="${cy}" width="${cell}" height="${cell}" fill="#f9c8c4" stroke="#e0aaa4" stroke-width="1"/>`;
    parts += `<text x="${cx + cell / 2}" y="${cy + cell / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${visual.grid[r][c]}</text>`;
  }
  for (let k = 1; k < N; k += 1) {
    parts += `<line x1="${x + k * cell}" y1="${top}" x2="${x + k * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
    parts += `<line x1="${x}" y1="${top + k * cell}" x2="${x + size}" y2="${top + k * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  }
  parts = `<rect x="${x - 2}" y="${top - 2}" width="${size + 4}" height="${size + 4}" fill="none" stroke="#e8968f" stroke-width="2.4"/>` + parts;

  return `<svg class="fold-diag-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="대각선 접기 수 색종이 문제">${parts}</svg>`;
}

function foldNumberInverseMarkup(visual) {
  const N = 4;
  const cell = 30;
  const size = N * cell;
  const top = 6;
  let x = 8;
  const rect = (rows, ox, oy, cellSize, showNumbers) => {
    const h = rows.length;
    const w = rows[0].length;
    let out = `<rect x="${ox}" y="${oy}" width="${w * cellSize}" height="${h * cellSize}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2.2"/>`;
    for (let k = 1; k < w; k += 1) out += `<line x1="${ox + k * cellSize}" y1="${oy}" x2="${ox + k * cellSize}" y2="${oy + h * cellSize}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    for (let k = 1; k < h; k += 1) out += `<line x1="${ox}" y1="${oy + k * cellSize}" x2="${ox + w * cellSize}" y2="${oy + k * cellSize}" stroke="#e0aaa4" stroke-dasharray="3 2"/>`;
    if (showNumbers) {
      for (let r = 0; r < h; r += 1) for (let c = 0; c < w; c += 1) {
        out += `<text x="${ox + c * cellSize + cellSize / 2}" y="${oy + r * cellSize + cellSize / 2 + 5}" text-anchor="middle" font-size="15" font-weight="600" fill="#333">${rows[r][c]}</text>`;
      }
    }
    return out;
  };

  let parts = rect(visual.grid, x, top, cell, true);
  parts += `<line x1="${x + 2 * cell}" y1="${top}" x2="${x + 2 * cell}" y2="${top + size}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  parts += `<line x1="${x}" y1="${top + 2 * cell}" x2="${x + size}" y2="${top + 2 * cell}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 4"/>`;
  x += size + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const mid = visual.firstFold === "h"
    ? [visual.grid[visual.packetRow], visual.grid[visual.packetRow + 1]]
    : visual.grid.map((row) => [row[visual.packetCol], row[visual.packetCol + 1]]);
  const midW = visual.firstFold === "h" ? N : 2;
  const midTop = visual.firstFold === "h" ? top + cell : top;
  parts += rect(mid, x, midTop, cell, true);
  x += midW * cell + 14;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 44;

  const packet = [
    [visual.grid[visual.packetRow][visual.packetCol], visual.grid[visual.packetRow][visual.packetCol + 1]],
    [visual.grid[visual.packetRow + 1][visual.packetCol], visual.grid[visual.packetRow + 1][visual.packetCol + 1]]
  ];
  parts += rect(packet, x, top + cell, cell + 6, true);

  return `<svg class="fold-inverse-svg" viewBox="0 0 ${x + 2 * (cell + 6) + 10} ${size + 16}" role="img" aria-label="목표 합이 되게 색칠하기 문제">${parts}</svg>`;
}

function foldCutPiecesMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const n = visual.stages.length;
  const size = n <= 3 ? 100 : 84;
  const gap = 34;
  let shift = 6;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    const points = stage.polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ");
    parts += `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(6 + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(6 + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, 6, size);
    } else {
      for (const [a, b] of visual.cuts) {
        parts += `<line x1="${(shift + a.x * size).toFixed(1)}" y1="${(6 + a.y * size).toFixed(1)}" x2="${(shift + b.x * size).toFixed(1)}" y2="${(6 + b.y * size).toFixed(1)}" stroke="#b03a5b" stroke-width="2.6"/>`;
      }
    }
    shift += size + 12;
    if (index < n - 1) { parts += foldStepArrowSvg(shift, 6 + size / 2); shift += gap; }
  });
  return `<svg class="fold-pieces-svg" viewBox="0 0 ${shift + 6} ${size + 16}" role="img" aria-label="색종이 접어 자르기 조각 개수 문제">${parts}</svg>`;
}

function foldPunchMarkup(visual) {
  const { foldLine, foldArrow } = foldGeometryHelpers();
  const n = visual.stages.length;
  const size = n <= 3 ? 100 : 84;
  const gap = 34;
  let shift = 6;
  let parts = "";
  visual.stages.forEach((stage, index) => {
    const points = stage.polygon.map((p) => `${(shift + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ");
    parts += `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) parts += `<line x1="${(shift + segment[0].x * size).toFixed(1)}" y1="${(6 + segment[0].y * size).toFixed(1)}" x2="${(shift + segment[1].x * size).toFixed(1)}" y2="${(6 + segment[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      const arrow = foldArrow(stage.polygon, stage.fold);
      if (arrow) parts += foldArrowSvg(arrow.from, arrow.to, shift, 6, size);
    } else {
      for (const q of visual.punches) {
        const cx = shift + q.cx * size;
        const cy = 6 + q.cy * size;
        const r = q.r * size;
        if (q.type === "full") {
          parts += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#8a8a94" stroke-width="1.8"/>`;
        } else {
          // 남는 반쪽은 법선의 반대편이다 — 개수 판정 규칙(dot <= 0)과 같은 쪽.
          // 시작각 θ+π/2에서 sweep-flag 1로 그리면 θ+π(법선 반대편)를 지나 안쪽으로 부푼다.
          // 화면이 작으면 밖으로 나간 것처럼 보이지만 아니다 — 네 가장자리 208개를 좌표로
          // 재봐서 전부 종이 안임을 확인했다. 눈으로만 보고 방향을 뒤집지 말 것.
          const a0 = Math.atan2(q.ny, q.nx) + Math.PI / 2;
          const a1 = a0 + Math.PI;
          const sx = cx + r * Math.cos(a0);
          const sy = cy + r * Math.sin(a0);
          const ex = cx + r * Math.cos(a1);
          const ey = cy + r * Math.sin(a1);
          parts += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${ex.toFixed(1)} ${ey.toFixed(1)} Z" fill="#fff" stroke="#8a8a94" stroke-width="1.8"/>`;
        }
      }
    }
    shift += size + 12;
    if (index < n - 1) { parts += foldStepArrowSvg(shift, 6 + size / 2); shift += gap; }
  });
  return `<svg class="fold-punch-svg" viewBox="0 0 ${shift + 6} ${size + 16}" role="img" aria-label="반원·원 펀치 문제">${parts}</svg>`;
}

function foldStackMarkup(visual) {
  const u = 46;
  const ox = 6;
  const oy = 6;
  let parts = "";
  for (let k = 7; k >= 0; k -= 1) {
    const p = visual.pos[visual.z[k]];
    parts += `<rect x="${ox + p.c * u}" y="${oy + p.r * u}" width="${2 * u}" height="${2 * u}" fill="#fff" stroke="#3f7f9e" stroke-width="2"/>`;
  }
  visual.spots.forEach((spot, index) => {
    parts += `<text x="${ox + spot.x * u}" y="${oy + spot.y * u + 6}" text-anchor="middle" font-size="17" font-weight="700" fill="#333">${visual.order[index]}</text>`;
  });
  return `<svg class="fold-stack-svg" viewBox="0 0 ${4 * u + 12} ${4 * u + 12}" role="img" aria-label="겹친 색종이 순서 문제">${parts}</svg>`;
}

function foldUnfoldChoiceMarkup(visual) {
  const { foldLine, foldArrow, clip } = foldGeometryHelpers();
  const size = 92;
  const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  let x = 6;
  const top = 6;
  let parts = `<polygon points="${square.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  const seg1 = foldLine(square, visual.directions[0]);
  if (seg1) parts += `<line x1="${(x + seg1[0].x * size).toFixed(1)}" y1="${(top + seg1[0].y * size).toFixed(1)}" x2="${(x + seg1[1].x * size).toFixed(1)}" y2="${(top + seg1[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const arrow1 = foldArrow(square, visual.directions[0]);
  if (arrow1) parts += foldArrowSvg(arrow1.from, arrow1.to, x, top, size);
  x += size + 10;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 42;

  const half = clip(square, { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y }[visual.directions[0]]);
  parts += `<polygon points="${half.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  const seg2 = foldLine(half, visual.directions[1]);
  if (seg2) parts += `<line x1="${(x + seg2[0].x * size).toFixed(1)}" y1="${(top + seg2[0].y * size).toFixed(1)}" x2="${(x + seg2[1].x * size).toFixed(1)}" y2="${(top + seg2[1].y * size).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
  const arrow2 = foldArrow(half, visual.directions[1]);
  if (arrow2) parts += foldArrowSvg(arrow2.from, arrow2.to, x, top, size);
  x += size + 10;
  parts += foldStepArrowSvg(x, top + size / 2);
  x += 42;

  const quad = clip(half, { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y }[visual.directions[1]]);
  parts += `<polygon points="${quad.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
  parts += `<polygon points="${visual.cut.map((p) => `${(x + p.x * size).toFixed(1)},${(top + p.y * size).toFixed(1)}`).join(" ")}" fill="#b03a5b"/>`;

  const stageSvg = `<svg class="fold-unfold-stage-svg" viewBox="0 0 ${x + size + 10} ${size + 16}" role="img" aria-label="색종이 접기 단계">${parts}</svg>`;

  const optionSvg = visual.options.map((opt, index) => {
    let optParts = `<polygon points="${square.map((p) => `${(6 + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ")}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    optParts += `<line x1="${6 + size / 2}" y1="6" x2="${6 + size / 2}" y2="${6 + size}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    optParts += `<line x1="6" y1="${6 + size / 2}" x2="${6 + size}" y2="${6 + size / 2}" stroke="#d4756c" stroke-width="1.4" stroke-dasharray="5 4"/>`;
    for (const poly of opt.polygons) {
      optParts += `<polygon points="${poly.map((p) => `${(6 + p.x * size).toFixed(1)},${(6 + p.y * size).toFixed(1)}`).join(" ")}" fill="#fff"/>`;
    }
    return `<div class="fold-unfold-option"><svg viewBox="0 0 ${size + 12} ${size + 12}" role="img" aria-label="보기 ${"①②③④"[index]}">${optParts}</svg><b>${"①②③④"[index]}</b></div>`;
  }).join("");

  return `<div class="fold-unfold-choice-work">${stageSvg}<div class="fold-unfold-options">${optionSvg}</div></div>`;
}

function paperFoldMarkup(visual) {
  const SIZE = visual.stages.length > 3 ? 84 : 100;
  const GAP = 34;
  const KEEP = { v: (p) => 0.5 - p.x, h: (p) => 0.5 - p.y, d1: (p) => p.x - p.y, d2: (p) => 1 - p.x - p.y };
  const MIRROR = {
    v: (p) => ({ x: 1 - p.x, y: p.y }),
    h: (p) => ({ x: p.x, y: 1 - p.y }),
    d1: (p) => ({ x: p.y, y: p.x }),
    d2: (p) => ({ x: 1 - p.y, y: 1 - p.x })
  };
  // 접혀 넘어가는 쪽을 잘라내 그 무게중심을 잡는다. 화살표는 거기서 거울점으로 향한다.
  const clip = (polygon, keep) => {
    const out = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (da >= -1e-9) out.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    return out;
  };
  const foldLine = (polygon, fold) => {
    const keep = KEEP[fold];
    const points = [];
    for (let i = 0; i < polygon.length; i += 1) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];
      const da = keep(a);
      const db = keep(b);
      if (Math.abs(da) < 1e-9) points.push(a);
      if ((da > 1e-9 && db < -1e-9) || (da < -1e-9 && db > 1e-9)) {
        const t = da / (da - db);
        points.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
      }
    }
    if (points.length < 2) return null;
    let best = null;
    let far = -1;
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (d > far) { far = d; best = [points[i], points[j]]; }
      }
    }
    return far > 1e-6 ? best : null;
  };

  const width = visual.stages.length * SIZE + (visual.stages.length - 1) * GAP + 8;
  let offset = 4;
  const parts = visual.stages.map((stage, index) => {
    const shift = offset;
    offset += SIZE + GAP;
    const points = stage.polygon.map((p) => `${(shift + p.x * SIZE).toFixed(1)},${(4 + p.y * SIZE).toFixed(1)}`).join(" ");
    let piece = `<polygon points="${points}" fill="#f9c8c4" stroke="#e8968f" stroke-width="2"/>`;
    if (stage.fold) {
      const segment = foldLine(stage.polygon, stage.fold);
      if (segment) {
        piece += `<line x1="${(shift + segment[0].x * SIZE).toFixed(1)}" y1="${(4 + segment[0].y * SIZE).toFixed(1)}" x2="${(shift + segment[1].x * SIZE).toFixed(1)}" y2="${(4 + segment[1].y * SIZE).toFixed(1)}" stroke="#d4756c" stroke-width="1.6" stroke-dasharray="6 5"/>`;
      }
      // 접는 방향 화살표 — 어느 쪽이 어디로 넘어가는지 보여준다. 이게 없으면 접는 선만 보인다.
      const away = clip(stage.polygon, (p) => -KEEP[stage.fold](p));
      if (away.length >= 3) {
        const from = { x: away.reduce((t, p) => t + p.x, 0) / away.length, y: away.reduce((t, p) => t + p.y, 0) / away.length };
        const to = MIRROR[stage.fold](from);
        const sx = shift + from.x * SIZE;
        const sy = 4 + from.y * SIZE;
        const ex = shift + to.x * SIZE;
        const ey = 4 + to.y * SIZE;
        const nx = -(ey - sy);
        const ny = ex - sx;
        const length = Math.hypot(nx, ny) || 1;
        const bulge = Math.min(20, SIZE * 0.22);
        const cx = (sx + ex) / 2 + (nx / length) * bulge;
        const cy = (sy + ey) / 2 + (ny / length) * bulge;
        const angle = Math.atan2(ey - cy, ex - cx);
        const head = [
          `${(ex + 3 * Math.cos(angle)).toFixed(1)},${(ey + 3 * Math.sin(angle)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle - 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle - 0.5)).toFixed(1)}`,
          `${(ex - 9 * Math.cos(angle + 0.5)).toFixed(1)},${(ey - 9 * Math.sin(angle + 0.5)).toFixed(1)}`
        ].join(" ");
        piece += `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" fill="none" stroke="#c0392b" stroke-width="3.2" stroke-linecap="round"/><polygon points="${head}" fill="#c0392b"/>`;
      }
    } else {
      piece += visual.holes.map((hole) => `<circle cx="${(shift + hole.x * SIZE).toFixed(1)}" cy="${(4 + hole.y * SIZE).toFixed(1)}" r="6" fill="#fff" stroke="#c0392b" stroke-width="1.8"/>`).join("");
    }
    if (index < visual.stages.length - 1) {
      const ax = shift + SIZE + 8;
      const ay = 4 + SIZE / 2;
      piece += `<path d="M${ax} ${ay} H${ax + 16}" stroke="#95a5a6" stroke-width="2.5"/><path d="M${ax + 18} ${ay} l-7 -5 v10 z" fill="#95a5a6"/>`;
    }
    return piece;
  }).join("");

  return `<svg class="paper-fold-svg" viewBox="0 0 ${width} ${SIZE + 8}" role="img" aria-label="색종이 접기 문제">${parts}</svg>`;
}


// ── main 갈래에서 이식한 파이널 2·3회 시각자료 (2026-08-18) ──────────────

function magicSquareMarkup(visual) {
  const cards = visual.cards.map((value) => `<span>${value}</span>`).join("");
  const grid = visual.shown.flat()
    .map((value) => (value === null ? `<span class="ms-blank"></span>` : `<span>${value}</span>`)).join("");
  return `<div class="magic-square-work"><div class="number-balls">${cards}</div><div class="magic-square-grid">${grid}</div></div>`;
}

function sumGridMarkup(visual) {
  const columns = visual.cells[0].length;
  const cell = (item) => {
    if (item === null) return `<span class="sg-void"></span>`;
    if (item.t === "num") return `<span>${item.v}</span>`;
    if (item.t === "shape") return `<span class="sg-shape">${item.s}</span>`;
    return `<span class="sg-blank"></span>`;
  };
  const sum = (value) => (value === null || value === undefined
    ? `<b class="sg-void"></b>`
    : `<b>${value}</b>`);
  const rows = visual.cells.map((row, index) => (
    row.map(cell).join("") + sum(visual.rowSums[index])
  )).join("");
  const footer = visual.colSums.map(sum).join("") + `<b class="sg-void"></b>`;
  const cards = visual.cards
    ? `<div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div>`
    : "";
  return `<div class="sum-grid-work">${cards}<div class="sum-grid" style="--sg-cols:${columns + 1}">${rows}${footer}</div></div>`;
}

// 파이널 2회 16번 전용. 합을 표 바깥에 숫자로 적는 sum-grid와 달리, 원본은 합을 삼각형
// 안에 적고 삼각형이 자기가 가리키는 쪽 칸들을 뜻한다 — 위 삼각형은 그 아래 세로줄,
// 오른쪽 삼각형은 그 왼쪽 가로줄. 왼쪽 위처럼 칸이 비는 자리가 있으면 세로줄 삼각형은
// 그 줄에서 실제로 가장 위에 있는 칸 위에 앉는다(원본 그림이 그렇다).
function triangleSumGridMarkup(visual) {
  const S = 46;          // 칸 한 변
  const TH = 28;         // 위 삼각형 높이
  const TW = 30;         // 오른쪽 삼각형 너비
  const rowCount = visual.cells.length;
  const colCount = visual.cells[0].length;
  const X0 = 2;
  const Y0 = TH + 2;
  const width = X0 + colCount * S + TW + 4;
  const height = Y0 + rowCount * S + 4;
  const has = (r, c) => visual.cells[r] && visual.cells[r][c] !== null && visual.cells[r][c] !== undefined;

  let parts = "";
  for (let r = 0; r < rowCount; r += 1) {
    for (let c = 0; c < colCount; c += 1) {
      if (!has(r, c)) continue;
      const item = visual.cells[r][c];
      const x = X0 + c * S;
      const y = Y0 + r * S;
      parts += `<rect x="${x}" y="${y}" width="${S}" height="${S}" class="tsg-cell"/>`;
      if (item && item.t === "num") parts += `<text x="${x + S / 2}" y="${y + S / 2}" class="tsg-num">${item.v}</text>`;
    }
  }
  visual.colSums.forEach((value, c) => {
    if (value === null || value === undefined) return;
    let top = -1;
    for (let r = 0; r < rowCount; r += 1) if (has(r, c)) { top = r; break; }
    if (top < 0) return;
    const x = X0 + c * S;
    const y = Y0 + top * S;
    parts += `<polygon points="${x},${y} ${x + S},${y} ${x + S / 2},${y - TH}" class="tsg-tri"/>` +
      `<text x="${x + S / 2}" y="${y - TH * 0.32}" class="tsg-sum">${value}</text>`;
  });
  visual.rowSums.forEach((value, r) => {
    if (value === null || value === undefined) return;
    let last = -1;
    for (let c = 0; c < colCount; c += 1) if (has(r, c)) last = c;
    if (last < 0) return;
    const x = X0 + (last + 1) * S;
    const y = Y0 + r * S;
    parts += `<polygon points="${x},${y} ${x},${y + S} ${x + TW},${y + S / 2}" class="tsg-tri"/>` +
      `<text x="${x + TW * 0.34}" y="${y + S / 2}" class="tsg-sum">${value}</text>`;
  });

  return `<div class="triangle-sum-grid"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="삼각형 합 채우기">${parts}</svg></div>`;
}

function checkerSquareGrowthMarkup(visual) {
  const stage = (side) => {
    const cells = [];
    for (let r = 0; r < side; r += 1) {
      for (let c = 0; c < side; c += 1) cells.push(`<b class="${(r + c) % 2 === 0 ? "white" : "black"}"></b>`);
    }
    return `<div><i style="--side:${side}">${cells.join("")}</i><span>${side - 2}번째</span></div>`;
  };
  return `<div class="checker-growth">${visual.shown.map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function stoneTriangleRowsMarkup(visual) {
  const rows = Array.from({ length: visual.shown }, (_, index) => {
    const count = index + 1;
    const color = count % 2 === 1 ? "black" : "white";
    return `<div>${Array.from({ length: count }, () => `<b class="${color}"></b>`).join("")}<span>${count}번째 줄</span></div>`;
  });
  return `<div class="stone-triangle-rows">${rows.join("")}<strong>⋮</strong></div>`;
}

function statementListMarkup(visual) {
  return `<ul class="statement-list">${visual.items.map((text) => `<li>${text}</li>`).join("")}</ul>`;
}

function cellShapeMarkup(visual) {
  const unit = 30;
  const minR = Math.min(...visual.cells.map((cell) => cell[0]));
  const minC = Math.min(...visual.cells.map((cell) => cell[1]));
  const maxR = Math.max(...visual.cells.map((cell) => cell[0]));
  const maxC = Math.max(...visual.cells.map((cell) => cell[1]));
  const width = unit * (maxC - minC + 1) + 2;
  const height = unit * (maxR - minR + 1) + 2;
  const squares = visual.cells.map(([r, c]) => `<rect x="${1 + unit * (c - minC)}" y="${1 + unit * (r - minR)}" width="${unit}" height="${unit}" />`).join("");
  return `<svg class="cell-shape-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="칸을 붙여 만든 도형">${squares}</svg>`;
}

function triangleEdgeSumMarkup(visual) {
  // 꼭짓점 3 + 변 가운데 3. 자리 번호는 생성기와 같다(0·1·2 꼭짓점, 3·4·5 변 가운데).
  const W = 300, H = 260, r = 21;
  const P = [
    { x: W / 2, y: 26 },          // 0 위 꼭짓점
    { x: 34, y: H - 26 },         // 1 왼쪽 아래
    { x: W - 34, y: H - 26 },     // 2 오른쪽 아래
  ];
  P[3] = { x: (P[0].x + P[1].x) / 2, y: (P[0].y + P[1].y) / 2 };
  P[4] = { x: (P[1].x + P[2].x) / 2, y: (P[1].y + P[2].y) / 2 };
  P[5] = { x: (P[2].x + P[0].x) / 2, y: (P[2].y + P[0].y) / 2 };
  const givenMap = new Map((visual.given || []).map((g) => [g.slot, g.value]));
  const edges = [[0, 1], [1, 2], [2, 0]].map(([a, b]) =>
    `<line x1="${P[a].x}" y1="${P[a].y}" x2="${P[b].x}" y2="${P[b].y}" />`).join("");
  const slots = P.map((p, i) => {
    const v = givenMap.get(i);
    return `<circle cx="${p.x}" cy="${p.y}" r="${r}" class="${v == null ? "tes-blank" : "tes-given"}" />` +
      (v == null ? "" : `<text x="${p.x}" y="${p.y + 6}" text-anchor="middle">${v}</text>`);
  }).join("");
  const cards = `<div class="tes-cards">${visual.numbers.map((n) => `<span>${n}</span>`).join("")}</div>`;
  return `<div class="triangle-edge-sum">${cards}<svg class="tes-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="삼각형 여섯 자리에 수 놓기">${edges}${slots}</svg></div>`;
}


// ── main 갈래에서 이식: 파이널 2·3회 시각자료 (2026-08-18) ──────────────

function symbolChainMarkup(visual) {
  const symbols = { circle: "○", heart: "♥", club: "♣", diamond: "◆", star: "★", triangle: "▲" };
  const token = (value) => symbols[value]
    ? `<span class="chain-symbol ${value}">${symbols[value]}</span>`
    : `<span class="chain-token">${value}</span>`;
  const givens = Object.entries(visual.given).map(([key, value]) => `${token(key)}<b>=</b><strong>${value}</strong>`).join("");
  return `<div class="symbol-chain"><div class="symbol-chain-given">${givens}</div><div class="symbol-chain-board">${visual.rows.map((row) => `<p>${row.map(token).join("")}</p>`).join("")}</div></div>`;
}

function matrixShapeSvg(shape, cx, cy, size, fill = "none", stroke = "#596a73", width = 2) {
  if (shape === "circle") return `<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  if (shape === "square") return `<rect x="${cx - size / 2}" y="${cy - size / 2}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const top = cy - size * 0.58;
  const bottom = cy + size * 0.46;
  return `<polygon points="${cx},${top} ${cx - size * 0.58},${bottom} ${cx + size * 0.58},${bottom}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function shapeMatrixThreeMarkup(visual) {
  const cellSize = 76;
  const figures = visual.cells.map((cell) => {
    const cx = cell.column * cellSize + cellSize / 2;
    const cy = cell.row * cellSize + cellSize / 2;
    if (cell.missing && !cell.hintOuter) return "";
    if (cell.missing) return `${matrixShapeSvg(cell.outer, cx, cy, 47, "none", "#b6c3c9", 2)}<text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="19" font-weight="800" fill="#8da0aa">?</text>`;
    const fill = cell.fill === "gray" ? "#b8bdc1" : cell.fill === "hatch" ? "url(#matrix-hatch)" : "#fff";
    return `${matrixShapeSvg(cell.outer, cx, cy, 48, "#fff")}${matrixShapeSvg(cell.inner, cx, cy, 30, fill)}`;
  }).join("");
  const lines = Array.from({ length: 4 }, (_, index) => `<line x1="${index * cellSize}" y1="0" x2="${index * cellSize}" y2="${cellSize * 3}"/><line x1="0" y1="${index * cellSize}" x2="${cellSize * 3}" y2="${index * cellSize}"/>`).join("");
  return `<svg class="shape-matrix-three" viewBox="0 0 ${cellSize * 3} ${cellSize * 3}" role="img" aria-label="도형 규칙 3 곱하기 3 표"><defs><pattern id="matrix-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#71818a" stroke-width="2"/></pattern></defs><g class="matrix-grid">${lines}</g>${figures}</svg>`;
}

function triangleCycleSvg(position = null) {
  const points = {
    top: "50,5 27.5,45 72.5,45",
    "bottom-left": "5,85 27.5,45 50,85",
    "bottom-right": "95,85 72.5,45 50,85",
    center: "27.5,45 72.5,45 50,85"
  };
  const fill = position ? `<polygon points="${points[position]}" fill="#8dd7ef"/>` : "";
  return `<svg viewBox="0 0 100 90" role="img" aria-label="${position ? "한 칸이 칠해진" : "빈"} 삼각형">${fill}<path d="M50 5L5 85H95Z M27.5 45H72.5 M27.5 45L50 85 M72.5 45L50 85" fill="none" stroke="#65b6ce" stroke-width="2"/></svg>`;
}

function trianglePositionCycleMarkup(visual) {
  const shown = visual.sequence.map((position, index) => `<figure>${triangleCycleSvg(position)}<figcaption>${index + 1}번째</figcaption></figure>`).join("");
  return `<div class="triangle-cycle">${shown}<b aria-hidden="true">…</b><figure class="target">${triangleCycleSvg()}<figcaption>${visual.target}번째</figcaption></figure></div>`;
}

function overlapBondsMarkup(visual) {
  const count = visual.shownParts.length;
  const width = count * 78;
  const partX = (index) => 39 + index * 78;
  const bonds = visual.totals.map((total, index) => {
    const x = (partX(index) + partX(index + 1)) / 2;
    return `<path d="M${x} 34V52 M${x} 62L${partX(index)} 88 M${x} 62L${partX(index + 1)} 88"/><rect class="total" x="${x - 16}" y="4" width="32" height="30"/><text x="${x}" y="24">${total}</text><rect class="junction" x="${x - 12}" y="50" width="24" height="24"/>`;
  }).join("");
  const parts = visual.shownParts.map((value, index) => {
    const label = value === "star" ? "☆" : value === "blank" ? "?" : value;
    const shared = visual.highlightShared && index === 1 ? " shared" : "";
    return `<rect class="part${shared}" x="${partX(index) - 16}" y="87" width="32" height="30"/><text x="${partX(index)}" y="108">${label}</text>`;
  }).join("");
  return `<svg class="overlap-bonds" viewBox="0 0 ${width} 124" role="img" aria-label="서로 이어진 가르기 모으기">${bonds}${parts}</svg>`;
}

function geometryWorksheetMarkup(visual) {
  const renderer = globalThis.GW_RENDER;
  const figures = visual.figures;
  if (!renderer || !figures) return "";
  if (figures.kind === "sequence") {
    return `<div class="geometry-sequence">${figures.shapes.map((shape) => `
      <figure><div>${renderer.renderIso(shape.map, shape.width, shape.depth)}</div><figcaption>${shape.n}단계</figcaption></figure>
    `).join("")}<strong aria-hidden="true">…</strong></div>`;
  }
  if (figures.kind === "iso-box") {
    return `<figure class="geometry-box"><div>${renderer.renderIsoBox(figures.map, figures.width, figures.depth, figures.boxH)}</div><figcaption>점선은 상자 테두리입니다.</figcaption></figure>`;
  }
  if (figures.kind === "iso-walled") {
    return `<figure class="geometry-hidden"><div>${renderer.renderIsoWalled(figures.map, figures.width, figures.depth)}</div><figcaption>뒤와 왼쪽의 회색 면은 벽입니다.</figcaption></figure>`;
  }
  return "";
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind.startsWith("g1-")) return `<div class="visual g1-source-visual">${g1SourceMarkup(visual)}</div>`;
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
  if (visual.kind === "five-cell-placement") return `<div class="visual five-cell-placement-visual">${fiveCellPlacementMarkup(visual)}</div>`;
  if (visual.kind === "equalize-bags") return `<div class="visual equalize-visual">${equalizeBagsMarkup(visual)}</div>`;
  if (visual.kind === "total-difference-share") return `<div class="visual total-difference-visual">${totalDifferenceShareMarkup(visual)}</div>`;
  if (visual.kind === "number-pyramid") return `<div class="visual pyramid-visual">${numberPyramidMarkup(visual)}</div>`;
  if (visual.kind === "five-card-pyramid") return `<div class="visual five-card-pyramid-visual">${fiveCardPyramidMarkup(visual)}</div>`;
  if (visual.kind === "stair-grid-placement") return `<div class="visual stair-grid-placement-visual">${stairGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "vertical-stair-grid-placement") return `<div class="visual stair-grid-placement-visual">${verticalStairGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "l-grid-placement") return `<div class="visual l-grid-placement-visual">${lGridPlacementMarkup(visual)}</div>`;
  if (visual.kind === "race-order") return `<div class="visual race-order-visual">${raceOrderMarkup(visual, visual.conditions || [])}</div>`;
  if (visual.kind === "line-position-seven") return `<div class="visual line-position-visual">${linePositionSevenMarkup(visual)}</div>`;
  if (visual.kind === "total-difference-candy") return `<div class="visual total-difference-candy-visual">${totalDifferenceCandyMarkup(visual)}</div>`;
  if (visual.kind === "addition-table-grid") return `<div class="visual addition-table-visual">${additionTableGridMarkup(visual)}</div>`;
  if (visual.kind === "disc-number-rule") return `<div class="visual disc-rule-visual">${discNumberRuleMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-table") return `<div class="visual shape-sum-visual">${shapeSumTableMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-row-target") return `<div class="visual shape-sum-visual">${shapeSumRowTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-bottom-target") return `<div class="visual shape-sum-visual">${shapeSumBottomTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-column-target") return `<div class="visual shape-sum-visual">${shapeSumColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-repeated-column-target") return `<div class="visual shape-sum-visual">${shapeSumRepeatedColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-sequence") return `<div class="visual repeat-sequence-visual">${repeatShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-color-dual") return `<div class="visual repeat-sequence-visual">${repeatShapeColorDualMarkup(visual)}</div>`;
  if (visual.kind === "three-shape-cycle") return `<div class="visual three-shape-cycle-visual">${threeShapeCycleMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-grid") return `<div class="visual arrow-grid-visual">${arrowNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-horizontal-tens") return `<div class="visual arrow-grid-visual">${arrowNumberHorizontalTensMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-path-seven") return `<div class="visual arrow-path-seven-visual">${arrowNumberPathSevenMarkup(visual)}</div>`;
  if (visual.kind === "bus-stops") return `<div class="visual bus-stops-visual">${busStopsMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-cut-sum") return `<div class="visual fold-number-cut-visual">${foldNumberCutSumMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-eight-cards") return `<div class="visual equal-line-eight-visual">${equalLineSumEightCardsMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-cross") return `<div class="visual equal-line-cross-visual">${equalLineCrossMarkup(visual)}</div>`;
  if (visual.kind === "number-conditions") return `<div class="visual number-conditions-visual">${numberConditionsMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-parity-gap") return `<div class="visual number-conditions-visual">${twoDigitParityGapMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-odd-gap") return `<div class="visual number-conditions-visual">${twoDigitOddGapMarkup(visual)}</div>`;
  if (visual.kind === "two-digit-odd-bounded-gap") return `<div class="visual number-conditions-visual">${twoDigitOddBoundedGapMarkup(visual)}</div>`;
  if (visual.kind === "triangle-tile-growth") return `<div class="visual triangle-tile-growth-visual">${triangleTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "square-tile-growth") return `<div class="visual square-tile-growth-visual">${squareTileGrowthMarkup(visual)}</div>`;
  if (visual.kind === "growing-dot-square") return `<div class="visual growing-dot-square-visual">${growingDotSquareMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-triangle-top") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTriangleTopMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-top-target") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTopTargetMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-grid-triangle-column-target") return `<div class="visual symbol-sum-grid-visual">${shapeSumGridTriangleColumnTargetMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid-square-top") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridSquareTopMarkup(visual)}</div>`;
  if (visual.kind === "shape-equation-add-subtract") return `<div class="visual shape-equation-add-subtract-visual">${shapeEquationAddSubtractMarkup(visual)}</div>`;
  if (visual.kind === "source-piano") return `<div class="visual source-piano-visual">${sourcePianoMarkup()}</div>`;
  if (visual.kind === "balance-relations") return `<div class="visual balance-relations-visual">${balanceRelationsMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-three-objects") return `<div class="visual balance-relations-visual">${balanceScaleThreeObjectsMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-circle-target") return `<div class="visual balance-relations-visual">${balanceScaleCircleTargetMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-star-target") return `<div class="visual balance-relations-visual">${balanceScaleStarTargetMarkup(visual)}</div>`;
  if (visual.kind === "balance-scale-four-objects") return `<div class="visual balance-relations-visual">${balanceScaleFourObjectsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relations") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relation-two-to-three") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relation-three-to-four") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
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
  // 옛 요약 그림("한 번 접기 → 구멍 → 펼치기")은 접는 방향을 안 보여줬다.
  // 이제 생성기가 단계 폴리곤(stages)을 주므로 실제 접는 과정을 화살표와 함께 그린다.
  if (visual.kind === "triangle-edge-sum") return `<div class="visual triangle-edge-sum-visual">${triangleEdgeSumMarkup(visual)}</div>`;
  if (visual.kind === "symbol-chain") return `<div class="visual symbol-chain-visual">${symbolChainMarkup(visual)}</div>`;
  if (visual.kind === "shape-matrix-three") return `<div class="visual shape-matrix-three-visual">${shapeMatrixThreeMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-cycle") return `<div class="visual triangle-position-cycle-visual">${trianglePositionCycleMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-answer") return `<div class="visual triangle-position-answer-visual">${triangleCycleSvg(visual.position)}</div>`;
  if (visual.kind === "overlap-bonds") return `<div class="visual overlap-bonds-visual">${overlapBondsMarkup(visual)}</div>`;
  if (visual.kind === "geometry-worksheet") return `<div class="visual geometry-worksheet-visual">${geometryWorksheetMarkup(visual)}</div>`;
  if (visual.kind === "triangle-sum-grid") return `<div class="visual triangle-sum-grid-visual">${triangleSumGridMarkup(visual)}</div>`;
  if (visual.kind === "sum-grid") return `<div class="visual sum-grid-visual">${sumGridMarkup(visual)}</div>`;
  if (visual.kind === "magic-square") return `<div class="visual magic-square-visual">${magicSquareMarkup(visual)}</div>`;
  if (visual.kind === "statement-list") return `<div class="visual statement-visual">${statementListMarkup(visual)}</div>`;
  if (visual.kind === "stone-triangle-rows") return `<div class="visual stone-triangle-visual">${stoneTriangleRowsMarkup(visual)}</div>`;
  if (visual.kind === "cell-shape") return `<div class="visual cell-shape-visual">${cellShapeMarkup(visual)}</div>`;
  if (visual.kind === "checker-square-growth") return `<div class="visual checker-growth-visual">${checkerSquareGrowthMarkup(visual)}</div>`;
  if (visual.kind === "paper-fold") return `<div class="visual paper-fold-visual">${paperFoldMarkup(visual)}</div>`;
  if (visual.kind === "cryptarithm-vertical") return `<div class="visual cryptarithm-vertical-visual">${cryptarithmVerticalMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-grid") return `<div class="visual fold-number-visual">${foldNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "fold-diagonal-grid") return `<div class="visual fold-diagonal-visual">${foldDiagonalGridMarkup(visual)}</div>`;
  if (visual.kind === "fold-number-inverse") return `<div class="visual fold-inverse-visual">${foldNumberInverseMarkup(visual)}</div>`;
  if (visual.kind === "fold-cut-pieces") return `<div class="visual fold-pieces-visual">${foldCutPiecesMarkup(visual)}</div>`;
  if (visual.kind === "fold-punch") return `<div class="visual fold-punch-visual">${foldPunchMarkup(visual)}</div>`;
  if (visual.kind === "fold-stack") return `<div class="visual fold-stack-visual">${foldStackMarkup(visual)}</div>`;
  if (visual.kind === "fold-unfold-choice") return `<div class="visual fold-unfold-visual">${foldUnfoldChoiceMarkup(visual)}</div>`;
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
    // 답이 그림인 문항은 답안지에도 그림이 있어야 한다. 예전에는 글자 블록만 그렸고
    // 나머지 answerVisual은 조용히 버려져서, 도형 행렬·삼각형 위치 문항의 답안이
    // 말로만 적혀 나왔다. 그림을 그리되 글로 쓴 답도 함께 남긴다 — 채점자가 그림만
    // 보고 판단하지 않아도 되게.
    const answerPicture = !question.answerVisual
      ? ""
      : question.answerVisual.kind === "letter-block-answer"
        ? `<div class="letter-answer-preview">${letterBlockTileMarkup(question.answerVisual.word, true)}</div>`
        : visualMarkup(question.answerVisual);
    const answer = answerPicture ? `${answerPicture}<div class="answer-text">${question.answer}</div>` : question.answer;
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

// ?exam=<시험지 id> 로 들어오면 그 시험지에서 열려 있는 문항을 모두 골라 둔다.
// 프로그램 페이지의 모의고사 카드에서 바로 넘어올 때 쓴다. 잠긴 문항은 건드리지 않으므로
// 검증 게이트는 그대로다.
(function preselectExam() {
  const wanted = params.get("exam");
  if (!wanted) return;
  const exam = [...EXAMS, ...PRACTICE_EXAM_TYPES, ...FINAL_EXAM_TYPES].find((item) => item.id === wanted);
  if (!exam) return;
  if (exam.stage && stageIds.has(exam.stage)) state.stage = exam.stage;
  else if (FINAL_EXAM_TYPES.includes(exam)) state.stage = "final";
  else if (PRACTICE_EXAM_TYPES.includes(exam)) state.stage = "practice";
  renderStageButtons();
  renderExamList();
  let picked = 0;
  exam.questions.forEach((sourceQuestion) => {
    if (!sourceQuestion.verified || !isSelectableType(typeById(sourceQuestion.typeId))) return;
    state.selected.exam.add(examKey(exam.id, sourceQuestion.number));
    picked += 1;
  });
  if (!picked) return;
  state.count = picked;
  renderExamList();
  initControls();
  updateSummary();
})();
