(function () {
  "use strict";
  const roadmap = window.GFIELDBoardingGradeRoadmap;
  const analyzer = window.GFIELDPaperReviewAnalysis;
  const historyEngine = window.GFIELDAMCScoreHistory;
  if (!roadmap || !analyzer) return;
  const $ = function (id) { return document.getElementById(id); };
  const params = new URLSearchParams(location.search);
  let grade = roadmap.getGrade(params.get("grade")) ? Number(params.get("grade")) : 7;
  let programId = params.get("program") || "";
  const statuses = [{ id: "unmarked", title: "표시 안 함" }, { id: "correct", title: "O · 맞힘" }, { id: "wrong", title: "X · 틀림" }, { id: "blank", title: "미응답 · 답안 공란" }];
  const domains = [{ id: "unclassified", title: "영역 선택" }].concat(roadmap.strands.map(function (entry) { return { id: entry.id, title: entry.title }; }));
  const reasons = [{ id: "none", title: "이유 선택" }, { id: "concept", title: "개념" }, { id: "approach", title: "풀이 생각" }, { id: "calculation", title: "계산" }, { id: "reading", title: "조건 읽기" }, { id: "time", title: "시간" }];
  let scoreHistory = [];
  let lastHistoryContextKey = "";
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
    $("score-estimate").hidden = true;
    setText("score-estimate-value", "");
    $("score-estimate-note").hidden = true;
    setText("score-estimate-note", "");
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
    $("mark-progress").hidden = !format;
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
          if (config.field === "status") updateProgress();
          resetReport("내용이 바뀌었어요");
        });
        field.append(caption, select);
        li.append(field);
      });
      list.append(li);
    }
    updateProgress();
    resetReport();
  }
  function updateProgress() {
    const marked = Array.from($("paper-mark-list").querySelectorAll('[data-field="status"]')).filter(function (node) { return node.value !== "unmarked"; }).length;
    const format = selectedFormat();
    if (format) setText("mark-progress", `${marked} / ${format.itemCount}문제 표시`);
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
  function updateHistoryScale() {
    if (!historyEngine) return;
    const program = historyEngine.programs[$("history-program").value];
    const formSelect = $("history-form");
    formSelect.replaceChildren();
    program.forms.forEach(function (form) { formSelect.append(option(form, form)); });
    const input = $("history-score");
    input.max = String(program.max);
    input.step = program.max === 25 ? "1" : "0.5";
    input.setAttribute("inputmode", program.max === 25 ? "numeric" : "decimal");
    setText("score-history-scale", `${program.title} · 0–${program.max}점${program.max === 150 ? " · 0.5점 단위" : ""}`);
    renderHistoryContext();
  }
  function buildHistoryContext(context) {
    const article = document.createElement("article");
    const heading = document.createElement("strong"); heading.textContent = context.threshold == null ? context.title : `${context.title} · ${context.threshold} / ${context.maxScore}`;
    const note = document.createElement("p"); note.textContent = context.note;
    article.append(heading, note);
    if (context.source) {
      const link = document.createElement("a"); link.href = context.source; link.target = "_blank"; link.rel = "noopener noreferrer";
      link.textContent = context.kind === "international" ? "MAA AMC International 안내 ↗" : "MAA 2027 AIME 공식 공지 ↗";
      article.append(link);
    }
    if (context.eligibilitySource) {
      const eligibilityLink = document.createElement("a"); eligibilityLink.href = context.eligibilitySource; eligibilityLink.target = "_blank"; eligibilityLink.rel = "noopener noreferrer";
      eligibilityLink.textContent = "MAA AIME 자격 조건 ↗";
      article.append(eligibilityLink);
    }
    return article;
  }
  function renderHistoryContext() {
    if (!historyEngine) return;
    const host = $("score-history-context");
    const context = historyEngine.cycleContext($("history-program").value, $("history-cycle").value.trim(), $("history-region").value);
    const key = context ? JSON.stringify([context.kind, context.title, context.threshold, context.maxScore, context.note, context.source]) : "none";
    if (key === lastHistoryContextKey) return;
    lastHistoryContextKey = key;
    host.replaceChildren();
    if (context) host.append(buildHistoryContext(context));
  }
  function renderHistory() {
    const host = $("score-history-groups");
    host.replaceChildren();
    const groups = historyEngine.compare(scoreHistory);
    if (!groups.length) {
      const empty = document.createElement("p"); empty.className = "score-history-empty"; empty.textContent = "아직 추가된 회차가 없습니다."; host.append(empty);
    }
    groups.forEach(function (group) {
      const section = document.createElement("section"); section.className = "score-history-group";
      const heading = document.createElement("h3"); heading.textContent = group.title; section.append(heading);
      const table = document.createElement("table"); table.className = "score-history-table";
      const caption = document.createElement("caption"); caption.className = "visually-hidden"; caption.textContent = `${group.title} 회차별 성적표 원점수 기록`; table.append(caption);
      const thead = document.createElement("thead"); const headRow = document.createElement("tr");
      ["시험 날짜", "주기 · 시험지", "성적표 원점수", "기록"].forEach(function (label) { const th = document.createElement("th"); th.scope = "col"; th.textContent = label; headRow.append(th); });
      thead.append(headRow); table.append(thead);
      const tbody = document.createElement("tbody");
      group.entries.forEach(function (record) {
        const row = document.createElement("tr");
        [record.examDate, `${record.cycle} · ${record.form}`, `${record.rawScore} / ${record.maxScore}`].forEach(function (value) { const cell = document.createElement("td"); cell.textContent = value; row.append(cell); });
        const actionCell = document.createElement("td"); const remove = document.createElement("button"); remove.type = "button"; remove.className = "history-remove"; remove.dataset.removeHistory = record.id; remove.setAttribute("aria-label", `${record.cycle} ${group.title} ${record.form} 기록 삭제`); remove.textContent = "삭제"; actionCell.append(remove); row.append(actionCell); tbody.append(row);
      });
      table.append(tbody); section.append(table); host.append(section);
    });
    $("history-export").disabled = scoreHistory.length === 0;
  }
  function clearHistoryMessages() { $("score-history-error").hidden = true; $("score-history-status").hidden = true; }
  function historyError(message) { $("score-history-status").hidden = true; setText("score-history-error", message); $("score-history-error").hidden = false; }
  function historySuccess(message) { $("score-history-error").hidden = true; setText("score-history-status", message); $("score-history-status").hidden = false; }
  function makeHistoryId() { return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
  if (historyEngine) {
  $("history-program").addEventListener("change", function () { clearHistoryMessages(); updateHistoryScale(); });
  $("history-cycle").addEventListener("input", renderHistoryContext);
  $("history-region").addEventListener("change", renderHistoryContext);
  $("score-history-form").addEventListener("submit", function (event) {
    event.preventDefault();
    clearHistoryMessages();
    const programId = $("history-program").value;
    const program = historyEngine.programs[programId];
    try {
      const record = historyEngine.validateRecord({ id: makeHistoryId(), programId: programId, cycle: $("history-cycle").value.trim(), form: $("history-form").value,
        examDate: $("history-date").value, rawScore: Number($("history-score").value), maxScore: program.max });
      if (scoreHistory.length >= 100) throw Object.assign(new Error("HISTORY_LIMIT"), { code: "HISTORY_LIMIT" });
      scoreHistory.push(record);
      renderHistory();
      $("history-date").value = "";
      $("history-score").value = "";
      historySuccess("회차 기록을 추가했어요.");
    } catch (error) {
      const messages = { CYCLE_INVALID: "대회 주기는 YYYY-YY 형식으로 정확히 입력해 주세요.", FORM_INVALID: "선택한 대회의 시험지 구분을 확인해 주세요.", DATE_INVALID: "시험 날짜를 확인해 주세요.", SCORE_INVALID: `점수는 0부터 ${program.max} 사이로 입력해 주세요.`, SCORE_INCREMENT_INVALID: program.max === 25 ? "AMC 8 점수는 정수로 입력해 주세요." : "AMC 10/12 점수는 0.5점 단위로 입력해 주세요.", HISTORY_LIMIT: "비교 기록은 100회까지 담을 수 있어요. 먼저 JSON 파일로 저장해 주세요." };
      historyError(messages[error.code] || "기록을 추가하지 못했어요. 입력값을 확인해 주세요.");
    }
  });
  $("score-history-groups").addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove-history]");
    if (!button) return;
    const group = button.closest(".score-history-group");
    const row = button.closest("tr");
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const groupTitle = group.querySelector("h3").textContent;
    scoreHistory = scoreHistory.filter(function (record) { return record.id !== button.dataset.removeHistory; });
    clearHistoryMessages();
    renderHistory();
    const nextGroup = Array.from($("score-history-groups").querySelectorAll(".score-history-group")).find(function (entry) { return entry.querySelector("h3").textContent === groupTitle; });
    const nextButtons = nextGroup ? nextGroup.querySelectorAll("[data-remove-history]") : [];
    if (nextButtons.length) nextButtons[Math.min(rowIndex, nextButtons.length - 1)].focus();
    else if (nextGroup) { const heading = nextGroup.querySelector("h3"); heading.tabIndex = -1; heading.focus(); }
    else $("score-history-title").focus();
  });
  $("history-export").addEventListener("click", function () {
    if (!scoreHistory.length) return;
    const archive = historyEngine.validateArchive({ schemaVersion: historyEngine.schemaVersion, records: scoreHistory });
    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = "gfield-amc-score-history.json"; link.click(); window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });
  $("history-import").addEventListener("change", async function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    clearHistoryMessages();
    try {
      if (file.size > 100000) throw Object.assign(new Error("IMPORT_TOO_LARGE"), { code: "IMPORT_TOO_LARGE" });
      const archive = historyEngine.validateArchive(JSON.parse(await file.text()));
      const ids = new Set(scoreHistory.map(function (record) { return record.id; }));
      if (archive.records.some(function (record) { return ids.has(record.id); }) || scoreHistory.length + archive.records.length > 100) throw Object.assign(new Error("IMPORT_COLLISION"), { code: "IMPORT_COLLISION" });
      scoreHistory = scoreHistory.concat(archive.records);
      renderHistory();
      historySuccess(`${archive.records.length}개 기록을 가져왔어요.`);
    } catch (error) {
      historyError(error.code === "IMPORT_TOO_LARGE" ? "기록 파일은 100KB 이하만 가져올 수 있어요." : error.code === "IMPORT_COLLISION" ? "이미 있는 기록과 겹치거나 100회 한도를 넘습니다. 현재 기록을 저장한 뒤 다시 시도해 주세요." : "기록 파일을 읽지 못했어요. GFIELD AMC 기록 JSON 파일인지 확인해 주세요.");
    } finally { event.target.value = ""; }
  });
  $("history-clear").addEventListener("click", function () {
    if (!scoreHistory.length || !window.confirm("이 화면에 불러온 모든 회차 기록을 비울까요? 저장한 JSON 파일은 그대로 남습니다.")) return;
    scoreHistory = []; renderHistory(); clearHistoryMessages(); $("history-program").focus();
  });
  } else {
    document.querySelector(".score-history").hidden = true;
  }
  function renderResult(result) {
    const label = $("review-paper-label").value.trim();
    setText("report-title", `${selectedFormat().title} · ${result.complete ? "전체 결과" : "입력한 결과"}`);
    setText("report-intro", `${label ? `${label} · ` : ""}${result.itemCount}문제 중 ${result.counts.unmarked}문제는 표시하지 않았습니다. ${result.attempted < 3 ? "푼 문제가 3개 미만이어서 비율 비교는 보류했습니다." : `정답률은 실제로 푼 ${result.attempted}문제 기준입니다.`}`);
    $("score-estimate").hidden = !result.scoreEstimate;
    if (result.scoreEstimate) setText("score-estimate-value", `${result.scoreEstimate.label} · ${result.scoreEstimate.points} / ${result.scoreEstimate.max}`);
    const scoreNote = $("score-estimate-note");
    const isAmcRawReference = ["amc8", "amc10", "amc12"].includes(selectedFormat().id) && result.itemCount === 25;
    scoreNote.hidden = !isAmcRawReference || Boolean(result.scoreEstimate);
    if (isAmcRawReference && !result.scoreEstimate) {
      setText("score-estimate-note", result.counts.unmarked
        ? `참고 원점수는 25문항을 모두 표시한 뒤 계산해요. 아직 표시하지 않은 ${result.counts.unmarked}문항은 ‘표시 안 함’으로 두고, 답안 공란은 ‘미응답’으로 표시하세요.`
        : "참고 원점수를 계산할 수 없어요. 선택한 시험지의 채점 안내와 공식 성적표를 확인하세요.");
    }
    const metrics = $("report-metrics");
    metrics.replaceChildren(
      metric("정답", String(result.counts.correct), "입력한 O"),
      metric("오답", String(result.counts.wrong), "입력한 X"),
      metric("미응답", String(result.counts.blank), "답안 공란"),
      metric("푼 문제 정답률", result.accuracy === null ? result.attempted ? `${result.counts.correct}/${result.attempted}` : "—" : `${result.accuracy}%`, result.accuracy === null ? "3문제 미만 · 비율 보류" : "공식 점수 아님")
    );
    const domainHost = $("report-domains");
    domainHost.replaceChildren();
    const heading = document.createElement("h3"); heading.textContent = `영역별 비교 · ${result.domainClassified}/${result.itemCount}문항 분류`; domainHost.append(heading);
    const domainNote = document.createElement("p"); domainNote.className = "report-evidence-note";
    domainNote.textContent = "영역별 수치는 풀이 영역을 표시한 문항만 포함해요. 3문제 미만은 비율 비교를 보류합니다.";
    domainHost.append(domainNote);
    result.domains.forEach(function (domain) {
      const row = document.createElement("div"); row.className = "report-domain-row";
      const title = document.createElement("strong"); title.textContent = domain.name;
      const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted}${domain.rate === null ? "" : ` · ${domain.rate}%`}` : "—";
      const detail = document.createElement("small"); detail.textContent = `${domain.evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
      row.append(title, value, detail); domainHost.append(row);
    });
    const reasonHost = $("report-reasons");
    reasonHost.replaceChildren();
    const reasonHeading = document.createElement("h3"); reasonHeading.textContent = `오류 이유 · ${result.reasonClassified}/${result.counts.wrong}개 오답 분류`; reasonHost.append(reasonHeading);
    const reasonNote = document.createElement("p"); reasonNote.className = "report-evidence-note";
    reasonNote.textContent = "선택한 오류 이유만 모았어요. 이유를 고르지 않은 오답은 집계하지 않습니다.";
    reasonHost.append(reasonNote);
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
    const result = analyzer.analyze(readMarks(), format.itemCount, format.id);
    if (!result.valid) { setText("paper-error", result.error); $("paper-error").hidden = false; return; }
    $("paper-error").hidden = true;
    renderResult(result);
  });
  renderSettings();
  renderMarks();
  if (historyEngine) { updateHistoryScale(); renderHistory(); }
})();
