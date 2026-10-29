(function () {
  "use strict";
  const roadmap = window.GFIELDBoardingGradeRoadmap;
  const analyzer = window.GFIELDPaperReviewAnalysis;
  const historyEngine = window.GFIELDAMCScoreHistory;
  const localRecords = window.GFIELDLocalLearningRecord;
  if (!roadmap || !analyzer) return;
  const $ = function (id) { return document.getElementById(id); };
  const alertVersions = Object.create(null);
  const params = new URLSearchParams(location.search);
  let grade = roadmap.getGrade(params.get("grade")) ? Number(params.get("grade")) : 7;
  let programId = params.get("program") || "";
  const statuses = [{ id: "unmarked", title: "표시 안 함" }, { id: "correct", title: "O · 맞힘" }, { id: "wrong", title: "X · 틀림" }, { id: "blank", title: "미응답 · 답안 공란" }];
  const domains = [{ id: "unclassified", title: "영역 선택" }].concat(roadmap.strands.map(function (entry) { return { id: entry.id, title: entry.title }; }));
  const reasons = [{ id: "none", title: "이유 선택" }, { id: "concept", title: "개념" }, { id: "approach", title: "접근 아이디어" }, { id: "calculation", title: "계산" }, { id: "reading", title: "조건 읽기" }, { id: "time", title: "시간" }];
  const blankReasons = [{ id: "none", title: "이유 선택" }, { id: "time", title: "시간 부족" }, { id: "skipped", title: "건너뜀" }, { id: "could-not-start", title: "시작 못 함" }];
  let scoreHistory = [];
  let lastDiagnostic = null;
  let lastSavedDiagnosticId = null;
  let savedDiagnosticAnnouncementVersion = 0;
  let diagnosticSaveStatusVersion = 0;
  let historySuccessVersion = 0;
  let lastHistoryContextKey = "";
  function setText(id, value) { $(id).textContent = value; }
  function showAlert(id, message) {
    const region = $(id);
    const version = (alertVersions[id] || 0) + 1;
    alertVersions[id] = version;
    region.hidden = false;
    region.textContent = "";
    window.requestAnimationFrame(function () { if (alertVersions[id] === version) region.textContent = message; });
  }
  function clearAlert(id) {
    alertVersions[id] = (alertVersions[id] || 0) + 1;
    $(id).hidden = true;
    $(id).textContent = "";
  }
  function announceSavedDiagnostic(message) {
    const region = $("saved-diagnostic-announcement");
    const version = ++savedDiagnosticAnnouncementVersion;
    region.textContent = "";
    window.requestAnimationFrame(function () {
      if (version === savedDiagnosticAnnouncementVersion) region.textContent = message;
    });
  }
  function announceDiagnosticSaveStatus(message) {
    const region = $("diagnostic-save-status");
    const version = ++diagnosticSaveStatusVersion;
    region.textContent = "";
    window.requestAnimationFrame(function () {
      if (version === diagnosticSaveStatusVersion) region.textContent = message;
    });
  }
  function selectedFormat() { return roadmap.competitionOptions(grade).find(function (entry) { return entry.id === programId; }); }
  function option(value, title) { const node = document.createElement("option"); node.value = value; node.textContent = title; return node; }
  function syncReasonField(row, status) {
    const number = row.querySelector('[data-field="status"]').dataset.question;
    const reasonSelect = row.querySelector('[data-field="reason"]');
    const reasonLabel = row.querySelector(".mark-reason span");
    const isBlank = status === "blank";
    const reasonName = isBlank ? "미응답 이유" : "오답 이유";
    const values = isBlank ? blankReasons : reasons;
    reasonLabel.textContent = reasonName;
    reasonSelect.setAttribute("aria-label", `${number}번 ${reasonName}`);
    reasonSelect.replaceChildren();
    values.forEach(function (entry) { reasonSelect.append(option(entry.id, entry.title)); });
    reasonSelect.disabled = status !== "wrong" && !isBlank;
  }
  function updateUrl() {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    if (programId) url.searchParams.set("program", programId);
    else url.searchParams.delete("program");
    history.replaceState(null, "", url);
    $("back-to-roadmap").href = `./boarding-roadmap.html?grade=${grade}${programId ? `&program=${encodeURIComponent(programId)}` : ""}`;
  }
  function resetReport(message) {
    clearAlert("paper-error");
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
    $("report-review-items-list").replaceChildren();
    $("report-reasons").replaceChildren();
    $("save-diagnostic").hidden = true;
    $("save-diagnostic").disabled = false;
    $("diagnostic-save-status").textContent = "";
    lastDiagnostic = null;
    lastSavedDiagnosticId = null;
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
    $("review-exam-date-field").hidden = !format;
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
        { field: "reason", values: reasons, label: "오답 이유" }
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
            syncReasonField(li, select.value);
            const reasonSelect = li.querySelector('[data-field="reason"]');
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
      ["시험 날짜", "주기 · 시험지", "응시 당시 학년", "성적표 원점수", "기록"].forEach(function (label) { const th = document.createElement("th"); th.scope = "col"; th.textContent = label; headRow.append(th); });
      thead.append(headRow); table.append(thead);
      const tbody = document.createElement("tbody");
      group.entries.forEach(function (record) {
        const row = document.createElement("tr");
        [record.examDate, `${record.cycle} · ${record.form}`, record.studentGrade == null ? "미기록" : record.studentGrade === "K" ? "Kindergarten" : `Grade ${record.studentGrade}`].forEach(function (value) { const cell = document.createElement("td"); cell.textContent = value; row.append(cell); });
        const scoreCell = document.createElement("td"); scoreCell.textContent = `${record.rawScore} / ${record.maxScore}`;
        const progress = historyEngine.qualificationProgress(record);
        if (progress) { const note = document.createElement("small"); note.className = `score-history-benchmark${progress.reached ? " is-reached" : ""}`; note.textContent = progress.label; scoreCell.append(document.createElement("br"), note); }
        row.append(scoreCell);
        const actionCell = document.createElement("td"); const remove = document.createElement("button"); remove.type = "button"; remove.className = "history-remove"; remove.dataset.removeHistory = record.id; remove.setAttribute("aria-label", `${record.cycle} ${group.title} ${record.form} 기록 삭제`); remove.textContent = "삭제"; actionCell.append(remove); row.append(actionCell); tbody.append(row);
      });
      table.append(tbody); section.append(table); host.append(section);
    });
    $("history-export").disabled = scoreHistory.length === 0;
    $("history-clear").disabled = scoreHistory.length === 0;
  }
  function renderSavedDiagnosticHistory() {
    const section = $("saved-diagnostic-history");
    const host = $("saved-diagnostic-list");
    if (!localRecords) { section.hidden = true; return; }
    const history = localRecords.storage.loadCompetitionDiagnosticHistory();
    section.hidden = history.length === 0;
    host.replaceChildren();
    history.forEach(function (record) {
      const card = document.createElement("article"); card.className = "saved-diagnostic-entry";
      const heading = document.createElement("div"); heading.className = "saved-diagnostic-entry-heading";
      const title = document.createElement("h3"); title.textContent = `${record.programTitle} · Grade ${record.grade}`;
      const date = document.createElement("time"); date.textContent = record.examDate || "날짜 미입력"; if (record.examDate) date.dateTime = record.examDate;
      heading.append(title, date);
      const meta = document.createElement("p");
      const completion = record.summary.unmarked ? `일부 입력 ${record.summary.itemCount - record.summary.unmarked}/${record.summary.itemCount} · ` : `전체 입력 ${record.summary.itemCount}/${record.summary.itemCount} · `;
      meta.textContent = `${record.paperLabel ? `${record.paperLabel} · ` : ""}${completion}정답 ${record.summary.correct} · 오답 ${record.summary.wrong} · 미응답 ${record.summary.blank} · 표시 안 함 ${record.summary.unmarked} · 영역 분류 ${record.summary.domainClassified}/${record.summary.itemCount}`;
      const domainHost = document.createElement("div"); domainHost.className = "saved-diagnostic-entry-domains";
      record.domains.forEach(function (domain) {
        const item = document.createElement("div");
        const label = document.createElement("strong"); label.textContent = domain.name;
        const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted}${domain.rate === null ? "" : ` · ${domain.rate}%`}` : "—";
        const note = document.createElement("small"); note.textContent = `${domain.evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
        item.append(label, value, note); domainHost.append(item);
      });
      const reasonSummary = document.createElement("p");
      reasonSummary.textContent = `오답 이유 분류 ${record.summary.reasonClassified}/${record.summary.wrong}${record.reasons.length ? ` · ${record.reasons.map(function (reason) { const label = reasons.find(function (entry) { return entry.id === reason.id; }); return `${label ? label.title : "기타"} ${reason.count}`; }).join(" · ")}` : ""}`;
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "saved-diagnostic-remove"; remove.dataset.removeDiagnostic = record.id; remove.textContent = "이 기록 삭제";
      remove.setAttribute("aria-label", `${record.programTitle} Grade ${record.grade} ${record.examDate || "날짜 미입력"} 복습 요약 삭제`);
      card.append(heading, meta, domainHost, reasonSummary, remove); host.append(card);
    });
  }
  function clearHistoryMessages() { historySuccessVersion += 1; clearAlert("score-history-error"); $("score-history-status").textContent = ""; }
  function historyError(message) { $("score-history-status").textContent = ""; showAlert("score-history-error", message); }
  function historySuccess(message) {
    $("score-history-error").hidden = true;
    const version = ++historySuccessVersion;
    setText("score-history-status", "");
    window.requestAnimationFrame(function () { if (version === historySuccessVersion) setText("score-history-status", message); });
  }
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
      const gradeValue = $("history-grade").value;
      const record = historyEngine.validateRecord({ id: makeHistoryId(), programId: programId, cycle: $("history-cycle").value.trim(), form: $("history-form").value,
        examDate: $("history-date").value, rawScore: Number($("history-score").value), maxScore: program.max, regionId: $("history-region").value || null,
        studentGrade: gradeValue === "" ? null : gradeValue === "K" ? "K" : Number(gradeValue) });
      if (scoreHistory.length >= 100) throw Object.assign(new Error("HISTORY_LIMIT"), { code: "HISTORY_LIMIT" });
      scoreHistory.push(record);
      renderHistory();
      $("history-date").value = "";
      $("history-score").value = "";
      historySuccess("회차 기록을 추가했어요.");
    } catch (error) {
      const messages = { CYCLE_INVALID: "대회 주기는 YYYY-YY 형식으로 정확히 입력해 주세요.", FORM_INVALID: "선택한 대회의 시험지 구분을 확인해 주세요.", DATE_INVALID: "시험 날짜를 확인해 주세요.", REGION_INVALID: "응시 지역을 다시 선택해 주세요.", SCORE_INVALID: `점수는 0부터 ${program.max} 사이로 입력해 주세요.`, SCORE_INCREMENT_INVALID: program.max === 25 ? "AMC 8 점수는 정수로 입력해 주세요." : "AMC 10/12 점수는 0.5점 단위로 입력해 주세요.", HISTORY_LIMIT: "비교 기록은 100회까지 담을 수 있어요. 먼저 JSON 파일로 저장해 주세요." };
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
    renderHistory();
    const nextGroup = Array.from($("score-history-groups").querySelectorAll(".score-history-group")).find(function (entry) { return entry.querySelector("h3").textContent === groupTitle; });
    const nextButtons = nextGroup ? nextGroup.querySelectorAll("[data-remove-history]") : [];
    if (nextButtons.length) nextButtons[Math.min(rowIndex, nextButtons.length - 1)].focus();
    else if (nextGroup) { const heading = nextGroup.querySelector("h3"); heading.tabIndex = -1; heading.focus(); }
    else $("score-history-title").focus();
    historySuccess("회차 기록을 삭제했어요.");
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
    scoreHistory = []; renderHistory(); clearHistoryMessages(); historySuccess("화면 기록을 비웠어요."); $("history-program").focus();
  });
  } else {
    document.querySelector(".score-history").hidden = true;
  }
  function renderResult(result) {
    const label = $("review-paper-label").value.trim();
    lastDiagnostic = result;
    $("report-roadmap-link").href = `./boarding-roadmap.html?grade=${encodeURIComponent(grade)}&program=${encodeURIComponent(selectedFormat().id)}#grade-map`;
    $("report-roadmap-link").textContent = `선택한 Grade ${grade} 학습 경로 보기 →`;
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
    const heading = document.createElement("h3"); heading.textContent = `직접 분류한 영역 · ${result.domainClassified}/${result.itemCount}문항`; domainHost.append(heading);
    const domainNote = document.createElement("p"); domainNote.className = "report-evidence-note";
    domainNote.textContent = "영역은 직접 고른 분류예요. 정답 비율은 표시한 풀이 문항만으로 계산하고, 미응답은 따로 보여 드려요. 3문제 미만은 비교하지 않습니다.";
    domainHost.append(domainNote);
    result.domains.forEach(function (domain) {
      const row = document.createElement("div"); row.className = "report-domain-row";
      const title = document.createElement("strong"); title.textContent = domain.name;
      const value = document.createElement("span"); value.textContent = domain.attempted ? `${domain.correct}/${domain.attempted}${domain.rate === null ? "" : ` · ${domain.rate}%`}` : "—";
      const detail = document.createElement("small"); detail.textContent = `${domain.evidence}${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
      row.append(title, value, detail); domainHost.append(row);
    });
    const reviewList = $("report-review-items-list");
    reviewList.replaceChildren();
    result.reviewItems.forEach(function (item) {
      const row = document.createElement("li");
      const domain = domains.find(function (entry) { return entry.id === item.domain; });
      const reason = reasons.find(function (entry) { return entry.id === item.reason; });
      const itemState = item.status === "wrong" ? "오답" : "미응답";
      const blankReason = blankReasons.find(function (entry) { return entry.id === item.reason; });
      const details = [domain && item.domain !== "unclassified" ? domain.title : "영역 미분류", item.status === "wrong" && reason && item.reason !== "none" ? reason.title : "", item.status === "blank" && blankReason && item.reason !== "none" ? blankReason.title : ""].filter(Boolean);
      row.textContent = `${item.number}번 · ${itemState} · ${details.join(" · ")}`;
      reviewList.append(row);
    });
    $("report-review-items").hidden = result.reviewItems.length === 0;
    const reasonHost = $("report-reasons");
    reasonHost.replaceChildren();
    if (result.counts.wrong > 0) {
      const reasonHeading = document.createElement("h3"); reasonHeading.textContent = `오답 이유 · ${result.reasonClassified}/${result.counts.wrong}개 분류`; reasonHost.append(reasonHeading);
      const reasonNote = document.createElement("p"); reasonNote.className = "report-evidence-note";
      reasonNote.textContent = "선택한 오답 이유만 모았어요. 이유를 고르지 않은 오답은 집계하지 않습니다.";
      reasonHost.append(reasonNote);
      if (result.reasons.length) result.reasons.forEach(function (reason) {
        const row = document.createElement("p"); row.textContent = `${reason.name} · ${reason.count}문항`; reasonHost.append(row);
      });
      else { const empty = document.createElement("p"); empty.textContent = "아직 선택된 오답 이유가 없습니다."; reasonHost.append(empty); }
    }
    if (result.counts.blank > 0) {
      const blankReasonHeading = document.createElement("h3"); blankReasonHeading.textContent = `미응답 이유 · ${result.blankReasonClassified}/${result.counts.blank}개 공란 분류`; reasonHost.append(blankReasonHeading);
      const blankReasonNote = document.createElement("p"); blankReasonNote.className = "report-evidence-note";
      blankReasonNote.textContent = "이번 화면에서 선택한 미응답 이유예요. 저장된 복습 요약에는 포함하지 않습니다.";
      reasonHost.append(blankReasonNote);
      if (result.blankReasons.length) result.blankReasons.forEach(function (reason) {
        const row = document.createElement("p"); row.textContent = `${reason.name} · ${reason.count}문항`; reasonHost.append(row);
      });
      else { const empty = document.createElement("p"); empty.textContent = "아직 선택된 미응답 이유가 없습니다."; reasonHost.append(empty); }
    }
    const lowestAreas = result.lowestDomains.map(function (entry) { return `${entry.name} ${entry.correct}/${entry.attempted}`; });
    setText("report-next", lowestAreas.length
      ? `표시한 풀이 문항 중 정답 비율이 가장 낮게 나온 영역은 ${lowestAreas.join(" · ")}입니다. 적은 문항의 관찰이므로 학습 수준을 판정하지 않아요.`
      : `두 개 이상 영역에서 각각 3문제 이상 푼 경우에만 정답 비율을 참고 비교해요.${result.unclassified ? ` 영역 미분류 ${result.unclassified}문항은 직접 확인해 주세요.` : ""}`);
    $("save-diagnostic").hidden = !localRecords;
    if (!$("save-diagnostic").disabled) $("diagnostic-save-status").textContent = "";
    document.querySelector(".review-report").hidden = false;
    document.querySelector(".review-layout").classList.remove("is-empty");
    $("report-title").focus();
  }
  $("review-grade").addEventListener("change", function (event) { grade = Number(event.target.value); renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-program").addEventListener("change", function (event) { programId = event.target.value; renderSettings(); renderMarks(); $("review-paper-label").value = ""; });
  $("review-paper-label").addEventListener("input", function () { resetReport("내용이 바뀌었어요"); });
  $("clear-marks").addEventListener("click", function () { renderMarks(); $("review-paper-label").value = ""; });
  $("paper-review-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const format = selectedFormat();
    if (!format) { showAlert("paper-error", "대회를 선택해 주세요."); return; }
    const result = analyzer.analyze(readMarks(), format.itemCount, format.id);
    if (!result.valid) { showAlert("paper-error", result.error === "문항별 표시와 영역을 확인하세요." ? "문항별 표시·영역·이유를 확인하세요." : result.error); return; }
    clearAlert("paper-error");
    renderResult(result);
  });
  $("save-diagnostic").addEventListener("click", function () {
    if (!lastDiagnostic || !localRecords) return;
    const examDate = $("review-exam-date").value;
    if (!examDate) { $("diagnostic-save-status").textContent = "응시 날짜를 입력한 뒤 저장해 주세요."; $("review-exam-date").focus(); return; }
    const format = selectedFormat();
    const record = localRecords.storage.saveCompetitionDiagnostic({
      schemaVersion: "gfield-competition-diagnostic-v1", id: makeHistoryId(), programId: format.id, programTitle: format.title,
      grade: grade, paperLabel: $("review-paper-label").value.trim(), examDate: examDate,
      summary: { itemCount: lastDiagnostic.itemCount, correct: lastDiagnostic.counts.correct, wrong: lastDiagnostic.counts.wrong, blank: lastDiagnostic.counts.blank,
        unmarked: lastDiagnostic.counts.unmarked, attempted: lastDiagnostic.attempted, domainClassified: lastDiagnostic.domainClassified, reasonClassified: lastDiagnostic.reasonClassified },
      domains: lastDiagnostic.domains.map(function (domain) { return { id: domain.id, attempted: domain.attempted, correct: domain.correct, wrong: domain.wrong, blank: domain.blank }; }),
      reasons: lastDiagnostic.reasons.map(function (reason) { return { id: reason.id, count: reason.count }; })
    });
    const amcResultDisclosure = lastDiagnostic.complete && ["amc8", "amc10", "amc12"].includes(format.id)
      ? `${format.title} 참고 원점수는 저장된 응답 수로 다시 계산할 수 있어요.`
      : "저장한 정답·오답·미응답 수와 영역별 합계로 입력 결과 일부를 유추할 수 있어요.";
    lastSavedDiagnosticId = record ? record.id : null;
    $("diagnostic-save-status").textContent = record ? `${record.programTitle} · Grade ${record.grade} 복습 요약을 이 기기에 저장했어요. 정답·오답·미응답 수와 영역별 합계를 저장합니다. ${amcResultDisclosure} 문항별 답과 번호는 저장하지 않습니다.` : "저장하지 못했어요. 입력한 학년과 문항 결과를 확인해 주세요.";
    $("save-diagnostic").disabled = Boolean(record);
    renderSavedDiagnosticHistory();
  });
  $("saved-diagnostic-list").addEventListener("click", function (event) {
    const button = event.target.closest("[data-remove-diagnostic]");
    if (!button || !localRecords) return;
    const removeButtons = Array.from($("saved-diagnostic-list").querySelectorAll(".saved-diagnostic-remove"));
    const removedIndex = removeButtons.indexOf(button);
    const removedCurrentResult = button.dataset.removeDiagnostic === lastSavedDiagnosticId;
    if (!localRecords.storage.removeCompetitionDiagnostic(button.dataset.removeDiagnostic)) {
      const message = "저장된 복습 요약을 지우지 못했어요. 다시 시도해 주세요.";
      if (document.querySelector(".review-report").hidden) announceSavedDiagnostic(message);
      else announceDiagnosticSaveStatus(message);
      return;
    }
    if (removedCurrentResult) {
      lastSavedDiagnosticId = null;
      $("save-diagnostic").disabled = false;
      if (document.querySelector(".review-report").hidden) announceSavedDiagnostic("저장한 복습 요약을 삭제했어요. 현재 결과를 다시 저장할 수 있어요.");
      else announceDiagnosticSaveStatus("저장한 복습 요약을 삭제했어요. 현재 결과를 다시 저장할 수 있어요.");
    } else {
      const message = lastDiagnostic ? "저장된 다른 복습 요약을 삭제했어요. 현재 결과의 저장 상태는 유지돼요." : "저장된 복습 요약을 삭제했어요.";
      if (document.querySelector(".review-report").hidden) announceSavedDiagnostic(message);
      else announceDiagnosticSaveStatus(message);
    }
    renderSavedDiagnosticHistory();
    const nextRemoveButtons = Array.from($("saved-diagnostic-list").querySelectorAll(".saved-diagnostic-remove"));
    if (nextRemoveButtons.length) nextRemoveButtons[Math.min(removedIndex, nextRemoveButtons.length - 1)].focus();
    else $("review-program").focus();
  });
  renderSettings();
  renderMarks();
  renderSavedDiagnosticHistory();
  if (historyEngine) { updateHistoryScale(); renderHistory(); }
})();
