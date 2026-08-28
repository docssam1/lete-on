const test = require("node:test");
const assert = require("node:assert/strict");
const plan = require("../assessment/grade6-placement-plan.js").plan;
const contract = require("../shared/learning-delivery-contract.js");

function token(prefix, index) {
  return `${prefix}${index.toString(16).padStart(16, "0")}`;
}

function hash(index) {
  return index.toString(16).padStart(64, "0");
}

function binding(slot, index) {
  return {
    slotId: slot.slotId,
    releaseId: token("rel-bnk-", index),
    itemId: token("qst-bnk-", index),
    itemVersion: 1,
    publicPayloadSha256: hash(index),
    visibilityClass: "authenticated-assessment",
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    unitId: slot.unitId,
    clusterId: slot.clusterId,
    skillId: slot.skillId,
    standardRange: slot.standardRange,
    domainId: slot.domainId,
    difficulty: slot.difficulty,
    responseType: slot.responseType,
    scoringMode: slot.scoringMode,
    maxPoints: slot.maxPoints
  };
}

function form() {
  return {
    schemaVersion: contract.SCHEMA_VERSION,
    formId: "frm-bdg-0123456789abcdef",
    formVersion: 1,
    planId: plan.id,
    blueprintVersion: plan.blueprintVersion,
    blueprintContractSha256: plan.blueprintContractSha256,
    programId: plan.programId,
    targetGrade: plan.targetGrade,
    purpose: plan.purpose,
    releaseBindings: plan.slots.map(binding)
  };
}

function studentSubmission(sourceForm) {
  return {
    schemaVersion: contract.SCHEMA_VERSION,
    assignmentId: "asg-bdg-0123456789abcdef",
    attemptId: "att-bdg-0123456789abcdef",
    responses: sourceForm.releaseBindings.map(function (release, index) {
      return {
        slotId: release.slotId,
        rawResponse: { value: index % 3 === 0 ? "A" : index % 3 === 1 ? 12 : true }
      };
    })
  };
}

function publicItem(release) {
  const choice = release.responseType === "multiple-choice";
  return {
    schemaVersion: "gfield-item-bank-v1",
    itemId: release.itemId,
    itemVersion: release.itemVersion,
    publicRevisionId: release.itemId.replace("qst-", "rev-"),
    publicPayloadSha256: release.publicPayloadSha256,
    visibilityClass: "authenticated-assessment",
    programId: release.programId,
    targetGrade: release.targetGrade,
    domainId: release.domainId,
    clusterId: release.clusterId,
    skillId: release.skillId,
    difficulty: release.difficulty,
    responseType: release.responseType,
    maxPoints: release.maxPoints,
    assessmentBinding: {
      blueprintId: plan.id,
      blueprintVersion: plan.blueprintVersion,
      blueprintContractSha256: plan.blueprintContractSha256,
      purpose: plan.purpose,
      slotId: release.slotId,
      unitId: release.unitId,
      standardRange: release.standardRange
    },
    promptBlocks: [{ type: "text", valueByLocale: { ko: "문제를 해결하세요.", en: "Solve the problem." } }],
    options: choice ? [
      { optionId: "A", labelByLocale: { ko: "보기 1", en: "Choice 1" } },
      { optionId: "B", labelByLocale: { ko: "보기 2", en: "Choice 2" } }
    ] : [],
    assets: [],
    responseUi: {
      inputKind: { "multiple-choice": "choice", numeric: "number", "short-answer": "text", "constructed-response": "workpad" }[release.responseType],
      displayUnit: null,
      inputHintByLocale: null
    },
    rightsRecordId: token("rgt-bnk-", Number.parseInt(release.itemId.slice(-4), 16) + 1)
  };
}

function deliverySource(sourceForm) {
  return {
    assignmentId: "asg-bdg-0123456789abcdef",
    formId: sourceForm.formId,
    formVersion: sourceForm.formVersion,
    policyId: "pol-bdg-grade6-entry-v1",
    policyVersion: 1,
    attemptId: "att-bdg-0123456789abcdef",
    learnerId: "lrm-bdg-0123456789abcdef",
    schoolId: "sch-bdg-0123456789abcdef",
    assignmentState: "opened",
    attemptState: "in-progress",
    publicItems: sourceForm.releaseBindings.map(function (release) {
      return { slotId: release.slotId, releaseId: release.releaseId, publicItem: publicItem(release) };
    })
  };
}

function completedTeacherReviews(sourceForm) {
  return sourceForm.releaseBindings.filter(function (release) { return release.scoringMode === "teacher"; }).map(function (release, index) {
    return {
      slotId: release.slotId,
      reviewId: token("grd-bdg-", index + 1),
      status: "completed",
      awardedPoints: index % 2,
      errorType: index % 2 ? null : "explanation-incomplete",
      reviewedAt: "2026-08-28T10:00:00Z"
    };
  });
}

test("Grade 6 form shape requires 42 unique release references matching every canonical slot without granting authority", function () {
  const source = form();
  assert.equal(contract.validateGrade6FormShape(source), true);
  assert.equal(source.releaseBindings.length, 42);
  assert.equal(source.releaseBindings.filter(function (release) { return release.scoringMode === "teacher"; }).length, 10);

  const short = structuredClone(source);
  short.releaseBindings.pop();
  assert.throws(function () { contract.validateGrade6FormShape(short); }, /exactly 42/);

  const duplicate = structuredClone(source);
  duplicate.releaseBindings[1].releaseId = duplicate.releaseBindings[0].releaseId;
  assert.throws(function () { contract.validateGrade6FormShape(duplicate); }, /duplicate releaseId/);

  const duplicateItem = structuredClone(source);
  duplicateItem.releaseBindings[1].itemId = duplicateItem.releaseBindings[0].itemId;
  assert.throws(function () { contract.validateGrade6FormShape(duplicateItem); }, /duplicate itemId/);

  const duplicatePayload = structuredClone(source);
  duplicatePayload.releaseBindings[1].publicPayloadSha256 = duplicatePayload.releaseBindings[0].publicPayloadSha256;
  assert.throws(function () { contract.validateGrade6FormShape(duplicatePayload); }, /duplicate publicPayloadSha256/);

  const authoritySpoof = structuredClone(source);
  authoritySpoof.releaseBindings[0].releaseState = "signed";
  authoritySpoof.releaseBindings[0].signatureVerificationState = "verified-server-side";
  assert.throws(function () { contract.validateGrade6FormShape(authoritySpoof); }, /unsupported fields/);

  const wrongLineage = structuredClone(source);
  wrongLineage.releaseBindings[0].clusterId = "6.NS.A";
  assert.throws(function () { contract.validateGrade6FormShape(wrongLineage); }, /does not match Grade 6 slot/);

  const wrongBlueprintHash = structuredClone(source);
  wrongBlueprintHash.blueprintContractSha256 = "f".repeat(64);
  assert.throws(function () { contract.validateGrade6FormShape(wrongBlueprintHash); }, /canonical Grade 6 placement plan/);

  const forgedForm = structuredClone(source);
  const forgedPlan = structuredClone(plan);
  forgedForm.releaseBindings[0].clusterId = "6.NS.A";
  forgedPlan.slots[0].clusterId = "6.NS.A";
  assert.throws(function () { contract.validateGrade6FormShape(forgedForm, forgedPlan); }, /does not match Grade 6 slot/);
});

test("student submission accepts only slot-bound raw responses and rejects all scoring or answer data", function () {
  const sourceForm = form();
  const submission = studentSubmission(sourceForm);
  assert.equal(contract.validateStudentSubmissionShape(submission, sourceForm), true);

  ["awardedPoints", "errorType", "scoringReview", "answer", "solution", "rubric"].forEach(function (privateKey) {
    const injected = structuredClone(submission);
    injected.responses[0][privateKey] = privateKey === "awardedPoints" ? 1 : "private";
    assert.throws(function () { contract.validateStudentSubmissionShape(injected, sourceForm); }, /unsupported fields|private scoring/);
  });

  const nestedAnswer = structuredClone(submission);
  nestedAnswer.responses[0].rawResponse = { value: { answer_key: "A" } };
  assert.throws(function () { contract.validateStudentSubmissionShape(nestedAnswer, sourceForm); }, /must be a string, number, or boolean|private scoring/);

  const identityClaim = structuredClone(submission);
  identityClaim.learnerId = "lrm-bdg-fedcba9876543210";
  assert.throws(function () { contract.validateStudentSubmissionShape(identityClaim, sourceForm); }, /unsupported fields/);

  const inherited = Object.create({ awardedPoints: 1 });
  inherited.value = "student work";
  const inheritedInjection = structuredClone(submission);
  inheritedInjection.responses[0].rawResponse = inherited;
  assert.throws(function () { contract.validateStudentSubmissionShape(inheritedInjection, sourceForm); }, /plain object/);

  let getterCalled = false;
  const accessor = {};
  Object.defineProperty(accessor, "value", {
    enumerable: true,
    get: function () { getterCalled = true; return "student work"; }
  });
  const accessorInjection = structuredClone(submission);
  accessorInjection.responses[0].rawResponse = accessor;
  assert.throws(function () { contract.validateStudentSubmissionShape(accessorInjection, sourceForm); }, /enumerable data field/);
  assert.equal(getterCalled, false);

  ["score", "totalPoints", "grade", "isCorrect", "teacherFeedback", "student_id", "learnerIdentity", "userId"].forEach(function (key) {
    const scoringInjection = structuredClone(submission);
    scoringInjection.responses[0].rawResponse = { value: "student work", [key]: "spoof" };
    assert.throws(function () { contract.validateStudentSubmissionShape(scoringInjection, sourceForm); }, /forbidden in a student submission|private scoring/);
  });

  let arrayGetterCalled = false;
  const accessorArray = [];
  Object.defineProperty(accessorArray, "0", {
    enumerable: true,
    get: function () { arrayGetterCalled = true; return "A"; }
  });
  const arrayAccessorInjection = structuredClone(submission);
  arrayAccessorInjection.responses[0].rawResponse = accessorArray;
  assert.throws(function () { contract.validateStudentSubmissionShape(arrayAccessorInjection, sourceForm); }, /plain object|enumerable data field/);
  assert.equal(arrayGetterCalled, false);

  const nullValue = structuredClone(submission);
  nullValue.responses[0].rawResponse = { value: null };
  assert.throws(function () { contract.validateStudentSubmissionShape(nullValue, sourceForm); }, /string, number, or boolean/);

  const oversized = structuredClone(submission);
  oversized.responses[0].rawResponse = { value: "가".repeat(7000) };
  assert.throws(function () { contract.validateStudentSubmissionShape(oversized, sourceForm); }, /20000-byte limit/);

  const oversizedTotal = structuredClone(submission);
  oversizedTotal.responses.forEach(function (response) { response.rawResponse = { value: "x".repeat(4800) }; });
  assert.throws(function () { contract.validateStudentSubmissionShape(oversizedTotal, sourceForm); }, /200000-byte total limit/);
  assert.equal(contract.MAX_RAW_RESPONSE_BYTES, 20000);
  assert.equal(contract.MAX_SUBMISSION_RAW_RESPONSE_BYTES, 200000);

  const duplicateSlot = structuredClone(submission);
  duplicateSlot.responses[1].slotId = duplicateSlot.responses[0].slotId;
  assert.throws(function () { contract.validateStudentSubmissionShape(duplicateSlot, sourceForm); }, /duplicate or missing/);
});

test("even ten locally completed teacher reviews only become eligible for server verification and never publish", function () {
  const sourceForm = form();
  const complete = completedTeacherReviews(sourceForm);
  const partial = complete.slice(0, 9);
  const locked = contract.evaluateFinalReportReadiness(sourceForm, partial);
  assert.equal(locked.canPublishFinalReport, false);
  assert.equal(locked.eligibleForServerVerification, false);
  assert.equal(locked.authorizationVerified, false);
  assert.equal(locked.requiresDatabaseReload, true);
  assert.equal(locked.completedTeacherScoredItems, 9);
  assert.equal(locked.missingSlotIds.length, 1);
  assert.equal(locked.automaticPromotion, false);
  assert.equal(locked.finalDecision, "school-review-required");
  const eligible = contract.evaluateFinalReportReadiness(sourceForm, complete);
  assert.equal(eligible.eligibleForServerVerification, true);
  assert.equal(eligible.canPublishFinalReport, false);
  assert.equal(eligible.authorizationVerified, false);
  assert.equal(eligible.requiresDatabaseReload, true);
  assert.equal(eligible.requiredTeacherScoredItems, 10);
  assert.equal(eligible.completedTeacherScoredItems, 10);
  assert.deepEqual(eligible.missingSlotIds, []);
  assert.deepEqual(contract.schoolReviewDecision(), { automaticPromotion: false, finalDecision: "school-review-required" });

  const duplicated = structuredClone(complete);
  duplicated[9].slotId = duplicated[0].slotId;
  assert.throws(function () { contract.evaluateFinalReportReadiness(sourceForm, duplicated); }, /duplicate slots/);

  const impossibleScore = structuredClone(complete);
  impossibleScore[0].awardedPoints = 2;
  assert.throws(function () { contract.evaluateFinalReportReadiness(sourceForm, impossibleScore); }, /awardedPoints is invalid/);

  const impossibleDate = structuredClone(complete);
  impossibleDate[0].reviewedAt = "2026-02-31T10:00:00Z";
  assert.throws(function () { contract.evaluateFinalReportReadiness(sourceForm, impossibleDate); }, /real UTC timestamp/);

  const excessive = complete.concat(structuredClone(complete[0]));
  assert.throws(function () { contract.evaluateFinalReportReadiness(sourceForm, excessive); }, /cannot exceed 10/);
});

test("student and teacher DTOs project matching local scope inputs without granting authority", function () {
  const sourceForm = form();
  const source = deliverySource(sourceForm);
  const student = contract.projectStudentDeliveryDto(source, sourceForm, {
    learnerId: source.learnerId,
    schoolId: source.schoolId
  });
  assert.equal(student.audience, "student");
  assert.equal(student.authorizationVerified, false);
  assert.equal(student.requiresAuthenticatedServerDelivery, true);
  assert.equal(Object.hasOwn(student.assignment, "learnerId"), false);
  assert.equal(Object.hasOwn(student.assignment, "schoolId"), false);
  assert.equal(student.assignment.formVersion, source.formVersion);
  assert.equal(student.assignment.assignmentState, source.assignmentState);
  assert.equal(student.assignment.attemptState, source.attemptState);
  assert.equal(student.items.length, 42);
  assert.doesNotMatch(JSON.stringify(student), /(?:answerKey|awardedPoints|scoringReview|solution|rubric)/i);
  assert.equal(contract.validateStudentDeliveryDtoShape(student), true);
  assert.equal(Object.isFrozen(student), true);
  assert.equal(Object.isFrozen(student.items[0].publicItem), true);

  assert.throws(function () {
    contract.projectStudentDeliveryDto(source, sourceForm, {
      learnerId: "lrm-bdg-fedcba9876543210",
      schoolId: source.schoolId
    });
  }, /projection scope does not match/);

  const teacher = contract.projectTeacherDeliveryDto(source, sourceForm, {
    schoolId: source.schoolId,
    learnerIds: [source.learnerId]
  });
  assert.equal(teacher.audience, "teacher");
  assert.equal(teacher.authorizationVerified, false);
  assert.equal(teacher.requiresAuthenticatedServerDelivery, true);
  assert.equal(teacher.assignment.learnerId, source.learnerId);
  assert.equal(teacher.assignment.formVersion, source.formVersion);
  assert.equal(teacher.assignment.policyId, source.policyId);
  assert.equal(teacher.assignment.policyVersion, source.policyVersion);
  assert.equal(teacher.assignment.assignmentState, source.assignmentState);
  assert.equal(teacher.assignment.attemptState, source.attemptState);
  assert.equal(teacher.items.length, 42);
  assert.doesNotMatch(JSON.stringify(teacher), /(?:answerKey|awardedPoints|scoringReview|solution|rubric)/i);
  assert.equal(contract.validateTeacherDeliveryDtoShape(teacher), true);

  assert.throws(function () {
    contract.projectTeacherDeliveryDto(source, sourceForm, {
      schoolId: source.schoolId,
      learnerIds: ["lrm-bdg-fedcba9876543210"]
    });
  }, /does not include this learner/);

  const crossLearnerLeak = structuredClone(source);
  crossLearnerLeak.students = [{ learnerId: "lrm-bdg-fedcba9876543210" }];
  assert.throws(function () {
    contract.projectTeacherDeliveryDto(crossLearnerLeak, sourceForm, { schoolId: source.schoolId, learnerIds: [source.learnerId] });
  }, /unsupported fields|cross-learner/);

  const privateLeak = structuredClone(source);
  privateLeak.publicItems[0].publicItem.privateSpec = { answer: "A" };
  assert.throws(function () {
    contract.projectStudentDeliveryDto(privateLeak, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /private scoring|unsupported fields/);

  const explicitAnswerLeak = structuredClone(source);
  explicitAnswerLeak.publicItems[0].publicItem.promptBlocks[0].valueByLocale.en = "Answer: A";
  assert.throws(function () {
    contract.projectStudentDeliveryDto(explicitAnswerLeak, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /answer-revealing text/);

  const lineageSpoof = structuredClone(source);
  lineageSpoof.publicItems[0].publicItem.skillId = sourceForm.releaseBindings[1].skillId;
  assert.throws(function () {
    contract.projectStudentDeliveryDto(lineageSpoof, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /skillId does not match the form binding/);

  const slotAttestationSpoof = structuredClone(source);
  slotAttestationSpoof.publicItems[4].publicItem.assessmentBinding.slotId = sourceForm.releaseBindings[9].slotId;
  assert.throws(function () {
    contract.projectStudentDeliveryDto(slotAttestationSpoof, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /assessmentBinding does not match the exact form slot/);

  const forgedStudent = structuredClone(student);
  forgedStudent.authorizationVerified = true;
  assert.throws(function () { contract.validateStudentDeliveryDtoShape(forgedStudent); }, /boundary is invalid/);

  const forgedBlueprint = structuredClone(student);
  forgedBlueprint.items.forEach(function (entry, index) {
    const fakeSlotId = `slot-bdg-g6-fake-z-${String(index + 1).padStart(2, "0")}`;
    entry.slotId = fakeSlotId;
    entry.publicItem.assessmentBinding = {
      blueprintId: "asm-bdg-unrelated-plan-v1",
      blueprintVersion: 99,
      blueprintContractSha256: "f".repeat(64),
      purpose: "unit-screener",
      slotId: fakeSlotId,
      unitId: "unrelated-unit",
      standardRange: "6.RP.A.1-3"
    };
  });
  assert.throws(function () { contract.validateStudentDeliveryDtoShape(forgedBlueprint); }, /canonical Grade 6 plan/);

  const forgedTeacher = structuredClone(teacher);
  forgedTeacher.authorizationVerified = true;
  assert.throws(function () { contract.validateTeacherDeliveryDtoShape(forgedTeacher); }, /boundary is invalid/);

  const wrongFormVersion = structuredClone(source);
  wrongFormVersion.formVersion += 1;
  assert.throws(function () {
    contract.projectStudentDeliveryDto(wrongFormVersion, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /formVersion does not match/);

  const duplicateTeacherScope = [source.learnerId, source.learnerId];
  assert.throws(function () {
    contract.projectTeacherDeliveryDto(source, sourceForm, { schoolId: source.schoolId, learnerIds: duplicateTeacherScope });
  }, /contains duplicates/);

  const oversizedTeacherScope = Array.from({ length: contract.MAX_TEACHER_SCOPE_LEARNERS + 1 }, function (_, index) {
    return token("lrm-bdg-", index + 1);
  });
  assert.throws(function () {
    contract.projectTeacherDeliveryDto(source, sourceForm, { schoolId: source.schoolId, learnerIds: oversizedTeacherScope });
  }, /cannot exceed 500/);

  const oversizedPublicItem = structuredClone(source);
  oversizedPublicItem.publicItems[0].publicItem.promptBlocks[0].valueByLocale.ko = "가".repeat(40000);
  assert.throws(function () {
    contract.projectStudentDeliveryDto(oversizedPublicItem, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /100000-byte limit/);

  const hugeSparseItems = structuredClone(source);
  hugeSparseItems.publicItems = [];
  hugeSparseItems.publicItems.length = 10000000;
  assert.throws(function () {
    contract.projectStudentDeliveryDto(hugeSparseItems, sourceForm, { learnerId: source.learnerId, schoolId: source.schoolId });
  }, /cannot exceed 1000 entries/);

  assert.equal(contract.validateStudentSubmission, undefined);
  assert.equal(contract.validateGrade6Form, undefined);
  assert.equal(contract.assertCanPublishFinalReport, undefined);
  assert.equal(contract.buildStudentDeliveryDto, undefined);
});
