#!/usr/bin/env node
"use strict";

/*
 * Local-only Grade 6 workbook renderer.
 *
 * This public source contains renderer code only. It requires an explicit
 * external private authoring root and writes student/teacher HTML outside the
 * Git worktree. It never creates a public release, answer API, or PDF bundle.
 */

const fs = require("node:fs");
const path = require("node:path");
const validator = require("./validate-private-grade6-workbook.cjs");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const REPOSITORY_ROOT = fs.realpathSync(path.resolve(PROJECT_ROOT, ".."));
const LOCALES = new Set(["ko", "en", "zh-Hans"]);
const PRIVATE_DRAFT_STATE = validator.DRAFT_STATE;
const PRIVATE_DELIVERY_STATE = "locked";
const PRIVATE_RENDER_DRAFT_FILE_NAME = validator.PRIVATE_WORKBOOK_FILE_NAME;

const COPY = Object.freeze({
  ko: Object.freeze({
    studentTitle: "학생용 워크북",
    teacherTitle: "교사용 워크북",
    privateNotice: "비공개 검수용 초안 - 배포 또는 공개 금지",
    learningTarget: "학습 목표",
    howToUse: "사용 방법",
    response: "응답",
    relationshipTable: "관계 표",
    independentVariable: "독립변수",
    dependentVariable: "종속변수",
    baseLabel: "밑변",
    perpendicularHeightLabel: "수직 높이",
    unitLabel: "단위",
    closing: "마무리",
    teacherArtifacts: "교사용 자료",
    lessonSegments: "수업 흐름",
    teacherReference: "교사용 정답 및 검산",
    prompt: "학생 문항",
    expectedResponse: "기대 응답",
    solution: "풀이",
    uniqueness: "유일성 검산",
    workspace: "풀이 공간",
    truthOptions: Object.freeze({ holds: "성립", doesNotHold: "성립하지 않음" })
  }),
  en: Object.freeze({
    studentTitle: "Student Workbook",
    teacherTitle: "Teacher Workbook",
    privateNotice: "Private QA draft - do not distribute or publish",
    learningTarget: "Learning target",
    howToUse: "How to use",
    response: "Response",
    relationshipTable: "Relationship table",
    independentVariable: "Independent variable",
    dependentVariable: "Dependent variable",
    baseLabel: "Base",
    perpendicularHeightLabel: "Perpendicular height",
    unitLabel: "units",
    closing: "Closing",
    teacherArtifacts: "Teacher materials",
    lessonSegments: "Lesson flow",
    teacherReference: "Teacher answer and check",
    prompt: "Student prompt",
    expectedResponse: "Expected response",
    solution: "Solution",
    uniqueness: "Uniqueness check",
    workspace: "Workspace",
    truthOptions: Object.freeze({ holds: "Holds", doesNotHold: "Does not hold" })
  }),
  "zh-Hans": Object.freeze({
    studentTitle: "学生用练习册",
    teacherTitle: "教师用练习册",
    privateNotice: "仅供内部质检的私密草案 - 不得发布或公开",
    learningTarget: "学习目标",
    howToUse: "使用方法",
    response: "作答",
    relationshipTable: "关系表",
    independentVariable: "自变量",
    dependentVariable: "因变量",
    baseLabel: "底",
    perpendicularHeightLabel: "垂直高",
    unitLabel: "单位",
    closing: "结束说明",
    teacherArtifacts: "教师资料",
    lessonSegments: "课堂流程",
    teacherReference: "教师答案与核验",
    prompt: "学生题目",
    expectedResponse: "预期作答",
    solution: "解析",
    uniqueness: "唯一性核验",
    workspace: "作答空间",
    truthOptions: Object.freeze({ holds: "成立", doesNotHold: "不成立" })
  })
});

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function assert(condition, code) {
  if (!condition) fail(code);
}

function isInside(candidate, parent) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function nearestExistingAncestor(candidate) {
  let current = candidate;
  while (true) {
    try {
      fs.lstatSync(current);
      return current;
    } catch (error) {
      if (!error || error.code !== "ENOENT") fail("PRIVATE_RENDER_OUTPUT_UNSAFE");
    }
    const parent = path.dirname(current);
    assert(parent !== current, "PRIVATE_RENDER_OUTPUT_ROOT_INVALID");
    current = parent;
  }
}

function canonicalizeCandidate(candidate) {
  const lexical = path.resolve(candidate);
  const existingAncestor = nearestExistingAncestor(lexical);
  const canonicalAncestor = fs.realpathSync(existingAncestor);
  return path.resolve(canonicalAncestor, path.relative(existingAncestor, lexical));
}

function assertNoReparsePointInExistingPath(candidate) {
  const lexical = path.resolve(candidate);
  const parsed = path.parse(lexical);
  let current = parsed.root;
  const parts = lexical.slice(parsed.root.length).split(path.sep).filter(Boolean);
  for (const part of parts) {
    current = path.join(current, part);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error && error.code === "ENOENT") return;
      fail("PRIVATE_RENDER_OUTPUT_UNSAFE");
    }
    assert(stat.isDirectory() && !stat.isSymbolicLink(), "PRIVATE_RENDER_OUTPUT_UNSAFE");
  }
}

function gitMarkerExists(directory) {
  try {
    fs.lstatSync(path.join(directory, ".git"));
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    fail("PRIVATE_RENDER_OUTPUT_UNSAFE");
  }
}

function assertNoGitMarkerAncestor(candidate) {
  let current = canonicalizeCandidate(candidate);
  while (true) {
    assert(!gitMarkerExists(current), "PRIVATE_RENDER_OUTPUT_INSIDE_GIT");
    const parent = path.dirname(current);
    if (parent === current) return;
    current = parent;
  }
}

function assertExternalDirectory(candidate) {
  assertNoReparsePointInExistingPath(candidate);
  const canonical = canonicalizeCandidate(candidate);
  assert(!isInside(canonical, REPOSITORY_ROOT), "PRIVATE_RENDER_OUTPUT_INSIDE_GIT");
  assertNoGitMarkerAncestor(canonical);
  return canonical;
}

function parseArguments(args) {
  assert(args.length === 8, "PRIVATE_RENDER_COMMAND_INVALID");
  const values = Object.create(null);
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    const value = args[index + 1];
    assert(["--root", "--unit", "--locale", "--output"].includes(key) && typeof value === "string" && value.length > 0, "PRIVATE_RENDER_COMMAND_INVALID");
    assert(values[key] === undefined, "PRIVATE_RENDER_COMMAND_INVALID");
    values[key] = value;
  }
  assert(Object.keys(values).length === 4 && values["--root"] && values["--unit"] && values["--locale"] && values["--output"], "PRIVATE_RENDER_COMMAND_INVALID");
  assert(path.isAbsolute(values["--root"]) && path.isAbsolute(values["--output"]), "PRIVATE_RENDER_COMMAND_INVALID");
  assert(/^[a-z0-9-]+$/u.test(values["--unit"]) && LOCALES.has(values["--locale"]), "PRIVATE_RENDER_COMMAND_INVALID");
  return Object.freeze({
    privateRoot: path.resolve(values["--root"]),
    unitId: values["--unit"],
    locale: values["--locale"],
    outputRoot: path.resolve(values["--output"])
  });
}

function assertOutputRoot(privateRoot, outputRoot) {
  const canonicalPrivateRoot = assertExternalDirectory(privateRoot);
  const canonicalOutputRoot = assertExternalDirectory(outputRoot);
  assert(!isInside(canonicalOutputRoot, canonicalPrivateRoot) && !isInside(canonicalPrivateRoot, canonicalOutputRoot), "PRIVATE_RENDER_OUTPUT_OVERLAPS_AUTHORING_ROOT");
  return canonicalOutputRoot;
}

function localized(value, locale) {
  assert(value && typeof value === "object" && typeof value[locale] === "string" && value[locale].length > 0, "PRIVATE_RENDER_LOCALE_CONTENT_MISSING");
  return value[locale];
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#39;");
}

function textBlock(value) {
  return `<p>${escapeHtml(value).replace(/\r?\n/gu, "<br>")}</p>`;
}

function fileSafeUnitId(unitId) {
  return unitId.replace(/^ccss-/u, "");
}

function loadValidatedDraft(filePath) {
  const reference = path.basename(filePath);
  const stat = fs.lstatSync(filePath);
  assert(stat.isFile() && !stat.isSymbolicLink() && stat.size > 0 && stat.size <= 1024 * 1024, "PRIVATE_RENDER_DRAFT_UNSAFE");
  const source = fs.readFileSync(filePath, "utf8");
  validator.assertNoDuplicateJsonKeys(source, reference);
  let draft;
  try {
    draft = JSON.parse(source);
  } catch (_error) {
    fail("PRIVATE_RENDER_DRAFT_INVALID");
  }
  validator.validatePack(draft, reference);
  return draft;
}

function draftFileEntries(privateRoot) {
  return fs.readdirSync(privateRoot, { withFileTypes: true })
    .filter(function (entry) { return entry.isFile() && PRIVATE_RENDER_DRAFT_FILE_NAME.test(entry.name); });
}

function selectDraftForUnit(candidates, unitId) {
  const matches = candidates.filter(function (entry) { return entry.draft.unitId === unitId; });
  assert(matches.length === 1, "PRIVATE_RENDER_DRAFT_NOT_FOUND");
  return matches[0];
}

function findDraft(privateRoot, unitId) {
  const selected = selectDraftForUnit(
    draftFileEntries(privateRoot)
    .map(function (entry) {
      const filePath = path.join(privateRoot, entry.name);
      return Object.freeze({ filePath, draft: loadValidatedDraft(filePath) });
    }),
    unitId
  );
  assert(
    selected.draft.confidentiality === validator.CONFIDENTIALITY_MARKER &&
      selected.draft.state === PRIVATE_DRAFT_STATE &&
      selected.draft.deliveryState === PRIVATE_DELIVERY_STATE,
    "PRIVATE_RENDER_DRAFT_STATE_INVALID"
  );
  return selected.draft;
}

function relationTableForModel(table) {
  if (table === undefined) return null;
  return Object.freeze({
    independentSymbol: table.independentSymbol,
    dependentSymbol: table.dependentSymbol,
    independentValues: Object.freeze(Array.from(table.independentValues)),
    dependentValues: Object.freeze(Array.from(table.dependentValues))
  });
}

function geometryDiagramForModel(diagram) {
  if (diagram === undefined) return null;
  try {
    validator.validateGgaGeometryDiagram(diagram, "renderer-geometry-diagram");
  } catch (_error) {
    fail("PRIVATE_RENDER_GEOMETRY_DIAGRAM_INVALID");
  }
  return Object.freeze({
    kind: diagram.kind,
    base: diagram.base,
    perpendicularHeight: diagram.perpendicularHeight,
    heightFoot: diagram.heightFoot
  });
}

function statisticsDisplayForModel(display) {
  if (display === undefined) return null;
  try {
    validator.validateStatisticsDisplay(display, "renderer-statistics-display");
  } catch (_error) {
    fail("PRIVATE_RENDER_STATISTICS_DISPLAY_INVALID");
  }
  return Object.freeze({ values: Object.freeze(Array.from(display.values)) });
}

function layoutForId(entries, id, code) {
  const matches = entries.filter(function (entry) { return entry.id === id; });
  assert(matches.length === 1, code);
  const layout = matches[0];
  assert(
    Number.isInteger(layout.startPage) && Number.isInteger(layout.endPage) &&
      layout.startPage >= 1 && layout.endPage >= layout.startPage && layout.endPage <= 100,
    code
  );
  return Object.freeze({ startPage: layout.startPage, endPage: layout.endPage });
}

function fixedPageLayout(pageCount, startPage) {
  assert(Number.isInteger(pageCount) && pageCount >= 0 && pageCount <= 100, "PRIVATE_RENDER_LAYOUT_INVALID");
  assert(Number.isInteger(startPage) && startPage >= 1 && startPage <= 100, "PRIVATE_RENDER_LAYOUT_INVALID");
  if (pageCount === 0) return null;
  return Object.freeze({ startPage, endPage: startPage + pageCount - 1 });
}

function buildStudentModel(draft, locale) {
  const student = Object.freeze({
    audience: "student",
    unitId: draft.unitId,
    targetPages: draft.layoutPlan.studentTargetPages,
    title: localized(draft.frontMatter.titleByLocale, locale),
    learningTarget: localized(draft.frontMatter.learningTargetsByLocale, locale),
    howToUse: localized(draft.frontMatter.howToUseByLocale, locale),
    glossary: localized(draft.closingMatter.glossaryByLocale, locale),
    retentionNotice: localized(draft.closingMatter.retentionNoticeByLocale, locale),
    frontMatterLayout: fixedPageLayout(draft.layoutPlan.frontMatterPages, 1),
    closingLayout: fixedPageLayout(draft.layoutPlan.closingPages, draft.layoutPlan.studentTargetPages - draft.layoutPlan.closingPages + 1),
    sections: draft.studentSections.map(function (section) {
      return Object.freeze({
        title: localized(section.titleByLocale, locale),
        layout: layoutForId(draft.layoutPlan.studentSectionLayouts, section.sectionId, "PRIVATE_RENDER_STUDENT_LAYOUT_INVALID"),
        components: section.components.map(function (component) {
          return Object.freeze({
            componentType: component.componentType,
            content: localized(component.contentByLocale, locale),
            responseMode: component.responseMode,
            relationTable: relationTableForModel(component.relationTable),
            geometryDiagram: geometryDiagramForModel(component.geometryDiagram),
            statisticsDisplay: statisticsDisplayForModel(component.statisticsDisplay)
          });
        })
      });
    })
  });
  assertStudentModelSafe(student);
  return student;
}

function assertStudentModelSafe(student) {
  const serialized = JSON.stringify(student);
  assert(!/(?:teacherReferenceId|teacherArtifacts|answerReferences|expectedResponse|solutionByLocale|uniquenessProofByLocale|arithmeticCheck|rubric)/iu.test(serialized), "PRIVATE_RENDER_STUDENT_MODEL_UNSAFE");
}

function componentById(draft) {
  const map = new Map();
  draft.studentSections.forEach(function (section) {
    section.components.forEach(function (component) { map.set(component.componentId, component); });
  });
  return map;
}

function buildTeacherModel(draft, locale) {
  const components = componentById(draft);
  return Object.freeze({
    audience: "teacher",
    unitId: draft.unitId,
    targetPages: draft.layoutPlan.teacherTargetPages,
    title: localized(draft.frontMatter.titleByLocale, locale),
    artifacts: draft.teacherArtifacts.map(function (artifact) {
      return Object.freeze({
        title: localized(artifact.titleByLocale, locale),
        layout: layoutForId(draft.layoutPlan.teacherArtifactLayouts, artifact.artifactId, "PRIVATE_RENDER_TEACHER_LAYOUT_INVALID"),
        components: artifact.components.map(function (component) {
          return Object.freeze({ componentType: component.componentType, content: localized(component.contentByLocale, locale) });
        }),
        lessonSegments: artifact.lessonSegments.map(function (segment) {
          return Object.freeze({ instruction: localized(segment.instructionByLocale, locale) });
        }),
        references: artifact.answerReferences.map(function (reference) {
          const component = components.get(reference.componentId);
          assert(component, "PRIVATE_RENDER_TEACHER_REFERENCE_INVALID");
          return Object.freeze({
            prompt: localized(component.contentByLocale, locale),
            relationTable: relationTableForModel(component.relationTable),
            geometryDiagram: geometryDiagramForModel(component.geometryDiagram),
            statisticsDisplay: statisticsDisplayForModel(component.statisticsDisplay),
            expectedResponse: reference.expectedResponse,
            solution: localized(reference.solutionByLocale, locale),
            uniqueness: localized(reference.uniquenessProofByLocale, locale)
          });
        })
      });
    })
  });
}

function documentShell(options) {
  const { locale, title, audienceTitle, notice, body, targetPages } = options;
  return `<!doctype html>
<html lang="${escapeHtml(locale)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} - ${escapeHtml(audienceTitle)}</title>
<style>
@page { size: Letter; margin: 0.42in; }
:root { color-scheme: light; font-family: "Noto Sans KR", "Noto Sans SC", "Segoe UI", Arial, sans-serif; color: #172033; background: #edf2f7; }
* { box-sizing: border-box; }
body { margin: 0; background: #edf2f7; }
main { width: min(100%, 8.5in); min-height: 11in; margin: 24px auto; padding: 0.5in; background: #fff; box-shadow: 0 12px 34px rgba(18, 38, 63, 0.16); }
header { border-bottom: 3px solid #1d4ed8; padding-bottom: 14px; margin-bottom: 18px; }
h1 { margin: 0; font-size: 25px; line-height: 1.25; letter-spacing: -0.02em; }
h2 { margin: 26px 0 10px; padding-bottom: 5px; border-bottom: 1px solid #cbd5e1; font-size: 18px; }
h3 { margin: 18px 0 7px; font-size: 15px; }
p { margin: 6px 0; font-size: 13px; line-height: 1.65; white-space: normal; }
.notice { margin-top: 8px; color: #8a3d00; font-size: 11px; font-weight: 700; }
.section { break-inside: avoid; page-break-inside: avoid; }
.component { margin: 10px 0; padding: 11px 13px; border: 1px solid #dbe4ef; border-radius: 8px; background: #fbfdff; break-inside: avoid; page-break-inside: avoid; }
.component-label { margin-bottom: 5px; color: #475569; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.response { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 12px; font-weight: 700; }
.answer-line { flex: 1; min-height: 25px; border-bottom: 1.5px solid #334155; }
.truth-value { flex-wrap: wrap; gap: 8px 14px; }
.response-choice { display: inline-flex; align-items: center; gap: 6px; min-height: 28px; white-space: nowrap; }
.choice-box { width: 17px; height: 17px; border: 1.5px solid #334155; border-radius: 3px; background: #fff; }
.teacher { border-left: 4px solid #7c3aed; background: #faf7ff; }
.reference { border-left: 4px solid #047857; background: #f0fdf4; }
.relation-table { width: 100%; margin: 10px 0; border-collapse: collapse; font-size: 12px; }
.relation-table caption { margin-bottom: 5px; text-align: left; color: #475569; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.relation-table th, .relation-table td { padding: 6px 8px; border: 1px solid #bfdbfe; text-align: center; }
.relation-table th { background: #eff6ff; color: #1e3a8a; }
.geometry-diagram { max-width: 320px; margin: 10px auto; }
.geometry-diagram svg { display: block; width: 100%; height: auto; }
.geometry-diagram .triangle-shape { fill: #eff6ff; stroke: #1e3a8a; stroke-width: 2.5; }
.geometry-diagram .dimension-line, .geometry-diagram .extension-line { fill: none; stroke: #475569; stroke-width: 1.5; }
.geometry-diagram .right-angle-marker { fill: none; stroke: #0f172a; stroke-width: 2; }
.geometry-diagram text { fill: #172033; font-size: 13px; font-weight: 700; }
.statistics-display { display: flex; flex-wrap: wrap; gap: 7px; margin: 10px 0; padding: 9px; border: 1px solid #bfdbfe; border-radius: 7px; background: #eff6ff; }
.statistics-value { min-width: 32px; padding: 5px 7px; border: 1px solid #93c5fd; border-radius: 5px; background: #fff; color: #1e3a8a; font-size: 12px; font-weight: 700; text-align: center; }
.reference-grid { display: grid; grid-template-columns: max-content 1fr; gap: 5px 12px; font-size: 12px; line-height: 1.55; }
.reference-grid strong { color: #14532d; }
footer { margin-top: 28px; padding-top: 9px; border-top: 1px solid #cbd5e1; color: #64748b; font-size: 10px; }
.private-watermark { display: none; }
@media (max-width: 640px) { body { background: #fff; } main { width: 100%; min-height: 0; margin: 0; padding: 18px 16px 26px; box-shadow: none; } h1 { font-size: 22px; } h2 { font-size: 17px; } p { font-size: 14px; } .reference-grid { grid-template-columns: 1fr; gap: 3px; } .relation-table { font-size: 11px; } .relation-table th, .relation-table td { padding: 5px; } .geometry-diagram { max-width: 280px; } .statistics-display { gap: 5px; } .statistics-value { min-width: 29px; padding: 4px 6px; } }
@media print { :root, html, body { background: #fff !important; } main { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; } .section, .component { break-inside: avoid; page-break-inside: avoid; } .page-start { break-before: page; page-break-before: always; } .layout-content-page { break-inside: auto; page-break-inside: auto; } .layout-continuation-page { min-height: 9.7in; break-inside: avoid; page-break-inside: avoid; } .layout-workspace { min-height: 9.7in; border: 1px solid #e2e8f0; border-radius: 4px; } .private-watermark { display: block; position: fixed; top: -0.34in; right: 0.08in; z-index: 10; max-width: 3in; color: #9f1239; font-size: 7px; font-weight: 800; line-height: 1.1; opacity: 0.72; pointer-events: none; text-align: right; } main[data-document-audience="student"] .first-instruction { break-inside: auto; page-break-inside: auto; } main[data-document-audience="teacher"] .section { break-inside: auto; page-break-inside: auto; } main[data-document-audience="teacher"] header { border-bottom-width: 2px; margin-bottom: 7px; padding-bottom: 6px; } main[data-document-audience="teacher"] h1 { font-size: 19px; } main[data-document-audience="teacher"] h2 { margin: 8px 0 4px; padding-bottom: 3px; font-size: 14px; } main[data-document-audience="teacher"] h3 { margin: 6px 0 3px; font-size: 10px; } main[data-document-audience="teacher"] p { margin: 2px 0; font-size: 10px; line-height: 1.28; } main[data-document-audience="teacher"] .notice { margin-top: 4px; font-size: 8px; } main[data-document-audience="teacher"] .component { margin: 3px 0; padding: 4px 6px; border-radius: 4px; } main[data-document-audience="teacher"] .component-label { margin-bottom: 2px; font-size: 8px; } main[data-document-audience="teacher"] .teacher { border-left-width: 3px; } main[data-document-audience="teacher"] .reference { border-left-width: 3px; margin: 2px 0; padding: 3px 5px; } main[data-document-audience="teacher"] .reference-grid { grid-template-columns: 5.6em 1fr; gap: 1px 6px; font-size: 9px; line-height: 1.22; } main[data-document-audience="teacher"] .relation-table { margin: 3px 0; font-size: 9px; } main[data-document-audience="teacher"] .relation-table th, main[data-document-audience="teacher"] .relation-table td { padding: 2px 4px; } main[data-document-audience="teacher"] .geometry-diagram { max-width: 210px; margin: 3px auto; } main[data-document-audience="teacher"] .geometry-diagram text { font-size: 10px; } footer { display: none; } }
</style>
</head>
<body>
<div class="private-watermark" aria-hidden="true">${escapeHtml(notice)}</div>
<main data-document-audience="${escapeHtml(options.audience)}" data-layout-target-pages="${escapeHtml(targetPages)}">
<header><h1>${escapeHtml(title)} - ${escapeHtml(audienceTitle)}</h1><p class="notice">${escapeHtml(notice)}</p></header>
${body}
<footer>${escapeHtml(notice)}</footer>
</main>
</body>
</html>`;
}

function renderRelationTable(table, copy) {
  if (table === null) return "";
  const rows = table.independentValues.map(function (independentValue, index) {
    return `<tr><td>${escapeHtml(independentValue)}</td><td>${escapeHtml(table.dependentValues[index])}</td></tr>`;
  }).join("");
  return `<table class="relation-table"><caption>${escapeHtml(copy.relationshipTable)}</caption><thead><tr><th>${escapeHtml(copy.independentVariable)} ${escapeHtml(table.independentSymbol)}</th><th>${escapeHtml(copy.dependentVariable)} ${escapeHtml(table.dependentSymbol)}</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderGeometryDiagram(diagram, copy, identifier) {
  if (diagram === null) return "";
  const safeDiagram = geometryDiagramForModel(diagram);
  assert(
    safeDiagram !== null &&
      typeof identifier === "string" && /^[a-z0-9-]+$/u.test(identifier),
    "PRIVATE_RENDER_GEOMETRY_DIAGRAM_INVALID"
  );
  const titleId = `geometry-${identifier}-title`;
  const baseText = `${copy.baseLabel}: ${safeDiagram.base} ${copy.unitLabel}`;
  const heightValueText = `${safeDiagram.perpendicularHeight} ${copy.unitLabel}`;
  const heightText = `${copy.perpendicularHeightLabel}: ${heightValueText}`;
  return `<figure class="geometry-diagram"><svg viewBox="0 0 410 220" role="img" aria-labelledby="${escapeHtml(titleId)}"><title id="${escapeHtml(titleId)}">${escapeHtml(`${baseText}; ${heightText}`)}</title><path class="triangle-shape" d="M 165 175 L 345 175 L 165 45 Z"></path><path class="right-angle-marker" d="M 165 160 H 180 V 175"></path><line class="extension-line" x1="165" y1="175" x2="165" y2="198"></line><line class="extension-line" x1="345" y1="175" x2="345" y2="198"></line><line class="dimension-line" x1="165" y1="194" x2="345" y2="194"></line><line class="extension-line" x1="165" y1="45" x2="137" y2="45"></line><line class="extension-line" x1="165" y1="175" x2="137" y2="175"></line><line class="dimension-line" x1="142" y1="45" x2="142" y2="175"></line><text x="255" y="214" text-anchor="middle">${escapeHtml(baseText)}</text><text x="10" y="96" text-anchor="start"><tspan x="10" dy="0">${escapeHtml(copy.perpendicularHeightLabel)}</tspan><tspan x="10" dy="17">${escapeHtml(heightValueText)}</tspan></text></svg></figure>`;
}

function renderStatisticsDisplay(display) {
  if (display === null) return "";
  return `<div class="statistics-display" role="list" aria-label="data values">${display.values.map(function (value) {
    return `<span class="statistics-value" role="listitem">${escapeHtml(value)}</span>`;
  }).join("")}</div>`;
}

function renderAllocatedPages(layout, kind, content, copy) {
  assert(layout === null || (Number.isInteger(layout.startPage) && Number.isInteger(layout.endPage) && layout.startPage >= 1 && layout.endPage >= layout.startPage), "PRIVATE_RENDER_LAYOUT_INVALID");
  if (layout === null) return content;
  const pages = [];
  for (let pageNumber = layout.startPage; pageNumber <= layout.endPage; pageNumber += 1) {
    const firstPage = pageNumber === layout.startPage;
    const classes = ["section", "layout-page", firstPage ? "layout-content-page" : "layout-continuation-page"];
    if (pageNumber > 1) classes.push("page-start");
    const pageContent = firstPage
      ? content
      : `<div class="layout-workspace" aria-label="${escapeHtml(copy.workspace)}"></div>`;
    pages.push(`<section class="${classes.join(" ")}" data-layout-kind="${escapeHtml(kind)}" data-layout-page="${escapeHtml(pageNumber)}">${pageContent}</section>`);
  }
  return pages.join("\n");
}

function renderStudentHtml(model, locale) {
  const copy = COPY[locale];
  const body = [
    renderAllocatedPages(
      model.frontMatterLayout,
      "front-matter",
      `<section class="front-matter"><h2>${escapeHtml(copy.learningTarget)}</h2>${textBlock(model.learningTarget)}<h2>${escapeHtml(copy.howToUse)}</h2>${textBlock(model.howToUse)}</section>`,
      copy
    ),
    model.sections.map(function (section, sectionIndex) {
      const components = section.components.map(function (component, componentIndex) {
        const response = renderStudentResponseControl(component.responseMode, copy);
        const relationTable = renderRelationTable(component.relationTable, copy);
        const geometryDiagram = renderGeometryDiagram(component.geometryDiagram, copy, `student-${sectionIndex + 1}-${componentIndex + 1}`);
        const statisticsDisplay = renderStatisticsDisplay(component.statisticsDisplay);
        return `<article class="component"><div class="component-label">${escapeHtml(String(sectionIndex + 1) + "." + String(componentIndex + 1) + " " + component.componentType)}</div>${textBlock(component.content)}${relationTable}${geometryDiagram}${statisticsDisplay}${response}</article>`;
      }).join("\n");
      const sectionClass = sectionIndex === 0 ? "first-instruction" : "";
      return renderAllocatedPages(section.layout, "student-section", `<section class="${sectionClass}"><h2>${escapeHtml(section.title)}</h2>${components}</section>`, copy);
    }).join("\n"),
    renderAllocatedPages(
      model.closingLayout,
      "closing-matter",
      `<section class="closing-matter"><h2>${escapeHtml(copy.closing)}</h2>${textBlock(model.glossary)}${textBlock(model.retentionNotice)}</section>`,
      copy
    )
  ].join("\n");
  const html = documentShell({ locale, title: model.title, audience: model.audience, audienceTitle: copy.studentTitle, notice: copy.privateNotice, body, targetPages: model.targetPages });
  assert(!/(?:teacherReferenceId|teacherArtifacts|answerReferences|expectedResponse|solutionByLocale|uniquenessProofByLocale|arithmeticCheck)/iu.test(html), "PRIVATE_RENDER_STUDENT_HTML_UNSAFE");
  return html;
}

function renderStudentResponseControl(responseMode, copy) {
  if (responseMode === null) return "";
  if (responseMode === "truth-value-exact") {
    return `<div class="response truth-value" role="group" aria-label="${escapeHtml(copy.response)}"><span>${escapeHtml(copy.response)}</span><span class="response-choice"><span class="choice-box" aria-hidden="true"></span>${escapeHtml(copy.truthOptions.holds)}</span><span class="response-choice"><span class="choice-box" aria-hidden="true"></span>${escapeHtml(copy.truthOptions.doesNotHold)}</span></div>`;
  }
  return `<div class="response"><span>${escapeHtml(copy.response)}</span><span class="answer-line" aria-label="${escapeHtml(copy.response)}"></span></div>`;
}

function renderTeacherHtml(model, locale) {
  const copy = COPY[locale];
  const artifacts = model.artifacts.map(function (artifact, artifactIndex) {
    const components = artifact.components.map(function (component) {
      return `<article class="component teacher"><div class="component-label">${escapeHtml(component.componentType)}</div>${textBlock(component.content)}</article>`;
    }).join("\n");
    const segments = artifact.lessonSegments.length > 0
      ? `<h3>${escapeHtml(copy.lessonSegments)}</h3>${artifact.lessonSegments.map(function (segment) { return `<article class="component teacher">${textBlock(segment.instruction)}</article>`; }).join("\n")}`
      : "";
    const references = artifact.references.length > 0
      ? `<h3>${escapeHtml(copy.teacherReference)}</h3>${artifact.references.map(function (reference, referenceIndex) {
        const relationTable = renderRelationTable(reference.relationTable, copy);
        const geometryDiagram = renderGeometryDiagram(reference.geometryDiagram, copy, `teacher-${artifactIndex + 1}-${referenceIndex + 1}`);
        const statisticsDisplay = renderStatisticsDisplay(reference.statisticsDisplay);
        return `<article class="component reference"><div class="reference-grid"><strong>${escapeHtml(copy.prompt)}</strong><span>${escapeHtml(reference.prompt)}</span><strong>${escapeHtml(copy.expectedResponse)}</strong><span>${escapeHtml(reference.expectedResponse)}</span><strong>${escapeHtml(copy.solution)}</strong><span>${escapeHtml(reference.solution)}</span><strong>${escapeHtml(copy.uniqueness)}</strong><span>${escapeHtml(reference.uniqueness)}</span></div>${relationTable}${geometryDiagram}${statisticsDisplay}</article>`;
      }).join("\n")}`
      : "";
    return renderAllocatedPages(artifact.layout, "teacher-artifact", `<section><h2>${escapeHtml(artifact.title)}</h2>${components}${segments}${references}</section>`, copy);
  }).join("\n");
  return documentShell({
    locale,
    title: model.title,
    audience: model.audience,
    audienceTitle: copy.teacherTitle,
    notice: copy.privateNotice,
    body: artifacts,
    targetPages: model.targetPages
  });
}

function assertOutputFileMissing(filePath) {
  try {
    fs.lstatSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    fail("PRIVATE_RENDER_OUTPUT_UNSAFE");
  }
  fail("PRIVATE_RENDER_OUTPUT_EXISTS");
}

function writeOutput(filePath, content) {
  let descriptor;
  let ownsOutput = false;
  try {
    descriptor = fs.openSync(filePath, "wx", 0o600);
    ownsOutput = true;
    fs.writeFileSync(descriptor, content, "utf8");
    fs.closeSync(descriptor);
    descriptor = undefined;
    return true;
  } catch (error) {
    try {
      if (descriptor !== undefined) fs.closeSync(descriptor);
    } catch (_closeError) {
      // The exclusive path is still owned by this invocation and is removed
      // below before the original write failure is surfaced.
    }
    if (ownsOutput) removeGeneratedOutput(filePath);
    throw error;
  }
}

function removeGeneratedOutput(filePath) {
  try {
    const stat = fs.lstatSync(filePath);
    assert(stat.isFile() && !stat.isSymbolicLink(), "PRIVATE_RENDER_PARTIAL_OUTPUT_CLEANUP_FAILED");
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") return;
    if (error && error.code === "PRIVATE_RENDER_PARTIAL_OUTPUT_CLEANUP_FAILED") throw error;
    fail("PRIVATE_RENDER_PARTIAL_OUTPUT_CLEANUP_FAILED");
  }
}

function writeOutputPair(studentPath, studentHtml, teacherPath, teacherHtml, writer) {
  const write = writer || writeOutput;
  let studentWritten = false;
  try {
    studentWritten = write(studentPath, studentHtml) === true;
    assert(studentWritten, "PRIVATE_RENDER_OUTPUT_WRITE_CONTRACT_INVALID");
    write(teacherPath, teacherHtml);
  } catch (error) {
    if (studentWritten) removeGeneratedOutput(studentPath);
    throw error;
  }
}

function renderPrivateWorkbook(options) {
  const privateRoot = path.resolve(options.privateRoot);
  const requestedOutputRoot = path.resolve(options.outputRoot);
  assert(LOCALES.has(options.locale) && /^[a-z0-9-]+$/u.test(options.unitId), "PRIVATE_RENDER_COMMAND_INVALID");
  validator.validateDirectory(privateRoot);
  const outputRoot = assertOutputRoot(privateRoot, requestedOutputRoot);
  const draft = findDraft(privateRoot, options.unitId);
  const student = buildStudentModel(draft, options.locale);
  const teacher = buildTeacherModel(draft, options.locale);
  const fileStem = `${fileSafeUnitId(options.unitId)}-${options.locale}`;
  const studentPath = path.join(outputRoot, `${fileStem}-student.html`);
  const teacherPath = path.join(outputRoot, `${fileStem}-teacher.html`);
  fs.mkdirSync(outputRoot, { recursive: true });
  assert(assertOutputRoot(privateRoot, outputRoot) === outputRoot, "PRIVATE_RENDER_OUTPUT_UNSAFE");
  assertOutputFileMissing(studentPath);
  assertOutputFileMissing(teacherPath);
  writeOutputPair(studentPath, renderStudentHtml(student, options.locale), teacherPath, renderTeacherHtml(teacher, options.locale));
  return Object.freeze({
    studentPath,
    teacherPath,
    sections: student.sections.length,
    studentComponents: student.sections.reduce(function (count, section) { return count + section.components.length; }, 0),
    teacherArtifacts: teacher.artifacts.length
  });
}

function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = renderPrivateWorkbook(options);
    process.stdout.write(`PRIVATE_WORKBOOK_RENDER_OK unit=${options.unitId} locale=${options.locale} sections=${result.sections} studentComponents=${result.studentComponents} teacherArtifacts=${result.teacherArtifacts} state=${PRIVATE_DRAFT_STATE}\n`);
  } catch (error) {
    process.stderr.write(`PRIVATE_WORKBOOK_RENDER_FAILED code=${error && error.code ? error.code : "UNEXPECTED_RENDERER_ERROR"}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) main();

module.exports = Object.freeze({
  COPY,
  PRIVATE_RENDER_DRAFT_FILE_NAME,
  assertExternalDirectory,
  assertOutputRoot,
  buildStudentModel,
  buildTeacherModel,
  draftFileEntries,
  findDraft,
  parseArguments,
  relationTableForModel,
  geometryDiagramForModel,
  statisticsDisplayForModel,
  fixedPageLayout,
  layoutForId,
  renderRelationTable,
  renderGeometryDiagram,
  renderStatisticsDisplay,
  renderAllocatedPages,
  renderStudentResponseControl,
  renderStudentHtml,
  renderTeacherHtml,
  renderPrivateWorkbook,
  selectDraftForUnit,
  writeOutput,
  writeOutputPair
});
