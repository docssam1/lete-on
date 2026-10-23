(function () {
  "use strict";
  const roadmap = window.GFIELDBoardingGradeRoadmap;
  const analyzer = window.GFIELDPaperReviewAnalysis;
  if (!roadmap || !analyzer) return;
  const $ = function (id) { return document.getElementById(id); };
  const params = new URLSearchParams(location.search);
  let grade = roadmap.getGrade(params.get("grade")) ? Number(params.get("grade")) : 7;
  let programId = params.get("program") || "amc8";
  const statuses = [{ id: "unmarked", title: "미입력" }, { id: "correct", title: "O · 정답" }, { id: "wrong", title: "X · 오답" }, { id: "blank", title: "미응답" }];
  const domains = [{ id: "unclassified", title: "분류 전" }].concat(roadmap.strands.map(function (entry) { return { id: entry.id, title: entry.title }; }));
  const reasons = [{ id: "none", title: "선택 안 함" }, { id: "concept", title: "개념" }, { id: "approach", title: "접근 아이디어" }, { id: "calculation", title: "계산" }, { id: "reading", title: "조건 읽기" }, { id: "time", title: "시간" }];
  function setText(id, value) { $(id).textContent = value; }
  function selectedFormat() { return roadmap.competitionOptions(grade).find(function (entry) { return entry.id === programId; }); }
  function option(value, title) { const node = document.createElement("option"); node.value = value; node.textContent = title; return node; }
  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    url.searchParams.set("program", programId);
    history.replaceState(null, "", url);
    $("back-to-roadmap").href = `./boarding-roadmap.html?grade=${grade}`;
  }
  function resetReport(message) {
    setText("report-title", message || "분석 전");
    setText("report-intro", "표시한 문항의 수와 영역별 근거를 나란히 보여 줍니다. 입력 중인 문항을 0점이나 오답으로 계산하지 않습니다.");
    setText("report-next", "현재 학생의 학습 수준은 미측정입니다.");
    $("report-metrics").replaceChildren();
    $("report-domains").replaceChildren();
    $("report-reasons").replaceChildren();
    $("paper-error").hidden = true;
  }
  function renderSettings() {
    const gradeSelect = $("review-grade");
    if (!gradeSelect.childElementCount) roadmap.grades.forEach(function (entry) { gradeSelect.append(option(String(entry.grade), `Grade ${entry.grade}`)); });
    gradeSelect.value = String(grade);
    const programSelect = $("review-program");
    const formats = roadmap.competitionOptions(grade);
    if (!formats.some(function (entry) { return entry.id === programId; })) programId = grade >= 6 && grade <= 8 ? "amc8" : "sasmo";
    programSelect.replaceChildren();
    formats.forEach(function (entry) { programSelect.append(option(entry.id, `${entry.title} · ${entry.itemCount}문항`)); });
    programSelect.value = programId;
    setText("review-source-note", `${selectedFormat().title}의 ${selectedFormat().itemCount}칸을 만듭니다. 공식 문제지·정답은 별도로 확인하고, 각 문항을 한 영역에만 분류하세요. 알 수 없으면 ‘분류 전’을 유지합니다.`);
    updateUrl();
  }
  function renderMarks() {
    const list = $("paper-mark-list");
    list.replaceChildren();
    for (let index = 0; index < selectedFormat().itemCount; index += 1) {
      const number = index + 1;
      const li = document.createElement("li");
      li.className = "paper-mark-row";
      const marker = document.createElement("strong");
      marker.textContent = `Q${String(number).padStart(2, "0")}`;
      li.append(marker);
      [
        { field: "status", values: statuses, label: "표시" },
        { field: "domain", values: domains, label: "영역" },
        { field: "reason", values: reasons, label: "오류 이유" }
      ].forEach(function (config) {
        const select = document.createElement("select");
        select.dataset.field = config.field;
        select.dataset.question = String(number);
        select.setAttribute("aria-label", `${number}번 ${config.label}`);
        config.values.forEach(function (entry) { select.append(option(entry.id, entry.title)); });
        if (config.field === "reason") select.disabled = true;
        select.addEventListener("change", function () {
          if (config.field === "status") {
            const reasonSelect = li.querySelector('[data-field="reason"]');
            reasonSelect.disabled = select.value !== "wrong";
            if (reasonSelect.disabled) reasonSelect.value = "none";
            if (select.value === "unmarked") li.querySelector('[data-field="domain"]').value = "unclassified";
          }
          resetReport("입력 변경됨 · 다시 분석하세요");
        });
        li.append(select);
      });
      list.append(li);
    }
    resetReport();
  }
  function readMarks() {
    return Array.from($("paper-mark-list").children, function (li) {
      return { status: li.querySelector('[data-field="status"]').value,
        domain: li.querySelector('[data-field="domain"]').value,
        reason: li.querySelector('[data-field="reason"]').value };
    });
  }
  function metric(label, value, note) {
    const node = document.createElement("div");
    const title = document.createElement("span"); title.textContent = label;
    const number = document.createElement("strong"); number.textContent = value;
    const small = document.createElement("small"); small.textContent = note;
    node.append(title, number, small); return node;
  }
  function renderResult(result) {
    const label = $("review-paper-label").value.trim();
    setText("report-title", `${selectedFormat().title} · ${result.complete ? "전체 표시" : "부분 표시"}`);
    setText("report-intro", `${label ? `${label} · ` : ""}${result.itemCount}문항 중 ${result.counts.unmarked}문항은 아직 입력하지 않았습니다. 정답률은 실제로 푼 ${result.attempted}문항만으로 계산합니다.`);
    const metrics = $("report-metrics");
    metrics.replaceChildren(
      metric("정답", String(result.counts.correct), "입력한 O"),
      metric("오답", String(result.counts.wrong), "입력한 X"),
      metric("미응답", String(result.counts.blank), "풀지 않은 문항"),
      metric("푼 문항 중", result.accuracy === null ? "—" : `${result.accuracy}%`, "공식 점수 아님")
    );
    const domainHost = $("report-domains");
    domainHost.replaceChildren();
    const heading = document.createElement("h3"); heading.textContent = "영역별 비교"; domainHost.append(heading);
    result.domains.forEach(function (domain) {
      const row = document.createElement("div"); row.className = "report-domain-row";
      const title = document.createElement("strong"); title.textContent = domain.name;
      const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted} · ${domain.rate}%` : "—";
      const detail = document.createElement("small"); detail.textContent = `${domain.evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
      row.append(title, value, detail); domainHost.append(row);
    });
    const reasonHost = $("report-reasons");
    reasonHost.replaceChildren();
    const reasonHeading = document.createElement("h3"); reasonHeading.textContent = "표시한 오류 이유"; reasonHost.append(reasonHeading);
    if (result.reasons.length) result.reasons.forEach(function (reason) {
      const row = document.createElement("p"); row.textContent = `${reason.name} · ${reason.count}문항`; reasonHost.append(row);
    });
    else { const empty = document.createElement("p"); empty.textContent = "아직 선택된 오류 이유가 없습니다."; reasonHost.append(empty); }
    setText("report-next", result.reviewFirst
      ? `${result.reviewFirst} 문항의 풀이 과정을 먼저 다시 살펴보세요. 이 비교만으로 학교 수준이나 다음 대회를 배정하지 않습니다.`
      : `비교 가능한 영역 간 우선순위는 아직 정하지 않습니다.${result.unclassified ? ` 분류 전 ${result.unclassified}문항을 교사와 확인하세요.` : ""}`);
  }
  $("review-grade").addEventListener("change", function (event) { grade = Number(event.target.value); renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-program").addEventListener("change", function (event) { programId = event.target.value; renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-paper-label").addEventListener("input", function () { resetReport("입력 변경됨 · 다시 분석하세요"); });
  $("clear-marks").addEventListener("click", function () { renderMarks(); $("review-paper-label").value = ""; });
  $("paper-review-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const result = analyzer.analyze(readMarks(), selectedFormat().itemCount);
    if (!result.valid) { setText("paper-error", result.error); $("paper-error").hidden = false; return; }
    $("paper-error").hidden = true;
    renderResult(result);
  });
  renderSettings();
  renderMarks();
})();
