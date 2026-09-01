(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDSASMOProgramArchitecture = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const LAST_VERIFIED = "2026-08-28";
  const LEVEL_IDS = Object.freeze(["K2", "G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"]);
  const AXIS_IDS = Object.freeze([
    "number-operations",
    "patterns-algebra",
    "geometry-spatial",
    "combinatorics-logic",
    "data-probability",
    "problem-solving-strategies"
  ]);
  const GOAL_IDS = Object.freeze(["first-attempt", "skill-growth", "award-target", "amc-bridge"]);
  const MODE_IDS = Object.freeze([
    "placement_screener",
    "skill_diagnostic",
    "guided_practice",
    "timed_mini_test",
    "full_mock",
    "error_review",
    "retention_check"
  ]);
  const ROLE_IDS = Object.freeze(["student", "teacher"]);
  const SOURCE_STATUS_IDS = Object.freeze([
    "gfield_original",
    "official_public_link_only",
    "official_private_reference",
    "third_party_index_only",
    "not_publishable"
  ]);
  const RIGHTS_STATUS_IDS = Object.freeze([
    "gfield_owned",
    "permission_required",
    "metadata_and_links_only",
    "private_reference_only",
    "not_cleared"
  ]);
  const VERIFICATION_STATE_IDS = Object.freeze([
    "draft",
    "source_verified",
    "content_validated",
    "rights_reviewed",
    "release_approved",
    "locked"
  ]);
  const WORKFLOW_IDS = Object.freeze([
    "level",
    "goal",
    "diagnostic",
    "prescription",
    "practice",
    "timed-check",
    "review"
  ]);

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
    Object.keys(value).forEach(function (key) { deepFreeze(value[key]); });
    return Object.freeze(value);
  }

  function listToMap(entries) {
    return entries.reduce(function (map, entry) {
      map[entry.id] = entry;
      return map;
    }, {});
  }

  const levels = LEVEL_IDS.map(function (id, index) {
    return {
      id,
      order: index,
      label: id === "K2" ? "K2" : "Grade " + id.slice(1),
      officialFormatId: id === "K2" ? "current-k2" : "current-g1-g12",
      isGfieldCurriculumLevel: true
    };
  });

  const gradeBands = [
    { id: "K2", label: "K2", levelIds: ["K2"] },
    { id: "G1-2", label: "Grades 1–2", levelIds: ["G1", "G2"] },
    { id: "G3-4", label: "Grades 3–4", levelIds: ["G3", "G4"] },
    { id: "G5-6", label: "Grades 5–6", levelIds: ["G5", "G6"] },
    { id: "G7-8", label: "Grades 7–8", levelIds: ["G7", "G8"] },
    { id: "G9-10", label: "Grades 9–10", levelIds: ["G9", "G10"] },
    { id: "G11-12", label: "Grades 11–12", levelIds: ["G11", "G12"] }
  ];

  const axes = [
    { id: "number-operations", label: "Number & Operations", shortLabel: "Number", diagnosticFocus: "quantity sense, accuracy, and efficient calculation" },
    { id: "patterns-algebra", label: "Patterns & Algebra", shortLabel: "Patterns", diagnosticFocus: "relationships, rules, and symbolic reasoning" },
    { id: "geometry-spatial", label: "Geometry & Spatial", shortLabel: "Geometry", diagnosticFocus: "shape, measurement, and visual reasoning" },
    { id: "combinatorics-logic", label: "Combinatorics & Logic", shortLabel: "Logic", diagnosticFocus: "organized counting and constrained reasoning" },
    { id: "data-probability", label: "Data & Probability", shortLabel: "Data", diagnosticFocus: "information interpretation and uncertainty" },
    { id: "problem-solving-strategies", label: "Problem-Solving Strategies", shortLabel: "Strategy", diagnosticFocus: "representation, planning, and verification" }
  ];

  const goals = [
    { id: "first-attempt", label: "First attempt", recommendedDiagnosticMode: "placement_screener", outcome: "Choose a starting band and establish a safe pacing baseline." },
    { id: "skill-growth", label: "Skill growth", recommendedDiagnosticMode: "skill_diagnostic", outcome: "Prioritize the smallest set of skill gaps that limits progress." },
    { id: "award-target", label: "Award target", recommendedDiagnosticMode: "skill_diagnostic", outcome: "Build accuracy, strategy choice, and timed resilience for an individual target." },
    { id: "amc-bridge", label: "AMC bridge", recommendedDiagnosticMode: "skill_diagnostic", outcome: "Document contest-readiness foundations before moving to the AMC pathway." }
  ];

  const workflow = [
    { id: "level", label: "Select level", requiredInput: "levelId", output: "official format and GFIELD band" },
    { id: "goal", label: "Select goal", requiredInput: "goalId", output: "diagnostic purpose" },
    { id: "diagnostic", label: "Diagnose", requiredInput: "response evidence", output: "axis-by-axis profile" },
    { id: "prescription", label: "Prescribe", requiredInput: "axis profile", output: "prioritized practice plan" },
    { id: "practice", label: "Practice", requiredInput: "assigned plan", output: "mastery evidence" },
    { id: "timed-check", label: "Timed check", requiredInput: "timed responses", output: "pace and accuracy evidence" },
    { id: "review", label: "Review", requiredInput: "attempt history", output: "error pattern and next action" }
  ];

  const modes = [
    { id: "placement_screener", audience: ["student", "teacher"], purpose: "starting-band guidance; not an official contest score" },
    { id: "skill_diagnostic", audience: ["student", "teacher"], purpose: "axis and strategy evidence for a learning prescription" },
    { id: "guided_practice", audience: ["student", "teacher"], purpose: "untimed learning with feedback" },
    { id: "timed_mini_test", audience: ["student", "teacher"], purpose: "short, timed pacing check" },
    { id: "full_mock", audience: ["student", "teacher"], purpose: "GFIELD-authored simulation; never presented as an official paper" },
    { id: "error_review", audience: ["student", "teacher"], purpose: "classify mistakes and choose a repair action" },
    { id: "retention_check", audience: ["student", "teacher"], purpose: "confirm that repaired skills remain stable over time" }
  ];

  const roles = [
    { id: "student", permissions: ["select-level", "complete-diagnostic", "view-prescription", "practice", "review-own-work"] },
    { id: "teacher", permissions: ["assign-plan", "view-class-evidence", "adjust-priority", "review-errors", "approve-release"] }
  ];

  const sourceStatuses = [
    { id: "gfield_original", publicDelivery: "eligible-after-release-approval", description: "Independently authored GFIELD material." },
    { id: "official_public_link_only", publicDelivery: "external-official-link", description: "Organizer material reached only through the organizer's public page." },
    { id: "official_private_reference", publicDelivery: "not-public", description: "Private reference evidence; no public copy or excerpt." },
    { id: "third_party_index_only", publicDelivery: "external-index-link", description: "Third-party index may be cited, but it is not a redistribution license." },
    { id: "not_publishable", publicDelivery: "blocked", description: "Do not release until rights and verification conditions change." }
  ];

  const rightsStatuses = [
    { id: "gfield_owned", publicUse: "release-eligible-after-verification" },
    { id: "permission_required", publicUse: "do-not-copy-or-translate-without-permission" },
    { id: "metadata_and_links_only", publicUse: "describe-and-link-only" },
    { id: "private_reference_only", publicUse: "private-evidence-only" },
    { id: "not_cleared", publicUse: "blocked" }
  ];

  const verificationStates = [
    { id: "draft", publicRelease: false },
    { id: "source_verified", publicRelease: false },
    { id: "content_validated", publicRelease: false },
    { id: "rights_reviewed", publicRelease: false },
    { id: "release_approved", publicRelease: true },
    { id: "locked", publicRelease: false }
  ];

  const officialFormats = [
    {
      id: "current-k2",
      levelIds: ["K2"],
      questionCount: 15,
      durationMinutes: 60,
      formatScope: "current-official-format",
      sourceCitationIds: ["sasmo-organizer-current", "sasmo-organizer-registration"]
    },
    {
      id: "current-g1-g12",
      levelIds: ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10", "G11", "G12"],
      questionCount: 25,
      durationMinutes: 90,
      formatScope: "current-official-format",
      sourceCitationIds: ["sasmo-organizer-current", "sasmo-organizer-registration"]
    }
  ];

  const sources = [
    {
      id: "sasmo-organizer-current",
      authority: "Singapore and Asian Schools Math Olympiad",
      url: "https://sasmo.simcc.org/",
      sourceStatus: "official_public_link_only",
      rightsStatus: "metadata_and_links_only",
      verificationState: "source_verified",
      historical: false,
      note: "Current official organizer landing page; GFIELD does not republish organizer problem content.",
      lastVerified: LAST_VERIFIED
    },
    {
      id: "sasmo-organizer-registration",
      authority: "Singapore and Asian Schools Math Olympiad",
      url: "https://sasmo.simcc.org/register/",
      sourceStatus: "official_public_link_only",
      rightsStatus: "metadata_and_links_only",
      verificationState: "source_verified",
      historical: false,
      note: "Official registration path; eligibility and event administration remain organizer-controlled.",
      lastVerified: LAST_VERIFIED
    },
    {
      id: "sasmo-official-historical-reference",
      authority: "Singapore and Asian Schools Math Olympiad",
      sourceStatus: "official_private_reference",
      rightsStatus: "private_reference_only",
      verificationState: "rights_reviewed",
      historical: true,
      note: "Historical records support internal comparison only. Current format is not inferred from historical paper groupings.",
      lastVerified: LAST_VERIFIED
    },
    {
      id: "sasmo-third-party-index",
      authority: "K12 Math Contests",
      url: "https://www.k12mathcontests.com/contest/sasmo",
      sourceStatus: "third_party_index_only",
      rightsStatus: "not_cleared",
      verificationState: "rights_reviewed",
      historical: true,
      note: "Third-party index is evidence of historical availability, not permission to republish, translate, or extract problems.",
      lastVerified: LAST_VERIFIED
    },
    {
      id: "gfield-sasmo-authored-material",
      authority: "GFIELD",
      sourceStatus: "gfield_original",
      rightsStatus: "gfield_owned",
      verificationState: "draft",
      historical: false,
      note: "Only independently authored, separately verified material can enter a GFIELD practice or mock release.",
      lastVerified: LAST_VERIFIED
    }
  ];

  const architecture = {
    schemaVersion: "1.0.0",
    programId: "sasmo-k2-12-readiness",
    title: "GFIELD SASMO Readiness Architecture",
    lastVerified: LAST_VERIFIED,
    officialEligibilityAndFormat: {
      owner: "Singapore and Asian Schools Math Olympiad",
      levels: LEVEL_IDS,
      currentFormatOnly: true,
      formatDisclaimer: "Official eligibility, dates, registration, and current format are controlled by the organizer and must be checked at the official source.",
      sources: ["sasmo-organizer-current", "sasmo-organizer-registration"]
    },
    gfieldAuthoredCurriculum: {
      isOfficialCurriculum: false,
      purpose: "Use learner evidence to select a level-appropriate practice plan, then improve accuracy, reasoning, and pacing.",
      axes: AXIS_IDS,
      workflow: WORKFLOW_IDS
    },
    historicalThirdPartyArchive: {
      isOfficialCurrentFormat: false,
      purpose: "Historical comparison and source verification only.",
      sourceStatus: "third_party_index_only",
      rightsStatus: "not_cleared",
      publicDelivery: "external-index-link-only"
    },
    levels,
    gradeBands,
    axes,
    goals,
    workflow,
    modes,
    roles,
    sourceStatuses,
    rightsStatuses,
    verificationStates,
    officialFormats,
    sources
  };

  function findById(entries, id) {
    return entries.find(function (entry) { return entry.id === id; }) || null;
  }

  function normalizeLevelId(levelId) {
    const value = String(levelId || "").trim().toUpperCase();
    if (value === "K2") return value;
    const match = /^G?(1[0-2]|[1-9])$/.exec(value);
    return match ? "G" + match[1] : null;
  }

  function getLevel(levelId) {
    return findById(architecture.levels, normalizeLevelId(levelId));
  }

  function getGradeBand(levelId) {
    const normalized = normalizeLevelId(levelId);
    return architecture.gradeBands.find(function (band) { return band.levelIds.includes(normalized); }) || null;
  }

  function getOfficialFormat(levelId) {
    const normalized = normalizeLevelId(levelId);
    return architecture.officialFormats.find(function (format) { return format.levelIds.includes(normalized); }) || null;
  }

  function validateStudentRoute(route) {
    const candidate = route || {};
    const errors = [];
    const levelId = normalizeLevelId(candidate.levelId);
    if (!levelId) errors.push("levelId must be one of K2 or G1 through G12.");
    if (!GOAL_IDS.includes(candidate.goalId)) errors.push("goalId is not supported.");
    if (candidate.modeId && !MODE_IDS.includes(candidate.modeId)) errors.push("modeId is not supported.");
    if (candidate.roleId && !ROLE_IDS.includes(candidate.roleId)) errors.push("roleId is not supported.");
    if (candidate.modeId && candidate.roleId) {
      const mode = findById(architecture.modes, candidate.modeId);
      if (mode && !mode.audience.includes(candidate.roleId)) errors.push("roleId cannot use modeId.");
    }
    return deepFreeze({
      valid: errors.length === 0,
      errors,
      route: errors.length === 0 ? {
        levelId,
        goalId: candidate.goalId,
        modeId: candidate.modeId || findById(architecture.goals, candidate.goalId).recommendedDiagnosticMode,
        roleId: candidate.roleId || "student",
        gradeBandId: getGradeBand(levelId).id,
        officialFormatId: getOfficialFormat(levelId).id
      } : null
    });
  }

  function validateArchitecture(candidate) {
    const data = candidate || architecture;
    const errors = [];
    const hasExactIds = function (entries, expected) {
      const actual = entries.map(function (entry) { return entry.id; });
      return actual.length === expected.length && expected.every(function (id) { return actual.includes(id); });
    };
    if (!hasExactIds(data.levels || [], LEVEL_IDS)) errors.push("levels must cover K2 and G1 through G12 exactly once.");
    if (!hasExactIds(data.axes || [], AXIS_IDS)) errors.push("axes must contain the six required readiness axes.");
    if (!hasExactIds(data.goals || [], GOAL_IDS)) errors.push("goals must contain the four supported learner goals.");
    if (!hasExactIds(data.modes || [], MODE_IDS)) errors.push("modes must contain the seven supported learning modes.");
    if (!hasExactIds(data.roles || [], ROLE_IDS)) errors.push("roles must contain student and teacher only.");
    if (!hasExactIds(data.sourceStatuses || [], SOURCE_STATUS_IDS)) errors.push("source statuses are incomplete.");
    if (!hasExactIds(data.rightsStatuses || [], RIGHTS_STATUS_IDS)) errors.push("rights statuses are incomplete.");
    if (!hasExactIds(data.verificationStates || [], VERIFICATION_STATE_IDS)) errors.push("verification states are incomplete.");
    if (!hasExactIds(data.workflow || [], WORKFLOW_IDS)) errors.push("workflow must preserve the level-to-review sequence.");
    const k2 = (data.officialFormats || []).find(function (format) { return format.id === "current-k2"; });
    const grades = (data.officialFormats || []).find(function (format) { return format.id === "current-g1-g12"; });
    if (!k2 || k2.questionCount !== 15 || k2.durationMinutes !== 60 || !k2.levelIds || k2.levelIds.length !== 1 || k2.levelIds[0] !== "K2") {
      errors.push("current K2 format must remain 15 questions in 60 minutes.");
    }
    if (!grades || grades.questionCount !== 25 || grades.durationMinutes !== 90 || !grades.levelIds || grades.levelIds.length !== 12 || grades.levelIds.includes("K2")) {
      errors.push("current G1-G12 format must remain 25 questions in 90 minutes.");
    }
    if (!data.officialEligibilityAndFormat || data.officialEligibilityAndFormat.currentFormatOnly !== true) errors.push("official current format must remain distinct from historical records.");
    if (!data.gfieldAuthoredCurriculum || data.gfieldAuthoredCurriculum.isOfficialCurriculum !== false) errors.push("GFIELD curriculum must not be presented as official SASMO curriculum.");
    if (!data.historicalThirdPartyArchive || data.historicalThirdPartyArchive.isOfficialCurrentFormat !== false) errors.push("third-party historical archive must not be presented as current official format.");
    return deepFreeze({ valid: errors.length === 0, errors });
  }

  function assertArchitecture(candidate) {
    const result = validateArchitecture(candidate);
    if (!result.valid) throw new Error("Invalid SASMO program architecture: " + result.errors.join(" "));
    return true;
  }

  function validatePublicSafety(candidate) {
    const data = candidate || architecture;
    const text = JSON.stringify(data);
    const errors = [];
    if (/https?:[^\"\s]+\.pdf(?:[\"\s]|$)/i.test(text)) errors.push("Public architecture cannot include PDF URLs.");
    if (/\b(questionText|questionContent|officialProblem|answerKey|workedSolution)\b/i.test(text)) errors.push("Public architecture cannot include contest question content or solution fields.");
    const sourceRows = data.sources || [];
    sourceRows.forEach(function (row) {
      if (row.sourceStatus === "third_party_index_only" && row.rightsStatus !== "not_cleared") errors.push("Third-party index material must remain not cleared for republication.");
      if (row.sourceStatus === "official_private_reference" && row.rightsStatus !== "private_reference_only") errors.push("Official private references must remain private-only.");
    });
    return deepFreeze({ valid: errors.length === 0, errors });
  }

  const levelMap = listToMap(levels);
  const api = {
    schemaVersion: "1.0.0",
    lastVerified: LAST_VERIFIED,
    LEVEL_IDS,
    AXIS_IDS,
    GOAL_IDS,
    MODE_IDS,
    ROLE_IDS,
    SOURCE_STATUS_IDS,
    RIGHTS_STATUS_IDS,
    VERIFICATION_STATE_IDS,
    WORKFLOW_IDS,
    architecture,
    levelMap,
    normalizeLevelId,
    getLevel,
    getGradeBand,
    getOfficialFormat,
    validateStudentRoute,
    validateArchitecture,
    assertArchitecture,
    validatePublicSafety
  };

  assertArchitecture(architecture);
  if (!validatePublicSafety(architecture).valid) throw new Error("SASMO program architecture is not public-safe.");
  return deepFreeze(api);
});
