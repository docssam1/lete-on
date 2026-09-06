(() => {
  const curriculum = window.HSE_CURRICULUM;
  const generatorApi = window.HSE_GENERATORS;
  const mathNotation = window.HSE_MATH_NOTATION;
  const identityApi = window.HSE_IDENTITY;
  if (!curriculum || !generatorApi || !mathNotation || !identityApi) throw new Error("초등 문제은행 데이터를 불러오지 못했습니다.");

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const hash = (value) => [...value].reduce((sum, character) => Math.imul(sum ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
  const typeDisplayName = type => type.label && type.label !== "핵심 유형" ? type.label : type.name;
  const difficultyBandLabel = type => ({ "-1": "심화 쉬움", "0": "심화 기준", "1": "심화 어려움" })[String(type.difficultyBand)] || "심화 기준";

  function renderMathNotation(markup) {
    const template = document.createElement("template");
    template.innerHTML = String(markup ?? "");
    function appendMathTokens(target, tokens) {
      tokens.forEach(token => {
        if (token.type === "text") {
          target.append(token.value);
        } else if (token.type === "fraction") {
          const fraction = document.createElement("span");
          fraction.className = "math-fraction";
          fraction.setAttribute("role", "img");
          fraction.setAttribute("aria-label", mathNotation.fractionAria(token));
          const numerator = document.createElement("span");
          const denominator = document.createElement("span");
          appendMathTokens(numerator, token.numerator);
          appendMathTokens(denominator, token.denominator);
          fraction.append(numerator, denominator);
          target.append(fraction);
        } else if (token.type === "mixed") {
          const mixed = document.createElement("span");
          mixed.className = "math-mixed-number";
          mixed.setAttribute("role", "img");
          mixed.setAttribute("aria-label", mathNotation.mixedAria(token));
          const whole = document.createElement("span");
          whole.textContent = token.whole;
          mixed.append(whole);
          appendMathTokens(mixed, [token.fraction]);
          target.append(mixed);
        } else {
          const unit = document.createElement("span");
          unit.className = "math-unit";
          unit.setAttribute("aria-label", `${token.base} ${token.power === "2" ? "제곱" : "세제곱"}`);
          unit.append(token.base);
          const power = document.createElement("sup");
          power.textContent = token.power;
          unit.append(power);
          target.append(unit);
        }
      });
    }

    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const parent = node.parentElement;
      if (parent?.closest("svg, script, style, code, .math-fraction, .math-unit, [data-math-raw]")) return;
      const tokens = mathNotation.tokenize(node.nodeValue);
      if (tokens.length === 1 && tokens[0].type === "text" && tokens[0].value === node.nodeValue) return;
      const fragment = document.createDocumentFragment();
      appendMathTokens(fragment, tokens);
      node.replaceWith(fragment);
    });

    template.content.querySelectorAll("svg text").forEach(text => {
      if (text.children.length) return;
      const normalized = mathNotation.normalizeMathText(text.textContent).replace(/(km|cm|mm|m)\^([23])/g, "$1$2");
      const matches = [...normalized.matchAll(/(km|cm|mm|m)([²³]|[23])(?!\d)/g)];
      if (!matches.length) return;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      matches.forEach(match => {
        fragment.append(normalized.slice(cursor, match.index), match[1]);
        const power = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        power.setAttribute("baseline-shift", "super");
        power.setAttribute("font-size", "70%");
        power.textContent = match[2] === "²" || match[2] === "2" ? "2" : "3";
        fragment.append(power);
        cursor = match.index + match[0].length;
      });
      fragment.append(normalized.slice(cursor));
      text.replaceChildren(fragment);
    });
    return template.innerHTML;
  }

  const types = curriculum.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
    ...type,
    semesterId: semester.id,
    semesterLabel: semester.label,
    grade: semester.grade,
    term: semester.term,
    unitId: unit.id,
    unitNumber: unit.number,
    unitName: unit.name,
    subunitId: subunit.id,
    subunitNumber: subunit.number,
    subunitName: subunit.name,
    generator: generatorApi.generatorKey({ ...type, semesterId: semester.id, unitId: unit.id, unitName: unit.name })
  })))));
  const typeById = new Map(types.map(type => [type.id, type]));
  let previewPopover = null;
  let previewAnchor = null;

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
    return ({ "-1": "심화 쉬움", "0": "심화 기준", "1": "심화 어려움" })[String(state.difficulty)] || "심화 기준";
  }

  function visibleTypes() {
    const search = state.search.trim().toLocaleLowerCase("ko");
    return types.filter(type => {
      if (type.grade !== state.grade || type.term !== state.term) return false;
      if (state.unitId && type.unitId !== state.unitId) return false;
      if (search && !`${typeDisplayName(type)} ${type.sourceItemLabel || ""} ${type.name} ${type.subunitName} ${type.unitName}`.toLocaleLowerCase("ko").includes(search)) return false;
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
    $("unitFilter").innerHTML = `<option value="">전체 대단원</option>${units.map(unit => `<option value="${unit.id}" ${unit.id === state.unitId ? "selected" : ""}>${unit.number}. ${escapeHtml(unit.name)}</option>`).join("")}`;
  }

  function typeTreeRow(type) {
    const ready = Boolean(type.generator) && !type.reviewLocked;
    const selected = state.selected.has(type.id);
    const number = String(type.typeNumber || type.number).padStart(2, "0");
    const sourceLabel = type.sourceItemLabel ? "원문 " + escapeHtml(type.sourceItemLabel) + " · " : "";
    return '<div class="tree-type ' + (selected ? "is-selected" : "") + (ready ? "" : " is-pending") + '" data-preview-type-id="' + type.id + '" role="button" tabindex="0" aria-label="' + escapeHtml(typeDisplayName(type)) + ' 유형 예시 미리보기" aria-controls="typePreviewPopover" aria-expanded="false">' +
      '<input type="checkbox" data-type-id="' + type.id + '" ' + (selected ? "checked" : "") + (ready ? "" : " disabled") + '>' +
      '<span class="tree-type-number">' + number + '</span>' +
      '<span class="tree-type-copy"><strong>' + escapeHtml(typeDisplayName(type)) + '</strong><small>' + sourceLabel + type.grade + '학년 ' + type.term + '학기 · <i class="difficulty-band difficulty-band-' + type.difficultyBand + '">' + difficultyBandLabel(type) + '</i></small></span>' +
      '<span class="tree-type-preview-action" aria-hidden="true">미리보기</span>' +
      '<span class="tree-type-state ' + (ready ? "is-ready" : "") + '">' + (ready ? "생성 가능" : "검수 대기") + '</span>' +
    '</div>';
  }

  function renderCatalog() {
    hideTypePreview(true);
    const visible = visibleTypes();
    const semester = currentSemester();
    const markup = (semester?.units || []).map(unit => {
      const unitTypes = visible.filter(type => type.unitId === unit.id);
      if (!unitTypes.length) return "";
      const isOpen = !state.collapsedUnits.has(unit.id);
      const readyCount = unitTypes.filter(type => type.generator && !type.reviewLocked).length;
      return '<section class="tree-unit ' + (isOpen ? "is-open" : "") + '">' +
        '<button class="tree-unit-toggle" type="button" data-tree-unit="' + unit.id + '" aria-expanded="' + isOpen + '">' +
          '<span class="tree-chevron" aria-hidden="true">›</span><span class="tree-unit-number">' + unit.number + '</span>' +
          '<span class="tree-unit-copy"><strong>' + escapeHtml(unit.name) + '</strong><small>' + readyCount + '개 유형 생성 가능</small></span>' +
        '</button>' +
        '<div class="tree-branch" ' + (isOpen ? "" : "hidden") + '>' + (unit.subunits || []).map(subunit => {
          const subunitTypes = unitTypes.filter(type => type.subunitId === subunit.id);
          if (!subunitTypes.length) return "";
          return '<section class="tree-subunit"><div class="tree-subunit-head"><span>소단원 ' + String(subunit.number).padStart(2, "0") + '</span><strong>' + escapeHtml(subunit.name) + '</strong></div>' + subunitTypes.map(typeTreeRow).join("") + '</section>';
        }).join("") + '</div>' +
      '</section>';
    }).join("");
    $("typeList").innerHTML = markup;
    $("catalogEmpty").hidden = visible.length > 0;
    renderSummary();
  }

  function ensurePreviewPopover() {
    if (previewPopover) return previewPopover;
    previewPopover = document.createElement("aside");
    previewPopover.id = "typePreviewPopover";
    previewPopover.className = "type-preview-popover";
    previewPopover.setAttribute("role", "region");
    previewPopover.setAttribute("aria-label", "선택한 유형 예시 미리보기");
    previewPopover.setAttribute("aria-live", "polite");
    previewPopover.hidden = true;
    previewPopover.addEventListener("click", event => {
      if (!event.target.closest("[data-close-type-preview]")) return;
      const anchor = previewAnchor;
      hideTypePreview(true);
      anchor?.focus();
    });
    document.querySelector(".selection-metrics").insertAdjacentElement("beforebegin", previewPopover);
    return previewPopover;
  }

  function placeTypePreview(anchor, popover) {
    if (matchMedia("(max-width: 700px)").matches) {
      anchor.insertAdjacentElement("afterend", popover);
      return;
    }
    document.querySelector(".selection-metrics").insertAdjacentElement("beforebegin", popover);
  }

  function showTypePreview(typeId, anchor) {
    if (previewAnchor === anchor && previewPopover && !previewPopover.hidden) {
      hideTypePreview(true);
      return;
    }
    const type = typeById.get(typeId);
    if (!type) return;
    const popover = ensurePreviewPopover();
    if (previewAnchor) {
      previewAnchor.classList.remove("is-previewing");
      previewAnchor.setAttribute("aria-expanded", "false");
    }
    previewAnchor = anchor;
    previewAnchor.classList.add("is-previewing");
    previewAnchor.setAttribute("aria-expanded", "true");
    const sourcePage = type.sourcePrintedPage !== undefined && type.sourcePrintedPage !== null && type.sourcePrintedPage !== ""
      ? ` · 교재 ${escapeHtml(type.sourcePrintedPage)}쪽`
      : "";
    const source = type.sourceItemLabel
      ? `원문 ${escapeHtml(type.sourceItemLabel)}${sourcePage}`
      : `${type.grade}학년 ${type.term}학기 분류`;
    const sourceLine = `<div class="type-preview-source"><b>유형 예시</b><small>대표 문제 · ${source}</small></div>`;
    const header = title => `<header><div>${title}</div><button type="button" class="type-preview-close" data-close-type-preview aria-label="미리보기 닫기">×</button></header>`;
    if (!type.generator || type.reviewLocked) {
      const reviewReason = type.reviewReason || "원문 구조와 정답을 더 확인해야 합니다.";
      popover.innerHTML = `${header(`<span>${type.grade}학년 ${type.term}학기 · ${escapeHtml(type.unitName)}</span><strong>${escapeHtml(typeDisplayName(type))}</strong>`)}${sourceLine}<footer>검수 대기 · ${escapeHtml(reviewReason)}</footer>`;
    } else {
      const generated = generatorApi.generate(type, currentLevel().rank, state.difficulty, hash(`preview:${type.id}`), type.variant ?? 0);
      if (!generated) return;
      popover.innerHTML = `${header(`<span>${type.grade}학년 ${type.term}학기 · ${escapeHtml(type.unitName)} · ${difficultyBandLabel(type)}</span><strong>${escapeHtml(typeDisplayName(type))}</strong>`)}${sourceLine}<div class="type-preview-question">${renderMathNotation(generated.prompt)}</div><footer>${escapeHtml(currentDifficultyLabel())} · 고정된 유형 예시</footer>`;
    }
    placeTypePreview(anchor, popover);
    popover.hidden = false;
    document.body.classList.add("is-type-preview-open");
  }

  function hideTypePreview() {
    if (previewPopover) previewPopover.hidden = true;
    if (previewAnchor) {
      previewAnchor.classList.remove("is-previewing");
      previewAnchor.setAttribute("aria-expanded", "false");
    }
    previewAnchor = null;
    document.body.classList.remove("is-type-preview-open");
  }

  function plannedQuestionTypes(selected, requestedCount = state.count) {
    const ready = selected.filter(type => type?.generator && !type.reviewLocked);
    const remaining = new Map(ready.map(type => [
      type.id,
      type.generationMode === "fixed-verified-pool"
        ? Math.max(0, Number(type.verifiedVariantCount) || 0)
        : Infinity
    ]));
    const planned = [];
    while (planned.length < requestedCount) {
      let added = false;
      for (const type of ready) {
        if (planned.length >= requestedCount) break;
        const count = remaining.get(type.id);
        if (count <= 0) continue;
        planned.push(type);
        if (Number.isFinite(count)) remaining.set(type.id, count - 1);
        added = true;
      }
      if (!added) break;
    }
    return planned;
  }

  function renderSummary() {
    const selected = [...state.selected].map(id => typeById.get(id)).filter(Boolean);
    const plannedCount = plannedQuestionTypes(selected).length;
    $("selectedTypeCount").textContent = selected.length;
    $("selectedQuestionCount").textContent = plannedCount;
    $("selectedTypeSummary").textContent = `${selected.length}개`;
    $("selectedQuestionSummary").textContent = `${plannedCount}문항`;
    $("generateButton").disabled = plannedCount === 0;
    $("selectedTypeList").innerHTML = selected.length ? selected.map(type =>
      '<div><span><b>' + escapeHtml(type.subunitName) + ' · ' + escapeHtml(typeDisplayName(type)) + '</b><small>' + type.grade + '학년 ' + type.term + '학기 · ' + type.unitNumber + '단원 ' + escapeHtml(type.unitName) + ' · ' + difficultyBandLabel(type) + (type.generationMode === "fixed-verified-pool" ? ' · 검증 문항 ' + type.verifiedVariantCount + '개' : '') + '</small></span>' +
      '<button type="button" data-remove-type="' + type.id + '" aria-label="' + escapeHtml(typeDisplayName(type)) + ' 선택 해제">×</button></div>'
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
    const selected = [...state.selected].map(id => typeById.get(id)).filter(type => type?.generator && !type.reviewLocked);
    if (!selected.length) return;
    const plannedTypes = plannedQuestionTypes(selected);
    if (!plannedTypes.length) return;
    state.generation += 1;
    const level = currentLevel();
    const baseSeed = (Date.now() + state.generation * 1000003) >>> 0;
    const seenPrompts = new Set();
    const seenAnswersByType = new Map();
    const seenPoolIndicesByType = new Map();
    state.questions = plannedTypes.map((type, index) => {
      const typeAnswers = seenAnswersByType.get(type.id) || new Set();
      const typePoolIndices = seenPoolIndicesByType.get(type.id) || new Set();
      let generated;
      let uniquePromptFallback;
      for (let attempt = 0; attempt < 32; attempt += 1) {
        const seed = (baseSeed + index * 7919 + attempt * 104729 + hash(type.id)) >>> 0;
        const candidate = generatorApi.generate(type, level.rank, state.difficulty, seed, index);
        if (!candidate || seenPrompts.has(candidate.prompt)) continue;
        if (candidate.generationMode === "fixed-verified-pool" && typePoolIndices.has(candidate.verifiedPoolIndex)) continue;
        uniquePromptFallback ||= candidate;
        if (!typeAnswers.has(String(candidate.answer))) {
          generated = candidate;
          break;
        }
      }
      generated ||= uniquePromptFallback || generatorApi.generate(type, level.rank, state.difficulty, (baseSeed + index * 7919 + hash(type.id)) >>> 0, index);
      if (generated.generationMode === "fixed-verified-pool") {
        if (!Number.isInteger(generated.verifiedPoolIndex) || typePoolIndices.has(generated.verifiedPoolIndex)) {
          throw new Error(`${typeDisplayName(type)}의 검증 문항 묶음이 중복되었습니다.`);
        }
        if (generated.verifiedVariantCount !== type.verifiedVariantCount) {
          throw new Error(`${typeDisplayName(type)}의 검증 문항 수가 분류표와 다릅니다.`);
        }
        typePoolIndices.add(generated.verifiedPoolIndex);
        seenPoolIndicesByType.set(type.id, typePoolIndices);
      }
      seenPrompts.add(generated.prompt);
      typeAnswers.add(String(generated.answer));
      seenAnswersByType.set(type.id, typeAnswers);
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

  function paginateProblems(questions) {
    const pages = [];
    let page = [];
    let weight = 0;
    questions.forEach(question => {
      const graphCount = (question.prompt.match(/class="graph-figure"/g) || []).length;
      const hasSource61VolumeE4 = question.prompt.includes("source61-volume-e4-diagram");
      const questionWeight = hasSource61VolumeE4 ? 6 : graphCount > 1 ? 6 : graphCount === 1 ? 3 : 1;
      if (page.length && weight + questionWeight > 6) {
        pages.push(page);
        page = [];
        weight = 0;
      }
      page.push(question);
      weight += questionWeight;
    });
    if (page.length) pages.push(page);
    return pages;
  }

  function renderProblems() {
    $("problemView").innerHTML = paginateProblems(state.questions).map((page, pageIndex) => `<section class="print-page${page.length === 1 ? " print-page--single" : ""}">
      <div class="page-label">문제 ${pageIndex + 1}</div>
      <div class="question-grid">${page.map(question => `<article id="question-${question.number}" class="question-item">
        <header><b>${question.number}</b><span>${question.type.grade}학년 ${question.type.term}학기 · ${escapeHtml(question.type.unitName)} · ${escapeHtml(typeDisplayName(question.type))}</span><em>${escapeHtml(question.difficulty)}</em></header>
        <div class="question-prompt">${renderMathNotation(question.prompt)}</div>
        <div class="answer-line">답</div>
      </article>`).join("")}</div>${watermark()}
    </section>`).join("");
  }

  function renderSolutions() {
    const solutionPages = [];
    let solutionPage = [];
    let solutionWeight = 0;
    state.questions.forEach(question => {
      const hasVisual = Boolean(question.answerVisual) || /<svg\b|class="(?:graph-figure|diagram-pair|source41-)/.test(question.solution || "");
      const weight = hasVisual ? 3 : 1;
      if (solutionPage.length && (solutionPage.length >= 8 || solutionWeight + weight > 8)) {
        solutionPages.push(solutionPage);
        solutionPage = [];
        solutionWeight = 0;
      }
      solutionPage.push(question);
      solutionWeight += weight;
    });
    if (solutionPage.length) solutionPages.push(solutionPage);
    $("solutionView").innerHTML = solutionPages.map((page, pageIndex) => `<section class="print-page answer-page">
      <div class="page-label">정답·풀이 ${pageIndex + 1}</div>
      <div class="solution-list">${page.map(question => `<article class="solution-item">
        <header><b>${question.number}</b><span>${escapeHtml(typeDisplayName(question.type))}</span><strong>${renderMathNotation(escapeHtml(question.answer))}</strong></header>
        ${question.answerVisual ? `<div class="solution-answer-visual" aria-label="정답 그림">${renderMathNotation(question.answerVisual)}</div>` : ""}
        <p>${renderMathNotation(question.solution)}</p>
      </article>`).join("")}</div>${watermark()}
    </section>`).join("");
  }

  function renderWorksheet() {
    const student = $("studentNameInput").value.trim();
    const selected = [...state.selected].map(id => typeById.get(id)).filter(Boolean);
    $("worksheetStudent").textContent = student;
    $("worksheetTitle").textContent = state.view === "problem" ? "맞춤 유사문제" : "맞춤 유사문제 정답·풀이";
    $("worksheetMeta").textContent = `심화 문제은행 · ${currentDifficultyLabel()} · ${state.questions.length}문항 · ${state.selected.size}개 유형`;
    $("problemView").hidden = state.view !== "problem";
    $("solutionView").hidden = state.view !== "solution";
    $("problemTab").classList.toggle("is-active", state.view === "problem");
    $("solutionTab").classList.toggle("is-active", state.view === "solution");
    $("problemTab").setAttribute("aria-selected", state.view === "problem" ? "true" : "false");
    $("solutionTab").setAttribute("aria-selected", state.view === "solution" ? "true" : "false");
    $("reviewStageMeta").textContent = `${state.questions.length}문항 · ${selected.length}개 유형`;
    $("reviewSelectedTypes").innerHTML = selected.map(type =>
      `<div><strong>${escapeHtml(typeDisplayName(type))}</strong><span>${type.unitNumber}단원 · ${escapeHtml(type.unitName)}</span></div>`
    ).join("");
    $("reviewQuestionList").innerHTML = state.questions.map(question =>
      `<a href="#question-${question.number}"><b>${question.number}</b><span>${escapeHtml(typeDisplayName(question.type))}</span></a>`
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
  $("typeList").addEventListener("click", event => {
    if (event.target.closest("#typePreviewPopover") || event.target.closest("input[data-type-id]")) return;
    const row = event.target.closest("[data-preview-type-id]");
    if (!row) return;
    event.preventDefault();
    showTypePreview(row.dataset.previewTypeId, row);
  });
  $("typeList").addEventListener("keydown", event => {
    if (!['Enter', ' '].includes(event.key) || event.target.matches("input[data-type-id]")) return;
    const row = event.target.closest("[data-preview-type-id]");
    if (!row) return;
    event.preventDefault();
    showTypePreview(row.dataset.previewTypeId, row);
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
  $("mobileSettingsButton").addEventListener("click", () => {
    $("workspacePanel").scrollIntoView({ behavior: "auto", block: "start" });
  });
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
  $("studentNameInput").addEventListener("input", () => { if (state.questions.length) renderWorksheet(); });
  addEventListener("keydown", event => { if (event.key === "Escape") hideTypePreview(true); });

  const params = new URLSearchParams(location.search);
  const requestedDifficulty = Number(params.get("difficulty"));
  if ([-1, 0, 1].includes(requestedDifficulty)) state.difficulty = requestedDifficulty;
  const identity = identityApi.resolve({
    session: window.HSELEMENTARY_SESSION || window.GFIELD_SESSION,
    access: window.HSELEMENTARY_ACCESS,
    localStorage,
    sessionStorage,
    search: location.search
  });
  const studentNameInput = $("studentNameInput");
  studentNameInput.value = identity.name;
  studentNameInput.readOnly = !identity.canEditName;
  studentNameInput.setAttribute("aria-readonly", identity.canEditName ? "false" : "true");
  studentNameInput.dataset.identitySource = identity.source || "none";
  studentNameInput.dataset.nameEditPermission = identity.canEditName ? "granted" : "locked";
  studentNameInput.title = identity.canEditName ? "관리자가 학생 이름 변경을 허용했습니다." : "로그인한 이름이 자동으로 적용됩니다.";
  const reviewType = typeById.get(params.get("type"));
  if (reviewType?.generator && !reviewType.reviewLocked) {
    state.level = "simwha";
    state.grade = reviewType.grade;
    state.term = reviewType.term;
    state.unitId = reviewType.unitId;
    state.selected.add(reviewType.id);
    state.count = 3;
    $("questionCountInput").value = "3";
    refreshSegments("gradeFilter", "grade", state.grade);
    refreshSegments("termFilter", "term", state.term);
    refreshSegments("difficultyFilter", "difficulty", state.difficulty);
  }
  ensurePreviewPopover();
  renderUnitOptions();
  renderCatalog();
  if (reviewType?.generator && !reviewType.reviewLocked && params.get("review") === "1") buildQuestions();
})();
