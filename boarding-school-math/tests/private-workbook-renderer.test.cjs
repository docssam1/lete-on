const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const renderer = require("../scripts/render-private-grade6-workbook.cjs");

function localized(ko, en, zhHans) {
  return { ko, en, "zh-Hans": zhHans };
}

function syntheticDraft(responseMode) {
  return {
    unitId: "ccss-6-ee-b",
    frontMatter: {
      titleByLocale: localized("학생 제목", "Student title", "学生标题"),
      learningTargetsByLocale: localized("학습 목표", "Learning target", "学习目标"),
      howToUseByLocale: localized("사용 방법", "How to use", "使用方法")
    },
    closingMatter: {
      glossaryByLocale: localized("용어", "Glossary", "术语"),
      retentionNoticeByLocale: localized("복습", "Review", "复习")
    },
    layoutPlan: {
      studentTargetPages: 3,
      teacherTargetPages: 1
    },
    studentSections: [{
      titleByLocale: localized("연습", "Practice", "练习"),
      components: [{
        componentId: "student-component-1",
        componentType: "guided-check",
        responseMode: responseMode || "numeric-exact",
        teacherReferenceId: "teacher-reference-sentinel",
        contentByLocale: localized("학생 전용 문항", "student-safe-sentinel", "学生专用题目")
      }]
    }],
    teacherArtifacts: [{
      titleByLocale: localized("교사용", "teacher-title-sentinel", "教师用"),
      components: [{
        componentType: "solution-structure",
        contentByLocale: localized("교사용 풀이", "teacher-component-sentinel", "教师解析")
      }],
      lessonSegments: [{ instructionByLocale: localized("교사용 수업", "teacher-segment-sentinel", "教师课堂") }],
      answerReferences: [{
        componentId: "student-component-1",
        expectedResponse: "teacher-answer-sentinel",
        solutionByLocale: localized("교사 해설", "teacher-solution-sentinel", "教师解答"),
        uniquenessProofByLocale: localized("교사 검산", "teacher-proof-sentinel", "教师核验")
      }]
    }]
  };
}

test("private renderer keeps the student model structurally free of teacher and answer fields", function () {
  const student = renderer.buildStudentModel(syntheticDraft(), "en");
  const serialized = JSON.stringify(student);
  assert.match(serialized, /student-safe-sentinel/);
  assert.doesNotMatch(serialized, /teacher-(?:reference|title|component|segment|answer|solution|proof)-sentinel/);
  assert.doesNotMatch(serialized, /expectedResponse|teacherReferenceId|answerReferences|solutionByLocale|uniquenessProofByLocale/);
  const html = renderer.renderStudentHtml(student, "en");
  assert.match(html, /data-document-audience="student"/);
  assert.match(html, /data-layout-target-pages="3"/);
  assert.match(html, /class="private-watermark"/);
  assert.match(html, /@media print[\s\S]*?\.private-watermark\s*\{[^}]*position:\s*fixed/u);
  assert.match(html, /\.private-watermark\s*\{[^}]*top:\s*-0\.34in;\s*right:\s*0\.08in;[^}]*pointer-events:\s*none;/u);
  assert.match(html, /student-safe-sentinel/);
  assert.match(html, /<section class="section first-instruction"><h2>Practice<\/h2>/);
  assert.doesNotMatch(html, /<section class="section page-start"><h2>Practice<\/h2>/);
  assert.match(html, /main\[data-document-audience="student"\]\s+\.first-instruction\s*\{\s*break-inside:\s*auto;\s*page-break-inside:\s*auto;/u);
  assert.doesNotMatch(html, /teacher-(?:reference|title|component|segment|answer|solution|proof)-sentinel/);
  assert.doesNotMatch(html, /teacherReferenceId|answerReferences|expectedResponse|solutionByLocale|uniquenessProofByLocale|arithmeticCheck/);
  assert.doesNotMatch(html, /value="[^"]+"/);
});

test("private renderer keeps teacher-only content out of student output and includes it only in teacher output", function () {
  const draft = syntheticDraft();
  const teacher = renderer.buildTeacherModel(draft, "en");
  const html = renderer.renderTeacherHtml(teacher, "en");
  assert.match(html, /data-document-audience="teacher"/);
  assert.match(html, /data-layout-target-pages="1"/);
  assert.match(html, /class="private-watermark"/);
  assert.match(html, /@media print[\s\S]*?\.private-watermark\s*\{[^}]*position:\s*fixed/u);
  assert.match(html, /\.private-watermark\s*\{[^}]*top:\s*-0\.34in;\s*right:\s*0\.08in;[^}]*pointer-events:\s*none;/u);
  assert.match(html, /main\[data-document-audience="teacher"\]\s+\.section\s*\{\s*break-inside:\s*auto;\s*page-break-inside:\s*auto;/u);
  assert.match(html, /student-safe-sentinel/);
  [
    "teacher-title-sentinel",
    "teacher-component-sentinel",
    "teacher-segment-sentinel",
    "teacher-answer-sentinel",
    "teacher-solution-sentinel",
    "teacher-proof-sentinel"
  ].forEach(function (sentinel) {
    assert.match(html, new RegExp(sentinel));
  });
});

test("truth-value responses render two unselected student choices without answer-bearing form values", function () {
  const student = renderer.buildStudentModel(syntheticDraft("truth-value-exact"), "en");
  const html = renderer.renderStudentHtml(student, "en");
  assert.match(html, /class="response truth-value"/);
  assert.match(html, />Holds</);
  assert.match(html, />Does not hold</);
  assert.doesNotMatch(html, /<input\b|\bchecked\b|\bvalue=/iu);
  assert.doesNotMatch(html, /class="answer-line"/);
});

test("private renderer renders a safe two-variable relation table without teacher answer fields", function () {
  const draft = syntheticDraft();
  draft.studentSections[0].components[0].relationTable = {
    form: "y-equals-rate-times-x",
    independentSymbol: "x",
    dependentSymbol: "y",
    independentValues: [0, 13, 14],
    dependentValues: [0, 26, 28]
  };
  const student = renderer.buildStudentModel(draft, "en");
  const studentHtml = renderer.renderStudentHtml(student, "en");
  assert.match(studentHtml, /class="relation-table"/);
  assert.match(studentHtml, />Independent variable x</);
  assert.match(studentHtml, />Dependent variable y</);
  assert.doesNotMatch(studentHtml, /teacher-(?:reference|title|component|segment|answer|solution|proof)-sentinel/);
  const teacherHtml = renderer.renderTeacherHtml(renderer.buildTeacherModel(draft, "en"), "en");
  assert.match(teacherHtml, /class="relation-table"/);
  assert.match(teacherHtml, /teacher-answer-sentinel/);
});

test("private renderer constructs a labeled right-triangle SVG only from semantic diagram fields", function () {
  const draft = syntheticDraft();
  draft.studentSections[0].components[0].geometryDiagram = {
    kind: "right-triangle-labeled-base-perpendicular-height-v1",
    base: 8,
    perpendicularHeight: 6,
    heightFoot: "left-base-endpoint"
  };
  const student = renderer.buildStudentModel(draft, "en");
  const studentHtml = renderer.renderStudentHtml(student, "en");
  assert.match(studentHtml, /class="geometry-diagram"/);
  assert.match(studentHtml, /role="img"/);
  assert.match(studentHtml, /class="right-angle-marker"/);
  assert.match(studentHtml, />Base: 8 units</);
  assert.match(studentHtml, />Perpendicular height</);
  assert.match(studentHtml, />6 units</);
  assert.doesNotMatch(studentHtml, /(?:foreignObject|<script\b|\shref=|\son[a-z]+\s*=)/iu);
  assert.doesNotMatch(studentHtml, /teacher-(?:reference|title|component|segment|answer|solution|proof)-sentinel/);

  const teacher = renderer.buildTeacherModel(draft, "en");
  const teacherHtml = renderer.renderTeacherHtml(teacher, "en");
  assert.match(teacherHtml, /class="geometry-diagram"/);
  assert.match(teacherHtml, /class="right-angle-marker"/);
  assert.match(teacherHtml, /teacher-answer-sentinel/);
  assert.equal(renderer.geometryDiagramForModel(undefined), null);
  [
    {
      kind: "right-triangle-labeled-base-perpendicular-height-v1",
      base: 8,
      perpendicularHeight: 6,
      heightFoot: "left-base-endpoint",
      svg: "<svg></svg>"
    },
    {
      kind: "right-triangle-labeled-base-perpendicular-height-v1",
      base: 3,
      perpendicularHeight: 6,
      heightFoot: "left-base-endpoint"
    },
    {
      kind: "right-triangle-labeled-base-perpendicular-height-v1",
      base: 5,
      perpendicularHeight: 5,
      heightFoot: "left-base-endpoint"
    }
  ].forEach(function (diagram) {
    assert.throws(function () {
      renderer.geometryDiagramForModel(diagram);
    }, /PRIVATE_RENDER_GEOMETRY_DIAGRAM_INVALID/);
  });
});

test("renderer command requires one explicit external root, unit, locale, and output root", function () {
  const privateRoot = path.resolve(os.tmpdir(), "gfield-private-authoring");
  const outputRoot = path.resolve(os.tmpdir(), "gfield-private-output");
  assert.deepEqual(
    renderer.parseArguments([
      "--root", privateRoot,
      "--unit", "ccss-6-ee-b",
      "--locale", "ko",
      "--output", outputRoot
    ]),
    {
      privateRoot,
      unitId: "ccss-6-ee-b",
      locale: "ko",
      outputRoot
    }
  );
  assert.throws(function () {
    renderer.parseArguments(["--root", privateRoot]);
  }, /PRIVATE_RENDER_COMMAND_INVALID/);
});

test("renderer rejects output roots inside any Git-marked directory and unsafe existing path entries", function () {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-renderer-"));
  try {
    const privateRoot = path.join(tempRoot, "private-authoring");
    const gitRoot = path.join(tempRoot, "git-marked");
    const gitSubdirectory = path.join(gitRoot, "tracked-subdirectory");
    const gitJunction = path.join(tempRoot, "junction-to-git-subdirectory");
    const unsafeFile = path.join(tempRoot, "not-a-directory");
    fs.mkdirSync(privateRoot);
    fs.mkdirSync(gitSubdirectory, { recursive: true });
    fs.writeFileSync(path.join(gitRoot, ".git"), "gitdir: synthetic\n", "utf8");
    fs.writeFileSync(unsafeFile, "synthetic", "utf8");
    assert.throws(function () {
      renderer.assertOutputRoot(privateRoot, path.join(gitRoot, "private-output"));
    }, /PRIVATE_RENDER_OUTPUT_INSIDE_GIT/);
    assert.throws(function () {
      renderer.assertOutputRoot(privateRoot, path.join(unsafeFile, "private-output"));
    }, /PRIVATE_RENDER_OUTPUT_UNSAFE/);
    try {
      fs.symlinkSync(gitSubdirectory, gitJunction, "junction");
      assert.throws(function () {
        renderer.assertOutputRoot(privateRoot, path.join(gitJunction, "private-output"));
      }, /PRIVATE_RENDER_OUTPUT_UNSAFE/);
    } catch (error) {
      if (!error || !["EPERM", "EACCES", "ENOTSUP"].includes(error.code)) throw error;
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("renderer removes only its student output if the paired teacher output write fails", function () {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-renderer-pair-"));
  const studentPath = path.join(tempRoot, "student.html");
  const teacherPath = path.join(tempRoot, "teacher.html");
  try {
    fs.writeFileSync(teacherPath, "other invocation", "utf8");
    assert.throws(function () {
      renderer.writeOutputPair(studentPath, "student", teacherPath, "teacher", function (filePath, content) {
        if (filePath === teacherPath) {
          const error = new Error("synthetic teacher write failure");
          error.code = "EEXIST";
          throw error;
        }
        fs.writeFileSync(filePath, content, "utf8");
        return true;
      });
    }, /synthetic teacher write failure/);
    assert.equal(fs.existsSync(studentPath), false);
    assert.equal(fs.readFileSync(teacherPath, "utf8"), "other invocation");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("renderer never replaces an existing output owned by another invocation", function () {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-renderer-exclusive-"));
  const outputPath = path.join(tempRoot, "teacher.html");
  try {
    fs.writeFileSync(outputPath, "other invocation", "utf8");
    assert.throws(function () {
      renderer.writeOutput(outputPath, "new output");
    }, function (error) {
      return error && error.code === "EEXIST";
    });
    assert.equal(fs.readFileSync(outputPath, "utf8"), "other invocation");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
