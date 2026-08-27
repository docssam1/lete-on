(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDUSK8DomainSpine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const SOURCE = Object.freeze({
    authority: "Common Core State Standards Initiative",
    url: "https://corestandards.org/mathematics-standards/",
    lastVerified: "2026-08-26"
  });

  const domainTitles = Object.freeze({
    CC: Object.freeze({ ko: "수 세기와 기수", en: "Counting and Cardinality", "zh-Hans": "计数与基数" }),
    OA: Object.freeze({ ko: "연산과 대수적 사고", en: "Operations and Algebraic Thinking", "zh-Hans": "运算与代数思维" }),
    NBT: Object.freeze({ ko: "십진법의 수와 연산", en: "Number and Operations in Base Ten", "zh-Hans": "十进制数与运算" }),
    NF: Object.freeze({ ko: "분수의 수와 연산", en: "Number and Operations—Fractions", "zh-Hans": "分数与运算" }),
    MD: Object.freeze({ ko: "측정과 자료", en: "Measurement and Data", "zh-Hans": "测量与数据" }),
    G: Object.freeze({ ko: "기하", en: "Geometry", "zh-Hans": "几何" }),
    RP: Object.freeze({ ko: "비와 비례 관계", en: "Ratios and Proportional Relationships", "zh-Hans": "比与比例关系" }),
    NS: Object.freeze({ ko: "수 체계", en: "The Number System", "zh-Hans": "数系" }),
    EE: Object.freeze({ ko: "식과 방정식", en: "Expressions and Equations", "zh-Hans": "式与方程" }),
    SP: Object.freeze({ ko: "통계와 확률", en: "Statistics and Probability", "zh-Hans": "统计与概率" }),
    F: Object.freeze({ ko: "함수", en: "Functions", "zh-Hans": "函数" })
  });

  const gradeDomains = Object.freeze({
    K: Object.freeze(["CC", "OA", "NBT", "MD", "G"]),
    1: Object.freeze(["OA", "NBT", "MD", "G"]),
    2: Object.freeze(["OA", "NBT", "MD", "G"]),
    3: Object.freeze(["OA", "NBT", "NF", "MD", "G"]),
    4: Object.freeze(["OA", "NBT", "NF", "MD", "G"]),
    5: Object.freeze(["OA", "NBT", "NF", "MD", "G"]),
    6: Object.freeze(["RP", "NS", "EE", "G", "SP"]),
    7: Object.freeze(["RP", "NS", "EE", "G", "SP"]),
    8: Object.freeze(["NS", "EE", "F", "G", "SP"])
  });

  function standardPrefix(grade, domain) {
    return `${grade}.${domain}`;
  }

  const gradeOrder = Object.freeze(["K", 1, 2, 3, 4, 5, 6, 7, 8]);
  const grades = Object.freeze(gradeOrder.map(function (grade) {
    return Object.freeze({
      grade,
      domains: Object.freeze(gradeDomains[grade].map(function (code) {
        return Object.freeze({ code, standardPrefix: standardPrefix(grade, code), title: domainTitles[code] });
      }))
    });
  }));

  return Object.freeze({
    source: SOURCE,
    practiceStandards: Object.freeze(["MP.1", "MP.2", "MP.3", "MP.4", "MP.5", "MP.6", "MP.7", "MP.8"]),
    domainTitles,
    gradeDomains,
    gradeOrder,
    grades,
    standardPrefix
  });
});
