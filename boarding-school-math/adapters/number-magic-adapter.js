(function (root, factory) {
  const contract = typeof module === "object" && module.exports
    ? require("../shared/program-contract.js")
    : root.GFIELDMathContract;
  const api = factory(contract);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDNumberMagicAdapter = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (contract) {
  "use strict";

  if (!contract) throw new Error("GFIELDMathContract is required");

  function localized(source, field) {
    if (!source || !source.ko || !source.en) throw new Error(`${field} must include ko and en`);
    return Object.freeze({ ko: source.ko, en: source.en, "zh-Hans": source.zh || source["zh-Hans"] });
  }

  function validateLegacyThread(id, thread, allIds) {
    if (!/^[A-Z]{2}\d+$/.test(id)) throw new Error(`invalid Number Magic thread id: ${id}`);
    if (!thread || !thread.gen || !Array.isArray(thread.levels) || !thread.levels.length) {
      throw new Error(`${id} is missing generator or level data`);
    }
    localized(thread.name, `${id}.name`);
    thread.prereq.forEach(function (prerequisite) {
      if (!allIds.has(prerequisite)) throw new Error(`${id} has unknown prerequisite ${prerequisite}`);
    });
    const levelIds = thread.levels.map(function (level) { return level.id; });
    if (new Set(levelIds).size !== levelIds.length) throw new Error(`${id} has duplicate level ids`);
  }

  function buildCourseMemberships(courseSpec) {
    const memberships = new Map();
    (courseSpec || []).forEach(function (course) {
      (course.drills || []).forEach(function (threadId) {
        if (!memberships.has(threadId)) memberships.set(threadId, []);
        memberships.get(threadId).push(`C${course.id}`);
      });
      (course.magic || []).flat().forEach(function (itemId) {
        if (/^[A-Z]{2}\d+$/.test(itemId)) {
          if (!memberships.has(itemId)) memberships.set(itemId, []);
          memberships.get(itemId).push(`C${course.id}`);
        }
      });
    });
    memberships.forEach(function (values, key) {
      memberships.set(key, Object.freeze(Array.from(new Set(values))));
    });
    return memberships;
  }

  function adapt(threads, courseSpec) {
    if (!threads || typeof threads !== "object") throw new Error("Number Magic threads are required");
    const ids = Object.keys(threads);
    const idSet = new Set(ids);
    const memberships = buildCourseMemberships(courseSpec);
    const threadRows = [];
    const contentRecords = [];

    ids.forEach(function (id) {
      const thread = threads[id];
      validateLegacyThread(id, thread, idSet);
      const mappingState = thread.unit ? "unit-linked" : thread.concept ? "concept-only" : "needs-unit-mapping";
      const unit = thread.unit || "legacy-thread-registry";
      const title = localized(thread.name, `${id}.name`);
      threadRows.push(Object.freeze({
        legacyThreadId: id,
        generatorKey: thread.gen,
        unit,
        mappingState,
        prerequisiteIds: Object.freeze(thread.prereq.slice()),
        legacyCourseIds: memberships.get(id) || Object.freeze([]),
        levelCount: thread.levels.length,
        standardsReview: "pending"
      }));

      thread.levels.forEach(function (level) {
        const record = {
          course: "number-magic",
          unit,
          skill: `number-magic:${id.toLowerCase()}`,
          level: String(level.id),
          testType: "practice",
          resourceType: "guided-practice",
          audience: "student",
          title,
          publicationState: "locked",
          sourceRights: {
            mode: "provenance_review",
            provenance: `number_magic/data/threads.js#${id}`,
            reviewed: false
          },
          legacy: {
            threadId: id,
            generatorKey: thread.gen,
            levelLabel: localized(level.label, `${id}.levels.${level.id}.label`),
            params: Object.freeze(Object.assign({}, level.params)),
            courseIds: memberships.get(id) || Object.freeze([])
          },
          standards: [],
          standardsReview: "pending",
          mappingState
        };
        contract.validateContentRecord(record);
        contentRecords.push(Object.freeze(record));
      });
    });

    return Object.freeze({
      source: "number_magic/data/threads.js",
      threadRows: Object.freeze(threadRows),
      contentRecords: Object.freeze(contentRecords),
      summary: Object.freeze({
        threads: threadRows.length,
        levels: contentRecords.length,
        unitLinked: threadRows.filter(function (row) { return row.mappingState === "unit-linked"; }).length,
        conceptOnly: threadRows.filter(function (row) { return row.mappingState === "concept-only"; }).length,
        needsUnitMapping: threadRows.filter(function (row) { return row.mappingState === "needs-unit-mapping"; }).length,
        standardsPending: threadRows.length,
        publishable: contentRecords.filter(contract.canPublishContent).length
      })
    });
  }

  return Object.freeze({ adapt, buildCourseMemberships });
});
