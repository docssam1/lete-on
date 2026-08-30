(function () {
  "use strict";

  const content = window.GFIELDGrade6ConceptLessons;
  const clinicPaths = window.GFIELDClinicPaths;
  const DOMAIN_LABELS = Object.freeze({ RP: "비와 비례", NS: "수 체계", EE: "식과 방정식", G: "기하", SP: "통계와 확률" });
  const REPRESENTATION_LABELS = Object.freeze({
    "equivalent-ratio-table": "같은 비를 나타내는 표",
    "fraction-strip": "분수 띠",
    "factor-tree-and-division-chain": "소인수 나무와 나눗셈 사슬",
    "number-line": "수직선",
    "expression-structure-tree": "식 구조 나무",
    "balance-and-equal-groups": "등식 저울과 같은 묶음",
    "input-output-table": "입력·출력 표",
    "fully-labeled-coordinate-polygon": "좌표가 표시된 복합도형",
    "paired-dot-plots": "두 점그래프",
    "ordered-list-and-dot-plot": "정렬 자료와 점그래프"
  });

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  }

  function svgElement(tag, attributes, text) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attributes || {}).forEach(function (name) { node.setAttribute(name, String(attributes[name])); });
    if (text != null) node.textContent = String(text);
    return node;
  }

  function visualFigure(label) {
    const figure = element("figure", "math-visual");
    const caption = element("figcaption", "visual-caption", label);
    figure.append(caption);
    return figure;
  }

  function dataTable(captionText, headers, rows) {
    const table = element("table", "model-table");
    const caption = element("caption", "", captionText);
    table.append(caption);
    const head = element("thead");
    const headRow = element("tr");
    headers.forEach(function (header) { const cell = element("th", "", header); cell.scope = "col"; headRow.append(cell); });
    head.append(headRow);
    const body = element("tbody");
    rows.forEach(function (row) {
      const rowElement = element("tr");
      row.forEach(function (value, index) {
        const cell = element(index === 0 ? "th" : "td", "", value);
        if (index === 0) cell.scope = "row";
        rowElement.append(cell);
      });
      body.append(rowElement);
    });
    table.append(head, body);
    return table;
  }

  function labeledSvg(label, viewBox) {
    const svg = svgElement("svg", { class: "model-svg", viewBox, role: "img", "aria-label": label, focusable: "false" });
    svg.append(svgElement("title", {}, label));
    return svg;
  }

  function renderRepresentationVisual(type) {
    const figure = visualFigure(REPRESENTATION_LABELS[type] || type);
    let svg;
    if (type === "equivalent-ratio-table") {
      figure.append(dataTable("공책 수와 가격의 같은 비 표", ["항목", "8권", "4권", "2권", "14권"], [["가격", "12달러", "6달러", "3달러", "21달러"]]));
      figure.append(element("p", "visual-note", "8권 : 12달러와 14권 : 21달러는 한 권당 3/2달러로 같은 관계입니다."));
    } else if (type === "fraction-strip") {
      const strip = element("div", "fraction-strip-model");
      strip.setAttribute("role", "img");
      strip.setAttribute("aria-label", "전체 1을 8등분한 띠. 처음 6칸은 3/4 또는 6/8이고, 각 칸은 1/8입니다.");
      for (let index = 0; index < 8; index += 1) strip.append(element("span", index < 6 ? "fraction-cell filled" : "fraction-cell", index < 6 ? "1/8" : ""));
      figure.append(strip, element("p", "visual-note", "3/4 = 6/8이므로 1/8짜리 묶음이 6개입니다."));
    } else if (type === "factor-tree-and-division-chain") {
      svg = labeledSvg("84와 60의 소인수 나무. 84는 2 곱하기 2 곱하기 3 곱하기 7, 60은 2 곱하기 2 곱하기 3 곱하기 5입니다.", "0 0 660 280");
      const edges = [[120,52,70,110],[120,52,170,110],[170,142,140,194],[170,142,215,194],[215,226,190,254],[215,226,245,254],[450,52,400,110],[450,52,500,110],[500,142,470,194],[500,142,545,194],[545,226,520,254],[545,226,575,254]];
      edges.forEach(function (edge) { svg.append(svgElement("line", { x1: edge[0], y1: edge[1], x2: edge[2], y2: edge[3], class: "tree-line" })); });
      [[120,34,"84"],[70,126,"2"],[170,126,"42"],[140,210,"2"],[215,210,"21"],[190,264,"3"],[245,264,"7"],[450,34,"60"],[400,126,"2"],[500,126,"30"],[470,210,"2"],[545,210,"15"],[520,264,"3"],[575,264,"5"]].forEach(function (node) {
        svg.append(svgElement("circle", { cx: node[0], cy: node[1], r: 20, class: "tree-node" }));
        svg.append(svgElement("text", { x: node[0], y: node[1] + 5, "text-anchor": "middle", class: "svg-label" }, node[2]));
      });
      figure.append(svg, element("p", "division-chain", "84 = 60 × 1 + 24 → 60 = 24 × 2 + 12 → 24 = 12 × 2 + 0"), element("p", "visual-note", "공통 소인수 2 × 2 × 3 = 12이므로 최대공약수는 12입니다."));
    } else if (type === "number-line") {
      svg = labeledSvg("-2부터 0까지 12등분한 수직선. -7/4는 -21/12에, -5/3은 -20/12에 표시되어 있으며 -7/4가 더 왼쪽입니다.", "0 0 620 170");
      svg.append(svgElement("line", { x1: 48, y1: 78, x2: 572, y2: 78, class: "axis-line" }));
      for (let index = 0; index <= 12; index += 1) {
        const x = 48 + index * 43.67;
        svg.append(svgElement("line", { x1: x, y1: 68, x2: x, y2: 88, class: index % 6 === 0 ? "major-tick" : "minor-tick" }));
        if (index % 6 === 0) svg.append(svgElement("text", { x, y: 112, "text-anchor": "middle", class: "svg-label" }, String(-2 + index / 6)));
      }
      [[0.25, "-7/4", "mark-orange"], [0.3333333, "-5/3", "mark-green"]].forEach(function (mark, index) {
        const x = 48 + mark[0] * 262;
        svg.append(svgElement("line", { x1: x, y1: 78, x2: x, y2: index ? 126 : 28, class: mark[2] }));
        svg.append(svgElement("circle", { cx: x, cy: 78, r: 6, class: mark[2] }));
        svg.append(svgElement("text", { x, y: index ? 148 : 20, "text-anchor": "middle", class: "svg-label" }, mark[1]));
      });
      figure.append(svg, element("p", "visual-note", "-7/4 = -21/12이고 -5/3 = -20/12입니다. -21/12가 수직선에서 더 왼쪽입니다."));
    } else if (type === "expression-structure-tree") {
      svg = labeledSvg("식 3 곱하기 괄호 2의 3제곱 더하기 4, 빼기 5의 구조 나무. 루트는 빼기이고 왼쪽 곱셈 안에 3과 괄호 안 덧셈이 있습니다.", "0 0 680 310");
      [[340,58,240,88],[340,58,500,88],[240,132,150,168],[240,132,330,168],[330,212,270,248],[330,212,390,248]].forEach(function (edge) {
        svg.append(svgElement("line", { x1: edge[0], y1: edge[1], x2: edge[2], y2: edge[3], class: "tree-line" }));
      });
      [[340,36,"−",false],[240,110,"×",false],[500,110,"5",true],[150,190,"3",true],[330,190,"+",false],[270,270,"2³",true],[390,270,"4",true]].forEach(function (node) {
        svg.append(svgElement("rect", { x: node[0] - 44, y: node[1] - 22, width: 88, height: 44, rx: 8, class: node[3] ? "tree-node inner" : "tree-node" }));
        svg.append(svgElement("text", { x: node[0], y: node[1] + 6, "text-anchor": "middle", class: "svg-label" }, node[2]));
      });
      figure.append(svg, element("p", "visual-note", "2³ → 8, 8 + 4 → 12, 3 × 12 → 36, 36 − 5 → 31입니다."));
    } else if (type === "balance-and-equal-groups") {
      const balance = element("div", "balance-model");
      balance.setAttribute("role", "img");
      balance.setAttribute("aria-label", "균형을 이룬 식 6x = 42. 왼쪽에는 같은 상자 여섯 개, 오른쪽에는 42가 있습니다. 상자 하나는 7입니다.");
      const left = element("div", "balance-side");
      for (let index = 0; index < 6; index += 1) left.append(element("span", "x-box", "x"));
      const balanceResult = element("div", "balance-result");
      balanceResult.append(element("span", "balance-equals", "="), element("strong", "balance-total", "42"));
      balance.append(left, balanceResult);
      figure.append(element("p", "visual-equation", "6x = 42"), balance, element("p", "visual-note", "양쪽을 6으로 나누면 같은 상자 하나의 값은 x = 7입니다."));
    } else if (type === "input-output-table") {
      figure.append(dataTable("관계식 y = 3x + 2의 입력·출력 표", ["x (입력)", "0", "1", "2", "7"], [["y (출력)", "2", "5", "8", "23"]]), element("p", "visual-note", "x가 1 늘 때 y는 3씩 늘고, x = 0일 때 y = 2입니다."));
    } else if (type === "fully-labeled-coordinate-polygon") {
      svg = labeledSvg("좌표평면 위 꼭짓점 (0,0), (8,0), (8,4), (4,4), (4,6), (0,6)을 이은 L자 도형.", "0 0 620 460");
      const originX = 76; const originY = 382; const unit = 42;
      for (let index = 0; index <= 8; index += 1) {
        svg.append(svgElement("line", { x1: originX + index * unit, y1: 46, x2: originX + index * unit, y2: originY, class: "grid-line" }));
        svg.append(svgElement("text", { x: originX + index * unit, y: 408, "text-anchor": "middle", class: "svg-label" }, index));
      }
      for (let index = 0; index <= 6; index += 1) {
        svg.append(svgElement("line", { x1: originX, y1: originY - index * unit, x2: 538, y2: originY - index * unit, class: "grid-line" }));
        svg.append(svgElement("text", { x: 58, y: originY - index * unit + 5, "text-anchor": "middle", class: "svg-label" }, index));
      }
      svg.append(svgElement("polygon", { points: "76,382 412,382 412,214 244,214 244,130 76,130", class: "coordinate-polygon" }));
      [[0,0],[8,0],[8,4],[4,4],[4,6],[0,6]].forEach(function (point) {
        const x = originX + point[0] * unit; const y = originY - point[1] * unit;
        svg.append(svgElement("circle", { cx: x, cy: y, r: 5, class: "vertex-dot" }));
        svg.append(svgElement("text", { x: x + 8, y: y - 9, class: "svg-label" }, `(${point[0]},${point[1]})`));
      });
      figure.append(svg);
    } else if (type === "paired-dot-plots") {
      svg = labeledSvg("같은 눈금의 자료 A와 B 점그래프. 두 자료의 평균은 8이지만 A가 더 넓게 퍼져 있습니다.", "0 0 620 270");
      [["A", [4,6,8,10,12], 72], ["B", [7,7,8,9,9], 188]].forEach(function (series) {
        const baseline = series[2];
        svg.append(svgElement("text", { x: 24, y: baseline + 4, class: "svg-label" }, `자료 ${series[0]}`));
        svg.append(svgElement("line", { x1: 80, y1: baseline, x2: 570, y2: baseline, class: "axis-line" }));
        for (let value = 4; value <= 12; value += 1) {
          const x = 100 + (value - 4) * 56;
          svg.append(svgElement("line", { x1: x, y1: baseline - 6, x2: x, y2: baseline + 6, class: "minor-tick" }));
          if (series[0] === "B") svg.append(svgElement("text", { x, y: baseline + 25, "text-anchor": "middle", class: "svg-label" }, value));
        }
        const stack = {};
        series[1].forEach(function (value) { stack[value] = (stack[value] || 0) + 1; const x = 100 + (value - 4) * 56; svg.append(svgElement("circle", { cx: x, cy: baseline - stack[value] * 18, r: 7, class: series[0] === "A" ? "dot-a" : "dot-b" })); });
        svg.append(svgElement("line", { x1: 324, y1: baseline - 60, x2: 324, y2: baseline + 7, class: "mean-line" }));
      });
      figure.append(svg, element("p", "visual-note", "두 자료의 평균은 8이지만 A는 4부터 12까지, B는 7부터 9까지 놓여 있습니다."));
    } else if (type === "ordered-list-and-dot-plot") {
      const ordered = element("p", "ordered-data", "정렬한 자료: 2, 4, 4, 6, 9");
      svg = labeledSvg("정렬된 자료 2, 4, 4, 6, 9의 점그래프. 값 4 위에는 점 두 개가 쌓여 있습니다.", "0 0 620 160");
      svg.append(svgElement("line", { x1: 66, y1: 100, x2: 570, y2: 100, class: "axis-line" }));
      for (let value = 2; value <= 9; value += 1) {
        const x = 82 + (value - 2) * 66;
        svg.append(svgElement("line", { x1: x, y1: 94, x2: x, y2: 106, class: "minor-tick" }), svgElement("text", { x, y: 130, "text-anchor": "middle", class: "svg-label" }, value));
      }
      [[2,1],[4,1],[4,2],[6,1],[9,1]].forEach(function (dot) { svg.append(svgElement("circle", { cx: 82 + (dot[0] - 2) * 66, cy: 100 - dot[1] * 22, r: 8, class: "dot-a" })); });
      figure.append(ordered, svg, element("p", "visual-note", "가운데 값은 4, 가장 작은 값과 큰 값의 차는 9 − 2 = 7입니다."));
    }
    if (figure.querySelector(".model-svg")) {
      figure.classList.add("has-scrollable-svg");
      figure.insertBefore(element("p", "diagram-scroll-hint", "작은 화면에서는 그림을 좌우로 밀어 전체를 확인하세요."), figure.children[1] || null);
    }
    return figure;
  }

  function selectedCluster() {
    const requested = new URLSearchParams(window.location.search).get("cluster");
    return content.lessons.some(function (lesson) { return lesson.lineage.clusterId === requested; })
      ? requested
      : content.lessons[0].lineage.clusterId;
  }

  function setClusterInUrl(clusterId, preserveDiagnosticSource) {
    const url = new URL(window.location.href);
    url.searchParams.set("cluster", clusterId);
    if (!preserveDiagnosticSource) url.searchParams.delete("from");
    window.history.replaceState({ clusterId }, "", url);
  }

  function cameFromDiagnostic() {
    return new URLSearchParams(window.location.search).get("from") === "diagnostic";
  }

  function renderClinicRoute(clusterId) {
    if (!clinicPaths) return null;
    const fromDiagnostic = cameFromDiagnostic();
    let workbookCompleted = false;
    try { workbookCompleted = window.localStorage.getItem(clinicPaths.completionKey(clusterId)) === "complete-v1"; }
    catch (error) { workbookCompleted = false; }
    const route = clinicPaths.routeFor(clusterId, { fromDiagnostic: fromDiagnostic, workbookCompleted: workbookCompleted });
    const section = element("section", "clinic-route");
    section.setAttribute("aria-label", "진단에서 학습과 재확인까지의 현재 경로");

    const heading = element("div", "clinic-route-heading");
    heading.append(
      element("p", "micro-label", fromDiagnostic ? "DIAGNOSTIC CLINIC · CONNECTED" : "LEARNING PATH"),
      element("h3", "", fromDiagnostic ? "진단 결과에서 이 개념으로 연결되었습니다" : "이 개념의 다음 학습 경로")
    );
    section.append(heading);

    const steps = element("ol", "clinic-route-grid");
    const analysis = element("li", "clinic-route-step is-complete");
    analysis.append(element("span", "clinic-step-number", "01"), element("strong", "", "분석"), element("small", "", fromDiagnostic ? "영역·유형 연결 완료" : "개념 직접 선택"));
    const conceptStep = element("li", "clinic-route-step is-current");
    conceptStep.append(element("span", "clinic-step-number", "02"), element("strong", "", "현재 개념"), element("small", "", clusterId));
    const animation = element("li", "clinic-route-step " + (route.animated.state === "available" ? "is-ready" : "is-locked"));
    animation.append(element("span", "clinic-step-number", "03"), element("strong", "", "시각 강의"));
    if (route.animated.state === "available") {
      const link = element("a", "clinic-action-link", route.animated.labelKo + " 보기 →");
      link.href = route.animated.url;
      link.dataset.clinicAction = "animated";
      animation.append(link);
    } else {
      animation.append(element("small", "", "이 영역은 정확한 대응 강의 검수 대기"));
    }
    const workbook = element("li", "clinic-route-step " + (route.workbook.state === "available" ? "is-ready" : "is-locked"));
    workbook.append(element("span", "clinic-step-number", "04"), element("strong", "", "맞춤 워크북"));
    if (route.workbook.state === "available") {
      const workbookLink = element("a", "clinic-action-link", route.workbook.labelKo + " 시작 →");
      workbookLink.href = route.workbook.url;
      workbookLink.dataset.clinicAction = "workbook";
      workbook.append(workbookLink);
    } else {
      workbook.append(element("small", "", "이 영역은 문항·해설 검수 대기"));
    }
    const recheck = element("li", "clinic-route-step " + (route.recheck.state === "available" ? "is-ready" : "is-locked"));
    recheck.append(element("span", "clinic-step-number", "05"), element("strong", "", "재확인"));
    if (route.recheck.state === "available") {
      const recheckLink = element("a", "clinic-action-link", route.recheck.labelKo + " 시작 →");
      recheckLink.href = route.recheck.url;
      recheckLink.dataset.clinicAction = "recheck";
      recheck.append(recheckLink);
    } else {
      recheck.append(element("small", "", route.recheck.state === "locked-after-learning" ? "워크북 12문항 완료 후 열림" : "문항 검수 대기"));
    }
    steps.append(analysis, conceptStep, animation, workbook, recheck);
    section.append(steps);
    return section;
  }

  function renderMethod(method, index) {
    const card = element("section", "example-method");
    card.append(element("span", "method-number", String(index + 1).padStart(2, "0")), element("h4", "", method.nameKo));
    const steps = element("ol", "method-steps");
    method.stepsKo.forEach(function (step) { steps.append(element("li", "", step)); });
    card.append(steps);
    return card;
  }

  function renderLesson(clusterId, moveFocus) {
    const lesson = content.lessons.find(function (candidate) { return candidate.lineage.clusterId === clusterId; });
    if (!lesson) return;
    setClusterInUrl(clusterId, !moveFocus);
    document.querySelectorAll("#concept-list button").forEach(function (button) {
      const active = button.dataset.cluster === clusterId;
      button.setAttribute("aria-current", active ? "page" : "false");
    });

    const host = document.getElementById("lesson");
    host.replaceChildren();
    const header = element("header", "lesson-header");
    header.append(element("p", "lesson-lineage", `GRADE 6 · ${DOMAIN_LABELS[lesson.lineage.domainCode] || lesson.lineage.domainCode} · ${lesson.lineage.clusterId}`));
    header.append(element("h2", "", lesson.titleKo));
    header.append(element("p", "lesson-standard", `클러스터 범위 ${lesson.lineage.standardRange} · 대표 개념 1개 · 범위 전체 숙달 평가는 아님`));
    host.append(header);
    const clinicRoute = renderClinicRoute(clusterId);
    if (clinicRoute) host.append(clinicRoute);

    const concept = element("section", "lesson-section concept-explanation");
    concept.append(element("span", "section-number", "01"), element("h3", "", "개념을 이해합니다"), element("p", "lesson-copy", lesson.conceptExplanationKo));
    host.append(concept);

    const model = element("section", "lesson-section representation-section");
    model.append(element("span", "section-number", "02"), element("h3", "", "눈에 보이는 표현으로 바꿉니다"));
    const modelCard = element("div", "representation-card");
    modelCard.append(element("p", "representation-type", REPRESENTATION_LABELS[lesson.representation.type] || lesson.representation.type), element("strong", "", lesson.representation.descriptionKo));
    const facts = element("ul", "visible-facts");
    lesson.representation.visibleFactsKo.forEach(function (fact) { facts.append(element("li", "", fact)); });
    modelCard.append(renderRepresentationVisual(lesson.representation.type), facts);
    model.append(modelCard);
    host.append(model);

    const example = element("section", "lesson-section worked-example");
    example.append(element("span", "section-number", "03"), element("h3", "", "완전 풀이 예제로 확인합니다"));
    const exampleIntro = element("div", "example-intro");
    exampleIntro.append(element("p", "micro-label", "WORKED EXAMPLE · 평가 아님"), element("h4", "", lesson.workedExample.titleKo), element("p", "", lesson.workedExample.situationKo));
    example.append(exampleIntro);
    const methods = element("div", "example-methods");
    lesson.workedExample.methods.forEach(function (method, index) { methods.append(renderMethod(method, index)); });
    example.append(methods);
    const result = element("div", "example-result");
    result.append(element("strong", "", lesson.workedExample.conclusionKo), element("p", "", lesson.workedExample.verificationKo));
    example.append(result);
    host.append(example);

    const reflect = element("section", "lesson-section reflection-section");
    reflect.append(element("span", "section-number", "04"), element("h3", "", "오해를 고치고 내 말로 설명합니다"));
    const misconception = element("div", "misconception-card");
    misconception.append(element("strong", "", "자주 하는 오해"), element("p", "", lesson.commonMisconceptionKo));
    const prompt = element("div", "reflection-prompt");
    prompt.append(element("strong", "", "스스로 설명하기"), element("p", "", lesson.guidedReflection.instructionKo));
    reflect.append(misconception, prompt);
    host.append(reflect);

    const gate = element("section", "checkpoint-gate");
    gate.append(element("span", "gate-mark", "NEXT"));
    const gateCopy = element("div");
    gateCopy.append(element("strong", "", "개념 확인 문제는 교사 배정 뒤 열립니다."), element("p", "", "현재 예제는 학습용이며 점수나 승급을 자동 결정하지 않습니다. 검수된 확인 문항과 유지 확인은 별도 학습 배정으로 연결합니다."));
    gate.append(gateCopy);
    host.append(gate);

    const controls = element("nav", "lesson-controls", "");
    controls.setAttribute("aria-label", "이전·다음 개념");
    const currentIndex = content.lessons.indexOf(lesson);
    const previous = element("button", "lesson-nav-button", "← 이전 개념");
    previous.type = "button";
    previous.disabled = currentIndex === 0;
    previous.addEventListener("click", function () { renderLesson(content.lessons[currentIndex - 1].lineage.clusterId, true); });
    const next = element("button", "lesson-nav-button primary", currentIndex === content.lessons.length - 1 ? "10개 개념 완료" : "다음 개념 →");
    next.type = "button";
    next.disabled = currentIndex === content.lessons.length - 1;
    next.addEventListener("click", function () { renderLesson(content.lessons[currentIndex + 1].lineage.clusterId, true); });
    controls.append(previous, next);
    host.append(controls);
    document.title = `${lesson.titleKo} · GFIELD Math`;
    if (moveFocus) {
      host.focus({ preventScroll: true });
      host.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function renderIndex() {
    const host = document.getElementById("concept-list");
    content.lessons.forEach(function (lesson, index) {
      const button = element("button", "concept-index-button");
      button.type = "button";
      button.dataset.cluster = lesson.lineage.clusterId;
      button.append(element("span", "concept-index-number", String(index + 1).padStart(2, "0")));
      const copy = element("span", "concept-index-copy");
      copy.append(element("strong", "", DOMAIN_LABELS[lesson.lineage.domainCode] || lesson.lineage.domainCode), element("small", "", lesson.titleKo));
      button.append(copy, element("span", "concept-index-arrow", "→"));
      button.addEventListener("click", function () { renderLesson(lesson.lineage.clusterId, true); });
      host.append(button);
    });
  }

  if (!content || !Array.isArray(content.lessons) || content.lessons.length !== 10) {
    document.getElementById("lesson").replaceChildren(element("p", "lesson-error", "개념 자료 계약을 확인할 수 없습니다."));
    return;
  }
  renderIndex();
  renderLesson(selectedCluster(), false);
  window.addEventListener("popstate", function () { renderLesson(selectedCluster(), false); });
})();
