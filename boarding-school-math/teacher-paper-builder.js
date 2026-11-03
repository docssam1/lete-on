(function () {
  "use strict";
  const $ = function (id) { return document.getElementById(id); };
  function setMathText(target, value) {
    target.replaceChildren();
    if (window.GFIELDMathText) window.GFIELDMathText.append(target, value);
    else target.textContent = value;
  }
  const apis = [
    window.GFIELDGrade6RPAUnitWorkbook, window.GFIELDGrade6NSAUnitWorkbook,
    window.GFIELDGrade6NSBUnitWorkbook, window.GFIELDGrade6NSCUnitWorkbook,
    window.GFIELDGrade6EEAUnitWorkbook, window.GFIELDGrade6EEBUnitWorkbook,
    window.GFIELDGrade6EECUnitWorkbook, window.GFIELDGrade6GAUnitWorkbook,
    window.GFIELDGrade6SPAUnitWorkbook, window.GFIELDGrade6SPBUnitWorkbook,
    window.GFIELDGrade7RPAUnitWorkbook, window.GFIELDGrade7NSAUnitWorkbook
  ];
  const eligibleSource = function (api) {
    const pack = api && api.pack;
    return !!(pack && pack.contentOrigin === "gfield-original-authored-public-unit-workbook" &&
      pack.rights && pack.rights.publication === "public" && pack.rights.assetRights === "original" &&
      pack.rights.containsThirdPartyAssets === false && Array.isArray(pack.workbookItems) &&
      pack.workbookItems.length === 36 && typeof api.renderVisual === "function" &&
      typeof api.solveItem === "function" && typeof api.solutionFor === "function" &&
      pack.workbookItems.every(function (item) {
        try {
          const result = api.solveItem(item);
          if (!String(api.solutionFor(item, "ko") || "").trim()) return false;
          return Array.isArray(item.choices)
            ? item.choices.some(function (choice) { return choice.id === result; })
            : typeof api.formatResult === "function" && !!String(api.formatResult(item) || "").trim();
        } catch (_error) { return false; }
      }));
  };
  if (!apis.every(eligibleSource)) { $("builder-message").textContent = "워크북 문항을 확인할 수 없습니다. 자료를 다시 불러오세요."; return; }
  const sources = apis.map(function (api) {
    const pack = api.pack;
    const source = { api: api, pack: pack, cluster: pack.clusterId, grade: Number(pack.clusterId.split(".")[0]), kind: "workbook" };
    source.label = pack.title.ko.replace(new RegExp(`^${pack.clusterId.replaceAll(".", "\\.")}\\s*`), "").replace(/ 단원 워크북$/, "");
    source.records = pack.workbookItems.map(function (item, index) {
      return { id: `${pack.clusterId}:${item.id}`, item: item, source: source, number: index + 1 };
    });
    return source;
  });
  const algebraCourse = window.GFIELDAlgebra1Course;
  if (algebraCourse && Array.isArray(algebraCourse.units)) {
    algebraCourse.units.forEach(function (unit, unitIndex) {
      const strands = Object.create(null);
      const workbookItems = [];
      (unit.lessons || []).forEach(function (lesson, lessonIndex) {
        const strandId = `lesson-${lessonIndex + 1}`;
        strands[strandId] = { ko: lesson.title };
        (lesson.practice || []).forEach(function (practice, practiceIndex) {
          workbookItems.push({ id: `${unit.id}-${lessonIndex + 1}-${practiceIndex + 1}`, prompt: { ko: practice.prompt }, question: { ko: lesson.title }, standardIds: [], strand: strandId, level: "lesson", answer: practice.answer, explanation: practice.feedback });
        });
      });
      const pack = { clusterId: `GFIELD-A1-U${unitIndex + 1}`, title: { ko: `Algebra 1 · ${unit.title}` }, strands: strands, workbookItems: workbookItems };
      const api = { pack: pack, renderVisual: function () { return ""; }, formatResult: function (item) { return item.answer; }, solutionFor: function (item) { return item.explanation; } };
      const source = { api: api, pack: pack, cluster: pack.clusterId, grade: 7, kind: "algebra1", label: unit.title, unitIndex: unitIndex + 1 };
      source.records = workbookItems.map(function (item, index) { return { id: `${pack.clusterId}:${item.id}`, item: item, source: source, number: index + 1 }; });
      sources.push(source);
    });
  }
  const records = sources.flatMap(function (source) { return source.records; });
  const publicWorkbookCount = sources.filter(function (source) { return source.kind === "workbook"; }).reduce(function (sum, source) { return sum + source.records.length; }, 0);
  const algebra1Count = sources.filter(function (source) { return source.kind === "algebra1"; }).reduce(function (sum, source) { return sum + source.records.length; }, 0);
  const byId = new Map(records.map(function (record) { return [record.id, record]; }));
  const levelName = { foundation: "기초", core: "기본", advanced: "심화", lesson: "수업 연습" };
  const selected = [];
  const maxItems = records.length;
  let paperSettingsInView = false;
  let activeSource = sources.find(function (source) { return source.cluster === "7.RP.A"; });
  let strand = "all";
  let previewId = activeSource.records[0].id;
  let defaultTitle = "Grade 7 비례관계 확인 평가";
  let defaultCourse = "Grade 7 · 비례관계";
  function outputKind() { return document.querySelector('input[name="output-kind"]:checked').value; }

  function itemNumber(record) { return record.number; }
  function strandName(record) {
    const label = record.source.pack.strands[record.item.strand];
    return (label ? label.ko : record.item.strand).replace(/^\d+ · /, "");
  }
  function sourceLabel(record) { return record.source.kind === "algebra1" ? `Algebra 1 ${record.source.unitIndex}.${record.number}` : `${record.source.cluster} ${record.number}번`; }
  function paperSourceLabel(source) { return source.kind === "algebra1" ? `GFIELD Algebra 1 · 단원 ${String(source.unitIndex).padStart(2, "0")}` : source.cluster; }
  function itemContextLabel(record) { return record.source.kind === "algebra1" ? `${record.source.label} · ${strandName(record)} · 지필드 수업 연습` : `${record.item.standardIds.join(", ")} · ${strandName(record)}`; }
  function message(value) { $("builder-message").textContent = value; }
  function updateMobileBuilderAction() {
    const mobileAction = $("mobile-builder-action");
    mobileAction.hidden = selected.length === 0 || paperSettingsInView;
    mobileAction.textContent = `시험지 편집 · ${selected.length}문항`;
    mobileAction.setAttribute("aria-label", `담은 문제 ${selected.length}개 편집하기`);
    document.body.classList.toggle("has-mobile-builder-action", !mobileAction.hidden);
  }
  function refreshDefaultFields() {
    const chosen = [...new Set(selected.map(function (entry) { return byId.get(entry.id).source; }))];
    const source = chosen.length === 1 ? chosen[0] : activeSource;
    const gradeLabel = [...new Set(chosen.map(function (entry) { return entry.grade; }))].sort().join("–");
    const title = chosen.length > 1 ? `Grade ${gradeLabel} 단원 확인 평가` : source.kind === "algebra1" ? `Algebra 1 · ${source.label} 확인 평가` : `Grade ${source.grade} ${source.label} 확인 평가`;
    const course = chosen.length > 1 ? `Grade ${gradeLabel} · ${chosen.length}개 단원` : source.kind === "algebra1" ? `GFIELD Algebra 1 · ${source.label}` : `Grade ${source.grade} · ${source.label}`;
    if ($("paper-title").value === defaultTitle) $("paper-title").value = title;
    if ($("paper-course").value === defaultCourse) $("paper-course").value = course;
    defaultTitle = title; defaultCourse = course;
  }
  function visibleItems() {
    const query = $("item-search").value.trim().toLocaleLowerCase("ko");
    const level = $("level-filter").value;
    return activeSource.records.filter(function (record) {
      const item = record.item;
      return (strand === "all" || item.strand === strand) && (level === "all" || item.level === level) &&
        (!query || `${item.prompt.ko} ${item.question?.ko || ""} ${strandName(record)} ${item.standardIds.join(" ")}`.toLocaleLowerCase("ko").includes(query));
    });
  }
  function renderUnits() {
    const host = $("unit-filter"); host.replaceChildren();
    sources.filter(function (source) { return source.grade === Number($("grade-filter").value); }).forEach(function (source) {
      const option = document.createElement("option"); option.value = source.cluster;
      option.textContent = source.kind === "algebra1" ? `GFIELD Algebra 1 · ${source.unitIndex}. ${source.label}` : `${source.cluster} · ${source.label}${source.cluster === "7.NS.A" ? " · 검수 시안" : ""}`;
      host.append(option);
    });
    host.value = activeSource.cluster;
    const levelLabel = document.querySelector('label[for="level-filter"]');
    const levelSelect = $("level-filter");
    if (activeSource.kind === "algebra1") {
      levelLabel.firstChild.textContent = "자료 유형";
      levelSelect.replaceChildren(new Option("전체", "all"), new Option("수업 연습", "lesson"));
    } else {
      levelLabel.firstChild.textContent = "수준";
      levelSelect.replaceChildren(new Option("전체", "all"), new Option("기초", "foundation"), new Option("기본", "core"), new Option("심화", "advanced"));
    }
    $("inventory-count").textContent = activeSource.kind === "algebra1" ? `이 단원 ${activeSource.records.length}문항 · 전체 자체 제작 ${algebra1Count}문항` : `공개 워크북 ${publicWorkbookCount}문항 · Algebra 1 ${algebra1Count}문항`;
    $("source-note").textContent = activeSource.kind === "algebra1" ? "지필드 Algebra 1 수업에서 만든 연습 문제입니다. 문제지와 정답지는 따로 구성해요." : "공개 단원 워크북 문항입니다. 7.NS.A는 검수 시안이며, 비공개 진단 문항은 포함하지 않아요.";
  }
  function selectSource(cluster) {
    const next = sources.find(function (source) { return source.cluster === cluster; });
    if (!next) return;
    activeSource = next; strand = "all"; previewId = next.records[0].id;
    refreshDefaultFields();
    $("item-search").value = ""; $("level-filter").value = "all";
    renderUnits(); renderStrands(); renderAll(); renderPreview();
  }
  function renderStrands() {
    const host = $("strand-filters"); host.replaceChildren();
    const options = [["all", "전체", activeSource.records.length]].concat(Object.entries(activeSource.pack.strands).map(function ([id, title]) {
      return [id, title.ko.replace(/^\d+ · /, ""), activeSource.records.filter(function (record) { return record.item.strand === id; }).length];
    }));
    const current = options.find(function ([id]) { return id === strand; }) || options[0];
    $("strand-filter-current").textContent = `${current[1]} · ${current[2]}문항`;
    options.forEach(function ([id, name, count]) {
      const button = document.createElement("button"); button.type = "button";
      button.textContent = `${name}  ${count}`;
      button.setAttribute("aria-pressed", String(strand === id));
      button.addEventListener("click", function () {
        strand = id; renderStrands(); renderList();
        if (window.matchMedia("(max-width: 760px)").matches) {
          $("strand-filter-disclosure").open = false;
          $("list-title").focus({ preventScroll: true });
          $("list-title").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        } else {
          [...host.querySelectorAll("button")].find(function (entry) { return entry.getAttribute("aria-pressed") === "true"; }).focus();
        }
      });
      host.append(button);
    });
  }
  function renderList(focus) {
    const results = visibleItems(), host = $("item-list"); host.replaceChildren();
    $("result-count").textContent = `${results.length}문항`;
    const outside = selected.filter(function (entry) { return !results.some(function (item) { return item.id === entry.id; }); }).length;
    $("selection-status").textContent = `시험지에 담은 문제 ${selected.length}개${outside ? ` · 현재 결과 밖 ${outside}개` : ""}`;
    $("selected-count").textContent = `${selected.length}문항`;
    $("clear-selected").disabled = selected.length === 0;
    updateMobileBuilderAction();
    if (!results.length) { const empty = document.createElement("p"); empty.className = "list-empty"; empty.textContent = "찾는 문항이 없습니다. 검색어나 필터를 바꿔 보세요."; host.append(empty); return; }
    results.forEach(function (record) {
      const item = record.item;
      const row = document.createElement("div"); row.className = "item-row"; row.dataset.itemId = record.id;
      if (record.id === previewId) row.classList.add("is-previewed");
      const label = document.createElement("label"); label.className = "item-check";
      const check = document.createElement("input"); check.type = "checkbox";
      check.checked = selected.some(function (entry) { return entry.id === record.id; });
      check.setAttribute("aria-label", `${itemNumber(record)}번 시험지에 추가`);
      check.addEventListener("change", function () { if (check.checked) addItem(record.id); else removeItem(record.id); });
      label.append(check);
      const button = document.createElement("button"); button.type = "button"; button.className = "item-open";
      button.setAttribute("aria-label", `${itemNumber(record)}번 미리보기`);
      const title = document.createElement("strong"); setMathText(title, `${String(itemNumber(record)).padStart(2, "0")} · ${item.question?.ko ? `${item.question.ko} — ` : ""}${item.prompt.ko}`);
      const trail = document.createElement("small"); trail.textContent = itemContextLabel(record);
      button.append(title, trail);
      button.addEventListener("click", function () { previewId = record.id; renderPreview(); renderList({ id: record.id, kind: "preview" }); });
      const level = document.createElement("span"); level.className = "item-level"; level.textContent = levelName[item.level];
      row.append(label, button, level); host.append(row);
    });
    if (focus) {
      const row = [...host.querySelectorAll(".item-row")].find(function (entry) { return entry.dataset.itemId === focus.id; });
      if (row) row.querySelector(focus.kind === "preview" ? ".item-open" : "input").focus();
    }
  }
  function content(record, questionNumber) {
    const item = record.item;
    const wrapper = document.createElement("div"); wrapper.className = "question-content";
    const prompt = document.createElement("p"); prompt.className = "question-prompt";
    setMathText(prompt, `${questionNumber ? `${questionNumber}. ` : ""}${item.prompt.ko}`);
    wrapper.append(prompt);
    const visual = document.createElement("div"); visual.className = "question-visual";
    visual.innerHTML = record.source.api.renderVisual(item, "ko", "student");
    wrapper.append(visual);
    if (Array.isArray(item.choices)) {
      const choices = document.createElement("ol"); choices.className = "question-choices";
      if (item.choices.some(function (choice) { return choice.label.ko.length > 35; })) choices.classList.add("is-long");
      item.choices.forEach(function (entry, index) {
        const li = document.createElement("li"); setMathText(li, `${String.fromCharCode(65 + index)}. ${entry.label.ko}`); choices.append(li);
      });
      wrapper.append(choices);
    } else {
      const answer = document.createElement("div"); answer.className = "written-answer";
      const label = document.createElement("strong"); label.textContent = "답";
      answer.append(label, document.createElement("span")); wrapper.append(answer);
    }
    return wrapper;
  }
  function renderPreview() {
    const record = byId.get(previewId), host = $("item-preview"); host.replaceChildren();
    $("preview-index").textContent = `${sourceLabel(record)} · ${levelName[record.item.level]}`;
    host.append(content(record, null));
    const note = document.createElement("p"); note.className = "preview-note";
    note.textContent = outputKind() === "answers" ? "정답지는 문제지와 따로 출력해요." : "정답·해설은 문제지에 포함하지 않습니다."; host.append(note);
  }
  function addItem(id) {
    if (selected.some(function (entry) { return entry.id === id; })) return;
    if (selected.length >= maxItems) { message("공개 문항을 모두 담았습니다."); renderList({ id: id, kind: "check" }); return; }
    selected.push({ id: id, points: 5, lines: 3 }); message(""); renderAll({ id: id, kind: "check" });
  }
  function removeItem(id) {
    const index = selected.findIndex(function (entry) { return entry.id === id; });
    if (index >= 0) selected.splice(index, 1);
    message(""); renderAll({ id: id, kind: "check" });
  }
  function moveItem(id, offset) {
    const index = selected.findIndex(function (entry) { return entry.id === id; });
    const next = index + offset; if (index < 0 || next < 0 || next >= selected.length) return;
    [selected[index], selected[next]] = [selected[next], selected[index]];
    renderSelected(); renderPaper();
  }
  function numberInput(entry, field, min, max, label) {
    const wrapper = document.createElement("label"); wrapper.textContent = label;
    const input = document.createElement("input"); input.type = "number";
    input.min = String(min); input.max = String(max); input.value = String(entry[field]);
    input.setAttribute("aria-label", `${sourceLabel(byId.get(entry.id))} ${label}`);
    input.addEventListener("change", function () {
      const value = Number(input.value);
      if (!Number.isInteger(value) || value < min || value > max) { input.value = String(entry[field]); return; }
      entry[field] = value; renderPaper();
    });
    wrapper.append(input); return wrapper;
  }
  function renderSelected() {
    const host = $("selected-items"); host.replaceChildren();
    if (!selected.length) { const empty = document.createElement("p"); empty.textContent = "목록에서 문항을 선택하세요."; host.append(empty); }
    selected.forEach(function (entry, index) {
      const record = byId.get(entry.id), row = document.createElement("div"); row.className = "selected-row";
      const heading = document.createElement("div"), title = document.createElement("strong");
      title.textContent = `${index + 1}. ${sourceLabel(record)} · ${strandName(record)}`;
      const controls = document.createElement("div"); controls.className = "order-controls";
      [["↑", -1, "위로"], ["↓", 1, "아래로"], ["×", 0, "제거"]].forEach(function ([symbol, direction, name]) {
        const button = document.createElement("button"); button.type = "button"; button.textContent = symbol;
        button.setAttribute("aria-label", `${sourceLabel(record)} ${name}`);
        if (direction && (index + direction < 0 || index + direction >= selected.length)) button.disabled = true;
        button.addEventListener("click", function () { if (direction) moveItem(entry.id, direction); else removeItem(entry.id); }); controls.append(button);
      });
      heading.append(title, controls);
      const settings = document.createElement("div"); settings.className = "item-settings";
      settings.append(numberInput(entry, "points", 1, 20, "배점"), numberInput(entry, "lines", 1, 5, "풀이 줄"));
      row.append(heading, settings); host.append(row);
    });
  }
  function paperInfo() {
    const chosen = [...new Set(selected.map(function (entry) { return byId.get(entry.id).source; }))];
    const sourceText = chosen.length === 1 ? paperSourceLabel(chosen[0]) : chosen.length > 1 ? `${chosen.length}개 단원` : paperSourceLabel(activeSource);
    return {
      title: $("paper-title").value.trim() || "제목 없는 시험지",
      course: $("paper-course").value.trim() || defaultCourse,
      round: $("paper-round").value || "—",
      date: $("paper-date").value.trim() || "____________",
      time: $("paper-time").value || "—",
      points: selected.reduce(function (sum, entry) { return sum + entry.points; }, 0),
      sourceText: sourceText
    };
  }
  function createCover(style, info, answers) {
    const cover = document.createElement("div");
    cover.className = `print-sheet cover-page cover-${style}`;
    cover.innerHTML = '<div class="cover-header"><strong>GFIELD MATH</strong><span class="cover-source"></span></div><div class="cover-graphic" aria-hidden="true"><i></i><i></i><i></i></div><div class="cover-body"><p class="cover-kicker">시험지</p><h2></h2><p class="cover-course"></p><p class="cover-round"></p></div><div class="cover-details"><div><span>이름</span><i></i></div><div><span>날짜</span><strong class="cover-date"></strong></div><div><span>시험 시간</span><strong class="cover-time"></strong></div><div><span>총점</span><strong class="cover-points"></strong></div></div><div class="cover-footer"><span>문제를 읽고 답과 풀이를 작성하세요.</span><strong>GFIELD</strong></div>';
    cover.querySelector(".cover-source").textContent = info.sourceText;
    cover.querySelector("h2").textContent = info.title;
    cover.querySelector(".cover-course").textContent = info.course;
    cover.querySelector(".cover-round").textContent = `${info.round}회차`;
    cover.querySelector(".cover-date").textContent = info.date;
    cover.querySelector(".cover-time").textContent = `${info.time}분`;
    cover.querySelector(".cover-points").textContent = `${info.points}점`;
    if (answers) {
      cover.querySelector(".cover-kicker").textContent = "교사용 정답지";
      cover.querySelector(".cover-footer span").textContent = "정답과 풀이를 문제지와 함께 확인하세요.";
      cover.querySelector(".cover-details div:first-child span").textContent = "담당";
    }
    return cover;
  }
  function createQuestionPage(info, answers) {
    const page = $("question-page-template").content.firstElementChild.cloneNode(true);
    page.querySelector(".sheet-course-code").textContent = info.sourceText;
    page.querySelector(".sheet-title").textContent = info.title;
    page.querySelector(".sheet-date").textContent = info.date;
    page.querySelector(".sheet-time").textContent = `${info.time}분`;
    page.querySelector(".sheet-points").textContent = `${info.points}점`;
    if (answers) {
      page.classList.add("answer-page");
      page.querySelector(".sheet-title").textContent = `${info.title} · 정답지`;
      page.querySelector(".sheet-fields").remove();
      page.querySelector(".sheet-instruction").textContent = "교사용 정답과 풀이입니다. 문제지는 따로 출력하세요.";
      page.querySelector(".sheet-footer span").textContent = "GFIELD Math · 교사용 정답지";
    }
    return page;
  }
  function questionArticle(entry, index) {
    const record = byId.get(entry.id), item = record.item, article = document.createElement("article");
    article.className = "sheet-question"; article.dataset.itemId = record.id;
    const meta = document.createElement("div"); meta.className = "sheet-question-meta";
    const source = document.createElement("span"); source.textContent = `${sourceLabel(record)} · ${itemContextLabel(record)}`;
    const points = document.createElement("strong"); points.textContent = `${entry.points}점`;
    meta.append(source, points); article.append(meta, content(record, index + 1));
    const answerSpace = document.createElement("div"); answerSpace.className = "answer-space";
    for (let i = 0; i < entry.lines; i += 1) answerSpace.append(document.createElement("span"));
    article.append(answerSpace); return article;
  }
  function answerArticle(entry, index) {
    const record = byId.get(entry.id), item = record.item, api = record.source.api;
    const article = document.createElement("article"); article.className = "sheet-question key-question"; article.dataset.itemId = record.id;
    const meta = document.createElement("div"); meta.className = "sheet-question-meta";
    const source = document.createElement("span"); source.textContent = `${sourceLabel(record)} · ${itemContextLabel(record)}`;
    const points = document.createElement("strong"); points.textContent = `${entry.points}점`;
    meta.append(source, points); article.append(meta);
    const prompt = document.createElement("p"); prompt.className = "key-prompt"; setMathText(prompt, `${index + 1}. ${item.prompt.ko}`);
    article.append(prompt);
    let answerText;
    if (Array.isArray(item.choices)) {
      const answerId = api.solveItem(item);
      const choiceIndex = item.choices.findIndex(function (choice) { return choice.id === answerId; });
      answerText = `${String.fromCharCode(65 + choiceIndex)}. ${item.choices[choiceIndex].label.ko}`;
    } else {
      const unit = item.unit && (item.unit.ko || item.unit);
      answerText = `${api.formatResult(item)}${unit ? ` ${unit}` : ""}`;
    }
    const answer = document.createElement("p"); answer.className = "key-answer";
    const answerLabel = document.createElement("strong"); answerLabel.textContent = "정답";
    answer.append(answerLabel);
    const answerContent = document.createElement("span"); setMathText(answerContent, answerText); answer.append(answerContent);
    const solution = document.createElement("p"); solution.className = "key-solution";
    const solutionLabel = document.createElement("strong"); solutionLabel.textContent = "풀이";
    solution.append(solutionLabel);
    const solutionContent = document.createElement("span"); setMathText(solutionContent, api.solutionFor(item, "ko")); solution.append(solutionContent);
    article.append(answer, solution); return article;
  }
  function fitsPage(article, page) {
    return article.getBoundingClientRect().bottom <= page.querySelector(".sheet-footer").getBoundingClientRect().top - 12;
  }
  function fitPages() {
    const available = $("sheet-section").clientWidth;
    const zoom = String(Math.min(1, available / 794));
    $("paper-pages").querySelectorAll(".print-sheet").forEach(function (page) { page.style.zoom = zoom; });
  }
  function renderPaper() {
    const info = paperInfo(), host = $("paper-pages"); host.replaceChildren();
    $("sheet-section").hidden = selected.length === 0;
    $("jump-to-sheet").disabled = selected.length === 0;
    if (!selected.length) {
      $("page-count").textContent = "본문 0쪽";
      $("print-paper").disabled = true;
      $("print-status").textContent = "";
      return;
    }
    const style = document.querySelector('input[name="cover-style"]:checked').value;
    const answers = outputKind() === "answers";
    if (style !== "none") host.append(createCover(style, info, answers));
    let page = createQuestionPage(info, answers); host.append(page);
    const oversized = [];
    selected.forEach(function (entry, index) {
      const article = answers ? answerArticle(entry, index) : questionArticle(entry, index);
      page.querySelector(".sheet-questions").append(article);
      if (!fitsPage(article, page)) {
        article.remove();
        if (page.querySelector(".sheet-question")) {
          page = createQuestionPage(info, answers); host.append(page);
        }
        page.querySelector(".sheet-questions").append(article);
        if (!fitsPage(article, page)) { oversized.push(sourceLabel(byId.get(entry.id))); page.classList.add("is-overflow"); }
      }
    });
    const questionPages = [...host.querySelectorAll(".question-page")];
    questionPages.forEach(function (sheet, index) { sheet.querySelector(".sheet-page-number").textContent = `${index + 1} / ${questionPages.length}`; });
    fitPages();
    $("page-count").textContent = `${style === "none" ? "" : "표지 1쪽 · "}${answers ? "정답지" : "본문"} ${questionPages.length}쪽`;
    $("sheet-heading").textContent = answers ? "A4 정답지" : "A4 시험지";
    $("print-paper").textContent = answers ? "정답지 인쇄·PDF" : "A4 시험지 인쇄·PDF";
    $("print-paper").disabled = !selected.length || oversized.length > 0;
    $("print-status").textContent = oversized.length ? `${oversized.join(", ")}번 문항이 한 쪽에 들어가지 않습니다. 풀이 줄을 줄이세요.` : "";
  }
  function renderAll(focus) { refreshDefaultFields(); renderList(focus); renderSelected(); renderPaper(); }
  $("grade-filter").addEventListener("change", function () {
    const first = sources.find(function (source) { return source.grade === Number($("grade-filter").value); });
    if (first) selectSource(first.cluster);
  });
  $("unit-filter").addEventListener("change", function () { selectSource($("unit-filter").value); });
  $("item-search").addEventListener("input", renderList);
  $("level-filter").addEventListener("change", renderList);
  $("select-visible").addEventListener("click", function () {
    const available = visibleItems().filter(function (item) { return !selected.some(function (entry) { return entry.id === item.id; }); });
    available.slice(0, maxItems - selected.length).forEach(function (item) { selected.push({ id: item.id, points: 5, lines: 3 }); });
    message(available.length ? `${available.length}문항을 추가했습니다.` : "이미 모두 선택했습니다."); renderAll();
  });
  $("clear-selected").addEventListener("click", function () { selected.length = 0; message(""); renderAll(); });
  ["paper-title", "paper-course", "paper-round", "paper-date", "paper-time"].forEach(function (id) { $(id).addEventListener("input", renderPaper); });
  document.querySelectorAll('input[name="cover-style"]').forEach(function (input) { input.addEventListener("change", renderPaper); });
  document.querySelectorAll('input[name="output-kind"]').forEach(function (input) { input.addEventListener("change", function () { renderPaper(); renderPreview(); }); });
  $("jump-to-sheet").addEventListener("click", function () { $("sheet-section").scrollIntoView({ behavior: "smooth" }); });
  $("mobile-builder-action").addEventListener("click", function () {
    $("paper-settings").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    $("selected-items-heading").focus({ preventScroll: true });
  });
  const settingsObserver = new IntersectionObserver(function (entries) {
    paperSettingsInView = entries[0].isIntersecting;
    updateMobileBuilderAction();
  }, { rootMargin: "0px 0px -88px 0px", threshold: 0.75 });
  settingsObserver.observe($("selected-items-heading"));
  $("print-paper").addEventListener("click", async function () {
    renderPaper();
    if (!selected.length || $("print-paper").disabled) return;
    $("print-paper").disabled = true;
    $("print-status").textContent = "인쇄 준비 중…";
    await document.fonts.ready;
    await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
    $("print-paper").disabled = false;
    $("print-status").textContent = "";
    window.print();
  });
  const strandFilterDisclosure = $("strand-filter-disclosure");
  const compactBuilderLayout = window.matchMedia("(max-width: 760px)");
  strandFilterDisclosure.open = !compactBuilderLayout.matches;
  compactBuilderLayout.addEventListener("change", function (event) { strandFilterDisclosure.open = !event.matches; });
  window.addEventListener("resize", fitPages);
  renderUnits(); renderStrands(); renderAll(); renderPreview();
})();
