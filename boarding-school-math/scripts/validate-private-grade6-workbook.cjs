#!/usr/bin/env node
"use strict";

/*
 * Local-only preflight for Grade 6 instructional workbook drafts.
 *
 * The draft root must be explicit and outside this Git worktree. The public
 * repository contains this validator and no workbook prompt, answer, teacher
 * guide, asset, PDF, or export. A structural pass is never a rights, math,
 * translation, or release approval.
 */

const fs = require("node:fs");
const path = require("node:path");
const registry = require("../curriculum/us-k8-content-registry.js");
const resourcePlans = require("../resources/k8-resource-plan.js");

const SCHEMA_VERSION = "gfield-private-workbook-draft-v1";
const CONFIDENTIALITY_MARKER = "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT";
const DRAFT_STATE = "draft-pending-independent-review";
const PRODUCTION_STATE = "local-draft-no-pdf-or-download";
const LOCAL_BINDING_STATE = "candidate-not-public-bound";
const EEA_POWER_EVIDENCE_ID = "6.EE.A.1-isolated-positive-whole-number-power-evaluation";
const EEA_POWER_BASE_MIN = 2;
const EEA_POWER_BASE_MAX = 12;
const EEA_POWER_EXPONENT_MIN = 2;
const EEA_POWER_EXPONENT_MAX = 5;
const EEA_POWER_RESULT_MAX = 250000n;
const EEA_WORKED_EXAMPLE_BASE_MIN = 2;
const EEA_WORKED_EXAMPLE_BASE_MAX = 20;
const EEA_WORKED_EXAMPLE_RESULT_MAX = 3200000n;
const EEB_SUBSTITUTION_EVIDENCE_ID = "6.EE.B.5-finite-positive-whole-equality-substitution-truth";
const EEB_CANDIDATE_MIN = 1;
const EEB_CANDIDATE_MAX = 24;
const EEB_ADDITION_ADDEND_MIN = 1;
const EEB_ADDITION_ADDEND_MAX = 20;
const EEB_ADDITION_TOTAL_MAX = 44;
const EEC_TABLE_EQUATION_EVIDENCE_ID = "6.EE.C.9-finite-whole-direct-variation-table-equation-completion";
const EEC_RATE_MIN = 2;
const EEC_RATE_MAX = 12;
const EEC_INDEPENDENT_VALUE_MAX = 18;
const EEC_DEPENDENT_VALUE_MAX = EEC_RATE_MAX * EEC_INDEPENDENT_VALUE_MAX;
const GGA_TRIANGLE_AREA_EVIDENCE_ID = "6.G.A.1-finite-whole-right-triangle-area-from-labeled-base-and-perpendicular-height";
const GGA_TRIANGLE_AREA_CHECK_KIND = "right-triangle-whole-base-perpendicular-height-area";
const GGA_GEOMETRY_DIAGRAM_KIND = "right-triangle-labeled-base-perpendicular-height-v1";
const GGA_BASE_MIN = 4;
const GGA_BASE_MAX = 24;
const GGA_PERPENDICULAR_HEIGHT_MIN = 4;
const GGA_PERPENDICULAR_HEIGHT_MAX = 24;
const GGA_TRIANGLE_AREA_MIN = 32n;
const GGA_TRIANGLE_AREA_MAX = 240n;
const EEB_LOCKED_EVIDENCE_BY_LOCALE = Object.freeze({
  ko: "자동 근거는 6.EE.B.5의 제한된 양의 정수 등식 대입 판정뿐이다. 6.EE.B.5의 부등식, 후보 집합 전체 판단과 설명, 6.EE.B.6, 6.EE.B.7, 6.EE.B.8은 교사 관찰이 필요한 항목으로 남긴다. 이것은 완전 숙달이나 승급 결정이 아니다.",
  en: "The automatic evidence is limited to determining whether substituting a positive whole number makes an equality hold within 6.EE.B.5. Inequalities, whole-candidate-set evaluation and explanation in 6.EE.B.5, together with 6.EE.B.6, 6.EE.B.7, and 6.EE.B.8, remain locked for teacher observation. It is not a full mastery or promotion decision.",
  "zh-Hans": "自动证据仅限于 6.EE.B.5 中正整数等式代入的真假判断。6.EE.B.5 的不等式、对整个候选集合的判断和说明，以及 6.EE.B.6、6.EE.B.7 和 6.EE.B.8，仍锁定为教师观察内容。这不是完全掌握或年级晋升决定。"
});
const EEB_TEACHER_OBSERVATION_BY_PROFILE = Object.freeze({
  "lesson-plan:core": Object.freeze({
    ko: "6.EE.B.5의 대입 설명, 후보 집합 전체 판단, 부등식 이해를 교사 관찰로 기록한다.",
    en: "Record 6.EE.B.5 substitution explanation, whole-candidate-set evaluation, and inequality understanding through teacher observation.",
    "zh-Hans": "通过教师观察记录 6.EE.B.5 的代入说明、对整个候选集合的判断和不等式理解。"
  }),
  "assignment-builder:core": Object.freeze({
    ko: "6.EE.B.6과 6.EE.B.7은 교사 관찰이 필요한 항목으로 잠긴다.",
    en: "Keep 6.EE.B.6 and 6.EE.B.7 locked for teacher observation.",
    "zh-Hans": "6.EE.B.6 和 6.EE.B.7 仍锁定为教师观察内容。"
  }),
  "assignment-builder:advanced": Object.freeze({
    ko: "6.EE.B.8의 부등식은 교사 관찰이 필요한 항목으로 잠긴다.",
    en: "Keep 6.EE.B.8 inequalities locked for teacher observation.",
    "zh-Hans": "6.EE.B.8 的不等式仍锁定为教师观察内容。"
  })
});
const EEC_LOCKED_EVIDENCE_BY_LOCALE = Object.freeze({
  ko: "자동 근거는 이미 x가 독립변수이고 y가 종속변수로 지정된 제한된 양의 정수 직접비례 표에서 y = □ × x의 계수를 완성하는 것뿐이다. 실제 상황의 변수·단위 선택, 표·그래프 작성과 해석, 표·그래프·방정식의 연결 설명, 비례형 이외 관계는 교사 관찰로 남긴다. 이것은 완전 숙달이나 승급 결정이 아니다.",
  en: "The automatic evidence is limited to completing the coefficient in y = □ × x from a finite positive-whole direct-variation table where x is already designated independent and y dependent. Choosing variables and units in a real-world context, constructing or interpreting tables and graphs, explaining the connection among table, graph, and equation, and non-proportional relationships remain teacher-observation work. It is not a full mastery or promotion decision.",
  "zh-Hans": "自动证据仅限于在已指定 x 为自变量、y 为因变量的有限正整数正比例表中完成 y = □ × x 的系数。真实情境中的变量和单位选择、表格与图像的制作和解读、表格、图像与方程之间的联系说明，以及非正比例关系仍由教师观察。这不是完全掌握或年级晋升决定。"
});
const EEC_TEACHER_OBSERVATION_BY_PROFILE = Object.freeze({
  "lesson-plan:core": Object.freeze({
    ko: "실제 상황에서 독립변수·종속변수와 단위를 정의하고, 표·그래프·방정식의 연결을 설명하는지를 교사 관찰로 기록한다.",
    en: "Record through teacher observation whether the learner defines independent and dependent variables with units in context and explains the connection among table, graph, and equation.",
    "zh-Hans": "通过教师观察记录学习者是否能在情境中定义带单位的自变量和因变量，并说明表格、图像和方程之间的联系。"
  }),
  "assignment-builder:core": Object.freeze({
    ko: "표를 만들고 읽으며 두 변수의 관계를 설명하는 항목은 교사 관찰로 남긴다.",
    en: "Keep constructing and reading a table and explaining the two-variable relationship for teacher observation.",
    "zh-Hans": "制作和解读表格以及说明两个变量关系的项目仍由教师观察。"
  }),
  "assignment-builder:advanced": Object.freeze({
    ko: "그래프의 축·눈금·순서쌍과 비례형 이외 관계의 해석은 교사 관찰로 남긴다.",
    en: "Keep graph axes, scale, ordered pairs, and interpretation beyond the proportional form for teacher observation.",
    "zh-Hans": "图像的坐标轴、刻度、有序数对以及正比例形式以外关系的解读仍由教师观察。"
  })
});
const GGA_LOCKED_EVIDENCE_BY_LOCALE = Object.freeze({
  ko: "자동 근거는 표시된 밑변과 그에 수직인 높이가 제한된 범위의 양의 정수인 직각삼각형의 넓이를 계산하는 것뿐이다. 6.G.A.1의 도형 구성·분해와 풀이 설명 및 실제 상황 모델링, 6.G.A.2의 분수 모서리 길이를 가진 직육면체 부피, 6.G.A.3의 좌표평면 다각형과 변 길이, 6.G.A.4의 전개도와 겉넓이는 교사 관찰로 남긴다. 이것은 완전 숙달, 과정 배치, 또는 학년 승급 결정이 아니다.",
  en: "The automatic evidence is limited to calculating the area of a right triangle whose labeled base and perpendicular height are positive whole numbers within a finite allowed range. Composing or decomposing figures and explaining the work in 6.G.A.1, real-world modeling, fractional-edge rectangular-prism volume in 6.G.A.2, coordinate-plane polygons and side lengths in 6.G.A.3, and nets and surface area in 6.G.A.4 remain teacher-observation work. It is not a full mastery, course-placement, or grade-promotion decision.",
  "zh-Hans": "自动证据仅限于计算直角三角形的面积，其中已标出的底和与底垂直的高均为限定范围内的正整数。6.G.A.1 中图形的拼合、分割和解题说明及实际情境建模，6.G.A.2 的分数棱长长方体体积，6.G.A.3 的坐标平面多边形和边长，以及 6.G.A.4 的展开图和表面积仍由教师观察。这不是完全掌握、课程分班或年级晋升决定。"
});
const GGA_TEACHER_OBSERVATION_BY_PROFILE = Object.freeze({
  "lesson-plan:core": Object.freeze({
    ko: "학생이 밑변과 그에 수직인 높이를 식별하고, 도형을 구성하거나 분해해 넓이식을 정당화하는지를 교사 관찰로 기록한다.",
    en: "Record through teacher observation whether the learner identifies a base and its perpendicular height and justifies an area expression by composing or decomposing a figure.",
    "zh-Hans": "通过教师观察记录学习者是否能识别底和与底垂直的高，并通过拼合或分割图形说明面积式。"
  }),
  "assignment-builder:core": Object.freeze({
    ko: "6.G.A.2의 분수 모서리 길이를 가진 직육면체를 단위입방체로 채우고 부피식을 설명하는 일은 교사 관찰로 남긴다.",
    en: "Keep packing a rectangular prism with fractional edge lengths with unit cubes and explaining its volume expression in 6.G.A.2 for teacher observation.",
    "zh-Hans": "6.G.A.2 中用单位立方体填充分数棱长的长方体并说明体积式，仍由教师观察。"
  }),
  "assignment-builder:advanced": Object.freeze({
    ko: "6.G.A.3의 좌표평면 다각형·변 길이와 6.G.A.4의 전개도·겉넓이 해석은 교사 관찰로 남긴다.",
    en: "Keep 6.G.A.3 coordinate-plane polygons and side lengths and 6.G.A.4 nets and surface-area interpretation for teacher observation.",
    "zh-Hans": "6.G.A.3 的坐标平面多边形和边长，以及 6.G.A.4 的展开图和表面积解读仍由教师观察。"
  })
});
const EEB_STUDENT_STATIC_TEXT = Object.freeze({
  frontMatter: Object.freeze({
    titleByLocale: Object.freeze({
      ko: "방정식: 후보 대입 연습",
      en: "Equations: Candidate Substitution Practice",
      "zh-Hans": "方程：候选数代入练习"
    }),
    learningTargetsByLocale: Object.freeze({
      ko: "후보를 미지수 자리에 넣고 양쪽을 비교합니다.",
      en: "Substitute the candidate value for the variable and compare both sides.",
      "zh-Hans": "将候选数放入变量位置并核对等式。"
    }),
    howToUseByLocale: Object.freeze({
      ko: "문항을 읽은 뒤 화면의 선택지를 고릅니다.",
      en: "Read each prompt and choose the on-screen response.",
      "zh-Hans": "阅读题目后选择屏幕上的选项。"
    })
  }),
  closingMatter: Object.freeze({
    glossaryByLocale: Object.freeze({
      ko: "후보, 대입, 등식",
      en: "candidate, substitution, equality",
      "zh-Hans": "候选数、代入、等式"
    }),
    retentionNoticeByLocale: Object.freeze({
      ko: "나중에 같은 절차를 다시 연습합니다.",
      en: "Revisit the substitution procedure later.",
      "zh-Hans": "之后再次练习代入步骤。"
    })
  }),
  sectionTitlesByProfile: Object.freeze({
    "g6-w1-s2-concept-model:concept-workbook:foundation": Object.freeze({ ko: "대입 준비", en: "Prepare to Substitute", "zh-Hans": "准备代入" }),
    "g6-w1-s2-concept-model:concept-workbook:core": Object.freeze({ ko: "대입 연습", en: "Practice Substitution", "zh-Hans": "练习代入" }),
    "g6-w2-s1-guided-practice:guided-practice:core": Object.freeze({ ko: "안내 연습", en: "Guided Practice", "zh-Hans": "引导练习" }),
    "g6-w2-s2-independent-application:homework:core": Object.freeze({ ko: "가정 연습", en: "Home Practice", "zh-Hans": "家庭练习" }),
    "g6-w2-s2-independent-application:homework:advanced": Object.freeze({ ko: "확장 가정 연습", en: "Extended Home Practice", "zh-Hans": "扩展家庭练习" }),
    "g6-w3-s2-transfer-application:guided-practice:advanced": Object.freeze({ ko: "전이 연습", en: "Transfer Practice", "zh-Hans": "迁移练习" }),
    "g6-w3-s2-transfer-application:homework:advanced": Object.freeze({ ko: "전이 가정 연습", en: "Transfer Home Practice", "zh-Hans": "迁移家庭练习" })
  }),
  conceptSummaryByProfile: Object.freeze({
    "g6-w1-s2-concept-model:concept-workbook:foundation": Object.freeze({
      ko: "후보를 미지수 자리에 넣고 양쪽을 비교합니다.",
      en: "Substitute the candidate value for the variable and compare both sides.",
      "zh-Hans": "将候选数放入变量位置并核对等式。"
    })
  })
});
const REQUIRED_REVIEWS = Object.freeze([
  "math-correctness", "age-appropriateness", "answer-uniqueness",
  "translation-ko", "translation-en", "translation-zh-Hans", "rights"
]);
const PACK_KEYS = new Set([
  "schemaVersion", "confidentiality", "packId", "packVersion", "programId", "targetGrade", "unitId", "clusterId",
  "skillId", "resourcePlanId", "cadenceProfileId", "state", "coverageState", "standardsEvidence", "deliveryState", "localePolicy",
  "frontMatter", "studentSections", "teacherArtifacts", "homeStudyPlan", "assessmentPlaceholders", "closingMatter",
  "rightsDraft", "verification", "layoutPlan"
]);
const LOCALE_POLICY_KEYS = new Set(["required", "included"]);
const FRONT_MATTER_KEYS = new Set(["titleByLocale", "learningTargetsByLocale", "howToUseByLocale"]);
const STANDARDS_EVIDENCE_KEYS = new Set(["state", "autoEvidenceIds", "lockedEvidenceByLocale"]);
const CLOSING_MATTER_KEYS = new Set(["glossaryByLocale", "retentionNoticeByLocale"]);
const NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT = "teacher-observation-rubric";
const HOME_BLOCK_KEYS = new Set(["blockId", "week", "sequence", "minutes", "componentIds"]);
const SECTION_KEYS = new Set([
  "sectionId", "sectionVersion", "audience", "titleByLocale", "resourceBinding", "productionState", "components"
]);
const ARTIFACT_KEYS = new Set([
  "artifactId", "artifactVersion", "audience", "titleByLocale", "resourceBinding", "productionState", "components",
  "lessonSegments", "answerReferences"
]);
const BINDING_KEYS = new Set([
  "resourcePlanItemId", "courseId", "unitId", "skillId", "sessionId", "audience", "levelId", "testType",
  "resourceType", "bindingState"
]);
const STUDENT_COMPONENT_KEYS = new Set([
  "componentId", "componentType", "sequence", "contentByLocale", "responseMode", "teacherReferenceId", "relationTable", "geometryDiagram"
]);
const TEACHER_COMPONENT_KEYS = new Set(["componentId", "componentType", "sequence", "contentByLocale"]);
const SEGMENT_KEYS = new Set(["segmentId", "sequence", "minutes", "instructionByLocale"]);
const REFERENCE_KEYS = new Set([
  "referenceId", "componentId", "responseMode", "expectedResponse", "solutionByLocale", "uniquenessProofByLocale",
  "arithmeticCheck", "evaluationMode"
]);
const PLACEHOLDER_KEYS = new Set([
  "resourcePlanItemId", "sessionId", "levelId", "testType", "resourceType", "status"
]);
const RIGHTS_KEYS = new Set([
  "mode", "originType", "authority", "translationAllowed", "derivativeAllowed", "externalSourceUsed",
  "contestWordingUsed", "decision"
]);
const VERIFICATION_KEYS = new Set([
  "authorMathCheck", "authorTranslationCheck", "authorRightsCheck", "requiredReviews", "releaseState"
]);
const LAYOUT_KEYS = new Set([
  "studentTargetPages", "teacherTargetPages", "frontMatterPages", "closingPages", "studentSectionLayouts",
  "teacherArtifactLayouts"
]);
const LAYOUT_ENTRY_KEYS = new Set(["id", "startPage", "endPage"]);
const RELATION_TABLE_KEYS = new Set(["form", "independentSymbol", "dependentSymbol", "independentValues", "dependentValues"]);
const GEOMETRY_DIAGRAM_KEYS = new Set(["kind", "base", "perpendicularHeight", "heightFoot"]);
const RESPONSE_MODES = new Set(["ratio-canonical", "numeric-exact", "comparison-symbol-exact", "truth-value-exact"]);
const GGA_EVALUATION_MODES = new Set(["automatic-evidence", "teacher-review-only"]);
const TEACHING_COMPONENT_TYPES = new Set(["concept-summary", "worked-example"]);
const ANSWER_REVEALING_TEXT = /(?:정답|답|correct\s+answer|\bans(?:wer)?|正确答案|答案|答|결과|result|结果|풀이|solution|解答)/iu;
const ANSWER_VALUE_LABEL = /(?:correct\s+answer|\bans(?:wer)?|정답|답|正确答案|答案|答|결과|result|结果|풀이|solution|解答)/giu;
const ANSWER_VALUE_GRAMMAR_CONNECTOR = /^\s*(?:은|는|is|are|equals?|是|为)\s*/iu;
const ANSWER_VALUE_SEPARATOR = /^(?:[\s\p{P}\p{S}\p{C}\p{M}\p{Z}])+/u;
const ANSWER_VALUE_WRAPPER = /^(?:[\[("“‘]+\s*)+/u;
const HTML_TAG = /<[A-Za-z/!][^>]*>/u;
const HTML_ENTITY = /&(?:#(?:x[0-9a-f]+|\d+)|[a-z][a-z0-9]+);/iu;
const SAFE_STUDENT_TEX_COMMANDS = new Set([
  "boxed", "cdot", "displaystyle", "div", "dfrac", "frac", "left", "mathit", "mathbf", "mathrm", "mathsf", "mathtt",
  "operatorname", "overline", "right", "sqrt", "text", "tfrac", "times", "underline"
]);
const SAFE_COMPARISON_PROMPT_MATH_SYMBOLS = new Set(["+", "-", "/", "|"]);
const RESPONSE_TEXT_LOCALE_PATTERNS = Object.freeze({
  en: /^[\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u,
  ko: /^[\p{Script=Hangul}\p{Script=Han}\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u,
  "zh-Hans": /^[\p{Script=Han}\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]*$/u
});

class ValidationError extends Error {
  constructor(code, reference) {
    super(code);
    this.code = code;
    this.reference = reference;
  }
}

function fail(code, reference) {
  throw new ValidationError(code, reference);
}

function assert(condition, code, reference) {
  if (!condition) fail(code, reference);
}

function isRecord(value) {
  return !!value && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function nonBlankText(value) {
  return typeof value === "string" && value.length > 0 && value.trim() === value;
}

function assertRecord(value, code, reference) {
  assert(isRecord(value), code, reference);
}

function assertDenseArray(value, code, reference) {
  assert(Array.isArray(value), code, reference);
  for (let index = 0; index < value.length; index += 1) {
    assert(Object.prototype.hasOwnProperty.call(value, index), code, reference);
  }
}

function assertOnlyKeys(value, allowed, code, reference) {
  assertRecord(value, code, reference);
  const keys = Object.getOwnPropertyNames(value);
  assert(
    Object.getOwnPropertySymbols(value).length === 0 &&
    keys.every(function (key) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      return allowed.has(key) && descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value");
    }),
  code, reference);
}

function assertExactDataKeys(value, expected, code, reference) {
  assertOnlyKeys(value, new Set(expected), code, reference);
  assert(Object.getOwnPropertyNames(value).length === expected.length, code, reference);
}

function ownDataValue(value, key, code, reference) {
  const descriptor = Object.getOwnPropertyDescriptor(value, key);
  assert(descriptor && Object.prototype.hasOwnProperty.call(descriptor, "value"), code, reference);
  return descriptor.value;
}

function assertId(value, prefix, code, reference) {
  assert(typeof value === "string" && new RegExp(`^${prefix}[a-z0-9][a-z0-9-]{3,79}$`).test(value), code, reference);
}

function requireLocales(value, policy, code, reference) {
  assertOnlyKeys(value, new Set(policy.included), code, reference);
  policy.required.forEach(function (locale) { assert(nonBlankText(value[locale]), code, reference); });
  policy.included.forEach(function (locale) { assert(nonBlankText(value[locale]), code, reference); });
}

function requireStudentVisibleLocales(value, policy, code, reference) {
  requireLocales(value, policy, code, reference);
  Object.entries(value).forEach(function (entry) {
    assertStudentVisibleTextIsNeutral(entry[1], entry[0], reference);
  });
}

function normalizeForAnswerLeakScan(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\\(?:boxed|text|mathrm|displaystyle)\s*\{([^{}]*)\}/gu, "$1")
    .replace(/\\colon\b/gu, ":")
    .replace(/\\(?:longrightarrow|rightarrow|longmapsto|mapsto|implies|to)\b/gu, " ")
    .replace(/\\[a-z]+\*?/giu, " ")
    .replace(/[\\${}]/gu, " ")
    .replace(/[\p{C}\p{M}]/gu, "")
    .replace(/[\u2010-\u2015\u2212\u2796\uFE58\uFE63\uFF0D]/gu, "-")
    .replace(/[\u2044\u2215\u29F8\uFF0F]/gu, "/")
    .replace(/\s+/gu, " ")
    .replace(/[\u2236\u22EE\uA789\uFE13\uFE55\uFF1A]/gu, ":")
    .replace(/\s*([:/])\s*/gu, "$1")
    .replace(/([+-])\s*(?=[0-9])/gu, "$1")
    .trim();
}

function normalizeForAnswerLabelScan(value) {
  // A TeX spacing command such as `\\!` is visually a zero/negative-width
  // separator. Text-display commands are likewise absent to a reader, so
  // retain their payload for the label scan.
  const labelNormalized = String(value)
    .normalize("NFKC")
    .replace(/\\(?:boxed|text|mathrm|mathit|mathbf|mathsf|mathtt|operatorname)\s*\{([^{}]*)\}/giu, "$1");
  return normalizeForAnswerLeakScan(labelNormalized).replace(/[\p{P}\p{S}\p{C}\p{M}\p{Z}]/gu, "");
}

function assertStudentVisibleTextSyntax(content, locale, reference) {
  const value = String(content);
  const compatibilityNormalized = value.normalize("NFKC");
  // Student-visible text may keep TeX in an explicitly non-response worked
  // example, but it never accepts HTML/entity recovery or invisible controls.
  assert(!HTML_TAG.test(value) && !HTML_ENTITY.test(value) && !/&/u.test(value) &&
    !HTML_TAG.test(compatibilityNormalized) && !HTML_ENTITY.test(compatibilityNormalized) && !/&/u.test(compatibilityNormalized),
  "STUDENT_MARKUP_UNSUPPORTED", reference);
  [value, compatibilityNormalized].forEach(function (candidate) {
    // Worked examples may use a deliberately small mathematical TeX subset.
    // Every other command (including invisible/layout or Unicode-escape
    // commands) is rejected rather than trying to blacklist all renderers.
    const matcher = /\\([A-Za-z]+)\*?/gu;
    let match;
    while ((match = matcher.exec(candidate))) {
      assert(SAFE_STUDENT_TEX_COMMANDS.has(match[1].toLowerCase()), "STUDENT_TEX_UNSUPPORTED", reference);
    }
    assert(!/\\(?![A-Za-z])/u.test(candidate), "STUDENT_TEX_UNSUPPORTED", reference);
  });
  assert(!/[\p{C}\p{M}]/u.test(value) && !/[\p{C}\p{M}]/u.test(compatibilityNormalized), "STUDENT_CHARACTER_UNSUPPORTED", reference);
  if (locale != null) {
    const allowed = RESPONSE_TEXT_LOCALE_PATTERNS[locale];
    assert(allowed && allowed.test(value) && allowed.test(compatibilityNormalized), "STUDENT_CHARACTER_UNSUPPORTED", reference);
  }
}

function assertStudentAnswerLabelAbsent(value, reference) {
  const normalizedContent = normalizeForAnswerLeakScan(value);
  const compactLabelContent = normalizeForAnswerLabelScan(value);
  assert(!ANSWER_REVEALING_TEXT.test(normalizedContent) && !ANSWER_REVEALING_TEXT.test(compactLabelContent), "STUDENT_ANSWER_LEAK", reference);
  return normalizedContent;
}

function assertStudentVisibleTextIsNeutral(content, locale, reference) {
  assertStudentVisibleTextSyntax(content, locale, reference);
  assertStudentAnswerLabelAbsent(content, reference);
}

function assertStudentNeutralId(value, prefix, code, reference) {
  assertId(value, prefix, code, reference);
  assertStudentAnswerLabelAbsent(value, reference);
}

function assertResponseStudentTextSyntax(content, locale, reference) {
  // Response blocks are deliberately plain text. Reject every ampersand rather
  // than trying to mirror browser-specific named/numeric entity recovery
  // rules, including semicolon-less numeric forms such as `&#115`.
  assertStudentVisibleTextSyntax(content, locale, reference);
  const value = String(content);
  const compatibilityNormalized = value.normalize("NFKC");
  assert(!/[\\]/u.test(value) && !/[\\]/u.test(compatibilityNormalized), "STUDENT_TEX_UNSUPPORTED", reference);
}

function answerValueBoundary(nextCharacter) {
  return nextCharacter === "" || /\s/u.test(nextCharacter) || ",.;!?%()]}\"'”’".includes(nextCharacter);
}

function disclosedResponseStartsCandidate(candidate, normalizedResponse) {
  if (candidate.startsWith(normalizedResponse)) {
    return answerValueBoundary(candidate.slice(normalizedResponse.length, normalizedResponse.length + 1));
  }
  const ratio = /^([1-9][0-9]*):([1-9][0-9]*)$/.exec(normalizedResponse);
  if (!ratio) return false;
  const ratioWithVariantSeparator = new RegExp(`^${ratio[1]}(?:[\\s\\p{P}\\p{S}])+${ratio[2]}`, "u");
  const match = ratioWithVariantSeparator.exec(candidate);
  return !!match && answerValueBoundary(candidate.slice(match[0].length, match[0].length + 1));
}

function containsStandaloneExpectedResponse(normalizedContent, normalizedResponse) {
  // A response-bearing student string must never contain the exact canonical
  // response as a visible token. Looking only after a small list of labels is
  // not sufficient: an author can disclose a value bare or after a synonym
  // such as "final value". Only digits and joined numeric notation can make
  // a numeric occurrence part of a larger condition: Hangul, Han, and Latin
  // text may attach directly to a visible number and must not shield a leak.
  let index = normalizedContent.indexOf(normalizedResponse);
  while (index !== -1) {
    const before = index === 0 ? "" : normalizedContent[index - 1];
    const afterIndex = index + normalizedResponse.length;
    const after = afterIndex >= normalizedContent.length ? "" : normalizedContent[afterIndex];
    const beforeNeighbor = index < 2 ? "" : normalizedContent[index - 2];
    const afterNeighbor = afterIndex + 1 >= normalizedContent.length ? "" : normalizedContent[afterIndex + 1];
    const joinsNumericTokenBefore = ".,:/".includes(before) && /[0-9]/u.test(beforeNeighbor);
    const joinsNumericTokenAfter = ".,:/".includes(after) && /[0-9]/u.test(afterNeighbor);
    const numericContinuation = /\p{N}/u.test(after) || joinsNumericTokenAfter;
    const positiveEquivalentPrefix = before === "+";
    const negativeZeroEquivalentPrefix = before === "-" && normalizedResponse === "0";
    if ((positiveEquivalentPrefix || negativeZeroEquivalentPrefix) && !numericContinuation) return true;
    const distinctNegativePrefix = before === "-" && normalizedResponse !== "0";
    const embedded = /\p{N}/u.test(before) || /\p{N}/u.test(after) || joinsNumericTokenBefore || joinsNumericTokenAfter || distinctNegativePrefix;
    if (!embedded) return true;
    index = normalizedContent.indexOf(normalizedResponse, index + 1);
  }
  return false;
}

function containsEeaNumericEquivalentAnswer(content, expectedResponse) {
  const digits = String(expectedResponse);
  if (!/^[1-9][0-9]*$/u.test(digits)) return false;
  const normalized = String(content).normalize("NFKC");
  const prefix = "(?:\\+)?0*";
  const decimalZeroSuffix = "(?:[.,]0+)?";
  function matches(expression) {
    return new RegExp("(^|[^\\p{N}])" + expression + "(?![\\p{N}])", "u").test(normalized);
  }
  if (matches(prefix + escapeRegExpLiteral(digits) + decimalZeroSuffix)) return true;
  if (digits.length < 4) return false;
  const groups = [];
  let offset = digits.length;
  while (offset > 0) {
    const nextOffset = Math.max(0, offset - 3);
    groups.unshift(digits.slice(nextOffset, offset));
    offset = nextOffset;
  }
  const groupingSeparator = "[.,\\s\\u00a0\\u202f\\u2009']+";
  const expression = prefix + escapeRegExpLiteral(groups[0]) + groupingSeparator + groups.slice(1).map(escapeRegExpLiteral).join(groupingSeparator) + decimalZeroSuffix;
  return matches(expression);
}

function eeaRomanNumeral(expectedResponse) {
  const value = Number(String(expectedResponse));
  if (!Number.isSafeInteger(value) || value < 1 || value > 3999) return null;
  const symbols = Object.freeze([
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ]);
  let remainder = value;
  let result = "";
  symbols.forEach(function (entry) {
    while (remainder >= entry[0]) {
      result += entry[1];
      remainder -= entry[0];
    }
  });
  return result;
}

function containsEeaRomanAnswerToken(content, expectedResponse) {
  const roman = eeaRomanNumeral(expectedResponse);
  if (!roman) return false;
  const matcher = new RegExp("(^|[^A-Za-z])" + roman + "(?![A-Za-z])", "iu");
  return matcher.test(String(content).normalize("NFKC"));
}

function eeaEnglishNumberWord(value) {
  const ones = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function belowOneThousand(candidate) {
    assert(candidate >= 0 && candidate < 1000, "EEA_CROSS_STUDENT_ANSWER_LEAK", "number-word");
    if (candidate < 20) return ones[candidate];
    if (candidate < 100) {
      const tensDigit = Math.floor(candidate / 10);
      const onesDigit = candidate % 10;
      return onesDigit === 0 ? tens[tensDigit] : `${tens[tensDigit]}-${ones[onesDigit]}`;
    }
    const hundredsDigit = Math.floor(candidate / 100);
    const remainder = candidate % 100;
    return `${ones[hundredsDigit]} hundred${remainder === 0 ? "" : ` ${belowOneThousand(remainder)}`}`;
  }
  assert(Number.isSafeInteger(value) && value >= 0 && value <= Number(EEA_POWER_RESULT_MAX), "EEA_CROSS_STUDENT_ANSWER_LEAK", "number-word");
  if (value < 1000) return belowOneThousand(value);
  const thousands = Math.floor(value / 1000);
  const remainder = value % 1000;
  return `${belowOneThousand(thousands)} thousand${remainder === 0 ? "" : ` ${belowOneThousand(remainder)}`}`;
}

function eeaEnglishNumberWordVariants(value) {
  const variants = [eeaEnglishNumberWord(value)];
  if (value >= 1000 && value < 10000) {
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;
    variants.push(`${eeaEnglishNumberWord(hundreds)} hundred${remainder === 0 ? "" : ` ${eeaEnglishNumberWord(remainder)}`}`);
  }
  return Object.freeze(Array.from(new Set(variants)));
}

function eeaKoreanSinoNumberWord(value, includeOneCoefficient) {
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const places = Object.freeze([[1000, "천"], [100, "백"], [10, "십"], [1, ""]]);
  function belowTenThousand(candidate) {
    let remainder = candidate;
    let result = "";
    places.forEach(function (entry) {
      const place = entry[0];
      const unit = entry[1];
      const digit = Math.floor(remainder / place);
      remainder %= place;
      if (digit === 0) return;
      if (place === 1 || digit > 1 || includeOneCoefficient) result += digits[digit];
      result += unit;
    });
    return result;
  }
  assert(Number.isSafeInteger(value) && value >= 0 && value <= Number(EEA_POWER_RESULT_MAX), "EEA_CROSS_STUDENT_ANSWER_LEAK", "number-word");
  if (value === 0) return "영";
  const tenThousands = Math.floor(value / 10000);
  const remainder = value % 10000;
  return `${tenThousands === 0 ? "" : `${tenThousands === 1 && !includeOneCoefficient ? "" : belowTenThousand(tenThousands)}만`}${remainder === 0 ? "" : belowTenThousand(remainder)}`;
}

function eeaKoreanNativeNumberWords(value) {
  return Object.freeze({
    1: Object.freeze(["하나"]),
    2: Object.freeze(["둘"]),
    3: Object.freeze(["셋"]),
    4: Object.freeze(["넷"]),
    5: Object.freeze(["다섯"]),
    6: Object.freeze(["여섯"]),
    7: Object.freeze(["일곱"]),
    8: Object.freeze(["여덟"]),
    9: Object.freeze(["아홉"])
  })[value] || Object.freeze([]);
}

function eeaKoreanBoundNumberWords(value) {
  return Object.freeze({
    1: Object.freeze(["한", "하나"]),
    2: Object.freeze(["두", "둘"]),
    3: Object.freeze(["세", "셋"]),
    4: Object.freeze(["네", "넷"])
  })[value] || Object.freeze([]);
}

function eeaChineseNumberWord(value, includeLeadingOne) {
  const digits = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  const places = Object.freeze([[1000, "千"], [100, "百"], [10, "十"], [1, ""]]);
  function belowTenThousand(candidate) {
    let remainder = candidate;
    let result = "";
    let pendingZero = false;
    places.forEach(function (entry) {
      const place = entry[0];
      const unit = entry[1];
      const digit = Math.floor(remainder / place);
      remainder %= place;
      if (digit === 0) {
        if (result && remainder > 0) pendingZero = true;
        return;
      }
      if (pendingZero) result += "零";
      pendingZero = false;
      if (!(place === 10 && digit === 1 && result === "" && !includeLeadingOne)) result += digits[digit];
      result += unit;
    });
    return result;
  }
  assert(Number.isSafeInteger(value) && value >= 0 && value <= Number(EEA_POWER_RESULT_MAX), "EEA_CROSS_STUDENT_ANSWER_LEAK", "number-word");
  if (value === 0) return digits[0];
  const tenThousands = Math.floor(value / 10000);
  const remainder = value % 10000;
  if (tenThousands === 0) return belowTenThousand(remainder);
  return `${belowTenThousand(tenThousands)}万${remainder === 0 ? "" : `${remainder < 1000 ? "零" : ""}${belowTenThousand(remainder)}`}`;
}

function eeaNumberWordForms(expectedResponse) {
  const text = String(expectedResponse);
  if (!/^(?:0|[1-9][0-9]*)$/u.test(text)) return null;
  const value = Number(text);
  if (!Number.isSafeInteger(value) || value < 0 || value > Number(EEA_POWER_RESULT_MAX)) return null;
  return Object.freeze({
    english: eeaEnglishNumberWordVariants(value),
    korean: Object.freeze([eeaKoreanSinoNumberWord(value, false), eeaKoreanSinoNumberWord(value, true)]),
    koreanNative: eeaKoreanNativeNumberWords(value),
    koreanBound: eeaKoreanBoundNumberWords(value),
    chinese: Object.freeze([eeaChineseNumberWord(value, false), eeaChineseNumberWord(value, true)])
  });
}

function containsEeaEnglishNumberWord(content, word) {
  const joiner = "(?:[\\s,\\-\\u2010-\\u2015\\u2212\\u2796\\uFE58\\uFE63\\uFF0D])*";
  const rawParts = word.split(/[ -]/u).filter(Boolean);
  const parts = rawParts.map(function (part, index) {
    return part === "one" && ["hundred", "thousand"].includes(rawParts[index + 1]) ? "(?:one|a)" : escapeRegExpLiteral(part);
  });
  let expression = parts[0];
  for (let index = 1; index < parts.length; index += 1) {
    const separator = ["hundred", "thousand"].includes(rawParts[index - 1])
      ? joiner + "(?:and" + joiner + ")?"
      : joiner;
    expression += separator + parts[index];
  }
  const matcher = new RegExp("(^|[^\\p{L}])" + expression + "(?![\\p{L}])", "iu");
  return matcher.test(String(content).normalize("NFKC"));
}

function containsEeaKoreanNumberWord(content, word) {
  const normalized = String(content).normalize("NFKC");
  if (word.length > 1) return normalized.replace(/[\s,'\-\u2010-\u2015\u2212\u2796\uFE58\uFE63\uFF0D]/gu, "").includes(word);
  const matcher = new RegExp("(^|[^\\p{Script=Hangul}])" + escapeRegExpLiteral(word) + "(?![\\p{Script=Hangul}])", "u");
  return matcher.test(normalized);
}

function containsEeaChineseNumberWord(content, word) {
  const expression = escapeRegExpLiteral(word)
    .replace(/零/gu, "零?")
    .replace(/二(?=[百千万])/gu, "[二两兩]")
    .replace(/万/gu, "[万萬]");
  return new RegExp(expression, "u").test(String(content).normalize("NFKC"));
}

function containsEeaKoreanBoundNumberWord(content, word) {
  const normalized = String(content).normalize("NFKC");
  const counters = "(?:개|명|번|가지|장|권|대|마리|살|시|분|초|줄|칸|회|번째)";
  const particle = "(?:의|은|는|이|가|을|를|와|과|도|만|이다|입니다)?";
  const matcher = new RegExp("(^|[^\\p{Script=Hangul}])" + escapeRegExpLiteral(word) + "\\s*" + counters + particle + "(?![\\p{Script=Hangul}])", "u");
  return matcher.test(normalized);
}

function containsEeaLocalizedAnswerWord(content, expectedResponse) {
  const forms = eeaNumberWordForms(expectedResponse);
  if (!forms) return false;
  const normalized = String(content).normalize("NFKC");
  return forms.english.some(function (word) { return containsEeaEnglishNumberWord(normalized, word); }) ||
    forms.korean.some(function (word) { return containsEeaKoreanNumberWord(normalized, word); }) ||
    forms.koreanNative.some(function (word) { return containsEeaKoreanNumberWord(normalized, word); }) ||
    forms.koreanBound.some(function (word) { return containsEeaKoreanBoundNumberWord(normalized, word); }) ||
    forms.chinese.some(function (word) { return containsEeaChineseNumberWord(normalized, word); });
}

function assertStudentContentDoesNotRevealAnswer(content, expectedResponse, reference, locale) {
  const normalizedContent = assertStudentAnswerLabelAbsent(content, reference);
  // Response-bearing student blocks accept plain text only until content is
  // separated into validated text and math blocks with an explicit allowlist.
  assertResponseStudentTextSyntax(content, locale, reference);
  const normalizedResponse = normalizeForAnswerLeakScan(expectedResponse);
  assert(nonBlankText(normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  if (["<", ">"].includes(normalizedResponse)) {
    const hasUnsupportedMathSymbol = Array.from(normalizedContent).some(function (symbol) {
      return /\p{Sm}/u.test(symbol) && !SAFE_COMPARISON_PROMPT_MATH_SYMBOLS.has(symbol);
    });
    assert(!hasUnsupportedMathSymbol, "STUDENT_ANSWER_LEAK", reference);
  } else {
    assert(!containsStandaloneExpectedResponse(normalizedContent, normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  }
  ANSWER_VALUE_LABEL.lastIndex = 0;
  let label;
  while ((label = ANSWER_VALUE_LABEL.exec(normalizedContent))) {
    let candidate = normalizedContent.slice(label.index + label[0].length);
    candidate = candidate.replace(ANSWER_VALUE_GRAMMAR_CONNECTOR, "").replace(ANSWER_VALUE_SEPARATOR, "").replace(ANSWER_VALUE_WRAPPER, "");
    assert(!disclosedResponseStartsCandidate(candidate, normalizedResponse), "STUDENT_ANSWER_LEAK", reference);
  }
}

function validateLocalePolicy(policy, reference) {
  assertOnlyKeys(policy, LOCALE_POLICY_KEYS, "LOCALE_POLICY_INVALID", reference);
  assertDenseArray(policy.required, "LOCALE_POLICY_INVALID", reference);
  assertDenseArray(policy.included, "LOCALE_POLICY_INVALID", reference);
  assert(JSON.stringify(policy.required) === JSON.stringify(["ko", "en"]), "LOCALE_POLICY_INVALID", reference);
  assert(policy.included.length >= 2 && policy.included.length <= 3, "LOCALE_POLICY_INVALID", reference);
  assert(policy.included[0] === "ko" && policy.included[1] === "en", "LOCALE_POLICY_INVALID", reference);
  if (policy.included.length === 3) assert(policy.included[2] === "zh-Hans", "LOCALE_POLICY_INVALID", reference);
  assert(new Set(policy.included).size === policy.included.length, "LOCALE_POLICY_INVALID", reference);
}

function localReference(value, fallback) {
  return value && typeof value === "string" ? value : fallback;
}

function standardUnit(pack, reference) {
  const unit = registry.units.find(function (candidate) { return candidate.unitId === pack.unitId; });
  assert(unit && unit.grade === 6, "WORKBOOK_UNIT_NOT_GRADE6", reference);
  const expectedSkillId = registry.skillIdForCluster(unit.clusterId);
  assert(pack.clusterId === unit.clusterId && pack.skillId === expectedSkillId, "WORKBOOK_LINEAGE_INVALID", reference);
  assert(pack.programId === registry.COURSE_ID && pack.targetGrade === 6, "WORKBOOK_LINEAGE_INVALID", reference);
  return unit;
}

function validateRightsDraft(rights, reference) {
  assertOnlyKeys(rights, RIGHTS_KEYS, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.mode === "owned_original" && rights.originType === "gfield-authored" && rights.authority === "GFIELD", "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.translationAllowed === true && rights.derivativeAllowed === true, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.externalSourceUsed === false && rights.contestWordingUsed === false, "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
  assert(rights.decision === "pending-independent-review", "WORKBOOK_RIGHTS_DRAFT_INVALID", reference);
}

function validateVerification(verification, reference) {
  assertOnlyKeys(verification, VERIFICATION_KEYS, "WORKBOOK_VERIFICATION_INVALID", reference);
  ["authorMathCheck", "authorTranslationCheck", "authorRightsCheck"].forEach(function (field) {
    assert(verification[field] === "complete-not-independent", "WORKBOOK_VERIFICATION_INVALID", reference);
  });
  assertDenseArray(verification.requiredReviews, "WORKBOOK_VERIFICATION_INVALID", reference);
  assert(JSON.stringify(verification.requiredReviews) === JSON.stringify(REQUIRED_REVIEWS), "WORKBOOK_VERIFICATION_INVALID", reference);
  assert(verification.releaseState === "not-eligible", "WORKBOOK_VERIFICATION_INVALID", reference);
}

function validateStandardsEvidence(evidence, policy, unit, reference) {
  if (unit.unitId === "ccss-6-ns-c") {
    assertRecord(evidence, "STANDARDS_EVIDENCE_INVALID", reference);
    assertOnlyKeys(evidence, STANDARDS_EVIDENCE_KEYS, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(evidence.state === "partial-graphing-observation-locked", "STANDARDS_EVIDENCE_INVALID", reference);
    assertDenseArray(evidence.autoEvidenceIds, "STANDARDS_EVIDENCE_INVALID", reference);
    const requiredAutomaticEvidence = new Set([
      "6.NS.C.6-quadrant-classification",
      "6.NS.C.7-signed-rational-order",
      "6.NS.C.8-same-axis-distance"
    ]);
    assert(
      evidence.autoEvidenceIds.length === requiredAutomaticEvidence.size &&
        new Set(evidence.autoEvidenceIds).size === requiredAutomaticEvidence.size &&
        evidence.autoEvidenceIds.every(function (evidenceId) { return typeof evidenceId === "string" && requiredAutomaticEvidence.has(evidenceId); }),
      "STANDARDS_EVIDENCE_INVALID",
      reference
    );
    requireLocales(evidence.lockedEvidenceByLocale, policy, "STANDARDS_EVIDENCE_INVALID", reference);
    return;
  }
  if (unit.unitId === "ccss-6-ee-a") {
    assertRecord(evidence, "STANDARDS_EVIDENCE_INVALID", reference);
    assertOnlyKeys(evidence, STANDARDS_EVIDENCE_KEYS, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(evidence.state === "partial-whole-number-power-evaluation-locked", "STANDARDS_EVIDENCE_INVALID", reference);
    assertDenseArray(evidence.autoEvidenceIds, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(
      evidence.autoEvidenceIds.length === 1 && evidence.autoEvidenceIds[0] === EEA_POWER_EVIDENCE_ID,
      "STANDARDS_EVIDENCE_INVALID",
      reference
    );
    requireLocales(evidence.lockedEvidenceByLocale, policy, "STANDARDS_EVIDENCE_INVALID", reference);
    const requiredLockLanguage = Object.freeze({
      ko: ["6.EE.A.1", "지수 표기", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4", "완전 숙달", "승급"],
      en: ["6.EE.A.1", "exponent notation", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4", "full mastery", "promotion"],
      "zh-Hans": ["6.EE.A.1", "指数记法", "6.EE.A.2", "6.EE.A.3", "6.EE.A.4", "完全掌握", "升学"]
    });
    policy.included.forEach(function (locale) {
      const lockText = evidence.lockedEvidenceByLocale[locale].toLocaleLowerCase("en-US");
      assert(requiredLockLanguage[locale].every(function (requiredText) {
        return lockText.includes(requiredText.toLocaleLowerCase("en-US"));
      }), "STANDARDS_EVIDENCE_INVALID", reference);
    });
    return;
  }
  if (unit.unitId === "ccss-6-ee-b") {
    assertRecord(evidence, "STANDARDS_EVIDENCE_INVALID", reference);
    assertOnlyKeys(evidence, STANDARDS_EVIDENCE_KEYS, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(evidence.state === "partial-positive-whole-equality-substitution-truth-locked", "STANDARDS_EVIDENCE_INVALID", reference);
    assertDenseArray(evidence.autoEvidenceIds, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(
      evidence.autoEvidenceIds.length === 1 && evidence.autoEvidenceIds[0] === EEB_SUBSTITUTION_EVIDENCE_ID,
      "STANDARDS_EVIDENCE_INVALID",
      reference
    );
    requireLocales(evidence.lockedEvidenceByLocale, policy, "STANDARDS_EVIDENCE_INVALID", reference);
    policy.included.forEach(function (locale) {
      assert(evidence.lockedEvidenceByLocale[locale] === EEB_LOCKED_EVIDENCE_BY_LOCALE[locale], "STANDARDS_EVIDENCE_INVALID", reference);
    });
    return;
  }
  if (unit.unitId === "ccss-6-ee-c") {
    assertRecord(evidence, "STANDARDS_EVIDENCE_INVALID", reference);
    assertOnlyKeys(evidence, STANDARDS_EVIDENCE_KEYS, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(evidence.state === "partial-finite-whole-direct-variation-table-equation-completion-locked", "STANDARDS_EVIDENCE_INVALID", reference);
    assertDenseArray(evidence.autoEvidenceIds, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(
      evidence.autoEvidenceIds.length === 1 && evidence.autoEvidenceIds[0] === EEC_TABLE_EQUATION_EVIDENCE_ID,
      "STANDARDS_EVIDENCE_INVALID",
      reference
    );
    requireLocales(evidence.lockedEvidenceByLocale, policy, "STANDARDS_EVIDENCE_INVALID", reference);
    policy.included.forEach(function (locale) {
      assert(evidence.lockedEvidenceByLocale[locale] === EEC_LOCKED_EVIDENCE_BY_LOCALE[locale], "STANDARDS_EVIDENCE_INVALID", reference);
    });
    return;
  }
  if (unit.unitId === "ccss-6-g-a") {
    assertRecord(evidence, "STANDARDS_EVIDENCE_INVALID", reference);
    assertOnlyKeys(evidence, STANDARDS_EVIDENCE_KEYS, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(evidence.state === "partial-finite-whole-right-triangle-area-from-labeled-base-height-locked", "STANDARDS_EVIDENCE_INVALID", reference);
    assertDenseArray(evidence.autoEvidenceIds, "STANDARDS_EVIDENCE_INVALID", reference);
    assert(
      evidence.autoEvidenceIds.length === 1 && evidence.autoEvidenceIds[0] === GGA_TRIANGLE_AREA_EVIDENCE_ID,
      "STANDARDS_EVIDENCE_INVALID",
      reference
    );
    requireLocales(evidence.lockedEvidenceByLocale, policy, "STANDARDS_EVIDENCE_INVALID", reference);
    policy.included.forEach(function (locale) {
      assert(evidence.lockedEvidenceByLocale[locale] === GGA_LOCKED_EVIDENCE_BY_LOCALE[locale], "STANDARDS_EVIDENCE_INVALID", reference);
    });
    return;
  }
  assert(evidence === undefined, "STANDARDS_EVIDENCE_INVALID", reference);
}

function validateFrontMatter(frontMatter, policy, reference) {
  assertOnlyKeys(frontMatter, FRONT_MATTER_KEYS, "FRONT_MATTER_INVALID", reference);
  ["titleByLocale", "learningTargetsByLocale", "howToUseByLocale"].forEach(function (field) {
    requireStudentVisibleLocales(frontMatter[field], policy, "FRONT_MATTER_INVALID", reference);
  });
}

function validateClosingMatter(closingMatter, policy, reference) {
  assertOnlyKeys(closingMatter, CLOSING_MATTER_KEYS, "CLOSING_MATTER_INVALID", reference);
  ["glossaryByLocale", "retentionNoticeByLocale"].forEach(function (field) {
    requireStudentVisibleLocales(closingMatter[field], policy, "CLOSING_MATTER_INVALID", reference);
  });
}

function findResource(plan, binding, reference) {
  assertOnlyKeys(binding, BINDING_KEYS, "RESOURCE_BINDING_INVALID", reference);
  const candidates = (plan.resourcesByAudience[binding.audience] || []).filter(function (resource) {
    return resource.resourcePlanItemId === binding.resourcePlanItemId;
  });
  assert(candidates.length === 1, "RESOURCE_BINDING_INVALID", reference);
  const resource = candidates[0];
  ["courseId", "unitId", "skillId", "sessionId", "audience", "levelId", "testType", "resourceType"].forEach(function (field) {
    assert(binding[field] === resource[field], "RESOURCE_BINDING_INVALID", reference);
  });
  assert(binding.bindingState === LOCAL_BINDING_STATE, "RESOURCE_BINDING_INVALID", reference);
  assert(resource.bindingState === resourcePlans.PLAN_STATES.unbound, "PUBLIC_RESOURCE_ALREADY_BOUND", reference);
  assert(resource.deliveryRequirement === (resource.audience === "student" ? "authenticated-student-only" : "authenticated-teacher-or-admin-only"), "RESOURCE_DELIVERY_BOUNDARY_INVALID", reference);
  return resource;
}

function componentCounts(components) {
  const counts = new Map();
  components.forEach(function (component) {
    counts.set(component.componentType, (counts.get(component.componentType) || 0) + 1);
  });
  return counts;
}

function assertPlannedComponentCounts(components, resource, reference) {
  const actual = componentCounts(components);
  const planned = new Map(resource.plannedComponents.map(function (component) { return [component.componentType, component.plannedCount]; }));
  assert(actual.size === planned.size, "PLANNED_COMPONENT_COUNT_MISMATCH", reference);
  planned.forEach(function (count, componentType) {
    assert(actual.get(componentType) === count, "PLANNED_COMPONENT_COUNT_MISMATCH", reference);
  });
}

function validateEecTableValues(independentValues, dependentValues, reference) {
  assertDenseArray(independentValues, "EEC_RELATION_TABLE_INVALID", reference);
  assertDenseArray(dependentValues, "EEC_RELATION_TABLE_INVALID", reference);
  assert(independentValues.length === 3 && dependentValues.length === 3, "EEC_RELATION_TABLE_INVALID", reference);
  assert(
    independentValues[0] === 0 && dependentValues[0] === 0 &&
      independentValues.slice(1).every(function (value) {
        return Number.isSafeInteger(value) && value >= 1 && value <= EEC_INDEPENDENT_VALUE_MAX;
      }) &&
      dependentValues.slice(1).every(function (value) {
        return Number.isSafeInteger(value) && value >= 1 && value <= EEC_DEPENDENT_VALUE_MAX;
      }) &&
      independentValues[1] < independentValues[2],
    "EEC_RELATION_TABLE_INVALID",
    reference
  );
}

function validateEecRelationTable(table, reference) {
  assertExactDataKeys(table, ["form", "independentSymbol", "dependentSymbol", "independentValues", "dependentValues"], "EEC_RELATION_TABLE_INVALID", reference);
  assert(table.form === "y-equals-rate-times-x" && table.independentSymbol === "x" && table.dependentSymbol === "y", "EEC_RELATION_TABLE_INVALID", reference);
  validateEecTableValues(table.independentValues, table.dependentValues, reference);
}

function validateGgaGeometryDiagram(diagram, reference) {
  assertOnlyKeys(diagram, GEOMETRY_DIAGRAM_KEYS, "GGA_GEOMETRY_DIAGRAM_INVALID", reference);
  assert(Object.getOwnPropertyNames(diagram).length === GEOMETRY_DIAGRAM_KEYS.size, "GGA_GEOMETRY_DIAGRAM_INVALID", reference);
  assert(
    diagram.kind === GGA_GEOMETRY_DIAGRAM_KIND &&
      diagram.heightFoot === "left-base-endpoint" &&
      Number.isSafeInteger(diagram.base) && diagram.base >= GGA_BASE_MIN && diagram.base <= GGA_BASE_MAX &&
      Number.isSafeInteger(diagram.perpendicularHeight) &&
      diagram.perpendicularHeight >= GGA_PERPENDICULAR_HEIGHT_MIN && diagram.perpendicularHeight <= GGA_PERPENDICULAR_HEIGHT_MAX &&
      (BigInt(diagram.base) * BigInt(diagram.perpendicularHeight)) % 2n === 0n,
    "GGA_GEOMETRY_DIAGRAM_INVALID",
    reference
  );
}

function validateStudentComponent(component, policy, reference, unitId) {
  assertOnlyKeys(component, STUDENT_COMPONENT_KEYS, "STUDENT_COMPONENT_INVALID", reference);
  assertStudentNeutralId(component.componentId, "cmp-dft-", "STUDENT_COMPONENT_INVALID", reference);
  assert(Number.isInteger(component.sequence) && component.sequence > 0 && component.sequence <= 100, "STUDENT_COMPONENT_INVALID", reference);
  requireStudentVisibleLocales(component.contentByLocale, policy, "STUDENT_COMPONENT_INVALID", reference);
  const isTeachingBlock = TEACHING_COMPONENT_TYPES.has(component.componentType);
  if (isTeachingBlock) {
    assert(component.responseMode === null && component.teacherReferenceId === null, "STUDENT_COMPONENT_INVALID", reference);
    assert(component.relationTable === undefined, "EEC_RELATION_TABLE_INVALID", reference);
    assert(component.geometryDiagram === undefined, "GGA_GEOMETRY_DIAGRAM_INVALID", reference);
  } else {
    assert(RESPONSE_MODES.has(component.responseMode), "STUDENT_COMPONENT_INVALID", reference);
    assertStudentNeutralId(component.teacherReferenceId, "ref-dft-", "STUDENT_COMPONENT_INVALID", reference);
    Object.entries(component.contentByLocale).forEach(function (entry) {
      const locale = entry[0];
      const content = entry[1];
      assertResponseStudentTextSyntax(content, locale, reference);
      assertStudentAnswerLabelAbsent(content, reference);
    });
    if (unitId === "ccss-6-ee-c") validateEecRelationTable(component.relationTable, reference);
    else assert(component.relationTable === undefined, "EEC_RELATION_TABLE_INVALID", reference);
    if (unitId === "ccss-6-g-a") validateGgaGeometryDiagram(component.geometryDiagram, reference);
    else assert(component.geometryDiagram === undefined, "GGA_GEOMETRY_DIAGRAM_INVALID", reference);
  }
}

function validateStudentSection(section, plan, policy, seenSectionIds, seenComponentIds, expectedResources) {
  const reference = localReference(section && section.sectionId, "student-section");
  assertOnlyKeys(section, SECTION_KEYS, "STUDENT_SECTION_INVALID", reference);
  assertStudentNeutralId(section.sectionId, "sct-dft-", "STUDENT_SECTION_INVALID", reference);
  assert(!seenSectionIds.has(section.sectionId), "DUPLICATE_STUDENT_SECTION", reference);
  seenSectionIds.add(section.sectionId);
  assert(section.sectionVersion === 1 && section.audience === "student" && section.productionState === PRODUCTION_STATE, "STUDENT_SECTION_INVALID", reference);
  requireStudentVisibleLocales(section.titleByLocale, policy, "STUDENT_SECTION_INVALID", reference);
  const resource = findResource(plan, section.resourceBinding, reference);
  assert(resource.audience === "student", "STUDENT_SECTION_INVALID", reference);
  assert(expectedResources.has(resource.resourcePlanItemId), "STUDENT_RESOURCE_NOT_IN_SCOPE", reference);
  assertDenseArray(section.components, "STUDENT_SECTION_INVALID", reference);
  assertPlannedComponentCounts(section.components, resource, reference);
  const sequences = [];
  section.components.forEach(function (component) {
    validateStudentComponent(component, policy, localReference(component && component.componentId, reference), resource.unitId);
    assert(!seenComponentIds.has(component.componentId), "DUPLICATE_STUDENT_COMPONENT", component.componentId);
    seenComponentIds.add(component.componentId);
    sequences.push(component.sequence);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(section.components.map(function (_component, index) { return index + 1; })), "STUDENT_COMPONENT_SEQUENCE_INVALID", reference);
  return Object.freeze({ resource, section });
}

function validateTeacherComponent(component, policy, reference) {
  assertOnlyKeys(component, TEACHER_COMPONENT_KEYS, "TEACHER_COMPONENT_INVALID", reference);
  assertId(component.componentId, "tcmp-dft-", "TEACHER_COMPONENT_INVALID", reference);
  assert(Number.isInteger(component.sequence) && component.sequence > 0 && component.sequence <= 100, "TEACHER_COMPONENT_INVALID", reference);
  requireLocales(component.contentByLocale, policy, "TEACHER_COMPONENT_INVALID", reference);
}

function validateLessonSegments(segments, artifact, policy, reference) {
  assertDenseArray(segments, "LESSON_SEGMENTS_INVALID", reference);
  if (artifact.resourceBinding.resourceType !== "lesson-plan") {
    assert(segments.length === 0, "LESSON_SEGMENTS_INVALID", reference);
    return;
  }
  assert(segments.length >= 4 && segments.length <= 8, "LESSON_SEGMENTS_INVALID", reference);
  const ids = new Set();
  const sequences = [];
  let totalMinutes = 0;
  segments.forEach(function (segment) {
    assertOnlyKeys(segment, SEGMENT_KEYS, "LESSON_SEGMENTS_INVALID", reference);
    assertId(segment.segmentId, "seg-dft-", "LESSON_SEGMENTS_INVALID", reference);
    assert(!ids.has(segment.segmentId), "LESSON_SEGMENTS_INVALID", reference);
    ids.add(segment.segmentId);
    assert(Number.isInteger(segment.sequence) && segment.sequence > 0, "LESSON_SEGMENTS_INVALID", reference);
    assert(Number.isInteger(segment.minutes) && segment.minutes >= 5 && segment.minutes <= 30, "LESSON_SEGMENTS_INVALID", reference);
    requireLocales(segment.instructionByLocale, policy, "LESSON_SEGMENTS_INVALID", reference);
    sequences.push(segment.sequence);
    totalMinutes += segment.minutes;
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(segments.map(function (_segment, index) { return index + 1; })), "LESSON_SEGMENTS_INVALID", reference);
  assert(totalMinutes === resourcePlans.GRADE6_CADENCE.minutesPerSession, "LESSON_MINUTES_INVALID", reference);
}

function positiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0 && value <= 1000000000;
}

function nonNegativeInteger(value) {
  return Number.isSafeInteger(value) && value >= 0 && value <= 1000000000;
}

function signedInteger(value) {
  return Number.isSafeInteger(value) && Math.abs(value) <= 1000000000;
}

function greatestCommonDivisor(left, right) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function greatestCommonDivisorBigInt(left, right) {
  let a = left < 0n ? -left : left;
  let b = right < 0n ? -right : right;
  while (b !== 0n) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a;
}

function canonicalSignedRational(numerator, denominator, reference) {
  assert(denominator > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  if (numerator === 0n) return "0";
  const negative = numerator < 0n;
  const absoluteNumerator = negative ? -numerator : numerator;
  const divisor = greatestCommonDivisorBigInt(absoluteNumerator, denominator);
  const reducedNumerator = absoluteNumerator / divisor;
  const reducedDenominator = denominator / divisor;
  const magnitude = reducedDenominator === 1n ? String(reducedNumerator) : `${reducedNumerator}/${reducedDenominator}`;
  return negative ? `-${magnitude}` : magnitude;
}

function canonicalRational(numerator, denominator, reference) {
  assert(numerator >= 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalSignedRational(numerator, denominator, reference);
}

function signedRationalParts(numerator, denominator, reference) {
  assert(signedInteger(numerator) && positiveInteger(denominator), "ARITHMETIC_CHECK_INVALID", reference);
  return Object.freeze({ numerator: BigInt(numerator), denominator: BigInt(denominator) });
}

function compareSignedRationals(left, right) {
  const difference = left.numerator * right.denominator - right.numerator * left.denominator;
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

function canonicalSignedRationalDistance(left, right, reference) {
  const numerator = left.numerator * right.denominator - right.numerator * left.denominator;
  const absoluteNumerator = numerator < 0n ? -numerator : numerator;
  return canonicalSignedRational(absoluteNumerator, left.denominator * right.denominator, reference);
}

function canonicalSignedRationalOpposite(check, reference) {
  assertExactDataKeys(check, ["kind", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
  const value = signedRationalParts(check.numerator, check.denominator, reference);
  return canonicalSignedRational(-value.numerator, value.denominator, reference);
}

function canonicalSignedRationalAbsoluteValue(check, reference) {
  assertExactDataKeys(check, ["kind", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
  const value = signedRationalParts(check.numerator, check.denominator, reference);
  return canonicalSignedRational(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator, reference);
}

function canonicalSignedRationalOperation(check, reference) {
  const operation = ownDataValue(check, "operation", "ARITHMETIC_CHECK_INVALID", reference);
  if (["identity", "opposite", "absolute-value"].includes(operation)) {
    assertExactDataKeys(check, ["kind", "operation", "numerator", "denominator"], "ARITHMETIC_CHECK_INVALID", reference);
    const value = signedRationalParts(check.numerator, check.denominator, reference);
    if (operation === "identity") return canonicalSignedRational(value.numerator, value.denominator, reference);
    if (operation === "opposite") return canonicalSignedRational(-value.numerator, value.denominator, reference);
    return canonicalSignedRational(value.numerator < 0n ? -value.numerator : value.numerator, value.denominator, reference);
  }
  if (operation === "axis-distance") {
    assertExactDataKeys(check, [
      "kind", "operation", "axis",
      "firstXNumerator", "firstXDenominator", "firstYNumerator", "firstYDenominator",
      "secondXNumerator", "secondXDenominator", "secondYNumerator", "secondYDenominator"
    ], "ARITHMETIC_CHECK_INVALID", reference);
    assert(["horizontal", "vertical"].includes(check.axis), "ARITHMETIC_CHECK_INVALID", reference);
    const firstX = signedRationalParts(check.firstXNumerator, check.firstXDenominator, reference);
    const firstY = signedRationalParts(check.firstYNumerator, check.firstYDenominator, reference);
    const secondX = signedRationalParts(check.secondXNumerator, check.secondXDenominator, reference);
    const secondY = signedRationalParts(check.secondYNumerator, check.secondYDenominator, reference);
    if (check.axis === "horizontal") {
      assert(compareSignedRationals(firstY, secondY) === 0, "ARITHMETIC_CHECK_INVALID", reference);
      return canonicalSignedRationalDistance(firstX, secondX, reference);
    }
    assert(compareSignedRationals(firstX, secondX) === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return canonicalSignedRationalDistance(firstY, secondY, reference);
  }
  assert(["minimum", "maximum", "distance"].includes(operation), "ARITHMETIC_CHECK_INVALID", reference);
  assertExactDataKeys(check, [
    "kind", "operation", "leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  const left = signedRationalParts(check.leftNumerator, check.leftDenominator, reference);
  const right = signedRationalParts(check.rightNumerator, check.rightDenominator, reference);
  const comparison = compareSignedRationals(left, right);
  if (operation === "minimum") return canonicalSignedRational((comparison <= 0 ? left : right).numerator, (comparison <= 0 ? left : right).denominator, reference);
  if (operation === "maximum") return canonicalSignedRational((comparison >= 0 ? left : right).numerator, (comparison >= 0 ? left : right).denominator, reference);
  assert(left.numerator === 0n || right.numerator === 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalSignedRationalDistance(left, right, reference);
}

function canonicalSignedRationalComparison(check, reference) {
  assertExactDataKeys(check, [
    "kind", "basis", "leftNumerator", "leftDenominator", "rightNumerator", "rightDenominator"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  assert(["signed-value", "absolute-magnitude"].includes(check.basis), "ARITHMETIC_CHECK_INVALID", reference);
  const left = signedRationalParts(check.leftNumerator, check.leftDenominator, reference);
  const right = signedRationalParts(check.rightNumerator, check.rightDenominator, reference);
  const leftCompared = check.basis === "absolute-magnitude" && left.numerator < 0n
    ? Object.freeze({ numerator: -left.numerator, denominator: left.denominator }) : left;
  const rightCompared = check.basis === "absolute-magnitude" && right.numerator < 0n
    ? Object.freeze({ numerator: -right.numerator, denominator: right.denominator }) : right;
  const comparison = compareSignedRationals(leftCompared, rightCompared);
  assert(comparison !== 0, "ARITHMETIC_CHECK_INVALID", reference);
  return comparison < 0 ? "<" : ">";
}

function canonicalQuadrantClassification(check, reference) {
  assertExactDataKeys(check, [
    "kind", "xNumerator", "xDenominator", "yNumerator", "yDenominator"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  const x = signedRationalParts(check.xNumerator, check.xDenominator, reference);
  const y = signedRationalParts(check.yNumerator, check.yDenominator, reference);
  assert(x.numerator !== 0n && y.numerator !== 0n, "ARITHMETIC_CHECK_INVALID", reference);
  if (x.numerator > 0n && y.numerator > 0n) return "1";
  if (x.numerator < 0n && y.numerator > 0n) return "2";
  if (x.numerator < 0n && y.numerator < 0n) return "3";
  return "4";
}

function powerOfTen(exponent, reference) {
  assert(Number.isInteger(exponent) && exponent >= 0 && exponent <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  return 10n ** BigInt(exponent);
}

function canonicalDecimalFromScaled(coefficient, scale, reference) {
  assert(typeof coefficient === "bigint" && coefficient >= 0n && Number.isInteger(scale) && scale >= 0 && scale <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  if (coefficient === 0n) return "0";
  let normalizedCoefficient = coefficient;
  let normalizedScale = scale;
  while (normalizedScale > 0 && normalizedCoefficient % 10n === 0n) {
    normalizedCoefficient /= 10n;
    normalizedScale -= 1;
  }
  const digits = String(normalizedCoefficient).padStart(normalizedScale + 1, "0");
  const whole = normalizedScale === 0 ? digits : digits.slice(0, -normalizedScale);
  const fractional = normalizedScale === 0 ? "" : digits.slice(-normalizedScale);
  assert(whole.length <= 12 && fractional.length <= 8, "ARITHMETIC_CHECK_INVALID", reference);
  return normalizedScale === 0 ? whole : `${whole}.${fractional}`;
}

function parseCanonicalDecimal(value, maximumScale, reference) {
  assert(typeof value === "string" && /^(?:0|[1-9][0-9]{0,5})(?:\.[0-9]+)?$/u.test(value), "ARITHMETIC_CHECK_INVALID", reference);
  const parts = value.split(".");
  const fractional = parts[1] || "";
  assert(fractional.length <= maximumScale, "ARITHMETIC_CHECK_INVALID", reference);
  const coefficient = BigInt(`${parts[0]}${fractional}`);
  assert(canonicalDecimalFromScaled(coefficient, fractional.length, reference) === value, "ARITHMETIC_CHECK_INVALID", reference);
  return Object.freeze({ coefficient, scale: fractional.length });
}

function canonicalTerminatingDecimal(numerator, denominator, reference) {
  assert(numerator >= 0n && denominator > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  if (numerator === 0n) return "0";
  const divisor = greatestCommonDivisorBigInt(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  let remainingDenominator = reducedDenominator;
  let powersOfTwo = 0;
  let powersOfFive = 0;
  while (remainingDenominator % 2n === 0n) {
    remainingDenominator /= 2n;
    powersOfTwo += 1;
  }
  while (remainingDenominator % 5n === 0n) {
    remainingDenominator /= 5n;
    powersOfFive += 1;
  }
  assert(remainingDenominator === 1n, "ARITHMETIC_CHECK_INVALID", reference);
  const scale = Math.max(powersOfTwo, powersOfFive);
  assert(scale <= 8, "ARITHMETIC_CHECK_INVALID", reference);
  const scaledCoefficient = reducedNumerator * (powerOfTen(scale, reference) / reducedDenominator);
  return canonicalDecimalFromScaled(scaledCoefficient, scale, reference);
}

function canonicalDecimalOperation(check, reference) {
  assertExactDataKeys(check, ["kind", "operation", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(["add", "subtract", "multiply", "divide"].includes(check.operation), "ARITHMETIC_CHECK_INVALID", reference);
  const maximumScale = check.operation === "multiply" ? 2 : check.operation === "divide" ? 3 : 3;
  const left = parseCanonicalDecimal(check.left, maximumScale, reference);
  const right = parseCanonicalDecimal(check.right, check.operation === "divide" ? 2 : maximumScale, reference);
  if (check.operation === "add" || check.operation === "subtract") {
    const scale = Math.max(left.scale, right.scale);
    const leftCoefficient = left.coefficient * powerOfTen(scale - left.scale, reference);
    const rightCoefficient = right.coefficient * powerOfTen(scale - right.scale, reference);
    assert(check.operation !== "subtract" || leftCoefficient >= rightCoefficient, "ARITHMETIC_CHECK_INVALID", reference);
    return canonicalDecimalFromScaled(check.operation === "add" ? leftCoefficient + rightCoefficient : leftCoefficient - rightCoefficient, scale, reference);
  }
  if (check.operation === "multiply") {
    return canonicalDecimalFromScaled(left.coefficient * right.coefficient, left.scale + right.scale, reference);
  }
  assert(right.coefficient > 0n, "ARITHMETIC_CHECK_INVALID", reference);
  return canonicalTerminatingDecimal(
    left.coefficient * powerOfTen(right.scale, reference),
    powerOfTen(left.scale, reference) * right.coefficient,
    reference
  );
}

function canonicalWholeGcf(check, reference) {
  assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(Number.isSafeInteger(check.left) && Number.isSafeInteger(check.right) && check.left >= 1 && check.left <= 100 && check.right >= 1 && check.right <= 100, "ARITHMETIC_CHECK_INVALID", reference);
  return String(greatestCommonDivisor(check.left, check.right));
}

function canonicalWholeLcm(check, reference) {
  assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(Number.isSafeInteger(check.left) && Number.isSafeInteger(check.right) && check.left >= 1 && check.left <= 12 && check.right >= 1 && check.right <= 12, "ARITHMETIC_CHECK_INVALID", reference);
  return String((check.left / greatestCommonDivisor(check.left, check.right)) * check.right);
}

function canonicalWholeNumberPower(check, reference) {
  assertExactDataKeys(check, ["kind", "base", "exponent"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(
    Number.isSafeInteger(check.base) && check.base >= EEA_POWER_BASE_MIN && check.base <= EEA_POWER_BASE_MAX &&
      Number.isSafeInteger(check.exponent) && check.exponent >= EEA_POWER_EXPONENT_MIN && check.exponent <= EEA_POWER_EXPONENT_MAX,
    "ARITHMETIC_CHECK_INVALID",
    reference
  );
  const result = BigInt(check.base) ** BigInt(check.exponent);
  assert(result <= EEA_POWER_RESULT_MAX, "ARITHMETIC_CHECK_INVALID", reference);
  return String(result);
}

function canonicalPositiveWholeEqualitySubstitutionTruth(check, reference) {
  assertExactDataKeys(check, ["kind", "form", "candidateSet", "candidate", "addend", "total"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(check.form === "x-plus-p-equals-q", "ARITHMETIC_CHECK_INVALID", reference);
  assertDenseArray(check.candidateSet, "ARITHMETIC_CHECK_INVALID", reference);
  assert(check.candidateSet.length === 3, "ARITHMETIC_CHECK_INVALID", reference);
  assert(
    check.candidateSet.every(function (value) {
      return Number.isSafeInteger(value) && value >= EEB_CANDIDATE_MIN && value <= EEB_CANDIDATE_MAX;
    }) &&
      check.candidateSet[0] < check.candidateSet[1] && check.candidateSet[1] < check.candidateSet[2],
    "ARITHMETIC_CHECK_INVALID",
    reference
  );
  assert(
    Number.isSafeInteger(check.candidate) && check.candidate >= EEB_CANDIDATE_MIN && check.candidate <= EEB_CANDIDATE_MAX &&
      check.candidateSet.includes(check.candidate) &&
      Number.isSafeInteger(check.addend) && check.addend >= EEB_ADDITION_ADDEND_MIN && check.addend <= EEB_ADDITION_ADDEND_MAX &&
      Number.isSafeInteger(check.total) && check.total >= 2 && check.total <= EEB_ADDITION_TOTAL_MAX,
    "ARITHMETIC_CHECK_INVALID",
    reference
  );
  const solution = BigInt(check.total) - BigInt(check.addend);
  assert(solution >= BigInt(EEB_CANDIDATE_MIN) && solution <= BigInt(EEB_CANDIDATE_MAX), "ARITHMETIC_CHECK_INVALID", reference);
  const holds = BigInt(check.candidate) + BigInt(check.addend) === BigInt(check.total);
  if (holds) {
    assert(check.candidate === Number(solution), "ARITHMETIC_CHECK_INVALID", reference);
  } else {
    assert(check.candidate !== Number(solution), "ARITHMETIC_CHECK_INVALID", reference);
  }
  return holds ? "true" : "false";
}

function canonicalDirectVariationWholeTableCoefficient(check, reference) {
  assertExactDataKeys(check, [
    "kind", "form", "independentSymbol", "dependentSymbol", "independentValues", "dependentValues", "rate"
  ], "ARITHMETIC_CHECK_INVALID", reference);
  assert(
    check.kind === "direct-variation-whole-table-coefficient" &&
      check.form === "y-equals-rate-times-x" &&
      check.independentSymbol === "x" &&
      check.dependentSymbol === "y" &&
      Number.isSafeInteger(check.rate) && check.rate >= EEC_RATE_MIN && check.rate <= EEC_RATE_MAX,
    "ARITHMETIC_CHECK_INVALID",
    reference
  );
  validateEecTableValues(check.independentValues, check.dependentValues, reference);
  check.independentValues.forEach(function (independentValue, index) {
    const dependentValue = check.dependentValues[index];
    assert(
      BigInt(dependentValue) === BigInt(check.rate) * BigInt(independentValue),
      "ARITHMETIC_CHECK_INVALID",
      reference
    );
  });
  const inferredRates = check.independentValues.slice(1).map(function (independentValue, offset) {
    const dependentValue = check.dependentValues[offset + 1];
    assert(dependentValue % independentValue === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return dependentValue / independentValue;
  });
  assert(inferredRates.length === 2 && inferredRates.every(function (rate) { return rate === check.rate; }), "ARITHMETIC_CHECK_INVALID", reference);
  assert(
    !check.independentValues.includes(check.rate) && !check.dependentValues.includes(check.rate),
    "EEC_TABLE_ANSWER_DISCLOSED",
    reference
  );
  return String(check.rate);
}

function canonicalGgaRightTriangleArea(check, reference) {
  assertExactDataKeys(check, ["kind", "base", "perpendicularHeight"], "ARITHMETIC_CHECK_INVALID", reference);
  assert(
    check.kind === GGA_TRIANGLE_AREA_CHECK_KIND &&
      Number.isSafeInteger(check.base) && check.base >= GGA_BASE_MIN && check.base <= GGA_BASE_MAX &&
      Number.isSafeInteger(check.perpendicularHeight) &&
      check.perpendicularHeight >= GGA_PERPENDICULAR_HEIGHT_MIN && check.perpendicularHeight <= GGA_PERPENDICULAR_HEIGHT_MAX,
    "ARITHMETIC_CHECK_INVALID",
    reference
  );
  const doubledArea = BigInt(check.base) * BigInt(check.perpendicularHeight);
  assert(doubledArea % 2n === 0n, "ARITHMETIC_CHECK_INVALID", reference);
  const area = doubledArea / 2n;
  assert(area >= GGA_TRIANGLE_AREA_MIN && area <= GGA_TRIANGLE_AREA_MAX, "ARITHMETIC_CHECK_INVALID", reference);
  return String(area);
}

function countExactTextOccurrences(value, target) {
  let count = 0;
  let offset = 0;
  while (offset <= value.length - target.length) {
    const index = value.indexOf(target, offset);
    if (index === -1) break;
    count += 1;
    offset = index + target.length;
  }
  return count;
}

function wholeNumberPowerPromptRepresentation(content, check, reference) {
  const value = String(content);
  assert(value === value.normalize("NFKC"), "EEA_POWER_PROMPT_INVALID", reference);
  const notation = `${check.base}^${check.exponent}`;
  const repeatedFactors = Array.from({ length: check.exponent }, function () { return String(check.base); }).join(" × ");
  const notationCount = countExactTextOccurrences(value, notation);
  const repeatedFactorCount = countExactTextOccurrences(value, repeatedFactors);
  const isNotation = notationCount === 1 && repeatedFactorCount === 0;
  const isRepeatedFactor = notationCount === 0 && repeatedFactorCount === 1;
  assert(isNotation || isRepeatedFactor, "EEA_POWER_PROMPT_INVALID", reference);
  const display = isNotation ? notation : repeatedFactors;
  const surroundingText = value.replace(display, "");
  assert(!/[\p{N}^*×]/u.test(surroundingText), "EEA_POWER_PROMPT_INVALID", reference);
  return isNotation ? "power-notation" : "repeated-factor";
}

function validateWholeNumberPowerPrompt(component, check, reference) {
  const representations = Object.entries(component.component.contentByLocale).map(function (entry) {
    const locale = entry[0];
    const content = entry[1];
    const representation = wholeNumberPowerPromptRepresentation(content, check, reference);
    const display = representation === "power-notation"
      ? `${check.base}^${check.exponent}`
      : Array.from({ length: check.exponent }, function () { return String(check.base); }).join(" × ");
    const exactTemplate = Object.freeze({
      ko: representation === "power-notation" ? `다음 식의 값을 구하세요: ${display}.` : `다음 반복곱의 값을 구하세요: ${display}.`,
      en: representation === "power-notation" ? `Find the value of ${display}.` : `Find the value of the repeated product ${display}.`,
      "zh-Hans": representation === "power-notation" ? `求 ${display} 的值。` : `求重复乘积 ${display} 的值。`
    });
    assert(content === exactTemplate[locale], "EEA_POWER_PROMPT_INVALID", reference);
    return representation;
  });
  assert(new Set(representations).size === 1, "EEA_POWER_PROMPT_INVALID", reference);
  return representations[0];
}

function eebCandidateSetDisplay(check) {
  return `{${check.candidateSet.join(", ")}}`;
}

function eebEqualityDisplay(check) {
  return `x + ${check.addend} = ${check.total}`;
}

function koreanObjectParticleForPositiveWhole(value) {
  return [0, 1, 3, 6, 7, 8].includes(value % 10) ? "을" : "를";
}

function normalizeEebChinesePunctuationForSyntax(content) {
  return String(content).replace(/：/gu, ":").replace(/，/gu, ",").replace(/。/gu, ".").replace(/？/gu, "?");
}

function validatePositiveWholeEqualitySubstitutionTruthPrompt(component, check, reference) {
  const candidateSet = eebCandidateSetDisplay(check);
  const equality = eebEqualityDisplay(check);
  const templates = Object.freeze({
    ko: `후보 집합 ${candidateSet}에서 후보 ${check.candidate}${koreanObjectParticleForPositiveWhole(check.candidate)} ${equality}에 대입하세요. 이 등식이 성립하나요?`,
    en: `From the candidate set ${candidateSet}, substitute candidate ${check.candidate} into ${equality}. Does the equality hold?`,
    "zh-Hans": `在候选集合 ${candidateSet} 中，将候选数 ${check.candidate} 代入 ${equality}。这个等式成立吗？`
  });
  Object.entries(component.component.contentByLocale).forEach(function (entry) {
    const locale = entry[0];
    const content = entry[1];
    const syntaxContent = locale === "zh-Hans" ? normalizeEebChinesePunctuationForSyntax(content) : content;
    assert(syntaxContent === syntaxContent.normalize("NFKC"), "EEB_SUBSTITUTION_PROMPT_INVALID", reference);
    assert(content === templates[locale], "EEB_SUBSTITUTION_PROMPT_INVALID", reference);
  });
}

function validateDirectVariationWholeTableCoefficientPrompt(component, check, reference) {
  const relationTable = component.component.relationTable;
  validateEecRelationTable(relationTable, reference);
  ["form", "independentSymbol", "dependentSymbol", "independentValues", "dependentValues"].forEach(function (field) {
    assert(JSON.stringify(relationTable[field]) === JSON.stringify(check[field]), "EEC_RELATION_TABLE_MISMATCH", reference);
  });
  const templates = Object.freeze({
    ko: "표는 독립변수 x와 종속변수 y의 직접비례 관계를 나타냅니다. 방정식 y = □ × x의 계수를 구하세요.",
    en: "The table shows a direct-variation relationship with x as the independent variable and y as the dependent variable. Find the coefficient in y = □ × x.",
    "zh-Hans": "表格表示 x 为自变量、y 为因变量的正比例关系。求方程 y = □ × x 中的系数。"
  });
  Object.entries(component.component.contentByLocale).forEach(function (entry) {
    const locale = entry[0];
    assert(entry[1] === templates[locale], "EEC_TABLE_PROMPT_INVALID", reference);
  });
}

function validateGgaRightTriangleAreaPrompt(component, check, reference) {
  const diagram = component.component.geometryDiagram;
  validateGgaGeometryDiagram(diagram, reference);
  assert(
    diagram.base === check.base && diagram.perpendicularHeight === check.perpendicularHeight,
    "GGA_GEOMETRY_DIAGRAM_MISMATCH",
    reference
  );
  const templates = Object.freeze({
    ko: "그림의 직각삼각형에서 밑변과 그에 수직인 높이가 표시되어 있습니다. 넓이를 제곱단위로 구하세요.",
    en: "The diagram shows a right triangle with its base and perpendicular height labeled. Find its area in square units.",
    "zh-Hans": "图中直角三角形的底和与底垂直的高已标出。求它的面积（平方单位）。"
  });
  Object.entries(component.component.contentByLocale).forEach(function (entry) {
    const locale = entry[0];
    assert(entry[1] === templates[locale], "GGA_TRIANGLE_AREA_PROMPT_INVALID", reference);
  });
}

function canonicalAnswer(check, reference) {
  assertRecord(check, "ARITHMETIC_CHECK_INVALID", reference);
  const kind = ownDataValue(check, "kind", "ARITHMETIC_CHECK_INVALID", reference);
  if (kind === "ratio-canonical") {
    assertExactDataKeys(check, ["kind", "left", "right"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.left) && positiveInteger(check.right), "ARITHMETIC_CHECK_INVALID", reference);
    const divisor = greatestCommonDivisor(check.left, check.right);
    return `${check.left / divisor}:${check.right / divisor}`;
  }
  if (kind === "whole-quotient") {
    assertExactDataKeys(check, ["kind", "total", "groups"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.total) && positiveInteger(check.groups) && check.total % check.groups === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String(check.total / check.groups);
  }
  if (kind === "whole-product") {
    assertExactDataKeys(check, ["kind", "perGroup", "groups"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.perGroup) && positiveInteger(check.groups) && check.perGroup * check.groups <= 1000000000, "ARITHMETIC_CHECK_INVALID", reference);
    return String(check.perGroup * check.groups);
  }
  if (kind === "whole-number-power") return canonicalWholeNumberPower(check, reference);
  if (kind === "positive-whole-equality-substitution-truth") return canonicalPositiveWholeEqualitySubstitutionTruth(check, reference);
  if (kind === "direct-variation-whole-table-coefficient") return canonicalDirectVariationWholeTableCoefficient(check, reference);
  if (kind === GGA_TRIANGLE_AREA_CHECK_KIND) return canonicalGgaRightTriangleArea(check, reference);
  if (kind === "whole-percent") {
    assertExactDataKeys(check, ["kind", "part", "whole"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.part) && positiveInteger(check.whole) && check.part <= check.whole && (100 * check.part) % check.whole === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String((100 * check.part) / check.whole);
  }
  if (kind === "percent-of-whole") {
    assertExactDataKeys(check, ["kind", "whole", "percent"], "ARITHMETIC_CHECK_INVALID", reference);
    assert(positiveInteger(check.whole) && positiveInteger(check.percent) && check.percent <= 100 && (check.whole * check.percent) % 100 === 0, "ARITHMETIC_CHECK_INVALID", reference);
    return String((check.whole * check.percent) / 100);
  }
  if (kind === "rational-quotient") {
    assertExactDataKeys(check, [
      "kind", "dividendNumerator", "dividendDenominator", "divisorNumerator", "divisorDenominator"
    ], "ARITHMETIC_CHECK_INVALID", reference);
    assert(
      nonNegativeInteger(check.dividendNumerator) && positiveInteger(check.dividendDenominator) &&
      positiveInteger(check.divisorNumerator) && positiveInteger(check.divisorDenominator),
      "ARITHMETIC_CHECK_INVALID", reference
    );
    return canonicalRational(
      BigInt(check.dividendNumerator) * BigInt(check.divisorDenominator),
      BigInt(check.dividendDenominator) * BigInt(check.divisorNumerator),
      reference
    );
  }
  if (kind === "signed-rational-operation") return canonicalSignedRationalOperation(check, reference);
  if (kind === "signed-rational-comparison") return canonicalSignedRationalComparison(check, reference);
  if (kind === "quadrant-classification") return canonicalQuadrantClassification(check, reference);
  if (kind === "decimal-operation") return canonicalDecimalOperation(check, reference);
  if (kind === "greatest-common-factor") return canonicalWholeGcf(check, reference);
  if (kind === "least-common-multiple") return canonicalWholeLcm(check, reference);
  fail("ARITHMETIC_CHECK_INVALID", reference);
}

function validateNscAutomaticEvidence(answerReferences, unit, reference) {
  if (unit.unitId !== "ccss-6-ns-c") return;
  const quadrantResponses = new Set(answerReferences.filter(function (answerReference) {
    return answerReference.arithmeticCheck.kind === "quadrant-classification";
  }).map(function (answerReference) { return answerReference.expectedResponse; }));
  assert(["1", "2", "3", "4"].every(function (quadrant) { return quadrantResponses.has(quadrant); }), "NSC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.some(function (answerReference) {
    return answerReference.arithmeticCheck.kind === "signed-rational-comparison" && answerReference.arithmeticCheck.basis === "signed-value";
  }), "NSC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.some(function (answerReference) {
    return answerReference.arithmeticCheck.kind === "signed-rational-operation" && answerReference.arithmeticCheck.operation === "axis-distance";
  }), "NSC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
}

function validateEebAutomaticEvidence(answerReferences, componentMap, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-b") return;
  assert(answerReferences.length === 22, "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "truth-value-exact" && answerReference.arithmeticCheck.kind === "positive-whole-equality-substitution-truth";
  }), "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  const fingerprints = new Set();
  const equationFingerprints = new Set();
  const truthCounts = new Map();
  const candidatePositionCounts = [0, 0, 0];
  const addendBandCounts = [0, 0, 0];
  answerReferences.forEach(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    const fingerprint = `${check.candidateSet.join(",")}|${check.candidate}|${check.addend}|${check.total}`;
    assert(!fingerprints.has(fingerprint), "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    fingerprints.add(fingerprint);
    const equationFingerprint = eebEqualityFactFingerprint(check);
    assert(!equationFingerprints.has(equationFingerprint), "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    equationFingerprints.add(equationFingerprint);
    const expected = canonicalPositiveWholeEqualitySubstitutionTruth(check, answerReference.referenceId);
    truthCounts.set(expected, (truthCounts.get(expected) || 0) + 1);
    const candidatePosition = check.candidateSet.indexOf(check.candidate);
    assert(candidatePosition >= 0, "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    candidatePositionCounts[candidatePosition] += 1;
    if (check.addend <= 6) addendBandCounts[0] += 1;
    else if (check.addend <= 13) addendBandCounts[1] += 1;
    else addendBandCounts[2] += 1;
    const component = componentMap.get(answerReference.componentId);
    assert(component, "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    validatePositiveWholeEqualitySubstitutionTruthPrompt(component, check, answerReference.referenceId);
  });
  assert(truthCounts.get("true") === 11 && truthCounts.get("false") === 11, "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(Math.max(...candidatePositionCounts) - Math.min(...candidatePositionCounts) <= 1, "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(addendBandCounts.every(function (count) { return count >= 4; }), "EEB_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
}

function validateEeaAutomaticEvidence(answerReferences, componentMap, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-a") return;
  assert(answerReferences.length > 0, "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === "whole-number-power";
  }), "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  const exponentCounts = new Map();
  const notationCounts = new Map();
  const fingerprints = new Set();
  const representations = new Set();
  answerReferences.forEach(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    const fingerprint = `${check.base}^${check.exponent}`;
    assert(!fingerprints.has(fingerprint), "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    fingerprints.add(fingerprint);
    exponentCounts.set(check.exponent, (exponentCounts.get(check.exponent) || 0) + 1);
    const component = componentMap.get(answerReference.componentId);
    assert(component, "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    const representation = validateWholeNumberPowerPrompt(component, check, answerReference.referenceId);
    representations.add(representation);
    if (representation === "power-notation") notationCounts.set(check.exponent, (notationCounts.get(check.exponent) || 0) + 1);
  });
  for (let exponent = EEA_POWER_EXPONENT_MIN; exponent <= EEA_POWER_EXPONENT_MAX; exponent += 1) {
    assert((exponentCounts.get(exponent) || 0) >= 2, "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    assert((notationCounts.get(exponent) || 0) >= 1, "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  }
  [
    function (base) { return base >= 2 && base <= 4; },
    function (base) { return base >= 5 && base <= 8; },
    function (base) { return base >= 9 && base <= 12; }
  ].forEach(function (inBand) {
    assert(answerReferences.some(function (answerReference) { return inBand(answerReference.arithmeticCheck.base); }), "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  });
  assert(representations.has("power-notation") && representations.has("repeated-factor"), "EEA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
}

function validateEecAutomaticEvidence(answerReferences, componentMap, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-c") return;
  assert(answerReferences.length === 22, "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === "direct-variation-whole-table-coefficient";
  }), "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  const fingerprints = new Set();
  const rateCounts = new Map();
  answerReferences.forEach(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    const fingerprint = `${check.rate}|${check.independentValues.join(",")}|${check.dependentValues.join(",")}`;
    assert(!fingerprints.has(fingerprint), "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
    fingerprints.add(fingerprint);
    const expected = canonicalDirectVariationWholeTableCoefficient(check, answerReference.referenceId);
    assert(answerReference.expectedResponse === expected, "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    rateCounts.set(check.rate, (rateCounts.get(check.rate) || 0) + 1);
    const component = componentMap.get(answerReference.componentId);
    assert(component, "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    validateDirectVariationWholeTableCoefficientPrompt(component, check, answerReference.referenceId);
  });
  for (let rate = EEC_RATE_MIN; rate <= EEC_RATE_MAX; rate += 1) {
    assert(rateCounts.get(rate) === 2, "EEC_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  }
}

function validateGgaAutomaticEvidence(answerReferences, componentMap, unit, reference) {
  if (unit.unitId !== "ccss-6-g-a") return;
  assert(answerReferences.length === 22, "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === GGA_TRIANGLE_AREA_CHECK_KIND;
  }), "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", reference);
  const fingerprints = new Set();
  const expectedResponses = new Set();
  const inputValues = new Set();
  const bases = new Set();
  const perpendicularHeights = new Set();
  let automaticEvidenceCount = 0;
  let teacherReviewOnlyCount = 0;
  let hasSquareTriangle = false;
  let hasNonSquareTriangle = false;
  answerReferences.forEach(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    const fingerprint = `${check.base}|${check.perpendicularHeight}`;
    assert(!fingerprints.has(fingerprint), "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    fingerprints.add(fingerprint);
    const expected = canonicalGgaRightTriangleArea(check, answerReference.referenceId);
    assert(answerReference.expectedResponse === expected, "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    assert(!expectedResponses.has(expected), "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    expectedResponses.add(expected);
    inputValues.add(String(check.base));
    inputValues.add(String(check.perpendicularHeight));
    bases.add(check.base);
    perpendicularHeights.add(check.perpendicularHeight);
    hasSquareTriangle = hasSquareTriangle || check.base === check.perpendicularHeight;
    hasNonSquareTriangle = hasNonSquareTriangle || check.base !== check.perpendicularHeight;
    const component = componentMap.get(answerReference.componentId);
    assert(component, "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE", answerReference.referenceId);
    validateGgaRightTriangleAreaPrompt(component, check, answerReference.referenceId);
    const expectedEvaluationMode = component.section.resourceBinding.levelId === "advanced"
      ? "teacher-review-only"
      : "automatic-evidence";
    assert(answerReference.evaluationMode === expectedEvaluationMode, "GGA_DIFFICULTY_CONTRACT_INCOMPLETE", answerReference.referenceId);
    if (expectedEvaluationMode === "automatic-evidence") automaticEvidenceCount += 1;
    else teacherReviewOnlyCount += 1;
  });
  expectedResponses.forEach(function (expectedResponse) {
    assert(!inputValues.has(expectedResponse), "GGA_TRIANGLE_ANSWER_DISCLOSED", reference);
  });
  assert(
    bases.size >= 7 && perpendicularHeights.size >= 6 && hasSquareTriangle && hasNonSquareTriangle,
    "GGA_AUTOMATIC_EVIDENCE_INCOMPLETE",
    reference
  );
  assert(
    automaticEvidenceCount === 14 && teacherReviewOnlyCount === 8,
    "GGA_DIFFICULTY_CONTRACT_INCOMPLETE",
    reference
  );
}

function escapeRegExpLiteral(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function validateEeaWorkedExampleContent(content, locale, reference) {
  const value = String(content);
  // Chinese prose conventionally uses a full-width colon after 示例. Preserve
  // that single required locale mark while keeping the mathematical display
  // itself NFKC-stable (therefore plain ASCII digits, caret, and × only).
  const normalizedForTemplate = locale === "zh-Hans" ? value.replace(/^示例：/u, "示例:") : value;
  assert((locale !== "zh-Hans" || value.startsWith("示例：")) && normalizedForTemplate === normalizedForTemplate.normalize("NFKC"), "EEA_WORKED_EXAMPLE_INVALID", reference);
  const template = Object.freeze({
    ko: Object.freeze({ prefix: "예시: ", suffix: "." }),
    en: Object.freeze({ prefix: "Worked example: ", suffix: "." }),
    "zh-Hans": Object.freeze({ prefix: "示例:", suffix: "。" })
  })[locale];
  assert(template, "EEA_WORKED_EXAMPLE_INVALID", reference);
  const matcher = new RegExp(`^${escapeRegExpLiteral(template.prefix)}([0-9]+)\\^([0-9]+) = ([0-9]+(?: × [0-9]+)*) = ([0-9]+)${escapeRegExpLiteral(template.suffix)}$`, "u");
  const match = matcher.exec(normalizedForTemplate);
  assert(match, "EEA_WORKED_EXAMPLE_INVALID", reference);
  const base = Number(match[1]);
  const exponent = Number(match[2]);
  assert(
    Number.isSafeInteger(base) && base >= EEA_WORKED_EXAMPLE_BASE_MIN && base <= EEA_WORKED_EXAMPLE_BASE_MAX &&
      Number.isSafeInteger(exponent) && exponent >= EEA_POWER_EXPONENT_MIN && exponent <= EEA_POWER_EXPONENT_MAX,
    "EEA_WORKED_EXAMPLE_INVALID",
    reference
  );
  const factors = Array.from({ length: exponent }, function () { return String(base); }).join(" × ");
  const result = BigInt(base) ** BigInt(exponent);
  assert(result <= EEA_WORKED_EXAMPLE_RESULT_MAX && match[3] === factors && match[4] === String(result), "EEA_WORKED_EXAMPLE_INVALID", reference);
  return Object.freeze({ base, exponent, result: String(result) });
}

function assertEeaNonWorkedStudentTextHasNoNumericNotation(content, reference) {
  const normalized = String(content).normalize("NFKC");
  // EE.A v1 reserves numeric notation for a narrowly parsed worked example
  // or an exact response prompt. Keeping every other student-visible field
  // number-free closes alternate decimal, scientific, grouped, and Roman
  // numeral encodings before they can become an answer-disclosure channel.
  // Roman answer tokens are checked against the same-pack response set below,
  // rather than banning ordinary English one-letter pronouns such as I.
  assert(!/[\p{N}]/u.test(normalized), "EEA_NONRESPONSE_NUMERIC_NOT_ALLOWED", reference);
}

function validateEeaStudentVisibleSeparation(pack, sections, answerReferences, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-a") return;
  const expectedResponses = new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; }));
  const nonResponseFields = [];
  [pack.frontMatter.titleByLocale, pack.frontMatter.learningTargetsByLocale, pack.frontMatter.howToUseByLocale,
    pack.closingMatter.glossaryByLocale, pack.closingMatter.retentionNoticeByLocale].forEach(function (localizedText) {
    Object.entries(localizedText).forEach(function (entry) {
      assertEeaNonWorkedStudentTextHasNoNumericNotation(entry[1], reference);
      nonResponseFields.push(Object.freeze({ content: entry[1], reference }));
    });
  });
  sections.forEach(function (entry) {
    Object.entries(entry.section.titleByLocale).forEach(function (localeEntry) {
      assertEeaNonWorkedStudentTextHasNoNumericNotation(localeEntry[1], entry.section.sectionId);
      nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: entry.section.sectionId }));
    });
    entry.section.components.filter(function (component) { return component.responseMode === null; }).forEach(function (component) {
      const workedExampleFacts = component.componentType === "worked-example"
        ? Object.entries(component.contentByLocale).map(function (localeEntry) {
          return validateEeaWorkedExampleContent(localeEntry[1], localeEntry[0], component.componentId);
        })
        : null;
      if (workedExampleFacts) {
        assert(new Set(workedExampleFacts.map(function (fact) { return JSON.stringify(fact); })).size === 1, "EEA_WORKED_EXAMPLE_INVALID", component.componentId);
        assert(!expectedResponses.has(workedExampleFacts[0].result), "EEA_WORKED_EXAMPLE_ANSWER_LEAK", component.componentId);
      }
      Object.entries(component.contentByLocale).forEach(function (localeEntry) {
        if (component.componentType !== "worked-example") assertEeaNonWorkedStudentTextHasNoNumericNotation(localeEntry[1], component.componentId);
        nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: component.componentId }));
      });
    });
  });
  nonResponseFields.forEach(function (field) {
    const normalizedContent = normalizeForAnswerLeakScan(field.content);
    expectedResponses.forEach(function (expectedResponse) {
      assert(!containsStandaloneExpectedResponse(normalizedContent, normalizeForAnswerLeakScan(expectedResponse)), "EEA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
      assert(!containsEeaNumericEquivalentAnswer(field.content, expectedResponse), "EEA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
      assert(!containsEeaRomanAnswerToken(field.content, expectedResponse), "EEA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
      assert(!containsEeaLocalizedAnswerWord(field.content, expectedResponse), "EEA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
    });
  });
}

function containsEebTruthResponseLabel(content) {
  const normalized = String(content).normalize("NFKC");
  // The exact static-template allowlist below controls every non-worked
  // student field in EE.B v1. This helper is intentionally narrower: it
  // catches explicit answer labels without treating ordinary Chinese copulas
  // or ordinary instructional prose as an answer disclosure.
  return /\b(?:true|false|t|f)\b/iu.test(normalized) ||
    /(?:참|거짓|真|假|⊤|⊥|✓|✔|✗|✘|○|×)/u.test(normalized);
}

function containsEebSpelledPositiveWhole(content) {
  const normalized = String(content).normalize("NFKC");
  if (/\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|hundred|thousand|dozen|score)\b/iu.test(normalized)) return true;
  if (/(?:하나|둘|셋|넷|다섯|여섯|일곱|여덟|아홉|열|스물|서른|마흔)/u.test(normalized)) return true;
  if (/(^|[^\p{Script=Hangul}])(?:한|두|세|네)(?![\p{Script=Hangul}])/u.test(normalized)) return true;
  if (/[〇零一二三四五六七八九十百千万萬亿億两兩壹贰貳叁參肆伍陆陸柒捌玖拾佰仟]/u.test(normalized)) return true;
  for (let value = EEB_CANDIDATE_MIN; value <= EEB_ADDITION_TOTAL_MAX; value += 1) {
    if (containsEeaRomanAnswerToken(normalized, String(value))) return true;
  }
  for (let value = EEB_CANDIDATE_MIN; value <= EEB_ADDITION_TOTAL_MAX; value += 1) {
    const forms = eeaNumberWordForms(String(value));
    if (
      forms.english.some(function (word) { return containsEeaEnglishNumberWord(normalized, word); }) ||
      forms.korean.some(function (word) { return containsEeaKoreanNumberWord(normalized, word); }) ||
      forms.koreanNative.some(function (word) { return containsEeaKoreanNumberWord(normalized, word); }) ||
      forms.koreanBound.some(function (word) { return containsEeaKoreanNumberWord(normalized, word); }) ||
      forms.chinese.some(function (word) { return containsEeaChineseNumberWord(normalized, word); })
    ) return true;
  }
  return false;
}

function assertEebNonWorkedStudentTextHasNoNumericOrTruthResponse(content, reference) {
  const normalized = String(content).normalize("NFKC");
  // EE.B v1 needs no non-response mathematical display. Reject every TeX
  // escape rather than trying to reconstruct presentation-only wrappers;
  // otherwise a truth token can be visually split across safe TeX fragments.
  assert(!normalized.includes("\\"), "EEB_NONRESPONSE_TEX_NOT_ALLOWED", reference);
  assert(!/[\p{N}]/u.test(normalized), "EEB_NONRESPONSE_NUMERIC_NOT_ALLOWED", reference);
  assert(/^[A-Za-z\p{Script=Hangul}\p{Script=Han}\s.,;:!?"'“”‘’()\-—–，。！？、】【、]*$/u.test(normalized), "EEB_NONRESPONSE_SCRIPT_NOT_ALLOWED", reference);
  assert(!containsEebSpelledPositiveWhole(normalized), "EEB_NONRESPONSE_NUMBER_WORD_NOT_ALLOWED", reference);
  assert(!containsEebTruthResponseLabel(normalized), "EEB_NONRESPONSE_TRUTH_LABEL_NOT_ALLOWED", reference);
}

function validateEebWorkedExampleContent(content, locale, reference) {
  const value = String(content);
  // Chinese prose conventionally uses a full-width colon after 示例. Keep that
  // single locale mark while requiring every mathematical character to remain
  // in the raw ASCII display that the parser validates below.
  const normalizedForTemplate = locale === "zh-Hans" ? normalizeEebChinesePunctuationForSyntax(value) : value;
  assert((locale !== "zh-Hans" || value.startsWith("示例：")) && normalizedForTemplate === normalizedForTemplate.normalize("NFKC"), "EEB_WORKED_EXAMPLE_INVALID", reference);
  const matchers = Object.freeze({
    ko: /^예시: x = ([0-9]+)(?:을|를) x \+ ([0-9]+) = ([0-9]+)에 대입하면 ([0-9]+) \+ ([0-9]+) = ([0-9]+)이므로 등식이 성립한다\.$/u,
    en: /^Worked example: Substitute x = ([0-9]+) into x \+ ([0-9]+) = ([0-9]+)\. Since ([0-9]+) \+ ([0-9]+) = ([0-9]+), the equality holds\.$/u,
    "zh-Hans": /^示例:将 x = ([0-9]+) 代入 x \+ ([0-9]+) = ([0-9]+)\.因为 ([0-9]+) \+ ([0-9]+) = ([0-9]+),所以等式成立\.$/u
  });
  const matcher = matchers[locale];
  assert(matcher, "EEB_WORKED_EXAMPLE_INVALID", reference);
  const match = matcher.exec(normalizedForTemplate);
  assert(match, "EEB_WORKED_EXAMPLE_INVALID", reference);
  const values = match.slice(1).map(function (value) { return Number(value); });
  const [candidate, addend, total, substitutedCandidate, substitutedAddend, substitutedTotal] = values;
  const exactTemplate = Object.freeze({
    ko: `예시: x = ${candidate}${koreanObjectParticleForPositiveWhole(candidate)} x + ${addend} = ${total}에 대입하면 ${candidate} + ${addend} = ${total}이므로 등식이 성립한다.`,
    en: `Worked example: Substitute x = ${candidate} into x + ${addend} = ${total}. Since ${candidate} + ${addend} = ${total}, the equality holds.`,
    "zh-Hans": `示例：将 x = ${candidate} 代入 x + ${addend} = ${total}。因为 ${candidate} + ${addend} = ${total}，所以等式成立。`
  })[locale];
  assert(value === exactTemplate, "EEB_WORKED_EXAMPLE_INVALID", reference);
  assert(
    values.every(function (value) { return Number.isSafeInteger(value); }) &&
      candidate >= EEB_CANDIDATE_MIN && candidate <= EEB_CANDIDATE_MAX &&
      addend >= EEB_ADDITION_ADDEND_MIN && addend <= EEB_ADDITION_ADDEND_MAX &&
      total >= 2 && total <= EEB_ADDITION_TOTAL_MAX &&
      candidate === substitutedCandidate && addend === substitutedAddend && total === substitutedTotal &&
      BigInt(candidate) + BigInt(addend) === BigInt(total),
    "EEB_WORKED_EXAMPLE_INVALID",
    reference
  );
  return Object.freeze({ candidate, addend, total });
}

function eebSubstitutionFactFingerprint(fact) {
  return `${fact.candidate}|${fact.addend}|${fact.total}`;
}

function eebEqualityFactFingerprint(fact) {
  return `${fact.addend}|${fact.total}`;
}

function eebStudentResourceProfile(resource) {
  return `${resource.sessionId}:${resource.resourceType}:${resource.levelId}`;
}

function assertEebExactLocalizedStudentText(localizedText, expectedTextByLocale, reference) {
  assert(expectedTextByLocale, "EEB_NONRESPONSE_TEMPLATE_INVALID", reference);
  const actualLocales = Object.keys(localizedText).sort();
  const expectedLocales = Object.keys(expectedTextByLocale).sort();
  assert(JSON.stringify(actualLocales) === JSON.stringify(expectedLocales), "EEB_NONRESPONSE_TEMPLATE_INVALID", reference);
  expectedLocales.forEach(function (locale) {
    assert(localizedText[locale] === expectedTextByLocale[locale], "EEB_NONRESPONSE_TEMPLATE_INVALID", reference);
    assertEebNonWorkedStudentTextHasNoNumericOrTruthResponse(localizedText[locale], reference);
  });
}

function validateEebStudentVisibleSeparation(pack, sections, answerReferences, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-b") return;
  const responseEquationFacts = new Set(answerReferences.map(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    return eebEqualityFactFingerprint(check);
  }));
  const expectedResponses = new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; }));
  const nonResponseFields = [];
  [
    [pack.frontMatter, EEB_STUDENT_STATIC_TEXT.frontMatter],
    [pack.closingMatter, EEB_STUDENT_STATIC_TEXT.closingMatter]
  ].forEach(function (entry) {
    Object.keys(entry[1]).forEach(function (field) {
      assertEebExactLocalizedStudentText(entry[0][field], entry[1][field], reference);
      Object.entries(entry[0][field]).forEach(function (localeEntry) {
        nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference }));
      });
    });
  });
  sections.forEach(function (entry) {
    const resourceProfile = eebStudentResourceProfile(entry.resource);
    assertEebExactLocalizedStudentText(
      entry.section.titleByLocale,
      EEB_STUDENT_STATIC_TEXT.sectionTitlesByProfile[resourceProfile],
      entry.section.sectionId
    );
    Object.entries(entry.section.titleByLocale).forEach(function (localeEntry) {
      nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: entry.section.sectionId }));
    });
    entry.section.components.filter(function (component) { return component.responseMode === null; }).forEach(function (component) {
      const workedExampleFacts = component.componentType === "worked-example"
        ? Object.entries(component.contentByLocale).map(function (localeEntry) {
          return validateEebWorkedExampleContent(localeEntry[1], localeEntry[0], component.componentId);
        })
        : null;
      if (workedExampleFacts) {
        assert(new Set(workedExampleFacts.map(function (fact) { return JSON.stringify(fact); })).size === 1, "EEB_WORKED_EXAMPLE_INVALID", component.componentId);
        assert(!responseEquationFacts.has(eebEqualityFactFingerprint(workedExampleFacts[0])), "EEB_WORKED_EXAMPLE_FACT_LEAK", component.componentId);
      } else {
        assert(component.componentType === "concept-summary", "EEB_NONRESPONSE_TEMPLATE_INVALID", component.componentId);
        assertEebExactLocalizedStudentText(
          component.contentByLocale,
          EEB_STUDENT_STATIC_TEXT.conceptSummaryByProfile[resourceProfile],
          component.componentId
        );
      }
      Object.entries(component.contentByLocale).forEach(function (localeEntry) {
        nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: component.componentId }));
      });
    });
  });
  nonResponseFields.forEach(function (field) {
    const normalizedContent = normalizeForAnswerLeakScan(field.content);
    expectedResponses.forEach(function (expectedResponse) {
      assert(!containsStandaloneExpectedResponse(normalizedContent, normalizeForAnswerLeakScan(expectedResponse)), "EEB_CROSS_STUDENT_ANSWER_LEAK", field.reference);
    });
  });
}

function containsEecSupplementalLocalizedAnswerWord(content, expectedResponse) {
  const normalized = String(content).normalize("NFKC");
  const response = String(expectedResponse);
  // Korean bound-cardinal forms are normally parsed only beside ordinary
  // counting counters. EE.C prose can name variables, values, or a
  // coefficient directly, so include those mathematical nouns here. Avoid
  // the ambiguous Sino-Korean one-character forms (for example, "이 변수"
  // can mean "this variable") and accept only the unambiguous native forms.
  const koreanBoundForms = Object.freeze({
    "2": Object.freeze(["두", "둘"]),
    "3": Object.freeze(["세", "셋"]),
    "4": Object.freeze(["네", "넷"])
  })[response] || Object.freeze([]);
  if (koreanBoundForms.some(function (word) {
    return new RegExp(`(^|[^\\p{Script=Hangul}])${escapeRegExpLiteral(word)}\\s*(?:변수|값|계수|배|곱|항|칸|줄|행|열)(?:의|은|는|이|가|을|를|와|과|도|만|이다|입니다)?(?![\\p{Script=Hangul}])`, "u").test(normalized);
  })) return true;

  // Standard Chinese renders two as 二, while instructional text often uses
  // 两/兩 before a classifier. Financial forms are also visually meaningful
  // to a reader. They must not become an alternate coefficient channel.
  const chineseAlternateMatcher = Object.freeze({
    "2": /[两兩贰貳]/u,
    "3": /[叁參]/u,
    "4": /肆/u,
    "5": /伍/u,
    "6": /陆/u,
    "7": /柒/u,
    "8": /捌/u,
    "9": /玖/u,
    "10": /拾/u,
    "11": /(?:拾壹|壹拾壹)/u,
    "12": /(?:拾贰|拾貳|壹拾贰|壹拾貳)/u
  })[response];
  return !!chineseAlternateMatcher && chineseAlternateMatcher.test(normalized);
}

function containsEecLocalizedAnswerEquivalent(content, expectedResponse) {
  return containsEeaNumericEquivalentAnswer(content, expectedResponse) ||
    containsEeaRomanAnswerToken(content, expectedResponse) ||
    containsEeaLocalizedAnswerWord(content, expectedResponse) ||
    containsEecSupplementalLocalizedAnswerWord(content, expectedResponse);
}

function validateEecStudentVisibleSeparation(pack, sections, answerReferences, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-c") return;
  const expectedResponses = new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; }));
  const nonResponseFields = [];
  [
    ["front-matter", pack.frontMatter],
    ["closing-matter", pack.closingMatter]
  ].forEach(function (groupEntry) {
    Object.entries(groupEntry[1]).forEach(function (fieldEntry) {
      const fieldName = fieldEntry[0];
      const localizedText = fieldEntry[1];
      Object.entries(localizedText).forEach(function (entry) {
        nonResponseFields.push(Object.freeze({
          content: entry[1],
          reference: `${reference}:${groupEntry[0]}:${fieldName}:${entry[0]}`
        }));
      });
    });
  });
  sections.forEach(function (entry) {
    Object.entries(entry.section.titleByLocale).forEach(function (localeEntry) {
      nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: entry.section.sectionId }));
    });
    entry.section.components.filter(function (component) { return component.responseMode === null; }).forEach(function (component) {
      Object.entries(component.contentByLocale).forEach(function (localeEntry) {
        nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: component.componentId }));
      });
    });
  });
  nonResponseFields.forEach(function (field) {
    const normalizedContent = normalizeForAnswerLeakScan(field.content);
    expectedResponses.forEach(function (expectedResponse) {
      assert(!containsStandaloneExpectedResponse(normalizedContent, normalizeForAnswerLeakScan(expectedResponse)), "EEC_CROSS_STUDENT_ANSWER_LEAK", field.reference);
      // EE.C's answer set is deliberately a small whole-number coefficient
      // band. A digit-only scan would let the same coefficient be disclosed
      // as a localized word or Roman numeral in a student-facing teaching
      // block. Reuse the established cross-locale equivalent checks so
      // authoring text cannot state an answer in a different notation.
      assert(!containsEecLocalizedAnswerEquivalent(field.content, expectedResponse), "EEC_CROSS_STUDENT_ANSWER_LEAK", field.reference);
    });
  });
}

function validateGgaStudentVisibleSeparation(pack, sections, answerReferences, unit, reference) {
  if (unit.unitId !== "ccss-6-g-a") return;
  const expectedResponses = new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; }));
  const nonResponseFields = [];
  [
    ["front-matter", pack.frontMatter],
    ["closing-matter", pack.closingMatter]
  ].forEach(function (groupEntry) {
    Object.entries(groupEntry[1]).forEach(function (fieldEntry) {
      Object.entries(fieldEntry[1]).forEach(function (entry) {
        nonResponseFields.push(Object.freeze({
          content: entry[1],
          reference: `${reference}:${groupEntry[0]}:${fieldEntry[0]}:${entry[0]}`
        }));
      });
    });
  });
  sections.forEach(function (entry) {
    Object.entries(entry.section.titleByLocale).forEach(function (localeEntry) {
      nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: entry.section.sectionId }));
    });
    entry.section.components.filter(function (component) { return component.responseMode === null; }).forEach(function (component) {
      Object.entries(component.contentByLocale).forEach(function (localeEntry) {
        nonResponseFields.push(Object.freeze({ content: localeEntry[1], reference: component.componentId }));
      });
    });
  });
  nonResponseFields.forEach(function (field) {
    const normalizedContent = normalizeForAnswerLeakScan(field.content);
    expectedResponses.forEach(function (expectedResponse) {
      assert(!containsStandaloneExpectedResponse(normalizedContent, normalizeForAnswerLeakScan(expectedResponse)), "GGA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
      assert(!containsEeaLocalizedAnswerWord(field.content, expectedResponse), "GGA_CROSS_STUDENT_ANSWER_LEAK", field.reference);
    });
  });
}

function validateAnswerReference(answerReference, componentMap, policy, artifact, seenReferenceIds) {
  const reference = localReference(answerReference && answerReference.referenceId, artifact.artifactId);
  assertOnlyKeys(answerReference, REFERENCE_KEYS, "ANSWER_REFERENCE_INVALID", reference);
  assertId(answerReference.referenceId, "ref-dft-", "ANSWER_REFERENCE_INVALID", reference);
  assert(!seenReferenceIds.has(answerReference.referenceId), "DUPLICATE_ANSWER_REFERENCE", reference);
  seenReferenceIds.add(answerReference.referenceId);
  const component = componentMap.get(answerReference.componentId);
  assert(component, "ANSWER_REFERENCE_COMPONENT_UNKNOWN", reference);
  assert(component.component.responseMode === answerReference.responseMode, "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  assert(component.section.resourceBinding.sessionId === artifact.resourceBinding.sessionId, "ANSWER_REFERENCE_SESSION_MISMATCH", reference);
  assert(RESPONSE_MODES.has(answerReference.responseMode), "ANSWER_REFERENCE_INVALID", reference);
  assert(nonBlankText(answerReference.expectedResponse), "ANSWER_REFERENCE_INVALID", reference);
  requireLocales(answerReference.solutionByLocale, policy, "ANSWER_REFERENCE_INVALID", reference);
  requireLocales(answerReference.uniquenessProofByLocale, policy, "ANSWER_REFERENCE_INVALID", reference);
  if (artifact.resourceBinding.unitId === "ccss-6-g-a") {
    assert(GGA_EVALUATION_MODES.has(answerReference.evaluationMode), "GGA_RESPONSE_CONTRACT_INVALID", reference);
  } else {
    assert(answerReference.evaluationMode === undefined, "ANSWER_REFERENCE_INVALID", reference);
  }
  const expected = canonicalAnswer(answerReference.arithmeticCheck, reference);
  assert(answerReference.expectedResponse === expected, "ANSWER_REFERENCE_CALCULATION_MISMATCH", reference);
  if (answerReference.responseMode === "ratio-canonical") assert(answerReference.arithmeticCheck.kind === "ratio-canonical", "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (answerReference.responseMode === "comparison-symbol-exact") assert(answerReference.arithmeticCheck.kind === "signed-rational-comparison", "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (answerReference.responseMode === "numeric-exact") assert(!["ratio-canonical", "signed-rational-comparison"].includes(answerReference.arithmeticCheck.kind), "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (answerReference.responseMode === "truth-value-exact") assert(answerReference.arithmeticCheck.kind === "positive-whole-equality-substitution-truth", "ANSWER_REFERENCE_MODE_MISMATCH", reference);
  if (artifact.resourceBinding.unitId === "ccss-6-ee-a") {
    assert(answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === "whole-number-power", "EEA_RESPONSE_CONTRACT_INVALID", reference);
  }
  if (artifact.resourceBinding.unitId === "ccss-6-ee-b") {
    assert(answerReference.responseMode === "truth-value-exact" && answerReference.arithmeticCheck.kind === "positive-whole-equality-substitution-truth", "EEB_RESPONSE_CONTRACT_INVALID", reference);
  }
  if (artifact.resourceBinding.unitId === "ccss-6-ee-c") {
    assert(answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === "direct-variation-whole-table-coefficient", "EEC_RESPONSE_CONTRACT_INVALID", reference);
  }
  if (artifact.resourceBinding.unitId === "ccss-6-g-a") {
    assert(answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === GGA_TRIANGLE_AREA_CHECK_KIND, "GGA_RESPONSE_CONTRACT_INVALID", reference);
  }
  if (answerReference.arithmeticCheck.kind === "whole-number-power") validateWholeNumberPowerPrompt(component, answerReference.arithmeticCheck, reference);
  if (answerReference.arithmeticCheck.kind === "positive-whole-equality-substitution-truth") validatePositiveWholeEqualitySubstitutionTruthPrompt(component, answerReference.arithmeticCheck, reference);
  if (answerReference.arithmeticCheck.kind === "direct-variation-whole-table-coefficient") validateDirectVariationWholeTableCoefficientPrompt(component, answerReference.arithmeticCheck, reference);
  if (answerReference.arithmeticCheck.kind === GGA_TRIANGLE_AREA_CHECK_KIND) validateGgaRightTriangleAreaPrompt(component, answerReference.arithmeticCheck, reference);
  Object.entries(component.component.contentByLocale).forEach(function (entry) {
    assertStudentContentDoesNotRevealAnswer(entry[1], answerReference.expectedResponse, reference, entry[0]);
  });
  return component;
}

function validateTeacherArtifact(artifact, plan, policy, seenArtifactIds, expectedResources) {
  const reference = localReference(artifact && artifact.artifactId, "teacher-artifact");
  assertOnlyKeys(artifact, ARTIFACT_KEYS, "TEACHER_ARTIFACT_INVALID", reference);
  assertId(artifact.artifactId, "art-dft-", "TEACHER_ARTIFACT_INVALID", reference);
  assert(!seenArtifactIds.has(artifact.artifactId), "DUPLICATE_TEACHER_ARTIFACT", reference);
  seenArtifactIds.add(artifact.artifactId);
  assert(artifact.artifactVersion === 1 && artifact.audience === "teacher" && artifact.productionState === PRODUCTION_STATE, "TEACHER_ARTIFACT_INVALID", reference);
  requireLocales(artifact.titleByLocale, policy, "TEACHER_ARTIFACT_INVALID", reference);
  const resource = findResource(plan, artifact.resourceBinding, reference);
  assert(resource.audience === "teacher" && expectedResources.has(resource.resourcePlanItemId), "TEACHER_RESOURCE_NOT_IN_SCOPE", reference);
  assertDenseArray(artifact.components, "TEACHER_ARTIFACT_INVALID", reference);
  const observationComponents = artifact.components.filter(function (component) {
    return component && component.componentType === NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
  });
  assert(observationComponents.length <= 1, "TEACHER_COMPONENT_INVALID", reference);
  assert(observationComponents.every(function () {
    return ["ccss-6-ns-c", "ccss-6-ee-a", "ccss-6-ee-b", "ccss-6-ee-c", "ccss-6-g-a"].includes(resource.unitId) && ["lesson-plan", "assignment-builder"].includes(resource.resourceType);
  }), "TEACHER_COMPONENT_INVALID", reference);
  const plannedComponents = artifact.components.filter(function (component) {
    return !component || component.componentType !== NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
  });
  assertPlannedComponentCounts(plannedComponents, resource, reference);
  const componentIds = new Set();
  const sequences = [];
  artifact.components.forEach(function (component) {
    validateTeacherComponent(component, policy, localReference(component && component.componentId, reference));
    assert(!componentIds.has(component.componentId), "DUPLICATE_TEACHER_COMPONENT", reference);
    componentIds.add(component.componentId);
    sequences.push(component.sequence);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(artifact.components.map(function (_component, index) { return index + 1; })), "TEACHER_COMPONENT_SEQUENCE_INVALID", reference);
  validateLessonSegments(artifact.lessonSegments, artifact, policy, reference);
  assertDenseArray(artifact.answerReferences, "TEACHER_ARTIFACT_INVALID", reference);
  if (["assignment-builder"].includes(resource.resourceType)) assert(artifact.answerReferences.length === 0, "TEACHER_ARTIFACT_INVALID", reference);
  return Object.freeze({ resource, artifact });
}

function validateEeaTeacherObservationEvidence(artifacts, unit, reference) {
  if (unit.unitId !== "ccss-6-ee-a") return;
  const requiredArtifactProfiles = [
    { resourceType: "lesson-plan", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "advanced" }
  ];
  requiredArtifactProfiles.forEach(function (profile) {
    const matches = artifacts.filter(function (entry) {
      return entry.resource.resourceType === profile.resourceType && entry.resource.levelId === profile.levelId;
    });
    assert(matches.length === 1, "EEA_TEACHER_OBSERVATION_INCOMPLETE", reference);
    const observationCount = matches[0].artifact.components.filter(function (component) {
      return component.componentType === NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
    }).length;
    assert(observationCount === 1, "EEA_TEACHER_OBSERVATION_INCOMPLETE", matches[0].artifact.artifactId);
  });
}

function validateEebTeacherObservationEvidence(artifacts, unit, policy, reference) {
  if (unit.unitId !== "ccss-6-ee-b") return;
  const requiredArtifactProfiles = [
    { resourceType: "lesson-plan", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "advanced" }
  ];
  requiredArtifactProfiles.forEach(function (profile) {
    const matches = artifacts.filter(function (entry) {
      return entry.resource.resourceType === profile.resourceType && entry.resource.levelId === profile.levelId;
    });
    assert(matches.length === 1, "EEB_TEACHER_OBSERVATION_INCOMPLETE", reference);
    const observations = matches[0].artifact.components.filter(function (component) {
      return component.componentType === NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
    });
    assert(observations.length === 1, "EEB_TEACHER_OBSERVATION_INCOMPLETE", matches[0].artifact.artifactId);
    const exactContent = EEB_TEACHER_OBSERVATION_BY_PROFILE[`${profile.resourceType}:${profile.levelId}`];
    assert(exactContent, "EEB_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    Object.entries(observations[0].contentByLocale).forEach(function (entry) {
      const locale = entry[0];
      assert(policy.included.includes(locale) && entry[1] === exactContent[locale], "EEB_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    });
  });
}

function validateEecTeacherObservationEvidence(artifacts, unit, policy, reference) {
  if (unit.unitId !== "ccss-6-ee-c") return;
  const requiredArtifactProfiles = [
    { resourceType: "lesson-plan", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "advanced" }
  ];
  requiredArtifactProfiles.forEach(function (profile) {
    const matches = artifacts.filter(function (entry) {
      return entry.resource.resourceType === profile.resourceType && entry.resource.levelId === profile.levelId;
    });
    assert(matches.length === 1, "EEC_TEACHER_OBSERVATION_INCOMPLETE", reference);
    const observations = matches[0].artifact.components.filter(function (component) {
      return component.componentType === NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
    });
    assert(observations.length === 1, "EEC_TEACHER_OBSERVATION_INCOMPLETE", matches[0].artifact.artifactId);
    const exactContent = EEC_TEACHER_OBSERVATION_BY_PROFILE[`${profile.resourceType}:${profile.levelId}`];
    assert(exactContent, "EEC_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    Object.entries(observations[0].contentByLocale).forEach(function (entry) {
      const locale = entry[0];
      assert(policy.included.includes(locale) && entry[1] === exactContent[locale], "EEC_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    });
  });
}

function validateGgaTeacherObservationEvidence(artifacts, unit, policy, reference) {
  if (unit.unitId !== "ccss-6-g-a") return;
  const requiredArtifactProfiles = [
    { resourceType: "lesson-plan", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "core" },
    { resourceType: "assignment-builder", levelId: "advanced" }
  ];
  requiredArtifactProfiles.forEach(function (profile) {
    const matches = artifacts.filter(function (entry) {
      return entry.resource.resourceType === profile.resourceType && entry.resource.levelId === profile.levelId;
    });
    assert(matches.length === 1, "GGA_TEACHER_OBSERVATION_INCOMPLETE", reference);
    const observations = matches[0].artifact.components.filter(function (component) {
      return component.componentType === NON_AUTOMATIC_TEACHER_OBSERVATION_COMPONENT;
    });
    assert(observations.length === 1, "GGA_TEACHER_OBSERVATION_INCOMPLETE", matches[0].artifact.artifactId);
    const exactContent = GGA_TEACHER_OBSERVATION_BY_PROFILE[`${profile.resourceType}:${profile.levelId}`];
    assert(exactContent, "GGA_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    Object.entries(observations[0].contentByLocale).forEach(function (entry) {
      const locale = entry[0];
      assert(policy.included.includes(locale) && entry[1] === exactContent[locale], "GGA_TEACHER_OBSERVATION_INCOMPLETE", observations[0].componentId);
    });
  });
}

function validateAssessmentPlaceholders(placeholders, plan, reference) {
  assertDenseArray(placeholders, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  const expected = plan.resourcesByAudience.student.filter(function (resource) {
    return resource.signedItemRequired && ["quiz", "test"].includes(resource.resourceType);
  });
  assert(placeholders.length === expected.length, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  const expectedById = new Map(expected.map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const seen = new Set();
  placeholders.forEach(function (placeholder) {
    assertOnlyKeys(placeholder, PLACEHOLDER_KEYS, "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    const resource = expectedById.get(placeholder.resourcePlanItemId);
    assert(resource && !seen.has(resource.resourcePlanItemId), "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    seen.add(resource.resourcePlanItemId);
    ["sessionId", "levelId", "testType", "resourceType"].forEach(function (field) {
      assert(placeholder[field] === resource[field], "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
    });
    assert(placeholder.status === "not-authored-in-workbook-pack", "ASSESSMENT_PLACEHOLDERS_INVALID", reference);
  });
}

function validateHomeStudyPlan(homeStudyPlan, componentMap, reference) {
  assertDenseArray(homeStudyPlan, "HOME_STUDY_PLAN_INVALID", reference);
  assert(homeStudyPlan.length === resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek * resourcePlans.GRADE6_CADENCE.weeksPerUnit, "HOME_STUDY_PLAN_INVALID", reference);
  const blockIds = new Set();
  const sequences = [];
  const weeks = new Map();
  const assignedComponents = new Set();
  homeStudyPlan.forEach(function (block) {
    assertOnlyKeys(block, HOME_BLOCK_KEYS, "HOME_STUDY_PLAN_INVALID", reference);
    assertStudentNeutralId(block.blockId, "hbk-dft-", "HOME_STUDY_PLAN_INVALID", reference);
    assert(!blockIds.has(block.blockId), "HOME_STUDY_PLAN_INVALID", reference);
    blockIds.add(block.blockId);
    assert(Number.isInteger(block.week) && block.week >= 1 && block.week <= resourcePlans.GRADE6_CADENCE.weeksPerUnit, "HOME_STUDY_PLAN_INVALID", reference);
    assert(Number.isInteger(block.sequence) && block.sequence > 0, "HOME_STUDY_PLAN_INVALID", reference);
    assert(block.minutes === resourcePlans.GRADE6_CADENCE.minutesPerHomeBlock, "HOME_STUDY_PLAN_INVALID", reference);
    assertDenseArray(block.componentIds, "HOME_STUDY_PLAN_INVALID", reference);
    assert(block.componentIds.length >= 2 && block.componentIds.length <= 3, "HOME_STUDY_PLAN_INVALID", reference);
    block.componentIds.forEach(function (componentId) {
      const component = componentMap.get(componentId);
      assert(component && component.component.responseMode !== null && !assignedComponents.has(componentId), "HOME_STUDY_PLAN_INVALID", reference);
      assignedComponents.add(componentId);
    });
    sequences.push(block.sequence);
    weeks.set(block.week, (weeks.get(block.week) || 0) + 1);
  });
  assert(JSON.stringify(sequences.sort(function (left, right) { return left - right; })) === JSON.stringify(homeStudyPlan.map(function (_block, index) { return index + 1; })), "HOME_STUDY_PLAN_INVALID", reference);
  for (let week = 1; week <= resourcePlans.GRADE6_CADENCE.weeksPerUnit; week += 1) {
    assert(weeks.get(week) === resourcePlans.GRADE6_CADENCE.homeBlocksPerWeek, "HOME_STUDY_PLAN_INVALID", reference);
  }
}

function validateLayouts(layoutPlan, sections, artifacts, reference) {
  assertOnlyKeys(layoutPlan, LAYOUT_KEYS, "LAYOUT_PLAN_INVALID", reference);
  ["studentTargetPages", "teacherTargetPages", "frontMatterPages", "closingPages"].forEach(function (field) {
    assert(Number.isInteger(layoutPlan[field]) && layoutPlan[field] >= 0 && layoutPlan[field] <= 100, "LAYOUT_PLAN_INVALID", reference);
  });
  assert(layoutPlan.studentTargetPages >= 8 && layoutPlan.teacherTargetPages >= 4, "LAYOUT_PLAN_INVALID", reference);
  function validateEntries(entries, expectedIds, startPage, finalPage, code) {
    assertDenseArray(entries, code, reference);
    assert(entries.length === expectedIds.size, code, reference);
    const ids = new Set();
    let nextPage = startPage;
    entries.forEach(function (entry) {
      assertOnlyKeys(entry, LAYOUT_ENTRY_KEYS, code, reference);
      assert(typeof entry.id === "string" && expectedIds.has(entry.id) && !ids.has(entry.id), code, reference);
      ids.add(entry.id);
      assert(Number.isInteger(entry.startPage) && Number.isInteger(entry.endPage) && entry.startPage === nextPage && entry.endPage >= entry.startPage, code, reference);
      nextPage = entry.endPage + 1;
    });
    assert(nextPage === finalPage + 1, code, reference);
  }
  validateEntries(
    layoutPlan.studentSectionLayouts,
    new Set(sections.map(function (entry) { return entry.section.sectionId; })),
    layoutPlan.frontMatterPages + 1,
    layoutPlan.studentTargetPages - layoutPlan.closingPages,
    "STUDENT_LAYOUT_INVALID"
  );
  validateEntries(
    layoutPlan.teacherArtifactLayouts,
    new Set(artifacts.map(function (entry) { return entry.artifact.artifactId; })),
    1,
    layoutPlan.teacherTargetPages,
    "TEACHER_LAYOUT_INVALID"
  );
}

function instructionalStudentResources(plan) {
  return plan.resourcesByAudience.student.filter(function (resource) {
    return resource.testType === "guided-practice" && ["concept-workbook", "guided-practice", "homework"].includes(resource.resourceType);
  });
}

function instructionalTeacherResources(plan) {
  const instructionalSessions = new Set(instructionalStudentResources(plan).map(function (resource) { return resource.sessionId; }));
  return plan.resourcesByAudience.teacher.filter(function (resource) {
    return instructionalSessions.has(resource.sessionId) && ["lesson-plan", "solution-guide", "assignment-builder", "answer-key"].includes(resource.resourceType);
  });
}

function validatePack(pack, fileName) {
  const reference = localReference(pack && pack.packId, fileName);
  assertOnlyKeys(pack, PACK_KEYS, "WORKBOOK_PACK_FIELDS_INVALID", reference);
  assert(pack.schemaVersion === SCHEMA_VERSION && pack.confidentiality === CONFIDENTIALITY_MARKER, "WORKBOOK_PACK_SCHEMA_INVALID", reference);
  assertId(pack.packId, "wbk-dft-", "WORKBOOK_PACK_ID_INVALID", reference);
  assert(pack.packVersion === 1 && pack.state === DRAFT_STATE && pack.deliveryState === "locked", "WORKBOOK_PACK_STATE_INVALID", reference);
  assert(["partial", "plan-complete"].includes(pack.coverageState), "WORKBOOK_PACK_STATE_INVALID", reference);
  validateLocalePolicy(pack.localePolicy, reference);
  validateFrontMatter(pack.frontMatter, pack.localePolicy, reference);
  validateClosingMatter(pack.closingMatter, pack.localePolicy, reference);
  const unit = standardUnit(pack, reference);
  validateStandardsEvidence(pack.standardsEvidence, pack.localePolicy, unit, reference);
  const plan = resourcePlans.buildUnitPlan(unit.unitId);
  assert(pack.resourcePlanId === plan.planId && pack.cadenceProfileId === resourcePlans.GRADE6_CADENCE.cadenceProfileId, "WORKBOOK_PLAN_BINDING_INVALID", reference);
  validateRightsDraft(pack.rightsDraft, reference);
  validateVerification(pack.verification, reference);
  assertDenseArray(pack.studentSections, "STUDENT_SECTIONS_INVALID", reference);
  assertDenseArray(pack.teacherArtifacts, "TEACHER_ARTIFACTS_INVALID", reference);

  const expectedStudent = new Map(instructionalStudentResources(plan).map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const expectedTeacher = new Map(instructionalTeacherResources(plan).map(function (resource) { return [resource.resourcePlanItemId, resource]; }));
  const seenSectionIds = new Set();
  const seenComponentIds = new Set();
  const seenStudentResources = new Set();
  const sections = pack.studentSections.map(function (section) {
    const result = validateStudentSection(section, plan, pack.localePolicy, seenSectionIds, seenComponentIds, expectedStudent);
    assert(!seenStudentResources.has(result.resource.resourcePlanItemId), "DUPLICATE_STUDENT_RESOURCE", result.section.sectionId);
    seenStudentResources.add(result.resource.resourcePlanItemId);
    return result;
  });
  if (pack.coverageState === "plan-complete") assert(seenStudentResources.size === expectedStudent.size, "INSTRUCTIONAL_COVERAGE_INCOMPLETE", reference);
  else assert(seenStudentResources.size > 0 && seenStudentResources.size < expectedStudent.size, "PARTIAL_COVERAGE_STATE_INVALID", reference);

  const seenArtifactIds = new Set();
  const seenTeacherResources = new Set();
  const artifacts = pack.teacherArtifacts.map(function (artifact) {
    const result = validateTeacherArtifact(artifact, plan, pack.localePolicy, seenArtifactIds, expectedTeacher);
    assert(!seenTeacherResources.has(result.resource.resourcePlanItemId), "DUPLICATE_TEACHER_RESOURCE", result.artifact.artifactId);
    seenTeacherResources.add(result.resource.resourcePlanItemId);
    return result;
  });
  if (pack.coverageState === "plan-complete") assert(seenTeacherResources.size === expectedTeacher.size, "TEACHER_COVERAGE_INCOMPLETE", reference);
  else assert(seenTeacherResources.size > 0 && seenTeacherResources.size < expectedTeacher.size, "PARTIAL_COVERAGE_STATE_INVALID", reference);
  validateEeaTeacherObservationEvidence(artifacts, unit, reference);
  validateEebTeacherObservationEvidence(artifacts, unit, pack.localePolicy, reference);
  validateEecTeacherObservationEvidence(artifacts, unit, pack.localePolicy, reference);
  validateGgaTeacherObservationEvidence(artifacts, unit, pack.localePolicy, reference);

  const componentMap = new Map();
  sections.forEach(function (entry) {
    entry.section.components.forEach(function (component) { componentMap.set(component.componentId, Object.freeze({ component, section: entry.section })); });
  });
  validateHomeStudyPlan(pack.homeStudyPlan, componentMap, reference);
  const seenReferenceIds = new Set();
  const referencedComponents = new Set();
  const answerReferences = [];
  artifacts.forEach(function (entry) {
    entry.artifact.answerReferences.forEach(function (answerReference) {
      const component = validateAnswerReference(answerReference, componentMap, pack.localePolicy, entry.artifact, seenReferenceIds);
      assert(component.component.teacherReferenceId === answerReference.referenceId, "ANSWER_REFERENCE_LINK_MISMATCH", answerReference.referenceId);
      assert(!referencedComponents.has(answerReference.componentId), "DUPLICATE_COMPONENT_ANSWER_REFERENCE", answerReference.referenceId);
      referencedComponents.add(answerReference.componentId);
      answerReferences.push(answerReference);
    });
  });
  validateNscAutomaticEvidence(answerReferences, unit, reference);
  validateEebAutomaticEvidence(answerReferences, componentMap, unit, reference);
  validateEeaAutomaticEvidence(answerReferences, componentMap, unit, reference);
  validateEecAutomaticEvidence(answerReferences, componentMap, unit, reference);
  validateGgaAutomaticEvidence(answerReferences, componentMap, unit, reference);
  validateEebStudentVisibleSeparation(pack, sections, answerReferences, unit, reference);
  validateEeaStudentVisibleSeparation(pack, sections, answerReferences, unit, reference);
  validateEecStudentVisibleSeparation(pack, sections, answerReferences, unit, reference);
  validateGgaStudentVisibleSeparation(pack, sections, answerReferences, unit, reference);
  sections.forEach(function (entry) {
    entry.section.components.forEach(function (component) {
      if (component.responseMode === null) return;
      assert(referencedComponents.has(component.componentId), "MISSING_TEACHER_ANSWER_REFERENCE", component.componentId);
    });
  });
  validateAssessmentPlaceholders(pack.assessmentPlaceholders, plan, reference);
  validateLayouts(pack.layoutPlan, sections, artifacts, reference);
  return Object.freeze({ sectionCount: sections.length, componentCount: componentMap.size, artifactCount: artifacts.length });
}

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function assertNoReparsePointInPath(absolutePath) {
  const parsed = path.parse(absolutePath);
  let current = parsed.root;
  const parts = absolutePath.slice(parsed.root.length).split(path.sep).filter(Boolean);
  parts.forEach(function (part) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current);
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  });
}

function gitMarkerExists(directory) {
  try {
    fs.lstatSync(path.join(directory, ".git"));
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    fail("PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  }
}

function assertOutsideAnyGitWorktree(absolutePath) {
  let current = absolutePath;
  while (true) {
    // Git-discoverable normal repositories and linked worktrees are represented
    // by a `.git` directory or file. A private authoring root cannot live
    // beneath either one, even when it is outside this public repository.
    assert(!gitMarkerExists(current), "PRIVATE_WORKBOOK_ROOT_INSIDE_GIT_WORKTREE", "root");
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function parseRoot(args) {
  assert(args.length === 2 && args[0] === "--root" && path.isAbsolute(args[1]), "PRIVATE_WORKBOOK_ROOT_REQUIRED", "command");
  return args[1];
}

function sourceFiles(root) {
  const rootStat = fs.lstatSync(root);
  assert(rootStat.isDirectory() && !rootStat.isSymbolicLink(), "PRIVATE_WORKBOOK_ROOT_UNSAFE", "root");
  const files = [];
  fs.readdirSync(root, { withFileTypes: true }).forEach(function (entry) {
    assert(entry.isFile() && !entry.isSymbolicLink(), "PRIVATE_WORKBOOK_PATH_UNSAFE", entry.name);
    assert(/^grade6-[a-z0-9-]+-workbook-draft\.json$/.test(entry.name), "PRIVATE_WORKBOOK_FILE_NAME_INVALID", entry.name);
    files.push(entry.name);
  });
  assert(files.length > 0, "PRIVATE_WORKBOOK_PACKS_MISSING", "root");
  return files.sort();
}

function assertNoDuplicateJsonKeys(source, reference) {
  const containers = [];
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === "\"") {
      const start = index;
      let closed = false;
      index += 1;
      while (index < source.length) {
        const current = source[index];
        if (current === "\\") {
          index += 1;
          assert(index < source.length, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
          index += 1;
          continue;
        }
        if (current === "\"") {
          closed = true;
          break;
        }
        assert(current.charCodeAt(0) > 0x1f, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
        index += 1;
      }
      assert(closed, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
      let next = index + 1;
      while (next < source.length && /[\t\n\r ]/u.test(source[next])) next += 1;
      const keys = containers[containers.length - 1];
      if (source[next] === ":" && keys instanceof Set) {
        let key;
        try {
          key = JSON.parse(source.slice(start, index + 1));
        } catch (_error) {
          fail("PRIVATE_WORKBOOK_JSON_INVALID", reference);
        }
        assert(!keys.has(key), "PRIVATE_WORKBOOK_JSON_DUPLICATE_KEY", reference);
        keys.add(key);
      }
      continue;
    }
    if (character === "{") containers.push(new Set());
    else if (character === "[") containers.push(null);
    else if (character === "}" || character === "]") containers.pop();
  }
}

function loadPack(root, fileName) {
  const reference = fileName;
  const fullPath = path.join(root, fileName);
  const stat = fs.lstatSync(fullPath);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= 1024 * 1024, "PRIVATE_WORKBOOK_FILE_UNSAFE", reference);
  let value;
  try {
    const source = fs.readFileSync(fullPath, "utf8");
    assertNoDuplicateJsonKeys(source, reference);
    value = JSON.parse(source);
  } catch (_error) {
    if (_error instanceof ValidationError) throw _error;
    fail("PRIVATE_WORKBOOK_JSON_INVALID", reference);
  }
  assertRecord(value, "PRIVATE_WORKBOOK_JSON_INVALID", reference);
  return value;
}

function validateDirectory(rootArgument) {
  if (process.env.CI && process.env.GFIELD_ALLOW_PRIVATE_WORKBOOK_PREFLIGHT !== "1") {
    fail("PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI", "command");
  }
  const projectRoot = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(projectRoot, "..");
  assert(fs.existsSync(rootArgument), "PRIVATE_WORKBOOK_ROOT_MISSING", "root");
  const lexicalRoot = path.resolve(rootArgument);
  assert(!isInside(lexicalRoot, repoRoot), "PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY", "root");
  assertNoReparsePointInPath(lexicalRoot);
  const root = fs.realpathSync(lexicalRoot);
  assert(!isInside(root, repoRoot), "PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY", "root");
  assertOutsideAnyGitWorktree(root);
  const files = sourceFiles(root);
  const packIds = new Set();
  const unitIds = new Set();
  let totals = { packs: 0, sections: 0, components: 0, artifacts: 0 };
  files.forEach(function (fileName) {
    const pack = loadPack(root, fileName);
    const result = validatePack(pack, fileName);
    assert(!packIds.has(pack.packId), "DUPLICATE_WORKBOOK_PACK", fileName);
    assert(!unitIds.has(pack.unitId), "DUPLICATE_WORKBOOK_UNIT", fileName);
    packIds.add(pack.packId);
    unitIds.add(pack.unitId);
    totals = {
      packs: totals.packs + 1,
      sections: totals.sections + result.sectionCount,
      components: totals.components + result.componentCount,
      artifacts: totals.artifacts + result.artifactCount
    };
  });
  return Object.freeze(totals);
}

function main() {
  try {
    const root = parseRoot(process.argv.slice(2));
    const result = validateDirectory(root);
    process.stdout.write(`PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_OK packs=${result.packs} sections=${result.sections} components=${result.components} teacherArtifacts=${result.artifacts} state=${DRAFT_STATE}\n`);
  } catch (error) {
    if (error instanceof ValidationError) {
      process.stderr.write(`PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_FAILED code=${error.code} ref=${error.reference}\n`);
      process.exitCode = 1;
      return;
    }
    process.stderr.write("PRIVATE_GRADE6_WORKBOOK_PREFLIGHT_FAILED code=UNEXPECTED_VALIDATOR_ERROR ref=validator\n");
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = Object.freeze({
  SCHEMA_VERSION,
  CONFIDENTIALITY_MARKER,
  DRAFT_STATE,
  EEC_LOCKED_EVIDENCE_BY_LOCALE,
  EEC_TABLE_EQUATION_EVIDENCE_ID,
  EEC_TEACHER_OBSERVATION_BY_PROFILE,
  GGA_LOCKED_EVIDENCE_BY_LOCALE,
  GGA_TRIANGLE_AREA_EVIDENCE_ID,
  GGA_TRIANGLE_AREA_CHECK_KIND,
  GGA_GEOMETRY_DIAGRAM_KIND,
  GGA_EVALUATION_MODES,
  GGA_TEACHER_OBSERVATION_BY_PROFILE,
  EEB_LOCKED_EVIDENCE_BY_LOCALE,
  EEB_TEACHER_OBSERVATION_BY_PROFILE,
  EEB_STUDENT_STATIC_TEXT,
  assertResponseStudentTextSyntax,
  canonicalDirectVariationWholeTableCoefficient,
  canonicalGgaRightTriangleArea,
  validateGgaGeometryDiagram,
  validateGgaRightTriangleAreaPrompt,
  assertStudentContentDoesNotRevealAnswer,
  assertNoDuplicateJsonKeys,
  canonicalAnswer,
  validateStandardsEvidence,
  validateNscAutomaticEvidence,
  validateEebAutomaticEvidence,
  validateEeaAutomaticEvidence,
  validateGgaAutomaticEvidence,
  validatePositiveWholeEqualitySubstitutionTruthPrompt,
  validateEeaWorkedExampleContent,
  validateEebWorkedExampleContent,
  validateEebStudentVisibleSeparation,
  validateEebTeacherObservationEvidence,
  eebEqualityFactFingerprint,
  assertEebExactLocalizedStudentText,
  validateEeaStudentVisibleSeparation,
  validateEeaTeacherObservationEvidence,
  validateGgaStudentVisibleSeparation,
  validateGgaTeacherObservationEvidence,
  containsEebTruthResponseLabel,
  assertEebNonWorkedStudentTextHasNoNumericOrTruthResponse,
  assertEeaNonWorkedStudentTextHasNoNumericNotation,
  containsEeaNumericEquivalentAnswer,
  containsEeaRomanAnswerToken,
  containsEeaEnglishNumberWord,
  containsEeaLocalizedAnswerWord,
  containsEecLocalizedAnswerEquivalent,
  validatePack,
  validateDirectory
});
