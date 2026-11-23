(function () {
  "use strict";
  const library = window.GFIELDAMCOriginalPaperLibrary;
  const keys = window.GFIELDAMCOriginalAnswerKeyReference;
  let store; try { store = localStorage; } catch (_) { store = null; }
  const progress = window.GFIELDPaperStudyState.create(store, library, keys);
  const programSelect = document.getElementById("review-program");
  const yearSelect = document.getElementById("archive-year");
  const formSelect = document.getElementById("archive-form");
  const programmes = document.getElementById("review-program-buttons");
  const papers = document.getElementById("paper-choice-list");
  const states = { new: "시작 전", started: "학습 중", complete: "학습 완료" };
  function button(text) { const el = document.createElement("button"); el.type = "button"; el.textContent = text; return el; }
  function current() { return { program: programSelect.value, year: Number(yearSelect.value), form: formSelect.value || "" }; }
  function mark(value, result) { const c = current(); progress.mark(c.program, c.year, c.form, value, result); render(); }
  function selectPaper(year, form, open) {
    if (yearSelect.value !== String(year)) { yearSelect.value = String(year); yearSelect.dispatchEvent(new Event("change", { bubbles: true })); }
    if (formSelect.value !== form) { formSelect.value = form; formSelect.dispatchEvent(new Event("change", { bubbles: true })); }
    mark("started");
    if (open && document.getElementById("book-open") && !document.getElementById("paper-book").hidden) document.getElementById("book-open").click();
    render();
    if (open) { const panel = document.getElementById("original-exam-panel"); const title = document.getElementById(panel && !panel.hidden ? "original-exam-heading" : "paper-book-title"); title.focus({ preventScroll: true }); (panel && !panel.hidden ? panel : document.getElementById("paper-book")).scrollIntoView({ block: "start" }); }
  }
  function render() {
    const focusedId = document.activeElement && document.activeElement.id;
    programmes.replaceChildren();
    Array.from(programSelect.options).filter(function (o) { return o.value; }).forEach(function (option) {
      const el = button(option.textContent); el.disabled = document.body.classList.contains("is-original-exam-running"); el.dataset.reviewProgram = option.value; el.id = "review-program-" + option.value;
      el.setAttribute("aria-pressed", String(programSelect.value === option.value));
      el.addEventListener("click", function () { if (programSelect.value === option.value) return; programSelect.value = option.value; programSelect.dispatchEvent(new Event("change", { bubbles: true })); render(); document.getElementById("review-program-" + option.value).focus(); });
      programmes.append(el);
    });
    papers.replaceChildren();
    const c = current(), archive = library.archiveFor(c.program);
    if (!archive) return;
    const recent = library.studyYearsFor(c.program), years = recent.slice();
    if (archive.years.includes(c.year) && !years.includes(c.year)) years.push(c.year);
    const records = window.GFIELDLocalLearningRecord ? window.GFIELDLocalLearningRecord.storage.loadCompetitionDiagnosticHistory() : [];
    years.forEach(function (year) {
      const forms = library.formsFor(c.program, year).filter(function (form) { return progress.identity(c.program, year, form) && (window.GFIELDAMCStudyPapers.paperFor(c.program, year, form) || !recent.includes(year)); });
      if (!forms.length) return;
      const group = document.createElement("section"), title = document.createElement("h4"), row = document.createElement("div");
      group.className = "paper-choice-year"; title.textContent = year; row.className = "paper-choice-forms"; group.append(title, row);
      forms.forEach(function (form) {
        let state = progress.state(c.program, year, form);
        const saved = records.filter(function (r) { return r.programId === c.program && r.paper && r.paper.year === year && r.paper.form === form; });
        if (saved.some(function (r) { return r.summary.unmarked === 0 && r.summary.attempted > 0; })) state = "complete";
        else if (state === "new" && saved.length) state = "started";
        const lang = document.documentElement.lang || "ko";
        const season = lang.startsWith("en") ? ["Spring", "Fall"] : lang.startsWith("zh") ? ["春季", "秋季"] : ["봄", "가을"];
        const displayForm = form === "C" ? "A" : form === "D" ? "B" : form;
        const seasonLabel = year === 2021 && ["amc10", "amc12"].includes(c.program) ? " · " + season[["C", "D"].includes(form) ? 1 : 0] : "";
        const label = c.program === "amc8" ? `${year} AMC 8` : `${year} ${displayForm}${seasonLabel}`;
        const el = button(""); el.className = "paper-choice is-" + state;
        el.id = "paper-choice-" + c.program + "-" + year + "-" + (form || "single"); el.dataset.paperYear = year; el.dataset.paperForm = form; el.dataset.studyState = state; el.disabled = document.body.classList.contains("is-original-exam-running");
        el.setAttribute("aria-pressed", String(c.year === year && c.form === form));
        const name = document.createElement("strong"), status = document.createElement("span"); name.textContent = label; status.textContent = states[state]; el.append(name, status);
        if (state === "complete") { const badge = document.createElement("span"); badge.className = "paper-complete-badge"; badge.textContent = lang.startsWith("en") ? "✓ Completed" : lang.startsWith("zh") ? "✓ 已完成" : "✓ 완료"; el.append(badge); }
        const ownResult = progress.resultFor(c.program, year, form);
        const savedAttempt = saved.map(function (record) { return window.GFIELDPaperScoreRange.attemptFromDiagnostic(record, library); }).find(Boolean);
        const score = ownResult || savedAttempt;
        const gradeLine = document.createElement("span"); gradeLine.className = "paper-grade";
        const isEnglish = lang.startsWith("en"), isChinese = lang.startsWith("zh");
        const gradeTitle = isEnglish ? "Score band" : isChinese ? "分数等级" : "점수 등급";
        if (score) {
          const number = document.createElement("span"); number.className = "paper-choice-score"; number.textContent = `${score.points} / ${score.max}`; el.append(number);
          const dataset = c.program === "aime" ? window.GFIELDAimeScoreDistributionReference : window.GFIELDAMCScoreDistributionReference;
          const reference = dataset && (c.program === "aime" ? dataset.referenceFor(year, form) : dataset.referenceFor(c.program, year, form));
          const interval = reference && window.GFIELDPaperScoreRange.intervalFor(score.points, score.max, reference, dataset.bands);
          let band = isEnglish ? "Data pending" : isChinese ? "资料准备中" : "자료 준비 중";
          if (interval && interval.id === "below") band = isEnglish ? "Below published score cutoff" : isChinese ? "低于已公布的分数线" : "공개 기준 점수 미만";
          else if (interval && interval.labels.length) {
            const match = /상위\s*([0-9.]+)%/.exec(interval.labels[0]);
            band = match ? isEnglish ? `Top ${match[1]}% score band` : isChinese ? `前${match[1]}%分数区间` : `상위 ${match[1]}% 점수 구간` : window.GFIELDContentI18n.text(interval.labels[0]);
          }
          gradeLine.textContent = gradeTitle + " · " + band;
        } else gradeLine.textContent = gradeTitle + " · " + (state === "complete" ? isEnglish ? "Data pending" : isChinese ? "资料准备中" : "자료 준비 중" : isEnglish ? "After the test" : isChinese ? "应试后显示" : "응시 후 표시");
        el.append(gradeLine);
        el.addEventListener("click", function () { selectPaper(year, form, true); }); row.append(el);
      });
      papers.append(group);
    });
    if (focusedId && /^(?:review-program-|paper-choice-)/.test(focusedId)) { const focus = document.getElementById(focusedId); if (focus) focus.focus({ preventScroll: true }); }
  }
  document.addEventListener("gfield:paper-marks-ready", render);
  document.addEventListener("gfield:paper-study-result", function (event) { if (event.detail.complete) mark("complete", event.detail.score); else mark("started"); });
  document.getElementById("paper-mark-list").addEventListener("input", function () { mark("started"); });
  document.getElementById("paper-mark-list").addEventListener("change", function () { mark("started"); });
  document.getElementById("book-open").addEventListener("click", function () { mark("started"); });
  window.addEventListener("storage", render);
  let renderedLanguage = document.documentElement.lang;
  new MutationObserver(function () { if (renderedLanguage !== document.documentElement.lang) { renderedLanguage = document.documentElement.lang; render(); } }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  window.GFIELDPaperChoiceButtons = Object.freeze({ render: render, selectPaper: selectPaper });
  render();
})();
