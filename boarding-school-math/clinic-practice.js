(function () {
  "use strict";

  const registry = window.GFIELDGrade6ClinicPacks;
  const paths = window.GFIELDClinicPaths;
  if (!registry || !paths) throw new Error("CLINIC_DEPENDENCY_MISSING");

  const supportedLocales = new Set(["ko", "en", "zh-Hans"]);
  const supportedModes = new Set(["workbook", "recheck"]);
  const supportedAudiences = new Set(["student", "teacher"]);
  const query = new URLSearchParams(window.location.search);
  const state = {
    cluster: query.get("cluster") || "6.RP.A",
    locale: supportedLocales.has(query.get("locale")) ? query.get("locale") : "ko",
    mode: supportedModes.has(query.get("mode")) ? query.get("mode") : "workbook",
    audience: supportedAudiences.has(query.get("audience")) ? query.get("audience") : "student",
    attempts: new Map(),
    correct: new Set(),
    revealed: new Set()
  };
  const source = registry.forCluster(state.cluster);
  source.validatePack();

  const COPY = {
    ko: {
      titleLead: "비와 비율을", titleAccent: "설명하고 적용하기.", navDiagnostic: "진단·분석·처방", navConcept: "개념 학습", navAnimated: "시각 강의",
      trailAnalysis: "01 분석", trailConcept: "02 개념", trailAnimated: "03 시각 강의", footerBack: "6.RP.A 개념으로 돌아가기", footerNote: "GFIELD 자체 제작 · 공개 Grade 6 클리닉",
      hero: "같은 비, 단위율, 부분과 전체, 퍼센트를 순서대로 연습하고 다른 문항으로 다시 확인합니다.",
      student: "학생용 · 클리닉", teacher: "교사용 · 공개 예시", workbook: "워크북", recheck: "재확인",
      proofWorkbook: "워크북", proofRecheck: "재확인", proofStrands: "핵심 영역",
      intro: "개념 먼저 확인", worked: "완전 풀이 예시", check: "확인", answerPlaceholder: "답 입력", correct: "맞았습니다. 설명할 수 있으면 다음 문항으로 가세요.",
      wrong: "아직 아닙니다. 힌트를 읽고 다시 시도하세요.", hint: "힌트", showSolution: "단계별 풀이 보기", solution: "풀이",
      progress: "정답 확인", completeTitle: "워크북을 모두 정확히 풀었습니다.", completeBody: "이제 같은 구조의 새 문항 4개로 다시 확인할 수 있습니다.", goRecheck: "재확인 시작 →",
      lockedTitle: "재확인은 워크북 완료 뒤 열립니다.", lockedBody: "12문항을 직접 풀고 모두 정답으로 확인하면 이 화면에서 자동으로 열립니다.", goWorkbook: "워크북 풀기 →",
      publicTeacher: "PUBLIC TEACHER SAMPLE · 공개 교사용 예시", teacherNote: "정답·풀이·오개념 관찰 포인트가 포함됩니다. 학생 계정이나 실제 성적을 저장하지 않습니다.",
      teacherAnswer: "정답", teacherMove: "지도 질문", resultTitle: "재확인 결과", resultBody: "이 결과는 6.RP.A 전체 숙달이나 승급 판정이 아니라 네 가지 핵심 구조의 학습 확인입니다.",
      strength: "확인됨", review: "다시 보기", print: "인쇄 · PDF", sectionCount: "문항", allCorrect: "모두 정확"
    },
    en: {
      titleLead: "Ratios, rates, and percent.", titleAccent: "Explain. Apply. Transfer.", navDiagnostic: "Diagnosis", navConcept: "Concept lesson", navAnimated: "Visual lesson",
      trailAnalysis: "01 Analysis", trailConcept: "02 Concept", trailAnimated: "03 Visual lesson", footerBack: "Back to the 6.RP.A concept", footerNote: "GFIELD original · Public Grade 6 clinic",
      hero: "Practice equivalent ratios, unit rates, part-whole reasoning, and percent, then recheck with new items.",
      student: "STUDENT · CLINIC", teacher: "TEACHER · PUBLIC SAMPLE", workbook: "Workbook", recheck: "Recheck",
      proofWorkbook: "Workbook", proofRecheck: "Recheck", proofStrands: "Strands",
      intro: "Review the concept first", worked: "Fully worked example", check: "Check", answerPlaceholder: "Enter answer", correct: "Correct. Explain why, then continue.",
      wrong: "Not yet. Read the hint and try again.", hint: "Hint", showSolution: "Show step-by-step solution", solution: "Solution",
      progress: "Answers checked", completeTitle: "You completed every workbook item accurately.", completeBody: "You can now recheck the four structures with new items.", goRecheck: "Start recheck →",
      lockedTitle: "The recheck opens after the workbook.", lockedBody: "Solve all 12 items and check every answer to unlock it on this device.", goWorkbook: "Open workbook →",
      publicTeacher: "PUBLIC TEACHER SAMPLE", teacherNote: "Includes answers, solution structures, and misconception prompts. No student identity or real score is stored.",
      teacherAnswer: "Answer", teacherMove: "Teaching move", resultTitle: "Recheck result", resultBody: "This is a learning check of four core structures, not a full 6.RP.A mastery or promotion decision.",
      strength: "Confirmed", review: "Review", print: "Print · PDF", sectionCount: "items", allCorrect: "all accurate"
    },
    "zh-Hans": {
      titleLead: "比、比率与百分数。", titleAccent: "理解、应用、迁移。", navDiagnostic: "诊断·分析·处方", navConcept: "概念学习", navAnimated: "可视化课程",
      trailAnalysis: "01 分析", trailConcept: "02 概念", trailAnimated: "03 可视化课程", footerBack: "返回6.RP.A概念", footerNote: "GFIELD原创 · 公开六年级专项练习",
      hero: "依次练习相等比、单位率、部分与整体、百分数，再用新题复测。",
      student: "学生版 · 专项练习", teacher: "教师版 · 公开示例", workbook: "练习册", recheck: "复测",
      proofWorkbook: "练习册", proofRecheck: "复测", proofStrands: "核心领域",
      intro: "先复习概念", worked: "完整例题", check: "检查", answerPlaceholder: "输入答案", correct: "正确。请说明理由后继续。",
      wrong: "还不正确。阅读提示后再试一次。", hint: "提示", showSolution: "查看分步解答", solution: "解答",
      progress: "已检查", completeTitle: "练习册全部答对。", completeBody: "现在可以用4道新题复测四种结构。", goRecheck: "开始复测 →",
      lockedTitle: "完成练习册后开放复测。", lockedBody: "完成12道题并逐题检查正确后，本设备将自动解锁。", goWorkbook: "打开练习册 →",
      publicTeacher: "PUBLIC TEACHER SAMPLE · 公开教师示例", teacherNote: "包含答案、解题结构与常见错误提示，不保存学生身份或真实成绩。",
      teacherAnswer: "答案", teacherMove: "教学提问", resultTitle: "复测结果", resultBody: "本结果只检查四种核心结构，不代表6.RP.A全部掌握或晋级判定。",
      strength: "已确认", review: "需复习", print: "打印 · PDF", sectionCount: "题", allCorrect: "全部正确"
    }
  };

  const SECTION_ORDER = ["equivalent", "rates", "applications", "recheck"];
  const SECTION_LABELS = {
    equivalent: { ko: "1 · 같은 비와 부분-전체", en: "1 · Equivalent ratios and part-whole", "zh-Hans": "1 · 相等比与部分整体" },
    rates: { ko: "2 · 단위율과 비례값", en: "2 · Unit rates and proportional values", "zh-Hans": "2 · 单位率与比例值" },
    applications: { ko: "3 · 퍼센트와 단위 변환", en: "3 · Percent and conversions", "zh-Hans": "3 · 百分数与单位换算" },
    recheck: { ko: "새 문항 · 4영역 재확인", en: "New items · Four-strand recheck", "zh-Hans": "新题 · 四领域复测" }
  };

  function text(value) { return value && (value[state.locale] || value.en || value.ko) || ""; }
  function copy() { return COPY[state.locale]; }
  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value != null) node.textContent = value;
    return node;
  }
  function workbookComplete() {
    try { return window.localStorage.getItem(paths.completionKey(state.cluster)) === "complete-v1"; }
    catch (error) { return false; }
  }
  function markWorkbookComplete() {
    try { window.localStorage.setItem(paths.completionKey(state.cluster), "complete-v1"); }
    catch (error) { /* completion remains available for this page session */ }
  }
  function setUrl(next) {
    Object.assign(state, next);
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("cluster", state.cluster);
    url.searchParams.set("mode", state.mode);
    url.searchParams.set("audience", state.audience);
    url.searchParams.set("locale", state.locale);
    window.history.replaceState({}, "", url);
  }
  function resetAttemptState() {
    state.attempts.clear(); state.correct.clear(); state.revealed.clear();
  }

  function renderChrome() {
    const c = copy();
    document.documentElement.lang = state.locale;
    document.title = text(source.pack.title) + " · GFIELD Math";
    document.getElementById("hero-eyebrow").textContent = "GRADE 6 · " + state.cluster + " CLINIC";
    document.getElementById("hero-title-lead").textContent = text(source.pack.ui.titleLead);
    document.getElementById("hero-title-accent").textContent = text(source.pack.ui.titleAccent);
    document.getElementById("hero-copy").textContent = text(source.pack.ui.hero);
    document.getElementById("scope-note").textContent = text(source.pack.scopeNotice);
    document.getElementById("role-chip").textContent = state.audience === "teacher" ? c.teacher : c.student;
    document.getElementById("proof-workbook-label").textContent = c.proofWorkbook;
    document.getElementById("proof-recheck-label").textContent = c.proofRecheck;
    document.getElementById("proof-strands-label").textContent = c.proofStrands;
    document.getElementById("proof-workbook-count").textContent = source.pack.workbookItems.length;
    document.getElementById("proof-recheck-count").textContent = source.pack.recheckItems.length;
    document.getElementById("proof-strands-count").textContent = new Set(source.pack.recheckItems.map(function (item) { return item.strand; })).size;
    document.getElementById("print-page").textContent = c.print;
    document.getElementById("nav-diagnostic").textContent = c.navDiagnostic;
    document.getElementById("nav-concept").textContent = c.navConcept;
    document.getElementById("nav-concept").href = paths.conceptUrl(state.cluster, true);
    document.getElementById("nav-animated").textContent = c.navAnimated;
    const animatedRoute = paths.routeFor(state.cluster, { fromDiagnostic: true, workbookCompleted: workbookComplete() }).animated;
    document.getElementById("nav-animated").href = animatedRoute.url.replace(/locale=[^&]+/, "locale=" + state.locale);
    document.getElementById("trail-analysis").textContent = c.trailAnalysis;
    document.getElementById("trail-concept").textContent = c.trailConcept;
    document.getElementById("trail-concept").href = paths.conceptUrl(state.cluster, true);
    document.getElementById("trail-animated").textContent = c.trailAnimated;
    document.getElementById("trail-animated").href = document.getElementById("nav-animated").href;
    document.getElementById("footer-back").textContent = state.locale === "ko" ? state.cluster + " 개념으로 돌아가기" : (state.locale === "zh-Hans" ? "返回" + state.cluster + "概念" : "Back to the " + state.cluster + " concept");
    document.getElementById("footer-back").href = paths.conceptUrl(state.cluster, true);
    document.getElementById("footer-note").textContent = c.footerNote;
    document.getElementById("locale-select").value = state.locale;
    document.querySelector('[data-audience="student"]').textContent = c.student.split(" · ")[0];
    document.querySelector('[data-audience="teacher"]').textContent = c.teacher.split(" · ")[0];
    document.querySelector('[data-audience="teacher"]').hidden = state.audience !== "teacher";
    document.querySelector('[data-mode="workbook"]').textContent = c.workbook + " " + source.pack.workbookItems.length;
    document.querySelector('[data-mode="recheck"]').textContent = c.recheck + " " + source.pack.recheckItems.length;
    document.querySelectorAll("[data-audience]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.audience === state.audience)); });
    document.querySelectorAll("[data-mode]").forEach(function (button) { button.setAttribute("aria-pressed", String(button.dataset.mode === state.mode)); });
    document.getElementById("trail-current").textContent = "04 " + c.workbook;
    document.getElementById("trail-recheck").textContent = "05 " + c.recheck;
  }

  function renderIntro() {
    const c = copy();
    const card = el("section", "intro-card");
    const concept = el("div", "concept-copy");
    concept.append(el("p", "eyebrow", c.intro), el("h2", "", text(source.pack.title)), el("p", "", text(source.pack.conceptSummary)));
    const example = el("aside", "worked-example");
    example.append(el("span", "eyebrow", c.worked), el("strong", "", text(source.pack.workedExample.title)), el("p", "", text(source.pack.workedExample.prompt)));
    const list = el("ol");
    source.pack.workedExample.steps.forEach(function (step) { list.append(el("li", "", text(step))); });
    example.append(list);
    card.append(concept, example);
    return card;
  }

  function renderTeacherGuide() {
    const c = copy();
    const card = el("section", "teacher-guide");
    card.append(el("p", "eyebrow", c.publicTeacher), el("h2", "", c.teacherNote));
    const grid = el("div", "teacher-guide-grid");
    Object.keys(source.pack.errorGuides).forEach(function (code) {
      const guide = source.pack.errorGuides[code];
      const article = el("article");
      article.append(el("strong", "", text(guide.label)), el("p", "", text(guide.prompt)));
      grid.append(article);
    });
    card.append(grid);
    return card;
  }

  function answerSuffix(item) { const unit = text(item.unit); return unit ? " " + unit : ""; }
  function renderProblem(item, index) {
    const c = copy();
    const card = el("article", "problem-card");
    card.dataset.itemId = item.id;
    const meta = el("div", "problem-meta");
    meta.append(el("span", "", String(index + 1).padStart(2, "0")), el("span", "", text(source.pack.strands[item.strand])));
    card.append(meta, el("p", "problem-prompt", text(item.prompt)));

    if (state.audience === "teacher") {
      const answer = el("div", "teacher-answer");
      answer.append(el("strong", "", c.teacherAnswer + " · " + source.formatResult(item) + answerSuffix(item)), el("span", "", source.solutionFor(item, state.locale)));
      const guide = source.pack.errorGuides[item.errorCode];
      const move = el("div", "teacher-answer");
      move.append(el("strong", "", c.teacherMove + " · " + text(guide.label)), el("span", "", text(guide.prompt)));
      card.append(answer, move);
      return card;
    }

    const row = el("div", "response-row");
    const input = el("input");
    input.type = "text"; input.inputMode = item.responseFormat === "ratio-pair" ? "text" : "decimal";
    input.placeholder = c.answerPlaceholder; input.setAttribute("aria-label", String(index + 1) + " " + c.answerPlaceholder);
    input.autocomplete = "off"; input.spellcheck = false;
    const button = el("button", "", c.check); button.type = "button";
    const feedback = el("p", "feedback"); feedback.setAttribute("aria-live", "polite");
    row.append(input, button); card.append(row, feedback);

    button.addEventListener("click", function () {
      if (!input.value.trim()) { feedback.className = "feedback is-wrong"; feedback.textContent = c.answerPlaceholder; input.focus(); return; }
      const attempt = (state.attempts.get(item.id) || 0) + 1;
      state.attempts.set(item.id, attempt);
      if (source.evaluateResponse(item, input.value)) {
        state.correct.add(item.id); card.classList.add("is-correct");
        feedback.className = "feedback is-correct"; feedback.textContent = c.correct;
        input.disabled = true; button.disabled = true;
        card.querySelectorAll(".hint-box,.solution-toggle,.solution-box").forEach(function (node) { node.remove(); });
        updateProgress();
        return;
      }
      feedback.className = "feedback is-wrong"; feedback.textContent = c.wrong;
      if (!card.querySelector(".hint-box")) {
        const hint = el("div", "hint-box"); hint.append(el("strong", "", c.hint + " · "), document.createTextNode(source.hintFor(item, state.locale)));
        const reveal = el("button", "solution-toggle", c.showSolution); reveal.type = "button";
        reveal.addEventListener("click", function () {
          if (state.revealed.has(item.id)) return;
          state.revealed.add(item.id);
          const solution = el("div", "solution-box");
          solution.append(el("strong", "", c.solution + " · "), document.createTextNode(source.solutionFor(item, state.locale)));
          reveal.after(solution); reveal.remove();
        });
        card.append(hint, reveal);
      }
    });
    input.addEventListener("keydown", function (event) { if (event.key === "Enter") button.click(); });
    return card;
  }

  function renderSection(section, items, offset) {
    const c = copy();
    const wrap = el("section", "practice-section");
    const heading = el("header", "section-heading");
    heading.append(el("h2", "", text(source.pack.ui.sectionLabels[section])), el("span", "", items.length + " " + c.sectionCount));
    const grid = el("div", "problem-grid");
    items.forEach(function (item, index) { grid.append(renderProblem(item, offset + index)); });
    wrap.append(heading, grid);
    return wrap;
  }

  function updateProgress() {
    const items = state.mode === "recheck" ? source.pack.recheckItems : source.pack.workbookItems;
    const node = document.getElementById("progress-summary");
    if (node) node.lastElementChild.textContent = state.correct.size + " / " + items.length;
    if (state.correct.size !== items.length) return;
    if (state.mode === "workbook") markWorkbookComplete();
    const completion = document.getElementById("completion-card");
    if (!completion) return;
    completion.hidden = false;
    if (state.mode === "recheck") renderRecheckResult(completion);
  }

  function renderRecheckResult(container) {
    const c = copy();
    const resultBody = state.locale === "ko" ? "이 결과는 " + state.cluster + " 전체 숙달이나 승급 판정이 아니라 네 가지 핵심 구조의 학습 확인입니다." : (state.locale === "zh-Hans" ? "本结果只检查四种核心结构，不代表" + state.cluster + "全部掌握或晋级判定。" : "This is a learning check of four core structures, not a full " + state.cluster + " mastery or promotion decision.");
    container.replaceChildren(el("p", "eyebrow", c.resultTitle), el("h2", "", c.allCorrect), el("p", "", resultBody));
    const grid = el("div", "result-grid");
    source.pack.recheckItems.forEach(function (item) {
      const result = el("div");
      result.append(el("strong", "", text(source.pack.strands[item.strand])), el("span", "", state.correct.has(item.id) ? c.strength : c.review));
      grid.append(result);
    });
    container.append(grid);
  }

  function renderLocked() {
    const c = copy();
    const card = el("section", "lock-card");
    card.append(el("p", "eyebrow", state.cluster + " · " + c.recheck), el("h2", "", c.lockedTitle), el("p", "", c.lockedBody));
    const link = el("a", "primary-action", c.goWorkbook);
    link.href = paths.workbookUrl(state.cluster, "workbook", "student", state.locale);
    card.append(link);
    return card;
  }

  function renderPractice() {
    const host = document.getElementById("clinic-content");
    host.replaceChildren();
    if (state.mode === "recheck" && state.audience === "student" && !workbookComplete()) { host.append(renderLocked()); return; }
    if (state.audience === "teacher") host.append(renderTeacherGuide());
    host.append(renderIntro());
    const items = state.mode === "recheck" ? source.pack.recheckItems : source.pack.workbookItems;
    let offset = 0;
    source.pack.ui.sectionOrder.forEach(function (section) {
      const selected = items.filter(function (item) { return item.section === section; });
      if (!selected.length) return;
      host.append(renderSection(section, selected, offset)); offset += selected.length;
    });
    if (state.audience === "student") {
      const progress = el("div", "progress-summary"); progress.id = "progress-summary";
      progress.append(el("strong", "", copy().progress), el("span", "", "0 / " + items.length));
      const completion = el("section", "completion-card"); completion.id = "completion-card"; completion.hidden = true;
      if (state.mode === "workbook") {
        completion.append(el("h2", "", copy().completeTitle), el("p", "", copy().completeBody));
        const link = el("a", "primary-action", copy().goRecheck);
        link.href = paths.workbookUrl(state.cluster, "recheck", "student", state.locale);
        completion.append(link);
      }
      host.append(progress, completion);
    }
  }

  function rerender(next) { setUrl(next); resetAttemptState(); renderChrome(); renderPractice(); document.getElementById("clinic-content").focus({ preventScroll: true }); }
  document.querySelectorAll("[data-audience]").forEach(function (button) { button.addEventListener("click", function () { rerender({ audience: button.dataset.audience }); }); });
  document.querySelectorAll("[data-mode]").forEach(function (button) { button.addEventListener("click", function () { rerender({ mode: button.dataset.mode }); }); });
  document.getElementById("locale-select").addEventListener("change", function (event) { rerender({ locale: event.target.value }); });
  document.getElementById("print-page").addEventListener("click", function () { window.print(); });
  renderChrome(); renderPractice();
})();
