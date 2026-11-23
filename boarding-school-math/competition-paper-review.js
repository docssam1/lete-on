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
  let lastOverviewContext = null;
  let lastAutoGradeSummary = null;
  let lastSavedDiagnosticId = null;
  let savedDiagnosticAnnouncementVersion = 0;
  let diagnosticSaveStatusVersion = 0;
  let historySuccessVersion = 0;
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
  function reviewFormats() {
    const formats = roadmap.competitionOptions(8).filter(function (entry) { return ["amc8", "amc10", "amc12", "aime"].includes(entry.id); });
    const legacy = roadmap.competitionOptions(grade).find(function (entry) { return entry.id === params.get("program") && ["sasmo", "kangaroo"].includes(entry.id); });
    return legacy ? formats.concat(legacy) : formats;
  }
  function selectedFormat() { return reviewFormats().find(function (entry) { return entry.id === programId; }); }
  function selectedPaperFormat(format) {
    if (!format) return null;
    const archive = paperLibrary && paperLibrary.archiveFor(format.id);
    const selectedYear = archive ? Number($("archive-year").value || params.get("year")) : NaN;
    if (archive && Number.isInteger(selectedYear)) return paperLibrary.formatFor(format.id, selectedYear, $("archive-form").value || params.get("form") || "");
    return { title: format.title, itemCount: format.itemCount, durationMinutes: null, scoring: null, rawOnly: false, formatNote: "" };
  }
  function option(value, title) { const node = document.createElement("option"); node.value = value; node.textContent = title; return node; }
  function renderOfficialPaperSources(format) {
    const section = $("official-paper-sources");
    const picker = $("amc-archive-picker");
    if (!paperLibrary || !format) { section.hidden = true; picker.hidden = true; if (window.GFIELDPaperBookReader) window.GFIELDPaperBookReader.selectPaper(null); return; }
    const archive = paperLibrary.archiveFor(format.id);
    picker.hidden = !archive;
    if (archive) {
      const yearSelect = $("archive-year");
      const formSelect = $("archive-form");
      const responsePopulationField = $("archive-response-population-field");
      const responsePopulationSelect = $("archive-response-population");
      yearSelect.replaceChildren();
      archive.years.forEach(function (year) { yearSelect.append(option(String(year), String(year))); });
      const requestedYear = Number(params.get("year"));
      yearSelect.value = archive.years.includes(requestedYear) ? String(requestedYear) : String(archive.years[0]);
      const syncArchivePaperLabel = function () {
        const selectedPaperMeta = paperLibrary.formatFor(format.id, Number(yearSelect.value), formSelect.value);
        const autoLabel = `${yearSelect.value} ${selectedPaperMeta ? selectedPaperMeta.title : format.title}${format.id === "amc8" ? "" : formSelect.value ? ` ${formSelect.value}` : ""}`;
        const paperLabel = $("review-paper-label");
        if (!paperLabel.value.trim() || paperLabel.value === paperLabel.dataset.archiveDefault) paperLabel.value = autoLabel;
        paperLabel.dataset.archiveDefault = autoLabel;
      };
      const syncArchiveActions = function () {
        const year = Number(yearSelect.value);
        const form = formSelect.value;
        const meta = paperLibrary.formatFor(format.id, year, form);
        const label = `${year} ${meta ? meta.title : format.title}${form ? ` ${paperLibrary.formLabel(format.id, year, form)}` : ""}`;
        $("archive-open-link").href = paperLibrary.archiveRoute(format.id, year, form);
        $("archive-open-link").textContent = `${label} · ${meta && meta.sourceStatus === "third-party-reproduction" ? "자료 출처" : "온라인 회차"} ↗`;
        $("archive-print-link").href = paperLibrary.printRoute(format.id, year, form);
        $("archive-print-link").textContent = "원본 파일 열기 ↗";
        if (window.GFIELDPaperBookReader) {
          const canonical = window.GFIELDPaperLearningProfileUI.identityLabel({ programId: format.id, paper: { year: year, form: form } });
          window.GFIELDPaperBookReader.selectPaper({ grade: grade, programId: format.id, year: year, form: form, title: canonical && meta ? canonical.replace(format.title, meta.title) : label });
        }
        $("archive-answer-link").href = paperLibrary.answerRoute(format.id, year, form);
        $("archive-answer-link").textContent = `${label} · 정답표 ↗`;
        $("archive-solutions-link").href = paperLibrary.solutionsRoute(format.id, year, form);
        $("archive-solutions-link").textContent = `${label} · 전문 풀이 ↗`;
      };
      const syncResponsePopulation = function () {
        const selectedForm = formSelect.value || "";
        const reference = window.GFIELDAMC10_12ItemResponseReference;
        const populations = reference && ["amc10", "amc12"].includes(format.id)
          ? reference.populationsFor(format.id, Number(yearSelect.value), selectedForm)
          : [];
        if (["amc10", "amc12"].includes(format.id) && populations.length > 1) {
          responsePopulationSelect.replaceChildren();
          populations.forEach(function (population) {
            const count = Number(population.respondentCount);
            const countLabel = Number.isFinite(count) && count > 0 ? ` · ${count.toLocaleString("ko-KR")}명` : "";
            const label = population.id === "taiwan" ? `대만 응시자 표본${countLabel}` : population.id === "global" ? `세계 응시자 표본${countLabel}` : population.id === "aime-qualifiers" ? `AIME 진출자 표본${countLabel}` : population.label;
            responsePopulationSelect.append(option(population.id, label));
          });
          responsePopulationSelect.value = populations.some(function (population) { return population.id === params.get("population"); }) ? params.get("population") : "global";
          responsePopulationField.hidden = false;
          responsePopulationField.querySelector("small").textContent = "별도 집단의 과거 응답 비율입니다. 학년별 미국 기준이나 현재 규준은 아닙니다.";
          responsePopulationField.childNodes[0].textContent = "응답 집단";
        } else {
          if (format.id === "amc8" && Number(yearSelect.value) === 2009) {
            responsePopulationSelect.replaceChildren(option("korea", "한국 참가자 표본 · 741명"), option("maa-national", "MAA 보고서 Table 8 · 151,367명"));
            responsePopulationField.childNodes[0].textContent = "2009 문항 응답 비교 집단";
            responsePopulationField.querySelector("small").textContent = "MAA Table 8 표본 수는 같은 보고서의 Table 1 수치(150,733명)와 다르게 적혀 있어요.";
          } else {
            responsePopulationSelect.replaceChildren(option("global", "세계 응시자 표본"));
            responsePopulationField.childNodes[0].textContent = "응답 비교 집단";
          }
          responsePopulationField.hidden = !(format.id === "amc8" && Number(yearSelect.value) === 2009);
        }
      };
      const syncArchiveRouteNote = function () {
        const year = Number(yearSelect.value);
        const meta = paperLibrary.formatFor(format.id, year, formSelect.value);
        const archiveNote = $("archive-route-note");
        if (format.id === "amc10" && year === 2016 && formSelect.value === "B") {
          archiveNote.textContent = "정답표 확인: LIVE 인쇄용 답안 PDF의 18번은 B로 잘못 표기되어 있어요. LIVE 공개 정답표와 전문 풀이, MAA 해설 자료는 E가 정답임을 확인합니다. 아래 자동 채점도 E를 기준으로 합니다.";
        } else if (meta && meta.sourceStatus === "third-party-reproduction") {
          archiveNote.textContent = "2026 A형의 공개 시험지·답안·풀이는 Think Academy 자료입니다. MAA/LIVE 공식 색인에 실린 회차가 아니며, GFIELD는 시험 내용을 복사하지 않고 원문 링크와 답안 키만 연결합니다.";
        } else {
          archiveNote.textContent = "시험지를 펼쳐 화면에서 읽거나 인쇄하세요. 답안 입력 후 공개 정답표와 대조하고 해설을 확인할 수 있어요.";
        }
      };
      const renderArchiveRoute = function () {
        const year = Number(yearSelect.value);
        const forms = paperLibrary.formsFor(format.id, year);
        $("archive-form-field").hidden = format.id === "amc8" || forms.length === 1;
        formSelect.replaceChildren();
        forms.forEach(function (form) { formSelect.append(option(form, paperLibrary.formLabel(format.id, year, form))); });
        formSelect.value = forms.includes(params.get("form")) ? params.get("form") : forms[0];
        syncResponsePopulation();
        syncArchiveActions();
        syncArchiveRouteNote();
        syncArchivePaperLabel();
        updateReviewSourceNote(format);
        updateUrl();
      };
      yearSelect.onchange = function () { renderArchiveRoute(); renderMarks(); };
      responsePopulationSelect.onchange = function () {
        const url = new URL(location.href);
        if (responsePopulationField.hidden) url.searchParams.delete("population");
        else url.searchParams.set("population", responsePopulationSelect.value);
        history.replaceState(null, "", url);
        if (!document.querySelector(".review-report").hidden) resetReport("응답 비교 집단을 바꿨어요");
      };
      formSelect.onchange = function () {
        syncResponsePopulation();
        syncArchiveActions();
        syncArchiveRouteNote();
        syncArchivePaperLabel();
        updateUrl();
        renderMarks();
      };
      renderArchiveRoute();
    }
    section.hidden = !archive;
    if (!archive) { if (window.GFIELDPaperBookReader) window.GFIELDPaperBookReader.selectPaper(null); return; }
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
      if (!$("archive-response-population-field").hidden) url.searchParams.set("population", $("archive-response-population").value);
      else url.searchParams.delete("population");
    } else { url.searchParams.delete("year"); url.searchParams.delete("form"); url.searchParams.delete("population"); }
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
    $("item-response-reference").hidden = true;
    setText("item-response-summary", "");
    $("item-response-rows").replaceChildren();
    $("item-response-source").removeAttribute("href");
    $("report-follow-up").hidden = true;
    setText("report-follow-up-copy", "");
    $("report-follow-up-link").removeAttribute("href");
    $("maa-contest-resources").hidden = true;
    setText("maa-contest-resources-title", "");
    setText("maa-contest-resources-description", "");
    setText("maa-resource-index-link", "");
    $("maa-contest-resource-list").replaceChildren();
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
    const formats = reviewFormats();
    if (!formats.some(function (entry) { return entry.id === programId; })) programId = "";
    programSelect.replaceChildren();
    programSelect.append(option("", "대회를 선택해 주세요"));
    formats.forEach(function (entry) { programSelect.append(option(entry.id, entry.id === "aime" ? "AIME" : entry.title)); });
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
      ? "각 문항에 내가 쓴 정수 답(0–999)을 입력하고 ‘정답표 대조’를 누르면 해당 회차의 공개 답안 키로 자동 채점합니다. 빈칸은 미응답으로 처리합니다. 시험지를 펼쳐 풀 때 답안은 이 탭에 임시 저장됩니다."
      : "A–E에서 고른 답을 입력하고 ‘정답표 대조’를 누르면 해당 회차의 공개 답안 키로 자동 채점합니다. 빈칸은 미응답으로 처리하며, 풀이 영역과 오답 이유는 결과 화면에서 직접 조정할 수 있어요.";
    document.querySelector(".review-change-note").hidden = !format;
    $("review-amc8-practice").hidden = !(grade === 6 && programId === "amc8");
    $("review-sasmo-source").hidden = programId !== "sasmo";
    document.querySelector(".review-related").hidden = !format;
    updateReviewSourceNote(format);
    updateUrl();
    renderSavedDiagnosticHistory();
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
              : concept.mappingStatus === "editorial-source-solution-crosswalk"
                ? "공개 풀이 기반 개념 제안 · 교사 검토 필요"
              : "자동 영역 제안 · 교사 검토 필요";
          suggestion.append(document.createTextNode(`개념 ${concept.topicLabel} · ${mappingCopy} · `));
          const sourceLink = document.createElement("a");
          sourceLink.href = concept.sourceUrl;
          sourceLink.target = "_blank";
          sourceLink.rel = "noopener noreferrer";
          sourceLink.textContent = concept.sourceLabel && concept.sourceLabel.includes("LIVE") ? "LIVE 출처" : "분류 출처";
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
    document.dispatchEvent(new Event("gfield:paper-marks-ready"));
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
    return { enteredCount: enteredCount, correctCount: correctCount, wrongCount: wrongCount, blankCount: blankCount, itemCount: rows.length, sourceUrl: formReference.sourceUrl, sourceLabel: formReference.sourceLabel };
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
    const lowerBand = distribution.bands.slice().reverse().find(function (band) {
      return band.id !== "dhr" && Number.isFinite(reference[band.id]);
    });
    const match = reached
      ? `${reached.label} · ${reference[reached.id]} / ${record.maxScore}점 이상`
      : lowerBand
        ? `${lowerBand.label} 미만 · ${reference[lowerBand.id]} / ${record.maxScore}점`
        : "비교 기준 자료 없음";
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
      const identity = window.GFIELDPaperLearningProfileUI.identityLabel(record);
      const title = document.createElement("h3"); title.textContent = `${identity || record.programTitle} · Grade ${record.grade}`;
      const date = document.createElement("time"); date.textContent = `응시 날짜 · ${record.examDate || "날짜 미입력"}`; if (record.examDate) date.dateTime = record.examDate;
      heading.append(title, date);
      const meta = document.createElement("p");
      const completion = record.summary.unmarked ? `일부 입력 ${record.summary.itemCount - record.summary.unmarked}/${record.summary.itemCount} · ` : `전체 입력 ${record.summary.itemCount}/${record.summary.itemCount} · `;
      meta.textContent = `${completion}정답 ${record.summary.correct} · 오답 ${record.summary.wrong} · 미응답 ${record.summary.blank} · 표시 안 함 ${record.summary.unmarked} · 영역 분류 ${record.summary.domainClassified}/${record.summary.itemCount}${record.officialPercentile == null ? "" : ` · 성적표 Grade ${record.grade} 전국 백분위 ${record.officialPercentile}%`}`;
      if (record.paperLabel) {
        const memoLabel = document.createElement("span"); memoLabel.textContent = "메모";
        const memo = document.createElement("span"); memo.textContent = record.paperLabel; memo.dataset.paperMemo = ""; memo.dataset.contentOriginal = "";
        meta.prepend(memoLabel, document.createTextNode(" · "), memo, document.createTextNode(" · "));
      }
      const domainHost = document.createElement("div"); domainHost.className = "saved-diagnostic-entry-domains"; domainHost.dataset.domainCount = String(record.domains.length);
      record.domains.forEach(function (domain) {
        const item = document.createElement("div");
        const label = document.createElement("strong"); label.textContent = domain.name;
        const marked = domain.attempted + domain.blank;
        const value = document.createElement("span"); value.textContent = marked ? `${domain.correct}/${marked}${marked < 3 ? "" : ` · ${Math.round(domain.correct / marked * 100)}%`}` : "—";
        const note = document.createElement("small"); note.textContent = `미응답 포함${domain.blank ? ` · 미응답 ${domain.blank}` : ""}`;
        item.append(label, value, note); domainHost.append(item);
      });
      const reasonSummary = document.createElement("p");
      reasonSummary.textContent = `오답 이유 분류 ${record.summary.reasonClassified}/${record.summary.wrong}${record.reasons.length ? ` · ${record.reasons.map(function (reason) { const label = reasons.find(function (entry) { return entry.id === reason.id; }); return `${label ? label.title : "기타"} ${reason.count}`; }).join(" · ")}` : ""}`;
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "saved-diagnostic-remove"; remove.dataset.removeDiagnostic = record.id; remove.textContent = "이 기록 삭제";
      remove.setAttribute("aria-label", `${record.programTitle} Grade ${record.grade} ${record.examDate || "날짜 미입력"} 복습 요약 삭제`);
      card.append(heading, meta, window.GFIELDPaperLearningProfileUI.card(record, history), domainHost, reasonSummary, remove); host.append(card);
    });
    window.GFIELDPaperLearningProfileUI.accumulated(history, { grade: grade, programId: programId, asOf: localToday() });
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
    if (!scoreHistory.length || !window.confirm(window.GFIELDContentI18n.text("이 화면에 불러온 모든 회차 기록을 비울까요? 저장한 JSON 파일은 그대로 남습니다."))) return;
    scoreHistory = []; renderHistory(); clearHistoryMessages(); historySuccess("화면 기록을 비웠어요."); $("score-history-title").focus();
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
      answerKeyNote.append(document.createTextNode(`${autoGradeSummary.sourceLabel || "LIVE 공개 정답표"}로 ${autoGradeSummary.itemCount}문항을 대조했어요. 정답 ${autoGradeSummary.correctCount} · 오답 ${autoGradeSummary.wrongCount} · 미응답 ${autoGradeSummary.blankCount}${autoGradeSummary.adjusted ? " · 이후 답안 상태를 직접 수정" : ""} · `));
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
    const scoreEstimateDetails = $("score-estimate").querySelector("span");
    if (scoreEstimateDetails) scoreEstimateDetails.textContent = result.scoreEstimate && result.scoreEstimate.adjustmentNote
      ? `${result.scoreEstimate.adjustmentNote} 공식 총점 보정과 선택 답안의 학습용 문항 분석은 구분됩니다.`
      : "선택한 원본 시험지의 답안에 직접 대조해 입력한 참고 집계예요. 공식 성적과 응시 자격은 해당 연도·지역의 MAA 안내를 확인하세요.";
    const scoreAdjustmentSource = $("score-estimate-adjustment-source");
    if (scoreAdjustmentSource) {
      scoreAdjustmentSource.hidden = !result.scoreEstimate || !result.scoreEstimate.adjustmentSourceUrl;
      scoreAdjustmentSource.href = result.scoreEstimate && result.scoreEstimate.adjustmentSourceUrl || "";
      scoreAdjustmentSource.textContent = "무효 문항 안내 ↗";
    }
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
        Number.isFinite(amcCohort.perfectScores) ? `만점 ${amcCohort.perfectScores.toLocaleString("en-US")}명` : "",
        Number.isFinite(amcCohort.aimeCutoff) ? `AIME 진출선 ${amcCohort.aimeCutoff}` : "",
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
      if (amcCohort.scoreReportImageUrl) {
        const reportImageLink = document.createElement("a");
        reportImageLink.href = amcCohort.scoreReportImageUrl;
        reportImageLink.target = "_blank";
        reportImageLink.rel = "noopener noreferrer";
        reportImageLink.textContent = "점수 보고서 이미지 ↗";
        sourceNote.append(reportImageLink);
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
      const fixedThreshold = aimeCutoff.sourceStatus === "maa-official-fixed-registration-threshold";
      const cutoffLabel = fixedThreshold ? "AIME 등록 자격 기준" : "당시 AIME 진출 점수선";
      setText("amc-aime-cutoff-summary", `${paperLabel} · 응시 점수 ${score} / 150점 · ${cutoffLabel} ${aimeCutoff.cutoff}점`);
      const bands = $("amc-aime-cutoff-bands");
      bands.replaceChildren();
      const item = document.createElement("div");
      item.className = "paper-question-band aime-cohort-band" + (difference >= 0 ? " is-reached" : "");
      const label = document.createElement("strong"); label.textContent = cutoffLabel;
      const cutoff = document.createElement("span"); cutoff.textContent = `${aimeCutoff.cutoff} / 150`;
      const comparison = document.createElement("small"); comparison.textContent = difference > 0 ? `기준보다 ${difference}점 위` : difference === 0 ? "기준과 같음" : `기준까지 ${Math.abs(difference)}점`;
      item.append(label, cutoff, comparison); bands.append(item);
      setText("amc-aime-cutoff-note-copy", fixedThreshold
        ? "MAA가 2026–27 시즌에 공지한 고정 기준입니다. 기준 이상이면 AIME 등록 자격이 주어지며, 등록·응시 가능 여부는 연령과 지역 등 공식 규정을 확인하세요."
        : "선택한 연도·시험형에 발표된 점수선과 입력 점수를 나란히 봅니다. 당시 기준과의 비교이며 공식 초대·자격 판정은 아닙니다. 2021년은 봄·가을 시험을 구분합니다.");
      $("amc-aime-cutoff-source").href = aimeCutoff.sourceUrl;
      $("amc-aime-cutoff-source").textContent = fixedThreshold ? "MAA 2027 AIME 공식 기준 ↗" : aimeCutoff.year === 2025 ? "MAA 공식 발표와 대조한 점수선 ↗" : "연도별 AIME 점수선 자료 ↗";
    }
    const historicalGradeReference = window.GFIELDAMCHistoricalGradeReference;
    const gradePopulationId = ["amc10", "amc12"].includes(selectedFormat().id) && !$("archive-response-population-field").hidden && $("archive-response-population").value !== "aime-qualifiers" ? $("archive-response-population").value : undefined;
    const gradeReferenceSection = $("amc-grade-reference");
    const gradeReference = ["amc8", "amc10", "amc12"].includes(selectedFormat().id) && result.complete && result.scoreEstimate && historicalGradeReference
      ? historicalGradeReference.referenceFor(selectedFormat().id, selectedYear, selectedForm, grade, gradePopulationId)
      : null;
    const gradeComparison = gradeReference && historicalGradeReference && typeof historicalGradeReference.comparisonFor === "function"
      ? historicalGradeReference.comparisonFor(selectedFormat().id, selectedYear, selectedForm, grade, gradePopulationId)
      : null;
    gradeReferenceSection.hidden = !gradeReference;
    const gradeComparisonWrap = $("amc-grade-comparison-wrap");
    const gradeComparisonBody = $("amc-grade-comparison-body");
    gradeComparisonWrap.hidden = !gradeComparison || gradeComparison.rows.length === 0;
    gradeComparisonBody.replaceChildren();
    if (gradeReference) {
      const formatLabel = selectedFormat().id === "amc8" ? "AMC 8" : `${selectedFormat().title} ${selectedForm}`;
      const isUsForumTranscription = gradeReference.sourceStatus === "secondary-forum-transcription-of-MAA-us-grade-report";
      const globalReport = gradeReference.sourceStatus === "secondary-international-administrator-report";
      const webIndexedAdministratorReport = gradeReference.sourceStatus === "secondary-international-administrator-report-web-indexed-text";
      const regionalAdministratorReport = gradeReference.sourceStatus === "secondary-international-administrator-report-printed-table";
      const reproducedMaaImage = gradeReference.sourceStatus === "secondary-reproduction-of-MAA-grade-report-image-apple-vision-and-visual-check";
      const reportPopulation = regionalAdministratorReport ? "대만 참가자" : (globalReport || webIndexedAdministratorReport) && gradeReference.population.indexOf("United States and Canada") === 0 ? "미국·캐나다 참가자" : (globalReport || webIndexedAdministratorReport) ? "세계 참가자" : "";
      const maaImageScope = reproducedMaaImage && gradeReference.population.indexOf("MAA report Overall") === 0 ? " · MAA 보고서 Location: Overall" : "";
      setText("amc-grade-reference-summary", `Grade ${grade} · ${selectedYear} ${formatLabel} · 기록된 학년 참가자 ${gradeReference.participants.toLocaleString("en-US")}명${isUsForumTranscription ? " · 미국 위치 기준" : reportPopulation ? ` · ${reportPopulation} 보고서` : maaImageScope}${gradeReference.note ? ` · ${gradeReference.note}` : ""}`);
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
      if (gradeComparison) {
        gradeComparison.rows.forEach(function (datum) {
          const row = document.createElement("tr");
          if (datum.selected) row.className = "is-current";
          const gradeCell = document.createElement("th"); gradeCell.scope = "row";
          gradeCell.textContent = datum.selected ? `${datum.gradeLabel} · 선택 그룹` : datum.gradeLabel;
          const meanCell = document.createElement("td"); meanCell.textContent = `${datum.mean.toFixed(2)} / ${datum.max}`;
          const countCell = document.createElement("td"); countCell.textContent = `${datum.participants.toLocaleString("en-US")}명`;
          row.append(gradeCell, meanCell, countCell);
          gradeComparisonBody.append(row);
        });
      }
      const difference = result.scoreEstimate.points - gradeReference.mean;
      const differenceLabel = difference === 0 ? "평균과 같은 점수" : `${Math.abs(difference).toFixed(2)}점 ${difference > 0 ? "위" : "아래"}`;
      setText("amc-grade-reference-delta", `해당 회차 평균보다 ${differenceLabel}`);
      const gradeReferenceSource = $("amc-grade-reference-source");
      gradeReferenceSource.href = gradeReference.sourceUrl;
      const secondarySource = gradeReference.sourceStatus === "secondary-school-publication-reporting-national-grade-statistic";
      const forumTranscription = gradeReference.sourceStatus === "secondary-forum-transcription-of-MAA-us-grade-report";
      gradeReferenceSource.textContent = secondarySource ? "학교 공개 통계 원문 ↗" : forumTranscription ? "MAA 표 전사 원문 ↗" : globalReport ? "99CEF 통계 보고서 ↗" : (webIndexedAdministratorReport || regionalAdministratorReport) ? "GEMT 보고서 원문 ↗" : reproducedMaaImage ? "MAA 통계 이미지 재게시 ↗" : "원자료 보고서 ↗";
      setText("amc-grade-reference-source-note", secondarySource
        ? "학교가 공개한 전국 학년별 통계의 재인용입니다. MAA 원본 보고서 파일을 확보하지 못했습니다. 이 표본 평균은 현재 기준점·백분위·능력 등급이 아닙니다. "
          : globalReport
          ? gradeReference.population.indexOf("United States and Canada") === 0
            ? "99CEF 분석 보고서의 미국·캐나다 참가자 집계입니다. 세계 참가자 통계와 서로 다른 모집단이므로 연도별 추세로 직접 비교하지 않습니다. 해당 회차·기록 학년의 과거 평균일 뿐 백분위·현재 규준·능력 등급이 아닙니다. "
            : "99CEF 분석 보고서의 세계 참가자 집계이며 미국 단독 모집단은 아닙니다. 해당 연도·시험형·기록 학년의 과거 평균만 비교합니다. 백분위·현재 규준·능력 등급이 아닙니다. "
          : forumTranscription
          ? "포럼에 전사된 MAA 학년 평균표입니다. 표의 Location은 United States이며 MAA 원본 보고서는 회수하지 못했습니다. 미국 응시집단의 당시 평균 비교이며 전국 전체·백분위·현재 능력 등급이 아닙니다. "
          : reproducedMaaImage
          ? "재게시된 MAA 학년·성별 평균표 이미지에서 전사한 과거 통계입니다. Location 표기와 지리적 모집단은 원 이미지에 명시된 범위만 적용합니다. 해당 연도·기록 학년의 평균이며 백분위·현재 규준·능력 등급이 아닙니다. "
          : webIndexedAdministratorReport
          ? "GEMT 연례 분석 보고서의 웹 검색 색인 텍스트에서 옮긴 세계 참가자 통계입니다. PDF 페이지 이미지를 직접 대조하지 못했으며 원문 색인 전사 수준으로 표시합니다. 같은 연도·시험형·기록 학년의 과거 평균이며 백분위·현재 규준·능력 등급이 아닙니다. "
          : regionalAdministratorReport
          ? "GEMT 보고서에 직접 실린 대만 지역 참가자 통계입니다. Grade 7 표본은 19명으로 작습니다. 세계 또는 미국 학년 기준과 섞지 않으며, 백분위·현재 규준·능력 등급이 아닙니다. "
          : "같은 연도·시험형·기록 학년이 확인되는 과거 응시 집단 평균입니다. 현재 기준점이나 능력 등급이 아니며, 다른 연도·시험형으로 비교하지 않습니다. 표본과 범위는 연결된 출처 기준입니다. ");
    }
    const gradePercentileReference = window.GFIELDAMCGradePercentileReference;
    const gradePercentile = gradePercentileReference && ["amc10", "amc12"].includes(selectedFormat().id) && result.complete && result.scoreEstimate
      ? gradePercentileReference.referenceFor(selectedFormat().id, selectedYear, selectedForm, grade)
      : null;
    const gradePercentileSection = $("amc-grade-percentile-reference");
    gradePercentileSection.hidden = !gradePercentile;
    const gradePercentileRows = $("amc-grade-percentile-rows");
    gradePercentileRows.replaceChildren();
    if (gradePercentile) {
      const learnerScore = result.scoreEstimate.points;
      const scoreDisplay = Number.isInteger(learnerScore) ? String(learnerScore) : learnerScore.toFixed(1);
      const paperForm = gradePercentile.form;
      const administrationLabel = gradePercentile.administration === "fall" ? "가을 " : "";
      setText("amc-grade-percentile-title", `${gradePercentile.year} ${administrationLabel}${selectedFormat().title} · 학년별 점수 경계`);
      setText("amc-grade-percentile-summary", `Grade ${grade} · ${gradePercentile.year} ${administrationLabel}${selectedFormat().title} ${paperForm} · 차트 학년 표본 n=${gradePercentile.participantCount.toLocaleString("en-US")} · 입력 점수 ${scoreDisplay}/150점`);
      gradePercentile.rows.forEach(function (benchmark) {
        const row = document.createElement("tr");
        const band = document.createElement("th"); band.scope = "row"; band.textContent = `${benchmark.percentile}백분위 경계`;
        const score = document.createElement("td"); score.textContent = `${Number.isInteger(benchmark.scoreThreshold) ? benchmark.scoreThreshold : benchmark.scoreThreshold.toFixed(1)}점`;
        const percentile = document.createElement("td"); percentile.textContent = `${benchmark.reportedCumulativePercent.toFixed(2)}%`;
        row.append(band, score, percentile); gradePercentileRows.append(row);
      });
      const crossed = gradePercentile.rows.filter(function (benchmark) { return learnerScore >= benchmark.scoreThreshold; });
      const highest = crossed[crossed.length - 1];
      const next = gradePercentile.rows.find(function (benchmark) { return learnerScore < benchmark.scoreThreshold; });
      let position = highest ? `입력 점수는 ${highest.percentile}백분위 경계(${highest.scoreThreshold}점)를 넘었어요.` : "입력 점수는 표의 50백분위 경계 아래에 있어요.";
      if (gradePercentile.participantCount < 100) position += ` 학년 표본이 ${gradePercentile.participantCount}명으로 적어 백분위 경계는 거친 참고치예요.`;
      if (highest && next) position += ` 다음 경계는 ${next.percentile}백분위 · ${next.scoreThreshold}점입니다.`;
      else if (highest && !next) position += " 표에 표시된 가장 높은 구간까지 도달했어요.";
      setText("amc-grade-percentile-position", position);
      $("amc-grade-percentile-source").href = gradePercentile.sourceUrl;
    }
    const overallCohortReference = window.GFIELDAMC8OverallCohortReference;
    const overallCohortSection = $("amc8-overall-cohort-reference");
    const overallCohort = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && overallCohortReference
      ? overallCohortReference.referenceFor(selectedYear, result.scoreEstimate.points)
      : null;
    overallCohortSection.hidden = !overallCohort;
    if (overallCohort) {
      const populationLabel = overallCohort.population === "Global" ? "세계 응시자" : overallCohort.population === "United States" ? "미국 응시자" : overallCohort.population === "MAA Overall reported-grade cohort" ? "MAA 전체 보고서 표본" : "미국·캐나다 응시자";
      const cohortFacts = [];
      if (overallCohort.participants !== null) cohortFacts.push(`${overallCohort.participants.toLocaleString("en-US")}명`);
      cohortFacts.push(`평균 ${overallCohort.meanScore.toFixed(2)}점`);
      if (overallCohort.perfectScores !== null) cohortFacts.push(`만점 ${overallCohort.perfectScores.toLocaleString("en-US")}명`);
      if (overallCohort.scoreAtLeast20 !== null) cohortFacts.push(`20점 이상 ${overallCohort.scoreAtLeast20.toLocaleString("en-US")}명`);
      const cohortDetails = `${populationLabel} ${cohortFacts.join(" · ")}`;
      setText("amc8-overall-cohort-summary", `${overallCohort.year} AMC 8 · 입력 점수 ${overallCohort.learnerScore}/25점 · ${cohortDetails}`);
      const difference = overallCohort.differenceFromMean;
      const meanComparison = difference === 0 ? "전체 응시자 평균과 같은 점수" : `전체 응시자 평균보다 ${Math.abs(difference).toFixed(2)}점 ${difference > 0 ? "높아요" : "낮아요"}`;
      const scorePosition = overallCohort.strictlyLowerShare === null ? "" : ` · 당시 ${overallCohort.population === "Global" ? "세계" : "해당 모집단"} 응시자 중 이 점수보다 낮은 점수 ${overallCohort.strictlyLowerShare.toFixed(2)}% (동점 제외, 보고서 빈도로 계산)`;
      setText("amc8-overall-cohort-result", `${meanComparison}${scorePosition}`);
      if (overallCohort.year >= 2002 && overallCohort.year <= 2004) {
        setText("amc8-overall-cohort-note", `${overallCohort.year}년 자료는 MAA 2006 연례 보고서 Table 1의 전체 응시 인원·평균·만점자 수입니다. 해당 표에는 전체 점수별 빈도표가 없어 백분위나 점수 위치는 계산하지 않습니다. MAA는 이 시험에 확립된 규준이 없으며 학교 수업·배치시험과 비교할 수 없다고 안내합니다. 따라서 이 값은 같은 해 전체 응시 집단 평균과의 참고 비교이며 현재 능력 등급이나 학년 배치가 아닙니다. `);
      } else if (overallCohort.year === 2005) {
        setText("amc8-overall-cohort-note", `2005년은 MAA 2006 연례 보고서 Table 6의 점수별 빈도표를 연결했습니다. 빈도 합계는 Table 1 참가자 수 ${overallCohort.participants.toLocaleString("en-US")}명과 일치합니다. 다만 이 빈도로 계산한 평균은 9.845점이고, Table 1에 적힌 평균은 9.835점으로 약 0.01점 차이가 있습니다. 그래서 점수 위치는 표의 빈도 합계 기준으로, 평균 비교는 보고서 기재 평균 기준으로 따로 표시합니다. 역사적 전체 응시자 비교이며 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. `);
      } else if (overallCohort.year === 2006) {
        setText("amc8-overall-cohort-note", "2006년 MAA 2006 연례 보고서 Table 4의 전체 점수 빈도를 사용합니다. 보고서는 0점을 일부 문항을 시도한 23명과 미시도 299명으로 구분했으며, 점수 위치를 계산할 때만 합쳐 총 147,210명으로 대조합니다. 보고 평균 10.14점, 20점 이상 4,428명, 만점 289명과 표본 합계가 보고서 요약과 일치합니다. 점수 위치는 과거 전체 응시자 분포에서 계산한 참고값이며 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. ");
      } else if (overallCohort.year === 2007) {
        setText("amc8-overall-cohort-note", "2007년은 MAA 2008 연례 보고서 Table 8의 점수별 빈도표를 사용합니다. 26개 점수 빈도의 합과 가중평균이 Table 1의 참가자 수·평균에 맞습니다. 전체 응시 코호트의 과거 점수 위치이며 공식 percentile·학년 순위·현재 규준·실력 등급은 아닙니다. ");
      } else if (overallCohort.year === 2008) {
        setText("amc8-overall-cohort-note", "2008년 MAA 보고서 Table 8에는 148,478명의 점수 빈도가 있고, 표 아래에는 아무 문제도 시도하지 않은 참가자 253명이 따로 표시됩니다. 이 253명을 0점에 포함하면 분모 148,731명과 가중평균 11.45점이 보고서 Table 1과 맞습니다. 이 0점 포함은 표에 적힌 미응시 인원을 반영한 계산입니다. 과거 전체 응시 코호트 위치이며 공식 percentile·학년 순위·현재 규준·실력 등급은 아닙니다. ");
      } else if (overallCohort.year === 2009) {
        setText("amc8-overall-cohort-note", "2009년 MAA 보고서의 집계 수치가 표마다 다릅니다. Table 1은 답안지 150,733장·평균 10.28점을, 4년 통계 요약 블록은 같은 인원·평균 10.25점을 적었습니다. 별도의 점수 빈도표와 문항 응답표는 151,367명이며, 빈도표는 0점 중 일부 문항을 푼 27명과 미시도 212명을 구분합니다. 아래 점수 위치는 그 빈도표 기준(가중평균 10.2769점, 20점 이상 3,452명)이고, 평균 비교는 Table 1의 10.28점 기준입니다. 서로 다른 표본 표기를 한 수치로 합치지 않았으며 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. ");
      } else if (overallCohort.year === 2010) {
        setText("amc8-overall-cohort-note", "2010년 99CEF 보고서 Table 3의 세계 점수 빈도 26개를 사용합니다. 빈도 합계 153,211명과 가중평균 9.9827점(보고 평균 9.98점), 만점 499명은 요약표와 맞습니다. 다만 점수 20–25 빈도를 합하면 5,840명인데, 같은 보고서의 누적표와 요약은 5,849명이라고 적습니다. 점수 위치는 인쇄된 점수별 빈도 합으로 계산하고, 20점 이상 인원은 요약표 수치를 유지해 차이를 표시합니다. 공식 percentile·학년 순위·현재 규준·실력 등급은 아닙니다. ");
      } else if (overallCohort.year === 2011) {
        setText("amc8-overall-cohort-note", "2011년 99CEF 연례 분석 보고서의 세계 점수 분포를 사용합니다. 0–25점 빈도 합계 152,745명, 가중평균 10.7565점(보고 평균 10.76점), 20점 이상 6,709명, 만점 284명이 보고서 요약과 맞습니다. 대만 참가자는 별도 모집단으로 유지합니다. 점수 위치는 당시 세계 응시자 분포에서 계산한 역사적 참고이며 공식 percentile·학년 순위·현재 규준·실력 등급은 아닙니다. ");
      } else if (overallCohort.year === 2012) {
        setText("amc8-overall-cohort-note", "2012년은 99CEF의 당시 상세 보고서(세계 151,117명, 평균 10.64점)와 점수별 빈도를 사용합니다. 99CEF의 2019년 회고표에는 150,360명·평균 10.66점이 기재되어 있어 이 보고서와 수치가 다릅니다. 서로 섞거나 조정하지 않고, 이 비교는 연결된 2012년 보고서 값 그대로 표시합니다. 점수보다 낮은 응시자 비율은 표의 점수 빈도로 계산한 역사적 위치이며, 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. ");
      } else if (overallCohort.year === 2013) {
        setText("amc8-overall-cohort-note", "2013년은 99CEF 당시 상세 보고서의 Global 점수별 빈도(n=149,709)와 평균 10.70점을 사용합니다. 점수보다 낮은 응시자 비율은 동점을 제외해 해당 빈도표에서 계산한 역사적 위치이며, 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. 대만 코호트는 별도 기록으로 보존합니다. ");
      } else if (overallCohort.year === 2014) {
        setText("amc8-overall-cohort-note", `2014년 보고서의 점수별 빈도 합계는 ${overallCohort.distributionParticipants.toLocaleString("en-US")}명으로, 같은 보고서의 전체 참가자 수 ${overallCohort.participants.toLocaleString("en-US")}명보다 560명 적습니다. 빈도표 가중평균은 11.46점, 보고서 요약 평균은 11.44점입니다. 점수보다 낮은 비율은 빈도표의 인원 합계를 분모로 계산했으며, 전체 평균·만점·20점 이상 통계는 보고서 요약 값을 그대로 따로 표시합니다. 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. 대만 코호트는 별도 기록으로 보존합니다. `);
      } else if (overallCohort.year === 2015) {
        setText("amc8-overall-cohort-note", "2015년은 99CEF 연례 보고서의 Global 점수 빈도표(n=149,844)를 사용합니다. 점수별 인원 합은 전체 참가자 수와 일치하며, 점수보다 낮은 비율은 동점을 제외해 직접 계산한 역사적 위치입니다. 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. 대만 코호트는 별도 기록으로 보존합니다. ");
      } else if (overallCohort.year === 2016) {
        setText("amc8-overall-cohort-note", "2016년 99CEF 회고표는 미국·캐나다 108,227명, 평균 9.36으로 기록하고 MAA Michigan 뉴스레터는 108,295명, 평균 9.36으로 기록합니다. 반면 Ivy League Education Center의 2016년 결과 글은 미국 196,019명·평균 9.35를 보고합니다. 집계 범위가 확인되지 않아 이 화면은 연결된 99CEF 값을 출처별 참고치로 보여 주며, 공식 전국 순위나 학년 규준으로 해석하지 않습니다. 정확한 0–25점 빈도와 전국 Grade 7 평균은 확인되지 않았습니다. ");
      } else if (overallCohort.year === 2017) {
        setText("amc8-overall-cohort-note", "2017년은 99CEF 보고서의 美加(Global North America) 점수 빈도표(n=81,386)를 연결했습니다. 분포표의 가중평균은 9.064점(반올림 9.06)이며, 같은 보고서 요약에는 9.05점으로 적혀 있습니다. 둘을 합치지 않고 평균은 요약값, 점수 위치는 원빈도표로 계산합니다. 이 비율은 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. 대만 응시자는 별도 코호트입니다. ");
      } else if (overallCohort.year === 2018) {
        setText("amc8-overall-cohort-note", "2018년은 99CEF 보고서 본문의 美加(Global North America) 점수 빈도표를 사용합니다. PDF 파일의 제목 메타데이터는 2009로 잘못 표시되지만, 본문은 2018 34회 대회로 표기하고 인원 합계도 98,389명으로 보고서 요약과 일치합니다. 이 자료는 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. 대만 응시자는 별도 코호트입니다. ");
      } else if (overallCohort.year === 2019) {
        setText("amc8-overall-cohort-note", `2019년 MAA 점수표의 보고 학년 그룹(5학년 이하, 6–8학년, 미기재)을 합한 분포는 ${overallCohort.distributionParticipants.toLocaleString("en-US")}명입니다. 99CEF 회고 요약의 미국·캐나다 참가자 수 ${overallCohort.participants.toLocaleString("en-US")}명과 14명 차이가 나므로 분포 비율은 점수표 합계를 분모로 계산합니다. 원본 MAA 표 이미지는 제3자 게시물에서 확인했습니다. 공식 percentile·학년 순위·현재 규준·실력 등급이 아닙니다. `);
      } else if (overallCohort.year === 2022) {
        setText("amc8-overall-cohort-note", "2022 MAA 전체(Overall) 보고서 이미지의 학년별 점수 빈도를 합산했습니다. 다섯 학년 그룹의 점수별 인원 합은 보고서 표의 All 열과 일치하며, 표본의 지역 범위는 이미지에서 확인되지 않습니다. 이 점수 위치는 공식 percentile·현재 규준·실력 등급이 아니며, Grade 7 순위로 해석하지 않습니다. 원 이미지는 2차 게시본입니다. ");
      }
      $("amc8-overall-cohort-source").href = overallCohort.sourceUrl;
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
    const koreaGradeMeanReference = window.GFIELDAMC8KoreaGradeMeanReference;
    const koreaGradeMeanSection = $("amc8-korea-grade-mean-reference");
    const koreaGradeMean = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && koreaGradeMeanReference
      ? koreaGradeMeanReference.referenceFor(selectedYear, grade, result.scoreEstimate.points)
      : null;
    koreaGradeMeanSection.hidden = !koreaGradeMean;
    if (koreaGradeMean) {
      setText("amc8-korea-grade-mean-summary", `${koreaGradeMean.year} AMC 8 · 한국 보고 응시집단 · Grade ${grade} · 학년 평균 ${koreaGradeMean.mean.toFixed(2)}점 · 학년 표본 ${koreaGradeMean.participants.toLocaleString("en-US")}명`);
      const difference = koreaGradeMean.differenceFromMean;
      setText("amc8-korea-grade-mean-result", difference === 0 ? "한국 해당 학년 평균과 같은 점수" : `입력 점수 ${difference > 0 ? "+" : "−"}${Math.abs(difference).toFixed(2)}점 · 한국 해당 학년 평균보다 ${difference > 0 ? "높아요" : "낮아요"}`);
      setText("amc8-korea-grade-mean-note", `${koreaGradeMean.year === 2010 ? "Internet Archive에 보존된 MAA 한국 결과 원문" : "한국 응시집단의 과거 결과표"} 값입니다. 보고된 전체 ${koreaGradeMean.total.toLocaleString("en-US")}명 중 학년 표에 ${koreaGradeMean.gradeListed.toLocaleString("en-US")}명이 기재되어 ${koreaGradeMean.unlistedGradeCount}명은 학년 집계에 포함되지 않았습니다. 현재 규준이나 다른 지역 응시자 비교가 아닙니다.`);
      $("amc8-korea-grade-mean-source").href = koreaGradeMean.sourceUrl;
    }
    const globalGradeScoreReference = window.GFIELDAMC8GlobalGradeScoreReference;
    const globalGradeScoreSection = $("amc8-global-grade-score-reference");
    const globalGradeScore = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && globalGradeScoreReference
      ? globalGradeScoreReference.referenceFor(selectedYear, grade, result.scoreEstimate.points)
      : null;
    const globalGradeComparison = selectedFormat().id === "amc8" && result.complete && result.scoreEstimate && globalGradeScoreReference
      ? globalGradeScoreReference.comparisonFor(selectedYear, grade, result.scoreEstimate.points)
      : null;
    globalGradeScoreSection.hidden = !globalGradeScore;
    const globalGradeComparisonWrap = $("amc8-global-grade-comparison-wrap");
    const globalGradeComparisonBody = $("amc8-global-grade-comparison-body");
    globalGradeComparisonWrap.hidden = !globalGradeComparison;
    globalGradeComparisonBody.replaceChildren();
    if (globalGradeScore) {
      setText("amc8-global-grade-score-summary", `${globalGradeScore.year} AMC 8 · ${globalGradeScore.gradeLabel} · ${globalGradeScore.score}/25점 · 해당 점수 ${globalGradeScore.participantsAtScore.toLocaleString("en-US")}명 · 학년 표본 ${globalGradeScore.gradeParticipants.toLocaleString("en-US")}명`);
      setText("amc8-global-grade-score-value", `점수보다 낮은 응시자 ${globalGradeScore.strictlyLowerShare.toFixed(2)}% · ${globalGradeScore.strictlyLowerCount.toLocaleString("en-US")}/${globalGradeScore.gradeParticipants.toLocaleString("en-US")}명`);
      const globalScoreNote = {
        2006: "2006 MAA AMC 8 보고서 Table 5의 학년별 점수 빈도입니다. 4–5학년은 원자료의 묶음이며, 국제 학교 참가자도 보고서 모집단에 포함됩니다. 원문은 제3자 보관 사본에서 확인했고 0점의 시도/미시도 구간은 합산했습니다.",
        2007: "2007 MAA 연례 보고서 Table 7의 기록 학년별 점수 분포입니다. 4–5학년은 원자료의 묶음입니다. MAA 원본 보고서의 웹 보관 사본에서 전사했으며 현재 규준이 아닙니다.",
        2008: "2008 MAA 연례 보고서 Table 7의 기록 학년별 점수 분포입니다. 4–5학년은 원자료의 묶음입니다. MAA 원본 보고서의 웹 보관 사본에서 전사했으며 현재 규준이 아닙니다.",
        2009: "2009년 MAA 연례 보고서에 제시된 전체 응시학교의 기록 학년별 점수 분포입니다. 4–5학년은 원자료의 묶음입니다.",
        2019: "2019 MAA Overall 성적 보고서 이미지의 학년별 점수 빈도입니다. Grade 5 이하는 원자료에서 한 그룹으로 묶인 표본이며, Grade 6–8은 각각 따로 보고됐습니다. 학년 미기록 표본은 학년 비교에서 제외했으며, 그룹별 표본 수와 가중 평균을 보고서 요약과 대조했습니다.",
        2022: "2022 MAA Overall 점수×학년 보고서 이미지의 전사 자료입니다. Grade 5 이하는 원자료의 묶음이고 Grade 6–8은 각각 따로 보고됐습니다. 학년 미기재 표본은 비교에서 제외했습니다. 그룹별 합계와 점수 0–25의 전체 빈도 합을 이미지와 대조했고, 학년 평균은 별도 MAA Overall 평균표와 소수 둘째 자리까지 일치하는지 확인했습니다. 이미지는 Think Matrix 재게시본입니다."
      };
      setText("amc8-global-grade-score-note", globalScoreNote[globalGradeScore.year] || "");
      $("amc8-global-grade-score-source").href = globalGradeScore.sourceUrl;
      $("amc8-global-grade-report-source").href = globalGradeScore.reportUrl;
    }
    if (globalGradeComparison) {
      globalGradeComparison.rows.forEach(function (datum) {
        const row = document.createElement("tr");
        if (datum.selected) row.className = "is-current";
        const gradeCell = document.createElement("th"); gradeCell.scope = "row";
        gradeCell.textContent = datum.selected ? `${datum.gradeLabel} · 선택 그룹` : datum.gradeLabel;
        const shareCell = document.createElement("td");
        shareCell.textContent = `${datum.strictlyLowerShare.toFixed(2)}% · ${datum.strictlyLowerCount.toLocaleString("en-US")}명`;
        const countCell = document.createElement("td"); countCell.textContent = `${datum.gradeParticipants.toLocaleString("en-US")}명`;
        row.append(gradeCell, shareCell, countCell);
        globalGradeComparisonBody.append(row);
      });
    }
    const gradeComparisonUnavailable = $("amc-grade-comparison-unavailable");
    const hasGradeComparisonReference = Boolean(gradeReference || koreaPercentile || koreaGradeMean || globalGradeScore);
    gradeComparisonUnavailable.hidden = !(result.complete && result.scoreEstimate && ["amc8", "amc10", "amc12"].includes(selectedFormat().id) && !hasGradeComparisonReference);
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
      const aimeGradeSource = $("aime-historical-grade-source");
      aimeGradeSource.href = aimeGradeResult.sourceUrl;
      aimeGradeSource.textContent = `MAA 작성 ${aimeGradeResult.year} 연례 보고서 · AIME ${aimeGradeResult.form} 학년별 분포 표 ↗`;
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
    const amc10And12ResponseReference = window.GFIELDAMC10_12ItemResponseReference;
    const itemResponseSection = $("item-response-reference");
    const itemResponseProgram = selectedFormat().id;
    const itemResponseForm = $("archive-form").value || params.get("form") || "";
    const cohortItemResponses = result.complete && ["amc10", "amc12"].includes(itemResponseProgram) && amc10And12ResponseReference
      ? result.reviewItems.map(function (reviewItem) {
        const populationId = $("archive-response-population-field").hidden ? "global" : $("archive-response-population").value;
        return { reviewItem: reviewItem, reference: amc10And12ResponseReference.responseFor(itemResponseProgram, selectedYear, itemResponseForm, reviewItem.number, reviewItem.answer, populationId) };
      }).filter(function (item) { return Boolean(item.reference); })
      : [];
    itemResponseSection.hidden = cohortItemResponses.length === 0;
    if (cohortItemResponses.length) {
      const cohort = cohortItemResponses[0].reference;
      const responsePopulationLabel = cohort.population.includes("AIME qualifier") ? `AIME 진출자 표본${cohort.respondentCount ? ` · ${cohort.respondentCount.toLocaleString("ko-KR")}명` : ""}` : cohort.population.toLowerCase().includes("all official") ? `MAA 공식 응시자 표본${cohort.respondentCount ? ` · ${cohort.respondentCount.toLocaleString("ko-KR")}명` : ""}` : cohort.population.includes("Taiwan") ? `대만 응시자 표본${cohort.respondentCount ? ` · ${cohort.respondentCount.toLocaleString("ko-KR")}명` : ""}` : cohort.population.includes("MAA U.S.") ? `MAA 미국 참가자 표본${cohort.respondentCount ? ` · ${cohort.respondentCount.toLocaleString("ko-KR")}명` : ""}` : `세계 응시자 표본${cohort.respondentCount ? ` · ${cohort.respondentCount.toLocaleString("ko-KR")}명` : ""}`;
      setText("item-response-title", cohort.population.includes("AIME qualifier") ? "AIME 진출자 표본의 보기 선택 분포" : "같은 회차 응시자의 보기 선택 분포");
      const cohortSummaryWarning = cohort.sourceStatus.includes("Source reconciliation warning")
        ? " · 원본 평균 불일치: 문항 응답 참고용"
        : "";
      const inferredOmittedNotes = cohortItemResponses.filter(function ({ reference }) { return reference.omittedPercentInferred; }).map(function ({ reference }) {
        return `Q${reference.question} 미응답률 ${reference.omittedPercent.toFixed(2)}%는 원문 인쇄값 ${reference.sourcePrintedOmittedPercent.toFixed(2)}%가 응답률 합계와 맞지 않아 나머지 비율에서 계산한 값입니다.`;
      });
      const inferredOmittedWarning = inferredOmittedNotes.length ? ` ${inferredOmittedNotes.join(" ")}` : "";
      setText("item-response-summary", `${selectedYear} AMC ${itemResponseProgram === "amc10" ? "10" : "12"}${itemResponseForm} · ${responsePopulationLabel} · 오답·미응답 문항의 보기 선택을 나란히 표시합니다.${cohortSummaryWarning}${inferredOmittedWarning}`);
      setText("item-response-scope-copy", cohort.population.includes("AIME qualifier")
        ? "MAA High School Summary의 AIME 진출자 응답표입니다. 전체 응시자 분포가 아니며, 선발된 고득점 집단의 응답 참고 자료입니다. 학생 개인의 풀이 원인이나 AIME 진출 가능성을 판정하지 않습니다. "
        : "선택한 집단의 공개 응답 분포입니다. 표본의 범위는 원자료 표기를 따릅니다. 보기 선택만으로 개인의 풀이 원인이나 개념 숙달을 판정하지 않습니다. ");
      const rows = $("item-response-rows");
      rows.replaceChildren();
      cohortItemResponses.forEach(function ({ reviewItem, reference }) {
        const row = document.createElement("tr");
        const addCell = function (value) { const cell = document.createElement("td"); cell.textContent = value; row.append(cell); };
        addCell(String(reviewItem.number));
        addCell(reviewItem.status === "blank" ? "미응답" : reviewItem.answer);
        addCell(reviewItem.status === "blank" || !reviewItem.answer ? "—" : `${reviewItem.answer} · ${reference.selectedResponsePercent.toFixed(1)}%`);
        addCell(`${reference.mostCommonDistractor.answer} · ${reference.mostCommonDistractor.percent.toFixed(1)}%`);
        addCell(`${reference.correctAnswer} · ${reference.correctResponsePercent.toFixed(1)}%`);
        rows.append(row);
      });
      $("item-response-source").href = cohort.sourceUrl;
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
        const populationId = selectedYear === 2009 && $("archive-response-population").value === "maa-national" ? "maa-national" : undefined;
        return itemResponseReference.responseFor(selectedYear, question, answer, grade, populationId);
      }
      if (["amc10", "amc12"].includes(selectedFormat().id) && amc10And12ItemResponseReference) {
        const populationId = $("archive-response-population-field").hidden ? "global" : $("archive-response-population").value;
        return amc10And12ItemResponseReference.responseFor(selectedFormat().id, selectedYear, $("archive-form").value || params.get("form") || "", question, answer, populationId);
      }
      return null;
    };
    const cohortForYear = Array.from({ length: 25 }, function (_, index) { return responseForItem(index + 1, ""); }).find(Boolean) || null;
    const showItemResponses = Boolean(cohortForYear);
    const isSchoolCohort = Boolean(cohortForYear && /school cohort/i.test(cohortForYear.sourceStatus));
    const responseCohortLabel = cohortForYear && cohortForYear.population.includes("MAA") ? "MAA 보고서 응답 집단" : cohortForYear && cohortForYear.population.includes("Taiwan") ? "대만 참가자 표본" : cohortForYear && cohortForYear.population.includes("South Korea") ? "한국 참가자" : cohortForYear && cohortForYear.population.includes("United States and Canada") ? "미국·캐나다 참가자" : cohortForYear && cohortForYear.population.includes("global") ? "세계 참가자" : "대회 응답 집단";
    const responseCohortQualityNote = cohortForYear && cohortForYear.sourceStatus.includes("Source reconciliation warning")
      ? " 원본 보고서의 문항 정답률로 계산한 평균과 요약 평균이 일치하지 않아, 이 비율은 문항별 응답 참고용으로만 표시합니다."
      : "";
    $("report-review-items-note").textContent = showItemResponses
      ? `직접 표시한 오답과 미응답입니다. ${responseCohortLabel}${cohortForYear.respondentCount == null ? " (응답자 수·지역 범위 미공개)" : ` ${cohortForYear.respondentCount.toLocaleString("en-US")}명`}의 문항별 응답 비율을 참고로 보여 줍니다. ${cohortForYear.availableQuestionCount < 25 ? `공개된 문항별 비율은 25문항 중 ${cohortForYear.availableQuestionCount}문항입니다. ` : ""}${selectedYear === 2009 && cohortForYear.respondentCount === 151367 ? "MAA 보고서 Table 8은 151,367명, 같은 보고서 Table 1은 150,733명으로 서로 다르게 적습니다. 셀 추출이 불완전한 5문항은 표시하지 않습니다." : isSchoolCohort ? "특정 학교 응시집단 표본이며 전국 학년 기준이 아닙니다." : "과거 응답 자료이며 학년별 비교나 현재 기준은 아닙니다."}${responseCohortQualityNote}`
      : `직접 표시한 오답과 미응답입니다. ${["amc8", "amc10", "amc12"].includes(selectedFormat().id) ? "이 연도·시험지의 공개 문항별 응답 통계가 없어 집단 정답률 비교는 표시하지 않습니다. " : ""}각 문항의 원본 개념·힌트·해설을 확인한 뒤 지필드 유사 유형으로 이어갈 수 있어요.`;
    result.reviewItems.forEach(function (item) {
      const itemReference = showItemResponses ? responseForItem(item.number, item.answer) : null;
      const row = document.createElement("li");
      const domain = domains.find(function (entry) { return entry.id === item.domain; });
      const reason = reasons.find(function (entry) { return entry.id === item.reason; });
      const itemState = item.status === "wrong" ? "오답" : "미응답";
      const blankReason = blankReasons.find(function (entry) { return entry.id === item.reason; });
      const selectedForm = $("archive-form").value || params.get("form") || "";
      const answerKey = answerKeyReference ? answerKeyReference.answerFor(selectedFormat().id, selectedYear, selectedForm, item.number) : null;
      const answerLabel = answerKey ? `정답 ${answerKey.acceptedAnswers.join("·")}${answerKey.erratum ? " (인쇄 오류 정정 적용)" : ""}` : "";
      const details = [item.answer ? `내 답 ${item.answer}` : "답 미입력", answerLabel, item.sourceConceptLabel, domain && item.domain !== "unclassified" ? domain.title : "영역 미분류", item.status === "wrong" && reason && item.reason !== "none" ? reason.title : "", item.status === "blank" && blankReason && item.reason !== "none" ? blankReason.title : ""].filter(Boolean);
      const summary = document.createElement("span");
      summary.textContent = `${item.number}번 · ${itemState} · ${details.join(" · ")}`;
      row.append(summary);
      if (itemReference) {
        const population = document.createElement("small");
        population.className = "report-item-response-reference";
        const commonDistractor = itemReference.mostCommonDistractor;
        const acceptedAnswerNote = itemReference.acceptedAnswers.length > 1 ? ` · 인정 답 ${itemReference.acceptedAnswers.join("·")}` : "";
        const cohortSize = itemReference.respondentCount == null ? " · 응답자 수 미공개" : ` · 전체 응답 ${itemReference.respondentCount.toLocaleString("en-US")}명`;
        population.textContent = item.answer
            ? `${itemReference.program ? `${selectedYear} ${selectedFormat().title} ${itemReference.form}` : selectedYear} 응답 집계${cohortSize} · 정답률 ${itemReference.correctResponsePercent.toFixed(2)}% · ${item.answer} 선택 ${itemReference.selectedResponsePercent.toFixed(2)}%${acceptedAnswerNote}`
            : `${itemReference.program ? `${selectedYear} ${selectedFormat().title} ${itemReference.form}` : selectedYear} 응답 집계${cohortSize} · 정답 ${itemReference.acceptedAnswers.join("·")} · 정답률 ${itemReference.correctResponsePercent.toFixed(2)}% · 최다 오답 ${commonDistractor.answer} ${commonDistractor.percent.toFixed(2)}%${acceptedAnswerNote}`;
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
      blankReasonNote.textContent = "직접 선택한 미응답 이유예요. 결과를 저장하면 누적 진단에도 반영해요.";
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
    const strategyResources = window.GFIELDAMCMAAStrategyResources;
    const officialStrategyResources = strategyResources ? strategyResources.forContest(selectedFormat().id, result.reviewItems) : null;
    const strategySection = $("maa-contest-resources");
    const strategyList = $("maa-contest-resource-list");
    strategyList.replaceChildren();
    strategySection.hidden = !officialStrategyResources;
    if (!strategySection.hidden) {
      setText("maa-contest-resources-title", officialStrategyResources.title);
      setText("maa-contest-resources-description", officialStrategyResources.description);
      setText("maa-resource-index-link", officialStrategyResources.indexTitle);
      officialStrategyResources.resources.forEach(function (resource) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = resource.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = resource.title;
        item.append(link);
        strategyList.append(item);
      });
    }
    lastOverviewContext = {
      result: result,
      programId: selectedFormat().id,
      grade: grade,
      year: selectedYear,
      form: selectedForm,
      title: selectedFormat().id === "aime" ? "AIME" : selectedFormat().title,
      reference: selectedFormat().id === "aime" ? cohort : amcCohort,
      sourceUrl: $(selectedFormat().id === "aime" ? "aime-cohort-source" : "amc-cohort-source").getAttribute("href"),
      bands: selectedFormat().id === "aime" ? aimeReference && aimeReference.bands : amcReference && amcReference.bands
    };
    refreshScoreOverview();
    $("save-diagnostic").hidden = !localRecords;
    if (!$("save-diagnostic").disabled) $("diagnostic-save-status").textContent = "";
    document.querySelector(".review-report").hidden = false;
    document.querySelector(".review-layout").classList.remove("is-empty");
    $("report-title").focus();
  }
  function refreshScoreOverview() {
    if (!lastOverviewContext) return;
    const range = window.GFIELDPaperScoreRange;
    const context = lastOverviewContext;
    const format = paperLibrary && paperLibrary.formatFor(context.programId, context.year, context.form);
    const records = localRecords ? localRecords.storage.loadCompetitionDiagnosticHistory(grade, context.programId) : [];
    const attempts = records.map(function (record) { return range.attemptFromDiagnostic(record, paperLibrary); }).filter(Boolean);
    const current = context.result.scoreEstimate;
    if (context.result.complete && current && format) attempts.push({ programId: context.programId, grade: grade, year: context.year, form: context.form,
      points: current.points, max: current.max, scoringKey: range.scoringKey(format), examDate: $("review-exam-date").value, savedAt: "~current", complete: true });
    const asOf = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    const forecast = range.forecast(attempts, { programId: context.programId, grade: grade, max: format && format.scoring && format.scoring.max,
      scoringKey: range.scoringKey(format), asOf: asOf });
    window.GFIELDPaperScoreOverview.render(Object.assign({}, context, { forecast: forecast, examDate: $("review-exam-date").value }));
    window.GFIELDPaperLearningProfileUI.current({ programId: context.programId, grade: grade, domains: context.result.domains,
      concepts: collectConceptEvidence(context.programId, context.year, context.form) });
  }
  function localToday() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
  function collectConceptEvidence(program, year, form) {
    return window.GFIELDPaperLearningProfile.conceptsFromMarks(readMarks(), function (number) {
      return itemConceptReference ? itemConceptReference.referenceFor(program, year, form, number) : null;
    });
  }
  document.addEventListener("gfield:paper-answers-restored", updateProgress);
  $("review-exam-date").addEventListener("change", function () { if (!document.querySelector(".review-report").hidden) refreshScoreOverview(); });
  $("review-grade").addEventListener("change", function (event) {
    grade = Number(event.target.value);
    if (["sasmo", "kangaroo"].includes(programId)) { renderSettings(); renderMarks(); $("official-percentile").value = ""; return; }
    if (window.GFIELDPaperBookReader) window.GFIELDPaperBookReader.setGradeContext(grade);
    updateUrl(); renderSavedDiagnosticHistory();
    if (lastDiagnostic) renderResult(lastDiagnostic, lastAutoGradeSummary);
  });
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
    if (!examDate) { $("review-extra-options").open = true; $("diagnostic-save-status").textContent = "풀이 날짜를 입력한 뒤 저장해 주세요."; $("review-exam-date").focus(); return; }
    const format = selectedFormat();
    const record = localRecords.storage.saveCompetitionDiagnostic({
      schemaVersion: "gfield-competition-diagnostic-v1", id: makeHistoryId(), programId: format.id, programTitle: format.title,
      grade: grade, paperLabel: $("review-paper-label").value.trim(), examDate: examDate,
      paper: paperLibrary && paperLibrary.archiveFor(format.id) ? { year: Number($("archive-year").value), form: $("archive-form").value || "",
        ...(lastDiagnostic.complete && lastDiagnostic.scoreEstimate ? { points: lastDiagnostic.scoreEstimate.points, max: lastDiagnostic.scoreEstimate.max } : {}) } : null,
      officialPercentile: format.id === "kangaroo" && $("official-percentile").value !== "" ? Number($("official-percentile").value) : null,
      summary: { itemCount: lastDiagnostic.itemCount, correct: lastDiagnostic.counts.correct, wrong: lastDiagnostic.counts.wrong, blank: lastDiagnostic.counts.blank,
        unmarked: lastDiagnostic.counts.unmarked, attempted: lastDiagnostic.attempted, domainClassified: lastDiagnostic.domainClassified, reasonClassified: lastDiagnostic.reasonClassified },
      domains: lastDiagnostic.domains.map(function (domain) { return { id: domain.id, attempted: domain.attempted, correct: domain.correct, wrong: domain.wrong, blank: domain.blank }; }),
      reasons: lastDiagnostic.reasons.filter(function (reason) { return reason.count > 0; }).map(function (reason) { return { id: reason.id, count: reason.count }; }),
      concepts: collectConceptEvidence(format.id, Number($("archive-year").value), $("archive-form").value || ""),
      blankReasons: lastDiagnostic.blankReasons.filter(function (reason) { return reason.count > 0; }).map(function (reason) { return { id: reason.id, count: reason.count }; })
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
    refreshScoreOverview();
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
    if (!document.querySelector(".review-report").hidden) refreshScoreOverview();
    const nextRemoveButtons = Array.from($("saved-diagnostic-list").querySelectorAll(".saved-diagnostic-remove"));
    if (nextRemoveButtons.length) nextRemoveButtons[Math.min(removedIndex, nextRemoveButtons.length - 1)].focus();
    else $("review-program").focus();
  });
  $("review-exam-date").value = localToday();
  renderSettings();
  renderMarks();
  renderSavedDiagnosticHistory();
  if (historyEngine) renderHistory();
})();
