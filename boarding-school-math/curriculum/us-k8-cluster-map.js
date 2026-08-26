(function (root, factory) {
  const spine = typeof module === "object" && module.exports
    ? require("./us-k8-domain-spine.js")
    : root.GFIELDUSK8DomainSpine;
  const api = factory(spine);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDUSK8ClusterMap = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (spine) {
  "use strict";

  if (!spine) throw new Error("GFIELDUSK8DomainSpine is required");

  const source = Object.freeze({
    authority: "Common Core State Standards Initiative",
    canonicalUrl: "https://corestandards.org/mathematics-standards/",
    adaPdfUrl: "https://corestandards.org/wp-content/uploads/2023/09/ADA-Compliant-Math-Standards.pdf",
    originalPdfUrl: "https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf",
    sourceRevision: "official-current-site-copy; PDF revision number not stated",
    lastVerified: "2026-08-26"
  });

  // These are short GFIELD labels keyed to official cluster IDs and standard ranges.
  // They paraphrase the source headings; they are not replacement standard text.
  const specs = Object.freeze({
    K: Object.freeze([
      ["CC", "A", "수 이름과 세기 순서", "Number Names and Counting Sequence", "1-3"],
      ["CC", "B", "물체 수 세기", "Count Objects", "4-5"],
      ["CC", "C", "수 비교", "Compare Numbers", "6-7"],
      ["OA", "A", "모으기와 가르기", "Add and Take Away", "1-5"],
      ["NBT", "A", "11–19 자리값 기초", "Teen Number Place Value", "1"],
      ["MD", "A", "측정 속성 비교", "Compare Measurable Attributes", "1-2"],
      ["MD", "B", "분류와 범주 세기", "Sort and Count Categories", "3"],
      ["G", "A", "모양 찾고 설명하기", "Identify and Describe Shapes", "1-3"],
      ["G", "B", "모양 분석하고 만들기", "Analyze and Compose Shapes", "4-6"]
    ]),
    1: Object.freeze([
      ["OA", "A", "덧셈·뺄셈 문제", "Addition and Subtraction Problems", "1-2"],
      ["OA", "B", "연산 성질과 덧뺄셈 관계", "Properties and Inverse Relationship", "3-4"],
      ["OA", "C", "20 안의 덧셈·뺄셈", "Facts Within 20", "5-6"],
      ["OA", "D", "덧셈·뺄셈 식", "Addition and Subtraction Equations", "7-8"],
      ["NBT", "A", "120까지 세기", "Count to 120", "1"],
      ["NBT", "B", "두 자리 수 자리값", "Two-Digit Place Value", "2-3"],
      ["NBT", "C", "자리값으로 더하고 빼기", "Place-Value Addition and Subtraction", "4-6"],
      ["MD", "A", "단위로 길이 재기", "Measure Length by Units", "1-2"],
      ["MD", "B", "시각 읽기", "Tell Time", "3"],
      ["MD", "C", "자료 나타내기", "Represent Data", "4"],
      ["G", "A", "모양의 성질", "Shape Reasoning", "1-3"]
    ]),
    2: Object.freeze([
      ["OA", "A", "덧셈·뺄셈 문장제", "Add and Subtract Word Problems", "1"],
      ["OA", "B", "20 안의 계산 유창성", "Fluency Within 20", "2"],
      ["OA", "C", "같은 수 묶음과 배열", "Equal Groups and Arrays", "3-4"],
      ["NBT", "A", "세 자리 수 자리값", "Three-Digit Place Value", "1-4"],
      ["NBT", "B", "자리값으로 더하고 빼기", "Add and Subtract with Place Value", "5-9"],
      ["MD", "A", "표준 단위 길이", "Standard Length Units", "1-4"],
      ["MD", "B", "길이와 덧셈·뺄셈", "Length and Add/Subtract", "5-6"],
      ["MD", "C", "시간과 돈", "Time and Money", "7-8"],
      ["MD", "D", "자료 나타내기", "Represent Data", "9-10"],
      ["G", "A", "모양의 성질", "Shape Reasoning", "1-3"]
    ]),
    3: Object.freeze([
      ["OA", "A", "곱셈·나눗셈 상황", "Multiply and Divide Situations", "1-4"],
      ["OA", "B", "곱셈 성질과 나눗셈 관계", "Properties and Division Relationship", "5-6"],
      ["OA", "C", "100 안의 곱셈·나눗셈", "Facts Within 100", "7"],
      ["OA", "D", "사칙연산 문제와 규칙", "Four-Operation Problems and Patterns", "8-9"],
      ["NBT", "A", "자리값과 자연수 계산", "Place Value and Whole-Number Arithmetic", "1-3"],
      ["NF", "A", "분수의 뜻과 비교", "Fraction Numbers and Comparison", "1-3"],
      ["MD", "A", "시간·부피·무게", "Time, Liquid Volume and Mass", "1-2"],
      ["MD", "B", "자료 나타내기", "Represent Data", "3-4"],
      ["MD", "C", "넓이", "Area Concepts", "5-7"],
      ["MD", "D", "둘레", "Perimeter Problems", "8"],
      ["G", "A", "도형 성질과 부분 넓이", "Shape Attributes and Fractional Areas", "1-2"]
    ]),
    4: Object.freeze([
      ["OA", "A", "사칙연산 문제 해결", "Four-Operation Problem Solving", "1-3"],
      ["OA", "B", "약수와 배수", "Factors and Multiples", "4"],
      ["OA", "C", "수와 모양의 규칙", "Number and Shape Patterns", "5"],
      ["NBT", "A", "여러 자리 수 자리값", "Multi-Digit Place Value", "1-3"],
      ["NBT", "B", "여러 자리 수 계산", "Multi-Digit Arithmetic", "4-6"],
      ["NF", "A", "동치분수와 크기 비교", "Fraction Equivalence and Order", "1-2"],
      ["NF", "B", "단위분수로 분수 계산", "Build Fractions from Unit Fractions", "3-4"],
      ["NF", "C", "소수 표기와 비교", "Decimal Notation and Comparison", "5-7"],
      ["MD", "A", "단위 변환과 측정 문제", "Conversions and Measurement Problems", "1-3"],
      ["MD", "B", "자료 나타내기", "Represent Data", "4"],
      ["MD", "C", "각의 측정", "Angle Measurement", "5-7"],
      ["G", "A", "선·각·대칭", "Lines, Angles and Symmetry", "1-3"]
    ]),
    5: Object.freeze([
      ["OA", "A", "수식 쓰고 해석하기", "Numerical Expressions", "1-2"],
      ["OA", "B", "규칙과 관계", "Patterns and Relationships", "3"],
      ["NBT", "A", "자리값과 소수", "Place Value and Decimals", "1-4"],
      ["NBT", "B", "자연수·소수 계산", "Whole-Number and Decimal Operations", "5-7"],
      ["NF", "A", "분수 덧셈·뺄셈", "Add and Subtract Fractions", "1-2"],
      ["NF", "B", "분수 곱셈·나눗셈", "Multiply and Divide Fractions", "3-7"],
      ["MD", "A", "단위 변환", "Unit Conversions", "1"],
      ["MD", "B", "자료 나타내기", "Represent Data", "2"],
      ["MD", "C", "부피", "Volume", "3-5"],
      ["G", "A", "좌표평면", "Coordinate Plane", "1-2"],
      ["G", "B", "평면도형 분류", "Classify 2D Figures", "3-4"]
    ]),
    6: Object.freeze([
      ["RP", "A", "비와 비율", "Ratios and Rates", "1-3"],
      ["NS", "A", "분수 나눗셈", "Divide Fractions", "1"],
      ["NS", "B", "여러 자리 수 계산과 공약수·공배수", "Multi-Digit Operations, Factors and Multiples", "2-4"],
      ["NS", "C", "유리수 체계", "Rational Numbers", "5-8"],
      ["EE", "A", "대수식", "Algebraic Expressions", "1-4"],
      ["EE", "B", "방정식과 부등식", "Equations and Inequalities", "5-8"],
      ["EE", "C", "두 변수의 관계", "Dependent and Independent Variables", "9"],
      ["G", "A", "넓이·겉넓이·부피", "Area, Surface Area and Volume", "1-4"],
      ["SP", "A", "통계적 변이", "Statistical Variability", "1-3"],
      ["SP", "B", "분포 요약", "Summarize Distributions", "4-5"]
    ]),
    7: Object.freeze([
      ["RP", "A", "비례관계", "Proportional Relationships", "1-3"],
      ["NS", "A", "유리수 연산", "Rational-Number Operations", "1-3"],
      ["EE", "A", "동치인 식", "Equivalent Expressions", "1-2"],
      ["EE", "B", "식과 방정식 문제 해결", "Expressions and Equations in Problems", "3-4"],
      ["G", "A", "축척도", "Scale Drawings", "1"],
      ["G", "B", "도형 작도와 관계", "Geometric Constructions", "2-3"],
      ["G", "C", "각·넓이·부피", "Angles, Area and Volume", "4-6"],
      ["SP", "A", "표본과 모집단 추론", "Samples and Population Inference", "1-2"],
      ["SP", "B", "두 집단 비교", "Compare Populations", "3-4"],
      ["SP", "C", "확률과 모형", "Probability and Models", "5-8"]
    ]),
    8: Object.freeze([
      ["NS", "A", "무리수와 근삿값", "Irrational Numbers and Approximation", "1-2"],
      ["EE", "A", "근호와 정수 지수", "Radicals and Integer Exponents", "1-4"],
      ["EE", "B", "비례·직선·일차방정식", "Proportions, Lines and Linear Equations", "5-6"],
      ["EE", "C", "일차방정식과 연립방정식", "Linear Equations and Systems", "7-8"],
      ["F", "A", "함수의 뜻과 비교", "Define and Compare Functions", "1-3"],
      ["F", "B", "함수로 관계 모델링", "Model Relationships with Functions", "4-5"],
      ["G", "A", "변환·합동·닮음", "Transformations, Congruence and Similarity", "1-5"],
      ["G", "B", "피타고라스 정리", "Pythagorean Theorem", "6-8"],
      ["G", "C", "원기둥·원뿔·구의 부피", "Cylinder, Cone and Sphere Volume", "9"],
      ["SP", "A", "이변량 자료", "Bivariate Data", "1-4"]
    ])
  });

  const grades = Object.freeze(spine.gradeOrder.map(function (grade) {
    const clusters = specs[grade];
    return Object.freeze({
      grade,
      clusters: Object.freeze(clusters.map(function (spec, index) {
        const domainCode = spec[0];
        const clusterLetter = spec[1];
        const clusterId = `${grade}.${domainCode}.${clusterLetter}`;
        return Object.freeze({
          grade,
          order: index + 1,
          unitId: `ccss-${String(grade).toLowerCase()}-${domainCode.toLowerCase()}-${clusterLetter.toLowerCase()}`,
          clusterId,
          domainCode,
          standardsPrefix: `${grade}.${domainCode}`,
          standardRange: `${clusterId}.${spec[4]}`,
          title: Object.freeze({ ko: spec[2], en: spec[3] }),
          mappingState: "official-id-verified",
          questionReleaseState: "locked-pending-skill-and-item-review"
        });
      }))
    });
  }));

  const clusters = Object.freeze(grades.flatMap(function (row) { return row.clusters; }));

  return Object.freeze({
    source,
    sequencePolicy: Object.freeze({
      owner: "GFIELD",
      officialSequence: false,
      note: "CCSS defines learning expectations; GFIELD owns unit order, pacing, diagnostics, and school policy."
    }),
    gradeOrder: spine.gradeOrder,
    grades,
    clusters
  });
});
