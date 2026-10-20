(function (root, factory) {
  "use strict";
  const api = factory();
  root.HIGHSELECT_STANDARD_EXAM_POLICY = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const REQUIRED_GATES = Object.freeze([
    "source-permission",
    "source-diversity",
    "scope-fidelity",
    "taxonomy",
    "difficulty-fit",
    "response-mix",
    "independent-answer",
    "single-answer-visibility",
    "duplicate-family",
    "learner-fit",
    "owner-approval",
    "desktop-mobile-a4"
  ]);

  const COURSE_STANDARD_EXAMS = Object.freeze({
    SH: Object.freeze({
      "high-selection": "sh-selection-r01",
      "middle-transfer": null,
      "high-transfer": null
    }),
    DP: Object.freeze({
      middle1: "dp-middle1-entry",
      "common1-basic": "dp-common1-entry-202405",
      "common2-basic": null,
      "common1-skill": null,
      "common2-skill": null,
      "algebra-basic": null,
      "middle-transfer": "dp-middle2-2-transfer"
    }),
    WM: Object.freeze({
      "middle21-basic": "wm-middle21-basic-entry-r01",
      "common1-basic": "wm-algebra-geometry-diagnostic",
      "middle-transfer": null,
      "high-dual": null
    }),
    ED: Object.freeze({
      middle1: "ed-middle1-entry",
      "high-advance": "ed-high-advance-entry"
    }),
    DG: Object.freeze({
      "level-entry": "dg-entry-common",
      "pre-high1": null
    }),
    SM: Object.freeze({
      "common1-basic": "sm-common1-entry",
      common2: "sm-common2-basic-r01"
    })
  });

  function responseMix(objective, shortAnswer, writtenSolution, status, basis) {
    return Object.freeze({ objective, shortAnswer, writtenSolution, status, basis });
  }

  const UNKNOWN_RESPONSE_MIX = responseMix(null, null, null, "confirmation-required", "동일 과정·회차 원본의 문항 형식 확인 필요");
  const COURSE_BLUEPRINTS = Object.freeze({
    SH: Object.freeze({
      "high-selection": Object.freeze({ targetQuestionCount: 40, responseMix: responseMix(0, 40, 0, "verified", "40문항 응답 형식 검수") }),
      "middle-transfer": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "high-transfer": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX })
    }),
    DP: Object.freeze({
      middle1: Object.freeze({ targetQuestionCount: 30, responseMix: UNKNOWN_RESPONSE_MIX }),
      "common1-basic": Object.freeze({ targetQuestionCount: 30, responseMix: responseMix(19, 11, 0, "verified", "2024년 5월 원본 문항 형식 검수") }),
      "common2-basic": Object.freeze({ targetQuestionCount: 30, responseMix: UNKNOWN_RESPONSE_MIX }),
      "common1-skill": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "common2-skill": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "algebra-basic": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "middle-transfer": Object.freeze({ targetQuestionCount: 30, responseMix: responseMix(0, 30, 0, "verified", "중2-2 원본 응답 형식 검수") })
    }),
    WM: Object.freeze({
      "middle21-basic": Object.freeze({
        targetQuestionCount: 40,
        responseMix: UNKNOWN_RESPONSE_MIX,
        sourceDiversity: Object.freeze({
          minimumSourceFamilies: 8,
          maximumItemsPerSourceFamily: 6,
          requiredSourcePoolIds: Object.freeze(["HS_G7", "SW_G7", "LIMITED_G7_OOP", "SUPERMATH_G7_OOP", "MATHGOD_G7_OOP", "DD_HIGH_G7"]),
          status: "required",
          basis: "황소 중등·STARWARS·리미티드·SUPERMATH·수학의 신·최상위수학을 포함해 회차마다 여덟 출처 이상을 섞고 한 출처는 여섯 문항 이하로 제한"
        })
      }),
      "common1-basic": Object.freeze({ targetQuestionCount: 50, responseMix: UNKNOWN_RESPONSE_MIX }),
      "middle-transfer": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "high-dual": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX })
    }),
    ED: Object.freeze({
      middle1: Object.freeze({ targetQuestionCount: 30, responseMix: UNKNOWN_RESPONSE_MIX }),
      "high-advance": Object.freeze({ targetQuestionCount: 30, responseMix: responseMix(0, 0, 30, "observed", "과거 공개 운영 사례이며 동일 회차 확인 필요") })
    }),
    DG: Object.freeze({
      "level-entry": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX }),
      "pre-high1": Object.freeze({ targetQuestionCount: null, responseMix: UNKNOWN_RESPONSE_MIX })
    }),
    SM: Object.freeze({
      "common1-basic": Object.freeze({ targetQuestionCount: 30, responseMix: UNKNOWN_RESPONSE_MIX }),
      common2: Object.freeze({ targetQuestionCount: 30, responseMix: UNKNOWN_RESPONSE_MIX })
    })
  });

  const SOURCE_INTAKE = Object.freeze({
    mathflat: Object.freeze({
      id: "mathflat",
      label: "매쓰플랫",
      role: "supplemental-private-candidate",
      visibility: "private",
      useWhen: "표준 시험지 구성표에서 승인 문항이 부족한 세부유형만 보충",
      importRule: "선택한 문항을 후보함으로 가져온 뒤 범위·유형·난이도·정답·도형·중복·학원 적합성 검수를 통과해야 승인 문항이 됨",
      releaseRule: "후보 원문·출처 자산·정답은 공개하지 않으며 사용자 승인 전에는 시험지에 포함하지 않음",
      states: Object.freeze(["candidate_locked", "audit_pending", "eligible", "approved", "included"]),
      requiredGates: REQUIRED_GATES
    })
  });

  const READY_SOURCE_STATES = new Set(["audited"]);
  const READY_ANSWER_STATES = new Set(["verified"]);
  const READY_CLASSIFICATION_STATES = new Set(["verified"]);

  function responseMixVerified(blueprint) {
    const mix = blueprint && blueprint.responseMix;
    const target = blueprint && blueprint.targetQuestionCount;
    if (!mix || mix.status !== "verified" || !Number.isSafeInteger(target)) return false;
    const counts = [mix.objective, mix.shortAnswer, mix.writtenSolution];
    return counts.every(Number.isSafeInteger) && counts.every(function (count) { return count >= 0; })
      && counts.reduce(function (sum, count) { return sum + count; }, 0) === target;
  }

  function responseMixLabel(blueprint) {
    const mix = blueprint && blueprint.responseMix;
    if (!mix || [mix.objective, mix.shortAnswer, mix.writtenSolution].some(function (count) { return !Number.isSafeInteger(count); })) {
      return "객관식·주관식·서술형 비율 확인 필요";
    }
    const suffix = mix.status === "verified" ? "" : " · 참고 사례";
    return `객관식 ${mix.objective} · 주관식 ${mix.shortAnswer} · 서술형 ${mix.writtenSolution}${suffix}`;
  }

  function validateSourceDiversity(items, rule, targetQuestionCount) {
    if (!rule) return Object.freeze({ verified: true, sourceFamilyCount: 0, sourceFamilies: Object.freeze([]), issues: Object.freeze([]) });
    const list = Array.isArray(items) ? items : [];
    const counts = new Map();
    const issues = [];
    let missingFamilyCount = 0;
    list.forEach(function (item) {
      const familyId = String((item && (item.sourceFamilyId || item.sourceBookId || item.sourceBankId)) || "").trim();
      if (!familyId) {
        missingFamilyCount += 1;
        return;
      }
      counts.set(familyId, (counts.get(familyId) || 0) + 1);
    });
    const sourceFamilies = Array.from(counts, function (entry) {
      return Object.freeze({ id: entry[0], count: entry[1] });
    }).sort(function (a, b) { return a.id.localeCompare(b.id); });
    if (Number.isSafeInteger(targetQuestionCount) && list.length !== targetQuestionCount) {
      issues.push(`문항 수 ${list.length}/${targetQuestionCount}`);
    }
    if (missingFamilyCount > 0) issues.push(`출처군이 없는 문항 ${missingFamilyCount}개`);
    if (counts.size < rule.minimumSourceFamilies) {
      issues.push(`출처군 ${counts.size}/${rule.minimumSourceFamilies}`);
    }
    sourceFamilies.forEach(function (family) {
      if (family.count > rule.maximumItemsPerSourceFamily) {
        issues.push(`${family.id} ${family.count}/${rule.maximumItemsPerSourceFamily}`);
      }
    });
    const required = Array.isArray(rule.requiredSourcePoolIds) ? rule.requiredSourcePoolIds : [];
    required.forEach(function (poolId) {
      if (!counts.has(poolId)) issues.push(`필수 출처 누락: ${poolId}`);
    });
    return Object.freeze({
      verified: issues.length === 0,
      sourceFamilyCount: counts.size,
      sourceFamilies: Object.freeze(sourceFamilies),
      issues: Object.freeze(issues)
    });
  }

  function examIndex(catalog) {
    return new Map((catalog && Array.isArray(catalog.exams) ? catalog.exams : []).map(function (exam) {
      return [String(exam.id || ""), exam];
    }));
  }

  function resolve(programCode, courseId, catalog) {
    const programMap = COURSE_STANDARD_EXAMS[String(programCode || "")] || {};
    const hasCourse = Object.prototype.hasOwnProperty.call(programMap, String(courseId || ""));
    const standardExamId = hasCourse ? programMap[String(courseId || "")] : null;
    const exam = standardExamId ? examIndex(catalog).get(standardExamId) || null : null;
    const blueprint = (COURSE_BLUEPRINTS[String(programCode || "")] || {})[String(courseId || "")] || null;
    const sourceDiversityRule = blueprint && blueprint.sourceDiversity ? blueprint.sourceDiversity : null;
    const sourceDiversityAudit = exam && exam.sourceDiversityAudit && typeof exam.sourceDiversityAudit === "object" ? exam.sourceDiversityAudit : null;
    const gates = Object.freeze({
      source: Boolean(exam && READY_SOURCE_STATES.has(exam.sourceStatus)),
      sourceDiversity: !sourceDiversityRule || Boolean(exam && exam.sourceDiversityStatus === "verified" && sourceDiversityAudit && sourceDiversityAudit.verified === true),
      answer: Boolean(exam && READY_ANSWER_STATES.has(exam.answerStatus)),
      classification: Boolean(exam && READY_CLASSIFICATION_STATES.has(exam.classificationStatus)),
      responseMix: responseMixVerified(blueprint),
      release: Boolean(exam && exam.releaseStatus === "released")
    });
    const standardReady = Object.values(gates).every(Boolean);
    let state = "missing";
    let label = "표준 시험지 필요";
    if (exam && standardReady) {
      state = "ready";
      label = "표준 시험지 사용 가능";
    } else if (exam && exam.releaseStatus === "review_pending") {
      state = "review";
      label = "표준 시험지 최종 검수 중";
    } else if (exam) {
      state = "assembling";
      label = "표준 시험지 구성 중";
    }
    const targetQuestionCount = blueprint && Number.isSafeInteger(blueprint.targetQuestionCount) ? blueprint.targetQuestionCount : null;
    const plannedQuestionCount = exam && Number.isSafeInteger(exam.questionCount) ? exam.questionCount : targetQuestionCount;
    const reviewReady = gates.source && gates.sourceDiversity && gates.answer && gates.classification && gates.responseMix;
    const reviewedQuestionCount = reviewReady && Number.isSafeInteger(plannedQuestionCount) ? plannedQuestionCount : 0;
    const blockers = Object.freeze([
      ["source", "원본·사용 범위"],
      ["sourceDiversity", "여덟 출처 이상을 섞은 원수학 최상위 구성"],
      ["answer", "독립 정답 검산"],
      ["classification", "단원·세부유형 분류"],
      ["responseMix", "객관식·주관식·서술형 비율"],
      ["release", "최종 공개 승인"]
    ].filter(function (entry) { return !gates[entry[0]]; }).map(function (entry) { return entry[1]; }));
    const progress = Object.freeze({
      targetQuestionCount,
      plannedQuestionCount,
      reviewedQuestionCount,
      releasedQuestionCount: standardReady && Number.isSafeInteger(plannedQuestionCount) ? plannedQuestionCount : 0,
      reviewShortfall: Number.isSafeInteger(targetQuestionCount) ? Math.max(0, targetQuestionCount - reviewedQuestionCount) : null
    });
    return Object.freeze({
      programCode: String(programCode || ""),
      courseId: String(courseId || ""),
      required: true,
      standardExamId,
      exam,
      blueprint,
      state,
      label,
      gates,
      blockers,
      progress,
      responseMix: blueprint ? blueprint.responseMix : UNKNOWN_RESPONSE_MIX,
      responseMixLabel: responseMixLabel(blueprint),
      sourceDiversity: sourceDiversityRule,
      sourceDiversityAudit,
      canApply: standardReady,
      canSell: standardReady,
      missingQuestionPolicy: SOURCE_INTAKE.mathflat
    });
  }

  function auditAll(engagement, catalog) {
    const issues = [];
    const rows = [];
    const programs = engagement && Array.isArray(engagement.programs) ? engagement.programs : [];
    programs.forEach(function (program) {
      (program.courses || []).forEach(function (course) {
        const result = resolve(program.code, course.id, catalog);
        rows.push(result);
        if (!Object.prototype.hasOwnProperty.call(COURSE_STANDARD_EXAMS[program.code] || {}, course.id)) {
          issues.push(`${program.code}.${course.id}.policy_missing`);
        }
        if (!Object.prototype.hasOwnProperty.call(COURSE_BLUEPRINTS[program.code] || {}, course.id)) {
          issues.push(`${program.code}.${course.id}.blueprint_missing`);
        }
        if (result.standardExamId && !result.exam) issues.push(`${program.code}.${course.id}.exam_missing`);
      });
    });
    return Object.freeze({ eligible: issues.length === 0, issues: Object.freeze(issues.sort()), rows: Object.freeze(rows) });
  }

  return Object.freeze({
    version: "highselect-standard-exam-policy/v1",
    updatedAt: "2026-09-03",
    required: true,
    definition: "모든 대비과정은 범위·문항 수·출처 구성·난도·답·유형·A4 배치가 승인된 표준 시험지 한 회 이상을 가져야 신청·판매 가능",
    requiredGates: REQUIRED_GATES,
    courseStandardExams: COURSE_STANDARD_EXAMS,
    courseBlueprints: COURSE_BLUEPRINTS,
    sourceIntake: SOURCE_INTAKE,
    responseMixVerified,
    responseMixLabel,
    validateSourceDiversity,
    resolve,
    auditAll
  });
});
