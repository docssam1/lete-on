(function () {
  "use strict";
  const adminSession = HIGHSELECT_AUTH.requireAdmin("../login.html");
  if (!adminSession) return;

  const inventory = HIGHSELECT_SH_R01_REVIEW_INVENTORY.inventory;
  const summarySecurity = HIGHSELECT_REVIEW_SUMMARY_SECURITY;
  const itemSecurity = HIGHSELECT_REVIEW_SECURITY;
  const releaseGate = HIGHSELECT_SH_R01_RELEASE_GATE;
  const summary = summarySecurity.createSummary(inventory);
  const exam = HIGHSELECT_CATALOG.exams.find(function (item) { return item.id === itemSecurity.EXAM_ID; });
  const api = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const connected = !!api;
  const rows = document.getElementById("summary-rows");
  const notice = document.getElementById("round-review-notice");
  const state = document.getElementById("round-review-state");
  const filter = document.getElementById("summary-queue-filter");
  const approve = document.getElementById("round-approve");
  const releaseReadiness = document.getElementById("summary-release-readiness");
  let packet = itemSecurity.createPendingPacket(inventory);

  function esc(value) {
    const span = document.createElement("span");
    span.textContent = String(value == null ? "" : value);
    return span.innerHTML;
  }

  function itemByNumber(number) {
    return inventory.items.find(function (item) { return item.number === number; });
  }

  function classificationLabel(row) {
    if (row.queue !== "classification") return "보호 근거에서만 확인";
    return `${esc(row.curriculumCandidate.label)} · ${esc(row.majorCandidate.label)}<small>${esc(row.detailCandidate.label)}</small>`;
  }

  function completionLabel(row) {
    if (row.status === "pending") return row.queue === "classification" ? "분류 검수 대기" : "교정 실행 대기";
    return row.action === "replace" && row.protectedArtifactStatus === "verified" ? "보호 산출물 확인" : "검수 완료";
  }

  function render() {
    const queue = filter.value;
    rows.innerHTML = summary.items.map(function (row) {
      if (queue !== "ALL" && row.queue !== queue) return "";
      const item = itemByNumber(row.number);
      const queueLabel = row.queue === "blocked" ? "차단 해소" : "분류 검수";
      return `<tr>
        <td><b>${row.number}</b><small>p.${item.sourcePage}</small></td>
        <td><span class="badge ${row.queue === "blocked" ? "locked" : "review"}">${queueLabel}</span></td>
        <td><b>${esc(row.label)}</b><small>원본 보존 · 변경이력 ${esc(summary.reviewVersion)}</small></td>
        <td>${classificationLabel(row)}</td>
        <td><span class="badge ${row.status === "pending" ? "review" : "open"}">${completionLabel(row)}</span></td>
        <td><a class="button ghost evidence-link" href="./item-review.html?number=${row.number}">보호 근거</a></td>
      </tr>`;
    }).join("");
    document.getElementById("summary-total").textContent = summary.items.length;
    document.getElementById("summary-blocked").textContent = summary.blockedCount;
    document.getElementById("summary-classification").textContent = summary.classificationCount;
    document.getElementById("summary-pending").textContent = summary.items.filter(function (item) { return item.status !== "agent-reviewed"; }).length;
    const readiness = releaseGate.evaluate(exam, inventory, packet, packet.finalConfirmation || null);
    if (readiness.finalConfirmed) {
      releaseReadiness.textContent = "시험 1회 전체 확인이 완료되었습니다. 운영 공개 승격 상태를 확인합니다.";
    } else if (readiness.readyForFinalConfirmation) {
      releaseReadiness.textContent = "모든 문항·교정·분류·응답·채점·인쇄·서명 자산 검수가 통과했습니다. 시험 전체를 한 번 확인할 수 있습니다.";
    } else {
      releaseReadiness.textContent = `전체 미처리 ${readiness.counts.unresolvedItemCount}건 · 교정 실행 ${readiness.counts.correctionExecutionPendingCount}건 · 분류 검수 ${readiness.counts.classificationPendingCount}건`;
    }
    approve.disabled = !connected || !readiness.readyForFinalConfirmation || readiness.finalConfirmed;
    approve.textContent = readiness.finalConfirmed ? "최종 확인 완료" : "시험 전체 최종 확인";
  }

  async function request(path, options) {
    if (!connected) throw new Error("운영 검수 서버가 연결되지 않았습니다.");
    const response = await fetch(api + path, Object.assign({
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Highselect-Admin": "1" }
    }, options || {}));
    if (!String(response.headers.get("Cache-Control") || "").toLowerCase().includes("no-store")) throw new Error("검수 응답의 캐시 차단 헤더가 없습니다.");
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.message || "회차 검수 요청을 처리하지 못했습니다.");
    return data;
  }

  async function load() {
    if (!connected) {
      state.textContent = "읽기 전용";
      state.className = "badge locked";
      notice.textContent = "변경이력은 읽기 전용으로 확인할 수 있습니다. 최종 시험 확인은 전체 릴리스 게이트가 통과한 운영 검수 서버에서만 기록합니다.";
      render();
      return;
    }
    try {
      const next = await request(`/admin/exam-reviews/${encodeURIComponent(itemSecurity.EXAM_ID)}`);
      const issues = itemSecurity.validateStatusPacket(next, inventory);
      if (issues.length) throw new Error(`문항 검수 상태 형식 오류: ${issues.join(", ")}`);
      packet = next;
      const readiness = releaseGate.evaluate(exam, inventory, packet, packet.finalConfirmation || null);
      state.textContent = readiness.finalConfirmed ? "최종 확인 완료" : readiness.readyForFinalConfirmation ? "최종 확인 가능" : "변경이력 열람";
      state.className = readiness.finalConfirmed ? "badge open" : "badge review";
      render();
    } catch (error) {
      state.textContent = "상태 불러오기 실패";
      state.className = "badge locked";
      notice.textContent = error.message;
      render();
    }
  }

  async function decide() {
    if (!confirm("SH-R01 시험 1회 전체를 최종 확인할까요?")) return;
    try {
      const payload = releaseGate.buildFinalConfirmationRequest(exam, inventory, packet);
      await request(`/admin/exam-reviews/${encodeURIComponent(itemSecurity.EXAM_ID)}/final-confirmation`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      await load();
    } catch (error) { notice.textContent = error.message; }
  }

  filter.addEventListener("change", render);
  document.getElementById("summary-reload").addEventListener("click", load);
  approve.addEventListener("click", decide);
  load();
})();
