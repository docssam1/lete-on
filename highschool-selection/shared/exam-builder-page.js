(function (root) {
  "use strict";
  const session = root.HIGHSELECT_AUTH && root.HIGHSELECT_AUTH.requireAdmin("../login.html");
  if (!session) return;
  const apiBase = String(root.HIGHSELECT_RUNTIME && root.HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const dom = Object.fromEntries([
    "builder-state", "draft-list", "profile-id", "target-id", "duration-minutes", "create-draft", "refresh-drafts",
    "sort-mode", "view-mode", "check-readiness", "draft-revision", "candidate-search", "candidate-count", "candidate-list",
    "replace-context", "selected-count", "draft-summary", "placement-list", "scope-keys", "apply-scope", "scope-status", "builder-status"
  ].map(function (id) { return [id, document.getElementById(id)]; }));
  let draft = null;
  let candidates = [];
  let replacement = { placementId: null, relationship: "manual" };
  let dragPlacementId = null;

  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]; }); }
  function difficulty(value) { return ({ lowered: "낮춤", standard: "기준", raised: "올림" })[value] || "확인 필요"; }
  function status(message, kind) { dom["builder-status"].textContent = message || ""; dom["builder-status"].className = `status${kind ? ` ${kind}` : ""}`; }
  function eligible() { return Boolean(apiBase && draft); }
  function headers() { return { "Content-Type": "application/json", "X-Highselect-Admin": "1" }; }
  async function request(path, options) {
    if (!apiBase) throw new Error("운영 서버가 연결되지 않았습니다.");
    const response = await fetch(`${apiBase}${path}`, Object.assign({ credentials: "include" }, options || {}));
    const body = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(body.message || "요청을 처리하지 못했습니다.");
    return body;
  }
  function scoped(items) {
    if (!draft || !draft.draft.scopeKeys.length) return items;
    return items.filter(function (item) { return draft.draft.scopeKeys.some(function (scopeKey) { return item.curriculumPath === scopeKey || item.curriculumPath.startsWith(`${scopeKey}/`); }); });
  }
  function selectedIds() { return new Set(draft ? draft.draft.placements.map(function (placement) { return placement.itemId; }) : []); }
  function renderDraft() {
    const open = Boolean(draft);
    dom["builder-state"].textContent = open ? `저장됨 · r${draft.draft.revision}` : apiBase ? "초안 선택" : "운영 서버 필요";
    dom["builder-state"].className = `badge ${open ? "open" : "review"}`;
    dom["draft-revision"].textContent = open ? `${draft.draft.draftId} · revision ${draft.draft.revision}` : "초안을 열어 주세요.";
    dom["sort-mode"].value = open ? draft.draft.sortMode : "user";
    dom["view-mode"].value = open ? draft.draft.viewMode : "question";
    dom["scope-keys"].value = open ? draft.draft.scopeKeys.join("\n") : "";
    const placements = open ? draft.draft.placements : [];
    dom["selected-count"].textContent = `${placements.length}문항`;
    const totalScore = placements.reduce(function (sum, placement) { return sum + placement.score; }, 0);
    dom["draft-summary"].innerHTML = [["문항", `${placements.length}개`], ["총점", `${totalScore}점`], ["보기", draft ? ({ question: "문제", question_answer: "문제+정답", question_solution_answer: "문제+해설+정답" })[draft.draft.viewMode] : "-"]].map(function (entry) { return `<div><span>${entry[0]}</span><strong>${entry[1]}</strong></div>`; }).join("");
    dom["placement-list"].innerHTML = placements.map(function (placement) {
      return `<li class="builder-placement" draggable="true" data-placement-id="${esc(placement.placementId)}"><span class="builder-grip" aria-hidden="true">::</span><b>${String(placement.order).padStart(2, "0")}</b><div><strong>${esc(placement.itemId)}</strong><small>${esc(placement.itemVersionId)} · ${placement.score}점</small></div><div class="builder-placement-actions"><button type="button" data-replace="${esc(placement.placementId)}">교체</button><button type="button" data-remove="${esc(placement.placementId)}">삭제</button></div></li>`;
    }).join("") || '<li class="empty">왼쪽에서 검수 후보를 추가하세요.</li>';
    renderReplacement();
  }
  function renderReplacement() {
    const active = replacement.placementId && draft && draft.draft.placements.find(function (placement) { return placement.placementId === replacement.placementId; });
    dom["replace-context"].textContent = active ? `${active.order}번 문항 교체 · ${replacement.relationship === "manual" ? "직접 후보" : `${replacement.relationship === "twin" ? "쌍둥이" : "유사"} 후보`}` : "추가할 문항을 선택하세요.";
    document.querySelectorAll("[data-relation]").forEach(function (button) { button.classList.toggle("is-active", button.dataset.relation === replacement.relationship); button.disabled = !active && button.dataset.relation !== "manual"; });
  }
  function renderCandidates() {
    const visible = scoped(candidates);
    const selected = selectedIds();
    dom["candidate-count"].textContent = `${visible.length}개`;
    dom["candidate-list"].innerHTML = visible.map(function (item) {
      const disabled = selected.has(item.itemId) && (!replacement.placementId || draft.draft.placements.find(function (placement) { return placement.placementId === replacement.placementId; }).itemId !== item.itemId);
      const relation = item.replacement ? ` · ${item.replacement.relationship === "twin" ? "쌍둥이" : "유사"}` : "";
      return `<article class="builder-candidate${disabled ? " is-disabled" : ""}"><div><strong>${esc(item.typeCode)}</strong><small>${esc(item.curriculumPath)}</small><span>${difficulty(item.difficultyBand)} · ${esc(item.inputType)}${relation}</span></div><button type="button" data-candidate="${esc(item.itemId)}" ${disabled ? "disabled" : ""}>${replacement.placementId ? "교체" : "추가"}</button></article>`;
    }).join("") || '<div class="empty">현재 조건에서 검수 완료 후보가 없습니다.</div>';
  }
  async function loadCandidates() {
    if (!draft) { candidates = []; renderCandidates(); return; }
    const query = dom["candidate-search"].value.trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (replacement.placementId && replacement.relationship !== "manual") {
      const source = draft.draft.placements.find(function (placement) { return placement.placementId === replacement.placementId; });
      if (!source) return;
      params.set("sourceItemId", source.itemId); params.set("sourceItemVersionId", source.itemVersionId); params.set("relationship", replacement.relationship);
    }
    const packet = await request(`/admin/exam-editor/candidates?${params.toString()}`, { method: "GET" });
    candidates = packet.items || [];
    renderCandidates();
  }
  async function loadDrafts(selectedId) {
    const packet = await request("/admin/exam-editor/drafts", { method: "GET" });
    dom["draft-list"].innerHTML = '<option value="">새 초안 만들기</option>' + (packet.items || []).map(function (item) { return `<option value="${esc(item.draftId)}">${esc(item.targetId)} · ${item.itemCount}문항 · r${item.revision}</option>`; }).join("");
    if (selectedId) dom["draft-list"].value = selectedId;
  }
  async function openDraft(draftId) {
    draft = await request(`/admin/exam-editor/drafts/${encodeURIComponent(draftId)}`, { method: "GET" });
    replacement = { placementId: null, relationship: "manual" };
    renderDraft();
    await loadCandidates();
  }
  async function edit(operation) {
    if (!draft) throw new Error("먼저 시험지 초안을 열어 주세요.");
    const result = await request(`/admin/exam-editor/drafts/${encodeURIComponent(draft.draftId)}`, {
      method: "PATCH", headers: headers(), body: JSON.stringify({ expectedRevision: draft.draft.revision, operation })
    });
    draft = result.record;
    renderDraft();
    if (result.reconciliation) {
      const issueCount = result.reconciliation.outOfScopePlacementIds.length + result.reconciliation.classificationPendingPlacementIds.length;
      dom["scope-status"].textContent = issueCount ? `범위 밖 ${result.reconciliation.outOfScopePlacementIds.length}문항 · 분류 확인 필요 ${result.reconciliation.classificationPendingPlacementIds.length}문항` : "모든 선택 문항이 현재 범위에 들어옵니다.";
    }
    await loadCandidates();
  }
  async function addOrReplace(itemId) {
    const item = candidates.find(function (candidate) { return candidate.itemId === itemId; });
    if (!item) throw new Error("현재 검수 후보를 다시 불러와 주세요.");
    if (replacement.placementId) {
      const operation = { kind: "replace", placementId: replacement.placementId, itemId: item.itemId, itemVersionId: item.itemVersionId, relationship: replacement.relationship };
      if (replacement.relationship !== "manual") operation.evidenceId = item.replacement && item.replacement.evidenceId;
      await edit(operation);
      replacement = { placementId: null, relationship: "manual" };
      renderDraft();
      status("문항을 교체했습니다. 교체 이력과 근거 ID가 저장되었습니다.", "ok");
      return;
    }
    const placementId = `placement_${crypto.randomUUID().replace(/-/g, "")}`;
    await edit({ kind: "add", placementId, itemId: item.itemId, itemVersionId: item.itemVersionId, score: 1, selectionKind: "manual" });
    status("검수된 문항을 시험지 끝에 추가했습니다.", "ok");
  }
  document.getElementById("create-draft").addEventListener("click", async function () {
    try {
      const profileId = dom["profile-id"].value.trim().toUpperCase();
      const targetId = dom["target-id"].value.trim();
      const durationMinutes = Number(dom["duration-minutes"].value);
      const created = await request("/admin/exam-editor/drafts", { method: "POST", headers: headers(), body: JSON.stringify({ profileId, targetId, durationMinutes, scopeKeys: [] }) });
      draft = created; replacement = { placementId: null, relationship: "manual" }; renderDraft(); await loadDrafts(draft.draftId); await loadCandidates(); status("새 초안을 만들었습니다. 범위를 입력한 뒤 후보를 추가하세요.", "ok");
    } catch (error) { status(error.message, "error"); }
  });
  dom["refresh-drafts"].addEventListener("click", function () { loadDrafts(draft && draft.draftId).catch(function (error) { status(error.message, "error"); }); });
  dom["draft-list"].addEventListener("change", function () { if (dom["draft-list"].value) openDraft(dom["draft-list"].value).catch(function (error) { status(error.message, "error"); }); });
  dom["candidate-search"].addEventListener("input", function () { loadCandidates().catch(function (error) { status(error.message, "error"); }); });
  dom["candidate-list"].addEventListener("click", function (event) { const button = event.target.closest("[data-candidate]"); if (button) addOrReplace(button.dataset.candidate).catch(function (error) { status(error.message, "error"); }); });
  document.querySelectorAll("[data-relation]").forEach(function (button) { button.addEventListener("click", function () { replacement.relationship = button.dataset.relation; renderReplacement(); loadCandidates().catch(function (error) { status(error.message, "error"); }); }); });
  dom["placement-list"].addEventListener("click", function (event) {
    const remove = event.target.closest("[data-remove]"); const replace = event.target.closest("[data-replace]");
    if (remove) edit({ kind: "remove", placementId: remove.dataset.remove }).then(function () { status("문항 배치를 삭제했습니다. 원문은 그대로입니다.", "ok"); }).catch(function (error) { status(error.message, "error"); });
    if (replace) { replacement.placementId = replace.dataset.replace; replacement.relationship = "manual"; renderReplacement(); loadCandidates().catch(function (error) { status(error.message, "error"); }); }
  });
  dom["placement-list"].addEventListener("dragstart", function (event) { const row = event.target.closest("[data-placement-id]"); if (row) { dragPlacementId = row.dataset.placementId; row.classList.add("is-dragging"); } });
  dom["placement-list"].addEventListener("dragover", function (event) { if (dragPlacementId) event.preventDefault(); });
  dom["placement-list"].addEventListener("drop", function (event) { const target = event.target.closest("[data-placement-id]"); if (!dragPlacementId || !target || target.dataset.placementId === dragPlacementId) return; event.preventDefault(); const index = draft.draft.placements.findIndex(function (placement) { return placement.placementId === target.dataset.placementId; }); edit({ kind: "move", placementId: dragPlacementId, toIndex: index }).then(function () { status("문항 순서를 저장했습니다.", "ok"); }).catch(function (error) { status(error.message, "error"); }); });
  dom["placement-list"].addEventListener("dragend", function () { dragPlacementId = null; document.querySelectorAll(".builder-placement").forEach(function (row) { row.classList.remove("is-dragging"); }); });
  dom["sort-mode"].addEventListener("change", function () { edit({ kind: "sort", mode: dom["sort-mode"].value, seed: 20260825 }).catch(function (error) { status(error.message, "error"); }); });
  dom["view-mode"].addEventListener("change", function () { edit({ kind: "set_view", viewMode: dom["view-mode"].value }).catch(function (error) { status(error.message, "error"); }); });
  dom["apply-scope"].addEventListener("click", function () { const scopeKeys = dom["scope-keys"].value.split(/\r?\n/).map(function (value) { return value.trim(); }).filter(Boolean); edit({ kind: "change_scope", scopeKeys }).catch(function (error) { status(error.message, "error"); }); });
  dom["check-readiness"].addEventListener("click", async function () { try { if (!draft) throw new Error("먼저 시험지 초안을 열어 주세요."); const result = await request(`/admin/exam-editor/drafts/${encodeURIComponent(draft.draftId)}/readiness`, { method: "GET" }); status(result.eligible ? `확정 가능: ${result.projection.entries.length}문항이 현재 검수를 통과했습니다.` : `확정 잠김: ${result.issues.join(" · ")}`, result.eligible ? "ok" : "error"); } catch (error) { status(error.message, "error"); } });
  if (!apiBase) status("운영 서버가 연결되지 않았습니다. 정적 화면에서는 시험지 초안을 만들거나 수정할 수 없습니다.", "error");
  renderDraft(); renderCandidates(); if (apiBase) loadDrafts().catch(function (error) { status(error.message, "error"); });
})(typeof window !== "undefined" ? window : globalThis);
