(function () {
  "use strict";
  const roadmap = window.GFIELDBoardingGradeRoadmap;
  const analyzer = window.GFIELDPaperReviewAnalysis;
  if (!roadmap || !analyzer) return;
  const $ = function (id) { return document.getElementById(id); };
  const params = new URLSearchParams(location.search);
  let grade = roadmap.getGrade(params.get("grade")) ? Number(params.get("grade")) : 7;
  let programId = params.get("program") || "";
  const statuses = [{ id: "unmarked", title: "표시 안 함" }, { id: "correct", title: "O · 맞힘" }, { id: "wrong", title: "X · 틀림" }, { id: "blank", title: "안 품" }];
  const domains = [{ id: "unclassified", title: "영역 선택" }].concat(roadmap.strands.map(function (entry) { return { id: entry.id, title: entry.title }; }));
  const reasons = [{ id: "none", title: "이유 선택" }, { id: "concept", title: "개념" }, { id: "approach", title: "풀이 생각" }, { id: "calculation", title: "계산" }, { id: "reading", title: "조건 읽기" }, { id: "time", title: "시간" }];
  function setText(id, value) { $(id).textContent = value; }
  function selectedFormat() { return roadmap.competitionOptions(grade).find(function (entry) { return entry.id === programId; }); }
  function option(value, title) { const node = document.createElement("option"); node.value = value; node.textContent = title; return node; }
  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    if (programId) url.searchParams.set("program", programId);
    else url.searchParams.delete("program");
    history.replaceState(null, "", url);
    $("back-to-roadmap").href = `./boarding-roadmap.html?grade=${grade}`;
  }
  function resetReport(message) {
    $("paper-error").hidden = true;
    document.querySelector(".review-report").hidden = true;
    document.querySelector(".review-layout").classList.add("is-empty");
    setText("report-title", message || "아직 결과가 없어요");
    setText("report-intro", "문제를 표시한 뒤 ‘결과 보기’를 누르세요. 표시하지 않은 문제는 정답률에 넣지 않아요.");
    setText("report-next", "학습 단계를 정하려면 실제 풀이를 확인해야 해요.");
    $("report-metrics").replaceChildren();
    $("report-domains").replaceChildren();
    $("report-reasons").replaceChildren();
  }
  function renderSettings() {
    const gradeSelect = $("review-grade");
    if (!gradeSelect.childElementCount) roadmap.grades.forEach(function (entry) { gradeSelect.append(option(String(entry.grade), `Grade ${entry.grade}`)); });
    gradeSelect.value = String(grade);
    const programSelect = $("review-program");
    const formats = roadmap.competitionOptions(grade);
    if (!formats.some(function (entry) { return entry.id === programId; })) programId = "";
    programSelect.replaceChildren();
    programSelect.append(option("", "대회를 선택해 주세요"));
    formats.forEach(function (entry) { programSelect.append(option(entry.id, `${entry.title} · ${entry.itemCount}문항`)); });
    programSelect.value = programId;
    const format = selectedFormat();
    $("review-paper-label-field").hidden = !format;
    document.querySelector(".review-change-note").hidden = !format;
    $("review-amc8-practice").hidden = !(grade === 6 && programId === "amc8");
    $("review-sasmo-source").hidden = programId !== "sasmo";
    document.querySelector(".review-related").hidden = !format;
    setText("review-source-note", format
      ? `${format.title} · ${format.itemCount}문항. 채점한 문제지를 보며 표시하세요. 영역을 모르면 비워 두세요.`
      : "먼저 대회를 선택하세요.");
    updateUrl();
  }
  function renderMarks() {
    const list = $("paper-mark-list");
    list.replaceChildren();
    const format = selectedFormat();
    list.hidden = !format;
    document.querySelector(".mark-head").hidden = !format;
    document.querySelector(".review-form-actions").hidden = !format;
    if (!format) { resetReport(); return; }
    for (let index = 0; index < format.itemCount; index += 1) {
      const number = index + 1;
      const li = document.createElement("li");
      li.className = "paper-mark-row";
      li.dataset.state = "unmarked";
      const marker = document.createElement("strong");
      marker.textContent = `Q${String(number).padStart(2, "0")}`;
      li.append(marker);
      [
        { field: "status", values: statuses, label: "표시" },
        { field: "domain", values: domains, label: "영역" },
        { field: "reason", values: reasons, label: "오류 이유" }
      ].forEach(function (config) {
        const field = document.createElement("label");
        field.className = `mark-field mark-${config.field}`;
        const caption = document.createElement("span"); caption.textContent = config.label;
        const select = document.createElement("select");
        select.dataset.field = config.field;
        select.dataset.question = String(number);
        select.setAttribute("aria-label", `${number}번 ${config.label}`);
        config.values.forEach(function (entry) { select.append(option(entry.id, entry.title)); });
        if (config.field === "reason") select.disabled = true;
        select.addEventListener("change", function () {
          if (config.field === "status") {
            li.dataset.state = select.value;
            const reasonSelect = li.querySelector('[data-field="reason"]');
            reasonSelect.disabled = select.value !== "wrong";
            if (reasonSelect.disabled) reasonSelect.value = "none";
            if (select.value === "unmarked") li.querySelector('[data-field="domain"]').value = "unclassified";
          }
          resetReport("내용이 바뀌었어요");
        });
        field.append(caption, select);
        li.append(field);
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
    setText("report-title", `${selectedFormat().title} · ${result.complete ? "전체 결과" : "입력한 결과"}`);
    setText("report-intro", `${label ? `${label} · ` : ""}${result.itemCount}문제 중 ${result.counts.unmarked}문제는 표시하지 않았습니다. ${result.attempted < 3 ? "푼 문제가 3개 미만이어서 비율 비교는 보류했습니다." : `정답률은 실제로 푼 ${result.attempted}문제 기준입니다.`}`);
    const metrics = $("report-metrics");
    metrics.replaceChildren(
      metric("정답", String(result.counts.correct), "입력한 O"),
      metric("오답", String(result.counts.wrong), "입력한 X"),
      metric("미응답", String(result.counts.blank), "풀지 않은 문항"),
      metric("푼 문제 정답률", result.accuracy === null ? result.attempted ? `${result.counts.correct}/${result.attempted}` : "—" : `${result.accuracy}%`, result.accuracy === null ? "3문제 미만 · 비율 보류" : "공식 점수 아님")
    );
    const domainHost = $("report-domains");
    domainHost.replaceChildren();
    const heading = document.createElement("h3"); heading.textContent = "영역별 비교"; domainHost.append(heading);
    result.domains.forEach(function (domain) {
      const row = document.createElement("div"); row.className = "report-domain-row";
      const title = document.createElement("strong"); title.textContent = domain.name;
      const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted}${domain.rate === null ? "" : ` · ${domain.rate}%`}` : "—";
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
      ? `${result.reviewFirst} 문제의 풀이를 먼저 다시 보세요. 다음 학습은 이 결과만으로 정하지 않아요.`
      : `어느 영역을 먼저 볼지는 아직 정할 수 없어요.${result.unclassified ? ` 영역을 고르지 않은 ${result.unclassified}문제를 선생님과 확인해 주세요.` : ""}`);
    document.querySelector(".review-report").hidden = false;
    document.querySelector(".review-layout").classList.remove("is-empty");
    document.querySelector(".review-report").focus();
  }
  $("review-grade").addEventListener("change", function (event) { grade = Number(event.target.value); renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-program").addEventListener("change", function (event) { programId = event.target.value; renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-paper-label").addEventListener("input", function () { resetReport("내용이 바뀌었어요"); });
  $("clear-marks").addEventListener("click", function () { renderMarks(); $("review-paper-label").value = ""; });
  $("paper-review-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const format = selectedFormat();
    if (!format) { setText("paper-error", "대회를 선택해 주세요."); $("paper-error").hidden = false; return; }
    const result = analyzer.analyze(readMarks(), format.itemCount);
    if (!result.valid) { setText("paper-error", result.error); $("paper-error").hidden = false; return; }
    $("paper-error").hidden = true;
    renderResult(result);
  });
  renderSettings();
  renderMarks();
})();
