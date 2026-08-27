(function () {
  "use strict";

  const adminSession = HIGHSELECT_AUTH.requireAdmin("../login.html");
  if (!adminSession) return;

  const apiBase = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const recentKey = "highselect-exam-editor-recent-v1";
  const elements = {
    alert: document.getElementById("editor-alert"),
    connection: document.getElementById("editor-connection"),
    start: document.getElementById("editor-start"),
    workspace: document.getElementById("editor-workspace"),
    createForm: document.getElementById("draft-create-form"),
    openForm: document.getElementById("draft-open-form"),
    changeDraft: document.getElementById("change-draft"),
    draftTitle: document.getElementById("draft-title"),
    draftRevision: document.getElementById("draft-revision"),
    scopePanel: document.getElementById("scope-panel"),
    scopeKeys: document.getElementById("scope-keys"),
    editScope: document.getElementById("edit-scope"),
    applyScope: document.getElementById("apply-scope"),
    candidateMode: document.getElementById("candidate-mode"),
    candidateScopeField: document.getElementById("candidate-scope-field"),
    candidateScope: document.getElementById("candidate-scope"),
    academyProfileFilters: document.getElementById("academy-profile-filters"),
    candidateSearchForm: document.getElementById("candidate-search-form"),
    candidateQuery: document.getElementById("candidate-query"),
    candidateContext: document.getElementById("candidate-context"),
    candidateCount: document.getElementById("candidate-count"),
    candidateList: document.getElementById("candidate-list"),
    candidateEmpty: document.getElementById("candidate-empty"),
    placementList: document.getElementById("placement-list"),
    draftEmpty: document.getElementById("draft-empty"),
    viewMode: document.getElementById("view-mode"),
    sortMode: document.getElementById("sort-mode"),
    summaryItems: document.getElementById("summary-items"),
    summaryScore: document.getElementById("summary-score"),
    summaryScopes: document.getElementById("summary-scopes"),
    summaryDifficulty: document.getElementById("summary-difficulty"),
    checkReadiness: document.getElementById("check-readiness"),
    readinessStrip: document.getElementById("readiness-strip"),
    readinessTitle: document.getElementById("readiness-title"),
    readinessDetail: document.getElementById("readiness-detail"),
    recent: document.getElementById("recent-drafts"),
    recentButtons: document.getElementById("recent-draft-buttons"),
    toast: document.getElementById("editor-toast")
  };

  const state = {
    packet: null,
    candidates: [],
    metadata: new Map(),
    candidateMode: "new",
    selectedPlacementId: null,
    busy: false,
    searchSequence: 0,
    draggedPlacementId: null,
    serverDrafts: [],
    profileMode: null
  };
  const scoreTimers = new Map();
  const pendingScores = new Map();

  const difficultyLabels = { lowered: "하향", standard: "기준", raised: "상향" };
  const inputLabels = {
    single_choice: "객관식", multi_choice: "복수 선택", ox: "O/X", input: "단답형",
    multi_input: "복수 입력", ordered_list: "순서형", unordered_set: "집합형",
    figure_select: "그림 선택", construction: "작도"
  };
  const defaultProfilesByMode = {
    DP: ["DP_STANDARD"], SM: ["SM_STANDARD"], WM: ["WM_BASIC", "WM_DUAL"],
    ED: ["ED_CUMULATIVE"], SH: ["SH_SELECTION"], DG: ["DG_ADVANCED"]
  };

  function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function cleanLines(value) {
    return Array.from(new Set(String(value || "").split(/[\n,]+/).map(item => item.trim().replace(/\/+$/, "")).filter(Boolean)));
  }

  function setAlert(message, kind) {
    elements.alert.textContent = message;
    elements.alert.className = `notice${kind ? ` ${kind}` : ""}`;
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function () { elements.toast.hidden = true; }, 2400);
  }

  function loginRedirect() {
    HIGHSELECT_AUTH.clear();
    const next = encodeURIComponent(location.pathname + location.search);
    location.replace(`../login.html?next=${next}`);
  }

  async function request(path, options) {
    if (!apiBase) throw Object.assign(new Error("운영 편집 서버가 연결되지 않았습니다."), { status: 503 });
    const settings = Object.assign({ credentials: "include", headers: { Accept: "application/json" } }, options || {});
    settings.headers = Object.assign({ Accept: "application/json" }, settings.headers || {});
    if (settings.method && settings.method !== "GET") {
      settings.headers["Content-Type"] = "application/json";
      settings.headers["X-Highselect-Admin"] = "1";
    }
    const response = await fetch(apiBase + path, settings);
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) {
      if (response.status === 401) loginRedirect();
      const error = new Error(data.message || "요청을 처리하지 못했습니다.");
      error.status = response.status;
      throw error;
    }
    return data;
  }

  function selectedPlacement() {
    if (!state.packet) return null;
    return state.packet.draft.placements.find(item => item.placementId === state.selectedPlacementId) || null;
  }

  function rememberDraft(packet) {
    let recent = [];
    try { recent = JSON.parse(localStorage.getItem(recentKey) || "[]"); } catch (_) {}
    recent = Array.isArray(recent) ? recent.filter(item => item && item.draftId !== packet.draftId) : [];
    recent.unshift({
      draftId: packet.draftId,
      profileId: packet.draft.profileId,
      targetId: packet.draft.targetId,
      itemCount: packet.draft.placements.length,
      updatedAt: packet.updatedAt
    });
    localStorage.setItem(recentKey, JSON.stringify(recent.slice(0, 5)));
    renderRecentDrafts();
  }

  function renderRecentDrafts() {
    let localRecent = [];
    try { localRecent = JSON.parse(localStorage.getItem(recentKey) || "[]"); } catch (_) {}
    localRecent = Array.isArray(localRecent) ? localRecent : [];
    const byId = new Map();
    localRecent.concat(state.serverDrafts).forEach(function (item) {
      if (item && /^draft_[A-Za-z0-9]+$/.test(item.draftId || "") && !byId.has(item.draftId)) byId.set(item.draftId, item);
    });
    const recent = Array.from(byId.values()).sort(function (left, right) {
      return String(right.updatedAt || "").localeCompare(String(left.updatedAt || "")) || left.draftId.localeCompare(right.draftId);
    }).slice(0, 20);
    elements.recentButtons.replaceChildren();
    recent.forEach(function (item) {
      const count = Number.isSafeInteger(item.itemCount) ? ` · ${item.itemCount}문항` : "";
      const button = make("button", "recent-draft-button", `${item.targetId || item.profileId || "시험지"}${count} · ${item.draftId.slice(-8)}`);
      button.type = "button";
      button.dataset.draftId = item.draftId;
      button.title = item.draftId;
      elements.recentButtons.append(button);
    });
    elements.recent.hidden = recent.length === 0;
  }

  async function loadDraftList() {
    const packet = await request("/admin/exam-editor/drafts");
    state.serverDrafts = Array.isArray(packet.items) ? packet.items : [];
    renderRecentDrafts();
  }

  function setWorkspace(active) {
    elements.start.hidden = active;
    elements.workspace.hidden = !active;
    elements.changeDraft.hidden = !active;
  }

  function updateMetadata(items) {
    (items || []).forEach(function (item) { state.metadata.set(item.itemId, item); });
  }

  function applyPacket(packet, options) {
    state.packet = packet;
    updateMetadata(packet.selectedItems);
    const draft = packet.draft;
    if (state.profileMode !== draft.mode) {
      const defaults = new Set(defaultProfilesByMode[draft.mode] || []);
      Array.from(elements.academyProfileFilters.querySelectorAll("input[type=checkbox]")).forEach(function (input) {
        input.checked = defaults.has(input.value);
      });
      state.profileMode = draft.mode;
    }
    elements.draftTitle.textContent = `${draft.mode || "과정 미지정"} · ${draft.profileId} · ${draft.targetId}`;
    elements.draftRevision.textContent = `버전 ${draft.revision}`;
    elements.scopeKeys.value = draft.scopeKeys.join("\n");
    elements.sortMode.value = draft.sortMode;
    Array.from(elements.viewMode.querySelectorAll("[data-view]")).forEach(function (button) {
      const active = button.dataset.view === draft.viewMode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderScopeOptions();
    renderPlacements();
    renderSummary();
    renderCandidateMode();
    renderCandidates();
    invalidateReadiness();
    rememberDraft(packet);
    setWorkspace(true);
    if (!(options && options.keepUrl)) {
      const url = new URL(location.href);
      url.searchParams.set("draftId", packet.draftId);
      history.replaceState(null, "", url);
    }
  }

  function renderScopeOptions() {
    const previous = elements.candidateScope.value;
    elements.candidateScope.replaceChildren();
    const scopes = state.packet ? state.packet.draft.scopeKeys : [];
    if (!scopes.length) elements.candidateScope.append(new Option("전체 검수 범위", ""));
    scopes.forEach(function (scope) { elements.candidateScope.append(new Option(scope, scope)); });
    if (Array.from(elements.candidateScope.options).some(option => option.value === previous)) elements.candidateScope.value = previous;
  }

  function renderCandidateMode() {
    const replacementReady = Boolean(selectedPlacement()) && !(state.packet && state.packet.migrationRequired);
    Array.from(elements.candidateMode.querySelectorAll("[data-mode]")).forEach(function (button) {
      const mode = button.dataset.mode;
      button.disabled = ["twin", "similar"].includes(mode) && !replacementReady;
      const active = state.candidateMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const catalogMode = state.candidateMode === "catalog";
    elements.academyProfileFilters.hidden = !catalogMode;
    elements.candidateScopeField.hidden = catalogMode;
    elements.candidateQuery.placeholder = catalogMode ? "학기 · 대단원 · 소단원 · 세부 유형 검색" : "문항 ID · 유형 · 범위 검색";
    const placement = selectedPlacement();
    const checkedProfiles = Array.from(elements.academyProfileFilters.querySelectorAll("input:checked")).map(input => input.parentElement.textContent.trim());
    elements.candidateContext.textContent = catalogMode
      ? checkedProfiles.length
        ? `${checkedProfiles.join(" · ")}에서 원본 확인 또는 사용 승인된 문항만 표시합니다.`
        : "시험형을 하나 이상 선택하세요."
      : state.candidateMode === "new"
      ? "현재 범위에서 검수 완료 문항을 찾습니다."
      : placement
        ? `${placement.order}번 문항의 ${state.candidateMode === "twin" ? "쌍둥이" : "유사"} 후보만 표시합니다.`
        : "먼저 현재 시험지에서 교체할 문항을 선택하세요.";
  }

  function candidateBadge(text, tone) {
    return make("span", `candidate-badge${tone ? ` ${tone}` : ""}`, text);
  }

  function renderCandidates() {
    elements.candidateList.replaceChildren();
    if (state.candidateMode === "catalog") {
      state.candidates.forEach(function (candidate) {
        const row = make("article", "candidate-row is-catalog");
        const main = make("div", "candidate-main");
        const title = make("div", "candidate-title");
        title.append(make("strong", "", candidate.typeLabel), make("code", "", `${candidate.paperId} · ${candidate.number}번`));
        const badges = make("div", "candidate-badges");
        (candidate.profiles || []).forEach(function (profile) { badges.append(candidateBadge(profile.label, "profile")); });
        badges.append(candidateBadge(candidate.difficultyStatus === "verified" ? (difficultyLabels[candidate.difficultyBand] || candidate.difficultyBand) : "난이도 검수 전"));
        main.append(title, make("p", "candidate-path", `${candidate.semester} → ${candidate.majorUnit} → ${candidate.minorUnit} → ${candidate.typeLabel}`), badges);
        const button = make("button", "ghost compact-button", "조립 전 검수");
        button.type = "button";
        button.disabled = true;
        row.append(main, button);
        elements.candidateList.append(row);
      });
      elements.candidateCount.textContent = `${state.candidates.length}개`;
      elements.candidateEmpty.hidden = state.candidates.length > 0;
      return;
    }
    const selectedIds = new Set(state.packet ? state.packet.draft.placements.map(item => item.itemId) : []);
    state.candidates.forEach(function (candidate) {
      updateMetadata([candidate]);
      const row = make("article", "candidate-row");
      const main = make("div", "candidate-main");
      const title = make("div", "candidate-title");
      title.append(make("strong", "", candidate.typeCode), make("code", "", candidate.itemId));
      const badges = make("div", "candidate-badges");
      badges.append(
        candidateBadge(difficultyLabels[candidate.difficultyBand] || candidate.difficultyBand),
        candidateBadge(inputLabels[candidate.inputType] || candidate.inputType),
        candidateBadge(candidate.figureRequired ? "그림" : "비그림", candidate.figureRequired ? "figure" : "")
      );
      main.append(title, make("p", "candidate-path", candidate.curriculumPath), badges);
      const selected = selectedIds.has(candidate.itemId);
      const button = make("button", selected ? "ghost compact-button" : "accent compact-button", state.candidateMode === "new" ? (selected ? "담김" : "추가") : "교체");
      button.type = "button";
      button.dataset.candidateId = candidate.itemId;
      button.disabled = selected || state.busy || state.packet.migrationRequired;
      row.append(main, button);
      elements.candidateList.append(row);
    });
    elements.candidateCount.textContent = `${state.candidates.length}개`;
    elements.candidateEmpty.hidden = state.candidates.length > 0;
  }

  function placementMeta(placement) {
    return state.metadata.get(placement.itemId) || null;
  }

  function actionButton(label, action, placementId, disabled, title) {
    const button = make("button", "placement-action", label);
    button.type = "button";
    button.dataset.action = action;
    button.dataset.placementId = placementId;
    button.disabled = Boolean(disabled || state.busy || (state.packet && state.packet.migrationRequired));
    button.title = title || label;
    return button;
  }

  function renderPlacements() {
    elements.placementList.replaceChildren();
    const placements = state.packet ? state.packet.draft.placements : [];
    placements.forEach(function (placement, index) {
      const metadata = placementMeta(placement);
      const row = make("li", `placement-row${placement.placementId === state.selectedPlacementId ? " is-selected" : ""}`);
      row.dataset.placementId = placement.placementId;
      row.draggable = !state.busy && !state.packet.migrationRequired;
      const drag = make("span", "drag-handle", "⋮⋮");
      drag.title = "끌어서 순서 변경";
      drag.setAttribute("aria-hidden", "true");
      const number = make("span", "placement-number", placement.order);
      const detail = make("div", "placement-detail");
      const heading = make("div", "placement-heading");
      heading.append(make("strong", "", metadata ? metadata.typeCode : placement.itemId), make("code", "", placement.itemId));
      const secondary = make("p", "", metadata ? `${metadata.curriculumPath} · ${difficultyLabels[metadata.difficultyBand] || metadata.difficultyBand} · ${inputLabels[metadata.inputType] || metadata.inputType}` : "현재 버전 메타데이터 확인 필요");
      detail.append(heading, secondary);
      const score = make("label", "placement-score");
      score.append(make("span", "", "배점"));
      const scoreInput = document.createElement("input");
      scoreInput.type = "number";
      scoreInput.min = "0.5";
      scoreInput.step = "0.5";
      scoreInput.value = String(placement.score);
      scoreInput.dataset.scorePlacement = placement.placementId;
      scoreInput.disabled = state.busy || placement.locked || state.packet.migrationRequired;
      score.append(scoreInput);
      const actions = make("div", "placement-actions");
      actions.append(
        actionButton("쌍둥이", "twin", placement.placementId, !metadata, "쌍둥이 문항 찾기"),
        actionButton("유사", "similar", placement.placementId, !metadata, "유사 문항 찾기"),
        actionButton("위", "up", placement.placementId, index === 0, "한 칸 위로"),
        actionButton("아래", "down", placement.placementId, index === placements.length - 1, "한 칸 아래로"),
        actionButton("삭제", "remove", placement.placementId, placement.locked, "시험지에서 삭제")
      );
      row.append(drag, number, detail, score, actions);
      elements.placementList.append(row);
    });
    elements.draftEmpty.hidden = placements.length > 0;
  }

  function renderSummary() {
    const draft = state.packet.draft;
    const counts = { lowered: 0, standard: 0, raised: 0 };
    let score = 0;
    draft.placements.forEach(function (placement) {
      score += Number(placement.score) || 0;
      const metadata = placementMeta(placement);
      if (metadata && Object.hasOwn(counts, metadata.difficultyBand)) counts[metadata.difficultyBand] += 1;
    });
    elements.summaryItems.textContent = draft.placements.length;
    elements.summaryScore.textContent = Number.isInteger(score) ? score : score.toFixed(1);
    elements.summaryScopes.textContent = draft.scopeKeys.length;
    elements.summaryDifficulty.textContent = `난도 하 ${counts.lowered} · 중 ${counts.standard} · 상 ${counts.raised}`;
  }

  function invalidateReadiness() {
    elements.readinessStrip.className = "readiness-strip";
    elements.readinessTitle.textContent = "최종 점검 전";
    elements.readinessDetail.textContent = "현재 편집 버전으로 최종 점검을 실행하세요.";
  }

  function issueLabel(issue) {
    if (issue === "draft.placements.empty") return "문항을 1개 이상 담아야 합니다.";
    if (issue === "draft.original.minimum") return "원본 문항을 1개 이상 유지해야 합니다.";
    if (issue.includes("draft.score.non_positive")) return "모든 문항의 배점은 0보다 커야 합니다.";
    if (issue.includes("mode.mismatch")) return "현재 과정과 다른 과정의 문항이 있습니다.";
    if (issue.includes("metadata.missing")) return "현재 검수 목록에서 빠진 문항이 있습니다.";
    if (issue.includes("version.mismatch")) return "문항 버전이 변경되어 다시 선택해야 합니다.";
    if (issue.includes("scope.outside")) return "선택 범위 밖 문항이 있습니다.";
    if (issue.includes("scope.classification_pending")) return "분류 확인이 끝나지 않은 문항이 있습니다.";
    if (issue.includes("family.duplicate")) return "같은 문항군이 중복되었습니다.";
    return `확인 필요: ${issue}`;
  }

  async function checkReadiness() {
    if (!state.packet || state.busy) return;
    if (state.packet.migrationRequired) {
      setAlert("이전 초안은 과정과 출제 범위를 확인해 새 초안으로 옮긴 뒤 점검할 수 있습니다.", "warning");
      return;
    }
    setBusy(elements.checkReadiness, true, "점검 중");
    try {
      const result = await request(`/admin/exam-editor/drafts/${encodeURIComponent(state.packet.draftId)}/readiness`);
      if (result.revision !== state.packet.draft.revision) {
        await openDraft(state.packet.draftId, { silent: true });
        throw new Error("다른 화면의 변경 내용을 불러왔습니다. 다시 점검해 주세요.");
      }
      elements.readinessStrip.className = `readiness-strip ${result.eligible ? "is-ready" : "has-issues"}`;
      elements.readinessTitle.textContent = result.eligible ? "최종 조립 가능" : "수정이 필요합니다";
      elements.readinessDetail.textContent = result.eligible
        ? `${result.projection.entries.length}문항의 번호 연결이 확인됐습니다.`
        : (result.issues || []).map(issueLabel).join(" ");
    } catch (error) {
      setAlert(error.message, "error");
    } finally {
      setBusy(elements.checkReadiness, false);
    }
  }

  function setBusy(button, busy, busyText) {
    if (!button) return;
    const formControl = /^(INPUT|SELECT|TEXTAREA)$/.test(button.tagName);
    if (busy) {
      if (!formControl) {
        button.dataset.label = button.textContent;
        button.textContent = busyText || "처리 중";
      }
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    } else {
      if (!formControl && button.dataset.label) button.textContent = button.dataset.label;
      delete button.dataset.label;
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }

  async function performMutation(operation, trigger) {
    if (!state.packet || state.busy) return false;
    if (state.packet.migrationRequired) {
      setAlert("이전 초안은 과정과 출제 범위를 확인해 새 초안으로 옮긴 뒤 편집할 수 있습니다.", "warning");
      return false;
    }
    state.busy = true;
    setBusy(trigger, true);
    renderPlacements();
    renderCandidates();
    try {
      const result = await request(`/admin/exam-editor/drafts/${encodeURIComponent(state.packet.draftId)}`, {
        method: "PATCH",
        body: JSON.stringify({ expectedRevision: state.packet.draft.revision, operation })
      });
      applyPacket(result.record);
      if (result.reconciliation && (result.reconciliation.outOfScopePlacementIds.length || result.reconciliation.classificationPendingPlacementIds.length)) {
        setAlert("범위 밖 또는 분류 확인이 필요한 문항은 삭제하지 않았습니다. 최종 점검 전에 교체하거나 제거하세요.", "warning");
      } else {
        setAlert("변경 사항을 서버에 저장했습니다.", "ok");
      }
      return true;
    } catch (error) {
      if (error.status === 409) {
        await openDraft(state.packet.draftId, { silent: true, skipScoreFlush: true }).catch(function () {});
        setAlert("다른 화면의 변경 내용을 불러왔습니다. 방금 작업을 다시 확인해 주세요.", "warning");
      } else {
        setAlert(error.message, "error");
      }
      return false;
    } finally {
      state.busy = false;
      setBusy(trigger, false);
      renderPlacements();
      renderCandidates();
    }
  }

  async function searchCandidates() {
    if (!state.packet) return;
    if (state.packet.migrationRequired) {
      state.candidates = [];
      renderCandidates();
      return;
    }
    const sequence = ++state.searchSequence;
    elements.candidateList.setAttribute("aria-busy", "true");
    if (state.candidateMode === "catalog") {
      const profiles = Array.from(elements.academyProfileFilters.querySelectorAll("input:checked")).map(input => input.value);
      if (!profiles.length) {
        state.candidates = [];
        renderCandidates();
        renderCandidateMode();
        elements.candidateList.removeAttribute("aria-busy");
        return;
      }
      const catalogParams = new URLSearchParams({ profiles: profiles.join(","), limit: "300" });
      const catalogQuery = elements.candidateQuery.value.trim();
      if (catalogQuery) catalogParams.set("q", catalogQuery);
      try {
        const packet = await request(`/admin/question-bank/catalog?${catalogParams}`);
        if (sequence !== state.searchSequence) return;
        state.candidates = packet.items || [];
        renderCandidateMode();
        renderCandidates();
      } catch (error) {
        if (sequence !== state.searchSequence) return;
        state.candidates = [];
        renderCandidates();
        setAlert(error.message, "error");
      } finally {
        if (sequence === state.searchSequence) elements.candidateList.removeAttribute("aria-busy");
      }
      return;
    }
    const params = new URLSearchParams({ draftId: state.packet.draftId, limit: "100" });
    const scopeKey = elements.candidateScope.value;
    const query = elements.candidateQuery.value.trim();
    if (scopeKey) params.set("scopeKey", scopeKey);
    if (query) params.set("q", query);
    const placement = selectedPlacement();
    if (state.candidateMode !== "new") {
      const metadata = placement && placementMeta(placement);
      if (!placement || !metadata) {
        state.candidates = [];
        renderCandidates();
        elements.candidateList.removeAttribute("aria-busy");
        return;
      }
      params.set("sourceItemId", placement.itemId);
      params.set("sourceItemVersionId", placement.itemVersionId);
      params.set("relationship", state.candidateMode);
    }
    try {
      const packet = await request(`/admin/exam-editor/candidates?${params}`);
      if (sequence !== state.searchSequence) return;
      state.candidates = packet.items || [];
      updateMetadata(state.candidates);
      renderCandidates();
      renderPlacements();
      renderSummary();
    } catch (error) {
      if (sequence !== state.searchSequence) return;
      state.candidates = [];
      renderCandidates();
      setAlert(error.message, "error");
    } finally {
      if (sequence === state.searchSequence) elements.candidateList.removeAttribute("aria-busy");
    }
  }

  async function openDraft(draftId, options) {
    const id = String(draftId || "").trim();
    if (!/^draft_[A-Za-z0-9]+$/.test(id)) throw new Error("초안 ID 형식을 확인해 주세요.");
    if (state.packet && !(options && options.skipScoreFlush)) {
      const saved = await flushPendingScoreSaves();
      if (!saved) throw new Error("저장되지 않은 배점이 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.");
    }
    const packet = await request(`/admin/exam-editor/drafts/${encodeURIComponent(id)}`);
    applyPacket(packet, options);
    if (packet.migrationRequired) {
      setAlert("이전 초안은 보존되어 있습니다. 과정과 출제 범위를 확인해 새 초안으로 옮겨 주세요.", "warning");
    } else {
      await searchCandidates();
      if (!(options && options.silent)) setAlert("시험지 초안을 불러왔습니다.", "ok");
    }
    return packet;
  }

  elements.createForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (state.busy) return;
    const scopeKeys = cleanLines(elements.createForm.scopeKeys.value);
    if (!scopeKeys.length) { setAlert("출제 범위를 하나 이상 입력해 주세요.", "error"); return; }
    if (state.packet && !(await flushPendingScoreSaves())) {
      setAlert("저장되지 않은 배점이 있습니다. 연결을 확인한 뒤 다시 시도해 주세요.", "error");
      return;
    }
    const submit = elements.createForm.querySelector("[type=submit]");
    setBusy(submit, true, "만드는 중");
    state.busy = true;
    try {
      const packet = await request("/admin/exam-editor/drafts", {
        method: "POST",
        body: JSON.stringify({
          mode: elements.createForm.mode.value,
          profileId: elements.createForm.profileId.value.trim(),
          targetId: elements.createForm.targetId.value.trim(),
          durationMinutes: Number(elements.createForm.durationMinutes.value),
          scopeKeys
        })
      });
      applyPacket(packet);
      await searchCandidates();
      setAlert("새 시험지 초안을 만들었습니다.", "ok");
    } catch (error) {
      setAlert(error.message, "error");
    } finally {
      state.busy = false;
      setBusy(submit, false);
      renderCandidates();
      renderPlacements();
    }
  });

  elements.openForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const submit = elements.openForm.querySelector("[type=submit]");
    setBusy(submit, true, "여는 중");
    try { await openDraft(elements.openForm.draftId.value); }
    catch (error) { setAlert(error.message, "error"); }
    finally { setBusy(submit, false); }
  });

  elements.recentButtons.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-draft-id]");
    if (!button) return;
    setBusy(button, true, "여는 중");
    try { await openDraft(button.dataset.draftId); }
    catch (error) { setAlert(error.message, "error"); }
    finally { setBusy(button, false); }
  });

  elements.changeDraft.addEventListener("click", function () {
    setWorkspace(false);
    const url = new URL(location.href);
    url.searchParams.delete("draftId");
    history.replaceState(null, "", url);
    elements.openForm.draftId.focus();
  });

  elements.editScope.addEventListener("click", function () {
    const opening = elements.scopePanel.hidden;
    elements.scopePanel.hidden = !opening;
    elements.editScope.setAttribute("aria-expanded", String(opening));
    if (opening) elements.scopeKeys.focus();
  });

  elements.applyScope.addEventListener("click", async function () {
    const scopeKeys = cleanLines(elements.scopeKeys.value);
    if (!scopeKeys.length) { setAlert("출제 범위를 하나 이상 입력해 주세요.", "error"); return; }
    if (await performMutation({ kind: "change_scope", scopeKeys }, elements.applyScope)) {
      elements.scopePanel.hidden = true;
      elements.editScope.setAttribute("aria-expanded", "false");
      await searchCandidates();
    }
  });

  elements.candidateMode.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-mode]");
    if (!button || button.disabled) return;
    state.candidateMode = button.dataset.mode;
    if (["new", "catalog"].includes(state.candidateMode)) state.selectedPlacementId = null;
    renderCandidateMode();
    renderPlacements();
    await searchCandidates();
  });

  elements.candidateSearchForm.addEventListener("submit", function (event) { event.preventDefault(); searchCandidates(); });
  elements.candidateScope.addEventListener("change", searchCandidates);
  elements.academyProfileFilters.addEventListener("change", function () {
    renderCandidateMode();
    if (state.candidateMode === "catalog") searchCandidates();
  });

  elements.candidateList.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-candidate-id]");
    if (!button || button.disabled || !state.packet) return;
    const candidate = state.candidates.find(item => item.itemId === button.dataset.candidateId);
    if (!candidate) return;
    if (state.candidateMode === "new") {
      await performMutation({
        kind: "add",
        placementId: `placement_${crypto.randomUUID().replace(/-/g, "")}`,
        itemId: candidate.itemId,
        itemVersionId: candidate.itemVersionId,
        score: 1,
        selectionKind: "manual"
      }, button);
      return;
    }
    const placement = selectedPlacement();
    if (!placement || !candidate.replacement) { setAlert("검수된 교체 근거를 찾을 수 없습니다.", "error"); return; }
    const changed = await performMutation({
      kind: "replace",
      placementId: placement.placementId,
      itemId: candidate.itemId,
      itemVersionId: candidate.itemVersionId,
      relationship: state.candidateMode,
      reasonCode: "user_selected",
      evidenceId: candidate.replacement.evidenceId
    }, button);
    if (changed) {
      state.selectedPlacementId = null;
      state.candidateMode = "new";
      renderCandidateMode();
      await searchCandidates();
    }
  });

  elements.placementList.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled || !state.packet) return;
    const placement = state.packet.draft.placements.find(item => item.placementId === button.dataset.placementId);
    if (!placement) return;
    const action = button.dataset.action;
    if (action === "twin" || action === "similar") {
      state.selectedPlacementId = placement.placementId;
      state.candidateMode = action;
      renderCandidateMode();
      renderPlacements();
      await searchCandidates();
      elements.candidateList.scrollIntoView({ behavior: "smooth", block: "nearest" });
      return;
    }
    if (action === "remove") {
      if (!confirm(`${placement.order}번 문항을 시험지에서 삭제할까요?`)) return;
      if (await performMutation({ kind: "remove", placementId: placement.placementId }, button)) {
        if (state.selectedPlacementId === placement.placementId) {
          state.selectedPlacementId = null;
          state.candidateMode = "new";
          await searchCandidates();
        }
      }
      return;
    }
    const index = state.packet.draft.placements.findIndex(item => item.placementId === placement.placementId);
    const toIndex = action === "up" ? index - 1 : index + 1;
    await performMutation({ kind: "move", placementId: placement.placementId, toIndex }, button);
  });

  async function flushScoreSave(placementId) {
    const pending = pendingScores.get(placementId);
    if (!pending) return true;
    if (pending.saving) return false;
    if (state.busy) {
      scoreTimers.set(placementId, setTimeout(function () { flushScoreSave(placementId); }, 160));
      return false;
    }
    scoreTimers.delete(placementId);
    if (!state.packet || state.packet.draftId !== pending.draftId) {
      pendingScores.delete(placementId);
      clearTimeout(scoreTimers.get(placementId));
      scoreTimers.delete(placementId);
      setAlert("배점 저장 대상 초안이 바뀌었습니다. 이전 초안의 배점을 다시 확인해 주세요.", "warning");
      return false;
    }
    const current = state.packet.draft.placements.find(item => item.placementId === placementId);
    if (!Number.isFinite(pending.score) || pending.score <= 0) {
      if (pendingScores.get(placementId) === pending) pendingScores.delete(placementId);
      renderPlacements();
      setAlert("배점은 0보다 큰 숫자여야 합니다.", "error");
      return false;
    }
    if (!current || current.score === pending.score) {
      if (pendingScores.get(placementId) === pending) pendingScores.delete(placementId);
      return true;
    }
    pending.saving = true;
    const changed = await performMutation(
      { kind: "set_score", placementId, score: pending.score },
      pending.input && pending.input.isConnected ? pending.input : null
    );
    pending.saving = false;
    const latest = pendingScores.get(placementId);
    if (latest !== pending) {
      clearTimeout(scoreTimers.get(placementId));
      scoreTimers.set(placementId, setTimeout(function () { flushScoreSave(placementId); }, 100));
      return changed;
    }
    if (changed) {
      pendingScores.delete(placementId);
      return true;
    }
    pending.attempts = Number(pending.attempts || 0) + 1;
    const retryDelay = Math.min(8000, 700 * (2 ** Math.min(4, pending.attempts - 1)));
    scoreTimers.set(placementId, setTimeout(function () { flushScoreSave(placementId); }, retryDelay));
    return false;
  }

  async function flushPendingScoreSaves() {
    const placementIds = Array.from(pendingScores.keys());
    for (const placementId of placementIds) {
      clearTimeout(scoreTimers.get(placementId));
      scoreTimers.delete(placementId);
      await flushScoreSave(placementId);
      if (pendingScores.has(placementId)) return false;
    }
    return true;
  }

  function scheduleScoreSave(input, delay) {
    const placementId = input.dataset.scorePlacement;
    clearTimeout(scoreTimers.get(placementId));
    pendingScores.set(placementId, {
      draftId: state.packet && state.packet.draftId,
      input,
      score: Number(input.value),
      attempts: 0,
      saving: false
    });
    scoreTimers.set(placementId, setTimeout(function () { flushScoreSave(placementId); }, delay));
  }

  elements.placementList.addEventListener("input", function (event) {
    const input = event.target.closest("[data-score-placement]");
    if (!input) return;
    scheduleScoreSave(input, 550);
  });

  elements.placementList.addEventListener("change", function (event) {
    const input = event.target.closest("[data-score-placement]");
    if (input) scheduleScoreSave(input, 0);
  });

  elements.placementList.addEventListener("keydown", function (event) {
    const input = event.target.closest("[data-score-placement]");
    if (!input || event.key !== "Enter") return;
    event.preventDefault();
    scheduleScoreSave(input, 0);
  });

  elements.placementList.addEventListener("dragstart", function (event) {
    const row = event.target.closest("[data-placement-id]");
    if (!row || state.busy) { event.preventDefault(); return; }
    state.draggedPlacementId = row.dataset.placementId;
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", state.draggedPlacementId);
  });

  elements.placementList.addEventListener("dragover", function (event) {
    const row = event.target.closest("[data-placement-id]");
    if (!row || !state.draggedPlacementId) return;
    event.preventDefault();
    Array.from(elements.placementList.children).forEach(item => item.classList.toggle("is-drop-target", item === row));
  });

  elements.placementList.addEventListener("drop", async function (event) {
    const row = event.target.closest("[data-placement-id]");
    if (!row || !state.draggedPlacementId) return;
    event.preventDefault();
    const toIndex = state.packet.draft.placements.findIndex(item => item.placementId === row.dataset.placementId);
    const from = state.draggedPlacementId;
    state.draggedPlacementId = null;
    clearDragStyles();
    if (toIndex >= 0 && from !== row.dataset.placementId) await performMutation({ kind: "move", placementId: from, toIndex });
  });

  elements.placementList.addEventListener("dragend", function () { state.draggedPlacementId = null; clearDragStyles(); });
  function clearDragStyles() { Array.from(elements.placementList.children).forEach(item => item.classList.remove("is-dragging", "is-drop-target")); }

  elements.sortMode.addEventListener("change", async function () {
    const mode = elements.sortMode.value;
    const operation = { kind: "sort", mode };
    if (mode === "random") operation.seed = Date.now() >>> 0;
    await performMutation(operation, elements.sortMode);
  });

  elements.viewMode.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-view]");
    if (!button || button.disabled || button.classList.contains("is-active")) return;
    await performMutation({ kind: "set_view", viewMode: button.dataset.view }, button);
  });

  elements.checkReadiness.addEventListener("click", checkReadiness);

  async function boot() {
    renderRecentDrafts();
    if (!apiBase) {
      elements.connection.textContent = "서버 미연결";
      elements.connection.className = "badge locked";
      setAlert("운영 편집 서버가 연결되지 않았습니다.", "error");
      Array.from(document.querySelectorAll("#editor-start input, #editor-start textarea, #editor-start button")).forEach(item => { item.disabled = true; });
      return;
    }
    try {
      await request("/admin/exam-editor/status");
      await loadDraftList();
      elements.connection.textContent = "운영 API 연결";
      elements.connection.className = "badge open";
      setAlert("검수 완료 문항만 시험지에 담을 수 있습니다.");
      const draftId = new URLSearchParams(location.search).get("draftId");
      if (draftId) await openDraft(draftId, { silent: true, keepUrl: true });
    } catch (error) {
      elements.connection.textContent = "편집 저장소 확인 필요";
      elements.connection.className = "badge locked";
      setAlert(error.message, "error");
    }
  }

  boot();
})();
