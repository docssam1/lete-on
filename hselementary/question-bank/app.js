(() => {
  const curriculum = window.HSE_CURRICULUM;
  const generatorApi = window.HSE_GENERATORS;
  if (!curriculum || !generatorApi) throw new Error("초등 문제은행 데이터를 불러오지 못했습니다.");

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const hash = (value) => [...value].reduce((sum, character) => Math.imul(sum ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;

  const types = curriculum.semesters.flatMap(semester => semester.units.flatMap(unit => unit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    semesterLabel: semester.label,
    grade: semester.grade,
    term: semester.term,
    unitId: unit.id,
    unitNumber: unit.number,
    unitName: unit.name,
    generator: generatorApi.generatorKey({ ...type, semesterId: semester.id, unitId: unit.id, unitName: unit.name })
  }))));
  const typeById = new Map(types.map(type => [type.id, type]));

  const state = {
    grade: 4,
    term: 1,
    level: "simwha",
    unitId: "",
    search: "",
    difficulty: 0,
    selected: new Set(),
    collapsedUnits: new Set(),
    count: 12,
    questions: [],
    view: "problem",
    generation: 0
  };

  function currentLevel() {
    return curriculum.levels.find(level => level.id === state.level) || curriculum.levels[0];
  }

  function currentSemester() {
    return curriculum.semesters.find(item => item.grade === state.grade && item.term === state.term);
  }

  function currentDifficultyLabel() {
    return ({ "-1": "쉽게", "0": "같게", "1": "어렵게" })[String(state.difficulty)] || "같게";
  }

  function visibleTypes() {
    const search = state.search.trim().toLocaleLowerCase("ko");
    return types.filter(type => {
      if (type.grade !== state.grade || type.term !== state.term) return false;
      if (state.unitId && type.unitId !== state.unitId) return false;
      if (search && !`${type.name} ${type.unitName}`.toLocaleLowerCase("ko").includes(search)) return false;
      return true;
    });
  }

  function refreshSegments(containerId, key, value) {
    $(containerId).querySelectorAll("button").forEach(button => {
      const active = String(button.dataset[key]) === String(value);
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderUnitOptions() {
    const semester = currentSemester();
    const units = semester?.units || [];
    if (!units.some(unit => unit.id === state.unitId)) state.unitId = "";
    $("unitFilter").innerHTML = `<option value="">전체 단원</option>${units.map(unit => `<option value="${unit.id}" ${unit.id === state.unitId ? "selected" : ""}>${unit.number}. ${escapeHtml(unit.name)}</option>`).join("")}`;
  }

  function typeTreeRow(type) {
    const ready = Boolean(type.generator);
    const selected = state.selected.has(type.id);
    const number = String(type.typeNumber || type.number).padStart(2, "0");
    return '<label class="tree-type ' + (selected ? "is-selected" : "") + (ready ? "" : " is-pending") + '">' +
      '<input type="checkbox" data-type-id="' + type.id + '" ' + (selected ? "checked" : "") + (ready ? "" : " disabled") + '>' +
      '<span class="tree-type-number">' + number + '</span>' +
      '<span class="tree-type-copy"><strong>' + escapeHtml(type.name) + '</strong><small>심화 기준 · p.' + type.page + '</small></span>' +
      '<span class="tree-type-state ' + (ready ? "is-ready" : "") + '">' + (ready ? "생성 가능" : "준비 중") + '</span>' +
    '</label>';
  }

  function renderCatalog() {
    const visible = visibleTypes();
    const semester = currentSemester();
    const markup = (semester?.units || []).map(unit => {
      const unitTypes = visible.filter(type => type.unitId === unit.id);
      if (!unitTypes.length) return "";
      const isOpen = !state.collapsedUnits.has(unit.id);
      const readyCount = unitTypes.filter(type => type.generator).length;
      return '<section class="tree-unit ' + (isOpen ? "is-open" : "") + '">' +
        '<button class="tree-unit-toggle" type="button" data-tree-unit="' + unit.id + '" aria-expanded="' + isOpen + '">' +
          '<span class="tree-chevron" aria-hidden="true">›</span><span class="tree-unit-number">' + unit.number + '</span>' +
          '<span class="tree-unit-copy"><strong>' + escapeHtml(unit.name) + '</strong><small>' + readyCount + '개 유형 생성 가능</small></span>' +
        '</button>' +
        '<div class="tree-branch" ' + (isOpen ? "" : "hidden") + '>' + unitTypes.map(typeTreeRow).join("") + '</div>' +
      '</section>';
    }).join("");
    $("typeList").innerHTML = markup;
    $("catalogEmpty").hidden = visible.length > 0;
    renderSummary();
  }

  function renderSummary() {
    const selected = [...state.selected].map(id => typeById.get(id)).filter(Boolean);
    $("selectedTypeCount").textContent = selected.length;
    $("selectedQuestionCount").textContent = selected.length ? state.count : 0;
    $("selectedTypeSummary").textContent = `${selected.length}개`;
    $("selectedQuestionSummary").textContent = `${selected.length ? state.count : 0}문항`;
    $("generateButton").disabled = selected.length === 0;
    $("selectedTypeList").innerHTML = selected.length ? selected.map(type =>
      '<div><span><b>' + escapeHtml(type.name) + '</b><small>' + type.unitNumber + '단원 ' + escapeHtml(type.unitName) + '</small></span>' +
      '<button type="button" data-remove-type="' + type.id + '" aria-label="' + escapeHtml(type.name) + ' 선택 해제">×</button></div>'
    ).join("") : '<p>왼쪽 교육과정 트리에서 유형을 선택하세요.</p>';
  }

  function setQuestionCount(value) {
    state.count = Math.max(1, Math.min(40, Number.isFinite(value) ? value : 12));
    $("questionCountInput").value = String(state.count);
    document.querySelectorAll("[data-count]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.count) === state.count);
    });
    renderSummary();
  }

  function bindSegment(containerId, dataKey, stateKey, transform = value => value) {
    $(containerId).addEventListener("click", event => {
      const button = event.target.closest(`button[data-${dataKey}]`);
      if (!button) return;
      state[stateKey] = transform(button.dataset[dataKey]);
      refreshSegments(containerId, dataKey, state[stateKey]);
      if (stateKey === "grade" || stateKey === "term") {
        state.unitId = "";
        renderUnitOptions();
        renderCatalog();
      } else if (stateKey === "level") {
        renderCatalog();
      }
    });
  }

  function buildQuestions() {
    const selected = [...state.selected].map(id => typeById.get(id)).filter(type => type?.generator);
    if (!selected.length) return;
    state.generation += 1;
    const level = currentLevel();
    const baseSeed = (Date.now() + state.generation * 1000003) >>> 0;
    state.questions = Array.from({ length: state.count }, (_, index) => {
      const type = selected[index % selected.length];
      const seed = (baseSeed + index * 7919 + hash(type.id)) >>> 0;
      const generated = generatorApi.generate(type, level.rank, state.difficulty, seed, index);
      return { number: index + 1, type, level, difficulty: currentDifficultyLabel(), ...generated };
    });
    state.view = "problem";
    renderWorksheet();
    document.querySelector(".bank-layout").hidden = true;
    $("worksheet").hidden = false;
    scrollTo({ top: 0, behavior: "smooth" });
  }

  function watermark() {
    if (!$("watermarkToggle").checked) return "";
    const name = escapeHtml($("studentNameInput").value.trim() || "LETE-ON");
    return `<div class="watermark" aria-hidden="true"><span>${name} · LETE-ON</span><span>${name} · LETE-ON</span><span>${name} · LETE-ON</span></div>`;
  }

  function chunk(values, size) {
    const result = [];
    for (let index = 0; index < values.length; index += size) result.push(values.slice(index, index + size));
    return result;
  }

  function renderProblems() {
    $("problemView").innerHTML = chunk(state.questions, 6).map((page, pageIndex) => `<section class="print-page">
      <div class="page-label">문제 ${pageIndex + 1}</div>
      <div class="question-grid">${page.map(question => `<article id="question-${question.number}" class="question-item">
        <header><b>${question.number}</b><span>${escapeHtml(question.type.unitName)} · ${escapeHtml(question.type.name)}</span><em>${escapeHtml(question.difficulty)}</em></header>
        <div class="question-prompt">${question.prompt}</div>
        <div class="answer-line">답</div>
      </article>`).join("")}</div>${watermark()}
    </section>`).join("");
  }

  function renderSolutions() {
    $("solutionView").innerHTML = chunk(state.questions, 8).map((page, pageIndex) => `<section class="print-page answer-page">
      <div class="page-label">정답·풀이 ${pageIndex + 1}</div>
      <div class="solution-list">${page.map(question => `<article class="solution-item">
        <header><b>${question.number}</b><span>${escapeHtml(question.type.name)}</span><strong>${escapeHtml(question.answer)}</strong></header>
        <p>${escapeHtml(question.solution)}</p>
      </article>`).join("")}</div>${watermark()}
    </section>`).join("");
  }

  function renderWorksheet() {
    const student = $("studentNameInput").value.trim();
    const selected = [...state.selected].map(id => typeById.get(id)).filter(Boolean);
    if (student) localStorage.setItem("hseStudent", student);
    $("worksheetStudent").textContent = student;
    $("worksheetTitle").textContent = state.view === "problem" ? "맞춤 유사문제" : "맞춤 유사문제 정답·풀이";
    $("worksheetMeta").textContent = `심화 기준 · ${currentDifficultyLabel()} · ${state.questions.length}문항 · ${state.selected.size}개 유형`;
    $("problemView").hidden = state.view !== "problem";
    $("solutionView").hidden = state.view !== "solution";
    $("problemTab").classList.toggle("is-active", state.view === "problem");
    $("solutionTab").classList.toggle("is-active", state.view === "solution");
    $("problemTab").setAttribute("aria-selected", state.view === "problem" ? "true" : "false");
    $("solutionTab").setAttribute("aria-selected", state.view === "solution" ? "true" : "false");
    $("reviewStageMeta").textContent = `${state.questions.length}문항 · ${selected.length}개 유형`;
    $("reviewSelectedTypes").innerHTML = selected.map(type =>
      `<div><strong>${escapeHtml(type.name)}</strong><span>${type.unitNumber}단원 · ${escapeHtml(type.unitName)}</span></div>`
    ).join("");
    $("reviewQuestionList").innerHTML = state.questions.map(question =>
      `<a href="#question-${question.number}"><b>${question.number}</b><span>${escapeHtml(question.type.name)}</span></a>`
    ).join("");
    renderProblems();
    renderSolutions();
  }

  bindSegment("gradeFilter", "grade", "grade", Number);
  bindSegment("termFilter", "term", "term", Number);
  bindSegment("difficultyFilter", "difficulty", "difficulty", Number);

  $("unitFilter").addEventListener("change", event => { state.unitId = event.target.value; renderCatalog(); });
  $("typeSearchInput").addEventListener("input", event => { state.search = event.target.value; renderCatalog(); });
  $("questionCountInput").addEventListener("input", event => {
    setQuestionCount(Number(event.target.value));
  });
  document.querySelector(".count-presets").addEventListener("click", event => {
    const button = event.target.closest("button[data-count]");
    if (!button) return;
    setQuestionCount(Number(button.dataset.count));
  });
  $("typeList").addEventListener("click", event => {
    const button = event.target.closest("button[data-tree-unit]");
    if (!button) return;
    const unitId = button.dataset.treeUnit;
    if (state.collapsedUnits.has(unitId)) state.collapsedUnits.delete(unitId); else state.collapsedUnits.add(unitId);
    renderCatalog();
  });
  $("typeList").addEventListener("change", event => {
    const input = event.target.closest("input[data-type-id]");
    if (!input) return;
    if (input.checked) state.selected.add(input.dataset.typeId); else state.selected.delete(input.dataset.typeId);
    renderCatalog();
  });
  $("selectedTypeList").addEventListener("click", event => {
    const button = event.target.closest("button[data-remove-type]");
    if (!button) return;
    state.selected.delete(button.dataset.removeType);
    renderCatalog();
  });
  $("generateButton").addEventListener("click", buildQuestions);
  $("newProblemButton").addEventListener("click", buildQuestions);
  $("backButton").addEventListener("click", () => {
    $("worksheet").hidden = true;
    document.querySelector(".bank-layout").hidden = false;
    scrollTo({ top: 0, behavior: "smooth" });
  });
  $("problemTab").addEventListener("click", () => { state.view = "problem"; renderWorksheet(); });
  $("solutionTab").addEventListener("click", () => { state.view = "solution"; renderWorksheet(); });
  $("printButton").addEventListener("click", () => print());
  $("watermarkToggle").addEventListener("change", () => { if (state.questions.length) renderWorksheet(); });

  const params = new URLSearchParams(location.search);
  $("studentNameInput").value = params.get("student") || localStorage.getItem("hseStudent") || "";
  const reviewType = typeById.get(params.get("type"));
  if (reviewType?.generator) {
    state.level = "simwha";
    state.grade = reviewType.grade;
    state.term = reviewType.term;
    state.unitId = reviewType.unitId;
    state.selected.add(reviewType.id);
    state.count = 3;
    $("questionCountInput").value = "3";
    refreshSegments("gradeFilter", "grade", state.grade);
    refreshSegments("termFilter", "term", state.term);
  }
  renderUnitOptions();
  renderCatalog();
  if (reviewType?.generator && params.get("review") === "1") buildQuestions();
})();
