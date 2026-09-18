(() => {
  const curriculum = window.HSE_CURRICULUM;
  const generatorApi = window.HSE_GENERATORS;
  const mathNotation = window.HSE_MATH_NOTATION;
  const identityApi = window.HSE_IDENTITY;
  const geometryLayout = window.GFieldGeometryLayout;
  if (!curriculum || !generatorApi || !mathNotation || !identityApi || !geometryLayout) throw new Error("초등 문제은행 데이터를 불러오지 못했습니다.");

  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const hash = (value) => [...value].reduce((sum, character) => Math.imul(sum ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
  const MAX_QUESTION_COUNT = 120;
  const DIFFICULTY_LEVELS = [-1, 0, 1];
  const typeDisplayName = type => type.label && type.label !== "핵심 유형" ? type.label : type.name;
  const difficultyBandLabel = type => ({ "-1": "심화 쉬움", "0": "심화 기준", "1": "심화 어려움" })[String(type.difficultyBand)] || "심화 기준";
  const difficultyLevelLabel = value => ({ "-1": "조금 쉬운", "0": "같은 난이도", "1": "조금 어려운" })[String(value)] || "같은 난이도";
  const contentDomainBySemester = {
    "4-1": ["", "수와 연산", "도형과 측정", "수와 연산", "도형과 측정", "자료와 가능성", "변화와 관계"],
    "4-2": ["", "수와 연산", "도형과 측정", "수와 연산", "도형과 측정", "자료와 가능성", "도형과 측정"],
    "5-1": ["", "수와 연산", "수와 연산", "변화와 관계", "수와 연산", "수와 연산", "도형과 측정"],
    "5-2": ["", "수와 연산", "수와 연산", "도형과 측정", "수와 연산", "도형과 측정", "자료와 가능성"],
    "6-1": ["", "수와 연산", "도형과 측정", "수와 연산", "변화와 관계", "자료와 가능성", "도형과 측정"],
    "6-2": ["", "수와 연산", "수와 연산", "도형과 측정", "변화와 관계", "도형과 측정", "도형과 측정"]
  };
  const contentDomainLabel = type => contentDomainBySemester[type.semesterId]?.[Number(type.unitNumber)] || "확인 필요";
  const reasoningStageLabel = type => ({ exploration: "이해", example: "적용", mission: "추론" })[type.sourceSection]
    || (Number(type.difficultyBand) < 0 ? "이해" : Number(type.difficultyBand) > 0 ? "추론" : "적용");

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
    difficultyMode: "count",
    difficultyMix: { "-1": 0, "0": 12, "1": 0 },
    difficultyRatios: { "-1": 20, "0": 60, "1": 20 },
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
    const active = DIFFICULTY_LEVELS.filter(value => Number(state.difficultyMix[String(value)] || 0) > 0);
    return active.length === 1 ? difficultyLevelLabel(active[0]) : "난이도 혼합";
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
    const semesterReady = semester ? readyTypesForScope("semester", semester.id) : [];
    const semesterScope = semester ? `<section class="tree-semester-scope">${scopeCheckboxMarkup("semester", semester.id, `${semester.grade}학년 ${semester.term}학기`, semesterReady)}<span><strong>${semester.grade}학년 ${semester.term}학기 전체</strong><small>${semesterReady.length}개 공개 유형에서 단원별로 고르게 구성</small></span><em>최대 120문제</em></section>` : "";
    const unitMarkup = (semester?.units || []).map(unit => {
      const unitTypes = visible.filter(type => type.unitId === unit.id);
      if (!unitTypes.length) return "";
      const isOpen = !state.collapsedUnits.has(unit.id);
      const unitReady = readyTypesForScope("unit", unit.id);
      const readyCount = unitReady.length;
      return '<section class="tree-unit ' + (isOpen ? "is-open" : "") + '">' +
        '<div class="tree-unit-head">' + scopeCheckboxMarkup("unit", unit.id, `${unit.number}단원 ${unit.name}`, unitReady) +
          '<button class="tree-unit-toggle" type="button" data-tree-unit="' + unit.id + '" aria-expanded="' + isOpen + '">' +
            '<span class="tree-chevron" aria-hidden="true">›</span><span class="tree-unit-number">' + unit.number + '</span>' +
            '<span class="tree-unit-copy"><strong>' + escapeHtml(unit.name) + '</strong><small>' + readyCount + '개 유형 생성 가능</small></span>' +
          '</button>' +
        '</div>' +
        '<div class="tree-branch" ' + (isOpen ? "" : "hidden") + '>' + (unit.subunits || []).map(subunit => {
          const subunitTypes = unitTypes.filter(type => type.subunitId === subunit.id);
          if (!subunitTypes.length) return "";
          const subunitReady = readyTypesForScope("subunit", subunit.id);
          return '<section class="tree-subunit"><div class="tree-subunit-head">' + scopeCheckboxMarkup("subunit", subunit.id, `소단원 ${subunit.number} ${subunit.name}`, subunitReady) + '<span>소단원 ' + String(subunit.number).padStart(2, "0") + '</span><strong>' + escapeHtml(subunit.name) + '</strong><small>' + subunitReady.length + '개</small></div>' + subunitTypes.map(typeTreeRow).join("") + '</section>';
        }).join("") + '</div>' +
      '</section>';
    }).join("");
    $("typeList").innerHTML = semesterScope + unitMarkup;
    $("typeList").querySelectorAll('input[data-select-scope][data-partial="true"]').forEach(input => { input.indeterminate = true; });
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
      popover.innerHTML = `${header(`<span>${type.grade}학년 ${type.term}학기 · ${escapeHtml(type.unitName)} · ${difficultyBandLabel(type)}</span><strong>${escapeHtml(typeDisplayName(type))}</strong>`)}${sourceLine}<div class="type-preview-question">${renderMathNotation(generated.prompt)}</div><footer>${escapeHtml(difficultyLevelLabel(state.difficulty))} · 고정된 유형 예시</footer>`;
    }
    placeTypePreview(anchor, popover);
    popover.hidden = false;
    geometryLayout.apply(popover);
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

  function readyTypesForScope(scope, id) {
    const semester = currentSemester();
    if (!semester) return [];
    return types.filter(type => {
      if (type.semesterId !== semester.id || !type.generator || type.reviewLocked) return false;
      if (scope === "unit") return type.unitId === id;
      if (scope === "subunit") return type.subunitId === id;
      return scope === "semester";
    });
  }

  function scopeSelectionState(candidates) {
    const selectedCount = candidates.filter(type => state.selected.has(type.id)).length;
    return {
      checked: Boolean(candidates.length) && selectedCount === candidates.length,
      partial: selectedCount > 0 && selectedCount < candidates.length
    };
  }

  function scopeCheckboxMarkup(scope, id, label, candidates) {
    const selection = scopeSelectionState(candidates);
    return `<label class="tree-scope-control"><input type="checkbox" data-select-scope="${scope}" data-scope-id="${id}" data-partial="${selection.partial}" ${selection.checked ? "checked" : ""}><span class="sr-only">${escapeHtml(label)} 전체 선택</span></label>`;
  }

  function interleaveTypeGroups(values, key, batchSize = 1) {
    const groups = [];
    const groupByKey = new Map();
    values.forEach(value => {
      const groupKey = key(value);
      if (!groupByKey.has(groupKey)) {
        const group = [];
        groupByKey.set(groupKey, group);
        groups.push(group);
      }
      groupByKey.get(groupKey).push(value);
    });
    const output = [];
    while (groups.some(group => group.length)) groups.forEach(group => {
      for (let index = 0; index < batchSize && group.length; index += 1) output.push(group.shift());
    });
    return output;
  }

  function balancedTypeOrder(values) {
    const units = [];
    const unitGroups = new Map();
    values.forEach(type => {
      if (!unitGroups.has(type.unitId)) {
        const group = [];
        unitGroups.set(type.unitId, group);
        units.push(group);
      }
      unitGroups.get(type.unitId).push(type);
    });
    const balancedUnits = units.map(unitTypes => interleaveTypeGroups(unitTypes, type => type.subunitId, 2));
    const output = [];
    while (balancedUnits.some(group => group.length)) balancedUnits.forEach(group => {
      if (group.length) output.push(group.shift());
    });
    return output;
  }

  function plannedQuestionTypes(selected, requestedCount = state.count) {
    const ready = balancedTypeOrder(selected.filter(type => type?.generator && !type.reviewLocked));
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

  function difficultyMixTotal() {
    return DIFFICULTY_LEVELS.reduce((total, value) => total + Number(state.difficultyMix[String(value)] || 0), 0);
  }

  function difficultyRatioTotal() {
    return DIFFICULTY_LEVELS.reduce((total, value) => total + Number(state.difficultyRatios[String(value)] || 0), 0);
  }

  function ratioDifficultyMix(count = state.count) {
    const priority = new Map([[0, 0], [-1, 1], [1, 2]]);
    const portions = DIFFICULTY_LEVELS.map(value => {
      const exact = count * Number(state.difficultyRatios[String(value)] || 0) / 100;
      return { value, count: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });
    let remaining = count - portions.reduce((total, portion) => total + portion.count, 0);
    [...portions].sort((a, b) => b.remainder - a.remainder || priority.get(a.value) - priority.get(b.value)).forEach(portion => {
      if (remaining > 0) {
        portion.count += 1;
        remaining -= 1;
      }
    });
    return Object.fromEntries(portions.map(portion => [String(portion.value), portion.count]));
  }

  function difficultyRatioIsValid() {
    return difficultyRatioTotal() === 100;
  }

  function syncDifficultyMixControls() {
    document.querySelectorAll("input[data-difficulty-count]").forEach(input => {
      input.value = String(state.difficultyMix[input.dataset.difficultyCount] || 0);
    });
    document.querySelectorAll("input[data-difficulty-ratio]").forEach(input => {
      input.value = String(state.difficultyRatios[input.dataset.difficultyRatio] || 0);
      input.setAttribute("aria-invalid", difficultyRatioIsValid() ? "false" : "true");
    });
    $("difficultyCountTotal").textContent = `${difficultyMixTotal()}문제`;
    $("difficultyRatioTotal").textContent = `${difficultyRatioTotal()}%`;
    $("difficultyRatioTotal").classList.toggle("is-invalid", !difficultyRatioIsValid());
    $("difficultyRatioError").hidden = state.difficultyMode !== "ratio" || difficultyRatioIsValid();
    $("difficultyRatioResult").hidden = state.difficultyMode !== "ratio" || !difficultyRatioIsValid();
    if (difficultyRatioIsValid()) {
      const mix = ratioDifficultyMix();
      $("difficultyRatioResult").textContent = `${state.count}문제 기준 · 조금 쉬운 ${mix["-1"]} · 같은 난이도 ${mix["0"]} · 조금 어려운 ${mix["1"]}`;
    }
  }

  function syncDifficultyModeControls() {
    document.querySelectorAll("[data-difficulty-mode]").forEach(button => {
      const active = button.dataset.difficultyMode === state.difficultyMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    document.querySelectorAll("[data-difficulty-panel]").forEach(panel => {
      panel.hidden = panel.dataset.difficultyPanel !== state.difficultyMode;
    });
  }

  function applyDifficultyRatios() {
    if (!difficultyRatioIsValid()) return false;
    state.difficultyMix = ratioDifficultyMix();
    syncDifficultyMixControls();
    return true;
  }

  function resetDifficultyMix(count = state.count, difficulty = state.difficulty) {
    state.difficultyMix = { "-1": 0, "0": 0, "1": 0 };
    state.difficultyMix[String(difficulty)] = count;
    syncDifficultyMixControls();
  }

  function difficultyPlan() {
    return DIFFICULTY_LEVELS.flatMap(value => Array.from({ length: Number(state.difficultyMix[String(value)] || 0) }, () => value));
  }

  function setDifficultyCount(difficulty, value) {
    const key = String(difficulty);
    const otherTotal = DIFFICULTY_LEVELS.filter(item => String(item) !== key).reduce((total, item) => total + Number(state.difficultyMix[String(item)] || 0), 0);
    state.difficultyMix[key] = Math.max(0, Math.min(MAX_QUESTION_COUNT - otherTotal, Number.isFinite(value) ? Math.floor(value) : 0));
    state.count = difficultyMixTotal();
    $("questionCountInput").value = String(state.count);
    document.querySelectorAll("[data-count]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.count) === state.count);
    });
    syncDifficultyMixControls();
    renderSummary();
  }

  function setDifficultyRatio(difficulty, value) {
    state.difficultyRatios[String(difficulty)] = Math.max(0, Math.min(100, Number.isFinite(value) ? Math.floor(value) : 0));
    if (difficultyRatioIsValid()) applyDifficultyRatios(); else syncDifficultyMixControls();
    renderSummary();
  }

  function setDifficultyMode(mode) {
    state.difficultyMode = mode === "ratio" ? "ratio" : "count";
    syncDifficultyModeControls();
    if (state.difficultyMode === "ratio" && difficultyRatioIsValid()) applyDifficultyRatios(); else syncDifficultyMixControls();
    renderSummary();
  }

  function renderSummary() {
    const selected = [...state.selected].map(id => typeById.get(id)).filter(Boolean);
    const plannedCount = plannedQuestionTypes(selected).length;
    $("selectedTypeCount").textContent = selected.length;
    $("selectedQuestionCount").textContent = plannedCount;
    $("selectedTypeSummary").textContent = `${selected.length}개`;
    $("selectedQuestionSummary").textContent = `${plannedCount}문항`;
    $("difficultyCountTotal").textContent = `${difficultyMixTotal()}문제`;
    $("generateButton").disabled = plannedCount === 0 || (state.difficultyMode === "ratio" && !difficultyRatioIsValid());
    $("selectedTypeList").innerHTML = selected.length ? selected.map(type =>
      '<div><span><b>' + escapeHtml(type.subunitName) + ' · ' + escapeHtml(typeDisplayName(type)) + '</b><small>' + type.grade + '학년 ' + type.term + '학기 · ' + type.unitNumber + '단원 ' + escapeHtml(type.unitName) + ' · ' + difficultyBandLabel(type) + (type.generationMode === "fixed-verified-pool" ? ' · 검증 문항 ' + type.verifiedVariantCount + '개' : '') + '</small></span>' +
      '<button type="button" data-remove-type="' + type.id + '" aria-label="' + escapeHtml(typeDisplayName(type)) + ' 선택 해제">×</button></div>'
    ).join("") : '<p>왼쪽 교육과정 트리에서 유형을 선택하세요.</p>';
  }

  function setQuestionCount(value) {
    state.count = Math.max(1, Math.min(MAX_QUESTION_COUNT, Number.isFinite(value) ? Math.floor(value) : 12));
    if (state.difficultyMode === "ratio") applyDifficultyRatios(); else resetDifficultyMix(state.count, state.difficulty);
    $("questionCountInput").value = String(state.count);
    document.querySelectorAll("[data-count]").forEach(button => {
      button.classList.toggle("is-active", Number(button.dataset.count) === state.count);
    });
    renderSummary();
  }

  function withGrade4AngleAnswerVisual(type, generated) {
    if (generated.answerVisual || type.grade !== 4 || type.term !== 1 || type.unitNumber !== 2) return generated;
    const diagrams = [...String(generated.prompt || "").matchAll(/<svg\b[\s\S]*?<\/svg>/gi)]
      .map(match => match[0])
      .filter(svg => /class="[^"]*\bsource41-[^"]*"/i.test(svg));
    if (!diagrams.length) return generated;
    return {
      ...generated,
      answerVisual: `<div class="source41-angle-answer-figure" data-source-item-id="${escapeHtml(type.sourceItemId || "")}">${diagrams.join("")}<div class="solution-answer-caption">같은 그림에서 확인한 정답 ${escapeHtml(generated.answer)}</div></div>`
    };
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
      } else if (stateKey === "difficulty") {
        state.difficultyMode = "count";
        syncDifficultyModeControls();
        resetDifficultyMix(state.count || 12, state.difficulty);
        renderSummary();
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
    const plannedDifficulties = difficultyPlan();
    const baseSeed = (Date.now() + state.generation * 1000003) >>> 0;
    const seenPrompts = new Set();
    const seenAnswersByType = new Map();
    const seenPoolIndicesByType = new Map();
    state.questions = plannedTypes.map((type, index) => {
      const variationDifficulty = plannedDifficulties[index] ?? state.difficulty;
      const typeAnswers = seenAnswersByType.get(type.id) || new Set();
      const typePoolIndices = seenPoolIndicesByType.get(type.id) || new Set();
      let generated;
      let uniquePromptFallback;
      for (let attempt = 0; attempt < 32; attempt += 1) {
        const seed = (baseSeed + index * 7919 + attempt * 104729 + hash(type.id)) >>> 0;
        const candidate = generatorApi.generate(type, level.rank, variationDifficulty, seed, index);
        if (!candidate || seenPrompts.has(candidate.prompt)) continue;
        if (candidate.generationMode === "fixed-verified-pool" && typePoolIndices.has(candidate.verifiedPoolIndex)) continue;
        uniquePromptFallback ||= candidate;
        if (!typeAnswers.has(String(candidate.answer))) {
          generated = candidate;
          break;
        }
      }
      generated ||= uniquePromptFallback || generatorApi.generate(type, level.rank, variationDifficulty, (baseSeed + index * 7919 + hash(type.id)) >>> 0, index);
      generated = withGrade4AngleAnswerVisual(type, generated);
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
      return { number: index + 1, type, level, difficulty: difficultyLevelLabel(variationDifficulty), difficultyLevel: variationDifficulty, ...generated };
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

  function typographicPrintWeight(question) {
    const prompt = String(question?.prompt || "");
    const fractionCount = (prompt.match(/class="math-fraction"/g) || []).length;
    const equations = [...prompt.matchAll(/class="[^"]*equation[^"]*"[^>]*>([\s\S]*?)<\/div>/g)]
      .map(match => match[1].replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ").trim());
    const equationLoad = equations.reduce((maximum, equation) => Math.max(maximum, equation.length + (equation.match(/[+\-×÷=<>]/g) || []).length * 8), 0);
    if (fractionCount >= 7 || equationLoad >= 118 || equations.some(equation => equation.includes("↔"))) return 3;
    if (fractionCount >= 3 || equationLoad >= 72) return 2;
    return 1;
  }

  function usesFullPrintRow(question) {
    const prompt = String(question?.prompt || "");
    return /class="[^"]*(?:source41-bar-pair|source41-bar-table-wrap|source41-horizontal-bar-graph)[^"]*"/.test(prompt)
      || /class="[^"]*\bequation\b[^"]*\bexpanded\b[^"]*"/.test(prompt);
  }

  function problemWeight(question) {
    const prompt = String(question?.prompt || "");
    const graphCount = (prompt.match(/class="graph-figure"/g) || []).length;
    const hasWorksheetVisual = /<svg\b|class="[^"]*(?:geometry-diagram|bar-chart|line-chart|diagram-pair)[^"]*"/.test(prompt);
    const hasSource61VolumeE4 = prompt.includes("source61-volume-e4-diagram");
    const hasSource61E2Example2 = prompt.includes("source61-e2ex2-diagram");
    const hasSource61E2Example4 = prompt.includes("source61-e2ex4-diagram");
    const hasSource61E2Mission6 = prompt.includes("source61-e2m6-diagram");
    const hasSource61E4Example1 = prompt.includes("source61-e4ex1-diagram");
    const hasSource42ParallelAngle = prompt.includes("source42-pa");
    return hasSource61VolumeE4 || hasSource61E2Example2 || hasSource61E2Example4 || hasSource61E2Mission6 || hasSource61E4Example1 || graphCount > 1
      ? 6
      : hasSource42ParallelAngle || graphCount === 1 || hasWorksheetVisual
        ? 3
        : typographicPrintWeight(question);
  }

  function paginateWeightedProblems(questions) {
    const pages = [];
    let page = [];
    let pageHeight = 0;
    const flushPage = () => {
      if (page.length) pages.push(page);
      page = [];
      pageHeight = 0;
    };
    for (let index = 0; index < questions.length;) {
      const question = questions[index];
      const questionWeight = problemWeight(question);
      if (questionWeight >= 6) {
        flushPage();
        pages.push([question]);
        index += 1;
        continue;
      }
      const row = [question];
      const next = questions[index + 1];
      if (!usesFullPrintRow(question) && next && problemWeight(next) < 6 && !usesFullPrintRow(next)) row.push(next);
      const rowHeight = Math.max(...row.map(problemWeight));
      if (page.length && pageHeight + rowHeight > 3) flushPage();
      page.push(...row);
      pageHeight += rowHeight;
      index += row.length;
    }
    flushPage();
    return pages;
  }

  function paginateProblems(questions) {
    const isParallelAngle = question => question.prompt.includes("source42-pa");
    if (!questions.some(isParallelAngle)) {
      return paginateWeightedProblems(questions).map(page => ({ questions: page, paired: false }));
    }
    const pages = [];
    let page = [];
    let height = 0;
    const flushPage = () => {
      if (!page.length) return;
      pages.push({ questions: page, paired: true });
      page = [];
      height = 0;
    };

    for (let index = 0; index < questions.length;) {
      const question = questions[index];
      if (problemWeight(question) >= 6) {
        flushPage();
        pages.push({ questions: [question], paired: false });
        index += 1;
        continue;
      }

      const row = [question];
      const next = questions[index + 1];
      if (next && problemWeight(next) < 6) row.push(next);
      const rowHeight = row.some(item => problemWeight(item) >= 3) ? 2 : 1;
      if (page.length && height + rowHeight > 3) flushPage();
      page.push(...row);
      height += rowHeight;
      index += row.length;
    }
    flushPage();
    return pages;
  }

  function renderProblems() {
    $("problemView").innerHTML = paginateProblems(state.questions).map(({ questions: page, paired }, pageIndex) => `<section class="print-page${paired ? " print-page--paired" : page.length === 1 ? " print-page--single" : ""}" data-question-count="${page.length}">
      <div class="page-label">문제 ${pageIndex + 1}</div>
      <div class="question-grid">${page.map(question => `<article id="question-${question.number}" class="question-item" data-type-id="${escapeHtml(question.type.id)}" data-source-item-id="${escapeHtml(question.type.sourceItemId || "")}" data-print-weight="${problemWeight(question)}">
        <header><b>${question.number}</b><span>${question.type.grade}학년 ${question.type.term}학기 · ${escapeHtml(question.type.unitName)} · ${escapeHtml(typeDisplayName(question.type))}</span><em>${escapeHtml(question.difficulty)}</em></header>
        <div class="question-prompt">${renderMathNotation(question.prompt)}</div>
        <div class="answer-line">답</div>
      </article>`).join("")}</div>${watermark()}
    </section>`).join("");
  }

  function classificationNumberList(questions) {
    return questions.length ? questions.map(question => question.number).join(", ") : "-";
  }

  function renderClassificationPages() {
    const domains = ["수와 연산", "변화와 관계", "도형과 측정", "자료와 가능성"];
    const stages = ["이해", "적용", "추론"];
    const difficultyRows = [-1, 0, 1].map(level => {
      const matching = state.questions.filter(question => Number(question.difficultyLevel) === level);
      return `<tr><th scope="row">${difficultyLevelLabel(level)}</th><td>${classificationNumberList(matching)}</td><td>${matching.length}</td></tr>`;
    }).join("");
    const matrixRows = domains.map(domain => {
      const domainQuestions = state.questions.filter(question => contentDomainLabel(question.type) === domain);
      const stageCells = stages.map(stage => `<td>${classificationNumberList(domainQuestions.filter(question => reasoningStageLabel(question.type) === stage))}</td>`).join("");
      return `<tr><th scope="row">${domain}</th>${stageCells}<td>${domainQuestions.length}</td></tr>`;
    }).join("");
    const semesters = [...new Set(state.questions.map(question => question.type.semesterLabel || `${question.type.grade}-${question.type.term}`))].join(" · ");
    const summaryPage = `<section class="print-page answer-page classification-page">
      <div class="page-label">이원목적분류표</div>
      <div class="classification-meta"><strong>${escapeHtml(semesters)}</strong><span>${state.questions.length}문항 · 변형 단계 ${escapeHtml(currentDifficultyLabel())}</span></div>
      <div class="classification-table-wrap"><table class="classification-table classification-matrix"><caption>내용 영역과 생각 단계 · 원문 개념탐구/예제/Mission 기준</caption><thead><tr><th scope="col">내용 영역</th>${stages.map(stage => `<th scope="col">${stage}</th>`).join("")}<th scope="col">합계</th></tr></thead><tbody>${matrixRows}</tbody></table></div>
      <div class="classification-table-wrap"><table class="classification-table classification-difficulty"><caption>선택한 변형 난이도</caption><thead><tr><th scope="col">난이도</th><th scope="col">문항 번호</th><th scope="col">문항 수</th></tr></thead><tbody>${difficultyRows}</tbody></table></div>
      ${watermark()}
    </section>`;
    const detailPages = chunk(state.questions, 18).map((questions, pageIndex, pages) => `<section class="print-page answer-page classification-page classification-detail-page">
      <div class="page-label">문항별 분류 ${pageIndex + 1}/${pages.length}</div>
      <div class="classification-table-wrap"><table class="classification-table classification-detail"><caption>문항별 단원·유형·난이도</caption><thead><tr><th scope="col">번호</th><th scope="col">학기</th><th scope="col">단원·소단원</th><th scope="col">유형</th><th scope="col">내용 영역</th><th scope="col">생각 단계</th><th scope="col">난이도</th></tr></thead><tbody>${questions.map(question => `<tr><td data-label="번호">${question.number}</td><td data-label="학기">${question.type.grade}-${question.type.term}</td><td data-label="단원·소단원"><b>${question.type.unitNumber}. ${escapeHtml(question.type.unitName)}</b><small>${escapeHtml(question.type.subunitName)}</small></td><td data-label="유형">${escapeHtml(typeDisplayName(question.type))}</td><td data-label="내용 영역">${contentDomainLabel(question.type)}</td><td data-label="생각 단계">${reasoningStageLabel(question.type)}</td><td data-label="난이도"><b>${escapeHtml(question.difficulty)}</b><small>원문 ${difficultyBandLabel(question.type)}</small></td></tr>`).join("")}</tbody></table></div>
      ${watermark()}
    </section>`).join("");
    return summaryPage + detailPages;
  }

  function renderSolutions() {
    const solutionPages = [];
    let solutionPage = [];
    let solutionWeight = 0;
    state.questions.forEach(question => {
      const hasVisual = Boolean(question.answerVisual) || /<svg\b|class="(?:graph-figure|diagram-pair|source41-)/.test(question.solution || "");
      const hasSource61E2Example2 = String(question.answerVisual || "").includes("source61-e2ex2-diagram");
      const hasSource61E2Example4 = String(question.answerVisual || "").includes("source61-e2ex4-diagram");
      const hasSource61E2Mission6 = String(question.answerVisual || "").includes("source61-e2m6-diagram");
      const hasSource61E4Example1 = String(question.answerVisual || "").includes("source61-e4ex1-diagram");
      const weight = hasSource61E2Example2 || hasSource61E2Example4 || hasSource61E2Mission6 || hasSource61E4Example1 ? 8 : hasVisual ? 3 : 1;
      if (solutionPage.length && (solutionPage.length >= 8 || solutionWeight + weight > 8)) {
        solutionPages.push(solutionPage);
        solutionPage = [];
        solutionWeight = 0;
      }
      solutionPage.push(question);
      solutionWeight += weight;
    });
    if (solutionPage.length) solutionPages.push(solutionPage);
    $("solutionView").innerHTML = renderClassificationPages() + solutionPages.map((page, pageIndex) => `<section class="print-page answer-page">
      <div class="page-label">정답·풀이 ${pageIndex + 1}</div>
      <div class="solution-list">${page.map(question => `<article class="solution-item" data-type-id="${escapeHtml(question.type.id)}" data-source-item-id="${escapeHtml(question.type.sourceItemId || "")}">
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
    geometryLayout.apply($(state.view === "problem" ? "problemView" : "solutionView"));
  }

  bindSegment("gradeFilter", "grade", "grade", Number);
  bindSegment("termFilter", "term", "term", Number);
  bindSegment("difficultyFilter", "difficulty", "difficulty", Number);

  $("unitFilter").addEventListener("change", event => { state.unitId = event.target.value; renderCatalog(); });
  $("typeSearchInput").addEventListener("input", event => { state.search = event.target.value; renderCatalog(); });
  $("questionCountInput").addEventListener("input", event => {
    setQuestionCount(Number(event.target.value));
  });
  $("difficultyCountMix").addEventListener("input", event => {
    const input = event.target.closest("input[data-difficulty-count]");
    if (!input) return;
    setDifficultyCount(Number(input.dataset.difficultyCount), Number(input.value));
  });
  $("difficultyRatioMix").addEventListener("input", event => {
    const input = event.target.closest("input[data-difficulty-ratio]");
    if (!input) return;
    setDifficultyRatio(Number(input.dataset.difficultyRatio), Number(input.value));
  });
  $("difficultyMode").addEventListener("click", event => {
    const button = event.target.closest("button[data-difficulty-mode]");
    if (!button) return;
    setDifficultyMode(button.dataset.difficultyMode);
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
    const scopeInput = event.target.closest("input[data-select-scope]");
    if (scopeInput) {
      const candidates = readyTypesForScope(scopeInput.dataset.selectScope, scopeInput.dataset.scopeId);
      if (scopeInput.checked && scopeInput.dataset.selectScope === "semester") state.selected.clear();
      candidates.forEach(type => {
        if (scopeInput.checked) state.selected.add(type.id); else state.selected.delete(type.id);
      });
      renderCatalog();
      return;
    }
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
  if ([-1, 0, 1].includes(requestedDifficulty)) {
    state.difficulty = requestedDifficulty;
    resetDifficultyMix(state.count, state.difficulty);
  }
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
    resetDifficultyMix(3, state.difficulty);
    $("questionCountInput").value = "3";
    refreshSegments("gradeFilter", "grade", state.grade);
    refreshSegments("termFilter", "term", state.term);
    refreshSegments("difficultyFilter", "difficulty", state.difficulty);
  }
  ensurePreviewPopover();
  syncDifficultyModeControls();
  syncDifficultyMixControls();
  renderUnitOptions();
  renderCatalog();
  if (reviewType?.generator && !reviewType.reviewLocked && params.get("review") === "1") buildQuestions();
})();
