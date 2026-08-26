const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const repositoryRoot = path.resolve(projectRoot, "..");
const validator = require("../scripts/validate-private-grade6-workbook.cjs");
const publicAudit = require("../scripts/audit-public-exposure.cjs");
const resourcePlans = require("../resources/k8-resource-plan.js");

function writeFixtureFile(root, relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, "utf8");
}

function runFixtureGit(root, argumentsList) {
  return execFileSync("git", argumentsList, { cwd: root, encoding: "utf8" });
}

function createTempGitRepository() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-public-audit-"));
  assert.notEqual(path.resolve(root), repositoryRoot);
  runFixtureGit(root, ["init", "--quiet"]);
  runFixtureGit(root, ["config", "core.autocrlf", "false"]);
  runFixtureGit(root, ["config", "user.name", "GFIELD Test"]);
  runFixtureGit(root, ["config", "user.email", "gfield-test@example.invalid"]);
  writeFixtureFile(root, "README.md", "fixture\n");
  runFixtureGit(root, ["add", "--", "README.md"]);
  runFixtureGit(root, ["commit", "--quiet", "-m", "fixture baseline"]);
  return root;
}

function commitAllFixtureFiles(root, message) {
  runFixtureGit(root, ["add", "--all"]);
  runFixtureGit(root, ["commit", "--quiet", "-m", message]);
}

function hasFinding(findings, code) {
  return findings.some(function (finding) { return finding.code === code; });
}

function localText(ko, en, zhHans) {
  return { ko, en, "zh-Hans": zhHans };
}

function localBinding(resource) {
  return {
    resourcePlanItemId: resource.resourcePlanItemId,
    courseId: resource.courseId,
    unitId: resource.unitId,
    skillId: resource.skillId,
    sessionId: resource.sessionId,
    audience: resource.audience,
    levelId: resource.levelId,
    testType: resource.testType,
    resourceType: resource.resourceType,
    bindingState: "candidate-not-public-bound"
  };
}

function syntheticWorkbookPack() {
  const plan = resourcePlans.buildUnitPlan("ccss-6-rp-a");
  const studentResources = plan.resourcesByAudience.student.filter(function (resource) {
    return resource.testType === "guided-practice" && ["concept-workbook", "guided-practice", "homework"].includes(resource.resourceType);
  });
  const teacherResources = plan.resourcesByAudience.teacher.filter(function (resource) {
    return new Set(studentResources.map(function (resource) { return resource.sessionId; })).has(resource.sessionId) &&
      ["lesson-plan", "solution-guide", "assignment-builder", "answer-key"].includes(resource.resourceType);
  });
  const responseComponents = [];
  let componentNumber = 0;
  const studentSections = studentResources.map(function (resource, sectionIndex) {
    const components = resource.plannedComponents.flatMap(function (planComponent) {
      return Array.from({ length: planComponent.plannedCount }, function () {
        componentNumber += 1;
        const isTeaching = ["concept-summary", "worked-example"].includes(planComponent.componentType);
        const componentId = `cmp-dft-s${String(sectionIndex + 1).padStart(2, "0")}c${String(componentNumber).padStart(3, "0")}`;
        const component = {
          componentId,
          componentType: planComponent.componentType,
          sequence: 0,
          contentByLocale: isTeaching
            ? localText("개념 예시: \\frac{1}{2}", "Worked example: \\frac{1}{2}", "示例：\\frac{1}{2}" )
            : localText("수를 구하세요.", "Find the number.", "求这个数。"),
          responseMode: isTeaching ? null : "numeric-exact",
          teacherReferenceId: isTeaching ? null : `ref-dft-r${String(componentNumber).padStart(3, "0")}`
        };
        if (!isTeaching) responseComponents.push({ component, resource });
        return component;
      });
    }).map(function (component, index) { return Object.assign(component, { sequence: index + 1 }); });
    return {
      sectionId: `sct-dft-s${String(sectionIndex + 1).padStart(3, "0")}`,
      sectionVersion: 1,
      audience: "student",
      titleByLocale: localText("학생 자료", "Student material", "学生资料"),
      resourceBinding: localBinding(resource),
      productionState: "local-draft-no-pdf-or-download",
      components
    };
  });
  const teacherArtifacts = teacherResources.map(function (resource, artifactIndex) {
    const components = resource.plannedComponents.flatMap(function (planComponent) {
      return Array.from({ length: planComponent.plannedCount }, function (_, componentIndex) {
        return {
          componentId: `tcmp-dft-a${String(artifactIndex + 1).padStart(2, "0")}c${String(componentIndex + 1).padStart(3, "0")}`,
          componentType: planComponent.componentType,
          sequence: componentIndex + 1,
          contentByLocale: localText("교사용 메타데이터", "Teacher metadata", "教师元数据")
        };
      });
    });
    const answerReferences = resource.resourceType === "assignment-builder" ? [] : responseComponents
      .filter(function (entry) { return entry.resource.sessionId === resource.sessionId; })
      .map(function (entry) {
        return {
          referenceId: entry.component.teacherReferenceId,
          componentId: entry.component.componentId,
          responseMode: "numeric-exact",
          expectedResponse: "1",
          solutionByLocale: localText("교사용 풀이", "Teacher solution", "教师解析"),
          uniquenessProofByLocale: localText("교사용 검산", "Teacher check", "教师检验"),
          arithmeticCheck: { kind: "whole-quotient", total: 1, groups: 1 }
        };
      });
    return {
      artifactId: `art-dft-a${String(artifactIndex + 1).padStart(3, "0")}`,
      artifactVersion: 1,
      audience: "teacher",
      titleByLocale: localText("교사용 자료", "Teacher material", "教师资料"),
      resourceBinding: localBinding(resource),
      productionState: "local-draft-no-pdf-or-download",
      components,
      lessonSegments: resource.resourceType === "lesson-plan" ? [1, 2, 3, 4, 5].map(function (sequence) {
        return {
          segmentId: `seg-dft-a${String(artifactIndex + 1).padStart(2, "0")}s${sequence}`,
          sequence,
          minutes: 15,
          instructionByLocale: localText("수업 단계", "Lesson step", "教学步骤")
        };
      }) : [],
      answerReferences
    };
  });
  return {
    schemaVersion: "gfield-private-workbook-draft-v1",
    confidentiality: "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT",
    packId: "wbk-dft-synthetic-pack",
    packVersion: 1,
    programId: "us-core-k8",
    targetGrade: 6,
    unitId: "ccss-6-rp-a",
    clusterId: "6.RP.A",
    skillId: "skill:us-core-k8:6-rp-a:anchor",
    resourcePlanId: plan.planId,
    cadenceProfileId: resourcePlans.GRADE6_CADENCE.cadenceProfileId,
    state: "draft-pending-independent-review",
    coverageState: "plan-complete",
    deliveryState: "locked",
    localePolicy: { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] },
    frontMatter: {
      titleByLocale: localText("제목", "Title", "标题"),
      learningTargetsByLocale: localText("목표", "Goal", "目标"),
      howToUseByLocale: localText("사용법", "How to use", "使用方法")
    },
    studentSections,
    teacherArtifacts,
    homeStudyPlan: Array.from({ length: 6 }, function (_, index) {
      return {
        blockId: `hbk-dft-h${String(index + 1).padStart(3, "0")}`,
        week: Math.floor(index / 2) + 1,
        sequence: index + 1,
        minutes: 30,
        componentIds: responseComponents.slice(index * 2, index * 2 + 2).map(function (entry) { return entry.component.componentId; })
      };
    }),
    assessmentPlaceholders: plan.resourcesByAudience.student.filter(function (resource) {
      return resource.signedItemRequired && ["quiz", "test"].includes(resource.resourceType);
    }).map(function (resource) {
      return {
        resourcePlanItemId: resource.resourcePlanItemId,
        sessionId: resource.sessionId,
        levelId: resource.levelId,
        testType: resource.testType,
        resourceType: resource.resourceType,
        status: "not-authored-in-workbook-pack"
      };
    }),
    closingMatter: {
      glossaryByLocale: localText("용어", "Glossary", "术语"),
      retentionNoticeByLocale: localText("유지 안내", "Retention notice", "保持提示")
    },
    rightsDraft: {
      mode: "owned_original",
      originType: "gfield-authored",
      authority: "GFIELD",
      translationAllowed: true,
      derivativeAllowed: true,
      externalSourceUsed: false,
      contestWordingUsed: false,
      decision: "pending-independent-review"
    },
    verification: {
      authorMathCheck: "complete-not-independent",
      authorTranslationCheck: "complete-not-independent",
      authorRightsCheck: "complete-not-independent",
      requiredReviews: ["math-correctness", "age-appropriateness", "answer-uniqueness", "translation-ko", "translation-en", "translation-zh-Hans", "rights"],
      releaseState: "not-eligible"
    },
    layoutPlan: {
      studentTargetPages: 9,
      teacherTargetPages: teacherArtifacts.length,
      frontMatterPages: 1,
      closingPages: 1,
      studentSectionLayouts: studentSections.map(function (section, index) {
        return { id: section.sectionId, startPage: index + 2, endPage: index + 2 };
      }),
      teacherArtifactLayouts: teacherArtifacts.map(function (artifact, index) {
        return { id: artifact.artifactId, startPage: index + 1, endPage: index + 1 };
      })
    }
  };
}

test("private workbook authoring requires an external JSON-only root and is never tracked", function () {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
  const ignoreRules = fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8");
  const validatorSource = fs.readFileSync(path.join(projectRoot, "scripts", "validate-private-grade6-workbook.cjs"), "utf8");
  const publicAuditSource = fs.readFileSync(path.join(projectRoot, "scripts", "audit-public-exposure.cjs"), "utf8");

  assert.match(ignoreRules, /^private-workbook-authoring\/\s*$/m);
  assert.equal(packageJson.scripts["validate:private-grade6-workbook"], "node scripts/validate-private-grade6-workbook.cjs");
  assert.match(validatorSource, /GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT/);
  assert.match(validatorSource, /PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY/);
  assert.match(validatorSource, /PRIVATE_WORKBOOK_ROOT_INSIDE_GIT_WORKTREE/);
  assert.match(validatorSource, /PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI/);
  assert.match(validatorSource, /workbook-draft\\\.json/);
  assert.match(validatorSource, /TEACHING_COMPONENT_TYPES/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_AUTHORING_TRACKED/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_HISTORY_PRESENT/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_MARKER_TRACKED/);
  assert.match(publicAuditSource, /--cached/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT/);
  assert.match(publicAuditSource, /--is-shallow-repository/);
  assert.match(publicAuditSource, /PRIVATE_WORKBOOK_HISTORY_INCOMPLETE/);

  const tracked = execFileSync(
    "git",
    ["ls-files", "-z", "--", "boarding-school-math/private-workbook-authoring"],
    { cwd: repositoryRoot, encoding: "utf8" }
  );
  assert.equal(tracked, "");
  assert.throws(function () {
    validator.validateDirectory(projectRoot);
  }, /PRIVATE_WORKBOOK_ROOT_INSIDE_REPOSITORY/);
});

test("student answer disclosures fail closed without treating a condition number as an answer", function () {
  const blocked = [
    ["Find the result of 7 + 0.", "7"],
    ["결과： 7", "7"],
    ["Result: \\boxed{7}", "7"],
    ["结果 = 7", "7"],
    ["Result - 7", "7"],
    ["结果—7", "7"],
    ["Answer → 7", "7"],
    ["Answer ➜ 7", "7"],
    ["Result • 7", "7"],
    ["结果−7", "7"],
    ["Answer 7:11", "7:11"],
    ["Answer 7 : 11", "7:11"],
    ["Answer 7 ∶ 11", "7:11"],
    ["Answer 7 ⋮ 11", "7:11"],
    ["Answer\u200B7", "7"],
    ["Result\u20607", "7"],
    ["结果\u200e7", "7"],
    ["Answer\u00077", "7"],
    ["Answer\u034F7", "7"],
    ["Answer\uFE0F7", "7"],
    ["Answer \\to 7", "7"],
    ["Answer \\quad 7", "7"],
    ["$\\text{Answer}\\quad 7$", "7"],
    ["$\\mathrm{An\\!swer}\\quad 7$", "7"],
    ["$\\mathit{An}\\mathrm{swer}\\quad 7$", "7"],
    ["An\\,swer: 7", "7"],
    ["Answer 7\u200B:\u200B11", "7:11"],
    ["Answer 7\u034F:11", "7:11"],
    ["Answer 7\\colon 11", "7:11"],
    ["Answer 7\\mathbin{:}11", "7:11"],
    ["정답은 4:7", "4:7"]
  ];
  blocked.forEach(function (entry) {
    assert.throws(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    }, /STUDENT_ANSWER_LEAK/);
  });
  [
    ["The condition gives 117 as an input value.", "17"]
  ].forEach(function (entry) {
    assert.doesNotThrow(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    });
  });
});

test("response-bearing student content rejects unparsed TeX commands", function () {
  [
    "An\\kern0pt swer: 7",
    "Re\\mkern0mu sult: 7",
    "Sol\\hspace{0pt}ution: 7",
    "An\\color{red}swer: 7",
    "An\\phantom{x}swer: 7",
    "결\\kern0pt 과: 7",
    "结\\hspace{0pt}果: 7"
  ].forEach(function (content) {
    assert.throws(function () {
      validator.assertStudentContentDoesNotRevealAnswer(content, "7", "synthetic-tex");
    }, /STUDENT_TEX_UNSUPPORTED/);
  });
  assert.doesNotThrow(function () {
    validator.assertStudentContentDoesNotRevealAnswer("Find the number in the model.", "7", "synthetic-plain");
  });
});

test("response-bearing student content rejects markup, entities, and cross-script label lookalikes", function () {
  [
    "An<em></em>swer: 7",
    "An&#115;wer: 7",
    "An&#115wer: 7",
    "An&#x73wer: 7",
    "An&Tab;swer: 7",
    "An＆#115wer: 7",
    "An＜em＞＜/em＞swer: 7"
  ].forEach(function (content) {
    assert.throws(function () {
      validator.assertStudentContentDoesNotRevealAnswer(content, "7", "synthetic-markup", "en");
    }, /STUDENT_MARKUP_UNSUPPORTED/);
  });
  assert.throws(function () {
    validator.assertStudentContentDoesNotRevealAnswer("Аnswer: 7", "7", "synthetic-confusable", "en");
  }, /STUDENT_CHARACTER_UNSUPPORTED/);
  assert.throws(function () {
    validator.assertStudentContentDoesNotRevealAnswer("An＼kern0ptswer: 7", "7", "synthetic-compatibility-tex", "en");
  }, /STUDENT_TEX_UNSUPPORTED/);
  assert.doesNotThrow(function () {
    validator.assertResponseStudentTextSyntax("분수 3/4를 2개로 나누세요.", "ko", "synthetic-ko");
    validator.assertResponseStudentTextSyntax("把 3/4 分成 2 份。", "zh-Hans", "synthetic-zh");
  });
});

test("full workbook preflight keeps TeX in worked examples but blocks markup in response components", function () {
  const pack = syntheticWorkbookPack();
  assert.doesNotThrow(function () { validator.validatePack(pack, "synthetic-workbook.json"); });
  const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  responseComponent.contentByLocale.en = "An<em></em>swer: 1";
  assert.throws(function () { validator.validatePack(pack, "synthetic-workbook.json"); }, /STUDENT_MARKUP_UNSUPPORTED/);
});

test("worked examples admit only the reviewed mathematical TeX subset", function () {
  const pack = syntheticWorkbookPack();
  const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode === null;
  });
  workedExample.contentByLocale.en = "$\\boxed{\\displaystyle \\sqrt{\\frac{1}{2}} \\times 3}$";
  assert.doesNotThrow(function () { validator.validatePack(pack, "synthetic-workbook.json"); });
});

test("student-visible metadata, worked examples, and response identifiers cannot carry answer labels", function () {
  const mutations = [
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        pack.frontMatter.titleByLocale.en = "Answer: 1";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        pack.frontMatter.titleByLocale["zh-Hans"] = "答：0";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        pack.studentSections[0].titleByLocale.en = "Answer: 1";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "Answer: 1";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "Ans: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\color{red}swer: 1";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\unicode{x73}wer: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\vphantom{x}swer: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\hphantom{x}swer: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\rlap{x}swer: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\char123swer: 0";
      }
    },
    {
      expected: /STUDENT_TEX_UNSUPPORTED/,
      apply: function (pack) {
        const workedExample = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode === null;
        });
        workedExample.contentByLocale.en = "An\\!swer: 0";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode !== null;
        });
        responseComponent.componentId = "cmp-dft-answer-1";
      }
    },
    {
      expected: /STUDENT_ANSWER_LEAK/,
      apply: function (pack) {
        const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
          return component.responseMode !== null;
        });
        responseComponent.teacherReferenceId = "ref-dft-answer-1";
      }
    }
  ];
  mutations.forEach(function (mutation) {
    const pack = syntheticWorkbookPack();
    mutation.apply(pack);
    assert.throws(function () {
      validator.validatePack(pack, "synthetic-workbook.json");
    }, mutation.expected);
  });
});

test("fraction-division checks reduce rational quotients exactly without floating-point arithmetic", function () {
  assert.equal(validator.canonicalAnswer({
    kind: "rational-quotient",
    dividendNumerator: 15,
    dividendDenominator: 4,
    divisorNumerator: 3,
    divisorDenominator: 5
  }, "synthetic-rational"), "25/4");
  assert.equal(validator.canonicalAnswer({
    kind: "rational-quotient",
    dividendNumerator: 0,
    dividendDenominator: 9,
    divisorNumerator: 7,
    divisorDenominator: 11
  }, "synthetic-zero"), "0");
  assert.equal(validator.canonicalAnswer({
    kind: "rational-quotient",
    dividendNumerator: 14,
    dividendDenominator: 15,
    divisorNumerator: 21,
    divisorDenominator: 20
  }, "synthetic-reduced"), "8/9");
  assert.equal(validator.canonicalAnswer({
    kind: "rational-quotient",
    dividendNumerator: 999999937,
    dividendDenominator: 999999929,
    divisorNumerator: 1,
    divisorDenominator: 999999893
  }, "synthetic-large"), "999999830000006741/999999929");
  assert.throws(function () {
    validator.canonicalAnswer({
      kind: "rational-quotient",
      dividendNumerator: 1,
      dividendDenominator: 2,
      divisorNumerator: 0,
      divisorDenominator: 3
    }, "synthetic-invalid");
  }, /ARITHMETIC_CHECK_INVALID/);
  assert.throws(function () {
    validator.canonicalAnswer({
      kind: "rational-quotient",
      dividendNumerator: -1,
      dividendDenominator: 2,
      divisorNumerator: 3,
      divisorDenominator: 4
    }, "synthetic-negative");
  }, /ARITHMETIC_CHECK_INVALID/);
  assert.throws(function () {
    validator.canonicalAnswer({
      kind: "rational-quotient",
      dividendNumerator: 1,
      dividendDenominator: 2,
      divisorNumerator: 3,
      divisorDenominator: 4,
      answer: "7"
    }, "synthetic-extra-key");
  }, /ARITHMETIC_CHECK_INVALID/);
});

test("public audit checks staged index and all marker history without touching this repository", function () {
  const stagedRoot = createTempGitRepository();
  const historyRoot = createTempGitRepository();
  const shallowRoot = createTempGitRepository();
  try {
    writeFixtureFile(stagedRoot, "archive/draft.json", publicAudit.confidentialityMarker);
    runFixtureGit(stagedRoot, ["add", "--", "archive/draft.json"]);
    writeFixtureFile(stagedRoot, "archive/draft.json", "working-tree marker removed\n");
    const stagedFindings = publicAudit.collectFindings(stagedRoot);
    assert.equal(hasFinding(stagedFindings, "PRIVATE_WORKBOOK_MARKER_TRACKED"), true);
    assert.equal(hasFinding(stagedFindings, "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT"), false);

    writeFixtureFile(historyRoot, "archive/deleted-draft.json", publicAudit.confidentialityMarker);
    commitAllFixtureFiles(historyRoot, "add private marker fixture");
    fs.rmSync(path.join(historyRoot, "archive", "deleted-draft.json"));
    commitAllFixtureFiles(historyRoot, "remove private marker fixture");
    const historyFindings = publicAudit.collectFindings(historyRoot);
    assert.equal(hasFinding(historyFindings, "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT"), true);

    const shallowFindings = publicAudit.collectFindings(shallowRoot, function (root, argumentsList) {
      if (argumentsList[0] === "rev-parse" && argumentsList[1] === "--is-shallow-repository") {
        return { status: 0, stdout: "true\n" };
      }
      return spawnSync("git", argumentsList, { cwd: root, encoding: "utf8" });
    });
    assert.equal(hasFinding(shallowFindings, "PRIVATE_WORKBOOK_HISTORY_INCOMPLETE"), true);
  } finally {
    fs.rmSync(stagedRoot, { recursive: true, force: true });
    fs.rmSync(historyRoot, { recursive: true, force: true });
    fs.rmSync(shallowRoot, { recursive: true, force: true });
  }
});

test("private workbook preflight rejects CI, non-JSON files, and a nested junction path", function () {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "gfield-private-workbook-"));
  try {
    const nonJsonRoot = path.join(tempRoot, "non-json");
    fs.mkdirSync(nonJsonRoot);
    fs.writeFileSync(path.join(nonJsonRoot, "note.txt"), "x", "utf8");
    assert.throws(function () {
      validator.validateDirectory(nonJsonRoot);
    }, /PRIVATE_WORKBOOK_FILE_NAME_INVALID/);

    const originalCi = process.env.CI;
    process.env.CI = "1";
    try {
      assert.throws(function () {
        validator.validateDirectory(nonJsonRoot);
      }, /PRIVATE_WORKBOOK_PREFLIGHT_BLOCKED_IN_CI/);
    } finally {
      if (originalCi == null) delete process.env.CI;
      else process.env.CI = originalCi;
    }

    const targetRoot = path.join(tempRoot, "target", "drafts");
    fs.mkdirSync(targetRoot, { recursive: true });
    const junctionRoot = path.join(tempRoot, "junction");
    fs.symlinkSync(path.join(tempRoot, "target"), junctionRoot, "junction");
    assert.throws(function () {
      validator.validateDirectory(path.join(junctionRoot, "drafts"));
    }, /PRIVATE_WORKBOOK_ROOT_UNSAFE/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("private workbook preflight rejects an external root inside a Git-discoverable worktree", function () {
  const worktreeRoot = createTempGitRepository();
  try {
    const draftRoot = path.join(worktreeRoot, "private-workbook-authoring");
    fs.mkdirSync(draftRoot);
    assert.throws(function () {
      validator.validateDirectory(draftRoot);
    }, /PRIVATE_WORKBOOK_ROOT_INSIDE_GIT_WORKTREE/);
  } finally {
    fs.rmSync(worktreeRoot, { recursive: true, force: true });
  }
});
