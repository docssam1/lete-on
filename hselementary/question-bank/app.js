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
    generator: generatorApi.generatorKey(type.name)
  }))));
  const typeById = new Map(types.map(type => [type.id, type]));

  const state = {
    grade: 4,
    term: 1,
    level: "ilpum",
    unitId: "",
    search: "",
    difficulty: 0,
    selected: new Set(),
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

  function typeCard(type) {
    const ready = Boolean(type.generator);
    const selected = state.selected.has(type.id);
    return `<label class="type-card ${selected ? "is-selected" : ""} ${ready ? "" : "is-pending"}">
      <span class="type-number">${String(type.typeNumber || type.number).padStart(2, "0")}</span>
      <span class="type-copy">
        <span class="type-check"><input type="checkbox" data-type-id="${type.id}" ${selected ? "checked" : ""} ${ready ? "" : "disabled"}><strong>${escapeHtml(type.name)}</strong></span>
        <p>${type.semesterLabel} · ${type.unitNumber}단원 ${escapeHtml(type.unitName)}</p>
        <span class="meta-row"><span>${escapeHtml(currentLevel().label)}</span><span>교재 분류 확인</span><span>시작 p.${type.page}</span></span>
      </span>
      <span class="type-flag ${ready ? "is-ready" : ""}">${ready ? "1차 검수 가능" : "그림 렌더 제작 대기"}</span>
    </label>`;
  }

  function renderCatalog() {
    const visible = visibleTypes();
    $("typeList").innerHTML = visible.map(typeCard).join("");
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
    $("selectedTypeList").innerHTML = selected.length ? selected.map(type => `<div><span><b>${escapeHtml(type.name)}</b><small>${type.semesterLabel} · ${escapeHtml(type.unitName)}</small></span><button type="button" data-remove-type="${type.id}" aria-label="${escapeHtml(type.name)} 선택 해제">×</button></div>`).join("") : `<p>가운데 목록에서 생성 가능한 유형을 선택하세요.</p>`;
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
      const generated = generatorApi.generate(type, level.rank, state.difficulty, seed);
      return { number: index + 1, type, level, ...generated };
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
      <div class="question-grid">${page.map(question => `<article class="question-item">
        <header><b>${question.number}</b><span>${escapeHtml(question.type.unitName)} · ${escapeHtml(question.type.name)}</span><em>${escapeHtml(question.level.label)}</em></header>
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
    if (student) localStorage.setItem("hseStudent", student);
    $("worksheetStudent").textContent = student;
    $("worksheetTitle").textContent = state.view === "problem" ? "맞춤 유사문제" : "맞춤 유사문제 정답·풀이";
    $("worksheetMeta").textContent = `${currentLevel().label} · ${state.questions.length}문항 · ${state.selected.size}개 유형`;
    $("problemView").hidden = state.view !== "problem";
    $("solutionView").hidden = state.view !== "solution";
    $("problemTab").classList.toggle("is-active", state.view === "problem");
    $("solutionTab").classList.toggle("is-active", state.view === "solution");
    $("problemTab").setAttribute("aria-selected", state.view === "problem" ? "true" : "false");
    $("solutionTab").setAttribute("aria-selected", state.view === "solution" ? "true" : "false");
    renderProblems();
    renderSolutions();
  }

  bindSegment("gradeFilter", "grade", "grade", Number);
  bindSegment("termFilter", "term", "term", Number);
  bindSegment("levelFilter", "level", "level");
  bindSegment("difficultyFilter", "difficulty", "difficulty", Number);

  $("unitFilter").addEventListener("change", event => { state.unitId = event.target.value; renderCatalog(); });
  $("typeSearchInput").addEventListener("input", event => { state.search = event.target.value; renderCatalog(); });
  $("questionCountInput").addEventListener("input", event => {
    const value = Number(event.target.value);
    state.count = Math.max(1, Math.min(40, Number.isFinite(value) ? value : 12));
    renderSummary();
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

  $("studentNameInput").value = new URLSearchParams(location.search).get("student") || localStorage.getItem("hseStudent") || "";
  renderUnitOptions();
  renderCatalog();
})();
