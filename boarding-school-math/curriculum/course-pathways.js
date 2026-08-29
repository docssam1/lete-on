(function (root, factory) {
  const pathways = factory();
  if (typeof module === "object" && module.exports) module.exports = pathways;
  if (root) root.GFIELDMathCoursePathways = pathways;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const coursePathways = Object.freeze([
    Object.freeze({
      id: "elementary-foundations",
      title: "Elementary Foundations",
      grades: "K–5",
      summary: "수 감각, 연산 의미, 분수, 측정과 도형의 기초를 다음 과정의 언어로 다집니다.",
      prerequisites: "입학·현재 학년 수준의 수 감각과 연산 근거",
      focus: ["Number sense", "Operations", "Fractions", "Measurement & Geometry"],
      units: ["Number & operations", "Fractions", "Measurement & geometry", "Data & problem solving"],
      next: "Pre-Algebra",
      studentHref: "./catalog.html?role=student&grade=5",
      teacherHref: "./catalog.html?role=teacher&grade=5",
      availability: "학년·영역·클러스터 구조 공개 · 문항·워크북은 검수 잠금"
    }),
    Object.freeze({
      id: "pre-algebra",
      title: "Pre-Algebra",
      grades: "G6–8",
      summary: "비와 비례, 유리수, 식·방정식, 함수적 사고, 기하와 자료를 Algebra 1으로 연결합니다.",
      prerequisites: "분수·소수 연산, 비율 이해, 좌표와 도형 기초",
      focus: ["Ratios & proportional reasoning", "Rational numbers", "Expressions & equations", "Functions"],
      units: ["Ratios & rational numbers", "Expressions & equations", "Functions & coordinate reasoning", "Geometry, statistics & probability"],
      next: "Algebra 1",
      studentHref: "./concept-learning.html",
      teacherHref: "./catalog.html?role=teacher&grade=6",
      availability: "Grade 6 개념 10개 공개 · 전체 진단·워크북은 검수 잠금"
    }),
    Object.freeze({
      id: "algebra-1",
      title: "Algebra 1",
      grades: "typically G8–10",
      summary: "선형·지수 관계, 방정식과 부등식, 함수 표현을 모델링과 문제 해결로 확장합니다.",
      prerequisites: "Pre-Algebra의 비례·유리수·식과 방정식 근거",
      focus: ["Linear relationships", "Equations & inequalities", "Exponents", "Functions & modeling"],
      units: ["Linear relationships & systems", "Equations, inequalities & expressions", "Exponential & quadratic relationships", "Functions, data & modeling"],
      next: "Geometry / Algebra 2",
      studentHref: "#availability",
      teacherHref: "#high-school-bridge",
      availability: "과정 지도 공개 · 세부 교차표와 수업 자료는 검수 대기"
    }),
    Object.freeze({
      id: "geometry",
      title: "Geometry",
      grades: "typically G9–10",
      summary: "도형의 관계, 닮음·합동, 증명과 좌표·변환을 논리적 추론으로 연결합니다.",
      prerequisites: "Algebraic manipulation과 좌표·비례의 근거",
      focus: ["Congruence & similarity", "Proof & reasoning", "Coordinate geometry", "Measurement"],
      units: ["Transformations, congruence & proof", "Similarity, right triangles & trigonometry", "Coordinate geometry & circles", "Measurement, volume & modeling"],
      next: "Algebra 2",
      studentHref: "#availability",
      teacherHref: "#high-school-bridge",
      availability: "과정 지도 공개 · 세부 교차표와 수업 자료는 검수 대기"
    }),
    Object.freeze({
      id: "algebra-2",
      title: "Algebra 2",
      grades: "typically G10–11",
      summary: "다항식·유리식·지수와 로그·수열·함수를 여러 표현과 모델링으로 심화합니다.",
      prerequisites: "Algebra 1 함수와 식 조작, Geometry의 좌표·추론 근거",
      focus: ["Polynomial & rational functions", "Exponentials & logarithms", "Sequences", "Statistics & modeling"],
      units: ["Polynomial & rational functions", "Exponential & logarithmic functions", "Trigonometric, complex & sequence reasoning", "Statistics, probability & modeling"],
      next: "Precalculus / AMC 12 bridge",
      studentHref: "#availability",
      teacherHref: "#high-school-bridge",
      availability: "과정 지도 공개 · 세부 교차표와 수업 자료는 검수 대기"
    }),
    Object.freeze({
      id: "precalculus",
      title: "Precalculus",
      grades: "typically G11–12",
      summary: "함수·삼각함수·벡터·수열과 극한 준비를 대학 수학과 심화 경시로 가교합니다.",
      prerequisites: "Algebra 2 함수·지수·로그·수열 근거",
      focus: ["Function families", "Trigonometry", "Vectors & complex numbers", "Sequences & limits readiness"],
      units: ["Function families & modeling", "Trigonometry & analytic geometry", "Vectors, matrices & complex numbers", "Sequences, limits readiness & data"],
      next: "College math / AMC 12 extension",
      studentHref: "#availability",
      teacherHref: "#high-school-bridge",
      availability: "과정 지도 공개 · 세부 교차표와 수업 자료는 검수 대기"
    })
  ]);

  const ids = coursePathways.map(function (course) { return course.id; });
  if (new Set(ids).size !== ids.length) throw new Error("course pathway ids must be unique");
  coursePathways.forEach(function (course) {
    if (!course.title || !course.grades || !course.prerequisites || !course.next || !Array.isArray(course.focus) || course.focus.length !== 4 || !Array.isArray(course.units) || course.units.length !== 4) {
      throw new Error(`course pathway ${course.id} is incomplete`);
    }
  });

  return Object.freeze({
    sequenceState: "school-configured",
    sequenceNotice: "과정명과 일반적인 학년 범위는 안내용입니다. 실제 순서·배치·승급은 학교가 설정하고 교사가 검토합니다.",
    courses: coursePathways
  });
});
