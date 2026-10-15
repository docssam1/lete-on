(() => {
  "use strict";
  const api = window.HSE_GENERATORS, presentation = window.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION;
  if (!api || !presentation || typeof api.generatorKey !== "function" || typeof api.generate !== "function" || !Array.isArray(api.names))
    throw new Error("T-pattern example-2 presentation and generators must load first");
  const id = "6-2-u3-e2-example-2", key = "sourceGrade6SecondSpaceE2TPatternCount";
  const keys = Object.freeze({ [id]: key }), previousKey = api.generatorKey, previousGenerate = api.generate;
  const owned = type => type?.sourceItemId === id || type?.generatorKey === key;
  const matches = type => type !== null && typeof type === "object" && !Array.isArray(type) &&
    Object.hasOwn(type, "sourceItemId") && Object.hasOwn(type, "generatorKey") && type.sourceItemId === id && type.generatorKey === key;
  api.generatorKey = function (type) {
    return matches(type) ? type.reviewLocked ? "" : key : owned(type) ? "" : previousKey.apply(this, arguments);
  };
  api.generate = function (type, rank, offset, seed, variant) {
    if (!matches(type)) return owned(type) ? null : previousGenerate.apply(this, arguments);
    if (type.reviewLocked) return null;
    if (offset === undefined) offset = 0;
    if (variant === undefined) variant = 0;
    if (![-1, 0, 1].includes(offset) || !Number.isSafeInteger(variant) || variant < 0)
      throw new RangeError("Invalid T-pattern example-2 difficulty or variant");
    const pool = variant % 3, level = offset + 1, q = presentation.render(id, pool, level);
    const images = typeof q.prompt === "string" ? [...q.prompt.matchAll(/<img\b[^>]*>/gi)] : [];
    if (q.layerCue !== null || images.length !== 1 ||
        !images[0][0].includes('src="./assets/source-6-2-t-pattern-example2/prefix-given.png"') ||
        /<(?:table|svg)\b|math-inline-expression|data-source-answer-layer|source62-t-pattern-answer/i.test(q.prompt)) return null;
    if (q.sourceItemId !== id || q.variant !== pool || q.level !== level || q.sourceConditionsClarified !== true ||
        q.requestedAnswerUnique !== true || q.originalAnswerDeterminate !== false || q.originalSourceReleaseStatus !== "locked" ||
        q.sourceExact !== false || q.registrationOnly !== true || q.learnerReleaseVerified !== false ||
        q.publisherAnswerVerified !== false || q.handwrittenAnswerVerified !== false || q.officialHumanApproval !== false ||
        q.constructionConditionApproved !== false) return null;
    return { ...q, answerVisual: `<div data-print-weight="regular3">${q.answerVisual}</div>`, generator: key, levelRank: rank,
      generationMode: "fixed-verified-pool", verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedPoolIndex: pool, verifiedVariantId: `${id}:v${pool}`,
      difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, sourceDifficultyRank: 1,
      answerPageLayout: "two-column", variantProvenance: pool === 0 && level === 1 ? "source-conditions-clarified" : "source-conditions-clarified-variant",
      sourceConditionProvenance: "explicit-learner-given-conditions", sourceExact: false,
      officialAnswerVerified: false, registrationOnly: true, learnerReleaseVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false };
  };
  if (!api.names.includes(key)) api.names.push(key);
  window.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_QUESTIONS = Object.freeze({ keys, registrationOnly: true, learnerReleaseVerified: false });
})();
