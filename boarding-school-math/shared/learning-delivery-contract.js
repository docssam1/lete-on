(function (root, factory) {
  const planData = typeof module === "object" && module.exports
    ? require("../assessment/grade6-placement-plan.js")
    : root.GFIELDGrade6PlacementPlan;
  const itemContract = typeof module === "object" && module.exports
    ? require("../question-bank/item-release-contract.js")
    : root.GFIELDItemReleaseContract;
  const api = factory(planData, itemContract);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDLearningDeliveryContract = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (planData, itemContract) {
  "use strict";

  if (!planData || !planData.plan) throw new Error("GFIELDGrade6PlacementPlan is required");
  if (!itemContract) throw new Error("GFIELDItemReleaseContract is required");

  const SCHEMA_VERSION = "gfield-learning-delivery-v1";
  const EXPECTED_ITEM_COUNT = 42;
  const EXPECTED_TEACHER_SCORED_COUNT = 10;
  const MAX_RAW_RESPONSE_BYTES = 20000;
  const MAX_SUBMISSION_RAW_RESPONSE_BYTES = 200000;
  const MAX_TEACHER_SCOPE_LEARNERS = 500;
  const MAX_ARRAY_ENTRIES = 1000;
  const MAX_PUBLIC_ITEM_BYTES = 100000;
  const MAX_DELIVERY_ITEMS_BYTES = 2500000;
  const ASSIGNMENT_STATES = Object.freeze(["assigned", "opened", "submitted", "closed", "cancelled"]);
  const ATTEMPT_STATES = Object.freeze(["in-progress", "submitted", "scored", "finalized", "void"]);
  const SCORING_ERROR_TYPES = Object.freeze([
    "prerequisite-gap", "concept-gap", "representation-error", "calculation-error",
    "condition-missed", "strategy-gap", "explanation-incomplete"
  ]);
  const FORBIDDEN_BOUNDARY_KEYS = new Set([
    "answer", "answerkey", "correctanswer", "correctoption", "iscorrect", "solution", "solutionref",
    "rubric", "rubricid", "rubricversion", "rubricsha256", "scoringspec", "scoringspecid",
    "privatespec", "privatespecsha256", "privatescoringsha256", "awardedpoints", "errortype",
    "scoringreview", "acceptedalternatives", "tolerance", "distractorrationale", "reviewernotes",
    "otherlearners", "learners", "students", "classroster", "cohort"
  ]);
  const FORBIDDEN_RAW_RESPONSE_KEYS = new Set([
    "score", "scores", "point", "points", "grade", "grades", "correct", "correctness", "feedback",
    "identity", "identityid", "learner", "learnerid", "student", "studentid", "userid", "accountid",
    "profileid", "personid", "schoolid", "teacherid", "assignmentid", "attemptid", "formid", "email"
  ]);

  const FORM_FIELDS = Object.freeze([
    "schemaVersion", "formId", "formVersion", "planId", "blueprintVersion", "blueprintContractSha256",
    "programId", "targetGrade", "purpose", "releaseBindings"
  ]);
  const RELEASE_BINDING_FIELDS = Object.freeze([
    "slotId", "releaseId", "itemId", "itemVersion", "publicPayloadSha256", "visibilityClass",
    "programId", "targetGrade", "unitId", "clusterId", "skillId", "standardRange", "domainId",
    "difficulty", "responseType", "scoringMode", "maxPoints"
  ]);
  const DELIVERY_SOURCE_FIELDS = Object.freeze([
    "assignmentId", "formId", "formVersion", "policyId", "policyVersion", "attemptId",
    "learnerId", "schoolId", "assignmentState", "attemptState", "publicItems"
  ]);
  const PUBLIC_ITEM_BINDING_FIELDS = Object.freeze(["slotId", "releaseId", "publicItem"]);

  function fail(message) { throw new Error(message); }
  function isRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }
  function requireRecord(value, field) {
    if (!isRecord(value)) fail(`${field} must be a plain object`);
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some(function (key) { return typeof key !== "string"; })) fail(`${field} must not contain symbol fields`);
    ownKeys.forEach(function (key) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true) {
        fail(`${field}.${key} must be an enumerable data field`);
      }
    });
  }
  function requireText(value, field, pattern) {
    if (typeof value !== "string" || !value.trim() || (pattern && !pattern.test(value))) fail(`${field} is invalid`);
  }
  function requireTimestamp(value, field) {
    requireText(value, field);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) {
      fail(`${field} must be a UTC timestamp`);
    }
    const normalized = value.includes(".") ? value : value.replace("Z", ".000Z");
    if (new Date(value).toISOString() !== normalized) fail(`${field} must be a real UTC timestamp`);
  }
  function assertKnownFields(value, allowed, field) {
    requireRecord(value, field);
    const extra = Object.keys(value).filter(function (key) { return !allowed.includes(key); });
    if (extra.length) fail(`${field} contains unsupported fields: ${extra.join(", ")}`);
  }
  function assertDenseArray(value, field, maxLength) {
    if (!Array.isArray(value)) fail(`${field} must be an array`);
    if (Object.getPrototypeOf(value) !== Array.prototype) fail(`${field} must be a plain array`);
    const limit = maxLength == null ? MAX_ARRAY_ENTRIES : maxLength;
    if (!Number.isSafeInteger(value.length) || value.length > limit) fail(`${field} cannot exceed ${limit} entries`);
    const ownKeys = Reflect.ownKeys(value);
    if (ownKeys.some(function (key) { return typeof key !== "string"; })) fail(`${field} must not contain symbol fields`);
    const extra = ownKeys.filter(function (key) {
      if (key === "length") return false;
      if (!/^(?:0|[1-9]\d*)$/.test(key)) return true;
      const index = Number(key);
      return !Number.isSafeInteger(index) || index >= value.length || String(index) !== key;
    });
    if (extra.length) fail(`${field} contains unsupported array fields: ${extra.join(", ")}`);
    for (let index = 0; index < value.length; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) fail(`${field} must not contain sparse entries`);
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true) {
        fail(`${field}[${index}] must be an enumerable data field`);
      }
    }
  }
  function normalizedKey(value) { return String(value).replace(/[^a-z0-9]/gi, "").toLowerCase(); }
  function isForbiddenRawResponseKey(value) {
    const key = normalizedKey(value);
    return FORBIDDEN_BOUNDARY_KEYS.has(key) || FORBIDDEN_RAW_RESPONSE_KEYS.has(key) ||
      key.includes("score") || key.includes("grade") || key.includes("correct") || key.includes("feedback") ||
      key.includes("identity") || key.includes("awardedpoint") || key.endsWith("points") ||
      /^(?:learner|student|user|account|profile|person|school|teacher|assignment|attempt|form)(?:id)?$/.test(key);
  }

  function assertNoPrivateLeak(value, path, seen) {
    const field = path || "value";
    const visited = seen || new Set();
    if (value == null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
    if (typeof value !== "object") fail(`${field} must contain JSON-safe values only`);
    if (visited.has(value)) fail(`${field} must not contain circular references`);
    visited.add(value);
    if (Array.isArray(value)) {
      assertDenseArray(value, field);
      value.forEach(function (entry, index) { assertNoPrivateLeak(entry, `${field}[${index}]`, visited); });
    } else {
      requireRecord(value, field);
      Object.keys(value).forEach(function (key) {
        if (FORBIDDEN_BOUNDARY_KEYS.has(normalizedKey(key))) fail(`${field}.${key} contains private scoring or cross-learner data`);
        assertNoPrivateLeak(value[key], `${field}.${key}`, visited);
      });
    }
    visited.delete(value);
    return true;
  }

  function utf8ByteLength(value) {
    if (typeof TextEncoder === "function") return new TextEncoder().encode(value).length;
    if (typeof Buffer === "function") return Buffer.byteLength(value, "utf8");
    fail("UTF-8 byte measurement is unavailable");
  }

  function validateRawResponse(value, path) {
    const field = path || "rawResponse";
    requireRecord(value, field);
    const keys = Object.keys(value);
    const forbiddenKey = keys.find(function (key) { return key !== "value" && isForbiddenRawResponseKey(key); });
    if (forbiddenKey) fail(`${field}.${forbiddenKey} is forbidden in a student submission`);
    if (keys.length !== 1 || keys[0] !== "value") fail(`${field} must contain exactly one value field`);
    const rawValue = value.value;
    if (!["string", "number", "boolean"].includes(typeof rawValue)) {
      fail(`${field}.value must be a string, number, or boolean`);
    }
    if (typeof rawValue === "number" && !Number.isFinite(rawValue)) fail(`${field}.value must be finite`);
    const byteLength = utf8ByteLength(`{"value": ${JSON.stringify(rawValue)}}`);
    if (byteLength > MAX_RAW_RESPONSE_BYTES) fail(`${field} exceeds the ${MAX_RAW_RESPONSE_BYTES}-byte limit`);
    return byteLength;
  }

  function validatePlan(plan) {
    requireRecord(plan, "grade6Plan");
    if (plan.id !== planData.plan.id || plan.programId !== planData.plan.programId || plan.targetGrade !== 6 ||
        plan.purpose !== "course-placement" || plan.plannedItemCount !== EXPECTED_ITEM_COUNT) {
      fail("Grade 6 form must use the canonical placement plan");
    }
    assertDenseArray(plan.slots, "grade6Plan.slots", EXPECTED_ITEM_COUNT);
    if (plan.slots.length !== EXPECTED_ITEM_COUNT) fail(`Grade 6 plan must contain exactly ${EXPECTED_ITEM_COUNT} slots`);
    const teacherCount = plan.slots.filter(function (slot) { return slot.scoringMode === "teacher"; }).length;
    if (teacherCount !== EXPECTED_TEACHER_SCORED_COUNT) {
      fail(`Grade 6 plan must contain exactly ${EXPECTED_TEACHER_SCORED_COUNT} teacher-scored slots`);
    }
    return true;
  }

  function validateReleaseBinding(binding, slot, form, index) {
    const field = `form.releaseBindings[${index}]`;
    assertKnownFields(binding, RELEASE_BINDING_FIELDS, field);
    requireText(binding.slotId, `${field}.slotId`, /^slot-bdg-g6-[a-z]+-[a-z]-\d{2}$/);
    requireText(binding.releaseId, `${field}.releaseId`, /^rel-bnk-[a-z0-9]{16}$/);
    requireText(binding.itemId, `${field}.itemId`, /^qst-bnk-[a-z0-9]{16}$/);
    if (!Number.isInteger(binding.itemVersion) || binding.itemVersion < 1) fail(`${field}.itemVersion must be positive`);
    requireText(binding.publicPayloadSha256, `${field}.publicPayloadSha256`, /^[a-f0-9]{64}$/);
    if (binding.visibilityClass !== "authenticated-assessment") fail(`${field}.visibilityClass must be authenticated-assessment`);
    if (binding.programId !== form.programId || binding.targetGrade !== form.targetGrade) {
      fail(`${field} does not match the form program and grade`);
    }
    ["slotId", "unitId", "clusterId", "skillId", "standardRange", "domainId", "difficulty", "responseType", "scoringMode", "maxPoints"].forEach(function (key) {
      if (binding[key] !== slot[key]) fail(`${field}.${key} does not match Grade 6 slot ${slot.slotId}`);
    });
    return true;
  }

  function validateGrade6FormShape(form) {
    const plan = planData.plan;
    validatePlan(plan);
    assertKnownFields(form, FORM_FIELDS, "form");
    assertNoPrivateLeak(form, "form");
    if (form.schemaVersion !== SCHEMA_VERSION) fail("form.schemaVersion is unsupported");
    requireText(form.formId, "form.formId", /^frm-bdg-[a-z0-9]{16}$/);
    if (!Number.isInteger(form.formVersion) || form.formVersion < 1) fail("form.formVersion must be positive");
    if (form.planId !== plan.id || form.blueprintVersion !== plan.blueprintVersion ||
        form.blueprintContractSha256 !== plan.blueprintContractSha256 || form.programId !== plan.programId ||
        form.targetGrade !== 6 || form.purpose !== plan.purpose) {
      fail("form does not match the canonical Grade 6 placement plan");
    }
    assertDenseArray(form.releaseBindings, "form.releaseBindings", EXPECTED_ITEM_COUNT);
    if (form.releaseBindings.length !== EXPECTED_ITEM_COUNT) {
      fail(`form must contain exactly ${EXPECTED_ITEM_COUNT} release-binding shapes`);
    }
    const slotsById = new Map(plan.slots.map(function (slot) { return [slot.slotId, slot]; }));
    form.releaseBindings.forEach(function (binding, index) {
      const slot = slotsById.get(binding && binding.slotId);
      if (!slot) fail(`form.releaseBindings[${index}].slotId is not in the Grade 6 plan`);
      validateReleaseBinding(binding, slot, form, index);
    });
    [
      ["slotId", function (binding) { return binding.slotId; }],
      ["releaseId", function (binding) { return binding.releaseId; }],
      ["itemId", function (binding) { return binding.itemId; }],
      ["item revision", function (binding) { return `${binding.itemId}@${binding.itemVersion}`; }],
      ["publicPayloadSha256", function (binding) { return binding.publicPayloadSha256; }]
    ].forEach(function (rule) {
      const values = form.releaseBindings.map(rule[1]);
      if (new Set(values).size !== values.length) fail(`form release bindings contain duplicate ${rule[0]}`);
    });
    const boundSlots = new Set(form.releaseBindings.map(function (binding) { return binding.slotId; }));
    plan.slots.forEach(function (slot) {
      if (!boundSlots.has(slot.slotId)) fail(`form is missing Grade 6 slot ${slot.slotId}`);
    });
    return true;
  }

  function validateStudentSubmissionShape(payload, form) {
    validateGrade6FormShape(form);
    assertKnownFields(payload, ["schemaVersion", "assignmentId", "attemptId", "responses"], "studentSubmission");
    assertNoPrivateLeak(payload, "studentSubmission");
    if (payload.schemaVersion !== SCHEMA_VERSION) fail("studentSubmission.schemaVersion is unsupported");
    requireText(payload.assignmentId, "studentSubmission.assignmentId", /^asg-bdg-[a-z0-9]{16}$/);
    requireText(payload.attemptId, "studentSubmission.attemptId", /^att-bdg-[a-z0-9]{16}$/);
    assertDenseArray(payload.responses, "studentSubmission.responses", EXPECTED_ITEM_COUNT);
    if (payload.responses.length !== EXPECTED_ITEM_COUNT) {
      fail(`studentSubmission.responses must contain exactly ${EXPECTED_ITEM_COUNT} raw responses`);
    }
    const validSlots = new Set(form.releaseBindings.map(function (binding) { return binding.slotId; }));
    let totalRawResponseBytes = 0;
    payload.responses.forEach(function (response, index) {
      const field = `studentSubmission.responses[${index}]`;
      assertKnownFields(response, ["slotId", "rawResponse"], field);
      requireText(response.slotId, `${field}.slotId`, /^slot-bdg-g6-[a-z]+-[a-z]-\d{2}$/);
      if (!validSlots.has(response.slotId)) fail(`${field}.slotId is not assigned by the form shape`);
      if (!Object.prototype.hasOwnProperty.call(response, "rawResponse")) fail(`${field}.rawResponse is required`);
      totalRawResponseBytes += validateRawResponse(response.rawResponse, `${field}.rawResponse`);
    });
    if (totalRawResponseBytes > MAX_SUBMISSION_RAW_RESPONSE_BYTES) {
      fail(`studentSubmission.responses exceed the ${MAX_SUBMISSION_RAW_RESPONSE_BYTES}-byte total limit`);
    }
    if (new Set(payload.responses.map(function (response) { return response.slotId; })).size !== EXPECTED_ITEM_COUNT) {
      fail("studentSubmission.responses contains duplicate or missing Grade 6 slots");
    }
    return true;
  }

  function validateScoringReview(review, bindingsBySlot, index) {
    const field = `teacherScoringReviews[${index}]`;
    assertKnownFields(review, ["slotId", "reviewId", "status", "awardedPoints", "errorType", "reviewedAt"], field);
    requireText(review.slotId, `${field}.slotId`, /^slot-bdg-g6-[a-z]+-[a-z]-\d{2}$/);
    const binding = bindingsBySlot.get(review.slotId);
    if (!binding || binding.scoringMode !== "teacher") fail(`${field}.slotId is not a teacher-scored Grade 6 slot`);
    requireText(review.reviewId, `${field}.reviewId`, /^grd-bdg-[a-z0-9]{16}$/);
    if (!["pending", "completed"].includes(review.status)) fail(`${field}.status is invalid`);
    if (review.status === "completed") {
      if (typeof review.awardedPoints !== "number" || !Number.isFinite(review.awardedPoints) ||
          review.awardedPoints < 0 || review.awardedPoints > binding.maxPoints) {
        fail(`${field}.awardedPoints is invalid`);
      }
      if (review.errorType != null && !SCORING_ERROR_TYPES.includes(review.errorType)) fail(`${field}.errorType is invalid`);
      requireTimestamp(review.reviewedAt, `${field}.reviewedAt`);
    } else if (review.awardedPoints !== null || review.errorType !== null || review.reviewedAt !== null) {
      fail(`${field} pending review cannot contain scoring results`);
    }
    return true;
  }

  function evaluateFinalReportReadiness(form, teacherScoringReviews) {
    validateGrade6FormShape(form);
    assertDenseArray(teacherScoringReviews, "teacherScoringReviews", EXPECTED_TEACHER_SCORED_COUNT);
    if (teacherScoringReviews.length > EXPECTED_TEACHER_SCORED_COUNT) {
      fail(`teacherScoringReviews cannot exceed ${EXPECTED_TEACHER_SCORED_COUNT} entries`);
    }
    const teacherBindings = form.releaseBindings.filter(function (binding) { return binding.scoringMode === "teacher"; });
    if (teacherBindings.length !== EXPECTED_TEACHER_SCORED_COUNT) {
      fail(`form must contain exactly ${EXPECTED_TEACHER_SCORED_COUNT} teacher-scored items`);
    }
    const bindingsBySlot = new Map(teacherBindings.map(function (binding) { return [binding.slotId, binding]; }));
    teacherScoringReviews.forEach(function (review, index) { validateScoringReview(review, bindingsBySlot, index); });
    if (new Set(teacherScoringReviews.map(function (review) { return review.slotId; })).size !== teacherScoringReviews.length) {
      fail("teacherScoringReviews contains duplicate slots");
    }
    if (new Set(teacherScoringReviews.map(function (review) { return review.reviewId; })).size !== teacherScoringReviews.length) {
      fail("teacherScoringReviews contains duplicate review IDs");
    }
    const completedSlots = new Set(teacherScoringReviews.filter(function (review) {
      return review.status === "completed";
    }).map(function (review) { return review.slotId; }));
    const missingSlotIds = teacherBindings.map(function (binding) { return binding.slotId; }).filter(function (slotId) {
      return !completedSlots.has(slotId);
    });
    const eligibleForServerVerification = missingSlotIds.length === 0 && completedSlots.size === EXPECTED_TEACHER_SCORED_COUNT;
    return deepFreeze({
      state: eligibleForServerVerification ? "eligible-for-server-verification" : "locked-awaiting-teacher-scoring",
      eligibleForServerVerification,
      canPublishFinalReport: false,
      authorizationVerified: false,
      requiresDatabaseReload: true,
      requiredTeacherScoredItems: EXPECTED_TEACHER_SCORED_COUNT,
      completedTeacherScoredItems: completedSlots.size,
      missingSlotIds,
      requiresServerAuthorization: true,
      automaticPromotion: false,
      finalDecision: "school-review-required"
    });
  }

  function validateDeliverySource(source, form) {
    validateGrade6FormShape(form);
    assertKnownFields(source, DELIVERY_SOURCE_FIELDS, "deliverySource");
    assertNoPrivateLeak(source, "deliverySource");
    requireText(source.assignmentId, "deliverySource.assignmentId", /^asg-bdg-[a-z0-9]{16}$/);
    requireText(source.attemptId, "deliverySource.attemptId", /^att-bdg-[a-z0-9]{16}$/);
    requireText(source.learnerId, "deliverySource.learnerId", /^lrm-bdg-[a-z0-9]{16}$/);
    requireText(source.schoolId, "deliverySource.schoolId", /^sch-bdg-[a-z0-9]{16}$/);
    if (source.formId !== form.formId) fail("deliverySource.formId does not match the form shape");
    if (!Number.isInteger(source.formVersion) || source.formVersion !== form.formVersion) {
      fail("deliverySource.formVersion does not match the form shape");
    }
    requireText(source.policyId, "deliverySource.policyId", /^pol-bdg-[a-z0-9-]{4,64}$/);
    if (!Number.isInteger(source.policyVersion) || source.policyVersion < 1) {
      fail("deliverySource.policyVersion must be positive");
    }
    if (!ASSIGNMENT_STATES.includes(source.assignmentState)) fail("deliverySource.assignmentState is invalid");
    if (!ATTEMPT_STATES.includes(source.attemptState)) fail("deliverySource.attemptState is invalid");
    assertDenseArray(source.publicItems, "deliverySource.publicItems", EXPECTED_ITEM_COUNT);
    if (source.publicItems.length !== EXPECTED_ITEM_COUNT) fail(`deliverySource.publicItems must contain exactly ${EXPECTED_ITEM_COUNT} items`);
    const bindingsBySlot = new Map(form.releaseBindings.map(function (binding) { return [binding.slotId, binding]; }));
    let totalPublicItemBytes = 0;
    source.publicItems.forEach(function (entry, index) {
      const field = `deliverySource.publicItems[${index}]`;
      assertKnownFields(entry, PUBLIC_ITEM_BINDING_FIELDS, field);
      const binding = bindingsBySlot.get(entry.slotId);
      if (!binding || entry.releaseId !== binding.releaseId) fail(`${field} does not match the form binding`);
      itemContract.validatePublicItem(entry.publicItem);
      const publicItemBytes = utf8ByteLength(JSON.stringify(entry.publicItem));
      if (publicItemBytes > MAX_PUBLIC_ITEM_BYTES) fail(`${field}.publicItem exceeds the ${MAX_PUBLIC_ITEM_BYTES}-byte limit`);
      totalPublicItemBytes += publicItemBytes;
      if (entry.publicItem.itemId !== binding.itemId || entry.publicItem.itemVersion !== binding.itemVersion ||
          entry.publicItem.publicPayloadSha256 !== binding.publicPayloadSha256 ||
          entry.publicItem.visibilityClass !== "authenticated-assessment") {
        fail(`${field}.publicItem does not match the release binding`);
      }
      const assessmentBinding = entry.publicItem.assessmentBinding;
      if (assessmentBinding.blueprintId !== form.planId ||
          assessmentBinding.blueprintVersion !== form.blueprintVersion ||
          assessmentBinding.blueprintContractSha256 !== form.blueprintContractSha256 ||
          assessmentBinding.purpose !== form.purpose || assessmentBinding.slotId !== binding.slotId ||
          assessmentBinding.unitId !== binding.unitId || assessmentBinding.standardRange !== binding.standardRange) {
        fail(`${field}.publicItem.assessmentBinding does not match the exact form slot`);
      }
      ["programId", "targetGrade", "domainId", "clusterId", "skillId", "difficulty", "responseType", "maxPoints"].forEach(function (key) {
        if (entry.publicItem[key] !== binding[key]) fail(`${field}.publicItem.${key} does not match the form binding`);
      });
    });
    if (new Set(source.publicItems.map(function (entry) { return entry.slotId; })).size !== EXPECTED_ITEM_COUNT) {
      fail("deliverySource.publicItems contains duplicate or missing Grade 6 slots");
    }
    if (totalPublicItemBytes > MAX_DELIVERY_ITEMS_BYTES) {
      fail(`deliverySource.publicItems exceed the ${MAX_DELIVERY_ITEMS_BYTES}-byte total limit`);
    }
    return true;
  }

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }
  function clonePublic(value) { return JSON.parse(JSON.stringify(value)); }
  function publicItems(source) {
    return source.publicItems.map(function (entry) {
      return { slotId: entry.slotId, publicItem: clonePublic(entry.publicItem) };
    });
  }

  function validateProjectedItems(items, field) {
    assertDenseArray(items, field, EXPECTED_ITEM_COUNT);
    if (items.length !== EXPECTED_ITEM_COUNT) fail(`${field} must contain exactly ${EXPECTED_ITEM_COUNT} items`);
    const plan = planData.plan;
    const canonicalSlots = new Map(plan.slots.map(function (slot) { return [slot.slotId, slot]; }));
    let totalPublicItemBytes = 0;
    items.forEach(function (entry, index) {
      const itemField = `${field}[${index}]`;
      assertKnownFields(entry, ["slotId", "publicItem"], itemField);
      requireText(entry.slotId, `${itemField}.slotId`, /^slot-bdg-g6-[a-z]+-[a-z]-\d{2}$/);
      itemContract.validatePublicItem(entry.publicItem);
      const slot = canonicalSlots.get(entry.slotId);
      if (!slot) fail(`${itemField}.slotId is not in the canonical Grade 6 plan`);
      const binding = entry.publicItem.assessmentBinding;
      if (entry.publicItem.visibilityClass !== "authenticated-assessment" ||
          entry.publicItem.programId !== plan.programId || entry.publicItem.targetGrade !== plan.targetGrade ||
          binding.blueprintId !== plan.id || binding.blueprintVersion !== plan.blueprintVersion ||
          binding.blueprintContractSha256 !== plan.blueprintContractSha256 || binding.purpose !== plan.purpose ||
          binding.slotId !== slot.slotId || binding.unitId !== slot.unitId || binding.standardRange !== slot.standardRange) {
        fail(`${itemField}.publicItem does not match the canonical Grade 6 blueprint slot`);
      }
      ["clusterId", "skillId", "domainId", "difficulty", "responseType", "maxPoints"].forEach(function (key) {
        if (entry.publicItem[key] !== slot[key]) fail(`${itemField}.publicItem.${key} does not match the canonical Grade 6 slot`);
      });
      const publicItemBytes = utf8ByteLength(JSON.stringify(entry.publicItem));
      if (publicItemBytes > MAX_PUBLIC_ITEM_BYTES) fail(`${itemField}.publicItem exceeds the ${MAX_PUBLIC_ITEM_BYTES}-byte limit`);
      totalPublicItemBytes += publicItemBytes;
    });
    if (new Set(items.map(function (entry) { return entry.slotId; })).size !== EXPECTED_ITEM_COUNT) {
      fail(`${field} contains duplicate slots`);
    }
    if (totalPublicItemBytes > MAX_DELIVERY_ITEMS_BYTES) {
      fail(`${field} exceeds the ${MAX_DELIVERY_ITEMS_BYTES}-byte total limit`);
    }
  }

  function validateStudentDeliveryDtoShape(dto) {
    assertKnownFields(dto, [
      "schemaVersion", "audience", "deliveryRequirement", "authorizationVerified",
      "requiresAuthenticatedServerDelivery", "assignment", "items"
    ], "studentDto");
    assertNoPrivateLeak(dto, "studentDto");
    if (dto.schemaVersion !== SCHEMA_VERSION || dto.audience !== "student" || dto.deliveryRequirement !== "authenticated-owner-only" ||
        dto.authorizationVerified !== false || dto.requiresAuthenticatedServerDelivery !== true) {
      fail("studentDto boundary is invalid");
    }
    assertKnownFields(dto.assignment, [
      "assignmentId", "formId", "formVersion", "attemptId", "assignmentState", "attemptState"
    ], "studentDto.assignment");
    requireText(dto.assignment.assignmentId, "studentDto.assignment.assignmentId", /^asg-bdg-[a-z0-9]{16}$/);
    requireText(dto.assignment.formId, "studentDto.assignment.formId", /^frm-bdg-[a-z0-9]{16}$/);
    if (!Number.isInteger(dto.assignment.formVersion) || dto.assignment.formVersion < 1) {
      fail("studentDto.assignment.formVersion must be positive");
    }
    requireText(dto.assignment.attemptId, "studentDto.assignment.attemptId", /^att-bdg-[a-z0-9]{16}$/);
    if (!ASSIGNMENT_STATES.includes(dto.assignment.assignmentState)) fail("studentDto.assignment.assignmentState is invalid");
    if (!ATTEMPT_STATES.includes(dto.assignment.attemptState)) fail("studentDto.assignment.attemptState is invalid");
    validateProjectedItems(dto.items, "studentDto.items");
    return true;
  }

  function validateTeacherDeliveryDtoShape(dto) {
    assertKnownFields(dto, [
      "schemaVersion", "audience", "deliveryRequirement", "authorizationVerified",
      "requiresAuthenticatedServerDelivery", "assignment", "items"
    ], "teacherDto");
    assertNoPrivateLeak(dto, "teacherDto");
    if (dto.schemaVersion !== SCHEMA_VERSION || dto.audience !== "teacher" || dto.deliveryRequirement !== "authenticated-teacher-scope-only" ||
        dto.authorizationVerified !== false || dto.requiresAuthenticatedServerDelivery !== true) {
      fail("teacherDto boundary is invalid");
    }
    assertKnownFields(dto.assignment, [
      "assignmentId", "formId", "formVersion", "policyId", "policyVersion", "attemptId",
      "learnerId", "schoolId", "assignmentState", "attemptState"
    ], "teacherDto.assignment");
    requireText(dto.assignment.assignmentId, "teacherDto.assignment.assignmentId", /^asg-bdg-[a-z0-9]{16}$/);
    requireText(dto.assignment.formId, "teacherDto.assignment.formId", /^frm-bdg-[a-z0-9]{16}$/);
    if (!Number.isInteger(dto.assignment.formVersion) || dto.assignment.formVersion < 1) {
      fail("teacherDto.assignment.formVersion must be positive");
    }
    requireText(dto.assignment.policyId, "teacherDto.assignment.policyId", /^pol-bdg-[a-z0-9-]{4,64}$/);
    if (!Number.isInteger(dto.assignment.policyVersion) || dto.assignment.policyVersion < 1) {
      fail("teacherDto.assignment.policyVersion must be positive");
    }
    requireText(dto.assignment.attemptId, "teacherDto.assignment.attemptId", /^att-bdg-[a-z0-9]{16}$/);
    requireText(dto.assignment.learnerId, "teacherDto.assignment.learnerId", /^lrm-bdg-[a-z0-9]{16}$/);
    requireText(dto.assignment.schoolId, "teacherDto.assignment.schoolId", /^sch-bdg-[a-z0-9]{16}$/);
    if (!ASSIGNMENT_STATES.includes(dto.assignment.assignmentState)) fail("teacherDto.assignment.assignmentState is invalid");
    if (!ATTEMPT_STATES.includes(dto.assignment.attemptState)) fail("teacherDto.assignment.attemptState is invalid");
    validateProjectedItems(dto.items, "teacherDto.items");
    return true;
  }

  function projectStudentDeliveryDto(source, form, projectionScope) {
    validateDeliverySource(source, form);
    assertKnownFields(projectionScope, ["learnerId", "schoolId"], "studentProjectionScope");
    if (projectionScope.learnerId !== source.learnerId || projectionScope.schoolId !== source.schoolId) {
      fail("student projection scope does not match this assignment");
    }
    const dto = deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "student",
      deliveryRequirement: "authenticated-owner-only",
      authorizationVerified: false,
      requiresAuthenticatedServerDelivery: true,
      assignment: {
        assignmentId: source.assignmentId,
        formId: source.formId,
        formVersion: source.formVersion,
        attemptId: source.attemptId,
        assignmentState: source.assignmentState,
        attemptState: source.attemptState
      },
      items: publicItems(source)
    });
    validateStudentDeliveryDtoShape(dto);
    return dto;
  }

  function projectTeacherDeliveryDto(source, form, projectionScope) {
    validateDeliverySource(source, form);
    assertKnownFields(projectionScope, ["schoolId", "learnerIds"], "teacherProjectionScope");
    if (projectionScope.schoolId !== source.schoolId) fail("teacher projection scope does not match this school");
    assertDenseArray(projectionScope.learnerIds, "teacherProjectionScope.learnerIds", MAX_TEACHER_SCOPE_LEARNERS);
    if (projectionScope.learnerIds.length > MAX_TEACHER_SCOPE_LEARNERS) {
      fail(`teacherProjectionScope.learnerIds cannot exceed ${MAX_TEACHER_SCOPE_LEARNERS} entries`);
    }
    projectionScope.learnerIds.forEach(function (learnerId, index) {
      requireText(learnerId, `teacherProjectionScope.learnerIds[${index}]`, /^lrm-bdg-[a-z0-9]{16}$/);
    });
    if (new Set(projectionScope.learnerIds).size !== projectionScope.learnerIds.length) {
      fail("teacherProjectionScope.learnerIds contains duplicates");
    }
    if (!projectionScope.learnerIds.includes(source.learnerId)) fail("teacher projection scope does not include this learner");
    const dto = deepFreeze({
      schemaVersion: SCHEMA_VERSION,
      audience: "teacher",
      deliveryRequirement: "authenticated-teacher-scope-only",
      authorizationVerified: false,
      requiresAuthenticatedServerDelivery: true,
      assignment: {
        assignmentId: source.assignmentId,
        formId: source.formId,
        formVersion: source.formVersion,
        policyId: source.policyId,
        policyVersion: source.policyVersion,
        attemptId: source.attemptId,
        learnerId: source.learnerId,
        schoolId: source.schoolId,
        assignmentState: source.assignmentState,
        attemptState: source.attemptState
      },
      items: publicItems(source)
    });
    validateTeacherDeliveryDtoShape(dto);
    return dto;
  }

  function schoolReviewDecision() {
    return Object.freeze({ automaticPromotion: false, finalDecision: "school-review-required" });
  }

  return Object.freeze({
    SCHEMA_VERSION,
    EXPECTED_ITEM_COUNT,
    EXPECTED_TEACHER_SCORED_COUNT,
    MAX_RAW_RESPONSE_BYTES,
    MAX_SUBMISSION_RAW_RESPONSE_BYTES,
    MAX_TEACHER_SCOPE_LEARNERS,
    MAX_ARRAY_ENTRIES,
    MAX_PUBLIC_ITEM_BYTES,
    MAX_DELIVERY_ITEMS_BYTES,
    ASSIGNMENT_STATES,
    ATTEMPT_STATES,
    SCORING_ERROR_TYPES,
    validateGrade6FormShape,
    validateStudentSubmissionShape,
    evaluateFinalReportReadiness,
    projectStudentDeliveryDto,
    projectTeacherDeliveryDto,
    validateStudentDeliveryDtoShape,
    validateTeacherDeliveryDtoShape,
    assertNoPrivateLeak,
    schoolReviewDecision
  });
});
