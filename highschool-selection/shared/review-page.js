(function () {
  "use strict";
  const adminSession = HIGHSELECT_AUTH.requireAdmin("../login.html");
  if (!adminSession) return;

  const inventory = HIGHSELECT_SH_R01_REVIEW_INVENTORY.inventory;
  const security = HIGHSELECT_REVIEW_SECURITY;
  const releaseGate = HIGHSELECT_SH_R01_RELEASE_GATE;
  const exam = HIGHSELECT_CATALOG.exams.find(function (item) { return item.id === security.EXAM_ID; });
  const api = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const connected = !!api;
  const rows = document.getElementById("review-rows");
  const state = document.getElementById("review-state");
  const notice = document.getElementById("review-notice");
  const gradeFilter = document.getElementById("grade-filter");
  const statusFilter = document.getElementById("status-filter");
  const finalConfirmation = document.getElementById("final-confirmation");
  const releaseReadiness = document.getElementById("release-readiness");
  let packet = security.createPendingPacket(inventory);

  function esc(value) {
    const span = document.createElement("span");
    span.textContent = String(value == null ? "" : value);
    return span.innerHTML;
  }

  function badge(label, kind) { return `<span class="badge ${kind || ""}">${esc(label)}</span>`; }
  function statusLabel(value) {
    return ({
      pending: "대기", verified: "검증", passed: "통과", blocked: "차단",
      agent_verified: "검증 확정", replacement_verified: "대체 검증", scoring_excluded: "채점 제외"
    })[value] || value;
  }
  function statusKind(value) {
    if (value === "verified" || value === "passed" || value === "agent_verified" || value === "replacement_verified") return "open";
    if (value === "blocked" || value === "scoring_excluded") return "locked";
    return "review";
  }
  function gradeGroup(item) {
    const code = item.curriculumCandidate.code;
    if (code.includes("G7")) return "G7";
    if (code.includes("G8")) return "G8";
    if (code.includes("G9")) return "G9";
    return "LINK";
  }
  function visible(item, itemStatus) {
    const grade = gradeFilter.value;
    const review = statusFilter.value;
    if (grade !== "ALL" && gradeGroup(item) !== grade) return false;
    if (review === "READY" && !security.canResolve(item, itemStatus, "agent_verify")) return false;
    if (review === "PENDING" && itemStatus.resolutionStatus !== "pending") return false;
    if (review === "RESOLVED" && itemStatus.resolutionStatus === "pending") return false;
    if (review === "EXCLUDED" && itemStatus.resolutionStatus !== "scoring_excluded") return false;
    return true;
  }
  function correctionDecision(number) {
    const list = inventory.agentDecisionSummary && inventory.agentDecisionSummary.items || [];
    return list.find(function (item) { return item.number === number; }) || null;
  }
  function queueBadges(item) {
    const parts = [];
    const decision = correctionDecision(item.number);
    const kindLabels = {
      same_type_same_difficulty: "동유형·동난도 대체",
      answer_key: "정답키 교정",
      independent_answer_verification: "독립검산 반영",
      solution_typo: "풀이 오기 교정",
      table_layout: "표 배치 보정"
    };
    if (decision) parts.push(badge(kindLabels[decision.correctionKind] || "교정 실행", "locked"));
    if (inventory.classificationReviewSummary.ownerReviewItems.includes(item.number)) parts.push(badge("분류 검수", "review"));
    if ((inventory.classificationReviewSummary.agentVerifiedItems || []).includes(item.number)) parts.push(badge("분류 확정", "open"));
    return parts.join(" ") || badge("일반 검수", "");
  }
  function metrics() {
    const readiness = releaseGate.evaluate(exam, inventory, packet, packet.finalConfirmation || null);
    const resolved = packet.items.filter(releaseGate.rowIsSafelyResolved).length;
    document.getElementById("metric-total").textContent = inventory.items.length;
    document.getElementById("metric-correction-pending").textContent = readiness.counts.correctionExecutionPendingCount;
    document.getElementById("metric-classification-pending").textContent = readiness.counts.classificationPendingCount;
    document.getElementById("metric-resolved").textContent = resolved;
    if (readiness.finalConfirmed) {
      releaseReadiness.textContent = "시험 1회 전체 확인이 완료되었습니다. 운영 서버의 공개 승격 상태를 확인합니다.";
    } else if (readiness.readyForFinalConfirmation) {
      releaseReadiness.textContent = "40문항 처리가 끝났습니다. 시험 전체를 한 번 확인하면 출시 승격을 요청할 수 있습니다.";
    } else if (!readiness.counts.unresolvedItemCount && !readiness.examChecksReady) {
      releaseReadiness.textContent = "문항 처리는 끝났지만 답안 입력 구성·채점 정책·인쇄본·서명 자산 검수가 남았습니다.";
    } else {
      releaseReadiness.textContent = `교정 실행 ${readiness.counts.correctionExecutionPendingCount}건 · 분류 검수 ${readiness.counts.classificationPendingCount}건 · 전체 미처리 ${readiness.counts.unresolvedItemCount}건`;
    }
    finalConfirmation.disabled = !connected || !readiness.readyForFinalConfirmation || readiness.finalConfirmed;
    finalConfirmation.textContent = readiness.finalConfirmed ? "최종 확인 완료" : "최종 1회 확인";
  }
  function render() {
    const byNumber = new Map(packet.items.map(function (item) { return [item.number, item]; }));
    rows.innerHTML = inventory.items.map(function (item) {
      const itemStatus = byNumber.get(item.number);
      if (!itemStatus || !visible(item, itemStatus)) return "";
      const canVerify = connected && security.canResolve(item, itemStatus, "agent_verify");
      const canReplace = connected && security.canResolve(item, itemStatus, "replacement_verified");
      const canExclude = connected && security.canResolve(item, itemStatus, "scoring_excluded");
      return `<tr>
        <td><b>${item.number}</b><small>p.${item.sourcePage}</small></td>
        <td>${queueBadges(item)}</td>
        <td><b>${esc(item.curriculumCandidate.label)}</b><small>${esc(item.curriculumCandidate.code)}</small></td>
        <td><b>${esc(item.majorCandidate.label)}</b><small>${esc(item.detailCandidate.label)}</small></td>
        <td>${esc(item.responseCandidate)}</td>
        <td>${badge(statusLabel(itemStatus.answerStatus), statusKind(itemStatus.answerStatus))}</td>
        <td>${badge(statusLabel(itemStatus.classificationStatus), statusKind(itemStatus.classificationStatus))}</td>
        <td>${badge(statusLabel(itemStatus.visualStatus), statusKind(itemStatus.visualStatus))}</td>
        <td>${badge(statusLabel(itemStatus.resolutionStatus), statusKind(itemStatus.resolutionStatus))}</td>
        <td><a class="button ghost evidence-link" href="./item-review.html?number=${item.number}">근거</a>
        <button class="accent review-action" data-number="${item.number}" data-resolution="agent_verify" ${canVerify ? "" : "disabled"}>검증 확정</button>
        <button class="ghost review-action" data-number="${item.number}" data-resolution="replacement_verified" ${canReplace ? "" : "disabled"}>대체 검증</button>
        <button class="ghost review-action" data-number="${item.number}" data-resolution="scoring_excluded" ${canExclude ? "" : "disabled"}>채점 제외</button></td>
      </tr>`;
    }).join("");
    metrics();
  }

  async function request(path, options) {
    if (!connected) throw new Error("운영 검수 서버가 연결되지 않았습니다.");
    const response = await fetch(api + path, Object.assign({
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" }
    }, options || {}));
    if (!String(response.headers.get("Cache-Control") || "").toLowerCase().includes("no-store")) throw new Error("검수 응답의 캐시 차단 헤더가 없습니다.");
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.message || "검수 요청을 처리하지 못했습니다.");
    return data;
  }
  async function load() {
    if (!connected) {
      notice.textContent = "정적 화면은 후보 분류만 보여 줍니다. 정답 검산·분류 검증·시각 감사 상태와 승인 결정은 운영 서버에서만 저장합니다.";
      state.textContent = "읽기 전용";
      state.className = "badge locked";
      render();
      return;
    }
    try {
      const next = await request(`/admin/exam-reviews/${encodeURIComponent(security.EXAM_ID)}`);
      const issues = security.validateStatusPacket(next, inventory);
      if (issues.length) throw new Error(`검수 상태 형식 오류: ${issues.join(", ")}`);
      packet = next;
      state.textContent = "운영 검수 연결";
      state.className = "badge open";
      render();
    } catch (error) {
      state.textContent = "검수 불러오기 실패";
      state.className = "badge locked";
      notice.textContent = error.message;
      render();
    }
  }

  rows.addEventListener("click", async function (event) {
    const button = event.target.closest("[data-resolution]");
    if (!button || button.disabled) return;
    const number = Number(button.dataset.number);
    const decision = button.dataset.resolution;
    const decisionLabels = { agent_verify: "검증 확정", replacement_verified: "대체 문항 검증", scoring_excluded: "채점 제외" };
    if (!confirm(`${number}번을 ${decisionLabels[decision] || "처리"}할까요?`)) return;
    try {
      const payload = security.buildResolutionRequest(packet, inventory, number, decision);
      await request(`/admin/exam-reviews/${encodeURIComponent(security.EXAM_ID)}/items/${number}/resolution`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await load();
    } catch (error) { notice.textContent = error.message; }
  });
  gradeFilter.addEventListener("change", render);
  statusFilter.addEventListener("change", render);
  document.getElementById("review-reload").addEventListener("click", load);
  finalConfirmation.addEventListener("click", async function () {
    if (finalConfirmation.disabled || !confirm("SH-R01 시험 1회 전체를 최종 확인할까요?")) return;
    try {
      const payload = releaseGate.buildFinalConfirmationRequest(exam, inventory, packet);
      await request(`/admin/exam-reviews/${encodeURIComponent(security.EXAM_ID)}/final-confirmation`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await load();
    } catch (error) { notice.textContent = error.message; }
  });
  load();
})();
