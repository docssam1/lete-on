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

function independentlyReducedSignedRational(numerator, denominator) {
  assert(Number.isInteger(numerator) && Number.isInteger(denominator) && denominator > 0);
  if (numerator === 0) return "0";
  const sign = numerator < 0 ? "-" : "";
  const magnitude = Math.abs(numerator);
  let divisor = 1;
  for (let candidate = 2; candidate <= Math.min(magnitude, denominator); candidate += 1) {
    if (magnitude % candidate === 0 && denominator % candidate === 0) divisor = candidate;
  }
  const reducedNumerator = magnitude / divisor;
  const reducedDenominator = denominator / divisor;
  return `${sign}${reducedDenominator === 1 ? reducedNumerator : `${reducedNumerator}/${reducedDenominator}`}`;
}

function independentBinaryGcd(first, second) {
  let left = first < 0n ? -first : first;
  let right = second < 0n ? -second : second;
  if (left === 0n) return right;
  if (right === 0n) return left;
  let sharedPowersOfTwo = 0n;
  while (((left | right) & 1n) === 0n) {
    left >>= 1n;
    right >>= 1n;
    sharedPowersOfTwo += 1n;
  }
  while ((left & 1n) === 0n) left >>= 1n;
  do {
    while ((right & 1n) === 0n) right >>= 1n;
    if (left > right) [left, right] = [right, left];
    right -= left;
  } while (right !== 0n);
  return left << sharedPowersOfTwo;
}

function independentlyReducedBigIntRational(numerator, denominator) {
  assert(denominator > 0n);
  if (numerator === 0n) return "0";
  const negative = numerator < 0n;
  const magnitude = negative ? -numerator : numerator;
  const divisor = independentBinaryGcd(magnitude, denominator);
  const reducedNumerator = magnitude / divisor;
  const reducedDenominator = denominator / divisor;
  const value = reducedDenominator === 1n ? String(reducedNumerator) : `${reducedNumerator}/${reducedDenominator}`;
  return negative ? `-${value}` : value;
}

function independentlyCompareByCommonDenominator(leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  const commonDenominator = (leftDenominator / independentBinaryGcd(leftDenominator, rightDenominator)) * rightDenominator;
  const leftScaled = leftNumerator * (commonDenominator / leftDenominator);
  const rightScaled = rightNumerator * (commonDenominator / rightDenominator);
  return leftScaled < rightScaled ? -1 : leftScaled > rightScaled ? 1 : 0;
}

function independentlyMeasuredDistance(leftNumerator, leftDenominator, rightNumerator, rightDenominator) {
  const commonDenominator = (leftDenominator / independentBinaryGcd(leftDenominator, rightDenominator)) * rightDenominator;
  const difference = leftNumerator * (commonDenominator / leftDenominator) - rightNumerator * (commonDenominator / rightDenominator);
  return independentlyReducedBigIntRational(difference < 0n ? -difference : difference, commonDenominator);
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
    ["정답은 4:7", "4:7"],
    ["7", "7"],
    ["Enter 7.", "7"],
    ["Final value: 7", "7"],
    ["계산값은 7", "7"],
    ["计算值为 7", "7"],
    ["Ｆｉｎａｌ　ｖａｌｕｅ：７", "7"],
    ["4 ∶ 7", "4:7"],
    ["4 ⋮ 7", "4:7"],
    ["계산값7", "7"],
    ["值7", "7"],
    ["Final value7", "7"],
    ["value_7", "7"],
    ["7_items", "7"],
    ["−3⁄4", "-3/4"],
    ["- 3 / 4", "-3/4"],
    ["＋3／4", "3/4"],
    ["−0", "0"],
    ["‒3/4", "-3/4"],
    ["–3/4", "-3/4"],
    ["➖3/4", "-3/4"],
    ["-3⧸4", "-3/4"]
  ];
  blocked.forEach(function (entry) {
    assert.throws(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    }, /STUDENT_ANSWER_LEAK/);
  });
  [
    ["The condition gives 117 as an input value.", "17"],
    ["The condition gives 7.5 as an input value.", "7"],
    ["The condition gives 70 as an input value.", "7"],
    ["The condition gives 7:11 as an input ratio.", "7"],
    ["The condition gives 7,000 as an input quantity.", "7"],
    ["The condition gives −3⁄4 as an input value.", "3/4"],
    ["The condition gives -3/40 as an input value.", "3/4"],
    ["The condition gives ＋30 as an input value.", "3"],
    ["The condition gives −0.5 as an input value.", "0"],
    ["The condition gives ＋3／40 as an input value.", "3/4"]
  ].forEach(function (entry) {
    assert.doesNotThrow(function () {
      validator.assertStudentContentDoesNotRevealAnswer(entry[0], entry[1], "synthetic-component");
    });
  });
});

test("full workbook preflight blocks bare expected-response disclosure in every student locale", function () {
  const contentByLocale = {
    ko: "계산값1",
    en: "value_1",
    "zh-Hans": "计算值1"
  };
  Object.entries(contentByLocale).forEach(function (entry) {
    const pack = syntheticWorkbookPack();
    const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
      return component.responseMode !== null;
    });
    responseComponent.contentByLocale[entry[0]] = entry[1];
    assert.throws(function () {
      validator.validatePack(pack, "synthetic-workbook.json");
    }, /STUDENT_ANSWER_LEAK/);
  });
});

test("signed-rational answer references stay numeric-exact and block Unicode-equivalent leaks", function () {
  const pack = syntheticWorkbookPack();
  const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  const answerReference = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).find(function (reference) {
    return reference.componentId === responseComponent.componentId;
  });
  answerReference.expectedResponse = "-3/4";
  answerReference.arithmeticCheck = {
    kind: "signed-rational-operation", operation: "identity", numerator: -6, denominator: 8
  };
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  });
  responseComponent.contentByLocale.en = "−3⁄4";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /STUDENT_ANSWER_LEAK/);
  responseComponent.contentByLocale.en = "Find the number.";
  responseComponent.responseMode = "ratio-canonical";
  answerReference.responseMode = "ratio-canonical";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /ANSWER_REFERENCE_MODE_MISMATCH/);
});

test("signed-rational comparison references accept only an undisclosed strict comparison symbol", function () {
  const pack = syntheticWorkbookPack();
  const responseComponent = pack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  const answerReference = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).find(function (reference) {
    return reference.componentId === responseComponent.componentId;
  });
  responseComponent.responseMode = "comparison-symbol-exact";
  responseComponent.contentByLocale = localText("두 수 사이의 빈칸에 알맞은 기호를 쓰세요.", "Write the correct sign in the blank between the two values.", "在两个数之间的空格里写出正确的符号。");
  answerReference.responseMode = "comparison-symbol-exact";
  answerReference.expectedResponse = "<";
  answerReference.arithmeticCheck = {
    kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: -3, leftDenominator: 4, rightNumerator: -1, rightDenominator: 2
  };
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  });
  responseComponent.contentByLocale.en = "-3/4<-1/2";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /STUDENT_ANSWER_LEAK/);
  responseComponent.contentByLocale.en = "-3/4>-1/2";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /STUDENT_ANSWER_LEAK/);
  ["≪", "≺", "⋖", "⩽", "⪡", "⧀", "⧁", "⊰", "⊱", "⩹", "⩻"].forEach(function (glyph) {
    responseComponent.contentByLocale.en = `-3/4${glyph}-1/2`;
    assert.throws(function () {
      validator.validatePack(pack, "synthetic-workbook.json");
    }, /STUDENT_ANSWER_LEAK/);
  });
  responseComponent.contentByLocale.en = "-3/4＜-1/2";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /STUDENT_ANSWER_LEAK/);
  responseComponent.contentByLocale.en = "Write the correct sign in the blank between the two values.";
  responseComponent.responseMode = "numeric-exact";
  answerReference.responseMode = "numeric-exact";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /ANSWER_REFERENCE_MODE_MISMATCH/);
  responseComponent.responseMode = "ratio-canonical";
  answerReference.responseMode = "ratio-canonical";
  assert.throws(function () {
    validator.validatePack(pack, "synthetic-workbook.json");
  }, /ANSWER_REFERENCE_MODE_MISMATCH/);
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

test("Grade 6 signed-rational operations use exact reduction, order, and distance", function () {
  [
    [{ kind: "signed-rational-operation", operation: "identity", numerator: -6, denominator: 8 }, "-3/4"],
    [{ kind: "signed-rational-operation", operation: "opposite", numerator: -3, denominator: 4 }, "3/4"],
    [{ kind: "signed-rational-operation", operation: "opposite", numerator: 0, denominator: 11 }, "0"],
    [{ kind: "signed-rational-operation", operation: "absolute-value", numerator: -10, denominator: 15 }, "2/3"],
    [{ kind: "signed-rational-operation", operation: "minimum", leftNumerator: -1, leftDenominator: 2, rightNumerator: -2, rightDenominator: 3 }, "-2/3"],
    [{ kind: "signed-rational-operation", operation: "maximum", leftNumerator: -1, leftDenominator: 2, rightNumerator: -2, rightDenominator: 3 }, "-1/2"],
    [{ kind: "signed-rational-operation", operation: "distance", leftNumerator: -3, leftDenominator: 4, rightNumerator: 0, rightDenominator: 4 }, "3/4"],
    [{ kind: "signed-rational-operation", operation: "distance", leftNumerator: 0, leftDenominator: 3, rightNumerator: -1, rightDenominator: 6 }, "1/6"],
    [{ kind: "signed-rational-operation", operation: "axis-distance", axis: "horizontal", firstXNumerator: -3, firstXDenominator: 4, firstYNumerator: 1, firstYDenominator: 2, secondXNumerator: 5, secondXDenominator: 4, secondYNumerator: 2, secondYDenominator: 4 }, "2"],
    [{ kind: "signed-rational-operation", operation: "axis-distance", axis: "vertical", firstXNumerator: -2, firstXDenominator: 3, firstYNumerator: -1, firstYDenominator: 6, secondXNumerator: -4, secondXDenominator: 6, secondYNumerator: 5, secondYDenominator: 6 }, "1"]
  ].forEach(function (entry) {
    assert.equal(validator.canonicalAnswer(entry[0], "synthetic-ns-c"), entry[1]);
  });

  const numerators = [-23, -11, -5, -1, 0, 1, 4, 7, 19];
  const denominators = [1, 2, 3, 4, 5, 7, 8];
  numerators.forEach(function (numerator) {
    denominators.forEach(function (denominator) {
      assert.equal(validator.canonicalAnswer({
        kind: "signed-rational-operation", operation: "identity", numerator, denominator
      }, "synthetic-ns-c-identity"), independentlyReducedSignedRational(numerator, denominator));
      assert.equal(validator.canonicalAnswer({
        kind: "signed-rational-operation", operation: "opposite", numerator, denominator
      }, "synthetic-ns-c-opposite"), independentlyReducedSignedRational(-numerator, denominator));
      assert.equal(validator.canonicalAnswer({
        kind: "signed-rational-operation", operation: "absolute-value", numerator, denominator
      }, "synthetic-ns-c-absolute"), independentlyReducedSignedRational(Math.abs(numerator), denominator));
      numerators.forEach(function (rightNumerator) {
        denominators.forEach(function (rightDenominator) {
          const comparison = numerator * rightDenominator - rightNumerator * denominator;
          const minimumNumerator = comparison <= 0 ? numerator : rightNumerator;
          const minimumDenominator = comparison <= 0 ? denominator : rightDenominator;
          const maximumNumerator = comparison >= 0 ? numerator : rightNumerator;
          const maximumDenominator = comparison >= 0 ? denominator : rightDenominator;
          assert.equal(validator.canonicalAnswer({
            kind: "signed-rational-operation", operation: "minimum", leftNumerator: numerator, leftDenominator: denominator, rightNumerator, rightDenominator
          }, "synthetic-ns-c-minimum"), independentlyReducedSignedRational(minimumNumerator, minimumDenominator));
          assert.equal(validator.canonicalAnswer({
            kind: "signed-rational-operation", operation: "maximum", leftNumerator: numerator, leftDenominator: denominator, rightNumerator, rightDenominator
          }, "synthetic-ns-c-maximum"), independentlyReducedSignedRational(maximumNumerator, maximumDenominator));
          assert.equal(validator.canonicalAnswer({
            kind: "signed-rational-operation", operation: "axis-distance", axis: "horizontal",
            firstXNumerator: numerator, firstXDenominator: denominator, firstYNumerator: 0, firstYDenominator: 1,
            secondXNumerator: rightNumerator, secondXDenominator: rightDenominator, secondYNumerator: 0, secondYDenominator: 1
          }, "synthetic-ns-c-axis-distance"), independentlyReducedSignedRational(Math.abs(numerator * rightDenominator - rightNumerator * denominator), denominator * rightDenominator));
        });
      });
    });
  });
});

test("Grade 6 signed-rational comparisons use strict value or absolute-magnitude order", function () {
  [
    [{ kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: -2, leftDenominator: 3, rightNumerator: -1, rightDenominator: 2 }, "<"],
    [{ kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: 1, leftDenominator: 4, rightNumerator: -1, rightDenominator: 4 }, ">"],
    [{ kind: "signed-rational-comparison", basis: "absolute-magnitude", leftNumerator: -1, leftDenominator: 2, rightNumerator: 3, rightDenominator: 4 }, "<"],
    [{ kind: "signed-rational-comparison", basis: "absolute-magnitude", leftNumerator: -5, leftDenominator: 6, rightNumerator: 2, rightDenominator: 3 }, ">"]
  ].forEach(function (entry) {
    assert.equal(validator.canonicalAnswer(entry[0], "synthetic-ns-c-comparison"), entry[1]);
  });
  [
    { kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: -1, leftDenominator: 2, rightNumerator: -2, rightDenominator: 4 },
    { kind: "signed-rational-comparison", basis: "absolute-magnitude", leftNumerator: -1, leftDenominator: 2, rightNumerator: 2, rightDenominator: 4 },
    { kind: "signed-rational-comparison", basis: "ordinal", leftNumerator: -1, leftDenominator: 2, rightNumerator: 1, rightDenominator: 2 },
    { kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: -1, leftDenominator: 2, rightNumerator: 1, rightDenominator: 2, answer: "<" }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-ns-c-comparison-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
});

test("Grade 6 signed-rational minimum, maximum, and distance retain an independent BigInt boundary check", function () {
  const numerators = [-999999937n, -999983n, -123456789n, -1n, 0n, 1n, 123456789n, 999983n, 999999893n];
  const denominators = [1n, 2n, 99991n, 999983n, 999999929n];
  const values = numerators.flatMap(function (numerator) {
    return denominators.map(function (denominator) { return { numerator, denominator }; });
  });
  values.forEach(function (left) {
    values.forEach(function (right) {
      const comparison = independentlyCompareByCommonDenominator(left.numerator, left.denominator, right.numerator, right.denominator);
      const lower = comparison <= 0 ? left : right;
      const upper = comparison >= 0 ? left : right;
      const checkBase = {
        kind: "signed-rational-operation",
        leftNumerator: Number(left.numerator),
        leftDenominator: Number(left.denominator),
        rightNumerator: Number(right.numerator),
        rightDenominator: Number(right.denominator)
      };
      assert.equal(validator.canonicalAnswer(Object.assign({}, checkBase, { operation: "minimum" }), "synthetic-ns-c-boundary-minimum"), independentlyReducedBigIntRational(lower.numerator, lower.denominator));
      assert.equal(validator.canonicalAnswer(Object.assign({}, checkBase, { operation: "maximum" }), "synthetic-ns-c-boundary-maximum"), independentlyReducedBigIntRational(upper.numerator, upper.denominator));
      if (comparison !== 0) {
        assert.equal(validator.canonicalAnswer({
          kind: "signed-rational-comparison", basis: "signed-value",
          leftNumerator: Number(left.numerator), leftDenominator: Number(left.denominator),
          rightNumerator: Number(right.numerator), rightDenominator: Number(right.denominator)
        }, "synthetic-ns-c-boundary-signed-comparison"), comparison < 0 ? "<" : ">");
      }
      const leftMagnitude = left.numerator < 0n ? -left.numerator : left.numerator;
      const rightMagnitude = right.numerator < 0n ? -right.numerator : right.numerator;
      const magnitudeComparison = independentlyCompareByCommonDenominator(leftMagnitude, left.denominator, rightMagnitude, right.denominator);
      if (magnitudeComparison !== 0) {
        assert.equal(validator.canonicalAnswer({
          kind: "signed-rational-comparison", basis: "absolute-magnitude",
          leftNumerator: Number(left.numerator), leftDenominator: Number(left.denominator),
          rightNumerator: Number(right.numerator), rightDenominator: Number(right.denominator)
        }, "synthetic-ns-c-boundary-magnitude-comparison"), magnitudeComparison < 0 ? "<" : ">");
      }
      assert.equal(validator.canonicalAnswer({
        kind: "signed-rational-operation", operation: "axis-distance", axis: "horizontal",
        firstXNumerator: Number(left.numerator), firstXDenominator: Number(left.denominator), firstYNumerator: 0, firstYDenominator: 1,
        secondXNumerator: Number(right.numerator), secondXDenominator: Number(right.denominator), secondYNumerator: 0, secondYDenominator: 1
      }, "synthetic-ns-c-boundary-axis-distance"), independentlyMeasuredDistance(left.numerator, left.denominator, right.numerator, right.denominator));
    });
    assert.equal(validator.canonicalAnswer({
      kind: "signed-rational-operation", operation: "distance", leftNumerator: Number(left.numerator), leftDenominator: Number(left.denominator), rightNumerator: 0, rightDenominator: 1
    }, "synthetic-ns-c-boundary-zero-distance"), independentlyMeasuredDistance(left.numerator, left.denominator, 0n, 1n));
  });
});

test("Grade 6 signed-rational operations reject unsafe or out-of-contract input", function () {
  [
    { kind: "signed-rational-operation", operation: "identity", numerator: -1.5, denominator: 2 },
    { kind: "signed-rational-operation", operation: "identity", numerator: 1, denominator: 0 },
    { kind: "signed-rational-operation", operation: "identity", numerator: 1, denominator: -2 },
    { kind: "signed-rational-operation", operation: "opposite", numerator: 1000000001, denominator: 1 },
    { kind: "signed-rational-operation", operation: "absolute-value", numerator: -1, denominator: 2, answer: "1/2" },
    { kind: "signed-rational-operation", operation: "minimum", leftNumerator: -1, leftDenominator: 2, rightNumerator: 1, rightDenominator: 0 },
    { kind: "signed-rational-operation", operation: "minimum", numerator: -1, denominator: 2 },
    { kind: "signed-rational-operation", operation: "distance", leftNumerator: -1, leftDenominator: 2, rightNumerator: 1, rightDenominator: 2 },
    { kind: "signed-rational-operation", operation: "axis-distance", axis: "horizontal", firstXNumerator: 0, firstXDenominator: 1, firstYNumerator: 1, firstYDenominator: 2, secondXNumerator: 1, secondXDenominator: 1, secondYNumerator: 2, secondYDenominator: 3 },
    { kind: "signed-rational-operation", operation: "axis-distance", axis: "vertical", firstXNumerator: 0, firstXDenominator: 1, firstYNumerator: 0, firstYDenominator: 1, secondXNumerator: 1, secondXDenominator: 1, secondYNumerator: 1, secondYDenominator: 1 },
    { kind: "signed-rational-operation", operation: "axis-distance", axis: "diagonal", firstXNumerator: 0, firstXDenominator: 1, firstYNumerator: 1, firstYDenominator: 1, secondXNumerator: 0, secondXDenominator: 1, secondYNumerator: 2, secondYDenominator: 1 },
    { kind: "signed-rational-operation", operation: "unknown", numerator: -1, denominator: 2 }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-ns-c-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
  const accessor = { kind: "signed-rational-operation", numerator: -1, denominator: 2 };
  Object.defineProperty(accessor, "operation", {
    enumerable: true,
    get: function () { return "identity"; }
  });
  assert.throws(function () {
    validator.canonicalAnswer(accessor, "synthetic-ns-c-accessor");
  }, /ARITHMETIC_CHECK_INVALID/);
  const comparisonAccessor = { kind: "signed-rational-comparison", leftNumerator: -1, leftDenominator: 2, rightNumerator: 1, rightDenominator: 2 };
  Object.defineProperty(comparisonAccessor, "basis", {
    enumerable: true,
    get: function () { return "signed-value"; }
  });
  assert.throws(function () {
    validator.canonicalAnswer(comparisonAccessor, "synthetic-ns-c-comparison-accessor");
  }, /ARITHMETIC_CHECK_INVALID/);
});

test("Grade 6 decimal, GCF, and LCM checks use canonical exact arithmetic", function () {
  [
    [{ kind: "decimal-operation", operation: "add", left: "12.34", right: "0.56" }, "12.9"],
    [{ kind: "decimal-operation", operation: "subtract", left: "6.2", right: "0.85" }, "5.35"],
    [{ kind: "decimal-operation", operation: "multiply", left: "2.5", right: "0.04" }, "0.1"],
    [{ kind: "decimal-operation", operation: "divide", left: "1.25", right: "0.5" }, "2.5"],
    [{ kind: "decimal-operation", operation: "add", left: "0", right: "0.001" }, "0.001"],
    [{ kind: "greatest-common-factor", left: 84, right: 60 }, "12"],
    [{ kind: "greatest-common-factor", left: 1, right: 24 }, "1"],
    [{ kind: "least-common-multiple", left: 8, right: 12 }, "24"],
    [{ kind: "least-common-multiple", left: 1, right: 12 }, "12"]
  ].forEach(function (entry) {
    assert.equal(validator.canonicalAnswer(entry[0], "synthetic-ns-b"), entry[1]);
  });
});

test("Grade 6 decimal, GCF, and LCM checks reject noncanonical or out-of-scope input", function () {
  [
    { kind: "decimal-operation", operation: "add", left: 1.2, right: "0.3" },
    { kind: "decimal-operation", operation: "add", left: "01", right: "0.3" },
    { kind: "decimal-operation", operation: "add", left: "1.20", right: "0.3" },
    { kind: "decimal-operation", operation: "add", left: "1e3", right: "0.3" },
    { kind: "decimal-operation", operation: "subtract", left: "0.1", right: "0.2" },
    { kind: "decimal-operation", operation: "multiply", left: "1.234", right: "0.2" },
    { kind: "decimal-operation", operation: "divide", left: "1", right: "0" },
    { kind: "decimal-operation", operation: "divide", left: "1", right: "3" },
    { kind: "decimal-operation", operation: "divide", left: "1", right: "512" },
    { kind: "decimal-operation", operation: "add", left: "1", right: "2", answer: "3" },
    { kind: "greatest-common-factor", left: 0, right: 2 },
    { kind: "greatest-common-factor", left: 101, right: 2 },
    { kind: "least-common-multiple", left: 0, right: 2 },
    { kind: "least-common-multiple", left: 2, right: 13 }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-ns-b-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
});

test("arithmetic checks reject inherited, accessor, and non-data fields", function () {
  const inherited = Object.create({ kind: "decimal-operation", operation: "add", left: "1", right: "2" });
  assert.throws(function () {
    validator.canonicalAnswer(inherited, "synthetic-inherited-check");
  }, /ARITHMETIC_CHECK_INVALID/);

  const accessor = { kind: "greatest-common-factor", right: 2 };
  Object.defineProperty(accessor, "left", {
    enumerable: true,
    get: function () { return 2; }
  });
  assert.throws(function () {
    validator.canonicalAnswer(accessor, "synthetic-accessor-check");
  }, /ARITHMETIC_CHECK_INVALID/);

  const kindAccessor = { left: 2, right: 2 };
  Object.defineProperty(kindAccessor, "kind", {
    enumerable: true,
    get: function () { return "greatest-common-factor"; }
  });
  assert.throws(function () {
    validator.canonicalAnswer(kindAccessor, "synthetic-kind-accessor-check");
  }, /ARITHMETIC_CHECK_INVALID/);
});

test("private workbook source rejects duplicate JSON keys before parsing", function () {
  assert.doesNotThrow(function () {
    validator.assertNoDuplicateJsonKeys('{"a":"value: still a value","nested":{"a":1},"items":[{"a":2}]}', "synthetic-json");
  });
  [
    '{"a":1,"a":2}',
    '{"a":1,"\\u0061":2}',
    '{"nested":{"x":1,"x":2}}'
  ].forEach(function (source) {
    assert.throws(function () {
      validator.assertNoDuplicateJsonKeys(source, "synthetic-json");
    }, /PRIVATE_WORKBOOK_JSON_DUPLICATE_KEY/);
  });
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
