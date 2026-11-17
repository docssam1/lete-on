(function () {
  "use strict";
  const data = window.GFIELDBoardingGradeRoadmap;
  if (!data) return;
  const coursePathData = window.GFIELDMathCoursePathways;
  const algebra1Course = window.GFIELDAlgebra1Course;
  const localRecords = window.GFIELDLocalLearningRecord;
  const $ = function (id) { return document.getElementById(id); };
  const initial = Number(new URLSearchParams(location.search).get("grade"));
  let grade = data.getGrade(initial) ? initial : 7;
  if (data.getGrade(initial)) {
    document.body.classList.add("boarding-deep-link");
    document.querySelector(".grade-track").open = false;
  }
  let stage = grade === 7 ? null : 0;
  let route = null;
  let competition = new URLSearchParams(location.search).get("program") || "";
  let comparisonGrade = null;
  let selectedPreviousCourse = "";
  let selectedNextCourse = "";
  const publicPractice = {
    6: [
      ["6.NS.A", "분수 나눗셈"], ["6.RP.A", "비와 비율"], ["6.EE.A", "식 쓰기"],
      ["6.NS.B", "소수와 계산"], ["6.NS.C", "음수와 좌표"], ["6.EE.B", "방정식·부등식"],
      ["6.EE.C", "두 양의 관계"], ["6.G.A", "도형과 넓이"], ["6.SP.A", "자료 읽기"], ["6.SP.B", "자료 요약"]
    ],
    7: [["7.NS.A", "유리수 연산"], ["7.RP.A", "비례 관계"]]
  };

  function setText(id, value) {
    const target = $(id);
    target.replaceChildren();
    if (window.GFIELDMathText) window.GFIELDMathText.append(target, value);
    else target.textContent = value;
  }
  function setPlainText(id, value) {
    $(id).textContent = String(value == null ? "" : value);
  }
  function appendMathText(target, value) {
    if (window.GFIELDMathText) window.GFIELDMathText.append(target, value);
    else target.textContent = value;
  }
  function savedGrade7PracticeCounts() {
    try {
      const saved = JSON.parse(localStorage.getItem("gfield-unit-workbook-progress:7.NS.A:v1") || "null");
      if (!saved || saved.schemaVersion !== 1 || saved.packId !== "gfield-grade7-ns-a-unit-workbook-v1" || !saved.correctByStandard || !saved.totalByStandard) return null;
      return { correctByStandard: saved.correctByStandard, totalByStandard: saved.totalByStandard };
    } catch (_error) { return null; }
  }
  function setupRoadmapShortcuts() {
    const links = Array.from(document.querySelectorAll("[data-roadmap-target]"));
    const targets = links.map(function (link) { return document.getElementById(link.dataset.roadmapTarget); }).filter(Boolean);
    function activate(targetId) {
      links.forEach(function (link) {
        if (link.dataset.roadmapTarget === targetId) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
    links.forEach(function (link) {
      link.addEventListener("click", function () { activate(link.dataset.roadmapTarget); });
    });
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(function (entries) {
      const visible = entries.filter(function (entry) { return entry.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      if (visible[0]) activate(visible[0].target.id);
    }, { rootMargin: "-72px 0px -62% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75] });
    targets.forEach(function (target) { observer.observe(target); });
  }
  function updateUrl(mode) {
    const url = new URL(location.href);
    url.searchParams.set("grade", String(grade));
    if (competition) url.searchParams.set("program", competition);
    else url.searchParams.delete("program");
    if (mode === "push") history.pushState(null, "", url);
    else if (mode === "replace") history.replaceState(null, "", url);
  }
  function changeGrade(next) {
    if (next === grade || !data.getGrade(next)) return;
    grade = next;
    stage = grade === 7 ? null : 0;
    route = null;
    competition = null;
    $("grade7-branches").querySelector("details").open = false;
    render("push");
  }
  function revealGrade7Detail() {
    if (grade !== 7 || window.innerWidth > 600) return;
    const detail = document.querySelector(".stage-detail");
    const bounds = detail.getBoundingClientRect();
    if (bounds.top >= 0 && bounds.bottom <= window.innerHeight - 12) return;
    window.scrollTo({ top: Math.max(0, window.scrollY + bounds.top - window.innerHeight * .55), behavior: "instant" });
  }
  function renderGradeButtons() {
    const container = $("grade-buttons");
    if (!container.childElementCount) {
      data.grades.forEach(function (entry) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "grade-button";
        button.textContent = `G${entry.grade}`;
        button.setAttribute("aria-label", `Grade ${entry.grade} 지도 보기`);
        button.addEventListener("click", function () { changeGrade(entry.grade); });
        container.append(button);
      });
    }
    Array.from(container.children).forEach(function (button, index) {
      button.setAttribute("aria-pressed", String(data.grades[index].grade === grade));
    });
  }
  function renderAnnualPlan() {
    const plan = data.getAnnualPlan(grade);
    const list = $("annual-plan-periods");
    list.replaceChildren();
    $("annual-plan-empty").hidden = Boolean(plan);
    list.hidden = !plan;
    if (!plan) {
      setText("annual-plan-title", `${grade}학년 · 개념 단계`);
      setText("annual-plan-note", `${grade}학년 월별 계획 자료는 없어 개념 단계만 보여 드려요.`);
      return;
    }
    setText("annual-plan-title", `${grade}학년 · ${plan.title}`);
    setText("annual-plan-note", plan.note);
    plan.periods.forEach(function (period, periodIndex) {
      const item = document.createElement("li");
      const time = document.createElement("span");
      time.className = "annual-plan-period-time";
      time.textContent = period[0];
      const content = document.createElement("div");
      content.className = "annual-plan-period-content";
      const title = document.createElement("h3");
      appendMathText(title, period[1]);
      const description = document.createElement("p");
      appendMathText(description, period[2]);
      const resources = document.createElement("small");
      const labels = document.createElement("span");
      appendMathText(labels, `자료 예시 · ${period[3]}`);
      resources.append(labels);
      const links = data.annualPlanResourceLinks[grade] && data.annualPlanResourceLinks[grade][periodIndex] || [];
      if (links.length) {
        const linkLabel = document.createElement("span");
        linkLabel.textContent = "온라인 자료";
        const linkList = document.createElement("span");
        linkList.className = "annual-plan-resource-links";
        links.forEach(function (resource) {
          const link = document.createElement("a");
          link.href = resource.url;
          if (/^https?:/.test(resource.url)) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          }
          link.textContent = resource.title;
          linkList.append(link);
        });
        resources.append(linkLabel, linkList);
      }
      content.append(title, description, resources);
      item.append(time, content);
      list.append(item);
    });
    list.classList.toggle("is-inferred", plan.source === "inferred");
  }
  function renderConceptFlows() {
    const host = $("concept-flow-list");
    host.replaceChildren();
    data.conceptFlows.forEach(function (flow) {
      const article = document.createElement("article");
      article.className = "concept-flow";
      if (flow.optional) article.classList.add("concept-flow--optional");
      const heading = document.createElement("h3");
      heading.id = `${flow.id}-heading`;
      appendMathText(heading, flow.title);
      article.setAttribute("aria-labelledby", heading.id);
      if (flow.note) {
        const note = document.createElement("p");
        note.className = "concept-flow-note";
        note.id = `${flow.id}-note`;
        appendMathText(note, flow.note);
        article.setAttribute("aria-describedby", note.id);
        article.append(heading, note);
      } else {
        article.append(heading);
      }
      const list = document.createElement("ol");
      list.setAttribute("aria-label", `${flow.title} 개념 순서 예시`);
      flow.steps.forEach(function (step) {
        const item = document.createElement("li");
        appendMathText(item, step);
        list.append(item);
      });
      article.append(list);
      host.append(article);
    });
  }
  function renderStages(entry) {
    const list = $("stage-list");
    const markerHost = $("stage-map-markers");
    const grade7 = grade === 7;
    const selectionDisclosure = $("stage-external-resources");
    const renderedSelection = `${grade}:${stage === null ? "none" : stage}`;
    if (selectionDisclosure.dataset.selectionKey !== renderedSelection) {
      selectionDisclosure.open = false;
      selectionDisclosure.dataset.selectionKey = renderedSelection;
    }
    list.classList.toggle("grade7-path", grade7);
    list.setAttribute("aria-label", grade7 ? "7학년 개념 연결 예시. 선택은 현재 위치나 학습 완료를 뜻하지 않습니다." : "선택한 학년의 학습 단계");
    list.replaceChildren();
    markerHost.replaceChildren();
    markerHost.dataset.selectedIndex = stage === null ? "none" : String(stage);
    const markerPositions = [[12, 67], [37, 55], [63, 70], [88, 57]];
    entry.steps.forEach(function (step, index) {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "stage-button";
      button.setAttribute("aria-pressed", String(index === stage));
      button.setAttribute("aria-label", grade7 ? `살펴볼 지점 ${index + 1}, ${step[0]}` : `단계 ${index + 1}, ${step[0]} 보기`);
      const number = document.createElement("span");
      number.className = "stage-node";
      number.textContent = String(index + 1).padStart(2, "0");
      const label = document.createElement("strong");
      appendMathText(label, step[0]);
      button.append(number, label);
      const marker = document.createElement("button");
      marker.type = "button";
      marker.className = "stage-map-marker";
      marker.dataset.stageIndex = String(index);
      marker.style.setProperty("--marker-x", `${markerPositions[index][0]}%`);
      marker.style.setProperty("--marker-y", `${markerPositions[index][1]}%`);
      marker.setAttribute("aria-pressed", String(index === stage));
      marker.setAttribute("aria-label", grade7 ? `지도 지점 ${index + 1}, ${step[0]} 살펴보기` : `지도에서 ${index + 1}단계 ${step[0]} 보기`);
      marker.textContent = String(index + 1).padStart(2, "0");
      marker.addEventListener("click", function () {
        stage = index;
        renderStages(entry);
        const selected = list.querySelectorAll("button")[index];
        selected.focus();
        revealGrade7Detail();
      });
      markerHost.append(marker);
      if (index === stage) {
        const selectedNote = document.createElement("span");
        selectedNote.className = "stage-selected-note";
        selectedNote.textContent = "살펴보는 중";
        button.append(selectedNote);
      }
      button.addEventListener("click", function () {
        stage = index;
        renderStages(entry);
        list.querySelectorAll("button")[index].focus();
        revealGrade7Detail();
      });
      li.append(button);
      list.append(li);
    });
    $("grade7-road-intro").hidden = !grade7;
    $("grade7-branches").hidden = !grade7;
    document.querySelector(".journey-main").classList.toggle("grade7-active", grade7);
    const detail = document.querySelector(".stage-detail");
    detail.hidden = grade7 && stage === null;
    $("grade7-stage-check").hidden = !grade7 || stage === null;
    $("stage-external-resource-list").replaceChildren();
    $("stage-external-resource-note").hidden = true;
    $("stage-external-resource-note").textContent = "";
    $("stage-external-resources").hidden = true;
    $("grade7-stage-resource").hidden = true;
    $("grade7-no-resource").hidden = true;
    renderJourneyPreview(entry);
    if (detail.hidden) return;
    setPlainText("stage-number", grade7 ? `살펴보는 구간 ${stage + 1} / ${entry.steps.length}` : `단계 ${stage + 1} / ${entry.steps.length}`);
    setText("stage-title", entry.steps[stage][0]);
    setText("stage-copy", entry.steps[stage][1]);
    const stop = grade7 ? data.grade7Stops[stage] : null;
    const gradeResources = data.courseStageResources[grade];
    const externalResources = grade7
      ? (stop.resources || [])
      : (gradeResources && gradeResources[stage]) || [];
    const externalDisclosure = $("stage-external-resources");
    externalDisclosure.hidden = externalResources.length === 0;
    const resourceNote = gradeResources && ((gradeResources.stageNotes && gradeResources.stageNotes[stage]) || gradeResources.note);
    if (resourceNote) {
      $("stage-external-resource-note").textContent = resourceNote;
      $("stage-external-resource-note").hidden = false;
    }
    externalResources.forEach(function (resource) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = resource.url;
      const isExternal = /^https?:/.test(resource.url);
      if (isExternal) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `${resource.title} (새 창에서 열림)`);
      }
      link.textContent = isExternal ? `${resource.title} ↗` : resource.title;
      item.append(link);
      $("stage-external-resource-list").append(item);
    });
    if (grade7) {
      const checks = $("grade7-stage-questions");
      const savedPractice = stop.clusterId === "7.NS.A" ? savedGrade7PracticeCounts() : null;
      checks.replaceChildren();
      (stop.checks || [stop.check]).filter(Boolean).forEach(function (question) {
        const item = document.createElement("li");
        if (typeof question === "string") appendMathText(item, question);
        else {
          const standard = document.createElement("a"); standard.className = "grade7-standard-code"; standard.textContent = question.standard;
          standard.href = `./unit-workbook.html?cluster=${encodeURIComponent(stop.clusterId)}&mode=workbook&audience=student&locale=ko&standard=${encodeURIComponent(question.standard)}`;
          standard.setAttribute("aria-label", `${question.standard} 워크북에서 연습`);
          const prompt = document.createElement("span"); prompt.className = "grade7-check-prompt"; appendMathText(prompt, question.prompt);
          item.append(standard, prompt);
          const correct = savedPractice && savedPractice.correctByStandard[question.standard];
          const total = savedPractice && savedPractice.totalByStandard[question.standard];
          if (Number.isInteger(correct) && Number.isInteger(total) && total > 0 && correct >= 0 && correct <= total) {
            const progress = document.createElement("small"); progress.className = "grade7-practice-progress"; progress.textContent = `이 기기 연습 · 맞힌 기록 ${correct}/${total} · 진단 아님`; item.append(progress);
          }
        }
        checks.append(item);
      });
      $("grade7-stage-references").hidden = stop.id !== "nsa";
      if (stop.clusterId) {
        const link = $("grade7-stage-resource");
        link.href = `./unit-workbook.html?cluster=${encodeURIComponent(stop.clusterId)}&mode=workbook&audience=student&locale=ko&paper=A4`;
        link.textContent = `${stop.title} 워크북 보기 · ${stop.resourceState === "public" ? "36문항" : "검수 시안"} →`;
        link.hidden = false;
      } else $("grade7-no-resource").hidden = externalResources.length > 0;
    }
  }
  function ownPracticeResources(selectedGrade) {
    const resources = [];
    if (selectedGrade === 7) resources.push(
      { title: "지필드 7.NS.A 유리수 연산 단원 모의고사 · 1회", url: "./grade7-ns-a-mock-exam.html" },
      { title: "지필드 7.RP.A 비와 비례 관계 단원 모의고사 · 1회", url: "./grade7-rp-a-mock-exam.html" }
    );
    if (selectedGrade === 6) resources.push({ title: "지필드 6.NS.A 분수 나눗셈 단원 워크북", url: "./unit-workbook.html?cluster=6.NS.A&mode=workbook&audience=student&locale=ko&paper=A4" });
    if (selectedGrade === 7) ["7.NS.A", "7.RP.A"].forEach(function (clusterId) {
      const label = clusterId === "7.NS.A" ? "유리수 연산" : "비례 관계";
      resources.push({ title: `지필드 ${clusterId} ${label} 단원 워크북`, url: `./unit-workbook.html?cluster=${clusterId}&mode=workbook&audience=student&locale=ko&paper=A4` });
    });
    const stageLinks = data.annualPlanResourceLinks && data.annualPlanResourceLinks[selectedGrade];
    Object.values(stageLinks || {}).flat().forEach(function (resource) {
      if (resource && resource.url.startsWith("./") && resource.title.startsWith("지필드")) resources.push(resource);
    });
    const seen = new Set();
    return resources.filter(function (resource) {
      if (seen.has(resource.url)) return false;
      seen.add(resource.url);
      return true;
    }).slice(0, 6);
  }
  function renderOwnPracticeEntry() {
    const resources = ownPracticeResources(grade);
    const label = $("journey-practice-label");
    const title = $("journey-practice-title");
    const copy = $("journey-practice-copy");
    const link = $("journey-practice-link");
    const historyPanel = $("journey-mock-history");
    if (historyPanel) { historyPanel.replaceChildren(); historyPanel.hidden = true; }
    if (!resources.length) {
      label.textContent = `${grade}학년 · 자체 문항`;
      title.textContent = "이 학년 자료를 준비하고 있어요";
      copy.textContent = "지필드 모의고사를 풀고, 결과에 따라 다음에 볼 개념을 정해요.";
      link.hidden = true;
      return;
    }
    label.textContent = `지필드 자체 문항 · ${grade}학년`;
    title.textContent = resources[0].title;
    copy.textContent = grade === 7
      ? "7.NS.A 모의고사를 풀고, 문항별 결과를 다음 복습에 연결해요."
      : "공개된 지필드 학습 자료를 직접 풀어 봐요.";
    link.href = resources[0].url;
    link.hidden = false;
    if (grade === 7 && historyPanel && localRecords && localRecords.storage) {
      const history = localRecords.storage.loadGfieldMockResultHistory();
      if (history.length) {
        const latest = history[0];
        const header = document.createElement("div"); header.className = "journey-mock-history-heading";
        const heading = document.createElement("strong"); heading.textContent = "최근 지필드 모의고사";
        const date = document.createElement("time"); date.dateTime = latest.completedAt; date.textContent = new Date(latest.completedAt).toLocaleDateString("ko-KR");
        header.append(heading, date);
        const examTitle = document.createElement("p"); examTitle.className = "journey-mock-exam-title"; examTitle.textContent = latest.examTitle;
        const score = document.createElement("p"); score.className = "journey-mock-score"; score.textContent = `${latest.score.correct} / ${latest.score.total} 정답 · ${latest.score.answered}문항 응답`;
        const standards = document.createElement("ul"); standards.className = "journey-mock-standards";
        latest.standards.forEach(function (entry) { const row = document.createElement("li"); row.textContent = `${entry.id} · ${entry.correct}/${entry.total}`; standards.append(row); });
        historyPanel.append(header, examTitle, score, standards);
        if (latest.reviewFocuses.length) {
          const label = document.createElement("span"); label.className = "journey-mock-review-label"; label.textContent = "다시 볼 개념";
          const focusList = document.createElement("ul"); focusList.className = "journey-mock-focuses";
          latest.reviewFocuses.slice(0, 3).forEach(function (focus) { const row = document.createElement("li"); row.textContent = focus.label; focusList.append(row); });
          historyPanel.append(label, focusList);
        }
        const prior = history.find(function (entry) { return entry.examId === latest.examId && entry.formVersion === latest.formVersion && entry.id !== latest.id; });
        if (prior) {
          const delta = latest.score.correct - prior.score.correct;
          const trend = document.createElement("p"); trend.className = "journey-mock-trend";
          trend.textContent = `같은 시험 이전 풀이 ${prior.score.correct}/${prior.score.total} → 최근 ${latest.score.correct}/${latest.score.total} · ${delta > 0 ? `+${delta}` : delta}문항`;
          historyPanel.append(trend);
          const caveat = document.createElement("small"); caveat.textContent = "같은 문제를 다시 푼 변화예요. 문항 기억의 영향이 있어 학년 등급이나 숙달 판정으로 보지 않습니다."; historyPanel.append(caveat);
        }
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "journey-mock-remove"; remove.textContent = "이 기기의 모의고사 기록 지우기";
        remove.addEventListener("click", function () {
          if (!window.confirm(window.GFIELDContentI18n.text("이 기기에 저장된 지필드 모의고사 기록을 모두 지울까요?"))) return;
          localRecords.storage.clearGfieldMockResultHistory();
          renderOwnPracticeEntry();
        });
        historyPanel.append(remove); historyPanel.hidden = false;
      }
    }
  }
  function appendOwnPracticeLinks(gradeEntry, labelId, titleId, listId) {
    const resources = ownPracticeResources(gradeEntry.grade);
    setText(labelId, `${gradeEntry.grade}학년 · 자체 문항`);
    setText(titleId, resources.length ? `${resources.length}개 지필드 학습 자료` : "자체 문항 준비 중");
    const list = $(listId);
    list.replaceChildren();
    if (!resources.length) {
      const item = document.createElement("li");
      item.textContent = "이 학년의 자체 문항은 준비 중이에요.";
      list.append(item);
      return;
    }
    resources.forEach(function (resource) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = resource.url;
      link.textContent = resource.title;
      item.append(link);
      list.append(item);
    });
  }
  function renderJourneyPreview(entry) {
    const selectedLabel = $("journey-selected-label");
    const selectedTitle = $("journey-selected-title");
    const nextStop = $("journey-next-stop");
    const endNote = $("journey-route-end");
    if (stage === null || !entry.steps[stage]) {
      selectedLabel.textContent = "아직 선택 전";
      selectedTitle.textContent = "경로 지점을 눌러 내용을 살펴보세요";
      nextStop.hidden = true;
      endNote.hidden = true;
      return;
    }
    selectedLabel.textContent = "지금 살펴보는 개념";
    setText("journey-selected-title", entry.steps[stage][0]);
    const next = entry.steps[stage + 1];
    nextStop.hidden = !next;
    endNote.hidden = Boolean(next);
    if (next) setText("journey-next-title", next[0]);
  }
  function renderRoutes() {
    const buttons = $("route-buttons");
    buttons.replaceChildren();
    data.routes.forEach(function (entry, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "route-button";
      button.setAttribute("aria-pressed", String(entry.id === route));
      const title = document.createElement("strong");
      title.textContent = entry.title;
      button.append(title);
      button.addEventListener("click", function () { route = entry.id; renderRoutes(); buttons.querySelectorAll("button")[index].focus(); });
      buttons.append(button);
    });
    const entry = data.getRoute(route);
    document.querySelector(".route-layout").classList.toggle("is-empty", !entry);
    document.querySelector(".route-explanation").hidden = !entry;
    setText("route-status", entry ? "선택한 방향" : "선택 전");
    setText("route-name", entry ? entry.title : "학습 방향");
    setText("route-description", entry ? entry.description : "");
    setText("route-check", entry ? entry.check : "");
    $("route-check-block").hidden = !entry;
  }
  function renderLevels(entry) {
    setText("level-repair", `${entry.steps[0][0]}: ${entry.steps[0][1]}`);
    setText("level-secure", "배운 개념을 혼자 풀고 며칠 뒤 새 문제에서도 설명해요.");
    setText("level-extend", entry.steps[2][1]);
  }
  function renderCoursePathway() {
    if (!coursePathData) return;
    const courses = coursePathData.courses;
    const byId = new Map(courses.map(function (course) { return [course.id, course]; }));
    const currentSelect = $("current-course-select");
    if (!currentSelect.options.length || currentSelect.options.length === 1) {
      courses.forEach(function (course) { currentSelect.add(new Option(course.title, course.id)); });
    }
    const current = byId.get(currentSelect.value);
    const host = $("course-path-cards");
    host.replaceChildren();
    function optionSelect(label, options, selected, onChange, emptyText) {
      if (!options.length) {
        const message = document.createElement("p");
        message.className = "course-path-empty-choice";
        message.textContent = emptyText;
        return message;
      }
      const select = document.createElement("select");
      select.setAttribute("aria-label", label);
      select.add(new Option(label, ""));
      options.forEach(function (course) { select.add(new Option(course.title, course.id)); });
      select.value = selected;
      select.addEventListener("change", function (event) {
        onChange(event.target.value);
        const replacement = Array.from(host.querySelectorAll("select")).find(function (item) { return item.getAttribute("aria-label") === label; });
        if (replacement) replacement.focus();
      });
      return select;
    }
    function addCard(kind, title, description, course, chooser, currentCard) {
      const card = document.createElement("article");
      card.className = `course-path-card${currentCard ? " is-current" : ""}`;
      const label = document.createElement("span"); label.textContent = kind;
      const heading = document.createElement("h3"); heading.textContent = course ? course.title : title;
      const copy = document.createElement("p"); appendMathText(copy, course ? `${course.grades} · ${course.summary}` : description);
      card.append(label, heading, copy);
      if (course) {
        const focus = document.createElement("small"); appendMathText(focus, `먼저 볼 내용 · ${course.prerequisites}`);
        const availability = document.createElement("small"); availability.className = "course-path-availability"; availability.textContent = course.availability;
        const material = document.createElement("a"); material.className = "course-path-material-link"; material.href = course.studentHref; material.textContent = "지필드 자료 보기 →";
        card.append(focus, availability, material);
      }
      if (chooser) card.append(chooser);
      host.append(card);
    }
    if (!current) {
      addCard("지나온 과정", "과목 선택 후 표시", "앞선 과목을 직접 선택해요.", null, null, false);
      addCard("현재 과정", "과목을 선택해 주세요", "현재 수강 중인 과목을 기준으로 이어 봐요.", null, null, true);
      addCard("다음 과정", "과목 선택 후 표시", "학교 과정에 맞는 다음 선택지를 골라요.", null, null, false);
      return;
    }
    const previous = byId.get(selectedPreviousCourse);
    const next = byId.get(selectedNextCourse);
    const prevChoice = optionSelect("지나온 과정 고르기", (current.previousOptions || []).map(function (id) { return byId.get(id); }).filter(Boolean), selectedPreviousCourse, function (value) { selectedPreviousCourse = value; renderCoursePathway(); }, "이 지도의 시작 과정이에요.");
    const nextChoice = optionSelect("다음 과정 고르기", (current.nextOptions || []).map(function (id) { return byId.get(id); }).filter(Boolean), selectedNextCourse, function (value) { selectedNextCourse = value; renderCoursePathway(); }, "현재 과정의 다음 선택지가 아직 없어요.");
    addCard("지나온 과정", previous ? "선택한 앞선 과정" : "앞선 과목을 선택해 주세요", previous ? "" : "수강 이력에 맞는 과목을 골라요.", previous, prevChoice, false);
    addCard("현재 과정", current.title, current.availability, current, null, true);
    addCard("다음 과정", next ? "선택한 다음 과정" : "다음 과목을 선택해 주세요", next ? "" : "학교에서 실제로 이어지는 과목을 골라요.", next, nextChoice, false);
    setText("course-path-notice", `${coursePathData.sequenceNotice} 이 선택은 학습 기록이나 과목 배정에 저장되지 않아요.`);
  }
  function renderAlgebra1Course() {
    if (!algebra1Course) return;
    setText("algebra1-course-scope", algebra1Course.scope);
    setText("algebra1-original-note", algebra1Course.originalContentNotice);
    const unitHost = $("algebra1-unit-list");
    unitHost.replaceChildren();
    algebra1Course.units.forEach(function (unit, index) {
      const card = document.createElement("article"); card.className = "algebra1-unit-card";
      const number = document.createElement("span"); number.className = "algebra1-unit-number"; number.textContent = `0${index + 1}`;
      const content = document.createElement("div");
      const heading = document.createElement("h3"); appendMathText(heading, unit.title);
      const question = document.createElement("p"); question.className = "algebra1-unit-question"; appendMathText(question, unit.question);
      const goals = document.createElement("ul"); unit.goals.forEach(function (goal) { const li = document.createElement("li"); appendMathText(li, goal); goals.append(li); });
      const standards = document.createElement("small"); standards.textContent = `범위 코드 · ${unit.standards.join(" · ")}`;
      let sequence = null;
      if (unit.lessons && unit.lessons.length) {
        sequence = document.createElement("details"); sequence.className = "algebra1-lesson-sequence";
        const sequenceSummary = document.createElement("summary"); sequenceSummary.textContent = `수업 순서 · ${unit.lessons.length}차시`;
        const lessonList = document.createElement("ol"); lessonList.className = "algebra1-lesson-list";
        unit.lessons.forEach(function (session, lessonIndex) {
          const sessionItem = document.createElement("li");
          const sessionDetails = document.createElement("details"); sessionDetails.className = "algebra1-session";
          const sessionSummary = document.createElement("summary"); appendMathText(sessionSummary, `${String(lessonIndex + 1).padStart(2, "0")} · ${session.title}`);
          const objective = document.createElement("p"); objective.className = "algebra1-session-objective"; appendMathText(objective, `이번 차시 목표 · ${session.objective}`);
          const idea = document.createElement("p"); idea.className = "algebra1-session-idea"; appendMathText(idea, session.idea);
          const exampleLabel = document.createElement("strong"); exampleLabel.textContent = "예제와 풀이";
          const examplePrompt = document.createElement("p"); examplePrompt.className = "algebra1-session-prompt"; appendMathText(examplePrompt, session.example.prompt);
          const exampleSolution = document.createElement("p"); appendMathText(exampleSolution, session.example.solution);
          const practiceLabel = document.createElement("strong"); practiceLabel.textContent = "직접 풀어 보기";
          const practiceList = document.createElement("ol"); practiceList.className = "algebra1-practice-list";
          session.practice.forEach(function (exercise, exerciseIndex) {
            const exerciseItem = document.createElement("li");
            const exercisePrompt = document.createElement("p"); appendMathText(exercisePrompt, exercise.prompt);
            const answerDetails = document.createElement("details"); answerDetails.className = "algebra1-answer";
            const answerSummary = document.createElement("summary"); answerSummary.textContent = `문항 ${exerciseIndex + 1} 풀이 확인`;
            const answer = document.createElement("p"); appendMathText(answer, exercise.answer);
            const feedback = document.createElement("p"); appendMathText(feedback, exercise.feedback);
            answerDetails.append(answerSummary, answer, feedback);
            exerciseItem.append(exercisePrompt, answerDetails); practiceList.append(exerciseItem);
          });
          sessionDetails.append(sessionSummary, objective, idea, exampleLabel, examplePrompt, exampleSolution, practiceLabel, practiceList);
          sessionItem.append(sessionDetails); lessonList.append(sessionItem);
        });
        sequence.append(sequenceSummary, lessonList);
      }
      const lesson = document.createElement("details"); lesson.className = "algebra1-unit-lesson";
      const summary = document.createElement("summary"); appendMathText(summary, `지필드 연습 · ${unit.lesson.title}`);
      const prompt = document.createElement("p"); prompt.className = "algebra1-unit-prompt"; appendMathText(prompt, unit.lesson.prompt);
      const solutionHeading = document.createElement("strong"); solutionHeading.textContent = "풀이 확인";
      const solution = document.createElement("p"); appendMathText(solution, unit.lesson.solution);
      const extensionHeading = document.createElement("strong"); extensionHeading.textContent = "한 걸음 더";
      const extension = document.createElement("p"); appendMathText(extension, unit.lesson.extension);
      lesson.append(summary, prompt, solutionHeading, solution, extensionHeading, extension);
      content.append(heading, question, goals, standards);
      if (sequence) content.append(sequence);
      content.append(lesson); card.append(number, content); unitHost.append(card);
    });
    const lesson = algebra1Course.starterLesson;
    setText("algebra1-starter-title", lesson.title);
    setText("algebra1-starter-prompt", lesson.prompt);
    setText("algebra1-starter-check", lesson.check);
    setText("algebra1-starter-extension", lesson.extension);
    const steps = $("algebra1-starter-steps"); steps.replaceChildren();
    lesson.steps.forEach(function (step) {
      const li = document.createElement("li");
      const expression = document.createElement("strong"); appendMathText(expression, step.expression);
      const reason = document.createElement("span"); appendMathText(reason, step.reason);
      li.append(expression, reason); steps.append(li);
    });
    algebra1Course.sources.forEach(function (source) {
      const link = $(`algebra1-standard-source-${source.id}`);
      if (!link) return;
      link.href = source.url;
      link.textContent = `${source.shortTitle} ↗`;
    });
  }
  function renderComparisonOptions() {
    const select = $("comparison-grade");
    select.replaceChildren(new Option("학년 선택", ""));
    data.grades.filter(function (entry) { return entry.grade !== grade; }).forEach(function (entry) {
      select.add(new Option(`${entry.grade}학년`, String(entry.grade)));
    });
    if (comparisonGrade === grade || !data.getGrade(comparisonGrade)) comparisonGrade = null;
    select.value = comparisonGrade === null ? "" : String(comparisonGrade);
  }
  function comparisonPlanLabel(entry) {
    return entry.pathNote || "학습 계획 예시";
  }
  function renderComparisonColumn(prefix, entry) {
    const planLabel = comparisonPlanLabel(entry);
    setText(`comparison-${prefix}-label`, `${entry.grade}학년 · ${planLabel}`);
    setText(`comparison-${prefix}-title`, entry.title);
    setText(`comparison-${prefix}-core`, entry.core);
    const list = $(`comparison-${prefix}-tracks`);
    list.replaceChildren();
    data.getTracks(entry.grade).forEach(function (track) {
      const term = document.createElement("dt"); term.textContent = track[0];
      const description = document.createElement("dd"); appendMathText(description, track[1]);
      list.append(term, description);
    });
    const annualPlan = data.getAnnualPlan(entry.grade);
    const planTerm = document.createElement("dt"); planTerm.textContent = "연간 흐름";
    const planDescription = document.createElement("dd");
    appendMathText(planDescription, annualPlan ? annualPlan.title : "월별 계획 자료 없음");
    list.append(planTerm, planDescription);
    if (annualPlan) annualPlan.periods.forEach(function (period) {
      const term = document.createElement("dt"); term.textContent = period[0];
      const description = document.createElement("dd"); appendMathText(description, `${period[1]} · ${period[2]}`);
      list.append(term, description);
    });
  }
  function renderMobileComparison(current, target) {
    const host = $("comparison-mobile-view");
    host.replaceChildren();
    const header = document.createElement("div");
    header.className = "comparison-mobile-row comparison-mobile-header";
    header.setAttribute("aria-label", "비교하는 학년");
    [current, target].forEach(function (entry) {
      const cell = document.createElement("div");
      cell.className = "comparison-mobile-cell";
      const label = document.createElement("strong");
      const planLabel = comparisonPlanLabel(entry);
      appendMathText(label, `${entry.grade}학년${entry.grade === grade ? " · 현재" : ""} · ${planLabel}`);
      const title = document.createElement("span"); title.textContent = entry.title;
      cell.append(label, title); header.append(cell);
    });
    host.append(header);
    if (current.source === "inferred" || target.source === "inferred") {
      const note = document.createElement("p");
      note.className = "comparison-mobile-note";
      appendMathText(note, `${target.source === "inferred" ? target.grade : current.grade}학년은 학교의 실제 과목과 순서를 확인한 뒤 학습 계획을 조정해 주세요.`);
      host.append(note);
    }
    function addPair(label, left, right) {
      const row = document.createElement("article"); row.className = "comparison-mobile-row";
      const heading = document.createElement("h3"); heading.textContent = label;
      const values = document.createElement("div"); values.className = "comparison-mobile-values";
      [[current, left], [target, right]].forEach(function (pair) {
        const cell = document.createElement("div"); cell.className = "comparison-mobile-cell";
        const gradeLabel = document.createElement("span"); gradeLabel.className = "comparison-mobile-grade";
        gradeLabel.textContent = `${pair[0].grade}학년`;
        const copy = document.createElement("p"); appendMathText(copy, pair[1] == null ? "이 학년 자료에 별도 항목 없음" : pair[1]);
        cell.append(gradeLabel, copy); values.append(cell);
      });
      row.append(heading, values); host.append(row);
    }
    addPair("과정", `${current.title} · ${current.core}`, `${target.title} · ${target.core}`);
    const currentTracks = data.getTracks(current.grade), targetTracks = data.getTracks(target.grade);
    const trackKinds = [
      ["school", "학교 수학"], ["contest", "경시 · 선택"], ["sat", "SAT · 선택"], ["problem-solving", "문제 해결"]
    ];
    function trackKind(track) {
      if (/학교 수학/.test(track[0])) return "school";
      if (/경시/.test(track[0])) return "contest";
      if (/SAT/.test(track[0])) return "sat";
      if (/문제 해결/.test(track[0])) return "problem-solving";
      return null;
    }
    trackKinds.forEach(function (kind) {
      const left = currentTracks.find(function (track) { return trackKind(track) === kind[0]; });
      const right = targetTracks.find(function (track) { return trackKind(track) === kind[0]; });
      if (left || right) addPair(kind[1], left && left[1], right && right[1]);
    });
    const currentPlan = data.getAnnualPlan(current.grade), targetPlan = data.getAnnualPlan(target.grade);
    addPair("연간 흐름", currentPlan ? currentPlan.title : "월별 계획 자료 없음", targetPlan ? targetPlan.title : "월별 계획 자료 없음");
    const leftPeriods = currentPlan ? currentPlan.periods : [], rightPeriods = targetPlan ? targetPlan.periods : [];
    for (let index = 0; index < Math.max(leftPeriods.length, rightPeriods.length); index += 1) {
      const left = leftPeriods[index], right = rightPeriods[index];
      const leftLabel = left ? left[0] : "";
      const rightLabel = right ? right[0] : "";
      const label = leftLabel || rightLabel || `기간 ${index + 1}`;
      addPair(label, left ? `${left[1]} · ${left[2]}` : "월별 계획 없음", right ? `${right[1]} · ${right[2]}` : "월별 계획 없음");
    }
    addPair("개념 연결", current.bridge, target.bridge);
  }
  function renderComparison() {
    const current = data.getGrade(grade);
    const target = data.getGrade(comparisonGrade);
    const table = $("comparison-table");
    document.querySelector(".grade-comparison").classList.toggle("has-comparison", Boolean(target));
    table.hidden = !target;
    if (!target) {
      setText("comparison-note", "현재 학년과 비교할 학년을 고르면 배움의 연결을 보여 드려요.");
      return;
    }
    renderComparisonColumn("current", current);
    renderComparisonColumn("target", target);
    renderMobileComparison(current, target);
    appendOwnPracticeLinks(current, "comparison-practice-current-label", "comparison-practice-current-title", "comparison-practice-current-links");
    appendOwnPracticeLinks(target, "comparison-practice-target-label", "comparison-practice-target-title", "comparison-practice-target-links");
    setText("comparison-bridge-copy", `${current.grade}학년: ${current.bridge} · ${target.grade}학년: ${target.bridge}`);
    const hasInferred = current.source === "inferred" || target.source === "inferred";
    setText("comparison-note", hasInferred
      ? `${current.grade}학년과 ${target.grade}학년의 학습 예시예요. 실제 과목과 순서는 학교 안내에서 확인해 주세요.`
      : `${current.grade}학년과 ${target.grade}학년의 학습 주제와 개념 연결을 비교해요.`);
  }
  function renderGradeFocus() {
    const host = $("grade-focus-list"); host.replaceChildren();
    data.getTracks(grade).forEach(function (track) {
      const item = document.createElement("div");
      const label = document.createElement("strong"); label.textContent = track[0];
      const description = document.createElement("span"); description.textContent = track[1];
      item.append(label, description); host.append(item);
    });
  }
  function renderPracticeLinks() {
    const items = publicPractice[grade] || [];
    const section = $("grade-practice");
    const primary = $("grade-practice-links");
    const more = $("grade-practice-more");
    const moreLinks = $("grade-practice-more-links");
    section.hidden = items.length === 0;
    section.querySelector("h4").textContent = grade === 7 ? "단원 워크북" : "지금 풀어 볼 수 있어요";
    section.querySelector("p").textContent = grade === 7 ? "7.NS.A와 7.RP.A 공개 워크북은 연습용이에요. 개인 진단은 별도 검수 중이에요." : "배운 개념을 문제로 확인해 보세요.";
    primary.replaceChildren();
    moreLinks.replaceChildren();
    more.hidden = items.length <= 3;
    more.open = false;
    items.forEach(function (item, index) {
      const link = document.createElement("a");
      link.href = `./unit-workbook.html?cluster=${encodeURIComponent(item[0])}&mode=workbook&audience=student&locale=ko`;
      link.textContent = `${item[1]} · 36문항 →`;
      (index < 3 ? primary : moreLinks).append(link);
    });
  }
  function renderCompetitionMockCatalog() {
    const gradeSeven = grade === 7;
    const gradeTen = grade === 10;
    const gradeNine = grade === 9;
    const gradeAMC8Route = grade === 6 || grade === 8;
    $("competition-own-mocks").hidden = !gradeSeven;
    $("competition-amc12-mock-route").hidden = !gradeTen;
    $("competition-amc10-mock-route").hidden = !gradeNine;
    $("competition-amc8-mock-route").hidden = !gradeAMC8Route;
    if (gradeAMC8Route) $("competition-amc8-mock-route").querySelector("a").href = `./amc8-grade7-mock-exam.html?grade=${grade}`;
    $("competition-own-mocks-empty").hidden = gradeSeven || gradeTen || gradeNine || gradeAMC8Route;
  }
  function renderGrade7ContestBranch() {
    const link = $("grade7-contest-branch");
    if (!link) return;
    const options = data.competitionOptions(grade);
    const selected = options.find(function (entry) { return entry.id === competition; });
    const program = selected ? selected.id : "amc8";
    const branches = {
      sasmo: {
        href: "./sasmo.html",
        title: "SASMO · 대회 자료와 연습",
        copy: "SASMO 안내와 지필드 연습 자료를 살펴봐요. 공식 대회 결과나 등급 판정은 아니에요."
      },
      kangaroo: {
        href: `https://mathkangaroo.org/mks/practice/grades-${Math.floor((grade - 1) / 2) * 2 + 1}-${Math.floor((grade - 1) / 2) * 2 + 2}/`,
        title: "Math Kangaroo · 공식 기출 시험지",
        copy: `${Math.floor((grade - 1) / 2) * 2 + 1}–${Math.floor((grade - 1) / 2) * 2 + 2}학년용 공식 기출 PDF를 열어요. 지필드 자체 문항과 결과 확인은 G·MAP 안에서 이어갑니다.`,
        external: true
      },
      amc8: {
        href: "./competition-practice.html?program=amc8",
        title: "6학년 기초 연결 · AMC 8 유형 연습",
        copy: "GFIELD 자체 10문항으로 유형을 살펴봐요. 공식 점수 진단은 아니에요."
      },
      amc10: {
        href: `./amc10-practice.html?grade=${grade}`,
        title: "AMC 10 · 개념 연결 연습 · 자체 12문항",
        copy: "지필드 자체 주제 연습이에요. 공식 AMC 10 점수나 대회 준비 수준을 판정하지 않아요."
      }
    };
    const branch = branches[program] || branches.amc8;
    link.href = branch.href;
    if (branch.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
    $("grade7-contest-title").textContent = branch.title;
    $("grade7-contest-copy").textContent = branch.copy;
  }
  function render(historyMode) {
    const entry = data.getGrade(grade);
    const competitionChoices = data.competitionOptions(grade);
    const selectedCompetition = competitionChoices.find(function (item) { return item.id === competition; });
    const defaultArchiveProgram = grade <= 8 ? "amc8" : grade <= 10 ? "amc10" : "amc12";
    const paperReviewProgram = selectedCompetition ? competition : competitionChoices.some(function (item) { return item.id === defaultArchiveProgram; }) ? defaultArchiveProgram : "amc8";
    $("competition-paper-review-route").href = `./competition-paper-review.html?grade=${grade}&program=${encodeURIComponent(paperReviewProgram)}`;
    $("competition-paper-review-route").textContent = selectedCompetition && selectedCompetition.id === "kangaroo" ? "Math Kangaroo 결과 입력 · 학년 비교" : "원본 답안 입력 · 결과 확인";
    const amcArchiveRoute = $("competition-amc-original-route");
    amcArchiveRoute.href = `./competition-paper-review.html?grade=${grade}&program=${encodeURIComponent(defaultArchiveProgram)}`;
    const kangarooBandStart = grade % 2 === 1 ? grade : grade - 1;
    const kangarooArchiveRoute = $("competition-kangaroo-original-route");
    kangarooArchiveRoute.href = `https://mathkangaroo.org/mks/practice/grades-${kangarooBandStart}-${kangarooBandStart + 1}/`;
    kangarooArchiveRoute.querySelector("span").textContent = `Math Kangaroo · Grade ${kangarooBandStart}–${kangarooBandStart + 1}`;
    const planHref = grade === 7 ? "./learning-plan.html?goal=school-g7-nsa" : "./learning-plan.html";
    $("boarding-learning-plan-link").href = planHref;
    $("boarding-learning-plan-link").textContent = grade === 7 ? "7학년 학습 계획" : "학습 계획";
    $("boarding-learning-plan-link-bottom").href = planHref;
    $("boarding-learning-plan-link-bottom").textContent = grade === 7 ? "7학년 학습 계획 보기 →" : "학습 계획 보기 →";
    setText("grade-map-title", `${grade}학년 수학 한눈에`);
    setText("grade-label", `${grade}학년`);
    setText("grade-title", entry.title);
    setText("grade-core", entry.core);
    setText("grade-bridge", entry.bridge);
    setText("source-chip", entry.source === "inferred" ? `${grade}학년 · 학교 과목 확인` : "학습 예시");
    setText("grade-note", grade === 7
      ? "7.NS.A·7.RP.A 워크북은 연습용으로 열 수 있어요. 개인 진단은 별도 검수 중이에요."
      : grade === 9 && entry.source === "inferred"
        ? "9학년은 학교마다 수강 과목과 순서가 달라요. 실제 과목을 선생님과 확인해 주세요."
        : entry.source === "inferred"
          ? `${grade}학년은 학교별 과목과 선수 조건을 확인한 뒤 이 학습 예시를 조정해 주세요.`
        : "아직 진단 결과가 없어요. 실제 풀이를 보고 다음 단계를 정해요.");
    $("previous-grade").disabled = grade === data.grades[0].grade;
    $("next-grade").disabled = grade === data.grades[data.grades.length - 1].grade;
    renderGradeButtons();
    renderComparisonOptions();
    renderComparison();
    renderAnnualPlan(entry);
    renderStages(entry);
    renderOwnPracticeEntry();
    renderLevels(entry);
    renderGradeFocus();
    renderPracticeLinks();
    renderRoutes();
    renderCompetitionMockCatalog();
    renderGrade7ContestBranch();
    updateUrl(historyMode);
  }
  $("previous-grade").addEventListener("click", function () { changeGrade(grade - 1); });
  $("next-grade").addEventListener("click", function () { changeGrade(grade + 1); });
  $("journey-next-button").addEventListener("click", function () {
    const entry = data.getGrade(grade);
    if (!entry || stage === null || stage >= entry.steps.length - 1) return;
    stage += 1;
    renderStages(entry);
    const selected = $("stage-list").children[stage];
    if (selected) selected.querySelector("button").focus();
    revealGrade7Detail();
  });
  window.addEventListener("popstate", function () {
    const params = new URLSearchParams(location.search);
    const next = Number(params.get("grade"));
    const nextCompetition = params.get("program") || "";
    if (next === grade && nextCompetition === competition) return;
    grade = data.getGrade(next) ? next : 7;
    stage = grade === 7 ? null : 0;
    route = null;
    competition = nextCompetition;
    $("grade7-branches").querySelector("details").open = false;
    render(null);
  });
  $("comparison-grade").addEventListener("change", function (event) {
    comparisonGrade = event.target.value ? Number(event.target.value) : null;
    renderComparison();
  });
  $("current-course-select").addEventListener("change", function () {
    selectedPreviousCourse = "";
    selectedNextCourse = "";
    renderCoursePathway();
  });
  render("replace");
  renderCoursePathway();
  renderAlgebra1Course();
  renderConceptFlows();
  setupRoadmapShortcuts();
})();
