(function () {
  "use strict";
  const course = window.GFIELDMathCourse || window.GFIELDAlgebra1Course;
  const host = document.getElementById("workbook-pages");
  const unitSelect = document.getElementById("unit-select");
  const editionSelect = document.getElementById("edition-select");
  const printButton = document.getElementById("print-workbook");
  const status = document.getElementById("workbook-status");
  if (!course || !host) throw new Error("GFIELD_MATH_WORKBOOK_SOURCE_MISSING");
  const query = new URLSearchParams(location.search);

  function node(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content != null) {
      if (window.GFIELDMathText) window.GFIELDMathText.append(element, content);
      else element.textContent = content;
    }
    return element;
  }
  function page(className) {
    const element = node("article", "print-page " + className);
    element.dataset.pageNumber = String(host.children.length + 1);
    element.setAttribute("aria-label", className === "cover-page" ? "교재 표지" : "교재 본문");
    return element;
  }
  function addCover(units, edition) {
    const cover = page("cover-page");
    cover.append(node("p", "series-mark", "GFIELD MATH · 지필드 자체 과정"));
    cover.append(node("p", "course-label", course.shortTitle || course.title));
    cover.append(node("h1", "", units.length === 1 ? units[0].title : course.title));
    cover.append(node("p", "cover-subtitle", units.length === 1 ? units[0].question : course.scope));
    const count = units.reduce(function (sum, unit) { return sum + unit.lessons.length; }, 0);
    cover.append(node("p", "cover-count", units.length + "개 단원 · " + count + "차시 · " + (edition === "teacher" ? "교사용 풀이 포함" : "연습 공간 포함")));
    const fields = node("div", "student-fields");
    ["이름", "반", "날짜"].forEach(function (label) {
      const field = node("div", ""); field.append(node("span", "", label), node("i", "")); fields.append(field);
    });
    cover.append(fields);
    cover.append(node("p", "scope-note", "학습 범위 표시는 Common Core 기준 코드이며, 수업 내용과 문제는 지필드가 작성했습니다."));
    host.append(cover);
  }
  function addUnitPage(unit, index) {
    const sheet = page("unit-page");
    sheet.setAttribute("aria-label", "단원 " + (index + 1) + " · " + unit.title);
    sheet.append(node("p", "running-label", "지필드 " + (course.shortTitle || course.title) + " · 단원 " + String(index + 1).padStart(2, "0")));
    sheet.append(node("h2", "unit-title", unit.title));
    sheet.append(node("p", "unit-question", unit.question));
    sheet.append(node("h3", "", "이 단원에서 익힐 내용"));
    const goals = node("ul", "unit-goals");
    unit.goals.forEach(function (goal) { goals.append(node("li", "", goal)); });
    sheet.append(goals);
    sheet.append(node("p", "standards", "학습 범위 코드 · " + unit.standards.join(" · ")));
    host.append(sheet);
  }
  function addLessonPage(unit, unitIndex, lesson, lessonIndex, edition) {
    const sheet = page("lesson-page");
    sheet.setAttribute("aria-label", unit.title + " · " + lesson.title);
    sheet.append(node("p", "running-label", "단원 " + String(unitIndex + 1).padStart(2, "0") + " · 차시 " + String(lessonIndex + 1).padStart(2, "0")));
    sheet.append(node("h2", "lesson-title", lesson.title));
    sheet.append(node("p", "objective", lesson.objective));
    const idea = node("section", "concept-note");
    idea.append(node("h3", "", "개념"), node("p", "", lesson.idea));
    sheet.append(idea);
    const example = node("section", "worked-example");
    example.append(node("h3", "", "예제"), node("p", "example-prompt", lesson.example.prompt));
    if (edition === "student") {
      example.append(node("p", "example-solution", lesson.example.solution));
    } else {
      example.append(node("p", "answer-label", "예제 풀이"), node("p", "teacher-answer", lesson.example.solution));
    }
    sheet.append(example);
    host.append(sheet);
    if (edition === "student") addPracticePage(unit, unitIndex, lesson, lessonIndex);
    else addTeacherKeyPage(unit, unitIndex, lesson, lessonIndex);
  }
  function addPracticePage(unit, unitIndex, lesson, lessonIndex) {
    const sheet = page("practice-page");
    sheet.setAttribute("aria-label", unit.title + " · " + lesson.title + " 연습 문제");
    sheet.append(node("p", "running-label", "단원 " + String(unitIndex + 1).padStart(2, "0") + " · 차시 " + String(lessonIndex + 1).padStart(2, "0") + " 연습"));
    sheet.append(node("h2", "practice-title", lesson.title));
    const practice = node("section", "practice-section");
    practice.append(node("h3", "", "직접 풀어 보기"));
    lesson.practice.forEach(function (exercise, exerciseIndex) {
      const item = node("article", "exercise");
      item.append(node("p", "exercise-number", "문제 " + (exerciseIndex + 1)));
      item.append(node("p", "exercise-prompt", exercise.prompt));
      item.append(node("div", "work-lines", "풀이"));
      practice.append(item);
    });
    sheet.append(practice);
    host.append(sheet);
  }
  function addTeacherKeyPage(unit, unitIndex, lesson, lessonIndex) {
    const sheet = page("answer-page");
    sheet.setAttribute("aria-label", unit.title + " · " + lesson.title + " 교사용 풀이");
    sheet.append(node("p", "running-label", "단원 " + String(unitIndex + 1).padStart(2, "0") + " · 차시 " + String(lessonIndex + 1).padStart(2, "0") + " 교사용"));
    sheet.append(node("h2", "practice-title", lesson.title + " · 정답과 풀이"));
    lesson.practice.forEach(function (exercise, exerciseIndex) {
      const item = node("article", "key-exercise");
      item.append(node("p", "exercise-number", "문제 " + (exerciseIndex + 1)));
      item.append(node("p", "exercise-prompt", exercise.prompt));
      item.append(node("p", "answer-label", "답"), node("p", "teacher-answer", exercise.answer));
      item.append(node("p", "teacher-feedback", exercise.feedback));
      sheet.append(item);
    });
    host.append(sheet);
  }
  function render() {
    const units = unitSelect.value === "all" ? course.units : course.units.filter(function (unit) { return unit.id === unitSelect.value; });
    const edition = editionSelect.value;
    host.replaceChildren();
    addCover(units, edition);
    units.forEach(function (unit) {
      const unitIndex = course.units.indexOf(unit);
      addUnitPage(unit, unitIndex);
      unit.lessons.forEach(function (lesson, lessonIndex) { addLessonPage(unit, unitIndex, lesson, lessonIndex, edition); });
    });
    const lessonCount = units.reduce(function (sum, unit) { return sum + unit.lessons.length; }, 0);
    const questionCount = units.reduce(function (sum, unit) { return sum + unit.lessons.reduce(function (subtotal, lesson) { return subtotal + lesson.practice.length; }, 0); }, 0);
    status.textContent = units.length + "개 단원 · " + lessonCount + "차시 · 연습 " + questionCount + "문항 · A4";
    document.body.dataset.edition = edition;
    document.body.dataset.courseId = course.id || "algebra-1";
    const url = new URL(location.href);
    if (unitSelect.value === "all") url.searchParams.delete("unit"); else url.searchParams.set("unit", unitSelect.value);
    url.searchParams.set("edition", edition);
    history.replaceState({}, "", url);
    document.title = (units.length === 1 ? units[0].title : course.title) + " · " + (edition === "teacher" ? "교사용" : "학생용") + " · GFIELD Math";
    printButton.textContent = edition === "teacher" ? "교사용 자료 인쇄 · PDF 저장" : "학생용 교재 인쇄 · PDF 저장";
    printButton.disabled = false;
  }
  course.units.forEach(function (unit, index) {
    const option = node("option", "", String(index + 1).padStart(2, "0") + " · " + unit.title);
    option.value = unit.id; unitSelect.append(option);
  });
  if (course.units.some(function (unit) { return unit.id === query.get("unit"); })) unitSelect.value = query.get("unit");
  if (["student", "teacher"].includes(query.get("edition"))) editionSelect.value = query.get("edition");
  unitSelect.addEventListener("change", render);
  editionSelect.addEventListener("change", render);
  printButton.addEventListener("click", function () { window.print(); });
  render();
})();
