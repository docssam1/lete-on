(function () {
  "use strict";
  const session = HIGHSELECT_AUTH.requireSession();
  if (!session) return;
  const id = new URLSearchParams(location.search).get("id") || "";
  const exam = HIGHSELECT_CATALOG.exams.find(function (item) { return item.id === id; });
  const pages = document.getElementById("viewer-pages");
  const panel = document.getElementById("answer-panel");
  const submitState = document.getElementById("submit-state");
  const responseContract = HIGHSELECT_RESPONSE_CONTRACT;
  let questionSchema = null;

  function esc(value) { const span = document.createElement("span"); span.textContent = String(value == null ? "" : value); return span.innerHTML; }
  function lock(title, message, action) {
    pages.innerHTML = `<section class="lock-screen"><div class="panel"><div class="lock-icon" aria-hidden="true">⌁</div><p class="eyebrow">시험 준비 상태</p><h1>${esc(title)}</h1><p>${esc(message)}</p><a class="button accent" href="./library.html">${esc(action || "서재로 돌아가기")}</a></div></section>`;
    panel.hidden = true;
  }
  if (!exam) { lock("시험을 찾을 수 없습니다", "등록되지 않았거나 종료된 시험입니다."); return; }
  document.title = exam.title + " · 선발·누적 진단";
  document.getElementById("exam-title").firstChild.textContent = exam.title;
  document.getElementById("exam-meta").textContent = `${session.name} 학생 · ${exam.scopeLabel}`;
  if (!HIGHSELECT_AUTH.canAccess(exam.id, session)) { lock("시험별 승인이 필요합니다", "목록에는 표시되지만 이 시험을 열 권한은 아직 없습니다."); return; }
  if (exam.releaseStatus !== "released") { lock("승인은 완료되었습니다", "시험지와 채점 기준을 마지막으로 확인하고 있습니다. 준비가 끝나면 같은 승인번호로 바로 열립니다.", "준비 상태 확인"); return; }

  function base() { return String(HIGHSELECT_RUNTIME.apiBase || "").replace(/\/$/, ""); }
  async function json(path, options) {
    const response = await fetch(base() + path, Object.assign({ credentials: "include", headers: { "Content-Type": "application/json" } }, options || {}));
    const data = await response.json().catch(function () { return {}; });
    if (!response.ok) throw new Error(data.message || "요청을 처리하지 못했습니다.");
    return data;
  }
  function watermark() {
    const layer = document.createElement("div"); layer.className = "watermark-layer";
    for (let index = 0; index < 3; index += 1) { const span = document.createElement("span"); span.textContent = `${session.name} · GFIELD · 인쇄본`; layer.append(span); }
    return layer;
  }
  function renderPages(manifest) {
    const list = HIGHSELECT_EXAM_SECURITY.validateManifest(manifest, exam, session, HIGHSELECT_RUNTIME);
    pages.innerHTML = "";
    list.forEach(function (page, index) {
      const section = document.createElement("section"); section.className = "paper-page";
      const image = document.createElement("img"); image.src = page.url; image.alt = `${exam.title} ${index + 1}쪽`; image.loading = index > 1 ? "lazy" : "eager"; image.referrerPolicy = "no-referrer";
      section.append(image, watermark()); pages.append(section);
    });
  }
  function storageKey(number) { return `highselect-answer:${session.studentId}:${exam.id}:${number}`; }
  function readRaw(number) { return localStorage.getItem(storageKey(number)); }
  function readArray(question) { return responseContract.multiValues(question, readRaw(question.number)); }
  function updateAnswered() {
    if (!questionSchema) return;
    const answered=questionSchema.questions.filter(function(question){
      return responseContract.isAnswered(question, readRaw(question.number));
    }).length;
    document.getElementById("save-state").textContent=`답안 자동 저장 · ${answered}/${questionSchema.questions.length}문항 입력`;
  }
  function inputFor(question) {
    const cell = document.createElement("label"); cell.className = "answer-cell"; cell.append(document.createTextNode(question.number + "번"));
    if (question.responseType === "self_check") {
      const box = document.createElement("div"); box.className = "ox"; box.dataset.number = question.number;
      ["o", "x"].forEach(function (value) { const button = document.createElement("button"); button.type = "button"; button.textContent = value.toUpperCase(); button.dataset.value = value; button.onclick = function () { localStorage.setItem(storageKey(question.number), value); box.querySelectorAll("button").forEach(function (item) { item.className = item.dataset.value === value ? `selected-${value}` : ""; }); updateAnswered(); }; box.append(button); });
      const saved = readRaw(question.number); if (saved === "o" || saved === "x") { const button = box.querySelector(`[data-value="${saved}"]`); if (button) button.className = `selected-${saved}`; }
      const image=document.createElement("img");image.className="answer-check-image";image.src=question.answerImageUrl;image.alt=`${question.number}번 검수 정답 그림`;image.referrerPolicy="no-referrer";
      cell.classList.add("with-answer-image");cell.append(box,image);return cell;
    }
    if (question.responseType === "multi_input") {
      const box = document.createElement("div"); box.className = "answer-parts";
      const saved = readArray(question); let previousGroup = null;
      (question.fields || []).forEach(function (field, index) {
        if (field.groupId && field.groupId !== previousGroup) {
          const marker = document.createElement("span"); marker.className = "answer-group-label"; marker.textContent = field.groupLabel || field.groupId; box.append(marker); previousGroup = field.groupId;
        }
        const input = document.createElement("input"); input.setAttribute("aria-label", `${question.number}번 ${field.label || index + 1}`); input.placeholder = field.label || String(index + 1); input.dataset.slotId = field.slotId; if (field.groupId) input.dataset.groupId = field.groupId; input.value = saved[index] || "";
        input.oninput = function () { const values = Array.from(box.querySelectorAll("input")).map(function (item) { return item.value; }); localStorage.setItem(storageKey(question.number), JSON.stringify(values)); updateAnswered(); }; box.append(input);
      });
      cell.append(box); return cell;
    }
    if (question.responseType === "ordered_list" || question.responseType === "unordered_set") {
      const input = document.createElement("input"); input.className = "list-answer"; input.setAttribute("aria-label", `${question.number}번 ${question.responseType === "ordered_list" ? "순서 있는" : "순서 없는"} 답`); input.placeholder = question.responseType === "ordered_list" ? "순서대로 쉼표로 구분" : "쉼표로 구분 (순서 무관)"; input.value = readRaw(question.number) || ""; input.oninput = function () { localStorage.setItem(storageKey(question.number), input.value); updateAnswered(); }; cell.append(input); return cell;
    }
    const input = document.createElement("input"); input.setAttribute("aria-label", question.number + "번 답"); input.placeholder = "답"; input.value = localStorage.getItem(storageKey(question.number)) || ""; input.oninput = function () { localStorage.setItem(storageKey(question.number), input.value); updateAnswered(); };
    cell.append(input); return cell;
  }
  function renderAnswers(schema) {
    const list = HIGHSELECT_EXAM_SECURITY.validateResponseSchema(schema, exam, session, HIGHSELECT_RUNTIME);
    questionSchema = { examId: schema.examId, questions: list };
    const grid = document.getElementById("answer-grid"); grid.innerHTML = ""; list.forEach(function (question) { grid.append(inputFor(question)); }); panel.hidden = false; updateAnswered();
  }
  function answersPayload() {
    const answers = questionSchema.questions.map(function (question) {
      return Object.assign({ number: question.number, responseType: question.responseType }, responseContract.collect(question, readRaw(question.number)));
    });
    return HIGHSELECT_EXAM_SECURITY.validateAttemptAnswers(answers, questionSchema.questions);
  }
  async function submit() {
    submitState.className = "status"; submitState.textContent = "답안을 제출하고 있습니다.";
    try {
      const report = await json(`/exams/${encodeURIComponent(exam.id)}/attempts`, { method: "POST", body: JSON.stringify({ answers: answersPayload() }) });
      submitState.className = "status ok"; submitState.textContent = "채점이 완료되었습니다.";
      if (!report.attemptId) throw new Error("채점 결과 식별자가 없습니다.");
      location.href = `./report.html?attempt=${encodeURIComponent(report.attemptId)}`;
    } catch (error) { submitState.className = "status error"; submitState.textContent = error.message; }
  }
  document.getElementById("submit").onclick = submit;
  document.getElementById("to-answers").onclick = function () { panel.scrollIntoView({ behavior: "smooth", block: "start" }); };
  document.getElementById("print-paper").onclick = function () { window.print(); };
  (async function init() {
    if (!base()) { lock("운영 서버 연결이 필요합니다", "시험지는 정적 저장소가 아니라 권한 서버에서 페이지 단위로 전달됩니다."); return; }
    try {
      const result = await Promise.all([
        json(`/exams/${encodeURIComponent(exam.id)}/pages`),
        json(`/exams/${encodeURIComponent(exam.id)}/response-schema`)
      ]);
      renderPages(result[0]); renderAnswers(result[1]);
    } catch (error) { lock("시험지를 열지 못했습니다", error.message); }
  })();
})();
