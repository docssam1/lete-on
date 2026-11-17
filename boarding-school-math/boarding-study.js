(function () {
  "use strict";
  const model = window.GFIELDStudyPlan;
  const language = window.GFIELDStudyLocale;
  const t = language.text;
  const library = window.GFIELDAMCOriginalPaperLibrary;
  const $ = function (id) { return document.getElementById(id); };
  const catalog = new Map();
  const params = new URLSearchParams(location.search);
  const initialGrade = Number(params.get("grade")) || 7;
  const grade = initialGrade === 6 ? 6 : 7;
  const programNames = { amc8: "AMC 8", amc10: "AMC 10", amc12: "AMC 12", aime: "AIME", kangaroo: "매쓰 캥거루" };
  const practiceGrades = { amc8: 7, amc10: 8, amc12: 10, aime: 8 };
  const units = {
    6: [["6.NS.A", "분수의 나눗셈"], ["6.NS.B", "소수와 계산"], ["6.NS.C", "음수와 좌표"], ["6.RP.A", "비와 비율"], ["6.EE.A", "문자와 식"], ["6.EE.B", "방정식과 부등식"], ["6.EE.C", "두 양의 관계"], ["6.G.A", "도형과 넓이"], ["6.SP.A", "자료 읽기"], ["6.SP.B", "자료 요약"]],
    7: [["7.NS.A", "유리수의 연산"], ["7.RP.A", "비례 관계"]]
  };
  const topics = [["algebra", "식과 대수"], ["number", "수와 정수론"], ["geometry", "기하"], ["counting", "경우의 수"]];
  function register(item) { catalog.set(item.id, item); }
  Object.entries(units).forEach(function (entry) {
    entry[1].forEach(function (unit) {
      register({ id: unit[0], kind: "curriculum", grade: Number(entry[0]), title: unit[1], label: "교과 · Grade " + entry[0], description: "개념과 단원 연습", href: "./unit-workbook.html?cluster=" + unit[0] + "&mode=workbook&audience=student&locale=ko&paper=A4" });
    });
  });
  [["algebra1", "Algebra 1"], ["algebra2", "Algebra 2"], ["geometry", "Geometry"], ["precalculus", "Precalculus"]].forEach(function (course) {
    register({ id: course[0], kind: "curriculum", grade: "course", title: course[1], label: "교과 · 과정별", description: "지필드 개념 수업과 단원 연습", href: "./" + course[0] + "-workbook.html?edition=student" });
  });
  Object.keys(practiceGrades).forEach(function (program) {
    const archive = library.archiveFor(program);
    register({ id: program, kind: "contest", program: program, title: programNames[program] + " 기출", label: "경시 기출", description: "연도와 회차 고르기", href: "./competition-paper-review.html?grade=" + practiceGrades[program] + "&program=" + program });
    archive.years.forEach(function (year) {
      library.formsFor(program, year).forEach(function (form) {
        register({ id: [program, year, form].filter(Boolean).join("-"), kind: "contest", program: program, year: year, form: form, title: programNames[program] + " · " + year + (form ? " " + form : ""), label: "경시 기출", description: "원본 시험지 · 답 입력 · 결과와 풀이", href: "./competition-paper-review.html?grade=" + practiceGrades[program] + "&program=" + program + "&year=" + year + "&form=" + form });
      });
    });
    const programTopics = topics.map(function (topic) {
      return topic[0] === "counting" && program === "amc8" ? ["counting", "경우의 수와 확률"] : topic;
    });
    if (program === "amc10") programTopics.push(["probability", "확률"]);
    if (program === "amc12") programTopics.push(["functions", "함수와 삼각함수"]);
    programTopics.forEach(function (topic) {
      register({ id: program + "-" + topic[0], kind: "topic", program: program, title: topic[1], label: programNames[program] + " · 주제 연습", description: "지필드 문제로 개념과 풀이 연습", href: "./" + (program === "amc8" ? "amc8-topic" : program) + "-practice.html?grade=" + practiceGrades[program] + "&domains=" + topic[0] });
    });
  });
  register({ id: "kangaroo", kind: "contest", program: "kangaroo", title: "매쓰 캥거루 · 지필드 연습", label: "경시 연습", description: "자체 문제로 유형 연습", href: "./competition-practice.html?program=kangaroo" });

  let plan;
  let storageAvailable = true;
  try { plan = model.load(localStorage, catalog); }
  catch (_error) {
    plan = model.clean(null, catalog);
    storageAvailable = false;
    $("study-status").textContent = t("저장한 목록을 읽을 수 없어요. 브라우저 저장 설정을 확인한 뒤 새로고침해 주세요.");
  }

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = t(text);
    if (className) node.className = className;
    return node;
  }
  function button(text, action, className) {
    const node = element("button", text, "study-button " + (className || ""));
    node.type = "button";
    node.addEventListener("click", action);
    return node;
  }
  function link(text, href, primary) {
    const node = element("a", text, "study-link" + (primary ? " study-primary" : ""));
    if (href.startsWith("#")) node.href = href;
    else {
      const url = new URL(href, location.href);
      url.searchParams.set("locale", language.current());
      node.href = url.href;
    }
    return node;
  }
  function save(change, message, focusId) {
    if (!storageAvailable) return false;
    try { plan = model.update(localStorage, catalog, change); }
    catch (_error) {
      $("study-status").textContent = t("목록을 저장하지 못했어요. 브라우저 저장 공간과 설정을 확인해 주세요.");
      return false;
    }
    render();
    $("study-status").textContent = t(message);
    if (focusId) {
      const target = document.getElementById(focusId);
      if (target) target.focus();
    }
    return true;
  }
  function add(id) {
    const item = catalog.get(id);
    save(function (state) {
      if (!state.items.includes(id)) state.items.push(id);
    }, item.title + "을 내 공부에 담았어요.", "study-add-" + id);
  }
  function openLink(item, text, primary) {
    const node = link(text, item.href + "&study=1&studyGrade=" + initialGrade, primary);
    node.addEventListener("click", function () {
      // Opening a resource records a visit, never a completion or a diagnostic result.
      save(function (state) { state.opened[item.id] = Date.now(); }, "");
    });
    return node;
  }
  function materialLanguage(item) {
    if (language.current() === "ko" || item.kind !== "curriculum" || typeof item.grade === "number") return null;
    return element("p", "수업·연습 화면은 한국어로 제공돼요.", "study-muted");
  }
  function renderCurrent() {
    const target = $("study-current");
    target.replaceChildren();
    const currentId = plan.items.includes(plan.active) ? plan.active : plan.items[0];
    const item = catalog.get(currentId);
    if (!item) {
      const empty = element("div", "", "study-empty");
      empty.append(element("h2", "무엇을 공부할까요?"), element("p", "교과 단원이나 관심 있는 대회부터 골라 보세요.", "study-muted"));
      const actions = element("div", "", "study-actions");
      actions.append(link("교과 고르기", "#study-add", true), link("경시 고르기", "#study-contests"));
      empty.append(actions);
      target.append(empty);
      return;
    }
    const scene = element("article", "", "study-scene");
    scene.append(element("span", item.label, "study-item-kind"), element("h2", item.title), element("p", item.description), openLink(item, plan.opened[item.id] ? "이어서 공부하기" : "공부 시작하기", true));
    if (["7.NS.A", "7.RP.A"].includes(item.id)) {
      const exam = item.id === "7.NS.A" ? "ns-a" : "rp-a";
      const actions = element("div", "", "study-actions");
      actions.append(link("단원 진단 풀기", "./grade7-" + exam + "-mock-exam.html"));
      scene.append(actions);

    }
    const languageNote = materialLanguage(item);
    if (languageNote) scene.append(languageNote);
    target.append(scene);
    const stops = element("ol", "", "study-stops");
    const last = Object.entries(plan.opened).filter(function (entry) { return entry[0] !== item.id; }).sort(function (a, b) { return b[1] - a[1]; })[0];
    const next = catalog.get(plan.items[plan.items.indexOf(currentId) + 1]);
    [["열어 본 공부", last ? catalog.get(last[0]).title : "아직 없어요"], ["지금 고른 공부", item.title], ["다음 공부", next ? next.title : "공부를 더 담아 보세요"]].forEach(function (entry) {
      const stop = element("li", entry[0]);
      stop.append(element("strong", entry[1]));
      stops.append(stop);
    });
    target.append(stops, link("학년별 보딩 로드맵 보기", "#grade-map"));
  }
  function renderQueue() {
    const queue = $("study-queue");
    queue.replaceChildren();
    $("study-queue-empty").hidden = plan.items.length > 0;
    plan.items.forEach(function (id, index) {
      const item = catalog.get(id);
      const row = element("li");
      row.append(element("span", item.label, "study-item-kind"));
      const choose = button(item.title, function () { save(function (state) { state.active = id; }, item.title + "을 골랐어요.", choose.id); }, "study-item-title");
      choose.id = "study-item-" + id;
      row.append(choose);
      const controls = element("div", "", "study-controls");
      const up = button("위로", function () {
        save(function (state) { model.move(state, id, -1); state.active = ""; }, item.title + "을 위로 옮겼어요.", choose.id);
      });
      up.setAttribute("aria-label", t(item.title + " 위로 옮기기"));
      up.disabled = index === 0 || !storageAvailable;
      const down = button("아래로", function () {
        save(function (state) { model.move(state, id, 1); state.active = ""; }, item.title + "을 아래로 옮겼어요.", choose.id);
      });
      down.setAttribute("aria-label", t(item.title + " 아래로 옮기기"));
      down.disabled = index === plan.items.length - 1 || !storageAvailable;
      const first = button("먼저 하기", function () {
        save(function (state) {
          state.active = "";
          state.items = [id].concat(state.items.filter(function (value) { return value !== id; }));
        }, item.title + "부터 공부해요.", choose.id);
      });
      first.disabled = index === 0 || !storageAvailable;
      const remove = button("빼기", function () {
        const nextFocus = plan.items[index + 1] || plan.items[index - 1];
        save(function (state) { state.items = state.items.filter(function (value) { return value !== id; }); }, item.title + "을 목록에서 뺐어요.", nextFocus ? "study-item-" + nextFocus : "study-kind");
      });
      remove.setAttribute("aria-label", t(item.title + " 목록에서 빼기"));
      remove.disabled = !storageAvailable;
      controls.append(up, down, first, remove);
      row.append(controls);
      queue.append(row);
    });
    const history = $("study-history");
    history.replaceChildren();
    Object.entries(plan.opened).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 20).forEach(function (entry) {
      const row = element("li");
      row.append(openLink(catalog.get(entry[0]), catalog.get(entry[0]).title));
      history.append(row);
    });
    if (!history.children.length) history.append(element("li", "학습 자료를 열면 여기에 남아요."));
  }
  function renderCatalog() {
    const kind = $("study-kind").value;
    const program = $("study-program").value;
    const archive = library.archiveFor(program);
    $("study-grade-field").hidden = kind !== "curriculum";
    $("study-program-field").hidden = kind === "curriculum";
    $("study-year-field").hidden = kind !== "contest" || !archive;
    $("study-form-field").hidden = kind !== "contest" || !archive || !$("study-form").value;
    let items = Array.from(catalog.values()).filter(function (item) {
      if (kind === "curriculum") return item.kind === kind && String(item.grade) === $("study-grade").value;
      if (kind === "topic") return item.kind === kind && item.program === program;
      return item.kind === kind && item.program === program && (!archive || !$("study-year").value ? !item.year : item.year === Number($("study-year").value) && item.form === $("study-form").value);
    });
    const target = $("study-catalog");
    target.replaceChildren();
    items.forEach(function (item) {
      const row = element("li");
      const copy = element("div");
      copy.append(element("strong", item.title), element("p", item.description, "study-muted"));
      const languageNote = materialLanguage(item);
      if (languageNote) copy.append(languageNote);
      const actions = element("div", "", "study-actions");
      const inPlan = plan.items.includes(item.id);
      const addButton = button(inPlan ? "담았어요 · 목록 보기" : "내 공부에 담기", function () {
        if (!inPlan) { add(item.id); return; }
        location.hash = "#my-study";
        $("study-item-" + item.id).focus();
      });
      addButton.id = "study-add-" + item.id;
      addButton.disabled = !storageAvailable;
      actions.append(openLink(item, "열기"), addButton);
      row.append(copy, actions);
      target.append(row);
    });
    if (!items.length) {
      const empty = element("li", "이 대회의 주제별 자료를 준비하고 있어요.", "study-muted");
      empty.append(openLink(catalog.get("kangaroo"), "매쓰 캥거루 연습 열기"));
      target.append(empty);
    }
  }
  function updateForms() {
    const program = $("study-program").value;
    const forms = library.formsFor(program, Number($("study-year").value));
    $("study-form").replaceChildren();
    forms.forEach(function (form) { $("study-form").append(new Option(form || t("단일 회차"), form)); });
  }
  function updateYears() {
    const archive = library.archiveFor($("study-program").value);
    $("study-year").replaceChildren(new Option(t("연도는 나중에 고르기"), ""));
    if (archive) archive.years.forEach(function (year) { $("study-year").append(new Option(language.current() === "ko" ? year + "년" : language.current() === "en" ? String(year) : year + "年", year)); });
    updateForms();
  }
  function render() { renderCurrent(); renderQueue(); renderCatalog(); }

  const main = $("main");
  const curriculumSections = Array.from(main.children).filter(function (node) {
    return node.id !== "my-study" && node.id !== "study-contests";
  });
  const picker = $("study-add");
  function showView() {
    const hash = location.hash;
    const home = !hash || ["#my-study", "#study-add"].includes(hash);
    const contests = hash === "#study-contests";
    $("my-study").hidden = !home;
    $("study-contests").hidden = !contests;
    curriculumSections.forEach(function (node) {
      node.toggleAttribute("data-study-hidden", home || contests);

    });
    if (contests) {
      $("study-contest-picker").append(picker);
      if ($("study-kind").value === "curriculum") {
        $("study-kind").value = "contest";
        renderCatalog();
      }
    } else {
      $("my-study").append(picker);
    }
    document.querySelectorAll("[data-study-view]").forEach(function (node) {
      const active = node.dataset.studyView === (home ? "home" : contests ? "contests" : "curriculum");
      if (active) node.setAttribute("aria-current", "page");
      else node.removeAttribute("aria-current");
    });
  }
  $("study-grade").value = String(grade);
  if (programNames[params.get("program")]) {
    $("study-program").value = params.get("program");
    $("study-kind").value = "contest";
  }
  $("study-kind").addEventListener("change", renderCatalog);
  $("study-grade").addEventListener("change", renderCatalog);
  $("study-program").addEventListener("change", function () { updateYears(); renderCatalog(); });
  $("study-year").addEventListener("change", function () { updateForms(); renderCatalog(); });
  $("study-form").addEventListener("change", renderCatalog);
  window.addEventListener("hashchange", showView);
  window.addEventListener("gfield-study-locale", function () {
    for (const option of $("study-year").options) {
      option.textContent = option.value ? language.current() === "ko" ? option.value + "년" : language.current() === "en" ? option.value : option.value + "年" : t("연도는 나중에 고르기");
    }
    if ($("study-form").options.length === 1 && !$("study-form").value) $("study-form").options[0].textContent = t("단일 회차");
    $("study-status").textContent = "";
    render();
    showView();
  });
  window.addEventListener("storage", function (event) {
    if (event.key !== model.key && event.key !== null) return;
    try { plan = model.load(localStorage, catalog); render(); }
    catch (_error) { $("study-status").textContent = t("목록을 다시 읽지 못했어요. 새로고침해 주세요."); }
  });
  updateYears();
  render();
  showView();
})();
