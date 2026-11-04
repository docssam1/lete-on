(function () {
  "use strict";
  const roadmap = window.GFIELDBoardingGradeRoadmap;
  const analyzer = window.GFIELDPaperReviewAnalysis;
  const historyEngine = window.GFIELDAMCScoreHistory;
  const paperLibrary = window.GFIELDAMCOriginalPaperLibrary;
  const answerKeyReference = window.GFIELDAMCOriginalAnswerKeyReference;
  const itemConceptReference = window.GFIELDAMCOriginalItemConceptReference;
  const localRecords = window.GFIELDLocalLearningRecord;
  if (!roadmap || !analyzer) return;
  const $ = function (id) { return document.getElementById(id); };
  const alertVersions = Object.create(null);
  const params = new URLSearchParams(location.search);
  let grade = roadmap.getGrade(params.get("grade")) ? Number(params.get("grade")) : 7;
  let programId = params.get("program") || "";
  const statuses = [{ id: "unmarked", title: "표시 안 함" }, { id: "correct", title: "O · 맞힘" }, { id: "wrong", title: "X · 틀림" }, { id: "blank", title: "미응답 · 답안 공란" }];
  const reasons = [{ id: "none", title: "이유 선택" }, { id: "concept", title: "개념" }, { id: "approach", title: "접근 아이디어" }, { id: "calculation", title: "계산" }, { id: "reading", title: "조건 읽기" }, { id: "time", title: "시간" }];
  const blankReasons = [{ id: "none", title: "이유 선택" }, { id: "time", title: "시간 부족" }, { id: "skipped", title: "건너뜀" }, { id: "could-not-start", title: "시작 못 함" }];
  const answerChoices = [{ id: "", title: "미입력" }, { id: "A", title: "A" }, { id: "B", title: "B" }, { id: "C", title: "C" }, { id: "D", title: "D" }, { id: "E", title: "E" }];
  let scoreHistory = [];
  let lastDiagnostic = null;
  let lastAutoGradeSummary = null;
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
  function selectedPaperFormat(format) {
    if (!format) return null;
    const archive = paperLibrary && paperLibrary.archiveFor(format.id);
    const selectedYear = archive ? Number($("archive-year").value || params.get("year")) : NaN;
    if (archive && Number.isInteger(selectedYear)) return paperLibrary.formatFor(format.id, selectedYear);
    return { title: format.title, itemCount: format.itemCount, durationMinutes: null, scoring: null, rawOnly: false, formatNote: "" };
  }
  function option(value, title) { const node = document.createElement("option"); node.value = value; node.textContent = title; return node; }
  function renderOfficialPaperSources(format) {
    const section = $("official-paper-sources");
    const picker = $("amc-archive-picker");
    if (!paperLibrary || !format) { section.hidden = true; picker.hidden = true; return; }
    const archive = paperLibrary.archiveFor(format.id);
    picker.hidden = !archive;
    if (archive) {
      const yearSelect = $("archive-year");
      const formSelect = $("archive-form");
      yearSelect.replaceChildren();
      archive.years.forEach(function (year) { yearSelect.append(option(String(year), String(year))); });
      const requestedYear = Number(params.get("year"));
      yearSelect.value = archive.years.includes(requestedYear) ? String(requestedYear) : String(archive.years[0]);
      const syncArchivePaperLabel = function () {
        const selectedPaperMeta = paperLibrary.formatFor(format.id, Number(yearSelect.value));
        const autoLabel = `${yearSelect.value} ${selectedPaperMeta ? selectedPaperMeta.title : format.title}${format.id === "amc8" ? "" : formSelect.value ? ` ${formSelect.value}` : ""}`;
        const paperLabel = $("review-paper-label");
        if (!paperLabel.value.trim() || paperLabel.value === paperLabel.dataset.archiveDefault) paperLabel.value = autoLabel;
        paperLabel.dataset.archiveDefault = autoLabel;
      };
      const syncArchiveActions = function () {
        const year = Number(yearSelect.value);
        const form = formSelect.value;
        const meta = paperLibrary.formatFor(format.id, year);
        const label = `${year} ${meta ? meta.title : format.title}${form ? ` ${form}` : ""}`;
        $("archive-open-link").href = paperLibrary.archiveRoute(format.id, year, form);
        $("archive-open-link").textContent = `${label} · 온라인 회차 ↗`;
        $("archive-print-link").href = paperLibrary.printRoute(format.id, year, form);
        $("archive-print-link").textContent = `${label} · 시험지 PDF 인쇄 ↗`;
        $("archive-answer-link").href = paperLibrary.answerRoute(format.id, year, form);
        $("archive-answer-link").textContent = `${label} · 정답표 ↗`;
        $("archive-solutions-link").href = paperLibrary.solutionsRoute(format.id, year, form);
        $("archive-solutions-link").textContent = `${label} · 전문 풀이 ↗`;
      };
      const renderArchiveRoute = function () {
        const year = Number(yearSelect.value);
        const forms = paperLibrary.formsFor(format.id, year);
        $("archive-form-field").hidden = format.id === "amc8" || forms.length === 1;
        formSelect.replaceChildren();
        forms.forEach(function (form) { formSelect.append(option(form, form ? `${form}형` : "단일 시험지")); });
        formSelect.value = forms.includes(params.get("form")) ? params.get("form") : forms[0];
        syncArchiveActions();
        $("archive-route-note").textContent = `LIVE 연도별 색인 ${paperLibrary.contestCount(format.id)}회 중 선택한 원본이에요. 시험지 PDF·정답표·전문 풀이를 열고, 아래 문항별 링크에서 개념과 해설을 확인하세요.`;
        syncArchivePaperLabel();
        updateReviewSourceNote(format);
        updateUrl();
      };
      yearSelect.onchange = function () { renderArchiveRoute(); renderMarks(); };
      formSelect.onchange = function () {
        syncArchiveActions();
        syncArchivePaperLabel();
        updateUrl();
        renderMarks();
      };
      renderArchiveRoute();
    }
    section.hidden = !archive;
    if (!archive) return;
  }
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
    const archivePicker = $("amc-archive-picker");
    if (!archivePicker.hidden && $("archive-year").value) {
      url.searchParams.set("year", $("archive-year").value);
      if (!$("archive-form-field").hidden && $("archive-form").value) url.searchParams.set("form", $("archive-form").value);
      else url.searchParams.delete("form");
    } else { url.searchParams.delete("year"); url.searchParams.delete("form"); }
    history.replaceState(null, "", url);
    $("back-to-roadmap").href = `./boarding-roadmap.html?grade=${grade}${programId ? `&program=${encodeURIComponent(programId)}` : ""}`;
  }
  function resetReport(message) {
    clearAlert("paper-error");
    document.querySelector(".review-report").hidden = true;
    document.querySelector(".review-layout").classList.add("is-empty");
    setText("report-title", message || "아직 결과가 없어요");
    setText("report-intro", "문제를 표시한 뒤 ‘결과 보기’를 누르세요. 표시하지 않은 문제는 정답률에 넣지 않아요.");
    $("answer-key-result-note").hidden = true;
    $("answer-key-result-note").replaceChildren();
    setText("report-next", "학습 단계를 정하려면 실제 풀이를 확인해야 해요.");
    $("score-estimate").hidden = true;
    setText("score-estimate-value", "");
    $("score-estimate-note").hidden = true;
    setText("score-estimate-note", "");
    $("paper-performance").hidden = true;
    setText("paper-performance-summary", "");
    $("paper-question-bands").replaceChildren();
    $("report-follow-up").hidden = true;
    setText("report-follow-up-copy", "");
    $("report-follow-up-link").removeAttribute("href");
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
  function updateReviewSourceNote(format) {
    const paperFormat = selectedPaperFormat(format);
    setText("review-source-note", format
      ? ["amc8", "amc10", "amc12"].includes(format.id)
        ? `${paperFormat && paperFormat.title === "AHSME" ? `${paperFormat.title} ${$("archive-year").value} · ` : `${format.title} · `}${paperFormat ? `${paperFormat.itemCount}문항${paperFormat.durationMinutes ? ` · ${paperFormat.durationMinutes}분` : ""}` : `${format.itemCount}문항`}. ${paperFormat && paperFormat.rawOnly ? `${paperFormat.formatNote} 시간은 원본 시험지 안내를 확인하세요.` : paperFormat && paperFormat.formatNote ? paperFormat.formatNote : "먼저 A–E 답을 입력하고 공개 정답표와 대조해 결과를 표시하세요."} 풀이 영역을 모르면 비워 두세요.`
        : format.id === "aime"
          ? `${format.title} · ${format.itemCount}문항. 공개 정답표와 대조할 수 있도록 각 문항의 정수 답(0–999)을 적고, 맞힘·오답·미응답을 표시하세요.`
        : `${format.title} · ${format.itemCount}문항. 공개 정답표를 확인한 뒤 맞힘·오답·미응답을 표시하세요. 풀이 영역을 모르면 비워 두세요.`
      : "먼저 대회를 선택하세요.");
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
    formats.forEach(function (entry) { programSelect.append(option(entry.id, `${entry.title} · ${entry.id === "amc12" ? "연도별 원본 시험" : `${entry.itemCount}문항`}`)); });
    programSelect.value = programId;
    const format = selectedFormat();
    renderOfficialPaperSources(format);
    $("review-paper-label-field").hidden = !format;
    $("review-exam-date-field").hidden = !format;
    $("official-percentile-field").hidden = programId !== "kangaroo";
    $("official-percentile").disabled = programId !== "kangaroo";
    $("kangaroo-percentile-source").hidden = programId !== "kangaroo";
    $("aime-review-note").hidden = programId !== "aime";
    document.querySelector(".score-history").hidden = programId === "aime" || !historyEngine;
    $("answer-entry-guide").hidden = !format || !["amc8", "amc10", "amc12", "aime"].includes(format.id);
    $("answer-entry-guide").querySelector("strong").textContent = "답을 입력하고 공개 정답표와 대조해요";
    $("answer-entry-guide").querySelector("p").textContent = programId === "aime"
      ? "각 문항에 내가 쓴 정수 답(0–999)을 입력하고 ‘정답표 대조’를 누르면 LIVE 공개 답안과 자동 채점합니다. 빈칸은 미응답으로 처리하며, 답과 진단은 이 화면에서만 사용합니다."
      : "A–E에서 고른 답을 입력하고 ‘정답표 대조’를 누르면 LIVE 공개 답안과 자동 채점합니다. 빈칸은 미응답으로 처리하며, 풀이 영역과 오답 이유는 결과 화면에서 직접 조정할 수 있어요.";
    document.querySelector(".review-change-note").hidden = !format;
    $("review-amc8-practice").hidden = !(grade === 6 && programId === "amc8");
    $("review-sasmo-source").hidden = programId !== "sasmo";
    document.querySelector(".review-related").hidden = !format;
    updateReviewSourceNote(format);
    updateUrl();
  }
  function renderMarks() {
    lastAutoGradeSummary = null;
    $("answer-key-action-status").textContent = "";
    const list = $("paper-mark-list");
    list.replaceChildren();
    const format = selectedFormat();
    const hasChoiceAnswers = Boolean(format && ["amc8", "amc10", "amc12"].includes(format.id));
    const hasIntegerAnswers = Boolean(format && format.id === "aime");
    const hasAnswerEntry = hasChoiceAnswers || hasIntegerAnswers;
    list.hidden = !format;
    list.dataset.choiceEntry = String(hasAnswerEntry);
    $("mark-progress").hidden = !format;
    document.querySelector(".mark-head").hidden = !format;
    document.querySelector(".mark-head").dataset.choiceEntry = String(hasAnswerEntry);
    document.querySelector(".mark-head span:nth-child(2)").hidden = !hasAnswerEntry;
    document.querySelector(".review-form-actions").hidden = !format;
    if (!format) { resetReport(); return; }
    const paperFormat = selectedPaperFormat(format);
    const itemCount = paperFormat ? paperFormat.itemCount : format.itemCount;
    const domains = [{ id: "unclassified", title: "영역 선택" }].concat(analyzer.domainsFor(format.id));
    const selectedYear = Number($("archive-year").value || params.get("year"));
    const selectedForm = $("archive-form").value || params.get("form") || "";
    const answerKeyForm = answerKeyReference ? answerKeyReference.formFor(format.id, selectedYear, selectedForm) : null;
    $("apply-answer-key").hidden = !hasAnswerEntry;
    $("apply-answer-key").disabled = !answerKeyForm || answerKeyForm.itemCount !== itemCount;
    for (let index = 0; index < itemCount; index += 1) {
      const number = index + 1;
      const li = document.createElement("li");
      li.className = "paper-mark-row";
      li.dataset.choiceEntry = String(hasAnswerEntry);
      li.dataset.state = "unmarked";
      const concept = itemConceptReference ? itemConceptReference.referenceFor(format.id, selectedYear, selectedForm, index + 1) : null;
      li.dataset.suggestedDomain = concept ? concept.domain : "unclassified";
      li.dataset.domainOrigin = concept ? "source-mapped" : "unclassified";
      const marker = document.createElement("strong");
      marker.textContent = `Q${String(number).padStart(2, "0")}`;
      li.append(marker);
      [
        ...(hasChoiceAnswers ? [{ field: "answer", values: answerChoices, label: "내 답" }] : []),
        ...(hasIntegerAnswers ? [{ field: "answer", label: "내 답" }] : []),
        { field: "status", values: statuses, label: "정답 확인" },
        { field: "domain", values: domains, label: "영역" },
        { field: "reason", values: reasons, label: "오답 이유" }
      ].forEach(function (config) {
        const field = document.createElement("div");
        field.className = `mark-field mark-${config.field}`;
        const caption = document.createElement("span"); caption.textContent = config.label;
        const select = config.field === "answer" && hasIntegerAnswers ? document.createElement("input") : document.createElement("select");
        select.dataset.field = config.field;
        select.dataset.question = String(number);
        select.setAttribute("aria-label", `${number}번 ${config.label}`);
        if (config.field === "answer" && hasIntegerAnswers) {
          select.type = "text";
          select.inputMode = "numeric";
          select.maxLength = 3;
          select.pattern = "[0-9]{1,3}";
          select.placeholder = "0–999";
          select.autocomplete = "off";
        } else (config.values || []).forEach(function (entry) { select.append(option(entry.id, entry.title)); });
        if (config.field === "reason") select.disabled = true;
        if (config.field === "domain" && concept) select.value = concept.domain;
        select.addEventListener("change", function () {
          if (config.field === "status") {
            li.dataset.state = select.value;
            syncReasonField(li, select.value);
            const reasonSelect = li.querySelector('[data-field="reason"]');
            if (reasonSelect.disabled) reasonSelect.value = "none";
            if (select.value === "unmarked") {
              li.querySelector('[data-field="domain"]').value = "unclassified";
              li.dataset.domainOrigin = "unclassified";
            } else if (li.dataset.domainOrigin === "unclassified" && concept) {
              li.querySelector('[data-field="domain"]').value = concept.domain;
              li.dataset.domainOrigin = "source-mapped";
            }
          }
          if (config.field === "domain") li.dataset.domainOrigin = concept && select.value === concept.domain ? "source-mapped" : select.value === "unclassified" ? "unclassified" : "manual";
          if (config.field === "answer" && lastAutoGradeSummary) {
            lastAutoGradeSummary = null;
            li.querySelector('[data-field="status"]').value = "unmarked";
            li.dataset.state = "unmarked";
            syncReasonField(li, "unmarked");
            li.querySelector('[data-field="reason"]').value = "none";
            $("answer-key-action-status").textContent = "답이 바뀌었어요. 정답표를 다시 대조해 주세요.";
          } else if (config.field === "status" && lastAutoGradeSummary) lastAutoGradeSummary.adjusted = true;
          if (config.field === "status" || config.field === "answer") updateProgress();
          resetReport("내용이 바뀌었어요");
        });
        field.append(caption, select);
        if (config.field === "domain" && concept) {
          const suggestion = document.createElement("small");
          suggestion.className = "mark-concept-suggestion";
          const mappingCopy = concept.mappingStatus === "teacher-review-override"
            ? "교사 검토 분류"
            : concept.mappingStatus === "source-tag-crosswalk-suggestion"
              ? "원본 태그 기반 영역 제안"
              : "자동 영역 제안 · 교사 검토 필요";
          suggestion.append(document.createTextNode(`개념 ${concept.topicLabel} · ${mappingCopy} · `));
          const sourceLink = document.createElement("a");
          sourceLink.href = concept.sourceUrl;
          sourceLink.target = "_blank";
          sourceLink.rel = "noopener noreferrer";
          sourceLink.textContent = "LIVE 출처";
          sourceLink.setAttribute("aria-label", `${number}번 문항 개념 분류 출처 열기`);
          suggestion.append(sourceLink);
          suggestion.dataset.sourceConcepts = concept.sourceConcepts.join(";");
          field.append(suggestion);
        }
        if (config.field === "status" && paperLibrary && ["amc8", "amc10", "amc12", "aime"].includes(format.id)) {
          const year = Number($("archive-year").value || params.get("year"));
          const form = $("archive-form").value || params.get("form") || "";
          const source = paperLibrary.problemRoute(format.id, year, form, number);
          if (source) {
            const sourceLink = document.createElement("a");
            sourceLink.className = "mark-source-link";
            sourceLink.href = source;
            sourceLink.target = "_blank";
            sourceLink.rel = "noopener noreferrer";
            sourceLink.textContent = "원본 풀이·개념 ↗";
            sourceLink.setAttribute("aria-label", `${year} ${format.title} ${form ? `${form} ` : ""}${number}번 원본 풀이와 개념 열기`);
            field.append(sourceLink);
          }
        }
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
    if (format) {
      const paperFormat = selectedPaperFormat(format);
      const itemCount = paperFormat ? paperFormat.itemCount : format.itemCount;
      const answerInputs = $("paper-mark-list").querySelectorAll('[data-field="answer"]');
      if (answerInputs.length) {
        const answered = Array.from(answerInputs).filter(function (node) { return node.value !== ""; }).length;
        setText("mark-progress", `${marked} / ${itemCount}문제 채점 확인 · 답 입력 ${answered}문제`);
      } else setText("mark-progress", `${marked} / ${itemCount}문제 채점 확인`);
    }
  }
  function readMarks() {
    return Array.from($("paper-mark-list").children, function (li) {
      const answer = li.querySelector('[data-field="answer"]');
      return { answer: answer ? answer.value : "",
        status: li.querySelector('[data-field="status"]').value,
        domain: li.querySelector('[data-field="domain"]').value,
        suggestedDomain: li.dataset.suggestedDomain || "unclassified",
        domainOrigin: li.dataset.domainOrigin || "unclassified",
        sourceConceptLabel: conceptLabelFor(li),
        reason: li.querySelector('[data-field="reason"]').value };
    });
  }

  function applyPublicAnswerKey(format) {
    if (!answerKeyReference || !format || !["amc8", "amc10", "amc12", "aime"].includes(format.id)) return null;
    const year = Number($("archive-year").value || params.get("year"));
    const form = $("archive-form").value || params.get("form") || "";
    const formReference = answerKeyReference.formFor(format.id, year, form);
    const rows = Array.from($("paper-mark-list").children);
    if (!formReference || formReference.itemCount !== rows.length) return null;
    const answerInputs = rows.map(function (row) { return row.querySelector('[data-field="answer"]'); });
    const enteredCount = answerInputs.filter(function (input) { return input && input.value.trim() !== ""; }).length;
    if (enteredCount === 0) return null;
    let blankCount = 0;
    let correctCount = 0;
    let wrongCount = 0;
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const answerInput = answerInputs[index];
      const answer = answerInput ? answerInput.value.trim() : "";
      const reference = answerKeyReference.answerFor(format.id, year, form, index + 1);
      if (!reference) return null;
      const status = answer === "" ? "blank" : answerKeyReference.accepts(reference, answer) ? "correct" : "wrong";
      if (status === "blank") blankCount += 1;
      else if (status === "correct") correctCount += 1;
      else wrongCount += 1;
      row.querySelector('[data-field="status"]').value = status;
      row.dataset.state = status;
      syncReasonField(row, status);
      row.querySelector('[data-field="reason"]').value = "none";
      if (row.dataset.domainOrigin === "unclassified" && row.dataset.suggestedDomain && row.dataset.suggestedDomain !== "unclassified") {
        row.querySelector('[data-field="domain"]').value = row.dataset.suggestedDomain;
        row.dataset.domainOrigin = "source-mapped";
      }
    }
    updateProgress();
    return { enteredCount: enteredCount, correctCount: correctCount, wrongCount: wrongCount, blankCount: blankCount, itemCount: rows.length, sourceUrl: formReference.sourceUrl };
  }

  function conceptLabelFor(li) {
    const suggestion = li.querySelector(".mark-concept-suggestion");
    if (!suggestion) return "";
    return suggestion.firstChild ? suggestion.firstChild.textContent.replace(/^개념 /, "").replace(/ · (?:영역 제안|원본 태그 기반 영역 제안|자동 영역 제안 · 교사 검토 필요|교사 검토 분류) · $/, "") : "";
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
  function scoreHistoryCohortReference(record) {
    const distribution = window.GFIELDAMCScoreDistributionReference;
    if (!distribution) return null;
    const cycle = /^(\d{4})-\d{2}$/.exec(record.cycle);
    if (!cycle) return null;
    const contestYear = Number(cycle[1]) + (record.programId === "amc8" ? 1 : 0);
    const form = record.programId === "amc8" ? "" : record.form;
    const reference = distribution.referenceFor(record.programId, contestYear, form);
    if (!reference) return null;
    const reached = distribution.bands.find(function (band) { return record.rawScore >= reference[band.id]; });
    const match = reached
      ? `${reached.label} · ${reference[reached.id]} / ${record.maxScore}점 이상`
      : `상위 75% 기준 미만 · ${reference.top75} / ${record.maxScore}점`;
    return Object.freeze({ contestYear: contestYear, reference: reference, match: match });
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
        const cohort = scoreHistoryCohortReference(record);
        if (cohort) {
          const note = document.createElement("small"); note.className = "score-history-cohort"; note.textContent = `MAA 전체 응시자 기준 · ${cohort.match}`;
          const link = document.createElement("a"); link.href = cohort.reference.sourceUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "같은 시험지 분포 ↗";
          link.setAttribute("aria-label", `${cohort.contestYear} ${group.title}${record.programId === "amc8" ? "" : ` ${record.form}`} MAA 전체 응시자 점수 분포 보기`);
          scoreCell.append(document.createElement("br"), note, document.createElement("br"), link);
        }
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
      meta.textContent = `${record.paperLabel ? `${record.paperLabel} · ` : ""}${completion}정답 ${record.summary.correct} · 오답 ${record.summary.wrong} · 미응답 ${record.summary.blank} · 표시 안 함 ${record.summary.unmarked} · 영역 분류 ${record.summary.domainClassified}/${record.summary.itemCount}${record.officialPercentile == null ? "" : ` · 성적표 Grade ${record.grade} 전국 백분위 ${record.officialPercentile}%`}`;
      const domainHost = document.createElement("div"); domainHost.className = "saved-diagnostic-entry-domains"; domainHost.dataset.domainCount = String(record.domains.length);
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
  function renderResult(result, autoGradeSummary) {
    const label = $("review-paper-label").value.trim();
    const domains = [{ id: "unclassified", title: "영역 미분류" }].concat(analyzer.domainsFor(selectedFormat().id));
    const paperFormat = selectedPaperFormat(selectedFormat());
    const selectedYear = Number($("archive-year").value || params.get("year"));
    lastDiagnostic = result;
    $("report-roadmap-link").href = `./boarding-roadmap.html?grade=${encodeURIComponent(grade)}&program=${encodeURIComponent(selectedFormat().id)}#grade-map`;
    $("report-roadmap-link").textContent = `선택한 Grade ${grade} 학습 경로 보기 →`;
    setText("report-roadmap-note", result.level
      ? selectedFormat().id === "aime" ? "AIME 원본의 정답 수만 보여 줍니다. 학년별 순위·등급이나 AIME 자격 판단은 제공하지 않아요." : "원본 점수와 문항 구간은 이 시험지에서 확인한 실전 결과예요. 영역별 정답률은 직접 표시한 문항을 기준으로 읽어 주세요."
      : "문항 분류와 정답률은 학년 수준을 판정하지 않습니다.");
    const reportTitle = selectedFormat().id === "amc12" && selectedYear < 2000 ? `AHSME ${selectedYear}` : selectedFormat().title;
    setText("report-title", `${reportTitle} · ${result.complete ? "전체 결과" : "입력한 결과"}`);
    const historicalName = selectedFormat().id === "amc12" && selectedYear < 2000 ? `AHSME ${selectedYear} · ` : "";
    setText("report-intro", `${label ? `${label} · ` : historicalName}${paperFormat && paperFormat.durationMinutes ? `${paperFormat.durationMinutes}분 · ` : ""}${result.itemCount}문제 중 ${result.counts.unmarked}문제는 표시하지 않았습니다. ${result.attempted < 3 ? "푼 문제가 3개 미만이어서 비율 비교는 보류했습니다." : `정답률은 실제로 푼 ${result.attempted}문제 기준입니다.`}`);
    const answerKeyNote = $("answer-key-result-note");
    answerKeyNote.hidden = !autoGradeSummary;
    answerKeyNote.replaceChildren();
    if (autoGradeSummary) {
      answerKeyNote.append(document.createTextNode(`LIVE 공개 정답표로 ${autoGradeSummary.itemCount}문항을 대조했어요. 정답 ${autoGradeSummary.correctCount} · 오답 ${autoGradeSummary.wrongCount} · 미응답 ${autoGradeSummary.blankCount}${autoGradeSummary.adjusted ? " · 이후 답안 상태를 직접 수정" : ""} · `));
      const answerKeyLink = document.createElement("a");
      answerKeyLink.href = autoGradeSummary.sourceUrl;
      answerKeyLink.target = "_blank";
      answerKeyLink.rel = "noopener noreferrer";
      answerKeyLink.textContent = "정답표 출처 ↗";
      answerKeyNote.append(answerKeyLink);
    }
    const officialPercentile = $("official-percentile").value === "" ? null : Number($("official-percentile").value);
    const officialPercentileResult = $("official-percentile-result");
    officialPercentileResult.hidden = selectedFormat().id !== "kangaroo" || officialPercentile === null;
    officialPercentileResult.textContent = officialPercentileResult.hidden ? "" : `공식 성적표 · Grade ${grade} 전국 백분위 ${officialPercentile}% · 해당 학년 참가자 안에서의 상대 위치`;
    $("score-estimate").hidden = !result.scoreEstimate;
    const scorePolicyLink = $("score-estimate").querySelector("a");
    if (scorePolicyLink) {
      const paperYear = Number($("archive-year").value || params.get("year"));
      const isHistoricalAhsm = selectedFormat().id === "amc12" && paperYear < 2000;
      scorePolicyLink.hidden = selectedFormat().id === "aime";
      scorePolicyLink.href = isHistoricalAhsm
        ? "https://www.ams.org/bookstore/pspdf/prb-34-pref.pdf"
        : "https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf";
      scorePolicyLink.textContent = isHistoricalAhsm ? "AHSME 시험 형식의 역사 · AMS/MAA ↗" : "MAA 2026–27 공식 채점 안내 ↗";
    }
    if (result.scoreEstimate) setText("score-estimate-value", `${result.scoreEstimate.label} · ${result.scoreEstimate.points} / ${result.scoreEstimate.max}`);
    const amcReference = window.GFIELDAMCScoreDistributionReference;
    const amcCohortSection = $("amc-cohort-reference");
    const selectedForm = $("archive-form").value || params.get("form") || "";
    const amcCohort = ["amc8", "amc10", "amc12"].includes(selectedFormat().id) && result.complete && result.scoreEstimate && amcReference
      ? amcReference.referenceFor(selectedFormat().id, selectedYear, selectedForm)
      : null;
    amcCohortSection.hidden = !amcCohort;
    if (amcCohort) {
      const cohortName = amcCohort.displayLabel || (selectedFormat().id === "amc8" ? "AMC 8" : `${selectedFormat().title} ${selectedForm}`);
      setText("amc-cohort-summary", `${selectedYear} ${cohortName} · Grade ${grade}로 입력한 점수 ${result.scoreEstimate.points} / ${result.scoreEstimate.max} · 공개된 해당 회차 전체 응시자 기준과 대조합니다.`);
      const cohortBands = $("amc-cohort-bands");
      cohortBands.replaceChildren();
      amcReference.bands.filter(function (band) { return Number.isFinite(amcCohort[band.id]); }).forEach(function (band) {
        const item = document.createElement("div");
        const reached = result.scoreEstimate.points >= amcCohort[band.id];
        item.className = "paper-question-band aime-cohort-band" + (reached ? " is-reached" : "");
        const label = document.createElement("strong"); label.textContent = band.label;
        const score = document.createElement("span"); score.textContent = `${Number.isInteger(amcCohort[band.id]) ? amcCohort[band.id] : amcCohort[band.id].toFixed(1)} / ${result.scoreEstimate.max}`;
        const details = document.createElement("small"); details.textContent = reached ? "기준점 이상" : "기준점 미만";
        item.append(label, score, details); cohortBands.append(item);
      });
      const reportAsOf = amcCohort.reportAsOf ? `자료 기준일 ${amcCohort.reportAsOf}` : "";
      const statParts = [
        Number.isFinite(amcCohort.students) ? `전체 응시 ${amcCohort.students.toLocaleString("en-US")}명` : "",
        Number.isFinite(amcCohort.schools) ? `학교 ${amcCohort.schools.toLocaleString("en-US")}곳` : "",
        Number.isFinite(amcCohort.average) ? `평균 ${amcCohort.average.toFixed(2)}` : "",
        Number.isFinite(amcCohort.standardDeviation) ? `표준편차 ${amcCohort.standardDeviation.toFixed(2)}` : "",
        reportAsOf
      ].filter(Boolean);
      setText("amc-cohort-stats", statParts.length ? `${statParts.join(" · ")}.` : "출처에서 확인한 평균·표본 수는 없습니다.");
      const sourceNote = $("amc-cohort-source-note");
      const sourceLink = $("amc-cohort-source");
      sourceNote.replaceChildren(document.createTextNode(`${amcCohort.sourceNote || "MAA 공개 보고서의 같은 연도·시험지 전체 응시자 기준점입니다. 동점자가 있을 수 있어 개인의 정확한 백분위가 아니며, 응시 학년별 순위·등급이나 공식 자격 판정이 아닙니다. 다른 연도·회차와 직접 비교하지 마세요."} `), sourceLink);
      if (amcCohort.corroboratingSourceUrl) {
        const corroboratingLink = document.createElement("a");
        corroboratingLink.href = amcCohort.corroboratingSourceUrl;
        corroboratingLink.target = "_blank";
        corroboratingLink.rel = "noopener noreferrer";
        corroboratingLink.textContent = "교차 확인 자료 ↗";
        sourceNote.append(corroboratingLink);
      }
      sourceLink.href = amcCohort.sourceUrl;
      sourceLink.textContent = amcCohort.sourceLabel || (amcCohort.sourceNote ? `${selectedYear} MAA 보고서 재게시 출처 ↗` : "MAA 공개 점수 분포 ↗");
    }
    const historicalAwardReference = window.GFIELDAMC8HistoricalAwardReference;
    const historicalAwardSection = $("amc8-historical-award-reference");
    const historicalAward = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && historicalAwardReference
      ? historicalAwardReference.referenceFor(selectedYear)
      : null;
    historicalAwardSection.hidden = !historicalAward;
    if (historicalAward) {
      setText("amc8-historical-award-summary", `${historicalAward.year} AMC 8 · 입력 학년 Grade ${grade} · ${result.scoreEstimate.points}/25점 · 전체 응시자 기준선`);
      const historicalAwardBands = $("amc8-historical-award-bands");
      historicalAwardBands.replaceChildren();
      [
        { label: "Honor Roll · 상위 약 5%", cutoff: historicalAward.honorRollTop5 },
        { label: "Distinguished Honor Roll · 상위 약 1%", cutoff: historicalAward.distinguishedHonorRollTop1 }
      ].forEach(function (datum) {
        const item = document.createElement("div");
        const reached = result.scoreEstimate.points >= datum.cutoff;
        item.className = "paper-question-band aime-cohort-band" + (reached ? " is-reached" : "");
        const label = document.createElement("strong"); label.textContent = datum.label;
        const score = document.createElement("span"); score.textContent = `${datum.cutoff} / 25`;
        const distance = result.scoreEstimate.points - datum.cutoff;
        const details = document.createElement("small"); details.textContent = distance >= 0 ? `기준점보다 ${distance}점 위` : `기준점까지 ${Math.abs(distance)}점`;
        item.append(label, score, details); historicalAwardBands.append(item);
      });
      $("amc8-historical-award-source").href = historicalAward.sourceUrl;
    }
    const aimeCutoffReference = window.GFIELDAMCAIMECutoffReference;
    const aimeCutoffSection = $("amc-aime-cutoff-reference");
    const aimeCutoff = ["amc10", "amc12"].includes(selectedFormat().id) && result.complete && result.scoreEstimate && aimeCutoffReference
      ? aimeCutoffReference.referenceFor(selectedFormat().id, selectedYear, selectedForm)
      : null;
    aimeCutoffSection.hidden = !aimeCutoff;
    if (aimeCutoff) {
      const contestLabel = selectedFormat().id === "amc10" ? "AMC 10" : "AMC 12";
      const administrationLabel = aimeCutoff.administration === "spring" ? "봄" : aimeCutoff.administration === "fall" ? "가을" : "";
      const originalForm = selectedForm === "C" ? "A" : selectedForm === "D" ? "B" : selectedForm;
      const paperLabel = `${selectedYear}${administrationLabel ? ` ${administrationLabel}` : ""} ${contestLabel}${originalForm ? ` ${originalForm}` : ""}`;
      const score = result.scoreEstimate.points;
      const difference = score - aimeCutoff.cutoff;
      setText("amc-aime-cutoff-summary", `${paperLabel} · 응시 점수 ${score} / 150점 · 당시 진출선 ${aimeCutoff.cutoff}점`);
      const bands = $("amc-aime-cutoff-bands");
      bands.replaceChildren();
      const item = document.createElement("div");
      item.className = "paper-question-band aime-cohort-band" + (difference >= 0 ? " is-reached" : "");
      const label = document.createElement("strong"); label.textContent = "당시 AIME 진출 점수선";
      const cutoff = document.createElement("span"); cutoff.textContent = `${aimeCutoff.cutoff} / 150`;
      const comparison = document.createElement("small"); comparison.textContent = difference >= 0 ? `입력 점수가 ${difference}점 위` : `점수선까지 ${Math.abs(difference)}점`;
      item.append(label, cutoff, comparison); bands.append(item);
      $("amc-aime-cutoff-source").href = aimeCutoff.sourceUrl;
      $("amc-aime-cutoff-source").textContent = aimeCutoff.year === 2025 ? "MAA 공식 발표와 대조한 점수선 ↗" : "연도별 AIME 점수선 자료 ↗";
    }
    const historicalGradeReference = window.GFIELDAMCHistoricalGradeReference;
    const gradeReferenceSection = $("amc-grade-reference");
    const gradeReference = ["amc8", "amc10", "amc12"].includes(selectedFormat().id) && result.complete && result.scoreEstimate && historicalGradeReference
      ? historicalGradeReference.referenceFor(selectedFormat().id, selectedYear, selectedForm, grade)
      : null;
    gradeReferenceSection.hidden = !gradeReference;
    if (gradeReference) {
      const formatLabel = selectedFormat().id === "amc8" ? "AMC 8" : `${selectedFormat().title} ${selectedForm}`;
      const isUsForumTranscription = gradeReference.sourceStatus === "secondary-forum-transcription-of-MAA-us-grade-report";
      const globalReport = gradeReference.sourceStatus === "secondary-international-administrator-report";
      const reportPopulation = globalReport && gradeReference.population.indexOf("United States and Canada") === 0 ? "미국·캐나다 참가자" : globalReport ? "세계 참가자" : "";
      setText("amc-grade-reference-summary", `Grade ${grade} · ${selectedYear} ${formatLabel} · 기록된 학년 참가자 ${gradeReference.participants.toLocaleString("en-US")}명${isUsForumTranscription ? " · 미국 위치 기준" : reportPopulation ? ` · ${reportPopulation} 보고서` : ""}${gradeReference.note ? ` · ${gradeReference.note}` : ""}`);
      const plot = $("amc-grade-reference-plot");
      plot.replaceChildren();
      plot.setAttribute("aria-label", `응시 점수 ${result.scoreEstimate.points}점과 해당 학년 평균 ${gradeReference.mean}점 비교`);
      [
        { label: "이번 원본", value: result.scoreEstimate.points, kind: "learner" },
        { label: "해당 학년 평균", value: gradeReference.mean, kind: "mean" }
      ].forEach(function (datum) {
        const row = document.createElement("div"); row.className = `amc-grade-reference-row is-${datum.kind}`;
        const label = document.createElement("span"); label.textContent = datum.label;
        const value = document.createElement("strong"); value.textContent = `${Number.isInteger(datum.value) ? datum.value : datum.value.toFixed(2)} / ${gradeReference.max}`;
        const track = document.createElement("div"); track.className = "amc-grade-reference-track"; track.setAttribute("aria-hidden", "true");
        const fill = document.createElement("span"); fill.style.width = `${Math.max(0, Math.min(100, datum.value / gradeReference.max * 100))}%`;
        track.append(fill); row.append(label, value, track); plot.append(row);
      });
      const difference = result.scoreEstimate.points - gradeReference.mean;
      const differenceLabel = difference === 0 ? "평균과 같은 점수" : `${Math.abs(difference).toFixed(2)}점 ${difference > 0 ? "위" : "아래"}`;
      setText("amc-grade-reference-delta", `해당 회차 평균보다 ${differenceLabel}`);
      const gradeReferenceSource = $("amc-grade-reference-source");
      gradeReferenceSource.href = gradeReference.sourceUrl;
      const secondarySource = gradeReference.sourceStatus === "secondary-school-publication-reporting-national-grade-statistic";
      const forumTranscription = gradeReference.sourceStatus === "secondary-forum-transcription-of-MAA-us-grade-report";
      gradeReferenceSource.textContent = secondarySource ? "학교 공개 통계 원문 ↗" : forumTranscription ? "MAA 표 전사 원문 ↗" : globalReport ? "99CEF 통계 보고서 ↗" : "원자료 보고서 ↗";
      setText("amc-grade-reference-source-note", secondarySource
        ? "학교가 공개한 전국 학년별 통계의 재인용입니다. MAA 원본 보고서 파일을 확보하지 못했습니다. 이 표본 평균은 현재 기준점·백분위·능력 등급이 아닙니다. "
          : globalReport
          ? gradeReference.population.indexOf("United States and Canada") === 0
            ? "99CEF 분석 보고서의 미국·캐나다 참가자 집계입니다. 세계 참가자 통계와 서로 다른 모집단이므로 연도별 추세로 직접 비교하지 않습니다. 해당 회차·기록 학년의 과거 평균일 뿐 백분위·현재 규준·능력 등급이 아닙니다. "
            : "99CEF 분석 보고서의 세계 참가자 집계이며 미국 단독 모집단은 아닙니다. 해당 연도·시험형·기록 학년의 과거 평균만 비교합니다. 백분위·현재 규준·능력 등급이 아닙니다. "
          : forumTranscription
          ? "포럼에 전사된 MAA 학년 평균표입니다. 표의 Location은 United States이며 MAA 원본 보고서는 회수하지 못했습니다. 미국 응시집단의 당시 평균 비교이며 전국 전체·백분위·현재 능력 등급이 아닙니다. "
          : "같은 연도·시험형·기록 학년이 확인되는 과거 응시 집단 평균입니다. 현재 기준점이나 능력 등급이 아니며, 다른 연도·시험형으로 비교하지 않습니다. 표본과 범위는 연결된 출처 기준입니다. ");
    }
    const koreaPercentileReference = window.GFIELDAMC8KoreaPercentileReference;
    const koreaPercentileSection = $("amc8-korea-percentile-reference");
    const koreaPercentile = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && koreaPercentileReference
      ? koreaPercentileReference.referenceFor(selectedYear, grade, result.scoreEstimate.points)
      : null;
    koreaPercentileSection.hidden = !koreaPercentile;
    if (koreaPercentile) {
      setText("amc8-korea-percentile-summary", `${koreaPercentile.year} AMC 8 · Grade ${koreaPercentile.sourceGradeLabel} · ${koreaPercentile.score}/25점 · 점수 ${koreaPercentile.studentsAtScore}명 · 학년 표본 ${koreaPercentile.gradeParticipants}명`);
      const percentileLabel = koreaPercentile.percentileType === "reported-in-source-table" ? "원자료 기록 백분위" : "학년별 점수 분포 계산 백분위";
      setText("amc8-korea-percentile-value", `${percentileLabel} ${koreaPercentile.reportedPercentile.toFixed(2)}% · ${koreaPercentile.percentileMethod}`);
      $("amc8-korea-percentile-source").href = koreaPercentile.sourceUrl;
    }
    const globalGradeScoreReference = window.GFIELDAMC8GlobalGradeScoreReference;
    const globalGradeScoreSection = $("amc8-global-grade-score-reference");
    const globalGradeScore = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && globalGradeScoreReference
      ? globalGradeScoreReference.referenceFor(selectedYear, grade, result.scoreEstimate.points)
      : null;
    globalGradeScoreSection.hidden = !globalGradeScore;
    if (globalGradeScore) {
      setText("amc8-global-grade-score-summary", `${globalGradeScore.year} AMC 8 · ${globalGradeScore.gradeLabel} · ${globalGradeScore.score}/25점 · 해당 점수 ${globalGradeScore.participantsAtScore.toLocaleString("en-US")}명 · 학년 표본 ${globalGradeScore.gradeParticipants.toLocaleString("en-US")}명`);
      setText("amc8-global-grade-score-value", `점수보다 낮은 응시자 ${globalGradeScore.strictlyLowerShare.toFixed(2)}% · ${globalGradeScore.strictlyLowerCount.toLocaleString("en-US")}/${globalGradeScore.gradeParticipants.toLocaleString("en-US")}명`);
      setText("amc8-global-grade-score-note", globalGradeScore.year === 2019
        ? "2019 MAA Overall 성적 보고서 이미지의 학년별 점수 빈도입니다. Grade 5 이하는 원자료에서 한 그룹으로 묶인 표본이며, Grade 6–8은 각각 따로 보고됐습니다. 학년 미기록 표본은 학년 비교에서 제외했으며, 그룹별 표본 수와 가중 평균을 보고서 요약과 대조했습니다."
        : "2009년 MAA 연례 보고서에 제시된 전체 응시학교의 기록 학년별 점수 분포입니다. 4–5학년은 원자료의 묶음입니다.");
      $("amc8-global-grade-score-source").href = globalGradeScore.sourceUrl;
      $("amc8-global-grade-report-source").href = globalGradeScore.reportUrl;
    }
    const aimeReference = window.GFIELDAimeScoreDistributionReference;
    const aimeCohort = $("aime-cohort-reference");
    const aimeKeyYear = Number($("archive-year").value || params.get("year"));
    const aimeKeyForm = $("archive-form").value || params.get("form") || "";
    const cohort = selectedFormat().id === "aime" && result.complete && result.scoreEstimate && aimeReference
      ? aimeReference.referenceFor(aimeKeyYear, aimeKeyForm)
      : null;
    aimeCohort.hidden = !cohort;
    if (cohort) {
      setText("aime-cohort-summary", `${aimeKeyYear} AIME ${aimeKeyForm} · ${result.scoreEstimate.points}/15 정답 · 같은 시험지 응시자 분포 기준점과 비교합니다.`);
      const cohortBands = $("aime-cohort-bands");
      cohortBands.replaceChildren();
      aimeReference.bands.forEach(function (band) {
        const item = document.createElement("div");
        item.className = "paper-question-band aime-cohort-band" + (result.scoreEstimate.points >= cohort[band.id] ? " is-reached" : "");
        const label = document.createElement("strong"); label.textContent = band.label;
        const score = document.createElement("span"); score.textContent = `${cohort[band.id]} / 15`;
        const details = document.createElement("small"); details.textContent = result.scoreEstimate.points >= cohort[band.id] ? "기준점 이상" : "기준점 미만";
        item.append(label, score, details); cohortBands.append(item);
      });
      setText("aime-cohort-stats", `참가자 ${cohort.students.toLocaleString("en-US")}명 · 학교 ${cohort.schools.toLocaleString("en-US")}곳 · 평균 ${cohort.average.toFixed(2)} · 표준편차 ${cohort.standardDeviation.toFixed(2)}. MAA 공개 분포 보고서의 해당 연도·회차 값입니다.`);
    }
    const aimeGradeReference = window.GFIELDAIMEHistoricalGradeDistributionReference;
    const aimeGradeSection = $("aime-historical-grade-reference");
    const aimeGradeResult = selectedFormat().id === "aime" && result.complete && result.scoreEstimate && aimeGradeReference
      ? aimeGradeReference.referenceFor(aimeKeyYear, aimeKeyForm, grade, result.scoreEstimate.points)
      : null;
    aimeGradeSection.hidden = !aimeGradeResult;
    if (aimeGradeResult) {
      setText("aime-historical-grade-summary", `${aimeGradeResult.year} AIME ${aimeGradeResult.form} · Grade ${aimeGradeResult.grade} · 학년 표본 ${aimeGradeResult.participants.toLocaleString("en-US")}명 · ${aimeGradeResult.score}/15점`);
      setText("aime-historical-grade-result", `이 점수보다 낮은 응시자 ${aimeGradeResult.studentsBelowScore.toLocaleString("en-US")}명 / ${aimeGradeResult.participants.toLocaleString("en-US")}명 · ${aimeGradeResult.lowerScorePercent.toFixed(2)}% · 같은 점수 ${aimeGradeResult.studentsAtScore.toLocaleString("en-US")}명`);
      $("aime-historical-grade-source").href = aimeGradeResult.sourceUrl;
    }
    const paperPerformance = $("paper-performance");
    paperPerformance.hidden = !result.level || !result.questionBands.length;
    if (!paperPerformance.hidden) {
      setText("paper-performance-summary", `${selectedFormat().title} 원본 ${result.scoreEstimate.points} / ${result.scoreEstimate.max}점 · 문항 구간별 결과로 실전 풀이 범위를 확인해요.`);
      const bands = $("paper-question-bands");
      bands.replaceChildren();
      result.questionBands.forEach(function (band) {
        const item = document.createElement("div");
        item.className = "paper-question-band";
        const label = document.createElement("strong"); label.textContent = `${band.start}–${band.end}번`;
        const score = document.createElement("span"); score.textContent = `${band.correct} / ${band.total} 정답`;
        const details = document.createElement("small"); details.textContent = `오답 ${band.wrong} · 미응답 ${band.blank}`;
        item.append(label, score, details); bands.append(item);
      });
    }
    const scoreNote = $("score-estimate-note");
    const isAmcRawReference = ["amc8", "amc10", "amc12"].includes(selectedFormat().id);
    scoreNote.hidden = !isAmcRawReference || Boolean(result.scoreEstimate);
    if (isAmcRawReference && !result.scoreEstimate) {
      setText("score-estimate-note", result.counts.unmarked
        ? `${paperFormat && paperFormat.rawOnly ? `${paperFormat.title} 초기 회차는 문항별 배점이 달라 전체 정답 개수만 표시합니다. ` : "원본 점수는 모든 문항을 표시한 뒤 계산해요. "}아직 표시하지 않은 ${result.counts.unmarked}문항은 ‘표시 안 함’으로 두고, 답안 공란은 ‘미응답’으로 표시하세요.`
        : paperFormat && paperFormat.rawOnly
          ? `${paperFormat.title} 초기 회차는 문항별 배점이 달라 이 화면에서 점수 환산을 하지 않습니다. 원본 PDF의 배점 안내를 확인하세요.`
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
    const heading = document.createElement("h3"); heading.textContent = `풀이 영역 · ${result.domainClassified}/${result.itemCount}문항`; domainHost.append(heading);
    const domainNote = document.createElement("p"); domainNote.className = "report-evidence-note";
    const mappingNote = result.sourceConceptReferenceCount ? ` LIVE 문항 개념 자료 ${result.sourceConceptReferenceCount}개가 연결되어 있어요. 이 중 ${result.sourceMappedCount}문항은 제안 영역을 사용했고 ${result.manualDomainCount}문항은 직접 분류했어요. 영역은 문항마다 바꿀 수 있습니다.` : " 원본 풀이의 문항별 개념 태그 연결 자료가 없는 회차는 직접 분류한 영역만 사용합니다.";
    domainNote.textContent = `정답률은 표시한 풀이 문항만으로 계산하고, 미응답은 따로 보여 드려요.${mappingNote} 3문제 미만은 비교하지 않습니다.`;
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
    const itemResponseReference = window.GFIELDAMC8ItemResponseReference;
    const amc10And12ItemResponseReference = window.GFIELDAMC10_12ItemResponseReference;
    const responseForItem = function (question, answer) {
      if (selectedFormat().id === "amc8" && itemResponseReference) {
        return itemResponseReference.responseFor(selectedYear, question, answer, grade);
      }
      if (["amc10", "amc12"].includes(selectedFormat().id) && amc10And12ItemResponseReference) {
        return amc10And12ItemResponseReference.responseFor(selectedFormat().id, selectedYear, $("archive-form").value || params.get("form") || "", question, answer);
      }
      return null;
    };
    const cohortForYear = responseForItem(1, "");
    const showItemResponses = Boolean(cohortForYear);
    const isSchoolCohort = Boolean(cohortForYear && /school cohort/i.test(cohortForYear.sourceStatus));
    $("report-review-items-note").textContent = showItemResponses
      ? `직접 표시한 오답과 미응답입니다. ${cohortForYear.population}의 문항별 응답 비율을 참고로 보여 줍니다. ${isSchoolCohort ? "특정 학교 응시집단 표본이며 전국 학년 기준이 아닙니다." : "당시 해당 집단의 기록이며 학년별 비교나 현재 기준은 아닙니다."}`
      : "직접 표시한 오답과 미응답입니다. 각 문항의 원본 개념·힌트·해설을 확인한 뒤 지필드 유사 유형으로 이어갈 수 있어요.";
    result.reviewItems.forEach(function (item) {
      const itemReference = showItemResponses ? responseForItem(item.number, item.answer) : null;
      const row = document.createElement("li");
      const domain = domains.find(function (entry) { return entry.id === item.domain; });
      const reason = reasons.find(function (entry) { return entry.id === item.reason; });
      const itemState = item.status === "wrong" ? "오답" : "미응답";
      const blankReason = blankReasons.find(function (entry) { return entry.id === item.reason; });
      const selectedForm = $("archive-form").value || params.get("form") || "";
      const answerKey = answerKeyReference ? answerKeyReference.answerFor(selectedFormat().id, selectedYear, selectedForm, item.number) : null;
      const details = [item.answer ? `내 답 ${item.answer}` : "답 미입력", answerKey ? `정답 ${answerKey.correctAnswer}` : "", item.sourceConceptLabel, domain && item.domain !== "unclassified" ? domain.title : "영역 미분류", item.status === "wrong" && reason && item.reason !== "none" ? reason.title : "", item.status === "blank" && blankReason && item.reason !== "none" ? blankReason.title : ""].filter(Boolean);
      const summary = document.createElement("span");
      summary.textContent = `${item.number}번 · ${itemState} · ${details.join(" · ")}`;
      row.append(summary);
      if (itemReference) {
        const population = document.createElement("small");
        population.className = "report-item-response-reference";
        const commonDistractor = itemReference.mostCommonDistractor;
        const acceptedAnswerNote = itemReference.acceptedAnswers.length > 1 ? ` · 인정 답 ${itemReference.acceptedAnswers.join("·")}` : "";
        population.textContent = item.answer
            ? `${itemReference.program ? `${selectedYear} ${selectedFormat().title} ${itemReference.form}` : selectedYear} 응답 집계 · 정답률 ${itemReference.correctResponsePercent.toFixed(2)}% · ${item.answer} 선택 ${itemReference.selectedResponsePercent.toFixed(2)}%${acceptedAnswerNote}`
            : `${itemReference.program ? `${selectedYear} ${selectedFormat().title} ${itemReference.form}` : selectedYear} 응답 집계 · 정답 ${itemReference.acceptedAnswers.join("·")} · 정답률 ${itemReference.correctResponsePercent.toFixed(2)}% · 최다 오답 ${commonDistractor.answer} ${commonDistractor.percent.toFixed(2)}%`;
        row.append(population);
      }
      if (paperLibrary && ["amc8", "amc10", "amc12", "aime"].includes(selectedFormat().id)) {
        const year = Number($("archive-year").value || params.get("year"));
        const form = $("archive-form").value || params.get("form") || "";
        const source = paperLibrary.problemRoute(selectedFormat().id, year, form, item.number);
        if (source) {
          const sourceLink = document.createElement("a");
          sourceLink.className = "report-review-source-link";
          sourceLink.href = source;
          sourceLink.target = "_blank";
          sourceLink.rel = "noopener noreferrer";
          sourceLink.textContent = "원본 문항·개념·해설 ↗";
          sourceLink.setAttribute("aria-label", `${year} ${selectedFormat().title} ${form ? `${form} ` : ""}${item.number}번 원본 문항, 개념, 해설 열기`);
          row.append(sourceLink);
        }
      }
      if (itemReference) {
        const sourceLink = document.createElement("a");
        sourceLink.className = "report-review-source-link";
        sourceLink.href = itemReference.sourceUrl;
        sourceLink.target = "_blank";
        sourceLink.rel = "noopener noreferrer";
        sourceLink.textContent = "문항 응답 집계 출처 ↗";
        sourceLink.setAttribute("aria-label", `${selectedYear} ${selectedFormat().title}${selectedForm ? ` ${selectedForm}` : ""} ${item.number}번 문항 응답 집계 출처 열기`);
        row.append(sourceLink);
      }
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
    const practiceDomains = Array.from(new Set(result.reviewItems.map(function (item) { return item.domain; }).filter(function (domain) { return domain !== "unclassified"; })));
    const practiceParams = new URLSearchParams();
    if (practiceDomains.length) practiceParams.set("domains", practiceDomains.join(","));
    practiceParams.set("sourceYear", $("archive-year").value || params.get("year") || "");
    practiceParams.set("sourceForm", $("archive-form").value || params.get("form") || "");
    practiceParams.set("sourceQuestions", result.reviewItems.map(function (item) { return item.number; }).join(","));
    if (itemConceptReference && ["amc8", "amc10", "amc12", "aime"].includes(selectedFormat().id)) {
      const sourceConcepts = Array.from(new Set(result.reviewItems.flatMap(function (item) {
        const reference = itemConceptReference.referenceFor(selectedFormat().id, Number(practiceParams.get("sourceYear")), practiceParams.get("sourceForm"), item.number);
        return reference ? reference.sourceConcepts : [];
      })));
      if (sourceConcepts.length) practiceParams.set("sourceConcepts", sourceConcepts.join(","));
    }
    const followUpRoutes = {
      amc8: { href: `./amc8-grade7-mock-exam.html?${new URLSearchParams({ grade: String(grade), domains: practiceDomains.join(","), sourceYear: practiceParams.get("sourceYear") || "", sourceForm: practiceParams.get("sourceForm") || "", sourceQuestions: practiceParams.get("sourceQuestions") || "", sourceConcepts: practiceParams.get("sourceConcepts") || "" }).toString()}`, title: "지필드 AMC 8 범위 모의고사", copy: "원본에서 표시한 개념을 지필드 자체 모의고사와 후속 창작 연습으로 연결합니다. 원본 결과와 모의고사 결과는 별도로 확인해요." },
      amc10: { href: `./amc10-gfield-mock-exam.html?${new URLSearchParams({ grade: String(grade), domains: practiceDomains.join(","), sourceYear: practiceParams.get("sourceYear") || "", sourceForm: practiceParams.get("sourceForm") || "", sourceQuestions: practiceParams.get("sourceQuestions") || "", sourceConcepts: practiceParams.get("sourceConcepts") || "" }).toString()}`, title: "지필드 AMC 10 범위 모의고사", copy: "원본에서 틀리거나 비워 둔 문항의 개념을 지필드 자체 모의고사와 연결해 연습합니다. 연결 문항이 없는 개념은 영역 연습으로 이어집니다." },
      amc12: { href: `./amc12-gfield-mock-exam.html?${new URLSearchParams({ grade: String(grade), domains: practiceDomains.join(","), sourceYear: practiceParams.get("sourceYear") || "", sourceForm: practiceParams.get("sourceForm") || "", sourceQuestions: practiceParams.get("sourceQuestions") || "", sourceConcepts: practiceParams.get("sourceConcepts") || "" }).toString()}`, title: "지필드 AMC 12 범위 모의고사", copy: "원본에서 틀리거나 비워 둔 문항의 개념을 지필드 자체 모의고사와 연결해 연습합니다. 연결 문항이 없는 개념은 영역 연습으로 이어집니다." },
      aime: { href: `./aime-practice.html?${new URLSearchParams({ grade: String(grade), domains: practiceDomains.join(","), sourceYear: practiceParams.get("sourceYear") || "", sourceForm: practiceParams.get("sourceForm") || "", sourceQuestions: practiceParams.get("sourceQuestions") || "", sourceConcepts: practiceParams.get("sourceConcepts") || "" }).toString()}`, title: "지필드 AIME 개념 연습", copy: "원본에서 틀리거나 비워 둔 문항의 개념 태그와 일치하는 지필드 창작 문제를 먼저 보여 줍니다. 직접 연결되는 문항이 없는 경우 영역 연습으로 이어집니다." }
    };
    const followUpConfig = followUpRoutes[selectedFormat().id];
    $("report-follow-up").hidden = !followUpConfig;
    if (followUpConfig) {
      setText("report-follow-up-copy", followUpConfig.copy);
      $("report-follow-up-link").href = followUpConfig.href;
      $("report-follow-up-link").textContent = `${followUpConfig.title} →`;
    }
    $("save-diagnostic").hidden = !localRecords;
    if (!$("save-diagnostic").disabled) $("diagnostic-save-status").textContent = "";
    document.querySelector(".review-report").hidden = false;
    document.querySelector(".review-layout").classList.remove("is-empty");
    $("report-title").focus();
  }
  $("review-grade").addEventListener("change", function (event) { grade = Number(event.target.value); $("review-paper-label").value = ""; $("review-paper-label").dataset.archiveDefault = ""; renderSettings(); renderMarks(); $("official-percentile").value = ""; });
  $("review-program").addEventListener("change", function (event) { programId = event.target.value; $("review-paper-label").value = ""; $("review-paper-label").dataset.archiveDefault = ""; renderSettings(); renderMarks(); $("official-percentile").value = ""; });
  $("review-paper-label").addEventListener("input", function () { resetReport("내용이 바뀌었어요"); });
  $("official-percentile").addEventListener("input", function () { resetReport("내용이 바뀌었어요"); });
  $("clear-marks").addEventListener("click", function () { renderMarks(); $("review-paper-label").value = ""; });
  $("paper-review-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const format = selectedFormat();
    if (!format) { showAlert("paper-error", "대회를 선택해 주세요."); return; }
    if (format.id === "kangaroo" && $("official-percentile").value !== "") {
      const percentile = Number($("official-percentile").value);
      if (!Number.isFinite(percentile) || percentile < 0 || percentile > 100) { showAlert("paper-error", "공식 성적표의 전국 백분위를 0~100 범위로 입력하세요."); $("official-percentile").focus(); return; }
    }
    const paperFormat = selectedPaperFormat(format);
    const result = analyzer.analyze(readMarks(), paperFormat ? paperFormat.itemCount : format.itemCount, format.id, paperFormat);
    if (!result.valid) { showAlert("paper-error", result.error === "문항별 표시와 영역을 확인하세요." ? "문항별 표시·영역·이유를 확인하세요." : result.error); return; }
    clearAlert("paper-error");
    renderResult(result, lastAutoGradeSummary);
  });
  $("apply-answer-key").addEventListener("click", function () {
    const format = selectedFormat();
    const result = applyPublicAnswerKey(format);
    if (!result) {
      $("answer-key-action-status").textContent = "먼저 답을 하나 이상 입력하고, 선택한 연도·시험형의 공개 정답표가 있는지 확인하세요.";
      return;
    }
    lastAutoGradeSummary = result;
    $("answer-key-action-status").textContent = `LIVE 답안 대조 완료 · 정답 ${result.correctCount} · 오답 ${result.wrongCount} · 미응답 ${result.blankCount}. 아래 ‘결과 보기’를 누르면 영역별 진단이 나옵니다.`;
    clearAlert("paper-error");
    resetReport("답안을 대조했어요");
  });
  $("save-diagnostic").addEventListener("click", function () {
    if (!lastDiagnostic || !localRecords) return;
    const examDate = $("review-exam-date").value;
    if (!examDate) { $("diagnostic-save-status").textContent = "응시 날짜를 입력한 뒤 저장해 주세요."; $("review-exam-date").focus(); return; }
    const format = selectedFormat();
    const record = localRecords.storage.saveCompetitionDiagnostic({
      schemaVersion: "gfield-competition-diagnostic-v1", id: makeHistoryId(), programId: format.id, programTitle: format.title,
      grade: grade, paperLabel: $("review-paper-label").value.trim(), examDate: examDate,
      officialPercentile: format.id === "kangaroo" && $("official-percentile").value !== "" ? Number($("official-percentile").value) : null,
      summary: { itemCount: lastDiagnostic.itemCount, correct: lastDiagnostic.counts.correct, wrong: lastDiagnostic.counts.wrong, blank: lastDiagnostic.counts.blank,
        unmarked: lastDiagnostic.counts.unmarked, attempted: lastDiagnostic.attempted, domainClassified: lastDiagnostic.domainClassified, reasonClassified: lastDiagnostic.reasonClassified },
      domains: lastDiagnostic.domains.map(function (domain) { return { id: domain.id, attempted: domain.attempted, correct: domain.correct, wrong: domain.wrong, blank: domain.blank }; }),
      reasons: lastDiagnostic.reasons.map(function (reason) { return { id: reason.id, count: reason.count }; })
    });
    const amcResultDisclosure = format.id === "kangaroo" && $("official-percentile").value !== ""
      ? "Math Kangaroo 성적표의 학년별 전국 백분위도 함께 저장했어요."
      : lastDiagnostic.complete && ["amc8", "amc10", "amc12"].includes(format.id)
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
