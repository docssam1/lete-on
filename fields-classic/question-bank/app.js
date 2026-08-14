import { AGE_STAGES, DOMAINS, TYPES, EXAMS, PRACTICE_EXAM_TYPES, FINAL_EXAM_TYPES, CURRICULUM, typeById } from "./source-data.js?v=20260814d";
import { GENERATORS } from "./generators.js?v=20260814d";

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
  // 교재 페이지에서 확인한 것(textbookSource). 교재 단원 유사문제는 교재가 원본이므로
  // 시험 문항 검증을 요구하면 영영 열리지 않는다. 어느 쪽이든 "무엇과 대조했는지"가
  // 분명해야 하고, 이름만 같은 유형에 생성기를 얹는 것은 여전히 금지다(isReady가 막는다).
  //
  // 시험지 탭은 이 함수와 별개로 문항별 verified 플래그를 함께 요구하므로,
  // 교재 대조만으로는 미검증 시험 문항이 열리지 않는다. 그 게이트는 절대 완화하지 않는다.
  return isReady(item) && (hasVerifiedSource(item.id) || Boolean(item.textbookSource));
}

function typeStatus(item) {
  // 화면에도 무엇과 대조했는지가 드러나야 한다. 시험지 검증 없이 교재만 대조한 유형을
  // 그냥 "무한 생성"으로 적으면 시험지에서도 확인된 것처럼 읽힌다.
  if (isReady(item) && !hasVerifiedSource(item.id) && item.textbookSource) return "교재 대조 · 무한 생성";
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
    // 파일명에 붙은 괄호 안 시행일(230206 등)은 화면에 내보내지 않는다. 파일을 찾는 데만 쓰는 값이다.
    const fileName = String(exam.file || "").replace(/\((\d{6}|\d{8})\)/g, "");
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
        <span><strong>${item.label}</strong><span>${item.textbookSource && !hasVerifiedSource(item.id) ? item.textbookSource : "실제 출제 유형"}${item.geometryGame ? ` · Cube Town ${item.geometryGame}` : ""}</span></span>
        <em class="type-status ${isSelectableType(item) ? "" : "fixed"}">${hasVerifiedSource(item.id) || item.textbookSource ? typeStatus(item) : "원본 대조 중"}</em>
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
    // 조건이 까다로운 생성기(답이 유일해야 하는 배치·추리)는 뽑기에 실패하면 null을 준다.
    // 실패는 정상이므로 다시 뽑는다. 여기서 받아 주지 않으면 빈 문항 카드가 나간다.
    for (let attempt = 0; attempt < 400; attempt += 1) {
      const made = GENERATORS[item.generator]({ max: 30, difficulty });
      if (made) return { ...made, type: item, reference };
    }
  }
  return null;
}

function buildQuestions() {
  let references = selectedReferences().filter((item) => isSelectableType(typeById(item.typeId)));
  if (!references.length) return;
  if (state.order === "domain") references.sort((a, b) => domainIndex[typeById(a.typeId).domain] - domainIndex[typeById(b.typeId).domain]);
  if (state.order === "mixed") references = shuffle(references);
  const counters = new Map();
  state.questions = Array.from({ length: state.count }, (_, index) => {
    const reference = references[index % references.length];
    const item = typeById(reference.typeId);
    const sequence = counters.get(item.id) || 0;
    counters.set(item.id, sequence + 1);
    return generatedProblem(item, sequence, reference.reference);
  }).filter(Boolean);
  renderWorksheet();
  $("builderPanel").hidden = true;
  $("worksheetSection").hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function shapeSymbol(shape) {
  return shape === "동그라미" ? "●" : shape === "세모" ? "▲" : "■";
}

function tornCalendarMarkup(visual) {
  const head = ["일", "월", "화", "수", "목", "금", "토"]
    .map((name) => `<b>${name}</b>`).join("");
  const cells = visual.cells
    .map((day) => (day === null ? `<span class="cal-empty"></span>` : `<span>${day}</span>`)).join("");
  return `<div class="torn-calendar"><strong>${visual.month}월</strong><div class="cal-grid">${head}${cells}</div><div class="cal-torn">찢어진 부분</div></div>`;
}

function magicSquareMarkup(visual) {
  const cards = visual.cards.map((value) => `<span>${value}</span>`).join("");
  const grid = visual.shown.flat()
    .map((value) => (value === null ? `<span class="ms-blank"></span>` : `<span>${value}</span>`)).join("");
  return `<div class="magic-square-work"><div class="number-balls">${cards}</div><div class="magic-square-grid">${grid}</div></div>`;
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

function numberCardMarkup(visual) {
  return `<div class="number-balls">${visual.values.map((value) => `<span>${value}</span>`).join("")}</div><div class="equation-row equation-row-three"><span class="equation-blank"></span><b>+</b><span class="equation-blank"></span><b>-</b><span class="equation-blank"></span><b>=</b><strong>${visual.target}</strong></div>`;
}

function hiddenCardConditionsMarkup(visual) {
  return `<div class="hidden-card-clues">${visual.clues.map((clue, index) => `<div class="hidden-card-row"><span>(${index + 1})</span><div>${clue.values.map((value) => `<i>${value}</i>`).join("")}</div><strong class="${clue.hasCard ? "has" : "not"}">→ ${clue.hasCard ? "있습니다." : "없습니다."}</strong></div>`).join("")}</div>`;
}

function closestCardSumMarkup(visual) {
  const blank = () => '<span class="digit-card-blank"></span>';
  return `<div class="closest-card-work"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="closest-card-equation"><span class="two-digit-blank">${blank()}${blank()}</span><b>+</b><span class="two-digit-blank">${blank()}${blank()}</span><b>=</b><span class="sum-blank"></span></div><small>${visual.target}에 가장 가까운 합</small></div>`;
}

function edgeSumCycleMarkup(visual) {
  const cycle = (values, edges, showValues) => {
    const [top, right, bottom, left] = edges;
    const positions = [[95,68],[235,68],[235,184],[95,184]];
    return `<div class="edge-cycle"><div class="edge-number-strip">${values.map((value) => `<span>${value}</span>`).join("")}</div><svg viewBox="0 0 330 220" role="img" aria-label="네 원 안에 수를 넣고 각 변의 합을 맞추는 문제"><line x1="95" y1="62" x2="235" y2="62"/><line x1="235" y1="62" x2="235" y2="178"/><line x1="235" y1="178" x2="95" y2="178"/><line x1="95" y1="178" x2="95" y2="62"/><circle cx="95" cy="62" r="25"/><circle cx="235" cy="62" r="25"/><circle cx="235" cy="178" r="25"/><circle cx="95" cy="178" r="25"/>${showValues ? values.map((value, index) => `<text class="edge-inside" x="${positions[index][0]}" y="${positions[index][1]}">${value}</text>`).join("") : ""}<text x="165" y="53">합 ${top}</text><text x="257" y="122">합 ${right}</text><text x="165" y="205">합 ${bottom}</text><text x="39" y="122">합 ${left}</text></svg></div>`;
  };
  return `<div class="edge-cycle-work"><div class="edge-cycle-example"><b>[보기]</b>${cycle([2,4,8,6], [6,12,14,8], true)}</div><div>${cycle(visual.values, visual.edges, false)}</div></div>`;
}

function equalizeBagsMarkup(visual) {
  const bag = (name, count) => `<div class="candy-bag"><strong>${name}</strong><div class="bag-shape" aria-label="사탕 ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</div></div>`;
  return `<div class="equalize-bags">${bag(visual.names[0], visual.higher)}<span class="transfer-arrow">몇 개를<br>줄까요?</span>${bag(visual.names[1], visual.lower)}</div>`;
}

function numberPyramidMarkup(visual) {
  return `<div class="pyramid-wrap"><div class="number-balls">${visual.cards.map((value) => `<span>${value}</span>`).join("")}</div><div class="pyramid-tree"><div class="pyramid-row top"><span></span><span>㉠</span><span></span></div><div class="pyramid-row middle"><span></span><span></span></div><strong>${visual.target}</strong></div></div>`;
}

function raceOrderMarkup(visual, conditions) {
  return `<div class="race-order"><div class="race-track" style="--race-count:${visual.total}">${Array.from({ length: visual.total }, (_, index) => `<span><i></i><b>${index + 1}등</b></span>`).join("")}</div><ul>${conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul></div>`;
}

function discNumberRuleMarkup(visual) {
  const disc = (item, offset) => `<g transform="translate(${offset},76)"><circle class="disc-outer" r="52"/><path class="disc-line" d="M0-52V52M-52 0H52"/><circle class="disc-inner" r="24"/><text x="-27" y="-22">${item.northWest}</text><text x="27" y="-22">${item.northEast}</text><text x="-27" y="33">${item.southWest}</text><text x="27" y="33">${item.southEast}</text><text class="disc-center" y="7">${item.center}</text></g>`;
  return `<svg class="disc-rule-svg" viewBox="0 0 390 152" role="img" aria-label="원판 수 규칙 문제">${visual.discs.map((item, index) => disc(item, 70 + index * 125)).join("")}</svg>`;
}

function shapeSumTableMarkup(visual) {
  return `<div class="shape-sum-work"><div class="shape-sum-example"><b>[보기]</b><div><span>5</span><span>4</span><i>9</i><span>3</span><span>7</span><i>10</i><i>8</i><i>11</i></div></div><div class="shape-sum-target"><div class="shape-sum-grid"><span>◇</span><span>◇</span><b>${visual.rowOne}</b><span>□</span><span>○</span><b>㉠</b><b>${visual.columnOne}</b><b>${visual.columnTwo}</b></div></div></div>`;
}

function repeatShapeSequenceMarkup(visual) {
  const symbol = (item) => item === "세모" ? "△" : "○";
  return `<div class="repeat-sequence">${visual.items.map((item, index) => `<span>${symbol(item)}<small>${index + 1}</small></span>`).join("")}<b>…</b><strong>${visual.target}번째<br>모양 (　)</strong></div>`;
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

function busStopsMarkup(visual) {
  return `<div class="bus-stops"><ul><li>첫 번째 정류장에서 <strong>${visual.left}명</strong>이 내렸습니다.</li><li>두 번째 정류장에서 <strong>${visual.boarded}명</strong>이 탔습니다.</li></ul></div>`;
}

function equalLineCrossMarkup(visual) {
  return `<div class="equal-line-cross"><div class="cross-cards">${[1,2,3,4,5].map((value) => `<span>${value}</span>`).join("")}</div><div class="cross-grid"><span></span><b>${visual.top}</b><span></span><b>${visual.left}</b><b>㉠</b><i></i><span></span><i></i><span></span></div></div>`;
}

function numberConditionsMarkup(visual) {
  return `<div class="number-conditions"><p>십의 자리 숫자와 일의 자리 숫자의 합은 <strong>${visual.sum}</strong>입니다.</p><p>십의 자리 숫자가 일의 자리 숫자보다 <strong>${visual.gap}</strong> 큽니다.</p></div>`;
}

function growingDotSquareMarkup(visual) {
  const stage = (size) => `<div><i style="--dots:${size}">${Array.from({ length: size * size }, () => "<b></b>").join("")}</i><span>${size}번째</span></div>`;
  return `<div class="growing-dot-squares">${[1,2,3,4].map(stage).join("")}<strong>…</strong><em>${visual.target}번째</em></div>`;
}

function symbolSumGridMarkup(visual) {
  const cells = ["☆", "□", "△", visual.rowOne, "□", "□", "☆", visual.rowTwo, "△", "□", "○", visual.rowThree, visual.rowOne, visual.columnTwo, "㉠"];
  return `<div class="symbol-sum-grid">${cells.map((cell, index) => `<span class="${index > 11 ? "sum" : ""}">${cell}</span>`).join("")}</div>`;
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

function symbolRelationsMarkup(visual) {
  const repeat = (symbol, count) => Array.from({ length: count }, () => symbol).join(" + ");
  return `<div class="symbol-relations"><p>${repeat("☆", visual.firstStar)} = ${repeat("○", visual.firstCircle)}</p><p>☆ + ○ = ▽ + ▽</p><p>${visual.final.join(" + ")} = □</p></div>`;
}

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

function triangleMaxSumMarkup(visual) {
  const coordinates = { top: [110, 20], left: [62, 88], "bottom-left": [20, 158], bottom: [110, 158], "bottom-right": [200, 158], right: [158, 88] };
  const shown = new Set(visual.given || []);
  const nodes = Object.entries(coordinates).map(([name, [x, y]]) => {
    const value = shown.has(name) ? visual.nodes[name] : "";
    return `<circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y + 5}" text-anchor="middle">${value}</text>`;
  }).join("");
  const cards = visual.answerOnly ? "" : `<div class="triangle-number-cards">${visual.values.map((value) => `<span>${value}</span>`).join("")}</div>`;
  return `${cards}<svg class="triangle-max-sum" viewBox="0 0 220 180" role="img" aria-label="세 변의 합이 같은 삼각형"><path d="M110 20L20 158H200Z M62 88L158 88 M20 158H200"/>${nodes}</svg>`;
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

function letterCardSvg(chars, transformed = false) {
  const sourceWidth = Math.max(60, chars.length * 54);
  const sourceHeight = 60;
  const glyphs = chars.map((char, index) => `<text x="${27 + index * 54}" y="40" text-anchor="middle">${char}</text>`).join("");
  const content = `<rect x="1" y="1" width="${sourceWidth - 2}" height="${sourceHeight - 2}"/><g>${glyphs}</g>`;
  if (!transformed) return `<svg viewBox="0 0 ${sourceWidth} ${sourceHeight}" role="img" aria-label="글자 블록">${content}</svg>`;
  const outputWidth = sourceHeight;
  const outputHeight = sourceWidth;
  const transform = `translate(${outputWidth / 2} ${outputHeight / 2}) scale(-1 1) rotate(-90) translate(${-sourceWidth / 2} ${-sourceHeight / 2})`;
  return `<svg viewBox="0 0 ${outputWidth} ${outputHeight}" role="img" aria-label="움직인 글자 블록"><g transform="${transform}">${content}</g></svg>`;
}

function letterBlockTransformMarkup(visual) {
  return `<div class="letter-transform"><div class="letter-example">${letterCardSvg(visual.exampleChars)}<b>→</b>${letterCardSvg(visual.exampleChars, true)}</div><div class="letter-target">${letterCardSvg(visual.targetChars)}<b>→</b><span class="letter-answer-box"></span></div></div>`;
}

function letterBlockAnswerMarkup(visual) {
  return `<div class="letter-transform-answer">${letterCardSvg(visual.chars, true)}</div>`;
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

function matchstickRowMarkup(visual) {
  // 맞닿는 변을 함께 쓰는 것이 문제의 핵심이라, 네모를 붙여 그려 공유 변이 보이게 한다.
  const unit = 34;
  const width = unit * visual.shown + 2;
  const sticks = [];
  for (let i = 0; i < visual.shown; i += 1) {
    const x = 1 + unit * i;
    sticks.push(`<line x1="${x}" y1="1" x2="${x + unit}" y2="1" />`);
    sticks.push(`<line x1="${x}" y1="${unit + 1}" x2="${x + unit}" y2="${unit + 1}" />`);
    sticks.push(`<line x1="${x}" y1="1" x2="${x}" y2="${unit + 1}" />`);
  }
  sticks.push(`<line x1="${1 + unit * visual.shown}" y1="1" x2="${1 + unit * visual.shown}" y2="${unit + 1}" />`);
  return `<div class="matchstick-row"><svg class="matchstick-svg" viewBox="0 0 ${width} ${unit + 2}" role="img" aria-label="성냥개비 네모 ${visual.shown}개">${sticks.join("")}</svg><strong>…</strong><em>네모 ${visual.target}개</em></div>`;
}

function targetBoardMarkup(visual) {
  // 바깥이 낮은 점수, 가운데가 높은 점수인 보통의 과녁 배치로 그린다.
  const size = 168;
  const center = size / 2;
  // 낮은 점수가 바깥, 높은 점수가 가운데. 반지름을 고리 수로 균등하게 나눈다.
  const rings = visual.scores.slice().sort((a, b) => a - b);
  // 고리가 5개면 띠 하나가 13px밖에 안 돼 숫자가 서로 붙는다. 가운데 원을 작게 잡아 띠를 넓힌다.
  const radiusAt = (index) => center - 4 - (center - 10) * (index / rings.length);
  const parts = rings.map((score, index) => `<circle cx="${center}" cy="${center}" r="${radiusAt(index).toFixed(1)}" />`);
  const labels = rings.map((score, index) => {
    // 마지막 고리는 가운데 원이라 중심에, 나머지는 두 원 사이 띠의 위쪽에 적는다.
    const last = index === rings.length - 1;
    const y = last ? center + 5 : center - (radiusAt(index) + radiusAt(index + 1)) / 2 + 5;
    return `<text x="${center}" y="${y.toFixed(1)}" text-anchor="middle">${score}</text>`;
  });
  return `<div class="target-board"><svg class="target-board-svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="과녁 ${rings.join("·")}점">${parts.join("")}${labels.join("")}</svg></div>`;
}

function numberSequencesMarkup(visual) {
  return `<div class="number-sequences">${visual.rows.map((row, index) => `<div><b>(${index + 1})</b>${row.items.map((value) => `<span${value === null ? ' class="blank"' : ""}>${value === null ? "" : value}</span>`).join("")}</div>`).join("")}</div>`;
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

function countPlacementGridMarkup(visual) {
  // 개수만 주고 칸은 비워 둔다. 답이 그림이라 학생이 직접 채워야 한다.
  const rows = Array.from({ length: visual.size }, (_, r) => {
    const cells = Array.from({ length: visual.size }, () => `<b></b>`).join("");
    return `<div>${cells}<em>${visual.rows[r]}</em></div>`;
  }).join("");
  const foot = `<div class="foot">${visual.cols.map((n) => `<em>${n}</em>`).join("")}<i></i></div>`;
  return `<div class="count-grid" style="--size:${visual.size}">${rows}${foot}</div>`;
}

function statementListMarkup(visual) {
  return `<ul class="statement-list">${visual.items.map((text) => `<li>${text}</li>`).join("")}</ul>`;
}

function vertexDegreeMarkup(visual) {
  const pad = 12;
  const hasCoordinates = visual.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  const minX = hasCoordinates ? Math.min(...visual.points.map((point) => point.x)) : 0;
  const minY = hasCoordinates ? Math.min(...visual.points.map((point) => point.y)) : 0;
  const maxX = hasCoordinates ? Math.max(...visual.points.map((point) => point.x)) : 46 * (visual.cols - 1);
  const maxY = hasCoordinates ? Math.max(...visual.points.map((point) => point.y)) : 46 * (visual.rows - 1);
  const width = pad * 2 + maxX - minX;
  const height = pad * 2 + maxY - minY;
  const at = (index) => hasCoordinates
    ? { x: pad + visual.points[index].x - minX, y: pad + visual.points[index].y - minY }
    : { x: pad + 46 * visual.points[index].c, y: pad + 46 * visual.points[index].r };
  const lines = visual.edges.map(([i, j]) => {
    const a = at(i);
    const b = at(j);
    return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" />`;
  }).join("");
  const dots = visual.points.map((_, index) => {
    const p = at(index);
    return `<circle cx="${p.x}" cy="${p.y}" r="7" />`;
  }).join("");
  return `<svg class="vertex-degree-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="점과 선 그림">${lines}${dots}</svg>`;
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

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "geometry-worksheet") return `<div class="visual geometry-worksheet-visual">${geometryWorksheetMarkup(visual)}</div>`;
  if (visual.kind === "count-placement-grid") return `<div class="visual count-grid-visual">${countPlacementGridMarkup(visual)}</div>`;
  if (visual.kind === "statement-list") return `<div class="visual statement-visual">${statementListMarkup(visual)}</div>`;
  if (visual.kind === "vertex-degree") return `<div class="visual vertex-degree-visual">${vertexDegreeMarkup(visual)}</div>`;
  if (visual.kind === "cell-shape") return `<div class="visual cell-shape-visual">${cellShapeMarkup(visual)}</div>`;
  if (visual.kind === "matchstick-row") return `<div class="visual matchstick-visual">${matchstickRowMarkup(visual)}</div>`;
  if (visual.kind === "target-board") return `<div class="visual target-board-visual">${targetBoardMarkup(visual)}</div>`;
  if (visual.kind === "number-sequences") return `<div class="visual number-sequences-visual">${numberSequencesMarkup(visual)}</div>`;
  if (visual.kind === "checker-square-growth") return `<div class="visual checker-growth-visual">${checkerSquareGrowthMarkup(visual)}</div>`;
  if (visual.kind === "stone-triangle-rows") return `<div class="visual stone-triangle-visual">${stoneTriangleRowsMarkup(visual)}</div>`;
  if (visual.kind === "sum-grid") return `<div class="visual sum-grid-visual">${sumGridMarkup(visual)}</div>`;
  if (visual.kind === "torn-calendar") return `<div class="visual torn-calendar-visual">${tornCalendarMarkup(visual)}</div>`;
  if (visual.kind === "magic-square") return `<div class="visual magic-square-visual">${magicSquareMarkup(visual)}</div>`;
  if (visual.kind === "hidden-card-conditions") return `<div class="visual hidden-card-visual">${hiddenCardConditionsMarkup(visual)}</div>`;
  if (visual.kind === "closest-card-sum") return `<div class="visual closest-card-visual">${closestCardSumMarkup(visual)}</div>`;
  if (visual.kind === "number-card-plus-minus") return `<div class="visual card-equation-visual">${numberCardMarkup(visual)}</div>`;
  if (visual.kind === "edge-sum-cycle") return `<div class="visual edge-sum-visual">${edgeSumCycleMarkup(visual)}</div>`;
  if (visual.kind === "equalize-bags") return `<div class="visual equalize-visual">${equalizeBagsMarkup(visual)}</div>`;
  if (visual.kind === "number-pyramid") return `<div class="visual pyramid-visual">${numberPyramidMarkup(visual)}</div>`;
  if (visual.kind === "race-order") return `<div class="visual race-order-visual">${raceOrderMarkup(visual, visual.conditions || [])}</div>`;
  if (visual.kind === "disc-number-rule") return `<div class="visual disc-rule-visual">${discNumberRuleMarkup(visual)}</div>`;
  if (visual.kind === "shape-sum-table") return `<div class="visual shape-sum-visual">${shapeSumTableMarkup(visual)}</div>`;
  if (visual.kind === "repeat-shape-sequence") return `<div class="visual repeat-sequence-visual">${repeatShapeSequenceMarkup(visual)}</div>`;
  if (visual.kind === "arrow-number-grid") return `<div class="visual arrow-grid-visual">${arrowNumberGridMarkup(visual)}</div>`;
  if (visual.kind === "bus-stops") return `<div class="visual bus-stops-visual">${busStopsMarkup(visual)}</div>`;
  if (visual.kind === "equal-line-cross") return `<div class="visual equal-line-cross-visual">${equalLineCrossMarkup(visual)}</div>`;
  if (visual.kind === "number-conditions") return `<div class="visual number-conditions-visual">${numberConditionsMarkup(visual)}</div>`;
  if (visual.kind === "growing-dot-square") return `<div class="visual growing-dot-square-visual">${growingDotSquareMarkup(visual)}</div>`;
  if (visual.kind === "symbol-sum-grid") return `<div class="visual symbol-sum-grid-visual">${symbolSumGridMarkup(visual)}</div>`;
  if (visual.kind === "source-piano") return `<div class="visual source-piano-visual">${sourcePianoMarkup()}</div>`;
  if (visual.kind === "balance-relations") return `<div class="visual balance-relations-visual">${balanceRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-relations") return `<div class="visual symbol-relations-visual">${symbolRelationsMarkup(visual)}</div>`;
  if (visual.kind === "symbol-chain") return `<div class="visual symbol-chain-visual">${symbolChainMarkup(visual)}</div>`;
  if (visual.kind === "shape-matrix-three") return `<div class="visual shape-matrix-three-visual">${shapeMatrixThreeMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-cycle") return `<div class="visual triangle-position-cycle-visual">${trianglePositionCycleMarkup(visual)}</div>`;
  if (visual.kind === "triangle-position-answer") return `<div class="visual triangle-position-answer-visual">${triangleCycleSvg(visual.position)}</div>`;
  if (visual.kind === "triangle-max-sum") return `<div class="visual triangle-max-sum-visual">${triangleMaxSumMarkup(visual)}</div>`;
  if (visual.kind === "overlap-bonds") return `<div class="visual overlap-bonds-visual">${overlapBondsMarkup(visual)}</div>`;
  if (visual.kind === "letter-block-transform") return `<div class="visual letter-block-transform-visual">${letterBlockTransformMarkup(visual)}</div>`;
  if (visual.kind === "letter-block-transform-answer") return `<div class="visual letter-block-transform-answer-visual">${letterBlockAnswerMarkup(visual)}</div>`;
  if (visual.kind === "colored-shape-number") return `<div class="visual colored-shape-number-visual">${coloredShapeNumberMarkup(visual)}</div>`;
  if (visual.kind === "source-go-stones") return `<div class="visual source-go-stones-visual">${sourceGoStonesMarkup(visual)}</div>`;
  if (visual.kind === "nonadjacent-pyramid") return `<div class="visual nonadjacent-pyramid-visual">${nonadjacentPyramidMarkup(visual)}</div>`;
  if (visual.kind === "cards") return `<div class="visual"><div class="number-cards">${visual.values.map((value) => `<span class="number-card">${value}</span>`).join("")}</div></div>`;
  if (visual.kind === "bus") return `<div class="visual"><div class="bus-row"><span>${visual.start}명</span><b>+</b><span class="bus-icon">버스</span><span>+${visual.boarded}</span><span>-${visual.left}</span></div></div>`;
  if (visual.kind === "place") return `<div class="visual"><div class="place-grid"><b>십의 자리</b><b>일의 자리</b><strong>${visual.tens}</strong><strong>${visual.ones}</strong></div></div>`;
  if (visual.kind === "shapes") return `<div class="visual"><div class="shape-row">${visual.items.map((token) => `<span class="shape-token ${token.color === "검은색" ? "black" : "white"}">${shapeSymbol(token.shape)}</span>`).join("")}</div></div>`;
  if (visual.kind === "piano") return `<div class="visual"><div class="piano-row">${Array.from({ length: visual.keys }, (_, index) => `<span class="piano-key">${index + 1}</span>`).join("")}</div></div>`;
  if (visual.kind === "line") return `<div class="visual"><div class="people-row">${Array.from({ length: visual.total }, (_, index) => `<i class="${index + 1 === visual.first ? "marked" : ""}">${index + 1}</i>`).join("")}</div></div>`;
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
      <label class="answer-line">답 <input class="answer-input" aria-label="${index + 1}번 답" /></label>
    </article>`;
  }).join("");
  $("watermark").innerHTML = state.watermark ? watermarkMarkup() : "";
  $("answerWatermark").innerHTML = state.watermark ? watermarkMarkup() : "";
}

function openAnswers() {
  $("answerBody").innerHTML = state.questions.map((question, index) => {
    const domain = DOMAINS.find((item) => item.id === question.type.domain);
    const answer = question.answerVisual ? visualMarkup(question.answerVisual) : question.answer;
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
