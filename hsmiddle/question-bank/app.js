(() => {
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const catalog = window.HSMIDDLE_BANK.createCatalog().filter(item => item.verified);
  const byNumber = new Map(catalog.map(item => [item.number, item]));
  const state = {
    selected: new Set(),
    filters: { semester:"", unit:"", area:"", difficulty:"", search:"" },
    view: "problem",
    student: ""
  };

  const session = window.HSMIDDLE_AUTH.readSession();
  const hasAccess = session.valid && (window.HSMIDDLE_AUTH.isAdmin(session.name) || session.access.includes("diagnostic")) && !window.HSMIDDLE_AUTH.isExpired(session.name);
  if (!hasAccess) {
    $("accessGate").hidden = false;
    return;
  }

  state.student = session.name;
  $("app").hidden = false;
  $("studentName").textContent = `${state.student} 학생`;
  $("worksheetStudent").textContent = state.student;

  const unique = (key, source = catalog) => [...new Set(source.map(item => item[key]).filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b), "ko", {numeric:true}));
  const buttonGroup = (target, values, filterKey, allLabel = "전체") => {
    target.innerHTML = [`<button type="button" class="active" data-value="">${allLabel}</button>`, ...values.map(value => `<button type="button" data-value="${value}">${value}</button>`)].join("");
    target.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      state.filters[filterKey] = button.dataset.value;
      [...target.querySelectorAll("button")].forEach(item => item.classList.toggle("active", item === button));
      if (filterKey === "semester") refreshUnits();
      renderCatalog();
    });
  };

  buttonGroup($("semesterFilters"), unique("semester"), "semester");
  buttonGroup($("areaFilters"), unique("area"), "area");
  buttonGroup($("difficultyFilters"), ["하","중","상","최상"], "difficulty");

  function refreshUnits() {
    const scoped = state.filters.semester ? catalog.filter(item => item.semester === state.filters.semester) : catalog;
    const units = unique("unit", scoped);
    if (!units.includes(state.filters.unit)) state.filters.unit = "";
    $("unitFilter").innerHTML = `<option value="">전체 단원</option>${units.map(unit => `<option value="${unit}" ${unit === state.filters.unit ? "selected" : ""}>${unit}</option>`).join("")}`;
  }

  function visibleItems() {
    const search = state.filters.search.trim().toLocaleLowerCase("ko");
    return catalog.filter(item => {
      if (state.filters.semester && item.semester !== state.filters.semester) return false;
      if (state.filters.unit && item.unit !== state.filters.unit) return false;
      if (state.filters.area && item.area !== state.filters.area) return false;
      if (state.filters.difficulty && item.difficulty !== state.filters.difficulty) return false;
      if (search && !`${item.type} ${item.unit} ${item.semester} ${item.area}`.toLocaleLowerCase("ko").includes(search)) return false;
      return true;
    });
  }

  function activeFilterLabels() {
    return [state.filters.semester, state.filters.unit, state.filters.area, state.filters.difficulty ? `난이도 ${state.filters.difficulty}` : "", state.filters.search ? `검색: ${state.filters.search}` : ""].filter(Boolean);
  }

  function typeCard(item) {
    const selected = state.selected.has(item.id);
    return `<label class="type-card ${selected ? "selected" : ""}">
      <input type="checkbox" data-id="${item.id}" ${selected ? "checked" : ""}>
      <span class="q-number">${item.number}</span>
      <span class="type-copy"><h2>${item.type}</h2><p>${item.examLabel} ${item.number}번 기준</p><span class="tag-row"><span>${item.semester}</span><span>${item.unit}</span><span>${item.area}</span><span class="level">난이도 ${item.difficulty}</span></span></span>
      <span class="set-count"><b>${item.questionCount}문제</b><span>풀이 포함</span></span>
    </label>`;
  }

  function renderCatalog() {
    const visible = visibleItems();
    $("catalogMeta").textContent = `${visible.length}개 세트 · ${visible.length * 10}문제`;
    $("typeList").innerHTML = visible.map(typeCard).join("");
    $("emptyState").hidden = visible.length > 0;
    const labels = activeFilterLabels();
    $("activeFilters").innerHTML = (labels.length ? labels : ["전체 학기 · 전체 단원 · 전체 난이도"]).map(label => `<span>${label}</span>`).join("");
    const allSelected = visible.length > 0 && visible.every(item => state.selected.has(item.id));
    $("toggleVisible").textContent = allSelected ? "보이는 유형 선택 해제" : "보이는 유형 전체 선택";
    updateSelection();
  }

  function updateSelection() {
    const selected = catalog.filter(item => state.selected.has(item.id));
    $("selectedTypeCount").textContent = `${selected.length}개 세트`;
    $("selectedQuestionCount").textContent = `${selected.reduce((sum,item) => sum + item.questionCount, 0)}문제`;
    $("buildButton").disabled = selected.length === 0;
    $("selectedList").innerHTML = selected.length ? selected.map(item => `<div class="selected-item"><div><b>${item.number}번 · ${item.type}</b><span>${item.semester} · ${item.unit} · 난이도 ${item.difficulty}</span></div><button type="button" data-remove="${item.id}" aria-label="${item.type} 선택 해제">×</button></div>`).join("") : '<div class="selected-empty">왼쪽에서 유형을 선택하세요.</div>';
  }

  function watermarkMarkup() {
    if (!$("watermarkToggle").checked) return "";
    return `<div class="watermark" aria-hidden="true"><span>${state.student} · LETE-ON</span><span>${state.student} · LETE-ON</span><span>${state.student} · LETE-ON</span></div>`;
  }

  function selectedItems() {
    return catalog.filter(item => state.selected.has(item.id));
  }

  function pageNumbers(item) {
    if (state.view === "problem") return Array.from({length:item.problemPages}, (_,index) => index + 1);
    return Array.from({length:item.solutionPages}, (_,index) => item.problemPages + index + 1);
  }

  function renderWorksheet() {
    const selected = selectedItems();
    const totalQuestions = selected.reduce((sum,item) => sum + item.questionCount, 0);
    $("worksheetHeading").textContent = state.view === "problem" ? "맞춤 유사문제" : "맞춤 유사문제 정답·풀이";
    $("worksheetMeta").textContent = `${selected.length}개 유형 · ${totalQuestions}문제 · ${state.view === "problem" ? "문제편" : "풀이편"}`;
    $("pageStream").innerHTML = selected.map(item => `<section class="set-section">
      <header class="set-heading"><div><h2>${item.number}번 연계 · ${item.type}</h2><p>${item.semester} · ${item.unit} · ${item.area} · 난이도 ${item.difficulty}</p></div><span>${state.view === "problem" ? "문제 10문항" : "정답과 풀이"}</span></header>
      ${pageNumbers(item).map(page => `<article class="page"><img src="${item.assetFolder}/page-${page}.png" alt="${item.type} ${state.view === "problem" ? "문제" : "풀이"} ${page}쪽">${watermarkMarkup()}</article>`).join("")}
    </section>`).join("");
    document.body.dataset.view = state.view;
    document.querySelectorAll(".view-tabs button").forEach(button => button.classList.toggle("active", button.dataset.view === state.view));
  }

  function openWorksheet() {
    if (!state.selected.size) return;
    $("builderView").hidden = true;
    $("worksheetView").hidden = false;
    state.view = "problem";
    renderWorksheet();
    scrollTo({top:0,behavior:"smooth"});
  }

  $("typeList").addEventListener("change", event => {
    const input = event.target.closest("input[data-id]");
    if (!input) return;
    if (input.checked) state.selected.add(input.dataset.id); else state.selected.delete(input.dataset.id);
    renderCatalog();
  });

  $("selectedList").addEventListener("click", event => {
    const button = event.target.closest("button[data-remove]");
    if (!button) return;
    state.selected.delete(button.dataset.remove);
    renderCatalog();
  });

  $("toggleVisible").addEventListener("click", () => {
    const visible = visibleItems();
    const shouldSelect = !visible.every(item => state.selected.has(item.id));
    visible.forEach(item => shouldSelect ? state.selected.add(item.id) : state.selected.delete(item.id));
    renderCatalog();
  });

  $("searchInput").addEventListener("input", event => { state.filters.search = event.target.value; renderCatalog(); });
  $("unitFilter").addEventListener("change", event => { state.filters.unit = event.target.value; renderCatalog(); });
  $("resetFilters").addEventListener("click", () => {
    state.filters = { semester:"", unit:"", area:"", difficulty:"", search:"" };
    $("searchInput").value = "";
    document.querySelectorAll(".segment-grid button").forEach(button => button.classList.toggle("active", button.dataset.value === ""));
    refreshUnits();
    renderCatalog();
  });
  $("buildButton").addEventListener("click", openWorksheet);
  $("backToBuilder").addEventListener("click", () => { $("worksheetView").hidden = true; $("builderView").hidden = false; scrollTo({top:0,behavior:"smooth"}); });
  document.querySelector(".view-tabs").addEventListener("click", event => { const button = event.target.closest("button[data-view]"); if (!button) return; state.view = button.dataset.view; renderWorksheet(); scrollTo({top:0,behavior:"smooth"}); });
  $("printButton").addEventListener("click", async () => {
    const button = $("printButton");
    const label = button.textContent;
    button.disabled = true;
    button.textContent = "인쇄 준비 중";
    await Promise.all([...$("pageStream").querySelectorAll("img")].map(image => image.complete
      ? Promise.resolve()
      : new Promise(resolve => { image.addEventListener("load", resolve, {once:true}); image.addEventListener("error", resolve, {once:true}); })));
    button.disabled = false;
    button.textContent = label;
    print();
  });
  $("watermarkToggle").addEventListener("change", () => { if (!$("worksheetView").hidden) renderWorksheet(); });

  refreshUnits();
  const linkedQuestions = (params.get("qs") || "").split(",").map(Number).filter(number => byNumber.has(number));
  linkedQuestions.forEach(number => state.selected.add(byNumber.get(number).id));
  renderCatalog();
  if (linkedQuestions.length) openWorksheet();
})();
