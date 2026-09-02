(function (root, factory) {
  const clusterMap = typeof module === "object" && module.exports
    ? require("./us-k8-cluster-map.js")
    : root.GFIELDUSK8ClusterMap;
  const clinicPaths = typeof module === "object" && module.exports
    ? require("../learning/clinic-paths.js")
    : root.GFIELDClinicPaths;
  const api = factory(clusterMap, clinicPaths);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDGrade58ReasoningProgression = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (clusterMap, clinicPaths) {
  "use strict";

  if (!clusterMap || !clinicPaths) throw new Error("Grade 5-8 reasoning progression dependencies are required");

  const freeze = Object.freeze;
  const localized = function (ko, en, zhHans) {
    return freeze({ ko: ko, en: en, "zh-Hans": zhHans });
  };

  const dimensions = freeze({
    "representation-shift": freeze({ title: localized("표현 바꾸기", "Representation shift", "表征转换"), intent: "move-among-context-diagram-table-equation" }),
    "constraint-chain": freeze({ title: localized("조건 연결", "Constraint chaining", "条件链"), intent: "coordinate-two-or-more-conditions" }),
    "structure-generalization": freeze({ title: localized("구조·규칙 일반화", "Structure and generalization", "结构与概括"), intent: "identify-invariants-and-generalize" }),
    "spatial-transformation": freeze({ title: localized("공간 변환", "Spatial transformation", "空间变换"), intent: "compose-decompose-transform-and-view" }),
    "proportional-modeling": freeze({ title: localized("비례 모델링", "Proportional modeling", "比例建模"), intent: "reason-with-multiplicative-relationships" }),
    "strategic-enumeration": freeze({ title: localized("전략적 열거", "Strategic enumeration", "策略枚举"), intent: "count-complete-cases-without-duplication" }),
    "proof-explanation": freeze({ title: localized("근거 설명", "Proof and explanation", "论证与解释"), intent: "justify-why-a-method-or-result-holds" }),
    "error-analysis": freeze({ title: localized("오류 분석", "Error analysis", "错误分析"), intent: "locate-and-correct-a-structural-error" }),
    "data-inference": freeze({ title: localized("자료 추론", "Data inference", "数据推断"), intent: "interpret-variation-association-and-chance" })
  });

  // Counts are public-code audit snapshots, not a license to copy source items.
  const sourceSnapshots = freeze([
    freeze({
      sourceProgram: "Geometry",
      sourceRole: "renderer-validator",
      auditedSurface: "point-segment-face models and GW_RENDER",
      reusable: freeze(["computed-svg", "lattice-enumeration", "visibility-validation"]),
      prohibited: freeze(["copying-existing-prompts", "copying-game-progress"]),
      evidenceState: "verified-public-code"
    }),
    freeze({
      sourceProgram: "Number Magic",
      sourceRole: "learning-sequence-taxonomy",
      auditedSurface: "11 tier groups and 170 unit references",
      reusable: freeze(["practice-discover-check-lab-arena-recheck", "prerequisite-sequencing"]),
      prohibited: freeze(["copying-unit-dialogue", "lowering-later-grade-symbols"]),
      evidenceState: "verified-public-code"
    }),
    freeze({
      sourceProgram: "Fields Classic",
      sourceRole: "concept-invariant-taxonomy",
      auditedSurface: "65 concept definitions and 71 source-linked lessons",
      reusable: freeze(["concept-family", "invariant", "representation-kind", "misconception-taxonomy"]),
      prohibited: freeze(["copying-private-originals", "copying-answer-assets", "releasing-pending-items"]),
      evidenceState: "verified-public-safe-metadata"
    }),
    freeze({
      sourceProgram: "HSMIDDLE",
      sourceRole: "response-and-validation-taxonomy",
      auditedSurface: "40 types and 302 indexed items; 300 verified and 2 conflict records",
      reusable: freeze(["response-contract", "learner-fit", "validation-axes", "difficulty-structure"]),
      prohibited: freeze(["copying-item-records", "promoting-conflict-records", "copying-answers"]),
      evidenceState: "verified-public-code-with-conflicts-retained"
    }),
    freeze({
      sourceProgram: "Hwangso middle-high",
      sourceRole: "bank-and-release-contract",
      auditedSurface: "shared IDs, four practice stages, three difficulty bands, release gates",
      reusable: freeze(["original-twin-similar-retention-stages", "lowered-standard-raised-bands", "release-gates"]),
      prohibited: freeze(["copying-private-index", "copying-access-data", "auto-assembling-pending-items"]),
      evidenceState: "verified-public-schema"
    })
  ]);

  const domainDimensions = freeze({
    OA: freeze(["representation-shift", "structure-generalization", "proof-explanation"]),
    NBT: freeze(["error-analysis", "constraint-chain", "representation-shift"]),
    NF: freeze(["proportional-modeling", "representation-shift", "proof-explanation"]),
    MD: freeze(["proportional-modeling", "representation-shift", "data-inference"]),
    G: freeze(["spatial-transformation", "proof-explanation", "representation-shift"]),
    RP: freeze(["proportional-modeling", "representation-shift", "proof-explanation"]),
    NS: freeze(["error-analysis", "constraint-chain", "representation-shift"]),
    EE: freeze(["structure-generalization", "constraint-chain", "representation-shift"]),
    SP: freeze(["data-inference", "proof-explanation", "error-analysis"]),
    F: freeze(["representation-shift", "structure-generalization", "proof-explanation"])
  });

  const gradeSpecs = freeze({
    5: freeze({
      grade: 5,
      learnerStage: "US Grade 5 ages 10-11",
      prerequisites: freeze(["whole-number operations", "fraction equivalence", "basic area models"]),
      reasoningPriorities: freeze(["representation-shift", "structure-generalization", "spatial-transformation", "strategic-enumeration"]),
      competitionBridge: freeze(["SASMO Grade 5", "Math Kangaroo Grade 5-6"]),
      clinicState: "metadata-only"
    }),
    6: freeze({
      grade: 6,
      learnerStage: "US Grade 6 ages 11-12",
      prerequisites: freeze(["fraction operations", "decimal operations", "coordinate-plane foundations"]),
      reasoningPriorities: freeze(["proportional-modeling", "constraint-chain", "representation-shift", "proof-explanation"]),
      competitionBridge: freeze(["SASMO Grade 6", "Math Kangaroo Grade 5-6", "AMC 8 기초"]),
      clinicState: "partial-public"
    }),
    7: freeze({
      grade: 7,
      learnerStage: "US Grade 7 ages 12-13",
      prerequisites: freeze(["ratios and rates", "rational-number foundations", "one-variable expressions"]),
      reasoningPriorities: freeze(["proportional-modeling", "constraint-chain", "data-inference", "proof-explanation"]),
      competitionBridge: freeze(["SASMO Grade 7", "Math Kangaroo Grade 7-8", "AMC 8"]),
      clinicState: "metadata-only"
    }),
    8: freeze({
      grade: 8,
      learnerStage: "US Grade 8 ages 13-14",
      prerequisites: freeze(["proportional relationships", "rational-number operations", "angle and area reasoning"]),
      reasoningPriorities: freeze(["structure-generalization", "representation-shift", "spatial-transformation", "proof-explanation"]),
      competitionBridge: freeze(["SASMO Grade 8", "Math Kangaroo Grade 7-8", "AMC 8 → AMC 10 가교"]),
      clinicState: "metadata-only"
    })
  });

  const publicClinicClusters = freeze(Object.keys(clinicPaths.workbookByCluster));

  function unique(values) {
    return values.filter(function (value, index) { return values.indexOf(value) === index; });
  }

  const clusterProfiles = freeze(clusterMap.clusters.filter(function (cluster) {
    return [5, 6, 7, 8].includes(Number(cluster.grade));
  }).map(function (cluster) {
    const grade = Number(cluster.grade);
    const spec = gradeSpecs[grade];
    const domain = domainDimensions[cluster.domainCode] || freeze(["representation-shift", "proof-explanation"]);
    const reasoningTags = freeze(unique(domain.concat(spec.reasoningPriorities)).slice(0, 4));
    const clinicAvailable = publicClinicClusters.includes(cluster.clusterId);
    return freeze({
      clusterId: cluster.clusterId,
      grade: grade,
      domainCode: cluster.domainCode,
      standardRange: cluster.standardRange,
      learnerStage: spec.learnerStage,
      learnerFitCriteria: freeze({
        language: "grade-appropriate-mathematical-language",
        representations: "context-diagram-table-expression-as-required",
        prerequisites: spec.prerequisites,
        "reasoning-load": "within-grade-core-to-multistep-transfer",
        "response-mode": "declared-per-item-not-assumed-single-value"
      }),
      reasoningTags: reasoningTags,
      schoolCoreState: "official-cluster-structure",
      clinicState: clinicAvailable ? "public-clinic" : "metadata-only",
      competitionBridgeState: "pathway-metadata",
      answerContract: "declared-per-item",
      provenanceStatus: "cross-program-taxonomy-only",
      releaseStatus: clinicAvailable ? "published-clinic-metadata" : "locked-pending-reviewed-content"
    });
  }));

  const byCluster = new Map(clusterProfiles.map(function (profile) { return [profile.clusterId, profile]; }));

  const gradeProfiles = freeze(Object.keys(gradeSpecs).map(function (key) {
    const spec = gradeSpecs[key];
    const clusters = freeze(clusterProfiles.filter(function (profile) { return profile.grade === spec.grade; }));
    return freeze({
      grade: spec.grade,
      learnerStage: spec.learnerStage,
      prerequisites: spec.prerequisites,
      reasoningPriorities: spec.reasoningPriorities,
      competitionBridge: spec.competitionBridge,
      schoolClusterCount: clusters.length,
      publicClinicCount: clusters.filter(function (profile) { return profile.clinicState === "public-clinic"; }).length,
      clinicState: spec.clinicState,
      clusterIds: freeze(clusters.map(function (profile) { return profile.clusterId; }))
    });
  }));

  function forGrade(grade) {
    return gradeProfiles.find(function (profile) { return profile.grade === Number(grade); }) || null;
  }

  function forCluster(clusterId) {
    return byCluster.get(String(clusterId || "")) || null;
  }

  function validate() {
    if (clusterProfiles.length !== 41) throw new Error("Grade 5-8 cluster coverage must remain 41");
    if (byCluster.size !== clusterProfiles.length) throw new Error("Grade 5-8 cluster IDs must be unique");
    gradeProfiles.forEach(function (profile) {
      if (!profile.learnerStage || !profile.schoolClusterCount || !profile.reasoningPriorities.length) throw new Error("Grade profile is incomplete");
    });
    clusterProfiles.forEach(function (profile) {
      if (profile.reasoningTags.length < 2 || profile.reasoningTags.some(function (tag) { return !dimensions[tag]; })) throw new Error("Cluster reasoning tags are invalid");
      ["language", "representations", "prerequisites", "reasoning-load", "response-mode"].forEach(function (key) {
        if (!profile.learnerFitCriteria[key]) throw new Error("learner-fit criteria are incomplete");
      });
    });
    if (forGrade(6).publicClinicCount !== publicClinicClusters.length) throw new Error("Grade 6 public clinic count is stale");
    const serialized = JSON.stringify({ sourceSnapshots: sourceSnapshots, clusterProfiles: clusterProfiles });
    if (/[A-Z]:\\|\/home\/|canonicalAnswer|studentName|accessCode|token/i.test(serialized)) throw new Error("Public reasoning metadata contains a protected field or path");
    return freeze({ valid: true, gradeCount: gradeProfiles.length, clusterCount: clusterProfiles.length, publicClinicCount: publicClinicClusters.length });
  }

  validate();

  return freeze({
    schemaVersion: "gfield-grade5-8-reasoning-progression-v1",
    dimensions: dimensions,
    sourceSnapshots: sourceSnapshots,
    gradeProfiles: gradeProfiles,
    clusterProfiles: clusterProfiles,
    forGrade: forGrade,
    forCluster: forCluster,
    validate: validate
  });
});
