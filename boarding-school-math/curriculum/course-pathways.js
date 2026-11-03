(function (root, factory) {
  const pathways = factory();
  if (typeof module === "object" && module.exports) module.exports = pathways;
  if (root) root.GFIELDMathCoursePathways = pathways;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const coursePathways = Object.freeze([
    Object.freeze({
      id: "elementary-foundations",
      title: "초등 수학 기초",
      grades: "초등 K–5",
      summary: "수 감각, 연산 의미, 분수, 측정과 도형의 기초를 다음 과정의 언어로 다집니다.",
      prerequisites: "입학·현재 학년 수준의 수 감각과 연산 근거",
      focus: ["Number sense", "Operations", "Fractions", "Measurement & Geometry"],
      units: ["Number & operations", "Fractions", "Measurement & geometry", "Data & problem solving"],
      previousOptions: [],
      nextOptions: ["pre-algebra"],
      next: "Pre-Algebra",
      studentHref: "./catalog.html?role=student&grade=5",
      teacherHref: "./catalog.html?role=teacher&grade=5",
      availability: "학년·영역·클러스터 구조 공개 · 문항·워크북은 검수 잠금"
    }),
    Object.freeze({
      id: "pre-algebra",
      title: "Pre-Algebra",
      grades: "주로 6–8학년",
      summary: "비와 비례, 유리수, 식·방정식, 함수적 사고, 기하와 자료를 Algebra 1으로 연결합니다.",
      prerequisites: "분수·소수 연산, 비율 이해, 좌표와 도형 기초",
      focus: ["Ratios & proportional reasoning", "Rational numbers", "Expressions & equations", "Functions"],
      units: ["Ratios & rational numbers", "Expressions & equations", "Functions & coordinate reasoning", "Geometry, statistics & probability"],
      previousOptions: ["elementary-foundations"],
      nextOptions: ["algebra-1"],
      next: "Algebra 1",
      studentHref: "./prealgebra-path.html",
      teacherHref: "./prealgebra-workbook.html?edition=teacher",
      availability: "지필드 자체 Pre-Algebra 4단원·27차시·54문항 공개 · 개념 수업 10개·검수 워크북 8종 연결 · 진단·배치 별도"
    }),
    Object.freeze({
      id: "algebra-1",
      title: "Algebra 1",
      grades: "주로 8–10학년",
      summary: "선형·지수 관계, 방정식과 부등식, 함수 표현을 모델링과 문제 해결로 확장합니다.",
      prerequisites: "Pre-Algebra의 비례·유리수·식과 방정식 근거",
      focus: ["Linear relationships", "Equations & inequalities", "Exponents", "Functions & modeling"],
      units: ["Linear relationships & systems", "Equations, inequalities & expressions", "Exponential & quadratic relationships", "Functions, data & modeling"],
      previousOptions: ["pre-algebra"],
      nextOptions: ["geometry", "algebra-2"],
      next: "Geometry / Algebra 2 · 학교 순서에 따라 선택",
      studentHref: "./algebra1-workbook.html",
      teacherHref: "./algebra1-workbook.html?edition=teacher",
      availability: "지필드 원본 5단원·32차시·64문항 공개 · 학교 과목 순서에 맞춰 선택"
    }),
    Object.freeze({
      id: "geometry",
      title: "Geometry",
      grades: "주로 9–10학년",
      summary: "변환·합동·증명, 닮음과 삼각비, 원, 좌표기하, 측정과 모델링을 관계와 근거로 연결합니다.",
      prerequisites: "대수식 조작, 좌표·비례 관계에 대한 이해",
      focus: ["Transformations & congruence", "Similarity & trigonometry", "Circles", "Coordinate geometry", "Measurement & modeling"],
      units: ["Transformations, congruence & proof", "Similarity, right triangles & trigonometry", "Circle relationships & sectors", "Coordinate geometry & circles", "Measurement, volume & modeling"],
      previousOptions: ["algebra-1"],
      nextOptions: ["algebra-2"],
      next: "Algebra 2",
      studentHref: "./geometry-workbook.html",
      teacherHref: "./geometry-workbook.html?edition=teacher",
      availability: "지필드 원본 5단원·16차시·32문항 공개 · 학교 과목 순서에 맞춰 선택"
    }),
    Object.freeze({
      id: "algebra-2",
      title: "Algebra 2",
      grades: "주로 10–11학년",
      summary: "다항식·이차함수·유리식·지수와 로그·수열을 식, 그래프, 상황 모델로 연결합니다.",
      prerequisites: "Algebra 1 함수와 식 조작, Geometry의 좌표·추론 근거",
      focus: ["Polynomial structure", "Quadratic functions", "Rational expressions & functions", "Exponential & logarithmic models", "Sequences"],
      units: ["Polynomial structure & operations", "Quadratic functions & equations", "Rational expressions & functions", "Exponential & logarithmic models", "Sequences & optional extensions"],
      previousOptions: ["algebra-1", "geometry"],
      nextOptions: ["geometry", "precalculus"],
      next: "Precalculus / AMC 12 bridge",
      studentHref: "./algebra2-workbook.html",
      teacherHref: "./algebra2-workbook.html?edition=teacher",
      availability: "지필드 원본 5단원·18차시·36문항 공개 · 복소수·행렬은 준비도에 따른 선택 확장"
    }),
    Object.freeze({
      id: "precalculus",
      title: "Precalculus",
      grades: "주로 11–12학년",
      summary: "함수 변환과 다항·유리함수에서 지수·로그·수열, 단위원·삼각함수, 벡터·복소수까지 연결하고 극좌표 표현은 선택 심화로 다룹니다.",
      prerequisites: "Algebra 2 함수·지수·로그·수열 근거",
      focus: ["Function structure & transformations", "Polynomial & rational functions", "Exponential, logarithmic & sequence models", "Unit circle & trigonometry", "Vectors, complex numbers, polar coordinates & modeling"],
      units: ["Functions & transformations", "Polynomial & rational function graphs", "Exponential, logarithmic & sequence models", "Trigonometry & unit circle", "Vectors, complex numbers, polar coordinates & model choice"],
      previousOptions: ["algebra-2"],
      nextOptions: [],
      next: "College math / AMC 12 extension",
      studentHref: "./precalculus-workbook.html",
      teacherHref: "./precalculus-workbook.html?edition=teacher",
      availability: "지필드 원본 5단원·16차시·32문항 공개 · 극좌표는 선택 심화 · 극한·미적분은 범위에 포함하지 않음"
    })
  ]);

  const ids = coursePathways.map(function (course) { return course.id; });
  if (new Set(ids).size !== ids.length) throw new Error("course pathway ids must be unique");
  coursePathways.forEach(function (course) {
    if (!course.title || !course.grades || !course.prerequisites || !course.next || !Array.isArray(course.previousOptions) || !Array.isArray(course.nextOptions) || !Array.isArray(course.focus) || course.focus.length < 4 || !Array.isArray(course.units) || course.units.length < 4) {
      throw new Error(`course pathway ${course.id} is incomplete`);
    }
  });

  return Object.freeze({
    sequenceState: "school-configured",
    sequenceNotice: "과정명과 일반적인 학년 범위는 안내용입니다. 실제 순서·배치·승급은 학교가 설정하고 교사가 검토합니다.",
    courses: coursePathways
  });
});
