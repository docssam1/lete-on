(function (root, factory) {
  const clusterMap = typeof module === "object" && module.exports
    ? require("./us-k8-cluster-map.js")
    : root.GFIELDUSK8ClusterMap;
  const programContract = typeof module === "object" && module.exports
    ? require("../shared/program-contract.js")
    : root.GFIELDMathContract;
  const api = factory(clusterMap, programContract);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDUSK8ContentRegistry = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (clusterMap, programContract) {
  "use strict";

  if (!clusterMap || !programContract) throw new Error("GFIELD K-8 cluster map and program contract are required");

  const COURSE_ID = "us-core-k8";
  const REGISTRY_VERSION = "gfield-us-k8-content-registry-v1";
  const localized = function (ko, en, zhHans) {
    const value = { ko, en };
    if (zhHans) value["zh-Hans"] = zhHans;
    return Object.freeze(value);
  };
  const slug = function (value) { return String(value).toLowerCase().replace(/\./g, "-"); };

  const course = Object.freeze({
    courseId: COURSE_ID,
    title: localized("미국 K–8 핵심 수학", "US K–8 Core Mathematics", "美国 K–8 核心数学"),
    source: clusterMap.source,
    mappingState: "official-cluster-ids-verified",
    sequenceOwner: "GFIELD",
    publicationState: "metadata-only"
  });

  // These are GFIELD instructional levels, not official standards bands or
  // promotion cut scores. Their language describes the kind of evidence that
  // a future reviewed item must collect; it never changes an item's answer.
  const levels = Object.freeze([
    Object.freeze({
      levelId: "foundation",
      title: localized("준비·기초", "Readiness and Foundations", "准备与基础"),
      evidenceIntent: "prerequisite-and-representation-evidence",
      publicationState: "metadata-only"
    }),
    Object.freeze({
      levelId: "core",
      title: localized("학년 핵심 적용", "Grade-Level Application", "年级核心应用"),
      evidenceIntent: "direct-cluster-application-evidence",
      publicationState: "metadata-only"
    }),
    Object.freeze({
      levelId: "advanced",
      title: localized("다단계 전이", "Multi-Step Transfer", "多步骤迁移"),
      evidenceIntent: "within-grade-multistep-transfer-evidence",
      publicationState: "metadata-only"
    })
  ]);

  const testTypes = Object.freeze([
    Object.freeze({ testType: "guided-practice", audience: "student", signedItemRequired: false }),
    Object.freeze({ testType: "unit-screener", audience: "student", signedItemRequired: true }),
    Object.freeze({ testType: "unit-mastery", audience: "student", signedItemRequired: true }),
    Object.freeze({ testType: "retention-check", audience: "student", signedItemRequired: true }),
    Object.freeze({ testType: "course-placement", audience: "student", signedItemRequired: true, promotionDecisionAllowed: false }),
    Object.freeze({ testType: "competition-benchmark", audience: "student", signedItemRequired: true, sourceProblemPublicationState: "rights-gated" }),
    Object.freeze({ testType: "lesson-planning", audience: "teacher", signedItemRequired: false }),
    Object.freeze({ testType: "assessment-review", audience: "teacher", signedItemRequired: false })
  ]);

  const resourceTypes = Object.freeze([
    "concept-workbook", "guided-practice", "homework", "quiz", "test", "student-report"
  ].map(function (resourceType) {
    return Object.freeze({ resourceType, audience: "student" });
  }).concat([
    "lesson-plan", "answer-key", "solution-guide", "rubric", "assignment-builder", "teacher-report"
  ].map(function (resourceType) {
    return Object.freeze({ resourceType, audience: "teacher" });
  })));

  const units = Object.freeze(clusterMap.clusters.map(function (cluster) {
    return Object.freeze({
      courseId: COURSE_ID,
      unitId: cluster.unitId,
      grade: cluster.grade,
      clusterId: cluster.clusterId,
      domainCode: cluster.domainCode,
      standardRange: cluster.standardRange,
      title: cluster.title,
      officialMappingState: cluster.mappingState,
      instructionalOrderState: "gfield-sequencing-pending-school-pacing",
      publicationState: "metadata-only"
    });
  }));

  // One anchor is deliberately kept per cluster. It gives every diagnostic
  // slot a stable lineage without pretending that a cluster range has already
  // been decomposed into released questions or individual-standard mastery.
  const skills = Object.freeze(units.map(function (unit) {
    return Object.freeze({
      skillId: `skill:${COURSE_ID}:${slug(unit.clusterId)}:anchor`,
      courseId: COURSE_ID,
      unitId: unit.unitId,
      clusterId: unit.clusterId,
      title: unit.title,
      skillScope: "cluster-anchor-not-individual-standard-decomposition",
      standardDecompositionState: "locked-pending-reviewed-skill-breakdown",
      itemReleaseState: "locked-pending-reviewed-item-and-server-signature",
      publicationState: "metadata-only"
    });
  }));

  const unitById = new Map(units.map(function (unit) { return [unit.unitId, unit]; }));
  const skillById = new Map(skills.map(function (skill) { return [skill.skillId, skill]; }));
  const skillByClusterId = new Map(skills.map(function (skill) { return [skill.clusterId, skill]; }));
  const levelById = new Map(levels.map(function (level) { return [level.levelId, level]; }));
  const testTypeById = new Map(testTypes.map(function (testType) { return [testType.testType, testType]; }));
  const resourceTypeById = new Map(resourceTypes.map(function (resourceType) { return [resourceType.resourceType, resourceType]; }));

  function requireText(value, name) {
    if (typeof value !== "string" || !value || value !== value.trim()) throw new Error(`${name} is required`);
    return value;
  }

  function resolveLineage(reference) {
    if (!reference || typeof reference !== "object" || Array.isArray(reference)) throw new Error("content reference must be an object");
    const courseId = requireText(reference.courseId, "courseId");
    const unitId = requireText(reference.unitId, "unitId");
    const skillId = requireText(reference.skillId, "skillId");
    const levelId = requireText(reference.levelId, "levelId");
    const testTypeId = requireText(reference.testType, "testType");
    const resourceTypeId = requireText(reference.resourceType, "resourceType");
    const audience = requireText(reference.audience, "audience");
    if (courseId !== COURSE_ID) throw new Error("courseId is not registered");
    const unit = unitById.get(unitId);
    const skill = skillById.get(skillId);
    const level = levelById.get(levelId);
    const testType = testTypeById.get(testTypeId);
    const resourceType = resourceTypeById.get(resourceTypeId);
    if (!unit || !skill || !level || !testType || !resourceType) throw new Error("content reference has an unregistered identifier");
    if (unit.courseId !== courseId || skill.courseId !== courseId || skill.unitId !== unitId) throw new Error("content reference lineage is mismatched");
    if (testType.audience !== audience || resourceType.audience !== audience) throw new Error("content reference audience is mismatched");
    return Object.freeze({ course, unit, skill, level, testType, resourceType, audience });
  }

  function buildMetadataRecord(reference) {
    const resolved = resolveLineage(reference);
    const record = {
      course: resolved.course.courseId,
      unit: resolved.unit.unitId,
      skill: resolved.skill.skillId,
      level: resolved.level.levelId,
      testType: resolved.testType.testType,
      resourceType: resolved.resourceType.resourceType,
      audience: resolved.audience,
      title: resolved.skill.title,
      sourceRights: { mode: "provenance_review", provenance: `CCSS cluster ${resolved.unit.clusterId}; GFIELD metadata only`, reviewed: false },
      publicationState: "locked-pending-source-rights-and-item-review"
    };
    programContract.validateContentRecord(record);
    return Object.freeze(record);
  }

  function skillIdForCluster(clusterId) {
    const skill = skillByClusterId.get(clusterId);
    if (!skill) throw new Error("clusterId is not registered");
    return skill.skillId;
  }

  return Object.freeze({
    REGISTRY_VERSION,
    COURSE_ID,
    course,
    levels,
    testTypes,
    resourceTypes,
    units,
    skills,
    resolveLineage,
    buildMetadataRecord,
    skillIdForCluster
  });
});
