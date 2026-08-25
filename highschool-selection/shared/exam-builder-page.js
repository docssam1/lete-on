(function (root) {
  "use strict";

  const core = root.HIGHSELECT_EXAM_EDITOR_CORE;
  const outputs = root.HIGHSELECT_EXAM_OUTPUT_SETTINGS;
  const standards = root.HIGHSELECT_DEFAULT_EXAM_SETS;
  const wmInitial = root.HIGHSELECT_WM_MIDDLE21_BASIC_ENTRY_R01_BLUEPRINT;
  const wmDiagnostic = root.HIGHSELECT_WM_MIDDLE21_DIAGNOSTIC_METADATA;
  const bankCore = root.HIGHSELECT_QUESTION_BANK_CORE;
  if (!core || !outputs || !standards || !wmInitial || !wmDiagnostic || !bankCore) return;

  const dom = Object.fromEntries([
    "draft-state", "draft-title", "candidate-search", "candidate-list", "candidate-count",
    "placement-list", "draft-summary", "sort-mode", "view-mode", "round-select", "scope-dialog",
    "scope-options", "scope-reconcile", "builder-status", "print-preview", "preview-pages"
  ].map(function (id) { return [id, document.getElementById(id)]; }));
  const standard = standards.getStandard("WM-M21-BASIC-ENTRY-2026-07");
  const approvedCandidates = Array.isArray(root.HIGHSELECT_EXAM_EDITOR_CANDIDATES) ? root.HIGHSELECT_EXAM_EDITOR_CANDIDATES : [];
  const scopeKey = function (item) { return ["2022-revised", item.semester, item.majorUnit, item.minorUnit].join("/"); };

  function roundNumber(examId) {
    const match = String(examId || "").match(/r(\d{2})$/);
    return match ? Number(match[1]) : 1;
  }
  function roundBlueprint(examId) {
    const round = wmDiagnostic.rounds[examId];
    if (!round) throw new Error("대표 회차 정보를 찾을 수 없습니다.");
    return Object.freeze({
      blueprint: Object.freeze({ examId, scheduledWindowMinutes: wmInitial.blueprint.scheduledWindowMinutes }),
      items: Object.freeze(round.items.map(function (item) {
        return Object.freeze({
          id: item.id,
          number: item.number,
          sectionId: item.cutlineSectionId,
          semester: `${item.gradeBand}-${item.semester}`,
          majorUnit: item.majorUnit,
          minorUnit: item.minorUnit,
          typeId: item.detailTypeId,
          typeLabel: item.detailType,
          difficultyBand: item.difficulty,
          classificationStatus: item.classificationStatus
        });
      }))
    });
  }
  function metadataFor(round) {
    const result = Object.fromEntries(round.items.map(function (item) {
      return [item.id, {
        itemId: item.id, number: item.number, label: `${item.semester} · ${item.minorUnit}`,
        typeCode: item.typeId, typeLabel: item.typeLabel, difficultyBand: item.difficultyBand,
        inputType: "short_answer", curriculumPath: scopeKey(item), releaseStatus: "locked",
        classificationStatus: item.classificationStatus, answerStatus: "verified", figureRequired: item.sectionId === "GEO",
        figureStatus: item.sectionId === "GEO" ? "pending" : "not_required", relationship: "manual"
      }];
    }));
    approvedCandidates.forEach(function (item) { result[item.itemId] = item; });
    return result;
  }
  function createRoundDraft(round) {
    return core.createDraft({
      draftId: `${round.blueprint.examId}-draft`, profileId: standard.programCode,
      targetId: round.blueprint.examId, durationMinutes: round.blueprint.scheduledWindowMinutes,
      scopeKeys: Array.from(new Set(round.items.map(scopeKey))),
      placements: round.items.map(function (item) { return { placementId: `place-${String(item.number).padStart(2, "0")}`, itemId: item.id, score: 1, selectionKind: "recommended" }; })
    });
  }

  let candidateFilter = "all";
  let dragPlacementId = null;
  let dragCandidateId = null;
  let pendingReplacementId = null;
  let revision = null;
  let wm = roundBlueprint(dom["round-select"].value);
  let metadata = metadataFor(wm);
  let draft = createRoundDraft(wm);

  function html(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
    });
  }
  function difficulty(value) { return { lowered: "낮춤", standard: "기준", raised: "올림" }[value] || "확인 필요"; }
  function dirty(message) { dom["draft-state"].textContent = "저장 전"; dom["draft-state"].className = "badge review"; if (message) dom["builder-status"].textContent = message; }

  function renderCandidates() {
    const query = dom["candidate-search"].value.trim().toLowerCase();
    const selected = new Set(draft.placements.map(function (placement) { return placement.itemId; }));
    const items = Object.values(metadata).filter(function (item) {
      const issues = core.validateCandidate(item);
      if (candidateFilter === "locked" && issues.length === 0) return false;
      if (["twin", "similar"].includes(candidateFilter) && item.relationship !== candidateFilter) return false;
      const haystack = `${item.label || ""} ${item.typeLabel || ""} ${item.typeCode || ""}`.toLowerCase();
      return !query || haystack.includes(query);
    });
    dom["candidate-count"].textContent = `${items.length}개`;
    dom["candidate-list"].innerHTML = items.map(function (item) {
      const issues = core.validateCandidate(item);
      const isSelected = selected.has(item.itemId);
      const disabled = issues.length > 0 || isSelected;
      const actionLabel = pendingReplacementId ? "교체" : "추가";
      return `<article class="builder-candidate-card${disabled ? " is-locked" : ""}" draggable="${disabled ? "false" : "true"}" data-candidate-id="${html(item.itemId)}"><div class="builder-card-number">${String(item.number || "+").padStart(2, "0")}</div><div><strong>${html(item.label || item.itemId)}</strong><p>${html(item.typeLabel || item.typeCode || "세부유형 확인 필요")}</p><span>${difficulty(item.difficultyBand)} · ${isSelected ? "시험지에 담김" : issues.length ? "검수 대기" : pendingReplacementId ? "교체 가능" : "추가·끌기 가능"}</span></div><button type="button" data-use-item="${html(item.itemId)}" ${disabled ? "disabled" : ""}>${actionLabel}</button></article>`;
    }).join("") || '<div class="empty">조건에 맞는 문항이 없습니다.</div>';
  }

  function renderSummary() {
    const summary = core.summarizeDraft(draft, metadata);
    dom["draft-summary"].innerHTML = [["문항", `${summary.itemCount}개`], ["총점", `${summary.totalScore}점`], ["낮춤", summary.byDifficulty.lowered], ["기준", summary.byDifficulty.standard], ["올림", summary.byDifficulty.raised]].map(function (entry) { return `<div><span>${entry[0]}</span><strong>${entry[1]}</strong></div>`; }).join("");
  }

  function renderPlacements() {
    dom["placement-list"].innerHTML = draft.placements.map(function (placement) {
      const item = metadata[placement.itemId] || {};
      const view = draft.viewMode === "question" ? "문제만" : "정답·해설은 권한 확인 후 표시";
      return `<li class="builder-placement-card" draggable="true" data-placement-id="${html(placement.placementId)}"><span class="builder-drag">⋮⋮</span><strong class="builder-placement-number">${String(placement.order).padStart(2, "0")}</strong><div class="builder-placement-copy"><span>${html(item.label || placement.itemId)}</span><strong>${html(item.typeLabel || item.typeCode || "세부유형 확인 필요")}</strong><small>${difficulty(item.difficultyBand)} · ${html(view)}</small></div><div class="builder-placement-actions"><button type="button" data-replace-placement="${html(placement.placementId)}">교체</button><button type="button" data-remove-placement="${html(placement.placementId)}">삭제</button></div></li>`;
    }).join("") || '<li class="empty">선택한 문항이 없습니다.</li>';
  }

  function useCandidate(itemId, targetPlacementId) {
    const candidate = metadata[itemId];
    if (!candidate) throw new Error("문항 정보를 찾을 수 없습니다.");
    if (!targetPlacementId) {
      draft = core.addItem(draft, { candidate, placementId: `place-${Date.now()}`, score: 1, selectionKind: candidate.relationship || "manual" });
      dirty("문항을 시험지 끝에 추가했습니다.");
      return;
    }
    const current = draft.placements.find(function (placement) { return placement.placementId === targetPlacementId; });
    if (!current) throw new Error("교체할 위치를 찾을 수 없습니다.");
    const relationship = ["twin", "similar"].includes(candidate.relationship) ? candidate.relationship : "manual";
    draft = core.replacePlacement(draft, {
      placementId: targetPlacementId,
      currentItem: metadata[current.itemId],
      candidate,
      relationship,
      reasonCode: "admin_editor"
    });
    pendingReplacementId = null;
    dirty("선택한 위치의 문항을 교체했습니다. 이전 문항 ID는 변경 기록에 남습니다.");
  }

  function outputSettings() {
    const theme = document.getElementById("output-theme").value;
    return outputs.createOutputSettings({
      title: dom["draft-title"].value || "중2-1 기본반 대비", subtitle: "중1 대수 20문항 · 중1 기하 20문항", writer: "T", gradeLabel: "중2-1 기본반 입학 대비",
      purpose: document.getElementById("output-purpose").value, themeId: theme,
      accentColor: { violet: "#6d28d9", blue: "#2563eb", green: "#15803d", slate: "#334155" }[theme],
      layout: document.getElementById("output-layout").value, showPoints: document.getElementById("show-points").checked,
      showDifficulty: document.getElementById("show-difficulty").checked, showAnswerSpace: document.getElementById("show-answer-space").checked,
      showWorkSpace: document.getElementById("show-workspace").checked, dateMode: "hidden", qrDestination: document.getElementById("output-qr").value,
      answerBookletPolicy: "question_solution_answer"
    });
  }

  function renderPreview() {
    let settings;
    try { settings = outputSettings(); } catch (error) { dom["builder-status"].textContent = error.message; return; }
    const preview = outputs.createPreviewManifest(settings, draft.placements.length);
    dom["preview-pages"].textContent = `${preview.pageCount}쪽`;
    const cells = Array.from({ length: Math.min(preview.itemsPerPage, draft.placements.length) }, function (_, index) {
      const item = metadata[draft.placements[index].itemId] || {};
      return `<div><strong>${String(index + 1).padStart(2, "0")}</strong><span>${html(item.typeLabel || "문항")}</span></div>`;
    }).join("");
    dom["print-preview"].style.setProperty("--builder-accent", settings.accentColor);
    dom["print-preview"].innerHTML = `<header><div><strong>${html(settings.title)}</strong><span>${html(settings.gradeLabel)} · 출제자 T</span></div><i></i></header><section class="preview-${settings.layout}">${cells}</section><footer>${preview.questionCount}문항 · ${preview.pageCount}쪽 예상 · QR ${settings.qrDestination === "none" ? "없음" : "사용"}</footer>`;
  }
  function render() { renderCandidates(); renderSummary(); renderPlacements(); renderPreview(); }

  function renderScope() {
    const groups = Array.from(new Map(wm.items.map(function (item) { return [scopeKey(item), item]; })).entries());
    dom["scope-options"].innerHTML = groups.map(function (entry) { return `<label><input type="checkbox" value="${html(entry[0])}" ${draft.scopeKeys.includes(entry[0]) ? "checked" : ""}><span><strong>${html(entry[1].semester)} · ${html(entry[1].minorUnit)}</strong><small>${html(entry[1].majorUnit)}</small></span></label>`; }).join("");
  }
  document.getElementById("open-scope").addEventListener("click", function () { renderScope(); dom["scope-dialog"].showModal(); });
  document.getElementById("apply-scope").addEventListener("click", function (event) {
    event.preventDefault();
    const scope = Array.from(dom["scope-options"].querySelectorAll("input:checked")).map(function (input) { return input.value; });
    if (!scope.length) { dom["builder-status"].textContent = "범위를 하나 이상 선택하세요."; return; }
    const result = core.changeScope(draft, scope, metadata); draft = result.draft;
    const outside = result.reconciliation.outOfScopePlacementIds.length;
    const pending = result.reconciliation.classificationPendingPlacementIds.length;
    dom["scope-reconcile"].hidden = outside === 0 && pending === 0;
    dom["scope-reconcile"].textContent = `범위 밖 ${outside}문항 · 분류 확인 필요 ${pending}문항 — 확정 전에 교체하거나 제거하세요.`;
    dom["scope-dialog"].close(); dirty("범위를 적용했습니다. 기존 문항은 자동 삭제하지 않았습니다."); render();
  });

  document.querySelectorAll("[data-candidate-filter]").forEach(function (button) { button.addEventListener("click", function () { candidateFilter = button.dataset.candidateFilter; document.querySelectorAll("[data-candidate-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); }); renderCandidates(); }); });
  dom["candidate-search"].addEventListener("input", renderCandidates);
  dom["candidate-list"].addEventListener("click", function (event) {
    const button = event.target.closest("[data-use-item]"); if (!button) return;
    try { useCandidate(button.dataset.useItem, pendingReplacementId); render(); }
    catch (error) { dom["builder-status"].textContent = error.message; }
  });
  dom["candidate-list"].addEventListener("dragstart", function (event) {
    const item = event.target.closest("[data-candidate-id]");
    if (!item || item.getAttribute("draggable") !== "true") return;
    dragCandidateId = item.dataset.candidateId;
    if (event.dataTransfer) event.dataTransfer.setData("text/plain", dragCandidateId);
  });
  dom["candidate-list"].addEventListener("dragend", function () { dragCandidateId = null; });
  dom["placement-list"].addEventListener("click", function (event) {
    const remove = event.target.closest("[data-remove-placement]"); const replace = event.target.closest("[data-replace-placement]");
    if (remove) { try { draft = core.removePlacement(draft, remove.dataset.removePlacement); dirty("배치에서 문항을 뺐습니다. 문항 DB 원문은 그대로입니다."); render(); } catch (error) { dom["builder-status"].textContent = error.message; } }
    if (replace) { pendingReplacementId = replace.dataset.replacePlacement; document.querySelector('[data-candidate-filter="all"]').click(); dom["builder-status"].textContent = "왼쪽에서 검증된 문항을 누르거나 이 위치로 끌어오세요."; renderCandidates(); dom["placement-list"].querySelectorAll("li").forEach(function (item) { item.classList.toggle("is-target", item.dataset.placementId === pendingReplacementId); }); }
  });
  dom["placement-list"].addEventListener("dragstart", function (event) { const item = event.target.closest("[data-placement-id]"); if (item) { dragPlacementId = item.dataset.placementId; item.classList.add("is-dragging"); } });
  dom["placement-list"].addEventListener("dragend", function () { dragPlacementId = null; dom["placement-list"].querySelectorAll("li").forEach(function (item) { item.classList.remove("is-dragging"); }); });
  dom["placement-list"].addEventListener("dragover", function (event) { if (dragPlacementId || dragCandidateId) event.preventDefault(); });
  dom["placement-list"].addEventListener("drop", function (event) {
    event.preventDefault();
    const target = event.target.closest("[data-placement-id]");
    if (dragCandidateId) {
      try { useCandidate(dragCandidateId, target ? target.dataset.placementId : null); render(); }
      catch (error) { dom["builder-status"].textContent = error.message; }
      dragCandidateId = null;
      return;
    }
    if (!dragPlacementId || !target || target.dataset.placementId === dragPlacementId) return;
    const index = draft.placements.findIndex(function (placement) { return placement.placementId === target.dataset.placementId; });
    draft = core.movePlacement(draft, dragPlacementId, index); dom["sort-mode"].value = "user"; dirty("문항 순서를 바꿨습니다. 답안·해설·분석지 번호도 이 순서를 사용합니다."); render();
  });
  dom["sort-mode"].addEventListener("change", function () { draft = core.sortPlacements(draft, dom["sort-mode"].value, metadata, { seed: 20260825 }); dirty("정렬을 적용했습니다."); render(); });
  dom["view-mode"].addEventListener("change", function () { draft = core.setViewMode(draft, dom["view-mode"].value); dirty(); renderPlacements(); });
  dom["draft-title"].addEventListener("input", function () { dirty(); renderPreview(); });
  dom["round-select"].addEventListener("change", function () {
    try {
      wm = roundBlueprint(dom["round-select"].value);
      metadata = metadataFor(wm);
      draft = createRoundDraft(wm);
      revision = null;
      pendingReplacementId = null;
      candidateFilter = "all";
      dom["candidate-search"].value = "";
      dom["sort-mode"].value = "user";
      dom["view-mode"].value = "question";
      dom["draft-title"].value = `중2-1 기본반 대비 ${roundNumber(wm.blueprint.examId)}회`;
      dom["draft-state"].textContent = "저장 전";
      dom["draft-state"].className = "badge review";
      dom["builder-status"].textContent = `${roundNumber(wm.blueprint.examId)}회 대표 구성을 불러왔습니다. 답안과 원문은 편집 화면에 표시하지 않습니다.`;
      document.querySelectorAll("[data-candidate-filter]").forEach(function (button) { button.classList.toggle("is-active", button.dataset.candidateFilter === "all"); });
      render();
    } catch (error) { dom["builder-status"].textContent = error.message; }
  });
  document.querySelectorAll(".builder-output input,.builder-output select").forEach(function (input) { input.addEventListener("change", function () { dirty(); renderPreview(); }); });
  async function saveDraft() {
    try {
      const invalidItem = draft.placements.find(function (placement) { return !bankCore.isNeutralId(placement.itemId, "question") && !bankCore.isSharedBankId(placement.itemId, "question"); });
      if (invalidItem) throw new Error("기본 세트 슬롯을 검증된 문항 DB ID와 연결한 뒤 저장할 수 있습니다.");
      const creating = !revision;
      const url = creating ? `${root.HIGHSELECT_RUNTIME.apiBase}/admin/exam-drafts` : `${root.HIGHSELECT_RUNTIME.apiBase}/admin/exam-drafts/${encodeURIComponent(draft.draftId)}`;
      const body = creating ? { draft: draft, outputSettings: outputSettings() } : { expectedRevision: revision, draft: draft, outputSettings: outputSettings() };
      const response = await fetch(url, { method: creating ? "POST" : "PUT", headers: { "content-type": "application/json", "x-highselect-admin": "1" }, credentials: "same-origin", body: JSON.stringify(body) });
      if (!response.ok) throw new Error(response.status === 409 ? "다른 관리자가 먼저 수정했습니다. 새로 불러온 뒤 다시 저장하세요." : "서버에 초안을 저장하지 못했습니다.");
      const saved = await response.json(); revision = saved.revision || revision; dom["draft-state"].textContent = `저장됨 · ${String(revision).slice(0, 8)}`; dom["draft-state"].className = "badge live"; dom["builder-status"].textContent = "시험지 초안을 저장했습니다.";
    } catch (error) { dom["builder-status"].textContent = error.message; }
  }
  document.getElementById("save-draft").addEventListener("click", saveDraft);
  document.getElementById("save-draft-mobile").addEventListener("click", saveDraft);
  render();
})(typeof window !== "undefined" ? window : globalThis);
