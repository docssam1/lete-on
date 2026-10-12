(function () {
  "use strict";

  const session = window.GFIELDSASMOLocalPaperSession;
  const catalog = window.GFIELDSASMOMockCatalog;
  const readiness = window.GFIELDSASMOMockReadiness;
  const localRecord = window.GFIELDLocalLearningRecord;
  const pdfjs = window.pdfjsLib;
  if (!session || !catalog || !readiness || !localRecord || !pdfjs) throw new Error("SASMO local diagnostic dependencies did not load");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("../reading-world/vendor/pdfjs/pdf.worker.min.js", window.location.href).href;

  const axisLabels = Object.freeze({
    "number-operations": "수와 연산",
    "patterns-algebra": "규칙과 대수",
    "geometry-spatial": "기하·공간 추론",
    "combinatorics-logic": "조합과 논리",
    "data-probability": "자료와 가능성",
    "problem-solving-strategies": "문제 해결 전략"
  });
  const outcomeLabels = Object.freeze({ correct: "정답", incorrect: "오답", blank: "미응답" });
  const responseTypeLabels = Object.freeze({ "multiple-choice": "객관식", "numeric-exact": "단답형" });
  const paperFile = document.getElementById("paper-file");
  const packFile = document.getElementById("pack-file");
  const paperCanvas = document.getElementById("paper-canvas");
  const paperCanvasWrap = document.querySelector(".pdf-canvas-wrap");
  const pageIndicator = document.getElementById("page-indicator");
  const previousPage = document.getElementById("previous-page");
  const nextPage = document.getElementById("next-page");
  const openPaper = document.getElementById("open-paper");
  const paperEmpty = document.getElementById("paper-empty");
  const pdfStage = document.getElementById("pdf-stage");
  const sourceState = document.getElementById("source-state");
  const scoreButton = document.getElementById("score-button");
  const answerForm = document.getElementById("answer-form");
  const answerSheet = document.getElementById("answer-sheet");
  const results = document.getElementById("results");
  const runtimeNote = document.getElementById("runtime-note");
  const pageParameters = new URLSearchParams(window.location.search);
  const pageAudience = pageParameters.get("audience") === "teacher" ? "teacher" : "student";
  const runtimeToken = pageParameters.get("runtime") === "local-private" ? pageParameters.get("token") : null;
  const loopback = new Set(["127.0.0.1", "localhost", "[::1]"]).has(window.location.hostname);
  const privateRuntime = loopback && /^[A-Za-z0-9_-]{32}$/u.test(runtimeToken || "")
    ? Object.freeze({ baseUrl: new URL(`/__gfield_private/${runtimeToken}/`, window.location.origin), audience: pageAudience, token: runtimeToken })
    : null;
  document.body.dataset.audience = pageAudience;
  if (privateRuntime) {
    const planUrl = new URL("./learning-plan.html", window.location.href);
    planUrl.search = "";
    planUrl.searchParams.set("goal", "sasmo-primary6");
    planUrl.searchParams.set("audience", privateRuntime.audience);
    planUrl.searchParams.set("runtime", "local-private");
    planUrl.searchParams.set("token", privateRuntime.token);
    ["learning-plan-nav", "plan-link"].forEach(function (id) { document.getElementById(id).href = planUrl.href; });
  }
  document.getElementById("setup-label").textContent = pageAudience === "teacher" ? "TEACHER SETUP" : "STUDENT SETUP";
  if (pageAudience === "teacher") {
    document.getElementById("question-review-summary").textContent = "교사용 문항별 득점·관찰표와 복습 열기";
    document.getElementById("question-review-copy").textContent = "각 문항의 실제 득점과 학생에게 확인할 다음 행동을 봅니다. 정오만으로 오류 유형을 확정하지 않습니다. 9번·15번·19번·21번은 점수에는 포함하지만 영역 관찰에는 사용하지 않으며, 다른 영역 이름도 원본 대비 분류 검수 중입니다.";
  }
  let activePack = null;
  let paperFingerprint = null;
  let paperUrl = null;
  let activePdf = null;
  let activePageNumber = 1;
  let activeRenderTask = null;
  let resizeTimer = null;
  let paperSelectionVersion = 0;
  let packSelectionVersion = 0;
  let privateReviewBaseUrl = null;

  function setSourceState(state, title, detail) {
    sourceState.dataset.state = state;
    sourceState.querySelector("b").textContent = title;
    sourceState.querySelector("p").textContent = detail;
  }
  async function sha256Hex(bytes) {
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), function (byte) { return byte.toString(16).padStart(2, "0"); }).join("");
  }
  function updateAnsweredCount() {
    const count = responseValues().filter(Boolean).length;
    document.getElementById("answered-count").textContent = `${count} / 25 입력`;
  }
  function choice(number, letter) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");
    input.type = "radio";
    input.name = `q${number}`;
    input.value = letter;
    input.disabled = true;
    text.textContent = letter;
    label.append(input, text);
    return label;
  }
  function renderAnswerSheet() {
    const fragment = document.createDocumentFragment();
    for (let number = 1; number <= session.ITEM_COUNT; number += 1) {
      const row = document.createElement("div");
      row.className = `omr-row${number === 16 ? " section-break" : ""}`;
      row.dataset.question = String(number);
      const marker = document.createElement("strong");
      marker.textContent = String(number).padStart(2, "0");
      if (number <= 15) {
        const group = document.createElement("div");
        group.className = "choice-group";
        group.setAttribute("role", "radiogroup");
        group.setAttribute("aria-label", `${number}번 답`);
        ["A", "B", "C", "D", "E"].forEach(function (letter) { group.append(choice(number, letter)); });
        row.append(marker, group);
      } else {
        const input = document.createElement("input");
        input.className = "numeric-answer";
        input.name = `q${number}`;
        input.type = "text";
        input.inputMode = "numeric";
        input.autocomplete = "off";
        input.placeholder = "숫자 또는 분수";
        input.setAttribute("aria-label", `${number}번 답`);
        input.disabled = true;
        row.append(marker, input);
      }
      fragment.append(row);
    }
    answerSheet.replaceChildren(fragment);
  }
  function setAnswerInputsEnabled(enabled) {
    answerSheet.querySelectorAll("input").forEach(function (input) { input.disabled = !enabled; });
    scoreButton.disabled = !enabled;
    document.getElementById("answer-status").textContent = enabled ? "답을 입력한 뒤 채점하세요. 미입력 문항은 빈칸으로 처리됩니다." : privateRuntime ? "검증된 로컬 학습 자료를 연결하는 중입니다." : "2019 원본 PDF와 채점팩을 모두 선택하세요.";
  }
  function updateDiagnosticReady() {
    const ready = Boolean(activePack && activePdf && paperFingerprint && paperFingerprint === activePack.paper.sourceFingerprintSha256);
    setAnswerInputsEnabled(ready);
    if (ready) setSourceState("ready", "2019 Grade 6 원본 대조 완료", privateRuntime ? "로컬 스튜디오가 문제지·채점팩·문항별 복습의 검증값을 모두 확인했습니다. 자료와 답안은 이 컴퓨터를 벗어나지 않습니다." : "선택한 PDF가 문항별로 대조한 제3자 공개 보관본의 파일 지문과 일치하고 25문항 채점팩 형식을 확인했습니다.");
    else if (activePack) setSourceState("waiting", "원본 PDF 대기", "등록된 2019 Grade 6 문제 PDF를 선택하면 답안 입력이 열립니다.");
    else if (paperFingerprint) setSourceState("waiting", "채점팩 대기", "원본 PDF를 확인했습니다. 이 회차의 검증된 채점팩을 선택하세요.");
  }
  function responseValues() {
    return Array.from({ length: session.ITEM_COUNT }, function (_, index) {
      const number = index + 1;
      if (number <= 15) {
        const selected = answerForm.querySelector(`input[name="q${number}"]:checked`);
        return selected ? selected.value : "";
      }
      const input = answerForm.querySelector(`input[name="q${number}"]`);
      return input ? input.value.trim() : "";
    });
  }
  function enablePack(pack, fileName) {
    session.validatePack(pack);
    activePack = pack;
    document.getElementById("pack-file-name").textContent = fileName;
    updateDiagnosticReady();
  }
  async function loadPackBytes(bytes, fileName, stillCurrent) {
    if (!(bytes instanceof ArrayBuffer) || bytes.byteLength <= 0 || bytes.byteLength > 1024 * 1024) throw new Error("PACK_SIZE_INVALID");
    if (await sha256Hex(bytes) !== catalog.getForm(session.FORM_ID).packFingerprintSha256) throw new Error("PACK_FINGERPRINT_MISMATCH");
    if (stillCurrent && !stillCurrent()) return false;
    const pack = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (stillCurrent && !stillCurrent()) return false;
    enablePack(pack, fileName);
    return true;
  }
  function resetPack(message) {
    activePack = null;
    setAnswerInputsEnabled(false);
    setSourceState("error", "채점팩을 사용할 수 없습니다", message);
  }
  function revokePaperUrl() {
    if (paperUrl) URL.revokeObjectURL(paperUrl);
    paperUrl = null;
  }
  function resetPaperEmpty() {
    paperEmpty.querySelector("strong").textContent = "2019 Grade 6 원본 PDF를 선택하세요.";
    paperEmpty.querySelector("p").textContent = "파일 지문을 대조한 뒤 문제와 답안표가 열립니다. 화면 또는 인쇄물로 풀 수 있으며 파일은 이 기기를 벗어나지 않습니다.";
  }
  async function releasePdf() {
    if (activeRenderTask) {
      try { activeRenderTask.cancel(); } catch (error) { /* no-op */ }
      activeRenderTask = null;
    }
    if (activePdf) {
      try { await activePdf.destroy(); } catch (error) { /* no-op */ }
      activePdf = null;
    }
    delete pdfStage.dataset.ready;
    const context = paperCanvas.getContext("2d");
    context.clearRect(0, 0, paperCanvas.width, paperCanvas.height);
    paperCanvas.width = 0;
    paperCanvas.height = 0;
  }
  function updatePageControls() {
    const pages = activePdf ? activePdf.numPages : 1;
    pageIndicator.textContent = `${activePageNumber} / ${pages}`;
    previousPage.disabled = !activePdf || activePageNumber <= 1;
    nextPage.disabled = !activePdf || activePageNumber >= pages;
  }
  async function renderPdfPage() {
    if (!activePdf) return;
    const pageNumber = activePageNumber;
    const page = await activePdf.getPage(pageNumber);
    if (!activePdf || pageNumber !== activePageNumber) return;
    if (activeRenderTask) {
      try { activeRenderTask.cancel(); } catch (error) { /* no-op */ }
    }
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(240, paperCanvasWrap.clientWidth - 24);
    const cssScale = Math.min(1.6, availableWidth / baseViewport.width);
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    const viewport = page.getViewport({ scale: cssScale * pixelRatio });
    paperCanvas.width = Math.ceil(viewport.width);
    paperCanvas.height = Math.ceil(viewport.height);
    paperCanvas.style.width = `${Math.round(viewport.width / pixelRatio)}px`;
    paperCanvas.style.height = `${Math.round(viewport.height / pixelRatio)}px`;
    const renderTask = page.render({ canvasContext: paperCanvas.getContext("2d", { alpha: false }), viewport: viewport });
    activeRenderTask = renderTask;
    try {
      await renderTask.promise;
      if (pageNumber === activePageNumber) {
        pdfStage.dataset.ready = "true";
        updatePageControls();
      }
    } catch (error) {
      if (error && error.name !== "RenderingCancelledException") throw error;
    } finally {
      if (activeRenderTask === renderTask) activeRenderTask = null;
    }
  }
  async function showPaper(file) {
    const selectionVersion = ++paperSelectionVersion;
    paperFingerprint = null;
    updateDiagnosticReady();
    pdfStage.hidden = true;
    paperEmpty.hidden = false;
    openPaper.href = "#";
    resetPaperEmpty();
    await releasePdf();
    if (selectionVersion !== paperSelectionVersion) return;
    revokePaperUrl();
    if (!file) {
      document.getElementById("paper-file-name").textContent = "2019 Grade 6 원본 PDF 선택";
      return;
    }
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      document.getElementById("paper-file-name").textContent = "PDF 파일만 선택할 수 있습니다.";
      paperFile.value = "";
      return;
    }
    try {
      document.getElementById("paper-file-name").textContent = `${file.name} · 불러오는 중`;
      const bytes = await file.arrayBuffer();
      if (selectionVersion !== paperSelectionVersion) return;
      const fingerprint = await sha256Hex(bytes);
      if (selectionVersion !== paperSelectionVersion) return;
      if (fingerprint !== catalog.getForm(session.FORM_ID).sourceFingerprintSha256) throw new Error("PAPER_SOURCE_MISMATCH");
      const loadedPdf = await pdfjs.getDocument({ data: new Uint8Array(bytes) }).promise;
      if (selectionVersion !== paperSelectionVersion) { await loadedPdf.destroy(); return; }
      activePdf = loadedPdf;
      paperUrl = URL.createObjectURL(file);
      openPaper.href = paperUrl;
      activePageNumber = 1;
      paperEmpty.hidden = true;
      pdfStage.hidden = false;
      updatePageControls();
      await renderPdfPage();
      if (selectionVersion !== paperSelectionVersion) return;
      paperFingerprint = fingerprint;
      updateDiagnosticReady();
      document.getElementById("paper-file-name").textContent = `${file.name} · ${activePdf.numPages}쪽`;
    } catch (error) {
      if (selectionVersion !== paperSelectionVersion) return;
      paperFingerprint = null;
      await releasePdf();
      revokePaperUrl();
      updateDiagnosticReady();
      pdfStage.hidden = true;
      paperEmpty.hidden = false;
      const mismatch = error && error.message === "PAPER_SOURCE_MISMATCH";
      paperEmpty.querySelector("strong").textContent = mismatch ? "이 회차의 원본 PDF가 아닙니다." : "문제 PDF를 화면에 표시하지 못했습니다.";
      paperEmpty.querySelector("p").textContent = mismatch ? "2019 Grade 6 문제지만 선택할 수 있습니다. 다른 연도나 해설 포함 파일은 채점에 사용되지 않습니다." : "파일을 다시 선택하세요. 답안 입력은 열리지 않습니다.";
      document.getElementById("paper-file-name").textContent = mismatch ? "원본 불일치 · 다시 선택" : "PDF 표시 실패 · 다시 선택";
    }
  }
  function axisCard(axis) {
    const card = document.createElement("article");
    card.className = "axis-card";
    card.dataset.evidence = axis.evidenceState;
    const header = document.createElement("header");
    const title = document.createElement("h4");
    const count = document.createElement("span");
    title.textContent = axisLabels[axis.axisId] || axis.axisId;
    count.textContent = `${axis.correct} / ${axis.itemCount}`;
    header.append(title, count);
    const meter = document.createElement("div");
    meter.className = "axis-meter";
    const fill = document.createElement("i");
    fill.style.setProperty("--axis-score", `${Math.max(0, Math.min(100, axis.percentage))}%`);
    meter.append(fill);
    const detail = document.createElement("p");
    detail.textContent = axis.evidenceState === "sufficient" ? `정답률 ${axis.percentage}% · 영역 분류 검수 중` : `정답률 ${axis.percentage}% · 표본 부족·분류 검수 중`;
    card.append(header, meter, detail);
    return card;
  }
  function signedPoints(value) {
    if (value > 0) return `+${value}점`;
    if (value < 0) return `−${Math.abs(value)}점`;
    return "0점";
  }
  function diagnosticStateText(item) {
    if (item.diagnosticEligibility === "review-required") {
      if (item.diagnosticReasonCode === "language-determinacy-review") return "표현 해석 검수 필요 · 영역 진단 제외";
      if (item.diagnosticReasonCode === "whole-number-zero-scope-review") return "0 포함 범위 검수 필요 · 영역 진단 제외";
      return "문항 규칙 검수 필요 · 영역 진단 제외";
    }
    if (item.diagnosticEligibility === "score-only") return "점수만 반영 · 영역 진단 제외";
    return `영역 가분류 · ${axisLabels[item.axisId] || item.axisId} · 검수 중`;
  }
  function reviewComment(item) {
    if (item.reviewCommentCode === "diagnostic-exclusion") {
      return pageAudience === "teacher"
        ? "영역 강약 판정에 쓰지 말고 원문 검수 설명과 학생 풀이를 따로 확인하세요."
        : "점수에는 반영되지만 강점·약점 판단에는 사용하지 않습니다. 원문 검수 설명을 확인하세요.";
    }
    if (item.reviewCommentCode === "explain-strategy") {
      return pageAudience === "teacher"
        ? "학생이 풀이를 설명하게 하여 우연 정답인지 확인하세요."
        : "풀이 방법을 한 문장으로 설명해 보세요.";
    }
    if (item.reviewCommentCode === "locate-first-divergence") {
      return pageAudience === "teacher"
        ? "답만으로 오류 유형을 정하지 말고 풀이에서 처음 달라진 단계를 확인하세요."
        : "답을 보지 말고 다시 풀며 처음 막힌 단계를 표시하세요.";
    }
    return pageAudience === "teacher"
      ? "시간 부족인지 시작 방법을 찾지 못했는지 풀이 흔적으로 구분하세요."
      : "시간을 정해 다시 시도하고, 시작하지 못한 이유를 적으세요.";
  }
  function questionChip(item) {
    const chip = document.createElement(privateReviewBaseUrl ? "a" : "div");
    chip.className = "question-chip";
    chip.dataset.outcome = item.outcome;
    chip.dataset.diagnosticEligibility = item.diagnosticEligibility;
    chip.dataset.pointsEarned = String(item.pointsEarned);
    const number = document.createElement("b");
    const scoring = document.createElement("span");
    const state = document.createElement("span");
    const comment = document.createElement("p");
    number.textContent = `${String(item.questionNumber).padStart(2, "0")} · ${outcomeLabels[item.outcome]}`;
    scoring.className = "question-scoring";
    scoring.textContent = `Section ${item.sectionId} · ${responseTypeLabels[item.responseType] || item.responseType} · 배점 ${item.pointsPossible}점 · 이번 득점 ${signedPoints(item.pointsEarned)}`;
    state.className = "question-taxonomy";
    state.textContent = diagnosticStateText(item);
    comment.className = "question-comment";
    comment.textContent = reviewComment(item);
    chip.append(number, scoring, state, comment);
    if (privateReviewBaseUrl) {
      const reviewUrl = new URL(privateReviewBaseUrl.href);
      reviewUrl.searchParams.set("q", String(item.questionNumber));
      chip.href = reviewUrl.href;
      chip.target = "_blank";
      chip.rel = "noopener noreferrer";
      chip.classList.add("has-review-link");
      const action = document.createElement("small");
      action.textContent = item.diagnosticEligibility === "eligible" ? "원문·개념 복습 열기 →" : "원문·검수 설명 열기 →";
      chip.append(action);
    }
    chip.setAttribute("aria-label", `${item.questionNumber}번 ${outcomeLabels[item.outcome]}, 이번 득점 ${signedPoints(item.pointsEarned)}. ${reviewComment(item)}`);
    return chip;
  }
  function renderReport(report, saveOutcome) {
    const student = report.student;
    document.getElementById("raw-score").textContent = String(student.score.rawScore);
    document.getElementById("correct-count").textContent = String(student.score.correct);
    document.getElementById("incorrect-count").textContent = String(student.score.incorrect);
    document.getElementById("blank-count").textContent = String(student.score.blank);
    document.getElementById("readiness-label").textContent = `${student.readiness.band.label} · 공식 수상 등급 아님`;
    const sectionA = student.score.sections.find(function (section) { return section.id === "A"; });
    const sectionB = student.score.sections.find(function (section) { return section.id === "B"; });
    if (!sectionA || !sectionB) throw new Error("SASMO section score summary is unavailable");
    document.getElementById("section-score-summary").textContent = `A영역 ${sectionA.rawScore} / ${sectionA.maxScore} · B영역 ${sectionB.rawScore} / ${sectionB.maxScore}`;
    document.getElementById("axis-boundary").textContent = `25문항은 모두 인쇄 정답 기준 점수에 포함합니다. 9번은 공동 최솟값 표현, 15번은 그림 규칙의 비유일성, ${student.scoreOnlyQuestionNumbers.join("·")}번은 유한 수열 규칙의 비유일성, 21번은 원문의 ‘whole numbers’가 0을 포함하는지 불명확해 영역 관찰에서 제외합니다. 나머지 ${25 - student.diagnosticExcludedQuestionNumbers.length}문항만 관찰하며, 영역 분류 검수가 끝날 때까지 자동 약점 처방에는 사용하지 않습니다.`;
    const axisGrid = document.getElementById("axis-grid");
    axisGrid.replaceChildren.apply(axisGrid, student.axes.map(axisCard));
    const priority = report.localEvidence.priorityAxis;
    document.getElementById("priority-title").textContent = priority ? `우선 보완 · ${axisLabels[priority]}` : "영역별 자동 처방은 검수 대기 중입니다.";
    document.getElementById("priority-copy").textContent = priority ? "개념 교재, 수업용 워크북, 독립 연습, 재확인을 같은 영역으로 연결합니다." : "기출 점수는 이력에 남기되, 영역 분류가 확정되기 전에는 임의의 약점을 배정하지 않습니다. 교사 관찰이나 별도 점검 결과로 학습 영역을 선택할 수 있습니다.";
    const evidence = document.getElementById("question-evidence");
    evidence.replaceChildren.apply(evidence, report.teacher.questionEvidence.map(questionChip));
    const boundary = document.querySelector(".prediction-boundary");
    if (saveOutcome.saved && Array.isArray(student.prediction.expectedNextScoreRange)) {
      boundary.textContent = `서로 다른 검증 기출 ${student.prediction.evidenceCount}회 기준, 다음 70점 시험 예상 범위 ${student.prediction.expectedNextScoreRange[0]}–${student.prediction.expectedNextScoreRange[1]}점 · 신뢰도 낮음. 공식 수상 등급이나 합격선 예측이 아닙니다.`;
    } else if (saveOutcome.saved) {
      boundary.textContent = `최초 응시 ${saveOutcome.count}/3회 기록. 서로 다른 동일 학년 검증 기출 3회부터 다음 시험의 점수 범위를 계산합니다. 공식 수상 등급 예측은 제공하지 않습니다.`;
    } else if (saveOutcome.reason === "duplicate-form") {
      boundary.textContent = "같은 기출을 다시 풀었습니다. 이번 채점은 연습 결과이며 저장된 최초 점수와 예상 범위를 바꾸지 않습니다.";
    } else {
      boundary.textContent = "이 기기에 최초 응시 기록을 저장하지 못했습니다. 이번 채점은 향후 점수 예상에 사용되지 않습니다.";
    }
    results.hidden = false;
    results.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  function clearSession() {
    if (!window.confirm("이 기기의 답안과 SASMO 기출 진단 결과를 지울까요? 원본 PDF 파일은 삭제되지 않습니다.")) return;
    if (privateRuntime && activePack && activePdf && paperFingerprint === activePack.paper.sourceFingerprintSha256) {
      answerForm.reset();
      results.hidden = true;
      localRecord.storage.clearCompetitionEvidence();
      updateAnsweredCount();
      updateDiagnosticReady();
      document.getElementById("answer-status").textContent = "답안과 이번 진단 결과를 지웠습니다. 검증된 로컬 자료는 연결된 상태입니다.";
      return;
    }
    paperSelectionVersion += 1;
    packSelectionVersion += 1;
    activePack = null;
    paperFingerprint = null;
    answerForm.reset();
    packFile.value = "";
    paperFile.value = "";
    document.getElementById("pack-file-name").textContent = "2019 G6 검증팩 선택";
    document.getElementById("paper-file-name").textContent = "2019 Grade 6 원본 PDF 선택";
    releasePdf();
    revokePaperUrl();
    openPaper.href = "#";
    pdfStage.hidden = true;
    paperEmpty.hidden = false;
    resetPaperEmpty();
    results.hidden = true;
    localRecord.storage.clearCompetitionEvidence();
    setSourceState("waiting", "채점 대기", "원본 PDF와 검증팩을 선택하면 25문항 답안표가 활성화됩니다.");
    setAnswerInputsEnabled(false);
    updateAnsweredCount();
  }

  renderAnswerSheet();
  setAnswerInputsEnabled(false);
  paperFile.addEventListener("change", function () { showPaper(paperFile.files && paperFile.files[0]); });
  packFile.addEventListener("change", async function () {
    const selectionVersion = ++packSelectionVersion;
    const file = packFile.files && packFile.files[0];
    activePack = null;
    updateDiagnosticReady();
    if (!file) { document.getElementById("pack-file-name").textContent = "2019 G6 검증팩 선택"; return; }
    if (file.size > 1024 * 1024) { resetPack("검증팩 파일이 예상 크기를 초과했습니다."); return; }
    try {
      const bytes = await file.arrayBuffer();
      if (selectionVersion !== packSelectionVersion) return;
      await loadPackBytes(bytes, file.name, function () { return selectionVersion === packSelectionVersion; });
    } catch (error) {
      if (selectionVersion !== packSelectionVersion) return;
      resetPack(`검증 실패: ${error.code || (error.message === "PACK_FINGERPRINT_MISMATCH" ? error.message : "JSON_INVALID")}`);
    }
  });
  answerForm.addEventListener("input", updateAnsweredCount);
  answerForm.addEventListener("change", updateAnsweredCount);
  answerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!activePack || !activePdf || paperFingerprint !== activePack.paper.sourceFingerprintSha256) { updateDiagnosticReady(); return; }
    try {
      const current = catalog.getForm(session.FORM_ID);
      const prior = localRecord.storage.getComparableCompetitionSeries(catalog, "G6");
      const alreadyRecorded = prior.some(function (entry) { return entry.formId === current.formId; });
      const history = alreadyRecorded ? null : prior.map(function (entry) {
        return { formId: entry.formId, formVersion: entry.formVersion, levelId: entry.levelId, comparisonKey: entry.comparisonKey, scoringFingerprintSha256: entry.scoringFingerprintSha256, sourceFingerprintSha256: entry.sourceFingerprintSha256, rawScore: entry.score.rawScore, maxScore: entry.score.maxScore, verifiedRealPaper: true };
      });
      const report = session.analyze(activePack, responseValues(), { catalog: catalog, readiness: readiness }, { history: history });
      const saveOutcome = localRecord.storage.saveCompetitionFirstAttempt(report.localEvidence);
      document.getElementById("answer-status").textContent = `채점 완료 · ${report.student.score.rawScore} / 70`;
      renderReport(report, saveOutcome);
    } catch (error) {
      document.getElementById("answer-status").textContent = `채점을 중단했습니다: ${error.code || "INVALID"}`;
    }
  });
  document.getElementById("clear-session").addEventListener("click", clearSession);
  previousPage.addEventListener("click", async function () { if (activePdf && activePageNumber > 1) { activePageNumber -= 1; updatePageControls(); await renderPdfPage(); } });
  nextPage.addEventListener("click", async function () { if (activePdf && activePageNumber < activePdf.numPages) { activePageNumber += 1; updatePageControls(); await renderPdfPage(); } });
  window.addEventListener("resize", function () {
    if (!activePdf) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { renderPdfPage(); }, 120);
  });
  window.addEventListener("beforeunload", function () { releasePdf(); revokePaperUrl(); }, { once: true });

  async function privateResponse(relativePath, method) {
    const url = new URL(relativePath, privateRuntime.baseUrl);
    const response = await window.fetch(url.href, { method: method || "GET", cache: "no-store", credentials: "same-origin" });
    if (!response.ok || response.headers.get("x-gfield-private-studio") !== "sasmo-2019-g6-v1") throw new Error("PRIVATE_RUNTIME_RESPONSE_INVALID");
    return response;
  }
  async function loadPrivateRuntime() {
    runtimeNote.hidden = false;
    document.querySelector(".setup-panel").dataset.runtime = "local-private";
    paperFile.disabled = true;
    packFile.disabled = true;
    document.getElementById("paper-file-name").textContent = "검증된 원본 문제지 · 자동 연결 중";
    document.getElementById("pack-file-name").textContent = "검증된 채점팩 · 자동 연결 중";
    setSourceState("waiting", "로컬 스튜디오 연결 중", "문제지·채점팩·문항별 복습의 검증값을 확인하고 있습니다.");
    try {
      const responses = await Promise.all([
        privateResponse("pack.json"),
        privateResponse("paper.pdf"),
        privateResponse(`review/${privateRuntime.audience}.html`, "HEAD")
      ]);
      const packBytes = await responses[0].arrayBuffer();
      const paperBytes = await responses[1].arrayBuffer();
      await loadPackBytes(packBytes, "2019 G6 검증팩 · 로컬 자동 연결");
      privateReviewBaseUrl = new URL(`review/${privateRuntime.audience}.html`, privateRuntime.baseUrl);
      await showPaper(new File([paperBytes], "SASMO_2019_G6_Problem_Set.pdf", { type: "application/pdf" }));
      if (!activePack || !activePdf || !privateReviewBaseUrl) throw new Error("PRIVATE_RUNTIME_NOT_READY");
    } catch (error) {
      privateReviewBaseUrl = null;
      activePack = null;
      paperFingerprint = null;
      await releasePdf();
      revokePaperUrl();
      setAnswerInputsEnabled(false);
      setSourceState("error", "로컬 스튜디오 연결 실패", `검증된 자료를 열지 못했습니다: ${error.code || error.message || "INVALID"}`);
      document.getElementById("paper-file-name").textContent = "로컬 문제지 연결 실패";
      document.getElementById("pack-file-name").textContent = "로컬 채점팩 연결 실패";
    }
  }
  if (privateRuntime) loadPrivateRuntime();
})();
