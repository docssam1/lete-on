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
const registry = require("../curriculum/us-k8-content-registry.js");

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

const SYNTHETIC_EEA_POWER_PAIRS = Object.freeze([
  Object.freeze({ base: 8, exponent: 2 }), Object.freeze({ base: 9, exponent: 2 }),
  Object.freeze({ base: 10, exponent: 2 }), Object.freeze({ base: 11, exponent: 2 }),
  Object.freeze({ base: 12, exponent: 2 }), Object.freeze({ base: 3, exponent: 3 }),
  Object.freeze({ base: 4, exponent: 3 }), Object.freeze({ base: 5, exponent: 3 }),
  Object.freeze({ base: 6, exponent: 3 }), Object.freeze({ base: 7, exponent: 3 }),
  Object.freeze({ base: 8, exponent: 4 }), Object.freeze({ base: 9, exponent: 4 }),
  Object.freeze({ base: 10, exponent: 4 }), Object.freeze({ base: 11, exponent: 4 }),
  Object.freeze({ base: 12, exponent: 4 }), Object.freeze({ base: 2, exponent: 4 }),
  Object.freeze({ base: 2, exponent: 5 }), Object.freeze({ base: 3, exponent: 5 }),
  Object.freeze({ base: 4, exponent: 5 }), Object.freeze({ base: 5, exponent: 5 }),
  Object.freeze({ base: 6, exponent: 5 }), Object.freeze({ base: 7, exponent: 5 })
]);

// These fixture-only examples deliberately remain outside the response
// contract above. This keeps public regression coverage from reproducing a
// private workbook's authored examples or expected responses.
const SYNTHETIC_EEA_WORKED_EXAMPLES = Object.freeze([
  Object.freeze({ base: 13, exponent: 2 }),
  Object.freeze({ base: 14, exponent: 2 })
]);

function independentlyRepeatedWholePower(base, exponent) {
  let result = 1n;
  for (let factor = 0; factor < exponent; factor += 1) result *= BigInt(base);
  return String(result);
}

function syntheticEeaPowerPrompt(pair, representation) {
  const display = representation === "repeated-factor"
    ? Array.from({ length: pair.exponent }, function () { return String(pair.base); }).join(" × ")
    : `${pair.base}^${pair.exponent}`;
  return localText(
    representation === "power-notation" ? `다음 식의 값을 구하세요: ${display}.` : `다음 반복곱의 값을 구하세요: ${display}.`,
    representation === "power-notation" ? `Find the value of ${display}.` : `Find the value of the repeated product ${display}.`,
    representation === "power-notation" ? `求 ${display} 的值。` : `求重复乘积 ${display} 的值。`
  );
}

function syntheticEeaWorkedExample(pair) {
  const factors = Array.from({ length: pair.exponent }, function () { return String(pair.base); }).join(" × ");
  const result = independentlyRepeatedWholePower(pair.base, pair.exponent);
  return localText(
    `예시: ${pair.base}^${pair.exponent} = ${factors} = ${result}.`,
    `Worked example: ${pair.base}^${pair.exponent} = ${factors} = ${result}.`,
    `示例：${pair.base}^${pair.exponent} = ${factors} = ${result}。`
  );
}

function syntheticEeaStandardsEvidence() {
  return {
    state: "partial-whole-number-power-evaluation-locked",
    autoEvidenceIds: ["6.EE.A.1-isolated-positive-whole-number-power-evaluation"],
    lockedEvidenceByLocale: localText(
      "자동 근거는 6.EE.A.1의 제한된 양의 정수 거듭제곱 계산뿐이다. 6.EE.A.1의 지수 표기 읽기와 쓰기, 6.EE.A.2, 6.EE.A.3, 6.EE.A.4의 식과 동치 설명은 교사 관찰로 남긴다. 이것은 완전 숙달이나 승급 결정이 아니다.",
      "The automatic evidence is limited to positive whole-number power evaluation within 6.EE.A.1. Exponent notation reading and writing for 6.EE.A.1, together with expression and equivalence explanations in 6.EE.A.2, 6.EE.A.3, and 6.EE.A.4, remain teacher-observation work. It is not a full mastery or promotion decision.",
      "自动证据仅限于 6.EE.A.1 中正整数幂的计算。6.EE.A.1 的指数记法读写，以及 6.EE.A.2、6.EE.A.3 和 6.EE.A.4 的式子和等价说明，仍是教师观察内容。这不是完全掌握或升学决定。"
    )
  };
}

// Fixture-only EE.B facts are generated independently of the private authoring
// draft. A later local boundary check confirms that no full response fact or
// worked-example fact overlaps the private workbook.
const SYNTHETIC_EEB_ADDITIVE_FACTS = Object.freeze([1, 7, 14, 2, 8, 15, 3, 9, 16, 4, 10, 17, 5, 11, 18, 6, 12, 19, 1, 13, 20, 2]);
const SYNTHETIC_EEB_SUBSTITUTION_CASES = Object.freeze(Array.from({ length: 22 }, function (_, index) {
  const solution = index + 1;
  const addend = SYNTHETIC_EEB_ADDITIVE_FACTS[index];
  const position = index % 3;
  const holds = index < 11;
  const candidateSet = holds
    ? position === 0
      ? [solution, solution + 1, solution + 2]
      : position === 1
        ? [solution - 1, solution, solution + 1]
        : [solution - 2, solution - 1, solution]
    : [1, 2, 3];
  return Object.freeze({
    kind: "positive-whole-equality-substitution-truth",
    form: "x-plus-p-equals-q",
    candidateSet: Object.freeze(candidateSet),
    candidate: candidateSet[position],
    addend,
    total: solution + addend
  });
}));

const SYNTHETIC_EEB_WORKED_EXAMPLES = Object.freeze([
  Object.freeze({ candidate: 23, addend: 20, total: 43 }),
  Object.freeze({ candidate: 22, addend: 19, total: 41 })
]);

// Fixture-only EE.C table facts use input values outside the authored-pack
// band. They exercise the public contract without copying private tables or
// expected coefficients into this repository.
const SYNTHETIC_EEC_TABLE_CASES = Object.freeze(Array.from({ length: 22 }, function (_, index) {
  const rate = 2 + (index % 11);
  const independentValues = index < 11 ? [0, 13, 14] : [0, 15, 18];
  return Object.freeze({
    kind: "direct-variation-whole-table-coefficient",
    form: "y-equals-rate-times-x",
    independentSymbol: "x",
    dependentSymbol: "y",
    independentValues: Object.freeze(independentValues),
    dependentValues: Object.freeze(independentValues.map(function (value) { return value * rate; })),
    rate
  });
}));

// Fixture-only 6.G.A triangle facts are deliberately distinct from private
// authoring. They exercise the public schema and independent calculation
// contract without reproducing a private worksheet's figure dimensions.
const SYNTHETIC_GGA_TRIANGLE_CASES = Object.freeze([
  [4, 16], [6, 14], [8, 10], [10, 10], [12, 10], [14, 10], [16, 20], [18, 10],
  [20, 10], [22, 10], [24, 10], [4, 18], [6, 16], [8, 14], [12, 12], [14, 12],
  [16, 12], [18, 12], [22, 12], [24, 12], [20, 14], [18, 14]
].map(function (entry) {
  return Object.freeze({
    kind: "right-triangle-whole-base-perpendicular-height-area",
    base: entry[0],
    perpendicularHeight: entry[1]
  });
}));

function independentlySubstitutionTruth(check) {
  const matchingCandidates = check.candidateSet.filter(function (candidate) {
    return BigInt(candidate) + BigInt(check.addend) === BigInt(check.total);
  });
  return matchingCandidates.includes(check.candidate) ? "true" : "false";
}

function independentlyDirectVariationCoefficient(check) {
  assert.equal(check.independentValues.length, 3);
  assert.equal(check.dependentValues.length, 3);
  assert.equal(check.independentValues[0], 0);
  assert.equal(check.dependentValues[0], 0);
  const coefficients = check.independentValues.slice(1).map(function (input, index) {
    const output = check.dependentValues[index + 1];
    assert.equal(output % input, 0);
    return output / input;
  });
  assert.equal(new Set(coefficients).size, 1);
  return String(coefficients[0]);
}

function independentlyRightTriangleArea(check) {
  const x1 = 0n;
  const y1 = 0n;
  const x2 = BigInt(check.base);
  const y2 = 0n;
  const x3 = 0n;
  const y3 = BigInt(check.perpendicularHeight);
  const twiceSignedArea = x1 * y2 + x2 * y3 + x3 * y1 - (y1 * x2 + y2 * x3 + y3 * x1);
  const twiceArea = twiceSignedArea < 0n ? -twiceSignedArea : twiceSignedArea;
  assert(twiceArea > 0n && twiceArea % 2n === 0n);
  return String(twiceArea / 2n);
}

function syntheticKoreanObjectParticle(value) {
  return [0, 1, 3, 6, 7, 8].includes(value % 10) ? "을" : "를";
}

function syntheticEebSubstitutionPrompt(check) {
  const candidateSet = `{${check.candidateSet.join(", ")}}`;
  const equality = `x + ${check.addend} = ${check.total}`;
  return localText(
    `후보 집합 ${candidateSet}에서 후보 ${check.candidate}${syntheticKoreanObjectParticle(check.candidate)} ${equality}에 대입하세요. 이 등식이 성립하나요?`,
    `From the candidate set ${candidateSet}, substitute candidate ${check.candidate} into ${equality}. Does the equality hold?`,
    `在候选集合 ${candidateSet} 中，将候选数 ${check.candidate} 代入 ${equality}。这个等式成立吗？`
  );
}

function syntheticEecTablePrompt() {
  return localText(
    "표는 독립변수 x와 종속변수 y의 직접비례 관계를 나타냅니다. 방정식 y = □ × x의 계수를 구하세요.",
    "The table shows a direct-variation relationship with x as the independent variable and y as the dependent variable. Find the coefficient in y = □ × x.",
    "表格表示 x 为自变量、y 为因变量的正比例关系。求方程 y = □ × x 中的系数。"
  );
}

function syntheticGgaTrianglePrompt() {
  return localText(
    "그림의 직각삼각형에서 밑변과 그에 수직인 높이가 표시되어 있습니다. 넓이를 제곱단위로 구하세요.",
    "The diagram shows a right triangle with its base and perpendicular height labeled. Find its area in square units.",
    "图中直角三角形的底和与底垂直的高已标出。求它的面积（平方单位）。"
  );
}

function syntheticEebWorkedExample(fact) {
  return localText(
    `예시: x = ${fact.candidate}${syntheticKoreanObjectParticle(fact.candidate)} x + ${fact.addend} = ${fact.total}에 대입하면 ${fact.candidate} + ${fact.addend} = ${fact.total}이므로 등식이 성립한다.`,
    `Worked example: Substitute x = ${fact.candidate} into x + ${fact.addend} = ${fact.total}. Since ${fact.candidate} + ${fact.addend} = ${fact.total}, the equality holds.`,
    `示例：将 x = ${fact.candidate} 代入 x + ${fact.addend} = ${fact.total}。因为 ${fact.candidate} + ${fact.addend} = ${fact.total}，所以等式成立。`
  );
}

function syntheticEebStandardsEvidence() {
  return {
    state: "partial-positive-whole-equality-substitution-truth-locked",
    autoEvidenceIds: ["6.EE.B.5-finite-positive-whole-equality-substitution-truth"],
    lockedEvidenceByLocale: Object.assign({}, validator.EEB_LOCKED_EVIDENCE_BY_LOCALE)
  };
}

function syntheticEecStandardsEvidence() {
  return {
    state: "partial-finite-whole-direct-variation-table-equation-completion-locked",
    autoEvidenceIds: ["6.EE.C.9-finite-whole-direct-variation-table-equation-completion"],
    lockedEvidenceByLocale: Object.assign({}, validator.EEC_LOCKED_EVIDENCE_BY_LOCALE)
  };
}

function syntheticGgaStandardsEvidence() {
  return {
    state: "partial-finite-whole-right-triangle-area-from-labeled-base-height-locked",
    autoEvidenceIds: [validator.GGA_TRIANGLE_AREA_EVIDENCE_ID],
    lockedEvidenceByLocale: Object.assign({}, validator.GGA_LOCKED_EVIDENCE_BY_LOCALE)
  };
}

function syntheticEebObservationText(resource) {
  const profileId = `${resource.resourceType}:${resource.levelId}`;
  return Object.assign({}, validator.EEB_TEACHER_OBSERVATION_BY_PROFILE[profileId]);
}

function syntheticEecObservationText(resource) {
  const profileId = `${resource.resourceType}:${resource.levelId}`;
  return Object.assign({}, validator.EEC_TEACHER_OBSERVATION_BY_PROFILE[profileId]);
}

function syntheticGgaObservationText(resource) {
  const profileId = `${resource.resourceType}:${resource.levelId}`;
  return Object.assign({}, validator.GGA_TEACHER_OBSERVATION_BY_PROFILE[profileId]);
}

function syntheticEebStaticText(group, key) {
  const template = validator.EEB_STUDENT_STATIC_TEXT[group][key];
  assert(template);
  return Object.assign({}, template);
}

function syntheticEebStudentResourceProfile(resource) {
  return `${resource.sessionId}:${resource.resourceType}:${resource.levelId}`;
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

function syntheticWorkbookPack(unitId) {
  const selectedUnitId = unitId || "ccss-6-rp-a";
  const plan = resourcePlans.buildUnitPlan(selectedUnitId);
  const selectedUnit = registry.units.find(function (unit) { return unit.unitId === selectedUnitId; });
  assert(selectedUnit);
  const lineage = {
    clusterId: selectedUnit.clusterId,
    skillId: registry.skillIdForCluster(selectedUnit.clusterId)
  };
  const studentResources = plan.resourcesByAudience.student.filter(function (resource) {
    return resource.testType === "guided-practice" && ["concept-workbook", "guided-practice", "homework"].includes(resource.resourceType);
  });
  const teacherResources = plan.resourcesByAudience.teacher.filter(function (resource) {
    return new Set(studentResources.map(function (resource) { return resource.sessionId; })).has(resource.sessionId) &&
      ["lesson-plan", "solution-guide", "assignment-builder", "answer-key"].includes(resource.resourceType);
  });
  const responseComponents = [];
  let componentNumber = 0;
  let workedExampleNumber = 0;
  const studentSections = studentResources.map(function (resource, sectionIndex) {
    const components = resource.plannedComponents.flatMap(function (planComponent) {
      return Array.from({ length: planComponent.plannedCount }, function () {
        componentNumber += 1;
        const isTeaching = ["concept-summary", "worked-example"].includes(planComponent.componentType);
        const eeaPair = !isTeaching && selectedUnitId === "ccss-6-ee-a"
          ? SYNTHETIC_EEA_POWER_PAIRS[responseComponents.length]
          : null;
        const eebCheck = !isTeaching && selectedUnitId === "ccss-6-ee-b"
          ? SYNTHETIC_EEB_SUBSTITUTION_CASES[responseComponents.length]
          : null;
        const eecCheck = !isTeaching && selectedUnitId === "ccss-6-ee-c"
          ? SYNTHETIC_EEC_TABLE_CASES[responseComponents.length]
          : null;
        const ggaCheck = !isTeaching && selectedUnitId === "ccss-6-g-a"
          ? SYNTHETIC_GGA_TRIANGLE_CASES[responseComponents.length]
          : null;
        const eeaWorkedExample = isTeaching && planComponent.componentType === "worked-example" && selectedUnitId === "ccss-6-ee-a"
          ? SYNTHETIC_EEA_WORKED_EXAMPLES[workedExampleNumber++]
          : null;
        const eebWorkedExample = isTeaching && planComponent.componentType === "worked-example" && selectedUnitId === "ccss-6-ee-b"
          ? SYNTHETIC_EEB_WORKED_EXAMPLES[workedExampleNumber++]
          : null;
        const eeaConceptSummary = isTeaching && planComponent.componentType === "concept-summary" && selectedUnitId === "ccss-6-ee-a";
        const eebConceptSummary = isTeaching && planComponent.componentType === "concept-summary" && selectedUnitId === "ccss-6-ee-b";
        const eecTeachingBlock = isTeaching && selectedUnitId === "ccss-6-ee-c";
        assert(isTeaching || selectedUnitId !== "ccss-6-ee-a" || eeaPair);
        assert(isTeaching || selectedUnitId !== "ccss-6-ee-b" || eebCheck);
        assert(isTeaching || selectedUnitId !== "ccss-6-ee-c" || eecCheck);
        assert(isTeaching || selectedUnitId !== "ccss-6-g-a" || ggaCheck);
        assert(planComponent.componentType !== "worked-example" || selectedUnitId !== "ccss-6-ee-a" || eeaWorkedExample);
        assert(planComponent.componentType !== "worked-example" || selectedUnitId !== "ccss-6-ee-b" || eebWorkedExample);
        const componentId = `cmp-dft-s${String(sectionIndex + 1).padStart(2, "0")}c${String(componentNumber).padStart(3, "0")}`;
        const component = {
          componentId,
          componentType: planComponent.componentType,
          sequence: 0,
          contentByLocale: isTeaching
            ? eeaWorkedExample
              ? syntheticEeaWorkedExample(eeaWorkedExample)
              : eebWorkedExample
                ? syntheticEebWorkedExample(eebWorkedExample)
                : eeaConceptSummary
                  ? localText("지수 표기 개요", "Exponent notation overview", "指数记法概览")
                  : eebConceptSummary
                    ? syntheticEebStaticText("conceptSummaryByProfile", syntheticEebStudentResourceProfile(resource))
                    : eecTeachingBlock
                      ? localText("표의 관계를 읽는 연습", "Read the relationship in a table", "阅读表格中的关系")
                      : localText("개념 예시: \\frac{1}{2}", "Worked example: \\frac{1}{2}", "示例：\\frac{1}{2}" )
            : eeaPair
              ? syntheticEeaPowerPrompt(eeaPair, responseComponents.length % 2 === 0 ? "power-notation" : "repeated-factor")
              : eebCheck
                ? syntheticEebSubstitutionPrompt(eebCheck)
                : eecCheck
                  ? syntheticEecTablePrompt()
                  : ggaCheck
                    ? syntheticGgaTrianglePrompt()
                  : localText("수를 구하세요.", "Find the number.", "求这个数。"),
          responseMode: isTeaching ? null : selectedUnitId === "ccss-6-ee-b" ? "truth-value-exact" : "numeric-exact",
          teacherReferenceId: isTeaching ? null : `ref-dft-r${String(componentNumber).padStart(3, "0")}`,
          ...(eecCheck ? {
            relationTable: {
              form: eecCheck.form,
              independentSymbol: eecCheck.independentSymbol,
              dependentSymbol: eecCheck.dependentSymbol,
              independentValues: Array.from(eecCheck.independentValues),
              dependentValues: Array.from(eecCheck.dependentValues)
            }
          } : ggaCheck ? {
            geometryDiagram: {
              kind: validator.GGA_GEOMETRY_DIAGRAM_KIND,
              base: ggaCheck.base,
              perpendicularHeight: ggaCheck.perpendicularHeight,
              heightFoot: "left-base-endpoint"
            }
          } : {})
        };
        if (!isTeaching) responseComponents.push({ component, resource });
        return component;
      });
    }).map(function (component, index) { return Object.assign(component, { sequence: index + 1 }); });
    return {
      sectionId: `sct-dft-s${String(sectionIndex + 1).padStart(3, "0")}`,
      sectionVersion: 1,
      audience: "student",
      titleByLocale: selectedUnitId === "ccss-6-ee-b"
        ? syntheticEebStaticText("sectionTitlesByProfile", syntheticEebStudentResourceProfile(resource))
        : localText("학생 자료", "Student material", "学生资料"),
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
        const eeaPair = selectedUnitId === "ccss-6-ee-a" ? SYNTHETIC_EEA_POWER_PAIRS[responseComponents.indexOf(entry)] : null;
        const eebCheck = selectedUnitId === "ccss-6-ee-b" ? SYNTHETIC_EEB_SUBSTITUTION_CASES[responseComponents.indexOf(entry)] : null;
        const eecCheck = selectedUnitId === "ccss-6-ee-c" ? SYNTHETIC_EEC_TABLE_CASES[responseComponents.indexOf(entry)] : null;
        const ggaCheck = selectedUnitId === "ccss-6-g-a" ? SYNTHETIC_GGA_TRIANGLE_CASES[responseComponents.indexOf(entry)] : null;
        const ggaEvaluationMode = ggaCheck
          ? entry.resource.levelId === "advanced" ? "teacher-review-only" : "automatic-evidence"
          : null;
        return {
          referenceId: entry.component.teacherReferenceId,
          componentId: entry.component.componentId,
          responseMode: eebCheck ? "truth-value-exact" : "numeric-exact",
          ...(ggaEvaluationMode ? { evaluationMode: ggaEvaluationMode } : {}),
          expectedResponse: eeaPair ? independentlyRepeatedWholePower(eeaPair.base, eeaPair.exponent) : eebCheck ? independentlySubstitutionTruth(eebCheck) : eecCheck ? independentlyDirectVariationCoefficient(eecCheck) : ggaCheck ? independentlyRightTriangleArea(ggaCheck) : "1",
          solutionByLocale: localText("교사용 풀이", "Teacher solution", "教师解析"),
          uniquenessProofByLocale: localText("교사용 검산", "Teacher check", "教师检验"),
          arithmeticCheck: eeaPair
            ? { kind: "whole-number-power", base: eeaPair.base, exponent: eeaPair.exponent }
            : eebCheck
              ? Object.assign({}, eebCheck, { candidateSet: Array.from(eebCheck.candidateSet) })
              : eecCheck
                ? Object.assign({}, eecCheck, { independentValues: Array.from(eecCheck.independentValues), dependentValues: Array.from(eecCheck.dependentValues) })
                : ggaCheck
                  ? Object.assign({}, ggaCheck)
                : { kind: "whole-quotient", total: 1, groups: 1 }
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
  if (["ccss-6-ee-a", "ccss-6-ee-b", "ccss-6-ee-c", "ccss-6-g-a"].includes(selectedUnitId)) {
    teacherArtifacts.filter(function (artifact) {
      return artifact.resourceBinding.resourceType === "lesson-plan" || artifact.resourceBinding.resourceType === "assignment-builder";
    }).forEach(function (artifact, index) {
      artifact.components.push({
        componentId: `tcmp-dft-${selectedUnitId === "ccss-6-ee-a" ? "eea" : selectedUnitId === "ccss-6-ee-b" ? "eeb" : selectedUnitId === "ccss-6-ee-c" ? "eec" : "gga"}-observation-${index + 1}`,
        componentType: "teacher-observation-rubric",
        sequence: artifact.components.length + 1,
        contentByLocale: selectedUnitId === "ccss-6-ee-b"
          ? syntheticEebObservationText(artifact.resourceBinding)
          : selectedUnitId === "ccss-6-ee-c"
            ? syntheticEecObservationText(artifact.resourceBinding)
            : selectedUnitId === "ccss-6-g-a"
              ? syntheticGgaObservationText(artifact.resourceBinding)
            : localText("교사 관찰", "Teacher observation", "教师观察")
      });
    });
  }
  return {
    schemaVersion: "gfield-private-workbook-draft-v1",
    confidentiality: "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT",
    packId: "wbk-dft-synthetic-pack",
    packVersion: 1,
    programId: "us-core-k8",
    targetGrade: 6,
    unitId: selectedUnitId,
    clusterId: lineage.clusterId,
    skillId: lineage.skillId,
    resourcePlanId: plan.planId,
    cadenceProfileId: resourcePlans.GRADE6_CADENCE.cadenceProfileId,
    state: "draft-pending-independent-review",
    coverageState: "plan-complete",
    ...(selectedUnitId === "ccss-6-ns-c" ? {
      standardsEvidence: {
        state: "partial-graphing-observation-locked",
        autoEvidenceIds: ["6.NS.C.6-quadrant-classification", "6.NS.C.7-signed-rational-order", "6.NS.C.8-same-axis-distance"],
        lockedEvidenceByLocale: localText("교사 관찰 잠금", "Teacher observation locked", "教师观察锁定")
      }
    } : selectedUnitId === "ccss-6-ee-a" ? { standardsEvidence: syntheticEeaStandardsEvidence() } : selectedUnitId === "ccss-6-ee-b" ? { standardsEvidence: syntheticEebStandardsEvidence() } : selectedUnitId === "ccss-6-ee-c" ? { standardsEvidence: syntheticEecStandardsEvidence() } : selectedUnitId === "ccss-6-g-a" ? { standardsEvidence: syntheticGgaStandardsEvidence() } : {}),
    deliveryState: "locked",
    localePolicy: { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] },
    frontMatter: selectedUnitId === "ccss-6-ee-b"
      ? {
        titleByLocale: syntheticEebStaticText("frontMatter", "titleByLocale"),
        learningTargetsByLocale: syntheticEebStaticText("frontMatter", "learningTargetsByLocale"),
        howToUseByLocale: syntheticEebStaticText("frontMatter", "howToUseByLocale")
      }
      : {
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
    closingMatter: selectedUnitId === "ccss-6-ee-b"
      ? {
        glossaryByLocale: syntheticEebStaticText("closingMatter", "glossaryByLocale"),
        retentionNoticeByLocale: syntheticEebStaticText("closingMatter", "retentionNoticeByLocale")
      }
      : {
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

test("Grade 6 quadrant classification requires two non-axis signed rational coordinates", function () {
  [
    [{ kind: "quadrant-classification", xNumerator: 3, xDenominator: 5, yNumerator: 7, yDenominator: 9 }, "1"],
    [{ kind: "quadrant-classification", xNumerator: -3, xDenominator: 5, yNumerator: 7, yDenominator: 9 }, "2"],
    [{ kind: "quadrant-classification", xNumerator: -3, xDenominator: 5, yNumerator: -7, yDenominator: 9 }, "3"],
    [{ kind: "quadrant-classification", xNumerator: 3, xDenominator: 5, yNumerator: -7, yDenominator: 9 }, "4"]
  ].forEach(function (entry) {
    assert.equal(validator.canonicalAnswer(entry[0], "synthetic-ns-c-quadrant"), entry[1]);
  });
  [
    { kind: "quadrant-classification", xNumerator: 0, xDenominator: 1, yNumerator: 1, yDenominator: 2 },
    { kind: "quadrant-classification", xNumerator: 1, xDenominator: 2, yNumerator: 0, yDenominator: 1 },
    { kind: "quadrant-classification", xNumerator: 1, xDenominator: -2, yNumerator: 1, yDenominator: 2 },
    { kind: "quadrant-classification", xNumerator: 1, xDenominator: 2, yNumerator: 1, yDenominator: 2, answer: "1" }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-ns-c-quadrant-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
});

test("Grade 6 6.NS.C keeps partial graphing evidence explicit and separate from automatic entries", function () {
  const policy = { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] };
  const unit = { unitId: "ccss-6-ns-c" };
  const evidence = {
    state: "partial-graphing-observation-locked",
    autoEvidenceIds: ["6.NS.C.6-quadrant-classification", "6.NS.C.7-signed-rational-order", "6.NS.C.8-same-axis-distance"],
    lockedEvidenceByLocale: localText("교사 관찰 잠금", "Teacher observation locked", "教师观察锁定")
  };
  assert.doesNotThrow(function () {
    validator.validateStandardsEvidence(evidence, policy, unit, "synthetic-ns-c-evidence");
  });
  assert.doesNotThrow(function () {
    validator.validateNscAutomaticEvidence([
      { expectedResponse: "1", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "2", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "3", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "4", arithmeticCheck: { kind: "quadrant-classification" } },
      { arithmeticCheck: { kind: "signed-rational-comparison", basis: "signed-value" } },
      { arithmeticCheck: { kind: "signed-rational-operation", operation: "axis-distance" } }
    ], unit, "synthetic-ns-c-evidence");
  });
  assert.throws(function () {
    validator.validateStandardsEvidence(Object.assign({}, evidence, { state: "plan-complete" }), policy, unit, "synthetic-ns-c-evidence");
  }, /STANDARDS_EVIDENCE_INVALID/);
  assert.throws(function () {
    validator.validateNscAutomaticEvidence([
      { expectedResponse: "1", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "2", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "3", arithmeticCheck: { kind: "quadrant-classification" } },
      { expectedResponse: "4", arithmeticCheck: { kind: "quadrant-classification" } },
      { arithmeticCheck: { kind: "signed-rational-comparison", basis: "absolute-magnitude" } },
      { arithmeticCheck: { kind: "signed-rational-operation", operation: "axis-distance" } }
    ], unit, "synthetic-ns-c-evidence");
  }, /NSC_AUTOMATIC_EVIDENCE_INCOMPLETE/);
  assert.throws(function () {
    validator.validateNscAutomaticEvidence([
      { arithmeticCheck: { kind: "signed-rational-comparison" } },
      { arithmeticCheck: { kind: "signed-rational-operation", operation: "axis-distance" } }
    ], unit, "synthetic-ns-c-evidence");
  }, /NSC_AUTOMATIC_EVIDENCE_INCOMPLETE/);
});

test("Grade 6 6.NS.C allows only explicit non-automatic teacher observation rubrics", function () {
  const pack = syntheticWorkbookPack("ccss-6-ns-c");
  const responseComponents = pack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const references = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  function referenceFor(component) {
    return references.find(function (reference) { return reference.componentId === component.componentId; });
  }
  [
    { component: responseComponents[0], expectedResponse: "1", arithmeticCheck: { kind: "quadrant-classification", xNumerator: 3, xDenominator: 5, yNumerator: 7, yDenominator: 9 } },
    { component: responseComponents[1], expectedResponse: "2", arithmeticCheck: { kind: "quadrant-classification", xNumerator: -3, xDenominator: 5, yNumerator: 7, yDenominator: 9 } },
    { component: responseComponents[2], expectedResponse: "3", arithmeticCheck: { kind: "quadrant-classification", xNumerator: -3, xDenominator: 5, yNumerator: -7, yDenominator: 9 } },
    { component: responseComponents[3], expectedResponse: "4", arithmeticCheck: { kind: "quadrant-classification", xNumerator: 3, xDenominator: 5, yNumerator: -7, yDenominator: 9 } }
  ].forEach(function (entry) {
    const answerReference = referenceFor(entry.component);
    answerReference.expectedResponse = entry.expectedResponse;
    answerReference.arithmeticCheck = entry.arithmeticCheck;
  });

  const comparisonComponent = responseComponents[4];
  const comparisonReference = referenceFor(comparisonComponent);
  comparisonComponent.responseMode = "comparison-symbol-exact";
  comparisonComponent.contentByLocale = localText("두 수 사이 빈칸에 알맞은 기호를 쓰세요.", "Write the correct sign in the blank between the values.", "在两个数之间的空格里写出正确的符号。");
  comparisonReference.responseMode = "comparison-symbol-exact";
  comparisonReference.expectedResponse = "<";
  comparisonReference.arithmeticCheck = { kind: "signed-rational-comparison", basis: "signed-value", leftNumerator: -3, leftDenominator: 4, rightNumerator: -1, rightDenominator: 2 };

  const distanceComponent = responseComponents[5];
  const distanceReference = referenceFor(distanceComponent);
  distanceReference.expectedResponse = "1";
  distanceReference.arithmeticCheck = {
    kind: "signed-rational-operation", operation: "axis-distance", axis: "horizontal",
    firstXNumerator: 0, firstXDenominator: 1, firstYNumerator: 1, firstYDenominator: 2,
    secondXNumerator: 1, secondXDenominator: 1, secondYNumerator: 2, secondYDenominator: 4
  };

  const lessonPlan = pack.teacherArtifacts.find(function (artifact) { return artifact.resourceBinding.resourceType === "lesson-plan"; });
  lessonPlan.components.push({
    componentId: "tcmp-dft-nsc-observation-lesson",
    componentType: "teacher-observation-rubric",
    sequence: lessonPlan.components.length + 1,
    contentByLocale: localText("교사 관찰", "Teacher observation", "教师观察")
  });
  const assignmentBuilder = pack.teacherArtifacts.find(function (artifact) { return artifact.resourceBinding.resourceType === "assignment-builder"; });
  assignmentBuilder.components.push({
    componentId: "tcmp-dft-nsc-observation-home",
    componentType: "teacher-observation-rubric",
    sequence: assignmentBuilder.components.length + 1,
    contentByLocale: localText("교사 관찰", "Teacher observation", "教师观察")
  });
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-ns-c-observation.json");
  });

  const duplicateObservationPack = JSON.parse(JSON.stringify(pack));
  const duplicateLesson = duplicateObservationPack.teacherArtifacts.find(function (artifact) { return artifact.resourceBinding.resourceType === "lesson-plan"; });
  duplicateLesson.components.push({
    componentId: "tcmp-dft-nsc-observation-duplicate",
    componentType: "teacher-observation-rubric",
    sequence: duplicateLesson.components.length + 1,
    contentByLocale: localText("교사 관찰", "Teacher observation", "教师观察")
  });
  assert.throws(function () {
    validator.validatePack(duplicateObservationPack, "synthetic-ns-c-observation-duplicate.json");
  }, /TEACHER_COMPONENT_INVALID/);

  const nonNscPack = syntheticWorkbookPack();
  const nonNscLesson = nonNscPack.teacherArtifacts.find(function (artifact) { return artifact.resourceBinding.resourceType === "lesson-plan"; });
  nonNscLesson.components.push({
    componentId: "tcmp-dft-rpa-observation",
    componentType: "teacher-observation-rubric",
    sequence: nonNscLesson.components.length + 1,
    contentByLocale: localText("교사 관찰", "Teacher observation", "教师观察")
  });
  assert.throws(function () {
    validator.validatePack(nonNscPack, "synthetic-rp-a-observation.json");
  }, /TEACHER_COMPONENT_INVALID/);
});

test("Grade 6 isolated whole-number powers use a bounded BigInt contract and independent repeated multiplication", function () {
  for (let base = 2; base <= 12; base += 1) {
    for (let exponent = 2; exponent <= 5; exponent += 1) {
      assert.equal(validator.canonicalAnswer({ kind: "whole-number-power", base, exponent }, "synthetic-eea-power"), independentlyRepeatedWholePower(base, exponent));
    }
  }
  assert.equal(
    validator.canonicalAnswer({ kind: "whole-number-power", base: 12, exponent: 4 }, "synthetic-eea-power-boundary"),
    independentlyRepeatedWholePower(12, 4)
  );
  [
    { kind: "whole-number-power", base: 1, exponent: 2 },
    { kind: "whole-number-power", base: 13, exponent: 2 },
    { kind: "whole-number-power", base: 2, exponent: 1 },
    { kind: "whole-number-power", base: 2, exponent: 6 },
    { kind: "whole-number-power", base: 0, exponent: 0 },
    { kind: "whole-number-power", base: -2, exponent: 2 },
    { kind: "whole-number-power", base: 2.5, exponent: 2 },
    { kind: "whole-number-power", base: 2, exponent: 2.5 },
    { kind: "whole-number-power", base: "2", exponent: 2 },
    { kind: "whole-number-power", base: 2, exponent: "2" },
    { kind: "whole-number-power", base: Number.NaN, exponent: 2 },
    { kind: "whole-number-power", base: 2, exponent: Number.POSITIVE_INFINITY },
    { kind: "whole-number-power", base: 8, exponent: 4, result: "not-permitted" }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-eea-power-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
  const inherited = Object.create({ kind: "whole-number-power", base: 2, exponent: 2 });
  assert.throws(function () {
    validator.canonicalAnswer(inherited, "synthetic-eea-power-inherited");
  }, /ARITHMETIC_CHECK_INVALID/);
  const accessor = { kind: "whole-number-power", exponent: 2 };
  Object.defineProperty(accessor, "base", { enumerable: true, get: function () { return 2; } });
  assert.throws(function () {
    validator.canonicalAnswer(accessor, "synthetic-eea-power-accessor");
  }, /ARITHMETIC_CHECK_INVALID/);
});

test("Grade 6 6.EE.A keeps isolated power evaluation explicit and locks the remaining expression evidence", function () {
  const policy = { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] };
  const unit = { unitId: "ccss-6-ee-a" };
  const evidence = syntheticEeaStandardsEvidence();
  assert.doesNotThrow(function () {
    validator.validateStandardsEvidence(evidence, policy, unit, "synthetic-eea-evidence");
  });
  [
    Object.assign({}, evidence, { state: "plan-complete" }),
    Object.assign({}, evidence, { autoEvidenceIds: [] }),
    Object.assign({}, evidence, { autoEvidenceIds: [evidence.autoEvidenceIds[0], evidence.autoEvidenceIds[0]] }),
    Object.assign({}, evidence, { lockedEvidenceByLocale: Object.assign({}, evidence.lockedEvidenceByLocale, { en: "6.EE.A.1 only" }) })
  ].forEach(function (candidate) {
    assert.throws(function () {
      validator.validateStandardsEvidence(candidate, policy, unit, "synthetic-eea-evidence-invalid");
    }, /STANDARDS_EVIDENCE_INVALID/);
  });

  const pack = syntheticWorkbookPack("ccss-6-ee-a");
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-eea-pack.json");
  });
  const answerReferences = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  assert.equal(answerReferences.length, 22);
  assert.deepEqual(new Set(answerReferences.map(function (answerReference) { return answerReference.arithmeticCheck.exponent; })), new Set([2, 3, 4, 5]));
  assert.deepEqual(new Set(answerReferences.map(function (answerReference) { return answerReference.arithmeticCheck.kind; })), new Set(["whole-number-power"]));

  const genericContractPack = JSON.parse(JSON.stringify(pack));
  const genericReference = genericContractPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0];
  genericReference.expectedResponse = "1";
  genericReference.arithmeticCheck = { kind: "whole-product", perGroup: 1, groups: 1 };
  assert.throws(function () {
    validator.validatePack(genericContractPack, "synthetic-eea-generic-contract.json");
  }, /EEA_RESPONSE_CONTRACT_INVALID/);

  const driftPack = JSON.parse(JSON.stringify(pack));
  const driftComponent = driftPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  driftComponent.contentByLocale.en = "Compute 8^4.";
  assert.throws(function () {
    validator.validatePack(driftPack, "synthetic-eea-translation-drift.json");
  }, /EEA_POWER_PROMPT_INVALID/);

  const unicodePowerPack = JSON.parse(JSON.stringify(pack));
  const unicodePowerComponent = unicodePowerPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  unicodePowerComponent.contentByLocale["zh-Hans"] = "计算 8²。";
  assert.throws(function () {
    validator.validatePack(unicodePowerPack, "synthetic-eea-unicode-power.json");
  }, /EEA_POWER_PROMPT_INVALID/);

  const repeatedLanguageDriftPack = JSON.parse(JSON.stringify(pack));
  const repeatedLanguageDriftComponent = repeatedLanguageDriftPack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  })[1];
  repeatedLanguageDriftComponent.contentByLocale.en = "Find the value of 9 × 9.";
  assert.throws(function () {
    validator.validatePack(repeatedLanguageDriftPack, "synthetic-eea-repeated-language-drift.json");
  }, /EEA_POWER_PROMPT_INVALID/);

  [
    { locale: "ko", content: "다음 식의 값을 구하세요: 8^2. 육십사" },
    { locale: "en", content: "Find the value of 8^2. sixty-four" },
    { locale: "zh-Hans", content: "求 8^2 的值。六十四" }
  ].forEach(function (mutation) {
    const wordLeakPack = JSON.parse(JSON.stringify(pack));
    const wordLeakComponent = wordLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
      return component.responseMode !== null;
    });
    wordLeakComponent.contentByLocale[mutation.locale] = mutation.content;
    assert.throws(function () {
      validator.validatePack(wordLeakPack, `synthetic-eea-number-word-${mutation.locale}.json`);
    }, /EEA_POWER_PROMPT_INVALID/);
  });

  const mostlyRepeatedPack = JSON.parse(JSON.stringify(pack));
  const mostlyRepeatedComponents = new Map(mostlyRepeatedPack.studentSections.flatMap(function (section) { return section.components; }).map(function (component) {
    return [component.componentId, component];
  }));
  mostlyRepeatedPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).filter(function (answerReference) {
    return answerReference.arithmeticCheck.exponent === 5;
  }).forEach(function (answerReference) {
    const check = answerReference.arithmeticCheck;
    const display = Array.from({ length: check.exponent }, function () { return String(check.base); }).join(" × ");
    mostlyRepeatedComponents.get(answerReference.componentId).contentByLocale = localText(
      `다음 반복곱의 값을 구하세요: ${display}.`,
      `Find the value of the repeated product ${display}.`,
      `求重复乘积 ${display} 的值。`
    );
  });
  assert.throws(function () {
    validator.validatePack(mostlyRepeatedPack, "synthetic-eea-mostly-repeated.json");
  }, /EEA_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const workedExampleLeakPack = JSON.parse(JSON.stringify(pack));
  const workedExample = workedExampleLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "worked-example";
  });
  const firstReference = workedExampleLeakPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0];
  const firstCheck = firstReference.arithmeticCheck;
  const firstFactors = Array.from({ length: firstCheck.exponent }, function () { return String(firstCheck.base); }).join(" × ");
  const solvedDisplay = `${firstCheck.base}^${firstCheck.exponent} = ${firstFactors} = ${firstReference.expectedResponse}`;
  workedExample.contentByLocale = localText(`예시: ${solvedDisplay}.`, `Worked example: ${solvedDisplay}.`, `示例：${solvedDisplay}。`);
  assert.throws(function () {
    validator.validatePack(workedExampleLeakPack, "synthetic-eea-worked-example-leak.json");
  }, /EEA_WORKED_EXAMPLE_ANSWER_LEAK/);

  const workedExampleTeXPack = JSON.parse(JSON.stringify(pack));
  const workedExampleTeX = workedExampleTeXPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "worked-example";
  });
  workedExampleTeX.contentByLocale.ko = `$${workedExampleTeX.contentByLocale.ko}$`;
  assert.throws(function () {
    validator.validatePack(workedExampleTeXPack, "synthetic-eea-worked-example-tex.json");
  }, /EEA_WORKED_EXAMPLE_INVALID/);

  const reversedWorkedExamplePack = JSON.parse(JSON.stringify(pack));
  const reversedWorkedExample = reversedWorkedExamplePack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "worked-example";
  });
  reversedWorkedExample.contentByLocale = localText(
    "예시: 169 = 13^2 = 13 × 13.",
    "Worked example: 169 = 13^2 = 13 × 13.",
    "示例：169 = 13^2 = 13 × 13。"
  );
  assert.throws(function () {
    validator.validatePack(reversedWorkedExamplePack, "synthetic-eea-worked-example-reversed.json");
  }, /EEA_WORKED_EXAMPLE_INVALID/);

  const conceptSummaryLeakPack = JSON.parse(JSON.stringify(pack));
  const conceptSummary = conceptSummaryLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  const syntheticExpectedResponse = conceptSummaryLeakPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0].expectedResponse;
  conceptSummary.contentByLocale = localText(
    `개념 확인 ${syntheticExpectedResponse}.`,
    `Concept check ${syntheticExpectedResponse}.`,
    `概念检查 ${syntheticExpectedResponse}。`
  );
  assert.throws(function () {
    validator.validatePack(conceptSummaryLeakPack, "synthetic-eea-concept-summary-leak.json");
  }, /EEA_NONRESPONSE_NUMERIC_NOT_ALLOWED/);

  ["Concept check 999."].forEach(function (content, index) {
    const nonWorkedNumericNotationPack = JSON.parse(JSON.stringify(pack));
    const nonWorkedNumericNotation = nonWorkedNumericNotationPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
      return component.componentType === "concept-summary";
    });
    nonWorkedNumericNotation.contentByLocale.en = content;
    assert.throws(function () {
      validator.validatePack(nonWorkedNumericNotationPack, `synthetic-eea-nonworked-numeric-notation-${index}.json`);
    }, /EEA_NONRESPONSE_NUMERIC_NOT_ALLOWED/);
  });

  const benignEnglishConceptPack = JSON.parse(JSON.stringify(pack));
  const benignEnglishConcept = benignEnglishConceptPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  benignEnglishConcept.contentByLocale.en = "I review exponent notation.";
  assert.doesNotThrow(function () {
    validator.validatePack(benignEnglishConceptPack, "synthetic-eea-benign-english-pronoun.json");
  });

  const romanLeakPack = JSON.parse(JSON.stringify(pack));
  const romanLeakConcept = romanLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  romanLeakConcept.contentByLocale.en = "Concept lxiv.";
  assert.throws(function () {
    validator.validatePack(romanLeakPack, "synthetic-eea-roman-leak.json");
  }, /EEA_CROSS_STUDENT_ANSWER_LEAK/);

  const groupedExpectedResponse = answerReferences.find(function (answerReference) {
    return answerReference.expectedResponse.length >= 4;
  }).expectedResponse;
  [",", ".", String.fromCharCode(0x00a0)].forEach(function (separator, index) {
    const groupedDecimalLeakPack = JSON.parse(JSON.stringify(pack));
    const groupedDecimalSummary = groupedDecimalLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
      return component.componentType === "concept-summary";
    });
    const groupedDecimal = groupedExpectedResponse.replace(/\B(?=(\d{3})+(?!\d))/gu, separator);
    groupedDecimalSummary.contentByLocale.en = `Concept check ${groupedDecimal}.`;
    assert.equal(validator.containsEeaNumericEquivalentAnswer(groupedDecimal, groupedExpectedResponse), true);
    assert.throws(function () {
      validator.validatePack(groupedDecimalLeakPack, `synthetic-eea-grouped-decimal-leak-${index}.json`);
    }, /EEA_NONRESPONSE_NUMERIC_NOT_ALLOWED/);
  });
  [`0${groupedExpectedResponse}`, `+${groupedExpectedResponse}`, `${groupedExpectedResponse}.0`, `${groupedExpectedResponse},0`].forEach(function (display, index) {
    const numericEquivalentLeakPack = JSON.parse(JSON.stringify(pack));
    const numericEquivalentSummary = numericEquivalentLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
      return component.componentType === "concept-summary";
    });
    numericEquivalentSummary.contentByLocale.en = `Concept check ${display}.`;
    assert.equal(validator.containsEeaNumericEquivalentAnswer(display, groupedExpectedResponse), true);
    assert.throws(function () {
      validator.validatePack(numericEquivalentLeakPack, `synthetic-eea-numeric-equivalent-leak-${index}.json`);
    }, /EEA_NONRESPONSE_NUMERIC_NOT_ALLOWED/);
  });

  const localizedWordLeakPack = JSON.parse(JSON.stringify(pack));
  const localizedWordSummary = localizedWordLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  localizedWordSummary.contentByLocale = localText(
    "개념 확인 백이십일.",
    "Concept check one hundred twenty-one.",
    "概念检查一百二十一。"
  );
  assert.throws(function () {
    validator.validatePack(localizedWordLeakPack, "synthetic-eea-localized-word-leak.json");
  }, /EEA_CROSS_STUDENT_ANSWER_LEAK/);

  const englishAndWordLeakPack = JSON.parse(JSON.stringify(pack));
  const englishAndWordSummary = englishAndWordLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  englishAndWordSummary.contentByLocale.en = "Concept check a hundred and twenty-one.";
  assert.throws(function () {
    validator.validatePack(englishAndWordLeakPack, "synthetic-eea-english-and-word-leak.json");
  }, /EEA_CROSS_STUDENT_ANSWER_LEAK/);
  const englishVariantAnswer = answerReferences.find(function (answerReference) {
    return answerReference.arithmeticCheck.base === 11 && answerReference.arithmeticCheck.exponent === 2;
  }).expectedResponse;
  assert.equal(validator.containsEeaLocalizedAnswerWord("Concept check one hundred twenty−one.", englishVariantAnswer), true);

  const koreanSpacedWordLeakPack = JSON.parse(JSON.stringify(pack));
  const koreanSpacedWordSummary = koreanSpacedWordLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  koreanSpacedWordSummary.contentByLocale.ko = "개념 확인 백 이십 일.";
  assert.throws(function () {
    validator.validatePack(koreanSpacedWordLeakPack, "synthetic-eea-korean-spaced-word-leak.json");
  }, /EEA_CROSS_STUDENT_ANSWER_LEAK/);

  const chineseTwoWordLeakPack = JSON.parse(JSON.stringify(pack));
  const chineseTwoWordSummary = chineseTwoWordLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  chineseTwoWordSummary.contentByLocale["zh-Hans"] = "概念检查两万零七百三十六。";
  assert.throws(function () {
    validator.validatePack(chineseTwoWordLeakPack, "synthetic-eea-chinese-two-word-leak.json");
  }, /EEA_CROSS_STUDENT_ANSWER_LEAK/);

  // A non-contract sentinel keeps lexical guard coverage independent of the
  // external private response set; EE.A power answers begin above this value.
  const nonPrivateWordSentinel = "1";
  ["개념 확인 일.", "개념 확인 하나.", "Concept check one.", "概念检查一。"].forEach(function (content) {
    assert.equal(validator.containsEeaLocalizedAnswerWord(content, nonPrivateWordSentinel), true);
  });
  ["개념 확인 한 개.", "개념 확인 한 개의."].forEach(function (content) {
    assert.equal(validator.containsEeaLocalizedAnswerWord(content, nonPrivateWordSentinel), true);
  });
  assert.equal(validator.containsEeaLocalizedAnswerWord("사용 안내", nonPrivateWordSentinel), false);
  assert.equal(validator.containsEeaLocalizedAnswerWord("한, 알겠습니다.", nonPrivateWordSentinel), false);

  const tenThousandAnswer = answerReferences.find(function (answerReference) {
    return answerReference.arithmeticCheck.base === 10 && answerReference.arithmeticCheck.exponent === 4;
  }).expectedResponse;
  assert.equal(validator.containsEeaLocalizedAnswerWord("개념 확인 일만.", tenThousandAnswer), true);
  const englishThousandsAnswer = answerReferences.find(function (answerReference) {
    return answerReference.arithmeticCheck.base === 11 && answerReference.arithmeticCheck.exponent === 4;
  }).expectedResponse;
  assert.equal(validator.containsEeaLocalizedAnswerWord("Concept check fourteen thousand and six hundred forty-one.", englishThousandsAnswer), true);
  assert.equal(validator.containsEeaEnglishNumberWord("Concept check a thousand one.", "one thousand one"), true);
  const colloquialHundredsAnswer = answerReferences.find(function (answerReference) {
    return answerReference.arithmeticCheck.base === 8 && answerReference.arithmeticCheck.exponent === 4;
  }).expectedResponse;
  assert.equal(validator.containsEeaLocalizedAnswerWord("Concept check forty hundred ninety-six.", colloquialHundredsAnswer), true);
  const chineseVariantAnswer = answerReferences.find(function (answerReference) {
    return answerReference.arithmeticCheck.base === 12 && answerReference.arithmeticCheck.exponent === 4;
  }).expectedResponse;
  assert.equal(validator.containsEeaLocalizedAnswerWord("概念检查兩萬零七百三十六。", chineseVariantAnswer), true);

  const duplicatePowerPack = JSON.parse(JSON.stringify(pack));
  const duplicateComponents = duplicatePowerPack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const duplicateReferences = duplicatePowerPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  duplicateComponents[1].contentByLocale = duplicateComponents[0].contentByLocale;
  duplicateReferences[1].expectedResponse = duplicateReferences[0].expectedResponse;
  duplicateReferences[1].arithmeticCheck = duplicateReferences[0].arithmeticCheck;
  assert.throws(function () {
    validator.validatePack(duplicatePowerPack, "synthetic-eea-duplicate-power.json");
  }, /EEA_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const missingObservationPack = JSON.parse(JSON.stringify(pack));
  const advancedBuilder = missingObservationPack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "assignment-builder" && artifact.resourceBinding.levelId === "advanced";
  });
  advancedBuilder.components = advancedBuilder.components.filter(function (component) {
    return component.componentType !== "teacher-observation-rubric";
  });
  assert.throws(function () {
    validator.validatePack(missingObservationPack, "synthetic-eea-missing-observation.json");
  }, /EEA_TEACHER_OBSERVATION_INCOMPLETE/);

  const invalidObservationPack = JSON.parse(JSON.stringify(pack));
  const solutionGuide = invalidObservationPack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "solution-guide";
  });
  solutionGuide.components.push({
    componentId: "tcmp-dft-eea-invalid-observation",
    componentType: "teacher-observation-rubric",
    sequence: solutionGuide.components.length + 1,
    contentByLocale: localText("교사 관찰", "Teacher observation", "教师观察")
  });
  assert.throws(function () {
    validator.validatePack(invalidObservationPack, "synthetic-eea-invalid-observation.json");
  }, /TEACHER_COMPONENT_INVALID/);
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

test("Grade 6 6.EE.B keeps finite positive-whole equality substitution truth explicit and locks the remaining equation evidence", function () {
  const policy = { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] };
  const unit = { unitId: "ccss-6-ee-b" };
  const evidence = syntheticEebStandardsEvidence();
  assert.doesNotThrow(function () {
    validator.validateStandardsEvidence(evidence, policy, unit, "synthetic-eeb-evidence");
  });
  [
    Object.assign({}, evidence, { state: "plan-complete" }),
    Object.assign({}, evidence, { autoEvidenceIds: [] }),
    Object.assign({}, evidence, { autoEvidenceIds: [evidence.autoEvidenceIds[0], evidence.autoEvidenceIds[0]] }),
    Object.assign({}, evidence, { lockedEvidenceByLocale: Object.assign({}, evidence.lockedEvidenceByLocale, { en: "6.EE.B.5 only" }) })
  ].forEach(function (candidate) {
    assert.throws(function () {
      validator.validateStandardsEvidence(candidate, policy, unit, "synthetic-eeb-evidence-invalid");
    }, /STANDARDS_EVIDENCE_INVALID/);
  });
  const changedEvidenceLocale = JSON.parse(JSON.stringify(evidence));
  changedEvidenceLocale.lockedEvidenceByLocale.en += " Additional wording.";
  assert.throws(function () {
    validator.validateStandardsEvidence(changedEvidenceLocale, policy, unit, "synthetic-eeb-evidence-locale-parity");
  }, /STANDARDS_EVIDENCE_INVALID/);

  SYNTHETIC_EEB_SUBSTITUTION_CASES.forEach(function (check) {
    const independentlyMatching = Array.from({ length: 24 }, function (_, index) { return index + 1; }).filter(function (candidate) {
      return BigInt(candidate) + BigInt(check.addend) === BigInt(check.total);
    });
    assert.equal(independentlyMatching.length, 1);
    assert.equal(
      validator.canonicalAnswer(Object.assign({}, check, { candidateSet: Array.from(check.candidateSet) }), "synthetic-eeb-canonical"),
      independentlySubstitutionTruth(check)
    );
  });
  assert.equal(
    validator.canonicalAnswer({
      kind: "positive-whole-equality-substitution-truth",
      form: "x-plus-p-equals-q",
      candidateSet: [1, 2, 3],
      candidate: 2,
      addend: 1,
      total: 2
    }, "synthetic-eeb-false-candidate-with-set-solution"),
    "false"
  );

  [
    { kind: "positive-whole-equality-substitution-truth", form: "x-plus-p-equals-q", candidateSet: [1, 2], candidate: 1, addend: 1, total: 2 },
    { kind: "positive-whole-equality-substitution-truth", form: "x-plus-p-equals-q", candidateSet: [1, 1, 2], candidate: 1, addend: 1, total: 2 },
    { kind: "positive-whole-equality-substitution-truth", form: "x-plus-p-equals-q", candidateSet: [1, 2, 3], candidate: 1, addend: 0, total: 1 },
    { kind: "positive-whole-equality-substitution-truth", form: "p-times-x-equals-q", candidateSet: [1, 2, 3], candidate: 1, addend: 1, total: 2 },
    { kind: "positive-whole-equality-substitution-truth", form: "x-plus-p-equals-q", candidateSet: [1, 2, 3], candidate: 1, addend: 1, total: 50 },
    { kind: "positive-whole-equality-substitution-truth", form: "x-plus-p-equals-q", candidateSet: [1, 2, 3], candidate: 1.5, addend: 1, total: 3 }
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalAnswer(check, "synthetic-eeb-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });

  const pack = syntheticWorkbookPack("ccss-6-ee-b");
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-eeb-pack.json");
  });
  const answerReferences = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  assert.equal(answerReferences.length, 22);
  assert.deepEqual(new Set(answerReferences.map(function (answerReference) { return answerReference.responseMode; })), new Set(["truth-value-exact"]));
  assert.deepEqual(new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; })), new Set(["true", "false"]));
  assert.equal(answerReferences.filter(function (answerReference) { return answerReference.expectedResponse === "true"; }).length, 11);
  assert.equal(answerReferences.filter(function (answerReference) { return answerReference.expectedResponse === "false"; }).length, 11);

  const genericContractPack = JSON.parse(JSON.stringify(pack));
  const genericReference = genericContractPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0];
  genericReference.responseMode = "numeric-exact";
  genericReference.expectedResponse = "1";
  genericReference.arithmeticCheck = { kind: "whole-quotient", total: 1, groups: 1 };
  assert.throws(function () {
    validator.validatePack(genericContractPack, "synthetic-eeb-generic-contract.json");
  }, /(?:ANSWER_REFERENCE_MODE_MISMATCH|EEB_RESPONSE_CONTRACT_INVALID)/);

  const truthWordPromptPack = JSON.parse(JSON.stringify(pack));
  const truthWordPrompt = truthWordPromptPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  truthWordPrompt.contentByLocale.en += " true";
  assert.throws(function () {
    validator.validatePack(truthWordPromptPack, "synthetic-eeb-truth-word-prompt.json");
  }, /EEB_SUBSTITUTION_PROMPT_INVALID/);

  const unicodeEquationPack = JSON.parse(JSON.stringify(pack));
  const unicodeEquationPrompt = unicodeEquationPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  unicodeEquationPrompt.contentByLocale.ko = unicodeEquationPrompt.contentByLocale.ko.replace("x +", "ｘ +");
  assert.throws(function () {
    validator.validatePack(unicodeEquationPack, "synthetic-eeb-unicode-equation.json");
  }, /EEB_SUBSTITUTION_PROMPT_INVALID/);

  const duplicateFactPack = JSON.parse(JSON.stringify(pack));
  const duplicateComponents = duplicateFactPack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const duplicateReferences = duplicateFactPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  const firstCheck = duplicateReferences[0].arithmeticCheck;
  duplicateComponents[1].contentByLocale = syntheticEebSubstitutionPrompt(firstCheck);
  duplicateReferences[1].expectedResponse = duplicateReferences[0].expectedResponse;
  duplicateReferences[1].arithmeticCheck = JSON.parse(JSON.stringify(firstCheck));
  assert.throws(function () {
    validator.validatePack(duplicateFactPack, "synthetic-eeb-duplicate-fact.json");
  }, /EEB_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const duplicateEquationPack = JSON.parse(JSON.stringify(pack));
  const duplicateEquationComponents = duplicateEquationPack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const duplicateEquationReferences = duplicateEquationPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  const firstEquationCheck = duplicateEquationReferences[0].arithmeticCheck;
  const equationSolution = firstEquationCheck.total - firstEquationCheck.addend;
  const alternateCandidates = Array.from({ length: 24 }, function (_, index) { return index + 1; }).filter(function (candidate) {
    return candidate !== equationSolution;
  });
  const duplicateEquationCheck = Object.assign({}, firstEquationCheck, {
    candidateSet: [equationSolution, alternateCandidates[0], alternateCandidates[1]].sort(function (left, right) { return left - right; }),
    candidate: alternateCandidates[0]
  });
  duplicateEquationComponents[1].contentByLocale = syntheticEebSubstitutionPrompt(duplicateEquationCheck);
  duplicateEquationReferences[1].expectedResponse = independentlySubstitutionTruth(duplicateEquationCheck);
  duplicateEquationReferences[1].arithmeticCheck = duplicateEquationCheck;
  assert.throws(function () {
    validator.validatePack(duplicateEquationPack, "synthetic-eeb-duplicate-equation.json");
  }, /EEB_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const workedExampleFactLeakPack = JSON.parse(JSON.stringify(pack));
  const workedExample = workedExampleFactLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "worked-example";
  });
  const trueCheck = workedExampleFactLeakPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).find(function (answerReference) {
    return answerReference.expectedResponse === "true";
  }).arithmeticCheck;
  workedExample.contentByLocale = syntheticEebWorkedExample({ candidate: trueCheck.candidate, addend: trueCheck.addend, total: trueCheck.total });
  assert.throws(function () {
    validator.validatePack(workedExampleFactLeakPack, "synthetic-eeb-worked-example-fact-leak.json");
  }, /EEB_WORKED_EXAMPLE_FACT_LEAK/);

  const workedExampleEquationLeakPack = JSON.parse(JSON.stringify(pack));
  const equationLeakExample = workedExampleEquationLeakPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "worked-example";
  });
  const falseCheck = workedExampleEquationLeakPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).find(function (answerReference) {
    return answerReference.expectedResponse === "false";
  }).arithmeticCheck;
  const matchingCandidate = falseCheck.total - falseCheck.addend;
  assert.notEqual(matchingCandidate, falseCheck.candidate);
  equationLeakExample.contentByLocale = syntheticEebWorkedExample({
    candidate: matchingCandidate,
    addend: falseCheck.addend,
    total: falseCheck.total
  });
  assert.throws(function () {
    validator.validatePack(workedExampleEquationLeakPack, "synthetic-eeb-worked-example-equation-leak.json");
  }, /EEB_WORKED_EXAMPLE_FACT_LEAK/);

  const numericSummaryPack = JSON.parse(JSON.stringify(pack));
  const numericSummary = numericSummaryPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  numericSummary.contentByLocale.en = "Substitution note 9.";
  assert.throws(function () {
    validator.validatePack(numericSummaryPack, "synthetic-eeb-numeric-summary.json");
  }, /EEB_NONRESPONSE_TEMPLATE_INVALID/);

  const truthLabelSummaryPack = JSON.parse(JSON.stringify(pack));
  const truthLabelSummary = truthLabelSummaryPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  truthLabelSummary.contentByLocale.en = "A true conclusion is not displayed here.";
  assert.throws(function () {
    validator.validatePack(truthLabelSummaryPack, "synthetic-eeb-truth-label-summary.json");
  }, /EEB_NONRESPONSE_TEMPLATE_INVALID/);
  const semanticBypassSummaryPack = JSON.parse(JSON.stringify(pack));
  const semanticBypassSummary = semanticBypassSummaryPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.componentType === "concept-summary";
  });
  semanticBypassSummary.contentByLocale.en = "The first candidate makes the equality affirmative.";
  assert.throws(function () {
    validator.validatePack(semanticBypassSummaryPack, "synthetic-eeb-semantic-bypass-summary.json");
  }, /EEB_NONRESPONSE_TEMPLATE_INVALID/);
  [
    ["\\mathit{true}", /EEB_NONRESPONSE_TEX_NOT_ALLOWED/],
    ["Substitution note 9.", /EEB_NONRESPONSE_NUMERIC_NOT_ALLOWED/],
    ["twenty", /EEB_NONRESPONSE_NUMBER_WORD_NOT_ALLOWED/],
    ["壹", /EEB_NONRESPONSE_NUMBER_WORD_NOT_ALLOWED/],
    ["IX", /EEB_NONRESPONSE_NUMBER_WORD_NOT_ALLOWED/],
    ["Ⅸ", /EEB_NONRESPONSE_NUMBER_WORD_NOT_ALLOWED/],
    ["true", /EEB_NONRESPONSE_TRUTH_LABEL_NOT_ALLOWED/]
  ].forEach(function (entry) {
    assert.throws(function () {
      validator.assertEebNonWorkedStudentTextHasNoNumericOrTruthResponse(entry[0], "synthetic-eeb-nonresponse-guard");
    }, entry[1]);
  });
  assert.equal(validator.containsEebTruthResponseLabel("Teacher decides whether it holds."), false);
  assert.equal(validator.containsEebTruthResponseLabel("true"), true);
  assert.equal(validator.containsEebTruthResponseLabel("거짓"), true);
  assert.equal(validator.containsEebTruthResponseLabel("真"), true);
  assert.equal(validator.containsEebTruthResponseLabel("这是学习说明。"), false);

  const missingObservationPack = JSON.parse(JSON.stringify(pack));
  const missingObservation = missingObservationPack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "lesson-plan";
  });
  missingObservation.components = missingObservation.components.filter(function (component) {
    return component.componentType !== "teacher-observation-rubric";
  });
  assert.throws(function () {
    validator.validatePack(missingObservationPack, "synthetic-eeb-missing-observation.json");
  }, /EEB_TEACHER_OBSERVATION_INCOMPLETE/);
  const changedObservationLocalePack = JSON.parse(JSON.stringify(pack));
  const changedObservation = changedObservationLocalePack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "lesson-plan";
  }).components.find(function (component) {
    return component.componentType === "teacher-observation-rubric";
  });
  changedObservation.contentByLocale.en += " Additional wording.";
  assert.throws(function () {
    validator.validatePack(changedObservationLocalePack, "synthetic-eeb-observation-locale-parity.json");
  }, /EEB_TEACHER_OBSERVATION_INCOMPLETE/);
});

test("Grade 6 6.EE.C keeps finite direct-variation table coefficient evidence explicit and locks relationship reasoning", function () {
  const policy = { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] };
  const unit = { unitId: "ccss-6-ee-c" };
  const evidence = syntheticEecStandardsEvidence();
  assert.doesNotThrow(function () {
    validator.validateStandardsEvidence(evidence, policy, unit, "synthetic-eec-evidence");
  });
  [
    Object.assign({}, evidence, { state: "plan-complete" }),
    Object.assign({}, evidence, { autoEvidenceIds: [] }),
    Object.assign({}, evidence, { lockedEvidenceByLocale: Object.assign({}, evidence.lockedEvidenceByLocale, { en: "Table only." }) })
  ].forEach(function (candidate) {
    assert.throws(function () {
      validator.validateStandardsEvidence(candidate, policy, unit, "synthetic-eec-evidence-invalid");
    }, /STANDARDS_EVIDENCE_INVALID/);
  });

  SYNTHETIC_EEC_TABLE_CASES.forEach(function (check) {
    assert.equal(
      validator.canonicalDirectVariationWholeTableCoefficient(Object.assign({}, check, {
        independentValues: Array.from(check.independentValues),
        dependentValues: Array.from(check.dependentValues)
      }), "synthetic-eec-canonical"),
      independentlyDirectVariationCoefficient(check)
    );
  });
  [
    Object.assign({}, SYNTHETIC_EEC_TABLE_CASES[0], { independentValues: [0, 2, 5], dependentValues: [0, 4, 10] }),
    Object.assign({}, SYNTHETIC_EEC_TABLE_CASES[0], { rate: 1 }),
    Object.assign({}, SYNTHETIC_EEC_TABLE_CASES[0], { dependentValues: [0, 26, 29] }),
    Object.assign({}, SYNTHETIC_EEC_TABLE_CASES[0], { independentValues: [0, 14, 13] }),
    Object.assign({}, SYNTHETIC_EEC_TABLE_CASES[0], { form: "x-equals-rate-times-y" })
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalDirectVariationWholeTableCoefficient(check, "synthetic-eec-invalid");
    }, /(?:ARITHMETIC_CHECK_INVALID|EEC_TABLE_ANSWER_DISCLOSED|EEC_RELATION_TABLE_INVALID)/);
  });

  const pack = syntheticWorkbookPack("ccss-6-ee-c");
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-eec-pack.json");
  });
  const answerReferences = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  assert.equal(answerReferences.length, 22);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === "direct-variation-whole-table-coefficient";
  }));
  for (let rate = 2; rate <= 12; rate += 1) {
    assert.equal(answerReferences.filter(function (answerReference) { return answerReference.expectedResponse === String(rate); }).length, 2);
  }

  const genericContractPack = JSON.parse(JSON.stringify(pack));
  const genericReference = genericContractPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0];
  genericReference.arithmeticCheck = { kind: "whole-quotient", total: 1, groups: 1 };
  genericReference.expectedResponse = "1";
  assert.throws(function () {
    validator.validatePack(genericContractPack, "synthetic-eec-generic-contract.json");
  }, /EEC_RESPONSE_CONTRACT_INVALID/);

  const tableMismatchPack = JSON.parse(JSON.stringify(pack));
  const tableMismatch = tableMismatchPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  tableMismatch.relationTable.dependentValues[1] += 1;
  assert.throws(function () {
    validator.validatePack(tableMismatchPack, "synthetic-eec-table-mismatch.json");
  }, /EEC_RELATION_TABLE_MISMATCH/);

  const changedPromptPack = JSON.parse(JSON.stringify(pack));
  const changedPrompt = changedPromptPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  changedPrompt.contentByLocale.en += " Again.";
  assert.throws(function () {
    validator.validatePack(changedPromptPack, "synthetic-eec-prompt.json");
  }, /EEC_TABLE_PROMPT_INVALID/);

  const duplicateTablePack = JSON.parse(JSON.stringify(pack));
  const duplicateComponents = duplicateTablePack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const duplicateReferences = duplicateTablePack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  duplicateComponents[1].relationTable = JSON.parse(JSON.stringify(duplicateComponents[0].relationTable));
  duplicateReferences[1].arithmeticCheck = JSON.parse(JSON.stringify(duplicateReferences[0].arithmeticCheck));
  duplicateReferences[1].expectedResponse = duplicateReferences[0].expectedResponse;
  assert.throws(function () {
    validator.validatePack(duplicateTablePack, "synthetic-eec-duplicate-table.json");
  }, /EEC_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const answerLeakPack = JSON.parse(JSON.stringify(pack));
  answerLeakPack.frontMatter.titleByLocale.en = "6";
  assert.throws(function () {
    validator.validatePack(answerLeakPack, "synthetic-eec-student-answer-leak.json");
  }, /EEC_CROSS_STUDENT_ANSWER_LEAK/);

  [
    ["en", "Seven belongs to a different example."],
    ["ko", "일곱은 다른 예시에 속합니다."],
    ["zh-Hans", "七属于另一个示例。"],
    ["ko", "두 변수는 다른 예시에 속합니다."],
    ["zh-Hans", "两个变量属于另一个示例。"]
  ].forEach(function (entry) {
    const localizedLeakPack = JSON.parse(JSON.stringify(pack));
    localizedLeakPack.frontMatter.titleByLocale[entry[0]] = entry[1];
    assert.throws(function () {
      validator.validatePack(localizedLeakPack, `synthetic-eec-${entry[0]}-spelled-answer-leak.json`);
    }, /EEC_CROSS_STUDENT_ANSWER_LEAK/);
  });

  const romanLeakPack = JSON.parse(JSON.stringify(pack));
  romanLeakPack.frontMatter.titleByLocale.en = "VII belongs to a different example.";
  assert.throws(function () {
    validator.validatePack(romanLeakPack, "synthetic-eec-roman-answer-leak.json");
  }, /EEC_CROSS_STUDENT_ANSWER_LEAK/);

  const missingObservationPack = JSON.parse(JSON.stringify(pack));
  const missingObservation = missingObservationPack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "lesson-plan";
  });
  missingObservation.components = missingObservation.components.filter(function (component) {
    return component.componentType !== "teacher-observation-rubric";
  });
  assert.throws(function () {
    validator.validatePack(missingObservationPack, "synthetic-eec-missing-observation.json");
  }, /EEC_TEACHER_OBSERVATION_INCOMPLETE/);
});

test("Grade 6 6.G.A keeps labeled right-triangle area evidence partial, visible, and independently checked", function () {
  const policy = { required: ["ko", "en"], included: ["ko", "en", "zh-Hans"] };
  const unit = { unitId: "ccss-6-g-a" };
  const evidence = syntheticGgaStandardsEvidence();
  assert.doesNotThrow(function () {
    validator.validateStandardsEvidence(evidence, policy, unit, "synthetic-gga-evidence");
  });
  [
    Object.assign({}, evidence, { state: "plan-complete" }),
    Object.assign({}, evidence, { autoEvidenceIds: [] }),
    Object.assign({}, evidence, { autoEvidenceIds: ["6.G.A.1-full-mastery"] }),
    Object.assign({}, evidence, { lockedEvidenceByLocale: Object.assign({}, evidence.lockedEvidenceByLocale, { en: "Triangle calculation only." }) })
  ].forEach(function (candidate) {
    assert.throws(function () {
      validator.validateStandardsEvidence(candidate, policy, unit, "synthetic-gga-evidence-invalid");
    }, /STANDARDS_EVIDENCE_INVALID/);
  });

  SYNTHETIC_GGA_TRIANGLE_CASES.forEach(function (check) {
    assert.equal(
      validator.canonicalGgaRightTriangleArea(Object.assign({}, check), "synthetic-gga-canonical"),
      independentlyRightTriangleArea(check)
    );
  });
  [
    Object.assign({}, SYNTHETIC_GGA_TRIANGLE_CASES[0], { base: 3 }),
    Object.assign({}, SYNTHETIC_GGA_TRIANGLE_CASES[0], { perpendicularHeight: 3 }),
    Object.assign({}, SYNTHETIC_GGA_TRIANGLE_CASES[0], { kind: "triangle-area" }),
    Object.assign({}, SYNTHETIC_GGA_TRIANGLE_CASES[0], { svg: "<svg></svg>" })
  ].forEach(function (check) {
    assert.throws(function () {
      validator.canonicalGgaRightTriangleArea(check, "synthetic-gga-invalid");
    }, /ARITHMETIC_CHECK_INVALID/);
  });
  assert.throws(function () {
    validator.validateGgaGeometryDiagram({
      kind: validator.GGA_GEOMETRY_DIAGRAM_KIND,
      base: SYNTHETIC_GGA_TRIANGLE_CASES[0].base,
      perpendicularHeight: SYNTHETIC_GGA_TRIANGLE_CASES[0].perpendicularHeight,
      heightFoot: "left-base-endpoint",
      svg: "<svg></svg>"
    }, "synthetic-gga-raw-svg");
  }, /GGA_GEOMETRY_DIAGRAM_INVALID/);

  const pack = syntheticWorkbookPack("ccss-6-g-a");
  assert.doesNotThrow(function () {
    validator.validatePack(pack, "synthetic-gga-pack.json");
  });
  const answerReferences = pack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  assert.equal(answerReferences.length, 22);
  assert(answerReferences.every(function (answerReference) {
    return answerReference.responseMode === "numeric-exact" && answerReference.arithmeticCheck.kind === validator.GGA_TRIANGLE_AREA_CHECK_KIND;
  }));
  assert.equal(new Set(answerReferences.map(function (answerReference) { return answerReference.expectedResponse; })).size, 22);
  assert.equal(answerReferences.filter(function (answerReference) { return answerReference.evaluationMode === "automatic-evidence"; }).length, 14);
  assert.equal(answerReferences.filter(function (answerReference) { return answerReference.evaluationMode === "teacher-review-only"; }).length, 8);
  const responseComponents = pack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  assert.equal(responseComponents.length, 22);
  responseComponents.forEach(function (component) {
    assert.deepEqual(Object.keys(component.geometryDiagram).sort(), ["base", "heightFoot", "kind", "perpendicularHeight"]);
    assert.equal(component.geometryDiagram.kind, validator.GGA_GEOMETRY_DIAGRAM_KIND);
    assert.equal(component.geometryDiagram.heightFoot, "left-base-endpoint");
  });

  const advancedAutomaticPack = JSON.parse(JSON.stringify(pack));
  const advancedComponentIds = new Set(advancedAutomaticPack.studentSections.filter(function (section) {
    return section.resourceBinding.levelId === "advanced";
  }).flatMap(function (section) {
    return section.components.filter(function (component) { return component.responseMode !== null; }).map(function (component) { return component.componentId; });
  }));
  const advancedReference = advancedAutomaticPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; }).find(function (answerReference) {
    return advancedComponentIds.has(answerReference.componentId);
  });
  advancedReference.evaluationMode = "automatic-evidence";
  assert.throws(function () {
    validator.validatePack(advancedAutomaticPack, "synthetic-gga-advanced-automatic.json");
  }, /GGA_DIFFICULTY_CONTRACT_INCOMPLETE/);

  const genericContractPack = JSON.parse(JSON.stringify(pack));
  const genericReference = genericContractPack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; })[0];
  genericReference.arithmeticCheck = { kind: "whole-quotient", total: 1, groups: 1 };
  genericReference.expectedResponse = "1";
  assert.throws(function () {
    validator.validatePack(genericContractPack, "synthetic-gga-generic-contract.json");
  }, /GGA_RESPONSE_CONTRACT_INVALID/);

  const diagramMismatchPack = JSON.parse(JSON.stringify(pack));
  const diagramMismatch = diagramMismatchPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  diagramMismatch.geometryDiagram.perpendicularHeight = 14;
  assert.throws(function () {
    validator.validatePack(diagramMismatchPack, "synthetic-gga-diagram-mismatch.json");
  }, /GGA_GEOMETRY_DIAGRAM_MISMATCH/);

  const changedPromptPack = JSON.parse(JSON.stringify(pack));
  const changedPrompt = changedPromptPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  changedPrompt.contentByLocale.en += " Again.";
  assert.throws(function () {
    validator.validatePack(changedPromptPack, "synthetic-gga-prompt.json");
  }, /GGA_TRIANGLE_AREA_PROMPT_INVALID/);

  const rawSvgPack = JSON.parse(JSON.stringify(pack));
  const rawSvgComponent = rawSvgPack.studentSections.flatMap(function (section) { return section.components; }).find(function (component) {
    return component.responseMode !== null;
  });
  rawSvgComponent.geometryDiagram.svg = "<svg></svg>";
  assert.throws(function () {
    validator.validatePack(rawSvgPack, "synthetic-gga-raw-svg-pack.json");
  }, /GGA_GEOMETRY_DIAGRAM_INVALID/);

  const duplicateTrianglePack = JSON.parse(JSON.stringify(pack));
  const duplicateComponents = duplicateTrianglePack.studentSections.flatMap(function (section) { return section.components; }).filter(function (component) {
    return component.responseMode !== null;
  });
  const duplicateReferences = duplicateTrianglePack.teacherArtifacts.flatMap(function (artifact) { return artifact.answerReferences; });
  duplicateComponents[1].geometryDiagram = JSON.parse(JSON.stringify(duplicateComponents[0].geometryDiagram));
  duplicateReferences[1].arithmeticCheck = JSON.parse(JSON.stringify(duplicateReferences[0].arithmeticCheck));
  duplicateReferences[1].expectedResponse = duplicateReferences[0].expectedResponse;
  assert.throws(function () {
    validator.validatePack(duplicateTrianglePack, "synthetic-gga-duplicate-triangle.json");
  }, /GGA_AUTOMATIC_EVIDENCE_INCOMPLETE/);

  const answerLeakPack = JSON.parse(JSON.stringify(pack));
  answerLeakPack.frontMatter.titleByLocale.en = answerReferences[0].expectedResponse;
  assert.throws(function () {
    validator.validatePack(answerLeakPack, "synthetic-gga-student-answer-leak.json");
  }, /GGA_CROSS_STUDENT_ANSWER_LEAK/);

  const localizedLeakPack = JSON.parse(JSON.stringify(pack));
  localizedLeakPack.frontMatter.titleByLocale.en = "Thirty-two belongs to a different example.";
  assert.throws(function () {
    validator.validatePack(localizedLeakPack, "synthetic-gga-spelled-answer-leak.json");
  }, /GGA_CROSS_STUDENT_ANSWER_LEAK/);

  const missingObservationPack = JSON.parse(JSON.stringify(pack));
  const missingObservation = missingObservationPack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "lesson-plan";
  });
  missingObservation.components = missingObservation.components.filter(function (component) {
    return component.componentType !== "teacher-observation-rubric";
  });
  assert.throws(function () {
    validator.validatePack(missingObservationPack, "synthetic-gga-missing-observation.json");
  }, /GGA_TEACHER_OBSERVATION_INCOMPLETE/);

  const changedObservationLocalePack = JSON.parse(JSON.stringify(pack));
  const changedObservation = changedObservationLocalePack.teacherArtifacts.find(function (artifact) {
    return artifact.resourceBinding.resourceType === "lesson-plan";
  }).components.find(function (component) {
    return component.componentType === "teacher-observation-rubric";
  });
  changedObservation.contentByLocale.en += " Additional wording.";
  assert.throws(function () {
    validator.validatePack(changedObservationLocalePack, "synthetic-gga-observation-locale-parity.json");
  }, /GGA_TEACHER_OBSERVATION_INCOMPLETE/);
});
