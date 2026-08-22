(function () {
  "use strict";
  const adminSession = HIGHSELECT_AUTH.requireAdmin("../login.html");
  if (!adminSession) return;

  const inventory = HIGHSELECT_SH_R01_REVIEW_INVENTORY.inventory;
  const security = HIGHSELECT_REVIEW_EVIDENCE_SECURITY;
  const api = String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, "");
  const notice = document.getElementById("evidence-notice");
  const root = document.getElementById("evidence-panels");
  const title = document.getElementById("evidence-title");
  const meta = document.getElementById("evidence-meta");
  const number = Number(new URLSearchParams(location.search).get("number"));
  const item = inventory.items.find(function (candidate) { return candidate.number === number; });
  const roleLabels = Object.freeze({
    problem: "문제 원본 구간",
    "source-key": "원답·풀이 구간",
    "independent-audit": "독립 검산 결정안"
  });

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character];
    });
  }
  function fail(message) {
    notice.textContent = message;
    notice.className = "notice error";
    root.replaceChildren();
  }
  function render(packet) {
    title.textContent = `${packet.number}번 근거 검수`;
    meta.textContent = `${item.curriculumCandidate.label} · ${item.majorCandidate.label} · ${item.detailCandidate.label}`;
    root.innerHTML = packet.panels.map(function (panel) {
      return `<article class="panel evidence-panel"><div class="evidence-panel-head"><p class="eyebrow">Protected Evidence</p><h2>${esc(roleLabels[panel.role])}</h2></div><div class="secure-image-frame" data-watermark="${esc(adminSession.name)} · SH-R01 · Q${packet.number}"><img src="${esc(panel.url)}" alt="${esc(roleLabels[panel.role])}" referrerpolicy="no-referrer" draggable="false"></div></article>`;
    }).join("");
    root.querySelectorAll("img").forEach(function (image) { image.addEventListener("contextmenu", function (event) { event.preventDefault(); }); });
    notice.textContent = `원본 지문 일치 · ${new Date(packet.expiresAt).toLocaleTimeString("ko-KR")}까지 표시 · 이 화면은 승인 결정 자체가 아닙니다.`;
    notice.className = "notice";
  }
  async function load() {
    if (!item || !Number.isSafeInteger(number)) { fail("검수할 문항 번호가 올바르지 않습니다."); return; }
    title.textContent = `${number}번 근거 검수`;
    meta.textContent = `${item.curriculumCandidate.label} · ${item.detailCandidate.label}`;
    if (!api) { fail("운영 검수 서버가 연결되지 않아 보호 근거를 열 수 없습니다."); return; }
    try {
      const response = await fetch(`${api}/admin/exam-reviews/${encodeURIComponent(security.EXAM_ID)}/items/${number}/evidence`, {
        credentials: "include",
        cache: "no-store",
        headers: { "Accept": "application/json" }
      });
      if (!String(response.headers.get("Cache-Control") || "").toLowerCase().includes("no-store")) throw new Error("검수 근거 응답의 캐시 차단 헤더가 없습니다.");
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(data.message || "보호 근거를 불러오지 못했습니다.");
      render(security.validateEvidencePacket(data, item, HIGHSELECT_RUNTIME));
    } catch (error) { fail(error.message); }
  }
  load();
})();
